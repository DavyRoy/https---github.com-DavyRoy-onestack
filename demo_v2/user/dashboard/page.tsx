// app/demo/user/dashboard/page.tsx
"use client";

import { useMemo, useState, type ComponentType, type SVGProps } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ShoppingCart,
  CreditCard,
  Sparkles,
  ArrowRight,
  Home,
  ChevronRight,
  Star,
  Shield,
  MapPin,
  Bell,
  User,
} from "lucide-react";
import {
  cn,
  DASHBOARD_CARD,
  CARD,
  CARD_SOFT,
  EYEBROW,
  TITLE_SM,
  SUBTITLE_SM,
  BTN_PRIMARY,
  BTN_GHOST,
  BADGE_NEUTRAL,
  TAPPABLE,
} from "./components/_shared";
import KpiRow from "./components/KpiRow";
import NextBookingCard from "./components/NextBookingCard";
import OrdersWidget from "./components/OrdersWidget";
import PaymentsWidget from "./components/PaymentsWidget";
import ServicesWidget from "./components/ServicesWidget";
import CalendarPeek from "./components/CalendarPeek";
import Announcements from "./components/Announcements";
import QuickActions from "./components/QuickActions";
import LoyaltyWidget from "./components/LoyaltyWidget";
import SupportShortcut from "./components/SupportShortcut";
import UserGreeting from "./components/UserGreeting";
import CartWidget from "./components/CartWidget";
import { buildMockUserDashboard, type MockUserDashboard } from "./data/mockUserDashboard";

/* ----------------------------- types & small UI ----------------------------- */

type HeroHighlight = {
  label: string;
  value: string;
  hint?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href?: string;
};

type SnapshotCard = {
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
};

function HeroHighlightCard({ highlight }: { highlight: HeroHighlight }) {
  const Icon = highlight.icon;

  return (
    <Link
      href={highlight.href ?? "/demo/user/dashboard"}
      prefetch={false}
      className={cn(
        CARD_SOFT,
        // убран min-w на мобильном — иначе появлялся горизонтальный скролл
        "group relative flex min-w-0 flex-col gap-1.5 rounded-2xl border border-white/12 bg-white/8 p-3 text-white transition-all duration-300 hover:border-white/20 hover:bg-white/12 hover:shadow-soft w-full",
        TAPPABLE
      )}
    >
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[rgba(236,240,255,0.64)]">
        <Icon className="h-3.5 w-3.5 flex-shrink-0" aria-hidden />
        <span className="truncate">{highlight.label}</span>
      </div>
      <p className="text-base font-bold text-[rgba(255,255,255,0.92)] tabular-nums leading-tight truncate">
        {highlight.value}
      </p>
      {highlight.hint ? (
        <p className="text-[11px] text-[rgba(236,240,255,0.64)] leading-tight line-clamp-2 break-words">
          {highlight.hint}
        </p>
      ) : null}
      <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[rgba(236,240,255,0.64)] transition-all group-hover:text-[rgba(255,255,255,0.92)] group-hover:gap-1.5">
        Перейти{" "}
        <ArrowRight
          className="h-3 w-3 transition-transform group-hover:translate-x-0.5 flex-shrink-0"
          aria-hidden
        />
      </span>
    </Link>
  );
}

