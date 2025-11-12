// app/demo/manager/components/managerNav.data.ts — общая схема навигации (SERVER/CLIENT-agnostic)
import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  Users2,
  Workflow,
  ClipboardList,
  Receipt,
  CalendarDays,
  Calendar,
  CreditCard,
  FileBarChart2,
  Settings,
  Pin,
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
    items: [
      { href: "/demo/manager/dashboard", label: "Дашборд", icon: LayoutGrid },
    ],
  },
  {
    title: "CRM",
    items: [
      {
        href: "/demo/manager/crm",
        label: "CRM",
        icon: Users2,
        children: [
          { href: "/demo/manager/crm/leads", label: "Лиды" },
          { href: "/demo/manager/crm/deals", label: "Сделки" },
          { href: "/demo/manager/crm/clients", label: "Клиенты" },
        ],
      },
    ],
  },
  {
    title: "Операции",
    items: [
      { href: "/demo/manager/orders", label: "Заказы", icon: Receipt },
      { href: "/demo/manager/booking", label: "Бронирование", icon: CalendarDays },
      { href: "/demo/manager/calendar", label: "Календарь", icon: Calendar },
      { href: "/demo/manager/services", label: "Услуги", icon: Pin },
    ],
  },
  {
    title: "Финансы",
    items: [
      { href: "/demo/manager/payments", label: "Платежи", icon: CreditCard },
    ],
  },
  {
    title: "Отчёты",
    items: [
      { href: "/demo/manager/reports", label: "Отчёты", icon: FileBarChart2 },
    ],
  },
  {
    title: "Система",
    items: [
      { href: "/demo/manager/settings", label: "Настройки", icon: Settings },
    ],
  },
];

export const titleMap: Record<string, string> = {
  demo: "Демо",
  manager: "Менеджер",
  dashboard: "Дашборд",
  clients: "Клиенты",

  crm: "CRM",
  leads: "Лиды",
  deals: "Сделки",

  orders: "Заказы",
  booking: "Бронирование",
  calendar: "Календарь",

  payments: "Платежи",

  reports: "Отчёты",

  settings: "Настройки",
};