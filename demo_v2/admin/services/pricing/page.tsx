// app/demo/admin/services/pricing/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ADMIN_SERVICES, SERVICE_CATEGORIES } from "@/app/demo/(shared)/data/services";
import PricingTable from "@/app/demo/admin/services/components/PricingTable";

/* -------------------- утилиты -------------------- */

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

function patchParams(sp: URLSearchParams, patch: Record<string, string | undefined>) {
  const next = new URLSearchParams(Array.from(sp.entries()));
  for (const [k, v] of Object.entries(patch)) {
    if (!v || v === "all") next.delete(k);
    else next.set(k, v);
  }
  return next;
}

function fmt(n: number) {
  return new Intl.NumberFormat("ru-RU").format(n);
}

function iso(date: Date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return iso(d);
}

/* -------------------- страница -------------------- */

export default function AdminServicesPricingPage() {
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);
  const sp = useSearchParams();
  const router = useRouter();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const q = sp.get("q")?.trim() ?? "";
  const category = sp.get("category") ?? "all";
  const status = sp.get("status") ?? "all";
  const changed = sp.get("changed") ?? "all";

  const { rows, found } = useMemo(() => {
    const changedFrom =
      changed === "7d" ? daysAgo(7) :
      changed === "30d" ? daysAgo(30) : null;

    let xs = [...ADMIN_SERVICES];

    if (q) {
      const needle = q.toLowerCase();
      xs = xs.filter((s) => {
        const inName = s.name.toLowerCase().includes(needle);
        const inSlug = (s.slug || "").toLowerCase().includes(needle);
        const inTags = (s.tags || []).some(t => t.toLowerCase().includes(needle));
        return inName || inSlug || inTags;
      });
    }
    if (status !== "all") {
      xs = xs.filter((s) => s.status === status);
    }
    if (category === "none") {
      xs = xs.filter((s) => !s.categoryId);
    } else if (category !== "all") {
      xs = xs.filter((s) => s.categoryId === category);
    }
    if (changedFrom) {
      xs = xs.filter((s) => s.changedAt && s.changedAt >= changedFrom);
    }

    // Массив строк для таблицы
    const mapped = xs.map((s) => ({
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

  const chips = useMemo(() => {
    const xs: Array<{ label: string; onClear: () => void }> = [];
    if (q) xs.push({ label: `Поиск: “${q}”`, onClear: () => setParams({ q: "" }) });
    if (category === "none") xs.push({ label: "Без категории", onClear: () => setParams({ category: "all" }) });
    if (category !== "all" && category !== "none") {
      const c = SERVICE_CATEGORIES.find((item) => item.id === category);
      xs.push({ label: `Категория: ${c?.name ?? category}`, onClear: () => setParams({ category: "all" }) });
    }
    if (status !== "all") {
      const map: Record<string, string> = { active: "Активна", draft: "Черновик", archived: "Архив" };
      xs.push({ label: `Статус: ${map[status] ?? status}`, onClear: () => setParams({ status: "all" }) });
    }
    if (changed !== "all") {
      xs.push({
        label: changed === "7d" ? "Цена за 7 дней" : "Цена за 30 дней",
        onClear: () => setParams({ changed: "all" }),
      });
    }
    return xs;
  }, [q, category, status, changed]);

  return (
    <div className="grid gap-5 md:gap-6">
      {/* Хедер */}
      <section className="admin-section border-white/12 bg-white/8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <nav className="text-xs text-white/60 truncate" aria-label="Хлебные крошки">
              <Link href={`${base}/services`} className="hover:underline">
                Услуги
              </Link>
              <span className="mx-1 opacity-50">/</span>
              <span className="text-white/80">Прайс-лист</span>
            </nav>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-white">Прайс-лист</h1>
            <p className="mt-1 text-xs md:text-sm text-white/70">
              Массовое редактирование цен. Найдено:{" "}
              <span className="text-white/85">{fmt(found)}</span>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="md:hidden rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              aria-expanded={mobileFiltersOpen}
              aria-controls="filters-panel"
            >
              {mobileFiltersOpen ? "Скрыть фильтры" : "Фильтры"}
            </button>
            <Link
              href={`${base}/services`}
              className="hidden md:inline-flex rounded-xl border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16"
            >
              К хабу
            </Link>
          </div>
        </div>
      </section>

      {/* Чипы активных фильтров */}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.label}
              onClick={chip.onClear}
              className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/10 px-2.5 py-1 text-xs text-white/80 transition hover:border-white/18 hover:bg-white/16"
              aria-label={`Снять фильтр: ${chip.label}`}
            >
              <span>{chip.label}</span>
              <span aria-hidden>×</span>
            </button>
          ))}
          <button
            onClick={() => setParams({ q: "", category: "all", status: "all", changed: "all" })}
            className="ml-auto rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs text-white/80 transition hover:border-white/18 hover:bg-white/16"
          >
            Сбросить все
          </button>
        </div>
      )}

      {/* Фильтры */}
      <section id="filters-panel" className="admin-section border-white/12 bg-white/8">
        <div className={`grid gap-2 ${mobileFiltersOpen ? "grid-cols-1" : "grid-cols-1 md:grid-cols-4"}`}>
          <label className={`grid gap-1 ${mobileFiltersOpen ? "" : "md:col-span-2"}`}>
            <span className="text-xs opacity-70">Поиск</span>
            <input
              defaultValue={q}
              onKeyDown={(e) => {
                if (e.key === "Enter") setParams({ q: (e.currentTarget as HTMLInputElement).value });
                if (e.key === "Escape") setParams({ q: "" });
              }}
              onBlur={(e) => setParams({ q: e.currentTarget.value })}
              placeholder="Название, /slug или тег…"
              className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              aria-label="Поиск по услугам"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs opacity-70">Категория</span>
            <select
              value={category}
              onChange={(e) => setParams({ category: e.target.value })}
              className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              aria-label="Фильтр по категории"
            >
              <option value="all">Все</option>
              <option value="none">Без категории</option>
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs opacity-70">Статус</span>
            <select
              value={status}
              onChange={(e) => setParams({ status: e.target.value })}
              className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              aria-label="Фильтр по статусу"
            >
              <option value="all">Все</option>
              <option value="active">Активна</option>
              <option value="draft">Черновик</option>
              <option value="archived">Архив</option>
            </select>
          </label>
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-xs">
            <span className="opacity-70">Изменения цены</span>
            <select
              value={changed}
              onChange={(e) => setParams({ changed: e.target.value })}
              className="rounded-lg border border-white/12 bg-white/10 px-2 py-1 text-xs text-white/80 outline-none transition focus-visible:ring-2 focus-visible:ring-white/30"
              aria-label="Фильтр по изменениям цены"
            >
              <option value="all">За весь период</option>
              <option value="7d">За 7 дней</option>
              <option value="30d">За 30 дней</option>
            </select>
          </label>

          <div className="flex gap-2">
            <button
              onClick={() => setParams({ q: "", category: "all", status: "all", changed: "all" })}
              className="rounded-xl border border-white/12 bg-white/10 px-3 py-1.5 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              Сбросить
            </button>
            <button
              type="button"
              className="md:hidden rounded-xl border border-white/12 bg-white/10 px-3 py-1.5 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16"
              onClick={() => setMobileFiltersOpen(false)}
            >
              Готово
            </button>
          </div>
        </div>
      </section>

      {/* Подсказка про горизонтальный скролл на мобиле */}
      <div className="sticky top-0 z-10 -mb-2 block md:hidden text-center">
        <span className="inline-block rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[11px] text-white/70">
          Таблица прокручивается по горизонтали →
        </span>
      </div>

      {/* Таблица (без дополнительной рамки вокруг, чтобы не дублировать бордер компонента) */}
      <PricingTable rows={rows} />

      {/* Кнопка «К хабу» на мобиле */}
      <div className="md:hidden">
        <Link
          href={`${base}/services`}
          className="block text-center rounded-xl border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16"
        >
          К хабу
        </Link>
      </div>
    </div>
  );
}