// app/demo/admin/dashboard/components/RevenueTrend.tsx
"use client";

import { useEffect, useMemo, useRef, useState, useId } from "react";
import { usePathname, useRouter } from "next/navigation";
import { mockRevenueTrend } from "../data/mockAdminDashboard";

type DashboardPeriod = "7d" | "30d" | "q" | "y";
type DashboardChannel = "all" | "online" | "manager";
type DashboardLocation = "all" | "center" | "south" | "north";
type DashboardCurrency = "RUB" | "KRW" | "USD";

export type RevenueTrendProps = {
  className?: string;
  period: DashboardPeriod | string;
  channel: DashboardChannel | string;
  location: DashboardLocation | string;
  currency: DashboardCurrency | string;
  /** Базовый префикс ссылок (по умолчанию определяется по URL): /demo/admin | /demo/manager | /demo/user */
  baseHref?: "/demo/admin" | "/demo/manager" | "/demo/user" | string;
  /** Частота обновления, мс (0 — без polling) */
  pollMs?: number;
};

type TrendPoint = { date: string; revenue: number };
type TrendResponse = { points: TrendPoint[]; min: number; max: number };

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
function fmtMoney(v: number, currency?: string, locale = "ru-RU") {
  if (!Number.isFinite(v)) return "—";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: (currency as string) || "RUB",
      maximumFractionDigits: 0,
      currencyDisplay: "narrowSymbol",
    }).format(v);
  } catch {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(v)} ${currency ?? ""}`.trim();
  }
}

async function fetchRevenueTrend(params: {
  period?: string;
  channel?: string;
  location?: string;
  signal?: AbortSignal;
}): Promise<TrendResponse> {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([k, v]) => k !== "signal" && v != null && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  try {
    const res = await fetch(`/api/metrics/revenue-trend${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
      signal: params.signal,
    });
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as TrendResponse;
    if (!Array.isArray(json?.points)) throw new Error("Invalid shape");
    return json;
  } catch {
    const { points, min, max } = mockRevenueTrend({
      period: params.period ?? "30d",
      channel: params.channel ?? "all",
      location: params.location ?? "all",
    });
    return { points, min, max };
  }
}

