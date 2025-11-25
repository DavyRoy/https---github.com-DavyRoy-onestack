'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

// Цвета из базы граждан
const COLORS = {
  primary: 'from-gray-950 via-black to-gray-900',
  secondary: 'from-purple-900 via-black to-blue-900',
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

const DEFAULT_PARTICLE_COUNT = 16;
const DEFAULT_SPOTLIGHT_RADIUS = 400;
const DEFAULT_GLOW_COLOR = '59, 130, 246';
const MOBILE_BREAKPOINT = 768;

// Хук для определения мобильных устройств
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

// Хук для блокировки прокрутки
const useScrollLock = () => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
};

const useLockScroll = (shouldLock: boolean) => {
  useEffect(() => {
    if (shouldLock) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [shouldLock]);
};

// Компонент прогресс-бара
const ProgressBar = ({
  value,
  max = 100,
  color = '#3B82F6',
  label = '',
  showLabel = true,
  height = '8px'
}: {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  showLabel?: boolean;
  height?: string;
}) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="w-full">
      {showLabel && label && (
        <div className="flex justify-between text-white text-[11px] sm:text-xs mb-1.5">
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-white/8 rounded-full overflow-hidden" style={{ height }}>
        <motion.div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}40`
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.15 }}
        />
      </div>
    </div>
  );
};

// Модальное окно
const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'md'
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  useLockScroll(isOpen);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            className={`bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden shadow-2xl`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            )}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Карточка с частицами
const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  onCardClick?: () => void;
}> = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = true,
  enableMagnetism = true,
  onCardClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          particle.remove();
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const createParticleElement = useCallback((x: number, y: number, color: string = glowColor): HTMLDivElement => {
    const el = document.createElement('div');
    el.className = 'profile-particle';
    el.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(${color}, 1) 0%, rgba(${color}, 0.4) 70%);
      box-shadow: 0 0 12px rgba(${color}, 0.8), 0 0 24px rgba(${color}, 0.4);
      pointer-events: none;
      z-index: 100;
      left: ${x}px;
      top: ${y}px;
      filter: blur(0.6px);
    `;
    return el;
  }, [glowColor]);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current || isMobile) return;

    const rect = cardRef.current.getBoundingClientRect();

    for (let i = 0; i < particleCount; i++) {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        const particle = createParticleElement(x, y, glowColor);
        cardRef.current.appendChild(particle);
        particlesRef.current.push(particle);

        gsap.fromTo(
          particle,
          {
            scale: 0,
            opacity: 0,
            x: 0,
            y: 0,
            rotation: 0
          },
          {
            scale: 1.5,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(2)'
          }
        );

        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 40;
        const duration = 2 + Math.random() * 2;

        gsap.to(particle, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          rotation: 360,
          duration: duration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });

        gsap.to(particle, {
          opacity: 0.3,
          duration: duration * 0.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });

      }, i * 60);

      timeoutsRef.current.push(timeoutId);
    }
  }, [particleCount, glowColor, isMobile, createParticleElement]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const handleMouseEnter = () => {
      if (isTouchDevice || isMobile) return;
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 2,
          rotateY: 2,
          scale: 1.02,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 800
        });
      }

      gsap.to(element, {
        '--glow-intensity': 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      if (isTouchDevice || isMobile) return;
      isHoveredRef.current = false;
      clearAllParticles();

      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out'
      });

      gsap.to(element, {
        '--glow-intensity': 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt || isTouchDevice || isMobile) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      gsap.to(element, {
        rotateX,
        rotateY,
        duration: 0.1,
        ease: 'power1.out',
        transformPerspective: 800
      });

      element.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
      element.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
    };

    const handleClick = (e: MouseEvent) => {
      if (clickEffect && !isMobile && !isTouchDevice) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle, 
            rgba(${glowColor}, 0.6) 0%, 
            rgba(${glowColor}, 0.3) 40%, 
            rgba(${glowColor}, 0.1) 60%,
            transparent 80%
          );
          left: ${x - 50}px;
          top: ${y - 50}px;
          pointer-events: none;
          z-index: 1000;
          mix-blend-mode: screen;
        `;

        element.appendChild(ripple);

        gsap.fromTo(
          ripple,
          {
            scale: 0,
            opacity: 1
          },
          {
            scale: 3,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => ripple.remove()
          }
        );
      }

      if (onCardClick) {
        onCardClick();
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [disableAnimations, enableTilt, clickEffect, glowColor, onCardClick, animateParticles, clearAllParticles, isMobile]);

  return (
    <motion.div
      ref={cardRef}
      className={`${className} card relative overflow-hidden cursor-pointer touch-manipulation card--border-glow`}
      style={{
        ...style,
        position: 'relative',
        overflow: 'hidden',
        transformStyle: 'preserve-3d'
      }}
      whileHover={!isMobile ? { y: -4 } : {}}
      whileTap={isMobile ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};

// Типы данных для менеджера
interface ProfileMetric {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  description: string;
  icon: string;
  color: string;
  progress?: number;
  suffix?: string;
}

interface TeamActivity {
  member: string;
  role: string;
  tasks: number;
  completed: number;
  efficiency: number;
  status: 'online' | 'busy' | 'offline';
  avatar: string;
}

interface RecentTask {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  dueDate: string;
  assignee: string;
  progress: number;
}

interface PerformanceMetric {
  period: string;
  tasksCompleted: number;
  responseTime: string;
  satisfaction: number;
  efficiency: number;
}

// Моки данных для менеджера
const profileData = {
  name: 'Петрова Анна Сергеевна',
  role: 'Менеджер социальной службы',
  email: 'manager@social-service.ru',
  phone: '+7 (912) 345-67-90',
  department: 'Отдел социальной поддержки',
  location: 'Москва, Россия',
  avatar: '👩‍💼',
  joinDate: '20 января 2023',
  status: 'active',
  bio: 'Старший менеджер по социальной работе. Координирую работу команды волонтеров и кураторов, отвечаю за распределение заявок и контроль качества услуг.',
  team: 'Команда "Социальная поддержка"',
  subordinates: 8
};

const profileMetrics: ProfileMetric[] = [
  { 
    label: "Активных заявок", 
    value: 24, 
    change: 8, 
    trend: 'up', 
    description: "Требуют обработки", 
    icon: "📥", 
    color: COLORS.blue
  },
  { 
    label: "Выполнено сегодня", 
    value: 12, 
    change: 15, 
    trend: 'up', 
    description: "Завершенные задачи", 
    icon: "✅", 
    color: COLORS.success
  },
  { 
    label: "Команда онлайн", 
    value: 6, 
    change: -2, 
    trend: 'down', 
    description: "Активные сотрудники", 
    icon: "👥", 
    color: COLORS.purple
  },
  { 
    label: "Эффективность", 
    value: 87, 
    suffix: "%", 
    change: 5, 
    trend: 'up', 
    description: "Показатель за неделю", 
    icon: "📊", 
    color: COLORS.orange,
    progress: 87
  },
  { 
    label: "Среднее время ответа", 
    value: 2.4, 
    suffix: "ч", 
    change: -12, 
    trend: 'down', 
    description: "На запросы пользователей", 
    icon: "⏱️", 
    color: COLORS.cyan
  },
  { 
    label: "Удовлетворенность", 
    value: 4.8, 
    change: 3, 
    trend: 'up', 
    description: "Оценка клиентов", 
    icon: "⭐", 
    color: COLORS.warning
  },
];

const teamActivity: TeamActivity[] = [
  { member: 'Иванов А.В.', role: 'Куратор', tasks: 15, completed: 12, efficiency: 92, status: 'online', avatar: '👨‍💼' },
  { member: 'Смирнова К.Д.', role: 'Волонтер', tasks: 8, completed: 7, efficiency: 88, status: 'online', avatar: '👩‍💼' },
  { member: 'Козлов М.П.', role: 'Соцработник', tasks: 12, completed: 10, efficiency: 95, status: 'busy', avatar: '👨‍💼' },
  { member: 'Никитина О.Л.', role: 'Координатор', tasks: 6, completed: 5, efficiency: 83, status: 'online', avatar: '👩‍💼' },
  { member: 'Федоров С.М.', role: 'Волонтер', tasks: 10, completed: 8, efficiency: 90, status: 'offline', avatar: '👨‍💼' },
];

const recentTasks: RecentTask[] = [
  { id: '1', title: 'Проверка заявки #2345', priority: 'high', status: 'pending', dueDate: 'Сегодня, 18:00', assignee: 'Иванов А.В.', progress: 0 },
  { id: '2', title: 'Координация выезда волонтеров', priority: 'medium', status: 'in_progress', dueDate: 'Завтра, 10:00', assignee: 'Смирнова К.Д.', progress: 60 },
  { id: '3', title: 'Отчет по выполненным услугам', priority: 'low', status: 'completed', dueDate: 'Вчера, 16:00', assignee: 'Петрова А.С.', progress: 100 },
  { id: '4', title: 'Обучение новых волонтеров', priority: 'medium', status: 'in_progress', dueDate: '15.03.2024', assignee: 'Козлов М.П.', progress: 30 },
];

const performanceMetrics: PerformanceMetric[] = [
  { period: 'Сегодня', tasksCompleted: 12, responseTime: '2.1ч', satisfaction: 4.8, efficiency: 87 },
  { period: 'Вчера', tasksCompleted: 14, responseTime: '2.4ч', satisfaction: 4.7, efficiency: 85 },
  { period: 'Эта неделя', tasksCompleted: 78, responseTime: '2.2ч', satisfaction: 4.8, efficiency: 89 },
  { period: 'Прошлая неделя', tasksCompleted: 72, responseTime: '2.6ч', satisfaction: 4.6, efficiency: 84 },
];

// Модалка для детального просмотра команды
const TeamDetailsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Детальная информация о команде" size="lg">
      <div className="p-6 space-y-6">
        {teamActivity.map((member, index) => (
          <motion.div
            key={member.member}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg">
                {member.avatar}
              </div>
              <div>
                <div className="text-white font-medium">{member.member}</div>
                <div className="text-white/60 text-sm">{member.role}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold">{member.efficiency}%</div>
              <div className="text-white/60 text-sm">эффективность</div>
            </div>
          </motion.div>
        ))}
        
        <div className="pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-2xl font-bold text-emerald-400">{teamActivity.filter(m => m.status === 'online').length}</div>
              <div className="text-white/60 text-sm">Онлайн</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-2xl font-bold text-white">
                {teamActivity.reduce((sum, member) => sum + member.completed, 0)}/
                {teamActivity.reduce((sum, member) => sum + member.tasks, 0)}
              </div>
              <div className="text-white/60 text-sm">Задачи выполнены</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Компоненты для страницы профиля менеджера
function ProfileHeader() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profileData);
  const isMobile = useMobileDetection();

  const handleSave = () => {
    setIsEditing(false);
    // Здесь будет логика сохранения
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-emerald-400' : 'bg-amber-400';
  };

  return (
    <ParticleCard 
      className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl"
      glowColor={COLORS.emerald}
      enableTilt={!isMobile}
    >
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Аватар и основная информация */}
        <div className="flex-shrink-0">
          <motion.div 
            className="relative"
            whileHover={!isMobile ? { scale: 1.05 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white text-2xl sm:text-3xl lg:text-4xl shadow-2xl">
              {profileData.avatar}
            </div>
            <motion.div 
              className={`absolute -bottom-2 -right-2 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full ${getStatusColor(profileData.status)} border-4 border-gray-950 flex items-center justify-center`}
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
                  className="px-4 sm:px-6 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all duration-300 font-medium text-sm sm:text-base"
                  whileHover={!isMobile ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.95 }}
                >
                  Сохранить
                </motion.button>
                <motion.button
                  onClick={() => setIsEditing(false)}
                  className="px-4 sm:px-6 py-2 rounded-xl bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 transition-all duration-300 font-medium text-sm sm:text-base"
                  whileHover={!isMobile ? { scale: 1.05 } : {}}
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
                  <span className="text-lg">🏢</span>
                  <span className="truncate">{profileData.department}</span>
                </div>
                <div className="flex items-center gap-3 text-white/80 text-sm sm:text-base">
                  <span className="text-lg">👥</span>
                  <span>{profileData.subordinates} подчиненных</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <motion.button
                  onClick={() => setIsEditing(true)}
                  className="px-4 sm:px-6 py-2 rounded-xl bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 transition-all duration-300 font-medium text-sm sm:text-base"
                  whileHover={!isMobile ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.95 }}
                >
                  Редактировать профиль
                </motion.button>
                <motion.button 
                  className="px-4 sm:px-6 py-2 rounded-xl bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all duration-300 font-medium text-sm sm:text-base"
                  whileHover={!isMobile ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.95 }}
                >
                  Настройки
                </motion.button>
                <Link href="/demo/social/manager">
                  <motion.button 
                    className="px-4 sm:px-6 py-2 rounded-xl bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all duration-300 font-medium text-sm sm:text-base"
                    whileHover={!isMobile ? { scale: 1.05 } : {}}
                    whileTap={{ scale: 0.95 }}
                  >
                    Дашборд
                  </motion.button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </ParticleCard>
  );
}

function ProfileMetricCard({ metric }: { metric: ProfileMetric }) {
  const isMobile = useMobileDetection();

  const content = (
    <motion.div 
      className="h-full flex flex-col justify-between p-3 sm:p-4"
      whileHover={!isMobile ? { y: -2 } : {}}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="text-xl sm:text-2xl font-bold text-white leading-tight">
          {metric.value}
          {metric.suffix}
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
            <ProgressBar
              value={metric.progress}
              color={`rgb(${metric.color})`}
              showLabel={false}
              height="6px"
            />
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <ParticleCard 
      className="h-full min-h-[120px] sm:min-h-[140px] rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
      glowColor={metric.color}
      enableTilt={!isMobile}
    >
      {content}
    </ParticleCard>
  );
}

function TeamActivityWidget() {
  const isMobile = useMobileDetection();
  const [showTeamModal, setShowTeamModal] = useState(false);

  const getStatusColor = (status: TeamActivity['status']) => {
    return {
      online: 'bg-emerald-400',
      busy: 'bg-amber-400',
      offline: 'bg-gray-500'
    }[status];
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-emerald-400';
    if (efficiency >= 80) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <>
      <ParticleCard 
        className="p-4 sm:p-6 h-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm" 
        glowColor={COLORS.purple}
        onCardClick={() => setShowTeamModal(true)}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="font-semibold text-white text-base sm:text-lg">Активность команды</h3>
            <span className="text-white/60 text-sm">{teamActivity.length} сотрудников</span>
          </div>
          
          <div className="space-y-3 flex-grow">
            {teamActivity.map((member, index) => (
              <motion.div 
                key={member.member}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 group cursor-pointer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={!isMobile ? { x: 4 } : {}}
                onClick={() => setShowTeamModal(true)}
              >
                <div className="flex items-center gap-3 flex-grow">
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm sm:text-base">
                      {member.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full ${getStatusColor(member.status)} border-2 border-gray-900`} />
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-white font-medium text-sm truncate">{member.member}</div>
                      <span className="text-white/60 text-xs">{member.role}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-white/60">
                      <span>Задачи: {member.completed}/{member.tasks}</span>
                      <span className={`font-medium ${getEfficiencyColor(member.efficiency)}`}>
                        {member.efficiency}% эфф.
                      </span>
                    </div>
                  </div>
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
              <motion.button 
                className="w-full py-2 rounded-xl bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all duration-300 font-medium text-sm"
                whileHover={!isMobile ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowTeamModal(true)}
              >
                Управление командой
              </motion.button>
          </div>
        </div>
      </ParticleCard>

      <TeamDetailsModal isOpen={showTeamModal} onClose={() => setShowTeamModal(false)} />
    </>
  );
}

