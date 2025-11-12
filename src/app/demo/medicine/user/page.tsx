// /src/app/demo/medicine/user/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  upcomingAppointments, 
  healthMetrics, 
  activePrescriptions, 
  recentDocuments,
  quickActions,
  healthTips,
  clinicContacts
} from './demo-data';
import { AppointmentCard } from '@/components/medicine/AppointmentCard';
import { HealthMetric } from '@/components/medicine/HealthMetric';
import { PrescriptionCard } from '@/components/medicine/PrescriptionCard';
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

export default function UserDashboard() {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [currentDate, setCurrentDate] = useState('');

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

  // Health tips rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const filteredDocuments = recentDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dashboardStats = {
    totalAppointments: upcomingAppointments.length,
    activePrescriptionsCount: activePrescriptions.length,
    recentDocumentsCount: recentDocuments.length,
    urgentAppointments: upcomingAppointments.filter(apt => apt.isUrgent).length
  };

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
    appointment: "from-blue-500/20 to-blue-600/20",
    history: "from-green-500/20 to-emerald-600/20",
    prescription: "from-purple-500/20 to-purple-600/20", 
    chat: "from-orange-500/20 to-orange-600/20"
  };

  const handleEmergencyCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
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
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xl lg:text-2xl shadow-lg shadow-blue-500/25">
                  👤
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 rounded-full border-2 border-slate-800 shadow-lg ${
                  isOnline ? 'bg-green-400' : 'bg-gray-400'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-end sm:gap-3">
                  <h1 className="text-xl lg:text-3xl font-bold text-white mb-1 leading-tight">
                    Добро пожаловать, Алексей!
                  </h1>
                  {/* Date will be empty on server, populated on client */}
                  {currentDate && (
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <span>•</span>
                      <span>{currentDate}</span>
                    </div>
                  )}
                </div>
                <p className="text-white/60 text-xs lg:text-sm">
                  Ваше здоровье под контролем
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-3">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Поиск документов, назначений..."
                className="flex-1 min-w-0"
              />
              <NotificationBell count={3} />
            </div>
          </div>

          {/* Health Score Cards */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Health Rating */}
            <InteractiveCard className="p-3 lg:p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                  <span className="text-sm lg:text-lg">⭐</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg lg:text-2xl font-bold text-white">4.8</div>
                  <div className="text-xs lg:text-sm text-white/60 truncate">Рейтинг здоровья</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 text-xs lg:text-sm font-semibold">+0.2</div>
                  <div className="text-white/40 text-xs">за неделю</div>
                </div>
              </div>
            </InteractiveCard>

            {/* Appointments */}
            <InteractiveCard className="p-3 lg:p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                  <span className="text-sm lg:text-lg">📅</span>
                </div>
                <div>
                  <div className="text-lg lg:text-2xl font-bold text-white">{dashboardStats.totalAppointments}</div>
                  <div className="text-xs lg:text-sm text-white/60">Приёмов</div>
                </div>
              </div>
            </InteractiveCard>

            {/* Prescriptions */}
            <InteractiveCard className="p-3 lg:p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center text-white shadow-lg">
                  <span className="text-sm lg:text-lg">💊</span>
                </div>
                <div>
                  <div className="text-lg lg:text-2xl font-bold text-white">{dashboardStats.activePrescriptionsCount}</div>
                  <div className="text-xs lg:text-sm text-white/60">Назначений</div>
                </div>
              </div>
            </InteractiveCard>

            {/* Documents */}
            <InteractiveCard className="p-3 lg:p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
                  <span className="text-sm lg:text-lg">📄</span>
                </div>
                <div>
                  <div className="text-lg lg:text-2xl font-bold text-white">{dashboardStats.recentDocumentsCount}</div>
                  <div className="text-xs lg:text-sm text-white/60">Документов</div>
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
              Часто используемые функции
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
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
                    <div className="font-semibold text-white text-sm lg:text-base mb-1 leading-tight">
                      {action.label}
                    </div>
                    <div className="text-white/60 text-xs leading-tight line-clamp-2">
                      {action.description}
                    </div>
                    <div className="mt-2 text-blue-400 text-xs font-medium group-hover:underline opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1">
                      Перейти <span className="text-lg">→</span>
                    </div>
                  </InteractiveCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {/* Left Column - Appointments & Health Data */}
          <div className="xl:col-span-2 space-y-4 lg:space-y-6">
            {/* Upcoming Appointments */}
            <motion.section
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-lg lg:text-2xl font-bold text-white">Ближайшие приёмы</h2>
                <Link 
                  href="/demo/medicine/user/modules/appointment"
                  className="text-xs lg:text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 group"
                >
                  Все записи <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
              
              <div className="space-y-2 lg:space-y-3">
                <AnimatePresence mode="popLayout">
                  {upcomingAppointments.map((appointment, index) => (
                    <motion.div 
                      key={appointment.id} 
                      variants={itemVariants}
                      layout
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <Link href={`/demo/medicine/user/modules/appointment?appointment=${appointment.id}`}>
                        <AppointmentCard appointment={appointment} />
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* No appointments message */}
              {upcomingAppointments.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <InteractiveCard className="p-4 lg:p-6 text-center border border-dashed border-white/20 bg-white/5">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-lg lg:text-xl mb-3 mx-auto">
                      📅
                    </div>
                    <div className="font-semibold text-white text-sm lg:text-base mb-1 lg:mb-2">
                      Нет запланированных приёмов
                    </div>
                    <div className="text-white/60 text-xs lg:text-sm mb-3 lg:mb-4">
                      Запишитесь на консультацию к врачу
                    </div>
                    <Link
                      href="/demo/medicine/user/modules/appointment"
                      className="inline-flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-2xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200 text-blue-400 text-xs lg:text-sm font-medium"
                    >
                      <span>📅</span>
                      <span>Записаться к врачу</span>
                    </Link>
                  </InteractiveCard>
                </motion.div>
              )}
            </motion.section>

            {/* Health Metrics & Prescriptions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Health Metrics */}
              <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h2 className="text-lg lg:text-2xl font-bold text-white">Показатели здоровья</h2>
                  <Link 
                    href="/demo/medicine/user/modules/history"
                    className="text-xs lg:text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 group"
                  >
                    Подробнее <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                  {healthMetrics.map((metric, index) => (
                    <motion.div key={metric.id} variants={itemVariants} custom={index}>
                      <HealthMetric {...metric} compact />
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Active Prescriptions */}
              <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h3 className="text-base lg:text-xl font-bold text-white">Активные назначения</h3>
                  <span className="text-xs lg:text-sm text-white/60 bg-white/5 px-2 py-1 rounded-full">
                    {activePrescriptions.length} препарата
                  </span>
                </div>
                
                <div className="space-y-2 lg:space-y-3">
                  <AnimatePresence>
                    {activePrescriptions.slice(0, 3).map((prescription, index) => (
                      <motion.div 
                        key={prescription.id} 
                        variants={itemVariants} 
                        custom={index}
                        layout
                      >
                        <Link href={`/demo/medicine/user/modules/history?prescription=${prescription.id}`}>
                          <PrescriptionCard prescription={prescription} compact />
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {activePrescriptions.length > 3 && (
                    <motion.div variants={itemVariants}>
                      <Link
                        href="/demo/medicine/user/modules/history"
                        className="block text-center p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 text-white/60 hover:text-white text-xs lg:text-sm"
                      >
                        Показать все {activePrescriptions.length} назначений
                      </Link>
                    </motion.div>
                  )}
                </div>
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
              <h2 className="text-lg lg:text-2xl font-bold text-white mb-4 lg:mb-6">Быстрая помощь</h2>
              
              <div className="space-y-3 lg:space-y-4">
                {/* Emergency Card */}
                <motion.div whileHover={{ y: -2 }}>
                  <InteractiveCard className="p-3 lg:p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20 hover:border-red-500/30 transition-all duration-300">
                    <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-base lg:text-lg">
                        🚑
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm lg:text-base">Экстренная помощь</div>
                        <div className="text-white/60 text-xs lg:text-sm">Круглосуточно</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <motion.button 
                        className="w-full flex items-center justify-between p-2 lg:p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsEmergencyModalOpen(true)}
                      >
                        <span className="text-red-400 font-medium text-sm lg:text-base">Вызов скорой</span>
                        <span className="text-base lg:text-lg">📞</span>
                      </motion.button>
                      <div className="flex justify-center gap-3 text-white/60 text-xs lg:text-sm">
                        <button 
                          onClick={() => handleEmergencyCall('112')}
                          className="hover:text-white transition-colors"
                        >
                          112
                        </button>
                        <span>•</span>
                        <button 
                          onClick={() => handleEmergencyCall('103')}
                          className="hover:text-white transition-colors"
                        >
                          103
                        </button>
                      </div>
                    </div>
                  </InteractiveCard>
                </motion.div>

                {/* Health Tips Carousel */}
                <motion.div whileHover={{ y: -1 }}>
                  <InteractiveCard className="p-3 lg:p-4 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
                    <div className="flex items-start gap-2 lg:gap-3">
                      <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-xl bg-green-500/20 flex items-center justify-center text-xs lg:text-sm flex-shrink-0 mt-0.5">
                        💡
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-sm lg:text-base mb-1 lg:mb-2">Совет дня</div>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentTipIndex}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3 }}
                            className="text-white/60 text-xs lg:text-sm leading-relaxed"
                          >
                            {healthTips[currentTipIndex]}
                          </motion.div>
                        </AnimatePresence>
                        <div className="flex gap-1 mt-2 lg:mt-3">
                          {healthTips.map((_, index) => (
                            <button
                              key={index}
                              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                                index === currentTipIndex ? 'bg-green-400 w-2 lg:w-3' : 'bg-white/30'
                              }`}
                              onClick={() => setCurrentTipIndex(index)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </InteractiveCard>
                </motion.div>

                {/* Quick Contacts */}
                <motion.div variants={itemVariants}>
                  <InteractiveCard className="p-3 lg:p-4">
                    <div className="font-semibold text-white text-sm lg:text-base mb-3 lg:mb-4">Контакты клиники</div>
                    <div className="space-y-2">
                      {clinicContacts.map((contact, index) => (
                        <motion.button
                          key={index}
                          className="w-full flex items-center justify-between p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                          whileHover={{ x: 3 }}
                          onClick={() => contact.phone && handleEmergencyCall(contact.phone.replace(/\D/g, ''))}
                        >
                          <div className="text-left flex-1 min-w-0">
                            <div className="text-white text-xs lg:text-sm truncate">{contact.name}</div>
                            <div className="text-white/60 text-xs truncate">{contact.phone}</div>
                          </div>
                          <span className="text-base lg:text-lg opacity-60 group-hover:opacity-100 transition-opacity">
                            {contact.icon}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </InteractiveCard>
                </motion.div>
              </div>
            </motion.section>

            {/* Recent Documents */}
            <motion.section
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-lg lg:text-2xl font-bold text-white">Последние документы</h2>
                <Link 
                  href="/demo/medicine/user/modules/history"
                  className="text-xs lg:text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 group"
                >
                  Все <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
              
              <InteractiveCard className="p-3 lg:p-4">
                <div className="space-y-2 lg:space-y-3">
                  <AnimatePresence>
                    {filteredDocuments.slice(0, 3).map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 group cursor-pointer border border-transparent hover:border-white/5"
                        whileHover={{ x: 3 }}
                        variants={itemVariants}
                        layout
                      >
                        <div className={`w-7 h-7 lg:w-9 lg:h-9 rounded-xl ${
                          doc.type === 'analysis' ? 'bg-blue-500/20' :
                          doc.type === 'diagnosis' ? 'bg-green-500/20' :
                          'bg-purple-500/20'
                        } flex items-center justify-center text-xs lg:text-sm flex-shrink-0`}>
                          {doc.type === 'analysis' ? '🔬' : doc.type === 'diagnosis' ? '📋' : '💊'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white text-xs lg:text-sm mb-0.5 truncate">
                            {doc.title}
                          </div>
                          <div className="text-white/60 text-xs truncate">
                            {doc.doctor} • {doc.date}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 lg:gap-2">
                          <button 
                            className="p-1 lg:p-1.5 rounded-lg hover:bg-white/10 transition-colors opacity-60 hover:opacity-100"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Download logic here
                            }}
                          >
                            <span className="text-xs lg:text-sm">📥</span>
                          </button>
                          <motion.span
                            className="opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity text-base lg:text-lg"
                            whileHover={{ x: 1 }}
                          >
                            →
                          </motion.span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {filteredDocuments.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-4 lg:py-6"
                    >
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-base lg:text-lg mb-2 lg:mb-3 mx-auto">
                        📄
                      </div>
                      <div className="font-semibold text-white text-xs lg:text-sm mb-1 lg:mb-2">
                        {searchQuery ? 'Документы не найдены' : 'Документы отсутствуют'}
                      </div>
                      <div className="text-white/60 text-xs">
                        {searchQuery ? 'Попробуйте изменить запрос' : 'Здесь появятся ваши медицинские документы'}
                      </div>
                    </motion.div>
                  )}
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
      />
    </div>
  );
}