'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

// Расширенные типы данных
interface KPI {
  label: string;
  value: number;
  change?: number;
  suffix?: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
  icon: string;
  link?: string;
  color?: string;
  details?: string;
}

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
  actionLink?: string;
  read: boolean;
  category: 'appointment' | 'test' | 'prescription' | 'system';
}

interface HealthMetric {
  id: string;
  label: string;
  value: string;
  normalRange: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastUpdate: string;
  details: string;
  unit?: string;
  history?: { date: string; value: string }[];
  recommendations?: string[];
}

interface Procedure {
  id: string;
  name: string;
  category: string;
  duration: string;
  frequency: string;
  status: 'scheduled' | 'completed' | 'pending' | 'cancelled';
  nextSession?: string;
  doctor: string;
  description: string;
  instructions: string[];
  progress?: number;
  location: string;
  cost?: string;
  requirements?: string[];
}

interface Appointment {
  id: string;
  doctorId: number;
  date: Date;
  time: string;
  type: 'consultation' | 'procedure' | 'examination';
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
  doctorName: string;
  specialty: string;
  duration: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  status: 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  instructions: string;
  doctor: string;
  reminders: boolean;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  price: string;
  availableSlots: string[];
  hospital: string;
  education: string;
  specialization: string;
  languages: string[];
  details: {
    patients: string;
    successRate: string;
    reviews: number;
  };
  schedule: {
    monday: string[] | string;
    tuesday: string[] | string;
    wednesday: string[] | string;
    thursday: string[] | string;
    friday: string[] | string;
    saturday: string[] | string;
    sunday: string[] | string;
  };
  bio: string;
}

interface MedicalInfo {
  id: number;
  type: string;
  icon: string;
  items: number;
  lastUpdate: string;
  color: string;
  details: {
    lastVisit?: string;
    nextVisit?: string;
    doctor?: string;
    diagnosis?: string;
    status?: string;
    lastPrescription?: string;
    validUntil?: string;
    pharmacy?: string;
    lastTest?: string;
    results?: string;
    nextTest?: string;
    lastDischarge?: string;
    period?: string;
  };
}

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

const MOBILE_BREAKPOINT = 768;

// Утилиты
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
  return trend === 'up' ? COLORS.success : trend === 'down' ? COLORS.error : COLORS.gray;
};

const getAlertColor = (type: Alert['type']) => {
  return {
    warning: COLORS.warning,
    info: COLORS.info,
    success: COLORS.success,
    error: COLORS.error
  }[type];
};

