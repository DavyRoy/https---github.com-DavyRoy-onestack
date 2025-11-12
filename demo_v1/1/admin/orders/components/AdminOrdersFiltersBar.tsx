"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

export default function AdminOrdersFiltersBar({ baseHref }: { baseHref?: string }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const base = useMemo(() => (baseHref ?? getBaseFromPath(pathname)), [baseHref, pathname]);

  const qFromUrl = sp.get("q") || "";
  const status = sp.get("status") || "all";
  const channel = sp.get("channel") || "all";

  const [q, setQ] = useState(qFromUrl);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => setQ(qFromUrl), [qFromUrl]);

  // хоткей — Ctrl/Cmd+K
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

  const setParams = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(Array.from(sp.entries()));
    for (const [k, v] of Object.entries(patch)) {
      if (!v || v === "all") next.delete(k);
      else next.set(k, v);
    }
    router.push(`${base}/orders?${next.toString()}`);
  };

  // дебаунс поиска — 400мс
  useEffect(() => {
    const t = setTimeout(() => {
      if (q !== qFromUrl) setParams({ q });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const reset = () => router.push(`${base}/orders`);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q !== qFromUrl) setParams({ q });
  };

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 backdrop-blur-sm"
      aria-label="Фильтры по заказам"
    >
      {/* форма нужна, чтобы Enter с мобильной клавиатуры сразу применял поиск */}
      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Поиск */}
        <label className="grid gap-1 sm:col-span-2">
          <span className="text-xs opacity-70">Поиск (Ctrl/Cmd+K)</span>
          <div className="relative min-w-0">
            <input
              ref={inputRef}
              className="w-full min-w-0 rounded-xl border border-white/15 bg-white/10 px-3 py-2 pr-8 text-sm outline-none placeholder:text-white/40"
              placeholder="ID, клиент, email, телефон…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setQ("");
              }}
              aria-label="Поиск по заказам"
              inputMode="search"
              autoComplete="off"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute inset-y-0 right-1 my-1 rounded-lg px-2 text-sm text-white/70 hover:bg-white/10"
                aria-label="Очистить поиск"
                title="Очистить"
              >
                ✕
              </button>
            )}
          </div>
        </label>

        {/* Статус */}
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Статус</span>
          <select
            className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
            value={status}
            onChange={(e) => setParams({ status: e.target.value })}
            aria-label="Фильтр по статусу"
          >
            <option value="all">Все</option>
            <option value="new">Новый</option>
            <option value="paid">Оплачен</option>
            <option value="shipped">Отправлен</option>
            <option value="done">Завершён</option>
            <option value="cancelled">Отменён</option>
          </select>
        </label>

        {/* Канал */}
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Канал</span>
          <select
            className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
            value={channel}
            onChange={(e) => setParams({ channel: e.target.value })}
            aria-label="Фильтр по каналу"
          >
            <option value="all">Все</option>
            <option value="online">Online</option>
            <option value="manager">Менеджер</option>
          </select>
        </label>

        {/* Низ: подсказка + сброс (на мобильных уйдёт на новую строку) */}
        <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap items-center justify-between gap-2">
          <div className="text-[11px] text-white/70 max-w-full sm:max-w-none">
            <span className="hidden xs:inline">Подсказка: </span>
            Enter — применить поиск, Esc — очистить.
          </div>
          <div className="flex items-center gap-2">
            {/* на случай, если нужна кнопка «Найти» для мобилок */}
            <button
              type="submit"
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
            >
              Найти
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
            >
              Сбросить
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}