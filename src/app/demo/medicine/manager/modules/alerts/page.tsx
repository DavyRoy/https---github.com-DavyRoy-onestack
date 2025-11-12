'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import DemoBreadcrumbs from '@/components/demo/DemoBreadcrumbs';
import { 
  alerts, 
  alertTypes,
  Alert, 
  AlertType,
  AlertPriority,
  getAlertTypeConfig,
  getAlertPriorityConfig,
  getAlertStatusConfig,
  markAlertAsRead,
  markAlertAsResolved,
  deleteAlert,
  getUnreadAlertsCount,
  getCriticalAlertsCount
} from './demo-data';

type AlertFilter = 'all' | 'unread' | 'critical' | 'resolved';
type SortField = 'createdAt' | 'priority' | 'type';

export default function AlertsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<AlertFilter>('all');
  const [typeFilter, setTypeFilter] = useState<AlertType | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<AlertPriority | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Инициализация после монтирования
  useEffect(() => {
    setMounted(true);
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Фильтрация и сортировка алертов
  const filteredAlerts = useMemo(() => {
    let filtered = [...alerts];

    // Поиск
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(query) ||
        alert.description.toLowerCase().includes(query) ||
        alert.source.toLowerCase().includes(query)
      );
    }

    // Фильтрация по статусу
    switch (filter) {
      case 'unread':
        filtered = filtered.filter(alert => !alert.isRead);
        break;
      case 'critical':
        filtered = filtered.filter(alert => alert.priority === 'critical');
        break;
      case 'resolved':
        filtered = filtered.filter(alert => alert.status === 'resolved');
        break;
    }

    // Фильтрация по типу
    if (typeFilter !== 'all') {
      filtered = filtered.filter(alert => alert.type === typeFilter);
    }

    // Фильтрация по приоритету
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(alert => alert.priority === priorityFilter);
    }

    // Сортировка
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'priority':
          const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchQuery, filter, typeFilter, priorityFilter, sortBy, sortDirection]);

  // Статистика
  const stats = useMemo(() => {
    return {
      total: alerts.length,
      unread: getUnreadAlertsCount(),
      critical: getCriticalAlertsCount(),
      resolved: alerts.filter(a => a.status === 'resolved').length,
    };
  }, []);

  const handleMarkAsRead = useCallback((alertId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markAlertAsRead(alertId);
    setSelectedAlert(prev => prev?.id === alertId ? {...prev, isRead: true} : prev);
  }, []);

  const handleMarkAsResolved = useCallback((alertId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markAlertAsResolved(alertId);
    setSelectedAlert(prev => prev?.id === alertId ? {...prev, status: 'resolved'} : prev);
  }, []);

  const handleDeleteAlert = useCallback((alertId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAlert(alertId);
    setSelectedAlert(null);
  }, []);

  const handleQuickAction = useCallback((action: AlertFilter) => {
    setFilter(action);
    setShowFilters(false);
  }, []);

  const clearFilters = useCallback(() => {
    setFilter('all');
    setTypeFilter('all');
    setPriorityFilter('all');
    setSearchQuery('');
    setShowFilters(false);
  }, []);

  // Показываем фильтры на десктопе всегда
  const shouldShowFilters = showFilters || isDesktop;

  // Анимации
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

  // Не рендерим контент до монтирования чтобы избежать hydration errors
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(248, 113, 113, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(96, 165, 250, 0.3) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        
        {/* Header - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-4 sm:mt-6 gap-3 sm:gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Система оповещений</h1>
              <p className="text-white/60 text-sm sm:text-base max-w-2xl">
                Мониторинг и управление системными уведомлениями и инцидентами в реальном времени
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search - Enhanced */}

              
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
            { key: 'all' as AlertFilter, label: 'Все', icon: '📊', count: stats.total },
            { key: 'unread' as AlertFilter, label: 'Новые', icon: '👁️', count: stats.unread },
            { key: 'critical' as AlertFilter, label: 'Критические', icon: '🚨', count: stats.critical },
            { key: 'resolved' as AlertFilter, label: 'Решено', icon: '✅', count: stats.resolved },
          ].map((action, index) => (
            <motion.button
              key={action.key}
              onClick={() => handleQuickAction(action.key)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all duration-300 min-w-max flex-shrink-0 ${
                filter === action.key
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
                filter === action.key ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/80'
              }`}>
                {action.count}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Stats Cards - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          {[
            { 
              label: 'Все оповещения', 
              value: stats.total, 
              color: 'from-blue-500 to-cyan-500', 
              icon: '📊',
              description: 'Всего в системе'
            },
            { 
              label: 'Не прочитано', 
              value: stats.unread, 
              color: 'from-orange-500 to-red-500', 
              icon: '👁️',
              description: 'Требуют внимания'
            },
            { 
              label: 'Критические', 
              value: stats.critical, 
              color: 'from-red-500 to-pink-500', 
              icon: '🚨',
              description: 'Высокий приоритет'
            },
            { 
              label: 'Решено', 
              value: stats.resolved, 
              color: 'from-green-500 to-emerald-500', 
              icon: '✅',
              description: 'Завершено'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl border border-white/10 p-4 backdrop-blur-sm shadow-lg`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white/90 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-white text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-white/70 text-xs">{stat.description}</p>
                </div>
                <div className="text-3xl opacity-80">{stat.icon}</div>
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
          {/* Mobile Filter Toggle */}
          {!isDesktop && (
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-white font-medium">Фильтры и сортировка</span>
              <motion.span
                animate={{ rotate: showFilters ? 180 : 0 }}
                className="text-white/60 text-lg"
              >
                ↓
              </motion.span>
            </motion.button>
          )}

          {/* Filters Container */}
          <AnimatePresence>
            {shouldShowFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col lg:flex-row gap-4 lg:items-center overflow-hidden"
              >
                <div className="flex flex-wrap gap-3 flex-1">
                  {/* Status Filter */}
                  <div className="flex items-center gap-2">
                    <label className="text-white/60 text-sm whitespace-nowrap hidden sm:block">Статус:</label>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as AlertFilter)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-blue-500/50 focus:outline-none backdrop-blur-sm min-w-[140px]"
                    >
                      <option value="all">Все статусы</option>
                      <option value="unread">Не прочитано</option>
                      <option value="critical">Критические</option>
                      <option value="resolved">Решено</option>
                    </select>
                  </div>

                  {/* Type Filter */}
                  <div className="flex items-center gap-2">
                    <label className="text-white/60 text-sm whitespace-nowrap hidden sm:block">Тип:</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as AlertType | 'all')}
                      className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-blue-500/50 focus:outline-none backdrop-blur-sm min-w-[160px]"
                    >
                      <option value="all">Все типы</option>
                      {alertTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div className="flex items-center gap-2">
                    <label className="text-white/60 text-sm whitespace-nowrap hidden sm:block">Приоритет:</label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value as AlertPriority | 'all')}
                      className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-blue-500/50 focus:outline-none backdrop-blur-sm min-w-[150px]"
                    >
                      <option value="all">Все приоритеты</option>
                      <option value="critical">Критический</option>
                      <option value="high">Высокий</option>
                      <option value="medium">Средний</option>
                      <option value="low">Низкий</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <label className="text-white/60 text-sm whitespace-nowrap hidden sm:block">Сортировка:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortField)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-blue-500/50 focus:outline-none backdrop-blur-sm"
                    >
                      <option value="createdAt">По дате</option>
                      <option value="priority">По приоритету</option>
                      <option value="type">По типу</option>
                    </select>
                    <motion.button
                      onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 text-white/80 hover:text-white"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </motion.button>
                  </div>
                </div>

                {/* Clear Filters */}
                <motion.button
                  onClick={clearFilters}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200 text-sm font-medium whitespace-nowrap"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Сбросить фильтры
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4 flex items-center justify-between"
        >
          <p className="text-white/60 text-sm">
            Найдено оповещений: <span className="text-white font-medium">{filteredAlerts.length}</span>
          </p>
          
          {filteredAlerts.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span>Сортировка:</span>
              <span className="text-white font-medium">
                {sortBy === 'createdAt' ? 'По дате' : sortBy === 'priority' ? 'По приоритету' : 'По типу'}
              </span>
              <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
            </div>
          )}
        </motion.div>

        {/* Alerts List - Enhanced */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                variants={itemVariants}
                layout
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer backdrop-blur-sm ${
                  alert.isRead 
                    ? 'bg-white/5 border-white/5 hover:border-white/10' 
                    : 'bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/30'
                } ${getAlertPriorityConfig(alert.priority).borderColor} hover:shadow-lg hover:scale-[1.02] active:scale-[0.99]`}
                onClick={() => setSelectedAlert(alert)}
                whileHover={{ y: -2 }}
              >
                {/* Priority Indicator Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${getAlertPriorityConfig(alert.priority).bgColor}`} />
                
                <div className="pl-4 pr-4 py-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`p-2.5 rounded-xl ${getAlertTypeConfig(alert.type).bgColor} mt-0.5 flex-shrink-0`}>
                        <span className="text-base">{getAlertTypeConfig(alert.type).icon}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`font-semibold text-base group-hover:text-blue-300 transition-colors truncate ${
                            alert.isRead ? 'text-white/80' : 'text-white'
                          }`}>
                            {alert.title}
                          </h3>
                          {!alert.isRead && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="px-2 py-1 bg-yellow-500 text-yellow-900 rounded-full text-xs font-bold flex-shrink-0"
                            >
                              NEW
                            </motion.span>
                          )}
                        </div>
                        
                        <p className="text-white/60 text-sm line-clamp-2 mb-3 leading-relaxed">
                          {alert.description}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-white/40 flex-wrap">
                          <span className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2 py-1">
                            <span>📅</span>
                            <span>{new Date(alert.createdAt).toLocaleDateString('ru-RU')}</span>
                          </span>
                          <span className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2 py-1">
                            <span>🕒</span>
                            <span>{new Date(alert.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getAlertPriorityConfig(alert.priority).bgColor} ${getAlertPriorityConfig(alert.priority).textColor}`}>
                            {getAlertPriorityConfig(alert.priority).label}
                          </span>
                          <span className="text-white/60 truncate">Источник: {alert.source}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                      <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${getAlertStatusConfig(alert.status).bgColor} ${getAlertStatusConfig(alert.status).textColor}`}>
                        {getAlertStatusConfig(alert.status).label}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State - Enhanced */}
        {filteredAlerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="text-center py-16"
          >
            <motion.div 
              className="text-7xl mb-6"
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
              🔔
            </motion.div>
            <h3 className="text-white text-xl font-semibold mb-3">Оповещения не найдены</h3>
            <p className="text-white/60 text-sm max-w-md mx-auto mb-6">
              {searchQuery || filter !== 'all' || typeFilter !== 'all' || priorityFilter !== 'all'
                ? 'Попробуйте изменить параметры фильтрации или поисковый запрос'
                : 'Все оповещения обработаны. Система работает в штатном режиме.'
              }
            </p>
            {(searchQuery || filter !== 'all' || typeFilter !== 'all' || priorityFilter !== 'all') && (
              <motion.button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Сбросить фильтры
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Alert Detail Modal - Enhanced */}
        <AnimatePresence>
          {selectedAlert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50"
              onClick={() => setSelectedAlert(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-slate-800 rounded-3xl border border-white/10 max-w-4xl w-full max-h-[85vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-slate-800/95 backdrop-blur-sm border-b border-white/10 z-10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`p-3 rounded-2xl ${getAlertTypeConfig(selectedAlert.type).bgColor} flex-shrink-0`}>
                        <span className="text-2xl">{getAlertTypeConfig(selectedAlert.type).icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 pr-8 break-words">
                          {selectedAlert.title}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getAlertPriorityConfig(selectedAlert.priority).bgColor} ${getAlertPriorityConfig(selectedAlert.priority).textColor}`}>
                            {getAlertPriorityConfig(selectedAlert.priority).label}
                          </span>
                          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getAlertStatusConfig(selectedAlert.status).bgColor} ${getAlertStatusConfig(selectedAlert.status).textColor}`}>
                            {getAlertStatusConfig(selectedAlert.status).label}
                          </span>
                          {!selectedAlert.isRead && (
                            <span className="px-3 py-1.5 bg-yellow-500 text-yellow-900 rounded-full text-sm font-medium">
                              НЕ ПРОЧИТАНО
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setSelectedAlert(null)}
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white flex-shrink-0"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="text-xl">✕</span>
                    </motion.button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Alert Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-white/60 text-sm mb-2">Тип оповещения</div>
                      <div className="text-white text-sm font-medium flex items-center gap-3">
                        <span className="text-lg">{getAlertTypeConfig(selectedAlert.type).icon}</span>
                        <span>{getAlertTypeConfig(selectedAlert.type).label}</span>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-white/60 text-sm mb-2">Источник</div>
                      <div className="text-white text-sm font-medium">{selectedAlert.source}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-white/60 text-sm mb-2">Создано</div>
                      <div className="text-white text-sm font-medium">
                        {new Date(selectedAlert.createdAt).toLocaleString('ru-RU')}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-white/60 text-sm mb-2">Обновлено</div>
                      <div className="text-white text-sm font-medium">
                        {new Date(selectedAlert.updatedAt).toLocaleString('ru-RU')}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-white font-semibold mb-3 text-lg">Описание</h3>
                    <p className="text-white/70 text-sm leading-relaxed bg-white/5 rounded-xl p-4">
                      {selectedAlert.description}
                    </p>
                  </div>

                  {/* Details */}
                  {selectedAlert.details && (
                    <div>
                      <h3 className="text-white font-semibold mb-3 text-lg">Детали инцидента</h3>
                      <pre className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap bg-white/5 rounded-xl p-4 overflow-x-auto">
                        {selectedAlert.details}
                      </pre>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <span>ID: {selectedAlert.id}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      {!selectedAlert.isRead && (
                        <motion.button 
                          onClick={(e) => handleMarkAsRead(selectedAlert.id, e)}
                          className="w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-300 text-sm flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>👁️</span>
                          Отметить прочитанным
                        </motion.button>
                      )}
                      {selectedAlert.status !== 'resolved' && (
                        <motion.button 
                          onClick={(e) => handleMarkAsResolved(selectedAlert.id, e)}
                          className="w-full sm:w-auto px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-300 text-sm flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>✅</span>
                          Отметить решённым
                        </motion.button>
                      )}
                      <motion.button 
                        onClick={(e) => handleDeleteAlert(selectedAlert.id, e)}
                        className="w-full sm:w-auto px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl font-medium transition-all duration-300 text-sm flex items-center justify-center gap-2 border border-red-500/20"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>🗑️</span>
                        Удалить
                      </motion.button>
                    </div>
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