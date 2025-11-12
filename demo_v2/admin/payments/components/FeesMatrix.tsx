// app/demo/admin/payments/components/FeesMatrix.tsx
"use client";

import * as React from "react";
import { ADMIN_FEES_MATRIX } from "@/app/demo/(shared)/payments/data/mockAdminPayments";

export default function FeesMatrix() {
  const rows = React.useMemo(() => ADMIN_FEES_MATRIX ?? [], []);

  const formatCurrency = (v: number | string) => {
    if (typeof v === "string") return v;
    if (isNaN(Number(v))) return "—";
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 2,
    }).format(v);
  };

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 w-full max-w-full overflow-hidden">
      <div className="text-sm text-white/70 mb-3 font-medium flex items-center justify-between">
        <span>Матрица комиссий</span>
        <span className="text-xs text-white/50">
          Всего записей: {rows.length}
        </span>
      </div>

      {/* Контейнер с горизонтальным скроллом */}
      <div className="w-full max-w-full overflow-x-auto">
        <table className="min-w-[640px] w-full text-sm border-separate border-spacing-0">
          <thead className="text-white/60">
            <tr className="border-b border-white/10">
              <th className="text-left py-2 pr-3 font-medium">Метод</th>
              <th className="text-left py-2 pr-3 font-medium">Валюта</th>
              <th className="text-left py-2 pr-3 font-medium">% комиссии</th>
              <th className="text-left py-2 pr-3 font-medium">Фикс</th>
              <th className="text-left py-2 pr-3 font-medium">Мин.</th>
              <th className="text-left py-2 pr-3 font-medium">Потолок</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-6 text-center text-white/60 border-t border-white/10"
                >
                  Нет данных по комиссиям.
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr
                  key={`${r.method}-${r.currency}-${i}`}
                  className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                >
                  <td className="py-2 pr-3 capitalize">{r.method}</td>
                  <td className="py-2 pr-3">{r.currency}</td>
                  <td className="py-2 pr-3 text-emerald-300">{r.percent}%</td>
                  <td className="py-2 pr-3">{formatCurrency(r.fixed)}</td>
                  <td className="py-2 pr-3">{formatCurrency(r.min)}</td>
                  <td className="py-2 pr-3">{formatCurrency(r.cap)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}