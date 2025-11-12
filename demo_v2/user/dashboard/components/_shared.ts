// src/app/demo/user/dashboard/components/_shared.ts
import { useId, type Ref as ReactRef } from "react";

/* ========================================================================== *
 *  Utility: class names
 * ========================================================================== */

type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[]
  | { [klass: string]: boolean | null | undefined };

function _push(out: string[], v: ClassValue) {
  if (!v) return;
  if (typeof v === "string" || typeof v === "number") {
    const s = String(v).trim();
    if (s) out.push(s);
    return;
  }
  if (Array.isArray(v)) {
    for (const x of v) _push(out, x);
    return;
  }
  if (typeof v === "object") {
    for (const k in v) {
      if (Object.prototype.hasOwnProperty.call(v, k) && (v as any)[k]) {
        const s = String(k).trim();
        if (s) out.push(s);
      }
    }
  }
}

// Универсальный склеиватель классов
export function cn(...parts: Array<ClassValue>) {
  const out: string[] = [];
  for (const p of parts) _push(out, p);
  return out.join(" ");
}

/* ========================================================================== *
 *  Accessibility / Focus tokens
 * ========================================================================== */

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30";
export const FOCUS_RING_OFFSET =
  "focus-visible:ring-offset-2 focus-visible:ring-offset-[#050911]";

export const PRESSABLE = cn(
  "transition-all active:scale-[0.98]",
  FOCUS_RING,
  FOCUS_RING_OFFSET
);

/* ========================================================================== *
 *  Typography & text tokens
 * ========================================================================== */

export const TITLE_ID = "section-title";

export const TITLE_SM =
  "text-sm font-semibold tracking-tight text-[rgba(255,255,255,0.92)]";
export const SUBTITLE_SM = "text-xs leading-5 text-[rgba(236,240,255,0.64)]";

export const MUTED = "text-[rgba(236,240,255,0.64)]";
export const DIM = "text-[rgba(236,240,255,0.48)]";

/* ========================================================================== *
 *  Surfaces / cards
 * ========================================================================== */

export const SECTION_WRAP =
  "admin-section rounded-2xl border border-white/12 bg-white/8";
export const CARD_BASE =
  "rounded-2xl border border-white/12 bg-white/8 shadow-soft";

export const CARD = cn(
  CARD_BASE,
  "flex flex-col gap-3 p-4 backdrop-blur transition-all hover:border-white/16 hover:shadow-lg"
);

export const CARD_SOFT =
  "rounded-2xl border border-white/10 bg-white/6 p-3 flex flex-col gap-2 backdrop-blur transition-all hover:border-white/15 hover:bg-white/8";

export const DASHBOARD_CARD = cn(
  "admin-glass rounded-2xl border border-white/12 bg-white/8 p-4",
  "flex flex-col gap-3 backdrop-blur",
  "transition-all hover:border-white/16 hover:bg-white/10"
);

export const DASHBOARD_CARD_SOFT =
  "rounded-2xl border border-white/10 bg-white/6 p-3 flex flex-col gap-2 backdrop-blur-sm";

export const ROW = cn(
  "relative flex items-center gap-3 rounded-2xl border border-white/12 bg-white/6 px-3 py-2",
  "transition-all hover:border-white/18 hover:bg-white/10",
  FOCUS_RING,
  FOCUS_RING_OFFSET
);

/* ========================================================================== *
 *  Links / badges / chips
 * ========================================================================== */

export const LINK = cn(
  "inline-flex items-center gap-1.5 text-sm font-medium text-[rgba(236,240,255,0.64)] transition-all hover:text-[rgba(255,255,255,0.92)] rounded-lg px-1.5 py-1 -mx-1.5",
  FOCUS_RING
);

export const CHIP =
  "inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs ring-1 ring-inset";

export const BADGE =
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset";

export const BADGE_NEUTRAL =
  "inline-flex items-center gap-1 rounded-full border border-white/14 bg-white/8 px-2 py-0.5 text-xs font-semibold text-[rgba(236,240,255,0.64)]";

export const EYEBROW =
  "text-xs uppercase tracking-[0.2em] text-[rgba(236,240,255,0.48)]";
