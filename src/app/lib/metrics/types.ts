// lib/metrics/types.ts
export type DashboardPeriod = "7d" | "30d" | "q" | "y";
export type DashboardChannel = "all" | "online" | "manager";
export type DashboardLocation = "all" | "center" | "south" | "north";
export type DashboardCurrency = "RUB" | "KRW" | "USD";

export type AccessRole = { role: string; count: number };
export type AccessMetrics = {
  users: number;
  sessions: number;
  byRole: AccessRole[];
};

export type AlertSeverity = "warn" | "critical";
export type AlertItem = {
  id: string;
  severity: AlertSeverity;
  title: string;
  hint?: string;
  href: string;
  createdAt?: string; // ISO
};

export type ChannelMixItem = { id: string; label: string; value: number };

export type LocationItem = { id: string; label: string; value: number };

export type OpsHealthMetrics = {
  cancellations: number;     // %
  noshow: number;            // %
  firstResponseMin: number;  // minutes
  sla: number;               // %
};

export type KpiKind = "count" | "money";
export type KpiItem = {
  id: string;
  title: string;
  value: number;
  delta: number; // %
  kind: KpiKind;
  currency?: DashboardCurrency | string;
  caption?: string;
  href?: string;
  trend?: number[];
};

export type TrendPoint = { date: string; revenue: number };
export type RevenueTrend = {
  points: TrendPoint[];
  min: number;
  max: number;
};

export type ServiceCategoryItem = {
  id: string;
  label: string;
  value: number;
  currency?: string;
};

export type SystemStatus = "ok" | "warn" | "error";
export type SystemItem = {
  id: string;
  title: string;
  note: string;
  href: string;
  status: SystemStatus;
};