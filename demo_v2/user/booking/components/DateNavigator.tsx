"use client";

import { addDays, addWeeks, format } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DateNavigator({
  anchor,
  onChange,
}: {
  anchor: Date;
  onChange: (date: Date) => void;
}) {
  const presets = [
    { label: "Сегодня", offset: 0 },
    { label: "Завтра", offset: 1 },
    { label: "Выходные", offset: ((7 - anchor.getDay()) % 7) || 6 },
  ];

  const formattedRange = `${format(anchor, "d MMM", { locale: ru })} — ${format(addDays(anchor, 6), "d MMM", { locale: ru })}`;

  return (
    <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[hsl(var(--border))]/80 bg-[hsl(var(--panel))]/70 px-4 py-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-[hsl(var(--fg))]">
        <button
          type="button"
          onClick={() => onChange(addWeeks(anchor, -1))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(var(--border))] text-[hsl(var(--fg))] hover:bg-[hsl(var(--panel))]/80"
          aria-label="Предыдущая неделя"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        <span>{formattedRange}</span>
        <button
          type="button"
          onClick={() => onChange(addWeeks(anchor, 1))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(var(--border))] text-[hsl(var(--fg))] hover:bg-[hsl(var(--panel))]/80"
          aria-label="Следующая неделя"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-[hsl(var(--muted))]">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onChange(addDays(new Date(), preset.offset))}
            className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-1.5 text-sm font-semibold text-[hsl(var(--fg))] transition hover:bg-[hsl(var(--panel))]/80"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </section>
  );
}
