// стабильные демо-данные без рандома в рендере
export type Provider = {
  id: string;
  name: string;
  methods: Array<"card" | "invoice" | "cash" | "bank">;
  currencies: Array<"RUB" | "KRW" | "USD">;
  status: "ok" | "degraded" | "down";
  latencyP95: number; // ms
  failRate: number; // %
  lastCheckISO: string;
};

export const ADMIN_PAYMENTS_KPI = {
  revenue: 12435000, // ₽ (демо)
  successRate: 94.2,
  successCount: 1832,
  failRate: 2.9,
  refundsCount: 37,
  refundsAmount: 412000,
  latencyP95: 380,
};

export const ADMIN_PAYMENTS_TREND: Array<{
  date: string; authorized: number; captured: number; paid: number; failed: number;
}> = [
  { date: "2025-10-01", authorized: 280, captured: 250, paid: 240, failed: 8 },
  { date: "2025-10-02", authorized: 310, captured: 270, paid: 265, failed: 9 },
  { date: "2025-10-03", authorized: 295, captured: 260, paid: 255, failed: 7 },
  { date: "2025-10-04", authorized: 305, captured: 275, paid: 270, failed: 10 },
  { date: "2025-10-05", authorized: 288, captured: 260, paid: 254, failed: 6 },
  { date: "2025-10-06", authorized: 312, captured: 281, paid: 276, failed: 8 },
  { date: "2025-10-07", authorized: 300, captured: 270, paid: 268, failed: 9 },
];

export const ADMIN_METHOD_SPLIT = [
  { method: "card", share: 0.61 },
  { method: "invoice", share: 0.22 },
  { method: "cash", share: 0.09 },
  { method: "bank", share: 0.08 },
];

export const ADMIN_PROVIDERS: Provider[] = [
  {
    id: "prov_demo",
    name: "DemoPay",
    methods: ["card"],
    currencies: ["RUB", "KRW", "USD"],
    status: "ok",
    latencyP95: 340,
    failRate: 2.1,
    lastCheckISO: "2025-10-07T09:30:00Z",
  },
  {
    id: "prov_alt",
    name: "AltPay",
    methods: ["card", "bank"],
    currencies: ["RUB", "USD"],
    status: "degraded",
    latencyP95: 520,
    failRate: 4.3,
    lastCheckISO: "2025-10-07T09:29:00Z",
  },
  {
    id: "prov_bill",
    name: "BillPro",
    methods: ["invoice"],
    currencies: ["RUB", "KRW"],
    status: "ok",
    latencyP95: 410,
    failRate: 1.2,
    lastCheckISO: "2025-10-07T09:28:00Z",
  },
];

export const ADMIN_WEBHOOKS = {
  delivered: 1289,
  retry: 34,
  failed: 6,
};

export const ADMIN_RECONCILIATION = {
  ordersAmount: 12876000,
  paymentsAmount: 12435000,
  delta: 441000,
  mismatches: [
    { id: "ORD-1001", type: "order", amount: 52000, href: "/demo/manager/orders/ORD-1001" },
    { id: "P-20251005-019", type: "payment", amount: -31000, href: "/demo/manager/payments/P-20251005-019" },
  ],
};

export const ADMIN_ALERTS = [
  { id: "a1", severity: "critical", title: "Spike отказов (card) ↑", hint: "Проверьте AltPay: failRate > 4%" },
  { id: "a2", severity: "warn", title: "Latency P95 на грани SLO", hint: "DemoPay ~ 340ms (порог 350ms)" },
];