import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--panel))]/60 px-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 text-2xl text-[hsl(var(--muted))]">
        📆
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-[hsl(var(--fg))]">Нет событий</h2>
        <p className="text-sm text-[hsl(var(--muted))]">Попробуйте изменить фильтры или запланируйте новую услугу.</p>
      </div>
      <Link
        href="/demo/user/booking"
        className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-2 text-sm font-semibold text-white"
      >
        Записаться
      </Link>
    </div>
  );
}
