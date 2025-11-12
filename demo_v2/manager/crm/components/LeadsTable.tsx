"use client";

import Link from "next/link";
import { toast } from "sonner";
import { NotebookPen, MessageCircle, Mail, Phone } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";
import type { Lead } from "@/app/demo/manager/crm/data/mockLeads";

/**
 * LeadsTable — полная таблица лидов.
 * — Sticky-заголовок, предсказуемые ширины, табличные цифры.
 * — Адаптив под 393×852: горизонтальный скролл, min-width таблицы.
 * — Чипы-статусы с мягкими тонами, понятные действия.
 * — Доступность: scope/aria/focus-visible, безопасные ссылки (prefetch=false).
 */
export default function LeadsTable({ rows }: { rows: Lead[] }) {
  const safe = Array.isArray(rows) ? rows : [];
  const onMsg = (l: Lead) => toast.success(`Сообщение отправлено клиенту: ${l.name}`);

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
    <div className="grid gap-2">
      {/* Мобильные карточки */}
      <div className="grid gap-2 md:hidden">
        {safe.map((l) => (
          <article
            key={l.id}
            className="rounded-2xl border border-white/12 bg-white/[0.05] p-3 shadow-[0_12px_32px_-22px_rgba(12,18,32,0.8)]"
            aria-label={`Лид ${l.name}`}
          >
            <header className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/demo/manager/crm/leads/${l.id}`}
                  prefetch={false}
                  className="block truncate text-base font-semibold text-white underline-offset-2 hover:underline"
                >
                  {l.name}
                </Link>
                {l.company && <div className={"truncate text-xs " + T.dim}>{l.company}</div>}
                <div className="mt-1 text-[11px] text-white/60">
                  {mapSource(l.source)} • {mapStatus(l.status)}
                </div>
              </div>
              <span className="rounded-lg border border-white/12 bg-white/[0.06] px-2 py-1 text-[10px] uppercase tracking-wide text-white/70">
                {l.owner || "Без ответственного"}
              </span>
            </header>

            <div className="mt-3 grid gap-1">
              {renderContactInline(l)}
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>Создан: {l.createdAt || "—"}</span>
                <span>Бюджет: {l.budget ? fmt(l.budget) + " ₽" : "—"}</span>
              </div>
            </div>

            <footer className="mt-3 flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                className="btn"
                onClick={() => onMsg(l)}
                aria-label={`Написать клиенту ${l.name}`}
              >
                <MessageCircle width={14} height={14} aria-hidden /> Написать
              </button>
              <Link
                href={`/demo/manager/crm/deals/new?lead=${l.id}`}
                prefetch={false}
                className="btn"
              >
                <NotebookPen width={14} height={14} aria-hidden /> Сделка
              </Link>
              <Link
                href={`/demo/manager/crm/leads/${l.id}`}
                prefetch={false}
                className="btn"
              >
                Подробнее
              </Link>
            </footer>
          </article>
        ))}
      </div>

      {/* Десктопная таблица */}
      <div className="overflow-x-auto rounded-xl border border-white/10 hidden md:block">
        <table
          className="w-full min-w-[980px] text-sm"
          aria-label="Таблица лидов CRM"
        >
        {/* Предсказуемые ширины колонок */}
        <colgroup>
          <col className="w-[22%]" />
          <col className="w-[20%]" />
          <col className="w-[10%]" />
          <col className="w-[12%]" />
          <col className="w-[12%]" />
          <col className="w-[12%]" />
          <col className="w-[12%]" />
        </colgroup>

        <thead className="sticky top-0 z-10 bg-white/[0.04] text-xs text-white/80 backdrop-blur">
          <tr>
            <Th>Имя / Компания</Th>
            <Th>Контакт</Th>
            <Th>Источник</Th>
            <Th>Статус</Th>
            <Th align="right">Бюджет</Th>
            <Th>Создан</Th>
            <Th>Ответственный</Th>
            <Th>Действия</Th>
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
                {l.company && <div className={"truncate text-xs " + T.dim}>{l.company}</div>}
              </td>

              {/* Контакт */}
              <td className="px-3 py-2 align-top text-xs">
                {renderContact(l)}
              </td>

              {/* Источник */}
              <td className="px-3 py-2 align-top text-xs">
                <span className="inline-flex items-center rounded-lg border border-white/12 bg-white/[0.06] px-2 py-0.5">
                  {mapSource(l.source)}
                </span>
              </td>

              {/* Статус */}
              <td className="px-3 py-2 align-top text-xs">
                <span className={"inline-flex items-center rounded-lg px-2 py-0.5 ring-1 ring-inset " + statusTone(l.status)}>
                  {mapStatus(l.status)}
                </span>
              </td>

              {/* Бюджет */}
              <td className="px-3 py-2 align-top text-right tabular-nums">
                {l.budget ? fmt(l.budget) + " ₽" : "—"}
              </td>

              {/* Даты / Ответственный */}
              <td className="px-3 py-2 align-top text-xs">{l.createdAt || "—"}</td>
              <td className="px-3 py-2 align-top text-xs">{l.owner || "—"}</td>

              {/* Действия */}
              <td className="px-3 py-2 align-top">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    className="btn inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    onClick={() => onMsg(l)}
                    aria-label={`Написать клиенту ${l.name}`}
                    title="Написать"
                  >
                    <MessageCircle width={14} height={14} aria-hidden />
                    <span className="hidden sm:inline">Написать</span>
                  </button>
                  <Link
                    href={`/demo/manager/crm/deals/new?lead=${l.id}`}
                    prefetch={false}
                    className="btn inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    aria-label={`Создать сделку по лиду ${l.name}`}
                    title="Создать сделку"
                  >
                    <NotebookPen width={14} height={14} aria-hidden />
                    <span className="hidden sm:inline">Сделка</span>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}

/* ================= Вспомогательные элементы ================= */

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th scope="col" className={`px-3 py-2 text-${align} font-medium`}>
      {children}
    </th>
  );
}

function renderContact(l: Lead) {
  // Показываем email и телефон отдельно, с безопасным тринкатом
  const email = l.email || (typeof l.contact === "string" && l.contact.includes("@") ? (l.contact as string) : "");
  const phone =
    l.phone ||
    (typeof l.contact === "string" && !String(l.contact).includes("@") ? (l.contact as string) : "");

  if (!email && !phone) {
    return <span className={T.dim}>нет данных</span>;
  }

  return (
    <>
      <div className="truncate text-xs">{email || "—"}</div>
      <div className={"truncate text-xs " + T.dim}>{phone || "—"}</div>
    </>
  );
}

function renderContactInline(l: Lead) {
  const email = l.email || (typeof l.contact === "string" && l.contact.includes("@") ? (l.contact as string) : "");
  const phone =
    l.phone ||
    (typeof l.contact === "string" && !String(l.contact).includes("@") ? (l.contact as string) : "");

  return (
    <div className="grid gap-1 text-xs">
      <div className="inline-flex items-center gap-1 truncate text-white/85">
        <Mail width={12} height={12} className="opacity-70" />
        {email || "—"}
      </div>
      <div className="inline-flex items-center gap-1 truncate text-white/70">
        <Phone width={12} height={12} className="opacity-60" />
        {phone || "—"}
      </div>
    </div>
  );
}

function fmt(n: number) {
  return Number(n).toLocaleString("ru-RU");
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

function mapStatus(s?: Lead["status"]) {
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
