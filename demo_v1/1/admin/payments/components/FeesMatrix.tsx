"use client";
import React from "react";
import { ADMIN_FEES_MATRIX } from "@/app/demo/(shared)/payments/data/mockAdminPayments";

export default function FeesMatrix() {
  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 w-full max-w-full overflow-hidden">
      <div className="text-sm text-white/70 mb-2">Матрица комиссий</div>

      {/* скролл только внутри этого контейнера */}
      <div className="w-full max-w-full overflow-x-auto">
        {/* делаем разумный min-width, чтобы колонки не ломались, но не распирали страницу */}
        <table className="min-w-[640px] w-full text-sm">
          <thead className="text-white/60">
            <tr className="border-b border-white/10">
              <th className="text-left py-2 pr-3">Метод</th>
              <th className="text-left py-2 pr-3">Валюта</th>
              <th className="text-left py-2 pr-3">% комиссии</th>
              <th className="text-left py-2 pr-3">Фикс</th>
              <th className="text-left py-2 pr-3">Мин.</th>
              <th className="text-left py-2 pr-3">Потолок</th>
            </tr>
          </thead>
          <tbody>
            {ADMIN_FEES_MATRIX.map((r, i) => (
              <tr key={i} className="border-b border-white/5">
                <td className="py-2 pr-3 break-words">{r.method}</td>
                <td className="py-2 pr-3 break-words">{r.currency}</td>
                <td className="py-2 pr-3">{r.percent}%</td>
                <td className="py-2 pr-3">{r.fixed}</td>
                <td className="py-2 pr-3">{r.min}</td>
                <td className="py-2 pr-3">{r.cap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}