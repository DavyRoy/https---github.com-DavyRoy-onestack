// app/demo/user/checkout/components/CheckoutPromo.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Check, Copy, Percent, X } from "lucide-react";

type Props = {
  /** Купон из URL (?coupon=...) — подставляется автоматически */
  initialCoupon?: string;
};

const ring =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--panel))]";

const STORAGE_KEY = "ones-cart-coupon";

/** простая мок-валидация: в проде вызывать server action / api */
function validateCoupon(code: string) {
  const c = code.trim().toUpperCase();
  if (!c) return { ok: false, msg: "Введите промокод" };
  if (c.length < 4) return { ok: false, msg: "Слишком короткий код" };
  // пример: -15% по WEEKDAY или ONEFRIEND — валидные
  const ok = ["WEEKDAY", "ONEFRIEND"].includes(c) || /^[A-Z0-9]{5,}$/.test(c);
  return { ok, msg: ok ? "Промокод применён" : "Код не найден" };
}

export default function CheckoutPromo({ initialCoupon }: Props) {
  const [value, setValue] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const hasApplied = !!applied;

  // гидратация из localStorage + URL
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || "";
      const start = (initialCoupon || saved || "").trim();
      if (start) {
        setValue(start);
        const { ok, msg } = validateCoupon(start);
        if (ok) {
          setApplied(start.toUpperCase());
          setMessage(msg);
          // уведомим другие виджеты
          window.dispatchEvent(new CustomEvent("cart:couponApplied", { detail: { code: start.toUpperCase() } }));
        }
      }
    } catch {}
  }, [initialCoupon]);

  const onApply = () => {
    const { ok, msg } = validateCoupon(value);
    setMessage(msg);
    if (ok) {
      const up = value.trim().toUpperCase();
      setApplied(up);
      try {
        localStorage.setItem(STORAGE_KEY, up);
      } catch {}
      window.dispatchEvent(new CustomEvent("cart:couponApplied", { detail: { code: up } }));
    }
  };

  const onClear = () => {
    setApplied(null);
    setMessage(null);
    setValue("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    window.dispatchEvent(new CustomEvent("cart:couponApplied", { detail: { code: null } }));
  };

  const hint = useMemo(() => {
    if (!message) return null;
    const ok = /применён|applied/i.test(message);
    return (
      <div
        className={clsx(
          "mt-2 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs",
          ok
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
            : "border-rose-500/30 bg-rose-500/10 text-rose-500"
        )}
        role="status"
        aria-live="polite"
      >
        {ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
        <span>{message}</span>
      </div>
    );
  }, [message]);

  return (
    <section className="rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--panel))]/80 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[hsl(var(--muted))]">Промокод</p>
          <h2 className="text-lg font-semibold tracking-tight">Скидка и бонусы</h2>
        </div>
      </div>

      <div className="mt-4 grid items-center gap-3 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center">
            <Percent className="h-4 w-4 text-[hsl(var(--muted))]" aria-hidden />
          </div>
          <input
            inputMode="text"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="Введите промокод"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={clsx(
              "w-full rounded-xl border bg-[hsl(var(--panel))] pl-10 pr-10 h-11 text-sm",
              "border-[hsl(var(--border))]/60 text-[hsl(var(--fg))] placeholder:text-[hsl(var(--muted))]",
              ring
            )}
          />
          {/* Быстро скопировать текущий код (напр. если пришли из Loyalty) */}
          {value && (
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(value)}
              aria-label="Скопировать промокод"
              className={clsx(
                "absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-lg border",
                "border-[hsl(var(--border))]/50 bg-[hsl(var(--panel))] hover:bg-[hsl(var(--panel))]/85",
                ring
              )}
            >
              <Copy className="h-4 w-4 text-[hsl(var(--muted))]" aria-hidden />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!hasApplied ? (
            <button
              type="button"
              onClick={onApply}
              className={clsx(
                "inline-flex items-center justify-center rounded-full border px-4 h-11 text-sm font-semibold",
                "border-[hsl(var(--brand))] bg-[hsl(var(--brand))] text-white hover:opacity-90",
                ring
              )}
            >
              Применить
            </button>
          ) : (
            <button
              type="button"
              onClick={onClear}
              className={clsx(
                "inline-flex items-center justify-center rounded-full border px-4 h-11 text-sm font-semibold",
                "border-[hsl(var(--border))]/60 bg-[hsl(var(--panel))] hover:bg-[hsl(var(--panel))]/85",
                ring
              )}
            >
              Убрать код
            </button>
          )}
        </div>
      </div>

      {/* Статус валидации */}
      {hint}

      {/* Подсказка */}
      <div className="mt-4 rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--panel))]/70 px-4 py-3 text-xs text-[hsl(var(--muted))]">
        Купон можно передать ссылкой — например, <code>?coupon=ONEFRIEND</code>. Мы подставим его автоматически.
      </div>
    </section>
  );
}