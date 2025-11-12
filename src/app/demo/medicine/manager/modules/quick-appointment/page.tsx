// /src/app/demo/medicine/manager/quick-appointment/page.tsx
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Types
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
  nextSlot: string;
  rating: number;
  experience: string;
  image?: string;
  currentRoom?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  isUrgent?: boolean;
  isPeak?: boolean;
}

interface AppointmentType {
  id: string;
  name: string;
  duration: number;
  icon: string;
  description: string;
  price?: string;
  category: string;
}

interface PatientInfo {
  name: string;
  phone: string;
  email: string;
  reason: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  isNewPatient?: boolean;
}

// Mock данные для демонстрации
const availableDoctors: Doctor[] = [
  { 
    id: '1', 
    name: 'Доктор Петров А.В.', 
    specialty: 'Терапевт', 
    available: true, 
    nextSlot: '10:30',
    rating: 4.8,
    experience: '12 лет',
    currentRoom: 'Каб. 101'
  },
  { 
    id: '2', 
    name: 'Доктор Сидорова М.И.', 
    specialty: 'Кардиолог', 
    available: true, 
    nextSlot: '11:15',
    rating: 4.9,
    experience: '15 лет',
    currentRoom: 'Каб. 205'
  },
  { 
    id: '3', 
    name: 'Доктор Иванова Е.С.', 
    specialty: 'Невролог', 
    available: false, 
    nextSlot: '14:00',
    rating: 4.7,
    experience: '10 лет',
    currentRoom: 'Каб. 304'
  },
  { 
    id: '4', 
    name: 'Доктор Козлов Д.Н.', 
    specialty: 'Хирург', 
    available: true, 
    nextSlot: '13:30',
    rating: 4.6,
    experience: '8 лет',
    currentRoom: 'Каб. 412'
  },
  { 
    id: '5', 
    name: 'Доктор Николаева С.П.', 
    specialty: 'Педиатр', 
    available: true, 
    nextSlot: '10:00',
    rating: 4.9,
    experience: '14 лет',
    currentRoom: 'Каб. 108'
  },
  { 
    id: '6', 
    name: 'Доктор Волков И.А.', 
    specialty: 'Офтальмолог', 
    available: false, 
    nextSlot: '15:20',
    rating: 4.5,
    experience: '9 лет',
    currentRoom: 'Каб. 311'
  },
];

const availableSlots: TimeSlot[] = [
  { time: '09:00', available: false },
  { time: '09:30', available: false },
  { time: '10:00', available: true, isUrgent: true },
  { time: '10:30', available: true },
  { time: '11:00', available: true },
  { time: '11:30', available: false },
  { time: '12:00', available: true, isPeak: true },
  { time: '12:30', available: true, isPeak: true },
  { time: '13:00', available: false },
  { time: '13:30', available: true },
  { time: '14:00', available: true },
  { time: '14:30', available: true },
  { time: '15:00', available: true },
  { time: '15:30', available: false },
  { time: '16:00', available: true },
  { time: '16:30', available: true },
  { time: '17:00', available: true },
  { time: '17:30', available: true },
];

const appointmentTypes: AppointmentType[] = [
  { 
    id: 'consultation', 
    name: 'Консультация', 
    duration: 30, 
    icon: '💬', 
    description: 'Первичный осмотр и консультация',
    price: '1 500 ₽',
    category: 'basic'
  },
  { 
    id: 'examination', 
    name: 'Осмотр', 
    duration: 45, 
    icon: '👨‍⚕️', 
    description: 'Полный медицинский осмотр',
    price: '2 500 ₽',
    category: 'basic'
  },
  { 
    id: 'procedure', 
    name: 'Процедура', 
    duration: 60, 
    icon: '💉', 
    description: 'Лечебные процедуры и манипуляции',
    price: '3 000 ₽',
    category: 'treatment'
  },
  { 
    id: 'test', 
    name: 'Анализы', 
    duration: 15, 
    icon: '🔬', 
    description: 'Забор анализов и лабораторные исследования',
    price: '800 ₽',
    category: 'diagnostics'
  },
  { 
    id: 'emergency', 
    name: 'Срочный прием', 
    duration: 20, 
    icon: '🚨', 
    description: 'Экстренная помощь при острых состояниях',
    price: '2 000 ₽',
    category: 'emergency'
  },
  { 
    id: 'followup', 
    name: 'Повторный', 
    duration: 25, 
    icon: '📋', 
    description: 'Контрольный осмотр и коррекция лечения',
    price: '1 200 ₽',
    category: 'basic'
  },
];

