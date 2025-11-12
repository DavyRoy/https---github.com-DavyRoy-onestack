export type FeeCell = {
  method: "card" | "invoice" | "cash" | "bank";
  currency: "RUB" | "KRW" | "USD";
  location?: string; // demo
  percent: number;
  fixed: number; // minor currency unit условно — тут просто целое
  min: number;
  cap: number;
};

export const ADMIN_FEES_MATRIX: FeeCell[] = [
  { method: "card", currency: "RUB", percent: 2.2, fixed: 0, min: 0, cap: 0 },
  { method: "card", currency: "KRW", percent: 2.0, fixed: 0, min: 0, cap: 0 },
  { method: "card", currency: "USD", percent: 2.5, fixed: 0, min: 0, cap: 0 },
  { method: "invoice", currency: "RUB", percent: 0.8, fixed: 15, min: 0, cap: 0 },
  { method: "cash", currency: "RUB", percent: 0, fixed: 0, min: 0, cap: 0 },
  { method: "bank", currency: "RUB", percent: 0.5, fixed: 10, min: 0, cap: 0 },
];

export const ADMIN_FEES_PLANS = [
  { id: "plan_default", name: "Базовый план", active: true, updatedAt: "2025-10-06" },
  { id: "plan_promo_q4", name: "Q4 Promotion", active: false, updatedAt: "2025-09-28" },
];