// app/demo/admin/dashboard/components/OrgKpiCards.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { mockOrgKpi } from "../data/mockAdminDashboard";
import {
  Banknote,
  ClipboardCheck,
  Users2,
  PackageOpen,
  LineChart,
} from "lucide-react";

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

function nf(locale: string, currency?: string) {
  if (currency) {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    });
  }
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
}
function formatValue(kind: KpiKind, value: number, currency?: string, locale = "ru-RU") {
  if (!Number.isFinite(value)) return "—";
  if (kind === "money") {
    try {
      return nf(locale, currency).format(value);
    } catch {
      return `${nf(locale).format(value)} ${currency ?? ""}`.trim();
    }
  }
  return nf(locale).format(value);
}
function deltaBadge(delta: number) {
  if (!Number.isFinite(delta)) return { text: "—", cls: "bg-white/10 text-white/60" };
  const sign = delta > 0 ? "▲" : delta < 0 ? "▼" : "■";
  const tone =
    delta > 0
      ? "bg-emerald-400/15 text-emerald-300"
      : delta < 0
      ? "bg-red-400/15 text-red-300"
      : "bg-white/10 text-white/70";
  return { text: `${sign} ${Math.abs(Math.round(delta))}%`, cls: tone };
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

async function fetchOrgKpi(params: {
  period?: string;
  channel?: string;
  location?: string;
  currency?: string;
  signal?: AbortSignal;
}): Promise<KpiItem[]> {
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
    return json;
  } catch {
    const mock = mockOrgKpi({
      period: params.period ?? "30d",
      channel: params.channel ?? "all",
      location: params.location ?? "all",
      currency: (params.currency as DashboardCurrency) ?? "RUB",
    });
    return mock.map((m) => ({
      id: m.id,
      title: m.title,
      value: m.value,
      delta: m.delta,
      kind: m.kind as KpiKind,
      currency: m.currency,
      caption: m.caption,
      href: m.href,
      trend: m.trend,
    }));
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
  const colorCls = positive ? "opacity-90" : "opacity-90";
  const stroke = positive ? "#34d399" /* emerald-400 */ : "#f87171" /* red-400 */;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className={colorCls} aria-hidden>
      <polyline fill="none" stroke={stroke} strokeWidth="2" points={points} />
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

  const [kpis, setKpis] = useState<KpiItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setInterval> | null = null;
    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      const data = await fetchOrgKpi({ period, channel, location, currency, signal: controller.signal });
      if (!alive) return;
      setKpis(data);
      setLoading(false);
    };

    run();
    if (pollMs > 0) timer = setInterval(run, pollMs);

    return () => {
      alive = false;
      controller.abort();
      if (timer) clearInterval(timer);
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
        const href = k.href ?? defaultHref;
        return { ...k, href };
      }),
    [kpis, resolvedBase]
  );

  return (
    <section
      className={cls(
        "grid gap-3 md:grid-cols-4 rounded-2xl bg-gradient-to-b from-white/[0.06] via-white/[0.045] to-white/[0.06] p-0",
        className
      )}
      aria-label="KPI организации"
    >
      {loading && !kpis && (
        <>
          <KpiSkeleton />
          <KpiSkeleton />
          <KpiSkeleton />
          <KpiSkeleton />
        </>
      )}

      {!loading && list.length === 0 && (
        <div className="col-span-full text-sm text-white/70 p-3">
          Нет данных для выбранных фильтров
        </div>
      )}

      {list.map((k) => {
        const { text, cls: badgeCls } = deltaBadge(k.delta);
        const valueText =
          k.kind === "money"
            ? formatValue("money", k.value, k.currency)
            : formatValue("count", k.value);

        return (
          <Link
            key={k.id}
            href={k.href}
            prefetch={false}
            className="group rounded-2xl border border-white/15 bg-white/[0.05] p-3 hover:bg-white/[0.08] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            title={k.caption ? `${k.title} — ${k.caption}` : k.title}
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white/80">
                  {iconById(k.id)}
                </span>
                <div className="text-xs text-white/70">{k.title}</div>
              </div>
              <div className={cls("text-[11px] px-2 py-0.5 rounded-lg whitespace-nowrap", badgeCls)} aria-label="Динамика к прошлому периоду">
                {text}
              </div>
            </div>

            <div className="mt-1 flex items-end justify-between gap-2">
              <div
                className="text-xl font-semibold tabular-nums"
                aria-live="polite"
                aria-busy={loading}
              >
                {loading ? <SkelNumber /> : valueText}
              </div>
              <span className="text-white/50">
                <Sparkline values={k.trend} positive={(k.delta ?? 0) >= 0} />
              </span>
            </div>

            {k.caption && (
              <div className="mt-1 text-[11px] text-white/60 truncate">
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
        <span className="h-4 w-10 rounded bg-white/10 animate-pulse" />
      </div>
      <div className="mt-2 h-6 w-24 rounded bg-white/10 animate-pulse" />
      <div className="mt-1 h-3 w-2/3 rounded bg-white/10 animate-pulse" />
    </div>
  );
}
function SkelNumber() {
  return <span className="inline-block h-6 w-16 rounded bg-white/10 animate-pulse align-middle" />;
}