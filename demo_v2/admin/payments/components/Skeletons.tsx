// app/demo/admin/payments/components/Skeletons.tsx
"use client";

import * as React from "react";

/**
 * Skeleton-заглушка для состояний загрузки данных.
 * Используется на страницах платежей, метрик и т.д.
 */
export default function Skeletons() {
  return (
    <div
      className="animate-pulse grid gap-5 w-full max-w-full"
      aria-busy="true"
      aria-label="Загрузка данных"
    >
      {/* Заголовок */}
      <div className="h-6 w-1/3 max-w-[200px] bg-white/[0.08] rounded-md" />

      {/* KPI карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-2xl bg-white/[0.06] border border-white/10"
          />
        ))}
      </div>

      {/* Блок с графиком (например, TrendLine) */}
      <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-4 md:p-6">
        <div className="h-5 w-1/5 bg-white/[0.08] rounded mb-4" />
        <div className="h-40 bg-white/[0.05] rounded-md" />
      </div>

      {/* Таблица / список */}
      <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-4">
        <div className="h-4 w-1/4 bg-white/[0.08] rounded mb-4" />
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-5 w-full bg-white/[0.05] rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}