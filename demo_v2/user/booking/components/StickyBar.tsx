"use client";

export default function StickyBar({ amount, onContinue }: { amount: number; onContinue: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[hsl(var(--border))]/60 bg-[hsl(var(--panel))]/95 px-4 py-4 shadow-2xl backdrop-blur lg:hidden">
      <div className="mx-auto flex w-full max-w-md items-center justify-between">
        <div>
          <p className="text-xs text-[hsl(var(--muted))]">Итого</p>
          <p className="text-lg font-semibold text-[hsl(var(--fg))]">{amount.toLocaleString("ru-RU")} ₽</p>
        </div>
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Продолжить
        </button>
      </div>
    </div>
  );
}
