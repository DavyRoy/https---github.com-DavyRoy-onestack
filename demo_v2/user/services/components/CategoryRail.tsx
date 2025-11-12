"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { serviceCategories, type ServiceCategory } from "../data/mockUserServicesCategories";

export type CategoryRailProps = {
  active: string | null;
  onSelect: (id: string | null) => void;
  onOpenFilters: () => void;
};

const flattenCategories = (categories: ServiceCategory[]) => {
  const result: Array<{ id: string | null; name: string }> = [{ id: null, name: "Все" }];
  categories.forEach((category) => {
    result.push({ id: category.id, name: category.name });
    category.children?.forEach((child) => result.push({ id: child.id, name: child.name }));
  });
  return result;
};

export default function CategoryRail({ active, onSelect, onOpenFilters }: CategoryRailProps) {
  const chips = useMemo(() => flattenCategories(serviceCategories), []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <div className="overflow-x-auto">
          <div className="flex flex-nowrap gap-2">
            {chips.map((item) => (
              <button
                key={item.id ?? "all"}
                type="button"
                onClick={() => onSelect(item.id)}
                className={clsx(
                  "whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition",
                  active === item.id
                    ? "border-[hsl(var(--brand))] bg-[hsl(var(--brand))]/15 text-[hsl(var(--fg))]"
                    : "border-[hsl(var(--border))] bg-[hsl(var(--panel))] text-[hsl(var(--muted))] hover:bg-[hsl(var(--panel))]/80"
                )}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-2 text-sm font-semibold text-[hsl(var(--fg))] transition hover:bg-[hsl(var(--panel))]/80"
        >
          Фильтры
        </button>
      </div>

      <aside className="hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 p-4 shadow-sm lg:block">
        <h3 className="text-xs uppercase tracking-[0.24em] text-[hsl(var(--muted))]">Категории</h3>
        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={() => onSelect(null)}
            className={clsx(
              "w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition",
              active === null
                ? "bg-[hsl(var(--brand))]/15 text-[hsl(var(--fg))]"
                : "text-[hsl(var(--muted))] hover:bg-[hsl(var(--panel))]/80"
            )}
          >
            Все услуги
          </button>
          {serviceCategories.map((category) => (
            <div key={category.id} className="space-y-2">
              <button
                type="button"
                onClick={() => onSelect(category.id)}
                className={clsx(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition",
                  active === category.id
                    ? "bg-[hsl(var(--brand))]/15 text-[hsl(var(--fg))]"
                    : "text-[hsl(var(--muted))] hover:bg-[hsl(var(--panel))]/80"
                )}
              >
                {category.name}
              </button>
              {category.children?.length ? (
                <ul className="pl-3 text-sm text-[hsl(var(--muted))]">
                  {category.children.map((child) => (
                    <li key={child.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(child.id)}
                        className={clsx(
                          "w-full rounded-lg px-3 py-1.5 text-left transition",
                          active === child.id
                            ? "bg-[hsl(var(--brand))]/15 text-[hsl(var(--fg))]"
                            : "hover:bg-[hsl(var(--panel))]/80"
                        )}
                      >
                        {child.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
