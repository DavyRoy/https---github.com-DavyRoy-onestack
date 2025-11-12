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
}): Promise<{ data: TrendResponse; source: "api" | "mock" }> {
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
    return { data: json, source: "api" };
  } catch {
    const { points, min, max } = mockRevenueTrend({
      period: params.period ?? "30d",
      channel: params.channel ?? "all",
      location: params.location ?? "all",
    });
    return { data: { points, min, max }, source: "mock" };
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
  const [source, setSource] = useState<"api" | "mock">("api");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // интерактив
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // респонсив: ширина SVG = ширине контейнера
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [width, setWidth] = useState<number>(560);
  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr?.width) setWidth(Math.max(320, Math.round(cr.width)));
    });
    ro.observe(el);
    setWidth(Math.max(320, Math.round(el.getBoundingClientRect().width)));
    return () => ro.disconnect();
  }, []);

  // защита от гонок + пауза пуллинга на скрытой вкладке
  const inFlightCtrl = useRef<AbortController | null>(null);
  const intervalRef = useRef<number | null>(null);

  const run = async () => {
    inFlightCtrl.current?.abort();
    const ctrl = new AbortController();
    inFlightCtrl.current = ctrl;
    setLoading(true);
    setError(null);
    try {
      const { data, source } = await fetchRevenueTrend({ period, channel, location, signal: ctrl.signal });
      // нормализуем/клампим
      const safePoints = (data.points ?? []).map((p) => ({
        date: p.date,
        revenue: Math.max(0, Number.isFinite(p.revenue) ? p.revenue : 0),
      }));
      const min = Math.min(...safePoints.map((p) => p.revenue), Number.isFinite(data.min) ? data.min : 0);
      const maxRaw = Math.max(...safePoints.map((p) => p.revenue), Number.isFinite(data.max) ? data.max : 1);
      const max = Math.max(min + 1, maxRaw); // защита от 0-диапазона
      setData({ points: safePoints, min, max });
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
    const onVis = () => {
      if (document.visibilityState === "visible") run();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      if (intervalRef.current) clearInterval(intervalRef.current);
      inFlightCtrl.current?.abort();
    };
  }, [period, channel, location, pollMs]);

  const points = data?.points ?? [];
  const min = Number.isFinite(data?.min) ? (data!.min as number) : 0;
  const max = Number.isFinite(data?.max) ? (data!.max as number) : 1;

  // размеры графика (резиновая ширина, фиксированная высота)
  const W = width;
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
  }, [points, min, max, W]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const top = points.map((p, i) => `${i ? "L" : "M"}${scaleX(i)},${scaleY(p.revenue)}`).join(" ");
    const lastX = scaleX(points.length - 1);
    const baseY = H - pad;
    return `${top} L${lastX},${baseY} L${pad},${baseY} Z`;
  }, [points, min, max, W]);

  // цвет тренда: рост/падение
  const trendColor = useMemo(() => {
    if (points.length < 2) return "#ffffff";
    const diff = points[points.length - 1].revenue - points[0].revenue;
    return diff >= 0 ? "#34d399" /* emerald-400 */ : "#f87171" /* red-400 */;
  }, [points]);

  const goToDate = (date: string) => {
    router.push(`${resolvedBase}/orders?date=${encodeURIComponent(date)}`);
  };

  // перевод clientX → локальные координаты SVG (с учётом реальной ширины)
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

  // мышь/тач (throttle через rAF)
  const rafRef = useRef<number | null>(null);
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    const cx = projectClientX(e.clientX);
    rafRef.current = requestAnimationFrame(() => {
      const idx = nearestIndexByClientX(cx);
      if (idx != null) setHoverIdx(idx);
    });
  };
  const handlePointerLeave = () => setHoverIdx(null);
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const idx = nearestIndexByClientX(projectClientX(e.clientX));
    if (idx == null) return;
    goToDate(points[idx].date);
  };

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
        "min-w-0",
        className
      )}
      aria-labelledby="revenue-trend-title"
      role="region"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2">
          <h3 id="revenue-trend-title" className="text-sm font-medium">
            Выручка по дням
          </h3>
          {!loading && source === "mock" && (
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">
              демо-данные
            </span>
          )}
        </div>
        <div className="text-xs text-white/70">{periodLabel}</div>
      </div>

      <div ref={wrapRef} className="mt-2">
        {loading && !data && (
          <div className="h-[220px] w-full animate-pulse rounded-xl border border-white/10 bg-white/5" />
        )}

        {!loading && error && (
          <div className="grid h-[220px] w-full place-items-center rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
            <div className="flex items-center gap-3">
              <span>Не удалось загрузить тренд: {error}</span>
              <button
                type="button"
                onClick={run}
                className="rounded border border-red-300/30 bg-red-300/10 px-2 py-1 text-xs hover:bg-red-300/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Повторить
              </button>
            </div>
          </div>
        )}

        {!loading && !error && points.length === 0 && (
          <div className="grid h-[220px] w-full place-items-center rounded-xl border border-white/10 bg-white/5 text-sm text-white/70">
            Нет данных для выбранных фильтров
          </div>
        )}

        {!loading && !error && points.length > 0 && (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="h-[220px] w-full touch-pan-x"
            onClick={handleSvgClick}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            role="img"
            aria-label="График выручки по дням. Нажмите на точку или на график, чтобы открыть заказы этого дня."
            aria-live="polite"
            style={{ color: trendColor }}
          >
            <defs>
              <linearGradient id={`revArea-${gradId}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* ось X */}
            <line x1={pad} x2={W - pad} y1={H - pad} y2={H - pad} stroke="currentColor" className="opacity-20" />

            {/* area под линией */}
            <path d={areaPath} fill={`url(#revArea-${gradId})`} className="opacity-90" />

            {/* линия тренда */}
            <path d={path} fill="none" stroke="currentColor" strokeWidth="2" className="opacity-85" />

            {/* точки — фокусируемы с клавиатуры; увеличенный hit-area через r */}
            {points.map((p, i) => (
              <circle
                key={p.date}
                cx={scaleX(i)}
                cy={scaleY(p.revenue)}
                r={hoverIdx === i ? 5 : 4}
                className={cls("fill-white/90 transition-[r,opacity]", hoverIdx === i ? "opacity-100" : "opacity-80")}
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