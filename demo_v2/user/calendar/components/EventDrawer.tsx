"use client";

import Link from "next/link";
import type { CalendarEvent } from "../data/mockUserCalendar";

export default function EventDrawer({
  event,
  onClose,
  onReschedule,
  onCancel,
}: {
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
    <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-[hsl(var(--border))] bg-[hsl(var(--panel))]/95 p-5 shadow-2xl lg:hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-[hsl(var(--fg))]">{event.title}</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 px-3 py-1 text-xs text-[hsl(var(--muted))]"
        >
          Закрыть
        </button>
      </div>
      <p className="mt-2 text-sm text-[hsl(var(--muted))]">
        {start.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })} •
        {event.allDay ? " Весь день" : ` ${start.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })} – ${end.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {event.link ? (
          <Link
            href={event.link}
            className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))]"
            onClick={onClose}
          >
            Подробнее
          </Link>
        ) : null}
        {canManage ? (
          <>
            <button
              type="button"
              onClick={() => onReschedule(event)}
              className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))]"
            >
              Перенести
            </button>
            <button
              type="button"
              onClick={() => onCancel(event)}
              className="inline-flex items-center justify-center rounded-full border border-rose-500/70 bg-rose-500/20 px-4 py-2 text-sm font-semibold text-white"
            >
              Отменить
            </button>
          </>
        ) : null}
        {canPay ? (
          <Link
            href={`/demo/user/payments/checkout?invoice=${event.id}`}
            className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-2 text-sm font-semibold text-white"
            onClick={onClose}
          >
            Оплатить
          </Link>
        ) : null}
      </div>
    </div>
  );
}
