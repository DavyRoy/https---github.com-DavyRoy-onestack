"use client";
import Link from "next/link";
import React from "react";

type Row = {
  id: string;
  ts: string;
  user: string;
  role: string;
  module: string;
  action: string;
  entityType: string;
  entityId: string | number;
  result?: string;
  ip: string;
  ua: string;
  level: "info" | "warn" | "error";
  critical?: boolean;
};

function LevelBadge({ level, critical }: { level: Row["level"]; critical?: boolean }) {
  const tone =
    level === "error" ? "bg-red-500/20" : level === "warn" ? "bg-amber-500/20" : "bg-white/10";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] sm:text-xs ${tone}`}
      title={critical ? "critical" : undefined}
    >
      {level}
      {critical ? " ⚠" : ""}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-center text-white/70">
      Нет событий
    </div>
  );
}

export default function LogsTable({ rows }: { rows: Row[] }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="w-full max-w-full min-w-0">
        {/* mobile + desktop одинаковый empty */}
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full min-w-0">
      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden" role="list" aria-label="События аудита (мобильный вид)">
        {rows.map((r) => (
          <div
            role="listitem"
            key={r.id}
            className="rounded-2xl border border-white/15 bg-white/[0.05] p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm font-medium whitespace-nowrap" title={r.ts}>
                <time dateTime={r.ts}>{r.ts}</time>
              </div>
              <LevelBadge level={r.level} critical={r.critical} />
            </div>

            <div className="mt-2 text-sm">
              <div className="truncate" title={`${r.user} (${r.role})`}>
                <span className="text-white/60">Пользователь: </span>
                {r.user} <span className="text-white/50">({r.role})</span>
              </div>
              <div className="truncate" title={`${r.module} / ${r.action}`}>
                <span className="text-white/60">Модуль: </span>
                {r.module} / {r.action}
              </div>
              <div className="truncate" title={`${r.entityType} #${r.entityId}`}>
                <span className="text-white/60">Объект: </span>
                {r.entityType} #{r.entityId}
              </div>
              <div className="truncate" title={r.result || "—"}>
                <span className="text-white/60">Результат: </span>
                {r.result || "—"}
              </div>
              <div className="mt-1">
                <div className="truncate" title={r.ip}>
                  <span className="text-white/60">IP: </span>
                  {r.ip}
                </div>
                <div className="text-xs text-white/50 truncate" title={r.ua}>
                  {r.ua}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <Link
                href={`/demo/admin/audit/logs/${r.id}`}
                className="block w-full text-center rounded border border-white/15 px-3 py-2 hover:bg-white/[0.08] text-sm"
              >
                Открыть
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-auto rounded-xl border border-white/10">
        <table className="min-w-[980px] w-full text-sm" aria-label="События аудита">
          <thead className="bg-white/[0.04] text-white/80 sticky top-0 z-10">
            <tr>
              <th className="p-2 text-left">Время</th>
              <th className="p-2 text-left">Пользователь/Роль</th>
              <th className="p-2 text-left">Модуль/Действие</th>
              <th className="p-2 text-left">Объект</th>
              <th className="p-2 text-left">Результат</th>
              <th className="p-2 text-left">IP/UA</th>
              <th className="p-2 text-left">Lvl</th>
              <th className="p-2 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10 hover:bg-white/[0.03]">
                <td className="p-2 whitespace-nowrap" title={r.ts}>
                  <time dateTime={r.ts}>{r.ts}</time>
                </td>
                <td className="p-2 whitespace-nowrap" title={`${r.user} (${r.role})`}>
                  {r.user} <span className="text-white/50">({r.role})</span>
                </td>
                <td className="p-2 whitespace-nowrap" title={`${r.module} / ${r.action}`}>
                  {r.module} / {r.action}
                </td>
                <td className="p-2 whitespace-nowrap" title={`${r.entityType} #${r.entityId}`}>
                  {r.entityType} #{r.entityId}
                </td>
                <td className="p-2 whitespace-nowrap" title={r.result || "—"}>
                  {r.result || "—"}
                </td>
                <td className="p-2">
                  <div className="whitespace-nowrap" title={r.ip}>
                    {r.ip}
                  </div>
                  <div className="text-xs text-white/50 truncate max-w-[320px]" title={r.ua}>
                    {r.ua}
                  </div>
                </td>
                <td className="p-2">
                  <LevelBadge level={r.level} critical={r.critical} />
                </td>
                <td className="p-2 text-right">
                  <Link
                    href={`/demo/admin/audit/logs/${r.id}`}
                    className="rounded border border-white/15 px-2 py-1 hover:bg-white/[0.08]"
                  >
                    Открыть
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}