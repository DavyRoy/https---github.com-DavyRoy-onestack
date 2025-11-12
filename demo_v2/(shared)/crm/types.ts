/* Клиенты и пользователи */
export type AdminClient = {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  tags: string[];
  city?: string;
  country?: string;
  lastActivityAt?: string; // ISO
  orders: number;
  ltv: number;             // ₽ (демо)
  managerId?: string;
};

export type AdminUser = { id: string; name: string };

/* Источники лидов */
export type LeadSource = {
  id: string;
  name: string;
  channel: "site" | "call" | "chat" | "ads" | "other";
  active: boolean;
};

/* Пайплайны/воронки */
export type PipelineStage = {
  id: string;
  name: string;
  probability?: number; // 0..100
  slaHours?: number;    // целевой срок реакции
  color?: string;       // hex
};

export type Pipeline = {
  id: string;
  name: string;
  target: "B2C" | "B2B";
  active: boolean;
  stages: PipelineStage[];
};

/* Сегменты */
export type Segment = {
  id: string;
  name: string;
  type: "tag" | "dynamic" | "static";
  size: number;
  updatedAt: string; // ISO
  rulesBrief?: string;
  autoUpdate?: boolean;
};