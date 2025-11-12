"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download, Home, Plus, X } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";
import { mockClients, type Client } from "@/app/demo/manager/crm/data/mockClients";
import FiltersBar from "@/app/demo/manager/crm/components/FiltersBar";
import ClientsTable from "@/app/demo/manager/crm/components/ClientsTable";
import ExportMenu from "@/app/demo/manager/crm/components/ExportMenu";
import EmptyState from "@/app/demo/manager/crm/components/EmptyState";

export default function ClientsListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  /* ---- URL-параметры с безопасными дефолтами ---- */
  const q = (sp.get("q") ?? "").trim();
  const seg = sp.get("segment") ?? "all";

  const rawPage = Number(sp.get("page") ?? "1");
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;

  const rawPageSize = Number(sp.get("pageSize") ?? "25");
  const pageSize = Number.isFinite(rawPageSize)
    ? Math.max(5, Math.min(50, Math.floor(rawPageSize)))
    : 25;

  /* ---- Фильтрация (безопасно для отсутствующих email/phone) ---- */
  const filtered = useMemo(() => {
    let rows: Client[] = Array.isArray(mockClients) ? mockClients : [];
    const needle = q.toLowerCase();

    if (needle) {
      rows = rows.filter((c) => {
        const name = (c.name || "").toLowerCase();
        const email = (c.email || "").toLowerCase();
        const phone = (c.phone || "").toLowerCase();
        return (
          name.includes(needle) ||
          email.includes(needle) ||
          phone.includes(needle)
        );
      });
    }
    if (seg !== "all") {
      rows = rows.filter((c) => (c.tags || []).includes(seg));
    }
    return rows;
  }, [q, seg]);

  /* ---- Пагинация (с авто-правкой номера страницы) ---- */
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const pageRows = filtered.slice(start, end);

  // Если текущая страница выпала за пределы (после смены фильтров) — тихо чиним URL
  useEffect(() => {
    if (safePage !== page) {
      const next = new URLSearchParams(sp.toString());
      next.set("page", String(safePage));
      router.replace(`${pathname}?${next.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safePage]);

  /* ---- Утилита смены параметров ---- */
  const setParam = (key: string, val?: string, opts?: { push?: boolean }) => {
    const next = new URLSearchParams(sp.toString());
    if (val == null || val === "") next.delete(key);
    else next.set(key, val);

    // Сброс страницы при изменении «тяжёлых» фильтров
    if (key === "q" || key === "segment" || key === "pageSize") next.set("page", "1");

    const url = `${pathname}?${next.toString()}`;
    // Фильтры — через replace (не засоряем историю), а листание — через push
    const usePush = opts?.push ?? (key === "page" ? true : false);
    usePush ? router.push(url) : router.replace(url);
  };

  const clearFilters = () => {
    // Полный сброс — возвращаемся к чистому пути без query
    router.replace(pathname);
  };

  return (
    <div className="grid gap-5 md:gap-6">
      {/* Хедер */}
      <header className={T.hero} role="region" aria-label="Список клиентов: заголовок и фильтры">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <nav className="flex items-center gap-1 text-xs text-white/70" aria-label="Хлебные крошки">
              <Link href="/demo/manager/dashboard" prefetch={false} className="inline-flex items-center gap-1 hover:underline">
                <Home width={14} height={14} /> Дашборд
              </Link>
              <span className="opacity-40">/</span>
              <Link href="/demo/manager/crm" prefetch={false} className="hover:underline">CRM</Link>
              <span className="opacity-40">/</span>
              <span className="text-white/80" aria-current="page">Клиенты</span>
            </nav>

            <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">Клиенты</h1>
            <p className={"mt-1 text-sm " + T.dim}>Список клиентов, поиск и быстрые действия</p>
          </div>

          {/* Десктопные действия */}
          <div className="hidden md:flex items-center gap-2">
            <ExportMenu fileName="clients-demo.csv">
              <button className="btn" aria-label="Экспортировать клиентов в CSV">
                <Download width={16} height={16} /> Экспорт CSV
              </button>
            </ExportMenu>
            <Link href="/demo/manager/crm/clients/new" prefetch={false} className="btn btn-primary">
              <Plus width={16} height={16} /> Создать клиента
            </Link>
          </div>
        </div>

        {/* Фильтры */}
        <div className="mt-3">
          <FiltersBar
            query={q}
            onQuery={(v) => setParam("q", v || undefined)}
            segment={seg}
            onSegment={(v) => setParam("segment", v === "all" ? undefined : v)}
            pageSize={pageSize}
            onPageSize={(n) => setParam("pageSize", String(n))}
          />

          {(q || seg !== "all" || pageSize !== 25) && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className={T.dim}>Активные фильтры:</span>

              {q && (
                <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5">
                  Поиск: «{q}»
                </span>
              )}

              {seg !== "all" && (
                <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5">
                  Сегмент: {seg}
                </span>
              )}

              {pageSize !== 25 && (
                <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5">
                  На странице: {pageSize}
                </span>
              )}

              <button
                className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 hover:bg-white/15"
                onClick={clearFilters}
                aria-label="Сбросить фильтры"
                type="button"
              >
                <X width={12} height={12} /> Сбросить
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Список / пустое состояние */}
      {pageRows.length === 0 ? (
        <EmptyState
          title="Клиенты не найдены"
          hint="Измените фильтры или создайте клиента"
          cta={{ href: "/demo/manager/crm/clients/new", label: "Создать клиента" }}
        />
      ) : (
        <section className={T.card} aria-labelledby="clients-table-title">
          <h2 id="clients-table-title" className="sr-only">Таблица клиентов</h2>

          <ClientsTable rows={pageRows} />

          {/* Пагинация */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className={T.dim} aria-live="polite">
              {start + 1}–{end} из {total}
            </div>

            <div className="inline-flex items-center gap-2">
              <button
                className="btn min-h-[38px] px-3"
                disabled={safePage <= 1}
                onClick={() => setParam("page", String(safePage - 1), { push: true })}
                aria-label="Предыдущая страница"
                type="button"
              >
                Назад
              </button>

              <span className="tabular-nums" aria-live="polite">
                {safePage} / {totalPages}
              </span>

              <button
                className="btn min-h-[38px] px-3"
                disabled={safePage >= totalPages}
                onClick={() => setParam("page", String(safePage + 1), { push: true })}
                aria-label="Следующая страница"
                type="button"
              >
                Вперёд
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CTA для мобилы */}
      <div className="md:hidden flex gap-2">
        <ExportMenu fileName="clients-demo.csv">
          <button className="btn min-h-[40px]">
            <Download width={16} height={16} /> Экспорт CSV
          </button>
        </ExportMenu>

        <Link
          href="/demo/manager/crm/clients/new"
          prefetch={false}
          className="btn btn-primary flex-1 min-h-[40px] whitespace-nowrap"
        >
          <Plus width={16} height={16} /> Новый клиент
        </Link>
      </div>
    </div>
  );
}