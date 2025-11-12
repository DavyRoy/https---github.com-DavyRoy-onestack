"use client";

export default function PriceBadge({ value }: { value: number }) {
  if (typeof value !== "number" || isNaN(value)) return null;
  const formatted = value.toLocaleString("ru-RU");

  return (
    <span
      className="inline-flex items-center rounded-lg border border-white/15 bg-white/10 px-2 py-0.5 text-xs tabular-nums text-white/80"
      title={`Стоимость: ${formatted} ₽`}
    >
      {formatted} ₽
    </span>
  );
}