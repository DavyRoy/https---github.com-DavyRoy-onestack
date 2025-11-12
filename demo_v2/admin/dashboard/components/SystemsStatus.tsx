// app/demo/admin/dashboard/components/SystemsStatus.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { systems as mockSystems } from "../data/mockSystems";

type SystemStatus = "ok" | "warn" | "error";
type SystemItem = {
  id: string;
  title: string;
  note: string;
  href: string;
  status: SystemStatus;
};

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

function badge(status: SystemStatus) {
  switch (status) {
    case "ok":
      return "bg-emerald-400/15 text-emerald-300";
    case "warn":
      return "bg-amber-400/15 text-amber-300";
    case "error":
      return "bg-red-400/15 text-red-300";
    default:
      return "bg-white/10 text-white/70";
  }
}
function human(status: SystemStatus) {
  return status === "ok" ? "OK" : status === "warn" ? "Warn" : "Error";
}
function humanRu(status: SystemStatus) {
  return status === "ok" ? "Система в норме" : status === "warn" ? "Требуется внимание" : "Ошибка";
}

/* API → mock fallback + признак источника */
async function fetchSystemsStatus(signal?: AbortSignal): Promise<{ data: SystemItem[]; source: "api" | "mock" }> {
  try {
    const res = await fetch("/api/metrics/systems-status", { cache: "no-store", signal });
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as SystemItem[];
    if (!Array.isArray(json)) throw new Error("Invalid shape");
    return { data: json, source: "api" };
  } catch {
    return { data: (mockSystems as SystemItem[]), source: "mock" };
  }
}

export default function SystemsStatus({
  className = "",
  baseHref,
  pollMs = 120_000,
}: {
  className?: string;
  baseHref?: string;
  pollMs?: number;
}) {
  const pathname = usePathname();
  const resolvedBase = getBase(baseHref, pathname);

  const [systems, setSystems] = useState<SystemItem[] | null>(null);
  const [source, setSource] = useState<"api" | "mock">("api");
  const [loading, setLoading] = useState(true);
  const [showOnlyIssues, setShowOnlyIssues] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // защита от гонок + управление пуллингом
  const inFlight = useRef<AbortController | null>(null);
  const intervalRef = useRef<number | null>(null);

  const run = async () => {
    inFlight.current?.abort();
    const ctrl = new AbortController();
    inFlight.current = ctrl;
    setLoading(true);
    setError(null);
    try {
      const { data, source } = await fetchSystemsStatus(ctrl.signal);
      // нормализация + дедуп по id
      const uniq = new Map<string, SystemItem>();
      for (const s of data) if (!uniq.has(s.id)) uniq.set(s.id, s);
      setSystems(Array.from(uniq.values()));
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
      inFlight.current?.abort();
    };
  }, [pollMs]);

  // сортировка по важности (error → warn → ok), затем по алфавиту
  const normalized = useMemo(() => {
    const list = systems ?? [];
    const order: Record<SystemStatus, number> = { error: 0, warn: 1, ok: 2 };
    return [...list].sort((a, b) => {
      const byStatus = order[a.status] - order[b.status];
      if (byStatus !== 0) return byStatus;
      return a.title.localeCompare(b.title);
    });
  }, [systems]);

  const issuesCount = useMemo(
    () => normalized.filter((s) => s.status !== "ok").length,
    [normalized]
  );

  const list = useMemo(
    () => normalized.filter((s) => (showOnlyIssues ? s.status !== "ok" : true)),
    [normalized, showOnlyIssues]
  );

  // безопасная сборка ссылок:
  // - внутренние (начинаются с "/") — через Link, префиксуем base;
  // - внешние — через <a target="_blank" rel="noopener noreferrer">
  const resolveLink = (href: string) => {
    const isInternal = href?.startsWith("/");
    const url = isInternal ? `${resolvedBase}${href}` : href;
    return { url, isInternal };
  };

  return (
    <section
      className={cls(
        "rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 backdrop-blur-sm",
        "min-w-0",
        className
      )}
      aria-labelledby="sys-status-title"
      role="region"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2">
          <h3 className="text-sm font-medium" id="sys-status-title">
            Статусы систем
          </h3>
          <span
            className={cls(
              "inline-flex min-w-[24px] items-center justify-center rounded-full px-1 text-[11px] leading-5 tabular-nums",
              issuesCount > 0 ? "bg-red-500/20 text-red-200" : "bg-white/10 text-white/70"
            )}
            aria-live="polite"
          >
            {issuesCount}
          </span>
          {!loading && source === "mock" && (
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">
              демо-данные
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowOnlyIssues((v) => !v)}
            className={cls(
              "rounded-lg px-2.5 py-1 text-xs border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
              showOnlyIssues
                ? "bg-white text-black border-white"
                : "border-white/15 bg-white/10 hover:bg-white/15 text-white/80"
            )}
            aria-pressed={showOnlyIssues}
          >
            Только проблемные
          </button>
        </div>
      </div>

      <div className="mt-2 grid gap-2" role="list" aria-busy={loading} aria-live="polite">
        {loading && !systems && (
          <>
            <SkelRow />
            <SkelRow />
            <SkelRow />
          </>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
            <div className="flex items-center justify-between gap-2">
              <span>Не удалось загрузить статусы: {error}</span>
              <button
                type="button"
                onClick={run}
                className="rounded border border-red-300/30 bg-red-300/10 px-2 py-1 text-xs hover:bg-red-300/15"
              >
                Повторить
              </button>
            </div>
          </div>
        )}

        {!loading && !error && list.length === 0 && (
          <div className="text-sm text-white/70">
            {showOnlyIssues ? "Проблемных систем нет" : "Нет данных о системах"}
          </div>
        )}

        {list.map((s) => {
          const { url, isInternal } = resolveLink(s.href);
          const content = (
            <>
              <div className="flex items-center justify-between">
                <div className="min-w-0 text-sm">
                  <span className="truncate block" title={s.title}>
                    {s.title}
                  </span>
                </div>
                <span
                  className={cls(
                    "text-[10px] px-2 py-0.5 rounded-lg uppercase tracking-wide",
                    badge(s.status)
                  )}
                  aria-label={humanRu(s.status)}
                  title={humanRu(s.status)}
                >
                  {human(s.status)}
                </span>
              </div>
              <div className="mt-1 text-xs text-white/70">{s.note}</div>
            </>
          );

          return isInternal ? (
            <Link
              key={s.id}
              href={url}
              prefetch={false}
              className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              role="listitem"
            >
              {content}
            </Link>
          ) : (
            <a
              key={s.id}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              role="listitem"
            >
              {content}
            </a>
          );
        })}
      </div>

      <div className="mt-2 text-xs text-white/60">
        {pollMs > 0 ? `Обновление статусов каждые ${Math.round(pollMs / 1000)}с` : "Автообновление отключено"}
      </div>
    </section>
  );
}

/* ——— skeleton строки ——— */
function SkelRow() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between">
        <span className="h-4 w-32 rounded bg-white/10 animate-pulse" />
        <span className="h-4 w-12 rounded bg-white/10 animate-pulse" />
      </div>
      <div className="mt-1 h-3 w-2/3 rounded bg-white/10 animate-pulse" />
    </div>
  );
}