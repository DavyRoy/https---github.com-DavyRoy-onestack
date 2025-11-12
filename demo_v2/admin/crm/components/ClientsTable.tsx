"use client";

import * as React from "react";
import Link from "next/link";
import { ADMIN_CRM_CLIENTS, type AdminClient } from "@/app/demo/(shared)/crm/data/clients.demo";

type Props = {
  /** Текст поиска, фильтрует по имени, компании, email, телефону, городу, стране */
  filterQ?: string;
  /** Ограничить кол-во выводимых строк (для превью-виджетов) */
  limit?: number;
};

export default function ClientsTable({ filterQ = "", limit }: Props) {
  const q = (filterQ || "").trim().toLowerCase();

  // ——— форматеры (мемо) ———
  const rub = React.useMemo(
    () => new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }),
    []
  );
  const dateFmt = React.useMemo(
    () => new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }),
    []
  );

  // ——— фильтрация и ограничение ———
  const rows = React.useMemo(() => {
    const filtered = ADMIN_CRM_CLIENTS.filter((c) => {
      if (!q) return true;
      const fields = [c.name, c.company, c.email, c.phone, c.city, c.country]
        .filter(Boolean)
        .map((v) => (v as string).toLowerCase());
      return fields.some((v) => v.includes(q));
    });
    return typeof limit === "number" && limit > 0 ? filtered.slice(0, limit) : filtered;
  }, [q, limit]);

  // ——— подсветка совпадений ———
  function highlight(text: string | undefined | null): React.ReactNode {
    if (!text) return "—";
    if (!q) return text;
    const lower = text.toLowerCase();
    const idx = lower.indexOf(q);
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const hit = text.slice(idx, idx + q.length);
    const after = text.slice(idx + q.length);
    return (
      <>
        {before}
        <mark className="bg-amber-400/30 rounded px-0.5">{hit}</mark>
        {after}
      </>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-6 text-white/70 text-sm text-center">
        Клиенты не найдены{q ? <> по запросу «<span className="text-white/85">{filterQ}</span>»</> : ""}.
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.03] overflow-hidden">
      {/* Mobile cards */}
      <div className="grid gap-2 p-2 md:hidden">
        {rows.map((c) => (
          <article key={c.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/demo/admin/crm/clients/${c.id}`}
                  className="font-medium hover:underline block truncate"
                >
                  {highlight(c.name)}
                </Link>
                {c.company && (
                  <div className="text-xs text-white/60 truncate">{highlight(c.company)}</div>
                )}
                {c.tags?.length ? (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {c.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-white/10 text-[11px]">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <Link
                href={`/demo/admin/crm/clients/${c.id}`}
                className="shrink-0 rounded-lg border border-white/15 px-2 py-1 text-xs hover:bg-white/10"
              >
                Открыть
              </Link>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-0.5">
                <div className="text-white/60">Контакты</div>
                <div className="truncate">
                  {c.email ? (
                    <a href={`mailto:${c.email}`} className="hover:underline">
                      {highlight(c.email)}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
                <div className="truncate">
                  {c.phone ? (
                    <a href={`tel:${c.phone}`} className="hover:underline text-white/80">
                      {highlight(c.phone)}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-white/60">Город</div>
                <div className="truncate">{highlight(c.city || "—")}</div>
                <div className="text-white/60">Активность</div>
                <div>
                  {c.lastActivityAt ? dateFmt.format(new Date(c.lastActivityAt)) : "—"}
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-sm">
              <div className="opacity-80">Заказов: <span className="font-medium">{c.orders}</span></div>
              <div className="font-semibold text-emerald-300">{rub.format(c.ltv)}</div>
            </div>
          </article>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[760px] w-full text-sm border-separate border-spacing-0">
          <thead className="text-white/60">
            <tr className="border-b border-white/10">
              <th className="text-left p-3 font-medium">Клиент</th>
              <th className="text-left p-3 font-medium">Контакты</th>
              <th className="text-left p-3 font-medium">Метки</th>
              <th className="text-left p-3 font-medium">Город</th>
              <th className="text-left p-3 font-medium whitespace-nowrap">Активность</th>
              <th className="text-right p-3 font-medium">Заказов</th>
              <th className="text-right p-3 font-medium">LTV</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((c: AdminClient, i) => (
              <tr
                key={c.id}
                className={`border-b border-white/10 hover:bg-white/[0.04] ${i % 2 ? "bg-white/[0.01]" : ""}`}
              >
                {/* Клиент / компания */}
                <td className="p-3 align-top">
                  <Link
                    href={`/demo/admin/crm/clients/${c.id}`}
                    className="font-medium hover:underline block truncate max-w-[240px]"
                    title={c.name}
                  >
                    {highlight(c.name)}
                  </Link>
                  {c.company && (
                    <div className="text-xs text-white/60 truncate max-w-[240px]" title={c.company}>
                      {highlight(c.company)}
                    </div>
                  )}
                  {c.managerId && (
                    <div className="mt-1 text-xs text-emerald-300/70">
                      менеджер: {c.managerId.toUpperCase()}
                    </div>
                  )}
                </td>

                {/* Контакты */}
                <td className="p-3 align-top text-sm">
                  {c.email ? (
                    <a
                      href={`mailto:${c.email}`}
                      className="hover:underline block truncate max-w-[220px]"
                      title={c.email}
                    >
                      {highlight(c.email)}
                    </a>
                  ) : (
                    "—"
                  )}
                  {c.phone && (
                    <a
                      href={`tel:${c.phone}`}
                      className="block text-xs text-white/80 hover:underline truncate max-w-[220px]"
                      title={c.phone}
                    >
                      {highlight(c.phone)}
                    </a>
                  )}
                </td>

                {/* Метки */}
                <td className="p-3 align-top">
                  {c.tags?.length ? (
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {c.tags.map((t) => (
                        <span key={t} className="inline-block px-2 py-0.5 rounded bg-white/10 text-xs">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>

                {/* Город */}
                <td className="p-3 align-top text-sm opacity-90 truncate max-w-[160px]" title={c.city || "—"}>
                  {highlight(c.city || "—")}
                </td>

                {/* Последняя активность */}
                <td className="p-3 align-top text-sm opacity-80 whitespace-nowrap">
                  {c.lastActivityAt ? dateFmt.format(new Date(c.lastActivityAt)) : "—"}
                </td>

                {/* Кол-во заказов */}
                <td className="p-3 text-right align-top font-medium">{c.orders}</td>

                {/* LTV */}
                <td className="p-3 text-right align-top font-semibold text-emerald-300 whitespace-nowrap">
                  {rub.format(c.ltv)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Небольшая строка статуса снизу (только если есть лимит) */}
      {typeof limit === "number" && limit > 0 && (
        <div className="px-3 py-2 text-xs text-white/60 border-t border-white/10">
          Показано {rows.length} {rows.length === 1 ? "клиент" : rows.length < 5 ? "клиента" : "клиентов"}
          {q ? <> по запросу «<span className="text-white/80">{filterQ}</span>»</> : ""}.
        </div>
      )}
    </section>
  );
}