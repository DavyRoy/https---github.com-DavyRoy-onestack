"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { serviceCategories } from "../data/mockUserServicesCategories";
import { tags } from "../data/mockUserServices";

export type ServicesFilters = {
  categories: string[];
  duration: { min: number | null; max: number | null };
  price: { min: number | null; max: number | null };
  staff: string[];
  location: string | null;
  tags: string[];
};

export type FiltersPanelProps = {
  mode: "inline" | "sheet";
  value: ServicesFilters;
  visible?: boolean;
  onChange: (value: ServicesFilters) => void;
  onApply?: () => void;
  onClose?: () => void;
  onReset: () => void;
  staffOptions: Array<{ id: string; name: string }>;
  locationOptions: Array<{ id: string; label: string }>;
};

function useDraft(value: ServicesFilters, mode: "inline" | "sheet", visible?: boolean) {
  const [draft, setDraft] = useState(value);
  useEffect(() => {
    if (mode === "sheet" && visible) {
      setDraft(value);
    }
  }, [mode, value, visible]);
  return mode === "inline" ? [value, setDraft] : [draft, setDraft];
}

const overlayClasses = "fixed inset-0 z-[1200] flex items-end justify-center bg-black/60 px-4 py-6 sm:items-center";

const renderTree = (
  active: string[],
  toggle: (id: string) => void,
  level = 0
) => {
  const categories = level === 0 ? serviceCategories : [];
  const renderChildren = (children: typeof serviceCategories) => (
    <ul role="list" className={clsx("space-y-1", level > 0 && "pl-4 border-l border-[hsl(var(--border))]/70") }>
      {children.map((category) => (
        <li key={category.id}>
          <button
            type="button"
            onClick={() => toggle(category.id)}
            className={clsx(
              "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition",
              active.includes(category.id)
                ? "bg-[hsl(var(--brand))]/15 text-[hsl(var(--fg))]"
                : "text-[hsl(var(--muted))] hover:bg-[hsl(var(--panel))]/80"
            )}
          >
            {category.name}
            {category.children?.length ? (
              <span className="text-xs text-[hsl(var(--muted))]">{active.includes(category.id) ? "✓" : "+"}</span>
            ) : null}
          </button>
          {category.children?.length
            ? renderChildren(category.children as typeof serviceCategories)
            : null}
        </li>
      ))}
    </ul>
  );

  return renderChildren(categories);
};

