"use client";

import { CreditCard, ReceiptText, Landmark, Banknote, HelpCircle } from "lucide-react";

export default function MethodBadge({
  method,
}: {
  method: "card" | "invoice" | "cash" | "bank";
}) {
  const common =
    "inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.08] px-2 py-0.5 text-[11px] sm:text-xs text-white/90";

  const map: Record<
    "card" | "invoice" | "cash" | "bank",
    { label: string; icon: JSX.Element }
  > = {
    card: { label: "Карта", icon: <CreditCard width={12} height={12} /> },
    invoice: { label: "Счёт", icon: <ReceiptText width={12} height={12} /> },
    cash: { label: "Наличные", icon: <Banknote width={12} height={12} /> },
    bank: { label: "Банк", icon: <Landmark width={12} height={12} /> },
  };

  const entry = map[method];

  if (!entry) {
    return (
      <span
        className={common}
        aria-label="Неизвестный метод оплаты"
        title="Неизвестный метод оплаты"
      >
        <HelpCircle width={12} height={12} /> —
      </span>
    );
  }

  return (
    <span
      className={common}
      aria-label={`Метод оплаты: ${entry.label}`}
      title={`Метод оплаты: ${entry.label}`}
    >
      {entry.icon}
      {entry.label}
    </span>
  );
}