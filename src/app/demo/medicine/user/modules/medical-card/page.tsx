'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MedicalRecord } from '@/components/medicine/MedicalRecord';
import { InteractiveCard } from '@/components/medicine/InteractiveCard';

// Демо-данные медицинской карты
const medicalRecords = [
  {
    id: '1',
    type: 'diagnosis' as const,
    title: 'Артериальная гипертензия',
    description: 'Стабильное течение, контролируемое медикаментозно. Регулярный мониторинг артериального давления.',
    date: '2024-10-15',
    doctor: 'Петрова Мария Ивановна',
    specialty: 'Терапевт',
    status: 'chronic' as const,
    severity: 'high' as const,
    medications: ['Амлодипин 5 мг', 'Лизиноприл 10 мг'],
    attachments: ['ЭКГ от 15.10.2024', 'Анализы крови', 'Суточный мониторинг АД'],
    notes: 'Пациент соблюдает рекомендации, АД стабилизировано в пределах 130-140/80-85 мм рт.ст.'
  },
  {
    id: '2',
    type: 'allergy' as const,
    title: 'Аллергия на пенициллин',
    description: 'Крапивница, отек Квинке при приеме антибиотиков пенициллинового ряда',
    date: '2023-01-10',
    doctor: 'Сидоров Алексей Петрович',
    specialty: 'Аллерголог',
    status: 'active' as const,
    severity: 'high' as const,
    medications: ['Цетиризин 10 мг (при необходимости)'],
    attachments: ['Аллергопробы', 'Консультация аллерголога'],
    notes: 'Строго противопоказаны все препараты пенициллинового ряда'
  },
  {
    id: '3',
    type: 'procedure' as const,
    title: 'Вакцинация против гриппа',
    description: 'Сезонная вакцинация, хорошая переносимость. Отсутствие побочных эффектов.',
    date: '2024-09-25',
    doctor: 'Петрова Мария Ивановна',
    specialty: 'Терапевт',
    status: 'resolved' as const,
    attachments: ['Сертификат вакцинации'],
    notes: 'Вакцина Ультрикс Квадри. Рекомендована ежегодная ревакцинация.'
  },
  {
    id: '4',
    type: 'diagnosis' as const,
    title: 'Гастроэзофагеальная рефлюксная болезнь',
    description: 'Лёгкая форма, обострения редкие. Контролируется диетой и медикаментами.',
    date: '2024-03-20',
    doctor: 'Козлов Дмитрий Сергеевич',
    specialty: 'Гастроэнтеролог',
    status: 'active' as const,
    severity: 'low' as const,
    medications: ['Омепразол 20 мг'],
    attachments: ['ФГДС от 20.03.2024', 'pH-метрия'],
    notes: 'Рекомендовано дробное питание, исключение острой и жирной пищи'
  },
  {
    id: '5',
    type: 'vaccination' as const,
    title: 'Вакцинация COVID-19',
    description: 'Полный курс вакцинации, бустерная доза. Иммунитет сформирован.',
    date: '2023-02-15',
    doctor: 'Петрова Мария Ивановна',
    specialty: 'Терапевт',
    status: 'resolved' as const,
    attachments: ['QR-код вакцинации', 'Сертификат'],
    notes: 'Вакцина Спутник V. Последняя бустерная доза - февраль 2023.'
  },
  {
    id: '6',
    type: 'procedure' as const,
    title: 'Стоматологический осмотр',
    description: 'Плановый профилактический осмотр, санация полости рта',
    date: '2024-08-10',
    doctor: 'Орлова Анна Викторовна',
    specialty: 'Стоматолог',
    status: 'resolved' as const,
    attachments: ['Рентген-снимок', 'Заключение стоматолога'],
    notes: 'Кариес отсутствует, проведена профессиональная гигиена'
  }
];

const patientInfo = {
  name: 'Иванов Алексей Петрович',
  birthDate: '1985-03-15',
  age: 39,
  bloodType: 'A(II) Rh+',
  height: '178 см',
  weight: '74.5 кг',
  bmi: 23.5,
  bmiStatus: 'норма' as const,
  lastUpdate: '2024-10-15',
  allergies: ['Пенициллин', 'Пыльца березы'],
  chronicDiseases: ['Артериальная гипертензия', 'ГЭРБ'],
  activeMedications: 3
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatDateShort = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });
};

