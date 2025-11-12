"use client";

import * as React from "react";
import {
  type SlotTemplate,
  type AdminResource,
  ADMIN_RESOURCES,
} from "@/app/demo/(shared)/booking";

/* ===================== Types ===================== */

export type Conflict = {
  id: string;
  date: string;       // YYYY-MM-DD
  resourceId: string;
  reason: string;     // базовое описание (время/перегрузка)
};

/** Небольшие справочники, которые можно пробросить изнаружи */
export type Lookups = {
  /** id -> { name } */
  locations?: Record<string, { name: string }>;
  /** id -> { name, categoryId? } (если хотите подсветить категорию услуги) */
  services?: Record<string, { name: string; categoryId?: string }>;
  /** id -> { name } */
  categories?: Record<string, { name: string }>;
};

/* ===================== Helpers ===================== */

function toMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0);
}
function fromMin(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function parseMonday(weekStart: string): Date {
  return new Date(weekStart + "T00:00:00");
}
function isoDow(d: Date): number {
  const js = d.getDay();
  return js === 0 ? 7 : js; // 1..7
}
function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function inDateRange(date: string, from?: string, to?: string) {
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

/* ===================== Core ===================== */

export function computeConflicts({
  templates,
  resources,
  weekStart,
  filters,
}: {
  templates: SlotTemplate[];
  resources: AdminResource[];
  weekStart: string; // YYYY-MM-DD (понедельник)
  filters: { resourceId?: string; serviceId?: string; locationId?: string };
}): Conflict[] {
  const monday = parseMonday(weekStart);
  const out: Conflict[] = [];

  for (let offset = 0; offset < 7; offset++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + offset);
    const date = ymd(day);
    const dow = isoDow(day); // 1..7

    let dayRules = templates.filter((t) => {
      if (!t.active) return false;
      if (!t.days?.includes(dow)) return false;
      if (!inDateRange(date, t.dateFrom, t.dateTo)) return false;
      if (filters.locationId && t.locationId && t.locationId !== filters.locationId) return false;
      if (filters.serviceId && t.serviceIds?.length && !t.serviceIds.includes(filters.serviceId)) return false;
      if (filters.resourceId && t.resourceIds?.length && !t.resourceIds.includes(filters.resourceId)) return false;
      return true;
    });
    if (dayRules.length === 0) continue;

    const minStart = Math.min(...dayRules.map((r) => toMin(r.start)));
    const maxEnd = Math.max(...dayRules.map((r) => toMin(r.end)));
    const dayFrom = Math.max(minStart, 6 * 60);
    const dayTo = Math.min(maxEnd, 23 * 60);

    const byResource = new Map<string, SlotTemplate[]>();
    for (const rule of dayRules) {
      const resIds = rule.resourceIds?.length ? rule.resourceIds : ["__none__"];
      for (const rid of resIds) {
        const arr = byResource.get(rid) ?? [];
        arr.push(rule);
        byResource.set(rid, arr);
      }
    }

    byResource.forEach((rules, resId) => {
      if (resId === "__none__") return;

      const res = resources.find((r) => r.id === resId) ?? ADMIN_RESOURCES.find((r) => r.id === resId);
      const capacity = Math.max(1, res?.capacity ?? 1);

      const step = 15;
      for (let m = dayFrom; m < dayTo; m += step) {
        let activeLoad = 0;
        for (const r of rules) {
          const from = toMin(r.start);
          const to = toMin(r.end);
          if (m >= from && m < to) {
            activeLoad += Math.max(1, r.parallel ?? 1);
          }
        }
        if (activeLoad > capacity) {
          out.push({
            id: `cf-${date}-${resId}-${m}`,
            date,
            resourceId: resId,
            reason: `Перегрузка: требуемо ${activeLoad} > capacity ${capacity} в ${fromMin(m)}`,
          });
        }
      }
    });
  }

  return [...new Map(out.map((c) => [c.id, c])).values()];
}

/* ===================== UI ===================== */

export default function ConflictsPanel({
  conflicts,
  resources,
  lookups,
}: {
  conflicts: Conflict[];
  resources: AdminResource[];
  /** Опциональные словари: { locations, services, categories } */
  lookups?: Lookups;
}) {
  if (!conflicts?.length) {
    return <div className="mt-2 text-xs text-white/60">Конфликтов не обнаружено.</div>;
  }

  const resById = React.useMemo(
    () => new Map(resources.map((r) => [r.id, r])),
    [resources]
  );

  return (
    <section className="mt-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-3">
      <div className="text-sm font-medium mb-2">Конфликты расписания</div>
      <ul className="space-y-2 text-xs">
        {conflicts.slice(0, 12).map((c) => {
          const res = resById.get(c.resourceId);
          const resName = res?.name ?? c.resourceId;
          const locationName =
            (res?.locationId && lookups?.locations?.[res.locationId]?.name) || undefined;

          // Категорию подсвечиваем мягко: если есть services lookup и у ресурса есть «основные» услуги
          // (в реальном проекте вы можете пробросить нужную категоризацию явно).
          let categoryName: string | undefined;
          if (lookups?.services && lookups?.categories && res?.services?.length) {
            const firstService = res.services.find((sid) => !!lookups.services?.[sid]);
            const catId = firstService ? lookups.services[firstService].categoryId : undefined;
            categoryName = catId ? lookups.categories[catId]?.name : undefined;
          }

          return (
            <li key={c.id} className="rounded-lg bg-amber-400/5 border border-amber-400/20 p-2">
              <div className="flex items-start gap-2">
                <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
                <div className="min-w-0">
                  {/* основная строка */}
                  <div>
                    <b>{c.date}</b> • {c.reason} • ресурс: <code>{resName}</code>
                  </div>

                  {/* метаданные ресурса */}
                  {(locationName || categoryName) && (
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-white/80">
                      {locationName && (
                        <span className="inline-flex items-center gap-1 rounded bg-white/10 px-1.5 py-0.5">
                          <span className="opacity-80">Локация:</span> {locationName}
                        </span>
                      )}
                      {categoryName && (
                        <span className="inline-flex items-center gap-1 rounded bg-white/10 px-1.5 py-0.5">
                          <span className="opacity-80">Категория:</span> {categoryName}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {conflicts.length > 12 && (
        <div className="text-[11px] text-white/70 mt-2">… и ещё {conflicts.length - 12}</div>
      )}
    </section>
  );
}