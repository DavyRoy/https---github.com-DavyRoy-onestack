export type Order = {
  id: string;
  createdAt: string; // ISO
  amount: number;
  status: "new" | "confirmed" | "paid" | "completed" | "cancelled" | "refunded";
  channel: "online" | "offline" | "manager";
  owner?: string | null; // id менеджера
  customer: { id: string; name: string; email?: string; phone?: string };
  items: { id: string; title: string; qty: number; price: number }[];
};

// справочник менеджеров (демо)
export const MANAGERS: { id: string; name: string }[] = [
  { id: "m1", name: "Алина Смирнова" },
  { id: "m2", name: "Олег Петров" },
  { id: "m3", name: "Дарья Крылова" },
];

// Моки заказов (демо)
export const mockOrders: Order[] = [
  {
    id: "ORD-94D21",
    createdAt: "2025-09-30T10:12:00Z",
    amount: 18200,
    status: "confirmed",
    channel: "online",
    owner: "m2",
    customer: { id: "cl-7001", name: "Иван Петров", email: "ivan@example.com" },
    items: [{ id: "i1", title: "Набор «Basic»", qty: 1, price: 18200 }],
  },
  {
    id: "ORD-6FA02",
    createdAt: "2025-09-30T14:45:00Z",
    amount: 9900,
    status: "new",
    channel: "online",
    owner: null,
    customer: { id: "cl-7003", name: "Дарья К.", email: "daria@example.com" },
    items: [{ id: "i1", title: "Шампунь Pro", qty: 1, price: 9900 }],
  },
  {
    id: "ORD-77B13",
    createdAt: "2025-10-01T09:05:00Z",
    amount: 125000,
    status: "paid",
    channel: "manager",
    owner: "m1",
    customer: { id: "cl-7005", name: "Салон «Мята»", email: "hello@myata.salon" },
    items: [
      { id: "i1", title: "Кресло парикмахерское", qty: 1, price: 75000 },
      { id: "i2", title: "Станок профессиональный", qty: 1, price: 50000 },
    ],
  },
  {
    id: "ORD-50C84",
    createdAt: "2025-10-01T12:20:00Z",
    amount: 38000,
    status: "completed",
    channel: "offline",
    owner: "m3",
    customer: { id: "cl-7002", name: "Салон «Омега»", email: "info@omega.salon" },
    items: [
      { id: "i1", title: "Расходники (набор)", qty: 2, price: 12000 },
      { id: "i2", title: "Средства дезинфекции", qty: 1, price: 14000 },
    ],
  },
  {
    id: "ORD-10A91",
    createdAt: "2025-10-01T16:40:00Z",
    amount: 15000,
    status: "cancelled",
    channel: "manager",
    owner: "m2",
    customer: { id: "cl-7001", name: "Иван Петров", phone: "+7 900 000-01-01" },
    items: [{ id: "i1", title: "Подарочный сертификат", qty: 1, price: 15000 }],
  },
  {
    id: "ORD-33E57",
    createdAt: "2025-10-02T08:10:00Z",
    amount: 220000,
    status: "confirmed",
    channel: "manager",
    owner: "m1",
    customer: { id: "cl-7004", name: "ООО «Бьюти»", email: "office@beauty.ru" },
    items: [
      { id: "i1", title: "Оборудование зала", qty: 1, price: 200000 },
      { id: "i2", title: "Монтаж и обучение", qty: 1, price: 20000 },
    ],
  },
  {
    id: "ORD-88C09",
    createdAt: "2025-10-02T11:55:00Z",
    amount: 12000,
    status: "refunded",
    channel: "online",
    owner: null,
    customer: { id: "cl-7001", name: "Иван Петров", email: "ivan@example.com" },
    items: [{ id: "i1", title: "Демо-набор ухода", qty: 1, price: 12000 }],
  },
  {
    id: "ORD-29D66",
    createdAt: "2025-10-02T15:30:00Z",
    amount: 45000,
    status: "paid",
    channel: "online",
    owner: "m3",
    customer: { id: "cl-7002", name: "Салон «Омега»", email: "info@omega.salon" },
    items: [
      { id: "i1", title: "Фен профессиональный", qty: 3, price: 15000 },
    ],
  },
  {
    id: "ORD-64B72",
    createdAt: "2025-10-03T09:25:00Z",
    amount: 182000,
    status: "completed",
    channel: "manager",
    owner: "m2",
    customer: { id: "cl-7004", name: "ООО «Бьюти»", email: "office@beauty.ru" },
    items: [
      { id: "i1", title: "Коммерческое предложение — комплект", qty: 1, price: 182000 },
    ],
  },
  {
    id: "ORD-04F18",
    createdAt: "2025-10-03T13:05:00Z",
    amount: 18000,
    status: "new",
    channel: "offline",
    owner: null,
    customer: { id: "cl-7003", name: "Дарья К.", phone: "+7 900 000-01-03" },
    items: [{ id: "i1", title: "Комплект для мастеров", qty: 1, price: 18000 }],
  },
  {
    id: "ORD-71A35",
    createdAt: "2025-10-03T17:40:00Z",
    amount: 520000,
    status: "paid",
    channel: "manager",
    owner: "m1",
    customer: { id: "cl-7004", name: "ООО «Бьюти»", email: "office@beauty.ru" },
    items: [
      { id: "i1", title: "Годовой контракт обслуживания", qty: 1, price: 520000 },
    ],
  },
  {
    id: "ORD-12C90",
    createdAt: "2025-10-04T10:00:00Z",
    amount: 125000,
    status: "confirmed",
    channel: "manager",
    owner: "m3",
    customer: { id: "cl-7005", name: "Салон «Мята»", email: "hello@myata.salon" },
    items: [
      { id: "i1", title: "Станки и кресла (комплект)", qty: 1, price: 125000 },
    ],
  },
];