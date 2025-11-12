"use client";

export default function OrderAmount({
  value,
  currency = "₽",
  muted = false,
}: {
  value: number;
  currency?: string;
  muted?: boolean;
}) {
  const formatted = value.toLocaleString("ru-RU");

  return (
    <span
      className={[
        "tabular-nums",
        muted ? "text-white/70" : "text-white",
        "font-medium",
      ].join(" ")}
      title={`${formatted} ${currency}`}
    >
      {formatted} {currency}
    </span>
  );
}