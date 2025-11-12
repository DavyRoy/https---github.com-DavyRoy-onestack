"use client";

import { T } from "@/app/demo/manager/_parts/tokens";

type Props = {
  variant?: "grid" | "table" | "filters";
  cards?: number;  // для grid
  rows?: number;   // для table
};

export default function Skeletons({ variant = "grid", cards = 8, rows = 8 }: Props) {
  if (variant === "filters") {
    return (
      <div className={`${T.cardSoft} grid gap-3`}>
        <div className="grid gap-2 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div className="h-10 rounded-xl bg-white/10 animate-pulse" />
          <div className="h-9 rounded-xl bg-white/10 animate-pulse hidden md:block" />
          <div className="h-9 rounded-xl bg-white/10 animate-pulse hidden md:block" />
        </div>
        <div className="grid gap-2 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 rounded-xl bg-white/10 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={`${T.card} overflow-hidden`}>
        {/* head */}
        <div className="grid grid-cols-6 gap-2 border-b border-white/10 p-3 text-xs text-white/60">
          {["Услуга", "Категория", "Длительность", "Цена", "Популярность", "Действия"].map((h) => (
            <div key={h} className="truncate">{h}</div>
          ))}
        </div>
        {/* rows */}
        <div className="divide-y divide-white/10">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-2 p-3">
              <div className="h-5 rounded bg-white/10 animate-pulse" />
              <div className="h-5 rounded bg-white/10 animate-pulse" />
              <div className="h-5 rounded bg-white/10 animate-pulse" />
              <div className="h-5 rounded bg-white/10 animate-pulse" />
              <div className="h-5 rounded bg-white/10 animate-pulse" />
              <div className="h-5 rounded bg-white/10 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // default: grid
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className={`${T.card} grid gap-3`}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="h-5 w-3/4 rounded bg-white/10 animate-pulse" />
              <div className="mt-2 flex items-center gap-2">
                <div className="h-5 w-20 rounded bg-white/10 animate-pulse" />
                <div className="h-5 w-16 rounded-full bg-white/10 animate-pulse" />
                <div className="h-5 w-12 rounded-full bg-white/10 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="h-6 w-24 rounded bg-white/10 animate-pulse" />
              <div className="h-5 w-20 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
          <div className="h-10 rounded bg-white/10 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-9 flex-1 rounded-xl bg-white/10 animate-pulse" />
            <div className="h-9 w-28 rounded-xl bg-white/10 animate-pulse" />
            <div className="h-9 w-32 rounded-xl bg-white/10 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}