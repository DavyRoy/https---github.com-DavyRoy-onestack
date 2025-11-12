"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CartHeader from "./CartHeader";
import CartItems from "./CartItems";
import CouponBox from "./CouponBox";
import LoyaltyToggle from "./LoyaltyToggle";
import DeliveryPicker from "./DeliveryPicker";
import NotesField from "./NotesField";
import CartTotals from "./CartTotals";
import UpsellRail from "./UpsellRail";
import StickyCheckout from "./StickyCheckout";
import EmptyState from "./EmptyState";
import { mockCart, type CartSnapshot, type CartItem, type CartGroup, type CartUpsell } from "../data/mockUserCart";
import { cn, CARD_SOFT } from "./_shared";

const addressBook = [
  { id: "addr-home", label: "Дом — Москва, Набережная 12" },
  { id: "addr-office", label: "Офис — Деловой центр, Башня Б" },
  { id: "addr-spa", label: "SPA OneStack, Пресня" },
];

type Summary = {
  subtotal: number;
  couponDiscount: number;
  loyaltyDiscount: number;
  deliveryCost: number;
  tax: number;
  total: number;
};

function calculateSummary(groups: CartGroup[], couponsAmount: number, loyaltyAmount: number, deliveryPrice: number, taxRate: number): Summary {
  const subtotal = groups.reduce(
    (sum, group) => sum + group.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0),
    0
  );
  const couponDiscount = couponsAmount;
  const loyaltyDiscount = loyaltyAmount;
  const deliveryCost = deliveryPrice;
  const taxableBase = Math.max(subtotal - couponDiscount - loyaltyDiscount, 0);
  const tax = taxableBase * taxRate;
  const total = taxableBase + deliveryCost + tax;
  return { subtotal, couponDiscount, loyaltyDiscount, deliveryCost, tax, total };
}

export default function CartPageClient() {
  const [cart, setCart] = useState<CartSnapshot>(mockCart);
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const totalCount = useMemo(
    () => cart.groups.reduce((sum, group) => sum + group.items.reduce((acc, item) => acc + item.quantity, 0), 0),
    [cart.groups]
  );

  const summary = useMemo(
    () =>
      calculateSummary(
        cart.groups,
        cart.coupons.reduce((sum, coupon) => sum + coupon.amount, 0),
        cart.loyalty.enabled ? cart.loyalty.applied : 0,
        cart.delivery.method === "delivery" ? cart.delivery.price : 0,
        cart.taxRate
      ),
    [cart]
  );

  const updateGroupItems = (updateFn: (item: CartItem) => CartItem | null) => {
    setCart((prev) => ({
      ...prev,
      groups: prev.groups.map((group) => ({
        ...group,
        items: group.items
          .map((item) => updateFn(item))
          .filter((item): item is CartItem => item !== null),
      })),
    }));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    updateGroupItems((item) => (item.id === id ? { ...item, quantity } : item));
  };

  const handleRemove = (id: string) => {
    updateGroupItems((item) => (item.id === id ? null : item));
  };

  const handleFavorite = (id: string) => {
    // демо: просто удаляем из корзины
    handleRemove(id);
  };

  const handleApplyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    const available = [
      { code: "WELCOME10", description: "-10% на первый заказ", amount: Math.round(summary.subtotal * 0.1) },
      { code: "FREESHIP", description: "Бесплатная доставка", amount: cart.delivery.price },
      { code: "FRIEND300", description: "-300 ₽ по приглашению", amount: 300 },
    ];

    if (cart.coupons.some((coupon) => coupon.code === normalized)) {
      setCouponError("Купон уже применён");
      setCouponFeedback(null);
      return;
    }

    const coupon = available.find((item) => item.code === normalized);
    if (!coupon) {
      setCouponError("Купон не найден");
      setCouponFeedback(null);
      return;
    }

    setCart((prev) => ({ ...prev, coupons: [...prev.coupons, coupon] }));
    setCouponFeedback(`Купон ${coupon.code} применён`);
    setCouponError(null);
  };

  const handleRemoveCoupon = (code: string) => {
    setCart((prev) => ({ ...prev, coupons: prev.coupons.filter((coupon) => coupon.code !== code) }));
  };

  const handleLoyaltyChange = (partial: Partial<CartSnapshot["loyalty"]>) => {
    setCart((prev) => ({ ...prev, loyalty: { ...prev.loyalty, ...partial } }));
  };

  const handleDeliveryChange = (delivery: CartSnapshot["delivery"]) => {
    setCart((prev) => ({ ...prev, delivery }));
  };

  const handleAddUpsell = (item: CartUpsell) => {
    const retailGroupIndex = cart.groups.findIndex((group) => group.id === "retail");
    const groupExists = retailGroupIndex !== -1;
    setCart((prev) => {
      const newItem: CartItem = {
        id: `upsell-${item.id}`,
        type: "retail",
        title: item.title,
        image: item.image,
        href: item.href,
        unitPrice: item.price,
        quantity: 1,
        status: "in_stock",
      };
      const groups = [...prev.groups];
      if (groupExists) {
        groups[retailGroupIndex] = {
          ...groups[retailGroupIndex],
          items: [...groups[retailGroupIndex].items, newItem],
        };
      } else {
        groups.push({ id: "retail", label: "Товары", items: [newItem] });
      }
      return { ...prev, groups };
    });
  };

  const handleNotesChange = (notes: string) => {
    setCart((prev) => ({ ...prev, notes }));
  };

  const handleCheckout = () => {
    console.info("Proceed checkout", summary.total);
  };

  const isEmpty = cart.groups.every((group) => group.items.length === 0);

  const upsellProducts = cart.upsell;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col gap-8 pb-28 lg:pb-6"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(168,85,247,0.12),transparent_60%)]" />
      </div>

      <CartHeader count={totalCount} />

      <AnimatePresence initial={false}>
        {couponFeedback || couponError ? (
          <motion.div
            key="coupon-feedback"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className={cn(
              CARD_SOFT,
              "flex items-center gap-3 border-2 border-white/14 px-4 py-3 text-sm text-white/80 shadow-[0_25px_60px_-40px_rgba(239,68,68,0.45)]"
            )}
          >
            <span
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-2xl border px-2",
                couponError
                  ? "border-rose-400/40 bg-rose-500/20 text-rose-100"
                  : "border-emerald-400/40 bg-emerald-500/20 text-emerald-100"
              )}
            >
              {couponError ? "!" : "✓"}
            </span>
            <span>{couponError ?? couponFeedback}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false} mode="wait">
        {isEmpty ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <EmptyState />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]"
          >
            <div className="space-y-8">
              <CartItems
                groups={cart.groups}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
                onFavorite={handleFavorite}
              />

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <CouponBox coupons={cart.coupons} onApply={handleApplyCoupon} onRemove={handleRemoveCoupon} />

                <LoyaltyToggle loyalty={cart.loyalty} onChange={handleLoyaltyChange} />

                <DeliveryPicker value={cart.delivery} addresses={addressBook} onChange={handleDeliveryChange} />

                <NotesField value={cart.notes ?? ""} onChange={handleNotesChange} />

                <UpsellRail items={upsellProducts} onAdd={handleAddUpsell} />
              </motion.div>
            </div>

            <CartTotals
              groups={cart.groups}
              delivery={cart.delivery}
              loyalty={cart.loyalty}
              coupons={cart.coupons}
              taxRate={cart.taxRate}
              onCheckout={handleCheckout}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <StickyCheckout amount={summary.total} visible={!isEmpty} />
    </motion.div>
  );
}
