// lib/metrics/client.ts
import {
  AccessMetrics,
  AlertItem,
  ChannelMixItem,
  LocationItem,
  OpsHealthMetrics,
  KpiItem,
  RevenueTrend,
  ServiceCategoryItem,
  SystemItem,
} from "./types";

type CommonParams = Record<string, string | number | undefined | null>;
function qs(params: CommonParams) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  });
  return sp.toString();
}

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

export const MetricsClient = {
  getAccessOverview(p: CommonParams) {
    return getJSON<AccessMetrics>(`/api/metrics/access?${qs(p)}`);
  },
  getAlerts() {
    return getJSON<AlertItem[]>(`/api/metrics/alerts`);
  },
  getChannelMix(p: CommonParams) {
    return getJSON<ChannelMixItem[]>(`/api/metrics/channel-mix?${qs(p)}`);
  },
  getLocationBreakdown(p: CommonParams) {
    return getJSON<LocationItem[]>(`/api/metrics/location-breakdown?${qs(p)}`);
  },
  getOpsHealth(p: CommonParams) {
    return getJSON<OpsHealthMetrics>(`/api/metrics/ops-health?${qs(p)}`);
  },
  getOrgKpi(p: CommonParams) {
    return getJSON<KpiItem[]>(`/api/metrics/org-kpi?${qs(p)}`);
  },
  getRevenueTrend(p: CommonParams) {
    return getJSON<RevenueTrend>(`/api/metrics/revenue-trend?${qs(p)}`);
  },
  getServiceCategories(p: CommonParams) {
    return getJSON<ServiceCategoryItem[]>(`/api/metrics/service-categories?${qs(p)}`);
  },
  getSystemsStatus() {
    return getJSON<SystemItem[]>(`/api/metrics/systems-status`);
  },
};