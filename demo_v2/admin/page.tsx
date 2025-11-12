import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users2,
  Shield,
  Store,
  Briefcase,
  CalendarCheck2,
  ChartSpline,
  CreditCard,
  Plug,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Администратор",
  description: "Настройки, роли, аналитика и финансы. Демо-панель администратора.",
  alternates: { canonical: "/admin" },
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
    description: "Живые KPI, фильтры по каналам, гео и валюте.",
    href: "/demo/admin/dashboard",
    status: "ready",
    icon: LayoutDashboard,
  },
  {
    key: "users",
    title: "Права и роли",
    description: "RBAC, сегменты, аудит доступа и шаблоны.",
    href: "/demo/admin/users",
    status: "ready",
    icon: Shield,
  },
  {
    key: "crm",
    title: "CRM",
    description: "Конверсия, источники, сегменты и активность менеджеров.",
    href: "/demo/admin/crm",
    status: "beta",
    icon: Users2,
  },
  {
    key: "shop",
    title: "Магазин",
    description: "Каталог, остатки, категории и ценообразование.",
    href: "/demo/admin/shop",
    status: "beta",
    icon: Store,
  },
  {
    key: "services",
    title: "Услуги",
    description: "Расписания, прайсы, пакеты и специалисты.",
    href: "/demo/admin/services",
    status: "ready",
    icon: Briefcase,
  },
  {
    key: "booking",
    title: "Бронирование",
    description: "Шаблоны слотов, ресурсы, исключения и политики.",
    href: "/demo/admin/booking",
    status: "ready",
    icon: CalendarCheck2,
  },
  {
    key: "payments",
    title: "Финансы",
    description: "Платежи, тарифы, провайдеры и сверка транзакций.",
    href: "/demo/admin/payments",
    status: "ready",
    icon: CreditCard,
  },
  {
    key: "reports",
    title: "Аналитика",
    description: "Тренды продаж, бронирований и CRM-воронки.",
    href: "/demo/admin/reports",
    status: "ready",
    icon: ChartSpline,
  },
  {
    key: "integrations",
    title: "Интеграции",
    description: "Вебхуки, каналы уведомлений, каталог шаблонов.",
    href: "/demo/admin/integrations",
    status: "beta",
    icon: Plug,
  },
];

type HeroStat = { label: string; value: string; diff?: string; hint?: string };

const HERO_STATS: HeroStat[] = [
  {
    label: "Активных ролей",
    value: "48",
    diff: "+12%",
    hint: "Админ • Менеджер • Автоматизация",
  },
  {
    label: "Критичных интеграций",
    value: "23",
    diff: "+3 новых",
    hint: "SSO • Webhooks • Marketplace",
  },
  {
    label: "SLA неделю подряд",
    value: "99.95%",
    diff: "без инцидентов",
    hint: "Алерты и runbooks выполняются",
  },
];

const QUICK_ACTIONS: Array<{ label: string; href: string; hint: string }> = [
  {
    label: "Настроить роли и права",
    href: "/demo/admin/users/roles",
    hint: "RBAC, сегменты и шаблоны доступа",
  },
  {
    label: "Проверить оплату и сверку",
    href: "/demo/admin/payments",
    hint: "Расхождения, тарифы, статусы провайдеров",
  },
  {
    label: "Управлять интеграциями",
    href: "/demo/admin/integrations",
    hint: "Каналы, вебхуки, каталоги подключений",
  },
  {
    label: "Журнал и аудит действий",
    href: "/demo/admin/audit/logs",
    hint: "API-вызовы, операции и новые соединения",
  },
];

const CONTROL_ITEMS: Array<{ title: string; description: string }> = [
  {
    title: "Live-мониторинг компании",
    description: "Дашборды с фильтрами по каналам, локациям и валютам.",
  },
  {
    title: "Управление доступами",
    description: "Роли, сегменты, быстрый аудит и алерты по отклонениям.",
  },
  {
    title: "Предотвращение рисков",
    description: "Автоматические уведомления по SLA, платежам и интеграциям.",
  },
];

const ROADMAP_ITEMS: Array<{ title: string; description: string }> = [
  {
    title: "Оркестрации и runbooks",
    description: "Автодействия по событиям, сценарии реагирования, эскалации.",
  },
  {
    title: "Профили безопасности",
    description: "Шаблоны MFA, политики паролей, контроль сессий и устройств.",
  },
  {
    title: "Расширенная аналитика CRM",
    description: "Атрибуция лидов, LTV / CAC и прогноз удержания.",
  },
];

const statusTone = (status?: Module["status"]) => {
  switch (status) {
    case "ready":
      return { label: "Готово", className: "bg-emerald-400/20 text-emerald-200" };
    case "beta":
      return { label: "Beta", className: "bg-amber-400/20 text-amber-200" };
    case "soon":
      return { label: "Скоро", className: "bg-white/12 text-white/70" };
    default:
      return null;
  }
};

