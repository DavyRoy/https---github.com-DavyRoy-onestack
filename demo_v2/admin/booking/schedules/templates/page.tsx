// app/demo/admin/booking/schedules/templates/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  loadTemplates,
  saveTemplates,
  ADMIN_RESOURCES,
  type AdminTemplate,
} from "@/app/demo/(shared)/booking";

/* ========== Base path helper ========== */
function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

/* ========== Query state helper ========== */
function useQueryState() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const q    = sp.get("q") ?? "";
  const svc  = sp.get("service") ?? "";
  const res  = sp.get("resource") ?? "";
  const dow  = sp.get("dow") ?? ""; // 0..6 (Пн..Вс)
  const page = Math.max(1, Number(sp.get("page") ?? "1"));
  const size = Math.max(5, Number(sp.get("pageSize") ?? "20"));

  function set(next: Record<string, string | number | undefined>) {
    const query = new URLSearchParams(sp.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === "" || v === null) query.delete(k);
      else query.set(k, String(v));
    });
    router.push(`${pathname}?${query.toString()}`);
  }

  return { q, svc, res, dow, page, size, set };
}

/* ========== Consts / utils ========== */
const DAY: Record<number, string> = {
  0: "Пн", 1: "Вт", 2: "Ср", 3: "Чт", 4: "Пт", 5: "Сб", 6: "Вс",
};

function overlaps(aFrom: string, aTo: string, bFrom: string, bTo: string) {
  return aFrom < bTo && bFrom < aTo;
}