const specialties = [
  'Терапевт',
  'Кардиолог',
  'Невролог',
  'Хирург',
  'Педиатр',
  'Офтальмолог',
  'Отоларинголог',
  'Дерматолог',
  'Гастроэнтеролог',
  'Эндокринолог'
];

export default function QuickAppointmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '',
    phone: '',
    email: '',
    reason: '',
    birthDate: '',
    gender: undefined,
    isNewPatient: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация врачей по специализации и поиску
  const filteredDoctors = useMemo(() => {
    return availableDoctors.filter(doctor => {
      const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
      const matchesSearch = !searchQuery || 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSpecialty && matchesSearch;
    });
  }, [selectedSpecialty, searchQuery]);

  // Фильтрация слотов по доступности
  const availableTimeSlots = useMemo(() => {
    return availableSlots.filter(slot => slot.available);
  }, []);

  // Следующие доступные слоты
  const nextAvailableSlots = useMemo(() => {
    return availableTimeSlots.slice(0, 6);
  }, [availableTimeSlots]);

  const handlePatientInfoChange = (field: keyof PatientInfo, value: string | boolean) => {
    setPatientInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Имитация отправки данных
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // В реальном приложении здесь был бы API call
    console.log('Appointment data:', {
      doctor: selectedDoctor,
      slot: selectedSlot,
      type: selectedType,
      patient: patientInfo
    });
    
    setIsSubmitting(false);
    router.push('/demo/medicine/manager?appointment=success');
  };

  const nextStep = () => {
    if (isStepValid()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  const isStepValid = (): boolean => {
    switch (step) {
      case 1: 
        return patientInfo.name.trim().length > 0 && 
               patientInfo.phone.trim().length > 0 &&
               /^\+?[\d\s\-\(\)]+$/.test(patientInfo.phone);
      case 2: 
        return selectedDoctor !== '' && selectedType !== '';
      case 3: 
        return selectedSlot !== '';
      default: 
        return false;
    }
  };

  const getStepProgress = () => (step / 3) * 100;

  const getSelectedDoctor = () => availableDoctors.find(d => d.id === selectedDoctor);
  const getSelectedAppointmentType = () => appointmentTypes.find(t => t.id === selectedType);

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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Link 
              href="/demo/medicine/manager"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm sm:text-base"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Назад к дашборду
            </Link>
            <div className="text-xs sm:text-sm text-white/60">
              Шаг {step} из 3
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">Быстрая запись пациента</h1>
          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto">
            Заполните форму для создания срочной записи к врачу
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 sm:mb-8 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-xs sm:text-sm text-white/60">Прогресс заполнения</span>
            <span className="text-xs sm:text-sm text-white/60">{Math.round(getStepProgress())}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 sm:h-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 sm:h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getStepProgress()}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-between mt-3 sm:mt-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  step >= stepNumber 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-white/10 text-white/40'
                }`}>
                  {step > stepNumber ? '✓' : stepNumber}
                </div>
                <span className={`text-xs mt-2 transition-colors ${
                  step >= stepNumber ? 'text-white' : 'text-white/40'
                }`}>
                  {stepNumber === 1 ? 'Пациент' : stepNumber === 2 ? 'Врач' : 'Время'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-sm"
            >
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {/* Step 1: Patient Information */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4 sm:space-y-6"
                    >
                      <div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">Информация о пациенте</h2>
                        <p className="text-white/60 text-sm sm:text-base">Введите основные данные пациента для записи</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        {/* Основная информация */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              ФИО пациента *
                            </label>
                            <input
                              type="text"
                              value={patientInfo.name}
                              onChange={(e) => handlePatientInfoChange('name', e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-sm sm:text-base"
                              placeholder="Иванов Иван Иванович"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Телефон *
                            </label>
                            <input
                              type="tel"
                              value={patientInfo.phone}
                              onChange={(e) => handlePatientInfoChange('phone', e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-sm sm:text-base"
                              placeholder="+7 (999) 999-99-99"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              value={patientInfo.email}
                              onChange={(e) => handlePatientInfoChange('email', e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-sm sm:text-base"
                              placeholder="patient@example.com"
                            />
                          </div>
                        </div>

                        {/* Дополнительная информация */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Дата рождения
                            </label>
                            <input
                              type="date"
                              value={patientInfo.birthDate}
                              onChange={(e) => handlePatientInfoChange('birthDate', e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-sm sm:text-base"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Пол
                            </label>
                            <select
                              value={patientInfo.gender || ''}
                              onChange={(e) => handlePatientInfoChange('gender', e.target.value as any)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-sm sm:text-base"
                            >
                              <option value="">Не указан</option>
                              <option value="male">Мужской</option>
                              <option value="female">Женский</option>
                              <option value="other">Другой</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Тип пациента
                            </label>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handlePatientInfoChange('isNewPatient', true)}
                                className={`flex-1 px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                  patientInfo.isNewPatient 
                                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                                }`}
                              >
                                Новый
                              </button>
                              <button
                                type="button"
                                onClick={() => handlePatientInfoChange('isNewPatient', false)}
                                className={`flex-1 px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                                  !patientInfo.isNewPatient 
                                    ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                                }`}
                              >
                                Повторный
                              </button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Причина обращения *
                          </label>
                          <textarea
                            value={patientInfo.reason}
                            onChange={(e) => handlePatientInfoChange('reason', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 resize-none text-sm sm:text-base"
                            placeholder="Опишите симптомы, жалобы или причину обращения..."
                            required
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Doctor and Service Selection */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">Выбор врача и услуги</h2>
                        <p className="text-white/60 text-sm sm:text-base">Выберите специалиста и тип приема</p>
                      </div>

                      {/* Specialty Filter */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-3">Специализация</h3>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedSpecialty('')}
                            className={`px-3 py-2 rounded-xl border transition-all duration-200 text-sm ${
                              selectedSpecialty === '' 
                                ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                                : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                            }`}
                          >
                            Все специалисты
                          </button>
                          {specialties.slice(0, 6).map(specialty => (
                            <button
                              key={specialty}
                              type="button"
                              onClick={() => setSelectedSpecialty(specialty)}
                              className={`px-3 py-2 rounded-xl border transition-all duration-200 text-sm ${
                                selectedSpecialty === specialty 
                                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                              }`}
                            >
                              {specialty}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Doctor Selection */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-white">Специалисты</h3>
                          <span className="text-white/60 text-sm">
                            {filteredDoctors.filter(d => d.available).length} из {filteredDoctors.length} доступны
                          </span>
                        </div>
                        
                        {/* Search */}
                        <div className="relative mb-4">
                          <input
                            type="text"
                            placeholder="Поиск врача по имени или специализации..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-sm"
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                          {filteredDoctors.map((doctor) => (
                            <motion.button
                              key={doctor.id}
                              type="button"
                              onClick={() => setSelectedDoctor(doctor.id)}
                              className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                                selectedDoctor === doctor.id
                                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                                  : 'bg-white/5 border-white/10 text-white/80 hover:border-white/20'
                              } ${!doctor.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={!doctor.available}
                              whileHover={{ scale: doctor.available ? 1.02 : 1 }}
                              whileTap={{ scale: doctor.available ? 0.98 : 1 }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="font-medium text-base">{doctor.name}</span>
                                    {doctor.available && (
                                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                                        ✓ Доступен
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-white/60 space-y-1">
                                    <div>{doctor.specialty} • {doctor.experience}</div>
                                    <div className="flex items-center gap-4">
                                      <span className="flex items-center gap-1">
                                        ⭐ {doctor.rating}
                                      </span>
                                      <span>{doctor.currentRoom}</span>
                                      <span>Следующий слот: {doctor.nextSlot}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Service Type Selection */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Тип приема</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                          {appointmentTypes.map((type) => (
                            <motion.button
                              key={type.id}
                              type="button"
                              onClick={() => setSelectedType(type.id)}
                              className={`p-3 rounded-xl border transition-all duration-200 text-center ${
                                selectedType === type.id
                                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                                  : 'bg-white/5 border-white/10 text-white/80 hover:border-white/20'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="text-2xl mb-2">{type.icon}</div>
                              <div className="font-medium text-sm mb-1">{type.name}</div>
                              <div className="text-xs text-white/60">{type.duration} мин</div>
                              <div className="text-xs text-green-400 mt-1">{type.price}</div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Time Slot Selection */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">Выбор времени приема</h2>
                        <p className="text-white/60 text-sm sm:text-base">Выберите удобное время для записи</p>
                      </div>

                      {/* Quick Time Slots */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-3">Ближайшие доступные слоты</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                          {nextAvailableSlots.map((slot, index) => (
                            <motion.button
                              key={index}
                              type="button"
                              onClick={() => setSelectedSlot(slot.time)}
                              className={`p-4 rounded-xl border transition-all duration-200 text-center ${
                                selectedSlot === slot.time
                                  ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                  : 'bg-white/5 border-white/10 text-white/80 hover:border-white/20'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="font-medium text-lg">{slot.time}</div>
                              <div className="text-xs text-green-400 mt-1">Свободно</div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* All Time Slots */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-3">Все доступные время</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {availableSlots.map((slot, index) => (
                            <motion.button
                              key={index}
                              type="button"
                              onClick={() => slot.available && setSelectedSlot(slot.time)}
                              className={`p-3 rounded-xl border transition-all duration-200 text-center ${
                                selectedSlot === slot.time
                                  ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                  : slot.available
                                  ? 'bg-white/5 border-white/10 text-white/80 hover:border-white/20'
                                  : 'bg-red-500/10 border-red-500/20 text-red-400/60 cursor-not-allowed'
                              } ${slot.isUrgent ? 'ring-2 ring-orange-500/50' : ''} ${
                                slot.isPeak ? 'ring-2 ring-yellow-500/50' : ''
                              }`}
                              disabled={!slot.available}
                              whileHover={{ scale: slot.available ? 1.05 : 1 }}
                              whileTap={{ scale: slot.available ? 0.95 : 1 }}
                            >
                              <div className="font-medium text-sm">{slot.time}</div>
                              {slot.isUrgent && (
                                <div className="text-xs text-orange-400 mt-1">Срочно</div>
                              )}
                              {slot.isPeak && (
                                <div className="text-xs text-yellow-400 mt-1">Пик</div>
                              )}
                              {!slot.available && (
                                <div className="text-xs text-red-400 mt-1">Занято</div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Appointment Summary */}
                      {selectedSlot && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 sm:p-6"
                        >
                          <h3 className="font-semibold text-blue-400 mb-3 text-lg">Сводка записи</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-white/60">Пациент:</span>
                                <span className="text-white font-medium">{patientInfo.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/60">Телефон:</span>
                                <span className="text-white">{patientInfo.phone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/60">Тип пациента:</span>
                                <span className="text-white">{patientInfo.isNewPatient ? 'Новый' : 'Повторный'}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-white/60">Врач:</span>
                                <span className="text-white font-medium">{getSelectedDoctor()?.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/60">Услуга:</span>
                                <span className="text-white">{getSelectedAppointmentType()?.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/60">Время:</span>
                                <span className="text-green-400 font-medium">{selectedSlot}</span>
                              </div>
                            </div>
                          </div>
                          {getSelectedAppointmentType()?.price && (
                            <div className="mt-4 pt-4 border-t border-blue-500/30">
                              <div className="flex justify-between items-center">
                                <span className="text-white/60">Стоимость:</span>
                                <span className="text-xl font-bold text-green-400">
                                  {getSelectedAppointmentType()?.price}
                                </span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 mt-6 border-t border-white/10">
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    className={`px-4 sm:px-6 py-3 rounded-xl border border-white/10 text-white/80 hover:bg-white/10 transition-colors text-sm sm:text-base ${
                      step === 1 ? 'invisible' : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Назад
                  </motion.button>

                  {step < 3 ? (
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className={`px-4 sm:px-6 py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                        isStepValid()
                          ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25'
                          : 'bg-white/10 text-white/40 cursor-not-allowed'
                      }`}
                      whileHover={isStepValid() ? { scale: 1.02 } : {}}
                      whileTap={isStepValid() ? { scale: 0.98 } : {}}
                    >
                      Продолжить
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={!isStepValid() || isSubmitting}
                      className={`px-4 sm:px-6 py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                        isStepValid() && !isSubmitting
                          ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/25'
                          : 'bg-white/10 text-white/40 cursor-not-allowed'
                      }`}
                      whileHover={isStepValid() && !isSubmitting ? { scale: 1.02 } : {}}
                      whileTap={isStepValid() && !isSubmitting ? { scale: 0.98 } : {}}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Создание записи...
                        </div>
                      ) : (
                        'Подтвердить запись'
                      )}
                    </motion.button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Quick Stats */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
                <h3 className="font-semibold text-white mb-4 text-lg">Статистика сегодня</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Записей создано</span>
                    <span className="text-white font-medium">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Свободных окон</span>
                    <span className="text-green-400 font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Срочных записей</span>
                    <span className="text-orange-400 font-medium">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Отменено записей</span>
                    <span className="text-red-400 font-medium">1</span>
                  </div>
                </div>
              </div>

              {/* Help Card */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 sm:p-6">
                <h3 className="font-semibold text-blue-400 mb-2 text-lg">Нужна помощь?</h3>
                <p className="text-blue-300/80 text-sm mb-4">
                  Если возникли сложности с записью, обратитесь в регистратуру
                </p>
                <div className="space-y-2">
                  <button className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 py-2 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                    <span>📞</span>
                    Позвонить в регистратуру
                  </button>
                  <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 py-2 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                    <span>💬</span>
                    Онлайн-помощник
                  </button>
                </div>
              </div>

              {/* Recent Quick Appointments */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
                <h3 className="font-semibold text-white mb-4 text-lg">Последние быстрые записи</h3>
                <div className="space-y-3">
                  {[
                    { time: '09:15', patient: 'Иванов А.С.', doctor: 'Петров А.В.', status: 'confirmed' },
                    { time: '09:45', patient: 'Сидорова М.И.', doctor: 'Сидорова М.И.', status: 'completed' },
                    { time: '10:20', patient: 'Козлов Д.Н.', doctor: 'Козлов Д.Н.', status: 'waiting' },
                  ].map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-3 bg-white/5 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">{appointment.patient}</div>
                        <div className="text-white/60 text-xs truncate">{appointment.doctor}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-white/60 text-xs">{appointment.time}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          appointment.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                          appointment.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {appointment.status === 'confirmed' ? 'Подтверждена' :
                           appointment.status === 'completed' ? 'Завершена' : 'Ожидание'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 sm:p-6">
                <h3 className="font-semibold text-red-400 mb-3 text-lg">Экстренные контакты</h3>
                <div className="space-y-2 text-sm">
                  <button className="w-full text-left p-2 rounded-lg hover:bg-red-500/20 transition-colors">
                    <div className="text-white font-medium">Скорая помощь</div>
                    <div className="text-red-300/80">103 • 112</div>
                  </button>
                  <button className="w-full text-left p-2 rounded-lg hover:bg-red-500/20 transition-colors">
                    <div className="text-white font-medium">Дежурный администратор</div>
                    <div className="text-red-300/80">+7 (495) 123-45-67</div>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}