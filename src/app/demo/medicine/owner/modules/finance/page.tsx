'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Mock данные для финансов
const financeData = {
  summary: {
    totalRevenue: 4256800,
    totalExpenses: 1985200,
    netProfit: 2271600,
    profitMargin: 53.4,
    monthlyGrowth: 12.5,
    averageTransaction: 3420,
    cashFlow: 1856400,
    accountsReceivable: 856200
  },
  revenue: {
    monthly: [
      { month: 'Янв 24', revenue: 4256800, growth: 12.5, target: 3800000 },
      { month: 'Дек 23', revenue: 3854200, growth: 8.3, target: 3600000 },
      { month: 'Ноя 23', revenue: 3568200, growth: 5.9, target: 3500000 },
      { month: 'Окт 23', revenue: 4125600, growth: 15.2, target: 3700000 },
      { month: 'Сен 23', revenue: 3689400, growth: 9.7, target: 3500000 }
    ],
    byCategory: [
      { category: 'Консультации', amount: 1856200, percentage: 43.6, growth: 10.2 },
      { category: 'Диагностика', amount: 1258400, percentage: 29.6, growth: 15.7 },
      { category: 'Процедуры', amount: 756300, percentage: 17.8, growth: 8.4 },
      { category: 'Анализы', amount: 285900, percentage: 6.7, growth: 12.3 },
      { category: 'Хирургия', amount: 98500, percentage: 2.3, growth: 5.8 }
    ],
    bySpecialization: [
      { specialization: 'Терапия', amount: 1256800, percentage: 29.5, patients: 456 },
      { specialization: 'Кардиология', amount: 985400, percentage: 23.1, patients: 298 },
      { specialization: 'Неврология', amount: 756200, percentage: 17.8, patients: 264 },
      { specialization: 'Офтальмология', amount: 542300, percentage: 12.7, patients: 156 },
      { specialization: 'Стоматология', amount: 418900, percentage: 9.8, patients: 142 },
      { specialization: 'Другие', amount: 298200, percentage: 7.0, patients: 86 }
    ]
  },
  expenses: {
    monthly: [
      { month: 'Янв 24', amount: 1985200, percentage: 46.6, budget: 1850000 },
      { month: 'Дек 23', amount: 1823400, percentage: 47.3, budget: 1750000 },
      { month: 'Ноя 23', amount: 1689500, percentage: 47.4, budget: 1650000 },
      { month: 'Окт 23', amount: 1956800, percentage: 47.4, budget: 1800000 },
      { month: 'Сен 23', amount: 1748200, percentage: 47.4, budget: 1700000 }
    ],
    byCategory: [
      { category: 'Зарплаты', amount: 1256800, percentage: 63.3, trend: 'up' },
      { category: 'Медикаменты', amount: 285400, percentage: 14.4, trend: 'stable' },
      { category: 'Аренда', amount: 185200, percentage: 9.3, trend: 'stable' },
      { category: 'Оборудование', amount: 156800, percentage: 7.9, trend: 'down' },
      { category: 'Маркетинг', amount: 85600, percentage: 4.3, trend: 'up' },
      { category: 'Прочие', amount: 38400, percentage: 1.9, trend: 'stable' }
    ],
    byDepartment: [
      { department: 'Терапия', amount: 456200, percentage: 23.0, efficiency: 85 },
      { department: 'Кардиология', amount: 389100, percentage: 19.6, efficiency: 88 },
      { department: 'Неврология', amount: 284500, percentage: 14.3, efficiency: 82 },
      { department: 'Диагностика', amount: 425600, percentage: 21.4, efficiency: 78 },
      { department: 'Администрация', amount: 285400, percentage: 14.4, efficiency: 92 },
      { department: 'Прочие', amount: 144400, percentage: 7.3, efficiency: 75 }
    ]
  },
  cashFlow: {
    monthly: [
      { month: 'Янв 24', income: 4256800, expenses: 1985200, net: 2271600 },
      { month: 'Дек 23', income: 3854200, expenses: 1823400, net: 2030800 },
      { month: 'Ноя 23', income: 3568200, expenses: 1689500, net: 1878700 },
      { month: 'Окт 23', income: 4125600, expenses: 1956800, net: 2168800 },
      { month: 'Сен 23', income: 3689400, expenses: 1748200, net: 1941200 }
    ],
    forecast: [
      { period: 'Фев 24', expected: 2350000, confidence: 85 },
      { period: 'Мар 24', expected: 2480000, confidence: 82 },
      { period: 'Апр 24', expected: 2420000, confidence: 78 },
      { period: 'Май 24', expected: 2650000, confidence: 80 }
    ]
  },
  financialHealth: {
    metrics: [
      { name: 'Рентабельность', value: 53.4, target: 45, status: 'excellent' },
      { name: 'Ликвидность', value: 2.8, target: 1.5, status: 'good' },
      { name: 'Оборачиваемость', value: 4.2, target: 3.5, status: 'good' },
      { name: 'Долг/Капитал', value: 0.3, target: 0.5, status: 'excellent' }
    ],
    alerts: [
      { type: 'warning', message: 'Увеличились расходы на медикаменты на 15%', date: '2024-01-24' },
      { type: 'info', message: 'Высокая оборачиваемость дебиторской задолженности', date: '2024-01-23' },
      { type: 'success', message: 'Целевые показатели рентабельности достигнуты', date: '2024-01-22' }
    ]
  },
  transactions: {
    recent: [
      { id: 1, date: '2024-01-24', description: 'Консультация терапевта', amount: 2500, type: 'income', category: 'Консультации' },
      { id: 2, date: '2024-01-24', description: 'ЭКГ диагностика', amount: 1800, type: 'income', category: 'Диагностика' },
      { id: 3, date: '2024-01-24', description: 'Зарплата персонала', amount: -856200, type: 'expense', category: 'Зарплаты' },
      { id: 4, date: '2024-01-23', description: 'Закупка медикаментов', amount: -125400, type: 'expense', category: 'Медикаменты' },
      { id: 5, date: '2024-01-23', description: 'Консультация кардиолога', amount: 3200, type: 'income', category: 'Консультации' },
      { id: 6, date: '2024-01-23', description: 'УЗИ исследование', amount: 2800, type: 'income', category: 'Диагностика' },
      { id: 7, date: '2024-01-22', description: 'Аренда помещения', amount: -185200, type: 'expense', category: 'Аренда' }
    ]
  }
};

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'expenses' | 'cashflow' | 'transactions'>('overview');
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [isClient, setIsClient] = useState(false);

  const { summary, revenue, expenses, cashFlow, financialHealth, transactions } = financeData;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Форматирование валюты
  const formatCurrency = (amount: number) => {
    if (!isClient) return `${amount} ₽`;
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('₽', '₽');
  };

  const formatCompactCurrency = (amount: number) => {
    if (Math.abs(amount) >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M ₽`;
    }
    if (Math.abs(amount) >= 1000) {
      return `${(amount / 1000).toFixed(0)}K ₽`;
    }
    return formatCurrency(amount);
  };

  // Основные финансовые показатели
  const financialMetrics = useMemo(() => [
    {
      title: 'Общая выручка',
      value: formatCompactCurrency(summary.totalRevenue),
      change: `+${summary.monthlyGrowth}%`,
      icon: '💰',
      color: 'from-green-500 to-emerald-500',
      description: 'За текущий месяц'
    },
    {
      title: 'Чистая прибыль',
      value: formatCompactCurrency(summary.netProfit),
      change: `+${summary.monthlyGrowth}%`,
      icon: '📈',
      color: 'from-blue-500 to-cyan-500',
      description: `Маржа: ${summary.profitMargin}%`
    },
    {
      title: 'Операционные расходы',
      value: formatCompactCurrency(summary.totalExpenses),
      change: '+8.2%',
      icon: '📊',
      color: 'from-orange-500 to-red-500',
      description: `${((summary.totalExpenses / summary.totalRevenue) * 100).toFixed(1)}% от выручки`
    },
    {
      title: 'Денежный поток',
      value: formatCompactCurrency(summary.cashFlow),
      change: '+15.3%',
      icon: '💸',
      color: 'from-purple-500 to-indigo-500',
      description: 'Операционный поток'
    },
    {
      title: 'Дебиторская задолженность',
      value: formatCompactCurrency(summary.accountsReceivable),
      change: '-5.7%',
      icon: '📋',
      color: 'from-yellow-500 to-amber-500',
      description: 'К получению'
    },
    {
      title: 'Средний чек',
      value: formatCurrency(summary.averageTransaction),
      change: '+3.2%',
      icon: '🎫',
      color: 'from-pink-500 to-rose-500',
      description: 'На пациента'
    }
  ], [summary, isClient]);

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
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center text-2xl lg:text-3xl">
                💰
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl lg:text-3xl font-bold text-white mb-1 lg:mb-2 truncate">
                  Финансовый анализ
                </h1>
                <p className="text-white/60 text-sm lg:text-base truncate">
                  Управление финансами и аналитика доходов медицинской клиники
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50"
              >
                <option value="month">За месяц</option>
                <option value="quarter">За квартал</option>
                <option value="year">За год</option>
              </select>
              
              <Link
                href="/demo/medicine/owner"
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 text-sm font-medium text-white flex items-center justify-center gap-2"
              >
                <span>←</span>
                <span>Назад</span>
              </Link>
            </div>
          </div>

          {/* Financial Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4">
            {financialMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-3 lg:p-4 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white/60 text-xs lg:text-sm font-medium truncate">
                      {metric.title}
                    </h3>
                    <p className="text-lg lg:text-xl font-bold text-white mt-1 truncate">
                      {metric.value}
                    </p>
                    <p className="text-white/40 text-xs mt-1 truncate">
                      {metric.description}
                    </p>
                  </div>
                  <div className={`text-xl lg:text-2xl ml-2 group-hover:scale-110 transition-transform duration-200 ${
                    metric.color.includes('green') ? 'text-green-400' :
                    metric.color.includes('blue') ? 'text-blue-400' :
                    metric.color.includes('orange') ? 'text-orange-400' :
                    metric.color.includes('purple') ? 'text-purple-400' :
                    metric.color.includes('yellow') ? 'text-yellow-400' : 'text-pink-400'
                  }`}>
                    {metric.icon}
                  </div>
                </div>
                <div className={`text-xs lg:text-sm ${
                  metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.change}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex bg-white/5 rounded-xl lg:rounded-2xl p-1 border border-white/10 mb-4 lg:mb-6 overflow-x-auto"
        >
          {[
            { value: 'overview', label: 'Обзор', icon: '📊' },
            { value: 'revenue', label: 'Доходы', icon: '💰' },
            { value: 'expenses', label: 'Расходы', icon: '📉' },
            { value: 'cashflow', label: 'Кэш-флоу', icon: '💸' },
            { value: 'transactions', label: 'Транзакции', icon: '🧾' }
          ].map(({ value, label, icon }) => (
            <motion.button
              key={value}
              onClick={() => setActiveTab(value as any)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-3 rounded-lg lg:rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === value
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{icon}</span>
              <span className="hidden sm:inline">{label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-4 lg:space-y-6">
                {/* Revenue vs Expenses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* Monthly Revenue */}
                  <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <span>💰</span>
                      Динамика выручки
                    </h3>
                    <div className="space-y-3">
                      {revenue.monthly.map((month, index) => (
                        <motion.div
                          key={month.month}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                        >
                          <div className="text-white/60 text-sm w-16">
                            {month.month}
                          </div>
                          <div className="flex items-center gap-3 flex-1 max-w-48">
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(month.revenue / 4500000) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-right ml-3">
                            <div className="text-white font-medium text-sm">
                              {formatCompactCurrency(month.revenue)}
                            </div>
                            <div className={`text-xs ${month.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {month.growth > 0 ? '+' : ''}{month.growth}%
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Expense Breakdown */}
                  <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <span>📊</span>
                      Структура расходов
                    </h3>
                    <div className="space-y-3">
                      {expenses.byCategory.map((category, index) => (
                        <motion.div
                          key={category.category}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-3 h-3 rounded-full bg-orange-500" />
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium text-sm truncate">
                                {category.category}
                              </div>
                              <div className="text-white/60 text-xs truncate">
                                {category.percentage}%
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-medium text-sm">
                            {formatCompactCurrency(category.amount)}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Financial Health & Recent Transactions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* Financial Health */}
                  <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <span>❤️</span>
                      Финансовое здоровье
                    </h3>
                    <div className="space-y-3">
                      {financialHealth.metrics.map((metric, index) => (
                        <motion.div
                          key={metric.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium text-sm">
                              {metric.name}
                            </div>
                            <div className="text-white/60 text-xs">
                              Цель: {metric.target}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-white font-medium text-sm">
                              {metric.value}
                            </div>
                            <div className={`w-2 h-2 rounded-full ${
                              metric.status === 'excellent' ? 'bg-green-500' :
                              metric.status === 'good' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Transactions */}
                  <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <span>🧾</span>
                      Последние транзакции
                    </h3>
                    <div className="space-y-2">
                      {transactions.recent.slice(0, 5).map((transaction, index) => (
                        <motion.div
                          key={transaction.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium text-sm truncate">
                              {transaction.description}
                            </div>
                            <div className="text-white/60 text-xs">
                              {new Date(transaction.date).toLocaleDateString('ru-RU')} • {transaction.category}
                            </div>
                          </div>
                          <div className={`text-sm font-medium ${
                            transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {transaction.type === 'income' ? '+' : ''}{formatCurrency(transaction.amount)}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'revenue' && (
              <div className="space-y-4 lg:space-y-6">
                {/* Revenue by Category */}
                <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span>📁</span>
                    Выручка по категориям услуг
                  </h3>
                  <div className="space-y-3">
                    {revenue.byCategory.map((category, index) => (
                      <motion.div
                        key={category.category}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium text-sm truncate">
                              {category.category}
                            </div>
                            <div className="text-white/60 text-xs truncate">
                              {category.percentage}% от общей выручки
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-3">
                          <div className="text-white font-medium text-sm">
                            {formatCompactCurrency(category.amount)}
                          </div>
                          <div className={`text-xs ${category.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {category.growth > 0 ? '+' : ''}{category.growth}%
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Revenue by Specialization */}
                <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span>🏥</span>
                    Выручка по специализациям
                  </h3>
                  <div className="space-y-3">
                    {revenue.bySpecialization.map((spec, index) => (
                      <motion.div
                        key={spec.specialization}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-medium text-white">
                            {spec.patients}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium text-sm truncate">
                              {spec.specialization}
                            </div>
                            <div className="text-white/60 text-xs truncate">
                              {spec.patients} пациентов
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-3">
                          <div className="text-white font-medium text-sm">
                            {formatCompactCurrency(spec.amount)}
                          </div>
                          <div className="text-white/60 text-xs">
                            {spec.percentage}%
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'expenses' && (
              <div className="space-y-4 lg:space-y-6">
                {/* Expenses by Category */}
                <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span>📊</span>
                    Расходы по категориям
                  </h3>
                  <div className="space-y-3">
                    {expenses.byCategory.map((category, index) => (
                      <motion.div
                        key={category.category}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-3 h-3 rounded-full ${
                            category.trend === 'up' ? 'bg-red-500' :
                            category.trend === 'down' ? 'bg-green-500' : 'bg-yellow-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium text-sm truncate">
                              {category.category}
                            </div>
                            <div className="text-white/60 text-xs truncate">
                              {category.percentage}% от общих расходов
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-3">
                          <div className="text-white font-medium text-sm">
                            {formatCompactCurrency(category.amount)}
                          </div>
                          <div className={`text-xs ${
                            category.trend === 'down' ? 'text-green-400' :
                            category.trend === 'up' ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {category.trend === 'up' ? '↑' : category.trend === 'down' ? '↓' : '→'}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Expenses by Department */}
                <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span>🏢</span>
                    Расходы по отделениям
                  </h3>
                  <div className="space-y-3">
                    {expenses.byDepartment.map((dept, index) => (
                      <motion.div
                        key={dept.department}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-medium text-white">
                            {dept.efficiency}%
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium text-sm truncate">
                              {dept.department}
                            </div>
                            <div className="text-white/60 text-xs truncate">
                              Эффективность: {dept.efficiency}%
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-3">
                          <div className="text-white font-medium text-sm">
                            {formatCompactCurrency(dept.amount)}
                          </div>
                          <div className="text-white/60 text-xs">
                            {dept.percentage}%
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cashflow' && (
              <div className="space-y-4 lg:space-y-6">
                {/* Cash Flow History */}
                <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span>📈</span>
                    История денежного потока
                  </h3>
                  <div className="space-y-3">
                    {cashFlow.monthly.map((month, index) => (
                      <motion.div
                        key={month.month}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                      >
                        <div className="text-white/60 text-sm w-16">
                          {month.month}
                        </div>
                        <div className="flex items-center gap-4 flex-1 max-w-64">
                          <div className="flex-1">
                            <div className="text-green-400 text-xs">Доходы</div>
                            <div className="text-white text-sm font-medium">
                              {formatCompactCurrency(month.income)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-red-400 text-xs">Расходы</div>
                            <div className="text-white text-sm font-medium">
                              {formatCompactCurrency(month.expenses)}
                            </div>
                          </div>
                        </div>
                        <div className={`text-right ${
                          month.net > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          <div className="font-medium text-sm">
                            {formatCompactCurrency(month.net)}
                          </div>
                          <div className="text-xs">
                            {month.net > 0 ? 'Прибыль' : 'Убыток'}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Cash Flow Forecast */}
                <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span>🔮</span>
                    Прогноз денежного потока
                  </h3>
                  <div className="space-y-3">
                    {cashFlow.forecast.map((forecast, index) => (
                      <motion.div
                        key={forecast.period}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                      >
                        <div className="text-white/60 text-sm w-16">
                          {forecast.period}
                        </div>
                        <div className="flex items-center gap-3 flex-1 max-w-48">
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${forecast.confidence}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right ml-3">
                          <div className="text-white font-medium text-sm">
                            {formatCompactCurrency(forecast.expected)}
                          </div>
                          <div className="text-blue-400 text-xs">
                            {forecast.confidence}% уверенность
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="space-y-4 lg:space-y-6">
                {/* All Transactions */}
                <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl overflow-hidden">
                  <div className="p-4 lg:p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        <span>🧾</span>
                        Все транзакции
                      </h3>
                      <span className="text-white/60 text-sm">{transactions.recent.length} операций</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="min-w-full">
                      {/* Mobile View */}
                      <div className="lg:hidden space-y-2 p-4">
                        {transactions.recent.map((transaction) => (
                          <motion.div
                            key={transaction.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <div className="text-white font-medium text-sm truncate">
                                  {transaction.description}
                                </div>
                                <div className="text-white/60 text-xs truncate">
                                  {new Date(transaction.date).toLocaleDateString('ru-RU')} • {transaction.category}
                                </div>
                              </div>
                              <div className={`text-sm font-medium ml-2 ${
                                transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {transaction.type === 'income' ? '+' : ''}{formatCurrency(transaction.amount)}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Desktop View */}
                      <table className="hidden lg:table w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left p-4 text-white/60 text-sm font-medium">Дата</th>
                            <th className="text-left p-4 text-white/60 text-sm font-medium">Описание</th>
                            <th className="text-left p-4 text-white/60 text-sm font-medium">Категория</th>
                            <th className="text-left p-4 text-white/60 text-sm font-medium">Тип</th>
                            <th className="text-right p-4 text-white/60 text-sm font-medium">Сумма</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.recent.map((transaction) => (
                            <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="p-4 text-white/60 text-sm">
                                {new Date(transaction.date).toLocaleDateString('ru-RU')}
                              </td>
                              <td className="p-4">
                                <div className="text-white font-medium">{transaction.description}</div>
                              </td>
                              <td className="p-4 text-white/60 text-sm">{transaction.category}</td>
                              <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  transaction.type === 'income' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {transaction.type === 'income' ? 'Доход' : 'Расход'}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className={`font-medium ${
                                  transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {transaction.type === 'income' ? '+' : ''}{formatCurrency(transaction.amount)}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 lg:mt-8 bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <span>📤</span>
                Экспорт финансовых отчётов
              </h3>
              <p className="text-white/60 text-sm">
                Скачайте детальные финансовые отчёты для бухгалтерии и анализа
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 text-sm font-medium text-white flex items-center gap-2"
              >
                <span>📊</span>
                <span>Excel</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 text-sm font-medium text-white flex items-center gap-2"
              >
                <span>📄</span>
                <span>PDF</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-sm font-medium text-white flex items-center gap-2"
              >
                <span>📋</span>
                <span>Финансовый отчёт</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}