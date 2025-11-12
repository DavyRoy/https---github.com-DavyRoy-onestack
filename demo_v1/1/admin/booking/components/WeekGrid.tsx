// app/demo/admin/booking/components/WeekGrid.tsx
"use client";

import * as React from "react";
import SlotTemplateModal from "@/app/demo/admin/booking/components/SlotTemplateModal";
import ExceptionModal from "@/app/demo/admin/booking/components/ExceptionModal";
import ConflictsPanel, { computeConflicts } from "@/app/demo/admin/booking/components/grid/ConflictsPanel";
import {
  ADMIN_RESOURCES,
  type AdminResource,
  type AdminTemplate,
  type AdminException,
  type AdminReservation,
  saveExceptions,
} from "@/app/demo/(shared)/booking";

/* ====== константы макета ====== */
const MINUTE_STEP = 30;
const HOUR_FROM = 9;
const HOUR_TO = 21;
const SLOT_ROW_H = 22;
const LANE_GAP_PX = 6; // зазор между дорожками

/* ====== утилы ====== */
const pad2 = (n: number) => String(n).padStart(2, "0");
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

function parseTimeToMinutes(t?: string | null): number | null {
  if (!t || typeof t !== "string") return null;
  const m = t.match(TIME_RE);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}
function weekDates(isoMonday: string) {
  const base = new Date(isoMonday + "T00:00:00");
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d;
  });
}
function isSameYMD(a: Date, b: Date = new Date()) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function toGridRowIndex(minFromDayStart: number) {
  const rowsFromStart = Math.floor(minFromDayStart / MINUTE_STEP);
  return 2 + rowsFromStart; // 1-я строка — заголовок
}
function calcRowSpan(minFrom: number, minTo: number) {
  const dur = Math.max(minTo - minFrom, MINUTE_STEP);
  return Math.ceil(dur / MINUTE_STEP);
}
function localMinutesOf(dateISO: string): number | null {
  if (!dateISO) return null;
  const d = new Date(dateISO);
  if (isNaN(d.getTime())) return null;
  return d.getHours() * 60 + d.getMinutes();
}
function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

type Filters = { serviceId?: string; resourceId?: string; locationId?: string };

/** Раскладка пересекающихся интервалов по «дорожкам» внутри дня */
type LaneItem<T> = {
  id: string;
  fromM: number; // минуты от HOUR_FROM
  toM: number;
  payload: T;
};
type LaidItem<T> = LaneItem<T> & { lane: number; lanesTotal: number };
function layoutDayLanes<T extends { id?: string }>(items: LaneItem<T>[]): LaidItem<T>[] {
  // сортируем по началу, вторично по длительности (длинные раньше)
  const xs = [...items].sort((a, b) => a.fromM - b.fromM || b.toM - a.toM);
  const lanes: { endM: number }[] = []; // endM для каждой дорожки
  const placed: LaidItem<T>[] = [];

  for (const it of xs) {
    // ищем первую дорожку, где нет пересечения (endM <= fromM)
    let laneIdx = lanes.findIndex((l) => l.endM <= it.fromM);
    if (laneIdx === -1) {
      laneIdx = lanes.length;
      lanes.push({ endM: it.toM });
    } else {
      lanes[laneIdx].endM = Math.max(lanes[laneIdx].endM, it.toM);
    }
    placed.push({ ...it, lane: laneIdx, lanesTotal: 0 }); // lanesTotal проставим позже
  }
  const lanesTotal = lanes.length || 1;
  placed.forEach((p) => (p.lanesTotal = lanesTotal));
  return placed;
}

