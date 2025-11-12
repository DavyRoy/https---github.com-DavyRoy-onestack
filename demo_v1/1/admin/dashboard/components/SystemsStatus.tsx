// app/demo/admin/dashboard/components/SystemsStatus.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

async function fetchSystemsStatus(): Promise<SystemItem[]> {
  try {
    const res = await fetch("/api/metrics/systems-status", { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as SystemItem[];
    if (!Array.isArray(json)) throw new Error("Invalid shape");
    return json;
  } catch {
    // fallback на мок
    return mockSystems as SystemItem[];
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
  const [loading, setLoading] = useState(true);
  const [showOnlyIssues, setShowOnlyIssues] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setInterval> | null = null;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSystemsStatus();
        if (!alive) return;
        setSystems(data);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Ошибка загрузки");
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    if (pollMs > 0) timer = setInterval(run, pollMs);

    return () => {
      alive = false;
      if (timer) clearInterval(timer);
    };
  }, [pollMs]);

  // нормализация: убираем дубликаты по id и сортируем по важности (error → warn → ok), затем по алфавиту
  const normalized = useMemo(() => {
    const list = systems ?? [];
    const uniq = new Map<string, SystemItem>();
    for (const s of list) if (!uniq.has(s.id)) uniq.set(s.id, s);
    const order: Record<SystemStatus, number> = { error: 0, warn: 1, ok: 2 };
    return Array.from(uniq.values()).sort((a, b) => {
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
    () =>
      normalized.filter((s) => (showOnlyIssues ? s.status !== "ok" : true)),
    [normalized, showOnlyIssues]
  );

  // безопасная сборка ссылок: если href начинается с '/', приклеиваем base; иначе — внешний URL
  const resolveHref = (href: string) =>
    href?.startsWith("/") ? `${resolvedBase}${href}` : href;

  return (
    <section
      className={cls(
        "rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 backdrop-blur-sm",
        className
      )}
      aria-labelledby="sys-status-title"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium" id="sys-status-title">
          Статусы систем
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs text-white/60">
            Проблем: {issuesCount}
          </span>
          <button
            type="button"
            onClick={() => setShowOnlyIssues((v) => !v)}
            className={cls(
              "rounded-lg px-2.5 py-1 text-xs border transition",
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

      <div className="mt-2 grid gap-2" aria-busy={loading}>
        {loading && !systems && (
          <>
            <SkelRow />
            <SkelRow />
            <SkelRow />
          </>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
            Не удалось загрузить статусы: {error}
          </div>
        )}

        {!loading && !error && list.length === 0 && (
          <div className="text-sm text-white/70">
            {showOnlyIssues ? "Проблемных систем нет" : "Нет данных о системах"}
          </div>
        )}

        {list.map((s) => (
          <Link
            key={s.id}
            href={resolveHref(s.href)}
            prefetch={false}
            className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm">{s.title}</div>
              <span
                className={cls(
                  "text-[10px] px-2 py-0.5 rounded-lg uppercase tracking-wide",
                  badge(s.status)
                )}
              >
                {human(s.status)}
              </span>
            </div>
            <div className="mt-1 text-xs text-white/70">{s.note}</div>
          </Link>
        ))}
      </div>

      <div className="mt-2 text-xs text-white/60">
        Обновление статусов каждые {Math.round(pollMs / 1000)}с
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