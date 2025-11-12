'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import DemoBreadcrumbs from '@/components/demo/DemoBreadcrumbs';
import { appointments, doctors, timeSlots, rooms, Appointment } from './demo-data';

type ViewType = 'day' | 'week';
type StatusType = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
type UserRole = 'admin' | 'doctor' | 'manager';

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<string>('2024-01-24');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [view, setView] = useState<ViewType>('day');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appointmentState, setAppointmentState] = useState(appointments);
  const [showQuickAppointment, setShowQuickAppointment] = useState(false);
  const [currentUser] = useState<UserRole>('manager');
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Fix hydration error
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Мемоизированные вычисления для оптимизации
  const filteredAppointments = useMemo(() => {
    return appointmentState.filter(appointment => {
      const matchesDate = appointment.date === selectedDate;
      const matchesDoctor = selectedDoctor === 'all' || appointment.doctorId === selectedDoctor;
      const matchesSearch = searchQuery === '' || 
        appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.patientPhone.includes(searchQuery);
      
      return matchesDate && matchesDoctor && matchesSearch;
    });
  }, [selectedDate, selectedDoctor, searchQuery, appointmentState]);

  // Получение дней недели для недельного вида
  const weekDays = useMemo(() => {
    if (view === 'day') return [selectedDate];
    
    const startDate = new Date(selectedDate);
    startDate.setDate(startDate.getDate() - startDate.getDay() + currentWeek * 7);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date.toISOString().split('T')[0];
    });
  }, [selectedDate, view, currentWeek]);

  // Обработчик изменения статуса приёма
  const handleStatusChange = (appointmentId: string, newStatus: StatusType) => {
    setAppointmentState(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );
  };

  // Создание нового приёма
  const handleCreateAppointment = (newAppointment: Omit<Appointment, 'id'>) => {
    const appointment: Appointment = {
      ...newAppointment,
      id: `app-${Date.now()}`,
    };
    setAppointmentState(prev => [...prev, appointment]);
    setShowQuickAppointment(false);
  };

  // Статистика для дашборда
  const stats = useMemo(() => ({
    total: filteredAppointments.length,
    inProgress: filteredAppointments.filter(a => a.status === 'in-progress').length,
    completed: filteredAppointments.filter(a => a.status === 'completed').length,
    scheduled: filteredAppointments.filter(a => a.status === 'scheduled').length,
    freeSlots: calculateFreeSlots()
  }), [filteredAppointments]);

  function calculateFreeSlots(): number {
    const totalSlots = doctors.reduce((acc, doctor) => {
      const workingSlots = timeSlots.filter(slot => 
        slot >= doctor.workingHours.start && slot < doctor.workingHours.end
      ).length;
      return acc + workingSlots;
    }, 0);
    
    return Math.max(0, totalSlots - filteredAppointments.length);
  }

  const getAppointmentsForTimeSlot = (timeSlot: string, doctorId?: string, date?: string) => {
    return appointmentState.filter(appointment => {
      const matchesDate = date ? appointment.date === date : appointment.date === selectedDate;
      const matchesDoctor = !doctorId || appointment.doctorId === doctorId;
      const matchesTime = appointment.startTime === timeSlot;
      return matchesDate && matchesDoctor && matchesTime;
    });
  };

  const getStatusConfig = (status: StatusType) => {
    const configs = {
      scheduled: { 
        color: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
        label: 'Запись',
        icon: '⏰'
      },
      'in-progress': { 
        color: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
        label: 'В процессе',
        icon: '🔄'
      },
      completed: { 
        color: 'bg-green-500/20 border-green-500/30 text-green-400',
        label: 'Завершён',
        icon: '✅'
      },
      cancelled: { 
        color: 'bg-red-500/20 border-red-500/30 text-red-400',
        label: 'Отменён',
        icon: '❌'
      },
      'no-show': { 
        color: 'bg-gray-500/20 border-gray-500/30 text-gray-400',
        label: 'Не явился',
        icon: '👤'
      }
    };
    return configs[status] || { color: 'bg-white/5 border-white/10 text-white/60', label: 'Неизвестно', icon: '❓' };
  };

  const getTypeConfig = (type: string) => {
    const configs = {
      consultation: { icon: '💬', label: 'Консультация', color: 'text-blue-400' },
      examination: { icon: '🔍', label: 'Обследование', color: 'text-purple-400' },
      procedure: { icon: '💉', label: 'Процедура', color: 'text-green-400' },
      surgery: { icon: '🔪', label: 'Операция', color: 'text-red-400' }
    };
    return configs[type as keyof typeof configs] || { icon: '📅', label: 'Приём', color: 'text-white/60' };
  };

  // Форматирование даты для отображения (фикс hydration)
  const formatDate = (dateString: string) => {
    if (!isClient) return 'Загрузка...';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  // Навигация по неделям
  const handleWeekNavigation = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => direction === 'next' ? prev + 1 : prev - 1);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-4 lg:mt-6 gap-3 lg:gap-4">
            <div className="flex-1">
              <h1 className="text-xl lg:text-3xl font-bold text-white mb-1 lg:mb-2">Календарь приёмов</h1>
              <p className="text-white/60 text-xs lg:text-base">
                {currentUser === 'doctor' ? 'Ваше расписание на сегодня' : 'Управление расписанием и приёмами пациентов'}
              </p>
              <div className="mt-1 lg:mt-2 text-white/40 text-xs lg:text-sm">
                {view === 'day' ? formatDate(selectedDate) : `Неделя ${currentWeek + 1}`}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
              <div className="relative flex-1 sm:max-w-xs">
              </div>
              
              <Link
                href="/demo/medicine/manager"
                className="px-3 lg:px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 text-sm font-medium text-white flex items-center justify-center gap-2"
              >
                <span>←</span>
                <span className="hidden sm:inline">Назад</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Mobile Sidebar Toggle */}
        <div className="xl:hidden flex justify-between items-center mb-4">
          <motion.button
            onClick={() => setMobileSidebarOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 text-white flex items-center gap-2"
          >
            <span>📊</span>
            <span>Панель управления</span>
          </motion.button>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-3 lg:gap-4 mb-6 lg:mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 flex-1">
            {/* Date and View Controls */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              {/* Date Selector */}
              <div className="flex flex-col">
                <label className="text-xs text-white/60 mb-1 font-medium">Дата</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 lg:px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-white text-sm"
                />
              </div>

              {/* View Toggle */}
              <div className="flex flex-col">
                <label className="text-xs text-white/60 mb-1 font-medium">Вид</label>
                <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
                  {[
                    { value: 'day' as ViewType, label: 'День', icon: '📅' },
                    { value: 'week' as ViewType, label: 'Неделя', icon: '📆' }
                  ].map(({ value, label, icon }) => (
                    <motion.button
                      key={value}
                      onClick={() => setView(value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        view === value
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="text-base">{icon}</span>
                      <span className="hidden sm:inline">{label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Week Navigation */}
              {view === 'week' && (
                <div className="flex flex-col">
                  <label className="text-xs text-white/60 mb-1 font-medium">Неделя</label>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleWeekNavigation('prev')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 text-white"
                    >
                      ←
                    </motion.button>
                    <motion.button
                      onClick={() => handleWeekNavigation('next')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 text-white"
                    >
                      →
                    </motion.button>
                  </div>
                </div>
              )}
            </div>

            {/* Doctor Filter - скрыт для врачей */}
            {currentUser !== 'doctor' && (
              <div className="flex flex-col flex-1 sm:max-w-xs">
                <label className="text-xs text-white/60 mb-1 font-medium">Врач</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="px-3 lg:px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-white text-sm"
                >
                  <option value="all">Все врачи</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} ({doctor.specialization})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
            <div className="flex gap-2 lg:gap-3">
              {/* Кнопка создания записи - доступна не для врачей */}
              {currentUser !== 'doctor' && (
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowQuickAppointment(true)}
                  className="flex-1 px-3 lg:px-4 py-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 text-sm font-medium text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  <span>+</span>
                  <span className="hidden sm:inline">Новый приём</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 mb-6 lg:mb-8"
        >
          {[
            { label: 'Всего', value: stats.total, icon: '👥', color: 'from-blue-400 to-cyan-500', textColor: 'text-blue-400' },
            { label: 'В процессе', value: stats.inProgress, icon: '⏱️', color: 'from-orange-400 to-orange-500', textColor: 'text-orange-400' },
            { label: 'Завершено', value: stats.completed, icon: '✅', color: 'from-green-400 to-emerald-500', textColor: 'text-green-400' },
            { label: 'Свободно', value: stats.freeSlots, icon: '⏰', color: 'from-purple-400 to-purple-500', textColor: 'text-purple-400' }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-3 lg:p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-2 lg:gap-3">
                <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                  <span className="text-sm lg:text-lg">{stat.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg lg:text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/60 text-xs lg:text-sm">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
          {/* Main Calendar */}
          <div className="xl:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl shadow-black/20"
            >
              {view === 'day' ? (
                <MobileDayView 
                  doctors={doctors}
                  timeSlots={timeSlots}
                  getAppointmentsForTimeSlot={getAppointmentsForTimeSlot}
                  setSelectedAppointment={setSelectedAppointment}
                  setShowQuickAppointment={setShowQuickAppointment}
                  currentUser={currentUser}
                  getStatusConfig={getStatusConfig}
                  getTypeConfig={getTypeConfig}
                  selectedDoctor={selectedDoctor}
                  setSelectedDoctor={setSelectedDoctor}
                />
              ) : (
                <WeekView 
                  weekDays={weekDays}
                  doctors={doctors}
                  timeSlots={timeSlots}
                  getAppointmentsForTimeSlot={getAppointmentsForTimeSlot}
                  setSelectedAppointment={setSelectedAppointment}
                  getStatusConfig={getStatusConfig}
                  getTypeConfig={getTypeConfig}
                  formatDate={formatDate}
                />
              )}
            </motion.div>
          </div>

          {/* Sidebar - скрыт на мобильных в пользу календаря */}
          <div className="hidden xl:block space-y-4 lg:space-y-6">
            <QuickActionsSidebar setShowQuickAppointment={setShowQuickAppointment} />
            <TodaysAppointmentsSidebar 
              filteredAppointments={filteredAppointments} 
              setSelectedAppointment={setSelectedAppointment}
              getTypeConfig={getTypeConfig}
            />
            <RoomStatusSidebar filteredAppointments={filteredAppointments} />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Modal */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <MobileSidebarModal 
            onClose={() => setMobileSidebarOpen(false)}
            filteredAppointments={filteredAppointments}
            setSelectedAppointment={setSelectedAppointment}
            getTypeConfig={getTypeConfig}
            setShowQuickAppointment={setShowQuickAppointment}
          />
        )}
      </AnimatePresence>

      {/* Модалки */}
      <AnimatePresence>
        {selectedAppointment && (
          <AppointmentModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            onStatusChange={handleStatusChange}
            userRole={currentUser}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQuickAppointment && (
          <QuickAppointmentModal
            onClose={() => setShowQuickAppointment(false)}
            onCreate={handleCreateAppointment}
            doctors={doctors}
            availableSlots={timeSlots}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Улучшенный мобильный вид дня
function MobileDayView({ 
  doctors, 
  timeSlots, 
  getAppointmentsForTimeSlot, 
  setSelectedAppointment, 
  setShowQuickAppointment, 
  currentUser, 
  getStatusConfig, 
  getTypeConfig,
  selectedDoctor,
  setSelectedDoctor
}) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      {/* Мобильный заголовок с врачами */}
      <div className="border-b border-white/10">
        <div className="flex overflow-x-auto p-3 space-x-2 scrollbar-hide">
          <button
            onClick={() => setSelectedDoctor('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedDoctor === 'all' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            Все врачи
          </button>
          {doctors.map(doctor => (
            <button
              key={doctor.id}
              onClick={() => setSelectedDoctor(doctor.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedDoctor === doctor.id 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {doctor.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Временные слоты */}
      <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
        {timeSlots.map((timeSlot, index) => {
          const appointments = getAppointmentsForTimeSlot(timeSlot);
          const hasAppointments = appointments.length > 0;
          
          return (
            <motion.div
              key={timeSlot}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="border-b border-white/10 last:border-b-0"
            >
              <div 
                className={`flex items-center p-4 cursor-pointer transition-colors ${
                  hasAppointments ? 'hover:bg-white/5' : ''
                } ${selectedTimeSlot === timeSlot ? 'bg-white/5' : ''}`}
                onClick={() => setSelectedTimeSlot(selectedTimeSlot === timeSlot ? null : timeSlot)}
              >
                <div className="w-16 flex-shrink-0">
                  <div className="text-white font-semibold text-sm bg-white/10 px-2 py-1 rounded-lg text-center">
                    {timeSlot}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 ml-3">
                  {hasAppointments ? (
                    <AppointmentSlots
                      timeSlot={timeSlot}
                      doctors={doctors}
                      selectedDoctor={selectedDoctor}
                      getAppointmentsForTimeSlot={getAppointmentsForTimeSlot}
                      setSelectedAppointment={setSelectedAppointment}
                      getStatusConfig={getStatusConfig}
                      getTypeConfig={getTypeConfig}
                      isExpanded={selectedTimeSlot === timeSlot}
                    />
                  ) : (
                    <div className="text-white/40 text-sm">Свободно</div>
                  )}
                </div>
                
                {hasAppointments && (
                  <div className="w-6 text-right">
                    <motion.span
                      animate={{ rotate: selectedTimeSlot === timeSlot ? 180 : 0 }}
                      className="text-white/40 text-lg"
                    >
                      ↓
                    </motion.span>
                  </div>
                )}
              </div>

              {/* Раскрытые записи */}
              <AnimatePresence>
                {selectedTimeSlot === timeSlot && hasAppointments && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-white/2"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      {doctors
                        .filter(doctor => selectedDoctor === 'all' || doctor.id === selectedDoctor)
                        .map(doctor => {
                          const appointments = getAppointmentsForTimeSlot(timeSlot, doctor.id);
                          return appointments.map(appointment => (
                            <AppointmentCard
                              key={appointment.id}
                              appointment={appointment}
                              doctor={doctor}
                              onClick={() => setSelectedAppointment(appointment)}
                              getStatusConfig={getStatusConfig}
                              getTypeConfig={getTypeConfig}
                              compact={false}
                            />
                          ));
                        })}
                      
                      {/* Кнопка добавления */}
                      {currentUser !== 'doctor' && (
                        <motion.button
                          onClick={() => setShowQuickAppointment(true)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full p-4 rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 text-white/40 hover:text-white/60 transition-all duration-200 flex items-center justify-center gap-3"
                        >
                          <span className="text-xl">+</span>
                          <span className="text-sm font-medium">Добавить запись на {timeSlot}</span>
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Action Button для мобильных */}
      {currentUser !== 'doctor' && (
        <motion.button
          onClick={() => setShowQuickAppointment(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-2xl shadow-blue-500/50 flex items-center justify-center text-white text-xl z-40 md:hidden"
        >
          +
        </motion.button>
      )}
    </div>
  );
}

// Компонент слотов записей
function AppointmentSlots({ 
  timeSlot, 
  doctors, 
  selectedDoctor, 
  getAppointmentsForTimeSlot, 
  setSelectedAppointment, 
  getStatusConfig, 
  getTypeConfig,
  isExpanded 
}) {
  const appointments = doctors
    .filter(doctor => selectedDoctor === 'all' || doctor.id === selectedDoctor)
    .flatMap(doctor => getAppointmentsForTimeSlot(timeSlot, doctor.id));

  if (appointments.length === 0) {
    return (
      <div className="text-white/40 text-sm">
        Нет записей
      </div>
    );
  }

  if (appointments.length === 1 && !isExpanded) {
    const appointment = appointments[0];
    const doctor = doctors.find(d => d.id === appointment.doctorId);
    return (
      <AppointmentCard
        appointment={appointment}
        doctor={doctor}
        onClick={() => setSelectedAppointment(appointment)}
        getStatusConfig={getStatusConfig}
        getTypeConfig={getTypeConfig}
        compact={true}
      />
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {appointments.slice(0, isExpanded ? appointments.length : 3).map((appointment, index) => {
        const doctor = doctors.find(d => d.id === appointment.doctorId);
        const statusConfig = getStatusConfig(appointment.status);
        const typeConfig = getTypeConfig(appointment.type);
        
        return (
          <motion.div
            key={appointment.id}
            whileHover={{ scale: 1.05 }}
            className={`px-3 py-2 rounded-xl text-sm font-medium ${statusConfig.color} cursor-pointer border flex items-center gap-2 min-w-0 flex-1 max-w-full`}
            onClick={() => setSelectedAppointment(appointment)}
            title={`${appointment.patientName} - ${doctor?.name}`}
          >
            <span className="text-base flex-shrink-0">{typeConfig.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold">{appointment.patientName.split(' ')[0]}</div>
              <div className="truncate text-xs opacity-80">{doctor?.name.split(' ')[0]}</div>
            </div>
          </motion.div>
        );
      })}
      {!isExpanded && appointments.length > 3 && (
        <div className="px-3 py-2 rounded-xl bg-white/10 text-white/60 text-sm">
          +{appointments.length - 3}
        </div>
      )}
    </div>
  );
}

// Карточка записи
function AppointmentCard({ 
  appointment, 
  doctor, 
  onClick, 
  getStatusConfig, 
  getTypeConfig, 
  compact = false 
}) {
  const statusConfig = getStatusConfig(appointment.status);
  const typeConfig = getTypeConfig(appointment.type);

  if (compact) {
    return (
      <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="p-3 rounded-xl border cursor-pointer transition-all duration-200 bg-white/5 hover:shadow-lg hover:shadow-black/20 active:scale-95"
        style={{ 
          borderColor: doctor?.color || '#3b82f6',
          backgroundColor: `${doctor?.color || '#3b82f6'}10`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-base flex-shrink-0">{typeConfig.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="text-white font-semibold text-sm truncate">
                {appointment.patientName.split(' ')[0]}
              </div>
              <div className="text-white/60 text-xs truncate">{doctor?.name.split(' ')[0]}</div>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${statusConfig.color} flex-shrink-0 ml-2`}>
            {statusConfig.icon}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="p-4 rounded-xl border cursor-pointer transition-all duration-200 bg-white/5 hover:shadow-lg hover:shadow-black/20 active:scale-95"
      style={{ 
        borderColor: doctor?.color || '#3b82f6',
        backgroundColor: `${doctor?.color || '#3b82f6'}15`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="text-xl flex-shrink-0">{typeConfig.icon}</span>
          <div className="min-w-0 flex-1">
            <div className="text-white font-semibold text-base truncate">{appointment.patientName}</div>
            <div className="text-white/60 text-sm truncate">{doctor?.name}</div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color} flex-shrink-0 ml-2`}>
          {statusConfig.label}
        </span>
      </div>
      <div className="flex items-center justify-between text-white/60 text-sm">
        <span className="font-medium">{appointment.startTime} - {appointment.endTime}</span>
        {appointment.room && (
          <span className="bg-white/10 px-3 py-1 rounded-lg text-xs">Каб. {appointment.room}</span>
        )}
      </div>
    </motion.div>
  );
}

// Мобильная боковая панель
function MobileSidebarModal({ onClose, filteredAppointments, setSelectedAppointment, getTypeConfig, setShowQuickAppointment }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end xl:hidden"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="bg-slate-800 border-t border-white/10 rounded-t-3xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/10 sticky top-0 bg-slate-800 rounded-t-3xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Панель управления</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: '👥', label: 'Быстрая запись', color: 'from-blue-500/20 to-blue-600/20', onClick: () => { setShowQuickAppointment(true); onClose(); } },
              { icon: '📋', label: 'Расписание', color: 'from-green-500/20 to-emerald-600/20' },
            ].map((action, index) => (
              <motion.button
                key={index}
                onClick={action.onClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 flex items-center gap-3 group"
              >
                <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {action.icon}
                </span>
                <span className="text-sm font-medium text-white text-left flex-1">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Today's Appointments */}
          <div>
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <span>⏰</span>
              Ближайшие приёмы
            </h3>
            <div className="space-y-3">
              {filteredAppointments
                .filter(a => a.status === 'scheduled')
                .slice(0, 3)
                .map((appointment, index) => {
                  const typeConfig = getTypeConfig(appointment.type);
                  return (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => { setSelectedAppointment(appointment); onClose(); }}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-white font-medium text-sm truncate flex-1">
                          {appointment.patientName}
                        </div>
                        <div className="text-white/60 text-xs bg-white/10 px-2 py-1 rounded-lg ml-2">
                          {appointment.startTime}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-white/60 text-xs">
                        <span className="truncate">{appointment.doctorName}</span>
                        <span className="flex items-center gap-1">
                          <span>{typeConfig.icon}</span>
                          <span>Каб. {appointment.room}</span>
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              {filteredAppointments.filter(a => a.status === 'scheduled').length === 0 && (
                <div className="text-center py-6 text-white/40 text-sm">
                  На сегодня записей нет
                </div>
              )}
            </div>
          </div>

          {/* Room Status */}
          <div>
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <span>🚪</span>
              Статус кабинетов
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {rooms.slice(0, 4).map((room, index) => {
                const roomAppointments = filteredAppointments.filter(a => a.room === room.id);
                const currentAppointment = roomAppointments.find(a => a.status === 'in-progress');
                
                return (
                  <motion.div 
                    key={room.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{room.name}</div>
                      <div className="text-white/60 text-xs truncate">
                        {currentAppointment ? currentAppointment.patientName : 'Свободен'}
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      currentAppointment 
                        ? 'bg-orange-400 animate-pulse' 
                        : 'bg-green-400'
                    } group-hover:scale-125`} 
                    title={currentAppointment ? 'Занят' : 'Свободен'}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Компонент недельного вида
function WeekView({ weekDays, doctors, timeSlots, getAppointmentsForTimeSlot, setSelectedAppointment, getStatusConfig, getTypeConfig, formatDate }) {
  return (
    <>
      <div className="grid grid-cols-8 gap-px bg-white/10 overflow-x-auto">
        <div className="bg-white/5 p-3 lg:p-4 col-span-1">
          <div className="text-sm text-white/60 font-medium">Время</div>
        </div>
        {weekDays.map((date, index) => (
          <div key={date} className="bg-white/5 p-3 lg:p-4 text-center">
            <div className="font-medium text-white text-sm">{formatDate(date)}</div>
            <div className="text-white/60 text-xs hidden lg:block">
              {new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
            </div>
          </div>
        ))}
      </div>

      <div className="max-h-[400px] lg:max-h-[600px] overflow-y-auto custom-scrollbar">
        {timeSlots.map((timeSlot, timeIndex) => (
          <motion.div 
            key={timeSlot} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: timeIndex * 0.05 }}
            className="grid grid-cols-8 gap-px bg-white/10"
          >
            <div className="bg-white/5 p-2 lg:p-3 border-r border-white/10 flex items-center justify-center">
              <div className="text-sm text-white/60 font-medium bg-white/5 px-2 py-1 rounded-lg text-xs lg:text-sm">
                {timeSlot}
              </div>
            </div>

            {weekDays.map((date, dateIndex) => {
              const dayAppointments = getAppointmentsForTimeSlot(timeSlot, undefined, date);
              
              return (
                <motion.div
                  key={date}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                  className="p-1 lg:p-2 min-h-16 lg:min-h-20 transition-all duration-200 border-r border-white/10 bg-white/2"
                >
                  {dayAppointments.slice(0, 2).map((appointment, aptIndex) => {
                    const statusConfig = getStatusConfig(appointment.status);
                    const typeConfig = getTypeConfig(appointment.type);
                    const doctor = doctors.find(d => d.id === appointment.doctorId);
                    
                    return (
                      <motion.div
                        key={appointment.id}
                        onClick={() => setSelectedAppointment(appointment)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-2 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-black/20 active:scale-95 mb-1 bg-white/5"
                        style={{ 
                          borderColor: doctor?.color || '#666',
                          backgroundColor: `${doctor?.color || '#666'}10`,
                        }}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs">{typeConfig.icon}</span>
                          <span className={`px-1 py-0.5 rounded-full text-xs ${statusConfig.color} hidden sm:block`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-white truncate">
                          {appointment.patientName}
                        </div>
                        <div className="text-white/60 text-xs truncate">
                          {doctor?.name}
                        </div>
                      </motion.div>
                    );
                  })}
                  {dayAppointments.length > 2 && (
                    <div className="text-center p-1">
                      <span className="text-white/40 text-xs">+{dayAppointments.length - 2} ещё</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        ))}
      </div>
    </>
  );
}

// Боковая панель быстрых действий
function QuickActionsSidebar({ setShowQuickAppointment }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
      <h3 className="font-semibold text-white mb-3 lg:mb-4 flex items-center gap-2">
        <span>⚡</span>
        Быстрые действия
      </h3>
      <div className="space-y-2 lg:space-y-3">
        {[
          { icon: '👥', label: 'Быстрая запись', color: 'from-blue-500/20 to-blue-600/20', onClick: () => setShowQuickAppointment(true) },
          { icon: '📋', label: 'Массовое расписание', color: 'from-green-500/20 to-emerald-600/20' },
          { icon: '🔄', label: 'Перенос приёмов', color: 'from-orange-500/20 to-orange-600/20' },
          { icon: '📊', label: 'Отчёт по загрузке', color: 'from-purple-500/20 to-purple-600/20' }
        ].map((action, index) => (
          <motion.button
            key={index}
            onClick={action.onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full text-left p-2 lg:p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 flex items-center gap-2 lg:gap-3 group"
          >
            <span className={`w-7 h-7 lg:w-9 lg:h-9 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-sm lg:text-base group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
              {action.icon}
            </span>
            <span className="text-sm font-medium text-white">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Боковая панель сегодняшних записей
function TodaysAppointmentsSidebar({ filteredAppointments, setSelectedAppointment, getTypeConfig }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
      <h3 className="font-semibold text-white mb-3 lg:mb-4 flex items-center gap-2">
        <span>⏰</span>
        Ближайшие приёмы
      </h3>
      <div className="space-y-2 lg:space-y-3 max-h-60 lg:max-h-80 overflow-y-auto custom-scrollbar">
        {filteredAppointments
          .filter(a => a.status === 'scheduled')
          .slice(0, 4)
          .map((appointment, index) => {
            const typeConfig = getTypeConfig(appointment.type);
            return (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedAppointment(appointment)}
                className="p-2 lg:p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-1 lg:mb-2">
                  <div className="text-white font-medium text-xs lg:text-sm truncate flex-1">
                    {appointment.patientName}
                  </div>
                  <div className="text-white/60 text-xs bg-white/10 px-1 lg:px-2 py-1 rounded-lg ml-2">
                    {appointment.startTime}
                  </div>
                </div>
                <div className="flex items-center justify-between text-white/60 text-xs">
                  <span className="truncate">{appointment.doctorName}</span>
                  <span className="flex items-center gap-1">
                    <span>{typeConfig.icon}</span>
                    <span className="hidden sm:inline">Каб. {appointment.room}</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        {filteredAppointments.filter(a => a.status === 'scheduled').length === 0 && (
          <div className="text-center py-4 lg:py-6 text-white/40 text-xs lg:text-sm">
            На сегодня записей нет
          </div>
        )}
      </div>
    </div>
  );
}

// Боковая панель статуса кабинетов
function RoomStatusSidebar({ filteredAppointments }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
      <h3 className="font-semibold text-white mb-3 lg:mb-4 flex items-center gap-2">
        <span>🚪</span>
        Статус кабинетов
      </h3>
      <div className="space-y-2">
        {rooms.slice(0, 4).map((room, index) => {
          const roomAppointments = filteredAppointments.filter(a => a.room === room.id);
          const currentAppointment = roomAppointments.find(a => a.status === 'in-progress');
          
          return (
            <motion.div 
              key={room.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-2 lg:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{room.name}</div>
                <div className="text-white/60 text-xs truncate">
                  {currentAppointment ? currentAppointment.patientName : 'Свободен'}
                </div>
              </div>
              <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-200 ${
                currentAppointment 
                  ? 'bg-orange-400 animate-pulse' 
                  : 'bg-green-400'
              } group-hover:scale-125`} 
              title={currentAppointment ? 'Занят' : 'Свободен'}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Модалка быстрой записи
function QuickAppointmentModal({ onClose, onCreate, doctors, availableSlots }: QuickAppointmentModalProps) {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedType, setSelectedType] = useState('consultation');
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    phone: '',
    email: '',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);
    
    const newAppointment: Omit<Appointment, 'id'> = {
      patientName: patientInfo.name,
      patientPhone: patientInfo.phone,
      doctorId: selectedDoctor,
      doctorName: selectedDoctorData?.name || '',
      date: '2024-01-24',
      startTime: selectedSlot,
      endTime: calculateEndTime(selectedSlot, selectedType),
      type: selectedType as any,
      status: 'scheduled',
      room: selectedDoctorData?.room || '101',
      notes: patientInfo.reason
    };
    
    onCreate(newAppointment);
  };

  const calculateEndTime = (startTime: string, type: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const duration = type === 'consultation' ? 30 : type === 'examination' ? 45 : 60;
    const endMinutes = minutes + duration;
    const endHours = hours + Math.floor(endMinutes / 60);
    const finalMinutes = endMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Быстрая запись пациента</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">ФИО пациента *</label>
              <input
                type="text"
                value={patientInfo.name}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                placeholder="Иванов Иван Иванович"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Телефон *</label>
                <input
                  type="tel"
                  value={patientInfo.phone}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                  placeholder="+7 (999) 999-99-99"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                <input
                  type="email"
                  value={patientInfo.email}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                  placeholder="patient@example.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Врач *</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  required
                >
                  <option value="">Выберите врача</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Время *</label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  required
                >
                  <option value="">Выберите время</option>
                  {availableSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Причина обращения</label>
              <textarea
                value={patientInfo.reason}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                placeholder="Опишите симптомы или причину обращения..."
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white"
            >
              Отмена
            </button>
            <button
              onClick={handleSubmit}
              disabled={!patientInfo.name || !patientInfo.phone || !selectedDoctor || !selectedSlot}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 text-white font-medium"
            >
              Создать запись
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Компонент модалки деталей приёма
function AppointmentModal({ appointment, onClose, onStatusChange, userRole }: AppointmentModalProps) {
  const [editedAppointment, setEditedAppointment] = useState<Appointment>(appointment);

  const handleStatusChange = (newStatus: StatusType) => {
    setEditedAppointment(prev => ({ ...prev, status: newStatus }));
    onStatusChange(appointment.id, newStatus);
  };

  const getTypeConfig = (type: string) => {
    const configs = {
      consultation: { icon: '💬', label: 'Консультация' },
      examination: { icon: '🔍', label: 'Обследование' },
      procedure: { icon: '💉', label: 'Процедура' },
      surgery: { icon: '🔪', label: 'Операция' }
    };
    return configs[type as keyof typeof configs] || { icon: '📅', label: 'Приём' };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 border border-white/10 rounded-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Детали приёма</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Пациент:</span>
              <span className="text-white font-medium">{editedAppointment.patientName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Телефон:</span>
              <span className="text-white">{editedAppointment.patientPhone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Врач:</span>
              <span className="text-white">{editedAppointment.doctorName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Время:</span>
              <span className="text-white">{editedAppointment.startTime} - {editedAppointment.endTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Кабинет:</span>
              <span className="text-white">{editedAppointment.room}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Тип:</span>
              <span className="text-white flex items-center gap-2">
                {getTypeConfig(editedAppointment.type).icon}
                {getTypeConfig(editedAppointment.type).label}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Статус</label>
            <select
              value={editedAppointment.status}
              onChange={(e) => handleStatusChange(e.target.value as StatusType)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-colors text-white text-sm"
            >
              <option value="scheduled">Запланирован</option>
              <option value="in-progress">В процессе</option>
              <option value="completed">Завершён</option>
              <option value="cancelled">Отменён</option>
              <option value="no-show">Не явился</option>
            </select>
          </div>

          {editedAppointment.notes && (
            <div>
              <div className="text-sm text-white/60 mb-2">Примечания</div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm">
                {editedAppointment.notes}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm font-medium text-white"
            >
              Закрыть
            </button>
            {userRole !== 'doctor' && (
              <button className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 text-sm font-medium text-white">
                Редактировать
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Типы для TypeScript
interface QuickAppointmentModalProps {
  onClose: () => void;
  onCreate: (appointment: Omit<Appointment, 'id'>) => void;
  doctors: any[];
  availableSlots: string[];
}

interface AppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
  onStatusChange: (appointmentId: string, status: StatusType) => void;
  userRole: UserRole;
}