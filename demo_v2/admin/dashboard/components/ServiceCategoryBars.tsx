// app/demo/admin/dashboard/components/ServiceCategoryBars.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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

/* ── utils ─────────────────────────────────────────────────────────────── */
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
      currency: (cur as string | undefined) ?? "RUB",
      maximumFractionDigits: 0,
      currencyDisplay: cur ? "narrowSymbol" : undefined,
    }).format(Math.max(0, v));
  } catch {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.max(0, v))}${
      cur ? ` ${cur}` : ""
    }`;
  }
}

/* ── data loader (API → mock fallback с указанием источника) ──────────── */
async function fetchServiceCategories(params: {
  period?: string;
  channel?: string;
  signal?: AbortSignal;
}): Promise<{ data: CatItem[]; source: "api" | "mock" }> {
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
    return { data: json, source: "api" };
  } catch {
    const data = mockServiceCategories({
      period: params.period ?? "30d",
      channel: params.channel ?? "all",
    }) as CatItem[];
    return { data, source: "mock" };
  }
}

/* ── component ─────────────────────────────────────────────────────────── */
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
  const [source, setSource] = useState<"api" | "mock">("api");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // локальные контролы (не меняют контракт пропсов)
  const [localSort, setLocalSort] = useState<"desc" | "asc">(sort);
  const [localLimit, setLocalLimit] = useState<number>(Math.max(1, limit));

  // защита от гонок и пауза пуллинга на скрытой вкладке
  const inFlightCtrl = useRef<AbortController | null>(null);
  const intervalRef = useRef<number | null>(null);

  const run = async () => {
    inFlightCtrl.current?.abort();
    const ctrl = new AbortController();
    inFlightCtrl.current = ctrl;
    setLoading(true);
    setError(null);
    try {
      const { data, source } = await fetchServiceCategories({ period, channel, signal: ctrl.signal });
      // нормализуем: уникальность по id, безопасные числа
      const uniq = new Map<string, CatItem>();
      for (const c of data) {
        const item: CatItem = {
          id: c.id,
          label: c.label,
          value: Number.isFinite(c.value) ? Math.max(0, c.value) : 0,
          currency: c.currency,
        };
        if (!uniq.has(item.id)) uniq.set(item.id, item);
      }
      setCats(Array.from(uniq.values()));
      setSource(source);
    } catch (e: any) {
      if (!ctrl.signal.aborted) setError(e?.message ?? "Ошибка загрузки");
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    run();
    if (pollMs > 0) {
      intervalRef.current = window.setInterval(() => {
        if (document.visibilityState === "hidden") return;
        run();
      }, pollMs);
    }
    // обновление при возврате на вкладку
    const onVis = () => {
      if (document.visibilityState === "visible") run();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      if (intervalRef.current) clearInterval(intervalRef.current);
      inFlightCtrl.current?.abort();
    };
  }, [period, channel, pollMs]);

  // сортировка и обрезка TOP
  const prepared = useMemo(() => {
    const arr = [...(cats ?? [])];
    arr.sort((a, b) => (localSort === "desc" ? b.value - a.value : a.value - b.value));
    return arr.slice(0, Math.max(1, localLimit));
  }, [cats, localLimit, localSort]);

  const max = useMemo(() => Math.max(...(prepared.map((c) => c.value) as number[]), 1), [prepared]);
  const total = useMemo(() => prepared.reduce((s, c) => s + c.value, 0), [prepared]);

  return (
    <section
      className={cls(
        "rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 backdrop-blur-sm",
        "min-w-0",
        className
      )}
      aria-labelledby="svc-top-title"
      role="region"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2">
          <h3 className="text-sm font-medium" id="svc-top-title">
            Категории услуг / ТОП
          </h3>
          {!loading && source === "mock" && (
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">демо-данные</span>
          )}
        </div>

        {/* Контролы сортировки и лимита (десктоп и мобайл одинаковые) */}
        <div className="flex items-center gap-2 text-xs">
          <div className="hidden sm:flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 p-1">
            {(["desc", "asc"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setLocalSort(k)}
                className={cls(
                  "rounded-lg px-2 py-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                  localSort === k ? "bg-white text-black" : "hover:bg-white/10 text-white/80"
                )}
                aria-pressed={localSort === k}
                aria-label={k === "desc" ? "Сортировать по убыванию" : "Сортировать по возрастанию"}
                title={k === "desc" ? "По убыванию" : "По возрастанию"}
              >
                {k === "desc" ? "↓" : "↑"}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-1">
            <span className="sr-only">Сколько категорий показывать</span>
            <select
              value={localLimit}
              onChange={(e) => setLocalLimit(Math.max(1, Number(e.target.value)))}
              className="rounded-xl border border-white/15 bg-white/10 px-2 py-1.5"
              aria-label="Количество видимых категорий"
            >
              {[4, 6, 8, 10, 12].map((n) => (
                <option key={n} value={n}>
                  топ-{n}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Итого по видимому топу */}
      <div className="mt-1 text-[11px] text-white/60">
        Итого по топ-{prepared.length}: {fmtMoney(total, currency)}
      </div>

      <div className="mt-2 grid gap-2" aria-busy={loading} aria-live="polite">
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
            <div className="flex items-center justify-between gap-2">
              <span>Не удалось загрузить категории: {error}</span>
              <button
                type="button"
                onClick={run}
                className="rounded border border-red-300/30 bg-red-300/10 px-2 py-1 text-xs hover:bg-red-300/15"
              >
                Повторить
              </button>
            </div>
          </div>
        )}

        {!loading && !error && prepared.length === 0 && (
          <div className="text-sm text-white/70">Нет данных по категориям</div>
        )}

        {prepared.map((c) => {
          const pct = max > 0 ? Math.round((Math.max(0, c.value) / max) * 100) : 0;
          const safePct = Math.max(3, Math.min(100, pct)); // не даём исчезнуть тонким категориям
          const catCurrency = c.currency ?? currency;

          return (
            <div key={c.id} className="grid gap-1">
              <Link
                href={`${resolvedBase}/reports/sales?focus=category&cat=${encodeURIComponent(c.id)}`}
                prefetch={false}
                className="flex items-center justify-between text-sm hover:underline"
                aria-label={`Открыть отчёт по категории ${c.label}`}
                title={`Отчёт: ${c.label}`}
              >
                <span className="truncate">{c.label}</span>
                <span className="tabular-nums opacity-70">{fmtMoney(c.value, catCurrency)}</span>
              </Link>

              <Link
                href={`${resolvedBase}/orders?cat=${encodeURIComponent(c.id)}`}
                prefetch={false}
                className="block h-1.5 rounded bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition"
                aria-label={`Открыть заказы по категории ${c.label}`}
                title={`Заказы: ${c.label}`}
              >
                <div
                  className="h-full rounded bg-white transition-[width]"
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
        <span className="h-4 w-36 animate-pulse rounded bg-white/10" />
        <span className="h-4 w-16 animate-pulse rounded bg-white/10" />
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded bg-white/10">
        <div className="h-full w-1/2 animate-pulse rounded bg-white/20" />
      </div>
    </div>
  );
}