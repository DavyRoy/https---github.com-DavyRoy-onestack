"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Activity, RefreshCw, Zap } from "lucide-react";

type Props = {
  revenue: number;
  successRate: number;
  successCount: number;
  failRate: number;
  refundsCount: number;
  refundsAmount: number;
  latencyP95: number;
  currency?: "RUB" | "KRW" | "USD";
};

const fancy = (n: number) => n.toLocaleString("ru-RU");

export default function KpiRow(props: Props) {
  const c = props.currency ?? "RUB";

  const cards = [
    {
      label: "Выручка",
      value: `${fancy(props.revenue)} ${c}`,
      href: "/demo/manager/reports/sales?range=30d",
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
    },
    {
      label: "Успешные",
      value: `${props.successCount} (${props.successRate.toFixed(1)}%)`,
      href: "/demo/manager/payments?status=paid",
      icon: <Activity className="w-5 h-5 text-sky-400" />,
    },
    {
      label: "Отказы",
      value: `${props.failRate.toFixed(1)}%`,
      href: "/demo/manager/payments?status=failed",
      icon: <TrendingDown className="w-5 h-5 text-rose-400" />,
    },
    {
      label: "Возвраты",
      value: `${props.refundsCount} / ${fancy(props.refundsAmount)} ${c}`,
      href: "/demo/manager/payments?status=refunded",
      icon: <RefreshCw className="w-5 h-5 text-amber-400" />,
    },
    {
      label: "Latency P95",
      value: `${props.latencyP95} ms`,
      href: "/demo/admin/payments/providers",
      icon: <Zap className="w-5 h-5 text-violet-400" />,
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
      {cards.map((k) => (
        <Link
          key={k.label}
          href={k.href}
          className="group rounded-2xl border border-white/15 bg-white/[0.05] hover:bg-white/[0.08] transition p-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/60">{k.label}</div>
            <div className="opacity-70 group-hover:opacity-100 transition">{k.icon}</div>
          </div>
          <div className="mt-2 text-lg font-semibold text-white truncate">{k.value}</div>
        </Link>
      ))}
    </section>
  );
}