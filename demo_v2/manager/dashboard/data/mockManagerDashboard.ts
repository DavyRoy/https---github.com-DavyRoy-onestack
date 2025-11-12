// src/app/demo/manager/dashboard/data/mockManagerDashboard.ts

/** ===== Types ===== */
export type Kpi = {
  title: string;
  valueToday: number;
  value7d: number;
  spark: number[]; // 7 точек (детерминированные)
  href: string;
};
export type TrendPoint = { date: string; revenue: number; orders: number };
export type StatusSlice = { label: string; value: number; href: string };
export type AgendaItem = {
  id: string;
  time: string; // HH:mm
  kind: "lead" | "order" | "booking" | "invoice";
  title: string;
  client: string;
  href: string;
  overdue?: boolean;
};
export type PipelineStage = {
  id: string;
  title: string;
  count: number;
  conv?: number;
  href: string;
};
export type BookingDay = {
  date: string; // YYYY-MM-DD
  count: number; // всего записей
  pending: number; // неподтв.
  href: string;
};
export type ActivityItem = {
  id: string;
  time: string;
  text: string;
  href: string;
};
export type RiskItem = {
  id: string;
  title: string;
  count: number;
  hint: string;
  href: string;
  cta?: { label: string; onClickHint?: string };
};

/** ===== Helpers (детерминированный RNG) ===== */
const pad2 = (n: number) => String(n).padStart(2, "0");
const toISO = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/** простой сид: mulberry32 */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** хеш строки в число */
function hashStr(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i)) * 16777619;
  return h >>> 0;
}
/** RNG от ключа (например, «trend-7d-YYYY-MM-DD») */
function rngForKey(key: string) {
  return mulberry32(hashStr(key));
}
/** дата-сдвиг без «now» в рантайме импорта */
function dateShift(baseISO: string, shift: number) {
  const [y, m, d] = baseISO.split("-").map(Number);
  const dt = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  dt.setUTCDate(dt.getUTCDate() + shift);
  return toISO(dt);
}

/** Базовая опорная дата (UTC-срез без локали) — только строка */
const baseTodayISO = toISO(
  new Date(
    Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate()
    )
  )
);

export const today = baseTodayISO;

/** ===== KPI (детерминированные spark по дате) ===== */
function makeSpark(key: string, base: number, spread: number) {
  const rnd = rngForKey(`spark-${key}-${baseTodayISO}`);
  return Array.from({ length: 7 }, () =>
    Math.max(1, Math.round(base + (rnd() - 0.5) * spread))
  );
}

export const mockKpi: Kpi[] = [
  {
    title: "Новые заказы",
    valueToday: 7,
    value7d: 52,
    spark: makeSpark("orders", 7, 6),
    href: "/demo/manager/orders?filter=today,new",
  },
  {
    title: "Новые лиды",
    valueToday: 11,
    value7d: 79,
    spark: makeSpark("leads", 10, 5),
    href: "/demo/manager/crm/leads?filter=today,new",
  },
  {
    title: "Предстоящие записи",
    valueToday: 6,
    value7d: 43,
    spark: makeSpark("bookings", 6, 4),
    href: "/demo/manager/booking?filter=today,upcoming",
  },
  {
    title: "Выручка (демо)",
    valueToday: 143_200,
    value7d: 879_500,
    spark: makeSpark("revenue", 140, 30),
    href: "/demo/manager/reports?slice=7d",
  },
];

/** ===== Тренды 7/30д (детерминированные) ===== */
export const mockTrend7d: TrendPoint[] = (() => {
  const rnd = rngForKey(`trend-7d-${baseTodayISO}`);
  return Array.from({ length: 7 }, (_, i) => {
    const date = dateShift(baseTodayISO, -6 + i);
    const orders = Math.round(8 + rnd() * 6); // 8..14
    const revenue = Math.round(12000 * orders * (0.8 + rnd() * 0.4) * 0.1);
    return { date, revenue, orders };
  });
})();

export const mockTrend30d: TrendPoint[] = (() => {
  const rnd = rngForKey(`trend-30d-${baseTodayISO}`);
  return Array.from({ length: 30 }, (_, i) => {
    const date = dateShift(baseTodayISO, -29 + i);
    const orders = Math.round(6 + rnd() * 10); // 6..16
    const revenue = Math.round(10000 * orders * (0.8 + rnd() * 0.4) * 0.1);
    return { date, revenue, orders };
  });
})();

