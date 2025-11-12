'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'clinic' | 'security' | 'notifications' | 'billing' | 'integrations'>('general');
  const [isClient, setIsClient] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Состояния для настроек
  const [clinicInfo, setClinicInfo] = useState({
    name: 'Медицинский центр "Здоровье+"',
    address: 'г. Москва, ул. Примерная, д. 123',
    phone: '+7 (495) 123-45-67',
    email: 'info@healthplus.ru',
    website: 'www.healthplus.ru',
    workingHours: {
      weekdays: '09:00 - 21:00',
      weekends: '10:00 - 18:00'
    }
  });

  const [generalSettings, setGeneralSettings] = useState({
    language: 'ru',
    timezone: 'Europe/Moscow',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    currency: 'RUB',
    autoBackup: true,
    sessionTimeout: 30
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordExpiry: 90,
    loginAttempts: 5,
    sessionLifetime: 24,
    ipWhitelist: ['192.168.1.0/24'],
    auditLog: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      appointments: true,
      reminders: true,
      reports: false,
      security: true
    },
    push: {
      appointments: true,
      reminders: true,
      emergency: true
    },
    sms: {
      reminders: true,
      results: false,
      emergency: true
    }
  });

  const [billingSettings, setBillingSettings] = useState({
    taxRate: 20,
    invoicePrefix: 'INV',
    paymentMethods: ['card', 'cash', 'insurance'],
    autoInvoicing: true,
    lateFee: 5,
    currency: 'RUB'
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    // Имитация сохранения настроек
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSaveStatus('success');
    setIsSaving(false);
    
    // Сброс статуса через 3 секунды
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const settingSections = useMemo(() => [
    {
      id: 'general',
      title: 'Основные настройки',
      icon: '⚙️',
      description: 'Общие параметры системы',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'clinic',
      title: 'Информация о клинике',
      icon: '🏥',
      description: 'Контактные данные и реквизиты',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'security',
      title: 'Безопасность',
      icon: '🔒',
      description: 'Настройки безопасности и доступа',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'notifications',
      title: 'Уведомления',
      icon: '🔔',
      description: 'Настройки оповещений',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      id: 'billing',
      title: 'Биллинг',
      icon: '💰',
      description: 'Настройки платежей и счетов',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'integrations',
      title: 'Интеграции',
      icon: '🔗',
      description: 'Подключенные сервисы',
      color: 'from-orange-500 to-red-500'
    }
  ], []);

  const systemInfo = {
    version: '2.1.4',
    lastUpdate: '2024-01-24',
    databaseSize: '2.4 GB',
    activeUsers: '24',
    uptime: '99.8%',
    serverStatus: 'optimal'
  };

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
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-gray-500/20 border border-gray-500/30 flex items-center justify-center text-2xl lg:text-3xl">
                ⚙️
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl lg:text-3xl font-bold text-white mb-1 lg:mb-2 truncate">
                  Настройки системы
                </h1>
                <p className="text-white/60 text-sm lg:text-base truncate">
                  Управление параметрами медицинской клиники
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={handleSaveSettings}
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 transition-all duration-200 text-sm font-medium text-white flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Сохранение...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Сохранить изменения</span>
                  </>
                )}
              </motion.button>
              <Link
                href="/demo/medicine/owner"
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 text-sm font-medium text-white flex items-center justify-center gap-2"
              >
                <span>←</span>
                <span>Назад</span>
              </Link>
            </div>
          </div>

          {/* Status Message */}
          <AnimatePresence>
            {saveStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-sm"
              >
                ✅ Настройки успешно сохранены
              </motion.div>
            )}
          </AnimatePresence>

          {/* System Info Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4">
            {[
              { label: 'Версия', value: systemInfo.version, icon: '📦', color: 'from-blue-500 to-cyan-500' },
              { label: 'Обновление', value: systemInfo.lastUpdate, icon: '🔄', color: 'from-green-500 to-emerald-500' },
              { label: 'База данных', value: systemInfo.databaseSize, icon: '💾', color: 'from-purple-500 to-indigo-500' },
              { label: 'Пользователи', value: systemInfo.activeUsers, icon: '👥', color: 'from-orange-500 to-red-500' },
              { label: 'Аптайм', value: systemInfo.uptime, icon: '📈', color: 'from-yellow-500 to-amber-500' },
              { label: 'Статус', value: systemInfo.serverStatus, icon: '✅', color: 'from-green-500 to-emerald-500' }
            ].map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-3 lg:p-4 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white/60 text-xs lg:text-sm font-medium truncate">
                      {info.label}
                    </h3>
                    <p className="text-lg lg:text-xl font-bold text-white mt-1 truncate">
                      {info.value}
                    </p>
                  </div>
                  <div className={`text-xl lg:text-2xl ml-2 ${
                    info.color.includes('blue') ? 'text-blue-400' :
                    info.color.includes('green') ? 'text-green-400' :
                    info.color.includes('purple') ? 'text-purple-400' :
                    info.color.includes('orange') ? 'text-orange-400' :
                    info.color.includes('yellow') ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {info.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span>📋</span>
                Разделы настроек
              </h3>
              <div className="space-y-2">
                {settingSections.map((section) => (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveTab(section.id as any)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center gap-3 group ${
                      activeTab === section.id
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg'
                        : 'bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white/80'
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{section.title}</div>
                      <div className="text-xs opacity-70">{section.description}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm"
            >
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl">
                      ⚙️
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Основные настройки</h2>
                      <p className="text-white/60 text-sm">Общие параметры системы и интерфейса</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Язык интерфейса
                        </label>
                        <select
                          value={generalSettings.language}
                          onChange={(e) => setGeneralSettings(prev => ({ ...prev, language: e.target.value }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
                        >
                          <option value="ru">Русский</option>
                          <option value="en">English</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Часовой пояс
                        </label>
                        <select
                          value={generalSettings.timezone}
                          onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
                        >
                          <option value="Europe/Moscow">Москва (UTC+3)</option>
                          <option value="Europe/London">Лондон (UTC+0)</option>
                          <option value="America/New_York">Нью-Йорк (UTC-5)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Формат даты
                        </label>
                        <select
                          value={generalSettings.dateFormat}
                          onChange={(e) => setGeneralSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
                        >
                          <option value="DD.MM.YYYY">DD.MM.YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Формат времени
                        </label>
                        <select
                          value={generalSettings.timeFormat}
                          onChange={(e) => setGeneralSettings(prev => ({ ...prev, timeFormat: e.target.value }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
                        >
                          <option value="24h">24-часовой</option>
                          <option value="12h">12-часовой</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Валюта
                        </label>
                        <select
                          value={generalSettings.currency}
                          onChange={(e) => setGeneralSettings(prev => ({ ...prev, currency: e.target.value }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
                        >
                          <option value="RUB">Рубль (₽)</option>
                          <option value="USD">Доллар ($)</option>
                          <option value="EUR">Евро (€)</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                        <div>
                          <div className="text-white font-medium text-sm">Авто-бэкап</div>
                          <div className="text-white/60 text-xs">Ежедневное резервное копирование</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={generalSettings.autoBackup}
                            onChange={(e) => setGeneralSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Clinic Information */}
              {activeTab === 'clinic' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-xl">
                      🏥
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Информация о клинике</h2>
                      <p className="text-white/60 text-sm">Контактные данные и реквизиты</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Название клиники
                        </label>
                        <input
                          type="text"
                          value={clinicInfo.name}
                          onChange={(e) => setClinicInfo(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 placeholder-white/40"
                          placeholder="Введите название клиники"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Адрес
                        </label>
                        <input
                          type="text"
                          value={clinicInfo.address}
                          onChange={(e) => setClinicInfo(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 placeholder-white/40"
                          placeholder="Введите адрес клиники"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Телефон
                        </label>
                        <input
                          type="tel"
                          value={clinicInfo.phone}
                          onChange={(e) => setClinicInfo(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 placeholder-white/40"
                          placeholder="+7 (XXX) XXX-XX-XX"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={clinicInfo.email}
                          onChange={(e) => setClinicInfo(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 placeholder-white/40"
                          placeholder="email@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Веб-сайт
                        </label>
                        <input
                          type="url"
                          value={clinicInfo.website}
                          onChange={(e) => setClinicInfo(prev => ({ ...prev, website: e.target.value }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 placeholder-white/40"
                          placeholder="www.example.com"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            Будни
                          </label>
                          <input
                            type="text"
                            value={clinicInfo.workingHours.weekdays}
                            onChange={(e) => setClinicInfo(prev => ({ 
                              ...prev, 
                              workingHours: { ...prev.workingHours, weekdays: e.target.value }
                            }))}
                            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 placeholder-white/40"
                            placeholder="09:00 - 18:00"
                          />
                        </div>
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            Выходные
                          </label>
                          <input
                            type="text"
                            value={clinicInfo.workingHours.weekends}
                            onChange={(e) => setClinicInfo(prev => ({ 
                              ...prev, 
                              workingHours: { ...prev.workingHours, weekends: e.target.value }
                            }))}
                            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 placeholder-white/40"
                            placeholder="10:00 - 16:00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-xl">
                      🔒
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Безопасность</h2>
                      <p className="text-white/60 text-sm">Настройки безопасности и контроля доступа</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        label: 'Двухфакторная аутентификация',
                        description: 'Требовать 2FA для всех пользователей',
                        value: securitySettings.twoFactorAuth,
                        onChange: (value: boolean) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: value }))
                      },
                      {
                        label: 'Ведение лога аудита',
                        description: 'Записывать все действия в системе',
                        value: securitySettings.auditLog,
                        onChange: (value: boolean) => setSecuritySettings(prev => ({ ...prev, auditLog: value }))
                      }
                    ].map((setting, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                        <div>
                          <div className="text-white font-medium text-sm">{setting.label}</div>
                          <div className="text-white/60 text-xs">{setting.description}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.value}
                            onChange={(e) => setting.onChange(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                    ))}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Срок действия пароля (дни)
                        </label>
                        <input
                          type="number"
                          value={securitySettings.passwordExpiry}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/50"
                          min="1"
                          max="365"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Попытки входа
                        </label>
                        <input
                          type="number"
                          value={securitySettings.loginAttempts}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/50"
                          min="1"
                          max="10"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Время сессии (часы)
                        </label>
                        <input
                          type="number"
                          value={securitySettings.sessionLifetime}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionLifetime: parseInt(e.target.value) }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/50"
                          min="1"
                          max="72"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-xl">
                      🔔
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Уведомления</h2>
                      <p className="text-white/60 text-sm">Настройки оповещений и уведомлений</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {Object.entries(notificationSettings).map(([channel, settings]) => (
                      <div key={channel} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <h3 className="text-white font-semibold mb-4 capitalize">
                          {channel === 'email' ? '📧 Email уведомления' :
                           channel === 'push' ? '📱 Push уведомления' :
                           '📱 SMS уведомления'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(settings).map(([type, enabled]) => (
                            <div key={type} className="flex items-center justify-between">
                              <span className="text-white text-sm capitalize">
                                {type === 'appointments' ? 'Записи на прием' :
                                 type === 'reminders' ? 'Напоминания' :
                                 type === 'reports' ? 'Отчеты' :
                                 type === 'security' ? 'Безопасность' :
                                 type === 'emergency' ? 'Экстренные' :
                                 type === 'results' ? 'Результаты' : type}
                              </span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={enabled as boolean}
                                  onChange={(e) => setNotificationSettings(prev => ({
                                    ...prev,
                                    [channel]: {
                                      ...prev[channel as keyof typeof notificationSettings],
                                      [type]: e.target.checked
                                    }
                                  }))}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:ring-4 peer-focus:ring-yellow-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Billing Settings */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-xl">
                      💰
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Биллинг</h2>
                      <p className="text-white/60 text-sm">Настройки платежей и финансов</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Ставка НДС (%)
                        </label>
                        <input
                          type="number"
                          value={billingSettings.taxRate}
                          onChange={(e) => setBillingSettings(prev => ({ ...prev, taxRate: parseInt(e.target.value) }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                          min="0"
                          max="100"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Префикс счетов
                        </label>
                        <input
                          type="text"
                          value={billingSettings.invoicePrefix}
                          onChange={(e) => setBillingSettings(prev => ({ ...prev, invoicePrefix: e.target.value }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                          placeholder="INV"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Штраф за просрочку (%)
                        </label>
                        <input
                          type="number"
                          value={billingSettings.lateFee}
                          onChange={(e) => setBillingSettings(prev => ({ ...prev, lateFee: parseInt(e.target.value) }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                          min="0"
                          max="50"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Методы оплаты
                        </label>
                        <div className="space-y-2">
                          {['card', 'cash', 'insurance', 'bank_transfer'].map((method) => (
                            <label key={method} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={billingSettings.paymentMethods.includes(method)}
                                onChange={(e) => {
                                  const methods = e.target.checked
                                    ? [...billingSettings.paymentMethods, method]
                                    : billingSettings.paymentMethods.filter(m => m !== method);
                                  setBillingSettings(prev => ({ ...prev, paymentMethods: methods }));
                                }}
                                className="rounded bg-white/10 border-white/20"
                              />
                              <span className="text-white text-sm capitalize">
                                {method === 'card' ? '💳 Банковская карта' :
                                 method === 'cash' ? '💵 Наличные' :
                                 method === 'insurance' ? '🏥 Страхование' :
                                 '🏦 Банковский перевод'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                        <div>
                          <div className="text-white font-medium text-sm">Авто-выставление счетов</div>
                          <div className="text-white/60 text-xs">Автоматически создавать счета</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={billingSettings.autoInvoicing}
                            onChange={(e) => setBillingSettings(prev => ({ ...prev, autoInvoicing: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Integrations Settings */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-xl">
                      🔗
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Интеграции</h2>
                      <p className="text-white/60 text-sm">Подключенные сервисы и API</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        name: 'Электронная регистратура',
                        description: 'Интеграция с государственной системой',
                        status: 'connected',
                        icon: '🏥'
                      },
                      {
                        name: 'Платежная система',
                        description: 'Онлайн оплата через Tinkoff',
                        status: 'connected',
                        icon: '💳'
                      },
                      {
                        name: 'СМС уведомления',
                        description: 'Рассылка через SMS.ru',
                        status: 'connected',
                        icon: '📱'
                      },
                      {
                        name: 'Email рассылка',
                        description: 'Mailchimp интеграция',
                        status: 'disconnected',
                        icon: '📧'
                      },
                      {
                        name: 'Google Calendar',
                        description: 'Синхронизация календаря',
                        status: 'disconnected',
                        icon: '📅'
                      }
                    ].map((integration, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                            {integration.icon}
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">{integration.name}</div>
                            <div className="text-white/60 text-xs">{integration.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            integration.status === 'connected' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}>
                            {integration.status === 'connected' ? 'Подключено' : 'Отключено'}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white text-sm transition-all duration-200"
                          >
                            {integration.status === 'connected' ? 'Настроить' : 'Подключить'}
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}