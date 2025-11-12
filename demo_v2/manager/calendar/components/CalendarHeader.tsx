"use client";

import React, { useMemo } from "react";
import Link from "next/link";

// Если у вас уже есть общий tokens-файл — замените путь импорта:
const T = {
  hero:
    "relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-white/5 to-white/10 p-4 md:p-6 backdrop-blur-sm shadow-xl",
  dim: "text-white/70",
  btn:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30",
};

const MONTHS_RU = [
  "янв", "фев", "мар", "апр", "май", "июн",
  "июл", "авг", "сен", "окт", "ноя", "дек",
];

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Пн=0
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

function fmtDate(d: Date) {
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS_RU[d.getMonth()]} ${d.getFullYear()}`;
}
function fmtRangeWeek(focus: Date) {
  const s = startOfWeek(focus);
  const e = new Date(s);
  e.setDate(e.getDate() + 6);
  const sameMonth = s.getMonth() === e.getMonth();
  const monthPart = sameMonth
    ? MONTHS_RU[e.getMonth()]
    : `${MONTHS_RU[s.getMonth()]}–${MONTHS_RU[e.getMonth()]}`;
  return `${s.getDate()}–${e.getDate()} ${monthPart} ${e.getFullYear()}`;
}

export default function CalendarHeader({
  view,
  focusDate,
  onPrev,
  onToday,
  onNext,
}: {
  view: "day" | "week" | "month";
  focusDate: Date;
  onPrev: () => void;
  onToday: () => void;
  onNext: () => void;
}) {
  const title = useMemo(() => {
    if (view === "day") return fmtDate(focusDate);
    if (view === "week") return fmtRangeWeek(focusDate);
    return `${MONTHS_RU[focusDate.getMonth()]} ${focusDate.getFullYear()}`;
  }, [view, focusDate]);

  return (
    <header className={T.hero} aria-label="Заголовок календаря">
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-white/60 sm:text-sm">Календарь</div>
          <h1 className="mt-1 text-xl font-semibold sm:text-2xl">Расписания и записи</h1>
          {/* suppressHydrationWarning на случай расхождений из-за расширений */}
          <p
            suppressHydrationWarning
            className={"mt-1 text-sm " + T.dim}
            aria-live="polite"
          >
            {title}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <div className="grid w-full grid-cols-3 gap-2 sm:w-auto sm:grid-cols-[repeat(3,auto)] sm:flex sm:gap-2">
            <button
              type="button"
              className={T.btn + " w-full sm:w-auto justify-center"}
              onClick={onPrev}
              aria-label="Предыдущий период"
              title="Предыдущий период"
            >
              ‹
            </button>
            <button
              type="button"
              className={T.btn + " w-full sm:w-auto justify-center"}
              onClick={onToday}
              aria-label="Сегодня"
              title="Перейти на сегодня"
            >
              Сегодня
            </button>
            <button
              type="button"
              className={T.btn + " w-full sm:w-auto justify-center"}
              onClick={onNext}
              aria-label="Следующий период"
              title="Следующий период"
            >
              ›
            </button>
          </div>

          <Link
            className={T.btn + " w-full sm:w-auto justify-center"}
            href={`/demo/manager/booking/new?date=${focusDate.toISOString().slice(0, 10)}`}
            prefetch={false}
            aria-label="Создать новую запись"
          >
            Создать запись
          </Link>
        </div>
      </div>
    </header>
  );
}