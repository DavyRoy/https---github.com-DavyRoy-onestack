// app/demo/admin/dashboard/components/OpsHealth.tsx
"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { mockOpsHealth } from "../data/mockAdminDashboard";
import { Ban, UserX, Clock3, CheckCircle2 } from "lucide-react";

type DashboardPeriod = "7d" | "30d" | "q" | "y";

export type OpsHealthProps = {
  className?: string;
  period: DashboardPeriod | string;
  /** Базовый префикс ссылок; по умолчанию берётся из URL (/demo/admin|manager|user) */
  baseHref?: "/demo/admin" | "/demo/manager" | "/demo/user" | string;
  /** Частота обновления (мс). 0 — отключить polling. */
  pollMs?: number;
};

type OpsHealthMetrics = {
  cancellations: number;     // %
  noshow: number;            // %
  firstResponseMin: number;  // минуты
  sla: number;               // %
};

/* ── utils ─────────────────────────────────────────────────────────────── */
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
function clamp01pct(v?: number) {
  if (typeof v !== "number" || !Number.isFinite(v)) return NaN;
  return Math.max(0, Math.min(100, v));
}
function fmtPct(v?: number) {
  const c = clamp01pct(v);
  if (!Number.isFinite(c)) return "—";
  return `${Math.round(c)}%`;
}
function fmtMin(v?: number) {
  if (typeof v !== "number" || !Number.isFinite(v)) return "—";
  return `${Math.max(0, Math.round(v))} мин`;
}
// Статусы по порогам
function badgeByPct(kind: "bad" | "good", v: number) {
  // kind=bad: выше — хуже (отмены, no-show). kind=good: выше — лучше (SLA)
  if (kind === "bad") {
    if (v >= 20) return { cls: "bg-red-400/15 text-red-200", label: "Плохо" };
    if (v >= 10) return { cls: "bg-amber-400/15 text-amber-200", label: "Внимание" };
    return { cls: "bg-emerald-400/15 text-emerald-200", label: "Ок" };
  } else {
    if (v >= 90) return { cls: "bg-emerald-400/15 text-emerald-200", label: "Ок" };
    if (v >= 75) return { cls: "bg-amber-400/15 text-amber-200", label: "Внимание" };
    return { cls: "bg-red-400/15 text-red-200", label: "Плохо" };
  }
}
function badgeByMinutes(v: number) {
  if (v <= 10) return { cls: "bg-emerald-400/15 text-emerald-200", label: "Ок" };
  if (v <= 30) return { cls: "bg-amber-400/15 text-amber-200", label: "Внимание" };
  return { cls: "bg-red-400/15 text-red-200", label: "Плохо" };
}