export const TITLE =
  "text-base font-semibold leading-tight text-[rgba(255,255,255,0.92)]";

export const CLAMP_2 = "line-clamp-2";
export const NO_OVERFLOW_INLINE = "overflow-x-clip";

export const TAPPABLE = PRESSABLE;

/* ========================================================================== *
 *  Buttons
 * ========================================================================== */

export const BTN_PRIMARY = cn(
  "inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-neutral-900",
  "shadow-lg transition-all hover:bg-white/90 hover:scale-105 active:scale-95 disabled:opacity-60",
  FOCUS_RING,
  FOCUS_RING_OFFSET
);

export const BTN_GHOST = cn(
  "inline-flex items-center gap-2 rounded-xl border border-white/14 bg-white/8 px-3 py-2 text-sm font-medium text-[rgba(236,240,255,0.64)] transition-all hover:bg-white/12 hover:text-[rgba(255,255,255,0.92)] active:scale-95",
  FOCUS_RING,
  FOCUS_RING_OFFSET
);

/* ========================================================================== *
 *  Layout helpers (новые: мобильная адаптация, контейнеры, безопасные отступы)
 * ========================================================================== */

// Обёртка страницы с безопасным нижним отступом под мобильный таббар
export const PAGE_WRAP =
  "admin-page mx-auto w-full max-w-8xl px-4 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+88px)] sm:px-6 lg:px-8";

// Иногда нужен дополнительный спейсер внизу (если таббар рендерится вне страницы)
export const SAFE_BOTTOM_SPACER = "block sm:hidden h-[calc(env(safe-area-inset-bottom,0px)+96px)]";

// Гриды для строк дашборда (сохранены старые токены + добавлены авто-решётки)
export const GRID_ROW_2_1 = "grid gap-3 lg:grid-cols-[2fr_1fr]";
export const GRID_ROW_1_1 = "grid gap-3 lg:grid-cols-[1fr_1fr]";
export const GRID_ROW_12 = "grid gap-3 lg:grid-cols-[1.2fr_1fr]";

// Автосетка карточек (часто для Highlights/виджетов)
export const GRID_AUTO_CARDS =
  "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 sm:gap-3";

// Универсальная сетка содержимого «1 → 2 колонки»
export const GRID_STACK_TO_2 =
  "grid grid-cols-1 gap-4 lg:grid-cols-2";

/* ========================================================================== *
 *  KPI / Skeletons
 * ========================================================================== */

export const KPI_CARD =
  "rounded-2xl border border-white/12 bg-white/8 p-3 text-white transition-all duration-200 ease-out will-change-transform hover:-translate-y-0.5 hover:border-white/16 hover:bg-white/10 hover:shadow-lg";

export const SKELETON = "animate-pulse rounded-md bg-white/10";
export const SKELETON_LINE = "h-3 w-full rounded bg-white/10";
export const SKELETON_CIRCLE = "h-8 w-8 rounded-full bg-white/10";

/* ========================================================================== *
 *  Tones / statuses
 * ========================================================================== */

export function statusTone(status?: string) {
  const s = (status ?? "").toLowerCase().trim();
  if (/(vip|premium|pro|премиум|золот|gold)/.test(s)) {
    return {
      wrap: "border-amber-400/40 bg-amber-400/10",
      icon: "text-amber-300",
      text: "text-amber-200",
      ring: "ring-amber-400/25",
    };
  }
  if (/(silver|сильвер|участник|member|стандарт)/.test(s)) {
    return {
      wrap: "border-sky-400/40 bg-sky-400/10",
      icon: "text-sky-300",
      text: "text-sky-200",
      ring: "ring-sky-400/25",
    };
  }
  return {
    wrap: "border-white/20 bg-white/6",
    icon: "text-[rgba(236,240,255,0.64)]",
    text: "text-[rgba(236,240,255,0.64)]",
    ring: "ring-white/20",
  };
}

