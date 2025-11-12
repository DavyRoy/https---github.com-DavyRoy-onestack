"use client";

import { useEffect, useMemo, useState } from "react";
import ReportsHeader from "../components/ReportsHeader";
import FiltersInline from "../components/FiltersInline";
import ExportMenu from "../components/ExportMenu";
import TrendLine from "../components/TrendLine";
import BarStack from "../components/BarStack";
import DonutChart from "../components/DonutChart";
import TableBasic from "../components/TableBasic";
import Skeletons from "../components/Skeletons";
import EmptyState from "../components/EmptyState";
import Link from "next/link";
import {
  SALES_SERIES_7D,
  SALES_SERIES_30D,
  SALES_CHANNELS,
  STATUS_DISTRIBUTION,
  TOP_SERVICES,
} from "./mockReportsSales";

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
type Focus = "revenue" | "orders";

export default function SalesReportPage() {
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState<Period>("7d");
  const [compare, setCompare] = useState(false);
  const [focus, setFocus] = useState<Focus>("revenue");

  useEffect(() => {
    setMounted(true);
    try {
      const p = localStorage.getItem("mgr_reports_sales_period") as Period | null;
      const c = localStorage.getItem("mgr_reports_sales_compare");
      const f = localStorage.getItem("mgr_reports_sales_focus") as Focus | null;
      if (p) setPeriod(p);
      if (c) setCompare(c === "1");
      if (f) setFocus(f);
    } catch {}
  }, []);
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("mgr_reports_sales_period", period);
      localStorage.setItem("mgr_reports_sales_compare", compare ? "1" : "0");
      localStorage.setItem("mgr_reports_sales_focus", focus);
    } catch {}
  }, [mounted, period, compare, focus]);

  const series =
    period === "7d" || period === "today" ? SALES_SERIES_7D : SALES_SERIES_30D;

  const sumRevenue = useMemo(
    () => series.reduce((s, d) => s + d.revenue, 0),
    [series]
  );
  const sumOrders = useMemo(
    () => series.reduce((s, d) => s + d.orders, 0),
    [series]
  );

  const KPI = [
    {
      title: "Выручка",
      value: sumRevenue,
      unit: "₽",
      href: "#",
      active: focus === "revenue",
      onClick: () => setFocus("revenue"),
    },
    {
      title: "Заказы",
      value: sumOrders,
      unit: "шт",
      href: "#",
      active: focus === "orders",
      onClick: () => setFocus("orders"),
    },
    {
      title: "Средний чек (AOV)",
      value: sumOrders ? Math.round(sumRevenue / sumOrders) : 0,
      unit: "₽",
      href: "/demo/manager/orders?sort=amount_desc",
    },
    {
      title: "Конверсия оплаты (демо)",
      value: 87,
      unit: "%",
      href: "/demo/manager/reports/sales?focus=orders",
    },
  ];

  return (
    <div className={T.page}>
      <header className={T.hero}>
        <ReportsHeader
          title="Отчёты • Продажи"
          subtitle="Выручка, заказы, каналы и товары/услуги"
          period={period}
          onPeriodChange={setPeriod}
          compare={compare}
          onCompareChange={setCompare}
          right={<ExportMenu />}
        />
      </header>

      <section className={T.card}>
        {/* мини-KPI */}
        {!mounted ? (
          <Skeletons kind="kpi" />
        ) : (
          <div className="grid gap-3 md:grid-cols-4">
            {KPI.map((k) => (
              <button
                key={k.title}
                onClick={(k as any).onClick}
                className={
                  "rounded-xl border border-white/15 p-3 text-left " +
                  (k.active
                    ? "bg-white text-black"
                    : "bg-white/[0.05] hover:bg-white/[0.08]")
                }
              >
                <div className={"text-xs " + (k.active ? "text-black/70" : "text-white/70")}>
                  {k.title}
                </div>
                <div className="mt-1 text-xl font-semibold tabular-nums">
                  {k.value.toLocaleString("ru-RU")} {k.unit}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Тренды */}
      <section className={T.card}>
        <div className="flex items-center justify-between">
          <div className={T.h}>Тренд по дням</div>
          <div className="flex gap-2">
            <button
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 data-[active=true]:bg-white data-[active=true]:text-black"
              data-active={focus === "revenue"}
              onClick={() => setFocus("revenue")}
            >
              Выручка
            </button>
            <button
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 data-[active=true]:bg-white data-[active=true]:text-black"
              data-active={focus === "orders"}
              onClick={() => setFocus("orders")}
            >
              Заказы
            </button>
          </div>
        </div>

        {!mounted ? (
          <Skeletons kind="charts" />
        ) : (
          <TrendLine
            data={series}
            xKey="date"
            y1Key={focus === "revenue" ? "revenue" : "orders"}
            y2Key={focus === "revenue" ? "orders" : "revenue"}
            label1={focus === "revenue" ? "Выручка" : "Заказы"}
            label2={focus === "revenue" ? "Заказы" : "Выручка"}
            onPointClick={(d) =>
              window.location.assign(
                `/demo/manager/orders?date=${encodeURIComponent(String((d as any).date))}`
              )
            }
          />
        )}
      </section>

      {/* Каналы + Доли статусов */}
      <section className={T.card}>
        {!mounted ? (
          <Skeletons kind="charts" />
        ) : (
          <div className="grid gap-4 md:grid-cols-[1fr_360px]">
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
            <DonutChart
              title="Статусы заказов"
              data={STATUS_DISTRIBUTION}
              centerLabel={`${STATUS_DISTRIBUTION.reduce((s, x) => s + x.value, 0)} шт`}
              onSliceClick={(s) =>
                window.location.assign(`/demo/manager/orders?status=${encodeURIComponent(s)}`)
              }
            />
          </div>
        )}
      </section>

      {/* ТОП по выручке */}
      <section className={T.card}>
        <div className={T.h}>ТОП-услуги/товары</div>
        {!mounted ? (
          <Skeletons kind="charts" />
        ) : TOP_SERVICES.length === 0 ? (
          <EmptyState text="Нет данных" />
        ) : (
          <TableBasic
            title="Лидеры продаж"
            columns={["Наименование", "Заказов", "Выручка"]}
            rows={TOP_SERVICES.map((s) => [
              {
                content: (
                  <Link
                    className="underline"
                    href={`/demo/manager/orders?q=${encodeURIComponent(s.title)}`}
                  >
                    {s.title}
                  </Link>
                ),
              },
              { content: String(s.orders), align: "right" as const },
              { content: s.revenue.toLocaleString("ru-RU") + " ₽", align: "right" as const },
            ])}
          />
        )}
      </section>
    </div>
  );
}