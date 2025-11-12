'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Mock данные для аналитики
const analyticsData = {
  summary: {
    totalPatients: 1245,
    totalAppointments: 2846,
    occupancyRate: 78,
    averageWaitTime: 12,
    noShowRate: 8.3,
    patientSatisfaction: 4.7
  },
  attendance: {
    daily: [
      { date: '2024-01-22', appointments: 42 },
      { date: '2024-01-23', appointments: 48 },
      { date: '2024-01-24', appointments: 56 },
      { date: '2024-01-25', appointments: 38 },
      { date: '2024-01-26', appointments: 52 },
      { date: '2024-01-27', appointments: 24 },
      { date: '2024-01-28', appointments: 18 }
    ]
  },
  revenue: {
    daily: [
      { date: '2024-01-22', amount: 156800 },
      { date: '2024-01-23', amount: 184200 },
      { date: '2024-01-24', amount: 215600 },
      { date: '2024-01-25', amount: 142300 },
      { date: '2024-01-26', amount: 198400 },
      { date: '2024-01-27', amount: 96800 },
      { date: '2024-01-28', amount: 72400 }
    ],
    bySpecialization: [
      { specialization: 'Терапия', revenue: 456200, appointments: 842, growth: 12.5 },
      { specialization: 'Кардиология', revenue: 389100, appointments: 324, growth: 8.3 },
      { specialization: 'Неврология', revenue: 284500, appointments: 298, growth: 15.7 },
      { specialization: 'Хирургия', revenue: 116000, appointments: 156, growth: 5.2 },
      { specialization: 'Офтальмология', revenue: 89200, appointments: 214, growth: 9.8 }
    ]
  },
  doctorsPerformance: [
    { doctorId: 1, doctorName: 'Петров А.В.', specialization: 'Терапевт', appointments: 186, occupancy: 92, revenue: 456200, satisfaction: 4.8, noShowRate: 4.2 },
    { doctorId: 2, doctorName: 'Сидорова М.И.', specialization: 'Кардиолог', appointments: 124, occupancy: 88, revenue: 389100, satisfaction: 4.9, noShowRate: 3.8 },
    { doctorId: 3, doctorName: 'Иванова Е.С.', specialization: 'Невролог', appointments: 98, occupancy: 85, revenue: 284500, satisfaction: 4.7, noShowRate: 6.1 },
    { doctorId: 4, doctorName: 'Козлов Д.Н.', specialization: 'Хирург', appointments: 56, occupancy: 78, revenue: 116000, satisfaction: 4.6, noShowRate: 8.4 },
    { doctorId: 5, doctorName: 'Николаев С.П.', specialization: 'Офтальмолог', appointments: 64, occupancy: 82, revenue: 89200, satisfaction: 4.8, noShowRate: 5.7 }
  ],
  patientDemographics: {
    byAge: [
      { group: '18-25', percentage: 12 },
      { group: '26-35', percentage: 24 },
      { group: '36-45', percentage: 32 },
      { group: '46-55', percentage: 18 },
      { group: '56+', percentage: 14 }
    ],
    byGender: [
      { gender: 'Мужчины', percentage: 42 },
      { gender: 'Женщины', percentage: 58 }
    ],
    byLocation: [
      { location: 'Центральный', percentage: 35 },
      { location: 'Северный', percentage: 22 },
      { location: 'Южный', percentage: 18 },
      { location: 'Западный', percentage: 15 },
      { location: 'Восточный', percentage: 10 }
    ]
  }
};

