// app/demo/admin/payments/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

/* UI-компоненты */
import AdminPaymentsHeader from "./components/AdminPaymentsHeader";
import KpiRow from "./components/KpiRow";
import TrendLine from "./components/TrendLine";
import DonutByMethod from "./components/DonutByMethod";
import ProviderHealth from "./components/ProviderHealth";
import WebhooksStatus from "./components/WebhooksStatus";
import ReconciliationBlock from "./components/ReconciliationBlock";
import AlertsPanel from "./components/AlertsPanel";
import ImportExportMenu from "./components/ImportExportMenu";

/* Демо-данные */
import {
  ADMIN_PAYMENTS_KPI,
  ADMIN_PAYMENTS_TREND,
  ADMIN_METHOD_SPLIT,
  ADMIN_PROVIDERS,
  ADMIN_WEBHOOKS,
  ADMIN_RECONCILIATION,
  ADMIN_ALERTS,
} from "@/app/demo/(shared)/payments";

export default function AdminPaymentsPage() {
  const router = useRouter();

  // Глобальный контекст страницы (диапазон, локация, валюта)
  const [ctx, setCtx] = React.useState({
    range: "30d",
    location: "all",
    currency: "RUB" as "RUB" | "KRW" | "USD",
  });

  return (
    <div className="grid gap-6 overflow-x-hidden">
      {/* Заголовок и фильтры контекста */}
      <AdminPaymentsHeader onChange={setCtx} />

      {/* Бар действий */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/50 min-w-0">
        <div className="min-w-0">
          <ImportExportMenu />
        </div>
        <div className="min-w-0">
          Контекст: {ctx.range}, {ctx.location}, {ctx.currency}
        </div>
      </div>

      {/* KPI */}
      <div className="min-w-0">
        <KpiRow
          revenue={ADMIN_PAYMENTS_KPI.revenue}
          successRate={ADMIN_PAYMENTS_KPI.successRate}
          successCount={ADMIN_PAYMENTS_KPI.successCount}
          failRate={ADMIN_PAYMENTS_KPI.failRate}
          refundsCount={ADMIN_PAYMENTS_KPI.refundsCount}
          refundsAmount={ADMIN_PAYMENTS_KPI.refundsAmount}
          latencyP95={ADMIN_PAYMENTS_KPI.latencyP95}
          currency={ctx.currency}
        />
      </div>

      {/* Тренд + распределение по методам */}
      <div className="grid md:grid-cols-3 gap-4 min-w-0">
        <div className="md:col-span-2 min-w-0">
          <TrendLine
            data={ADMIN_PAYMENTS_TREND}
            metric="paid"
            onPointClick={(p) => router.push(`/demo/manager/payments?date=${p.date}`)}
          />
        </div>
        <div className="min-w-0">
          <DonutByMethod data={ADMIN_METHOD_SPLIT} />
        </div>
      </div>

      {/* Провайдеры / Вебхуки / Алерты */}
      <div className="grid md:grid-cols-3 gap-4 min-w-0">
        <div className="min-w-0">
          <ProviderHealth providers={ADMIN_PROVIDERS} />
        </div>
        <div className="min-w-0">
          <WebhooksStatus {...ADMIN_WEBHOOKS} />
        </div>
        <div className="min-w-0">
          <AlertsPanel items={ADMIN_ALERTS} />
        </div>
      </div>

      {/* Блок сверки */}
      <div className="min-w-0">
        <ReconciliationBlock {...ADMIN_RECONCILIATION} />
      </div>
    </div>
  );
}