// /src/app/demo/medicine/doctor/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  upcomingAppointments, 
  patientStats, 
  medicalAlerts, 
  recentActivities,
  quickActions,
  departmentStats,
  emergencyContacts
} from './demo-data';
import { AppointmentCard } from '@/components/medicine/AppointmentCard';
import { PatientStatsCard } from '@/components/medicine/PatientStatsCard';
import { MedicalAlertCard } from '@/components/medicine/MedicalAlertCard';
import { InteractiveCard } from '@/components/medicine/InteractiveCard';
import { EmergencyModal } from '@/components/medicine/EmergencyModal';
import { NotificationBell } from '@/components/medicine/NotificationBell';
import { SearchBar } from '@/components/medicine/SearchBar';

// Helper function for consistent date formatting
const formatCurrentDate = (date: Date) => {
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'short'
  });
};

export default function DoctorDashboard() {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [currentDate, setCurrentDate] = useState('');
  const [activeTab, setActiveTab] = useState('today');

  // Initialize date only on client side
  useEffect(() => {
    setCurrentDate(formatCurrentDate(new Date()));
    
    const timer = setInterval(() => {
      setCurrentDate(formatCurrentDate(new Date()));
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Check online status only on client
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const filteredAppointments = upcomingAppointments.filter(apt =>
    apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayAppointments = filteredAppointments.filter(apt => apt.date === 'Сегодня');
  const urgentAppointments = filteredAppointments.filter(apt => apt.isUrgent);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const quickActionColors = {
    schedule: "from-blue-500/20 to-blue-600/20",
    patients: "from-green-500/20 to-emerald-600/20",
    prescriptions: "from-purple-500/20 to-purple-600/20", 
    telemed: "from-orange-500/20 to-orange-600/20",
    lab: "from-red-500/20 to-pink-600/20",
    records: "from-cyan-500/20 to-cyan-600/20"
  };

  const handleEmergencyCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const getAppointmentsToShow = () => {
    switch (activeTab) {
      case 'today': return todayAppointments;
      case 'urgent': return urgentAppointments;
      case 'all': return filteredAppointments;
      default: return todayAppointments;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6">
        
        {/* Header with Search and Notifications */}
        <motion.header 
          className="mb-6 lg:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4 mb-4 lg:mb-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-xl lg:text-2xl shadow-lg shadow-green-500/25">
                  👨‍⚕️
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 rounded-full border-2 border-slate-800 shadow-lg ${
                  isOnline ? 'bg-green-400' : 'bg-gray-400'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-end sm:gap-3">
                  <h1 className="text-xl lg:text-3xl font-bold text-white mb-1 leading-tight">
                    Добро пожаловать, Доктор Петров!
                  </h1>
                  {currentDate && (
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <span>•</span>
                      <span>{currentDate}</span>
                    </div>
                  )}
                </div>
                <p className="text-white/60 text-xs lg:text-sm">
                  Терапевтическое отделение • Старший врач
                </p>
              </div>
            </div>
          </div>

          {/* Doctor Stats Cards */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Today's Patients */}
            <InteractiveCard className="p-3 lg:p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                  <span className="text-sm lg:text-lg">👥</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg lg:text-2xl font-bold text-white">{patientStats.todayPatients}</div>
                  <div className="text-xs lg:text-sm text-white/60 truncate">Пациентов сегодня</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 text-xs lg:text-sm font-semibold">+2</div>
                  <div className="text-white/40 text-xs">к вчера</div>
                </div>
              </div>
            </InteractiveCard>

            {/* Waiting Now */}
            <InteractiveCard className="p-3 lg:p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
                  <span className="text-sm lg:text-lg">⏱️</span>
                </div>
                <div>
                  <div className="text-lg lg:text-2xl font-bold text-white">{patientStats.waitingNow}</div>
                  <div className="text-xs lg:text-sm text-white/60">Ожидают</div>
                </div>
              </div>
            </InteractiveCard>

            {/* Urgent Cases */}
            <InteractiveCard className="p-3 lg:p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-white shadow-lg">
                  <span className="text-sm lg:text-lg">🚨</span>
                </div>
                <div>
                  <div className="text-lg lg:text-2xl font-bold text-white">{patientStats.urgentCases}</div>
                  <div className="text-xs lg:text-sm text-white/60">Срочные</div>
                </div>
              </div>
            </InteractiveCard>

            {/* Satisfaction */}
            <InteractiveCard className="p-3 lg:p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center text-white shadow-lg">
                  <span className="text-sm lg:text-lg">⭐</span>
                </div>
                <div>
                  <div className="text-lg lg:text-2xl font-bold text-white">{patientStats.satisfaction}%</div>
                  <div className="text-xs lg:text-sm text-white/60">Удовлетворённость</div>
                </div>
              </div>
            </InteractiveCard>
          </motion.div>
        </motion.header>

        {/* Quick Actions */}
        <motion.section 
          className="mb-6 lg:mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-2xl font-bold text-white">Быстрые действия</h2>
            <div className="text-xs lg:text-sm text-white/60 hidden sm:block">
              Рабочие инструменты
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
            {quickActions.map((action, index) => (
              <motion.div 
                key={action.id} 
                variants={itemVariants} 
                custom={index}
                whileHover={{ y: -2 }}
                className="h-full"
              >
                <Link href={action.href} className="block h-full">
                  <InteractiveCard className="p-3 lg:p-4 group hover:bg-white/10 transition-all duration-300 h-full border border-white/5 hover:border-white/10">
                    <div className={`w-9 h-9 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br ${quickActionColors[action.id]} flex items-center justify-center text-base lg:text-lg mb-2 lg:mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {action.icon}
                    </div>
                    <div className="font-semibold text-white text-sm lg:text-base mb-1 leading-tight text-center">
                      {action.label}
                    </div>
                    <div className="text-white/60 text-xs leading-tight line-clamp-2 text-center">
                      {action.description}
                    </div>
                  </InteractiveCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {/* Left Column - Appointments & Medical Data */}
          <div className="xl:col-span-2 space-y-4 lg:space-y-6">
            {/* Upcoming Appointments */}
            <motion.section
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-lg lg:text-2xl font-bold text-white">Приёмы пациентов</h2>
                <div className="flex items-center gap-2">
                  <div className="flex bg-white/5 rounded-lg p-1">
                    {['today', 'urgent', 'all'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                          activeTab === tab 
                            ? 'bg-blue-500 text-white shadow-lg' 
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        {tab === 'today' ? 'Сегодня' : tab === 'urgent' ? 'Срочные' : 'Все'}
                      </button>
                    ))}
                  </div>
                  <Link 
                    href="/demo/medicine/manager/modules/schedule"
                    className="text-xs lg:text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 group ml-2"
                  >
                    Расписание <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              
              <div className="space-y-2 lg:space-y-3">
                <AnimatePresence mode="popLayout">
                  {getAppointmentsToShow().map((appointment, index) => (
                    <motion.div 
                      key={appointment.id} 
                      variants={itemVariants}
                      layout
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <Link href={`/demo/medicine/manager/modules/patients/${appointment.patientId}`}>
                        <AppointmentCard 
                          appointment={appointment} 
                          showPatientInfo 
                          showMedicalInfo
                        />
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* No appointments message */}
              {getAppointmentsToShow().length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <InteractiveCard className="p-4 lg:p-6 text-center border border-dashed border-white/20 bg-white/5">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-lg lg:text-xl mb-3 mx-auto">
                      📅
                    </div>
                    <div className="font-semibold text-white text-sm lg:text-base mb-1 lg:mb-2">
                      {activeTab === 'today' ? 'Нет приёмов на сегодня' : 
                       activeTab === 'urgent' ? 'Нет срочных случаев' : 'Нет запланированных приёмов'}
                    </div>
                    <div className="text-white/60 text-xs lg:text-sm mb-3 lg:mb-4">
                      {activeTab === 'today' ? 'Все пациенты обслужены' : 
                       activeTab === 'urgent' ? 'Это хорошая новость!' : 'Запланируйте новые приёмы'}
                    </div>
                    <Link
                      href="/demo/medicine/manager/modules/schedule"
                      className="inline-flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-2xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200 text-blue-400 text-xs lg:text-sm font-medium"
                    >
                      <span>📅</span>
                      <span>Управление расписанием</span>
                    </Link>
                  </InteractiveCard>
                </motion.div>
              )}
            </motion.section>

            {/* Medical Alerts & Department Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Medical Alerts */}
              <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h2 className="text-lg lg:text-2xl font-bold text-white">Медицинские алерты</h2>
                  <span className="text-xs lg:text-sm text-white/60 bg-red-500/20 px-2 py-1 rounded-full">
                    {medicalAlerts.filter(alert => alert.priority === 'high').length} критических
                  </span>
                </div>
                
                <div className="space-y-2 lg:space-y-3">
                  {medicalAlerts.slice(0, 3).map((alert, index) => (
                    <motion.div key={alert.id} variants={itemVariants} custom={index}>
                      <MedicalAlertCard alert={alert} />
                    </motion.div>
                  ))}
                  
                  {medicalAlerts.length > 3 && (
                    <motion.div variants={itemVariants}>
                      <Link
                        href="/demo/medicine/manager/modules/alerts"
                        className="block text-center p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 text-white/60 hover:text-white text-xs lg:text-sm"
                      >
                        Показать все {medicalAlerts.length} алертов
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.section>

              {/* Department Statistics */}
              <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h3 className="text-base lg:text-xl font-bold text-white">Статистика отделения</h3>
                  <span className="text-xs lg:text-sm text-white/60 bg-white/5 px-2 py-1 rounded-full">
                    За сегодня
                  </span>
                </div>
                
                <InteractiveCard className="p-4 lg:p-6">
                  <div className="space-y-4">
                    {departmentStats.map((stat, index) => (
                      <motion.div 
                        key={stat.id}
                        className="flex items-center justify-between"
                        variants={itemVariants}
                        custom={index}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl ${stat.color} flex items-center justify-center text-sm`}>
                            {stat.icon}
                          </div>
                          <div>
                            <div className="font-medium text-white text-sm">{stat.label}</div>
                            <div className="text-white/60 text-xs">{stat.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold text-lg">{stat.value}</div>
                          <div className={`text-xs font-medium ${
                            stat.trend === 'up' ? 'text-green-400' : 
                            stat.trend === 'down' ? 'text-red-400' : 'text-white/60'
                          }`}>
                            {stat.change}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </InteractiveCard>
              </motion.section>
            </div>
          </div>

          {/* Right Column - Emergency & Quick Help */}
          <div className="space-y-4 lg:space-y-6">
            {/* Emergency & Quick Help */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-lg lg:text-2xl font-bold text-white mb-4 lg:mb-6">Экстренные случаи</h2>
              
              <div className="space-y-3 lg:space-y-4">
                {/* Emergency Card */}
                <motion.div whileHover={{ y: -2 }}>
                  <InteractiveCard className="p-3 lg:p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20 hover:border-red-500/30 transition-all duration-300">
                    <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-base lg:text-lg">
                        🚨
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm lg:text-base">Критический случай</div>
                        <div className="text-white/60 text-xs lg:text-sm">Требует немедленного внимания</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <motion.button 
                        className="w-full flex items-center justify-between p-2 lg:p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsEmergencyModalOpen(true)}
                      >
                        <span className="text-red-400 font-medium text-sm lg:text-base">Вызов реанимации</span>
                        <span className="text-base lg:text-lg">🚑</span>
                      </motion.button>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEmergencyCall('112')}
                          className="flex-1 text-center p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors text-xs"
                        >
                          Дежурный администратор
                        </button>
                        <button 
                          onClick={() => handleEmergencyCall('103')}
                          className="flex-1 text-center p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors text-xs"
                        >
                          Старшая медсестра
                        </button>
                      </div>
                    </div>
                  </InteractiveCard>
                </motion.div>

                {/* Recent Activities */}
                <motion.div whileHover={{ y: -1 }}>
                  <InteractiveCard className="p-3 lg:p-4">
                    <div className="font-semibold text-white text-sm lg:text-base mb-3 lg:mb-4">Последние действия</div>
                    <div className="space-y-2">
                      {recentActivities.map((activity, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-3 p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                          whileHover={{ x: 3 }}
                        >
                          <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-lg ${activity.color} flex items-center justify-center text-xs lg:text-sm flex-shrink-0`}>
                            {activity.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-xs lg:text-sm truncate">{activity.action}</div>
                            <div className="text-white/60 text-xs truncate">{activity.patient}</div>
                          </div>
                          <div className="text-white/40 text-xs whitespace-nowrap">{activity.time}</div>
                        </motion.div>
                      ))}
                    </div>
                  </InteractiveCard>
                </motion.div>

                {/* Quick Contacts */}
                <motion.div variants={itemVariants}>
                  <InteractiveCard className="p-3 lg:p-4">
                    <div className="font-semibold text-white text-sm lg:text-base mb-3 lg:mb-4">Быстрые контакты</div>
                    <div className="space-y-2">
                      {emergencyContacts.map((contact, index) => (
                        <motion.button
                          key={index}
                          className="w-full flex items-center justify-between p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                          whileHover={{ x: 3 }}
                          onClick={() => contact.phone && handleEmergencyCall(contact.phone.replace(/\D/g, ''))}
                        >
                          <div className="text-left flex-1 min-w-0">
                            <div className="text-white text-xs lg:text-sm truncate">{contact.name}</div>
                            <div className="text-white/60 text-xs truncate">{contact.role}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {contact.phone && (
                              <span className="text-white/60 text-xs">{contact.phone}</span>
                            )}
                            <span className="text-base lg:text-lg opacity-60 group-hover:opacity-100 transition-opacity">
                              {contact.icon}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </InteractiveCard>
                </motion.div>
              </div>
            </motion.section>

            {/* Medical Resources */}
            <motion.section
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-lg lg:text-2xl font-bold text-white">Медицинские ресурсы</h2>
                <Link 
                  href="/demo/medicine/manager/modules/resources"
                  className="text-xs lg:text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 group"
                >
                  Все <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
              
              <InteractiveCard className="p-3 lg:p-4">
                <div className="space-y-2 lg:space-y-3">
                  {[
                    { icon: '📚', title: 'Медицинские протоколы', description: 'Актуальные руководства', color: 'bg-blue-500/20' },
                    { icon: '💊', title: 'Справочник препаратов', description: 'База лекарств', color: 'bg-purple-500/20' },
                    { icon: '🔬', title: 'Лабораторные нормы', description: 'Референсные значения', color: 'bg-green-500/20' },
                  ].map((resource, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 group cursor-pointer border border-transparent hover:border-white/5"
                      whileHover={{ x: 3 }}
                      variants={itemVariants}
                    >
                      <div className={`w-7 h-7 lg:w-9 lg:h-9 rounded-xl ${resource.color} flex items-center justify-center text-xs lg:text-sm flex-shrink-0`}>
                        {resource.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-xs lg:text-sm mb-0.5 truncate">
                          {resource.title}
                        </div>
                        <div className="text-white/60 text-xs truncate">
                          {resource.description}
                        </div>
                      </div>
                      <motion.span
                        className="opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity text-base lg:text-lg"
                        whileHover={{ x: 1 }}
                      >
                        →
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </InteractiveCard>
            </motion.section>
          </div>
        </div>
      </div>

      {/* Emergency Modal */}
      <EmergencyModal 
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onEmergencyCall={handleEmergencyCall}
        isDoctor={true}
      />
    </div>
  );
}