export function badgeTone(kind?: string) {
  const k = (kind ?? "").toLowerCase().trim();
  if (/^(paid|оплачен|success|ok|completed|завершен|завершено)$/.test(k))
    return `${BADGE} bg-emerald-400/15 text-emerald-200 ring-emerald-400/25`;
  if (/^(processing|готовим|in.?progress|progress)$/.test(k))
    return `${BADGE} bg-sky-400/15 text-sky-200 ring-sky-400/25`;
  if (/^(shipping|доставка|shipped|on.?the.?way)$/.test(k))
    return `${BADGE} bg-indigo-400/15 text-indigo-200 ring-indigo-400/25`;
  if (/^(awaiting|ожидает|pending|hold|на.?ожидании)$/.test(k))
    return `${BADGE} bg-amber-400/15 text-amber-200 ring-amber-400/25`;
  if (/^(failed|error|declined|ошибка|canceled|cancelled|отменен|отменено)$/.test(k))
    return `${BADGE} bg-rose-400/15 text-rose-200 ring-rose-400/25`;
  return `${BADGE} bg-white/12 text-[rgba(236,240,255,0.64)] ring-white/20`;
}

export function toneForLevel(level?: "info" | "success" | "warning" | "danger" | "neutral") {
  switch (level) {
    case "success":
      return { wrap: "border-emerald-400/30 bg-emerald-400/10", text: "text-emerald-200" };
    case "warning":
      return { wrap: "border-amber-400/30 bg-amber-400/10", text: "text-amber-200" };
    case "danger":
      return { wrap: "border-rose-400/30 bg-rose-400/10", text: "text-rose-200" };
    case "info":
      return { wrap: "border-sky-400/30 bg-sky-400/10", text: "text-sky-200" };
    default:
      return { wrap: "border-white/14 bg-white/6", text: "text-[rgba(236,240,255,0.64)]" };
  }
}

/* ========================================================================== *
 *  Dates / money
 * ========================================================================== */

const RU_WEEKDAYS_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] as const;
const RU_MONTHS_GEN = [
  "января","февраля","марта","апреля","мая","июня",
  "июля","августа","сентября","октября","ноября","декабря",
] as const;

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(d: Date, days: number) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
}

