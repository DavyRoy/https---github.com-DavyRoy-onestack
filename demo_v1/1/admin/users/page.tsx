"use client";

import Link from "next/link";
import AccessHero from "./components/AccessHero";
import AccessStats from "./components/AccessStats";
import QuickActions from "./components/QuickActions";
import { USERS_SUMMARY } from "@/app/demo/(shared)/users/data";

export default function AdminUsersHubPage() {
  const stats = USERS_SUMMARY;

  return (
    /* сохраняем прежний корневой контейнер, чтобы не ловить гидрацию */
    <div className="grid gap-6">
      {/* Hero */}
      <AccessHero />

      {/* Статистика */}
      <AccessStats stats={stats} />

      {/* Быстрые действия */}
      <QuickActions />

      {/* Быстрые ссылки (адаптив) */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
        <div className="text-sm text-white/70 mb-2">Быстрые ссылки</div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <Link
            href="/demo/admin/users/list"
            className="block rounded-xl border border-white/15 p-4 hover:bg-white/[0.08] transition text-sm text-white/90 break-words"
          >
            Пользователи
          </Link>

          <Link
            href="/demo/admin/users/roles"
            className="block rounded-xl border border-white/15 p-4 hover:bg-white/[0.08] transition text-sm text-white/90 break-words"
          >
            Роли
          </Link>

          <Link
            href="/demo/admin/users/permissions"
            className="block rounded-xl border border-white/15 p-4 hover:bg-white/[0.08] transition text-sm text-white/90 break-words"
          >
            Права (RBAC)
          </Link>
        </div>
      </section>
    </div>
  );
}