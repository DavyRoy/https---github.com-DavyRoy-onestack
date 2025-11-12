// app/demo/admin/booking/schedules/templates/new/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  loadTemplates,
  saveTemplates,
  ADMIN_RESOURCES,
  type AdminTemplate,
} from "@/app/demo/(shared)/booking";

/* ---------- helpers ---------- */
const DAY: Record<number, string> = {
  0: "Пн",
  1: "Вт",
  2: "Ср",
  3: "Чт",
  4: "Пт",
  5: "Сб",
  6: "Вс",
};
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

/* ---------- page ---------- */
export default function TemplateNewPage() {
  const router = useRouter();
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  // state
  const [name, setName] = React.useState("");
  const [dayOfWeek, setDOW] = React.useState<number>(1);
  const [from, setFrom] = React.useState("10:00");
  const [to, setTo] = React.useState("20:00");
  const [serviceId, setServiceId] = React.useState("");
  const [resourceId, setResourceId] = React.useState("");
  const [locationId, setLocationId] = React.useState("loc-center");
  const [priority, setPriority] = React.useState(50);
  const [parallelSlots, setParallelSlots] = React.useState(1);
  const [active, setActive] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  function validate(): string | null {
    if (!name.trim()) return "Укажите название правила.";
    if (!TIME_RE.test(from) || !TIME_RE.test(to))
      return "Некорректный формат времени (HH:MM).";
    if (from >= to) return "Время окончания должно быть позже начала.";
    if (!resourceId) return "Выберите ресурс.";
    if (parallelSlots < 1)
      return "Количество параллельных слотов должно быть ≥ 1.";
    return null;
  }

  function onSave() {
    const err = validate();
    if (err) return setError(err);

    const rows = loadTemplates();
    const id = `tpl-${Date.now()}`;

    // кладём совместимые поля, чтобы дальше проще было читать
    const rec: AdminTemplate & Record<string, any> = {
      id,
      name: name.trim(),
      dayOfWeek,
      from,
      to,
      serviceId: serviceId || undefined,
      resourceId,
      locationId: locationId || undefined,
      priority,
      parallelSlots,
      // на всякий случай продублируем в альтернативное поле
      parallel: parallelSlots,
      active,
    };

    saveTemplates([rec, ...rows]);
    router.replace(`${base}/booking/schedules/templates/${id}`);
  }

  return (
    <div className="grid gap-6">
      {/* Header */}
      <header className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="text-xs text-white/60">Расписания • Шаблоны</div>
            <h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
              Новый шаблон слотов
            </h1>
            <p className="mt-1 text-sm text-white/70 sm:max-w-[70ch]">
              Повторяющееся окно доступности для ресурса/услуги. Сначала
              заполните основные поля — остальное можно поменять позже.
            </p>
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <Link
              href={`${base}/booking/schedules/templates`}
              className="flex-1 rounded-xl border border-white/15 px-3 py-2 text-center hover:bg-white/[0.06] sm:flex-none"
            >
              К списку
            </Link>
            <Link
              href={`${base}/booking/schedules`}
              className="flex-1 rounded-xl border border-white/15 px-3 py-2 text-center hover:bg-white/[0.06] sm:flex-none"
            >
              К сетке
            </Link>
          </div>
        </div>
      </header>

      {/* Form card — ограничиваем ширину на мобильных для читабельности */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
        <div className="mx-auto grid max-w-screen-sm gap-4 sm:max-w-screen-md">
          {/* Название */}
          <label className="grid gap-1">
            <span className="text-sm text-white/70">Название правила *</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-sm"
              placeholder="Напр. Будни 10–20"
              aria-label="Название правила"
            />
          </label>

          {/* День + Время */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="grid gap-1">
              <span className="text-sm text-white/70">День недели *</span>
              <select
                value={dayOfWeek}
                onChange={(e) => setDOW(Number(e.target.value))}
                className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-sm"
                aria-label="День недели"
              >
                {Object.entries(DAY).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-white/70">С *</span>
              <input
                type="time"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-sm"
                aria-label="Время начала"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-white/70">До *</span>
              <input
                type="time"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-sm"
                aria-label="Время окончания"
              />
            </label>
          </div>

          {/* Ресурс / Услуга / Локация */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="grid gap-1">
              <span className="text-sm text-white/70">Ресурс *</span>
              <select
                value={resourceId}
                onChange={(e) => setResourceId(e.target.value)}
                className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-sm"
                aria-label="Ресурс"
              >
                <option value="">Выберите ресурс</option>
                {ADMIN_RESOURCES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-white/70">ID услуги (опц.)</span>
              <input
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-sm"
                placeholder="srv-123 (демо)"
                aria-label="ID услуги"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-white/70">Локация (опц.)</span>
              <input
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-sm"
                placeholder="loc-center / loc-south"
                aria-label="ID локации"
              />
            </label>
          </div>

          {/* Приоритет / Параллельные слоты */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm text-white/70">Приоритет</span>
              <input
                type="number"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-sm"
                aria-label="Приоритет"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-white/70">Параллельных слотов</span>
              <input
                type="number"
                min={1}
                value={parallelSlots}
                onChange={(e) =>
                  setParallelSlots(Math.max(1, Number(e.target.value) || 1))
                }
                className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-sm"
                aria-label="Количество параллельных слотов"
              />
            </label>
          </div>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <span className="text-sm">Активен</span>
          </label>

          {error && (
            <div className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          {/* Bottom actions */}
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              onClick={onSave}
              className="w-full rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-4 py-2 text-sm hover:bg-emerald-500/30 sm:w-auto"
            >
              Сохранить
            </button>
            <Link
              href={`${base}/booking/schedules/templates`}
              className="w-full rounded-xl border border-white/15 px-4 py-2 text-center text-sm hover:bg-white/[0.06] sm:w-auto"
            >
              Отмена
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}