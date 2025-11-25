'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
  teal: '20, 184, 166',
  amber: '245, 158, 11',
  violet: '139, 92, 246',
  fuchsia: '217, 70, 239',
  sky: '14, 165, 233',
  lime: '132, 204, 22',
  pink: '236, 72, 153',
  yellow: '234, 179, 8'
} as const;

// Типы данных для заявок
interface Application {
  id: string;
  service: string;
  category: 'autoservice' | 'delivery' | 'medical' | 'client' | 'social' | 'transport';
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  scheduledDate?: string;
  client: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  provider: {
    name: string;
    rating: number;
    contacts: string;
    image?: string;
    reviewsCount: number;
  };
  description: string;
  price?: string;
  estimatedDuration?: string;
  address?: string;
  notes?: string;
  attachments?: string[];
  rating?: number;
  review?: string;
  progress?: number;
  steps?: { name: string; completed: boolean; date?: string }[];
  managerNotes?: string;
  assignedManager?: string;
  source?: 'website' | 'mobile_app' | 'phone' | 'referral';
  clientType?: 'new' | 'returning' | 'vip';
}

// Данные новых заявок (только pending)
const newApplications: Application[] = [
  {
    id: 'APP-2024-015',
    service: 'Консультация терапевта',
    category: 'medical',
    status: 'pending',
    priority: 'high',
    createdAt: '18 дек 2024, 14:20',
    updatedAt: '18 дек 2024, 14:20',
    scheduledDate: '19 дек 2024, 16:00',
    client: {
      name: 'Смирнова Ольга',
      phone: '+7 (999) 333-44-55',
      email: 'olga@mail.ru'
    },
    provider: {
      name: 'Клиника "Здоровье"',
      rating: 4.8,
      contacts: '+7 (495) 123-45-67',
      reviewsCount: 234,
      image: '🏥'
    },
    description: 'Плановый осмотр и консультация по результатам анализов. Клиент жалуется на головные боли.',
    price: '2 500 ₽',
    estimatedDuration: '45 минут',
    address: 'пр. Мира, 89, клиника "Здоровье", каб. 205',
    managerNotes: 'Требуется срочно назначить менеджера. Клиент волнуется о результатах анализов.',
    source: 'website',
    clientType: 'new'
  },
  {
    id: 'APP-2024-016',
    service: 'Курсы английского языка',
    category: 'client',
    status: 'pending',
    priority: 'medium',
    createdAt: '18 дек 2024, 09:00',
    updatedAt: '18 дек 2024, 09:00',
    client: {
      name: 'Козлов Дмитрий',
      phone: '+7 (999) 444-55-66',
      email: 'dmitry@mail.ru'
    },
    provider: {
      name: 'Языковой центр "Лингва"',
      rating: 4.9,
      contacts: '+7 (495) 444-55-66',
      reviewsCount: 189,
      image: '📚'
    },
    description: 'Индивидуальные занятия английским языком для начинающих. Цель - подготовка к командировке.',
    price: '1 200 ₽/час',
    estimatedDuration: '8 занятий',
    managerNotes: 'Клиент интересуется бизнес-английским. Возможна продажа пакета из 16 занятий.',
    source: 'mobile_app',
    clientType: 'new'
  },
  {
    id: 'APP-2024-017',
    service: 'Ремонт холодильника',
    category: 'client',
    status: 'pending',
    priority: 'urgent',
    createdAt: '18 дек 2024, 16:45',
    updatedAt: '18 дек 2024, 16:45',
    scheduledDate: '19 дек 2024, 10:00',
    client: {
      name: 'Петров Иван',
      phone: '+7 (999) 777-88-99',
      email: 'ivan@mail.ru',
      address: 'ул. Зеленая, 15, кв. 24'
    },
    provider: {
      name: 'РемонтБытТехники',
      rating: 4.5,
      contacts: '+7 (999) 222-33-44',
      reviewsCount: 78,
      image: '🔧'
    },
    description: 'Холодильник Samsung не морозит. Требуется диагностика и ремонт. Срочно!',
    price: '3 500 ₽',
    estimatedDuration: '2 часа',
    address: 'ул. Зеленая, 15, кв. 24',
    managerNotes: 'КЛИЕНТ В ПАНИКЕ! Холодильник полон продуктов. Требуется срочный выезд.',
    source: 'phone',
    clientType: 'returning'
  },
  {
    id: 'APP-2024-018',
    service: 'Уборка офиса',
    category: 'client',
    status: 'pending',
    priority: 'medium',
    createdAt: '18 дек 2024, 11:30',
    updatedAt: '18 дек 2024, 11:30',
    scheduledDate: '20 дек 2024, 18:00',
    client: {
      name: 'ООО "ТехноПрофи"',
      phone: '+7 (495) 666-77-88',
      email: 'office@technoprofi.ru'
    },
    provider: {
      name: 'Клининговая служба "Чистота"',
      rating: 4.7,
      contacts: '+7 (999) 777-66-55',
      reviewsCount: 203,
      image: '🧹'
    },
    description: 'Ежедневная уборка офиса площадью 150 м². 5 рабочих дней в неделю.',
    price: '15 000 ₽/мес',
    estimatedDuration: 'Постоянное обслуживание',
    address: 'б-р Космонавтов, 45, офис 305',
    managerNotes: 'Корпоративный клиент. Возможен долгосрочный контракт. VIP-обслуживание.',
    source: 'website',
    clientType: 'vip'
  },
  {
    id: 'APP-2024-019',
    service: 'Доставка цветов',
    category: 'delivery',
    status: 'pending',
    priority: 'high',
    createdAt: '18 дек 2024, 13:15',
    updatedAt: '18 дек 2024, 13:15',
    scheduledDate: '19 дек 2024, 09:00',
    client: {
      name: 'Соколова Анна',
      phone: '+7 (999) 888-99-00',
      email: 'anna@mail.ru'
    },
    provider: {
      name: 'Цветочный салон "Роза"',
      rating: 4.9,
      contacts: '+7 (495) 555-44-33',
      reviewsCount: 156,
      image: '💐'
    },
    description: 'Букет из 51 розы с доставкой к 10:00. Поздравительная открытка: "С днем рождения, любимая!"',
    price: '5 100 ₽',
    estimatedDuration: '1 час',
    address: 'ул. Романтиков, 8, кв. 12',
    managerNotes: 'Срочный заказ на завтра утро. Клиентка просит обязательно успеть к 10:00.',
    source: 'mobile_app',
    clientType: 'new'
  },
  {
    id: 'APP-2024-020',
    service: 'Заправка картриджей',
    category: 'client',
    status: 'pending',
    priority: 'low',
    createdAt: '18 дек 2024, 15:40',
    updatedAt: '18 дек 2024, 15:40',
    client: {
      name: 'Лисицин Алексей',
      phone: '+7 (999) 111-22-33',
      email: 'alexey@mail.ru'
    },
    provider: {
      name: 'Сервисный центр "ОфисТех"',
      rating: 4.6,
      contacts: '+7 (495) 777-88-99',
      reviewsCount: 89,
      image: '🖨️'
    },
    description: 'Заправка 3 картриджей HP 85A. Срочно не требуется.',
    price: '1 800 ₽',
    estimatedDuration: '1 день',
    address: 'ул. Офисная, 33, офис 105',
    managerNotes: 'Стандартная услуга. Клиент не торопится.',
    source: 'website',
    clientType: 'returning'
  },
  {
    id: 'APP-2024-021',
    service: 'Такси в аэропорт',
    category: 'transport',
    status: 'pending',
    priority: 'urgent',
    createdAt: '18 дек 2024, 17:20',
    updatedAt: '18 дек 2024, 17:20',
    scheduledDate: '19 дек 2024, 04:30',
    client: {
      name: 'Громов Павел',
      phone: '+7 (999) 222-33-44',
      email: 'pavel@mail.ru'
    },
    provider: {
      name: 'Такси "Комфорт"',
      rating: 4.6,
      contacts: '+7 (999) 555-44-33',
      reviewsCount: 567,
      image: '🚖'
    },
    description: 'Поездка из центра города в аэропорт Домодедово. Вылет в 07:00, нужен запас времени.',
    price: '1 500 ₽',
    estimatedDuration: '1 час',
    address: 'ул. Тверская, 25 → Аэропорт Домодедово',
    managerNotes: 'ОЧЕНЬ СРОЧНО! Клиент улетает завтра рано утром. Требуется подтверждение в течение часа.',
    source: 'phone',
    clientType: 'vip'
  },
  {
    id: 'APP-2024-022',
    service: 'Установка кондиционера',
    category: 'client',
    status: 'pending',
    priority: 'medium',
    createdAt: '18 дек 2024, 10:10',
    updatedAt: '18 дек 2024, 10:10',
    scheduledDate: '21 дек 2024, 11:00',
    client: {
      name: 'Кузнецов Сергей',
      phone: '+7 (999) 333-44-55',
      email: 'sergey@mail.ru'
    },
    provider: {
      name: 'КлиматПрофи',
      rating: 4.8,
      contacts: '+7 (495) 888-99-00',
      reviewsCount: 234,
      image: '❄️'
    },
    description: 'Установка сплит-системы Mitsubishi в гостиную. Нужен выезд для замера.',
    price: '8 000 ₽',
    estimatedDuration: '3 часа',
    address: 'пр. Строителей, 67, кв. 89',
    managerNotes: 'Клиент готов купить кондиционер через нас. Дополнительная прибыль.',
    source: 'referral',
    clientType: 'new'
  }
];

