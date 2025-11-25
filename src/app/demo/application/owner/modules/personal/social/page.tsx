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

const VOLUNTEER_COLORS = {
  active: '34, 197, 94',
  inactive: '100, 116, 139',
  on_break: '245, 158, 11',
  training: '59, 130, 246',
  coordinator: '147, 51, 234',
  team_lead: '239, 68, 68',
  volunteer: '16, 185, 129',
  trainee: '59, 130, 246',
  medical: '239, 68, 68',
  education: '59, 130, 246',
  logistics: '245, 158, 11',
  social: '16, 185, 129',
  events: '147, 51, 234',
  fundraising: '20, 184, 166'
};

// Вспомогательные функции
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatDateTime = (dateString: string, timeString: string): string => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString('ru-RU')} в ${timeString}`;
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

const getDepartmentIcon = (department: string): string => {
  const icons: { [key: string]: string } = {
    'medical': '🏥',
    'education': '📚',
    'logistics': '🚚',
    'social': '🤝',
    'events': '🎪',
    'fundraising': '💰'
  };
  return icons[department] || '🎯';
};

const getDepartmentName = (department: string): string => {
  const names: { [key: string]: string } = {
    'medical': 'Медицинский',
    'education': 'Образовательный',
    'logistics': 'Логистика',
    'social': 'Социальный',
    'events': 'Мероприятия',
    'fundraising': 'Фандрайзинг'
  };
  return names[department] || department;
};

const getInitials = (fullName: string): string => {
  return fullName.split(' ').map(name => name[0]).join('').toUpperCase();
};

const generateGradient = (name: string): string => {
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-amber-500',
    'from-indigo-500 to-blue-500',
    'from-rose-500 to-red-500'
  ];
  const index = name.length % gradients.length;
  return gradients[index];
};

// Базовые компоненты UI
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
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        className={`relative bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50 rounded-3xl shadow-2xl w-full ${sizeClasses[size]} max-h-[95vh] overflow-hidden`}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 300,
          duration: 0.3
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {title && (
          <div className="border-b border-slate-700/50 p-6 bg-slate-800/20">
            <div className="flex items-center justify-between">
              <h2 
                id="modal-title"
                className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
              >
                {title}
              </h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200 text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                  aria-label="Закрыть окно"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  animated?: boolean;
}

const BentoCard: React.FC<BentoCardProps> = ({ 
  children, 
  className = '', 
  glowColor = COLORS.teal, 
  onClick,
  hoverable = true,
  padding = 'p-6',
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
      ${onClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900' : ''}
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
    initial={animated ? { opacity: 0, y: 20 } : false}
    animate={animated ? { opacity: 1, y: 0 } : false}
    transition={{ duration: 0.4 }}
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
    const configs: { [key: string]: { color: string; label: string; bg: string; border: string } } = {
      'active': { color: COLORS.success, label: 'Активен', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      'inactive': { color: COLORS.slate, label: 'Неактивен', bg: 'bg-slate-500/15', border: 'border-slate-500/30' },
      'on_break': { color: COLORS.orange, label: 'На перерыве', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      'training': { color: COLORS.blue, label: 'На обучении', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      'completed': { color: COLORS.success, label: 'Завершена', bg: 'bg-green-500/15', border: 'border-green-500/30' },
      'cancelled': { color: COLORS.error, label: 'Отменена', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      'scheduled': { color: COLORS.teal, label: 'Запланировано', bg: 'bg-teal-500/15', border: 'border-teal-500/30' },
      'in_progress': { color: COLORS.blue, label: 'В процессе', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      'coordinator': { color: COLORS.purple, label: 'Координатор', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
      'team_lead': { color: COLORS.error, label: 'Лидер команды', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      'volunteer': { color: COLORS.emerald, label: 'Волонтер', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      'trainee': { color: COLORS.blue, label: 'Стажер', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      'medical': { color: COLORS.error, label: 'Медицина', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      'education': { color: COLORS.blue, label: 'Образование', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      'logistics': { color: COLORS.orange, label: 'Логистика', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      'social': { color: COLORS.emerald, label: 'Социальный', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      'events': { color: COLORS.purple, label: 'Мероприятия', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
      'fundraising': { color: COLORS.teal, label: 'Фандрайзинг', bg: 'bg-teal-500/15', border: 'border-teal-500/30' },
      'new': { color: COLORS.blue, label: 'Новичок', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      'regular': { color: COLORS.emerald, label: 'Регулярный', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      'dedicated': { color: COLORS.purple, label: 'Преданный', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
      'leader': { color: COLORS.amber, label: 'Лидер', bg: 'bg-amber-500/15', border: 'border-amber-500/30' }
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
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {animated && (
        <motion.div 
          className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
          style={{ backgroundColor: `rgb(${config.color})` }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      {!animated && (
        <div 
          className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
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
      {(label || showValue) && (
        <div className={`flex justify-between text-slate-300 mb-2 ${textSize}`}>
          {label && <span>{label}</span>}
          {showValue && (
            <span className="font-semibold">
              {value}/{max} ({percentage.toFixed(1)}%)
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-700/50 rounded-full ${height} overflow-hidden`}>
        <motion.div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${height}`}
          initial={animated ? { width: 0 } : false}
          animate={animated ? { width: `${percentage}%` } : { width: `${percentage}%` }}
          style={{ 
            backgroundColor: `rgb(${color})`,
            boxShadow: `0 0 12px rgba(${color}, 0.4)`
          }}
          transition={animated ? { duration: 1, ease: "easeOut" } : {}}
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
      <BentoCard className="p-6" hoverable={false} animated={false}>
        <div className="animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-slate-700 rounded-2xl"></div>
            <div className="w-16 h-6 bg-slate-700 rounded-full"></div>
          </div>
          <div className="w-3/4 h-8 bg-slate-700 rounded mb-2"></div>
          <div className="w-1/2 h-4 bg-slate-700 rounded"></div>
          {subtitle && <div className="w-2/3 h-3 bg-slate-700 rounded mt-1"></div>}
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
        <div className="text-3xl p-3 rounded-2xl bg-white/5 backdrop-blur-sm transition-all duration-300 group-hover:scale-110">
          {icon}
        </div>
        {trendConfig !== 'neutral' && (
          <motion.div 
            className={`text-sm font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border ${
              trendConfig === 'up' 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
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
      {subtitle && (
        <div className="text-slate-400 text-xs mt-1">{subtitle}</div>
      )}
    </BentoCard>
  );
};

// Типы данных
interface Training {
  id: string;
  name: string;
  category: string;
  duration: number;
  completed: boolean;
  completionDate?: string;
  certificate?: string;
  description?: string;
  instructor?: string;
  location?: string;
}

interface VolunteerAssignment {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  requiredSkills: string[];
  participants: number;
  maxParticipants: number;
  coordinator: string;
  specialRequirements?: string;
  priority?: 'low' | 'medium' | 'high';
  equipment?: string[];
}

