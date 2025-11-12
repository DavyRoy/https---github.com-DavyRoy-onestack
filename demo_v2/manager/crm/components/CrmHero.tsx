"use client";

import Link from "next/link";
import { Home, Sparkles, Plus, ClipboardList, Users2 } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";

export default function CrmHero() {
  return (
    <section className={T.hero} aria-labelledby="crm-hero-title">
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Верхняя полоса: хлебные крошки + бейдж демо */}
        <div className="flex items-start justify-between gap-3">
          {/* Хлебные крошки */}
          <nav aria-label="Хлебные крошки" className="min-w-0">
            <ol className="flex items-center gap-1 text-xs text-white/70">
              <li className="min-w-0">
                <Link
                  href="/demo/manager/dashboard"
                  className="inline-flex max-w-full items-center gap-1 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
                >
                  <Home width={14} height={14} aria-hidden />
                  <span className="truncate">Дашборд</span>
                </Link>
              </li>
              <li aria-hidden className="opacity-40">/</li>
              <li className="text-white/85 truncate" aria-current="page">
                CRM
              </li>
            </ol>
          </nav>

          {/* Бейдж демо / статус */}
          <div className="hidden md:flex">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] text-white/85 ring-1 ring-white/10">
              <Sparkles width={12} height={12} className="opacity-80" aria-hidden />
              Демо
            </span>
          </div>
        </div>

        {/* Заголовок + подзаголовок */}
        <div className="min-w-0">
          <h1
            id="crm-hero-title"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            CRM
          </h1>
          <p className={"mt-1 text-sm " + T.dim}>Клиенты, лиды и сделки</p>
        </div>

        {/* Быстрые действия: мобильные и десктопные */}
        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            href="/demo/manager/crm/leads/new"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 text-sm font-semibold text-neutral-900 transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 active:scale-[0.98]"
          >
            <Plus width={16} height={16} aria-hidden /> Новый лид
          </Link>
          <Link
            href="/demo/manager/crm/deals/new"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-white/90 transition hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 active:scale-[0.98]"
          >
            <ClipboardList width={16} height={16} aria-hidden /> Новая сделка
          </Link>
          <Link
            href="/demo/manager/crm/clients/new"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-white/90 transition hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 active:scale-[0.98]"
          >
            <Users2 width={16} height={16} aria-hidden /> Новый клиент
          </Link>
        </div>
      </div>
    </section>
  );
}