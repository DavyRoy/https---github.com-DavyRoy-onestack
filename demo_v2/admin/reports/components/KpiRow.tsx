"use client";

import Link from "next/link";
import * as React from "react";

type Card = {
  label: string;
  value: string;
  delta?: number;   // в процентах, например 3.2 или -1
  href?: string;
  tooltip?: string;
};

// форматируем дельту с локалью и знаком
const fmtDelta = (v: number) => {
  // защищаемся от -0
  const n = Object.is(v, -0) ? 0 : v;
  const sign = n > 0 ? "+" : "";
  // без лишних хвостов: 1 знак после запятой для дробей, целые без .0
  const abs = Math.abs(n);
  const shown =
    Number.isInteger(abs) ? abs.toLocaleString("ru-RU") : abs.toLocaleString("ru-RU", { maximumFractionDigits: 1 });
  return `${sign}${shown}%`;
};

function Delta({ v }: { v?: number }) {
  if (v === undefined) return null;
  const up = v >= 0 && !Object.is(v, -0);
  const arrow = up ? "▲" : "▼";
  const color = up ? "text-emerald-400" : "text-rose-400";
  return (
    <span
      className={`ml-2 inline-flex items-center gap-1 text-xs shrink-0 ${color}`}
      aria-live="polite"
    >
      <span aria-hidden="true">{arrow}</span>
      <span>{fmtDelta(v)}</span>
      <span className="sr-only">
        {up ? "рост" : "падение"} на {Math.abs(v)} процентов
      </span>
    </span>
  );
}

function CardBody({ c, asLink }: { c: Card; asLink?: boolean }) {
  // aria-label для скринридеров: читаем и лейбл, и значение, и дельту
  const aria = `${c.label}: ${c.value}${c.delta !== undefined ? `, изменение ${fmtDelta(c.delta)}` : ""}`;

  const inner = (
    <div
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 hover:bg-white/[0.08] transition
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 min-w-0"
      title={c.tooltip}
      aria-label={aria}
      role={asLink ? "link" : "group"}
    >
      <div className="text-xs text-white/60">{c.label}</div>
      <div className="mt-1 text-lg font-semibold leading-tight flex items-baseline min-w-0">
        <span className="truncate">{c.value}</span>
        <Delta v={c.delta} />
      </div>
    </div>
  );

  if (c.href && asLink) {
    return (
      <Link
        href={c.href}
        className="block w-full min-w-0 focus-visible:outline-none"
        aria-label={`${aria}. Открыть детализацию`}
      >
        {inner}
      </Link>
    );
  }
  return <div className="w-full min-w-0">{inner}</div>;
}

export default function KpiRow({ items }: { items: Card[] }) {
  return (
    <section className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
      {items.map((c) => (
        <CardBody key={`${c.label}-${c.href ?? "static"}`} c={c} asLink={!!c.href} />
      ))}
    </section>
  );
}