const getStatusColor = (status: string) => {
  const colorMap: { [key: string]: string } = {
    scheduled: COLORS.blue,
    completed: COLORS.emerald,
    pending: COLORS.orange,
    cancelled: COLORS.error,
    excellent: COLORS.emerald,
    good: COLORS.blue,
    warning: COLORS.orange,
    critical: COLORS.error,
    confirmed: COLORS.emerald,
    active: COLORS.emerald
  };
  return colorMap[status] || COLORS.gray;
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Улучшенный Bento Card компонент с анимациями
const BentoCard = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode;
  className?: string;
  enableEffects?: boolean;
  glowColor?: string;
  onClick?: () => void;
  colSpan?: number;
  rowSpan?: number;
  variant?: 'default' | 'wide' | 'tall' | 'grid' | 'compact';
}>(({ 
  children, 
  className = '', 
  enableEffects = true, 
  glowColor = COLORS.blue, 
  onClick, 
  colSpan = 1, 
  rowSpan = 1, 
  variant = 'default' 
}, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  
  useEffect(() => {
    if (!enableEffects || !cardRef.current || isMobile) return;

    const card = cardRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const relativeX = (x / rect.width) * 100;
      const relativeY = (y / rect.height) * 100;

      gsap.to(card, {
        '--glow-x': `${relativeX}%`,
        '--glow-y': `${relativeY}%`,
        '--glow-intensity': '1',
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        '--glow-intensity': '0',
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enableEffects, isMobile]);

  const colSpanClass = {
    1: '',
    2: 'lg:col-span-2',
    3: 'lg:col-span-3',
    4: 'lg:col-span-4',
  }[colSpan];

  const rowSpanClass = {
    1: '',
    2: 'lg:row-span-2',
  }[rowSpan];

  const variantClass = {
    default: '',
    wide: 'lg:col-span-2',
    tall: 'lg:row-span-2',
    grid: 'lg:col-span-2 lg:row-span-2',
    compact: ''
  }[variant];

  return (
    <motion.div
      ref={ref || cardRef}
      className={`
        relative overflow-hidden 
        rounded-2xl border border-white/10 
        bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg 
        transition-all duration-300 
        hover:border-white/20 hover:bg-white/10
        w-full max-w-full
        ${onClick ? 'cursor-pointer' : ''}
        ${colSpanClass}
        ${rowSpanClass}
        ${variantClass}
        ${className}
      `}
      style={{
        '--glow-x': '50%',
        '--glow-y': '50%',
        '--glow-intensity': '0',
        '--glow-color': glowColor,
      } as React.CSSProperties}
      onClick={onClick}
      whileHover={!isMobile ? { y: -4, scale: 1.02 } : {}}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {enableEffects && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{
            opacity: 'var(--glow-intensity)',
            background: `radial-gradient(400px circle at var(--glow-x) var(--glow-y), 
                         rgba(var(--glow-color), 0.15) 0%, 
                         rgba(var(--glow-color), 0.08) 30%, 
                         transparent 70%)`,
          }}
        />
      )}
      
      {/* Анимированный градиентный бордер */}
      <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
});

BentoCard.displayName = 'BentoCard';

// Улучшенный Modal Component
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
          className={`bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 w-full ${sizeClasses[size]} border border-white/20 max-h-[90vh] overflow-y-auto shadow-2xl`}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          onClick={(e) => e.stopPropagation()}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {title && (
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <motion.h3 
                className="text-white font-bold text-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {title}
              </motion.h3>
              <motion.button
                className="text-white/60 hover:text-white transition-colors text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                ×
              </motion.button>
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Улучшенный KPI Widget компонент
const KPIWidget = React.memo(({ kpi, index }: { kpi: KPI; index: number }) => {
  const trendColor = kpi.color || getTrendColor(kpi.trend);
  const isMobile = useMobileDetection();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 100 }}
      whileHover={!isMobile ? { y: -6, transition: { type: "spring", stiffness: 400 } } : {}}
    >
      <BentoCard 
        className="h-full min-h-[140px]"
        enableEffects={true}
        glowColor={trendColor}
      >
        <div className="h-full flex flex-col justify-between p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <motion.div 
              className="text-2xl sm:text-3xl font-bold text-white leading-tight"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {kpi.value}{kpi.suffix}
            </motion.div>
            <div className="flex flex-col items-end gap-2">
              <motion.div 
                className="text-2xl"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {kpi.icon}
              </motion.div>
              {kpi.change && (
                <motion.div 
                  className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border backdrop-blur-sm`}
                  style={{ 
                    backgroundColor: `rgba(${trendColor}, 0.2)`,
                    color: `rgb(${trendColor})`,
                    borderColor: `rgba(${trendColor}, 0.3)`
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {kpi.trend === 'up' ? '↗' : kpi.trend === 'down' ? '↘' : '→'}
                  {Math.abs(kpi.change)}%
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm sm:text-base font-semibold">{kpi.label}</span>
            </div>
            
            <div className="text-white/60 text-sm leading-relaxed">
              {kpi.description}
            </div>
            
            {kpi.details && (
              <motion.div 
                className="text-white/40 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.7 }}
              >
                {kpi.details}
              </motion.div>
            )}
          </div>
        </div>
      </BentoCard>
    </motion.div>
  );
});

KPIWidget.displayName = 'KPIWidget';

// Улучшенный Alert Widget компонент
const AlertWidget = React.memo(({ alert, onMarkAsRead, index }: { alert: Alert; onMarkAsRead?: (id: string) => void; index: number }) => {
  const alertColor = getAlertColor(alert.type);
  const isMobile = useMobileDetection();
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <BentoCard 
        className="p-4 min-h-[120px] cursor-pointer"
        glowColor={alertColor}
        onClick={() => onMarkAsRead?.(alert.id)}
      >
        <motion.div 
          className="h-full flex flex-col justify-between"
          whileHover={!isMobile ? { x: 4 } : {}}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="flex items-start justify-between mb-3 gap-2">
            <div className="flex items-center gap-2 flex-grow min-w-0">
              {!alert.read && (
                <motion.div 
                  className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <div className="font-semibold text-sm sm:text-base line-clamp-2 flex-grow min-w-0">
                {alert.title}
              </div>
            </div>
            <motion.span 
              className="px-2 py-1 rounded-full text-xs border backdrop-blur-sm flex-shrink-0"
              style={{
                backgroundColor: `rgba(${alertColor}, 0.2)`,
                color: `rgb(${alertColor})`,
                borderColor: `rgba(${alertColor}, 0.3)`
              }}
              whileHover={{ scale: 1.05 }}
            >
              {alert.priority === 'high' ? 'Важно' : alert.priority === 'medium' ? 'Инфо' : 'Уведомление'}
            </motion.span>
          </div>
          
          <div className="space-y-2">
            <p className="text-white/80 text-xs sm:text-sm line-clamp-2 leading-relaxed">{alert.message}</p>
            <div className="flex justify-between items-center">
              <div className="text-white/60 text-xs">{alert.time}</div>
              {alert.action && (
                <motion.button 
                  className="text-white/80 text-xs hover:text-white cursor-pointer flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle action
                  }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {alert.action}
                  <span>→</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </BentoCard>
    </motion.div>
  );
});

AlertWidget.displayName = 'AlertWidget';

// Улучшенный компонент для показателей здоровья
const HealthMetricCard = ({ metric, onClick, index }: { metric: HealthMetric; onClick?: () => void; index: number }) => {
  const statusColor = getStatusColor(metric.status);
  const isMobile = useMobileDetection();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <BentoCard className="p-4 cursor-pointer" glowColor={statusColor} onClick={onClick}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm sm:text-base mb-1 line-clamp-1">{metric.label}</h3>
            <div className="text-white/60 text-xs">Норма: {metric.normalRange}</div>
          </div>
          <div className="text-right ml-2">
            <motion.div 
              className="text-lg sm:text-xl font-bold mb-1"
              style={{ color: `rgb(${statusColor})` }}
              whileHover={{ scale: 1.1 }}
            >
              {metric.value}
            </motion.div>
            <div className="text-white/60 text-xs">{metric.lastUpdate}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: `rgb(${statusColor})` }}
              whileHover={{ scale: 1.5 }}
            />
            <span className="text-white/80 text-xs capitalize">
              {metric.status === 'excellent' ? 'Отлично' : 
               metric.status === 'good' ? 'Хорошо' : 
               metric.status === 'warning' ? 'Внимание' : 'Критично'}
            </span>
          </div>
          <motion.div 
            className="flex items-center gap-1 text-xs"
            whileHover={{ scale: 1.1 }}
          >
            <span style={{ color: `rgb(${getTrendColor(metric.trend)})` }}>
              {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
            </span>
            <span className="text-white/60">тренд</span>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-2 text-white/60 text-xs line-clamp-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
        >
          {metric.details}
        </motion.div>

        {/* Progress indicator for trends */}
        <div className="mt-3 w-full bg-white/10 rounded-full h-1">
          <motion.div 
            className="h-1 rounded-full"
            style={{ 
              width: metric.trend === 'up' ? '75%' : metric.trend === 'down' ? '25%' : '50%',
              backgroundColor: `rgb(${getTrendColor(metric.trend)})`
            }}
            initial={{ width: 0 }}
            animate={{ width: metric.trend === 'up' ? '75%' : metric.trend === 'down' ? '25%' : '50%' }}
            transition={{ delay: index * 0.1 + 0.3, duration: 1 }}
          />
        </div>
      </BentoCard>
    </motion.div>
  );
};

// Улучшенный компонент для процедур
const ProcedureCard = ({ procedure, onClick, index }: { procedure: Procedure; onClick?: () => void; index: number }) => {
  const statusColor = getStatusColor(procedure.status);
  const statusText = {
    scheduled: 'Запланирована',
    completed: 'Завершена',
    pending: 'Ожидание',
    cancelled: 'Отменена'
  }[procedure.status];
  const isMobile = useMobileDetection();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <BentoCard className="p-4 cursor-pointer" glowColor={statusColor} onClick={onClick}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm sm:text-base mb-1 line-clamp-1">{procedure.name}</h3>
            <div className="text-white/60 text-xs mb-2 line-clamp-2">{procedure.description}</div>
            <div className="flex items-center gap-3 text-xs text-white/60 flex-wrap">
              <span className="flex items-center gap-1">⏱️ {procedure.duration}</span>
              <span className="flex items-center gap-1">🔄 {procedure.frequency}</span>
              <span className="flex items-center gap-1">👨‍⚕️ {procedure.doctor}</span>
            </div>
          </div>
          <motion.div 
            className="text-right ml-2"
            whileHover={{ scale: 1.05 }}
          >
            <span 
              className="px-2 py-1 rounded-full text-xs border backdrop-blur-sm"
              style={{
                backgroundColor: `rgba(${statusColor}, 0.2)`,
                color: `rgb(${statusColor})`,
                borderColor: `rgba(${statusColor}, 0.3)`
              }}
            >
              {statusText}
            </span>
          </motion.div>
        </div>

        {procedure.nextSession && (
          <motion.div 
            className="flex items-center justify-between mb-3 text-sm bg-white/5 rounded-lg p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <span className="text-white/60">Следующая:</span>
            <span className="text-white font-medium">{procedure.nextSession}</span>
          </motion.div>
        )}

        {procedure.progress && (
          <motion.div 
            className="mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>Прогресс курса</span>
              <span>{procedure.progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div 
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${procedure.progress}%`,
                  backgroundColor: `rgb(${statusColor})`
                }}
                initial={{ width: 0 }}
                animate={{ width: `${procedure.progress}%` }}
                transition={{ delay: index * 0.1 + 0.4, duration: 1 }}
              />
            </div>
          </motion.div>
        )}

        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.5 }}
        >
          {procedure.instructions.slice(0, 2).map((instruction, instructionIndex) => (
            <motion.div 
              key={instructionIndex}
              className="flex items-center gap-2 text-xs text-white/60"
              whileHover={{ x: 4 }}
            >
              <span>•</span>
              <span className="line-clamp-1">{instruction}</span>
            </motion.div>
          ))}
          {procedure.instructions.length > 2 && (
            <div className="text-white/40 text-xs">
              +{procedure.instructions.length - 2} еще...
            </div>
          )}
        </motion.div>
      </BentoCard>
    </motion.div>
  );
};

