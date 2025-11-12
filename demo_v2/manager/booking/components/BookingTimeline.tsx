// src/app/demo/manager/booking/components/BookingTimeline.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, MessageSquarePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export type TimelineItem = {
  id: string;
  ts: string; // ISO time
  kind: "status" | "note" | "system";
  text: string;
};

const T = {
  card: "rounded-2xl border border-white/15 bg-white/[0.05] p-4 backdrop-blur-sm",
  row: "relative pl-6",
  dot: "absolute left-0 top-2 h-2 w-2 rounded-full",
  time: "text-[11px] text-white/60",
  input:
    "w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30 placeholder:text-white/40",
  btn:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15",
  chip:
    "inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[11px] text-white/80",
};

const keyFor = (id: string) => `mgr_booking_timeline_${id}`;

export default function BookingTimeline({
  bookingId,
  initial,
}: {
  bookingId: string;
  initial?: TimelineItem[];
}) {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [note, setNote] = useState("");

  // Первичная загрузка: localStorage -> fallback к initial
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(keyFor(bookingId));
      if (raw) setItems(JSON.parse(raw));
      else setItems(initial || []);
    } catch {
      setItems(initial || []);
    }
  }, [bookingId, initial]);

  const persist = (next: TimelineItem[]) => {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(keyFor(bookingId), JSON.stringify(next));
    } catch {}
  };

  const addNote = () => {
    const text = note.trim();
    if (!text) return;
    const it: TimelineItem = {
      id: `n_${Date.now().toString(36)}`,
      ts: new Date().toISOString(),
      kind: "note",
      text,
    };
    setItems((prev) => {
      const next = [it, ...prev];
      persist(next);
      return next;
    });
    setNote("");
    toast.success("Заметка добавлена");
  };

  // Подписка на внешние события (без устаревшего замыкания)
  useEffect(() => {
    const onExternal = (e: Event) => {
      const ce = e as CustomEvent<{ bookingId: string; item: TimelineItem }>;
      if (!ce.detail || ce.detail.bookingId !== bookingId) return;
      setItems((prev) => {
        const next = [ce.detail.item, ...prev];
        persist(next);
        return next;
      });
    };
    if (typeof window !== "undefined") {
      window.addEventListener("mgr-booking-timeline", onExternal as EventListener);
      return () =>
        window.removeEventListener("mgr-booking-timeline", onExternal as EventListener);
    }
  }, [bookingId]); // persist — замыкание безопасно через setItems

  const pretty = (iso: string) =>
    new Date(iso).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Пока без реальной группировки — сохраняем API на будущее
  const grouped = useMemo(() => items, [items]);

  const kindTone = (k: TimelineItem["kind"]) =>
    k === "status"
      ? "bg-emerald-300"
      : k === "system"
      ? "bg-sky-300"
      : "bg-white"; // note

  const kindLabel = (k: TimelineItem["kind"]) =>
    k === "status" ? "Статус" : k === "system" ? "Система" : "Заметка";

  const clearAll = () => {
    setItems(() => {
      persist([]);
      return [];
    });
    toast.message("Таймлайн очищен (демо)");
  };

  return (
    <div className={T.card} aria-labelledby="timeline-title">
      <div className="flex items-center justify-between gap-2">
        <div className="text-base font-semibold" id="timeline-title">
          Активность
        </div>
        <div className="flex items-center gap-2">
          <span className={T.chip} aria-label="Режим таймлайна">
            <Clock width={12} height={12} /> Таймлайн
          </span>
          {grouped.length > 0 && (
            <button
              className={T.btn}
              onClick={clearAll}
              title="Очистить локальную историю (демо)"
            >
              <Trash2 width={14} height={14} /> Очистить
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 grid gap-2" role="list" aria-live="polite">
        {grouped.length === 0 ? (
          <div className="text-sm text-white/70">Пока нет событий. Добавьте заметку.</div>
        ) : (
          grouped.map((it) => (
            <div key={it.id} className={T.row} role="listitem">
              <span className={[T.dot, kindTone(it.kind)].join(" ")} aria-hidden />
              <div className="text-sm">
                <span className="mr-2 rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[11px] text-white/80">
                  {kindLabel(it.kind)}
                </span>
                {it.text}
              </div>
              <div className={T.time}>{pretty(it.ts)}</div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 grid gap-2">
        <label className="text-xs text-white/70" htmlFor="timeline-note">
          Добавить заметку
        </label>
        <input
          id="timeline-note"
          className={T.input}
          placeholder="Что сделано/нужно сделать…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNote()}
          aria-label="Поле заметки"
        />
        <div className="flex gap-2">
          <button className={T.btn} onClick={addNote}>
            <MessageSquarePlus width={16} height={16} /> Добавить
          </button>
        </div>
      </div>
    </div>
  );
}