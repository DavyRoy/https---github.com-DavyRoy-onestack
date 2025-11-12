"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

// локальный tokens-набор (для демо можно заменить на общий)
const T = {
  card: "rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 backdrop-blur-sm shadow-md",
  dim: "text-white/70",
  cell: "rounded-lg border border-white/10 bg-white/[0.04] min-h-[80px] p-2",
  slotBtn:
    "mt-2 inline-flex items-center rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs hover:bg-white/15",
};

const WD_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Пн=0
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

export type WeekEvent = {
  id: string;
  dateISO: string; // YYYY-MM-DD
  time: string; // HH:mm
  title: string;
  status: "new" | "pending" | "confirmed" | "completed" | "cancelled";
  href?: string;
};

export default function CalendarGridWeek({
  focusDate,
  events,
  onCreateAt,
  onMoveEvent,
}: {
  focusDate: Date;
  events: WeekEvent[];
  onCreateAt: (payload: { dateISO: string; timeFrom: string }) => void;
  onMoveEvent: (id: string, nextISO: string, nextTime: string) => void;
}) {
  const weekStart = useMemo(() => startOfWeek(focusDate), [focusDate]);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const todayISO = useMemo(() => {
    const n = new Date();
    n.setHours(0, 0, 0, 0);
    return n.toISOString().slice(0, 10);
  }, []);

  const timeSlots = ["10:00", "12:00", "14:00", "16:00"];

  // Drag-select (desktop)
  const dragging = useRef<null | { dayIndex: number; slotIndex: number }>(null);
  const [hover, setHover] = useState<null | { dayIndex: number; slotIndex: number }>(null);

  const onMouseDown = (dayIndex: number, slotIndex: number) => {
    dragging.current = { dayIndex, slotIndex };
    setHover({ dayIndex, slotIndex });
    // предотвратить выделение текста при драге
    document.body.style.userSelect = "none";
  };
  const onMouseEnter = (dayIndex: number, slotIndex: number) => {
    if (dragging.current) setHover({ dayIndex, slotIndex });
  };
  const commitSelection = () => {
    if (dragging.current && hover) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + hover.dayIndex);
      const dateISO = d.toISOString().slice(0, 10);
      const timeFrom = timeSlots[hover.slotIndex];
      onCreateAt({ dateISO, timeFrom });
    }
    dragging.current = null;
    setHover(null);
    document.body.style.userSelect = "";
  };

  // Завершать drag, даже если курсор уходит за пределы грида
  useEffect(() => {
    const onUp = () => commitSelection();
    const onLeave = () => {
      dragging.current = null;
      setHover(null);
      document.body.style.userSelect = "";
    };
    window.addEventListener("mouseup", onUp);
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("blur", onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hover, weekStart]);

  const byDay = useMemo(() => {
    const map = new Map<string, WeekEvent[]>();
    for (const ev of events) {
      if (!map.has(ev.dateISO)) map.set(ev.dateISO, []);
      map.get(ev.dateISO)!.push(ev);
    }
    return map;
  }, [events]);

  const renderDayHeader = (dateISO: string, title: string) => {
    const isToday = dateISO === todayISO;
    return (
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-medium text-white/85">
          <span className={isToday ? "rounded-md bg-white/10 px-1.5 py-0.5" : ""}>
            {title}
            {isToday ? " • сегодня" : ""}
          </span>
        </div>
        <Link
          href={`/demo/manager/calendar?view=day&date=${encodeURIComponent(dateISO)}`}
          className="text-[11px] uppercase tracking-wide text-white/60 underline-offset-2 transition hover:text-white"
          aria-label={`Открыть день ${title}`}
        >
          День
        </Link>
      </div>
    );
  };

  return (
    <section
      className={T.card}
      onMouseLeave={() => {
        dragging.current = null;
        setHover(null);
        document.body.style.userSelect = "";
      }}
      aria-label="Календарная сетка — неделя"
    >
      {/* Мобильная лента */}
      <div className="-mx-2 mb-4 md:hidden">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-2 pb-1 [-webkit-overflow-scrolling:touch]">
          {days.map((d, i) => {
            const dateISO = d.toISOString().slice(0, 10);
            const label = `${WD_RU[i]} ${String(d.getDate()).padStart(2, "0")}`;
            const dayEvents = byDay.get(dateISO) || [];
            const isToday = dateISO === todayISO;

            return (
              <div
                key={`mobile-${dateISO}`}
                className="snap-start w-[240px] shrink-0 rounded-2xl border border-white/12 bg-white/[0.05] p-3 shadow-[0_18px_36px_-30px_rgba(6,10,18,0.95)]"
              >
                {renderDayHeader(dateISO, label)}
                <div className="mt-2 grid gap-2 text-xs">
                  {timeSlots.map((t) => {
                    const has = dayEvents.filter((e) => e.time === t);
                    return (
                      <div
                        key={`mobile-${dateISO}-${t}`}
                        className={
                          "rounded-xl border border-white/12 bg-white/[0.04] p-2 " +
                          (isToday ? "ring-1 ring-white/15" : "")
                        }
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-white/80">{t}</span>
                          <button
                            className="inline-flex items-center rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-[11px] font-medium hover:bg-white/16 active:scale-[0.98]"
                            onClick={() => onCreateAt({ dateISO, timeFrom: t })}
                            aria-label={`Создать запись ${dateISO} в ${t}`}
                          >
                            + Запись
                          </button>
                        </div>
                        <div className="mt-2 grid gap-1">
                          {has.length === 0 ? (
                            <span className="text-[11px] text-white/50">Свободно</span>
                          ) : (
                            has.map((ev) => (
                              <Link
                                key={ev.id}
                                href={
                                  ev.href ??
                                  `/demo/manager/booking/${encodeURIComponent(ev.id)}`
                                }
                                className="rounded-lg border border-white/15 bg-white/12 px-2 py-1 text-[11px] text-white/90 transition hover:border-white/25 hover:bg-white/18"
                                aria-label={`Открыть запись «${ev.title}»`}
                              >
                                <div className="truncate font-semibold">{ev.title}</div>
                                <div className="mt-0.5 flex items-center justify-between text-[10px] text-white/70">
                                  <span>{ev.status}</span>
                                  <span className="underline opacity-80">Открыть</span>
                                </div>
                              </Link>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Десктопная сетка */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <div className="grid min-w-[980px] grid-cols-7 gap-2 select-none">
            {days.map((d, i) => {
              const dateISO = d.toISOString().slice(0, 10);
              const label = `${WD_RU[i]} ${String(d.getDate()).padStart(2, "0")}`;
              const dayEvents = byDay.get(dateISO) || [];
              const isToday = dateISO === todayISO;

              return (
                <div
                  key={dateISO}
                  className={"rounded-xl border p-2 " + (isToday ? "border-white/30" : "border-white/10")}
                >
                  <div className="flex items-center justify-between">
                    <div className={"text-sm " + (isToday ? "opacity-100 font-medium" : "opacity-70")}>
                      {label} {isToday ? "• сегодня" : ""}
                    </div>
                    <Link
                      href={`/demo/manager/calendar?view=day&date=${encodeURIComponent(dateISO)}`}
                      className="underline text-xs opacity-80 hover:opacity-100"
                      aria-label={`Открыть день ${label}`}
                    >
                      день
                    </Link>
                  </div>

                  <div className="mt-2 grid gap-2" onMouseUp={commitSelection}>
                    {timeSlots.map((t, si) => {
                      const active = hover?.dayIndex === i && hover?.slotIndex === si;
                      const has = dayEvents.filter((e) => e.time === t);

                      return (
                        <div
                          key={t}
                          className={
                            T.cell +
                            (active ? " ring-2 ring-white/40" : "") +
                            (isToday ? " outline outline-1 outline-white/5" : "")
                          }
                          onMouseDown={() => onMouseDown(i, si)}
                          onMouseEnter={() => onMouseEnter(i, si)}
                          role="button"
                          tabIndex={-1}
                          aria-label={`${label}, слот ${t}`}
                          title={`${label}, ${t}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-xs opacity-70">{t}</div>
                            <button
                              className={T.slotBtn + " active:scale-[0.98]"}
                              onClick={() => onCreateAt({ dateISO, timeFrom: t })}
                              aria-label={`Создать запись ${dateISO} в ${t}`}
                            >
                              + запись
                            </button>
                          </div>

                          <div className="mt-2 grid gap-1">
                            {has.map((ev) => (
                              <div
                                key={ev.id}
                                className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs"
                                title={ev.title}
                                aria-label={`Запись: ${ev.title}, статус: ${ev.status}`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="truncate">{ev.title}</div>
                                  <Link
                                    className="underline opacity-80 hover:opacity-100"
                                    href={
                                      ev.href ??
                                      `/demo/manager/booking/${encodeURIComponent(ev.id)}`
                                    }
                                    aria-label={`Открыть запись «${ev.title}»`}
                                  >
                                    открыть
                                  </Link>
                                </div>

                                <div className="opacity-60">{ev.status}</div>

                                <div className="mt-1 flex gap-1">
                                  <button
                                    className="rounded border border-white/15 px-1"
                                    onClick={() => {
                                      const nextIndex = Math.min(timeSlots.length - 1, si + 1);
                                      onMoveEvent(ev.id, dateISO, timeSlots[nextIndex]);
                                    }}
                                    aria-label="Перенести позже"
                                    title="Перенести позже"
                                  >
                                    ↓ позже
                                  </button>
                                  <button
                                    className="rounded border border-white/15 px-1"
                                    onClick={() => {
                                      const prevIndex = Math.max(0, si - 1);
                                      onMoveEvent(ev.id, dateISO, timeSlots[prevIndex]);
                                    }}
                                    aria-label="Перенести раньше"
                                    title="Перенести раньше"
                                  >
                                    ↑ раньше
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={"mt-3 text-xs " + T.dim} aria-live="polite">
        Подсказка: выделите мышью слот (drag-select) или нажмите «+ запись» для быстрого создания.
        Клик «День» откроет детализацию по дню.
      </div>
    </section>
  );
}