"use client";

import Link from "next/link";

export default function ClientRelations({ id }: { id: string }) {
  const items = [
    { href: `/demo/manager/orders?client=${id}`, label: "Заказы клиента" },
    { href: `/demo/manager/booking?client=${id}`, label: "Бронирования клиента" },
    { href: `/demo/manager/crm/leads?client=${id}`, label: "Лиды/сделки" },
  ] as const;

  return (
    <section className="rounded-2xl border border-white/15 p-4 bg-white/[0.03] grid gap-2">
      <div className="text-sm text-white/70">Связи</div>
      <ul className="grid gap-1">
        {items.map((it) => (
          <li key={it.href}>
            <Link href={it.href} className="text-sm hover:underline">
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}