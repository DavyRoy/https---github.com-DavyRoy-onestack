"use client";

const btn =
  "rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 data-[active=true]:bg-white data-[active=true]:text-black transition-colors";

const PRESETS: { key: PeriodKey; label: string }[] = [
  { key: "today", label: "Сегодня" },
  { key: "7d", label: "7д" },
  { key: "30d", label: "30д" },
  { key: "quarter", label: "Квартал" },
  { key: "year", label: "Год" },
];

type PeriodKey = "today" | "7d" | "30d" | "quarter" | "year";

export default function PeriodPicker({
  value,
  onChange,
}: {
  value: PeriodKey;
  onChange: (v: PeriodKey) => void;
}) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Выбор периода отчёта"
    >
      {PRESETS.map((p) => (
        <button
          key={p.key}
          type="button"
          className={btn}
          data-active={value === p.key}
          aria-pressed={value === p.key}
          onClick={() => onChange(p.key)}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}