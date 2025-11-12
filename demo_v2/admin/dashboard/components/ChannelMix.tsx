// app/demo/admin/dashboard/components/ChannelMix.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useId } from "react";
import { usePathname } from "next/navigation";
import { mockChannelMix } from "../data/mockAdminDashboard";

/* ===== Типы (контракт без изменений) ===== */
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

/* ===== Утилиты ===== */
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

/* ===== Единый стиль каналов (dot/badge/градиент) ===== */
const channelStyle: Record<
  string,
  { dot: string; badge: string; barFrom: string; barTo: string }
> = {
  online: {
    dot: "bg-sky-300",
    badge: "text-sky-200 bg-sky-400/15",
    barFrom: "rgba(125, 211, 252, 0.85)",
    barTo: "rgba(125, 211, 252, 0.25)",
  },
  manager: {
    dot: "bg-emerald-300",
    badge: "text-emerald-200 bg-emerald-400/15",
    barFrom: "rgba(110, 231, 183, 0.85)",
    barTo: "rgba(110, 231, 183, 0.25)",
  },
  offline: {
    dot: "bg-violet-300",
    badge: "text-violet-200 bg-violet-400/15",
    barFrom: "rgba(196, 181, 253, 0.85)",
    barTo: "rgba(196, 181, 253, 0.25)",
  },
  all: {
    dot: "bg-neutral-200",
    badge: "text-white/80 bg-white/10",
    barFrom: "rgba(255,255,255,0.85)",
    barTo: "rgba(255,255,255,0.25)",
  },
};

/* ===== Data Loader: API -> mock fallback ===== */
async function fetchChannelMix(params: {
  period?: string;
  channel?: string;
  location?: string;
  signal?: AbortSignal;
}): Promise<{ data: MixItem[]; source: "api" | "mock" }> {
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
    return { data: json, source: "api" };
  } catch {
    return {
      data: mockChannelMix({
        period: params.period ?? "30d",
        channel: params.channel ?? "all",
        location: params.location ?? "all",
      }),
      source: "mock",
    };
  }
}

/* ===== Форматтеры ===== */
const nf = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

/* ===== Компонент ===== */
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
  const uid = useId();
  const titleId = `channelmix-title-${uid}`;

  const [data, setData] = useState<MixItem[] | null>(null);
  const [source, setSource] = useState<"api" | "mock">("api");
  const [loading, setLoading] = useState(true);

  // избегаем гонок запросов
  const inFlightCtrl = useRef<AbortController | null>(null);
  const intervalRef = useRef<number | null>(null);

  const run = async () => {
    inFlightCtrl.current?.abort();
    const ctrl = new AbortController();
    inFlightCtrl.current = ctrl;
    setLoading(true);
    try {
      const { data, source } = await fetchChannelMix({
        period,
        channel,
        location,
        signal: ctrl.signal,
      });
      if (ctrl.signal.aborted) return;

      // дедуп и сортировка по value desc
      const dedup = Array.from(new Map(data.map((d) => [d.id, d])).values());
      dedup.sort((a, b) => (Number.isFinite(b.value) ? b.value : 0) - (Number.isFinite(a.value) ? a.value : 0));

      setData(dedup);
      setSource(source);
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  };

  // первичная загрузка + polling (пауза на скрытой вкладке)
  useEffect(() => {
    run(); // сразу
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
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      inFlightCtrl.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, channel, location, pollMs]);

  const total = useMemo(
    () =>
      data
        ? data.reduce((s, x) => s + (Number.isFinite(x.value) ? Math.max(0, x.value) : 0), 0)
        : 0,
    [data]
  );

  // Легенда — в порядке появления данных, без дубликатов
  const legend = useMemo(() => {
    const seen = new Set<string>();
    const ids: string[] = [];
    for (const d of data ?? []) {
      if (!seen.has(d.id)) {
        seen.add(d.id);
        ids.push(d.id);
      }
    }
    return ids;
  }, [data]);

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
        <h3 id={titleId} className="text-sm font-medium truncate">
          Каналы продаж
        </h3>

        {/* мини-легенда */}
        <div className="flex flex-wrap items-center gap-2" aria-label="Легенда каналов">
          {legend.map((id) => {
            const st = channelStyle[id] ?? channelStyle.offline;
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

      <div className="mt-3 grid gap-2" role="list" aria-live="polite">
        {loading && !data && (
          <>
            <SkelRow />
            <SkelRow />
            <SkelRow />
          </>
        )}

        {!loading && (data?.length ?? 0) === 0 && (
          <div className="text-sm text-white/70">Нет данных для выбранных фильтров</div>
        )}

        {data?.map((s) => {
          const safeValue = Math.max(0, Number.isFinite(s.value) ? s.value : 0);
          const pct = total > 0 ? Math.round((safeValue / total) * 100) : 0;
          const clampedPct = Math.max(3, Math.min(100, pct)); // минимум 3% — визуально заметная полоса
          const href = `${roleBase}/orders?channel=${encodeURIComponent(s.id)}`;
          const st = channelStyle[s.id] ?? channelStyle.offline;

          return (
            <Link
              key={s.id}
              href={href}
              prefetch={false}
              className="group block rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              role="listitem"
              aria-label={`Заказы по каналу ${s.label}: ${pct}%`}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="truncate">{s.label}</span>
                <span className="opacity-80 tabular-nums">{Number.isFinite(pct) ? `${pct}%` : "—"}</span>
              </div>

              <div className="mt-1 h-2 overflow-hidden rounded bg-white/10">
                <div
                  className="h-full rounded will-change-[width] motion-safe:transition-[width] motion-safe:duration-300"
                  style={{
                    width: `${clampedPct}%`,
                    backgroundImage: `linear-gradient(90deg, ${st.barFrom}, ${st.barTo})`,
                  }}
                  aria-hidden
                />
              </div>

              <div className="mt-1 text-[11px] text-white/60 tabular-nums">
                Вклад: {nf.format(Math.round(safeValue))}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ——— Skeleton строки ——— */
function SkelRow() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2">
      <div className="flex items-center justify-between">
        <span className="h-4 w-28 animate-pulse rounded bg-white/10" />
        <span className="h-4 w-8 animate-pulse rounded bg-white/10" />
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded bg-white/10">
        <div className="h-full w-1/2 animate-pulse rounded bg-white/20" />
      </div>
    </div>
  );
}