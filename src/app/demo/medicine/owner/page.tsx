'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Локальный компонент KPICard вместо импорта
const KPICard = ({ title, value, change, icon, description, color, trend }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-white/5 border border-white/10 rounded-xl p-3 lg:p-4 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:bg-white/10 group"
  >
    <div className="flex items-center justify-between mb-2 lg:mb-3">
      <div className="flex-1 min-w-0">
        <h3 className="text-white/60 text-xs lg:text-sm font-medium truncate">{title}</h3>
        <p className="text-lg lg:text-xl font-bold text-white mt-1 truncate">{value}</p>
        {description && (
          <p className="text-white/40 text-xs mt-1 truncate">{description}</p>
        )}
      </div>
      <div className={`text-xl lg:text-2xl ml-2 group-hover:scale-110 transition-transform duration-200 ${
        color?.includes('green') ? 'text-green-400' :
        color?.includes('blue') ? 'text-blue-400' :
        color?.includes('purple') ? 'text-purple-400' :
        color?.includes('orange') ? 'text-orange-400' :
        color?.includes('yellow') ? 'text-yellow-400' :
        'text-teal-400'
      }`}>
        {icon}
      </div>
    </div>
    {change && (
      <div className={`text-xs lg:text-sm ${
        change.startsWith('+') ? 'text-green-400' : 'text-red-400'
      }`}>
        {change}
      </div>
    )}
  </motion.div>
);

