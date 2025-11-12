// /src/app/demo/medicine/manager/today-stats/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Выносим TimeDisplay в отдельный компонент
const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ru-RU'));
      setCurrentDate(now.toLocaleDateString('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-3 lg:p-4">
      <div className="text-white/60 text-xs lg:text-sm">Текущее время</div>
      <div className="text-white font-mono text-base lg:text-lg">{currentTime}</div>
      <div className="text-white/40 text-xs lg:text-sm mt-1">{currentDate}</div>
    </div>
  );
};

// Mock данные для статистики
const getTodayStats = () => ({
  overview: {
    totalAppointments: 24,
    completed: 18,
    pending: 4,
    cancelled: 2,
    revenue: 85600,
    patientSatisfaction: 4.7
  },
  departments: [
    { name: 'Терапия', appointments: 8, revenue: 24000, trend: 'up', color: 'from-blue-500 to-cyan-500' },
    { name: 'Кардиология', appointments: 5, revenue: 35000, trend: 'up', color: 'from-red-500 to-pink-500' },
    { name: 'Неврология', appointments: 4, revenue: 18000, trend: 'stable', color: 'from-purple-500 to-indigo-500' },
    { name: 'Хирургия', appointments: 3, revenue: 5600, trend: 'down', color: 'from-green-500 to-emerald-500' },
    { name: 'Офтальмология', appointments: 2, revenue: 2200, trend: 'up', color: 'from-yellow-500 to-orange-500' },
    { name: 'Стоматология', appointments: 2, revenue: 800, trend: 'stable', color: 'from-gray-500 to-slate-500' }
  ],
  doctors: [
    { 
      name: 'Петров А.В.', 
      specialty: 'Терапевт', 
      appointments: 6, 
      rating: 4.8, 
      efficiency: 92, 
      avatar: '👨‍⚕️',
      todayRevenue: 18500,
      completed: 5,
      scheduled: 1
    },
    { 
      name: 'Сидорова М.И.', 
      specialty: 'Кардиолог', 
      appointments: 5, 
      rating: 4.9, 
      efficiency: 95, 
      avatar: '👩‍⚕️',
      todayRevenue: 32000,
      completed: 4,
      scheduled: 1
    },
    { 
      name: 'Иванова Е.С.', 
      specialty: 'Невролог', 
      appointments: 4, 
      rating: 4.7, 
      efficiency: 88, 
      avatar: '👩‍⚕️',
      todayRevenue: 15600,
      completed: 3,
      scheduled: 1
    },
    { 
      name: 'Козлов Д.Н.', 
      specialty: 'Хирург', 
      appointments: 3, 
      rating: 4.6, 
      efficiency: 85, 
      avatar: '👨‍⚕️',
      todayRevenue: 4800,
      completed: 2,
      scheduled: 1
    },
    { 
      name: 'Николаев С.П.', 
      specialty: 'Офтальмолог', 
      appointments: 2, 
      rating: 4.8, 
      efficiency: 90, 
      avatar: '👨‍⚕️',
      todayRevenue: 2000,
      completed: 2,
      scheduled: 0
    }
  ],
  timeSlots: [
    { time: '08:00-09:00', appointments: 2, occupancy: 40, revenue: 6800 },
    { time: '09:00-10:00', appointments: 4, occupancy: 80, revenue: 14200 },
    { time: '10:00-11:00', appointments: 5, occupancy: 100, revenue: 21500 },
    { time: '11:00-12:00', appointments: 4, occupancy: 80, revenue: 16800 },
    { time: '12:00-13:00', appointments: 3, occupancy: 60, revenue: 9800 },
    { time: '13:00-14:00', appointments: 2, occupancy: 40, revenue: 5200 },
    { time: '14:00-15:00', appointments: 3, occupancy: 60, revenue: 7500 },
    { time: '15:00-16:00', appointments: 1, occupancy: 20, revenue: 1800 }
  ],
  financial: {
    totalRevenue: 85600,
    cash: 25600,
    card: 45000,
    insurance: 15000,
    averageTicket: 3567,
    revenueByHour: [
      { hour: '08:00', revenue: 6800 },
      { hour: '09:00', revenue: 14200 },
      { hour: '10:00', revenue: 21500 },
      { hour: '11:00', revenue: 16800 },
      { hour: '12:00', revenue: 9800 },
      { hour: '13:00', revenue: 5200 },
      { hour: '14:00', revenue: 7500 },
      { hour: '15:00', revenue: 1800 }
    ],
    paymentMethods: [
      { method: 'Наличные', amount: 25600, percentage: 30 },
      { method: 'Карта', amount: 45000, percentage: 52 },
      { method: 'Страхование', amount: 15000, percentage: 18 }
    ]
  },
  schedule: {
    currentAppointments: [
      { time: '10:30', patient: 'Иванов П.С.', doctor: 'Петров А.В.', status: 'in-progress', type: 'consultation' },
      { time: '11:00', patient: 'Сидорова Е.К.', doctor: 'Сидорова М.И.', status: 'waiting', type: 'examination' },
      { time: '11:30', patient: 'Козлов Д.М.', doctor: 'Иванова Е.С.', status: 'scheduled', type: 'consultation' },
      { time: '12:00', patient: 'Николаева А.П.', doctor: 'Козлов Д.Н.', status: 'scheduled', type: 'procedure' }
    ],
    upcomingAppointments: [
      { time: '14:00', patient: 'Петров К.Д.', doctor: 'Петров А.В.', type: 'consultation' },
      { time: '14:30', patient: 'Смирнова О.Л.', doctor: 'Сидорова М.И.', type: 'examination' },
      { time: '15:00', patient: 'Васильев И.П.', doctor: 'Николаев С.П.', type: 'consultation' }
    ]
  }
});

