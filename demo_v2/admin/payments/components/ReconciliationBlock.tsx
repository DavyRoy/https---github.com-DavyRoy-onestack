// app/demo/admin/payments/components/ReconciliationBlock.tsx
"use client";

import * as React from "react";
import Link from "next/link";

type Mismatch = { id: string; type: "order" | "payment" | string; amount: number; href: string };

type Props = {
  ordersAmount: number;
  paymentsAmount: number;
  delta: number;
  mismatches: Mismatch[];
  currency?: "RUB" | "USD" | "KRW";
};

export default function ReconciliationBlock({
  ordersAmount,
  paymentsAmount,
  delta,
  mismatches,
  currency = "RUB",
}: Props) {
  const nf = React.useMemo(
    () =>
      new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
    [currency]
  );

  const deltaCls =
    delta === 0 ? "text-white/80" : delta > 0 ? "text-amber-300" : "text-rose-300";

  const badgeColor = (t: Mismatch["type"]) => {
    if (t === "order") return "bg-sky-500/15 text-sky-300 border-sky-400/30";
    if (t === "payment") return "bg-emerald-500/15 text-emerald-300 border-emerald-400/30";
    return "bg-white/10 text-white/70 border-white/15";
  };

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5"
      aria-labelledby="recon-title"
    >
      <div id="recon-title" className="text-sm text-white/70 mb-3 font-medium">
        Сверка: заказы ↔ платежи
      </div>

      {/* KPI */}
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <div className="text-xs text-white/60">Сумма заказов</div>
          <div className="text-lg font-semibold">{nf.format(ordersAmount)}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <div className="text-xs text-white/60">Принятые оплаты</div>
          <div className="text-lg font-semibold">{nf.format(paymentsAmount)}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <div className="text-xs text-white/60">Δ Расхождение</div>
          <div className={`text-lg font-semibold ${deltaCls}`}>
            {delta > 0 ? "+" : ""}
            {nf.format(delta)}
          </div>
        </div>
      </div>

      {/* Несостыковки */}
      <div className="mt-4">
        <div className="text-sm text-white/70 mb-2 font-medium">Несостыковки</div>

        {mismatches.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-white/60">
            Нет несостыковок — всё ок.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[560px] w-full text-sm" role="table" aria-label="Таблица несостыковок">
              <colgroup>
                <col className="w-[42%]" />
                <col className="w-[18%]" />
                <col className="w-[20%]" />
                <col className="w-[20%]" />
              </colgroup>
              <thead className="text-white/60">
                <tr className="border-b border-white/10">
                  <th scope="col" className="text-left p-2">ID</th>
                  <th scope="col" className="text-left p-2">Тип</th>
                  <th scope="col" className="text-right p-2">Сумма</th>
                  <th scope="col" className="text-right p-2">Действие</th>
                </tr>
              </thead>
              <tbody>
                {mismatches.map((m) => {
                  const amtCls =
                    m.amount === 0 ? "text-white/80" : m.amount > 0 ? "text-amber-300" : "text-rose-300";
                  return (
                    <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                      <td className="p-2">
                        <span className="font-medium break-all">{m.id}</span>
                      </td>
                      <td className="p-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs ${badgeColor(
                            m.type
                          )}`}
                        >
                          {m.type}
                        </span>
                      </td>
                      <td className={`p-2 text-right font-medium whitespace-nowrap ${amtCls}`}>
                        {m.amount > 0 ? "+" : ""}
                        {nf.format(m.amount)}
                      </td>
                      <td className="p-2 text-right">
                        <Link
                          href={m.href}
                          className="inline-flex items-center rounded-md border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
                        >
                          Открыть
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}