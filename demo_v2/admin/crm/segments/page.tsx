// app/demo/admin/crm/segments/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import SegmentsFiltersBar from "@/app/demo/admin/crm/components/SegmentsFiltersBar";
import SegmentsTable from "@/app/demo/admin/crm/components/SegmentsTable";

/* --------- лёгкие скелетоны --------- */
function FiltersSkeleton() {
  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4">
      <div className="grid gap-3 md:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 rounded-lg bg-white/10 animate-pulse" />
        ))}
      </div>
    </section>
  );
}

function TableSkeleton() {
  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.03] overflow-hidden">
      <div className="p-3 border-b border-white/10">
        <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
      </div>
      <div className="divide-y divide-white/10">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-3 grid gap-2 md:grid-cols-5">
            <div className="h-4 bg-white/10 rounded animate-pulse" />
            <div className="h-4 bg-white/10 rounded animate-pulse" />
            <div className="h-4 bg-white/10 rounded animate-pulse" />
            <div className="h-4 bg-white/10 rounded animate-pulse" />
            <div className="h-4 bg-white/10 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------- страница --------- */
export default function AdminCrmSegmentsPage() {
  // мягкая задержка, чтобы не было мигалок при гидрации
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(t);
  }, []);

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
      <React.Suspense fallback={<FiltersSkeleton />}>
        {mounted ? <SegmentsFiltersBar /> : <FiltersSkeleton />}
      </React.Suspense>

      {/* Таблица сегментов */}
      <React.Suspense fallback={<TableSkeleton />}>
        {mounted ? <SegmentsTable /> : <TableSkeleton />}
      </React.Suspense>

      {/* Подсказка */}
      <div className="text-xs text-white/50">
        💡 Клик по названию сегмента — откроет карточку для редактирования.
      </div>
    </div>
  );
}