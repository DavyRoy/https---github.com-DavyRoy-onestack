"use client";

export default function ExportMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative mt-2 inline-flex">
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/95 p-3 shadow-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted))]">Экспорт</p>
        <div className="mt-2 grid gap-2 text-sm text-[hsl(var(--muted))]">
          <a href="/demo/api/calendar/export.ics" className="hover:text-[hsl(var(--fg))]">
            Скачать .ics
          </a>
          <a href="https://calendar.google.com" className="hover:text-[hsl(var(--fg))]" target="_blank" rel="noopener noreferrer">
            Google Calendar
          </a>
          <a href="https://www.icloud.com/calendar/" className="hover:text-[hsl(var(--fg))]" target="_blank" rel="noopener noreferrer">
            Apple Calendar
          </a>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-1 text-xs text-[hsl(var(--muted))] hover:bg-[hsl(var(--panel))]/80"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
