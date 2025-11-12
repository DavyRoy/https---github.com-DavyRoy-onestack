"use client";

import * as React from "react";
import Link from "next/link";

type Relation = {
  href: string;
  label: string;
  description?: string;
};

export default function ClientRelations({ id }: { id: string }) {
  const items: Relation[] = [
    {
      href: `/demo/manager/orders?client=${id}`,
      label: "Заказы клиента",
      description: "Все оформленные заказы по данному клиенту",
    },
    {
      href: `/demo/manager/booking?client=${id}`,
      label: "Бронирования клиента",
      description: "История и будущие записи в календаре",
    },
    {
      href: `/demo/manager/crm/leads?client=${id}`,
      label: "Лиды / сделки",
      description: "Путь клиента в CRM воронке",
    },
  ];

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.03] p-4 grid gap-3">
      <div className="text-sm font-medium text-white/70">Связи</div>
      <ul className="grid gap-1.5">
        {items.map((it) => (
          <li
            key={it.href}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg hover:bg-white/[0.04] transition-colors px-2 py-1"
          >
            <Link
              href={it.href}
              className="text-sm text-white hover:text-white/90 hover:underline truncate"
            >
              {it.label}
            </Link>
            {it.description && (
              <span className="text-xs text-white/50 sm:text-right">
                {it.description}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}