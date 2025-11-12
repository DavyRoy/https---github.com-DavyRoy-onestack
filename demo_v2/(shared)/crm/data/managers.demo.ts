import type { Segment } from "../types";

/** Сегменты клиентов (демо, стабильно) */
export const ADMIN_CRM_SEGMENTS: Segment[] = [
  {
    id: "s1",
    name: "VIP",
    type: "tag",
    size: 23,
    updatedAt: "2025-10-01T10:00:00Z",
    rulesBrief: "#vip",
    autoUpdate: true,
  },
  {
    id: "s2",
    name: "Churn >90д",
    type: "dynamic",
    size: 7,
    updatedAt: "2025-10-02T09:00:00Z",
    rulesBrief: "no activity > 90d",
    autoUpdate: true,
  },
  {
    id: "s3",
    name: "B2B клиенты",
    type: "static",
    size: 12,
    updatedAt: "2025-09-22T15:00:00Z",
    rulesBrief: "manual list",
  },
  {
    id: "s4",
    name: "Новые (30д)",
    type: "dynamic",
    size: 9,
    updatedAt: "2025-10-05T08:30:00Z",
    rulesBrief: "created < 30d",
    autoUpdate: true,
  },
  {
    id: "s5",
    name: "Без покупок >180д",
    type: "dynamic",
    size: 5,
    updatedAt: "2025-09-28T12:00:00Z",
    rulesBrief: "ltv=0, last order >180d",
    autoUpdate: true,
  },
];