"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Home, Plus, ChevronRight } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";
import {
  mockDeals as base,
  STAGES,
  type Deal,
  type DealStage,
} from "@/app/demo/manager/crm/data/mockDeals";
import DealsKanban from "@/app/demo/manager/crm/components/DealsKanban";

const LS_DEALS_FILTERS = "LS_DEALS_FILTERS_V1";

const fmt = (n: number) => n.toLocaleString("ru-RU");

export default function DealsKanbanPage() {
  const [data, setData] = useState<Deal[]>(base);
  const [owner, setOwner] = useState<string>("all"); // демо
  const [q, setQ] = useState("");        // эффективный запрос (после дебаунса)
  const [qInput, setQInput] = useState(""); // ввод в поле

  // ---- Restore filters once
  const restored = useRef(false);
  useEffect(() => {
    if (restored.current || typeof window === "undefined") return;
    restored.current = true;
    try {
      const raw = localStorage.getItem(LS_DEALS_FILTERS);
      if (!raw) return;
      const saved = JSON.parse(raw) as { q?: string; owner?: string };
      if (saved.q) {
        setQInput(saved.q);
        setQ(saved.q);
      }
      if (saved.owner) setOwner(saved.owner);
    } catch {}
  }, []);

  // ---- Persist filters
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LS_DEALS_FILTERS, JSON.stringify({ q, owner }));
    } catch {}
  }, [q, owner]);

  // ---- Дебаунс поиска (мягче на мобиле)
  useEffect(() => {
    const t = setTimeout(() => setQ(qInput.trim()), 250);
    return () => clearTimeout(t);
  }, [qInput]);

  // ---- Фильтрация (безопасно — owner может отсутствовать в моках)
  const filtered = useMemo(() => {
    let rows = data;
    if (q) {
      const needle = q.toLowerCase();
      rows = rows.filter(
        (d) =>
          d.title.toLowerCase().includes(needle) ||
          d.client.toLowerCase().includes(needle)
      );
    }
    if (owner !== "all") {
      rows = rows.filter((d: any) => d?.owner === owner);
    }
    return rows;
  }, [data, q, owner]);

  // ---- Сводка по воронке (кол-во и сумма по этапам)
  const funnelSummary = useMemo(() => {
    const counts: Record<DealStage, number> = {
      new: 0,
      in_progress: 0,
      proposal: 0,
      won: 0,
      lost: 0,
    };
    const sums: Record<DealStage, number> = {
      new: 0,
      in_progress: 0,
      proposal: 0,
      won: 0,
      lost: 0,
    };
    for (const d of filtered) {
      counts[d.stage] = (counts[d.stage] ?? 0) + 1;
      sums[d.stage] = (sums[d.stage] ?? 0) + (d.amount || 0);
    }
    const totalSum = filtered.reduce((n, d) => n + (d.amount || 0), 0);
    return { counts, sums, totalSum, total: filtered.length };
  }, [filtered]);

  // ---- Демо-перенос карточки между этапами
  const move = (id: string, to: DealStage) => {
    setData((rows) => rows.map((d) => (d.id === id ? { ...d, stage: to } : d)));
  };

  return (
    <div className="grid gap-6">
      {/* Хедер */}
      <header className={T.hero}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <nav
              className="flex items-center gap-1 text-xs text-white/70"
              aria-label="Хлебные крошки"
            >
              <Link
                href="/demo/manager/dashboard"
                prefetch={false}
                className="inline-flex items-center gap-1 hover:underline"
              >
                <Home width={14} height={14} /> Дашборд
              </Link>
              <ChevronRight width={14} height={14} className="opacity-40" />
              <Link href="/demo/manager/crm" prefetch={false} className="hover:underline">
                CRM
              </Link>
              <ChevronRight width={14} height={14} className="opacity-40" />
              <span className="text-white/80" aria-current="page">
                Сделки
              </span>
            </nav>

            <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
              Воронка сделок
            </h1>
            <p className={"mt-1 text-sm " + T.dim}>
              Перемещайте сделки по этапам (демо-кнопки). Поиск и фильтр по ответственному — моментально.
            </p>
          </div>

          <Link
            href="/demo/manager/crm/deals/new"
            prefetch={false}
            className="btn btn-primary min-h-[40px]"
          >
            <Plus width={16} height={16} /> Новая сделка
          </Link>
        </div>

        {/* Фильтры: компактны на мобиле, без overflow */}
        <div className="mt-3 grid gap-2 md:grid-cols-[1fr_auto]">
          <label className="relative">
            <span className="sr-only">Поиск по названию сделки или клиенту</span>
            <input
              className={T.input + " w-full"}
              placeholder="Поиск по названию сделки / клиенту…"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              inputMode="search"
              aria-label="Поиск по сделкам"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-white/70">Ответственный</span>
            <select
              className={T.input}
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              aria-label="Фильтр по ответственному"
            >
              <option value="all">Любой</option>
              <option value="Мария">Мария</option>
              <option value="Иван">Иван</option>
              <option value="Ольга">Ольга</option>
            </select>
          </label>
        </div>

        {/* Сводка по воронке (для быстрого понимания) */}
        <div
          className="mt-3 grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]"
          role="list"
          aria-label="Сводка по воронке"
        >
          {STAGES.map((s) => (
            <div
              key={s.id}
              role="listitem"
              className="rounded-xl border border-white/12 bg-white/[0.06] p-2"
            >
              <div className="flex items-baseline justify-between">
                <div className="text-xs text-white/70 truncate">{s.title}</div>
                <div className="text-[11px] text-white/60 tabular-nums">
                  {funnelSummary.counts[s.id] ?? 0}
                </div>
              </div>
              <div className="mt-1 text-sm font-semibold tabular-nums">
                {fmt(funnelSummary.sums[s.id] ?? 0)} ₽
              </div>
            </div>
          ))}
          <div className="rounded-xl border border-white/12 bg-white/[0.06] p-2">
            <div className="flex items-baseline justify-between">
              <div className="text-xs text-white/70">Всего</div>
              <div className="text-[11px] text-white/60 tabular-nums">
                {funnelSummary.total}
              </div>
            </div>
            <div className="mt-1 text-sm font-semibold tabular-nums">
              {fmt(funnelSummary.totalSum)} ₽
            </div>
          </div>
        </div>
      </header>

      {/* Канбан */}
      <section aria-labelledby="deals-kanban-title" className="grid gap-3">
        <h2 id="deals-kanban-title" className="sr-only">
          Канбан-доска сделок
        </h2>
        <DealsKanban data={filtered} stages={STAGES} onMove={move} />
      </section>
    </div>
  );
}