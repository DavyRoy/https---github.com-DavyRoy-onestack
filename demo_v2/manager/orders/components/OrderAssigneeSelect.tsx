"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";

export type Manager = { id: string; name: string };

export default function OrderAssigneeSelect({
  value,
  managers,
  onChange,
}: {
  value?: string | null;
  managers: Manager[];
  onChange: (managerId: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const labelId = useId();
  const listboxId = useId();

  const items = useMemo<({ id: string | null; name: string })[]>(
    () => [{ id: null, name: "— Не назначен —" }, ...managers],
    [managers]
  );

  const selectedIndex = useMemo(
    () => Math.max(0, items.findIndex((m) => m.id === (value ?? null))),
    [items, value]
  );

  const [activeIndex, setActiveIndex] = useState<number>(selectedIndex);
  useEffect(() => setActiveIndex(selectedIndex), [selectedIndex]);

  // Закрытие по клику вне / Esc
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const commit = (idx: number) => {
    const picked = items[idx];
    onChange(picked.id);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>
  ) => {
    if (!open) {
      // Открываем по Enter/Space/ArrowDown
      if (e.currentTarget === triggerRef.current) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setOpen(true);
          setTimeout(() => listRef.current?.focus(), 0);
        }
      }
      return;
    }

    // Навигация внутри списка
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(items.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(items.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      commit(activeIndex);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  // Автопрокрутка активного пункта
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLButtonElement>(
      `[data-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const current = items[selectedIndex];

  return (
    <div className="grid gap-2">
      <div id={labelId} className="text-sm font-medium text-white">
        Ответственный
      </div>

      {/* Обёртка для позиционирования меню */}
      <div className="relative">
        {/* Триггер */}
        <button
          ref={triggerRef}
          type="button"
          className={[
            T.input,
            "w-full text-left",
            "flex items-center justify-between gap-2",
            "min-h-[40px]", // комфортная хит-зона на мобиле
          ].join(" ")}
          aria-labelledby={labelId}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={onKeyDown}
        >
          <span className="truncate text-white">
            {current?.name ?? "Не назначен"}
          </span>
          <ChevronDown width={16} height={16} className="opacity-80" />
        </button>

        {/* Меню */}
        {open && (
          <div
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={labelId}
            tabIndex={-1}
            onKeyDown={onKeyDown}
            className={[
              "absolute z-20 mt-1 rounded-xl border border-white/15",
              "bg-black/65 backdrop-blur",
              "p-1 text-sm text-white shadow-[0_18px_48px_-28px_rgba(0,0,0,0.8)]",
              "max-h-[264px] overflow-auto",
              "left-0 right-0", // растягиваем под триггер на мобиле
            ].join(" ")}
          >
            {items.map((m, idx) => {
              const selected = idx === selectedIndex;
              const active = idx === activeIndex;
              return (
                <button
                  key={m.id ?? "none"}
                  type="button"
                  data-index={idx}
                  role="option"
                  aria-selected={selected}
                  className={[
                    "w-full text-left rounded-lg px-2 py-2",
                    "flex items-center justify-between gap-2",
                    active ? "bg-white/15" : "hover:bg-white/10",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                  ].join(" ")}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => commit(idx)}
                >
                  <span className="truncate">{m.name}</span>
                  {selected && (
                    <Check
                      width={16}
                      height={16}
                      className="shrink-0 text-white/80"
                      aria-hidden
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}