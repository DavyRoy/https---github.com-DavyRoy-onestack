// app/demo/(shared)/sales/index.ts
// Демо-данные для модуля продаж / выручки

/* ===== Типы ===== */
export type SalesKpi = {
  revenue: number;
  orders: number;
  aov: number;
  repeatsPct: number;
  refundsCnt: number;
  refundsAmount: number;
  deltaRevenuePct: number;
};

export type SalesTrendPoint = {
  date: string;      // YYYY-MM-DD
  revenue: number;
  orders: number;
  aov: number;
  online: number;
  manager: number;
};

export type SalesByLoc = {
  id: string;
  name: string;
  value: number;
};

export type SalesByCategory = {
  id: string;
  label: string;
  value: number;
};

export type SalesTopItem = {
  name: string;
  orders: number;
  revenue: number;
  aov: number;
};

export type SalesTopCustomer = {
  id: string;
  name: string;
  orders: number;
  revenue: number;
  ltv: number;
  last: string;      // YYYY-MM-DD
};

/* ===== Данные ===== */

export const ADMIN_SALES_KPI: SalesKpi = {
  revenue: 18_435_000,
  orders: 4210,
  aov: 4380,
  repeatsPct: 37.5,
  refundsCnt: 42,
  refundsAmount: 512_000,
  deltaRevenuePct: 6.2,
};

export const ADMIN_SALES_TREND: SalesTrendPoint[] = [
  { date: "2025-09-29", revenue: 2_100_000, orders: 460, aov: 4565, online: 1_320_000, manager: 780_000 },
  { date: "2025-09-30", revenue: 2_150_000, orders: 470, aov: 4574, online: 1_350_000, manager: 800_000 },
  { date: "2025-10-01", revenue: 2_600_000, orders: 520, aov: 5000, online: 1_620_000, manager: 980_000 },
  { date: "2025-10-02", revenue: 2_550_000, orders: 515, aov: 4951, online: 1_600_000, manager: 950_000 },
  { date: "2025-10-03", revenue: 2_700_000, orders: 540, aov: 5000, online: 1_710_000, manager: 990_000 },
  { date: "2025-10-04", revenue: 3_200_000, orders: 610, aov: 5246, online: 2_000_000, manager: 1_200_000 },
  { date: "2025-10-05", revenue: 3_300_000, orders: 595, aov: 5546, online: 2_050_000, manager: 1_250_000 },
];

export const ADMIN_SALES_BY_LOC: SalesByLoc[] = [
  { id: "center", name: "Центр", value: 6_200_000 },
  { id: "south", name: "Юг", value: 4_100_000 },
  { id: "north", name: "Север", value: 3_600_000 },
  { id: "west",  name: "Запад", value: 2_530_000 },
];

export const ADMIN_SALES_BY_CATEGORY: SalesByCategory[] = [
  { id: "hair",  label: "Парикмахерские", value: 5_200_000 },
  { id: "spa",   label: "SPA",             value: 3_800_000 },
  { id: "nails", label: "Ногтевой сервис", value: 3_100_000 },
  { id: "goods", label: "Товары",          value: 3_320_000 },
];

export const ADMIN_SALES_TOP_ITEMS: SalesTopItem[] = [
  { name: "Стрижка мужская", orders: 820, revenue: 2_460_000, aov: 3000 },
  { name: "Массаж 60 мин",   orders: 540, revenue: 2_160_000, aov: 4000 },
  { name: "Маникюр гель",    orders: 480, revenue: 1_680_000, aov: 3500 },
];

export const ADMIN_SALES_TOP_CUSTOMERS: SalesTopCustomer[] = [
  { id: "C-101", name: "ООО «Альфа»", orders: 22, revenue: 820_000, ltv: 2_500_000, last: "2025-10-03" },
  { id: "C-205", name: "ИП Ким",      orders: 18, revenue: 610_000, ltv: 1_720_000, last: "2025-10-05" },
];