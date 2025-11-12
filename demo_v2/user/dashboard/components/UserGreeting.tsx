// src/app/demo/user/dashboard/components/UserGreeting.tsx
"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  User2,
  Sparkles,
  Zap,
  Crown,
  Star,
  Clock,
  Settings,
  Bell,
  TrendingUp,
  Award,
} from "lucide-react";
import { cn, SECTION_WRAP, TITLE_SM, statusTone as toneFromShared } from "./_shared";
import type { MockUserDashboard } from "../data/mockUserDashboard";

type Props = {
  user?: MockUserDashboard["user"] & {
    avatarUrl?: string | null;
    membership?: string;
    points?: number;
    joinDate?: string;
    achievements?: string[];
  };
  variant?: "default" | "compact" | "premium" | "minimal";
  withAnimations?: boolean;
  showStats?: boolean;
};

/* ---------------- helpers ---------------- */

function bookingAccent(label?: string) {
  const t = (label ?? "").toLowerCase();
  if (/(сегодня|today)/.test(t)) return "border-emerald-500/40 bg-emerald-500/15";
  if (/(завтра|tomorrow)/.test(t)) return "border-blue-500/40 bg-blue-500/15";
  if (/(скоро|soon)/.test(t)) return "border-amber-500/40 bg-amber-500/15";
  return "border-white/20 bg-white/10";
}

function initials(name?: string) {
  const n = (name ?? "").trim();
  if (!n) return "U";
  const parts = n.split(/\s+/).slice(0, 2);
  const chars = parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
  return chars || "U";
}

/** Приветствие по времени суток с сезонными вариациями */
function greetingNow() {
  try {
    const now = new Date();
    const h = now.getHours();
    const month = now.getMonth();

    const seasonal =
      month >= 11 || month <= 1 ? "❄️" : month >= 2 && month <= 4 ? "🌷" : month >= 5 && month <= 7 ? "☀️" : "🍂";

    if (h >= 5 && h < 12) return `${seasonal} Доброе утро`;
    if (h >= 12 && h < 18) return `${seasonal} Добрый день`;
    if (h >= 18 && h < 23) return `${seasonal} Добрый вечер`;
    return `${seasonal} Здравствуйте`;
  } catch {
    return "👋 Здравствуйте";
  }
}

/** Конфигурация уровней членства */
const MEMBERSHIP_CONFIG = {
  premium: {
    icon: Crown,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    label: "Премиум",
  },
  vip: {
    icon: Star,
    color: "text-purple-400",
    bg: "bg-purple-500/15",
    border: "border-purple-500/30",
    label: "VIP",
  },
  standard: {
    icon: BadgeCheck,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
    label: "Стандарт",
  },
  new: {
    icon: Sparkles,
    color: "text-green-400",
    bg: "bg-green-500/15",
    border: "border-green-500/30",
    label: "Новый",
  },
} as const;

/** Жёсткая карта цветов для онлайн-точки (чтобы не сломал purge) */
const DOT_BY_MEMBERSHIP: Record<keyof typeof MEMBERSHIP_CONFIG, string> = {
  premium: "bg-amber-500",
  vip: "bg-purple-500",
  standard: "bg-blue-500",
  new: "bg-green-500",
};

/* ---------------- component ---------------- */

