// src/app/demo/manager/booking/components/SlotPicker.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { searchSlots, Slot } from "../data/mockSlotSearch";
import { CalendarDays, RefreshCcw } from "lucide-react";

const T = {
  box: "grid gap-2 rounded-2xl border border-white/15 bg-white/[0.05] p-3",
  chip:
    "inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.07] px-2 py-0.5 text-[11px] text-white/80",
  btn:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30",
};

function parseYMD(ymd: string) {
  // "YYYY-MM-DD" -> Date (локально, без UTC-сдвига)
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export default function SlotPicker({
  serviceId,
  staffId,
  onPick,
}: {
  serviceId?: string;
  staffId?: string;
  onPick: (slot: Slot) => void;
}) {
  const [mode, setMode] = useState<"day" | "week">("week");
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const mountedRef = useRef(true);

  // группировка по дате (YYYY-MM-DD)
  const grouped = useMemo(() => {
    const map: Record<string, Slot[]> = {};
    slots.forEach((s) => {
      const d = s.startAt.slice(0, 10);
      (map[d] ||= []).push(s);
    });
    return Object.entries(map).sort(([a], [b]) => (a < b ? -1 : 1));
  }, [slots]);

  const reload = () => {
    setLoading(true);
    // имитация запроса
    const t = setTimeout(() => {
      const data = searchSlots({ serviceId, staffId });
      if (!mountedRef.current) return;
      setSlots(data);
      setLoading(false);
    }, 200);

    // на случай размонтирования до завершения таймера
    return () => clearTimeout(t);
  };

  useEffect(() => {
    mountedRef.current = true;
    const cleanup = reload();
    return () => {
      mountedRef.current = false;
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, staffId]);

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  const fmtWeekday = (ymd: string) =>
    parseYMD(ymd).toLocaleDateString("ru-RU", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });

  return (
    <div className={T.box}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={T.chip}>
            <CalendarDays width={12} height={12} /> Доступные слоты
          </span>
          <div
            className="rounded-xl border border-white/15 p-1"
            role="tablist"
            aria-label="Режим просмотра слотов"
          >
            <button
              className={`px-2 py-1 text-sm rounded-lg ${
                mode === "day" ? "bg-white text-black" : ""
              }`}
              role="tab"
              aria-selected={mode === "day"}
              aria-pressed={mode === "day"}
              onClick={() => setMode("day")}
            >
              День
            </button>
            <button
              className={`px-2 py-1 text-sm rounded-lg ${
                mode === "week" ? "bg-white text-black" : ""
              }`}
              role="tab"
              aria-selected={mode === "week"}
              aria-pressed={mode === "week"}
              onClick={() => setMode("week")}
            >
              Неделя
            </button>
          </div>
        </div>

        <button
          className={T.btn}
          onClick={reload}
          disabled={loading}
          aria-disabled={loading}
          title="Обновить слоты"
        >
          <RefreshCcw width={14} height={14} className={loading ? "animate-spin" : ""} />{" "}
          {loading ? "Обновляем…" : "Обновить"}
        </button>
      </div>

      {loading ? (
        <div className="mt-2 grid gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 rounded bg-white/10 animate-pulse" />
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <div className="text-sm text-white/70">Нет свободных слотов. Измените фильтры.</div>
      ) : mode === "week" ? (
        <div className="grid gap-3">
          {grouped.map(([date, arr]) => (
            <div
              key={date}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-2"
              aria-label={`Слоты на ${fmtWeekday(date)}`}
            >
              <div className="text-xs text-white/70">{fmtWeekday(date)}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {arr.map((s) => (
                  <button
                    key={s.id}
                    className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
                    onClick={() => onPick(s)}
                    aria-label={`Выбрать ${fmtTime(s.startAt)} • ${s.staffName}`}
                  >
                    {fmtTime(s.startAt)} • {s.staffName}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // режим "День" — ближайшие 12 слотов списком
        <div className="grid gap-2">
          {slots.slice(0, 12).map((s) => {
            const d = new Date(s.startAt);
            const label = `${d.toLocaleDateString("ru-RU", {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
            })} • ${fmtTime(s.startAt)} • ${s.staffName}`;
            return (
              <button
                key={s.id}
                className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-left hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
                onClick={() => onPick(s)}
                aria-label={`Выбрать ${label}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}