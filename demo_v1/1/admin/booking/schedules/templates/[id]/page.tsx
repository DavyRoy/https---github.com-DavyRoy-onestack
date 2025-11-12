// app/demo/admin/booking/schedules/templates/[id]/page.tsx
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  loadTemplates,
  saveTemplates,
  ADMIN_RESOURCES,
  type AdminTemplate,
} from "@/app/demo/(shared)/booking";

const DAY_LABEL: Record<number, string> = {
  0: "Пн",
  1: "Вт",
  2: "Ср",
  3: "Чт",
  4: "Пт",
  5: "Сб",
  6: "Вс",
};

export default function AdminTemplateEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // грузим один раз (локально)
  const all = React.useMemo(loadTemplates, []);
  const current = all.find((t) => t.id === id);

  const [name, setName] = React.useState<string>(current?.name ?? "");
  const [dayOfWeek, setDayOfWeek] = React.useState<number>(current?.dayOfWeek ?? 0);
  const [from, setFrom] = React.useState<string>(current?.from ?? "10:00");
  const [to, setTo] = React.useState<string>(current?.to ?? "12:00");
  const [serviceId, setServiceId] = React.useState<string>(current?.serviceId ?? "");
  const [resourceId, setResourceId] = React.useState<string>(current?.resourceId ?? "");
  const [locationId, setLocationId] = React.useState<string>(current?.locationId ?? "loc-center");

  // опциональные поля — поддерживаем мягко
  const [active, setActive] = React.useState<string>(String(current?.active ?? true));
  const [parallel, setParallel] = React.useState<number>(
    // поддерживаем и parallelSlots и parallel, если они есть
    Number((current as any)?.parallelSlots ?? (current as any)?.parallel ?? 1)
  );

  const [err, setErr] = React.useState<string>("");

  if (!current) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
        <div className="text-sm opacity-80">Шаблон не найден</div>
        <div className="mt-3">
          <button
            onClick={() => router.push("/demo/admin/booking/schedules/templates")}
            className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06]"
          >
            К списку шаблонов
          </button>
        </div>
      </div>
    );
  }

  function validate(): boolean {
    if (!name.trim()) return setErr("Укажите название"), false;
    if (!/^\d{2}:\d{2}$/.test(from) || !/^\d{2}:\d{2}$/.test(to)) {
      return setErr("Некорректный формат времени (HH:MM)"), false;
    }
    if (from >= to) return setErr("Время: «с» должно быть раньше «до»"), false;
    setErr("");
    return true;
  }

  function onSave() {
    if (!validate()) return;

    // пересобираем запись
    const next: AdminTemplate = {
      id: current.id,
      name: name.trim(),
      dayOfWeek,
      from,
      to,
      serviceId: serviceId || undefined,
      resourceId: resourceId || undefined,
      locationId: locationId || undefined,
      // мягко кладём расширения, если они нужны дальше
      ...(active !== undefined ? { active: active === "true" } : {}),
      ...(parallel ? { parallelSlots: Number(parallel) } : {}),
    };

    // обновляем массив
    const idx = all.findIndex((t) => t.id === current.id);
    const updated = idx >= 0 ? [...all.slice(0, idx), next, ...all.slice(idx + 1)] : [...all, next];
    saveTemplates(updated);

    // UX: возвращаем в список, чтобы сразу видеть обновление в таблице
    router.push("/demo/admin/booking/schedules/templates");
  }

  function onDelete() {
    const updated = all.filter((t) => t.id !== current.id);
    saveTemplates(updated);
    router.push("/demo/admin/booking/schedules/templates");
  }

  return (
    <div className="grid gap-6">
      {/* Header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs text-white/60">Расписания • Шаблоны</div>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
            {name || current.name}{" "}
            <span className="text-white/50 text-base">({DAY_LABEL[dayOfWeek]})</span>
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Редактирование повторяющегося временного окна.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => router.push("/demo/admin/booking/schedules/templates")}
            className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06]"
          >
            К списку
          </button>
        </div>
      </header>

      {/* Form */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 grid gap-3">
        <label className="grid gap-1 text-sm">
          <span className="text-white/70">Название</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
          />
        </label>

        <div className="grid md:grid-cols-3 gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-white/70">День недели</span>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
            >
              <option value={0}>Пн</option>
              <option value={1}>Вт</option>
              <option value={2}>Ср</option>
              <option value={3}>Чт</option>
              <option value={4}>Пт</option>
              <option value={5}>Сб</option>
              <option value={6}>Вс</option>
            </select>
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-white/70">С</span>
            <input
              type="time"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-white/70">До</span>
            <input
              type="time"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
            />
          </label>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-white/70">Услуга (id)</span>
            <input
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
              placeholder="например srv-massage"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-white/70">Ресурс</span>
            <select
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
            >
              <option value="">—</option>
              {ADMIN_RESOURCES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-white/70">Локация</span>
            <input
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
              placeholder="loc-center"
            />
          </label>
        </div>

        {/* Доп.параметры (мягкие) */}
        <div className="grid md:grid-cols-3 gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-white/70">Активен</span>
            <select
              value={active}
              onChange={(e) => setActive(e.target.value)}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
            >
              <option value="true">Да</option>
              <option value="false">Нет</option>
            </select>
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-white/70">Параллельных слотов</span>
            <input
              type="number"
              min={1}
              value={parallel}
              onChange={(e) => setParallel(Math.max(1, Number(e.target.value) || 1))}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
            />
          </label>
        </div>

        {err && <div className="text-red-300 text-sm">{err}</div>}

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={onSave}
            className="rounded-xl px-3 py-2 border border-emerald-400/40 bg-emerald-500/20 hover:bg-emerald-500/30"
          >
            Сохранить
          </button>
          <button
            onClick={onDelete}
            className="rounded-xl px-3 py-2 border border-red-400/40 bg-red-500/10 hover:bg-red-500/20"
          >
            Удалить
          </button>
          <button
            onClick={() => history.back()}
            className="rounded-xl px-3 py-2 border border-white/15 hover:bg-white/[0.06]"
          >
            Отмена
          </button>
        </div>
      </section>
    </div>
  );
}