export default function UserGreeting({
  user,
  variant = "default",
  withAnimations = true,
  showStats = true,
}: Props) {
  const reduced = useReducedMotion();

  const headingId = useId();
  const subTitleId = useId();
  const nextDescId = useId();
  const statusId = useId();

  const fade = (d = 0): MotionProps =>
    reduced || !withAnimations
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.15 },
          transition: {
            delay: d,
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        };

  const scale = reduced || !withAnimations ? {} : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } };

  const name = (user?.name ?? "Гость").trim() || "Гость";
  const status = (user?.status ?? "Участник").trim() || "Участник";
  const nextBookingLabel = user?.nextBookingLabel ?? "Запись не запланирована";
  const nextBookingHref = user?.nextBookingId
    ? `/demo/user/my-bookings/${encodeURIComponent(user.nextBookingId)}`
    : "/demo/user/booking";
  const membership = ((user?.membership as keyof typeof MEMBERSHIP_CONFIG) || "standard") as keyof typeof MEMBERSHIP_CONFIG;
  const membershipConfig = MEMBERSHIP_CONFIG[membership] || MEMBERSHIP_CONFIG.standard;
  const MembershipIcon = membershipConfig.icon;

  const tone = useMemo(() => toneFromShared(status), [status]);
  const bookingTone = useMemo(() => bookingAccent(nextBookingLabel), [nextBookingLabel]);

  const describedBy = `${subTitleId} ${statusId}`;

  // SSR-safe приветствие/время/дата
  const [greet, setGreet] = useState<string>("👋 Здравствуйте");
  const [time, setTime] = useState<string>("");
  const [dateLabel, setDateLabel] = useState<string>("");

  useEffect(() => {
    setGreet(greetingNow());

    const updateTime = () => {
      setTime(
        new Intl.DateTimeFormat("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date())
      );
    };

    const updateDate = () => {
      setDateLabel(
        new Intl.DateTimeFormat("ru-RU", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date())
      );
    };

    updateTime();
    updateDate();

    const tId = setInterval(updateTime, 60_000);
    // дату достаточно обновлять раз в сутки, но для простоты — при маунте
    return () => {
      clearInterval(tId);
    };
  }, []);

  // Конфигурация вариантов
  const sizeConfig = {
    default: "p-5 sm:p-6",
    compact: "p-4",
    premium: "p-6 sm:p-7",
    minimal: "p-3",
  };

  return (
    <motion.section
      {...fade(0)}
      role="region"
      aria-labelledby={headingId}
      aria-describedby={describedBy}
      className={cn(
        SECTION_WRAP,
        "w-full min-w-0 relative overflow-hidden backdrop-blur-sm",
        sizeConfig[variant],
        variant === "premium" && "bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-pink-500/5"
      )}
      style={{ contain: "layout paint style" }}
    >
      {/* Стабильный фон: анимируем только opacity, а не сам градиент */}
      {variant === "premium" && (
        <motion.div
          aria-hidden
          className="absolute inset-0"
          initial={{ opacity: 0.35 }}
          animate={{ opacity: withAnimations && !reduced ? [0.35, 0.55, 0.35] : 0.4 }}
          transition={{ duration: 8, repeat: Infinity }}
          style={{
            background:
              "radial-gradient(60% 60% at 20% 20%, rgba(245, 158, 11, 0.10), transparent), radial-gradient(60% 60% at 80% 20%, rgba(168, 85, 247, 0.10), transparent)",
          }}
        />
      )}

      <div
        className={cn(
          "flex w-full min-w-0 flex-col gap-6",
          variant === "minimal" ? "gap-4" : "md:flex-row md:items-start md:justify-between"
        )}
      >
        {/* Левая часть - Основная информация */}
        <div className="min-w-0 flex-1">
          <div className={cn("flex items-start gap-4", variant === "minimal" ? "mb-3" : "mb-4 sm:mb-5")}>
            {/* Аватар */}
            <motion.div
              className={cn(
                "grid place-items-center overflow-hidden border bg-white/10 text-white/90 relative",
                "border-white/20 backdrop-blur-sm",
                variant === "premium" && "border-amber-500/30 bg-amber-500/10",
                variant === "minimal" ? "h-10 w-10 rounded-lg" : "h-12 w-12 rounded-2xl sm:h-14 sm:w-14"
              )}
              aria-hidden
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.2 }}
            >
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
              ) : user?.name?.trim() ? (
                <span className={cn("font-semibold", variant === "minimal" ? "text-sm" : "text-base sm:text-lg")}>
                  {initials(user?.name)}
                </span>
              ) : (
                <User2 className={cn("opacity-80", variant === "minimal" ? "h-4 w-4" : "h-6 w-6")} />
              )}

              {/* Индикатор статуса онлайн — фикс маппингом классов */}
              {variant !== "minimal" && (
                <motion.div
                  aria-hidden
                  className={cn(
                    "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[hsl(var(--bg))]",
                    DOT_BY_MEMBERSHIP[membership]
                  )}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>

            {/* Статусы и бейджи */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <motion.div
                  id={statusId}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold",
                    tone.wrap,
                    tone.text
                  )}
                  whileHover={{ scale: 1.05 }}
                  aria-label={`Ваш статус: ${status}`}
                >
                  <BadgeCheck className={cn("h-4 w-4", tone.icon)} />
                  <span>{status}</span>
                </motion.div>

                <motion.div
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold",
                    membershipConfig.bg,
                    membershipConfig.border,
                    membershipConfig.color
                  )}
                  whileHover={{ scale: 1.05 }}
                >
                  <MembershipIcon className="h-4 w-4" />
                  <span>{membershipConfig.label}</span>
                </motion.div>

                {variant === "premium" && user?.points && (
                  <motion.div
                    className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/15 px-3 py-1.5 text-sm font-semibold text-purple-400"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Award className="h-4 w-4" />
                    <span>{user.points} баллов</span>
                  </motion.div>
                )}
              </div>

              {/* Время и дата для premium — без hydration mismatch */}
              {variant === "premium" && (
                <motion.p
                  className="text-sm text-white/60 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span suppressHydrationWarning>{time}</span> •{" "}
                  <time dateTime={new Date().toISOString()} suppressHydrationWarning>
                    {dateLabel}
                  </time>
                </motion.p>
              )}
            </div>
          </div>

          {/* Заголовок и приветствие */}
          <p
            className={cn(
              "uppercase tracking-wider text-white/60",
              variant === "minimal" ? "text-xs mb-1" : "text-sm mb-2"
            )}
          >
            личный кабинет
          </p>

          <h2
            id={headingId}
            className={cn(
              TITLE_SM,
              "text-white leading-tight",
              variant === "minimal" ? "text-xl" : variant === "compact" ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl md:text-5xl",
              variant === "premium" && "bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent"
            )}
          >
            <span suppressHydrationWarning>{greet}</span>,
            <br className={variant === "minimal" ? "hidden" : ""} />
            <span className="whitespace-pre-wrap break-words"> {name}!</span>
          </h2>

          <p
            id={subTitleId}
            className={cn("text-white/70 max-w-2xl mt-3", variant === "minimal" ? "text-xs" : "text-sm sm:text-base")}
          >
            {variant === "premium"
              ? "Ваш премиум-доступ открывает эксклюзивные возможности. Управляйте всем в одном месте с приоритетной поддержкой."
              : "Управляйте записями, заказами и бонусами без переключения контекстов — всё в одном месте."}
          </p>

          {/* Статистика и достижения */}
          {showStats && variant !== "minimal" && (
            <motion.div className="flex flex-wrap gap-4 mt-4" {...fade(0.2)}>
              {user?.joinDate && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Clock className="h-4 w-4" />
                  <span>С {user.joinDate}</span>
                </div>
              )}

              {user?.achievements && user.achievements.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <TrendingUp className="h-4 w-4" />
                  <span>{user.achievements.length} достижений</span>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Правая часть - Ближайшая запись */}
        {variant !== "minimal" && (
          <motion.div
            {...fade(0.05)}
            {...scale}
            className={cn(
              "w-full min-w-0 flex flex-col gap-4 rounded-2xl border p-4 backdrop-blur-sm",
              bookingTone,
              variant === "premium" && "border-amber-500/40 bg-amber-500/10",
              "sm:max-w-[400px] lg:max-w-[460px]"
            )}
            role="region"
            aria-labelledby={nextDescId}
            aria-live="polite"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "rounded-lg p-2 border",
                  variant === "premium" ? "border-amber-500/30 bg-amber-500/20" : "border-white/20 bg-white/10"
                )}
              >
                <CalendarCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span id={nextDescId}>Ближайшая запись</span>
                  {nextBookingLabel.toLowerCase().includes("сегодня") && (
                    <motion.span
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-400 border border-emerald-500/30"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Zap className="h-3 w-3" />
                      Сегодня
                    </motion.span>
                  )}
                </div>
                <p className="text-sm text-white/75 mt-1">{nextBookingLabel}</p>
              </div>
            </div>

            <div className={cn("grid gap-2", variant === "compact" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2")}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={nextBookingHref}
                  prefetch={false}
                  className={cn(
                    "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-all",
                    "border-white/20 bg-white/10 text-white/90 hover:bg-white/15",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  )}
                  aria-label={`Открыть запись: ${nextBookingLabel}`}
                >
                  <span>Посмотреть</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/demo/user/booking?intent=quick"
                  prefetch={false}
                  className={cn(
                    "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold text-white transition-all",
                    variant === "premium"
                      ? "border-amber-500 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                      : "border-blue-500 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  )}
                  title="Быстрая запись"
                >
                  <Sparkles className="h-4 w-4" />
                  Записаться
                </Link>
              </motion.div>

              {variant !== "compact" && (
                <motion.div className="sm:col-span-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/demo/user/calendar"
                    prefetch={false}
                    className={cn(
                      "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm text-white/80 transition-all hover:bg-white/10 hover:text-white",
                      "border-white/15 bg-white/5",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    )}
                    title="К календарю"
                  >
                    <CalendarCheck className="h-4 w-4" />
                    Открыть календарь
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Мини-бар действий для мобильных */}
      {(variant === "default" || variant === "compact") && (
        <motion.div
          className="sticky bottom-2 z-10 mt-4 grid grid-cols-2 gap-3 sm:hidden"
          style={{ contain: "layout paint style", bottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div whileTap={{ scale: 0.95 }}>
            <Link
              href={nextBookingHref}
              prefetch={false}
              className={cn(
                "inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-medium text-white backdrop-blur transition-all hover:bg-white/14 w-full",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              )}
              aria-label={`Открыть ближайшую запись: ${nextBookingLabel}`}
            >
              Моя запись
            </Link>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Link
              href="/demo/user/booking?intent=quick"
              prefetch={false}
              className={cn(
                "inline-flex h-12 items-center justify-center rounded-xl border px-4 text-sm font-semibold text-white backdrop-blur transition-all w-full",
                "border-blue-500 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              )}
              title="Новая запись"
            >
              Новая запись
            </Link>
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
}