export function timeLabel(hh = 14, mm = 0) {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${pad(hh)}:${pad(mm)}`;
}

export function dayNameShort(d: Date) {
  return RU_WEEKDAYS_SHORT[d.getDay()];
}

export function formatShortDateLabel(d: Date) {
  return `${dayNameShort(d)}, ${d.getDate()} ${RU_MONTHS_GEN[d.getMonth()]}`;
}

export function formatLongDate(d: Date) {
  const WD = [
    "Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота",
  ] as const;
  return `${WD[d.getDay()]}, ${d.getDate()} ${RU_MONTHS_GEN[d.getMonth()]}`;
}

export function weekRangeLabel(anyDay: Date): string {
  const day = anyDay.getDay();
  const mondayShift = day === 0 ? -6 : 1 - day;
  const monday = addDays(anyDay, mondayShift);
  const sunday = addDays(monday, 6);
  const m1 = monday.getMonth();
  const m2 = sunday.getMonth();
  const d1 = monday.getDate();
  const d2 = sunday.getDate();
  if (m1 === m2) return `${d1}—${d2} ${RU_MONTHS_GEN[monday.getMonth()]}`;
  return `${d1} ${RU_MONTHS_GEN[m1]} — ${d2} ${RU_MONTHS_GEN[m2]}`;
}

export function formatMoneyIntl(
  amount: number,
  opts: { currency?: string; locale?: string; minimumFractionDigits?: number } = {}
) {
  const { currency = "RUB", locale = "ru-RU", minimumFractionDigits } = opts;
  try {
    const nf = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits,
    });
    return nf.format(amount);
  } catch {
    return formatMoney(amount, currency === "RUB" ? "₽" : currency);
  }
}

export function formatMoney(n: number, currency = "₽") {
  return `${n.toLocaleString("ru-RU").replace(/\s/g, " ")} ${currency}`;
}

export function formatRelativeDate(date: Date, base = new Date()) {
  const a = new Date(toISODate(base)); // обнулить время
  const b = new Date(toISODate(date));
  const diffDays = Math.round((+b - +a) / 86400000);
  if (diffDays === 0) return "Сегодня";
  if (diffDays === 1) return "Завтра";
  if (diffDays === -1) return "Вчера";
  if (diffDays > 1) return `Через ${diffDays} ${pluralRu(diffDays, "день", "дня", "дней")}`;
  return `${Math.abs(diffDays)} ${pluralRu(Math.abs(diffDays), "день", "дня", "дней")} назад`;
}

export function pluralRu(n: number, one: string, two: string, five: string) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return one;
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return two;
  return five;
}

/* ========================================================================== *
 *  Misc
 * ========================================================================== */

export function safe<T>(value: T | null | undefined, fallback: T): T {
  return value == null ? fallback : value;
}

export function useStableId(prefix = "id") {
  const reactId = useId(); // стабильный для SSR/CSR
  const plain = reactId.replace(/:/g, "");
  return `${prefix}-${plain}`;
}

/**
 * @deprecated Используйте useStableId(). Оставлено для обратной совместимости.
 */
export function makeId(prefix = "id") {
  const r = Math.random().toString(36).slice(2, 7);
  return `${prefix}-${r}`;
}

export const ICON_BTN = cn(
  "inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/8 w-8 h-8 transition-all hover:bg-white/12 hover:border-white/20 active:scale-95",
  FOCUS_RING,
  FOCUS_RING_OFFSET
);
export const ICON_DIM = "text-[rgba(236,240,255,0.64)]";
export const ICON_MUTED = "text-[rgba(236,240,255,0.48)]";

/* ========================================================================== *
 *  Helpers for components
 * ========================================================================== */

export function mergeRefs<T>(...refs: Array<ReactRef<T> | undefined>) {
  return (value: T) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") (ref as (v: T) => void)(value);
      else (ref as any).current = value;
    }
  };
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function range(len: number, start = 0) {
  return Array.from({ length: len }, (_, i) => i + start);
}

export function once<F extends (...args: any[]) => any>(fn: F): F {
  let called = false;
  let res: any;
  return ((...args: any[]) => {
    if (!called) {
      called = true;
      res = fn(...args);
    }
    return res;
  }) as F;
}

export function debounce<F extends (...args: any[]) => void>(fn: F, ms = 200) {
  let t: any;
  return (...args: Parameters<F>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function throttle<F extends (...args: any[]) => void>(fn: F, ms = 200) {
  let last = 0;
  let timer: any;
  return (...args: Parameters<F>) => {
    const now = Date.now();
    const remaining = ms - (now - last);
    if (remaining <= 0) {
      last = now;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn(...args);
      }, remaining);
    }
  };
}

export function invariant(cond: any, message = "Invariant violation") {
  if (!cond) throw new Error(message);
}

/* ========================================================================== *
 *  Design-system extras
 * ========================================================================== */

export const GRADIENT_BLUE_PURPLE = "bg-gradient-to-br from-blue-500 to-purple-600";
export const GRADIENT_GREEN_EMERALD = "bg-gradient-to-br from-green-500 to-emerald-600";
export const GRADIENT_ORANGE_RED = "bg-gradient-to-br from-orange-500 to-red-600";

export const SHADOW_SOFT = "shadow-soft";
export const SHADOW_MEDIUM = "shadow-[0_20px_60px_-40px_rgba(8,12,40,0.7)]";
export const SHADOW_LARGE = "shadow-[0_35px_120px_-60px_rgba(12,20,60,0.95)]";

export const TRANSITION_ALL = "transition-all duration-300 ease-out";
export const TRANSITION_COLORS = "transition-colors duration-200 ease-out";
export const TRANSITION_TRANSFORM = "transition-transform duration-200 ease-out";

export const HOVER_LIFT = "hover:-translate-y-0.5 hover:shadow-lg";
export const ACTIVE_PRESS = "active:scale-95";

/* ========================================================================== *
 *  Примеры использования
 * ========================================================================== *
  import {
    PAGE_WRAP, SAFE_BOTTOM_SPACER, GRID_AUTO_CARDS, GRID_STACK_TO_2,
    TITLE_ID, TITLE_SM, SUBTITLE_SM, SECTION_WRAP, CARD_BASE, cn, badgeTone,
    BTN_PRIMARY, FOCUS_RING, formatMoneyIntl, formatRelativeDate, useStableId
  } from "./_shared";
*/