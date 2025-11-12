'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveCard } from '@/components/medicine/InteractiveCard';

// Типы данных
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  age: number;
  gender: 'male' | 'female';
  bloodType: string;
  height: number;
  weight: number;
  bmi: number;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance: {
    provider: string;
    number: string;
    expiryDate: string;
  };
}

interface MedicalHistory {
  id: string;
  condition: string;
  diagnosed: string;
  status: 'active' | 'resolved' | 'chronic';
  severity: 'low' | 'medium' | 'high';
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: string;
  endDate?: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'medical' | 'settings'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Демо-данные пользователя
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    name: 'Иванов Алексей Петрович',
    email: 'alexey.ivanov@email.com',
    phone: '+7 (915) 123-45-67',
    birthDate: '1985-03-15',
    age: 39,
    gender: 'male',
    bloodType: 'A(II) Rh+',
    height: 178,
    weight: 74.5,
    bmi: 23.5,
    address: 'г. Москва, ул. Примерная, д. 123, кв. 45',
    emergencyContact: {
      name: 'Иванова Мария Сергеевна',
      phone: '+7 (916) 765-43-21',
      relationship: 'Супруга'
    },
    insurance: {
      provider: 'Страховая компания "Здоровье"',
      number: 'POL-123456789',
      expiryDate: '2025-12-31'
    }
  });

  const medicalHistory: MedicalHistory[] = [
    {
      id: '1',
      condition: 'Артериальная гипертензия',
      diagnosed: '2020-05-15',
      status: 'chronic',
      severity: 'medium'
    },
    {
      id: '2',
      condition: 'Гастроэзофагеальная рефлюксная болезнь',
      diagnosed: '2022-03-20',
      status: 'active',
      severity: 'low'
    },
    {
      id: '3',
      condition: 'Сезонная аллергия',
      diagnosed: '2018-04-10',
      status: 'active',
      severity: 'low'
    }
  ];

  const medications: Medication[] = [
    {
      id: '1',
      name: 'Амлодипин',
      dosage: '5 мг',
      frequency: '1 раз в день',
      prescribedBy: 'Петрова М.И.',
      startDate: '2023-01-15'
    },
    {
      id: '2',
      name: 'Лизиноприл',
      dosage: '10 мг',
      frequency: '1 раз в день',
      prescribedBy: 'Петрова М.И.',
      startDate: '2023-01-15'
    },
    {
      id: '3',
      name: 'Омепразол',
      dosage: '20 мг',
      frequency: '1 раз в день',
      prescribedBy: 'Козлов Д.С.',
      startDate: '2023-03-20'
    }
  ];

  const allergies = ['Пенициллин', 'Пыльца березы', 'Клубника'];

  // Исправление для гидрации
  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'resolved': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'chronic': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активно';
      case 'resolved': return 'Вылечено';
      case 'chronic': return 'Хроническое';
      default: return status;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return 'Высокая';
      case 'medium': return 'Средняя';
      case 'low': return 'Низкая';
      default: return severity;
    }
  };

  const handleSaveProfile = () => {
    // Здесь будет логика сохранения профиля
    console.log('Saving profile:', userProfile);
    setIsEditing(false);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="animate-pulse">
            <div className="h-6 bg-white/10 rounded w-1/2 mb-4"></div>
            <div className="h-48 bg-white/5 rounded-2xl mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 safe-area-padding">
      <div className="max-w-7xl mx-auto px-3 py-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href="/demo/medicine/user"
                  className="flex items-center gap-1 text-white/60 hover:text-white transition-colors duration-200 text-xs"
                >
                  <span className="text-base">←</span>
                  <span className="hidden xs:inline">Назад к дашборду</span>
                </Link>
              </div>
              <h1 className="text-xl font-bold text-white mb-1">Мой профиль</h1>
              <p className="text-white/60 text-xs">
                Управление личной информацией и настройками
              </p>
            </div>
            
            {!isEditing ? (
              <motion.button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-colors text-blue-400 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>✏️</span>
                <span className="hidden xs:inline">Редактировать</span>
              </motion.button>
            ) : (
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Отмена
                </motion.button>
                <motion.button
                  onClick={handleSaveProfile}
                  className="px-3 py-2 rounded-xl bg-green-500 hover:bg-green-600 transition-colors text-white text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Сохранить
                </motion.button>
              </div>
            )}
          </div>

          {/* User Summary Card */}
          <InteractiveCard className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-2xl">
                👤
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-white text-lg mb-1">{userProfile.name}</h2>
                <p className="text-white/60 text-sm">{userProfile.age} лет • {userProfile.gender === 'male' ? 'Мужской' : 'Женский'}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs border border-green-500/30">
                    Группа крови: {userProfile.bloodType}
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs border border-blue-500/30">
                    ИМТ: {userProfile.bmi}
                  </span>
                </div>
              </div>
            </div>
          </InteractiveCard>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-white/10 mb-6">
          {[
            { id: 'personal', label: '👤 Личные данные', icon: '👤' },
            { id: 'medical', label: '🏥 Медицинская информация', icon: '🏥' },
            { id: 'settings', label: '⚙️ Настройки', icon: '⚙️' }
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors flex-shrink-0 ${
                activeTab === id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <span className="text-sm">{icon}</span>
              <span className="text-sm font-medium whitespace-nowrap">{label.split(' ')[1]}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab === 'personal' && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Personal Information */}
                  <InteractiveCard className="p-4">
                    <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
                      <span>📝</span>
                      <span>Личная информация</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/60 text-xs mb-2">ФИО</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={userProfile.name}
                            onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 text-white text-sm"
                          />
                        ) : (
                          <div className="text-white font-medium text-sm">{userProfile.name}</div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-white/60 text-xs mb-2">Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={userProfile.email}
                            onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 text-white text-sm"
                          />
                        ) : (
                          <div className="text-white font-medium text-sm">{userProfile.email}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-white/60 text-xs mb-2">Телефон</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={userProfile.phone}
                            onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 text-white text-sm"
                          />
                        ) : (
                          <div className="text-white font-medium text-sm">{userProfile.phone}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-white/60 text-xs mb-2">Дата рождения</label>
                        <div className="text-white font-medium text-sm">
                          {formatDate(userProfile.birthDate)} ({userProfile.age} лет)
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-white/60 text-xs mb-2">Адрес</label>
                        {isEditing ? (
                          <textarea
                            value={userProfile.address}
                            onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                            rows={2}
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 text-white text-sm resize-none"
                          />
                        ) : (
                          <div className="text-white font-medium text-sm">{userProfile.address}</div>
                        )}
                      </div>
                    </div>
                  </InteractiveCard>

                  {/* Physical Parameters */}
                  <InteractiveCard className="p-4">
                    <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
                      <span>📊</span>
                      <span>Физические параметры</span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 rounded-xl bg-white/5">
                        <div className="text-white font-bold text-lg">{userProfile.height} см</div>
                        <div className="text-white/60 text-xs">Рост</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white/5">
                        <div className="text-white font-bold text-lg">{userProfile.weight} кг</div>
                        <div className="text-white/60 text-xs">Вес</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white/5">
                        <div className="text-white font-bold text-lg">{userProfile.bmi}</div>
                        <div className="text-white/60 text-xs">ИМТ</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white/5">
                        <div className="text-white font-bold text-lg">{userProfile.bloodType}</div>
                        <div className="text-white/60 text-xs">Группа крови</div>
                      </div>
                    </div>
                  </InteractiveCard>

                  {/* Emergency Contact */}
                  <InteractiveCard className="p-4">
                    <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
                      <span>🚨</span>
                      <span>Экстренный контакт</span>
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                        <div>
                          <div className="text-white font-medium text-sm">{userProfile.emergencyContact.name}</div>
                          <div className="text-white/60 text-xs">{userProfile.emergencyContact.relationship}</div>
                        </div>
                        <div className="text-blue-400 font-medium text-sm">{userProfile.emergencyContact.phone}</div>
                      </div>
                    </div>
                  </InteractiveCard>
                </motion.div>
              )}

              {activeTab === 'medical' && (
                <motion.div
                  key="medical"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Medical History */}
                  <InteractiveCard className="p-4">
                    <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
                      <span>📋</span>
                      <span>История болезней</span>
                    </h3>
                    <div className="space-y-3">
                      {medicalHistory.map((condition) => (
                        <div key={condition.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <div className="text-white font-medium text-sm mb-1">{condition.condition}</div>
                              <div className="text-white/60 text-xs">
                                Диагностировано: {formatDate(condition.diagnosed)}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <span className={`px-2 py-1 rounded-lg text-xs border ${getStatusColor(condition.status)}`}>
                                {getStatusText(condition.status)}
                              </span>
                              <span className={`px-2 py-1 rounded-lg text-xs border ${getSeverityColor(condition.severity)}`}>
                                {getSeverityText(condition.severity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </InteractiveCard>

                  {/* Current Medications */}
                  <InteractiveCard className="p-4">
                    <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
                      <span>💊</span>
                      <span>Текущие назначения</span>
                    </h3>
                    <div className="space-y-3">
                      {medications.map((med) => (
                        <div key={med.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="text-white font-medium text-sm">{med.name}</div>
                              <div className="text-white/60 text-xs">{med.dosage} • {med.frequency}</div>
                            </div>
                            <div className="text-blue-400 text-xs text-right">
                              {formatDate(med.startDate)}
                            </div>
                          </div>
                          <div className="text-white/60 text-xs">
                            Назначил: {med.prescribedBy}
                          </div>
                        </div>
                      ))}
                    </div>
                  </InteractiveCard>

                  {/* Allergies */}
                  <InteractiveCard className="p-4">
                    <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
                      <span>⚠️</span>
                      <span>Аллергии</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm border border-red-500/30"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </InteractiveCard>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Notification Settings */}
                  <InteractiveCard className="p-4">
                    <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
                      <span>🔔</span>
                      <span>Уведомления</span>
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Напоминания о приемах', enabled: true },
                        { label: 'Уведомления о результатах анализов', enabled: true },
                        { label: 'Новости и обновления', enabled: false },
                        { label: 'Рекомендации по здоровью', enabled: true }
                      ].map((setting, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-white text-sm">{setting.label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked={setting.enabled} />
                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </InteractiveCard>

                  {/* Privacy Settings */}
                  <InteractiveCard className="p-4">
                    <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
                      <span>🔒</span>
                      <span>Конфиденциальность</span>
                    </h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white text-sm">
                        📊 Настройки обмена медицинскими данными
                      </button>
                      <button className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white text-sm">
                        👥 Управление доступом для родственников
                      </button>
                      <button className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white text-sm">
                        📄 Экспорт медицинских данных
                      </button>
                    </div>
                  </InteractiveCard>

                  {/* Account Actions */}
                  <InteractiveCard className="p-4 border-red-500/20 bg-red-500/5">
                    <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
                      <span>⚙️</span>
                      <span>Действия с аккаунтом</span>
                    </h3>
                    <div className="space-y-2">
                      <button className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-yellow-400 text-sm">
                        🔐 Сменить пароль
                      </button>
                      <button className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-red-400 text-sm">
                        🚪 Выйти из аккаунта
                      </button>
                      <button className="w-full text-left p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400 text-sm border border-red-500/20">
                        🗑️ Удалить аккаунт
                      </button>
                    </div>
                  </InteractiveCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Insurance Info */}
            <InteractiveCard className="p-4">
              <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                <span>🏥</span>
                <span>Страхование</span>
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="text-white font-medium text-sm mb-1">{userProfile.insurance.provider}</div>
                  <div className="text-white/60 text-xs mb-2">№ {userProfile.insurance.number}</div>
                  <div className="text-white/60 text-xs">
                    Действует до: {formatDate(userProfile.insurance.expiryDate)}
                  </div>
                </div>
              </div>
            </InteractiveCard>

            {/* Quick Stats */}
            <InteractiveCard className="p-4">
              <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                <span>📈</span>
                <span>Статистика</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                  <span className="text-white/60 text-xs">Консультаций</span>
                  <span className="text-white font-medium text-sm">12</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                  <span className="text-white/60 text-xs">Анализов</span>
                  <span className="text-white font-medium text-sm">8</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                  <span className="text-white/60 text-xs">Назначений</span>
                  <span className="text-white font-medium text-sm">5</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                  <span className="text-white/60 text-xs">В клинике</span>
                  <span className="text-white font-medium text-sm">2 года</span>
                </div>
              </div>
            </InteractiveCard>

            {/* Support */}
            <InteractiveCard className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
              <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                <span>💬</span>
                <span>Поддержка</span>
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-white text-xs">Техподдержка</span>
                  <span className="text-white/60 text-xs">support@clinic.ru</span>
                </button>
                <button className="w-full flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-white text-xs">Регистратура</span>
                  <span className="text-white/60 text-xs">+7 (495) 123-45-67</span>
                </button>
              </div>
            </InteractiveCard>
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .safe-area-padding {
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}