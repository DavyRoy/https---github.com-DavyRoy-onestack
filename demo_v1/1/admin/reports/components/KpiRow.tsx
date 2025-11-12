"use client";

import Link from "next/link";
import React from "react";

type Card = {
  label: string;
  value: string;
  delta?: number;
  href?: string;
  tooltip?: string;
};

function Delta({ v }: { v?: number }) {
  if (v === undefined) return null;
  const up = v >= 0;
  return (
    <span
      className={`ml-2 text-xs inline-flex items-center gap-1 ${
        up ? "text-emerald-400" : "text-rose-400"
      }`}
      aria-live="polite"
    >
      <span aria-hidden="true">{up ? "▲" : "▼"}</span>
      <span>
        {up ? "+" : ""}
        {v}%
      </span>
      <span className="sr-only">
        {up ? "рост" : "падение"} на {Math.abs(v)} процентов
      </span>
    </span>
  );
}

function CardBody({ c }: { c: Card }) {
  return (
    <div
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 hover:bg-white/[0.08] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 min-w-0"
      title={c.tooltip}
    >
      <div className="text-xs text-white/60">{c.label}</div>
      <div className="mt-1 text-lg font-semibold leading-tight break-words">
        <span className="truncate">{c.value}</span>
        <Delta v={c.delta} />
      </div>
    </div>
  );
}

export default function KpiRow({ items }: { items: Card[] }) {
  return (
    <section className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
      {items.map((c) =>
        c.href ? (
          <Link
            key={c.label}
            href={c.href}
            className="block w-full min-w-0 focus-visible:outline-none"
          >
            <CardBody c={c} />
          </Link>
        ) : (
          <div key={c.label} className="w-full min-w-0">
            <CardBody c={c} />
          </div>
        )
      )}
    </section>
  );
}