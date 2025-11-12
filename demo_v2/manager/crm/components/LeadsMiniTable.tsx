"use client";

import Link from "next/link";
import { T } from "@/app/demo/manager/_parts/tokens";
import type { Lead } from "@/app/demo/manager/crm/data/mockLeads";

/**
 * LeadsMiniTable — компактная таблица последних лидов.
 * — Пустое состояние.
 * — Sticky-заголовок (улучшает читаемость при скролле).
 * — Статусы в виде чипов с тонами.
 * — Адаптивный горизонтальный скролл, ничего не «прыгает» на 393×852.
 * — Доступность: aria-метки, scope, фокус-состояния на ссылках.
 */
export default function LeadsMiniTable({ rows }: { rows: Lead[] }) {
  const safe = Array.isArray(rows) ? rows : [];

  if (safe.length === 0) {
    return (
      <div className={T.card + " text-center py-8"}>
        <div className="text-base font-semibold">Лидов пока нет</div>
        <div className={"mt-1 text-sm " + T.dim}>
          Как только появятся новые обращения, они отобразятся здесь.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table
        className="w-full min-w-[640px] text-sm"
        aria-label="Таблица последних лидов"
      >
        <thead className="sticky top-0 z-10 bg-white/[0.04] text-xs text-white/80 backdrop-blur">
          <tr>
            <Th>Имя / Компания</Th>
            <Th>Контакт</Th>
            <Th>Источник</Th>
            <Th>Статус</Th>
            <Th>Ответственный</Th>
          </tr>
        </thead>
        <tbody>
          {safe.map((l) => (
            <tr
              key={l.id}
              className="border-t border-white/10 transition hover:bg-white/[0.05]"
            >
              {/* Имя / Компания */}
              <td className="px-3 py-2 align-top">
                <Link
                  href={`/demo/manager/crm/leads/${l.id}`}
                  prefetch={false}
                  className="block truncate font-medium text-white underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
                  aria-label={`Открыть лид «${l.name}»`}
                >
                  {l.name}
                </Link>
                {l.company && (
                  <div className={"truncate text-xs " + T.dim}>{l.company}</div>
                )}
              </td>

              {/* Контакты */}
              <td className="px-3 py-2 align-top">
                {l.email ? (
                  <div className="truncate text-xs">{l.email}</div>
                ) : (
                  <div className={"text-xs " + T.dim}>—</div>
                )}
                <div className={"truncate text-xs " + T.dim}>
                  {l.phone || "—"}
                </div>
              </td>

              {/* Источник */}
              <td className="px-3 py-2 align-top text-xs">
                <span className="inline-flex items-center rounded-lg border border-white/12 bg-white/[0.06] px-2 py-0.5">
                  {mapSource(l.source)}
                </span>
              </td>

              {/* Статус (чип) */}
              <td className="px-3 py-2 align-top text-xs">
                <span
                  className={[
                    "inline-flex items-center rounded-lg px-2 py-0.5 ring-1 ring-inset",
                    statusTone(l.status),
                  ].join(" ")}
                >
                  {mapStatus(l.status)}
                </span>
              </td>

              {/* Ответственный */}
              <td className="px-3 py-2 align-top text-xs">{l.owner || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ===== Вспомогательные элементы ===== */

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th scope="col" className="px-3 py-2 text-left font-medium">
      {children}
    </th>
  );
}

function mapStatus(s: Lead["status"]) {
  switch (s) {
    case "new":
      return "Новый";
    case "in_progress":
      return "В работе";
    case "closed":
      return "Закрыт";
    default:
      return "—";
  }
}

function mapSource(src?: Lead["source"]) {
  switch (src) {
    case "site":
      return "Сайт";
    case "call":
      return "Звонок";
    case "messenger":
      return "Мессенджер";
    case "ref":
      return "Реферал";
    default:
      return "—";
  }
}

function statusTone(s?: Lead["status"]) {
  switch (s) {
    case "new":
      return "bg-sky-400/10 text-sky-100 ring-sky-400/25";
    case "in_progress":
      return "bg-amber-400/10 text-amber-100 ring-amber-400/25";
    case "closed":
      return "bg-emerald-400/10 text-emerald-100 ring-emerald-400/25";
    default:
      return "bg-white/[0.06] text-white/80 ring-white/15";
  }
}