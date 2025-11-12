"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Home, ChevronRight } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";
import LeadForm from "@/app/demo/manager/crm/components/LeadForm";

export default function LeadNewPage() {
  const router = useRouter();
  const sp = useSearchParams();
  // поведение после сохранения (демо): open | list
  const after = (sp.get("after") || "open").toLowerCase();

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
              <Link href="/demo/manager/crm" prefetch={false} className="hover:underline">
                CRM
              </Link>
              <ChevronRight width={14} height={14} className="opacity-40" />
              <Link href="/demo/manager/crm/leads" prefetch={false} className="hover:underline">
                Лиды
              </Link>
              <ChevronRight width={14} height={14} className="opacity-40" />
              <span className="text-white/80" aria-current="page">
                Новый лид
              </span>
            </nav>

            <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
              Новый лид
            </h1>
            <p className={"mt-1 text-sm " + T.dim}>
              Заполните ключевые поля — остальные можно добавить позже.
            </p>
          </div>

          {/* Кнопка отмены (desktop) */}
          <Link
            href="/demo/manager/crm/leads"
            prefetch={false}
            className="btn hidden md:inline-flex min-h-[40px]"
            aria-label="Отмена и возврат к списку лидов"
          >
            <ArrowLeft width={16} height={16} /> Отмена
          </Link>
        </div>
      </header>

      {/* Форма */}
      <section
        className={T.card + " grid gap-3 md:grid-cols-2"}
        aria-labelledby="lead-create-form-title"
      >
        <h2 id="lead-create-form-title" className="sr-only">
          Форма создания лида
        </h2>

        <LeadForm
            onSaved={(id) => {
              if (after === "open") {
                router.push(`/demo/manager/crm/leads/${id}`);
              } else {
                router.push(`/demo/manager/crm/leads`);
              }
            }}
        />
      </section>

      {/* Дублированная отмена для мобилы */}
      <div className="md:hidden">
        <Link
          href="/demo/manager/crm/leads"
          prefetch={false}
          className="btn w-full min-h-[40px]"
        >
          <ArrowLeft width={16} height={16} /> Отмена
        </Link>
      </div>
    </div>
  );
}