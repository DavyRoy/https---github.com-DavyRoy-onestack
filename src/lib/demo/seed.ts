// src/app/lib/demo/seed.ts
import type { Order, User, RoleMatrix, AuditEvent, ApiKey } from "./types";

/** ───────── Users ───────── */
export const DEMO_USERS: User[] = [
  { id: "u_1", email: "ivan@onestack24.ru",   name: "Иван Петров",    role: "admin",   active: true },
  { id: "u_2", email: "olga@onestack24.ru",   name: "Ольга Смирнова", role: "manager", active: true },
  { id: "u_3", email: "andrey@onestack24.ru", name: "Андрей Кузнецов", role: "user",    active: true },
] as const;

/** ───────── RBAC Matrix ───────── */
export const DEMO_ROLES: RoleMatrix = {
  admin: {
    "users.read": true, "users.write": true, "users.delete": true,
    "orders.read": true, "orders.write": true,
    "reports.view": true, "reports.export": true,
    "settings.read": true, "settings.write": true,
  },
  manager: {
    "users.read": true, "users.write": true, "users.delete": false,
    "orders.read": true, "orders.write": true,
    "reports.view": true, "reports.export": true,
    "settings.read": true, "settings.write": false,
  },
  user: {
    "users.read": false, "users.write": false, "users.delete": false,
    "orders.read": true, "orders.write": false,
    "reports.view": true, "reports.export": false,
    "settings.read": false, "settings.write": false,
  },
} as const;

/**
 * ВАЖНО: статусы приведены к UI-энуму приложения
 * "Новый" | "Ждёт действий" | "В работе" | "Готово" | "Отменён"
 *
 * Поля выровнены под компоненты:
 * - title — используется на всех экранах
 * - updated/created — человекочитаемые строки для демо
 * - owner, address, items — опциональные, где нужно в UI
 */
export const DEMO_ORDERS: Order[] = [
  {
    id: "ORD-2001",
    title: "iPhone 15 Pro",
    status: "Новый",
    created: "сегодня",
    updated: "сегодня",
    total: "189 990 ₽",
    address: "Москва, ул. Пример, д. 1",
    items: [
      { title: "iPhone 15 Pro 256GB", qty: 1, price: "169 990 ₽" },
      { title: "Кабель USB-C",        qty: 1, price: "1 990 ₽" },
      { title: "Доставка курьером",   qty: 1, price: "18 990 ₽" },
    ],
  },
  {
    id: "ORD-1999",
    title: "MacBook Air M3",
    status: "Готово",
    created: "3 дн. назад",
    updated: "3 дн. назад",
    total: "149 990 ₽",
    owner: "Ольга",
    items: [{ title: "MacBook Air 13” M3 16/512", qty: 1, price: "149 990 ₽" }],
  },
  {
    id: "ORD-1996",
    title: "Подписка Pro",
    status: "В работе",
    created: "вчера",
    updated: "вчера",
    total: "4 990 ₽",
    owner: "Иван",
    items: [{ title: "Подписка Pro, 12 мес.", qty: 1, price: "4 990 ₽" }],
  },
  {
    id: "ORD-1994",
    title: "Импорт CSV",
    status: "Ждёт действий",
    created: "2 дн. назад",
    updated: "2 дн. назад",
    total: "—",
    items: [{ title: "Импорт 50 000 строк", qty: 1, price: "—" }],
  },
  {
    id: "ORD-1992",
    title: "Сброс 2FA",
    status: "Отменён",
    created: "неделю назад",
    updated: "неделю назад",
    total: "—",
    items: [{ title: "Операция отклонена пользователем", qty: 1, price: "—" }],
  },
] as const;

/** ───────── API Keys ───────── */
export const DEMO_KEYS: ApiKey[] = [
  { id: "k_1", name: "dashboard",    masked: "sk_live_****8f3a", createdAt: "сегодня", active: true },
  { id: "k_2", name: "integrations", masked: "sk_live_****b12c", createdAt: "вчера",   active: true },
] as const;

/** ───────── Audit Events ───────── */
export const DEMO_EVENTS: AuditEvent[] = [
  { id: "ev_201", type: "auth",   actor: "ivan@onestack24.ru",   action: "Логин успешен",             ts: "сегодня 12:10" },
  { id: "ev_202", type: "key",    actor: "admin@onestack24.ru",  action: "Создан API-ключ dashboard", ts: "сегодня 11:55" },
  { id: "ev_203", type: "role",   actor: "admin@onestack24.ru",  action: "Назначена роль manager",    ts: "вчера 19:24" },
  { id: "ev_204", type: "policy", actor: "admin@onestack24.ru",  action: "Включена 2FA для всех",     ts: "вчера 09:02" },
  { id: "ev_205", type: "auth",   actor: "olga@onestack24.ru",   action: "SSO вход (SAML)",           ts: "2 дня назад" },
] as const;

/** ───────── Helpers for UI (необязательно, но удобно) ───────── */
// Открытые статусы = требуют внимания в дашборде
export const OPEN_STATUSES: Order["status"][] = ["В работе", "Ждёт действий"];

/** Возвращает заказы, которые считаем «открытыми» */
export function getOpenOrders(orders: Order[] = DEMO_ORDERS): Order[] {
  return orders.filter(o => OPEN_STATUSES.includes(o.status));
}

/** Простейший пример «счета к оплате»: берём любые заказы с ценой ≠ "—" и статусом не "Готово/Отменён" */
export function getInvoicesToPay(orders: Order[] = DEMO_ORDERS): { count: number; example?: Order } {
  const candidates = orders.filter(o => o.total && o.total !== "—" && o.status !== "Готово" && o.status !== "Отменён");
  return { count: candidates.length, example: candidates[0] };
}