// src/app/demo/user/dashboard/components/OrdersWidget.tsx
"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Truck,
  Receipt,
  RotateCw,
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import { useMemo, useState } from "react";
import type { OrderSummary } from "../data/mockUserDashboard";
import EmptyState from "./EmptyState";
import {
  CARD,
  ROW,
  EYEBROW,
  TITLE,
  BTN_GHOST,
  BTN_PRIMARY,
  BADGE_NEUTRAL,
  NO_OVERFLOW_INLINE,
  CLAMP_2,
  TAPPABLE,
  FOCUS_RING,
  FOCUS_RING_OFFSET,
  cn,
  useStableId,
} from "./_shared";

interface OrdersWidgetProps {
  orders: OrderSummary[];
  variant?: "default" | "compact" | "detailed";
  maxItems?: number;
  withAnimations?: boolean;
}

const STATUS_UI: Record<
  OrderSummary["status"],
  {
    wrap: string;
    dot: string;
    text: string;
    sr: string;
    icon: typeof Package;
    gradient: string;
    progress?: number;
    progressBar?: string;
  }
> = {
  paid: {
    wrap: "border-emerald-500/40 bg-emerald-500/15 shadow-emerald-500/10",
    dot: "bg-emerald-400 shadow-emerald-400/50",
    text: "text-emerald-300",
    sr: "оплачен",
    icon: CheckCircle2,
    gradient: "from-emerald-500/20 to-green-500/10",
    progress: 25,
    progressBar: "bg-emerald-400",
  },
  processing: {
    wrap: "border-amber-500/40 bg-amber-500/15 shadow-amber-500/10",
    dot: "bg-amber-400 shadow-amber-400/50",
    text: "text-amber-300",
    sr: "в обработке",
    icon: Clock,
    gradient: "from-amber-500/20 to-orange-500/10",
    progress: 50,
    progressBar: "bg-amber-400",
  },
  shipping: {
    wrap: "border-sky-500/40 bg-sky-500/15 shadow-sky-500/10",
    dot: "bg-sky-400 shadow-sky-400/50",
    text: "text-sky-300",
    sr: "доставляется",
    icon: Truck,
    gradient: "from-sky-500/20 to-blue-500/10",
    progress: 75,
    progressBar: "bg-sky-400",
  },
  delivered: {
    wrap: "border-emerald-500/40 bg-emerald-500/15 shadow-emerald-500/10",
    dot: "bg-emerald-400 shadow-emerald-400/50",
    text: "text-emerald-300",
    sr: "доставлен",
    icon: Package,
    gradient: "from-emerald-500/20 to-teal-500/10",
    progress: 100,
    progressBar: "bg-emerald-400",
  },
  awaiting: {
    wrap: "border-rose-500/40 bg-rose-500/15 shadow-rose-500/10",
    dot: "bg-rose-400 shadow-rose-400/50",
    text: "text-rose-300",
    sr: "ожидает оплаты",
    icon: AlertCircle,
    gradient: "from-rose-500/20 to-pink-500/10",
    progress: 10,
    progressBar: "bg-rose-400",
  },
};

