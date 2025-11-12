'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getRoleById, getModulesByRole } from '../config';

export default function UserDashboard() {
  const router = useRouter();
  const role = getRoleById('user');
  const modules = getModulesByRole('user');

  if (!role) return null;

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm text-gray-400">
              <Link href="/demo" className="hover:text-white transition-colors">
                Демо
              </Link>
              <span>›</span>
              <Link href="/demo/services" className="hover:text-white transition-colors">
                Сфера услуг
              </Link>
              <span>›</span>
              <span className="text-white">Клиент</span>
            </nav>

            {/* Role Switcher */}
            <div className="flex items-center space-x-2">
              <select 
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => router.push(`/demo/services/${e.target.value}`)}
                value="user"
              >
                <option value="user">👤 Клиент</option>
                <option value="manager">👔 Менеджер</option>
                <option value="owner">👑 Владелец</option>
              </select>
              
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                Справка
              </button>
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                Настройки
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-8">
        {/* KPI Panel */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Обзор</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {role.kpi.map((kpi, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-400 text-sm">{kpi.title}</h3>
                  {kpi.trend && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      kpi.trend > 0 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {kpi.trend > 0 ? '↑' : '↓'} {Math.abs(kpi.trend)}%
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold">{kpi.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Быстрые действия</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {role.quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.path}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{action.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-400">{action.description}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Modules Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Доступные модули</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Link
                key={module.id}
                href={module.path}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="text-2xl">{module.icon}</div>
                    <div className="flex gap-1">
                      {module.badges.map((badge) => (
                        <span
                          key={badge}
                          className="px-2 py-1 text-xs bg-white/10 rounded-full text-gray-300"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{module.title}</h3>
                    <p className="text-sm text-gray-400">{module.description}</p>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-gray-500">
                      {module.roles.length} ролей
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                      →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Activity Feed */}
        <section className="mt-12">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="font-semibold text-lg mb-4">Последние действия</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Бронь подтверждена — Стрижка (12 ноя, 14:00)</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Билет приобретён — Концерт Jazz Band (15 ноя)</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Начислено бонусов: +50 за отзыв</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}