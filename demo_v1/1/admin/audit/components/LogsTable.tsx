"use client";
import Link from "next/link";

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

export default function LogsTable({ rows }: { rows: Row[] }) {
  // Мобильный вид — карточки
  return (
    <div className="w-full max-w-full min-w-0">
      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {rows.length === 0 && (
          <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-center text-white/70">
            Нет событий
          </div>
        )}

        {rows.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-white/15 bg-white/[0.05] p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm font-medium whitespace-nowrap">{r.ts}</div>
              <span
                className={`px-2 py-0.5 rounded text-[11px] shrink-0 ${
                  r.level === "error"
                    ? "bg-red-500/20"
                    : r.level === "warn"
                    ? "bg-amber-500/20"
                    : "bg-white/10"
                }`}
                title={r.critical ? "critical" : undefined}
              >
                {r.level}
                {r.critical ? " ⚠" : ""}
              </span>
            </div>

            <div className="mt-2 text-sm">
              <div className="truncate">
                <span className="text-white/60">Пользователь: </span>
                {r.user} <span className="text-white/50">({r.role})</span>
              </div>
              <div className="truncate">
                <span className="text-white/60">Модуль: </span>
                {r.module} / {r.action}
              </div>
              <div className="truncate">
                <span className="text-white/60">Объект: </span>
                {r.entityType} #{r.entityId}
              </div>
              <div className="truncate">
                <span className="text-white/60">Результат: </span>
                {r.result || "—"}
              </div>
              <div className="mt-1">
                <div className="truncate">
                  <span className="text-white/60">IP: </span>
                  {r.ip}
                </div>
                <div className="text-xs text-white/50 truncate">
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
        <table className="min-w-[980px] w-full text-sm">
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
                <td className="p-2 whitespace-nowrap">{r.ts}</td>
                <td className="p-2 whitespace-nowrap">
                  {r.user} <span className="text-white/50">({r.role})</span>
                </td>
                <td className="p-2 whitespace-nowrap">
                  {r.module} / {r.action}
                </td>
                <td className="p-2 whitespace-nowrap">
                  {r.entityType} #{r.entityId}
                </td>
                <td className="p-2 whitespace-nowrap">{r.result || "—"}</td>
                <td className="p-2">
                  <div className="whitespace-nowrap">{r.ip}</div>
                  <div className="text-xs text-white/50 truncate max-w-[280px]">
                    {r.ua}
                  </div>
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      r.level === "error"
                        ? "bg-red-500/20"
                        : r.level === "warn"
                        ? "bg-amber-500/20"
                        : "bg-white/10"
                    }`}
                    title={r.critical ? "critical" : undefined}
                  >
                    {r.level}
                    {r.critical ? " ⚠" : ""}
                  </span>
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
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="p-3 text-center text-white/70">
                  Нет событий
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}