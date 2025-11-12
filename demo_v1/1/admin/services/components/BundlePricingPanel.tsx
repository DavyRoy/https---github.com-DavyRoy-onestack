"use client";

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

type Bundle = typeof ADMIN_BUNDLES[number];

export default function BundlePricingPanel({ initial }: { initial?: Bundle }) {
  // исходные значения
  const [price, setPrice] = useState<number>(Number(initial?.price ?? 0));
  const [period, setPeriod] = useState<number>(Number(initial?.periodDays ?? 30));

  // тип нужен только для подсказок — менять его здесь не будем (редактируется в BundleForm)
  const isSubscription = initial?.type === "subscription";

  // нормализация и ошибки
  const normalizedPrice = Number.isFinite(price) ? Math.max(0, price) : 0;
  const normalizedPeriod = Number.isFinite(period) ? Math.max(0, Math.trunc(period)) : 0;

  const errors = useMemo(() => {
    const xs: string[] = [];
    if (normalizedPrice <= 0) xs.push("Укажите цену больше 0.");
    if (isSubscription && normalizedPeriod <= 0) xs.push("Для абонемента срок должен быть больше 0 дней.");
    return xs;
  }, [normalizedPrice, normalizedPeriod, isSubscription]);

  const perDay = useMemo(() => {
    if (!isSubscription || normalizedPeriod <= 0) return null;
    return normalizedPrice / normalizedPeriod;
  }, [normalizedPrice, normalizedPeriod, isSubscription]);

  // хендлеры
  const inc = (delta: number) => setPrice((p) => Math.max(0, (Number(p) || 0) + delta));
  const incDays = (delta: number) => setPeriod((d) => Math.max(0, Math.trunc((Number(d) || 0) + delta)));

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
          {isSubscription ? "Абонемент" : "Пакет"} • поля можно менять свободно
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {/* Цена */}
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Цена (₽)</span>
          <div className="flex items-stretch gap-2">
            <div className="inline-flex items-center rounded-xl border border-white/15 bg-white/10 overflow-hidden">
              <button
                type="button"
                className="grid h-10 w-10 place-items-center hover:bg-white/10"
                onClick={() => inc(-100)}
                title="-100 ₽"
                aria-label="Уменьшить на 100"
              >
                −100
              </button>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                value={Number.isFinite(price) ? String(price) : ""}
                onChange={(e) => setPrice(Number(e.target.value.replace(/[^\d]/g, "")) || 0)}
                onBlur={() => setPrice(normalizedPrice)}
                className="w-32 bg-transparent px-3 py-2 text-sm outline-none text-right tabular-nums"
                aria-invalid={normalizedPrice <= 0}
                aria-label="Цена, в рублях"
              />
              <button
                type="button"
                className="grid h-10 w-10 place-items-center hover:bg-white/10"
                onClick={() => inc(+100)}
                title="+100 ₽"
                aria-label="Увеличить на 100"
              >
                +100
              </button>
            </div>
            <div className="hidden sm:flex items-center rounded-xl border border-white/15 bg-white/10 px-3 text-sm tabular-nums">
              {fmtPrice(normalizedPrice)}
            </div>
          </div>
          <div className="text-[11px] text-white/60">
            Итоговая стоимость пакета/абонемента. Можно вводить без пробелов.
          </div>
        </label>

        {/* Срок (для абонемента актуален, для пакета — опционально) */}
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Срок (дней)</span>
          <div className="inline-flex items-center rounded-xl border border-white/15 bg-white/10 overflow-hidden w-max">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center hover:bg-white/10"
              onClick={() => incDays(-1)}
              title="-1 день"
              aria-label="Уменьшить на 1 день"
            >
              −
            </button>
            <input
              type="number"
              min={0}
              step={1}
              value={Number.isFinite(period) ? String(period) : ""}
              onChange={(e) => setPeriod(Math.max(0, Number(e.target.value) || 0))}
              onBlur={() => setPeriod(normalizedPeriod)}
              className="w-24 bg-transparent px-3 py-2 text-sm outline-none text-center tabular-nums"
              aria-label="Срок действия в днях"
            />
            <button
              type="button"
              className="grid h-10 w-10 place-items-center hover:bg-white/10"
              onClick={() => incDays(+1)}
              title="+1 день"
              aria-label="Увеличить на 1 день"
            >
              +
            </button>
          </div>
          <div className="text-[11px] text-white/60">
            {isSubscription
              ? "Обязательный параметр для абонементов."
              : "Для пакетов можно оставить 0 (без срока)."}
          </div>
        </label>

        {/* Резюме / подсказки */}
        <div className="grid gap-1">
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
                      Ориентировочно:{" "}
                      <span className="tabular-nums">{fmtPrice(perDay)}</span> в день
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
        <ul className="mt-3 list-disc space-y-1 rounded-xl border border-rose-400/20 bg-rose-400/5 p-3 text-xs text-rose-300 pl-5">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </section>
  );
}