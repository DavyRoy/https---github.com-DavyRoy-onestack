"use client";

export default function PriceBox({
  basePrice,
  addonsPrice,
  deposit,
  onContinue,
}: {
  basePrice: number;
  addonsPrice: number;
  deposit?: number;
  onContinue: () => void;
}) {
  const total = basePrice + addonsPrice;
  return (
    <aside className="space-y-4 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 p-6 shadow-lg">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-[hsl(var(--muted))]">Стоимость</p>
        <p className="mt-2 text-lg font-semibold text-[hsl(var(--fg))]">
          {total.toLocaleString("ru-RU")} ₽
          {addonsPrice > 0 ? (
            <span className="text-xs text-[hsl(var(--muted))]"> (допы +{addonsPrice.toLocaleString("ru-RU")} ₽)</span>
          ) : null}
        </p>
        {deposit ? (
          <p className="text-sm text-[hsl(var(--muted))]">Депозит: {deposit.toLocaleString("ru-RU")} ₽ — оплатите на следующем шаге</p>
        ) : (
          <p className="text-sm text-[hsl(var(--muted))]">Оплата после подтверждения. Промокоды и баллы применяются на шаге оплаты.</p>
        )}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="inline-flex w-full items-center justify-center rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Продолжить
      </button>
    </aside>
  );
}
