"use client";

export default function AddToCalendar({ bookingId }: { bookingId: string }) {
  return (
    <section className="space-y-2 rounded-3xl border border-[hsl(var(--border))]/70 bg-[hsl(var(--panel))]/70 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-[hsl(var(--fg))]">Добавить в календарь</h3>
      <div className="flex flex-wrap gap-2 text-sm text-[hsl(var(--muted))]">
        <a href={`/demo/api/calendar/bookings/${bookingId}.ics`} className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 hover:bg-[hsl(var(--panel))]/80">
          Скачать .ics
        </a>
        <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 hover:bg-[hsl(var(--panel))]/80">
          Google Calendar
        </a>
        <a href="https://www.icloud.com/calendar/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 hover:bg-[hsl(var(--panel))]/80">
          Apple Calendar
        </a>
      </div>
    </section>
  );
}
