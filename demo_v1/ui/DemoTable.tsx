// src/app/demo/ui/DemoTable.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Clock3 } from "lucide-react";

export type Row = {
  id: string;
  name: string;
  status: "Новый" | "В работе" | "Готово";
  owner: string;
  updated: string;
};

const STATUS_TONE: Record<Row["status"], string> = {
  "Новый": "border-white/20 bg-sky-400/15 text-sky-200",
  "В работе": "border-white/20 bg-white/[0.08] text-white/90",
  "Готово": "border-white/20 bg-emerald-400/15 text-emerald-200",
};

function StatusIcon({ status }: { status: Row["status"] }) {
  if (status === "Новый") return <Clock3 className="h-3.5 w-3.5" aria-hidden />;
  if (status === "Готово") return <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />;
  return (
    <Loader2
      className="h-3.5 w-3.5 motion-safe:animate-spin"
      style={{ animationDuration: "1.6s" }}
      aria-hidden
    />
  );
}

const demoRows: Row[] = [
  { id: "ORD-1024", name: "Заявка на подключение", status: "В работе", owner: "Иван", updated: "сегодня" },
  { id: "ORD-1025", name: "Продление подписки", status: "Новый", owner: "Ольга", updated: "вчера" },
  { id: "ORD-1026", name: "Импорт CSV", status: "Готово", owner: "Андрей", updated: "2 дн. назад" },
];

type SortKey = keyof Pick<Row, "id" | "name" | "status" | "owner" | "updated">;
type SortDir = "asc" | "desc";

