// app/demo/admin/shop/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useTransition, useId, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ShopHero from "./components/ShopHero";
import ShopStats from "./components/ShopStats";
import QuickActions from "./components/QuickActions";

type Period = "7d" | "30d" | "q" | "y";
type Channel = "all" | "online" | "manager";
type StockFilter = "all" | "in" | "low" | "out";
type StatusFilter = "all" | "active" | "draft" | "archived";

const DEFAULTS = {
  period: "30d" as Period,
  channel: "all" as Channel,
  stock: "all" as StockFilter,
  status: "all" as StatusFilter,
  q: "",
};

const UI = {
  card: "admin-section rounded-2xl border border-white/12 bg-white/8 p-4 md:p-6 backdrop-blur-sm",
  btn: "inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
  select: "rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none transition focus-visible:ring-2 focus-visible:ring-white/40",
  chip: "rounded-xl border border-white/12 bg-white/10 px-3 py-1.5 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16 data-[active=true]:bg-white data-[active=true]:text-black",
  linkBtn: "rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
  textInput: "rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-white/40",
};

const PERIODS: Array<{ id: Period; label: string }> = [
  { id: "7d", label: "7д" },
  { id: "30d", label: "30д" },
  { id: "q", label: "Квартал" },
  { id: "y", label: "Год" },
];

const CHANNELS: Array<{ id: Channel; label: string }> = [
  { id: "all", label: "Все каналы" },
  { id: "online", label: "Online" },
  { id: "manager", label: "Менеджер" },
];

const STOCKS: Array<{ id: StockFilter; label: string }> = [
  { id: "all", label: "Любой остаток" },
  { id: "in", label: "В наличии" },
  { id: "low", label: "Мало" },
  { id: "out", label: "Нет" },
];

const STATUSES: Array<{ id: StatusFilter; label: string }> = [
  { id: "all", label: "Любой статус" },
  { id: "active", label: "Активные" },
  { id: "draft", label: "Черновики" },
  { id: "archived", label: "Архив" },
];

const ALLOWED = {
  period: new Set(PERIODS.map((x) => x.id)),
  channel: new Set(CHANNELS.map((x) => x.id)),
  stock: new Set(STOCKS.map((x) => x.id)),
  status: new Set(STATUSES.map((x) => x.id)),
};

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

