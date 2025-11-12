"use client";

import React from "react";

export default function Skeletons() {
  return (
    <div className="animate-pulse grid gap-4">
      {/* Заголовок */}
      <div className="h-6 w-1/3 bg-white/[0.08] rounded-md" />

      {/* Карточки (например, KPI или карточки данных) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-2xl bg-white/[0.06] border border-white/10"
          />
        ))}
      </div>

      {/* Таблица / список */}
      <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-4">
        <div className="h-4 w-1/4 bg-white/[0.08] rounded mb-4" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-5 w-full bg-white/[0.05] rounded-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
}