// app/demo/admin/services/pricing/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ADMIN_SERVICES, SERVICE_CATEGORIES } from "@/app/demo/(shared)/data/services";
import PricingTable from "@/app/demo/admin/services/components/PricingTable";

/** определить базовый префикс (admin/manager/user) из пути */
function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

/** утилита обновления query-параметров */
function patchParams(sp: URLSearchParams, patch: Record<string, string | undefined>) {
  const next = new URLSearchParams(Array.from(sp.entries()));
  for (const [k, v] of Object.entries(patch)) {
    if (!v || v === "all") next.delete(k);
    else next.set(k, v);
  }
  return next;
}

/** красивый вывод чисел */
function fmt(n: number) {
  return new Intl.NumberFormat("ru-RU").format(n);
}

export default function AdminServicesPricingPage() {
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);
  const sp = useSearchParams();
  const router = useRouter();

  // mobile: свернуть/развернуть фильтры
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // query-параметры
  const q = sp.get("q")?.trim() ?? "";
  const category = sp.get("category") ?? "all";   // id | "none" | "all"
  const status = sp.get("status") ?? "all";       // active|draft|archived|all
  const changed = sp.get("changed") ?? "all";     // 7d|30d|all

  // фильтрация + подготовка строк для таблицы
  const { rows, found } = useMemo(() => {
    const changedFrom =
      changed === "7d" ? "2025-09-01" :
      changed === "30d" ? "2025-08-12" : null; // детерминированные границы под мок-дату

    let xs = [...ADMIN_SERVICES];

    if (q) {
      const needle = q.toLowerCase();
      xs = xs.filter(s => s.name.toLowerCase().includes(needle));
    }
    if (status !== "all") {
      xs = xs.filter(s => s.status === status);
    }
    if (category === "none") {
      xs = xs.filter(s => !s.categoryId);
    } else if (category !== "all") {
      xs = xs.filter(s => s.categoryId === category);
    }
    if (changedFrom) {
      xs = xs.filter(s => s.changedAt && s.changedAt >= changedFrom);
    }

    const mapped = xs.map(s => ({
      id: s.id,
      name: s.name,
      basePrice: s.price,
      promoPrice: null as number | null,
      promoFrom: "",
      promoTo: "",
    }));

    return { rows: mapped, found: xs.length };
  }, [q, category, status, changed]);

  const setParams = (patch: Record<string, string | undefined>) => {
    const next = patchParams(sp, patch);
    router.push(`${base}/services/pricing?${next.toString()}`);
  };

  // chips-резюме активных фильтров
  const chips = useMemo(() => {
    const xs: Array<{ label: string; onClear: () => void }> = [];
    if (q) xs.push({ label: `Поиск: “${q}”`, onClear: () => setParams({ q: "" }) });
    if (category === "none") xs.push({ label: "Без категории", onClear: () => setParams({ category: "all" }) });
    if (category !== "all" && category !== "none") {
      const c = SERVICE_CATEGORIES.find(c => c.id === category);
      xs.push({ label: `Категория: ${c?.name ?? category}`, onClear: () => setParams({ category: "all" }) });
    }
    if (status !== "all") {
      const map: Record<string, string> = { active: "Активна", draft: "Черновик", archived: "Архив" };
      xs.push({ label: `Статус: ${map[status] ?? status}`, onClear: () => setParams({ status: "all" }) });
    }
    if (changed !== "all") {
      xs.push({ label: changed === "7d" ? "Цена за 7 дней" : "Цена за 30 дней", onClear: () => setParams({ changed: "all" }) });
    }
    return xs;
  }, [q, category, status, changed]);

  return (
    <div className="grid gap-4 md:gap-6">
      {/* Хедер + хлебные крошки */}
      <header className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <nav className="text-xs text-white/60">
            <Link href={`${base}/services`} className="hover:underline">Услуги</Link>
            <span className="mx-1">/</span>
            <span className="text-white/80">Прайс-лист</span>
          </nav>
          <h1 className="mt-1 text-xl md:text-3xl font-semibold tracking-tight">
            Прайс-лист
          </h1>
          <p className="mt-1 text-xs md:text-sm text-white/70">
            Массовое редактирование цен (демо). Найдено: <span className="text-white/85">{fmt(found)}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="md:hidden rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"
            onClick={() => setMobileFiltersOpen(v => !v)}
            aria-expanded={mobileFiltersOpen}
            aria-controls="filters-panel"
          >
            {mobileFiltersOpen ? "Скрыть фильтры" : "Фильтры"}
          </button>
          <Link
            href={`${base}/services`}
            className="hidden md:inline-flex rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            К хабу
          </Link>
        </div>
      </header>

      {/* Чипы активных фильтров */}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((c, i) => (
            <button
              key={i}
              onClick={c.onClear}
              className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs hover:bg-white/15"
              title="Сбросить фильтр"
            >
              <span>{c.label}</span>
              <span aria-hidden>×</span>
            </button>
          ))}
          <button
            onClick={() => setParams({ q: "", category: "all", status: "all", changed: "all" })}
            className="ml-auto rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs hover:bg-white/15"
          >
            Сбросить все
          </button>
        </div>
      )}

      {/* Панель фильтров */}
      <section
        id="filters-panel"
        className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4"
      >
        {/* Мобильный столбец / десктопная сетка */}
        <div className={`grid gap-2 ${mobileFiltersOpen ? "grid-cols-1" : "grid-cols-1 md:grid-cols-4"}`}>
          {/* Поиск */}
          <label className={`grid gap-1 ${mobileFiltersOpen ? "" : "md:col-span-2"}`}>
            <span className="text-xs opacity-70">Поиск</span>
            <input
              defaultValue={q}
              onKeyDown={(e) => {
                if (e.key === "Enter") setParams({ q: (e.currentTarget as HTMLInputElement).value });
                if (e.key === "Escape") setParams({ q: "" });
              }}
              onBlur={(e) => setParams({ q: e.currentTarget.value })}
              placeholder="Название услуги…"
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
            />
          </label>

          {/* Категория */}
          <label className="grid gap-1">
            <span className="text-xs opacity-70">Категория</span>
            <select
              value={category}
              onChange={(e) => setParams({ category: e.target.value })}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
            >
              <option value="all">Все</option>
              <option value="none">Без категории</option>
              {SERVICE_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>

          {/* Статус */}
          <label className="grid gap-1">
            <span className="text-xs opacity-70">Статус</span>
            <select
              value={status}
              onChange={(e) => setParams({ status: e.target.value })}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
            >
              <option value="all">Все</option>
              <option value="active">Активна</option>
              <option value="draft">Черновик</option>
              <option value="archived">Архив</option>
            </select>
          </label>
        </div>

        {/* Низ панели: период изменений + кнопки */}
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-xs">
            <span className="opacity-70">Изменения цены</span>
            <select
              value={changed}
              onChange={(e) => setParams({ changed: e.target.value })}
              className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs outline-none"
              title="За период"
            >
              <option value="all">За весь период</option>
              <option value="7d">За 7 дней</option>
              <option value="30d">За 30 дней</option>
            </select>
          </label>

          <div className="flex gap-2">
            <button
              onClick={() => setParams({ q: "", category: "all", status: "all", changed: "all" })}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
              title="Сбросить фильтры"
            >
              Сбросить
            </button>
            {/* на мобильных — кнопка закрыть фильтры */}
            <button
              type="button"
              className="md:hidden rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm"
              onClick={() => setMobileFiltersOpen(false)}
            >
              Готово
            </button>
          </div>
        </div>
      </section>

      {/* Хинт прокрутки на небольших экранах */}
      <div className="sticky top-0 z-10 -mb-2 block md:hidden text-center">
        <span className="inline-block rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] text-white/70">
          Таблица прокручивается по горизонтали →
        </span>
      </div>

      {/* Таблица цен (массовое редактирование — демо) */}
      <div className="overflow-x-auto rounded-2xl border border-white/15 bg-white/[0.05]">
        {/* PricingTable сам рендерит таблицу; эта обёртка даёт скролл на мобильных */}
        <PricingTable rows={rows} />
      </div>

      {/* Кнопка «К хабу» — дубль внизу для мобильных, чтобы не тянуться вверх */}
      <div className="md:hidden">
        <Link
          href={`${base}/services`}
          className="block text-center rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
        >
          К хабу
        </Link>
      </div>
    </div>
  );
}