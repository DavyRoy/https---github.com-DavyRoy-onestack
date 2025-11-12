"use client";

import PeriodPicker from "./PeriodPicker";
import CompareToggle from "./CompareToggle";

export default function ReportsHeader({
  title,
  subtitle,
  period,
  onPeriodChange,
  compare,
  onCompareChange,
  right,
}: {
  title: string;
  subtitle?: string;
  period: "today" | "7d" | "30d" | "quarter" | "year" | "custom";
  onPeriodChange: (p: "today" | "7d" | "30d" | "quarter" | "year" | "custom") => void;
  compare: boolean;
  onCompareChange: (v: boolean) => void;
  right?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col md:flex-row md:items-start justify-between gap-4">
      {/* Левая часть: заголовок, описание и контролы */}
      <div className="min-w-0">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-white/70">{subtitle}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <PeriodPicker value={period} onChange={onPeriodChange} />
          <CompareToggle checked={compare} onChange={onCompareChange} />
        </div>
      </div>

      {/* Правая часть (например, меню экспорта) */}
      {right && (
        <div className="shrink-0 self-start md:self-auto">{right}</div>
      )}
    </header>
  );
}