/** ===== Остальные блоки — статичны/детерминированы ===== */
export const mockStatus: StatusSlice[] = [
  { label: "Новый", value: 14, href: "/demo/manager/orders?status=new" },
  { label: "Подтв.", value: 28, href: "/demo/manager/orders?status=confirmed" },
  { label: "Оплачен", value: 36, href: "/demo/manager/orders?status=paid" },
  { label: "Выполнен", value: 22, href: "/demo/manager/orders?status=done" },
  { label: "Отменён", value: 7, href: "/demo/manager/orders?status=cancelled" },
];

export const mockAgenda: AgendaItem[] = [
  {
    id: "a1",
    time: "10:00",
    kind: "booking",
    title: "Подтвердить бронь",
    client: "Анна П.",
    href: "/demo/manager/booking/123",
  },
  {
    id: "a2",
    time: "11:30",
    kind: "lead",
    title: "Созвон по лидам",
    client: "ИП Селезнёв",
    href: "/demo/manager/crm/leads/501",
    overdue: true,
  },
  {
    id: "a3",
    time: "14:15",
    kind: "invoice",
    title: "Выставить счёт",
    client: "ООО «Бьюти»",
    href: "/demo/manager/payments/902",
  },
  {
    id: "a4",
    time: "16:00",
    kind: "order",
    title: "Уточнить адрес",
    client: "Дарья К.",
    href: "/demo/manager/orders/ORD-94D21",
  },
];

export const mockPipeline: PipelineStage[] = [
  { id: "st-new", title: "Новый", count: 32, href: "/demo/manager/crm/deals?stage=new" },
  { id: "st-work", title: "В работе", count: 21, conv: 66, href: "/demo/manager/crm/deals?stage=work" },
  { id: "st-prop", title: "Ком. предложение", count: 14, conv: 67, href: "/demo/manager/crm/deals?stage=proposal" },
  { id: "st-order", title: "Заказ", count: 9, conv: 64, href: "/demo/manager/crm/deals?stage=order" },
];

export const mockBookingWeek: BookingDay[] = (() => {
  const rnd = rngForKey(`booking-week-${baseTodayISO}`);
  return Array.from({ length: 7 }, (_, i) => {
    const date = dateShift(baseTodayISO, -3 + i);
    const count = 3 + Math.floor(rnd() * 6);
    const pending = Math.floor(rnd() * 2);
    return { date, count, pending, href: `/demo/manager/calendar?date=${date}` };
  });
})();

export const mockActivity: ActivityItem[] = [
  {
    id: "r1",
    time: "09:42",
    text: "Заказ ORD-94D21 подтверждён (Иван П.)",
    href: "/demo/manager/orders/ORD-94D21",
  },
  { id: "r2", time: "10:18", text: "Создан лид: Салон «Омега»", href: "/demo/manager/crm/leads/512" },
  {
    id: "r3",
    time: "11:03",
    text: "Бронь #BKG-221 ожидает подтверждения",
    href: "/demo/manager/booking/BKG-221",
  },
  { id: "r4", time: "12:47", text: "Оплата счёта INV-774 получена", href: "/demo/manager/payments/INV-774" },
];

export const mockRisks: RiskItem[] = [
  {
    id: "ra1",
    title: "Просроченные задачи",
    count: 3,
    hint: "Перезвоните клиентам из этапа «В работе».",
    href: "/demo/manager/crm/leads?filter=overdue",
    cta: { label: "Отметить выполненными" },
  },
  {
    id: "ra2",
    title: "Брони без подтверждения",
    count: 2,
    hint: "Подтвердите сегодняшние записи.",
    href: "/demo/manager/booking?status=pending",
    cta: { label: "Подтвердить все" },
  },
  {
    id: "ra3",
    title: "Неоплаченные счета",
    count: 4,
    hint: "Отправьте напоминания по счетам старше 3 дней.",
    href: "/demo/manager/payments?status=unpaid",
    cta: { label: "Разослать напоминания" },
  },
];