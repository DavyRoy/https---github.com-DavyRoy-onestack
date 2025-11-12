// app/demo/admin/dashboard/components/OrgKpiCards.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useId } from "react";
import { usePathname } from "next/navigation";
import { mockOrgKpi } from "../data/mockAdminDashboard";
import { Banknote, ClipboardCheck, Users2, PackageOpen, LineChart } from "lucide-react";

type DashboardPeriod = "7d" | "30d" | "q" | "y";
type DashboardChannel = "all" | "online" | "manager";
type DashboardLocation = "all" | "center" | "south" | "north";
type DashboardCurrency = "RUB" | "KRW" | "USD";

export type OrgKpiCardsProps = {
  className?: string;
  period: DashboardPeriod | string;
  channel: DashboardChannel | string;
  location: DashboardLocation | string;
  currency: DashboardCurrency | string;
  /** базовый префикс ссылок; если не задан — определяем по URL (/demo/admin|manager|user) */
  baseHref?: "/demo/admin" | "/demo/manager" | "/demo/user" | string;
  /** периодичность обновления (мс); 0 — выключить polling */
  pollMs?: number;
};

type KpiKind = "count" | "money";
type KpiItem = {
  id: string;
  title: string;
  value: number;
  delta: number; // % к прошлому периоду
  kind: KpiKind;
  currency?: DashboardCurrency | string;
  caption?: string;
  href?: string;
  trend?: number[];
};

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

/* ——— форматирование ——— */
function nf(locale: string, currency?: string) {
  if (currency) {
    try {
      return new Intl.NumberFormat(locale, {
        maximumFractionDigits: 0,
        style: "currency",
        currency,
        currencyDisplay: "narrowSymbol",
      });
    } catch {
      // упадём в числовой формат ниже
    }
  }
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
}
function formatValue(kind: KpiKind, value: number, currency?: string, locale = "ru-RU") {
  if (!Number.isFinite(value)) return "—";
  const safe = Math.max(0, value);
  if (kind === "money") {
    const fmt = nf(locale, currency);
    return fmt.resolvedOptions().style === "currency"
      ? fmt.format(safe)
      : `${fmt.format(safe)} ${currency ?? ""}`.trim();
  }
  return nf(locale).format(safe);
}
function deltaBadge(delta: number) {
  if (!Number.isFinite(delta)) return { text: "—", cls: "bg-white/10 text-white/60" };
  const clamped = Math.max(-100, Math.min(100, Math.round(delta)));
  const sign = clamped > 0 ? "▲" : clamped < 0 ? "▼" : "■";
  const tone =
    clamped > 0
      ? "bg-emerald-400/15 text-emerald-200"
      : clamped < 0
      ? "bg-red-400/15 text-red-200"
      : "bg-white/10 text-white/70";
  return { text: `${sign} ${Math.abs(clamped)}%`, cls: tone };
}
function iconById(id: string) {
  switch (id) {
    case "revenue":
      return <Banknote width={16} height={16} />;
    case "orders":
      return <ClipboardCheck width={16} height={16} />;
    case "clients":
      return <Users2 width={16} height={16} />;
    case "bookings":
      return <PackageOpen width={16} height={16} />;
    default:
      return <LineChart width={16} height={16} />;
  }
}

/* ——— приоритет отображения карточек ——— */
const KPI_WEIGHT: Record<string, number> = {
  revenue: 0,
  orders: 1,
  clients: 2,
  bookings: 3,
};

