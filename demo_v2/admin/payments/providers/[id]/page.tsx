// app/demo/admin/payments/providers/[id]/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Единый источник данных и тип
import {
  ADMIN_PROVIDERS,
  type Provider,
} from "@/app/demo/(shared)/payments/data/mockAdminPaymentsMetrics";

import ProviderKeysForm from "../../components/ProviderKeysForm";
import RoutingRulesEditor from "../../components/RoutingRulesEditor";
import SettlementSchedule from "../../components/SettlementSchedule";
import AuditStrip from "../../components/AuditStrip";
// (опционально можно добавить панель симуляции платежа)
// import TestPaymentPanel from "../../components/TestPaymentPanel";

export default function ProviderCardPage() {
  const { id } = useParams<{ id: string }>();

  const prov: Provider | undefined = React.useMemo(
    () => ADMIN_PROVIDERS.find((p) => p.id === id),
    [id]
  );

  if (!prov) {
    return (
      <section className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-white/80">
        <div className="text-sm">Провайдер не найден.</div>
        <div className="mt-2">
          <Link
            href="/demo/admin/payments/providers"
            className="inline-flex items-center gap-1 underline underline-offset-2"
          >
            ← К списку провайдеров
          </Link>
        </div>
      </section>
    );
  }

  const statusBadge =
    prov.status === "ok"
      ? "bg-emerald-500/20 text-emerald-300"
      : prov.status === "degraded"
      ? "bg-amber-500/20 text-amber-300"
      : "bg-rose-500/20 text-rose-300";

  return (
    <div className="grid gap-6 overflow-x-hidden">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm text-white/60">
            <Link
              href="/demo/admin/payments/providers"
              className="hover:underline"
              aria-label="Назад к списку провайдеров"
            >
              ← Провайдеры
            </Link>
          </div>

          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight truncate">
              {prov.name}
            </h1>
            <span className={`px-2 py-0.5 rounded-md text-xs ${statusBadge}`}>
              {prov.status}
            </span>
          </div>

          <p className="mt-1 text-sm text-white/60">
            <span className="opacity-70">Методы:</span>{" "}
            <span className="break-words">{prov.methods.join(", ")}</span>
            <span className="opacity-40 mx-1">•</span>
            <span className="opacity-70">Валюты:</span>{" "}
            <span className="break-words">{prov.currencies.join(", ")}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex w-full md:w-auto flex-wrap gap-2">
          <button
            onClick={() => alert("Отключить/Включить (демо)")}
            className="w-full md:w-auto rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
          >
            Переключить
          </button>
          <button
            onClick={() => alert("Экспорт конфигурации (демо)")}
            className="w-full md:w-auto rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
          >
            Экспорт
          </button>
        </div>
      </header>

      {/* Status cards */}
      <section className="grid md:grid-cols-3 gap-4 min-w-0">
        <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 min-w-0">
          <div className="text-sm text-white/70 mb-2">Статус</div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md text-xs ${statusBadge}`}>
              {prov.status}
            </span>
            <div className="text-sm text-white/70">
              P95: <span className="text-white/85">{prov.latencyP95} ms</span>{" "}
              <span className="opacity-40">•</span>{" "}
              Fail: <span className="text-white/85">{prov.failRate}%</span>
            </div>
          </div>
          <div className="text-xs text-white/50 mt-2">
            Последняя проверка:{" "}
            {new Date(prov.lastCheckISO).toLocaleString("ru-RU")}
          </div>
        </div>

        <SettlementSchedule />

        <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 min-w-0">
          <div className="text-sm text-white/70 mb-2">Возможности</div>
          <div className="text-sm text-white/80 break-words">
            3DS • Apple Pay • Google Pay (демо)
          </div>
        </div>
      </section>

      {/* Forms / editors */}
      <ProviderKeysForm />
      <RoutingRulesEditor />

      {/* Доп: симулятор платежа (раскомментируйте импорт и блок ниже, если нужен)
      <TestPaymentPanel />
      */}

      <AuditStrip />
    </div>
  );
}