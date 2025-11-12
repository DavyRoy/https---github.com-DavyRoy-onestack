// /src/app/demo/medicine/user/modules/appointment/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  doctors, 
  specializations, 
  upcomingAppointments, 
  appointmentStats,
  AppointmentFormData,
  Appointment 
} from './demo-data';
import { AppointmentManager } from '@/components/medicine/AppointmentManager';
import { InteractiveCard } from '@/components/medicine/InteractiveCard';

export default function AppointmentPage() {
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<Partial<AppointmentFormData>>({});
  const [appointments, setAppointments] = useState<Appointment[]>(upcomingAppointments);
  const [activeTab, setActiveTab] = useState<'new' | 'manage'>('new');
  const [isClient, setIsClient] = useState(false);

  // Ensure this only runs on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredDoctors = selectedSpecialization 
    ? doctors.filter(doctor => doctor.specialization === selectedSpecialization)
    : doctors;

  const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);
  const availableSlots = selectedDoctorData?.availableSlots.filter(slot => slot.isAvailable) || [];

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedDoctorData && selectedSlot) {
      const slot = availableSlots.find(s => s.id === selectedSlot);
      const newAppointment: Appointment = {
        id: `app-${Date.now()}`,
        doctorId: selectedDoctor,
        doctorName: selectedDoctorData.name,
        specialization: selectedDoctorData.specialization,
        date: slot?.date || '',
        time: slot?.time || '',
        status: 'pending',
        address: selectedDoctorData.address,
        patientName: formData.patientName || 'Иванов Алексей Петрович',
        patientPhone: formData.patientPhone || '+7 (999) 999-99-99',
        patientEmail: formData.patientEmail || 'alexey@example.com',
        symptoms: formData.symptoms || '',
        type: formData.type || 'offline',
        priority: formData.priority || 'routine',
        price: selectedDoctorData.price,
        duration: 30,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setAppointments(prev => [newAppointment, ...prev]);
      handleNextStep();
    }
  };

  const handleUpdateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, ...updates } : app
    ));
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'cancelled' } : app
    ));
  };

  const handleRescheduleAppointment = (appointmentId: string, newDoctorId: string, newSlotId: string) => {
    const doctor = doctors.find(d => d.id === newDoctorId);
    const slot = doctor?.availableSlots.find(s => s.id === newSlotId);
    
    if (doctor && slot) {
      setAppointments(prev => prev.map(app => 
        app.id === appointmentId 
          ? { 
              ...app, 
              doctorId: newDoctorId,
              doctorName: doctor.name,
              specialization: doctor.specialization,
              date: slot.date,
              time: slot.time,
              type: slot.type,
              price: doctor.price,
              address: doctor.address,
              status: 'pending'
            } 
          : app
      ));
    }
  };

  const handleInputChange = (field: keyof AppointmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedSpecialization('');
    setSelectedDoctor('');
    setSelectedSlot('');
    setFormData({});
  };

  const getSpecializationIcon = (spec: string) => {
    const icons: Record<string, string> = {
      'Терапевт': '👨‍⚕️',
      'Кардиолог': '❤️',
      'Невролог': '🧠',
      'Офтальмолог': '👁️',
      'Стоматолог': '🦷',
      'Дерматолог': '🔬',
      'Педиатр': '👶',
      'Хирург': '🔪',
      'Гастроэнтеролог': '🍽️',
      'Эндокринолог': '🦋'
    };
    return icons[spec] || '👨‍⚕️';
  };

  const formatSlotDate = (dateString: string) => {
    if (!isClient) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      weekday: 'short'
    });
  };

  const steps = ['Специализация', 'Врач', 'Время', 'Данные', 'Подтверждение'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href="/demo/medicine/user"
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200 text-sm"
                >
                  <span className="text-lg">←</span>
                  <span>Назад к дашборду</span>
                </Link>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Онлайн-запись к врачу</h1>
              <p className="text-white/60 text-sm lg:text-base">
                Запишитесь на приём или управляйте существующими записями
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 w-fit">
            {[
              { id: 'new' as const, label: 'Новая запись', icon: '➕' },
              { id: 'manage' as const, label: 'Мои записи', icon: '📋' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-sm lg:text-base">{tab.icon}</span>
                <span className="text-sm lg:text-base">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'new' ? (
                <motion.div
                  key="new-appointment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Progress Steps - Mobile */}
                  <div className="lg:hidden mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-white/60">
                        Шаг {currentStep} из {steps.length}
                      </div>
                      <div className="text-sm font-medium text-white">
                        {steps[currentStep - 1]}
                      </div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div 
                        className="bg-blue-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Progress Steps - Desktop */}
                  <div className="hidden lg:block mb-8">
                    <div className="flex items-center justify-between mb-4">
                      {steps.map((step, index) => (
                        <div key={step} className="flex items-center">
                          <motion.div 
                            className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                              currentStep > index + 1 
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                                : currentStep === index + 1
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                : 'bg-white/10 text-white/60'
                            }`}
                            whileHover={{ scale: 1.1 }}
                          >
                            {currentStep > index + 1 ? '✓' : index + 1}
                          </motion.div>
                          <span className={`ml-2 lg:ml-3 text-sm font-medium ${
                            currentStep >= index + 1 ? 'text-white' : 'text-white/60'
                          }`}>
                            {step}
                          </span>
                          {index < steps.length - 1 && (
                            <div className={`w-8 lg:w-16 h-1 mx-2 lg:mx-4 rounded-full transition-all duration-300 ${
                              currentStep > index + 1 ? 'bg-green-500' : 'bg-white/10'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step Content */}
                  <InteractiveCard className="p-4 lg:p-6">
                    {/* Step 1: Specialization */}
                    {currentStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <h2 className="text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6">Выберите специализацию</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
                          {specializations.map((spec) => (
                            <motion.button
                              key={spec}
                              onClick={() => {
                                setSelectedSpecialization(spec);
                                handleNextStep();
                              }}
                              className="p-4 lg:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 text-center group"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="text-2xl lg:text-3xl mb-2 lg:mb-3 group-hover:scale-110 transition-transform duration-300">
                                {getSpecializationIcon(spec)}
                              </div>
                              <div className="font-semibold text-white text-xs lg:text-sm leading-tight">{spec}</div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Doctor Selection */}
                    {currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
                          <motion.button
                            onClick={handlePrevStep}
                            className="p-2 lg:p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            ←
                          </motion.button>
                          <h2 className="text-xl lg:text-2xl font-bold text-white">Выберите врача</h2>
                        </div>

                        <div className="space-y-3 lg:space-y-4">
                          {filteredDoctors.map((doctor) => (
                            <motion.button
                              key={doctor.id}
                              onClick={() => {
                                setSelectedDoctor(doctor.id);
                                handleNextStep();
                              }}
                              className="w-full p-4 lg:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 text-left group"
                              whileHover={{ y: -2 }}
                            >
                              <div className="flex items-start gap-4 lg:gap-6">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center text-lg lg:text-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                  👨‍⚕️
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-2 lg:mb-3">
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-bold text-white text-base lg:text-lg mb-1 truncate">{doctor.name}</h3>
                                      <p className="text-white/60 text-sm">{doctor.specialization}</p>
                                    </div>
                                    <div className="text-right mt-2 lg:mt-0">
                                      <div className="text-lg lg:text-2xl font-bold text-white">{doctor.price} ₽</div>
                                      <div className="text-white/60 text-xs lg:text-sm">консультация</div>
                                    </div>
                                  </div>
                                  
                                  <p className="text-white/60 text-xs lg:text-sm mb-3 lg:mb-4 leading-relaxed line-clamp-2">
                                    {doctor.description}
                                  </p>
                                  
                                  <div className="flex flex-wrap gap-2 lg:gap-4 text-xs lg:text-sm text-white/60">
                                    <div className="flex items-center gap-1 lg:gap-2">
                                      <span>⭐ {doctor.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1 lg:gap-2">
                                      <span>📅 {doctor.experience} лет</span>
                                    </div>
                                    <div className="flex items-center gap-1 lg:gap-2">
                                      <span>🕒 {doctor.availableSlots.filter(s => s.isAvailable).length} слотов</span>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-1 lg:gap-2 mt-2">
                                    {doctor.certifications.slice(0, 2).map((cert, index) => (
                                      <span key={index} className="px-2 py-1 rounded-lg text-xs bg-white/5 text-white/60">
                                        {cert}
                                      </span>
                                    ))}
                                    {doctor.certifications.length > 2 && (
                                      <span className="px-2 py-1 rounded-lg text-xs bg-white/5 text-white/60">
                                        +{doctor.certifications.length - 2}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <motion.div
                                  className="text-lg lg:text-2xl text-white/60 group-hover:text-blue-400 transition-colors hidden lg:block"
                                  whileHover={{ x: 5 }}
                                >
                                  →
                                </motion.div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Time Slot */}
                    {currentStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
                          <motion.button
                            onClick={handlePrevStep}
                            className="p-2 lg:p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            ←
                          </motion.button>
                          <h2 className="text-xl lg:text-2xl font-bold text-white">Выберите время приёма</h2>
                        </div>

                        {selectedDoctorData && (
                          <div>
                            <InteractiveCard className="p-4 lg:p-6 mb-4 lg:mb-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
                              <div className="flex items-center gap-3 lg:gap-4">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-lg lg:text-2xl flex-shrink-0">
                                  👨‍⚕️
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-white text-base lg:text-lg truncate">{selectedDoctorData.name}</h3>
                                  <p className="text-white/60 text-sm">{selectedDoctorData.specialization}</p>
                                  <p className="text-white/60 text-xs lg:text-sm mt-1 truncate">{selectedDoctorData.clinic}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg lg:text-2xl font-bold text-white">{selectedDoctorData.price} ₽</div>
                                  <div className="text-white/60 text-xs lg:text-sm">консультация</div>
                                </div>
                              </div>
                            </InteractiveCard>

                            <div className="mb-4 lg:mb-6">
                              <h3 className="font-semibold text-white mb-3 lg:mb-4">Тип приёма</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                {[
                                  { value: 'online' as const, label: '📞 Онлайн', description: 'Видеозвонок с врачом' },
                                  { value: 'offline' as const, label: '🏥 В клинике', description: selectedDoctorData.address }
                                ].map((option) => (
                                  <motion.button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleInputChange('type', option.value)}
                                    className={`p-3 lg:p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                                      formData.type === option.value
                                        ? 'bg-blue-500/20 border-blue-500 text-white'
                                        : 'bg-white/5 border-white/10 hover:border-white/20 text-white/80'
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <div className="font-semibold text-sm lg:text-base mb-1">{option.label}</div>
                                    <div className="text-xs lg:text-sm text-white/60 line-clamp-2">{option.description}</div>
                                  </motion.button>
                                ))}
                              </div>
                            </div>

                            <h3 className="font-semibold text-white mb-3 lg:mb-4">Доступные слоты</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
                              {availableSlots.map((slot) => (
                                <motion.button
                                  key={slot.id}
                                  onClick={() => {
                                    setSelectedSlot(slot.id);
                                    handleNextStep();
                                  }}
                                  className={`p-3 lg:p-4 rounded-xl border-2 transition-all duration-200 text-center group ${
                                    selectedSlot === slot.id
                                      ? 'bg-blue-500/20 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                                      : 'bg-white/5 border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 text-white/80'
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <div className="font-semibold text-base lg:text-lg mb-1">{slot.time}</div>
                                  <div className="text-xs lg:text-sm opacity-70">
                                    {formatSlotDate(slot.date)}
                                  </div>
                                  <div className={`text-xs mt-2 px-2 py-1 rounded-lg ${
                                    slot.type === 'online' 
                                      ? 'bg-blue-500/20 text-blue-400' 
                                      : 'bg-green-500/20 text-green-400'
                                  }`}>
                                    {slot.type === 'online' ? 'Онлайн' : 'В клинике'}
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Step 4: Patient Data */}
                    {currentStep === 4 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
                          <motion.button
                            onClick={handlePrevStep}
                            className="p-2 lg:p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            ←
                          </motion.button>
                          <h2 className="text-xl lg:text-2xl font-bold text-white">Ваши данные</h2>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-4 lg:space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                            <div>
                              <label className="block text-sm font-semibold text-white/80 mb-2 lg:mb-3">
                                ФИО пациента
                              </label>
                              <input
                                type="text"
                                required
                                value={formData.patientName || ''}
                                onChange={(e) => handleInputChange('patientName', e.target.value)}
                                className="w-full px-3 lg:px-4 py-2 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 transition-colors text-white placeholder-white/40 text-sm lg:text-base"
                                placeholder="Иванов Иван Иванович"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-white/80 mb-2 lg:mb-3">
                                Телефон
                              </label>
                              <input
                                type="tel"
                                required
                                value={formData.patientPhone || ''}
                                onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                                className="w-full px-3 lg:px-4 py-2 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 transition-colors text-white placeholder-white/40 text-sm lg:text-base"
                                placeholder="+7 (999) 999-99-99"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-white/80 mb-2 lg:mb-3">
                              Email
                            </label>
                            <input
                              type="email"
                              required
                              value={formData.patientEmail || ''}
                              onChange={(e) => handleInputChange('patientEmail', e.target.value)}
                              className="w-full px-3 lg:px-4 py-2 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 transition-colors text-white placeholder-white/40 text-sm lg:text-base"
                              placeholder="ivanov@example.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-white/80 mb-2 lg:mb-3">
                              Симптомы и жалобы
                            </label>
                            <textarea
                              value={formData.symptoms || ''}
                              onChange={(e) => handleInputChange('symptoms', e.target.value)}
                              rows={3}
                              className="w-full px-3 lg:px-4 py-2 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 transition-colors text-white placeholder-white/40 resize-none text-sm lg:text-base"
                              placeholder="Опишите ваши симптомы, жалобы или причину обращения..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-white/80 mb-2 lg:mb-3">
                              Приоритет записи
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                              {[
                                { 
                                  value: 'routine' as const, 
                                  label: '📅 Плановая', 
                                  description: 'Обычный осмотр, хронические заболевания' 
                                },
                                { 
                                  value: 'urgent' as const, 
                                  label: '🚨 Срочный', 
                                  description: 'Острые состояния, сильные боли' 
                                },
                              ].map((option) => (
                                <motion.button
                                  key={option.value}
                                  type="button"
                                  onClick={() => handleInputChange('priority', option.value)}
                                  className={`p-3 lg:p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                                    formData.priority === option.value
                                      ? 'bg-blue-500/20 border-blue-500 text-white'
                                      : 'bg-white/5 border-white/10 hover:border-white/20 text-white/80'
                                  }`}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div className="font-semibold text-sm lg:text-base mb-1 lg:mb-2">{option.label}</div>
                                  <div className="text-xs lg:text-sm text-white/60">{option.description}</div>
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-3 lg:gap-4 pt-4 lg:pt-6 border-t border-white/10">
                            <motion.button
                              type="button"
                              onClick={handlePrevStep}
                              className="flex-1 px-4 lg:px-6 py-3 lg:py-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors font-semibold text-sm lg:text-base"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Назад
                            </motion.button>
                            <motion.button
                              type="submit"
                              className="flex-1 px-4 lg:px-6 py-3 lg:py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-semibold text-white shadow-lg shadow-blue-500/25 text-sm lg:text-base"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Подтвердить запись
                            </motion.button>
                          </div>
                        </form>
                      </motion.div>
                    )}

                    {/* Step 5: Confirmation */}
                    {currentStep === 5 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-4 lg:py-8"
                      >
                        <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-green-500/20 border-2 border-green-500/30 flex items-center justify-center text-2xl lg:text-4xl mb-4 lg:mb-6 mx-auto">
                          ✅
                        </div>
                        <h2 className="text-xl lg:text-3xl font-bold text-white mb-3 lg:mb-4">Запись подтверждена!</h2>
                        <p className="text-white/60 text-sm lg:text-lg mb-6 lg:mb-8 max-w-md mx-auto leading-relaxed">
                          Вы успешно записаны на приём. Подтверждение и детали записи отправлены на вашу почту.
                        </p>
                        
                        {selectedDoctorData && selectedSlot && (
                          <InteractiveCard className="p-4 lg:p-8 max-w-md mx-auto mb-6 lg:mb-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
                            <div className="space-y-3 lg:space-y-4 text-left text-sm lg:text-base">
                              <div className="flex justify-between items-center">
                                <span className="text-white/60">Врач:</span>
                                <span className="font-semibold text-white truncate ml-2">{selectedDoctorData.name}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-white/60">Специализация:</span>
                                <span className="truncate ml-2">{selectedDoctorData.specialization}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-white/60">Дата и время:</span>
                                <span className="font-semibold text-white text-right">
                                  {formatSlotDate(availableSlots.find(s => s.id === selectedSlot)?.date || '')} {' '}
                                  в {availableSlots.find(s => s.id === selectedSlot)?.time}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-white/60">Тип приёма:</span>
                                <span>{formData.type === 'online' ? '📞 Онлайн' : '🏥 В клинике'}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-white/60">Стоимость:</span>
                                <span className="font-bold text-white text-lg">{selectedDoctorData.price} ₽</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-white/60">Статус:</span>
                                <span className="text-green-400 font-semibold">Ожидание подтверждения</span>
                              </div>
                            </div>
                          </InteractiveCard>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
                          <Link
                            href="/demo/medicine/user"
                            className="px-4 lg:px-8 py-3 lg:py-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors font-semibold text-sm lg:text-base"
                          >
                            Вернуться в дашборд
                          </Link>
                          <motion.button
                            onClick={resetForm}
                            className="px-4 lg:px-8 py-3 lg:py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-semibold text-white shadow-lg shadow-blue-500/25 text-sm lg:text-base"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Новая запись
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </InteractiveCard>
                </motion.div>
              ) : (
                <motion.div
                  key="manage-appointments"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-4 lg:mb-6">
                    <h2 className="text-xl lg:text-2xl font-bold text-white">Мои записи</h2>
                    <div className="text-white/60 text-xs lg:text-sm">
                      {appointments.filter(a => a.status !== 'cancelled' && a.status !== 'completed').length} активных
                    </div>
                  </div>

                  {appointments.length > 0 ? (
                    <AppointmentManager
                      appointments={appointments}
                      doctors={doctors}
                      onUpdateAppointment={handleUpdateAppointment}
                      onCancelAppointment={handleCancelAppointment}
                      onRescheduleAppointment={handleRescheduleAppointment}
                    />
                  ) : (
                    <InteractiveCard className="p-6 lg:p-12 text-center">
                      <div className="w-12 h-12 lg:w-20 lg:h-20 rounded-2xl bg-blue-500/20 flex items-center justify-center text-xl lg:text-3xl mb-3 lg:mb-4 mx-auto">
                        📅
                      </div>
                      <div className="font-semibold text-white text-lg lg:text-xl mb-2">Записи не найдены</div>
                      <div className="text-white/60 text-sm lg:text-base mb-4 lg:mb-6">
                        У вас нет активных записей к врачам
                      </div>
                      <motion.button
                        onClick={() => setActiveTab('new')}
                        className="inline-flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-2xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200 text-blue-400 font-medium text-sm lg:text-base"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>➕</span>
                        <span>Записаться к врачу</span>
                      </motion.button>
                    </InteractiveCard>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Quick Stats */}
            <InteractiveCard className="p-4 lg:p-6">
              <h3 className="font-semibold text-white text-sm lg:text-base mb-3 lg:mb-4">📊 Статистика записей</h3>
              <div className="space-y-3 lg:space-y-4">
                <div className="flex justify-between items-center p-2 lg:p-3 rounded-xl bg-white/5">
                  <span className="text-white/60 text-xs lg:text-sm">Всего записей:</span>
                  <span className="font-bold text-white text-base lg:text-lg">{appointments.length}</span>
                </div>
                <div className="flex justify-between items-center p-2 lg:p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <span className="text-yellow-400 text-xs lg:text-sm">Предстоящие:</span>
                  <span className="font-bold text-yellow-400 text-base lg:text-lg">
                    {appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 lg:p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <span className="text-green-400 text-xs lg:text-sm">Завершённые:</span>
                  <span className="font-bold text-green-400 text-base lg:text-lg">
                    {appointments.filter(a => a.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 lg:p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <span className="text-blue-400 text-xs lg:text-sm">В этом месяце:</span>
                  <span className="font-bold text-blue-400 text-base lg:text-lg">
                    {appointments.filter(a => {
                      const appointmentDate = new Date(a.date);
                      const now = new Date();
                      return appointmentDate.getMonth() === now.getMonth() && 
                             appointmentDate.getFullYear() === now.getFullYear();
                    }).length}
                  </span>
                </div>
              </div>
            </InteractiveCard>

            {/* Help Section */}
            <InteractiveCard className="p-4 lg:p-6">
              <h3 className="font-semibold text-white text-sm lg:text-base mb-3 lg:mb-4">❓ Нужна помощь?</h3>
              <div className="space-y-2 lg:space-y-3">
                <motion.button 
                  className="w-full flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-base lg:text-lg">📞</span>
                  <div>
                    <div className="font-medium text-white text-xs lg:text-sm">Регистратура</div>
                    <div className="text-white/60 text-xs">+7 (495) 123-45-67</div>
                  </div>
                </motion.button>
                <motion.button 
                  className="w-full flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-base lg:text-lg">💬</span>
                  <div>
                    <div className="font-medium text-white text-xs lg:text-sm">Онлайн-чат</div>
                    <div className="text-white/60 text-xs">Круглосуточная поддержка</div>
                  </div>
                </motion.button>
                <motion.button 
                  className="w-full flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-base lg:text-lg">📋</span>
                  <div>
                    <div className="font-medium text-white text-xs lg:text-sm">Инструкция</div>
                    <div className="text-white/60 text-xs">Как записаться к врачу</div>
                  </div>
                </motion.button>
              </div>
            </InteractiveCard>

            {/* Emergency Card */}
            <InteractiveCard className="p-4 lg:p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
              <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-base lg:text-lg">
                  🚨
                </div>
                <div>
                  <div className="font-bold text-white text-sm lg:text-base">Срочная помощь</div>
                  <div className="text-white/60 text-xs lg:text-sm">Круглосуточно</div>
                </div>
              </div>
              <motion.button 
                className="w-full flex items-center justify-between p-2 lg:p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-red-400 font-medium text-sm lg:text-base">Вызов скорой</span>
                <span className="text-lg lg:text-xl">📞</span>
              </motion.button>
              <div className="text-center text-white/60 text-xs mt-2">
                Телефон: <span className="text-white font-mono">112 или 103</span>
              </div>
            </InteractiveCard>
          </div>
        </div>
      </div>
    </div>
  );
}