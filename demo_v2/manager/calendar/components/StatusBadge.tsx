"use client";
import { Status } from "./types";

export default function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    new: "Новый",
    pending: "Ожидает",
    confirmed: "Подтв.",
    completed: "Состоялся",
    cancelled: "Отменён",
    noshow: "Не явился",
    rescheduled: "Перенесён",
  };

  const tone: Record<Status, string> = {
    new: "bg-blue-500/25 text-blue-100 border-blue-400/40",
    pending: "bg-yellow-500/25 text-yellow-100 border-yellow-400/40",
    confirmed: "bg-emerald-500/25 text-emerald-100 border-emerald-400/40",
    completed: "bg-emerald-500/25 text-emerald-100 border-emerald-400/40",
    cancelled: "bg-red-500/25 text-red-100 border-red-400/40",
    noshow: "bg-orange-500/25 text-orange-100 border-orange-400/40",
    rescheduled: "bg-purple-500/25 text-purple-100 border-purple-400/40",
  };

  const label = map[status];

  return (
    <span
      className={[
        "inline-flex items-center justify-center whitespace-nowrap rounded-full border",
        "px-2.5 py-0.5 text-[11px] sm:text-xs font-medium",
        tone[status],
      ].join(" ")}
      aria-label={`Статус: ${label}`}
      title={`Статус: ${label}`}
    >
      {label}
    </span>
  );
}