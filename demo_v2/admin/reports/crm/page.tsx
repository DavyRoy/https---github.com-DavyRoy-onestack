"use client";

import React from "react";
import { useRouter } from "next/navigation";

/* UI */
import ReportsHeader from "../components/ReportsHeader";
import KpiRow from "../components/KpiRow";
import BarStack from "../components/BarStack";
import TrendLine from "../components/TrendLine";
import DonutChart from "../components/DonutChart";
import TableBasic from "../components/TableBasic";

/* Данные (общие демо-данные) */
import {
  ADMIN_CRM_KPI,
  ADMIN_CRM_BY_SOURCE,
  ADMIN_CRM_FUNNEL,
  ADMIN_CRM_RESPONSE_TREND,
  ADMIN_SEGMENTS_DONUT,
} from "@/app/demo/(shared)/reports/crm";

export default function AdminReportsCrmPage() {
  const router = useRouter();

  // стабильные форматтеры
  const fmtInt = React.useMemo(
    () => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }),
    []
  );

  // KPI карточки
  const kpiItems = React.useMemo(
    () => [
      { label: "Лиды", value: fmtInt.format(ADMIN_CRM_KPI.leads) },
      { label: "Сделки", value: fmtInt.format(ADMIN_CRM_KPI.deals) },
      { label: "Заказы", value: fmtInt.format(ADMIN_CRM_KPI.orders) },
      {
        label: "Конверсия лид→заказ",
        value: `${ADMIN_CRM_KPI.funnelConvPct}%`,
        delta: ADMIN_CRM_KPI.deltaConvPct,
      },
      { label: "1-й ответ (мин)", value: fmtInt.format(ADMIN_CRM_KPI.firstResponseMin) },
      { label: "Цикл (дней)", value: fmtInt.format(ADMIN_CRM_KPI.cycleDays) },
    ],
    [fmtInt]
  );

  // Разрез источников (бар-стек)
  const barData = React.useMemo(
    () =>
      ADMIN_CRM_BY_SOURCE.map((s) => ({
        label: `${s.source} • ${fmtInt.format(s.leads)}`,
        value: s.convPct, // показываем % конверсии
      })),
    [fmtInt]
  );

  // Ряды воронки для таблицы
  const funnelRows = React.useMemo(
    () =>
      ADMIN_CRM_FUNNEL.map((f) => ({
        Этап: f.stage,
        Значение: fmtInt.format(f.value),
      })),
    [fmtInt]
  );

  return (
    <div className="grid gap-6 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Хедер */}
      <div className="min-w-0">
        <ReportsHeader title="CRM и конверсия" />
      </div>

      {/* KPI */}
      <div className="min-w-0">
        <KpiRow items={kpiItems} />
      </div>

      {/* Разрез: источники + сегменты */}
      <section className="grid md:grid-cols-2 gap-4 min-w-0">
        <div className="min-w-0" aria-label="Конверсия по источникам">
          <BarStack
            data={barData}
            onBarClick={(r) => {
              const src = String(r.label).split(" • ")[0];
              router.push(`/demo/manager/crm/leads?source=${encodeURIComponent(src)}`);
            }}
          />
        </div>
        <div className="min-w-0" aria-label="Сегменты CRM">
          <DonutChart
            data={ADMIN_SEGMENTS_DONUT}
            onSliceClick={(s) =>
              router.push(`/demo/admin/crm/segments?segment=${encodeURIComponent(s.label)}`)
            }
          />
        </div>
      </section>

      {/* Тренд времени отклика — горизонтальный скролл только внутри */}
      <section className="min-w-0 -mx-3 md:mx-0" aria-label="Тренд времени первого ответа">
        <div className="px-3 md:px-0 overflow-x-auto">
          <TrendLine
            data={ADMIN_CRM_RESPONSE_TREND as any}
            y1="median"
            y2="leads"
            onPointClick={(p) => router.push(`/demo/manager/crm/leads?date=${p.date}`)}
          />
        </div>
      </section>

      {/* Воронка — таблица: скролл только внутри */}
      <section className="min-w-0 -mx-3 md:mx-0" aria-label="Воронка CRM">
        <div className="px-3 md:px-0 overflow-x-auto">
          <TableBasic columns={["Этап", "Значение"]} rows={funnelRows} />
        </div>
      </section>
    </div>
  );
}