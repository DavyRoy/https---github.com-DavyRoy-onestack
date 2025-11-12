// app/demo/admin/dashboard/components/RecentAudit.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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

/* API → mock fallback */
async function fetchAudit(): Promise<AuditItem[]> {
  try {
    const res = await fetch("/api/metrics/audit?limit=50", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as AuditItem[];
    if (!Array.isArray(json)) throw new Error("Invalid shape");
    return json;
  } catch {
    const items = mockAudit();
    return items.map((i) => ({
      id: i.id,
      time: i.time,
      user: i.user,
      text: i.text,
      href: `/demo/admin/audit/${i.id}`,
    }));
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

  const [items, setItems] = useState<AuditItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(initialLimit);
  const [now, setNow] = useState(Date.now()); // для автообновления меток "n мин назад"

  // локальный таймер, чтобы раз в минуту обновлять «time ago»
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  // загрузка + polling
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAudit();
        if (!alive) return;
        setItems(data);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Ошибка загрузки");
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    if (pollMs > 0) {
      timerRef.current = setInterval(run, pollMs);
    }
    return () => {
      alive = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pollMs]);

  // нормализуем, сортируем, убираем дубли
  const normalized = useMemo(() => {
    const arr = (items ?? []).map((i) => {
      const safeHref = i.href?.startsWith("/demo")
        ? i.href.replace(/^\/demo\/admin/, resolvedBase)
        : i.href ?? `${resolvedBase}/audit/${i.id}`;
      return { ...i, href: safeHref, tMs: parseTimeMsLoose(i.time) };
    });
    const uniq = new Map<string, typeof arr[number]>();
    for (const it of arr) {
      if (!uniq.has(it.id)) uniq.set(it.id, it);
    }
    const uniqueArr = Array.from(uniq.values());
    uniqueArr.sort((a, b) => {
      // сначала по валидному времени (новые выше), затем по id
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
        className
      )}
      aria-labelledby="recent-audit-title"
    >
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/10">
            <History width={16} height={16} />
          </span>
          <div id="recent-audit-title" className="text-sm font-medium">
            Последние действия (аудит)
          </div>
        </div>
        <Link
          href={`${resolvedBase}/audit`}
          prefetch={false}
          className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          Открыть все
        </Link>
      </div>

      <ol className="mt-2 grid gap-2">
        {loading && !items && (
          <>
            <SkelRow />
            <SkelRow />
            <SkelRow />
            <SkelRow />
          </>
        )}

        {!loading && error && (
          <li className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
            Не удалось загрузить аудит: {error}
          </li>
        )}

        {!loading && !error && list.length === 0 && (
          <li className="text-sm text-white/70">Нет записей аудита</li>
        )}

        {!error &&
          list.map((i) => {
            const iso = toIsoOrUndefined(i.time);
            return (
              <li
                key={i.id}
                className="rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div className="flex items-center justify-between text-sm tabular-nums">
                  <time className="opacity-80" dateTime={iso} title={i.time}>
                    {timeAgoLabelLoose(i.time, now)}
                  </time>
                  <span className="opacity-70 truncate max-w-[50%]" title={i.user}>
                    {i.user}
                  </span>
                </div>
                <Link
                  href={i.href!}
                  prefetch={false}
                  className="mt-1 block text-sm hover:underline"
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
            onClick={() => setLimit((n) => n + initialLimit)}
            disabled={loading}
            className={cls(
              "w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
              loading && "opacity-60 cursor-not-allowed"
            )}
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
        <span className="h-4 w-24 rounded bg-white/10 animate-pulse" />
        <span className="h-4 w-28 rounded bg-white/10 animate-pulse" />
      </div>
      <div className="mt-1 h-4 w-3/4 rounded bg-white/10 animate-pulse" />
    </li>
  );
}