// app/demo/admin/booking/schedules/exceptions/new/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  loadExceptions,
  saveExceptions,
  ADMIN_RESOURCES,
  type ExceptionItem as AdminException,
} from "@/app/demo/(shared)/booking";

type ExType = "holiday" | "blackout" | "maintenance" | "personal";

/* ---------- utils ---------- */

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;
const pad2 = (n: number) => String(n).padStart(2, "0");

function timeToMin(t: string): number | null {
  const m = t.match(TIME_RE);
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  return hh * 60 + mm;
}

function isTimeRangeValid(from: string, to: string): boolean {
  const a = timeToMin(from);
  const b = timeToMin(to);
  return a !== null && b !== null && a < b;
}

function cleanStr(s: string, max = 250) {
  return s.replace(/\s+/g, " ").trim().slice(0, max);
}

function exFrom(e: any) {
  return e.from ?? e.start ?? "";
}
function exTo(e: any) {
  return e.to ?? e.end ?? "";
}
function exResId(e: any) {
  if (e.resourceId) return String(e.resourceId);
  if (Array.isArray(e.resourceIds) && e.resourceIds.length > 0) return String(e.resourceIds[0]);
  return "";
}
function overlaps(a: AdminException, b: AdminException) {
  const aDate = (a as any).date ?? "";
  const bDate = (b as any).date ?? "";
  if (aDate !== bDate) return false;

  const aFrom = exFrom(a) || "00:00";
  const aTo   = exTo(a)   || "23:59";
  const bFrom = exFrom(b) || "00:00";
  const bTo   = exTo(b)   || "23:59";

  const sameRes =
    (a as any).resourceId && (b as any).resourceId
      ? (a as any).resourceId === (b as any).resourceId
      : true;

  const sameLoc =
    (a as any).locationId && (b as any).locationId
      ? (a as any).locationId === (b as any).locationId
      : true;

  return aFrom < bTo && bFrom < aTo && sameRes && sameLoc;
}

/* ---------- page ---------- */

