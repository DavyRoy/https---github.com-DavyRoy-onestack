export const AUDIT_STATS = [
  { label:"Событий за 24ч", value:"1 284", href:"/demo/admin/audit/logs?range=24h" },
  { label:"Ошибок/исключений", value:"37", href:"/demo/admin/audit/logs?level=error", hint:"за 24ч" },
  { label:"Критичные изменения", value:"5", href:"/demo/admin/audit/logs?critical=true" },
  { label:"Деградации", value:"2", href:"/demo/admin/audit/health?range=24h" },
];

export const AUDIT_LOGS = [
  {
    id:"a1009", ts:"2025-10-06T10:32:11Z", user:"admin@example.com", role:"Admin",
    module:"rbac", action:"permission_change", entityType:"role", entityId:"manager",
    level:"info", critical:true, ip:"203.0.113.9", ua:"Chrome/124", sessionId:"sess_9",
    traceId:"tr_910", requestId:"req_910",
    before:{ permissions:["orders.read"] },
    after:{ permissions:["orders.read","payments.read"] },
    payload:{ added:["payments.read"] }, result:"ok",
    links:[{ type:"role", id:"manager", href:"/demo/admin/users/roles/manager" }]
  },
  {
    id:"a1008", ts:"2025-10-06T10:20:01Z", user:"ops@example.com", role:"Admin",
    module:"integrations", action:"webhook.pause", entityType:"webhook", entityId:"wh_12",
    level:"warn", critical:false, ip:"203.0.113.7", ua:"Safari/17", sessionId:"sess_8",
    traceId:"tr_908", requestId:"req_908",
    before:{ status:"active" }, after:{ status:"paused" }, payload:{ reason:"spike" }, result:"ok",
    links:[{ type:"webhook", id:"wh_12", href:"/demo/admin/integrations/webhooks/wh_12" }]
  },
  {
    id:"a1007", ts:"2025-10-06T09:58:33Z", user:"user@example.com", role:"Manager",
    module:"orders", action:"status_change", entityType:"order", entityId:"10345",
    level:"info", critical:false, ip:"198.51.100.22", ua:"Firefox/123", sessionId:"sess_7",
    traceId:"tr_907", requestId:"req_907",
    before:{ status:"confirmed" }, after:{ status:"paid" }, payload:{ paymentId:"p_778" }, result:"ok",
    links:[{ type:"order", id:"10345", href:"/demo/admin/orders/10345" }]
  },
  {
    id:"a1006", ts:"2025-10-06T09:10:11Z", user:"system", role:"System",
    module:"webhooks", action:"delivery.failed", entityType:"delivery", entityId:"d_5001",
    level:"error", critical:false, ip:"127.0.0.1", ua:"worker", sessionId:"-", traceId:"tr_901", requestId:"req_901",
    before:null, after:null, payload:{ endpoint:"/hooks/x", status:500 }, result:"failed",
    links:[{ type:"webhook", id:"wh_9", href:"/demo/admin/integrations/webhooks/wh_9" }]
  },
];