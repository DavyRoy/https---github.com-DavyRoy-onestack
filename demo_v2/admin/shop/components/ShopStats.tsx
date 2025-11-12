"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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

/* ── utils ─────────────────────────────────────────────────────────────── */
function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}
const nf = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

/** собрать строку query из текущих фильтров + overrides */
function buildQuery(
  baseParams: Partial<Record<"period" | "channel" | "stock" | "status" | "q", string>>,
  overrides?: Partial<Record<string, string>>
) {
  const sp = new URLSearchParams();
  (["period", "channel", "stock", "status", "q"] as const).forEach((k) => {
    const v = (overrides && overrides[k]) ?? baseParams[k];
    if (typeof v === "string" && v.trim() !== "") sp.set(k, v.trim());
  });
  if (overrides) {
    Object.entries(overrides).forEach(([k, v]) => {
      if (!["period", "channel", "stock", "status", "q"].includes(k) && typeof v === "string" && v.trim() !== "") {
        sp.set(k, v.trim());
      }
    });
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
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

  if (status && status !== "all") {
    list = list.filter((p) => (p.status ?? "active") === status);
  }
  if (stock && stock !== "all") {
    list = list.filter((p) => {
      const s = Number.isFinite(p.stockTotal as number) ? (p.stockTotal as number) : 0;
      if (stock === "in") return s > 0;
      if (stock === "low") return s > 0 && s <= 5;
      if (stock === "out") return s <= 0;
      return true;
    });
  }
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
    return computeFromMock(params);
  }
}

/* ── component ─────────────────────────────────────────────────────────── */
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
  const [err, setErr] = useState<string | null>(null);

  // отмена гонок + контроль polling
  const inFlightRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<number | null>(null);

  const load = async () => {
    // отменяем предыдущий незавершённый запрос
    inFlightRef.current?.abort();
    const ctrl = new AbortController();
    inFlightRef.current = ctrl;
    setLoading(true);
    setErr(null);
    try {
      const data = await fetchShopStats({ period, channel, stock, status, q, signal: ctrl.signal });
      if (!ctrl.signal.aborted) setStats(data);
    } catch (e: any) {
      if (!ctrl.signal.aborted) setErr(e?.message ?? "Ошибка загрузки");
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    load(); // первичная загрузка

    if (pollMs > 0) {
      intervalRef.current = window.setInterval(() => {
        if (document.visibilityState === "hidden") return; // пауза на скрытой вкладке
        load();
      }, pollMs);
    }

    const onVis = () => {
      if (document.visibilityState === "visible") load(); // мгновенный рефреш при возврате
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      if (intervalRef.current) clearInterval(intervalRef.current);
      inFlightRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, channel, stock, status, q, pollMs]);

  const s = stats ?? { total: NaN, active: NaN, noMedia: NaN, noCategory: NaN };

  const baseParams = useMemo(
    () => ({ period: String(period), channel: String(channel), stock: String(stock), status: String(status), q: String(q) }),
    [period, channel, stock, status, q]
  );

  const tiles = useMemo(
    () => [
      {
        label: "Активных",
        value: s.active,
        href: `${base}/shop/products${buildQuery(baseParams, { status: "active" })}`,
      },
      {
        label: "Без иконки",
        value: s.noMedia,
        href: `${base}/shop/products${buildQuery(baseParams, { icon: "none" })}`,
      },
      {
        label: "Без категории",
        value: s.noCategory,
        href: `${base}/shop/products${buildQuery(baseParams, { category: "none" })}`,
      },
    ],
    [s.active, s.noMedia, s.noCategory, base, baseParams]
  );

  return (
    <section
      className={cls("admin-section border-white/12 bg-white/8 md:col-span-2", className)}
      aria-labelledby="shop-stats-title"
      role="region"
    >
      <h2 id="shop-stats-title" className="sr-only">
        Статистика магазина
      </h2>

      {/* Ошибка */}
      {err && (
        <div className="mb-3 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
          Не удалось загрузить статистику: {err}
          <button onClick={load} className="ml-2 underline underline-offset-2 hover:no-underline">
            Повторить
          </button>
        </div>
      )}

      {/* Верхняя тройка тайлов */}
      <div className="grid gap-3 md:grid-cols-3" aria-busy={loading} aria-live="polite">
        {tiles.map((t) => (
          <Tile key={t.label} label={t.label} value={t.value} href={t.href} loading={loading} />
        ))}
      </div>

      {/* Итого */}
      <div className="mt-3 rounded-2xl border border-white/12 bg-white/10 p-4 text-white/85">
        <div className="text-xs text-white/60">Всего в каталоге</div>
        <div className="mt-1 text-xl font-semibold tabular-nums" aria-live="polite" aria-busy={loading}>
          {loading ? <SkelNumber /> : Number.isFinite(s.total) ? nf.format(s.total) : "—"}
        </div>
        <div className="mt-1 text-[11px] text-white/55">
          Фильтры (период/канал/остаток/статус/поиск) влияют на значения
        </div>
      </div>
    </section>
  );
}

/* ── subcomponents ─────────────────────────────────────────────────────── */
function Tile({
  label,
  value,
  href,
  loading,
}: {
  label: string;
  value: number;
  href: string;
  loading: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="rounded-2xl border border-white/12 bg-white/10 p-4 text-white/85 transition hover:border-white/18 hover:bg-white/16 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      aria-label={`${label}: ${loading ? "загрузка" : Number.isFinite(value) ? value : "нет данных"}`}
    >
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 h-7 text-xl font-semibold tabular-nums" aria-live="polite" aria-busy={loading}>
        {loading ? <SkelNumber /> : Number.isFinite(value) ? nf.format(value) : "—"}
      </div>
    </Link>
  );
}

/* ——— skeleton ——— */
function SkelNumber() {
  return <span className="inline-block h-6 w-12 animate-pulse rounded bg-white/10 align-middle" />;
}