async function fetchOpsHealth(params: {
  period?: string;
  signal?: AbortSignal;
}): Promise<{ data: OpsHealthMetrics; source: "api" | "mock" }> {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([k, v]) => k !== "signal" && v != null && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  try {
    const res = await fetch(`/api/metrics/ops-health${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
      signal: params.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as OpsHealthMetrics;
    if (
      typeof json?.cancellations !== "number" ||
      typeof json?.noshow !== "number" ||
      typeof json?.firstResponseMin !== "number" ||
      typeof json?.sla !== "number"
    ) {
      throw new Error("Invalid response shape");
    }
    return { data: json, source: "api" };
  } catch {
    const m = mockOpsHealth({ period: params.period ?? "30d" });
    return {
      data: {
        cancellations: m.cancellations,
        noshow: m.noshow,
        firstResponseMin: m.firstResponseMin,
        sla: m.sla,
      },
      source: "mock",
    };
  }
}

/* ── component ─────────────────────────────────────────────────────────── */
export default function OpsHealth({
  className = "",
  period,
  baseHref,
  pollMs = 120_000,
}: OpsHealthProps) {
  const pathname = usePathname();
  const resolvedBase = getBase(baseHref, pathname);
  const uid = useId();
  const titleId = `opshealth-title-${uid}`;

  const [data, setData] = useState<OpsHealthMetrics | null>(null);
  const [source, setSource] = useState<"api" | "mock">("api");
  const [loading, setLoading] = useState(true);

  // защита от гонок: отменяем предыдущий запрос, ставим пуллинг на паузу при скрытой вкладке
  const inFlightCtrl = useRef<AbortController | null>(null);
  const intervalRef = useRef<number | null>(null);

  const run = async () => {
    inFlightCtrl.current?.abort();
    const ctrl = new AbortController();
    inFlightCtrl.current = ctrl;
    setLoading(true);
    try {
      const { data, source } = await fetchOpsHealth({ period, signal: ctrl.signal });
      if (ctrl.signal.aborted) return;

      // нормализуем значения
      const safe = {
        cancellations: clamp01pct(data.cancellations) || 0,
        noshow: clamp01pct(data.noshow) || 0,
        firstResponseMin: Math.max(
          0,
          Number.isFinite(data.firstResponseMin) ? data.firstResponseMin : 0
        ),
        sla: clamp01pct(data.sla) || 0,
      };
      setData(safe);
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
  }, [period, pollMs]);

  const m =
    data ?? { cancellations: NaN, noshow: NaN, firstResponseMin: NaN, sla: NaN };

  const cancBadge = Number.isFinite(m.cancellations)
    ? badgeByPct("bad", m.cancellations)
    : { cls: "bg-white/10 text-white/60", label: "—" };
  const nsBadge = Number.isFinite(m.noshow)
    ? badgeByPct("bad", m.noshow)
    : { cls: "bg-white/10 text-white/60", label: "—" };
  const frBadge = Number.isFinite(m.firstResponseMin)
    ? badgeByMinutes(m.firstResponseMin)
    : { cls: "bg-white/10 text-white/60", label: "—" };
  const slaBadge = Number.isFinite(m.sla)
    ? badgeByPct("good", m.sla)
    : { cls: "bg-white/10 text-white/60", label: "—" };

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
      <div className="flex items-center justify-between gap-2">
        <h3 id={titleId} className="text-sm font-medium truncate">
          Операционное здоровье
        </h3>
        <div className="flex items-center gap-2">
          {!loading && source === "mock" && (
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">
              демо-данные
            </span>
          )}
          <Link
            href={`${resolvedBase}/reports/booking`}
            prefetch={false}
            className="rounded-xl border border-white/15 bg-white px-3 py-1.5 text-sm font-medium text-black transition hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label="Открыть отчёт по бронированиям"
          >
            Отчёт бронирований
          </Link>
        </div>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2" role="list" aria-live="polite">
        <Chip
          icon={<Ban width={14} height={14} />}
          title="Отмены"
          value={fmtPct(m.cancellations)}
          loading={loading}
          badgeClass={cancBadge.cls}
          badgeLabel={cancBadge.label}
        />
        <Chip
          icon={<UserX width={14} height={14} />}
          title="No-show"
          value={fmtPct(m.noshow)}
          loading={loading}
          badgeClass={nsBadge.cls}
          badgeLabel={nsBadge.label}
        />
        <Chip
          icon={<Clock3 width={14} height={14} />}
          title="Время до подтверждения"
          value={fmtMin(m.firstResponseMin)}
          loading={loading}
          badgeClass={frBadge.cls}
          badgeLabel={frBadge.label}
        />
        <Chip
          icon={<CheckCircle2 width={14} height={14} />}
          title="SLA отклика"
          value={fmtPct(m.sla)}
          loading={loading}
          badgeClass={slaBadge.cls}
          badgeLabel={slaBadge.label}
        />
      </div>

      <div className="mt-2 text-xs text-white/60">
        Чип «Проблемные услуги/сотрудники» —{" "}
        <Link
          href={`${resolvedBase}/reports/booking?focus=utilization`}
          prefetch={false}
          className="underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded"
        >
          перейти
        </Link>
      </div>
    </section>
  );
}

/* ── helpers ── */

function Chip({
  icon,
  title,
  value,
  loading,
  badgeClass,
  badgeLabel,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  loading: boolean;
  badgeClass: string;
  badgeLabel: string;
}) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2" role="listitem">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 min-w-0">
          <span
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white/80"
            aria-hidden
          >
            {icon}
          </span>
          <div className="truncate text-xs text-white/70">{title}</div>
        </div>
        <span
          className={cls("rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide", badgeClass)}
          aria-label={`Статус: ${badgeLabel}`}
          title={badgeLabel}
        >
          {badgeLabel}
        </span>
      </div>
      <div className="mt-1 text-lg font-semibold tabular-nums" aria-live="polite" aria-busy={loading}>
        {loading ? <SkelNumber /> : value}
      </div>
    </div>
  );
}

function SkelNumber() {
  return <span className="inline-block h-6 w-16 animate-pulse rounded bg-white/10 align-middle" />;
}