"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ReportsHeader from "./components/ReportsHeader";
import KpiRow from "./components/KpiRow";
import TrendLine from "./components/TrendLine";
import BarStack from "./components/BarStack";
import DonutChart from "./components/DonutChart";
import HeatmapGrid from "./components/HeatMapGrid";
import TableBasic from "./components/TableBasic";
import FiltersInline from "./components/FiltersInline";
import ExportMenu from "./components/ExportMenu";
import EmptyState from "./components/EmptyState";
import Skeletons from "./components/Skeletons";
import {
  SALES_SERIES_7D,
  SALES_SERIES_30D,
  SALES_CHANNELS,
  TOP_SERVICES,
  STATUS_DISTRIBUTION,
  HEATMAP_WEEK,
  KPI_BASE,
} from "./data/mockReportsSales";

const T = {
  page: "grid gap-6",
  hero:
    "relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-white/5 to-white/10 p-4 md:p-6 backdrop-blur-sm",
  card:
    "rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 backdrop-blur-sm",
  h: "text-base font-semibold",
  dim: "text-white/70",
};

type Period = "today" | "7d" | "30d" | "quarter" | "year" | "custom";

export default function ReportsOverviewPage() {
  const [mounted, setMounted] = useState(false);

  // — период и compare (сохраняем в LS) —
  const [period, setPeriod] = useState<Period>("7d");
  const [compare, setCompare] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const p = localStorage.getItem("mgr_reports_period") as Period | null;
      const c = localStorage.getItem("mgr_reports_compare");
      if (p) setPeriod(p);
      if (c) setCompare(c === "1");
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("mgr_reports_period", period);
      localStorage.setItem("mgr_reports_compare", compare ? "1" : "0");
    } catch {}
  }, [mounted, period, compare]);

  // — данные под период —
  const series =
    period === "7d" || period === "today" ? SALES_SERIES_7D : SALES_SERIES_30D;

  // KPI c ∆% (демо-формулы детерминированы)
  const kpis = useMemo(() => {
    const sumRevenue = series.reduce((s, d) => s + d.revenue, 0);
    const sumOrders = series.reduce((s, d) => s + d.orders, 0);
    const util =
      HEATMAP_WEEK.values.reduce((s, v) => s + v, 0) /
      HEATMAP_WEEK.values.length; // средняя заполненность

    const prevFactor = period === "7d" ? 0.92 : 0.95; // детерминированная «прошлая база»
    const prevRevenue = Math.round(sumRevenue * prevFactor);
    const prevOrders = Math.round(sumOrders * prevFactor);
    const prevUtil = Math.round(util * prevFactor);

    const delta = (cur: number, prev: number) =>
      prev === 0 ? 0 : Math.round(((cur - prev) / prev) * 100);

    return [
      {
        title: "Выручка",
        value: sumRevenue,
        unit: "₽",
        delta: compare ? delta(sumRevenue, prevRevenue) : undefined,
        href: "/demo/manager/reports/sales?focus=revenue",
      },
      {
        title: "Заказы",
        value: sumOrders,
        unit: "шт",
        delta: compare ? delta(sumOrders, prevOrders) : undefined,
        href: "/demo/manager/reports/sales?focus=orders",
      },
      {
        title: "Заполняемость",
        value: Math.round(util),
        unit: "%",
        delta: compare ? delta(util, prevUtil) : undefined,
        href: "/demo/manager/reports/booking?focus=utilization",
      },
      {
        title: "CRM конверсия",
        value: KPI_BASE.crmConv,
        unit: "%",
        delta: compare ? 2 : undefined, // демо
        href: "/demo/manager/reports/crm?focus=funnel",
      },
    ];
  }, [series, period, compare]);

  return (
    <div className={T.page}>
      <header className={T.hero}>
        <ReportsHeader
          title="Отчёты"
          subtitle="KPI, тренды, состав и нагрузка по периоду"
          period={period}
          onPeriodChange={setPeriod}
          compare={compare}
          onCompareChange={setCompare}
          right={<ExportMenu />}
        />
      </header>

      {/* Inline-фильтры (демо) */}
      <section className={T.card}>
        <FiltersInline />
      </section>

      {/* KPIs */}
      <section className={T.card}>
        {!mounted ? <Skeletons kind="kpi" /> : <KpiRow items={kpis} />}
      </section>

      {/* Тренды */}
      <section className={T.card}>
        <div className="flex items-center justify-between">
          <div className={T.h}>Тренды</div>
          <div className={"text-sm " + T.dim}>
            Период: <b>{periodLabel(period)}</b>
          </div>
        </div>
        {!mounted ? (
          <Skeletons kind="charts" />
        ) : (
          <div className="mt-3 grid gap-4 md:grid-cols-[1fr_360px]">
            <TrendLine
              data={series}
              xKey="date"
              y1Key="revenue"
              y2Key="orders"
              label1="Выручка"
              label2="Заказы"
              onPointClick={(d) =>
                window.location.assign(
                  `/demo/manager/orders?date=${encodeURIComponent(
                    String((d as any).date)
                  )}`
                )
              }
            />
            <BarStack
              title="Выручка по каналам"
              categories={SALES_CHANNELS.labels}
              series={SALES_CHANNELS.values}
              onBarClick={(cat) =>
                window.location.assign(
                  `/demo/manager/orders?channel=${encodeURIComponent(cat)}`
                )
              }
            />
          </div>
        )}
      </section>

      {/* Состав */}
      <section className={T.card}>
        <div className={T.h}>Состав</div>
        {!mounted ? (
          <Skeletons kind="charts" />
        ) : (
          <div className="mt-3 grid gap-4 md:grid-cols-[360px_1fr]">
            <DonutChart
              title="Заказы по статусам"
              data={STATUS_DISTRIBUTION}
              centerLabel={`${
                STATUS_DISTRIBUTION.reduce((s, x) => s + x.value, 0) ?? 0
              } шт`}
              onSliceClick={(s) =>
                window.location.assign(
                  `/demo/manager/orders?status=${encodeURIComponent(s)}`
                )
              }
            />
            <TableBasic
              title="ТОП-услуги по выручке"
              columns={["Услуга", "Заказов", "Выручка"]}
              rows={TOP_SERVICES.map((s) => [
                {
                  content: (
                    <Link
                      className="underline"
                      href={`/demo/manager/orders?q=${encodeURIComponent(
                        s.title
                      )}`}
                    >
                      {s.title}
                    </Link>
                  ),
                },
                { content: s.orders.toString(), align: "right" as const },
                { content: fmtRUB(s.revenue) + " ₽", align: "right" as const },
              ])}
            />
          </div>
        )}
      </section>

      {/* Нагрузка */}
      <section className={T.card}>
        <div className={T.h}>Нагрузка</div>
        {!mounted ? (
          <Skeletons kind="heat" />
        ) : HEATMAP_WEEK.values.length === 0 ? (
          <EmptyState text="Нет данных по загрузке за выбранный период" />
        ) : (
          <div className="mt-3">
            <HeatmapGrid
              labelsX={HEATMAP_WEEK.hours}
              labelsY={HEATMAP_WEEK.days}
              values={HEATMAP_WEEK.values}
              onCellClick={(d) =>
                window.location.assign(
                  `/demo/manager/calendar?view=day&date=${encodeURIComponent(
                    d.date
                  )}`
                )
              }
            />
          </div>
        )}
      </section>
    </div>
  );
}

function periodLabel(p: Period) {
  switch (p) {
    case "today":
      return "Сегодня";
    case "7d":
      return "7 дней";
    case "30d":
      return "30 дней";
    case "quarter":
      return "Квартал";
    case "year":
      return "Год";
    default:
      return "Custom";
  }
}

const fmtRUB = (n: number) => n.toLocaleString("ru-RU");