"use client";

export default function AvailabilityLegend() {
  return (
    <div
      className="flex flex-wrap items-center gap-3 text-xs text-white/80"
      role="list"
      aria-label="Легенда доступности"
    >
      <LegendItem color="bg-emerald-400/80" label="Доступно" />
      <LegendItem color="bg-red-400/80" label="Занято" />
      <LegendItem color="bg-yellow-300/80" label="Перерыв" />
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1" role="listitem">
      <LegendDot color={color} />
      <span>{label}</span>
    </span>
  );
}

function LegendDot({ color }: { color: string }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${color}`}
      aria-hidden="true"
    />
  );
}