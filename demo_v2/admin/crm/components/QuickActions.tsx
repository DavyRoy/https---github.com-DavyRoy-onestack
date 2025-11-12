"use client";

import Link from "next/link";
import { Upload, Download, PlusCircle, Workflow } from "lucide-react";

export default function QuickActions() {
  const items = [
    {
      title: "Импорт клиентов",
      href: "#import",
      desc: "Загрузить из CSV/CRM",
      icon: <Upload className="w-4 h-4" />,
      color: "border-blue-400/30 hover:bg-blue-500/10",
    },
    {
      title: "Экспорт CSV",
      href: "#export",
      desc: "Выгрузить таблицу клиентов",
      icon: <Download className="w-4 h-4" />,
      color: "border-emerald-400/30 hover:bg-emerald-500/10",
    },
    {
      title: "Новый сегмент",
      href: "/demo/admin/crm/segments/new",
      desc: "Создать сегмент по фильтрам",
      icon: <PlusCircle className="w-4 h-4" />,
      color: "border-purple-400/30 hover:bg-purple-500/10",
    },
    {
      title: "Новая воронка",
      href: "/demo/admin/crm/pipelines/new",
      desc: "Добавить B2C/B2B процесс",
      icon: <Workflow className="w-4 h-4" />,
      color: "border-amber-400/30 hover:bg-amber-500/10",
    },
  ];

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
      <h2 className="text-sm font-medium text-white/80 mb-3">Быстрые действия</h2>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {items.map((it) => (
          <Link
            key={it.title}
            href={it.href}
            className={`group rounded-xl border bg-white/[0.04] p-3 flex flex-col justify-between transition ${it.color}`}
          >
            <div className="flex items-center gap-2">
              <div className="text-white/80">{it.icon}</div>
              <div className="font-medium text-sm">{it.title}</div>
            </div>
            <p className="mt-1 text-xs text-white/60">{it.desc}</p>
            <div className="mt-2 text-[11px] text-white/50 transition group-hover:text-white/70">
              Открыть →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}