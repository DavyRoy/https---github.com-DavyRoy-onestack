"use client";

import Link from "next/link";

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
  const color =
    status === "ok"
      ? "bg-emerald-500/70"
      : status === "degraded"
      ? "bg-amber-500/70"
      : "bg-rose-500/70";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] ${color}`}>
      {label}
    </span>
  );
}

export default function ProvidersHealthTable({ rows }: { rows: Row[] }) {
  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3">
      <div className="text-sm font-medium mb-2">Провайдеры</div>

      {/* Мобильный вид — карточки */}
      <div className="grid gap-3 md:hidden">
        {rows.length === 0 && (
          <div className="rounded-xl border border-white/10 p-4 text-center text-white/70">
            Нет данных
          </div>
        )}
        {rows.map((r) => (
          <div key={r.id} className="rounded-2xl border border-white/15 bg-white/[0.04] p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{r.name}</div>
                <div className="text-xs text-white/60 mt-0.5 uppercase">{r.kind}</div>
              </div>
              <StatusBadge status={r.status} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg border border-white/10 p-2">
                <div className="text-[11px] text-white/60">Lat P95</div>
                <div className="font-medium">{r.latencyP95} ms</div>
              </div>
              <div className="rounded-lg border border-white/10 p-2">
                <div className="text-[11px] text-white/60">Fail %</div>
                <div className="font-medium">{r.failRate}%</div>
              </div>
              <div className="rounded-lg border border-white/10 p-2 col-span-2">
                <div className="text-[11px] text-white/60">Последняя проверка</div>
                <div className="font-medium">{r.checkedAt}</div>
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
        <table className="min-w-[880px] w-full text-sm">
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
                  <Link href={r.href} className="hover:underline truncate inline-block max-w-[280px] align-middle">
                    {r.name}
                  </Link>
                </td>
                <td className="p-2 uppercase text-xs">{r.kind}</td>
                <td className="p-2">
                  <StatusBadge status={r.status} />
                </td>
                <td className="p-2 whitespace-nowrap">{r.latencyP95} ms</td>
                <td className="p-2 whitespace-nowrap">{r.failRate}%</td>
                <td className="p-2 text-right whitespace-nowrap">
                  {r.checkedAt}
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