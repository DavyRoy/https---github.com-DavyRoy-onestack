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

const PriorityTasks = dynamic(() => import('../components/PriorityTasks'), {
  loading: () => <PriorityTasksSkeleton />
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
      {Array.from({ length: 8 }).map((_, i) => (
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

function PriorityTasksSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="h-6 w-32 rounded bg-white/10 animate-pulse mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
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
            <span className="text-white">Мастер</span>
          </div>

          {/* Role Switcher & Tools */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Онлайн
            </div>
            
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-white/30">
              <option value="user">👤 Клиент</option>
              <option value="manager" selected>🔧 Мастер</option>
              <option value="owner">👑 Директор</option>
            </select>
            
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              ⚙️
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ===================== Main Dashboard Component ===================== */
export default function ManagerDashboard() {
  const role = AUTOSERVICE_ROLES.manager;
  const managerModules = AUTOSERVICE_MODULES.filter(module => 
    module.roles.includes('manager')
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(60% 60% at 80% 20%, rgba(255, 193, 7, 0.08), rgba(0,0,0,0)), radial-gradient(50% 40% at 20% 80%, rgba(33, 150, 243, 0.06), rgba(0,0,0,0))',
        }}
      />
      
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Рабочий дашборд, Иван!
              </h1>
              <p className="text-white/60 text-lg">
                Сегодня: {new Date().toLocaleDateString('ru-RU', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">81%</div>
              <div className="text-white/60 text-sm">Загрузка</div>
            </div>
          </div>
        </section>

        {/* KPI Section */}
        <section className="mb-8">
          <DemoKPI kpis={role.kpi} />
        </section>

        {/* Priority Tasks & Quick Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Приоритетные задачи</h2>
            <PriorityTasks />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Быстрые действия</h2>
            <QuickActions actions={role.quickActions} />
          </div>
        </section>

        {/* Modules Grid */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Модули управления</h2>
          <ModulesGrid modules={managerModules} />
        </section>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">8</div>
            <div className="text-white/60 text-sm">В работе</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">12</div>
            <div className="text-white/60 text-sm">Завершено</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">3</div>
            <div className="text-white/60 text-sm">Ожидают</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">1</div>
            <div className="text-white/60 text-sm">Просрочено</div>
          </div>
        </section>
      </main>
    </div>
  );
}