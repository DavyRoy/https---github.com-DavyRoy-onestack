// src/app/demo/user/dashboard/components/PaymentsWidget.tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import {
  CreditCard,
  ArrowUpRight,
  Receipt,
  Wallet2,
  ShieldCheck,
  CalendarClock,
  Zap,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
import type { PaymentDue, PaymentHistoryItem } from "../data/mockUserDashboard";
import {
  DASHBOARD_CARD,
  EYEBROW,
  TITLE,
  BTN_PRIMARY,
  BTN_GHOST,
  NO_OVERFLOW_INLINE,
  TAPPABLE,
  cn,
  useStableId,
} from "./_shared";

type PaymentsData = { due: PaymentDue[]; history: PaymentHistoryItem[] };

interface PaymentsWidgetProps {
  data?: PaymentsData;
  due?: PaymentDue[];
  history?: PaymentHistoryItem[];
  variant?: "default" | "compact" | "detailed";
  withAnimations?: boolean;
}

/** "6 840 ₽" → 6840 */
function parseMoney(text: string) {
  if (!text) return 0;
  const n = Number(
    String(text)
      .replace(/\u00a0|\u202f/g, " ")
      .replace(/[^\d.-]/g, "")
      .replace(/(\..*)\./g, "$1")
  );
  return Number.isFinite(n) ? n : 0;
}

/** Конфигурация статусов платежей */
const PAYMENT_STATUS = {
  paid: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    label: "Оплачен",
  },
  pending: {
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    label: "В обработке",
  },
  failed: {
    icon: AlertCircle,
    color: "text-rose-400",
    bg: "bg-rose-500/15",
    border: "border-rose-500/30",
    label: "Неуспешно",
  },
  refunded: {
    icon: TrendingUp,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
    label: "Возврат",
  },
};

