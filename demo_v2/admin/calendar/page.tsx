// app/demo/admin/calendar/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ADMIN_RESERVATIONS,
  ADMIN_TEMPLATES as ADMIN_SLOT_TEMPLATES,
  ADMIN_EXCEPTIONS,
  ADMIN_RESOURCES,
  loadTemplates,
  loadExceptions,
  type Reservation,
  type SlotTemplate,
} from "@/app/demo/(shared)/booking";

/* ============ date utils ============ */
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const toISODate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const addMonths = (d: Date, n: number) => {
  const x = new Date(d);
  const day = x.getDate();
  x.setDate(1);
  x.setMonth(x.getMonth() + n);
  const last = new Date(x.getFullYear(), x.getMonth() + 1, 0).getDate();
  x.setDate(Math.min(day, last));
  return x;
};
const setHM = (d: Date, h: number, m = 0) => {
  const x = new Date(d);
  x.setHours(h, m, 0, 0);
  return x;
};
const getISOMonday = (d: Date) => {
  const day = d.getDay(); // 0..6 (0=Вс)
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(d, diff);
};
const fmtHumanWeek = (mon: Date) => {
  const end = addDays(mon, 6);
  const ru = (x: Date) =>
    `${x.getDate()} ${
      ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"][x.getMonth()]
    }`;
  return `${ru(mon)} — ${ru(end)}, ${end.getFullYear()}`;
};
const weekdaysShort = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

/* ============ time scale ============ */
const SLOT_FROM = 8;
const SLOT_TO = 22;
const STEP_MIN = 30;
const ROW_H = 40; // базовая высота строки
const HALF_HOUR_STEPS = Array.from(
  { length: ((SLOT_TO - SLOT_FROM) * 60) / STEP_MIN },
  (_, i) => SLOT_FROM * 60 + i * STEP_MIN
);

function blockStyleByMinutes(fromMin: number, toMin: number) {
  const daySpan = (SLOT_TO - SLOT_FROM) * 60;
  const clampedFrom = Math.max(0, Math.min(daySpan, fromMin));
  const clampedTo = Math.max(clampedFrom + 1, Math.min(daySpan, toMin));
  return {
    topPct: (clampedFrom / daySpan) * 100,
    heightPct: ((clampedTo - clampedFrom) / daySpan) * 100,
  };
}

function nowLineTopPct(day: Date): number | null {
  const now = new Date();
  if (now.toDateString() !== day.toDateString()) return null;
  const start = setHM(day, SLOT_FROM, 0);
  const end = setHM(day, SLOT_TO, 0);
  if (now < start || now > end) return null;
  const total = end.getTime() - start.getTime();
  const passed = now.getTime() - start.getTime();
  return (passed / total) * 100;
}

/* ============ normalize templates ============ */
function normalizeTemplates(raw: Array<any>): SlotTemplate[] {
  return raw.map((t) => {
    const days: number[] =
      Array.isArray(t.days) && t.days.length
        ? t.days
        : Number.isInteger(t.dayOfWeek)
        ? [((t.dayOfWeek + 1) % 7) + 1]
        : [];

    const start = t.start ?? t.from ?? "09:00";
    const end = t.end ?? t.to ?? "18:00";

    const serviceIds = Array.isArray(t.serviceIds) ? t.serviceIds : t.serviceId ? [t.serviceId] : [];
    const resourceIds = Array.isArray(t.resourceIds) ? t.resourceIds : t.resourceId ? [t.resourceId] : [];

    return {
      id: t.id,
      name: t.name ?? "Шаблон",
      days,
      start,
      end,
      serviceIds,
      resourceIds,
      locationId: t.locationId,
      dateFrom: t.dateFrom,
      dateTo: t.dateTo,
      active: t.active !== false,
    } as SlotTemplate;
  });
}

/* ============ layout utils (lanes) ============ */
type LaneItem<T> = { key: string; fromMin: number; toMin: number; data: T };
type Laid<T> = LaneItem<T> & { lane: number; lanesTotal: number };

function layoutLanes<T>(items: LaneItem<T>[]): Laid<T>[] {
  const xs = [...items].sort((a, b) => a.fromMin - b.fromMin || b.toMin - a.toMin);
  const lanesEnd: number[] = [];
  const placed: Laid<T>[] = [];
  for (const it of xs) {
    let lane = lanesEnd.findIndex((end) => end <= it.fromMin);
    if (lane === -1) {
      lane = lanesEnd.length;
      lanesEnd.push(it.toMin);
    } else {
      lanesEnd[lane] = Math.max(lanesEnd[lane], it.toMin);
    }
    placed.push({ ...it, lane, lanesTotal: 0 });
  }
  const total = Math.max(1, lanesEnd.length);
  placed.forEach((p) => (p.lanesTotal = total));
  return placed;
}

function laneStyle(lane: number, lanesTotal: number): React.CSSProperties {
  const gap = 6; // px
  const cellPct = 100 / lanesTotal;
  const leftCalc = `calc(${lane * cellPct}% + ${lane * (gap / lanesTotal)}px)`;
  const widthCalc = `calc(${cellPct}% - ${(gap * (lanesTotal - 1)) / lanesTotal}px)`;
  return { left: leftCalc, width: widthCalc };
}

