"use client";

import Link from "next/link";
import { T } from "@/app/demo/manager/_parts/tokens";
import type { BookingDay } from "@/app/demo/manager/dashboard/data/mockManagerDashboard";

export default function BookingCalendarMini({ week }: { week: BookingDay[] }) {
  return (
    <section className={T.card + " grid gap-3"}>
      {/* Заголовок */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="text-base font-semibold">Ближайшая неделя</div>
        <Link
          href="/demo/manager/booking/new"
          prefetch={false}
          className={T.btn + " shrink-0"}
        >
          Создать запись
        </Link>
      </div>

      {/* Сетка календаря */}
      <div className="grid grid-cols-7 gap-2">
        {week.map((d) => {
          const date = new Date(d.date);
          const wd = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][date.getDay()];
          const percent = Math.min(100, d.count * 14);
          return (
            <Link
              key={d.date}
              href={d.href}
              prefetch={false}
              className="
                rounded-xl border border-white/15 bg-white/[0.06] p-2 grid gap-1
                hover:bg-white/[0.1] transition
              "
            >
              <div className="text-[11px] text-white/70">{wd}</div>
              <div className="text-sm font-medium tabular-nums">
                {String(date.getDate()).padStart(2, "0")}
              </div>

              {/* Полоса занятости */}
              <div className="mt-1 h-1.5 w-full rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-500 ease-out"
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Счётчики */}
              <div className="text-[11px] text-white/80">
                {d.count} запис.
              </div>
              {d.pending > 0 && (
                <div className="text-[10px] text-amber-300">
                  ожид.: {d.pending}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}