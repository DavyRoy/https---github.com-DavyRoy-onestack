"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users2, UserPlus, Pipeline, ShoppingBag,
  Scissors, CalendarDays, Calendar, CreditCard, BarChart3,
  HelpCircle, Settings, LogOut, Home
} from "lucide-react";

const T = {
  wrap: "sticky top-0 h-dvh hidden lg:flex flex-col border-r border-white/10 bg-black/40 backdrop-blur",
  head: "p-4 border-b border-white/10",
  brand: "flex items-center gap-2 text-sm",
  navSec: "px-3 pt-3 pb-2 text-[11px] uppercase tracking-wide text-white/40",
  nav: "flex-1 overflow-y-auto py-2",
  link: "flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/[0.06]",
  linkActive: "bg-white text-black hover:bg-white",
  foot: "p-3 border-t border-white/10",
  chip: "inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/70",
};

type Item = { href: string; title: string; icon: any; exact?: boolean };

const main: Item[] = [
  { href: "/demo/manager/dashboard", title: "Дашборд", icon: LayoutDashboard },
  { href: "/demo/manager/crm",       title: "CRM",     icon: Users2 },
  { href: "/demo/manager/orders",    title: "Заказы",  icon: ShoppingBag },
  { href: "/demo/manager/services",  title: "Услуги",  icon: Scissors },
  { href: "/demo/manager/booking",   title: "Бронирование", icon: CalendarDays },
  { href: "/demo/manager/calendar",  title: "Календарь", icon: Calendar },
];

const ops: Item[] = [
  { href: "/demo/manager/payments", title: "Платежи", icon: CreditCard },
  { href: "/demo/manager/reports",  title: "Отчёты",  icon: BarChart3 },
];

const help: Item[] = [
  { href: "/demo/manager/help",      title: "Помощь",    icon: HelpCircle },
  { href: "/demo/manager/settings",  title: "Настройки", icon: Settings },
];

export default function ManagerSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const LinkItem = ({ href, title, icon: Icon }: Item) => (
    <Link
      href={href}
      className={`${T.link} ${isActive(href) ? T.linkActive : "text-white/85"}`}
    >
      <Icon width={16} height={16} />
      <span className="truncate">{title}</span>
    </Link>
  );

  return (
    <aside className={T.wrap}>
      <div className={T.head}>
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold">Manager</div>
          <Link href="/demo/user" className={T.chip}><Home width={12} height={12}/> Пользователь</Link>
        </div>
        <div className="mt-1 text-xs text-white/60">Операционный интерфейс</div>
      </div>

      <nav className={T.nav} aria-label="Основное меню">
        <div className={T.navSec}>Основные</div>
        <div className="px-2 grid gap-1">
          {main.map((it) => <LinkItem key={it.href} {...it} />)}
        </div>

        <div className={T.navSec}>Операции</div>
        <div className="px-2 grid gap-1">
          {ops.map((it) => <LinkItem key={it.href} {...it} />)}
        </div>

        <div className={T.navSec}>Справка</div>
        <div className="px-2 grid gap-1">
          {help.map((it) => <LinkItem key={it.href} {...it} />)}
          <Link href="/demo/manager/login" className={T.link + " text-white/85"}>
            <LogOut width={16} height={16}/> Выход
          </Link>
        </div>
      </nav>

      <div className={T.foot}>
        <div className="rounded-xl border border-white/15 bg-white/[0.06] p-3">
          <div className="text-xs text-white/70">Роль: Менеджер</div>
          <div className="text-[11px] text-white/50">Нет доступа к глобальным настройкам</div>
        </div>
      </div>
    </aside>
  );
}