"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, User2, Shield, BarChart3, Package, Bell, Settings } from "lucide-react";

type MenuItem = { href: string; label: string; icon?: React.ElementType; };

export function AppShell({
  children,
  menu,
}: { children: React.ReactNode; menu: MenuItem[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/demo/admin");
  const isUser  = pathname.startsWith("/demo/user");

  const mobileItems = (isAdmin
    ? [
        { href: "/demo/admin", label: "Главная", icon: Home },
        { href: "/demo/admin/orders", label: "Заказы", icon: Package },
        { href: "/demo/admin/events", label: "События", icon: Bell },
        { href: "/demo/admin/analytics", label: "Аналитика", icon: BarChart3 },
        { href: "/demo/admin/settings", label: "Настройки", icon: Settings },
      ]
    : [
        { href: "/demo/user", label: "Главная", icon: Home },
        { href: "/demo/user/orders", label: "Заказы", icon: Package },
        { href: "/demo/user/notifications", label: "Уведомл.", icon: Bell },
        { href: "/demo/user/profile", label: "Профиль", icon: User2 },
        { href: "/demo/user/settings", label: "Настройки", icon: Settings },
      ]) as MenuItem[];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* TOPBAR */}
      <header className="sticky top-0 z-40 border-b border-base glass">
        <div className="h-14 mx-auto max-w-7xl px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 hover:opacity-90">
              <div className="h-7 w-7 rounded-lg border border-base flex items-center justify-center">D</div>
              <span className="font-semibold">Demo Studio</span>
            </Link>
            <nav className="hidden md:flex items-center gap-2 pl-4">
              <Link href="/" className="text-sm px-2 py-1 rounded-md hover:bg-muted">Домой</Link>
              <Link href="/demo/admin" className={cn("text-sm px-2 py-1 rounded-md hover:bg-muted", isAdmin && "bg-muted")}>Демо владельца</Link>
              <Link href="/demo/user"  className={cn("text-sm px-2 py-1 rounded-md hover:bg-muted", isUser  && "bg-muted")}>Демо пользователя</Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push(isAdmin ? "/demo/user" : "/demo/admin")}>
              {isAdmin ? "Пользователь" : "Админ"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => document.documentElement.classList.toggle("dark")}>
              Тема
            </Button>
          </div>
        </div>
      </header>

      {/* BODY: sidebar + content */}
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 py-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block sticky top-16 self-start">
          <nav className="space-y-1">
            {menu.map((m) => {
              const active = pathname === m.href || (m.href !== "/demo/admin" && pathname.startsWith(m.href));
              const Icon = m.icon ?? Shield;
              return (
                <Link key={m.href} href={m.href}>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-xl border border-base hover:bg-muted",
                      active && "bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{m.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="pb-20">{children}</main>
      </div>

      {/* MOBILE TABBAR */}
      <nav className="md:hidden fixed bottom-3 left-0 right-0 z-40">
        <div className="mx-auto max-w-md px-3">
          <div className="grid grid-cols-5 gap-2 rounded-2xl border border-base glass p-2 shadow-card">
            {mobileItems.map((it) => {
              const active = pathname === it.href;
              const Icon = it.icon ?? Home;
              return (
                <Link key={it.href} href={it.href} className={cn("text-center text-[11px] px-2 py-1.5 rounded-xl hover:bg-muted", active && "bg-muted font-medium")}>
                  <Icon className="h-5 w-5 mx-auto mb-0.5" />
                  {it.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}