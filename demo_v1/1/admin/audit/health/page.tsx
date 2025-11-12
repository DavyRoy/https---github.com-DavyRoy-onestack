"use client";

import { useState } from "react";
// barrel-импорты
import HealthHeader from "../components/HealthHeader";
import SloTiles from "../components/SloTiles";
import ProvidersHealthTable from "../components/ProvidersHealthTable";
import WebhooksDeliveryStats from "../components/WebhooksDeliveryStats";
import IncidentsTable from "../components/IncidentsTable";

import {
  HEALTH_SLO,
  HEALTH_PROVIDERS,
  HEALTH_WEBHOOKS,
  HEALTH_INCIDENTS,
} from "@/app/demo/(shared)/audit/health";

export default function AdminAuditHealthPage() {
  const [ctx, setCtx] = useState({
    range: "24h",
    service: "all",
    status: "",
    location: "",
  });

  return (
    <div
      className="
        grid gap-6 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Заголовок */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 min-w-0">
        <h1 className="text-xl md:text-2xl font-semibold">Здоровье систем</h1>
      </header>

      {/* Фильтры */}
      <section className="min-w-0">
        <HealthHeader value={ctx} onChange={setCtx} />
      </section>

      {/* SLO тайлы */}
      <section className="min-w-0">
        <SloTiles items={HEALTH_SLO} />
      </section>

      {/* Табличные блоки: безопасный горизонтальный скролл только внутри */}
      <section className="grid lg:grid-cols-2 gap-6 min-w-0">
        <div className="-mx-3 md:mx-0 min-w-0">
          <div className="px-3 md:px-0">
            <ProvidersHealthTable rows={HEALTH_PROVIDERS} />
          </div>
        </div>
        <div className="-mx-3 md:mx-0 min-w-0">
          <div className="px-3 md:px-0">
            <WebhooksDeliveryStats rows={HEALTH_WEBHOOKS} />
          </div>
        </div>
      </section>

      {/* Инциденты (тоже таблица → в безопасный контейнер) */}
      <section className="-mx-3 md:mx-0 min-w-0">
        <div className="px-3 md:px-0">
          <IncidentsTable rows={HEALTH_INCIDENTS} />
        </div>
      </section>
    </div>
  );
}