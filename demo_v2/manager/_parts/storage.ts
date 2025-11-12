"use client";

/** Ключи localStorage, которые уже использует пользовательская часть */
export const LS_ORDERS = "demo_orders_v1";
export const LS_BOOKINGS = "booking_reservations_v1";

/** ===== Типы (синхронизированы с демо-пользователем) ===== */
export type SnapshotItem = { id: string; title: string; price: number; qty: number };

export type OrderSnapshot = {
  id: string;
  createdAt: string;
  items: SnapshotItem[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  payment: "card" | "apple" | "gpay" | "gift" | "invoice";
  deliveryMethod: "courier" | "pickup";
  name: string;
  email: string;
  phone: string;
  address?: string;
  status: "paid" | "awaiting_payment";
};

export type Booking = {
  id: string;
  cat: "restaurant" | "concert" | "theatre";
  title: string;
  subtitle: string;
  details: string;
  dateISO: string; // YYYY-MM-DD
  time: string;    // HH:mm
  price: number;
  prepay: number;
};

/** ===== Безопасное чтение из LS ===== */
export function readOrders(): OrderSnapshot[] {
  try {
    const raw = localStorage.getItem(LS_ORDERS);
    const arr = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) return [];
    return arr as OrderSnapshot[];
  } catch {
    return [];
  }
}

export function readBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(LS_BOOKINGS);
    const arr = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) return [];
    return arr as Booking[];
  } catch {
    return [];
  }
}

/** Утилита форматирования */
export const fmtRUB = (n: number) => n.toLocaleString("ru-RU");

/**
 * Подписка на изменения localStorage.
 * Вызывает cb() при:
 *  - window "storage" (другая вкладка)
 *  - нашем кастомном событии window.dispatchEvent(new CustomEvent("ls:update"))
 */
export function subscribeLS(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === LS_ORDERS || e.key === LS_BOOKINGS || e.key === null) cb();
  };
  const onCustom = () => cb();
  window.addEventListener("storage", onStorage);
  window.addEventListener("ls:update", onCustom as any);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("ls:update", onCustom as any);
  };
}

/** Хелпер, чтобы вручную триггерить обновление из кода после записи LS */
export function notifyLSUpdate() {
  window.dispatchEvent(new CustomEvent("ls:update"));
}