"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { T } from "@/app/demo/manager/_parts/tokens";
import { Search, X } from "lucide-react";

const SEGMENTS = [
  { id: "all", label: "Все" },
  { id: "VIP", label: "VIP" },
  { id: "retail", label: "Ритейл" },
  { id: "b2b", label: "B2B" },
  { id: "salon", label: "Салоны" },
];

export default function FiltersBar({
  query,
  onQuery,
  segment,
  onSegment,
  pageSize,
  onPageSize,
  /** опционально: показать кнопку сброса всех фильтров */
  onReset,
}: {
  query: string;
  onQuery: (v: string) => void;
  segment: string;
  onSegment: (v: string) => void;
  pageSize: number;
  onPageSize: (n: number) => void;
  onReset?: () => void;
}) {
  const qid = useId();
  const sizes = useMemo(() => [10, 25, 50], []);
  const inputRef = useRef<HTMLInputElement>(null);
  const segmentsRef = useRef<HTMLDivElement>(null);

  // локальный input + дебаунс, чтобы на мобиле не "дёргать" список каждую букву
  const [qInput, setQInput] = useState(query);
  useEffect(() => setQInput(query), [query]);

  useEffect(() => {
    const t = setTimeout(() => {
      // не триггерим лишний вызов, если ничего не поменялось
      if (qInput !== query) onQuery(qInput);
    }, 300);
    return () => clearTimeout(t);
  }, [qInput]); // eslint-disable-line react-hooks/exhaustive-deps

  // Глобальные хоткеи: Ctrl/⌘+K — фокус на поиск
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Клавиатура по сегментам (стрелки ←/→)
  const onSegmentsKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const buttons = segmentsRef.current?.querySelectorAll<HTMLButtonElement>("button[data-seg]");
    if (!buttons || buttons.length === 0) return;

    const currentIdx = Array.from(buttons).findIndex((b) => b.getAttribute("data-active") === "true");
    let nextIdx = currentIdx;
    if (e.key === "ArrowRight") nextIdx = Math.min(buttons.length - 1, currentIdx + 1);
    if (e.key === "ArrowLeft") nextIdx = Math.max(0, currentIdx - 1);
    buttons[nextIdx]?.focus();
    const nextId = buttons[nextIdx]?.getAttribute("data-seg");
    if (nextId && nextId !== segment) onSegment(nextId);
  };

  return (
    <div
      className="
        grid gap-2
        md:grid-cols-[1fr_auto_auto]
        items-center
      "
      role="toolbar"
      aria-label="Фильтры таблицы клиентов"
    >
      {/* Поиск */}
      <div className="relative">
        <label htmlFor={qid} className="sr-only">
          Поиск по клиентам
        </label>
        <input
          ref={inputRef}
          id={qid}
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && qInput) {
              e.preventDefault();
              setQInput("");
              // мгновенно синхронизируем внешнее состояние для UX
              onQuery("");
            }
          }}
          placeholder="Поиск по имени, e-mail или телефону…"
          className={T.input + " pl-9 pr-8"}
          aria-label="Поиск по имени, e-mail или телефону"
          inputMode="search"
        />
        <Search
          width={16}
          height={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-70"
          aria-hidden
        />
        {qInput ? (
          <button
            type="button"
            onClick={() => {
              setQInput("");
              onQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/70 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label="Очистить поиск"
          >
            <X width={14} height={14} />
          </button>
        ) : null}
      </div>

      {/* Сегменты (горизонтальная лента на мобиле) */}
      <div
        ref={segmentsRef}
        className="
          -mx-1 flex items-center gap-2 overflow-x-auto px-1 scrollbar-none
          md:mx-0
        "
        role="group"
        aria-label="Фильтр по сегментам"
        onKeyDown={onSegmentsKey}
      >
        {/* небольшой «буфер» по краям для комфортного скролла пальцем */}
        <div className="w-1 shrink-0 md:hidden" aria-hidden />
        {SEGMENTS.map((s) => {
          const active = segment === s.id;
          return (
            <button
              key={s.id}
              type="button"
              data-seg={s.id}
              data-active={active ? "true" : "false"}
              onClick={() => onSegment(s.id)}
              className={`whitespace-nowrap rounded-xl border px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                active
                  ? "border-white bg-white text-black"
                  : "border-white/15 bg-white/[0.06] hover:bg-white/[0.1]"
              }`}
              aria-pressed={active}
            >
              {s.label}
            </button>
          );
        })}
        <div className="w-1 shrink-0 md:hidden" aria-hidden />
      </div>

      {/* Размер страницы:
          - на мобиле — компактный select
          - на десктопе — прежние кнопки */}
      <div className="flex items-center justify-end gap-2">
        <span className={"hidden md:inline text-xs " + T.dim}>На странице:</span>

        {/* mobile select */}
        <label className="inline-flex items-center gap-2 text-xs md:hidden">
          <span className={T.dim}>На странице</span>
          <select
            className={T.input + " h-9 w-[84px] px-2 py-1 text-sm"}
            value={pageSize}
            onChange={(e) => onPageSize(Number(e.target.value))}
            aria-label="Количество строк на странице"
          >
            {sizes.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        {/* desktop buttons */}
        <div
          className="hidden md:inline-flex items-center gap-2"
          role="group"
          aria-label="Количество строк на странице"
        >
          {sizes.map((n) => {
            const active = pageSize === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => onPageSize(n)}
                className={`rounded-xl border px-2.5 py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                  active
                    ? "border-white bg-white text-black"
                    : "border-white/15 bg-white/[0.06] hover:bg-white/[0.1]"
                }`}
                aria-pressed={active}
              >
                {n}
              </button>
            );
          })}
        </div>

        {/* Сброс фильтров (опционально) */}
        {onReset && (
          <button
            type="button"
            onClick={() => {
              onReset();
              inputRef.current?.focus();
            }}
            className="hidden md:inline-flex rounded-xl border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs text-white/85 transition hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Сбросить
          </button>
        )}
      </div>
    </div>
  );
}