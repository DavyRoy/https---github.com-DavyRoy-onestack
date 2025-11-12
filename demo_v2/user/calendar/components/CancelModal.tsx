"use client";

import type { CalendarEvent } from "../data/mockUserCalendar";

export default function CancelModal({ event, onClose }: { event: CalendarEvent | null; onClose: () => void }) {
  if (!event) return null;
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md space-y-4 rounded-3xl border border-rose-500/60 bg-[hsl(var(--panel))]/95 p-6 text-sm text-[hsl(var(--muted))] shadow-2xl">
        <h3 className="text-lg font-semibold text-rose-200">Отменить {event.title}?</h3>
        <p>
          Отмена может повлечь удержание депозита согласно политике. Для демонстрации действие не сохраняется.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-[hsl(var(--fg))] hover:bg-[hsl(var(--panel))]/80"
          >
            Вернуться
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-rose-500 bg-rose-500/90 px-4 py-2 text-white"
          >
            Подтвердить отмену
          </button>
        </div>
      </div>
    </div>
  );
}
