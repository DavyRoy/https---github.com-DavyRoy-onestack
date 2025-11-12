// app/demo/admin/payments/components/KpiRow.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Activity, RefreshCw, Zap } from "lucide-react";

type Props = {
  revenue: number;
  successRate: number;   // 0..100
  successCount: number;
  failRate: number;      // 0..100
  refundsCount: number;
  refundsAmount: number;
  latencyP95: number;    // ms
  currency?: "RUB" | "KRW" | "USD";
};

const nfInt = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function fmtMoney(amount: number, currency: NonNullable<Props["currency"]>) {
  try {
    return new Intl.NumberFormat("ru-RU", { style: "currency", currency }).format(amount);
  } catch {
    // fallback
    const sym: Record<string, string> = { RUB: "₽", KRW: "₩", USD: "$" };
    return `${nfInt.format(amount)} ${sym[currency] ?? currency}`;
  }
}

export default function KpiRow(props: Props) {
  const c = props.currency ?? "RUB";

  // защищаемся от NaN/undefined
  const revenue = Number.isFinite(props.revenue) ? props.revenue : 0;
  const successRate = Number.isFinite(props.successRate) ? props.successRate : 0;
  const successCount = Number.isFinite(props.successCount) ? props.successCount : 0;
  const failRate = Number.isFinite(props.failRate) ? props.failRate : 0;
  const refundsCount = Number.isFinite(props.refundsCount) ? props.refundsCount : 0;
  const refundsAmount = Number.isFinite(props.refundsAmount) ? props.refundsAmount : 0;
  const latencyP95 = Number.isFinite(props.latencyP95) ? props.latencyP95 : 0;

  const cards = [
    {
      label: "Выручка",
      value: fmtMoney(revenue, c),
      href: "/demo/manager/reports/sales?range=30d",
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      title: "Открыть отчёт по выручке",
    },
    {
      label: "Успешные",
      value: `${nfInt.format(successCount)} (${nf1.format(successRate)}%)`,
      href: "/demo/manager/payments?status=paid",
      icon: <Activity className="w-5 h-5 text-sky-400" />,
      title: "Перейти к успешным платежам",
    },
    {
      label: "Отказы",
      value: `${nf1.format(failRate)}%`,
      href: "/demo/manager/payments?status=failed",
      icon: <TrendingDown className="w-5 h-5 text-rose-400" />,
      title: "Перейти к отказам по платежам",
    },
    {
      label: "Возвраты",
      value: `${nfInt.format(refundsCount)} / ${fmtMoney(refundsAmount, c)}`,
      href: "/demo/manager/payments?status=refunded",
      icon: <RefreshCw className="w-5 h-5 text-amber-400" />,
      title: "Перейти к возвратам",
    },
    {
      label: "Latency P95",
      value: `${nfInt.format(latencyP95)} ms`,
      href: "/demo/admin/payments/providers",
      icon: <Zap className="w-5 h-5 text-violet-400" />,
      title: "Задержка по провайдерам (95-й перцентиль)",
    },
  ] as const;

  return (
    <section className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
      {cards.map((k) => (
        <Link
          key={k.label}
          href={k.href}
          aria-label={`${k.label}: ${k.value}`}
          title={k.title}
          className="group rounded-2xl border border-white/15 bg-white/[0.05] hover:bg-white/[0.08] transition p-4 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/60">{k.label}</div>
            <div className="opacity-70 group-hover:opacity-100 transition" aria-hidden="true">
              {k.icon}
            </div>
          </div>
          <div className="mt-2 text-lg font-semibold text-white truncate">{k.value}</div>
        </Link>
      ))}
    </section>
  );
}