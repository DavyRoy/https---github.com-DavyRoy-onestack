"use client";
import Link from "next/link";
import { ADMIN_CRM_META } from "@/app/demo/(shared)/crm/data/clients.demo"; // новый импорт

export default function CrmStats() {
  const cards = [
    { title: "Всего клиентов", value: ADMIN_CRM_META.total, href: "/demo/admin/crm/clients" },
    { title: "Новых за 30д", value: ADMIN_CRM_META.new30d, href: "/demo/admin/crm/clients?created=30d" },
    { title: "Активных за 30д", value: ADMIN_CRM_META.active30d, href: "/demo/admin/crm/clients?active=30d" },
    { title: "Отток >90д", value: ADMIN_CRM_META.churn90d, href: "/demo/admin/crm/clients?churn=90d" },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Link
          key={c.title}
          href={c.href}
          className="group rounded-2xl border border-white/15 bg-white/[0.05] p-4 hover:bg-white/[0.08] transition flex flex-col justify-between"
        >
          <div className="text-sm text-white/70">{c.title}</div>
          <div className="text-3xl font-semibold mt-1 group-hover:text-white transition-colors">
            {c.value.toLocaleString("ru-RU")}
          </div>
        </Link>
      ))}
    </section>
  );
}