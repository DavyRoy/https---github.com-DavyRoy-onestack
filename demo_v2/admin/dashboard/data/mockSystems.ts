export const systems = [
  {
    id: "pay",
    title: "Провайдер оплаты",
    status: "ok" as const,
    note: "Пинг 320мс, ошибок нет",
    href: "/demo/admin/payments/providers",
  },
  {
    id: "webhooks",
    title: "Вебхуки",
    status: "warn" as const,
    note: "Ретраи 2.1%, проверить 3 эндпоинта",
    href: "/demo/admin/integrations/webhooks",
  },
  {
    id: "mail",
    title: "Интеграция E-mail",
    status: "ok" as const,
    note: "Отправка стабильна",
    href: "/demo/admin/integrations",
  },
  {
    id: "messenger",
    title: "Мессенджеры",
    status: "error" as const,
    note: "Ошибка токена, требуется переподключение",
    href: "/demo/admin/integrations",
  },
  {
    id: "billing",
    title: "Квоты/лимиты тарифа",
    status: "warn" as const,
    note: "Использование 78% (API calls)",
    href: "/demo/admin/billing/usage",
  },
];