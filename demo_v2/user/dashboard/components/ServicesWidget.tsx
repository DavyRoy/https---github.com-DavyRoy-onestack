// src/app/demo/user/dashboard/components/ServicesWidget.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarPlus,
  Clock,
  Star,
  Sparkles,
  Zap,
  Heart,
  TrendingUp,
  Shield,
  Crown,
  BadgeCheck,
} from "lucide-react";
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import type { ServiceRecommendation } from "../data/mockUserDashboard";
import EmptyState from "./EmptyState";
import {
  CARD,
  EYEBROW,
  TITLE_SM,
  BTN_PRIMARY,
  BTN_GHOST,
  NO_OVERFLOW_INLINE,
  CLAMP_2,
  TAPPABLE,
  FOCUS_RING,
  FOCUS_RING_OFFSET,
  cn,
  useStableId,
} from "./_shared";

interface ServicesWidgetProps {
  services?: ServiceRecommendation[];
  title?: string;
  subtitle?: string;
  allHref?: string;
  limit?: number;
  variant?: "grid" | "carousel" | "compact" | "featured";
  columns?: 2 | 3 | 4 | "auto";
  withAnimations?: boolean;
  showCategories?: boolean;
}

const isExternal = (href: string) => /^https?:\/\//i.test(href);

/** Конфигурация категорий услуг */
const CATEGORY_CONFIG = {
  beauty: { icon: Sparkles, color: "text-pink-400", bg: "bg-pink-500/15", border: "border-pink-500/30", label: "Красота" },
  wellness: { icon: Heart, color: "text-rose-400", bg: "bg-rose-500/15", border: "border-rose-500/30", label: "Здоровье" },
  premium: { icon: Crown, color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/30", label: "Премиум" },
  express: { icon: Zap, color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/30", label: "Экспресс" },
  popular: { icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/15", border: "border-green-500/30", label: "Популярное" },
  new: { icon: Star, color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/30", label: "Новинка" },
} as const;

/** Конфигурация "сложности" */
const DIFFICULTY_CONFIG = {
  easy: { label: "Простая", color: "text-emerald-400" },
  medium: { label: "Средняя", color: "text-amber-400" },
  hard: { label: "Сложная", color: "text-rose-400" },
} as const;

export default function ServicesWidget({
  services,
  title = "Попробуйте новые услуги",
  subtitle,
  allHref = "/demo/user/services",
  limit,
  variant = "grid",
  columns = "auto",
  withAnimations = true,
  showCategories = true,
}: ServicesWidgetProps) {
  const reduced = useReducedMotion();

  // стабильные SSR-id
  const uid = useStableId("svc");
  const headingId = `${uid}-heading`;
  const descId = `${uid}-desc`;
  const countId = `${uid}-count`;

  const [hoveredService, setHoveredService] = useState<string | null>(null);

  // Нормализация входа + limit
  const items: ServiceRecommendation[] = useMemo(() => {
    const src = Array.isArray(services) ? services.filter(Boolean) : [];
    return typeof limit === "number" ? src.slice(0, Math.max(0, limit)) : src;
  }, [services, limit]);

  const hasItems = items.length > 0;

  const fade = (i = 0): MotionProps =>
    reduced || !withAnimations
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.15 },
          transition: { delay: 0.05 + i * 0.04, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
        };

  const scale = reduced || !withAnimations ? {} : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } };

  const pulse = reduced || !withAnimations
    ? {}
    : {
        animate: { scale: [1, 1.03, 1] },
        transition: { duration: 3, repeat: Infinity, repeatType: "reverse" as const },
      };

  // Сетка
  const gridConfig = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    auto: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
  } as const;

  const sizeConfig = {
    grid: "min-h-[320px] p-5 sm:p-6",
    carousel: "min-h-[300px] p-4",
    compact: "min-h-[280px] p-4",
    featured: "min-h-[360px] p-6 sm:p-7",
  } as const;

  return (
    <motion.section
      {...fade(0)}
      aria-labelledby={headingId}
      aria-describedby={subtitle ? descId : undefined}
      className={cn(
        CARD,
        NO_OVERFLOW_INLINE,
        sizeConfig[variant],
        "relative overflow-hidden backdrop-blur-sm"
      )}
    >
      {/* Фоновая подложка */}
      {variant === "featured" && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/3 to-transparent"
          animate={!reduced ? { opacity: [0.3, 0.5, 0.3] } : {}}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          aria-hidden
        />
      )}

      {/* Заголовок */}
      <div className="relative z-10 flex flex-wrap items-start gap-4 sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-lg border border-white/15 bg-white/10 p-2">
              <Sparkles className="h-4 w-4 text-white/70" aria-hidden />
            </div>
            <p className={EYEBROW}>рекомендации</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h2 id={headingId} className={cn(TITLE_SM, "bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent")}>
              {title}
            </h2>

            {hasItems && variant !== "compact" && (
              <motion.span
                id={countId}
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-white/80"
                whileHover={!reduced ? { scale: 1.05 } : {}}
                aria-live="polite"
                aria-atomic="true"
                aria-label={`Доступно услуг: ${items.length}`}
              >
                <BadgeCheck className="h-4 w-4" />
                {items.length} услуг
              </motion.span>
            )}
          </div>

          {subtitle ? (
            <p id={descId} className="mt-2 max-w-2xl text-sm text-white/70">
              {subtitle}
            </p>
          ) : null}
        </div>

        <motion.div {...scale}>
          <Link
            href={allHref}
            prefetch={false}
            className={cn(BTN_GHOST, "inline-flex h-11 items-center gap-2 px-4 text-sm", TAPPABLE)}
          >
            <span>Смотреть все</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>
      </div>

      {/* Пустое состояние */}
      {!hasItems ? (
        <motion.div className="relative z-10 mt-6" {...fade(0.1)}>
          <EmptyState
            title="Пока рекомендаций нет"
            description="Загляните в каталог услуг — появятся персональные предложения с учетом ваших предпочтений и истории."
            ctaLabel="Открыть услуги"
            ctaHref={allHref}
            secondaryCtaLabel="Популярные услуги"
            secondaryCtaHref="/demo/user/services?filter=popular"
            tertiaryCtaLabel="Акции"
            tertiaryCtaHref="/demo/user/services?filter=sale"
            tone="brand"
            variant="embedded"
            borderStyle="dashed"
            align="center"
            size="md"
            Icon={Sparkles}
            badge="Нет рекомендаций"
            withBackground={false}
          />
        </motion.div>
      ) : (
        <motion.ul
          role="list"
          aria-describedby={headingId}
          className={cn(
            "relative z-10 mt-6 grid gap-4",
            gridConfig[columns],
            variant === "carousel" &&
              "grid-flow-col auto-cols-[minmax(280px,1fr)] overflow-x-auto pb-4 -mx-2 px-2 snap-x snap-mandatory scrollbar-hide",
            variant === "compact" && "gap-3"
          )}
        >
          {items.map((service, i) => {
            const external = isExternal(service.href);
            const categoryConfig =
              service.category && CATEGORY_CONFIG[service.category as keyof typeof CATEGORY_CONFIG];
            const CategoryIcon = (categoryConfig?.icon ?? Sparkles) as React.ElementType;
            const difficultyConfig = service.difficulty && DIFFICULTY_CONFIG[service.difficulty as keyof typeof DIFFICULTY_CONFIG];
            const isFeatured = Boolean(service.featured) || variant === "featured";
            const hovered = hoveredService === service.id;

            const sr =
              `${service.title}. ${service.subtitle ?? ""}`.trim() +
              (service.price ? ` Цена: ${service.price}.` : " Цена по запросу.") +
              (service.quickSlot ? ` Ближайший слот: ${service.quickSlot}.` : "") +
              (service.duration ? ` Длительность: ${service.duration}.` : "") +
              (categoryConfig ? ` Категория: ${categoryConfig.label}.` : "");

            const detailsHref = `${service.href}${service.href.includes("?") ? "&" : "?"}view=details`;

            const titleId = `${uid}-${service.id}-title`;
            const srDescId = `${uid}-${service.id}-sr`;

            return (
              <motion.li
                key={service.id}
                {...fade(0.05 + i * 0.04)}
                {...(service.featured ? pulse : {})}
                onHoverStart={() => setHoveredService(service.id)}
                onHoverEnd={() => setHoveredService(null)}
                className={variant === "carousel" ? "w-full" : ""}
              >
                <motion.article
                  aria-labelledby={titleId}
                  aria-describedby={srDescId}
                  className={cn(
                    "group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border p-4 backdrop-blur-sm transition-all duration-300",
                    FOCUS_RING,
                    FOCUS_RING_OFFSET,
                    isFeatured
                      ? "border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/15"
                      : "border-white/15 bg-white/5 hover:bg-white/7",
                    variant === "compact" && "min-h-[140px] p-3",
                    variant === "featured" && "min-h-[180px] p-5"
                  )}
                  whileHover={!reduced ? { scale: 1.01 } : {}}
                >
                  {/* Градиентный оверлей без inline-style */}
                  <motion.span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute inset-0 opacity-0 transition-opacity",
                      "bg-gradient-to-br",
                      isFeatured ? "from-amber-400/20 to-transparent" : "from-white/15 to-transparent"
                    )}
                    animate={hovered ? { opacity: 0.12 } : { opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  />

                  {/* Верхняя строка */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        {showCategories && categoryConfig && (
                          <motion.span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                              categoryConfig.bg,
                              categoryConfig.border,
                              categoryConfig.color
                            )}
                            whileHover={!reduced ? { scale: 1.05 } : {}}
                          >
                            <CategoryIcon className="h-3.5 w-3.5" />
                            <span className="hidden xs:inline">{categoryConfig.label}</span>
                          </motion.span>
                        )}

                        {service.featured && (
                          <motion.span
                            className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/20 px-2 py-1 text-xs font-semibold text-amber-400"
                            animate={!reduced ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Crown className="h-3 w-3" />
                            <span>Премиум</span>
                          </motion.span>
                        )}
                      </div>

                      <h3
                        id={titleId}
                        className={cn(
                          "line-clamp-2 font-semibold text-white",
                          variant === "compact" ? "text-sm" : "text-base",
                          isFeatured && "text-lg"
                        )}
                        title={service.title}
                      >
                        {service.title}
                      </h3>

                      {service.subtitle ? (
                        <p
                          className={cn(
                            "mt-1 leading-relaxed text-white/70",
                            variant === "compact" ? "text-xs" : "text-sm",
                            CLAMP_2
                          )}
                        >
                          {service.subtitle}
                        </p>
                      ) : null}
                    </div>

                    {service.quickSlot && (
                      <motion.span
                        className={cn(
                          "inline-flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium uppercase tracking-wider",
                          isFeatured ? "border-amber-400/40 bg-amber-400/10 text-amber-300" : "border-white/20 bg-white/10 text-white/80"
                        )}
                        aria-label={`Ближайший слот: ${service.quickSlot}`}
                        whileHover={!reduced ? { scale: 1.05 } : {}}
                      >
                        <CalendarPlus className="h-3.5 w-3.5" aria-hidden />
                        <span className="hidden sm:inline">{service.quickSlot}</span>
                      </motion.span>
                    )}
                  </div>

                  {/* Мета-информация */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/60">
                    {service.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration}</span>
                      </div>
                    )}

                    {service.difficulty && difficultyConfig && (
                      <div className={cn("flex items-center gap-1", difficultyConfig.color)}>
                        <Shield className="h-4 w-4" />
                        <span>{difficultyConfig.label}</span>
                      </div>
                    )}

                    {service.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>{service.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Цена + CTA */}
                  <div className="mt-4 grid gap-3">
                    <div className="flex items-center justify-between">
                      {service.price ? (
                        <span
                          className={cn("font-semibold text-white", isFeatured ? "text-xl" : "text-lg")}
                          aria-label={`Цена ${service.price}`}
                        >
                          {service.price}
                        </span>
                      ) : (
                        <span className="text-white/70">По запросу</span>
                      )}

                      {service.popular && (
                        <span className="flex items-center gap-1 text-xs text-green-400">
                          <TrendingUp className="h-3 w-3" />
                          <span>Популярно</span>
                        </span>
                      )}
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
                      <motion.div {...scale} className="flex-1">
                        <Link
                          href={service.href}
                          prefetch={false}
                          aria-label={`Записаться: ${sr}`}
                          className={cn(
                            BTN_PRIMARY,
                            "inline-flex h-10 min-h-[44px] w-full items-center justify-center gap-2 text-sm font-semibold",
                            TAPPABLE,
                            isFeatured
                              ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          )}
                          {...(external ? { target: "_blank", rel: "noopener noreferrer", title: "Откроется в новой вкладке" } : {})}
                        >
                          <CalendarPlus className="h-4 w-4" />
                          Записаться
                        </Link>
                      </motion.div>

                      <motion.div {...scale}>
                        <Link
                          href={detailsHref}
                          prefetch={false}
                          aria-label={`Подробнее: ${service.title}`}
                          className={cn(
                            BTN_GHOST,
                            "inline-flex h-10 min-h-[44px] w-full items-center justify-center gap-2 px-4 text-sm sm:w-auto",
                            TAPPABLE,
                            isFeatured && "border-amber-500/30 text-amber-200 hover:bg-amber-500/20"
                          )}
                          {...(external ? { target: "_blank", rel: "noopener noreferrer", title: "Откроется в новой вкладке" } : {})}
                        >
                          Подробнее
                        </Link>
                      </motion.div>
                    </div>
                  </div>

                  {/* SR-описание карточки */}
                  <p id={srDescId} className="sr-only">
                    {sr}
                  </p>

                  {/* Свечение для featured */}
                  {isFeatured && (
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-2xl"
                      animate={!reduced ? { boxShadow: ["0 0 20px 0 rgba(245,158,11,.3)", "0 0 30px 5px rgba(245,158,11,.5)", "0 0 20px 0 rgba(245,158,11,.3)"] } : {}}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    />
                  )}
                </motion.article>
              </motion.li>
            );
          })}
        </motion.ul>
      )}

      {/* Индикатор прокрутки для карусели */}
      {variant === "carousel" && items.length > 3 && (
        <motion.div className="relative z-10 mt-4 flex justify-center" {...fade(0.3)}>
          <div className="flex gap-1.5">
            {[...Array(Math.ceil(items.length / 3))].map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-white/30 transition-all hover:bg-white/50" />
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
        @media (prefers-reduced-motion: reduce) {
          .transition-all {
            transition: none !important;
          }
        }
      `}</style>
    </motion.section>
  );
}