function SnapshotCardItem({ card }: { card: SnapshotCard }) {
  const Icon = card.icon;
  return (
    <Link
      href={card.href}
      prefetch={false}
      className={cn(
        CARD_SOFT,
        "group flex items-center justify-between gap-3 rounded-xl border border-white/12 bg-white/8 p-3 text-sm text-white transition-all duration-300 hover:border-white/16 hover:bg-white/12 w-full min-w-0",
        TAPPABLE
      )}
    >
      <div className="min-w-0 flex items-center gap-2 flex-1">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 transition-colors group-hover:bg-white/12">
          <Icon className="h-4 w-4 text-[rgba(236,240,255,0.64)] flex-shrink-0" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[rgba(255,255,255,0.92)]">{card.title}</p>
          <p className="truncate text-xs text-[rgba(236,240,255,0.64)]">{card.description}</p>
        </div>
      </div>
      <ArrowRight
        className="h-3.5 w-3.5 shrink-0 text-[rgba(236,240,255,0.48)] transition-transform group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}

/* ---------------------------------- page ----------------------------------- */

export default function UserDashboardPage() {
  const [nowTs] = useState(() => Date.now());
  const data: MockUserDashboard = useMemo(() => buildMockUserDashboard(new Date(nowTs)), [nowTs]);

  const heroHighlights: HeroHighlight[] = useMemo(() => {
    const nextBooking =
      data.nextBooking && data.nextBooking.dateLabel && data.nextBooking.timeLabel
        ? {
            label: "Ближайшая запись",
            value: `${data.nextBooking.dateLabel.split(",")[1]?.trim() ?? data.nextBooking.dateLabel}`,
            hint: `${data.nextBooking.timeLabel} • ${data.nextBooking.service}`,
            icon: CalendarDays,
            href: `/demo/user/my-bookings/${data.nextBooking.id}`,
          }
        : {
            label: "Ближайшая запись",
            value: "Нет записей",
            hint: "Запишитесь всего за пару кликов",
            icon: CalendarDays,
            href: "/demo/user/booking",
          };

    const activeOrders = {
      label: "Активные заказы",
      value: String(data.orders?.length ?? 0),
      hint: data.orders?.[0]?.statusLabel ? `Последний: ${data.orders[0].statusLabel}` : undefined,
      icon: ShoppingCart,
      href: "/demo/user/my-orders",
    };

    const duePayment = data.payments?.due?.[0]
      ? {
          label: "К оплате",
          value: data.payments.due[0].amount,
          hint: data.payments.due[0].title,
          icon: CreditCard,
          href: data.payments.due[0].href ?? "/demo/user/checkout",
        }
      : {
          label: "Платежи",
          value: "Оплачено",
          hint: "Нет ожидающих оплат",
          icon: CreditCard,
          href: "/demo/user/checkout",
        };

    const loyalty = {
      label: "Бонусы",
      value: `${data.loyalty?.balance ?? "0"} ${data.loyalty?.currency ?? "₽"}`,
      hint: data.loyalty?.tier ? `Статус: ${data.loyalty.tier}` : undefined,
      icon: Star,
      href: "/demo/user/settings?tab=loyalty",
    };

    return [nextBooking, activeOrders, duePayment, loyalty];
  }, [data]);

  const snapshotCards: SnapshotCard[] = useMemo(
    () => [
      {
        title: "Роль менеджера",
        description: "Продажи, CRM и воронка",
        icon: User,
        href: "/demo/manager/dashboard",
      },
      {
        title: "Роль администратора",
        description: "Управление сетью салонов",
        icon: Shield,
        href: "/demo/admin/dashboard",
      },
    ],
    []
  );

  return (
    <div
      className="admin-page mx-auto w-full max-w-full px-3 pt-3 sm:px-4 md:px-6 lg:px-8 box-border overflow-x-hidden"
      // безопасный нижний отступ под таббар и safe-area
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + var(--tabbar-h, 64px) + 12px)" }}
    >
      {/* HERO */}
      <section
        className={cn(
          DASHBOARD_CARD,
          "admin-glass relative mb-6 overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-white/10 via-white/6 to-white/10 p-3 sm:p-4 w-full box-border"
        )}
      >
        <div className="relative flex min-w-0 flex-col gap-3 w-full">
          {/* компактные крошки внутри hero (не дублируют общие) */}
          <nav className="flex items-center gap-1 text-xs text-[rgba(236,240,255,0.64)] w-full" aria-label="Хлебные крошки">
            <Link
              href="/demo/user"
              prefetch={false}
              className="inline-flex items-center gap-1 rounded px-1 py-0.5 transition-all hover:bg-white/10 hover:text-[rgba(255,255,255,0.92)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 flex-shrink-0"
            >
              <Home className="h-3 w-3 flex-shrink-0" aria-hidden />
              <span className="truncate">Личный кабинет</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-[rgba(236,240,255,0.48)] flex-shrink-0" aria-hidden />
            <span aria-current="page" className="font-medium text-[rgba(255,255,255,0.92)] truncate">
              Дашборд
            </span>
          </nav>

          <div className="space-y-1.5 w-full">
            <h1 className="text-[20px] font-bold text-[rgba(255,255,255,0.92)] sm:text-2xl break-words">
              Добро пожаловать, {data.user?.name?.split(" ")[0] || "Алексей"}!
            </h1>
            <p className={cn(SUBTITLE_SM, "text-[13px] leading-relaxed text-[rgba(236,240,255,0.64)] sm:text-sm break-words")}>
              Следите за визитами, управляйте заказами и оплачивайте счета в одном месте.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full">
            <Link
              href="/demo/user/booking"
              prefetch={false}
              className={cn(BTN_PRIMARY, "rounded-xl px-4 py-2 text-sm flex-shrink-0")}
            >
              Новая запись
            </Link>
            <Link
              href="/demo/user/shop"
              prefetch={false}
              className={cn(
                BTN_GHOST,
                "rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-[rgba(255,255,255,0.92)] transition-all hover:bg-white/15 flex-shrink-0"
              )}
            >
              В магазин
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 w-full">
            {heroHighlights.map((h) => (
              <HeroHighlightCard key={h.label} highlight={h} />
            ))}
          </div>
        </div>
      </section>

      {/* Приветствие пользователя */}
      <section className="mb-6 w-full box-border">
        <UserGreeting user={data.user} withAnimations={false} />
      </section>

      {/* KPI показатели */}
      <section className="mb-6 w-full box-border">
        <KpiRow items={data.kpis} />
      </section>

      {/* Виджет лояльности */}
      <section className="mb-6 w-full box-border">
        <LoyaltyWidget data={data.loyalty} withAnimations={false} />
      </section>

      {/* Виджет корзины */}
      <section className="mb-6 w-full box-border">
        <CartWidget cart={data.cart} />
      </section>

      {/* Быстрые действия */}
      <section className="mb-6 w-full box-border">
        <div className="admin-section rounded-2xl p-4 border border-white/12 bg-white/8 w-full box-border">
          <header className="mb-3 flex flex-wrap items-center justify-between gap-2 w-full">
            <div className="min-w-0 flex-1">
              <p className={cn(EYEBROW, "text-xs text-[rgba(236,240,255,0.64)] truncate")}>Приоритетные действия</p>
              <h2 className={cn(TITLE_SM, "text-base text-[rgba(255,255,255,0.92)] break-words")}>Что сделать прямо сейчас</h2>
            </div>
            <span className={cn(BADGE_NEUTRAL, "text-xs text-[rgba(236,240,255,0.64)] flex-shrink-0")}>
              {data.quickActions?.length ?? 0} действия
            </span>
          </header>
          {/* исправлено: компонент ожидает prop `actions`, а не `items` */}
          <QuickActions actions={data.quickActions} withAnimations={false} />
        </div>
      </section>

      {/* Виджет заказов */}
      <section className="mb-6 w-full box-border">
        <OrdersWidget data={data.orders} />
      </section>

      {/* Карточка следующего бронирования */}
      <section className="mb-6 w-full box-border">
        <NextBookingCard booking={data.nextBooking} />
      </section>

      {/* Виджет платежей */}
      <section className="mb-6 w-full box-border">
        <PaymentsWidget data={data.payments} withAnimations={false} />
      </section>

      {/* Виджет услуг */}
      <section className="mb-6 w-full box-border">
        <ServicesWidget services={data.services} withAnimations={false} />
      </section>

      {/* Календарь */}
      <section className="mb-6 w-full box-border">
        <CalendarPeek week={data.calendar} />
      </section>

      {/* Анонсы */}
      <section className="mb-6 w-full box-border">
        <Announcements list={data.announcements} />
      </section>

      {/* Поддержка */}
      <section className="mb-6 w-full box-border">
        <SupportShortcut support={data.support} withAnimations={false} />
      </section>

      {/* Настройки профиля */}
      <section className="mb-6 w-full box-border">
        <article className={cn(CARD, "admin-section rounded-2xl border border-white/12 bg-white/8 p-4 w-full box-border")}>
          <header className="mb-3 flex flex-wrap items-center justify-between gap-2 w-full">
            <div className="min-w-0 flex-1">
              <p className={cn(EYEBROW, "text-xs text-[rgba(236,240,255,0.64)] break-words")}>Профиль и настройки</p>
              <h2 className={cn(TITLE_SM, "text-base text-[rgba(255,255,255,0.92)] break-words")}>Персональные предпочтения</h2>
            </div>
            <Link
              href="/demo/user/settings"
              prefetch={false}
              className={cn(
                BTN_GHOST,
                "rounded-xl px-3 py-1.5 text-xs text-[rgba(236,240,255,0.72)] transition-all hover:bg-white/10 hover:text-[rgba(255,255,255,0.92)] flex-shrink-0 whitespace-nowrap"
              )}
            >
              Настройки
            </Link>
          </header>

          <div className="grid gap-2 sm:grid-cols-2 w-full">
            <div
              className={cn(
                CARD_SOFT,
                "rounded-xl border border-white/12 bg-white/10 p-3 transition-all hover:border-white/20 hover:bg-white/12 w-full min-w-0"
              )}
            >
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 flex-shrink-0">
                  <Bell className="h-3.5 w-3.5 text-[rgba(236,240,255,0.64)] flex-shrink-0" aria-hidden />
                </div>
                <span className="text-sm font-semibold text-[rgba(255,255,255,0.92)] break-words">Уведомления</span>
              </div>
              <p className="text-xs leading-tight text-[rgba(236,240,255,0.64)] break-words">
                Push и Email активны, напоминания за 2 часа до визита.
              </p>
            </div>

            <div
              className={cn(
                CARD_SOFT,
                "rounded-xl border border-white/12 bg-white/10 p-3 transition-all hover:border-white/20 hover:bg-white/12 w-full min-w-0"
              )}
            >
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 flex-shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-[rgba(236,240,255,0.64)] flex-shrink-0" aria-hidden />
                </div>
                <span className="text-sm font-semibold text-[rgba(255,255,255,0.92)] break-words">Адреса</span>
              </div>
              <p className="text-xs leading-tight text-[rgba(236,240,255,0.64)] break-words">
                Дом и офис подтверждены. Добавьте фитнес-клуб.
              </p>
            </div>

            <div
              className={cn(
                CARD_SOFT,
                "rounded-xl border border-white/12 bg-white/10 p-3 transition-all hover:border-white/20 hover:bg-white/12 w-full min-w-0"
              )}
            >
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 flex-shrink-0">
                  <Sparkles className="h-3.5 w-3.5 text-[rgba(236,240,255,0.64)] flex-shrink-0" aria-hidden />
                </div>
                <span className="text-sm font-semibold text-[rgba(255,255,255,0.92)] break-words">Персонализация</span>
              </div>
              <p className="text-xs leading-tight text-[rgba(236,240,255,0.64)] break-words">
                AI-подбор услуг включён, подборка по интересам.
              </p>
            </div>

            <div
              className={cn(
                CARD_SOFT,
                "rounded-xl border border-white/12 bg-white/10 p-3 transition-all hover:border-white/20 hover:bg-white/12 w-full min-w-0"
              )}
            >
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 flex-shrink-0">
                  <Shield className="h-3.5 w-3.5 text-[rgba(236,240,255,0.64)] flex-shrink-0" aria-hidden />
                </div>
                <span className="text-sm font-semibold text-[rgba(255,255,255,0.92)] break-words">Безопасность</span>
              </div>
              <p className="text-xs leading-tight text-[rgba(236,240,255,0.64)] break-words">
                2FA включена. Последний вход — сегодня.
              </p>
            </div>
          </div>
        </article>
      </section>

      {/* Другие роли */}
      <section className="mb-6 w-full box-border">
        <article className={cn(CARD, "admin-section rounded-2xl border border-white/12 bg-white/8 p-4 w-full box-border")}>
          <header className="mb-3">
            <p className={cn(EYEBROW, "text-xs text-[rgba(236,240,255,0.64)] break-words")}>Попробуйте другие роли</p>
            <h2 className={cn(TITLE_SM, "text-base text-[rgba(255,255,255,0.92)] break-words")}>OneStack для команды</h2>
          </header>
          <div className="grid gap-2 w-full">
            {snapshotCards.map((card) => (
              <SnapshotCardItem key={card.title} card={card} />
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}