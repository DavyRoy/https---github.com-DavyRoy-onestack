// app/demo/admin/reports/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import ReportsHeader from "./components/ReportsHeader";
import KpiRow from "./components/KpiRow";
import TrendLine from "./components/TrendLine";
import BarStack from "./components/BarStack";
import DonutChart from "./components/DonutChart";
import HeatmapGrid from "./components/HeatmapGrid";
import Skeletons from "./components/Skeletons";

// данные
import {
  ADMIN_SALES_KPI,
  ADMIN_SALES_TREND,
  ADMIN_SALES_BY_LOC,
  ADMIN_SALES_BY_CATEGORY,
} from "@/app/demo/(shared)/reports/sales";
import { ADMIN_BOOKING_HEAT } from "@/app/demo/(shared)/reports/analytics";

type Ctx = {
  range: "today" | "7d" | "30d" | "qtr" | "custom";
  locations: string[];
  channel: "all" | "online" | "manager";
  currency: "RUB" | "KRW" | "USD";
  compare: boolean;
};

export default function AdminReportsOverviewPage() {
  const router = useRouter();

  // гладкий маунт для предотвращения дерганий SSR/CSR
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(t);
  }, []);

  const [ctx, setCtx] = React.useState<Ctx>({
    range: "30d",
    locations: [],
    channel: "all",
    currency: "RUB",
    compare: false,
  });

  // мемоизированные представления данных (чтобы не пересоздавать массивы)
  const kpiItems = React.useMemo(
    () => [
      {
        label: "Выручка",
        value: `${ADMIN_SALES_KPI.revenue.toLocaleString("ru-RU")} ${ctx.currency}`,
        delta: ADMIN_SALES_KPI.deltaRevenuePct,
        href: "/demo/admin/reports/sales?focus=revenue",
      },
      {
        label: "Заказы",
        value: ADMIN_SALES_KPI.orders.toLocaleString("ru-RU"),
        href: "/demo/admin/reports/sales?focus=orders",
      },
      {
        label: "Utilization",
        value: "72,4%",
        delta: 2.1,
        href: "/demo/admin/reports/booking?focus=utilization",
      },
      {
        label: "Отмены %",
        value: "5,0%",
        href: "/demo/admin/reports/booking?focus=cancel",
      },
      {
        label: "CRM конверсия",
        value: "36,4%",
        delta: -1.2,
        href: "/demo/admin/reports/crm?focus=funnel",
      },
      {
        label: "1-й ответ, мин",
        value: "28",
        href: "/demo/admin/reports/crm?focus=response",
      },
    ],
    [ctx.currency]
  );

  const barLocData = React.useMemo(
    () => ADMIN_SALES_BY_LOC.map((l) => ({ label: l.name, value: l.value })),
    []
  );

  const donutCatData = React.useMemo(
    () => ADMIN_SALES_BY_CATEGORY.map((c) => ({ label: c.label, value: c.value })),
    []
  );

  // лёгкий шимер до маунта
  if (!mounted) return <Skeletons />;

  return (
    <div className="grid gap-6 min-w-0">
      <ReportsHeader onChange={setCtx} />

      {/* KPI: адаптивная сетка, не распирает вширь */}
      <div className="min-w-0">
        <KpiRow items={kpiItems} />
      </div>

      {/* Ряд: тренд + распределение по локациям */}
      <div className="grid md:grid-cols-3 gap-4 min-w-0">
        <div className="md:col-span-2 min-w-0">
          {/* внутренний горизонтальный скролл, без влияния на страницу */}
          <div className="overflow-x-auto -mx-2 md:mx-0">
            <div className="min-w-[360px] px-2 md:px-0">
              <TrendLine
                data={ADMIN_SALES_TREND}
                y1="revenue"
                // если выбран "all", показываем сравнение revenue vs online
                y2={ctx.channel === "all" ? "online" : undefined}
                onPointClick={(p) => router.push(`/demo/manager/orders?date=${p.date}`)}
              />
            </div>
          </div>
        </div>

        <div className="min-w-0 overflow-x-auto -mx-2 md:mx-0">
          <div className="min-w-[320px] px-2 md:px-0">
            <BarStack
              data={barLocData}
              onBarClick={(r) =>
                router.push(
                  `/demo/admin/reports/sales?location=${encodeURIComponent(String(r.label))}`
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Ряд: категории + тепловая карта бронирований */}
      <div className="grid md:grid-cols-3 gap-4 min-w-0">
        <div className="min-w-0 overflow-x-auto -mx-2 md:mx-0">
          <div className="min-w-[320px] px-2 md:px-0">
            <DonutChart
              data={donutCatData}
              onSliceClick={(s) =>
                router.push(`/demo/admin/reports/sales?cat=${encodeURIComponent(s.label)}`)
              }
            />
          </div>
        </div>

        <div className="md:col-span-2 min-w-0 overflow-x-auto -mx-2 md:mx-0">
          <div className="min-w-[360px] px-2 md:px-0">
            <HeatmapGrid data={ADMIN_BOOKING_HEAT} />
          </div>
        </div>
      </div>
    </div>
  );
}