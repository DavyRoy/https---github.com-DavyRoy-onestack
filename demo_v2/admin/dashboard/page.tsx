// app/demo/admin/dashboard/page.tsx
// SERVER COMPONENT: минимум клиентского JS, стримим секции с фоллбэками.
// Контракт параметров единый для Admin/Manager/User.

import { Suspense } from "react";
import Link from "next/link";

// Компоненты (есть в проекте)
import OrgKpiCards from "./components/OrgKpiCards";
import RevenueTrend from "./components/RevenueTrend";
import ChannelMix from "./components/ChannelMix";
import LocationHeat from "./components/LocationHeat";
import ServiceCategoryBars from "./components/ServiceCategoryBars";
import OpsHealth from "./components/OpsHealth";
import SystemsStatus from "./components/SystemsStatus";
import AccessOverview from "./components/AccessOverview";
import CompliancePanel from "./components/CompliancePanel";
import RecentAudit from "./components/RecentAudit";
import AlertsPanel from "./components/AlertsPanel";
import QuickAdminActions from "./components/QuickAdminActions";
import Skeletons from "./components/Skeletons";

// Клиентский остров фильтров
import DashboardFilters from "./components/DashboardFilters.client";

// ===== Общий контракт параметров (советуются к выносу в lib/dashboard/params.ts) =====
export type DashboardPeriod = "7d" | "30d" | "q" | "y";
export type DashboardChannel = "all" | "online" | "manager";
export type DashboardLocation = "all" | "center" | "south" | "north";
export type DashboardCurrency = "RUB" | "KRW" | "USD";

export type DashboardParams = {
  period: DashboardPeriod;
  channel: DashboardChannel;
  location: DashboardLocation;
  currency: DashboardCurrency;
};

// Дефолты — одинаковые для всех ролей
export const DEFAULT_PARAMS: DashboardParams = {
  period: "30d",
  channel: "all",
  location: "all",
  currency: "RUB",
};

// Набор классов (единый визуальный контракт)
const T = {
  page:
    // контейнер с безопасными отступами, белым текстом и управлением переполнением
    "text-white mx-auto w-full max-w-[1400px] px-3 md:px-4 lg:px-6 py-4 md:py-6 grid gap-6 md:gap-6 xl:gap-8 overflow-x-hidden",
  hero:
    "relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-white/5 to-white/10 p-4 md:p-6 backdrop-blur-sm",
  section:
    "rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 lg:p-5 backdrop-blur-sm overflow-hidden",
  dim: "text-white/70",
  btn: "rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
};

// Утилита валидации enum — защищаемся от произвольных URL-параметров
function pickEnum<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
  return (value && (allowed as readonly string[]).includes(value)) ? (value as T) : fallback;
}

// Нормализация параметров из URL
function parseParams(sp: ReadonlyURLSearchParams): DashboardParams {
  const period = pickEnum(sp.get("period"), ["7d", "30d", "q", "y"] as const, DEFAULT_PARAMS.period);
  const channel = pickEnum(sp.get("channel"), ["all", "online", "manager"] as const, DEFAULT_PARAMS.channel);
  const location = pickEnum(sp.get("location"), ["all", "center", "south", "north"] as const, DEFAULT_PARAMS.location);
  const currency = pickEnum(sp.get("currency"), ["RUB", "KRW", "USD"] as const, DEFAULT_PARAMS.currency);
  return { period, channel, location, currency };
}

export const revalidate = 0; // Живые панели: не кэшируем целиком страницу

