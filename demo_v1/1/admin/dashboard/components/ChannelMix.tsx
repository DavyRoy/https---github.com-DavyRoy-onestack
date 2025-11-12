// app/demo/admin/dashboard/components/ChannelMix.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { mockChannelMix } from "../data/mockAdminDashboard";

type DashboardPeriod = "7d" | "30d" | "q" | "y";
type DashboardChannel = "all" | "online" | "manager";
type DashboardLocation = "all" | "center" | "south" | "north";

export type ChannelMixProps = {
  className?: string;
  period: DashboardPeriod | string;
  channel: DashboardChannel | string;
  location: DashboardLocation | string;
  baseHref?: "/demo/admin" | "/demo/manager" | "/demo/user" | string;
  /** Частота обновления в мс (0 — без polling). По умолчанию 60с. */
  pollMs?: number;
};

type MixItem = { id: string; label: string; value: number };

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
function getRoleBase(prefixFromProp: string | undefined, pathname: string | null) {
  if (prefixFromProp) return prefixFromProp.replace(/\/$/, "");
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

// Цвета и бейджи каналов — единообразные по всему приложению
const channelStyle: Record<
  string,
  { dot: string; badge: string; barFrom: string; barTo: string }
> = {
  online: {
    dot: "bg-sky-300",
    badge: "text-sky-200 bg-sky-400/15",
    barFrom: "rgba(125, 211, 252, 0.85)", // sky-300
    barTo: "rgba(125, 211, 252, 0.25)",
  },
  manager: {
    dot: "bg-emerald-300",
    badge: "text-emerald-200 bg-emerald-400/15",
    barFrom: "rgba(110, 231, 183, 0.85)", // emerald-300
    barTo: "rgba(110, 231, 183, 0.25)",
  },
  offline: {
    dot: "bg-violet-300",
    badge: "text-violet-200 bg-violet-400/15",
    barFrom: "rgba(196, 181, 253, 0.85)", // violet-300
    barTo: "rgba(196, 181, 253, 0.25)",
  },
  all: {
    dot: "bg-neutral-200",
    badge: "text-white/80 bg-white/10",
    barFrom: "rgba(255,255,255,0.85)",
    barTo: "rgba(255,255,255,0.25)",
  },
};

async function fetchChannelMix(params: {
  period?: string;
  channel?: string;
  location?: string;
  signal?: AbortSignal;
}): Promise<MixItem[]> {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([k, v]) => k !== "signal" && v != null && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  try {
    const res = await fetch(`/api/metrics/channel-mix${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
      signal: params.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as MixItem[];
    if (!Array.isArray(json)) throw new Error("Invalid shape");
    return json;
  } catch {
    return mockChannelMix({
      period: params.period ?? "30d",
      channel: params.channel ?? "all",
      location: params.location ?? "all",
    });
  }
}

export default function ChannelMix({
  className = "",
  period,
  channel,
  location,
  baseHref,
  pollMs = 60_000,
}: ChannelMixProps) {
  const pathname = usePathname();
  const roleBase = getRoleBase(baseHref, pathname);

  const [data, setData] = useState<MixItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setInterval> | null = null;
    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      const result = await fetchChannelMix({ period, channel, location, signal: controller.signal });
      if (!alive) return;
      setData(result);
      setLoading(false);
    };

    run();
    if (pollMs > 0) timer = setInterval(run, pollMs);

    return () => {
      alive = false;
      controller.abort();
      if (timer) clearInterval(timer);
    };
  }, [period, channel, location, pollMs]);

  const total = useMemo(
    () => (data ? data.reduce((s, x) => s + (Number.isFinite(x.value) ? x.value : 0), 0) : 0),
    [data]
  );

  // Легенда (по доступным в данных каналам)
  const legend = useMemo(() => {
    const ids = new Set((data ?? []).map((d) => d.id));
    return Array.from(ids);
  }, [data]);

  return (
    <section
      className={cls(
        "rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.06] via-white/[0.045] to-white/[0.06] p-3 md:p-4 backdrop-blur-sm",
        className
      )}
      aria-labelledby="channelmix-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div id="channelmix-title" className="text-sm font-medium">
          Каналы продаж
        </div>

        {/* мини-легенда */}
        <div className="flex flex-wrap items-center gap-2">
          {legend.map((id) => {
            const st = channelStyle[id] ?? channelStyle.offline;
            return (
              <span key={id} className={cls("inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px]", st.badge)}>
                <span className={cls("h-1.5 w-1.5 rounded-full", st.dot)} />
                {id}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-3 grid gap-2">
        {loading && !data && (
          <>
            <SkelRow />
            <SkelRow />
            <SkelRow />
          </>
        )}

        {!loading && data && data.length === 0 && (
          <div className="text-sm text-white/70">Нет данных для выбранных фильтров</div>
        )}

        {data?.map((s) => {
          const pct = total > 0 ? Math.round((Math.max(0, s.value) / total) * 100) : 0;
          const href = `${roleBase}/orders?channel=${encodeURIComponent(s.id)}`;
          const st = channelStyle[s.id] ?? channelStyle.offline;

          return (
            <Link
              key={s.id}
              href={href}
              prefetch={false}
              className="group block rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition"
              aria-label={`Заказы по каналу ${s.label}: ${pct}%`}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="truncate">{s.label}</span>
                <span className="opacity-80 tabular-nums">{Number.isFinite(pct) ? `${pct}%` : "—"}</span>
              </div>

              <div className="mt-1 h-2 rounded bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded transition-all"
                  style={{
                    width: `${Math.max(3, Math.min(100, pct))}%`,
                    backgroundImage: `linear-gradient(90deg, ${st.barFrom}, ${st.barTo})`,
                  }}
                  aria-hidden
                />
              </div>

              {/* вторичная строчка: абсолютное значение (если нужно — просто убери) */}
              <div className="mt-1 text-[11px] text-white/60 tabular-nums">
                Вклад: {Math.max(0, Math.round(s.value)).toLocaleString("ru-RU")}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ——— skeleton строки ——— */
function SkelRow() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2">
      <div className="flex items-center justify-between">
        <span className="h-4 w-28 rounded bg-white/10 animate-pulse" />
        <span className="h-4 w-8 rounded bg-white/10 animate-pulse" />
      </div>
      <div className="mt-1 h-2 w-full rounded bg-white/10 overflow-hidden">
        <div className="h-full w-1/2 rounded bg-white/20 animate-pulse" />
      </div>
    </div>
  );
}