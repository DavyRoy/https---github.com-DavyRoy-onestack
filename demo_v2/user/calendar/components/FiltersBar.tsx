"use client";

export type CalendarTypeFilters = {
  booking: boolean;
  payment: boolean;
  order: boolean;
  reminder: boolean;
};

export default function FiltersBar({
  filters,
  onChange,
  showPast,
  onTogglePast,
}: {
  filters: CalendarTypeFilters;
  onChange: (filters: CalendarTypeFilters) => void;
  showPast: boolean;
  onTogglePast: (value: boolean) => void;
}) {
  const toggle = (key: keyof CalendarTypeFilters) => {
    onChange({ ...filters, [key]: !filters[key] });
  };

  return (
    <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 px-4 py-3 text-sm text-[hsl(var(--muted))]">
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.booking}
            onChange={() => toggle("booking")}
            className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--brand))]"
          />
          Записи
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.payment}
            onChange={() => toggle("payment")}
            className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--brand))]"
          />
          Оплаты
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.order}
            onChange={() => toggle("order")}
            className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--brand))]"
          />
          Заказы
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.reminder}
            onChange={() => toggle("reminder")}
            className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--brand))]"
          />
          Напоминания
        </label>
      </div>

      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={showPast}
          onChange={(event) => onTogglePast(event.target.checked)}
          className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--brand))]"
        />
        Показывать прошедшие
      </label>
    </section>
  );
}
