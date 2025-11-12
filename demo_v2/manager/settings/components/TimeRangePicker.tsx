"use client";

export default function TimeRangePicker({
  from,
  to,
  onChange,
}: {
  from: string;
  to: string;
  onChange: (v: { from: string; to: string }) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="time"
        value={from}
        onChange={(e) => onChange({ from: e.target.value, to })}
        className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
      />
      <span className="opacity-70">—</span>
      <input
        type="time"
        value={to}
        onChange={(e) => onChange({ from, to: e.target.value })}
        className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
      />
    </div>
  );
}