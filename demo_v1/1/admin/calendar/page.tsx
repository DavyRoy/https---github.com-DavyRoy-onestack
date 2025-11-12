// app/demo/admin/calendar/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

/* ========= утилиты дат ========= */
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const setHM = (d: Date, h: number, m = 0) => {
  const x = new Date(d);
  x.setHours(h, m, 0, 0);
  return x;
};
const getISOMonday = (d: Date) => {
  const day = d.getDay(); // 0..6 (0=Вс)
  const diff = day === 0 ? -6 : 1 - day; // до понедельника
  return addDays(d, diff);
};
const fmtHumanRangeWeek = (monday: Date) => {
  const start = monday;
  const end = addDays(monday, 6);
  const fmt = (x: Date) =>
    `${x.getDate()} ${["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"][x.getMonth()]} ${x.getFullYear()}`;
  return `${fmt(start)} — ${fmt(end)}`;
};
const weekdaysShort = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

/* ========= шкала (30 мин, 09—21) ========= */
const SLOT_FROM = 9;
const SLOT_TO = 21;
const HALF_HOUR_STEPS = Array.from(
  { length: (SLOT_TO - SLOT_FROM) * 2 }, // 24 строки по 30 мин
  (_, i) => SLOT_FROM * 60 + i * 30
);
const minutesBetween = (a: Date, b: Date) => Math.max(0, Math.round((b.getTime() - a.getTime()) / 60000));

/** Позиция блока внутри дневной колонки (в процентах, с «зажимом» в пределах 09–21) */
function blockStyle(day: Date, start: Date, end: Date) {
  const dayStart = setHM(day, SLOT_FROM, 0);
  const dayEnd = setHM(day, SLOT_TO, 0);

  const s = new Date(Math.max(start.getTime(), dayStart.getTime()));
  const e = new Date(Math.min(end.getTime(), dayEnd.getTime()));
  if (e <= s) {
    return { top: "0%", height: "0%", hidden: true as const };
  }

  const topMin = minutesBetween(dayStart, s);
  const totalMin = Math.max(1, minutesBetween(dayStart, dayEnd));
  const heightMin = Math.max(20, minutesBetween(s, e)); // min высота
  const topPct = (topMin / totalMin) * 100;
  const heightPct = (heightMin / totalMin) * 100;

  return { top: `${topPct}%`, height: `${heightPct}%`, hidden: false as const };
}

