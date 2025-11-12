// app/demo/admin/dashboard/components/AlertsPanel.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { mockAlerts } from "../data/mockAdminDashboard";
import { AlertTriangle, OctagonAlert, Bell } from "lucide-react";

/* ==== типы (совет: продублировать в lib/metrics/types.ts и импортировать) ==== */
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
function badgeClass(s: Severity) {
  return s === "warn"
    ? "bg-amber-400/15 text-amber-300"
    : "bg-red-400/15 text-red-300";
}
function iconBySeverity(s: Severity) {
  return s === "warn" ? (
    <AlertTriangle width={14} height={14} />
  ) : (
    <OctagonAlert width={14} height={14} />
  );
}
function timeAgo(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso).getTime();
  if (!Number.isFinite(d)) return "";
  const sec = Math.max(1, Math.floor((Date.now() - d) / 1000));
  if (sec < 60) return `${sec}с назад`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}м назад`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}ч назад`;
  const dys = Math.floor(h / 24);
  return `${dys}д назад`;
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

/* ==== загрузчик данных ==== */
async function loadAlerts(): Promise<AlertItem[]> {
  try {
    const res = await fetch("/api/metrics/alerts", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as AlertItem[];
    if (!Array.isArray(json)) throw new Error("Invalid shape");
    return json;
  } catch {
    return mockAlerts();
  }
}

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
  const [severityFilter, setSeverityFilter] = useState<"all" | Severity>("all");
  const [loading, setLoading] = useState(true);

  // прочитанные — localStorage per-role
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(storageKey(role));
      return new Set<string>(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(role), JSON.stringify(Array.from(readIds)));
    } catch {}
  }, [readIds, role]);

  // первичная загрузка + polling
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      const data = await loadAlerts();
      if (!alive) return;
      setAlerts(data);
      setLoading(false);
    };
    run();

    if (pollMs > 0) timerRef.current = setInterval(run, pollMs);
    return () => {
      alive = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pollMs]);

  // обработчики
  const markRead = (id: string) => setReadIds((prev) => new Set(prev).add(id));
  const markAllRead = () => {
    if (!alerts) return;
    setReadIds(new Set(alerts.map((a) => a.id)));
  };

  // подсчёты
  const counts = useMemo(() => {
    const all = (alerts ?? []).filter((a) => !readIds.has(a.id));
    return {
      all: all.length,
      warn: all.filter((a) => a.severity === "warn").length,
      critical: all.filter((a) => a.severity === "critical").length,
    };
  }, [alerts, readIds]);

  // список к показу
  const visible = useMemo(() => {
    const list = (alerts ?? []).filter((a) => !readIds.has(a.id));
    return severityFilter === "all" ? list : list.filter((a) => a.severity === severityFilter);
  }, [alerts, readIds, severityFilter]);

  return (
    <section
      className={cls(
        "rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.06] via-white/[0.045] to-white/[0.06] p-3 md:p-4 backdrop-blur-sm",
        className
      )}
      aria-labelledby="alerts-title"
    >
      {/* Шапка */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/10">
            <Bell width={16} height={16} />
          </span>
          <div className="text-sm font-medium" id="alerts-title">
            Риски / Алерты
          </div>
          <span
            className={cls(
              "ml-1 inline-flex min-w-[24px] items-center justify-center rounded-full px-1 text-[11px] leading-5 tabular-nums",
              counts.all > 0 ? "bg-red-500/20 text-red-200" : "bg-white/10 text-white/70"
            )}
            aria-live="polite"
            aria-atomic="true"
          >
            {counts.all}
          </span>
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
          <div className="hidden sm:flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 p-1">
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
                    "rounded-lg px-2.5 py-1 text-xs transition",
                    severityFilter === key
                      ? "bg-white text-black"
                      : "hover:bg-white/10 text-white/80"
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
            className="text-xs underline opacity-80 hover:opacity-100"
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
          <div className="text-sm text-white/70">Критических алертов нет</div>
        )}

        {visible.map((a) => {
          const href = baseHref ? a.href.replace(/^\/demo\/admin/, baseHref) : a.href;
          return (
            <article
              key={a.id}
              role="listitem"
              className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-colors focus-within:ring-2 focus-within:ring-white/30"
            >
              <div className="flex items-center justify-between gap-3">
                <span className={cls("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg", badgeClass(a.severity))}>
                  {iconBySeverity(a.severity)} {a.severity.toUpperCase()}
                </span>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  {a.createdAt && <time dateTime={a.createdAt}>{timeAgo(a.createdAt)}</time>}
                  <button
                    onClick={() => markRead(a.id)}
                    className="underline opacity-80 hover:opacity-100"
                    aria-label="Отметить прочитанным"
                  >
                    Прочитано
                  </button>
                </div>
              </div>

              <Link
                href={href}
                prefetch={false}
                className="mt-2 block text-sm font-medium hover:underline"
              >
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