interface Volunteer {
  id: string;
  personalInfo: {
    fullName: string;
    birthDate: string;
    gender: 'male' | 'female';
    phone: string;
    email: string;
    address: string;
    skills: string[];
    education?: string;
    occupation?: string;
    photo?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  volunteerInfo: {
    joinDate: string;
    status: 'active' | 'inactive' | 'on_break' | 'training';
    role: 'coordinator' | 'team_lead' | 'volunteer' | 'trainee';
    department: 'medical' | 'education' | 'logistics' | 'social' | 'events' | 'fundraising';
    totalHours: number;
    availability: {
      days: string[];
      timeSlots: string[];
      flexible: boolean;
    };
    preferences: {
      tasks: string[];
      locations: string[];
      communication: 'phone' | 'email' | 'messenger' | 'in_person';
    };
  };
  assignments: VolunteerAssignment[];
  training: {
    completed: Training[];
    required: Training[];
    certifications: string[];
    upcoming: Training[];
  };
  performance: {
    rating: number;
    completedTasks: number;
    reliability: number;
    lastEvaluation?: string;
    notes?: string;
    strengths: string[];
    areasForImprovement: string[];
  };
  loyalty: {
    level: 'new' | 'regular' | 'dedicated' | 'leader';
    points: number;
    awards: string[];
    milestones: {
      date: string;
      achievement: string;
    }[];
  };
}

// Расширенные моки данных
const volunteers: Volunteer[] = [
  {
    id: 'vol-001',
    personalInfo: {
      fullName: 'Смирнова Анна Владимировна',
      birthDate: '1995-08-15',
      gender: 'female',
      phone: '+7 (916) 123-45-67',
      email: 'a.smirnova@example.ru',
      address: 'г. Москва, ул. Ленина, д. 25, кв. 12',
      skills: [
        'Первая помощь', 
        'Работа с детьми', 
        'Организация мероприятий', 
        'Английский язык', 
        'Психологическая поддержка', 
        'Кризисное вмешательство',
        'Координация команд',
        'Навыки презентации'
      ],
      education: 'Высшее психологическое образование, МГУ им. Ломоносова',
      occupation: 'Психолог в детском реабилитационном центре',
      emergencyContact: {
        name: 'Смирнов Владимир Петрович',
        phone: '+7 (916) 765-43-21',
        relationship: 'Отец'
      }
    },
    volunteerInfo: {
      joinDate: '2023-01-15',
      status: 'active',
      role: 'coordinator',
      department: 'social',
      totalHours: 356,
      availability: {
        days: ['Суббота', 'Воскресенье', 'Пятница'],
        timeSlots: ['10:00-18:00', '19:00-21:00'],
        flexible: true
      },
      preferences: {
        tasks: ['Работа с детьми', 'Психологическая помощь', 'Координация волонтеров', 'Проведение тренингов'],
        locations: ['Центр города', 'Детские учреждения', 'Образовательные центры'],
        communication: 'messenger'
      }
    },
    assignments: [
      {
        id: 'assign-001',
        title: 'Психологическая поддержка детей в приюте',
        description: 'Проведение индивидуальных и групповых занятий с детьми из неблагополучных семей, организация арт-терапии и развивающих игр',
        department: 'social',
        location: 'Детский приют "Надежда", ул. Добрая, 15',
        date: '2024-06-25',
        time: '14:00',
        duration: 4,
        status: 'scheduled',
        requiredSkills: ['Работа с детьми', 'Психология', 'Арт-терапия'],
        participants: 3,
        maxParticipants: 5,
        coordinator: 'Петров Игорь Сергеевич',
        specialRequirements: 'Опыт работы с детьми от 3 до 12 лет, знание основ детской психологии',
        priority: 'high',
        equipment: ['Материалы для творчества', 'Игровой инвентарь', 'Методические пособия']
      },
      {
        id: 'assign-002',
        title: 'Координация сбора гуманитарной помощи',
        description: 'Организация и координация процесса сортировки, упаковки и распределения вещей для нуждающихся семей',
        department: 'logistics',
        location: 'Центральный склад благотворительного фонда, пр. Мира, 89',
        date: '2024-06-20',
        time: '11:00',
        duration: 6,
        status: 'completed',
        requiredSkills: ['Организация', 'Коммуникация', 'Логистика'],
        participants: 8,
        maxParticipants: 10,
        coordinator: 'Сидоров Алексей Владимирович',
        priority: 'medium'
      },
      {
        id: 'assign-005',
        title: 'Координация волонтеров на благотворительном забеге',
        description: 'Организация работы волонтеров, распределение обязанностей, контроль за проведением мероприятия',
        department: 'events',
        location: 'Парк Горького, центральная аллея',
        date: '2024-07-10',
        time: '08:00',
        duration: 8,
        status: 'scheduled',
        requiredSkills: ['Лидерство', 'Организация', 'Коммуникация', 'Стрессоустойчивость'],
        participants: 1,
        maxParticipants: 2,
        coordinator: 'Петров Игорь Сергеевич',
        priority: 'high',
        equipment: ['Рации', 'План мероприятия', 'Списки участников']
      }
    ],
    training: {
      completed: [
        {
          id: 'train-001',
          name: 'Основы первой помощи и экстренного реагирования',
          category: 'medical',
          duration: 16,
          completed: true,
          completionDate: '2023-02-10',
          certificate: 'MED-001234',
          description: 'Курс по оказанию первой помощи в экстренных ситуациях',
          instructor: 'Иванова Мария Сергеевна',
          location: 'Учебный центр Красного Креста'
        },
        {
          id: 'train-002',
          name: 'Работа с трудными подростками и кризисное вмешательство',
          category: 'social',
          duration: 24,
          completed: true,
          completionDate: '2023-03-15',
          certificate: 'SOC-005678',
          description: 'Методы работы с подростками в сложных жизненных ситуациях'
        },
        {
          id: 'train-009',
          name: 'Координация волонтерской деятельности и управление командой',
          category: 'management',
          duration: 32,
          completed: true,
          completionDate: '2023-05-20',
          certificate: 'MGT-003456',
          description: 'Управление волонтерскими проектами и координация работы команд'
        }
      ],
      required: [
        {
          id: 'train-003',
          name: 'Кризисное вмешательство и психологическая первая помощь',
          category: 'social',
          duration: 20,
          completed: false,
          description: 'Углубленный курс по работе в кризисных ситуациях'
        }
      ],
      certifications: [
        'Сертификат первой помощи',
        'Детская психология и развитие',
        'Координатор волонтерских программ',
        'Кризисное консультирование'
      ],
      upcoming: [
        {
          id: 'train-015',
          name: 'Арт-терапия в работе с детьми',
          category: 'social',
          duration: 12,
          completed: false,
          description: 'Использование методов арт-терапии в работе с детьми'
        }
      ]
    },
    performance: {
      rating: 4.8,
      completedTasks: 47,
      reliability: 95,
      lastEvaluation: '2024-05-20',
      notes: 'Ответственный и инициативный волонтер. Отлично справляется с координацией крупных мероприятий. Проявила выдающиеся лидерские качества в организации благотворительного забега. Рекомендуется к продвижению на позицию старшего координатора.',
      strengths: [
        'Лидерские качества',
        'Организационные способности',
        'Эмпатия и понимание',
        'Стрессоустойчивость'
      ],
      areasForImprovement: [
        'Техническая документация',
        'Отчетность по проектам'
      ]
    },
    loyalty: {
      level: 'dedicated',
      points: 1890,
      awards: [
        'Волонтер месяца - Март 2024',
        'За преданность делу - 2023',
        'Лучший координатор года - 2023',
        'За выдающийся вклад в социальные проекты'
      ],
      milestones: [
        {
          date: '2023-01-15',
          achievement: 'Начало волонтерской деятельности'
        },
        {
          date: '2023-03-20',
          achievement: 'Первое координаторское назначение'
        },
        {
          date: '2023-12-10',
          achievement: '1000 часов волонтерской работы'
        },
        {
          date: '2024-03-15',
          achievement: 'Награда "Волонтер месяца"'
        }
      ]
    }
  },
  {
    id: 'vol-002',
    personalInfo: {
      fullName: 'Ковалев Дмитрий Сергеевич',
      birthDate: '1990-12-03',
      gender: 'male',
      phone: '+7 (925) 234-56-78',
      email: 'd.kovalev@example.ru',
      address: 'г. Москва, пр. Мира, д. 89, кв. 45',
      skills: [
        'Вождение автомобиля', 
        'Ремонтные работы', 
        'Логистика и диспетчеризация', 
        'Физическая выносливость', 
        'Грузоперевозки', 
        'Навигация',
        'Основной ремонт оборудования',
        'Складская логистика'
      ],
      education: 'Среднее специальное образование, автотранспортный колледж',
      occupation: 'Водитель-экспедитор в логистической компании',
      emergencyContact: {
        name: 'Ковалева Ольга Ивановна',
        phone: '+7 (925) 876-54-32',
        relationship: 'Жена'
      }
    },
    volunteerInfo: {
      joinDate: '2024-02-10',
      status: 'active',
      role: 'volunteer',
      department: 'logistics',
      totalHours: 156,
      availability: {
        days: ['Понедельник', 'Среда', 'Пятница'],
        timeSlots: ['09:00-13:00', '17:00-20:00'],
        flexible: false
      },
      preferences: {
        tasks: ['Перевозки грузов', 'Погрузочно-разгрузочные работы', 'Ремонт помещений', 'Доставка помощи'],
        locations: ['Весь город', 'Пригород', 'Складские помещения'],
        communication: 'phone'
      }
    },
    assignments: [
      {
        id: 'assign-003',
        title: 'Доставка продуктовых наборов одиноким пенсионерам',
        description: 'Доставка продуктовых корзин и предметов первой необходимости одиноким пенсионерам Северного административного округа',
        department: 'logistics',
        location: 'Северный административный округ, различные адреса',
        date: '2024-06-22',
        time: '10:00',
        duration: 5,
        status: 'scheduled',
        requiredSkills: ['Вождение', 'Коммуникабельность', 'Внимательность'],
        participants: 2,
        maxParticipants: 2,
        coordinator: 'Иванова Мария Сергеевна',
        priority: 'medium',
        equipment: ['Автомобиль', 'Навигатор', 'Списки адресов']
      },
      {
        id: 'assign-006',
        title: 'Перевозка мебели для семей, пострадавших от пожара',
        description: 'Доставка и помощь в размещении мебели для семей, потерявших имущество в результате пожара',
        department: 'logistics',
        location: 'Южный административный округ, ул. Восстановления, 25',
        date: '2024-06-28',
        time: '14:00',
        duration: 6,
        status: 'scheduled',
        requiredSkills: ['Вождение', 'Физическая сила', 'Аккуратность', 'Сборка мебели'],
        participants: 1,
        maxParticipants: 2,
        coordinator: 'Сидоров Алексей Владимирович',
        priority: 'high'
      }
    ],
    training: {
      completed: [
        {
          id: 'train-004',
          name: 'Безопасное вождение и правила перевозки грузов',
          category: 'logistics',
          duration: 8,
          completed: true,
          completionDate: '2024-02-20',
          description: 'Курс по безопасному вождению и особенностям перевозки гуманитарных грузов'
        },
        {
          id: 'train-010',
          name: 'Этика общения с пожилыми людьми и людьми с ограниченными возможностями',
          category: 'social',
          duration: 6,
          completed: true,
          completionDate: '2024-03-15',
          description: 'Основы корректного и уважительного общения с пожилыми людьми'
        }
      ],
      required: [
        {
          id: 'train-011',
          name: 'Обращение с хрупкими и ценными грузами',
          category: 'logistics',
          duration: 4,
          completed: false,
          description: 'Особенности транспортировки хрупких и ценных предметов'
        }
      ],
      certifications: [
        'Водитель категории B, C',
        'Свидетельство о безопасном вождении',
        'Сертификат по грузоперевозкам'
      ],
      upcoming: []
    },
    performance: {
      rating: 4.3,
      completedTasks: 18,
      reliability: 88,
      lastEvaluation: '2024-04-15',
      notes: 'Надежный и ответственный водитель, всегда соблюдает сроки доставки. Технически грамотен, хорошо ориентируется в городе. Нуждается в улучшении коммуникативных навыков при общении с подопечными.',
      strengths: [
        'Пунктуальность',
        'Технические знания',
        'Ориентация на местности',
        'Физическая выносливость'
      ],
      areasForImprovement: [
        'Коммуникативные навыки',
        'Ведение документации',
        'Работа с эмоционально сложными ситуациями'
      ]
    },
    loyalty: {
      level: 'regular',
      points: 670,
      awards: [
        'Волонтер недели - Апрель 2024',
        'За надежность и преданность'
      ],
      milestones: [
        {
          date: '2024-02-10',
          achievement: 'Начало волонтерской деятельности'
        },
        {
          date: '2024-04-01',
          achievement: 'Первая благодарность от подопечного'
        },
        {
          date: '2024-05-15',
          achievement: '100 часов волонтерской работы'
        }
      ]
    }
  },
  {
    id: 'vol-003',
    personalInfo: {
      fullName: 'Орлова Екатерина Михайловна',
      birthDate: '1998-05-22',
      gender: 'female',
      phone: '+7 (916) 345-67-89',
      email: 'e.orlova@example.ru',
      address: 'г. Москва, ул. Пушкина, д. 15, кв. 78',
      skills: [
        'Преподавание английского языка', 
        'Иностранные языки (английский, французский)', 
        'Рисование и живопись', 
        'Музыка (фортепиано)', 
        'Творческие мастер-классы', 
        'Работа с детьми',
        'Разработка учебных материалов',
        'Ораторское искусство'
      ],
      education: 'Студентка 4 курса Московского педагогического государственного университета, факультет иностранных языков',
      occupation: 'Студентка, репетитор английского языка',
      emergencyContact: {
        name: 'Орлова Светлана Викторовна',
        phone: '+7 (916) 987-65-43',
        relationship: 'Мать'
      }
    },
    volunteerInfo: {
      joinDate: '2024-03-01',
      status: 'training',
      role: 'trainee',
      department: 'education',
      totalHours: 45,
      availability: {
        days: ['Вторник', 'Четверг', 'Суббота'],
        timeSlots: ['15:00-19:00', '10:00-12:00'],
        flexible: true
      },
      preferences: {
        tasks: ['Преподавание языков', 'Творческие занятия', 'Языковые клубы', 'Разработка материалов'],
        locations: ['Библиотеки', 'Образовательные центры', 'Онлайн', 'Детские учреждения'],
        communication: 'email'
      }
    },
    assignments: [
      {
        id: 'assign-004',
        title: 'Ассистирование в языковом клубе для детей мигрантов',
        description: 'Помощь в проведении занятий английского языка для детей из семей мигрантов, индивидуальная работа с отстающими',
        department: 'education',
        location: 'Центральная библиотека №12, ул. Знаний, 8',
        date: '2024-06-23',
        time: '16:00',
        duration: 2,
        status: 'scheduled',
        requiredSkills: ['Английский язык', 'Работа с детьми', 'Педагогический подход'],
        participants: 1,
        maxParticipants: 2,
        coordinator: 'Смирнова Анна Владимировна',
        priority: 'medium'
      },
      {
        id: 'assign-007',
        title: 'Проведение творческой мастерской для детей из многодетных семей',
        description: 'Организация и проведение занятий по рисованию и прикладному творчеству для детей 6-12 лет',
        department: 'education',
        location: 'Центр детского творчества "Радуга", ул. Творческая, 12',
        date: '2024-07-05',
        time: '17:00',
        duration: 3,
        status: 'scheduled',
        requiredSkills: ['Рисование', 'Работа с детьми', 'Творческий подход', 'Организация занятий'],
        participants: 1,
        maxParticipants: 3,
        coordinator: 'Иванова Мария Сергеевна',
        priority: 'low',
        equipment: ['Краски', 'Кисти', 'Бумага', 'Прочие материалы для творчества']
      }
    ],
    training: {
      completed: [
        {
          id: 'train-006',
          name: 'Основы педагогики и возрастной психологии',
          category: 'education',
          duration: 12,
          completed: true,
          completionDate: '2024-03-20',
          description: 'Основные принципы педагогики и особенности развития детей разных возрастов'
        },
        {
          id: 'train-012',
          name: 'Методика преподавания иностранных языков детям',
          category: 'education',
          duration: 16,
          completed: true,
          completionDate: '2024-04-10',
          description: 'Современные методики преподавания иностранных языков для детской аудитории'
        }
      ],
      required: [
        {
          id: 'train-008',
          name: 'Безопасность детей и первая помощь',
          category: 'social',
          duration: 8,
          completed: false,
          description: 'Обеспечение безопасности детей и основы оказания первой помощи'
        },
        {
          id: 'train-013',
          name: 'Инклюзивное образование и работа с детьми с ОВЗ',
          category: 'education',
          duration: 10,
          completed: false,
          description: 'Принципы инклюзивного образования и особенности работы с детьми с ограниченными возможностями здоровья'
        }
      ],
      certifications: [
        'Сертификат о педагогической подготовке',
        'Сертификат преподавателя английского языка'
      ],
      upcoming: [
        {
          id: 'train-008',
          name: 'Безопасность детей и первая помощь',
          category: 'social',
          duration: 8,
          completed: false
        },
        {
          id: 'train-013',
          name: 'Инклюзивное образование и работа с детьми с ОВЗ',
          category: 'education',
          duration: 10,
          completed: false
        }
      ]
    },
    performance: {
      rating: 4.6,
      completedTasks: 8,
      reliability: 92,
      lastEvaluation: '2024-05-10',
      notes: 'Перспективная и талантливая волонтер, быстро обучается и проявляет инициативу. Отлично ладит с детьми, находит индивидуальный подход к каждому ребенку. Творческий подход к проведению занятий. Рекомендуется для работы в образовательных проектах и разработки учебных материалов.',
      strengths: [
        'Быстрая обучаемость',
        'Творческий подход',
        'Коммуникабельность',
        'Любовь к детям'
      ],
      areasForImprovement: [
        'Опыт работы в кризисных ситуациях',
        'Ведение документации',
        'Планирование долгосрочных программ'
      ]
    },
    loyalty: {
      level: 'new',
      points: 230,
      awards: [
        'Лучший новичок месяца - Апрель 2024'
      ],
      milestones: [
        {
          date: '2024-03-01',
          achievement: 'Начало волонтерской деятельности'
        },
        {
          date: '2024-04-15',
          achievement: 'Первое самостоятельное занятие'
        }
      ]
    }
  },
  {
    id: 'vol-004',
    personalInfo: {
      fullName: 'Петров Игорь Сергеевич',
      birthDate: '1985-03-14',
      gender: 'male',
      phone: '+7 (903) 456-78-90',
      email: 'i.petrov@example.ru',
      address: 'г. Москва, ул. Тверская, д. 10, кв. 34',
      skills: [
        'Медицинская помощь', 
        'Травматология', 
        'Организация медицинской службы', 
        'Управление проектами', 
        'Неотложная помощь',
        'Медицинская диагностика',
        'Координация emergency response',
        'Обучение первой помощи'
      ],
      education: 'Высшее медицинское образование, Российский национальный исследовательский медицинский университет им. Н.И. Пирогова',
      occupation: 'Врач-травматолог в городской клинической больнице №15',
      emergencyContact: {
        name: 'Петрова Елена Дмитриевна',
        phone: '+7 (903) 123-45-67',
        relationship: 'Жена'
      }
    },
    volunteerInfo: {
      joinDate: '2022-11-05',
      status: 'active',
      role: 'team_lead',
      department: 'medical',
      totalHours: 589,
      availability: {
        days: ['Суббота', 'Воскресенье', 'Понедельник'],
        timeSlots: ['09:00-15:00', '18:00-22:00'],
        flexible: true
      },
      preferences: {
        tasks: ['Медицинская помощь', 'Обучение первой помощи', 'Координация медицинских бригад', 'Экстренное реагирование'],
        locations: ['Медицинские учреждения', 'Общественные пространства', 'Места массовых мероприятий'],
        communication: 'in_person'
      }
    },
    assignments: [
      {
        id: 'assign-008',
        title: 'Медицинское обеспечение благотворительного марафона',
        description: 'Организация медицинской службы, оказание первой помощи и медицинский осмотр участников благотворительного марафона',
        department: 'medical',
        location: 'Спортивный комплекс "Лужники", центральный стадион',
        date: '2024-07-15',
        time: '08:00',
        duration: 8,
        status: 'scheduled',
        requiredSkills: ['Медицинская помощь', 'Травматология', 'Организация', 'Экстренное реагирование'],
        participants: 3,
        maxParticipants: 5,
        coordinator: 'Петров Игорь Сергеевич',
        specialRequirements: 'Наличие действующего медицинского образования и сертификата обязательно',
        priority: 'high',
        equipment: ['Аптечки первой помощи', 'Носилки', 'Дефибриллятор', 'Средства связи']
      }
    ],
    training: {
      completed: [
        {
          id: 'train-014',
          name: 'Неотложная медицинская помощь и экстренное реагирование',
          category: 'medical',
          duration: 36,
          completed: true,
          completionDate: '2022-12-10',
          certificate: 'MED-007890',
          description: 'Расширенный курс по оказанию неотложной медицинской помощи в экстремальных условиях'
        },
        {
          id: 'train-015',
          name: 'Организация медицинской службы на массовых мероприятиях',
          category: 'medical',
          duration: 24,
          completed: true,
          completionDate: '2023-01-20',
          certificate: 'MGT-004567',
          description: 'Планирование и организация работы медицинской службы на мероприятиях с большим количеством участников'
        }
      ],
      required: [],
      certifications: [
        'Врач-травматолог высшей категории',
        'Сертификат по неотложной медицинской помощи',
        'Инструктор по первой помощи',
        'Сертификат по организации медицинской службы'
      ],
      upcoming: []
    },
    performance: {
      rating: 4.9,
      completedTasks: 78,
      reliability: 98,
      lastEvaluation: '2024-04-28',
      notes: 'Высококвалифицированный специалист с исключительными профессиональными знаниями. Отличные организаторские способности и лидерские качества. Незаменимый член медицинской команды, способный работать в стрессовых ситуациях. Идеально подходит для координации сложных медицинских проектов.',
      strengths: [
        'Профессиональная экспертиза',
        'Организаторские способности',
        'Лидерские качества',
        'Стрессоустойчивость'
      ],
      areasForImprovement: [
        'Ведение электронной документации',
        'Менторство новых волонтеров'
      ]
    },
    loyalty: {
      level: 'leader',
      points: 3450,
      awards: [
        'Волонтер года - 2023',
        'За выдающиеся заслуги в медицинской помощи',
        'Лучший медицинский волонтер - 2022, 2023',
        'За спасение жизней на массовых мероприятиях'
      ],
      milestones: [
        {
          date: '2022-11-05',
          achievement: 'Начало волонтерской деятельности'
        },
        {
          date: '2023-03-10',
          achievement: 'Координация первой медицинской бригады'
        },
        {
          date: '2023-08-15',
          achievement: '500 часов волонтерской работы'
        },
        {
          date: '2023-12-20',
          achievement: 'Награда "Волонтер года"'
        },
        {
          date: '2024-02-01',
          achievement: '1000 часов волонтерской работы'
        }
      ]
    }
  }
];

// Компонент карточки волонтера
interface VolunteerCardProps {
  volunteer: Volunteer;
  onClick?: () => void;
  compact?: boolean;
}

const VolunteerCard: React.FC<VolunteerCardProps> = ({ volunteer, onClick, compact = false }) => {
  const getVolunteerColor = (status: string): string => {
    const colorMap: { [key: string]: string } = {
      'active': VOLUNTEER_COLORS.active,
      'inactive': VOLUNTEER_COLORS.inactive,
      'on_break': VOLUNTEER_COLORS.on_break,
      'training': VOLUNTEER_COLORS.training
    };
    return colorMap[status] || VOLUNTEER_COLORS.inactive;
  };

  const activeAssignmentsCount = volunteer.assignments.filter(
    a => a.status === 'scheduled' || a.status === 'in_progress'
  ).length;

  if (compact) {
    return (
      <BentoCard 
        className="p-4" 
        glowColor={getVolunteerColor(volunteer.volunteerInfo.status)} 
        onClick={onClick}
        padding="p-4"
      >
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${generateGradient(volunteer.personalInfo.fullName)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
            {getInitials(volunteer.personalInfo.fullName)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm truncate">{volunteer.personalInfo.fullName}</h4>
            <p className="text-slate-400 text-xs truncate">
              {getDepartmentName(volunteer.volunteerInfo.department)}
            </p>
          </div>
          <StatusBadge 
            status={volunteer.volunteerInfo.status} 
            animated={volunteer.volunteerInfo.status === 'active'}
            size="sm"
          />
        </div>
      </BentoCard>
    );
  }

  return (
    <BentoCard 
      className="p-5" 
      glowColor={getVolunteerColor(volunteer.volunteerInfo.status)} 
      onClick={onClick}
      padding="p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${generateGradient(volunteer.personalInfo.fullName)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
            {getInitials(volunteer.personalInfo.fullName)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{volunteer.personalInfo.fullName}</h4>
            <p className="text-slate-400 text-sm">
              {calculateAge(volunteer.personalInfo.birthDate)} лет • {volunteer.personalInfo.occupation}
            </p>
          </div>
        </div>
        <StatusBadge 
          status={volunteer.volunteerInfo.status} 
          animated={volunteer.volunteerInfo.status === 'active'}
          size="md"
        />
      </div>
      
      <div className="space-y-3 text-sm mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Роль:</span>
          <StatusBadge status={volunteer.volunteerInfo.role} size="sm" />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Отдел:</span>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getDepartmentIcon(volunteer.volunteerInfo.department)}</span>
            <StatusBadge status={volunteer.volunteerInfo.department} size="sm" />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Часы работы:</span>
          <span className="text-white font-medium">{volunteer.volunteerInfo.totalHours} ч</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Рейтинг:</span>
          <div className="flex items-center space-x-1">
            <span className="text-amber-500">★</span>
            <span className="text-white font-medium">{volunteer.performance.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <div className="text-xs text-slate-400">
          {activeAssignmentsCount} активных заданий
        </div>
        <div className={`text-xs font-semibold ${
          volunteer.performance.reliability >= 90 ? 'text-emerald-500' :
          volunteer.performance.reliability >= 80 ? 'text-amber-500' : 'text-rose-500'
        }`}>
          {volunteer.performance.reliability}% надежность
        </div>
      </div>
    </BentoCard>
  );
};

// Компонент карточки задания
interface AssignmentCardProps {
  assignment: VolunteerAssignment;
  onClick?: () => void;
  compact?: boolean;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment, onClick, compact = false }) => {
  const getAssignmentColor = (status: string): string => {
    const colorMap: { [key: string]: string } = {
      'scheduled': VOLUNTEER_COLORS.active,
      'in_progress': VOLUNTEER_COLORS.training,
      'completed': VOLUNTEER_COLORS.education,
      'cancelled': VOLUNTEER_COLORS.inactive
    };
    return colorMap[status] || VOLUNTEER_COLORS.inactive;
  };

  const participantPercentage = (assignment.participants / assignment.maxParticipants) * 100;

  if (compact) {
    return (
      <BentoCard className="p-3" glowColor={getAssignmentColor(assignment.status)} onClick={onClick} padding="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 mr-2">
            <h5 className="text-white font-semibold text-xs line-clamp-2">{assignment.title}</h5>
            <p className="text-slate-400 text-xs truncate">{assignment.location}</p>
          </div>
          <StatusBadge 
            status={assignment.status} 
            animated={assignment.status === 'scheduled' || assignment.status === 'in_progress'}
            size="sm"
          />
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">{formatDate(assignment.date)}</span>
          <span className="text-white">{assignment.participants}/{assignment.maxParticipants}</span>
        </div>
      </BentoCard>
    );
  }

  return (
    <BentoCard className="p-4" glowColor={getAssignmentColor(assignment.status)} onClick={onClick} padding="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <h5 className="text-white font-semibold text-sm mb-1 line-clamp-2">{assignment.title}</h5>
          <p className="text-slate-400 text-xs">{assignment.location}</p>
        </div>
        <StatusBadge 
          status={assignment.status} 
          animated={assignment.status === 'scheduled' || assignment.status === 'in_progress'}
          size="sm"
        />
      </div>
      
      <div className="space-y-2 text-xs mb-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Дата:</span>
          <span className="text-white">{formatDate(assignment.date)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Время:</span>
          <span className="text-white">{assignment.time}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Длительность:</span>
          <span className="text-white">{assignment.duration} ч</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Участники:</span>
          <div className="flex items-center space-x-2">
            <span className="text-white text-xs">{assignment.participants}/{assignment.maxParticipants}</span>
            <div className="w-16 bg-slate-700 rounded-full h-1.5">
              <motion.div 
                className="bg-emerald-500 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${participantPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-700/50">
        {assignment.requiredSkills.slice(0, 2).map((skill, index) => (
          <span key={index} className="text-xs text-slate-400 bg-white/5 rounded-full px-2 py-0.5">
            {skill}
          </span>
        ))}
        {assignment.requiredSkills.length > 2 && (
          <span className="text-xs text-slate-400">+{assignment.requiredSkills.length - 2}</span>
        )}
      </div>
    </BentoCard>
  );
};

// Компонент поиска и фильтров
interface SearchAndFiltersProps {
  onSearchChange: (query: string) => void;
  onDepartmentChange: (department: string) => void;
  onStatusChange: (status: string) => void;
  onSortChange: (sort: string) => void;
  searchQuery: string;
  departmentFilter: string;
  statusFilter: string;
  sortBy: string;
  totalResults: number;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({ 
  onSearchChange, 
  onDepartmentChange, 
  onStatusChange,
  onSortChange,
  searchQuery,
  departmentFilter,
  statusFilter,
  sortBy,
  totalResults
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 mb-6">
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск волонтеров по имени, навыкам или профессии..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10 transition-all duration-300"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        <select 
          value={departmentFilter}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        >
          <option value="all">Все отделы</option>
          <option value="medical">Медицинский</option>
          <option value="education">Образовательный</option>
          <option value="logistics">Логистика</option>
          <option value="social">Социальный</option>
          <option value="events">Мероприятия</option>
          <option value="fundraising">Фандрайзинг</option>
        </select>
        
        <select 
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        >
          <option value="all">Все статусы</option>
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
          <option value="on_break">На перерыве</option>
          <option value="training">На обучении</option>
        </select>

        <select 
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        >
          <option value="name">По имени</option>
          <option value="rating">По рейтингу</option>
          <option value="hours">По часам</option>
          <option value="recent">По дате присоединения</option>
        </select>

        <div className="text-slate-400 text-sm hidden lg:block">
          Найдено: {totalResults}
        </div>
      </div>
    </div>
  );
};

// Основной компонент дашборда волонтеров
const VolunteerManagementDashboard: React.FC = () => {
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<VolunteerAssignment | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'volunteers' | 'assignments' | 'training'>('overview');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
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
    const totalVolunteers = volunteers.length;
    const activeVolunteers = volunteers.filter(v => v.volunteerInfo.status === 'active').length;
    const totalHours = volunteers.reduce((acc, volunteer) => acc + volunteer.volunteerInfo.totalHours, 0);
    const activeAssignments = volunteers.flatMap(v => v.assignments).filter(a => a.status === 'scheduled' || a.status === 'in_progress').length;
    const departments = [...new Set(volunteers.map(v => v.volunteerInfo.department))];
    const totalCompletedTasks = volunteers.reduce((acc, volunteer) => acc + volunteer.performance.completedTasks, 0);
    const averageRating = volunteers.reduce((acc, volunteer) => acc + volunteer.performance.rating, 0) / volunteers.length;
    
    return {
      totalVolunteers,
      activeVolunteers,
      totalHours,
      activeAssignments,
      departments,
      totalCompletedTasks,
      averageRating: parseFloat(averageRating.toFixed(1))
    };
  }, []);

  // Фильтрация и сортировка данных
  const filteredVolunteers = useMemo(() => {
    let filtered = volunteers.filter(volunteer => {
      const departmentMatch = filterDepartment === 'all' || volunteer.volunteerInfo.department === filterDepartment;
      const statusMatch = filterStatus === 'all' || volunteer.volunteerInfo.status === filterStatus;
      const searchMatch = searchQuery === '' || 
        volunteer.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        volunteer.personalInfo.occupation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        volunteer.personalInfo.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return departmentMatch && statusMatch && searchMatch;
    });

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.performance.rating - a.performance.rating;
        case 'hours':
          return b.volunteerInfo.totalHours - a.volunteerInfo.totalHours;
        case 'recent':
          return new Date(b.volunteerInfo.joinDate).getTime() - new Date(a.volunteerInfo.joinDate).getTime();
        case 'name':
        default:
          return a.personalInfo.fullName.localeCompare(b.personalInfo.fullName);
      }
    });

    return filtered;
  }, [filterDepartment, filterStatus, searchQuery, sortBy]);

