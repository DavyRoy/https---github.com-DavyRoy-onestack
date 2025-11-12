// src/app/demo/user/dashboard/components/QuickActions.tsx
"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarPlus,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Star,
  Zap,
  HelpCircle,
  Clock,
  Heart,
  Bell,
  MapPin,
  Camera,
  Users,
} from "lucide-react";
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import { useMemo, type ElementType, useState } from "react";
import type { QuickAction } from "../data/mockUserDashboard";
import { mockUserDashboard as MOCK } from "../data/mockUserDashboard";
import EmptyState from "./EmptyState";
import {
  DASHBOARD_CARD,
  DASHBOARD_CARD_SOFT,
  EYEBROW,
  TITLE,
  NO_OVERFLOW_INLINE,
  TAPPABLE,
  FOCUS_RING,
  FOCUS_RING_OFFSET,
  cn,
  useStableId,
} from "./_shared";

type QuickActionsData = { actions: QuickAction[] };

interface QuickActionsProps {
  data?: QuickActionsData;
  actions?: QuickAction[];
  variant?: "grid" | "carousel" | "compact";
  columns?: 2 | 3 | 4 | "auto";
  withAnimations?: boolean;
  maxItems?: number;
}

const intentIcon: Record<
  NonNullable<QuickAction["intent"]>,
  {
    Icon: ElementType;
    tone: "brand" | "success" | "warning" | "danger" | "premium" | "neutral";
    gradient: string;
    description?: string;
  }
> = {
  booking: { Icon: CalendarPlus, tone: "brand", gradient: "from-blue-500 to-purple-600", description: "Запись на услуги" },
  shop: { Icon: ShoppingBag, tone: "neutral", gradient: "from-gray-500 to-gray-600", description: "Магазин товаров" },
  cart: { Icon: ShoppingCart, tone: "warning", gradient: "from-amber-500 to-orange-600", description: "Корзина покупок" },
  payments: { Icon: CreditCard, tone: "success", gradient: "from-green-500 to-emerald-600", description: "Оплата и счета" },
  favorites: { Icon: Heart, tone: "danger", gradient: "from-rose-500 to-pink-600", description: "Избранное" },
  notifications: { Icon: Bell, tone: "warning", gradient: "from-amber-500 to-yellow-600", description: "Уведомления" },
  profile: { Icon: Users, tone: "brand", gradient: "from-indigo-500 to-blue-600", description: "Профиль" },
  support: { Icon: HelpCircle, tone: "neutral", gradient: "from-gray-500 to-slate-600", description: "Поддержка" },
  history: { Icon: Clock, tone: "neutral", gradient: "from-gray-500 to-gray-600", description: "История" },
  loyalty: { Icon: Star, tone: "premium", gradient: "from-purple-500 to-pink-600", description: "Программа лояльности" },
  locations: { Icon: MapPin, tone: "brand", gradient: "from-blue-500 to-cyan-600", description: "Наши адреса" },
  gallery: { Icon: Camera, tone: "premium", gradient: "from-purple-500 to-indigo-600", description: "Галерея работ" },
};

const toneConfig = {
  brand: {
    card: "border-blue-500/30 bg-blue-500/12 hover:bg-blue-500/18",
    icon: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    text: "text-blue-300",
    glow: "shadow-blue-500/15",
  },
  success: {
    card: "border-green-500/30 bg-green-500/12 hover:bg-green-500/18",
    icon: "bg-green-500/20 text-green-400 border-green-500/30",
    text: "text-green-300",
    glow: "shadow-green-500/15",
  },
  warning: {
    card: "border-amber-500/30 bg-amber-500/12 hover:bg-amber-500/18",
    icon: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    text: "text-amber-300",
    glow: "shadow-amber-500/15",
  },
  danger: {
    card: "border-rose-500/30 bg-rose-500/12 hover:bg-rose-500/18",
    icon: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    text: "text-rose-300",
    glow: "shadow-rose-500/15",
  },
  premium: {
    card: "border-purple-500/30 bg-purple-500/12 hover:bg-purple-500/18",
    icon: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    text: "text-purple-300",
    glow: "shadow-purple-500/15",
  },
  neutral: {
    card: "border-white/15 bg-white/8 hover:bg-white/12",
    icon: "bg-white/10 text-white/70 border-white/15",
    text: "text-white/75",
    glow: "shadow-white/5",
  },
};

const isExternal = (href: string) => /^https?:\/\//i.test(href);

