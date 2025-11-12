"use client";

import type { CalendarEvent, CalendarLegendMap } from "../data/mockUserCalendar";

const statusText: Record<string, string> = {
  confirmed: "Подтверждено",
  pending: "Ожидает",
  cancelled: "Отменено",
  due: "К оплате",
  paid: "Оплачено",
  delivering: "Доставка",
  delivered: "Доставлено",
};

export default function EventChip({
  event,
  legend,
  onSelect,
}: {
  event: CalendarEvent;
  legend: CalendarLegendMap;
  onSelect: (event: CalendarEvent) => void;
}) {
  const style = legend[event.type]?.[event.status];
  const className = style ?? "bg-[hsl(var(--panel))] text-[hsl(var(--fg))]";
  const start = new Date(event.start);
  const end = new Date(event.end);
  const timeLabel = event.allDay
    ? "Весь день"
    : `${start.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })} – ${end.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`;

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      className={`flex w-full flex-col rounded-xl px-3 py-2 text-left text-xs shadow-sm transition hover:opacity-90 ${className}`}
    >
      <span className="text-[0.75rem] font-semibold">{event.title}</span>
      <span className="text-[0.7rem] opacity-80">{timeLabel}</span>
      <span className="text-[0.65rem] opacity-80">{statusText[event.status] ?? event.status}</span>
    </button>
  );
}
