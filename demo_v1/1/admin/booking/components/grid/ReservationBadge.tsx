"use client";

import Link from "next/link";

/**
 * Отображает "бэйдж" брони на сетке расписания.
 * col — индекс колонки (0–6 для дней недели)
 * label — короткий текст (например: "Иван К. • 14:00–15:00")
 * href — ссылка на карточку брони
 */
export default function ReservationBadge({
  col,
  label,
  href,
}: {
  col: number;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      title={label}
      className={`
        absolute flex items-center justify-center
        text-[10px] font-medium leading-none
        rounded-lg border px-1.5 py-[3px]
        bg-emerald-500/20 border-emerald-400/40 text-emerald-100/90
        hover:bg-emerald-500/30 hover:border-emerald-400/60 hover:text-white
        transition-all duration-150 ease-out
        shadow-[0_0_4px_rgba(0,255,150,0.15)]
        backdrop-blur-[2px]
        truncate
        focus:outline-none focus:ring-1 focus:ring-emerald-400/50
      `}
      style={{
        transform: `translate(calc((100% / 8) * ${col}), -20px)`,
        minWidth: "calc(100% / 8 - 4px)",
        maxWidth: "calc(100% / 8 - 4px)",
      }}
    >
      {label}
    </Link>
  );
}