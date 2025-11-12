// app/demo/store/userStore.ts
"use client";

import { createStore } from "zustand/vanilla";
import { useStore as useZustandStore } from "zustand";

/* ─────────────────────────── Types ─────────────────────────── */
type Notification = {
  id: string;
  title: string;
  body?: string;
  href?: string;
  read?: boolean;
  createdAt?: number;
};

type Prefs = { name?: string; email?: string; avatarDataUrl?: string };
type Profile = { name?: string };

export type CartItem = {
  id: string;
  title: string;
  price: number; // raw number
  qty: number;
  image?: string;
  attributes?: Record<string, string>;
};

type State = {
  __version: number;
  notifications: Notification[];
  prefs: Prefs;
  profile: Profile;
  cart: Record<string, CartItem>;
};

type Actions = {
  addNotification: (n: Omit<Notification, "id" | "createdAt"> & { id?: string }) => void;
  clearNotifications: () => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  setPrefs: (p: Partial<Prefs>) => void;
  setProfile: (p: Partial<Profile>) => void;

  addToCart: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;

  reset: () => void;
};

export type UserStore = State & Actions;

/* ─────────────────────────── Constants ─────────────────────────── */
const STORAGE_KEY = "ones-user-store";
const SCHEMA_VERSION = 2;

/* ─────────────────────────── Init ─────────────────────────── */
function initState(): State {
  return {
    __version: SCHEMA_VERSION,
    notifications: [],
    prefs: {},
    profile: {},
    cart: {},
  };
}

/* ─────────────────────────── Store ─────────────────────────── */
export const userStore = createStore<UserStore>((set, get) => ({
  ...initState(),

  // notifications / profile
  addNotification: (n) =>
    set((s) => ({
      notifications: [
        {
          id: n.id ?? cryptoRandomId(),
          createdAt: Date.now(),
          read: false,
          title: n.title,
          body: n.body,
          href: n.href,
        },
        ...s.notifications,
      ].slice(0, 50),
    })),
  clearNotifications: () => set(() => ({ notifications: [] })),
  markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => (n.read ? n : { ...n, read: true })) })),
  markRead: (id) => set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  setPrefs: (p) => set((s) => ({ prefs: { ...s.prefs, ...p } })),
  setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),

  // cart
  addToCart: (item) =>
    set((s) => {
      const { id, qty = 1, ...rest } = item;
      if (!id) return {};
      const prev = s.cart[id];
      const nextQty = clampInt((prev?.qty ?? 0) + qty, 1, 9999);
      return {
        cart: {
          ...s.cart,
          [id]: {
            id,
            title: coalesce(rest.title, prev?.title, "")!,
            price: toMoney(rest.price ?? prev?.price ?? 0),
            qty: nextQty,
            image: coalesce(rest.image, prev?.image),
            attributes: { ...(prev?.attributes ?? {}), ...(rest.attributes ?? {}) },
          },
        },
      };
    }),
  removeFromCart: (id) =>
    set((s) => {
      if (!s.cart[id]) return {};
      const next = { ...s.cart };
      delete next[id];
      return { cart: next };
    }),
  setQty: (id, qty) =>
    set((s) => {
      const item = s.cart[id];
      if (!item) return {};
      const n = clampInt(qty, 0, 9999);
      if (n <= 0) {
        const next = { ...s.cart };
        delete next[id];
        return { cart: next };
      }
      return { cart: { ...s.cart, [id]: { ...item, qty: n } } };
    }),
  clearCart: () => set(() => ({ cart: {} })),

  reset: () => set(() => initState()),
}));

/* ─────────────────────────── Persistence (browser only) ─────────────────────────── */
if (typeof window !== "undefined") {
  try {
    // load
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = safeParse(raw);
      const migrated = migrate(parsed);
      userStore.setState(sanitizeHydration(migrated, initState()));
    }

    // subscribe
    let prev = pickPersistSlice(userStore.getState());
    userStore.subscribe((s) => {
      const slice = pickPersistSlice(s);
      if (!objectShallowEqual(slice, prev)) {
        prev = slice;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slice));
      }
    });
  } catch {
    /* noop */
  }
}

