'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Константы
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

const SPECIALIST_COLORS = {
  active: '34, 197, 94',
  inactive: '100, 116, 139',
  busy: '239, 68, 68',
  available: '59, 130, 246',
  on_break: '245, 158, 11',
  vacation: '147, 51, 234',
  beauty: '244, 63, 94',
  wellness: '16, 185, 129',
  education: '59, 130, 246',
  repair: '249, 115, 22',
  cleaning: '34, 211, 238',
  consulting: '99, 102, 241',
  high: '239, 68, 68',
  medium: '245, 158, 11',
  low: '34, 197, 94'
} as const;

// Типы данных
interface WorkingHours {
  days: string[];
  hours: string;
  timezone: string;
}

interface PersonalInfo {
  fullName: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  address: string;
  education: string;
  experience: number;
  certification: string;
  certificationExpiry: string;
  avatar?: string;
  description?: string;
}

interface ProfessionalInfo {
  serviceType: 'beauty' | 'wellness' | 'education' | 'repair' | 'cleaning' | 'consulting' | 'fitness' | 'medical' | 'legal' | 'it';
  specialization: 'hairdresser' | 'masseur' | 'tutor' | 'technician' | 'cleaner' | 'consultant' | 'trainer' | 'nurse' | 'lawyer' | 'programmer' | 'cosmetologist' | 'nutritionist' | 'dentist' | 'psychologist' | 'coach';
  department: string;
  position: string;
  qualifications: string[];
  skills: string[];
  languages: { language: string; level: 'native' | 'fluent' | 'intermediate' | 'basic' }[];
  status: 'active' | 'inactive' | 'busy' | 'available' | 'on_break' | 'vacation' | 'training';
  hireDate: string;
  office: string;
  workingHours: WorkingHours;
  hourlyRate: number;
  services: string[];
  equipment?: string[];
}

interface Performance {
  rating: number;
  clientsServed: number;
  satisfactionRate: number;
  efficiency: number;
  averageSessionTime: number;
  lastEvaluation: string;
  notes?: string;
  achievements?: string[];
  improvementAreas?: string[];
}

interface Financial {
  salary?: number;
  totalEarnings: number;
  commission: number;
  taxInfo: string;
  bonuses: number;
  lastRaiseDate?: string;
  nextEvaluationDate?: string;
}

interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceType: string;
  serviceDescription: string;
  duration: number;
  cost: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'confirmed';
  priority: 'high' | 'medium' | 'low';
  scheduledDate: string;
  startTime: string;
  endTime?: string;
  location: string;
  notes?: string;
  specialRequirements?: string;
  clientNotes?: string;
  specialistId: string;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'partially_paid';
  reminderSent: boolean;
}

interface Specialist {
  id: string;
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
  currentAppointments: Appointment[];
  performance: Performance;
  financial: Financial;
  metadata: {
    createdAt: string;
    updatedAt: string;
    lastActive: string;
    tags: string[];
  };
}

