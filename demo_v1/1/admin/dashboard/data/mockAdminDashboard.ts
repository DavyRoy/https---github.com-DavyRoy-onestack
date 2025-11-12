// Стабильные моки без рандома (чтобы не было hydration-расхождений)

export function mockOrgKpi({
  period,
  channel,
  location,
  currency,
}: {
  period: string;
  channel: string;
  location: string;
  currency: string;
}) {
  // Небольшая вариативность через константные множители
  const mult = period === "7d" ? 0.25 : period === "q" ? 3 : period === "y" ? 12 : 1;
  const ch = channel === "online" ? 0.55 : channel === "manager" ? 0.45 : 1;
  const loc = location === "all" ? 1 : 0.6;

  return [
    {
      id: "revenue",
      title: "Выручка",
      value: Math.round(12_000_000 * mult * ch * loc),
      currency,
      kind: "money" as const,
      delta: 8,
      caption: "к предыдущему периоду +8%",
      href: `/demo/manager/reports/sales?range=${period}`,
    },
    {
      id: "orders",
      title: "Заказы",
      value: Math.round(4200 * mult * ch * loc),
      currency,
      kind: "count" as const,
      delta: 3,
      caption: "к предыдущему +3%",
      href: `/demo/manager/orders?date_from=period:${period}`,
    },
    {
      id: "mau",
      title: "Активные пользователи (MAU)",
      value: Math.round(18000 * mult),
      currency,
      kind: "count" as const,
      delta: -2,
      caption: "к предыдущему −2%",
      href: `/demo/manager/reports/crm?focus=clients`,
    },
    {
      id: "aov",
      title: "Средний чек (AOV)",
      value: Math.round(2850 * ch),
      currency,
      kind: "money" as const,
      delta: 1,
      caption: "к предыдущему +1%",
      href: `/demo/manager/reports/sales?focus=aov`,
    },
    {
      id: "ltv",
      title: "LTV (демо)",
      value: Math.round(12500 * ch),
      currency,
      kind: "money" as const,
      delta: 0,
      caption: "к предыдущему 0%",
      href: `/demo/admin/reports/cohorts`,
    },
    {
      id: "util",
      title: "Utilization",
      value: 63,
      currency,
      kind: "count" as const,
      delta: 5,
      caption: "ср. загрузка слотов",
      href: `/demo/manager/reports/booking?focus=utilization`,
    },
  ];
}

export function mockRevenueTrend({
  period,
  channel,
  location,
}: {
  period: string;
  channel: string;
  location: string;
}) {
  const len = period === "7d" ? 7 : period === "q" ? 90 : period === "y" ? 365 : 30;
  // Даты — фиктивные ISO YYYY-MM-DD (последние len дней относительно «2025-10-01»)
  const base = new Date("2025-10-01T00:00:00Z");
  const pts = Array.from({ length: len }, (_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() - (len - 1 - i));
    const date = d.toISOString().slice(0, 10);
    const revenue = 100_000 + i * 2_000; // линейный рост для наглядности
    return { date, revenue };
  });
  const min = Math.min(...pts.map((x) => x.revenue));
  const max = Math.max(...pts.map((x) => x.revenue));
  return { points: pts, min, max };
}

export function mockChannelMix({
  period,
  channel,
  location,
}: {
  period: string;
  channel: string;
  location: string;
}) {
  // Статичная доля
  return [
    { id: "online", label: "Online", value: 58 },
    { id: "manager", label: "Менеджер", value: 42 },
  ];
}

export function mockLocationBreakdown({
  period,
  channel,
}: {
  period: string;
  channel: string;
}) {
  return [
    { id: "center", label: "Центр", value: 4_200_000 },
    { id: "south", label: "Юг", value: 2_900_000 },
    { id: "north", label: "Север", value: 1_850_000 },
    { id: "west", label: "Запад", value: 1_300_000 },
  ];
}

export function mockServiceCategories({
  period,
  channel,
}: {
  period: string;
  channel: string;
}) {
  return [
    { id: "hair", label: "Волосы", value: 2_450_000 },
    { id: "nails", label: "Ногти", value: 1_780_000 },
    { id: "spa", label: "SPA", value: 1_120_000 },
    { id: "face", label: "Лицо", value: 980_000 },
    { id: "brows", label: "Брови", value: 760_000 },
  ];
}

export function mockOpsHealth({ period }: { period: string }) {
  return {
    cancellations: 7.2,
    noshow: 3.4,
    firstResponseMin: 18,
    sla: 92,
  };
}

export function mockAccess() {
  return {
    users: 46,
    sessions: 18,
    byRole: [
      { role: "Администратор", count: 4 },
      { role: "Менеджер", count: 12 },
      { role: "Пользователь", count: 30 },
    ],
  };
}

export function mockCompliance() {
  return {
    exportNote: "Последний экспорт: 3 дня назад",
    retentionNote: "Политика хранения: 365 дней (демо)",
    dpaNote: "DPA подписано (демо)",
  };
}

export function mockAudit() {
  return [
    { id: "a1", time: "10:42", user: "admin@example.com", text: "Роль изменена у user@example.com (Менеджер → Пользователь)" },
    { id: "a2", time: "10:15", user: "ops@example.com", text: "Webhook отключён для test-endpoint" },
    { id: "a3", time: "09:58", user: "it@example.com", text: "Включён DPA (демо)" },
    { id: "a4", time: "09:20", user: "admin@example.com", text: "Лимит тарифа увеличен (демо)" },
  ];
}

export function mockAlerts() {
  return [
    {
      id: "al1",
      severity: "critical" as const,
      title: "Провайдер оплаты: рост отказов авторизации в последний час",
      hint: "Проверьте статус провайдера и ретраи",
      href: "/demo/admin/payments/providers",
    },
    {
      id: "al2",
      severity: "warn" as const,
      title: "Webhook delivery failures > 5%",
      hint: "Есть недоставленные события, проверьте подписи/URL",
      href: "/demo/admin/integrations/webhooks?status=failed",
    },
    {
      id: "al3",
      severity: "warn" as const,
      title: "No-show вырос в локации Центр",
      hint: "Откройте отчёт бронирований и проверьте причины",
      href: "/demo/manager/reports/booking?location=center",
    },
  ];
}