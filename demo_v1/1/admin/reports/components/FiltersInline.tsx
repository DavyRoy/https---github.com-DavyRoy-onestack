"use client";

import React from "react";

export default function FiltersInline() {
  return (
    <div
      className="
        flex flex-wrap items-center gap-2
        text-sm
        w-full
        rounded-2xl border border-white/10 bg-white/[0.03]
        p-3 sm:p-4
      "
    >
      <span className="text-white/60 shrink-0">Фильтры:</span>

      <select
        className="
          flex-1 min-w-[140px]
          rounded-lg bg-white/5 border border-white/15
          px-2 py-1
          text-sm text-white
          outline-none
          focus:ring-2 focus:ring-white/20
        "
      >
        <option>Категория: все</option>
        <option>Категория: услуги</option>
        <option>Категория: товары</option>
      </select>

      <select
        className="
          flex-1 min-w-[140px]
          rounded-lg bg-white/5 border border-white/15
          px-2 py-1
          text-sm text-white
          outline-none
          focus:ring-2 focus:ring-white/20
        "
      >
        <option>Метод оплаты: все</option>
        <option>card</option>
        <option>invoice</option>
      </select>

      <select
        className="
          flex-1 min-w-[120px]
          rounded-lg bg-white/5 border border-white/15
          px-2 py-1
          text-sm text-white
          outline-none
          focus:ring-2 focus:ring-white/20
        "
      >
        <option>Валюта: авто</option>
        <option>RUB</option>
        <option>KRW</option>
        <option>USD</option>
      </select>
    </div>
  );
}