// Утилиты
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatTime = (timeString: string): string => {
  return new Date(timeString).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDateTime = (dateTimeString: string): string => {
  return new Date(dateTimeString).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
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
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

const getDaysUntil = (dateString: string): number => {
  const today = new Date();
  const targetDate = new Date(dateString);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getServiceTypeIcon = (serviceType: string): string => {
  const icons: { [key: string]: string } = {
    beauty: '💅',
    wellness: '🧘‍♀️',
    education: '🎓',
    repair: '🔧',
    cleaning: '🧹',
    consulting: '💼',
    fitness: '💪',
    medical: '🏥',
    legal: '⚖️',
    it: '💻'
  };
  return icons[serviceType] || '👨‍💼';
};

const getSpecializationIcon = (specialization: string): string => {
  const icons: { [key: string]: string } = {
    hairdresser: '💇‍♀️',
    masseur: '💆‍♂️',
    tutor: '📚',
    technician: '🔧',
    cleaner: '🧹',
    consultant: '💼',
    trainer: '💪',
    nurse: '🩺',
    lawyer: '⚖️',
    programmer: '💻',
    cosmetologist: '✨',
    nutritionist: '🥗',
    dentist: '🦷',
    psychologist: '🧠',
    coach: '🏆'
  };
  return icons[specialization] || '👨‍💼';
};

const getInitials = (fullName: string): string => {
  return fullName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
};

const generateColorFromName = (name: string): string => {
  const colors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-blue-500',
    'from-teal-500 to-green-500',
    'from-rose-500 to-red-500',
    'from-amber-500 to-orange-500'
  ];
  const index = name.length % colors.length;
  return colors[index];
};

// Базовые компоненты UI
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'md',
  closeOnOverlayClick = true
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
    full: 'max-w-full mx-4'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      {closeOnOverlayClick && (
        <div 
          className="fixed inset-0" 
          onClick={onClose}
        />
      )}
      <motion.div
        className={`relative bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50 rounded-3xl shadow-2xl w-full ${sizeClasses[size]} max-h-[95vh] overflow-hidden z-10`}
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
                aria-label="Закрыть"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    initial={animated ? { opacity: 0, y: 20 } : false}
    animate={animated ? { opacity: 1, y: 0 } : false}
    transition={{ duration: 0.6, delay }}
    whileHover={hoverable ? { y: -4, scale: 1.02 } : {}}
    whileTap={onClick ? { scale: 0.98 } : {}}
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
  type?: 'default' | 'client' | 'service' | 'booking' | 'provider' | 'payment';
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
    const configs: { [key: string]: { color: string; label: string; bg: string; border: string } } = {
      active: { color: COLORS.success, label: 'Активен', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      inactive: { color: COLORS.slate, label: 'Неактивен', bg: 'bg-slate-500/15', border: 'border-slate-500/30' },
      busy: { color: COLORS.error, label: 'Занят', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      available: { color: COLORS.blue, label: 'Доступен', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      on_break: { color: COLORS.orange, label: 'На перерыве', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      vacation: { color: COLORS.purple, label: 'Отпуск', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
      training: { color: COLORS.cyan, label: 'Обучение', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' },
      scheduled: { color: COLORS.teal, label: 'Запланирован', bg: 'bg-teal-500/15', border: 'border-teal-500/30' },
      in_progress: { color: COLORS.blue, label: 'В процессе', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      completed: { color: COLORS.success, label: 'Завершен', bg: 'bg-green-500/15', border: 'border-green-500/30' },
      cancelled: { color: COLORS.error, label: 'Отменен', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      confirmed: { color: COLORS.emerald, label: 'Подтвержден', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      beauty: { color: SPECIALIST_COLORS.beauty, label: 'Красота', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
      wellness: { color: SPECIALIST_COLORS.wellness, label: 'Здоровье', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      education: { color: SPECIALIST_COLORS.education, label: 'Образование', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      repair: { color: SPECIALIST_COLORS.repair, label: 'Ремонт', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      cleaning: { color: SPECIALIST_COLORS.cleaning, label: 'Уборка', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' },
      consulting: { color: SPECIALIST_COLORS.consulting, label: 'Консультации', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' },
      fitness: { color: SPECIALIST_COLORS.wellness, label: 'Фитнес', bg: 'bg-green-500/15', border: 'border-green-500/30' },
      medical: { color: SPECIALIST_COLORS.wellness, label: 'Медицина', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      legal: { color: SPECIALIST_COLORS.consulting, label: 'Юриспруденция', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
      it: { color: SPECIALIST_COLORS.consulting, label: 'IT', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      pending: { color: COLORS.orange, label: 'Ожидание', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      paid: { color: COLORS.success, label: 'Оплачено', bg: 'bg-green-500/15', border: 'border-green-500/30' },
      refunded: { color: COLORS.error, label: 'Возврат', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      partially_paid: { color: COLORS.warning, label: 'Частично', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' },
      high: { color: SPECIALIST_COLORS.high, label: 'Высокий', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      medium: { color: SPECIALIST_COLORS.medium, label: 'Средний', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      low: { color: SPECIALIST_COLORS.low, label: 'Низкий', bg: 'bg-green-500/15', border: 'border-green-500/30' }
    };

    return configs[status] || { color: COLORS.slate, label: status, bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
  };

  const config = getStatusConfig();
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm'
  };

  return (
    <motion.span 
      className={`inline-flex items-center rounded-full font-medium border backdrop-blur-sm ${config.bg} ${config.border} ${sizeClasses[size]}`}
      style={{ color: `rgb(${config.color})` }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
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
          initial={animated ? { width: 0 } : false}
          animate={animated ? { width: `${percentage}%` } : false}
          transition={{ duration: 1.5, ease: "easeOut" }}
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
  delay?: number;
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
  delay = 0
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

// Расширенные моки данных для специалистов
const specialists: Specialist[] = [
  {
    id: 'spec-001',
    personalInfo: {
      fullName: 'Петрова Анна Сергеевна',
      birthDate: '1990-05-15',
      gender: 'female',
      phone: '+7 (916) 123-45-67',
      email: 'a.petrova@beauty.ru',
      address: 'г. Москва, ул. Ленина, д. 25, кв. 12',
      education: 'Высшее, Московский колледж красоты',
      experience: 8,
      certification: 'BEAUTY-001234',
      certificationExpiry: '2025-12-31',
      description: 'Сертифицированный косметолог с 8-летним опытом работы. Специализируется на аппаратной косметологии и уходовых процедурах.'
    },
    professionalInfo: {
      serviceType: 'beauty',
      specialization: 'cosmetologist',
      department: 'Косметология',
      position: 'Старший косметолог',
      qualifications: [
        'Эстетическая косметология',
        'Аппаратные методики',
        'Уходовые процедуры',
        'Инъекционная косметология'
      ],
      skills: [
        'Чистка лица',
        'Пилинги',
        'Массаж лица',
        'Инъекции',
        'Аппаратные процедуры',
        'Подбор уходовой косметики'
      ],
      languages: [
        { language: 'Русский', level: 'native' },
        { language: 'Английский', level: 'fluent' }
      ],
      status: 'busy',
      hireDate: '2019-03-10',
      office: 'Кабинет 101',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        hours: '10:00-19:00',
        timezone: 'Europe/Moscow'
      },
      hourlyRate: 2500,
      services: [
        'Комплексный уход за лицом',
        'Чистка лица',
        'Пилинги',
        'Массаж лица',
        'Консультация по уходу'
      ],
      equipment: ['Аппарат для чистки лица', 'Лампа для диагностики', 'Стерилизатор']
    },
    currentAppointments: [
      {
        id: 'app-001',
        clientName: 'Иванова Мария',
        clientPhone: '+7 (916) 999-88-77',
        clientEmail: 'maria.ivanova@mail.ru',
        serviceType: 'beauty',
        serviceDescription: 'Комплексный уход за лицом с пилингом',
        duration: 90,
        cost: 4500,
        status: 'in_progress',
        priority: 'high',
        scheduledDate: '2024-06-25',
        startTime: '2024-06-25T14:00:00',
        endTime: '2024-06-25T15:30:00',
        location: 'Кабинет 101',
        notes: 'Клиент с чувствительной кожей, требуется осторожность при проведении пилинга',
        specialRequirements: 'Использовать гипоаллергенные средства',
        specialistId: 'spec-001',
        paymentStatus: 'paid',
        reminderSent: true
      },
      {
        id: 'app-002',
        clientName: 'Смирнова Ольга',
        clientPhone: '+7 (916) 888-77-66',
        clientEmail: 'olga.smirnova@gmail.com',
        serviceType: 'beauty',
        serviceDescription: 'Чистка лица и массаж',
        duration: 60,
        cost: 3000,
        status: 'scheduled',
        priority: 'medium',
        scheduledDate: '2024-06-25',
        startTime: '2024-06-25T16:00:00',
        endTime: '2024-06-25T17:00:00',
        location: 'Кабинет 101',
        specialistId: 'spec-001',
        paymentStatus: 'pending',
        reminderSent: true
      }
    ],
    performance: {
      rating: 4.9,
      clientsServed: 1240,
      satisfactionRate: 98,
      efficiency: 95,
      averageSessionTime: 75,
      lastEvaluation: '2024-05-20',
      notes: 'Высококвалифицированный специалист. Клиенты довольны результатами. Отличные навыки работы с клиентами.',
      achievements: [
        'Специалист месяца - Март 2024',
        'Лучшие отзывы - 2023 год',
        'Рекорд по клиентам - 2022 год'
      ],
      improvementAreas: [
        'Освоение новых аппаратных методик',
        'Повышение квалификации в области anti-age технологий'
      ]
    },
    financial: {
      salary: 80000,
      totalEarnings: 2850000,
      commission: 15,
      taxInfo: 'НДФЛ 13%',
      bonuses: 45000,
      lastRaiseDate: '2024-01-15',
      nextEvaluationDate: '2024-07-15'
    },
    metadata: {
      createdAt: '2019-03-10T00:00:00',
      updatedAt: '2024-06-25T10:30:00',
      lastActive: '2024-06-25T14:30:00',
      tags: ['косметолог', 'старший специалист', 'инъекции', 'аппаратная косметология']
    }
  },
  {
    id: 'spec-002',
    personalInfo: {
      fullName: 'Сидоров Алексей Викторович',
      birthDate: '1985-08-22',
      gender: 'male',
      phone: '+7 (925) 234-56-78',
      email: 'a.sidorov@wellness.ru',
      address: 'г. Москва, пр. Мира, д. 89, кв. 45',
      education: 'Высшее, Институт физической культуры',
      experience: 12,
      certification: 'WELL-002345',
      certificationExpiry: '2024-11-30',
      description: 'Опытный массажист с медицинским образованием. Специализируется на лечебном и спортивном массаже.'
    },
    professionalInfo: {
      serviceType: 'wellness',
      specialization: 'masseur',
      department: 'Массаж и релакс',
      position: 'Массажист',
      qualifications: [
        'Лечебный массаж',
        'Спортивный массаж',
        'Релаксационные техники',
        'Медицинская реабилитация'
      ],
      skills: [
        'Классический массаж',
        'Тайский массаж',
        'Лимфодренаж',
        'Ароматерапия',
        'Работа с триггерными точками'
      ],
      languages: [
        { language: 'Русский', level: 'native' },
        { language: 'Французский', level: 'intermediate' }
      ],
      status: 'available',
      hireDate: '2018-07-15',
      office: 'Кабинет 205',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
        hours: '09:00-18:00',
        timezone: 'Europe/Moscow'
      },
      hourlyRate: 2000,
      services: [
        'Лечебный массаж спины',
        'Спортивный массаж',
        'Релаксационный массаж',
        'Лимфодренажный массаж'
      ],
      equipment: ['Массажный стол', 'Ароматические масла', 'Разогревающие средства']
    },
    currentAppointments: [
      {
        id: 'app-003',
        clientName: 'Козлов Артем',
        clientPhone: '+7 (916) 888-77-66',
        clientEmail: 'artem.kozlov@yandex.ru',
        serviceType: 'wellness',
        serviceDescription: 'Спортивный массаж после тренировки',
        duration: 60,
        cost: 3000,
        status: 'scheduled',
        priority: 'medium',
        scheduledDate: '2024-06-25',
        startTime: '2024-06-25T16:00:00',
        endTime: '2024-06-25T17:00:00',
        location: 'Кабинет 205',
        notes: 'Клиент профессионально занимается спортом, требуется интенсивный массаж',
        specialistId: 'spec-002',
        paymentStatus: 'paid',
        reminderSent: true
      }
    ],
    performance: {
      rating: 4.8,
      clientsServed: 1890,
      satisfactionRate: 97,
      efficiency: 92,
      averageSessionTime: 55,
      lastEvaluation: '2024-04-15',
      notes: 'Профессионал своего дела. Отлично снимает мышечное напряжение. Клиенты отмечают значительное улучшение самочувствия.',
      achievements: [
        'Лучший массажист 2023',
        'Сертификат excellence in massage therapy'
      ],
      improvementAreas: [
        'Изучение новых техник восточного массажа',
        'Работа с профессиональными спортсменами'
      ]
    },
    financial: {
      salary: 70000,
      totalEarnings: 2250000,
      commission: 12,
      taxInfo: 'НДФЛ 13%',
      bonuses: 35000,
      lastRaiseDate: '2024-02-01',
      nextEvaluationDate: '2024-08-01'
    },
    metadata: {
      createdAt: '2018-07-15T00:00:00',
      updatedAt: '2024-06-25T09:15:00',
      lastActive: '2024-06-25T13:45:00',
      tags: ['массажист', 'лечебный массаж', 'спортивный массаж', 'реабилитация']
    }
  },
  {
    id: 'spec-003',
    personalInfo: {
      fullName: 'Кузнецова Елена Дмитриевна',
      birthDate: '1988-12-03',
      gender: 'female',
      phone: '+7 (916) 345-67-89',
      email: 'e.kuznetsova@education.ru',
      address: 'г. Москва, ул. Пушкина, д. 15, кв. 78',
      education: 'Высшее, МГУ им. Ломоносова',
      experience: 10,
      certification: 'EDU-003456',
      certificationExpiry: '2026-03-15',
      description: 'Преподаватель математики с большим опытом подготовки к ЕГЭ. 95% учеников поступают в ведущие вузы.'
    },
    professionalInfo: {
      serviceType: 'education',
      specialization: 'tutor',
      department: 'Образование',
      position: 'Репетитор по математике',
      qualifications: [
        'Высшая математика',
        'Подготовка к ЕГЭ',
        'Олимпиадная математика',
        'Методика преподавания'
      ],
      skills: [
        'Объяснение сложных тем',
        'Индивидуальный подход',
        'Мотивация учащихся',
        'Разработка учебных программ',
        'Подготовка к олимпиадам'
      ],
      languages: [
        { language: 'Русский', level: 'native' },
        { language: 'Английский', level: 'fluent' },
        { language: 'Немецкий', level: 'intermediate' }
      ],
      status: 'on_break',
      hireDate: '2017-11-20',
      office: 'Кабинет 302',
      workingHours: {
        days: ['Пн', 'Вт', 'Чт', 'Пт', 'Сб'],
        hours: '14:00-21:00',
        timezone: 'Europe/Moscow'
      },
      hourlyRate: 1800,
      services: [
        'Подготовка к ЕГЭ по математике',
        'Подготовка к ОГЭ',
        'Олимпиадная математика',
        'Повышение успеваемости',
        'Университетская математика'
      ]
    },
    currentAppointments: [
      {
        id: 'app-004',
        clientName: 'Орлова София',
        clientPhone: '+7 (916) 777-66-55',
        clientEmail: 'sofia.orlova@school.ru',
        serviceType: 'education',
        serviceDescription: 'Подготовка к ЕГЭ по математике',
        duration: 120,
        cost: 3600,
        status: 'scheduled',
        priority: 'high',
        scheduledDate: '2024-06-25',
        startTime: '2024-06-25T17:00:00',
        endTime: '2024-06-25T19:00:00',
        location: 'Кабинет 302',
        specialRequirements: 'Необходимы материалы для подготовки к профильному уровню',
        clientNotes: 'Ученица 11 класса, целевой балл - 85+',
        specialistId: 'spec-003',
        paymentStatus: 'paid',
        reminderSent: true
      }
    ],
    performance: {
      rating: 4.9,
      clientsServed: 560,
      satisfactionRate: 99,
      efficiency: 98,
      averageSessionTime: 90,
      lastEvaluation: '2024-03-10',
      notes: 'Блестящие результаты учеников. Отличная методика преподавания. Умеет найти подход к каждому студенту.',
      achievements: [
        'Лучший репетитор года - 2023',
        '95% поступление в топовые вузы',
        'Средний балл ЕГЭ - 87'
      ],
      improvementAreas: [
        'Разработка онлайн-курсов',
        'Интеграция цифровых технологий в обучение'
      ]
    },
    financial: {
      salary: 60000,
      totalEarnings: 1680000,
      commission: 10,
      taxInfo: 'НДФЛ 13%',
      bonuses: 25000,
      lastRaiseDate: '2024-01-10',
      nextEvaluationDate: '2024-07-10'
    },
    metadata: {
      createdAt: '2017-11-20T00:00:00',
      updatedAt: '2024-06-25T11:20:00',
      lastActive: '2024-06-25T16:45:00',
      tags: ['репетитор', 'математика', 'ЕГЭ', 'олимпиады', 'подготовка к вузу']
    }
  },
  {
    id: 'spec-004',
    personalInfo: {
      fullName: 'Волков Дмитрий Александрович',
      birthDate: '1982-04-18',
      gender: 'male',
      phone: '+7 (925) 456-78-90',
      email: 'd.volkov@repair.ru',
      address: 'г. Москва, ул. Гагарина, д. 67, кв. 34',
      education: 'Среднее специальное, Технический колледж',
      experience: 15,
      certification: 'REP-004567',
      certificationExpiry: '2025-06-30',
      description: 'Опытный техник по ремонту бытовой техники. Специализируется на холодильниках и стиральных машинах.'
    },
    professionalInfo: {
      serviceType: 'repair',
      specialization: 'technician',
      department: 'Бытовая техника',
      position: 'Техник-ремонтник',
      qualifications: [
        'Ремонт бытовой техники',
        'Диагностика неисправностей',
        'Запчасти и комплектующие',
        'Электротехника'
      ],
      skills: [
        'Холодильники',
        'Стиральные машины',
        'Посудомойки',
        'Микроволновки',
        'Диагностика',
        'Замена комплектующих'
      ],
      languages: [
        { language: 'Русский', level: 'native' }
      ],
      status: 'active',
      hireDate: '2015-09-01',
      office: 'Мастерская',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
        hours: '08:00-17:00',
        timezone: 'Europe/Moscow'
      },
      hourlyRate: 1500,
      services: [
        'Ремонт холодильников',
        'Ремонт стиральных машин',
        'Ремонт посудомоек',
        'Диагностика техники',
        'Техническое обслуживание'
      ],
      equipment: ['Диагностическое оборудование', 'Набор инструментов', 'Тестеры']
    },
    currentAppointments: [
      {
        id: 'app-005',
        clientName: 'Николаев Игорь',
        clientPhone: '+7 (916) 666-55-44',
        clientEmail: 'igor.nikolaev@mail.ru',
        serviceType: 'repair',
        serviceDescription: 'Ремонт холодильника Samsung',
        duration: 120,
        cost: 5000,
        status: 'scheduled',
        priority: 'medium',
        scheduledDate: '2024-06-25',
        startTime: '2024-06-25T10:00:00',
        endTime: '2024-06-25T12:00:00',
        location: 'Выезд на дом',
        notes: 'Клиент сообщил о проблеме с заморозкой, возможна утечка фреона',
        specialistId: 'spec-004',
        paymentStatus: 'pending',
        reminderSent: true
      }
    ],
    performance: {
      rating: 4.7,
      clientsServed: 2340,
      satisfactionRate: 96,
      efficiency: 90,
      averageSessionTime: 85,
      lastEvaluation: '2024-05-05',
      notes: 'Надежный специалист. Качественно выполняет ремонты. Клиенты ценят оперативность и профессионализм.',
      achievements: [
        'Специалист года - 2022',
        'Рекорд по количеству ремонтов - 2023'
      ],
      improvementAreas: [
        'Изучение новых моделей техники',
        'Повышение квалификации в области smart-техники'
      ]
    },
    financial: {
      salary: 55000,
      totalEarnings: 1950000,
      commission: 8,
      taxInfo: 'НДФЛ 13%',
      bonuses: 20000,
      lastRaiseDate: '2024-03-01',
      nextEvaluationDate: '2024-09-01'
    },
    metadata: {
      createdAt: '2015-09-01T00:00:00',
      updatedAt: '2024-06-25T08:30:00',
      lastActive: '2024-06-25T12:15:00',
      tags: ['техник', 'ремонт', 'бытовая техника', 'холодильники', 'стиральные машины']
    }
  },
  {
    id: 'spec-005',
    personalInfo: {
      fullName: 'Морозова Ирина Петровна',
      birthDate: '1992-07-30',
      gender: 'female',
      phone: '+7 (916) 567-89-01',
      email: 'i.morozova@cleaning.ru',
      address: 'г. Москва, ул. Садовая, д. 45, кв. 23',
      education: 'Среднее специальное, Колледж сервиса',
      experience: 6,
      certification: 'CLEAN-005678',
      certificationExpiry: '2024-09-20',
      description: 'Профессиональный клинер с опытом работы в premium-сегменте. Специализируется на генеральных и послеремонтных уборках.'
    },
    professionalInfo: {
      serviceType: 'cleaning',
      specialization: 'cleaner',
      department: 'Клининг',
      position: 'Клинер',
      qualifications: [
        'Генеральная уборка',
        'Эко-уборка',
        'Послеремонтная уборка',
        'Уборка premium-объектов'
      ],
      skills: [
        'Глубокая чистка',
        'Работа с техникой',
        'Эко-средства',
        'Организация пространства',
        'Уборка сложных поверхностей'
      ],
      languages: [
        { language: 'Русский', level: 'native' },
        { language: 'Украинский', level: 'native' }
      ],
      status: 'available',
      hireDate: '2020-02-14',
      office: 'Склад инвентаря',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        hours: '08:00-20:00',
        timezone: 'Europe/Moscow'
      },
      hourlyRate: 1200,
      services: [
        'Генеральная уборка',
        'Послеремонтная уборка',
        'Регулярная уборка',
        'Эко-уборка',
        'Уборка офисов'
      ],
      equipment: ['Профессиональный пылесос', 'Пароочиститель', 'Набор химии', 'Спецодежда']
    },
    currentAppointments: [
      {
        id: 'app-006',
        clientName: 'Федоров Павел',
        clientPhone: '+7 (916) 555-44-33',
        clientEmail: 'pavel.fedorov@gmail.com',
        serviceType: 'cleaning',
        serviceDescription: 'Генеральная уборка квартиры',
        duration: 240,
        cost: 8000,
        status: 'scheduled',
        priority: 'low',
        scheduledDate: '2024-06-25',
        startTime: '2024-06-25T09:00:00',
        endTime: '2024-06-25T13:00:00',
        location: 'Выезд на дом',
        notes: 'Квартира 85 кв.м. после ремонта, требуется тщательная уборка',
        specialistId: 'spec-005',
        paymentStatus: 'paid',
        reminderSent: true
      }
    ],
    performance: {
      rating: 4.8,
      clientsServed: 890,
      satisfactionRate: 97,
      efficiency: 94,
      averageSessionTime: 180,
      lastEvaluation: '2024-04-28',
      notes: 'Аккуратная и ответственная. Клиенты довольны качеством уборки. Особенно хорошо справляется со сложными задачами.',
      achievements: [
        'Лучший клинер месяца - Апрель 2024',
        'Премия за качество - 2023'
      ],
      improvementAreas: [
        'Освоение новых чистящих средств',
        'Работа с smart-техникой для уборки'
      ]
    },
    financial: {
      salary: 45000,
      totalEarnings: 980000,
      commission: 7,
      taxInfo: 'НДФЛ 13%',
      bonuses: 15000,
      lastRaiseDate: '2024-02-15',
      nextEvaluationDate: '2024-08-15'
    },
    metadata: {
      createdAt: '2020-02-14T00:00:00',
      updatedAt: '2024-06-25T07:45:00',
      lastActive: '2024-06-25T11:30:00',
      tags: ['клинер', 'уборка', 'генеральная уборка', 'послеремонтная уборка', 'эко-уборка']
    }
  },
  {
    id: 'spec-006',
    personalInfo: {
      fullName: 'Громов Михаил Олегович',
      birthDate: '1987-11-12',
      gender: 'male',
      phone: '+7 (925) 678-90-12',
      email: 'm.gromov@consulting.ru',
      address: 'г. Москва, пр. Вернадского, д. 78, кв. 56',
      education: 'Высшее, РЭУ им. Плеханова',
      experience: 9,
      certification: 'CONS-006789',
      certificationExpiry: '2025-07-15',
      description: 'Бизнес-консультант с опытом работы в международных компаниях. Специализируется на стратегическом планировании и финансовом анализе.'
    },
    professionalInfo: {
      serviceType: 'consulting',
      specialization: 'consultant',
      department: 'Бизнес-консалтинг',
      position: 'Бизнес-консультант',
      qualifications: [
        'Стратегическое планирование',
        'Финансовый анализ',
        'Маркетинг',
        'Управление проектами',
        'Бизнес-процессы'
      ],
      skills: [
        'Анализ бизнес-процессов',
        'Разработка стратегий',
        'Презентации',
        'Финансовое моделирование',
        'Управление изменениями'
      ],
      languages: [
        { language: 'Русский', level: 'native' },
        { language: 'Английский', level: 'fluent' },
        { language: 'Китайский', level: 'intermediate' }
      ],
      status: 'vacation',
      hireDate: '2018-09-10',
      office: 'Кабинет 401',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
        hours: '10:00-19:00',
        timezone: 'Europe/Moscow'
      },
      hourlyRate: 3500,
      services: [
        'Бизнес-консалтинг',
        'Стратегическое планирование',
        'Финансовый анализ',
        'Оптимизация процессов',
        'Коучинг для руководителей'
      ],
      equipment: ['Ноутбук', 'Проектор', 'Маркерная доска', 'Специализированное ПО']
    },
    currentAppointments: [],
    performance: {
      rating: 4.9,
      clientsServed: 340,
      satisfactionRate: 98,
      efficiency: 96,
      averageSessionTime: 120,
      lastEvaluation: '2024-05-15',
      notes: 'Эксперт в области бизнес-консалтинга. Помогает клиентам достигать поставленных целей. Отличные аналитические способности.',
      achievements: [
        'Лучший консультант года - 2023',
        'Премия за инновационные решения',
        'Сертификат excellence in consulting'
      ],
      improvementAreas: [
        'Разработка онлайн-курсов',
        'Расширение международной практики'
      ]
    },
    financial: {
      salary: 120000,
      totalEarnings: 4200000,
      commission: 20,
      taxInfo: 'НДФЛ 13%',
      bonuses: 75000,
      lastRaiseDate: '2024-01-20',
      nextEvaluationDate: '2024-07-20'
    },
    metadata: {
      createdAt: '2018-09-10T00:00:00',
      updatedAt: '2024-06-20T18:00:00',
      lastActive: '2024-06-20T18:00:00',
      tags: ['консультант', 'бизнес', 'стратегия', 'финансы', 'коучинг']
    }
  },
  {
    id: 'spec-007',
    personalInfo: {
      fullName: 'Лебедева Светлана Игоревна',
      birthDate: '1991-03-25',
      gender: 'female',
      phone: '+7 (916) 789-01-23',
      email: 's.lebedeva@fitness.ru',
      address: 'г. Москва, ул. Спортивная, д. 12, кв. 34',
      education: 'Высшее, Институт физической культуры',
      experience: 7,
      certification: 'FIT-007890',
      certificationExpiry: '2024-10-31',
      description: 'Персональный тренер по фитнесу с специализацией на функциональных тренировках и реабилитации.'
    },
    professionalInfo: {
      serviceType: 'fitness',
      specialization: 'trainer',
      department: 'Фитнес',
      position: 'Персональный тренер',
      qualifications: [
        'Функциональный тренинг',
        'Реабилитация',
        'Нутрициология',
        'Спортивная медицина'
      ],
      skills: [
        'Персональные тренировки',
        'Составление программ',
        'Реабилитация после травм',
        'Консультации по питанию',
        'Групповые занятия'
      ],
      languages: [
        { language: 'Русский', level: 'native' },
        { language: 'Английский', level: 'fluent' }
      ],
      status: 'active',
      hireDate: '2019-06-01',
      office: 'Зал 3',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        hours: '07:00-22:00',
        timezone: 'Europe/Moscow'
      },
      hourlyRate: 2200,
      services: [
        'Персональные тренировки',
        'Функциональный тренинг',
        'Реабилитация',
        'Консультации по питанию',
        'Составление программ'
      ],
      equipment: ['Тренажеры', 'Фитнес-браслеты', 'Измерительные приборы', 'Реабилитационное оборудование']
    },
    currentAppointments: [
      {
        id: 'app-007',
        clientName: 'Васнецова Анастасия',
        clientPhone: '+7 (916) 444-33-22',
        clientEmail: 'nastya.vasnecova@mail.ru',
        serviceType: 'fitness',
        serviceDescription: 'Персональная тренировка + консультация по питанию',
        duration: 90,
        cost: 4500,
        status: 'scheduled',
        priority: 'medium',
        scheduledDate: '2024-06-25',
        startTime: '2024-06-25T18:00:00',
        endTime: '2024-06-25T19:30:00',
        location: 'Зал 3',
        notes: 'Клиентка восстанавливается после травмы колена, требуется щадящая программа',
        specialistId: 'spec-007',
        paymentStatus: 'paid',
        reminderSent: true
      }
    ],
    performance: {
      rating: 4.8,
      clientsServed: 670,
      satisfactionRate: 96,
      efficiency: 93,
      averageSessionTime: 70,
      lastEvaluation: '2024-04-10',
      notes: 'Профессиональный подход к тренировкам. Особенно успешна в работе с реабилитацией.',
      achievements: [
        'Тренер месяца - Май 2024',
        'Лучшие результаты клиентов - 2023'
      ],
      improvementAreas: [
        'Изучение новых методик тренировок',
        'Работа с возрастными клиентами'
      ]
    },
    financial: {
      salary: 65000,
      totalEarnings: 1450000,
      commission: 12,
      taxInfo: 'НДФЛ 13%',
      bonuses: 28000,
      lastRaiseDate: '2024-02-01',
      nextEvaluationDate: '2024-08-01'
    },
    metadata: {
      createdAt: '2019-06-01T00:00:00',
      updatedAt: '2024-06-25T12:00:00',
      lastActive: '2024-06-25T16:30:00',
      tags: ['тренер', 'фитнес', 'реабилитация', 'функциональный тренинг', 'питание']
    }
  },
  {
    id: 'spec-008',
    personalInfo: {
      fullName: 'Новиков Андрей Владимирович',
      birthDate: '1980-09-14',
      gender: 'male',
      phone: '+7 (925) 890-12-34',
      email: 'a.novikov@it.ru',
      address: 'г. Москва, ул. Программистов, д. 8, кв. 16',
      education: 'Высшее, МГТУ им. Баумана',
      experience: 16,
      certification: 'IT-008901',
      certificationExpiry: '2025-12-31',
      description: 'Senior full-stack разработчик с опытом работы в крупных IT-компаниях. Специализируется на веб-разработке и архитектуре.'
    },
    professionalInfo: {
      serviceType: 'it',
      specialization: 'programmer',
      department: 'IT-услуги',
      position: 'Senior Developer',
      qualifications: [
        'Full-stack разработка',
        'Архитектура ПО',
        'DevOps',
        'Базы данных',
        'Cloud computing'
      ],
      skills: [
        'JavaScript/TypeScript',
        'React/Next.js',
        'Node.js',
        'Python',
        'AWS',
        'Docker',
        'SQL/NoSQL'
      ],
      languages: [
        { language: 'Русский', level: 'native' },
        { language: 'Английский', level: 'fluent' }
      ],
      status: 'available',
      hireDate: '2020-01-15',
      office: 'Кабинет 505',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
        hours: '10:00-19:00',
        timezone: 'Europe/Moscow'
      },
      hourlyRate: 4000,
      services: [
        'Веб-разработка',
        'Консультации по архитектуре',
        'Code review',
        'Техническое интервью',
        'Разработка MVP'
      ],
      equipment: ['Мощный рабочий компьютер', 'Мониторы', 'Серверное оборудование']
    },
    currentAppointments: [
      {
        id: 'app-008',
        clientName: 'ТехноСтарт',
        clientPhone: '+7 (495) 123-45-67',
        clientEmail: 'ceo@technostart.ru',
        serviceType: 'it',
        serviceDescription: 'Консультация по архитектуре веб-приложения',
        duration: 120,
        cost: 8000,
        status: 'scheduled',
        priority: 'high',
        scheduledDate: '2024-06-25',
        startTime: '2024-06-25T15:00:00',
        endTime: '2024-06-25T17:00:00',
        location: 'Кабинет 505',
        notes: 'Стартап нуждается в консультации по масштабированию приложения',
        specialistId: 'spec-008',
        paymentStatus: 'pending',
        reminderSent: true
      }
    ],
    performance: {
      rating: 4.9,
      clientsServed: 120,
      satisfactionRate: 99,
      efficiency: 97,
      averageSessionTime: 110,
      lastEvaluation: '2024-05-25',
      notes: 'Высококвалифицированный разработчик. Отличные архитектурные решения.',
      achievements: [
        'Лучший IT-специалист - 2023',
        'Премия за инновации',
        'Сертификат AWS Solutions Architect'
      ],
      improvementAreas: [
        'Изучение новых фреймворков',
        'Менторство junior разработчиков'
      ]
    },
    financial: {
      salary: 180000,
      totalEarnings: 3200000,
      commission: 25,
      taxInfo: 'НДФЛ 13%',
      bonuses: 120000,
      lastRaiseDate: '2024-03-15',
      nextEvaluationDate: '2024-09-15'
    },
    metadata: {
      createdAt: '2020-01-15T00:00:00',
      updatedAt: '2024-06-25T10:00:00',
      lastActive: '2024-06-25T14:20:00',
      tags: ['программист', 'full-stack', 'архитектура', 'веб-разработка', 'консультации']
    }
  }
];

// Компонент карточки специалиста
interface SpecialistCardProps {
  specialist: Specialist;
  onClick?: () => void;
  delay?: number;
  compact?: boolean;
}

const SpecialistCard: React.FC<SpecialistCardProps> = ({ 
  specialist, 
  onClick, 
  delay = 0,
  compact = false
}) => {
  const getSpecialistColor = (status: string): string => {
    const colorMap: { [key: string]: string } = {
      active: SPECIALIST_COLORS.active,
      inactive: SPECIALIST_COLORS.inactive,
      busy: SPECIALIST_COLORS.busy,
      available: SPECIALIST_COLORS.available,
      on_break: SPECIALIST_COLORS.on_break,
      vacation: SPECIALIST_COLORS.vacation,
      training: SPECIALIST_COLORS.education
    };
    return colorMap[status] || SPECIALIST_COLORS.inactive;
  };

  const currentAppointments = specialist.currentAppointments.filter(
    app => app.status === 'scheduled' || app.status === 'in_progress'
  ).length;

  if (compact) {
    return (
      <BentoCard 
        className="p-4" 
        glowColor={getSpecialistColor(specialist.professionalInfo.status)} 
        onClick={onClick}
        delay={delay}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${generateColorFromName(specialist.personalInfo.fullName)} flex items-center justify-center text-white font-bold text-sm`}>
            {getInitials(specialist.personalInfo.fullName)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm truncate">{specialist.personalInfo.fullName}</h4>
            <p className="text-slate-400 text-xs truncate">
              {specialist.professionalInfo.specialization}
            </p>
          </div>
          <StatusBadge 
            status={specialist.professionalInfo.status} 
            animated={specialist.professionalInfo.status === 'available'}
            size="sm"
          />
        </div>
      </BentoCard>
    );
  }

  return (
    <BentoCard 
      className="p-5" 
      glowColor={getSpecialistColor(specialist.professionalInfo.status)} 
      onClick={onClick}
      delay={delay}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${generateColorFromName(specialist.personalInfo.fullName)} flex items-center justify-center text-white font-bold text-sm`}>
            {getInitials(specialist.personalInfo.fullName)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{specialist.personalInfo.fullName}</h4>
            <p className="text-slate-400 text-sm line-clamp-1">
              {getSpecializationIcon(specialist.professionalInfo.specialization)} {specialist.professionalInfo.specialization} • {specialist.personalInfo.experience} лет опыта
            </p>
          </div>
        </div>
        <StatusBadge 
          status={specialist.professionalInfo.status} 
          animated={specialist.professionalInfo.status === 'available'}
        />
      </div>
      
      <div className="space-y-3 text-sm mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Сфера услуг:</span>
          <StatusBadge status={specialist.professionalInfo.serviceType} />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Клиентов обслужено:</span>
          <span className="text-white font-medium">{specialist.performance.clientsServed.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Рейтинг:</span>
          <div className="flex items-center space-x-1">
            <span className="text-amber-500">★</span>
            <span className="text-white font-medium">{specialist.performance.rating}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Ставка в час:</span>
          <span className="text-white font-medium">{formatCurrency(specialist.professionalInfo.hourlyRate)}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <div className="text-xs text-slate-400">
          {currentAppointments} {currentAppointments === 1 ? 'запись' : currentAppointments < 5 ? 'записи' : 'записей'} сегодня
        </div>
        <div className="text-xs font-semibold text-emerald-500">
          {specialist.performance.satisfactionRate}% довольных
        </div>
      </div>
    </BentoCard>
  );
};

// Компонент карточки записи
interface AppointmentCardProps {
  appointment: Appointment;
  onClick?: () => void;
  delay?: number;
  showSpecialist?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  onClick, 
  delay = 0,
  showSpecialist = false
}) => {
  const getAppointmentColor = (status: string): string => {
    const colorMap: { [key: string]: string } = {
      scheduled: SPECIALIST_COLORS.active,
      in_progress: SPECIALIST_COLORS.available,
      completed: SPECIALIST_COLORS.wellness,
      cancelled: SPECIALIST_COLORS.inactive,
      confirmed: SPECIALIST_COLORS.success
    };
    return colorMap[status] || SPECIALIST_COLORS.inactive;
  };

  const specialist = specialists.find(s => s.id === appointment.specialistId);

  return (
    <BentoCard 
      className="p-4" 
      glowColor={getAppointmentColor(appointment.status)} 
      onClick={onClick}
      delay={delay}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <h5 className="text-white font-semibold text-sm mb-1 line-clamp-2">{appointment.clientName}</h5>
          <p className="text-slate-400 text-xs line-clamp-2">{appointment.serviceDescription}</p>
          {showSpecialist && specialist && (
            <p className="text-slate-500 text-xs mt-1">
              {getSpecializationIcon(specialist.professionalInfo.specialization)} {specialist.personalInfo.fullName}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end space-y-2">
          <StatusBadge status={appointment.status} animated={appointment.status === 'in_progress'} />
          <StatusBadge status={appointment.priority} size="sm" />
        </div>
      </div>
      
      <div className="space-y-2 text-xs mb-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Время:</span>
          <span className="text-white">{formatTime(appointment.startTime)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Длительность:</span>
          <span className="text-white">{appointment.duration} мин</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Стоимость:</span>
          <span className="text-white font-medium">{formatCurrency(appointment.cost)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Оплата:</span>
          <StatusBadge status={appointment.paymentStatus} type="payment" size="sm" />
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Место:</span>
          <span className="text-white text-right">{appointment.location}</span>
        </div>
      </div>

      {appointment.notes && (
        <div className="pt-2 border-t border-slate-700/50">
          <p className="text-slate-400 text-xs line-clamp-2">{appointment.notes}</p>
        </div>
      )}
    </BentoCard>
  );
};

// Компонент поиска и фильтров
interface SearchAndFiltersProps {
  onServiceTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  serviceTypeFilter: string;
  statusFilter: string;
  sortBy: string;
  searchQuery: string;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({ 
  onServiceTypeChange, 
  onStatusChange,
  onSearchChange,
  onSortChange,
  serviceTypeFilter,
  statusFilter,
  sortBy,
  searchQuery,
  viewMode = 'grid',
  onViewModeChange
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchQuery(value);
    onSearchChange(value);
  }, [onSearchChange]);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearchQuery);
  }, [localSearchQuery, onSearchChange]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 mb-6">
      <div className="flex-1">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Поиск специалистов, записей, услуг..."
            value={localSearchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 pr-10"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>
      
      <div className="flex flex-wrap gap-3 items-center">
        {onViewModeChange && (
          <div className="flex bg-slate-700/50 rounded-lg p-1 border border-slate-600">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-white/10 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-white/10 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-sm whitespace-nowrap">Сортировка:</span>
          <select 
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
          >
            <option value="name">По имени</option>
            <option value="rating">По рейтингу</option>
            <option value="experience">По опыту</option>
            <option value="rate">По ставке</option>
            <option value="clients">По клиентам</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-sm whitespace-nowrap">Сфера услуг:</span>
          <select 
            value={serviceTypeFilter}
            onChange={(e) => onServiceTypeChange(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
          >
            <option value="all">Все сферы</option>
            <option value="beauty">Красота</option>
            <option value="wellness">Здоровье</option>
            <option value="education">Образование</option>
            <option value="repair">Ремонт</option>
            <option value="cleaning">Уборка</option>
            <option value="consulting">Консультации</option>
            <option value="fitness">Фитнес</option>
            <option value="medical">Медицина</option>
            <option value="legal">Юриспруденция</option>
            <option value="it">IT</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-sm whitespace-nowrap">Статус:</span>
          <select 
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
          >
            <option value="all">Все статусы</option>
            <option value="active">Активен</option>
            <option value="available">Доступен</option>
            <option value="busy">Занят</option>
            <option value="on_break">На перерыве</option>
            <option value="vacation">В отпуске</option>
            <option value="training">На обучении</option>
            <option value="inactive">Неактивен</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Компонент пустого состояния
interface EmptyStateProps {
  title: string;
  description: string;
  icon: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => (
  <BentoCard className="p-8 text-center">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400 mb-6">{description}</p>
    {action && (
      <motion.button
        onClick={action.onClick}
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 active:scale-95"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {action.label}
      </motion.button>
    )}
  </BentoCard>
);

// Основной компонент дашборда специалистов
const SpecialistManagementDashboard: React.FC = () => {
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'specialists' | 'appointments' | 'performance' | 'analytics'>('overview');
  const [filterServiceType, setFilterServiceType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Имитация загрузки
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Статистика для дашборда
  const stats = useMemo(() => {
    const totalSpecialists = specialists.length;
    const activeSpecialists = specialists.filter(s => 
      s.professionalInfo.status === 'active' || s.professionalInfo.status === 'available'
    ).length;
    const busySpecialists = specialists.filter(s => s.professionalInfo.status === 'busy').length;
    const totalClients = specialists.reduce((acc, specialist) => acc + specialist.performance.clientsServed, 0);
    const activeAppointments = specialists.flatMap(s => s.currentAppointments)
      .filter(app => app.status === 'scheduled' || app.status === 'in_progress').length;
    const serviceTypes = [...new Set(specialists.map(s => s.professionalInfo.serviceType))];
    const totalRevenue = specialists.reduce((acc, specialist) => acc + specialist.financial.totalEarnings, 0);
    const averageRating = specialists.reduce((acc, s) => acc + s.performance.rating, 0) / specialists.length;
    const totalEarningsMonth = specialists.reduce((acc, s) => acc + (s.financial.totalEarnings / 12), 0);
    
    return {
      totalSpecialists,
      activeSpecialists,
      busySpecialists,
      totalClients,
      activeAppointments,
      serviceTypes,
      totalRevenue,
      averageRating,
      totalEarningsMonth
    };
  }, []);

  // Фильтрация и сортировка специалистов
  const filteredSpecialists = useMemo(() => {
    let filtered = specialists.filter(specialist => {
      const serviceTypeMatch = filterServiceType === 'all' || specialist.professionalInfo.serviceType === filterServiceType;
      const statusMatch = filterStatus === 'all' || specialist.professionalInfo.status === filterStatus;
      const searchMatch = searchQuery === '' || 
        specialist.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        specialist.professionalInfo.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        specialist.professionalInfo.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        specialist.professionalInfo.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return serviceTypeMatch && statusMatch && searchMatch;
    });

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.performance.rating - a.performance.rating;
        case 'experience':
          return b.personalInfo.experience - a.personalInfo.experience;
        case 'rate':
          return b.professionalInfo.hourlyRate - a.professionalInfo.hourlyRate;
        case 'clients':
          return b.performance.clientsServed - a.performance.clientsServed;
        case 'name':
        default:
          return a.personalInfo.fullName.localeCompare(b.personalInfo.fullName);
      }
    });

    return filtered;
  }, [filterServiceType, filterStatus, searchQuery, sortBy]);

  // Все записи
  const allAppointments = useMemo(() => 
    specialists.flatMap(specialist => specialist.currentAppointments), 
  []);

  // Активные записи
  const activeAppointments = useMemo(() => 
    allAppointments.filter(appointment => appointment.status === 'scheduled' || appointment.status === 'in_progress'),
  [allAppointments]);

  // Фильтрация записей
  const filteredAppointments = useMemo(() => {
    let filtered = allAppointments.filter(appointment => {
      const serviceTypeMatch = filterServiceType === 'all' || appointment.serviceType === filterServiceType;
      const searchMatch = searchQuery === '' || 
        appointment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.serviceDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      return serviceTypeMatch && searchMatch;
    });

    // Сортировка записей по времени
    filtered.sort((a, b) => a.startTime.localeCompare(b.startTime));

    return filtered;
  }, [allAppointments, filterServiceType, searchQuery]);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-4 lg:p-6">
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.8);
        }
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shine {
          animation: shine 2s infinite;
        }
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .line-clamp-3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
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
            <motion.h1 
              className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Управление Специалистами
            </motion.h1>
            <motion.p 
              className="text-slate-400 text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Мониторинг и координация специалистов сферы услуг
            </motion.p>
          </div>
          <motion.div 
            className="mt-4 lg:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-wrap gap-2">
              <motion.button 
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>+</span>
                <span>Новый специалист</span>
              </motion.button>
              <motion.button 
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>+</span>
                <span>Создать запись</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Навигация */}
        <nav className="flex space-x-1 p-1 bg-slate-800/50 rounded-2xl backdrop-blur-xl border border-slate-700/50 mb-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Обзор', icon: '📊' },
            { id: 'specialists', label: 'Специалисты', icon: '👨‍💼' },
            { id: 'appointments', label: 'Записи', icon: '📅' },
            { id: 'performance', label: 'Эффективность', icon: '📈' },
            { id: 'analytics', label: 'Аналитика', icon: '🔍' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white shadow-lg shadow-black/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* Поиск и фильтры */}
        {(activeTab === 'specialists' || activeTab === 'appointments') && (
          <SearchAndFilters
            onServiceTypeChange={setFilterServiceType}
            onStatusChange={setFilterStatus}
            onSearchChange={setSearchQuery}
            onSortChange={setSortBy}
            onViewModeChange={setViewMode}
            serviceTypeFilter={filterServiceType}
            statusFilter={filterStatus}
            sortBy={sortBy}
            searchQuery={searchQuery}
            viewMode={viewMode}
          />
        )}
      </motion.header>

      {/* Основной контент */}
      <main>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-20"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </motion.div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Статистика */}
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <StatCard
                      title="Всего специалистов"
                      value={stats.totalSpecialists}
                      change={4.2}
                      icon="👨‍💼"
                      color={SPECIALIST_COLORS.active}
                      subtitle={`${stats.activeSpecialists} активных`}
                      trend="up"
                      delay={0}
                    />
                    <StatCard
                      title="Занято сейчас"
                      value={stats.busySpecialists}
                      change={6.7}
                      icon="🔧"
                      color={SPECIALIST_COLORS.busy}
                      subtitle="обслуживают клиентов"
                      trend="up"
                      delay={0.1}
                    />
                    <StatCard
                      title="Активные записи"
                      value={stats.activeAppointments}
                      change={8.3}
                      icon="📋"
                      color={SPECIALIST_COLORS.available}
                      subtitle="на сегодня"
                      trend="up"
                      delay={0.2}
                    />
                    <StatCard
                      title="Общий доход"
                      value={formatCurrency(stats.totalRevenue)}
                      change={15.1}
                      icon="💰"
                      color={SPECIALIST_COLORS.consulting}
                      subtitle="за все время"
                      trend="up"
                      delay={0.3}
                    />
                  </motion.div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Лучшие специалисты */}
                    <BentoCard className="p-6" glowColor={SPECIALIST_COLORS.active}>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">Лучшие специалисты</h3>
                        <button 
                          className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                          onClick={() => setActiveTab('specialists')}
                        >
                          Все →
                        </button>
                      </div>
                      <div className="space-y-4">
                        {specialists
                          .filter(s => s.professionalInfo.status === 'active' || s.professionalInfo.status === 'available')
                          .sort((a, b) => b.performance.rating - a.performance.rating)
                          .slice(0, 3)
                          .map((specialist, index) => (
                          <motion.div 
                            key={specialist.id}
                            className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                            onClick={() => setSelectedSpecialist(specialist)}
                            whileHover={{ scale: 1.02, x: 4 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${generateColorFromName(specialist.personalInfo.fullName)} flex items-center justify-center text-white font-bold text-sm`}>
                              {getInitials(specialist.personalInfo.fullName)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium text-sm truncate">{specialist.personalInfo.fullName}</h4>
                              <p className="text-slate-400 text-xs">
                                {specialist.professionalInfo.specialization} • {specialist.professionalInfo.serviceType}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-amber-500">★</span>
                              <span className="text-white text-sm font-medium">{specialist.performance.rating}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </BentoCard>

                    {/* Активные записи */}
                    <BentoCard className="p-6" glowColor={SPECIALIST_COLORS.available}>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">Ближайшие записи</h3>
                        <button 
                          className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                          onClick={() => setActiveTab('appointments')}
                        >
                          Все →
                        </button>
                      </div>
                      <div className="space-y-4">
                        {activeAppointments
                          .sort((a, b) => a.startTime.localeCompare(b.startTime))
                          .slice(0, 3)
                          .map((appointment, index) => (
                          <motion.div 
                            key={appointment.id}
                            className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                            onClick={() => setSelectedAppointment(appointment)}
                            whileHover={{ scale: 1.02, x: 4 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              appointment.priority === 'high' ? 'bg-gradient-to-br from-red-500 to-pink-500' :
                              appointment.priority === 'medium' ? 'bg-gradient-to-br from-orange-500 to-amber-500' :
                              'bg-gradient-to-br from-green-500 to-emerald-500'
                            }`}>
                              {getServiceTypeIcon(appointment.serviceType)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium text-sm line-clamp-2">{appointment.clientName}</h4>
                              <p className="text-slate-400 text-xs">
                                {formatTime(appointment.startTime)} • {appointment.serviceType}
                              </p>
                            </div>
                            <StatusBadge status={appointment.status} />
                          </motion.div>
                        ))}
                      </div>
                    </BentoCard>
                  </div>

                  {/* Сферы услуг */}
                  <BentoCard className="p-6" glowColor={SPECIALIST_COLORS.beauty}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Распределение по сферам услуг</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {stats.serviceTypes.map((serviceType, index) => {
                        const typeSpecialists = specialists.filter(s => s.professionalInfo.serviceType === serviceType);
                        const activeTypeSpecialists = typeSpecialists.filter(s => 
                          s.professionalInfo.status === 'active' || s.professionalInfo.status === 'available'
                        );
                        
                        return (
                          <motion.div 
                            key={serviceType} 
                            className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                            whileHover={{ scale: 1.05, y: -2 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => {
                              setActiveTab('specialists');
                              setFilterServiceType(serviceType);
                            }}
                          >
                            <div className="text-2xl mb-2">{getServiceTypeIcon(serviceType)}</div>
                            <h4 className="text-white font-medium text-sm capitalize mb-1">{serviceType}</h4>
                            <p className="text-slate-400 text-xs">
                              {activeTypeSpecialists.length}/{typeSpecialists.length} активных
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </BentoCard>
                </motion.div>
              )}

              {activeTab === 'specialists' && (
                <motion.div
                  key="specialists"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Специалисты сферы услуг</h2>
                    <p className="text-slate-400">Управление персоналом и их специализациями</p>
                  </div>
                  
                  {filteredSpecialists.length === 0 ? (
                    <EmptyState
                      title="Специалисты не найдены"
                      description="Попробуйте изменить параметры поиска или фильтры"
                      icon="🔍"
                      action={{
                        label: "Сбросить фильтры",
                        onClick: () => {
                          setFilterServiceType('all');
                          setFilterStatus('all');
                          setSearchQuery('');
                        }
                      }}
                    />
                  ) : (
                    <motion.div 
                      className={`gap-4 ${
                        viewMode === 'grid' 
                          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                          : 'flex flex-col space-y-4'
                      }`}
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {filteredSpecialists.map((specialist, index) => (
                        <motion.div
                          key={specialist.id}
                          variants={itemVariants}
                        >
                          {viewMode === 'grid' ? (
                            <SpecialistCard 
                              specialist={specialist} 
                              onClick={() => setSelectedSpecialist(specialist)}
                              delay={index * 0.1}
                            />
                          ) : (
                            <SpecialistCard 
                              specialist={specialist} 
                              onClick={() => setSelectedSpecialist(specialist)}
                              delay={index * 0.1}
                              compact={true}
                            />
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === 'appointments' && (
                <motion.div
                  key="appointments"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Текущие записи</h2>
                    <p className="text-slate-400">Управление расписанием и обслуживанием клиентов</p>
                  </div>
                  
                  {filteredAppointments.length === 0 ? (
                    <EmptyState
                      title="Записи не найдены"
                      description="Попробуйте изменить параметры поиска или фильтры"
                      icon="📅"
                      action={{
                        label: "Сбросить фильтры",
                        onClick: () => {
                          setFilterServiceType('all');
                          setSearchQuery('');
                        }
                      }}
                    />
                  ) : (
                    <motion.div 
                      className={`gap-4 ${
                        viewMode === 'grid' 
                          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                          : 'flex flex-col space-y-4'
                      }`}
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {filteredAppointments.map((appointment, index) => (
                        <motion.div
                          key={appointment.id}
                          variants={itemVariants}
                        >
                          <AppointmentCard 
                            appointment={appointment} 
                            onClick={() => setSelectedAppointment(appointment)}
                            delay={index * 0.1}
                            showSpecialist={viewMode === 'list'}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === 'performance' && (
                <motion.div
                  key="performance"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Эффективность работы</h2>
                    <p className="text-slate-400">Мониторинг производительности специалистов</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Рейтинги специалистов */}
                    <BentoCard className="p-6" glowColor={SPECIALIST_COLORS.active}>
                      <h3 className="text-xl font-bold text-white mb-6">Рейтинги специалистов</h3>
                      <div className="space-y-4">
                        {specialists
                          .sort((a, b) => b.performance.rating - a.performance.rating)
                          .map((specialist, index) => (
                          <motion.div 
                            key={specialist.id}
                            className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                            onClick={() => setSelectedSpecialist(specialist)}
                            whileHover={{ scale: 1.02, x: 4 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                              {getInitials(specialist.personalInfo.fullName)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium text-sm truncate">{specialist.personalInfo.fullName}</h4>
                              <p className="text-slate-400 text-xs">
                                {specialist.performance.clientsServed.toLocaleString()} клиентов
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-amber-500">★</span>
                              <span className="text-white text-sm font-medium">{specialist.performance.rating}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </BentoCard>

                    {/* Показатели эффективности */}
                    <BentoCard className="p-6" glowColor={SPECIALIST_COLORS.wellness}>
                      <h3 className="text-xl font-bold text-white mb-6">Ключевые показатели</h3>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-sm text-slate-300 mb-2">
                            <span>Средний рейтинг</span>
                            <span className="font-semibold">
                              {stats.averageRating.toFixed(1)}/5
                            </span>
                          </div>
                          <ProgressBar 
                            value={stats.averageRating * 20} 
                            color={SPECIALIST_COLORS.active}
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm text-slate-300 mb-2">
                            <span>Удовлетворенность клиентов</span>
                            <span className="font-semibold">
                              {(specialists.reduce((acc, s) => acc + s.performance.satisfactionRate, 0) / specialists.length).toFixed(1)}%
                            </span>
                          </div>
                          <ProgressBar 
                            value={specialists.reduce((acc, s) => acc + s.performance.satisfactionRate, 0) / specialists.length} 
                            color={SPECIALIST_COLORS.available}
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm text-slate-300 mb-2">
                            <span>Эффективность работы</span>
                            <span className="font-semibold">
                              {(specialists.reduce((acc, s) => acc + s.performance.efficiency, 0) / specialists.length).toFixed(1)}%
                            </span>
                          </div>
                          <ProgressBar 
                            value={specialists.reduce((acc, s) => acc + s.performance.efficiency, 0) / specialists.length} 
                            color={SPECIALIST_COLORS.consulting}
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm text-slate-300 mb-2">
                            <span>Обслужено клиентов</span>
                            <span className="font-semibold">
                              {stats.totalClients.toLocaleString()}
                            </span>
                          </div>
                          <ProgressBar 
                            value={Math.min(stats.totalClients / 10000 * 100, 100)} 
                            color={SPECIALIST_COLORS.beauty}
                            max={10000}
                          />
                        </div>
                      </div>
                    </BentoCard>
                  </div>
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
                    <h2 className="text-2xl font-bold text-white mb-2">Аналитика и отчеты</h2>
                    <p className="text-slate-400">Детальная аналитика работы специалистов и финансовые показатели</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <StatCard
                      title="Доход за месяц"
                      value={formatCurrency(stats.totalEarningsMonth)}
                      change={12.5}
                      icon="📊"
                      color={SPECIALIST_COLORS.success}
                      subtitle="среднемесячный доход"
                      trend="up"
                    />
                    <StatCard
                      title="Новых клиентов"
                      value="127"
                      change={8.3}
                      icon="👥"
                      color={SPECIALIST_COLORS.blue}
                      subtitle="за последний месяц"
                      trend="up"
                    />
                    <StatCard
                      title="Средний чек"
                      value={formatCurrency(3200)}
                      change={5.2}
                      icon="💳"
                      color={SPECIALIST_COLORS.purple}
                      subtitle="средняя стоимость услуги"
                      trend="up"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BentoCard className="p-6" glowColor={SPECIALIST_COLORS.education}>
                      <h3 className="text-xl font-bold text-white mb-6">Распределение по специализациям</h3>
                      <div className="space-y-4">
                        {Array.from(new Set(specialists.map(s => s.professionalInfo.specialization))).map((spec, index) => {
                          const specCount = specialists.filter(s => s.professionalInfo.specialization === spec).length;
                          const percentage = (specCount / specialists.length) * 100;
                          
                          return (
                            <div key={spec} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-lg">{getSpecializationIcon(spec)}</span>
                                <span className="text-white text-sm">{spec}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-20 bg-slate-700 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-slate-400 text-sm w-8 text-right">{specCount}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </BentoCard>

                    <BentoCard className="p-6" glowColor={SPECIALIST_COLORS.consulting}>
                      <h3 className="text-xl font-bold text-white mb-6">Финансовые показатели</h3>
                      <div className="space-y-4">
                        {specialists
                          .sort((a, b) => b.financial.totalEarnings - a.financial.totalEarnings)
                          .slice(0, 5)
                          .map((specialist, index) => (
                          <div key={specialist.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${generateColorFromName(specialist.personalInfo.fullName)} flex items-center justify-center text-white font-bold text-xs`}>
                                {getInitials(specialist.personalInfo.fullName)}
                              </div>
                              <span className="text-white text-sm">{specialist.personalInfo.fullName.split(' ')[0]}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-medium text-sm">{formatCurrency(specialist.financial.totalEarnings)}</div>
                              <div className="text-slate-400 text-xs">{specialist.performance.clientsServed} клиентов</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </BentoCard>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </main>

      {/* Модальные окна */}
      <AnimatePresence>
        <Modal 
          key="specialist-modal"
          isOpen={!!selectedSpecialist} 
          onClose={() => setSelectedSpecialist(null)}
          title={selectedSpecialist ? `Специалист: ${selectedSpecialist.personalInfo.fullName}` : ''}
          size="xl"
        >
          {selectedSpecialist && (
            <div className="space-y-6">
              {/* Заголовок с основной информацией */}
              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-white/5">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${generateColorFromName(selectedSpecialist.personalInfo.fullName)} flex items-center justify-center text-white font-bold text-lg`}>
                  {getInitials(selectedSpecialist.personalInfo.fullName)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{selectedSpecialist.personalInfo.fullName}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <StatusBadge status={selectedSpecialist.professionalInfo.specialization} />
                    <StatusBadge status={selectedSpecialist.professionalInfo.serviceType} />
                    <StatusBadge status={selectedSpecialist.professionalInfo.status} animated />
                  </div>
                  <p className="text-slate-300 text-sm">{selectedSpecialist.personalInfo.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BentoCard className="p-6" glowColor={SPECIALIST_COLORS.active}>
                  <h4 className="text-lg font-semibold text-white mb-4">Персональная информация</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Дата рождения:</span>
                      <span className="text-white">{formatDate(selectedSpecialist.personalInfo.birthDate)} ({calculateAge(selectedSpecialist.personalInfo.birthDate)} лет)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Телефон:</span>
                      <span className="text-white">{selectedSpecialist.personalInfo.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span className="text-white">{selectedSpecialist.personalInfo.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Образование:</span>
                      <span className="text-white text-right">{selectedSpecialist.personalInfo.education}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Опыт работы:</span>
                      <span className="text-white">{selectedSpecialist.personalInfo.experience} лет</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Сертификация:</span>
                      <span className="text-white">до {formatDate(selectedSpecialist.personalInfo.certificationExpiry)}</span>
                    </div>
                  </div>
                </BentoCard>

                <BentoCard className="p-6" glowColor={SPECIALIST_COLORS.consulting}>
                  <h4 className="text-lg font-semibold text-white mb-4">Профессиональная информация</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Должность:</span>
                      <span className="text-white">{selectedSpecialist.professionalInfo.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Отдел:</span>
                      <span className="text-white">{selectedSpecialist.professionalInfo.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Дата найма:</span>
                      <span className="text-white">{formatDate(selectedSpecialist.professionalInfo.hireDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Рабочее место:</span>
                      <span className="text-white">{selectedSpecialist.professionalInfo.office}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">График работы:</span>
                      <span className="text-white">{selectedSpecialist.professionalInfo.workingHours.days.join(', ')} {selectedSpecialist.professionalInfo.workingHours.hours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ставка в час:</span>
                      <span className="text-white font-medium">{formatCurrency(selectedSpecialist.professionalInfo.hourlyRate)}</span>
                    </div>
                  </div>
                </BentoCard>

                <BentoCard className="p-6" glowColor={SPECIALIST_COLORS.education}>
                  <h4 className="text-lg font-semibold text-white mb-4">Квалификация и навыки</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-slate-400 text-sm mb-2">Квалификации:</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedSpecialist.professionalInfo.qualifications.map((qualification, index) => (
                          <span 
                            key={index}
                            className="text-xs text-slate-300 bg-white/10 rounded-full px-3 py-1.5 border border-slate-600/50"
                          >
                            {qualification}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-slate-400 text-sm mb-2">Навыки:</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedSpecialist.professionalInfo.skills.map((skill, index) => (
                          <span 
                            key={index}
                            className="text-xs text-slate-300 bg-white/10 rounded-full px-3 py-1.5 border border-slate-600/50"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-slate-400 text-sm mb-2">Языки:</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedSpecialist.professionalInfo.languages.map((lang, index) => (
                          <span 
                            key={index}
                            className="text-xs text-slate-300 bg-white/10 rounded-full px-3 py-1.5 border border-slate-600/50"
                          >
                            {lang.language} ({lang.level})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </BentoCard>

                <BentoCard className="p-6" glowColor={SPECIALIST_COLORS.available}>
                  <h4 className="text-lg font-semibold text-white mb-4">Производительность</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Рейтинг:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-amber-500">★</span>
                        <span className="text-white font-semibold">{selectedSpecialist.performance.rating}/5</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Клиентов обслужено:</span>
                      <span className="text-white">{selectedSpecialist.performance.clientsServed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Удовлетворенность:</span>
                      <span className="text-white">{selectedSpecialist.performance.satisfactionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Эффективность:</span>
                      <span className="text-white">{selectedSpecialist.performance.efficiency}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Среднее время сессии:</span>
                      <span className="text-white">{selectedSpecialist.performance.averageSessionTime} мин</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Последняя оценка:</span>
                      <span className="text-white">{formatDate(selectedSpecialist.performance.lastEvaluation)}</span>
                    </div>
                  </div>
                </BentoCard>
              </div>

              <BentoCard className="p-6" glowColor={SPECIALIST_COLORS.beauty}>
                <h4 className="text-lg font-semibold text-white mb-4">Текущие записи</h4>
                {selectedSpecialist.currentAppointments.filter(app => app.status === 'scheduled' || app.status === 'in_progress').length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedSpecialist.currentAppointments
                      .filter(app => app.status === 'scheduled' || app.status === 'in_progress')
                      .map((appointment) => (
                      <AppointmentCard 
                        key={appointment.id} 
                        appointment={appointment} 
                        onClick={() => setSelectedAppointment(appointment)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-4">Нет активных записей</p>
                )}
              </BentoCard>

              <BentoCard className="p-6" glowColor={SPECIALIST_COLORS.wellness}>
                <h4 className="text-lg font-semibold text-white mb-4">Финансовая информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Общий заработок:</span>
                    <span className="text-white font-medium">{formatCurrency(selectedSpecialist.financial.totalEarnings)}</span>
                  </div>
                  {selectedSpecialist.financial.salary && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Оклад:</span>
                      <span className="text-white">{formatCurrency(selectedSpecialist.financial.salary)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Комиссия:</span>
                    <span className="text-white">{selectedSpecialist.financial.commission}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Бонусы:</span>
                    <span className="text-white">{formatCurrency(selectedSpecialist.financial.bonuses)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Налоги:</span>
                    <span className="text-white">{selectedSpecialist.financial.taxInfo}</span>
                  </div>
                  {selectedSpecialist.financial.lastRaiseDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Последнее повышение:</span>
                      <span className="text-white">{formatDate(selectedSpecialist.financial.lastRaiseDate)}</span>
                    </div>
                  )}
                  {selectedSpecialist.financial.nextEvaluationDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Следующая оценка:</span>
                      <span className="text-white">{formatDate(selectedSpecialist.financial.nextEvaluationDate)}</span>
                    </div>
                  )}
                </div>
              </BentoCard>

              {selectedSpecialist.performance.notes && (
                <BentoCard className="p-6" glowColor={SPECIALIST_COLORS.repair}>
                  <h4 className="text-lg font-semibold text-white mb-4">Примечания руководителя</h4>
                  <p className="text-slate-300 text-sm">{selectedSpecialist.performance.notes}</p>
                  
                  {selectedSpecialist.performance.achievements && selectedSpecialist.performance.achievements.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-slate-400 text-sm mb-2">Достижения:</h5>
                      <ul className="text-slate-300 text-sm list-disc list-inside space-y-1">
                        {selectedSpecialist.performance.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedSpecialist.performance.improvementAreas && selectedSpecialist.performance.improvementAreas.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-slate-400 text-sm mb-2">Зоны роста:</h5>
                      <ul className="text-slate-300 text-sm list-disc list-inside space-y-1">
                        {selectedSpecialist.performance.improvementAreas.map((area, index) => (
                          <li key={index}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </BentoCard>
              )}
            </div>
          )}
        </Modal>

        <Modal 
          key="appointment-modal"
          isOpen={!!selectedAppointment} 
          onClose={() => setSelectedAppointment(null)}
          title="Информация о записи"
          size="lg"
        >
          {selectedAppointment && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BentoCard className="p-6" glowColor={SPECIALIST_COLORS.active}>
                  <h4 className="text-lg font-semibold text-white mb-4">Информация о клиенте</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Клиент:</span>
                      <span className="text-white">{selectedAppointment.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Телефон:</span>
                      <span className="text-white">{selectedAppointment.clientPhone}</span>
                    </div>
                    {selectedAppointment.clientEmail && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="text-white">{selectedAppointment.clientEmail}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Приоритет:</span>
                      <StatusBadge status={selectedAppointment.priority} />
                    </div>
                    {selectedAppointment.specialRequirements && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Особые требования:</span>
                        <span className="text-white text-right">{selectedAppointment.specialRequirements}</span>
                      </div>
                    )}
                    {selectedAppointment.clientNotes && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Заметки клиента:</span>
                        <span className="text-white text-right">{selectedAppointment.clientNotes}</span>
                      </div>
                    )}
                  </div>
                </BentoCard>

                <BentoCard className="p-6" glowColor={SPECIALIST_COLORS.available}>
                  <h4 className="text-lg font-semibold text-white mb-4">Детали услуги</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Тип услуги:</span>
                      <div className="flex items-center space-x-2">
                        <span>{getServiceTypeIcon(selectedAppointment.serviceType)}</span>
                        <StatusBadge status={selectedAppointment.serviceType} />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Статус:</span>
                      <StatusBadge status={selectedAppointment.status} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Оплата:</span>
                      <StatusBadge status={selectedAppointment.paymentStatus} type="payment" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Описание:</span>
                      <span className="text-white text-right">{selectedAppointment.serviceDescription}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Длительность:</span>
                      <span className="text-white">{selectedAppointment.duration} мин</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Стоимость:</span>
                      <span className="text-white font-medium">{formatCurrency(selectedAppointment.cost)}</span>
                    </div>
                  </div>
                </BentoCard>
              </div>

              <BentoCard className="p-6" glowColor={SPECIALIST_COLORS.consulting}>
                <h4 className="text-lg font-semibold text-white mb-4">Расписание</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дата:</span>
                    <span className="text-white">{formatDate(selectedAppointment.scheduledDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Время начала:</span>
                    <span className="text-white">{formatTime(selectedAppointment.startTime)}</span>
                  </div>
                  {selectedAppointment.endTime && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Время окончания:</span>
                      <span className="text-white">{formatTime(selectedAppointment.endTime)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Место:</span>
                    <span className="text-white">{selectedAppointment.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Напоминание:</span>
                    <span className="text-white">{selectedAppointment.reminderSent ? 'Отправлено' : 'Не отправлено'}</span>
                  </div>
                </div>
              </BentoCard>

              {selectedAppointment.notes && (
                <BentoCard className="p-6" glowColor={SPECIALIST_COLORS.education}>
                  <h4 className="text-lg font-semibold text-white mb-4">Дополнительные заметки</h4>
                  <p className="text-slate-300 text-sm">{selectedAppointment.notes}</p>
                </BentoCard>
              )}

              {selectedAppointment.specialistId && (
                <BentoCard className="p-6" glowColor={SPECIALIST_COLORS.purple}>
                  <h4 className="text-lg font-semibold text-white mb-4">Специалист</h4>
                  <div className="flex items-center space-x-3">
                    {(() => {
                      const specialist = specialists.find(s => s.id === selectedAppointment.specialistId);
                      if (!specialist) return null;
                      
                      return (
                        <>
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${generateColorFromName(specialist.personalInfo.fullName)} flex items-center justify-center text-white font-bold text-sm`}>
                            {getInitials(specialist.personalInfo.fullName)}
                          </div>
                          <div className="flex-1">
                            <h5 className="text-white font-medium">{specialist.personalInfo.fullName}</h5>
                            <p className="text-slate-400 text-sm">{specialist.professionalInfo.specialization}</p>
                          </div>
                          <button
                            onClick={() => setSelectedSpecialist(specialist)}
                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm transition-colors duration-200"
                          >
                            Профиль
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </BentoCard>
              )}
            </div>
          )}
        </Modal>
      </AnimatePresence>
    </div>
  );
};

export default SpecialistManagementDashboard;
