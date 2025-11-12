"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { T } from "@/app/demo/manager/_parts/tokens";

/**
 * LeadTimeline — компактная временная шкала для лида.
 * — Доступность: role="list"/"listitem", live-region, aria-метки.
 * — UX: Ctrl/⌘+Enter — добавить; Esc — очистить; disable-кнопки, фокус-менеджмент.
 * — Визуал: ровные метки времени, аккуратные маркеры, безопасные hover/фокусы.
 * — Адаптив: ничего не «прыгает» на 393×852, удобные hit-area.
 */
export default function LeadTimeline({ leadId }: { leadId: string }) {
  const [items, setItems] = useState(() => [
    { id: "t1", time: "10:12", text: "Звонок менеджера" },
    { id: "t2", time: "11:05", text: "Письмо с КП" },
  ]);
  const [note, setNote] = useState("");
  const [counter, setCounter] = useState(3); // для уникальных id
  const inputRef = useRef<HTMLInputElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  const canAdd = useMemo(() => note.trim().length > 0, [note]);

  const nowHHMM = () =>
    new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  const add = () => {
    const text = note.trim();
    if (!text) {
      toast.warning("Введите текст заметки");
      return;
    }
    const id = "t" + counter;
    setCounter((n) => n + 1);
    const time = nowHHMM();
    setItems((prev) => [{ id, time, text }, ...prev]);
    setNote("");
    inputRef.current?.focus();
    toast.success("Запись добавлена (демо)");
    // подсказка скринридеру
    announce(`Добавлена запись в ${time}: ${text}`);
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    toast.info("Запись удалена (демо)");
    announce("Запись удалена");
  };

  // Хоткей: Ctrl/⌘+Enter — добавить, Esc — очистить
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && key === "enter") {
        e.preventDefault();
        add();
      } else if (key === "escape" && note) {
        e.preventDefault();
        setNote("");
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note]);

  const announce = (msg: string) => {
    if (!liveRef.current) return;
    liveRef.current.textContent = msg;
    // очистим сообщение, чтобы одинаковые события тоже зачитывались
    setTimeout(() => {
      if (liveRef.current) liveRef.current.textContent = "";
    }, 300);
  };

  return (
    <div className="grid gap-4" aria-label="Хронология лида">
      {/* live-region для озвучивания действий */}
      <div ref={liveRef} className="sr-only" role="status" aria-live="polite" />

      {/* Добавление заметки */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold">Добавить запись</div>
          <div className={"hidden sm:block text-[11px] " + T.dim}>
            Совет: <kbd className="rounded bg-white/10 px-1">Ctrl</kbd>/<kbd className="rounded bg-white/10 px-1">⌘</kbd>+<kbd className="rounded bg-white/10 px-1">Enter</kbd>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
          className="mt-2 flex gap-2"
          aria-labelledby="new-note-label"
        >
          <label id="new-note-label" htmlFor="lead-note" className="sr-only">
            Новая заметка
          </label>
          <input
            ref={inputRef}
            id="lead-note"
            className={T.input + " flex-1"}
            placeholder="Звонок, письмо, заметка…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            aria-label="Новая заметка"
          />
          <button
            type="submit"
            disabled={!canAdd}
            className="btn inline-flex items-center gap-1 disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-disabled={!canAdd}
          >
            <Plus width={16} height={16} aria-hidden />
            Добавить
          </button>
        </form>
      </section>

      {/* Список заметок */}
      <section className="relative pl-4">
        {/* вертикальная линия таймлайна */}
        <div className="absolute left-2 top-0 bottom-0 w-px bg-white/10" aria-hidden />
        <div className="grid gap-2" role="list" aria-label="Список заметок">
          {items.length === 0 ? (
            <div
              className={
                "rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 text-center text-sm " +
                T.dim
              }
            >
              Пока нет записей
            </div>
          ) : (
            items.map((it) => (
              <article
                key={it.id}
                role="listitem"
                className="group relative flex items-start justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 transition will-change-transform hover:-translate-y-0.5 hover:bg-white/[0.07] focus-within:ring-2 focus-within:ring-white/30"
                aria-labelledby={`note-${it.id}-text`}
              >
                {/* точка таймлайна */}
                <span
                  aria-hidden
                  className="absolute -left-2 top-3 h-2 w-2 rounded-full bg-white/85 ring-2 ring-white/20"
                />
                <div className="min-w-0">
                  <div className="text-xs opacity-70 tabular-nums">{it.time}</div>
                  <div id={`note-${it.id}-text`} className="truncate text-sm">
                    {it.text}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(it.id)}
                  className="rounded-md p-1 text-white/60 opacity-0 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 group-hover:opacity-100"
                  aria-label="Удалить запись"
                  title="Удалить запись"
                >
                  <Trash2 width={14} height={14} aria-hidden />
                </button>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}