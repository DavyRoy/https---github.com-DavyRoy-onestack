// app/demo/manager/page.tsx
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  Users2,
  Workflow,
  ClipboardList,
  Receipt,
  CalendarDays,
  Calendar,
  CreditCard,
  FileBarChart2,
  Settings,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Менеджер",
  description:
    "Рабочая панель менеджера: CRM, сделки, бронирования, платежи и отчёты. Демо.",
  alternates: { canonical: "/manager" },
};

type Module = {
  key: string;
  title: string;
  description: string;
  href?: string;
  status?: "ready" | "beta" | "soon";
  icon: LucideIcon;
};

const MODULES: Module[] = [
  {
    key: "dashboard",
    title: "Дашборд",
    description: "Личные KPI, задачи на сегодня и активные сделки.",
    href: "/demo/manager/dashboard",
    status: "ready",
    icon: LayoutGrid,
  },
  {
    key: "crm",
    title: "CRM",
    description: "Клиенты, активность, коммуникации и задачи.",
    href: "/demo/manager/crm",
    status: "ready",
    icon: Users2,
  },
  {
    key: "leads",
    title: "Лиды",
    description: "Новые обращения, распределение и квалификация.",
    href: "/demo/manager/crm/leads",
    status: "ready",
    icon: Workflow,
  },
  {
    key: "deals",
    title: "Сделки",
    description: "Воронка, статусы, вероятность и прогноз.",
    href: "/demo/manager/crm/deals",
    status: "ready",
    icon: ClipboardList,
  },
  {
    key: "orders",
    title: "Заказы",
    description: "Статусы, оплаты и история покупок клиентов.",
    href: "/demo/manager/orders",
    status: "ready",
    icon: Receipt,
  },
  {
    key: "booking",
    title: "Бронирование",
    description: "Слоты, ресурсы, подтверждения и отмены.",
    href: "/demo/manager/booking",
    status: "ready",
    icon: CalendarDays,
  },
  {
    key: "calendar",
    title: "Календарь",
    description: "Личные события, встречи и расписание.",
    href: "/demo/manager/calendar",
    status: "ready",
    icon: Calendar,
  },
  {
    key: "payments",
    title: "Платежи",
    description: "Поступления, возвраты и сверка по клиентам.",
    href: "/demo/manager/payments",
    status: "ready",
    icon: CreditCard,
  },
  {
    key: "reports",
    title: "Отчёты",
    description: "Продажи, конверсия и активность за период.",
    href: "/demo/manager/reports",
    status: "ready",
    icon: FileBarChart2,
  },
  {
    key: "settings",
    title: "Настройки",
    description: "Профиль, уведомления, рабочие предпочтения.",
    href: "/demo/manager/settings",
    status: "ready",
    icon: Settings,
  },
];

type HeroStat = { label: string; value: string; diff?: string; hint?: string };

const HERO_STATS: HeroStat[] = [
  { label: "Сделок в работе", value: "37", diff: "+5 за 24ч", hint: "Воронка: 8 • 12 • 11 • 6" },
  { label: "Конверсия по лидам", value: "28.4%", diff: "+1.2 п.п.", hint: "Из 134 новых за 7д" },
  { label: "Выручка (МТД)", value: "₽ 1.84M", diff: "+14%", hint: "Оплаты + предоплаты" },
];

const QUICK_ACTIONS: Array<{ label: string; href: string; hint: string }> = [
  { label: "Новые лиды", href: "/demo/manager/crm/leads", hint: "Распределить и связаться" },
  { label: "Сделки к закрытию", href: "/demo/manager/crm/deals", hint: "Статусы и следующие шаги" },
  { label: "Сегодняшние встречи", href: "/demo/manager/calendar", hint: "Подтверждения и переносы" },
  { label: "Проверить оплаты", href: "/demo/manager/payments", hint: "Поступления и возвраты" },
];

const CONTROL_ITEMS: Array<{ title: string; description: string }> = [
  {
    title: "Фокус на результат",
    description:
      "Список приоритетных сделок и задач на сегодня — без переключения контекста.",
  },
  {
    title: "Прозрачные процессы",
    description:
      "Журнал действий по клиентам и быстрая навигация по связанным объектам.",
  },
  {
    title: "Синхронизация с CRM",
    description:
      "Все изменения мгновенно отражаются в дашбордах и отчётах менеджера.",
  },
];

const ROADMAP_ITEMS: Array<{ title: string; description: string }> = [
  {
    title: "Скрипты звонков",
    description:
      "Шаблоны ответов, чек-листы и подсказки на основе стадии сделки.",
  },
  {
    title: "Автозадачи по событиям",
    description:
      "Создание follow-up задач после письма, звонка или оплаты.",
  },
  {
    title: "Личные цели и бонусы",
    description:
      "План по продажам, KPI и расчёт бонусов в одном месте.",
  },
];

const statusTone = (status?: Module["status"]) => {
  switch (status) {
    case "ready":
      return { label: "Готово", className: "bg-emerald-400/20 text-emerald-200 ring-1 ring-inset ring-emerald-400/25" };
    case "beta":
      return { label: "Beta", className: "bg-amber-400/20 text-amber-200 ring-1 ring-inset ring-amber-400/25" };
    case "soon":
      return { label: "Скоро", className: "bg-white/12 text-white/70 ring-1 ring-inset ring-white/20" };
    default:
      return null;
  }
};

