// src/app/demo/admin/analytics/page.tsx
"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Panel } from "../../ui/DemoCards";

/* ============================== types ============================== */
type DayPoint = { d: string; rps: number; conv: number; err: number };
type Range = "7d" | "30d" | "90d";
type Metric = "rps" | "conv";
type EpFilter = "all" | "api" | "auth";

type TooltipPayload = {
  dataKey: keyof DayPoint;
  color?: string;
  name?: string;
  value: number;
};

const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;
const nfInt = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });
const nfPct = new Intl.NumberFormat("ru-RU", { style: "percent", maximumFractionDigits: 2 });
const fmtInt = (n: number) => nfInt.format(n);
const fmtPct = (fraction: number) => nfPct.format(fraction);

/* ============================ demo data ============================ */
function gen(range: Range): DayPoint[] {
  const n = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const arr: DayPoint[] = [];
  for (let i = 0; i < n; i++) {
    const base = 200 + 180 * Math.sin((i / n) * Math.PI * 2) + (i % 7 === 4 ? 80 : 0);
    const rps = Math.max(60, Math.round(base + (Math.random() - 0.5) * 40));
    const convPct = +(
      1.6 + 1.8 * Math.sin((i / n) * Math.PI * 2 + 0.6) + (Math.random() - 0.5) * 0.2
    ).toFixed(2);
    const err = +(0.18 + 0.3 * Math.abs(Math.sin(i / 7)) + Math.random() * 0.08).toFixed(2);
    const d = range === "7d" ? weekdays[i % 7] : `${i + 1}`;
    arr.push({ d, rps, conv: convPct, err });
  }
  return arr;
}
function derivePrevPeriod(current: DayPoint[]): DayPoint[] {
  return current.map((p, i) => ({
    d: p.d,
    rps: Math.max(40, Math.round(p.rps * (0.92 + 0.02 * Math.sin(i)))),
    conv: +(p.conv * (0.95 + 0.03 * Math.cos(i / 2))).toFixed(2),
    err: +(p.err * (1.08 - 0.03 * Math.sin(i / 3))).toFixed(2),
  }));
}

