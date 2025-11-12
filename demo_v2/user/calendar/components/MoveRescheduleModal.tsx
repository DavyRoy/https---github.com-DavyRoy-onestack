"use client";

import { useState } from "react";
import type { CalendarEvent } from "../data/mockUserCalendar";

export default function MoveRescheduleModal({ event, onClose }: { event: CalendarEvent | null; onClose: () => void }) {
  const [date, setDate] = useState(() => (event ? event.start.slice(0, 16) : ""));
  if (!event) return null;
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md space-y-4 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/95 p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-[hsl(var(--fg))]">Перенести {event.title}</h3>
        <p className="text-sm text-[hsl(var(--muted))]">
          Выберите новую дату и время. Настоящая форма демонстрационная и не сохраняет изменения.
        </p>
        <label className="flex flex-col text-xs text-[hsl(var(--muted))]">
          Новое время
          <input
            type="datetime-local"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="mt-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 px-3 py-2 text-sm text-[hsl(var(--fg))]"
          />
        </label>
        <div className="flex justify-end gap-2 text-sm">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-[hsl(var(--fg))] hover:bg-[hsl(var(--panel))]/80"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-2 text-white"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
