// app/demo/admin/orders/components/AdminOrdersFiltersBar.tsx
"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
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
  const base = useMemo(() => (baseHref ?? getBaseFromPath(pathname)).replace(/\/$/, ""), [baseHref, pathname]);
  const [pending, startTransition] = useTransition();

  // URL → state
  const qFromUrl = sp.get("q") || "";
  const status = sp.get("status") || "all";
  const channel = sp.get("channel") || "all";

  const [q, setQ] = useState(qFromUrl);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // keep input in sync with URL
  useEffect(() => setQ(qFromUrl), [qFromUrl]);

  // Ctrl/Cmd+K — focus search
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

  // Builders
  const buildQS = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(Array.from(sp.entries()));
    for (const [k, v] of Object.entries(patch)) {
      if (!v || v === "all") next.delete(k);
      else next.set(k, v);
    }
    const nextStr = next.toString();
    const curStr = sp.toString();
    return nextStr === curStr ? null : nextStr;
  };

  const setParamsPush = (patch: Record<string, string | undefined>) => {
    const qs = buildQS(patch);
    if (qs === null) return;
    router.push(`${base}/orders?${qs}`);
  };

  const setParamsReplace = (patch: Record<string, string | undefined>) => {
    const qs = buildQS(patch);
    if (qs === null) return;
    startTransition(() => {
      router.replace(`${base}/orders?${qs}`, { scroll: false });
    });
  };

  // Debounced live search (replace to avoid history spam)
  useEffect(() => {
    const t = setTimeout(() => {
      if (q !== qFromUrl) setParamsReplace({ q });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const reset = () => router.replace(`${base}/orders`, { scroll: false });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q !== qFromUrl) setParamsPush({ q });
  };

  const ids = {
    search: "orders-filter-search",
    status: "orders-filter-status",
    channel: "orders-filter-channel",
  };

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 backdrop-blur-sm overflow-x-hidden"
      aria-label="Фильтры по заказам"
      aria-busy={pending}
    >
      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Поиск */}
        <label className="grid gap-1 sm:col-span-2 min-w-0" htmlFor={ids.search}>
          <span className="text-xs opacity-70">Поиск (Ctrl/Cmd+K)</span>
          <div className="relative min-w-0">
            <input
              id={ids.search}
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
        <label className="grid gap-1 min-w-0" htmlFor={ids.status}>
          <span className="text-xs opacity-70">Статус</span>
          <select
            id={ids.status}
            className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            value={status}
            onChange={(e) => setParamsPush({ status: e.target.value })}
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
        <label className="grid gap-1 min-w-0" htmlFor={ids.channel}>
          <span className="text-xs opacity-70">Канал</span>
          <select
            id={ids.channel}
            className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            value={channel}
            onChange={(e) => setParamsPush({ channel: e.target.value })}
            aria-label="Фильтр по каналу"
          >
            <option value="all">Все</option>
            <option value="online">Online</option>
            <option value="manager">Менеджер</option>
          </select>
        </label>

        {/* Bottom row */}
        <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap items-center justify-between gap-2">
          <div className="text-[11px] text-white/70 max-w-full sm:max-w-none">
            <span className="hidden xs:inline">Подсказка: </span>
            Enter — применить поиск, Esc — очистить.
          </div>
          <div className="flex items-center gap-2 w-full xs:w-auto">
            <button
              type="submit"
              className="flex-1 xs:flex-none rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              Найти
            </button>
            <button
              type="button"
              onClick={reset}
              className="flex-1 xs:flex-none rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              Сбросить
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}