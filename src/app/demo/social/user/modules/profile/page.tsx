'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import BentoCard from '../../components/BentoCard';

// Константы для цветов
const COLORS = {
  primary: 'from-gray-900 via-black to-gray-800',
  success: '34, 197, 94',
  warning: '234, 179, 8',
  error: '239, 68, 68',
  info: '59, 130, 246',
  purple: '147, 51, 234',
  orange: '249, 115, 22',
  blue: '59, 130, 246',
  cyan: '34, 211, 238',
  gray: '156, 163, 175',
  emerald: '16, 185, 129',
  rose: '244, 63, 94',
  indigo: '99, 102, 241',
  teal: '20, 184, 166'
} as const;

// Типы данных для пользователя
interface ProfileMetric {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  description: string;
  icon: string;
  color: string;
  progress?: number;
}

interface RecentActivity {
  id: string;
  type: 'request' | 'service' | 'payment' | 'notification';
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'in_progress' | 'cancelled';
  icon: string;
}

interface ServiceStatus {
  service: string;
  status: 'active' | 'pending' | 'completed' | 'rejected';
  lastUpdate: string;
  progress?: number;
  icon: string;
  color: string;
}

// Моки данных для пользователя
const profileData = {
  name: 'Иванова Мария Петровна',
  role: 'Пользователь социальных услуг',
  email: 'user@example.ru',
  phone: '+7 (912) 345-67-89',
  address: 'Москва, ул. Примерная, д. 123, кв. 45',
  avatar: '👩',
  joinDate: '15 января 2024',
  status: 'active',
  bio: 'Получаю социальные услуги по программе поддержки. Заинтересована в услугах доставки продуктов и медицинской помощи.',
  category: 'Пенсионер',
  benefits: ['Доставка продуктов', 'Медицинская помощь', 'Социальное сопровождение']
};

const profileMetrics: ProfileMetric[] = [
  { 
    label: "Активных заявок", 
    value: 3, 
    change: 1, 
    trend: 'up', 
    description: "На рассмотрении", 
    icon: "📥", 
    color: COLORS.blue
  },
  { 
    label: "Получено услуг", 
    value: 12, 
    change: 15, 
    trend: 'up', 
    description: "За последний месяц", 
    icon: "✅", 
    color: COLORS.success
  },
  { 
    label: "Обращений в поддержку", 
    value: 2, 
    change: -1, 
    trend: 'down', 
    description: "За все время", 
    icon: "💬", 
    color: COLORS.purple
  },
  { 
    label: "Удовлетворенность", 
    value: 4.7, 
    change: 2, 
    trend: 'up', 
    description: "Средняя оценка услуг", 
    icon: "⭐", 
    color: COLORS.orange
  },
  { 
    label: "Дней в системе", 
    value: 58, 
    change: 1, 
    trend: 'up', 
    description: "С момента регистрации", 
    icon: "📅", 
    color: COLORS.cyan
  },
  { 
    label: "Бонусных баллов", 
    value: 245, 
    change: 15, 
    trend: 'up', 
    description: "Накоплено за услуги", 
    icon: "🎁", 
    color: COLORS.emerald
  },
];

const recentActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'request',
    title: 'Заявка на доставку продуктов',
    description: 'Ожидает подтверждения куратора',
    date: 'Сегодня, 10:30',
    status: 'pending',
    icon: '🛒'
  },
  {
    id: '2',
    type: 'service',
    title: 'Медицинская консультация',
    description: 'Запись на 15 марта завершена',
    date: 'Вчера, 14:20',
    status: 'completed',
    icon: '🏥'
  },
  {
    id: '3',
    type: 'payment',
    title: 'Компенсация расходов',
    description: 'Оплата произведена успешно',
    date: '15.03.2024',
    status: 'completed',
    icon: '💰'
  },
  {
    id: '4',
    type: 'notification',
    title: 'Новое уведомление',
    description: 'Изменение в расписании услуг',
    date: '14.03.2024',
    status: 'in_progress',
    icon: '📢'
  }
];

const serviceStatuses: ServiceStatus[] = [
  {
    service: 'Доставка продуктов',
    status: 'active',
    lastUpdate: 'Обновлено сегодня',
    progress: 75,
    icon: '🛒',
    color: COLORS.success
  },
  {
    service: 'Медицинская помощь',
    status: 'pending',
    lastUpdate: 'Ожидает подтверждения',
    progress: 30,
    icon: '🏥',
    color: COLORS.warning
  },
  {
    service: 'Социальное сопровождение',
    status: 'completed',
    lastUpdate: 'Завершено 12.03.2024',
    icon: '👥',
    color: COLORS.info
  },
  {
    service: 'Юридическая консультация',
    status: 'active',
    lastUpdate: 'Активно до 20.03.2024',
    progress: 50,
    icon: '⚖️',
    color: COLORS.purple
  }
];

