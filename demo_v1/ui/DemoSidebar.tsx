"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users2,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Bell,
  UserCircle2,
  LineChart,
  Home,
  LockKeyhole,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import React, { useEffect, useState } from "react";

type Role = "user" | "admin";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  disabled?: boolean;
  badge?: string;
};

const ADMIN_NAV: readonly NavItem[] = [
  { href: "/demo/admin", icon: LayoutDashboard, label: "Дашборд" },
  { href: "/demo/admin/users", icon: Users2, label: "Пользователи" },
  { href: "/demo/admin/analytics", icon: LineChart, label: "Аналитика" },
  { href: "/demo/admin/roles", icon: LockKeyhole, label: "Роли и права" },
  { href: "/demo/admin/operations", icon: LineChart, label: "Операции" },
  { href: "/demo/admin/events", icon: LineChart, label: "События" },
  { href: "/demo/admin/security", icon: ShieldCheck, label: "Безопасность" },
  { href: "/demo/admin/settings", icon: Settings, label: "Настройки" },
];

const USER_NAV: readonly NavItem[] = [
  { href: "/demo/user", icon: LayoutDashboard, label: "Главная" },
  { href: "/demo/user/orders", icon: ShoppingBag, label: "Заказы" },
  { href: "/demo/user/notifications", icon: Bell, label: "Уведомления", badge: "3" },
  { href: "/demo/user/profile", icon: UserCircle2, label: "Профиль" },
  { href: "/demo/user/settings", icon: Settings, label: "Настройки" },
];

const isActive = (pathname: string, href: string) => {
  const clean = (s: string) => (s.endsWith("/") && s.length > 1 ? s.slice(0, -1) : s);
  const p = clean(pathname);
  const h = clean(href);
  const isRoot = h === "/demo/admin" || h === "/demo/user";
  return isRoot ? p === h : p === h || p.startsWith(h + "/");
};

const LS_KEY = "__DEMO_SIDEBAR_COLLAPSED__";

export function DemoSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const nav = role === "admin" ? ADMIN_NAV : USER_NAV;

  const [collapsed, setCollapsed] = useState(false);

  // загрузка состояния из localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setCollapsed(raw === "1");
    } catch {}
  }, []);

  // сохранение collapsed в localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);

  const sidebarWidth = collapsed ? "w-[72px]" : "w-[260px]";

  return (
    <aside
      className={`hidden lg:flex lg:sticky lg:top-0 lg:h-[100dvh] ${sidebarWidth} shrink-0 flex-col border-r border-white/10 bg-white/[0.03] transition-[width] motion-safe:duration-200`}
      aria-label={role === "admin" ? "Навигация администратора" : "Навигация пользователя"}
    >
      {/* Header */}
      <div className="p-3 border-b border-white/10 shrink-0">
        <div className={`flex items-center gap-2 ${collapsed ? "justify-center" : "justify-between"}`}>
          {/* Бренд */}
          {collapsed ? (
            <Link
              href="/"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg px-0 py-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              title="OneStack · на главную"
            >
              <Home className="h-5 w-5" />
              <span className="sr-only">На главную</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
                title="На сайт OneStack"
              >
                OneStack
              </Link>
              <Link
                href="/demo"
                className="text-white/60 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
                title="Открыть демо"
              >
                Demo
              </Link>
            </div>
          )}

          {!collapsed && (
            <span className="ml-auto text-[11px] text-white/55 uppercase tracking-widest">
              Роль: {role === "admin" ? "Администратор" : "Пользователь"}
            </span>
          )}

          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="ml-auto inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-pressed={collapsed}
            aria-label={collapsed ? "Развернуть сайдбар" : "Свернуть сайдбар"}
            title={collapsed ? "Развернуть" : "Свернуть"}
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-2 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);

          const base =
            "group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm border transition outline-none";
          const tone = active
            ? "bg-white text-black border-white"
            : "border-white/10 hover:bg-white/[0.07] text-white/85";
          const focus = "focus-visible:ring-2 focus-visible:ring-white/60";

          const itemClasses = `${base} ${tone} ${focus} ${collapsed ? "justify-center" : ""}`;

          const content = (
            <>
              {/* Левая полоса-рейл */}
              <span
                aria-hidden
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 rounded-r-md transition-all ${
                  active ? "w-1 bg-white" : "w-0 bg-transparent group-hover:w-1 group-hover:bg-white/60"
                }`}
              />
              <Icon className={`h-4 w-4 ${active ? "text-black" : "text-white/80"}`} aria-hidden />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {item.badge && !collapsed && (
                <span
                  className={`ml-auto shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] leading-4 ${
                    active ? "border-black/20 bg-black/10 text-black" : "border-white/20 bg-white/10 text-white/90"
                  }`}
                >
                  <span className="sr-only">Счётчик: </span>
                  {item.badge}
                </span>
              )}
            </>
          );

          if (item.disabled) {
            return (
              <span key={item.href} role="link" aria-disabled="true" className={`${itemClasses} opacity-40 cursor-not-allowed`}>
                {content}
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={itemClasses}
              aria-current={active ? "page" : undefined}
              title={collapsed ? item.label : undefined}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      {/* Нижний блок переключения роли скрыт для компактности демо */}
    </aside>
  );
}