// Улучшенный компонент для лекарств
const MedicationCard = ({ medication, onClick, index }: { medication: Medication; onClick?: () => void; index: number }) => {
  const statusColor = getStatusColor(medication.status);
  const statusText = {
    active: 'Активен',
    completed: 'Завершен',
    cancelled: 'Отменен'
  }[medication.status];
  const isMobile = useMobileDetection();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <BentoCard className="p-4 cursor-pointer" glowColor={statusColor} onClick={onClick}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm sm:text-base mb-1 line-clamp-1">{medication.name}</h3>
            <div className="text-white/60 text-xs mb-2">{medication.dosage} • {medication.frequency}</div>
            <div className="flex items-center gap-3 text-xs text-white/60 flex-wrap">
              <span className="flex items-center gap-1">📅 {medication.duration}</span>
              <span className="flex items-center gap-1">👨‍⚕️ {medication.doctor}</span>
            </div>
          </div>
          <motion.div 
            className="text-right ml-2"
            whileHover={{ scale: 1.05 }}
          >
            <span 
              className="px-2 py-1 rounded-full text-xs border backdrop-blur-sm"
              style={{
                backgroundColor: `rgba(${statusColor}, 0.2)`,
                color: `rgb(${statusColor})`,
                borderColor: `rgba(${statusColor}, 0.3)`
              }}
            >
              {statusText}
            </span>
          </motion.div>
        </div>

        <motion.div 
          className="text-white/60 text-xs mb-3 line-clamp-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
        >
          {medication.instructions}
        </motion.div>

        <motion.div 
          className="flex justify-between items-center text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          <div className="text-white/60">
            {medication.startDate} - {medication.endDate}
          </div>
          {medication.reminders && (
            <motion.div 
              className="text-green-400 flex items-center gap-1"
              whileHover={{ scale: 1.1 }}
            >
              <span>🔔</span>
              <span className="hidden sm:inline">Напоминания</span>
            </motion.div>
          )}
        </motion.div>
      </BentoCard>
    </motion.div>
  );
};

// Улучшенный компонент для врачей
const DoctorCard = ({ doctor, onBookAppointment, onViewDetails, index }: { 
  doctor: Doctor; 
  onBookAppointment: (doctor: Doctor) => void;
  onViewDetails: (doctor: Doctor) => void;
  index: number;
}) => {
  const isMobile = useMobileDetection();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <BentoCard className="p-4" glowColor={COLORS.blue}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm sm:text-base mb-1 line-clamp-1">{doctor.name}</h3>
            <div className="text-white/60 text-xs mb-2 line-clamp-1">{doctor.specialty}</div>
            <div className="flex items-center gap-3 text-xs text-white/60 flex-wrap">
              <span className="flex items-center gap-1">⭐ {doctor.rating}</span>
              <span className="flex items-center gap-1">📅 {doctor.experience}</span>
              <span className="text-green-400 flex items-center gap-1">{doctor.price}</span>
            </div>
          </div>
          <div className="text-right ml-2">
            <div className="text-white/60 text-xs line-clamp-1">{doctor.hospital}</div>
            <div className="text-white/40 text-xs mt-1">
              {doctor.availableSlots.length} слотов
            </div>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-3 gap-2 text-center mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
        >
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-white font-bold text-sm">{doctor.details.patients}</div>
            <div className="text-white/60 text-xs">Пациентов</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-white font-bold text-sm">{doctor.details.successRate}</div>
            <div className="text-white/60 text-xs">Успешность</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-white font-bold text-sm">{doctor.details.reviews}</div>
            <div className="text-white/60 text-xs">Отзывов</div>
          </div>
        </motion.div>

        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          <motion.button
            onClick={() => onBookAppointment(doctor)}
            className="flex-1 text-xs py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 text-white transition-all font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Записаться
          </motion.button>
          <motion.button 
            onClick={() => onViewDetails(doctor)}
            className="px-3 py-2 text-xs rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            👁️
          </motion.button>
        </motion.div>
      </BentoCard>
    </motion.div>
  );
};

// Улучшенный компонент для медицинской информации
const MedicalInfoCard = ({ info, onClick, index }: { info: MedicalInfo; onClick?: () => void; index: number }) => {
  const isMobile = useMobileDetection();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <BentoCard className="p-4 cursor-pointer" glowColor={info.color} onClick={onClick}>
        <div className="flex items-center justify-between mb-3">
          <motion.div 
            className="text-2xl"
            whileHover={{ scale: 1.2, rotate: 5 }}
          >
            {info.icon}
          </motion.div>
          <motion.div 
            className="text-white font-bold text-lg sm:text-xl"
            whileHover={{ scale: 1.1 }}
          >
            {info.items}
          </motion.div>
        </div>
        
        <h3 className="text-white font-semibold text-sm sm:text-base mb-2 line-clamp-1">{info.type}</h3>
        
        <motion.div 
          className="text-white/60 text-sm mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
        >
          Обновлено: {info.lastUpdate}
        </motion.div>
        
        <motion.div 
          className="space-y-2 text-xs text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          <div className="flex justify-between">
            <span>Последнее:</span>
            <span className="text-white text-xs line-clamp-1">{info.details.lastVisit || info.details.lastTest || info.details.lastPrescription}</span>
          </div>
          <div className="flex justify-between">
            <span>Следующее:</span>
            <span className="text-white text-xs line-clamp-1">{info.details.nextVisit || info.details.nextTest}</span>
          </div>
          <div className="flex justify-between">
            <span>Врач:</span>
            <span className="text-white text-xs line-clamp-1">{info.details.doctor}</span>
          </div>
        </motion.div>
      </BentoCard>
    </motion.div>
  );
};