const getAlerts = () => [
  { type: 'warning', message: 'Невролог опаздывает на 15 минут', time: '10 минут назад', icon: '⏰' },
  { type: 'info', message: '3 пациента ожидают подтверждения записи', time: '25 минут назад', icon: '📋' },
  { type: 'success', message: 'Загруженность отделений снизилась на 15%', time: '1 час назад', icon: '📊' }
];

// Компонент для ProgressBar
const ProgressBar = ({ value, max, color, showLabel = false, size = 'sm' }: any) => (
  <div className="w-full">
    {showLabel && (
      <div className="flex justify-between text-xs text-white/60 mb-1">
        <span>{value}%</span>
        <span>{max}%</span>
      </div>
    )}
    <div className={`w-full bg-white/10 rounded-full ${size === 'sm' ? 'h-2' : 'h-3'}`}>
      <div
        className={`${size === 'sm' ? 'h-2' : 'h-3'} rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  </div>
);

// Компонент для рейтинга звездами
const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-white/20'}`}
      >
        ★
      </span>
    ))}
    <span className="text-white/60 text-xs ml-1">{rating}</span>
  </div>
);

// Выносим StatsGrid в отдельный мемоизированный компонент
const StatsGrid = React.memo(({ todayStats }: { todayStats: any }) => {
  const StatCard = React.memo(({ title, value, change, icon, color, subtitle, onClick }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:bg-white/10 group ${
        onClick ? 'hover:border-white/20' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-white/60 text-xs lg:text-sm font-medium truncate">{title}</h3>
          <p className="text-xl lg:text-2xl font-bold text-white mt-1 truncate">{value}</p>
          {subtitle && <p className="text-white/40 text-xs lg:text-sm mt-1">{subtitle}</p>}
        </div>
        <div className={`text-2xl lg:text-3xl ml-3 group-hover:scale-110 transition-transform duration-200 ${color}`}>
          {icon}
        </div>
      </div>
      {change && (
        <div className={`text-xs lg:text-sm ${
          change.startsWith('+') ? 'text-green-400' : 'text-red-400'
        }`}>
          {change} с начала дня
        </div>
      )}
    </motion.div>
  ));

  StatCard.displayName = 'StatCard';

  return (
    <motion.div
      key="stats-grid"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8"
    >
      <StatCard
        title="Всего приемов"
        value={todayStats.overview.totalAppointments}
        change="+3"
        icon="📊"
        color="text-blue-400"
        subtitle="Запланировано"
      />
      <StatCard
        title="Завершено"
        value={todayStats.overview.completed}
        change="+2"
        icon="✅"
        color="text-green-400"
        subtitle={`${Math.round((todayStats.overview.completed / todayStats.overview.totalAppointments) * 100)}% выполнено`}
      />
      <StatCard
        title="Выручка"
        value={`${(todayStats.overview.revenue / 1000).toFixed(0)}к ₽`}
        change="+12.5%"
        icon="💰"
        color="text-purple-400"
        subtitle="За сегодня"
      />
      <StatCard
        title="Удовлетворенность"
        value={todayStats.overview.patientSatisfaction}
        change="+0.2"
        icon="⭐"
        color="text-yellow-400"
        subtitle="Средняя оценка"
      />
    </motion.div>
  );
});

StatsGrid.displayName = 'StatsGrid';

// Mobile Tabs Component
const MobileTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Обзор', icon: '📊' },
    { id: 'departments', label: 'Отделения', icon: '🏥' },
    { id: 'doctors', label: 'Врачи', icon: '👨‍⚕️' },
    { id: 'financial', label: 'Финансы', icon: '💰' },
    { id: 'schedule', label: 'Расписание', icon: '⏰' }
  ];

  return (
    <div className="lg:hidden mb-4">
      <div className="flex overflow-x-auto pb-2 space-x-1 scrollbar-hide">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileTap={{ scale: 0.95 }}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Desktop Tabs Component
const DesktopTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Обзор' },
    { id: 'departments', label: 'Отделения' },
    { id: 'doctors', label: 'Врачи' },
    { id: 'financial', label: 'Финансы' },
    { id: 'schedule', label: 'Расписание' }
  ];

  return (
    <div className="hidden lg:block mb-6">
      <div className="flex space-x-1 bg-white/5 rounded-2xl p-1 border border-white/10">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Компонент для вкладки Врачи
const DoctorsTab = ({ doctors }) => (
  <div className="space-y-4 lg:space-y-6">
    <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
      <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6 flex items-center gap-2">
        <span>👨‍⚕️</span>
        Эффективность врачей
      </h3>
      <div className="space-y-4">
        {doctors.map((doctor, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-200">
                {doctor.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium truncate">{doctor.name}</div>
                <div className="text-white/60 text-sm truncate">{doctor.specialty}</div>
                <div className="flex items-center gap-4 mt-2">
                  <RatingStars rating={doctor.rating} />
                  <span className="text-green-400 text-sm">{doctor.efficiency}% эфф.</span>
                </div>
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="text-white font-bold text-lg">{doctor.appointments}</div>
              <div className="text-white/60 text-sm">приемов</div>
              <div className="text-green-400 text-sm font-medium mt-1">
                {(doctor.todayRevenue / 1000).toFixed(0)}к ₽
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>📈</span>
          Топ по выручке
        </h4>
        <div className="space-y-3">
          {doctors
            .sort((a, b) => b.todayRevenue - a.todayRevenue)
            .slice(0, 3)
            .map((doctor, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{doctor.avatar}</span>
                  <div>
                    <div className="text-white text-sm font-medium">{doctor.name.split(' ')[0]}</div>
                    <div className="text-white/60 text-xs">{doctor.specialty}</div>
                  </div>
                </div>
                <div className="text-green-400 font-semibold">
                  {(doctor.todayRevenue / 1000).toFixed(0)}к ₽
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>⭐</span>
          Топ по рейтингу
        </h4>
        <div className="space-y-3">
          {doctors
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3)
            .map((doctor, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{doctor.avatar}</span>
                  <div>
                    <div className="text-white text-sm font-medium">{doctor.name.split(' ')[0]}</div>
                    <div className="text-white/60 text-xs">{doctor.specialty}</div>
                  </div>
                </div>
                <RatingStars rating={doctor.rating} />
              </div>
            ))}
        </div>
      </div>
    </div>
  </div>
);

// Компонент для вкладки Финансы
const FinancialTab = ({ financial }) => (
  <div className="space-y-4 lg:space-y-6">
    <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
      <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6 flex items-center gap-2">
        <span>💰</span>
        Финансовая статистика
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💵</span>
              <div>
                <div className="text-white/60 text-sm">Наличные</div>
                <div className="text-green-400 font-bold text-lg">{(financial.cash / 1000).toFixed(0)}к ₽</div>
              </div>
            </div>
            <div className="text-white/60 text-sm">{financial.paymentMethods[0].percentage}%</div>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💳</span>
              <div>
                <div className="text-white/60 text-sm">Безналичные</div>
                <div className="text-blue-400 font-bold text-lg">{(financial.card / 1000).toFixed(0)}к ₽</div>
              </div>
            </div>
            <div className="text-white/60 text-sm">{financial.paymentMethods[1].percentage}%</div>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏥</span>
              <div>
                <div className="text-white/60 text-sm">Страховые</div>
                <div className="text-purple-400 font-bold text-lg">{(financial.insurance / 1000).toFixed(0)}к ₽</div>
              </div>
            </div>
            <div className="text-white/60 text-sm">{financial.paymentMethods[2].percentage}%</div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <div className="text-white/60 text-sm mb-2">Общая выручка</div>
            <div className="text-3xl lg:text-4xl font-bold text-white">{(financial.totalRevenue / 1000).toFixed(0)}к ₽</div>
          </div>
          <div className="text-center">
            <div className="text-white/60 text-sm mb-2">Средний чек</div>
            <div className="text-2xl font-bold text-green-400">{financial.averageTicket.toLocaleString()} ₽</div>
            <div className="text-green-400 text-sm mt-2">+5.2% к вчерашнему дню</div>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>📊</span>
          Выручка по часам
        </h4>
        <div className="space-y-3">
          {financial.revenueByHour.map((hour, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-white/80 text-sm w-16">{hour.hour}</span>
              <div className="flex-1 mx-3">
                <ProgressBar
                  value={hour.revenue}
                  max={25000}
                  color="bg-purple-500"
                />
              </div>
              <span className="text-white/60 text-sm w-16 text-right">
                {(hour.revenue / 1000).toFixed(1)}к ₽
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>🥧</span>
          Методы оплаты
        </h4>
        <div className="space-y-4">
          {financial.paymentMethods.map((method, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">{method.method}</span>
                <span className="text-white">{(method.amount / 1000).toFixed(0)}к ₽ ({method.percentage}%)</span>
              </div>
              <ProgressBar
                value={method.percentage}
                max={100}
                color={
                  method.method === 'Наличные' ? 'bg-green-500' :
                  method.method === 'Карта' ? 'bg-blue-500' : 'bg-purple-500'
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Компонент для вкладки Расписание
const ScheduleTab = ({ schedule }) => (
  <div className="space-y-4 lg:space-y-6">
    <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
      <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6 flex items-center gap-2">
        <span>🔄</span>
        Текущие приемы
      </h3>
      <div className="space-y-3">
        {schedule.currentAppointments.map((appointment, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className={`w-3 h-3 rounded-full ${
                appointment.status === 'in-progress' ? 'bg-green-400 animate-pulse' :
                appointment.status === 'waiting' ? 'bg-yellow-400' : 'bg-blue-400'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium truncate">{appointment.patient}</div>
                <div className="text-white/60 text-sm truncate">{appointment.doctor}</div>
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="text-white font-bold text-lg">{appointment.time}</div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                appointment.status === 'in-progress' ? 'bg-green-500/20 text-green-400' :
                appointment.status === 'waiting' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {appointment.status === 'in-progress' ? 'В процессе' :
                 appointment.status === 'waiting' ? 'Ожидание' : 'Запланирован'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
      <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6 flex items-center gap-2">
        <span>⏭️</span>
        Ближайшие приемы
      </h3>
      <div className="space-y-3">
        {schedule.upcomingAppointments.map((appointment, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-lg">
                {appointment.type === 'consultation' ? '💬' :
                 appointment.type === 'examination' ? '🔍' : '💉'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium truncate">{appointment.patient}</div>
                <div className="text-white/60 text-sm truncate">{appointment.doctor}</div>
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="text-white font-bold text-lg">{appointment.time}</div>
              <div className="text-white/60 text-sm capitalize">
                {appointment.type === 'consultation' ? 'Консультация' :
                 appointment.type === 'examination' ? 'Обследование' : 'Процедура'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default function TodayStatsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  
  // Используем useMemo для статических данных
  const todayStats = useMemo(() => getTodayStats(), []);
  const alerts = useMemo(() => getAlerts(), []);

  useEffect(() => {
    // Имитация загрузки данных
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-4 lg:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="animate-pulse">
            <div className="h-6 lg:h-8 bg-white/10 rounded w-48 lg:w-64 mb-4"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 lg:h-32 bg-white/10 rounded-xl lg:rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-4 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <motion.div
          key="header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8 gap-4"
        >
          <div className="flex-1 min-w-0">
            <Link 
              href="/demo/medicine/manager"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-3 lg:mb-4 text-sm lg:text-base"
            >
              ← Назад к дашборду
            </Link>
            <h1 className="text-xl lg:text-3xl font-bold text-white mb-1 lg:mb-2 truncate">
              Статистика за сегодня
            </h1>
            <p className="text-white/60 text-xs lg:text-base truncate">
              Обзор деятельности медицинского центра
            </p>
          </div>
          <div className="flex-shrink-0">
            <TimeDisplay />
          </div>
        </motion.div>

        {/* Alert Notifications */}
        <motion.div
          key="alerts"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 lg:mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
            {alerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl border backdrop-blur-sm ${
                  alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                  alert.type === 'info' ? 'bg-blue-500/10 border-blue-500/30' :
                  'bg-green-500/10 border-green-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-lg lg:text-xl ${alert.type === 'warning' ? 'text-yellow-400' : alert.type === 'info' ? 'text-blue-400' : 'text-green-400'}`}>
                    {alert.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{alert.message}</div>
                    <div className="text-white/60 text-xs">{alert.time}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <StatsGrid todayStats={todayStats} />

        {/* Tabs Navigation */}
        <MobileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <DesktopTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <motion.div
          key={`tab-content-${activeTab}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4 lg:space-y-6"
                >
                  {/* Departments Performance */}
                  <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                    <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6 flex items-center gap-2">
                      <span>📈</span>
                      Эффективность отделений
                    </h3>
                    <div className="space-y-3 lg:space-y-4">
                      {todayStats.departments.map((dept, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 lg:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-medium text-sm lg:text-base truncate">
                                {dept.name}
                              </span>
                              <span className="text-white/60 text-xs lg:text-sm ml-2">
                                {dept.appointments} приемов
                              </span>
                            </div>
                            <ProgressBar
                              value={dept.appointments}
                              max={8}
                              color={
                                dept.trend === 'up' ? 'bg-green-500' :
                                dept.trend === 'down' ? 'bg-red-500' : 'bg-yellow-500'
                              }
                            />
                            <div className="flex justify-between text-xs text-white/60 mt-2">
                              <span>Выручка: {(dept.revenue / 1000).toFixed(0)}к ₽</span>
                              <span className={
                                dept.trend === 'up' ? 'text-green-400' :
                                dept.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
                              }>
                                {dept.trend === 'up' ? '↗ Рост' : dept.trend === 'down' ? '↘ Спад' : '→ Стабильно'}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots Distribution */}
                  <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                    <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6 flex items-center gap-2">
                      <span>⏰</span>
                      Загрузка по времени
                    </h3>
                    <div className="space-y-3">
                      {todayStats.timeSlots.map((slot, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
                        >
                          <span className="text-white/80 text-sm w-16 lg:w-20 flex-shrink-0">
                            {slot.time}
                          </span>
                          <div className="flex-1 mx-3 lg:mx-4">
                            <ProgressBar
                              value={slot.occupancy}
                              max={100}
                              color={
                                slot.occupancy >= 80 ? 'bg-red-500' :
                                slot.occupancy >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }
                            />
                          </div>
                          <span className="text-white/60 text-sm w-8 lg:w-12 text-right flex-shrink-0">
                            {slot.appointments}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'departments' && (
                <motion.div
                  key="departments"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6"
                >
                  <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6 flex items-center gap-2">
                    <span>🏥</span>
                    Статистика по отделениям
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {todayStats.departments.map((dept, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/5 rounded-xl lg:rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-medium text-sm lg:text-base">{dept.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            dept.trend === 'up' ? 'bg-green-500/20 text-green-400' :
                            dept.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {dept.trend === 'up' ? 'Рост' : dept.trend === 'down' ? 'Спад' : 'Стабильно'}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Приемы:</span>
                            <span className="text-white">{dept.appointments}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Выручка:</span>
                            <span className="text-green-400">{(dept.revenue / 1000).toFixed(0)}к ₽</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Средний чек:</span>
                            <span className="text-white">{Math.round(dept.revenue / dept.appointments).toLocaleString()}₽</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'doctors' && (
                <DoctorsTab doctors={todayStats.doctors} />
              )}

              {activeTab === 'financial' && (
                <FinancialTab financial={todayStats.financial} />
              )}

              {activeTab === 'schedule' && (
                <ScheduleTab schedule={todayStats.schedule} />
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span>⚡</span>
                Быстрые действия
              </h3>
              <div className="space-y-3">
                {[
                  { icon: '📝', label: 'Быстрая запись', color: 'blue', onClick: () => router.push('/demo/medicine/manager/quick-appointment') },
                  { icon: '📊', label: 'Создать отчет', color: 'green' },
                  { icon: '👥', label: 'Управление персоналом', color: 'purple' }
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={action.onClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
                      action.color === 'blue' ? 'bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30' :
                      action.color === 'green' ? 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30' :
                      'bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30'
                    }`}
                  >
                    <span className="text-lg">{action.icon}</span>
                    <span className="text-sm font-medium">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span>📈</span>
                Сводка эффективности
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Загрузка центра', value: '78%', color: 'text-green-400' },
                  { label: 'Среднее время приема', value: '28 мин', color: 'text-white' },
                  { label: 'Отмены', value: '8.3%', color: 'text-red-400' },
                  { label: 'Опоздания', value: '12%', color: 'text-yellow-400' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white/60 text-sm">{item.label}</span>
                    <span className={`font-medium text-sm ${item.color}`}>{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Today's Goals */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl lg:rounded-2xl p-4 lg:p-6">
              <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                <span>🎯</span>
                Цели на сегодня
              </h3>
              <p className="text-blue-300/80 text-sm mb-4">
                {todayStats.overview.completed >= 20 ? '🎉 Все цели выполнены!' : `Осталось ${20 - todayStats.overview.completed} приемов до цели`}
              </p>
              <ProgressBar
                value={todayStats.overview.completed}
                max={20}
                color="bg-blue-500"
                showLabel={true}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}