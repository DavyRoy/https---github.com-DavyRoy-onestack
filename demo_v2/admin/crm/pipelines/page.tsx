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
          <p className="mt-1 text-sm text-white/70 max-w-2xl">
            Управляйте справочником источников лидов и настройками воронок продаж.
            Настраивайте конверсию, каналы и этапы обработки лидов.
          </p>
        </div>

        {/* Действия */}
        <div className="flex w-full md:w-auto gap-2">
          <Link
            href="/demo/admin/crm/pipelines/new"
            className="w-full md:w-auto rounded-xl bg-white/90 text-black px-3 py-2 text-sm hover:bg-white text-center transition"
          >
            Новая воронка
          </Link>
        </div>
      </header>

      {/* Основной контент */}
      <section className="grid gap-8 w-full">
        {/* Источники лидов */}
        <div id="sources" className="w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-white/70 font-medium">Источники лидов</div>
            <button
              onClick={() => alert("Импорт источников — демо")}
              className="text-xs rounded-lg border border-white/15 px-2 py-1 hover:bg-white/[0.06]"
            >
              Импорт
            </button>
          </div>
          <SourcesTable />
        </div>

        {/* Воронки */}
        <div id="pipelines" className="w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-white/70 font-medium">Воронки продаж</div>
            <button
              onClick={() => alert("Экспорт воронок — демо")}
              className="text-xs rounded-lg border border-white/15 px-2 py-1 hover:bg-white/[0.06]"
            >
              Экспорт
            </button>
          </div>
          <PipelinesTable />
        </div>
      </section>

      {/* Быстрые мобильные ссылки */}
      <nav className="md:hidden grid grid-cols-2 gap-2">
        <Link
          href="#sources"
          className="rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-center text-sm hover:bg-white/[0.1]"
        >
          К источникам
        </Link>
        <Link
          href="#pipelines"
          className="rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-center text-sm hover:bg-white/[0.1]"
        >
          К воронкам
        </Link>
      </nav>
    </div>
  );
}