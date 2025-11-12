"use client";

import * as React from "react";
import Link from "next/link";
import { ADMIN_CRM_CLIENTS, type AdminClient } from "@/app/demo/(shared)/crm/data/clients.demo";

export default function ClientsTable({ filterQ = "" }: { filterQ?: string }) {
  // фильтрация с учётом регистра и частичных совпадений
  const q = filterQ.trim().toLowerCase();
  const rows = React.useMemo(() => {
    return ADMIN_CRM_CLIENTS.filter((c) => {
      if (!q) return true;
      const fields = [c.name, c.company, c.email, c.phone, c.city, c.country]
        .filter(Boolean)
        .map((v) => v!.toLowerCase());
      return fields.some((v) => v.includes(q));
    });
  }, [q]);

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-6 text-white/70 text-sm text-center">
        Клиенты не найдены.
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.03] overflow-x-auto">
      <table className="min-w-[760px] w-full text-sm border-separate border-spacing-0">
        <thead className="text-white/60">
          <tr className="border-b border-white/10">
            <th className="text-left p-3 font-medium">Клиент</th>
            <th className="text-left p-3 font-medium">Контакты</th>
            <th className="text-left p-3 font-medium">Метки</th>
            <th className="text-left p-3 font-medium">Город</th>
            <th className="text-left p-3 font-medium">Активность</th>
            <th className="text-right p-3 font-medium">Заказов</th>
            <th className="text-right p-3 font-medium">LTV</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((c: AdminClient, i) => (
            <tr
              key={c.id}
              className={`border-b border-white/10 hover:bg-white/[0.04] ${
                i % 2 ? "bg-white/[0.01]" : ""
              }`}
            >
              {/* Клиент / компания */}
              <td className="p-3 align-top">
                <Link
                  href={`/demo/admin/crm/clients/${c.id}`}
                  className="font-medium hover:underline block truncate max-w-[220px]"
                >
                  {c.name}
                </Link>
                {c.company && (
                  <div className="text-xs text-white/60 truncate max-w-[220px]">{c.company}</div>
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
                    className="hover:underline block truncate max-w-[180px]"
                  >
                    {c.email}
                  </a>
                ) : (
                  "-"
                )}
                {c.phone && (
                  <a
                    href={`tel:${c.phone}`}
                    className="block text-xs text-white/70 hover:underline"
                  >
                    {c.phone}
                  </a>
                )}
              </td>

              {/* Метки */}
              <td className="p-3 align-top">
                {c.tags.length ? (
                  <div className="flex flex-wrap gap-1 max-w-[160px]">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-block px-2 py-0.5 rounded bg-white/10 text-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  "—"
                )}
              </td>

              {/* Город */}
              <td className="p-3 align-top text-sm opacity-90">{c.city || "—"}</td>

              {/* Последняя активность */}
              <td className="p-3 align-top text-sm opacity-80 whitespace-nowrap">
                {c.lastActivityAt
                  ? new Date(c.lastActivityAt).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "—"}
              </td>

              {/* Кол-во заказов */}
              <td className="p-3 text-right align-top font-medium">{c.orders}</td>

              {/* LTV */}
              <td className="p-3 text-right align-top font-semibold text-emerald-300 whitespace-nowrap">
                ₽ {c.ltv.toLocaleString("ru-RU")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}