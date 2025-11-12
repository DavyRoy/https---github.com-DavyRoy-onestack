// app/demo/admin/booking/schedules/exceptions/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  loadExceptions,
  saveExceptions,
  ADMIN_RESOURCES,
} from "@/app/demo/(shared)/booking";

/* ====================== утилиты ====================== */

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function useQueryState() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const q        = sp.get("q") ?? "";
  const dateFrom = sp.get("date_from") ?? "";
  const dateTo   = sp.get("date_to") ?? "";
  const res      = sp.get("resource") ?? "";
  const loc      = sp.get("location") ?? "";
  const pageRaw  = Number(sp.get("page") ?? "1");
  const sizeRaw  = Number(sp.get("pageSize") ?? "20");
  const page     = clamp(Number.isFinite(pageRaw) ? pageRaw : 1, 1, 10_000);
  const size     = clamp(Number.isFinite(sizeRaw) ? sizeRaw : 20, 5, 100);

  function set(next: Record<string, string | number | undefined>) {
    const query = new URLSearchParams(sp.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === "" || v === null) query.delete(k);
      else query.set(k, String(v));
    });
    router.push(`${pathname}?${query.toString()}`);
  }

  return { q, dateFrom, dateTo, res, loc, page, size, set };
}

/** Достаём время из разных возможных схем (from/to или start/end) */
function exGetTime(e: any) {
  const from = e.start ?? e.from ?? "";
  const to   = e.end   ?? e.to   ?? "";
  return { from, to };
}
/** Унифицируем ресурс: resourceId или первый из resourceIds[] */
function exGetResourceId(e: any) {
  if (e.resourceId) return String(e.resourceId);
  if (Array.isArray(e.resourceIds) && e.resourceIds.length > 0) return String(e.resourceIds[0]);
  return "";
}
/** Пересечение по времени в рамках одной даты. Пустое время = весь день */
function overlaps(dateA: string, fromA: string, toA: string, dateB: string, fromB: string, toB: string) {
  if (dateA !== dateB) return false;
  const aF = fromA || "00:00";
  const aT = toA   || "23:59";
  const bF = fromB || "00:00";
  const bT = toB   || "23:59";
  return aF < bT && bF < aT;
}

/* ====================== страница ====================== */

