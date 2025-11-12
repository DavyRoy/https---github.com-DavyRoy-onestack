import React from 'react';
import Link from 'next/link';
import { TRANSPORT_MODULES, TRANSPORT_KPI } from '../config';

export default function OwnerDashboard() {
  const ownerModules = TRANSPORT_MODULES.filter(module => 
    module.roles.includes('owner')
  );

  const quickActions = [
    {
      title: 'Экспорт отчёта',
      description: 'Финансовая аналитика',
      icon: '📊',
      href: '/demo/transport/owner/modules/reports-export',
      color: 'blue'
    },
    {
      title: 'Сегментация',
      description: 'Анализ пассажиропотока',
      icon: '🎯',
      href: '/demo/transport/owner/modules/ridership-analytics',
      color: 'purple'
    },
    {
      title: 'Настроить интеграции',
      description: 'API и госданные',
      icon: '🔌',
      href: '/demo/transport/owner/modules/integrations',
      color: 'green'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/demo/transport" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Назад к обзору
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <span className="text-white font-medium">Транспортная компания</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href="/demo/transport/user"
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm"
              >
                Пассажир
              </Link>
              <Link
                href="/demo/transport/manager"
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm"
              >
                Диспетчер
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-8">
        {/* KPI Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <span className="text-lg">👥</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {(TRANSPORT_KPI.owner.dailyPassengers / 1000).toFixed(1)}k
                  </div>
                  <div className="text-sm text-gray-400">Пассажиров/день</div>
                </div>
              </div>
            </div>
            
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <span className="text-lg">📈</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{TRANSPORT_KPI.owner.occupancyRate}%</div>
                  <div className="text-sm text-gray-400">Заполняемость</div>
                </div>
              </div>
            </div>
            
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                  <span className="text-lg">💰</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {(TRANSPORT_KPI.owner.dailyRevenue / 1000000).toFixed(1)}M ₽
                  </div>
                  <div className="text-sm text-gray-400">Доход/день</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Стратегические действия</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${action.color}-500/20 border border-${action.color}-500/30 flex items-center justify-center text-xl`}>
                    {action.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">{action.title}</div>
                    <div className="text-sm text-gray-400">{action.description}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Modules Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Модули аналитики и управления</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownerModules.map((module) => (
              <Link
                key={module.id}
                href={module.path}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{module.icon}</div>
                  <div className="flex gap-1">
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                      {module.permissions.owner}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-2 text-white">{module.title}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{module.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  {module.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/60"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}