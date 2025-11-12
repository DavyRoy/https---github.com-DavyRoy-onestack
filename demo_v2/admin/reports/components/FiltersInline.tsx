"use client";

import * as React from "react";

type FilterState = {
  category: string;
  method: string;
  currency: string;
};

export default function FiltersInline({
  onChange,
}: {
  onChange?: (filters: FilterState) => void;
}) {
  const [filters, setFilters] = React.useState<FilterState>({
    category: "все",
    method: "все",
    currency: "авто",
  });

  const handleChange = (key: keyof FilterState, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onChange?.(next);
  };

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

      {/* Категория */}
      <label className="flex items-center gap-1 min-w-[140px] flex-1">
        <span className="sr-only">Категория</span>
        <select
          value={filters.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="
            w-full
            rounded-lg bg-white/5 border border-white/15
            px-2 py-1
            text-sm text-white
            outline-none
            focus:ring-2 focus:ring-white/20
          "
        >
          <option value="все">Категория: все</option>
          <option value="услуги">Категория: услуги</option>
          <option value="товары">Категория: товары</option>
        </select>
      </label>

      {/* Метод оплаты */}
      <label className="flex items-center gap-1 min-w-[140px] flex-1">
        <span className="sr-only">Метод оплаты</span>
        <select
          value={filters.method}
          onChange={(e) => handleChange("method", e.target.value)}
          className="
            w-full
            rounded-lg bg-white/5 border border-white/15
            px-2 py-1
            text-sm text-white
            outline-none
            focus:ring-2 focus:ring-white/20
          "
        >
          <option value="все">Метод оплаты: все</option>
          <option value="card">card</option>
          <option value="invoice">invoice</option>
        </select>
      </label>

      {/* Валюта */}
      <label className="flex items-center gap-1 min-w-[120px] flex-1">
        <span className="sr-only">Валюта</span>
        <select
          value={filters.currency}
          onChange={(e) => handleChange("currency", e.target.value)}
          className="
            w-full
            rounded-lg bg-white/5 border border-white/15
            px-2 py-1
            text-sm text-white
            outline-none
            focus:ring-2 focus:ring-white/20
          "
        >
          <option value="авто">Валюта: авто</option>
          <option value="RUB">RUB</option>
          <option value="KRW">KRW</option>
          <option value="USD">USD</option>
        </select>
      </label>
    </div>
  );
}