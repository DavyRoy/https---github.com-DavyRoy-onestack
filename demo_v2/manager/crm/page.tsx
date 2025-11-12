"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Users2 } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";
import CrmHero from "@/app/demo/manager/crm/components/CrmHero";
import CrmStats from "@/app/demo/manager/crm/components/CrmStats";
import CrmQuickActions from "@/app/demo/manager/crm/components/CrmQuickActions";
import { mockLeads } from "@/app/demo/manager/crm/data/mockLeads";
import { mockDeals, STAGES } from "@/app/demo/manager/crm/data/mockDeals";
import { mockClients } from "@/app/demo/manager/crm/data/mockClients";

/** Подсветка статусов лидов */
const leadStatusTone = (s: string) => {
  switch (s) {
    case "new":
      return "bg-sky-400/15 text-sky-200 ring-1 ring-inset ring-sky-400/20";
    case "in_progress":
      return "bg-amber-400/15 text-amber-200 ring-1 ring-inset ring-amber-400/20";
    case "closed":
    case "closed_won":
    case "closed_lost":
      return "bg-emerald-400/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/20";
    default:
      return "bg-white/10 text-white/70 ring-1 ring-inset ring-white/20";
  }
};

export default function CrmHubPage() {
  // Защита от неожиданных данных + мемоизация
  const leads = useMemo(
    () => (Array.isArray(mockLeads) ? mockLeads.slice(-5).reverse() : []),
    []
  );

  const miniKanban = useMemo(
    () =>
      (Array.isArray(STAGES) ? STAGES : []).map((s) => ({
        ...s,
        rows: (Array.isArray(mockDeals) ? mockDeals : [])
          .filter((d) => d.stage === s.id)
          .slice(0, 3),
      })),
    []
  );

  const newClients = useMemo(
    () => (Array.isArray(mockClients) ? mockClients.slice(-3).reverse() : []),
    []
  );

  return (
    <div className="grid gap-4 md:gap-6">
      {/* Хедер */}
      <header className={T.hero} aria-labelledby="crm-hub-title">
        <CrmHero />
      </header>

      {/* KPI/статы */}
      <CrmStats />

      {/* Последние лиды + Мини-канбан */}
      <section
        className="grid gap-4 md:grid-cols-[1.2fr_1fr]"
        aria-labelledby="leads-and-deals"
      >
        <h2 id="leads-and-deals" className="sr-only">
          Лиды и сделки
        </h2>

        {/* Последние лиды */}
        <article
          className={T.card + " flex flex-col min-w-0"}
          aria-labelledby="last-leads-title"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <h3 id="last-leads-title" className="text-base font-semibold truncate">
                Последние лиды
              </h3>
              <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/80">
                {leads.length}
              </span>
            </div>

            {/* Кнопки: на мобиле по ширине, без «дёрганий», нормальная хит-зона */}
            <div className="flex w-full sm:w-auto items-center gap-2">
              <Link
                href="/demo/manager/crm/leads/new"
                prefetch={false}
                className="inline-flex items-center justify-center rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 transition md:hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 min-h-[40px] whitespace-nowrap flex-1 sm:flex-none"
                aria-label="Создать новый лид"
              >
                + Новый лид
              </Link>
              <Link
                href="/demo/manager/crm/leads"
                prefetch={false}
                className="inline-flex items-center justify-center rounded-lg border border-white/12 bg-white/5 px-3 py-1.5 text-xs text-white/85 transition md:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 min-h-[40px] whitespace-nowrap flex-1 sm:flex-none"
                aria-label="Перейти ко всем лидам"
              >
                Все лиды
              </Link>
            </div>
          </div>

          {leads.length === 0 ? (
            <EmptyBox
              title="Лидов пока нет"
              subtitle="Создайте первый лид, чтобы начать воронку."
              ctaHref="/demo/manager/crm/leads/new"
              ctaLabel="Создать лид"
            />
          ) : (
            <>
              {/* Десктоп: список плиток */}
              <ul className="mt-3 hidden gap-2 md:grid">
                {leads.map((l) => (
                  <li key={`lead-desktop-${l.id}`}>
                    <Link
                      href={`/demo/manager/crm/leads/${l.id}`}
                      prefetch={false}
                      className="group block rounded-xl border border-white/10 bg-white/[0.04] p-3 transition md:hover:-translate-y-0.5 md:hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                      aria-label={`Лид ${l.name}: ${srcLabel(l.source)}, статус ${statusLabel(l.status)}, бюджет ${fmt(l.budget)} ₽`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {l.name}
                          </div>
                          <div className="truncate text-xs text-white/70">
                            {l.contact} • {srcLabel(l.source)} •{" "}
                            <span
                              className={[
                                "inline-flex items-center rounded-md px-1.5 py-[2px] text-[11px]",
                                leadStatusTone(l.status),
                              ].join(" ")}
                            >
                              {statusLabel(l.status)}
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 tabular-nums text-sm">
                          {fmt(l.budget)} ₽
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Мобайл: горизонтальная лента (edge-to-edge) */}
              <div className="-mx-3 px-3 md:m-0 md:p-0">
                <div className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-none md:hidden">
                  {leads.map((l) => (
                    <Link
                      key={`lead-mobile-${l.id}`}
                      href={`/demo/manager/crm/leads/${l.id}`}
                      prefetch={false}
                      className="snap-start w-[240px] shrink-0 rounded-2xl border border-white/12 bg-white/[0.05] p-3 shadow-[0_14px_36px_-28px_rgba(12,18,32,0.85)] transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                      aria-label={`Лид ${l.name}: ${srcLabel(l.source)}, статус ${statusLabel(l.status)}`}
                    >
                      <div className="text-sm font-semibold text-white truncate">
                        {l.name}
                      </div>
                      <div className="mt-1 text-xs text-white/65 truncate">
                        {l.contact || "контакт не указан"}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-white/55">
                        <span>{srcLabel(l.source)}</span>
                        <span
                          className={[
                            "inline-flex items-center rounded-md px-1 py-[1px] text-[10px]",
                            leadStatusTone(l.status),
                          ].join(" ")}
                        >
                          {statusLabel(l.status)}
                        </span>
                      </div>
                      <div className="mt-3 text-sm font-semibold tabular-nums">
                        {fmt(l.budget)} ₽
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </article>

        {/* Мини-канбан */}
        <article
          className={T.card + " flex flex-col min-w-0"}
          aria-labelledby="mini-kanban-title"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 id="mini-kanban-title" className="text-base font-semibold">
              Активные сделки
            </h3>
            <Link
              href="/demo/manager/crm/deals"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-lg border border-white/12 bg-white/5 px-3 py-1.5 text-xs text-white/85 transition md:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 min-h-[40px] whitespace-nowrap"
              aria-label="Открыть канбан сделок"
            >
              Открыть канбан
            </Link>
          </div>

          {/* Десктоп: список колонок */}
          <div className="mt-3 hidden gap-3 md:grid">
            {miniKanban.map((col) => (
              <div
                key={`kanban-desktop-${col.id}`}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-2"
              >
                <div className="flex items-center justify-between px-1 text-xs text-white/70">
                  <div className="truncate">{col.title}</div>
                  <div className="tabular-nums">{col.rows.length}</div>
                </div>

                <div className="mt-1 grid gap-1">
                  {col.rows.map((d) => (
                    <Link
                      key={d.id}
                      href={`/demo/manager/crm/deals/${d.id}`}
                      prefetch={false}
                      className="group rounded-lg border border-white/10 bg-white/[0.04] p-2 transition md:hover:-translate-y-0.5 md:hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                      aria-label={`Сделка ${d.title}: клиент ${d.client}, срок до ${d.due}`}
                    >
                      <div className="truncate text-sm">{d.title}</div>
                      <div className="truncate text-[11px] text-white/65">
                        {d.client} • до {d.due}
                      </div>
                    </Link>
                  ))}
                  {col.rows.length === 0 && (
                    <div className="px-1 py-1 text-xs text-white/60">
                      Нет карточек
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Мобайл: горизонтальная лента колонок (edge-to-edge) */}
          <div className="-mx-3 px-3 md:m-0 md:p-0">
            <div className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-none md:hidden">
              {miniKanban.map((col) => (
                <div
                  key={`kanban-mobile-${col.id}`}
                  className="snap-start w-[240px] shrink-0 rounded-2xl border border-white/12 bg-white/[0.05] p-3 shadow-[0_14px_36px_-28px_rgba(12,18,32,0.85)]"
                >
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <div className="truncate font-medium">{col.title}</div>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/70">
                      {col.rows.length}
                    </span>
                  </div>
                  <div className="mt-2 grid gap-1">
                    {col.rows.slice(0, 3).map((d) => (
                      <Link
                        key={d.id}
                        href={`/demo/manager/crm/deals/${d.id}`}
                        prefetch={false}
                        className="rounded-lg border border-white/12 bg-white/[0.08] px-2 py-1.5 text-[11px] text-white/85 transition hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                        aria-label={`Сделка ${d.title}: клиент ${d.client}, срок до ${d.due}`}
                      >
                        <div className="truncate font-medium">{d.title}</div>
                        <div className="truncate text-white/65">
                          {d.client} • до {d.due}
                        </div>
                      </Link>
                    ))}
                    {col.rows.length > 3 && (
                      <Link
                        href={`/demo/manager/crm/deals?stage=${col.id}`}
                        prefetch={false}
                        className="mt-1 inline-flex items-center text-[11px] text-white/70 underline-offset-2 hover:underline"
                      >
                        + ещё {col.rows.length - 3}
                      </Link>
                    )}
                    {col.rows.length === 0 && (
                      <div className="text-[11px] text-white/55">Нет карточек</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      {/* Новые клиенты */}
      <section className={T.card + " min-w-0"} aria-labelledby="new-clients-title">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="new-clients-title" className="text-base font-semibold">
            Новые клиенты
          </h3>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <Link
              href="/demo/manager/crm/clients/new"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 transition md:hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 min-h-[40px] whitespace-nowrap flex-1 sm:flex-none"
              aria-label="Добавить клиента"
            >
              + Добавить клиента
            </Link>
            <Link
              href="/demo/manager/crm/clients"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-lg border border-white/12 bg-white/5 px-3 py-1.5 text-xs text-white/85 transition md:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 min-h-[40px] whitespace-nowrap flex-1 sm:flex-none"
              aria-label="Перейти к списку клиентов"
            >
              К списку клиентов
            </Link>
          </div>
        </div>

        {newClients.length === 0 ? (
          <EmptyBox
            title="Новых клиентов пока нет"
            subtitle="Импортируйте базу или создайте клиента вручную."
            ctaHref="/demo/manager/crm/clients/new"
            ctaLabel="Добавить клиента"
          />
        ) : (
          <>
            {/* Десктоп: карточки сеткой */}
            <ul className="mt-3 hidden gap-2 md:grid md:grid-cols-3">
              {newClients.map((c) => (
                <li key={`client-desktop-${c.id}`}>
                  <Link
                    href={`/demo/manager/crm/clients/${c.id}`}
                    prefetch={false}
                    className="group block rounded-xl border border-white/10 bg-white/[0.04] p-3 transition md:hover:-translate-y-0.5 md:hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    aria-label={`Клиент ${c.name}, контакт: ${c.email || c.phone || "—"}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl border border-white/15 bg-white/10 p-2">
                        <Users2 width={16} height={16} aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {c.name}
                        </div>
                        <div className="truncate text-xs text-white/70">
                          {c.email || c.phone || "контакт не указан"}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Мобайл: горизонтальная лента карточек (edge-to-edge) */}
            <div className="-mx-3 px-3 md:m-0 md:p-0">
              <div className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-none md:hidden">
                {newClients.map((c) => (
                  <Link
                    key={`client-mobile-${c.id}`}
                    href={`/demo/manager/crm/clients/${c.id}`}
                    prefetch={false}
                    className="snap-start w-[220px] shrink-0 rounded-2xl border border-white/12 bg-white/[0.05] p-3 shadow-[0_14px_36px_-28px_rgba(12,18,32,0.85)] transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    aria-label={`Клиент ${c.name}, контакт: ${c.email || c.phone || "—"}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl border border-white/15 bg-white/10 p-2">
                        <Users2 width={16} height={16} aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white">
                          {c.name}
                        </div>
                        <div className="truncate text-[11px] text-white/70">
                          {c.email || c.phone || "контакт не указан"}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </section>

      {/* Быстрые действия */}
      <section className={T.card} aria-label="Быстрые действия">
        <CrmQuickActions />
      </section>
    </div>
  );
}

/* ====== Утилиты отображения ====== */
const fmt = (n: number) => n.toLocaleString("ru-RU");
const srcLabel = (s: string) =>
  s === "site"
    ? "Сайт"
    : s === "call"
    ? "Звонок"
    : s === "messenger"
    ? "Мессенджер"
    : "Реферал";
const statusLabel = (s: string) =>
  s === "new" ? "Новый" : s === "in_progress" ? "В работе" : "Закрыт";

/* Переиспользуемый пустой блок с CTA */
function EmptyBox({
  title,
  subtitle,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div
      className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] p-6 text-center"
      role="region"
      aria-label="Пустой блок"
    >
      <div className="text-sm font-semibold text-white">{title}</div>
      {subtitle && <div className={"mt-1 text-xs " + T.mut}>{subtitle}</div>}
      {ctaHref && ctaLabel && (
        <div className="mt-3">
          <Link
            href={ctaHref}
            prefetch={false}
            className="inline-flex items-center justify-center rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 transition md:hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 min-h-[40px] whitespace-nowrap"
          >
            {ctaLabel}
          </Link>
        </div>
      )}
    </div>
  );
}