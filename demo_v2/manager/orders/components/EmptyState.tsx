"use client";

import Link from "next/link";
import { T } from "@/app/demo/manager/_parts/tokens";

export default function EmptyState({
  title = "Заказы не найдены",
  hint = "Измените фильтры или создайте новый заказ.",
  ctaPrimary = { href: "/demo/manager/orders/new", label: "Создать заказ" },
  ctaSecondary,
}: {
  title?: string;
  hint?: string;
  ctaPrimary?: { href: string; label: string };
  ctaSecondary?: { href: string; label: string };
}) {
  return (
    <section
      className={
        T.card +
        " text-center flex flex-col items-center justify-center py-10 px-6"
      }
      aria-labelledby="empty-orders-title"
    >
      <h2
        id="empty-orders-title"
        className="text-base font-semibold text-white/90"
      >
        {title}
      </h2>
      {hint && <p className="mt-1 text-sm text-white/70 max-w-sm">{hint}</p>}

      <div className="mt-4 flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-center">
        {ctaPrimary && (
          <Link
            href={ctaPrimary.href}
            prefetch={false}
            className="btn btn-primary flex-1 sm:flex-none"
          >
            {ctaPrimary.label}
          </Link>
        )}
        {ctaSecondary && (
          <Link
            href={ctaSecondary.href}
            prefetch={false}
            className="btn flex-1 sm:flex-none"
          >
            {ctaSecondary.label}
          </Link>
        )}
      </div>
    </section>
  );
}