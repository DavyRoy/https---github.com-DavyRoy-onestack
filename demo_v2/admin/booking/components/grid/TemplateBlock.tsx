"use client";

import * as React from "react";

/**
 * Отображает слот расписания (например, рабочее время мастера, доступный номер и т.п.)
 *
 * @param col      Индекс дня (0..columns-1)
 * @param top      Позиция по вертикали (px)
 * @param height   Высота блока (px)
 * @param label    Текст внутри блока
 * @param onClick  Клик по блоку (опционально)
 * @param columns  Количество колонок в сетке (по умолчанию 8)
 * @param className Доп. классы для тонкой настройки стилей
 */
export default function TemplateBlock({
  col,
  top,
  height,
  label,
  onClick,
  columns = 8,
  className = "",
}: {
  col: number;
  top: number;
  height: number;
  label: string;
  onClick?: () => void;
  columns?: number;
  className?: string;
}) {
  // Валидация входных значений
  const safeCols = Number.isFinite(columns) && columns > 0 ? Math.floor(columns) : 8;
  const idx = Number.isFinite(col) ? Math.max(0, Math.min(Math.floor(col), safeCols - 1)) : 0;
  const y = Number.isFinite(top) ? top : 0;
  const h = Math.max(1, Number.isFinite(height) ? Math.floor(height) : 0); // не даём высоте уйти в 0/отрицательное

  const base =
    "absolute text-[10px] leading-none text-left font-medium rounded-lg border px-1.5 py-[2px] " +
    "bg-emerald-500/20 border-emerald-400/40 text-emerald-50 " +
    "hover:bg-emerald-500/30 hover:border-emerald-400/60 hover:text-white " +
    "transition-all duration-150 ease-out shadow-[0_1px_4px_rgba(0,255,170,0.15)] " +
    "backdrop-blur-[1px] cursor-pointer truncate focus:outline-none focus:ring-1 focus:ring-emerald-400/50";

  const style: React.CSSProperties = {
    transform: `translate(calc((100% / ${safeCols}) * ${idx}), ${y}px)`,
    width: `calc(100% / ${safeCols} - 2px)`,
    height: h,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={`Слот: ${label}`}
      className={`${base} ${className}`}
      style={style}
    >
      <div className="truncate">{label}</div>
    </button>
  );
}