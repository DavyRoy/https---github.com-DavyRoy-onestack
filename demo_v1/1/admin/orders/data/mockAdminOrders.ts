// app/demo/admin/orders/data/mockAdminOrders.ts
export type AdminOrderItem = { title: string; qty: number; price: number };

export type AdminOrderStatus =
  | "new"
  | "confirmed"
  | "paid"
  | "completed"
  | "cancelled"
  | "refunded";

export type AdminOrder = {
  id: string;
  createdAt: string;  // YYYY-MM-DD HH:mm
  clientId: string;
  client: string;
  email?: string;
  phone?: string;
  amount: number;
  channel: "online" | "manager";
  status: AdminOrderStatus;
  items: AdminOrderItem[];
  paymentId?: string;
  audit: { at: string; user: string; text: string }[];
};

/** Вспомогательная функция */
const sumItems = (items: AdminOrderItem[]) =>
  items.reduce((s, it) => s + it.qty * it.price, 0);

/** Автоматический расчёт суммы */
function makeOrder(
  o: Omit<AdminOrder, "amount"> & Partial<Pick<AdminOrder, "amount">>
): AdminOrder {
  const amount = typeof o.amount === "number" ? o.amount : sumItems(o.items);
  return { ...o, amount };
}

/** Словарь статусов (для бейджей/таблиц/tooltip’ов) */
export const ORDER_STATUS_MAP: Record<
  AdminOrderStatus,
  { label: string; color: string; description: string }
> = {
  new: {
    label: "Новый",
    color: "bg-sky-500/20 text-sky-300 border-sky-400/40",
    description: "Заказ создан, но ещё не подтверждён.",
  },
  confirmed: {
    label: "Подтверждён",
    color: "bg-blue-500/20 text-blue-300 border-blue-400/40",
    description: "Менеджер подтвердил заказ.",
  },
  paid: {
    label: "Оплачен",
    color: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    description: "Оплата получена, можно готовить к отправке.",
  },
  completed: {
    label: "Завершён",
    color: "bg-green-500/20 text-green-300 border-green-400/40",
    description: "Заказ полностью выполнен.",
  },
  cancelled: {
    label: "Отменён",
    color: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    description: "Отменён клиентом или менеджером.",
  },
  refunded: {
    label: "Возврат",
    color: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    description: "Деньги возвращены клиенту.",
  },
};

/** Мок-данные заказов */
export const ADMIN_ORDERS: AdminOrder[] = [
  makeOrder({
    id: "O-240901-001",
    createdAt: "2025-09-01 10:20",
    clientId: "c-101",
    client: "Иван Петров",
    email: "ivan@example.com",
    phone: "+7 900 111-22-33",
    channel: "online",
    status: "paid",
    items: [
      { title: "Шампунь Nutrition 250мл", qty: 2, price: 690 },
      { title: "Маска Recovery 200мл", qty: 1, price: 990 },
      { title: "Кисть универсальная №12", qty: 1, price: 390 },
    ],
    paymentId: "P-20250901-010",
    audit: [
      { at: "2025-09-01 10:20", user: "system", text: "Создан заказ" },
      { at: "2025-09-01 10:21", user: "payment", text: "Оплата подтверждена" },
    ],
  }),
  makeOrder({
    id: "O-240901-002",
    createdAt: "2025-09-01 11:05",
    clientId: "c-102",
    client: "Дарья Ким",
    email: "daria@example.com",
    phone: "+7 900 222-33-44",
    channel: "manager",
    status: "confirmed",
    items: [{ title: "Патчи под глаза 30шт", qty: 1, price: 790 }],
    audit: [
      { at: "2025-09-01 11:05", user: "manager@demo", text: "Создан менеджером" },
      { at: "2025-09-01 11:06", user: "manager@demo", text: "Подтверждён" },
    ],
  }),
  makeOrder({
    id: "O-240902-005",
    createdAt: "2025-09-02 15:43",
    clientId: "c-103",
    client: "ООО «Бьюти»",
    channel: "online",
    status: "cancelled",
    items: [{ title: "SPA-набор Relax", qty: 1, price: 2490 }],
    audit: [
      { at: "2025-09-02 15:43", user: "system", text: "Создан заказ" },
      { at: "2025-09-02 16:00", user: "system", text: "Отменён клиентом" },
    ],
  }),
];

/** Форматирование валюты (переиспользуемое в UI) */
export const fmtRUB = (n: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(n);