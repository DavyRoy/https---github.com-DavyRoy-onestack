// app/demo/admin/dashboard/components/OpsHealth.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
function fmtPct(v?: number) {
  if (typeof v !== "number" || !Number.isFinite(v)) return "—";
  return `${Math.max(0, Math.min(100, Math.round(v)))}%`;
}
function fmtMin(v?: number) {
  if (typeof v !== "number" || !Number.isFinite(v)) return "—";
  return `${Math.max(0, Math.round(v))} мин`;
}
// Статусы по порогам (можно вынести в конфиг)
function badgeByPct(kind: "bad" | "good", v: number) {
  // kind=bad: выше — хуже (отмены, no-show). kind=good: выше — лучше (SLA)
  if (kind === "bad") {
    if (v >= 20) return { cls: "bg-red-400/15 text-red-300", label: "Плохо" };
    if (v >= 10) return { cls: "bg-amber-400/15 text-amber-300", label: "Внимание" };
    return { cls: "bg-emerald-400/15 text-emerald-300", label: "Ок" };
  } else {
    if (v >= 90) return { cls: "bg-emerald-400/15 text-emerald-300", label: "Ок" };
    if (v >= 75) return { cls: "bg-amber-400/15 text-amber-300", label: "Внимание" };
    return { cls: "bg-red-400/15 text-red-300", label: "Плохо" };
  }
}
function badgeByMinutes(v: number) {
  if (v <= 10) return { cls: "bg-emerald-400/15 text-emerald-300", label: "Ок" };
  if (v <= 30) return { cls: "bg-amber-400/15 text-amber-300", label: "Внимание" };
  return { cls: "bg-red-400/15 text-red-300", label: "Плохо" };
}

async function fetchOpsHealth(params: {
  period?: string;
  signal?: AbortSignal;
}): Promise<OpsHealthMetrics> {
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
    return json;
  } catch {
    const m = mockOpsHealth({ period: params.period ?? "30d" });
    return {
      cancellations: m.cancellations,
      noshow: m.noshow,
      firstResponseMin: m.firstResponseMin,
      sla: m.sla,
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

  const [data, setData] = useState<OpsHealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      const d = await fetchOpsHealth({ period, signal: controller.signal });
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
  }, [period, pollMs]);

  const m = data ?? { cancellations: NaN, noshow: NaN, firstResponseMin: NaN, sla: NaN };

  const cancBadge = Number.isFinite(m.cancellations) ? badgeByPct("bad", m.cancellations) : { cls: "bg-white/10 text-white/60", label: "—" };
  const nsBadge   = Number.isFinite(m.noshow) ? badgeByPct("bad", m.noshow) : { cls: "bg-white/10 text-white/60", label: "—" };
  const frBadge   = Number.isFinite(m.firstResponseMin) ? badgeByMinutes(m.firstResponseMin) : { cls: "bg-white/10 text-white/60", label: "—" };
  const slaBadge  = Number.isFinite(m.sla) ? badgeByPct("good", m.sla) : { cls: "bg-white/10 text-white/60", label: "—" };

  return (
    <section
      className={cls(
        "rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.06] via-white/[0.045] to-white/[0.06] p-3 md:p-4 backdrop-blur-sm",
        className
      )}
      aria-labelledby="opshealth-title"
    >
      <div className="flex items-center justify-between">
        <div id="opshealth-title" className="text-sm font-medium">
          Операционное здоровье
        </div>
        <Link
          href={`${resolvedBase}/reports/booking`}
          prefetch={false}
          className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          Отчёт бронирований
        </Link>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
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
          className="underline"
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
    <div className="rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white/80">
            {icon}
          </span>
          <div className="text-xs text-white/70">{title}</div>
        </div>
        <span className={cls("text-[10px] rounded px-1.5 py-0.5 uppercase tracking-wide", badgeClass)} aria-hidden>
          {badgeLabel}
        </span>
      </div>
      <div
        className="mt-1 text-lg font-semibold tabular-nums"
        aria-live="polite"
        aria-busy={loading}
      >
        {loading ? <SkelNumber /> : value}
      </div>
    </div>
  );
}

function SkelNumber() {
  return <span className="inline-block h-6 w-16 rounded bg-white/10 animate-pulse align-middle" />;
}