/* ——— загрузка данных (API → mock) ——— */
async function fetchOrgKpi(params: {
  period?: string;
  channel?: string;
  location?: string;
  currency?: string;
  signal?: AbortSignal;
}): Promise<{ data: KpiItem[]; source: "api" | "mock" }> {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([k, v]) => k !== "signal" && v != null && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  try {
    const res = await fetch(`/api/metrics/org-kpi${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
      signal: params.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as KpiItem[];
    if (!Array.isArray(json)) throw new Error("Invalid response shape");
    return { data: json, source: "api" };
  } catch {
    const mock = mockOrgKpi({
      period: params.period ?? "30d",
      channel: params.channel ?? "all",
      location: params.location ?? "all",
      currency: (params.currency as DashboardCurrency) ?? "RUB",
    });
    return {
      data: mock.map((m) => ({
        id: m.id,
        title: m.title,
        value: m.value,
        delta: m.delta,
        kind: m.kind as KpiKind,
        currency: m.currency,
        caption: m.caption,
        href: m.href,
        trend: m.trend,
      })),
      source: "mock",
    };
  }
}

/** Спарклайн; цвет линии зависит от знака дельты */
function Sparkline({ values, positive }: { values?: number[]; positive?: boolean }) {
  if (!values || values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const w = 64;
  const h = 20;
  const step = w / (values.length - 1);
  const points = values
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const stroke = positive ? "#34d399" /* emerald-400 */ : "#f87171" /* red-400 */;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden className="opacity-90">
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        points={points}
        className="motion-safe:[transition:all_.2s_ease]"
      />
    </svg>
  );
}

export default function OrgKpiCards({
  className = "",
  period,
  channel,
  location,
  currency,
  baseHref,
  pollMs = 60_000,
}: OrgKpiCardsProps) {
  const pathname = usePathname();
  const resolvedBase = getBase(baseHref, pathname);
  const uid = useId();

  const [kpis, setKpis] = useState<KpiItem[] | null>(null);
  const [source, setSource] = useState<"api" | "mock">("api");
  const [loading, setLoading] = useState(true);

  // защита от гонок + пауза пуллинга на скрытой вкладке
  const inFlightCtrl = useRef<AbortController | null>(null);
  const intervalRef = useRef<number | null>(null);

  const run = async () => {
    inFlightCtrl.current?.abort();
    const ctrl = new AbortController();
    inFlightCtrl.current = ctrl;
    setLoading(true);
    try {
      const { data, source } = await fetchOrgKpi({
        period,
        channel,
        location,
        currency,
        signal: ctrl.signal,
      });

      if (ctrl.signal.aborted) return;

      // нормализация + дедуп по id
      const norm = Array.from(new Map(data.map((k) => [k.id, k])).values()).map((k) => ({
        ...k,
        value: Number.isFinite(k.value) ? Math.max(0, k.value) : NaN,
        delta: Number.isFinite(k.delta) ? Math.max(-100, Math.min(100, k.delta)) : NaN,
        trend: Array.isArray(k.trend) ? k.trend.filter((x) => Number.isFinite(x)) : undefined,
      }));

      // стабильная сортировка по KPI_WEIGHT, затем по title
      norm.sort((a, b) => {
        const wa = KPI_WEIGHT[a.id] ?? 999;
        const wb = KPI_WEIGHT[b.id] ?? 999;
        return wa === wb ? a.title.localeCompare(b.title, "ru") : wa - wb;
      });

      setKpis(norm);
      setSource(source);
    } finally {
      if (!inFlightCtrl.current?.signal.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    run(); // первичная загрузка
    if (pollMs > 0) {
      intervalRef.current = window.setInterval(() => {
        if (document.visibilityState === "hidden") return;
        run();
      }, pollMs);
    }
    const onVis = () => {
      if (document.visibilityState === "visible") run();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      if (intervalRef.current) clearInterval(intervalRef.current);
      inFlightCtrl.current?.abort();
    };
  }, [period, channel, location, currency, pollMs]);

  const list = useMemo(
    () =>
      (kpis ?? []).map((k) => {
        const defaultHref =
          k.id === "revenue"
            ? `${resolvedBase}/reports/sales`
            : k.id === "bookings"
            ? `${resolvedBase}/reports/booking`
            : k.id === "clients"
            ? `${resolvedBase}/crm/clients`
            : k.id === "orders"
            ? `${resolvedBase}/orders`
            : `${resolvedBase}/dashboard`;
        const href = k.href?.startsWith("/demo")
          ? k.href.replace(/^\/demo\/(admin|manager|user)/, resolvedBase)
          : k.href ?? defaultHref;
        return { ...k, href };
      }),
    [kpis, resolvedBase]
  );

  const titleId = `orgkpi-title-${uid}`;

  return (
    <section
      className={cls(
        // Адаптивная сетка: 1 → 2 → 4 колонки, с одинаковыми картами
        "grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 rounded-2xl bg-gradient-to-b from-white/[0.06] via-white/[0.045] to-white/[0.06] p-0",
        "min-w-0",
        className
      )}
      aria-labelledby={titleId}
      role="region"
      aria-busy={loading}
      data-loading={loading ? "true" : "false"}
    >
      <h3 id={titleId} className="sr-only">
        KPI организации
      </h3>

      {/* скелетоны */}
      {loading && !kpis && (
        <>
          <KpiSkeleton />
          <KpiSkeleton />
          <KpiSkeleton />
          <KpiSkeleton />
        </>
      )}

      {/* пустое состояние */}
      {!loading && list.length === 0 && (
        <div className="col-span-full p-3 text-sm text-white/70">Нет данных для выбранных фильтров</div>
      )}

      {/* бейдж источника */}
      {!loading && source === "mock" && (
        <div className="col-span-full -mt-1 px-1 text-[10px] text-white/60">демо-данные</div>
      )}

      {/* KPI-карточки */}
      {list.map((k) => {
        const { text, cls: badgeCls } = deltaBadge(k.delta);
        const valueText =
          k.kind === "money" ? formatValue("money", k.value, k.currency) : formatValue("count", k.value);

        const captionId = k.caption ? `kpi-caption-${k.id}-${uid}` : undefined;

        return (
          <Link
            key={k.id}
            href={k.href}
            prefetch={false}
            className="group rounded-2xl border border-white/15 bg-white/[0.05] p-3 transition-colors hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            title={k.caption ? `${k.title} — ${k.caption}` : k.title}
            role="listitem"
            aria-describedby={captionId}
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 min-w-0">
                <span
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white/80"
                  aria-hidden
                >
                  {iconById(k.id)}
                </span>
                <div className="truncate text-xs text-white/70">{k.title}</div>
              </div>
              <div
                className={cls("whitespace-nowrap rounded-lg px-2 py-0.5 text-[11px]", badgeCls)}
                aria-label="Динамика к прошлому периоду"
                title={`Динамика: ${text.replace(/^. /, "")}`}
              >
                {text}
              </div>
            </div>

            <div className="mt-1 flex items-end justify-between gap-2">
              <div className="tabular-nums text-xl font-semibold" aria-live="polite" aria-busy={loading}>
                {loading ? <SkelNumber /> : valueText}
              </div>
              <span className="text-white/50">
                <Sparkline values={k.trend} positive={(k.delta ?? 0) >= 0} />
              </span>
            </div>

            {k.caption && (
              <div id={captionId} className="mt-1 truncate text-[11px] text-white/60">
                {k.caption}
              </div>
            )}
          </Link>
        );
      })}
    </section>
  );
}

/* ——— скелетоны ——— */
function KpiSkeleton() {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-3">
      <div className="flex items-center justify-between">
        <span className="inline-flex h-7 w-7 rounded-lg bg-white/10" />
        <span className="h-4 w-10 animate-pulse rounded bg-white/10" />
      </div>
      <div className="mt-2 h-6 w-24 animate-pulse rounded bg-white/10" />
      <div className="mt-1 h-3 w-2/3 animate-pulse rounded bg-white/10" />
    </div>
  );
}
function SkelNumber() {
  return <span className="inline-block h-6 w-16 animate-pulse rounded bg-white/10 align-middle" />;
}