export default function ExceptionNewPage() {
  const router = useRouter();

  const [type, setType] = React.useState<ExType>("blackout");
  const [date, setDate] = React.useState<string>("");
  const [fullDay, setFullDay] = React.useState<boolean>(false);
  const [from, setFrom] = React.useState<string>("10:00");
  const [to, setTo] = React.useState<string>("18:00");
  const [resourceId, setResourceId] = React.useState<string>("");
  const [locationId, setLocationId] = React.useState<string>("");
  const [reason, setReason] = React.useState<string>("");
  const [repeatYearly, setRepeatYearly] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const dateId = "ex-date";
  const fromId = "ex-from";
  const toId = "ex-to";
  const reasonId = "ex-reason";

  React.useEffect(() => {
    // автофокус на дату при открытии
    const t = setTimeout(() => document.getElementById(dateId)?.focus(), 10);
    return () => clearTimeout(t);
  }, []);

  function validateNow(): string | null {
    if (!date) return "Укажите дату.";
    if (!fullDay) {
      if (!TIME_RE.test(from) || !TIME_RE.test(to)) return "Некорректный формат времени.";
      if (!isTimeRangeValid(from, to)) return "Время окончания должно быть позже начала.";
    }
    if (!reason.trim()) return "Опишите причину исключения.";
    return null;
  }

  function focusFirstError(err: string | null) {
    if (!err) return;
    if (!date) {
      document.getElementById(dateId)?.focus();
      return;
    }
    if (!fullDay && !TIME_RE.test(from)) {
      document.getElementById(fromId)?.focus();
      return;
    }
    if (!fullDay && !TIME_RE.test(to)) {
      document.getElementById(toId)?.focus();
      return;
    }
    if (!reason.trim()) {
      document.getElementById(reasonId)?.focus();
    }
  }

  function onSave() {
    const err = validateNow();
    setError(err);
    if (err) {
      focusFirstError(err);
      return;
    }

    setSubmitting(true);

    const rows = loadExceptions();

    const id = `ex-${Date.now()}`;
    const rec: AdminException = {
      id,
      type,
      date,
      ...(fullDay ? {} : { start: from, end: to, from, to }),
      locationId: locationId || undefined,
      resourceId: resourceId || undefined,
      resourceIds: resourceId ? [resourceId] : undefined,
      reason: cleanStr(reason),
      active: true,
      ...(repeatYearly ? { repeatYearly: true } : {}),
    } as AdminException;

    // простая проверка пересечений
    const conflicts = rows.filter((x) => overlaps(rec, x as any)).length;
    if (conflicts > 0) {
      const ok = confirm(`Обнаружено пересечений: ${conflicts}. Всё равно сохранить?`);
      if (!ok) {
        setSubmitting(false);
        return;
      }
    }

    saveExceptions([rec, ...rows]);
    router.replace(`/demo/admin/booking/schedules/exceptions/${id}`);
  }

  // автоподстановка причины по типу, если пользователь оставил пустым
  function ensureReasonPreset() {
    if (reason.trim()) return;
    const preset =
      type === "holiday"
        ? "Праздничный день"
        : type === "maintenance"
        ? "Технические работы"
        : type === "personal"
        ? "Индивидуальный выходной"
        : "Блэкаут";
    setReason(preset);
  }

  const disabled = Boolean(validateNow()) || submitting;

  return (
    <div className="grid gap-6">
      {/* header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs text-white/60">Расписания • Исключения</div>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
            Новое исключение / блэкаут
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/demo/admin/booking/schedules/exceptions"
            className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06]"
          >
            К списку
          </Link>
          <Link
            href="/demo/admin/booking/schedules"
            className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06]"
          >
            К недельной сетке
          </Link>
        </div>
      </header>

      {/* form */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 grid gap-4">
        <div className="grid md:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm text-white/70">Тип *</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ExType)}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
            >
              <option value="holiday">Праздник</option>
              <option value="blackout">Блэкаут</option>
              <option value="maintenance">Тех. работы</option>
              <option value="personal">Инд. выходной</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-white/70">Дата *</span>
            <input
              id={dateId}
              type="date"
              aria-invalid={!date}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
            />
          </label>

          {/* Весь день */}
          <label className="inline-flex items-center gap-2 md:col-span-2">
            <input
              type="checkbox"
              checked={fullDay}
              onChange={(e) => setFullDay(e.target.checked)}
            />
            <span className="text-sm">Весь день</span>
          </label>

          {/* Время — только если НЕ полный день */}
          {!fullDay && (
            <div className="grid grid-cols-2 gap-3 md:col-span-2">
              <label className="grid gap-1">
                <span className="text-sm text-white/70">С *</span>
                <input
                  id={fromId}
                  type="time"
                  step={900}
                  aria-invalid={!!error && !TIME_RE.test(from)}
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-white/70">До *</span>
                <input
                  id={toId}
                  type="time"
                  step={900}
                  aria-invalid={!!error && !TIME_RE.test(to)}
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
                />
              </label>
            </div>
          )}

          <label className="grid gap-1">
            <span className="text-sm text-white/70">Ресурс (опц.)</span>
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

          <label className="grid gap-1">
            <span className="text-sm text-white/70">Локация (опц.)</span>
            <input
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
              placeholder="loc-center (демо)"
            />
          </label>

          <label className="grid gap-1 md:col-span-2">
            <span className="text-sm text-white/70">Причина *</span>
            <input
              id={reasonId}
              aria-invalid={!!error && !reason.trim()}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              onBlur={ensureReasonPreset}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
              placeholder="Напр. Общесистемные работы"
            />
          </label>

          <label className="inline-flex items-center gap-2 md:col-span-2 mt-1">
            <input
              type="checkbox"
              checked={repeatYearly}
              onChange={(e) => setRepeatYearly(e.target.checked)}
            />
            <span className="text-sm">Повторять ежегодно</span>
          </label>
        </div>

        {error && <div className="text-sm text-red-300">{error}</div>}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onSave}
            disabled={disabled}
            className="rounded-xl border border-emerald-400/40 bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Сохранение…" : "Сохранить"}
          </button>
          <Link
            href="/demo/admin/booking/schedules/exceptions"
            className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06]"
          >
            Отмена
          </Link>
        </div>
      </section>
    </div>
  );
}