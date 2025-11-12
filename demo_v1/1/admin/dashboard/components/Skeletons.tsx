// app/demo/(shared)/components/Skeletons.tsx
"use client";

import React from "react";

type SkeletonsProps = {
  /** Сколько элементов показать */
  rows?: number;
  /** card | bar | table */
  variant?: "card" | "bar" | "table";
  /**
   * Явная высота строки (px). Используем inline-style,
   * чтобы не споткнуться о Tailwind purge/JIT при динамических классах.
   */
  rowHeightPx?: number;
  /** Мягкая пульсация */
  soft?: boolean;
  /** Скругление углов */
  rounded?: boolean;
  /** Дополнительные классы обёртки */
  className?: string;
  /** Колонки для table-вида (sm/md/lg брейки учитываются автоматически) */
  tableCols?: { base?: number; md?: number; lg?: number };
};

/** Внутренняя «косточка» */
function Bone({
  className = "",
  rounded = true,
  soft = false,
  heightPx,
  ariaLabel,
}: {
  className?: string;
  rounded?: boolean;
  soft?: boolean;
  heightPx?: number;
  ariaLabel?: string;
}) {
  const base =
    `w-full animate-pulse bg-white/${soft ? "5" : "10"}` +
    (rounded ? " rounded-xl" : "");
  return (
    <div
      className={`${base} ${className}`}
      style={heightPx ? { height: heightPx } : undefined}
      aria-hidden
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
    />
  );
}

export default function Skeletons({
  rows = 4,
  variant = "card",
  rowHeightPx,
  soft = false,
  rounded = true,
  className = "",
  tableCols = { base: 1, md: 2, lg: 3 },
}: SkeletonsProps) {
  // дефолтная высота, если не задана явно
  const defaultHeight =
    rowHeightPx ??
    (variant === "card" ? 48 : variant === "bar" ? 12 : 32);

  const gridCols =
    variant === "table"
      ? [
          `grid-cols-${Math.max(1, tableCols.base ?? 1)}`,
          tableCols.md ? `md:grid-cols-${Math.max(1, tableCols.md)}` : "",
          tableCols.lg ? `lg:grid-cols-${Math.max(1, tableCols.lg)}` : "",
        ]
          .filter(Boolean)
          .join(" ")
      : "";

  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={`grid gap-2 ${gridCols} ${className}`}
    >
      {Array.from({ length: Math.max(0, rows) }).map((_, i) => (
        <Bone
          key={i}
          soft={soft}
          rounded={rounded}
          heightPx={defaultHeight}
        />
      ))}

      {/* скрытая подпись для screen reader */}
      <span className="sr-only">Загрузка…</span>
    </div>
  );
}