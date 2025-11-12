"use client";
import Link from "next/link";
import React from "react";

type Mismatch = { id: string; type: string; amount: number; href: string };

export default function ReconciliationBlock({
  ordersAmount,
  paymentsAmount,
  delta,
  mismatches,
}: {
  ordersAmount: number;
  paymentsAmount: number;
  delta: number;
  mismatches: Mismatch[];
}) {
  const rub = (n: number) =>
    new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(n);

  const deltaCls =
    delta === 0
      ? "text-white/80"
      : delta > 0
      ? "text-amber-300"
      : "text-rose-300";

  const badgeColor = (t: string) => {
    if (t === "order") return "bg-sky-500/15 text-sky-300 border-sky-400/30";
    if (t === "payment") return "bg-emerald-500/15 text-emerald-300 border-emerald-400/30";
    return "bg-white/10 text-white/70 border-white/15";
  };

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
      <div className="text-sm text-white/70 mb-3">Сверка (Заказы vs Платежи)</div>

      {/* KPI */}
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <div className="text-xs text-white/60">Сумма заказов</div>
          <div className="text-lg font-semibold">₽ {rub(ordersAmount)}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <div className="text-xs text-white/60">Принятые оплаты</div>
          <div className="text-lg font-semibold">₽ {rub(paymentsAmount)}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <div className="text-xs text-white/60">Δ Расхождение</div>
          <div className={`text-lg font-semibold ${deltaCls}`}>
            {delta > 0 ? "+" : ""}
            ₽ {rub(delta)}
          </div>
        </div>
      </div>

      {/* Мисматчи */}
      <div className="mt-4">
        <div className="text-sm text-white/70 mb-2">Несостыковки</div>
        {mismatches.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-white/60">
            Нет несостыковок — всё ок.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[520px] w-full text-sm">
              <thead className="text-white/60">
                <tr className="border-b border-white/10">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Тип</th>
                  <th className="text-right p-2">Сумма</th>
                  <th className="text-right p-2">Действие</th>
                </tr>
              </thead>
              <tbody>
                {mismatches.map((m) => {
                  const amtCls =
                    m.amount === 0
                      ? "text-white/80"
                      : m.amount > 0
                      ? "text-amber-300"
                      : "text-rose-300";
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
                      <td className={`p-2 text-right font-medium ${amtCls}`}>
                        {m.amount > 0 ? "+" : ""}
                        ₽ {rub(m.amount)}
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