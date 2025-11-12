// Типы
export type SalesPoint = { date: string; revenue: number; orders: number };
export type StatusSlice = { label: string; value: number };

// KPI / базовые константы
export const KPI_BASE = { crmConv: 27 } as const;

// Серии продаж
export const SALES_SERIES_7D: Readonly<SalesPoint[]> = [
  { date: "2025-09-26", revenue: 124000, orders: 18 },
  { date: "2025-09-27", revenue: 132500, orders: 20 },
  { date: "2025-09-28", revenue: 118400, orders: 17 },
  { date: "2025-09-29", revenue: 141200, orders: 21 },
  { date: "2025-09-30", revenue: 153600, orders: 22 },
  { date: "2025-10-01", revenue: 147300, orders: 21 },
  { date: "2025-10-02", revenue: 159900, orders: 23 },
] as const;

export const SALES_SERIES_30D: Readonly<SalesPoint[]> = [
  ...SALES_SERIES_7D,
  { date: "2025-10-03", revenue: 136200, orders: 19 },
  { date: "2025-10-04", revenue: 128400, orders: 18 },
  { date: "2025-10-05", revenue: 121300, orders: 17 },
  { date: "2025-10-06", revenue: 149900, orders: 22 },
  { date: "2025-10-07", revenue: 152200, orders: 22 },
  { date: "2025-10-08", revenue: 144000, orders: 20 },
  { date: "2025-10-09", revenue: 133500, orders: 19 },
  { date: "2025-10-10", revenue: 127400, orders: 18 },
  { date: "2025-10-11", revenue: 138800, orders: 19 },
  { date: "2025-10-12", revenue: 146300, orders: 21 },
  { date: "2025-10-13", revenue: 150700, orders: 22 },
  { date: "2025-10-14", revenue: 143600, orders: 20 },
  { date: "2025-10-15", revenue: 139200, orders: 19 },
  { date: "2025-10-16", revenue: 131900, orders: 18 },
  { date: "2025-10-17", revenue: 135500, orders: 18 },
  { date: "2025-10-18", revenue: 140800, orders: 20 },
  { date: "2025-10-19", revenue: 148200, orders: 21 },
  { date: "2025-10-20", revenue: 151900, orders: 22 },
  { date: "2025-10-21", revenue: 147100, orders: 21 },
  { date: "2025-10-22", revenue: 142400, orders: 20 },
  { date: "2025-10-23", revenue: 136900, orders: 19 },
  // + две даты для полного «30d»
  { date: "2025-10-24", revenue: 138300, orders: 19 },
  { date: "2025-10-25", revenue: 145600, orders: 21 },
] as const;

// Каналы
export const SALES_CHANNELS = {
  labels: ["online", "manager"] as const,
  values: [780000, 420000] as const,
};

// Распределение статусов заказов
export const STATUS_DISTRIBUTION: Readonly<StatusSlice[]> = [
  { label: "Новый", value: 18 },
  { label: "Подтв.", value: 34 },
  { label: "Оплачен", value: 41 },
  { label: "Выполнен", value: 27 },
  { label: "Отменён", value: 9 },
] as const;

// Топ-услуги
export const TOP_SERVICES = [
  { title: "Комплекс уходовых процедур", orders: 54, revenue: 426000 },
  { title: "Массаж 60 мин",              orders: 71, revenue: 355000 },
  { title: "Маникюр + покрытие",         orders: 88, revenue: 308000 },
  { title: "Мужская стрижка",            orders: 96, revenue: 288000 },
] as const;

// Тепловая карта недели (7×10 = 70)
export const HEATMAP_WEEK = {
  hours: ["10","11","12","13","14","15","16","17","18","19"] as const,
  days: [
    { day: "Пн", date: "2025-10-06" },
    { day: "Вт", date: "2025-10-07" },
    { day: "Ср", date: "2025-10-08" },
    { day: "Чт", date: "2025-10-09" },
    { day: "Пт", date: "2025-10-10" },
    { day: "Сб", date: "2025-10-11" },
    { day: "Вс", date: "2025-10-12" },
  ] as const,
  values: [
    2,3,4,4,5,6,6,5,3,2,
    1,2,3,4,5,6,6,5,4,3,
    0,1,2,3,4,5,5,4,3,2,
    1,2,3,4,6,7,7,6,4,3,
    2,3,4,5,7,8,8,7,5,4,
    3,4,5,6,7,8,8,7,6,5,
    1,2,2,3,4,5,5,4,3,2,
  ] as const,
} as const;

// Утилиты (по желанию использовать в компонентах)
export const sumRevenue = (arr: readonly SalesPoint[]) => arr.reduce((s, d) => s + d.revenue, 0);
export const sumOrders  = (arr: readonly SalesPoint[]) => arr.reduce((s, d) => s + d.orders, 0);