"use client";

import Link from "next/link";

export default function StickyBookBar({ amount, serviceId, slotId }: { amount: number; serviceId: string; slotId?: string | null }) {
  const href = slotId
    ? `/demo/user/booking?service=${serviceId}&slot=${encodeURIComponent(slotId)}`
    : `/demo/user/booking?service=${serviceId}`;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[hsl(var(--border))]/60 bg-[hsl(var(--panel))]/95 px-4 py-4 shadow-2xl backdrop-blur lg:hidden">
      <div className="mx-auto flex w-full max-w-md items-center justify-between">
        <div>
          <p className="text-xs text-[hsl(var(--muted))]">Стоимость</p>
          <p className="text-lg font-semibold text-[hsl(var(--fg))]">{amount.toLocaleString("ru-RU")} ₽</p>
        </div>
        <Link
          href={href}
          className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Выбрать дату
        </Link>
      </div>
    </div>
  );
}