export default function QuickActions({
  data,
  actions,
  variant = "grid",
  columns = "auto",
  withAnimations = true,
  maxItems = 8,
}: QuickActionsProps) {
  const reduced = useReducedMotion();

  const uid = useStableId("qa");
  const headingId = `${uid}-heading`;
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const items: QuickAction[] = useMemo(() => {
    const src =
      actions ??
      data?.actions ??
      MOCK?.quickActions ??
      [];
    return src.filter(Boolean).slice(0, maxItems);
  }, [actions, data?.actions, maxItems]);

  const fade = (i = 0): MotionProps =>
    reduced || !withAnimations
      ? {}
      : {
          initial: { opacity: 0, y: 8 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.1 },
          transition: { delay: 0.05 + i * 0.03, duration: 0.4, ease: "easeOut" },
        };

  const scale = reduced || !withAnimations ? {} : { 
    whileHover: { scale: 1.02 }, 
    whileTap: { scale: 0.98 } 
  };

  const pulse = reduced || !withAnimations
    ? {}
    : {
        animate: { scale: [1, 1.01, 1], opacity: [1, 0.9, 1] },
        transition: { duration: 2, repeat: Infinity, repeatType: "reverse" as const },
      };

  const hasActions = items.length > 0;

  // Упрощенная конфигурация сетки для мобильных
  const gridConfig = {
    2: "grid-cols-1 xs:grid-cols-2",
    3: "grid-cols-1 xs:grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    auto: "grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  } as const;

  const sizeConfig = {
    grid: "p-4 sm:p-5",
    carousel: "p-4",
    compact: "p-3 sm:p-4",
  } as const;

  return (
    <motion.section
      {...fade(0)}
      aria-labelledby={headingId}
      className={cn(
        DASHBOARD_CARD,
        NO_OVERFLOW_INLINE,
        sizeConfig[variant],
        "relative overflow-hidden backdrop-blur-sm w-full"
      )}
    >
      {/* Упрощенный фон */}
      {variant !== "compact" && (
        <div 
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/3 via-purple-500/2 to-transparent"
          aria-hidden
        />
      )}

      {/* Заголовок - компактный для мобильных */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-lg bg-white/10 p-2 border border-white/10">
            <Zap className="h-4 w-4 text-white/70" aria-hidden />
          </div>
          <div>
            <p className={cn(EYEBROW, "text-white/60")}>быстрые действия</p>
            <h2
              id={headingId}
              className={cn(TITLE, "text-white/90 text-lg sm:text-xl")}
            >
              Начните с важного
            </h2>
          </div>
        </div>
        
        {variant === "carousel" && hasActions && items.length > 4 && (
          <div className="flex items-center gap-2 text-sm text-white/60">
            <span>Проведите в сторону</span>
            <ArrowUpRight className="h-3 w-3" aria-hidden />
          </div>
        )}
      </div>

      {/* Empty State */}
      {!hasActions ? (
        <motion.div className="relative z-10" {...fade(0.1)}>
          <EmptyState
            title="Нет быстрых действий"
            description="Здесь появятся самые частые задачи"
            tone="brand"
            variant="embedded"
            align="center"
            size="sm"
            Icon={Zap}
          />
        </motion.div>
      ) : (
        <motion.ul
          role="list"
          aria-describedby={headingId}
          className={cn(
            "relative z-10 grid gap-3 w-full",
            gridConfig[columns],
            variant === "carousel" &&
              "grid-flow-col auto-cols-[minmax(160px,1fr)] overflow-x-auto pb-3 -mx-2 px-2 snap-x snap-mandatory scrollbar-hide",
            variant === "compact" && "gap-2"
          )}
        >
          {items.map((action, i) => {
            const preset = action.intent ? intentIcon[action.intent] : undefined;
            const Icon = (preset?.Icon ?? ArrowUpRight) as ElementType;
            const tone = preset?.tone ?? "neutral";
            const config = toneConfig[tone as keyof typeof toneConfig];
            const isPrimary = Boolean(action.highlight);
            const external = isExternal(action.href);
            const hovered = hoveredAction === (action.id || action.href);

            const sr =
              `${action.label}. ${action.description || preset?.description || ""}`.trim() +
              (action.count ? `. Счётчик: ${action.count}.` : "") +
              (action.badge ? ` Бейдж: ${action.badge}.` : "");

            const cardBase = cn(
              DASHBOARD_CARD_SOFT,
              TAPPABLE,
              FOCUS_RING,
              FOCUS_RING_OFFSET,
              "group relative flex flex-col justify-between overflow-hidden text-left backdrop-blur-sm",
              "transition-all duration-200 border",
              config.card,
              config.glow && "shadow-sm",
              variant === "compact" ? "min-h-[100px] p-3" : "min-h-[120px] p-4",
              variant === "carousel" && "snap-start min-w-0",
              "w-full" // Гарантируем полную ширину
            );

            return (
              <motion.li
                key={`${action.id || action.href}-${i}`}
                {...fade(0.05 + i * 0.03)}
                {...(action.highlight ? pulse : {})}
                {...scale}
                onHoverStart={() => setHoveredAction(action.id || action.href)}
                onHoverEnd={() => setHoveredAction(null)}
                className={cn(
                  "w-full min-w-0",
                  variant === "carousel" ? "flex-shrink-0" : ""
                )}
              >
                <Link
                  href={action.href}
                  prefetch={false}
                  aria-label={sr}
                  className={cardBase}
                  {...(external
                    ? { target: "_blank", rel: "noreferrer noopener", title: "Откроется в новой вкладке" }
                    : {})}
                  data-intent={action.intent ?? "link"}
                >
                  {/* Градиент оверлей */}
                  <motion.span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200",
                      "bg-gradient-to-br",
                      preset?.gradient
                    )}
                    animate={hovered ? { opacity: 0.1 } : { opacity: 0 }}
                  />

                  {/* Верхняя строка - иконка и бейджи */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className={cn(
                      "rounded-xl border p-2 flex-shrink-0",
                      config.icon,
                      variant === "compact" ? "p-1.5" : "p-2"
                    )}>
                      <Icon className={cn(
                        variant === "compact" ? "h-4 w-4" : "h-5 w-5"
                      )} />
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
                      {action.count ? (
                        <span
                          className={cn(
                            "inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-full px-1 text-[10px] font-semibold tabular-nums",
                            isPrimary ? "bg-white/20 text-white" : "bg-white/10 text-white/75"
                          )}
                          aria-label={`Количество: ${action.count}`}
                        >
                          {action.count}
                        </span>
                      ) : null}

                      {action.badge ? (
                        <span
                          className={cn(
                            "inline-flex h-5 items-center justify-center rounded-full border px-1.5 text-[9px] font-semibold uppercase tracking-wide",
                            action.badge === "новое"
                              ? "border-green-500/40 bg-green-500/15 text-green-400"
                              : action.badge === "популярно"
                              ? "border-amber-500/40 bg-amber-500/15 text-amber-400"
                              : "border-white/20 bg-white/10 text-white/70"
                          )}
                          aria-label={`Бейдж: ${action.badge}`}
                        >
                          {action.badge}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Текст контент */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-semibold text-white leading-tight mb-1 break-words",
                      variant === "compact" ? "text-sm" : "text-base"
                    )}>
                      {action.label}
                    </p>
                    {(action.description || preset?.description) && (
                      <p
                        className={cn(
                          "leading-relaxed line-clamp-2",
                          variant === "compact" ? "text-xs" : "text-sm",
                          config.text
                        )}
                      >
                        {action.description || preset?.description}
                      </p>
                    )}
                  </div>

                  {/* CTA стрелка */}
                  <div className={cn(
                    "mt-3 inline-flex items-center gap-1 font-medium tracking-wide",
                    variant === "compact" ? "text-xs" : "text-sm",
                    config.text
                  )}>
                    <span>Перейти</span>
                    <ArrowUpRight className={cn(
                      "transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-[-0.5px]",
                      variant === "compact" ? "h-3 w-3" : "h-3.5 w-3.5"
                    )} aria-hidden />
                  </div>

                  {/* Свечение для highlight */}
                  {action.highlight && (
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-xl"
                      animate={!reduced ? { 
                        boxShadow: [
                          "0 0 12px 0 rgba(59,130,246,.2)", 
                          "0 0 18px 2px rgba(59,130,246,.3)", 
                          "0 0 12px 0 rgba(59,130,246,.2)"
                        ] 
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    />
                  )}
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      )}

      {/* Упрощенный индикатор прокрутки */}
      {variant === "carousel" && hasActions && items.length > 4 && (
        <motion.div className="relative z-10 mt-4 flex justify-center" {...fade(0.3)}>
          <div className="flex gap-1">
            {[...Array(Math.ceil(items.length / 3))].map((_, i) => (
              <div 
                key={i} 
                className="h-1 w-6 rounded-full bg-white/20 transition-all hover:bg-white/40" 
              />
            ))}
          </div>
        </motion.div>
      )}

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.section>
  );
}