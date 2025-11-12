"use client";

import Link from "next/link";
import AuditHero from "./components/AuditHero";
import AuditStats from "./components/AuditStats";
import QuickActions from "./components/QuickActions";
import { AUDIT_STATS } from "@/app/demo/(shared)/audit/logs";

export default function AdminAuditHubPage() {
  const sections = [
    {
      href: "/demo/admin/audit/logs",
      title: "Журнал действий",
      desc: "Все события по модулям",
    },
    {
      href: "/demo/admin/audit/health",
      title: "Здоровье систем",
      desc: "SLO, инциденты, вебхуки",
    },
    {
      href: "/demo/admin/integrations/webhooks",
      title: "Вебхуки",
      desc: "Эндпоинты и доставки",
    },
    {
      href: "/demo/admin/payments/providers",
      title: "Платёжные провайдеры",
      desc: "Статусы и latency",
    },
  ];

  return (
    <main
      className="
        grid gap-6 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      <AuditHero />
      <AuditStats stats={AUDIT_STATS} />
      <QuickActions />

      {/* Основные разделы аудита */}
      <nav
        aria-label="Навигация по разделам аудита"
        className="admin-section border-white/12 bg-white/8"
      >
        <ul
          className="
            grid gap-3 sm:grid-cols-2 lg:grid-cols-4
            w-full max-w-full min-w-0
          "
        >
          {sections.map((c) => (
            <li key={c.href} className="min-w-0">
              <Link
                href={c.href}
                className="
                  block rounded-2xl border border-white/12 bg-white/10 p-4 text-white/85
                  transition hover:border-white/18 hover:bg-white/14
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30
                "
              >
                <div className="text-sm font-medium truncate">{c.title}</div>
                <p className="mt-1 text-xs text-white/65 line-clamp-2">{c.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}