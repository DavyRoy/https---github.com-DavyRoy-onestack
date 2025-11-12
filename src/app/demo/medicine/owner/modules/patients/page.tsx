'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Mock данные для пациентов
const patientsData = {
  summary: {
    totalPatients: 2847,
    activePatients: 2156,
    newThisMonth: 156,
    appointmentsToday: 42,
    satisfactionRate: 4.7,
    averageWaitTime: 12
  },
  patients: [
    {
      id: 'pat-1',
      patientId: 'P-001234',
      firstName: 'Анна',
      lastName: 'Иванова',
      email: 'anna.ivanova@email.ru',
      phone: '+7 (912) 345-67-89',
      dateOfBirth: '1985-03-15',
      gender: 'female',
      bloodType: 'A+',
      insurance: 'ОМС',
      status: 'active',
      lastVisit: '2024-01-24',
      nextAppointment: '2024-02-15',
      primaryDoctor: 'Петров А.В.',
      conditions: ['Гипертония', 'Сахарный диабет 2 типа'],
      allergies: ['Пенициллин', 'Пыльца'],
      medications: ['Метформин 500mg', 'Лизиноприл 10mg'],
      notes: 'Регулярно наблюдается, соблюдает рекомендации'
    },
    {
      id: 'pat-2',
      patientId: 'P-001235',
      firstName: 'Дмитрий',
      lastName: 'Петров',
      email: 'dmitry.petrov@email.ru',
      phone: '+7 (912) 345-67-90',
      dateOfBirth: '1978-11-22',
      gender: 'male',
      bloodType: 'O-',
      insurance: 'ДМС',
      status: 'active',
      lastVisit: '2024-01-23',
      nextAppointment: null,
      primaryDoctor: 'Сидорова М.И.',
      conditions: ['ИБС', 'Гиперхолестеринемия'],
      allergies: [],
      medications: ['Аторвастатин 20mg', 'Аспирин 100mg'],
      notes: 'Рекомендована диета и физическая активность'
    },
    {
      id: 'pat-3',
      patientId: 'P-001236',
      firstName: 'Елена',
      lastName: 'Сидорова',
      email: 'elena.sidorova@email.ru',
      phone: '+7 (912) 345-67-91',
      dateOfBirth: '1992-07-08',
      gender: 'female',
      bloodType: 'B+',
      insurance: 'ОМС',
      status: 'inactive',
      lastVisit: '2023-12-15',
      nextAppointment: null,
      primaryDoctor: 'Иванова Е.С.',
      conditions: ['Мигрень'],
      allergies: ['НПВС'],
      medications: ['Суматриптан 50mg'],
      notes: 'Обращается эпизодически при обострениях'
    },
    {
      id: 'pat-4',
      patientId: 'P-001237',
      firstName: 'Сергей',
      lastName: 'Козлов',
      email: 'sergey.kozlov@email.ru',
      phone: '+7 (912) 345-67-92',
      dateOfBirth: '1965-09-30',
      gender: 'male',
      bloodType: 'AB+',
      insurance: 'ДМС',
      status: 'active',
      lastVisit: '2024-01-22',
      nextAppointment: '2024-01-29',
      primaryDoctor: 'Петров А.В.',
      conditions: ['ХОБЛ', 'Артериальная гипертензия'],
      allergies: ['Пыль', 'Шерсть животных'],
      medications: ['Сальбутамол ингалятор', 'Амлодипин 5mg'],
      notes: 'Требуется регулярный мониторинг функции легких'
    },
    {
      id: 'pat-5',
      patientId: 'P-001238',
      firstName: 'Ольга',
      lastName: 'Николаева',
      email: 'olga.nikolaeva@email.ru',
      phone: '+7 (912) 345-67-93',
      dateOfBirth: '1972-12-14',
      gender: 'female',
      bloodType: 'A-',
      insurance: 'ОМС',
      status: 'active',
      lastVisit: '2024-01-21',
      nextAppointment: '2024-02-28',
      primaryDoctor: 'Сидорова М.И.',
      conditions: ['Остеоартрит', 'Остеопороз'],
      allergies: ['Молочные продукты'],
      medications: ['Кальций + D3', 'Парацетамол 500mg'],
      notes: 'Рекомендована ЛФК и плавание'
    },
    {
      id: 'pat-6',
      patientId: 'P-001239',
      firstName: 'Михаил',
      lastName: 'Орлов',
      email: 'mikhail.orlov@email.ru',
      phone: '+7 (912) 345-67-94',
      dateOfBirth: '1988-05-19',
      gender: 'male',
      bloodType: 'O+',
      insurance: 'ДМС',
      status: 'new',
      lastVisit: '2024-01-24',
      nextAppointment: '2024-02-01',
      primaryDoctor: 'Иванова Е.С.',
      conditions: ['Бронхиальная астма'],
      allergies: ['Пыльца березы', 'Амброзия'],
      medications: ['Будесонид ингалятор'],
      notes: 'Новый пациент, требуется обучение использованию ингалятора'
    }
  ],
  demographics: {
    byAge: [
      { group: '0-17', count: 285, percentage: 10 },
      { group: '18-35', count: 854, percentage: 30 },
      { group: '36-50', count: 1139, percentage: 40 },
      { group: '51-65', count: 427, percentage: 15 },
      { group: '65+', count: 142, percentage: 5 }
    ],
    byGender: [
      { gender: 'Мужчины', count: 1256, percentage: 44 },
      { gender: 'Женщины', count: 1591, percentage: 56 }
    ],
    byInsurance: [
      { type: 'ОМС', count: 1993, percentage: 70 },
      { type: 'ДМС', count: 854, percentage: 30 }
    ]
  },
  conditions: [
    { name: 'Артериальная гипертензия', count: 856, percentage: 30 },
    { name: 'Сахарный диабет', count: 427, percentage: 15 },
    { name: 'ИБС', count: 342, percentage: 12 },
    { name: 'Остеоартрит', count: 285, percentage: 10 },
    { name: 'Бронхиальная астма', count: 228, percentage: 8 },
    { name: 'ХОБЛ', count: 171, percentage: 6 }
  ]
};

