// app/demo/admin/payments/fees/[id]/page.tsx
"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ADMIN_FEES_PLANS } from "../../data/mockAdminFees";
import FeesMatrix from "../../components/FeesMatrix";
import AuditStrip from "../../components/AuditStrip";

export default function FeePlanCard() {
  const params = useParams<{ id: string }>();
  const plan = ADMIN_FEES_PLANS.find((p) => p.id === params.id);

  if (!plan) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-white/70">
        План не найден.
        <div className="mt-2">
          <Link href="/demo/admin/payments/fees" className="underline">
            ← К списку тарифов
          </Link>
        </div>
      </div>
    );
  }

  const fmtDate = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleString("ru-RU");
  };

  const statusBadge = plan.active
    ? "bg-emerald-500/20 text-emerald-300"
    : "bg-white/10 text-white/60";

  return (
    <div className="grid gap-6 max-w-[100vw] overflow-x-hidden px-3 md:px-0">
      {/* Хедер */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm text-white/60">
            <Link href="/demo/admin/payments/fees" className="hover:underline">
              ← Тарифы
            </Link>
          </div>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight break-words">
              {plan.name}
            </h1>
            <span className={`px-2 py-0.5 rounded-md text-xs ${statusBadge}`}>
              {plan.active ? "Активен" : "Отключен"}
            </span>
          </div>
          <p className="text-white/60 text-sm mt-1">
            Обновлён: <span className="text-white/80">{fmtDate(plan.updatedAt)}</span>
          </p>
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => alert("Сохранено (демо)")}
            className="flex-1 md:flex-none rounded-lg bg-white/90 text-black px-3 py-2 text-sm hover:bg-white transition"
          >
            Сохранить
          </button>
          <button
            onClick={() => alert("Архивировано (демо)")}
            className="flex-1 md:flex-none rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10 transition"
          >
            Архивировать
          </button>
        </div>
      </header>

      {/* Контент */}
      <section className="grid md:grid-cols-3 gap-4 min-w-0">
        {/* Матрица — скролл внутри таблицы, страница не распирается */}
        <div className="md:col-span-2 min-w-0">
          <FeesMatrix />
        </div>

        {/* Боковая панель (демо-настройки) */}
        <aside className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
          <div className="text-sm text-white/70 mb-2">Настройки плана (демо)</div>
          <div className="grid gap-2">
            <label className="text-sm">Приоритет</label>
            <input
              defaultValue={plan.id === "plan_default" ? 0 : 10}
              className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm"
            />
            <label className="text-sm">Период действия</label>
            <input
              defaultValue="2025-10-01 → 2025-12-31"
              className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm"
            />
          </div>
        </aside>
      </section>

      <AuditStrip />
    </div>
  );
}