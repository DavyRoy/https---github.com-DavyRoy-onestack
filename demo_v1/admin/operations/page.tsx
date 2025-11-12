// src/app/demo/admin/operations/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Panel } from "../../ui/DemoCards";
import {
  Search,
  RefreshCw,
  Download,
  ArrowUpDown,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Modal } from "../../ui/Modal";
import { motion, AnimatePresence } from "framer-motion";

/* ============================== types & utils ============================== */

type Row = {
  id: string;
  name: string;
  status: "новый" | "в работе" | "доставлен";
  updated: string;
  total: string;
};

type SortKey = "id" | "name" | "status" | "total" | "updated";
type SortDir = "asc" | "desc";

const STATUS_STYLE: Record<Row["status"], string> = {
  "новый": "border-sky-400/30 text-sky-200 bg-sky-400/10",
  "в работе": "border-amber-400/30 text-amber-200 bg-amber-400/10",
  "доставлен": "border-emerald-400/30 text-emerald-200 bg-emerald-400/10",
};

// "12 300 ₽" -> 12300 ; "12,300.50" -> 12300.5
const parseTotal = (s: string) => {
  const cleaned = String(s).replace(/\s/g, "").replace(/[₽€$]/g, "");
  const normalized = cleaned.replace(/,/g, ".").replace(/\.(?=.*\.)/g, "");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
};
const formatMoney = (n: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

const toCsv = (rows: Row[]) => {
  const head = "id,name,status,total,updated";
  const body = rows
    .map((r) => [r.id, r.name.replaceAll(",", " "), r.status, parseTotal(r.total), r.updated].join(","))
    .join("\n");
  return `${head}\n${body}`;
};

/* ================================== page ================================== */

export default function AdminOperationsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  const [sel, setSel] = useState<Row | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<SortKey>("updated");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<10 | 20 | 50>(20);

  const [statusFilter, setStatusFilter] = useState<"all" | Row["status"]>("all");

  const searchRef = useRef<HTMLInputElement | null>(null);

  /* ------------------------------ data loading ----------------------------- */
  const abortRef = useRef<AbortController | null>(null);
  const load = useCallback(async () => {
    abortRef.current?.abort();
    const ctl = new AbortController();
    abortRef.current = ctl;
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/demo/orders", { cache: "no-store", signal: ctl.signal });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setRows((data.items || []) as Row[]);
      setPage(1);
    } catch (e: any) {
      if (e?.name !== "AbortError") setErr("Не удалось загрузить список. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  /* --------------------------------- search -------------------------------- */
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q.trim().toLowerCase()), 220);
    return () => clearTimeout(id);
  }, [q]);

  /* ----------------------------- keyboard sugar ---------------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") setSel(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* --------------------------------- derive -------------------------------- */
  const filtered = useMemo(() => {
    const base = statusFilter === "all" ? rows : rows.filter((r) => r.status === statusFilter);
    if (!debouncedQ) return base;
    return base.filter((r) => {
      const s = debouncedQ;
      return (
        r.id.toLowerCase().includes(s) ||
        r.name.toLowerCase().includes(s) ||
        r.status.toLowerCase().includes(s)
      );
    });
  }, [rows, debouncedQ, statusFilter]);

  const counters = useMemo(() => {
    const base = { all: filtered.length, "новый": 0, "в работе": 0, "доставлен": 0 } as Record<
      "all" | Row["status"],
      number
    >;
    filtered.forEach((r) => (base[r.status] += 1));
    return base;
  }, [filtered]);

  const totalSum = useMemo(() => filtered.reduce((s, r) => s + parseTotal(r.total), 0), [filtered]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let av: number | string = "";
      let bv: number | string = "";
      switch (sortKey) {
        case "total":
          av = parseTotal(a.total);
          bv = parseTotal(b.total);
          break;
        case "updated": {
          const ta = Date.parse(a.updated);
          const tb = Date.parse(b.updated);
          av = Number.isNaN(ta) ? a.updated : ta;
          bv = Number.isNaN(tb) ? b.updated : tb;
          break;
        }
        default:
          av = a[sortKey];
          bv = b[sortKey] as any;
      }
      if (av < (bv as any)) return sortDir === "asc" ? -1 : 1;
      if (av > (bv as any)) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [sorted.length, page, totalPages]);

  const pageRows = useMemo(
    () => sorted.slice((page - 1) * pageSize, page * pageSize),
    [sorted, page, pageSize],
  );

  /* -------------------------------- actions -------------------------------- */
  const flipSort = (k: SortKey) => {
    if (sortKey !== k) {
      setSortKey(k);
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  };

  const exportCsv = useCallback(() => {
    const blob = new Blob([toCsv(sorted)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "operations.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [sorted]);

  const copyId = useCallback(async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setToast("ID скопирован");
      setTimeout(() => setCopiedId((s) => (s === id ? null : s)), 1000);
      setTimeout(() => setToast(null), 1200);
    } catch {
      /* no-op */
    }
  }, []);

  const mark = useCallback(
    (text: string) => {
      const s = debouncedQ;
      if (!s) return text;
      const lower = text.toLowerCase();
      const idx = lower.indexOf(s);
      if (idx === -1) return text;
      const before = text.slice(0, idx);
      const match = text.slice(idx, idx + s.length);
      const after = text.slice(idx + s.length);
      return (
        <>
          {before}
          <span className="bg-white/20 rounded px-0.5">{match}</span>
          {after}
        </>
      );
    },
    [debouncedQ],
  );

  /* ---------------------------------- UI ----------------------------------- */

  const rowAnim = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 6 },
    transition: { duration: 0.18, ease: "easeOut" },
  };

  return (
    <div className="space-y-6">
      {/* toast */}
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

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[clamp(1.3rem,3vw,1.8rem)] font-extrabold leading-tight text-white">Операции</h1>
          <p className="mt-0.5 text-white/70">Список последних заказов/заданий.</p>
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
            onClick={exportCsv}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs hover:bg-white/10"
            title="Экспорт CSV"
          >
            <Download className="h-4 w-4" />
            Экспорт
          </button>
        </div>
      </div>

      {/* Filters */}
      <Panel title="Фильтр">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-3">
          {/* поиск */}
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск по ID / названию / статусу…  (нажмите «/»)"
              aria-label="Поиск по операциям"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 py-2.5 outline-none placeholder:text-white/40"
            />
          </div>

          {/* статус-фильтры как сегменты */}
          <div className="flex flex-wrap gap-2">
            {(["all", "новый", "в работе", "доставлен"] as const).map((s) => {
              const active = statusFilter === s;
              const badge =
                s === "all"
                  ? counters.all
                  : s === "новый"
                  ? counters["новый"]
                  : s === "в работе"
                  ? counters["в работе"]
                  : counters["доставлен"];
              const style =
                s === "новый"
                  ? "border-sky-400/30 bg-sky-400/10"
                  : s === "в работе"
                  ? "border-amber-400/30 bg-amber-400/10"
                  : s === "доставлен"
                  ? "border-emerald-400/30 bg-emerald-400/10"
                  : "border-white/30 bg-white/5";
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs border transition ${
                    active ? "bg-white text-black border-white" : `text-white/85 ${style} hover:bg-white/10`
                  }`}
                >
                  <span className="capitalize">{s === "all" ? "все" : s}</span>
                  <span
                    className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] leading-4 border ${
                      active ? "border-black/20 bg-black/10 text-black/80" : "border-white/15 bg-white/5 text-white/70"
                    }`}
                  >
                    {badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* размер страницы */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">На странице</span>
            {[10, 20, 50].map((n) => (
              <button
                key={n}
                onClick={() => setPageSize(n as 10 | 20 | 50)}
                aria-pressed={pageSize === n}
                className={`rounded-full px-3 py-1.5 text-xs border ${
                  pageSize === n
                    ? "bg-white text-black border-white"
                    : "border-white/30 text-white/85 hover:bg-white/10"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* сводка по сумме */}
        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm flex flex-wrap gap-3">
          <div className="tabular-nums">Выбрано: {filtered.length}</div>
          <div className="tabular-nums">Сумма: {formatMoney(totalSum)}</div>
          <div className="ml-auto text-white/60 text-xs">Сумма по отфильтрованным данным</div>
        </div>
      </Panel>

      {/* Table/Card list */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div
          className="px-5 py-3 border-b border-white/10 text-sm font-semibold flex items-center gap-3"
          role="status"
          aria-live="polite"
        >
          {loading ? "Загрузка…" : `Найдено: ${sorted.length}`}
          {err && <span className="text-rose-300 font-normal">• {err}</span>}
          <span className="ml-auto text-xs text-white/60">
            Показаны {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} из {sorted.length}
          </span>
        </div>

        {/* MOBILE — карточки */}
        <div className="sm:hidden p-3 space-y-2">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={`sk${i}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="h-3 w-24 bg-white/10 rounded mb-2" />
                <div className="h-3 w-40 bg-white/10 rounded mb-2" />
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-white/10 rounded" />
                  <div className="h-6 w-24 bg-white/10 rounded" />
                </div>
              </div>
            ))}

          {!loading &&
            pageRows.map((r) => {
              const justCopied = copiedId === r.id;
              return (
                <div key={r.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => copyId(r.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-white/20 px-2 py-0.5 text-[11px]"
                    >
                      {justCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {r.id}
                    </button>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${STATUS_STYLE[r.status]}`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="mt-2 font-medium">{mark(r.name)}</div>
                  <div className="mt-1 text-sm text-white/70 flex items-center justify-between">
                    <span>{mark(r.total)}</span>
                    <span>{r.updated}</span>
                  </div>
                  <div className="mt-2">
                    <button
                      onClick={() => setSel(r)}
                      className="w-full rounded-xl border border-white/20 py-2 text-sm hover:bg-white/10"
                    >
                      Открыть
                    </button>
                  </div>
                </div>
              );
            })}

          {!loading && sorted.length === 0 && (
            <div className="py-8 text-center text-white/60">Ничего не найдено. Измените фильтры.</div>
          )}
        </div>

        {/* DESKTOP — таблица */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="sticky top-0 bg-black/40 backdrop-blur-md z-10">
              <tr className="text-left text-white/60">
                {(
                  [
                    ["id", "ID"],
                    ["name", "Название"],
                    ["status", "Статус"],
                    ["total", "Сумма"],
                    ["updated", "Обновлено"],
                    ["actions", ""],
                  ] as [SortKey | "actions", string][]
                ).map(([key, label]) => (
                  <th key={String(key)} className="py-2.5 pr-4">
                    {key === "actions" ? null : (
                      <button
                        onClick={() => flipSort(key as SortKey)}
                        className="inline-flex items-center gap-1.5 hover:text-white"
                        title="Сортировать"
                        aria-label={`Сортировать по: ${label}`}
                      >
                        {label}
                        {sortKey === key ? (
                          sortDir === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5" />
                        )}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`skl${i}`}>
                    <td colSpan={6} className="py-3">
                      <div className="h-3 w-3/4 bg-white/10 rounded" />
                    </td>
                  </tr>
                ))}

              {!loading && (
                <AnimatePresence initial={false}>
                  {pageRows.map((r) => {
                    const justCopied = copiedId === r.id;
                    return (
                      <motion.tr key={r.id} {...rowAnim} className="hover:bg-white/5">
                        <td className="py-2.5 pr-4">
                          <button
                            onClick={() => copyId(r.id)}
                            className="inline-flex items-center gap-1 rounded-full border border-white/20 px-2 py-0.5 text-[11px] hover:bg-white/10"
                            title="Скопировать ID"
                          >
                            {justCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            {r.id}
                          </button>
                        </td>
                        <td className="py-2.5 pr-4 cursor-pointer" onClick={() => setSel(r)}>
                          {mark(r.name)}
                        </td>
                        <td className="py-2.5 pr-4">
                          <span className={`rounded-full border px-2 py-0.5 text-[11px] ${STATUS_STYLE[r.status]}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-2.5 pr-4 tabular-nums">{mark(r.total)}</td>
                        <td className="py-2.5 pr-4 text-white/60">{r.updated}</td>
                        <td className="py-2.5 pr-2 text-right">
                          <button
                            onClick={() => setSel(r)}
                            className="rounded-full border border-white/20 px-3 py-1 text-xs hover:bg-white/10"
                          >
                            Открыть
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}

              {!loading && sorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10">
                    <div className="text-center text-white/60">Ничего не найдено. Измените фильтры.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* пагинация */}
        {sorted.length > 0 && (
          <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
            <div>
              Страница {page} из {totalPages}
            </div>
            <div className="inline-flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full border border-white/20 px-3 py-1.5 disabled:opacity-40 hover:bg-white/10"
              >
                Назад
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const n = start + i;
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

      {/* Modal */}
      <Modal
        open={!!sel}
        onClose={() => setSel(null)}
        title={sel ? `Операция ${sel.id}` : "Операция"}
        footer={
          <button
            onClick={() => setSel(null)}
            className="rounded-full bg-white px-4 py-2 text-sm text-black font-semibold"
          >
            Закрыть
          </button>
        }
      >
        {sel && (
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-white/60">Название:</span> {sel.name}
            </div>
            <div>
              <span className="text-white/60">Статус:</span>{" "}
              <span className={`rounded-full border px-2 py-0.5 text-[11px] ${STATUS_STYLE[sel.status]}`}>
                {sel.status}
              </span>
            </div>
            <div>
              <span className="text-white/60">Итого:</span> {sel.total}
            </div>
            <div>
              <span className="text-white/60">Обновлено:</span> {sel.updated}
            </div>
            <div className="text-white/60 text-xs pt-2">
              Демо-детали. В проде — состав заказа, позиции, платежи и логи.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}