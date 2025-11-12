"use client";
import Link from "next/link";
import { T } from "@/app/demo/manager/_parts/tokens";
import type { PipelineStage } from "@/app/demo/manager/dashboard/data/mockManagerDashboard";

export default function PipelineMini({ stages }: { stages: PipelineStage[] }) {
  const safeStages = Array.isArray(stages) ? stages : [];
  const maxCount = Math.max(1, ...safeStages.map((s) => Number(s.count) || 0));

  // Пустое состояние
  if (safeStages.length === 0) {
    return (
      <section className={T.card + " grid gap-3"}>
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold">Мини-воронка</div>
          <Link href="/demo/manager/crm/leads/new" className={T.btn}>
            Создать лид
          </Link>
        </div>
        <div className={T.dim + " text-sm"}>Нет данных по этапам.</div>
      </section>
    );
  }

  return (
    <section className={T.card + " grid gap-3"}>
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold">Мини-воронка</div>
        <Link href="/demo/manager/crm/leads/new" className={T.btn}>
          Создать лид
        </Link>
      </div>

      <div className="grid gap-2">
        {safeStages.map((s) => {
          const count = Number(s.count) || 0;
          const pct = Math.max(0, Math.min(100, (count / maxCount) * 100));
          const conv =
            typeof s.conv === "number"
              ? new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(s.conv)
              : null;

          return (
            <Link
              key={s.id}
              href={s.href}
              className="group"
              aria-label={`${s.title}: ${count} шт.${conv !== null ? `, конверсия ${conv}%` : ""}`}
            >
              <div className="flex items-center justify-between text-sm">
                <div className="truncate">{s.title}</div>
                <div className="tabular-nums shrink-0">
                  {count}
                  {conv !== null && <span className={"ml-2 " + T.mut}>{conv}%</span>}
                </div>
              </div>

              <div
                className="mt-1 h-2 rounded-full bg-white/10 overflow-hidden"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={maxCount}
                aria-valuenow={count}
                aria-label={`Доля этапа ${s.title}`}
              >
                <div
                  className="h-full bg-white group-hover:bg-white/90 transition"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}