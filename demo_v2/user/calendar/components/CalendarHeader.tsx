"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CalendarDays, Download } from "lucide-react";
import ExportMenu from "./ExportMenu";

export type CalendarView = "month" | "week" | "day";

export default function CalendarHeader({
  date,
  view,
  onNavigate,
  onViewChange,
  onOpenFilters,
  location,
  staff,
  locations,
  staffOptions,
  onLocationChange,
  onStaffChange,
}: {
  date: Date;
  view: CalendarView;
  onNavigate: (direction: "prev" | "next" | "today") => void;
  onViewChange: (view: CalendarView) => void;
  onOpenFilters: () => void;
  location: string | null;
  staff: string | null;
  locations: Array<{ id: string; label: string }>;
  staffOptions: Array<{ id: string; name: string }>;
  onLocationChange: (value: string | null) => void;
  onStaffChange: (value: string | null) => void;
}) {
  const [exportOpen, setExportOpen] = useState(false);

  const formattedDate = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("ru-RU", {
      year: "numeric",
      month: "long",
    });
    return formatter.format(date);
  }, [date]);

  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate("today")}
            className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-1.5 text-sm font-semibold text-[hsl(var(--fg))] transition hover:bg-[hsl(var(--panel))]/80"
          >
            Сегодня
          </button>
          <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-2 py-1">
            <button
              type="button"
              onClick={() => onNavigate("prev")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[hsl(var(--fg))] hover:bg-[hsl(var(--panel))]/80"
              aria-label="Назад"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <span className="px-2 text-sm font-semibold text-[hsl(var(--fg))] capitalize">{formattedDate}</span>
            <button
              type="button"
              onClick={() => onNavigate("next")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[hsl(var(--fg))] hover:bg-[hsl(var(--panel))]/80"
              aria-label="Вперёд"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 p-1 text-sm">
            {(["month", "week", "day"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onViewChange(option)}
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  view === option
                    ? "bg-[hsl(var(--brand))] text-white"
                    : "text-[hsl(var(--muted))] hover:bg-[hsl(var(--panel))]"
                }`}
              >
                {option === "month" ? "Месяц" : option === "week" ? "Неделя" : "День"}
              </button>
            ))}
          </div>

          <Link
            href="/demo/user/booking"
            className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <CalendarDays className="h-4 w-4" aria-hidden /> Записаться
          </Link>

          <button
            type="button"
            onClick={() => setExportOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-1.5 text-sm font-semibold text-[hsl(var(--fg))] transition hover:bg-[hsl(var(--panel))]/80"
          >
            <Download className="h-4 w-4" aria-hidden /> Экспорт
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--muted))]">
        <label className="flex items-center gap-2">
          Локация
          <select
            value={location ?? ""}
            onChange={(event) => onLocationChange(event.target.value || null)}
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1 text-sm text-[hsl(var(--fg))]"
          >
            <option value="">Все</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          Исполнитель
          <select
            value={staff ?? ""}
            onChange={(event) => onStaffChange(event.target.value || null)}
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1 text-sm text-[hsl(var(--fg))]"
          >
            <option value="">Все</option>
            {staffOptions.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex items-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1 text-xs font-semibold text-[hsl(var(--fg))] transition hover:bg-[hsl(var(--panel))]/80"
        >
          Фильтры
        </button>
      </div>

      {exportOpen ? (
        <ExportMenu onClose={() => setExportOpen(false)} />
      ) : null}
    </header>
  );
}