export default function PaymentsWidget({
  data,
  due,
  history,
  variant = "default",
  withAnimations = true,
}: PaymentsWidgetProps) {
  const reduced = useReducedMotion();

  // источники данных
  const dueItems: PaymentDue[] = (data?.due ?? due ?? []).filter(Boolean);
  const historyItems: PaymentHistoryItem[] = (data?.history ?? history ?? []).filter(Boolean);

  const uid = useStableId("payments");
  const titleId = `${uid}-title`;
  const liveSumId = `${uid}-live`;

  const fade = (i = 0): MotionProps =>
    reduced || !withAnimations
      ? {}
      : {
          initial: { opacity: 0, y: 8 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.1 },
          transition: {
            delay: 0.05 + i * 0.03,
            duration: 0.4,
            ease: "easeOut",
          },
        };

  const totalDue = useMemo(
    () => dueItems.reduce<number>((acc, inv) => acc + parseMoney(inv.amount), 0),
    [dueItems]
  );
  const totalDueLabel = new Intl.NumberFormat("ru-RU").format(Math.max(0, totalDue));

  const payAllHref =
    dueItems.length > 0
      ? `/demo/user/checkout?invoices=${encodeURIComponent(dueItems.map((i) => i.id).join(","))}`
      : "/demo/user/checkout";

  const HAS_DUE = dueItems.length > 0;
  const HAS_HISTORY = historyItems.length > 0;

  // Упрощенная конфигурация вариантов
  const sizeConfig = {
    default: "p-4 sm:p-5",
    compact: "p-3 sm:p-4",
    detailed: "p-5 sm:p-6",
  };

  return (
    <motion.section
      {...fade(0)}
      aria-labelledby={titleId}
      className={cn(
        DASHBOARD_CARD,
        NO_OVERFLOW_INLINE,
        sizeConfig[variant],
        "relative overflow-hidden backdrop-blur-sm w-full"
      )}
    >
      {/* Заголовок - компактный для мобильных */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-lg bg-white/10 p-2 border border-white/10">
            <CreditCard className="h-4 w-4 text-white/70" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className={cn(EYEBROW, "text-white/60")}>оплаты</p>
            <h2
              id={titleId}
              className={cn(TITLE, "text-white/90 text-lg sm:text-xl")}
            >
              Счета и транзакции
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {HAS_DUE && (
            <div className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold",
              "border-amber-400/30 bg-amber-400/12 text-amber-200"
            )}>
              <Wallet2 className="h-4 w-4" aria-hidden />
              <span className="tabular-nums">~{totalDueLabel} ₽</span>
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <Link
              href="/demo/user/payments"
              prefetch={false}
              className={cn(
                BTN_GHOST,
                "h-9 px-3 text-sm inline-flex items-center gap-2",
                TAPPABLE
              )}
            >
              <span>История</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      {/* Live region */}
      <p id={liveSumId} className="sr-only" role="status" aria-live="polite">
        {HAS_DUE ? `К оплате примерно ${totalDueLabel} рублей.` : "Нет открытых счетов к оплате."}
      </p>

      {/* Счета к оплате */}
      <div className="relative z-10 mb-6" aria-describedby={titleId}>
        {HAS_DUE ? (
          <>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link
                href={payAllHref}
                prefetch={false}
                className={cn(
                  BTN_PRIMARY,
                  "h-11 px-5 inline-flex items-center gap-2 font-semibold",
                  "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
                  TAPPABLE
                )}
                aria-label={`Оплатить все счета, сумма ~ ${totalDueLabel} ₽`}
              >
                <Zap className="h-4 w-4" aria-hidden />
                Оплатить всё
              </Link>

              <div className="flex items-center gap-2 text-sm text-white/60">
                <Sparkles className="h-4 w-4 text-amber-400" aria-hidden />
                <span className="hidden xs:inline">Можно списать бонусы</span>
              </div>
            </div>

            <ul role="list" className="space-y-3">
              {dueItems.map((invoice, i) => {
                const invTitleId = `${uid}-inv-${invoice.id}-title`;

                return (
                  <motion.li key={invoice.id} {...fade(0.05 + i * 0.03)}>
                    <div
                      aria-labelledby={invTitleId}
                      className={cn(
                        "rounded-xl border p-4 backdrop-blur-sm",
                        "border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/12",
                        "transition-all duration-200"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="rounded-lg border border-amber-500/30 bg-amber-500/20 p-2">
                              <CalendarClock className="h-4 w-4 text-amber-400" aria-hidden />
                            </div>
                            <h3
                              id={invTitleId}
                              className="text-base font-semibold text-white break-words"
                              title={invoice.title}
                            >
                              {invoice.title}
                            </h3>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                            <div className="flex items-center gap-1.5">
                              <CalendarClock className="h-3.5 w-3.5" aria-hidden />
                              <span>{invoice.dueDate}</span>
                            </div>

                            {invoice.service && (
                              <span className="rounded-lg bg-white/10 px-2 py-1 text-xs">
                                {invoice.service}
                              </span>
                            )}
                          </div>

                          {variant === "detailed" && invoice.description && (
                            <p className="mt-2 text-sm leading-relaxed text-white/60">{invoice.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <p
                            className="tabular-nums text-lg font-bold text-white"
                            aria-label={`Сумма ${invoice.amount}`}
                          >
                            {invoice.amount}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className={cn(
                        "grid gap-2",
                        variant === "compact" ? "grid-cols-1 xs:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"
                      )}>
                        <Link
                          href={invoice.href}
                          prefetch={false}
                          className={cn(
                            "h-10 w-full inline-flex items-center justify-center gap-2 font-semibold rounded-xl",
                            "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
                            TAPPABLE
                          )}
                          aria-label={`Оплатить счёт ${invoice.id}`}
                        >
                          <CreditCard className="h-4 w-4" aria-hidden />
                          Оплатить
                        </Link>

                        <Link
                          href={`/demo/user/payments/${invoice.id}`}
                          prefetch={false}
                          className={cn(
                            BTN_GHOST,
                            "h-10 w-full px-4 inline-flex items-center justify-center gap-2 rounded-xl",
                            "border-amber-500/30 text-amber-200 hover:bg-amber-500/20",
                            TAPPABLE
                          )}
                          aria-label={`Подробнее о счёте ${invoice.id}`}
                        >
                          Подробнее
                        </Link>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </>
        ) : (
          <motion.div
            role="status"
            aria-live="polite"
            className="rounded-xl border border-white/15 bg-white/5 p-5 text-center backdrop-blur-sm"
            {...fade(0.1)}
          >
            <div className="mb-3 inline-flex rounded-full bg-white/10 p-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" aria-hidden />
            </div>
            <p className="font-medium text-white/90">Нет счетов к оплате</p>
            <p className="mt-1 text-sm text-white/60">Мы уведомим вас о новых счетах</p>
          </motion.div>
        )}
      </div>

      {/* История транзакций */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-lg bg-white/10 p-1.5">
            <Receipt className="h-4 w-4 text-white/70" aria-hidden />
          </div>
          <p className="text-sm uppercase tracking-wider text-white/70">Последние транзакции</p>
        </div>

        {!HAS_HISTORY ? (
          <motion.div
            className="rounded-xl border border-dashed border-white/15 bg-white/5 p-5 text-center backdrop-blur-sm"
            {...fade(0.15)}
          >
            <div className="mb-3 inline-flex rounded-full bg-white/10 p-3">
              <Receipt className="h-6 w-6 text-white/40" aria-hidden />
            </div>
            <p className="font-medium text-white/90">История пуста</p>
            <p className="mt-1 text-sm text-white/60">
              После оплаты записи появятся здесь
            </p>
          </motion.div>
        ) : (
          <ul role="list" className="space-y-3" aria-describedby={titleId}>
            {historyItems.slice(0, variant === "compact" ? 3 : 5).map((item, i) => {
              const StatusConfig =
                PAYMENT_STATUS[item.status as keyof typeof PAYMENT_STATUS] || PAYMENT_STATUS.paid;
              const StatusIcon = StatusConfig.icon;

              return (
                <motion.li key={item.id} {...fade(0.2 + i * 0.03)}>
                  <div
                    className={cn(
                      "flex items-start sm:items-center rounded-xl border p-4 backdrop-blur-sm",
                      "border-white/15 bg-white/5 hover:bg-white/7 transition-all duration-200",
                      "gap-4 w-full"
                    )}
                  >
                    {/* Иконка статуса */}
                    <div className={cn(
                      "rounded-lg border p-2 flex-shrink-0",
                      StatusConfig.bg, 
                      StatusConfig.border,
                      "mt-1 sm:mt-0"
                    )}>
                      <StatusIcon className={cn("h-4 w-4", StatusConfig.color)} aria-hidden />
                    </div>

                    {/* Основной контент */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <p className="font-medium text-white break-words text-sm sm:text-base">
                          {item.title}
                        </p>
                        <span className="tabular-nums font-bold text-white text-base sm:text-lg shrink-0">
                          {item.amount}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 text-sm text-white/60">
                        <span>{item.date}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{item.method}</span>
                        {variant === "detailed" && item.service && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">{item.service}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Кнопка чека - выровнена по центру */}
                    <Link
                      href={`/demo/user/payments/receipt/${item.id}`}
                      prefetch={false}
                      className={cn(
                        "inline-flex items-center justify-center rounded-lg border p-2 flex-shrink-0",
                        "border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/15",
                        "h-10 w-10 sm:h-9 sm:w-9",
                        TAPPABLE,
                        "self-center"
                      )}
                      aria-label={`Открыть чек ${item.id}`}
                      title="Квитанция"
                    >
                      <Receipt className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}

        {/* Безопасность и информация */}
        <motion.div
          className="rounded-xl border border-white/15 bg-white/5 p-4 mt-6 backdrop-blur-sm"
          {...fade(0.3)}
        >
          <div className="space-y-3 text-sm text-white/80">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" aria-hidden />
              <span className="break-words">Платежи обрабатываются защищённо. Данные карт не сохраняются.</span>
            </div>
            <div className="flex items-start gap-3">
              <Wallet2 className="h-5 w-5 shrink-0 text-blue-400 mt-0.5" aria-hidden />
              <span className="break-words">Доступны карты и быстрые способы оплаты (Apple Pay / Google Pay).</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Липкий мини-бар CTA для мобильных */}
      {HAS_DUE && (
        <motion.div
          className="sticky bottom-2 z-20 mt-6 grid grid-cols-2 gap-3 sm:hidden"
          style={{
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)",
          }}
          initial={!reduced ? { opacity: 0, y: 20 } : {}}
          animate={!reduced ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/demo/user/payments"
            prefetch={false}
            className={cn(
              "inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur transition-all hover:bg-white/14",
              TAPPABLE
            )}
          >
            История
          </Link>
          <Link
            href={payAllHref}
            prefetch={false}
            className={cn(
              "inline-flex w-full items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold text-white backdrop-blur transition-all",
              "border-green-500 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
              TAPPABLE
            )}
            aria-label={`Оплатить все счета, сумма ~ ${totalDueLabel} ₽`}
          >
            <CreditCard className="mr-2 h-4 w-4" aria-hidden />
            Оплатить
          </Link>
        </motion.div>
      )}
    </motion.section>
  );
}