export default function MedicalCardPage() {
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'diagnosis' | 'allergy' | 'procedure' | 'vaccination'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = useMemo(() => {
    return medicalRecords.filter(record => {
      const matchesFilter = activeFilter === 'all' || record.type === activeFilter;
      const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchTerm]);

  const toggleRecord = (recordId: string) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId);
  };

  const stats = {
    total: medicalRecords.length,
    diagnosis: medicalRecords.filter(r => r.type === 'diagnosis').length,
    allergy: medicalRecords.filter(r => r.type === 'allergy').length,
    procedure: medicalRecords.filter(r => r.type === 'procedure').length,
    vaccination: medicalRecords.filter(r => r.type === 'vaccination').length,
    active: medicalRecords.filter(r => r.status === 'active' || r.status === 'chronic').length,
    resolved: medicalRecords.filter(r => r.status === 'resolved').length
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      diagnosis: '🏥',
      allergy: '⚠️',
      procedure: '🔬',
      vaccination: '💉'
    };
    return icons[type] || '📋';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      diagnosis: 'from-red-500/10 to-orange-500/10 border-red-500/20',
      allergy: 'from-yellow-500/10 to-amber-500/10 border-yellow-500/20',
      procedure: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20',
      vaccination: 'from-green-500/10 to-emerald-500/10 border-green-500/20'
    };
    return colors[type] || 'from-gray-500/10 to-slate-500/10 border-gray-500/20';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Медицинская карта
              </h1>
              <p className="text-white/60 text-sm lg:text-base">
                Полная электронная история вашего здоровья
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button 
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 text-white text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>🖨️</span>
                <span className="hidden sm:inline">Печать</span>
              </motion.button>
              <motion.button 
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200 text-blue-400 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>📤</span>
                <span className="hidden sm:inline">Экспорт</span>
              </motion.button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Поиск по диагнозам, врачам, описаниям..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-500/50 transition-colors pl-12"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 text-lg">
              🔍
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Patient Summary Card */}
          <InteractiveCard className="p-4 lg:p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
              {/* Personal Info */}
              <div className="space-y-3 lg:space-y-4">
                <h2 className="text-lg lg:text-xl font-bold text-white flex items-center gap-2">
                  <span>👤</span>
                  <span>Личная информация</span>
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-white/60 text-xs lg:text-sm mb-1">ФИО</div>
                    <div className="text-white font-medium text-sm lg:text-base line-clamp-2">
                      {patientInfo.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs lg:text-sm mb-1">Дата рождения</div>
                    <div className="text-white font-medium text-sm lg:text-base">
                      {formatDateShort(patientInfo.birthDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs lg:text-sm mb-1">Возраст</div>
                    <div className="text-white font-medium text-sm lg:text-base">
                      {patientInfo.age} лет
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs lg:text-sm mb-1">Группа крови</div>
                    <div className="text-white font-medium text-sm lg:text-base">
                      {patientInfo.bloodType}
                    </div>
                  </div>
                </div>
              </div>

              {/* Physical Parameters */}
              <div className="space-y-3 lg:space-y-4">
                <h2 className="text-lg lg:text-xl font-bold text-white flex items-center gap-2">
                  <span>📊</span>
                  <span>Антропометрия</span>
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-white/60 text-xs lg:text-sm mb-1">Рост</div>
                    <div className="text-white font-medium text-sm lg:text-base">
                      {patientInfo.height}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs lg:text-sm mb-1">Вес</div>
                    <div className="text-white font-medium text-sm lg:text-base">
                      {patientInfo.weight}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs lg:text-sm mb-1">ИМТ</div>
                    <div className="text-white font-medium text-sm lg:text-base">
                      {patientInfo.bmi}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs lg:text-sm mb-1">Статус</div>
                    <div className="text-green-400 font-medium text-sm lg:text-base">
                      {patientInfo.bmiStatus}
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Summary */}
              <div className="space-y-3 lg:space-y-4">
                <h2 className="text-lg lg:text-xl font-bold text-white flex items-center gap-2">
                  <span>🏥</span>
                  <span>Медицинская сводка</span>
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-white/60 text-xs lg:text-sm mb-1">Хронические заболевания</div>
                    <div className="text-white font-medium text-sm lg:text-base">
                      {patientInfo.chronicDiseases.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs lg:text-sm mb-1">Аллергии</div>
                    <div className="text-white font-medium text-sm lg:text-base">
                      {patientInfo.allergies.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs lg:text-sm mb-1">Активные назначения</div>
                    <div className="text-white font-medium text-sm lg:text-base">
                      {patientInfo.activeMedications} препарата
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs lg:text-sm mb-1">Обновлено</div>
                    <div className="text-white font-medium text-sm lg:text-base">
                      {formatDateShort(patientInfo.lastUpdate)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </InteractiveCard>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Quick Stats */}
            <InteractiveCard className="p-4 lg:p-6">
              <h3 className="font-semibold text-white text-sm lg:text-base mb-3 lg:mb-4">📈 Статистика</h3>
              <div className="space-y-2 lg:space-y-3">
                <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                  <span className="text-white/60 text-xs lg:text-sm">Всего записей</span>
                  <span className="text-white font-medium text-sm lg:text-base">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                  <span className="text-white/60 text-xs lg:text-sm">Активные</span>
                  <span className="text-orange-400 font-medium text-sm lg:text-base">{stats.active}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                  <span className="text-white/60 text-xs lg:text-sm">Завершённые</span>
                  <span className="text-green-400 font-medium text-sm lg:text-base">{stats.resolved}</span>
                </div>
              </div>
            </InteractiveCard>

            {/* Filters */}
            <InteractiveCard className="p-4 lg:p-6">
              <h3 className="font-semibold text-white text-sm lg:text-base mb-3 lg:mb-4">🔧 Фильтры записей</h3>
              <div className="space-y-2">
                {[
                  { key: 'all' as const, label: 'Все записи', icon: '📋', count: stats.total },
                  { key: 'diagnosis' as const, label: 'Диагнозы', icon: '🏥', count: stats.diagnosis },
                  { key: 'allergy' as const, label: 'Аллергии', icon: '⚠️', count: stats.allergy },
                  { key: 'procedure' as const, label: 'Процедуры', icon: '🔬', count: stats.procedure },
                  { key: 'vaccination' as const, label: 'Вакцинации', icon: '💉', count: stats.vaccination },
                ].map((filter) => (
                  <motion.button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`w-full flex items-center justify-between p-2 lg:p-3 rounded-xl text-left transition-all duration-200 ${
                      activeFilter === filter.key
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-transparent'
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center gap-2 lg:gap-3">
                      <span className="text-base lg:text-lg">{filter.icon}</span>
                      <span className="font-medium text-xs lg:text-sm">{filter.label}</span>
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-white/10 text-xs font-medium">
                      {filter.count}
                    </span>
                  </motion.button>
                ))}
              </div>
            </InteractiveCard>

            {/* Emergency Info */}
            <InteractiveCard className="p-4 lg:p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
              <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-base lg:text-lg">
                  🚨
                </div>
                <div>
                  <div className="font-bold text-white text-sm lg:text-base">Критическая информация</div>
                  <div className="text-white/60 text-xs lg:text-sm">Для экстренных случаев</div>
                </div>
              </div>
              <div className="space-y-2 lg:space-y-3">
                <div className="p-2 lg:p-3 rounded-xl bg-red-500/20 border border-red-500/30">
                  <div className="text-red-400 font-medium text-xs lg:text-sm mb-1">Аллергия на пенициллин</div>
                  <div className="text-red-400/60 text-xs">Тяжелая реакция - противопоказан</div>
                </div>
                <div className="p-2 lg:p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
                  <div className="text-yellow-400 font-medium text-xs lg:text-sm mb-1">Артериальная гипертензия</div>
                  <div className="text-yellow-400/60 text-xs">Требует постоянного контроля АД</div>
                </div>
              </div>
            </InteractiveCard>
          </motion.div>

          {/* Medical Records */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-white">История болезней и лечение</h2>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <span>Найдено записей:</span>
                <span className="text-white font-medium">{filteredRecords.length}</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {filteredRecords.length > 0 ? (
                <motion.div
                  key="records"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {filteredRecords.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <InteractiveCard 
                        className={`p-4 lg:p-6 bg-gradient-to-r ${getTypeColor(record.type)} hover:bg-white/5 transition-all duration-300 cursor-pointer group`}
                        onClick={() => toggleRecord(record.id)}
                      >
                        <div className="flex items-start gap-3 lg:gap-4">
                          {/* Icon */}
                          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-white/10 flex items-center justify-center text-base lg:text-lg flex-shrink-0">
                            {getTypeIcon(record.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 mb-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white text-base lg:text-lg mb-1 line-clamp-1">
                                  {record.title}
                                </h3>
                                <p className="text-white/60 text-sm line-clamp-2">
                                  {record.description}
                                </p>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row gap-2">
                                <span className={`px-2 lg:px-3 py-1 rounded-lg text-xs border ${
                                  record.status === 'active' ? 'text-orange-400 bg-orange-500/20 border-orange-500/30' :
                                  record.status === 'chronic' ? 'text-purple-400 bg-purple-500/20 border-purple-500/30' :
                                  'text-green-400 bg-green-500/20 border-green-500/30'
                                } whitespace-nowrap`}>
                                  {record.status === 'active' ? 'Активно' : 
                                   record.status === 'chronic' ? 'Хроническое' : 'Завершено'}
                                </span>
                                {record.severity && (
                                  <span className={`px-2 lg:px-3 py-1 rounded-lg text-xs border ${
                                    record.severity === 'high' ? 'text-red-400 bg-red-500/20 border-red-500/30' :
                                    record.severity === 'medium' ? 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' :
                                    'text-green-400 bg-green-500/20 border-green-500/30'
                                  } whitespace-nowrap`}>
                                    {record.severity === 'high' ? 'Высокая' : 
                                     record.severity === 'medium' ? 'Средняя' : 'Низкая'}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mb-3">
                              <div>
                                <div className="text-xs lg:text-sm text-white/60 mb-1">Врач</div>
                                <div className="text-white font-medium text-sm lg:text-base line-clamp-1">
                                  {record.doctor}
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-xs lg:text-sm text-white/60 mb-1">Дата</div>
                                <div className="text-white font-medium text-sm lg:text-base">
                                  {formatDate(record.date)}
                                </div>
                              </div>
                            </div>

                            {/* Quick Info */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 lg:gap-4 text-xs lg:text-sm text-white/60">
                                {record.medications && record.medications.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <span>💊</span>
                                    <span>{record.medications.length}</span>
                                  </div>
                                )}
                                {record.attachments.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <span>📎</span>
                                    <span>{record.attachments.length}</span>
                                  </div>
                                )}
                              </div>
                              <div className="text-white/60 group-hover:text-white transition-colors flex items-center gap-1 text-xs lg:text-sm">
                                <span>{expandedRecord === record.id ? 'Свернуть' : 'Подробнее'}</span>
                                <motion.span
                                  animate={{ rotate: expandedRecord === record.id ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  ↓
                                </motion.span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                          {expandedRecord === record.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-white/10"
                            >
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                                {record.medications && record.medications.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-white text-sm lg:text-base mb-2 lg:mb-3 flex items-center gap-2">
                                      <span>💊</span>
                                      <span>Назначения</span>
                                    </h4>
                                    <div className="space-y-2">
                                      {record.medications.map((med, idx) => (
                                        <div key={idx} className="p-2 lg:p-3 rounded-xl bg-white/5 text-white text-sm">
                                          {med}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {record.attachments.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-white text-sm lg:text-base mb-2 lg:mb-3 flex items-center gap-2">
                                      <span>📎</span>
                                      <span>Прикрепленные файлы</span>
                                    </h4>
                                    <div className="space-y-2">
                                      {record.attachments.map((file, idx) => (
                                        <div key={idx} className="p-2 lg:p-3 rounded-xl bg-white/5 text-white text-sm flex items-center gap-2">
                                          <span>📄</span>
                                          <span>{file}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {record.notes && (
                                <div className="mt-4 lg:mt-6">
                                  <h4 className="font-semibold text-white text-sm lg:text-base mb-2 lg:mb-3 flex items-center gap-2">
                                    <span>📝</span>
                                    <span>Примечания врача</span>
                                  </h4>
                                  <div className="p-3 lg:p-4 rounded-xl bg-white/5 text-white/80 text-sm lg:text-base leading-relaxed">
                                    {record.notes}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </InteractiveCard>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <InteractiveCard className="p-8 lg:p-12 text-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl lg:text-3xl mb-4 lg:mb-6 mx-auto">
                      📝
                    </div>
                    <h3 className="text-xl lg:text-2xl font-semibold text-white mb-2 lg:mb-3">Записи не найдены</h3>
                    <p className="text-white/60 text-sm lg:text-base mb-6 lg:mb-8">
                      {searchTerm ? 'Попробуйте изменить поисковый запрос' : 'Нет медицинских записей по выбранному фильтру'}
                    </p>
                    <motion.button
                      onClick={() => {
                        setActiveFilter('all');
                        setSearchTerm('');
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
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}