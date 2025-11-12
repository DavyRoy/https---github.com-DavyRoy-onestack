// app/demo/admin/crm/pipelines/page.tsx
"use client";

import Link from "next/link";
import SourcesTable from "@/app/demo/admin/crm/components/SourcesTable";
import PipelinesTable from "@/app/demo/admin/crm/components/PipelinesTable";

export default function AdminCrmPipelinesPage() {
  return (
    <div className="grid gap-6 w-full max-w-full overflow-x-hidden">
      {/* Заголовок */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Источники и Воронки
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Управляйте справочником источников лидов и настройками воронок продаж.
          </p>
        </div>

        {/* Действия */}
        <div className="flex w-full md:w-auto gap-2">
          <Link
            href="/demo/admin/crm/pipelines/new"
            className="w-full md:w-auto rounded-xl bg-white/90 text-black px-3 py-2 text-sm hover:bg-white text-center"
          >
            Новая воронка
          </Link>
        </div>
      </header>

      {/* Основной контент */}
      <section className="grid gap-6 w-full">
        {/* Источники лидов */}
        <div id="sources" className="w-full">
          <div className="mb-2 text-sm text-white/70 font-medium">Источники лидов</div>
          <SourcesTable />
        </div>

        {/* Воронки */}
        <div id="pipelines" className="w-full">
          <div className="mb-2 text-sm text-white/70 font-medium">Воронки продаж</div>
          <PipelinesTable />
        </div>
      </section>

      {/* Мобильные быстрые ссылки */}
      <nav className="md:hidden grid grid-cols-2 gap-2">
        <Link
          href="#sources"
          className="rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-center text-sm"
        >
          К источникам
        </Link>
        <Link
          href="#pipelines"
          className="rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-center text-sm"
        >
          К воронкам
        </Link>
      </nav>
    </div>
  );
}