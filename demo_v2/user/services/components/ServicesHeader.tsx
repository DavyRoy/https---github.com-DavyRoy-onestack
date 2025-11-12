"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

export type DurationPreset = "30" | "60" | "90" | "any";

export type ServicesHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onResetQuickFilters: () => void;
  durationPreset: DurationPreset;
  onDurationPresetChange: (value: DurationPreset) => void;
  priceRange: { min: number | null; max: number | null };
  onPriceRangeChange: (partial: Partial<{ min: number | null; max: number | null }>) => void;
  location: string | null;
  onLocationChange: (value: string | null) => void;
  staffId: string | null;
  onStaffChange: (value: string | null) => void;
  locations: Array<{ id: string; label: string }>;
  staff: Array<{ id: string; name: string }>;
  suggestions: string[];
  recent: string[];
  onSelectSuggestion: (value: string) => void;
};

export default function ServicesHeader({
  search,
  onSearchChange,
  onSearchSubmit,
  onResetQuickFilters,
  durationPreset,
  onDurationPresetChange,
  priceRange,
  onPriceRangeChange,
  location,
  onLocationChange,
  staffId,
  onStaffChange,
  locations,
  staff,
  suggestions,
  recent,
  onSelectSuggestion,
}: ServicesHeaderProps) {
  const [localSearch, setLocalSearch] = useState(search);

  const suggestionList = Array.from(new Set([localSearch, ...suggestions, ...recent].filter(Boolean))).slice(0, 7);

  return (
    <section className="space-y-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form
          className="flex flex-1 items-center gap-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-2"
          onSubmit={(event) => {
            event.preventDefault();
            onSearchChange(localSearch);
            onSearchSubmit();
          }}
        >
          <Search className="h-4 w-4 text-[hsl(var(--muted))]" aria-hidden />
          <input
            value={localSearch}
            onChange={(event) => setLocalSearch(event.target.value)}
            placeholder="Искать услуги…"
            className="flex-1 bg-transparent text-sm text-[hsl(var(--fg))] placeholder:text-[hsl(var(--muted))] focus:outline-none"
            aria-label="Искать услуги"
          />
        </form>
        <Link
          href="/demo/user/shop"
          className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))] transition hover:bg-[hsl(var(--panel))]/80"
        >
          Магазин
        </Link>
      </div>

      {suggestionList.length ? (
        <div className="flex flex-wrap gap-2 text-xs text-[hsl(var(--muted))]">
          <span className="text-[hsl(var(--muted))]">Предлагаем:</span>
          {suggestionList.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setLocalSearch(item);
                onSelectSuggestion(item);
              }}
              className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-1 text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))]"
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1.5 text-xs">
          <span className="uppercase tracking-[0.2em] text-[hsl(var(--muted))]">Длительность</span>
          {[
            { id: "any" as DurationPreset, label: "Любая" },
            { id: "30" as DurationPreset, label: "≤ 30 мин" },
            { id: "60" as DurationPreset, label: "≤ 60 мин" },
            { id: "90" as DurationPreset, label: "90+" },
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onDurationPresetChange(preset.id)}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                durationPreset === preset.id
                  ? "bg-[hsl(var(--brand))] text-white"
                  : "text-[hsl(var(--muted))] hover:bg-[hsl(var(--panel))]"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1.5 text-xs text-[hsl(var(--muted))]">
          Цена
          <input
            type="number"
            value={priceRange.min ?? ""}
            placeholder="от"
            min={0}
            onChange={(event) => onPriceRangeChange({ min: event.target.value ? Number(event.target.value) : null })}
            className="w-16 rounded-lg border border-[hsl(var(--border))]/50 bg-[hsl(var(--panel))]/80 px-2 py-1 text-sm text-[hsl(var(--fg))]"
          />
          <input
            type="number"
            value={priceRange.max ?? ""}
            placeholder="до"
            min={0}
            onChange={(event) => onPriceRangeChange({ max: event.target.value ? Number(event.target.value) : null })}
            className="w-16 rounded-lg border border-[hsl(var(--border))]/50 bg-[hsl(var(--panel))]/80 px-2 py-1 text-sm text-[hsl(var(--fg))]"
          />
        </div>

        <label className="flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1.5 text-xs text-[hsl(var(--muted))]">
          Локация
          <select
            value={location ?? ""}
            onChange={(event) => onLocationChange(event.target.value || null)}
            className="bg-transparent text-sm text-[hsl(var(--fg))] focus:outline-none"
          >
            <option value="">Любая</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1.5 text-xs text-[hsl(var(--muted))]">
          Исполнитель
          <select
            value={staffId ?? ""}
            onChange={(event) => onStaffChange(event.target.value || null)}
            className="bg-transparent text-sm text-[hsl(var(--fg))] focus:outline-none"
          >
            <option value="">Любой</option>
            {staff.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => {
            setLocalSearch("");
            onSearchChange("");
            onResetQuickFilters();
          }}
          className="inline-flex items-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1.5 text-xs font-semibold text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))]"
        >
          Сбросить фильтры
        </button>
      </div>
    </section>
  );
}
