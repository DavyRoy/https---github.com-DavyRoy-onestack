// app/demo/admin/payments/components/WebhooksStatus.tsx
"use client";

import * as React from "react";

type Props = {
  delivered: number;
  retry: number;
  failed: number;
};

export default function WebhooksStatus({ delivered, retry, failed }: Props) {
  const totalRaw = (delivered ?? 0) + (retry ?? 0) + (failed ?? 0);
  const total = totalRaw > 0 ? totalRaw : 0;

  const pctNum = (n: number) => (total === 0 ? 0 : (n / total) * 100);
  const pctStr = (n: number) => `${Math.round(pctNum(n))}%`;

  const parts = [
    { key: "delivered", label: "Delivered", value: delivered ?? 0, className: "bg-emerald-400/70" },
    { key: "retry",     label: "Retry",     value: retry ?? 0,     className: "bg-amber-400/70"   },
    { key: "failed",    label: "Failed",    value: failed ?? 0,    className: "bg-rose-400/80"    },
  ];

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 w-full"
      aria-labelledby="webhooks-title"
    >
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div id="webhooks-title" className="text-sm text-white/70">Webhooks</div>
        <div className="text-xs text-white/50">Всего: {total.toLocaleString("ru-RU")}</div>
      </div>

      {/* Шкала распределения */}
      <div
        className="w-full h-3 rounded-full overflow-hidden border border-white/10 bg-white/[0.06] mb-3"
        role="img"
        aria-label={`Delivered ${pctStr(delivered)}, Retry ${pctStr(retry)}, Failed ${pctStr(failed)}`}
      >
        {parts.map((p) => (
          <div
            key={p.key}
            className={`h-full inline-block align-top ${p.className}`}
            style={{ width: pctStr(p.value) }}
            aria-label={`${p.label} ${pctStr(p.value)}`}
            title={`${p.label}: ${p.value.toLocaleString("ru-RU")} (${pctStr(p.value)})`}
          />
        ))}
      </div>

      {/* Сетка карточек */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center w-full">
        {parts.map((p) => (
          <MetricCard
            key={p.key}
            label={p.label}
            value={p.value}
            percent={pctStr(p.value)}
            colorClass={
              p.key === "delivered"
                ? "bg-emerald-500/20 text-emerald-300"
                : p.key === "retry"
                ? "bg-amber-500/20 text-amber-300"
                : "bg-rose-500/20 text-rose-300"
            }
          />
        ))}
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
      <div className="text-lg font-semibold leading-tight">
        {value.toLocaleString("ru-RU")}
      </div>
      <div className="text-xs text-white/60">{percent}</div>
    </div>
  );
}