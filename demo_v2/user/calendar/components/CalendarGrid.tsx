"use client";

import EventChip from "./EventChip";
import AllDayRail from "./AllDayRail";
import type { CalendarEvent, CalendarLegendMap } from "../data/mockUserCalendar";
import type { CalendarView } from "./CalendarHeader";

const cloneDate = (date: Date) => new Date(date.getTime());
const startOfDay = (date: Date) => {
  const d = cloneDate(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date: Date, days: number) => {
  const d = cloneDate(date);
  d.setDate(d.getDate() + days);
  return d;
};

const startOfWeek = (date: Date) => {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = (day + 6) % 7; // Monday start
  return addDays(d, -diff);
};

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const formatDayLabel = (date: Date) =>
  date.toLocaleDateString("ru-RU", { day: "numeric", weekday: "short" }).replace(".", "");

export default function CalendarGrid({
  view,
  date,
  events,
  legend,
  onSelect,
}: {
  view: CalendarView;
  date: Date;
  events: CalendarEvent[];
  legend: CalendarLegendMap;
  onSelect: (event: CalendarEvent) => void;
}) {
  if (view === "month") {
    const monthStart = startOfMonth(date);
    const start = startOfWeek(monthStart);
    const cells = Array.from({ length: 42 }, (_, index) => addDays(start, index));
    return (
      <div className="grid gap-2 rounded-2xl border border-[hsl(var(--border))]/70 bg-[hsl(var(--panel))]/60 p-2 md:grid-cols-7">
        {cells.map((day) => {
          const dayEvents = events.filter((event) => {
            const eventDate = new Date(event.start);
            return (
              eventDate.getFullYear() === day.getFullYear() &&
              eventDate.getMonth() === day.getMonth() &&
              eventDate.getDate() === day.getDate()
            );
          });
          const allDay = dayEvents.filter((event) => event.allDay);
          const timed = dayEvents.filter((event) => !event.allDay);
          return (
            <div
              key={day.toISOString()}
              className={`flex min-h-[120px] flex-col gap-1 rounded-xl border border-[hsl(var(--border))]/40 bg-[hsl(var(--panel))]/70 p-2 ${
                day.getMonth() === date.getMonth() ? "" : "opacity-50"
              }`}
            >
              <div className="flex items-center justify-between text-xs text-[hsl(var(--muted))]">
                <span>{formatDayLabel(day)}</span>
              </div>
              <AllDayRail events={allDay} legend={legend} onSelect={onSelect} />
              <div className="flex flex-col gap-1">
                {timed.slice(0, 3).map((event) => (
                  <EventChip key={event.id} event={event} legend={legend} onSelect={onSelect} />
                ))}
                {timed.length > 3 ? (
                  <span className="text-[0.7rem] text-[hsl(var(--muted))]">+ ещё {timed.length - 3}</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const weekStart = startOfWeek(date);
  const days = view === "week" ? Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)) : [startOfDay(date)];

  return (
    <div className="space-y-3 rounded-2xl border border-[hsl(var(--border))]/70 bg-[hsl(var(--panel))]/60 p-3">
      <AllDayRail
        events={events.filter((event) => event.allDay)}
        legend={legend}
        onSelect={onSelect}
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {days.map((day) => {
          const dayEvents = events.filter((event) => {
            if (event.allDay) return false;
            const eventDate = new Date(event.start);
            return (
              eventDate.getFullYear() === day.getFullYear() &&
              eventDate.getMonth() === day.getMonth() &&
              eventDate.getDate() === day.getDate()
            );
          });
          return (
            <div key={day.toISOString()} className="space-y-2 rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--panel))]/70 p-3">
              <div className="flex items-center justify-between text-sm text-[hsl(var(--muted))]">
                <span>{formatDayLabel(day)}</span>
                <span>{dayEvents.length} событий</span>
              </div>
              {dayEvents.length ? (
                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <EventChip key={event.id} event={event} legend={legend} onSelect={onSelect} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[hsl(var(--muted))]">Нет событий</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
