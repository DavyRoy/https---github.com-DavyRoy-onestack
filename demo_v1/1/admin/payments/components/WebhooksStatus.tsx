// WebhooksStatus.tsx
"use client";

import React from "react";

type Props = {
  delivered: number;
  retry: number;
  failed: number;
};

export default function WebhooksStatus({ delivered, retry, failed }: Props) {
  const total = delivered + retry + failed || 1;
  const pct = (n: number) => ((n / total) * 100).toFixed(0) + "%";

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 w-full">
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div className="text-sm text-white/70">Webhooks</div>
        <div className="text-xs text-white/50">Всего: {total.toLocaleString("ru-RU")}</div>
      </div>

      {/* Шкала распределения */}
      <div className="w-full h-3 rounded-full overflow-hidden border border-white/10 bg-white/[0.06] mb-3">
        <div className="h-full bg-emerald-400/70 inline-block align-top" style={{ width: pct(delivered) }} />
        <div className="h-full bg-amber-400/70 inline-block align-top" style={{ width: pct(retry) }} />
        <div className="h-full bg-rose-400/80 inline-block align-top" style={{ width: pct(failed) }} />
      </div>

      {/* Сетка карточек */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center w-full">
        <MetricCard label="Delivered" value={delivered} percent={pct(delivered)} colorClass="bg-emerald-500/20 text-emerald-300" />
        <MetricCard label="Retry" value={retry} percent={pct(retry)} colorClass="bg-amber-500/20 text-amber-300" />
        <MetricCard label="Failed" value={failed} percent={pct(failed)} colorClass="bg-rose-500/20 text-rose-300" />
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  percent,
  colorClass,
}: {
  label: string;
  value: number;
  percent: string;
  colorClass: string;
}) {
  return (
    <div className="rounded-xl bg-white/[0.04] p-3 flex flex-col items-center justify-center w-full min-w-0">
      <div className={`px-2 py-0.5 rounded-md text-[10px] mb-1 ${colorClass}`}>{label}</div>
      <div className="text-lg font-semibold leading-tight">{value.toLocaleString("ru-RU")}</div>
      <div className="text-xs text-white/60">{percent}</div>
    </div>
  );
}