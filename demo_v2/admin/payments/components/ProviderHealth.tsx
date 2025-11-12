// app/demo/admin/payments/components/ProviderHealth.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import type { Provider } from "@/app/demo/(shared)/payments/data/mockAdminPaymentsMetrics";

export default function ProviderHealth({ providers }: { providers: Provider[] }) {
  const statusBadge = (s: Provider["status"]) => {
    switch (s) {
      case "ok":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "degraded":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      default:
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
    }
  };

  const fmtPct = (n: number) => `${n.toFixed(1)}%`;
  const fmtMs = (n: number) => `${n} ms`;

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
      <div className="text-sm text-white/70 mb-3 font-medium">Платёжные провайдеры</div>

      <div className="grid gap-2 min-w-0">
        {providers.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/60 text-center">
            Провайдеры не найдены.
          </div>
        ) : (
          providers.map((p) => (
            <Link
              key={p.id}
              href={`/demo/admin/payments/providers/${p.id}`}
              className="rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition block focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <div className="p-3 grid gap-2">
                {/* Верхняя строка: статус + имя + метрики */}
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <span
                    className={`px-2 py-0.5 rounded-md border text-xs shrink-0 ${statusBadge(
                      p.status
                    )}`}
                  >
                    {p.status === "ok"
                      ? "OK"
                      : p.status === "degraded"
                      ? "Degraded"
                      : "Down"}
                  </span>

                  <div className="font-medium truncate text-white/90">{p.name}</div>

                  <div className="text-xs text-white/60 flex items-center gap-2 ml-auto">
                    <span className="whitespace-nowrap">P95 {fmtMs(p.latencyP95)}</span>
                    <span className="hidden sm:inline opacity-40">•</span>
                    <span className="whitespace-nowrap">Fail {fmtPct(p.failRate)}</span>
                  </div>
                </div>

                {/* Нижняя строка: методы / валюты */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-white/60 min-w-0">
                  <div className="truncate">
                    <span className="opacity-70">Методы: </span>
                    {p.methods.join(", ")}
                  </div>
                  <div className="hidden sm:inline opacity-40">•</div>
                  <div className="truncate">
                    <span className="opacity-70">Валюты: </span>
                    {p.currencies.join(", ")}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}