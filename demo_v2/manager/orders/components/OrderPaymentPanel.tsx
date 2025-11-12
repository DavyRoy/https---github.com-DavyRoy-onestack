"use client";

import { useMemo } from "react";
import { CreditCard, RotateCcw, Send } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";

export type PaymentEvent = {
  id: string;
  time: string;            // ISO
  type: "pay" | "refund" | "invoice";
  amount?: number;
  note?: string;
};

type OrderStatus = "new" | "confirmed" | "paid" | "completed" | "cancelled" | "refunded";

export default function OrderPaymentPanel({
  amount,
  status,
  history,
  onPay,
  onRefund,
  onSendInvoice,
}: {
  amount: number;
  status: OrderStatus;
  history: PaymentEvent[];
  onPay: () => void;
  onRefund: () => void;
  onSendInvoice: () => void;
}) {
  const statusText =
    status === "paid"
      ? "Оплачен"
      : status === "refunded"
      ? "Возвращён"
      : "Не оплачен";

  const canPay = status === "confirmed";
  const canRefund = status === "paid";

  const fmtAmount = (n: number) => n.toLocaleString("ru-RU");
  const fmtDT = useMemo(
    () =>
      new Intl.DateTimeFormat("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    []
  );

  const badgeTone =
    status === "paid"
      ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
      : status === "refunded"
      ? "border-amber-300/30 bg-amber-300/10 text-amber-200"
      : "border-white/20 bg-white/5 text-white/80";

  return (
    <section className={T.card + " grid gap-3"} aria-labelledby="payment-title">
      <div className="flex items-start justify-between gap-2">
        <h2 id="payment-title" className="text-base font-semibold">
          Оплата
        </h2>
        <span
          className={[
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]",
            badgeTone,
          ].join(" ")}
          aria-live="polite"
        >
          {statusText}
        </span>
      </div>

      {/* Сводка (мобильная колонка, на десктопе — 2 столбца) */}
      <dl className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-0.5">
          <dt className={"text-xs " + T.dim}>Статус платежа</dt>
          <dd className="text-sm">{statusText}</dd>
        </div>
        <div className="grid gap-0.5">
          <dt className={"text-xs " + T.dim}>Сумма к оплате</dt>
          <dd className="text-lg font-semibold tabular-nums">
            {fmtAmount(amount)} ₽
          </dd>
        </div>
      </dl>

      {/* Действия (на мобиле — во всю ширину) */}
      <div className="mt-1 grid gap-2 sm:flex sm:flex-wrap">
        <button
          className="btn w-full sm:w-auto justify-center min-h-[40px]"
          onClick={onPay}
          disabled={!canPay}
          aria-disabled={!canPay}
          title="Доступно из статуса «Подтверждён»"
        >
          <CreditCard width={16} height={16} aria-hidden /> Оплатить (демо)
        </button>
        <button
          className="btn w-full sm:w-auto justify-center min-h-[40px]"
          onClick={onRefund}
          disabled={!canRefund}
          aria-disabled={!canRefund}
          title="Доступно из статуса «Оплачен»"
        >
          <RotateCcw width={16} height={16} aria-hidden /> Вернуть (демо)
        </button>
        <button
          className="btn w-full sm:w-auto justify-center min-h-[40px]"
          onClick={onSendInvoice}
        >
          <Send width={16} height={16} aria-hidden /> Отправить счёт (демо)
        </button>
      </div>

      {/* История */}
      <div
        className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
        aria-live="polite"
      >
        <div className="text-sm font-medium">История платежей (демо)</div>

        {history.length === 0 ? (
          <div className="mt-2 text-sm text-white/70">Пока пусто.</div>
        ) : (
          <ul className="mt-2 grid gap-1 text-sm">
            {history.map((h) => (
              <li
                key={h.id}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate">
                      {h.type === "pay" && "Оплата"}
                      {h.type === "refund" && "Возврат"}
                      {h.type === "invoice" && "Счёт отправлен"}
                      {typeof h.amount === "number" ? (
                        <>
                          {" "}
                          —{" "}
                          <b className="tabular-nums">
                            {fmtAmount(h.amount)} ₽
                          </b>
                        </>
                      ) : null}
                    </div>
                    {h.note ? (
                      <div className="text-[11px] text-white/60">{h.note}</div>
                    ) : null}
                  </div>

                  {/* На мобиле переносим дату на вторую строку, чтобы не резалась */}
                  <div className="text-xs text-white/60 shrink-0 hidden sm:block">
                    {fmtDT.format(new Date(h.time))}
                  </div>
                </div>
                <div className="text-xs text-white/60 sm:hidden mt-0.5">
                  {fmtDT.format(new Date(h.time))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}