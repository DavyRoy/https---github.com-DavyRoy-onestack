'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

// Custom hook for client time with improved performance
const useClientTime = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
};

// Enhanced data types
interface ServiceClient {
  id: string;
  personalInfo: {
    fullName: string;
    birthDate: string;
    gender: 'male' | 'female';
    phone: string;
    email?: string;
    address: string;
    avatar?: string;
    preferences: {
      communication: 'phone' | 'email' | 'messenger' | 'in_person';
      timePreferences: string[];
      specialRequirements: string[];
      notifications: boolean;
      marketing: boolean;
    };
  };
  serviceHistory: {
    category: 'beauty' | 'health' | 'education' | 'entertainment' | 'household' | 'business' | 'other';
    services: Service[];
    totalSpent: number;
    loyaltyPoints: number;
    memberSince: string;
    favoriteServices: string[];
    averageRating: number;
  };
  currentBookings: Booking[];
  paymentInfo: {
    preferredMethod: 'card' | 'cash' | 'online' | 'subscription';
    savedCards?: SavedCard[];
    billingAddress?: string;
    autoPay: boolean;
  };
  loyalty: {
    level: 'bronze' | 'silver' | 'gold' | 'platinum';
    points: number;
    discount: number;
    nextLevelPoints: number;
    benefits: string[];
  };
  status: 'active' | 'inactive' | 'premium' | 'vip';
  lastActivity?: string;
  notes?: string;
  tags?: string[];
}

interface Service {
  id: string;
  name: string;
  category: string;
  provider: string;
  providerId: string;
  date: string;
  duration: number;
  cost: number;
  rating?: number;
  review?: string;
  status: 'completed' | 'cancelled' | 'no_show';
  images?: string[];
  description?: string;
}

interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  provider: string;
  providerId: string;
  date: string;
  time: string;
  duration: number;
  cost: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  specialRequests?: string;
  location?: string;
  assignedSpecialist?: string;
}

interface SavedCard {
  id: string;
  lastFour: string;
  type: 'visa' | 'mastercard' | 'mir' | 'amex';
  expiryDate: string;
  isDefault: boolean;
  cardName: string;
}

interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  specialization: string[];
  contact: {
    phone: string;
    email: string;
    address: string;
    website?: string;
  };
  availability: {
    days: string[];
    hours: string;
    timezone: string;
  };
  status: 'available' | 'busy' | 'offline';
  image?: string;
  description?: string;
  experience?: string;
  languages?: string[];
  pricing?: {
    min: number;
    max: number;
    currency: string;
  };
}

// Enhanced mock data with more variety
const serviceClients: ServiceClient[] = [
  {
    id: 'sc-001',
    personalInfo: {
      fullName: 'Иванова Мария Сергеевна',
      birthDate: '1990-05-15',
      gender: 'female',
      phone: '+7 (916) 123-45-67',
      email: 'm.ivanova@example.ru',
      address: 'г. Москва, ул. Ленина, д. 15, кв. 34',
      avatar: '👩',
      preferences: {
        communication: 'phone',
        timePreferences: ['10:00-13:00', '15:00-18:00'],
        specialRequirements: ['Кондиционер в помещении', 'Парковка', 'Wi-Fi'],
        notifications: true,
        marketing: false
      }
    },
    serviceHistory: {
      category: 'beauty',
      services: [
        {
          id: 'sv-001',
          name: 'Стрижка и укладка премиум',
          category: 'beauty',
          provider: 'Салон "Элегант"',
          providerId: 'sp-001',
          date: '2024-06-15',
          duration: 120,
          cost: 2500,
          rating: 5,
          review: 'Отличный сервис, мастер - профессионал! Очень внимательна к деталям.',
          status: 'completed',
          description: 'Стрижка горячими ножницами + укладка'
        },
        {
          id: 'sv-002',
          name: 'Комплексный маникюр с дизайном',
          category: 'beauty',
          provider: 'Салон "Элегант"',
          providerId: 'sp-001',
          date: '2024-06-10',
          duration: 90,
          cost: 1800,
          rating: 4,
          status: 'completed',
          description: 'Аппаратный маникюр + покрытие гель-лаком'
        },
        {
          id: 'sv-003',
          name: 'SPA-программа "Релакс"',
          category: 'beauty',
          provider: 'Салон "Элегант"',
          providerId: 'sp-001',
          date: '2024-05-28',
          duration: 180,
          cost: 4500,
          rating: 5,
          review: 'Невероятно расслабляющая процедура! Обязательно вернусь.',
          status: 'completed'
        }
      ],
      totalSpent: 15400,
      loyaltyPoints: 1540,
      memberSince: '2023-03-10',
      favoriteServices: ['Стрижка и укладка', 'SPA-процедуры'],
      averageRating: 4.7
    },
    currentBookings: [
      {
        id: 'bk-001',
        serviceId: 'sv-004',
        serviceName: 'Комплексные СПА-процедуры',
        provider: 'Салон "Элегант"',
        providerId: 'sp-001',
        date: '2024-06-25',
        time: '14:00',
        duration: 180,
        cost: 5000,
        status: 'confirmed',
        specialRequests: 'Аллергия на цитрусовые масла. Предпочтительно использование органической косметики.',
        location: 'Салон "Элегант", ул. Тверская, д. 15',
        assignedSpecialist: 'Елена Профессионалова'
      },
      {
        id: 'bk-002',
        serviceId: 'sv-005',
        serviceName: 'Экспресс-уход за лицом',
        provider: 'Салон "Элегант"',
        providerId: 'sp-001',
        date: '2024-07-02',
        time: '11:00',
        duration: 60,
        cost: 2200,
        status: 'pending',
        location: 'Салон "Элегант", ул. Тверская, д. 15'
      }
    ],
    paymentInfo: {
      preferredMethod: 'card',
      savedCards: [
        {
          id: 'card-001',
          lastFour: '1234',
          type: 'visa',
          expiryDate: '2025-12-01',
          isDefault: true,
          cardName: 'Основная карта'
        },
        {
          id: 'card-002',
          lastFour: '5678',
          type: 'mastercard',
          expiryDate: '2024-08-01',
          isDefault: false,
          cardName: 'Запасная карта'
        }
      ],
      billingAddress: 'г. Москва, ул. Ленина, д. 15, кв. 34',
      autoPay: true
    },
    loyalty: {
      level: 'gold',
      points: 1540,
      discount: 15,
      nextLevelPoints: 2000,
      benefits: ['Приоритетная запись', 'Персональный менеджер', 'Подарочные сертификаты']
    },
    status: 'active',
    lastActivity: '2024-06-19',
    notes: 'Постоянный клиент, предпочитает премиум услуги. Очень внимательна к качеству обслуживания.',
    tags: ['постоянный клиент', 'премиум', 'активный']
  },
  {
    id: 'sc-002',
    personalInfo: {
      fullName: 'Петров Иван Дмитриевич',
      birthDate: '1985-12-20',
      gender: 'male',
      phone: '+7 (925) 234-56-78',
      email: 'i.petrov@example.ru',
      address: 'г. Москва, пр. Мира, д. 125, кв. 89',
      avatar: '👨',
      preferences: {
        communication: 'email',
        timePreferences: ['19:00-22:00'],
        specialRequirements: ['Вечерние часы', 'Онлайн-консультация', 'Тренер с медицинским образованием'],
        notifications: true,
        marketing: true
      }
    },
    serviceHistory: {
      category: 'health',
      services: [
        {
          id: 'sv-006',
          name: 'Персональная тренировка премиум',
          category: 'health',
          provider: 'Фитнес-центр "Энергия"',
          providerId: 'sp-002',
          date: '2024-06-18',
          duration: 60,
          cost: 2000,
          rating: 5,
          review: 'Отличный тренер, индивидуальный подход. Заметил прогресс уже через месяц!',
          status: 'completed'
        },
        {
          id: 'sv-007',
          name: 'Спортивный массаж',
          category: 'health',
          provider: 'Фитнес-центр "Энергия"',
          providerId: 'sp-002',
          date: '2024-06-12',
          duration: 90,
          cost: 3000,
          rating: 4,
          status: 'completed',
          description: 'Глубокий тканевый массаж'
        },
        {
          id: 'sv-008',
          name: 'Функциональная диагностика',
          category: 'health',
          provider: 'Фитнес-центр "Энергия"',
          providerId: 'sp-002',
          date: '2024-05-20',
          duration: 120,
          cost: 3500,
          status: 'completed'
        }
      ],
      totalSpent: 8500,
      loyaltyPoints: 850,
      memberSince: '2024-01-15',
      favoriteServices: ['Персональные тренировки', 'Спортивный массаж'],
      averageRating: 4.5
    },
    currentBookings: [
      {
        id: 'bk-003',
        serviceId: 'sv-009',
        serviceName: 'Йога-терапия для спины',
        provider: 'Фитнес-центр "Энергия"',
        providerId: 'sp-002',
        date: '2024-06-22',
        time: '20:00',
        duration: 60,
        cost: 1500,
        status: 'pending',
        location: 'Фитнес-центр "Энергия", пр. Мира, д. 89',
        assignedSpecialist: 'Анна Йогова'
      }
    ],
    paymentInfo: {
      preferredMethod: 'online',
      billingAddress: 'г. Москва, пр. Мира, д. 125, кв. 89',
      autoPay: false
    },
    loyalty: {
      level: 'silver',
      points: 850,
      discount: 10,
      nextLevelPoints: 1000,
      benefits: ['Скидка 10%', 'Бесплатная бутылка воды']
    },
    status: 'active',
    lastActivity: '2024-06-18',
    notes: 'Активно занимается спортом. Целеустремленный, следит за прогрессом.',
    tags: ['спорт', 'регулярный', 'мотивированный']
  },
  // ... (other clients with similar enhancements)
];