// Фиксированные названия дней недели для избежания гидратации
const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'patients'>('overview');
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const { summary, attendance, revenue, doctorsPerformance, patientDemographics } = analyticsData;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Форматирование чисел только на клиенте
  const formatNumber = (num: number) => {
    if (!isClient) return num.toString();
    return num.toLocaleString('ru-RU');
  };

  const formatCurrency = (amount: number) => {
    if (!isClient) return `${amount} ₽`;
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('₽', '₽');
  };

  // Получение дня недели по индексу (избегаем Date на сервере)
  const getWeekDay = (dateString: string, index: number) => {
    if (!isClient) return weekDays[index % 7]; // На сервере используем фиксированный массив
    return new Date(dateString).toLocaleDateString('ru-RU', { weekday: 'short' });
  };

  // Статистика для KPI карточек
  const kpiStats = useMemo(() => [
    {
      title: 'Пациенты',
      value: formatNumber(summary.totalPatients),
      change: '+12.5%',
      icon: '👥',
      color: 'from-blue-500 to-cyan-500',
      description: 'Активная база'
    },
    {
      title: 'Приёмы',
      value: formatNumber(summary.totalAppointments),
      change: '+8.2%',
      icon: '📅',
      color: 'from-green-500 to-emerald-500',
      description: 'За текущий период'
    },
    {
      title: 'Загрузка',
      value: `${summary.occupancyRate}%`,
      change: '+5.1%',
      icon: '📊',
      color: 'from-purple-500 to-indigo-500',
      description: 'Средняя по клинике'
    },
    {
      title: 'Ожидание',
      value: `${summary.averageWaitTime} мин`,
      change: '-2.3%',
      icon: '⏱️',
      color: 'from-yellow-500 to-amber-500',
      description: 'Среднее время'
    },
    {
      title: 'Неявки',
      value: `${summary.noShowRate}%`,
      change: '-1.2%',
      icon: '🚫',
      color: 'from-red-500 to-pink-500',
      description: 'Процент отмен'
    },
    {
      title: 'Удовлетворённость',
      value: `${summary.patientSatisfaction}/5`,
      change: '+0.3',
      icon: '⭐',
      color: 'from-orange-500 to-red-500',
      description: 'Средняя оценка'
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
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-2xl lg:text-3xl">
                📈
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl lg:text-3xl font-bold text-white mb-1 lg:mb-2 truncate">
                  Аналитика посещаемости
                </h1>
                <p className="text-white/60 text-sm lg:text-base truncate">
                  Статистика и аналитика работы медицинской клиники
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
              >
                <option value="week">За неделю</option>
                <option value="month">За месяц</option>
                <option value="quarter">За квартал</option>
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

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4">
            {kpiStats.map((stat, index) => (
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
                      {stat.title}
                    </h3>
                    <p className="text-lg lg:text-xl font-bold text-white mt-1 truncate">
                      {stat.value}
                    </p>
                    <p className="text-white/40 text-xs mt-1 truncate">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`text-xl lg:text-2xl ml-2 group-hover:scale-110 transition-transform duration-200 ${
                    stat.color.includes('blue') ? 'text-blue-400' :
                    stat.color.includes('green') ? 'text-green-400' :
                    stat.color.includes('purple') ? 'text-purple-400' :
                    stat.color.includes('yellow') ? 'text-yellow-400' :
                    stat.color.includes('red') ? 'text-red-400' : 'text-orange-400'
                  }`}>
                    {stat.icon}
                  </div>
                </div>
                <div className={`text-xs lg:text-sm ${
                  stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
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
          className="flex bg-white/5 rounded-xl lg:rounded-2xl p-1 border border-white/10 mb-4 lg:mb-6"
        >
          {[
            { value: 'overview', label: 'Обзор', icon: '📊' },
            { value: 'doctors', label: 'Врачи', icon: '👨‍⚕️' },
            { value: 'patients', label: 'Пациенты', icon: '👥' }
          ].map(({ value, label, icon }) => (
            <motion.button
              key={value}
              onClick={() => setActiveTab(value as any)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-3 rounded-lg lg:rounded-xl text-sm font-medium transition-all ${
                activeTab === value
                  ? 'bg-purple-500 text-white shadow-lg'
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
                {/* Revenue and Attendance Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* Revenue Chart */}
                  <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <span>💰</span>
                      Выручка по дням
                    </h3>
                    <div className="space-y-3">
                      {revenue.daily.map((day, index) => (
                        <motion.div
                          key={day.date}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                        >
                          <div className="text-white/60 text-sm w-16">
                            {getWeekDay(day.date, index)}
                          </div>
                          <div className="flex items-center gap-3 flex-1 max-w-48">
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(day.amount / 250000) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-white font-medium text-sm w-16 text-right">
                            {formatCurrency(day.amount)}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Attendance Chart */}
                  <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <span>📊</span>
                      Посещаемость по дням
                    </h3>
                    <div className="space-y-3">
                      {attendance.daily.map((day, index) => (
                        <motion.div
                          key={day.date}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                        >
                          <div className="text-white/60 text-sm w-16">
                            {getWeekDay(day.date, index)}
                          </div>
                          <div className="flex items-center gap-3 flex-1 max-w-48">
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(day.appointments / 60) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-white font-medium text-sm w-16 text-right">
                            {day.appointments}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Specialization Revenue */}
                <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span>🏥</span>
                    Выручка по специализациям
                  </h3>
                  <div className="space-y-3">
                    {revenue.bySpecialization.map((spec, index) => (
                      <motion.div
                        key={spec.specialization}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-3 h-3 rounded-full bg-blue-500 group-hover:scale-125 transition-transform duration-200" />
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium text-sm truncate">
                              {spec.specialization}
                            </div>
                            <div className="text-white/60 text-xs truncate">
                              {spec.appointments} приёмов
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-3">
                          <div className="text-white font-medium text-sm">
                            {formatCurrency(spec.revenue)}
                          </div>
                          <div className={`text-xs ${spec.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {spec.growth > 0 ? '+' : ''}{spec.growth}%
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'doctors' && (
              <div className="space-y-4 lg:space-y-6">
                {/* Doctors Performance */}
                <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl overflow-hidden">
                  <div className="p-4 lg:p-6 border-b border-white/10">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <span>👨‍⚕️</span>
                      Эффективность врачей
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="min-w-full">
                      {/* Mobile View */}
                      <div className="lg:hidden space-y-3 p-4">
                        {doctorsPerformance.map((doctor) => (
                          <motion.div
                            key={doctor.doctorId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
                            onClick={() => setSelectedDoctor(selectedDoctor === doctor.doctorId.toString() ? null : doctor.doctorId.toString())}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <div className="text-white font-medium text-sm truncate">
                                  {doctor.doctorName}
                                </div>
                                <div className="text-white/60 text-xs truncate">
                                  {doctor.specialization}
                                </div>
                              </div>
                              <motion.span
                                animate={{ rotate: selectedDoctor === doctor.doctorId.toString() ? 180 : 0 }}
                                className="text-white/40"
                              >
                                ↓
                              </motion.span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <div className="text-white/60">Приёмы</div>
                                <div className="text-white font-medium">{doctor.appointments}</div>
                              </div>
                              <div>
                                <div className="text-white/60">Загрузка</div>
                                <div className="text-white font-medium">{doctor.occupancy}%</div>
                              </div>
                              <div>
                                <div className="text-white/60">Выручка</div>
                                <div className="text-white font-medium">{formatCurrency(doctor.revenue)}</div>
                              </div>
                              <div>
                                <div className="text-white/60">Рейтинг</div>
                                <div className="text-yellow-400 font-medium">{doctor.satisfaction}/5</div>
                              </div>
                            </div>

                            <AnimatePresence>
                              {selectedDoctor === doctor.doctorId.toString() && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="mt-3 pt-3 border-t border-white/10"
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="text-white/60 text-xs">Неявки:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      doctor.noShowRate <= 5 
                                        ? 'bg-green-500/20 text-green-400' 
                                        : doctor.noShowRate <= 10
                                        ? 'bg-yellow-500/20 text-yellow-400'
                                        : 'bg-red-500/20 text-red-400'
                                    }`}>
                                      {doctor.noShowRate}%
                                    </span>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </div>

                      {/* Desktop View */}
                      <table className="hidden lg:table w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left p-4 text-white/60 text-sm font-medium">Врач</th>
                            <th className="text-left p-4 text-white/60 text-sm font-medium">Приёмы</th>
                            <th className="text-left p-4 text-white/60 text-sm font-medium">Загрузка</th>
                            <th className="text-left p-4 text-white/60 text-sm font-medium">Выручка</th>
                            <th className="text-left p-4 text-white/60 text-sm font-medium">Рейтинг</th>
                            <th className="text-left p-4 text-white/60 text-sm font-medium">Неявки</th>
                          </tr>
                        </thead>
                        <tbody>
                          {doctorsPerformance.map((doctor) => (
                            <tr key={doctor.doctorId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="p-4">
                                <div>
                                  <div className="text-white font-medium">{doctor.doctorName}</div>
                                  <div className="text-white/60 text-sm">{doctor.specialization}</div>
                                </div>
                              </td>
                              <td className="p-4 text-white">{doctor.appointments}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-white/10 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                                      style={{ width: `${doctor.occupancy}%` }}
                                    />
                                  </div>
                                  <span className="text-white text-sm">{doctor.occupancy}%</span>
                                </div>
                              </td>
                              <td className="p-4 text-white font-medium">{formatCurrency(doctor.revenue)}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-1">
                                  <span className="text-yellow-400">⭐</span>
                                  <span className="text-white">{doctor.satisfaction}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  doctor.noShowRate <= 5 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : doctor.noShowRate <= 10
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {doctor.noShowRate}%
                                </span>
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

            {activeTab === 'patients' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Age Distribution */}
                <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span>📊</span>
                    Распределение по возрасту
                  </h3>
                  <div className="space-y-3">
                    {patientDemographics.byAge.map((ageGroup, index) => (
                      <motion.div
                        key={ageGroup.group}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                      >
                        <span className="text-white/60 text-sm">{ageGroup.group}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-20 bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${ageGroup.percentage}%` }}
                            />
                          </div>
                          <span className="text-white font-medium text-sm w-8">{ageGroup.percentage}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Gender Distribution */}
                <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span>👥</span>
                    Распределение по полу
                  </h3>
                  <div className="space-y-3">
                    {patientDemographics.byGender.map((gender, index) => (
                      <motion.div
                        key={gender.gender}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                      >
                        <span className="text-white/60 text-sm">{gender.gender}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-20 bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${gender.percentage}%` }}
                            />
                          </div>
                          <span className="text-white font-medium text-sm w-8">{gender.percentage}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Location Distribution */}
                <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span>🗺️</span>
                    Распределение по районам
                  </h3>
                  <div className="space-y-3">
                    {patientDemographics.byLocation.map((location, index) => (
                      <motion.div
                        key={location.location}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                      >
                        <span className="text-white/60 text-sm">{location.location}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-20 bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${location.percentage}%` }}
                            />
                          </div>
                          <span className="text-white font-medium text-sm w-8">{location.percentage}%</span>
                        </div>
                      </motion.div>
                    ))}
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
                Экспорт отчётов
              </h3>
              <p className="text-white/60 text-sm">
                Скачайте детальные отчёты для дальнейшего анализа
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
                className="px-4 py-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-sm font-medium text-white flex items-center gap-2"
              >
                <span>📋</span>
                <span>Полный отчёт</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}