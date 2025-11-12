"use client";

import * as React from "react";
import Link from "next/link";
import { ADMIN_CRM_PIPELINES } from "@/app/demo/(shared)/crm/data/pipelines.demo";

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${
        active ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-white/70"
      }`}
    >
      {active ? "Активна" : "Отключена"}
    </span>
  );
}

export default function PipelinesTable() {
  const rows = React.useMemo(
    () =>
      [...ADMIN_CRM_PIPELINES].sort(
        (a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name, "ru")
      ),
    []
  );

  // Моб. карточки
  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.03]">
      <div className="md:hidden grid gap-2 p-3">
        {rows.map((p) => {
          const previewStages = p.stages.slice(0, 4);
          const rest = Math.max(0, p.stages.length - previewStages.length);
          return (
            <Link
              key={p.id}
              href={`/demo/admin/crm/pipelines/${p.id}`}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-3 hover:bg-white/[0.06]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="mt-1 text-xs text-white/60 truncate">
                    {p.target || "—"} • этапов: {p.stages.length}
                  </div>
                </div>
                <StatusBadge active={!!p.active} />
              </div>

              {p.stages.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {previewStages.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center rounded px-2 py-0.5 text-[11px] border border-white/10"
                      style={{ background: s.color ? `${s.color}22` : undefined }}
                      title={[
                        s.probability !== undefined ? `P=${s.probability}%` : null,
                        s.slaHours ? `SLA=${s.slaHours}ч` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    >
                      {s.name}
                    </span>
                  ))}
                  {rest > 0 && (
                    <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] bg-white/10">
                      +{rest}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
        {rows.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center text-white/60">
            Воронки не найдены.
          </div>
        )}
      </div>

      {/* Десктоп-таблица */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-fixed text-sm">
          <thead className="text-white/60">
            <tr className="border-b border-white/10">
              <th className="text-left p-3 w-[42%]">Воронка</th>
              <th className="text-left p-3 w-[22%]">Назначение</th>
              <th className="text-left p-3 w-[18%]">Этапов</th>
              <th className="text-left p-3 w-[18%]">Статус</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-white/10 hover:bg-white/[0.04]">
                <td className="p-3">
                  <Link
                    href={`/demo/admin/crm/pipelines/${p.id}`}
                    className="font-medium hover:underline truncate block"
                    title="Открыть воронку"
                  >
                    {p.name}
                  </Link>
                </td>
                <td className="p-3 truncate">{p.target || "—"}</td>
                <td className="p-3">{p.stages.length}</td>
                <td className="p-3">
                  <StatusBadge active={!!p.active} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-white/60">
                  Воронки не найдены.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}