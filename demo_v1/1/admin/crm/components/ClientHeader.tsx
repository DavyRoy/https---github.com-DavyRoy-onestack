"use client";

import * as React from "react";

type Props = {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode; // кнопки действий справа
  backHref?: string;
};

export default function ClientHeader({ title, subtitle, rightSlot, backHref }: Props) {
  return (
    <header className="rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-3 md:px-5 md:py-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {backHref && (
              <a
                href={backHref}
                className="rounded-lg border border-white/15 px-2 py-1 text-xs hover:bg-white/[0.06]"
                aria-label="Назад"
              >
                ← Назад
              </a>
            )}
            <h1 className="text-lg md:text-xl font-semibold truncate">{title}</h1>
          </div>
          {subtitle && <p className="mt-1 text-sm text-white/70">{subtitle}</p>}
        </div>
        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
      </div>
    </header>
  );
}