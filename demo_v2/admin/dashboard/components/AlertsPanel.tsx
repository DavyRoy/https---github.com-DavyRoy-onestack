// app/demo/admin/dashboard/components/AlertsPanel.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useId } from "react";
import { usePathname } from "next/navigation";
import { mockAlerts } from "../data/mockAdminDashboard";
import { AlertTriangle, OctagonAlert, Bell } from "lucide-react";

/* ==== типы (контракт без изменений) ==== */
type Severity = "warn" | "critical";
type AlertItem = {
  id: string;
  severity: Severity;
  title: string;
  hint?: string;
  href: string;
  createdAt?: string; // ISO
};

export type AlertsPanelProps = {
  className?: string;
  /** Частота обновления в мс (0 — отключить polling) */
  pollMs?: number;
  /** Явно указать роль (по умолчанию определяется по pathname) */
  role?: "admin" | "manager" | "user";
  /** Базовый путь для ссылок (если переиспользуем в других ролях) — опционально */
  baseHref?: string;
};

/* ==== утилиты ==== */
const rtf = new Intl.RelativeTimeFormat("ru-RU", { numeric: "auto" });
function toRelTime(iso?: string) {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "";
  const diffSec = Math.round((t - Date.now()) / 1000);
  const abs = Math.abs(diffSec);
  if (abs < 60) return rtf.format(Math.trunc(diffSec), "second");
  const m = Math.trunc(diffSec / 60);
  if (Math.abs(m) < 60) return rtf.format(m, "minute");
  const h = Math.trunc(diffSec / 3600);
  if (Math.abs(h) < 24) return rtf.format(h, "hour");
  const d = Math.trunc(diffSec / 86400);
  return rtf.format(d, "day");
}

function badgeClass(s: Severity) {
  return s === "warn" ? "bg-amber-400/15 text-amber-200" : "bg-red-400/15 text-red-200";
}
function iconBySeverity(s: Severity) {
  return s === "warn" ? <AlertTriangle width={14} height={14} /> : <OctagonAlert width={14} height={14} />;
}
function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
function storageKey(role: string) {
  return `alerts.read.${role}`;
}
function getRoleFromPath(pathname: string | null): "admin" | "manager" | "user" {
  if (!pathname) return "user";
  if (pathname.startsWith("/demo/admin")) return "admin";
  if (pathname.startsWith("/demo/manager")) return "manager";
  return "user";
}
function remapHref(href: string, baseHref?: string) {
  if (!baseHref) return href;
  return href.replace(/^\/demo\/(admin|manager|user)/, baseHref);
}

/* ==== загрузчик данных ==== */
async function loadAlerts(signal?: AbortSignal): Promise<{ data: AlertItem[]; source: "api" | "mock" }> {
  try {
    const res = await fetch("/api/metrics/alerts", { cache: "no-store", signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as AlertItem[];
    if (!Array.isArray(json)) throw new Error("Invalid shape");
    return { data: json, source: "api" };
  } catch {
    return { data: mockAlerts(), source: "mock" };
  }
}

/* ==== компонент ==== */
export default function AlertsPanel({
  className = "",
  pollMs = 60_000,
  role: roleProp,
  baseHref,
}: AlertsPanelProps) {
  const pathname = usePathname();
  const derivedRole = getRoleFromPath(pathname);
  const role = roleProp ?? derivedRole;

  const [alerts, setAlerts] = useState<AlertItem[] | null>(null);
  const [source, setSource] = useState<"api" | "mock">("api");
  const [severityFilter, setSeverityFilter] = useState<"all" | Severity>("all");
  const [loading, setLoading] = useState(true);

  // уникальные id для a11y
  const uid = useId();
  const titleId = `alerts-title-${uid}`;
  const liveId = `alerts-live-${uid}`;

  // прочитанные — localStorage per-role
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(role));
      const parsed = raw ? JSON.parse(raw) : [];
      setReadIds(new Set<string>(Array.isArray(parsed) ? parsed : []));
    } catch {
      setReadIds(new Set());
    }
  }, [role]);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(role), JSON.stringify(Array.from(readIds)));
    } catch {}
  }, [readIds, role]);

  // Пуллинг без наложения запросов, с паузой при скрытом табе
  const intervalRef = useRef<number | null>(null);
  const inFlightCtrl = useRef<AbortController | null>(null);

  const runFetch = async () => {
    inFlightCtrl.current?.abort();
    const ctrl = new AbortController();
    inFlightCtrl.current = ctrl;
    setLoading(true);
    try {
      const { data, source } = await loadAlerts(ctrl.signal);
      if (ctrl.signal.aborted) return;
      // Дедуп по id на случай дублирующихся записей
      const dedup = Array.from(new Map(data.map((a) => [a.id, a])).values());
      setAlerts(dedup);
      setSource(source);
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  };

  // старт/стоп polling
  useEffect(() => {
    const start = () => {
      if (intervalRef.current !== null) return;
      // первичная загрузка сразу
      runFetch();
      if (pollMs > 0) {
        intervalRef.current = window.setInterval(() => {
          if (document.visibilityState === "hidden") return;
          runFetch();
        }, pollMs);
      }
    };
    const stop = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      inFlightCtrl.current?.abort();
    };

    start();
    const onVis = () => {
      if (document.visibilityState === "visible") runFetch();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      stop();
    };
  }, [pollMs]);

  // обработчики
  const markRead = (id: string) => setReadIds((prev) => new Set(prev).add(id));
  const markAllRead = () => {
    if (!alerts) return;
    setReadIds(new Set(alerts.map((a) => a.id)));
  };

  // подсчёты (только непрочитанные)
  const counts = useMemo(() => {
    const unread = (alerts ?? []).filter((a) => !readIds.has(a.id));
    return {
      all: unread.length,
      warn: unread.filter((a) => a.severity === "warn").length,
      critical: unread.filter((a) => a.severity === "critical").length,
    };
  }, [alerts, readIds]);

  // список к показу согласно фильтру
  const visible = useMemo(() => {
    const list = (alerts ?? []).filter((a) => !readIds.has(a.id));
    return severityFilter === "all" ? list : list.filter((a) => a.severity === severityFilter);
  }, [alerts, readIds, severityFilter]);

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
      {/* live-region для счётчика — только для скринридеров */}
      <span id={liveId} className="sr-only" aria-live="polite" aria-atomic="true">
        Непрочитанных оповещений: {counts.all}
      </span>

      {/* Шапка */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex min-w-0 items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/10" aria-hidden>
            <Bell width={16} height={16} />
          </span>
          <h3 className="text-sm font-medium truncate" id={titleId}>
            Риски / Алерты
          </h3>
          <span
            className={cls(
              "ml-1 inline-flex min-w-[24px] items-center justify-center rounded-full px-1 text-[11px] leading-5 tabular-nums",
              counts.all > 0 ? "bg-red-500/20 text-red-200" : "bg-white/10 text-white/70"
            )}
            aria-describedby={liveId}
          >
            {counts.all}
          </span>
          {!loading && source === "mock" && (
            <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">демо-данные</span>
          )}
        </div>

        {/* фильтры (селект на мобилке, табы на десктопе) */}
        <div className="flex items-center gap-2">
          {/* mobile */}
          <label className="sm:hidden">
            <span className="sr-only">Фильтр важности</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="rounded-xl border border-white/15 bg-white/10 px-2 py-1.5 text-xs"
            >
              <option value="all">Все ({counts.all})</option>
              <option value="warn">Warn ({counts.warn})</option>
              <option value="critical">Critical ({counts.critical})</option>
            </select>
          </label>

          {/* desktop */}
          <div className="hidden items-center gap-1 rounded-xl border border-white/15 bg-white/10 p-1 sm:flex">
            {(["all", "warn", "critical"] as const).map((key) => {
              const label =
                key === "all"
                  ? `Все ${counts.all ? `(${counts.all})` : ""}`
                  : key === "warn"
                  ? `Warn ${counts.warn ? `(${counts.warn})` : ""}`
                  : `Critical ${counts.critical ? `(${counts.critical})` : ""}`;
              return (
                <button
                  key={key}
                  onClick={() => setSeverityFilter(key)}
                  className={cls(
                    "rounded-lg px-2.5 py-1 text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                    severityFilter === key ? "bg-white text-black" : "hover:bg-white/10 text-white/80"
                  )}
                  aria-pressed={severityFilter === key}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <button
            onClick={markAllRead}
            className={cls(
              "text-xs underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded",
              counts.all ? "opacity-90" : "opacity-40 cursor-not-allowed"
            )}
            disabled={!counts.all}
            aria-disabled={!counts.all}
          >
            Отметить все прочитанными
          </button>
        </div>
      </div>

      {/* Контент */}
      <div className="mt-2 grid gap-2" role="list" aria-live="polite">
        {loading && !alerts && (
          <>
            <SkelCard />
            <SkelCard />
            <SkelCard />
          </>
        )}

        {!loading && visible.length === 0 && (
          <div className="text-sm text-white/70">
            {severityFilter === "all"
              ? "Новых алертов нет"
              : severityFilter === "warn"
              ? "Нет предупреждений"
              : "Критических алертов нет"}
          </div>
        )}

        {visible.map((a) => {
          const href = remapHref(a.href, baseHref);
          return (
            <article
              key={a.id}
              role="listitem"
              className="rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10 focus-within:ring-2 focus-within:ring-white/30"
            >
              <div className="flex items-center justify-between gap-3">
                <span className={cls("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg", badgeClass(a.severity))}>
                  {iconBySeverity(a.severity)} {a.severity.toUpperCase()}
                </span>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  {a.createdAt && (
                    <time dateTime={a.createdAt} title={new Date(a.createdAt).toLocaleString()}>
                      {toRelTime(a.createdAt)}
                    </time>
                  )}
                  <button
                    onClick={() => markRead(a.id)}
                    className="underline opacity-80 hover:opacity-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded"
                    aria-label="Отметить прочитанным"
                  >
                    Прочитано
                  </button>
                </div>
              </div>

              <Link href={href} prefetch={false} className="mt-2 block text-sm font-medium hover:underline">
                {a.title}
              </Link>
              {a.hint && <div className="text-xs text-white/70">{a.hint}</div>}
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ——— скелетон карточки ——— */
function SkelCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between">
        <span className="h-5 w-20 rounded bg-white/10 animate-pulse" />
        <span className="h-4 w-24 rounded bg-white/10 animate-pulse" />
      </div>
      <div className="mt-2 h-5 w-3/4 rounded bg-white/10 animate-pulse" />
      <div className="mt-1 h-4 w-1/2 rounded bg-white/10 animate-pulse" />
    </div>
  );
}