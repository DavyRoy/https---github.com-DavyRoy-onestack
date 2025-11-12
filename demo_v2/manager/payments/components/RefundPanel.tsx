"use client";

import { useMemo, useState, useCallback } from "react";
import { toast } from "sonner";

const T = {
  card:
    "rounded-2xl border border-white/15 bg-white/[0.05] p-4 backdrop-blur-sm",
  input:
    "w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30 placeholder:text-white/40",
  sel: "w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30",
  btn: "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 disabled:opacity-60 disabled:cursor-not-allowed",
  chip:
    "rounded-full border border-white/15 bg-white/10 px-2 py-1 text-xs hover:bg-white/15",
  dim: "text-white/70",
  err: "text-xs text-red-300",
};

type Props = {
  maxAmount: number;
  currency: string;
  onSubmit: (amount: number, reason: string) => void;
  onCancel?: () => void;
};

export default function RefundPanel({
  maxAmount,
  currency,
  onSubmit,
  onCancel,
}: Props) {
  // храним строку, чтобы не терять ведущие нули/запятую у пользователя
  const [amountStr, setAmountStr] = useState<string>(
    String(maxAmount ?? 0)
  );
  const [reason, setReason] = useState<string>("customer_request");
  const step = useMemo(() => (currency === "RUB" ? 1 : 0.01), [currency]);

  const amount = useMemo(() => {
    const normalized = amountStr.replace(",", ".").trim();
    const n = Number(normalized);
    return isFinite(n) ? n : NaN;
  }, [amountStr]);

  const invalid =
    !isFinite(amount) ||
    amount <= 0 ||
    amount > maxAmount ||
    Number(amount.toFixed(2)) === 0;

  const fmt = useCallback(
    (n: number) =>
      `${n.toLocaleString("ru-RU", {
        minimumFractionDigits: step === 1 ? 0 : 2,
        maximumFractionDigits: step === 1 ? 0 : 2,
      })} ${currency}`,
    [currency, step]
  );

  const setPct = (p: number) => {
    const v = Math.max(0, Math.min(maxAmount, Math.round((maxAmount * p) / step) * step));
    setAmountStr(String(step === 1 ? Math.round(v) : Number(v.toFixed(2))));
  };

  const submit = () => {
    if (invalid) {
      toast.error(
        `Сумма должна быть в пределах 1…${fmt(maxAmount)}`
      );
      return;
    }
    onSubmit(Number(amount.toFixed(2)), reason);
  };

  return (
    <div className={T.card}>
      <div className="text-base font-semibold">Возврат (демо)</div>

      <div className="mt-2 grid gap-3 md:grid-cols-2">
        {/* Сумма */}
        <label className="grid gap-1">
          <span className="text-xs text-white/70">Сумма</span>
          <div className="flex items-center gap-2">
            <input
              className={T.input}
              inputMode="decimal"
              type="number"
              step={step}
              min={step}
              max={maxAmount}
              placeholder={String(step)}
              aria-invalid={invalid}
              aria-describedby="refund-help"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              onBlur={() => {
                if (!amountStr.trim()) return;
                if (!isFinite(amount)) return;
                const v = Math.min(Math.max(amount, step), maxAmount);
                setAmountStr(
                  String(step === 1 ? Math.round(v) : Number(v.toFixed(2)))
                );
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={T.chip} onClick={() => setPct(0.25)}>
              25% ({fmt(maxAmount * 0.25)})
            </button>
            <button type="button" className={T.chip} onClick={() => setPct(0.5)}>
              50% ({fmt(maxAmount * 0.5)})
            </button>
            <button type="button" className={T.chip} onClick={() => setPct(1)}>
              100% ({fmt(maxAmount)})
            </button>
          </div>
          {invalid ? (
            <div className={T.err} id="refund-help">
              Введите сумму от {fmt(step)} до {fmt(maxAmount)}.
            </div>
          ) : (
            <div className={"text-xs " + T.dim} id="refund-help">
              Будет возвращено: <b>{fmt(amount || 0)}</b>
            </div>
          )}
        </label>

        {/* Причина */}
        <label className="grid gap-1">
          <span className="text-xs text-white/70">Причина</span>
          <select
            className={T.sel}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="customer_request">Запрос клиента</option>
            <option value="double_payment">Двойной платёж</option>
            <option value="fraud_suspect">Подозрение на мошенничество</option>
            <option value="service_issue">Проблема с услугой</option>
          </select>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button className={T.btn} onClick={() => setPct(1)}>
          Вся сумма
        </button>
        <div className="ml-auto flex gap-2">
          {onCancel && (
            <button className={T.btn} onClick={onCancel}>
              Отмена
            </button>
          )}
          <button className={T.btn} onClick={submit} disabled={invalid}>
            Выполнить возврат
          </button>
        </div>
      </div>

      <p className={"mt-2 text-xs " + T.dim}>
        Действие демонстрационное: статус платежа изменится на <b>refunded</b>.
      </p>
    </div>
  );
}