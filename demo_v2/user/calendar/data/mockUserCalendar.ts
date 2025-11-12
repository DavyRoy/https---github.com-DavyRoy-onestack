export type CalendarEventType = "booking" | "payment" | "order" | "reminder";
export type CalendarStatus =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "due"
  | "paid"
  | "delivering"
  | "delivered";

export type CalendarEvent = {
  id: string;
  title: string;
  type: CalendarEventType;
  status: CalendarStatus;
  start: string;
  end: string;
  allDay?: boolean;
  serviceId?: string;
  staffId?: string;
  locationId?: string;
  description?: string;
  link?: string;
};

export type CalendarLocation = {
  id: string;
  label: string;
};

export type CalendarStaff = {
  id: string;
  name: string;
};

const baseDate = new Date();
const makeDate = (offsetDays: number, hour: number, minute = 0) => {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + offsetDays);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const calendarLocations: CalendarLocation[] = [
  { id: "loc-main", label: "Основной салон" },
  { id: "loc-spa", label: "SPA OneStack" },
  { id: "loc-yoga", label: "Студия йоги" },
];

export const calendarStaff: CalendarStaff[] = [
  { id: "staff-olga", name: "Ольга Иванова" },
  { id: "staff-dmitry", name: "Дмитрий Смирнов" },
  { id: "staff-anna", name: "Анна Петрова" },
];

export const calendarEvents: CalendarEvent[] = [
  {
    id: "evt-101",
    title: "SPA-ритуал Balance",
    type: "booking",
    status: "confirmed",
    start: makeDate(0, 14, 0),
    end: makeDate(0, 15, 30),
    serviceId: "svc-spa-balance",
    staffId: "staff-olga",
    locationId: "loc-spa",
    link: "/demo/user/bookings/bk-101",
  },
  {
    id: "evt-102",
    title: "Glow уход для лица",
    type: "booking",
    status: "pending",
    start: makeDate(1, 11, 0),
    end: makeDate(1, 12, 15),
    serviceId: "svc-facial-glow",
    staffId: "staff-anna",
    locationId: "loc-main",
    link: "/demo/user/bookings/bk-102",
  },
  {
    id: "evt-103",
    title: "Оплатить депозит за хаммам",
    type: "payment",
    status: "due",
    start: makeDate(0, 9, 0),
    end: makeDate(0, 9, 30),
    serviceId: "svc-hammam-ritual",
    link: "/demo/user/payments/invoice-203",
  },
  {
    id: "evt-104",
    title: "Доставка заказа #1052",
    type: "order",
    status: "delivering",
    start: makeDate(2, 16, 0),
    end: makeDate(2, 18, 0),
    link: "/demo/user/orders/ord-1052",
  },
  {
    id: "evt-105",
    title: "Напоминание: обновить абонемент",
    type: "reminder",
    status: "confirmed",
    start: makeDate(3, 10, 0),
    end: makeDate(3, 10, 0),
    allDay: true,
  },
  {
    id: "evt-106",
    title: "Йога Balance",
    type: "booking",
    status: "cancelled",
    start: makeDate(-1, 18, 0),
    end: makeDate(-1, 19, 15),
    serviceId: "svc-yoga-balance",
    staffId: "staff-dmitry",
    locationId: "loc-yoga",
    link: "/demo/user/bookings/bk-106",
  },
  {
    id: "evt-107",
    title: "Витрины: акция на абонементы",
    type: "reminder",
    status: "confirmed",
    start: makeDate(5, 9, 0),
    end: makeDate(5, 9, 0),
    allDay: true,
  },
  {
    id: "evt-108",
    title: "Оплата: сертификат",
    type: "payment",
    status: "paid",
    start: makeDate(-2, 13, 0),
    end: makeDate(-2, 13, 30),
    link: "/demo/user/payments/invoice-198",
  },
];

export const calendarLegend = {
  booking: {
    confirmed: "bg-blue-500/80 text-white",
    pending: "bg-gray-400/80 text-white",
    cancelled: "bg-rose-500/80 text-white",
  },
  payment: {
    due: "bg-purple-500/80 text-white",
    paid: "bg-emerald-500/80 text-white",
  },
  order: {
    delivering: "bg-amber-500/80 text-white",
    delivered: "bg-emerald-500/80 text-white",
  },
  reminder: {
    confirmed: "bg-cyan-500/80 text-white",
  },
} as const;

export type CalendarLegendMap = typeof calendarLegend;
