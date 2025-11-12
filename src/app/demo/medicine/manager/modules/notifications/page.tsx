'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import DemoBreadcrumbs from '@/components/demo/DemoBreadcrumbs';
import { 
  notifications, 
  notificationSettings, 
  notificationTemplates, 
  notificationStats,
  Notification,
  NotificationTemplate 
} from './demo-data';

type TabType = 'inbox' | 'templates' | 'settings';
type FilterType = 'all' | 'unread';
type NotificationType = 'appointment' | 'payment' | 'system' | 'alert' | 'reminder';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('inbox');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [settings, setSettings] = useState(notificationSettings);
  const [templates, setTemplates] = useState(notificationTemplates);
  const [isClient, setIsClient] = useState(false);

  // Устанавливаем флаг клиента после гидратации
  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      const matchesRead = filter === 'all' || !notif.isRead;
      const matchesType = typeFilter === 'all' || notif.type === typeFilter;
      return matchesRead && matchesType;
    });
  }, [filter, typeFilter]);

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-white/5 text-white/60 border-white/10';
    }
  }, []);

  const getTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'appointment': return '📅';
      case 'payment': return '💳';
      case 'system': return '⚙️';
      case 'alert': return '🚨';
      case 'reminder': return '⏰';
      default: return '🔔';
    }
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    // В реальном приложении здесь был бы вызов API
    console.log('Mark all as read');
  }, []);

  const handleToggleTemplate = useCallback((templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, isActive: !template.isActive }
        : template
    ));
  }, []);

  const handleSettingsChange = useCallback((key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleCategoryChange = useCallback((category: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      categories: { ...prev.categories, [category]: value }
    }));
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedNotification(null);
  }, []);

  // Добавляем обработчик закрытия по ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedNotification) {
        handleModalClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedNotification, handleModalClose]);

  const tabs = [
    { value: 'inbox' as TabType, label: 'Входящие', icon: '📥', count: notificationStats.unread },
    { value: 'templates' as TabType, label: 'Шаблоны', icon: '📋' },
    { value: 'settings' as TabType, label: 'Настройки', icon: '⚙️' }
  ];

  const filterOptions = [
    { value: 'all' as FilterType, label: 'Все' },
    { value: 'unread' as FilterType, label: 'Непрочитанные' }
  ];

  const typeOptions = [
    { value: 'all', label: 'Все типы' },
    { value: 'appointment', label: 'Записи' },
    { value: 'payment', label: 'Платежи' },
    { value: 'system', label: 'Система' },
    { value: 'alert', label: 'Оповещения' },
    { value: 'reminder', label: 'Напоминания' }
  ];

  const quickActions = [
    { label: 'Отключить на 1 час', icon: '🔕' },
    { label: 'Массовая рассылка', icon: '📧' },
    { label: 'Статистика уведомлений', icon: '📊' }
  ];

  const channelSettings = [
    { key: 'email', label: 'Email уведомления', icon: '📧' },
    { key: 'sms', label: 'SMS сообщения', icon: '📱' },
    { key: 'push', label: 'Push уведомления', icon: '🔔' },
    { key: 'sound', label: 'Звуковые оповещения', icon: '🔊' },
    { key: 'workingHours', label: 'Только в рабочее время', icon: '🕐' }
  ];

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
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Уведомления и напоминания</h1>
              <p className="text-white/60 text-xs sm:text-sm lg:text-base">
                Управление системой уведомлений и автоматическими напоминаниями
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleMarkAllAsRead}
                className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 text-sm font-medium text-white flex items-center justify-center gap-2"
              >
                <span>📪</span>
                <span className="hidden sm:inline">Прочитать все</span>
                <span className="sm:hidden">Все</span>
              </motion.button>
              
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

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8"
        >
          {[
            { label: 'Всего', value: notificationStats.total, icon: '🔔', color: 'from-blue-500 to-cyan-500' },
            { label: 'Непрочитанные', value: notificationStats.unread, icon: '📬', color: 'from-yellow-500 to-yellow-600' },
            { label: 'Высокий приоритет', value: notificationStats.byPriority.critical + notificationStats.byPriority.high, icon: '🚨', color: 'from-red-500 to-red-600' },
            { label: 'Активные шаблоны', value: templates.filter(t => t.isActive).length, icon: '📋', color: 'from-green-500 to-green-600' }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                  <span className="text-sm sm:text-lg">{stat.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg sm:text-xl font-bold text-white whitespace-nowrap">{stat.value}</div>
                  <div className="text-white/60 text-xs whitespace-nowrap">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex rounded-2xl bg-white/5 border border-white/10 p-1 mb-6"
        >
          {tabs.map(({ value, label, icon, count }) => (
            <motion.button
              key={value}
              onClick={() => setActiveTab(value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex-1 ${
                activeTab === value
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-sm">{icon}</span>
              <span className="hidden xs:inline">{label}</span>
              {count && count > 0 && (
                <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs">
                  {count}
                </span>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'inbox' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Notifications List */}
              <div className="lg:col-span-3">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                  <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
                    {filterOptions.map(({ value, label }) => (
                      <motion.button
                        key={value}
                        onClick={() => setFilter(value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 ${
                          filter === value
                            ? 'bg-white/10 text-white'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {label}
                      </motion.button>
                    ))}
                  </div>
                  
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-white text-sm appearance-none cursor-pointer"
                  >
                    {typeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notifications */}
                <div className="space-y-3">
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedNotification(notification)}
                      className={`rounded-2xl border transition-all duration-200 cursor-pointer group ${
                        notification.isRead
                          ? 'bg-white/5 border-white/10 hover:border-white/20'
                          : 'bg-blue-500/5 border-blue-500/20 hover:border-blue-500/30'
                      }`}
                    >
                      <div className="p-4 sm:p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
                            {getTypeIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                              <h3 className={`font-semibold line-clamp-2 ${
                                notification.isRead ? 'text-white/80' : 'text-white'
                              }`}>
                                {notification.title}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notification.priority)} flex-shrink-0 w-fit`}>
                                {notification.priority}
                              </span>
                            </div>
                            
                            <p className="text-white/60 text-sm mb-3 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="text-white/40 text-xs">
                                {new Date(notification.timestamp).toLocaleString('ru-RU')}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {notification.action && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Handle action
                                    }}
                                    className="px-3 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 text-xs transition-colors whitespace-nowrap"
                                  >
                                    {notification.action.label}
                                  </button>
                                )}
                                <div className="text-white/60 group-hover:text-white transition-colors text-xs whitespace-nowrap">
                                  Подробнее →
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {filteredNotifications.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 flex items-center justify-center text-2xl sm:text-3xl mb-4 mx-auto">
                        📭
                      </div>
                      <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">Уведомлений не найдено</h3>
                      <p className="text-white/60 text-sm sm:text-base max-w-xs mx-auto">
                        Нет уведомлений, соответствующих выбранным фильтрам
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4 sm:space-y-6">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6">
                  <h3 className="font-semibold text-white text-sm sm:text-base mb-3 sm:mb-4">Быстрые действия</h3>
                  <div className="space-y-2 sm:space-y-3 text-sm">
                    {quickActions.map((action, index) => (
                      <motion.button
                        key={action.label}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3"
                      >
                        <span>{action.icon}</span>
                        <span className="text-xs sm:text-sm">{action.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6">
                  <h3 className="font-semibold text-white text-sm sm:text-base mb-3 sm:mb-4">Распределение по типам</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {Object.entries(notificationStats.byType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{getTypeIcon(type)}</span>
                          <span className="text-white/60 text-xs sm:text-sm capitalize">{type}</span>
                        </div>
                        <span className="text-white font-medium text-sm">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h3 className="font-semibold text-white text-lg sm:text-xl">Шаблоны уведомлений</h3>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 text-sm font-medium text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Новый шаблон</span>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {templates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-base sm:text-lg mb-1">{template.name}</h4>
                        <p className="text-white/60 text-xs sm:text-sm">
                          {template.type} • {template.trigger} • {template.delay} {template.delayUnit}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleTemplate(template.id)}
                        className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-3 ${
                          template.isActive ? 'bg-green-500' : 'bg-white/10'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            template.isActive ? 'transform translate-x-7' : 'transform translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mb-4">
                      <div className="text-white/60 text-xs sm:text-sm mb-2">Сообщение:</div>
                      <div className="text-white/80 text-sm bg-white/5 rounded-lg p-3">
                        {template.message}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {template.channels.map(channel => (
                          <span key={channel} className="px-2 py-1 rounded-lg bg-white/5 text-white/60 text-xs">
                            {channel}
                          </span>
                        ))}
                      </div>
                      <div className={`text-xs sm:text-sm ${
                        template.isActive ? 'text-green-400' : 'text-white/60'
                      }`}>
                        {template.isActive ? 'Активен' : 'Неактивен'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6">
                  <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Каналы уведомлений</h3>
                  <div className="space-y-4">
                    {channelSettings.map(({ key, label, icon }) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg sm:text-xl">{icon}</span>
                          <span className="text-white text-sm sm:text-base">{label}</span>
                        </div>
                        <button
                          onClick={() => handleSettingsChange(key, !settings[key as keyof typeof settings])}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings[key as keyof typeof settings] ? 'bg-green-500' : 'bg-white/10'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform ${
                              settings[key as keyof typeof settings] ? 'transform translate-x-7' : 'transform translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6">
                  <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Тихие часы</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm sm:text-base">Включить тихие часы</span>
                      <button
                        onClick={() => handleSettingsChange('quietHours', { 
                          ...settings.quietHours, 
                          enabled: !settings.quietHours.enabled 
                        })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.quietHours.enabled ? 'bg-green-500' : 'bg-white/10'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            settings.quietHours.enabled ? 'transform translate-x-7' : 'transform translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    {settings.quietHours.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/60 text-xs sm:text-sm mb-2">Начало</label>
                          <input
                            type="time"
                            value={settings.quietHours.start}
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-white/60 text-xs sm:text-sm mb-2">Конец</label>
                          <input
                            type="time"
                            value={settings.quietHours.end}
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6">
                <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Категории уведомлений</h3>
                <div className="space-y-4">
                  {Object.entries(settings.categories).map(([category, enabled]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg sm:text-xl">{getTypeIcon(category)}</span>
                        <span className="text-white text-sm sm:text-base capitalize">{category}</span>
                      </div>
                      <button
                        onClick={() => handleCategoryChange(category, !enabled)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          enabled ? 'bg-green-500' : 'bg-white/10'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            enabled ? 'transform translate-x-7' : 'transform translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Notification Detail Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={handleModalClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-white">Детали уведомления</h2>
                  <button
                    onClick={handleModalClose}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/10 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                    {getTypeIcon(selectedNotification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-base sm:text-lg mb-1">{selectedNotification.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedNotification.priority)} w-fit`}>
                        {selectedNotification.priority}
                      </span>
                      <span className="text-white/60 text-xs sm:text-sm">
                        {new Date(selectedNotification.timestamp).toLocaleString('ru-RU')}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-white/60 text-sm mb-2">Сообщение:</div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-white/80 text-sm sm:text-base">{selectedNotification.message}</div>
                  </div>
                </div>

                {selectedNotification.metadata && (
                  <div>
                    <div className="text-white/60 text-sm mb-2">Метаданные:</div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 overflow-x-auto">
                      <pre className="text-white/80 text-xs sm:text-sm">
                        {JSON.stringify(selectedNotification.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors font-medium text-sm">
                    Пометить как прочитанное
                  </button>
                  {selectedNotification.action && (
                    <button className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 font-medium text-white text-sm">
                      {selectedNotification.action.label}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}