// app/demo/admin/shop/products/components/ProductsFiltersBar.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/app/demo/(shared)/data/catalog/categories.food";

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

export default function ProductsFiltersBar() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const base = useMemo(() => getBaseFromPath(pathname), [pathname]);

  const qFromUrl = sp.get("q") || "";
  const status = sp.get("status") || "all";
  const cat = sp.get("category") || "all";
  const sort = sp.get("sort") || "updated_desc";

  const legacyHasMedia = sp.get("has_media");
  const iconFromUrl =
    (sp.get("icon") as "any" | "none" | null) ??
    (legacyHasMedia === "true" ? "any" : legacyHasMedia === "false" ? "none" : "any");
  const icon = iconFromUrl || "any";

  const [q, setQ] = useState(qFromUrl);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setQ(qFromUrl);
  }, [qFromUrl]);

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
      if (v == null || v === "" || v === "all") next.delete(k);
      else next.set(k, v);
    }
    router.push(`${base}/shop/products?${next.toString()}`);
  };

  const setIcon = (v: "any" | "none") => {
    setParams({ icon: v, has_media: v === "any" ? undefined : "false" });
  };

  useEffect(() => {
    const t = setTimeout(() => {
      if (q !== qFromUrl) setParams({ q });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const reset = () => router.push(`${base}/shop/products`);

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 backdrop-blur-sm overflow-x-hidden">
      <div className="grid gap-2 md:grid-cols-5 min-w-0">
        <label className="grid gap-1 md:col-span-2 min-w-0">
          <span className="text-xs opacity-70">Поиск (Ctrl/Cmd+K)</span>
          <div className="relative min-w-0">
            <input
              ref={inputRef}
              className="w-full max-w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 pr-8 text-sm outline-none"
              placeholder="Название / SKU / штрихкод"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setParams({ q });
                if (e.key === "Escape") setQ("");
              }}
              aria-label="Поиск по товарам"
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

        <label className="grid gap-1 min-w-0">
          <span className="text-xs opacity-70">Статус</span>
          <select
            className="w-full max-w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
            value={status}
            onChange={(e) => setParams({ status: e.target.value })}
            aria-label="Фильтр по статусу"
          >
            <option value="all">Все</option>
            <option value="active">Активен</option>
            <option value="draft">Черновик</option>
            <option value="archived">Архив</option>
          </select>
        </label>

        <label className="grid gap-1 min-w-0">
          <span className="text-xs opacity-70">Категория</span>
          <select
            className="w-full max-w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
            value={cat}
            onChange={(e) => setParams({ category: e.target.value })}
            aria-label="Фильтр по категории"
          >
            <option value="all">Все</option>
            <option value="none">Без категории</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 min-w-0">
          <span className="text-xs opacity-70">Иконка</span>
          <select
            className="w-full max-w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
            value={icon}
            onChange={(e) => setIcon(e.target.value as "any" | "none")}
            aria-label="Фильтр по иконке"
          >
            <option value="any">Любая</option>
            <option value="none">Без иконки</option>
          </select>
        </label>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 min-w-0">
        <div className="text-xs text-white/70 min-w-0">
          Подсказка: <kbd className="rounded bg-white/10 px-1">Enter</kbd> — поиск,{" "}
          <kbd className="rounded bg-white/10 px-1">Ctrl/Cmd+K</kbd> — фокус
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <label className="flex items-center gap-2 text-xs min-w-0">
            <span className="opacity-70 shrink-0">Сортировка</span>
            <select
              className="w-full sm:w-auto max-w-full rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs outline-none"
              value={sort}
              onChange={(e) => setParams({ sort: e.target.value })}
              aria-label="Сортировка"
            >
              <option value="updated_desc">Недавно изменённые</option>
              <option value="price_asc">Цена ↑</option>
              <option value="price_desc">Цена ↓</option>
              <option value="name_asc">Название A→Я</option>
              <option value="name_desc">Название Я→A</option>
            </select>
          </label>

          <button
            onClick={reset}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
          >
            Сбросить
          </button>
        </div>
      </div>
    </section>
  );
}