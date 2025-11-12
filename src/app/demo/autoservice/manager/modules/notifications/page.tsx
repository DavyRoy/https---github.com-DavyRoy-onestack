import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const NotificationsManager = dynamic(() => import('@/modules/autoservice/Notifications'), {
  loading: () => <NotificationsSkeleton />
});

const NotificationStats = dynamic(() => import('./components/NotificationStats'), {
  loading: () => <StatsSkeleton />
});

/* ===================== Skeleton Components ===================== */
function NotificationsSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="h-8 w-64 rounded-lg bg-white/10 animate-pulse mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 animate-pulse" />
              <div className="flex-1">
                <div className="h-5 w-48 rounded bg-white/10 animate-pulse mb-2" />
                <div className="h-4 w-32 rounded bg-white/10 animate-pulse" />
              </div>
              <div className="h-6 w-16 rounded-lg bg-white/10 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
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
            <div className="h-5 w-24 rounded bg-white/10 animate-pulse" />
            <div className="h-6 w-12 rounded bg-white/10 animate-pulse" />
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
            <span className="text-white">Уведомления клиентам</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
              ✉️ Создать рассылку
            </button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
              📋 Шаблоны
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

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(60% 60% at 80% 20%, rgba(59, 130, 246, 0.08), rgba(0,0,0,0)), radial-gradient(50% 40% at 20% 80%, rgba(168, 85, 247, 0.06), rgba(0,0,0,0))',
        }}
      />
      
      <ModuleHeader />

      <main className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8 py-8">
        {/* Page Header */}
        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Уведомления клиентам
          </h1>
          <p className="text-white/60 text-lg">
            Настройка автоматических уведомлений и управление рассылками
          </p>
        </section>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">156</div>
            <div className="text-white/60 text-sm">Отправлено сегодня</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">92%</div>
            <div className="text-white/60 text-sm">Доставлено</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">8</div>
            <div className="text-white/60 text-sm">Активных шаблонов</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">85%</div>
            <div className="text-white/60 text-sm">Клиентов с SMS</div>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Notifications Manager */}
          <div className="lg:col-span-3">
            <NotificationsManager />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <NotificationStats />
            
            {/* Quick Actions */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="font-semibold mb-4">Быстрые действия</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  📧 Тестовая отправка
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  👥 Массовая рассылка
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  ⚙️ Настройки каналов
                </button>
              </div>
            </div>

            {/* Channel Status */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="font-semibold mb-4">Статус каналов</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">SMS</span>
                  <span className="text-green-400">● Активен</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Email</span>
                  <span className="text-green-400">● Активен</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Push</span>
                  <span className="text-orange-400">● Частично</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Telegram</span>
                  <span className="text-red-400">● Не настроен</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}