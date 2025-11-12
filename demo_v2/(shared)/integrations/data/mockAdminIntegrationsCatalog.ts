// стабильные демо-данные каталога интеграций

export type CatalogItem = {
  id: string;
  name: string;
  category: "marketing" | "payments" | "analytics" | "messaging" | "automation";
  status: "available" | "coming-soon";
  description: string;
  link: string; // куда вести при "Подключить"
};

export const CATALOG: CatalogItem[] = [
  { id: "sendgrid", name: "SendGrid", category: "messaging", status: "available", description: "Email API и шаблоны.", link: "/demo/admin/integrations/channels" },
  { id: "mailgun", name: "Mailgun", category: "messaging", status: "available", description: "Доставка писем, отслеживание.", link: "/demo/admin/integrations/channels" },
  { id: "twilio", name: "Twilio", category: "messaging", status: "available", description: "SMS и мессенджеры.", link: "/demo/admin/integrations/channels" },
  { id: "zapier", name: "Zapier", category: "automation", status: "coming-soon", description: "Свяжите с сотнями приложений.", link: "#" },
  { id: "ga4", name: "Google Analytics 4", category: "analytics", status: "coming-soon", description: "Отслеживание событий и конверсий.", link: "#" },
];