// Утилиты
const getCategoryColor = (category: Application['category']) => {
  return {
    autoservice: COLORS.blue,
    delivery: COLORS.orange,
    medical: COLORS.emerald,
    client: COLORS.purple,
    social: COLORS.indigo,
    transport: COLORS.cyan
  }[category];
};

const getCategoryText = (category: Application['category']) => {
  return {
    autoservice: '🚗 Автосервис',
    delivery: '📦 Доставка',
    medical: '🏥 Медицина',
    client: '🛍️ Клиентские услуги',
    social: '👥 Социальные услуги',
    transport: '🚌 Транспорт'
  }[category];
};

const getStatusColor = (status: Application['status']) => {
  return {
    pending: COLORS.amber,
    confirmed: COLORS.blue,
    in_progress: COLORS.indigo,
    completed: COLORS.emerald,
    cancelled: COLORS.gray,
    rejected: COLORS.rose
  }[status];
};

const getStatusText = (status: Application['status']) => {
  return {
    pending: 'Ожидание',
    confirmed: 'Подтверждена',
    in_progress: 'В работе',
    completed: 'Завершена',
    cancelled: 'Отменена',
    rejected: 'Отклонена'
  }[status];
};

const getPriorityColor = (priority: Application['priority']) => {
  return {
    low: COLORS.gray,
    medium: COLORS.blue,
    high: COLORS.orange,
    urgent: COLORS.rose
  }[priority];
};

