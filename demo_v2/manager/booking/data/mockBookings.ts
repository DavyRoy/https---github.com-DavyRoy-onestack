// src/app/demo/manager/booking/data/mockBookings.ts
export type BookingStatus =
  | "new"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "noshow"
  | "rescheduled";

export type Booking = {
  id: string;                // BKG-XXXX
  clientId: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  serviceId: string;
  serviceTitle: string;
  staffId: string;
  staffName: string;
  location?: string;
  source: "online" | "manager" | "phone";
  startAt: string;           // ISO
  endAt: string;             // ISO
  createdAt: string;         // ISO
  status: BookingStatus;
  note?: string;
  price?: number;
};

// ===== helpers =====
const addMinutes = (d: Date, m: number) => {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() + m);
  return x;
};

const now = new Date();
const day = 24 * 60 * 60 * 1000;

function iso(d: Date) {
  return new Date(d).toISOString();
}

// ===== dataset =====
export const mockBookings: Booking[] = [
  {
    id: "BKG-1032",
    clientId: "C-11",
    clientName: "Анна Петрова",
    clientPhone: "+7 900 111-22-33",
    clientEmail: "anna@example.com",
    serviceId: "srv-hair-1",
    serviceTitle: "Стрижка женская",
    staffId: "st-1",
    staffName: "Мария",
    location: "Центр",
    source: "online",
    startAt: iso(addMinutes(new Date(now.getTime() + 2 * 60 * 60 * 1000), 0)),
    endAt: iso(addMinutes(new Date(now.getTime() + 2 * 60 * 60 * 1000), 60)),
    createdAt: iso(new Date(now.getTime() - day)),
    status: "pending",
    note: "Позвонить за 1 час",
    price: 2500,
  },
  {
    id: "BKG-1033",
    clientId: "C-12",
    clientName: "Дарья Королёва",
    clientPhone: "+7 901 234-56-78",
    serviceId: "srv-nails-2",
    serviceTitle: "Маникюр классический",
    staffId: "st-2",
    staffName: "Ирина",
    location: "Север",
    source: "manager",
    startAt: iso(addMinutes(new Date(now.getTime() + 5 * 60 * 60 * 1000), 0)),
    endAt: iso(addMinutes(new Date(now.getTime() + 5 * 60 * 60 * 1000), 60)),
    createdAt: iso(new Date(now.getTime() - 2 * day)),
    status: "confirmed",
    price: 1900,
  },
  {
    id: "BKG-1027",
    clientId: "C-09",
    clientName: "Иван П.",
    clientEmail: "ivan@example.com",
    serviceId: "srv-spa-1",
    serviceTitle: "Массаж спины",
    staffId: "st-3",
    staffName: "Сергей",
    location: "Центр",
    source: "phone",
    startAt: iso(addMinutes(new Date(now.getTime() - 3 * 60 * 60 * 1000), 0)),
    endAt: iso(addMinutes(new Date(now.getTime() - 3 * 60 * 60 * 1000), 60)),
    createdAt: iso(new Date(now.getTime() - 3 * day)),
    status: "completed",
    price: 3200,
  },
  {
    id: "BKG-1024",
    clientId: "C-05",
    clientName: "ООО «Бьюти»",
    serviceId: "srv-hair-2",
    serviceTitle: "Укладка",
    staffId: "st-1",
    staffName: "Мария",
    location: "Центр",
    source: "online",
    startAt: iso(addMinutes(new Date(now.getTime() + 1 * day), 10 * 60)),
    endAt: iso(addMinutes(new Date(now.getTime() + 1 * day), 11 * 60)),
    createdAt: iso(new Date(now.getTime() - 4 * day)),
    status: "new",
    price: 1400,
  },
  {
    id: "BKG-1009",
    clientId: "C-02",
    clientName: "Салон «Омега»",
    serviceId: "srv-nails-1",
    serviceTitle: "Покрытие гель-лак",
    staffId: "st-2",
    staffName: "Ирина",
    source: "manager",
    startAt: iso(addMinutes(new Date(now.getTime() + 3 * day), 12 * 60)),
    endAt: iso(addMinutes(new Date(now.getTime() + 3 * day), 13 * 60)),
    createdAt: iso(new Date(now.getTime() - 6 * day)),
    status: "cancelled",
    price: 2100,
  },
  // Дополнительно: покрываем все статусы
  {
    id: "BKG-1013",
    clientId: "C-15",
    clientName: "Павел С.",
    clientPhone: "+7 900 555-66-77",
    serviceId: "srv-hair-1",
    serviceTitle: "Стрижка женская",
    staffId: "st-2",
    staffName: "Ирина",
    location: "Север",
    source: "online",
    startAt: iso(addMinutes(new Date(now.getTime() + 2 * day), 9 * 60)),
    endAt: iso(addMinutes(new Date(now.getTime() + 2 * day), 10 * 60)),
    createdAt: iso(new Date(now.getTime() - 1 * day)),
    status: "noshow",
    price: 2500,
  },
  {
    id: "BKG-1014",
    clientId: "C-16",
    clientName: "Елена Р.",
    clientEmail: "elena@example.com",
    serviceId: "srv-nails-1",
    serviceTitle: "Покрытие гель-лак",
    staffId: "st-3",
    staffName: "Сергей",
    location: "Центр",
    source: "manager",
    startAt: iso(addMinutes(new Date(now.getTime() + 4 * day), 14 * 60)),
    endAt: iso(addMinutes(new Date(now.getTime() + 4 * day), 15 * 60)),
    createdAt: iso(new Date()),
    status: "rescheduled",
    price: 2100,
  },
];

// ===== UI dictionary =====
export const bookingStatuses: Record<BookingStatus, { label: string; color: string }> = {
  new: { label: "Новая", color: "bg-sky-500" },
  pending: { label: "Ожидает подтв.", color: "bg-amber-400" },
  confirmed: { label: "Подтверждена", color: "bg-emerald-500" },
  completed: { label: "Состоялась", color: "bg-indigo-500" },
  cancelled: { label: "Отменена", color: "bg-rose-500" },
  noshow: { label: "Не явился", color: "bg-zinc-500" },
  rescheduled: { label: "Перенесена", color: "bg-purple-500" },
};