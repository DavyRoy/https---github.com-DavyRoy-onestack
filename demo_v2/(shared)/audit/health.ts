// src/app/demo/(shared)/audit/health.ts

export type HealthSloItem = {
  label: string;
  value: string;   // например "99.91%" или "420 ms"
  hint?: string;   // подпись "за 30д", "за 24ч"
};

export type ProviderStatus = "ok" | "degraded" | "down" | "paused";
export type ProviderKind = "payments" | "email" | "sms" | "messaging" | "webhooks" | "other";

export type HealthProvider = {
  id: string;
  name: string;
  kind: ProviderKind;
  status: ProviderStatus;
  latencyP95: number; // ms
  failRate: number;   // %
  checkedAt: string;  // "HH:MM"
  href: string;       // роут для drilldown
};

export type HealthWebhook = {
  id: string;
  name: string;
  url: string;
  count24h: number;
  failPct: string;   // строкой, как в исходнике ("1.4%")
  retryPct: string;  // строкой ("0.6%")
  latencyMed: number;
};

export type HealthIncident = {
  id: string;
  title: string;
  startedAt: string;       // "HH:MM"
  endedAt: string | null;  // null = ещё идёт
  services: ("integrations" | "email" | "webhooks" | "payments" | "orders" | "booking" | "other")[];
  status: "resolved" | "monitoring" | "investigating";
  rca: string;             // краткая причина
};

// ---- Демо-данные ----

export const HEALTH_SLO: HealthSloItem[] = [
  { label:"Аптайм",        value:"99.91%", hint:"за 30д" },
  { label:"Latency P95",   value:"420 ms", hint:"среднее за 24ч" },
  { label:"Error rate",    value:"0.42%",  hint:"за 24ч" },
  { label:"Webhooks median", value:"180 ms", hint:"за 24ч" },
];

export const HEALTH_PROVIDERS: HealthProvider[] = [
  { id:"pay_demo",  name:"DemoPay",   kind:"payments", status:"ok",       latencyP95:380, failRate:0.3, checkedAt:"10:30", href:"/demo/admin/payments/providers/pay_demo" },
  { id:"mail_send", name:"SendGrid",  kind:"email",    status:"degraded", latencyP95:520, failRate:1.2, checkedAt:"10:29", href:"/demo/admin/integrations/channels/sendgrid" },
  { id:"sms_twilio",name:"Twilio",    kind:"sms",      status:"ok",       latencyP95:210, failRate:0.1, checkedAt:"10:28", href:"/demo/admin/integrations/channels/twilio" },
];

export const HEALTH_WEBHOOKS: HealthWebhook[] = [
  { id:"wh_orders",   name:"Orders sink",   url:"https://example.com/hooks/orders",   count24h:4200, failPct:"1.4%", retryPct:"0.6%", latencyMed:170 },
  { id:"wh_payments", name:"Payments sink", url:"https://example.com/hooks/payments", count24h:3100, failPct:"0.4%", retryPct:"0.2%", latencyMed:160 },
];

export const HEALTH_INCIDENTS: HealthIncident[] = [
  { id:"inc_24", title:"Spike fail rate: SendGrid", startedAt:"09:40", endedAt:"10:05", services:["integrations","email"], status:"resolved",     rca:"Провайдерная деградация" },
  { id:"inc_23", title:"Webhook latency ↑",         startedAt:"08:10", endedAt:null,   services:["webhooks"],             status:"monitoring",  rca:"Рост входящего трафика" },
];