"use client";

/**
 * Улучшенные Skeleton-компоненты для CRM.
 * — ARIA: role="status", aria-busy, aria-live="polite"
 * — Единые размеры/отступы, реалистичные пропорции
 * — Таблица с «шапкой», карточки, канбан-колонки
 * — Поддержка prefers-reduced-motion
 * — Гибкие пропсы (rows/cols, showHeaders и т.п.)
 */

const BASE =
  "rounded-xl border border-white/10 bg-white/[0.06] motion-reduce:animate-none animate-pulse";

const LINE =
  "h-3 rounded-md bg-white/20";

/** Вспомогательная плейсхолдер-линия с кастомной шириной */
function SkeletonLine({ w = "w-3/4", h = "h-3" }: { w?: string; h?: string }) {
  return <div className={`${h} ${w} rounded-md bg-white/20`} />;
}

/** Скелетон для таблицы */
export function TableSkeleton({
  rows = 6,
  cols = 6,
  showHeader = true,
}: {
  rows?: number;
  cols?: number;
  showHeader?: boolean;
}) {
  const headerCols = Math.max(3, Math.min(cols, 10));
  const bodyRows = Math.max(1, rows);

  return (
    <div
      className="overflow-x-auto rounded-xl border border-white/10"
      role="status"
      aria-label="Загрузка таблицы"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="min-w-[720px] w-full">
        {/* Шапка */}
        {showHeader && (
          <div className="sticky top-0 z-10 flex gap-2 bg-white/[0.04] px-3 py-2 backdrop-blur">
            {Array.from({ length: headerCols }).map((_, i) => (
              <div key={i} className="flex-1">
                <div className={`${LINE} w-1/2`} />
              </div>
            ))}
          </div>
        )}

        {/* Строки */}
        <div className="grid gap-2 p-2">
          {Array.from({ length: bodyRows }).map((_, r) => (
            <div
              key={r}
              className={`${BASE} px-3 py-2`}
              aria-hidden
            >
              <div className="flex items-center gap-3">
                <SkeletonLine w="w-[28%]" />
                <SkeletonLine w="w-[22%]" />
                <SkeletonLine w="w-[16%]" />
                <SkeletonLine w="w-[14%]" />
                <SkeletonLine w="w-[10%]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Скелетон для карточек (сеток) */
export function CardsSkeleton({
  rows = 6,
  columns = { sm: 2, lg: 3 },
  aspect = "auto",
}: {
  rows?: number;
  columns?: { sm?: number; lg?: number };
  /** auto | wide | tall */
  aspect?: "auto" | "wide" | "tall";
}) {
  const asp =
    aspect === "wide" ? "h-24"
    : aspect === "tall" ? "h-40"
    : "h-28";

  return (
    <div
      className={`grid gap-3 sm:grid-cols-${columns.sm ?? 2} lg:grid-cols-${columns.lg ?? 3}`}
      role="status"
      aria-label="Загрузка карточек"
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`${BASE} p-3`}>
          <div className={`${asp} rounded-lg bg-white/10`} />
          <div className="mt-3 space-y-2">
            <SkeletonLine w="w-2/3" />
            <SkeletonLine w="w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Скелетон для канбан-доски */
export function KanbanSkeleton({
  cols = 4,
  rows = 4,
  showHeaders = true,
}: {
  cols?: number;
  rows?: number;
  showHeaders?: boolean;
}) {
  const columns = Math.max(1, cols);
  const cards = Math.max(1, rows);

  return (
    <div
      className="grid gap-3 md:grid-cols-4 overflow-x-auto"
      role="status"
      aria-label="Загрузка канбан-доски"
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: columns }).map((_, c) => (
        <div key={c} className="min-w-[260px] snap-start">
          {/* Заголовок колонки */}
          {showHeaders && (
            <div className="sticky top-0 z-10 -m-2 -mb-1 rounded-t-xl p-2 backdrop-blur bg-white/[0.03]">
              <SkeletonLine w="w-1/3" />
            </div>
          )}

          {/* Карточки */}
          <div className="grid gap-2">
            {Array.from({ length: cards }).map((_, r) => (
              <div key={r} className={`${BASE} p-3`}>
                <SkeletonLine w="w-3/4" />
                <div className="mt-2 space-y-2">
                  <SkeletonLine w="w-1/2" />
                  <SkeletonLine w="w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Экспорт по умолчанию как объект — для удобного импорта */
export default {
  Table: TableSkeleton,
  Cards: CardsSkeleton,
  Kanban: KanbanSkeleton,
};