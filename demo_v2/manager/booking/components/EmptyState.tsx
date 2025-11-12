// src/app/demo/manager/booking/components/EmptyState.tsx
"use client";

import Link from "next/link";

export default function EmptyState({
  title = "Записей не найдено",
  hint = "Измените фильтры или создайте новую запись.",
  ctaHref = "/demo/manager/booking/new",
  ctaLabel = "Создать запись",
}: {
  title?: string;
  hint?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <section
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-white/15 bg-white/[0.04] p-6 text-center"
    >
      <div className="text-base font-semibold">{title}</div>
      {hint && <div className="mt-1 text-sm text-white/70">{hint}</div>}
      {ctaHref && ctaLabel && (
        <Link
          href={ctaHref}
          prefetch={false}
          className="mt-3 inline-flex items-center justify-center rounded-xl bg-white px-3 py-1.5 text-sm font-medium text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 min-h-[38px]"
        >
          {ctaLabel}
        </Link>
      )}
    </section>
  );
}