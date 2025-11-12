// ProviderHealth.tsx
"use client";

import React from "react";
import Link from "next/link";
import { type Provider } from "@/app/demo/(shared)/payments/data/mockAdminPaymentsMetrics";

export default function ProviderHealth({ providers }: { providers: Provider[] }) {
  const statusBadge = (s: Provider["status"]) =>
    s === "ok"
      ? "bg-emerald-500/20 text-emerald-300"
      : s === "degraded"
      ? "bg-amber-500/20 text-amber-300"
      : "bg-rose-500/20 text-rose-300";

  const fmtPct = (n: number) => `${n.toFixed(1)}%`;
  const fmtMs = (n: number) => `${n} ms`;

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
      <div className="text-sm text-white/70 mb-2">Провайдеры</div>

      <div className="grid gap-2">
        {providers.map((p) => (
          <Link
            key={p.id}
            href={`/demo/admin/payments/providers/${p.id}`}
            className="rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition min-w-0"
          >
            <div className="p-3 grid gap-2">
              {/* Верхняя строка: статус + имя + метрики */}
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <span className={`px-2 py-0.5 rounded-md text-xs shrink-0 ${statusBadge(p.status)}`}>
                  {p.status}
                </span>

                <div className="font-medium truncate">{p.name}</div>

                <div className="text-xs text-white/60 flex items-center gap-2 ml-auto">
                  <span className="whitespace-nowrap">P95: {fmtMs(p.latencyP95)}</span>
                  <span className="hidden sm:inline opacity-40">•</span>
                  <span className="whitespace-nowrap">Fail: {fmtPct(p.failRate)}</span>
                </div>
              </div>

              {/* Низ: методы/валюты — без переполнения */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-white/60">
                <div className="min-w-0">
                  <span className="opacity-70">Методы: </span>
                  <span className="truncate inline-block align-middle max-w-full">
                    {p.methods.join(", ")}
                  </span>
                </div>
                <div className="hidden sm:inline opacity-40">•</div>
                <div className="min-w-0">
                  <span className="opacity-70">Валюта: </span>
                  <span className="truncate inline-block align-middle max-w-full">
                    {p.currencies.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {providers.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/60 text-center">
            Провайдеров нет.
          </div>
        )}
      </div>
    </section>
  );
}