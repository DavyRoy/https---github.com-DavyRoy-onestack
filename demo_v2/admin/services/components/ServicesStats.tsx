"use client";

import Link from "next/link";
import { useMemo } from "react";
import { TrendingUp, List, AlertTriangle } from "lucide-react";

export type StatsItem = {
  title: string;
  value: number;
  href: string;
};

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function ServicesStats({ items = [] as StatsItem[] }: { items?: StatsItem[] }) {
  const safe: StatsItem[] = Array.isArray(items) ? items : [];

  // Мемоизированный форматтер чисел
  const numFmt = useMemo(
    () => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }),
    []
  );

  if (safe.length === 0) {
    return (
      <section className="admin-section border-white/12 bg-white/8">
        <div className="mb-2 text-sm font-medium text-white/85">KPI каталога</div>
        <div className="flex items-center gap-2 text-sm text-white/70">
          <AlertTriangle className="h-4 w-4 opacity-70" />
          Данные недоступны (демо). Проверьте загрузку моков.
        </div>
      </section>
    );
  }

  // Иконки по индексу
  const ICONS = [TrendingUp, List, AlertTriangle];

  return (
    <section className="admin-section border-white/12 bg-white/8" aria-labelledby="svc-stats-title">
      <div id="svc-stats-title" className="sr-only">
        Основные метрики каталога услуг
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {safe.map((it, idx) => {
          const Icon = ICONS[idx % ICONS.length];
          const value = Number.isFinite(it.value as any) ? it.value : 0;

          return (
            <Link
              key={`${it.title}-${idx}`}
              href={it.href}
              className={cls(
                "group rounded-2xl border border-white/12 bg-white/10 p-4 text-white/85 transition",
                "hover:border-white/18 hover:bg-white/16 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              )}
              aria-label={`${it.title}: ${numFmt.format(value)} — открыть`}
              title={it.title}
              prefetch={false}
            >
              <div className="flex items-center justify-between">
                <div className="text-xs text-white/60 truncate">{it.title}</div>
                <span className="text-white/60 transition group-hover:text-white">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
                {numFmt.format(value)}
              </div>
              <div className="mt-2 text-[11px] text-white/55 transition group-hover:text-white/80">
                Открыть →
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}