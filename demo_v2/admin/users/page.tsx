"use client";

import Link from "next/link";
import * as React from "react";
import AccessHero from "./components/AccessHero";
import AccessStats from "./components/AccessStats";
import QuickActions from "./components/QuickActions";
import { USERS_SUMMARY } from "@/app/demo/(shared)/users/data";

export default function AdminUsersHubPage() {
  // Мемоизируем, чтобы не триггерить лишние рендеры дочерних компонентов
  const stats = React.useMemo(() => USERS_SUMMARY, []);

  return (
    // сохраняем прежний корневой контейнер, чтобы не ловить гидрацию
    <div className="grid gap-6 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Hero */}
      <AccessHero />

      {/* Статистика */}
      <section aria-label="Сводка по пользователям и ролям" className="min-w-0">
        <AccessStats stats={stats} />
      </section>

      {/* Быстрые действия */}
      <section aria-label="Быстрые действия" className="min-w-0">
        <QuickActions />
      </section>

      {/* Быстрые ссылки (адаптив) */}
      <nav
        aria-label="Навигация по разделам управления доступом"
        className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 min-w-0"
      >
        <div className="text-sm text-white/70 mb-2">Быстрые ссылки</div>

        <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <li className="min-w-0">
            <Link
              href="/demo/admin/users/list"
              className="block rounded-xl border border-white/15 p-4 hover:bg-white/[0.08] transition text-sm text-white/90 break-words focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              Пользователи
              <span className="sr-only"> — перейти к списку пользователей</span>
            </Link>
          </li>

          <li className="min-w-0">
            <Link
              href="/demo/admin/users/roles"
              className="block rounded-xl border border-white/15 p-4 hover:bg-white/[0.08] transition text-sm text-white/90 break-words focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              Роли
              <span className="sr-only"> — перейти к управлению ролями</span>
            </Link>
          </li>

          <li className="min-w-0">
            <Link
              href="/demo/admin/users/permissions"
              className="block rounded-xl border border-white/15 p-4 hover:bg-white/[0.08] transition text-sm text-white/90 break-words focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              Права (RBAC)
              <span className="sr-only"> — перейти к матрице прав</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}