export default function PatientsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'list' | 'demographics' | 'conditions'>('overview');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [insuranceFilter, setInsuranceFilter] = useState<string>('all');
  const [isClient, setIsClient] = useState(false);

  const { summary, patients, demographics, conditions } = patientsData;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Форматирование даты
  const formatDate = (dateString: string | null) => {
    if (!dateString || !isClient) return 'Не назначен';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  // Фильтрация пациентов
  const filteredPatients = useMemo(() => 
    patients.filter(patient => {
      const matchesSearch = patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
      const matchesInsurance = insuranceFilter === 'all' || patient.insurance === insuranceFilter;
      
      return matchesSearch && matchesStatus && matchesInsurance;
    }),
    [searchTerm, statusFilter, insuranceFilter]
  );

  // Статистика пациентов
  const patientStats = useMemo(() => [
    {
      title: 'Всего пациентов',
      value: summary.totalPatients.toLocaleString('ru-RU'),
      change: '+12.5%',
      icon: '👥',
      color: 'from-blue-500 to-cyan-500',
      description: 'В базе данных'
    },
    {
      title: 'Активные',
      value: summary.activePatients.toLocaleString('ru-RU'),
      change: '+8.2%',
      icon: '✅',
      color: 'from-green-500 to-emerald-500',
      description: 'Регулярно посещают'
    },
    {
      title: 'Новые за месяц',
      value: summary.newThisMonth.toString(),
      change: '+15.3%',
      icon: '🆕',
      color: 'from-purple-500 to-indigo-500',
      description: 'Новые пациенты'
    },
    {
      title: 'Приёмы сегодня',
      value: summary.appointmentsToday.toString(),
      change: '+5.1%',
      icon: '📅',
      color: 'from-orange-500 to-red-500',
      description: 'Запланировано'
    },
    {
      title: 'Удовлетворённость',
      value: `${summary.satisfactionRate}/5`,
      change: '+0.2',
      icon: '⭐',
      color: 'from-yellow-500 to-amber-500',
      description: 'Средняя оценка'
    },
    {
      title: 'Среднее ожидание',
      value: `${summary.averageWaitTime} мин`,
      change: '-2.3%',
      icon: '⏱️',
      color: 'from-pink-500 to-rose-500',
      description: 'Время приёма'
    }
  ], [summary]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-white/5 text-white/60 border-white/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'inactive': return 'Неактивен';
      case 'new': return 'Новый';
      default: return status;
    }
  };

  const getGenderIcon = (gender: string) => {
    return gender === 'male' ? '👨' : '👩';
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
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-2xl lg:text-3xl">
                🏥
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl lg:text-3xl font-bold text-white mb-1 lg:mb-2 truncate">
                  Управление пациентами
                </h1>
                <p className="text-white/60 text-sm lg:text-base truncate">
                  База пациентов, медицинские карты и аналитика
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 text-sm font-medium text-white flex items-center gap-2"
              >
                <span>📊</span>
                <span>Отчёт</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 transition-all duration-200 text-sm font-medium text-white flex items-center gap-2"
              >
                <span>+</span>
                <span>Новый пациент</span>
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

          {/* Patient Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4">
            {patientStats.map((stat, index) => (
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
                    stat.color.includes('orange') ? 'text-orange-400' :
                    stat.color.includes('yellow') ? 'text-yellow-400' : 'text-pink-400'
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
          className="flex bg-white/5 rounded-xl lg:rounded-2xl p-1 border border-white/10 mb-4 lg:mb-6 overflow-x-auto"
        >
          {[
            { value: 'overview', label: 'Обзор', icon: '📊' },
            { value: 'list', label: 'Список пациентов', icon: '👥' },
            { value: 'demographics', label: 'Демография', icon: '📈' },
            { value: 'conditions', label: 'Заболевания', icon: '🏥' }
          ].map(({ value, label, icon }) => (
            <motion.button
              key={value}
              onClick={() => setActiveTab(value as any)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-3 rounded-lg lg:rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === value
                  ? 'bg-teal-500 text-white shadow-lg'
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
                {/* Recent Patients & Demographics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* Recent Patients */}
                  <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <span>🆕</span>
                      Последние пациенты
                    </h3>
                    <div className="space-y-3">
                      {patients.slice(0, 5).map((patient, index) => (
                        <motion.div
                          key={patient.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                          onClick={() => setSelectedPatient(patient)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-xl">
                              {getGenderIcon(patient.gender)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium text-sm truncate">
                                {patient.firstName} {patient.lastName}
                              </div>
                              <div className="text-white/60 text-xs truncate">
                                {patient.patientId} • {formatDate(patient.lastVisit)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(patient.status)}`}>
                              {getStatusText(patient.status)}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Age Distribution */}
                  <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <span>📊</span>
                      Распределение по возрасту
                    </h3>
                    <div className="space-y-3">
                      {demographics.byAge.map((ageGroup, index) => (
                        <motion.div
                          key={ageGroup.group}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                        >
                          <span className="text-white/60 text-sm">{ageGroup.group}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-20 bg-white/10 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${ageGroup.percentage}%` }}
                              />
                            </div>
                            <span className="text-white font-medium text-sm w-8">{ageGroup.percentage}%</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Common Conditions & Insurance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* Common Conditions */}
                  <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <span>🏥</span>
                      Распространённые заболевания
                    </h3>
                    <div className="space-y-3">
                      {conditions.slice(0, 5).map((condition, index) => (
                        <motion.div
                          key={condition.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium text-sm truncate">
                              {condition.name}
                            </div>
                            <div className="text-white/60 text-xs">
                              {condition.count} пациентов
                            </div>
                          </div>
                          <div className="text-teal-400 font-medium text-sm">
                            {condition.percentage}%
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Insurance Distribution */}
                  <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <span>📋</span>
                      Типы страхования
                    </h3>
                    <div className="space-y-3">
                      {demographics.byInsurance.map((insurance, index) => (
                        <motion.div
                          key={insurance.type}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                        >
                          <span className="text-white/60 text-sm">{insurance.type}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-20 bg-white/10 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${insurance.percentage}%` }}
                              />
                            </div>
                            <span className="text-white font-medium text-sm w-8">{insurance.percentage}%</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'list' && (
              <div className="space-y-4 lg:space-y-6">
                {/* Filters and Search */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-teal-500/50"
                    >
                      <option value="all">Все статусы</option>
                      <option value="active">Активные</option>
                      <option value="inactive">Неактивные</option>
                      <option value="new">Новые</option>
                    </select>
                    
                    <select
                      value={insuranceFilter}
                      onChange={(e) => setInsuranceFilter(e.target.value)}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-teal-500/50"
                    >
                      <option value="all">Все типы страхования</option>
                      <option value="ОМС">ОМС</option>
                      <option value="ДМС">ДМС</option>
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Поиск по имени, ID или email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-teal-500/50 placeholder-white/40"
                    />
                  </div>
                </div>

                {/* Patients Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {filteredPatients.map((patient, index) => (
                    <motion.div
                      key={patient.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedPatient(patient)}
                      className="rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 cursor-pointer group backdrop-blur-sm"
                    >
                      <div className="p-4 lg:p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">
                              {getGenderIcon(patient.gender)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white text-base lg:text-lg truncate">
                                {patient.firstName} {patient.lastName}
                              </h3>
                              <p className="text-white/60 text-sm truncate">
                                {patient.patientId}
                              </p>
                              <p className="text-white/40 text-xs truncate">
                                {patient.email}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status)}`}>
                              {getStatusText(patient.status)}
                            </span>
                            <div className="text-white/60 text-xs">
                              {patient.insurance}
                            </div>
                          </div>
                        </div>

                        {/* Patient Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Телефон:</span>
                            <span className="text-white font-medium">{patient.phone}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Группа крови:</span>
                            <span className="text-white font-medium">{patient.bloodType}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Врач:</span>
                            <span className="text-white font-medium truncate ml-2">{patient.primaryDoctor}</span>
                          </div>
                        </div>

                        {/* Conditions */}
                        <div className="mb-4">
                          <div className="text-white/60 text-xs mb-2">Заболевания:</div>
                          <div className="flex flex-wrap gap-1">
                            {patient.conditions.slice(0, 2).map((condition: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs"
                              >
                                {condition}
                              </span>
                            ))}
                            {patient.conditions.length > 2 && (
                              <span className="px-2 py-1 rounded-full bg-white/5 text-white/60 border border-white/10 text-xs">
                                +{patient.conditions.length - 2}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="text-white/60 text-xs lg:text-sm">
                            Последний визит: {formatDate(patient.lastVisit)}
                          </div>
                          <div className="text-white/60 group-hover:text-white transition-colors text-xs lg:text-sm">
                            Подробнее →
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {filteredPatients.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="col-span-3 text-center py-8 lg:py-12"
                    >
                      <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-white/10 flex items-center justify-center text-xl lg:text-2xl mb-4 mx-auto">
                        👥
                      </div>
                      <h3 className="text-base lg:text-lg font-semibold text-white mb-2">Пациенты не найдены</h3>
                      <p className="text-white/60 text-sm">Попробуйте изменить параметры поиска или фильтрации</p>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'demographics' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Age Distribution */}
                <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span>📊</span>
                    Распределение по возрасту
                  </h3>
                  <div className="space-y-3">
                    {demographics.byAge.map((ageGroup, index) => (
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
                              className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
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
                <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span>👥</span>
                    Распределение по полу
                  </h3>
                  <div className="space-y-3">
                    {demographics.byGender.map((gender, index) => (
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

                {/* Insurance Distribution */}
                <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span>📋</span>
                    Типы страхования
                  </h3>
                  <div className="space-y-3">
                    {demographics.byInsurance.map((insurance, index) => (
                      <motion.div
                        key={insurance.type}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                      >
                        <span className="text-white/60 text-sm">{insurance.type}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-20 bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${insurance.percentage}%` }}
                            />
                          </div>
                          <span className="text-white font-medium text-sm w-8">{insurance.percentage}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'conditions' && (
              <div className="space-y-4 lg:space-y-6">
                {/* Common Conditions */}
                <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span>🏥</span>
                    Распространённые заболевания
                  </h3>
                  <div className="space-y-3">
                    {conditions.map((condition, index) => (
                      <motion.div
                        key={condition.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium text-sm truncate">
                              {condition.name}
                            </div>
                            <div className="text-white/60 text-xs truncate">
                              {condition.count} пациентов
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-3">
                          <div className="text-white font-medium text-sm">
                            {condition.percentage}%
                          </div>
                          <div className="text-white/60 text-xs">
                            от общей базы
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Patient Detail Modal */}
        <AnimatePresence>
          {selectedPatient && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 lg:p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-sm"
              >
                <div className="p-4 lg:p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl lg:text-2xl font-bold text-white">Медицинская карта пациента</h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedPatient(null)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200"
                    >
                      ✕
                    </motion.button>
                  </div>
                </div>

                <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-4 lg:gap-6">
                        <div className="text-4xl lg:text-5xl">
                          {getGenderIcon(selectedPatient.gender)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg lg:text-2xl font-bold text-white truncate">
                            {selectedPatient.firstName} {selectedPatient.lastName}
                          </h3>
                          <p className="text-white/60 text-base lg:text-lg truncate">
                            {selectedPatient.patientId} • {selectedPatient.insurance}
                          </p>
                          <p className="text-white/40 text-sm truncate">{selectedPatient.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 lg:p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-white/60 text-sm">Статус</div>
                        <div className={`inline-flex px-2 lg:px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedPatient.status)}`}>
                          {getStatusText(selectedPatient.status)}
                        </div>
                      </div>
                      
                      <div className="p-3 lg:p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-white/60 text-sm">Группа крови</div>
                        <div className="text-white font-medium text-base lg:text-lg">
                          {selectedPatient.bloodType}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="font-semibold text-white mb-3 lg:mb-4 flex items-center gap-2">
                      <span>📞</span>
                      Контактная информация
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                      {[
                        { label: 'Телефон', value: selectedPatient.phone },
                        { label: 'Email', value: selectedPatient.email },
                        { label: 'Дата рождения', value: formatDate(selectedPatient.dateOfBirth) },
                        { label: 'Основной врач', value: selectedPatient.primaryDoctor }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 lg:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                        >
                          <div className="text-white/60 text-sm mb-1">{item.label}</div>
                          <div className="text-white font-medium text-sm lg:text-base">{item.value}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {/* Conditions */}
                    <div>
                      <h4 className="font-semibold text-white mb-3 lg:mb-4 flex items-center gap-2">
                        <span>🏥</span>
                        Заболевания
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.conditions.map((condition: string, index: number) => (
                          <motion.span
                            key={condition}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="px-3 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-sm"
                          >
                            {condition}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Allergies */}
                    <div>
                      <h4 className="font-semibold text-white mb-3 lg:mb-4 flex items-center gap-2">
                        <span>⚠️</span>
                        Аллергии
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.allergies.length > 0 ? (
                          selectedPatient.allergies.map((allergy: string, index: number) => (
                            <motion.span
                              key={allergy}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="px-3 py-2 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-sm"
                            >
                              {allergy}
                            </motion.span>
                          ))
                        ) : (
                          <span className="text-white/60 text-sm">Нет известных аллергий</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Medications */}
                  <div>
                    <h4 className="font-semibold text-white mb-3 lg:mb-4 flex items-center gap-2">
                      <span>💊</span>
                      Лекарства
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.medications.map((medication: string, index: number) => (
                        <motion.span
                          key={medication}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="px-3 py-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 text-sm"
                        >
                          {medication}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Visit Information */}
                  <div>
                    <h4 className="font-semibold text-white mb-3 lg:mb-4 flex items-center gap-2">
                      <span>📅</span>
                      Информация о визитах
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                      <div className="p-3 lg:p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-white/60 text-sm mb-1">Последний визит</div>
                        <div className="text-white font-medium">{formatDate(selectedPatient.lastVisit)}</div>
                      </div>
                      <div className="p-3 lg:p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-white/60 text-sm mb-1">Следующий приём</div>
                        <div className="text-white font-medium">{formatDate(selectedPatient.nextAppointment)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h4 className="font-semibold text-white mb-3 lg:mb-4 flex items-center gap-2">
                      <span>📝</span>
                      Примечания
                    </h4>
                    <div className="p-3 lg:p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-white/60 text-sm mb-2">Медицинские заметки</div>
                      <div className="text-white">{selectedPatient.notes}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 font-medium text-white"
                    >
                      Редактировать карту
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 transition-all duration-200 font-medium text-white"
                    >
                      Записать на приём
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 lg:mt-8 bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <span>📤</span>
                Экспорт данных пациентов
              </h3>
              <p className="text-white/60 text-sm">
                Скачайте медицинские карты и статистику для анализа
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
                className="px-4 py-2 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 text-sm font-medium text-white flex items-center gap-2"
              >
                <span>📋</span>
                <span>Медицинские карты</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}