// app/demo/admin/dashboard/components/RecentAudit.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useId } from "react";
import { usePathname } from "next/navigation";
import { mockAudit } from "../data/mockAdminDashboard";
import { History } from "lucide-react";

type AuditItem = {
  id: string;
  time: string; // ISO или человекочитаемое
  user: string;
  text: string;
  href?: string;
};

export type RecentAuditProps = {
  className?: string;
  /** Сколько элементов показывать изначально */
  initialLimit?: number;
  /** Порог обновления (мс). 0 — без polling */
  pollMs?: number;
  /** Базовый префикс ссылок; если не указано — детект из URL */
  baseHref?: "/demo/admin" | "/demo/manager" | "/demo/user" | string;
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
function toIsoOrUndefined(input: string | undefined | null): string | undefined {
  if (!input) return undefined;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}
function parseTimeMsLoose(input: string): number | null {
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d.getTime();
}
function timeAgoLabelLoose(t: string, nowMs = Date.now()) {
  const ms = parseTimeMsLoose(t);
  if (ms == null) return t;
  const sec = Math.max(1, Math.floor((nowMs - ms) / 1000));
  if (sec < 60) return `${sec}с назад`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}м назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}ч назад`;
  const d = Math.floor(h / 24);
  return `${d}д назад`;
}
function remapHref(href: string | undefined, base: string) {
  if (!href) return undefined;
  return href.startsWith("/demo")
    ? href.replace(/^\/demo\/(admin|manager|user)/, base)
    : href;
}

/* API → mock fallback (возвращаем ещё и источник) */
async function fetchAudit(signal?: AbortSignal): Promise<{ data: AuditItem[]; source: "api" | "mock" }> {
  try {
    const res = await fetch("/api/metrics/audit?limit=50", { cache: "no-store", signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as AuditItem[];
    if (!Array.isArray(json)) throw new Error("Invalid shape");
    return { data: json, source: "api" };
  } catch {
    const items = mockAudit();
    return {
      data: items.map((i) => ({
        id: i.id,
        time: i.time,
        user: i.user,
        text: i.text,
        href: `/demo/admin/audit/${i.id}`,
      })),
      source: "mock",
    };
  }
}

/* ── component ─────────────────────────────────────────────────────────── */
export default function RecentAudit({
  className = "",
  initialLimit = 6,
  pollMs = 120_000,
  baseHref,
}: RecentAuditProps) {
  const pathname = usePathname();
  const resolvedBase = getBase(baseHref, pathname);

  const titleUid = useId();
  const listUid = useId();
  const titleId = `recent-audit-title-${titleUid}`;
  const listId = `recent-audit-list-${listUid}`;

  const safeInitial = Math.max(1, Math.round(initialLimit));
  const [items, setItems] = useState<AuditItem[] | null>(null);
  const [source, setSource] = useState<"api" | "mock">("api");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(safeInitial);
  const [now, setNow] = useState(Date.now()); // для автообновления меток "n мин назад"

  // локальный таймер, чтобы раз в минуту обновлять «time ago»
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  // защита от гонок + polling + пауза на скрытой вкладке
  const inFlightCtrl = useRef<AbortController | null>(null);
  const intervalRef = useRef<number | null>(null);

  const run = async () => {
    inFlightCtrl.current?.abort();
    const ctrl = new AbortController();
    inFlightCtrl.current = ctrl;
    setLoading(true);
    setError(null);
    try {
      const { data, source } = await fetchAudit(ctrl.signal);
      if (ctrl.signal.aborted) return;
      setItems(data);
      setSource(source);
    } catch (e: any) {
      if (!ctrl.signal.aborted) setError(e?.message ?? "Ошибка загрузки");
    } finally {
      if (!inFlightCtrl.current?.signal.aborted) setLoading(false);
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
      inFlightCtrl.current?.abort();
    };
  }, [pollMs]);

  // нормализуем, сортируем, убираем дубли
  const normalized = useMemo(() => {
    const arr = (items ?? []).map((i) => {
      const href = remapHref(i.href ?? `${resolvedBase}/audit/${i.id}`, resolvedBase);
      return { ...i, href, tMs: parseTimeMsLoose(i.time) };
    });
    const uniq = new Map<string, typeof arr[number]>();
    for (const it of arr) {
      if (!uniq.has(it.id)) uniq.set(it.id, it);
    }
    const uniqueArr = Array.from(uniq.values());
    uniqueArr.sort((a, b) => {
      if (a.tMs != null && b.tMs != null) return b.tMs - a.tMs;
      if (a.tMs != null) return -1;
      if (b.tMs != null) return 1;
      return String(b.id).localeCompare(String(a.id));
    });
    return uniqueArr;
  }, [items, resolvedBase]);

  const list = useMemo(() => normalized.slice(0, Math.max(0, limit)), [normalized, limit]);
  const hasMore = normalized.length > list.length;

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
        <div className="inline-flex items-center gap-2 min-w-0">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10" aria-hidden>
            <History width={16} height={16} />
          </span>
          <h3 id={titleId} className="truncate text-sm font-medium">
            Последние действия (аудит)
          </h3>
          {!loading && source === "mock" && (
            <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">
              демо-данные
            </span>
          )}
        </div>
        <Link
          href={`${resolvedBase}/audit`}
          prefetch={false}
          className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          aria-label="Открыть все записи аудита"
        >
          Открыть все
        </Link>
      </div>

      <ol
        id={listId}
        className="mt-2 grid gap-2"
        role="list"
        aria-live="polite"
      >
        {loading && !items && (
          <>
            <SkelRow />
            <SkelRow />
            <SkelRow />
            <SkelRow />
          </>
        )}

        {!loading && error && (
          <li className="rounded-2xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200" role="alert">
            <div className="flex items-center justify-between gap-2">
              <span>Не удалось загрузить аудит: {error}</span>
              <button
                type="button"
                onClick={run}
                className="rounded border border-red-300/30 bg-red-300/10 px-2 py-1 text-xs hover:bg-red-300/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Повторить
              </button>
            </div>
          </li>
        )}

        {!loading && !error && list.length === 0 && (
          <li className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
            Нет записей аудита
          </li>
        )}

        {!error &&
          list.map((i) => {
            const iso = toIsoOrUndefined(i.time);
            const href = i.href ?? `${resolvedBase}/audit/${i.id}`;
            return (
              <li key={i.id} className="rounded-xl border border-white/10 bg-white/5 p-3" role="listitem">
                <div className="flex items-center justify-between text-sm tabular-nums">
                  <time className="opacity-80" dateTime={iso} title={i.time}>
                    {timeAgoLabelLoose(i.time, now)}
                  </time>
                  <span className="max-w-[50%] truncate opacity-70" title={i.user}>
                    {i.user}
                  </span>
                </div>
                <Link
                  href={href}
                  prefetch={false}
                  className="mt-1 block text-sm hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded"
                >
                  {i.text}
                </Link>
              </li>
            );
          })}
      </ol>

      {hasMore && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setLimit((n) => n + safeInitial)}
            disabled={loading}
            className={cls(
              "w-full rounded-xl border border-white/15 bg-white px-3 py-2 text-sm font-medium text-black transition hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
              loading && "cursor-not-allowed opacity-60"
            )}
            aria-label="Показать ещё записи аудита"
            aria-controls={listId}
          >
            Показать ещё
          </button>
        </div>
      )}

      <div className="mt-2 text-xs text-white/60">
        Записи подтягиваются автоматически
        {pollMs > 0 ? `; обновление каждые ${Math.round(pollMs / 1000)}с` : ""}
      </div>
    </section>
  );
}

/* ── skeleton ── */
function SkelRow() {
  return (
    <li className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between">
        <span className="h-4 w-24 animate-pulse rounded bg-white/10" />
        <span className="h-4 w-28 animate-pulse rounded bg-white/10" />
      </div>
      <div className="mt-1 h-4 w-3/4 animate-pulse rounded bg-white/10" />
    </li>
  );
}