"use client";

import { useState } from "react";
import Link from "next/link";

const ranges = [
  { id: "30", label: "Последние 30 дней" },
  { id: "90", label: "Последние 90 дней" },
  { id: "365", label: "Последний год" },
];

export default function OrdersHeader({
  search,
  onSearchChange,
  dateRange,
  onDateRangeChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
}) {
  const [localSearch, setLocalSearch] = useState(search);

  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-[hsl(var(--fg))]">Мои заказы</h1>
        <Link
          href="/demo/user/shop"
          className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          В магазин
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form
          className="flex flex-1 items-center gap-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-2"
          onSubmit={(event) => {
            event.preventDefault();
            onSearchChange(localSearch);
          }}
        >
          <input
            type="search"
            value={localSearch}
            onChange={(event) => setLocalSearch(event.target.value)}
            placeholder="Товар, услуга, № заказа, трек-код"
            className="flex-1 bg-transparent text-sm text-[hsl(var(--fg))] placeholder:text-[hsl(var(--muted))] focus:outline-none"
          />
          {localSearch ? (
            <button
              type="button"
              onClick={() => {
                setLocalSearch("");
                onSearchChange("");
              }}
              className="rounded-full px-2 py-1 text-xs text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))]"
            >
              Очистить
            </button>
          ) : null}
          <button
            type="submit"
            className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1 text-xs text-[hsl(var(--fg))]"
          >
            Поиск
          </button>
        </form>

        <label className="flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1 text-sm text-[hsl(var(--muted))]">
          Диапазон
          <select
            value={dateRange}
            onChange={(event) => onDateRangeChange(event.target.value)}
            className="bg-transparent text-sm text-[hsl(var(--fg))] focus:outline-none"
          >
            {ranges.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
              </option>
            ))}
            <option value="custom">Выбрать период…</option>
          </select>
        </label>
      </div>
    </header>
  );
}
