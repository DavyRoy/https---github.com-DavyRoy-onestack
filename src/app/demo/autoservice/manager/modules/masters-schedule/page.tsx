import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const MastersSchedule = dynamic(() => import('@/modules/autoservice/MastersSchedule'), {
  loading: () => <ScheduleSkeleton />
});

const ScheduleStats = dynamic(() => import('./components/ScheduleStats'), {
  loading: () => <StatsSkeleton />
});

/* ===================== Skeleton Components ===================== */
function ScheduleSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-64 rounded-lg bg-white/10 animate-pulse" />
        <div className="flex gap-2">
          <div className="h-10 w-32 rounded-lg bg-white/10 animate-pulse" />
          <div className="h-10 w-24 rounded-lg bg-white/10 animate-pulse" />
        </div>
      </div>
      <div className="h-96 rounded-xl bg-white/5 animate-pulse" />
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="h-6 w-48 rounded bg-white/10 animate-pulse mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
            <div className="h-5 w-32 rounded bg-white/10 animate-pulse" />
            <div className="h-6 w-16 rounded bg-white/10 animate-pulse" />
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
            <span className="text-white">Расписание мастеров</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
              📅 Новый слот
            </button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
              📊 Статистика
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

export default function MastersSchedulePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(60% 60% at 80% 20%, rgba(147, 51, 234, 0.08), rgba(0,0,0,0)), radial-gradient(50% 40% at 20% 80%, rgba(59, 130, 246, 0.06), rgba(0,0,0,0))',
        }}
      />
      
      <ModuleHeader />

      <main className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8 py-8">
        {/* Page Header */}
        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Расписание мастеров
          </h1>
          <p className="text-white/60 text-lg">
            Планирование работ и управление загрузкой боксов
          </p>
        </section>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">4</div>
            <div className="text-white/60 text-sm">Активных мастеров</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">81%</div>
            <div className="text-white/60 text-sm">Загрузка сегодня</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">12</div>
            <div className="text-white/60 text-sm">Работ сегодня</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">1</div>
            <div className="text-white/60 text-sm">Конфликтов</div>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Schedule */}
          <div className="lg:col-span-3">
            <MastersSchedule />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ScheduleStats />
            
            {/* Quick Actions */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="font-semibold mb-4">Быстрые действия</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  🔄 Перенос работ
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  ⏰ Блокировать слот
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  📋 Шаблоны расписания
                </button>
              </div>
            </div>

            {/* Masters List */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="font-semibold mb-4">Мастера</h3>
              <div className="space-y-3">
                {['Иван Петров', 'Алексей Смирнов', 'Михаил Козлов', 'Дмитрий Новиков'].map((master, index) => (
                  <div key={index} className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 text-sm">
                        {master.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-white/80 text-sm">{master}</span>
                    </div>
                    <span className="text-green-400 text-sm">75%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}