/* ========== Page ========== */
export default function TemplatesListPage() {
  const { q, svc, res, dow, page, size, set } = useQueryState();
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  const [rows, setRows] = React.useState<AdminTemplate[]>([]);

  React.useEffect(() => {
    setRows(loadTemplates());
  }, []);

  const filtered = rows.filter((t) => {
    if (q && !(`${t.name ?? ""} ${t.serviceId ?? ""}`.toLowerCase().includes(q.toLowerCase()))) return false;
    if (svc && (t.serviceId ?? "") !== svc) return false;
    if (res && (t.resourceId ?? "") !== res) return false;
    if (dow !== "" && String(t.dayOfWeek) !== dow) return false;
    return true;
  });

  const total = filtered.length;
  const start = (page - 1) * size;
  const pageRows = filtered.slice(start, start + size);

  function conflictCount(t: AdminTemplate) {
    return rows.filter((x) =>
      x.id !== t.id &&
      (x.active ?? true) &&
      x.resourceId === t.resourceId &&
      x.dayOfWeek === t.dayOfWeek &&
      overlaps(x.from, x.to, t.from, t.to)
    ).length;
  }

  function capacityBadge(t: AdminTemplate) {
    const r = ADMIN_RESOURCES.find((rr) => rr.id === t.resourceId);
    const cap = r?.capacity ?? 1;
    const par = (t as any).parallelSlots ?? (t as any).parallel ?? 1; // поддержка возможных полей
    const ok = par <= cap;
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs border ${
          ok ? "border-emerald-400/40 bg-emerald-500/15" : "border-amber-400/40 bg-amber-500/15"
        }`}
        title={`Параллельных слотов: ${par} / Вместимость ресурса: ${cap}`}
      >
        {par}/{cap} {ok ? "OK" : "↑"}
      </span>
    );
  }

  function onDuplicate(id: string) {
    const src = rows.find((r) => r.id === id);
    if (!src) return;
    const copy: AdminTemplate = {
      ...src,
      id: `tpl-${Date.now()}`,
      name: `${src.name ?? "Шаблон"} (копия)`,
    };
    const next = [copy, ...rows];
    saveTemplates(next);
    setRows(next);
  }

  function onDelete(id: string) {
    const next = rows.filter((r) => r.id !== id);
    saveTemplates(next);
    setRows(next);
  }

  /* ========== Render ========== */
  return (
    <div className="grid gap-6">
      {/* Header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs text-white/60">Расписания • Шаблоны</div>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">Шаблоны слотов</h1>
          <p className="mt-1 text-sm text-white/70">
            Повторяющиеся временные окна для услуг/ресурсов. Здесь удобно искать, дублировать и чистить конфликты.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`${base}/booking/schedules`}
            className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06]"
          >
            К недельной сетке
          </Link>
          <Link
            href={`${base}/booking/schedules/templates/new`}
            className="rounded-xl border border-emerald-400/40 bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-2"
          >
            Создать шаблон
          </Link>
        </div>
      </header>

      {/* Filters */}
      <section
        className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 grid gap-3"
        aria-label="Фильтры списка шаблонов"
      >
        <div className="grid gap-2 md:grid-cols-4">
          <label className="grid gap-1">
            <span className="text-xs text-white/60">Поиск</span>
            <input
              placeholder="Название / service id…"
              value={q}
              onChange={(e) => set({ q: e.target.value, page: 1 })}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
              inputMode="search"
              aria-label="Поиск по названию или service id"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-white/60">Услуга</span>
            <input
              placeholder="service id"
              value={svc}
              onChange={(e) => set({ service: e.target.value, page: 1 })}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
              aria-label="Фильтр по услуге"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-white/60">Ресурс</span>
            <select
              value={res}
              onChange={(e) => set({ resource: e.target.value, page: 1 })}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
              aria-label="Фильтр по ресурсу"
            >
              <option value="">Все ресурсы</option>
              {ADMIN_RESOURCES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-white/60">День недели</span>
            <select
              value={dow}
              onChange={(e) => set({ dow: e.target.value, page: 1 })}
              className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
              aria-label="Фильтр по дню недели"
            >
              <option value="">Все дни</option>
              {Object.entries(DAY).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => set({ q: "", service: "", resource: "", dow: "", page: 1 })}
            className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06]"
          >
            Сбросить
          </button>
          <span className="ml-auto text-xs text-white/60 self-center">
            Найдено: <span className="text-white/85">{total}</span>
          </span>
        </div>
      </section>

      {/* Mobile cards */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] md:hidden">
        <div className="divide-y divide-white/10">
          {pageRows.length === 0 ? (
            <div className="p-6 text-center text-white/60 text-sm">Нет шаблонов для текущих фильтров.</div>
          ) : (
            pageRows.map((t) => {
              const resName = ADMIN_RESOURCES.find((r) => r.id === t.resourceId)?.name ?? "—";
              const conflicts = conflictCount(t);
              return (
                <div key={t.id} className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{t.name}</div>
                      <div className="mt-0.5 text-xs text-white/60">
                        {DAY[t.dayOfWeek]} • {t.from}–{t.to}
                        {" • "}
                        ресурс: {resName}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        {capacityBadge(t)}
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
                    <div className="shrink-0 flex flex-col gap-1">
                      <Link
                        href={`${base}/booking/schedules/templates/${t.id}`}
                        className="rounded-lg border border-white/15 px-2 py-1 text-sm hover:bg-white/[0.06]"
                      >
                        Открыть
                      </Link>
                      <button
                        onClick={() => onDuplicate(t.id)}
                        className="rounded-lg border border-white/15 px-2 py-1 text-sm hover:bg-white/[0.06]"
                      >
                        Дублировать
                      </button>
                      <button
                        onClick={() => onDelete(t.id)}
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
        </div>
      </section>

      {/* Desktop table */}
      <section className="hidden md:block rounded-2xl border border-white/15 bg-white/[0.05] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-white/70">
            <tr className="border-b border-white/10">
              <th className="text-left p-3">Название</th>
              <th className="text-left p-3">День</th>
              <th className="text-left p-3">Время</th>
              <th className="text-left p-3">Услуга</th>
              <th className="text-left p-3">Ресурс</th>
              <th className="text-left p-3">Cap.</th>
              <th className="text-left p-3">Конфликты</th>
              <th className="text-right p-3">Действия</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-white/60">
                  Нет шаблонов для текущих фильтров
                </td>
              </tr>
            ) : (
              pageRows.map((t) => {
                const conflicts = conflictCount(t);
                const resName = ADMIN_RESOURCES.find((r) => r.id === t.resourceId)?.name;
                return (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.04]">
                    <td className="p-3">
                      <Link
                        href={`${base}/booking/schedules/templates/${t.id}`}
                        className="hover:underline"
                      >
                        {t.name}
                      </Link>
                    </td>
                    <td className="p-3">{DAY[t.dayOfWeek]}</td>
                    <td className="p-3">
                      {t.from}–{t.to}
                    </td>
                    <td className="p-3">{t.serviceId ?? <span className="opacity-60">—</span>}</td>
                    <td className="p-3">{resName ?? <span className="opacity-60">—</span>}</td>
                    <td className="p-3">{capacityBadge(t)}</td>
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
                          href={`${base}/booking/schedules/templates/${t.id}`}
                          className="rounded-lg border border-white/15 px-2 py-1 hover:bg-white/[0.06]"
                        >
                          Открыть
                        </Link>
                        <button
                          onClick={() => onDuplicate(t.id)}
                          className="rounded-lg border border-white/15 px-2 py-1 hover:bg-white/[0.06]"
                        >
                          Дублировать
                        </button>
                        <button
                          onClick={() => onDelete(t.id)}
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

      {/* Pagination */}
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