const serviceProviders: ServiceProvider[] = [
  {
    id: 'sp-001',
    name: 'Салон "Элегант"',
    category: 'beauty',
    rating: 4.8,
    reviews: 247,
    specialization: ['Парикмахерские услуги', 'Ногтевой сервис', 'СПА-процедуры', 'Косметология', 'Макияж'],
    contact: {
      phone: '+7 (495) 123-45-67',
      email: 'elegant@example.ru',
      address: 'г. Москва, ул. Тверская, д. 15',
      website: 'www.elegant-salon.ru'
    },
    availability: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      hours: '09:00-21:00',
      timezone: 'Europe/Moscow'
    },
    status: 'available',
    image: '💇‍♀️',
    description: 'Премиальный салон красоты с 15-летним опытом. Используем только профессиональную косметику.',
    experience: '15 лет',
    languages: ['Русский', 'Английский'],
    pricing: {
      min: 1000,
      max: 15000,
      currency: 'RUB'
    }
  },
  {
    id: 'sp-002',
    name: 'Фитнес-центр "Энергия"',
    category: 'health',
    rating: 4.6,
    reviews: 189,
    specialization: ['Персональные тренировки', 'Групповые занятия', 'Массаж', 'Йога', 'Пилатес'],
    contact: {
      phone: '+7 (495) 234-56-78',
      email: 'energy@example.ru',
      address: 'г. Москва, пр. Мира, д. 89',
      website: 'www.energy-fitness.ru'
    },
    availability: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      hours: '06:00-23:00',
      timezone: 'Europe/Moscow'
    },
    status: 'busy',
    image: '💪',
    description: 'Современный фитнес-центр с новейшим оборудованием и профессиональными тренерами.',
    experience: '8 лет',
    languages: ['Русский', 'Английский', 'Немецкий'],
    pricing: {
      min: 500,
      max: 5000,
      currency: 'RUB'
    }
  },
  // ... (other providers with similar enhancements)
];

// Enhanced constants
const COLORS = {
  primary: 'from-slate-900 via-slate-950 to-slate-900',
  secondary: 'from-teal-900 via-slate-950 to-emerald-900',
  success: '34, 197, 94',
  warning: '234, 179, 8',
  error: '239, 68, 68',
  info: '59, 130, 246',
  purple: '147, 51, 234',
  blue: '59, 130, 246',
  emerald: '16, 185, 129',
  orange: '249, 115, 22',
  teal: '20, 184, 166',
  indigo: '99, 102, 241',
  rose: '244, 63, 94',
  cyan: '34, 211, 238',
  amber: '245, 158, 11',
  slate: '100, 116, 139'
} as const;

const CATEGORY_ICONS = {
  beauty: '💅',
  health: '💪',
  education: '📚',
  entertainment: '🎭',
  household: '🏠',
  business: '💼',
  other: '🎯'
} as const;

const CATEGORY_COLORS = {
  beauty: COLORS.purple,
  health: COLORS.emerald,
  education: COLORS.blue,
  entertainment: COLORS.orange,
  household: COLORS.cyan,
  business: COLORS.indigo,
  other: COLORS.slate
} as const;

