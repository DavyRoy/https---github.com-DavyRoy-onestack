"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Home, NotebookPen, UserPlus, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { T } from "@/app/demo/manager/_parts/tokens";
import { mockLeads } from "@/app/demo/manager/crm/data/mockLeads";
import LeadTimeline from "@/app/demo/manager/crm/components/LeadTimeline";

/** Вспомогательные мапперы */
const fmt = (n: number | undefined) =>
  typeof n === "number" ? n.toLocaleString("ru-RU") : "—";
const srcLabel = (s?: string) =>
  s === "site" ? "Сайт" : s === "call" ? "Звонок" : s === "messenger" ? "Мессенджер" : s === "ref" ? "Реферал" : "—";
const statusLabel = (s?: string) =>
  s === "new" ? "Новый" : s === "in_progress" ? "В работе" : s === "closed" ? "Закрыт" : "—";
const statusTone = (s?: string) => {
  switch (s) {
    case "new":
      return "border-blue-300/30 bg-blue-300/10 text-blue-200";
    case "in_progress":
      return "border-amber-300/30 bg-amber-300/10 text-amber-200";
    case "closed":
      return "border-emerald-300/30 bg-emerald-300/10 text-emerald-200";
    default:
      return "border-white/20 bg-white/10 text-white/70";
  }
};

export default function LeadCardPage() {
  const { id } = useParams<{ id: string }>();
  const lead = mockLeads.find((l) => l.id === id);

  if (!lead) {
    return (
      <div className="grid gap-6">
        <header className={T.hero}>
          <nav className="flex items-center gap-2">
            <Link href="/demo/manager/crm/leads" prefetch={false} className="btn !px-3 !py-1.5">
              <ArrowLeft width={16} height={16} /> Назад к лидам
            </Link>
          </nav>
          <h1 className="mt-2 text-2xl font-semibold">Лид не найден</h1>
          <p className={"mt-1 text-sm " + T.dim}>
            Проверьте адрес или вернитесь к списку.
          </p>
        </header>
      </div>
    );
  }

  const onAssign = () => toast.success("Ответственный назначен (демо)");

  /** Безопасные ссылки для контактов */
  const contact = (lead.contact ?? "").trim();
  const emailHref = contact.includes("@") ? `mailto:${contact}` : undefined;
  const phoneHref =
    !contact.includes("@") && contact
      ? `tel:${contact.replace(/[^\d+]/g, "")}`
      : undefined;

  return (
    <div className="grid gap-6">
      {/* Хедер */}
      <header className={T.hero}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <nav
              className="flex flex-wrap items-center gap-1 text-xs text-white/70"
              aria-label="Хлебные крошки"
            >
              <Link
                href="/demo/manager/dashboard"
                prefetch={false}
                className="inline-flex items-center gap-1 hover:underline"
              >
                <Home width={14} height={14} /> Дашборд
              </Link>
              <span className="opacity-40" aria-hidden>
                /
              </span>
              <Link href="/demo/manager/crm" prefetch={false} className="hover:underline">
                CRM
              </Link>
              <span className="opacity-40" aria-hidden>
                /
              </span>
              <Link href="/demo/manager/crm/leads" prefetch={false} className="hover:underline">
                Лиды
              </Link>
              <span className="opacity-40" aria-hidden>
                /
              </span>
              <span className="text-white/80" aria-current="page">
                {lead.name}
              </span>
            </nav>

            <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight truncate">
              {lead.name}
            </h1>

            {/* Краткая строка с чипами — лучше читается на мобиле */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span
                className={
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] " +
                  statusTone(lead.status)
                }
              >
                Статус: {statusLabel(lead.status)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] text-white/80">
                Источник: {srcLabel(lead.source)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] text-white/80 tabular-nums">
                Бюджет: {fmt(lead.budget)} ₽
              </span>
            </div>

            {/* Контакт: кликабельно в mailto/tel, если распознано */}
            <p className={"mt-2 text-sm " + T.dim}>
              Контакт:{" "}
              {emailHref ? (
                <Link
                  href={emailHref}
                  className="underline decoration-white/30 hover:decoration-white"
                >
                  {contact}
                </Link>
              ) : phoneHref ? (
                <Link
                  href={phoneHref}
                  className="underline decoration-white/30 hover:decoration-white"
                >
                  {contact}
                </Link>
              ) : (
                <span className="text-white/80">{contact || "—"}</span>
              )}
              {lead.owner ? <> • Ответственный: {lead.owner}</> : null}
            </p>
          </div>

          {/* Действия (desktop) */}
          <div className="hidden md:flex gap-2">
            <button className="btn min-h-[40px]" onClick={onAssign} aria-label="Назначить ответственного">
              <UserPlus width={16} height={16} /> Назначить
            </button>
            <Link
              className="btn btn-primary min-h-[40px]"
              href={`/demo/manager/crm/deals/new?lead=${lead.id}`}
              prefetch={false}
            >
              <NotebookPen width={16} height={16} /> Создать сделку
            </Link>
          </div>
        </div>
      </header>

      {/* Быстрые контакты */}
      <section className={T.card} aria-labelledby="lead-contacts-title">
        <h2 id="lead-contacts-title" className="text-base font-semibold">
          Контакты
        </h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            href={emailHref || "#"}
            onClick={(e) => {
              if (!emailHref) e.preventDefault();
            }}
            className={"btn " + (!emailHref ? "opacity-60 pointer-events-none" : "")}
          >
            <Mail width={16} height={16} /> Написать письмо
          </Link>
          <Link
            href={phoneHref || "#"}
            onClick={(e) => {
              if (!phoneHref) e.preventDefault();
            }}
            className={"btn " + (!phoneHref ? "opacity-60 pointer-events-none" : "")}
          >
            <Phone width={16} height={16} /> Позвонить
          </Link>
        </div>
      </section>

      {/* Коммуникации / таймлайн */}
      <section className={T.card} aria-labelledby="lead-communications-title">
        <div className="flex items-center justify-between gap-2">
          <h2 id="lead-communications-title" className="text-base font-semibold">
            Коммуникации
          </h2>
          <Link
            href={`/demo/manager/crm/deals/new?lead=${lead.id}`}
            prefetch={false}
            className="btn btn-primary hidden sm:inline-flex"
          >
            <NotebookPen width={16} height={16} /> Создать сделку
          </Link>
        </div>
        <div className="mt-3">
          <LeadTimeline leadId={lead.id} />
        </div>
      </section>

      {/* Действия (mobile) */}
      <div className="md:hidden grid grid-cols-2 gap-2">
        <button className="btn min-h-[40px]" onClick={onAssign}>
          <UserPlus width={16} height={16} /> Назначить
        </button>
        <Link
          className="btn btn-primary min-h-[40px]"
          href={`/demo/manager/crm/deals/new?lead=${lead.id}`}
          prefetch={false}
        >
          <NotebookPen width={16} height={16} /> Сделка
        </Link>
      </div>
    </div>
  );
}