export function DemoTable({
  data = demoRows,
  loading = false,
  onRowClick,
  caption = "Последние операции и их статус",
  emptyText = "Пока нет данных",
  rowSize = "normal",
  pageSize = 10,
  initialPage = 1,
  onPageChange,
  /** a11y: подпись для SR */
  ariaLabel = "Таблица данных",
  /** начальная сортировка (по умолчанию updated desc) */
  initialSortKey = "updated",
  initialSortDir = "desc",
  /** коллбек об изменении сортировки */
  onSortChange,
}: {
  data?: Row[];
  loading?: boolean;
  onRowClick?: (row: Row) => void;
  caption?: string;
  emptyText?: string;
  rowSize?: "compact" | "normal";
  /** кол-во строк на странице (вкл. пагинацию при > pageSize) */
  pageSize?: number;
  /** стартовая страница (1-based) */
  initialPage?: number;
  /** коллбек при смене страницы */
  onPageChange?: (page: number) => void;
  /** a11y */
  ariaLabel?: string;
  /** сортировка */
  initialSortKey?: SortKey;
  initialSortDir?: SortDir;
  onSortChange?: (key: SortKey, dir: SortDir) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>(initialSortKey);
  const [sortDir, setSortDir] = useState<SortDir>(initialSortDir);

  // если внешние initial* поменяются (редко, но на всякий случай)
  useEffect(() => {
    setSortKey(initialSortKey);
  }, [initialSortKey]);
  useEffect(() => {
    setSortDir(initialSortDir);
  }, [initialSortDir]);

  const setSort = (k: SortKey) => {
    setSortDir((d) => {
      const next = k === sortKey ? (d === "asc" ? "desc" : "asc") : "asc";
      onSortChange?.(k, next);
      return next;
    });
    setSortKey(k);
  };

  const sorted = useMemo(() => {
    const arr = [...data];
    arr.sort((a, b) => {
      const av = String(a[sortKey] ?? "");
      const bv = String(b[sortKey] ?? "");
      const cmp = av.localeCompare(bv, "ru", { numeric: true, sensitivity: "base" });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [data, sortKey, sortDir]);

  /* ───── пагинация ───── */
  const [page, setPage] = useState(Math.max(1, initialPage));
  // если initialPage пришёл новый — синхронизируемся
  useEffect(() => {
    setPage(Math.max(1, initialPage));
  }, [initialPage]);

  useEffect(() => {
    // если меняются данные/размер — корректируем текущую страницу
    const max = Math.max(1, Math.ceil(sorted.length / pageSize));
    if (page > max) {
      setPage(1);
      onPageChange?.(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorted.length, pageSize]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows =
    totalPages > 1 ? sorted.slice((page - 1) * pageSize, page * pageSize) : sorted;

  const changePage = (n: number) => {
    const clamped = Math.min(totalPages, Math.max(1, n));
    setPage(clamped);
    onPageChange?.(clamped);
  };

  const rowPad = rowSize === "compact" ? "py-1.5" : "py-2";

  // расчёт окна страниц с многоточиями
  const pageWindow = useMemo(() => {
    const windowSize = 5;
    if (totalPages <= windowSize + 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const start = Math.max(2, page - 2);
    const end = Math.min(totalPages - 1, page + 2);
    const core = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    return [1, ...(start > 2 ? ["…"] : []), ...core, ...(end < totalPages - 1 ? ["…"] : []), totalPages];
  }, [page, totalPages]);

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
      {/* live region для анонсов пагинации (SR) */}
      <div className="sr-only" aria-live="polite">
        Страница {page} из {totalPages}. Всего записей: {sorted.length}.
      </div>

      <table className="min-w-[620px] w-full text-sm" aria-label={ariaLabel}>
        <caption className="sr-only">{caption}</caption>

        <thead className="sticky top-0 bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30">
          <tr className="text-left text-white/60">
            {(
              [
                ["id", "ID"],
                ["name", "Название"],
                ["status", "Статус"],
                ["owner", "Ответственный"],
                ["updated", "Обновлено"],
              ] as const
            ).map(([key, label]) => {
              const active = sortKey === (key as SortKey);
              const dir = active ? sortDir : undefined;
              return (
                <th key={key} className="py-2 pr-4" scope="col">
                  <button
                    onClick={() => setSort(key as SortKey)}
                    className={`inline-flex items-center gap-1 rounded-md px-1 py-0.5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                      active ? "text-white" : ""
                    }`}
                    aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
                    aria-label={`Сортировать по «${label}» ${
                      active ? (dir === "asc" ? "(по возрастанию)" : "(по убыванию)") : ""
                    }`}
                  >
                    {label}
                    <svg
                      className={`h-3 w-3 transition ${active ? "opacity-100" : "opacity-40"}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      {dir === "asc" ? (
                        <path
                          d="M7 14l5-5 5 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ) : (
                        <path
                          d="M7 10l5 5 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                    </svg>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="divide-y divide-white/10">
          {loading &&
            Array.from({ length: Math.min(pageSize, 3) }).map((_, i) => (
              <tr key={`sk-${i}`} className="animate-pulse">
                <td className={`${rowPad} pr-4`}>
                  <div className="h-3 w-24 rounded bg-white/10" />
                </td>
                <td className={`${rowPad} pr-4`}>
                  <div className="h-3 w-40 rounded bg-white/10" />
                </td>
                <td className={`${rowPad} pr-4`}>
                  <div className="h-5 w-20 rounded-full bg-white/10" />
                </td>
                <td className={`${rowPad} pr-4`}>
                  <div className="h-3 w-24 rounded bg-white/10" />
                </td>
                <td className={`${rowPad} pr-4`}>
                  <div className="h-3 w-20 rounded bg-white/10" />
                </td>
              </tr>
            ))}

          {!loading && pageRows.length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-white/60">
                {emptyText}
              </td>
            </tr>
          )}

          {!loading &&
            pageRows.map((r) => (
              <tr
                key={r.id}
                tabIndex={onRowClick ? 0 : -1}
                onClick={onRowClick ? () => onRowClick(r) : undefined}
                onKeyDown={(e) => {
                  if (!onRowClick) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onRowClick(r);
                  }
                }}
                className={`transition ${
                  onRowClick
                    ? "cursor-pointer hover:bg-white/[0.05] focus-visible:bg-white/[0.07] outline-none"
                    : ""
                }`}
              >
                <td className={`${rowPad} pr-4 font-mono`}>{r.id}</td>
                <td className={`${rowPad} pr-4`}>{r.name}</td>
                <td className={`${rowPad} pr-4`}>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] ${STATUS_TONE[r.status]}`}
                  >
                    <StatusIcon status={r.status} />
                    <span className="sr-only">Статус: </span>
                    {r.status}
                  </span>
                </td>
                <td className={`${rowPad} pr-4`}>{r.owner}</td>
                <td className={`${rowPad} pr-4 text-white/60`}>{r.updated}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* пагинация */}
      {!loading && totalPages > 1 && (
        <div className="px-4 md:px-5 py-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
          <div className="hidden sm:block">
            Показаны {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} из {sorted.length}
          </div>
          <div className="sm:hidden">Стр. {page} из {totalPages}</div>

          <div className="inline-flex items-center gap-1">
            <button
              onClick={() => changePage(page - 1)}
              disabled={page <= 1}
              className="rounded-full border border-white/20 px-3 py-1.5 disabled:opacity-40 hover:bg-white/10"
              aria-label="Назад"
            >
              Назад
            </button>

            {/* страничное окно с многоточиями — скрыто на xs */}
            <div className="hidden sm:inline-flex items-center gap-1">
              {pageWindow.map((p, i) =>
                p === "…" ? (
                  <span key={`dots-${i}`} className="px-2 select-none">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => changePage(p as number)}
                    className={`rounded-full border px-3 py-1.5 ${
                      page === p ? "bg-white text-black border-white" : "border-white/20 hover:bg-white/10"
                    }`}
                    aria-current={page === p ? "page" : undefined}
                    aria-label={`Страница ${p}`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => changePage(page + 1)}
              disabled={page >= totalPages}
              className="rounded-full border border-white/20 px-3 py-1.5 disabled:opacity-40 hover:bg-white/10"
              aria-label="Вперёд"
            >
              Вперёд
            </button>
          </div>
        </div>
      )}
    </div>
  );
}