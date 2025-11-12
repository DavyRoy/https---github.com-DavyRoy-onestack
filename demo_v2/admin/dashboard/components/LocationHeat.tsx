// app/demo/admin/dashboard/components/LocationHeat.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useId } from "react";
import { usePathname } from "next/navigation";
import { mockLocationBreakdown } from "../data/mockAdminDashboard";

type DashboardPeriod = "7d" | "30d" | "q" | "y";
type DashboardChannel = "all" | "online" | "manager";

type LocationItem = {
  id: string;
  label: string;
  value: number;
};

export type LocationHeatProps = {
  className?: string;
  period: DashboardPeriod | string;
  channel: DashboardChannel | string;
  /** Автоопределяется по URL, но можно переопределить явно */
  baseHref?: "/demo/admin" | "/demo/manager" | "/demo/user" | string;
  /** Частота обновления (мс), 0 — отключено */
  pollMs?: number;
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

// единая палитра для локаций (по id)
const locStyle: Record<
  string,
  { dot: string; badge: string; barFrom: string; barTo: string }
> = {
  center: {
    dot: "bg-rose-300",
    badge: "text-rose-200 bg-rose-400/15",
    barFrom: "rgba(253, 164, 175, 0.85)",
    barTo: "rgba(253, 164, 175, 0.25)",
  },
  south: {
    dot: "bg-amber-300",
    badge: "text-amber-200 bg-amber-400/15",
    barFrom: "rgba(252, 211, 77, 0.85)",
    barTo: "rgba(252, 211, 77, 0.25)",
  },
  north: {
    dot: "bg-sky-300",
    badge: "text-sky-200 bg-sky-400/15",
    barFrom: "rgba(125, 211, 252, 0.85)",
    barTo: "rgba(125, 211, 252, 0.25)",
  },
  all: {
    dot: "bg-neutral-200",
    badge: "text-white/80 bg-white/10",
    barFrom: "rgba(255,255,255,0.85)",
    barTo: "rgba(255,255,255,0.25)",
  },
};

async function fetchLocationBreakdown(params: {
  period?: string;
  channel?: string;
  signal?: AbortSignal;
}): Promise<{ data: LocationItem[]; source: "api" | "mock" }> {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([k, v]) => k !== "signal" && v != null && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  try {
    const res = await fetch(`/api/metrics/location-breakdown${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
      signal: params.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as LocationItem[];
    if (!Array.isArray(json)) throw new Error("Invalid response shape");
    return { data: json, source: "api" };
  } catch {
    return {
      data: mockLocationBreakdown({
        period: params.period ?? "30d",
        channel: params.channel ?? "all",
      }),
      source: "mock",
    };
  }
}

const nf = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

export default function LocationHeat({
  className = "",
  period,
  channel,
  baseHref,
  pollMs = 120_000,
}: LocationHeatProps) {
  const pathname = usePathname();
  const resolvedBase = getBase(baseHref, pathname);
  const uid = useId();
  const titleId = `locationheat-title-${uid}`;

  const [items, setItems] = useState<LocationItem[] | null>(null);
  const [source, setSource] = useState<"api" | "mock">("api");
  const [loading, setLoading] = useState(true);

  // защита от гонок: отменяем предыдущий запрос; пауза на скрытой вкладке
  const inFlightCtrl = useRef<AbortController | null>(null);
  const intervalRef = useRef<number | null>(null);

  const run = async () => {
    inFlightCtrl.current?.abort();
    const ctrl = new AbortController();
    inFlightCtrl.current = ctrl;
    setLoading(true);
    try {
      const { data, source } = await fetchLocationBreakdown({ period, channel, signal: ctrl.signal });

      if (ctrl.signal.aborted) return;

      // нормализуем значения + дедуп по id
      const dedup = Array.from(new Map(data.map((x) => [x.id, x])).values()).map((x) => ({
        ...x,
        value: Math.max(0, Number.isFinite(x.value) ? x.value : 0),
      }));

      setItems(dedup);
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
  }, [period, channel, pollMs]);

  const sorted = useMemo(
    () => (items ? [...items].sort((a, b) => b.value - a.value) : []),
    [items]
  );
  const max = useMemo(() => Math.max(1, ...sorted.map((i) => i.value)), [sorted]);
  const total = useMemo(() => (sorted.length ? sorted.reduce((s, i) => s + i.value, 0) : 0), [sorted]);

  // мини-легенда без дублей
  const legend = useMemo(() => {
    const seen = new Set<string>();
    const ids: string[] = [];
    for (const i of sorted) {
      if (!seen.has(i.id)) {
        seen.add(i.id);
        ids.push(i.id);
      }
    }
    return ids;
  }, [sorted]);

  return (
    <section
      className={cls(
        "rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.06] via-white/[0.045] to-white/[0.06] p-3 md:p-4 backdrop-blur-sm",
        "min-w-0",
        className
      )}
      aria-labelledby={titleId}
      role="region"
      aria-busy={loading}
      data-loading={loading ? "true" : "false"}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium truncate" id={titleId}>
          Локации / вклад
        </h3>

        <div className="flex flex-wrap items-center gap-2" aria-label="Легенда локаций">
          {legend.map((id) => {
            const st = locStyle[id] ?? locStyle.all;
            return (
              <span
                key={id}
                className={cls("inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px]", st.badge)}
                title={id}
              >
                <span className={cls("h-1.5 w-1.5 rounded-full", st.dot)} />
                {id}
              </span>
            );
          })}
          {!loading && source === "mock" && (
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">демо-данные</span>
          )}
        </div>
      </div>

      <div className="mt-2 grid gap-2 md:grid-cols-2" role="list" aria-live="polite">
        {loading && (
          <>
            <SkelCard />
            <SkelCard />
            <SkelCard />
          </>
        )}

        {!loading && sorted.length === 0 && (
          <div className="col-span-full text-sm text-white/70">Нет данных по локациям</div>
        )}

        {sorted.map((i) => {
          const pctOfMax = Math.round((i.value / max) * 100);
          const pctOfTotal = total > 0 ? Math.round((i.value / total) * 100) : 0;
          const clampedMax = Math.max(3, Math.min(100, pctOfMax));
          const href = `${resolvedBase}/dashboard?location=${encodeURIComponent(i.id)}`;
          const st = locStyle[i.id] ?? locStyle.all;

          return (
            <Link
              key={i.id}
              href={href}
              prefetch={false}
              role="listitem"
              className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              aria-label={`Фильтр по локации ${i.label} (${pctOfTotal}% от общего)`}
              title={`Открыть дашборд с фильтром: ${i.label}`}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="truncate">{i.label || i.id}</span>
                <span className="tabular-nums opacity-70">{nf.format(i.value)}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded bg-white/10">
                <div
                  className="h-full rounded will-change-[width] motion-safe:transition-[width] motion-safe:duration-300"
                  style={{
                    width: `${clampedMax}%`,
                    backgroundImage: `linear-gradient(90deg, ${st.barFrom}, ${st.barTo})`,
                  }}
                  aria-hidden
                />
              </div>
              <div className="mt-1 tabular-nums text-[11px] text-white/60">Доля: {pctOfTotal}%</div>
            </Link>
          );
        })}
      </div>

      <div className="mt-2 text-xs text-white/60">Клик применит фильтр по локации ко всем виджетам</div>
    </section>
  );
}

function SkelCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between">
        <span className="h-4 w-24 animate-pulse rounded bg-white/10" />
        <span className="h-4 w-14 animate-pulse rounded bg-white/10" />
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded bg-white/10">
        <div className="h-full w-1/2 animate-pulse rounded bg-white/20" />
      </div>
    </div>
  );
}