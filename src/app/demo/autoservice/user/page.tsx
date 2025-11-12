import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AUTOSERVICE_ROLES, AUTOSERVICE_MODULES } from '../config';

const DemoKPI = dynamic(() => import('../components/DemoKPI'), {
  loading: () => <KPISkeleton />
});

const QuickActions = dynamic(() => import('../components/QuickActions'), {
  loading: () => <QuickActionsSkeleton />
});

const ModulesGrid = dynamic(() => import('../components/ModulesGrid'), {
  loading: () => <ModulesGridSkeleton />
});

const ActivityFeed = dynamic(() => import('../components/ActivityFeed'), {
  loading: () => <ActivityFeedSkeleton />
});

/* ===================== Skeleton Components ===================== */
function KPISkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="h-5 w-24 rounded bg-white/10 animate-pulse mb-2" />
          <div className="h-8 w-16 rounded bg-white/10 animate-pulse mb-1" />
          <div className="h-4 w-20 rounded bg-white/10 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function QuickActionsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 animate-pulse" />
            <div className="flex-1">
              <div className="h-5 w-32 rounded bg-white/10 animate-pulse mb-1" />
              <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ModulesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 animate-pulse" />
            <div className="h-6 w-32 rounded bg-white/10 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-white/10 animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full bg-white/10 animate-pulse" />
            <div className="h-6 w-20 rounded-full bg-white/10 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityFeedSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="h-6 w-32 rounded bg-white/10 animate-pulse mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
            <div className="flex-1">
              <div className="h-4 w-48 rounded bg-white/10 animate-pulse mb-1" />
              <div className="h-3 w-32 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== Header Component ===================== */
function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
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
            <span className="text-white">Клиент</span>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-2">
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-white/30">
              <option value="user">👤 Клиент</option>
              <option value="manager">🔧 Мастер</option>
              <option value="owner">👑 Директор</option>
            </select>
            
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              ⚙️
            </button>
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              ❓
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ===================== Main Dashboard Component ===================== */
export default function UserDashboard() {
  const role = AUTOSERVICE_ROLES.user;
  const userModules = AUTOSERVICE_MODULES.filter(module => 
    module.roles.includes('user')
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(60% 60% at 80% 20%, rgba(120, 119, 198, 0.08), rgba(0,0,0,0)), radial-gradient(50% 40% at 20% 80%, rgba(255, 138, 0, 0.06), rgba(0,0,0,0))',
        }}
      />
      
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Добро пожаловать, Александр!
          </h1>
          <p className="text-white/60 text-lg">
            Ваш автомобиль: BMW X5 • Госномер: А123БВ777
          </p>
        </section>

        {/* KPI Section */}
        <section className="mb-8">
          <DemoKPI kpis={role.kpi} />
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Быстрые действия</h2>
          <QuickActions actions={role.quickActions} />
        </section>

        {/* Modules Grid */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Мои модули</h2>
          <ModulesGrid modules={userModules} />
        </section>

        {/* Activity Feed */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Последние действия</h2>
            <ActivityFeed />
          </div>
          
          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="font-semibold mb-4">Статус автомобиля</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Текущий ремонт</span>
                  <span className="text-orange-400">В работе</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Следующее ТО</span>
                  <span className="text-green-400">Через 2 500 км</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Гарантия</span>
                  <span className="text-blue-400">До 12.12.2024</span>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="font-semibold mb-4">Рекомендации</h3>
              <div className="space-y-2 text-sm text-white/60">
                <p>• Замена масла через 1 000 км</p>
                <p>• Проверить тормозные колодки</p>
                <p>• Балансировка колёс</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}