'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  slate: '100, 116, 139'
} as const;

const DOCTOR_COLORS = {
  active: '34, 197, 94',
  inactive: '100, 116, 139',
  on_leave: '245, 158, 11',
  busy: '239, 68, 68',
  available: '59, 130, 246',
  therapist: '16, 185, 129',
  surgeon: '239, 68, 68',
  pediatrician: '59, 130, 246',
  cardiologist: '147, 51, 234',
  neurologist: '249, 115, 22',
  dentist: '34, 211, 238',
  ophthalmologist: '59, 130, 246',
  dermatologist: '147, 51, 234',
  high: '239, 68, 68',
  medium: '245, 158, 11',
  low: '34, 197, 94'
} as const;

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
  licenseNumber: string;
  licenseExpiry: string;
  profileImage?: string;
}

interface ProfessionalInfo {
  specialization: 'therapist' | 'surgeon' | 'pediatrician' | 'cardiologist' | 'neurologist' | 'dentist' | 'ophthalmologist' | 'dermatologist';
  department: string;
  position: string;
  qualifications: string[];
  languages: string[];
  status: 'active' | 'inactive' | 'on_leave' | 'busy' | 'available';
  hireDate: string;
  office: string;
  workingHours: {
    days: string[];
    hours: string;
  };
}

interface DoctorAppointment {
  id: string;
  patientName: string;
  patientAge: number;
  reason: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  room: string;
  notes?: string;
  doctorId?: string;
}

interface Performance {
  rating: number;
  patientsPerMonth: number;
  successRate: number;
  averageConsultationTime: number;
  lastEvaluation: string;
  notes?: string;
  monthlyGrowth: number;
}

interface Financial {
  salary: number;
  bonus: number;
  totalEarnings: number;
  taxInfo: string;
  lastSalaryReview: string;
}

interface Doctor {
  id: string;
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
  schedule: DoctorAppointment[];
  performance: Performance;
  financial: Financial;
}

// =============================================================================
// УТИЛИТЫ
// =============================================================================

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatTime = (timeString: string): string => {
  return timeString;
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

const getSpecializationIcon = (specialization: string): string => {
  const icons: { [key: string]: string } = {
    therapist: '👨‍⚕️',
    surgeon: '🔪',
    pediatrician: '👶',
    cardiologist: '❤️',
    neurologist: '🧠',
    dentist: '🦷',
    ophthalmologist: '👁️',
    dermatologist: '🔬'
  };
  return icons[specialization] || '🎯';
};

const getSpecializationLabel = (specialization: string): string => {
  const labels: { [key: string]: string } = {
    therapist: 'Терапевт',
    surgeon: 'Хирург',
    pediatrician: 'Педиатр',
    cardiologist: 'Кардиолог',
    neurologist: 'Невролог',
    dentist: 'Стоматолог',
    ophthalmologist: 'Офтальмолог',
    dermatologist: 'Дерматолог'
  };
  return labels[specialization] || specialization;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(amount);
};

const generateInitials = (fullName: string): string => {
  return fullName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
};

const getDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
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
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdrop?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'md',
  closeOnBackdrop = true 
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
    xl: 'max-w-6xl w-full mx-4'
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
        className={`bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50 rounded-3xl shadow-2xl ${sizeClasses[size]} max-h-[95vh] overflow-hidden`}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="border-b border-slate-700/50 p-6 bg-slate-800/20">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {title}
              </h2>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200 text-slate-400 hover:text-white active:scale-95"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Закрыть"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>
        )}
        <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-80px)] custom-scrollbar">
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
  disabled?: boolean;
}

const BentoCard: React.FC<BentoCardProps> = ({ 
  children, 
  className = '', 
  glowColor = COLORS.teal, 
  onClick,
  hoverable = true,
  padding = 'p-4 md:p-6',
  disabled = false
}) => (
  <motion.div
    className={`
      relative overflow-hidden 
      rounded-2xl md:rounded-3xl border border-slate-700/50
      bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-xl
      transition-all duration-500
      w-full max-w-full
      group
      ${hoverable && !disabled ? 'hover:border-slate-600/70 hover:shadow-2xl' : ''}
      ${onClick && !disabled ? 'cursor-pointer active:scale-[0.98]' : ''}
      ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
      ${padding}
      ${className}
    `}
    style={{
      backgroundImage: `
        radial-gradient(280px circle at 50% 50%, rgba(${glowColor},0.15), transparent 60%),
        linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)
      `
    }}
    whileHover={hoverable && !disabled ? { y: -2, scale: 1.01 } : {}}
    whileTap={onClick && !disabled ? { scale: 0.98 } : {}}
    onClick={disabled ? undefined : onClick}
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

    <div className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none overflow-hidden">
      <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:animate-shine" />
    </div>
  </motion.div>
);

