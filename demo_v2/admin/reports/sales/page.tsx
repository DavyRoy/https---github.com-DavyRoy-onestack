"use client";

import React from "react";
import { useRouter } from "next/navigation";

/* UI */
import ReportsHeader from "../components/ReportsHeader";
import FiltersInline from "../components/FiltersInline";
import KpiRow from "../components/KpiRow";
import TrendLine from "../components/TrendLine";
import BarStack from "../components/BarStack";
import DonutChart from "../components/DonutChart";
import TableBasic from "../components/TableBasic";

/* Данные */
import {
  ADMIN_SALES_KPI,
  ADMIN_SALES_TREND,
  ADMIN_SALES_BY_CATEGORY,
  ADMIN_SALES_TOP_ITEMS,
  ADMIN_SALES_TOP_CUSTOMERS,
} from "@/app/demo/(shared)/reports/sales";

export default function AdminReportsSalesPage() {
  const router = useRouter();

  // форматтеры — стабильные, не пересоздаются на каждый рендер
  const fmtInt = React.useMemo(
    () => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }),
    []
  );

  const kpiItems = React.useMemo(
    () => [
      { label: "Выручка", value: fmtInt.format(ADMIN_SALES_KPI.revenue) },
      { label: "Заказы", value: fmtInt.format(ADMIN_SALES_KPI.orders) },
      { label: "AOV", value: fmtInt.format(ADMIN_SALES_KPI.aov) },
      { label: "Повторные", value: `${ADMIN_SALES_KPI.repeatsPct}%` },
      { label: "Возвраты (шт.)", value: fmtInt.format(ADMIN_SALES_KPI.refundsCnt) },
      { label: "Возвраты (₽)", value: fmtInt.format(ADMIN_SALES_KPI.refundsAmount) },
    ],
    [fmtInt]
  );

  const topItemsRows = React.useMemo(
    () =>
      ADMIN_SALES_TOP_ITEMS.map((i) => ({
        Наименование: i.name,
        Заказы: fmtInt.format(i.orders),
        Выручка: fmtInt.format(i.revenue),
        AOV: fmtInt.format(i.aov),
      })),
    [fmtInt]
  );

  const topCustomersRows = React.useMemo(
    () =>
      ADMIN_SALES_TOP_CUSTOMERS.map((c) => ({
        Клиент: c.name,
        Заказы: fmtInt.format(c.orders),
        Выручка: fmtInt.format(c.revenue),
        LTV: fmtInt.format(c.ltv),
        "Последний заказ": c.last,
      })),
    [fmtInt]
  );

  return (
    <div className="grid gap-6 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Хедер (адаптивный) */}
      <div className="min-w-0">
        <ReportsHeader title="Продажи / Выручка" />
      </div>

      {/* Компактные фильтры */}
      <div className="min-w-0" aria-label="Фильтры отчёта по продажам">
        <FiltersInline />
      </div>

      {/* KPI */}
      <div className="min-w-0">
        <KpiRow items={kpiItems} />
      </div>

      {/* Тренд: горизонтальный скролл только внутри */}
      <section className="min-w-0 -mx-3 md:mx-0" aria-label="Тренд продаж">
        <div className="px-3 md:px-0 overflow-x-auto">
          <TrendLine
            data={ADMIN_SALES_TREND}
            y1="revenue"
            y2="orders"
            onPointClick={(p) => router.push(`/demo/manager/orders?date=${p.date}`)}
          />
        </div>
      </section>

      {/* Разрезы: категории (бар) + категории (donut) */}
      <section className="grid md:grid-cols-2 gap-4 min-w-0">
        <div className="min-w-0" aria-label="Разрез по категориям (бар)">
          <BarStack
            data={ADMIN_SALES_BY_CATEGORY}
            labelKey="label"
            valueKey="value"
            onBarClick={(r) =>
              router.push(`/demo/admin/reports/sales?cat=${encodeURIComponent(String(r.label))}`)
            }
          />
        </div>
        <div className="min-w-0" aria-label="Разрез по категориям (донат)">
          {/* защитный контейнер, чтобы легенда не распирала блок */}
          <div className="min-w-0 overflow-hidden">
            <DonutChart
              data={ADMIN_SALES_BY_CATEGORY.map((c) => ({ label: c.label, value: c.value }))}
            />
          </div>
        </div>
      </section>

      {/* ТОП позиции */}
      <section className="min-w-0 -mx-3 md:mx-0" aria-label="Топ товаров/услуг">
        <div className="px-3 md:px-0 overflow-x-auto">
          <TableBasic
            columns={["Наименование", "Заказы", "Выручка", "AOV"]}
            rows={topItemsRows}
          />
        </div>
      </section>

      {/* ТОП клиенты */}
      <section className="min-w-0 -mx-3 md:mx-0" aria-label="Топ клиентов">
        <div className="px-3 md:px-0 overflow-x-auto">
          <TableBasic
            columns={["Клиент", "Заказы", "Выручка", "LTV", "Последний заказ"]}
            rows={topCustomersRows}
          />
        </div>
      </section>
    </div>
  );
}