'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// =============================================================================
// КОНСТАНТЫ И ТИПЫ
// =============================================================================

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
  slate: '100, 116, 139',
  violet: '139, 92, 246',
  fuchsia: '217, 70, 239',
  pink: '236, 72, 153',
  sky: '14, 165, 233',
  lime: '132, 204, 22',
  green: '74, 222, 128',
  yellow: '250, 204, 21'
} as const;

const MECHANIC_COLORS = {
  active: '34, 197, 94',
  inactive: '100, 116, 139',
  busy: '239, 68, 68',
  available: '59, 130, 246',
  on_break: '245, 158, 11',
  diagnostic: '16, 185, 129',
  repair: '249, 115, 22',
  maintenance: '59, 130, 246',
  electrical: '147, 51, 234',
  engine: '239, 68, 68',
  suspension: '34, 211, 238',
  high: '239, 68, 68',
  medium: '245, 158, 11',
  low: '34, 197, 94',
  urgent: '159, 18, 57',
  scheduled: '20, 184, 166',
  completed: '34, 197, 94',
  cancelled: '100, 116, 139'
} as const;

const WORKSHOPS = {
  'Цех №1': { color: COLORS.blue, icon: '🏭', description: 'Двигатели и ходовая часть' },
  'Цех №2': { color: COLORS.emerald, icon: '🏗️', description: 'Электрика и электроника' },
  'Диагностический цех': { color: COLORS.purple, icon: '🔍', description: 'Компьютерная диагностика' },
  'Кузовной цех': { color: COLORS.orange, icon: '🚗', description: 'Кузовные работы и покраска' },
  'Шиномонтаж': { color: COLORS.teal, icon: '🌀', description: 'Шиномонтаж и балансировка' }
} as const;

const SPECIALIZATIONS = {
  diagnostic: { label: 'Диагностика', icon: '🔍', color: MECHANIC_COLORS.diagnostic },
  repair: { label: 'Ремонт', icon: '🔧', color: MECHANIC_COLORS.repair },
  maintenance: { label: 'Обслуживание', icon: '🛠️', color: MECHANIC_COLORS.maintenance },
  electrical: { label: 'Электрика', icon: '⚡', color: MECHANIC_COLORS.electrical },
  engine: { label: 'Двигатель', icon: '🚗', color: MECHANIC_COLORS.engine },
  suspension: { label: 'Подвеска', icon: '🔄', color: MECHANIC_COLORS.suspension },
  body: { label: 'Кузовные работы', icon: '🚙', color: COLORS.orange },
  tire: { label: 'Шиномонтаж', icon: '🌀', color: COLORS.teal }
} as const;

// =============================================================================
// УТИЛИТЫ
// =============================================================================

const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions = {}) => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('ru-RU', { ...defaultOptions, ...options });
};

const formatTime = (timeString: string) => {
  return new Date(timeString).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
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

const getTimeRemaining = (endTime: string) => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return { hours: 0, minutes: 0, overdue: true };
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { hours, minutes, overdue: false };
};

