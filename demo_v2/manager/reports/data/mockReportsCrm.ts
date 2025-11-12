// Типы
export type LeadSource = "site" | "call" | "chat";
export type FunnelStageId = "new" | "work" | "proposal" | "order";

export interface FunnelStage {
  id: FunnelStageId;
  title: string;
  count: number;
}

// Источники (значения жёстко сопоставлены меткам)
export const LEADS_BY_SOURCE = {
  labels: ["site", "call", "chat"] as LeadSource[],
  values: [120, 64, 48] as number[],
} as const;

// Воронка (порядок зафиксирован)
export const FUNNEL_STAGES: Readonly<FunnelStage[]> = [
  { id: "new",      title: "Новый",           count: 180 },
  { id: "work",     title: "В работе",        count: 110 },
  { id: "proposal", title: "Ком. предложение",count: 64  },
  { id: "order",    title: "Заказ",           count: 49  },
] as const;

// Тренд времени реакции
export const FUNNEL_TREND = [
  { date: "2025-09-26", medianMinutes: 58, avgMinutes: 74 },
  { date: "2025-09-27", medianMinutes: 54, avgMinutes: 70 },
  { date: "2025-09-28", medianMinutes: 62, avgMinutes: 78 },
  { date: "2025-09-29", medianMinutes: 49, avgMinutes: 67 },
  { date: "2025-09-30", medianMinutes: 47, avgMinutes: 64 },
  { date: "2025-10-01", medianMinutes: 51, avgMinutes: 69 },
  { date: "2025-10-02", medianMinutes: 45, avgMinutes: 61 },
] as const;

// Эффективность ответственных
export const OWNERS_TABLE = [
  { name: "Анна",    leads: 62, deals: 28, orders: 21, conv: 34, medianRespMin: 43 },
  { name: "Олег",    leads: 58, deals: 24, orders: 18, conv: 31, medianRespMin: 51 },
  { name: "Мария",   leads: 54, deals: 22, orders: 17, conv: 31, medianRespMin: 46 },
  { name: "Дмитрий", leads: 48, deals: 19, orders: 15, conv: 31, medianRespMin: 57 },
] as const;

// Утилиты (по желанию)
export const FUNNEL_BY_ID = Object.fromEntries(
  FUNNEL_STAGES.map(s => [s.id, s])
) as Record<FunnelStageId, FunnelStage>;

export const TOTAL_LEADS = FUNNEL_STAGES.reduce((s, x) => s + x.count, 0);
export const CONV_OVERALL = (() => {
  const from = FUNNEL_BY_ID.new.count;
  const to = FUNNEL_BY_ID.order.count;
  return from ? Math.round((to / from) * 100) : 0;
})();