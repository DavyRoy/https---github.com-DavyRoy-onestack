"use client";

import Link from "next/link";
import { T } from "@/app/demo/manager/_parts/tokens";
import type { Kpi } from "@/app/demo/manager/dashboard/data/mockManagerDashboard";

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
      // на всякий случай, если код валюты не поддержан движком
      return val.toLocaleString?.("ru-RU") ?? String(val);
    }
  }
  return String(val ?? "—");
}

/** Мини-спарклайн, устойчив к 0/1 точке и одинаковым значениям */
function Sparkline({ points }: { points: number[] }) {
  const w = 80;
  const h = 28;

  if (!points || points.length === 0) {
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-20 h-7 opacity-60" aria-hidden>
        <line x1="1" y1={h / 2} x2={w - 1} y2={h / 2} stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  if (points.length === 1) {
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-20 h-7 opacity-80" aria-hidden>
        <circle cx={w - 2} cy={h / 2} r="1.6" fill="currentColor" />
      </svg>
    );
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const rng = Math.max(1e-9, max - min); // избегаем деления на 0

  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * (w - 2) + 1;
      const y = h - 2 - ((v - min) / rng) * (h - 4);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-20 h-7" aria-hidden>
      <path d={path} fill="none" stroke="currentColor" className="opacity-80" strokeWidth="1.5" />
    </svg>
  );
}

export default function KpiCards({ items }: { items: Kpi[] }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((k) => {
        // позволяем источнику данных задать валюту (например, "RUB"), иначе auto
        // если валюты нет, но в title есть “Выручка”, форматируем как RUB — совместимость с текущим мок-датасетом
        // @ts-expect-error — допускаем опциональное поле currency в моках
        const currency: string | undefined = k.currency || (k.title?.toLowerCase().includes("выручк") ? "RUB" : undefined);

        return (
          <Link
            key={k.title}
            href={k.href}
            className={
              T.card +
              " group hover:bg-white/[0.07] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            }
            aria-label={`${k.title}: сегодня ${formatValue(k.valueToday, currency)}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs text-white/70">{k.title}</div>
                <div className="mt-1 text-xl font-semibold tabular-nums">
                  {formatValue(k.valueToday, currency)}
                </div>
                <div className={T.dim + " mt-0.5 text-xs"}>
                  за сегодня • за 7д:&nbsp;
                  <span className="tabular-nums">{formatValue(k.value7d, currency)}</span>
                </div>
              </div>

              <div className="text-white/80 shrink-0">
                <Sparkline points={k.spark || []} />
              </div>
            </div>
          </Link>
        );
      })}
    </section>
  );
}