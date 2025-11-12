"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Home, ChevronRight, NotebookPen } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";
import DealForm from "@/app/demo/manager/crm/components/DealForm";

export default function DealNewPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const leadId = sp.get("lead") || undefined;

  return (
    <div className="grid gap-6">
      {/* Хедер */}
      <header className={T.hero} aria-labelledby="deal-new-title">
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
              <Link href="/demo/manager/crm/deals" prefetch={false} className="hover:underline">
                Сделки
              </Link>
              <ChevronRight width={14} height={14} className="opacity-40" />
              <span className="text-white/80" aria-current="page">
                Новая сделка
              </span>
            </nav>

            <h1 id="deal-new-title" className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
              Новая сделка
            </h1>

            {leadId ? (
              <p className={"mt-1 text-sm " + T.dim}>
                Предзаполнено из лида:&nbsp;
                <Link
                  href={`/demo/manager/crm/leads/${leadId}`}
                  prefetch={false}
                  className="underline decoration-white/30 hover:decoration-white"
                >
                  {leadId}
                </Link>{" "}
                (демо)
              </p>
            ) : (
              <p className={"mt-1 text-sm " + T.dim}>
                Заполните ключевые поля — остальные можно добавить позже.
              </p>
            )}
          </div>

          {/* Кнопка отмены справа на десктопе */}
          <Link
            href="/demo/manager/crm/deals"
            prefetch={false}
            className="btn"
            aria-label="Отмена и возврат к списку сделок"
          >
            <ArrowLeft width={16} height={16} /> Отмена
          </Link>
        </div>
      </header>

      {/* Форма создания */}
      <section className={T.card} aria-label="Форма создания сделки">
        <div className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-white/85">
          <NotebookPen width={16} height={16} /> Данные сделки
        </div>

        {/* DealForm уже содержит валидацию, a11y и Enter-submit */}
        <DealForm onSaved={(id) => router.push(`/demo/manager/crm/deals/${id}`)} />

        {/* Подсказки: помогают на мобиле, не занимают много места */}
        <ul className={"mt-3 text-xs " + T.dim + " list-disc pl-4 space-y-1"}>
          <li>Название — коротко о сути (например, «Оснащение салона…»).</li>
          <li>Сумма — только числа, без пробелов и валюты.</li>
          <li>Этап и ответственный можно изменить позже на карточке сделки.</li>
        </ul>
      </section>

      {/* Дублирование CTA для мобилы (внизу экрана) — не обязательно, но удобно
          Оставляем только ссылку «Отмена», чтобы не дублировать кнопку сабмита из формы */}
      <div className="md:hidden">
        <Link
          href="/demo/manager/crm/deals"
          prefetch={false}
          className="btn inline-flex items-center gap-2 w-full justify-center"
        >
          <ArrowLeft width={16} height={16} /> Отмена
        </Link>
      </div>
    </div>
  );
}