// app/demo/admin/dashboard/page.tsx
// SERVER COMPONENT: стримим разделы с фоллбэками, минимум клиентского JS.
// Этот файл «общий по контракту» для ролей: параметры и их значения должны совпадать у Admin/Manager/User.

import { Suspense } from "react";
import Link from "next/link";

// ⚠️ Эти компоненты у тебя уже есть. Они могут быть клиентскими — ок.
// Мы лишь передаём им параметры и даём скелетоны через Suspense.
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

// Новый — клиентский остров с фильтрами (ниже файл)
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

// Дефолты — одинаковые для всех ролей (Admin/Manager/User)
export const DEFAULT_PARAMS: DashboardParams = {
  period: "30d",
  channel: "all",
  location: "all",
  currency: "RUB",
};

// Набор классов
const T = {
  page: "grid gap-6",
  hero:
    "relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-white/5 to-white/10 p-4 md:p-6 backdrop-blur-sm",
  section:
    "rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 backdrop-blur-sm",
  dim: "text-white/70",
  btn: "rounded-xl bg-white px-4 py-2 text-sm text-black hover:bg-white/90",
};

// Вытаскиваем и нормализуем параметры из URL (советуются к выносу в lib/dashboard/params.ts)
function parseParams(sp: ReadonlyURLSearchParams): DashboardParams {
  const period = (sp.get("period") ?? DEFAULT_PARAMS.period) as DashboardPeriod;
  const channel = (sp.get("channel") ?? DEFAULT_PARAMS.channel) as DashboardChannel;
  const location = (sp.get("location") ?? DEFAULT_PARAMS.location) as DashboardLocation;
  const currency = (sp.get("currency") ?? DEFAULT_PARAMS.currency) as DashboardCurrency;
  return { period, channel, location, currency };
}

export const revalidate = 0; // «живые» панели: не кэшируем страницу целиком (компоненты внутри могут кэшироваться точечно)

export default function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  // Внимание: это серверный parse — без клиента.
  const sp = new URLSearchParams(Object.entries(searchParams).flatMap(([k, v]) => (Array.isArray(v) ? v.map((x) => [k, x]) : v ? [[k, v]] : [])));
  const params = parseParams(sp);

  return (
    <div className={T.page}>
      <header className={T.hero}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Дашборд администратора
            </h1>
            <p className={"mt-1 text-sm " + T.dim}>
              Метрики компании, статусы систем, доступы и риски
            </p>
          </div>
          <Link href="/demo/manager/reports" className={T.btn} prefetch={false}>
            Открыть отчёты
          </Link>
        </div>

        {/* Фильтры — клиентский остров, аккуратно синхронизируемся с URL */}
        <div className="mt-4">
          <DashboardFilters initialParams={params} />
        </div>
      </header>

      {/* Ряд 1 — KPI */}
      <Suspense fallback={<Skeletons.KpiCards />}>
        <OrgKpiCards
          period={params.period}
          channel={params.channel}
          location={params.location}
          currency={params.currency}
        />
      </Suspense>

      {/* Ряд 2 — Выручка + Каналы */}
      <div className="grid gap-3 md:grid-cols-3">
        <Suspense fallback={<Skeletons.CardLines className="md:col-span-2" />}>
          <RevenueTrend
            className="md:col-span-2"
            period={params.period}
            channel={params.channel}
            location={params.location}
            currency={params.currency}
          />
        </Suspense>

        <Suspense fallback={<Skeletons.CardDonut />}>
          <ChannelMix period={params.period} channel={params.channel} location={params.location} />
        </Suspense>
      </div>

      {/* Ряд 3 — Гео + Категории услуг */}
      <div className="grid gap-3 md:grid-cols-3">
        <Suspense fallback={<Skeletons.CardHeat className="md:col-span-2" />}>
          <LocationHeat className="md:col-span-2" period={params.period} channel={params.channel} />
        </Suspense>

        <Suspense fallback={<Skeletons.CardBars />}>
          <ServiceCategoryBars period={params.period} channel={params.channel} />
        </Suspense>
      </div>

      {/* Ряд 4 — Операционное здоровье + Системы */}
      <div className="grid gap-3 md:grid-cols-2">
        <Suspense fallback={<Skeletons.CardTiles />}>
          <OpsHealth period={params.period} />
        </Suspense>

        <Suspense fallback={<Skeletons.CardTiles />}>
          <SystemsStatus />
        </Suspense>
      </div>

      {/* Ряд 5 — Доступы + Комплаенс */}
      <div className="grid gap-3 md:grid-cols-2">
        <Suspense fallback={<Skeletons.CardTable />}>
          <AccessOverview />
        </Suspense>

        <Suspense fallback={<Skeletons.CardList />}>
          <CompliancePanel />
        </Suspense>
      </div>

      {/* Ряд 6 — Аудит */}
      <Suspense fallback={<Skeletons.CardTable />}>
        <RecentAudit />
      </Suspense>

      {/* Подвал — Алерты + Быстрые действия */}
      <div className="grid gap-3 md:grid-cols-3">
        <Suspense fallback={<Skeletons.CardList className="md:col-span-2" />}>
          <AlertsPanel className="md:col-span-2" />
        </Suspense>

        <Suspense fallback={<Skeletons.CardActions />}>
          <QuickAdminActions />
        </Suspense>
      </div>
    </div>
  );
}