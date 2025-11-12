"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Home, Plus, X, Search } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";
import { mockLeads, type Lead } from "@/app/demo/manager/crm/data/mockLeads";
import LeadsTable from "@/app/demo/manager/crm/components/LeadsTable";
import EmptyState from "@/app/demo/manager/crm/components/EmptyState";

const LS_LEADS_FILTERS = "LS_LEADS_FILTERS_V1";

export default function LeadsListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // ---- URL-параметры (с защитой от мусора)
  const qUrl = (sp.get("q") ?? "").trim();
  const status = sp.get("status") ?? "all";
  const source = sp.get("source") ?? "all";
  const owner = sp.get("owner") ?? "all";

  const pageUrl = Number(sp.get("page") ?? "1");
  const page = Number.isFinite(pageUrl) && pageUrl > 0 ? Math.floor(pageUrl) : 1;

  const pageSizeUrl = Number(sp.get("pageSize") ?? "25");
  const pageSize = Number.isFinite(pageSizeUrl)
    ? Math.max(5, Math.min(50, Math.floor(pageSizeUrl)))
    : 25;

  // ---- Локальный ввод для поиска + дебаунс
  const [qInput, setQInput] = useState(qUrl);
  useEffect(() => setQInput(qUrl), [qUrl]);
  useEffect(() => {
    const t = setTimeout(() => setParam("q", qInput || undefined), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qInput]);

  // ---- Единожды восстановить фильтры из localStorage (если URL пуст)
  const restoredOnce = useRef(false);
  useEffect(() => {
    if (restoredOnce.current) return;
    restoredOnce.current = true;
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(LS_LEADS_FILTERS);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as Record<string, string>;
      const next = new URLSearchParams(sp.toString());
      let changed = false;
      (["q", "status", "source", "owner", "pageSize"] as const).forEach((k) => {
        if (saved[k] && !sp.get(k)) {
          next.set(k, saved[k]);
          changed = true;
        }
      });
      if (changed) router.replace(`${pathname}?${next.toString()}`);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Сохраняем текущее в localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const toSave = { q: qUrl, status, source, owner, pageSize: String(pageSize) };
    try {
      localStorage.setItem(LS_LEADS_FILTERS, JSON.stringify(toSave));
    } catch {}
  }, [qUrl, status, source, owner, pageSize]);

  // ---- Фильтрация
  const filtered = useMemo(() => {
    let rows: Lead[] = mockLeads;
    const q = qUrl.toLowerCase();
    if (q) rows = rows.filter((l) => (l.name + " " + l.contact).toLowerCase().includes(q));
    if (status !== "all") rows = rows.filter((l) => l.status === status);
    if (source !== "all") rows = rows.filter((l) => l.source === source);
    if (owner !== "all") rows = rows.filter((l) => l.owner === owner);
    return rows;
  }, [qUrl, status, source, owner]);

  // ---- Пагинация с авторемапом
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const pageRows = filtered.slice(start, end);

  useEffect(() => {
    if (safePage !== page) {
      setParam("page", String(safePage), { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safePage]);

  // ---- Помощники URL
  function setParam(key: string, val?: string, opts?: { replace?: boolean }) {
    const next = new URLSearchParams(sp.toString());
    if (val == null || val === "") next.delete(key);
    else next.set(key, val);

    if (["q", "status", "source", "owner", "pageSize"].includes(key)) next.set("page", "1");

    const url = `${pathname}?${next.toString()}`;
    opts?.replace ? router.replace(url) : router.push(url);
  }

  const anyFilter =
    (qUrl && qUrl.length > 0) ||
    status !== "all" ||
    source !== "all" ||
    owner !== "all" ||
    pageSize !== 25;

  const resetFilters = () => {
    const next = new URLSearchParams();
    router.replace(`${pathname}?${next.toString()}`);
  };

  // ---- Экспорт (CSV) — текущая выборка (все строки)
  const onExport = () => {
    const head = ["id", "name", "contact", "source", "status", "budget", "owner", "createdAt"];
    const rows = filtered.map((l) => [
      l.id,
      l.name,
      l.contact,
      l.source,
      l.status,
      String(l.budget ?? ""),
      l.owner ?? "",
      l.createdAt ?? "",
    ]);
    const csv = [head, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads-demo.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6">
      {/* Хедер */}
      <header className={T.hero}>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <nav className="flex items-center gap-1 text-xs text-white/70" aria-label="Хлебные крошки">
              <Link href="/demo/manager/dashboard" prefetch={false} className="inline-flex items-center gap-1 hover:underline">
                <Home width={14} height={14} /> Дашборд
              </Link>
              <span className="opacity-40">/</span>
              <Link href="/demo/manager/crm" prefetch={false} className="hover:underline">
                CRM
              </Link>
              <span className="opacity-40">/</span>
              <span className="text-white/80" aria-current="page">Лиды</span>
            </nav>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">Лиды</h1>
            <p className={"mt-1 text-sm " + T.dim}>Список лидов/заявок, фильтры и быстрые действия</p>
          </div>

          <div className="hidden md:flex gap-2">
            <button className="btn min-h-[38px]" onClick={onExport}>
              <Download width={16} height={16} /> Экспорт
            </button>
            <Link href="/demo/manager/crm/leads/new" prefetch={false} className="btn btn-primary min-h-[38px]">
              <Plus width={16} height={16} /> Новый лид
            </Link>
          </div>
        </div>

        {/* Фильтры */}
        <div className="mt-3 grid gap-2">
          {/* Поиск с кнопкой очистки */}
          <label className="relative">
            <span className="sr-only">Поиск</span>
            <Search width={16} height={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
            <input
              className={T.input + " pl-9 pr-8"}
              placeholder="Поиск по имени / контакту…"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              aria-label="Поиск по лидам"
              inputMode="search"
            />
            {qInput ? (
              <button
                type="button"
                onClick={() => setQInput("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                aria-label="Очистить поиск"
              >
                <X width={14} height={14} />
              </button>
            ) : null}
          </label>

          {/* Селекты: auto-fit на мобиле, ровные на десктопе */}
          <div
            className="
              grid gap-2
              [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]
              sm:[grid-template-columns:repeat(2,minmax(0,1fr))]
              lg:[grid-template-columns:repeat(5,minmax(0,1fr))]
            "
          >
            <Select
              label="Статус"
              value={status}
              onChange={(v) => setParam("status", v === "all" ? undefined : v)}
              options={[
                { id: "all", label: "Все" },
                { id: "new", label: "Новый" },
                { id: "in_progress", label: "В работе" },
                { id: "closed", label: "Закрыт" },
              ]}
            />
            <Select
              label="Источник"
              value={source}
              onChange={(v) => setParam("source", v === "all" ? undefined : v)}
              options={[
                { id: "all", label: "Все" },
                { id: "site", label: "Сайт" },
                { id: "call", label: "Звонок" },
                { id: "messenger", label: "Мессенджер" },
                { id: "ref", label: "Реферал" },
              ]}
            />
            <Select
              label="Ответственный"
              value={owner}
              onChange={(v) => setParam("owner", v === "all" ? undefined : v)}
              options={[
                { id: "all", label: "Все" },
                { id: "Мария", label: "Мария" },
                { id: "Иван", label: "Иван" },
                { id: "Ольга", label: "Ольга" },
              ]}
            />
            <Select
              label="На странице"
              value={String(pageSize)}
              onChange={(v) => setParam("pageSize", v)}
              options={[
                { id: "10", label: "10" },
                { id: "25", label: "25" },
                { id: "50", label: "50" },
              ]}
            />

            <label className="grid gap-1">
              <span className="text-xs text-white/70">Действие</span>
              <button
                type="button"
                className="btn min-h-[40px] justify-center"
                onClick={resetFilters}
                disabled={!anyFilter}
                aria-disabled={!anyFilter}
                title="Сбросить фильтры"
              >
                <X width={14} height={14} /> Сбросить
              </button>
            </label>
          </div>

          {/* Чипы активных фильтров */}
          {(anyFilter) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={T.dim}>Активные фильтры:</span>
              {qUrl && (
                <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5">
                  Поиск: «{qUrl}»
                </span>
              )}
              {status !== "all" && (
                <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5">
                  Статус: {mapStatus(status)}
                </span>
              )}
              {source !== "all" && (
                <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5">
                  Источник: {mapSource(source)}
                </span>
              )}
              {owner !== "all" && (
                <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5">
                  Ответственный: {owner}
                </span>
              )}
              {pageSize !== 25 && (
                <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5">
                  На странице: {pageSize}
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Таблица / пустое состояние */}
      {pageRows.length === 0 ? (
        <EmptyState
          title="Лиды не найдены"
          hint="Попробуйте изменить фильтры или создайте первый лид"
          cta={{ href: "/demo/manager/crm/leads/new", label: "Создать лид" }}
        />
      ) : (
        <section className={T.card} aria-labelledby="leads-table-title">
          <h2 id="leads-table-title" className="sr-only">Таблица лидов</h2>
          <LeadsTable rows={pageRows} />
          {/* Пагинация */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className={T.dim} aria-live="polite">
              {total === 0 ? "0" : `${start + 1}–${end}`} из {total}
            </div>
            <div className="inline-flex items-center gap-2">
              <button
                className="btn min-h-[40px]"
                disabled={safePage <= 1}
                onClick={() => setParam("page", String(safePage - 1))}
              >
                Назад
              </button>
              <span className="tabular-nums" aria-live="polite">
                {safePage} / {totalPages}
              </span>
              <button
                className="btn min-h-[40px]"
                disabled={safePage >= totalPages}
                onClick={() => setParam("page", String(safePage + 1))}
              >
                Вперёд
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CTA для мобилы */}
      <div className="md:hidden flex gap-2">
        <button className="btn min-h-[40px]" onClick={onExport}>
          <Download width={16} height={16} /> Экспорт
        </button>
        <Link href="/demo/manager/crm/leads/new" prefetch={false} className="btn btn-primary flex-1 min-h-[40px]">
          <Plus width={16} height={16} /> Новый лид
        </Link>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs text-white/70">{label}</span>
      <select
        className={T.input + " h-10"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function mapStatus(s: string) {
  switch (s) {
    case "new":
      return "Новый";
    case "in_progress":
      return "В работе";
    case "closed":
      return "Закрыт";
    default:
      return "Все";
  }
}
function mapSource(s: string) {
  switch (s) {
    case "site":
      return "Сайт";
    case "call":
      return "Звонок";
    case "messenger":
      return "Мессенджер";
    case "ref":
      return "Реферал";
    default:
      return "Все";
  }
}