// Utility functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatDateTime = (dateString: string, timeString: string) => {
  return new Date(`${dateString}T${timeString}`).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(amount);
};

const calculateAge = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

const getInitials = (fullName: string) => {
  return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
};

// Enhanced Modal Component with better scroll locking
const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'md',
  closeOnOverlayClick = true 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  closeOnOverlayClick?: boolean;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    fullscreen: 'max-w-full max-h-full m-4'
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeOnOverlayClick ? onClose : undefined}
      >
        <motion.div
          className={`bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50 rounded-3xl shadow-2xl w-full ${sizeClasses[size]} max-h-[95vh] overflow-hidden`}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="border-b border-slate-700/50 p-6 bg-slate-800/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200 text-slate-400 hover:text-white hover:scale-110 active:scale-95"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          <div className="p-6 overflow-y-auto max-h-[calc(95vh-80px)] custom-scrollbar">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Enhanced BentoCard with better animations
const BentoCard = ({ 
  children, 
  className = '', 
  glowColor = COLORS.teal, 
  onClick,
  hoverable = true,
  padding = 'p-6',
  delay = 0
}: { 
  children: React.ReactNode; 
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: string;
  delay?: number;
}) => (
  <motion.div
    className={`
      relative overflow-hidden 
      rounded-3xl border border-slate-700/50
      bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-xl
      transition-all duration-500
      w-full max-w-full
      group
      ${hoverable ? 'hover:border-slate-600/70 hover:shadow-2xl' : ''}
      ${onClick ? 'cursor-pointer' : ''}
      ${padding}
      ${className}
    `}
    style={{
      backgroundImage: `
        radial-gradient(280px circle at 50% 50%, rgba(${glowColor},0.15), transparent 60%),
        linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)
      `
    }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={hoverable ? { y: -4, scale: 1.02 } : {}}
    whileTap={onClick ? { scale: 0.98 } : {}}
    onClick={onClick}
  >
    {/* Enhanced glow effect */}
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
      style={{
        background: `radial-gradient(500px circle at 50% 50%, rgba(${glowColor},0.12), transparent 50%)`
      }}
    />
    
    <div className="relative z-10 h-full">
      {children}
    </div>

    {/* Improved shine effect */}
    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none overflow-hidden">
      <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:animate-shine" />
    </div>
  </motion.div>
);

// Enhanced StatusBadge with more variants
const StatusBadge = ({ 
  status, 
  type = 'default', 
  animated = false,
  size = 'md' 
}: { 
  status: string; 
  type?: 'default' | 'client' | 'service' | 'booking' | 'provider' | 'payment' | 'communication';
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm'
  };

  const getStatusConfig = () => {
    const baseConfig = {
      active: { color: COLORS.success, label: 'Активен' },
      inactive: { color: COLORS.slate, label: 'Неактивен' },
      premium: { color: COLORS.purple, label: 'Премиум' },
      vip: { color: COLORS.amber, label: 'VIP' },
      completed: { color: COLORS.success, label: 'Завершена' },
      cancelled: { color: COLORS.error, label: 'Отменена' },
      no_show: { color: COLORS.rose, label: 'Неявка' },
      confirmed: { color: COLORS.teal, label: 'Подтверждена' },
      pending: { color: COLORS.orange, label: 'Ожидание' },
      available: { color: COLORS.success, label: 'Доступен' },
      busy: { color: COLORS.orange, label: 'Занят' },
      offline: { color: COLORS.slate, label: 'Оффлайн' },
      // ... (other status mappings)
    };

    const config = baseConfig[status as keyof typeof baseConfig] || { 
      color: COLORS.slate, 
      label: status 
    };

    return {
      ...config,
      bg: `bg-[rgb(${config.color})]/15`,
      border: `border-[rgb(${config.color})]/30`,
      text: `text-[rgb(${config.color})]`
    };
  };

  const config = getStatusConfig();

  return (
    <motion.span 
      className={`inline-flex items-center rounded-full font-medium border backdrop-blur-sm ${config.bg} ${config.border} ${sizeClasses[size]}`}
      style={{ color: `rgb(${config.color})` }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {animated && (
        <motion.div 
          className="w-2 h-2 rounded-full mr-2"
          style={{ backgroundColor: `rgb(${config.color})` }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {!animated && (
        <div 
          className="w-2 h-2 rounded-full mr-2"
          style={{ backgroundColor: `rgb(${config.color})` }}
        />
      )}
      {config.label}
    </motion.span>
  );
};

// Enhanced ProgressBar with more features
const ProgressBar = ({ 
  value, 
  max = 100, 
  color = COLORS.teal, 
  label, 
  showValue = true, 
  size = 'md',
  animated = true 
}: { 
  value: number; 
  max?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm text-slate-300 mb-2">
          <span>{label}</span>
          {showValue && <span className="font-semibold">{percentage.toFixed(1)}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-700/50 rounded-full ${height} overflow-hidden`}>
        <motion.div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${height}`}
          initial={{ width: animated ? 0 : `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          style={{ 
            backgroundColor: `rgb(${color})`,
            boxShadow: `0 0 12px rgba(${color}, 0.4)`
          }}
        />
      </div>
    </div>
  );
};

// Enhanced StatCard with better animations
const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = COLORS.teal, 
  subtitle, 
  onClick, 
  trend,
  delay = 0 
}: {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color?: string;
  subtitle?: string;
  onClick?: () => void;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}) => {
  const trendConfig = trend || (change !== undefined ? (change >= 0 ? 'up' : 'down') : 'neutral');
  
  return (
    <BentoCard 
      className="p-6" 
      glowColor={color} 
      onClick={onClick}
      padding="p-6"
      delay={delay}
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div 
          className="text-3xl p-3 rounded-2xl bg-white/5 backdrop-blur-sm"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {icon}
        </motion.div>
        {trendConfig !== 'neutral' && (
          <motion.div 
            className={`text-sm font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${
              trendConfig === 'up' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            {trendConfig === 'up' ? '↗' : '↘'} {change !== undefined ? `${Math.abs(change)}%` : ''}
          </motion.div>
        )}
      </div>
      <motion.div 
        className="text-2xl lg:text-3xl font-bold text-white mb-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.1 }}
      >
        {value}
      </motion.div>
      <div className="text-slate-300 text-sm font-medium">{title}</div>
      {subtitle && <div className="text-slate-400 text-xs mt-1">{subtitle}</div>}
    </BentoCard>
  );
};

// Enhanced ClientCard with better layout
const ClientCard = ({ client, onClick, delay = 0 }: { client: ServiceClient; onClick?: () => void; delay?: number }) => {
  const age = calculateAge(client.personalInfo.birthDate);
  const currentBookingsCount = client.currentBookings.length;
  const completedServicesCount = client.serviceHistory.services.length;
  
  const getClientColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'inactive': return COLORS.slate;
      case 'premium': return COLORS.purple;
      case 'vip': return COLORS.amber;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard 
      className="p-5" 
      glowColor={getClientColor(client.status)} 
      onClick={onClick}
      delay={delay}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="text-2xl">{client.personalInfo.avatar || '👤'}</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{client.personalInfo.fullName}</h4>
            <p className="text-slate-400 text-sm">
              {age} лет • {client.serviceHistory.category}
            </p>
          </div>
        </div>
        <StatusBadge status={client.status} type="client" animated={client.status === 'active'} />
      </div>
      
      <div className="space-y-3 text-sm mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Категория:</span>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{CATEGORY_ICONS[client.serviceHistory.category]}</span>
            <StatusBadge status={client.serviceHistory.category} />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Уровень лояльности:</span>
          <StatusBadge status={client.loyalty.level} />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Текущие записи:</span>
          <span className="text-white font-medium">{currentBookingsCount}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <div className="text-xs text-slate-400">
          {completedServicesCount} услуг
        </div>
        <div className="text-xs font-semibold text-amber-500">
          {formatCurrency(client.serviceHistory.totalSpent)}
        </div>
      </div>

      {client.tags && client.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {client.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="text-xs text-slate-400 bg-white/5 rounded-full px-2 py-1">
              {tag}
            </span>
          ))}
          {client.tags.length > 2 && (
            <span className="text-xs text-slate-400">+{client.tags.length - 2}</span>
          )}
        </div>
      )}
    </BentoCard>
  );
};

// Enhanced ServiceCard
const ServiceCard = ({ service, onClick, delay = 0 }: { service: Service; onClick?: () => void; delay?: number }) => {
  const getServiceColor = (status: string) => {
    switch (status) {
      case 'completed': return COLORS.success;
      case 'cancelled': return COLORS.error;
      case 'no_show': return COLORS.rose;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard 
      className="p-4" 
      glowColor={getServiceColor(service.status)} 
      onClick={onClick}
      delay={delay}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <h5 className="text-white font-semibold text-sm mb-1 line-clamp-2">{service.name}</h5>
          <p className="text-slate-400 text-xs">{service.provider}</p>
        </div>
        <StatusBadge status={service.status} type="service" animated={service.status === 'completed'} />
      </div>
      
      <div className="space-y-2 text-xs mb-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Дата:</span>
          <span className="text-white">{formatDate(service.date)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Длительность:</span>
          <span className="text-white">{service.duration} мин</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Категория:</span>
          <StatusBadge status={service.category} />
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
        <div className="text-xs text-slate-400">
          {service.rating ? `★ ${service.rating}` : 'Без оценки'}
        </div>
        <div className="text-xs font-semibold text-amber-500">
          {formatCurrency(service.cost)}
        </div>
      </div>
    </BentoCard>
  );
};

// Enhanced BookingCard
const BookingCard = ({ booking, onClick, delay = 0 }: { booking: Booking; onClick?: () => void; delay?: number }) => {
  const getBookingColor = (status: string) => {
    switch (status) {
      case 'confirmed': return COLORS.teal;
      case 'pending': return COLORS.orange;
      case 'cancelled': return COLORS.error;
      case 'completed': return COLORS.success;
      default: return COLORS.slate;
    }
  };

  const isUpcoming = new Date(`${booking.date}T${booking.time}`) > new Date();

  return (
    <BentoCard 
      className="p-4" 
      glowColor={getBookingColor(booking.status)} 
      onClick={onClick}
      delay={delay}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <h5 className="text-white font-semibold text-sm mb-1 line-clamp-2">{booking.serviceName}</h5>
          <p className="text-slate-400 text-xs">{booking.provider}</p>
        </div>
        <StatusBadge status={booking.status} type="booking" animated={isUpcoming && booking.status === 'confirmed'} />
      </div>
      
      <div className="space-y-2 text-xs mb-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Дата и время:</span>
          <span className="text-white">{formatDateTime(booking.date, booking.time)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Длительность:</span>
          <span className="text-white">{booking.duration} мин</span>
        </div>
        
        {booking.assignedSpecialist && (
          <div className="flex justify-between">
            <span className="text-slate-400">Специалист:</span>
            <span className="text-white text-right">{booking.assignedSpecialist}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
        {booking.specialRequests && (
          <div className="text-xs text-slate-400 line-clamp-1 flex-1 mr-2">
            {booking.specialRequests}
          </div>
        )}
        <div className="text-xs font-semibold text-amber-500 whitespace-nowrap">
          {formatCurrency(booking.cost)}
        </div>
      </div>
    </BentoCard>
  );
};

// Enhanced ProviderCard
const ProviderCard = ({ provider, onClick, delay = 0 }: { provider: ServiceProvider; onClick?: () => void; delay?: number }) => {
  const getProviderColor = (status: string) => {
    switch (status) {
      case 'available': return COLORS.success;
      case 'busy': return COLORS.orange;
      case 'offline': return COLORS.slate;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard 
      className="p-5" 
      glowColor={getProviderColor(provider.status)} 
      onClick={onClick}
      delay={delay}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="text-2xl">{provider.image || '🏢'}</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{provider.name}</h4>
            <p className="text-slate-400 text-sm line-clamp-1">{provider.category}</p>
          </div>
        </div>
        <StatusBadge status={provider.status} type="provider" animated={provider.status === 'available'} />
      </div>
      
      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Рейтинг:</span>
          <div className="flex items-center space-x-1">
            <span className="text-amber-500">★</span>
            <span className="text-white font-medium">{provider.rating}</span>
            <span className="text-slate-400 text-xs">({provider.reviews})</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Доступность:</span>
          <span className="text-white font-medium text-xs">{provider.availability.days.join(', ')}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Часы работы:</span>
          <span className="text-white font-medium text-xs">{provider.availability.hours}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {provider.specialization.slice(0, 3).map((spec, index) => (
          <span key={index} className="text-xs text-slate-400 bg-white/5 rounded-full px-2 py-1">
            {spec}
          </span>
        ))}
        {provider.specialization.length > 3 && (
          <span className="text-xs text-slate-400">+{provider.specialization.length - 3}</span>
        )}
      </div>
    </BentoCard>
  );
};

// New Search and Filter Components
const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Поиск..." 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  placeholder?: string;
}) => (
  <div className="relative">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 pl-12 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent backdrop-blur-xl transition-all duration-300"
    />
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  </div>
);

const FilterChips = ({ 
  filters, 
  activeFilters, 
  onFilterChange,
  type = 'default'
}: { 
  filters: { id: string; label: string; count?: number }[];
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
  type?: 'default' | 'category' | 'status';
}) => {
  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      onFilterChange(activeFilters.filter(id => id !== filterId));
    } else {
      onFilterChange([...activeFilters, filterId]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => toggleFilter(filter.id)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
            activeFilters.includes(filter.id)
              ? 'bg-white/20 text-white border border-white/30'
              : 'bg-white/5 text-slate-400 border border-slate-600/50 hover:bg-white/10 hover:text-slate-300'
          }`}
        >
          {filter.label}
          {filter.count !== undefined && (
            <span className="ml-1 text-xs opacity-70">({filter.count})</span>
          )}
        </button>
      ))}
    </div>
  );
};

// Enhanced Main Dashboard Component
const ServiceClientDashboard = () => {
  const [selectedClient, setSelectedClient] = useState<ServiceClient | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'services' | 'bookings' | 'providers'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [clientFilters, setClientFilters] = useState<string[]>([]);
  const [serviceFilters, setServiceFilters] = useState<string[]>([]);
  const [bookingFilters, setBookingFilters] = useState<string[]>([]);
  const [providerFilters, setProviderFilters] = useState<string[]>([]);
  
  const currentTime = useClientTime();
  
  // Enhanced statistics with more metrics
  const stats = useMemo(() => {
    const totalClients = serviceClients.length;
    const activeClients = serviceClients.filter(c => c.status === 'active' || c.status === 'premium' || c.status === 'vip').length;
    const totalRevenue = serviceClients.reduce((acc, client) => acc + client.serviceHistory.totalSpent, 0);
    const activeBookings = serviceClients.reduce((acc, client) => acc + client.currentBookings.length, 0);
    const totalProviders = serviceProviders.length;
    const availableProviders = serviceProviders.filter(p => p.status === 'available').length;
    const monthlyRevenue = serviceClients.reduce((acc, client) => {
      const monthServices = client.serviceHistory.services.filter(s => {
        const serviceDate = new Date(s.date);
        const currentMonth = new Date().getMonth();
        return serviceDate.getMonth() === currentMonth;
      });
      return acc + monthServices.reduce((sum, service) => sum + service.cost, 0);
    }, 0);
    
    return {
      totalClients,
      activeClients,
      totalRevenue,
      activeBookings,
      totalProviders,
      availableProviders,
      monthlyRevenue
    };
  }, []);

  // Enhanced filtering with search
  const filteredClients = useMemo(() => {
    let filtered = serviceClients;
    
    if (searchQuery) {
      filtered = filtered.filter(client =>
        client.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.personalInfo.phone.includes(searchQuery) ||
        client.personalInfo.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.serviceHistory.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (clientFilters.length > 0) {
      filtered = filtered.filter(client => 
        clientFilters.includes(client.status) ||
        clientFilters.includes(client.serviceHistory.category) ||
        clientFilters.includes(client.loyalty.level)
      );
    }
    
    return filtered;
  }, [searchQuery, clientFilters]);

  const filteredServices = useMemo(() => {
    const allServices = serviceClients.flatMap(client => client.serviceHistory.services);
    
    let filtered = allServices;
    
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (serviceFilters.length > 0) {
      filtered = filtered.filter(service => 
        serviceFilters.includes(service.status) ||
        serviceFilters.includes(service.category)
      );
    }
    
    return filtered;
  }, [searchQuery, serviceFilters]);

  const filteredBookings = useMemo(() => {
    const allBookings = serviceClients.flatMap(client => client.currentBookings);
    
    let filtered = allBookings;
    
    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.provider.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (bookingFilters.length > 0) {
      filtered = filtered.filter(booking => 
        bookingFilters.includes(booking.status)
      );
    }
    
    return filtered;
  }, [searchQuery, bookingFilters]);

  const filteredProviders = useMemo(() => {
    let filtered = serviceProviders;
    
    if (searchQuery) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.specialization.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (providerFilters.length > 0) {
      filtered = filtered.filter(provider => 
        providerFilters.includes(provider.status) ||
        providerFilters.includes(provider.category)
      );
    }
    
    return filtered;
  }, [searchQuery, providerFilters]);

  // Filter options
  const clientFilterOptions = useMemo(() => [
    { id: 'active', label: 'Активные', count: serviceClients.filter(c => c.status === 'active').length },
    { id: 'premium', label: 'Премиум', count: serviceClients.filter(c => c.status === 'premium').length },
    { id: 'vip', label: 'VIP', count: serviceClients.filter(c => c.status === 'vip').length },
    { id: 'beauty', label: 'Красота', count: serviceClients.filter(c => c.serviceHistory.category === 'beauty').length },
    { id: 'health', label: 'Здоровье', count: serviceClients.filter(c => c.serviceHistory.category === 'health').length },
    { id: 'education', label: 'Образование', count: serviceClients.filter(c => c.serviceHistory.category === 'education').length },
  ], []);

  const serviceFilterOptions = useMemo(() => [
    { id: 'completed', label: 'Завершены', count: serviceClients.flatMap(c => c.serviceHistory.services).filter(s => s.status === 'completed').length },
    { id: 'cancelled', label: 'Отменены', count: serviceClients.flatMap(c => c.serviceHistory.services).filter(s => s.status === 'cancelled').length },
    { id: 'beauty', label: 'Красота', count: serviceClients.flatMap(c => c.serviceHistory.services).filter(s => s.category === 'beauty').length },
    { id: 'health', label: 'Здоровье', count: serviceClients.flatMap(c => c.serviceHistory.services).filter(s => s.category === 'health').length },
  ], []);

  const bookingFilterOptions = useMemo(() => [
    { id: 'confirmed', label: 'Подтверждены', count: serviceClients.flatMap(c => c.currentBookings).filter(b => b.status === 'confirmed').length },
    { id: 'pending', label: 'Ожидание', count: serviceClients.flatMap(c => c.currentBookings).filter(b => b.status === 'pending').length },
    { id: 'cancelled', label: 'Отменены', count: serviceClients.flatMap(c => c.currentBookings).filter(b => b.status === 'cancelled').length },
  ], []);

  const providerFilterOptions = useMemo(() => [
    { id: 'available', label: 'Доступны', count: serviceProviders.filter(p => p.status === 'available').length },
    { id: 'busy', label: 'Заняты', count: serviceProviders.filter(p => p.status === 'busy').length },
    { id: 'beauty', label: 'Красота', count: serviceProviders.filter(p => p.category === 'beauty').length },
    { id: 'health', label: 'Здоровье', count: serviceProviders.filter(p => p.category === 'health').length },
  ], []);

  // Clear filters when changing tabs
  useEffect(() => {
    setSearchQuery('');
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-4 lg:p-6">
      {/* Enhanced Header */}
      <motion.header 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
              Клиенты сферы услуг
            </h1>
            <p className="text-slate-400 text-lg">Управление клиентами и сервисными услугами</p>
          </div>
          <div className="mt-4 lg:mt-0 text-right">
            <div className="text-2xl lg:text-3xl font-mono font-bold text-white mb-1 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {currentTime}
            </div>
            <div className="text-slate-400 text-sm">
              {new Date().toLocaleDateString('ru-RU', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <nav className="flex space-x-1 p-1 bg-slate-800/50 rounded-2xl backdrop-blur-xl border border-slate-700/50 mb-6">
          {[
            { id: 'overview', label: 'Обзор', icon: '📊' },
            { id: 'clients', label: 'Клиенты', icon: '👥' },
            { id: 'services', label: 'Услуги', icon: '🎯' },
            { id: 'bookings', label: 'Записи', icon: '📅' },
            { id: 'providers', label: 'Провайдеры', icon: '🏢' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white shadow-lg shadow-black/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Поиск ${activeTab === 'clients' ? 'клиентов' : activeTab === 'services' ? 'услуг' : activeTab === 'bookings' ? 'записей' : 'провайдеров'}...`}
          />
        </div>

        {/* Filter Chips */}
        <AnimatePresence>
          {activeTab === 'clients' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <FilterChips
                filters={clientFilterOptions}
                activeFilters={clientFilters}
                onFilterChange={setClientFilters}
              />
            </motion.div>
          )}
          {activeTab === 'services' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <FilterChips
                filters={serviceFilterOptions}
                activeFilters={serviceFilters}
                onFilterChange={setServiceFilters}
              />
            </motion.div>
          )}
          {activeTab === 'bookings' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <FilterChips
                filters={bookingFilterOptions}
                activeFilters={bookingFilters}
                onFilterChange={setBookingFilters}
              />
            </motion.div>
          )}
          {activeTab === 'providers' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <FilterChips
                filters={providerFilterOptions}
                activeFilters={providerFilters}
                onFilterChange={setProviderFilters}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Enhanced Main Content */}
      <main>
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Enhanced Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  title="Всего клиентов"
                  value={stats.totalClients}
                  change={2.5}
                  icon="👥"
                  color={COLORS.blue}
                  subtitle={`${stats.activeClients} активных`}
                  trend="up"
                  delay={0.1}
                />
                <StatCard
                  title="Общий доход"
                  value={formatCurrency(stats.totalRevenue)}
                  change={5.8}
                  icon="💰"
                  color={COLORS.emerald}
                  subtitle="за все время"
                  trend="up"
                  delay={0.2}
                />
                <StatCard
                  title="Активные записи"
                  value={stats.activeBookings}
                  change={1.2}
                  icon="📅"
                  color={COLORS.orange}
                  subtitle="на ближайшее время"
                  trend="up"
                  delay={0.3}
                />
                <StatCard
                  title="Провайдеры"
                  value={stats.availableProviders}
                  change={0}
                  icon="🏢"
                  color={COLORS.purple}
                  subtitle={`из ${stats.totalProviders} доступно`}
                  trend="neutral"
                  delay={0.4}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Active Clients */}
                <BentoCard className="p-6" glowColor={COLORS.purple}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Активные клиенты</h3>
                    <button 
                      className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-300"
                      onClick={() => setActiveTab('clients')}
                    >
                      Все →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {serviceClients.slice(0, 4).map((client, index) => (
                      <motion.div 
                        key={client.id}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                        onClick={() => setSelectedClient(client)}
                        whileHover={{ x: 4 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="text-2xl">{client.personalInfo.avatar || '👤'}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm truncate">{client.personalInfo.fullName}</h4>
                          <p className="text-slate-400 text-xs">
                            {client.serviceHistory.category} • {client.loyalty.level}
                          </p>
                        </div>
                        <StatusBadge status={client.status} type="client" />
                      </motion.div>
                    ))}
                  </div>
                </BentoCard>

                {/* Upcoming Bookings */}
                <BentoCard className="p-6" glowColor={COLORS.orange}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Ближайшие записи</h3>
                    <button 
                      className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-300"
                      onClick={() => setActiveTab('bookings')}
                    >
                      Все →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {serviceClients.flatMap(client => client.currentBookings)
                      .slice(0, 4)
                      .map((booking, index) => (
                      <motion.div 
                        key={booking.id}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                        onClick={() => setSelectedBooking(booking)}
                        whileHover={{ x: 4 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          booking.status === 'confirmed' ? 'bg-gradient-to-br from-teal-500 to-emerald-500' :
                          booking.status === 'pending' ? 'bg-gradient-to-br from-orange-500 to-amber-500' :
                          'bg-gradient-to-br from-slate-500 to-slate-600'
                        }`}>
                          {booking.serviceName[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm line-clamp-2">{booking.serviceName}</h4>
                          <p className="text-slate-400 text-xs">
                            {formatDate(booking.date)} в {booking.time}
                          </p>
                        </div>
                        <StatusBadge status={booking.status} type="booking" />
                      </motion.div>
                    ))}
                  </div>
                </BentoCard>
              </div>

              {/* Available Providers */}
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Доступные провайдеры</h3>
                  <button 
                    className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-300"
                    onClick={() => setActiveTab('providers')}
                  >
                    Все →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {serviceProviders.slice(0, 3).map((provider, index) => (
                    <ProviderCard 
                      key={provider.id} 
                      provider={provider} 
                      onClick={() => setSelectedProvider(provider)}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </BentoCard>
            </motion.div>
          )}

          {/* Enhanced Clients Tab */}
          {activeTab === 'clients' && (
            <motion.div
              key="clients"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Клиенты</h2>
                <p className="text-slate-400">
                  {filteredClients.length} клиентов {searchQuery && `найдено по запросу "${searchQuery}"`}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredClients.map((client, index) => (
                  <ClientCard 
                    key={client.id} 
                    client={client} 
                    onClick={() => setSelectedClient(client)}
                    delay={index * 0.05}
                  />
                ))}
              </div>

              {filteredClients.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Клиенты не найдены</h3>
                  <p className="text-slate-400">Попробуйте изменить параметры поиска или фильтры</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Enhanced Services Tab */}
          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">История услуг</h2>
                <p className="text-slate-400">
                  {filteredServices.length} услуг {searchQuery && `найдено по запросу "${searchQuery}"`}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((service, index) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onClick={() => setSelectedService(service)}
                    delay={index * 0.05}
                  />
                ))}
              </div>

              {filteredServices.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Услуги не найдены</h3>
                  <p className="text-slate-400">Попробуйте изменить параметры поиска или фильтры</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Enhanced Bookings Tab */}
          {activeTab === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Текущие записи</h2>
                <p className="text-slate-400">
                  {filteredBookings.length} записей {searchQuery && `найдено по запросу "${searchQuery}"`}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBookings.map((booking, index) => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    onClick={() => setSelectedBooking(booking)}
                    delay={index * 0.05}
                  />
                ))}
              </div>

              {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Записи не найдены</h3>
                  <p className="text-slate-400">Попробуйте изменить параметры поиска или фильтры</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Enhanced Providers Tab */}
          {activeTab === 'providers' && (
            <motion.div
              key="providers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Провайдеры услуг</h2>
                <p className="text-slate-400">
                  {filteredProviders.length} провайдеров {searchQuery && `найдено по запросу "${searchQuery}"`}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProviders.map((provider, index) => (
                  <ProviderCard 
                    key={provider.id} 
                    provider={provider} 
                    onClick={() => setSelectedProvider(provider)}
                    delay={index * 0.05}
                  />
                ))}
              </div>

              {filteredProviders.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Провайдеры не найдены</h3>
                  <p className="text-slate-400">Попробуйте изменить параметры поиска или фильтры</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Enhanced Modal Windows */}
      <Modal 
        isOpen={!!selectedClient} 
        onClose={() => setSelectedClient(null)}
        title={selectedClient?.personalInfo.fullName}
        size="xl"
      >
        {selectedClient && (
          <div className="space-y-6">
            {/* Enhanced Client Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Персональная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дата рождения:</span>
                    <span className="text-white">{formatDate(selectedClient.personalInfo.birthDate)} ({calculateAge(selectedClient.personalInfo.birthDate)} лет)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Телефон:</span>
                    <span className="text-white">{selectedClient.personalInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white">{selectedClient.personalInfo.email || 'Не указан'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Адрес:</span>
                    <span className="text-white text-right">{selectedClient.personalInfo.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Предпочтительная связь:</span>
                    <StatusBadge status={selectedClient.personalInfo.preferences.communication} />
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Предпочтения</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Удобное время:</span>
                    <span className="text-white">{selectedClient.personalInfo.preferences.timePreferences.join(', ')}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400">Особые требования:</span>
                    <div className="text-right">
                      {selectedClient.personalInfo.preferences.specialRequirements.map((req, index) => (
                        <div key={index} className="text-white text-xs bg-white/10 rounded-full px-2 py-1 mb-1">
                          {req}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Уведомления:</span>
                    <StatusBadge status={selectedClient.personalInfo.preferences.notifications ? 'active' : 'inactive'} />
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.teal}>
                <h4 className="text-lg font-semibold text-white mb-4">История услуг</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Основная категория:</span>
                    <StatusBadge status={selectedClient.serviceHistory.category} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Количество услуг:</span>
                    <span className="text-white">{selectedClient.serviceHistory.services.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Общие затраты:</span>
                    <span className="text-white font-semibold">{formatCurrency(selectedClient.serviceHistory.totalSpent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Средняя оценка:</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-amber-500">★</span>
                      <span className="text-white">{selectedClient.serviceHistory.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Клиент с:</span>
                    <span className="text-white">{formatDate(selectedClient.serviceHistory.memberSince)}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.orange}>
                <h4 className="text-lg font-semibold text-white mb-4">Программа лояльности</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Уровень:</span>
                    <StatusBadge status={selectedClient.loyalty.level} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Баллы:</span>
                    <span className="text-white">{selectedClient.loyalty.points}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Скидка:</span>
                    <span className="text-white">{selectedClient.loyalty.discount}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">До след. уровня:</span>
                    <span className="text-white">{selectedClient.loyalty.nextLevelPoints - selectedClient.loyalty.points} баллов</span>
                  </div>
                </div>
                <div className="mt-4">
                  <ProgressBar 
                    value={(selectedClient.loyalty.points / selectedClient.loyalty.nextLevelPoints) * 100} 
                    label="Прогресс уровня" 
                    color={COLORS.amber}
                  />
                </div>
                {selectedClient.loyalty.benefits.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-slate-300 text-sm font-medium mb-2">Преимущества:</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedClient.loyalty.benefits.map((benefit, index) => (
                        <span key={index} className="text-xs text-emerald-300 bg-emerald-500/10 rounded-full px-2 py-1">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </BentoCard>
            </div>

            {/* Enhanced Current Bookings */}
            <BentoCard className="p-6" glowColor={COLORS.emerald}>
              <h4 className="text-lg font-semibold text-white mb-4">Текущие записи</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedClient.currentBookings.map((booking, index) => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    onClick={() => setSelectedBooking(booking)}
                    delay={index * 0.1}
                  />
                ))}
              </div>
              {selectedClient.currentBookings.length === 0 && (
                <p className="text-slate-400 text-center py-4">Нет текущих записей</p>
              )}
            </BentoCard>

            {/* Enhanced Service History */}
            <BentoCard className="p-6" glowColor={COLORS.indigo}>
              <h4 className="text-lg font-semibold text-white mb-4">История услуг</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedClient.serviceHistory.services.slice(0, 6).map((service, index) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onClick={() => setSelectedService(service)}
                    delay={index * 0.05}
                  />
                ))}
              </div>
            </BentoCard>

            {/* Enhanced Notes and Tags */}
            {selectedClient.notes && (
              <BentoCard className="p-6" glowColor={COLORS.rose}>
                <h4 className="text-lg font-semibold text-white mb-4">Примечания</h4>
                <p className="text-slate-300 text-sm">{selectedClient.notes}</p>
              </BentoCard>
            )}

            {selectedClient.tags && selectedClient.tags.length > 0 && (
              <BentoCard className="p-6" glowColor={COLORS.cyan}>
                <h4 className="text-lg font-semibold text-white mb-4">Теги</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedClient.tags.map((tag, index) => (
                    <span key={index} className="text-sm text-slate-300 bg-white/10 rounded-full px-3 py-1.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>

      {/* Enhanced Service Modal */}
      <Modal 
        isOpen={!!selectedService} 
        onClose={() => setSelectedService(null)}
        title="Информация об услуге"
        size="lg"
      >
        {selectedService && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Основная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Название услуги:</span>
                    <span className="text-white">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Провайдер:</span>
                    <span className="text-white">{selectedService.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Категория:</span>
                    <StatusBadge status={selectedService.category} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedService.status} type="service" />
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Детали услуги</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дата:</span>
                    <span className="text-white">{formatDate(selectedService.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Длительность:</span>
                    <span className="text-white">{selectedService.duration} минут</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Стоимость:</span>
                    <span className="text-white font-semibold">{formatCurrency(selectedService.cost)}</span>
                  </div>
                  {selectedService.rating && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Оценка:</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-amber-500">★</span>
                        <span className="text-white">{selectedService.rating}/5</span>
                      </div>
                    </div>
                  )}
                </div>
              </BentoCard>
            </div>

            {selectedService.description && (
              <BentoCard className="p-6" glowColor={COLORS.teal}>
                <h4 className="text-lg font-semibold text-white mb-4">Описание услуги</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedService.description}</p>
              </BentoCard>
            )}

            {selectedService.review && (
              <BentoCard className="p-6" glowColor={COLORS.amber}>
                <h4 className="text-lg font-semibold text-white mb-4">Отзыв клиента</h4>
                <p className="text-slate-300 text-sm leading-relaxed italic">"{selectedService.review}"</p>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>

      {/* Enhanced Booking Modal */}
      <Modal 
        isOpen={!!selectedBooking} 
        onClose={() => setSelectedBooking(null)}
        title="Информация о записи"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Основная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Услуга:</span>
                    <span className="text-white">{selectedBooking.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Провайдер:</span>
                    <span className="text-white">{selectedBooking.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedBooking.status} type="booking" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Стоимость:</span>
                    <span className="text-white font-semibold">{formatCurrency(selectedBooking.cost)}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Время и дата</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дата:</span>
                    <span className="text-white">{formatDate(selectedBooking.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Время:</span>
                    <span className="text-white">{selectedBooking.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Длительность:</span>
                    <span className="text-white">{selectedBooking.duration} минут</span>
                  </div>
                  {selectedBooking.assignedSpecialist && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Специалист:</span>
                      <span className="text-white">{selectedBooking.assignedSpecialist}</span>
                    </div>
                  )}
                </div>
              </BentoCard>
            </div>

            {selectedBooking.location && (
              <BentoCard className="p-6" glowColor={COLORS.teal}>
                <h4 className="text-lg font-semibold text-white mb-4">Местоположение</h4>
                <p className="text-slate-300 text-sm">{selectedBooking.location}</p>
              </BentoCard>
            )}

            {selectedBooking.specialRequests && (
              <BentoCard className="p-6" glowColor={COLORS.orange}>
                <h4 className="text-lg font-semibold text-white mb-4">Особые пожелания</h4>
                <p className="text-slate-300 text-sm">{selectedBooking.specialRequests}</p>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>

      {/* Enhanced Provider Modal */}
      <Modal 
        isOpen={!!selectedProvider} 
        onClose={() => setSelectedProvider(null)}
        title={selectedProvider?.name}
        size="lg"
      >
        {selectedProvider && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Основная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Категория:</span>
                    <StatusBadge status={selectedProvider.category} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Рейтинг:</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-amber-500">★</span>
                      <span className="text-white">{selectedProvider.rating}</span>
                      <span className="text-slate-400 text-xs">({selectedProvider.reviews} отзывов)</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedProvider.status} type="provider" />
                  </div>
                  {selectedProvider.experience && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Опыт работы:</span>
                      <span className="text-white">{selectedProvider.experience}</span>
                    </div>
                  )}
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Контактная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Телефон:</span>
                    <span className="text-white">{selectedProvider.contact.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white">{selectedProvider.contact.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Адрес:</span>
                    <span className="text-white text-right">{selectedProvider.contact.address}</span>
                  </div>
                  {selectedProvider.contact.website && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Вебсайт:</span>
                      <span className="text-white">{selectedProvider.contact.website}</span>
                    </div>
                  )}
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.teal}>
                <h4 className="text-lg font-semibold text-white mb-4">Расписание</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дни работы:</span>
                    <span className="text-white">{selectedProvider.availability.days.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Часы работы:</span>
                    <span className="text-white">{selectedProvider.availability.hours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Часовой пояс:</span>
                    <span className="text-white">{selectedProvider.availability.timezone}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.orange}>
                <h4 className="text-lg font-semibold text-white mb-4">Специализация</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.specialization.map((spec, index) => (
                    <span 
                      key={index}
                      className="text-xs text-slate-300 bg-white/10 rounded-full px-3 py-1.5 border border-slate-600/50"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </BentoCard>
            </div>

            {selectedProvider.description && (
              <BentoCard className="p-6" glowColor={COLORS.indigo}>
                <h4 className="text-lg font-semibold text-white mb-4">Описание</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedProvider.description}</p>
              </BentoCard>
            )}

            {selectedProvider.languages && selectedProvider.languages.length > 0 && (
              <BentoCard className="p-6" glowColor={COLORS.emerald}>
                <h4 className="text-lg font-semibold text-white mb-4">Языки</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.languages.map((language, index) => (
                    <span key={index} className="text-sm text-slate-300 bg-white/10 rounded-full px-3 py-1.5">
                      {language}
                    </span>
                  ))}
                </div>
              </BentoCard>
            )}

            {selectedProvider.pricing && (
              <BentoCard className="p-6" glowColor={COLORS.rose}>
                <h4 className="text-lg font-semibold text-white mb-4">Стоимость услуг</h4>
                <div className="flex items-center space-x-4 text-sm">
                  <div>
                    <span className="text-slate-400">От:</span>
                    <span className="text-white font-semibold ml-2">
                      {formatCurrency(selectedProvider.pricing.min)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">До:</span>
                    <span className="text-white font-semibold ml-2">
                      {formatCurrency(selectedProvider.pricing.max)}
                    </span>
                  </div>
                </div>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ServiceClientDashboard;