export default function ManagerPage() {
  return (
    <main
      role="main"
      className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-white [contain:layout_style_paint] supports-[overflow:clip]:overflow-clip"
    >
      {/* Hero */}
      <section
        aria-labelledby="manager-hero"
        className="relative overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-5 sm:p-8 shadow-[0_35px_120px_-60px_rgba(12,20,60,0.95)]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl sm:-left-12"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-sky-500/30 blur-3xl sm:-right-6"
        />

        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div className="relative z-10 flex min-w-0 flex-col gap-4">
            <span
              id="manager-hero"
              className="admin-chip w-fit bg-white/15 text-white/85 ring-1 ring-white/20"
            >
              Рабочее место менеджера
            </span>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
              Демо-панель менеджера OneStack
            </h1>

            <p className="max-w-2xl text-sm text-white/70 sm:text-base">
              Управляйте лидами, сделками и встречами, контролируйте оплаты и следите за личными KPI — всё в одном месте и на любых устройствах.
            </p>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/demo/manager/dashboard"
                prefetch={false}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.98]"
                aria-label="Перейти к дашборду"
              >
                Перейти к дашборду
              </Link>
              <Link
                href="/demo"
                prefetch={false}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 transition hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.98]"
                aria-label="Посмотреть все сценарии демо"
              >
                Все сценарии демо
              </Link>
            </div>
          </div>

          {/* Hero stats */}
          <div className="relative z-10 grid gap-3 rounded-2xl border border-white/15 bg-[#060914]/80 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-sm text-white/75">
              <Sparkles width={16} height={16} className="text-white/70" />
              Личная статистика
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/12 bg-white/10 p-3 text-white shadow-[0_10px_35px_-25px_rgba(12,16,40,0.8)] transition-transform duration-200 ease-out will-change-transform hover:-translate-y-0.5"
                >
                  <div className="text-xs text-white/60">{stat.label}</div>
                  <div className="mt-1 text-xl font-semibold tabular-nums">
                    {stat.value}
                  </div>
                  {stat.diff && (
                    <div className="mt-1 inline-flex items-center rounded-lg bg-emerald-400/15 px-2 py-0.5 text-[11px] text-emerald-200 ring-1 ring-inset ring-emerald-400/20">
                      {stat.diff}
                    </div>
                  )}
                  {stat.hint && (
                    <div className="mt-2 text-[11px] text-white/55">
                      {stat.hint}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section
        aria-labelledby="manager-modules"
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <h2 id="manager-modules" className="sr-only">
          Основные модули менеджера
        </h2>

        {MODULES.map((module) => {
          const status = statusTone(module.status);
          const Icon = module.icon;
          return (
            <article
              key={module.key}
              className="admin-section group flex h-full flex-col justify-between gap-3 border-white/12 bg-white/6 transition hover:border-white/18 hover:bg-white/10 focus-within:border-white/18 focus-within:bg-white/10 rounded-2xl p-4 will-change-transform hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/12 text-white/85">
                    <Icon width={18} height={18} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold">
                      {module.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/70 break-words">
                      {module.description}
                    </p>
                  </div>
                </div>

                {status && (
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.className}`}
                    aria-label={`Статус: ${status.label}`}
                  >
                    {status.label}
                  </span>
                )}
              </div>

              <div className="admin-divider" aria-hidden />

              {module.href ? (
                <Link
                  href={module.href}
                  prefetch={false}
                  className="inline-flex w-fit items-center gap-2 text-sm font-medium text-white/85 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-lg px-1.5 py-1 -mx-1.5"
                >
                  Перейти →
                </Link>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm text-white/60">
                  В разработке
                </span>
              )}
            </article>
          );
        })}
      </section>

      {/* Secondary blocks */}
      <section className="mt-6 grid gap-4 xl:grid-cols-3">
        {/* Quick actions */}
        <article
          className="admin-section border-white/12 bg-white/8 rounded-2xl p-4"
          aria-labelledby="quick-actions"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-white/90">
            <CheckCircle2 width={18} height={18} className="text-emerald-300" />
            <span id="quick-actions">Быстрые действия</span>
          </div>

          <ul className="mt-2 grid gap-2 text-sm">
            {QUICK_ACTIONS.map((action) => (
              <li key={action.href}>
                <Link
                  href={action.href}
                  prefetch={false}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/8 px-3 py-2 text-white/85 transition hover:border-white/18 hover:bg-white/14 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate">{action.label}</span>
                    <span className="text-[11px] text-white/60">
                      {action.hint}
                    </span>
                  </div>
                  <span
                    className="text-sm text-white/50 transition group-hover:translate-x-0.5 group-hover:text-white"
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </article>

        {/* How we help */}
        <article
          className="admin-section border-white/12 bg-white/8 rounded-2xl p-4"
          aria-labelledby="how-we-help"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-white/90">
            <Sparkles width={18} height={18} className="text-sky-300" />
            <span id="how-we-help">Как мы помогаем</span>
          </div>

          <ul className="mt-2 grid gap-2">
            {CONTROL_ITEMS.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/7 p-3"
              >
                <div className="text-sm font-semibold text-white">
                  {item.title}
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-white/65">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </article>

        {/* Roadmap */}
        <article
          className="admin-section border-white/12 bg-white/8 rounded-2xl p-4"
          aria-labelledby="roadmap"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-white/90">
            <Sparkles width={18} height={18} className="text-violet-300" />
            <span id="roadmap">На ближайшей дорожной карте</span>
          </div>

          <ul className="mt-2 grid gap-2">
            {ROADMAP_ITEMS.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/7 p-3"
              >
                <div className="text-sm font-semibold text-white">
                  {item.title}
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-white/65">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}