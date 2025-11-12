"use client";

import Link from "next/link";

export default function CalendarExport({ icsHref, googleHref, appleHref }: { icsHref: string; googleHref: string; appleHref: string }) {
  return (
    <section className="space-y-3 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-[hsl(var(--fg))]">Добавить в календарь</h3>
      <div className="flex flex-wrap gap-2 text-sm text-[hsl(var(--muted))]">
        <Link
          href={icsHref}
          className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))] transition hover:bg-[hsl(var(--panel))]/80"
        >
          Скачать .ics
        </Link>
        <Link
          href={googleHref}
          className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))] transition hover:bg-[hsl(var(--panel))]/80"
        >
          Google Calendar
        </Link>
        <Link
          href={appleHref}
          className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))] transition hover:bg-[hsl(var(--panel))]/80"
        >
          Apple Calendar
        </Link>
      </div>
    </section>
  );
}
