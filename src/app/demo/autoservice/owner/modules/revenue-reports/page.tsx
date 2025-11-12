import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const RevenueReports = dynamic(() => import('@/modules/autoservice/ServiceRevenue'), {
  loading: () => <ReportsSkeleton />
});

const KeyMetrics = dynamic(() => import('./components/KeyMetrics'), {
  loading: () => <MetricsSkeleton />
});

/* ===================== Skeleton Components ===================== */
function ReportsSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-64 rounded-lg bg-white/10 animate-pulse" />
        <div className="flex gap-2">
          <div className="h-10 w-32 rounded-lg bg-white/10 animate-pulse" />
          <div className="h-10 w-24 rounded-lg bg-white/10 animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 rounded-xl bg-white/5 animate-pulse" />
        <div className="h-80 rounded-xl bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}

function MetricsSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="h-6 w-48 rounded bg-white/10 animate-pulse mb-4" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/5">
            <div className="h-5 w-32 rounded bg-white/10 animate-pulse mb-2" />
            <div className="h-6 w-20 rounded bg-white/10 animate-pulse" />
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
            <Link href="/demo/autoservice/owner" className="hover:text-white transition-colors">
              Директор
            </Link>
            <span>→</span>
            <span className="text-white">Отчётность по выручке</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg text-sm hover:bg-green-500/30 transition-colors">
              📊 Генерация отчёта
            </button>
            <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
              📥 Экспорт Excel
            </button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
              ❓ Помощь
            </button>
            <Link
              href="/demo/autoservice/owner"
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

export default function RevenueReportsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(60% 60% at 80% 20%, rgba(34, 197, 94, 0.08), rgba(0,0,0,0)), radial-gradient(50% 40% at 20% 80%, rgba(59, 130, 246, 0.06), rgba(0,0,0,0))',
        }}
      />
      
      <ModuleHeader />

      <main className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8 py-8">
        {/* Page Header */}
        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Отчётность по выручке
          </h1>
          <p className="text-white/60 text-lg">
            Анализ доходов, прибыли и ключевых финансовых показателей
          </p>
        </section>

        {/* Financial Overview */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="text-2xl font-bold text-green-400 mb-1">2.8M ₽</div>
            <div className="text-white/60 text-sm">Выручка за месяц</div>
            <div className="text-green-400 text-xs mt-1">+14.6%</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="text-2xl font-bold text-blue-400 mb-1">842K ₽</div>
            <div className="text-white/60 text-sm">Прибыль</div>
            <div className="text-blue-400 text-xs mt-1">маржа 30.1%</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="text-2xl font-bold text-orange-400 mb-1">156</div>
            <div className="text-white/60 text-sm">Обслужено авто</div>
            <div className="text-orange-400 text-xs mt-1">+12 с прошлого месяца</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="text-2xl font-bold text-purple-400 mb-1">18.2K ₽</div>
            <div className="text-white/60 text-sm">Средний чек</div>
            <div className="text-purple-400 text-xs mt-1">+1.2K ₽</div>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Reports */}
          <div className="lg:col-span-3">
            <RevenueReports />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <KeyMetrics />
            
            {/* Quick Reports */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="font-semibold mb-4">Быстрые отчёты</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  📈 Ежедневная выручка
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  🔧 Выручка по услугам
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  👥 Эффективность мастеров
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  💰 Анализ прибыльности
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}