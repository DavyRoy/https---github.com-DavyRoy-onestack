"use client";

import { useEffect, useMemo, useState } from "react";
import ReportsHeader from "../components/ReportsHeader";
import FiltersInline from "../components/FiltersInline";
import ExportMenu from "../components/ExportMenu";
import TrendLine from "../components/TrendLine";
import HeatmapGrid from "../components/HeatMapGrid";
import BarStack from "../components/BarStack";
import TableBasic from "../components/TableBasic";
import Skeletons from "../components/Skeletons";
import EmptyState from "../components/EmptyState";
import {
  BOOKING_SERIES_7D,
  BOOKING_SERIES_30D,
  HEATMAP_WEEK_BOOKING,
  CANCEL_NOSHOW_BY_REASON,
  STAFF_UTILIZATION,
  SERVICE_POPULARITY,
} from "../data/mockReportsBooking";

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
type Metric = "created" | "confirmed" | "completed";

export default function BookingReportPage() {
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState<Period>("7d");
  const [compare, setCompare] = useState(false);
  const [metric, setMetric] = useState<Metric>("created");

  useEffect(() => {
    setMounted(true);
    try {
      const p = localStorage.getItem("mgr_reports_booking_period") as Period | null;
      const c = localStorage.getItem("mgr_reports_booking_compare");
      const m = localStorage.getItem("mgr_reports_booking_metric") as Metric | null;
      if (p) setPeriod(p);
      if (c) setCompare(c === "1");
      if (m) setMetric(m);
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("mgr_reports_booking_period", period);
      localStorage.setItem("mgr_reports_booking_compare", compare ? "1" : "0");
      localStorage.setItem("mgr_reports_booking_metric", metric);
    } catch {}
  }, [mounted, period, compare, metric]);

  const series =
    period === "7d" || period === "today" ? BOOKING_SERIES_7D : BOOKING_SERIES_30D;

  const yKey =
    metric === "created" ? "created" : metric === "confirmed" ? "confirmed" : "completed";

  const total = useMemo(
    () => series.reduce((s, d) => s + (d as any)[yKey], 0),
    [series, yKey]
  );

  return (
    <div className={T.page}>
      <header className={T.hero}>
        <ReportsHeader
          title="Отчёты • Бронирования и загрузка"
          subtitle="Создано, подтверждено, состоялось; тепловая карта занятости"
          period={period}
          onPeriodChange={setPeriod}
          compare={compare}
          onCompareChange={setCompare}
          right={<ExportMenu />}
        />
      </header>

      <section className={T.card} aria-label="Динамика бронирований">
        <div className="flex items-center justify-between">
          <div className={T.h}>Динамика ({label(metric)})</div>
          <div className="flex gap-2">
            {(["created", "confirmed", "completed"] as Metric[]).map((m) => (
              <button
                key={m}
                type="button"
                className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 data-[active=true]:bg-white data-[active=true]:text-black"
                data-active={metric === m}
                onClick={() => setMetric(m)}
                aria-pressed={metric === m}
                aria-label={`Показать метрику: ${label(m)}`}
                title={label(m)}
              >
                {label(m)}
              </button>
            ))}
          </div>
        </div>

        {!mounted ? (
          <Skeletons kind="charts" />
        ) : (
          <TrendLine
            data={series}
            xKey="date"
            y1Key={yKey}
            y2Key="created"
            label1={label(metric)}
            label2="Создано"
            onPointClick={(d) => {
              window.location.assign(
                `/demo/manager/booking?date=${encodeURIComponent(String((d as any).date))}`
              );
            }}
          />
        )}
      </section>

      <section className={T.card} aria-label="Тепловая карта загрузки">
        <div className={T.h}>Тепловая карта загрузки</div>
        {!mounted ? (
          <Skeletons kind="heat" />
        ) : (
          <div className="mt-3">
            <HeatmapGrid
              labelsX={HEATMAP_WEEK_BOOKING.hours}
              labelsY={HEATMAP_WEEK_BOOKING.days}
              values={HEATMAP_WEEK_BOOKING.values}
              onCellClick={(d) =>
                window.location.assign(
                  `/demo/manager/calendar?view=day&date=${encodeURIComponent(d.date)}`
                )
              }
            />
          </div>
        )}
      </section>

      <section className={T.card} aria-label="Отмены и загрузка сотрудников">
        {!mounted ? (
          <Skeletons kind="charts" />
        ) : (
          <div className="grid gap-4 md:grid-cols-[1fr_360px]">
            <BarStack
              title="Отмены / No-show по причинам (демо)"
              categories={CANCEL_NOSHOW_BY_REASON.labels}
              series={CANCEL_NOSHOW_BY_REASON.values}
              onBarClick={() => {}}
            />
            <TableBasic
              title="Сотрудники — загрузка"
              columns={["Сотрудник", "Доступно (ч)", "Занято (ч)", "Utilization"]}
              rows={STAFF_UTILIZATION.map((r) => [
                { content: r.name },
                { content: String(r.freeH), align: "right" as const },
                { content: String(r.busyH), align: "right" as const },
                { content: r.util + " %", align: "right" as const },
              ])}
            />
          </div>
        )}
      </section>

      <section className={T.card} aria-label="Популярность услуг">
        <div className={T.h}>Популярность услуг</div>
        {!mounted ? (
          <Skeletons kind="charts" />
        ) : SERVICE_POPULARITY.length === 0 ? (
          <EmptyState text="Нет данных" />
        ) : (
          <TableBasic
            title="Услуги — сводка"
            columns={["Услуга", "Записей", "Состоялось", "Отменено", "No-show"]}
            rows={SERVICE_POPULARITY.map((s) => [
              { content: s.title },
              { content: String(s.created), align: "right" as const },
              { content: String(s.completed), align: "right" as const },
              { content: String(s.cancelled), align: "right" as const },
              { content: String(s.noshow), align: "right" as const },
            ])}
          />
        )}
      </section>
    </div>
  );
}

function label(m: Metric) {
  switch (m) {
    case "created":
      return "Создано";
    case "confirmed":
      return "Подтверждено";
    case "completed":
      return "Состоялось";
  }
}