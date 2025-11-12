"use client";

import * as React from "react";

/**
 * Красный блок на сетке расписания, обозначающий исключение (ремонт, праздник и т.д.)
 * @param col — колонка 0..6 (день недели)
 * @param label — короткий текст ("ремонт", "выходной")
 * @param onClick — обработчик клика (опционально)
 */
export default function ExceptionBlock({
  col,
  label,
  onClick,
}: {
  col: number;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`
        absolute text-[10px] leading-none font-medium
        rounded-lg border
        bg-red-500/20 border-red-400/40 text-red-100/90
        px-1 py-[2px] overflow-hidden truncate
        hover:bg-red-500/30 hover:border-red-400/60 hover:text-white
        transition-colors duration-150
        focus:outline-none focus:ring-1 focus:ring-red-400/50
        shadow-[0_0_4px_rgba(255,0,0,0.2)]
      `}
      style={{
        transform: `translate(calc((100% / 8) * ${col}), 2px)`,
        width: `calc(100% / 8 - 2px)`,
        height: 20,
      }}
    >
      {label}
    </button>
  );
}