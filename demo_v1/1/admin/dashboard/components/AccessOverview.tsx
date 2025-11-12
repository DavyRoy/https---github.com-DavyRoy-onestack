// app/demo/admin/dashboard/components/AccessOverview.tsx
// CLIENT COMPONENT — улучшенный дизайн, прежний контракт пропсов.

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { mockAccess } from "../data/mockAdminDashboard";
import { Users2, Activity, Shield } from "lucide-react";

/* ===== Типы и контракт (без изменений) ===== */
type DashboardPeriod = "7d" | "30d" | "q" | "y";
type DashboardChannel = "all" | "online" | "manager";
type DashboardLocation = "all" | "center" | "south" | "north";

export type AccessOverviewProps = {
  className?: string;
  period?: DashboardPeriod;
  channel?: DashboardChannel;
  location?: DashboardLocation;
  manageHref?: string;
  auditHref?: string;
};

type RoleCount = { role: string; count: number };
type AccessMetrics = { users: number; sessions: number; byRole: RoleCount[] };

/* ===== Data loader: API -> mock fallback ===== */
async function loadAccessMetrics(params: {
  period?: DashboardPeriod;
  channel?: DashboardChannel;
  location?: DashboardLocation;
}): Promise<AccessMetrics> {
  const qs = new URLSearchParams(
    Object.entries(params).flatMap(([k, v]) => (v ? [[k, String(v)]] : []))
  ).toString();

  try {
    const res = await fetch(`/api/metrics/access${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as AccessMetrics;
    if (
      typeof json?.users !== "number" ||
      typeof json?.sessions !== "number" ||
      !Array.isArray(json?.byRole)
    ) {
      throw new Error("Invalid shape");
    }
    return json;
  } catch {
    const m = mockAccess();
    return { users: m.users, sessions: m.sessions, byRole: m.byRole };
  }
}

/* ===== Helpers ===== */
function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
function SkeletonLine({ w = 56, h = 20 }: { w?: number; h?: number }) {
  return (
    <span
      className="inline-block animate-pulse rounded bg-white/10 align-middle"
      style={{ width: w, height: h }}
    />
  );
}
function SkeletonRow() {
  return <div className="h-5 w-full rounded bg-white/10 animate-pulse" />;
}
function pluralize(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/* ===== Компонент ===== */
export default function AccessOverview({
  className = "",
  period = "30d",
  channel = "all",
  location = "all",
  manageHref = "/demo/admin/users",
  auditHref = "/demo/admin/audit",
}: AccessOverviewProps) {
  const [data, setData] = useState<AccessMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // сортировка, топ-5
  const rolesSorted = useMemo(
    () => (data ? [...data.byRole].sort((a, b) => b.count - a.count) : []),
    [data]
  );
  const rolesTop5 = rolesSorted.slice(0, 5);
  const rolesRestCount = Math.max(0, (data?.byRole.length ?? 0) - rolesTop5.length);

  // сумма по ролям для процентов (защита от деления на 0)
  const totalByRoles = useMemo(
    () => Math.max(1, rolesSorted.reduce((s, r) => s + (Number.isFinite(r.count) ? r.count : 0), 0)),
    [rolesSorted]
  );

  useEffect(() => {
    let alive = true;
    setLoading(true);
    loadAccessMetrics({ period, channel, location })
      .then((d) => alive && setData(d))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [period, channel, location]);

  return (
    <section
      className={cls(
        "rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.06] via-white/[0.045] to-white/[0.06] p-3 md:p-4 backdrop-blur-sm",
        className
      )}
      aria-labelledby="access-title"
    >
      {/* Шапка */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/10">
            <Shield width={16} height={16} />
          </span>
          <div id="access-title" className="text-sm font-medium">
            Доступы и роли
          </div>
        </div>

        <Link
          href={manageHref}
          prefetch={false}
          className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          Управление доступом
        </Link>
      </div>

      {/* KPI-чипы */}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/70">Пользователи</div>
            <Users2 width={14} height={14} className="text-white/70" />
          </div>
          <div
            className="mt-1 text-lg font-semibold tabular-nums"
            aria-live="polite"
            aria-busy={loading}
          >
            {loading ? <SkeletonLine /> : data?.users ?? "—"}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/70">Активные сессии</div>
            <Activity width={14} height={14} className="text-white/70" />
          </div>
          <div
            className="mt-1 text-lg font-semibold tabular-nums"
            aria-live="polite"
            aria-busy={loading}
          >
            {loading ? <SkeletonLine /> : data?.sessions ?? "—"}
          </div>
        </div>
      </div>

      {/* Распределение по ролям (с прогрессом и % ) */}
      <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="text-xs text-white/70">Распределение ролей</div>

        <div className="mt-2 grid gap-2">
          {loading && (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          )}

          {!loading &&
            rolesTop5.map((r) => {
              const pct = Math.round((Math.max(0, r.count) / totalByRoles) * 100);
              return (
                <div key={r.role} className="grid gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">{r.role}</span>
                    <span className="opacity-70 tabular-nums">
                      {r.count} • {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded bg-white transition-all"
                      style={{ width: `${Math.max(3, pct)}%` }}
                      aria-hidden
                    />
                  </div>
                </div>
              );
            })}

          {!loading && rolesTop5.length === 0 && (
            <div className="text-xs text-white/60">Нет данных</div>
          )}

          {!loading && rolesRestCount > 0 && (
            <div className="text-xs text-white/60">
              + ещё {rolesRestCount} {pluralize(rolesRestCount, "роль", "роли", "ролей")}
            </div>
          )}
        </div>
      </div>

      {/* Подвал блока */}
      <div className="mt-2 text-xs text-white/60">
        Последние приглашения/блокировки см. в{" "}
        <Link href={auditHref} prefetch={false} className="underline">
          аудит-логе
        </Link>
      </div>
    </section>
  );
}