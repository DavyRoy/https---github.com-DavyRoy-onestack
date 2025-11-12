// src/app/demo/admin/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users2,
  Activity,
  AlertTriangle,
  KeyRound,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Gauge,
  Timer,
  Cpu,
} from "lucide-react";
import Link from "next/link";

/* ------------------------------- demo data ------------------------------- */
type OrderRow = {
  id: string;
  name: string;
  status: "новый" | "в работе" | "доставлен";
  owner?: string;
  updated: string;
};

const chartData = [
  { d: "Пн", rps: 230 },
  { d: "Вт", rps: 290 },
  { d: "Ср", rps: 270 },
  { d: "Чт", rps: 340 },
  { d: "Пт", rps: 380 },
  { d: "Сб", rps: 210 },
  { d: "Вс", rps: 190 },
];

const endpoints = [
  { ep: "/api/orders", rps: 120 },
  { ep: "/api/users", rps: 96 },
  { ep: "/api/auth", rps: 84 },
  { ep: "/api/metrics", rps: 63 },
];

const errDist = [
  { name: "4xx", value: 62 },
  { name: "5xx", value: 28 },
  { name: "Timeout", value: 10 },
];

const ERR_COLORS = ["#34D399", "#60A5FA", "#FBBF24"]; // emerald / sky / amber
const BAR_COLORS = ["#60A5FA", "#34D399", "#A78BFA", "#F59E0B"]; // sky / emerald / violet / amber

/* ------------------------------ ui helpers ------------------------------- */

function KpiCard({
  title,
  value,
  note,
  icon,
  delta,
  direction = "up",
  tone = "emerald",
  loading,
}: {
  title: string;
  value: string;
  note?: string;
  icon: React.ReactNode;
  delta?: string;
  direction?: "up" | "down";
  tone?: "emerald" | "sky" | "violet" | "amber";
  loading?: boolean;
}) {
  const toneBg =
    tone === "emerald"
      ? "from-emerald-400/18 to-emerald-400/0"
      : tone === "sky"
      ? "from-sky-400/18 to-sky-400/0"
      : tone === "violet"
      ? "from-violet-400/18 to-violet-400/0"
      : "from-amber-400/18 to-amber-400/0";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f10] p-5 hover:bg-white/[0.03] transition">
      <div className={`pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full bg-gradient-to-br ${toneBg} blur-2xl`} />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className={loading ? "animate-pulse" : ""}>
          <div className="text-[11px] uppercase tracking-[0.16em] text-white/60">{title}</div>
          <div className="mt-1 text-3xl font-extrabold tabular-nums">
            {loading ? <Skeleton w="6rem" h="1.9rem" /> : value}
          </div>
          {note && <div className="text-xs text-white/60 mt-1">{note}</div>}
          {delta && !loading && (
            <div
              className={`mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] leading-5 ${
                direction === "up"
                  ? "border-emerald-400/40 text-emerald-200"
                  : "border-rose-400/40 text-rose-200"
              }`}
              aria-label={`Δ ${delta}`}
            >
              {direction === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {delta}
            </div>
          )}
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 border border-white/10" aria-hidden>
          {icon}
        </span>
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
  footer,
  loading,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <section aria-label={title} className="rounded-2xl border border-white/10 bg-[#0b0d0e] hover:bg-white/[0.02] transition">
      <div className="px-5 py-3 border-b border-white/10 text-sm font-semibold">{title}</div>
      <div className="p-4 sm:p-5">{loading ? <ChartSkeleton /> : children}</div>
      {footer && <div className="px-5 py-3 border-t border-white/10 text-xs text-white/70">{footer}</div>}
    </section>
  );
}