const generateId = (prefix: string) => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}-${Date.now().toString(36)}`;
};

const getInitials = (fullName: string) => {
  return fullName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
};

const getRandomColor = () => {
  const colors = Object.values(COLORS).filter(color => !color.includes('slate'));
  return colors[Math.floor(Math.random() * colors.length)];
};

const getDaysBetween = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// =============================================================================
// БАЗОВЫЕ КОМПОНЕНТЫ UI
// =============================================================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'md',
  closeOnBackdrop = true,
  showCloseButton = true
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  };

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose, closeOnBackdrop]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdropClick}
    >
      <motion.div
        ref={modalRef}
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
              {showCloseButton && (
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200 text-slate-400 hover:text-white active:scale-95"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Закрыть"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
            </div>
          </div>
        )}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-80px)] custom-scrollbar">
          {children}
        </div>
      </motion.div>
    </motion.div>
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
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative overflow-hidden 
        rounded-3xl border border-slate-700/50
        bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-xl
        transition-all duration-500
        w-full max-w-full
        group
        ${hoverable ? 'hover:border-slate-600/70 hover:shadow-2xl' : ''}
        ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
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
      animate={animated ? { 
        opacity: isInView ? 1 : 0, 
        y: isInView ? 0 : 20 
      } : false}
      transition={{ delay: delay * 0.1, duration: 0.6 }}
      whileHover={hoverable ? { 
        y: -4, 
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      } : {}}
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
};

interface StatusBadgeProps {
  status: string;
  type?: 'default' | 'client' | 'service' | 'booking' | 'provider';
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  type = 'default', 
  animated = false, 
  size = 'md',
  className = ''
}) => {
  const getStatusConfig = () => {
    const configs = {
      active: { color: COLORS.success, label: 'Активен', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', icon: '🟢' },
      inactive: { color: COLORS.slate, label: 'Неактивен', bg: 'bg-slate-500/15', border: 'border-slate-500/30', icon: '⚫' },
      busy: { color: COLORS.error, label: 'Занят', bg: 'bg-red-500/15', border: 'border-red-500/30', icon: '🔴' },
      available: { color: COLORS.blue, label: 'Доступен', bg: 'bg-blue-500/15', border: 'border-blue-500/30', icon: '🟢' },
      on_break: { color: COLORS.orange, label: 'На перерыве', bg: 'bg-orange-500/15', border: 'border-orange-500/30', icon: '🟡' },
      scheduled: { color: COLORS.teal, label: 'Запланирован', bg: 'bg-teal-500/15', border: 'border-teal-500/30', icon: '📅' },
      in_progress: { color: COLORS.blue, label: 'В работе', bg: 'bg-blue-500/15', border: 'border-blue-500/30', icon: '⚙️' },
      completed: { color: COLORS.success, label: 'Завершен', bg: 'bg-green-500/15', border: 'border-green-500/30', icon: '✅' },
      cancelled: { color: COLORS.error, label: 'Отменен', bg: 'bg-red-500/15', border: 'border-red-500/30', icon: '❌' },
      diagnostic: { color: MECHANIC_COLORS.diagnostic, label: 'Диагностика', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', icon: '🔍' },
      repair: { color: MECHANIC_COLORS.repair, label: 'Ремонт', bg: 'bg-orange-500/15', border: 'border-orange-500/30', icon: '🔧' },
      maintenance: { color: MECHANIC_COLORS.maintenance, label: 'Обслуживание', bg: 'bg-blue-500/15', border: 'border-blue-500/30', icon: '🛠️' },
      electrical: { color: MECHANIC_COLORS.electrical, label: 'Электрика', bg: 'bg-purple-500/15', border: 'border-purple-500/30', icon: '⚡' },
      engine: { color: MECHANIC_COLORS.engine, label: 'Двигатель', bg: 'bg-red-500/15', border: 'border-red-500/30', icon: '🚗' },
      suspension: { color: MECHANIC_COLORS.suspension, label: 'Подвеска', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30', icon: '🔄' },
      high: { color: MECHANIC_COLORS.high, label: 'Высокий', bg: 'bg-red-500/15', border: 'border-red-500/30', icon: '🔴' },
      medium: { color: MECHANIC_COLORS.medium, label: 'Средний', bg: 'bg-orange-500/15', border: 'border-orange-500/30', icon: '🟡' },
      low: { color: MECHANIC_COLORS.low, label: 'Низкий', bg: 'bg-green-500/15', border: 'border-green-500/30', icon: '🟢' },
      urgent: { color: MECHANIC_COLORS.urgent, label: 'Срочный', bg: 'bg-rose-500/15', border: 'border-rose-500/30', icon: '🚨' },
      body: { color: COLORS.orange, label: 'Кузовные работы', bg: 'bg-orange-500/15', border: 'border-orange-500/30', icon: '🚙' },
      tire: { color: COLORS.teal, label: 'Шиномонтаж', bg: 'bg-teal-500/15', border: 'border-teal-500/30', icon: '🌀' }
    };

    return configs[status as keyof typeof configs] || { 
      color: COLORS.slate, 
      label: status, 
      bg: 'bg-slate-500/15', 
      border: 'border-slate-500/30',
      icon: '⚫'
    };
  };

  const config = getStatusConfig();
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm'
  };

  return (
    <motion.span 
      className={`inline-flex items-center rounded-full font-medium border backdrop-blur-sm ${config.bg} ${config.border} ${sizeClasses[size]} ${className}`}
      style={{ color: `rgb(${config.color})` }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {animated && (
        <motion.div 
          className={`${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full mr-2`}
          style={{ backgroundColor: `rgb(${config.color})` }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {!animated && (
        <span className="mr-1.5">{config.icon}</span>
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
  showAnimation?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max = 100, 
  color = COLORS.teal, 
  label, 
  showValue = true, 
  size = 'md',
  animated = true,
  showAnimation = true
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
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ 
            backgroundColor: `rgb(${color})`,
            boxShadow: `0 0 12px rgba(${color}, 0.4)`
          }}
        >
          {showAnimation && percentage > 0 && (
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </motion.div>
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
  formatValue?: (value: string | number) => string;
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
  delay = 0,
  formatValue
}) => {
  const trendConfig = trend || (change !== undefined ? (change >= 0 ? 'up' : 'down') : 'neutral');
  const formattedValue = formatValue ? formatValue(value) : value;
  
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
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
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
            transition={{ delay: delay * 0.1 + 0.3, type: "spring", stiffness: 500, damping: 15 }}
          >
            {trendConfig === 'up' ? '↗' : '↘'} {change !== undefined ? `${Math.abs(change)}%` : ''}
          </motion.div>
        )}
      </div>
      <motion.div 
        className="text-2xl lg:text-3xl font-bold text-white mb-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay * 0.1 + 0.2 }}
      >
        {formattedValue}
      </motion.div>
      <div className="text-slate-300 text-sm font-medium">{title}</div>
      {subtitle && <div className="text-slate-400 text-xs mt-1">{subtitle}</div>}
    </BentoCard>
  );
};

// =============================================================================
// ТИПЫ ДАННЫХ
// =============================================================================

interface PersonalInfo {
  fullName: string;
  birthDate: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
  address: string;
  education: string;
  experience: number;
  certification: string;
  certificationExpiry: string;
  avatar?: string;
}

interface ProfessionalInfo {
  specialization: keyof typeof SPECIALIZATIONS;
  department: string;
  position: string;
  qualifications: string[];
  skills: string[];
  status: 'active' | 'inactive' | 'busy' | 'available' | 'on_break';
  hireDate: string;
  workshop: keyof typeof WORKSHOPS;
  workingHours: {
    days: string[];
    hours: string;
    timezone: string;
  };
  salary?: number;
  level: 'junior' | 'middle' | 'senior' | 'lead';
}

interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color?: string;
  mileage?: number;
  fuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid';
}

interface Part {
  id: string;
  name: string;
  quantity: number;
  cost: number;
  status: 'ordered' | 'in_stock' | 'installed' | 'waiting';
  supplier?: string;
  deliveryDate?: string;
  warranty?: string;
}

interface ServiceJob {
  id: string;
  vehicle: VehicleInfo;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  serviceType: keyof typeof SPECIALIZATIONS;
  description: string;
  detailedDescription?: string;
  estimatedHours: number;
  actualHours?: number;
  cost: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  bay: string;
  parts: Part[];
  notes?: string;
  assignedMechanic?: string;
  createdAt: string;
  updatedAt: string;
  customerNotes?: string;
  internalNotes?: string;
  images?: string[];
}

interface Performance {
  rating: number;
  jobsCompleted: number;
  efficiency: number;
  qualityScore: number;
  averageJobTime: number;
  lastEvaluation: string;
  notes?: string;
  monthlyStats?: {
    month: string;
    jobsCompleted: number;
    efficiency: number;
    revenue: number;
  }[];
}

interface Tools {
  assignedTools: string[];
  toolCondition: 'excellent' | 'good' | 'needs_maintenance' | 'under_repair';
  lastToolCheck: string;
  nextCheckDate: string;
  toolWarranties: {
    tool: string;
    warrantyUntil: string;
  }[];
}

interface Mechanic {
  id: string;
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
  currentWork: ServiceJob[];
  performance: Performance;
  tools: Tools;
  achievements?: string[];
  vacations?: {
    start: string;
    end: string;
    type: 'vacation' | 'sick' | 'personal';
    status: 'planned' | 'approved' | 'in_progress' | 'completed';
  }[];
}

// =============================================================================
// МОКИ ДАННЫХ
// =============================================================================

const mechanics: Mechanic[] = [
  {
    id: 'mec-001',
    personalInfo: {
      fullName: 'Петров Иван Сергеевич',
      birthDate: '1985-03-15',
      gender: 'male',
      phone: '+7 (916) 123-45-67',
      email: 'i.petrov@garage.ru',
      address: 'г. Москва, ул. Ленина, д. 25, кв. 12',
      education: 'Среднее специальное, Автомеханический колледж',
      experience: 15,
      certification: 'CAT-001234',
      certificationExpiry: '2025-12-31',
      avatar: '/avatars/petrov.jpg'
    },
    professionalInfo: {
      specialization: 'engine',
      department: 'Двигатели',
      position: 'Старший механик',
      qualifications: ['Диагностика ДВС', 'Ремонт турбин', 'Замена ГРМ', 'Капитальный ремонт', 'Чип-тюнинг'],
      skills: ['Диагностика', 'Ремонт двигателей', 'Электроника', 'Сварка', 'Черчение', 'Руководство командой'],
      status: 'busy',
      hireDate: '2015-03-10',
      workshop: 'Цех №1',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
        hours: '08:00-17:00',
        timezone: 'Europe/Moscow'
      },
      salary: 85000,
      level: 'senior'
    },
    currentWork: [
      {
        id: 'job-001',
        vehicle: {
          make: 'Toyota',
          model: 'Camry',
          year: 2022,
          licensePlate: 'A123BC777',
          vin: 'JTDBU4E37CL000001',
          color: 'Серебристый',
          mileage: 45000,
          fuelType: 'petrol'
        },
        ownerName: 'Иванова Мария',
        ownerPhone: '+7 (916) 999-88-77',
        ownerEmail: 'maria.ivanova@email.ru',
        serviceType: 'engine',
        description: 'Замена цепи ГРМ и ремонт головки блока цилиндров',
        detailedDescription: 'Полная диагностика двигателя, замена цепи ГРМ, прокладки ГБЦ, маслосъемных колпачков. Проверка компрессии, диагностика системы зажигания и впрыска.',
        estimatedHours: 6,
        actualHours: 5.5,
        cost: 45000,
        status: 'in_progress',
        priority: 'high',
        scheduledDate: '2024-06-25',
        startTime: '2024-06-25T09:00:00',
        endTime: '2024-06-25T16:30:00',
        bay: 'Бокс 3',
        assignedMechanic: 'mec-001',
        parts: [
          {
            id: 'part-001',
            name: 'Цепь ГРМ оригинал',
            quantity: 1,
            cost: 15000,
            status: 'installed',
            supplier: 'Toyota Parts',
            warranty: '2 года'
          },
          {
            id: 'part-002',
            name: 'Прокладка ГБЦ',
            quantity: 1,
            cost: 8000,
            status: 'installed',
            supplier: 'Toyota Parts'
          },
          {
            id: 'part-003',
            name: 'Масло моторное 5W-30',
            quantity: 5,
            cost: 7500,
            status: 'installed',
            supplier: 'Lukoil'
          }
        ],
        notes: 'Требуется дополнительная диагностика после замены. Клиент жаловался на шум при холодном запуске.',
        customerNotes: 'Машина начала шуметь на холодную, особенно по утрам',
        internalNotes: 'Проверить натяжитель цепи после замены',
        createdAt: '2024-06-20T10:00:00',
        updatedAt: '2024-06-25T14:30:00',
        images: ['/jobs/001/engine1.jpg', '/jobs/001/engine2.jpg']
      },
      {
        id: 'job-005',
        vehicle: {
          make: 'Honda',
          model: 'CR-V',
          year: 2020,
          licensePlate: 'B234CD777',
          vin: '5J6RE4H43CL000005',
          color: 'Черный',
          mileage: 78000,
          fuelType: 'petrol'
        },
        ownerName: 'Соколов Андрей',
        ownerPhone: '+7 (916) 888-99-00',
        serviceType: 'engine',
        description: 'Замена масла и фильтров, диагностика системы охлаждения',
        estimatedHours: 2,
        cost: 8000,
        status: 'scheduled',
        priority: 'medium',
        scheduledDate: '2024-06-26',
        startTime: '2024-06-26T10:00:00',
        bay: 'Бокс 3',
        assignedMechanic: 'mec-001',
        parts: [
          {
            id: 'part-006',
            name: 'Масляный фильтр',
            quantity: 1,
            cost: 1200,
            status: 'in_stock',
            supplier: 'Honda Parts'
          }
        ],
        createdAt: '2024-06-24T14:00:00',
        updatedAt: '2024-06-24T14:00:00'
      }
    ],
    performance: {
      rating: 4.9,
      jobsCompleted: 2450,
      efficiency: 95,
      qualityScore: 98,
      averageJobTime: 4.2,
      lastEvaluation: '2024-05-20',
      notes: 'Высококвалифицированный специалист. Сложные работы выполняет безупречно. Отличные организаторские способности. Обладает лидерскими качествами.',
      monthlyStats: [
        { month: '2024-05', jobsCompleted: 42, efficiency: 96, revenue: 1250000 },
        { month: '2024-04', jobsCompleted: 38, efficiency: 94, revenue: 1100000 },
        { month: '2024-03', jobsCompleted: 45, efficiency: 97, revenue: 1350000 }
      ]
    },
    tools: {
      assignedTools: ['Диагностический сканер Launch X431', 'Компрессометр цифровой', 'Стенд для ГРМ', 'Торцевой ключевой набор 150 предметов', 'Динамический стенд'],
      toolCondition: 'excellent',
      lastToolCheck: '2024-05-15',
      nextCheckDate: '2024-08-15',
      toolWarranties: [
        { tool: 'Диагностический сканер Launch X431', warrantyUntil: '2026-05-15' },
        { tool: 'Компрессометр цифровой', warrantyUntil: '2025-11-20' }
      ]
    },
    achievements: ['Лучший механик 2023', 'Рекорд по количеству выполненных работ', 'Эксперт по двигателям Toyota'],
    vacations: [
      { start: '2024-07-01', end: '2024-07-14', type: 'vacation', status: 'approved' }
    ]
  },
  {
    id: 'mec-002',
    personalInfo: {
      fullName: 'Смирнова Елена Викторовна',
      birthDate: '1990-07-22',
      gender: 'female',
      phone: '+7 (925) 234-56-78',
      email: 'e.smirnova@garage.ru',
      address: 'г. Москва, пр. Мира, д. 89, кв. 45',
      education: 'Высшее, МГТУ им. Баумана',
      experience: 8,
      certification: 'CAT-002345',
      certificationExpiry: '2024-11-30',
      avatar: '/avatars/smirnova.jpg'
    },
    professionalInfo: {
      specialization: 'electrical',
      department: 'Электрика',
      position: 'Электрик',
      qualifications: ['Автоэлектрика', 'Диагностика ЭБУ', 'Ремонт проводки', 'Программирование блоков', 'Адаптация систем'],
      skills: ['Электрика', 'Диагностика', 'Программирование', 'Паяльные работы', 'Чтение схем', 'Английский технический'],
      status: 'available',
      hireDate: '2019-07-15',
      workshop: 'Цех №2',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
        hours: '09:00-18:00',
        timezone: 'Europe/Moscow'
      },
      salary: 75000,
      level: 'senior'
    },
    currentWork: [
      {
        id: 'job-002',
        vehicle: {
          make: 'BMW',
          model: 'X5',
          year: 2021,
          licensePlate: 'B456DE777',
          vin: '5UXKR0C56K0S00002',
          color: 'Черный',
          mileage: 32000,
          fuelType: 'diesel'
        },
        ownerName: 'Сидоров Алексей',
        ownerPhone: '+7 (916) 888-77-66',
        ownerEmail: 'alex.sidorov@email.ru',
        serviceType: 'electrical',
        description: 'Диагностика и ремонт бортовой электроники',
        detailedDescription: 'Комплексная диагностика электронных систем автомобиля. Поиск неисправностей в мультимедийной системе, датчиках парковки, системе комфорта. Программирование блоков управления.',
        estimatedHours: 3,
        cost: 25000,
        status: 'scheduled',
        priority: 'medium',
        scheduledDate: '2024-06-25',
        startTime: '2024-06-25T14:00:00',
        bay: 'Бокс 5',
        assignedMechanic: 'mec-002',
        parts: [
          {
            id: 'part-003',
            name: 'Датчик парковки передний',
            quantity: 2,
            cost: 8500,
            status: 'ordered',
            supplier: 'BMW Original',
            deliveryDate: '2024-06-26'
          },
          {
            id: 'part-004',
            name: 'Предохранители',
            quantity: 10,
            cost: 1200,
            status: 'in_stock',
            supplier: 'Bosch'
          }
        ],
        customerNotes: 'Не работают датчики парковки спереди, иногда глючит мультимедиа',
        internalNotes: 'Проверить CAN-шину, возможны проблемы с коммуникацией',
        createdAt: '2024-06-23T11:30:00',
        updatedAt: '2024-06-24T09:15:00'
      }
    ],
    performance: {
      rating: 4.8,
      jobsCompleted: 890,
      efficiency: 92,
      qualityScore: 96,
      averageJobTime: 2.8,
      lastEvaluation: '2024-04-15',
      notes: 'Внимательная к деталям. Отлично разбирается в современной электронике. Быстро осваивает новое оборудование. Ответственный подход к работе.',
      monthlyStats: [
        { month: '2024-05', jobsCompleted: 28, efficiency: 93, revenue: 680000 },
        { month: '2024-04', jobsCompleted: 25, efficiency: 91, revenue: 620000 },
        { month: '2024-03', jobsCompleted: 30, efficiency: 94, revenue: 720000 }
      ]
    },
    tools: {
      assignedTools: ['Осциллограф цифровой', 'Мультиметр Fluke', 'Программатор ЭБУ', 'Паяльная станция', 'Набор диагностических кабелей'],
      toolCondition: 'good',
      lastToolCheck: '2024-04-20',
      nextCheckDate: '2024-07-20',
      toolWarranties: [
        { tool: 'Мультиметр Fluke', warrantyUntil: '2025-12-15' }
      ]
    },
    achievements: ['Специалист по BMW/Mercedes', 'Лучший результат по качеству работ'],
    vacations: [
      { start: '2024-08-05', end: '2024-08-19', type: 'vacation', status: 'planned' }
    ]
  },
  {
    id: 'mec-003',
    personalInfo: {
      fullName: 'Кузнецов Дмитрий Александрович',
      birthDate: '1978-12-03',
      gender: 'male',
      phone: '+7 (916) 345-67-89',
      email: 'd.kuznetsov@garage.ru',
      address: 'г. Москва, ул. Пушкина, д. 15, кв. 78',
      education: 'Среднее специальное, Техническое училище',
      experience: 20,
      certification: 'CAT-003456',
      certificationExpiry: '2026-03-15',
      avatar: '/avatars/kuznetsov.jpg'
    },
    professionalInfo: {
      specialization: 'suspension',
      department: 'Ходовая часть',
      position: 'Механик',
      qualifications: ['Ремонт подвески', 'Развал-схождение', 'Замена тормозов', 'Балансировка', 'Ремонт рулевого управления'],
      skills: ['Ходовая часть', 'Тормозная система', 'Рулевое управление', 'Сварка рам', 'Кузовные работы', 'Аргонная сварка'],
      status: 'on_break',
      hireDate: '2010-11-20',
      workshop: 'Цех №1',
      workingHours: {
        days: ['Пн', 'Вт', 'Чт', 'Пт'],
        hours: '07:00-16:00',
        timezone: 'Europe/Moscow'
      },
      salary: 70000,
      level: 'senior'
    },
    currentWork: [
      {
        id: 'job-003',
        vehicle: {
          make: 'Volkswagen',
          model: 'Tiguan',
          year: 2020,
          licensePlate: 'C789FG777',
          vin: 'WVGAV7AX7LW000003',
          color: 'Белый',
          mileage: 65000,
          fuelType: 'diesel'
        },
        ownerName: 'Громов Павел',
        ownerPhone: '+7 (916) 777-66-55',
        serviceType: 'suspension',
        description: 'Замена амортизаторов и стабилизаторов',
        detailedDescription: 'Полная замена передних и задних амортизаторов, стоек стабилизатора. Регулировка развала-схождения. Диагностика состояния подвески.',
        estimatedHours: 4,
        cost: 32000,
        status: 'scheduled',
        priority: 'medium',
        scheduledDate: '2024-06-25',
        startTime: '2024-06-25T10:00:00',
        bay: 'Бокс 2',
        assignedMechanic: 'mec-003',
        parts: [
          {
            id: 'part-004',
            name: 'Амортизатор передний Sachs',
            quantity: 2,
            cost: 18000,
            status: 'in_stock',
            supplier: 'Sachs',
            warranty: '2 года'
          },
          {
            id: 'part-005',
            name: 'Стойка стабилизатора',
            quantity: 4,
            cost: 6000,
            status: 'in_stock',
            supplier: 'Lemforder'
          }
        ],
        customerNotes: 'Стучит передняя подвеска на неровностях',
        createdAt: '2024-06-22T16:45:00',
        updatedAt: '2024-06-24T10:20:00'
      }
    ],
    performance: {
      rating: 4.7,
      jobsCompleted: 3120,
      efficiency: 90,
      qualityScore: 95,
      averageJobTime: 3.5,
      lastEvaluation: '2024-03-10',
      notes: 'Опытный механик. Быстро и качественно выполняет работы по ходовой части. Надежный сотрудник. Отлично работает в команде.',
      monthlyStats: [
        { month: '2024-05', jobsCompleted: 35, efficiency: 89, revenue: 980000 },
        { month: '2024-04', jobsCompleted: 32, efficiency: 88, revenue: 890000 },
        { month: '2024-03', jobsCompleted: 38, efficiency: 91, revenue: 1050000 }
      ]
    },
    tools: {
      assignedTools: ['Стенд развала-схождения Hunter', 'Пресс для сайлентблоков 20т', 'Комплект ключей 1/2', 'Домкраты гидравлические', 'Станция балансировки колес'],
      toolCondition: 'good',
      lastToolCheck: '2024-03-15',
      nextCheckDate: '2024-06-15',
      toolWarranties: [
        { tool: 'Стенд развала-схождения Hunter', warrantyUntil: '2027-01-10' }
      ]
    },
    achievements: ['Мастер ходовой части', '20 лет безупречной работы'],
    vacations: []
  },
  {
    id: 'mec-004',
    personalInfo: {
      fullName: 'Волкова Анна Михайловна',
      birthDate: '1992-04-18',
      gender: 'female',
      phone: '+7 (925) 456-78-90',
      email: 'a.volkova@garage.ru',
      address: 'г. Москва, ул. Гагарина, д. 67, кв. 34',
      education: 'Среднее специальное, Автотехнический колледж',
      experience: 6,
      certification: 'CAT-004567',
      certificationExpiry: '2025-06-30',
      avatar: '/avatars/volkova.jpg'
    },
    professionalInfo: {
      specialization: 'diagnostic',
      department: 'Диагностика',
      position: 'Диагност',
      qualifications: ['Компьютерная диагностика', 'Анализ данных', 'Техническая экспертиза', 'Экспресс-диагностика', 'Анализ моторных данных'],
      skills: ['Диагностика', 'Анализ', 'Отчетность', 'Работа с ПО', 'Технический английский', 'Статистический анализ'],
      status: 'active',
      hireDate: '2021-09-01',
      workshop: 'Диагностический цех',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        hours: '08:00-17:00',
        timezone: 'Europe/Moscow'
      },
      salary: 68000,
      level: 'middle'
    },
    currentWork: [
      {
        id: 'job-004',
        vehicle: {
          make: 'Mercedes',
          model: 'E-Class',
          year: 2023,
          licensePlate: 'D012HI777',
          vin: 'W1K1776F0RA000004',
          color: 'Серый',
          mileage: 15000,
          fuelType: 'petrol'
        },
        ownerName: 'Николаев Игорь',
        ownerPhone: '+7 (916) 666-55-44',
        ownerEmail: 'igor.nikolaev@email.ru',
        serviceType: 'diagnostic',
        description: 'Полная компьютерная диагностика',
        detailedDescription: 'Комплексная компьютерная диагностика всех систем автомобиля: двигатель, трансмиссия, тормозная система, система комфорта, мультимедиа. Анализ реальных параметров, чтение ошибок, генерация отчетов.',
        estimatedHours: 2,
        cost: 8000,
        status: 'in_progress',
        priority: 'low',
        scheduledDate: '2024-06-25',
        startTime: '2024-06-25T11:00:00',
        bay: 'Диагностический бокс',
        assignedMechanic: 'mec-004',
        parts: [],
        notes: 'Обнаружены ошибки в системе управления двигателем P0300-P0304. Требуется дополнительная проверка свечей и катушек зажигания.',
        customerNotes: 'Загорается check engine, машина иногда троит',
        internalNotes: 'Провести тест катушек зажигания под нагрузкой',
        createdAt: '2024-06-24T09:00:00',
        updatedAt: '2024-06-25T12:30:00',
        images: ['/jobs/004/diagnostic1.jpg']
      },
      {
        id: 'job-006',
        vehicle: {
          make: 'Audi',
          model: 'A4',
          year: 2021,
          licensePlate: 'E345JK777',
          vin: 'WAUAFCF41MA000006',
          color: 'Синий',
          mileage: 42000,
          fuelType: 'petrol'
        },
        ownerName: 'Орлова Дарья',
        ownerPhone: '+7 (916) 555-44-33',
        serviceType: 'diagnostic',
        description: 'Диагностика климатической системы и мультимедиа',
        estimatedHours: 1.5,
        cost: 5000,
        status: 'scheduled',
        priority: 'low',
        scheduledDate: '2024-06-25',
        startTime: '2024-06-25T15:00:00',
        bay: 'Диагностический бокс',
        assignedMechanic: 'mec-004',
        parts: [],
        createdAt: '2024-06-23T17:30:00',
        updatedAt: '2024-06-23T17:30:00'
      }
    ],
    performance: {
      rating: 4.9,
      jobsCompleted: 420,
      efficiency: 98,
      qualityScore: 99,
      averageJobTime: 1.8,
      lastEvaluation: '2024-05-05',
      notes: 'Точная диагностика. Отличные аналитические способности. Внимание к деталям. Быстро обучается новым методикам.',
      monthlyStats: [
        { month: '2024-05', jobsCompleted: 45, efficiency: 99, revenue: 320000 },
        { month: '2024-04', jobsCompleted: 42, efficiency: 98, revenue: 300000 },
        { month: '2024-03', jobsCompleted: 48, efficiency: 99, revenue: 350000 }
      ]
    },
    tools: {
      assignedTools: ['Диагностический компьютер Mercedes XENTRY', 'Сканер OBD2 Autel', 'Тепловизор Fluke', 'Мотор-тестер', 'Осциллограф 4-канальный'],
      toolCondition: 'excellent',
      lastToolCheck: '2024-05-28',
      nextCheckDate: '2024-08-28',
      toolWarranties: [
        { tool: 'Диагностический компьютер Mercedes XENTRY', warrantyUntil: '2026-12-01' }
      ]
    },
    achievements: ['Сертифицированный специалист Mercedes-Benz', 'Лучший диагност 2024'],
    vacations: [
      { start: '2024-07-20', end: '2024-07-27', type: 'vacation', status: 'approved' }
    ]
  },
  {
    id: 'mec-005',
    personalInfo: {
      fullName: 'Новиков Сергей Петрович',
      birthDate: '1988-09-14',
      gender: 'male',
      phone: '+7 (916) 567-89-01',
      email: 's.novikov@garage.ru',
      address: 'г. Москва, ул. Тверская, д. 34, кв. 12',
      education: 'Среднее специальное, Автомеханический техникум',
      experience: 10,
      certification: 'CAT-005678',
      certificationExpiry: '2025-08-20',
      avatar: '/avatars/novikov.jpg'
    },
    professionalInfo: {
      specialization: 'maintenance',
      department: 'Техническое обслуживание',
      position: 'Механик ТО',
      qualifications: ['Регламентное ТО', 'Замена жидкостей', 'Диагностика ходовой', 'Замена фильтров', 'Обслуживание АКПП'],
      skills: ['Техническое обслуживание', 'Диагностика', 'Работа с клиентами', 'Контроль качества', 'Ведение документации'],
      status: 'available',
      hireDate: '2018-04-15',
      workshop: 'Цех №2',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        hours: '08:00-17:00',
        timezone: 'Europe/Moscow'
      },
      salary: 60000,
      level: 'middle'
    },
    currentWork: [
      {
        id: 'job-007',
        vehicle: {
          make: 'Kia',
          model: 'Rio',
          year: 2022,
          licensePlate: 'F678LM777',
          vin: 'KNAFX4A20N5000007',
          color: 'Красный',
          mileage: 30000,
          fuelType: 'petrol'
        },
        ownerName: 'Зайцева Ольга',
        ownerPhone: '+7 (916) 444-33-22',
        ownerEmail: 'olga.zaytseva@email.ru',
        serviceType: 'maintenance',
        description: 'Плановое техническое обслуживание 30 000 км',
        detailedDescription: 'Выполнение планового технического обслуживания согласно регламенту: замена моторного масла и фильтра, воздушного фильтра, проверка систем автомобиля, компьютерная диагностика.',
        estimatedHours: 2.5,
        cost: 12000,
        status: 'scheduled',
        priority: 'medium',
        scheduledDate: '2024-06-26',
        startTime: '2024-06-26T09:00:00',
        bay: 'Бокс 4',
        assignedMechanic: 'mec-005',
        parts: [
          {
            id: 'part-007',
            name: 'Масло моторное 5W-30',
            quantity: 4,
            cost: 6000,
            status: 'in_stock',
            supplier: 'Shell'
          },
          {
            id: 'part-008',
            name: 'Воздушный фильтр',
            quantity: 1,
            cost: 1800,
            status: 'in_stock',
            supplier: 'Mann-Filter'
          },
          {
            id: 'part-009',
            name: 'Масляный фильтр',
            quantity: 1,
            cost: 1200,
            status: 'in_stock',
            supplier: 'Kia Original'
          }
        ],
        customerNotes: 'Плановое ТО, машина работает нормально',
        createdAt: '2024-06-24T13:20:00',
        updatedAt: '2024-06-24T13:20:00'
      }
    ],
    performance: {
      rating: 4.6,
      jobsCompleted: 1560,
      efficiency: 88,
      qualityScore: 94,
      averageJobTime: 2.2,
      lastEvaluation: '2024-04-28',
      notes: 'Стабильный работник. Хорошо справляется с плановым ТО. Клиенты довольны качеством работ. Аккуратный и внимательный.',
      monthlyStats: [
        { month: '2024-05', jobsCompleted: 52, efficiency: 87, revenue: 580000 },
        { month: '2024-04', jobsCompleted: 48, efficiency: 86, revenue: 540000 },
        { month: '2024-03', jobsCompleted: 55, efficiency: 89, revenue: 620000 }
      ]
    },
    tools: {
      assignedTools: ['Комплект для ТО профессиональный', 'Вакуумный насос для замены масла', 'Станция замены масла', 'Диагностический сканер', 'Компрессор воздушный'],
      toolCondition: 'good',
      lastToolCheck: '2024-04-10',
      nextCheckDate: '2024-07-10',
      toolWarranties: []
    },
    achievements: ['Специалист по корейским автомобилям'],
    vacations: [
      { start: '2024-09-01', end: '2024-09-14', type: 'vacation', status: 'planned' }
    ]
  },
  {
    id: 'mec-006',
    personalInfo: {
      fullName: 'Морозов Алексей Дмитриевич',
      birthDate: '1995-11-08',
      gender: 'male',
      phone: '+7 (916) 678-90-12',
      email: 'a.morozov@garage.ru',
      address: 'г. Москва, ул. Чехова, д. 23, кв. 67',
      education: 'Среднее специальное, Автотехнический колледж',
      experience: 4,
      certification: 'CAT-006789',
      certificationExpiry: '2025-02-28',
      avatar: '/avatars/morozov.jpg'
    },
    professionalInfo: {
      specialization: 'tire',
      department: 'Шиномонтаж',
      position: 'Шиномонтажник',
      qualifications: ['Шиномонтаж', 'Балансировка', 'Ремонт шин', 'Хранение шин', 'Подбор резины'],
      skills: ['Шиномонтаж', 'Балансировка', 'Ремонт проколов', 'Вулканизация', 'Работа с клиентами'],
      status: 'active',
      hireDate: '2022-01-10',
      workshop: 'Шиномонтаж',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        hours: '08:00-18:00',
        timezone: 'Europe/Moscow'
      },
      salary: 55000,
      level: 'junior'
    },
    currentWork: [
      {
        id: 'job-008',
        vehicle: {
          make: 'Hyundai',
          model: 'Tucson',
          year: 2021,
          licensePlate: 'G789MN777',
          vin: 'KM8J3CA46MU000008',
          color: 'Серый',
          mileage: 55000,
          fuelType: 'diesel'
        },
        ownerName: 'Федоров Максим',
        ownerPhone: '+7 (916) 333-22-11',
        serviceType: 'tire',
        description: 'Сезонная замена резины, балансировка',
        estimatedHours: 1.5,
        cost: 4000,
        status: 'in_progress',
        priority: 'medium',
        scheduledDate: '2024-06-25',
        startTime: '2024-06-25T13:00:00',
        bay: 'Шиномонтажный бокс',
        assignedMechanic: 'mec-006',
        parts: [],
        createdAt: '2024-06-25T12:45:00',
        updatedAt: '2024-06-25T13:15:00'
      }
    ],
    performance: {
      rating: 4.5,
      jobsCompleted: 320,
      efficiency: 85,
      qualityScore: 92,
      averageJobTime: 1.2,
      lastEvaluation: '2024-03-15',
      notes: 'Молодой перспективный специалист. Быстро обучается. Аккуратно работает с дисками.',
      monthlyStats: [
        { month: '2024-05', jobsCompleted: 65, efficiency: 84, revenue: 240000 },
        { month: '2024-04', jobsCompleted: 58, efficiency: 83, revenue: 210000 },
        { month: '2024-03', jobsCompleted: 72, efficiency: 86, revenue: 260000 }
      ]
    },
    tools: {
      assignedTools: ['Станок шиномонтажный', 'Балансировочный станок', 'Вулканизатор', 'Компрессор', 'Набор монтажных лопаток'],
      toolCondition: 'good',
      lastToolCheck: '2024-02-20',
      nextCheckDate: '2024-05-20',
      toolWarranties: []
    },
    achievements: ['Лучший шиномонтажник месяца'],
    vacations: []
  }
];

// =============================================================================
// СПЕЦИАЛИЗИРОВАННЫЕ КОМПОНЕНТЫ
// =============================================================================

interface MechanicCardProps {
  mechanic: Mechanic;
  onClick?: () => void;
  delay?: number;
  compact?: boolean;
}

const MechanicCard: React.FC<MechanicCardProps> = ({ 
  mechanic, 
  onClick, 
  delay = 0,
  compact = false
}) => {
  const getMechanicColor = (status: string) => {
    switch (status) {
      case 'active': return MECHANIC_COLORS.active;
      case 'inactive': return MECHANIC_COLORS.inactive;
      case 'busy': return MECHANIC_COLORS.busy;
      case 'available': return MECHANIC_COLORS.available;
      case 'on_break': return MECHANIC_COLORS.on_break;
      default: return MECHANIC_COLORS.inactive;
    }
  };

  const currentJobs = mechanic.currentWork.filter(job => 
    job.status === 'scheduled' || job.status === 'in_progress'
  ).length;

  const specialization = SPECIALIZATIONS[mechanic.professionalInfo.specialization];
  const workshop = WORKSHOPS[mechanic.professionalInfo.workshop];

  if (compact) {
    return (
      <BentoCard 
        className="p-4" 
        glowColor={getMechanicColor(mechanic.professionalInfo.status)} 
        onClick={onClick}
        delay={delay}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
              {getInitials(mechanic.personalInfo.fullName)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs">
              {specialization.icon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm truncate">
              {mechanic.personalInfo.fullName}
            </h4>
            <p className="text-slate-400 text-xs truncate">
              {specialization.label} • {workshop.icon} {mechanic.professionalInfo.workshop}
            </p>
          </div>
          <StatusBadge 
            status={mechanic.professionalInfo.status} 
            animated={mechanic.professionalInfo.status === 'available'}
            size="sm"
          />
        </div>
      </BentoCard>
    );
  }

  return (
    <BentoCard 
      className="p-5" 
      glowColor={getMechanicColor(mechanic.professionalInfo.status)} 
      onClick={onClick}
      delay={delay}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-base">
              {getInitials(mechanic.personalInfo.fullName)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs">
              {specialization.icon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">
              {mechanic.personalInfo.fullName}
            </h4>
            <p className="text-slate-400 text-sm flex items-center gap-1 flex-wrap">
              <span>{specialization.icon}</span>
              <span>{specialization.label}</span>
              <span>•</span>
              <span>{workshop.icon}</span>
              <span>{mechanic.professionalInfo.workshop}</span>
              <span>•</span>
              <span>{mechanic.personalInfo.experience} лет опыта</span>
            </p>
          </div>
        </div>
        <StatusBadge 
          status={mechanic.professionalInfo.status} 
          animated={mechanic.professionalInfo.status === 'available'} 
        />
      </div>
      
      <div className="space-y-3 text-sm mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Должность:</span>
          <span className="text-white font-medium">{mechanic.professionalInfo.position}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Задач выполнено:</span>
          <span className="text-white font-medium">{mechanic.performance.jobsCompleted.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Рейтинг:</span>
          <div className="flex items-center space-x-1">
            <span className="text-amber-500">★</span>
            <span className="text-white font-medium">{mechanic.performance.rating}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Эффективность:</span>
          <span className="text-white font-medium">{mechanic.performance.efficiency}%</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <div className="text-xs text-slate-400 flex items-center gap-1">
          <span>📋</span>
          <span>{currentJobs} текущих задач</span>
        </div>
        <div className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
          <span>⭐</span>
          <span>{mechanic.performance.qualityScore}% качества</span>
        </div>
      </div>
    </BentoCard>
  );
};

interface JobCardProps {
  job: ServiceJob;
  onClick?: () => void;
  delay?: number;
  showMechanic?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onClick, 
  delay = 0,
  showMechanic = true
}) => {
  const getJobColor = (status: string) => {
    switch (status) {
      case 'scheduled': return MECHANIC_COLORS.scheduled;
      case 'in_progress': return MECHANIC_COLORS.available;
      case 'completed': return MECHANIC_COLORS.completed;
      case 'cancelled': return MECHANIC_COLORS.cancelled;
      default: return MECHANIC_COLORS.inactive;
    }
  };

  const assignedMechanic = job.assignedMechanic ? 
    mechanics.find(m => m.id === job.assignedMechanic) : null;
  
  const specialization = SPECIALIZATIONS[job.serviceType];
  const timeRemaining = job.endTime ? getTimeRemaining(job.endTime) : null;

  return (
    <BentoCard className="p-4" glowColor={getJobColor(job.status)} onClick={onClick} delay={delay}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <h5 className="text-white font-semibold text-sm mb-1 line-clamp-2">
            {job.vehicle.make} {job.vehicle.model}
          </h5>
          <p className="text-slate-400 text-xs flex items-center gap-1 flex-wrap">
            <span>👤 {job.ownerName}</span>
            <span>•</span>
            <span>🚗 {job.vehicle.licensePlate}</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={job.status} animated={job.status === 'in_progress'} size="sm" />
          {timeRemaining && job.status === 'in_progress' && (
            <div className={`text-xs px-2 py-1 rounded-full ${
              timeRemaining.overdue 
                ? 'bg-red-500/20 text-red-300' 
                : 'bg-amber-500/20 text-amber-300'
            }`}>
              {timeRemaining.overdue ? '⚠️ Просрочено' : `⏱️ ${timeRemaining.hours}ч ${timeRemaining.minutes}м`}
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2 text-xs mb-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Тип работ:</span>
          <div className="flex items-center space-x-1">
            <span>{specialization.icon}</span>
            <StatusBadge status={job.serviceType} size="sm" />
          </div>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Время:</span>
          <span className="text-white">{job.estimatedHours} ч{job.actualHours && ` (${job.actualHours} ч)`}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Стоимость:</span>
          <span className="text-white font-medium">{formatCurrency(job.cost)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Приоритет:</span>
          <StatusBadge status={job.priority} size="sm" />
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Бокс:</span>
          <span className="text-white">{job.bay}</span>
        </div>

        {showMechanic && assignedMechanic && (
          <div className="flex justify-between">
            <span className="text-slate-400">Механик:</span>
            <span className="text-white text-right text-xs truncate max-w-[120px]">
              {assignedMechanic.personalInfo.fullName.split(' ')[1]}
            </span>
          </div>
        )}
      </div>

      {job.startTime && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <div className="text-xs text-slate-400">
            {formatDateTime(job.startTime)}
          </div>
          {job.scheduledDate && (
            <div className="text-xs text-slate-400">
              {formatDate(job.scheduledDate, { month: 'short', day: 'numeric' })}
            </div>
          )}
        </div>
      )}
    </BentoCard>
  );
};

// =============================================================================
// КОМПОНЕНТЫ ВКЛАДОК
// =============================================================================

interface OverviewTabProps {
  stats: any;
  mechanics: Mechanic[];
  activeJobs: ServiceJob[];
  onMechanicSelect: (mechanic: Mechanic) => void;
  onJobSelect: (job: ServiceJob) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  mechanics,
  activeJobs,
  onMechanicSelect,
  onJobSelect
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Всего механиков"
          value={stats.totalMechanics}
          change={3.2}
          icon="👨‍🔧"
          color={MECHANIC_COLORS.active}
          subtitle={`${stats.activeMechanics} активных`}
          trend="up"
          delay={0}
        />
        <StatCard
          title="Занято сейчас"
          value={stats.busyMechanics}
          change={5.7}
          icon="🔧"
          color={MECHANIC_COLORS.busy}
          subtitle="выполняют работы"
          trend="up"
          delay={1}
        />
        <StatCard
          title="Активные задания"
          value={stats.activeJobs}
          change={8.3}
          icon="📋"
          color={MECHANIC_COLORS.available}
          subtitle="в работе"
          trend="up"
          delay={2}
        />
        <StatCard
          title="Текущий доход"
          value={formatCurrency(stats.totalRevenue)}
          change={12.1}
          icon="💰"
          color={MECHANIC_COLORS.repair}
          subtitle="от текущих работ"
          trend="up"
          delay={3}
          formatValue={formatCurrency}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Лучшие механики */}
        <BentoCard className="p-6" glowColor={MECHANIC_COLORS.active}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Лучшие механики</h3>
            <motion.button 
              className="text-slate-400 hover:text-white text-sm font-medium flex items-center gap-1"
              whileHover={{ x: 2 }}
            >
              <span>Все</span>
              <span>→</span>
            </motion.button>
          </div>
          <div className="space-y-4">
            {mechanics
              .filter(m => m.professionalInfo.status === 'active' || m.professionalInfo.status === 'available')
              .sort((a, b) => b.performance.rating - a.performance.rating)
              .slice(0, 3)
              .map((mechanic, index) => (
              <motion.div 
                key={`top-mechanic-${mechanic.id}-${index}`}
                className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                onClick={() => onMechanicSelect(mechanic)}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                  {getInitials(mechanic.personalInfo.fullName)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm truncate">{mechanic.personalInfo.fullName}</h4>
                  <p className="text-slate-400 text-xs">
                    {SPECIALIZATIONS[mechanic.professionalInfo.specialization].label} • {mechanic.professionalInfo.department}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-amber-500">★</span>
                  <span className="text-white text-sm font-medium">{mechanic.performance.rating}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </BentoCard>

        {/* Активные задания */}
        <BentoCard className="p-6" glowColor={MECHANIC_COLORS.available}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Активные задания</h3>
            <motion.button 
              className="text-slate-400 hover:text-white text-sm font-medium flex items-center gap-1"
              whileHover={{ x: 2 }}
            >
              <span>Все</span>
              <span>→</span>
            </motion.button>
          </div>
          <div className="space-y-4">
            {activeJobs
              .slice(0, 3)
              .map((job, index) => (
              <motion.div 
                key={`active-job-${job.id}-${index}`}
                className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                onClick={() => onJobSelect(job)}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  job.priority === 'high' || job.priority === 'urgent' ? 'bg-gradient-to-br from-red-500 to-pink-500' :
                  job.priority === 'medium' ? 'bg-gradient-to-br from-orange-500 to-amber-500' :
                  'bg-gradient-to-br from-green-500 to-emerald-500'
                }`}>
                  {SPECIALIZATIONS[job.serviceType].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm line-clamp-2">{job.vehicle.make} {job.vehicle.model}</h4>
                  <p className="text-slate-400 text-xs">
                    {job.ownerName} • {job.bay}
                  </p>
                </div>
                <StatusBadge status={job.status} size="sm" />
              </motion.div>
            ))}
          </div>
        </BentoCard>
      </div>

      {/* Специализации */}
      <BentoCard className="p-6" glowColor={MECHANIC_COLORS.engine}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Распределение по специализациям</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.specializations.map((specialization: string, index: number) => {
            const spec = SPECIALIZATIONS[specialization as keyof typeof SPECIALIZATIONS];
            const specMechanics = mechanics.filter(m => m.professionalInfo.specialization === specialization);
            const activeSpecMechanics = specMechanics.filter(m => 
              m.professionalInfo.status === 'active' || m.professionalInfo.status === 'available'
            );
            
            return (
              <motion.div 
                key={`specialization-${specialization}-${index}`}
                className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                whileHover={{ scale: 1.05, y: -2 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  // Навигация на вкладку механиков с фильтром
                  console.log('Navigate to mechanics with filter:', specialization);
                }}
              >
                <div className="text-2xl mb-2">{spec.icon}</div>
                <h4 className="text-white font-medium text-sm capitalize mb-1">
                  {spec.label}
                </h4>
                <p className="text-slate-400 text-xs">
                  {activeSpecMechanics.length}/{specMechanics.length} механиков
                </p>
              </motion.div>
            );
          })}
        </div>
      </BentoCard>

      {/* Цехи */}
      <BentoCard className="p-6" glowColor={MECHANIC_COLORS.electrical}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Распределение по цехам</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.workshops.map((workshop: string, index: number) => {
            const workshopInfo = WORKSHOPS[workshop as keyof typeof WORKSHOPS];
            const workshopMechanics = mechanics.filter(m => m.professionalInfo.workshop === workshop);
            const activeWorkshopMechanics = workshopMechanics.filter(m => 
              m.professionalInfo.status === 'active' || m.professionalInfo.status === 'available'
            );
            
            return (
              <motion.div 
                key={`workshop-${workshop}-${index}`}
                className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                whileHover={{ scale: 1.05, y: -2 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-2xl mb-2">{workshopInfo.icon}</div>
                <h4 className="text-white font-medium text-sm mb-1">
                  {workshop}
                </h4>
                <p className="text-slate-400 text-xs">
                  {activeWorkshopMechanics.length}/{workshopMechanics.length} механиков
                </p>
              </motion.div>
            );
          })}
        </div>
      </BentoCard>
    </motion.div>
  );
};

