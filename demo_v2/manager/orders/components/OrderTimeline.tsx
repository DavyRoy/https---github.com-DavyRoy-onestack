"use client";

import { Clock, Plus } from "lucide-react";
import { useState, useId } from "react";
import { T } from "@/app/demo/manager/_parts/tokens";

export type TimelineItem = {
  id: string;
  time: string; // ISO
  text: string;
};

export default function OrderTimeline({
  items,
  onAddNote,
}: {
  items: TimelineItem[];
  onAddNote: (text: string) => void;
}) {
  const [note, setNote] = useState("");
  const inputId = useId();
  const listId = useId();

  const submit = () => {
    const t = note.trim();
    if (!t) return;
    onAddNote(t);
    setNote("");
  };

  return (
    <section className={T.card + " grid gap-3"} aria-labelledby="order-timeline-title">
      <h3 id="order-timeline-title" className="text-base font-semibold">
        История
      </h3>

      {/* Лента событий */}
      {items.length === 0 ? (
        <div
          className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white/70"
          role="status"
          aria-live="polite"
        >
          Событий пока нет.
        </div>
      ) : (
        <div className="relative pl-4">
          {/* вертикальная линия */}
          <div className="absolute left-2 top-0 bottom-0 w-px bg-white/12" aria-hidden />
          <ol id={listId} role="list" className="grid gap-2">
            {items.map((ev) => (
              <li
                key={ev.id}
                className="relative rounded-xl border border-white/10 bg-white/[0.04] p-2 pr-3"
              >
                {/* точка на линии */}
                <span
                  className="absolute -left-[6px] top-3 h-2 w-2 rounded-full bg-white/85 ring-2 ring-white/20"
                  aria-hidden
                />
                <div className="flex items-start gap-2">
                  <Clock width={14} height={14} className="mt-0.5 opacity-70" aria-hidden />
                  <div className="min-w-0">
                    <time
                      dateTime={ev.time}
                      className="text-xs text-white/60 tabular-nums"
                      aria-label={new Date(ev.time).toLocaleString("ru-RU")}
                      title={new Date(ev.time).toLocaleString("ru-RU")}
                    >
                      {new Date(ev.time).toLocaleString("ru-RU")}
                    </time>
                    <div className="text-sm break-words mt-0.5">{ev.text}</div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Добавление заметки */}
      <form
        className="mt-1 grid gap-2 grid-cols-1 sm:grid-cols-[1fr_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        aria-describedby={items.length ? listId : undefined}
      >
        <label htmlFor={inputId} className="sr-only">
          Новая заметка
        </label>
        <input
          id={inputId}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Добавить заметку…"
          className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Новая заметка"
        />
        <button
          type="submit"
          className="btn inline-flex items-center justify-center gap-1 min-h-[40px]"
          disabled={!note.trim()}
          aria-disabled={!note.trim()}
          title="Добавить заметку"
        >
          <Plus width={16} height={16} /> Добавить
        </button>
      </form>
    </section>
  );
}