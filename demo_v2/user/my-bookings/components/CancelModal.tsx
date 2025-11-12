"use client";

import type { MyBooking } from "../data/mockUserMyBookings";

export default function CancelModal({ booking, onClose }: { booking: MyBooking | null; onClose: () => void }) {
  if (!booking) return null;
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md space-y-4 rounded-3xl border border-rose-500/60 bg-[hsl(var(--panel))]/95 p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-rose-200">Отменить «{booking.serviceTitle}»?</h3>
        <p className="text-sm text-[hsl(var(--muted))]">
          Отмена за менее чем 24 часа может удержать депозит. Для демонстрации действие не сохраняется.
        </p>
        <div className="flex justify-end gap-2 text-sm">
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