interface MechanicsTabProps {
  mechanics: Mechanic[];
  viewMode: 'grid' | 'list';
  onMechanicSelect: (mechanic: Mechanic) => void;
}

const MechanicsTab: React.FC<MechanicsTabProps> = ({
  mechanics,
  viewMode,
  onMechanicSelect
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (mechanics.length === 0) {
    return (
      <motion.div
        key="mechanics"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <BentoCard className="p-12 text-center" glowColor={MECHANIC_COLORS.slate}>
          <div className="text-6xl mb-4">🔧</div>
          <h3 className="text-xl font-semibold text-white mb-2">Механики не найдены</h3>
          <p className="text-slate-400">Попробуйте изменить параметры фильтрации</p>
        </BentoCard>
      </motion.div>
    );
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        key="mechanics-list"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-4">
          {mechanics.map((mechanic, index) => (
            <motion.div
              key={`mechanic-list-${mechanic.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MechanicCard 
                mechanic={mechanic} 
                onClick={() => onMechanicSelect(mechanic)}
                compact={true}
                delay={index}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="mechanics-grid"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {mechanics.map((mechanic, index) => (
          <MechanicCard 
            key={`mechanic-grid-${mechanic.id}-${index}`}
            mechanic={mechanic} 
            onClick={() => onMechanicSelect(mechanic)}
            delay={index}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

interface JobsTabProps {
  jobs: ServiceJob[];
  viewMode: 'grid' | 'list';
  onJobSelect: (job: ServiceJob) => void;
}

const JobsTab: React.FC<JobsTabProps> = ({
  jobs,
  viewMode,
  onJobSelect
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (jobs.length === 0) {
    return (
      <motion.div
        key="jobs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <BentoCard className="p-12 text-center" glowColor={MECHANIC_COLORS.slate}>
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-white mb-2">Задания не найдены</h3>
          <p className="text-slate-400">Попробуйте изменить параметры фильтрации</p>
        </BentoCard>
      </motion.div>
    );
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        key="jobs-list"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <motion.div
              key={`job-list-${job.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BentoCard className="p-4" glowColor={MECHANIC_COLORS.available} onClick={() => onJobSelect(job)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      job.priority === 'high' || job.priority === 'urgent' ? 'bg-gradient-to-br from-red-500 to-pink-500' :
                      job.priority === 'medium' ? 'bg-gradient-to-br from-orange-500 to-amber-500' :
                      'bg-gradient-to-br from-green-500 to-emerald-500'
                    }`}>
                      {SPECIALIZATIONS[job.serviceType].icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-sm truncate">
                        {job.vehicle.make} {job.vehicle.model}
                      </h4>
                      <p className="text-slate-400 text-xs truncate">
                        {job.ownerName} • {job.vehicle.licensePlate} • {job.bay}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-medium">{formatCurrency(job.cost)}</span>
                    <StatusBadge status={job.status} size="sm" />
                  </div>
                </div>
              </BentoCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="jobs-grid"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {jobs.map((job, index) => (
          <JobCard 
            key={`job-grid-${job.id}-${index}`}
            job={job} 
            onClick={() => onJobSelect(job)}
            delay={index}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

interface PerformanceTabProps {
  mechanics: Mechanic[];
  stats: any;
  onMechanicSelect: (mechanic: Mechanic) => void;
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({
  mechanics,
  stats,
  onMechanicSelect
}) => {
  return (
    <motion.div
      key="performance"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Рейтинги механиков */}
        <BentoCard className="p-6" glowColor={MECHANIC_COLORS.active}>
          <h3 className="text-xl font-bold text-white mb-6">Рейтинги механиков</h3>
          <div className="space-y-4">
            {mechanics
              .sort((a, b) => b.performance.rating - a.performance.rating)
              .map((mechanic, index) => (
              <motion.div 
                key={`performance-mechanic-${mechanic.id}-${index}`}
                className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                onClick={() => onMechanicSelect(mechanic)}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  {getInitials(mechanic.personalInfo.fullName)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm truncate">{mechanic.personalInfo.fullName}</h4>
                  <p className="text-slate-400 text-xs">
                    {mechanic.performance.jobsCompleted.toLocaleString()} заданий
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-amber-500">★</span>
                  <span className="text-white text-sm font-medium">{mechanic.performance.rating}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </BentoCard>

        {/* Показатели эффективности */}
        <BentoCard className="p-6" glowColor={MECHANIC_COLORS.diagnostic}>
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
                color={MECHANIC_COLORS.active}
                animated={true}
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-slate-300 mb-2">
                <span>Эффективность</span>
                <span className="font-semibold">
                  {(mechanics.reduce((acc, m) => acc + m.performance.efficiency, 0) / mechanics.length).toFixed(1)}%
                </span>
              </div>
              <ProgressBar 
                value={mechanics.reduce((acc, m) => acc + m.performance.efficiency, 0) / mechanics.length} 
                color={MECHANIC_COLORS.available}
                animated={true}
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-slate-300 mb-2">
                <span>Качество работ</span>
                <span className="font-semibold">
                  {(mechanics.reduce((acc, m) => acc + m.performance.qualityScore, 0) / mechanics.length).toFixed(1)}%
                </span>
              </div>
              <ProgressBar 
                value={mechanics.reduce((acc, m) => acc + m.performance.qualityScore, 0) / mechanics.length} 
                color={MECHANIC_COLORS.engine}
                animated={true}
              />
            </div>

            <div>
              <div className="flex justify-between text-sm text-slate-300 mb-2">
                <span>Завершено заданий</span>
                <span className="font-semibold">
                  {stats.totalJobs.toLocaleString()}
                </span>
              </div>
              <ProgressBar 
                value={Math.min(stats.totalJobs / 10000 * 100, 100)} 
                color={MECHANIC_COLORS.repair}
                animated={true}
              />
            </div>
          </div>
        </BentoCard>
      </div>

      {/* Распределение по статусам */}
      <BentoCard className="p-6" glowColor={MECHANIC_COLORS.electrical}>
        <h3 className="text-xl font-bold text-white mb-6">Статусы механиков</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { status: 'active', label: 'Активен', count: mechanics.filter(m => m.professionalInfo.status === 'active').length },
            { status: 'available', label: 'Доступен', count: mechanics.filter(m => m.professionalInfo.status === 'available').length },
            { status: 'busy', label: 'Занят', count: mechanics.filter(m => m.professionalInfo.status === 'busy').length },
            { status: 'on_break', label: 'На перерыве', count: mechanics.filter(m => m.professionalInfo.status === 'on_break').length },
            { status: 'inactive', label: 'Неактивен', count: mechanics.filter(m => m.professionalInfo.status === 'inactive').length }
          ].map((item, index) => (
            <motion.div 
              key={`status-${item.status}-${index}`}
              className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatusBadge status={item.status} className="mb-2" />
              <div className="text-2xl font-bold text-white">{item.count}</div>
              <div className="text-slate-400 text-xs">механиков</div>
            </motion.div>
          ))}
        </div>
      </BentoCard>
    </motion.div>
  );
};

interface WorkshopsTabProps {
  mechanics: Mechanic[];
  workshops: typeof WORKSHOPS;
  onMechanicSelect: (mechanic: Mechanic) => void;
}

const WorkshopsTab: React.FC<WorkshopsTabProps> = ({
  mechanics,
  workshops,
  onMechanicSelect
}) => {
  return (
    <motion.div
      key="workshops"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(workshops).map(([workshopName, workshop], index) => {
          const workshopMechanics = mechanics.filter(m => m.professionalInfo.workshop === workshopName);
          const activeMechanics = workshopMechanics.filter(m => 
            m.professionalInfo.status === 'active' || m.professionalInfo.status === 'available'
          );
          const currentJobs = workshopMechanics.flatMap(m => m.currentWork).filter(job => 
            job.status === 'scheduled' || job.status === 'in_progress'
          ).length;

          return (
            <BentoCard key={`workshop-${workshopName}-${index}`} className="p-6" glowColor={workshop.color} delay={index}>
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{workshop.icon}</div>
                <h3 className="text-xl font-bold text-white mb-1">{workshopName}</h3>
                <p className="text-slate-400 text-sm">{workshop.description}</p>
              </div>
              
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Механиков:</span>
                  <span className="text-white">{activeMechanics.length}/{workshopMechanics.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Активных заданий:</span>
                  <span className="text-white">{currentJobs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Специализации:</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {[...new Set(workshopMechanics.map(m => m.professionalInfo.specialization))].map(spec => (
                      <span key={`workshop-${workshopName}-spec-${spec}`} className="text-xs">
                        {SPECIALIZATIONS[spec].icon}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-semibold text-sm mb-2">Механики:</h4>
                {workshopMechanics.slice(0, 3).map(mechanic => (
                  <motion.div
                    key={`workshop-mechanic-${workshopName}-${mechanic.id}`}
                    className="flex items-center space-x-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                    onClick={() => onMechanicSelect(mechanic)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(mechanic.personalInfo.fullName)}
                    </div>
                    <span className="text-white text-sm truncate flex-1">
                      {mechanic.personalInfo.fullName.split(' ')[1]}
                    </span>
                    <StatusBadge status={mechanic.professionalInfo.status} size="sm" />
                  </motion.div>
                ))}
                {workshopMechanics.length > 3 && (
                  <div className="text-center text-slate-400 text-xs pt-2">
                    и еще {workshopMechanics.length - 3} механиков
                  </div>
                )}
              </div>
            </BentoCard>
          );
        })}
      </div>
    </motion.div>
  );
};

// =============================================================================
// МОДАЛЬНЫЕ ОКНА
// =============================================================================

interface MechanicDetailModalProps {
  mechanic: Mechanic;
}

const MechanicDetailModal: React.FC<MechanicDetailModalProps> = ({ mechanic }) => {
  const specialization = SPECIALIZATIONS[mechanic.professionalInfo.specialization];
  const workshop = WORKSHOPS[mechanic.professionalInfo.workshop];

  return (
    <div className="space-y-6">
      {/* Заголовок с основной информацией */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
          {getInitials(mechanic.personalInfo.fullName)}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white">{mechanic.personalInfo.fullName}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <StatusBadge status={mechanic.professionalInfo.status} />
            <span className="text-slate-400">•</span>
            <span className="text-slate-300">{mechanic.professionalInfo.position}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300">{workshop.icon} {mechanic.professionalInfo.workshop}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Персональная информация */}
        <BentoCard className="p-6" glowColor={MECHANIC_COLORS.active}>
          <h4 className="text-lg font-semibold text-white mb-4">Персональная информация</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Дата рождения:</span>
              <span className="text-white">{formatDate(mechanic.personalInfo.birthDate)} ({calculateAge(mechanic.personalInfo.birthDate)} лет)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Телефон:</span>
              <span className="text-white">{mechanic.personalInfo.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Email:</span>
              <span className="text-white">{mechanic.personalInfo.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Образование:</span>
              <span className="text-white text-right">{mechanic.personalInfo.education}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Опыт работы:</span>
              <span className="text-white">{mechanic.personalInfo.experience} лет</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Сертификация:</span>
              <span className="text-white">{mechanic.personalInfo.certification} (до {formatDate(mechanic.personalInfo.certificationExpiry)})</span>
            </div>
          </div>
        </BentoCard>

        {/* Профессиональная информация */}
        <BentoCard className="p-6" glowColor={MECHANIC_COLORS.engine}>
          <h4 className="text-lg font-semibold text-white mb-4">Профессиональная информация</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Специализация:</span>
              <StatusBadge status={mechanic.professionalInfo.specialization} />
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Отдел:</span>
              <span className="text-white">{mechanic.professionalInfo.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Должность:</span>
              <span className="text-white">{mechanic.professionalInfo.position}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Уровень:</span>
              <span className="text-white capitalize">{mechanic.professionalInfo.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Работает с:</span>
              <span className="text-white">{formatDate(mechanic.professionalInfo.hireDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">График работы:</span>
              <span className="text-white">{mechanic.professionalInfo.workingHours.days.join(', ')} {mechanic.professionalInfo.workingHours.hours}</span>
            </div>
          </div>
        </BentoCard>

        {/* Квалификация и навыки */}
        <BentoCard className="p-6" glowColor={MECHANIC_COLORS.electrical}>
          <h4 className="text-lg font-semibold text-white mb-4">Квалификация и навыки</h4>
          <div className="space-y-3">
            <div>
              <h5 className="text-slate-400 text-sm mb-2">Квалификации:</h5>
              <div className="flex flex-wrap gap-2">
                {mechanic.professionalInfo.qualifications.map((qualification, index) => (
                  <motion.span 
                    key={`qualification-${mechanic.id}-${index}`}
                    className="text-xs text-slate-300 bg-white/10 rounded-full px-3 py-1.5 border border-slate-600/50"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {qualification}
                  </motion.span>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-slate-400 text-sm mb-2">Навыки:</h5>
              <div className="flex flex-wrap gap-2">
                {mechanic.professionalInfo.skills.map((skill, index) => (
                  <motion.span 
                    key={`skill-${mechanic.id}-${index}`}
                    className="text-xs text-slate-300 bg-white/10 rounded-full px-3 py-1.5 border border-slate-600/50"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Производительность */}
        <BentoCard className="p-6" glowColor={MECHANIC_COLORS.available}>
          <h4 className="text-lg font-semibold text-white mb-4">Производительность</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Рейтинг:</span>
              <div className="flex items-center space-x-2">
                <span className="text-amber-500">★</span>
                <span className="text-white font-semibold">{mechanic.performance.rating}/5</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Заданий выполнено:</span>
              <span className="text-white">{mechanic.performance.jobsCompleted.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Эффективность:</span>
              <span className="text-white">{mechanic.performance.efficiency}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Качество работ:</span>
              <span className="text-white">{mechanic.performance.qualityScore}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Среднее время задания:</span>
              <span className="text-white">{mechanic.performance.averageJobTime} ч</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Последняя оценка:</span>
              <span className="text-white">{formatDate(mechanic.performance.lastEvaluation)}</span>
            </div>
          </div>
        </BentoCard>
      </div>

      {/* Текущие задания */}
      <BentoCard className="p-6" glowColor={MECHANIC_COLORS.repair}>
        <h4 className="text-lg font-semibold text-white mb-4">Текущие задания</h4>
        {mechanic.currentWork.filter(job => job.status === 'scheduled' || job.status === 'in_progress').length === 0 ? (
          <p className="text-slate-400 text-center py-4">Нет текущих заданий</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mechanic.currentWork
              .filter(job => job.status === 'scheduled' || job.status === 'in_progress')
              .map((job) => (
              <JobCard 
                key={`mechanic-job-${mechanic.id}-${job.id}`}
                job={job} 
                onClick={() => {/* Обработчик будет передан из родительского компонента */}}
                showMechanic={false}
              />
            ))}
          </div>
        )}
      </BentoCard>

      {/* Инструменты и оборудование */}
      <BentoCard className="p-6" glowColor={MECHANIC_COLORS.maintenance}>
        <h4 className="text-lg font-semibold text-white mb-4">Инструменты и оборудование</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Состояние инструментов:</span>
            <span className="text-white capitalize">{mechanic.tools.toolCondition}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Последняя проверка:</span>
            <span className="text-white">{formatDate(mechanic.tools.lastToolCheck)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Следующая проверка:</span>
            <span className="text-white">{formatDate(mechanic.tools.nextCheckDate)}</span>
          </div>
          <div>
            <h5 className="text-slate-400 text-sm mb-2">Закрепленные инструменты:</h5>
            <div className="flex flex-wrap gap-2">
              {mechanic.tools.assignedTools.map((tool, index) => (
                <motion.span 
                  key={`tool-${mechanic.id}-${index}`}
                  className="text-xs text-slate-300 bg-white/10 rounded-full px-3 py-1.5 border border-slate-600/50"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {tool}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </BentoCard>

      {/* Достижения */}
      {mechanic.achievements && mechanic.achievements.length > 0 && (
        <BentoCard className="p-6" glowColor={MECHANIC_COLORS.suspension}>
          <h4 className="text-lg font-semibold text-white mb-4">Достижения</h4>
          <div className="flex flex-wrap gap-2">
            {mechanic.achievements.map((achievement, index) => (
              <motion.span 
                key={`achievement-${mechanic.id}-${index}`}
                className="text-xs text-amber-300 bg-amber-500/10 rounded-full px-3 py-1.5 border border-amber-500/20"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                🏆 {achievement}
              </motion.span>
            ))}
          </div>
        </BentoCard>
      )}

      {/* Примечания руководителя */}
      {mechanic.performance.notes && (
        <BentoCard className="p-6" glowColor={MECHANIC_COLORS.diagnostic}>
          <h4 className="text-lg font-semibold text-white mb-4">Примечания руководителя</h4>
          <p className="text-slate-300 text-sm">{mechanic.performance.notes}</p>
        </BentoCard>
      )}
    </div>
  );
};

interface JobDetailModalProps {
  job: ServiceJob;
  mechanics: Mechanic[];
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, mechanics }) => {
  const assignedMechanic = job.assignedMechanic ? 
    mechanics.find(m => m.id === job.assignedMechanic) : null;
  
  const specialization = SPECIALIZATIONS[job.serviceType];
  const timeRemaining = job.endTime ? getTimeRemaining(job.endTime) : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Информация о клиенте */}
        <BentoCard className="p-6" glowColor={MECHANIC_COLORS.active}>
          <h4 className="text-lg font-semibold text-white mb-4">Информация о клиенте</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Клиент:</span>
              <span className="text-white">{job.ownerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Телефон:</span>
              <span className="text-white">{job.ownerPhone}</span>
            </div>
            {job.ownerEmail && (
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="text-white">{job.ownerEmail}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Приоритет:</span>
              <StatusBadge status={job.priority} />
            </div>
          </div>
        </BentoCard>

        {/* Информация об автомобиле */}
        <BentoCard className="p-6" glowColor={MECHANIC_COLORS.available}>
          <h4 className="text-lg font-semibold text-white mb-4">Информация об автомобиле</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Марка и модель:</span>
              <span className="text-white">{job.vehicle.make} {job.vehicle.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Год выпуска:</span>
              <span className="text-white">{job.vehicle.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Госномер:</span>
              <span className="text-white">{job.vehicle.licensePlate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">VIN:</span>
              <span className="text-white font-mono text-xs">{job.vehicle.vin}</span>
            </div>
            {job.vehicle.color && (
              <div className="flex justify-between">
                <span className="text-slate-400">Цвет:</span>
                <span className="text-white">{job.vehicle.color}</span>
              </div>
            )}
            {job.vehicle.mileage && (
              <div className="flex justify-between">
                <span className="text-slate-400">Пробег:</span>
                <span className="text-white">{job.vehicle.mileage.toLocaleString()} км</span>
              </div>
            )}
          </div>
        </BentoCard>
      </div>

      {/* Детали задания */}
      <BentoCard className="p-6" glowColor={MECHANIC_COLORS.diagnostic}>
        <h4 className="text-lg font-semibold text-white mb-4">Детали задания</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Тип работ:</span>
            <div className="flex items-center space-x-2">
              <span>{specialization.icon}</span>
              <StatusBadge status={job.serviceType} />
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Статус:</span>
            <StatusBadge status={job.status} />
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Описание:</span>
            <span className="text-white text-right max-w-[60%]">{job.description}</span>
          </div>
          {job.detailedDescription && (
            <div>
              <span className="text-slate-400">Подробное описание:</span>
              <p className="text-white mt-1 text-sm">{job.detailedDescription}</p>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-400">Плановое время:</span>
            <span className="text-white">{job.estimatedHours} ч</span>
          </div>
          {job.actualHours && (
            <div className="flex justify-between">
              <span className="text-slate-400">Фактическое время:</span>
              <span className="text-white">{job.actualHours} ч</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-400">Стоимость:</span>
            <span className="text-white font-medium">{formatCurrency(job.cost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Бокс:</span>
            <span className="text-white">{job.bay}</span>
          </div>
          {assignedMechanic && (
            <div className="flex justify-between">
              <span className="text-slate-400">Назначенный механик:</span>
              <span className="text-white">
                {assignedMechanic.personalInfo.fullName}
              </span>
            </div>
          )}
          {timeRemaining && job.status === 'in_progress' && (
            <div className="flex justify-between">
              <span className="text-slate-400">Осталось времени:</span>
              <span className={`font-medium ${
                timeRemaining.overdue ? 'text-red-400' : 'text-amber-400'
              }`}>
                {timeRemaining.overdue ? 'Просрочено' : `${timeRemaining.hours}ч ${timeRemaining.minutes}м`}
              </span>
            </div>
          )}
        </div>
      </BentoCard>

      {job.parts.length > 0 && (
        <BentoCard className="p-6" glowColor={MECHANIC_COLORS.engine}>
          <h4 className="text-lg font-semibold text-white mb-4">Запчасти и материалы</h4>
          <div className="space-y-3">
            {job.parts.map((part) => (
              <motion.div 
                key={`job-part-${job.id}-${part.id}`}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex-1">
                  <h5 className="text-white font-medium text-sm">{part.name}</h5>
                  <div className="flex items-center space-x-4 text-xs text-slate-400 mt-1">
                    <span>Количество: {part.quantity}</span>
                    {part.supplier && <span>Поставщик: {part.supplier}</span>}
                    {part.warranty && <span>Гарантия: {part.warranty}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{formatCurrency(part.cost)}</p>
                  <StatusBadge status={part.status} size="sm" />
                </div>
              </motion.div>
            ))}
          </div>
        </BentoCard>
      )}

      {/* Заметки */}
      {(job.customerNotes || job.internalNotes || job.notes) && (
        <BentoCard className="p-6" glowColor={MECHANIC_COLORS.electrical}>
          <h4 className="text-lg font-semibold text-white mb-4">Заметки</h4>
          <div className="space-y-4">
            {job.customerNotes && (
              <div>
                <h5 className="text-slate-400 text-sm mb-1">Заметки клиента:</h5>
                <p className="text-slate-300 text-sm bg-blue-500/10 rounded-lg p-3">{job.customerNotes}</p>
              </div>
            )}
            {job.internalNotes && (
              <div>
                <h5 className="text-slate-400 text-sm mb-1">Внутренние заметки:</h5>
                <p className="text-slate-300 text-sm bg-purple-500/10 rounded-lg p-3">{job.internalNotes}</p>
              </div>
            )}
            {job.notes && (
              <div>
                <h5 className="text-slate-400 text-sm mb-1">Дополнительные заметки:</h5>
                <p className="text-slate-300 text-sm bg-slate-500/10 rounded-lg p-3">{job.notes}</p>
              </div>
            )}
          </div>
        </BentoCard>
      )}

      {/* Временные метки */}
      <BentoCard className="p-6" glowColor={MECHANIC_COLORS.maintenance}>
        <h4 className="text-lg font-semibold text-white mb-4">Временные метки</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Создано:</span>
            <p className="text-white">{formatDateTime(job.createdAt)}</p>
          </div>
          <div>
            <span className="text-slate-400">Обновлено:</span>
            <p className="text-white">{formatDateTime(job.updatedAt)}</p>
          </div>
          {job.scheduledDate && (
            <div>
              <span className="text-slate-400">Запланировано на:</span>
              <p className="text-white">{formatDate(job.scheduledDate)}</p>
            </div>
          )}
          {job.startTime && (
            <div>
              <span className="text-slate-400">Начало работ:</span>
              <p className="text-white">{formatDateTime(job.startTime)}</p>
            </div>
          )}
          {job.endTime && (
            <div>
              <span className="text-slate-400">Плановое завершение:</span>
              <p className="text-white">{formatDateTime(job.endTime)}</p>
            </div>
          )}
        </div>
      </BentoCard>
    </div>
  );
};

// =============================================================================
// ОСНОВНОЙ КОМПОНЕНТ ДАШБОРДА
// =============================================================================

const MechanicManagementDashboard: React.FC = () => {
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
  const [selectedJob, setSelectedJob] = useState<ServiceJob | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'mechanics' | 'jobs' | 'performance' | 'workshops'>('overview');
  const [filterSpecialization, setFilterSpecialization] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterWorkshop, setFilterWorkshop] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Имитация загрузки данных
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Статистика для дашборда
  const stats = useMemo(() => {
    const totalMechanics = mechanics.length;
    const activeMechanics = mechanics.filter(m => 
      m.professionalInfo.status === 'active' || m.professionalInfo.status === 'available'
    ).length;
    const busyMechanics = mechanics.filter(m => m.professionalInfo.status === 'busy').length;
    const totalJobs = mechanics.reduce((acc, mechanic) => acc + mechanic.performance.jobsCompleted, 0);
    const activeJobs = mechanics.flatMap(m => m.currentWork).filter(job => 
      job.status === 'scheduled' || job.status === 'in_progress'
    ).length;
    const specializations = [...new Set(mechanics.map(m => m.professionalInfo.specialization))];
    const totalRevenue = mechanics.flatMap(m => m.currentWork).reduce((acc, job) => acc + job.cost, 0);
    const averageRating = mechanics.reduce((acc, m) => acc + m.performance.rating, 0) / mechanics.length;
    const workshops = [...new Set(mechanics.map(m => m.professionalInfo.workshop))];
    
    return {
      totalMechanics,
      activeMechanics,
      busyMechanics,
      totalJobs,
      activeJobs,
      specializations,
      totalRevenue,
      averageRating,
      workshops,
    };
  }, []);

  // Фильтрация данных
  const filteredMechanics = useMemo(() => {
    return mechanics.filter(mechanic => {
      const specializationMatch = filterSpecialization === 'all' || 
        mechanic.professionalInfo.specialization === filterSpecialization;
      const statusMatch = filterStatus === 'all' || 
        mechanic.professionalInfo.status === filterStatus;
      const workshopMatch = filterWorkshop === 'all' || 
        mechanic.professionalInfo.workshop === filterWorkshop;
      const searchMatch = searchQuery === '' || 
        mechanic.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mechanic.professionalInfo.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mechanic.professionalInfo.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mechanic.professionalInfo.position.toLowerCase().includes(searchQuery.toLowerCase());
      
      return specializationMatch && statusMatch && workshopMatch && searchMatch;
    });
  }, [filterSpecialization, filterStatus, filterWorkshop, searchQuery]);

  const allJobs = useMemo(() => 
    mechanics.flatMap(mechanic => 
      mechanic.currentWork.map(job => ({
        ...job,
        assignedMechanic: mechanic.id,
        mechanicName: mechanic.personalInfo.fullName,
        mechanicSpecialization: mechanic.professionalInfo.specialization,
        workshop: mechanic.professionalInfo.workshop
      }))
    ), 
  []);

  const activeJobs = useMemo(() => 
    allJobs.filter(job => job.status === 'scheduled' || job.status === 'in_progress'),
  [allJobs]);

  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      const specializationMatch = filterSpecialization === 'all' || job.serviceType === filterSpecialization;
      const workshopMatch = filterWorkshop === 'all' || job.workshop === filterWorkshop;
      const searchMatch = searchQuery === '' || 
        job.vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());
      
      return specializationMatch && workshopMatch && searchMatch;
    });
  }, [allJobs, filterSpecialization, filterWorkshop, searchQuery]);

  // Обработчики действий
  const handleAddMechanic = useCallback(() => {
    console.log('Добавить механика');
  }, []);

  const handleCreateJob = useCallback(() => {
    console.log('Создать задание');
  }, []);

  const handleExportData = useCallback(() => {
    console.log('Экспорт данных');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-4 lg:p-6">
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.5) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(100, 116, 139, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(100, 116, 139, 0.7);
        }
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shine {
          animation: shine 2s infinite;
        }
        .loading-shimmer {
          background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Хедер */}
      <motion.header 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div className="flex-1">
            <motion.h1 
              className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Управление Механиками
            </motion.h1>
            <motion.p 
              className="text-slate-400 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Профессиональная система мониторинга и координации работы автосервиса
            </motion.p>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button 
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-medium transition-all duration-300 active:scale-95 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddMechanic}
            >
              <span>👨‍🔧</span>
              <span>Новый механик</span>
            </motion.button>
            <motion.button 
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-all duration-300 active:scale-95 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateJob}
            >
              <span>🔧</span>
              <span>Создать задание</span>
            </motion.button>
            <motion.button 
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-all duration-300 active:scale-95 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportData}
            >
              <span>📊</span>
              <span>Экспорт</span>
            </motion.button>
          </div>
        </div>

        {/* Поиск и фильтры */}
        <motion.div 
          className="flex flex-col lg:flex-row gap-4 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск механиков, заданий, автомобилей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-3 pl-10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl transition-all duration-300"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-xl transition-all duration-300"
            >
              <option value="all">Все специализации</option>
              {Object.entries(SPECIALIZATIONS).map(([key, spec]) => (
                <option key={`spec-option-${key}`} value={key}>
                  {spec.icon} {spec.label}
                </option>
              ))}
            </select>
            
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-xl transition-all duration-300"
            >
              <option value="all">Все статусы</option>
              <option value="active">🟢 Активен</option>
              <option value="available">🟢 Доступен</option>
              <option value="busy">🔴 Занят</option>
              <option value="on_break">🟡 На перерыве</option>
              <option value="inactive">⚫ Неактивен</option>
            </select>

            <select 
              value={filterWorkshop}
              onChange={(e) => setFilterWorkshop(e.target.value)}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-xl transition-all duration-300"
            >
              <option value="all">Все цехи</option>
              {Object.entries(WORKSHOPS).map(([key, workshop]) => (
                <option key={`workshop-option-${key}`} value={key}>
                  {workshop.icon} {key}
                </option>
              ))}
            </select>

            {/* Переключатель режима просмотра */}
            {(activeTab === 'mechanics' || activeTab === 'jobs') && (
              <div className="flex bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Навигация */}
        <motion.nav 
          className="flex space-x-1 p-1 bg-slate-800/50 rounded-2xl backdrop-blur-xl border border-slate-700/50 mb-4 overflow-x-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { id: 'overview', label: 'Обзор', icon: '📊', color: COLORS.blue },
            { id: 'mechanics', label: 'Механики', icon: '👨‍🔧', color: COLORS.emerald },
            { id: 'jobs', label: 'Задания', icon: '🔧', color: COLORS.orange },
            { id: 'performance', label: 'Эффективность', icon: '📈', color: COLORS.purple },
            { id: 'workshops', label: 'Цехи', icon: '🏭', color: COLORS.teal }
          ].map((tab) => (
            <motion.button
              key={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex-shrink-0 ${
                activeTab === tab.id
                  ? 'text-white shadow-lg shadow-black/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              style={{
                background: activeTab === tab.id ? 
                  `linear-gradient(135deg, rgba(${tab.color}, 0.2), rgba(${tab.color}, 0.1))` : 
                  'transparent',
                border: activeTab === tab.id ? `1px solid rgba(${tab.color}, 0.3)` : '1px solid transparent'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </motion.nav>
      </motion.header>

      {/* Основной контент */}
      <main>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Загрузка данных...</p>
            </motion.div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <OverviewTab 
                key="overview"
                stats={stats}
                mechanics={mechanics}
                activeJobs={activeJobs}
                onMechanicSelect={setSelectedMechanic}
                onJobSelect={setSelectedJob}
              />
            )}

            {activeTab === 'mechanics' && (
              <MechanicsTab
                key="mechanics"
                mechanics={filteredMechanics}
                viewMode={viewMode}
                onMechanicSelect={setSelectedMechanic}
              />
            )}

            {activeTab === 'jobs' && (
              <JobsTab
                key="jobs"
                jobs={filteredJobs}
                viewMode={viewMode}
                onJobSelect={setSelectedJob}
              />
            )}

            {activeTab === 'performance' && (
              <PerformanceTab
                key="performance"
                mechanics={mechanics}
                stats={stats}
                onMechanicSelect={setSelectedMechanic}
              />
            )}

            {activeTab === 'workshops' && (
              <WorkshopsTab
                key="workshops"
                mechanics={mechanics}
                workshops={WORKSHOPS}
                onMechanicSelect={setSelectedMechanic}
              />
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Модальные окна */}
      <AnimatePresence>
        <Modal 
          key="mechanic-modal"
          isOpen={!!selectedMechanic} 
          onClose={() => setSelectedMechanic(null)}
          title={`Механик: ${selectedMechanic?.personalInfo.fullName}`}
          size="xl"
        >
          {selectedMechanic && <MechanicDetailModal mechanic={selectedMechanic} />}
        </Modal>

        <Modal 
          key="job-modal"
          isOpen={!!selectedJob} 
          onClose={() => setSelectedJob(null)}
          title="Информация о задании"
          size="lg"
        >
          {selectedJob && <JobDetailModal job={selectedJob} mechanics={mechanics} />}
        </Modal>
      </AnimatePresence>
    </div>
  );
};

export default MechanicManagementDashboard;
