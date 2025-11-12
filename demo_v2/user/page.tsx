// app/demo/user/page.tsx
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  ShoppingBag,
  Package2,
  ShoppingCart,
  Sparkles,
  CalendarDays,
  Calendar,
  BadgeCheck,
  TicketCheck,
  Settings,
  CreditCard,
  HeartHandshake,
  ArrowRight,
  User,
  Star,
  Clock,
  Gift,
  HelpCircle,
} from "lucide-react";

/**
 * SEO/OG: богаче описания, соц-карточки
 */
export const metadata: Metadata = {
  title: "Пользователь — Личный кабинет (демо) | OneStack",
  description:
    "Личный кабинет: дашборд, магазин, услуги, бронирования, заказы и настройки. Красиво и быстро на любом экране.",
  // важно: путь соответствует реальной странице
  alternates: { canonical: "/demo/user" },
  openGraph: {
    title: "Личный кабинет (демо) — OneStack",
    description:
      "Покупайте товары, записывайтесь на услуги, управляйте заказами и бронированиями — всё в одном месте.",
    url: "/demo/user",
    type: "website",
    images: [
      {
        url: "/og-user-demo.jpg",
        width: 1200,
        height: 630,
        alt: "OneStack — Личный кабинет пользователя",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Личный кабинет (демо) — OneStack",
    description:
      "Товары, услуги, брони, заказы и настройки. Доступно на любых устройствах.",
  },
  robots: { index: true, follow: true },
};

/**
 * Цвет статус-бара и PWA-хрома (лайт/дарк)
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#050911" },
  ],
};

/**
 * Типы
 */
type Module = {
  key: string;
  title: string;
  description: string;
  href?: string;
  icon: LucideIcon;
  badge?: string;
};

type HeroStat = {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
};

type QuickAction = {
  label: string;
  href: string;
  hint: string;
  icon: LucideIcon;
  priority?: "high" | "medium" | "low";
};

/**
 * Данные
 */
const CORE_MODULES: readonly Module[] = [
  {
    key: "dashboard",
    title: "Дашборд",
    description: "Приветствие, ближайшие события и быстрые действия",
    href: "/demo/user/dashboard",
    icon: LayoutGrid,
  },
  {
    key: "shop",
    title: "Магазин",
    description: "Категории, подборки и рекомендации",
    href: "/demo/user/shop",
    icon: ShoppingBag,
    badge: "New",
  },
  {
    key: "products",
    title: "Товары",
    description: "Каталог, фильтры и сравнение",
    href: "/demo/user/shop/products",
    icon: Package2,
  },
  {
    key: "cart",
    title: "Корзина",
    description: "Товары в корзине, промокоды и доставка",
    href: "/demo/user/cart",
    icon: ShoppingCart,
  },
  {
    key: "services",
    title: "Услуги",
    description: "Каталог услуг и быстрый подбор времени",
    href: "/demo/user/services",
    icon: HeartHandshake,
  },
  {
    key: "booking",
    title: "Бронирование",
    description: "Выбор специалиста, локации и слотов",
    href: "/demo/user/booking",
    icon: CalendarDays,
  },
  {
    key: "calendar",
    title: "Календарь",
    description: "Личные записи и напоминания",
    href: "/demo/user/calendar",
    icon: Calendar,
  },
] as const;

const MY_MODULES: readonly Module[] = [
  {
    key: "my-bookings",
    title: "Мои записи",
    description: "История, перенос и отмена записей",
    href: "/demo/user/my-bookings",
    icon: TicketCheck,
    badge: "3",
  },
  {
    key: "my-orders",
    title: "Мои заказы",
    description: "Статусы заказов, оплата и трекинг",
    href: "/demo/user/my-orders",
    icon: BadgeCheck,
    badge: "2",
  },
] as const;

const OPS_MODULES: readonly Module[] = [
  {
    key: "checkout",
    title: "Оплата",
    description: "Способ оплаты, 3-D Secure и квитанция",
    href: "/demo/user/checkout",
    icon: CreditCard,
  },
] as const;

const SYSTEM_MODULES: readonly Module[] = [
  {
    key: "settings",
    title: "Настройки",
    description: "Профиль, адреса, уведомления, безопасность",
    href: "/demo/user/settings",
    icon: Settings,
  },
  {
    key: "help",
    title: "Помощь",
    description: "FAQ, руководства и поддержка",
    href: "/demo/user/help",
    icon: HelpCircle,
  },
] as const;

const HERO_STATS: readonly HeroStat[] = [
  {
    label: "Ближайшая запись",
    value: "Сегодня, 16:30",
    hint: "Салон • Ольга • Маникюр",
    icon: Clock,
    trend: "up",
  },
  {
    label: "Заказов в пути",
    value: "2",
    hint: "Доставка: завтра — 1, послезавтра — 1",
    icon: Package2,
    trend: "neutral",
  },
  {
    label: "Бонусный баланс",
    value: "1 240",
    hint: "+250 можно списать сейчас",
    icon: Gift,
    trend: "up",
  },
  {
    label: "Рейтинг",
    value: "4.8",
    hint: "На основе 24 отзывов",
    icon: Star,
    trend: "up",
  },
] as const;

const QUICK_ACTIONS: readonly QuickAction[] = [
  {
    label: "Услуги",
    href: "/demo/user/services",
    hint: "Быстрый подбор даты",
    icon: CalendarDays,
    priority: "high",
  },
  {
    label: "Оплата",
    href: "/demo/user/checkout",
    hint: "Корзина → Способ оплаты",
    icon: CreditCard,
    priority: "high",
  },
  {
    label: "Заказы",
    href: "/demo/user/my-orders",
    hint: "Трекинг и квитанции",
    icon: Package2,
    priority: "medium",
  },
  {
    label: "Календарь",
    href: "/demo/user/calendar",
    hint: "Экспорт в Google/Apple",
    icon: Calendar,
    priority: "medium",
  },
] as const;

/* ------------------------- UI сабкомпоненты ------------------------- */

function ModuleCard({ m }: { m: Module }) {
  const Icon = m.icon;
  const isDisabled = !m.href;

  return (
    <article
      key={m.key}
      className={[
        "relative group flex h-full flex-col justify-between gap-3 rounded-[1.2rem] p-4 admin-surface",
        "transition-all duration-300 ease-out",
        "border border-white/12 bg-white/6 shadow-soft",
        isDisabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:bg-white/10 active:scale-[0.98]",
        "focus-within:ring-2 focus-within:ring-white/30",
      ].join(" ")}
    >
      {m.badge && (
        <span className="absolute -right-2 -top-2 z-10 flex h-6 min-w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 px-1.5 text-xs font-semibold text-white shadow-lg motion-reduce:animate-none">
          {m.badge}
        </span>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/8 text-white/85 transition-colors group-hover:bg-white/10">
            <Icon width={20} height={20} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-[rgba(255,255,255,0.94)]">
              {m.title}
            </h3>
            <p className="mt-1 text-sm text-[rgba(236,240,255,0.68)] line-clamp-2">
              {m.description}
            </p>
          </div>
        </div>
      </div>

      <div className="admin-divider" aria-hidden />

      <div className="flex items-center justify-between">
        <span className="text-[rgba(236,240,255,0.56)] text-xs font-medium">
          Раздел
        </span>
        {m.href ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[rgba(236,240,255,0.72)] transition-all group-hover:text-[rgba(255,255,255,0.94)] group-hover:gap-2">
            Перейти{" "}
            <ArrowRight
              width={16}
              height={16}
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-sm text-[rgba(236,240,255,0.56)]">
            Скоро
          </span>
        )}
      </div>

      {m.href && (
        <Link
          href={m.href}
          prefetch
          aria-label={`Открыть: ${m.title}`}
          className="absolute inset-0 rounded-[1.2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        />
      )}
    </article>
  );
}

function HeroStatCard({ stat }: { stat: HeroStat }) {
  const Icon = stat.icon;
  const trendColors: Record<NonNullable<HeroStat["trend"]>, string> = {
    up: "text-green-400",
    down: "text-red-400",
    neutral: "text-yellow-400",
  };

  return (
    <div
      role="listitem"
      className="group relative rounded-2xl border border-white/12 bg-white/6 p-4 transition-all duration-300 hover:bg-white/8 hover:shadow-soft"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-[rgba(236,240,255,0.68)]">
            <Icon
              width={14}
              height={14}
              className="text-[rgba(236,240,255,0.56)]"
              aria-hidden
            />
            {stat.label}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-xl font-bold tabular-nums text-[rgba(255,255,255,0.94)]">
              {stat.value}
            </div>
            {stat.trend && (
              <div
                className={[
                  "text-xs font-semibold",
                  trendColors[stat.trend],
                ].join(" ")}
              >
                {stat.trend === "up"
                  ? "↗"
                  : stat.trend === "down"
                  ? "↘"
                  : "→"}
              </div>
            )}
          </div>
          {stat.hint && (
            <div className="mt-2 text-[11px] text-[rgba(236,240,255,0.56)] leading-tight">
              {stat.hint}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ action }: { action: QuickAction }) {
  const Icon = action.icon;
  const priorityColors: Record<NonNullable<QuickAction["priority"]>, string> = {
    high: "border-red-500/20 bg-red-500/10",
    medium: "border-yellow-500/20 bg-yellow-500/10",
    low: "border-blue-500/20 bg-blue-500/10",
  };

  return (
    <li role="listitem">
      <Link
        href={action.href}
        prefetch
        className={[
          "group flex items-center justify-between gap-3 rounded-2xl border border-white/12 bg-white/6 p-4",
          "transition-all duration-200 hover:bg-white/8 hover:scale-[1.02] active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
          priorityColors[action.priority || "medium"],
          "motion-reduce:transition-none motion-reduce:hover:scale-100",
        ].join(" ")}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/8">
            <Icon width={18} height={18} className="text[rgba(236,240,255,0.68)]" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-[rgba(255,255,255,0.94)] truncate">
              {action.label}
            </div>
            <div className="text-xs text-[rgba(236,240,255,0.56)] mt-1 truncate">
              {action.hint}
            </div>
          </div>
        </div>
        <ArrowRight
          className="text-[rgba(236,240,255,0.56)] transition-transform group-hover:translate-x-0.5 group-hover:text-[rgba(255,255,255,0.94)] shrink-0 motion-reduce:transition-none"
          width={16}
          height={16}
          aria-hidden
        />
      </Link>
    </li>
  );
}

/* ------------------------------ Страница ----------------------------- */

export default function UserPage() {
  return (
    <div className="admin-shell">
      {/* Skip-ссылка */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-neutral-900 focus:font-semibold no-print"
      >
        Перейти к содержимому
      </a>

      {/* JSON-LD: хлебные крошки */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Главная", item: "/" },
              { "@type": "ListItem", position: 2, name: "Личный кабинет", item: "/demo/user" },
            ],
          }),
        }}
      />

      <main
        id="main"
        role="main"
        className={[
          "container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-screen",
          "max-w-7xl lg:max-w-8xl 2xl:max-w-[1600px]",
        ].join(" ")}
      >
        {/* Hero секция */}
        <section
          aria-labelledby="user-hero"
          className="relative overflow-hidden rounded-[1.2rem] border border-white/12 bg-white/6 p-6 sm:p-8 shadow-soft mb-8 admin-glass"
        >
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start relative z-10">
            {/* Текстовый блок */}
            <div className="flex min-w-0 flex-col gap-6">
              <div className="flex flex-col gap-4">
                {/* Чипы статуса (убрали «Личный кабинет», чтобы не дублировать) */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="admin-chip bg-green-500/20 text-green-300 border-green-500/30">
                    Премиум статус
                  </span>
                </div>
                <h1 className="admin-heading">Добро пожаловать, Алексей</h1>
                <p className="admin-subheading">
                  Покупайте товары, записывайтесь на услуги, управляйте заказами
                  и бронированиями — всё в одном месте и на любых устройствах.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/demo/user/shop"
                  prefetch
                  className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-3 text-base font-semibold text-neutral-900 transition-all hover:bg-white/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-95 shadow-lg motion-reduce:hover:scale-100"
                  aria-label="Перейти в магазин"
                >
                  <ShoppingBag width={20} height={20} />
                  Перейти в магазин
                </Link>
                <Link
                  href="/demo/user/my-orders"
                  prefetch
                  className="inline-flex items-center gap-3 rounded-2xl border border-white/12 bg-white/8 px-6 py-3 text-base font-medium text-[rgba(255,255,255,0.94)] transition-all hover:bg-white/10 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-95 motion-reduce:hover:scale-100"
                  aria-label="Открыть мои заказы"
                >
                  <Package2 width={20} height={20} />
                  Мои заказы
                </Link>
              </div>
            </div>

            {/* Hero stats */}
            <div className="admin-surface rounded-[1.2rem] p-6">
              <div className="flex items-center gap-3 text-sm font-medium text-[rgba(236,240,255,0.68)] mb-4">
                <Sparkles width={20} height={20} className="text-yellow-400" aria-hidden />
                Важно сейчас
              </div>
              <div className="grid gap-4 sm:grid-cols-2" role="list" aria-label="Ключевые показатели">
                {HERO_STATS.map((stat) => (
                  <HeroStatCard key={stat.label} stat={stat} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Основные разделы */}
        <section aria-labelledby="core-modules" className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 border border-white/12">
              <LayoutGrid width={20} height={20} className="text-[rgba(236,240,255,0.68)]" aria-hidden />
            </div>
            <div>
              <h2 id="core-modules" className="admin-heading">Основное</h2>
              <p className="admin-subheading mt-1">Все основные функции платформы</p>
            </div>
          </div>

          <div
            className={["admin-grid-auto", "2xl:[--admin-grid-min:18rem] 2xl:gap-6"].join(" ")}
            role="list"
            aria-describedby="core-modules"
          >
            {CORE_MODULES.map((m) => (
              <ModuleCard key={m.key} m={m} />
            ))}
          </div>
        </section>

        {/* Мои разделы */}
        <section aria-labelledby="my-modules" className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 border border-white/12">
              <BadgeCheck width={20} height={20} className="text-[rgba(236,240,255,0.68)]" aria-hidden />
            </div>
            <div>
              <h2 id="my-modules" className="admin-heading">Мои данные</h2>
              <p className="admin-subheading mt-1">Записи, заказы и активность</p>
            </div>
          </div>
          <div className="admin-grid-auto 2xl:[--admin-grid-min:18rem] 2xl:gap-6" role="list" aria-describedby="my-modules">
            {MY_MODULES.map((m) => (
              <ModuleCard key={m.key} m={m} />
            ))}
          </div>
        </section>

        {/* Нижняя секция с быстрыми действиями и системными разделами */}
        <section
          aria-labelledby="bottom-sections"
          className="
            grid grid-cols-1 gap-6
            sm:grid-cols-2
            xl:grid-cols-3
            2xl:gap-8
            /* важно: не добавляем нижние отступы для таббара здесь */
          "
        >
          {/* Быстрые действия */}
          <article className="admin-section min-w-0" aria-labelledby="quick-actions">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 border border-white/12">
                <TicketCheck width={20} height={20} className="text-[rgba(236,240,255,0.68)]" aria-hidden />
              </div>
              <div>
                <h3 id="quick-actions" className="admin-heading text-xl">Быстрые действия</h3>
                <p className="admin-subheading text-sm">Часто используемые функции</p>
              </div>
            </div>

            <ul className="space-y-3" role="list">
              {QUICK_ACTIONS.map((action) => (
                <QuickActionCard key={action.href} action={action} />
              ))}
            </ul>
          </article>

          {/* Операции */}
          <article className="admin-section min-w-0" aria-labelledby="ops-modules">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 border border-white/12">
                <CreditCard width={20} height={20} className="text-[rgba(236,240,255,0.68)]" aria-hidden />
              </div>
              <div>
                <h3 id="ops-modules" className="admin-heading text-xl">Операции</h3>
                <p className="admin-subheading text-sm">Платежи и транзакции</p>
              </div>
            </div>
            <div className="grid gap-3">
              {OPS_MODULES.map((m) => (
                <ModuleCard key={m.key} m={m} />
              ))}
            </div>
          </article>

          {/* Системные */}
          <article className="admin-section min-w-0" aria-labelledby="system-modules">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 border border-white/12">
                <Settings width={20} height={20} className="text[rgba(236,240,255,0.68)]" aria-hidden />
              </div>
              <div>
                <h3 id="system-modules" className="admin-heading text-xl">Системные</h3>
                <p className="admin-subheading text-sm">Настройки и поддержка</p>
              </div>
            </div>
            <div className="grid gap-3">
              {SYSTEM_MODULES.map((m) => (
                <ModuleCard key={m.key} m={m} />
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}