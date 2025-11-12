"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ADMIN_ORDERS, AdminOrder } from "@/app/demo/admin/orders/data/mockAdminOrders";
import AdminOrdersFiltersBar from "./components/AdminOrdersFiltersBar";
import AdminOrdersTable from "./components/AdminOrdersTable";
import EmptyState from "@/app/demo/(shared)/components/EmptyState";

type Sort =
  | "date_desc"
  | "date_asc"
  | "total_desc"
  | "total_asc"
  | "client_asc"
  | "client_desc";

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

export default function AdminOrdersPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  // query
  const q = sp.get("q") || "";
  const status = sp.get("status") || "all";
  const channel = sp.get("channel") || "all";
  const sort = (sp.get("sort") as Sort) || "date_desc";

  // список
  const rows: AdminOrder[] = useMemo(() => {
    let xs = [...ADMIN_ORDERS];
    if (q) {
      const qi = q.toLowerCase();
      xs = xs.filter((o) =>
        o.id.toLowerCase().includes(qi) ||
        o.client.toLowerCase().includes(qi) ||
        (o.email || "").toLowerCase().includes(qi) ||
        (o.phone || "").toLowerCase().includes(qi)
      );
    }
    if (status !== "all") xs = xs.filter((o) => o.status === status);
    if (channel !== "all") xs = xs.filter((o) => o.channel === channel);

    xs.sort((a, b) => {
      const at = a.total ?? 0;
      const bt = b.total ?? 0;
      const ad = a.createdAt || "";
      const bd = b.createdAt || "";
      switch (sort) {
        case "total_desc": return bt - at;
        case "total_asc": return at - bt;
        case "client_asc": return a.client.localeCompare(b.client, "ru");
        case "client_desc": return b.client.localeCompare(a.client, "ru");
        case "date_asc": return ad.localeCompare(bd);
        default: // date_desc
          return bd.localeCompare(ad);
      }
    });

    return xs;
  }, [q, status, channel, sort]);

  // агрегаты
  const stats = useMemo(() => {
    const totalOrders = rows.length;
    const amount = rows.reduce((s, r) => s + (r.total ?? 0), 0);
    const avg = totalOrders ? Math.round(amount / totalOrders) : 0;
    const byStatus: Record<string, number> = {};
    for (const o of rows) byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
    return { totalOrders, amount, avg, byStatus };
  }, [rows]);

  // утилита изменения сортировки
  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(Array.from(sp.entries()));
    v ? next.set(k, v) : next.delete(k);
    router.push(`${base}/orders?${next.toString()}`);
  };

  const fmtMoney = (n: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="grid gap-6">
      {/* Header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Заказы <span className="text-white/60 text-lg align-baseline">(read-only)</span>
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Агрегаты и аудит без изменения статусов
          </p>
        </div>
        <Link
          href={`${base}/shop`}
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
        >
          В магазин
        </Link>
      </header>

      {/* Короткие метрики */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
          <div className="text-xs text-white/70">Всего заказов</div>
          <div className="mt-1 text-xl font-semibold tabular-nums">{stats.totalOrders}</div>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
          <div className="text-xs text-white/70">Оборот по выборке</div>
          <div className="mt-1 text-xl font-semibold tabular-nums">{fmtMoney(stats.amount)}</div>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
          <div className="text-xs text-white/70">Средний чек</div>
          <div className="mt-1 text-xl font-semibold tabular-nums">{fmtMoney(stats.avg)}</div>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
          <div className="text-xs text-white/70">По статусам</div>
          <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
            {Object.entries(stats.byStatus).map(([s, n]) => (
              <span key={s} className="rounded-lg bg-white/10 px-2 py-0.5">
                {s}: <span className="tabular-nums">{n}</span>
              </span>
            ))}
            {Object.keys(stats.byStatus).length === 0 && <span className="text-white/60">—</span>}
          </div>
        </div>
      </section>

      {/* Фильтры */}
      <AdminOrdersFiltersBar baseHref={base} />

      {/* Сортировка (вынес отдельно, чтобы не перегружать бар) */}
      <div className="flex items-center justify-end gap-2">
        <label className="flex items-center gap-2 text-xs">
          <span className="opacity-70">Сортировка</span>
          <select
            className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs outline-none"
            value={sort}
            onChange={(e) => setParam("sort", e.target.value)}
          >
            <option value="date_desc">Дата ↓</option>
            <option value="date_asc">Дата ↑</option>
            <option value="total_desc">Сумма ↓</option>
            <option value="total_asc">Сумма ↑</option>
            <option value="client_asc">Клиент A→Я</option>
            <option value="client_desc">Клиент Я→A</option>
          </select>
        </label>
      </div>

      {/* Таблица / пустое состояние */}
      {rows.length === 0 ? (
        <EmptyState
          title="Заказы не найдены"
          hint="Измените фильтры или очистите поиск."
        />
      ) : (
        <AdminOrdersTable rows={rows} />
      )}
    </div>
  );
}