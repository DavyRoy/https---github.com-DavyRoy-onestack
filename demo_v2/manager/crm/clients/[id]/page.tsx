"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Home, ArrowLeft, NotebookPen, CalendarClock, Mail } from "lucide-react";
import { toast } from "sonner";
import { T } from "@/app/demo/manager/_parts/tokens";
import { mockClients } from "@/app/demo/manager/crm/data/mockClients";

export default function ClientCardPage() {
  const { id } = useParams<{ id: string }>();
  const c = mockClients.find((x) => x.id === id);

  if (!c) {
    return (
      <div className="grid gap-5 md:gap-6">
        <header className={T.hero}>
          <nav className="flex items-center gap-2">
            <Link href="/demo/manager/crm/clients" prefetch={false} className="btn !px-3 !py-1.5">
              <ArrowLeft width={16} height={16} /> Назад к списку
            </Link>
          </nav>
          <h1 className="mt-2 text-2xl font-semibold">Клиент не найден</h1>
          <p className={"mt-1 text-sm " + T.dim}>Проверьте URL или вернитесь к списку клиентов.</p>
        </header>
      </div>
    );
  }

  const onMsg = () => toast.success("Сообщение отправлено (демо)");

  const emailEl = c.email ? (
    <a
      href={`mailto:${c.email}`}
      className="underline decoration-white/30 hover:decoration-white"
    >
      {c.email}
    </a>
  ) : (
    <span className={T.dim}>—</span>
  );

  const phoneDigits = (c.phone || "").replace(/[^\d+]/g, "");
  const phoneEl = c.phone ? (
    <a
      href={`tel:${phoneDigits}`}
      className="underline decoration-white/30 hover:decoration-white"
    >
      {c.phone}
    </a>
  ) : (
    <span className={T.dim}>—</span>
  );

  const tags = Array.isArray(c.tags) ? c.tags : [];

  return (
    <div className="grid gap-5 md:gap-6">
      {/* Хедер */}
      <header className={T.hero} role="region" aria-label="Карточка клиента: заголовок и действия">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <nav className="flex items-center gap-1 text-xs text-white/70" aria-label="Хлебные крошки">
              <Link href="/demo/manager/dashboard" prefetch={false} className="inline-flex items-center gap-1 hover:underline">
                <Home width={14} height={14} /> Дашборд
              </Link>
              <span className="opacity-40" aria-hidden>/</span>
              <Link href="/demo/manager/crm" prefetch={false} className="hover:underline">CRM</Link>
              <span className="opacity-40" aria-hidden>/</span>
              <Link href="/demo/manager/crm/clients" prefetch={false} className="hover:underline">Клиенты</Link>
              <span className="opacity-40" aria-hidden>/</span>
              <span className="text-white/80" aria-current="page">{c.name}</span>
            </nav>

            <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-balance">
              {c.name}
            </h1>
            <p className={"mt-1 text-sm " + T.dim}>
              {emailEl} • {phoneEl}
            </p>

            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[11px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Десктопные действия */}
          <div className="hidden md:flex gap-2">
            <button
              className="btn min-h-[38px]"
              onClick={onMsg}
              aria-label="Написать клиенту"
              type="button"
            >
              <Mail width={16} height={16} /> Написать
            </button>
            <Link className="btn min-h-[38px]" href={`/demo/manager/orders/new?client=${c.id}`} prefetch={false}>
              <NotebookPen width={16} height={16} /> Создать заказ
            </Link>
            <Link className="btn btn-primary min-h-[38px]" href={`/demo/manager/booking/new?client=${c.id}`} prefetch={false}>
              <CalendarClock width={16} height={16} /> Записать
            </Link>
          </div>
        </div>
      </header>

      {/* Профиль */}
      <section className={T.card} aria-labelledby="client-profile-title">
        <h2 id="client-profile-title" className="text-base font-semibold">Профиль</h2>
        <dl className="mt-2 grid gap-3 sm:grid-cols-2">
          <div className="grid gap-0.5 min-w-0">
            <dt className={"text-xs " + T.dim}>E-mail</dt>
            <dd className="text-sm break-all">{emailEl}</dd>
          </div>
          <div className="grid gap-0.5 min-w-0">
            <dt className={"text-xs " + T.dim}>Телефон</dt>
            <dd className="text-sm">{phoneEl}</dd>
          </div>
          <div className="grid gap-0.5">
            <dt className={"text-xs " + T.dim}>Создан</dt>
            <dd className="text-sm">{c.createdAt || <span className={T.dim}>—</span>}</dd>
          </div>
          <div className="grid gap-0.5">
            <dt className={"text-xs " + T.dim}>Теги</dt>
            <dd className="text-sm">
              {tags.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-block rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : (
                <span className={T.dim}>—</span>
              )}
            </dd>
          </div>
        </dl>
      </section>

      {/* Мобильные действия */}
      <div className="md:hidden flex gap-2">
        <button
          className="btn min-h-[40px] whitespace-nowrap"
          onClick={onMsg}
          type="button"
        >
          <Mail width={16} height={16} /> Написать
        </button>
        <Link
          className="btn min-h-[40px] whitespace-nowrap"
          href={`/demo/manager/orders/new?client=${c.id}`}
          prefetch={false}
        >
          <NotebookPen width={16} height={16} /> Заказ
        </Link>
        <Link
          className="btn btn-primary flex-1 min-h-[40px] whitespace-nowrap"
          href={`/demo/manager/booking/new?client=${c.id}`}
          prefetch={false}
        >
          <CalendarClock width={16} height={16} /> Записать
        </Link>
      </div>
    </div>
  );
}