// Компоненты для страницы профиля пользователя
function ProfileHeader() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profileData);

  const handleSave = () => {
    setIsEditing(false);
    // Здесь будет логика сохранения
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-500' : 'bg-yellow-500';
  };

  return (
    <BentoCard className="p-4 sm:p-6 lg:p-8" glowColor={COLORS.indigo}>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Аватар и основная информация */}
        <div className="flex-shrink-0">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl sm:text-3xl lg:text-4xl shadow-2xl">
              {profileData.avatar}
            </div>
            <motion.div 
              className={`absolute -bottom-2 -right-2 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full ${getStatusColor(profileData.status)} border-4 border-black flex items-center justify-center`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 rounded-full bg-white" />
            </motion.div>
          </motion.div>
        </div>

        {/* Информация профиля */}
        <div className="flex-grow space-y-3 sm:space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                className="w-full text-xl sm:text-2xl lg:text-3xl font-bold text-white bg-white/10 border border-white/20 rounded-xl px-4 py-2 focus:outline-none focus:border-white/40"
              />
              <textarea
                value={editedProfile.bio}
                onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                className="w-full text-white/60 bg-white/10 border border-white/20 rounded-xl px-4 py-2 focus:outline-none focus:border-white/40 resize-none"
                rows={3}
              />
              <div className="flex gap-3">
                <motion.button
                  onClick={handleSave}
                  className="px-4 sm:px-6 py-2 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all duration-300 font-medium text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Сохранить
                </motion.button>
                <motion.button
                  onClick={() => setIsEditing(false)}
                  className="px-4 sm:px-6 py-2 rounded-xl bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 transition-all duration-300 font-medium text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Отмена
                </motion.button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">{profileData.name}</h1>
                <p className="text-white/60 text-base sm:text-lg">{profileData.role}</p>
              </div>
              
              <p className="text-white/60 text-sm sm:text-base leading-relaxed">{profileData.bio}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-3 text-white/80 text-sm sm:text-base">
                  <span className="text-lg">📧</span>
                  <span className="truncate">{profileData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-white/80 text-sm sm:text-base">
                  <span className="text-lg">📱</span>
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-white/80 text-sm sm:text-base">
                  <span className="text-lg">🏠</span>
                  <span className="truncate">{profileData.address}</span>
                </div>
                <div className="flex items-center gap-3 text-white/80 text-sm sm:text-base">
                  <span className="text-lg">🎯</span>
                  <span>{profileData.category}</span>
                </div>
              </div>

              {/* Список льгот */}
              <div className="flex flex-wrap gap-2">
                {profileData.benefits.map((benefit, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs border border-white/20"
                  >
                    {benefit}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <motion.button
                  onClick={() => setIsEditing(true)}
                  className="px-4 sm:px-6 py-2 rounded-xl bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 transition-all duration-300 font-medium text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Редактировать профиль
                </motion.button>
                  <motion.button 
                    className="px-4 sm:px-6 py-2 rounded-xl bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all duration-300 font-medium text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Личные данные
                  </motion.button>
                  <motion.button 
                    className="px-4 sm:px-6 py-2 rounded-xl bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all duration-300 font-medium text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Уведомления
                  </motion.button>
              </div>
            </>
          )}
        </div>
      </div>
    </BentoCard>
  );
}

function ProfileMetricCard({ metric }: { metric: ProfileMetric }) {
  const content = (
    <motion.div 
      className="h-full flex flex-col justify-between p-3 sm:p-4"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="text-xl sm:text-2xl font-bold text-white leading-tight">
          {metric.value}
          {metric.label.includes('Удовлетворенность') && '/5'}
          {metric.label.includes('Бонусных баллов') && ''}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-lg sm:text-xl">{metric.icon}</div>
          {metric.change && (
            <motion.div 
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border`}
              style={{ 
                backgroundColor: `rgba(${metric.color}, 0.2)`,
                color: `rgb(${metric.color})`,
                borderColor: `rgba(${metric.color}, 0.3)`
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
              {Math.abs(metric.change)}%
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="space-y-1 sm:space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-sm font-medium line-clamp-1">{metric.label}</span>
        </div>
        
        <div className="text-white/60 text-xs line-clamp-2">
          {metric.description}
        </div>

        {metric.progress && (
          <div className="pt-2">
            <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2">
              <div 
                className="h-1.5 sm:h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${metric.progress}%`,
                  backgroundColor: `rgb(${metric.color})`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <BentoCard 
      className="h-full min-h-[120px] sm:min-h-[140px]"
      enableEffects={true}
      glowColor={metric.color}
    >
      {content}
    </BentoCard>
  );
}

function RecentActivityWidget() {
  const getStatusColor = (status: RecentActivity['status']) => {
    return {
      completed: 'bg-green-500/20 text-green-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
      in_progress: 'bg-blue-500/20 text-blue-400',
      cancelled: 'bg-red-500/20 text-red-400'
    }[status];
  };

  const getStatusText = (status: RecentActivity['status']) => {
    return {
      completed: 'Завершено',
      pending: 'Ожидает',
      in_progress: 'В процессе',
      cancelled: 'Отменено'
    }[status];
  };

  return (
    <BentoCard className="p-4 sm:p-6 h-full" glowColor={COLORS.blue}>
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="font-semibold text-white text-base sm:text-lg">Последняя активность</h3>
            <motion.span 
              className="text-white/60 text-sm hover:text-white transition-colors cursor-pointer"
              whileHover={{ x: 2 }}
            >
              Вся активность →
            </motion.span>
        </div>
        
        <div className="space-y-3 flex-grow">
          {recentActivities.map((activity, index) => (
            <motion.div 
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4 }}
            >
              <div className="text-lg sm:text-xl mt-0.5 flex-shrink-0">{activity.icon}</div>
              
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-white font-medium text-sm line-clamp-1">{activity.title}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)} flex-shrink-0 ml-2`}>
                    {getStatusText(activity.status)}
                  </span>
                </div>
                
                <div className="text-white/60 text-xs mb-1 line-clamp-2">{activity.description}</div>
                <div className="text-white/40 text-xs">{activity.date}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
            <motion.button 
              className="w-full py-2 rounded-xl bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all duration-300 font-medium text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Создать новую заявку
            </motion.button>
        </div>
      </div>
    </BentoCard>
  );
}

function ServicesStatusWidget() {
  const getStatusColor = (status: ServiceStatus['status']) => {
    return {
      active: 'bg-green-500/20 text-green-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
      completed: 'bg-blue-500/20 text-blue-400',
      rejected: 'bg-red-500/20 text-red-400'
    }[status];
  };

  const getStatusText = (status: ServiceStatus['status']) => {
    return {
      active: 'Активно',
      pending: 'Ожидает',
      completed: 'Завершено',
      rejected: 'Отклонено'
    }[status];
  };

  return (
    <BentoCard className="p-4 sm:p-6 h-full" glowColor={COLORS.purple}>
      <div className="h-full flex flex-col">
        <h3 className="font-semibold text-white text-base sm:text-lg mb-4 sm:mb-6">Статус услуг</h3>
        
        <div className="space-y-4 flex-grow">
          {serviceStatuses.map((service, index) => (
            <motion.div 
              key={service.service}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 group"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="text-lg sm:text-xl">{service.icon}</div>
                <div className="flex-grow">
                  <div className="text-white font-medium text-sm">{service.service}</div>
                  <div className="text-white/60 text-xs">{service.lastUpdate}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                  {getStatusText(service.status)}
                </span>
              </div>
              
              {service.progress && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Прогресс</span>
                    <span>{service.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${service.progress}%`,
                        backgroundColor: `rgb(${service.color})`
                      }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-center text-white/60 text-xs sm:text-sm">
            Всего услуг: {serviceStatuses.length}
          </div>
        </div>
      </div>
    </BentoCard>
  );
}

function QuickActionsWidget() {
  const actions = [
    { 
      id: 'new-request',
      icon: '📝', 
      label: 'Новая заявка', 
      description: 'Подать заявку на услугу', 
      href: '/demo/social/user/requests/new' 
    },
    { 
      id: 'services',
      icon: '🏥', 
      label: 'Услуги', 
      description: 'Каталог услуг', 
      href: '/demo/social/user/services' 
    },
    { 
      id: 'support',
      icon: '💬', 
      label: 'Поддержка', 
      description: 'Помощь и консультации', 
      href: '/demo/social/user/support' 
    },
    { 
      id: 'documents',
      icon: '📄', 
      label: 'Документы', 
      description: 'Мои документы', 
      href: '/demo/social/user/documents' 
    },
    { 
      id: 'notifications',
      icon: '🔔', 
      label: 'Уведомления', 
      description: 'Настройки оповещений', 
      href: '/demo/social/user/modules/profile/notifications' 
    },
    { 
      id: 'security',
      icon: '🔒', 
      label: 'Безопасность', 
      description: 'Смена пароля', 
      href: '/demo/social/user/modules/profile/security' 
    },
  ];

  return (
    <BentoCard className="p-4 sm:p-6 h-full" glowColor={COLORS.gray}>
      <div className="h-full flex flex-col">
        <h3 className="font-semibold text-white text-base sm:text-lg mb-4">Быстрые действия</h3>
        
        <div className="flex-grow grid grid-cols-2 gap-2 sm:gap-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
                <motion.div 
                  className="p-2 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 text-center cursor-pointer group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-xl sm:text-2xl mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">{action.icon}</div>
                  <div className="text-white/80 text-xs sm:text-sm font-medium mb-1 line-clamp-1">{action.label}</div>
                  <div className="text-white/60 text-xs line-clamp-2">{action.description}</div>
                </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-center text-white/60 text-xs sm:text-sm">
            Пользователь социальных услуг
          </div>
        </div>
      </div>
    </BentoCard>
  );
}

function BenefitsInfoWidget() {
  const benefits = [
    { icon: '🛒', title: 'Доставка продуктов', description: '2 раза в неделю' },
    { icon: '🏥', title: 'Медицинская помощь', description: 'Бесплатные консультации' },
    { icon: '👥', title: 'Социальное сопровождение', description: 'Индивидуальный куратор' },
    { icon: '⚖️', title: 'Юридическая помощь', description: 'Консультации специалистов' },
  ];

  return (
    <BentoCard className="p-4 sm:p-6 h-full" glowColor={COLORS.teal}>
      <div className="h-full flex flex-col">
        <h3 className="font-semibold text-white text-base sm:text-lg mb-4">Мои льготы</h3>
        
        <div className="space-y-3 flex-grow">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={benefit.title}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 group"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-xl sm:text-2xl">{benefit.icon}</div>
              <div className="flex-grow">
                <div className="text-white font-medium text-sm">{benefit.title}</div>
                <div className="text-white/60 text-xs">{benefit.description}</div>
              </div>
              <motion.span
                className="opacity-0 group-hover:opacity-100 text-white/60 transition-opacity text-sm"
                whileHover={{ x: 2 }}
              >
                →
              </motion.span>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-center text-white/60 text-xs sm:text-sm">
            Действуют до: 31.12.2024
          </div>
        </div>
      </div>
    </BentoCard>
  );
}

export default function UserProfilePage() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <motion.section 
          className="mb-4 sm:mb-6 lg:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ProfileHeader />
        </motion.section>

        {/* Profile Metrics */}
        <motion.section 
          className="mb-4 sm:mb-6 lg:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-3 sm:mb-4 lg:mb-6">Моя статистика</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
            {profileMetrics.map((metric, index) => (
              <ProfileMetricCard key={metric.label} metric={metric} />
            ))}
          </div>
        </motion.section>

        {/* Main Profile Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {/* Recent Activity Widget */}
          <div className="xl:col-span-2">
            <RecentActivityWidget />
          </div>

          {/* Services Status Widget */}
          <div className="xl:col-span-2">
            <ServicesStatusWidget />
          </div>

          {/* Benefits Info Widget */}
          <div className="xl:col-span-2">
            <BenefitsInfoWidget />
          </div>

          {/* Quick Actions Widget */}
          <div className="xl:col-span-3">
            <QuickActionsWidget />
          </div>

          {/* Additional Info Widget */}
          <div className="xl:col-span-3">
            <BentoCard className="p-4 sm:p-6 h-full" glowColor={COLORS.orange}>
              <div className="h-full flex flex-col justify-center items-center text-center">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
                <h3 className="font-semibold text-white text-base sm:text-lg mb-2">Мои цели</h3>
                <p className="text-white/60 text-sm sm:text-base mb-4 sm:mb-6">
                  Получить все запланированные услуги в этом месяце
                </p>
                <div className="w-full bg-white/10 rounded-full h-2 sm:h-3 mb-4">
                  <div 
                    className="h-2 sm:h-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-1000"
                    style={{ width: '75%' }}
                  />
                </div>
                <div className="text-white/60 text-xs sm:text-sm">
                  Прогресс: 75% • Осталось 2 недели
                </div>
              </div>
            </BentoCard>
          </div>
        </div>
      </main>
    </div>
  );
}