function MiniMetric({
  icon,
  title,
  value,
  note,
  loading,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  note: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 hover:bg-white/[0.05] transition">
      <div className="flex items-center gap-2 text-white/85">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.07]" aria-hidden>
          {icon}
        </span>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="mt-1 text-2xl font-extrabold tabular-nums">
        {loading ? <Skeleton w="4.5rem" h="1.6rem" /> : value}
      </div>
      <div className="text-xs text-white/60">{note}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderRow["status"] }) {
  const colors =
    status === "новый"
      ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/40"
      : status === "в работе"
      ? "bg-sky-500/20 text-sky-200 border-sky-400/40"
      : "bg-violet-500/20 text-violet-200 border-violet-400/40";
  return <span className={`rounded-full border px-2 py-0.5 text-[11px] ${colors}`}>{status}</span>;
}

/* ----------------------------- small pieces ------------------------------ */
function Skeleton({ w = "100%", h = "1rem" }: { w?: string; h?: string }) {
  return <span style={{ width: w, height: h }} className="inline-block rounded bg-white/10" />;
}
function ChartSkeleton() {
  return <div className="h-64 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] animate-pulse" />;
}
function DarkTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-black/85 px-3 py-2 text-xs text-white/85 shadow-xl">
      <div className="text-white/60">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey + String(p.color)} className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color || "#fff" }} />
          <span className="text-white/90">{String(p.name || p.dataKey).toUpperCase()}:</span>
          <span className="tabular-nums">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------- page ---------------------------------- */