interface StatusBadgeProps {
  status: string;
  type?: 'default' | 'client' | 'service' | 'booking' | 'provider';
  animated?: boolean;
  size?: 'small' | 'default';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  type = 'default', 
  animated = false, 
  size = 'default',
  className = ''
}) => {
  const getStatusConfig = () => {
    const configs: { [key: string]: { color: string; label: string; bg: string; border: string } } = {
      active: { color: COLORS.success, label: 'Активен', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      inactive: { color: COLORS.slate, label: 'Неактивен', bg: 'bg-slate-500/15', border: 'border-slate-500/30' },
      on_leave: { color: COLORS.orange, label: 'В отпуске', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      busy: { color: COLORS.error, label: 'Занят', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      available: { color: COLORS.blue, label: 'Доступен', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      scheduled: { color: COLORS.teal, label: 'Запланирован', bg: 'bg-teal-500/15', border: 'border-teal-500/30' },
      in_progress: { color: COLORS.blue, label: 'В процессе', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      completed: { color: COLORS.success, label: 'Завершен', bg: 'bg-green-500/15', border: 'border-green-500/30' },
      cancelled: { color: COLORS.error, label: 'Отменен', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      therapist: { color: DOCTOR_COLORS.therapist, label: 'Терапевт', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      surgeon: { color: DOCTOR_COLORS.surgeon, label: 'Хирург', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      pediatrician: { color: DOCTOR_COLORS.pediatrician, label: 'Педиатр', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      cardiologist: { color: DOCTOR_COLORS.cardiologist, label: 'Кардиолог', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
      neurologist: { color: DOCTOR_COLORS.neurologist, label: 'Невролог', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      dentist: { color: DOCTOR_COLORS.dentist, label: 'Стоматолог', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' },
      ophthalmologist: { color: COLORS.blue, label: 'Офтальмолог', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      dermatologist: { color: COLORS.purple, label: 'Дерматолог', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
      high: { color: DOCTOR_COLORS.high, label: 'Высокая', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      medium: { color: DOCTOR_COLORS.medium, label: 'Средняя', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      low: { color: DOCTOR_COLORS.low, label: 'Низкая', bg: 'bg-green-500/15', border: 'border-green-500/30' }
    };

    return configs[status] || { color: COLORS.slate, label: status, bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
  };

  const config = getStatusConfig();
  const paddingClass = size === 'small' ? 'px-2 py-1' : 'px-3 py-1.5';
  const textSizeClass = size === 'small' ? 'text-xs' : 'text-xs';

  return (
    <motion.span 
      className={`inline-flex items-center ${paddingClass} rounded-full font-medium border backdrop-blur-sm ${config.bg} ${config.border} ${textSizeClass} ${className}`}
      style={{ color: `rgb(${config.color})` }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {animated && (
        <motion.div 
          className="w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0"
          style={{ backgroundColor: `rgb(${config.color})` }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {!animated && (
        <div 
          className="w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0"
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
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max = 100, 
  color = COLORS.teal, 
  label, 
  showValue = true, 
  size = 'md',
  className = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between text-sm text-slate-300 mb-2">
          <span className="text-xs md:text-sm">{label}</span>
          {showValue && <span className="font-semibold text-xs md:text-sm">{percentage.toFixed(1)}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-700/50 rounded-full ${height} overflow-hidden`}>
        <motion.div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${height}`}
          initial={{ width: 0 }}
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
      <BentoCard className="p-4 md:p-6" padding="p-4 md:p-6">
        <div className="animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-slate-700 rounded-2xl"></div>
            <div className="w-16 h-6 bg-slate-700 rounded-full"></div>
          </div>
          <div className="h-8 bg-slate-700 rounded mb-2"></div>
          <div className="h-4 bg-slate-700 rounded"></div>
        </div>
      </BentoCard>
    );
  }
  
  return (
    <BentoCard 
      className="h-full" 
      glowColor={color} 
      onClick={onClick}
      padding="p-4 md:p-6"
    >
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <motion.div 
          className="text-2xl md:text-3xl p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-sm"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {icon}
        </motion.div>
        {trendConfig !== 'neutral' && (
          <motion.div 
            className={`text-xs md:text-sm font-semibold px-2 py-1 rounded-full backdrop-blur-sm ${
              trendConfig === 'up' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {trendConfig === 'up' ? '↗' : '↘'} {change !== undefined ? `${Math.abs(change)}%` : ''}
          </motion.div>
        )}
      </div>
      <motion.div 
        className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1"
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

// =============================================================================
// МОКИ ДАННЫХ
// =============================================================================

const doctors: Doctor[] = [
  {
    id: 'doc-001',
    personalInfo: {
      fullName: 'Петров Иван Сергеевич',
      birthDate: '1980-05-15',
      gender: 'male',
      phone: '+7 (916) 123-45-67',
      email: 'i.petrov@medical.ru',
      address: 'г. Москва, ул. Ленина, д. 25, кв. 12',
      education: 'Высшее медицинское, МГМУ им. Сеченова, ординатура по кардиологии',
      experience: 15,
      licenseNumber: 'MED-001234',
      licenseExpiry: '2025-12-31',
      profileImage: '/doctors/petrov.jpg'
    },
    professionalInfo: {
      specialization: 'cardiologist',
      department: 'Кардиология',
      position: 'Ведущий кардиолог',
      qualifications: ['Кардиология', 'Функциональная диагностика', 'Эхокардиография', 'УЗИ сердца', 'Холтеровское мониторирование'],
      languages: ['Русский', 'Английский', 'Немецкий'],
      status: 'active',
      hireDate: '2015-03-10',
      office: 'Кабинет 301',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
        hours: '09:00-17:00'
      }
    },
    schedule: [
      {
        id: 'app-001',
        patientName: 'Иванова Мария Петровна',
        patientAge: 65,
        reason: 'Контрольный осмотр после операции на сердце',
        date: '2024-06-25',
        time: '10:00',
        duration: 30,
        status: 'scheduled',
        priority: 'high',
        room: '301',
        notes: 'Пациент с гипертонией 3 степени. Требуется контроль давления и ЭКГ. Последняя операция - аортокоронарное шунтирование в 2023 году.',
        doctorId: 'doc-001'
      },
      {
        id: 'app-002',
        patientName: 'Сидоров Алексей Владимирович',
        patientAge: 52,
        reason: 'Ежегодный профилактический осмотр',
        date: '2024-06-25',
        time: '11:00',
        duration: 45,
        status: 'scheduled',
        priority: 'medium',
        room: '301',
        notes: 'Семейная история сердечно-сосудистых заболеваний. Отец перенес инфаркт в 55 лет. Требуется расширенная диагностика.',
        doctorId: 'doc-001'
      },
      {
        id: 'app-003',
        patientName: 'Козлова Анна Сергеевна',
        patientAge: 48,
        reason: 'Консультация по результатам холтеровского мониторирования',
        date: '2024-06-25',
        time: '14:00',
        duration: 40,
        status: 'scheduled',
        priority: 'high',
        room: '301',
        doctorId: 'doc-001'
      },
      {
        id: 'app-004',
        patientName: 'Громов Павел Николаевич',
        patientAge: 58,
        reason: 'Плановый осмотр при ишемической болезни сердца',
        date: '2024-06-25',
        time: '15:30',
        duration: 30,
        status: 'scheduled',
        priority: 'medium',
        room: '301',
        doctorId: 'doc-001'
      }
    ],
    performance: {
      rating: 4.9,
      patientsPerMonth: 120,
      successRate: 95,
      averageConsultationTime: 25,
      lastEvaluation: '2024-05-20',
      monthlyGrowth: 8.7,
      notes: 'Высококвалифицированный специалист с отличными результатами лечения. Пациенты отмечают внимательное отношение и профессиональный подход. Регулярно повышает квалификацию, участвует в международных конференциях. Отличные навыки диагностики сложных случаев.'
    },
    financial: {
      salary: 150000,
      bonus: 25000,
      totalEarnings: 175000,
      taxInfo: 'НДФЛ 13%',
      lastSalaryReview: '2024-01-15'
    }
  },
  {
    id: 'doc-002',
    personalInfo: {
      fullName: 'Смирнова Елена Викторовна',
      birthDate: '1985-08-22',
      gender: 'female',
      phone: '+7 (925) 234-56-78',
      email: 'e.smirnova@medical.ru',
      address: 'г. Москва, пр. Мира, д. 89, кв. 45',
      education: 'Высшее медицинское, РНИМУ им. Пирогова, ординатура по педиатрии',
      experience: 12,
      licenseNumber: 'MED-002345',
      licenseExpiry: '2024-11-30',
      profileImage: '/doctors/smirnova.jpg'
    },
    professionalInfo: {
      specialization: 'pediatrician',
      department: 'Педиатрия',
      position: 'Старший педиатр',
      qualifications: ['Педиатрия', 'Неонатология', 'Вакцинопрофилактика', 'Детская пульмонология', 'Аллергология'],
      languages: ['Русский', 'Французский', 'Английский'],
      status: 'active',
      hireDate: '2018-07-15',
      office: 'Кабинет 205',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
        hours: '08:00-16:00'
      }
    },
    schedule: [
      {
        id: 'app-005',
        patientName: 'Козлов Артем Дмитриевич',
        patientAge: 5,
        reason: 'Плановый профилактический осмотр перед школой',
        date: '2024-06-25',
        time: '09:00',
        duration: 20,
        status: 'scheduled',
        priority: 'medium',
        room: '205',
        notes: 'Ребенок здоров, развитие соответствует возрасту. Необходимо оформить медицинскую карту для школы.',
        doctorId: 'doc-002'
      },
      {
        id: 'app-006',
        patientName: 'Орлова София Максимовна',
        patientAge: 3,
        reason: 'Вакцинация по календарю прививок',
        date: '2024-06-25',
        time: '10:30',
        duration: 15,
        status: 'scheduled',
        priority: 'low',
        room: '205',
        notes: 'Родители проинформированы о возможных реакциях на вакцину. Предыдущие прививки перенесены хорошо.',
        doctorId: 'doc-002'
      },
      {
        id: 'app-007',
        patientName: 'Волков Денис Игоревич',
        patientAge: 7,
        reason: 'Острая респираторная инфекция',
        date: '2024-06-25',
        time: '11:30',
        duration: 25,
        status: 'scheduled',
        priority: 'high',
        room: '205',
        notes: 'Температура 38.5°C, кашель, насморк. Требуется осмотр и назначение лечения.',
        doctorId: 'doc-002'
      },
      {
        id: 'app-008',
        patientName: 'Никитина Алиса Романовна',
        patientAge: 2,
        reason: 'Плановый осмотр в 2 года',
        date: '2024-06-25',
        time: '13:00',
        duration: 30,
        status: 'scheduled',
        priority: 'medium',
        room: '205',
        doctorId: 'doc-002'
      }
    ],
    performance: {
      rating: 4.8,
      patientsPerMonth: 180,
      successRate: 98,
      averageConsultationTime: 18,
      lastEvaluation: '2024-04-15',
      monthlyGrowth: 12.3,
      notes: 'Отлично ладит с детьми любого возраста. Высокий профессионализм в диагностике и лечении детских заболеваний. Родители довольны подходом к маленьким пациентам. Активно внедряет современные методы лечения. Участвует в программах вакцинопрофилактики.'
    },
    financial: {
      salary: 120000,
      bonus: 20000,
      totalEarnings: 140000,
      taxInfo: 'НДФЛ 13%',
      lastSalaryReview: '2024-02-20'
    }
  },
  {
    id: 'doc-003',
    personalInfo: {
      fullName: 'Кузнецов Дмитрий Александрович',
      birthDate: '1978-12-03',
      gender: 'male',
      phone: '+7 (916) 345-67-89',
      email: 'd.kuznetsov@medical.ru',
      address: 'г. Москва, ул. Пушкина, д. 15, кв. 78',
      education: 'Высшее медицинское, МГМСУ им. Евдокимова, ординатура по хирургии',
      experience: 20,
      licenseNumber: 'MED-003456',
      licenseExpiry: '2026-03-15',
      profileImage: '/doctors/kuznetsov.jpg'
    },
    professionalInfo: {
      specialization: 'surgeon',
      department: 'Хирургия',
      position: 'Главный хирург',
      qualifications: ['Общая хирургия', 'Эндоскопическая хирургия', 'Травматология', 'Абдоминальная хирургия', 'Торакальная хирургия'],
      languages: ['Русский', 'Немецкий', 'Английский'],
      status: 'busy',
      hireDate: '2010-11-20',
      office: 'Операционный блок',
      workingHours: {
        days: ['Пн', 'Вт', 'Чт', 'Пт'],
        hours: '07:00-19:00'
      }
    },
    schedule: [
      {
        id: 'app-009',
        patientName: 'Громов Павел Николаевич',
        patientAge: 45,
        reason: 'Плановая операция - лапароскопическая аппендэктомия',
        date: '2024-06-25',
        time: '08:00',
        duration: 120,
        status: 'scheduled',
        priority: 'high',
        room: 'Операционная 1',
        notes: 'Пациент подготовлен, анализы в норме. Планируется лапароскопический доступ. Ассистент - врач Сидоров А.В.',
        doctorId: 'doc-003'
      },
      {
        id: 'app-010',
        patientName: 'Захарова Ольга Викторовна',
        patientAge: 38,
        reason: 'Послеоперационный осмотр после холецистэктомии',
        date: '2024-06-25',
        time: '13:00',
        duration: 20,
        status: 'scheduled',
        priority: 'medium',
        room: 'Кабинет 415',
        notes: 'Операция проведена 2 недели назад. Необходимо оценить заживление швов и общее состояние.',
        doctorId: 'doc-003'
      },
      {
        id: 'app-011',
        patientName: 'Белов Сергей Иванович',
        patientAge: 52,
        reason: 'Консультация по поводу грыжи пищеводного отверстия диафрагмы',
        date: '2024-06-25',
        time: '14:30',
        duration: 40,
        status: 'scheduled',
        priority: 'medium',
        room: 'Кабинет 415',
        doctorId: 'doc-003'
      }
    ],
    performance: {
      rating: 4.9,
      patientsPerMonth: 40,
      successRate: 99,
      averageConsultationTime: 35,
      lastEvaluation: '2024-03-10',
      monthlyGrowth: 5.2,
      notes: 'Выдающийся хирург с безупречной техникой. Сложные операции выполняет на высоком профессиональном уровне. Коллеги ценят за готовность помочь и поделиться опытом. Руководит отделением хирургии, курирует молодых специалистов. Автор нескольких научных работ по современным хирургическим методикам.'
    },
    financial: {
      salary: 200000,
      bonus: 50000,
      totalEarnings: 250000,
      taxInfo: 'НДФЛ 13%',
      lastSalaryReview: '2024-03-01'
    }
  },
  {
    id: 'doc-004',
    personalInfo: {
      fullName: 'Волкова Анна Михайловна',
      birthDate: '1990-03-18',
      gender: 'female',
      phone: '+7 (925) 456-78-90',
      email: 'a.volkova@medical.ru',
      address: 'г. Москва, ул. Гагарина, д. 67, кв. 34',
      education: 'Высшее медицинское, СПбГПМУ, ординатура по стоматологии',
      experience: 8,
      licenseNumber: 'MED-004567',
      licenseExpiry: '2025-06-30',
      profileImage: '/doctors/volkova.jpg'
    },
    professionalInfo: {
      specialization: 'dentist',
      department: 'Стоматология',
      position: 'Стоматолог-терапевт',
      qualifications: ['Терапевтическая стоматология', 'Эндодонтия', 'Эстетическая стоматология', 'Отбеливание', 'Протезирование'],
      languages: ['Русский', 'Английский', 'Испанский'],
      status: 'available',
      hireDate: '2020-09-01',
      office: 'Кабинет 102',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        hours: '10:00-19:00'
      }
    },
    schedule: [
      {
        id: 'app-012',
        patientName: 'Николаев Игорь Сергеевич',
        patientAge: 35,
        reason: 'Лечение множественного кариеса',
        date: '2024-06-25',
        time: '14:00',
        duration: 60,
        status: 'scheduled',
        priority: 'medium',
        room: '102',
        notes: 'Пациент записан на два посещения. Первое - диагностика и начало лечения. Второе - завершение лечения и полировка.',
        doctorId: 'doc-004'
      },
      {
        id: 'app-013',
        patientName: 'Федорова Марина Александровна',
        patientAge: 28,
        reason: 'Профессиональная гигиена и отбеливание',
        date: '2024-06-25',
        time: '16:00',
        duration: 90,
        status: 'scheduled',
        priority: 'low',
        room: '102',
        notes: 'Пациентка готовится к свадьбе. Запланирована комплексная чистка и система домашнего отбеливания.',
        doctorId: 'doc-004'
      },
      {
        id: 'app-014',
        patientName: 'Соколов Андрей Петрович',
        patientAge: 42,
        reason: 'Эндодонтическое лечение зуба 3.6',
        date: '2024-06-25',
        time: '17:30',
        duration: 75,
        status: 'scheduled',
        priority: 'high',
        room: '102',
        doctorId: 'doc-004'
      }
    ],
    performance: {
      rating: 4.7,
      patientsPerMonth: 90,
      successRate: 96,
      averageConsultationTime: 40,
      lastEvaluation: '2024-05-05',
      monthlyGrowth: 15.8,
      notes: 'Внимательный и аккуратный специалист. Пациенты довольны качеством лечения и эстетическими результатами. Отличные навыки работы с современными стоматологическими материалами. Постоянно совершенствует технику работы, посещает мастер-классы по эстетической стоматологии.'
    },
    financial: {
      salary: 110000,
      bonus: 15000,
      totalEarnings: 125000,
      taxInfo: 'НДФЛ 13%',
      lastSalaryReview: '2024-04-10'
    }
  },
  {
    id: 'doc-005',
    personalInfo: {
      fullName: 'Орлов Сергей Владимирович',
      birthDate: '1982-07-14',
      gender: 'male',
      phone: '+7 (916) 567-89-01',
      email: 's.orlov@medical.ru',
      address: 'г. Москва, ул. Тверская, д. 18, кв. 23',
      education: 'Высшее медицинское, МГМУ им. Сеченова, ординатура по неврологии',
      experience: 16,
      licenseNumber: 'MED-005678',
      licenseExpiry: '2025-09-20',
      profileImage: '/doctors/orlov.jpg'
    },
    professionalInfo: {
      specialization: 'neurologist',
      department: 'Неврология',
      position: 'Ведущий невролог',
      qualifications: ['Неврология', 'Рефлексотерапия', 'Мануальная терапия', 'ЭЭГ', 'УЗДГ сосудов головы и шеи'],
      languages: ['Русский', 'Английский'],
      status: 'active',
      hireDate: '2014-02-15',
      office: 'Кабинет 208',
      workingHours: {
        days: ['Пн', 'Ср', 'Чт', 'Пт'],
        hours: '09:00-18:00'
      }
    },
    schedule: [
      {
        id: 'app-015',
        patientName: 'Тихонова Ирина Петровна',
        patientAge: 58,
        reason: 'Лечение остеохондроза шейного отдела',
        date: '2024-06-25',
        time: '10:30',
        duration: 45,
        status: 'scheduled',
        priority: 'medium',
        room: '208',
        notes: 'Пациентка с хроническим болевым синдромом. Курс лечения включает медикаментозную терапию и физиопроцедуры.',
        doctorId: 'doc-005'
      },
      {
        id: 'app-016',
        patientName: 'Крылов Максим Андреевич',
        patientAge: 34,
        reason: 'Диагностика головных болей напряжения',
        date: '2024-06-25',
        time: '12:00',
        duration: 30,
        status: 'scheduled',
        priority: 'medium',
        room: '208',
        doctorId: 'doc-005'
      },
      {
        id: 'app-017',
        patientName: 'Зайцева Екатерина Викторовна',
        patientAge: 45,
        reason: 'Контрольный осмотр после курса лечения мигрени',
        date: '2024-06-25',
        time: '14:00',
        duration: 25,
        status: 'scheduled',
        priority: 'low',
        room: '208',
        doctorId: 'doc-005'
      }
    ],
    performance: {
      rating: 4.8,
      patientsPerMonth: 85,
      successRate: 94,
      averageConsultationTime: 30,
      lastEvaluation: '2024-04-22',
      monthlyGrowth: 7.4,
      notes: 'Компетентный специалист в области неврологии. Эффективно работает с пациентами, страдающими хроническими заболеваниями. Владеет современными методами диагностики и лечения. Особый интерес проявляет к лечению головных болей и вертеброгенных заболеваний.'
    },
    financial: {
      salary: 140000,
      bonus: 18000,
      totalEarnings: 158000,
      taxInfo: 'НДФЛ 13%',
      lastSalaryReview: '2024-03-15'
    }
  },
  {
    id: 'doc-006',
    personalInfo: {
      fullName: 'Морозова Ольга Дмитриевна',
      birthDate: '1988-11-30',
      gender: 'female',
      phone: '+7 (916) 678-90-12',
      email: 'o.morozova@medical.ru',
      address: 'г. Москва, ул. Садовая, д. 42, кв. 15',
      education: 'Высшее медицинское, РУДН, ординатура по офтальмологии',
      experience: 10,
      licenseNumber: 'MED-006789',
      licenseExpiry: '2025-08-15',
      profileImage: '/doctors/morozova.jpg'
    },
    professionalInfo: {
      specialization: 'ophthalmologist',
      department: 'Офтальмология',
      position: 'Врач-офтальмолог',
      qualifications: ['Офтальмология', 'Хирургия катаракты', 'Лазерная коррекция зрения', 'Диагностика заболеваний сетчатки'],
      languages: ['Русский', 'Английский', 'Французский'],
      status: 'on_leave',
      hireDate: '2019-05-20',
      office: 'Кабинет 105',
      workingHours: {
        days: ['Пн', 'Вт', 'Ср', 'Чт'],
        hours: '09:00-16:00'
      }
    },
    schedule: [],
    performance: {
      rating: 4.6,
      patientsPerMonth: 65,
      successRate: 92,
      averageConsultationTime: 35,
      lastEvaluation: '2024-04-10',
      monthlyGrowth: 6.1,
      notes: 'Специализируется на хирургическом лечении катаракты. Владеет современными методиками лазерной коррекции зрения. Пациенты отмечают деликатный подход и тщательность обследования.'
    },
    financial: {
      salary: 130000,
      bonus: 12000,
      totalEarnings: 142000,
      taxInfo: 'НДФЛ 13%',
      lastSalaryReview: '2024-02-28'
    }
  }
];

// =============================================================================
// КОМПОНЕНТЫ КАРТОЧЕК
// =============================================================================

interface DoctorCardProps {
  doctor: Doctor;
  onClick?: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onClick }) => {
  const getDoctorColor = (status: string): string => {
    const colorMap: { [key: string]: string } = {
      active: DOCTOR_COLORS.active,
      inactive: DOCTOR_COLORS.inactive,
      on_leave: DOCTOR_COLORS.on_leave,
      busy: DOCTOR_COLORS.busy,
      available: DOCTOR_COLORS.available
    };
    return colorMap[status] || DOCTOR_COLORS.inactive;
  };

  const scheduledAppointments = doctor.schedule.filter(a => 
    a.status === 'scheduled' && a.date === '2024-06-25'
  ).length;

  const daysUntilLicenseExpiry = getDaysUntilExpiry(doctor.personalInfo.licenseExpiry);
  const isLicenseExpiringSoon = daysUntilLicenseExpiry <= 90;

  return (
    <BentoCard 
      className="h-full" 
      glowColor={getDoctorColor(doctor.professionalInfo.status)} 
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-white font-semibold text-sm md:text-base line-clamp-1">
              Др. {doctor.personalInfo.fullName}
            </h4>
            {isLicenseExpiringSoon && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-amber-500 rounded-full"
                title={`Лицензия истекает через ${daysUntilLicenseExpiry} дней`}
              />
            )}
          </div>
          <p className="text-slate-400 text-xs md:text-sm line-clamp-1">
            {getSpecializationLabel(doctor.professionalInfo.specialization)} • {doctor.personalInfo.experience} лет опыта
          </p>
        </div>
        <StatusBadge 
          status={doctor.professionalInfo.status} 
          animated={doctor.professionalInfo.status === 'available'} 
          size="small"
        />
      </div>
      
      <div className="space-y-2 md:space-y-3 text-xs md:text-sm mb-4 md:mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Специализация:</span>
          <div className="flex items-center space-x-1 md:space-x-2">
            <span className="text-base md:text-lg">{getSpecializationIcon(doctor.professionalInfo.specialization)}</span>
            <StatusBadge status={doctor.professionalInfo.specialization} size="small" />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Отдел:</span>
          <span className="text-white font-medium text-right text-xs md:text-sm">
            {doctor.professionalInfo.department}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Пациентов:</span>
          <span className="text-white font-medium">{doctor.performance.patientsPerMonth}/мес</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Рейтинг:</span>
          <div className="flex items-center space-x-1">
            <span className="text-amber-500 text-sm">★</span>
            <span className="text-white font-medium text-xs md:text-sm">{doctor.performance.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <div className="text-xs text-slate-400">
          {scheduledAppointments} записей сегодня
        </div>
        <div className="text-xs font-semibold text-emerald-500">
          {doctor.performance.successRate}% успешности
        </div>
      </div>

      {isLicenseExpiringSoon && (
        <motion.div 
          className="mt-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <p className="text-amber-300 text-xs text-center">
            Лицензия истекает через {daysUntilLicenseExpiry} дней
          </p>
        </motion.div>
      )}
    </BentoCard>
  );
};

interface AppointmentCardProps {
  appointment: DoctorAppointment;
  onClick?: () => void;
  showDoctorInfo?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  onClick,
  showDoctorInfo = false 
}) => {
  const getAppointmentColor = (status: string): string => {
    const colorMap: { [key: string]: string } = {
      scheduled: DOCTOR_COLORS.active,
      in_progress: DOCTOR_COLORS.available,
      completed: DOCTOR_COLORS.therapist,
      cancelled: DOCTOR_COLORS.inactive
    };
    return colorMap[status] || DOCTOR_COLORS.inactive;
  };

  const doctor = doctors.find(d => d.id === appointment.doctorId);

  return (
    <BentoCard 
      className="h-full" 
      glowColor={getAppointmentColor(appointment.status)} 
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2 md:mb-3">
        <div className="flex-1 min-w-0 mr-2 md:mr-3">
          <h5 className="text-white font-semibold text-sm mb-1 line-clamp-2">
            {appointment.patientName}
          </h5>
          <p className="text-slate-400 text-xs line-clamp-2">
            {appointment.reason}
          </p>
          {showDoctorInfo && doctor && (
            <p className="text-slate-500 text-xs mt-1">
              Др. {doctor.personalInfo.fullName}
            </p>
          )}
        </div>
        <StatusBadge 
          status={appointment.status} 
          animated={appointment.status === 'scheduled'} 
          size="small" 
        />
      </div>
      
      <div className="space-y-1.5 md:space-y-2 text-xs mb-2 md:mb-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Время:</span>
          <span className="text-white">{formatTime(appointment.time)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Длительность:</span>
          <span className="text-white">{appointment.duration} мин</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Возраст:</span>
          <span className="text-white">{appointment.patientAge} лет</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Приоритет:</span>
          <StatusBadge status={appointment.priority} size="small" />
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Кабинет:</span>
          <span className="text-white">{appointment.room}</span>
        </div>
      </div>

      {appointment.notes && (
        <div className="pt-2 border-t border-slate-700/50">
          <p className="text-slate-400 text-xs line-clamp-2">
            {appointment.notes}
          </p>
        </div>
      )}
    </BentoCard>
  );
};

// =============================================================================
// ОСНОВНОЙ КОМПОНЕНТ ДАШБОРДА
// =============================================================================

const DoctorManagementDashboard: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'schedule' | 'performance'>('overview');
  const [filterSpecialization, setFilterSpecialization] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Имитация загрузки данных
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Статистика для дашборда
  const stats = useMemo(() => {
    const totalDoctors = doctors.length;
    const activeDoctors = doctors.filter(d => 
      d.professionalInfo.status === 'active' || d.professionalInfo.status === 'available'
    ).length;
    const totalPatients = doctors.reduce((acc, doctor) => acc + doctor.performance.patientsPerMonth, 0);
    const todayAppointments = doctors.flatMap(d => d.schedule).filter(a => 
      a.status === 'scheduled' && a.date === '2024-06-25'
    ).length;
    const specializations = [...new Set(doctors.map(d => d.professionalInfo.specialization))];
    const totalRevenue = doctors.reduce((acc, doctor) => acc + doctor.financial.totalEarnings, 0);
    const averageRating = doctors.reduce((acc, d) => acc + d.performance.rating, 0) / doctors.length;
    
    return {
      totalDoctors,
      activeDoctors,
      totalPatients,
      todayAppointments,
      specializations,
      totalRevenue,
      averageRating
    };
  }, []);

  // Фильтрация врачей
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const specializationMatch = filterSpecialization === 'all' || 
        doctor.professionalInfo.specialization === filterSpecialization;
      const statusMatch = filterStatus === 'all' || 
        doctor.professionalInfo.status === filterStatus;
      const searchMatch = searchQuery === '' || 
        doctor.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getSpecializationLabel(doctor.professionalInfo.specialization).toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.professionalInfo.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      return specializationMatch && statusMatch && searchMatch;
    });
  }, [filterSpecialization, filterStatus, searchQuery]);

  // Все приемы
  const allAppointments = useMemo(() => 
    doctors.flatMap(doctor => 
      doctor.schedule.map(appointment => ({
        ...appointment,
        doctorId: doctor.id
      }))
    ), 
  []);

  // Приемы на сегодня
  const todayAppointments = useMemo(() => 
    allAppointments.filter(appointment => 
      appointment.status === 'scheduled' && appointment.date === '2024-06-25'
    ),
  [allAppointments]);

  // Фильтрованные приемы
  const filteredAppointments = useMemo(() => {
    return todayAppointments.filter(appointment => {
      const doctor = doctors.find(d => d.id === appointment.doctorId);
      const specializationMatch = filterSpecialization === 'all' || 
        doctor?.professionalInfo.specialization === filterSpecialization;
      return specializationMatch;
    });
  }, [todayAppointments, filterSpecialization]);

  // Топ врачи по рейтингу
  const topDoctors = useMemo(() => 
    doctors
      .filter(d => d.professionalInfo.status === 'active' || d.professionalInfo.status === 'available')
      .sort((a, b) => b.performance.rating - a.performance.rating)
      .slice(0, 5),
  []);

  // Врачи с истекающей лицензией
  const expiringLicenses = useMemo(() =>
    doctors.filter(doctor => {
      const daysUntilExpiry = getDaysUntilExpiry(doctor.personalInfo.licenseExpiry);
      return daysUntilExpiry <= 90;
    }),
  []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-3 md:p-4 lg:p-6">
      {/* Хедер */}
      <motion.header 
        className="mb-6 md:mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 md:mb-6">
          <div className="mb-4 lg:mb-0">
            <motion.h1 
              className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Управление врачами
            </motion.h1>
            <motion.p 
              className="text-slate-400 text-sm md:text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Мониторинг и координация медицинского персонала
            </motion.p>
          </div>
          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button 
              className="px-3 md:px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-medium transition-colors text-sm md:text-base flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>+</span>
              <span>Новый врач</span>
            </motion.button>
            <motion.button 
              className="px-3 md:px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-colors text-sm md:text-base flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>+</span>
              <span>Запись на прием</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Поиск */}
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Поиск врачей по имени, специализации или отделу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Навигация */}
        <motion.nav 
          className="flex space-x-1 p-1 bg-slate-800/50 rounded-2xl backdrop-blur-xl border border-slate-700/50 mb-4 overflow-x-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { id: 'overview', label: 'Обзор', icon: '📊' },
            { id: 'doctors', label: 'Врачи', icon: '👨‍⚕️' },
            { id: 'schedule', label: 'Расписание', icon: '📅' },
            { id: 'performance', label: 'Эффективность', icon: '📈' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white shadow-lg shadow-black/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm md:text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </motion.nav>

        {/* Фильтры */}
        {(activeTab === 'doctors' || activeTab === 'schedule') && (
          <motion.div 
            className="flex flex-wrap gap-3 md:gap-4 p-3 md:p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 text-xs md:text-sm">Специализация:</span>
              <select 
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-2 md:px-3 py-1.5 text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px] md:min-w-[140px]"
              >
                <option value="all">Все специализации</option>
                {stats.specializations.map(spec => (
                  <option key={spec} value={spec}>
                    {getSpecializationLabel(spec)}
                  </option>
                ))}
              </select>
            </div>
            
            {activeTab === 'doctors' && (
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 text-xs md:text-sm">Статус:</span>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-700/50 border border-slate-600 rounded-lg px-2 md:px-3 py-1.5 text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px] md:min-w-[140px]"
                >
                  <option value="all">Все статусы</option>
                  <option value="active">Активен</option>
                  <option value="available">Доступен</option>
                  <option value="busy">Занят</option>
                  <option value="on_leave">В отпуске</option>
                  <option value="inactive">Неактивен</option>
                </select>
              </div>
            )}
            
            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-slate-400 text-xs md:text-sm">
                Найдено: {activeTab === 'doctors' ? filteredDoctors.length : filteredAppointments.length}
              </span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                <StatCard
                  title="Всего врачей"
                  value={stats.totalDoctors}
                  change={5.2}
                  icon="👨‍⚕️"
                  color={DOCTOR_COLORS.active}
                  subtitle={`${stats.activeDoctors} активных`}
                  trend="up"
                  loading={isLoading}
                />
                <StatCard
                  title="Пациентов в месяц"
                  value={stats.totalPatients}
                  change={8.7}
                  icon="👥"
                  color={DOCTOR_COLORS.pediatrician}
                  subtitle="обслуживается"
                  trend="up"
                  loading={isLoading}
                />
                <StatCard
                  title="Записи сегодня"
                  value={stats.todayAppointments}
                  change={-2.1}
                  icon="📅"
                  color={DOCTOR_COLORS.available}
                  subtitle="запланировано"
                  trend="down"
                  loading={isLoading}
                />
                <StatCard
                  title="Общие затраты"
                  value={formatCurrency(stats.totalRevenue)}
                  change={12.3}
                  icon="💰"
                  color={DOCTOR_COLORS.cardiologist}
                  subtitle="зарплаты и бонусы"
                  trend="up"
                  loading={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                {/* Лучшие врачи */}
                <BentoCard className="p-4 md:p-6" glowColor={DOCTOR_COLORS.active}>
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-white">Лучшие врачи</h3>
                    <motion.button 
                      className="text-slate-400 hover:text-white text-xs md:text-sm font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab('doctors')}
                    >
                      Все →
                    </motion.button>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    {topDoctors.map((doctor, index) => (
                      <motion.div 
                        key={doctor.id}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                        onClick={() => setSelectedDoctor(doctor)}
                        whileHover={{ scale: 1.01 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                          {generateInitials(doctor.personalInfo.fullName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm truncate">
                            Др. {doctor.personalInfo.fullName}
                          </h4>
                          <p className="text-slate-400 text-xs truncate">
                            {getSpecializationLabel(doctor.professionalInfo.specialization)} • {doctor.professionalInfo.department}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-amber-500 text-sm">★</span>
                          <span className="text-white text-sm font-medium">{doctor.performance.rating}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </BentoCard>

                {/* Ближайшие приемы */}
                <BentoCard className="p-4 md:p-6" glowColor={DOCTOR_COLORS.available}>
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-white">Ближайшие приемы</h3>
                    <motion.button 
                      className="text-slate-400 hover:text-white text-xs md:text-sm font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab('schedule')}
                    >
                      Все →
                    </motion.button>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    {todayAppointments
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .slice(0, 4)
                      .map((appointment, index) => (
                      <motion.div 
                        key={appointment.id}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                        onClick={() => setSelectedAppointment(appointment)}
                        whileHover={{ scale: 1.01 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          appointment.priority === 'high' ? 'bg-gradient-to-br from-red-500 to-pink-500' :
                          appointment.priority === 'medium' ? 'bg-gradient-to-br from-orange-500 to-amber-500' :
                          'bg-gradient-to-br from-green-500 to-emerald-500'
                        }`}>
                          {appointment.patientName[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm line-clamp-2">
                            {appointment.patientName}
                          </h4>
                          <p className="text-slate-400 text-xs line-clamp-2">
                            {formatTime(appointment.time)} • {appointment.reason}
                          </p>
                        </div>
                        <StatusBadge status={appointment.priority} size="small" />
                      </motion.div>
                    ))}
                  </div>
                </BentoCard>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                {/* Специализации */}
                <BentoCard className="p-4 md:p-6" glowColor={DOCTOR_COLORS.cardiologist}>
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-white">Распределение по специализациям</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                    {stats.specializations.map((specialization, index) => {
                      const specDoctors = doctors.filter(d => d.professionalInfo.specialization === specialization);
                      const activeSpecDoctors = specDoctors.filter(d => 
                        d.professionalInfo.status === 'active' || d.professionalInfo.status === 'available'
                      );
                      
                      return (
                        <motion.div 
                          key={specialization} 
                          className="text-center p-3 md:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => {
                            setActiveTab('doctors');
                            setFilterSpecialization(specialization);
                          }}
                        >
                          <div className="text-xl md:text-2xl mb-2">
                            {getSpecializationIcon(specialization)}
                          </div>
                          <h4 className="text-white font-medium text-sm capitalize mb-1">
                            {getSpecializationLabel(specialization)}
                          </h4>
                          <p className="text-slate-400 text-xs">
                            {activeSpecDoctors.length}/{specDoctors.length} врачей
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </BentoCard>

                {/* Предупреждения */}
                <BentoCard className="p-4 md:p-6" glowColor={DOCTOR_COLORS.orange}>
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-white">Важные уведомления</h3>
                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold">
                      {expiringLicenses.length}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {expiringLicenses.length > 0 ? (
                      expiringLicenses.map((doctor, index) => {
                        const daysUntilExpiry = getDaysUntilExpiry(doctor.personalInfo.licenseExpiry);
                        return (
                          <motion.div
                            key={doctor.id}
                            className="flex items-center space-x-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                            <div className="flex-1">
                              <p className="text-amber-300 text-sm font-medium">
                                Др. {doctor.personalInfo.fullName}
                              </p>
                              <p className="text-amber-400 text-xs">
                                Лицензия истекает через {daysUntilExpiry} дней
                              </p>
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-2xl mb-2">🎉</div>
                        <p className="text-slate-400 text-sm">Нет срочных уведомлений</p>
                      </div>
                    )}
                  </div>
                </BentoCard>
              </div>
            </motion.div>
          )}

          {activeTab === 'doctors' && (
            <motion.div
              key="doctors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Медицинский персонал</h2>
                <p className="text-slate-400 text-sm md:text-base">Управление врачами и их расписанием</p>
              </div>
              
              {filteredDoctors.length === 0 ? (
                <BentoCard className="p-8 text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-white font-semibold text-lg mb-2">Врачи не найдены</h3>
                  <p className="text-slate-400 text-sm">Попробуйте изменить параметры фильтрации или поиска</p>
                </BentoCard>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {filteredDoctors.map((doctor, index) => (
                    <motion.div
                      key={doctor.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <DoctorCard 
                        doctor={doctor} 
                        onClick={() => setSelectedDoctor(doctor)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Расписание приемов</h2>
                <p className="text-slate-400 text-sm md:text-base">Управление записями и расписанием врачей</p>
              </div>
              
              {filteredAppointments.length === 0 ? (
                <BentoCard className="p-8 text-center">
                  <div className="text-4xl mb-4">📅</div>
                  <h3 className="text-white font-semibold text-lg mb-2">Записи не найдены</h3>
                  <p className="text-slate-400 text-sm">На сегодня запланированных приемов нет</p>
                </BentoCard>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {filteredAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AppointmentCard 
                        appointment={appointment} 
                        onClick={() => setSelectedAppointment(appointment)}
                        showDoctorInfo={true}
                      />
                    </motion.div>
                  ))}
                </div>
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
              <div className="mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Эффективность работы</h2>
                <p className="text-slate-400 text-sm md:text-base">Мониторинг производительности врачей</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Рейтинги врачей */}
                <BentoCard className="p-4 md:p-6" glowColor={DOCTOR_COLORS.active}>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">Рейтинги врачей</h3>
                  <div className="space-y-3 md:space-y-4">
                    {doctors
                      .sort((a, b) => b.performance.rating - a.performance.rating)
                      .map((doctor, index) => (
                      <motion.div 
                        key={doctor.id}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                        onClick={() => setSelectedDoctor(doctor)}
                        whileHover={{ scale: 1.01 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                          {generateInitials(doctor.personalInfo.fullName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm truncate">
                            Др. {doctor.personalInfo.fullName}
                          </h4>
                          <p className="text-slate-400 text-xs">
                            {doctor.performance.patientsPerMonth} пациентов/мес • {doctor.performance.successRate}% успешности
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-amber-500 text-sm">★</span>
                          <span className="text-white text-sm font-medium">{doctor.performance.rating}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </BentoCard>

                {/* Показатели эффективности */}
                <BentoCard className="p-4 md:p-6" glowColor={DOCTOR_COLORS.cardiologist}>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">Ключевые показатели</h3>
                  <div className="space-y-4 md:space-y-6">
                    <div>
                      <div className="flex justify-between text-sm text-slate-300 mb-2">
                        <span>Средний рейтинг врачей</span>
                        <span className="font-semibold">
                          {stats.averageRating.toFixed(1)}/5
                        </span>
                      </div>
                      <ProgressBar 
                        value={(stats.averageRating / 5) * 100} 
                        color={DOCTOR_COLORS.active}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-slate-300 mb-2">
                        <span>Общая успешность лечения</span>
                        <span className="font-semibold">
                          {(doctors.reduce((acc, d) => acc + d.performance.successRate, 0) / doctors.length).toFixed(1)}%
                        </span>
                      </div>
                      <ProgressBar 
                        value={doctors.reduce((acc, d) => acc + d.performance.successRate, 0) / doctors.length} 
                        color={DOCTOR_COLORS.therapist}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-slate-300 mb-2">
                        <span>Среднее время приема</span>
                        <span className="font-semibold">
                          {(doctors.reduce((acc, d) => acc + d.performance.averageConsultationTime, 0) / doctors.length).toFixed(0)} мин
                        </span>
                      </div>
                      <ProgressBar 
                        value={(doctors.reduce((acc, d) => acc + d.performance.averageConsultationTime, 0) / doctors.length) / 60 * 100} 
                        color={DOCTOR_COLORS.available}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm text-slate-300 mb-2">
                        <span>Загрузка врачей</span>
                        <span className="font-semibold">
                          {Math.round((stats.todayAppointments / (doctors.length * 8)) * 100)}%
                        </span>
                      </div>
                      <ProgressBar 
                        value={(stats.todayAppointments / (doctors.length * 8)) * 100} 
                        color={DOCTOR_COLORS.pediatrician}
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
        isOpen={!!selectedDoctor} 
        onClose={() => setSelectedDoctor(null)}
        title={`Доктор ${selectedDoctor?.personalInfo.fullName}`}
        size="xl"
      >
        {selectedDoctor && (
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <BentoCard className="p-4 md:p-6" glowColor={DOCTOR_COLORS.active}>
                <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Персональная информация</h4>
                <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дата рождения:</span>
                    <span className="text-white text-right">
                      {formatDate(selectedDoctor.personalInfo.birthDate)} ({calculateAge(selectedDoctor.personalInfo.birthDate)} лет)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Телефон:</span>
                    <span className="text-white">{selectedDoctor.personalInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white">{selectedDoctor.personalInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Образование:</span>
                    <span className="text-white text-right">{selectedDoctor.personalInfo.education}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Опыт работы:</span>
                    <span className="text-white">{selectedDoctor.personalInfo.experience} лет</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Лицензия:</span>
                    <span className="text-white">{selectedDoctor.personalInfo.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Истекает:</span>
                    <span className="text-white">{formatDate(selectedDoctor.personalInfo.licenseExpiry)}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-4 md:p-6" glowColor={DOCTOR_COLORS.cardiologist}>
                <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Профессиональная информация</h4>
                <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Специализация:</span>
                    <StatusBadge status={selectedDoctor.professionalInfo.specialization} size="small" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Отдел:</span>
                    <span className="text-white">{selectedDoctor.professionalInfo.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Должность:</span>
                    <span className="text-white">{selectedDoctor.professionalInfo.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedDoctor.professionalInfo.status} size="small" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Работает с:</span>
                    <span className="text-white">{formatDate(selectedDoctor.professionalInfo.hireDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Кабинет:</span>
                    <span className="text-white">{selectedDoctor.professionalInfo.office}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">График:</span>
                    <span className="text-white text-right">
                      {selectedDoctor.professionalInfo.workingHours.days.join(', ')} {selectedDoctor.professionalInfo.workingHours.hours}
                    </span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-4 md:p-6" glowColor={DOCTOR_COLORS.therapist}>
                <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Квалификация и языки</h4>
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <h5 className="text-slate-400 text-xs md:text-sm mb-2">Квалификации:</h5>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {selectedDoctor.professionalInfo.qualifications.map((qualification, index) => (
                        <span 
                          key={index}
                          className="text-xs text-slate-300 bg-white/10 rounded-full px-2 md:px-3 py-1 border border-slate-600/50"
                        >
                          {qualification}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-slate-400 text-xs md:text-sm mb-2">Языки:</h5>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {selectedDoctor.professionalInfo.languages.map((language, index) => (
                        <span 
                          key={index}
                          className="text-xs text-slate-300 bg-white/10 rounded-full px-2 md:px-3 py-1 border border-slate-600/50"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-4 md:p-6" glowColor={DOCTOR_COLORS.available}>
                <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Производительность</h4>
                <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Рейтинг:</span>
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <span className="text-amber-500 text-sm">★</span>
                      <span className="text-white font-semibold">{selectedDoctor.performance.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Пациентов в месяц:</span>
                    <span className="text-white">{selectedDoctor.performance.patientsPerMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Успешность лечения:</span>
                    <span className="text-white">{selectedDoctor.performance.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Среднее время приема:</span>
                    <span className="text-white">{selectedDoctor.performance.averageConsultationTime} мин</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Рост за месяц:</span>
                    <span className="text-white">{selectedDoctor.performance.monthlyGrowth}%</span>
                  </div>
                  {selectedDoctor.performance.lastEvaluation && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Последняя оценка:</span>
                      <span className="text-white">{formatDate(selectedDoctor.performance.lastEvaluation)}</span>
                    </div>
                  )}
                </div>
              </BentoCard>
            </div>

            <BentoCard className="p-4 md:p-6" glowColor={DOCTOR_COLORS.pediatrician}>
              <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Сегодняшние приемы</h4>
              {selectedDoctor.schedule.filter(a => a.status === 'scheduled' && a.date === '2024-06-25').length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">На сегодня запланированных приемов нет</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {selectedDoctor.schedule
                    .filter(a => a.status === 'scheduled' && a.date === '2024-06-25')
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((appointment) => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                      onClick={() => setSelectedAppointment(appointment)}
                    />
                  ))}
                </div>
              )}
            </BentoCard>

            {selectedDoctor.performance.notes && (
              <BentoCard className="p-4 md:p-6" glowColor={DOCTOR_COLORS.neurologist}>
                <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Примечания руководителя</h4>
                <p className="text-slate-300 text-sm">{selectedDoctor.performance.notes}</p>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!selectedAppointment} 
        onClose={() => setSelectedAppointment(null)}
        title="Информация о приеме"
        size="lg"
      >
        {selectedAppointment && (
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <BentoCard className="p-4 md:p-6" glowColor={DOCTOR_COLORS.active}>
                <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Информация о пациенте</h4>
                <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Пациент:</span>
                    <span className="text-white">{selectedAppointment.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Возраст:</span>
                    <span className="text-white">{selectedAppointment.patientAge} лет</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Причина обращения:</span>
                    <span className="text-white text-right">{selectedAppointment.reason}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Приоритет:</span>
                    <StatusBadge status={selectedAppointment.priority} size="small" />
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-4 md:p-6" glowColor={DOCTOR_COLORS.available}>
                <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Детали приема</h4>
                <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дата:</span>
                    <span className="text-white">{formatDate(selectedAppointment.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Время:</span>
                    <span className="text-white">{formatTime(selectedAppointment.time)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Длительность:</span>
                    <span className="text-white">{selectedAppointment.duration} минут</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedAppointment.status} size="small" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Кабинет:</span>
                    <span className="text-white">{selectedAppointment.room}</span>
                  </div>
                  {selectedAppointment.doctorId && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Врач:</span>
                      <span className="text-white">
                        {doctors.find(d => d.id === selectedAppointment.doctorId)?.personalInfo.fullName}
                      </span>
                    </div>
                  )}
                </div>
              </BentoCard>
            </div>

            {selectedAppointment.notes && (
              <BentoCard className="p-4 md:p-6" glowColor={DOCTOR_COLORS.cardiologist}>
                <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Дополнительные заметки</h4>
                <p className="text-slate-300 text-sm">{selectedAppointment.notes}</p>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorManagementDashboard;