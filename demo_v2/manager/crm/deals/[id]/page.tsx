"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Home,
  UserPlus,
  FileText,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { T } from "@/app/demo/manager/_parts/tokens";
import { mockDeals } from "@/app/demo/manager/crm/data/mockDeals";

const fmt = (n: number) => n.toLocaleString("ru-RU");
const stageLabel = (s: string) =>
  s === "new"
    ? "Новый"
    : s === "in_progress"
    ? "В работе"
    : s === "proposal"
    ? "Коммерческое"
    : s === "won"
    ? "Успех"
    : "Потеряно";

const stageTone = (s: string) => {
  switch (s) {
    case "new":
      return "border-blue-300/30 bg-blue-300/10 text-blue-200";
    case "in_progress":
      return "border-amber-300/30 bg-amber-300/10 text-amber-200";
    case "proposal":
      return "border-sky-300/30 bg-sky-300/10 text-sky-200";
    case "won":
      return "border-emerald-300/30 bg-emerald-300/10 text-emerald-200";
    case "lost":
      return "border-red-300/30 bg-red-300/10 text-red-200";
    default:
      return "border-white/20 bg-white/10 text-white/80";
  }
};

export default function DealCardPage() {
  const { id } = useParams<{ id: string }>();
  const d = mockDeals.find((x) => x.id === id);

  if (!d) {
    return (
      <div className="grid gap-6">
        <header className={T.hero}>
          <div className="flex items-start justify-between">
            <nav aria-label="Навигация назад">
              <Link
                href="/demo/manager/crm/deals"
                prefetch={false}
                className="btn !px-3 !py-1.5"
              >
                <ArrowLeft width={16} height={16} /> Назад
              </Link>
            </nav>
          </div>
          <h1 className="mt-2 text-2xl font-semibold">Сделка не найдена</h1>
          <p className={"mt-1 text-sm " + T.dim}>
            Проверьте ссылку или вернитесь к списку сделок.
          </p>
        </header>
      </div>
    );
  }

  const onAssign = () => toast.success("Ответственный назначен (демо)");
  const onInvoice = () => toast.success("Счёт создан (демо)");

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
              <Link
                href="/demo/manager/crm"
                prefetch={false}
                className="hover:underline"
              >
                CRM
              </Link>
              <ChevronRight width={14} height={14} className="opacity-40" />
              <Link
                href="/demo/manager/crm/deals"
                prefetch={false}
                className="hover:underline"
              >
                Сделки
              </Link>
              <ChevronRight width={14} height={14} className="opacity-40" />
              <span className="text-white/80" aria-current="page">
                {d.title}
              </span>
            </nav>

            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight truncate">
                {d.title}
              </h1>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${stageTone(
                  d.stage
                )}`}
                title={`Этап: ${stageLabel(d.stage)}`}
              >
                {stageLabel(d.stage)}
              </span>
            </div>

            <p className={"mt-1 text-sm " + T.dim}>
              <span className="opacity-80">Клиент:</span> {d.client} •{" "}
              <span className="opacity-80">Сумма:</span>{" "}
              <span className="tabular-nums">{fmt(d.amount)} ₽</span> •{" "}
              <span className="opacity-80">Срок:</span> до {d.due}
            </p>
          </div>

          {/* Десктопные действия */}
          <div className="hidden md:flex gap-2">
            <button className="btn" onClick={onAssign} aria-label="Назначить ответственного">
              <UserPlus width={16} height={16} /> Назначить отв.
            </button>
            <button
              className="btn btn-primary"
              onClick={onInvoice}
              aria-label="Создать счёт"
            >
              <FileText width={16} height={16} /> Создать счёт
            </button>
          </div>
        </div>
      </header>

      {/* Сводка */}
      <section className={T.card} aria-labelledby="deal-summary-title">
        <div className="flex items-center justify-between gap-2">
          <h2 id="deal-summary-title" className="text-base font-semibold">
            Сводка
          </h2>
          <Link
            href="/demo/manager/crm/deals"
            prefetch={false}
            className="inline-flex items-center gap-1 text-sm underline"
          >
            <ArrowLeft width={14} height={14} /> К списку
          </Link>
        </div>

        {/* Инфо-сетка: хорошо скейлится на 393×852 */}
        <dl className="mt-2 grid gap-3 sm:grid-cols-2">
          <div className="grid gap-0.5">
            <dt className={"text-xs " + T.dim}>Клиент</dt>
            <dd className="text-sm">{d.client}</dd>
          </div>
          <div className="grid gap-0.5">
            <dt className={"text-xs " + T.dim}>Сумма</dt>
            <dd className="text-sm tabular-nums">{fmt(d.amount)} ₽</dd>
          </div>
          <div className="grid gap-0.5">
            <dt className={"text-xs " + T.dim}>Этап</dt>
            <dd className="text-sm">
              <span
                className={
                  "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium " +
                  stageTone(d.stage)
                }
              >
                {stageLabel(d.stage)}
              </span>
            </dd>
          </div>
          <div className="grid gap-0.5">
            <dt className={"text-xs " + T.dim}>Следующий шаг до</dt>
            <dd className="text-sm">{d.due}</dd>
          </div>
          <div className="grid gap-0.5">
            <dt className={"text-xs " + T.dim}>Создана</dt>
            <dd className="text-sm">{d.createdAt}</dd>
          </div>
          <div className="grid gap-0.5">
            <dt className={"text-xs " + T.dim}>Ссылка на клиента</dt>
            <dd className="text-sm">
              {/* Демо: клиента в моках можно найти по названию, но оставим якорь на список */}
              <Link
                href="/demo/manager/crm/clients"
                prefetch={false}
                className="underline decoration-white/30 hover:decoration-white"
              >
                Открыть список клиентов
              </Link>
            </dd>
          </div>
        </dl>

        {/* Быстрые действия внутри карточки — всегда под рукой */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            className="btn inline-flex items-center gap-1"
            onClick={onAssign}
          >
            <UserPlus width={14} height={14} /> Назначить ответственного
          </button>
          <button
            className="btn btn-primary inline-flex items-center gap-1"
            onClick={onInvoice}
          >
            <FileText width={14} height={14} /> Создать счёт
          </button>
        </div>
      </section>

      {/* Мобильные CTA — липнут к низу контента, не перекрывают экран */}
      <div className="md:hidden flex gap-2">
        <button className="btn" onClick={onAssign}>
          <UserPlus width={16} height={16} /> Назначить
        </button>
        <button className="btn btn-primary flex-1" onClick={onInvoice}>
          <FileText width={16} height={16} /> Счёт
        </button>
      </div>
    </div>
  );
}