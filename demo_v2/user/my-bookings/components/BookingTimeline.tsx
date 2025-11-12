import type { MyBooking } from "../data/mockUserMyBookings";

export default function BookingTimeline({ booking }: { booking: MyBooking }) {
  if (!booking.history.length) return null;
  return (
    <section className="space-y-3 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-[hsl(var(--fg))]">История изменений</h3>
      <ol className="space-y-3 border-l border-[hsl(var(--border))]/70 pl-4 text-sm text-[hsl(var(--muted))]">
        {booking.history.map((item) => (
          <li key={item.id} className="relative">
            <span className="absolute -left-3 mt-1 h-2 w-2 rounded-full bg-[hsl(var(--brand))]" aria-hidden />
            <p className="text-xs text-[hsl(var(--muted))]">{new Date(item.date).toLocaleString("ru-RU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
            <p>{item.message}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
