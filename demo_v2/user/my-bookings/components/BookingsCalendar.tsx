"use client";

import { useMemo, useState } from "react";
import type { MyBooking } from "../data/mockUserMyBookings";

const startOfWeek = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  return d;
};

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const addMonths = (date: Date, months: number) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

export default function BookingsCalendar({ bookings, onSelect }: { bookings: MyBooking[]; onSelect: (booking: MyBooking) => void }) {
  const [mode, setMode] = useState<"week" | "month">("week");
  const [anchor, setAnchor] = useState(startOfWeek(new Date()));

  const handleNavigate = (direction: "prev" | "next") => {
    if (mode === "week") {
      setAnchor((prev) => addDays(prev, direction === "next" ? 7 : -7));
    } else {
      setAnchor((prev) => startOfWeek(addMonths(prev, direction === "next" ? 1 : -1)));
    }
  };

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(startOfWeek(anchor), index)), [anchor]);

  const monthCells = useMemo(() => {
    const start = startOfWeek(startOfMonth(anchor));
    return Array.from({ length: 42 }, (_, index) => addDays(start, index));
  }, [anchor]);

  const eventsByDay = (day: Date) =>
    bookings.filter((booking) => {
      const start = new Date(booking.start);
      return (
        start.getFullYear() === day.getFullYear() && start.getMonth() === day.getMonth() && start.getDate() === day.getDate()
      );
    });

  return (
    <div className="space-y-3 rounded-2xl border border-[hsl(var(--border))]/70 bg-[hsl(var(--panel))]/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[hsl(var(--muted))]">
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleNavigate("prev")}
            className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 px-3 py-1"
          >
            Назад
          </button>
          <button
            type="button"
            onClick={() => handleNavigate("next")}
            className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 px-3 py-1"
          >
            Вперёд
          </button>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 p-1 text-sm">
          {(["week", "month"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                mode === option
                  ? "bg-[hsl(var(--brand))] text-white"
                  : "text-[hsl(var(--muted))] hover:bg-[hsl(var(--panel))]"
              }`}
            >
              {option === "week" ? "Неделя" : "Месяц"}
            </button>
          ))}
        </div>
      </div>

      {mode === "week" ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {weekDays.map((day) => {
            const items = eventsByDay(day);
            return (
              <div key={day.toISOString()} className="space-y-2 rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--panel))]/70 p-3">
                <h3 className="text-sm font-semibold text-[hsl(var(--fg))]">
                  {day.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "short" })}
                </h3>
                {items.length ? (
                  <ul className="space-y-2 text-xs text-[hsl(var(--muted))]">
                    {items.map((booking) => (
                      <li key={booking.id}>
                        <button
                          type="button"
                          onClick={() => onSelect(booking)}
                          className="w-full rounded-xl border border-[hsl(var(--border))]/50 bg-[hsl(var(--panel))]/80 px-3 py-2 text-left hover:bg-[hsl(var(--panel))]/70"
                        >
                          <p className="font-semibold text-[hsl(var(--fg))]">{booking.serviceTitle}</p>
                          <p>{new Date(booking.start).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</p>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[hsl(var(--muted))]">Нет записей</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-2 md:grid-cols-7">
          {monthCells.map((day) => {
            const items = eventsByDay(day);
            return (
              <div
                key={day.toISOString()}
                className={`min-h-[110px] rounded-2xl border border-[hsl(var(--border))]/50 bg-[hsl(var(--panel))]/70 p-2 ${
                  day.getMonth() === anchor.getMonth() ? "" : "opacity-50"
                }`}
              >
                <div className="flex items-center justify-between text-[0.7rem] text-[hsl(var(--muted))]">
                  <span>{day.getDate()}</span>
                  <span>{items.length}</span>
                </div>
                <div className="mt-1 space-y-1 text-[0.7rem] text-[hsl(var(--muted))]">
                  {items.slice(0, 3).map((booking) => (
                    <button
                      key={booking.id}
                      type="button"
                      onClick={() => onSelect(booking)}
                      className="block w-full truncate rounded-lg border border-[hsl(var(--border))]/50 bg-[hsl(var(--panel))]/80 px-2 py-1 text-left hover:bg-[hsl(var(--panel))]/70"
                    >
                      {booking.serviceTitle}
                    </button>
                  ))}
                  {items.length > 3 ? <span>+ ещё {items.length - 3}</span> : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