export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false); // защита от гидрации Recharts

  // pie state (для центрального индикатора)
  const [activeSlice, setActiveSlice] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const r = await fetch("/api/demo/orders", { cache: "no-store" }).then((x) => x.json());
        setOrders(r.items || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const lastOps = useMemo(() => orders.slice(0, 3), [orders]);

  const centerName =
    activeSlice == null ? "error rate" : errDist[activeSlice]?.name ?? "error rate";
  const centerVal =
    activeSlice == null ? "0.42%" : `${errDist[activeSlice]?.value ?? 0}%`;

  return (
    <div className="space-y-8">
      {/* top status */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/60">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5">env: demo</span>
          <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5">v1.2.3</span>
          <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5">uptime 99.98%</span>
        </div>
        <span className="inline-flex items-center gap-1 text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Демо-данные
        </span>
      </div>

      {/* header */}
      <header>
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">Админ-панель</h1>
        <p className="mt-1 text-white/70">
          Обзор ключевых показателей: пользователи, события, API-нагрузка и ошибки.
        </p>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Пользователи" value="5 432" note="зарегистрированных" icon={<Users2 className="h-5 w-5" />} delta="+2.1% неделя" tone="emerald" loading={loading} />
        <KpiCard title="События/сутки" value="128 k" note="логируемых" icon={<Activity className="h-5 w-5" />} delta="+4.8%" tone="sky" loading={loading} />
        <KpiCard title="Ошибки (p99)" value="0.06%" note="за сутки" icon={<AlertTriangle className="h-5 w-5" />} delta="-0.01%" direction="down" tone="violet" loading={loading} />
        <KpiCard title="Активные API-ключи" value="7" note="используются клиентами" icon={<KeyRound className="h-5 w-5" />} delta="стабильно" tone="amber" loading={loading} />
      </div>

      {/* main row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="RPS · последняя неделя" loading={!mounted}>
          {mounted && (
            <div className="h-[260px] sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ left: 8, right: 8, top: 10 }}>
                  <defs>
                    <linearGradient id="rpsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.38} />
                      <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.06} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="d" tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.18)" }} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.18)" }} tickLine={false} />
                  <Tooltip content={<DarkTooltip />} />
                  <Area type="monotone" dataKey="rps" name="RPS" stroke="#60A5FA" strokeWidth={2} fill="url(#rpsFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Panel>

        <Panel title="Последние операции">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-sm">
              <thead className="sticky top-0 bg-black/30 backdrop-blur-md z-10">
                <tr className="text-left text-white/60">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Название</th>
                  <th className="py-2 pr-4">Статус</th>
                  <th className="py-2 pr-4">Ответственный</th>
                  <th className="py-2 pr-4">Обновлено</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading && (
                  <>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i}>
                        <td className="py-2 pr-4"><Skeleton w="5rem" /></td>
                        <td className="py-2 pr-4"><Skeleton w="10rem" /></td>
                        <td className="py-2 pr-4"><Skeleton w="4rem" /></td>
                        <td className="py-2 pr-4"><Skeleton w="6rem" /></td>
                        <td className="py-2 pr-4"><Skeleton w="5rem" /></td>
                      </tr>
                    ))}
                  </>
                )}
                {!loading && lastOps.length > 0 && lastOps.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.03] transition">
                    <td className="py-2 pr-4">{r.id}</td>
                    <td className="py-2 pr-4">{r.name}</td>
                    <td className="py-2 pr-4"><StatusBadge status={r.status} /></td>
                    <td className="py-2 pr-4">{r.owner || "—"}</td>
                    <td className="py-2 pr-4 text-white/60">{r.updated}</td>
                  </tr>
                ))}
                {!loading && lastOps.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-white/60">Нет данных</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-white/70 flex items-center justify-between">
            <Link href="/demo/admin/events" className="hover:text-white">Открыть полный список →</Link>
          </div>
        </Panel>
      </div>

      {/* bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Panel title="Топ эндпоинтов по RPS" footer="Срез за последний час (demo)" loading={!mounted}>
          {mounted && (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={endpoints} margin={{ left: 8, right: 8, top: 6 }}>
                  <XAxis dataKey="ep" tick={{ fill: "rgba(255,255,255,0.85)", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.18)" }} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.85)", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.18)" }} tickLine={false} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="rps" name="RPS" radius={[8, 8, 0, 0]}>
                    {endpoints.map((_, i) => (
                      <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Panel>

        <Panel title="Ошибки по типам" footer="Доля от всех ошибок (demo)" loading={!mounted}>
          {mounted && (
            <>
              <div className="relative h-56 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<DarkTooltip />} />
                    <Pie
                      data={errDist}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={92}
                      paddingAngle={3}
                      stroke="rgba(255,255,255,0.25)"
                      onMouseEnter={(_, i) => setActiveSlice(i)}
                      onMouseLeave={() => setActiveSlice(null)}
                      onClick={(_, i) => setActiveSlice((prev) => (prev === i ? null : i))}
                      isAnimationActive={false}
                    >
                      {errDist.map((_, i) => (
                        <Cell
                          key={i}
                          fill={ERR_COLORS[i % ERR_COLORS.length]}
                          opacity={activeSlice == null || activeSlice === i ? 1 : 0.45}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* центр доната — меняется по ховеру/клику */}
                <div className="absolute text-center">
                  <div className="text-[11px] uppercase tracking-widest text-white/60">{centerName}</div>
                  <div className="text-2xl font-extrabold">{centerVal}</div>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-white/80">
                {errDist.map((i, idx) => (
                  <div
                    key={i.name}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1 ${
                      activeSlice === idx ? "bg-white/[0.06]" : "bg-transparent"
                    }`}
                  >
                    <span className="h-3 w-3 rounded-sm" style={{ background: ERR_COLORS[idx] }} />
                    <span className="truncate">{i.name}</span>
                    <span className="ml-auto tabular-nums">{i.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Panel>

        <Panel title="Сводка платформы" footer="Обновлено: пару минут назад">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MiniMetric icon={<Gauge className="h-4 w-4" />} title="Сред. ответ" value="142 ms" note="API за 24ч" loading={loading} />
            <MiniMetric icon={<Timer className="h-4 w-4" />} title="Ретраи задач" value="1.3%" note="за 24ч" loading={loading} />
            <MiniMetric icon={<Cpu className="h-4 w-4" />} title="DB p95" value="38 ms" note="PostgreSQL (read)" loading={loading} />
          </div>
        </Panel>
      </div>
    </div>
  );
}