// app/demo/admin/reports/page.tsx (или ваш текущий путь страницы)
"use client";

import React from "react";
import { useRouter } from "next/navigation";

import ReportsHeader from "./components/ReportsHeader";
import KpiRow from "./components/KpiRow";
import TrendLine from "./components/TrendLine";
import BarStack from "./components/BarStack";
import DonutChart from "./components/DonutChart";
import HeatmapGrid from "./components/HeatmapGrid";

// новые общие источники данных
import {
  ADMIN_SALES_KPI,
  ADMIN_SALES_TREND,
  ADMIN_SALES_BY_LOC,
  ADMIN_SALES_BY_CATEGORY,
} from "@/app/demo/(shared)/reports/sales";

import { ADMIN_BOOKING_HEAT } from "@/app/demo/(shared)/reports/analytics";

export default function AdminReportsOverviewPage() {
  const router = useRouter();
  const [ctx, setCtx] = React.useState({
    range: "30d",
    locations: [] as string[],
    channel: "all" as "all" | "online" | "manager",
    currency: "RUB" as "RUB" | "KRW" | "USD",
    compare: false,
  });

  return (
    <div className="grid gap-6">
      <ReportsHeader onChange={setCtx} />

      <KpiRow
        items={[
          {
            label: "Выручка",
            value: `${ADMIN_SALES_KPI.revenue.toLocaleString("ru-RU")} ${ctx.currency}`,
            delta: ADMIN_SALES_KPI.deltaRevenuePct,
            href: "/demo/admin/reports/sales?focus=revenue",
          },
          {
            label: "Заказы",
            value: ADMIN_SALES_KPI.orders.toString(),
            href: "/demo/admin/reports/sales?focus=orders",
          },
          {
            label: "Utilization",
            value: "72.4%",
            delta: 2.1,
            href: "/demo/admin/reports/booking?focus=utilization",
          },
          {
            label: "Отмены %",
            value: "5.0%",
            href: "/demo/admin/reports/booking?focus=cancel",
          },
          {
            label: "CRM конверсия",
            value: "36.4%",
            delta: -1.2,
            href: "/demo/admin/reports/crm?focus=funnel",
          },
          {
            label: "1-й ответ, мин",
            value: "28",
            href: "/demo/admin/reports/crm?focus=response",
          },
        ]}
      />

      {/* Ряд: тренд + распределение по локациям */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {/* страхуемся от горизонтального скролла на узких экранах */}
          <div className="overflow-x-auto -mx-2 md:mx-0">
            <div className="min-w-[360px] px-2 md:px-0">
              <TrendLine
                data={ADMIN_SALES_TREND}
                y1="revenue"
                y2={ctx.channel === "all" ? "online" : undefined}
                onPointClick={(p) => router.push(`/demo/manager/orders?date=${p.date}`)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto -mx-2 md:mx-0">
          <div className="min-w-[320px] px-2 md:px-0">
            <BarStack
              data={ADMIN_SALES_BY_LOC.map((l) => ({ label: l.name, value: l.value }))}
              onBarClick={(r) =>
                router.push(`/demo/admin/reports/sales?location=${encodeURIComponent(String(r.label))}`)
              }
            />
          </div>
        </div>
      </div>

      {/* Ряд: категории + тепловая карта бронирований */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="overflow-x-auto -mx-2 md:mx-0">
          <div className="min-w-[320px] px-2 md:px-0">
            <DonutChart
              data={ADMIN_SALES_BY_CATEGORY.map((c) => ({ label: c.label, value: c.value }))}
              onSliceClick={(s) =>
                router.push(`/demo/admin/reports/sales?cat=${encodeURIComponent(s.label)}`)
              }
            />
          </div>
        </div>

        <div className="md:col-span-2 overflow-x-auto -mx-2 md:mx-0">
          <div className="min-w-[360px] px-2 md:px-0">
            <HeatmapGrid data={ADMIN_BOOKING_HEAT} />
          </div>
        </div>
      </div>
    </div>
  );
}