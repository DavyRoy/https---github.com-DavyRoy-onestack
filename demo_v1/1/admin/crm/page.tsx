"use client";

import * as React from "react";
import Link from "next/link";

// существующие компоненты (оставляем как есть)
import CrmHero from "./components/CrmHero";
import CrmStats from "./components/CrmStats";
import QuickActions from "./components/QuickActions";
import ClientsTable from "./components/ClientsTable";

/* ——— лёгкие скелетоны ——— */
function StatsSkeleton() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
          <div className="h-3 w-24 bg-white/10 rounded mb-3 animate-pulse" />
          <div className="h-7 w-16 bg-white/10 rounded mb-2 animate-pulse" />
          <div className="h-3 w-10 bg-white/10 rounded animate-pulse" />
        </div>
      ))}
    </section>
  );
}

function TableSkeleton() {
  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] overflow-hidden">
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

/* ——— простая «заглушка» ошибок, чтобы хаб не падал из-за одной секции ——— */
function SectionError({ title, error }: { title: string; error?: string }) {
  return (
    <section className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4">
      <div className="text-sm font-medium mb-1">{title}</div>
      <div className="text-sm text-white/80">
        Не удалось загрузить. {error ? <span className="opacity-80">{error}</span> : "Попробуйте обновить страницу."}
      </div>
    </section>
  );
}

export default function AdminCrmHubPage() {
  // имитируем «мягкую» задержку для плавных скелетонов (без SSR артефактов)
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="grid gap-6">
      {/* Хедер */}
      <CrmHero />

      {/* KPI */}
      <React.Suspense fallback={<StatsSkeleton />}>
        {mounted ? <CrmStats /> : <StatsSkeleton />}
      </React.Suspense>

      {/* Быстрые действия */}
      <QuickActions />

      {/* Предпросмотр клиентов */}
      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <div className="text-white/70 text-sm">Предпросмотр клиентов</div>
          <Link
            href="/demo/admin/crm/clients"
            className="text-xs rounded-lg border border-white/15 px-2.5 py-1.5 hover:bg-white/[0.06]"
          >
            Ко всем клиентам
          </Link>
        </div>

        <React.Suspense fallback={<TableSkeleton />}>
          {mounted ? (
            <div className="rounded-2xl border border-white/15 bg-white/[0.05]">
              {/* 
                ClientsTable оставляем «как есть». 
                Если у тебя уже есть пропы для лимита — можно так:
                <ClientsTable limit={8} />
                иначе просто сам компонент и он отрендерит свою таблицу. 
              */}
              <ClientsTable />
            </div>
          ) : (
            <TableSkeleton />
          )}
        </React.Suspense>
      </section>
    </div>
  );
}