function RecentTasksWidget() {
  const isMobile = useMobileDetection();
  const [selectedTask, setSelectedTask] = useState<RecentTask | null>(null);

  const getPriorityColor = (priority: RecentTask['priority']) => {
    return {
      high: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }[priority];
  };

  const getStatusColor = (status: RecentTask['status']) => {
    return {
      pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      overdue: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
    }[status];
  };

  const getStatusText = (status: RecentTask['status']) => {
    return {
      pending: 'Ожидает',
      in_progress: 'В работе',
      completed: 'Выполнено',
      overdue: 'Просрочено'
    }[status];
  };

  return (
    <>
      <ParticleCard className="p-4 sm:p-6 h-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm" glowColor={COLORS.orange}>
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="font-semibold text-white text-base sm:text-lg">Последние задачи</h3>
              <motion.span 
                className="text-white/60 text-sm hover:text-white transition-colors cursor-pointer"
                whileHover={{ x: 2 }}
              >
                Все задачи →
              </motion.span>
          </div>
          
          <div className="space-y-3 flex-grow">
            {recentTasks.map((task, index) => (
              <motion.div 
                key={task.id}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={!isMobile ? { x: 4 } : {}}
                onClick={() => setSelectedTask(task)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                      {getStatusText(task.status)}
                    </span>
                  </div>
                  <div className="text-white/60 text-xs">{task.dueDate}</div>
                </div>
                
                <div className="text-white font-medium text-sm mb-2 line-clamp-2">{task.title}</div>
                
                <div className="flex items-center justify-between">
                  <div className="text-white/60 text-xs">
                    Исполнитель: {task.assignee}
                  </div>
                  {task.status === 'in_progress' && (
                    <div className="w-16 bg-white/10 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <motion.button
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-all duration-300 text-sm"
              whileHover={!isMobile ? { scale: 1.02 } : {}}
              whileTap={{ scale: 0.98 }}
            >
              Создать новую задачу
            </motion.button>
          </div>
        </div>
      </ParticleCard>

      <Modal 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
        title={selectedTask?.title}
        size="md"
      >
        {selectedTask && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-white/60 text-sm">Приоритет</div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border inline-block ${getPriorityColor(selectedTask.priority)}`}>
                  {selectedTask.priority === 'high' ? 'Высокий' : selectedTask.priority === 'medium' ? 'Средний' : 'Низкий'}
                </div>
              </div>
              <div>
                <div className="text-white/60 text-sm">Статус</div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border inline-block ${getStatusColor(selectedTask.status)}`}>
                  {getStatusText(selectedTask.status)}
                </div>
              </div>
              <div>
                <div className="text-white/60 text-sm">Срок выполнения</div>
                <div className="text-white font-medium">{selectedTask.dueDate}</div>
              </div>
              <div>
                <div className="text-white/60 text-sm">Исполнитель</div>
                <div className="text-white font-medium">{selectedTask.assignee}</div>
              </div>
            </div>
            
            {selectedTask.status === 'in_progress' && (
              <div>
                <div className="text-white/60 text-sm mb-2">Прогресс выполнения</div>
                <ProgressBar value={selectedTask.progress} color="#3B82F6" />
              </div>
            )}
            
            <div className="pt-4 border-t border-white/10">
              <div className="flex gap-3">
                <motion.button
                  className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300 font-medium text-sm flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Редактировать
                </motion.button>
                <motion.button
                  className="px-4 py-2 rounded-xl bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 transition-all duration-300 font-medium text-sm flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Закрыть
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function PerformanceWidget() {
  const isMobile = useMobileDetection();

  return (
    <ParticleCard className="p-4 sm:p-6 h-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm" glowColor={COLORS.blue}>
      <div className="h-full flex flex-col">
        <h3 className="font-semibold text-white text-base sm:text-lg mb-4 sm:mb-6">Производительность</h3>
        
        <div className="flex-grow space-y-3 sm:space-y-4">
          {performanceMetrics.map((stat, index) => (
            <motion.div 
              key={stat.period}
              className="grid grid-cols-4 gap-2 sm:gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!isMobile ? { scale: 1.02 } : {}}
            >
              <div className="col-span-1">
                <div className="text-white font-medium text-sm">{stat.period}</div>
                <div className="text-white/60 text-xs">{stat.tasksCompleted} задач</div>
              </div>
              
              <div className="text-center">
                <div className="text-white font-bold text-sm">{stat.responseTime}</div>
                <div className="text-white/60 text-xs">Ответ</div>
              </div>
              
              <div className="text-center">
                <div className="text-white font-bold text-sm">{stat.satisfaction}</div>
                <div className="text-white/60 text-xs">Удовл.</div>
              </div>
              
              <div className="text-center">
                <div className="text-emerald-400 font-bold text-sm">{stat.efficiency}%</div>
                <div className="text-white/60 text-xs">Эффект.</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-center text-white/60 text-sm">
            Средняя эффективность: {Math.round(performanceMetrics.reduce((sum, stat) => sum + stat.efficiency, 0) / performanceMetrics.length)}%
          </div>
        </div>
      </div>
    </ParticleCard>
  );
}

function QuickActionsWidget() {
  const isMobile = useMobileDetection();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  
  const actions = [
    { 
      id: 'tasks',
      icon: '📋', 
      label: 'Задачи', 
      description: 'Управление задачами', 
    },
    { 
      id: 'team',
      icon: '👥', 
      label: 'Команда', 
      description: 'Управление персоналом', 
    },
    { 
      id: 'reports',
      icon: '📊', 
      label: 'Отчеты', 
      description: 'Аналитика и отчетность', 
    },
    { 
      id: 'schedule',
      icon: '🗓️', 
      label: 'Расписание', 
      description: 'График работы', 
    },
    { 
      id: 'requests',
      icon: '📥', 
      label: 'Заявки', 
      description: 'Входящие заявки', 
    },
    { 
      id: 'settings',
      icon: '⚙️', 
      label: 'Настройки', 
      description: 'Настройки профиля', 
    },
  ];

  const handleActionClick = (actionId: string) => {
    setActiveAction(actionId);
    // Здесь будет логика выполнения действия
    setTimeout(() => setActiveAction(null), 1500);
  };

  return (
    <ParticleCard className="p-4 sm:p-6 h-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm" glowColor={COLORS.gray}>
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
                  className={`p-2 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 text-center cursor-pointer group relative overflow-hidden ${
                    activeAction === action.id ? 'bg-white/20 ring-2 ring-white/30' : ''
                  }`}
                  whileHover={!isMobile ? { scale: 1.05, y: -2 } : {}}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleActionClick(action.id)}
                >
                  {activeAction === action.id && (
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <div className="text-xl sm:text-2xl mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300 relative z-10">
                    {action.icon}
                  </div>
                  <div className="text-white/80 text-xs sm:text-sm font-medium mb-1 line-clamp-1 relative z-10">
                    {action.label}
                  </div>
                  <div className="text-white/60 text-xs line-clamp-2 relative z-10">
                    {action.description}
                  </div>
                </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-center text-white/60 text-xs sm:text-sm">
            Менеджер социальной службы
          </div>
        </div>
      </div>
    </ParticleCard>
  );
}

export default function ManagerProfilePage() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const isMobile = useMobileDetection();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        })
      );
      setCurrentDate(
        now.toLocaleDateString('ru-RU', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      );
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>
      <style jsx global>{`
        .card--border-glow {
          position: relative;
          background:
            radial-gradient(
              ellipse at var(--glow-x) var(--glow-y),
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.3)) 0%,
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.15)) 28%,
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.04)) 52%,
              transparent 70%
            ),
            linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(15, 23, 42, 0.92) 100%);
        }

        .card--border-glow::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 1px;
          background: radial-gradient(
            var(--glow-radius) circle at var(--glow-x) var(--glow-y),
            rgba(var(--glow-color), calc(var(--glow-intensity) * 0.85)) 0%,
            rgba(var(--glow-color), calc(var(--glow-intensity) * 0.45)) 32%,
            transparent 64%
          );
          border-radius: inherit;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: subtract;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          pointer-events: none;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .card--border-glow::before {
            display: none;
          }
        }
      `}</style>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Hero Section */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ProfileHeader />
        </motion.section>

        {/* Profile Metrics */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Рабочие показатели</h2>
            <span className="text-white/60 text-sm">Обновлено сегодня</span>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            {profileMetrics.map((metric, index) => (
              <ProfileMetricCard key={metric.label} metric={metric} />
            ))}
          </div>
        </motion.section>

        {/* Main Profile Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-4 sm:gap-6">
          {/* Team Activity Widget */}
          <div className="xl:col-span-2">
            <TeamActivityWidget />
          </div>

          {/* Recent Tasks Widget */}
          <div className="xl:col-span-2">
            <RecentTasksWidget />
          </div>

          {/* Performance Widget */}
          <div className="xl:col-span-2">
            <PerformanceWidget />
          </div>

          {/* Quick Actions Widget */}
          <div className="xl:col-span-3">
            <QuickActionsWidget />
          </div>

          {/* Additional Info Widget */}
          <div className="xl:col-span-3">
            <ParticleCard className="p-4 sm:p-6 h-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm" glowColor={COLORS.teal}>
              <div className="h-full flex flex-col justify-center items-center text-center">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
                <h3 className="font-semibold text-white text-base sm:text-lg mb-2">Цели на неделю</h3>
                <p className="text-white/60 text-sm sm:text-base mb-4 sm:mb-6">
                  Обработать 50+ заявок и достичь 90% удовлетворенности клиентов
                </p>
                <div className="w-full max-w-xs">
                  <ProgressBar
                    value={65}
                    color="#14b8a6"
                    label="Прогресс выполнения"
                    showLabel={true}
                    height="8px"
                  />
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-2">
                  Осталось 3 дня
                </div>
              </div>
            </ParticleCard>
          </div>
        </div>
      </main>
    </div>
  );
}