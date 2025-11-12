// src/app/lib/demo/store.ts
import { DEMO_EVENTS, DEMO_KEYS, DEMO_ORDERS, DEMO_ROLES, DEMO_USERS } from "./seed";
import type { ApiKey, AuditEvent, Order, RoleMatrix, User } from "./types";

/**
 * Простой in-memory storage через globalThis — только для dev/демо.
 * На продакшене хранить в БД/Redis/и т.п.
 */

const DEMO_NS = "__ONESTACK_DEMO__" as const;
const EVENTS_MAX = 500;

type Space = {
  __DEMO_USERS__: User[];
  __DEMO_ROLES__: RoleMatrix | null;
  __DEMO_ORDERS__: Order[];
  __DEMO_KEYS__: ApiKey[];
  __DEMO_EVENTS__: AuditEvent[];
};

// Ленивая инициализация неймспейса
function ensureSpace(): Space {
  const g = globalThis as Record<string, unknown>;
  if (!g[DEMO_NS] || typeof g[DEMO_NS] !== "object") {
    g[DEMO_NS] = Object.create(null);
  }
  const ns = g[DEMO_NS] as Partial<Space>;

  // Подливаем сиды один раз (или если кто-то прибил стор во время HMR)
  if (!Array.isArray(ns.__DEMO_USERS__))  ns.__DEMO_USERS__  = structuredClone(DEMO_USERS);
  if (!ns.__DEMO_ROLES__)                 ns.__DEMO_ROLES__  = structuredClone(DEMO_ROLES);
  if (!Array.isArray(ns.__DEMO_ORDERS__)) ns.__DEMO_ORDERS__ = structuredClone(DEMO_ORDERS);
  if (!Array.isArray(ns.__DEMO_KEYS__))   ns.__DEMO_KEYS__   = structuredClone(DEMO_KEYS);
  if (!Array.isArray(ns.__DEMO_EVENTS__)) ns.__DEMO_EVENTS__ = structuredClone(DEMO_EVENTS);

  return ns as Space;
}
const space = ensureSpace();

// Хелпер доступа (коротко)
function ns(): Space {
  return space;
}

/* ====================== Users ====================== */
export function listUsers(): User[] {
  return ns().__DEMO_USERS__;
}

export function addUser(u: Omit<User, "id">): User {
  const id = "u_" + Math.random().toString(36).slice(2, 7);
  const user: User = { id, ...u };
  ns().__DEMO_USERS__.push(user);
  return user;
}

export function updateUser(id: string, patch: Partial<Omit<User, "id">>): User | null {
  const arr = ns().__DEMO_USERS__;
  const idx = arr.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  arr[idx] = { ...arr[idx], ...patch };
  return arr[idx];
}

export function removeUser(id: string): boolean {
  const arr = ns().__DEMO_USERS__;
  const idx = arr.findIndex((x) => x.id === id);
  if (idx === -1) return false;
  arr.splice(idx, 1);
  return true;
}

/* ====================== Roles ====================== */
export function getRoleMatrix(): RoleMatrix | null {
  return ns().__DEMO_ROLES__ ?? null;
}
export function setRoleMatrix(matrix: RoleMatrix | null) {
  ns().__DEMO_ROLES__ = matrix;
}

/* ====================== Orders ====================== */
export function listOrders(): Order[] {
  return ns().__DEMO_ORDERS__;
}

export function findOrder(id: string): Order | null {
  return ns().__DEMO_ORDERS__.find(o => o.id === id) ?? null;
}

export function addOrder(o: Omit<Order, "id"> & { id?: string }): Order {
  const id = o.id ?? "ORD-" + Math.floor(Math.random() * 9000 + 1000);
  const order: Order = { id, ...o };
  ns().__DEMO_ORDERS__.unshift(order);
  return order;
}

export function updateOrder(id: string, patch: Partial<Omit<Order, "id">>): Order | null {
  const arr = ns().__DEMO_ORDERS__;
  const i = arr.findIndex(o => o.id === id);
  if (i === -1) return null;
  arr[i] = { ...arr[i], ...patch };
  return arr[i];
}

/** Обновить статус заказа (удобно для демо-экрана заказов) */
export function updateOrderStatus(id: string, status: Order["status"]): Order | null {
  return updateOrder(id, { status });
}

export function removeOrder(id: string): boolean {
  const arr = ns().__DEMO_ORDERS__;
  const i = arr.findIndex(o => o.id === id);
  if (i === -1) return false;
  arr.splice(i, 1);
  return true;
}

/* ====================== API Keys ====================== */
export function listApiKeys(): ApiKey[] {
  return ns().__DEMO_KEYS__;
}

export function createApiKey(name: string, active: boolean): ApiKey {
  const id = "k_" + Math.random().toString(36).slice(2, 7);
  const masked = "sk_live_****" + Math.random().toString(16).slice(2, 6);
  const key: ApiKey = { id, name: name || "key", masked, createdAt: "сейчас", active: !!active };
  ns().__DEMO_KEYS__.push(key);
  return key;
}

export function disableApiKey(id: string): boolean {
  const arr = ns().__DEMO_KEYS__;
  const idx = arr.findIndex((x) => x.id === id);
  if (idx === -1) return false;
  arr[idx] = { ...arr[idx], active: false };
  return true;
}

export function rotateApiKey(id: string): boolean {
  const arr = ns().__DEMO_KEYS__;
  const idx = arr.findIndex((x) => x.id === id);
  if (idx === -1) return false;
  arr[idx] = { ...arr[idx], masked: "sk_live_****" + Math.random().toString(16).slice(2, 6) };
  return true;
}

/* ====================== Events/Audit ====================== */
export function listEvents(): AuditEvent[] {
  return ns().__DEMO_EVENTS__;
}

export function addEvent(e: AuditEvent) {
  const arr = ns().__DEMO_EVENTS__;
  arr.unshift(e);
  if (arr.length > EVENTS_MAX) arr.length = EVENTS_MAX;
}

/* ====================== Dev helpers ====================== */
export function resetDemoData() {
  const s = ns();
  s.__DEMO_USERS__  = structuredClone(DEMO_USERS);
  s.__DEMO_ROLES__  = structuredClone(DEMO_ROLES);
  s.__DEMO_ORDERS__ = structuredClone(DEMO_ORDERS);
  s.__DEMO_KEYS__   = structuredClone(DEMO_KEYS);
  s.__DEMO_EVENTS__ = structuredClone(DEMO_EVENTS);
}

export function isDemoStoreReady(): boolean {
  const s = ns();
  return !!(s.__DEMO_USERS__ && s.__DEMO_ROLES__ && s.__DEMO_ORDERS__ && s.__DEMO_KEYS__ && s.__DEMO_EVENTS__);
}