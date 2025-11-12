// app/demo/(shared)/components/Skeletons.tsx

import React from "react";

type SkeletonsProps = {
  rows?: number;
  variant?: "card" | "bar" | "table";
  rowHeightPx?: number;
  soft?: boolean;
  rounded?: boolean;
  className?: string;
  tableCols?: { base?: number; md?: number; lg?: number };
};

type Classable = { className?: string };

/* ── Purge-safe маппинг колонок (1..6) ────────────────────────────────── */
const GRID = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
} as const;

function clampInt(n: unknown, min: number, max: number): number {
  const v = Math.floor(Number(n));
  if (!Number.isFinite(v)) return min;
  return Math.max(min, Math.min(max, v));
}

/** Косточка */
function Bone({
  className = "",
  rounded = true,
  soft = false,
  heightPx,
  widthPct,
  ariaLabel,
}: {
  className?: string;
  rounded?: boolean;
  soft?: boolean;
  heightPx?: number;
  widthPct?: number;
  ariaLabel?: string;
}) {
  const base = [
    "w-full",
    "bg-white",
    soft ? "bg-opacity-5" : "bg-opacity-10",
    "motion-safe:animate-pulse",
    rounded ? "rounded-xl" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const style: React.CSSProperties = {};
  if (heightPx) style.height = Math.max(1, Math.round(heightPx));
  if (widthPct != null) style.width = `${Math.max(1, Math.min(100, Math.round(widthPct)))}%`;

  // Если даём ariaLabel — НЕ скрываем из a11y-дерева.
  const a11yProps = ariaLabel
    ? { "aria-label": ariaLabel }
    : { "aria-hidden": true as const };

  return (
    <div
      role="presentation"
      className={`${base} ${className}`}
      style={style}
      {...a11yProps}
    />
  );
}

/** Паттерн ширин для bar */
const BAR_WIDTH_PATTERN = [100, 92, 84, 76, 68, 60, 52, 44, 36, 28];

/** Универсальная сетка */
function SkeletonsGrid({
  rows = 4,
  variant = "card",
  rowHeightPx,
  soft = false,
  rounded = true,
  className = "",
  tableCols = { base: 1, md: 2, lg: 3 },
}: SkeletonsProps) {
  const safeRows = Math.max(0, Math.floor(rows));
  const defaultHeight = Math.max(
    1,
    Math.round(rowHeightPx ?? (variant === "card" ? 48 : variant === "bar" ? 12 : 32))
  );

  const baseCols = GRID[clampInt(tableCols.base ?? 1, 1, 6) as keyof typeof GRID];
  const mdCols =
    tableCols.md != null ? `md:${GRID[clampInt(tableCols.md, 1, 6) as keyof typeof GRID]}` : "";
  const lgCols =
    tableCols.lg != null ? `lg:${GRID[clampInt(tableCols.lg, 1, 6) as keyof typeof GRID]}` : "";

  const gridCols = variant === "table" ? ["grid", baseCols, mdCols, lgCols].filter(Boolean).join(" ") : "grid";

  return (
    <div
      role="status"
      aria-busy="true"
      aria-atomic="true"
      aria-live="polite"
      className={`${gridCols} gap-2 ${className}`}
    >
      {Array.from({ length: safeRows }).map((_, i) => {
        if (variant === "bar") {
          const widthPct = BAR_WIDTH_PATTERN[i % BAR_WIDTH_PATTERN.length];
          return (
            <Bone
              key={i}
              soft={soft}
              rounded={rounded}
              heightPx={defaultHeight}
              widthPct={widthPct}
            />
          );
        }
        return <Bone key={i} soft={soft} rounded={rounded} heightPx={defaultHeight} />;
      })}
      <span className="sr-only">Загрузка…</span>
    </div>
  );
}

/* ── Специализированные скелетоны ─────────────────────────────────────── */
function KpiCards({ className = "" }: Classable) {
  return (
    <div className={`grid gap-3 md:grid-cols-4 ${className}`}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/15 bg-white/[0.05] p-3"
          role="status"
          aria-busy="true"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex h-7 w-7 rounded-lg bg-white/10" />
            <span className="h-4 w-10 rounded bg-white/10 motion-safe:animate-pulse" />
          </div>
          <div className="mt-2 h-6 w-24 rounded bg-white/10 motion-safe:animate-pulse" />
          <div className="mt-1 h-3 w-2/3 rounded bg-white/10 motion-safe:animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function CardLines({ className = "" }: Classable) {
  return (
    <div className={`rounded-2xl border border-white/15 bg-white/[0.05] p-3 ${className}`} role="status" aria-busy="true">
      <div className="flex items-center justify-between">
        <span className="h-4 w-32 rounded bg-white/10 motion-safe:animate-pulse" />
        <span className="h-4 w-28 rounded bg-white/10 motion-safe:animate-pulse" />
      </div>
      <div className="mt-2 h-[220px] w-full rounded-xl border border-white/10 bg-white/5 motion-safe:animate-pulse" />
    </div>
  );
}

function CardDonut({ className = "" }: Classable) {
  return (
    <div className={`rounded-2xl border border-white/15 bg-white/[0.05] p-3 ${className}`} role="status" aria-busy="true">
      <div className="h-5 w-28 rounded bg-white/10 motion-safe:animate-pulse" />
      <div className="mt-2 grid gap-2">
        <div className="h-24 w-24 rounded-full bg-white/10 motion-safe:animate-pulse mx-auto" />
        <SkeletonsGrid rows={3} variant="bar" />
      </div>
    </div>
  );
}

function CardHeat({ className = "" }: Classable) {
  return (
    <div className={`rounded-2xl border border-white/15 bg-white/[0.05] p-3 ${className}`} role="status" aria-busy="true">
      <div className="h-5 w-36 rounded bg-white/10 motion-safe:animate-pulse" />
      <div className="mt-2 grid gap-2 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <span className="h-4 w-24 rounded bg-white/10 motion-safe:animate-pulse" />
              <span className="h-4 w-14 rounded bg-white/10 motion-safe:animate-pulse" />
            </div>
            <div className="mt-1 h-2 w-full rounded bg-white/10 overflow-hidden">
              <div className="h-full w-1/2 rounded bg-white/20 motion-safe:animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CardBars({ className = "" }: Classable) {
  return (
    <div className={`rounded-2xl border border-white/15 bg-white/[0.05] p-3 ${className}`} role="status" aria-busy="true">
      <div className="h-5 w-40 rounded bg-white/10 motion-safe:animate-pulse" />
      <div className="mt-2 grid gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="grid gap-1">
            <div className="flex items-center justify-between">
              <span className="h-4 w-36 rounded bg-white/10 motion-safe:animate-pulse" />
              <span className="h-4 w-16 rounded bg-white/10 motion-safe:animate-pulse" />
            </div>
            <div className="h-1.5 w-full rounded bg-white/10 overflow-hidden">
              <div className="h-full w-1/2 rounded bg-white/20 motion-safe:animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CardTiles({ className = "" }: Classable) {
  return (
    <div className={`grid gap-2 ${className}`} role="status" aria-busy="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex h-6 w-6 rounded-lg bg-white/10" />
              <div className="h-4 w-24 rounded bg-white/10 motion-safe:animate-pulse" />
            </div>
            <span className="h-4 w-10 rounded bg-white/10 motion-safe:animate-pulse" />
          </div>
          <div className="mt-2 h-6 w-20 rounded bg-white/10 motion-safe:animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function CardTable({ className = "" }: Classable) {
  return (
    <div className={`rounded-2xl border border-white/15 bg-white/[0.05] p-3 ${className}`} role="status" aria-busy="true">
      <SkeletonsGrid variant="table" rows={4} rowHeightPx={40} tableCols={{ base: 1, md: 2, lg: 3 }} />
    </div>
  );
}

function CardList({ className = "" }: Classable) {
  return (
    <div className={`rounded-2xl border border-white/15 bg-white/[0.05] p-3 ${className}`} role="status" aria-busy="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="mb-2 last:mb-0 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between">
            <span className="h-5 w-20 rounded bg-white/10 motion-safe:animate-pulse" />
            <span className="h-4 w-24 rounded bg-white/10 motion-safe:animate-pulse" />
          </div>
          <div className="mt-2 h-5 w-3/4 rounded bg-white/10 motion-safe:animate-pulse" />
          <div className="mt-1 h-4 w-1/2 rounded bg-white/10 motion-safe:animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function CardActions({ className = "" }: Classable) {
  return (
    <div className={`rounded-2xl border border-white/15 bg-white/[0.05] p-3 ${className}`} role="status" aria-busy="true">
      <div className="grid gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-10 rounded-xl bg-white/10 motion-safe:animate-pulse" />
        ))}
      </div>
    </div>
  );
}

/* ── Экспорты ─────────────────────────────────────────────────────────── */
const Skeletons = {
  KpiCards,
  CardLines,
  CardDonut,
  CardHeat,
  CardBars,
  CardTiles,
  CardTable,
  CardList,
  CardActions,
};

export {
  SkeletonsGrid as Grid, // универсальная сетка (опционально)
  KpiCards,
  CardLines,
  CardDonut,
  CardHeat,
  CardBars,
  CardTiles,
  CardTable,
  CardList,
  CardActions,
};

export default Skeletons;