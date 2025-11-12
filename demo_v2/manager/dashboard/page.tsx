"use client";

import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";

import KpiCards from "./components/KpiCards";
import SalesTrendChart from "./components/SalesTrendChart";
import StatusDistribution from "./components/StatusDistribution";
import TodayAgenda from "./components/TodayAgenda";
import PipelineMini from "./components/PipelineMini";
import BookingCalendarMini from "./components/BookingCalendarMini";
import RecentActivity from "./components/RecentActivity";
import RiskAlerts from "./components/RiskAlerts";
import QuickActions from "./components/QuickActions";

import {
  mockKpi,
  mockTrend7d,
  mockTrend30d,
  mockStatus,
  mockAgenda,
  mockPipeline,
  mockBookingWeek,
  mockActivity,
  mockRisks,
} from "./data/mockManagerDashboard";

export default function ManagerDashboardPage() {
  return (
    <div className={T.page}>
      {/* Header */}
      <header className={T.hero}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <nav
              className="flex items-center gap-1 text-xs text-white/70"
              aria-label="Хлебные крошки"
            >
              <Link
                href="/demo/manager"
                className="inline-flex items-center gap-1 hover:underline"
                prefetch={false}
              >
                <Home width={14} height={14} /> Менеджер
              </Link>
              <ChevronRight width={14} height={14} className="opacity-40" />
              <span className="text-white/80" aria-current="page">
                Дашборд
              </span>
            </nav>

            <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
              Дашборд менеджера
            </h1>
            <p className={T.dim + " text-sm mt-1"}>
              Новые заказы, лиды, записи и задачи на сегодня.
            </p>
          </div>
        </div>
      </header>

      {/* Row 1: KPI */}
      <section aria-label="Ключевые показатели">
        <KpiCards items={mockKpi} />
      </section>

      {/* Row 2: Тренд + Статусы */}
      <section aria-label="Тренды и статусы" className="grid gap-3 lg:grid-cols-[2fr_1fr]">
        <SalesTrendChart data7={mockTrend7d} data30={mockTrend30d} />
        <StatusDistribution data={mockStatus} />
      </section>

      {/* Row 3: Повестка + Воронка */}
      <section aria-label="Повестка и воронка" className="grid gap-3 lg:grid-cols-[2fr_1fr]">
        <TodayAgenda items={mockAgenda} />
        <PipelineMini stages={mockPipeline} />
      </section>

      {/* Row 4: Календарь + Активность */}
      <section aria-label="Календарь и активность" className="grid gap-3 lg:grid-cols-[1fr_1fr]">
        <BookingCalendarMini week={mockBookingWeek} />
        <RecentActivity list={mockActivity} />
      </section>

      {/* Row 5: Риски */}
      <section aria-label="Риски">
        <RiskAlerts items={mockRisks} />
      </section>

      {/* Footer: Быстрые действия */}
      <section aria-label="Быстрые действия">
        <QuickActions />
      </section>
    </div>
  );
}