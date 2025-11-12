// app/demo/admin/crm/segments/page.tsx
"use client";

import Link from "next/link";
import SegmentsFiltersBar from "@/app/demo/admin/crm/components/SegmentsFiltersBar";
import SegmentsTable from "@/app/demo/admin/crm/components/SegmentsTable";

export default function AdminCrmSegmentsPage() {
  return (
    <div className="grid gap-6">
      {/* Заголовок */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Сегменты / Теги</h1>
          <p className="text-white/60 text-sm mt-1">
            Управляйте динамическими и статическими сегментами для CRM и маркетинга.
          </p>
        </div>

        <Link
          href="/demo/admin/crm/segments/new"
          className="rounded-xl bg-white/90 text-black px-3 py-2 text-sm hover:bg-white"
        >
          Новый сегмент
        </Link>
      </header>

      {/* Панель фильтров */}
      <SegmentsFiltersBar />

      {/* Таблица сегментов */}
      <SegmentsTable />

      {/* Подсказка */}
      <div className="text-xs text-white/50">
        💡 Клик по названию сегмента — откроет карточку для редактирования.
      </div>
    </div>
  );
}