export default function AdminPage() {
  return (
    <>
      <section className="relative overflow-hidden rounded-[1.6rem] border border-white/12 bg-gradient-to-br from-white/12 via-white/6 to-white/12 p-6 sm:p-8 shadow-[0_35px_120px_-60px_rgba(12,20,60,0.95)]">
        <span
          aria-hidden
          className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl sm:-left-12"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl sm:-right-6"
        />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div className="relative z-10 flex flex-col gap-4">
            <span className="admin-chip w-fit bg-white/15 text-white/80">
              Управление платформой
            </span>
            <h1 id="admin-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Демо-панель администратора OneStack
            </h1>
            <p className="max-w-2xl text-sm text-white/70 sm:text-base">
              Централизованное управление бизнесом: роли, доступы, финансовые показатели и интеграции.
              Все данные синхронизированы с live-дашбордом и доступны на любом устройстве.
            </p>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/demo/admin/dashboard"
                prefetch={false}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                Открыть дашборд
              </Link>
              <Link
                href="/demo"
                prefetch={false}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                Все сценарии демо
              </Link>
            </div>
          </div>

          <div className="relative z-10 grid gap-3 rounded-2xl border border-white/15 bg-[#060914]/80 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Sparkles width={16} height={16} className="text-white/60" />
              Live-статистика среды
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/12 bg-white/10 p-3 text-white shadow-[0_10px_35px_-25px_rgba(12,16,40,0.8)]"
                >
                  <div className="text-xs text-white/60">{stat.label}</div>
                  <div className="mt-1 text-xl font-semibold tabular-nums">{stat.value}</div>
                  {stat.diff && (
                    <div className="mt-1 inline-flex items-center rounded-lg bg-emerald-400/15 px-2 py-0.5 text-[11px] text-emerald-200">
                      {stat.diff}
                    </div>
                  )}
                  {stat.hint && <div className="mt-2 text-[11px] text-white/55">{stat.hint}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="admin-modules" className="grid gap-4 lg:grid-cols-3">
        <h2 id="admin-modules" className="sr-only">
          Основные модули администратора
        </h2>
        {MODULES.map((module) => {
          const status = statusTone(module.status);
          const Icon = module.icon;
          return (
            <article
              key={module.key}
              className="admin-section group h-full border-white/12 bg-white/6 transition hover:border-white/18 hover:bg-white/12"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/12 text-white/80">
                    <Icon width={18} height={18} />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-white">{module.title}</h3>
                    <p className="mt-1 text-sm text-white/70">{module.description}</p>
                  </div>
                </div>
                {status && (
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.className}`}>
                    {status.label}
                  </span>
                )}
              </div>

              <div className="admin-divider" aria-hidden />

              {module.href ? (
                <Link
                  href={module.href}
                  prefetch={false}
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
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

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="admin-section border-white/12 bg-white/8">
          <div className="flex items-center gap-2 text-sm font-medium text-white/80">
            <CheckCircle2 width={18} height={18} className="text-emerald-300" />
            Быстрые действия
          </div>
          <ul className="mt-2 grid gap-2 text-sm">
            {QUICK_ACTIONS.map((action) => (
              <li key={action.href}>
                <Link
                  href={action.href}
                  prefetch={false}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/8 px-3 py-2 text-white/80 transition hover:border-white/18 hover:bg-white/14 hover:text-white"
                >
                  <div className="flex flex-col">
                    <span>{action.label}</span>
                    <span className="text-[11px] text-white/55">{action.hint}</span>
                  </div>
                  <span className="text-sm text-white/50 transition group-hover:text-white">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </article>

        <article className="admin-section border-white/12 bg-white/8">
          <div className="flex items-center gap-2 text-sm font-medium text-white/80">
            <Sparkles width={18} height={18} className="text-sky-300" />
            Контроль и прозрачность
          </div>
          <ul className="mt-2 grid gap-2">
            {CONTROL_ITEMS.map((item) => (
              <li key={item.title} className="rounded-xl border border-white/10 bg-white/7 p-3">
                <div className="text-sm font-semibold text-white/85">{item.title}</div>
                <p className="mt-1 text-[13px] leading-relaxed text-white/60">{item.description}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="admin-section border-white/12 bg-white/8">
          <div className="flex items-center gap-2 text-sm font-medium text-white/80">
            <Sparkles width={18} height={18} className="text-violet-300" />
            На ближайшей дорожной карте
          </div>
          <ul className="mt-2 grid gap-2">
            {ROADMAP_ITEMS.map((item) => (
              <li key={item.title} className="rounded-xl border border-white/10 bg-white/7 p-3">
                <div className="text-sm font-semibold text-white">{item.title}</div>
                <p className="mt-1 text-[13px] leading-relaxed text-white/60">{item.description}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </>
  );
}
