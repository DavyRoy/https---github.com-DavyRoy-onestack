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

  return (
    <div
      className="
        grid gap-6
        w-full max-w-full min-w-0
        overflow-x-hidden
      "
    >
      {/* Хедер (адаптивный) */}
      <div className="min-w-0">
        <ReportsHeader title="Продажи / Выручка" />
      </div>

      {/* Компактные фильтры — не растягивают ширину */}
      <div className="min-w-0">
        <FiltersInline />
      </div>

      {/* KPI — карточки сами адаптивные */}
      <div className="min-w-0">
        <KpiRow
          items={[
            { label: "Выручка", value: ADMIN_SALES_KPI.revenue.toLocaleString("ru-RU") },
            { label: "Заказы", value: ADMIN_SALES_KPI.orders.toString() },
            { label: "AOV", value: ADMIN_SALES_KPI.aov.toLocaleString("ru-RU") },
            { label: "Повторные", value: `${ADMIN_SALES_KPI.repeatsPct}%` },
            { label: "Возвраты (шт.)", value: String(ADMIN_SALES_KPI.refundsCnt) },
            { label: "Возвраты (₽)", value: ADMIN_SALES_KPI.refundsAmount.toLocaleString("ru-RU") },
          ]}
        />
      </div>

      {/* Тренд: горизонтальный скролл только внутри блока */}
      <section className="min-w-0 -mx-3 md:mx-0">
        <div className="px-3 md:px-0 overflow-x-auto">
          <TrendLine
            data={ADMIN_SALES_TREND}
            y1="revenue"
            y2="orders"
            onPointClick={(p) => router.push(`/demo/manager/orders?date=${p.date}`)}
          />
        </div>
      </section>

      {/* Разрезы: BarStack + Donut. На мобиле — одна колонка. */}
      <section className="grid md:grid-cols-2 gap-4 min-w-0">
        <div className="min-w-0">
          <BarStack
            data={ADMIN_SALES_BY_CATEGORY}
            labelKey="label"
            valueKey="value"
            onBarClick={(r) =>
              router.push(`/demo/admin/reports/sales?cat=${encodeURIComponent(String(r.label))}`)
            }
          />
        </div>
        <div className="min-w-0">
          {/* страхуемся от переполнения легенды */}
          <div className="min-w-0 overflow-hidden">
            <DonutChart
              data={ADMIN_SALES_BY_CATEGORY.map((c) => ({ label: c.label, value: c.value }))}
            />
          </div>
        </div>
      </section>

      {/* Таблицы: скролл только внутри таблиц */}
      <section className="min-w-0 -mx-3 md:mx-0">
        <div className="px-3 md:px-0 overflow-x-auto">
          <TableBasic
            columns={["Наименование", "Заказы", "Выручка", "AOV"]}
            rows={ADMIN_SALES_TOP_ITEMS.map((i) => ({
              Наименование: i.name,
              Заказы: i.orders,
              Выручка: i.revenue.toLocaleString("ru-RU"),
              AOV: i.aov.toLocaleString("ru-RU"),
            }))}
          />
        </div>
      </section>

      <section className="min-w-0 -mx-3 md:mx-0">
        <div className="px-3 md:px-0 overflow-x-auto">
          <TableBasic
            columns={["Клиент", "Заказы", "Выручка", "LTV", "Последний заказ"]}
            rows={ADMIN_SALES_TOP_CUSTOMERS.map((c) => ({
              Клиент: c.name,
              Заказы: c.orders,
              Выручка: c.revenue.toLocaleString("ru-RU"),
              LTV: c.ltv.toLocaleString("ru-RU"),
              "Последний заказ": c.last,
            }))}
          />
        </div>
      </section>
    </div>
  );
}