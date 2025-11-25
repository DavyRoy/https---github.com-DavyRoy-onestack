'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Константы цветов
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

const COURIER_COLORS = {
  active: '34, 197, 94',
  inactive: '100, 116, 139',
  on_delivery: '59, 130, 246',
  on_break: '245, 158, 11',
  available: '16, 185, 129',
  busy: '239, 68, 68',
  food: '249, 115, 22',
  package: '147, 51, 234',
  document: '59, 130, 246',
  express: '239, 68, 68',
  standard: '16, 185, 129',
  scheduled: '245, 158, 11',
  high: '239, 68, 68',
  medium: '245, 158, 11',
  low: '34, 197, 94'
};

// Вспомогательные функции форматирования
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatTime = (timeString: string): string => {
  return timeString;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

const getDeliveryTypeIcon = (type: string): string => {
  switch (type) {
    case 'food': return '🍕';
    case 'package': return '📦';
    case 'document': return '📄';
    case 'express': return '⚡';
    default: return '🚚';
  }
};

const getVehicleIcon = (vehicle: string): string => {
  switch (vehicle) {
    case 'car': return '🚗';
    case 'motorcycle': return '🏍️';
    case 'bicycle': return '🚲';
    case 'foot': return '🚶';
    default: return '🚚';
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return COURIER_COLORS.active;
    case 'inactive': return COURIER_COLORS.inactive;
    case 'on_delivery': return COURIER_COLORS.on_delivery;
    case 'on_break': return COURIER_COLORS.on_break;
    case 'available': return COURIER_COLORS.available;
    case 'busy': return COURIER_COLORS.busy;
    case 'assigned': return COURIER_COLORS.available;
    case 'picked_up': return COURIER_COLORS.on_delivery;
    case 'in_transit': return COURIER_COLORS.busy;
    case 'delivered': return COURIER_COLORS.active;
    case 'cancelled': return COURIER_COLORS.inactive;
    default: return COURIER_COLORS.inactive;
  }
};

// Базовые компоненты интерфейса
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'md',
  showCloseButton = true
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
    xl: 'max-w-6xl'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <motion.div
        className={`relative bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50 rounded-3xl shadow-2xl w-full ${sizeClasses[size]} max-h-[95vh] overflow-hidden z-10`}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {title && (
          <div className="border-b border-slate-700/50 p-6 bg-slate-800/20">
            <div className="flex items-center justify-between">
              <h2 id="modal-title" className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {title}
              </h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200 text-slate-400 hover:text-white hover:scale-110 active:scale-95"
                  aria-label="Закрыть модальное окно"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-80px)] custom-scrollbar">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: string;
  delay?: number;
  animated?: boolean;
}

