// app/demo/admin/payments/providers/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ADMIN_PROVIDERS } from "@/app/demo/(shared)/payments/data/mockAdminPaymentsMetrics";

type Status = "all" | "ok" | "degraded" | "down";

export default function ProvidersPage() {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<Status>("all");
  const [method, setMethod] = React.useState<string>("all");

  const methodOptions = React.useMemo(() => {
    const set = new Set<string>();
    ADMIN_PROVIDERS.forEach((p) => p.methods.forEach((m) => set.add(m)));
    return ["all", ...Array.from(set)];
  }, []);

  const rows = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ADMIN_PROVIDERS.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (method !== "all" && !p.methods.includes(method)) return false;
      if (!needle) return true;
      const hay = [
        p.name,
        p.status,
        p.methods.join(", "),
        p.currencies.join(", "),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [q, status, method]);

  const statusCls = (s: string) =>
    s === "ok"
      ? "text-emerald-400"
      : s === "degraded"
      ? "text-amber-400"
      : "text-rose-400";

  return (
    <div className="grid gap-6 overflow-x-hidden">
      {/* Заголовок */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold">Провайдеры / интеграции</h1>
          <p className="text-white/60 text-sm">Статусы, валюты и методы оплаты</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => alert("Экспорт (демо)")}
            className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10 transition"
          >
            Экспорт
          </button>
        </div>
      </header>

      {/* Фильтры */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4">
        <div className="grid gap-2 md:grid-cols-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск: имя / метод / валюта…"
            className="rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
            aria-label="Поиск провайдеров"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
            aria-label="Фильтр по статусу"
          >
            <option value="all">Все статусы</option>
            <option value="ok">ok</option>
            <option value="degraded">degraded</option>
            <option value="down">down</option>
          </select>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
            aria-label="Фильтр по методу оплаты"
          >
            {methodOptions.map((m) => (
              <option key={m} value={m}>
                {m === "all" ? "Все методы" : m}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setQ("");
              setStatus("all");
              setMethod("all");
            }}
            className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10 transition"
          >
            Сбросить
          </button>
        </div>
      </section>

      {/* Таблица провайдеров */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 overflow-x-auto">
        {rows.length === 0 ? (
          <div className="text-sm text-white/60 p-4">Провайдеры не найдены.</div>
        ) : (
          <div className="min-w-full w-full">
            <table className="min-w-[820px] w-full text-sm border-collapse">
              <thead className="text-white/60">
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 pr-3 whitespace-nowrap">Название</th>
                  <th className="text-left py-2 pr-3 whitespace-nowrap">Методы</th>
                  <th className="text-left py-2 pr-3 whitespace-nowrap">Валюты</th>
                  <th className="text-left py-2 pr-3 whitespace-nowrap">Статус</th>
                  <th className="text-left py-2 pr-3 whitespace-nowrap">Latency P95</th>
                  <th className="text-left py-2 pr-3 whitespace-nowrap">Fail rate</th>
                  <th className="text-left py-2 pr-3 whitespace-nowrap">Проверка</th>
                  <th className="text-right py-2 pl-3 whitespace-nowrap">Действия</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-white/5 hover:bg-white/[0.03] transition"
                  >
                    <td className="py-2 pr-3 font-medium whitespace-nowrap">
                      <Link
                        href={`/demo/admin/payments/providers/${p.id}`}
                        className="hover:underline"
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="py-2 pr-3">
                      <div className="truncate max-w-[280px]">{p.methods.join(", ")}</div>
                    </td>
                    <td className="py-2 pr-3">
                      <div className="truncate max-w-[220px]">{p.currencies.join(", ")}</div>
                    </td>
                    <td className={`py-2 pr-3 whitespace-nowrap ${statusCls(p.status)}`}>
                      {p.status}
                    </td>
                    <td className="py-2 pr-3 whitespace-nowrap">{p.latencyP95} ms</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{p.failRate}%</td>
                    <td className="py-2 pr-3 whitespace-nowrap">
                      {new Date(p.lastCheckISO).toLocaleString("ru-RU")}
                    </td>
                    <td className="py-2 pl-3 text-right whitespace-nowrap">
                      <div className="inline-flex flex-wrap gap-2 justify-end">
                        <button
                          onClick={() => alert("Проверка соединения (демо)")}
                          className="rounded-md border border-white/20 px-2 py-1 text-xs hover:bg-white/10 transition"
                        >
                          Проверить
                        </button>
                        <button
                          onClick={() => alert("Отключить / Включить (демо)")}
                          className="rounded-md border border-white/20 px-2 py-1 text-xs hover:bg-white/10 transition"
                        >
                          Переключить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Для маленьких экранов — краткий список */}
      <section className="md:hidden grid gap-3">
        {rows.map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-white/15 bg-white/[0.04] p-3 flex flex-col gap-1"
          >
            <div className="flex justify-between items-center gap-2">
              <Link
                href={`/demo/admin/payments/providers/${p.id}`}
                className="font-medium hover:underline truncate"
              >
                {p.name}
              </Link>
              <span
                className={`text-xs px-2 py-0.5 rounded-md ${p.status === "ok"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : p.status === "degraded"
                  ? "bg-amber-500/20 text-amber-300"
                  : "bg-rose-500/20 text-rose-300"
                }`}
              >
                {p.status}
              </span>
            </div>
            <div className="text-xs text-white/70 truncate">Методы: {p.methods.join(", ")}</div>
            <div className="text-xs text-white/70 truncate">Валюты: {p.currencies.join(", ")}</div>
            <div className="text-xs text-white/50">
              P95: {p.latencyP95}ms • Fail: {p.failRate}% •{" "}
              {new Date(p.lastCheckISO).toLocaleDateString("ru-RU")}
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="rounded-xl border border-white/15 bg-white/[0.04] p-4 text-center text-white/60">
            Провайдеры не найдены.
          </div>
        )}
      </section>
    </div>
  );
}