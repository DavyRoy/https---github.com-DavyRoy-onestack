// src/app/demo/manager/payments/data/mockPayments.ts

// ─── Типы ──────────────────────────────────────────────

export type Payment = {
  id: string;
  createdAt: string;
  orderId?: string;
  client?: string;
  email?: string;
  amount: number;
  currency: "RUB" | "USD" | "KRW";
  method: "card" | "invoice" | "cash" | "bank";
  status:
    | "authorized"
    | "captured"
    | "paid"
    | "failed"
    | "refunded"
    | "cancelled";
  channel?: "online" | "manager";
  fee?: number;
  linkedInvoiceId?: string;
};

export type Invoice = {
  id: string;
  createdAt: string;
  dueAt: string;
  orderId?: string;
  client: string;
  email?: string;
  currency: "RUB" | "USD" | "KRW";
  items: { id: string; title: string; qty: number; price: number }[];
  total: number;
  status: "draft" | "sent" | "viewed" | "paid" | "void";
};

// ─── Seed-данные (демонстрационные) ─────────────────────

export const SEED_PAYMENTS: Payment[] = [
  {
    id: "P-20251002-101",
    createdAt: "2025-10-02T09:15:00.000Z",
    orderId: "ORD-00123",
    client: "Иван Петров",
    email: "ivan@example.com",
    amount: 12_900,
    currency: "RUB",
    method: "card",
    status: "paid",
    channel: "online",
    fee: 0,
  },
  {
    id: "P-20251002-102",
    createdAt: "2025-10-02T10:40:00.000Z",
    orderId: "ORD-00124",
    client: 'ООО «Бьюти»',
    email: "corp@example.com",
    amount: 54_200,
    currency: "RUB",
    method: "invoice",
    status: "captured",
    channel: "manager",
    fee: 0,
  },
];

export const SEED_INVOICES: Invoice[] = [
  {
    id: "INV-20251002-007",
    createdAt: "2025-10-02T08:20:00.000Z",
    dueAt: "2025-10-09T08:20:00.000Z",
    orderId: "ORD-00124",
    client: 'ООО «Бьюти»',
    email: "corp@example.com",
    currency: "RUB",
    items: [
      { id: "i1", title: "Комплект косметики", qty: 1, price: 42_000 },
      { id: "i2", title: "Доставка", qty: 1, price: 1_200 },
    ],
    total: 43_200,
    status: "sent",
  },
];