export default function RevenueTrend({
  className = "",
  period,
  channel,
  location,
  currency,
  baseHref,
  pollMs = 60_000,
}: RevenueTrendProps) {
  const pathname = usePathname();
  const router = useRouter();
  const resolvedBase = getBase(baseHref, pathname);

  const gradId = useId(); // уникальный id градиента

  const [data, setData] = useState<TrendResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // для тултипа
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      const d = await fetchRevenueTrend({ period, channel, location, signal: controller.signal });
      if (!alive) return;
      setData(d);
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
  }, [period, channel, location, pollMs]);

  const points = data?.points ?? [];
  const min = Number.isFinite(data?.min) ? (data?.min as number) : 0;
  const max = Number.isFinite(data?.max) ? (data?.max as number) : 1;

  // размеры графика (адаптивная ширина, фиксированная высота)
  const W = 560;
  const H = 220;
  const pad = 28;

  const scaleX = (i: number) => pad + (i * (W - pad * 2)) / Math.max(points.length - 1, 1);
  const scaleY = (v: number) => {
    const rng = Math.max(1, max - min);
    return H - pad - ((v - min) * (H - pad * 2)) / rng;
  };

  const path = useMemo(() => {
    if (points.length === 0) return "";
    return points.map((p, i) => `${i ? "L" : "M"}${scaleX(i)},${scaleY(p.revenue)}`).join(" ");
  }, [points, min, max]);

  // area под линией
  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const top = points.map((p, i) => `${i ? "L" : "M"}${scaleX(i)},${scaleY(p.revenue)}`).join(" ");
    const lastX = scaleX(points.length - 1);
    const baseY = H - pad;
    return `${top} L${lastX},${baseY} L${pad},${baseY} Z`;
  }, [points, min, max]);

  // переход к списку заказов по ближайшей точке
  const goToDate = (date: string) => {
    router.push(`${resolvedBase}/orders?date=${encodeURIComponent(date)}`);
  };

  const projectClientX = (clientX: number) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    return clientX - rect.left;
  };

  const nearestIndexByClientX = (clientX: number | null) => {
    if (clientX == null || points.length === 0) return null;
    const rect = svgRef.current!.getBoundingClientRect();
    const x = clientX * (W / rect.width);
    let closestIdx = 0;
    let closestDist = Infinity;
    for (let i = 0; i < points.length; i++) {
      const dx = Math.abs(scaleX(i) - x);
      if (dx < closestDist) {
        closestDist = dx;
        closestIdx = i;
      }
    }
    return closestIdx;
  };

  // мышь/тач
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const idx = nearestIndexByClientX(projectClientX(e.clientX));
    if (idx == null) return;
    goToDate(points[idx].date);
  };
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const idx = nearestIndexByClientX(projectClientX(e.clientX));
    if (idx == null) return;
    setHoverIdx(idx);
  };
  const handlePointerLeave = () => setHoverIdx(null);

  // клавиатура на точках
  const onPointKey = (i: number) => (e: React.KeyboardEvent<SVGCircleElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToDate(points[i].date);
    }
  };

  const periodLabel =
    points.length > 0 ? `${points[0]?.date} — ${points.at(-1)?.date}` : "—";

  return (
    <section
      className={cls(
        "rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 backdrop-blur-sm",
        className
      )}
      aria-labelledby="revenue-trend-title"
    >
      <div className="flex items-center justify-between">
        <div id="revenue-trend-title" className="text-sm font-medium">
          Выручка по дням
        </div>
        <div className="text-xs text-white/70">{periodLabel}</div>
      </div>

      <div className="mt-2 overflow-x-auto">
        {loading && !data && (
          <div className="h-[220px] w-full rounded-xl border border-white/10 bg-white/5 animate-pulse" />
        )}

        {!loading && points.length === 0 && (
          <div className="h-[220px] w-full rounded-xl border border-white/10 bg-white/5 grid place-items-center text-sm text-white/70">
            Нет данных для выбранных фильтров
          </div>
        )}

        {points.length > 0 && (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="h-[220px] w-full touch-pan-x"
            onClick={handleSvgClick}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            role="img"
            aria-label="График выручки по дням. Нажмите на точку или на график, чтобы открыть заказы этого дня."
          >
            <defs>
              <linearGradient id={`revArea-${gradId}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* ось X */}
            <line
              x1={pad}
              x2={W - pad}
              y1={H - pad}
              y2={H - pad}
              stroke="currentColor"
              className="opacity-20"
            />

            {/* area под линией */}
            <path d={areaPath} fill={`url(#revArea-${gradId})`} className="opacity-90" />

            {/* линия тренда */}
            <path
              d={path}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="opacity-85"
            />

            {/* точки — фокусируемы с клавиатуры */}
            {points.map((p, i) => (
              <circle
                key={p.date}
                cx={scaleX(i)}
                cy={scaleY(p.revenue)}
                r={hoverIdx === i ? 4 : 3}
                className={cls(
                  "fill-white/80 transition-[r,opacity]",
                  hoverIdx === i ? "opacity-100" : "opacity-80"
                )}
                tabIndex={0}
                role="button"
                aria-label={`${p.date}: ${fmtMoney(p.revenue, currency)} — открыть заказы за день`}
                onKeyDown={onPointKey(i)}
                onFocus={() => setHoverIdx(i)}
                onBlur={() => setHoverIdx((cur) => (cur === i ? null : cur))}
              />
            ))}

            {/* тултип */}
            {hoverIdx != null && points[hoverIdx] && (
              <g>
                {/* вертикальная линия */}
                <line
                  x1={scaleX(hoverIdx)}
                  x2={scaleX(hoverIdx)}
                  y1={pad}
                  y2={H - pad}
                  stroke="currentColor"
                  className="opacity-20"
                />
                {/* bubble */}
                {(() => {
                  const x = scaleX(hoverIdx);
                  const y = scaleY(points[hoverIdx].revenue) - 10;
                  const label = fmtMoney(points[hoverIdx].revenue, currency);
                  const date = points[hoverIdx].date;
                  const bw = 148;
                  const bh = 36;
                  const bx = Math.min(Math.max(pad, x - bw / 2), W - pad - bw);
                  const by = Math.max(pad, y - bh);
                  return (
                    <>
                      <rect
                        x={bx}
                        y={by}
                        width={bw}
                        height={bh}
                        rx={8}
                        className="fill-black/70"
                        stroke="currentColor"
                        strokeOpacity={0.15}
                      />
                      <text x={bx + 8} y={by + 14} className="fill-white/80" fontSize="10">
                        {date}
                      </text>
                      <text x={bx + 8} y={by + 27} className="fill-white font-semibold" fontSize="12">
                        {label}
                      </text>
                    </>
                  );
                })()}
              </g>
            )}
          </svg>
        )}
      </div>

      <div className="mt-1 text-xs text-white/60">
        Клик по графику откроет заказы за выбранный день • Валюта: {currency}
      </div>
    </section>
  );
}