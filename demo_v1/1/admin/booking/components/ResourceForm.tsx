// app/demo/admin/booking/components/ResourceForm.tsx
"use client";

import * as React from "react";
import {
  type AdminResource,
  loadResources,
  saveResources,
} from "@/app/demo/(shared)/booking";

export type ResourceFormValue = Omit<AdminResource, "id"> & { id?: string };

export default function ResourceForm({
  initial,
  onSaved,
}: {
  initial?: ResourceFormValue;
  onSaved: (id: string) => void;
}) {
  // Нормализуем initial под актуальную схему
  const [data, setData] = React.useState<ResourceFormValue>(
    initial ?? {
      id: undefined,
      type: "staff",
      name: "",
      locationId: "loc-center",
      capacity: 1,
      services: [],
      active: true,
    }
  );

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function set<K extends keyof ResourceFormValue>(k: K, v: ResourceFormValue[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = "Укажите название/имя";
    if (!String(data.locationId ?? "").trim()) e.locationId = "Укажите локацию";
    if (!Number.isFinite(data.capacity) || Number(data.capacity) < 1)
      e.capacity = "Вместимость должна быть ≥ 1";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit() {
    if (!validate()) return;
    const rows = loadResources();
    const id = data.id || `res-${Date.now()}`;

    const payload: AdminResource = {
      id,
      type: data.type,
      name: data.name.trim(),
      locationId: String(data.locationId ?? "").trim() || undefined,
      capacity: Math.max(1, Number(data.capacity) || 1),
      active: Boolean(data.active),
      services: Array.isArray(data.services)
        ? data.services.filter(Boolean)
        : [],
    };

    const idx = rows.findIndex((r) => r.id === id);
    const next =
      idx >= 0
        ? [...rows.slice(0, idx), payload, ...rows.slice(idx + 1)]
        : [...rows, payload];

    saveResources(next);
    onSaved(id);
  }

  // Строка для редактирования списка услуг
  const servicesStr = (data.services ?? []).join(", ");

  return (
    <div className="grid gap-3">
      {/* Тип + Локация */}
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="text-white/70">Тип ресурса</span>
          <select
            value={data.type}
            onChange={(e) => set("type", e.target.value as AdminResource["type"])}
            className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 outline-none"
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
            className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 outline-none"
            placeholder="loc-center или адрес"
          />
          {errors.locationId && (
            <span className="text-red-300 text-xs">{errors.locationId}</span>
          )}
        </label>
      </div>

      {/* Название */}
      <label className="grid gap-1 text-sm">
        <span className="text-white/70">Название / Имя</span>
        <input
          value={data.name}
          onChange={(e) => set("name", e.target.value)}
          className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 outline-none"
          placeholder={data.type === "staff" ? "Напр. Анна Л." : "Кабинет №1"}
        />
        {errors.name && (
          <span className="text-red-300 text-xs">{errors.name}</span>
        )}
      </label>

      {/* Вместимость, Активность, Услуги */}
      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1 text-sm">
          <span className="text-white/70">Вместимость</span>
          <input
            type="number"
            min={1}
            value={data.capacity}
            onChange={(e) => set("capacity", Number(e.target.value))}
            className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 outline-none"
          />
          {errors.capacity && (
            <span className="text-red-300 text-xs">{errors.capacity}</span>
          )}
        </label>

        <label className="grid gap-1 text-sm">
          <span className="text-white/70">Статус</span>
          <select
            value={String(data.active)}
            onChange={(e) => set("active", e.target.value === "true")}
            className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 outline-none"
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
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
            className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 outline-none"
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
          className="rounded-xl px-4 py-2 bg-white text-black text-sm hover:bg-white/90"
        >
          Сохранить
        </button>
        <button
          onClick={() => history.back()}
          className="rounded-xl px-4 py-2 border border-white/15 bg-white/10 text-sm hover:bg-white/15"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}