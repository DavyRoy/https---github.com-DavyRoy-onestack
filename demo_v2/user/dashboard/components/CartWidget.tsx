// src/app/demo/user/dashboard/components/CartWidget.tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import type { CartData } from "../data/mockUserDashboard";
import EmptyState from "./EmptyState";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  PackageOpen,
  Tag,
} from "lucide-react";
import {
  cn,
  SECTION_WRAP,
  TITLE_SM,
  FOCUS_RING,
  TAPPABLE,
  BTN_PRIMARY,
  BTN_GHOST,
  BADGE_NEUTRAL,
  EYEBROW,
  formatMoneyIntl,
  useStableId,
} from "./_shared";

/** Парсер валютной строки: "6 840 ₽" / "6840" -> 6840 */
function parseMoney(text: string | number | null | undefined) {
  if (typeof text === "number") return text;
  if (!text) return 0;
  const cleaned = String(text)
    .replace(/\u00a0|\u202f/g, " ")
    .replace(/[^\d.-]/g, "")
    .replace(/(\..*)\./g, "$1");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

interface CartWidgetProps {
  cart: CartData;
  /** Порог бесплатной доставки (по умолчанию 3500₽) */
  freeShippingThreshold?: number;
  /** Компактный режим */
  compact?: boolean;
}

export default function CartWidget({
  cart,
  freeShippingThreshold = 3500,
  compact = false,
}: CartWidgetProps) {
  const reduced = useReducedMotion();

  // ✅ стабильные id (SSR-safe)
  const uid = useStableId("cart");
  const TITLE_ID = `cart-title-${uid}`;
  const TOTAL_ID = `cart-total-${uid}`;
  const PROG_LABEL_ID = `cart-progress-label-${uid}`;

  const fade = (i = 0): MotionProps =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 6 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.1 },
          transition: { delay: 0.03 + i * 0.02, duration: 0.3, ease: "easeOut" },
        };

  const items = cart?.items ?? [];
  const totalNumber = parseMoney(cart?.total);
  const FREE_THRESHOLD = Math.max(0, freeShippingThreshold);
  const freePct = Math.max(
    0,
    Math.min(100, Math.round((totalNumber / (FREE_THRESHOLD || 1)) * 100))
  );
  const freeLeft = Math.max(0, FREE_THRESHOLD - totalNumber);
  const barW = `${freePct}%`;

  if (!items.length) {
    return (
      <EmptyState
        title="Корзина пуста"
        description="Добавьте товары из магазина или воспользуйтесь готовыми подборками."
        ctaLabel="Перейти в магазин"
        ctaHref="/demo/user/shop"
        Icon={PackageOpen}
        compact={compact}
      />
    );
  }

  const itemsCount = items.reduce((acc, it) => acc + (it.quantity ?? 1), 0);

  return (
    <section
      aria-labelledby={TITLE_ID}
      className={cn(
        SECTION_WRAP,
        compact ? "p-3" : "p-4",
        "transition-all hover:border-white/16 overflow-x-clip"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between gap-3",
          compact ? "mb-3" : "mb-4"
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={cn(
              "flex items-center justify-center rounded-xl border border-white/12 bg-white/8",
              compact ? "h-8 w-8" : "h-9 w-9"
            )}
          >
            <ShoppingCart
              width={compact ? 14 : 16}
              height={compact ? 14 : 16}
              className="text-[rgba(236,240,255,0.64)]"
              aria-hidden
            />
          </div>
          <div className="min-w-0">
            <p className={cn(EYEBROW, "text-[rgba(236,240,255,0.64)]")}>корзина</p>
            <h2
              id={TITLE_ID}
              className={cn(TITLE_SM, "text-[rgba(255,255,255,0.92)] truncate")}
            >
              Ваш заказ
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={BADGE_NEUTRAL} aria-label={`Товаров: ${itemsCount}`}>
            {itemsCount}
          </span>
        </div>
      </div>

      {/* Items */}
      <ul role="list" className={cn("space-y-2", compact && "space-y-1.5")}>
        {items.map((item, i) => (
          <motion.li key={item.id} {...fade(i)}>
            <div
              className={cn(
                // Мобайл — сетка 2 строки: (иконка | инфо | контролы) + (— | цена → вправо)
                "grid grid-cols-[auto_1fr_auto] grid-rows-2 items-center gap-2 rounded-xl border border-white/12 bg-white/6 p-3 transition-all hover:border-white/16 hover:bg-white/8",
                // ≥sm — флекс как раньше
                "sm:flex sm:items-center sm:justify-between sm:gap-3 sm:p-3",
                compact && "p-2 sm:p-2"
              )}
            >
              {/* Иконка товара */}
              <div className="row-span-2" aria-hidden>
                <div
                  className={cn(
                    "flex items-center justify-center rounded-lg border border-white/12 bg-white/8",
                    compact ? "h-7 w-7" : "h-8 w-8"
                  )}
                >
                  <PackageOpen
                    width={compact ? 12 : 14}
                    height={compact ? 12 : 14}
                    className="text-[rgba(236,240,255,0.64)]"
                  />
                </div>
              </div>

              {/* Информация о товаре */}
              <div className="min-w-0">
                <p
                  className={cn(
                    "font-medium text-[rgba(255,255,255,0.92)] truncate",
                    "text-sm"
                  )}
                  title={item.title}
                >
                  {item.title}
                </p>
                <p
                  className={cn(
                    "text-[rgba(236,240,255,0.64)]",
                    "text-xs mt-0.5"
                  )}
                >
                  Количество: {item.quantity}
                </p>
              </div>

              {/* Управление количеством — в первой строке справа на мобайл, справа у флекса на десктопе */}
              <div className="flex items-center justify-self-end gap-1 sm:order-none">
                <Link
                  href={`/demo/user/cart?action=dec&id=${encodeURIComponent(
                    String(item.id)
                  )}`}
                  prefetch={false}
                  className={cn(
                    "inline-flex items-center justify-center rounded-lg border border-white/12 bg-white/8 text-[rgba(236,240,255,0.64)] transition-all hover:bg-white/12 hover:text-[rgba(255,255,255,0.92)] active:scale-95",
                    FOCUS_RING,
                    compact ? "h-7 w-7" : "h-8 w-8"
                  )}
                  aria-label={`Уменьшить количество для «${item.title}»`}
                  title="Уменьшить (демо)"
                >
                  <Minus width={compact ? 12 : 14} height={compact ? 12 : 14} aria-hidden />
                </Link>

                <output
                  className={cn(
                    "inline-flex min-w-[2ch] items-center justify-center rounded-md bg-white/10 px-2 font-semibold text-[rgba(255,255,255,0.92)] tabular-nums",
                    "text-xs py-1"
                  )}
                  aria-label={`Текущее количество: ${item.quantity}`}
                >
                  {item.quantity}
                </output>

                <Link
                  href={`/demo/user/cart?action=inc&id=${encodeURIComponent(
                    String(item.id)
                  )}`}
                  prefetch={false}
                  className={cn(
                    "inline-flex items-center justify-center rounded-lg border border-white/12 bg-white/8 text-[rgba(236,240,255,0.64)] transition-all hover:bg-white/12 hover:text-[rgba(255,255,255,0.92)] active:scale-95",
                    FOCUS_RING,
                    compact ? "h-7 w-7" : "h-8 w-8"
                  )}
                  aria-label={`Увеличить количество для «${item.title}»`}
                  title="Увеличить (демо)"
                >
                  <Plus width={compact ? 12 : 14} height={compact ? 12 : 14} aria-hidden />
                </Link>

                <Link
                  href={`/demo/user/cart?action=remove&id=${encodeURIComponent(
                    String(item.id)
                  )}`}
                  prefetch={false}
                  className={cn(
                    "ml-1 inline-flex items-center justify-center rounded-lg border border-white/12 bg-white/8 text-[rgba(236,240,255,0.48)] transition-all hover:bg-white/12 hover:text-[rgba(255,255,255,0.92)] active:scale-95",
                    FOCUS_RING,
                    compact ? "h-7 w-7" : "h-8 w-8"
                  )}
                  aria-label={`Удалить «${item.title}» из корзины`}
                  title="Удалить (демо)"
                >
                  <Trash2 width={compact ? 12 : 14} height={compact ? 12 : 14} aria-hidden />
                </Link>
              </div>

              {/* Цена — на мобиле во 2-й строке, справа; на ≥sm остаётся справа через flex */}
              <span
                className={cn(
                  "justify-self-end font-semibold text-[rgba(255,255,255,0.92)] tabular-nums",
                  "text-sm sm:ml-2",
                  // разместить во 2-й строке и растянуть на два столбца (кроме иконки)
                  "col-start-2 col-end-4 row-start-2 sm:col-auto sm:row-auto"
                )}
              >
                {item.price}
              </span>
            </div>
          </motion.li>
        ))}
      </ul>

      {/* Прогресс бесплатной доставки */}
      <div className={cn("mt-3 grid gap-2", compact && "gap-1.5")}>
        <div
          className={cn(
            "rounded-xl border border-white/12 bg-white/6 p-3 transition-all hover:border-white/16",
            compact && "p-2"
          )}
          aria-live="polite"
        >
          {totalNumber >= FREE_THRESHOLD ? (
            <div className="flex items-center justify-between gap-3">
              <p className={cn("text-emerald-300 font-medium", "text-xs")}>
                🎉 Доставка бесплатно
              </p>
              <div className={cn("hidden text-[rgba(236,240,255,0.64)] sm:block", "text-xs")}>
                Сохраните экономию
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <p
                  id={PROG_LABEL_ID}
                  className={cn("text-[rgba(236,240,255,0.64)]", "text-xs")}
                >
                  До бесплатной доставки:{" "}
                  <span className="font-semibold text-[rgba(255,255,255,0.92)] tabular-nums">
                    {formatMoneyIntl(freeLeft, { currency: "RUB" })}
                  </span>
                </p>
                <span
                  className={cn(
                    "text-[rgba(236,240,255,0.64)] tabular-nums inline-block text-right",
                    "text-xs w-[3ch]"
                  )}
                >
                  {freePct}%
                </span>
              </div>

              <div
                className={cn(
                  "mt-2 w-full overflow-hidden rounded-full border border-white/16 bg-white/5",
                  compact ? "h-1.5" : "h-2"
                )}
                role="progressbar"
                aria-labelledby={PROG_LABEL_ID}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={freePct}
                aria-valuetext={
                  freePct === 0
                    ? "Порог бесплатной доставки не достигнут"
                    : `Выполнено ${freePct} процентов`
                }
              >
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 will-change-[width] transition-all duration-500 ease-out"
                  style={{ width: barW }}
                  aria-hidden
                />
              </div>
            </>
          )}
        </div>

        {/* Информация о резервировании */}
        <div
          className={cn(
            "rounded-xl border border-white/12 bg-white/6 p-3 text-[rgba(236,240,255,0.64)] leading-relaxed",
            compact ? "text-[11px] p-2" : "text-xs p-3"
          )}
        >
          Позиции в корзине не резервируются. Доступность на складе может измениться.
        </div>

        {/* Итого */}
        <div
          className={cn(
            "flex items-center justify-between rounded-xl border border-white/12 bg-white/6 p-3 transition-all hover:border-white/16",
            compact && "p-2"
          )}
          aria-live="polite"
          aria-atomic="true"
        >
          <span
            id={`cart-total-label-${uid}`}
            className={cn("text-[rgba(236,240,255,0.64)]", "text-sm")}
          >
            Итого
          </span>
          <output
            id={TOTAL_ID}
            aria-labelledby={`cart-total-label-${uid}`}
            className={cn(
              "font-semibold text-[rgba(255,255,255,0.92)] tabular-nums",
              "text-lg"
            )}
          >
            {cart.total}
          </output>
        </div>
      </div>

      {/* Промокод */}
      <form
        action="/demo/user/cart"
        method="GET"
        className={cn("mt-3 grid gap-2", "grid-cols-1 sm:grid-cols-[1fr_auto]")}
        aria-labelledby={`promo-label-${uid}`}
      >
        <label id={`promo-label-${uid}`} htmlFor={`promo-${uid}`} className="sr-only">
          Промокод
        </label>
        <div className="relative">
          <Tag
            width={16}
            height={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(236,240,255,0.48)]"
            aria-hidden
          />
          <input
            id={`promo-${uid}`}
            name="promo"
            inputMode="text"
            autoComplete="off"
            placeholder="Промокод"
            className={cn(
              "w-full rounded-xl border border-white/12 bg-white/6 pl-10 pr-3 text-sm text-[rgba(255,255,255,0.92)] placeholder-[rgba(236,240,255,0.48)] outline-none transition-all focus:border-white/20 focus:bg-white/8",
              FOCUS_RING,
              compact ? "h-9" : "h-10"
            )}
          />
        </div>
        <button
          type="submit"
          className={cn(
            BTN_GHOST,
            "inline-flex items-center justify-center gap-2",
            compact ? "h-9 text-sm" : "h-10 text-sm"
          )}
        >
          Применить{" "}
          <ArrowRight width={compact ? 14 : 16} height={compact ? 14 : 16} aria-hidden />
        </button>
      </form>

      {/* Рекомендуемые товары */}
      {cart.recommended?.length ? (
        <div className={cn("mt-3", compact && "mt-2")}>
          <p className={cn(EYEBROW, "text-[rgba(236,240,255,0.64)] mb-2", compact && "mb-1.5")}>
            рекомендуем добавить
          </p>
          <ul
            role="list"
            className={cn("grid gap-2", "grid-cols-1 sm:grid-cols-2")}
          >
            {cart.recommended.map((item, i) => (
              <motion.li key={item.id} {...fade(i + items.length)}>
                <Link
                  href={item.href}
                  prefetch={false}
                  className={cn(
                    "group flex items-center justify-between rounded-xl border border-white/12 bg-white/6 p-3 transition-all hover:border-white/16 hover:bg-white/8",
                    TAPPABLE,
                    compact && "p-2"
                  )}
                  aria-label={`Добавить: ${item.title} — ${item.price}`}
                >
                  <p className={cn("font-medium text-[rgba(255,255,255,0.92)] truncate", "text-sm")}>
                    {item.title}
                  </p>
                  <span className={cn("text-[rgba(236,240,255,0.64)] shrink-0 ml-2", "text-xs")}>
                    {item.price}
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Кнопки действий */}
      <div className={cn("grid gap-2 mt-3", "grid-cols-2 sm:grid-cols-2")}>
        <Link
          href="/demo/user/cart"
          prefetch={false}
          className={cn(BTN_GHOST, "justify-center", "text-sm py-2 sm:py-2.5")}
        >
          В корзину
        </Link>
        <Link
          href="/demo/user/checkout"
          prefetch={false}
          className={cn(BTN_PRIMARY, "justify-center", "text-sm py-2 sm:py-2.5")}
        >
          Оформить
        </Link>
      </div>
    </section>
  );
}