// Улучшенный Calendar Component
const Calendar = ({ onDateSelect, selectedDate }: { onDateSelect: (date: Date) => void; selectedDate?: Date }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const isMobile = useMobileDetection();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
  const isSelected = (date: Date) => {
    return selectedDate && 
           date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const today = isToday(date);
      const selected = isSelected(date);
      
      days.push(
        <motion.button
          key={day}
          className={`h-8 w-8 rounded-full text-sm font-medium transition-all ${
            today ? 'bg-blue-500 text-white shadow-lg' : 
            selected ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-md' :
            'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDateSelect(date)}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {day}
        </motion.button>
      );
    }
    
    return days;
  };
  
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <BentoCard className="p-4" glowColor={COLORS.blue}>
      <div className="flex items-center justify-between mb-4">
        <motion.button
          onClick={prevMonth}
          className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10"
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          ←
        </motion.button>
        <motion.h3 
          className="text-white font-semibold text-sm sm:text-base"
          key={currentDate.getMonth()}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
        </motion.h3>
        <motion.button
          onClick={nextMonth}
          className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10"
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.9 }}
        >
          →
        </motion.button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-white/60 text-xs mb-2">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
          <div key={day} className="h-6 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>
      
      <motion.div 
        className="grid grid-cols-7 gap-1"
        key={currentDate.getMonth()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {renderCalendar()}
      </motion.div>
    </BentoCard>
  );
};

// Компонент для рейтинга звездами
const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <motion.span
          key={index}
          className={`text-sm ${
            index < fullStars ? 'text-yellow-400' : 
            index === fullStars && hasHalfStar ? 'text-yellow-400' : 'text-gray-500'
          }`}
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {index < fullStars ? '★' : 
           index === fullStars && hasHalfStar ? '★' : '☆'}
        </motion.span>
      ))}
      <span className="text-white/60 text-sm ml-1">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

// Данные для KPI
const medicalKPIs: KPI[] = [
  { 
    label: "Запись к врачу", 
    value: 3, 
    change: 1, 
    trend: 'up', 
    description: "активных записей", 
    icon: "📅", 
    color: COLORS.blue,
    details: "2 ближайшие на этой неделе"
  },
  { 
    label: "Анализы", 
    value: 12, 
    change: 2, 
    trend: 'up', 
    description: "результатов готово", 
    icon: "💉", 
    color: COLORS.purple,
    details: "3 новых за неделю"
  },
  { 
    label: "Процедуры", 
    value: 5, 
    trend: 'stable', 
    description: "запланировано", 
    icon: "🩺", 
    color: COLORS.emerald,
    details: "2 активные, 3 завершённые"
  },
  { 
    label: "Рецепты", 
    value: 3, 
    trend: 'down', 
    description: "действующих", 
    icon: "💊", 
    color: COLORS.orange,
    details: "1 истекает через 5 дней"
  }
];

// Данные для уведомлений
const medicalAlerts: Alert[] = [
  { 
    id: '1', 
    type: 'info', 
    title: 'Напоминание о приеме', 
    message: 'Завтра в 10:00 прием у терапевта Сидоровой М.П.', 
    time: '2 часа назад', 
    priority: 'high',
    action: 'Подробнее',
    read: false,
    category: 'appointment'
  },
  { 
    id: '2', 
    type: 'success', 
    title: 'Анализы готовы', 
    message: 'Результаты общего анализа крови доступны для просмотра', 
    time: '5 часов назад', 
    priority: 'medium',
    action: 'Посмотреть',
    read: false,
    category: 'test'
  },
  { 
    id: '3', 
    type: 'warning', 
    title: 'Требуется повторный прием', 
    message: 'Врач рекомендует повторный прием через 2 недели', 
    time: '1 день назад', 
    priority: 'medium',
    action: 'Записаться',
    read: true,
    category: 'appointment'
  },
  { 
    id: '4', 
    type: 'error', 
    title: 'Отмена процедуры', 
    message: 'Физиотерапия на завтра перенесена на следующую неделю', 
    time: '30 мин назад', 
    priority: 'high',
    action: 'Перенести',
    read: false,
    category: 'system'
  },
];

// Данные для показателей здоровья
const healthMetrics: HealthMetric[] = [
  {
    id: '1',
    label: "Артериальное давление",
    value: "120/80",
    normalRange: "110-130/70-85",
    status: "excellent",
    trend: "stable",
    lastUpdate: "сегодня, 08:30",
    details: "Утреннее измерение, состояние стабильное",
    unit: "мм рт. ст.",
    history: [
      { date: "10.12", value: "118/78" },
      { date: "09.12", value: "122/82" },
      { date: "08.12", value: "119/79" }
    ],
    recommendations: [
      "Продолжайте регулярные измерения",
      "Соблюдайте рекомендованную диету"
    ]
  },
  {
    id: '2',
    label: "Пульс",
    value: "72 уд/мин",
    normalRange: "60-100 уд/мин",
    status: "good",
    trend: "down",
    lastUpdate: "сегодня, 08:30",
    details: "Нормальный ритм, без нарушений",
    unit: "уд/мин",
    history: [
      { date: "10.12", value: "75" },
      { date: "09.12", value: "78" },
      { date: "08.12", value: "74" }
    ]
  },
  {
    id: '3',
    label: "Температура",
    value: "36.6°C",
    normalRange: "36.0-37.0°C",
    status: "excellent",
    trend: "stable",
    lastUpdate: "вчера, 19:45",
    details: "В пределах нормы",
    unit: "°C"
  },
  {
    id: '4',
    label: "Глюкоза крови",
    value: "5.2 ммоль/л",
    normalRange: "4.0-6.0 ммоль/л",
    status: "good",
    trend: "down",
    lastUpdate: "3 дня назад",
    details: "Натощак, показатели в норме",
    unit: "ммоль/л"
  },
  {
    id: '5',
    label: "Холестерин",
    value: "4.8 ммоль/л",
    normalRange: "до 5.2 ммоль/л",
    status: "warning",
    trend: "up",
    lastUpdate: "неделю назад",
    details: "Верхняя граница нормы, рекомендуется контроль",
    unit: "ммоль/л",
    recommendations: [
      "Снизить потребление жирной пищи",
      "Увеличить физическую активность",
      "Повторить анализ через 2 недели"
    ]
  },
  {
    id: '6',
    label: "Вес",
    value: "78 кг",
    normalRange: "70-85 кг",
    status: "good",
    trend: "down",
    lastUpdate: "сегодня, 08:00",
    details: "Снижение на 2 кг за месяц",
    unit: "кг",
    history: [
      { date: "01.12", value: "80" },
      { date: "15.11", value: "81" },
      { date: "01.11", value: "82" }
    ]
  }
];

// Данные для процедур
const proceduresData: Procedure[] = [
  {
    id: '1',
    name: "Физиотерапия",
    category: "Реабилитация",
    duration: "45 минут",
    frequency: "2 раза в неделю",
    status: "scheduled",
    nextSession: "завтра, 10:00",
    doctor: "Сидорова М.П.",
    description: "Лечебные процедуры для восстановления после травмы",
    instructions: [
      "Приходить за 15 минут до начала",
      "Иметь сменную обувь",
      "Не наносить кремы на кожу"
    ],
    progress: 75,
    location: "Кабинет физиотерапии, 3 этаж",
    cost: "бесплатно",
    requirements: ["Направление врача", "Результаты обследования"]
  },
  {
    id: '2',
    name: "Массаж лечебный",
    category: "Реабилитация",
    duration: "30 минут",
    frequency: "3 раза в неделю",
    status: "scheduled",
    nextSession: "сегодня, 14:30",
    doctor: "Петров И.В.",
    description: "Профессиональный массаж для снятия мышечного напряжения",
    instructions: [
      "Не принимать пищу за 2 часа до процедуры",
      "Сообщить о болевых ощущениях"
    ],
    progress: 60,
    location: "Кабинет массажа, 2 этаж",
    cost: "бесплатно"
  },
  {
    id: '3',
    name: "Инъекции витаминов",
    category: "Лечение",
    duration: "15 минут",
    frequency: "ежедневно",
    status: "completed",
    doctor: "Медсестра Иванова",
    description: "Курс витаминных инъекций для укрепления иммунитета",
    instructions: [
      "После процедуры оставаться под наблюдением 15 минут"
    ],
    progress: 100,
    location: "Процедурный кабинет, 1 этаж"
  },
  {
    id: '4',
    name: "Капельницы",
    category: "Лечение",
    duration: "60 минут",
    frequency: "через день",
    status: "pending",
    nextSession: "15.12.2024",
    doctor: "Сидорова М.П.",
    description: "Внутривенное введение лекарственных растворов",
    instructions: [
      "Приходить натощак",
      "Иметь при себе результаты анализов"
    ],
    location: "Процедурный кабинет, 1 этаж",
    requirements: ["Анализ крови", "Направление терапевта"]
  },
  {
    id: '5',
    name: "Электрофорез",
    category: "Физиотерапия",
    duration: "30 минут",
    frequency: "1 раз в неделю",
    status: "scheduled",
    nextSession: "пятница, 11:00",
    doctor: "Петров И.В.",
    description: "Введение лекарств через кожу с помощью электрического тока",
    instructions: [
      "Не наносить кремы на кожу перед процедурой"
    ],
    progress: 40,
    location: "Кабинет физиотерапии, 3 этаж"
  }
];

// Данные для лекарств
const medicationsData: Medication[] = [
  {
    id: '1',
    name: "Аспирин Кардио",
    dosage: "100 мг",
    frequency: "1 раз в день",
    duration: "постоянно",
    status: "active",
    startDate: "01.01.2024",
    endDate: "не ограничен",
    instructions: "Принимать утром после еды",
    doctor: "Сидорова М.П.",
    reminders: true
  },
  {
    id: '2',
    name: "Аторвастатин",
    dosage: "20 мг",
    frequency: "1 раз в день",
    duration: "3 месяца",
    status: "active",
    startDate: "15.11.2024",
    endDate: "15.02.2025",
    instructions: "Вечером перед сном",
    doctor: "Петров И.В.",
    reminders: true
  },
  {
    id: '3',
    name: "Витамин D",
    dosage: "2000 МЕ",
    frequency: "1 раз в день",
    duration: "2 месяца",
    status: "completed",
    startDate: "01.10.2024",
    endDate: "01.12.2024",
    instructions: "Во время завтрака",
    doctor: "Сидорова М.П.",
    reminders: false
  }
];

// Данные для врачей
const doctorsData: Doctor[] = [
  {
    id: 1,
    name: "Сидорова Мария Петровна",
    specialty: "Терапевт",
    rating: 4.8,
    experience: "12 лет",
    price: "бесплатно",
    availableSlots: ["09:00", "10:30", "14:00", "15:30", "16:45"],
    hospital: "Городская больница №1",
    education: "Московский государственный медицинский университет",
    specialization: "Общая терапия, профилактическая медицина",
    languages: ["Русский", "Английский"],
    details: {
      patients: "1500+",
      successRate: "95%",
      reviews: 234
    },
    schedule: {
      monday: ["09:00-13:00", "14:00-18:00"],
      tuesday: ["09:00-13:00", "14:00-18:00"],
      wednesday: ["09:00-13:00"],
      thursday: ["09:00-13:00", "14:00-18:00"],
      friday: ["09:00-13:00"],
      saturday: ["10:00-14:00"],
      sunday: "выходной"
    },
    bio: "Специалист высшей категории с большим опытом работы. Основные направления: лечение ОРВИ, хронических заболеваний, профилактические осмотры."
  },
  {
    id: 2,
    name: "Петров Иван Владимирович",
    specialty: "Кардиолог",
    rating: 4.9,
    experience: "15 лет",
    price: "бесплатно",
    availableSlots: ["10:00", "11:30", "16:00", "17:30"],
    hospital: "Кардиологический центр",
    education: "Первый Московский государственный медицинский университет",
    specialization: "Кардиология, артериальная гипертензия",
    languages: ["Русский", "Немецкий"],
    details: {
      patients: "2000+",
      successRate: "97%",
      reviews: 189
    },
    schedule: {
      monday: ["10:00-14:00"],
      tuesday: ["10:00-14:00", "15:00-19:00"],
      wednesday: ["10:00-14:00"],
      thursday: ["10:00-14:00", "15:00-19:00"],
      friday: ["10:00-14:00"],
      saturday: "выходной",
      sunday: "выходной"
    },
    bio: "Ведущий кардиолог центра, специалист по лечению артериальной гипертензии и ишемической болезни сердца."
  },
  {
    id: 3,
    name: "Козлов Дмитрий Сергеевич",
    specialty: "Офтальмолог",
    rating: 4.8,
    experience: "8 лет",
    price: "бесплатно",
    availableSlots: ["08:00", "09:00", "13:00", "15:00", "16:15"],
    hospital: "Городская больница №1",
    education: "Санкт-Петербургский государственный медицинский университет",
    specialization: "Офтальмология, катаракта, глаукома",
    languages: ["Русский", "Английский"],
    details: {
      patients: "900+",
      successRate: "96%",
      reviews: 134
    },
    schedule: {
      monday: ["08:00-12:00", "13:00-17:00"],
      tuesday: ["08:00-12:00"],
      wednesday: ["08:00-12:00", "13:00-17:00"],
      thursday: ["08:00-12:00"],
      friday: ["08:00-12:00", "13:00-17:00"],
      saturday: "выходной",
      sunday: "выходной"
    },
    bio: "Специалист по диагностике и лечению заболеваний глаз. Проводит комплексные обследования зрения."
  }
];

// Данные для медицинской информации
const medicalInfoData: MedicalInfo[] = [
  {
    id: 1,
    type: "История болезней",
    icon: "📋",
    items: 15,
    lastUpdate: "2 дня назад",
    color: COLORS.blue,
    details: {
      lastVisit: "10.12.2024",
      nextVisit: "20.01.2025",
      doctor: "Сидорова М.П.",
      diagnosis: "ОРВИ, гипертония",
      status: "активна"
    }
  },
  {
    id: 2,
    type: "Рецепты",
    icon: "💊",
    items: 8,
    lastUpdate: "неделю назад",
    color: COLORS.emerald,
    details: {
      lastPrescription: "Антибиотики",
      validUntil: "25.12.2024",
      pharmacy: "Аптека №1",
      status: "активен"
    }
  },
  {
    id: 3,
    type: "Результаты анализов",
    icon: "🔬",
    items: 24,
    lastUpdate: "вчера",
    color: COLORS.purple,
    details: {
      lastTest: "Общий анализ крови",
      results: "в пределах нормы",
      nextTest: "15.01.2025",
      doctor: "Петров И.В."
    }
  },
  {
    id: 4,
    type: "Выписки",
    icon: "🏥",
    items: 6,
    lastUpdate: "2 недели назад",
    color: COLORS.orange,
    details: {
      lastDischarge: "Стационарное лечение",
      period: "5 дней",
      diagnosis: "Пневмония",
      status: "выздоровление"
    }
  }
];

// Основной компонент медицинской страницы
export default function MedicalServicesPage() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [alerts, setAlerts] = useState<Alert[]>(medicalAlerts);
  const isMobile = useMobileDetection();
  
  // Состояния для модальных окон
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isProcedureModalOpen, setIsProcedureModalOpen] = useState(false);
  const [isHealthMetricModalOpen, setIsHealthMetricModalOpen] = useState(false);
  const [isMedicalInfoModalOpen, setIsMedicalInfoModalOpen] = useState(false);
  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  // Состояния для записи
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [selectedHealthMetric, setSelectedHealthMetric] = useState<HealthMetric | null>(null);
  const [selectedMedicalInfo, setSelectedMedicalInfo] = useState<MedicalInfo | null>(null);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState<Date | null>(null);
  const [selectedAppointmentTime, setSelectedAppointmentTime] = useState<string | null>(null);
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(formatTime(now));
      setCurrentDate(formatDate(now));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // Обработчики для модальных окон
  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsBookingModalOpen(true);
  };

  const handleViewDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDoctorModalOpen(true);
  };

  const handleViewProcedure = (procedure: Procedure) => {
    setSelectedProcedure(procedure);
    setIsProcedureModalOpen(true);
  };

  const handleViewHealthMetric = (metric: HealthMetric) => {
    setSelectedHealthMetric(metric);
    setIsHealthMetricModalOpen(true);
  };

  const handleViewMedicalInfo = (info: MedicalInfo) => {
    setSelectedMedicalInfo(info);
    setIsMedicalInfoModalOpen(true);
  };

  const handleViewMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsMedicationModalOpen(true);
  };

  const handleMarkAlertAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const handleConfirmAppointment = () => {
    if (selectedDoctor && selectedAppointmentDate && selectedAppointmentTime) {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        doctorId: selectedDoctor.id,
        date: selectedAppointmentDate,
        time: selectedAppointmentTime,
        type: 'consultation',
        status: 'confirmed',
        notes: appointmentNotes,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        duration: '30 минут'
      };
      
      setAppointments(prev => [...prev, newAppointment]);
      setIsBookingModalOpen(false);
      setIsSuccessModalOpen(true);
      
      // Сброс выбора
      setSelectedDoctor(null);
      setSelectedAppointmentDate(null);
      setSelectedAppointmentTime(null);
      setAppointmentNotes('');
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedAppointmentDate(date);
  };

  const unreadAlertsCount = alerts.filter(alert => !alert.read).length;

  const tabConfig = [
    { id: 'overview', name: 'Обзор здоровья', color: 'blue', icon: '📊' },
    { id: 'schedule', name: 'Расписание', color: 'emerald', icon: '📅' },
    { id: 'procedures', name: 'Процедуры', color: 'purple', icon: '🩺' },
    { id: 'medications', name: 'Лекарства', color: 'orange', icon: '💊' },
    { id: 'info', name: 'Медкарта', color: 'cyan', icon: '📋' }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>
      <style jsx global>{`
        @media (max-width: 768px) {
          .mobile-optimized {
            padding: 1rem;
          }
          .mobile-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 mobile-optimized">
        {/* Welcome Section */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BentoCard className="p-4 sm:p-6 md:p-8" variant="wide" glowColor={COLORS.blue}>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <motion.h1 
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  🏥 Медицинские услуги
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-sm sm:text-base md:text-lg mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Ваше здоровье под контролем. Доступ к медицинским услугам, историям болезней и результатам анализов.
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>Прикреплен к поликлинике №15</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Терапевт: Сидорова М.П.</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>Медкарта: полный доступ</span>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="text-center mt-4 sm:mt-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: isMobile ? 1 : 1.05 }}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl mb-3 shadow-lg">
                  👤
                </div>
                <div className="text-white font-bold text-lg sm:text-xl">Алексей Петров</div>
                <div className="text-white/60 text-sm">35 лет • Полис ОМС: 123456789012</div>
              </motion.div>
            </div>
          </BentoCard>
        </motion.section>

        {/* Navigation Tabs */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-wrap gap-2">
            {tabConfig.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? `bg-${tab.color}-500 text-white shadow-lg` 
                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="text-base sm:text-lg">{tab.icon}</span>
                <span className="text-xs sm:text-sm">{isMobile ? tab.name.split(' ')[0] : tab.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Alerts Section */}
        {unreadAlertsCount > 0 && (
          <motion.section 
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white">Уведомления</h2>
              <motion.span 
                className="bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                whileHover={{ scale: 1.1 }}
              >
                {unreadAlertsCount} новых
              </motion.span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {alerts.filter(alert => !alert.read).map((alert, index) => (
                <AlertWidget 
                  key={alert.id} 
                  alert={alert} 
                  onMarkAsRead={handleMarkAlertAsRead}
                  index={index}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* KPI Section */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Медицинская активность</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {medicalKPIs.map((kpi, index) => (
              <KPIWidget key={kpi.label} kpi={kpi} index={index} />
            ))}
          </div>
        </motion.section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Обзор здоровья */}
          {activeTab === 'overview' && (
            <>
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2"
              >
                <BentoCard className="p-4 sm:p-6" variant="wide" glowColor={COLORS.blue}>
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">📊</span>
                    <span>Показатели здоровья</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {healthMetrics.map((metric, index) => (
                      <HealthMetricCard 
                        key={metric.id} 
                        metric={metric} 
                        onClick={() => handleViewHealthMetric(metric)}
                        index={index}
                      />
                    ))}
                  </div>
                </BentoCard>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <BentoCard className="p-4 sm:p-6 h-full" glowColor={COLORS.purple}>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="text-lg sm:text-xl">📈</span>
                    <span>Динамика здоровья</span>
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="text-center p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-white font-bold text-2xl sm:text-3xl mb-2">4.8/5</div>
                      <div className="text-white/60 text-sm">Общий индекс здоровья</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-green-400 font-bold text-base sm:text-lg">12</div>
                        <div className="text-white/60 text-xs">В норме</div>
                      </div>
                      <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-orange-400 font-bold text-base sm:text-lg">1</div>
                        <div className="text-white/60 text-xs">Требует внимания</div>
                      </div>
                    </div>
                    <div className="p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-white font-medium text-sm mb-2">Рекомендации</div>
                      <div className="space-y-1 sm:space-y-2 text-xs text-white/60">
                        <div className="flex items-center gap-2">
                          <span>•</span>
                          <span>Контроль холестерина через 2 недели</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>•</span>
                          <span>Продолжать текущую программу упражнений</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>•</span>
                          <span>Плановый осмотр у терапевта через месяц</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </BentoCard>
              </motion.section>
            </>
          )}

          {/* Расписание */}
          {activeTab === 'schedule' && (
            <>
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2"
              >
                <BentoCard className="p-4 sm:p-6" variant="wide" glowColor={COLORS.emerald}>
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">👨‍⚕️</span>
                    <span>Врачи и запись</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {doctorsData.map((doctor, index) => (
                      <DoctorCard 
                        key={doctor.id} 
                        doctor={doctor} 
                        onBookAppointment={handleBookAppointment}
                        onViewDetails={handleViewDoctor}
                        index={index}
                      />
                    ))}
                  </div>
                </BentoCard>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Calendar 
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedAppointmentDate}
                />
                
                {/* Предстоящие записи */}
                <BentoCard className="p-4 mt-4" glowColor={COLORS.blue}>
                  <h3 className="text-white font-semibold mb-3">Ближайшие приемы</h3>
                  {appointments.length > 0 ? (
                    <div className="space-y-2">
                      {appointments.slice(0, 3).map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                          <div>
                            <div className="text-white text-sm font-medium">{appointment.doctorName}</div>
                            <div className="text-white/60 text-xs">{appointment.date.toLocaleDateString()} в {appointment.time}</div>
                          </div>
                          <span className="text-green-400 text-xs">✓</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-white/60 text-sm text-center py-4">
                      Нет предстоящих приемов
                    </div>
                  )}
                </BentoCard>
              </motion.section>
            </>
          )}

          {/* Процедуры */}
          {activeTab === 'procedures' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-3"
            >
              <BentoCard className="p-4 sm:p-6" variant="wide" glowColor={COLORS.purple}>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">🩺</span>
                  <span>Медицинские процедуры</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {proceduresData.map((procedure, index) => (
                    <ProcedureCard 
                      key={procedure.id} 
                      procedure={procedure} 
                      onClick={() => handleViewProcedure(procedure)}
                      index={index}
                    />
                  ))}
                </div>
              </BentoCard>
            </motion.section>
          )}

          {/* Лекарства */}
          {activeTab === 'medications' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-3"
            >
              <BentoCard className="p-4 sm:p-6" variant="wide" glowColor={COLORS.orange}>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">💊</span>
                  <span>Лекарства и рецепты</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {medicationsData.map((medication, index) => (
                    <MedicationCard 
                      key={medication.id} 
                      medication={medication} 
                      onClick={() => handleViewMedication(medication)}
                      index={index}
                    />
                  ))}
                </div>
              </BentoCard>
            </motion.section>
          )}

          {/* Медкарта */}
          {activeTab === 'info' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-3"
            >
              <BentoCard className="p-4 sm:p-6" variant="wide" glowColor={COLORS.cyan}>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">📋</span>
                  <span>Медицинская карта</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {medicalInfoData.map((info, index) => (
                    <MedicalInfoCard 
                      key={info.id} 
                      info={info} 
                      onClick={() => handleViewMedicalInfo(info)}
                      index={index}
                    />
                  ))}
                </div>
              </BentoCard>
            </motion.section>
          )}
        </div>
      </main>

      {/* Модальное окно записи на прием */}
      <Modal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        title="📅 Запись на прием"
        size="lg"
      >
        {selectedDoctor && (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex-1">
                <h4 className="text-white font-bold text-lg">{selectedDoctor.name}</h4>
                <p className="text-white/60">{selectedDoctor.specialty}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                  <span>⭐ {selectedDoctor.rating}</span>
                  <span>📅 {selectedDoctor.experience}</span>
                  <span className="text-green-400">{selectedDoctor.price}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/60 text-sm">{selectedDoctor.hospital}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h5 className="text-white font-semibold mb-3">Выбор даты</h5>
                <Calendar 
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedAppointmentDate}
                />
              </div>

              <div>
                <h5 className="text-white font-semibold mb-3">Выбор времени</h5>
                <div className="grid grid-cols-3 gap-2">
                  {selectedDoctor.availableSlots.map((slot: string, index: number) => (
                    <motion.button
                      key={index}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedAppointmentTime === slot 
                          ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedAppointmentTime(slot)}
                    >
                      {slot}
                    </motion.button>
                  ))}
                </div>

                <div className="mt-4">
                  <h5 className="text-white font-semibold mb-2">Примечание</h5>
                  <textarea
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                    placeholder="Опишите причину визита или симптомы..."
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmAppointment}
                disabled={!selectedAppointmentDate || !selectedAppointmentTime}
                className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white transition-colors font-semibold"
              >
                Подтвердить запись
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно успешной записи */}
      <Modal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)}
        title="✅ Запись подтверждена!"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-white font-bold text-xl mb-2">Запись успешно создана!</h3>
          <p className="text-white/60 mb-6">
            Вы записаны на прием к врачу. На вашу почту отправлено подтверждение.
          </p>
          <button
            onClick={() => setIsSuccessModalOpen(false)}
            className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold"
          >
            Понятно
          </button>
        </div>
      </Modal>

      {/* Модальное окно информации о враче */}
      <Modal 
        isOpen={isDoctorModalOpen} 
        onClose={() => setIsDoctorModalOpen(false)}
        title="👨‍⚕️ Информация о враче"
        size="md"
      >
        {selectedDoctor && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-white font-bold text-xl">{selectedDoctor.name}</h3>
                <p className="text-white/60 text-lg">{selectedDoctor.specialty}</p>
                <div className="flex items-center gap-4 mt-2">
                  <RatingStars rating={selectedDoctor.rating} />
                  <span className="text-white/60">Опыт: {selectedDoctor.experience}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold text-lg">{selectedDoctor.price}</div>
                <div className="text-white/60 text-sm">{selectedDoctor.hospital}</div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">О враче</h4>
              <p className="text-white/60 text-sm">{selectedDoctor.bio}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Образование</h4>
                <p className="text-white/60 text-sm">{selectedDoctor.education}</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Специализация</h4>
                <p className="text-white/60 text-sm">{selectedDoctor.specialization}</p>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">Языки</h4>
              <div className="flex gap-2">
                {selectedDoctor.languages.map((lang: string, index: number) => (
                  <span key={index} className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white font-bold text-lg">{selectedDoctor.details.patients}</div>
                <div className="text-white/60 text-sm">Пациентов</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white font-bold text-lg">{selectedDoctor.details.successRate}</div>
                <div className="text-white/60 text-sm">Успешность</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white font-bold text-lg">{selectedDoctor.details.reviews}</div>
                <div className="text-white/60 text-sm">Отзывов</div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setIsDoctorModalOpen(false);
                  handleBookAppointment(selectedDoctor);
                }}
                className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold"
              >
                Записаться на прием
              </button>
              <button
                onClick={() => setIsDoctorModalOpen(false)}
                className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно информации о процедуре */}
      <Modal 
        isOpen={isProcedureModalOpen} 
        onClose={() => setIsProcedureModalOpen(false)}
        title="🩺 Информация о процедуре"
        size="md"
      >
        {selectedProcedure && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-bold text-xl mb-2">{selectedProcedure.name}</h3>
                <p className="text-white/60">{selectedProcedure.description}</p>
              </div>
              <span 
                className="px-3 py-1 rounded-full text-sm border"
                style={{
                  backgroundColor: `rgba(${getStatusColor(selectedProcedure.status)}, 0.2)`,
                  color: `rgb(${getStatusColor(selectedProcedure.status)})`,
                  borderColor: `rgba(${getStatusColor(selectedProcedure.status)}, 0.3)`
                }}
              >
                {selectedProcedure.status === 'scheduled' ? 'Запланирована' : 
                 selectedProcedure.status === 'completed' ? 'Завершена' : 
                 selectedProcedure.status === 'pending' ? 'Ожидание' : 'Отменена'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Длительность</div>
                <div className="text-white font-semibold">{selectedProcedure.duration}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Частота</div>
                <div className="text-white font-semibold">{selectedProcedure.frequency}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Врач</div>
                <div className="text-white font-semibold">{selectedProcedure.doctor}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Категория</div>
                <div className="text-white font-semibold">{selectedProcedure.category}</div>
              </div>
            </div>

            {selectedProcedure.location && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="text-blue-400 font-semibold mb-1">Место проведения</div>
                <div className="text-white">{selectedProcedure.location}</div>
              </div>
            )}

            {selectedProcedure.nextSession && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="text-green-400 font-semibold mb-1">Следующая процедура</div>
                <div className="text-white">{selectedProcedure.nextSession}</div>
              </div>
            )}

            <div>
              <h4 className="text-white font-semibold mb-3">Инструкции</h4>
              <div className="space-y-2">
                {selectedProcedure.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-white text-sm">{instruction}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedProcedure.requirements && selectedProcedure.requirements.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-3">Требования</h4>
                <div className="space-y-2">
                  {selectedProcedure.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                      <span className="text-white text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedProcedure.progress && (
              <div>
                <h4 className="text-white font-semibold mb-2">Прогресс курса</h4>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${selectedProcedure.progress}%`,
                      backgroundColor: `rgb(${getStatusColor(selectedProcedure.status)})`
                    }}
                  />
                </div>
                <div className="flex justify-between text-white/60 text-sm mt-1">
                  <span>Начало</span>
                  <span>{selectedProcedure.progress}%</span>
                  <span>Завершение</span>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Модальное окно информации о лекарстве */}
      <Modal 
        isOpen={isMedicationModalOpen} 
        onClose={() => setIsMedicationModalOpen(false)}
        title="💊 Информация о лекарстве"
        size="md"
      >
        {selectedMedication && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-bold text-xl mb-2">{selectedMedication.name}</h3>
                <div className="text-white/60">{selectedMedication.dosage}</div>
              </div>
              <span 
                className="px-3 py-1 rounded-full text-sm border"
                style={{
                  backgroundColor: `rgba(${getStatusColor(selectedMedication.status)}, 0.2)`,
                  color: `rgb(${getStatusColor(selectedMedication.status)})`,
                  borderColor: `rgba(${getStatusColor(selectedMedication.status)}, 0.3)`
                }}
              >
                {selectedMedication.status === 'active' ? 'Активен' : 
                 selectedMedication.status === 'completed' ? 'Завершен' : 'Отменен'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Режим приема</div>
                <div className="text-white font-semibold">{selectedMedication.frequency}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Продолжительность</div>
                <div className="text-white font-semibold">{selectedMedication.duration}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Назначил</div>
                <div className="text-white font-semibold">{selectedMedication.doctor}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Период</div>
                <div className="text-white font-semibold text-sm">{selectedMedication.startDate} - {selectedMedication.endDate}</div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">Инструкции по применению</h4>
              <p className="text-white/60 text-sm bg-white/5 rounded-lg p-4">
                {selectedMedication.instructions}
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <div className="text-white font-semibold">Напоминания</div>
                <div className="text-white/60 text-sm">
                  {selectedMedication.reminders ? 'Включены' : 'Выключены'}
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 transition-colors">
                {selectedMedication.reminders ? 'Настроить' : 'Включить'}
              </button>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold">
                Обновить статус
              </button>
              <button
                onClick={() => setIsMedicationModalOpen(false)}
                className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно информации о показателе здоровья */}
      <Modal 
        isOpen={isHealthMetricModalOpen} 
        onClose={() => setIsHealthMetricModalOpen(false)}
        title="📊 Детали показателя здоровья"
        size="lg"
      >
        {selectedHealthMetric && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-bold text-xl mb-2">{selectedHealthMetric.label}</h3>
                <div className="text-2xl font-bold" style={{ color: `rgb(${getStatusColor(selectedHealthMetric.status)})` }}>
                  {selectedHealthMetric.value}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/60">Норма: {selectedHealthMetric.normalRange}</div>
                <div className="text-white/60 text-sm">Обновлено: {selectedHealthMetric.lastUpdate}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white font-bold text-lg">
                  {selectedHealthMetric.status === 'excellent' ? 'Отлично' : 
                   selectedHealthMetric.status === 'good' ? 'Хорошо' : 
                   selectedHealthMetric.status === 'warning' ? 'Внимание' : 'Критично'}
                </div>
                <div className="text-white/60 text-sm">Статус</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white font-bold text-lg">
                  {selectedHealthMetric.trend === 'up' ? '↗ Рост' : 
                   selectedHealthMetric.trend === 'down' ? '↘ Снижение' : '→ Стабильно'}
                </div>
                <div className="text-white/60 text-sm">Тренд</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white font-bold text-lg">{selectedHealthMetric.unit || '-'}</div>
                <div className="text-white/60 text-sm">Единица</div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Описание</h4>
              <p className="text-white/60 text-sm bg-white/5 rounded-lg p-4">
                {selectedHealthMetric.details}
              </p>
            </div>

            {selectedHealthMetric.history && selectedHealthMetric.history.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-3">История измерений</h4>
                <div className="space-y-2">
                  {selectedHealthMetric.history.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white text-sm">{record.date}</span>
                      <span className="text-white font-semibold">{record.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedHealthMetric.recommendations && selectedHealthMetric.recommendations.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-3">Рекомендации</h4>
                <div className="space-y-2">
                  {selectedHealthMetric.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="text-white text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold">
                Добавить измерение
              </button>
              <button
                onClick={() => setIsHealthMetricModalOpen(false)}
                className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}