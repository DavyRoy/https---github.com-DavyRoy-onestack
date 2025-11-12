"use client";

import { useMemo, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ReceiptRussianRuble, ShieldCheck, Truck, Percent, PiggyBank, Sparkles } from "lucide-react";
import type { CartGroup, CartDelivery, CartLoyalty, AppliedCoupon } from "../data/mockUserCart";
import { cn, CARD, BTN_PRIMARY, CHIP, BADGE_INFO, BADGE_SUCCESS, BADGE_WARNING } from "./_shared";

export type CartTotalsProps = {
  groups: CartGroup[];
  delivery: CartDelivery;
  loyalty: CartLoyalty;
  coupons: AppliedCoupon[];
  taxRate: number;
  onCheckout: () => void;
};

export default function CartTotals({ groups, delivery, loyalty, coupons, taxRate, onCheckout }: CartTotalsProps) {
  const summary = useMemo(() => {
    const subtotal = groups.reduce(
      (sum, group) => sum + group.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0),
      0
    );
    const couponDiscount = coupons.reduce((sum, coupon) => sum + coupon.amount, 0);
    const loyaltyDiscount = loyalty.enabled ? loyalty.applied : 0;
    const deliveryCost = delivery.method === "delivery" ? delivery.price : 0;
    const taxableBase = Math.max(subtotal - couponDiscount - loyaltyDiscount, 0);
    const tax = taxableBase * taxRate;
    const total = taxableBase + deliveryCost + tax;
    return { subtotal, couponDiscount, loyaltyDiscount, deliveryCost, tax, total };
  }, [groups, delivery, loyalty, coupons, taxRate]);

  const hasDiscounts = summary.couponDiscount > 0 || summary.loyaltyDiscount > 0;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
      className={cn(CARD, "relative overflow-hidden p-6 sm:p-7 lg:p-8")}
    >
      <div className="absolute inset-0 -z-10 opacity-80">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
        <div className="absolute -bottom-24 right-0 h-40 w-40 rounded-full bg-gradient-to-tr from-purple-500/20 via-blue-500/10 to-transparent blur-[120px]" />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
              <ReceiptRussianRuble className="h-4 w-4" />
              Итого
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {summary.total.toLocaleString("ru-RU")} ₽
            </p>
            <p className="mt-1 text-sm text-white/60">Все налоги и сборы включены.</p>
          </div>

          {hasDiscounts ? (
            <span className={cn(BADGE_SUCCESS, "border-none bg-emerald-500/15 text-emerald-200")}>
              Вы активно экономите
            </span>
          ) : (
            <span className={cn(BADGE_INFO, "border-none bg-white/8 text-white/70")}>Идеально для быстрого checkout</span>
          )}
        </div>

        <dl className="space-y-4 text-sm text-white/70">
          <BreakdownRow
            icon={<Sparkles className="h-4 w-4 text-blue-300" />}
            label="Подытог корзины"
            value={summary.subtotal}
          />
          {summary.couponDiscount > 0 && (
            <BreakdownRow
              icon={<Percent className="h-4 w-4 text-rose-300" />}
              label="Скидки и купоны"
              value={summary.couponDiscount}
              sign="-"
            />
          )}
          {summary.loyaltyDiscount > 0 && (
            <BreakdownRow
              icon={<PiggyBank className="h-4 w-4 text-emerald-300" />}
              label="Баллы лояльности"
              value={summary.loyaltyDiscount}
              sign="-"
            />
          )}
          {summary.deliveryCost > 0 && (
            <BreakdownRow
              icon={<Truck className="h-4 w-4 text-cyan-300" />}
              label={delivery.method === "delivery" ? "Доставка" : "Самовывоз"}
              value={summary.deliveryCost}
              sign="+"
            />
          )}
          {summary.tax > 0 && (
            <BreakdownRow
              icon={<ShieldCheck className="h-4 w-4 text-white/70" />}
              label={`НДС ${Math.round(taxRate * 100)}%`}
              value={summary.tax}
              sign="+"
            />
          )}
        </dl>

        <div className="rounded-2xl border border-white/12 bg-white/6 p-4 text-sm text-white/70">
          <div className="flex items-center gap-3">
            <span className={cn(CHIP, "border-white/15 bg-white/8 text-white/70")}>Безопасная оплата</span>
            {loyalty.enabled ? (
              <span className={cn(BADGE_SUCCESS, "border-none bg-emerald-500/15 text-emerald-200")}>
                Использовано {loyalty.applied.toLocaleString("ru-RU")} ₽ бонусов
              </span>
            ) : null}
            {delivery.method === "pickup" ? (
              <span className={cn(BADGE_WARNING, "border-none bg-amber-500/15 text-amber-200")}>
                Самовывоз: {delivery.slot ?? "любое удобное время"}
              </span>
            ) : null}
          </div>
        </div>

        <Link
          href={{
            pathname: "/demo/user/checkout",
            query: {
              cartId: groups.length ? "cart" : "",
              coupon: coupons.map((coupon) => coupon.code).join(","),
              usePoints: loyalty.enabled ? "1" : "0",
              delivery: delivery.method,
            },
          }}
          onClick={onCheckout}
          className={cn(
            BTN_PRIMARY,
            "w-full justify-center rounded-2xl px-6 py-3 text-base font-semibold shadow-[0_25px_60px_-35px_rgba(56,189,248,0.8)]"
          )}
        >
          Перейти к оформлению
        </Link>
      </div>
    </motion.aside>
  );
}

type BreakdownRowProps = {
  icon: ReactNode;
  label: string;
  value: number;
  sign?: "+" | "-";
};

function BreakdownRow({ icon, label, value, sign = "+" }: BreakdownRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 text-white/70">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-white/6">
          {icon}
        </span>
        <span>{label}</span>
      </div>
      <span className="font-semibold text-white">
        {sign}
        {value.toLocaleString("ru-RU")} ₽
      </span>
    </div>
  );
}
