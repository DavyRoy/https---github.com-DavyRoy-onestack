"use client";

import Link from "next/link";
import AuditHero from "./components/AuditHero";
import AuditStats from "./components/AuditStats";
import QuickActions from "./components/QuickActions";
import { AUDIT_STATS } from "@/app/demo/(shared)/audit/logs";

export default function AdminAuditHubPage() {
  return (
    <div
      className="
        grid gap-6 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Шапка */}
      <div className="min-w-0">
        <AuditHero />
      </div>

      {/* KPI */}
      <div className="min-w-0">
        <AuditStats stats={AUDIT_STATS} />
      </div>

      {/* Быстрые действия */}
      <div className="min-w-0">
        <QuickActions />
      </div>

      {/* Основные разделы аудита */}
      <section
        aria-label="Навигация по разделам аудита"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 min-w-0"
      >
        {[
          { href: "/demo/admin/audit/logs", title: "Журнал действий", desc: "Все события по модулям" },
          { href: "/demo/admin/audit/health", title: "Здоровье систем", desc: "SLO, инциденты, вебхуки" },
          { href: "/demo/admin/integrations/webhooks", title: "Вебхуки", desc: "Эндпоинты и доставки" },
          { href: "/demo/admin/payments/providers", title: "Платёжные провайдеры", desc: "Статусы и latency" },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="
              rounded-2xl border border-white/15 bg-white/[0.05] p-4
              hover:bg-white/[0.08] focus:bg-white/[0.08]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30
              transition min-w-0
            "
          >
            <div className="text-sm font-medium truncate">{c.title}</div>
            <p className="text-xs text-white/70 mt-1 line-clamp-2">{c.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}