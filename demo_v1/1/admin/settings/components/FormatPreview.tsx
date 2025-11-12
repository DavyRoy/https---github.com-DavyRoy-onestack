"use client";

import React from "react";

type Value = {
  locale: "ru-RU" | "ko-KR" | "en-US" | string;
  time24: boolean;
  date: string; // шаблон для пользователя (отображаем как подсказку)
};

export default function FormatPreview({
  value,
  onChange,
}: {
  value: Value;
  onChange: (v: Value) => void;
}) {
  const v: Value = value ?? { locale: "ru-RU", time24: true, date: "dd.MM.yyyy" };

  // Число — стабильно для SSR/CSR
  const numberExample = React.useMemo(() => {
    try {
      return new Intl.NumberFormat(v.locale).format(1234567.89);
    } catch {
      return new Intl.NumberFormat("ru-RU").format(1234567.89);
    }
  }, [v.locale]);

  // Дата/время — стабильно для SSR/CSR за счёт UTC и явных опций
  const dateExample = React.useMemo(() => {
    // 6 октября 2025 14:30 UTC (Date.UTC: месяц 0-11, поэтому 9 = октябрь)
    const dt = new Date(Date.UTC(2025, 9, 6, 14, 30));
    const hour12 = !v.time24;

    try {
      return new Intl.DateTimeFormat(v.locale, {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12,
      }).format(dt);
    } catch {
      return new Intl.DateTimeFormat("ru-RU", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12,
      }).format(dt);
    }
  }, [v.locale, v.time24]);

  const set = (patch: Partial<Value>) => onChange({ ...v, ...patch });

  return (
    <div className="grid gap-4 w-full max-w-full min-w-0">
      <div className="text-lg font-medium">Форматы</div>

      {/* Поля управления */}
      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1 text-sm min-w-0">
          <span className="text-white/80">Локаль UI</span>
          <select
            value={v.locale}
            onChange={(e) => set({ locale: e.target.value })}
            className="rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20 w-full"
          >
            <option value="ru-RU">ru-RU</option>
            <option value="ko-KR">ko-KR</option>
            <option value="en-US">en-US</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm min-w-0">
          <span className="text-white/80">Формат даты (подсказка)</span>
          <input
            value={v.date}
            onChange={(e) => set({ date: e.target.value })}
            className="rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20 w-full"
            placeholder="dd.MM.yyyy"
          />
          <span className="text-xs text-white/50">
            Отображение примера ниже строится через&nbsp;Intl; шаблон служит подсказкой.
          </span>
        </label>

        <label className="inline-flex items-center gap-2 text-sm mt-1 md:mt-6">
          <input
            type="checkbox"
            checked={!!v.time24}
            onChange={(e) => set({ time24: e.target.checked })}
            className="accent-white"
          />
          24-часовой формат
        </label>
      </div>

      {/* Превью */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="text-sm text-white/70 mb-2">Превью</div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="text-xs text-white/60 mb-1">Число</div>
            <div className="font-medium tabular-nums">{numberExample}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="text-xs text-white/60 mb-1">Дата и время (UTC)</div>
            <div className="font-medium tabular-nums">{dateExample}</div>
          </div>
        </div>
      </div>
    </div>
  );
}