export default function ExceptionsListPage() {
  const { q, dateFrom, dateTo, res, loc, page, size, set } = useQueryState();
  const [rows, setRows] = React.useState<any[]>([]);

  React.useEffect(() => {
    setRows(loadExceptions());
  }, []);

  const filtered = React.useMemo(() => {
    const xs = rows.filter((e) => {
      const reason = (e.reason ?? "").toString();
      if (q && !reason.toLowerCase().includes(q.toLowerCase())) return false;

      const rid = exGetResourceId(e);
      if (res && rid !== res) return false;

      if (loc && (e.locationId ?? "") !== loc) return false;

      const d = (e.date ?? "").toString();
      if (dateFrom && d < dateFrom) return false;
      if (dateTo && d > dateTo) return false;

      return true;
    });

    // сортировка: по дате (новые выше), затем по началу интервала
    return xs.sort((a, b) => {
      const da = String(a.date ?? "");
      const db = String(b.date ?? "");
      if (da !== db) return db.localeCompare(da);
      const { from: fa } = exGetTime(a);
      const { from: fb } = exGetTime(b);
      return (fb || "00:00").localeCompare(fa || "00:00");
    });
  }, [rows, q, dateFrom, dateTo, res, loc]);

  const total = filtered.length;
  const start = (page - 1) * size;
  const pageRows = filtered.slice(start, start + size);

  function conflictCount(e: any) {
    const { from: eF, to: eT } = exGetTime(e);
    const rid = exGetResourceId(e);
    return rows.filter((x) => {
      if (x.id === e.id) return false;
      const { from: xF, to: xT } = exGetTime(x);
      const sameRes = rid ? exGetResourceId(x) === rid : true;
      const sameLoc = e.locationId ? (x.locationId ?? "") === e.locationId : true;
      return overlaps(e.date ?? "", eF, eT, x.date ?? "", xF, xT) && sameRes && sameLoc;
    }).length;
  }

  function onDelete(id: string) {
    const next = rows.filter((r) => r.id !== id);
    saveExceptions(next as any);
    setRows(next);
  }

  /* ====================== рендер ====================== */

  return (
    <div className="grid gap-6">
      {/* header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs text-white/60">Расписания • Исключения</div>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">Исключения / блэкауты</h1>
        </div>
        <div className="flex gap-2">
          <Link
            href="/demo/admin/booking/schedules"
            className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06]"
          >
            К недельной сетке
          </Link>
        </div>
      </header>

      {/* filters */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 grid gap-3">
        <div className="grid gap-2 md:grid-cols-5">
          <input
            placeholder="Поиск по причине…"
            aria-label="Поиск по причине"
            value={q}
            onChange={(e) => set({ q: e.target.value, page: 1 })}
            className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
          />
          <input
            type="date"
            aria-label="Дата с"
            value={dateFrom}
            onChange={(e) => set({ date_from: e.target.value, page: 1 })}
            className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
          />
          <input
            type="date"
            aria-label="Дата по"
            value={dateTo}
            onChange={(e) => set({ date_to: e.target.value, page: 1 })}
            className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
          />
          <select
            aria-label="Ресурс"
            value={res}
            onChange={(e) => set({ resource: e.target.value, page: 1 })}
            className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
          >
            <option value="">Все ресурсы</option>
            {ADMIN_RESOURCES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <input
            placeholder="Локация (id)"
            aria-label="Локация"
            value={loc}
            onChange={(e) => set({ location: e.target.value, page: 1 })}
            className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => set({ q: "", date_from: "", date_to: "", resource: "", location: "", page: 1 })}
            className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06]"
          >
            Сбросить
          </button>
          <Link
            href="/demo/admin/booking/schedules/exceptions/new"
            className="rounded-xl border border-emerald-400/40 bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-2"
          >
            Добавить исключение
          </Link>

          <div className="ml-auto flex items-center gap-2 text-xs">
            <span className="opacity-70">На странице:</span>
            <select
              value={String(size)}
              onChange={(e) => set({ pageSize: Number(e.target.value), page: 1 })}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-1.5"
              aria-label="Размер страницы"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* mobile cards */}
      <section className="md:hidden grid gap-2">
        {pageRows.length === 0 ? (
          <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-center text-sm text-white/60">
            Нет исключений для текущих фильтров
          </div>
        ) : (
          pageRows.map((e) => {
            const { from, to } = exGetTime(e);
            const rid = exGetResourceId(e);
            const resName = ADMIN_RESOURCES.find((r) => r.id === rid)?.name;
            const conflicts = conflictCount(e);
            return (
              <div key={e.id} className="rounded-2xl border border-white/15 bg-white/[0.05] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      <Link href={`/demo/admin/booking/schedules/exceptions/${e.id}`} className="hover:underline">
                        {e.reason ?? "Исключение"}
                      </Link>
                    </div>
                    <div className="mt-0.5 text-xs text-white/60">
                      {e.date} • {(from || "00:00")}–{(to || "23:59")}
                    </div>
                    <div className="mt-0.5 text-xs text-white/60">
                      Локация: {e.locationId ?? "—"} • Ресурс: {resName ?? "—"}
                    </div>
                    <div className="mt-1">
                      {conflicts > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] border border-amber-400/40 bg-amber-500/15">
                          {conflicts} пересеч.
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] border border-emerald-400/40 bg-emerald-500/15">
                          нет конфликтов
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col gap-2">
                    <Link
                      href={`/demo/admin/booking/schedules/exceptions/${e.id}`}
                      className="rounded-lg border border-white/15 px-2 py-1 text-sm hover:bg-white/[0.06]"
                    >
                      Открыть
                    </Link>
                    <button
                      onClick={() => onDelete(e.id)}
                      className="rounded-lg border border-red-400/40 px-2 py-1 text-sm hover:bg-red-500/10"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* desktop table */}
      <section className="hidden md:block rounded-2xl border border-white/15 bg-white/[0.05] overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-white/70 sticky top-0 bg-[#0b0e14]">
            <tr className="border-b border-white/10 text-left">
              <th className="p-3">Дата</th>
              <th className="p-3">Время</th>
              <th className="p-3">Причина</th>
              <th className="p-3">Локация</th>
              <th className="p-3">Ресурс</th>
              <th className="p-3">Конфликты</th>
              <th className="p-3 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-white/60">
                  Нет исключений для текущих фильтров
                </td>
              </tr>
            ) : (
              pageRows.map((e) => {
                const { from, to } = exGetTime(e);
                const rid = exGetResourceId(e);
                const resName = ADMIN_RESOURCES.find((r) => r.id === rid)?.name;
                const conflicts = conflictCount(e);
                return (
                  <tr key={e.id} className="border-b border-white/5 hover:bg-white/[0.04]">
                    <td className="p-3">{e.date}</td>
                    <td className="p-3">
                      {(from || "00:00")}–{(to || "23:59")}
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/demo/admin/booking/schedules/exceptions/${e.id}`}
                        className="hover:underline"
                      >
                        {e.reason ?? "Исключение"}
                      </Link>
                    </td>
                    <td className="p-3">{e.locationId ?? <span className="opacity-60">—</span>}</td>
                    <td className="p-3">{resName ?? <span className="opacity-60">—</span>}</td>
                    <td className="p-3">
                      {conflicts > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs border border-amber-400/40 bg-amber-500/15">
                          {conflicts} пересеч.
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs border border-emerald-400/40 bg-emerald-500/15">
                          нет
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex gap-2">
                        <Link
                          href={`/demo/admin/booking/schedules/exceptions/${e.id}`}
                          className="rounded-lg border border-white/15 px-2 py-1 hover:bg-white/[0.06]"
                        >
                          Открыть
                        </Link>
                        <button
                          onClick={() => onDelete(e.id)}
                          className="rounded-lg border border-red-400/40 px-2 py-1 hover:bg-red-500/10"
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      {/* pagination */}
      <div className="flex items-center justify-between text-sm">
        <div className="opacity-70">
          {total === 0 ? "0" : `${start + 1}–${Math.min(start + size, total)} из ${total}`}
        </div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => set({ page: page - 1 })}
            className="rounded-lg border border-white/15 px-3 py-1.5 disabled:opacity-40"
          >
            Назад
          </button>
          <button
            disabled={start + size >= total}
            onClick={() => set({ page: page + 1 })}
            className="rounded-lg border border-white/15 px-3 py-1.5 disabled:opacity-40"
          >
            Вперёд
          </button>
        </div>
      </div>
    </div>
  );
}