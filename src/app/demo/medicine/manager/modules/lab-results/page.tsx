'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import DemoBreadcrumbs from '@/components/demo/DemoBreadcrumbs';
import { 
  labResults, 
  laboratories,
  LabResult, 
  getStatusConfig,
  getPriorityConfig,
  getTestTypeConfig,
  getFlagConfig,
  getOverallFlag,
  calculateAge,
  getPendingLabResults,
  getCriticalLabResults,
  getAbnormalLabResults
} from './demo-data';

type ViewType = 'list' | 'grid';
type StatusFilter = 'all' | 'pending' | 'completed' | 'cancelled' | 'rejected';
type PriorityFilter = 'all' | 'routine' | 'urgent' | 'stat';
type TestTypeFilter = 'all' | 'blood' | 'urine' | 'biochemistry' | 'hematology' | 'microbiology' | 'immunology' | 'hormones';
type SortField = 'orderDate' | 'resultDate' | 'patient' | 'doctor' | 'priority';

export default function LabResultsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [testTypeFilter, setTestTypeFilter] = useState<TestTypeFilter>('all');
  const [sortBy, setSortBy] = useState<SortField>('orderDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedResult, setSelectedResult] = useState<LabResult | null>(null);
  const [view, setView] = useState<ViewType>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Устанавливаем флаг клиента после гидратации
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Фильтрация и сортировка лабораторных результатов
  const filteredResults = useMemo(() => {
    let filtered = labResults.filter(result => {
      const matchesSearch = result.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           result.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           result.tests.some(test => 
                             test.name.toLowerCase().includes(searchQuery.toLowerCase())
                           ) ||
                           result.labReference.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || result.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || result.priority === priorityFilter;
      const matchesTestType = testTypeFilter === 'all' || result.testType === testTypeFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesTestType;
    });

    // Сортировка
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'orderDate':
          aValue = new Date(a.orderDate).getTime();
          bValue = new Date(b.orderDate).getTime();
          break;
        case 'resultDate':
          aValue = new Date(a.resultDate).getTime();
          bValue = new Date(b.resultDate).getTime();
          break;
        case 'patient':
          aValue = a.patientName.toLowerCase();
          bValue = b.patientName.toLowerCase();
          break;
        case 'doctor':
          aValue = a.doctorName.toLowerCase();
          bValue = b.doctorName.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { stat: 0, urgent: 1, routine: 2 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        default:
          aValue = new Date(a.orderDate).getTime();
          bValue = new Date(b.orderDate).getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchQuery, statusFilter, priorityFilter, testTypeFilter, sortBy, sortDirection]);

  // Статистика
  const stats = useMemo(() => {
    const pending = getPendingLabResults();
    const critical = getCriticalLabResults();
    const abnormal = getAbnormalLabResults();
    
    return {
      total: labResults.length,
      pending: pending.length,
      critical: critical.length,
      abnormal: abnormal.length,
      completed: labResults.filter(r => r.status === 'completed').length,
      today: labResults.filter(r => 
        new Date(r.orderDate).toDateString() === new Date().toDateString()
      ).length,
      urgent: labResults.filter(r => r.priority === 'urgent' || r.priority === 'stat').length,
    };
  }, []);

  // Обработчики
  const handleFilterReset = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setTestTypeFilter('all');
    setShowFilters(false);
  }, []);

  const handleResultSelect = useCallback((result: LabResult) => {
    setSelectedResult(result);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedResult(null);
  }, []);

  // Анимации
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Всегда показываем фильтры на десктопе, только на мобильных используем состояние
  const shouldShowFilters = showFilters || isClient;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-4 sm:mt-6 gap-3 sm:gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Лабораторные результаты</h1>
              <p className="text-white/60 text-xs sm:text-sm lg:text-base">
                Просмотр и управление результатами лабораторных исследований
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className={`relative flex-1 transition-all duration-300 ${
                isSearchFocused ? 'sm:max-w-full' : 'sm:max-w-xs'
              }`}>
                <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/40">
                </div>
              </div>
              
              <Link
                href="/demo/medicine/manager"
                className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 text-sm font-medium text-white flex items-center justify-center gap-2 min-w-[120px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Назад</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <div className="flex flex-col gap-3 sm:gap-4 flex-1">
            {/* Mobile Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 text-sm font-medium text-white flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Фильтры {showFilters ? '▲' : '▼'}</span>
            </motion.button>

            {/* Filters Grid */}
            <div className={`${shouldShowFilters ? 'grid' : 'hidden lg:grid'} grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 flex-1 transition-all duration-300`}>
              {[
                {
                  label: 'Статус',
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: [
                    { value: 'all', label: 'Все статусы' },
                    { value: 'pending', label: 'В процессе' },
                    { value: 'completed', label: 'Завершены' },
                    { value: 'cancelled', label: 'Отменены' },
                    { value: 'rejected', label: 'Отклонены' }
                  ]
                },
                {
                  label: 'Приоритет',
                  value: priorityFilter,
                  onChange: setPriorityFilter,
                  options: [
                    { value: 'all', label: 'Все приоритеты' },
                    { value: 'routine', label: 'Обычный' },
                    { value: 'urgent', label: 'Срочный' },
                    { value: 'stat', label: 'STAT' }
                  ]
                },
                {
                  label: 'Тип анализа',
                  value: testTypeFilter,
                  onChange: setTestTypeFilter,
                  options: [
                    { value: 'all', label: 'Все типы' },
                    { value: 'blood', label: 'Кровь' },
                    { value: 'urine', label: 'Моча' },
                    { value: 'biochemistry', label: 'Биохимия' },
                    { value: 'hematology', label: 'Гематология' },
                    { value: 'microbiology', label: 'Микробиология' },
                    { value: 'immunology', label: 'Иммунология' },
                    { value: 'hormones', label: 'Гормоны' }
                  ]
                },
                {
                  label: 'Сортировка',
                  value: sortBy,
                  onChange: setSortBy,
                  options: [
                    { value: 'orderDate', label: 'По дате заказа' },
                    { value: 'resultDate', label: 'По дате результата' },
                    { value: 'patient', label: 'По пациенту' },
                    { value: 'doctor', label: 'По врачу' },
                    { value: 'priority', label: 'По приоритету' }
                  ]
                },
                {
                  label: 'Направление',
                  value: sortDirection,
                  onChange: setSortDirection,
                  options: [
                    { value: 'desc', label: 'Сначала новые' },
                    { value: 'asc', label: 'Сначала старые' }
                  ]
                }
              ].map((filter, index) => (
                <motion.div
                  key={filter.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex flex-col"
                >
                  <label className="text-xs text-white/60 mb-2 font-medium">{filter.label}</label>
                  <select
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-white text-sm appearance-none cursor-pointer"
                  >
                    {filter.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex gap-2 sm:gap-3">
              {/* View Toggle */}
              <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
                {[
                  { value: 'list' as ViewType, label: 'Список', icon: '📋' },
                  { value: 'grid' as ViewType, label: 'Сетка', icon: '⏹️' }
                ].map(({ value, label, icon }) => (
                  <motion.button
                    key={value}
                    onClick={() => setView(value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 min-w-0 ${
                      view === value
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-sm">{icon}</span>
                    <span className="hidden xs:inline text-sm">{label}</span>
                  </motion.button>
                ))}
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 text-sm font-medium text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 min-w-[140px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Новый заказ</span>
                <span className="sm:hidden">Новый</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-3 mb-6 sm:mb-8"
        >
          {[
            { label: 'Всего', value: stats.total, icon: '🧪', color: 'from-blue-500 to-cyan-500' },
            { label: 'В процессе', value: stats.pending, icon: '⏳', color: 'from-orange-500 to-orange-600' },
            { label: 'Критические', value: stats.critical, icon: '🚨', color: 'from-red-500 to-red-600' },
            { label: 'Отклонения', value: stats.abnormal, icon: '⚠️', color: 'from-yellow-500 to-yellow-600' },
            { label: 'Завершены', value: stats.completed, icon: '✅', color: 'from-green-500 to-green-600' },
            { label: 'Сегодня', value: stats.today, icon: '📅', color: 'from-purple-500 to-purple-600' },
            { label: 'Срочные', value: stats.urgent, icon: '🔴', color: 'from-pink-500 to-rose-500' }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                  <span className="text-sm">{stat.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-bold text-white truncate">{stat.value}</div>
                  <div className="text-white/60 text-xs truncate">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lab Results List/Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 sm:mb-8"
        >
          {view === 'list' ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-white/60 text-sm font-medium">
                <div className="col-span-3">Пациент & Анализы</div>
                <div className="col-span-2">Врач & Лаборатория</div>
                <div className="col-span-2">Даты</div>
                <div className="col-span-2">Статус & Приоритет</div>
                <div className="col-span-2">Результаты</div>
                <div className="col-span-1">Действия</div>
              </div>
              
              {/* Table Rows */}
              <div className="divide-y divide-white/10">
                {filteredResults.map((result, index) => (
                  <LabResultRow
                    key={result.id}
                    result={result}
                    index={index}
                    onSelect={handleResultSelect}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredResults.map((result, index) => (
                <LabResultGrid
                  key={result.id}
                  result={result}
                  index={index}
                  onSelect={handleResultSelect}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl sm:text-3xl mb-4 mx-auto">
                🧪
              </div>
              <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">Результаты не найдены</h3>
              <p className="text-white/60 text-sm sm:text-base mb-6 max-w-xs mx-auto">
                Попробуйте изменить параметры поиска или фильтры
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFilterReset}
                className="px-6 py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium"
              >
                Сбросить фильтры
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Lab Result Detail Modal */}
      <AnimatePresence>
        {selectedResult && (
          <LabResultDetailModal
            result={selectedResult}
            onClose={handleModalClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Lab Result Row Component
function LabResultRow({ result, index, onSelect }: any) {
  const statusConfig = getStatusConfig(result.status);
  const priorityConfig = getPriorityConfig(result.priority);
  const testTypeConfig = getTestTypeConfig(result.testType);
  const age = calculateAge(result.patientBirthDate);
  const overallFlag = getOverallFlag(result.tests);

  const handleClick = useCallback(() => {
    onSelect(result);
  }, [onSelect, result]);

  const handleActionClick = useCallback((e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    console.log(`${action} clicked for result ${result.id}`);
  }, [result.id]);

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: "easeOut"
          }
        }
      }}
      custom={index}
      className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 p-4 sm:p-6 hover:bg-white/5 transition-colors cursor-pointer group"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Mobile Layout */}
      <div className="sm:hidden space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-base mb-1 truncate">
              {result.patientName}
            </h3>
            <div className="text-white/60 text-sm flex items-center gap-2 flex-wrap">
              <span>{age} лет</span>
              <span>•</span>
              <span className="truncate">{result.doctorName}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 ml-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color} flex-shrink-0 whitespace-nowrap`}>
              {statusConfig.icon} {statusConfig.label}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color} whitespace-nowrap`}>
              {priorityConfig.icon} {priorityConfig.label}
            </span>
          </div>
        </div>

        {/* Tests */}
        <div>
          <div className="text-white/60 text-xs mb-2">Анализы</div>
          <div className="text-white text-sm line-clamp-2">
            {result.tests.map((test: any) => test.name).join(', ')}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-white/60 text-xs mb-1">Дата заказа</div>
            <div className="text-white font-medium text-sm">
              {new Date(result.orderDate).toLocaleDateString('ru-RU')}
            </div>
          </div>
          
          <div>
            <div className="text-white/60 text-xs mb-1">Тип анализа</div>
            <div className="flex items-center gap-2">
              <span className={testTypeConfig.color}>{testTypeConfig.icon}</span>
              <span className="text-white text-sm">{testTypeConfig.label}</span>
            </div>
          </div>
        </div>

        {/* Results & Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-white/10">
          <div>
            <div className="text-white/60 text-xs mb-1">Результаты</div>
            {result.status === 'completed' ? (
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getFlagConfig(overallFlag).color}`}>
                {getFlagConfig(overallFlag).icon} {getFlagConfig(overallFlag).label}
              </div>
            ) : (
              <div className="text-white/60 text-sm">{statusConfig.label}</div>
            )}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={(e) => handleActionClick(e, 'view')}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
              aria-label="Просмотр результатов"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <>
        {/* Patient & Tests */}
        <div className="hidden sm:block col-span-3">
          <div className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
            {result.patientName}
          </div>
          <div className="text-white/60 text-sm">
            {age} лет, {result.patientGender === 'male' ? 'М' : 'Ж'}
          </div>
          <div className="text-white/80 text-sm mt-2 flex items-center gap-2">
            <span className={testTypeConfig.color}>{testTypeConfig.icon}</span>
            <span className="truncate">{result.tests.map((test: any) => test.name).join(', ')}</span>
          </div>
        </div>

        {/* Doctor & Laboratory */}
        <div className="hidden sm:block col-span-2">
          <div className="text-white font-medium text-sm truncate">👨‍⚕️ {result.doctorName}</div>
          <div className="text-white/60 text-sm">{result.doctorSpecialization}</div>
          <div className="text-white/60 text-xs mt-2 truncate" title={result.laboratory}>
            🏪 {result.laboratory}
          </div>
        </div>

        {/* Dates */}
        <div className="hidden sm:block col-span-2">
          <div className="text-white font-medium text-sm">
            {new Date(result.orderDate).toLocaleDateString('ru-RU')}
          </div>
          <div className="text-white/60 text-sm">
            {result.status === 'completed' ? 
              new Date(result.resultDate).toLocaleDateString('ru-RU') : 'Ожидается'
            }
          </div>
        </div>

        {/* Status & Priority */}
        <div className="hidden sm:block col-span-2 space-y-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color} inline-block`}>
            {statusConfig.icon} {statusConfig.label}
          </span>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}>
            {priorityConfig.icon} {priorityConfig.label}
          </div>
        </div>

        {/* Results */}
        <div className="hidden sm:block col-span-2">
          {result.status === 'completed' ? (
            <div className="space-y-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getFlagConfig(overallFlag).color}`}>
                {getFlagConfig(overallFlag).icon} {getFlagConfig(overallFlag).label}
              </div>
              <div className="text-white/60 text-xs">
                {result.tests.length} тест{result.tests.length > 1 ? 'ов' : ''}
              </div>
            </div>
          ) : (
            <div className="text-white/60 text-sm">{statusConfig.label}</div>
          )}
        </div>

        {/* Actions */}
        <div className="hidden sm:flex col-span-1 items-center justify-end">
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => handleActionClick(e, 'view')}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
              title="Просмотр результатов"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            {result.status === 'completed' && (
              <button 
                onClick={(e) => handleActionClick(e, 'download')}
                className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 transition-colors text-blue-400 hover:text-blue-300"
                title="Скачать PDF"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </>
    </motion.div>
  );
}

// Lab Result Grid Component
function LabResultGrid({ result, index, onSelect }: any) {
  const statusConfig = getStatusConfig(result.status);
  const priorityConfig = getPriorityConfig(result.priority);
  const testTypeConfig = getTestTypeConfig(result.testType);
  const age = calculateAge(result.patientBirthDate);
  const overallFlag = getOverallFlag(result.tests);

  const handleClick = useCallback(() => {
    onSelect(result);
  }, [onSelect, result]);

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0, scale: 0.95 },
        visible: {
          y: 0,
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: "easeOut"
          }
        }
      }}
      custom={index}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-200 cursor-pointer group hover:border-white/20"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-lg group-hover:text-blue-400 transition-colors mb-2 truncate">
            {result.patientName}
          </h3>
          <div className="flex items-center gap-2 text-white/60 text-sm flex-wrap">
            <span>{age} лет</span>
            <span>•</span>
            <span className="truncate">{result.doctorName}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 ml-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color} flex-shrink-0 whitespace-nowrap`}>
            {statusConfig.icon}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color} whitespace-nowrap`}>
            {priorityConfig.icon}
          </span>
        </div>
      </div>

      {/* Test Type */}
      <div className="flex items-center gap-2 mb-4">
        <span className={testTypeConfig.color}>{testTypeConfig.icon}</span>
        <span className="text-white text-sm font-medium">{testTypeConfig.label}</span>
      </div>

      {/* Tests */}
      <div className="mb-4">
        <div className="text-white/60 text-sm mb-3">Назначенные тесты</div>
        <div className="space-y-2">
          {result.tests.slice(0, 3).map((test: any) => (
            <div key={test.id} className="text-white text-sm flex items-center gap-2">
              <span className="text-blue-400">•</span>
              <span className="truncate">{test.name}</span>
            </div>
          ))}
          {result.tests.length > 3 && (
            <div className="text-white/60 text-xs">
              +{result.tests.length - 3} других тестов
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-4 text-sm">
        <div className="flex items-center justify-between">
          <div className="text-white/60">Дата заказа</div>
          <div className="text-white font-medium">
            {new Date(result.orderDate).toLocaleDateString('ru-RU')}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-white/60">Лаборатория</div>
          <div className="text-white text-right truncate max-w-[140px]">
            {result.laboratory}
          </div>
        </div>

        {result.status === 'completed' && (
          <div className="flex items-center justify-between">
            <div className="text-white/60">Общий результат</div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getFlagConfig(overallFlag).color}`}>
              {getFlagConfig(overallFlag).icon} {getFlagConfig(overallFlag).label}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <div className="text-white/60 text-xs">
            Референс: {result.labReference}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white text-sm font-medium"
          >
            Подробнее
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Lab Result Detail Modal Component
function LabResultDetailModal({ result, onClose }: any) {
  const [activeTab, setActiveTab] = useState<'overview' | 'results' | 'laboratory'>('overview');
  
  const statusConfig = getStatusConfig(result.status);
  const priorityConfig = getPriorityConfig(result.priority);
  const testTypeConfig = getTestTypeConfig(result.testType);
  const age = calculateAge(result.patientBirthDate);
  const overallFlag = getOverallFlag(result.tests);

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: '📋' },
    { id: 'results' as const, label: 'Результаты', icon: '📊' },
    { id: 'laboratory' as const, label: 'Лаборатория', icon: '🏪' }
  ];

  // Добавляем обработчик закрытия по ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Лабораторный результат #{result.labReference}</h2>
              <p className="text-white/60 text-sm mt-1">{result.patientName} • {result.tests.map((t: any) => t.name).join(', ')}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Header Info */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/60 text-sm mb-2">Статус анализа</div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                  {statusConfig.icon} {statusConfig.label}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}>
                  {priorityConfig.icon} {priorityConfig.label}
                </span>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/60 text-sm mb-2">Тип анализа</div>
              <div className="flex items-center gap-2">
                <span className={testTypeConfig.color}>{testTypeConfig.icon}</span>
                <span className="text-white font-medium">{testTypeConfig.label}</span>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/60 text-sm mb-2">Даты</div>
              <div className="text-white text-sm">
                Заказ: {new Date(result.orderDate).toLocaleDateString('ru-RU')}
              </div>
              {result.status === 'completed' && (
                <div className="text-white text-sm">
                  Результат: {new Date(result.resultDate).toLocaleDateString('ru-RU')}
                </div>
              )}
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/60 text-sm mb-2">Общий результат</div>
              {result.status === 'completed' ? (
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getFlagConfig(overallFlag).color}`}>
                  {getFlagConfig(overallFlag).icon} {getFlagConfig(overallFlag).label}
                </div>
              ) : (
                <div className="text-white/60 text-sm">{statusConfig.label}</div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto mb-6 pb-2 -mx-2 px-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap mr-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'overview' && <OverviewTab result={result} age={age} />}
            {activeTab === 'results' && <ResultsTab result={result} />}
            {activeTab === 'laboratory' && <LaboratoryTab result={result} />}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/10">
            <button className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Скачать PDF
            </button>
            <button className="px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Отправить пациенту
            </button>
            <button className="px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-colors text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Печать
            </button>
            <button className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Повторить анализ
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Tab Components
function OverviewTab({ result, age }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Patient & Doctor Info */}
      <div className="space-y-6">
        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Информация о пациенте</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">ФИО:</span>
              <span className="text-white font-medium">{result.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Дата рождения:</span>
              <span className="text-white">{new Date(result.patientBirthDate).toLocaleDateString('ru-RU')} ({age} лет)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Пол:</span>
              <span className="text-white">{result.patientGender === 'male' ? 'Мужской' : 'Женский'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Телефон:</span>
              <span className="text-white">{result.patientPhone}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Информация о враче</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">ФИО:</span>
              <span className="text-white font-medium">{result.doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Специализация:</span>
              <span className="text-white">{result.doctorSpecialization}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Назначил:</span>
              <span className="text-white">{result.createdBy}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Details */}
      <div className="space-y-6">
        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Детали анализа</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Лаборатория:</span>
              <span className="text-white">{result.laboratory}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Референс:</span>
              <span className="text-white">{result.labReference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Тип образца:</span>
              <span className="text-white">{result.specimenType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Метод сбора:</span>
              <span className="text-white">{result.collectionMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Дата сбора:</span>
              <span className="text-white">{new Date(result.collectionDate).toLocaleDateString('ru-RU')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Дата результата:</span>
              <span className="text-white">
                {result.status === 'completed' ? 
                  new Date(result.resultDate).toLocaleDateString('ru-RU') : 'Ожидается'
                }
              </span>
            </div>
          </div>
        </div>

        {result.clinicalNotes && (
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Клинические заметки</h3>
            <p className="text-white/80 text-sm">{result.clinicalNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultsTab({ result }: any) {
  if (result.status !== 'completed') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center text-2xl mb-4 mx-auto">
          ⏳
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">Результаты ожидаются</h3>
        <p className="text-white/60 text-sm">
          Результаты анализа еще не готовы. Пожалуйста, проверьте позже.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {result.tests.map((test: any) => (
        <div key={test.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-semibold text-white text-sm sm:text-base">{test.name}</h4>
              <p className="text-white/60 text-sm">{test.category}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getFlagConfig(test.flag).color}`}>
              {getFlagConfig(test.flag).icon} {getFlagConfig(test.flag).label}
            </div>
          </div>

          {test.subTests && test.subTests.length > 0 ? (
            <div className="space-y-3">
              {test.subTests.map((subTest: any) => (
                <div key={subTest.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">{subTest.name}</div>
                    <div className="text-white/60 text-xs">{subTest.normalRange}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      subTest.flag === 'normal' ? 'text-green-400' :
                      subTest.flag === 'low' ? 'text-blue-400' :
                      subTest.flag === 'high' ? 'text-orange-400' : 'text-red-400'
                    }`}>
                      {subTest.result} {subTest.unit}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${getFlagConfig(subTest.flag).color}`}>
                      {getFlagConfig(subTest.flag).icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex-1">
                <div className="text-white font-medium text-sm">Результат</div>
                <div className="text-white/60 text-xs">{test.normalRange}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  test.flag === 'normal' ? 'text-green-400' :
                  test.flag === 'low' ? 'text-blue-400' :
                  test.flag === 'high' ? 'text-orange-400' : 'text-red-400'
                }`}>
                  {test.result} {test.unit}
                </div>
              </div>
            </div>
          )}

          {test.notes && (
            <div className="mt-3 p-2 bg-blue-500/10 rounded-lg">
              <div className="text-blue-400 text-xs">{test.notes}</div>
            </div>
          )}
        </div>
      ))}

      {(result.interpretation || result.recommendations) && (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h4 className="font-semibold text-white text-sm sm:text-base mb-3">Интерпретация и рекомендации</h4>
          {result.interpretation && (
            <div className="mb-3">
              <div className="text-white/60 text-xs mb-1">Интерпретация:</div>
              <p className="text-white/80 text-sm">{result.interpretation}</p>
            </div>
          )}
          {result.recommendations && (
            <div>
              <div className="text-white/60 text-xs mb-1">Рекомендации:</div>
              <p className="text-white/80 text-sm">{result.recommendations}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LaboratoryTab({ result }: any) {
  const laboratory = laboratories.find(lab => lab.name === result.laboratory);

  if (!laboratory) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-2xl bg-gray-500/20 flex items-center justify-center text-2xl mb-4 mx-auto">
          🏪
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">Информация о лаборатории недоступна</h3>
        <p className="text-white/60 text-sm">
          Данные о выбранной лаборатории временно отсутствуют.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Контактная информация</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Название:</span>
              <span className="text-white font-medium">{laboratory.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Адрес:</span>
              <span className="text-white text-right">{laboratory.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Телефон:</span>
              <span className="text-white">{laboratory.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Email:</span>
              <span className="text-white">{laboratory.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Часы работы:</span>
              <span className="text-white">{laboratory.hours}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Аккредитация</h3>
          <div className="flex flex-wrap gap-2">
            {laboratory.accreditation.map((acc, index) => (
              <span key={index} className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                {acc}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Выполняемые тесты</h3>
          <div className="space-y-2">
            {laboratory.testsPerformed.map((test, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="text-green-400">✓</span>
                <span className="text-white">{test}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Сроки выполнения</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Стандартные анализы:</span>
              <span className="text-white">{laboratory.turnaroundTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Срочные анализы:</span>
              <span className="text-orange-400">2-4 часа</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">STAT анализы:</span>
              <span className="text-red-400">30-60 минут</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Быстрые действия</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="px-3 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm">
              📞 Позвонить
            </button>
            <button className="px-3 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors text-sm">
              📍 Маршрут
            </button>
            <button className="px-3 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-colors text-sm">
              🌐 Сайт
            </button>
            <button className="px-3 py-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30 transition-colors text-sm">
              📧 Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}