/* ============ coverage merge ============ */
type Range = { fromMin: number; toMin: number };
function mergeRanges(ranges: Range[]): Range[] {
  if (ranges.length === 0) return [];
  const sorted = [...ranges].sort((a, b) => a.fromMin - b.fromMin);
  const out: Range[] = [];
  let cur = { ...sorted[0] };
  for (let i = 1; i < sorted.length; i++) {
    const r = sorted[i];
    if (r.fromMin <= cur.toMin) cur.toMin = Math.max(cur.toMin, r.toMin);
    else {
      out.push(cur);
      cur = { ...r };
    }
  }
  out.push(cur);
  return out;
}

/* ============ page ============ */
export default function AdminCalendarPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const defaultView = isMobile ? "day" : "week";
  const viewParam = mounted ? sp.get("view") : null;
  const view =
    viewParam && (viewParam === "day" || viewParam === "week" || viewParam === "month")
      ? viewParam
      : defaultView;

  const dateParam = mounted ? sp.get("date") : null;
  const focusDate = useMemo(() => {
    if (!mounted || !dateParam) return new Date();
    const d = new Date(dateParam);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [mounted, dateParam]);

  const monday = useMemo(() => getISOMonday(focusDate), [focusDate]);

  // filters
  const serviceId = mounted ? sp.get("service") || "" : "";
  const resourceId = mounted ? sp.get("resource") || "" : "";
  const status = mounted ? sp.get("status") || "" : "";
  const locationId = mounted ? sp.get("location") || "" : "";

  // data
  const templates = useMemo(
    () => normalizeTemplates(mounted ? loadTemplates() : ADMIN_SLOT_TEMPLATES),
    [mounted]
  );
  const exceptions = useMemo(() => (mounted ? loadExceptions() : ADMIN_EXCEPTIONS), [mounted]);
  const reservations: Reservation[] = ADMIN_RESERVATIONS;

  // days
  const days = useMemo(
    () => Array.from({ length: view === "day" ? 1 : 7 }, (_, i) => addDays(view === "day" ? focusDate : monday, i)),
    [view, focusDate, monday]
  );

  // reservations filtered
  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      const d = new Date(r.start);
      if (view === "week") {
        const inWeek = toISODate(d) >= toISODate(monday) && toISODate(d) <= toISODate(addDays(monday, 6));
        if (!inWeek) return false;
      }
      if (view === "day" && toISODate(d) !== toISODate(focusDate)) return false;
      if (
        view === "month" &&
        (d.getMonth() !== focusDate.getMonth() || d.getFullYear() !== focusDate.getFullYear())
      )
        return false;
      if (serviceId && r.serviceId !== serviceId) return false;
      if (resourceId && r.resourceId !== resourceId) return false;
      if (status && r.status !== status) return false;
      if (locationId) {
        const res = ADMIN_RESOURCES.find((x) => x.id === r.resourceId);
        if (!res || res.locationId !== locationId) return false;
      }
      return true;
    });
  }, [reservations, monday, focusDate, view, serviceId, resourceId, status, locationId]);

  // coverage merged by day
  const coverageMergedByDay = useMemo(() => {
    return days.map((day) => {
      const isoDow = ((day.getDay() + 6) % 7) + 1; // 1..7
      const dayISO = toISODate(day);

      const ranges: Range[] = templates
        .filter((tpl) => {
          if (tpl.active === false) return false;
          if (!tpl.days?.includes(isoDow)) return false;
          if (serviceId && tpl.serviceIds?.length && !tpl.serviceIds.includes(serviceId)) return false;
          if (resourceId && tpl.resourceIds?.length && !tpl.resourceIds.includes(resourceId)) return false;
          if (locationId && tpl.locationId && tpl.locationId !== locationId) return false;
          if (tpl.dateFrom && dayISO < tpl.dateFrom) return false;
          if (tpl.dateTo && dayISO > tpl.dateTo) return false;
          return true;
        })
        .map((tpl) => {
          const sH = parseInt(tpl.start.slice(0, 2));
          const sM = parseInt(tpl.start.slice(3));
          const eH = parseInt(tpl.end.slice(0, 2));
          const eM = parseInt(tpl.end.slice(3));
          const fromMin = Math.max(0, (sH - SLOT_FROM) * 60 + sM);
          const toMin = Math.min((SLOT_TO - SLOT_FROM) * 60, (eH - SLOT_FROM) * 60 + eM);
          return { fromMin, toMin };
        })
        .filter((r) => r.toMin > r.fromMin);

      return mergeRanges(ranges);
    });
  }, [days, templates, serviceId, resourceId, locationId]);

  // exceptions lanes by day
  const exceptionsLanesByDay = useMemo(() => {
    return days.map((day) => {
      const dayISO = toISODate(day);
      const list: LaneItem<any>[] = exceptions
        .filter((ex) => {
          if (ex.active === false) return false;
          if (dayISO !== ex.date) return false;
          if (locationId && ex.locationId && ex.locationId !== locationId) return false;
          if (
            resourceId &&
            Array.isArray(ex.resourceIds) &&
            ex.resourceIds.length &&
            !ex.resourceIds.includes(resourceId)
          )
            return false;
          return true;
        })
        .map((ex) => {
          const fromS = ex.start ?? "00:00";
          const toS = ex.end ?? "23:59";
          const sH = parseInt(fromS.slice(0, 2));
          const sM = parseInt(fromS.slice(3));
          const eH = parseInt(toS.slice(0, 2));
          const eM = parseInt(toS.slice(3));
          const fromMin = Math.max(0, (sH - SLOT_FROM) * 60 + sM);
          const toMin = Math.min((SLOT_TO - SLOT_FROM) * 60, (eH - SLOT_FROM) * 60 + eM);
          return { key: `ex-${ex.id}`, fromMin, toMin: Math.max(fromMin + 1, toMin), data: ex };
        });
      return layoutLanes(list);
    });
  }, [days, exceptions, resourceId, locationId]);

  // reservations lanes by day
  const reservationsLanesByDay = useMemo(() => {
    return days.map((day) => {
      const dayISO = toISODate(day);
      const list: LaneItem<Reservation>[] = filteredReservations
        .filter((r) => toISODate(new Date(r.start)) === dayISO)
        .map((r) => {
          const start = new Date(r.start);
          const end = new Date(r.end);
          const fromMin = (start.getHours() - SLOT_FROM) * 60 + start.getMinutes();
          const toMin = (end.getHours() - SLOT_FROM) * 60 + end.getMinutes();
          return {
            key: r.id,
            fromMin: Math.max(0, fromMin),
            toMin: Math.max(fromMin + 1, Math.min((SLOT_TO - SLOT_FROM) * 60, toMin)),
            data: r,
          };
        });
      return layoutLanes(list);
    });
  }, [days, filteredReservations]);

  // options
  const servicesOptions = useMemo(() => {
    const fromRes = Array.from(new Set(reservations.map((r) => r.serviceId)));
    const fromTpl = Array.from(new Set(templates.flatMap((t) => t.serviceIds || [])));
    return Array.from(new Set([...fromRes, ...fromTpl])).filter(Boolean) as string[];
  }, [reservations, templates]);

  const resourcesOptions = useMemo(
    () =>
      ADMIN_RESOURCES.filter((r) => (locationId ? r.locationId === locationId : true)).map((r) => ({
        id: r.id,
        name: r.name,
      })),
    [locationId]
  );

  const calendarUrl = (d: Date, nextView: string = view) =>
    `/demo/admin/calendar?view=${nextView}&date=${toISODate(d)}${serviceId ? `&service=${serviceId}` : ""}${
      resourceId ? `&resource=${resourceId}` : ""
    }${status ? `&status=${status}` : ""}${locationId ? `&location=${locationId}` : ""}`;

  /* ---------- initial shell ---------- */
  if (!mounted) {
    return (
      <div className="grid gap-6">
        <header className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Календарь (админ)</h1>
            <p className="text-white/60 text-sm mt-1">Загрузка…</p>
          </div>
          <div className="h-9 w-48 rounded-lg bg-white/10 animate-pulse" />
        </header>
        <section className="h-[60vh] rounded-2xl border border-white/15 bg-white/[0.05]" />
      </div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <div className="grid gap-5 md:gap-6">
      {/* Toolbar */}
      <header className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.15] via-white/[0.07] to-white/[0.02] p-3 md:p-4 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.85)]">
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_55%)]"
          aria-hidden
        />
        <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="text-sm text-white/60">Календарь</div>
            <h1 className="mt-1 text-xl md:text-2xl font-semibold tracking-tight">Расписания и записи</h1>
            <div className="mt-1 text-xs text-white/70">
              {view === "week" && fmtHumanWeek(monday)}
              {view === "day" && toISODate(focusDate)}
              {view === "month" &&
                focusDate.toLocaleString("ru-RU", {
                  month: "long",
                  year: "numeric",
                })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* переключатели вида */}
            <div className="hidden sm:block">
              <SegControl
                value={view}
                options={[
                  { id: "day", label: "День" },
                  { id: "week", label: "Неделя" },
                  { id: "month", label: "Месяц" },
                ]}
                onChange={(v) => router.push(calendarUrl(focusDate, v))}
              />
            </div>
            <div className="sm:hidden w-full">
              <SegControl
                value={view}
                options={[
                  { id: "day", label: "День" },
                  { id: "week", label: "Неделя" },
                  { id: "month", label: "Месяц" },
                ]}
                onChange={(v) => router.push(calendarUrl(focusDate, v))}
              />
            </div>

            <div className="inline-flex rounded-xl border border-white/10 overflow-hidden">
              <Link
                href={
                  view === "month"
                    ? calendarUrl(addMonths(focusDate, -1))
                    : calendarUrl(addDays(focusDate, -7))
                }
                className="px-3 py-2 text-sm transition hover:bg-white/10 hover:text-white"
                prefetch={false}
              >
                ←
              </Link>
              <Link
                href={calendarUrl(new Date())}
                className="px-3 py-2 text-sm transition hover:bg-white/10 hover:text-white"
                prefetch={false}
              >
                Сегодня
              </Link>
              <Link
                href={
                  view === "month"
                    ? calendarUrl(addMonths(focusDate, 1))
                    : calendarUrl(addDays(focusDate, 7))
                }
                className="px-3 py-2 text-sm transition hover:bg-white/10 hover:text-white"
                prefetch={false}
              >
                →
              </Link>
            </div>
            <Link
              href={`/demo/manager/booking/new?date=${toISODate(focusDate)}`}
              className="rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-3 py-2 text-sm text-emerald-100 transition hover:border-emerald-300/40 hover:bg-emerald-500/25"
              prefetch={false}
            >
              + Запись
            </Link>
            <Link
              href="/demo/app/export?kind=ics"
              className="rounded-xl border border-white/10 px-3 py-2 text-sm transition hover:border-white/20 hover:bg-white/10"
              prefetch={false}
            >
              Экспорт
            </Link>
          </div>
        </div>

        {/* Filters row */}
        <div className="relative z-10 mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <FieldSelect
            label="Услуга"
            value={serviceId}
            onChangeParam="service"
            options={[{ id: "", name: "Все" }, ...servicesOptions.map((s) => ({ id: s, name: s }))]}
          />
          <FieldSelect
            label="Ресурс"
            value={resourceId}
            onChangeParam="resource"
            options={[{ id: "", name: "Все" }, ...resourcesOptions]}
          />
          <FieldSelect
            label="Статус"
            value={status}
            onChangeParam="status"
            options={[
              { id: "", name: "Все" },
              ...["new", "pending", "confirmed", "completed", "cancelled", "noshow", "rescheduled"].map((s) => ({
                id: s,
                name: s,
              })),
            ]}
          />
          <FieldSelect
            label="Локация"
            value={locationId}
            onChangeParam="location"
            options={[
              { id: "", name: "Все" },
              ...Array.from(
                new Set(ADMIN_RESOURCES.map((r) => r.locationId).filter(Boolean) as string[])
              ).map((id) => ({ id, name: id })),
            ]}
          />
          <div className="flex items-center gap-2">
            <span className="w-20 text-xs text-white/60">Дата</span>
            <input
              type="date"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-sm outline-none transition focus:border-white/30 focus:ring-2 focus:ring-sky-300/30"
              value={toISODate(focusDate)}
              onChange={(e) => router.push(`/demo/admin/calendar?view=${view}&date=${e.target.value}`)}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      {/* Мобильная «повестка дня», десктоп — сетка/месяц */}
      {view === "month" ? (
        <MonthView
          focusDate={focusDate}
          reservations={filteredReservations}
          calendarUrl={calendarUrl}
        />
      ) : view === "day" && isMobile ? (
        <MobileAgenda
          day={focusDate}
          coverageRanges={coverageMergedByDay[0] ?? []}
          reservations={filteredReservations.filter((r) => toISODate(new Date(r.start)) === toISODate(focusDate))}
          exceptions={exceptions.filter((ex) => ex.active !== false && ex.date === toISODate(focusDate))}
          calendarUrl={calendarUrl}
        />
      ) : (
        <WeekDayGrid
          days={days}
          coverageMergedByDay={coverageMergedByDay}
          exceptionsLanesByDay={exceptionsLanesByDay}
          reservationsLanesByDay={reservationsLanesByDay}
          focusDate={focusDate}
          calendarUrl={calendarUrl}
        />
      )}

      {/* Legend */}
      <footer className="rounded-xl border border-white/12 bg-white/[0.03] p-3 md:p-4 text-xs shadow-[0_24px_50px_-32px_rgba(15,23,42,0.75)]">
        <div className="flex flex-wrap items-center gap-3">
          <LegendDot className="bg-emerald-400/40 border-emerald-300/70" label="Покрытие (шаблон)" />
          <LegendDot className="bg-rose-400/40 border-rose-300/70" label="Исключение" />
          <LegendDot className="bg-sky-400/80 border-sky-200/80" label="Бронь" />
          <span className="ml-auto opacity-70">Клик — открыть карточку</span>
        </div>
      </footer>
    </div>
  );
}