const getPriorityText = (priority: Application['priority']) => {
  return {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    urgent: 'Срочный'
  }[priority];
};

const getSourceText = (source: Application['source']) => {
  return {
    website: '🌐 Сайт',
    mobile_app: '📱 Приложение',
    phone: '📞 Телефон',
    referral: '👥 Рекомендация'
  }[source];
};

const getClientTypeColor = (type: Application['clientType']) => {
  return {
    new: COLORS.blue,
    returning: COLORS.emerald,
    vip: COLORS.purple
  }[type];
};

const getClientTypeText = (type: Application['clientType']) => {
  return {
    new: '🆕 Новый',
    returning: '🔁 Постоянный',
    vip: '⭐ VIP'
  }[type];
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Bento Card компонент
const BentoCard = ({ 
  children, 
  className = '', 
  glowColor = COLORS.blue,
  onClick,
  gradient = false,
  hoverable = true
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  gradient?: boolean;
  hoverable?: boolean;
}) => {
  const gradientClass = gradient ? 'bg-gradient-to-br from-white/10 to-white/5' : 'bg-white/5';

  return (
    <motion.div
      className={`
        relative overflow-hidden 
        rounded-2xl border border-white/10 
        ${gradientClass} backdrop-blur-lg 
        transition-all duration-300 
        ${hoverable ? 'hover:border-white/20 hover:bg-white/10' : ''}
        w-full max-w-full
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        '--glow-color': glowColor,
      } as React.CSSProperties}
      onClick={onClick}
      whileHover={hoverable ? { scale: 1.02, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};

// Modal Component
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md'
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 w-full ${sizeClasses[size]} border border-white/10 max-h-[90vh] overflow-y-auto shadow-2xl`}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            {title && <h3 className="text-white font-bold text-xl">{title}</h3>}
            <button
              className="text-white/60 hover:text-white transition-colors text-2xl p-1 rounded-full hover:bg-white/10 w-8 h-8 flex items-center justify-center"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Компонент Progress Bar
const ProgressBar = ({ progress, color = COLORS.blue }: { progress: number; color?: string }) => (
  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
    <motion.div 
      className="h-full rounded-full"
      style={{ 
        backgroundColor: `rgb(${color})`,
        width: `${progress}%`
      }}
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
  </div>
);

// Компонент карточки новой заявки
const NewApplicationCard = ({ application, onClick }: { application: Application; onClick?: () => void }) => {
  const categoryColor = getCategoryColor(application.category);
  const priorityColor = getPriorityColor(application.priority);
  const clientTypeColor = getClientTypeColor(application.clientType);

  // Время с момента создания (для срочности)
  const getTimeAgo = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt.replace('дек', 'dec'));
    const diffMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes} мин назад`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} ч назад`;
    return createdAt;
  };

  return (
    <BentoCard className="p-4 cursor-pointer h-full" glowColor={priorityColor} onClick={onClick} gradient>
      <div className="flex flex-col h-full">
        {/* Заголовок и приоритет */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span 
                className="px-2 py-1 rounded-full text-xs border font-medium whitespace-nowrap"
                style={{
                  backgroundColor: `rgba(${priorityColor}, 0.2)`,
                  color: `rgb(${priorityColor})`,
                  borderColor: `rgba(${priorityColor}, 0.3)`
                }}
              >
                {getPriorityText(application.priority)}
              </span>
              <span 
                className="px-2 py-1 rounded-full text-xs border font-medium whitespace-nowrap"
                style={{
                  backgroundColor: `rgba(${categoryColor}, 0.2)`,
                  color: `rgb(${categoryColor})`,
                  borderColor: `rgba(${categoryColor}, 0.3)`
                }}
              >
                {getCategoryText(application.category)}
              </span>
              {application.clientType && (
                <span 
                  className="px-2 py-1 rounded-full text-xs border font-medium whitespace-nowrap"
                  style={{
                    backgroundColor: `rgba(${clientTypeColor}, 0.2)`,
                    color: `rgb(${clientTypeColor})`,
                    borderColor: `rgba(${clientTypeColor}, 0.3)`
                  }}
                >
                  {getClientTypeText(application.clientType)}
                </span>
              )}
            </div>
            <h3 className="text-white font-semibold text-sm mb-1 truncate">{application.service}</h3>
            <div className="text-white/60 text-xs line-clamp-2 mb-2">{application.description}</div>
          </div>
        </div>

        {/* Клиент и источник */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="text-white/60">
            <div className="font-medium text-white">👤 {application.client.name}</div>
            <div>{application.client.phone}</div>
          </div>
          <div className="text-right text-white/60">
            <div>{application.source && getSourceText(application.source)}</div>
            <div className="text-amber-400">{getTimeAgo(application.createdAt)}</div>
          </div>
        </div>

        {/* Цена и исполнитель */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 text-sm">
            {application.price && (
              <div className="text-white font-bold">{application.price}</div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-amber-400">⭐ {application.provider.rating}</span>
            <span className="text-white/40">({application.provider.reviewsCount})</span>
          </div>
        </div>

        {/* Запланированная дата и действия */}
        <div className="flex items-center justify-between text-xs text-white/60 mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-lg">{application.provider.image}</span>
            <span className="truncate max-w-[120px]">{application.provider.name}</span>
          </div>
          {application.scheduledDate && (
            <div className="text-right flex-shrink-0">
              <div className="whitespace-nowrap">📅 {application.scheduledDate.split(',')[0]}</div>
            </div>
          )}
        </div>

        {/* Срочное уведомление */}
        {application.priority === 'urgent' && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-rose-500/20 text-xs text-rose-400">
            <span className="animate-pulse">🚨</span>
            <span>Требует немедленного внимания!</span>
          </div>
        )}
      </div>
    </BentoCard>
  );
};

// Компонент KPI для новых заявок
const NewRequestsKPI = ({ title, value, change, description, icon, color, trend, onClick }: {
  title: string;
  value: string;
  change?: string;
  description: string;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  onClick?: () => void;
}) => {
  const trendIcon = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
  const trendColor = trend === 'up' ? COLORS.emerald : trend === 'down' ? COLORS.rose : COLORS.gray;
  
  return (
    <BentoCard className="p-4 cursor-pointer" glowColor={color} onClick={onClick} gradient>
      <div className="flex items-start justify-between mb-3">
        <div className="text-xl font-bold text-white leading-tight">
          {value}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-lg">{icon}</div>
          {change && trend && (
            <div className="flex items-center gap-1 text-xs" style={{ color: `rgb(${trendColor})` }}>
              <span>{trendIcon}</span>
              <span>{change}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-sm font-medium">{title}</span>
        </div>
        
        <div className="text-white/60 text-sm">
          {description}
        </div>
      </div>
    </BentoCard>
  );
};

// Quick Actions для новых заявок
const NewRequestsQuickActions = ({ 
  onAssignAll, 
  onProcessUrgent,
  onSetTemplate 
}: { 
  onAssignAll: () => void; 
  onProcessUrgent: () => void;
  onSetTemplate: () => void;
}) => (
  <BentoCard className="p-4" glowColor={COLORS.purple} gradient>
    <h3 className="text-white font-semibold mb-3">Быстрые действия</h3>
    <div className="grid grid-cols-1 gap-2">
      <motion.button 
        className="p-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-sm transition-colors text-center flex items-center justify-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onProcessUrgent}
      >
        🚨 Обработать срочные
      </motion.button>
      <motion.button 
        className="p-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 text-sm transition-colors text-center flex items-center justify-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAssignAll}
      >
        👥 Назначить всех
      </motion.button>
      <motion.button 
        className="p-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-sm transition-colors text-center flex items-center justify-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSetTemplate}
      >
        📋 Шаблоны ответов
      </motion.button>
    </div>
  </BentoCard>
);

// Компонент фильтров для новых заявок
const NewRequestsFilters = ({ 
  activePriority, 
  setActivePriority, 
  searchQuery, 
  setSearchQuery,
  viewMode,
  setViewMode,
  priorityCounts 
}: {
  activePriority: string;
  setActivePriority: (priority: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  priorityCounts: any;
}) => (
  <div className="flex flex-col lg:flex-row gap-4 mb-4">
    {/* Фильтры по приоритету */}
    <div className="flex flex-wrap gap-2 flex-1">
      {[
        { id: 'all', name: 'Все', count: priorityCounts.all, color: 'gray' },
        { id: 'urgent', name: '🚨 Срочные', count: priorityCounts.urgent, color: 'rose' },
        { id: 'high', name: '🔴 Высокий', count: priorityCounts.high, color: 'orange' },
        { id: 'medium', name: '🟡 Средний', count: priorityCounts.medium, color: 'blue' },
        { id: 'low', name: '🟢 Низкий', count: priorityCounts.low, color: 'gray' }
      ].map((priority) => (
        <motion.button
          key={priority.id}
          onClick={() => setActivePriority(priority.id)}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            activePriority === priority.id 
              ? `bg-${priority.color}-500 text-white shadow-lg` 
              : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
          }`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{priority.name}</span>
          <span className={`px-1.5 py-0.5 rounded-full text-xs ${
            activePriority === priority.id ? 'bg-white/20' : 'bg-white/10'
          }`}>
            {priority.count}
          </span>
        </motion.button>
      ))}
    </div>
    
    {/* View Mode and Search */}
    <div className="flex gap-3">
      {/* View Mode Toggle */}
      <div className="flex bg-white/10 rounded-xl p-1">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
          }`}
        >
          ▦
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
          }`}
        >
          ☰
        </button>
      </div>
      
      {/* Поиск */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по новым заявкам..."
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 w-64"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
          >
            ×
          </button>
        )}
      </div>
    </div>
  </div>
);

// Основной компонент страницы новых заявок
export default function NewRequestsPage() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [activePriority, setActivePriority] = useState<'all' | Application['priority']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [managerNotes, setManagerNotes] = useState('');
  const [assignedManager, setAssignedManager] = useState('');

  // Статистика для новых заявок
  const totalNewApplications = newApplications.length;
  const urgentApplications = newApplications.filter(app => app.priority === 'urgent').length;
  const highPriorityApplications = newApplications.filter(app => app.priority === 'high').length;
  const newClients = newApplications.filter(app => app.clientType === 'new').length;
  const vipClients = newApplications.filter(app => app.clientType === 'vip').length;

  // KPI данные для новых заявок
  const newRequestsKPIs = [
    { 
      title: 'Новых заявок', 
      value: totalNewApplications.toString(), 
      change: '+5', 
      description: 'ожидают обработки', 
      icon: '🆕', 
      color: COLORS.amber,
      trend: 'up' as const
    },
    { 
      title: 'Срочные', 
      value: urgentApplications.toString(), 
      change: '+2', 
      description: 'требуют внимания', 
      icon: '🚨', 
      color: COLORS.rose,
      trend: 'up' as const
    },
    { 
      title: 'Новые клиенты', 
      value: newClients.toString(), 
      description: 'первый заказ', 
      icon: '👤', 
      color: COLORS.blue,
      trend: 'stable' as const
    },
    { 
      title: 'VIP клиенты', 
      value: vipClients.toString(), 
      description: 'особое внимание', 
      icon: '⭐', 
      color: COLORS.purple,
      trend: 'stable' as const
    }
  ];

  // Фильтрация заявок
  const filteredApplications = newApplications.filter(application =>
    (activePriority === 'all' || application.priority === activePriority) &&
    (application.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
     application.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
     application.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     application.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Группировка по приоритетам для фильтров
  const priorityCounts = {
    all: newApplications.length,
    urgent: newApplications.filter(app => app.priority === 'urgent').length,
    high: newApplications.filter(app => app.priority === 'high').length,
    medium: newApplications.filter(app => app.priority === 'medium').length,
    low: newApplications.filter(app => app.priority === 'low').length
  };

  useEffect(() => {
    setIsClient(true);
    
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(formatTime(now));
      setCurrentDate(formatDate(now));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
    setManagerNotes(application.managerNotes || '');
  };

  const handleAssignAll = () => {
    // Логика массового назначения
    alert('Массовое назначение менеджеров');
  };

  const handleProcessUrgent = () => {
    // Логика обработки срочных заявок
    alert('Обработка срочных заявок');
  };

  const handleSetTemplate = () => {
    // Логика установки шаблонов
    alert('Настройка шаблонов ответов');
  };

  const handleSaveManagerNotes = () => {
    if (selectedApplication) {
      // Логика сохранения заметок менеджера
      alert('Заметки менеджера сохранены');
    }
  };

  const handleAssignToMe = () => {
    if (selectedApplication) {
      setAssignedManager('Вы (Текущий менеджер)');
      alert('Заявка назначена на вас');
    }
  };

  const handleConfirmApplication = () => {
    if (selectedApplication) {
      alert('Заявка подтверждена и передана исполнителю');
      setIsModalOpen(false);
    }
  };

  const handleRejectApplication = () => {
    if (selectedApplication) {
      alert('Заявка отклонена');
      setIsModalOpen(false);
    }
  };

  // Если не на клиенте, не рендерим контент, зависящий от времени
  if (!isClient) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded-xl mb-6 w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-64 bg-white/5 rounded-2xl"></div>
              <div className="space-y-6">
                <div className="h-32 bg-white/5 rounded-2xl"></div>
                <div className="h-32 bg-white/5 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BentoCard className="p-6" glowColor={COLORS.amber} gradient>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">🆕 Новые заявки</h1>
                <p className="text-white/60 text-lg mb-4">
                  Заявки, ожидающие обработки. Быстро назначайте менеджеров и подтверждайте выполнение.
                </p>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-400" />
                    <span>{urgentApplications} срочных</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <span>{highPriorityApplications} высокий приоритет</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>{newClients} новых клиентов</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <motion.button
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🚀 Начать обработку
                </motion.button>
              </div>
            </div>
          </BentoCard>
        </motion.section>

        {/* KPI Section */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Статистика новых заявок</h2>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>Обновлено: {currentTime}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {newRequestsKPIs.map((kpi, index) => (
              <NewRequestsKPI key={index} {...kpi} />
            ))}
          </div>
        </motion.section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <NewRequestsQuickActions 
              onAssignAll={handleAssignAll}
              onProcessUrgent={handleProcessUrgent}
              onSetTemplate={handleSetTemplate}
            />
            
            {/* Category Filter */}
            <BentoCard className="p-4" glowColor={COLORS.indigo} gradient>
              <h3 className="text-white font-semibold mb-3">Категории</h3>
              <div className="space-y-2">
                {Object.entries({
                  autoservice: '🚗 Автосервис',
                  delivery: '📦 Доставка',
                  medical: '🏥 Медицина',
                  client: '🛍️ Клиентские',
                  social: '👥 Социальные',
                  transport: '🚌 Транспорт'
                }).map(([key, label]) => (
                  <button
                    key={key}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors text-sm flex items-center justify-between"
                  >
                    <span>{label}</span>
                    <span className="bg-white/10 px-1.5 py-0.5 rounded text-xs">
                      {newApplications.filter(app => app.category === key as any).length}
                    </span>
                  </button>
                ))}
              </div>
            </BentoCard>

            {/* Client Type Filter */}
            <BentoCard className="p-4" glowColor={COLORS.purple} gradient>
              <h3 className="text-white font-semibold mb-3">Тип клиента</h3>
              <div className="space-y-2">
                {[
                  { id: 'new', name: '🆕 Новые', count: newApplications.filter(app => app.clientType === 'new').length },
                  { id: 'returning', name: '🔁 Постоянные', count: newApplications.filter(app => app.clientType === 'returning').length },
                  { id: 'vip', name: '⭐ VIP', count: newApplications.filter(app => app.clientType === 'vip').length }
                ].map((type) => (
                  <button
                    key={type.id}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors text-sm flex items-center justify-between"
                  >
                    <span>{type.name}</span>
                    <span className="bg-white/10 px-1.5 py-0.5 rounded text-xs">
                      {type.count}
                    </span>
                  </button>
                ))}
              </div>
            </BentoCard>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters and Search */}
            <motion.section 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <NewRequestsFilters
                activePriority={activePriority}
                setActivePriority={setActivePriority}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                viewMode={viewMode}
                setViewMode={setViewMode}
                priorityCounts={priorityCounts}
              />
            </motion.section>

            {/* Applications Grid */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {activePriority === 'all' ? 'Все новые заявки' : `Приоритет: ${getPriorityText(activePriority)}`}
                  <span className="text-white/60 text-lg ml-2">({filteredApplications.length})</span>
                </h2>
                <div className="text-white/60 text-sm">
                  {filteredApplications.length} из {newApplications.length} заявок
                </div>
              </div>

              {filteredApplications.length > 0 ? (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-2' 
                    : 'grid-cols-1'
                }`}>
                  {filteredApplications.map((application, index) => (
                    <motion.div
                      key={application.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <NewApplicationCard 
                        application={application} 
                        onClick={() => handleViewApplication(application)}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <BentoCard className="p-12 text-center" glowColor={COLORS.gray}>
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-white font-semibold text-xl mb-2">Все заявки обработаны!</h3>
                  <p className="text-white/60 mb-4">
                    {searchQuery 
                      ? 'Попробуйте изменить поисковый запрос' 
                      : 'Новых заявок с выбранным приоритетом нет'
                    }
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setActivePriority('all');
                    }}
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors"
                  >
                    Сбросить фильтры
                  </button>
                </BentoCard>
              )}
            </motion.section>
          </div>
        </div>
      </main>

      {/* Модальное окно обработки новой заявки */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="🆕 Обработка новой заявки"
        size="lg"
      >
        {selectedApplication && (
          <div className="space-y-6">
            {/* Заголовок и срочность */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-bold text-2xl">{selectedApplication.service}</h3>
                <p className="text-white/60">{selectedApplication.description}</p>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-2xl">{selectedApplication.price}</div>
                <div 
                  className="px-3 py-1 rounded-full text-sm border font-medium mt-2"
                  style={{
                    backgroundColor: `rgba(${getPriorityColor(selectedApplication.priority)}, 0.2)`,
                    color: `rgb(${getPriorityColor(selectedApplication.priority)})`,
                    borderColor: `rgba(${getPriorityColor(selectedApplication.priority)}, 0.3)`
                  }}
                >
                  {getPriorityText(selectedApplication.priority)}
                </div>
              </div>
            </div>

            {/* Срочное уведомление */}
            {selectedApplication.priority === 'urgent' && (
              <div className="bg-rose-500/20 border border-rose-500/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl animate-pulse">🚨</span>
                  <div>
                    <div className="text-rose-300 font-semibold">СРОЧНАЯ ЗАЯВКА!</div>
                    <div className="text-rose-200 text-sm">Требуется немедленная обработка</div>
                  </div>
                </div>
              </div>
            )}

            {/* Информация о клиенте */}
            <div>
              <h4 className="text-white font-semibold mb-3">👤 Информация о клиенте</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">Имя клиента</div>
                  <div className="text-white font-semibold">{selectedApplication.client.name}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">Телефон</div>
                  <div className="text-white font-semibold">{selectedApplication.client.phone}</div>
                </div>
                {selectedApplication.client.email && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-white/60 text-sm mb-1">Email</div>
                    <div className="text-white font-semibold">{selectedApplication.client.email}</div>
                  </div>
                )}
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">Тип клиента</div>
                  <div className="text-white font-semibold">
                    {selectedApplication.clientType && getClientTypeText(selectedApplication.clientType)}
                  </div>
                </div>
              </div>
            </div>

            {/* Источник заявки */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm mb-1">Источник</div>
                <div className="text-white font-semibold">
                  {selectedApplication.source && getSourceText(selectedApplication.source)}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm mb-1">Время создания</div>
                <div className="text-white font-semibold">{selectedApplication.createdAt}</div>
              </div>
            </div>

            {/* Исполнитель */}
            <div>
              <h4 className="text-white font-semibold mb-3">🏢 Исполнитель</h4>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedApplication.provider.image}</span>
                    <div>
                      <div className="text-white font-semibold">{selectedApplication.provider.name}</div>
                      <div className="text-white/60 text-sm mt-1">
                        Контакты: {selectedApplication.provider.contacts}
                      </div>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="text-amber-400">⭐ {selectedApplication.provider.rating}</span>
                        <span className="text-white/40">({selectedApplication.provider.reviewsCount} отзывов)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Заметки менеджера */}
            <div>
              <h4 className="text-white font-semibold mb-3">📝 Заметки менеджера</h4>
              <textarea
                value={managerNotes}
                onChange={(e) => setManagerNotes(e.target.value)}
                placeholder="Добавьте заметки по заявке..."
                className="w-full h-24 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 resize-none"
              />
            </div>

            {/* Основные действия */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button 
                onClick={handleConfirmApplication}
                className="flex-1 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors font-semibold"
              >
                ✅ Подтвердить заявку
              </button>
              <button 
                onClick={handleAssignToMe}
                className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold"
              >
                👥 Назначить на себя
              </button>
              <button 
                onClick={handleRejectApplication}
                className="flex-1 py-3 rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition-colors font-semibold"
              >
                ❌ Отклонить
              </button>
            </div>

            {/* Быстрые действия */}
            <div className="grid grid-cols-2 gap-3">
              <button className="py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 transition-colors text-sm">
                📞 Позвонить клиенту
              </button>
              <button className="py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 transition-colors text-sm">
                ✉️ Отправить шаблон
              </button>
              <button className="py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 transition-colors text-sm">
                ⏰ Напомнить позже
              </button>
              <button className="py-2 rounded-lg bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 text-gray-300 transition-colors text-sm">
                📋 Создать шаблон
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}