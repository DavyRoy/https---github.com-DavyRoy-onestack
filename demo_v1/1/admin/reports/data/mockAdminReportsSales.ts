export const ADMIN_SALES_KPI = {
  revenue: 18435000,
  orders: 4210,
  aov: 4380,
  repeatsPct: 37.5,
  refundsCnt: 42,
  refundsAmount: 512000,
  deltaRevenuePct: 6.2,
};

export const ADMIN_SALES_TREND: Array<{
  date: string; revenue: number; orders: number; aov: number; online: number; manager: number;
}> = [
  { date: "2025-09-29", revenue: 2100000, orders: 460, aov: 4565, online: 1320000, manager: 780000 },
  { date: "2025-09-30", revenue: 2150000, orders: 470, aov: 4574, online: 1350000, manager: 800000 },
  { date: "2025-10-01", revenue: 2600000, orders: 520, aov: 5000, online: 1620000, manager: 980000 },
  { date: "2025-10-02", revenue: 2550000, orders: 515, aov: 4951, online: 1600000, manager: 950000 },
  { date: "2025-10-03", revenue: 2700000, orders: 540, aov: 5000, online: 1710000, manager: 990000 },
  { date: "2025-10-04", revenue: 3200000, orders: 610, aov: 5246, online: 2000000, manager: 1200000 },
  { date: "2025-10-05", revenue: 3300000, orders: 595, aov: 5546, online: 2050000, manager: 1250000 },
];

export const ADMIN_SALES_BY_LOC = [
  { id: "center", name: "Центр", value: 6200000 },
  { id: "south", name: "Юг", value: 4100000 },
  { id: "north", name: "Север", value: 3600000 },
  { id: "west",  name: "Запад", value: 2530000 },
];

export const ADMIN_SALES_BY_CATEGORY = [
  { id: "hair", label: "Парикмахерские", value: 5200000 },
  { id: "spa",  label: "SPA",             value: 3800000 },
  { id: "nails",label: "Ногтевой сервис", value: 3100000 },
  { id: "goods",label: "Товары",          value: 3320000 },
];

export const ADMIN_SALES_TOP_ITEMS = [
  { name: "Стрижка мужская", orders: 820, revenue: 2460000, aov: 3000 },
  { name: "Массаж 60 мин",   orders: 540, revenue: 2160000, aov: 4000 },
  { name: "Маникюр гель",    orders: 480, revenue: 1680000, aov: 3500 },
];

export const ADMIN_SALES_TOP_CUSTOMERS = [
  { id: "C-101", name: "ООО «Альфа»", orders: 22, revenue: 820000, ltv: 2500000, last: "2025-10-03" },
  { id: "C-205", name: "ИП Ким",      orders: 18, revenue: 610000, ltv: 1720000, last: "2025-10-05" },
];