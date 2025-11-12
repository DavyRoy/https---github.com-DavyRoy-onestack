"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ADMIN_FEES_PLANS } from "../../data/mockAdminFees";
import FeesMatrix from "../../components/FeesMatrix";
import AuditStrip from "../../components/AuditStrip";

export default function FeePlanCard() {
  const params = useParams<{ id: string }>();
  const plan = ADMIN_FEES_PLANS.find((p) => p.id === params.id);

  if (!plan) return <div className="text-white/70">План не найден.</div>;

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
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight break-words">
            {plan.name}
          </h1>
          <p className="text-white/60 text-sm">
            {plan.active ? "Активен" : "Отключен"} • Обновлён: {plan.updatedAt}
          </p>
        </div>

        {/* Кнопки действий: на мобиле — переносятся и тянутся на ширину */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => alert("Сохранено (демо)")}
            className="flex-1 md:flex-none rounded-lg bg-white/90 text-black px-3 py-2 text-sm hover:bg-white"
          >
            Сохранить
          </button>
          <button
            onClick={() => alert("Архивировано (демо)")}
            className="flex-1 md:flex-none rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
          >
            Архивировать
          </button>
        </div>
      </header>

      {/* Контент */}
      <section className="grid md:grid-cols-3 gap-4">
        {/* Матрица — без отрицательных отступов, скролл только внутри таблицы */}
        <div className="md:col-span-2">
          <FeesMatrix />
        </div>

        {/* Боковая панель */}
        <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
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
        </div>
      </section>

      <AuditStrip />
    </div>
  );
}