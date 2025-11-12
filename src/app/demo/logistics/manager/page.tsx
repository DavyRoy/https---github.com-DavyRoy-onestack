'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getRoleById, getModulesByRole } from '../config';

function DashboardHeader() {
  const router = useRouter();
  const role = getRoleById('manager');

  return (
    <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 text-sm">
            <Link href="/demo" className="text-gray-400 hover:text-white transition-colors">
              Демо
            </Link>
            <span className="text-gray-600">/</span>
            <Link href="/demo/logistics" className="text-gray-400 hover:text-white transition-colors">
              Логистика
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">{role?.title}</span>
          </div>

          <div className="flex items-center gap-4">
            <select
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => router.push(e.target.value)}
              value={role?.route}
            >
              <option value="/demo/logistics/user">👤 Заказчик</option>
              <option value="/demo/logistics/manager">👔 Логист</option>
              <option value="/demo/logistics/owner">👑 Директор</option>
            </select>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                ℹ️
              </button>
              <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                ⚙️
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function KPIPanel() {
  const role = getRoleById('manager');

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {role?.kpi.map((kpi, index) => (
          <div key={index} className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-400 mb-2">{kpi.title}</div>
                <div className="text-3xl font-bold text-white">{kpi.value}</div>
              </div>
              {kpi.trend !== undefined && (
                <div className={`text-sm px-2 py-1 rounded-full ${
                  kpi.trend >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {kpi.trend >= 0 ? '↑' : '↓'} {Math.abs(kpi.trend)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuickActions() {
  const role = getRoleById('manager');

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8 py-8">
      <h2 className="text-xl font-semibold text-white mb-6">Быстрые действия</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {role?.quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.route}
            className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                {action.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{action.description}</p>
              </div>
              <div className="text-gray-400 group-hover:text-white transition-colors">
                →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ModulesGrid() {
  const modules = getModulesByRole('manager');

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 lg:px-8 py-8">
      <h2 className="text-xl font-semibold text-white mb-6">Модули управления</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Link
            key={module.id}
            href={module.route}
            className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  {module.icon}
                </div>
                <div className="flex gap-1">
                  {module.permissions.manager === 'RWD' && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                      Полный доступ
                    </span>
                  )}
                  {module.permissions.manager === 'RW' && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                      Чтение/Запись
                    </span>
                  )}
                  {module.permissions.manager === 'R' && (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-400">
                      Только чтение
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                  {module.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {module.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                {module.features.slice(0, 2).map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function ManagerDashboard() {
  return (
    <>
      <DashboardHeader />
      <main className="min-h-screen pb-20">
        <KPIPanel />
        <QuickActions />
        <ModulesGrid />
      </main>
    </>
  );
}