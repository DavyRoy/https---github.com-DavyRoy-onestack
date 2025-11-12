// app/demo/admin/payments/fees/page.tsx
"use client";

import Link from "next/link";
import FeesMatrix from "../components/FeesMatrix";
import { ADMIN_FEES_PLANS } from "@/app/demo/(shared)/payments";

export default function FeesPage() {
  return (
    <div className="grid gap-6 w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight break-words">
            Тарифы/Комиссии
          </h1>
          <p className="mt-1 text-sm text-white/60 break-words">
            Правила комиссий по методам, валютам и локациям.
          </p>
        </div>

        {/* CTA — на мобиле во всю ширину */}
        <div className="flex w-full md:w-auto gap-2">
          <Link
            href="/demo/admin/payments/fees/new"
            className="w-full md:w-auto rounded-lg bg-white/90 text-black px-3 py-2 text-sm text-center hover:bg-white"
          >
            Новый план
          </Link>
        </div>
      </header>

      {/* Матрица комиссий: внутренний горизонтальный скролл, страница не распирается */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-0 overflow-hidden">
        {/* отрицательные внешние отступы компенсируют внутренние паддинги на маленьких экранах */}
        <div className="-mx-3 md:mx-0">
          <div className="px-3 md:px-0">
            <FeesMatrix />
          </div>
        </div>
      </section>

      {/* Список планов */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 min-w-0">
        <div className="text-sm text-white/70 mb-2">Планы</div>

        <div className="grid gap-2 min-w-0">
          {ADMIN_FEES_PLANS.map((p) => (
            <Link
              key={p.id}
              href={`/demo/admin/payments/fees/${p.id}`}
              className="block rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 hover:bg-white/[0.06] min-w-0"
            >
              {/* Внутри — не даём тексту распирать контейнер */}
              <div className="font-medium truncate">{p.name}</div>
              <div className="text-xs text-white/60 whitespace-normal break-words">
                {p.active ? "Активен" : "Отключен"} • Обновлён: {p.updatedAt}
              </div>
            </Link>
          ))}

          {ADMIN_FEES_PLANS.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-4 text-sm text-white/60 text-center">
              Нет планов.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}