// app/demo/admin/dashboard/components/AccessOverview.tsx
// CLIENT COMPONENT — улучшенный дизайн, прежний контракт пропсов.

"use client";

import { useEffect, useMemo, useRef, useState, useId } from "react";
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

/* ===== Data loader: API -> mock fallback + источник ===== */
async function loadAccessMetrics(
  params: { period?: DashboardPeriod; channel?: DashboardChannel; location?: DashboardLocation },
  signal?: AbortSignal
): Promise<{ data: AccessMetrics; source: "api" | "mock" }> {
  const qs = new URLSearchParams(
    Object.entries(params).flatMap(([k, v]) => (v ? [[k, String(v)]] : []))
  ).toString();

  try {
    const res = await fetch(`/api/metrics/access${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
      signal,
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
    return { data: json, source: "api" };
  } catch {
    // Фоллбэк на демо-данные
    const m = mockAccess();
    return { data: { users: m.users, sessions: m.sessions, byRole: m.byRole }, source: "mock" };
  }
}

/* ===== Helpers ===== */
function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function SkeletonLine({ w = 72, h = 20 }: { w?: number; h?: number }) {
  // фикс: убран жесткий класс h-[20px], чтобы `h` реально работал
  return (
    <span
      className="inline-block animate-pulse rounded bg-white/10 align-middle"
      style={{ width: w, height: h }}
      aria-hidden
    />
  );
}
function SkeletonRow({ h = 20 }: { h?: number }) {
  return <div className="w-full rounded bg-white/10 animate-pulse" style={{ height: h }} aria-hidden />;
}

function pluralize(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/* ===== Числовой форматтер (ru) ===== */
const nf = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

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
  const [source, setSource] = useState<"api" | "mock">("api");
  const abortRef = useRef<AbortController | null>(null);

  // уникальные id (во избежание коллизий при множественных инстансах)
  const uid = useId();
  const titleId = `access-title-${uid}`;

  // сортировка, топ-5
  const rolesSorted = useMemo(
    () => (data ? [...data.byRole].sort((a, b) => (b.count || 0) - (a.count || 0)) : []),
    [data]
  );
  const rolesTop5 = rolesSorted.slice(0, 5);
  const rolesRestCount = Math.max(0, (data?.byRole.length ?? 0) - rolesTop5.length);

  // сумма по ролям для процентов (защита от деления на 0)
  const totalByRoles = useMemo(
    () =>
      Math.max(
        1,
        rolesSorted.reduce((s, r) => s + (Number.isFinite(r.count) ? r.count : 0), 0)
      ),
    [rolesSorted]
  );

  // Загрузка с отменой предыдущего запроса и защитой от setState после unmount/abort
  useEffect(() => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    let alive = true;

    setLoading(true);
    loadAccessMetrics({ period, channel, location }, ctrl.signal)
      .then(({ data, source }) => {
        if (!alive || ctrl.signal.aborted) return;
        setData(data);
        setSource(source);
      })
      .catch(() => {
        // swallow — уже обработано в loader
      })
      .finally(() => {
        if (!alive || ctrl.signal.aborted) return;
        setLoading(false);
      });

    return () => {
      alive = false;
      ctrl.abort();
    };
  }, [period, channel, location]);

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
      {/* Шапка */}
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex min-w-0 items-center gap-2">
          <span
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10"
            aria-hidden
          >
            <Shield width={16} height={16} />
          </span>
          <h3 id={titleId} className="text-sm font-medium truncate">
            Доступы и роли
          </h3>
        </div>

        <Link
          href={manageHref}
          prefetch={false}
          className="rounded-xl border border-white/15 bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          aria-label="Открыть управление доступом"
        >
          Управление доступом
        </Link>
      </div>

      {/* KPI-чипы */}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/70">Пользователи</div>
            <Users2 width={14} height={14} className="text-white/70" aria-hidden />
          </div>
          <div className="mt-1 text-lg font-semibold tabular-nums" aria-live="polite">
            {loading ? <SkeletonLine w={84} h={24} /> : data ? nf.format(data.users) : "—"}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/70">Активные сессии</div>
            <Activity width={14} height={14} className="text-white/70" aria-hidden />
          </div>
          <div className="mt-1 text-lg font-semibold tabular-nums" aria-live="polite">
            {loading ? <SkeletonLine w={84} h={24} /> : data ? nf.format(data.sessions) : "—"}
          </div>
        </div>
      </div>

      {/* Распределение по ролям (с прогрессом и %) */}
      <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-white/70">Распределение ролей</div>
          {!loading && source === "mock" && (
            <span className="text-[10px] leading-none rounded bg-white/10 px-1.5 py-1 text-white/70">
              демо-данные
            </span>
          )}
        </div>

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
              const safeCount = Math.max(0, Number.isFinite(r.count) ? r.count : 0);
              const pct = Math.round((safeCount / totalByRoles) * 100);
              return (
                <div key={r.role} className="grid gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate" title={r.role}>
                      {r.role}
                    </span>
                    <span className="opacity-70 tabular-nums">
                      {nf.format(safeCount)} • {pct}%
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded bg-white/10 overflow-hidden"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Доля роли ${r.role}`}
                  >
                    <div
                      className="h-full rounded bg-white motion-safe:transition-all"
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
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/60">
        <span>Последние приглашения/блокировки см. в</span>
        <Link
          href={auditHref}
          prefetch={false}
          className="underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded"
          aria-label="Открыть аудит-лог"
        >
          аудит-логе
        </Link>
      </div>
    </section>
  );
}