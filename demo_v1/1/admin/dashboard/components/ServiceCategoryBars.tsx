// app/demo/admin/dashboard/components/ServiceCategoryBars.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { mockServiceCategories } from "../data/mockAdminDashboard";

type DashboardPeriod = "7d" | "30d" | "q" | "y";
type DashboardChannel = "all" | "online" | "manager";

export type ServiceCategoryBarsProps = {
  className?: string;
  period: DashboardPeriod | string;
  channel: DashboardChannel | string;
  /** Для форматирования суммы (если есть валюта в бэке — можно не передавать) */
  currency?: "RUB" | "KRW" | "USD" | string;
  /** Базовый префикс ссылок, по умолчанию берём из URL */
  baseHref?: "/demo/admin" | "/demo/manager" | "/demo/user" | string;
  /** Периодичность обновления (мс), 0 — отключить polling */
  pollMs?: number;
  /** Сколько категорий показывать (обрежем топ) */
  limit?: number;
  /** Сортировка топа: по умолчанию по убыванию */
  sort?: "desc" | "asc";
};

type CatItem = { id: string; label: string; value: number; currency?: string };

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
function getBase(prefix: string | undefined, pathname: string | null) {
  if (prefix) return prefix.replace(/\/$/, "");
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}
function fmtMoney(v: number, cur?: string, locale = "ru-RU") {
  if (!Number.isFinite(v)) return "—";
  try {
    return new Intl.NumberFormat(locale, {
      style: cur ? "currency" : "decimal",
      currency: cur as string,
      maximumFractionDigits: 0,
      currencyDisplay: cur ? "narrowSymbol" : undefined,
    }).format(v);
  } catch {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(v)}${cur ? ` ${cur}` : ""}`;
  }
}

async function fetchServiceCategories(params: {
  period?: string;
  channel?: string;
  signal?: AbortSignal;
}): Promise<CatItem[]> {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([k, v]) => k !== "signal" && v != null && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  try {
    const res = await fetch(`/api/metrics/service-categories${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
      signal: params.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as CatItem[];
    if (!Array.isArray(json)) throw new Error("Invalid response shape");
    return json;
  } catch {
    // fallback на текущий мок (совместим по форме)
    return mockServiceCategories({
      period: params.period ?? "30d",
      channel: params.channel ?? "all",
    }) as CatItem[];
  }
}

export default function ServiceCategoryBars({
  className = "",
  period,
  channel,
  currency,
  baseHref,
  pollMs = 60_000,
  limit = 8,
  sort = "desc",
}: ServiceCategoryBarsProps) {
  const pathname = usePathname();
  const resolvedBase = getBase(baseHref, pathname);

  const [cats, setCats] = useState<CatItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchServiceCategories({ period, channel, signal: controller.signal });
        if (!alive) return;
        setCats(data);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Ошибка загрузки");
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    let timer: ReturnType<typeof setInterval> | null = null;
    if (pollMs > 0) timer = setInterval(run, pollMs);

    return () => {
      alive = false;
      controller.abort();
      if (timer) clearInterval(timer);
    };
  }, [period, channel, pollMs]);

  // нормализация: убираем дубликаты по id, сортируем и обрезаем TOP
  const list = useMemo(() => {
    const src = cats ?? [];
    const uniq = new Map<string, CatItem>();
    for (const c of src) if (!uniq.has(c.id)) uniq.set(c.id, c);
    const arr = Array.from(uniq.values());
    arr.sort((a, b) =>
      sort === "desc" ? (b.value - a.value) : (a.value - b.value)
    );
    return arr.slice(0, Math.max(1, limit));
  }, [cats, limit, sort]);

  const max = useMemo(
    () => Math.max(...(list.map((c) => c.value) as number[]), 1),
    [list]
  );

  return (
    <section
      className={cls(
        "rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 backdrop-blur-sm",
        className
      )}
      aria-labelledby="svc-top-title"
    >
      <div className="text-sm font-medium" id="svc-top-title">
        Категории услуг / ТОП
      </div>

      <div className="mt-2 grid gap-2" aria-busy={loading}>
        {loading && !cats && (
          <>
            <SkelRow />
            <SkelRow />
            <SkelRow />
            <SkelRow />
          </>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
            Не удалось загрузить категории: {error}
          </div>
        )}

        {!loading && !error && list.length === 0 && (
          <div className="text-sm text-white/70">Нет данных по категориям</div>
        )}

        {list.map((c) => {
          const pct = max > 0 ? Math.round((Math.max(0, c.value) / max) * 100) : 0;
          const catCurrency = c.currency ?? currency;
          const safePct = Math.max(3, Math.min(100, pct)); // не даём исчезнуть тонким категориям
          return (
            <div key={c.id} className="grid gap-1">
              <Link
                href={`${resolvedBase}/reports/sales?focus=category&cat=${encodeURIComponent(c.id)}`}
                prefetch={false}
                className="flex items-center justify-between text-sm hover:underline"
              >
                <span className="truncate">{c.label}</span>
                <span className="opacity-70 tabular-nums">
                  {fmtMoney(c.value, catCurrency)}
                </span>
              </Link>

              <Link
                href={`${resolvedBase}/orders?cat=${encodeURIComponent(c.id)}`}
                prefetch={false}
                className="block h-1.5 rounded bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                aria-label={`Открыть заказы по категории ${c.label}`}
              >
                <div
                  className="h-full rounded bg-white transition-all"
                  style={{ width: `${safePct}%` }}
                  aria-hidden
                />
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mt-2 text-xs text-white/60">
        Клик по строке — детальный отчёт; по полосе — список заказов
      </div>
    </section>
  );
}

/* ——— skeleton строки ——— */
function SkelRow() {
  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between">
        <span className="h-4 w-36 rounded bg-white/10 animate-pulse" />
        <span className="h-4 w-16 rounded bg-white/10 animate-pulse" />
      </div>
      <div className="h-1.5 w-full rounded bg-white/10 overflow-hidden">
        <div className="h-full w-1/2 rounded bg-white/20 animate-pulse" />
      </div>
    </div>
  );
}