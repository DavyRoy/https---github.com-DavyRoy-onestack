// src/app/demo/admin/events/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Panel } from "../../ui/DemoCards";
import {
  Search,
  RefreshCw,
  KeyRound,
  ShieldCheck,
  BadgeCheck,
  FileKey2,
  Download,
  Copy,
  Check,
  PauseCircle,
  PlayCircle,
  FileJson,
  Info,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ----------------------------- types & helpers ---------------------------- */

type Row = {
  id: string;
  actor: string;
  action: string;
  ts: string; // ISO или «сегодня 12:04» (демо)
  type: "auth" | "key" | "role" | "policy";
};

const TYPE_LABEL: Record<Row["type"], string> = {
  auth: "auth",
  key: "key",
  role: "role",
  policy: "policy",
};
const TYPE_CLASS: Record<Row["type"], string> = {
  auth: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  key: "bg-cyan-400/10 text-cyan-300 border-cyan-400/20",
  role: "bg-indigo-400/10 text-indigo-300 border-indigo-400/20",
  policy: "bg-amber-400/10 text-amber-300 border-amber-400/20",
};
const TYPE_ICON: Record<Row["type"], JSX.Element> = {
  auth: <BadgeCheck className="h-3.5 w-3.5" />,
  key: <FileKey2 className="h-3.5 w-3.5" />,
  role: <ShieldCheck className="h-3.5 w-3.5" />,
  policy: <KeyRound className="h-3.5 w-3.5" />,
};

function timeAgoOrRaw(ts: string) {
  const t = Date.parse(ts);
  if (Number.isNaN(t)) return ts; // строка из демо («сегодня …»)
  const diff = Math.max(0, Date.now() - t);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s назад`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}м назад`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}ч назад`;
  const d = Math.floor(h / 24);
  return `${d}д назад`;
}

function csv(rows: Row[]) {
  const head = "id,actor,action,ts,type";
  const body = rows
    .map(({ id, actor, action, ts, type }) =>
      [id, actor, action.replaceAll(",", " "), ts, type].join(","),
    )
    .join("\n");
  return `${head}\n${body}`;
}

/* --------------------------------- page ---------------------------------- */

export default function SecurityEventsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // фильтры
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [type, setType] = useState<"all" | Row["type"]>("all");
  const [range, setRange] = useState<"24h" | "7d" | "30d">("7d");

  // пагинация
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // авто-обновление
  const [auto, setAuto] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // debounce поиска
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q.trim().toLowerCase()), 220);
    return () => clearTimeout(id);
  }, [q]);

  // загрузка с AbortController
  const abortRef = useRef<AbortController | null>(null);
  const load = useCallback(async () => {
    abortRef.current?.abort();
    const ctl = new AbortController();
    abortRef.current = ctl;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/demo/events?range=${range}`, {
        signal: ctl.signal,
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRows((data.items || []) as Row[]);
      setPage(1); // сбросить пагинацию при обновлении
      setCountdown(30);
    } catch (e: any) {
      if (e?.name !== "AbortError") setErr("Не удалось загрузить события");
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  // авто-обновление с обратным отсчётом (30s)
  useEffect(() => {
    if (!auto) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          load();
          return 30;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [auto, load]);

  // быстрый фокус по '/'
  const searchRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const s = debouncedQ;
    return rows.filter((r) => {
      const okT = type === "all" ? true : r.type === type;
      const okQ =
        !s ||
        r.actor.toLowerCase().includes(s) ||
        r.action.toLowerCase().includes(s) ||
        r.id.toLowerCase().includes(s);
      return okT && okQ;
    });
  }, [rows, debouncedQ, type]);

  // counts по типам (для чипов)
  const typeCount = useMemo(() => {
    const base = { all: rows.length, auth: 0, key: 0, role: 0, policy: 0 } as Record<
      "all" | Row["type"],
      number
    >;
    rows.forEach((r) => (base[r.type] += 1));
    return base;
  }, [rows]);

  // текущая страница
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [filtered.length, page, totalPages]);

  const exportCsv = useCallback(() => {
    const blob = new Blob([csv(filtered)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "events.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "events.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  // копирование ID + тост
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const copyId = useCallback(async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setToast("ID скопирован");
      setTimeout(() => setCopiedId((s) => (s === id ? null : s)), 1200);
      setTimeout(() => setToast(null), 1400);
    } catch {
      /* no-op */
    }
  }, []);

  // модалка «Подробнее»
  const [opened, setOpened] = useState<Row | null>(null);

  /* --------------------------------- UI ---------------------------------- */

  const rowAnim = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 6 },
    transition: { duration: 0.18, ease: "easeOut" },
  };

  return (
    <div className="space-y-6">
      {/* Toast (copy) */}
      <AnimatePresence>
        {toast && (
          <motion.div
            {...rowAnim}
            className="fixed right-4 top-4 z-50 rounded-xl border border-white/15 bg-black/80 px-3 py-2 text-sm text-white/90 shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Заголовок + тулбар */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[clamp(1.3rem,3vw,1.8rem)] font-extrabold leading-tight text-white">
            События безопасности
          </h1>
          <p className="mt-0.5 text-white/70">Аудит входов, ключей, ролей и политик.</p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-1.5 py-1 backdrop-blur">
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs hover:bg-white/10"
            title="Обновить"
          >
            <RefreshCw className="h-4 w-4" />
            Обновить
          </button>

          <span className="h-5 w-px bg-white/10" aria-hidden />

          <button
            onClick={() => setAuto((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs hover:bg-white/10"
            title={auto ? "Пауза авто-обновления" : "Включить авто-обновление"}
            aria-pressed={auto}
          >
            {auto ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
            {auto ? `Пауза (${countdown}s)` : "Авто"}
          </button>

          <span className="h-5 w-px bg-white/10" aria-hidden />

          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs hover:bg-white/10"
            title="Экспорт CSV"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          <button
            onClick={exportJson}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs hover:bg-white/10"
            title="Экспорт JSON"
          >
            <FileJson className="h-4 w-4" />
            JSON
          </button>
        </div>
      </div>

      {/* Фильтры */}
      <Panel title="Фильтры">
        <div className="flex flex-wrap items-center gap-3">
          {/* поиск */}
          <div className="relative grow min-w-[240px]">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40"
              aria-hidden
            />
            <input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск по actor / action / ID…  (нажмите «/»)"
              aria-label="Поиск по событиям"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-2.5 outline-none placeholder:text-white/40"
            />
          </div>

          {/* диапазон */}
          <div className="flex flex-wrap gap-2">
            {(["24h", "7d", "30d"] as const).map((r) => {
              const active = range === r;
              return (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  aria-pressed={active}
                  className={`rounded-full px-4 py-2 text-sm border transition ${
                    active ? "bg-white text-black border-white" : "border-white/30 text-white/85 hover:bg-white/10"
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>

          {/* типы со счётчиками */}
          <div className="flex flex-wrap gap-2">
            {(["all", "auth", "key", "role", "policy"] as const).map((t) => {
              const active = type === t;
              const cnt = typeCount[t];
              const colorClass =
                t === "auth"
                  ? "border-emerald-400/30 bg-emerald-300/10 hover:bg-emerald-300/15"
                  : t === "key"
                  ? "border-cyan-400/30 bg-cyan-300/10 hover:bg-cyan-300/15"
                  : t === "role"
                  ? "border-indigo-400/30 bg-indigo-300/10 hover:bg-indigo-300/15"
                  : t === "policy"
                  ? "border-amber-400/30 bg-amber-300/10 hover:bg-amber-300/15"
                  : "border-white/30 bg-white/5 hover:bg-white/10";
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm border transition ${
                    active ? "bg-white text-black border-white" : `text-white/85 ${colorClass}`
                  }`}
                >
                  {t !== "all" ? TYPE_ICON[t] : <Info className="h-3.5 w-3.5" />}
                  <span className="capitalize">{t}</span>
                  <span
                    className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] leading-4 border ${
                      active ? "border-black/20 bg-black/10 text-black/80" : "border-white/15 bg-white/5 text-white/70"
                    }`}
                    aria-label={`количество для ${t}`}
                  >
                    {cnt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Panel>

      {/* Таблица */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div
          className="px-5 py-3 border-b border-white/10 text-sm font-semibold flex items-center gap-3"
          role="status"
          aria-live="polite"
        >
          {loading ? "Загрузка…" : `Найдено: ${filtered.length}`}
          {err && <span className="text-red-400 font-normal">• {err}</span>}
          <span className="ml-auto text-xs text-white/50">
            {auto ? `Авто-обновление: ${countdown}s` : "Авто-обновление выключено"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-sm">
            <thead className="sticky top-0 bg-black/40 backdrop-blur-md z-10 shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
              <tr className="text-left text-white/60">
                <th className="py-2.5 pr-4">ID</th>
                <th className="py-2.5 pr-4">Тип</th>
                <th className="py-2.5 pr-4">Кто</th>
                <th className="py-2.5 pr-4">Действие</th>
                <th className="py-2.5 pr-4">Когда</th>
                <th className="py-2.5 pr-2 text-right">Действия</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {/* skeleton rows */}
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`s-${i}`}>
                    <td className="py-2 pr-4">
                      <div className="h-3 w-40 rounded bg-white/10" />
                    </td>
                    <td className="py-2 pr-4">
                      <div className="h-5 w-20 rounded-full border border-white/15 bg-white/5" />
                    </td>
                    <td className="py-2 pr-4">
                      <div className="h-3 w-28 rounded bg-white/10" />
                    </td>
                    <td className="py-2 pr-4">
                      <div className="h-3 w-56 rounded bg-white/10" />
                    </td>
                    <td className="py-2 pr-4">
                      <div className="h-3 w-16 rounded bg-white/10" />
                    </td>
                    <td className="py-2 pr-2">
                      <div className="ml-auto h-6 w-24 rounded-full border border-white/15 bg-white/5" />
                    </td>
                  </tr>
                ))}

              {!loading && (
                <AnimatePresence initial={false}>
                  {pageRows.map((r) => {
                    const justCopied = copiedId === r.id;
                    return (
                      <motion.tr key={r.id} {...rowAnim} className="hover:bg-white/[0.035]">
                        <td className="py-2.5 pr-4 font-mono text-[12px] text-white/85">{r.id}</td>
                        <td className="py-2.5 pr-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] ${TYPE_CLASS[r.type]}`}
                            title={r.type}
                          >
                            {TYPE_ICON[r.type]}
                            {TYPE_LABEL[r.type]}
                          </span>
                        </td>
                        <td className="py-2.5 pr-4">{r.actor}</td>
                        <td className="py-2.5 pr-4">{r.action}</td>
                        <td className="py-2.5 pr-4 text-white/60" title={new Date(r.ts).toLocaleString()}>
                          {timeAgoOrRaw(r.ts)}
                        </td>
                        <td className="py-2.5 pr-2">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setOpened(r)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-2.5 py-1 text-xs hover:bg-white/10"
                              title="Подробнее"
                            >
                              <Info className="h-3.5 w-3.5" />
                              Подробнее
                            </button>
                            <button
                              onClick={() => copyId(r.id)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-2.5 py-1 text-xs hover:bg-white/10"
                              title="Скопировать ID"
                            >
                              {justCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                              {justCopied ? "Скопировано" : "ID"}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10">
                    <div className="flex flex-col items-center gap-2 text-white/60">
                      <ShieldCheck className="h-5 w-5" />
                      <div className="text-sm">Ничего не найдено по выбранным фильтрам</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* пагинация */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
            <div>
              Показаны {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} из {filtered.length}
            </div>
            <div className="inline-flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full border border-white/20 px-3 py-1.5 disabled:opacity-40 hover:bg-white/10"
              >
                Назад
              </button>
              {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
                const n = i + 1;
                return (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`rounded-full border px-3 py-1.5 ${
                      page === n ? "bg-white text-black border-white" : "border-white/20 hover:bg-white/10"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-full border border-white/20 px-3 py-1.5 disabled:opacity-40 hover:bg-white/10"
              >
                Вперёд
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Подробнее */}
      <AnimatePresence>
        {opened && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setOpened(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 18, opacity: 0 }}
              className="w-full max-w-2xl rounded-2xl border border-white/15 bg-black/85 text-white"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="font-semibold flex items-center gap-2">
                  {TYPE_ICON[opened.type]}
                  {TYPE_LABEL[opened.type]} • {opened.id}
                </div>
                <button
                  onClick={() => setOpened(null)}
                  className="rounded-full border border-white/20 p-1 hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4">
                <div className="text-sm text-white/70 mb-2">
                  <span className="mr-2">Пользователь:</span>
                  <span className="text-white/90">{opened.actor}</span>
                </div>
                <div className="text-sm text-white/70 mb-2">
                  <span className="mr-2">Действие:</span>
                  <span className="text-white/90">{opened.action}</span>
                </div>
                <div className="text-sm text-white/70 mb-4">
                  <span className="mr-2">Время:</span>
                  <span className="text-white/90" title={new Date(opened.ts).toLocaleString()}>
                    {timeAgoOrRaw(opened.ts)}
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 overflow-x-auto">
                  <pre className="text-xs leading-relaxed text-white/85">
                    {JSON.stringify(opened, null, 2)}
                  </pre>
                </div>
              </div>
              <div className="px-4 py-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(opened, null, 2));
                    setToast("JSON события скопирован");
                    setTimeout(() => setToast(null), 1400);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Скопировать JSON
                </button>
                <button
                  onClick={() => setOpened(null)}
                  className="rounded-full border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10"
                >
                  Закрыть
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}