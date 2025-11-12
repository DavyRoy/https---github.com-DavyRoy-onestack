"use client";

import React from "react";

type Value = {
  locale: "ru-RU" | "ko-KR" | "en-US" | string;
  time24: boolean;
  date: string; // шаблон-подсказка
};

export default function FormatPreview({
  value,
  onChange,
  localesOptions = ["ru-RU", "ko-KR", "en-US"],
}: {
  value: Value;
  onChange: (v: Value) => void;
  localesOptions?: string[];
}) {
  const v: Value = value ?? { locale: "ru-RU", time24: true, date: "dd.MM.yyyy" };
  const uid = React.useId();

  const set = (patch: Partial<Value>) => onChange({ ...v, ...patch });

  // helpers
  const tryNumber = (loc: string) => {
    try {
      return new Intl.NumberFormat(loc).format(1234567.89);
    } catch {
      return null;
    }
  };

  const tryCurrency = (loc: string) => {
    try {
      return new Intl.NumberFormat(loc, {
        style: "currency",
        currency: loc === "ko-KR" ? "KRW" : loc === "en-US" ? "USD" : "RUB",
        currencyDisplay: "symbol",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(1234567);
    } catch {
      // фолбэк к ru-RU
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        currencyDisplay: "symbol",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(1234567);
    }
  };

  const tryDate = (loc: string, hour12: boolean) => {
    const dt = new Date(Date.UTC(2025, 9, 6, 14, 30)); // 2025-10-06 14:30 UTC
    try {
      return new Intl.DateTimeFormat(loc, {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12,
      }).format(dt);
    } catch {
      return null;
    }
  };

  // вычисления (детерминированные: фиксированная дата/суммы)
  const numberExample = React.useMemo(() => tryNumber(v.locale) ?? tryNumber("ru-RU")!, [v.locale]);
  const dateExample =
    React.useMemo(() => tryDate(v.locale, !v.time24) ?? tryDate("ru-RU", !v.time24)!, [v.locale, v.time24]);
  const currencyExample = React.useMemo(() => tryCurrency(v.locale), [v.locale]);

  const localeInvalid = tryNumber(v.locale) === null || tryDate(v.locale, !v.time24) === null;

  return (
    <div className="grid gap-4 w-full max-w-full min-w-0">
      <div className="text-lg font-medium">Форматы</div>

      {/* Управление */}
      <div className="grid gap-3 md:grid-cols-3">
        {/* Локаль */}
        <label className="grid gap-1 text-sm min-w-0" htmlFor={`${uid}-locale`}>
          <span className="text-white/80">Локаль UI</span>
          <input
            id={`${uid}-locale`}
            list={`${uid}-locales`}
            value={v.locale}
            onChange={(e) => set({ locale: e.target.value })}
            className={`rounded-lg bg-white/5 px-3 py-2 border outline-none focus:ring-2 w-full ${
              localeInvalid ? "border-amber-400/40 focus:ring-amber-400/20" : "border-white/10 focus:ring-white/20"
            }`}
            placeholder="ru-RU"
            aria-describedby={`${uid}-locale-hint`}
          />
          <datalist id={`${uid}-locales`}>
            {localesOptions.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
          <span id={`${uid}-locale-hint`} className="text-xs text-white/50">
            Можно ввести любую поддерживаемую Intl локаль (например, de-DE).
          </span>
          {localeInvalid && (
            <span className="text-[11px] text-amber-300">
              Локаль не распознана Intl — показан фолбэк формат.
            </span>
          )}
        </label>

        {/* Шаблон даты */}
        <label className="grid gap-1 text-sm min-w-0" htmlFor={`${uid}-date`}>
          <span className="text-white/80">Формат даты (подсказка)</span>
          <input
            id={`${uid}-date`}
            value={v.date}
            onChange={(e) => set({ date: e.target.value })}
            className="rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20 w-full"
            placeholder="dd.MM.yyyy"
            aria-describedby={`${uid}-date-hint`}
          />
          <span id={`${uid}-date-hint`} className="text-xs text-white/50">
            Предпросмотр ниже строится через Intl; этот шаблон — лишь подсказка пользователю.
          </span>
        </label>

        {/* 24ч */}
        <label className="inline-flex items-center gap-2 text-sm mt-1 md:mt-6">
          <input
            type="checkbox"
            checked={!!v.time24}
            onChange={(e) => set({ time24: e.target.checked })}
            className="accent-white"
            aria-label="24-часовой формат"
          />
          24-часовой формат
        </label>
      </div>

      {/* Превью */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="text-sm text-white/70 mb-2">Превью</div>
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="text-xs text-white/60 mb-1">Число</div>
            <div className="font-medium tabular-nums" aria-live="polite">
              {numberExample}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="text-xs text-white/60 mb-1">Дата и время (UTC)</div>
            <div className="font-medium tabular-nums" aria-live="polite">
              {dateExample}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="text-xs text-white/60 mb-1">Валюта</div>
            <div className="font-medium tabular-nums" aria-live="polite">
              {currencyExample}
            </div>
          </div>
        </div>

        <div className="mt-3 text-[11px] text-white/50">
          Локаль: <b className="text-white/80">{v.locale}</b> • Шаблон-подсказка:{" "}
          <code className="text-white/80">{v.date || "—"}</code> • Формат часов:{" "}
          <b className="text-white/80">{v.time24 ? "24h" : "12h"}</b>
        </div>
      </div>
    </div>
  );
}