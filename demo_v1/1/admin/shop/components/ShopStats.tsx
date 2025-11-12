// app/demo/admin/shop/components/ShopStats.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { PRODUCTS } from "@/app/demo/(shared)/data/catalog/products.food";

type Period = "7d" | "30d" | "q" | "y";
type Channel = "all" | "online" | "manager";
type StockFilter = "all" | "in" | "low" | "out";
type StatusFilter = "all" | "active" | "draft" | "archived";

export type ShopStatsProps = {
  className?: string;
  period?: Period | string;
  channel?: Channel | string;
  stock?: StockFilter | string;
  status?: StatusFilter | string;
  q?: string;
  /** Базовый префикс ссылок; если не передан — определяется по URL */
  baseHref?: "/demo/admin" | "/demo/manager" | "/demo/user" | string;
  /** Частота обновления (мс); 0 — без polling */
  pollMs?: number;
};

type StatsResponse = {
  total: number;
  active: number;
  /** для совместимости с API оставляем название, но считаем товары без иконки */
  noMedia: number;
  noCategory: number;
};

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

/** Фоллбек: считаем метрики из локального PRODUCTS с учётом фильтров */
function computeFromMock({
  stock = "all",
  status = "all",
  q = "",
}: {
  stock?: string;
  status?: string;
  q?: string;
}): StatsResponse {
  let list = PRODUCTS as Array<{
    status?: string;
    iconId?: string | null;
    categoryId?: string | null;
    stockTotal?: number;
    name?: string;
    sku?: string;
  }>;

  // фильтр по статусу
  if (status && status !== "all") {
    list = list.filter((p) => (p.status ?? "active") === status);
  }

  // фильтр по остатку (ИСПРАВЛЕНО: используем stockTotal)
  if (stock && stock !== "all") {
    list = list.filter((p) => {
      const s = Number.isFinite(p.stockTotal as number) ? (p.stockTotal as number) : 0;
      if (stock === "in") return s > 0;
      if (stock === "low") return s > 0 && s <= 5; // порог low можно вынести в конфиг
      if (stock === "out") return s <= 0;
      return true;
    });
  }

  // поиск
  if (q) {
    const needle = q.toLowerCase();
    list = list.filter((p) => {
      const name = (p.name ?? "").toString().toLowerCase();
      const sku = (p.sku ?? "").toString().toLowerCase();
      return name.includes(needle) || sku.includes(needle);
    });
  }

  const total = list.length;
  const active = list.filter((p) => (p.status ?? "active") === "active").length;
  // ИСПРАВЛЕНО: раньше было noMedia по media[], теперь считаем noIcon по iconId
  const noIcon = list.filter((p) => !p.iconId).length;
  const noCategory = list.filter((p) => !p.categoryId).length;

  return { total, active, noMedia: noIcon, noCategory };
}

async function fetchShopStats(params: {
  period?: string;
  channel?: string;
  stock?: string;
  status?: string;
  q?: string;
  signal?: AbortSignal;
}): Promise<StatsResponse> {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([k, v]) => k !== "signal" && v != null && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  try {
    const res = await fetch(`/api/shop/stats${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
      signal: params.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as StatsResponse;
    if (
      typeof json?.total !== "number" ||
      typeof json?.active !== "number" ||
      typeof json?.noMedia !== "number" ||
      typeof json?.noCategory !== "number"
    ) {
      throw new Error("Invalid JSON shape");
    }
    return json;
  } catch {
    // мягкий fallback на локальные данные
    return computeFromMock(params);
  }
}

export default function ShopStats({
  className = "",
  period = "30d",
  channel = "all",
  stock = "all",
  status = "all",
  q = "",
  baseHref,
  pollMs = 60_000,
}: ShopStatsProps) {
  const pathname = usePathname();
  const base = (baseHref ?? getBaseFromPath(pathname)).replace(/\/$/, "");

  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      const data = await fetchShopStats({ period, channel, stock, status, q, signal: controller.signal });
      if (!alive) return;
      setStats(data);
      setLoading(false);
    };

    run();
    let timer: ReturnType<typeof setInterval> | null = null;
    if (pollMs > 0) timer = setInterval(run, pollMs);

    return () => {
      alive = false;
      controller.abort();
      if (timer) clearInterval(timer);
    };
  }, [period, channel, stock, status, q, pollMs]);

  const s = stats ?? { total: NaN, active: NaN, noMedia: NaN, noCategory: NaN };

  const Tile = ({
    label,
    value,
    href,
  }: {
    label: string;
    value: number;
    href: string;
  }) => (
    <Link
      href={href}
      prefetch={false}
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 hover:bg-white/[0.08] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
    >
      <div className="text-xs text-white/70">{label}</div>
      <div className="mt-1 text-xl font-semibold tabular-nums">
        {loading ? <SkelNumber /> : Number.isFinite(value) ? value : "—"}
      </div>
    </Link>
  );

  return (
    <section
      className={cls("md:col-span-2 grid gap-3 md:grid-cols-3", className)}
      aria-labelledby="shop-stats-title"
    >
      <h2 id="shop-stats-title" className="sr-only">
        Статистика магазина
      </h2>

      <Tile
        label="Активных"
        value={s.active}
        href={`${base}/shop/products?status=active`}
      />
      <Tile
        label="Без иконки"
        value={s.noMedia}
        href={`${base}/shop/products?icon=none`}
      />
      <Tile
        label="Без категории"
        value={s.noCategory}
        href={`${base}/shop/products?category=none`}
      />

      <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:col-span-3">
        <div className="text-xs text-white/70">Всего в каталоге</div>
        <div
          className="mt-1 text-xl font-semibold tabular-nums"
          aria-live="polite"
          aria-busy={loading}
        >
          {loading ? <SkelNumber /> : Number.isFinite(s.total) ? s.total : "—"}
        </div>
        <div className="mt-1 text-[11px] text-white/60">
          Фильтры (период/канал/остаток/статус/поиск) влияют на значения
        </div>
      </div>
    </section>
  );
}

/* ——— skeleton ——— */
function SkelNumber() {
  return <span className="inline-block h-6 w-10 rounded bg-white/10 animate-pulse align-middle" />;
}