// Локальный компонент ModuleCard вместо импорта
const ModuleCard = ({ module, role, basePath, compact = false }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:bg-white/10 group"
  >
    <div className="flex items-start justify-between mb-3 lg:mb-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-lg lg:text-xl group-hover:scale-110 transition-transform duration-200">
            {module.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm lg:text-base truncate">
              {module.name}
            </h3>
            <p className="text-white/60 text-xs lg:text-sm truncate">
              {module.description}
            </p>
          </div>
        </div>
        
        {!compact && module.features && (
          <div className="space-y-1">
            {module.features.slice(0, 2).map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-white/60 text-xs">
                <span>•</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    
    <div className="flex items-center justify-between">
      <span className="text-blue-400 text-xs lg:text-sm font-medium">
        Открыть модуль
      </span>
      <span className="text-white/40 group-hover:text-white transition-colors">
        →
      </span>
    </div>
  </motion.div>
);

// Mock конфигурация ролей и модулей
const roleConfigs = {
  owner: {
    name: 'Владелец клиники',
    description: 'Управление бизнес-процессами и аналитика',
    icon: '👑',
    kpis: [
      { title: 'Общая выручка', value: '1.2M ₽', change: '+15.3%', icon: '💰' },
      { title: 'Новые пациенты', value: '156', change: '+8.2%', icon: '👥' },
      { title: 'Загрузка врачей', value: '84%', change: '+5.1%', icon: '📊' }
    ],
    quickActions: [
      { icon: '📊', label: 'Аналитика', moduleId: 'analytics' },
      { icon: '💰', label: 'Финансы', moduleId: 'finance' },
      { icon: '👥', label: 'Персонал', moduleId: 'staff' }
    ]
  }
};

const getModulesForRole = (role) => [
  {
    id: 'analytics',
    name: 'Бизнес-аналитика',
    description: 'Ключевые метрики и тренды',
    icon: '📈',
    features: ['Финансовая аналитика', 'Статистика пациентов', 'Эффективность врачей']
  },
  {
    id: 'finance',
    name: 'Финансовый учет',
    description: 'Управление доходами и расходами',
    icon: '💰',
    features: ['Отчеты по выручке', 'Анализ расходов', 'Прогнозирование']
  },
  {
    id: 'staff',
    name: 'Управление персоналом',
    description: 'Штатное расписание и KPI',
    icon: '👥',
    features: ['Расписание врачей', 'KPI сотрудников', 'Нагрузка отделений']
  },
  {
    id: 'patients',
    name: 'База пациентов',
    description: 'Управление клиентской базой',
    icon: '🏥',
    features: ['История обращений', 'Статистика лояльности', 'CRM аналитика']
  },
  {
    id: 'reports',
    name: 'Отчетность',
    description: 'Автоматические отчеты',
    icon: '📋',
    features: ['Ежедневные сводки', 'Месячные отчеты', 'Кастомизация']
  },
  {
    id: 'settings',
    name: 'Настройки системы',
    description: 'Конфигурация клиники',
    icon: '⚙️',
    features: ['Настройки модулей', 'Права доступа', 'Интеграции']
  }
];

export default function OwnerDashboard() {
  const role = roleConfigs.owner;
  const modules = getModulesForRole('owner');
  const [activeView, setActiveView] = useState<'overview' | 'analytics'>('overview');

  // Mock данные для KPI
  const kpiData = useMemo(() => [
    {
      title: 'Общая выручка',
      value: '1.2M ₽',
      change: '+15.3%',
      icon: '💰',
      description: 'За текущий месяц',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Новые пациенты',
      value: '156',
      change: '+8.2%',
      icon: '👥',
      description: 'За последние 30 дней',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Загрузка врачей',
      value: '84%',
      change: '+5.1%',
      icon: '📊',
      description: 'Средняя по клинике',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'ROI',
      value: '23.5%',
      change: '+3.2%',
      icon: '📈',
      description: 'Возврат инвестиций',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Удовлетворенность',
      value: '4.8/5',
      change: '+0.2',
      icon: '⭐',
      description: 'Средняя оценка',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      title: 'Эффективность',
      value: '92%',
      change: '+4.7%',
      icon: '⚡',
      description: 'Общая по клинике',
      color: 'from-teal-500 to-green-500'
    }
  ], []);

  // Mock данные для лучших врачей
  const topDoctors = useMemo(() => [
    { 
      name: 'Иванов А.С.', 
      specialty: 'Терапевт', 
      load: '92%', 
      patients: '18',
      revenue: '185,000 ₽',
      rating: 4.9,
      avatar: '👨‍⚕️'
    },
    { 
      name: 'Петрова М.И.', 
      specialty: 'Кардиолог', 
      load: '88%', 
      patients: '14',
      revenue: '234,000 ₽',
      rating: 4.8,
      avatar: '👩‍⚕️'
    },
    { 
      name: 'Сидоров В.П.', 
      specialty: 'Невролог', 
      load: '85%', 
      patients: '16',
      revenue: '198,000 ₽',
      rating: 4.7,
      avatar: '👨‍⚕️'
    },
  ], []);

  // Mock финансовые данные
  const financialData = useMemo(() => [
    { category: 'Консультации', amount: '650,000 ₽', trend: '+12%', percentage: 45, color: 'bg-blue-500' },
    { category: 'Анализы', amount: '320,000 ₽', trend: '+8%', percentage: 22, color: 'bg-green-500' },
    { category: 'Процедуры', amount: '230,000 ₽', trend: '+15%', percentage: 16, color: 'bg-purple-500' },
    { category: 'Диагностика', amount: '180,000 ₽', trend: '+6%', percentage: 12, color: 'bg-orange-500' },
    { category: 'Прочее', amount: '65,000 ₽', trend: '+3%', percentage: 5, color: 'bg-gray-500' }
  ], []);

  // Quick Actions с улучшенной структурой
  const quickActions = useMemo(() => [
    { icon: '📊', label: 'Аналитика', description: 'Детальные отчеты', color: 'from-blue-500 to-cyan-500', href: '/demo/medicine/owner/modules/analytics' },
    { icon: '💰', label: 'Финансы', description: 'Управление бюджетом', color: 'from-green-500 to-emerald-500', href: '/demo/medicine/owner/modules/finance' },
    { icon: '👥', label: 'Персонал', description: 'Управление штатом', color: 'from-purple-500 to-indigo-500', href: '/demo/medicine/owner/modules/staff' },
    { icon: '📋', label: 'Отчеты', description: 'Ежедневные сводки', color: 'from-orange-500 to-red-500', href: '/demo/medicine/owner/modules/reports' },
    { icon: '⚙️', label: 'Настройки', description: 'Конфигурация системы', color: 'from-gray-500 to-slate-500', href: '/demo/medicine/owner/modules/settings' }
  ], []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-4 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-2xl lg:text-3xl">
                {role.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl lg:text-3xl font-bold text-white mb-1 lg:mb-2 truncate">
                  {role.name}
                </h1>
                <p className="text-white/60 text-sm lg:text-base truncate">
                  {role.description}
                </p>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex bg-white/5 rounded-xl lg:rounded-2xl p-1 border border-white/10">
              {[
                { id: 'overview', label: 'Обзор', icon: '📊' },
                { id: 'analytics', label: 'Аналитика', icon: '📈' }
              ].map((view) => (
                <motion.button
                  key={view.id}
                  onClick={() => setActiveView(view.id as any)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-3 rounded-lg lg:rounded-xl text-sm font-medium transition-all ${
                    activeView === view.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-base">{view.icon}</span>
                  <span className="hidden sm:inline">{view.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Mobile Quick Actions */}
          <div className="lg:hidden mb-6">
            <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
              {quickActions.slice(0, 3).map((action, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={action.href}
                    className="inline-flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 min-w-20"
                  >
                    <span className="text-lg">{action.icon}</span>
                    <span className="text-white text-xs font-medium text-center leading-tight">
                      {action.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 lg:space-y-8"
            >
              {/* KPI Section */}
              <section>
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h2 className="text-lg lg:text-xl font-semibold text-white flex items-center gap-2">
                    <span>📈</span>
                    Ключевые показатели
                  </h2>
                  <span className="text-white/40 text-sm">Обновлено сегодня</span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
                  {kpiData.map((kpi, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <KPICard
                        title={kpi.title}
                        value={kpi.value}
                        change={kpi.change}
                        icon={kpi.icon}
                        description={kpi.description}
                        color={kpi.color}
                        trend="up"
                      />
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Quick Actions - Desktop */}
              <section className="hidden lg:block">
                <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 flex items-center gap-2">
                  <span>⚡</span>
                  Быстрые действия
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={action.href}
                        className="block p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 group"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform duration-200`}>
                          {action.icon}
                        </div>
                        <div className="text-white font-semibold text-sm lg:text-base mb-1">
                          {action.label}
                        </div>
                        <div className="text-white/60 text-xs lg:text-sm">
                          {action.description}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Performance Summary */}
              <section>
                <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 flex items-center gap-2">
                  <span>📊</span>
                  Сводка эффективности
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* Top Doctors */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 p-4 lg:p-6"
                  >
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <span>👨‍⚕️</span>
                      Лучшие врачи
                    </h3>
                    <div className="space-y-3">
                      {topDoctors.map((doctor, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-lg">
                              {doctor.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium text-sm truncate">
                                {doctor.name}
                              </div>
                              <div className="text-white/60 text-xs truncate">
                                {doctor.specialty}
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-3">
                            <div className="text-green-400 font-semibold text-sm">
                              {doctor.load}
                            </div>
                            <div className="text-white/60 text-xs">
                              {doctor.patients} пациентов
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Financial Overview */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 p-4 lg:p-6"
                  >
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <span>💰</span>
                      Финансовый обзор
                    </h3>
                    <div className="space-y-4">
                      {financialData.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-white/60 text-sm">{item.category}</div>
                            <div className="text-right">
                              <div className="text-white font-semibold text-sm">{item.amount}</div>
                              <div className="text-green-400 text-xs">{item.trend}</div>
                            </div>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Modules Grid */}
              <section>
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h2 className="text-lg lg:text-xl font-semibold text-white flex items-center gap-2">
                    <span>📁</span>
                    Модули аналитики
                  </h2>
                  <Link 
                    href="/demo/medicine/owner/modules"
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    Все модули →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {modules.slice(0, 3).map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <ModuleCard
                        module={module}
                        role="owner"
                        basePath="/demo/medicine/owner"
                        compact={true}
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeView === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 lg:space-y-8"
            >
              {/* Analytics Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                  <h3 className="font-semibold text-white mb-4">Аналитика доходов</h3>
                  <div className="text-white/60">
                    Детальная аналитика будет здесь...
                  </div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                  <h3 className="font-semibold text-white mb-4">Статистика пациентов</h3>
                  <div className="text-white/60">
                    Статистика по пациентам будет здесь...
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}