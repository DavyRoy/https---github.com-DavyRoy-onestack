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

  // стабильные форматтеры
  const fmtInt = React.useMemo(
    () => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }),
    []
  );

  const kpiItems = React.useMemo(
    () => [
      { label: "Создано", value: fmtInt.format(ADMIN_BOOKING_KPI.created) },
      { label: "Подтверждено", value: fmtInt.format(ADMIN_BOOKING_KPI.confirmed) },
      { label: "Состоялось", value: fmtInt.format(ADMIN_BOOKING_KPI.completed) },
      { label: "Отменено", value: fmtInt.format(ADMIN_BOOKING_KPI.cancelled) },
      { label: "No-show", value: fmtInt.format(ADMIN_BOOKING_KPI.noshow) },
      {
        label: "Utilization",
        value: `${ADMIN_BOOKING_KPI.utilizationPct}%`,
        delta: ADMIN_BOOKING_KPI.deltaUtilizationPct,
      },
    ],
    [fmtInt]
  );

  const staffRows = React.useMemo(
    () =>
      ADMIN_BOOKING_STAFF.map((s) => ({
        Сотрудник: s.name,
        "Доступно (ч)": fmtInt.format(s.availH),
        "Занято (ч)": fmtInt.format(s.busyH),
        Utilization: `${s.util}%`,
        "No-show %": `${s.noshowPct}%`,
      })),
    [fmtInt]
  );

  const serviceRows = React.useMemo(
    () =>
      ADMIN_BOOKING_SERVICES.map((s) => ({
        Услуга: s.name,
        Создано: fmtInt.format(s.created),
        Состоялось: fmtInt.format(s.completed),
        Отменено: fmtInt.format(s.cancelled),
        "No-show": fmtInt.format(s.noshow),
      })),
    [fmtInt]
  );

  return (
    <div className="grid gap-6 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Хедер */}
      <div className="min-w-0">
        <ReportsHeader title="Бронирования и загрузка" />
      </div>

      {/* KPI */}
      <div className="min-w-0">
        <KpiRow items={kpiItems} />
      </div>

      {/* Тренд — горизонтальный скролл только внутри секции */}
      <section className="min-w-0 -mx-3 md:mx-0" aria-label="Тренд бронирований">
        <div className="px-3 md:px-0 overflow-x-auto">
          <TrendLine
            data={ADMIN_BOOKING_TREND}
            y1="created"
            y2="completed"
            onPointClick={(p) => router.push(`/demo/manager/booking?date=${p.date}`)}
          />
        </div>
      </section>

      {/* Тепловая карта + дефицитные дни (на мобиле в столбик) */}
      <section className="grid md:grid-cols-2 gap-4 min-w-0">
        <div className="min-w-0" aria-label="Тепловая карта загрузки">
          <HeatmapGrid data={ADMIN_BOOKING_HEAT} />
        </div>
        <div className="min-w-0" aria-label="Дефицитные дни">
          <BarStack
            data={ADMIN_DEFICIT_DAYS.map((d) => ({
              label: `${d.date} • ${d.location}`,
              value: 1,
            }))}
            onBarClick={(r) =>
              router.push(`/demo/admin/booking/schedules?week=${String(r.label).slice(0, 10)}`)
            }
          />
        </div>
      </section>

      {/* Таблицы — скролл внутри таблиц */}
      <section className="min-w-0 -mx-3 md:mx-0" aria-label="Загрузка по сотрудникам">
        <div className="px-3 md:px-0 overflow-x-auto">
          <TableBasic
            columns={["Сотрудник", "Доступно (ч)", "Занято (ч)", "Utilization", "No-show %"]}
            rows={staffRows}
          />
        </div>
      </section>

      <section className="min-w-0 -mx-3 md:mx-0" aria-label="Статусы по услугам">
        <div className="px-3 md:px-0 overflow-x-auto">
          <TableBasic
            columns={["Услуга", "Создано", "Состоялось", "Отменено", "No-show"]}
            rows={serviceRows}
          />
        </div>
      </section>
    </div>
  );
}