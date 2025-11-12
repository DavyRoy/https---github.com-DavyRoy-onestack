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

const RevenueChart = dynamic(() => import('../components/RevenueChart'), {
  loading: () => <ChartSkeleton />
});

const PerformanceMetrics = dynamic(() => import('../components/PerformanceMetrics'), {
  loading: () => <MetricsSkeleton />
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

function ChartSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="h-6 w-48 rounded bg-white/10 animate-pulse mb-6" />
      <div className="h-64 rounded-lg bg-white/5 animate-pulse" />
    </div>
  );
}

function MetricsSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="h-6 w-48 rounded bg-white/10 animate-pulse mb-6" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg bg-white/5">
            <div className="h-5 w-20 rounded bg-white/10 animate-pulse mb-2" />
            <div className="h-6 w-16 rounded bg-white/10 animate-pulse" />
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
            <span className="text-white">Директор</span>
          </div>

          {/* Role Switcher & Tools */}
          <div className="flex items-center gap-3">
            <div className="text-right text-sm">
              <div className="text-green-400 font-semibold">+14.6%</div>
              <div className="text-white/60">Выручка за месяц</div>
            </div>
            
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-white/30">
              <option value="user">👤 Клиент</option>
              <option value="manager">🔧 Мастер</option>
              <option value="owner" selected>👑 Директор</option>
            </select>
            
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              📊
            </button>
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
export default function OwnerDashboard() {
  const role = AUTOSERVICE_ROLES.owner;
  const ownerModules = AUTOSERVICE_MODULES.filter(module => 
    module.roles.includes('owner')
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(60% 60% at 80% 20%, rgba(156, 39, 176, 0.08), rgba(0,0,0,0)), radial-gradient(50% 40% at 20% 80%, rgba(76, 175, 80, 0.06), rgba(0,0,0,0))',
        }}
      />
      
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Бизнес-аналитика, Михаил!
              </h1>
              <p className="text-white/60 text-lg">
                Обзор эффективности СТО за текущий месяц
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">1.4M ₽</div>
              <div className="text-white/60 text-sm">Выручка неделя</div>
            </div>
          </div>
        </section>

        {/* KPI Section */}
        <section className="mb-8">
          <DemoKPI kpis={role.kpi} />
        </section>

        {/* Charts & Metrics */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          <div className="xl:col-span-2">
            <RevenueChart />
          </div>
          <div>
            <PerformanceMetrics />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Управление бизнесом</h2>
          <QuickActions actions={role.quickActions} />
        </section>

        {/* Modules Grid */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Бизнес-модули</h2>
          <ModulesGrid modules={ownerModules} />
        </section>

        {/* Financial Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white/80">Выручка</h3>
              <span className="text-green-400 text-sm">+14.6%</span>
            </div>
            <div className="text-2xl font-bold text-white">2.8M ₽</div>
            <div className="text-white/60 text-sm">за 30 дней</div>
          </div>
          
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white/80">Прибыль</h3>
              <span className="text-green-400 text-sm">+8.2%</span>
            </div>
            <div className="text-2xl font-bold text-white">842K ₽</div>
            <div className="text-white/60 text-sm">маржа 30.1%</div>
          </div>
          
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white/80">Клиенты</h3>
              <span className="text-blue-400 text-sm">+12</span>
            </div>
            <div className="text-2xl font-bold text-white">156</div>
            <div className="text-white/60 text-sm">новых за месяц</div>
          </div>
          
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white/80">NPS</h3>
              <span className="text-green-400 text-sm">+0.3</span>
            </div>
            <div className="text-2xl font-bold text-white">4.7</div>
            <div className="text-white/60 text-sm">из 5.0</div>
          </div>
        </section>
      </main>
    </div>
  );
}