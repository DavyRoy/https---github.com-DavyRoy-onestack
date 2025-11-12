// app/demo/admin/dashboard/components/LocationHeat.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
}): Promise<LocationItem[]> {
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
    return json;
  } catch {
    return mockLocationBreakdown({
      period: params.period ?? "30d",
      channel: params.channel ?? "all",
    });
  }
}

export default function LocationHeat({
  className = "",
  period,
  channel,
  baseHref,
  pollMs = 120_000,
}: LocationHeatProps) {
  const pathname = usePathname();
  const resolvedBase = getBase(baseHref, pathname);

  const [items, setItems] = useState<LocationItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();
    const run = async () => {
      setLoading(true);
      const data = await fetchLocationBreakdown({ period, channel, signal: controller.signal });
      if (!alive) return;
      setItems(data);
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
  }, [period, channel, pollMs]);

  const sorted = useMemo(
    () => (items ? [...items].sort((a, b) => b.value - a.value) : []),
    [items]
  );
  const max = useMemo(
    () => Math.max(...(sorted.map((i) => i.value) as number[]), 1),
    [sorted]
  );
  const total = useMemo(
    () => (sorted.length ? sorted.reduce((s, i) => s + (Number.isFinite(i.value) ? i.value : 0), 0) : 0),
    [sorted]
  );

  // мини-легенда
  const legend = useMemo(() => sorted.map((i) => i.id), [sorted]);

  return (
    <section
      className={cls(
        "rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.06] via-white/[0.045] to-white/[0.06] p-3 md:p-4 backdrop-blur-sm",
        className
      )}
      aria-labelledby="locationheat-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-medium" id="locationheat-title">
          Локации / вклад
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {legend.map((id) => {
            const st = locStyle[id] ?? locStyle.all;
            return (
              <span
                key={id}
                className={cls(
                  "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px]",
                  st.badge
                )}
              >
                <span className={cls("h-1.5 w-1.5 rounded-full", st.dot)} />
                {id}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-2 grid gap-2 md:grid-cols-2">
        {loading && (
          <>
            <SkelCard />
            <SkelCard />
            <SkelCard />
          </>
        )}

        {!loading &&
          sorted.map((i) => {
            const pctOfMax = max > 0 ? Math.round((i.value / max) * 100) : 0;
            const pctOfTotal = total > 0 ? Math.round((i.value / total) * 100) : 0;
            const href = `${resolvedBase}/dashboard?location=${encodeURIComponent(i.id)}`;
            const st = locStyle[i.id] ?? locStyle.all;

            return (
              <Link
                key={i.id}
                href={href}
                prefetch={false}
                className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition"
                aria-label={`Фильтр по локации ${i.label} (${pctOfTotal}% от общего)`}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate">{i.label}</span>
                  <span className="opacity-70 tabular-nums">
                    {i.value.toLocaleString("ru-RU")}
                  </span>
                </div>
                <div className="mt-1 h-2 rounded bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded transition-all"
                    style={{
                      width: `${Math.max(3, Math.min(100, pctOfMax))}%`,
                      backgroundImage: `linear-gradient(90deg, ${st.barFrom}, ${st.barTo})`,
                    }}
                    aria-hidden
                  />
                </div>
                <div className="mt-1 text-[11px] text-white/60 tabular-nums">
                  Доля: {pctOfTotal}%
                </div>
              </Link>
            );
          })}

        {!loading && sorted.length === 0 && (
          <div className="text-sm text-white/70 col-span-full">
            Нет данных по локациям
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-white/60">
        Клик применит фильтр по локации ко всем виджетам
      </div>
    </section>
  );
}

function SkelCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between">
        <span className="h-4 w-24 rounded bg-white/10 animate-pulse" />
        <span className="h-4 w-14 rounded bg-white/10 animate-pulse" />
      </div>
      <div className="mt-1 h-2 w-full rounded bg-white/10 overflow-hidden">
        <div className="h-full w-1/2 rounded bg-white/20 animate-pulse" />
      </div>
    </div>
  );
}