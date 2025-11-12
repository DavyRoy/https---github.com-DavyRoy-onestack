// src/app/demo/manager/payments/invoices/components/InvoicesTable.tsx
"use client";

import Link from "next/link";
import type { Invoice } from "../../data/mockPayments";
import InvoiceStatusBadge from "./InvoiceStatusBadge";

const T = {
  card: "rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 backdrop-blur-sm",
  dim: "text-white/70",
};

export default function InvoicesTable({ rows }: { rows: Invoice[] }) {
  if (rows.length === 0)
    return (
      <div className={`${T.card} ${T.dim}`}>
        Счетов не найдено.
      </div>
    );

  return (
    <section className={T.card} aria-label="Таблица счетов">
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full text-sm">
          <thead className="text-xs uppercase opacity-70">
            <tr>
              <th className="px-3 py-2 text-left">№</th>
              <th className="px-3 py-2 text-left">Дата / Срок</th>
              <th className="px-3 py-2 text-left">Клиент</th>
              <th className="px-3 py-2 text-left">Заказ</th>
              <th className="px-3 py-2 text-left">Сумма</th>
              <th className="px-3 py-2 text-left">Статус</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((inv) => (
              <tr
                key={inv.id}
                className="transition-colors hover:bg-white/5 focus-within:bg-white/10"
              >
                <td className="px-3 py-2 whitespace-nowrap">
                  <Link
                    href={`/demo/manager/payments/invoices/${encodeURIComponent(inv.id)}`}
                    className="underline hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 rounded-sm"
                  >
                    {inv.id}
                  </Link>
                </td>
                <td className="px-3 py-2 text-sm opacity-80 whitespace-nowrap">
                  {new Date(inv.createdAt).toLocaleDateString("ru-RU")} /{" "}
                  {new Date(inv.dueAt).toLocaleDateString("ru-RU")}
                </td>
                <td className="px-3 py-2 text-sm truncate max-w-[200px]">
                  {inv.client}
                </td>
                <td className="px-3 py-2 text-sm">
                  {inv.orderId ? (
                    <Link
                      className="underline hover:text-white"
                      href={`/demo/manager/orders/${encodeURIComponent(inv.orderId)}`}
                    >
                      {inv.orderId}
                    </Link>
                  ) : (
                    <span className="opacity-60">—</span>
                  )}
                </td>
                <td className="px-3 py-2 text-sm tabular-nums whitespace-nowrap">
                  {inv.total.toLocaleString("ru-RU")} {inv.currency}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <InvoiceStatusBadge status={inv.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Мобильная версия — карточки */}
      <div className="md:hidden mt-3 grid gap-2">
        {rows.map((inv) => (
          <Link
            key={`m-${inv.id}`}
            href={`/demo/manager/payments/invoices/${encodeURIComponent(inv.id)}`}
            className="block rounded-xl border border-white/10 bg-white/[0.04] p-3 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <div className="flex justify-between items-center text-sm font-medium">
              <span>{inv.id}</span>
              <InvoiceStatusBadge status={inv.status} />
            </div>
            <div className="mt-1 text-xs text-white/70">
              {new Date(inv.createdAt).toLocaleDateString("ru-RU")} →{" "}
              {new Date(inv.dueAt).toLocaleDateString("ru-RU")}
            </div>
            <div className="mt-1 text-sm truncate">{inv.client}</div>
            <div className="mt-1 text-sm tabular-nums">
              {inv.total.toLocaleString("ru-RU")} {inv.currency}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}