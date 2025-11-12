export type Webhook = {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string; // masked
  status: "ok" | "degraded" | "down" | "paused";
  lastDeliveryAt?: string;
  verify: "signature" | "none";
};

export const WEBHOOKS: Webhook[] = [
  {
    id: "wh_orders",
    name: "Orders ERP",
    url: "https://erp.example.com/webhooks/orders",
    events: ["order.created", "order.paid", "order.cancelled"],
    secret: "whsec_****…****",
    status: "ok",
    lastDeliveryAt: "2025-10-01T10:08:00Z",
    verify: "signature",
  },
  {
    id: "wh_payments",
    name: "Payments BI",
    url: "https://bi.example.com/hooks/payments",
    events: ["payment.paid", "payment.refunded"],
    secret: "whsec_****…****",
    status: "degraded",
    lastDeliveryAt: "2025-10-01T10:02:00Z",
    verify: "signature",
  },
  {
    id: "wh_booking",
    name: "Booking Analytics",
    url: "https://analytics.example.com/hooks/booking",
    events: ["booking.created", "booking.rescheduled", "booking.cancelled"],
    secret: "whsec_****…****",
    status: "ok",
    lastDeliveryAt: "2025-10-01T09:55:00Z",
    verify: "none",
  },
];

export type Delivery = {
  id: string;
  webhookId: string;
  event: string;
  status: "delivered" | "retry" | "failed";
  attempt: number;
  latencyMs: number;
  createdAt: string;
  responseCode: number;
  payloadPreview: string;
};

export const DELIVERIES: Delivery[] = [
  {
    id: "d_1001",
    webhookId: "wh_orders",
    event: "order.created",
    status: "delivered",
    attempt: 1,
    latencyMs: 182,
    createdAt: "2025-10-01T10:08:03Z",
    responseCode: 200,
    payloadPreview: '{"id":"O-123","amount":12000}',
  },
  {
    id: "d_1002",
    webhookId: "wh_payments",
    event: "payment.paid",
    status: "retry",
    attempt: 2,
    latencyMs: 910,
    createdAt: "2025-10-01T10:05:09Z",
    responseCode: 500,
    payloadPreview: '{"id":"P-777","amount":3600}',
  },
  {
    id: "d_1003",
    webhookId: "wh_booking",
    event: "booking.created",
    status: "delivered",
    attempt: 1,
    latencyMs: 120,
    createdAt: "2025-10-01T09:56:01Z",
    responseCode: 200,
    payloadPreview: '{"id":"B-555","service":"Massage"}',
  },
];

export const WEBHOOK_STATS = {
  delivered24h: 2100,
  failed24h: 22,
  retry24h: 11,
};