const BentoCard: React.FC<BentoCardProps> = ({ 
  children, 
  className = '', 
  glowColor = COLORS.teal, 
  onClick,
  hoverable = true,
  padding = 'p-6',
  delay = 0,
  animated = true
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
      ${onClick ? 'cursor-pointer active:scale-95' : ''}
      ${padding}
      ${className}
    `}
    style={{
      backgroundImage: `
        radial-gradient(280px circle at 50% 50%, rgba(${glowColor},0.15), transparent 60%),
        linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)
      `
    }}
    initial={animated ? { opacity: 0, y: 20 } : false}
    animate={animated ? { opacity: 1, y: 0 } : false}
    transition={animated ? { delay: delay * 0.1, duration: 0.6 } : {}}
    whileHover={hoverable && animated ? { y: -4, scale: 1.02 } : {}}
    whileTap={onClick && animated ? { scale: 0.98 } : {}}
    onClick={onClick}
  >
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
      style={{
        background: `radial-gradient(500px circle at 50% 50%, rgba(${glowColor},0.12), transparent 50%)`
      }}
    />
    
    <div className="relative z-10 h-full">
      {children}
    </div>

    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none overflow-hidden">
      <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:animate-shine" />
    </div>
  </motion.div>
);

interface StatusBadgeProps {
  status: string;
  type?: 'default' | 'client' | 'service' | 'booking' | 'provider';
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  type = 'default', 
  animated = false,
  size = 'md'
}) => {
  const getStatusConfig = () => {
    const baseConfig = {
      active: { color: COLORS.success, label: 'Активен', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      inactive: { color: COLORS.slate, label: 'Неактивен', bg: 'bg-slate-500/15', border: 'border-slate-500/30' },
      on_delivery: { color: COLORS.blue, label: 'На доставке', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      on_break: { color: COLORS.orange, label: 'На перерыве', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      available: { color: COLORS.emerald, label: 'Доступен', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      busy: { color: COLORS.error, label: 'Занят', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      assigned: { color: COLORS.teal, label: 'Назначен', bg: 'bg-teal-500/15', border: 'border-teal-500/30' },
      picked_up: { color: COLORS.blue, label: 'Забран', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      in_transit: { color: COLORS.orange, label: 'В пути', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      delivered: { color: COLORS.success, label: 'Доставлен', bg: 'bg-green-500/15', border: 'border-green-500/30' },
      cancelled: { color: COLORS.error, label: 'Отменен', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      food: { color: COURIER_COLORS.food, label: 'Еда', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      package: { color: COURIER_COLORS.package, label: 'Посылка', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
      document: { color: COURIER_COLORS.document, label: 'Документы', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      express: { color: COURIER_COLORS.express, label: 'Экспресс', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      standard: { color: COURIER_COLORS.standard, label: 'Стандарт', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      scheduled: { color: COURIER_COLORS.scheduled, label: 'По расписанию', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      car: { color: COLORS.blue, label: 'Автомобиль', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      motorcycle: { color: COLORS.orange, label: 'Мотоцикл', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      bicycle: { color: COLORS.emerald, label: 'Велосипед', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      foot: { color: COLORS.slate, label: 'Пеший', bg: 'bg-slate-500/15', border: 'border-slate-500/30' },
      high: { color: COURIER_COLORS.high, label: 'Высокий', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      medium: { color: COURIER_COLORS.medium, label: 'Средний', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      low: { color: COURIER_COLORS.low, label: 'Низкий', bg: 'bg-green-500/15', border: 'border-green-500/30' }
    };

    return baseConfig[status as keyof typeof baseConfig] || { 
      color: COLORS.slate, 
      label: status, 
      bg: 'bg-slate-500/15', 
      border: 'border-slate-500/30' 
    };
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm'
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

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max = 100, 
  color = COLORS.teal, 
  label, 
  showValue = true, 
  size = 'md',
  animated = true
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';
  
  return (
    <div className="w-full">
      {label && (
        <div className={`flex justify-between text-slate-300 mb-2 ${textSize}`}>
          <span>{label}</span>
          {showValue && <span className="font-semibold">{percentage.toFixed(1)}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-700/50 rounded-full ${height} overflow-hidden`}>
        <motion.div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${height}`}
          initial={animated ? { width: 0 } : false}
          animate={animated ? { width: `${percentage}%` } : false}
          transition={animated ? { duration: 1.5, ease: "easeOut" } : {}}
          style={{ 
            backgroundColor: `rgb(${color})`,
            boxShadow: `0 0 12px rgba(${color}, 0.4)`
          }}
        />
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color?: string;
  subtitle?: string;
  onClick?: () => void;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  color = COLORS.teal,
  subtitle,
  onClick,
  trend,
  loading = false
}) => {
  const trendConfig = trend || (change !== undefined ? (change >= 0 ? 'up' : 'down') : 'neutral');
  
  if (loading) {
    return (
      <BentoCard className="p-6" glowColor={color} padding="p-6" hoverable={false}>
        <div className="animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-slate-700 rounded-2xl"></div>
            <div className="w-16 h-6 bg-slate-700 rounded-full"></div>
          </div>
          <div className="h-8 bg-slate-700 rounded mb-2"></div>
          <div className="h-4 bg-slate-700 rounded"></div>
          {subtitle && <div className="h-3 bg-slate-700 rounded mt-1"></div>}
        </div>
      </BentoCard>
    );
  }
  
  return (
    <BentoCard 
      className="p-6" 
      glowColor={color} 
      onClick={onClick}
      padding="p-6"
      hoverable={!!onClick}
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
            transition={{ delay: 0.2 }}
          >
            {trendConfig === 'up' ? '↗' : '↘'} {change !== undefined ? `${Math.abs(change)}%` : ''}
          </motion.div>
        )}
      </div>
      <motion.div 
        className="text-2xl lg:text-3xl font-bold text-white mb-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {value}
      </motion.div>
      <div className="text-slate-300 text-sm font-medium">{title}</div>
      {subtitle && <div className="text-slate-400 text-xs mt-1">{subtitle}</div>}
    </BentoCard>
  );
};

// Типы данных
interface WorkingHours {
  days: string[];
  hours: string;
}

interface Performance {
  onTimeRate: number;
  averageDeliveryTime: number;
  customerRating: number;
  lastEvaluation: string;
  notes?: string;
}

interface Equipment {
  phone: boolean;
  thermalBag: boolean;
  cash: boolean;
  cardReader: boolean;
  uniform: boolean;
}

interface Delivery {
  id: string;
  type: 'food' | 'package' | 'document' | 'express';
  priority: 'high' | 'medium' | 'low';
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  pickupAddress: string;
  distance: number;
  estimatedTime: number;
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  assignedTime: string;
  pickupTime?: string;
  deliveryTime?: string;
  amount: number;
  notes?: string;
}

interface PersonalInfo {
  fullName: string;
  birthDate: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
}

interface WorkInfo {
  vehicle: 'car' | 'motorcycle' | 'bicycle' | 'foot';
  licensePlate?: string;
  status: 'active' | 'inactive' | 'on_delivery' | 'on_break' | 'available' | 'busy';
  hireDate: string;
  zone: string;
  workingHours: WorkingHours;
  rating: number;
  completedDeliveries: number;
  totalEarnings: number;
}

interface Courier {
  id: string;
  personalInfo: PersonalInfo;
  workInfo: WorkInfo;
  currentDeliveries: Delivery[];
  performance: Performance;
  equipment: Equipment;
}

// Моки данных для курьеров (расширенные)
const couriers: Courier[] = [
  {
    id: 'cur-001',
    personalInfo: {
      fullName: 'Иванов Алексей Петрович',
      birthDate: '1990-05-15',
      gender: 'male',
      phone: '+7 (916) 123-45-67',
      email: 'a.ivanov@courier.ru',
      address: 'г. Москва, ул. Ленина, д. 25, кв. 12',
      emergencyContact: '+7 (925) 111-22-33'
    },
    workInfo: {
      vehicle: 'motorcycle',
      licensePlate: 'A123BC777',
      status: 'on_delivery',
      hireDate: '2023-01-15',
      zone: 'Центральный округ',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        hours: '10:00-22:00'
      },
      rating: 4.8,
      completedDeliveries: 1245,
      totalEarnings: 856000
    },
    currentDeliveries: [
      {
        id: 'del-001',
        type: 'food',
        priority: 'high',
        customerName: 'Петрова Мария',
        customerPhone: '+7 (916) 999-88-77',
        customerAddress: 'г. Москва, ул. Тверская, д. 15, кв. 34',
        pickupAddress: 'Ресторан "Суши-Мастер", ул. Арбат, д. 25',
        distance: 3.2,
        estimatedTime: 25,
        status: 'in_transit',
        assignedTime: '2024-06-25T14:30:00',
        pickupTime: '2024-06-25T14:45:00',
        amount: 450,
        notes: 'Клиент просит позвонить за 5 минут до прибытия. Еду доставить горячей.'
      },
      {
        id: 'del-002',
        type: 'document',
        priority: 'medium',
        customerName: 'ООО "Бизнес-Консалт"',
        customerPhone: '+7 (495) 123-45-67',
        customerAddress: 'г. Москва, пр. Мира, д. 89, оф. 456',
        pickupAddress: 'БЦ "Сentral Plaza", ул. Новый Арбат, д. 15',
        distance: 5.1,
        estimatedTime: 35,
        status: 'assigned',
        assignedTime: '2024-06-25T15:00:00',
        amount: 300,
        notes: 'Важные документы. Требуется подпись получателя.'
      }
    ],
    performance: {
      onTimeRate: 96,
      averageDeliveryTime: 28,
      customerRating: 4.9,
      lastEvaluation: '2024-05-20',
      notes: 'Надежный курьер, всегда вовремя. Отлично знает город. Лидер по количеству доставок. Работает с клиентами вежливо и профессионально.'
    },
    equipment: {
      phone: true,
      thermalBag: true,
      cash: true,
      cardReader: true,
      uniform: true
    }
  },
  {
    id: 'cur-002',
    personalInfo: {
      fullName: 'Смирнова Екатерина Викторовна',
      birthDate: '1995-08-22',
      gender: 'female',
      phone: '+7 (925) 234-56-78',
      email: 'e.smirnova@courier.ru',
      address: 'г. Москва, пр. Мира, д. 89, кв. 45',
      emergencyContact: '+7 (916) 222-33-44'
    },
    workInfo: {
      vehicle: 'car',
      licensePlate: 'B456DE777',
      status: 'available',
      hireDate: '2024-02-10',
      zone: 'Северный округ',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
        hours: '09:00-18:00'
      },
      rating: 4.6,
      completedDeliveries: 320,
      totalEarnings: 245000
    },
    currentDeliveries: [
      {
        id: 'del-003',
        type: 'package',
        priority: 'medium',
        customerName: 'Козлов Дмитрий',
        customerPhone: '+7 (916) 777-66-55',
        customerAddress: 'г. Москва, ул. Пушкина, д. 15, кв. 78',
        pickupAddress: 'Склад "Логистик", ш. Энтузиастов, д. 12',
        distance: 8.5,
        estimatedTime: 45,
        status: 'assigned',
        assignedTime: '2024-06-25T15:30:00',
        amount: 600,
        notes: 'Хрупкий груз - обращаться осторожно. Габаритная посылка.'
      }
    ],
    performance: {
      onTimeRate: 92,
      averageDeliveryTime: 32,
      customerRating: 4.7,
      lastEvaluation: '2024-04-15',
      notes: 'Аккуратный водитель. Хорошо обращается с грузами. Отлично работает с крупными посылками. Клиенты отмечают бережное отношение к доставляемым товарам.'
    },
    equipment: {
      phone: true,
      thermalBag: false,
      cash: true,
      cardReader: true,
      uniform: true
    }
  },
  {
    id: 'cur-003',
    personalInfo: {
      fullName: 'Петров Михаил Сергеевич',
      birthDate: '1998-03-10',
      gender: 'male',
      phone: '+7 (916) 345-67-89',
      email: 'm.petrov@courier.ru',
      address: 'г. Москва, ул. Гагарина, д. 67, кв. 34',
      emergencyContact: '+7 (925) 333-44-55'
    },
    workInfo: {
      vehicle: 'bicycle',
      status: 'on_break',
      hireDate: '2024-03-01',
      zone: 'Центр города',
      workingHours: {
        days: ['Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        hours: '11:00-20:00'
      },
      rating: 4.5,
      completedDeliveries: 180,
      totalEarnings: 98000
    },
    currentDeliveries: [],
    performance: {
      onTimeRate: 88,
      averageDeliveryTime: 22,
      customerRating: 4.6,
      lastEvaluation: '2024-05-10',
      notes: 'Быстрый в центре города. Отлично подходит для срочных доставок в пешеходных зонах. Мобилен и маневренен в пробках.'
    },
    equipment: {
      phone: true,
      thermalBag: true,
      cash: true,
      cardReader: false,
      uniform: true
    }
  },
  {
    id: 'cur-004',
    personalInfo: {
      fullName: 'Ковалева Анна Дмитриевна',
      birthDate: '1993-11-25',
      gender: 'female',
      phone: '+7 (925) 456-78-90',
      email: 'a.kovaleva@courier.ru',
      address: 'г. Москва, ул. Ломоносова, д. 23, кв. 56',
      emergencyContact: '+7 (916) 444-55-66'
    },
    workInfo: {
      vehicle: 'foot',
      status: 'active',
      hireDate: '2023-11-20',
      zone: 'Пешеходная зона центра',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
        hours: '10:00-19:00'
      },
      rating: 4.7,
      completedDeliveries: 890,
      totalEarnings: 523000
    },
    currentDeliveries: [
      {
        id: 'del-004',
        type: 'express',
        priority: 'high',
        customerName: 'Салон "Цветы у Мэри"',
        customerPhone: '+7 (495) 234-56-78',
        customerAddress: 'г. Москва, ул. Кузнецкий Мост, д. 7',
        pickupAddress: 'Цветочный рынок, ул. Цветной бульвар, д. 15',
        distance: 1.2,
        estimatedTime: 15,
        status: 'picked_up',
        assignedTime: '2024-06-25T14:50:00',
        pickupTime: '2024-06-25T14:55:00',
        amount: 250,
        notes: 'Цветы - доставить аккуратно, не переворачивать. Срочная доставка к мероприятию.'
      }
    ],
    performance: {
      onTimeRate: 95,
      averageDeliveryTime: 18,
      customerRating: 4.8,
      lastEvaluation: '2024-04-28',
      notes: 'Идеальна для доставок в пешеходной зоне. Всегда улыбчива и вежлива. Отличные отзывы от клиентов. Знает все дворы и проходные дворы центра.'
    },
    equipment: {
      phone: true,
      thermalBag: false,
      cash: true,
      cardReader: false,
      uniform: true
    }
  },
  {
    id: 'cur-005',
    personalInfo: {
      fullName: 'Николаев Денис Олегович',
      birthDate: '1991-07-18',
      gender: 'male',
      phone: '+7 (916) 567-89-01',
      email: 'd.nikolaev@courier.ru',
      address: 'г. Москва, ул. Мира, д. 45, кв. 23',
      emergencyContact: '+7 (925) 555-66-77'
    },
    workInfo: {
      vehicle: 'car',
      licensePlate: 'C789FG777',
      status: 'busy',
      hireDate: '2023-08-12',
      zone: 'Западный округ',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        hours: '08:00-20:00'
      },
      rating: 4.9,
      completedDeliveries: 1560,
      totalEarnings: 1120000
    },
    currentDeliveries: [
      {
        id: 'del-005',
        type: 'package',
        priority: 'high',
        customerName: 'ИП Соколов',
        customerPhone: '+7 (916) 888-99-00',
        customerAddress: 'г. Москва, б-р. Генерала Карбышева, д. 12, оф. 305',
        pickupAddress: 'ТЦ "Метромолл", ул. Яблочкова, д. 21',
        distance: 6.8,
        estimatedTime: 40,
        status: 'in_transit',
        assignedTime: '2024-06-25T14:15:00',
        pickupTime: '2024-06-25T14:35:00',
        amount: 750,
        notes: 'Крупногабаритный товар. Требуется помощь при разгрузке.'
      },
      {
        id: 'del-006',
        type: 'document',
        priority: 'medium',
        customerName: 'ООО "ТехноПрофи"',
        customerPhone: '+7 (495) 345-67-89',
        customerAddress: 'г. Москва, ул. 1905 года, д. 15, оф. 201',
        pickupAddress: 'Нотариальная контора, ул. Красная Пресня, д. 8',
        distance: 4.2,
        estimatedTime: 30,
        status: 'assigned',
        assignedTime: '2024-06-25T16:00:00',
        amount: 350,
        notes: 'Юридические документы. Обязательна подпись и печать.'
      }
    ],
    performance: {
      onTimeRate: 98,
      averageDeliveryTime: 26,
      customerRating: 4.9,
      lastEvaluation: '2024-06-10',
      notes: 'Самый надежный курьер. Отлично справляется с множественными доставками. Лидер по рейтингу. Всегда на связи и оперативно решает вопросы.'
    },
    equipment: {
      phone: true,
      thermalBag: true,
      cash: true,
      cardReader: true,
      uniform: true
    }
  },
  {
    id: 'cur-006',
    personalInfo: {
      fullName: 'Федорова Ольга Игоревна',
      birthDate: '1994-12-03',
      gender: 'female',
      phone: '+7 (916) 678-90-12',
      email: 'o.fedorova@courier.ru',
      address: 'г. Москва, ул. Чехова, д. 8, кв. 67',
      emergencyContact: '+7 (925) 666-77-88'
    },
    workInfo: {
      vehicle: 'motorcycle',
      licensePlate: 'D012GH777',
      status: 'available',
      hireDate: '2024-01-20',
      zone: 'Южный округ',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        hours: '09:00-21:00'
      },
      rating: 4.7,
      completedDeliveries: 420,
      totalEarnings: 287000
    },
    currentDeliveries: [
      {
        id: 'del-007',
        type: 'food',
        priority: 'medium',
        customerName: 'Сидоров Павел',
        customerPhone: '+7 (916) 123-45-99',
        customerAddress: 'г. Москва, ул. Дмитрия Ульянова, д. 34, кв. 12',
        pickupAddress: 'Кафе "Вкусный уголок", ул. Вавилова, д. 15',
        distance: 3.5,
        estimatedTime: 20,
        status: 'assigned',
        assignedTime: '2024-06-25T16:30:00',
        amount: 320
      }
    ],
    performance: {
      onTimeRate: 94,
      averageDeliveryTime: 24,
      customerRating: 4.8,
      lastEvaluation: '2024-05-15',
      notes: 'Очень внимательна к деталям. Отлично справляется с доставками еды. Всегда проверяет целостность упаковки.'
    },
    equipment: {
      phone: true,
      thermalBag: true,
      cash: true,
      cardReader: true,
      uniform: true
    }
  }
];

// Компонент карточки курьера
interface CourierCardProps {
  courier: Courier;
  onClick?: () => void;
  delay?: number;
}

const CourierCard: React.FC<CourierCardProps> = ({ courier, onClick, delay = 0 }) => {
  const activeDeliveries = courier.currentDeliveries.filter(delivery => 
    delivery.status === 'assigned' || delivery.status === 'picked_up' || delivery.status === 'in_transit'
  ).length;

  return (
    <BentoCard 
      className="p-5" 
      glowColor={getStatusColor(courier.workInfo.status)} 
      onClick={onClick}
      delay={delay}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{courier.personalInfo.fullName}</h4>
          <p className="text-slate-400 text-sm flex items-center gap-1">
            <span>{getVehicleIcon(courier.workInfo.vehicle)}</span>
            <span>•</span>
            <span className="line-clamp-1">{courier.workInfo.zone}</span>
          </p>
        </div>
        <StatusBadge status={courier.workInfo.status} animated={courier.workInfo.status === 'on_delivery'} />
      </div>
      
      <div className="space-y-3 text-sm mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Транспорт:</span>
          <StatusBadge status={courier.workInfo.vehicle} size="sm" />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Доставок выполнено:</span>
          <span className="text-white font-medium">{courier.workInfo.completedDeliveries.toLocaleString('ru-RU')}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Рейтинг:</span>
          <div className="flex items-center space-x-1">
            <span className="text-amber-500">★</span>
            <span className="text-white font-medium">{courier.workInfo.rating}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Вовремя:</span>
          <span className="text-white font-medium">{courier.performance.onTimeRate}%</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <div className="text-xs text-slate-400">
          {activeDeliveries} активных доставок
        </div>
        <div className="text-xs font-semibold text-emerald-500">
          {formatCurrency(courier.workInfo.totalEarnings)}
        </div>
      </div>
    </BentoCard>
  );
};

// Компонент карточки доставки
interface DeliveryCardProps {
  delivery: Delivery;
  onClick?: () => void;
  delay?: number;
  compact?: boolean;
}

const DeliveryCard: React.FC<DeliveryCardProps> = ({ delivery, onClick, delay = 0, compact = false }) => {
  if (compact) {
    return (
      <BentoCard 
        className="p-3" 
        glowColor={getStatusColor(delivery.status)} 
        onClick={onClick}
        delay={delay}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-xl">{getDeliveryTypeIcon(delivery.type)}</div>
            <div className="min-w-0">
              <h5 className="text-white font-medium text-sm truncate">{delivery.customerName}</h5>
              <p className="text-slate-400 text-xs truncate">{delivery.customerAddress}</p>
            </div>
          </div>
          <StatusBadge status={delivery.status} size="sm" animated={delivery.status === 'in_transit'} />
        </div>
      </BentoCard>
    );
  }

  return (
    <BentoCard 
      className="p-4" 
      glowColor={getStatusColor(delivery.status)} 
      onClick={onClick}
      delay={delay}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <h5 className="text-white font-semibold text-sm mb-1 line-clamp-2">{delivery.customerName}</h5>
          <p className="text-slate-400 text-xs line-clamp-2">{delivery.customerAddress}</p>
        </div>
        <div className="flex flex-col items-end space-y-1 shrink-0">
          <StatusBadge status={delivery.status} animated={delivery.status === 'in_transit'} />
          <div className="flex items-center space-x-1">
            <span className="text-lg">{getDeliveryTypeIcon(delivery.type)}</span>
            <StatusBadge status={delivery.type} size="sm" />
          </div>
        </div>
      </div>
      
      <div className="space-y-2 text-xs mb-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Расстояние:</span>
          <span className="text-white">{delivery.distance} км</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Время доставки:</span>
          <span className="text-white">{delivery.estimatedTime} мин</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Сумма:</span>
          <span className="text-white font-semibold">{formatCurrency(delivery.amount)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Приоритет:</span>
          <StatusBadge status={delivery.priority} size="sm" />
        </div>
      </div>
    </BentoCard>
  );
};

// Основной компонент дашборда курьеров
const CourierManagementDashboard: React.FC = () => {
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'couriers' | 'deliveries' | 'analytics'>('overview');
  const [filterVehicle, setFilterVehicle] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Статистика для дашборда
  const stats = useMemo(() => {
    const totalCouriers = couriers.length;
    const activeCouriers = couriers.filter(courier => 
      courier.workInfo.status === 'active' || 
      courier.workInfo.status === 'available' || 
      courier.workInfo.status === 'on_delivery'
    ).length;
    const totalDeliveries = couriers.reduce((accumulator, courier) => 
      accumulator + courier.workInfo.completedDeliveries, 0
    );
    const activeDeliveries = couriers.flatMap(courier => courier.currentDeliveries).filter(delivery => 
      delivery.status === 'assigned' || 
      delivery.status === 'picked_up' || 
      delivery.status === 'in_transit'
    ).length;
    const totalRevenue = couriers.reduce((accumulator, courier) => 
      accumulator + courier.workInfo.totalEarnings, 0
    );
    const vehicles = [...new Set(couriers.map(courier => courier.workInfo.vehicle))];
    
    return {
      totalCouriers,
      activeCouriers,
      totalDeliveries,
      activeDeliveries,
      totalRevenue,
      vehicles
    };
  }, []);

  // Фильтрация данных
  const filteredCouriers = useMemo(() => {
    return couriers.filter(courier => {
      const vehicleMatch = filterVehicle === 'all' || courier.workInfo.vehicle === filterVehicle;
      const statusMatch = filterStatus === 'all' || courier.workInfo.status === filterStatus;
      const searchMatch = searchQuery === '' || 
        courier.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        courier.workInfo.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        courier.personalInfo.phone.includes(searchQuery);
      return vehicleMatch && statusMatch && searchMatch;
    });
  }, [filterVehicle, filterStatus, searchQuery]);

  const allDeliveries = useMemo(() => 
    couriers.flatMap(courier => courier.currentDeliveries), 
  []);

  const activeDeliveries = useMemo(() => 
    allDeliveries.filter(delivery => 
      delivery.status === 'assigned' || 
      delivery.status === 'picked_up' || 
      delivery.status === 'in_transit'
    ),
  [allDeliveries]);

  const handleTabChange = useCallback((tab: 'overview' | 'couriers' | 'deliveries' | 'analytics') => {
    setActiveTab(tab);
    setSearchQuery('');
  }, []);

  const handleRefreshData = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-4 lg:p-6">
      {/* CSS для кастомного скроллбара */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>

      {/* Хедер */}
      <motion.header 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
              Управление курьерами
            </h1>
            <p className="text-slate-400 text-lg">Мониторинг и координация службы доставки</p>
          </div>
          <div className="mt-4 lg:mt-0 flex flex-wrap gap-2">
            <motion.button 
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>+</span>
              <span>Новый курьер</span>
            </motion.button>
            <motion.button 
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>+</span>
              <span>Новая доставка</span>
            </motion.button>
            <motion.button 
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefreshData}
              disabled={isLoading}
            >
              <span>🔄</span>
              <span>{isLoading ? 'Обновление...' : 'Обновить'}</span>
            </motion.button>
          </div>
        </div>

        {/* Навигация */}
        <nav className="flex space-x-1 p-1 bg-slate-800/50 rounded-2xl backdrop-blur-xl border border-slate-700/50 mb-4 overflow-x-auto custom-scrollbar">
          {[
            { id: 'overview', label: 'Обзор', icon: '📊' },
            { id: 'couriers', label: 'Курьеры', icon: '🚴' },
            { id: 'deliveries', label: 'Доставки', icon: '📦' },
            { id: 'analytics', label: 'Аналитика', icon: '📈' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white shadow-lg shadow-black/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* Фильтры и поиск */}
        {(activeTab === 'couriers' || activeTab === 'deliveries') && (
          <motion.div 
            className="flex flex-col md:flex-row gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-1 flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 text-sm whitespace-nowrap">Транспорт:</span>
                <select 
                  value={filterVehicle}
                  onChange={(event) => setFilterVehicle(event.target.value)}
                  className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                >
                  <option value="all">Все типы</option>
                  <option value="car">Автомобиль</option>
                  <option value="motorcycle">Мотоцикл</option>
                  <option value="bicycle">Велосипед</option>
                  <option value="foot">Пеший</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 text-sm whitespace-nowrap">Статус:</span>
                <select 
                  value={filterStatus}
                  onChange={(event) => setFilterStatus(event.target.value)}
                  className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
                >
                  <option value="all">Все статусы</option>
                  <option value="active">Активен</option>
                  <option value="available">Доступен</option>
                  <option value="on_delivery">На доставке</option>
                  <option value="on_break">На перерыве</option>
                  <option value="busy">Занят</option>
                  <option value="inactive">Неактивен</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск по имени, зоне или телефону..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1.5 pl-9 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                  🔍
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Основной контент */}
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
              {/* Статистика */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  title="Всего курьеров"
                  value={stats.totalCouriers}
                  change={8.2}
                  icon="🚴"
                  color={COURIER_COLORS.active}
                  subtitle={`${stats.activeCouriers} активных`}
                  trend="up"
                  loading={isLoading}
                />
                <StatCard
                  title="Выполнено доставок"
                  value={stats.totalDeliveries.toLocaleString('ru-RU')}
                  change={15.7}
                  icon="📦"
                  color={COURIER_COLORS.package}
                  subtitle="за все время"
                  trend="up"
                  loading={isLoading}
                />
                <StatCard
                  title="Активные доставки"
                  value={stats.activeDeliveries}
                  change={-3.1}
                  icon="⚡"
                  color={COURIER_COLORS.express}
                  subtitle="прямо сейчас"
                  trend="down"
                  loading={isLoading}
                />
                <StatCard
                  title="Общий доход"
                  value={formatCurrency(stats.totalRevenue)}
                  change={12.5}
                  icon="💰"
                  color={COURIER_COLORS.food}
                  subtitle="зарплаты курьеров"
                  trend="up"
                  loading={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Активные курьеры */}
                <BentoCard className="p-6" glowColor={COURIER_COLORS.active}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Лучшие курьеры</h3>
                    <button className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
                      Все →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {couriers
                      .filter(courier => courier.workInfo.status === 'active' || courier.workInfo.status === 'on_delivery')
                      .sort((firstCourier, secondCourier) => secondCourier.workInfo.rating - firstCourier.workInfo.rating)
                      .slice(0, 3)
                      .map((courier, index) => (
                      <motion.div 
                        key={courier.id}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                        onClick={() => setSelectedCourier(courier)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                          {courier.personalInfo.fullName.split(' ').map(name => name[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm truncate">{courier.personalInfo.fullName}</h4>
                          <p className="text-slate-400 text-xs flex items-center gap-1">
                            <span>{getVehicleIcon(courier.workInfo.vehicle)}</span>
                            <span>•</span>
                            <span className="truncate">{courier.workInfo.zone}</span>
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-amber-500">★</span>
                          <span className="text-white text-sm font-medium">{courier.workInfo.rating}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </BentoCard>

                {/* Активные доставки */}
                <BentoCard className="p-6" glowColor={COURIER_COLORS.on_delivery}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Активные доставки</h3>
                    <button className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
                      Все →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {activeDeliveries
                      .slice(0, 3)
                      .map((delivery, index) => (
                      <motion.div 
                        key={delivery.id}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                        onClick={() => setSelectedDelivery(delivery)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                          delivery.priority === 'high' ? 'bg-gradient-to-br from-red-500 to-pink-500' :
                          delivery.priority === 'medium' ? 'bg-gradient-to-br from-orange-500 to-amber-500' :
                          'bg-gradient-to-br from-green-500 to-emerald-500'
                        }`}>
                          {getDeliveryTypeIcon(delivery.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm line-clamp-2">{delivery.customerName}</h4>
                          <p className="text-slate-400 text-xs">
                            {delivery.distance} км • {delivery.estimatedTime} мин
                          </p>
                        </div>
                        <StatusBadge status={delivery.status} />
                      </motion.div>
                    ))}
                  </div>
                </BentoCard>
              </div>

              {/* Распределение по транспорту */}
              <BentoCard className="p-6" glowColor={COURIER_COLORS.standard}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Распределение по транспорту</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.vehicles.map((vehicle, index) => {
                    const vehicleCouriers = couriers.filter(courier => courier.workInfo.vehicle === vehicle);
                    const activeVehicleCouriers = vehicleCouriers.filter(courier => 
                      courier.workInfo.status === 'active' || 
                      courier.workInfo.status === 'on_delivery' || 
                      courier.workInfo.status === 'available'
                    );
                    
                    return (
                      <motion.div 
                        key={vehicle} 
                        className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          setFilterVehicle(vehicle);
                          setActiveTab('couriers');
                        }}
                      >
                        <div className="text-2xl mb-2">{getVehicleIcon(vehicle)}</div>
                        <h4 className="text-white font-medium text-sm capitalize mb-1">{vehicle}</h4>
                        <p className="text-slate-400 text-xs">
                          {activeVehicleCouriers.length}/{vehicleCouriers.length} активных
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </BentoCard>
            </motion.div>
          )}

          {activeTab === 'couriers' && (
            <motion.div
              key="couriers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Курьеры</h2>
                <p className="text-slate-400">Управление курьерами и их активностью</p>
              </div>
              
              {filteredCouriers.length === 0 ? (
                <BentoCard className="p-12 text-center">
                  <div className="text-6xl mb-4">🚴</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Курьеры не найдены</h3>
                  <p className="text-slate-400">Попробуйте изменить параметры фильтрации или поиска</p>
                </BentoCard>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredCouriers.map((courier, index) => (
                    <CourierCard 
                      key={courier.id} 
                      courier={courier} 
                      onClick={() => setSelectedCourier(courier)}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'deliveries' && (
            <motion.div
              key="deliveries"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Активные доставки</h2>
                <p className="text-slate-400">Управление доставками и их статусами</p>
              </div>
              
              {activeDeliveries.length === 0 ? (
                <BentoCard className="p-12 text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Активных доставок нет</h3>
                  <p className="text-slate-400">Все доставки завершены или ожидают назначения</p>
                </BentoCard>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeDeliveries.map((delivery, index) => (
                    <DeliveryCard 
                      key={delivery.id} 
                      delivery={delivery} 
                      onClick={() => setSelectedDelivery(delivery)}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Аналитика эффективности</h2>
                <p className="text-slate-400">Мониторинг производительности курьерской службы</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Рейтинги курьеров */}
                <BentoCard className="p-6" glowColor={COURIER_COLORS.active}>
                  <h3 className="text-xl font-bold text-white mb-6">Рейтинги курьеров</h3>
                  <div className="space-y-4">
                    {couriers
                      .sort((firstCourier, secondCourier) => secondCourier.workInfo.rating - firstCourier.workInfo.rating)
                      .map((courier, index) => (
                      <motion.div 
                        key={courier.id}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                        onClick={() => setSelectedCourier(courier)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                          {courier.personalInfo.fullName.split(' ').map(name => name[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm truncate">{courier.personalInfo.fullName}</h4>
                          <p className="text-slate-400 text-xs">
                            {courier.workInfo.completedDeliveries.toLocaleString('ru-RU')} доставок
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-amber-500">★</span>
                          <span className="text-white text-sm font-medium">{courier.workInfo.rating}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </BentoCard>

                {/* Ключевые показатели */}
                <BentoCard className="p-6" glowColor={COURIER_COLORS.package}>
                  <h3 className="text-xl font-bold text-white mb-6">Ключевые показатели</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm text-slate-300 mb-2">
                        <span>Средний рейтинг</span>
                        <span className="font-semibold">
                          {(couriers.reduce((accumulator, courier) => accumulator + courier.workInfo.rating, 0) / couriers.length).toFixed(1)}/5
                        </span>
                      </div>
                      <ProgressBar 
                        value={(couriers.reduce((accumulator, courier) => accumulator + courier.workInfo.rating, 0) / couriers.length) * 20} 
                        color={COURIER_COLORS.active}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-slate-300 mb-2">
                        <span>Доставки вовремя</span>
                        <span className="font-semibold">
                          {(couriers.reduce((accumulator, courier) => accumulator + courier.performance.onTimeRate, 0) / couriers.length).toFixed(1)}%
                        </span>
                      </div>
                      <ProgressBar 
                        value={couriers.reduce((accumulator, courier) => accumulator + courier.performance.onTimeRate, 0) / couriers.length} 
                        color={COURIER_COLORS.standard}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-slate-300 mb-2">
                        <span>Среднее время доставки</span>
                        <span className="font-semibold">
                          {(couriers.reduce((accumulator, courier) => accumulator + courier.performance.averageDeliveryTime, 0) / couriers.length).toFixed(0)} мин
                        </span>
                      </div>
                      <ProgressBar 
                        value={(couriers.reduce((accumulator, courier) => accumulator + courier.performance.averageDeliveryTime, 0) / couriers.length) / 60 * 100} 
                        color={COURIER_COLORS.express}
                      />
                    </div>
                  </div>
                </BentoCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Модальные окна */}
      <Modal 
        isOpen={!!selectedCourier} 
        onClose={() => setSelectedCourier(null)}
        title={selectedCourier?.personalInfo.fullName}
        size="xl"
      >
        {selectedCourier && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COURIER_COLORS.active}>
                <h4 className="text-lg font-semibold text-white mb-4">Персональная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дата рождения:</span>
                    <span className="text-white">{formatDate(selectedCourier.personalInfo.birthDate)} ({calculateAge(selectedCourier.personalInfo.birthDate)} лет)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Телефон:</span>
                    <span className="text-white">{selectedCourier.personalInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white">{selectedCourier.personalInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Экстренный контакт:</span>
                    <span className="text-white">{selectedCourier.personalInfo.emergencyContact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Адрес:</span>
                    <span className="text-white text-right">{selectedCourier.personalInfo.address}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COURIER_COLORS.on_delivery}>
                <h4 className="text-lg font-semibold text-white mb-4">Рабочая информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Транспорт:</span>
                    <StatusBadge status={selectedCourier.workInfo.vehicle} />
                  </div>
                  {selectedCourier.workInfo.licensePlate && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Номерной знак:</span>
                      <span className="text-white">{selectedCourier.workInfo.licensePlate}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedCourier.workInfo.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Зона работы:</span>
                    <span className="text-white">{selectedCourier.workInfo.zone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Работает с:</span>
                    <span className="text-white">{formatDate(selectedCourier.workInfo.hireDate)}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COURIER_COLORS.standard}>
                <h4 className="text-lg font-semibold text-white mb-4">Оборудование</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(selectedCourier.equipment).map(([item, available]) => (
                    <div key={item} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <span className="text-slate-300 text-sm capitalize">{item}:</span>
                      <div className={`w-3 h-3 rounded-full ${available ? 'bg-green-500' : 'bg-red-500'}`} />
                    </div>
                  ))}
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COURIER_COLORS.package}>
                <h4 className="text-lg font-semibold text-white mb-4">Производительность</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Рейтинг:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-amber-500">★</span>
                      <span className="text-white font-semibold">{selectedCourier.workInfo.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Выполнено доставок:</span>
                    <span className="text-white">{selectedCourier.workInfo.completedDeliveries.toLocaleString('ru-RU')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Доставки вовремя:</span>
                    <span className="text-white">{selectedCourier.performance.onTimeRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Среднее время доставки:</span>
                    <span className="text-white">{selectedCourier.performance.averageDeliveryTime} мин</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Общий заработок:</span>
                    <span className="text-white font-semibold">{formatCurrency(selectedCourier.workInfo.totalEarnings)}</span>
                  </div>
                </div>
              </BentoCard>
            </div>

            <BentoCard className="p-6" glowColor={COURIER_COLORS.express}>
              <h4 className="text-lg font-semibold text-white mb-4">Текущие доставки</h4>
              {selectedCourier.currentDeliveries.filter(delivery => 
                delivery.status === 'assigned' || 
                delivery.status === 'picked_up' || 
                delivery.status === 'in_transit'
              ).length === 0 ? (
                <p className="text-slate-400 text-center py-4">Нет активных доставок</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCourier.currentDeliveries
                    .filter(delivery => 
                      delivery.status === 'assigned' || 
                      delivery.status === 'picked_up' || 
                      delivery.status === 'in_transit'
                    )
                    .map((delivery) => (
                    <DeliveryCard 
                      key={delivery.id} 
                      delivery={delivery} 
                      onClick={() => setSelectedDelivery(delivery)}
                    />
                  ))}
                </div>
              )}
            </BentoCard>

            {selectedCourier.performance.notes && (
              <BentoCard className="p-6" glowColor={COURIER_COLORS.food}>
                <h4 className="text-lg font-semibold text-white mb-4">Примечания менеджера</h4>
                <p className="text-slate-300 text-sm">{selectedCourier.performance.notes}</p>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!selectedDelivery} 
        onClose={() => setSelectedDelivery(null)}
        title="Информация о доставке"
        size="lg"
      >
        {selectedDelivery && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COURIER_COLORS.active}>
                <h4 className="text-lg font-semibold text-white mb-4">Информация о клиенте</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Клиент:</span>
                    <span className="text-white">{selectedDelivery.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Телефон:</span>
                    <span className="text-white">{selectedDelivery.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Адрес доставки:</span>
                    <span className="text-white text-right">{selectedDelivery.customerAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип доставки:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getDeliveryTypeIcon(selectedDelivery.type)}</span>
                      <StatusBadge status={selectedDelivery.type} />
                    </div>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COURIER_COLORS.on_delivery}>
                <h4 className="text-lg font-semibold text-white mb-4">Детали доставки</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Адрес забора:</span>
                    <span className="text-white text-right">{selectedDelivery.pickupAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Расстояние:</span>
                    <span className="text-white">{selectedDelivery.distance} км</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Примерное время:</span>
                    <span className="text-white">{selectedDelivery.estimatedTime} мин</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedDelivery.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Приоритет:</span>
                    <StatusBadge status={selectedDelivery.priority} />
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COURIER_COLORS.package}>
                <h4 className="text-lg font-semibold text-white mb-4">Временные метки</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Назначена:</span>
                    <span className="text-white">{formatDateTime(selectedDelivery.assignedTime)}</span>
                  </div>
                  {selectedDelivery.pickupTime && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Забрана:</span>
                      <span className="text-white">{formatDateTime(selectedDelivery.pickupTime)}</span>
                    </div>
                  )}
                  {selectedDelivery.deliveryTime && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Доставлена:</span>
                      <span className="text-white">{formatDateTime(selectedDelivery.deliveryTime)}</span>
                    </div>
                  )}
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COURIER_COLORS.food}>
                <h4 className="text-lg font-semibold text-white mb-4">Финансовая информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Стоимость доставки:</span>
                    <span className="text-white font-semibold">{formatCurrency(selectedDelivery.amount)}</span>
                  </div>
                </div>
              </BentoCard>
            </div>

            {selectedDelivery.notes && (
              <BentoCard className="p-6" glowColor={COURIER_COLORS.document}>
                <h4 className="text-lg font-semibold text-white mb-4">Дополнительные заметки</h4>
                <p className="text-slate-300 text-sm">{selectedDelivery.notes}</p>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CourierManagementDashboard;