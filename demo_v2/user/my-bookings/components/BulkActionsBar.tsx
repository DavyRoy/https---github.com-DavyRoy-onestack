"use client";

import type { MyBooking } from "../data/mockUserMyBookings";

export default function BulkActionsBar({
  selected,
  bookings,
  onClear,
  onCancel,
  onAddToCalendar,
  onPayDeposits,
}: {
  selected: string[];
  bookings: MyBooking[];
  onClear: () => void;
  onCancel: (ids: string[]) => void;
  onAddToCalendar: () => void;
  onPayDeposits: () => void;
}) {
  if (!selected.length) return null;
  const selectedBookings = bookings.filter((booking) => selected.includes(booking.id));
  const canCancel = selectedBookings.every((booking) => booking.status === "confirmed" || booking.status === "pending");
  const depositsDue = selectedBookings.filter((booking) => booking.paymentStatus === "deposit_due");

  return (
    <div className="sticky top-20 z-30 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/95 p-3 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[hsl(var(--muted))]">
        <span>Выбрано записей: {selected.length}</span>
        <div className="flex flex-wrap gap-2">
          {canCancel ? (
            <button
              type="button"
              onClick={() => onCancel(selected)}
              className="inline-flex items-center gap-2 rounded-full border border-rose-500/70 bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/20"
            >
              Отменить выбранные
            </button>
          ) : null}
          {depositsDue.length ? (
            <button
              type="button"
              onClick={onPayDeposits}
              className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-2 text-sm font-semibold text-white"
            >
              Оплатить депозиты (демо)
            </button>
          ) : null}
          <button
            type="button"
            onClick={onAddToCalendar}
            className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))]"
          >
            Добавить в календарь
          </button>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))]"
          >
            Очистить
          </button>
        </div>
      </div>
    </div>
  );
}
