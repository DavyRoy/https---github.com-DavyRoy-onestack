"use client";

import * as React from "react";

/**
 * Отображает слот расписания (например, рабочее время мастера, доступный номер и т.п.)
 * col — индекс дня (0..6)
 * top — позиция по вертикали (px)
 * height — высота блока (px)
 * label — текст для отображения
 */
export default function TemplateBlock({
  col,
  top,
  height,
  label,
  onClick,
}: {
  col: number;
  top: number;
  height: number;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`
        absolute text-[10px] leading-none text-left font-medium
        rounded-lg border px-1.5 py-[2px]
        bg-emerald-500/20 border-emerald-400/40 text-emerald-50
        hover:bg-emerald-500/30 hover:border-emerald-400/60 hover:text-white
        transition-all duration-150 ease-out
        shadow-[0_1px_4px_rgba(0,255,170,0.15)]
        backdrop-blur-[1px]
        cursor-pointer truncate
        focus:outline-none focus:ring-1 focus:ring-emerald-400/50
      `}
      style={{
        transform: `translate(calc((100% / 8) * ${col}), ${top}px)`,
        width: `calc(100% / 8 - 2px)`,
        height,
      }}
    >
      <div className="truncate">{label}</div>
    </button>
  );
}