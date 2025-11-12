import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const PriceEstimator = dynamic(() => import('@/modules/autoservice/PriceEstimator'), {
  loading: () => <EstimatorSkeleton />
});

const RecentEstimates = dynamic(() => import('./components/RecentEstimates'), {
  loading: () => <HistorySkeleton />
});

/* ===================== Skeleton Components ===================== */
function EstimatorSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="h-8 w-64 rounded-lg bg-white/10 animate-pulse mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="h-6 w-48 rounded bg-white/10 animate-pulse mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex justify-between items-center">
                    <div className="h-4 w-32 rounded bg-white/10 animate-pulse" />
                    <div className="h-6 w-20 rounded bg-white/10 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="h-6 w-32 rounded bg-white/10 animate-pulse mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-16 rounded bg-white/10 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="h-6 w-48 rounded bg-white/10 animate-pulse mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-3 rounded-lg bg-white/5">
            <div className="h-5 w-40 rounded bg-white/10 animate-pulse mb-2" />
            <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== Header Component ===================== */
function ModuleHeader() {
  return (
    <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-3 text-sm text-white/60">
            <Link href="/demo" className="hover:text-white transition-colors">
              Демо
            </Link>
            <span>→</span>
            <Link href="/demo/autoservice" className="hover:text-white transition-colors">
              Автосервис
            </Link>
            <span>→</span>
            <Link href="/demo/autoservice/user" className="hover:text-white transition-colors">
              Клиент
            </Link>
            <span>→</span>
            <span className="text-white">Расчёт стоимости</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
              💰 Прайс-лист
            </button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
              ❓ Помощь
            </button>
            <Link
              href="/demo/autoservice/user"
              className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              ← Назад
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function PriceEstimatorPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(60% 60% at 80% 20%, rgba(34, 197, 94, 0.08), rgba(0,0,0,0)), radial-gradient(50% 40% at 20% 80%, rgba(234, 179, 8, 0.06), rgba(0,0,0,0))',
        }}
      />
      
      <ModuleHeader />

      <main className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8 py-8">
        {/* Page Header */}
        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Расчёт стоимости ремонта
          </h1>
          <p className="text-white/60 text-lg">
            Узнайте предварительную стоимость работ и запчастей для вашего автомобиля
          </p>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calculator */}
          <div className="lg:col-span-3">
            <PriceEstimator />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RecentEstimates />
            
            {/* Info Card */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="font-semibold mb-4">💡 Подсказки</h3>
              <div className="space-y-3 text-sm text-white/60">
                <p>• Выберите необходимые работы</p>
                <p>• Укажите марку и модель авто</p>
                <p>• Выберите тип запчастей</p>
                <p>• Получите точный расчёт</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}