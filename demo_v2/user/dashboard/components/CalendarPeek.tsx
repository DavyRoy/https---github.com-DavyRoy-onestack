// src/app/demo/user/dashboard/components/CalendarPeek.tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { CalendarDay } from "../data/mockUserDashboard";
import {
  cn,
  SECTION_WRAP,
  TITLE_SM,
  FOCUS_RING,
  TAPPABLE,
  BTN_GHOST,
  EYEBROW,
  useStableId,
} from "./_shared";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

type WeekData = {
  weekStartLabel: string;
  days: CalendarDay[];
};

type Props = {
  week: WeekData;
  bookingBaseHref?: string;
  calendarHref?: string;
  compact?: boolean;
};

function dayNumber(date: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  return m ? String(parseInt(m[3], 10)) : date;
}

function isWeekend(weekday: string) {
  const w = weekday.toLowerCase();
  return w.startsWith("сб") || w.startsWith("вс");
}

export default function CalendarPeek({
  week,
  bookingBaseHref = "/demo/user/booking",
  calendarHref = "/demo/user/calendar",
  compact = false,
}: Props) {
  const { weekStartLabel, days } = week ?? { weekStartLabel: "", days: [] };
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLUListElement | null>(null);
  const [canScroll, setCanScroll] = useState(false);

  const baseId = useStableId("calendar");
  const headingId = `${baseId}-title`;
  const listId = `${baseId}-rail`;

  const fadeIn = useCallback(
    (i = 0): MotionProps =>
      reduced
        ? {}
        : {
            initial: { opacity: 0, y: 8 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.1 },
            transition: { delay: 0.03 + i * 0.02, duration: 0.3, ease: "easeOut" },
          },
    [reduced]
  );

  const anyToday = useMemo(() => days?.some((d) => d.isToday), [days]);
  const focusableSelectors =
    'a[data-day="true"], div[aria-disabled="true"][data-day="true"]';

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const updateScrollState = () => {
      setCanScroll(rail.scrollWidth > rail.clientWidth + 2);
    };
    updateScrollState();

    const onWheel = (e: WheelEvent) => {
      if (rail.scrollWidth <= rail.clientWidth + 2) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        rail.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    rail.addEventListener("wheel", onWheel as EventListener, { passive: false });

    const ro = "ResizeObserver" in window ? new ResizeObserver(updateScrollState) : null;
    ro?.observe(rail);

    return () => {
      rail.removeEventListener("wheel", onWheel as EventListener);
      ro?.disconnect?.();
    };
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLUListElement>) => {
      const rail = railRef.current;
      if (!rail) return;

      const items = Array.from(rail.querySelectorAll<HTMLElement>(focusableSelectors));
      if (!items.length) return;

      const idx = items.findIndex((el) => el === document.activeElement);
      const focusIdx = (ni: number) => {
        const clamped = Math.max(0, Math.min(items.length - 1, ni));
        const el = items[clamped];
        el?.focus();
        el?.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "nearest",
          inline: "center",
        });
      };

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          focusIdx(idx >= 0 ? idx + 1 : 0);
          break;
        case "ArrowLeft":
          e.preventDefault();
          focusIdx(idx >= 0 ? idx - 1 : items.length - 1);
          break;
        case "Home":
          e.preventDefault();
          focusIdx(0);
          break;
        case "End":
          e.preventDefault();
          focusIdx(items.length - 1);
          break;
      }
    },
    [reduced]
  );

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const mq = window.matchMedia("(max-width: 639px)");
    if (!mq.matches) return;

    const todayEl = rail.querySelector<HTMLElement>('[data-today="true"]');
    if (todayEl) {
      todayEl.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [days, reduced]);

  const scrollBy = (dir: "prev" | "next") => {
    const rail = railRef.current;
    if (!rail) return;
    const delta = Math.round(rail.clientWidth * 0.7) * (dir === "prev" ? -1 : 1);
    rail.scrollBy({ left: delta, behavior: reduced ? "auto" : "smooth" });
  };

  if (!days || days.length === 0) {
    return (
      <section className={cn(SECTION_WRAP, compact ? "p-3" : "p-4")}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Calendar width={compact ? 16 : 18} height={compact ? 16 : 18} className="text-white/60" aria-hidden />
            <h2 id={headingId} className={cn(TITLE_SM, "text-white/90")}>
              Календарь
            </h2>
          </div>
        </div>
        <div className="text-sm text-white/60 mb-3">На этой неделе событий нет.</div>
        <Link
          href={calendarHref}
          prefetch={false}
          className={cn(
            BTN_GHOST,
            "w-full justify-center text-sm",
            compact && "text-xs py-1.5"
          )}
        >
          Открыть календарь
        </Link>
      </section>
    );
  }

  return (
    <section
      id="calendar"
      aria-labelledby={headingId}
      className={cn(
        SECTION_WRAP,
        compact ? "p-3" : "p-4"
      )}
    >
      {/* Заголовок */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-lg bg-white/10 p-2 border border-white/10">
            <Calendar className="h-4 w-4 text-white/70" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className={cn(EYEBROW, "text-white/60")}>календарь</p>
            <h2 id={headingId} className={cn(TITLE_SM, "text-white/90 text-lg sm:text-xl")}>
              {weekStartLabel}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {anyToday && (
            <button
              type="button"
              onClick={() => {
                const rail = railRef.current;
                if (!rail) return;
                const todayEl = rail.querySelector<HTMLElement>('[data-today="true"]');
                todayEl?.scrollIntoView({
                  behavior: reduced ? "auto" : "smooth",
                  block: "nearest",
                  inline: "center",
                });
                todayEl?.focus?.();
              }}
              className={cn(
                BTN_GHOST,
                "text-xs px-3 py-1.5"
              )}
            >
              Сегодня
            </button>
          )}
          <Link
            href={calendarHref}
            prefetch={false}
            className={cn(
              BTN_GHOST,
              "text-xs px-3 py-1.5 ml-auto"
            )}
          >
            Весь календарь
          </Link>
        </div>
      </div>

      {/* Контейнер для рельсы */}
      <div className="relative">
        {canScroll && (
          <>
            <ScrollBtn
              side="left"
              onClick={() => scrollBy("prev")}
              ariaControls={listId}
              ariaLabel="Прокрутить к предыдущим дням"
              compact={compact}
            />
            <ScrollBtn
              side="right"
              onClick={() => scrollBy("next")}
              ariaControls={listId}
              ariaLabel="Прокрутить к следующим дням"
              compact={compact}
            />
          </>
        )}

        {/* Рельса дней недели */}
        <ul
          id={listId}
          ref={railRef}
          onKeyDown={onKeyDown}
          role="list"
          aria-roledescription="Календарная неделя"
          className={cn(
            "grid grid-flow-col auto-cols-[minmax(100px,1fr)] gap-2",
            "text-center text-sm overflow-x-auto",
            "sm:grid-cols-7 sm:auto-cols-auto sm:overflow-visible",
            compact && "auto-cols-[minmax(90px,1fr)] gap-1.5"
          )}
          aria-label="Дни недели"
        >
          {days.map((d, i) => {
            const { id, date, dayName, slots, isToday } = d;
            const slotsCount = slots.length;
            const dNum = dayNumber(date);
            const weekend = isWeekend(dayName);

            const label =
              slotsCount > 0
                ? `${dayName}, ${dNum} — доступно слотов: ${slotsCount}`
                : `${dayName}, ${dNum} — слотов нет`;

            const base = cn(
              "group flex h-full min-h-[100px] flex-col items-center justify-between rounded-xl border px-3 py-3",
              "text-white/60 transition-all",
              FOCUS_RING,
              TAPPABLE,
              compact && "min-h-[90px] px-2 py-2"
            );

            const idle =
              "border-white/15 bg-white/5 hover:border-white/20 hover:bg-white/10 hover:text-white/80";
            const today =
              "border-blue-500/40 bg-blue-500/10 text-white/90";
            const weekendTone = weekend ? "ring-1 ring-inset ring-white/5" : "";

            const cls = cn(base, isToday ? today : idle, weekendTone);

            const slotBadge =
              slotsCount === 0
                ? "bg-white/10 text-white/60"
                : slotsCount < 3
                ? "bg-amber-500/20 text-amber-200"
                : "bg-emerald-500/20 text-emerald-200";

            const describedBy = `cal-desc-${id}`;

            return (
              <motion.li key={id} {...fadeIn(i)} className="contents sm:block">
                {slotsCount > 0 ? (
                  <Link
                    href={`${bookingBaseHref}?date=${encodeURIComponent(date)}`}
                    prefetch={false}
                    aria-label={label}
                    aria-describedby={describedBy}
                    aria-current={isToday ? "date" : undefined}
                    title={label}
                    data-day="true"
                    data-today={isToday ? "true" : undefined}
                    data-slot-count={slotsCount}
                    className={cls}
                  >
                    <DayFace
                      dayName={dayName}
                      dNum={dNum}
                      isToday={!!isToday}
                      weekend={weekend}
                      slotBadge={slotBadge}
                      slotsCount={slotsCount}
                      id={id}
                      compact={compact}
                    />
                  </Link>
                ) : (
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") e.preventDefault();
                    }}
                    aria-disabled="true"
                    aria-label={label}
                    aria-describedby={describedBy}
                    title={label}
                    data-day="true"
                    data-slot-count={0}
                    className={cn(cls, "cursor-not-allowed opacity-60")}
                  >
                    <DayFace
                      dayName={dayName}
                      dNum={dNum}
                      isToday={!!isToday}
                      weekend={weekend}
                      slotBadge="bg-white/10 text-white/40"
                      slotsCount={0}
                      id={id}
                      compact={compact}
                    />
                  </div>
                )}

                <span id={describedBy} className="sr-only">
                  {isToday ? "Сегодня. " : ""}
                  {weekend ? "Выходной. " : ""}
                  {slotsCount > 0 ? `Свободно ${slotsCount} слотов.` : "Свободных слотов нет."}
                </span>
              </motion.li>
            );
          })}
        </ul>
      </div>

      {/* Легенда */}
      {!compact && (
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
            <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-300" aria-hidden />
              Много слотов
            </div>
            <div className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-1">
              <span className="h-2 w-2 rounded-full bg-amber-300" aria-hidden />
              Мало слотов
            </div>
            <div className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-1">
              <span className="h-2 w-2 rounded-full bg-white/60" aria-hidden />
              Нет слотов
            </div>
            {anyToday && (
              <div className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/15 px-2 py-1">
                <span className="h-2 w-2 rounded-full bg-blue-300" aria-hidden />
                Сегодня
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function DayFace({
  dayName,
  dNum,
  isToday,
  slotBadge,
  slotsCount,
  id,
  weekend,
  compact,
}: {
  dayName: string;
  dNum: string;
  isToday: boolean;
  slotBadge: string;
  slotsCount: number;
  id: string | number;
  weekend?: boolean;
  compact?: boolean;
}) {
  return (
    <>
      <span className={cn(
        "text-xs uppercase tracking-wide text-white/60",
        compact && "text-[11px]"
      )}>
        {dayName}
      </span>
      <span className={cn(
        "font-bold text-white/90",
        compact ? "text-base" : "text-lg"
      )}>
        {dNum}
      </span>
      <span
        className={cn(
          "inline-flex min-w-[2ch] items-center justify-center rounded-full px-2 py-1 text-xs font-medium",
          slotBadge,
          compact && "text-[11px] px-1.5 py-0.5"
        )}
        aria-hidden
      >
        {slotsCount > 0 ? slotsCount : "Нет"}
      </span>
      {isToday && <span className="sr-only" id={`badge-today-${id}`}>Сегодня</span>}
      {weekend && <span className="sr-only">Выходной</span>}
    </>
  );
}

function ScrollBtn({
  side,
  onClick,
  ariaControls,
  ariaLabel,
  compact,
}: {
  side: "left" | "right";
  onClick: () => void;
  ariaControls: string;
  ariaLabel: string;
  compact?: boolean;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  const pos = side === "left" ? "left-0" : "right-0";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-controls={ariaControls}
      aria-label={ariaLabel}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-20 hidden sm:inline-flex",
        pos,
        "items-center justify-center rounded-xl border border-white/15 bg-[#050911]/80 backdrop-blur",
        "text-white/60 transition-all hover:bg-white/10 hover:text-white/80",
        FOCUS_RING,
        compact ? "h-7 w-7" : "h-8 w-8"
      )}
    >
      <Icon width={compact ? 14 : 16} height={compact ? 14 : 16} aria-hidden />
    </button>
  );
}