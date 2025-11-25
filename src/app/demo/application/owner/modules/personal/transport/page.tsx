'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

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
  slate: '100, 116, 139',
  violet: '139, 92, 246',
  fuchsia: '217, 70, 239',
  lime: '132, 204, 22',
  sky: '14, 165, 233',
  pink: '236, 72, 153'
} as const;

const DRIVER_COLORS = {
  active: '34, 197, 94',
  inactive: '100, 116, 139',
  on_trip: '59, 130, 246',
  on_break: '245, 158, 11',
  available: '16, 185, 129',
  busy: '239, 68, 68',
  maintenance: '249, 115, 22',
  taxi: '245, 158, 11',
  truck: '147, 51, 234',
  delivery: '59, 130, 246',
  shuttle: '16, 185, 129',
  personal: '100, 116, 139',
  high: '239, 68, 68',
  medium: '245, 158, 11',
  low: '34, 197, 94',
  premium: '139, 92, 246',
  economy: '59, 130, 246',
  comfort: '16, 185, 129'
};

// Утилиты
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatTime = (timeString: string) => {
  return new Date(timeString).toLocaleTimeString('ru-RU', {
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

const formatCompactNumber = (num: number) => {
  return new Intl.NumberFormat('ru-RU', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(num);
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

const getVehicleTypeIcon = (type: string) => {
  switch (type) {
    case 'sedan': return '🚗';
    case 'suv': return '🚙';
    case 'minivan': return '🚐';
    case 'truck': return '🚛';
    case 'motorcycle': return '🏍️';
    case 'bus': return '🚌';
    case 'premium': return '⭐';
    case 'economy': return '💰';
    case 'comfort': return '🛋️';
    default: return '🚗';
  }
};

const getServiceTypeIcon = (type: string) => {
  switch (type) {
    case 'taxi': return '🚕';
    case 'delivery': return '📦';
    case 'shuttle': return '🚐';
    case 'truck': return '🚛';
    case 'premium': return '🎯';
    case 'economy': return '💸';
    case 'comfort': return '✨';
    default: return '🚗';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return '🟢';
    case 'inactive': return '⚫';
    case 'on_trip': return '🔵';
    case 'on_break': return '🟡';
    case 'available': return '🟢';
    case 'busy': return '🔴';
    case 'maintenance': return '🟠';
    case 'assigned': return '📋';
    case 'in_progress': return '🚀';
    case 'completed': return '✅';
    case 'cancelled': return '❌';
    default: return '⚪';
  }
};

// Базовые компоненты UI
const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'md',
  showCloseButton = true 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  showCloseButton?: boolean;
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
    sm: 'max-w-md w-full mx-4',
    md: 'max-w-2xl w-full mx-4',
    lg: 'max-w-4xl w-full mx-4',
    xl: 'max-w-6xl w-full mx-4',
    fullscreen: 'max-w-full w-full h-full mx-0 rounded-none'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xl">
      <motion.div
        className={`bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50 rounded-3xl shadow-2xl w-full ${sizeClasses[size]} max-h-[95vh] overflow-hidden`}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 300,
          duration: 0.4
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="border-b border-slate-700/50 p-4 sm:p-6 bg-slate-800/20">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {title}
              </h2>
              {showCloseButton && (
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200 text-slate-400 hover:text-white active:scale-95"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
            </div>
          </div>
        )}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)] custom-scrollbar">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const BentoCard = ({ 
  children, 
  className = '', 
  glowColor = COLORS.teal, 
  onClick,
  hoverable = true,
  padding = 'p-6',
  animated = true,
  delay = 0
}: { 
  children: React.ReactNode; 
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: string;
  animated?: boolean;
  delay?: number;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - left) / width;
    const y = (event.clientY - top) / height;
    
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  return (
    <motion.div
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
      whileHover={hoverable && animated ? { y: -4, scale: 1.02 } : {}}
      whileTap={onClick && animated ? { scale: 0.98 } : {}}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      initial={animated ? { opacity: 0, y: 20 } : false}
      animate={animated ? { opacity: 1, y: 0 } : false}
      transition={animated ? { 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        delay: delay * 0.1 
      } : {}}
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

const StatusBadge = ({ 
  status, 
  type = 'default', 
  animated = false, 
  size = 'md',
  withIcon = true 
}: { 
  status: string; 
  type?: 'default' | 'client' | 'service' | 'booking' | 'provider' | 'priority';
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  withIcon?: boolean;
}) => {
  const getStatusConfig = () => {
    const baseConfig = {
      default: {
        active: { color: COLORS.success, label: 'Активен', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', icon: '🟢' },
        inactive: { color: COLORS.slate, label: 'Неактивен', bg: 'bg-slate-500/15', border: 'border-slate-500/30', icon: '⚫' },
        on_trip: { color: COLORS.blue, label: 'В рейсе', bg: 'bg-blue-500/15', border: 'border-blue-500/30', icon: '🔵' },
        on_break: { color: COLORS.orange, label: 'На перерыве', bg: 'bg-orange-500/15', border: 'border-orange-500/30', icon: '🟡' },
        available: { color: COLORS.emerald, label: 'Доступен', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', icon: '🟢' },
        busy: { color: COLORS.error, label: 'Занят', bg: 'bg-red-500/15', border: 'border-red-500/30', icon: '🔴' },
        maintenance: { color: COLORS.orange, label: 'На обслуживании', bg: 'bg-orange-500/15', border: 'border-orange-500/30', icon: '🟠' },
        assigned: { color: COLORS.teal, label: 'Назначен', bg: 'bg-teal-500/15', border: 'border-teal-500/30', icon: '📋' },
        in_progress: { color: COLORS.blue, label: 'В пути', bg: 'bg-blue-500/15', border: 'border-blue-500/30', icon: '🚀' },
        completed: { color: COLORS.success, label: 'Завершен', bg: 'bg-green-500/15', border: 'border-green-500/30', icon: '✅' },
        cancelled: { color: COLORS.error, label: 'Отменен', bg: 'bg-red-500/15', border: 'border-red-500/30', icon: '❌' }
      },
      service: {
        taxi: { color: DRIVER_COLORS.taxi, label: 'Такси', bg: 'bg-orange-500/15', border: 'border-orange-500/30', icon: '🚕' },
        delivery: { color: DRIVER_COLORS.delivery, label: 'Доставка', bg: 'bg-blue-500/15', border: 'border-blue-500/30', icon: '📦' },
        shuttle: { color: DRIVER_COLORS.shuttle, label: 'Шаттл', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', icon: '🚐' },
        truck: { color: DRIVER_COLORS.truck, label: 'Грузоперевозки', bg: 'bg-purple-500/15', border: 'border-purple-500/30', icon: '🚛' },
        personal: { color: DRIVER_COLORS.personal, label: 'Личный', bg: 'bg-slate-500/15', border: 'border-slate-500/30', icon: '👤' },
        premium: { color: DRIVER_COLORS.premium, label: 'Премиум', bg: 'bg-violet-500/15', border: 'border-violet-500/30', icon: '⭐' },
        economy: { color: DRIVER_COLORS.economy, label: 'Эконом', bg: 'bg-blue-500/15', border: 'border-blue-500/30', icon: '💰' },
        comfort: { color: DRIVER_COLORS.comfort, label: 'Комфорт', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', icon: '🛋️' }
      },
      vehicle: {
        sedan: { color: COLORS.blue, label: 'Седан', bg: 'bg-blue-500/15', border: 'border-blue-500/30', icon: '🚗' },
        suv: { color: COLORS.emerald, label: 'Внедорожник', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', icon: '🚙' },
        minivan: { color: COLORS.orange, label: 'Минивэн', bg: 'bg-orange-500/15', border: 'border-orange-500/30', icon: '🚐' },
        truck: { color: COLORS.purple, label: 'Грузовик', bg: 'bg-purple-500/15', border: 'border-purple-500/30', icon: '🚛' },
        motorcycle: { color: COLORS.rose, label: 'Мотоцикл', bg: 'bg-rose-500/15', border: 'border-rose-500/30', icon: '🏍️' },
        bus: { color: COLORS.amber, label: 'Автобус', bg: 'bg-amber-500/15', border: 'border-amber-500/30', icon: '🚌' },
        premium: { color: COLORS.violet, label: 'Премиум', bg: 'bg-violet-500/15', border: 'border-violet-500/30', icon: '⭐' },
        economy: { color: COLORS.blue, label: 'Эконом', bg: 'bg-blue-500/15', border: 'border-blue-500/30', icon: '💰' },
        comfort: { color: COLORS.emerald, label: 'Комфорт', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', icon: '🛋️' }
      },
      priority: {
        high: { color: DRIVER_COLORS.high, label: 'Высокий', bg: 'bg-red-500/15', border: 'border-red-500/30', icon: '🔴' },
        medium: { color: DRIVER_COLORS.medium, label: 'Средний', bg: 'bg-orange-500/15', border: 'border-orange-500/30', icon: '🟡' },
        low: { color: DRIVER_COLORS.low, label: 'Низкий', bg: 'bg-green-500/15', border: 'border-green-500/30', icon: '🟢' },
        urgent: { color: COLORS.rose, label: 'Срочный', bg: 'bg-rose-500/15', border: 'border-rose-500/30', icon: '🚨' },
        normal: { color: COLORS.blue, label: 'Обычный', bg: 'bg-blue-500/15', border: 'border-blue-500/30', icon: 'ℹ️' }
      }
    };

    const configMap = baseConfig[type] || baseConfig.default;
    return configMap[status] || { 
      color: COLORS.slate, 
      label: status, 
      bg: 'bg-slate-500/15', 
      border: 'border-slate-500/30',
      icon: '⚪'
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
      className={`inline-flex items-center rounded-full font-medium border backdrop-blur-sm ${config.bg} ${config.border} ${sizeClasses[size]}`}
      style={{ color: `rgb(${config.color})` }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {withIcon && (
        <motion.span 
          className={`mr-2 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}
          animate={animated ? { 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={animated ? { 
            duration: 2, 
            repeat: Infinity,
            repeatType: "reverse"
          } : {}}
        >
          {config.icon}
        </motion.span>
      )}
      {config.label}
    </motion.span>
  );
};

const ProgressBar = ({ 
  value, 
  max = 100, 
  color = COLORS.teal, 
  label, 
  showValue = true, 
  size = 'md',
  animated = true,
  formatValue
}: { 
  value: number; 
  max?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  formatValue?: (value: number) => string;
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';
  
  const displayValue = formatValue ? formatValue(value) : `${percentage.toFixed(1)}%`;

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className={`flex justify-between text-slate-300 mb-2 ${textSize}`}>
          {label && <span>{label}</span>}
          {showValue && <span className="font-semibold">{displayValue}</span>}
        </div>
      )}
      <div className={`w-full bg-slate-700/50 rounded-full ${height} overflow-hidden backdrop-blur-sm`}>
        <motion.div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${height}`}
          initial={animated ? { width: 0 } : false}
          animate={animated ? { width: `${percentage}%` } : false}
          style={{ 
            backgroundColor: `rgb(${color})`,
            boxShadow: `0 0 12px rgba(${color}, 0.4)`,
            backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)`
          }}
          transition={animated ? { 
            duration: 1.5, 
            ease: "easeOut",
            delay: 0.2 
          } : {}}
        />
      </div>
    </div>
  );
};

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = COLORS.teal, 
  subtitle, 
  onClick, 
  trend,
  formatValue,
  loading = false
}: {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color?: string;
  subtitle?: string;
  onClick?: () => void;
  trend?: 'up' | 'down' | 'neutral';
  formatValue?: (value: number) => string;
  loading?: boolean;
}) => {
  const trendConfig = trend || (change !== undefined ? (change >= 0 ? 'up' : 'down') : 'neutral');
  
  const displayValue = formatValue && typeof value === 'number' ? formatValue(value) : value;

  if (loading) {
    return (
      <BentoCard className="p-6" glowColor={color} padding="p-6" animated={false}>
        <div className="animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-slate-700 rounded-2xl"></div>
            <div className="w-16 h-6 bg-slate-700 rounded-full"></div>
          </div>
          <div className="w-3/4 h-8 bg-slate-700 rounded mb-2"></div>
          <div className="w-1/2 h-4 bg-slate-700 rounded"></div>
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
            className={`text-sm font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border ${
              trendConfig === 'up' 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
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
        {displayValue}
      </motion.div>
      <motion.div 
        className="text-slate-300 text-sm font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.div>
      {subtitle && (
        <motion.div 
          className="text-slate-400 text-xs mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {subtitle}
        </motion.div>
      )}
    </BentoCard>
  );
};

// Типы данных
interface Driver {
  id: string;
  personalInfo: {
    fullName: string;
    birthDate: string;
    gender: 'male' | 'female';
    phone: string;
    email: string;
    address: string;
    licenseNumber: string;
    licenseExpiry: string;
    medicalCheckExpiry: string;
    avatar?: string;
  };
  workInfo: {
    serviceType: 'taxi' | 'delivery' | 'shuttle' | 'truck' | 'personal' | 'premium' | 'economy' | 'comfort';
    status: 'active' | 'inactive' | 'on_trip' | 'on_break' | 'available' | 'busy' | 'maintenance';
    hireDate: string;
    zone: string;
    workingHours: {
      days: string[];
      hours: string;
    };
    rating: number;
    completedTrips: number;
    totalEarnings: number;
    monthlyEarnings: number;
    weeklyEarnings: number;
  };
  vehicle: {
    type: 'sedan' | 'suv' | 'minivan' | 'truck' | 'motorcycle' | 'bus' | 'premium' | 'economy' | 'comfort';
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
    insuranceExpiry: string;
    lastMaintenance: string;
    nextMaintenance: string;
    capacity?: string;
    features?: string[];
  };
  currentTrips: Trip[];
  performance: {
    onTimeRate: number;
    averageTripTime: number;
    customerRating: number;
    safetyScore: number;
    fuelEfficiency: number;
    lastEvaluation: string;
    monthlyGoals: {
      trips: number;
      earnings: number;
      rating: number;
    };
    achievements?: string[];
    notes?: string;
  };
  documents: {
    licenseFront: string;
    licenseBack: string;
    insurance: string;
    registration: string;
  };
}

interface Trip {
  id: string;
  type: 'taxi' | 'delivery' | 'shuttle' | 'truck' | 'premium' | 'economy' | 'comfort';
  priority: 'high' | 'medium' | 'low' | 'urgent' | 'normal';
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  destinationAddress: string;
  distance: number;
  estimatedTime: number;
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedTime: string;
  startTime?: string;
  endTime?: string;
  fare: number;
  specialRequirements?: string;
  paymentMethod: 'cash' | 'card' | 'mobile' | 'corporate';
  driverId?: string;
  routePolyline?: string;
  realTimeLocation?: {
    lat: number;
    lng: number;
    timestamp: string;
  };
}

// Моки данных для водителей
const drivers: Driver[] = [
  {
    id: 'drv-001',
    personalInfo: {
      fullName: 'Петров Иван Сергеевич',
      birthDate: '1985-03-15',
      gender: 'male',
      phone: '+7 (916) 123-45-67',
      email: 'i.petrov@driver.ru',
      address: 'г. Москва, ул. Ленина, д. 25, кв. 12',
      licenseNumber: 'AB123456',
      licenseExpiry: '2026-05-20',
      medicalCheckExpiry: '2024-11-15',
      avatar: '👨‍💼'
    },
    workInfo: {
      serviceType: 'premium',
      status: 'on_trip',
      hireDate: '2020-08-10',
      zone: 'Центральный округ',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        hours: '08:00-20:00'
      },
      rating: 4.8,
      completedTrips: 2450,
      totalEarnings: 1850000,
      monthlyEarnings: 185000,
      weeklyEarnings: 45000
    },
    vehicle: {
      type: 'premium',
      make: 'Mercedes',
      model: 'E-Class',
      year: 2023,
      licensePlate: 'A123BC777',
      color: 'Черный',
      insuranceExpiry: '2024-12-31',
      lastMaintenance: '2024-05-15',
      nextMaintenance: '2024-08-15',
      capacity: '4 пассажира',
      features: ['Кондиционер', 'Кожаный салон', 'Wi-Fi', 'Зарядка USB']
    },
    currentTrips: [
      {
        id: 'trip-001',
        type: 'premium',
        priority: 'high',
        customerName: 'Иванова Мария Петровна',
        customerPhone: '+7 (916) 999-88-77',
        pickupAddress: 'г. Москва, ул. Тверская, д. 15, БЦ "Тверской"',
        destinationAddress: 'Аэропорт Шереметьево, терминал D',
        distance: 32.5,
        estimatedTime: 45,
        status: 'in_progress',
        assignedTime: '2024-06-25T14:30:00',
        startTime: '2024-06-25T14:35:00',
        fare: 2500,
        paymentMethod: 'card',
        driverId: 'drv-001',
        realTimeLocation: {
          lat: 55.7558,
          lng: 37.6173,
          timestamp: '2024-06-25T15:10:00'
        }
      }
    ],
    performance: {
      onTimeRate: 96,
      averageTripTime: 28,
      customerRating: 4.9,
      safetyScore: 98,
      fuelEfficiency: 8.2,
      lastEvaluation: '2024-05-20',
      monthlyGoals: {
        trips: 200,
        earnings: 200000,
        rating: 4.8
      },
      achievements: ['Лучший водитель месяца', '1000+ поездок', '5 звезд рейтинга'],
      notes: 'Опытный водитель, отличное знание города. Вежлив с клиентами, всегда соблюдает правила дорожного движения. Идеально подходит для VIP-клиентов.'
    },
    documents: {
      licenseFront: '/docs/license-front-001.jpg',
      licenseBack: '/docs/license-back-001.jpg',
      insurance: '/docs/insurance-001.pdf',
      registration: '/docs/registration-001.pdf'
    }
  },
  {
    id: 'drv-002',
    personalInfo: {
      fullName: 'Сидорова Елена Викторовна',
      birthDate: '1990-07-22',
      gender: 'female',
      phone: '+7 (925) 234-56-78',
      email: 'e.sidorova@driver.ru',
      address: 'г. Москва, пр. Мира, д. 89, кв. 45',
      licenseNumber: 'CD654321',
      licenseExpiry: '2027-03-10',
      medicalCheckExpiry: '2024-09-20',
      avatar: '👩‍💼'
    },
    workInfo: {
      serviceType: 'delivery',
      status: 'available',
      hireDate: '2022-01-15',
      zone: 'Северный округ',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
        hours: '09:00-18:00'
      },
      rating: 4.6,
      completedTrips: 890,
      totalEarnings: 745000,
      monthlyEarnings: 85000,
      weeklyEarnings: 21000
    },
    vehicle: {
      type: 'suv',
      make: 'Hyundai',
      model: 'Tucson',
      year: 2021,
      licensePlate: 'B456DE777',
      color: 'Серый металлик',
      insuranceExpiry: '2024-11-30',
      lastMaintenance: '2024-04-20',
      nextMaintenance: '2024-07-20',
      capacity: '5 пассажиров + багаж',
      features: ['Кондиционер', 'Парктроник', 'Камера заднего вида']
    },
    currentTrips: [
      {
        id: 'trip-002',
        type: 'delivery',
        priority: 'urgent',
        customerName: 'ООО "Логистик Про"',
        customerPhone: '+7 (495) 123-45-67',
        pickupAddress: 'Складской комплекс, ш. Энтузиастов, д. 12, ворота 3',
        destinationAddress: 'ТЦ "Мега", ул. Химки, д. 15, loading zone',
        distance: 18.3,
        estimatedTime: 35,
        status: 'assigned',
        assignedTime: '2024-06-25T15:00:00',
        fare: 1200,
        specialRequirements: 'Хрупкий груз, требуется бережная перевозка',
        paymentMethod: 'corporate',
        driverId: 'drv-002'
      }
    ],
    performance: {
      onTimeRate: 94,
      averageTripTime: 32,
      customerRating: 4.7,
      safetyScore: 96,
      fuelEfficiency: 7.8,
      lastEvaluation: '2024-04-15',
      monthlyGoals: {
        trips: 120,
        earnings: 90000,
        rating: 4.6
      },
      achievements: ['Безопасное вождение', 'Точность доставки'],
      notes: 'Аккуратный и ответственный водитель. Отлично обращается с грузами, соблюдает сроки доставки. Идеально подходит для работы с корпоративными клиентами.'
    },
    documents: {
      licenseFront: '/docs/license-front-002.jpg',
      licenseBack: '/docs/license-back-002.jpg',
      insurance: '/docs/insurance-002.pdf',
      registration: '/docs/registration-002.pdf'
    }
  },
  {
    id: 'drv-003',
    personalInfo: {
      fullName: 'Козлов Дмитрий Александрович',
      birthDate: '1978-11-05',
      gender: 'male',
      phone: '+7 (916) 345-67-89',
      email: 'd.kozlov@driver.ru',
      address: 'г. Москва, ул. Пушкина, д. 15, кв. 78',
      licenseNumber: 'EF789012',
      licenseExpiry: '2025-09-15',
      medicalCheckExpiry: '2024-08-10',
      avatar: '👨‍🚒'
    },
    workInfo: {
      serviceType: 'truck',
      status: 'on_break',
      hireDate: '2018-05-20',
      zone: 'Московская область',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
        hours: '06:00-22:00'
      },
      rating: 4.9,
      completedTrips: 1560,
      totalEarnings: 3250000,
      monthlyEarnings: 220000,
      weeklyEarnings: 55000
    },
    vehicle: {
      type: 'truck',
      make: 'Volvo',
      model: 'FH16',
      year: 2020,
      licensePlate: 'C789FG777',
      color: 'Синий',
      insuranceExpiry: '2024-10-31',
      lastMaintenance: '2024-06-10',
      nextMaintenance: '2024-09-10',
      capacity: '20 тонн',
      features: ['Спойлер', 'Круиз-контроль', 'Система мониторинга', 'Холодильная установка']
    },
    currentTrips: [],
    performance: {
      onTimeRate: 98,
      averageTripTime: 0,
      customerRating: 4.9,
      safetyScore: 99,
      fuelEfficiency: 5.2,
      lastEvaluation: '2024-03-10',
      monthlyGoals: {
        trips: 25,
        earnings: 250000,
        rating: 4.8
      },
      achievements: ['Без аварий 5 лет', 'Дальние рейсы', 'Сложные маршруты'],
      notes: 'Надежный водитель для дальних рейсов. Безупречная репутация, отличные навыки управления крупногабаритным транспортом. Специализируется на междугородних перевозках.'
    },
    documents: {
      licenseFront: '/docs/license-front-003.jpg',
      licenseBack: '/docs/license-back-003.jpg',
      insurance: '/docs/insurance-003.pdf',
      registration: '/docs/registration-003.pdf'
    }
  },
  {
    id: 'drv-004',
    personalInfo: {
      fullName: 'Николаева Анна Михайловна',
      birthDate: '1992-04-18',
      gender: 'female',
      phone: '+7 (925) 456-78-90',
      email: 'a.nikolaeva@driver.ru',
      address: 'г. Москва, ул. Гагарина, д. 67, кв. 34',
      licenseNumber: 'GH345678',
      licenseExpiry: '2026-12-01',
      medicalCheckExpiry: '2024-10-05',
      avatar: '👩‍🚀'
    },
    workInfo: {
      serviceType: 'shuttle',
      status: 'active',
      hireDate: '2023-02-28',
      zone: 'Аэропорт Шереметьево',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        hours: '07:00-23:00'
      },
      rating: 4.7,
      completedTrips: 420,
      totalEarnings: 560000,
      monthlyEarnings: 65000,
      weeklyEarnings: 16000
    },
    vehicle: {
      type: 'minivan',
      make: 'Mercedes',
      model: 'Vito',
      year: 2023,
      licensePlate: 'D012HI777',
      color: 'Черный',
      insuranceExpiry: '2025-01-15',
      lastMaintenance: '2024-05-28',
      nextMaintenance: '2024-08-28',
      capacity: '8 пассажиров',
      features: ['Кондиционер', 'Отдельные сиденья', 'Багажные полки', 'USB розетки']
    },
    currentTrips: [
      {
        id: 'trip-003',
        type: 'shuttle',
        priority: 'normal',
        customerName: 'Групповой трансфер - Аэрофлот SU 1256',
        customerPhone: '+7 (495) 234-56-78',
        pickupAddress: 'Аэропорт Шереметьево, терминал B, выход 4',
        destinationAddress: 'г. Москва, м. Охотный ряд, гостиница "Метрополь"',
        distance: 28.7,
        estimatedTime: 40,
        status: 'assigned',
        assignedTime: '2024-06-25T16:30:00',
        fare: 3500,
        paymentMethod: 'corporate',
        driverId: 'drv-004'
      }
    ],
    performance: {
      onTimeRate: 95,
      averageTripTime: 35,
      customerRating: 4.8,
      safetyScore: 97,
      fuelEfficiency: 7.5,
      lastEvaluation: '2024-05-05',
      monthlyGoals: {
        trips: 80,
        earnings: 70000,
        rating: 4.7
      },
      achievements: ['Групповые перевозки', 'Аэропорт специалист'],
      notes: 'Вежлива и внимательна с пассажирами. Отлично справляется с групповыми перевозками, знает все тонкости работы в аэропорту. Идеальна для трансферов и корпоративных перевозок.'
    },
    documents: {
      licenseFront: '/docs/license-front-004.jpg',
      licenseBack: '/docs/license-back-004.jpg',
      insurance: '/docs/insurance-004.pdf',
      registration: '/docs/registration-004.pdf'
    }
  },
  {
    id: 'drv-005',
    personalInfo: {
      fullName: 'Волков Алексей Петрович',
      birthDate: '1988-09-12',
      gender: 'male',
      phone: '+7 (916) 567-89-01',
      email: 'a.volkov@driver.ru',
      address: 'г. Москва, ул. Мира, д. 34, кв. 67',
      licenseNumber: 'IJ901234',
      licenseExpiry: '2026-07-18',
      medicalCheckExpiry: '2024-12-20',
      avatar: '👨‍🔧'
    },
    workInfo: {
      serviceType: 'economy',
      status: 'available',
      hireDate: '2021-03-22',
      zone: 'Западный округ',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        hours: '10:00-22:00'
      },
      rating: 4.5,
      completedTrips: 1780,
      totalEarnings: 1420000,
      monthlyEarnings: 120000,
      weeklyEarnings: 30000
    },
    vehicle: {
      type: 'economy',
      make: 'Kia',
      model: 'Rio',
      year: 2022,
      licensePlate: 'E345JK777',
      color: 'Белый',
      insuranceExpiry: '2024-11-15',
      lastMaintenance: '2024-06-05',
      nextMaintenance: '2024-09-05',
      capacity: '4 пассажира',
      features: ['Кондиционер', 'Музыкальная система', 'Эконом-класс']
    },
    currentTrips: [],
    performance: {
      onTimeRate: 92,
      averageTripTime: 31,
      customerRating: 4.6,
      safetyScore: 95,
      fuelEfficiency: 7.9,
      lastEvaluation: '2024-04-28',
      monthlyGoals: {
        trips: 180,
        earnings: 130000,
        rating: 4.5
      },
      achievements: ['Экономный водитель', 'Быстрые поездки'],
      notes: 'Добросовестный и надежный водитель. Всегда готов помочь пассажирам, отлично знает город. Специализируется на быстрых и недорогих поездках по городу.'
    },
    documents: {
      licenseFront: '/docs/license-front-005.jpg',
      licenseBack: '/docs/license-back-005.jpg',
      insurance: '/docs/insurance-005.pdf',
      registration: '/docs/registration-005.pdf'
    }
  },
  {
    id: 'drv-006',
    personalInfo: {
      fullName: 'Орлова Светлана Дмитриевна',
      birthDate: '1991-12-03',
      gender: 'female',
      phone: '+7 (925) 678-90-12',
      email: 's.orlova@driver.ru',
      address: 'г. Москва, пр. Вернадского, д. 78, кв. 23',
      licenseNumber: 'KL567890',
      licenseExpiry: '2027-01-25',
      medicalCheckExpiry: '2024-10-30',
      avatar: '👩‍🔬'
    },
    workInfo: {
      serviceType: 'comfort',
      status: 'busy',
      hireDate: '2022-11-08',
      zone: 'Южный округ',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        hours: '08:00-19:00'
      },
      rating: 4.7,
      completedTrips: 620,
      totalEarnings: 520000,
      monthlyEarnings: 58000,
      weeklyEarnings: 14500
    },
    vehicle: {
      type: 'comfort',
      make: 'Skoda',
      model: 'Octavia',
      year: 2022,
      licensePlate: 'F678LM777',
      color: 'Серебристый',
      insuranceExpiry: '2025-02-28',
      lastMaintenance: '2024-05-20',
      nextMaintenance: '2024-08-20',
      capacity: '4 пассажира',
      features: ['Кондиционер', 'Кожаный руль', 'Музыкальная система', 'Комфортные сиденья']
    },
    currentTrips: [
      {
        id: 'trip-004',
        type: 'comfort',
        priority: 'medium',
        customerName: 'ИП Сергеев Константин',
        customerPhone: '+7 (495) 345-67-89',
        pickupAddress: 'г. Москва, ул. Профсоюзная, д. 45, подъезд 2',
        destinationAddress: 'г. Москва, ул. Новый Арбат, д. 15, бизнес-центр "Арбат"',
        distance: 12.3,
        estimatedTime: 25,
        status: 'in_progress',
        assignedTime: '2024-06-25T15:45:00',
        startTime: '2024-06-25T15:50:00',
        fare: 650,
        paymentMethod: 'card',
        driverId: 'drv-006',
        realTimeLocation: {
          lat: 55.6911,
          lng: 37.5736,
          timestamp: '2024-06-25T16:05:00'
        }
      }
    ],
    performance: {
      onTimeRate: 96,
      averageTripTime: 29,
      customerRating: 4.8,
      safetyScore: 97,
      fuelEfficiency: 8.1,
      lastEvaluation: '2024-05-15',
      monthlyGoals: {
        trips: 70,
        earnings: 60000,
        rating: 4.7
      },
      achievements: ['Комфортные поездки', 'Вежливое обслуживание'],
      notes: 'Внимательна к деталям, создает комфортную атмосферу для пассажиров. Отлично подходит для деловых поездок и поездок с детьми. Всегда соблюдает чистоту в салоне.'
    },
    documents: {
      licenseFront: '/docs/license-front-006.jpg',
      licenseBack: '/docs/license-back-006.jpg',
      insurance: '/docs/insurance-006.pdf',
      registration: '/docs/registration-006.pdf'
    }
  },
  {
    id: 'drv-007',
    personalInfo: {
      fullName: 'Громов Михаил Андреевич',
      birthDate: '1983-05-30',
      gender: 'male',
      phone: '+7 (916) 789-01-23',
      email: 'm.gromov@driver.ru',
      address: 'г. Москва, ул. Ленинградская, д. 23, кв. 89',
      licenseNumber: 'MN678901',
      licenseExpiry: '2026-08-14',
      medicalCheckExpiry: '2024-11-25',
      avatar: '👨‍🏭'
    },
    workInfo: {
      serviceType: 'premium',
      status: 'active',
      hireDate: '2019-09-15',
      zone: 'Центральный округ',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        hours: '07:00-21:00'
      },
      rating: 4.9,
      completedTrips: 2100,
      totalEarnings: 1980000,
      monthlyEarnings: 165000,
      weeklyEarnings: 42000
    },
    vehicle: {
      type: 'premium',
      make: 'BMW',
      model: '5 Series',
      year: 2023,
      licensePlate: 'G789NO777',
      color: 'Темно-синий',
      insuranceExpiry: '2024-12-15',
      lastMaintenance: '2024-05-10',
      nextMaintenance: '2024-08-10',
      capacity: '4 пассажира',
      features: ['Премиум салон', 'Массажные кресла', 'Панорамная крыша', 'Премиум звук']
    },
    currentTrips: [],
    performance: {
      onTimeRate: 97,
      averageTripTime: 26,
      customerRating: 4.9,
      safetyScore: 98,
      fuelEfficiency: 8.0,
      lastEvaluation: '2024-04-20',
      monthlyGoals: {
        trips: 170,
        earnings: 180000,
        rating: 4.8
      },
      achievements: ['VIP обслуживание', 'Иностранные языки', 'Бизнес класс'],
      notes: 'Профессионал высшего класса. Владеет английским языком, идеально подходит для работы с иностранными гостями и бизнес-клиентами. Безупречный внешний вид и манеры.'
    },
    documents: {
      licenseFront: '/docs/license-front-007.jpg',
      licenseBack: '/docs/license-back-007.jpg',
      insurance: '/docs/insurance-007.pdf',
      registration: '/docs/registration-007.pdf'
    }
  },
  {
    id: 'drv-008',
    personalInfo: {
      fullName: 'Зайцева Ольга Сергеевна',
      birthDate: '1987-08-14',
      gender: 'female',
      phone: '+7 (925) 890-12-34',
      email: 'o.zaitseva@driver.ru',
      address: 'г. Москва, ул. Садовая, д. 56, кв. 12',
      licenseNumber: 'OP789012',
      licenseExpiry: '2027-02-28',
      medicalCheckExpiry: '2024-09-30',
      avatar: '👩‍🎨'
    },
    workInfo: {
      serviceType: 'comfort',
      status: 'available',
      hireDate: '2022-06-10',
      zone: 'Восточный округ',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
        hours: '08:00-17:00'
      },
      rating: 4.8,
      completedTrips: 730,
      totalEarnings: 610000,
      monthlyEarnings: 55000,
      weeklyEarnings: 13500
    },
    vehicle: {
      type: 'comfort',
      make: 'Toyota',
      model: 'Camry',
      year: 2021,
      licensePlate: 'H890PQ777',
      color: 'Белый жемчуг',
      insuranceExpiry: '2024-10-20',
      lastMaintenance: '2024-06-01',
      nextMaintenance: '2024-09-01',
      capacity: '4 пассажира',
      features: ['Комфортные сиденья', 'Климат-контроль', 'Музыкальная система', 'Светодиодные фары']
    },
    currentTrips: [],
    performance: {
      onTimeRate: 95,
      averageTripTime: 30,
      customerRating: 4.8,
      safetyScore: 96,
      fuelEfficiency: 7.7,
      lastEvaluation: '2024-05-25',
      monthlyGoals: {
        trips: 75,
        earnings: 60000,
        rating: 4.7
      },
      achievements: ['Семейные поездки', 'Детские перевозки'],
      notes: 'Очень аккуратна и внимательна на дороге. Специализируется на семейных поездках, имеет опыт перевозки детей. В салоне всегда идеальная чистота и порядок.'
    },
    documents: {
      licenseFront: '/docs/license-front-008.jpg',
      licenseBack: '/docs/license-back-008.jpg',
      insurance: '/docs/insurance-008.pdf',
      registration: '/docs/registration-008.pdf'
    }
  }
];

// Компонент карточки водителя
const DriverCard = ({ 
  driver, 
  onClick,
  delay = 0 
}: { 
  driver: Driver; 
  onClick?: () => void;
  delay?: number;
}) => {
  const getDriverColor = (status: string) => {
    switch (status) {
      case 'active': return DRIVER_COLORS.active;
      case 'inactive': return DRIVER_COLORS.inactive;
      case 'on_trip': return DRIVER_COLORS.on_trip;
      case 'on_break': return DRIVER_COLORS.on_break;
      case 'available': return DRIVER_COLORS.available;
      case 'busy': return DRIVER_COLORS.busy;
      case 'maintenance': return DRIVER_COLORS.maintenance;
      default: return DRIVER_COLORS.inactive;
    }
  };

  const activeTrips = driver.currentTrips.filter(t => 
    t.status === 'assigned' || t.status === 'in_progress'
  ).length;

  const progress = (driver.workInfo.completedTrips / 3000) * 100;

  return (
    <BentoCard 
      className="p-5 relative overflow-hidden group" 
      glowColor={getDriverColor(driver.workInfo.status)} 
      onClick={onClick}
      delay={delay}
    >
      {/* Фоновый градиент */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <motion.div 
            className="text-2xl p-2 bg-white/10 rounded-2xl backdrop-blur-sm"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {driver.personalInfo.avatar || '👤'}
          </motion.div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-base mb-1 line-clamp-1 leading-tight">
              {driver.personalInfo.fullName}
            </h4>
            <p className="text-slate-400 text-sm flex items-center space-x-1">
              <span>{getVehicleTypeIcon(driver.vehicle.type)}</span>
              <span className="truncate">{driver.vehicle.make} {driver.vehicle.model}</span>
            </p>
          </div>
        </div>
        <StatusBadge 
          status={driver.workInfo.status} 
          animated={driver.workInfo.status === 'on_trip' || driver.workInfo.status === 'in_progress'} 
          size="sm"
        />
      </div>
      
      <div className="space-y-3 text-sm mb-5 relative z-10">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Тип службы:</span>
          <StatusBadge status={driver.workInfo.serviceType} type="service" size="sm" />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Рейсов выполнено:</span>
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">{driver.workInfo.completedTrips}</span>
            <div className="w-16 bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Рейтинг:</span>
          <div className="flex items-center space-x-1 bg-amber-500/10 px-2 py-1 rounded-full">
            <span className="text-amber-500 text-sm">★</span>
            <span className="text-white font-medium text-sm">{driver.workInfo.rating}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Вовремя:</span>
          <span className="text-white font-medium">{driver.performance.onTimeRate}%</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50 relative z-10">
        <div className="text-xs text-slate-400 flex items-center space-x-1">
          <span>🚗</span>
          <span>{activeTrips} активных рейсов</span>
        </div>
        <div className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
          {formatCurrency(driver.workInfo.monthlyEarnings)}
        </div>
      </div>

      {/* Анимированный бордер */}
      <motion.div 
        className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
        initial={{ backgroundPosition: '-100% 0%' }}
        whileHover={{ backgroundPosition: '200% 0%' }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: '200% 100%' }}
      />
    </BentoCard>
  );
};

// Компонент карточки рейса
const TripCard = ({ 
  trip, 
  onClick,
  delay = 0 
}: { 
  trip: Trip; 
  onClick?: () => void;
  delay?: number;
}) => {
  const getTripColor = (status: string) => {
    switch (status) {
      case 'assigned': return DRIVER_COLORS.available;
      case 'in_progress': return DRIVER_COLORS.on_trip;
      case 'completed': return DRIVER_COLORS.active;
      case 'cancelled': return DRIVER_COLORS.inactive;
      default: return DRIVER_COLORS.inactive;
    }
  };

  const isUrgent = trip.priority === 'urgent' || trip.priority === 'high';

  return (
    <BentoCard 
      className={`p-4 relative overflow-hidden ${isUrgent ? 'ring-1 ring-red-500/30' : ''}`}
      glowColor={getTripColor(trip.status)} 
      onClick={onClick}
      delay={delay}
    >
      {isUrgent && (
        <motion.div 
          className="absolute top-2 right-2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full border border-red-500/30">
            🔥 Срочно
          </span>
        </motion.div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <h5 className="text-white font-semibold text-sm mb-1 line-clamp-2 leading-tight">
            {trip.customerName}
          </h5>
          <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
            {trip.pickupAddress} → {trip.destinationAddress}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-1 shrink-0">
          <StatusBadge 
            status={trip.status} 
            animated={trip.status === 'in_progress'} 
            size="sm"
          />
          <div className="flex items-center space-x-1">
            <span className="text-lg">{getServiceTypeIcon(trip.type)}</span>
            <StatusBadge status={trip.type} type="service" size="sm" />
          </div>
        </div>
      </div>
      
      <div className="space-y-2 text-xs mb-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Расстояние:</span>
          <span className="text-white font-medium">{trip.distance} км</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Время:</span>
          <span className="text-white">{trip.estimatedTime} мин</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Стоимость:</span>
          <span className="text-white font-medium bg-blue-500/10 px-2 py-0.5 rounded-full">
            {formatCurrency(trip.fare)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
        <div className="text-xs text-slate-400 flex items-center space-x-1">
          <span>🕒</span>
          <span>{formatTime(trip.assignedTime)}</span>
        </div>
        {trip.priority && (
          <StatusBadge status={trip.priority} type="priority" size="sm" />
        )}
      </div>

      {/* Индикатор статуса */}
      {trip.status === 'in_progress' && trip.realTimeLocation && (
        <motion.div 
          className="absolute bottom-2 left-2 w-2 h-2 bg-green-500 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </BentoCard>
  );
};

// Компонент поиска и фильтров
const SearchAndFilters = ({ 
  onServiceTypeChange, 
  onStatusChange,
  onSearchChange,
  onSortChange,
  serviceType,
  status,
  sortBy,
  searchQuery,
  totalResults
}: {
  onServiceTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  serviceType: string;
  status: string;
  sortBy: string;
  searchQuery: string;
  totalResults: number;
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      onSearchChange(value);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [onSearchChange]);

  const serviceTypes = [
    { value: 'all', label: 'Все типы', icon: '🚗' },
    { value: 'taxi', label: 'Такси', icon: '🚕' },
    { value: 'delivery', label: 'Доставка', icon: '📦' },
    { value: 'shuttle', label: 'Шаттл', icon: '🚐' },
    { value: 'truck', label: 'Грузоперевозки', icon: '🚛' },
    { value: 'premium', label: 'Премиум', icon: '⭐' },
    { value: 'economy', label: 'Эконом', icon: '💰' },
    { value: 'comfort', label: 'Комфорт', icon: '🛋️' }
  ];

  const statusTypes = [
    { value: 'all', label: 'Все статусы', icon: '🔘' },
    { value: 'active', label: 'Активен', icon: '🟢' },
    { value: 'available', label: 'Доступен', icon: '🟢' },
    { value: 'on_trip', label: 'В рейсе', icon: '🔵' },
    { value: 'on_break', label: 'На перерыве', icon: '🟡' },
    { value: 'busy', label: 'Занят', icon: '🔴' },
    { value: 'inactive', label: 'Неактивен', icon: '⚫' }
  ];

  const sortOptions = [
    { value: 'rating', label: 'По рейтингу' },
    { value: 'trips', label: 'По количеству рейсов' },
    { value: 'earnings', label: 'По заработку' },
    { value: 'name', label: 'По имени' },
    { value: 'recent', label: 'По дате найма' }
  ];

  return (
    <motion.div 
      className="flex flex-col lg:flex-row gap-4 p-4 sm:p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 mb-6 backdrop-blur-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Поиск */}
      <div className="flex-1 min-w-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск водителей по имени, машине, зоне..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Фильтры */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="flex items-center space-x-2">
          <select 
            value={serviceType}
            onChange={(e) => onServiceTypeChange(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] transition-colors duration-200"
          >
            {serviceTypes.map(option => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <select 
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] transition-colors duration-200"
          >
            {statusTypes.map(option => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <select 
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] transition-colors duration-200"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Счетчик результатов */}
      {totalResults > 0 && (
        <motion.div 
          className="text-slate-400 text-sm flex items-center justify-center lg:justify-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Найдено: <span className="text-white font-medium ml-1">{totalResults}</span>
        </motion.div>
      )}
    </motion.div>
  );
};

// Анимированный компонент загрузки
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {[...Array(8)].map((_, index) => (
      <BentoCard key={index} className="p-5" animated={false}>
        <div className="animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3 flex-1">
              <div className="w-10 h-10 bg-slate-700 rounded-2xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              </div>
            </div>
            <div className="w-16 h-6 bg-slate-700 rounded-full"></div>
          </div>
          <div className="space-y-3 mb-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 bg-slate-700 rounded w-1/3"></div>
                <div className="h-3 bg-slate-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-3 border-t border-slate-700/50">
            <div className="h-3 bg-slate-700 rounded w-1/3"></div>
            <div className="h-3 bg-slate-700 rounded w-1/4"></div>
          </div>
        </div>
      </BentoCard>
    ))}
  </div>
);

// Основной компонент дашборда водителей
const DriverManagementDashboard = () => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'drivers' | 'trips' | 'performance' | 'analytics'>('overview');
  const [filterServiceType, setFilterServiceType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Имитация загрузки данных
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [activeTab, filterServiceType, filterStatus, searchQuery, sortBy]);

  // Статистика для дашборда
  const stats = useMemo(() => {
    const totalDrivers = drivers.length;
    const activeDrivers = drivers.filter(d => 
      d.workInfo.status === 'active' || d.workInfo.status === 'available'
    ).length;
    const onTripDrivers = drivers.filter(d => d.workInfo.status === 'on_trip').length;
    const totalEarnings = drivers.reduce((acc, driver) => acc + driver.workInfo.totalEarnings, 0);
    const monthlyEarnings = drivers.reduce((acc, driver) => acc + driver.workInfo.monthlyEarnings, 0);
    const totalTrips = drivers.reduce((acc, driver) => acc + driver.workInfo.completedTrips, 0);
    const averageRating = drivers.reduce((acc, driver) => acc + driver.workInfo.rating, 0) / drivers.length;
    const serviceTypes = [...new Set(drivers.map(d => d.workInfo.serviceType))];
    
    return {
      totalDrivers,
      activeDrivers,
      onTripDrivers,
      totalEarnings,
      monthlyEarnings,
      totalTrips,
      averageRating: Number(averageRating.toFixed(1)),
      serviceTypes
    };
  }, []);

  // Фильтрация и сортировка данных
  const filteredDrivers = useMemo(() => {
    let filtered = drivers.filter(driver => {
      const serviceTypeMatch = filterServiceType === 'all' || driver.workInfo.serviceType === filterServiceType;
      const statusMatch = filterStatus === 'all' || driver.workInfo.status === filterStatus;
      const searchMatch = searchQuery === '' || 
        driver.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.workInfo.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());
      
      return serviceTypeMatch && statusMatch && searchMatch;
    });

    // Сортировка
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.workInfo.rating - a.workInfo.rating);
        break;
      case 'trips':
        filtered.sort((a, b) => b.workInfo.completedTrips - a.workInfo.completedTrips);
        break;
      case 'earnings':
        filtered.sort((a, b) => b.workInfo.totalEarnings - a.workInfo.totalEarnings);
        break;
      case 'name':
        filtered.sort((a, b) => a.personalInfo.fullName.localeCompare(b.personalInfo.fullName));
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.workInfo.hireDate).getTime() - new Date(a.workInfo.hireDate).getTime());
        break;
    }

    return filtered;
  }, [filterServiceType, filterStatus, searchQuery, sortBy]);

  const allTrips = useMemo(() => 
    drivers.flatMap(driver => driver.currentTrips), 
  []);

  const activeTrips = useMemo(() => 
    allTrips.filter(trip => trip.status === 'assigned' || trip.status === 'in_progress'),
  [allTrips]);

  // Анимация появления карточек
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Обработчики фильтров
  const handleServiceTypeChange = useCallback((value: string) => {
    setFilterServiceType(value);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setFilterStatus(value);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-3 sm:p-4 lg:p-6 overflow-x-hidden">
      {/* Кастомные стили для скроллбара */}
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
        className="mb-6 sm:mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <motion.h1 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Управление Водителями
            </motion.h1>
            <motion.p 
              className="text-slate-400 text-base sm:text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Мониторинг и управление парком водителей в реальном времени
            </motion.p>
          </div>
          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button 
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-medium transition-all duration-200 flex items-center space-x-2 text-sm sm:text-base"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">+</span>
              <span>Новый водитель</span>
            </motion.button>
            <motion.button 
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-all duration-200 flex items-center space-x-2 text-sm sm:text-base"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">+</span>
              <span>Создать рейс</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Навигация */}
        <motion.nav 
          className="flex space-x-1 p-1 bg-slate-800/50 rounded-2xl backdrop-blur-xl border border-slate-700/50 mb-4 overflow-x-auto custom-scrollbar"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { id: 'overview', label: 'Обзор', icon: '📊', color: COLORS.blue },
            { id: 'drivers', label: 'Водители', icon: '👨‍✈️', color: COLORS.emerald },
            { id: 'trips', label: 'Рейсы', icon: '🛣️', color: COLORS.orange },
            { id: 'performance', label: 'Эффективность', icon: '📈', color: COLORS.purple },
            { id: 'analytics', label: 'Аналитика', icon: '📊', color: COLORS.cyan }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap min-w-max ${
                activeTab === tab.id
                  ? 'text-white shadow-lg shadow-black/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              style={{
                background: activeTab === tab.id ? 
                  `linear-gradient(135deg, rgba(${tab.color}, 0.15) 0%, rgba(${tab.color}, 0.05) 100%)` : 
                  'transparent',
                border: activeTab === tab.id ? `1px solid rgba(${tab.color}, 0.3)` : '1px solid transparent'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </motion.nav>

        {/* Фильтры */}
        {(activeTab === 'drivers' || activeTab === 'trips') && (
          <SearchAndFilters
            onServiceTypeChange={handleServiceTypeChange}
            onStatusChange={handleStatusChange}
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
            serviceType={filterServiceType}
            status={filterStatus}
            sortBy={sortBy}
            searchQuery={searchQuery}
            totalResults={activeTab === 'drivers' ? filteredDrivers.length : activeTrips.length}
          />
        )}
      </motion.header>

      {/* Основной контент */}
      <main className="relative">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingSkeleton />
            </motion.div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Статистика */}
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants}>
                      <StatCard
                        title="Всего водителей"
                        value={stats.totalDrivers}
                        change={5.2}
                        icon="👨‍✈️"
                        color={DRIVER_COLORS.active}
                        subtitle={`${stats.activeDrivers} активных`}
                        trend="up"
                        formatValue={formatCompactNumber}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <StatCard
                        title="В рейсе сейчас"
                        value={stats.onTripDrivers}
                        change={8.7}
                        icon="🛣️"
                        color={DRIVER_COLORS.on_trip}
                        subtitle="выполняют рейсы"
                        trend="up"
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <StatCard
                        title="Всего рейсов"
                        value={stats.totalTrips}
                        change={12.3}
                        icon="📦"
                        color={DRIVER_COLORS.delivery}
                        subtitle="выполнено"
                        trend="up"
                        formatValue={formatCompactNumber}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <StatCard
                        title="Общий доход"
                        value={formatCurrency(stats.monthlyEarnings)}
                        change={15.8}
                        icon="💰"
                        color={DRIVER_COLORS.taxi}
                        subtitle="за текущий месяц"
                        trend="up"
                      />
                    </motion.div>
                  </motion.div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {/* Лучшие водители */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <BentoCard className="p-4 sm:p-6" glowColor={DRIVER_COLORS.active}>
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                          <h3 className="text-lg sm:text-xl font-bold text-white">Лучшие водители</h3>
                          <motion.button 
                            className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                            whileHover={{ x: 2 }}
                          >
                            <span>Все</span>
                            <span>→</span>
                          </motion.button>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                          {drivers
                            .filter(d => d.workInfo.status === 'active' || d.workInfo.status === 'available')
                            .sort((a, b) => b.workInfo.rating - a.workInfo.rating)
                            .slice(0, 3)
                            .map((driver, index) => (
                            <motion.div 
                              key={driver.id}
                              className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                              onClick={() => setSelectedDriver(driver)}
                              whileHover={{ scale: 1.02, y: -2 }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                            >
                              <div className="text-2xl p-2 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold min-w-[44px]">
                                {driver.personalInfo.avatar || '👤'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium text-sm truncate group-hover:text-cyan-300 transition-colors">
                                  {driver.personalInfo.fullName}
                                </h4>
                                <p className="text-slate-400 text-xs truncate">
                                  {getServiceTypeIcon(driver.workInfo.serviceType)} {driver.workInfo.serviceType} • {driver.vehicle.make} {driver.vehicle.model}
                                </p>
                              </div>
                              <div className="flex items-center space-x-1 bg-amber-500/20 px-2 py-1 rounded-full border border-amber-500/30">
                                <span className="text-amber-500 text-sm">★</span>
                                <span className="text-white text-sm font-medium">{driver.workInfo.rating}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </BentoCard>
                    </motion.div>

                    {/* Активные рейсы */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <BentoCard className="p-4 sm:p-6" glowColor={DRIVER_COLORS.on_trip}>
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                          <h3 className="text-lg sm:text-xl font-bold text-white">Активные рейсы</h3>
                          <motion.button 
                            className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                            whileHover={{ x: 2 }}
                          >
                            <span>Все</span>
                            <span>→</span>
                          </motion.button>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                          {activeTrips
                            .slice(0, 3)
                            .map((trip, index) => (
                            <motion.div 
                              key={trip.id}
                              className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                              onClick={() => setSelectedTrip(trip)}
                              whileHover={{ scale: 1.02, y: -2 }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 + 0.4 }}
                            >
                              <div className={`text-2xl p-2 rounded-2xl flex items-center justify-center text-white font-bold min-w-[44px] ${
                                trip.priority === 'high' || trip.priority === 'urgent' ? 'bg-gradient-to-br from-red-500 to-pink-500' :
                                trip.priority === 'medium' ? 'bg-gradient-to-br from-orange-500 to-amber-500' :
                                'bg-gradient-to-br from-green-500 to-emerald-500'
                              }`}>
                                {getServiceTypeIcon(trip.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium text-sm line-clamp-2 group-hover:text-cyan-300 transition-colors">
                                  {trip.customerName}
                                </h4>
                                <p className="text-slate-400 text-xs line-clamp-2">
                                  {trip.pickupAddress} → {trip.destinationAddress}
                                </p>
                              </div>
                              <StatusBadge status={trip.status} size="sm" />
                            </motion.div>
                          ))}
                        </div>
                      </BentoCard>
                    </motion.div>
                  </div>

                  {/* Типы служб и эффективность */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Типы служб */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <BentoCard className="p-4 sm:p-6" glowColor={DRIVER_COLORS.taxi}>
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                          <h3 className="text-lg sm:text-xl font-bold text-white">Распределение по типам служб</h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                          {stats.serviceTypes.map((serviceType, index) => {
                            const typeDrivers = drivers.filter(d => d.workInfo.serviceType === serviceType);
                            const activeTypeDrivers = typeDrivers.filter(d => d.workInfo.status === 'active' || d.workInfo.status === 'available');
                            
                            return (
                              <motion.div 
                                key={serviceType} 
                                className="text-center p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                                whileHover={{ scale: 1.05, y: -2 }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.5 }}
                              >
                                <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                                  {getServiceTypeIcon(serviceType)}
                                </div>
                                <h4 className="text-white font-medium text-sm capitalize mb-1 group-hover:text-cyan-300 transition-colors">
                                  {serviceType}
                                </h4>
                                <p className="text-slate-400 text-xs">
                                  {activeTypeDrivers.length}/{typeDrivers.length} активных
                                </p>
                              </motion.div>
                            );
                          })}
                        </div>
                      </BentoCard>
                    </motion.div>

                    {/* Показатели эффективности */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <BentoCard className="p-4 sm:p-6" glowColor={DRIVER_COLORS.delivery}>
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                          <h3 className="text-lg sm:text-xl font-bold text-white">Общая эффективность</h3>
                        </div>
                        <div className="space-y-4 sm:space-y-6">
                          <div>
                            <div className="flex justify-between text-sm text-slate-300 mb-2">
                              <span>Средний рейтинг водителей</span>
                              <span className="font-semibold flex items-center space-x-1">
                                <span>★</span>
                                <span>{stats.averageRating}/5</span>
                              </span>
                            </div>
                            <ProgressBar 
                              value={(stats.averageRating / 5) * 100} 
                              color={DRIVER_COLORS.active}
                              formatValue={(value) => `${(value / 20).toFixed(1)}/5`}
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm text-slate-300 mb-2">
                              <span>Пунктуальность доставки</span>
                              <span className="font-semibold">
                                {Math.round(drivers.reduce((acc, d) => acc + d.performance.onTimeRate, 0) / drivers.length)}%
                              </span>
                            </div>
                            <ProgressBar 
                              value={drivers.reduce((acc, d) => acc + d.performance.onTimeRate, 0) / drivers.length} 
                              color={DRIVER_COLORS.available}
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm text-slate-300 mb-2">
                              <span>Уровень безопасности</span>
                              <span className="font-semibold">
                                {Math.round(drivers.reduce((acc, d) => acc + d.performance.safetyScore, 0) / drivers.length)}%
                              </span>
                            </div>
                            <ProgressBar 
                              value={drivers.reduce((acc, d) => acc + d.performance.safetyScore, 0) / drivers.length} 
                              color={DRIVER_COLORS.truck}
                            />
                          </div>
                        </div>
                      </BentoCard>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'drivers' && (
                <motion.div
                  key="drivers"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4 sm:mb-6">
                    <motion.h2 
                      className="text-xl sm:text-2xl font-bold text-white mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      Парк водителей
                    </motion.h2>
                    <motion.p 
                      className="text-slate-400 text-sm sm:text-base"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      Управление водителями и их транспортными средствами
                    </motion.p>
                  </div>
                  
                  {filteredDrivers.length > 0 ? (
                    <motion.div 
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {filteredDrivers.map((driver, index) => (
                        <motion.div key={driver.id} variants={itemVariants}>
                          <DriverCard 
                            driver={driver} 
                            onClick={() => setSelectedDriver(driver)}
                            delay={index}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="text-center py-8 sm:py-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="text-4xl sm:text-6xl mb-4">🔍</div>
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Водители не найдены</h3>
                      <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
                        Попробуйте изменить параметры поиска или фильтры для отображения результатов
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === 'trips' && (
                <motion.div
                  key="trips"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4 sm:mb-6">
                    <motion.h2 
                      className="text-xl sm:text-2xl font-bold text-white mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      Активные рейсы
                    </motion.h2>
                    <motion.p 
                      className="text-slate-400 text-sm sm:text-base"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      Управление текущими и запланированными рейсами
                    </motion.p>
                  </div>
                  
                  {activeTrips.length > 0 ? (
                    <motion.div 
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {activeTrips.map((trip, index) => (
                        <motion.div key={trip.id} variants={itemVariants}>
                          <TripCard 
                            trip={trip} 
                            onClick={() => setSelectedTrip(trip)}
                            delay={index}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="text-center py-8 sm:py-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="text-4xl sm:text-6xl mb-4">🚗</div>
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Нет активных рейсов</h3>
                      <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
                        Все водители свободны или выполняют другие задачи. Новые рейсы появятся здесь автоматически.
                      </p>
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
                  <div className="mb-4 sm:mb-6">
                    <motion.h2 
                      className="text-xl sm:text-2xl font-bold text-white mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      Эффективность работы
                    </motion.h2>
                    <motion.p 
                      className="text-slate-400 text-sm sm:text-base"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      Мониторинг производительности водителей и ключевые показатели
                    </motion.p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Рейтинги водителей */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <BentoCard className="p-4 sm:p-6" glowColor={DRIVER_COLORS.active}>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Рейтинги водителей</h3>
                        <div className="space-y-3 sm:space-y-4">
                          {drivers
                            .sort((a, b) => b.workInfo.rating - a.workInfo.rating)
                            .map((driver, index) => (
                            <motion.div 
                              key={driver.id}
                              className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                              onClick={() => setSelectedDriver(driver)}
                              whileHover={{ scale: 1.02, y: -2 }}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="text-2xl p-2 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold min-w-[44px]">
                                {driver.personalInfo.avatar || '👤'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium text-sm truncate group-hover:text-amber-300 transition-colors">
                                  {driver.personalInfo.fullName}
                                </h4>
                                <p className="text-slate-400 text-xs">
                                  {driver.workInfo.completedTrips} рейсов • {driver.workInfo.serviceType}
                                </p>
                              </div>
                              <div className="flex items-center space-x-1 bg-amber-500/20 px-2 py-1 rounded-full border border-amber-500/30">
                                <span className="text-amber-500 text-sm">★</span>
                                <span className="text-white text-sm font-medium">{driver.workInfo.rating}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </BentoCard>
                    </motion.div>

                    {/* Показатели эффективности */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <BentoCard className="p-4 sm:p-6" glowColor={DRIVER_COLORS.delivery}>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Ключевые показатели</h3>
                        <div className="space-y-4 sm:space-y-6">
                          <div>
                            <div className="flex justify-between text-sm text-slate-300 mb-2">
                              <span>Средний рейтинг команды</span>
                              <span className="font-semibold flex items-center space-x-1">
                                <span>★</span>
                                <span>{stats.averageRating}/5</span>
                              </span>
                            </div>
                            <ProgressBar 
                              value={(stats.averageRating / 5) * 100} 
                              color={DRIVER_COLORS.active}
                              formatValue={(value) => `${(value / 20).toFixed(1)}/5`}
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm text-slate-300 mb-2">
                              <span>Общая пунктуальность</span>
                              <span className="font-semibold">
                                {Math.round(drivers.reduce((acc, d) => acc + d.performance.onTimeRate, 0) / drivers.length)}%
                              </span>
                            </div>
                            <ProgressBar 
                              value={drivers.reduce((acc, d) => acc + d.performance.onTimeRate, 0) / drivers.length} 
                              color={DRIVER_COLORS.available}
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm text-slate-300 mb-2">
                              <span>Уровень безопасности</span>
                              <span className="font-semibold">
                                {Math.round(drivers.reduce((acc, d) => acc + d.performance.safetyScore, 0) / drivers.length)}%
                              </span>
                            </div>
                            <ProgressBar 
                              value={drivers.reduce((acc, d) => acc + d.performance.safetyScore, 0) / drivers.length} 
                              color={DRIVER_COLORS.truck}
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-sm text-slate-300 mb-2">
                              <span>Эффективность топлива</span>
                              <span className="font-semibold">
                                {Math.round(drivers.reduce((acc, d) => acc + d.performance.fuelEfficiency, 0) / drivers.length)} л/100км
                              </span>
                            </div>
                            <ProgressBar 
                              value={(drivers.reduce((acc, d) => acc + d.performance.fuelEfficiency, 0) / drivers.length) * 10} 
                              color={DRIVER_COLORS.success}
                              formatValue={(value) => `${(value / 10).toFixed(1)} л/100км`}
                            />
                          </div>
                        </div>
                      </BentoCard>
                    </motion.div>
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
                  <div className="mb-4 sm:mb-6">
                    <motion.h2 
                      className="text-xl sm:text-2xl font-bold text-white mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      Аналитика и отчеты
                    </motion.h2>
                    <motion.p 
                      className="text-slate-400 text-sm sm:text-base"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      Детальная аналитика работы парка водителей
                    </motion.p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <BentoCard className="p-4 sm:p-6" glowColor={COLORS.blue}>
                      <h3 className="text-lg font-bold text-white mb-4">Статистика доходов</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Месячный доход:</span>
                          <span className="text-white font-semibold">{formatCurrency(stats.monthlyEarnings)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Общий доход:</span>
                          <span className="text-white font-semibold">{formatCurrency(stats.totalEarnings)}</span>
                        </div>
                        <ProgressBar value={75} label="Выполнение плана" color={COLORS.success} />
                      </div>
                    </BentoCard>

                    <BentoCard className="p-4 sm:p-6" glowColor={COLORS.purple}>
                      <h3 className="text-lg font-bold text-white mb-4">Активность водителей</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Активные:</span>
                          <span className="text-emerald-500 font-semibold">{stats.activeDrivers}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">В рейсе:</span>
                          <span className="text-blue-500 font-semibold">{stats.onTripDrivers}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Свободны:</span>
                          <span className="text-slate-400 font-semibold">{stats.activeDrivers - stats.onTripDrivers}</span>
                        </div>
                      </div>
                    </BentoCard>

                    <BentoCard className="p-4 sm:p-6" glowColor={COLORS.orange}>
                      <h3 className="text-lg font-bold text-white mb-4">Эффективность парка</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Средний рейтинг:</span>
                          <span className="text-amber-500 font-semibold">{stats.averageRating}/5</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Рейсов на водителя:</span>
                          <span className="text-white font-semibold">{Math.round(stats.totalTrips / stats.totalDrivers)}</span>
                        </div>
                        <ProgressBar 
                          value={(stats.totalTrips / (stats.totalDrivers * 100)) * 100} 
                          label="Загрузка парка" 
                          color={COLORS.orange}
                        />
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
      <Modal 
        isOpen={!!selectedDriver} 
        onClose={() => setSelectedDriver(null)}
        title={`Водитель: ${selectedDriver?.personalInfo.fullName}`}
        size="xl"
      >
        {selectedDriver && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <BentoCard className="p-4 sm:p-6" glowColor={DRIVER_COLORS.active}>
                <h4 className="text-lg font-semibold text-white mb-3 sm:mb-4">Персональная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400">Дата рождения:</span>
                    <span className="text-white text-right">{formatDate(selectedDriver.personalInfo.birthDate)} ({calculateAge(selectedDriver.personalInfo.birthDate)} лет)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Телефон:</span>
                    <span className="text-white">{selectedDriver.personalInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white">{selectedDriver.personalInfo.email}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400">Адрес:</span>
                    <span className="text-white text-right">{selectedDriver.personalInfo.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Водительское удостоверение:</span>
                    <span className="text-white font-mono">{selectedDriver.personalInfo.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Действует до:</span>
                    <span className="text-white">{formatDate(selectedDriver.personalInfo.licenseExpiry)}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-4 sm:p-6" glowColor={DRIVER_COLORS.taxi}>
                <h4 className="text-lg font-semibold text-white mb-3 sm:mb-4">Рабочая информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип службы:</span>
                    <StatusBadge status={selectedDriver.workInfo.serviceType} type="service" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedDriver.workInfo.status} animated />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Зона работы:</span>
                    <span className="text-white">{selectedDriver.workInfo.zone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Работает с:</span>
                    <span className="text-white">{formatDate(selectedDriver.workInfo.hireDate)}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400">График работы:</span>
                    <span className="text-white text-right">{selectedDriver.workInfo.workingHours.days.join(', ')} {selectedDriver.workInfo.workingHours.hours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Рейтинг:</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-amber-500">★</span>
                      <span className="text-white font-medium">{selectedDriver.workInfo.rating}</span>
                    </div>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-4 sm:p-6" glowColor={DRIVER_COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-3 sm:mb-4">Информация о транспорте</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип транспорта:</span>
                    <div className="flex items-center space-x-2">
                      <span>{getVehicleTypeIcon(selectedDriver.vehicle.type)}</span>
                      <StatusBadge status={selectedDriver.vehicle.type} type="vehicle" />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Марка и модель:</span>
                    <span className="text-white">{selectedDriver.vehicle.make} {selectedDriver.vehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Год выпуска:</span>
                    <span className="text-white">{selectedDriver.vehicle.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Госномер:</span>
                    <span className="text-white font-mono">{selectedDriver.vehicle.licensePlate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Цвет:</span>
                    <span className="text-white">{selectedDriver.vehicle.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Вместимость:</span>
                    <span className="text-white">{selectedDriver.vehicle.capacity}</span>
                  </div>
                  {selectedDriver.vehicle.features && (
                    <div className="flex justify-between items-start">
                      <span className="text-slate-400">Особенности:</span>
                      <div className="text-white text-right">
                        {selectedDriver.vehicle.features.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </BentoCard>

              <BentoCard className="p-4 sm:p-6" glowColor={DRIVER_COLORS.available}>
                <h4 className="text-lg font-semibold text-white mb-3 sm:mb-4">Производительность</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Рейтинг:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-amber-500">★</span>
                      <span className="text-white font-semibold">{selectedDriver.workInfo.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Выполнено рейсов:</span>
                    <span className="text-white">{selectedDriver.workInfo.completedTrips}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Пунктуальность:</span>
                    <span className="text-white">{selectedDriver.performance.onTimeRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Безопасность:</span>
                    <span className="text-white">{selectedDriver.performance.safetyScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Эффективность топлива:</span>
                    <span className="text-white">{selectedDriver.performance.fuelEfficiency} л/100км</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Общий заработок:</span>
                    <span className="text-white font-medium">{formatCurrency(selectedDriver.workInfo.totalEarnings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Заработок за месяц:</span>
                    <span className="text-white font-medium">{formatCurrency(selectedDriver.workInfo.monthlyEarnings)}</span>
                  </div>
                </div>
              </BentoCard>
            </div>

            <BentoCard className="p-4 sm:p-6" glowColor={DRIVER_COLORS.on_trip}>
              <h4 className="text-lg font-semibold text-white mb-3 sm:mb-4">Текущие рейсы</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {selectedDriver.currentTrips
                  .filter(trip => trip.status === 'assigned' || trip.status === 'in_progress')
                  .map((trip) => (
                  <TripCard 
                    key={trip.id} 
                    trip={trip} 
                    onClick={() => setSelectedTrip(trip)}
                  />
                ))}
                {selectedDriver.currentTrips.filter(trip => trip.status === 'assigned' || trip.status === 'in_progress').length === 0 && (
                  <div className="col-span-2 text-center py-4 text-slate-400">
                    Нет активных рейсов
                  </div>
                )}
              </div>
            </BentoCard>

            {selectedDriver.performance.notes && (
              <BentoCard className="p-4 sm:p-6" glowColor={DRIVER_COLORS.warning}>
                <h4 className="text-lg font-semibold text-white mb-3 sm:mb-4">Примечания руководителя</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedDriver.performance.notes}</p>
              </BentoCard>
            )}

            {selectedDriver.performance.achievements && selectedDriver.performance.achievements.length > 0 && (
              <BentoCard className="p-4 sm:p-6" glowColor={DRIVER_COLORS.success}>
                <h4 className="text-lg font-semibold text-white mb-3 sm:mb-4">Достижения</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDriver.performance.achievements.map((achievement, index) => (
                    <motion.span
                      key={index}
                      className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs border border-emerald-500/30"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      🏆 {achievement}
                    </motion.span>
                  ))}
                </div>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!selectedTrip} 
        onClose={() => setSelectedTrip(null)}
        title="Информация о рейсе"
        size="lg"
      >
        {selectedTrip && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <BentoCard className="p-4 sm:p-6" glowColor={DRIVER_COLORS.active}>
                <h4 className="text-lg font-semibold text-white mb-3 sm:mb-4">Информация о клиенте</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Клиент:</span>
                    <span className="text-white">{selectedTrip.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Телефон:</span>
                    <span className="text-white">{selectedTrip.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Приоритет:</span>
                    <StatusBadge status={selectedTrip.priority} type="priority" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Способ оплаты:</span>
                    <span className="text-white capitalize">{selectedTrip.paymentMethod}</span>
                  </div>
                  {selectedTrip.specialRequirements && (
                    <div className="flex justify-between items-start">
                      <span className="text-slate-400">Особые требования:</span>
                      <span className="text-white text-right max-w-[200px]">{selectedTrip.specialRequirements}</span>
                    </div>
                  )}
                </div>
              </BentoCard>

              <BentoCard className="p-4 sm:p-6" glowColor={DRIVER_COLORS.available}>
                <h4 className="text-lg font-semibold text-white mb-3 sm:mb-4">Детали рейса</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип рейса:</span>
                    <div className="flex items-center space-x-2">
                      <span>{getServiceTypeIcon(selectedTrip.type)}</span>
                      <StatusBadge status={selectedTrip.type} type="service" />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedTrip.status} animated />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Расстояние:</span>
                    <span className="text-white">{selectedTrip.distance} км</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Время в пути:</span>
                    <span className="text-white">{selectedTrip.estimatedTime} мин</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Стоимость:</span>
                    <span className="text-white font-medium">{formatCurrency(selectedTrip.fare)}</span>
                  </div>
                </div>
              </BentoCard>
            </div>

            <BentoCard className="p-4 sm:p-6" glowColor={DRIVER_COLORS.on_trip}>
              <h4 className="text-lg font-semibold text-white mb-3 sm:mb-4">Маршрут</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-slate-400">Откуда:</span>
                  <span className="text-white text-right max-w-[70%]">{selectedTrip.pickupAddress}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-slate-400">Куда:</span>
                  <span className="text-white text-right max-w-[70%]">{selectedTrip.destinationAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Назначен:</span>
                  <span className="text-white">{formatDateTime(selectedTrip.assignedTime)}</span>
                </div>
                {selectedTrip.startTime && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Начало:</span>
                    <span className="text-white">{formatDateTime(selectedTrip.startTime)}</span>
                  </div>
                )}
                {selectedTrip.endTime && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Завершение:</span>
                    <span className="text-white">{formatDateTime(selectedTrip.endTime)}</span>
                  </div>
                )}
                {selectedTrip.realTimeLocation && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Последнее обновление:</span>
                    <span className="text-white">{formatTime(selectedTrip.realTimeLocation.timestamp)}</span>
                  </div>
                )}
              </div>
            </BentoCard>

            {selectedTrip.driverId && (
              <BentoCard className="p-4 sm:p-6" glowColor={DRIVER_COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-3 sm:mb-4">Назначенный водитель</h4>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl p-2 bg-white/10 rounded-2xl">
                    {drivers.find(d => d.id === selectedTrip.driverId)?.personalInfo.avatar || '👤'}
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {drivers.find(d => d.id === selectedTrip.driverId)?.personalInfo.fullName}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {drivers.find(d => d.id === selectedTrip.driverId)?.vehicle.make} {drivers.find(d => d.id === selectedTrip.driverId)?.vehicle.model}
                    </div>
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

export default DriverManagementDashboard;