// app/demo/admin/booking/schedules/exceptions/[id]/page.tsx
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  loadExceptions,
  saveExceptions,
} from "@/app/demo/(shared)/booking";

/* ---------- helpers: совместимость схем ---------- */

// получить from/to (если нет — трактуем как целый день)
function exGetTime(e: any) {
  const from = e.start ?? e.from ?? "";
  const to = e.end ?? e.to ?? "";
  return { from, to };
}

// получить одиночный resourceId (поддержка resourceIds[])
function exGetResourceId(e: any): string {
  if (e.resourceId) return e.resourceId as string;
  if (Array.isArray(e.resourceIds) && e.resourceIds.length > 0) return e.resourceIds[0] as string;
  return "";
}

// смержить сохраняемую сущность, не теряя неизвестные поля
function mergeException(original: any, patch: Partial<any>) {
  return { ...original, ...patch };
}

export default function AdminExceptionEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const rows = loadExceptions() as any[];
  const current = rows.find((e) => e.id === id);

  // guard
  if (!current) {
    return (
      <div className="grid gap-4">
        <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
          <div className="text-sm opacity-80">Исключение не найдено</div>
          <div className="mt-3">
            <button
              onClick={() => router.push("/demo/admin/booking/schedules/exceptions")}
              className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06] text-sm"
            >
              К списку
            </button>
          </div>
        </div>
      </div>
    );
  }

  // локальные состояния
  const { from, to } = exGetTime(current);
  const singleResId = exGetResourceId(current);

  const [date, setDate] = React.useState<string>(current?.date ?? "");
  const [reason, setReason] = React.useState<string>(current?.reason ?? "");
  const [locationId, setLocationId] = React.useState<string>(current?.locationId ?? (current?.location ?? "loc-center"));
  const [resourceId, setResourceId] = React.useState<string>(singleResId);
  const [err, setErr] = React.useState<string>("");

  function validate(): boolean {
    if (!date) return setErr("Укажите дату"), false;
    if (!reason.trim()) return setErr("Укажите причину"), false;
    setErr("");
    return true;
  }

  function onSave() {
    if (!validate()) return;

    // Готовим патч. Сохраняем существующие поля, не теряя время/флаги/тип.
    const basePatch: any = {
      id: current.id,
      date,
      reason: reason.trim(),
      locationId: locationId || undefined,
      // Совместимость: и старое одиночное поле, и массив
      resourceId: resourceId || undefined,
      resourceIds: resourceId ? [resourceId] : undefined,
      // оставляем время, если оно было (редактирование времени не в этом экране)
      start: from || current.start,
      end: to || current.end,
      from: from || current.from,
      to: to || current.to,
      // консервативно сохраняем тип/активность если были
      type: current.type ?? "blackout",
      active: typeof current.active === "boolean" ? current.active : true,
    };

    const payload = mergeException(current, basePatch);

    const idx = rows.findIndex((e) => e.id === current.id);
    const updated = idx >= 0
      ? [...rows.slice(0, idx), payload, ...rows.slice(idx + 1)]
      : [...rows, payload];

    saveExceptions(updated as any);
    router.push("/demo/admin/booking/schedules/exceptions");
  }

  function onDelete() {
    const updated = rows.filter((e) => e.id !== current.id);
    saveExceptions(updated as any);
    router.push("/demo/admin/booking/schedules/exceptions");
  }

  return (
    <div className="grid gap-6">
      {/* header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs text-white/60">Расписания • Исключения</div>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
            {reason || "Исключение"}{" "}
            <span className="text-white/50 text-base">({date || current.date})</span>
          </h1>
        </div>
        <button
          onClick={() => router.push("/demo/admin/booking/schedules/exceptions")}
          className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06]"
        >
          К списку
        </button>
      </header>

      {/* form */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 grid gap-3">
        <div className="grid md:grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-white/70">Дата</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-white/70">Причина</span>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
            />
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-white/70">Локация</span>
            <input
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
              placeholder="loc-center"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-white/70">Ресурс (опционально)</span>
            <input
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
              placeholder="id ресурса"
            />
          </label>
        </div>

        {/* readonly подсказка по времени, если оно есть */}
        {(from || to) && (
          <div className="text-xs text-white/60">
            Время (read-only в этом экране): {(from || "00:00")}–{(to || "23:59")}
          </div>
        )}

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