export default function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  // Серверный parse — без клиента
  const sp = new URLSearchParams(
    Object.entries(searchParams).flatMap(([k, v]) =>
      Array.isArray(v) ? v.map((x) => [k, x]) : v ? [[k, v]] : [],
    ),
  );
  const params = parseParams(sp);

  return (
    <main className={T.page} aria-labelledby="admin-dashboard-h1">
      {/* Skip-link для доступности на больших экранах/ТВ */}
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-black">
        Перейти к содержимому
      </a>

      {/* HERO */}
      <header className={T.hero}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 id="admin-dashboard-h1" className="text-2xl md:text-3xl font-semibold tracking-tight">
              Дашборд администратора
            </h1>
            <p className={"mt-1 text-sm " + T.dim}>
              Метрики компании, статусы систем, доступы и риски
            </p>
          </div>
          <Link
            href="/demo/manager/reports"
            className={T.btn}
            prefetch={false}
            aria-label="Открыть отчёты в разделе менеджера"
          >
            Открыть отчёты
          </Link>
        </div>

        {/* Фильтры — клиентский остров, синхронизируемся с URL */}
        <div className="mt-4">
          <DashboardFilters initialParams={params} />
        </div>
      </header>

      {/* CONTENT START */}
      <div id="content" />

      {/* Ряд 1 — KPI */}
      <section className={T.section} aria-label="KPI организации">
        <Suspense fallback={<Skeletons.KpiCards />}>
          <OrgKpiCards
            period={params.period}
            channel={params.channel}
            location={params.location}
            currency={params.currency}
          />
        </Suspense>
      </section>

      {/* Ряд 2 — Выручка + Каналы (12-колоночная сетка для XL/TV) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className={T.section + " lg:col-span-8"}>
          <Suspense fallback={<Skeletons.CardLines className="h-[280px]" />}>
            <RevenueTrend
              period={params.period}
              channel={params.channel}
              location={params.location}
              currency={params.currency}
            />
          </Suspense>
        </div>
        <div className={T.section + " lg:col-span-4"}>
          <Suspense fallback={<Skeletons.CardDonut />}>
            <ChannelMix period={params.period} channel={params.channel} location={params.location} />
          </Suspense>
        </div>
      </section>

      {/* Ряд 3 — Гео + Категории услуг */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className={T.section + " lg:col-span-8"}>
          <Suspense fallback={<Skeletons.CardHeat className="h-[320px]" />}>
            <LocationHeat period={params.period} channel={params.channel} />
          </Suspense>
        </div>
        <div className={T.section + " lg:col-span-4"}>
          <Suspense fallback={<Skeletons.CardBars />}>
            <ServiceCategoryBars period={params.period} channel={params.channel} />
          </Suspense>
        </div>
      </section>

      {/* Ряд 4 — Операционное здоровье + Системы */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className={T.section + " lg:col-span-6"}>
          <Suspense fallback={<Skeletons.CardTiles />}>
            <OpsHealth period={params.period} />
          </Suspense>
        </div>
        <div className={T.section + " lg:col-span-6"}>
          <Suspense fallback={<Skeletons.CardTiles />}>
            <SystemsStatus />
          </Suspense>
        </div>
      </section>

      {/* Ряд 5 — Доступы + Комплаенс */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className={T.section + " lg:col-span-6"}>
          <Suspense fallback={<Skeletons.CardTable />}>
            <AccessOverview />
          </Suspense>
        </div>
        <div className={T.section + " lg:col-span-6"}>
          <Suspense fallback={<Skeletons.CardList />}>
            <CompliancePanel />
          </Suspense>
        </div>
      </section>

      {/* Ряд 6 — Аудит */}
      <section className={T.section}>
        <Suspense fallback={<Skeletons.CardTable />}>
          <RecentAudit />
        </Suspense>
      </section>

      {/* Подвал — Алерты + Быстрые действия */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className={T.section + " lg:col-span-8"}>
          <Suspense fallback={<Skeletons.CardList />}>
            <AlertsPanel />
          </Suspense>
        </div>
        <div className={T.section + " lg:col-span-4"}>
          <Suspense fallback={<Skeletons.CardActions />}>
            <QuickAdminActions />
          </Suspense>
        </div>
      </section>
    </main>
  );
}