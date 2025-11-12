"use client";

import Link from "next/link";
import type { CalendarEvent } from "../data/mockUserCalendar";

export default function EventPopover({ event, onClose, onReschedule, onCancel }: {
  event: CalendarEvent | null;
  onClose: () => void;
  onReschedule: (event: CalendarEvent) => void;
  onCancel: (event: CalendarEvent) => void;
}) {
  if (!event) return null;
  const start = new Date(event.start);
  const end = new Date(event.end);
  const isPast = start.getTime() < Date.now();
  const canManage = event.type === "booking" && !isPast && event.status !== "cancelled";
  const canPay = event.type === "payment" && event.status === "due";

  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/95 p-4 text-sm text-[hsl(var(--muted))] shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[hsl(var(--fg))]">{event.title}</p>
          <p className="text-xs text-[hsl(var(--muted))]">
            {start.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })} •
            {event.allDay ? "Весь день" : ` ${start.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })} – ${end.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 px-2 py-1 text-xs text-[hsl(var(--muted))] hover:bg-[hsl(var(--panel))]"
        >
          Закрыть
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {event.link ? (
          <Link
            href={event.link}
            className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-1 text-xs font-semibold text-[hsl(var(--fg))] transition hover:bg-[hsl(var(--panel))]/80"
          >
            Подробнее
          </Link>
        ) : null}
        {canManage ? (
          <>
            <button
              type="button"
              onClick={() => onReschedule(event)}
              className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-1 text-xs font-semibold text-[hsl(var(--fg))] transition hover:bg-[hsl(var(--panel))]/80"
            >
              Перенести
            </button>
            <button
              type="button"
              onClick={() => onCancel(event)}
              className="inline-flex items-center justify-center rounded-full border border-rose-500/70 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-100 transition hover:bg-rose-500/20"
            >
              Отменить
            </button>
          </>
        ) : null}
        {canPay ? (
          <Link
            href={`/demo/user/payments/checkout?invoice=${event.id}`}
            className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-3 py-1 text-xs font-semibold text-white"
          >
            Оплатить
          </Link>
        ) : null}
      </div>
    </div>
  );
}
