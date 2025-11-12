export const ADMIN_BOOKING_KPI = {
  created: 2150,
  confirmed: 1980,
  completed: 1760,
  cancelled: 210,
  noshow: 85,
  utilizationPct: 72.4,
  deltaUtilizationPct: 2.1,
};

export const ADMIN_BOOKING_TREND: Array<{
  date: string; created: number; confirmed: number; completed: number; cancelled: number; noshow: number;
}> = [
  { date: "2025-09-29", created: 280, confirmed: 260, completed: 230, cancelled: 25, noshow: 10 },
  { date: "2025-09-30", created: 300, confirmed: 270, completed: 240, cancelled: 28, noshow: 12 },
  { date: "2025-10-01", created: 320, confirmed: 300, completed: 270, cancelled: 30, noshow: 11 },
  { date: "2025-10-02", created: 310, confirmed: 295, completed: 265, cancelled: 32, noshow: 13 },
  { date: "2025-10-03", created: 340, confirmed: 320, completed: 290, cancelled: 35, noshow: 14 },
  { date: "2025-10-04", created: 360, confirmed: 330, completed: 320, cancelled: 28, noshow: 12 },
  { date: "2025-10-05", created: 340, confirmed: 305, completed: 345, cancelled: 32, noshow: 13 },
];

export const ADMIN_BOOKING_HEAT: Array<{ dow: number; hour: number; value: number }> = [
  // dow: 1..7 (Mon..Sun), hour: 9..20
  { dow: 1, hour: 10, value: 0.5 }, { dow: 1, hour: 11, value: 0.6 }, { dow: 1, hour: 12, value: 0.7 },
  { dow: 2, hour: 15, value: 0.8 }, { dow: 3, hour: 18, value: 0.9 }, { dow: 5, hour: 13, value: 0.65 },
];

export const ADMIN_BOOKING_STAFF = [
  { id: "S-1", name: "Анна", availH: 36, busyH: 27, util: 75, noshowPct: 4.5 },
  { id: "S-2", name: "Бек",  availH: 40, busyH: 28, util: 70, noshowPct: 3.1 },
];

export const ADMIN_BOOKING_SERVICES = [
  { id: "SV-1", name: "Массаж 60 мин", created: 540, completed: 510, cancelled: 28, noshow: 9 },
  { id: "SV-2", name: "Маникюр",      created: 480, completed: 440, cancelled: 30, noshow: 12 },
];

export const ADMIN_DEFICIT_DAYS = [
  { date: "2025-10-02", location: "Центр" },
  { date: "2025-10-05", location: "Юг" },
];