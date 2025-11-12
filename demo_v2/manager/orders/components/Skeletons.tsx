"use client";

import { T } from "@/app/demo/manager/_parts/tokens";

/**
 * Скелетон панели фильтров (для загрузочного состояния)
 */
export function FiltersSkeleton() {
  return (
    <div
      className={[
        T.card,
        "grid gap-2",
        "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
      ].join(" ")}
      aria-label="Загрузка фильтров"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-9 rounded-xl bg-white/10 animate-pulse"
          aria-hidden
        />
      ))}
    </div>
  );
}

/**
 * Скелетон таблицы заказов (для первоначальной загрузки данных)
 */
export function TableSkeleton() {
  return (
    <section
      className={[T.card, "animate-pulse"].join(" ")}
      aria-label="Загрузка таблицы заказов"
    >
      {/* Заголовок */}
      <div className="h-6 w-40 sm:w-48 rounded bg-white/10" aria-hidden />

      {/* Строки таблицы */}
      <div className="mt-4 grid gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-12 sm:h-14 rounded-xl bg-white/10"
            aria-hidden
          />
        ))}
      </div>
    </section>
  );
}