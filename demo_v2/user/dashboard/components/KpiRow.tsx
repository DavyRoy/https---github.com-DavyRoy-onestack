// app/demo/user/dashboard/components/KpiRow.tsx
"use client";

import Link from "next/link";
import { T } from "@/app/demo/user/_parts/tokens";

export type UserKpi = {
  title: string;
  /** текущее значение (число/строка) */
  valueToday: number | string;
  /** агрегат за 7 дней / период — для подписи */
  value7d?: number | string;
  /** ссылка по клику на плитку */
  href: string;
  /** валюта (например, "RUB"), если нужно форматировать число как валюту */
  currency?: string;
  /** мини-спарклайн */
  spark?: number[];
  /** дополнительная подпись справа от заголовка (например “к оплате”, “новые”) */
  badge?: string;
};

/** Универсальный форматтер: поддерживает числа, строки и опц. валюту */
function formatValue(val: unknown, currency?: string) {
  if (typeof val === "number") {
    try {
      if (currency) {
        return new Intl.NumberFormat("ru-RU", {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }).format(val);
      }
      return new Intl.NumberFormat("ru-RU").format(val);
    } catch {
      // на случай неподдерживаемого кода валюты
      // @ts-expect-error
      return val?.toLocaleString?.("ru-RU") ?? String(val);
    }
  }
  return String(val ?? "—");
}

/** Мини-спарклайн, устойчив к 0/1 точке и одинаковым значениям */
function Sparkline({ points }: { points: number[] }) {
  const w = 86;
  const h = 28;

  if (!points || points.length === 0) {
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-[86px] opacity-60" aria-hidden>
        <line x1="1" y1={h / 2} x2={w - 1} y2={h / 2} stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  if (points.length === 1) {
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-[86px] opacity-80" aria-hidden>
        <circle cx={w - 2} cy={h / 2} r="1.6" fill="currentColor" />
      </svg>
    );
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const rng = Math.max(1e-9, max - min);

  const d = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * (w - 2) + 1;
      const y = h - 2 - ((v - min) / rng) * (h - 4);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-[86px]" aria-hidden>
      <path d={d} fill="none" stroke="currentColor" className="opacity-80" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * KpiRow — плиточная строка KPI пользователя.
 * Примеры карточек:
 *  - Бонусы: 1 250 ₽ → /demo/user/loyalty
 *  - Активные заказы: 2 → /demo/user/orders?status=active
 *  - Ближайшая запись: 2 дн. → якорь к NextBookingCard
 *  - Купоны: 1 активен → /demo/user/profile?tab=coupons
 */
export default function KpiRow({ items }: { items: UserKpi[] }) {
  return (
    <section
      className="
        grid gap-3
        [grid-template-columns:repeat(2,minmax(0,1fr))]
        sm:[grid-template-columns:repeat(3,minmax(0,1fr))]
        lg:[grid-template-columns:repeat(4,minmax(0,1fr))]
      "
    >
      {items.map((k) => {
        const currency =
          k.currency ||
          // простая эвристика: если в названии есть “бонус”, форматируем как RUB
          (k.title?.toLowerCase().includes("бонус") ? "RUB" : undefined);

        return (
          <Link
            key={k.title}
            href={k.href}
            prefetch={false}
            className={
              T.card +
              " group flex flex-col justify-between gap-2 hover:bg-white/[0.07] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            }
            aria-label={`${k.title}: ${formatValue(k.valueToday, currency)}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-xs text-white/70">{k.title}</div>
                  {k.badge && (
                    <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-white/80">
                      {k.badge}
                    </span>
                  )}
                </div>

                <div className="mt-1 text-xl font-semibold tabular-nums">
                  {formatValue(k.valueToday, currency)}
                </div>

                {k.value7d !== undefined && (
                  <div className={T.dim + " mt-0.5 text-xs"}>
                    за 7д:&nbsp;
                    <span className="tabular-nums">{formatValue(k.value7d, currency)}</span>
                  </div>
                )}
              </div>

              {k.spark && k.spark.length > 0 ? (
                <div className="shrink-0 text-white/80">
                  <Sparkline points={k.spark} />
                </div>
              ) : null}
            </div>

            {/* подчёркнутый ховер-акцент */}
            <div
              className="h-px w-full rounded bg-white/10 transition group-hover:bg-white/20"
              aria-hidden
            />
          </Link>
        );
      })}
    </section>
  );
}