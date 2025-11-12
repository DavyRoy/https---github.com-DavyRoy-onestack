// app/demo/admin/services/components/BundlePricingPanel.tsx
"use client";

import type * as React from "react";
import { useMemo, useState } from "react";
import { ADMIN_BUNDLES } from "@/app/demo/(shared)/data/services";

/** ₽ формат */
function fmtPrice(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(v);
}

type Bundle = (typeof ADMIN_BUNDLES)[number];

// безопасное преобразование строки в целое число (>=0)
const toNonNegativeInt = (s: string) => {
  const n = Number(String(s).replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : 0;
};

export default function BundlePricingPanel({ initial }: { initial?: Bundle }) {
  // исходные значения
  const [price, setPrice] = useState<number>(Number(initial?.price ?? 0));
  const [period, setPeriod] = useState<number>(Number(initial?.periodDays ?? 30));

  // тип нужен только для подсказок — редактируется в BundleForm
  const isSubscription = initial?.type === "subscription";

  // нормализация
  const normalizedPrice = Number.isFinite(price) ? Math.max(0, Math.trunc(price)) : 0;
  const normalizedPeriod = Number.isFinite(period) ? Math.max(0, Math.trunc(period)) : 0;

  const errors = useMemo(() => {
    const xs: string[] = [];
    if (normalizedPrice <= 0) xs.push("Укажите цену больше 0.");
    if (isSubscription && normalizedPeriod <= 0)
      xs.push("Для абонемента срок должен быть больше 0 дней.");
    return xs;
  }, [normalizedPrice, normalizedPeriod, isSubscription]);

  const perDay = useMemo(() => {
    if (!isSubscription || normalizedPeriod <= 0) return null;
    return normalizedPrice / normalizedPeriod;
  }, [normalizedPrice, normalizedPeriod, isSubscription]);

  // запрет «крутить» number колесом (частый UX-баг)
  const preventWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).blur();
  };

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 backdrop-blur-sm"
      aria-labelledby="bundle-pricing-title"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 id="bundle-pricing-title" className="text-sm font-medium">
          Цена и срок
        </h2>
        <div className="text-xs text-white/60">
          {isSubscription ? "Абонемент" : "Пакет"} • значения можно редактировать
        </div>
      </div>

      {/* Адаптивная сетка: мобилка — 1 колонка, md — 2, xl — 3 */}
      <div className="mt-3 grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {/* Цена */}
        <label className="grid gap-1 min-w-0">
          <span className="text-xs opacity-70">Цена (₽)</span>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            value={Number.isFinite(price) ? String(price) : ""}
            onChange={(e) => setPrice(toNonNegativeInt(e.target.value))}
            onBlur={() => setPrice(normalizedPrice)}
            onWheel={preventWheel}
            className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-right text-sm outline-none tabular-nums"
            aria-invalid={normalizedPrice <= 0}
            aria-label="Цена, в рублях"
            placeholder="0"
          />
          <div className="text-[11px] text-white/60">
            Форматированная цена:{" "}
            <span className="tabular-nums text-white/80">{fmtPrice(normalizedPrice)}</span>
          </div>
        </label>

        {/* Срок — компактный, но без переполнения */}
        <label className="grid gap-1 min-w-0">
          <span className="text-xs opacity-70">Срок (дней)</span>
          <input
            type="number"
            min={0}
            step={1}
            value={Number.isFinite(period) ? String(period) : ""}
            onChange={(e) => setPeriod(toNonNegativeInt(e.target.value))}
            onBlur={() => setPeriod(normalizedPeriod)}
            onWheel={preventWheel}
            className="w-24 max-w-full rounded-xl border border-white/15 bg-white/10 px-2 py-2 text-center text-sm outline-none tabular-nums"
            aria-label="Срок действия в днях"
            placeholder="0"
          />
          <div className="text-[11px] text-white/60">
            {isSubscription
              ? "Обязательный параметр для абонементов."
              : "Для пакетов можно оставить 0 (без срока)."}
          </div>
        </label>

        {/* Резюме */}
        <div className="grid gap-1 min-w-0">
          <span className="text-xs opacity-70">Резюме</span>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
            <div>
              Цена: <span className="font-medium tabular-nums">{fmtPrice(normalizedPrice)}</span>
            </div>
            {isSubscription ? (
              <>
                <div className="mt-1">
                  Срок:{" "}
                  <span className="tabular-nums">
                    {normalizedPeriod > 0 ? `${normalizedPeriod} дн.` : "—"}
                  </span>
                </div>
                <div className="mt-1 text-white/70">
                  {perDay !== null ? (
                    <>
                      Ориентировочно: <span className="tabular-nums">{fmtPrice(perDay)}</span> в день
                    </>
                  ) : (
                    "Укажите срок, чтобы увидеть цену за день."
                  )}
                </div>
              </>
            ) : (
              <div className="mt-1 text-white/70">Срок необязателен для пакета.</div>
            )}
          </div>
        </div>
      </div>

      {/* Ошибки */}
      {errors.length > 0 && (
        <ul
          className="mt-3 list-disc space-y-1 rounded-xl border border-rose-400/20 bg-rose-400/5 p-3 text-xs text-rose-300 pl-5"
          aria-live="assertive"
        >
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </section>
  );
}