'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'activity'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isClient, setIsClient] = useState(false);

  // Данные профиля
  const [profile, setProfile] = useState({
    firstName: 'Александр',
    lastName: 'Петров',
    position: 'Владелец и главный врач',
    email: 'a.petrov@healthplus.ru',
    phone: '+7 (912) 345-67-89',
    specialization: 'Терапевт, Кардиолог',
    experience: '15 лет',
    education: 'Первый МГМУ им. И.М. Сеченова',
    bio: 'Специалист с многолетним опытом работы в терапевтии и кардиологии. Автор научных публикаций и участник международных медицинских конференций.',
    department: 'Управление',
    joinDate: '2018-03-15',
    lastActive: '2024-01-24T14:30:00'
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: true,
    lastPasswordChange: '2024-01-15',
    loginAttempts: 0,
    activeSessions: 2
  });

  const [preferences, setPreferences] = useState({
    language: 'ru',
    timezone: 'Europe/Moscow',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    theme: 'dark'
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    // Имитация сохранения
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSaveStatus('success');
    setIsSaving(false);
    setIsEditing(false);
    
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // В реальном приложении здесь был бы сброс к исходным значениям
  };

  // Статистика активности
  const activityStats = useMemo(() => [
    { label: 'Всего пациентов', value: '2,847', icon: '👥', change: '+12.5%' },
    { label: 'Приёмов за месяц', value: '156', icon: '📅', change: '+8.2%' },
    { label: 'Выручка', value: '1.2M ₽', icon: '💰', change: '+15.3%' },
    { label: 'Удовлетворённость', value: '4.8/5', icon: '⭐', change: '+0.2' },
    { label: 'Активных врачей', value: '24', icon: '👨‍⚕️', change: '+2' },
    { label: 'Загрузка клиники', value: '84%', icon: '📊', change: '+5.1%' }
  ], []);

  const recentActivity = [
    { action: 'Добавлен новый пациент', time: '2 часа назад', type: 'patient' },
    { action: 'Создан финансовый отчёт', time: 'Сегодня, 10:30', type: 'report' },
    { action: 'Обновлено расписание', time: 'Вчера, 16:45', type: 'schedule' },
    { action: 'Проведён медосмотр', time: 'Вчера, 14:20', type: 'examination' },
    { action: 'Назначено лечение', time: '24 янв, 11:15', type: 'treatment' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'patient': return '👥';
      case 'report': return '📊';
      case 'schedule': return '📅';
      case 'examination': return '🏥';
      case 'treatment': return '💊';
      default: return '📝';
    }
  };

  const formatDate = (dateString: string) => {
    if (!isClient) return dateString;
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const formatDateTime = (dateTimeString: string) => {
    if (!isClient) return dateTimeString;
    return new Date(dateTimeString).toLocaleString('ru-RU');
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
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl lg:text-3xl text-white shadow-lg">
                👨‍⚕️
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl lg:text-3xl font-bold text-white mb-1 lg:mb-2 truncate">
                  Профиль сотрудника
                </h1>
                <p className="text-white/60 text-sm lg:text-base truncate">
                  Личная информация и настройки аккаунта
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {isEditing ? (
                <>
                  <motion.button
                    onClick={handleCancelEdit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-medium text-sm transition-all duration-200"
                  >
                    Отмена
                  </motion.button>
                  <motion.button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium text-sm transition-all duration-200 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Сохранение...</span>
                      </>
                    ) : (
                      <>
                        <span>💾</span>
                        <span>Сохранить</span>
                      </>
                    )}
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium text-sm transition-all duration-200 flex items-center gap-2"
                  >
                    <span>✏️</span>
                    <span>Редактировать</span>
                  </motion.button>
                  <Link
                    href="/demo/medicine/owner"
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span>←</span>
                    <span>Назад</span>
                  </Link>
                </>
              )}
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
                ✅ Профиль успешно обновлен
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4">
            {activityStats.map((stat, index) => (
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
                      {stat.label}
                    </h3>
                    <p className="text-lg lg:text-xl font-bold text-white mt-1 truncate">
                      {stat.value}
                    </p>
                  </div>
                  <div className="text-xl lg:text-2xl ml-2 group-hover:scale-110 transition-transform duration-200 text-blue-400">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-green-400 text-xs lg:text-sm">
                  {stat.change}
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
            className="lg:col-span-1 space-y-4 lg:space-y-6"
          >
            {/* Profile Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm text-center">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl lg:text-3xl text-white mx-auto mb-4 shadow-lg">
                👨‍⚕️
              </div>
              <h2 className="text-lg lg:text-xl font-bold text-white mb-1">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-white/60 text-sm mb-3">{profile.position}</p>
              <div className="flex items-center justify-center gap-2 text-white/40 text-xs mb-4">
                <span>📅 В команде с {formatDate(profile.joinDate)}</span>
              </div>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <span>📧</span>
                  <span className="truncate">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <span>📞</span>
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <span>🏥</span>
                  <span className="truncate">{profile.department}</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span>📋</span>
                Навигация
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'profile', label: 'Профиль', icon: '👤' },
                  { id: 'security', label: 'Безопасность', icon: '🔒' },
                  { id: 'preferences', label: 'Настройки', icon: '⚙️' },
                  { id: 'activity', label: 'Активность', icon: '📊' }
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center gap-3 group ${
                      activeTab === item.id
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg'
                        : 'bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white/80'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <span>⚡</span>
                Быстрые действия
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  { icon: '📅', label: 'Моё расписание', action: () => console.log('Schedule') },
                  { icon: '👥', label: 'Мои пациенты', action: () => console.log('Patients') },
                  { icon: '📊', label: 'Мои отчёты', action: () => console.log('Reports') },
                  { icon: '⚙️', label: 'Настройки клиники', action: () => console.log('Settings') }
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={action.action}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 flex items-center gap-3 text-blue-300"
                  >
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
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
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl">
                      👤
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Личная информация</h2>
                      <p className="text-white/60 text-sm">Основные данные профиля</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Имя
                        </label>
                        <input
                          type="text"
                          value={profile.firstName}
                          onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Фамилия
                        </label>
                        <input
                          type="text"
                          value={profile.lastName}
                          onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Должность
                        </label>
                        <input
                          type="text"
                          value={profile.position}
                          onChange={(e) => setProfile(prev => ({ ...prev, position: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Телефон
                        </label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Специализация
                        </label>
                        <input
                          type="text"
                          value={profile.specialization}
                          onChange={(e) => setProfile(prev => ({ ...prev, specialization: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Опыт работы
                        </label>
                        <input
                          type="text"
                          value={profile.experience}
                          onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Образование
                        </label>
                        <input
                          type="text"
                          value={profile.education}
                          onChange={(e) => setProfile(prev => ({ ...prev, education: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      О себе
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-xl">
                      🔒
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Безопасность</h2>
                      <p className="text-white/60 text-sm">Настройки безопасности аккаунта</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <div className="text-white font-medium text-sm">Двухфакторная аутентификация</div>
                        <div className="text-white/60 text-xs">Дополнительная защита аккаунта</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={security.twoFactorEnabled}
                          onChange={(e) => setSecurity(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-white/60 text-sm mb-1">Последняя смена пароля</div>
                        <div className="text-white font-medium">{formatDate(security.lastPasswordChange)}</div>
                      </div>

                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-white/60 text-sm mb-1">Активные сессии</div>
                        <div className="text-white font-medium">{security.activeSessions}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-medium text-sm transition-all duration-200 flex items-center justify-between"
                      >
                        <span>Сменить пароль</span>
                        <span>→</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-medium text-sm transition-all duration-200 flex items-center justify-between"
                      >
                        <span>Управление сессиями</span>
                        <span>→</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-4 rounded-xl bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 font-medium text-sm transition-all duration-200 flex items-center justify-between"
                      >
                        <span>Экспорт данных</span>
                        <span>→</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-xl">
                      ⚙️
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Настройки</h2>
                      <p className="text-white/60 text-sm">Персональные предпочтения</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Язык интерфейса
                        </label>
                        <select
                          value={preferences.language}
                          onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-yellow-500/50"
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
                          value={preferences.timezone}
                          onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-yellow-500/50"
                        >
                          <option value="Europe/Moscow">Москва (UTC+3)</option>
                          <option value="Europe/London">Лондон (UTC+0)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Формат даты
                        </label>
                        <select
                          value={preferences.dateFormat}
                          onChange={(e) => setPreferences(prev => ({ ...prev, dateFormat: e.target.value }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-yellow-500/50"
                        >
                          <option value="DD.MM.YYYY">DD.MM.YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          label: 'Email уведомления',
                          value: preferences.emailNotifications,
                          onChange: (value: boolean) => setPreferences(prev => ({ ...prev, emailNotifications: value }))
                        },
                        {
                          label: 'Push уведомления',
                          value: preferences.pushNotifications,
                          onChange: (value: boolean) => setPreferences(prev => ({ ...prev, pushNotifications: value }))
                        },
                        {
                          label: 'SMS уведомления',
                          value: preferences.smsNotifications,
                          onChange: (value: boolean) => setPreferences(prev => ({ ...prev, smsNotifications: value }))
                        },
                        {
                          label: 'Авто-бэкап',
                          value: preferences.autoBackup,
                          onChange: (value: boolean) => setPreferences(prev => ({ ...prev, autoBackup: value }))
                        }
                      ].map((setting, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-white text-sm">{setting.label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={setting.value}
                              onChange={(e) => setting.onChange(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:ring-4 peer-focus:ring-yellow-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-xl">
                      📊
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Активность</h2>
                      <p className="text-white/60 text-sm">История действий и статистика</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <span>🕒</span>
                        Последние действия
                      </h3>
                      <div className="space-y-3">
                        {recentActivity.map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-sm">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium text-sm">
                                {activity.action}
                              </div>
                              <div className="text-white/60 text-xs">
                                {activity.time}
                              </div>
                            </div>
                            <motion.span
                              whileHover={{ x: 2 }}
                              className="text-white/40 group-hover:text-white transition-colors"
                            >
                              →
                            </motion.span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-white/60 text-sm mb-1">Последняя активность</div>
                        <div className="text-white font-medium">
                          {formatDateTime(profile.lastActive)}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-white/60 text-sm mb-1">Статус системы</div>
                        <div className="text-green-400 font-medium flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          Активен
                        </div>
                      </div>
                    </div>
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