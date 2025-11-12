"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Lucide from "lucide-react";
import { AdminOrder } from "@/app/demo/admin/orders/data/mockAdminOrders";

type Props = { rows: AdminOrder[] };

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function fmtPrice(n: number) {
  const v = Number.isFinite(n as any) ? (n as any as number) : 0;
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(v);
}

function statusTone(s: string) {
  const v = s.toLowerCase();
  if (["paid", "completed", "done", "delivered", "success"].includes(v))
    return "bg-emerald-400/15 text-emerald-300";
  if (["confirmed", "processing", "in_progress", "pending", "new"].includes(v))
    return "bg-amber-400/15 text-amber-300";
  if (["canceled", "cancelled", "refunded", "failed"].includes(v))
    return "bg-rose-400/15 text-rose-300";
  return "bg-white/10 text-white/70";
}

export default function AdminOrdersTable({ rows }: Props) {
  const router = useRouter();

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.05]"
      aria-labelledby="orders-table-title"
    >
      <div className="p-4 md:p-5">
        <div id="orders-table-title" className="text-sm font-medium">
          Список заказов
        </div>
        <div className="mt-0.5 text-xs text-white/60">Найдено: {rows.length}</div>
      </div>

      {/* Desktop / tablet table (>= md) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="p-3">Заказ</th>
              <th className="p-3">Клиент</th>
              <th className="p-3">Канал</th>
              <th className="p-3">Статус</th>
              <th className="p-3 text-right">Сумма</th>
              <th className="p-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr
                key={o.id}
                className="group border-b border-white/5 hover:bg-white/5 cursor-pointer"
                onClick={(e) => {
                  // Клик по пустому месту строки — переход в заказ.
                  if ((e.target as HTMLElement).closest("a,button")) return;
                  router.push(`/demo/admin/orders/${o.id}`);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") router.push(`/demo/admin/orders/${o.id}`);
                }}
                aria-label={`Открыть заказ ${o.id}`}
              >
                {/* Заказ */}
                <td className="p-3 align-top">
                  <div className="flex flex-col min-w-0">
                    <Link
                      href={`/demo/admin/orders/${o.id}`}
                      className="font-medium hover:underline break-all"
                      title={`Заказ #${o.id}`}
                    >
                      #{o.id}
                    </Link>
                    <div className="text-[11px] text-white/50">{o.createdAt}</div>
                  </div>
                </td>

                {/* Клиент */}
                <td className="p-3 align-top">
                  <div className="min-w-0">
                    <div className="truncate" title={o.client}>
                      {o.client}
                    </div>
                    <div className="text-[11px] text-white/50 truncate">
                      {o.email || o.phone || "—"}
                    </div>
                  </div>
                </td>

                {/* Канал */}
                <td className="p-3 align-top">
                  <span className="rounded px-1.5 py-0.5 text-xs bg-white/10">
                    {o.channel}
                  </span>
                </td>

                {/* Статус */}
                <td className="p-3 align-top">
                  <span
                    className={cls(
                      "rounded px-1.5 py-0.5 text-xs capitalize",
                      statusTone(o.status)
                    )}
                  >
                    {o.status}
                  </span>
                </td>

                {/* Сумма */}
                <td className="p-3 align-top text-right tabular-nums">
                  {fmtPrice(o.amount)}
                </td>

                {/* Действия */}
                <td className="p-3 align-top">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Link
                      href={`/demo/admin/orders/${o.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 hover:bg-white/15"
                      title="Открыть карточку"
                      aria-label={`Открыть заказ ${o.id}`}
                    >
                      <Lucide.Eye className="h-4 w-4" />
                      <span className="hidden xl:inline">Открыть</span>
                    </Link>

                    <Link
                      href={`/demo/admin/orders/${o.id}/invoice`}
                      prefetch={false}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 hover:bg-white/15"
                      title="Счёт"
                      aria-label={`Счёт по заказу ${o.id}`}
                    >
                      <Lucide.Receipt className="h-4 w-4" />
                      <span className="hidden xl:inline">Счёт</span>
                    </Link>

                    <Link
                      href={`/demo/admin/orders/${o.id}/invoice?print=1`}
                      prefetch={false}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 hover:bg-white/15"
                      title="Печать счёта"
                      aria-label={`Печать счёта по заказу ${o.id}`}
                    >
                      <Lucide.Printer className="h-4 w-4" />
                      <span className="hidden xl:inline">Печать</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-sm text-white/70">
                  Заказы не найдены.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile list (< md) */}
      <div className="md:hidden divide-y divide-white/10">
        {rows.length === 0 ? (
          <div className="p-6 text-center text-sm text-white/70">Заказы не найдены.</div>
        ) : (
          rows.map((o) => (
            <div key={o.id} className="p-3">
              <Link
                href={`/demo/admin/orders/${o.id}`}
                className="block rounded-lg border border-white/15 bg-white/5 p-3 hover:bg-white/10"
                aria-label={`Открыть заказ ${o.id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium break-all">#{o.id}</div>
                    <div className="mt-0.5 text-xs text-white/60">{o.createdAt}</div>
                    <div className="mt-1 text-sm truncate" title={o.client}>
                      {o.client}
                    </div>
                    <div className="mt-1 text-xs text-white/60 truncate">
                      {o.email || o.phone || "—"}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={cls(
                        "inline-block rounded px-1.5 py-0.5 text-[11px] capitalize",
                        statusTone(o.status)
                      )}
                    >
                      {o.status}
                    </div>
                    <div className="mt-1 text-sm font-medium tabular-nums">
                      {fmtPrice(o.amount)}
                    </div>
                    <div className="mt-1 text-[11px] rounded bg-white/10 px-1.5 py-0.5">
                      {o.channel}
                    </div>
                  </div>
                </div>
              </Link>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  href={`/demo/admin/orders/${o.id}/invoice`}
                  prefetch={false}
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
                  aria-label={`Счёт по заказу ${o.id}`}
                >
                  <Lucide.Receipt className="h-4 w-4" />
                  Счёт
                </Link>
                <Link
                  href={`/demo/admin/orders/${o.id}/invoice?print=1`}
                  prefetch={false}
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
                  aria-label={`Печать счёта по заказу ${o.id}`}
                >
                  <Lucide.Printer className="h-4 w-4" />
                  Печать
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}