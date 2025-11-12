"use client";

import Link from "next/link";
import * as React from "react";

/**
 * Отображает "бэйдж" брони на сетке расписания.
 *
 * @param col — индекс колонки (0–6 для дней недели)
 * @param label — короткий текст (например: "Иван К. • 14:00–15:00")
 * @param href — ссылка на карточку брони
 * @param columns — общее число колонок в сетке (по умолчанию 8)
 * @param className — дополнительные классы
 */
export default function ReservationBadge({
  col,
  label,
  href,
  columns = 8,
  className = "",
}: {
  col: number;
  label: string;
  href: string;
  columns?: number;
  className?: string;
}) {
  // защита от некорректных значений
  const safeCols = Number.isFinite(columns) && columns > 0 ? Math.floor(columns) : 8;
  const idx = Number.isFinite(col) ? Math.max(0, Math.min(Math.floor(col), safeCols - 1)) : 0;

  const base =
    "absolute flex items-center justify-center text-[10px] font-medium leading-none rounded-lg border " +
    "px-1.5 py-[3px] bg-emerald-500/20 border-emerald-400/40 text-emerald-100/90 " +
    "hover:bg-emerald-500/30 hover:border-emerald-400/60 hover:text-white " +
    "transition-all duration-150 ease-out truncate " +
    "shadow-[0_0_4px_rgba(0,255,150,0.15)] backdrop-blur-[2px] " +
    "focus:outline-none focus:ring-1 focus:ring-emerald-400/50";

  const style: React.CSSProperties = {
    transform: `translate(calc((100% / ${safeCols}) * ${idx}), -20px)`,
    minWidth: `calc(100% / ${safeCols} - 4px)`,
    maxWidth: `calc(100% / ${safeCols} - 4px)`,
  };

  const ariaLabel = `Бронь: ${label}`;

  return (
    <Link
      href={href}
      title={label}
      aria-label={ariaLabel}
      className={`${base} ${className}`}
      style={style}
      draggable={false}
    >
      {label}
    </Link>
  );
}