/* ─────────────────────────── SSR snapshot cache ─────────────────────────── */
/**
 * На сервере React вызывает "server snapshot" несколько раз.
 * Мы фиксируем один immutable-snapshot и кешируем результат СЕЛЕКТОРА
 * по строке функции (selector.toString()), чтобы даже инлайновые селекторы
 * возвращали один и тот же объект/ссылку между вызовами.
 */
const SERVER_SNAPSHOT: Readonly<UserStore> =
  typeof window === "undefined" ? Object.freeze(userStore.getState()) : (undefined as any);

const serverSelectorCache = new Map<string, unknown>();

function getServerSelected<T>(selector: (s: UserStore) => T): T {
  const key = selector.toString();
  if (serverSelectorCache.has(key)) {
    return serverSelectorCache.get(key) as T;
  }
  const val = selector(SERVER_SNAPSHOT);
  serverSelectorCache.set(key, val);
  return val;
}

/* ─────────────────────────── Hooks ─────────────────────────── */
export function useUserStore<T>(selector: (s: UserStore) => T): T {
  if (typeof window === "undefined") {
    // SSR: стабильно кешируем результат
    return getServerSelected(selector);
  }
  return useZustandStore(userStore, selector);
}

export function useUserStoreEq<T>(
  selector: (s: UserStore) => T,
  equalityFn: (a: T, b: T) => boolean = objectShallowEqual
): T {
  if (typeof window === "undefined") {
    return getServerSelected(selector);
  }
  return useZustandStore(userStore, selector, equalityFn as any);
}

/* ─────────────────────────── Selectors (computed) ─────────────────────────── */
export const selectCartItems = (s: UserStore) => Object.values(s.cart);
export const selectCartCount = (s: UserStore) => selectCartItems(s).reduce((a, i) => a + i.qty, 0);
export const selectCartTotal = (s: UserStore) =>
  toMoney(selectCartItems(s).reduce((a, i) => a + i.price * i.qty, 0));
export const selectUnreadCount = (s: UserStore) =>
  s.notifications.reduce((acc, n) => acc + (n.read ? 0 : 1), 0);

/* ─────────────────────────── Utils ─────────────────────────── */
function toMoney(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return Math.round(v * 100) / 100;
}
function clampInt(v: number, min: number, max: number) {
  const n = Math.floor(Number.isFinite(v) ? v : 0);
  return Math.min(max, Math.max(min, n));
}
function coalesce<T>(...vals: (T | undefined)[]) {
  for (const v of vals) if (v !== undefined) return v as T;
  return undefined as T;
}
function cryptoRandomId() {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

/* ── persistence helpers ── */
function pickPersistSlice(s: UserStore) {
  return {
    __version: s.__version,
    notifications: s.notifications,
    prefs: s.prefs,
    profile: s.profile,
    cart: s.cart,
  };
}
function safeParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
function migrate(data: any): State {
  const base = initState();
  const v = typeof data?.__version === "number" ? data.__version : 1;
  if (v < 2) {
    // трансформации старых схем → v2 (при необходимости)
  }
  return {
    __version: SCHEMA_VERSION,
    notifications: Array.isArray(data?.notifications) ? data.notifications : base.notifications,
    prefs: isObj(data?.prefs) ? data.prefs : base.prefs,
    profile: isObj(data?.profile) ? data.profile : base.profile,
    cart: isObj(data?.cart) ? data.cart : base.cart,
  };
}
function sanitizeHydration(parsed: State, fallback: State): State {
  return {
    __version: SCHEMA_VERSION,
    notifications: Array.isArray(parsed.notifications) ? parsed.notifications : fallback.notifications,
    prefs: isObj(parsed.prefs) ? parsed.prefs : fallback.prefs,
    profile: isObj(parsed.profile) ? parsed.profile : fallback.profile,
    cart: isObj(parsed.cart) ? parsed.cart : fallback.cart,
  };
}
function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}
function objectShallowEqual<T extends Record<string, any>>(a: T, b: T) {
  if (a === b) return true;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const k of aKeys) if (a[k] !== (b as any)[k]) return false;
  return true;
}