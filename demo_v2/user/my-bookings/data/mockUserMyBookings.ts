import { services } from "../../services/data/mockUserServices";

export type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

export type BookingPaymentStatus = "not_required" | "deposit_due" | "deposit_paid";

export type MyBooking = {
  id: string;
  serviceId: string;
  serviceTitle: string;
  staffId: string | null;
  staffName?: string;
  locationId: string;
  locationLabel: string;
  start: string;
  end: string;
  duration: number;
  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;
  depositAmount?: number;
  notes?: string;
  addons?: Array<{ id: string; title: string; price: number; duration: number }>;
  history: Array<{ id: string; date: string; message: string }>;
};

const baseDate = new Date();
const makeDate = (offset: number, hour: number, minute: number) => {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + offset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const myBookings: MyBooking[] = [
  {
    id: "bk-101",
    serviceId: "svc-spa-balance",
    serviceTitle: "SPA-ритуал Balance",
    staffId: "staff-olga",
    staffName: "Ольга Иванова",
    locationId: "loc-spa",
    locationLabel: "SPA OneStack",
    start: makeDate(1, 14, 0),
    end: makeDate(1, 15, 30),
    duration: 90,
    status: "confirmed",
    paymentStatus: "deposit_due",
    depositAmount: 2000,
    addons: [{ id: "aroma", title: "Ароматическое масло", price: 900, duration: 10 }],
    history: [
      { id: "h1", date: makeDate(-5, 12, 0), message: "Бронирование создано через личный кабинет." },
      { id: "h2", date: makeDate(-4, 10, 0), message: "Отправлено напоминание на email." },
    ],
  },
  {
    id: "bk-102",
    serviceId: "svc-facial-glow",
    serviceTitle: "Glow уход для лица",
    staffId: "staff-anna",
    staffName: "Анна Петрова",
    locationId: "loc-main",
    locationLabel: "Основной салон",
    start: makeDate(-2, 11, 0),
    end: makeDate(-2, 12, 15),
    duration: 75,
    status: "completed",
    paymentStatus: "deposit_paid",
    depositAmount: 1500,
    history: [
      { id: "h1", date: makeDate(-10, 9, 0), message: "Бронирование подтверждено менеджером." },
      { id: "h2", date: makeDate(-2, 13, 0), message: "Оплата депозита подтверждена." },
    ],
  },
  {
    id: "bk-103",
    serviceId: "svc-yoga-balance",
    serviceTitle: "Йога Balance",
    staffId: "staff-dmitry",
    staffName: "Дмитрий Смирнов",
    locationId: "loc-yoga",
    locationLabel: "Студия йоги",
    start: makeDate(3, 9, 0),
    end: makeDate(3, 10, 15),
    duration: 75,
    status: "pending",
    paymentStatus: "not_required",
    history: [{ id: "h1", date: makeDate(-1, 15, 0), message: "Запрос на перенос ожидает подтверждения." }],
  },
  {
    id: "bk-104",
    serviceId: "svc-hammam-ritual",
    serviceTitle: "Хаммам Ritual",
    staffId: "staff-olga",
    staffName: "Ольга Иванова",
    locationId: "loc-spa",
    locationLabel: "SPA OneStack",
    start: makeDate(-7, 19, 0),
    end: makeDate(-7, 20, 45),
    duration: 105,
    status: "cancelled",
    paymentStatus: "deposit_paid",
    depositAmount: 3000,
    history: [
      { id: "h1", date: makeDate(-14, 10, 0), message: "Бронирование подтверждено менеджером." },
      { id: "h2", date: makeDate(-8, 18, 0), message: "Гость отменил: удержан депозит 30%." },
    ],
  },
];

export const bookingStatuses = [
  { id: "upcoming", label: "Предстоящие" },
  { id: "completed", label: "Завершённые" },
  { id: "cancelled", label: "Отменённые" },
  { id: "pending", label: "Ожидают" },
  { id: "all", label: "Все" },
];

export const bookingServices = services.map((service) => ({ id: service.id, title: service.title }));
