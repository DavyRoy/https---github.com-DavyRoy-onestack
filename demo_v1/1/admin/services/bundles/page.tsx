// app/demo/admin/services/bundles/page.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ADMIN_BUNDLES } from "@/app/demo/(shared)/data/services";

/* ---------- утилиты ---------- */

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

function patchParams(sp: URLSearchParams, patch: Record<string, string | undefined>) {
  const next = new URLSearchParams(Array.from(sp.entries()));
  for (const [k, v] of Object.entries(patch)) {
    if (!v || v === "all") next.delete(k);
    else next.set(k, v);
  }
  return next;
}

function fmtPrice(n: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(n);
}

function StatusBadge({ v }: { v: (typeof ADMIN_BUNDLES)[number]["status"] }) {
  const cls =
    v === "active"
      ? "bg-emerald-400/15 text-emerald-300"
      : v === "draft"
      ? "bg-amber-400/15 text-amber-300"
      : "bg-white/10 text-white/70";
  return <span className={`rounded px-2 py-0.5 text-xs whitespace-nowrap ${cls}`}>{v}</span>;
}

/* ---------- страница ---------- */

export default function AdminBundlesPage() {
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);
  const sp = useSearchParams();
  const router = useRouter();

  const q = sp.get("q")?.trim() ?? "";
  const type = sp.get("type") ?? "all";
  const status = sp.get("status") ?? "all";

  const { rows, found } = useMemo(() => {
    let xs = [...ADMIN_BUNDLES];

    if (q) {
      const needle = q.toLowerCase();
      xs = xs.filter((b) => b.name.toLowerCase().includes(needle));
    }
    if (type !== "all") xs = xs.filter((b) => b.type === type);
    if (status !== "all") xs = xs.filter((b) => b.status === status);

    xs.sort((a, b) => {
      const rank = (s: string) => (s === "active" ? 0 : s === "draft" ? 1 : 2);
      return rank(a.status) - rank(b.status) || a.name.localeCompare(b.name, "ru");
    });

    return { rows: xs, found: xs.length };
  }, [q, type, status]);

  const setParams = (patch: Record<string, string | undefined>) => {
    const next = patchParams(sp, patch);
    router.push(`${base}/services/bundles?${next.toString()}`);
  };

  return (
    <div className="page-wrap grid gap-6">
      {/* локальные анти-оверфлоу стили */}
      <style jsx>{`
        .page-wrap {
          overflow-x: hidden;
          max-width: 100vw;
        }
        .section {
          max-width: 100vw;
        }
        .tableWrap {
          max-width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        /* защита от «выпирающих» ссылок/текстов */
        .truncate-line {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>

      {/* header */}
      <header className="section flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <nav className="text-xs text-white/60 truncate-line">
            <Link href={`${base}/services`} className="hover:underline">Услуги</Link>
            <span className="mx-1 opacity-50">/</span>
            <span className="text-white/80">Пакеты и абонементы</span>
          </nav>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">Пакеты и абонементы</h1>
          <p className="mt-1 text-sm text-white/70">
            Управление наборами услуг и подписками. Найдено:{" "}
            <span className="text-white/85">{found}</span>
          </p>
        </div>
        <Link
          href={`${base}/services/bundles/new`}
          className="rounded-xl bg-white px-4 py-2 text-sm text-black hover:bg-white/90 whitespace-nowrap"
        >
          Создать
        </Link>
      </header>

      {/* фильтры */}
      <section className="section rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4">
        <div className="grid gap-2 md:grid-cols-4">
          {/* поиск */}
          <label className="grid gap-1 md:col-span-2">
            <span className="text-xs opacity-70">Поиск</span>
            <input
              defaultValue={q}
              onKeyDown={(e) => {
                if (e.key === "Enter") setParams({ q: (e.currentTarget as HTMLInputElement).value });
                if (e.key === "Escape") setParams({ q: "" });
              }}
              onBlur={(e) => setParams({ q: e.currentTarget.value })}
              placeholder="Название пакета…"
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
            />
          </label>

          {/* тип */}
          <label className="grid gap-1">
            <span className="text-xs opacity-70">Тип</span>
            <select
              value={type}
              onChange={(e) => setParams({ type: e.target.value })}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
            >
              <option value="all">Все</option>
              <option value="package">Пакет</option>
              <option value="subscription">Абонемент</option>
            </select>
          </label>

          {/* статус */}
          <label className="grid gap-1">
            <span className="text-xs opacity-70">Статус</span>
            <select
              value={status}
              onChange={(e) => setParams({ status: e.target.value })}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
            >
              <option value="all">Все</option>
              <option value="active">Активен</option>
              <option value="draft">Черновик</option>
              <option value="archived">Архив</option>
            </select>
          </label>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-white/70">
            Подсказка: жмите <kbd className="rounded bg-white/10 px-1">Enter</kbd> чтобы применить поиск.
          </div>
          <button
            onClick={() => setParams({ q: "", type: "all", status: "all" })}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 whitespace-nowrap"
          >
            Сбросить
          </button>
        </div>
      </section>

      {/* список: мобильные карточки + десктоп-таблица */}
      <section className="section rounded-2xl border border-white/15 bg-white/[0.05]">
        {/* mobile cards */}
        <div className="divide-y divide-white/10 md:hidden">
          {rows.length === 0 ? (
            <div className="p-6 text-center text-white/70 text-sm">Пакетов нет.</div>
          ) : (
            rows.map((b) => (
              <div key={b.id} className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`${base}/services/bundles/${b.id}`}
                        className="truncate-line font-medium hover:underline"
                        title={b.name}
                      >
                        {b.name}
                      </Link>
                      <StatusBadge v={b.status} />
                    </div>
                    <div className="mt-0.5 text-xs text-white/60">
                      {b.type === "subscription" ? "Абонемент" : "Пакет"}
                      {b.type === "subscription" && b.periodDays ? ` • ${b.periodDays} дней` : ""}
                      {" • "}
                      {fmtPrice(b.price)}
                    </div>
                  </div>
                  <Link
                    href={`${base}/services/bundles/${b.id}`}
                    className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 shrink-0 whitespace-nowrap"
                  >
                    Открыть
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* desktop table */}
        <div className="tableWrap hidden md:block">
          <table className="min-w-full table-fixed text-sm">
            <colgroup>
              <col className="w-[44%]" />
              <col className="w-[16%]" />
              <col className="w-[14%]" />
              <col className="w-[12%]" />
              <col className="w-[14%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="p-3">Название</th>
                <th className="p-3">Тип</th>
                <th className="p-3 text-right">Цена</th>
                <th className="p-3">Период</th>
                <th className="p-3">Статус</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-white/70">
                    Пакетов нет.
                  </td>
                </tr>
              ) : (
                rows.map((b) => (
                  <tr key={b.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-3">
                      <div className="min-w-0 truncate" title={b.name}>
                        <Link href={`${base}/services/bundles/${b.id}`} className="hover:underline">
                          {b.name}
                        </Link>
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {b.type === "subscription" ? "Абонемент" : "Пакет"}
                    </td>
                    <td className="p-3 text-right tabular-nums whitespace-nowrap">
                      {fmtPrice(b.price)}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {b.type === "subscription" && b.periodDays ? `${b.periodDays} дней` : "—"}
                    </td>
                    <td className="p-3">
                      <StatusBadge v={b.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}