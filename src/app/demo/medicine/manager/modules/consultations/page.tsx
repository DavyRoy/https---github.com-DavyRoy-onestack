'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import DemoBreadcrumbs from '@/components/demo/DemoBreadcrumbs';
import { appointments, doctors, patients, rooms, Appointment, Doctor } from './demo-data';

type ConsultationStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
type ConsultationType = 'consultation' | 'examination' | 'procedure' | 'surgery' | 'diagnostic';
type PriorityType = 'routine' | 'urgent' | 'emergency';
type ViewType = 'list' | 'calendar' | 'grid';

export default function ConsultationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ConsultationStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ConsultationType | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityType | 'all'>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'time' | 'patient' | 'doctor' | 'priority'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedConsultation, setSelectedConsultation] = useState<Appointment | null>(null);
  const [view, setView] = useState<ViewType>('list');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Определяем, что компонент загружен на клиенте
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Фильтрация и сортировка консультаций
  const filteredConsultations = useMemo(() => {
    let filtered = appointments.filter(consultation => {
      const matchesSearch = consultation.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           consultation.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           consultation.reason?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
      const matchesType = typeFilter === 'all' || consultation.type === typeFilter;
      const matchesPriority = priorityFilter === 'all' || consultation.priority === priorityFilter;
      const matchesDoctor = doctorFilter === 'all' || consultation.doctorId === doctorFilter;
      const matchesDate = !dateFilter || consultation.date === dateFilter;

      return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesDoctor && matchesDate;
    });

    // Сортировка
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'time':
          aValue = a.startTime;
          bValue = b.startTime;
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
          const priorityOrder = { emergency: 0, urgent: 1, routine: 2 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [appointments, searchQuery, statusFilter, typeFilter, priorityFilter, doctorFilter, dateFilter, sortBy, sortDirection]);

  // Статистика
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayConsultations = appointments.filter(a => a.date === today);
    
    return {
      total: appointments.length,
      today: todayConsultations.length,
      scheduled: appointments.filter(a => a.status === 'scheduled').length,
      inProgress: appointments.filter(a => a.status === 'in-progress').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      urgent: appointments.filter(a => a.priority === 'urgent' && a.status === 'scheduled').length,
      emergency: appointments.filter(a => a.priority === 'emergency').length,
    };
  }, []);

  const getStatusConfig = useCallback((status: ConsultationStatus) => {
    const configs = {
      scheduled: { 
        color: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
        label: 'Запланирована',
        icon: '⏰',
        gradient: 'from-blue-500 to-blue-600'
      },
      'in-progress': { 
        color: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
        label: 'В процессе',
        icon: '🔄',
        gradient: 'from-orange-500 to-orange-600'
      },
      completed: { 
        color: 'bg-green-500/20 border-green-500/30 text-green-400',
        label: 'Завершена',
        icon: '✅',
        gradient: 'from-green-500 to-green-600'
      },
      cancelled: { 
        color: 'bg-red-500/20 border-red-500/30 text-red-400',
        label: 'Отменена',
        icon: '❌',
        gradient: 'from-red-500 to-red-600'
      },
      'no-show': { 
        color: 'bg-gray-500/20 border-gray-500/30 text-gray-400',
        label: 'Не явился',
        icon: '👤',
        gradient: 'from-gray-500 to-gray-600'
      }
    };
    return configs[status];
  }, []);

  const getTypeConfig = useCallback((type: ConsultationType) => {
    const configs = {
      consultation: { 
        icon: '💬', 
        label: 'Консультация', 
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        gradient: 'from-blue-500 to-cyan-500'
      },
      examination: { 
        icon: '🔍', 
        label: 'Обследование', 
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/20',
        gradient: 'from-purple-500 to-purple-600'
      },
      procedure: { 
        icon: '💉', 
        label: 'Процедура', 
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        gradient: 'from-green-500 to-emerald-500'
      },
      surgery: { 
        icon: '🔪', 
        label: 'Операция', 
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        gradient: 'from-red-500 to-red-600'
      },
      diagnostic: { 
        icon: '📊', 
        label: 'Диагностика', 
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/20',
        gradient: 'from-orange-500 to-orange-600'
      }
    };
    return configs[type];
  }, []);

  const getPriorityConfig = useCallback((priority: PriorityType) => {
    const configs = {
      routine: { 
        color: 'bg-gray-500/20 text-gray-400', 
        label: 'Обычный', 
        icon: '⚪',
        gradient: 'from-gray-500 to-gray-600'
      },
      urgent: { 
        color: 'bg-orange-500/20 text-orange-400', 
        label: 'Срочный', 
        icon: '🟡',
        gradient: 'from-orange-500 to-orange-600'
      },
      emergency: { 
        color: 'bg-red-500/20 text-red-400', 
        label: 'Экстренный', 
        icon: '🔴',
        gradient: 'from-red-500 to-red-600'
      }
    };
    return configs[priority];
  }, []);

  const handleStatusChange = useCallback((consultationId: string, newStatus: ConsultationStatus) => {
    // В реальном приложении здесь был бы API call
    console.log(`Changing consultation ${consultationId} status to ${newStatus}`);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setPriorityFilter('all');
    setDoctorFilter('all');
    setDateFilter('');
    setShowFilters(false);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const statsVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "backOut"
      }
    })
  };

  // Определяем, показывать ли фильтры на десктопе
  const shouldShowFilters = showFilters || (isClient && window.innerWidth >= 1024);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        
        {/* Header - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-4 sm:mt-6 gap-3 sm:gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Управление консультациями</h1>
              <p className="text-white/60 text-sm sm:text-base max-w-2xl">
                Расписание приёмов и управление консультациями пациентов в реальном времени
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search - Enhanced */}
              <div className="relative flex-1 sm:max-w-xs">
              </div>
              
              {/* Back Button */}
              <Link
                href="/demo/medicine/manager"
                className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 text-sm font-medium text-white flex items-center justify-center gap-2 min-w-[120px] group"
              >
                <motion.span
                  whileHover={{ x: -2 }}
                  className="text-lg"
                >
                  ←
                </motion.span>
                <span className="hidden sm:inline">Назад</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions - Mobile First */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide"
        >
          {[
            { key: 'all' as ConsultationStatus, label: 'Все', icon: '📊', count: stats.total },
            { key: 'scheduled' as ConsultationStatus, label: 'Запланированы', icon: '⏰', count: stats.scheduled },
            { key: 'in-progress' as ConsultationStatus, label: 'В процессе', icon: '🔄', count: stats.inProgress },
            { key: 'completed' as ConsultationStatus, label: 'Завершены', icon: '✅', count: stats.completed },
            { key: 'urgent' as ConsultationStatus, label: 'Срочные', icon: '🚨', count: stats.urgent },
          ].map((action, index) => (
            <motion.button
              key={action.key}
              onClick={() => setStatusFilter(action.key === 'all' ? 'all' : action.key)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all duration-300 min-w-max flex-shrink-0 ${
                statusFilter === action.key
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/10'
                  : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              custom={index}
              variants={statsVariants}
              initial="hidden"
              animate="visible"
            >
              <span className="text-lg">{action.icon}</span>
              <span className="font-medium text-sm">{action.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                statusFilter === action.key ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/80'
              }`}>
                {action.count}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Stats - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-3 mb-6 sm:mb-8"
        >
          {[
            { 
              label: 'Всего', 
              value: stats.total, 
              icon: '📊', 
              color: 'from-blue-500 to-cyan-500',
              description: 'Все консультации'
            },
            { 
              label: 'Сегодня', 
              value: stats.today, 
              icon: '📅', 
              color: 'from-green-500 to-emerald-500',
              description: 'На сегодня'
            },
            { 
              label: 'Запланировано', 
              value: stats.scheduled, 
              icon: '⏰', 
              color: 'from-purple-500 to-purple-600',
              description: 'Ожидают приема'
            },
            { 
              label: 'В процессе', 
              value: stats.inProgress, 
              icon: '🔄', 
              color: 'from-orange-500 to-orange-600',
              description: 'Сейчас на приеме'
            },
            { 
              label: 'Завершено', 
              value: stats.completed, 
              icon: '✅', 
              color: 'from-green-500 to-green-600',
              description: 'Сегодня завершено'
            },
            { 
              label: 'Срочные', 
              value: stats.urgent, 
              icon: '🚨', 
              color: 'from-orange-500 to-red-500',
              description: 'Требуют внимания'
            },
            { 
              label: 'Экстренные', 
              value: stats.emergency, 
              icon: '⚠️', 
              color: 'from-red-500 to-red-600',
              description: 'Высокий приоритет'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl border border-white/10 p-3 sm:p-4 backdrop-blur-sm shadow-lg cursor-pointer group`}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white/90 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-white text-xl sm:text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-white/70 text-xs">{stat.description}</p>
                </div>
                <div className="text-2xl sm:text-3xl opacity-80">{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Controls - Enhanced for Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 space-y-3"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-3">
                <motion.button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-white font-medium flex items-center gap-2">
                    <span>🎛️</span>
                    Фильтры и сортировка
                  </span>
                  <motion.span
                    animate={{ rotate: showFilters ? 180 : 0 }}
                    className="text-white/60 text-lg"
                  >
                    ↓
                  </motion.span>
                </motion.button>
              </div>

              {/* Filters Container */}
              <AnimatePresence>
                {shouldShowFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3"
                  >
                    {/* Status Filter */}
                    <div className="flex flex-col">
                      <label className="text-white/60 text-xs mb-2 font-medium">Статус</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-white text-sm backdrop-blur-sm"
                      >
                        <option value="all">Все статусы</option>
                        <option value="scheduled">Запланированы</option>
                        <option value="in-progress">В процессе</option>
                        <option value="completed">Завершены</option>
                        <option value="cancelled">Отменены</option>
                      </select>
                    </div>

                    {/* Type Filter */}
                    <div className="flex flex-col">
                      <label className="text-white/60 text-xs mb-2 font-medium">Тип</label>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-white text-sm backdrop-blur-sm"
                      >
                        <option value="all">Все типы</option>
                        <option value="consultation">Консультация</option>
                        <option value="examination">Обследование</option>
                        <option value="procedure">Процедура</option>
                        <option value="diagnostic">Диагностика</option>
                      </select>
                    </div>

                    {/* Priority Filter */}
                    <div className="flex flex-col">
                      <label className="text-white/60 text-xs mb-2 font-medium">Приоритет</label>
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-white text-sm backdrop-blur-sm"
                      >
                        <option value="all">Все приоритеты</option>
                        <option value="routine">Обычный</option>
                        <option value="urgent">Срочный</option>
                        <option value="emergency">Экстренный</option>
                      </select>
                    </div>

                    {/* Doctor Filter */}
                    <div className="flex flex-col">
                      <label className="text-white/60 text-xs mb-2 font-medium">Врач</label>
                      <select
                        value={doctorFilter}
                        onChange={(e) => setDoctorFilter(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-white text-sm backdrop-blur-sm"
                      >
                        <option value="all">Все врачи</option>
                        {doctors.map(doctor => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name.split(' ')[0]} {doctor.name.split(' ')[1]}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date Filter */}
                    <div className="flex flex-col">
                      <label className="text-white/60 text-xs mb-2 font-medium">Дата</label>
                      <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-white text-sm backdrop-blur-sm"
                      />
                    </div>

                    {/* Sort */}
                    <div className="flex flex-col">
                      <label className="text-white/60 text-xs mb-2 font-medium">Сортировка</label>
                      <select
                        value={`${sortBy}-${sortDirection}`}
                        onChange={(e) => {
                          const [field, direction] = e.target.value.split('-');
                          setSortBy(field as any);
                          setSortDirection(direction as any);
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-white text-sm backdrop-blur-sm"
                      >
                        <option value="date-asc">Дата (возр.)</option>
                        <option value="date-desc">Дата (убыв.)</option>
                        <option value="time-asc">Время (возр.)</option>
                        <option value="time-desc">Время (убыв.)</option>
                        <option value="patient-asc">Пациент А-Я</option>
                        <option value="patient-desc">Пациент Я-А</option>
                        <option value="priority-asc">Приоритет</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* View Toggle */}
              <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
                {[
                  { value: 'list' as ViewType, label: 'Список', icon: '📋' },
                  { value: 'grid' as ViewType, label: 'Сетка', icon: '⏹️' },
                  { value: 'calendar' as ViewType, label: 'Календарь', icon: '📅' }
                ].map(({ value, label, icon }) => (
                  <motion.button
                    key={value}
                    onClick={() => setView(value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      view === value
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-sm">{icon}</span>
                    <span className="hidden sm:inline text-sm">{label}</span>
                  </motion.button>
                ))}
              </div>
              
              {/* Clear Filters */}
              <motion.button 
                onClick={clearFilters}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200 text-sm font-medium whitespace-nowrap"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Сбросить
              </motion.button>
              
              {/* New Consultation */}
              <motion.button 
                onClick={() => setIsCreating(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 text-sm font-medium text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 min-w-[140px]"
              >
                <span className="text-lg">+</span>
                <span className="hidden sm:inline">Новая запись</span>
                <span className="sm:hidden">Новая</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4 flex items-center justify-between"
        >
          <p className="text-white/60 text-sm">
            Найдено консультаций: <span className="text-white font-medium">{filteredConsultations.length}</span>
          </p>
          
          {filteredConsultations.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span>Сортировка:</span>
              <span className="text-white font-medium">
                {sortBy === 'date' ? 'По дате' : sortBy === 'time' ? 'По времени' : sortBy === 'patient' ? 'По пациенту' : sortBy === 'doctor' ? 'По врачу' : 'По приоритету'}
              </span>
              <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
            </div>
          )}
        </motion.div>

        {/* Consultations View */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 sm:mb-8"
        >
          {view === 'list' ? (
            <ConsultationListView 
              consultations={filteredConsultations}
              onSelect={setSelectedConsultation}
              getStatusConfig={getStatusConfig}
              getTypeConfig={getTypeConfig}
              getPriorityConfig={getPriorityConfig}
            />
          ) : view === 'grid' ? (
            <ConsultationGridView 
              consultations={filteredConsultations}
              onSelect={setSelectedConsultation}
              getStatusConfig={getStatusConfig}
              getTypeConfig={getTypeConfig}
              getPriorityConfig={getPriorityConfig}
            />
          ) : (
            <CalendarView 
              consultations={filteredConsultations}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              onConsultationSelect={setSelectedConsultation}
            />
          )}

          {/* Empty State */}
          {filteredConsultations.length === 0 && (
            <EmptyConsultationState onClearFilters={clearFilters} />
          )}
        </motion.div>
      </div>

      {/* Consultation Detail Modal */}
      <AnimatePresence>
        {selectedConsultation && (
          <ConsultationDetailModal
            consultation={selectedConsultation}
            onClose={() => setSelectedConsultation(null)}
            onStatusChange={handleStatusChange}
            getStatusConfig={getStatusConfig}
            getTypeConfig={getTypeConfig}
            getPriorityConfig={getPriorityConfig}
          />
        )}
      </AnimatePresence>

      {/* Create Consultation Modal */}
      <AnimatePresence>
        {isCreating && (
          <CreateConsultationModal onClose={() => setIsCreating(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Остальные компоненты (ConsultationListView, ConsultationRow, ConsultationGridView, ConsultationCard, 
// EmptyConsultationState, CalendarView, ConsultationDetailModal, CreateConsultationModal) 
// остаются без изменений, как в предыдущем коде
// Enhanced Consultation Grid View
// Enhanced Consultation List View
function ConsultationListView({ consultations, onSelect, getStatusConfig, getTypeConfig, getPriorityConfig }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      {/* Table Header - Hidden on mobile */}
      <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-white/60 text-sm font-medium">
        <div className="col-span-3">Пациент & Врач</div>
        <div className="col-span-2">Дата & Время</div>
        <div className="col-span-2">Тип & Приоритет</div>
        <div className="col-span-2">Статус</div>
        <div className="col-span-2">Кабинет</div>
        <div className="col-span-1">Действия</div>
      </div>
      
      {/* Table Rows */}
      <div className="divide-y divide-white/10">
        <AnimatePresence mode="popLayout">
          {consultations.map((consultation: any, index: number) => (
            <ConsultationRow
              key={consultation.id}
              consultation={consultation}
              index={index}
              onSelect={onSelect}
              getStatusConfig={getStatusConfig}
              getTypeConfig={getTypeConfig}
              getPriorityConfig={getPriorityConfig}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Enhanced Consultation Row Component
function ConsultationRow({ 
  consultation, 
  index, 
  onSelect, 
  getStatusConfig, 
  getTypeConfig, 
  getPriorityConfig 
}: any) {
  const statusConfig = getStatusConfig(consultation.status);
  const typeConfig = getTypeConfig(consultation.type);
  const priorityConfig = getPriorityConfig(consultation.priority);

  return (
    <motion.div
      variants={{
        hidden: { y: 10, opacity: 0, scale: 0.95 },
        visible: {
          y: 0,
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.3,
            ease: "easeOut"
          }
        },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
      }}
      custom={index}
      className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/5 transition-all duration-200 cursor-pointer group"
      onClick={() => onSelect(consultation)}
      whileHover={{ y: -1 }}
    >
      {/* Priority Indicator Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${priorityConfig.color.split(' ')[0]} opacity-60`} />
      
      {/* Mobile Layout */}
      <div className="sm:hidden space-y-3 pl-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="font-semibold text-white text-base mb-1 flex items-center gap-2">
              {consultation.patientName}
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig.color}`}>
                {priorityConfig.icon}
              </span>
            </div>
            <div className="text-white/60 text-sm flex items-center gap-2">
              <span>👨‍⚕️</span>
              <span>{consultation.doctorName}</span>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color} flex-shrink-0 ml-2`}>
            {statusConfig.icon}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-white/60 text-xs mb-1">Дата & Время</div>
            <div className="text-white font-medium text-sm">
              {new Date(consultation.date).toLocaleDateString('ru-RU')}
            </div>
            <div className="text-white/60 text-xs">
              {consultation.startTime}
            </div>
          </div>
          
          <div>
            <div className="text-white/60 text-xs mb-1">Тип & Кабинет</div>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-sm">{typeConfig.icon}</span>
              <span className="text-white text-sm">{typeConfig.label}</span>
            </div>
            <div className="text-white font-medium text-sm">№{consultation.room}</div>
          </div>
        </div>

        {/* Reason & Actions */}
        <div className="flex justify-between items-center">
          {consultation.reason && (
            <div className="text-white/60 text-xs truncate flex-1 mr-2" title={consultation.reason}>
              {consultation.reason}
            </div>
          )}
          <motion.button 
            onClick={(e) => {
              e.stopPropagation();
              onSelect(consultation);
            }}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 text-white/60 hover:text-white flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            👁️
          </motion.button>
        </div>
      </div>

      {/* Desktop Layout */}
      <>
        {/* Patient & Doctor */}
        <div className="hidden sm:block col-span-3 pl-4">
          <div className="font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
            {consultation.patientName}
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig.color}`}>
              {priorityConfig.icon}
            </span>
          </div>
          <div className="text-white/60 text-sm flex items-center gap-2 mt-1">
            <span>👨‍⚕️</span>
            <span>{consultation.doctorName}</span>
          </div>
          {consultation.reason && (
            <div className="text-white/60 text-xs truncate mt-1" title={consultation.reason}>
              {consultation.reason}
            </div>
          )}
        </div>

        {/* Date & Time */}
        <div className="hidden sm:block col-span-2">
          <div className="text-white font-medium">
            {new Date(consultation.date).toLocaleDateString('ru-RU')}
          </div>
          <div className="text-white/60 text-sm">
            {consultation.startTime} - {consultation.endTime}
          </div>
        </div>

        {/* Type & Priority */}
        <div className="hidden sm:block col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <span>{typeConfig.icon}</span>
            <span className="text-white text-sm">{typeConfig.label}</span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}>
            {priorityConfig.icon} {priorityConfig.label}
          </div>
        </div>

        {/* Status */}
        <div className="hidden sm:block col-span-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
            {statusConfig.icon} {statusConfig.label}
          </span>
        </div>

        {/* Room */}
        <div className="hidden sm:block col-span-2">
          <div className="text-white font-medium text-lg">№{consultation.room}</div>
        </div>

        {/* Actions */}
        <div className="hidden sm:flex col-span-1 items-center justify-end pr-4">
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button 
              onClick={(e) => {
                e.stopPropagation();
                onSelect(consultation);
              }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 text-white/60 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              👁️
            </motion.button>
          </div>
        </div>
      </>
    </motion.div>
  );
}

// Enhanced Consultation Grid View
function ConsultationGridView({ consultations, onSelect, getStatusConfig, getTypeConfig, getPriorityConfig }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      <AnimatePresence mode="popLayout">
        {consultations.map((consultation: any, index: number) => (
          <ConsultationCard
            key={consultation.id}
            consultation={consultation}
            index={index}
            onSelect={onSelect}
            getStatusConfig={getStatusConfig}
            getTypeConfig={getTypeConfig}
            getPriorityConfig={getPriorityConfig}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Enhanced Consultation Card Component
function ConsultationCard({ 
  consultation, 
  index, 
  onSelect, 
  getStatusConfig, 
  getTypeConfig, 
  getPriorityConfig 
}: any) {
  const statusConfig = getStatusConfig(consultation.status);
  const typeConfig = getTypeConfig(consultation.type);
  const priorityConfig = getPriorityConfig(consultation.priority);

  return (
    <motion.div
      variants={{
        hidden: { y: 10, opacity: 0, scale: 0.95 },
        visible: {
          y: 0,
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.3,
            ease: "easeOut"
          }
        },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
      }}
      custom={index}
      className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-200 cursor-pointer group relative overflow-hidden"
      onClick={() => onSelect(consultation)}
      whileHover={{ y: -2, scale: 1.02 }}
    >
      {/* Priority Indicator */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${priorityConfig.color.split(' ')[0]} opacity-60`} />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-base sm:text-lg group-hover:text-blue-400 transition-colors mb-1 truncate">
            {consultation.patientName}
          </h3>
          <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm">
            <span>👨‍⚕️</span>
            <span className="truncate">{consultation.doctorName}</span>
          </div>
        </div>
        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color} flex-shrink-0 ml-2`}>
          {statusConfig.icon}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="text-white/60 text-xs sm:text-sm">Дата и время</div>
          <div className="text-white font-medium text-xs sm:text-sm text-right">
            <div>{new Date(consultation.date).toLocaleDateString('ru-RU')}</div>
            <div className="text-white/60">{consultation.startTime}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-white/60 text-xs sm:text-sm">Тип</div>
          <div className="flex items-center gap-1 sm:gap-2 text-white text-xs sm:text-sm">
            <span>{typeConfig.icon}</span>
            <span>{typeConfig.label}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-white/60 text-xs sm:text-sm">Приоритет</div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}>
            {priorityConfig.icon} {priorityConfig.label}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-white/60 text-xs sm:text-sm">Кабинет</div>
          <div className="text-white font-medium text-sm sm:text-base">№{consultation.room}</div>
        </div>
      </div>

      {/* Reason */}
      {consultation.reason && (
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="text-white/60 text-xs mb-1">Причина обращения</div>
          <div className="text-white text-xs sm:text-sm line-clamp-2">{consultation.reason}</div>
        </div>
      )}
    </motion.div>
  );
}

// Enhanced Empty State
function EmptyConsultationState({ onClearFilters }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="text-center py-16"
    >
      <motion.div 
        className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl mb-4 mx-auto"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        📊
      </motion.div>
      <h3 className="text-white font-semibold text-lg mb-2">Консультации не найдены</h3>
      <p className="text-white/60 text-sm mb-6 max-w-xs mx-auto">
        Попробуйте изменить параметры поиска или фильтры для отображения записей
      </p>
      <motion.button 
        onClick={onClearFilters}
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>🔄</span>
        Сбросить фильтры
      </motion.button>
    </motion.div>
  );
}

// Enhanced Calendar View Component (simplified for brevity)
function CalendarView({ consultations, selectedDate, onDateSelect, onConsultationSelect }: any) {
  const today = new Date().toISOString().split('T')[0];
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white text-lg">Календарь консультаций</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors text-sm">
            ←
          </button>
          <button className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors text-sm">
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
          <div key={day} className="text-center text-white/60 text-sm font-medium py-2">
            {day}
          </div>
        ))}
        
        {dates.map(date => {
          const dayConsultations = consultations.filter((c: any) => c.date === date);
          const isToday = date === today;
          const isSelected = date === selectedDate;

          return (
            <motion.button
              key={date}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onDateSelect(date)}
              className={`p-3 rounded-xl border transition-all duration-200 text-sm ${
                isSelected 
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                  : isToday
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
              }`}
            >
              <div className="font-medium mb-1">
                {new Date(date).getDate()}
              </div>
              {dayConsultations.length > 0 && (
                <div className="text-white/40 text-xs">
                  {dayConsultations.length} зап.
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Date Consultations */}
      <div>
        <h4 className="font-semibold text-white text-base mb-4">
          Консультации на {new Date(selectedDate).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
        </h4>
        <div className="space-y-2">
          {consultations
            .filter((c: any) => c.date === selectedDate)
            .map((consultation: any) => (
              <motion.div
                key={consultation.id}
                whileHover={{ scale: 1.01 }}
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => onConsultationSelect(consultation)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm truncate">
                      {consultation.patientName}
                    </div>
                    <div className="text-white/60 text-xs">
                      {consultation.startTime} - {consultation.doctorName}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="text-white text-sm">Каб. {consultation.room}</div>
                    <div className="text-white/60 text-xs">{consultation.type}</div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}

// Enhanced Consultation Detail Modal Component
function ConsultationDetailModal({ consultation, onClose, onStatusChange, getStatusConfig, getTypeConfig, getPriorityConfig }: any) {
  const doctor = doctors.find(d => d.id === consultation.doctorId);
  const patient = patients.find(p => p.name === consultation.patientName);
  const statusConfig = getStatusConfig(consultation.status);
  const typeConfig = getTypeConfig(consultation.type);
  const priorityConfig = getPriorityConfig(consultation.priority);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-800/95 backdrop-blur-sm border-b border-white/10 z-10 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className={`p-3 rounded-2xl ${typeConfig.bgColor} flex-shrink-0`}>
                <span className="text-2xl">{typeConfig.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 pr-8 break-words">
                  {consultation.patientName}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${priorityConfig.color}`}>
                    {priorityConfig.icon} {priorityConfig.label}
                  </span>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                    {statusConfig.icon} {statusConfig.label}
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/5 text-white/80">
                    👨‍⚕️ {consultation.doctorName}
                  </span>
                </div>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-xl">✕</span>
            </motion.button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="font-semibold text-white text-base mb-4 flex items-center gap-2">
                  <span>👤</span>
                  Информация о пациенте
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">ФИО:</span>
                    <span className="text-white font-medium text-right">{consultation.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Телефон:</span>
                    <span className="text-white">{consultation.patientPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Email:</span>
                    <span className="text-white text-sm">{consultation.patientEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Страховка:</span>
                    <span className="text-white">{consultation.insurance}</span>
                  </div>
                </div>
              </div>

              {/* Consultation Details */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="font-semibold text-white text-base mb-4 flex items-center gap-2">
                  <span>📋</span>
                  Детали консультации
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Дата:</span>
                    <span className="text-white font-medium">
                      {new Date(consultation.date).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Время:</span>
                    <span className="text-white">{consultation.startTime} - {consultation.endTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Тип:</span>
                    <span className="text-white flex items-center gap-1">
                      <span>{typeConfig.icon}</span>
                      <span>{typeConfig.label}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Кабинет:</span>
                    <span className="text-white font-medium">№{consultation.room}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Doctor Info */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="font-semibold text-white text-base mb-4 flex items-center gap-2">
                  <span>👨‍⚕️</span>
                  Врач
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-base">
                    {doctor?.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-base truncate">{consultation.doctorName}</div>
                    <div className="text-white/60 text-sm truncate">{consultation.specialization}</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Телефон:</span>
                    <span className="text-white text-sm">{doctor?.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Email:</span>
                    <span className="text-white text-sm truncate">{doctor?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Кабинет:</span>
                    <span className="text-white">№{doctor?.room}</span>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="font-semibold text-white text-base mb-4 flex items-center gap-2">
                  <span>⚙️</span>
                  Управление
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Статус консультации</label>
                    <select
                      value={consultation.status}
                      onChange={(e) => onStatusChange(consultation.id, e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-colors text-white text-sm"
                    >
                      <option value="scheduled">Запланирована</option>
                      <option value="in-progress">В процессе</option>
                      <option value="completed">Завершена</option>
                      <option value="cancelled">Отменена</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <motion.button 
                      className="px-3 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm flex items-center justify-center gap-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>📝</span>
                      Заметки
                    </motion.button>
                    <motion.button 
                      className="px-3 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors text-sm flex items-center justify-center gap-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>📄</span>
                      Заключение
                    </motion.button>
                    <motion.button 
                      className="px-3 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-colors text-sm flex items-center justify-center gap-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>🔄</span>
                      Перенести
                    </motion.button>
                    <motion.button 
                      className="px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors text-sm flex items-center justify-center gap-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>❌</span>
                      Отменить
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Reason & Notes */}
              {consultation.reason && (
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="font-semibold text-white text-base mb-2 flex items-center gap-2">
                    <span>💬</span>
                    Причина обращения
                  </h3>
                  <p className="text-white/80 text-sm">{consultation.reason}</p>
                </div>
              )}

              {consultation.notes && (
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="font-semibold text-white text-base mb-2 flex items-center gap-2">
                    <span>📋</span>
                    Примечания врача
                  </h3>
                  <p className="text-white/80 text-sm">{consultation.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Create Consultation Modal (simplified)
function CreateConsultationModal({ onClose }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Новая консультация</h2>
        </div>
        <div className="p-6">
          <p className="text-white/60 text-sm mb-4">Форма создания новой консультации будет здесь...</p>
          <div className="flex gap-3">
            <motion.button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors text-sm flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Отмена
            </motion.button>
            <motion.button
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-colors text-sm flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Создать
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}