"use client";

import * as React from "react";

/**
 * Красный блок на сетке расписания, обозначающий исключение (ремонт, праздник и т.д.)
 *
 * По умолчанию сетка считается из 8 колонок: 1 — шкала времени, 7 — дни недели.
 * Блок позиционируется в пределах этих колонок.
 */
export default function ExceptionBlock({
  col,
  label,
  onClick,
  columns = 8,
  className = "",
}: {
  /** Индекс колонки (0..columns-1). Обычно 0 — колонка времени, 1..7 — дни */
  col: number;
  /** Короткий текст ("ремонт", "выходной") */
  label: string;
  /** Обработчик клика (опционально) */
  onClick?: () => void;
  /** Общее число колонок в сетке (по умолчанию 8) */
  columns?: number;
  /** Доп. классы для кастомизации */
  className?: string;
}) {
  // защита от некорректных значений
  const safeCols = Number.isFinite(columns) && columns > 0 ? Math.floor(columns) : 8;
  const idx = Number.isFinite(col) ? Math.max(0, Math.min(Math.floor(col), safeCols - 1)) : 0;

  const base =
    "absolute text-[10px] leading-none font-medium rounded-lg border px-1 py-[2px] overflow-hidden truncate " +
    "bg-red-500/20 border-red-400/40 text-red-100/90 " +
    "hover:bg-red-500/30 hover:border-red-400/60 hover:text-white " +
    "transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-red-400/50 " +
    "shadow-[0_0_4px_rgba(255,0,0,0.2)]";

  const style: React.CSSProperties = {
    transform: `translate(calc((100% / ${safeCols}) * ${idx}), 2px)`,
    width: `calc(100% / ${safeCols} - 2px)`,
    height: 20,
  };

  const ariaLabel = `Исключение: ${label}`;

  // Если onClick не передан — делаем кнопку disabled (сохраняем фокусируемость по табу при необходимости)
  const isInteractive = typeof onClick === "function";

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={ariaLabel}
      disabled={!isInteractive}
      aria-disabled={!isInteractive || undefined}
      className={`${base} ${!isInteractive ? "cursor-default opacity-90" : ""} ${className}`}
      style={style}
    >
      {label}
    </button>
  );
}