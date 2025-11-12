import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const PhotoReport = dynamic(() => import('@/modules/autoservice/PhotoReport'), {
  loading: () => <PhotoSkeleton />
});

const RecentReports = dynamic(() => import('./components/RecentReports'), {
  loading: () => <ReportsSkeleton />
});

/* ===================== Skeleton Components ===================== */
function PhotoSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="h-8 w-64 rounded-lg bg-white/10 animate-pulse mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="h-64 rounded-xl bg-white/5 animate-pulse mb-4" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 animate-pulse">
              <div className="h-5 w-32 rounded bg-white/10 mb-2" />
              <div className="h-4 w-24 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportsSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="h-6 w-48 rounded bg-white/10 animate-pulse mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <div className="w-12 h-12 rounded-lg bg-white/10 animate-pulse" />
            <div className="flex-1">
              <div className="h-5 w-40 rounded bg-white/10 animate-pulse mb-1" />
              <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
            </div>
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
            <Link href="/demo/autoservice/manager" className="hover:text-white transition-colors">
              Мастер
            </Link>
            <span>→</span>
            <span className="text-white">Фотоотчёт о ремонте</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
              📸 Сделать фото
            </button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
              📁 Загрузить
            </button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
              ❓ Помощь
            </button>
            <Link
              href="/demo/autoservice/manager"
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

export default function PhotoReportPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(60% 60% at 80% 20%, rgba(236, 72, 153, 0.08), rgba(0,0,0,0)), radial-gradient(50% 40% at 20% 80%, rgba(245, 158, 11, 0.06), rgba(0,0,0,0))',
        }}
      />
      
      <ModuleHeader />

      <main className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8 py-8">
        {/* Page Header */}
        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Фотоотчёт о ремонте
          </h1>
          <p className="text-white/60 text-lg">
            Документирование процесса ремонта с помощью фотографий
          </p>
        </section>

        {/* Active Order Selector */}
        <section className="mb-8">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Выберите заказ-наряд</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30">
                <option>#A-2023-001 - BMW X5 - Замена масла</option>
                <option>#A-2023-002 - Audi Q7 - Диагностика</option>
                <option>#A-2023-003 - Mercedes GLE - Тормоза</option>
              </select>
              <div className="text-white/60 text-sm flex items-center">
                Клиент: Александр Петров • Мастер: Иван Петров
              </div>
              <button className="bg-green-500/20 border border-green-500/30 text-green-300 rounded-xl py-3 font-semibold hover:bg-green-500/30 transition-colors">
                📋 Перейти к отчёту
              </button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Photo Gallery */}
          <div className="lg:col-span-3">
            <PhotoReport />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RecentReports />
            
            {/* Upload Tips */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="font-semibold mb-4">📝 Рекомендации</h3>
              <div className="space-y-3 text-sm text-white/60">
                <p>• Делайте фото "до/после" ремонта</p>
                <p>• Снимайте ключевые этапы работ</p>
                <p>• Добавляйте описания к фото</p>
                <p>• Отмечайте выявленные проблемы</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="font-semibold mb-4">Статистика</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Фото за сегодня:</span>
                  <span className="text-white">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Активные отчёты:</span>
                  <span className="text-white">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Загружено всего:</span>
                  <span className="text-white">1,248</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}