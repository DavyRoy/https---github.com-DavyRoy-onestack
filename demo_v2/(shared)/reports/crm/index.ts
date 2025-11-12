// app/demo/(shared)/crm/index.ts
// Демо-данные для CRM-аналитики (лиды, сделки, источники и сегменты)

/* ===== Типы ===== */
export type CrmKpi = {
  leads: number;
  deals: number;
  orders: number;
  funnelConvPct: number;
  firstResponseMin: number;
  cycleDays: number;
  deltaConvPct: number;
};

export type CrmBySource = {
  source: string;
  leads: number;
  convPct: number;
};

export type CrmFunnelStage = {
  stage: string;
  value: number;
};

export type CrmResponseTrend = {
  date: string;     // YYYY-MM-DD
  median: number;
  avg: number;
  leads: number;
};

export type CrmSegment = {
  label: string;
  value: number;    // 0..1
};

/* ===== Данные ===== */

export const ADMIN_CRM_KPI: CrmKpi = {
  leads: 1320,
  deals: 620,
  orders: 480,
  funnelConvPct: 36.4,
  firstResponseMin: 28,
  cycleDays: 6.2,
  deltaConvPct: -1.2,
};

export const ADMIN_CRM_BY_SOURCE: CrmBySource[] = [
  { source: "site", leads: 520, convPct: 34 },
  { source: "call", leads: 360, convPct: 42 },
  { source: "chat", leads: 260, convPct: 31 },
  { source: "ads",  leads: 180, convPct: 28 },
];

export const ADMIN_CRM_FUNNEL: CrmFunnelStage[] = [
  { stage: "new", value: 1320 },
  { stage: "qualification", value: 980 },
  { stage: "proposal", value: 740 },
  { stage: "negotiation", value: 580 },
  { stage: "won", value: 480 },
];

export const ADMIN_CRM_RESPONSE_TREND: CrmResponseTrend[] = [
  { date: "2025-10-01", median: 28, avg: 35, leads: 180 },
  { date: "2025-10-02", median: 26, avg: 32, leads: 190 },
  { date: "2025-10-03", median: 30, avg: 36, leads: 200 },
  { date: "2025-10-04", median: 27, avg: 33, leads: 210 },
  { date: "2025-10-05", median: 25, avg: 31, leads: 230 },
];

export const ADMIN_SEGMENTS_DONUT: CrmSegment[] = [
  { label: "VIP", value: 0.12 },
  { label: "Частые", value: 0.38 },
  { label: "Новые", value: 0.33 },
  { label: "Редкие", value: 0.17 },
];