/* ============ UI atoms ============ */
function SegControl({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { id: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-white/12 bg-white/[0.04] p-1 shadow-[0_12px_28px_-20px_rgba(15,23,42,0.65)]">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          type="button"
          className={`px-3 py-1.5 text-sm rounded-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200/80 ${
            value === o.id
              ? "bg-white/20 text-white shadow-inner shadow-white/10"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function FieldSelect({
  label,
  value,
  onChangeParam,
  options,
}: {
  label: string;
  value: string;
  onChangeParam: string;
  options: { id: string; name: string }[];
}) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 text-xs text-white/60">{label}</span>
      <select
        className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-sm outline-none transition focus:border-white/30 focus:ring-2 focus:ring-sky-300/30"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          const url = new URL(window.location.href);
          if (v) url.searchParams.set(onChangeParam, v);
          else url.searchParams.delete(onChangeParam);
          router.push(url.toString());
        }}
      >
        {options.map((o) => (
          <option key={`${onChangeParam}-${o.id}`} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-2 py-1 text-white/70">
      <i className={`inline-block h-3 w-3 rounded border ${className}`} />
      {label}
    </span>
  );
}

/* ============ DESKTOP Week/Day grid ============ */
function WeekDayGrid({
  days,
  coverageMergedByDay,
  exceptionsLanesByDay,
  reservationsLanesByDay,
  focusDate,
  calendarUrl,
}: {
  days: Date[];
  coverageMergedByDay: Range[][];
  exceptionsLanesByDay: Laid<any>[][];
  reservationsLanesByDay: Laid<Reservation>[][];
  focusDate: Date;
  calendarUrl: (d: Date, nextView?: string) => string;
}) {
  const focusIso = toISODate(focusDate);
  return (
    <section className="rounded-2xl border border-white/12 bg-gradient-to-b from-white/[0.05] to-white/[0.015] overflow-hidden shadow-[0_26px_60px_-36px_rgba(15,23,42,0.85)] backdrop-blur">
      <div className="overflow-x-auto">
        <div className="min-w-[860px]">
          {/* headings */}
          <div
            className="grid sticky top-0 z-30 bg-[#0b0e14]/80 backdrop-blur border-b border-white/10 shadow-[0_8px_22px_rgba(8,12,20,0.55)]"
            style={{ gridTemplateColumns: `84px repeat(${days.length}, 1fr)` }}
          >
            <div className="h-12 sm:h-14" />
            {days.map((d, i) => {
              const dayIso = toISODate(d);
              const today = new Date().toDateString() === d.toDateString();
              const isFocused = dayIso === focusIso;
              return (
                <Link
                  key={`h-${i}`}
                  href={calendarUrl(d, "day")}
                  className={`relative h-12 sm:h-14 px-2 sm:px-3 flex items-center border-l border-white/10 transition-colors group/day ${
                    today ? "bg-white/[0.05]" : ""
                  } ${isFocused ? "ring-1 ring-sky-400/60 bg-white/[0.08]" : "hover:bg-white/[0.06]"}`}
                  prefetch={false}
                  aria-label={`Открыть ${toISODate(d)} в режиме дня`}
                >
                  <div className="min-w-0">
                    <div className="text-[10px] sm:text-[11px] opacity-70">{weekdaysShort[(d.getDay() + 6) % 7]}</div>
                    <div className="text-sm sm:text-base font-medium">
                      {d.getDate()}.{pad(d.getMonth() + 1)}
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    {today ? (
                      <span className="text-[10px] rounded bg-white/10 px-1.5 py-0.5">Сегодня</span>
                    ) : (
                      <>
                        <span className="hidden text-[10px] rounded bg-white/10 px-1.5 py-0.5 uppercase tracking-wide text-white/80 group-hover/day:flex">
                          День
                        </span>
                        {isFocused && (
                          <span className="text-[10px] rounded bg-sky-400/20 px-1.5 py-0.5 text-sky-200">
                            Выбрано
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* grid */}
          <div className="relative grid" style={{ gridTemplateColumns: `84px repeat(${days.length}, 1fr)` }}>
            {/* left scale */}
            <div className="relative">
              {HALF_HOUR_STEPS.map((m, i) => {
                const h = Math.floor(m / 60);
                const mm = m % 60;
                const isHour = mm === 0;
                return (
                  <div key={`sc-${i}`} className="relative border-t border-white/[0.08]" style={{ height: ROW_H }}>
                    {isHour && (
                      <div className="absolute -translate-y-1/2 top-0 right-2 sm:right-3 text-[10px] sm:text-xs opacity-60">
                        {pad(h)}:00
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* day columns */}
            {days.map((day, colIdx) => {
              const topNow = nowLineTopPct(day);
              const covers = coverageMergedByDay[colIdx];
              const exLanes = exceptionsLanesByDay[colIdx];
              const resLanes = reservationsLanesByDay[colIdx];
              const iso = toISODate(day);
              const isFocused = iso === focusIso;
              const today = new Date().toDateString() === day.toDateString();

              return (
                <div
                  key={`col-${colIdx}`}
                  className={`relative border-l border-white/10 transition-colors group/day ${
                    isFocused ? "bg-white/[0.02]" : "hover:bg-white/[0.01]"
                  }`}
                  style={{ minHeight: HALF_HOUR_STEPS.length * ROW_H }}
                >
                  {/* background rows */}
                  {HALF_HOUR_STEPS.map((_, i) => (
                    <div key={`row-${colIdx}-${i}`} className="border-t border-white/[0.07]" style={{ height: ROW_H }} />
                  ))}

                  <div
                    className={`pointer-events-none absolute inset-[4px] rounded-2xl transition duration-300 z-[4] ${
                      isFocused
                        ? "opacity-100 ring-1 ring-sky-400/50 shadow-[0_18px_38px_-20px_rgba(56,189,248,0.7)] bg-sky-400/[0.08]"
                        : today
                        ? "opacity-70 bg-white/[0.05]"
                        : "opacity-0 group-hover/day:opacity-100 group-hover/day:bg-white/[0.05]"
                    }`}
                  />

                  {/* now line */}
                  {topNow !== null && (
                    <div className="absolute left-0 right-0 z-30" style={{ top: `${topNow}%` }}>
                      <div className="h-0.5 bg-rose-300/80 shadow-[0_0_12px_rgba(244,114,182,0.5)]" />
                    </div>
                  )}

                  {/* coverage merged */}
                  <div className="absolute inset-0 z-[5]">
                    {covers.map((r, idx) => {
                      const st = blockStyleByMinutes(r.fromMin, r.toMin);
                      return (
                        <div
                          key={`cov-${colIdx}-${idx}`}
                          className="absolute left-1 right-1 rounded-xl border transition duration-300 shadow-[0_18px_32px_-26px_rgba(16,185,129,0.9)]"
                          style={{
                            top: `${st.topPct}%`,
                            height: `${st.heightPct}%`,
                            background: "linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.10) 100%)",
                            borderColor: "rgba(16,185,129,0.35)",
                          }}
                          aria-hidden
                        />
                      );
                    })}
                  </div>

                  {/* exceptions lanes */}
                  <div className="absolute inset-0 z-20">
                    {exLanes.map((li) => {
                      const st = blockStyleByMinutes(li.fromMin, li.toMin);
                      return (
                        <Link
                          key={li.key}
                          href={`/demo/admin/booking/schedules/exceptions?week=${toISODate(getISOMonday(day))}#${li.key}`}
                          className="absolute rounded-md border px-1.5 py-0.5 text-[10px] sm:text-[11px] truncate hover:brightness-110 transition duration-200 backdrop-blur-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-rose-200/70"
                          style={{
                            top: `${st.topPct}%`,
                            height: `min(22px, ${st.heightPct}%)`,
                            ...laneStyle(li.lane, li.lanesTotal),
                            background: "linear-gradient(135deg, rgba(244,63,94,0.35) 0%, rgba(244,63,94,0.22) 100%)",
                            borderColor: "rgba(248,113,113,0.55)",
                          }}
                          title={`Исключение: ${li.data.reason || li.data.type}`}
                        >
                          {li.data.reason || li.data.type}
                        </Link>
                      );
                    })}
                  </div>

                  {/* reservations lanes */}
                  <div className="absolute inset-0 z-30">
                    {resLanes.map((li) => {
                      const st = blockStyleByMinutes(li.fromMin, li.toMin);
                      const r = li.data;
                      const start = new Date(r.start);
                      const end = new Date(r.end);
                      const tFrom = start.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
                      const tTo = end.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
                      const resName = ADMIN_RESOURCES.find((x) => x.id === r.resourceId)?.name ?? r.resourceId;

                      return (
                        <Link
                          key={li.key}
                          href={`${r.href}?adminView=1`}
                          className="absolute rounded-xl border px-2 py-1.5 text-[11px] shadow-sm hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.01] transition duration-200 ease-out will-change-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200/80"
                          style={{
                            top: `${st.topPct}%`,
                            height: `${st.heightPct}%`,
                            ...laneStyle(li.lane, li.lanesTotal),
                            background: "linear-gradient(135deg, rgba(56,189,248,0.88) 0%, rgba(125,211,252,0.88) 100%)",
                            borderColor: "rgba(186,230,253,0.9)",
                            color: "#0b0e14",
                          }}
                          title={`${r.client} • ${r.serviceId} • ${tFrom}–${tTo}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <BookingIcon seed={resName} />
                            <div className="min-w-0">
                              <div className="truncate font-semibold">{r.client}</div>
                              <div className="truncate opacity-85">
                                {r.serviceId} • {tFrom}–{tTo}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ MOBILE Agenda (очень читабельная) ============ */
function MobileAgenda({
  day,
  coverageRanges,
  reservations,
  exceptions,
  calendarUrl,
}: {
  day: Date;
  coverageRanges: Range[];
  reservations: Reservation[];
  exceptions: any[];
  calendarUrl: (d: Date, nextView?: string) => string;
}) {
  // собираем ленту событий без наложений — просто сортируем по старту
  type Item =
    | { kind: "res"; id: string; start: Date; end: Date; r: Reservation }
    | { kind: "ex"; id: string; start: Date; end: Date; ex: any };

  const items: Item[] = useMemo(() => {
    const resItems: Item[] = reservations.map((r) => ({
      kind: "res",
      id: r.id,
      start: new Date(r.start),
      end: new Date(r.end),
      r,
    }));
    const exItems: Item[] = exceptions.map((ex) => {
      const fromS = ex.start ?? "00:00";
      const toS = ex.end ?? "23:59";
      const s = setHM(day, parseInt(fromS.slice(0, 2)), parseInt(fromS.slice(3)));
      const e = setHM(day, parseInt(toS.slice(0, 2)), parseInt(toS.slice(3)));
      return { kind: "ex", id: ex.id, start: s, end: e, ex };
    });
    return [...resItems, ...exItems].sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [reservations, exceptions, day]);

  const today = new Date().toDateString() === day.toDateString();
  const topNow = nowLineTopPct(day);

  return (
    <section className="rounded-2xl border border-white/12 bg-white/[0.04] overflow-hidden shadow-[0_26px_60px_-36px_rgba(15,23,42,0.85)]">
      {/* sticky header for the day */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0b0e14]/80 backdrop-blur px-3 py-2">
        <div>
          <div className="text-xs opacity-70">
            {weekdaysShort[(day.getDay() + 6) % 7]}, {day.getDate()}.{pad(day.getMonth() + 1)}
          </div>
          <div className="text-sm">{toISODate(day)}</div>
        </div>
        <div className="flex items-center gap-2">
          {today && <span className="rounded bg-white/10 px-2 py-0.5 text-[11px]">Сегодня</span>}
          <Link
            href={calendarUrl(day, "week")}
            prefetch={false}
            className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] uppercase tracking-wide text-white/80 transition hover:border-white/20 hover:bg-white/10"
            aria-label="Открыть неделю"
          >
            Неделя
          </Link>
          <Link
            href={calendarUrl(day, "month")}
            prefetch={false}
            className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] uppercase tracking-wide text-white/80 transition hover:border-white/20 hover:bg-white/10"
            aria-label="Открыть месяц"
          >
            Месяц
          </Link>
        </div>
      </div>

      {/* coverage bar background */}
      <div className="relative">
        <div className="relative">
          {/* фоновые часовые линии для ориентира */}
          {Array.from({ length: SLOT_TO - SLOT_FROM + 1 }).map((_, i) => (
            <div key={`hr-${i}`} className="h-14 border-t border-white/[0.07]">
              <div className="px-3 text-[10px] opacity-60">{pad(SLOT_FROM + i)}:00</div>
            </div>
          ))}

        {/* объединённые шаблоны — мягкий фон по всей ширине */}
          <div className="absolute inset-0 pointer-events-none">
            {coverageRanges.map((r, idx) => {
              const st = blockStyleByMinutes(r.fromMin, r.toMin);
              return (
                <div
                  key={`cov-m-${idx}`}
                  className="absolute left-2 right-2 rounded-xl border transition duration-300 shadow-[0_18px_32px_-28px_rgba(16,185,129,0.9)]"
                  style={{
                    top: `${st.topPct}%`,
                    height: `${st.heightPct}%`,
                    background: "linear-gradient(135deg, rgba(16,185,129,0.16) 0%, rgba(16,185,129,0.10) 100%)",
                    borderColor: "rgba(16,185,129,0.30)",
                  }}
                />
              );
            })}
          </div>

          {/* now line */}
          {topNow !== null && (
            <div className="absolute left-0 right-0" style={{ top: `${topNow}%` }}>
              <div className="h-0.5 bg-rose-300/80 shadow-[0_0_12px_rgba(244,114,182,0.5)]" />
            </div>
          )}

          {/* список карточек */}
          <div className="absolute inset-0 px-2 py-2 space-y-2">
            {items.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-sm opacity-80">
                Событий нет
              </div>
            )}

            {items.map((it) => {
              const from = it.start.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
              const to = it.end.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
              const startMin = (it.start.getHours() - SLOT_FROM) * 60 + it.start.getMinutes();
              const endMin = (it.end.getHours() - SLOT_FROM) * 60 + it.end.getMinutes();
              const st = blockStyleByMinutes(startMin, endMin);

              if (it.kind === "res") {
                const r = it.r;
                const resName = ADMIN_RESOURCES.find((x) => x.id === r.resourceId)?.name ?? r.resourceId;
                return (
                  <Link
                    key={`r-${it.id}`}
                    href={`${r.href}?adminView=1`}
                    className="absolute left-2 right-2 rounded-xl border px-3 py-2 text-sm shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200/80"
                    style={{
                      top: `calc(${st.topPct}% + 2px)`,
                      height: `max(44px, ${st.heightPct}%)`,
                      background: "linear-gradient(135deg, rgba(56,189,248,0.92) 0%, rgba(125,211,252,0.92) 100%)",
                      borderColor: "rgba(186,230,253,0.9)",
                      color: "#0b0e14",
                    }}
                    title={`${r.client} • ${r.serviceId} • ${from}–${to}`}
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <BookingIcon seed={resName} />
                      <div className="min-w-0">
                        <div className="text-xs opacity-80">{from}–{to}</div>
                        <div className="truncate font-semibold">{r.client}</div>
                        <div className="truncate text-[12px] opacity-85">{r.serviceId}</div>
                      </div>
                    </div>
                  </Link>
                );
              }

              // exception
              return (
                <Link
                  key={`e-${it.id}`}
                  href={`/demo/admin/booking/schedules/exceptions/${it.id}`}
                  className="absolute left-3 right-3 rounded-lg border px-2 py-1.5 text-[12px] truncate transition duration-200 backdrop-blur-[2px] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-rose-200/70"
                  style={{
                    top: `calc(${st.topPct}% + 2px)`,
                    height: `max(32px, ${st.heightPct}%)`,
                    background: "linear-gradient(135deg, rgba(244,63,94,0.35) 0%, rgba(244,63,94,0.22) 100%)",
                    borderColor: "rgba(248,113,113,0.55)",
                    color: "rgba(255,255,255,0.95)",
                  }}
                  title={`Исключение: ${it.ex.reason || it.ex.type} • ${from}–${to}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded bg-white/10 px-2 py-0.5 text-[11px]">
                      {from}–{to}
                    </span>
                    <span className="truncate">{it.ex.reason || it.ex.type}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Month view ============ */
function MonthView({
  focusDate,
  reservations,
  calendarUrl,
}: {
  focusDate: Date;
  reservations: Reservation[];
  calendarUrl: (d: Date, nextView?: string) => string;
}) {
  const first = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
  const gridStart = getISOMonday(first);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));

  const byDay = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    reservations.forEach((r) => {
      const key = toISODate(new Date(r.start));
      map.set(key, [...(map.get(key) || []), r]);
    });
    return map;
  }, [reservations]);

  const focusIso = toISODate(focusDate);

  return (
    <section className="rounded-2xl border border-white/12 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-2 md:p-3 shadow-[0_26px_60px_-36px_rgba(15,23,42,0.85)]">
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2 text-[11px] text-white/60">
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
          <div key={d} className="px-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {cells.map((d, i) => {
          const key = toISODate(d);
          const list = byDay.get(key) || [];
          const other = d.getMonth() !== focusDate.getMonth();
          const today = new Date().toDateString() === d.toDateString();
          const isFocused = key === focusIso;
          const dayUrl = calendarUrl(d, "day");
          return (
            <div
              key={`cell-${i}`}
              className={`rounded-xl border p-1.5 sm:p-2 transition duration-200 ${
                other ? "opacity-60" : ""
              } ${
                today
                  ? "border-white/40 bg-white/[0.08] shadow-[0_12px_28px_-22px_rgba(148,163,184,0.85)]"
                  : isFocused
                  ? "border-sky-400/60 bg-sky-500/[0.10] shadow-[0_18px_32px_-24px_rgba(56,189,248,0.85)]"
                  : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"
              }`}
            >
              <div className="mb-1 flex items-center justify-between gap-1">
                <div className="text-[10px] sm:text-xs opacity-80">
                  {d.getDate()}.{pad(d.getMonth() + 1)}
                </div>
                <div className="flex items-center gap-1">
                  {today && (
                    <span className="text-[9px] sm:text-[10px] rounded bg-white/15 px-1.5 py-0.5">Сегодня</span>
                  )}
                  <Link
                    href={dayUrl}
                    prefetch={false}
                    className="rounded-full border border-white/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-white/70 transition hover:border-white/20 hover:bg-white/10"
                    aria-label={`Открыть ${toISODate(d)} в режиме дня`}
                  >
                    День
                  </Link>
                </div>
              </div>

              {list.slice(0, 3).map((r) => {
                const resName = ADMIN_RESOURCES.find((x) => x.id === r.resourceId)?.name ?? r.resourceId;
                return (
                  <Link
                    key={r.id}
                    href={`${r.href}?adminView=1`}
                    className="mb-1 block truncate rounded-lg border px-2 py-1 text-[10px] sm:text-[11px] shadow-sm transition hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200/80"
                    style={{
                      background: "linear-gradient(135deg, rgba(56,189,248,0.88) 0%, rgba(125,211,252,0.88) 100%)",
                      borderColor: "rgba(186,230,253,0.9)",
                      color: "#0b0e14",
                    }}
                    title={`${r.client} • ${r.serviceId}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <BookingIcon seed={resName} />
                      <span className="truncate">
                        {r.client} · {r.serviceId}
                      </span>
                    </div>
                  </Link>
                );
              })}
              {list.length > 3 && <div className="text-[10px] sm:text-[11px] opacity-70">+ ещё {list.length - 3}</div>}
            </div>
          );
        })}
      </div>
      <div className="text-[10px] sm:text-xs opacity-70 mt-2">Клик по событию → карточка записи (режим «Просмотр админом»).</div>
    </section>
  );
}

/* ============ booking icon ============ */
function BookingIcon({ seed }: { seed: string }) {
  const text = (seed || "?").trim() || "?";
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) | 0;
  const hue = Math.abs(hash) % 360;
  const accent = `hsl(${hue} 82% 56%)`;
  const accentSoft = `hsl(${(hue + 24) % 360} 88% 68%)`;
  return (
    <span
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/25 shadow-[0_10px_18px_-12px_rgba(15,23,42,0.9)]"
      style={{
        background: `linear-gradient(135deg, ${accentSoft} 0%, ${accent} 100%)`,
        color: "#0b0e14",
      }}
      aria-hidden="true"
    >
      <svg
        className="h-[14px] w-[14px]"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          x="3.6"
          y="5.5"
          width="16.8"
          height="14.6"
          rx="3.1"
          fill="rgba(255,255,255,0.92)"
          stroke="rgba(12,18,28,0.18)"
          strokeWidth="1.2"
        />
        <path
          d="M3.6 9.5h16.8"
          stroke="rgba(12,18,28,0.16)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M8.15 3.8v3.25M15.85 3.8v3.25"
          stroke="rgba(12,18,28,0.32)"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
        <path
          d="m9.3 14.6 2.25 2.15 3.75-3.75"
          stroke="#0b0e14"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
