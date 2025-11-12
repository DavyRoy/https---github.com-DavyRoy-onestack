// src/app/demo/manager/booking/components/BookingsTable.tsx
"use client";

import BookingRow from "./BookingRow";
import { Booking } from "../data/mockBookings";
import EmptyState from "./EmptyState";
import { TableSkeleton } from "./Skeletons";
import BulkBar from "./BulkBar";

type BulkActions = {
  onConfirm?: () => void;
  onCancel?: () => void;
  onExport?: () => void;
};

export default function BookingsTable({
  loading = false,
  rows,
  // выбор строк
  selectedIds,
  onToggleRow,
  onToggleAll,
  onClearSelection,
  // пагинация/сортировка
  page = 1,
  pageSize = 25,
  total = rows.length,
  onPageChange,
  onPageSizeChange,
  sort,
  onSortChange,
  // действия по строкам
  onInlineAction,
  // массовые действия
  bulkActions,
}: {
  loading?: boolean;
  rows: Booking[];
  selectedIds: string[];
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onClearSelection?: () => void;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (p: number) => void;
  onPageSizeChange?: (ps: number) => void;
  sort?: string;
  onSortChange?: (s: string) => void;
  onInlineAction: (id: string, nextStatus: string) => void;
  bulkActions?: BulkActions;
}) {
  const allSelected = rows.length > 0 && selectedIds.length === rows.length;

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  if (loading) return <TableSkeleton />;
  if (!rows || rows.length === 0) return <EmptyState />;

  return (
    <div className="relative">
      {/* обёртка с горизонтальной прокруткой на мобильных */}
      <div className="overflow-x-auto md:overflow-visible rounded-2xl border border-white/15">
        <table className="min-w-[900px] w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-white/[0.04] text-left text-xs text-white/70">
              <th className="p-2 w-10">
                <input
                  type="checkbox"
                  className="accent-white"
                  checked={allSelected}
                  onChange={(e) => onToggleAll(e.target.checked)}
                  aria-label="Выбрать все на странице"
                />
              </th>
              <Th title="Дата/время" sortKey="startAt" cur={sort} onSortChange={onSortChange} />
              <th className="p-2">Клиент</th>
              <th className="p-2 whitespace-nowrap">Услуга / Сотр.</th>
              <Th title="Статус" sortKey="status" cur={sort} onSortChange={onSortChange} />
              <th className="p-2">Источник</th>
              <th className="p-2 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <BookingRow
                key={b.id}
                b={b}
                selected={selectedIds.includes(b.id)}
                onToggle={onToggleRow}
                onInlineAction={onInlineAction}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* лёгкая подсказка для мобилы */}
      <div className="md:hidden mt-2 text-center text-xs text-white/60">
        Проведите по таблице, чтобы прокрутить →
      </div>

      {/* Пагинация */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="text-white/70">
          {start}–{end} из {total}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn"
            disabled={page <= 1}
            onClick={() => onPageChange?.(Math.max(1, page - 1))}
          >
            Назад
          </button>
          <span className="tabular-nums" aria-live="polite">
            {page}
          </span>
          <button
            className="btn"
            disabled={end >= total}
            onClick={() => onPageChange?.(end >= total ? page : page + 1)}
          >
            Вперёд
          </button>
          <select
            className="rounded-xl border border-white/15 bg-white/10 px-2 py-1 text-sm"
            value={String(pageSize)}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            aria-label="Размер страницы"
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n} на странице
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Массовая панель */}
      {selectedIds.length > 0 && (
        <BulkBar
          count={selectedIds.length}
          onConfirm={bulkActions?.onConfirm}
          onCancel={bulkActions?.onCancel}
          onExport={bulkActions?.onExport}
          onClear={onClearSelection}
        />
      )}
    </div>
  );
}

function Th({
  title,
  sortKey,
  cur,
  onSortChange,
}: {
  title: string;
  sortKey: string;
  cur?: string;
  onSortChange?: (s: string) => void;
}) {
  const dir =
    cur && (cur.startsWith(sortKey + "_") || cur === sortKey)
      ? (cur.split("_")[1] as "asc" | "desc")
      : undefined;

  const next = dir === "asc" ? `${sortKey}_desc` : `${sortKey}_asc`;

  return (
    <th className="p-2">
      {onSortChange ? (
        <button
          className="inline-flex items-center gap-1 hover:underline"
          onClick={() => onSortChange(next)}
        >
          <span>{title}</span>
          {dir && <span className="text-[10px] opacity-70">{dir === "asc" ? "▲" : "▼"}</span>}
        </button>
      ) : (
        <span>{title}</span>
      )}
    </th>
  );
}