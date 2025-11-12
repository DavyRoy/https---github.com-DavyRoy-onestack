"use client";

import { useMemo, useState } from "react";

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

/** Контекст фильтров страницы «Здоровье систем» */
type HealthCtx = {
  range: "1h" | "24h" | "7d" | "30d";
  service: "all" | "payments" | "integrations" | "messaging" | "webhooks";
  status: "" | "ok" | "degraded" | "down";
  /** Строка для поиска по локации (в демо провайдеры локацию не содержат — фильтр влияет на инциденты) */
  location: string;
};

export default function AdminAuditHealthPage() {
  const [ctx, setCtx] = useState<HealthCtx>({
    range: "24h",
    service: "all",
    status: "",
    location: "",
  });

  /** Провайдеры — применяем доступные фильтры (service, status) */
  const filteredProviders = useMemo(() => {
    return HEALTH_PROVIDERS.filter((p) => {
      const byService = ctx.service === "all" ? true : p.kind === ctx.service;
      const byStatus = ctx.status ? p.status === ctx.status : true;
      return byService && byStatus;
    });
  }, [ctx.service, ctx.status]);

  /**
   * Доставки вебхуков — в демо нет статуса/сервиса, поэтому фильтрация по service/status не применяется.
   * Если понадобится — можно прокинуть дополнительные поля и фильтровать аналогично провайдерам.
   */
  const filteredWebhooks = useMemo(() => HEALTH_WEBHOOKS, []);

  /**
   * Инциденты — пытаемся применить статус/сервис/локацию, если такие поля присутствуют в моках.
   * В демо-данных возможны поля: status, service, location (или подобные).
   * Фильтрация сделана «мягко», чтобы не падать на неполных данных.
   */
  const filteredIncidents = useMemo(() => {
    return HEALTH_INCIDENTS.filter((i: any) => {
      const byStatus = ctx.status ? i?.status === ctx.status : true;
      const byService = ctx.service === "all" ? true : i?.service === ctx.service;
      const byLocation = ctx.location
        ? String(i?.location ?? "")
            .toLowerCase()
            .includes(ctx.location.toLowerCase())
        : true;
      // range в демо не применяем (нет timestamp), но легко добавить проверку по i.ts
      return byStatus && byService && byLocation;
    });
  }, [ctx.status, ctx.service, ctx.location]);

  return (
    <div
      className="
        grid gap-6 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Заголовок */}
      <header
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 min-w-0"
        aria-labelledby="health-title"
      >
        <div className="min-w-0">
          <h1 id="health-title" className="text-xl md:text-2xl font-semibold">
            Здоровье систем
          </h1>
          <p className="text-sm text-white/70 mt-1">
            SLO, статусы интеграций, доставляемость вебхуков и инциденты.
          </p>
        </div>
      </header>

      {/* Фильтры */}
      <section className="min-w-0" aria-label="Фильтры">
        <HealthHeader value={ctx} onChange={setCtx} />
        {/* Крошечная сводка применённых фильтров */}
        <div className="mt-2 text-xs text-white/50">
          Период: <b>{ctx.range}</b>
          {ctx.service !== "all" && (
            <>
              {" "}
              • Сервис: <b>{ctx.service}</b>
            </>
          )}
          {!!ctx.status && (
            <>
              {" "}
              • Статус: <b>{ctx.status}</b>
            </>
          )}
          {ctx.location && (
            <>
              {" "}
              • Локация: <b className="break-all">{ctx.location}</b>
            </>
          )}
        </div>
      </section>

      {/* SLO тайлы */}
      <section className="min-w-0" aria-label="SLO">
        <SloTiles items={HEALTH_SLO} />
      </section>

      {/* Табличные блоки: безопасный горизонтальный скролл только внутри */}
      <section className="grid lg:grid-cols-2 gap-6 min-w-0">
        <div className="-mx-3 md:mx-0 min-w-0">
          <div className="px-3 md:px-0">
            <ProvidersHealthTable rows={filteredProviders} />
          </div>
        </div>
        <div className="-mx-3 md:mx-0 min-w-0">
          <div className="px-3 md:px-0">
            <WebhooksDeliveryStats rows={filteredWebhooks} />
          </div>
        </div>
      </section>

      {/* Инциденты (тоже таблица → в безопасный контейнер) */}
      <section className="-mx-3 md:mx-0 min-w-0" aria-label="Инциденты">
        <div className="px-3 md:px-0">
          <IncidentsTable rows={filteredIncidents} />
        </div>
      </section>
    </div>
  );
}