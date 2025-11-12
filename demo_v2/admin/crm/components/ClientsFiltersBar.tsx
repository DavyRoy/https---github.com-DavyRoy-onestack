"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ClientsFiltersBar() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // -------- Локальное состояние и синхронизация из URL --------
  const [q, setQ] = React.useState<string>(sp.get("q") ?? "");
  const [isComposing, setIsComposing] = React.useState(false); // IME-композиция
  const qFromUrl = sp.get("q") ?? "";

  React.useEffect(() => {
    // если значение в URL поменялось (например, навигация назад) — синхронизируем
    setQ(qFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qFromUrl]);

  // -------- Применение фильтров к URL --------
  const apply = React.useCallback(
    (nextQ: string) => {
      const next = new URLSearchParams(sp.toString());
      const val = nextQ.trim();
      if (val) next.set("q", val);
      else next.delete("q");

      // при изменении фильтров — сбрасываем пагинацию и сортировку
      ["page"].forEach((k) => next.delete(k));

      const url = next.toString() ? `${pathname}?${next.toString()}` : pathname;
      router.replace(url);
    },
    [pathname, router, sp]
  );

  // -------- Автоприменение с дебаунсом --------
  React.useEffect(() => {
    if (isComposing) return; // во время IME-композиции не триггерим
    if ((q ?? "") === qFromUrl) return;

    const h = setTimeout(() => {
      // Автоприменение только если пользователь сделал паузу и строка заметно изменилась
      apply(q);
    }, 450);

    return () => clearTimeout(h);
  }, [q, qFromUrl, apply, isComposing]);

  // -------- Сброс всех фильтров --------
  const reset = React.useCallback(() => {
    const next = new URLSearchParams(sp.toString());
    ["q", "tag", "segment", "created", "active", "churn", "sort", "page"].forEach((k) =>
      next.delete(k)
    );
    setQ("");
    const url = next.toString() ? `${pathname}?${next.toString()}` : pathname;
    router.replace(url);
  }, [pathname, router, sp]);

  // -------- Хоткей для быстрого фокуса (Cmd/Ctrl + K) --------
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isCmdK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      if (isCmdK) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const unchanged = (q ?? "") === qFromUrl;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        apply(q);
      }}
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 flex flex-col sm:flex-row sm:items-center gap-2"
      role="search"
      aria-label="Фильтры клиентов"
    >
      <div className="relative flex-1 min-w-[220px]">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="Поиск: имя / e-mail / телефон"
          className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm pr-16"
          aria-label="Строка поиска клиентов"
          inputMode="search"
        />
        {/* Кнопка очистки */}
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-white/15 px-2 py-1 text-xs hover:bg-white/10"
            aria-label="Очистить запрос"
            title="Очистить"
          >
            Очистить
          </button>
        )}
        {/* Подсказка хоткея */}
        <span
          aria-hidden
          className="pointer-events-none absolute right-[86px] top-1/2 -translate-y-1/2 hidden sm:inline-flex select-none items-center rounded border border-white/15 px-1.5 py-0.5 text-[10px] text-white/60"
          title="Быстрый фокус поиска"
        >
          ⌘K
        </span>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-3 py-2 text-sm rounded-lg border border-white/20 hover:bg-white/10 disabled:opacity-50"
          disabled={unchanged}
          aria-disabled={unchanged}
          title="Применить фильтр"
        >
          Применить
        </button>
        <button
          type="button"
          onClick={reset}
          className="px-3 py-2 text-sm rounded-lg border border-white/20 hover:bg-white/10"
          title="Сбросить все фильтры"
        >
          Сброс
        </button>
      </div>
    </form>
  );
}