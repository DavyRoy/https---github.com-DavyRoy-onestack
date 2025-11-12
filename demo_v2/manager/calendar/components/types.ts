export type View = "day" | "week" | "month";

export type Status =
  | "new"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "noshow"
  | "rescheduled";

export type CalEvent = {
  id: string;
  start: string; // ISO
  end: string;   // ISO
  title: string;
  serviceId?: string;
  staffId?: string;
  locationId?: string;
  source?: "online" | "manager" | "phone";
  status: Status;
  bookingId: string;
};

// ===== Утилиты работы с датами =====

export const pad = (n: number) => String(n).padStart(2, "0");

export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const timeLabel = (d: Date) =>
  `${pad(d.getHours())}:${pad(d.getMinutes())}`;

export const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const fmtDate = (d: Date) =>
  d
    .toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(".", "");

export const startOfWeek = (d: Date) => {
  const x = new Date(d);
  const dow = (x.getDay() + 6) % 7; // Пн=0
  x.setDate(x.getDate() - dow);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export const addMonths = (d: Date, n: number) => {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
};