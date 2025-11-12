"use client";

import { useState } from "react";
import Link from "next/link";

export type BookingsView = "list" | "calendar";

const ranges = [
  { id: "7", label: "Последние 7 дней" },
  { id: "30", label: "Последние 30 дней" },
  { id: "90", label: "Последние 90 дней" },
];

export default function BookingsHeader({
  view,
  onViewChange,
  search,
  onSearchChange,
  dateRange,
  onDateRangeChange,
}: {
  view: BookingsView;
  onViewChange: (view: BookingsView) => void;
  search: string;
  onSearchChange: (value: string) => void;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
}) {
  const [localSearch, setLocalSearch] = useState(search);

  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-[hsl(var(--fg))]">Мои записи</h1>
        <Link
          href="/demo/user/booking"
          className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Новая запись
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center gap-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 p-1 text-sm">
          {(["list", "calendar"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onViewChange(option)}
              className={`rounded-full px-4 py-1 font-semibold transition ${
                view === option
                  ? "bg-[hsl(var(--brand))] text-white"
                  : "text-[hsl(var(--muted))] hover:bg-[hsl(var(--panel))]"
              }`}
            >
              {option === "list" ? "Список" : "Календарь"}
            </button>
          ))}
        </div>

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

      <form
        className="flex items-center gap-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSearchChange(localSearch);
        }}
      >
        <input
          type="search"
          value={localSearch}
          onChange={(event) => setLocalSearch(event.target.value)}
          placeholder="Услуга, мастер, локация, № записи"
          className="flex-1 bg-transparent text-sm text-[hsl(var(--fg))] placeholder:text-[hsl(var(--muted))] focus:outline-none"
        />
        {search && (
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
        )}
        <button
          type="submit"
          className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1 text-xs text-[hsl(var(--fg))]"
        >
          Поиск
        </button>
      </form>
    </header>
  );
}
