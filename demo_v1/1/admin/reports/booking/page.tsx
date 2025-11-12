"use client";

import React from "react";
import { useRouter } from "next/navigation";

/* UI */
import ReportsHeader from "../components/ReportsHeader";
import KpiRow from "../components/KpiRow";
import TrendLine from "../components/TrendLine";
import HeatmapGrid from "../components/HeatmapGrid";
import BarStack from "../components/BarStack";
import TableBasic from "../components/TableBasic";

/* Данные (общие для демо-отчётов) */
import {
  ADMIN_BOOKING_KPI,
  ADMIN_BOOKING_TREND,
  ADMIN_BOOKING_HEAT,
  ADMIN_BOOKING_STAFF,
  ADMIN_BOOKING_SERVICES,
  ADMIN_DEFICIT_DAYS,
} from "@/app/demo/(shared)/reports/analytics";

export default function AdminReportsBookingPage() {
  const router = useRouter();

  return (
    <div
      className="
        grid gap-6
        w-full max-w-full min-w-0
        overflow-x-hidden
      "
    >
      {/* Хедер */}
      <div className="min-w-0">
        <ReportsHeader title="Бронирования и загрузка" />
      </div>

      {/* KPI */}
      <div className="min-w-0">
        <KpiRow
          items={[
            { label: "Создано", value: String(ADMIN_BOOKING_KPI.created) },
            { label: "Подтверждено", value: String(ADMIN_BOOKING_KPI.confirmed) },
            { label: "Состоялось", value: String(ADMIN_BOOKING_KPI.completed) },
            { label: "Отменено", value: String(ADMIN_BOOKING_KPI.cancelled) },
            { label: "No-show", value: String(ADMIN_BOOKING_KPI.noshow) },
            {
              label: "Utilization",
              value: `${ADMIN_BOOKING_KPI.utilizationPct}%`,
              delta: ADMIN_BOOKING_KPI.deltaUtilizationPct,
            },
          ]}
        />
      </div>

      {/* Тренд — горизонтальный скролл только внутри секции */}
      <section className="min-w-0 -mx-3 md:mx-0">
        <div className="px-3 md:px-0 overflow-x-auto">
          <TrendLine
            data={ADMIN_BOOKING_TREND as any}
            y1="created"
            y2="completed"
            onPointClick={(p) => router.push(`/demo/manager/booking?date=${p.date}`)}
          />
        </div>
      </section>

      {/* Тепловая карта + дефицитные дни (на мобиле в столбик) */}
      <section className="grid md:grid-cols-2 gap-4 min-w-0">
        <div className="min-w-0">
          <HeatmapGrid data={ADMIN_BOOKING_HEAT} />
        </div>
        <div className="min-w-0">
          <BarStack
            data={ADMIN_DEFICIT_DAYS.map((d) => ({
              label: `${d.date} • ${d.location}`,
              value: 1,
            }))}
            onBarClick={(r) =>
              router.push(
                `/demo/admin/booking/schedules?week=${String(r.label).slice(0, 10)}`
              )
            }
          />
        </div>
      </section>

      {/* Таблицы — скролл внутри таблиц */}
      <section className="min-w-0 -mx-3 md:mx-0">
        <div className="px-3 md:px-0 overflow-x-auto">
          <TableBasic
            columns={[
              "Сотрудник",
              "Доступно (ч)",
              "Занято (ч)",
              "Utilization",
              "No-show %",
            ]}
            rows={ADMIN_BOOKING_STAFF.map((s) => ({
              Сотрудник: s.name,
              "Доступно (ч)": s.availH,
              "Занято (ч)": s.busyH,
              Utilization: `${s.util}%`,
              "No-show %": `${s.noshowPct}%`,
            }))}
          />
        </div>
      </section>

      <section className="min-w-0 -mx-3 md:mx-0">
        <div className="px-3 md:px-0 overflow-x-auto">
          <TableBasic
            columns={["Услуга", "Создано", "Состоялось", "Отменено", "No-show"]}
            rows={ADMIN_BOOKING_SERVICES.map((s) => ({
              Услуга: s.name,
              Создано: s.created,
              Состоялось: s.completed,
              Отменено: s.cancelled,
              "No-show": s.noshow,
            }))}
          />
        </div>
      </section>
    </div>
  );
}