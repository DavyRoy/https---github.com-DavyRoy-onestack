"use client";

import Link from "next/link";
import { BarChart3, Users2, NotebookPen } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";
import { mockLeads } from "@/app/demo/manager/crm/data/mockLeads";
import { mockDeals } from "@/app/demo/manager/crm/data/mockDeals";
import { mockClients } from "@/app/demo/manager/crm/data/mockClients";

export default function CrmStats() {
  // Безопасные вычисления и форматирование
  const kClients = Array.isArray(mockClients) ? mockClients.length : 0;
  const kLeadsNew = Array.isArray(mockLeads)
    ? mockLeads.filter((l) => l.status === "new").length
    : 0;
  const kLeadsWork = Array.isArray(mockLeads)
    ? mockLeads.filter((l) => l.status === "in_progress").length
    : 0;
  const convDemo = 42; // демо %

  const stats: Array<{
    title: string;
    value: string;
    sub?: string;
    href: string;
    icon: React.ReactNode;
    aria: string;
  }> = [
    {
      title: "Клиенты",
      value: fmt(kClients),
      sub: "за всё время",
      href: "/demo/manager/crm/clients?range=30d",
      icon: <Users2 width={18} height={18} aria-hidden />,
      aria: `Клиенты: ${fmt(kClients)} за всё время`,
    },
    {
      title: "Лиды (новые)",
      value: fmt(kLeadsNew),
      sub: "сейчас в статусе Новый",
      href: "/demo/manager/crm/leads?status=new",
      icon: <NotebookPen width={18} height={18} aria-hidden />,
      aria: `Новые лиды: ${fmt(kLeadsNew)}`,
    },
    {
      title: "Лиды (в работе)",
      value: fmt(kLeadsWork),
      sub: "активные заявки",
      href: "/demo/manager/crm/leads?status=in_progress",
      icon: <NotebookPen width={18} height={18} aria-hidden />,
      aria: `Лиды в работе: ${fmt(kLeadsWork)}`,
    },
    {
      title: "Конверсия (демо)",
      value: `${convDemo}%`,
      sub: "лид → сделка → заказ",
      href: "/demo/manager/crm/deals?view=kanban",
      icon: <BarChart3 width={18} height={18} aria-hidden />,
      aria: `Конверсия (демо): ${convDemo} процентов`,
    },
  ];

  return (
    <section
      aria-labelledby="crm-stats-title"
      className="
        grid gap-2.5
        [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]
        sm:[grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]
        xl:grid-cols-4
      "
      role="list"
    >
      <h2 id="crm-stats-title" className="sr-only">
        Сводные показатели CRM
      </h2>

      {stats.map((s) => (
        <Card
          key={s.title}
          title={s.title}
          value={s.value}
          sub={s.sub}
          href={s.href}
          icon={s.icon}
          ariaLabel={s.aria}
        />
      ))}
    </section>
  );
}

/* ===== Карточка показателя ===== */
function Card(p: {
  title: string;
  value: string;
  sub?: string;
  href: string;
  icon: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <Link
      href={p.href}
      role="listitem"
      aria-label={p.ariaLabel}
      className={[
        T.card,
        "group flex min-h-[92px] items-start gap-3 rounded-2xl p-3 sm:p-3.5",
        "text-left will-change-transform transition",
        "hover:-translate-y-0.5 hover:bg-white/[0.07]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
      ].join(" ")}
    >
      <div className="shrink-0 rounded-xl border border-white/15 bg-white/10 p-2 text-white/85 transition group-hover:bg-white/[0.14]">
        {p.icon}
      </div>
      <div className="min-w-0">
        <div className="truncate text-xs font-medium text-white/85">
          {p.title}
        </div>
        <div className="tabular-nums text-lg font-semibold leading-tight">
          {p.value}
        </div>
        {p.sub && (
          <div className={"truncate text-[11px] " + T.dim}>{p.sub}</div>
        )}
      </div>
      {/* Стрелка-акцент справа (показать кликабельность) */}
      <span
        className="ml-auto hidden text-white/60 transition group-hover:translate-x-0.5 group-hover:text-white sm:inline"
        aria-hidden
      >
        →
      </span>
    </Link>
  );
}

/* ===== Утилиты ===== */
function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}