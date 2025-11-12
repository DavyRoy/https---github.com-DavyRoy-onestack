export const HEALTH_SLO = [
  { label:"Аптайм", value:"99.91%", hint:"за 30д" },
  { label:"Latency P95", value:"420 ms", hint:"среднее за 24ч" },
  { label:"Error rate", value:"0.42%", hint:"за 24ч" },
  { label:"Webhooks median", value:"180 ms", hint:"за 24ч" },
];

export const HEALTH_PROVIDERS = [
  { id:"pay_demo", name:"DemoPay", kind:"payments", status:"ok", latencyP95:380, failRate:0.3, checkedAt:"10:30", href:"/demo/admin/payments/providers/pay_demo" },
  { id:"mail_send", name:"SendGrid", kind:"email", status:"degraded", latencyP95:520, failRate:1.2, checkedAt:"10:29", href:"/demo/admin/integrations/channels/sendgrid" },
  { id:"sms_twilio", name:"Twilio", kind:"sms", status:"ok", latencyP95:210, failRate:0.1, checkedAt:"10:28", href:"/demo/admin/integrations/channels/twilio" },
];

export const HEALTH_WEBHOOKS = [
  { id:"wh_orders", name:"Orders sink", url:"https://example.com/hooks/orders", count24h:4200, failPct:"1.4%", retryPct:"0.6%", latencyMed:170 },
  { id:"wh_payments", name:"Payments sink", url:"https://example.com/hooks/payments", count24h:3100, failPct:"0.4%", retryPct:"0.2%", latencyMed:160 },
];

export const HEALTH_INCIDENTS = [
  { id:"inc_24", title:"Spike fail rate: SendGrid", startedAt:"09:40", endedAt:"10:05", services:["integrations","email"], status:"resolved", rca:"Провайдерная деградация" },
  { id:"inc_23", title:"Webhook latency ↑", startedAt:"08:10", endedAt:null, services:["webhooks"], status:"monitoring", rca:"Рост входящего трафика" },
];