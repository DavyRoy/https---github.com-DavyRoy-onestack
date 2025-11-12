// app/demo/admin/components/adminNav.data.ts  — общая схема навигации (SERVER/CLIENT-agnostic)
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Store,
  Briefcase,
  CalendarDays,
  Users2,
  CreditCard,
  Plug,
  ChartSpline,
  ShieldCheck,
  Shield,
  LifeBuoy,
  LogOut,
  Settings,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: Array<{ label: string; href: string }>;
};
export type NavGroup = { title: string; items: NavItem[] };

export const groups: NavGroup[] = [
  {
    title: "Обзор",
    items: [{ label: "Дашборд", href: "/demo/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Коммерция",
    items: [
      {
        label: "Магазин",
        href: "/demo/admin/shop",
        icon: Store,
        children: [
          { label: "Магазин", href: "/demo/admin/shop" },
          { label: "Товары", href: "/demo/admin/shop/products" },
          { label: "Категории", href: "/demo/admin/shop/categories" },
          { label: "Заказы", href: "/demo/admin/orders" },
        ],
      },
      {
        label: "Услуги",
        href: "/demo/admin/services",
        icon: Briefcase,
        children: [
          { label: "Услуги", href: "/demo/admin/services" },
          { label: "Прайс-лист", href: "/demo/admin/services/pricing" },
          { label: "Категории услуг", href: "/demo/admin/services/categories" },
          { label: "Пакеты", href: "/demo/admin/services/bundles" },
        ],
      },
      {
        label: "Бронирование",
        href: "/demo/admin/booking",
        icon: CalendarDays,
        children: [
          { label: "Бронирование", href: "/demo/admin/booking" },
          { label: "Расписания", href: "/demo/admin/booking/schedules" },
          { label: "Политики", href: "/demo/admin/booking/policies" },
          { label: "Календарь", href: "/demo/admin/calendar" },
        ],
      },
    ],
  },
  {
    title: "CRM",
    items: [
      {
        label: "CRM",
        href: "/demo/admin/crm",
        icon: Users2,
        children: [
          { label: "CRM", href: "/demo/admin/crm" },
          { label: "Клиенты", href: "/demo/admin/crm/clients" },
          { label: "Источники / воронки", href: "/demo/admin/crm/pipelines" },
          { label: "Сегменты", href: "/demo/admin/crm/segments" },
        ],
      },
    ],
  },
  {
    title: "Финансы",
    items: [
      {
        label: "Платежи",
        href: "/demo/admin/payments",
        icon: CreditCard,
        children: [
          { label: "Финансы", href: "/demo/admin/payments" },
          { label: "Провайдеры", href: "/demo/admin/payments/providers" },
          { label: "Тарифы/комиссии", href: "/demo/admin/payments/fees" },
        ],
      },
    ],
  },
  {
    title: "Отчёты",
    items: [
      {
        label: "Аналитика",
        href: "/demo/admin/reports",
        icon: ChartSpline,
        children: [
          { label: "Отчеты", href: "/demo/admin/reports" },
          { label: "Продажи и выручка", href: "/demo/admin/reports/sales" },
          { label: "Бронирования", href: "/demo/admin/reports/booking" },
          { label: "CRM-конверсия", href: "/demo/admin/reports/crm" },
        ],
      },
    ],
  },
  {
    title: "Управление доступом",
    items: [
      {
        label: "Пользователи и роли",
        href: "/demo/admin/users",
        icon: Shield,
        children: [
          { label: "Управление доступом", href: "/demo/admin/users" },
          { label: "Пользователи", href: "/demo/admin/users/list" },
          { label: "Роли", href: "/demo/admin/users/roles" },
          { label: "Права", href: "/demo/admin/users/permissions" },
        ],
      },
    ],
  },
  {
    title: "Интеграции",
    items: [
      {
        label: "Интеграции",
        href: "/demo/admin/integrations",
        icon: Plug,
        children: [
          { label: "Интеграция", href: "/demo/admin/integrations" },
          { label: "Каналы", href: "/demo/admin/integrations/channels" },
          { label: "Вебхуки", href: "/demo/admin/integrations/webhooks" },
          { label: "Каталог", href: "/demo/admin/integrations/catalog" },
        ],
      },
    ],
  },
  {
    title: "Система",
    items: [
      {
        label: "Настройки",
        href: "/demo/admin/settings",
        icon: Settings,
        children: [
          { label: "Система", href: "/demo/admin/settings" },
          { label: "Бизнес", href: "/demo/admin/settings/business" },
          { label: "Налоги", href: "/demo/admin/settings/taxes" },
          { label: "Валюта/форматы", href: "/demo/admin/settings/currency" },
          { label: "Брендинг", href: "/demo/admin/settings/branding" },
        ],
      },
      {
        label: "Аудит",
        href: "/demo/admin/audit",
        icon: ShieldCheck,
        children: [
          { label: "Аудидт", href: "/demo/admin/audit" },
          { label: "Журнал", href: "/demo/admin/audit/logs" },
          { label: "Состояние", href: "/demo/admin/audit/health" },
        ],
      },
    ],
  },
  { title: "Сессия", items: [{ label: "Выход", href: "/demo/admin/login", icon: LogOut }] },
];

export const titleMap: Record<string, string> = {
  demo: "Демо",
  admin: "Администратор",
  dashboard: "Дашборд",
  shop: "Магазин",
  products: "Товары",
  categories: "Категории",
  orders: "Заказы",
  services: "Услуги",
  pricing: "Прайс-лист",
  bundles: "Пакеты",
  booking: "Бронирование",
  schedules: "Расписания",
  policies: "Политики",
  calendar: "Календарь",
  crm: "CRM",
  clients: "Клиенты",
  pipelines: "Воронки",
  segments: "Сегменты",
  payments: "Платежи",
  providers: "Провайдеры",
  fees: "Тарифы",
  reports: "Отчёты",
  sales: "Продажи",
  // bookingreport было неиспользуемым и путало — убрал
  users: "Пользователи",
  list: "Список",
  roles: "Роли",
  permissions: "Права",
  integrations: "Интеграции",
  channels: "Каналы",
  webhooks: "Вебхуки",
  catalog: "Каталог",
  settings: "Настройки",
  business: "Бизнес",
  taxes: "Налоги",
  currency: "Валюта",
  branding: "Брендинг",
  audit: "Аудит",
  logs: "Журнал",
  health: "Состояние",
  login: "Вход",
};