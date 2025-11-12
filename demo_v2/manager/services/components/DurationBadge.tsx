"use client";

export default function DurationBadge({ min }: { min: number }) {
  if (typeof min !== "number" || isNaN(min)) return null;
  const hours = Math.floor(min / 60);
  const minutes = min % 60;
  const label =
    hours > 0
      ? `${hours} ч${minutes > 0 ? ` ${minutes} мин` : ""}`
      : `${minutes} мин`;

  return (
    <span
      className="inline-flex items-center rounded-lg border border-white/15 bg-white/10 px-2 py-0.5 text-xs text-white/80"
      title={`Длительность: ${label}`}
    >
      {label}
    </span>
  );
}