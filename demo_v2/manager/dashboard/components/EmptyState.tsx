"use client";

import { T } from "@/app/demo/manager/_parts/tokens";

/**
 * Компонент для отображения пустых состояний (нет данных, ошибка фильтра и т.п.)
 */
export default function EmptyState({
  title,
  note,
}: {
  title: string;
  note?: string;
}) {
  return (
    <div
      className={
        T.card +
        " flex flex-col items-center justify-center text-center py-10 px-4"
      }
    >
      <div className="text-base font-semibold text-white/90">{title}</div>
      {note && (
        <div className={"mt-1 text-sm " + T.dim}>
          {note}
        </div>
      )}
    </div>
  );
}