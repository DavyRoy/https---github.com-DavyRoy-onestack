"use client";

import Link from "next/link";
import { ADMIN_PROVIDERS } from "@/app/demo/(shared)/payments/data/mockAdminPaymentsMetrics";

export default function ProvidersPage() {
  return (
    <div className="grid gap-6 overflow-x-hidden">
      {/* Заголовок */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Провайдеры / интеграции</h1>
          <p className="text-white/60 text-sm">
            Статусы, валюты и методы оплаты
          </p>
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

      {/* Таблица провайдеров */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 overflow-x-auto">
        <div className="min-w-full w-full">
          <table className="min-w-[720px] w-full text-sm border-collapse">
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
              {ADMIN_PROVIDERS.map((p) => (
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
                  <td className="py-2 pr-3 whitespace-nowrap">
                    {p.methods.join(", ")}
                  </td>
                  <td className="py-2 pr-3 whitespace-nowrap">
                    {p.currencies.join(", ")}
                  </td>
                  <td
                    className={`py-2 pr-3 whitespace-nowrap ${
                      p.status === "ok"
                        ? "text-emerald-400"
                        : p.status === "degraded"
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
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
      </section>

      {/* Для маленьких экранов — краткий список */}
      <section className="md:hidden grid gap-3">
        {ADMIN_PROVIDERS.map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-white/15 bg-white/[0.04] p-3 flex flex-col gap-1"
          >
            <div className="flex justify-between items-center">
              <Link
                href={`/demo/admin/payments/providers/${p.id}`}
                className="font-medium hover:underline truncate"
              >
                {p.name}
              </Link>
              <span
                className={`text-xs px-2 py-0.5 rounded-md ${
                  p.status === "ok"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : p.status === "degraded"
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-rose-500/20 text-rose-300"
                }`}
              >
                {p.status}
              </span>
            </div>

            <div className="text-xs text-white/70">
              Методы: {p.methods.join(", ")}
            </div>
            <div className="text-xs text-white/70">
              Валюты: {p.currencies.join(", ")}
            </div>
            <div className="text-xs text-white/50">
              P95: {p.latencyP95}ms • Fail: {p.failRate}% •{" "}
              {new Date(p.lastCheckISO).toLocaleDateString("ru-RU")}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}