export type OrderStatus = "due" | "processing" | "delivering" | "delivered" | "completed" | "cancelled";
export type PaymentStatus = "paid" | "due" | "refunded";
export type DeliveryMethod = "pickup" | "courier" | "post";
export type OrderType = "products" | "services" | "mixed";

export type OrderItem = {
  id: string;
  title: string;
  quantity: number;
  price: number;
  image: string;
  type: "product" | "service";
};

export type OrderTimelineEntry = {
  id: string;
  date: string;
  label: string;
  description?: string;
};

export type OrderRecord = {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  deliveryMethod: DeliveryMethod;
  deliveryStatus: string;
  trackingCode?: string;
  trackingLink?: string;
  type: OrderType;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  customerNote?: string;
  address?: {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
  };
  invoices: Array<{ id: string; label: string; href: string }>;
  timeline: OrderTimelineEntry[];
};

const baseDate = new Date();
const makeDate = (offsetDays: number, hour: number) => {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + offsetDays);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

export const orders: OrderRecord[] = [
  {
    id: "ord-1052",
    number: "#1052",
    createdAt: makeDate(-3, 10),
    status: "delivering",
    paymentStatus: "paid",
    paymentMethod: "Карта ···· 8123",
    deliveryMethod: "courier",
    deliveryStatus: "Курьер в пути",
    trackingCode: "TRK123456789",
    trackingLink: "https://demo-tracking.example/trk123456789",
    type: "mixed",
    items: [
      {
        id: "item-1",
        title: "Сыворотка 24/7 Glow",
        quantity: 2,
        price: 1490,
        image: "https://images.unsplash.com/photo-1584129012686-4d553ff279f4?auto=format&fit=crop&w=300&q=80",
        type: "product",
      },
      {
        id: "item-2",
        title: "SPA-ритуал Balance (подарочный сертификат)",
        quantity: 1,
        price: 6900,
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&q=80",
        type: "service",
      },
    ],
    subtotal: 9880,
    discount: 880,
    deliveryFee: 400,
    tax: 0,
    total: 9400,
    customerNote: "К доставке к 19:00, позвонить за 10 минут",
    address: {
      name: "Анна Клиент",
      phone: "+7 (900) 000-00-00",
      line1: "Пресненская наб. 12",
      city: "Москва",
      postalCode: "123112",
    },
    invoices: [
      { id: "inv-203", label: "Счёт на предоплату", href: "/demo/api/orders/invoice-203.pdf" },
      { id: "receipt-502", label: "Кассовый чек", href: "/demo/api/orders/receipt-502.pdf" },
    ],
    timeline: [
      { id: "t1", date: makeDate(-3, 10), label: "Заказ создан" },
      { id: "t2", date: makeDate(-3, 10), label: "Оплата получена", description: "Карта ···· 8123" },
      { id: "t3", date: makeDate(-2, 17), label: "Упакован" },
      { id: "t4", date: makeDate(-1, 11), label: "Передан курьеру" },
    ],
  },
  {
    id: "ord-1046",
    number: "#1046",
    createdAt: makeDate(-14, 13),
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "ЮKassa",
    deliveryMethod: "pickup",
    deliveryStatus: "Получено клиентом",
    type: "services",
    items: [
      {
        id: "item-3",
        title: "Абонемент на 4 SPA-визита",
        quantity: 1,
        price: 12900,
        image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=300&q=80",
        type: "service",
      },
    ],
    subtotal: 12900,
    discount: 1900,
    deliveryFee: 0,
    tax: 0,
    total: 11000,
    invoices: [{ id: "inv-200", label: "Электронный чек", href: "/demo/api/orders/receipt-200.pdf" }],
    timeline: [
      { id: "t1", date: makeDate(-14, 13), label: "Заказ создан" },
      { id: "t2", date: makeDate(-14, 13), label: "Оплачен" },
      { id: "t3", date: makeDate(-7, 15), label: "Услуги оказаны" },
      { id: "t4", date: makeDate(-6, 12), label: "Заказ завершён" },
    ],
  },
  {
    id: "ord-1038",
    number: "#1038",
    createdAt: makeDate(-30, 9),
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "СБП",
    deliveryMethod: "post",
    deliveryStatus: "Отмена, средства возвращены",
    type: "products",
    items: [
      {
        id: "item-4",
        title: "Подарочная коробка Self-care",
        quantity: 1,
        price: 4200,
        image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=300&q=80",
        type: "product",
      },
    ],
    subtotal: 4200,
    discount: 0,
    deliveryFee: 350,
    tax: 0,
    total: 4550,
    timeline: [
      { id: "t1", date: makeDate(-30, 9), label: "Заказ создан" },
      { id: "t2", date: makeDate(-30, 9), label: "Оплата получена" },
      { id: "t3", date: makeDate(-28, 12), label: "Отменён клиентом", description: "Средства возвращены" },
    ],
  },
  {
    id: "ord-1056",
    number: "#1056",
    createdAt: makeDate(0, 8),
    status: "due",
    paymentStatus: "due",
    paymentMethod: "Карта",
    deliveryMethod: "pickup",
    deliveryStatus: "Ожидает оплаты",
    type: "products",
    items: [
      {
        id: "item-5",
        title: "Сыворотка Night Repair",
        quantity: 1,
        price: 2100,
        image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=300&q=80",
        type: "product",
      },
      {
        id: "item-6",
        title: "Маска Renewal",
        quantity: 1,
        price: 2290,
        image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=300&q=80",
        type: "product",
      },
    ],
    subtotal: 4390,
    discount: 0,
    deliveryFee: 0,
    tax: 0,
    total: 4390,
    timeline: [
      { id: "t1", date: makeDate(0, 8), label: "Заказ создан" },
      { id: "t2", date: makeDate(0, 8), label: "Ожидает оплаты" },
    ],
  },
];

export const orderStatuses = [
  { id: "due", label: "Ожидают оплаты" },
  { id: "processing", label: "В обработке" },
  { id: "delivering", label: "Доставка" },
  { id: "delivered", label: "Доставлено" },
  { id: "completed", label: "Завершено" },
  { id: "cancelled", label: "Отменено" },
  { id: "all", label: "Все" },
];

export const paymentStatuses = [
  { id: "paid", label: "Оплачено" },
  { id: "due", label: "К оплате" },
  { id: "refunded", label: "Возврат" },
  { id: "any", label: "Любые" },
];

export const deliveryMethods = [
  { id: "pickup", label: "Самовывоз" },
  { id: "courier", label: "Курьер" },
  { id: "post", label: "Почта" },
  { id: "any", label: "Любые" },
];

export const orderTypes = [
  { id: "products", label: "Товары" },
  { id: "services", label: "Услуги" },
  { id: "mixed", label: "Смешанный" },
  { id: "any", label: "Любые" },
];
