// app/demo/admin/shop/page.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ShopHero from "./components/ShopHero";
import ShopStats from "./components/ShopStats";
import QuickActions from "./components/QuickActions";

type Period = "7d" | "30d" | "q" | "y";
type Channel = "all" | "online" | "manager";
type StockFilter = "all" | "in" | "low" | "out";
type StatusFilter = "all" | "active" | "draft" | "archived";

const UI = {
  card: "rounded-2xl border border-white/15 bg-white/[0.06] p-4 md:p-6 backdrop-blur-sm",
  btn: "rounded-xl bg-white px-4 py-2 text-sm text-black hover:bg-white/90",
  select: "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none",
  chip:
    "rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15",
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

  // централизовано читаем параметры
  const params = useMemo(() => {
    return {
      period: (sp.get("period") as Period) || "30d",
      channel: (sp.get("channel") as Channel) || "all",
      stock: (sp.get("stock") as StockFilter) || "all",
      status: (sp.get("status") as StatusFilter) || "all",
      q: sp.get("q") || "",
    };
  }, [sp]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(Array.from(sp.entries()));
    value ? next.set(key, value) : next.delete(key);
    router.push(`${base}/shop?${next.toString()}`);
  };

  return (
    <div className="grid gap-6">
      <header className={UI.card}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Магазин</h1>
            <p className="mt-1 text-sm text-white/70">
              Управляйте товарами, категориями, ценами и остатками. Фильтры влияют на все виджеты.
            </p>
          </div>
          <Link href={`${base}/shop/products/new`} className={UI.btn} prefetch={false}>
            Создать товар
          </Link>
        </div>

        {/* Фильтры */}
        <div className="mt-4 grid gap-2 md:grid-cols-4">
          {/* Период */}
          <div className="grid gap-1">
            <span className="text-xs opacity-70">Период</span>
            <div className="flex flex-wrap gap-2">
              {PERIODS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setParam("period", p.id)}
                  className={
                    params.period === p.id
                      ? "rounded-xl bg-white px-3 py-1.5 text-sm text-black"
                      : UI.chip
                  }
                  aria-pressed={params.period === p.id}
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
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-xs opacity-70">Поиск по товарам</span>
            <input
              type="search"
              placeholder="Название, SKU, категория…"
              defaultValue={params.q}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setParam("q", (e.currentTarget as HTMLInputElement).value.trim());
                }
              }}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none placeholder:text-white/40"
            />
          </label>
          <div className="flex items-end gap-2">
            <Link
              href={`${base}/shop/products`}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
              prefetch={false}
            >
              Открыть список товаров
            </Link>
            <Link
              href={`${base}/shop/categories`}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
              prefetch={false}
            >
              Категории
            </Link>
          </div>
        </div>
      </header>

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
      <div className="grid gap-3 md:grid-cols-3">
        <ShopStats
          period={params.period}
          channel={params.channel}
          stock={params.stock}
          status={params.status}
          q={params.q}
          baseHref={base}
        />
        <QuickActions role={base.includes("/manager") ? "manager" : base.includes("/admin") ? "admin" : "user"} />
      </div>
    </div>
  );
}