"use client";

import clsx from "clsx";
import type { ReactNode } from "react";

export const managerSurface = {
  page: "grid gap-6 pb-20",
  hero:
    "relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/12 via-white/6 to-white/10 p-4 md:p-6 backdrop-blur-md shadow-xl",
  card:
    "rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 backdrop-blur-md shadow-md",
  soft:
    "rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur",
  chip:
    "inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.08] px-2 py-0.5 text-[11px] text-white/75",
  btn:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-white bg-white px-3 py-2 text-sm font-medium text-black transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
  btnGhost:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
  input:
    "w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30 placeholder:text-white/45",
  dim: "text-white/70",
  mut: "text-white/55",
};

export function ManagerSection({
  title,
  subtitle,
  actions,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx(managerSurface.card, "flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <div className="text-sm font-semibold leading-tight">{title}</div>
          {subtitle ? <p className={clsx("text-xs", managerSurface.dim)}>{subtitle}</p> : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap gap-2">{actions}</div>
        ) : null}
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}
