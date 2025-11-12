"use client";

import * as React from "react";
import { ADMIN_CRM_PIPELINES } from "../data/mockAdminCrmPipelines";

export default function PipelineEditor({ id }: { id: string }) {
  const p = ADMIN_CRM_PIPELINES.find((x) => x.id === id);
  if (!p) return <div className="text-white/70">Воронка не найдена</div>;

  return (
    <section className="rounded-2xl border border-white/15 p-4 bg-white/[0.03] grid gap-3">
      <div className="text-sm text-white/70">
        Воронка: <span className="text-white">{p.name}</span> · {p.target}
      </div>

      <div className="flex flex-wrap items-start gap-2">
        {p.stages.map((s) => (
          <div
            key={s.id}
            className="px-3 py-2 rounded-lg border border-white/15 text-sm"
            style={{ background: s.color ? `${s.color}22` : undefined }}
            title={s.slaHours ? `SLA: ${s.slaHours} ч` : undefined}
          >
            <div className="font-medium">{s.name}</div>
            <div className="text-xs opacity-80">
              {s.probability !== undefined ? `Вероятность: ${s.probability}%` : "—"}
              {s.slaHours ? ` • SLA: ${s.slaHours} ч` : ""}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-1">
        <button
          onClick={() => alert("Сохранено (демо)")}
          className="px-3 py-2 rounded border border-white/20 hover:bg-white/10"
        >
          Сохранить
        </button>
      </div>
    </section>
  );
}