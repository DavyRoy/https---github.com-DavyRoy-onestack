// app/demo/admin/booking/components/ResourceForm.tsx
"use client";

import * as React from "react";
import {
  type AdminResource,
  loadResources,
  saveResources,
} from "@/app/demo/(shared)/booking";

export type ResourceFormValue = Omit<AdminResource, "id"> & { id?: string };

/* -------- helpers -------- */

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function normInt(v: unknown, fallback = 0) {
  const n = Math.trunc(Number(v));
  return Number.isFinite(n) ? n : fallback;
}

function uniq<T>(xs: T[]) {
  return Array.from(new Set(xs));
}

/* -------- component -------- */

export default function ResourceForm({
  initial,
  onSaved,
}: {
  initial?: ResourceFormValue;
  onSaved: (id: string) => void;
}) {
  // Нормализуем initial под актуальную схему
  const [data, setData] = React.useState<ResourceFormValue>(() => ({
    id: initial?.id,
    type: initial?.type ?? "staff",
    name: initial?.name ?? "",
    locationId: (initial?.locationId ?? "loc-center") as string,
    capacity: Math.max(1, normInt(initial?.capacity ?? 1, 1)),
    services: Array.isArray(initial?.services) ? initial!.services.filter(Boolean) : [],
    active: Boolean(initial?.active ?? true),
  }));

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);

  function set<K extends keyof ResourceFormValue>(k: K, v: ResourceFormValue[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = "Укажите название/имя";
    if (!String(data.locationId ?? "").trim()) e.locationId = "Укажите локацию";
    const cap = normInt(data.capacity, NaN);
    if (!Number.isFinite(cap) || cap < 1) e.capacity = "Вместимость должна быть ≥ 1";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit() {
    if (!validate() || submitting) return;
    setSubmitting(true);

    const rows = loadResources();
    const id = data.id || `res-${Date.now()}`;

    const payload: AdminResource = {
      id,
      type: data.type,
      name: data.name.trim(),
      locationId: String(data.locationId ?? "").trim() || undefined,
      capacity: Math.max(1, normInt(data.capacity, 1)),
      active: Boolean(data.active),
      services: uniq(
        (Array.isArray(data.services) ? data.services : [])
          .map((s) => String(s).trim())
          .filter(Boolean)
      ),
    };

    const idx = rows.findIndex((r) => r.id === id);
    const next =
      idx >= 0
        ? [...rows.slice(0, idx), payload, ...rows.slice(idx + 1)]
        : [...rows, payload];

    saveResources(next);
    setSubmitting(false);
    onSaved(id);
  }

  // Строка для редактирования списка услуг
  const servicesStr = React.useMemo(() => (data.services ?? []).join(", "), [data.services]);

  return (
    <div
      className="grid gap-3"
      role="group"
      aria-labelledby="resource-form-title"
      aria-describedby="resource-form-help"
    >
      <div id="resource-form-title" className="text-sm font-medium">
        Ресурс
      </div>
      <div id="resource-form-help" className="text-[11px] text-white/50">
        Укажите базовые свойства ресурса для расписаний и бронирования.
      </div>

      {/* Тип + Локация */}
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="text-white/70">Тип ресурса</span>
          <select
            value={data.type}
            onChange={(e) => set("type", e.target.value as AdminResource["type"])}
            className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 outline-none focus:ring-2 focus:ring-white/25"
            aria-invalid={false}
          >
            <option value="staff">Сотрудник</option>
            <option value="room">Помещение/кабинет</option>
            <option value="equipment">Оборудование</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm">
          <span className="text-white/70">Локация</span>
          <input
            value={String(data.locationId ?? "")}
            onChange={(e) => set("locationId", e.target.value)}
            className={cls(
              "rounded-xl bg-white/10 border px-3 py-2 outline-none focus:ring-2 focus:ring-white/25",
              errors.locationId ? "border-rose-400 bg-rose-400/10" : "border-white/15"
            )}
            placeholder="loc-center или адрес"
            aria-invalid={Boolean(errors.locationId)}
          />
          {errors.locationId && (
            <span className="text-rose-300 text-xs">{errors.locationId}</span>
          )}
        </label>
      </div>

      {/* Название */}
      <label className="grid gap-1 text-sm">
        <span className="text-white/70">Название / Имя</span>
        <input
          value={data.name}
          onChange={(e) => set("name", e.target.value)}
          className={cls(
            "rounded-xl bg-white/10 border px-3 py-2 outline-none focus:ring-2 focus:ring-white/25",
            errors.name ? "border-rose-400 bg-rose-400/10" : "border-white/15"
          )}
          placeholder={data.type === "staff" ? "Напр. Анна Л." : "Кабинет №1"}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <span className="text-rose-300 text-xs">{errors.name}</span>}
      </label>

      {/* Вместимость, Активность, Услуги */}
      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1 text-sm">
          <span className="text-white/70">Вместимость</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={Number.isFinite(data.capacity) ? data.capacity : 1}
            onChange={(e) => set("capacity", Math.max(1, normInt(e.target.value, 1)))}
            onBlur={(e) => set("capacity", Math.max(1, normInt(e.target.value, 1)))}
            className={cls(
              "rounded-xl bg-white/10 border px-3 py-2 outline-none focus:ring-2 focus:ring-white/25 tabular-nums",
              errors.capacity ? "border-rose-400 bg-rose-400/10" : "border-white/15"
            )}
            aria-invalid={Boolean(errors.capacity)}
          />
          {errors.capacity && (
            <span className="text-rose-300 text-xs">{errors.capacity}</span>
          )}
        </label>

        <label className="grid gap-1 text-sm">
          <span className="text-white/70">Статус</span>
          <select
            value={String(data.active)}
            onChange={(e) => set("active", e.target.value === "true")}
            className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 outline-none focus:ring-2 focus:ring-white/25"
          >
            <option value="true">Активен</option>
            <option value="false">Неактивен</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm">
          <span className="text-white/70">Услуги (id, через запятую)</span>
          <input
            value={servicesStr}
            onChange={(e) =>
              set(
                "services",
                uniq(
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              )
            }
            className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 outline-none focus:ring-2 focus:ring-white/25"
            placeholder="srv-… , srv-…"
          />
        </label>
      </div>

      {/* Превью услуг */}
      <div className="text-xs text-white/60">
        Привязано услуг:{" "}
        {data.services && data.services.length > 0 ? (
          <span className="inline-flex flex-wrap gap-1 align-middle">
            {data.services.map((sid) => (
              <span
                key={sid}
                className="inline-flex items-center rounded bg-white/10 px-2 py-0.5"
                title={sid}
              >
                {sid}
              </span>
            ))}
          </span>
        ) : (
          <span className="opacity-70">нет</span>
        )}
      </div>

      {/* Действия */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={submit}
          disabled={submitting}
          className="rounded-xl px-4 py-2 bg-white text-black text-sm hover:bg-white/90 disabled:opacity-60"
          title="Сохранить ресурс"
        >
          {submitting ? "Сохранение…" : "Сохранить"}
        </button>
        <button
          onClick={() => history.back()}
          className="rounded-xl px-4 py-2 border border-white/15 bg-white/10 text-sm hover:bg-white/15"
          title="Отмена"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}