// src/app/lib/demo/types.ts

/* ====================== Roles & Permissions ====================== */

export type Role = "admin" | "manager" | "user";

export type Permission =
  | "users.read" | "users.write" | "users.delete"
  | "orders.read" | "orders.write"
  | "reports.view" | "reports.export"
  | "settings.read" | "settings.write";

export type RoleMatrix = Record<Role, Record<Permission, boolean>>;

/* ====================== Users ====================== */

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  active: boolean;
};

/* ====================== Orders (DEMO) ====================== */
/** Набор статусов, используемый в демо/UI (бейджи, таблицы, диаграммы) */
export const ORDER_STATUSES = [
  "Новый",
  "Ждёт действий",
  "В работе",
  "Готово",
  "Отменён",
] as const;

export type OrderStatus = typeof ORDER_STATUSES[number];

export type OrderItem = {
  title: string;
  qty: number;
  price: string;
};

export type Order = {
  id: string;
  name: string;
  status: OrderStatus;
  updated: string;   // человекочитаемо для демо (например: "вчера", "2 дн. назад")
  total: string;     // форматированная сумма или "—"
  address?: string;  // адрес доставки (опц.)
  items: OrderItem[]; // позиции заказа
};

/* ====================== API Keys ====================== */

export type ApiKey = {
  id: string;
  name: string;
  masked: string;   // маска вместо секрета
  createdAt: string;
  active: boolean;
};

/* ====================== Audit ====================== */

export type AuditEventType =
  | "auth"
  | "key"
  | "role"
  | "policy"
  | "user";

export type AuditEvent = {
  id: string;
  actor: string;
  action: string;
  ts: string; // человекочитаемый timestamp (демо)
  type: AuditEventType;
};