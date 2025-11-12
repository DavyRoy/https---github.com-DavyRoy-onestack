// src/app/demo/user/dashboard/components/NextBookingCard.tsx
"use client";

import Link from "next/link";
import {
  CalendarPlus,
  CreditCard,
  Pencil,
  XCircle,
  MapPin,
  User2,
  Clock3,
  BadgeCheck,
  ArrowRight,
  Calendar,
  Building,
  Sparkles,
  Zap,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { BookingSummary } from "../data/mockUserDashboard";
import EmptyState from "./EmptyState";
import {
  CARD,
  EYEBROW,
  TITLE,
  BTN_GHOST,
  BTN_PRIMARY,
  NO_OVERFLOW_INLINE,
  FOCUS_RING,
  FOCUS_RING_OFFSET,
  cn,
  useStableId,
} from "./_shared";

interface NextBookingCardProps {
  booking: BookingSummary | null;
  variant?: "default" | "compact" | "detailed";
  withAnimations?: boolean;
}

const statusPreset: Record<
  NonNullable<BookingSummary["status"]>,
  {
    label: string;
    wrap: string;
    dot: string;
    text: string;
    sr: string;
    icon: typeof CheckCircle2;
    gradient: string;
  }
> = {
  confirmed: {
    label: "Подтверждена",
    wrap: "border-emerald-500/40 bg-emerald-500/15 shadow-emerald-500/10",
    dot: "bg-emerald-400 shadow-emerald-400/50",
    text: "text-emerald-300",
    sr: "запись подтверждена",
    icon: CheckCircle2,
    gradient: "from-emerald-500/20 to-green-500/10",
  },
  pending: {
    label: "Ожидает подтверждения",
    wrap: "border-amber-500/40 bg-amber-500/15 shadow-amber-500/10",
    dot: "bg-amber-400 shadow-amber-400/50",
    text: "text-amber-300",
    sr: "запись ожидает подтверждения",
    icon: Clock3,
    gradient: "from-amber-500/20 to-orange-500/10",
  },
  "requires-payment": {
    label: "Требует оплаты",
    wrap: "border-rose-500/40 bg-rose-500/15 shadow-rose-500/10",
    dot: "bg-rose-400 shadow-rose-400/50",
    text: "text-rose-300",
    sr: "запись требует оплаты",
    icon: AlertCircle,
    gradient: "from-rose-500/20 to-pink-500/10",
  },
  draft: {
    label: "Черновик",
    wrap: "border-white/20 bg-white/10 shadow-white/5",
    dot: "bg-white/60 shadow-white/40",
    text: "text-white/70",
    sr: "черновик записи",
    icon: Pencil,
    gradient: "from-white/15 to-white/5",
  },
};

export default function NextBookingCard({
  booking,
  variant = "default",
  withAnimations = true,
}: NextBookingCardProps) {
  const reduced = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // Пустое состояние
  if (!booking) {
    return (
      <motion.div
        initial={withAnimations && !reduced ? { opacity: 0, y: 16 } : {}}
        animate={withAnimations && !reduced ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <EmptyState
          title="Записей пока нет"
          description="Выберите услугу и оформите запись — здесь появятся детали ближайшего визита с напоминаниями и управлением."
          ctaLabel="Подобрать услугу"
          ctaHref="/demo/user/services"
          secondaryCtaLabel="Записаться сейчас"
          secondaryCtaHref="/demo/user/booking"
          tertiaryCtaLabel="Мои записи"
          tertiaryCtaHref="/demo/user/my-bookings"
          tone="brand"
          borderStyle="dashed"
          variant="panel"
          size="md"
          align="start"
          Icon={Calendar}
          badge="Нет активных записей"
          className="w-full"
          withBackground
          withShadow
        />
      </motion.div>
    );
  }

  // ✅ стабильные id
  const uid = useStableId("next-booking");
  const HEADING_ID = `${uid}-heading`;
  const DESC_ID = `${uid}-desc`;
  const DUE_LIVE_ID = `${uid}-due`;

  const st = statusPreset[booking.status];
  const StatusIcon = st.icon;
  const needPayment = booking.status === "requires-payment";
  const isConfirmed = booking.status === "confirmed";

  // Анимации
  const fadeIn = (delay = 0) =>
    reduced || !withAnimations
      ? {}
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.35, ease: "easeOut" },
        };

  const hoverScale =
    reduced || !withAnimations
      ? {}
      : {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          transition: { duration: 0.18 },
        };

  // Форматирование dateTime (ISO, если можно распарсить)
  const dateTimeISO = useMemo(() => {
    if ((booking as any)?.dateISO) return String((booking as any).dateISO);
    const d = /\b(\d{4})[-./](\d{2})[-./](\d{2})\b/.exec(booking.dateLabel);
    const dRU = /\b(\d{2})[.-/](\d{2})[.-/](\d{4})\b/.exec(booking.dateLabel);
    const time = /\b(\d{2}):(\d{2})\b/.exec(booking.timeLabel);
    if (d || dRU) {
      const y = d ? d[1] : dRU![3];
      const m = d ? d[2] : dRU![2];
      const day = d ? d[3] : dRU![1];
      const hh = time ? time[1] : "00";
      const mm = time ? time[2] : "00";
      return `${y}-${m}-${day}T${hh}:${mm}:00`;
    }
    return undefined;
  }, [booking.dateLabel, booking.timeLabel, (booking as any)?.dateISO]);

  const srDetails = ` ${st.sr}. Исполнитель: ${booking.specialist}. Локация: ${booking.location}. Дата ${booking.dateLabel} в ${booking.timeLabel}.`;

  const sizeConfig = {
    default: "min-h-[260px] p-4 sm:p-5",
    compact: "min-h-[220px] p-4",
    detailed: "min-h-[300px] p-5 sm:p-6",
  };

  return (
    <motion.section
      id="next-booking"
      aria-labelledby={HEADING_ID}
      aria-describedby={cn(DESC_ID, needPayment && booking.paymentDue ? DUE_LIVE_ID : "")}
      className={cn(
        CARD,
        NO_OVERFLOW_INLINE,
        sizeConfig[variant],
        "relative overflow-hidden backdrop-blur-sm",
        "transition-all hover:border-white/16",
        variant === "detailed" && "bg-gradient-to-br from-white/10 to-white/5"
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      {...fadeIn(0)}
    >
      {/* Фоновый градиент по статусу */}
      <motion.div
        className={cn("pointer-events-none absolute inset-0 opacity-20", `bg-gradient-to-br ${st.gradient}`)}
        animate={!reduced && isHovered ? { opacity: 0.28 } : { opacity: 0.2 }}
        transition={{ duration: 0.25 }}
        aria-hidden
      />

      {/* Заголовок + статус */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <div className={cn("rounded-lg border p-2", st.wrap)}>
              <Calendar className="h-4 w-4 text-white/70" />
            </div>
            <p className={EYEBROW}>ближайшая запись</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h2
              id={HEADING_ID}
              className={cn(
                TITLE,
                "line-clamp-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
              )}
              title={booking.service}
            >
              {booking.service}
            </h2>

            <motion.div
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium",
                st.wrap,
                st.text
              )}
              aria-label={`Статус: ${st.label}`}
              {...hoverScale}
            >
              <motion.span
                className={cn("h-2 w-2 rounded-full", st.dot)}
                animate={!reduced && isConfirmed ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                aria-hidden
              />
              <StatusIcon className="h-4 w-4" aria-hidden />
              <span className="hidden xs:inline">{st.label}</span>
            </motion.div>
          </div>

          <p id={DESC_ID} className="sr-only">
            {srDetails}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/70">
            <BadgeCheck className="h-4 w-4" aria-hidden />
            <span className="font-mono tabular-nums">#{booking.id}</span>
          </span>

          {variant === "detailed" && (
            <motion.div {...hoverScale}>
              <Link
                href={`/demo/user/my-bookings/${booking.id}`}
                prefetch={false}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 p-2 text-white/70 transition-all hover:bg-white/15 hover:text-white",
                  FOCUS_RING,
                  FOCUS_RING_OFFSET
                )}
                aria-label="Подробнее о записи"
              >
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Детали */}
      <motion.dl
        className={cn(
          "relative z-10 mt-5 grid gap-3 sm:gap-4 text-sm text-white/80",
          variant === "compact"
            ? "grid-cols-1"
            : variant === "detailed"
            ? "grid-cols-1 lg:grid-cols-3"
            : "grid-cols-1 sm:grid-cols-2"
        )}
        {...fadeIn(0.05)}
      >
        {/* Дата и время */}
        <motion.div
          className={cn(
            "rounded-2xl border border-white/15 bg-white/6 p-3 sm:p-4 backdrop-blur-sm transition-all hover:bg-white/8",
            variant === "detailed" && "lg:col-span-2"
          )}
          {...hoverScale}
        >
          <dt className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/70">
            <span className="rounded-lg bg-blue-500/20 p-1.5">
              <Clock3 className="h-4 w-4 text-blue-400" aria-hidden />
            </span>
            Дата и время
          </dt>
          <dd className="mt-2 sm:mt-3 text-base font-semibold text-white tabular-nums">
            {dateTimeISO ? (
              <time dateTime={dateTimeISO} title={`${booking.dateLabel} ${booking.timeLabel}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-400" aria-hidden />
                  <span>{booking.dateLabel}</span>
                  <Zap className="h-4 w-4 text-amber-400" aria-hidden />
                  <span>{booking.timeLabel}</span>
                </div>
              </time>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-400" aria-hidden />
                <span>{booking.dateLabel}</span>
                <Zap className="h-4 w-4 text-amber-400" aria-hidden />
                <span>{booking.timeLabel}</span>
              </div>
            )}
          </dd>
          {variant === "detailed" && booking.duration && (
            <p className="mt-2 text-sm text-white/60">Продолжительность: {booking.duration}</p>
          )}
        </motion.div>

        {/* Исполнитель */}
        <motion.div
          className="rounded-2xl border border-white/15 bg-white/6 p-3 sm:p-4 backdrop-blur-sm transition-all hover:bg-white/8"
          {...hoverScale}
        >
          <dt className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/70">
            <span className="rounded-lg bg-purple-500/20 p-1.5">
              <User2 className="h-4 w-4 text-purple-400" aria-hidden />
            </span>
            Исполнитель
          </dt>
          <dd className="mt-2 sm:mt-3 space-y-2">
            <p className="truncate text-base font-semibold text-white" title={booking.specialist}>
              {booking.specialist}
            </p>
            {variant === "detailed" && booking.specialistRating && (
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(booking.specialistRating!)
                          ? "text-amber-400 fill-amber-400"
                          : "text-white/30"
                      )}
                    />
                  ))}
                </div>
                <span>{booking.specialistRating}</span>
              </div>
            )}
          </dd>
        </motion.div>

        {/* Локация */}
        <motion.div
          className="rounded-2xl border border-white/15 bg-white/6 p-3 sm:p-4 backdrop-blur-sm transition-all hover:bg-white/8"
          {...hoverScale}
        >
          <dt className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/70">
            <span className="rounded-lg bg-green-500/20 p-1.5">
              <Building className="h-4 w-4 text-green-400" aria-hidden />
            </span>
            Локация
          </dt>
          <dd className="mt-2 sm:mt-3">
            <p className="inline-flex items-center gap-2 text-white/90">
              <MapPin className="h-4 w-4 shrink-0 text-green-400" aria-hidden />
              <span className="truncate break-words" title={booking.location}>
                {booking.location}
              </span>
            </p>
            {variant === "detailed" && booking.address && (
              <p className="mt-1 truncate text-sm text-white/60" title={booking.address}>
                {booking.address}
              </p>
            )}
          </dd>
        </motion.div>
      </motion.dl>

      {/* Дополнительно */}
      {variant === "detailed" && booking.notes && (
        <motion.div {...fadeIn(0.1)} className="relative z-10 mt-4">
          <div className="rounded-xl border border-white/15 bg-white/6 p-4">
            <p className="mb-2 text-sm font-medium text-white/90">Дополнительно</p>
            <p className="text-sm text-white/70 leading-relaxed">{booking.notes}</p>
          </div>
        </motion.div>
      )}

      {/* Действия */}
      <motion.div
        className={cn(
          "relative z-10 mt-5 flex flex-wrap gap-2 sm:gap-3",
          variant === "compact" && "flex-col sm:flex-row"
        )}
        {...fadeIn(0.1)}
      >
        <div className="flex flex-1 flex-wrap gap-2 sm:gap-3">
          <motion.div {...hoverScale}>
            <Link
              href={`/demo/user/my-bookings/${booking.id}/edit`}
              prefetch={false}
              className={cn(BTN_GHOST, "h-11 min-h-[44px] px-4 inline-flex items-center gap-2", FOCUS_RING)}
              aria-label="Изменить запись"
            >
              <Pencil className="h-4 w-4" aria-hidden />
              <span>Изменить</span>
            </Link>
          </motion.div>

          <motion.div {...hoverScale}>
            <Link
              href={`/demo/user/my-bookings/${booking.id}?dialog=cancel`}
              prefetch={false}
              className={cn(
                "inline-flex h-11 min-h-[44px] items-center gap-2 rounded-full border border-rose-500/50 bg-rose-500/10 px-4 text-sm font-semibold text-rose-200 transition-all hover:bg-rose-500/20 hover:border-rose-500/60",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/70 focus-visible:ring-offset-2",
                FOCUS_RING_OFFSET
              )}
              aria-label="Отменить запись"
            >
              <XCircle className="h-4 w-4" aria-hidden />
              <span>Отменить</span>
            </Link>
          </motion.div>

          <motion.div {...hoverScale}>
            <Link
              href={`/demo/user/calendar/export?booking=${booking.id}`}
              prefetch={false}
              className={cn(BTN_GHOST, "h-11 min-h-[44px] px-4 inline-flex items-center gap-2", FOCUS_RING)}
              aria-label="Добавить в календарь"
            >
              <CalendarPlus className="h-4 w-4" aria-hidden />
              <span>В календарь</span>
            </Link>
          </motion.div>
        </div>

        <div className="flex gap-2 sm:gap-3">
          {needPayment ? (
            <motion.div {...hoverScale} className="flex-1">
              <Link
                href={`/demo/user/payments/checkout?bookingId=${booking.id}`}
                prefetch={false}
                className={cn(
                  BTN_PRIMARY,
                  "h-11 min-h-[44px] px-6 inline-flex items-center gap-2 font-semibold",
                  "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
                  FOCUS_RING,
                  FOCUS_RING_OFFSET
                )}
                aria-label="Оплатить запись"
              >
                <CreditCard className="h-4 w-4" aria-hidden />
                <span>Оплатить</span>
              </Link>
            </motion.div>
          ) : (
            <motion.div {...hoverScale}>
              <Link
                href={`/demo/user/my-bookings/${booking.id}`}
                prefetch={false}
                className={cn(
                  BTN_PRIMARY,
                  "h-11 min-h-[44px] px-6 inline-flex items-center gap-2 font-semibold",
                  FOCUS_RING,
                  FOCUS_RING_OFFSET
                )}
                aria-label="Подробнее о записи"
              >
                <span>Подробнее</span>
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Липкий мини-бар (мобильный) */}
      <motion.div
        className={cn(
          "sticky bottom-2 z-10 mt-4 grid gap-2 sm:hidden",
          needPayment ? "grid-cols-2" : "grid-cols-1"
        )}
        style={{
          contain: "layout paint style",
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)",
        }}
        initial={withAnimations && !reduced ? { opacity: 0, y: 16 } : {}}
        animate={withAnimations && !reduced ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        {needPayment ? (
          <>
            <motion.div whileTap={!reduced ? { scale: 0.96 } : {}}>
              <Link
                href={`/demo/user/payments/checkout?bookingId=${booking.id}`}
                prefetch={false}
                className={cn(
                  BTN_PRIMARY,
                  "h-12 min-h-[48px] w-full inline-flex items-center justify-center gap-2 text-base font-semibold",
                  "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
                  FOCUS_RING,
                  FOCUS_RING_OFFSET
                )}
              >
                <CreditCard className="h-5 w-5" aria-hidden />
                Оплатить
              </Link>
            </motion.div>
            <motion.div whileTap={!reduced ? { scale: 0.96 } : {}}>
              <Link
                href={`/demo/user/my-bookings/${booking.id}/edit`}
                prefetch={false}
                className={cn(
                  BTN_GHOST,
                  "h-12 min-h-[48px] w-full inline-flex items-center justify-center gap-2 text-base",
                  FOCUS_RING
                )}
              >
                <Pencil className="h-5 w-5" aria-hidden />
                Изменить
              </Link>
            </motion.div>
          </>
        ) : (
          <motion.div whileTap={!reduced ? { scale: 0.96 } : {}}>
            <Link
              href={`/demo/user/my-bookings/${booking.id}`}
              prefetch={false}
              className={cn(
                BTN_PRIMARY,
                "h-12 min-h-[48px] w-full inline-flex items-center justify-center gap-2 text-base font-semibold",
                FOCUS_RING,
                FOCUS_RING_OFFSET
              )}
            >
              <ArrowRight className="h-5 w-5" aria-hidden />
              Подробнее о записи
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Уведомление об оплате */}
      {needPayment && booking.paymentDue && (
        <motion.p
          id={DUE_LIVE_ID}
          className="mt-4 inline-flex items-center gap-3 rounded-xl border border-rose-500/40 bg-rose-500/15 px-4 py-3 text-sm text-rose-200 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          initial={withAnimations && !reduced ? { opacity: 0, scale: 0.95 } : {}}
          animate={withAnimations && !reduced ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.25 }}
        >
          <AlertCircle className="h-5 w-5" aria-hidden />
          <span className="flex-1">{booking.paymentDue}</span>
          <Sparkles className="h-4 w-4 animate-pulse" aria-hidden />
        </motion.p>
      )}
    </motion.section>
  );
}

// Простая иконка звезды для рейтинга
function Star({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}