/* ========= страница ========= */
export default function AdminCalendarPage() {
  const sp = useSearchParams();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const view = (mounted ? sp.get("view") : "week") || "week"; // day|week|month
  const dateParam = mounted ? sp.get("date") : null;

  const focusDate = useMemo(() => {
    if (!mounted) return new Date();
    if (!dateParam) return new Date();
    const d = new Date(dateParam);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [mounted, dateParam]);

  // фильтры
  const serviceId = mounted ? sp.get("service") || "" : "";
  const resourceId = mounted ? sp.get("resource") || "" : "";
  const status = mounted ? sp.get("status") || "" : "";
  const locationId = mounted ? sp.get("location") || "" : "";

  // данные (учёт localStorage-оверрайдов)
  const templates: SlotTemplate[] = useMemo(
    () => (mounted ? loadTemplates() : ADMIN_SLOT_TEMPLATES),
    [mounted]
  );
  const exceptions = useMemo(
    () => (mounted ? loadExceptions() : ADMIN_EXCEPTIONS),
    [mounted]
  );
  const reservations: Reservation[] = ADMIN_RESERVATIONS;

  // производные
  const monday = useMemo(() => getISOMonday(focusDate), [focusDate]);
  const days = useMemo(() => Array.from({ length: view === "day" ? 1 : 7 }, (_, i) => addDays(view === "day" ? focusDate : monday, i)), [monday, focusDate, view]);

  // фильтр событий
  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      const d = new Date(r.start);
      // ограничение по диапазону
      if (view === "week") {
        const inWeek = toISODate(d) >= toISODate(monday) && toISODate(d) <= toISODate(addDays(monday, 6));
        if (!inWeek) return false;
      }
      if (view === "day") {
        if (toISODate(d) !== toISODate(focusDate)) return false;
      }
      if (view === "month") {
        if (d.getMonth() !== focusDate.getMonth() || d.getFullYear() !== focusDate.getFullYear()) return false;
      }
      // фильтры
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

  // покрытие (шаблоны)
  const coverage = useMemo(() => {
    const list: Array<{ dayIndex: number; day: Date; start: Date; end: Date; tpl: SlotTemplate }> = [];
    days.forEach((day, idx) => {
      const isoDow1to7 = ((day.getDay() + 6) % 7) + 1; // 1..7 (пн..вс)
      templates.forEach((tpl) => {
        if (tpl.active === false) return;
        if (!Array.isArray(tpl.days) || !tpl.days.includes(isoDow1to7)) return;

        if (serviceId && Array.isArray(tpl.serviceIds) && tpl.serviceIds.length && !tpl.serviceIds.includes(serviceId)) return;
        if (resourceId && Array.isArray(tpl.resourceIds) && tpl.resourceIds.length && !tpl.resourceIds.includes(resourceId)) return;
        if (locationId && tpl.locationId && tpl.locationId !== locationId) return;

        const dayISO = toISODate(day);
        if (tpl.dateFrom && dayISO < tpl.dateFrom) return;
        if (tpl.dateTo && dayISO > tpl.dateTo) return;

        const start = setHM(day, parseInt(tpl.start.slice(0, 2)), parseInt(tpl.start.slice(3)));
        const end = setHM(day, parseInt(tpl.end.slice(0, 2)), parseInt(tpl.end.slice(3)));
        list.push({ dayIndex: idx, day, start, end, tpl });
      });
    });
    return list;
  }, [days, templates, serviceId, resourceId, locationId]);

  // исключения
  const exceptionsWeek = useMemo(() => {
    const result: Array<{ dayIndex: number; day: Date; start: Date; end: Date; ex: any }> = [];
    exceptions
      .filter((ex) => ex.active !== false)
      .forEach((ex) => {
        const d = new Date(`${ex.date}T00:00:00`);
        if (view === "week") {
          const inWeek = toISODate(d) >= toISODate(monday) && toISODate(d) <= toISODate(addDays(monday, 6));
          if (!inWeek) return;
        }
        if (view === "day") {
          if (toISODate(d) !== toISODate(focusDate)) return;
        }
        if (locationId && ex.locationId && ex.locationId !== locationId) return;
        if (resourceId && Array.isArray(ex.resourceIds) && ex.resourceIds.length && !ex.resourceIds.includes(resourceId)) return;

        const day = view === "day" ? focusDate : d;
        const idx = view === "day" ? 0 : Math.floor((d.getTime() - monday.getTime()) / 86400000);
        if (idx < 0 || idx > 6) return;

        const fromS = ex.start ?? "00:00";
        const toS = ex.end ?? "23:59";
        const start = setHM(day, parseInt(fromS.slice(0, 2)), parseInt(fromS.slice(3)));
        const end = setHM(day, parseInt(toS.slice(0, 2)), parseInt(toS.slice(3)));
        result.push({ dayIndex: idx, day, start, end, ex });
      });
    return result;
  }, [exceptions, monday, focusDate, view, resourceId, locationId]);

  // опции фильтров
  const servicesOptions = useMemo(() => {
    const fromRes = Array.from(new Set(reservations.map((r) => r.serviceId)));
    const fromTpl = Array.from(new Set(templates.flatMap((t) => t.serviceIds || [])));
    return Array.from(new Set([...fromRes, ...fromTpl])).filter(Boolean);
  }, [reservations, templates]);

  const resourcesOptions = useMemo(
    () =>
      ADMIN_RESOURCES.filter((r) => (locationId ? r.locationId === locationId : true)).map((r) => ({
        id: r.id,
        name: r.name,
      })),
    [locationId]
  );

  const goDate = (d: Date) =>
    `/demo/admin/calendar?view=${view}&date=${toISODate(d)}${serviceId ? `&service=${serviceId}` : ""}${
      resourceId ? `&resource=${resourceId}` : ""
    }${status ? `&status=${status}` : ""}${locationId ? `&location=${locationId}` : ""}`;

  /* ========= SSR-шелл ========= */
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

  /* ========= UI ========= */
  return (
    <div className="grid gap-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Календарь (админ)</h1>
          {view === "week" && <p className="text-white/60 text-sm mt-1">{fmtHumanRangeWeek(monday)}</p>}
          {view === "day" && <p className="text-white/60 text-sm mt-1">{toISODate(focusDate)}</p>}
          {view === "month" && (
            <p className="text-white/60 text-sm mt-1">
              {focusDate.toLocaleString("ru-RU", { month: "long", year: "numeric" })}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="inline-flex rounded-lg border border-white/15 overflow-hidden">
            <Link
              href={`/demo/admin/calendar?view=day&date=${toISODate(focusDate)}`}
              className={`px-3 py-2 text-sm ${view === "day" ? "bg-white/10" : "hover:bg-white/10"}`}
            >
              День
            </Link>
            <Link
              href={`/demo/admin/calendar?view=week&date=${toISODate(focusDate)}`}
              className={`px-3 py-2 text-sm ${view === "week" ? "bg-white/10" : "hover:bg-white/10"}`}
            >
              Неделя
            </Link>
            <Link
              href={`/demo/admin/calendar?view=month&date=${toISODate(focusDate)}`}
              className={`px-3 py-2 text-sm ${view === "month" ? "bg-white/10" : "hover:bg-white/10"}`}
            >
              Месяц
            </Link>
          </div>
          <div className="inline-flex rounded-lg border border-white/15 overflow-hidden">
            <Link href={goDate(addDays(focusDate, view === "month" ? -30 : -7))} className="px-3 py-2 text-sm hover:bg-white/10">‹ Назад</Link>
            <Link href={goDate(new Date())} className="px-3 py-2 text-sm hover:bg-white/10">Сегодня</Link>
            <Link href={goDate(addDays(focusDate, view === "month" ? 30 : 7))} className="px-3 py-2 text-sm hover:bg-white/10">Вперёд ›</Link>
          </div>
          <Link href={`/demo/manager/booking/new?date=${toISODate(focusDate)}`} className="px-3 py-2 text-sm rounded-lg border border-white/20 hover:bg-white/10">
            Создать запись
          </Link>
          <Link href="/demo/app/export?kind=ics" className="px-3 py-2 text-sm rounded-lg border border-white/20 hover:bg-white/10">
            Экспорт (ICS/CSV)
          </Link>
        </div>
      </header>

      {/* Filters */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 backdrop-blur-sm">
        <div className="grid gap-2 md:grid-cols-5">
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
              ...["new","pending","confirmed","completed","cancelled","noshow","rescheduled"].map((s) => ({ id: s, name: s })),
            ]}
          />
          <FieldSelect
            label="Локация"
            value={locationId}
            onChangeParam="location"
            options={[
              { id: "", name: "Все" },
              ...Array.from(new Set(ADMIN_RESOURCES.map((r) => r.locationId).filter(Boolean) as string[])).map((loc) => ({
                id: loc,
                name: loc,
              })),
            ]}
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60 w-20">Вид</span>
            <div className="flex gap-2">
              <Link className={`px-2 py-1 text-xs rounded ${view === "day" ? "bg-white/15" : "hover:bg-white/10"}`} href={`/demo/admin/calendar?view=day&date=${toISODate(focusDate)}`}>День</Link>
              <Link className={`px-2 py-1 text-xs rounded ${view === "week" ? "bg-white/15" : "hover:bg-white/10"}`} href={`/demo/admin/calendar?view=week&date=${toISODate(focusDate)}`}>Неделя</Link>
              <Link className={`px-2 py-1 text-xs rounded ${view === "month" ? "bg-white/15" : "hover:bg-white/10"}`} href={`/demo/admin/calendar?view=month&date=${toISODate(focusDate)}`}>Месяц</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      {view !== "month" ? (
        <WeekView
          days={days}
          reservations={filteredReservations}
          coverage={coverage}
          exceptions={exceptionsWeek}
        />
      ) : (
        <MonthView focusDate={focusDate} reservations={filteredReservations} />
      )}

      {/* Legend */}
      <section className="rounded-xl border border-white/15 p-3 md:p-4 flex flex-wrap gap-4 text-xs">
        <span className="inline-flex items-center gap-2">
          <i className="inline-block w-3 h-3 rounded bg-emerald-400/40 border border-emerald-300/50" /> Покрытие (шаблон)
        </span>
        <span className="inline-flex items-center gap-2">
          <i className="inline-block w-3 h-3 rounded bg-rose-400/40 border border-rose-300/50" /> Исключение
        </span>
        <span className="inline-flex items-center gap-2">
          <i className="inline-block w-3 h-3 rounded bg-sky-400/70 border border-sky-200/70" /> Бронь (read-only)
        </span>
      </section>
    </div>
  );
}

/* ========= вспом. компонент выбора ========= */
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
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/60 w-20">{label}</span>
      <select
        className="w-full bg-transparent border border-white/20 rounded-lg px-2 py-1 text-sm"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          const url = new URL(window.location.href);
          if (v) url.searchParams.set(onChangeParam, v);
          else url.searchParams.delete(onChangeParam);
          window.location.href = url.toString();
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

/* ========= Week/Day View ========= */
function WeekView({
  days,
  reservations,
  coverage,
  exceptions,
}: {
  days: Date[];
  reservations: Reservation[];
  coverage: { dayIndex: number; day: Date; start: Date; end: Date; tpl: SlotTemplate }[];
  exceptions: { dayIndex: number; day: Date; start: Date; end: Date; ex: any }[];
}) {
  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.03] p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          {/* заголовки дней */}
          <div className="grid sticky top-0 z-10" style={{ gridTemplateColumns: `120px repeat(${days.length}, 1fr)` }}>
            <div className="h-10 border-b border-white/10 bg-[#0b0e14]" />
            {days.map((d, i) => (
              <div key={`head-${i}`} className="h-10 border-b border-l border-white/10 bg-[#0b0e14] px-2 flex items-center">
                <div>
                  <div className="text-xs opacity-70">{weekdaysShort[(d.getDay() + 6) % 7]}</div>
                  <div className="text-sm">{d.getDate()}.{pad(d.getMonth() + 1)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* сетка времени + дорожки */}
          <div className="relative grid" style={{ gridTemplateColumns: `120px repeat(${days.length}, 1fr)` }}>
            {/* шкала слева */}
            <div className="relative">
              {HALF_HOUR_STEPS.map((m, i) => {
                const h = Math.floor(m / 60);
                const mm = m % 60;
                const isHour = mm === 0;
                return (
                  <div key={`scale-${i}`} className="relative border-t border-white/[0.08]" style={{ height: 24 }}>
                    {isHour && (
                      <div className="absolute -translate-y-1/2 top-0 text-xs opacity-60">{pad(h)}:00</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* колонки дней */}
            {days.map((day, colIdx) => (
              <div key={`col-${colIdx}`} className="relative border-l border-white/10" style={{ minHeight: HALF_HOUR_STEPS.length * 24 }}>
                {/* фоновые линии */}
                {HALF_HOUR_STEPS.map((_, i) => (
                  <div key={`hr-${colIdx}-${i}`} className="border-t border-white/[0.07]" style={{ height: 24 }} />
                ))}

                {/* слой: покрытие (шаблоны) */}
                <div className="absolute inset-0 z-10">
                  {coverage
                    .filter((c) => c.dayIndex === colIdx)
                    .map((c) => {
                      const pos = blockStyle(day, c.start, c.end);
                      if (pos.hidden) return null;
                      return (
                        <Link
                          key={`cov-${c.tpl.id}-${c.start.getTime()}`}
                          href={`/demo/admin/booking/schedules?week=${toISODate(getISOMonday(day))}#tpl-${c.tpl.id}`}
                          className="absolute left-1 right-1 rounded-md bg-emerald-400/35 border border-emerald-300/40 hover:bg-emerald-400/45 transition"
                          style={{ top: pos.top, height: pos.height }}
                          title={`Шаблон: ${c.tpl.name}`}
                        />
                      );
                    })}
                </div>

                {/* слой: исключения */}
                <div className="absolute inset-0 z-20">
                  {exceptions
                    .filter((e) => e.dayIndex === colIdx)
                    .map((e) => {
                      const pos = blockStyle(day, e.start, e.end);
                      if (pos.hidden) return null;
                      return (
                        <Link
                          key={`ex-${e.ex.id}-${e.start.getTime()}`}
                          href={`/demo/admin/booking/schedules/exceptions?week=${toISODate(getISOMonday(day))}#ex-${e.ex.id}`}
                          className="absolute left-2 right-2 rounded-md bg-rose-400/40 border border-rose-300/50 hover:bg-rose-400/50 transition"
                          style={{ top: pos.top, height: pos.height }}
                          title={`Исключение: ${e.ex.reason || e.ex.type}`}
                        />
                      );
                    })}
                </div>

                {/* слой: брони */}
                <div className="absolute inset-0 z-30">
                  {reservations
                    .filter((r) => toISODate(new Date(r.start)) === toISODate(day))
                    .map((r) => {
                      const start = new Date(r.start);
                      const end = new Date(r.end);
                      const pos = blockStyle(day, start, end);
                      if (pos.hidden) return null;
                      return (
                        <Link
                          key={r.id}
                          href={`${r.href}?adminView=1`}
                          className="absolute left-3 right-3 rounded-md bg-sky-400/70 border border-sky-200/70 px-2 py-1 text-xs shadow-sm"
                          style={{ top: pos.top, height: pos.height }}
                          title={`${r.client} • ${r.serviceId}`}
                        >
                          <div className="font-medium truncate">{r.client}</div>
                          <div className="opacity-80 truncate">{r.serviceId}</div>
                        </Link>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========= Month View ========= */
function MonthView({ focusDate, reservations }: { focusDate: Date; reservations: Reservation[] }) {
  const firstOfMonth = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
  const gridStart = getISOMonday(firstOfMonth);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i)); // 6 недель

  const byDay = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    reservations.forEach((r) => {
      const key = toISODate(new Date(r.start));
      map.set(key, [...(map.get(key) || []), r]);
    });
    return map;
  }, [reservations]);

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.03] p-2 md:p-3">
      <div className="grid grid-cols-7 gap-2">
        {cells.map((d, i) => {
          const key = toISODate(d);
          const list = byDay.get(key) || [];
          const isOtherMonth = d.getMonth() !== focusDate.getMonth();
          return (
            <div key={`mcell-${i}`} className={`rounded-xl border border-white/10 p-2 ${isOtherMonth ? "opacity-50" : ""}`}>
              <div className="text-xs mb-1 opacity-70">{d.getDate()}.{pad(d.getMonth() + 1)}</div>
              {list.slice(0, 3).map((r) => (
                <Link
                  key={`mres-${r.id}`}
                  href={`${r.href}?adminView=1`}
                  className="block text-xs px-2 py-1 rounded bg-sky-400/70 border border-sky-200/70 mb-1 truncate"
                  title={`${r.client} • ${r.serviceId}`}
                >
                  {r.client} · {r.serviceId}
                </Link>
              ))}
              {list.length > 3 && <div className="text-[11px] opacity-70">+ ещё {list.length - 3}</div>}
            </div>
          );
        })}
      </div>
      <div className="text-xs opacity-70 mt-2">Клик по событию → карточка записи (режим «Просмотр админом»).</div>
    </section>
  );
}