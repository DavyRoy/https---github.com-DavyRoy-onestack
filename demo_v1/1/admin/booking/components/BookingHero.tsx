"use client";

import Link from "next/link";
import { CalendarDays, LayoutGrid, CalendarRange } from "lucide-react";

export default function BookingHero() {
  return (
    <header className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <CalendarDays className="h-4 w-4 opacity-70" aria-hidden="true" />
            <span>Управление расписаниями</span>
          </div>

          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
            Расписания, ресурсы, шаблоны и исключения
          </h1>

          <p className="mt-1 text-sm text-white/70">
            Настраивайте доступность, правила и политики брони. Поддержка персонала, кабинетов,
            залов и параллельных слотов.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/demo/admin/booking/schedules"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <CalendarRange className="h-4 w-4" aria-hidden="true" />
            <span>К расписаниям</span>
          </Link>
          <Link
            href="/demo/admin/calendar"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white px-3 py-1.5 text-sm text-black hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-black/20"
          >
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            <span>Общий календарь</span>
          </Link>
        </div>
      </div>
    </header>
  );
}