export default function AdminShopHubPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);
  const [pending, startTransition] = useTransition();

  const searchId = useId();

  // нормализация значения по whitelist (если мусор в URL — дефолт)
  const coerce = useCallback(
    <K extends keyof typeof DEFAULTS>(key: K, allowed?: Set<any>) => {
      const raw = sp.get(key);
      if (key === "q") return (raw ?? DEFAULTS.q).trim();
      if (!raw) return DEFAULTS[key];
      return allowed?.has(raw) ? (raw as any) : DEFAULTS[key];
    },
    [sp]
  );

  const params = useMemo(() => {
    return {
      period: coerce("period", ALLOWED.period),
      channel: coerce("channel", ALLOWED.channel),
      stock: coerce("stock", ALLOWED.stock),
      status: coerce("status", ALLOWED.status),
      q: coerce("q"),
    } as {
      period: Period; channel: Channel; stock: StockFilter; status: StatusFilter; q: string;
    };
  }, [coerce]);

  // Пишем в URL только отличия от дефолта; без лишнего '?' в конце
  const setParam = (key: keyof typeof DEFAULTS, value: string) => {
    const current = params[key] as unknown as string;
    if (current === value) return; // не дергаем роутер, если ничего не меняется

    const next = new URLSearchParams(Array.from(sp.entries()));
    const trimmed = key === "q" ? value.trim() : value;

    const isDefault =
      (key === "period" && trimmed === DEFAULTS.period) ||
      (key === "channel" && trimmed === DEFAULTS.channel) ||
      (key === "stock" && trimmed === DEFAULTS.stock) ||
      (key === "status" && trimmed === DEFAULTS.status) ||
      (key === "q" && trimmed === DEFAULTS.q);

    if (isDefault) next.delete(key);
    else next.set(key, trimmed);

    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `${base}/shop?${qs}` : `${base}/shop`, { scroll: false });
    });
  };

  const resetAll = () => {
    startTransition(() => {
      router.replace(`${base}/shop`, { scroll: false });
    });
  };

  return (
    <>
      <section
        className={UI.card}
        aria-labelledby="shop-page-title"
        aria-live="polite"
        aria-busy={pending}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <span className="admin-chip mb-2 bg-white/12 text-white/75">Коммерция</span>
            <h1 id="shop-page-title" className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
              Магазин
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-white/70">
              Управляйте товарами, категориями, ценами и остатками. Фильтры влияют на все виджеты.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`${base}/shop/products/new`} className={UI.btn} prefetch={false}>
              Создать товар
            </Link>
            <button
              type="button"
              className={UI.linkBtn}
              onClick={resetAll}
              disabled={pending}
              aria-disabled={pending}
              title="Сбросить фильтры"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>

        {/* Фильтры */}
        <div className="mt-4 grid gap-2 md:grid-cols-4">
          {/* Период: чипы */}
          <div className="grid gap-1">
            <span className="text-xs opacity-70">Период</span>
            <div className="flex flex-wrap gap-2 text-white/80">
              {PERIODS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setParam("period", p.id)}
                  className={UI.chip}
                  data-active={params.period === p.id}
                  aria-pressed={params.period === p.id}
                  disabled={pending}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Канал */}
          <label className="grid gap-1">
            <span className="text-xs opacity-70">Канал</span>
            <select
              value={params.channel}
              onChange={(e) => setParam("channel", e.target.value)}
              className={UI.select}
              disabled={pending}
              aria-label="Фильтр по каналу продаж"
            >
              {CHANNELS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          {/* Остаток */}
          <label className="grid gap-1">
            <span className="text-xs opacity-70">Остаток</span>
            <select
              value={params.stock}
              onChange={(e) => setParam("stock", e.target.value)}
              className={UI.select}
              disabled={pending}
              aria-label="Фильтр по остаткам"
            >
              {STOCKS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          {/* Статус */}
          <label className="grid gap-1">
            <span className="text-xs opacity-70">Статус товара</span>
            <select
              value={params.status}
              onChange={(e) => setParam("status", e.target.value)}
              className={UI.select}
              disabled={pending}
              aria-label="Фильтр по статусу товара"
            >
              {STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Поиск */}
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          <label className="grid gap-1" htmlFor={searchId}>
            <span className="text-xs opacity-70">Поиск по товарам</span>
            <div className="flex gap-2">
              <input
                id={searchId}
                type="search"
                placeholder="Название, SKU, категория…"
                defaultValue={params.q}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.currentTarget as HTMLInputElement).value.trim();
                    setParam("q", val);
                    (e.currentTarget as HTMLInputElement).blur();
                  }
                }}
                onBlur={(e) => {
                  const val = (e.currentTarget as HTMLInputElement).value.trim();
                  if (val !== params.q) setParam("q", val);
                }}
                className={UI.textInput}
                aria-label="Поиск по товарам"
                disabled={pending}
              />
              {params.q && (
                <button
                  type="button"
                  onClick={() => setParam("q", "")}
                  className={UI.linkBtn}
                  title="Очистить поиск"
                  aria-label="Очистить поиск"
                  disabled={pending}
                >
                  Очистить
                </button>
              )}
            </div>
          </label>

          <div className="flex items-end gap-2">
            <Link href={`${base}/shop/products`} className={UI.linkBtn} prefetch={false}>
              Открыть список товаров
            </Link>
            <Link href={`${base}/shop/categories`} className={UI.linkBtn} prefetch={false}>
              Категории
            </Link>
          </div>
        </div>
      </section>

      {/* Герой-блок с ключевыми показателями магазина */}
      <ShopHero
        period={params.period}
        channel={params.channel}
        stock={params.stock}
        status={params.status}
        q={params.q}
        baseHref={base}
      />

      {/* Нижняя сетка: метрики + быстрые действия */}
      <div className="grid gap-4 md:grid-cols-3">
        <ShopStats
          period={params.period}
          channel={params.channel}
          stock={params.stock}
          status={params.status}
          q={params.q}
          baseHref={base}
        />
        <QuickActions
          role={
            base.includes("/manager") ? "manager" : base.includes("/admin") ? "admin" : "user"
          }
        />
      </div>
    </>
  );
}