  const allAssignments = useMemo(() => 
    volunteers.flatMap(volunteer => volunteer.assignments), 
  []);

  const upcomingAssignments = useMemo(() => 
    allAssignments.filter(assignment => assignment.status === 'scheduled' || assignment.status === 'in_progress'),
  [allAssignments]);

  const completedAssignments = useMemo(() =>
    allAssignments.filter(assignment => assignment.status === 'completed'),
  [allAssignments]);

  // Анимация появления элементов
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
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const handleVolunteerClick = useCallback((volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
  }, []);

  const handleAssignmentClick = useCallback((assignment: VolunteerAssignment) => {
    setSelectedAssignment(assignment);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedVolunteer(null);
    setSelectedAssignment(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-4 lg:p-6">
      {/* Глобальные стили для кастомного скроллбара */}
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
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        .animate-shine {
          animation: shine 3s infinite;
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
              Управление волонтерами
            </h1>
            <p className="text-slate-400 text-lg">Координация и мониторинг волонтерской деятельности</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="flex flex-wrap gap-2">
              <motion.button 
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-emerald-500/25"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Новый волонтер</span>
              </motion.button>
              <motion.button 
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-blue-500/25"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Создать задание</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Навигация */}
        <nav className="flex space-x-1 p-1 bg-slate-800/50 rounded-2xl backdrop-blur-xl border border-slate-700/50 mb-4">
          {[
            { id: 'overview', label: 'Обзор', icon: '📊' },
            { id: 'volunteers', label: 'Волонтеры', icon: '👥' },
            { id: 'assignments', label: 'Задания', icon: '📋' },
            { id: 'training', label: 'Обучение', icon: '🎓' }
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
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* Поиск и фильтры */}
        {(activeTab === 'volunteers' || activeTab === 'assignments') && (
          <SearchAndFilters
            onSearchChange={setSearchQuery}
            onDepartmentChange={setFilterDepartment}
            onStatusChange={setFilterStatus}
            onSortChange={setSortBy}
            searchQuery={searchQuery}
            departmentFilter={filterDepartment}
            statusFilter={filterStatus}
            sortBy={sortBy}
            totalResults={filteredVolunteers.length}
          />
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
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <StatCard
                    title="Всего волонтеров"
                    value={stats.totalVolunteers}
                    change={8.2}
                    icon="👥"
                    color={VOLUNTEER_COLORS.active}
                    subtitle={`${stats.activeVolunteers} активных`}
                    trend="up"
                    loading={isLoading}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <StatCard
                    title="Общее время работы"
                    value={`${stats.totalHours} ч`}
                    change={12.5}
                    icon="⏱️"
                    color={VOLUNTEER_COLORS.education}
                    subtitle="волонтерских часов"
                    trend="up"
                    loading={isLoading}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <StatCard
                    title="Активные задания"
                    value={stats.activeAssignments}
                    change={-2.1}
                    icon="📋"
                    color={VOLUNTEER_COLORS.logistics}
                    subtitle="требуют выполнения"
                    trend="down"
                    loading={isLoading}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <StatCard
                    title="Средний рейтинг"
                    value={stats.averageRating}
                    change={3.2}
                    icon="⭐"
                    color={VOLUNTEER_COLORS.amber}
                    subtitle="из 5 баллов"
                    trend="up"
                    loading={isLoading}
                  />
                </motion.div>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Активные волонтеры */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.active}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Лучшие волонтеры</h3>
                      <button className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-300">
                        Все →
                      </button>
                    </div>
                    <div className="space-y-4">
                      {volunteers
                        .filter(v => v.volunteerInfo.status === 'active')
                        .sort((a, b) => b.performance.rating - a.performance.rating)
                        .slice(0, 4)
                        .map((volunteer, index) => (
                        <motion.div 
                          key={volunteer.id}
                          className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                          onClick={() => handleVolunteerClick(volunteer)}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="relative">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${generateGradient(volunteer.personalInfo.fullName)} flex items-center justify-center text-white font-bold text-sm`}>
                              {getInitials(volunteer.personalInfo.fullName)}
                            </div>
                            {index < 3 && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-xs text-white">
                                {index + 1}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm truncate">{volunteer.personalInfo.fullName}</h4>
                            <p className="text-slate-400 text-xs">
                              {getDepartmentName(volunteer.volunteerInfo.department)} • {volunteer.volunteerInfo.role}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-amber-500">★</span>
                            <span className="text-white text-sm font-medium">{volunteer.performance.rating}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </BentoCard>
                </motion.div>

                {/* Ближайшие задания */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.logistics}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Ближайшие задания</h3>
                      <button className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-300">
                        Все →
                      </button>
                    </div>
                    <div className="space-y-4">
                      {upcomingAssignments
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .slice(0, 4)
                        .map((assignment, index) => (
                        <motion.div 
                          key={assignment.id}
                          className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                          onClick={() => handleAssignmentClick(assignment)}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            assignment.status === 'scheduled' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                            'bg-gradient-to-br from-orange-500 to-amber-500'
                          }`}>
                            {assignment.title[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm line-clamp-2">{assignment.title}</h4>
                            <p className="text-slate-400 text-xs">
                              {formatDate(assignment.date)} в {assignment.time}
                            </p>
                          </div>
                          <StatusBadge status={assignment.status} size="sm" />
                        </motion.div>
                      ))}
                    </div>
                  </BentoCard>
                </motion.div>
              </div>

              {/* Отделы и распределение */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.coordinator}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Распределение по отделам</h3>
                    <div className="text-slate-400 text-sm">
                      Всего отделов: {stats.departments.length}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {stats.departments.map((department, index) => {
                      const deptVolunteers = volunteers.filter(v => v.volunteerInfo.department === department);
                      const activeDeptVolunteers = deptVolunteers.filter(v => v.volunteerInfo.status === 'active');
                      const totalHours = deptVolunteers.reduce((acc, v) => acc + v.volunteerInfo.totalHours, 0);
                      const completionRate = deptVolunteers.length > 0 
                        ? (deptVolunteers.filter(v => v.assignments.some(a => a.status === 'completed')).length / deptVolunteers.length) * 100
                        : 0;
                      
                      return (
                        <motion.div 
                          key={department} 
                          className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                          onClick={() => {
                            setActiveTab('volunteers');
                            setFilterDepartment(department);
                          }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                            {getDepartmentIcon(department)}
                          </div>
                          <h4 className="text-white font-medium text-sm capitalize mb-1">{getDepartmentName(department)}</h4>
                          <p className="text-slate-400 text-xs mb-1">
                            {activeDeptVolunteers.length}/{deptVolunteers.length} активных
                          </p>
                          <p className="text-slate-400 text-xs mb-2">
                            {totalHours} ч
                          </p>
                          <ProgressBar 
                            value={completionRate} 
                            size="sm" 
                            showValue={false}
                            color={VOLUNTEER_COLORS.success}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </BentoCard>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'volunteers' && (
            <motion.div
              key="volunteers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Волонтеры</h2>
                <p className="text-slate-400">Управление волонтерами и их активностью</p>
              </div>
              
              {filteredVolunteers.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredVolunteers.map((volunteer, index) => (
                    <motion.div 
                      key={volunteer.id} 
                      variants={itemVariants}
                      custom={index}
                    >
                      <VolunteerCard 
                        volunteer={volunteer} 
                        onClick={() => handleVolunteerClick(volunteer)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl text-slate-300 mb-2">Волонтеры не найдены</h3>
                  <p className="text-slate-400 mb-6">Попробуйте изменить параметры поиска или фильтры</p>
                  <motion.button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterDepartment('all');
                      setFilterStatus('all');
                    }}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Сбросить фильтры
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'assignments' && (
            <motion.div
              key="assignments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Задания волонтеров</h2>
                <p className="text-slate-400">Управление заданиями и распределением</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Предстоящие ({upcomingAssignments.length})
                  </h3>
                  <div className="space-y-4">
                    {upcomingAssignments.length > 0 ? (
                      upcomingAssignments.map((assignment, index) => (
                        <motion.div
                          key={assignment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <AssignmentCard 
                            assignment={assignment} 
                            onClick={() => handleAssignmentClick(assignment)}
                          />
                        </motion.div>
                      ))
                    ) : (
                      <BentoCard className="p-6 text-center" glowColor={VOLUNTEER_COLORS.slate}>
                        <div className="text-4xl mb-2">📋</div>
                        <p className="text-slate-400 text-sm">Нет предстоящих заданий</p>
                      </BentoCard>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                    Выполненные ({completedAssignments.length})
                  </h3>
                  <div className="space-y-4">
                    {completedAssignments.slice(0, 5).map((assignment, index) => (
                      <motion.div
                        key={assignment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <AssignmentCard 
                          assignment={assignment} 
                          onClick={() => handleAssignmentClick(assignment)}
                        />
                      </motion.div>
                    ))}
                    {completedAssignments.length === 0 && (
                      <BentoCard className="p-6 text-center" glowColor={VOLUNTEER_COLORS.slate}>
                        <div className="text-4xl mb-2">✅</div>
                        <p className="text-slate-400 text-sm">Нет выполненных заданий</p>
                      </BentoCard>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                    Статистика заданий
                  </h3>
                  <BentoCard className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Всего заданий:</span>
                        <span className="text-white font-semibold">{allAssignments.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Предстоящие:</span>
                        <span className="text-blue-400 font-semibold">{upcomingAssignments.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Выполненные:</span>
                        <span className="text-emerald-400 font-semibold">{completedAssignments.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">В процессе:</span>
                        <span className="text-amber-400 font-semibold">
                          {allAssignments.filter(a => a.status === 'in_progress').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Отмененные:</span>
                        <span className="text-rose-400 font-semibold">
                          {allAssignments.filter(a => a.status === 'cancelled').length}
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-700/50">
                      <ProgressBar 
                        value={(completedAssignments.length / allAssignments.length) * 100} 
                        label="Общий процент выполнения"
                        color={VOLUNTEER_COLORS.success}
                      />
                    </div>
                  </BentoCard>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'training' && (
            <motion.div
              key="training"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Обучение и сертификация</h2>
                <p className="text-slate-400">Управление обучением и квалификацией волонтеров</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Волонтеры на обучении */}
                <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.training}>
                  <h3 className="text-xl font-bold text-white mb-6">Волонтеры на обучении</h3>
                  <div className="space-y-4">
                    {volunteers
                      .filter(v => v.volunteerInfo.status === 'training')
                      .map((volunteer, index) => (
                      <motion.div 
                        key={volunteer.id}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                        onClick={() => handleVolunteerClick(volunteer)}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${generateGradient(volunteer.personalInfo.fullName)} flex items-center justify-center text-white font-bold text-sm`}>
                          {getInitials(volunteer.personalInfo.fullName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm truncate">{volunteer.personalInfo.fullName}</h4>
                          <p className="text-slate-400 text-xs">
                            Осталось пройти: {volunteer.training.required.length} курсов
                          </p>
                        </div>
                        <ProgressBar 
                          value={((volunteer.training.completed.length) / (volunteer.training.completed.length + volunteer.training.required.length)) * 100} 
                          size="sm"
                          showValue={false}
                          color={VOLUNTEER_COLORS.training}
                        />
                      </motion.div>
                    ))}
                    {volunteers.filter(v => v.volunteerInfo.status === 'training').length === 0 && (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">🎓</div>
                        <p className="text-slate-400 text-sm">Нет волонтеров на обучении</p>
                      </div>
                    )}
                  </div>
                </BentoCard>

                {/* Предстоящие тренинги */}
                <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.education}>
                  <h3 className="text-xl font-bold text-white mb-6">Предстоящие тренинги</h3>
                  <div className="space-y-4">
                    {volunteers
                      .flatMap(v => v.training.required)
                      .filter(training => !training.completed)
                      .slice(0, 5)
                      .map((training, index) => (
                      <motion.div 
                        key={`${training.id}-${index}`} 
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                        whileHover={{ scale: 1.02, y: -2 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm truncate">{training.name}</h4>
                          <p className="text-slate-400 text-xs">
                            {getDepartmentName(training.category)} • {training.duration} часов
                          </p>
                        </div>
                        <span className="text-blue-400 text-xs font-medium bg-blue-500/20 px-2 py-1 rounded-full">
                          Требуется
                        </span>
                      </motion.div>
                    ))}
                    {volunteers.flatMap(v => v.training.required).filter(t => !t.completed).length === 0 && (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">✅</div>
                        <p className="text-slate-400 text-sm">Все тренинги пройдены</p>
                      </div>
                    )}
                  </div>
                </BentoCard>
              </div>

              {/* Статистика обучения */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <BentoCard className="p-6 text-center" glowColor={VOLUNTEER_COLORS.medical}>
                  <div className="text-3xl mb-2">📚</div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {volunteers.flatMap(v => v.training.completed).length}
                  </div>
                  <div className="text-slate-400 text-sm">Пройдено курсов</div>
                </BentoCard>

                <BentoCard className="p-6 text-center" glowColor={VOLUNTEER_COLORS.fundraising}>
                  <div className="text-3xl mb-2">🎓</div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {volunteers.flatMap(v => v.training.required).filter(t => !t.completed).length}
                  </div>
                  <div className="text-slate-400 text-sm">Требуется пройти</div>
                </BentoCard>

                <BentoCard className="p-6 text-center" glowColor={VOLUNTEER_COLORS.social}>
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {volunteers.filter(v => v.training.required.length === 0).length}
                  </div>
                  <div className="text-slate-400 text-sm">Полностью обучены</div>
                </BentoCard>
              </div>

              {/* Сертификации */}
              <BentoCard className="p-6 mt-6" glowColor={VOLUNTEER_COLORS.purple}>
                <h3 className="text-xl font-bold text-white mb-6">Сертификации и квалификации</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from(new Set(volunteers.flatMap(v => v.training.certifications))).map((certification, index) => (
                    <motion.div
                      key={certification}
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-emerald-400 text-sm">✓</span>
                        </div>
                        <span className="text-white text-sm font-medium">{certification}</span>
                      </div>
                      <div className="text-slate-400 text-xs mt-1">
                        {volunteers.filter(v => v.training.certifications.includes(certification)).length} волонтеров
                      </div>
                    </motion.div>
                  ))}
                </div>
              </BentoCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Модальные окна */}
      <Modal 
        isOpen={!!selectedVolunteer} 
        onClose={handleCloseModal}
        title={selectedVolunteer?.personalInfo.fullName}
        size="xl"
      >
        {selectedVolunteer && (
          <div className="space-y-6">
            {/* Основная информация */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.active}>
                    <h4 className="text-lg font-semibold text-white mb-4">Персональная информация</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Дата рождения:</span>
                        <span className="text-white">{formatDate(selectedVolunteer.personalInfo.birthDate)} ({calculateAge(selectedVolunteer.personalInfo.birthDate)} лет)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Телефон:</span>
                        <span className="text-white">{selectedVolunteer.personalInfo.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="text-white">{selectedVolunteer.personalInfo.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Адрес:</span>
                        <span className="text-white text-right">{selectedVolunteer.personalInfo.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Профессия:</span>
                        <span className="text-white">{selectedVolunteer.personalInfo.occupation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Образование:</span>
                        <span className="text-white text-right">{selectedVolunteer.personalInfo.education || 'Не указано'}</span>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.coordinator}>
                    <h4 className="text-lg font-semibold text-white mb-4">Волонтерская информация</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Статус:</span>
                        <StatusBadge status={selectedVolunteer.volunteerInfo.status} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Роль:</span>
                        <StatusBadge status={selectedVolunteer.volunteerInfo.role} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Отдел:</span>
                        <StatusBadge status={selectedVolunteer.volunteerInfo.department} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Волонтер с:</span>
                        <span className="text-white">{formatDate(selectedVolunteer.volunteerInfo.joinDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Всего часов:</span>
                        <span className="text-white font-semibold">{selectedVolunteer.volunteerInfo.totalHours} ч</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Уровень лояльности:</span>
                        <StatusBadge status={selectedVolunteer.loyalty.level} />
                      </div>
                    </div>
                  </BentoCard>
                </div>

                <BentoCard className="p-6 mt-6" glowColor={VOLUNTEER_COLORS.education}>
                  <h4 className="text-lg font-semibold text-white mb-4">Навыки и умения</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVolunteer.personalInfo.skills.map((skill, index) => (
                      <motion.span 
                        key={index}
                        className="text-xs text-slate-300 bg-white/10 rounded-full px-3 py-1.5 border border-slate-600/50 hover:bg-white/20 transition-colors duration-300 cursor-default"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </BentoCard>
              </div>

              <div className="space-y-6">
                <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.medical}>
                  <h4 className="text-lg font-semibold text-white mb-4">Производительность</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Рейтинг:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-amber-500">★</span>
                        <span className="text-white font-semibold">{selectedVolunteer.performance.rating}/5</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Выполнено заданий:</span>
                      <span className="text-white">{selectedVolunteer.performance.completedTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Надежность:</span>
                      <span className="text-white">{selectedVolunteer.performance.reliability}%</span>
                    </div>
                    {selectedVolunteer.performance.lastEvaluation && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Последняя оценка:</span>
                        <span className="text-white">{formatDate(selectedVolunteer.performance.lastEvaluation)}</span>
                      </div>
                    )}
                  </div>
                </BentoCard>

                <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.fundraising}>
                  <h4 className="text-lg font-semibold text-white mb-4">Сильные стороны</h4>
                  <div className="space-y-2">
                    {selectedVolunteer.performance.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <span className="text-emerald-400">✓</span>
                        <span className="text-slate-300">{strength}</span>
                      </div>
                    ))}
                  </div>
                </BentoCard>

                <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.orange}>
                  <h4 className="text-lg font-semibold text-white mb-4">Зоны развития</h4>
                  <div className="space-y-2">
                    {selectedVolunteer.performance.areasForImprovement.map((area, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <span className="text-amber-400">↗</span>
                        <span className="text-slate-300">{area}</span>
                      </div>
                    ))}
                  </div>
                </BentoCard>
              </div>
            </div>

            {/* Текущие задания */}
            <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.logistics}>
              <h4 className="text-lg font-semibold text-white mb-4">Текущие задания</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedVolunteer.assignments
                  .filter(a => a.status === 'scheduled' || a.status === 'in_progress')
                  .map((assignment) => (
                  <AssignmentCard 
                    key={assignment.id} 
                    assignment={assignment} 
                    onClick={() => setSelectedAssignment(assignment)}
                  />
                ))}
                {selectedVolunteer.assignments.filter(a => a.status === 'scheduled' || a.status === 'in_progress').length === 0 && (
                  <div className="col-span-2 text-center py-4">
                    <p className="text-slate-400">Нет текущих заданий</p>
                  </div>
                )}
              </div>
            </BentoCard>

            {/* Обучение и сертификации */}
            <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.training}>
              <h4 className="text-lg font-semibold text-white mb-4">Обучение и сертификации</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-white font-medium mb-3">Пройденные курсы</h5>
                  <div className="space-y-2">
                    {selectedVolunteer.training.completed.map((training, index) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                        <span className="text-slate-300 text-sm">{training.name}</span>
                        <span className="text-emerald-400 text-xs">{training.duration}ч</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-white font-medium mb-3">Сертификации</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedVolunteer.training.certifications.map((cert, index) => (
                      <span key={index} className="text-xs text-slate-300 bg-white/10 rounded-full px-3 py-1.5">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </BentoCard>

            {selectedVolunteer.performance.notes && (
              <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.social}>
                <h4 className="text-lg font-semibold text-white mb-4">Примечания координатора</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedVolunteer.performance.notes}</p>
              </BentoCard>
            )}

            {selectedVolunteer.personalInfo.emergencyContact && (
              <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.error}>
                <h4 className="text-lg font-semibold text-white mb-4">Экстренный контакт</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Имя:</span>
                    <span className="text-white">{selectedVolunteer.personalInfo.emergencyContact.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Телефон:</span>
                    <span className="text-white">{selectedVolunteer.personalInfo.emergencyContact.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Отношение:</span>
                    <span className="text-white">{selectedVolunteer.personalInfo.emergencyContact.relationship}</span>
                  </div>
                </div>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!selectedAssignment} 
        onClose={handleCloseModal}
        title="Информация о задании"
        size="lg"
      >
        {selectedAssignment && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.active}>
                <h4 className="text-lg font-semibold text-white mb-4">Основная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Название:</span>
                    <span className="text-white font-medium">{selectedAssignment.title}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400">Описание:</span>
                    <span className="text-white text-right max-w-xs">{selectedAssignment.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Отдел:</span>
                    <StatusBadge status={selectedAssignment.department} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedAssignment.status} />
                  </div>
                  {selectedAssignment.priority && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Приоритет:</span>
                      <StatusBadge 
                        status={selectedAssignment.priority} 
                        animated={selectedAssignment.priority === 'high'}
                      />
                    </div>
                  )}
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.logistics}>
                <h4 className="text-lg font-semibold text-white mb-4">Детали задания</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дата:</span>
                    <span className="text-white">{formatDate(selectedAssignment.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Время:</span>
                    <span className="text-white">{selectedAssignment.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Длительность:</span>
                    <span className="text-white">{selectedAssignment.duration} часов</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400">Местоположение:</span>
                    <span className="text-white text-right max-w-xs">{selectedAssignment.location}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.education}>
                <h4 className="text-lg font-semibold text-white mb-4">Участники</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Текущие/Максимум:</span>
                    <span className="text-white font-medium">{selectedAssignment.participants}/{selectedAssignment.maxParticipants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Координатор:</span>
                    <span className="text-white">{selectedAssignment.coordinator}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <ProgressBar 
                    value={(selectedAssignment.participants / selectedAssignment.maxParticipants) * 100} 
                    label="Заполненность группы"
                    color={VOLUNTEER_COLORS.active}
                  />
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.medical}>
                <h4 className="text-lg font-semibold text-white mb-4">Требуемые навыки</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAssignment.requiredSkills.map((skill, index) => (
                    <motion.span 
                      key={index}
                      className="text-xs text-slate-300 bg-white/10 rounded-full px-3 py-1.5 border border-slate-600/50 hover:bg-white/20 transition-colors duration-300 cursor-default"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </BentoCard>
            </div>

            {selectedAssignment.specialRequirements && (
              <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.fundraising}>
                <h4 className="text-lg font-semibold text-white mb-4">Особые требования</h4>
                <p className="text-slate-300 text-sm">{selectedAssignment.specialRequirements}</p>
              </BentoCard>
            )}

            {selectedAssignment.equipment && selectedAssignment.equipment.length > 0 && (
              <BentoCard className="p-6" glowColor={VOLUNTEER_COLORS.events}>
                <h4 className="text-lg font-semibold text-white mb-4">Необходимое оборудование</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAssignment.equipment.map((item, index) => (
                    <span key={index} className="text-xs text-slate-300 bg-white/10 rounded-full px-3 py-1.5">
                      {item}
                    </span>
                  ))}
                </div>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VolunteerManagementDashboard;