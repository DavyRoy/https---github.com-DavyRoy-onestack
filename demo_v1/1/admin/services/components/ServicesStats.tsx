"use client";

import Link from "next/link";
import { TrendingUp, List, AlertTriangle } from "lucide-react";

type StatsItem = { title: string; value: number; href: string };

export default function ServicesStats({ items = [] as StatsItem[] }: { items?: StatsItem[] }) {
  const safe = Array.isArray(items) ? items : [];

  if (safe.length === 0) {
    return (
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
        <div className="text-sm font-medium mb-2">KPI каталога</div>
        <div className="text-sm text-white/70">
          <AlertTriangle className="inline w-4 h-4 mr-1 opacity-70" />
          Данные недоступны (демо). Проверьте загрузку моков.
        </div>
      </section>
    );
  }

  // иконки по индексу (для разнообразия)
  const icons = [<TrendingUp />, <List />, <AlertTriangle />];

  return (
    <section className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      {safe.map((it, idx) => (
        <Link
          key={it.title}
          href={it.href}
          className="group rounded-2xl border border-white/15 bg-white/[0.05] p-4 hover:bg-white/[0.08] transition-all duration-200 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/60">{it.title}</div>
            <span className="opacity-70 group-hover:opacity-100 transition">
              {icons[idx % icons.length]}
            </span>
          </div>
          <div className="mt-2 text-3xl font-semibold text-white tracking-tight">
            {Number(it.value).toLocaleString("ru-RU")}
          </div>
          <div className="mt-2 text-[11px] text-white/60 group-hover:text-white/80 transition">
            Открыть →
          </div>
        </Link>
      ))}
    </section>
  );
}