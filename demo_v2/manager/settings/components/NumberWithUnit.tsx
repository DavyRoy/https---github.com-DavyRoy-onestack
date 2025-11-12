"use client";

export default function NumberWithUnit({
  value,
  unit = "мин",
  min = 0,
  max = 999,
  onChange,
}: {
  value: number;
  unit?: string;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
      />
      <span className="text-sm opacity-70">{unit}</span>
    </div>
  );
}