export default function OrdersWidget({
  orders,
  variant = "default",
  maxItems = 5,
  withAnimations = true,
}: OrdersWidgetProps) {
  const reduced = useReducedMotion();

  // ✅ SSR-stable ids
  const uid = useStableId("orders");
  const titleId = `${uid}-title`;
  const countId = `${uid}-count`;

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fade = (i = 0): MotionProps =>
    reduced || !withAnimations
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.15 },
          transition: {
            delay: 0.05 + i * 0.04,
            duration: 0.45,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        };

  const tapScale = reduced || !withAnimations ? {} : { whileTap: { scale: 0.98 } };

  const safeOrders: OrderSummary[] = useMemo(
    () => (Array.isArray(orders) ? orders.filter(Boolean).slice(0, Math.max(0, maxItems)) : []),
    [orders, maxItems]
  );
  const totalCount = safeOrders.length;
  const hasMoreOrders = Array.isArray(orders) && orders.length > maxItems;

  const headerAria = `Всего заказов: ${totalCount}. Последние операции доступны ниже.`;

  // Размеры карточки
  const sizeConfig = {
    default: "min-h-[320px] p-4 sm:p-5",
    compact: "min-h-[280px] p-4",
    detailed: "min-h-[360px] p-5 sm:p-6",
  };

  return (
    <motion.section
      initial={withAnimations && !reduced ? { opacity: 0, y: 16 } : {}}
      animate={withAnimations && !reduced ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      aria-labelledby={titleId}
      aria-describedby={countId}
      className={cn(
        CARD,
        NO_OVERFLOW_INLINE,
        sizeConfig[variant],
        "relative overflow-hidden backdrop-blur-sm transition-all hover:border-white/16"
      )}
    >
      {/* Анимированный фон (только detailed) */}
      {variant === "detailed" && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/3 to-transparent"
          animate={!reduced ? { opacity: [0.3, 0.5, 0.3] } : {}}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          aria-hidden
        />
      )}

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-start gap-3 sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-lg border border-white/15 bg-white/10 p-2">
              <ShoppingBag className="h-4 w-4 text-white/70" aria-hidden />
            </div>
            <p className={EYEBROW}>последние заказы</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h2
              id={titleId}
              className={cn(
                TITLE,
                "truncate bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
              )}
            >
              История покупок
            </h2>
            <motion.span
              id={countId}
              className={cn(
                BADGE_NEUTRAL,
                "px-3 py-1.5 text-sm font-semibold border-white/20 bg-white/10"
              )}
              aria-live="polite"
              aria-atomic="true"
              aria-label={`Количество заказов: ${totalCount}${hasMoreOrders ? " и есть ещё" : ""}`}
              whileHover={!reduced ? { scale: 1.05 } : {}}
            >
              {totalCount}
              {hasMoreOrders && "+"}
            </motion.span>
          </div>
          <p className="sr-only">{headerAria}</p>
        </div>

        <motion.div {...tapScale}>
          <Link
            href="/demo/user/my-orders"
            prefetch={false}
            className={cn(
              BTN_GHOST,
              "h-11 px-4 text-sm inline-flex items-center gap-2",
              TAPPABLE,
              FOCUS_RING,
              FOCUS_RING_OFFSET
            )}
          >
            <span>Все заказы</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>
      </div>

      {/* Empty State */}
      {totalCount === 0 && (
        <motion.div className="relative z-10 mt-6" {...fade(0)}>
          <EmptyState
            title="У вас пока нет заказов"
            description="Загляните в магазин и добавьте первый товар — здесь появится история ваших покупок с отслеживанием и управлением."
            ctaLabel="Перейти в магазин"
            ctaHref="/demo/user/shop"
            secondaryCtaLabel="Популярные товары"
            secondaryCtaHref="/demo/user/shop?filter=popular"
            tertiaryCtaLabel="Акции"
            tertiaryCtaHref="/demo/user/shop?filter=sale"
            tone="brand"
            variant="embedded"
            borderStyle="dashed"
            align="center"
            size="md"
            Icon={ShoppingBag}
            badge="Нет заказов"
            withBackground={false}
            className="mt-2"
          />
        </motion.div>
      )}

      {/* Orders List */}
      {totalCount > 0 && (
        <motion.ul role="list" className="relative z-10 mt-6 space-y-4" {...fade(0)}>
          {safeOrders.map((order, i) => {
            const ui = STATUS_UI[order.status];
            const StatusIcon = ui.icon;
            const ordTitleId = `${uid}-ord-${order.id}-title`;
            const ordDescId = `${uid}-ord-${order.id}-desc`;
            const isExpanded = expandedOrder === order.id;

            const sr = `Заказ ${order.number}, ${order.title}. Статус: ${ui.sr}. Сумма: ${order.amount}.`;

            return (
              <motion.li key={order.id} {...fade(i)} layout>
                <motion.article
                  aria-labelledby={ordTitleId}
                  aria-describedby={ordDescId}
                  className={cn(
                    ROW,
                    "items-start rounded-2xl border p-4 sm:p-5",
                    "border-white/15 bg-white/5 hover:bg-white/7 backdrop-blur-sm",
                    "transition-all duration-300",
                    isExpanded && "border-white/20 bg-white/10"
                  )}
                  whileHover={!reduced && variant !== "compact" ? { scale: 1.01 } : {}}
                >
                  {/* Header row */}
                  <div className="flex w-full items-start justify-between gap-4">
                    {/* Left: main info */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        {/* Number */}
                        <span
                          className="font-mono text-sm font-semibold tracking-wide text-white/90 tabular-nums"
                          title={order.number}
                        >
                          {order.number}
                        </span>

                        {/* Status */}
                        <motion.span
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
                            ui.wrap,
                            ui.text
                          )}
                          whileHover={!reduced ? { scale: 1.05 } : {}}
                          aria-label={`Статус: ${ui.sr}`}
                        >
                          <motion.span
                            className={cn("h-2 w-2 rounded-full", ui.dot)}
                            animate={!reduced && order.status === "shipping" ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                            aria-hidden
                          />
                          <StatusIcon className="h-3.5 w-3.5" aria-hidden />
                          <span>{order.statusLabel}</span>
                        </motion.span>

                        {/* Amount */}
                        <span
                          className="ml-auto shrink-0 font-bold tabular-nums text-white sm:text-lg"
                          aria-label={`Сумма заказа ${order.amount}`}
                        >
                          {order.amount}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        id={ordTitleId}
                        className={cn("mb-2 text-base font-semibold text-white", CLAMP_2)}
                        title={order.title}
                      >
                        {order.title}
                      </h3>

                      {/* Extra info (detailed) */}
                      {variant === "detailed" && order.items && (
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <span>
                            {order.items} товар{order.items > 1 ? "а" : ""}
                          </span>
                          {order.date && <span>{new Date(order.date).toLocaleDateString("ru-RU")}</span>}
                        </div>
                      )}

                      {/* Progress (shipping) */}
                      {order.status === "shipping" && ui.progress && variant !== "compact" && (
                        <div className="mt-3">
                          <div className="mb-1 flex justify-between text-xs text-white/60">
                            <span>Доставка</span>
                            <span>{ui.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              className={cn("h-full rounded-full", ui.progressBar)}
                              initial={{ width: 0 }}
                              animate={{ width: `${ui.progress}%` }}
                              transition={{ delay: 0.4 + i * 0.08, duration: 0.9, ease: "easeOut" }}
                              aria-hidden
                            />
                          </div>
                        </div>
                      )}

                      <p id={ordDescId} className="sr-only">
                        {sr}
                      </p>
                    </div>

                    {/* Expand (mobile) */}
                    {variant !== "compact" && (
                      <motion.button
                        type="button"
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className={cn(
                          "sm:hidden rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10",
                          FOCUS_RING
                        )}
                        {...tapScale}
                        aria-expanded={isExpanded || undefined}
                        aria-controls={`${uid}-actions-${order.id}`}
                        aria-label={isExpanded ? "Свернуть детали" : "Развернуть детали"}
                      >
                        <MoreHorizontal className="h-4 w-4" aria-hidden />
                      </motion.button>
                    )}
                  </div>

                  {/* Actions */}
                  <motion.div
                    id={`${uid}-actions-${order.id}`}
                    className={cn(
                      "mt-4 grid w-full gap-2",
                      variant === "compact"
                        ? "grid-cols-2 sm:grid-cols-4"
                        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
                      variant !== "compact" && isExpanded && "sm:flex sm:flex-wrap"
                    )}
                    initial={false}
                    animate={{
                      height: variant !== "compact" && !isExpanded ? 0 : "auto",
                      opacity: variant !== "compact" && !isExpanded ? 0 : 1,
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    <motion.div {...tapScale}>
                      <Link
                        href={`/demo/user/my-orders/${order.id}`}
                        prefetch={false}
                        className={cn(
                          BTN_GHOST,
                          "h-10 w-full justify-center px-4 text-sm inline-flex items-center gap-2",
                          TAPPABLE,
                          FOCUS_RING,
                          FOCUS_RING_OFFSET
                        )}
                        aria-label={`Подробнее о заказе ${order.number}`}
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden />
                        <span>Подробнее</span>
                      </Link>
                    </motion.div>

                    <motion.div {...tapScale}>
                      <Link
                        href={`/demo/user/shop?repeat=${order.id}`}
                        prefetch={false}
                        className={cn(
                          BTN_GHOST,
                          "h-10 w-full justify-center px-4 text-sm inline-flex items-center gap-2",
                          TAPPABLE,
                          FOCUS_RING
                        )}
                        aria-label={`Повторить заказ ${order.number}`}
                      >
                        <RotateCw className="h-4 w-4" aria-hidden />
                        <span>Повторить</span>
                      </Link>
                    </motion.div>

                    {order.status === "shipping" && (
                      <motion.div {...tapScale}>
                        <Link
                          href={`/demo/user/my-orders/${order.id}/tracking`}
                          prefetch={false}
                          className={cn(
                            "inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold",
                            "border-sky-500/50 bg-sky-500/15 text-sky-200 hover:bg-sky-500/20 hover:border-sky-500/60",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--bg))]",
                            TAPPABLE
                          )}
                          aria-label={`Отследить заказ ${order.number}`}
                        >
                          <Truck className="h-4 w-4" aria-hidden />
                          <span>Отследить</span>
                        </Link>
                      </motion.div>
                    )}

                    {(order.status === "paid" || order.status === "delivered") && (
                      <motion.div {...tapScale}>
                        <Link
                          href={`/demo/user/my-orders/${order.id}/receipt`}
                          prefetch={false}
                          className={cn(
                            "inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold",
                            "border-emerald-500/50 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/20 hover:border-emerald-500/60",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--bg))]",
                            TAPPABLE
                          )}
                          aria-label={`Открыть чек заказа ${order.number}`}
                        >
                          <Receipt className="h-4 w-4" aria-hidden />
                          <span>Чек</span>
                        </Link>
                      </motion.div>
                    )}

                    {order.status === "awaiting" && (
                      <motion.div {...tapScale}>
                        <Link
                          href={`/demo/user/payments/checkout?order=${order.id}`}
                          prefetch={false}
                          className={cn(
                            BTN_PRIMARY,
                            "h-10 w-full justify-center px-4 text-sm inline-flex items-center gap-2 font-semibold",
                            TAPPABLE,
                            "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
                            FOCUS_RING,
                            FOCUS_RING_OFFSET
                          )}
                          aria-label={`Оплатить заказ ${order.number}`}
                        >
                          <Sparkles className="h-4 w-4" aria-hidden />
                          <span>Оплатить</span>
                        </Link>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.article>
              </motion.li>
            );
          })}
        </motion.ul>
      )}

      {/* View More */}
      {hasMoreOrders && (
        <motion.div className="relative z-10 mt-6 text-center" {...fade(safeOrders.length + 1)}>
          <div className="inline-flex items-center gap-2 text-sm text-white/60">
            <span>И еще {orders.length - safeOrders.length} заказов</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </div>
        </motion.div>
      )}

      {/* Sticky CTA (mobile) */}
      {totalCount > 0 && (
        <motion.div
          className="sticky bottom-2 z-20 mt-6 grid grid-cols-2 gap-3 sm:hidden"
          style={{
            contain: "layout paint style",
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)",
          }}
          initial={withAnimations && !reduced ? { opacity: 0, y: 16 } : {}}
          animate={withAnimations && !reduced ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          <motion.div {...tapScale}>
            <Link
              href="/demo/user/my-orders"
              prefetch={false}
              className={cn(
                "inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur transition-all hover:bg-white/14",
                TAPPABLE,
                FOCUS_RING
              )}
            >
              Все заказы
            </Link>
          </motion.div>
          <motion.div {...tapScale}>
            <Link
              href="/demo/user/shop"
              prefetch={false}
              className={cn(
                BTN_PRIMARY,
                "h-12 min-h-[48px] w-full inline-flex items-center justify-center gap-2 text-base font-semibold",
                "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
                FOCUS_RING,
                FOCUS_RING_OFFSET
              )}
            >
              <ShoppingBag className="h-5 w-5" aria-hidden />
              В магазин
            </Link>
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
}