// app/demo/user/components/userNav.data.ts
import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  ShoppingBag,
  Boxes,
  ShoppingCart,
  Sparkles,
  CalendarDays,
  Calendar,
  NotebookPen,
  Receipt,
  CreditCard,
  Settings,
  LifeBuoy,
  LogOut
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
      { href: "/demo/user/dashboard", label: "Дашборд", icon: LayoutGrid },
    ],
  },
  {
    title: "Магазин",
    items: [
      {
        href: "/demo/user/shop",
        label: "Магазин",
        icon: ShoppingBag,
        children: [
          { href: "/demo/user/shop/products", label: "Товары" },
          { href: "/demo/user/cart", label: "Корзина" },
        ],
      },
    ],
  },
  {
    title: "Услуги и бронирование",
    items: [
      { href: "/demo/user/services", label: "Услуги", icon: Sparkles },
      { href: "/demo/user/booking", label: "Бронирование", icon: CalendarDays },
      { href: "/demo/user/calendar", label: "Календарь", icon: Calendar },
    ],
  },
  {
    title: "Мои",
    items: [
      { href: "/demo/user/my-bookings", label: "Мои записи", icon: NotebookPen },
      { href: "/demo/user/my-orders", label: "Мои заказы", icon: Receipt },
    ],
  },
  {
    title: "Операции",
    items: [
      { href: "/demo/user/checkout", label: "Оплата (демо)", icon: CreditCard },
    ],
  },
  {
    title: "Система",
    items: [
      { href: "/demo/user/settings", label: "Настройки", icon: Settings },
      { href: "/demo/user/help", label: "Помощь", icon: LifeBuoy },
      { href: "/demo/user/login", label: "Выход", icon: LogOut },
    ],
  },
];

export const titleMap: Record<string, string> = {
  demo: "Демо",
  user: "Пользователь",

  // Обзор
  dashboard: "Дашборд",

  // Магазин
  shop: "Магазин",
  products: "Товары",
  cart: "Корзина",

  // Услуги и бронирование
  services: "Услуги",
  booking: "Бронирование",
  calendar: "Календарь",

  // Мои
  "my-bookings": "Мои записи",
  "my-orders": "Мои заказы",

  // Операции
  checkout: "Оплата",

  // Система
  settings: "Настройки",
  help: "Помощь",
  login: "Выход",
};