/* ============================= tooltip ============================= */
function DarkTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-black/85 px-2.5 py-2 text-[11px] text-white/85 shadow-xl">
      <div className="mb-1 text-white/60">{label}</div>
      {payload.map((p) => (
        <div key={`${String(p.dataKey)}-${String(p.color)}`} className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
          <span className="text-white/90">{String(p.name || p.dataKey).toUpperCase()}:</span>
          <span className="tabular-nums">
            {p.dataKey === "rps" ? fmtInt(p.value) : p.dataKey === "conv" ? `${p.value} %` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ============================== spark ============================== */
const Spark = ({ data, dataKey, stroke }: { data: DayPoint[]; dataKey: keyof DayPoint; stroke: string }) => (
  <div className="h-6 w-20">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
        <Area
          type="monotone"
          dataKey={dataKey as any}
          stroke={stroke}
          fillOpacity={0.12}
          fill={stroke}
          isAnimationActive={false}
          dot={false}
          strokeWidth={1}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

/* ============================ segmented ============================ */
function Segmented({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly { label: string; value: string }[];
  ariaLabel?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex rounded-full border px-1 py-1 backdrop-blur"
      style={{ borderColor: "var(--border)", background: "var(--seg-bg)" }}
    >
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`px-3 py-1 text-sm rounded-full transition whitespace-nowrap ${active ? "shadow" : ""}`}
            style={{
              color: active ? "var(--bg)" : "var(--fg-muted)",
              background: active ? "var(--fg)" : "transparent",
              boxShadow: active ? "0 4px 16px rgba(0,0,0,0.18)" : "none",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ============================ skeleton ============================= */
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-xl p-2" style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
          <div className="h-3 w-24 rounded mb-1.5" style={{ background: "var(--skeleton)" }} />
          <div className="h-6 w-16 rounded" style={{ background: "var(--skeleton)" }} />
        </div>
      ))}
    </div>
  );
}

/* ============================== helpers ============================ */
function pctDelta(curr: number, prev: number) {
  if (!isFinite(prev) || prev === 0) return 0;
  return ((curr - prev) / Math.abs(prev)) * 100;
}
function Pill({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const up = value >= 0;
  const sign = up ? "+" : "";
  return (
    <span
      className="ml-1 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
      style={{
        background: up ? "var(--pill-up-bg)" : "var(--pill-down-bg)",
        color: up ? "var(--pill-up-fg)" : "var(--pill-down-fg)",
      }}
    >
      {up ? "↑" : "↓"} {sign}
      {value.toFixed(1)}
      {suffix}
    </span>
  );
}

type EndpointRow = { path: string; rps: number; spark: number[] };
const ENDPOINTS_BASE: EndpointRow[] = [
  { path: "GET /api/orders", rps: 126, spark: [82, 90, 95, 110, 126, 120, 118] },
  { path: "POST /api/checkout", rps: 98, spark: [61, 70, 84, 93, 98, 96, 91] },
  { path: "GET /api/users", rps: 81, spark: [50, 55, 60, 70, 82, 81, 79] },
  { path: "POST /auth/login", rps: 64, spark: [40, 45, 58, 60, 64, 60, 58] },
  { path: "GET /api/report", rps: 51, spark: [35, 40, 42, 45, 51, 48, 46] },
];

/* =============================== page ============================== */
export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<Range>("7d");
  const [metric, setMetric] = useState<Metric>("rps");
  const [epFilter, setEpFilter] = useState<EpFilter>("all");
  const [compare, setCompare] = useState<boolean>(true);

  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<DayPoint[]>([]);
  const [prev, setPrev] = useState<DayPoint[]>([]);
  const [activePie, setActivePie] = useState<number | null>(null);

  const reduceMotion = useReducedMotion();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted) {
      const curr = gen(range);
      setData(curr);
      setPrev(derivePrevPeriod(curr));
    }
  }, [mounted, range]);

  // aggregates
  const kpi = useMemo(() => {
    if (!data.length) return { rpsAvg: null as number | null, convAvg: null as number | null, errP95: null as number | null };
    const rpsAvg = Math.round(data.reduce((s, x) => s + x.rps, 0) / data.length);
    const convAvg = +(data.reduce((s, x) => s + x.conv, 0) / data.length / 100).toFixed(4);
    const sorted = [...data].map((d) => d.err).sort((a, b) => a - b);
    const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * 0.95) - 1));
    const errP95 = +sorted[idx].toFixed(2);
    return { rpsAvg, convAvg, errP95 };
  }, [data]);

  const kpiPrev = useMemo(() => {
    if (!prev.length) return { rpsAvg: null as number | null, convAvg: null as number | null, errP95: null as number | null };
    const rpsAvg = Math.round(prev.reduce((s, x) => s + x.rps, 0) / prev.length);
    const convAvg = +(prev.reduce((s, x) => s + x.conv, 0) / prev.length / 100).toFixed(4);
    const sorted = [...prev].map((d) => d.err).sort((a, b) => a - b);
    const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * 0.95) - 1));
    const errP95 = +sorted[idx].toFixed(2);
    return { rpsAvg, convAvg, errP95 };
  }, [prev]);

  // color palette (fixed dark)
  const colors = {
    bg: "#0b0b0c",
    card: "rgba(255,255,255,0.04)",
    segBg: "rgba(255,255,255,0.04)",
    fg: "#e6e6eb",
    fgMuted: "rgba(230,230,235,0.75)",
    border: "rgba(255,255,255,0.12)",
    grid: "rgba(255,255,255,0.08)",
    skeleton: "rgba(255,255,255,0.10)",
    rps: "#22d3ee", // cyan
    conv: "#a78bfa", // purple
    bar1: "#34d399", // green
    bar2: "#60a5fa", // blue
    bar3: "#f59e0b", // amber
    areaErr: "rgba(239,68,68,0.18)",
    areaConv: "rgba(234,179,8,0.18)",
    pie: ["#ef4444", "#f59e0b", "#10b981"],
    pillUpBg: "rgba(16,185,129,0.15)",
    pillUpFg: "rgba(167,243,208,1)",
    pillDownBg: "rgba(244,63,94,0.15)",
    pillDownFg: "rgba(254,205,211,1)",
  };

  const themeVars = {
    "--bg": colors.bg,
    "--card": colors.card,
    "--seg-bg": colors.segBg,
    "--fg": colors.fg,
    "--fg-muted": colors.fgMuted,
    "--border": colors.border,
    "--grid": colors.grid,
    "--skeleton": colors.skeleton,
    "--pill-up-bg": colors.pillUpBg,
    "--pill-up-fg": colors.pillUpFg,
    "--pill-down-bg": colors.pillDownBg,
    "--pill-down-fg": colors.pillDownFg,
  } as React.CSSProperties;

  // annotations + incidents
  const annotations = useMemo(() => {
    if (!data.length) return [] as { x: string; label: string }[];
    const mid = Math.floor(data.length * 0.35);
    const nearEnd = Math.floor(data.length * 0.75);
    return [{ x: data[mid]?.d, label: "Deploy" }, { x: data[nearEnd]?.d, label: "Promo" }];
  }, [data]);

  const rpsP90 = useMemo(() => {
    const arr = data.map((d) => d.rps).sort((a, b) => a - b);
    if (!arr.length) return null;
    const idx = Math.min(arr.length - 1, Math.max(0, Math.ceil(arr.length * 0.9) - 1));
    return arr[idx];
  }, [data]);

  const incidents = useMemo(() => {
    if (!data.length) return [] as Array<{ start: string; end: string; kind: "err" | "conv" }>;
    const idxs: Array<{ s: number; e: number; kind: "err" | "conv" }> = [];
    const errThr = 0.45;
    const convDropThr = 1.3;
    let s = -1;
    for (let i = 0; i < data.length; i++) {
      const highErr = data[i].err >= errThr;
      if (highErr && s === -1) s = i;
      if ((!highErr || i === data.length - 1) && s !== -1) {
        const e = highErr ? i : i - 1;
        if (e - s >= 0) idxs.push({ s, e, kind: "err" });
        s = -1;
      }
    }
    let sd = -1;
    for (let i = 1; i < data.length; i++) {
      const drop = data[i].conv < convDropThr && data[i - 1].conv >= convDropThr;
      if (drop) sd = i;
      const recover = data[i].conv >= convDropThr && sd !== -1;
      if (recover) {
        idxs.push({ s: sd, e: i, kind: "conv" });
        sd = -1;
      }
    }
    return idxs.map(({ s, e, kind }) => ({ start: data[s].d, end: data[e].d, kind }));
  }, [data]);

  const endpoints = useMemo(() => {
    const base = ENDPOINTS_BASE;
    if (epFilter === "api") return base.filter((b) => b.path.includes("/api/"));
    if (epFilter === "auth") return base.filter((b) => b.path.includes("/auth/"));
    return base;
  }, [epFilter]);

  const [selectedEp, setSelectedEp] = useState<EndpointRow | null>(null);

  const gradId = useId();
  const barGrad = `barGrad-${gradId}`;
  const fadeUp = (d = 0) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.38, ease: "easeOut", delay: d },
  });

  return (
    <div className="space-y-5" style={themeVars}>
      {/* 1) Заголовок — однотонный белый */}
      <motion.header {...fadeUp(0)} className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[clamp(1.4rem,3vw,2rem)] font-extrabold leading-tight text-white">Аналитика</h1>
          <p style={{ color: "var(--fg-muted)" }} className="mt-0.5">
            Конверсия, нагрузки и тренды продукта.
          </p>
        </div>
        <Segmented
          ariaLabel="Сравнение"
          value={compare ? "on" : "off"}
          onChange={(v) => setCompare(v === "on")}
          options={[
            { label: "Compare", value: "on" },
            { label: "Solo", value: "off" },
          ]}
        />
      </motion.header>

      {/* 2) KPI — уменьшили расстояние внутри и между картами */}
      <motion.div role="region" aria-live="polite" aria-busy={!mounted || data.length === 0} {...fadeUp(0.03)}>
        {!mounted || data.length === 0 ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { title: "Средний RPS", color: colors.rps, value: kpi.rpsAvg !== null ? fmtInt(kpi.rpsAvg) : "—", prevVal: kpiPrev.rpsAvg ?? 0, key: "rps" as const },
              { title: "Средняя конверсия", color: colors.conv, value: kpi.convAvg !== null ? fmtPct(kpi.convAvg) : "—", prevVal: kpiPrev.convAvg ?? 0, key: "conv" as const },
              { title: "Ошибки p95", color: "#ef4444", value: kpi.errP95 !== null ? `${kpi.errP95}%` : "—", prevVal: kpiPrev.errP95 ?? 0, key: "err" as const },
            ].map((card) => {
              const currNum =
                card.key === "conv" ? (kpi.convAvg ?? 0) : card.key === "rps" ? (kpi.rpsAvg ?? 0) : (kpi.errP95 ?? 0);
              const prevNum =
                card.key === "conv" ? (kpiPrev.convAvg ?? 0) : card.key === "rps" ? (kpiPrev.rpsAvg ?? 0) : (kpiPrev.errP95 ?? 0);
              const delta = compare ? pctDelta(currNum, prevNum) : 0;
              return (
                <div key={card.title} className="rounded-xl p-2" style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[11px] uppercase tracking-widest" style={{ color: "var(--fg-muted)" }}>
                      {card.title}
                    </div>
                    {compare && <Pill value={delta} />}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[24px] font-extrabold tabular-nums text-white">{card.value}</div>
                    <Spark data={data} dataKey={card.key} stroke={card.color} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* 3) Charts */}
      <motion.div {...fadeUp(0.05)}>
        <Panel title="Нагрузки и конверсия" footer="Данные: demo">
          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Segmented
              ariaLabel="Диапазон времени"
              value={range}
              onChange={(v) => setRange(v as Range)}
              options={[
                { label: "7 дней", value: "7d" },
                { label: "30 дней", value: "30d" },
                { label: "90 дней", value: "90d" },
              ]}
            />
            <Segmented
              ariaLabel="Метрика"
              value={metric}
              onChange={(v) => setMetric(v as Metric)}
              options={[
                { label: "RPS", value: "rps" },
                { label: "CONV", value: "conv" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            {/* 3) увеличили окно бар-чарта (h-[280px]) */}
            <div className="h-[280px] rounded-xl p-2 xl:col-span-2" style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 6 }}>
                    <defs>
                      <linearGradient id={barGrad} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colors.bar2} stopOpacity={0.9} />
                        <stop offset="100%" stopColor={colors.bar2} stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={colors.grid} vertical={false} />
                    <XAxis dataKey="d" tick={{ fill: colors.fgMuted, fontSize: 11 }} axisLine={{ stroke: colors.border }} tickLine={false} />
                    <YAxis tick={{ fill: colors.fgMuted, fontSize: 11 }} axisLine={{ stroke: colors.border }} tickLine={false} />
                    <Tooltip content={<DarkTooltip />} />
                    {incidents.map((band, i) => (
                      <ReferenceArea key={`${band.start}-${band.end}-${i}`} x1={band.start} x2={band.end} fill={band.kind === "err" ? colors.areaErr : colors.areaConv} stroke="transparent" />
                    ))}
                    <Bar dataKey="rps" name="RPS" fill={`url(#${barGrad})`} radius={[6, 6, 2, 2]} />
                    {rpsP90 !== null && <ReferenceLine y={rpsP90} stroke={colors.rps} strokeDasharray="4 4" label={{ value: "p90", fill: colors.fgMuted, fontSize: 10 }} />}
                    {annotations.map((a) => (
                      <ReferenceLine key={a.x} x={a.x} stroke={colors.conv} strokeDasharray="3 3" label={{ value: a.label, position: "top", fill: colors.fgMuted, fontSize: 10 }} />
                    ))}
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* 5) Увеличили круговую диаграмму (inner 70 / outer 110) */}
            <div className="h-[280px] rounded-xl p-2 relative" style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip formatter={(v: number, n: string) => [`${v}%`, n]} />
                  <Pie
                    data={[{ name: "4xx", value: 62 }, { name: "5xx", value: 28 }, { name: "Timeout", value: 10 }]}
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    activeIndex={activePie ?? undefined}
                    activeShape={(props) => {
                      const RAD = Math.PI / 180;
                      const { cx, cy, midAngle, innerRadius, outerRadius, fill, payload, value } = props as any;
                      const sin = Math.sin(-RAD * midAngle);
                      const cos = Math.cos(-RAD * midAngle);
                      const sx = cx + (outerRadius + 8) * cos;
                      const sy = cy + (outerRadius + 8) * sin;
                      const mx = cx + (outerRadius + 18) * cos;
                      const my = cy + (outerRadius + 18) * sin;
                      const ex = mx + (cos >= 0 ? 14 : -14);
                      const ey = my;
                      return (
                        <g>
                          <Sector {...props} innerRadius={innerRadius} outerRadius={outerRadius + 8} />
                          <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                          <circle cx={ex} cy={ey} r={2.5} fill={fill} />
                          <text x={ex + (cos >= 0 ? 8 : -8)} y={ey} textAnchor={cos >= 0 ? "start" : "end"} fill="#fff" fontSize={12}>
                            {payload.name}: {value}%
                          </text>
                        </g>
                      );
                    }}
                    onClick={(_, idx) => setActivePie((p) => (p === idx ? null : idx))}
                    onMouseEnter={(_, idx) => setActivePie(idx)}
                    onMouseLeave={() => setActivePie(null)}
                  >
                    {([62, 28, 10] as const).map((_, i) => (
                      <Cell key={i} fill={colors.pie[i % colors.pie.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* центр — крупнее */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-xs text-white/70">Ошибки</div>
                  {activePie !== null ? (
                    <div className="tabular-nums font-bold text-white text-xl">
                      {["4xx", "5xx", "Timeout"][activePie]}: {[62, 28, 10][activePie]}%
                    </div>
                  ) : (
                    <div className="tabular-nums font-bold text-white text-xl">Всего: 100%</div>
                  )}
                </div>
              </div>

              <div className="mt-2 grid grid-cols-3 text-center text-xs text-white/70">
                {["4xx", "5xx", "Timeout"].map((name, i) => (
                  <div key={name} className="flex items-center justify-center gap-1">
                    <span className="h-2 w-2 rounded-full" style={{ background: colors.pie[i] }} />
                    {name}: <span className="tabular-nums text-white">{[62, 28, 10][i]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4) Увеличили расстояние между блоками (mt-5) */}
          <div className="mt-5 h-[240px] rounded-xl p-2" style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 6 }}>
                  <CartesianGrid stroke={colors.grid} vertical={false} />
                  <XAxis dataKey="d" tick={{ fill: colors.fgMuted, fontSize: 11 }} axisLine={{ stroke: colors.border }} tickLine={false} />
                  <YAxis tick={{ fill: colors.fgMuted, fontSize: 11 }} axisLine={{ stroke: colors.border }} tickLine={false} />
                  <Tooltip content={<DarkTooltip />} />
                  {metric === "rps" ? (
                    <Line type="monotone" dataKey="rps" name="RPS" stroke={colors.rps} strokeWidth={2} dot={false} />
                  ) : (
                    <Area type="monotone" dataKey="conv" name="CONV" stroke={colors.conv} fill={colors.conv + "22"} dot={false} />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>
      </motion.div>

      {/* endpoints */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <motion.div {...fadeUp(0.06)} className="xl:col-span-2">
          <Panel title="Топ эндпоинтов по RPS" footer="Срез за последний час (demo)">
            <div className="mb-2 flex items-center justify-between gap-2">
              <Segmented
                ariaLabel="Фильтр эндпоинтов"
                value={epFilter}
                onChange={(v) => setEpFilter(v as EpFilter)}
                options={[
                  { label: "Все", value: "all" },
                  { label: "/api/*", value: "api" },
                  { label: "/auth/*", value: "auth" },
                ]}
              />
              <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
                Нажмите строку для деталей
              </span>
            </div>

            <div className="space-y-1.5">
              {endpoints.map((e, idx) => {
                const barColor = [colors.bar1, colors.bar2, colors.bar3][idx % 3];
                return (
                  <button
                    key={e.path}
                    onClick={() => setSelectedEp(e)}
                    className="w-full text-left rounded-lg p-2 hover:brightness-110 transition"
                    style={{ border: "1px solid var(--border)", background: "var(--card)", color: "var(--fg)" }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm">{e.path}</div>
                      <div className="text-sm tabular-nums">{fmtInt(e.rps)}</div>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full overflow-hidden" aria-hidden>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(100, (e.rps / 126) * 100)}%`, background: barColor }} />
                    </div>
                    <div className="mt-1 h-8 w-full" aria-hidden>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={e.spark.map((v, i) => ({ i, v }))} margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                          <Area type="monotone" dataKey="v" stroke={barColor} fillOpacity={0.12} fill={barColor} isAnimationActive={false} dot={false} strokeWidth={1} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </button>
                );
              })}
            </div>
          </Panel>
        </motion.div>

        <motion.div {...fadeUp(0.08)}>
          <Panel title="Авто-инсайты" footer="Генерируется из данных (demo)">
            <ul className="space-y-1.5 text-sm text-white">
              <li>✅ Пики RPS на уровне p90 ≈ <span className="tabular-nums">{rpsP90 ?? 0}</span>.</li>
              <li>📈 Конверсия {compare && (pctDelta(kpi.convAvg ?? 0, kpiPrev.convAvg ?? 0) >= 0 ? "растёт" : "снижается")} по сравнению с предыдущим периодом.</li>
              <li>⚠️ Отмечены интервалы: красные — высокий % ошибок, жёлтые — просадки конверсии.</li>
            </ul>
          </Panel>
        </motion.div>
      </div>

      {/* endpoint modal */}
      <AnimatePresence>
        {selectedEp && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setSelectedEp(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="w-full max-w-2xl rounded-2xl"
              style={{ background: "var(--bg)", color: "var(--fg)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between p-4">
                <div className="font-semibold">{selectedEp.path}</div>
                <button
                  onClick={() => setSelectedEp(null)}
                  className="rounded-full px-3 py-1 text-sm"
                  style={{ border: "1px solid var(--border)", background: "var(--card)", color: "var(--fg)" }}
                >
                  Закрыть
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 pt-0">
                <div className="h-44 rounded-xl p-1.5" style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={selectedEp.spark.map((v, i) => ({ d: i + 1, rps: v }))}>
                      <CartesianGrid stroke={colors.grid} vertical={false} />
                      <XAxis dataKey="d" tick={{ fill: colors.fgMuted, fontSize: 11 }} axisLine={{ stroke: colors.border }} tickLine={false} />
                      <YAxis tick={{ fill: colors.fgMuted, fontSize: 11 }} axisLine={{ stroke: colors.border }} tickLine={false} />
                      <Tooltip content={<DarkTooltip />} />
                      <Bar dataKey="rps" name="RPS" fill={colors.bar2} fillOpacity={0.35} radius={[6, 6, 2, 2]} />
                      <Line type="monotone" dataKey="rps" stroke={colors.rps} dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-44 rounded-xl p-1.5" style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={selectedEp.spark.map((_, i) => ({ d: i + 1, p95: Math.max(220, 240 + (i % 4) * 20) }))}>
                      <CartesianGrid stroke={colors.grid} vertical={false} />
                      <XAxis dataKey="d" tick={{ fill: colors.fgMuted, fontSize: 11 }} axisLine={{ stroke: colors.border }} tickLine={false} />
                      <YAxis tick={{ fill: colors.fgMuted, fontSize: 11 }} axisLine={{ stroke: colors.border }} tickLine={false} />
                      <Tooltip content={<DarkTooltip />} />
                      <Area type="monotone" dataKey="p95" stroke={colors.conv} fill={colors.conv + "22"} dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="p-4 pt-0 text-xs" style={{ color: "var(--fg-muted)" }}>
                Подсказка: демо-данные. Здесь могут появиться логи запросов, последние ошибки, похожие эндпоинты.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}