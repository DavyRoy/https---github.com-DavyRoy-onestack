"use client";

export type BookingFilters = {
  status: string;
  location: string | null;
  staff: string | null;
  service: string | null;
  withDeposit: boolean;
};

export default function FiltersBar({
  filters,
  onChange,
  locations,
  staffOptions,
  services,
}: {
  filters: BookingFilters;
  onChange: (filters: BookingFilters) => void;
  locations: Array<{ id: string; label: string }>;
  staffOptions: Array<{ id: string; name: string }>;
  services: Array<{ id: string; title: string }>;
}) {
  return (
    <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 px-4 py-3 text-sm text-[hsl(var(--muted))]">
      <label className="flex items-center gap-2">
        Статус
        <select
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value })}
          className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1 text-sm text-[hsl(var(--fg))]"
        >
          <option value="upcoming">Предстоящие</option>
          <option value="completed">Завершённые</option>
          <option value="cancelled">Отменённые</option>
          <option value="pending">Ожидают</option>
          <option value="all">Все</option>
        </select>
      </label>

      <label className="flex items-center gap-2">
        Локация
        <select
          value={filters.location ?? ""}
          onChange={(event) => onChange({ ...filters, location: event.target.value || null })}
          className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1 text-sm text-[hsl(var(--fg))]"
        >
          <option value="">Все</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2">
        Мастер
        <select
          value={filters.staff ?? ""}
          onChange={(event) => onChange({ ...filters, staff: event.target.value || null })}
          className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1 text-sm text-[hsl(var(--fg))]"
        >
          <option value="">Не важно</option>
          {staffOptions.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2">
        Услуга
        <select
          value={filters.service ?? ""}
          onChange={(event) => onChange({ ...filters, service: event.target.value || null })}
          className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1 text-sm text-[hsl(var(--fg))]"
        >
          <option value="">Любая</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.title}
            </option>
          ))}
        </select>
      </label>

      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={filters.withDeposit}
          onChange={(event) => onChange({ ...filters, withDeposit: event.target.checked })}
          className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--brand))]"
        />
        С депозитом
      </label>
    </section>
  );
}
