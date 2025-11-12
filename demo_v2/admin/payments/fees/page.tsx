// app/demo/admin/payments/fees/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import FeesMatrix from "../components/FeesMatrix";
import { ADMIN_FEES_PLANS } from "@/app/demo/(shared)/payments";

export default function FeesPage() {
  const plans = React.useMemo(
    () =>
      [...ADMIN_FEES_PLANS].sort(
        (a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name, "ru")
      ),
    []
  );

  const fmt = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleString("ru-RU");
  };

  const badge = (active: boolean) =>
    `px-2 py-0.5 rounded-md text-[11px] ${
      active ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/60"
    }`;

  return (
    <div className="grid gap-6 w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight break-words">
            Тарифы/Комиссии
          </h1>
          <p className="mt-1 text-sm text-white/60 break-words">
            Правила комиссий по методам, валютам и локациям.
          </p>
        </div>

        <div className="flex w-full md:w-auto gap-2">
          <Link
            href="/demo/admin/payments/fees/new"
            className="w-full md:w-auto rounded-lg bg-white/90 text-black px-3 py-2 text-sm text-center hover:bg-white"
          >
            Новый план
          </Link>
        </div>
      </header>

      {/* Матрица комиссий */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-0 overflow-hidden">
        <div className="-mx-3 md:mx-0">
          <div className="px-3 md:px-0">
            <FeesMatrix />
          </div>
        </div>
      </section>

      {/* Планы */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 min-w-0">
        <div className="text-sm text-white/70 mb-2">Планы</div>

        {plans.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-4 text-sm text-white/60 text-center">
            Нет планов.
          </div>
        ) : (
          <div className="grid gap-2 min-w-0">
            {plans.map((p) => (
              <Link
                key={p.id}
                href={`/demo/admin/payments/fees/${p.id}`}
                className="block rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 hover:bg-white/[0.06] min-w-0"
                aria-label={`Открыть план ${p.name}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="font-medium truncate">{p.name}</div>
                  <span className={badge(!!p.active)}>{p.active ? "Активен" : "Отключен"}</span>
                </div>
                <div className="text-xs text-white/60 whitespace-normal break-words mt-0.5">
                  Обновлён: {fmt(p.updatedAt)}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}