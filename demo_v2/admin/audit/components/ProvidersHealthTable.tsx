"use client";

import Link from "next/link";
import React from "react";

type Row = {
  id: string;
  name: string;
  kind: string; // payments | email | sms | ...
  status: "ok" | "degraded" | "down";
  latencyP95: number; // ms
  failRate: number;   // %
  checkedAt: string;  // HH:MM или ISO (как в демо)
  href: string;
};

function StatusBadge({ status }: { status: Row["status"] }) {
  const label = { ok: "OK", degraded: "Degraded", down: "Down" }[status];
  const cls =
    status === "ok"
      ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/30"
      : status === "degraded"
      ? "bg-amber-500/20 text-amber-200 border-amber-400/30"
      : "bg-rose-500/20 text-rose-200 border-rose-400/30";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border text-[11px] ${cls}`}
      title={label}
    >
      {label}
    </span>
  );
}

function toneBadge(value: number, kind: "latency" | "fail") {
  // Простые пороги: latency — ok <300, warn <1000, иначе bad; fail % — ok <0.5, warn <2, иначе bad
  let tone: "ok" | "warn" | "bad" = "ok";
  if (kind === "latency") {
    tone = value >= 1000 ? "bad" : value >= 300 ? "warn" : "ok";
  } else {
    tone = value >= 2 ? "bad" : value >= 0.5 ? "warn" : "ok";
  }
  const map = {
    ok: "bg-emerald-500/15 text-emerald-200 border-emerald-400/25",
    warn: "bg-amber-500/15 text-amber-200 border-amber-400/25",
    bad: "bg-rose-500/15 text-rose-200 border-rose-400/25",
  } as const;
  return map[tone];
}

const fmtNum = (n: unknown) =>
  typeof n === "number" && Number.isFinite(n) ? n.toLocaleString("ru-RU") : "—";

function EmptyState() {
  return (
    <div className="rounded-xl border border-white/10 p-4 text-center text-white/70">
      Нет данных
    </div>
  );
}

export default function ProvidersHealthTable({ rows }: { rows: Row[] }) {
  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4">
      <div className="text-sm font-medium mb-2">Провайдеры</div>

      {/* Мобильный вид — карточки */}
      <div className="grid gap-3 md:hidden" role="list" aria-label="Здоровье провайдеров (мобильный вид)">
        {rows.length === 0 && <EmptyState />}
        {rows.map((r) => (
          <div key={r.id} role="listitem" className="rounded-2xl border border-white/15 bg-white/[0.04] p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate" title={r.name}>
                  {r.name}
                </div>
                <div className="text-xs text-white/60 mt-0.5 uppercase" title={r.kind}>
                  {r.kind}
                </div>
              </div>
              <StatusBadge status={r.status} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div
                className={`rounded-lg border p-2 ${toneBadge(r.latencyP95, "latency")}`}
                title={`${r.latencyP95} ms`}
              >
                <div className="text-[11px] opacity-70">Lat P95</div>
                <div className="font-medium">{fmtNum(r.latencyP95)} ms</div>
              </div>
              <div
                className={`rounded-lg border p-2 ${toneBadge(r.failRate, "fail")}`}
                title={`${r.failRate}%`}
              >
                <div className="text-[11px] opacity-70">Fail %</div>
                <div className="font-medium">{fmtNum(r.failRate)}%</div>
              </div>
              <div className="rounded-lg border border-white/10 p-2 col-span-2">
                <div className="text-[11px] text-white/60">Последняя проверка</div>
                <div className="font-medium">
                  {/* Отображаем как есть; если ISO — всё равно читаемо. */}
                  <time dateTime={r.checkedAt}>{r.checkedAt}</time>
                </div>
              </div>
            </div>

            <Link
              href={r.href}
              className="mt-3 block w-full text-center rounded border border-white/15 px-3 py-2 hover:bg-white/[0.08] text-sm"
            >
              Открыть
            </Link>
          </div>
        ))}
      </div>

      {/* Десктопный вид — таблица */}
      <div className="hidden md:block overflow-auto rounded-xl border border-white/10">
        <table className="min-w-[880px] w-full text-sm" aria-label="Здоровье провайдеров">
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[16%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
          </colgroup>
          <thead className="bg-white/[0.04] text-white/80 sticky top-0 z-10">
            <tr>
              <th className="p-2 text-left">Провайдер</th>
              <th className="p-2 text-left">Тип</th>
              <th className="p-2 text-left">Статус</th>
              <th className="p-2 text-left">Lat P95</th>
              <th className="p-2 text-left">Fail %</th>
              <th className="p-2 text-right">Проверка</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10 hover:bg-white/[0.03]">
                <td className="p-2 font-medium">
                  <Link
                    href={r.href}
                    className="hover:underline truncate inline-block max-w-[280px] align-middle"
                    title={r.name}
                  >
                    {r.name}
                  </Link>
                </td>
                <td className="p-2 uppercase text-xs" title={r.kind}>
                  {r.kind}
                </td>
                <td className="p-2">
                  <StatusBadge status={r.status} />
                </td>
                <td
                  className={`p-2 whitespace-nowrap rounded ${toneBadge(r.latencyP95, "latency")}`}
                  title={`${r.latencyP95} ms`}
                >
                  {fmtNum(r.latencyP95)} ms
                </td>
                <td
                  className={`p-2 whitespace-nowrap rounded ${toneBadge(r.failRate, "fail")}`}
                  title={`${r.failRate}%`}
                >
                  {fmtNum(r.failRate)}%
                </td>
                <td className="p-2 text-right whitespace-nowrap" title={r.checkedAt}>
                  <time dateTime={r.checkedAt}>{r.checkedAt}</time>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-3 text-center text-white/70">
                  Нет данных
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}