export default function FiltersPanel({
  mode,
  value,
  visible = false,
  onChange,
  onApply,
  onClose,
  onReset,
  staffOptions,
  locationOptions,
}: FiltersPanelProps) {
  const [draft, setDraft] = useDraft(value, mode, visible);
  const filters = draft;

  const update = (partial: Partial<ServicesFilters>) => {
    const next = { ...filters, ...partial } as ServicesFilters;
    if (mode === "inline") onChange(next);
    else setDraft(next);
  };

  const toggleArray = (key: "categories" | "staff" | "tags", id: string) => {
    const current = new Set(filters[key]);
    if (current.has(id)) current.delete(id);
    else current.add(id);
    update({ [key]: Array.from(current) } as Partial<ServicesFilters>);
  };

  const content = (
    <div className="flex w-full flex-col gap-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))] p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[hsl(var(--muted))]">Фильтры</p>
          <h3 className="text-lg font-semibold text-[hsl(var(--fg))]">Подберите услугу</h3>
        </div>
        {mode === "sheet" && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--border))] text-[hsl(var(--fg))] hover:bg-[hsl(var(--panel))]/80"
            aria-label="Закрыть фильтры"
          >
            ×
          </button>
        )}
      </div>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-[hsl(var(--fg))]">Категории</h4>
        {renderTree(filters.categories, (id) => toggleArray("categories", id))}
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-[hsl(var(--fg))]">Длительность, мин</h4>
        <div className="flex items-center gap-3">
          <label className="flex flex-1 flex-col text-xs text-[hsl(var(--muted))]">
            от
            <input
              type="number"
              min={0}
              value={filters.duration.min ?? ""}
              onChange={(event) => update({ duration: { ...filters.duration, min: event.target.value ? Number(event.target.value) : null } })}
              className="mt-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 px-3 py-2 text-sm text-[hsl(var(--fg))]"
            />
          </label>
          <label className="flex flex-1 flex-col text-xs text-[hsl(var(--muted))]">
            до
            <input
              type="number"
              min={0}
              value={filters.duration.max ?? ""}
              onChange={(event) => update({ duration: { ...filters.duration, max: event.target.value ? Number(event.target.value) : null } })}
              className="mt-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 px-3 py-2 text-sm text-[hsl(var(--fg))]"
            />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-[hsl(var(--fg))]">Цена, ₽</h4>
        <div className="flex items-center gap-3">
          <label className="flex flex-1 flex-col text-xs text-[hsl(var(--muted))]">
            от
            <input
              type="number"
              min={0}
              value={filters.price.min ?? ""}
              onChange={(event) => update({ price: { ...filters.price, min: event.target.value ? Number(event.target.value) : null } })}
              className="mt-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 px-3 py-2 text-sm text-[hsl(var(--fg))]"
            />
          </label>
          <label className="flex flex-1 flex-col text-xs text-[hsl(var(--muted))]">
            до
            <input
              type="number"
              min={0}
              value={filters.price.max ?? ""}
              onChange={(event) => update({ price: { ...filters.price, max: event.target.value ? Number(event.target.value) : null } })}
              className="mt-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 px-3 py-2 text-sm text-[hsl(var(--fg))]"
            />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-[hsl(var(--fg))]">Исполнители</h4>
        <div className="flex flex-wrap gap-2">
          {staffOptions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleArray("staff", item.id)}
              className={clsx(
                "rounded-full border px-3 py-1.5 text-sm",
                filters.staff.includes(item.id)
                  ? "border-[hsl(var(--brand))] bg-[hsl(var(--brand))]/15 text-[hsl(var(--fg))]"
                  : "border-[hsl(var(--border))] bg-[hsl(var(--panel))] text-[hsl(var(--muted))] hover:bg-[hsl(var(--panel))]/80"
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-[hsl(var(--fg))]">Локация</h4>
        <select
          value={filters.location ?? ""}
          onChange={(event) => update({ location: event.target.value || null })}
          className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 px-3 py-2 text-sm text-[hsl(var(--fg))]"
        >
          <option value="">Любая</option>
          {locationOptions.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.label}
            </option>
          ))}
        </select>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-[hsl(var(--fg))]">Теги</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleArray("tags", tag.id)}
              className={clsx(
                "rounded-full border px-3 py-1.5 text-sm",
                filters.tags.includes(tag.id)
                  ? "border-[hsl(var(--brand))] bg-[hsl(var(--brand))]/15 text-[hsl(var(--fg))]"
                  : "border-[hsl(var(--border))] bg-[hsl(var(--panel))] text-[hsl(var(--muted))] hover:bg-[hsl(var(--panel))]/80"
              )}
            >
              #{tag.label}
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => {
            setDraft(value);
            onReset();
          }}
          className="rounded-full border border-[hsl(var(--border))] px-4 py-2 text-sm text-[hsl(var(--muted))] hover:bg-[hsl(var(--panel))]/80"
        >
          Сбросить
        </button>
        {mode === "sheet" ? (
          <button
            type="button"
            onClick={() => {
              onChange(filters);
              onApply?.();
            }}
            className="rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Применить
          </button>
        ) : null}
      </div>
    </div>
  );

  if (mode === "inline") return <div className="hidden lg:block">{content}</div>;
  if (!visible) return null;
  return createPortal(
    <div className={overlayClasses} role="dialog" aria-modal>
      <div className="w-full max-w-md">{content}</div>
    </div>,
    document.body
  );
}
