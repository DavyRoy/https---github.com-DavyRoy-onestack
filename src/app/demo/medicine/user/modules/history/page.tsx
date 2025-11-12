'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { medicalHistory, healthMetrics, MedicalRecord, recentLabResults } from './demo-data';
import { InteractiveCard } from '@/components/medicine/InteractiveCard';

// Helper function for consistent date formatting
const formatDateSafe = (dateString: string, options: Intl.DateTimeFormatOptions = {}) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'short',
    ...options
  });
};

// Simple date format without locale variations
const formatDateSimple = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export default function HistoryPage() {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'scheduled' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'timeline' | 'grid'>('timeline');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [isClient, setIsClient] = useState(false);

  // Set client flag to avoid hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Получаем уникальные года из медицинской истории
  const availableYears = useMemo(() => {
    const years = medicalHistory.map(record => new Date(record.date).getFullYear());
    return ['all', ...Array.from(new Set(years))].sort((a, b) => {
      if (a === 'all') return -1;
      if (b === 'all') return 1;
      return Number(b) - Number(a);
    });
  }, []);

  const filteredRecords = useMemo(() => {
    return medicalHistory.filter(record => {
      const matchesFilter = filter === 'all' || record.status === filter;
      const matchesSearch = record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = selectedYear === 'all' || 
                         new Date(record.date).getFullYear().toString() === selectedYear;
      
      return matchesFilter && matchesSearch && matchesYear;
    });
  }, [filter, searchTerm, selectedYear]);

  const sortedRecords = useMemo(() => 
    [...filteredRecords].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ), [filteredRecords]
  );

  // Статистика для dashboard
  const stats = useMemo(() => ({
    total: medicalHistory.length,
    completed: medicalHistory.filter(r => r.status === 'completed').length,
    scheduled: medicalHistory.filter(r => r.status === 'scheduled').length,
    prescriptions: medicalHistory.reduce((acc, curr) => acc + curr.prescriptions.length, 0),
    currentYear: medicalHistory.filter(r => 
      new Date(r.date).getFullYear() === new Date().getFullYear()
    ).length
  }), []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'scheduled': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'cancelled': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Завершён';
      case 'scheduled': return 'Запланирован';
      case 'cancelled': return 'Отменён';
      default: return 'Неизвестно';
    }
  };

  const getSpecializationIcon = (spec: string) => {
    const icons: Record<string, string> = {
      'Терапевт': '👨‍⚕️',
      'Кардиолог': '❤️',
      'Невролог': '🧠',
      'Офтальмолог': '👁️',
      'Стоматолог': '🦷',
      'Дерматолог': '🔬',
      'Педиатр': '👶',
      'Хирург': '🔪',
      'Гастроэнтеролог': '🍽️',
      'Эндокринолог': '🦋',
      'Отоларинголог': '👂',
      'Уролог': '💧',
      'Гинеколог': '🌸',
      'Ортопед': '🦴',
      'Психиатр': '🧠',
      'Психолог': '💭',
      'Диетолог': '🥗',
      'Физиотерапевт': '💪'
    };
    return icons[spec] || '👨‍⚕️';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Safe date formatting that works on both server and client
  const renderDate = (dateString: string, type: 'full' | 'simple' = 'full') => {
    if (!isClient) {
      // Server-side rendering - use simple format to avoid hydration mismatches
      return formatDateSimple(dateString);
    }
    
    // Client-side rendering - use full format with locale
    if (type === 'simple') {
      return formatDateSimple(dateString);
    }
    
    return formatDateSafe(dateString, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href="/demo/medicine/user"
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200 text-sm"
                >
                  <span className="text-lg">←</span>
                  <span>Назад к дашборду</span>
                </Link>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">История приёмов</h1>
              <p className="text-white/60 text-sm lg:text-base">
                Полная медицинская история и результаты обследований
              </p>
            </div>

            {/* View Toggle and Filters - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* View Toggle */}
              <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1">
                <button
                  onClick={() => setActiveView('timeline')}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeView === 'timeline' 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  📋 Список
                </button>
                <button
                  onClick={() => setActiveView('grid')}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeView === 'grid' 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  🏷️ Плитки
                </button>
              </div>

              {/* Search Input */}
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Поиск по врачу, диагнозу..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40">
                  🔍
                </span>
              </div>
            </div>
          </div>

          {/* Filters Row - Improved Mobile Layout */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'completed', 'scheduled', 'cancelled'] as const).map((status) => (
                <motion.button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-2 rounded-2xl text-sm font-medium border transition-all duration-200 ${
                    filter === status
                      ? status === 'all' 
                        ? 'bg-white/20 text-white border-white/30'
                        : getStatusColor(status)
                      : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {status === 'all' && 'Все'}
                  {status === 'completed' && '✅ Завершённые'}
                  {status === 'scheduled' && '📅 Запланированные'}
                  {status === 'cancelled' && '❌ Отменённые'}
                </motion.button>
              ))}
            </div>

            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
            >
              {availableYears.map(year => (
                <option key={year} value={year} className="bg-slate-800">
                  {year === 'all' ? 'Все года' : year}
                </option>
              ))}
            </select>
          </div>

          {/* Stats Overview - Improved Mobile Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 mb-6">
            <InteractiveCard className="p-3 lg:p-4 text-center">
              <div className="text-lg lg:text-2xl font-bold text-white mb-1">{stats.total}</div>
              <div className="text-white/60 text-xs lg:text-sm">Всего приёмов</div>
            </InteractiveCard>
            <InteractiveCard className="p-3 lg:p-4 text-center bg-green-500/10 border-green-500/20">
              <div className="text-lg lg:text-2xl font-bold text-green-400 mb-1">{stats.completed}</div>
              <div className="text-green-400/60 text-xs lg:text-sm">Завершённые</div>
            </InteractiveCard>
            <InteractiveCard className="p-3 lg:p-4 text-center bg-blue-500/10 border-blue-500/20">
              <div className="text-lg lg:text-2xl font-bold text-blue-400 mb-1">{stats.scheduled}</div>
              <div className="text-blue-400/60 text-xs lg:text-sm">Запланированные</div>
            </InteractiveCard>
            <InteractiveCard className="p-3 lg:p-4 text-center bg-purple-500/10 border-purple-500/20">
              <div className="text-lg lg:text-2xl font-bold text-purple-400 mb-1">{stats.prescriptions}</div>
              <div className="text-purple-400/60 text-xs lg:text-sm">Назначений</div>
            </InteractiveCard>
            <InteractiveCard className="p-3 lg:p-4 text-center bg-orange-500/10 border-orange-500/20">
              <div className="text-lg lg:text-2xl font-bold text-orange-400 mb-1">{stats.currentYear}</div>
              <div className="text-orange-400/60 text-xs lg:text-sm">В этом году</div>
            </InteractiveCard>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeView === 'timeline' ? (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 lg:space-y-6"
                >
                  {sortedRecords.map((record, index) => (
                    <motion.div
                      key={record.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                    >
                      <InteractiveCard 
                        className="p-4 lg:p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                        onClick={() => setSelectedRecord(record)}
                      >
                        <div className="flex items-start gap-3 lg:gap-4">
                          {/* Timeline Line */}
                          <div className="flex flex-col items-center pt-1">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center text-base lg:text-lg">
                              {getSpecializationIcon(record.specialization)}
                            </div>
                            {index < sortedRecords.length - 1 && (
                              <div className="w-0.5 h-8 lg:h-16 bg-white/10 mt-2" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Header with improved mobile layout */}
                            <div className="flex flex-col gap-3 mb-3 lg:mb-4">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white text-base lg:text-lg mb-1 line-clamp-1">
                                  {record.doctorName}
                                </h3>
                                <p className="text-white/60 text-sm">{record.specialization}</p>
                              </div>
                              
                              {/* Status and Visit Type - Stacked on mobile */}
                              <div className="flex flex-col xs:flex-row gap-2">
                                <span className={`px-2 lg:px-3 py-1 rounded-lg text-xs border ${getStatusColor(record.status)} whitespace-nowrap`}>
                                  {getStatusText(record.status)}
                                </span>
                                <span className={`px-2 lg:px-3 py-1 rounded-lg text-xs border ${
                                  record.visitType === 'in-person' 
                                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                    : 'bg-green-500/20 text-green-400 border-green-500/30'
                                } whitespace-nowrap`}>
                                  {record.visitType === 'in-person' ? '🏥 Очно' : '📞 Онлайн'}
                                </span>
                              </div>
                            </div>

                            {/* Details Grid - Improved mobile layout */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mb-3 lg:mb-4">
                              <div>
                                <div className="text-xs lg:text-sm text-white/60 mb-1">Дата приёма</div>
                                <div className="text-white font-medium text-sm lg:text-base">
                                  {renderDate(record.date)}
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-xs lg:text-sm text-white/60 mb-1">Диагноз</div>
                                <div className="text-white font-medium text-sm lg:text-base line-clamp-1">
                                  {record.diagnosis}
                                </div>
                              </div>
                            </div>

                            {record.symptoms && (
                              <div className="mb-3 lg:mb-4">
                                <div className="text-xs lg:text-sm text-white/60 mb-1">Симптомы</div>
                                <div className="text-white/80 text-xs lg:text-sm line-clamp-2">
                                  {record.symptoms}
                                </div>
                              </div>
                            )}

                            {/* Footer with icons and action */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 lg:gap-4 text-xs lg:text-sm text-white/60">
                                {record.prescriptions.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <span>💊</span>
                                    <span>{record.prescriptions.length}</span>
                                  </div>
                                )}
                                {record.attachments.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <span>📎</span>
                                    <span>{record.attachments.length}</span>
                                  </div>
                                )}
                                {record.tests && record.tests.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <span>🔬</span>
                                    <span>{record.tests.length}</span>
                                  </div>
                                )}
                              </div>
                              <div className="text-white/60 group-hover:text-white transition-colors flex items-center gap-1 text-xs lg:text-sm">
                                <span>Подробнее</span>
                                {isClient && (
                                  <motion.span
                                    animate={{ x: [0, 3, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                  >
                                    →
                                  </motion.span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </InteractiveCard>
                    </motion.div>
                  ))}

                  {sortedRecords.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <InteractiveCard className="p-8 lg:p-12 text-center">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl lg:text-3xl mb-4 lg:mb-6 mx-auto">
                          📋
                        </div>
                        <h3 className="text-xl lg:text-2xl font-semibold text-white mb-2 lg:mb-3">Записей не найдено</h3>
                        <p className="text-white/60 text-sm lg:text-base mb-6 lg:mb-8">
                          Попробуйте изменить параметры поиска или фильтрации
                        </p>
                        <motion.button
                          onClick={() => {
                            setFilter('all');
                            setSearchTerm('');
                            setSelectedYear('all');
                          }}
                          className="inline-flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 rounded-2xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200 text-blue-400 text-sm lg:text-base font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>🔄</span>
                          <span>Сбросить фильтры</span>
                        </motion.button>
                      </InteractiveCard>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6"
                >
                  {sortedRecords.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <InteractiveCard 
                        className="p-4 lg:p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group h-full"
                        onClick={() => setSelectedRecord(record)}
                      >
                        <div className="flex items-center gap-3 mb-3 lg:mb-4">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center text-base lg:text-lg">
                            {getSpecializationIcon(record.specialization)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm lg:text-base line-clamp-1">
                              {record.doctorName}
                            </h3>
                            <p className="text-white/60 text-xs lg:text-sm line-clamp-1">
                              {record.specialization}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 lg:space-y-3">
                          <div>
                            <div className="text-xs text-white/60 mb-1">Диагноз</div>
                            <div className="text-white font-medium text-sm line-clamp-2">
                              {record.diagnosis}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs text-white/60 mb-1">Дата</div>
                            <div className="text-white/80 text-sm">
                              {renderDate(record.date, 'simple')}
                            </div>
                          </div>

                          {/* Status and Visit Type - Stacked on mobile */}
                          <div className="flex flex-col xs:flex-row gap-2">
                            <span className={`px-2 py-1 rounded-lg text-xs border ${getStatusColor(record.status)} whitespace-nowrap`}>
                              {getStatusText(record.status)}
                            </span>
                            <span className={`px-2 py-1 rounded-lg text-xs border ${
                              record.visitType === 'in-person' 
                                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                : 'bg-green-500/20 text-green-400 border-green-500/30'
                            } whitespace-nowrap`}>
                              {record.visitType === 'in-person' ? '🏥 Очно' : '📞 Онлайн'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs text-white/60">
                            <div className="flex items-center gap-2 lg:gap-3">
                              {record.prescriptions.length > 0 && (
                                <span>💊 {record.prescriptions.length}</span>
                              )}
                              {record.attachments.length > 0 && (
                                <span>📎 {record.attachments.length}</span>
                              )}
                            </div>
                            <motion.span
                              className="group-hover:text-white transition-colors"
                              whileHover={{ x: 3 }}
                            >
                              →
                            </motion.span>
                          </div>
                        </div>
                      </InteractiveCard>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar - Improved mobile layout */}
          <div className="space-y-4 lg:space-y-6">
            {/* Health Metrics */}
            <InteractiveCard className="p-4 lg:p-6">
              <h3 className="font-semibold text-white text-sm lg:text-base mb-3 lg:mb-4">🏥 Основные показатели</h3>
              <div className="space-y-2 lg:space-y-3">
                {Object.entries(healthMetrics).map(([key, value]) => (
                  <motion.div 
                    key={key} 
                    className="flex justify-between items-center p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                    whileHover={{ x: 4 }}
                  >
                    <span className="text-white/60 text-xs lg:text-sm">
                      {key === 'bloodPressure' ? 'Артериальное давление' :
                       key === 'heartRate' ? 'Пульс' :
                       key === 'temperature' ? 'Температура' :
                       key === 'weight' ? 'Вес' :
                       key === 'height' ? 'Рост' : 'ИМТ'}
                    </span>
                    <span className="font-medium text-white text-xs lg:text-sm group-hover:text-blue-400 transition-colors">
                      {value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </InteractiveCard>

            {/* Recent Lab Results */}
            <InteractiveCard className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <h3 className="font-semibold text-white text-sm lg:text-base">🔬 Последние анализы</h3>
                <span className="text-white/60 text-xs lg:text-sm">{recentLabResults.length}</span>
              </div>
              <div className="space-y-2 lg:space-y-3">
                {recentLabResults.slice(0, 3).map((result) => (
                  <motion.div 
                    key={result.id} 
                    className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                    whileHover={{ x: 4 }}
                  >
                    <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center text-xs ${
                      result.status === 'normal' ? 'bg-green-500/20 text-green-400' :
                      result.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {result.status === 'normal' ? '✓' : result.status === 'warning' ? '⚠' : '✗'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-xs lg:text-sm font-medium line-clamp-1">
                        {result.name}
                      </div>
                      <div className="text-white/60 text-xs">
                        {renderDate(result.date, 'simple')}
                      </div>
                    </div>
                    <div className={`text-xs font-medium ${
                      result.status === 'normal' ? 'text-green-400' :
                      result.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {result.value}
                    </div>
                  </motion.div>
                ))}
              </div>
              {recentLabResults.length > 3 && (
                <motion.button 
                  className="w-full mt-2 lg:mt-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white text-xs lg:text-sm"
                  whileHover={{ x: 4 }}
                >
                  Показать все анализы →
                </motion.button>
              )}
            </InteractiveCard>

            {/* Quick Actions */}
            <InteractiveCard className="p-4 lg:p-6">
              <h3 className="font-semibold text-white text-sm lg:text-base mb-3 lg:mb-4">⚡ Быстрые действия</h3>
              <div className="space-y-2">
                <motion.button 
                  className="w-full flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-base lg:text-lg">📄</span>
                  <div>
                    <div className="font-medium text-white text-xs lg:text-sm">Выгрузить историю</div>
                    <div className="text-white/60 text-xs">PDF, Excel, печать</div>
                  </div>
                </motion.button>
                <motion.button 
                  className="w-full flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-base lg:text-lg">📱</span>
                  <div>
                    <div className="font-medium text-white text-xs lg:text-sm">Мобильное приложение</div>
                    <div className="text-white/60 text-xs">Доступ к истории</div>
                  </div>
                </motion.button>
                <motion.button 
                  className="w-full flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-base lg:text-lg">👥</span>
                  <div>
                    <div className="font-medium text-white text-xs lg:text-sm">Поделиться доступом</div>
                    <div className="text-white/60 text-xs">С родственниками</div>
                  </div>
                </motion.button>
              </div>
            </InteractiveCard>

            {/* Emergency Contacts */}
            <InteractiveCard className="p-4 lg:p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
              <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-base lg:text-lg">
                  🚨
                </div>
                <div>
                  <div className="font-bold text-white text-sm lg:text-base">Экстренная помощь</div>
                  <div className="text-white/60 text-xs lg:text-sm">Круглосуточно</div>
                </div>
              </div>
              <div className="space-y-2">
                <motion.button 
                  className="w-full flex items-center justify-between p-2 lg:p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-red-400 font-medium text-sm lg:text-base">Скорая помощь</span>
                  <span className="text-white font-mono text-xs lg:text-sm">112 / 103</span>
                </motion.button>
                <motion.button 
                  className="w-full flex items-center justify-between p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-white font-medium text-sm lg:text-base">Регистратура</span>
                  <span className="text-white/60 text-xs lg:text-sm">+7 (495) 123-45-67</span>
                </motion.button>
              </div>
            </InteractiveCard>
          </div>
        </div>

        {/* Record Detail Modal */}
        <AnimatePresence>
          {selectedRecord && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedRecord(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-4 lg:p-6 border-b border-white/10 sticky top-0 bg-slate-900 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl lg:text-2xl font-bold text-white">Детали приёма</h2>
                    <motion.button
                      onClick={() => setSelectedRecord(null)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="text-white text-lg">✕</span>
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                  {/* Doctor Info */}
                  <InteractiveCard className="p-4 lg:p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xl lg:text-2xl">
                        {getSpecializationIcon(selectedRecord.specialization)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-base lg:text-lg mb-1 truncate">
                          {selectedRecord.doctorName}
                        </h3>
                        <p className="text-white/60 text-sm lg:text-base">
                          {selectedRecord.specialization}
                        </p>
                        <p className="text-white/80 text-xs lg:text-sm mt-2">
                          📅 {renderDate(selectedRecord.date, 'full')}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <span className={`px-2 lg:px-3 py-1 rounded-lg text-xs border ${getStatusColor(selectedRecord.status)} whitespace-nowrap`}>
                          {getStatusText(selectedRecord.status)}
                        </span>
                        <span className={`px-2 lg:px-3 py-1 rounded-lg text-xs border ${
                          selectedRecord.visitType === 'in-person' 
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            : 'bg-green-500/20 text-green-400 border-green-500/30'
                        } whitespace-nowrap`}>
                          {selectedRecord.visitType === 'in-person' ? '🏥 Очный приём' : '📞 Онлайн-консультация'}
                        </span>
                      </div>
                    </div>
                  </InteractiveCard>

                  {/* Diagnosis and Symptoms */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                      <h4 className="font-semibold text-white text-sm lg:text-base mb-2 lg:mb-3">📋 Диагноз</h4>
                      <InteractiveCard className="p-3 lg:p-4">
                        <div className="text-white font-medium text-sm lg:text-lg">
                          {selectedRecord.diagnosis}
                        </div>
                      </InteractiveCard>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white text-sm lg:text-base mb-2 lg:mb-3">🤒 Симптомы</h4>
                      <InteractiveCard className="p-3 lg:p-4">
                        <div className="text-white/80 text-sm lg:text-base">
                          {selectedRecord.symptoms}
                        </div>
                      </InteractiveCard>
                    </div>
                  </div>

                  {/* Treatment */}
                  <div>
                    <h4 className="font-semibold text-white text-sm lg:text-base mb-2 lg:mb-3">💊 Лечение и рекомендации</h4>
                    <InteractiveCard className="p-3 lg:p-4">
                      <div className="text-white/80 text-sm lg:text-base leading-relaxed">
                        {selectedRecord.treatment}
                      </div>
                    </InteractiveCard>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 pt-4 lg:pt-6 border-t border-white/10">
                    <motion.button 
                      className="flex-1 flex items-center justify-center gap-2 px-3 lg:px-4 py-2 lg:py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors font-medium text-xs lg:text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>🖨️</span>
                      <span>Распечатать</span>
                    </motion.button>
                    <motion.button 
                      className="flex-1 flex items-center justify-center gap-2 px-3 lg:px-4 py-2 lg:py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-colors font-medium text-blue-400 text-xs lg:text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>📤</span>
                      <span>Экспорт</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}