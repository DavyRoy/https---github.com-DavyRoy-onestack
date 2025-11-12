"use client";
import Link from "next/link";

export default function QuickActions() {
  const items = [
    { title: "Импорт клиентов", href: "#import", desc: "Загрузить из CSV/CRM" },
    { title: "Экспорт CSV", href: "#export", desc: "Выгрузить таблицу клиентов" },
    { title: "Новый сегмент", href: "/demo/admin/crm/segments/new", desc: "Создать сегмент по фильтрам" },
    { title: "Новая воронка", href: "/demo/admin/crm/pipelines/new", desc: "Добавить B2C/B2B процесс" },
  ];

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
      <div className="text-sm font-medium mb-3 text-white/80">Быстрые действия</div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {items.map((it) => (
          <Link
            key={it.title}
            href={it.href}
            className="group rounded-xl border border-white/15 bg-white/[0.06] p-3 hover:bg-white/[0.1] transition"
          >
            <div className="text-sm font-medium">{it.title}</div>
            <div className="mt-1 text-xs text-white/60">{it.desc}</div>
            <div className="mt-2 text-[11px] text-white/50 group-hover:text-white/70">
              Открыть →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}