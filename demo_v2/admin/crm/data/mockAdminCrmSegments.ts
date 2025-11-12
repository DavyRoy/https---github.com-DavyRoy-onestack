export type Segment = {
  id: string;
  name: string;
  type: "tag"|"dynamic"|"static";
  size: number;
  updatedAt: string; // ISO
  rulesBrief?: string;
  autoUpdate?: boolean;
};
export const ADMIN_CRM_SEGMENTS: Segment[] = [
  { id:"s1", name:"VIP", type:"tag", size: 23, updatedAt:"2025-10-01T10:00:00Z", rulesBrief:"#vip", autoUpdate:true },
  { id:"s2", name:"Churn >90д", type:"dynamic", size: 7, updatedAt:"2025-10-02T09:00:00Z", rulesBrief:"no activity > 90d", autoUpdate:true },
  { id:"s3", name:"B2B клиенты", type:"static", size: 12, updatedAt:"2025-09-22T15:00:00Z", rulesBrief:"manual list" },
];