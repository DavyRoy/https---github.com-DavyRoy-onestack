import type { OrderTimelineEntry } from "../data/mockUserMyOrders";

export default function OrderTimeline({ entries }: { entries: OrderTimelineEntry[] }) {
  if (!entries.length) return null;
  return (
    <section className="space-y-3 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-[hsl(var(--fg))]">Прогресс заказа</h3>
      <ol className="space-y-3 border-l border-[hsl(var(--border))]/70 pl-4 text-sm text-[hsl(var(--muted))]">
        {entries.map((entry) => (
          <li key={entry.id} className="relative">
            <span className="absolute -left-3 mt-1 h-2 w-2 rounded-full bg-[hsl(var(--brand))]" aria-hidden />
            <p className="text-xs text-[hsl(var(--muted))]">{new Date(entry.date).toLocaleString("ru-RU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
            <p className="font-semibold text-[hsl(var(--fg))]">{entry.label}</p>
            {entry.description ? <p>{entry.description}</p> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