/* ====== компонент ====== */
export default function WeekGrid({
  weekStart,
  templates,
  exceptions,
  reservations,
  onTemplatesChange,
  onExceptionsChange,
  filters,
}: {
  weekStart: string;
  templates: AdminTemplate[];
  exceptions: AdminException[];
  reservations: AdminReservation[];
  onTemplatesChange: (x: AdminTemplate[]) => void;
  onExceptionsChange: (x: AdminException[]) => void;
  filters: Filters;
}) {
  const days = React.useMemo(() => weekDates(weekStart), [weekStart]);
  const totalTimeRows = React.useMemo(() => ((HOUR_TO - HOUR_FROM) * 60) / MINUTE_STEP + 1, []);
  const [resources] = React.useState<AdminResource[]>(ADMIN_RESOURCES);

  // drag для создания шаблона
  const [drag, setDrag] = React.useState<null | { dayIdx: number; from: string; to: string }>(null);
  const [openTpl, setOpenTpl] = React.useState<null | { dayIdx: number; from: string; to: string }>(null);
  const [openEx, setOpenEx] = React.useState<null | { date: string }>(null);

  const rowIdxToTime = (rowIdx: number) => {
    const totalMin = rowIdx * MINUTE_STEP + HOUR_FROM * 60;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${pad2(h)}:${pad2(m)}`;
  };

  function cellMouseDown(dayIdx: number, hour: string) {
    const safe = TIME_RE.test(hour) ? hour : `${pad2(HOUR_FROM)}:00`;
    setDrag({ dayIdx, from: safe, to: safe });
  }
  function cellMouseEnter(dayIdx: number, hour: string) {
    const safe = TIME_RE.test(hour) ? hour : `${pad2(HOUR_FROM)}:00`;
    setDrag((d) => (d && d.dayIdx === dayIdx ? { ...d, to: safe } : d));
  }
  function cellMouseUp() {
    if (drag) {
      const a = parseTimeToMinutes(drag.from) ?? HOUR_FROM * 60;
      const b = parseTimeToMinutes(drag.to) ?? a + MINUTE_STEP;
      const fromMin = Math.min(a, b);
      const toMin = Math.max(a === b ? a + MINUTE_STEP : b, fromMin + MINUTE_STEP);
      setOpenTpl({
        dayIdx: drag.dayIdx,
        from: `${pad2(Math.floor(fromMin / 60))}:${pad2(fromMin % 60)}`,
        to: `${pad2(Math.floor(toMin / 60))}:${pad2(toMin % 60)}`,
      });
    }
    setDrag(null);
  }

  const match = (svc?: string, res?: string, loc?: string) => {
    if (filters.serviceId && svc && svc !== filters.serviceId) return false;
    if (filters.resourceId && res && res !== filters.resourceId) return false;
    if (filters.locationId && loc && loc !== filters.locationId) return false;
    return true;
  };

  const conflicts = React.useMemo(
    () => computeConflicts({ templates, resources, weekStart, filters }),
    [templates, resources, weekStart, filters]
  );

  React.useEffect(() => {
    saveExceptions(exceptions);
  }, [exceptions]);

  /* ---------- helpers для рендера дорожек ---------- */
  function renderTemplateBlockCommon(label: string) {
    return (
      <div className="pointer-events-none">
        <div className="text-[10px] font-medium leading-none">{label}</div>
      </div>
    );
  }
  function laneStyles(lane: number, lanesTotal: number): React.CSSProperties {
    // ширина колонки дня делится на N дорожек с зазором LANE_GAP_PX между ними
    // width% = 100/lanes - gapComp, left% = lane*(100/lanes)
    const pct = 100 / lanesTotal;
    return {
      position: "relative",
      left: `calc(${pct * lane}% + ${lane * (LANE_GAP_PX / lanesTotal)}px)`,
      width: `calc(${pct}% - ${(LANE_GAP_PX * (lanesTotal - 1)) / lanesTotal}px)`,
    };
  }

  /* ====== MOBILE ====== */
  function MobileDayCard({ day, dayIdx }: { day: Date; dayIdx: number }) {
    const label = day.toLocaleDateString("ru-RU", { weekday: "short", day: "2-digit", month: "short" });
    const today = isSameYMD(day);

    // Подготовим элементы дня -> lanes
    const dayTemplates: LaneItem<AdminTemplate>[] = templates
      .filter((t) => {
        if (!match((t as any).serviceId, (t as any).resourceId, (t as any).locationId)) return false;
        return ((t as any).dayOfWeek ?? 0) === dayIdx;
      })
      .map((t) => {
        const fromA = parseTimeToMinutes((t as any).from) ?? HOUR_FROM * 60;
        const toA = parseTimeToMinutes((t as any).to) ?? fromA + MINUTE_STEP;
        let fromM = fromA - HOUR_FROM * 60;
        let toM = toA - HOUR_FROM * 60;
        fromM = Math.max(0, fromM);
        toM = Math.max(fromM + MINUTE_STEP, Math.min((HOUR_TO - HOUR_FROM) * 60, toM));
        return { id: (t as any).id ?? `${dayIdx}-${fromA}-${toA}`, fromM, toM, payload: t };
      });

    const laid = layoutDayLanes(dayTemplates);

    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-2">
        <div className={`flex items-center justify-between px-1 pb-2 ${today ? "text-white" : ""}`}>
          <div className={`text-sm font-medium ${today ? "bg-white/5 rounded px-1.5 py-0.5" : ""}`}>{label}</div>
          {filters.resourceId && (
            <span className="text-[10px] rounded bg-white/10 px-1.5 py-0.5">
              cap: {resources.find((r) => r.id === filters.resourceId)?.capacity ?? 1}
            </span>
          )}
        </div>

        <div
          className="grid"
          style={{ gridTemplateColumns: "56px 1fr", gridAutoRows: `${SLOT_ROW_H}px` }}
        >
          {/* Часы */}
          {Array.from({ length: totalTimeRows }).map((_, rIdx) => {
            const totalMin = rIdx * MINUTE_STEP + HOUR_FROM * 60;
            const onHour = totalMin % 60 === 0 && totalMin / 60 <= HOUR_TO;
            const hLabel = `${pad2(Math.floor(totalMin / 60))}:00`;
            return (
              <div
                key={`mh-${rIdx}`}
                className="px-1 text-[11px] text-white/60 border-b border-white/[0.08] flex items-start"
                style={{ gridColumn: "1 / span 1", gridRow: `${rIdx + 2} / span 1` }}
              >
                {onHour ? hLabel : ""}
              </div>
            );
          })}

          {/* Интерактивные клетки */}
          {Array.from({ length: totalTimeRows }).map((_, rIdx) => (
            <div
              key={`mc-${rIdx}`}
              className="relative border-b border-white/[0.08] hover:bg-white/[0.035] cursor-crosshair"
              style={{ gridColumn: "2 / span 1", gridRow: `${rIdx + 2} / span 1` }}
              onMouseDown={() => cellMouseDown(dayIdx, rowIdxToTime(rIdx))}
              onMouseEnter={() => cellMouseEnter(dayIdx, rowIdxToTime(rIdx))}
              onMouseUp={cellMouseUp}
            >
              {drag && drag.dayIdx === dayIdx && <div className="absolute inset-0 bg-emerald-400/15 pointer-events-none" />}
            </div>
          ))}

          {/* Templates c раскладкой по дорожкам */}
          {laid.map((li) => {
            const rowStart = toGridRowIndex(li.fromM);
            const rowSpan = calcRowSpan(li.fromM, li.toM);
            const t: any = li.payload;
            const label = `${t.name ?? "Шаблон"} • ${t.from ?? ""}–${t.to ?? ""}`;

            return (
              <button
                key={li.id}
                className="rounded-md border border-emerald-400/30 bg-emerald-500/20 backdrop-blur-[2px] px-1 py-0.5 overflow-hidden text-left shadow-sm hover:bg-emerald-500/30"
                style={{ gridColumn: "2 / span 1", gridRow: `${rowStart} / span ${rowSpan}`, ...laneStyles(li.lane, li.lanesTotal) }}
                title={label}
                onClick={() => setOpenTpl({ dayIdx, from: t.from ?? "10:00", to: t.to ?? "11:00" })}
              >
                {renderTemplateBlockCommon(label)}
              </button>
            );
          })}

          {/* Exceptions (верхняя полоска) */}
          {exceptions.map((ex) => {
            if (dayKey(day) !== ((ex as any).date ?? "")) return null;
            return (
              <button
                key={(ex as any).id}
                className="rounded bg-red-500/25 border border-red-400/30 text-[10px] px-1 overflow-hidden hover:bg-red-500/35"
                style={{
                  gridColumn: "2 / span 1",
                  gridRow: "2 / span 1",
                  alignSelf: "start",
                  height: SLOT_ROW_H - 4,
                  marginTop: 2,
                }}
                title={(ex as any).reason ?? "Исключение"}
                onClick={() => setOpenEx({ date: (ex as any).date })}
              >
                Исключение • {(ex as any).reason ?? "—"}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ====== DESKTOP ====== */
  function DesktopWeekGrid() {
    // Готовим темплейты для каждого дня → lanes
    const dayLaid = days.map((_d, dayIdx) => {
      const dayTemplates: LaneItem<AdminTemplate>[] = templates
        .filter((t) => {
          if (!match((t as any).serviceId, (t as any).resourceId, (t as any).locationId)) return false;
          return ((t as any).dayOfWeek ?? 0) === dayIdx;
        })
        .map((t) => {
          const fromA = parseTimeToMinutes((t as any).from) ?? HOUR_FROM * 60;
          const toA = parseTimeToMinutes((t as any).to) ?? fromA + MINUTE_STEP;
          let fromM = fromA - HOUR_FROM * 60;
          let toM = toA - HOUR_FROM * 60;
          fromM = Math.max(0, fromM);
          toM = Math.max(fromM + MINUTE_STEP, Math.min((HOUR_TO - HOUR_FROM) * 60, toM));
          return { id: (t as any).id ?? `${dayIdx}-${fromA}-${toA}`, fromM, toM, payload: t };
        });
      return layoutDayLanes(dayTemplates);
    });

    return (
      <div className="overflow-x-auto">
        <div
          className="relative grid"
          style={{
            gridTemplateColumns: "80px repeat(7, minmax(0, 1fr))",
            gridAutoRows: `${SLOT_ROW_H}px`,
            minWidth: 720,
            maxWidth: "100%",
          }}
        >
          {/* заголовки дней */}
          <div className="col-span-1" />
          {days.map((d, i) => {
            const today = isSameYMD(d);
            const label = d.toLocaleDateString("ru-RU", { weekday: "short", day: "2-digit", month: "short" });
            return (
              <div
                key={`head-${i}`}
                className={`px-2 py-1 text-sm font-medium flex items-center gap-2 ${today ? "rounded bg-white/5" : ""}`}
                style={{ gridColumn: `${i + 2} / span 1`, gridRow: "1 / span 1" }}
              >
                <span>{label}</span>
                {filters.resourceId && (
                  <span className="ml-auto text-[10px] rounded bg-white/10 px-1.5 py-0.5">
                    cap: {resources.find((r) => r.id === filters.resourceId)?.capacity ?? 1}
                  </span>
                )}
              </div>
            );
          })}

          {/* колонка часов */}
          {Array.from({ length: totalTimeRows }).map((_, idx) => {
            const totalMin = idx * MINUTE_STEP + HOUR_FROM * 60;
            const onHour = totalMin % 60 === 0 && totalMin / 60 <= HOUR_TO;
            const label = `${pad2(Math.floor(totalMin / 60))}:00`;
            return (
              <div
                key={`hour-${idx}`}
                className="px-2 py-1 text-xs text-white/60 border-b border-white/[0.08]"
                style={{ gridColumn: "1 / span 1", gridRow: `${idx + 2} / span 1` }}
              >
                {onHour ? label : ""}
              </div>
            );
          })}

          {/* клетки сетки */}
          {Array.from({ length: 7 }).map((_, dayIdx) =>
            Array.from({ length: totalTimeRows }).map((__, rIdx) => (
              <div
                key={`cell-${dayIdx}-${rIdx}`}
                className="relative border-b border-white/[0.08] hover:bg-white/[0.035] cursor-crosshair"
                style={{ gridColumn: `${dayIdx + 2} / span 1`, gridRow: `${rIdx + 2} / span 1` }}
                onMouseDown={() => cellMouseDown(dayIdx, rowIdxToTime(rIdx))}
                onMouseEnter={() => cellMouseEnter(dayIdx, rowIdxToTime(rIdx))}
                onMouseUp={cellMouseUp}
              >
                {drag && drag.dayIdx === dayIdx && <div className="absolute inset-0 bg-emerald-400/15 pointer-events-none" />}
              </div>
            ))
          )}

          {/* Templates с раскладкой по дорожкам */}
          {dayLaid.map((laid, dayIdx) =>
            laid.map((li) => {
              const rowStart = toGridRowIndex(li.fromM);
              const rowSpan = calcRowSpan(li.fromM, li.toM);
              const t: any = li.payload;
              const label = `${t.name ?? "Шаблон"} • ${t.from ?? ""}–${t.to ?? ""}`;
              return (
                <button
                  key={`${dayIdx}-${li.id}`}
                  className="rounded-md border border-emerald-400/30 bg-emerald-500/20 backdrop-blur-[2px] px-1 py-0.5 overflow-hidden text-left shadow-sm hover:bg-emerald-500/30"
                  style={{ gridColumn: `${dayIdx + 2} / span 1`, gridRow: `${rowStart} / span ${rowSpan}`, ...laneStyles(li.lane, li.lanesTotal) }}
                  title={label}
                  onClick={() => setOpenTpl({ dayIdx, from: t.from ?? "10:00", to: t.to ?? "11:00" })}
                >
                  {renderTemplateBlockCommon(label)}
                </button>
              );
            })
          )}

          {/* Exceptions */}
          {exceptions.map((ex) => {
            const idx = days.findIndex((d) => dayKey(d) === ((ex as any).date ?? ""));
            if (idx < 0) return null;
            return (
              <button
                key={(ex as any).id}
                className="rounded bg-red-500/25 border border-red-400/30 text-[10px] px-1 overflow-hidden hover:bg-red-500/35"
                style={{
                  gridColumn: `${idx + 2} / span 1`,
                  gridRow: "2 / span 1",
                  alignSelf: "start",
                  height: SLOT_ROW_H - 4,
                  marginTop: 2,
                }}
                title={(ex as any).reason ?? "Исключение"}
                onClick={() => setOpenEx({ date: (ex as any).date })}
              >
                Исключение • {(ex as any).reason ?? "—"}
              </button>
            );
          })}

          {/* Reservations — при желании можно тоже разложить по lanes (аналогично templates) */}
          {reservations.map((r) => {
            const startISO = (r as any).start as string | undefined;
            const endISO = (r as any).end as string | undefined;
            if (!startISO) return null;

            const dateStr = startISO.slice(0, 10);
            const dayIdx = days.findIndex((d) => dayKey(d) === dateStr);
            if (dayIdx < 0) return null;

            const startMinLocal = localMinutesOf(startISO);
            const endMinLocal = localMinutesOf(endISO ?? startISO);
            if (startMinLocal === null) return null;

            let fromM = startMinLocal - HOUR_FROM * 60;
            let toM = (endMinLocal ?? startMinLocal + MINUTE_STEP) - HOUR_FROM * 60;
            if (toM <= 0 || fromM >= (HOUR_TO - HOUR_FROM) * 60) return null;
            fromM = Math.max(0, fromM);
            toM = Math.max(fromM + MINUTE_STEP, Math.min((HOUR_TO - HOUR_FROM) * 60, toM));

            const rowStart = toGridRowIndex(fromM);
            const rowSpan = calcRowSpan(fromM, toM);
            const timeLabel = new Date(startISO).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

            return (
              <a
                key={(r as any).id}
                href={(r as any).href ?? "#"}
                className="rounded bg-white/15 text-[10px] px-1 py-0.5 hover:bg-white/25 overflow-hidden"
                title={`Бронь ${timeLabel}`}
                style={{ gridColumn: `${dayIdx + 2} / span 1`, gridRow: `${rowStart} / span ${rowSpan}` }}
              >
                Бронь {timeLabel}
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  /* ====== render ====== */
  return (
    <>
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-2 md:p-3 select-none">
        {/* MOBILE */}
        <div className="grid gap-2 md:hidden">
          {days.map((d, i) => (
            <MobileDayCard key={dayKey(d)} day={d} dayIdx={i} />
          ))}
        </div>
        {/* DESKTOP */}
        <div className="hidden md:block">
          <DesktopWeekGrid />
        </div>
      </section>

      <ConflictsPanel conflicts={conflicts} />

      {/* модалки */}
      <SlotTemplateModal
        open={!!openTpl}
        initial={openTpl ?? undefined}
        onClose={() => setOpenTpl(null)}
        onSave={(payload) => {
          const id = `tpl-${Date.now()}`;
          onTemplatesChange([
            ...templates,
            {
              id,
              name: "Шаблон",
              dayOfWeek: payload.dayIdx,
              from: payload.from,
              to: payload.to,
              serviceId: filters.serviceId,
              resourceId: filters.resourceId,
              locationId: filters.locationId,
            } as AdminTemplate,
          ]);
          setOpenTpl(null);
        }}
      />

      <ExceptionModal
        open={!!openEx}
        date={openEx?.date}
        onClose={() => setOpenEx(null)}
        onSave={(ex) => {
          const next = [
            ...exceptions,
            { id: ex.id, date: ex.date, type: "blackout", active: true, reason: ex.reason } as AdminException,
          ];
          onExceptionsChange(next);
          setOpenEx(null);
        }}
      />
    </>
  );
}