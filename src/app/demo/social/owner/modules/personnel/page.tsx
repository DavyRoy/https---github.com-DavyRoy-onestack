'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

// ========== КОНСТАНТЫ И ТИПЫ ==========

const COLORS = {
  primary: 'from-gray-900 via-black to-gray-800',
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

const DEFAULT_PARTICLE_COUNT = 18;
const DEFAULT_SPOTLIGHT_RADIUS = 400;
const DEFAULT_GLOW_COLOR = '59, 130, 246';
const MOBILE_BREAKPOINT = 768;

// Расширенные типы данных
interface Employee {
  id: string;
  name: string;
  avatar: string;
  position: string;
  department: string;
  role: 'social_worker' | 'psychologist' | 'medical' | 'legal' | 'coordinator' | 'admin' | 'manager' | 'specialist';
  status: 'active' | 'vacation' | 'sick' | 'training' | 'remote' | 'business_trip';
  experience: string;
  experienceInOrg: string;
  workload: number;
  effectiveness: number;
  phone: string;
  email: string;
  hireDate: string;
  salary?: number;
  activeClients: number;
  completedCases: number;
  qualityRating: number;
  performance: number;
  quality: number;
  deadlineAdherence: number;
  skills: string[];
  certifications?: string[];
  languages?: string[];
  education?: Education[];
  currentTasks: Task[];
  schedule?: Schedule;
  kpis?: KPI[];
  notes?: string;
  emergencyContact?: EmergencyContact;
  projects?: Project[];
}

interface Education {
  degree: string;
  institution: string;
  year: string;
  specialization?: string;
}

interface Task {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  status: 'pending' | 'inProgress' | 'completed' | 'cancelled';
  clientId?: string;
  projectId?: string;
  estimatedHours?: number;
  actualHours?: number;
}

interface Schedule {
  workHours: string;
  workDays: string[];
  timeZone?: string;
  flexible?: boolean;
}

interface KPI {
  metric: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
}

interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

interface Project {
  id: string;
  name: string;
  role: string;
  status: 'planning' | 'active' | 'completed' | 'onHold';
  startDate: string;
  endDate?: string;
  description: string;
}

interface Department {
  name: string;
  count: number;
  percentage: number;
  color: string;
  manager?: string;
  budget?: number;
  location?: string;
}

interface PersonnelMetric {
  category: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  icon: string;
  change?: string;
  description?: string;
}

// ========== УТИЛИТЫ ==========

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('ru-RU').format(value);
};

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'advanced-particle';
  el.style.cssText = `
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(${color}, 1) 0%, rgba(${color}, 0.3) 70%);
    box-shadow: 0 0 20px rgba(${color}, 0.9), 0 0 40px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
    filter: blur(1px);
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.4,
  fadeDistance: radius * 0.7
});

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'только что';
  if (diffMins < 60) return `${diffMins} мин. назад`;
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays === 1) return 'вчера';
  if (diffDays < 7) return `${diffDays} дн. назад`;
  
  return date.toLocaleDateString('ru-RU');
};

// ========== КОМПОНЕНТЫ АНИМАЦИЙ ==========

const AdvancedParticleCard: React.FC<{
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
  intensity?: number;
}> = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = true,
  enableMagnetism = false,
  onCardClick,
  intensity = 1
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          particle.remove();
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    
    for (let i = 0; i < particleCount; i++) {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        const particle = createParticleElement(x, y, glowColor);
        cardRef.current.appendChild(particle);
        particlesRef.current.push(particle);

        // Сложная анимация частицы
        gsap.fromTo(particle, 
          { 
            scale: 0, 
            opacity: 0,
            x: 0,
            y: 0,
            rotation: 0
          }, 
          { 
            scale: 1.2, 
            opacity: 1, 
            duration: 0.6,
            ease: 'back.out(2)'
          }
        );

        const timeline = gsap.timeline();
        timeline.to(particle, {
          x: `+=${(Math.random() - 0.5) * 120 * intensity}`,
          y: `+=${(Math.random() - 0.5) * 120 * intensity}`,
          rotation: 720,
          duration: 4 + Math.random() * 3,
          ease: 'sine.inOut'
        })
        .to(particle, {
          opacity: 0.4,
          scale: 0.9,
          duration: 1.5,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1
        }, 0);

        // Автоматическое удаление через случайное время
        setTimeout(() => {
          if (particle.parentNode) {
            gsap.to(particle, {
              opacity: 0,
              scale: 0,
              duration: 0.6,
              onComplete: () => particle.remove()
            });
          }
        }, 4000 + Math.random() * 3000);

      }, i * 100);

      timeoutsRef.current.push(timeoutId);
    }
  }, [particleCount, glowColor, intensity]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 4,
          rotateY: 4,
          scale: 1.03,
          duration: 0.5,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      // Эффект свечения при наведении
      gsap.to(element, {
        '--glow-intensity': 1,
        duration: 0.4,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      });

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      }

      // Убираем свечение
      gsap.to(element, {
        '--glow-intensity': 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -8 * intensity;
        const rotateY = ((x - centerX) / centerX) * 8 * intensity;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.15,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.04 * intensity;
        const magnetY = (y - centerY) * 0.04 * intensity;

        if (magnetismAnimationRef.current) {
          magnetismAnimationRef.current.kill();
        }
        
        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.6,
          ease: 'power2.out'
        });
      }

      // Динамическое обновление позиции свечения
      element.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
      element.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
    };

    const handleClick = (e: MouseEvent) => {
      if (clickEffect) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Улучшенный ripple эффект
        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: absolute;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, 
            rgba(${glowColor}, 0.8) 0%, 
            rgba(${glowColor}, 0.4) 40%, 
            rgba(${glowColor}, 0.2) 60%,
            transparent 80%
          );
          left: ${x - 60}px;
          top: ${y - 60}px;
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
            scale: 5,
            opacity: 0,
            duration: 1,
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
  }, [disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor, onCardClick, animateParticles, clearAllParticles, intensity]);

  return (
    <motion.div
      ref={cardRef}
      className={`advanced-particle-card ${className}`}
      style={{
        ...style,
        position: 'relative',
        overflow: 'hidden',
        transformStyle: 'preserve-3d'
      }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {children}
    </motion.div>
  );
};

const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const isInsideSection = useRef(false);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: ${spotlightRadius * 2}px;
      height: ${spotlightRadius * 2}px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.25) 0%,
        rgba(${glowColor}, 0.15) 15%,
        rgba(${glowColor}, 0.08) 25%,
        rgba(${glowColor}, 0.04) 40%,
        rgba(${glowColor}, 0.02) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
      filter: blur(25px);
      transition: opacity 0.4s ease;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      isInsideSection.current = mouseInside || false;
      const cards = gridRef.current.querySelectorAll('.card');

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out'
        });
        cards.forEach(card => {
          (card as HTMLElement).style.setProperty('--glow-intensity', '0');
        });
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach(card => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.15,
        ease: 'power2.out'
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.9
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.9
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.25 : 0.6,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      isInsideSection.current = false;
      gridRef.current?.querySelectorAll('.card').forEach(card => {
        (card as HTMLElement).style.setProperty('--glow-intensity', '0');
      });
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.remove();
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid: React.FC<{
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}> = ({ children, gridRef, className = '' }) => (
  <motion.div
    className={`bento-section grid gap-3 sm:gap-4 p-3 sm:p-6 max-w-7xl select-none relative ${className}`}
    ref={gridRef}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// ========== ОСНОВНЫЕ КОМПОНЕНТЫ ==========

const ProgressBar: React.FC<{
  value: number;
  max?: number;
  color?: string;
  label?: string;
  showLabel?: boolean;
  height?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}> = ({ value, max = 100, color = '#3B82F6', label = '', showLabel = true, height = 'md', animated = true }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const heightClass = height === 'sm' ? 'h-1.5' : height === 'lg' ? 'h-3' : 'h-2';
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-white text-xs mb-2">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}
      <div className={`w-full bg-white/10 rounded-full ${heightClass} overflow-hidden backdrop-blur-sm`}>
        <motion.div 
          className={`rounded-full ${heightClass} relative overflow-hidden`}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1.2 : 0, ease: 'easeOut' }}
          style={{ backgroundColor: color }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};

const EmployeeCard: React.FC<{ 
  employee: Employee; 
  index: number;
  onCardClick: (employee: Employee) => void;
}> = ({ employee, index, onCardClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getRoleColor = (role: Employee['role']) => {
    switch (role) {
      case 'social_worker': return '#3B82F6';
      case 'psychologist': return '#8B5CF6';
      case 'medical': return '#EF4444';
      case 'legal': return '#10B981';
      case 'coordinator': return '#F59E0B';
      case 'admin': return '#6B7280';
      case 'manager': return '#EC4899';
      case 'specialist': return '#06B6D4';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'vacation': return '#F59E0B';
      case 'sick': return '#EF4444';
      case 'training': return '#3B82F6';
      case 'remote': return '#8B5CF6';
      case 'business_trip': return '#EC4899';
      default: return '#6B7280';
    }
  };

  const getStatusLabel = (status: Employee['status']) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'vacation': return 'Отпуск';
      case 'sick': return 'Больничный';
      case 'training': return 'Обучение';
      case 'remote': return 'Удаленно';
      case 'business_trip': return 'Командировка';
      default: return 'Неизвестно';
    }
  };

  const baseClassName = `card flex flex-col justify-between relative min-h-[260px] sm:min-h-[300px] w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow`;

  const cardStyle = {
    backgroundColor: '#060010',
    borderColor: 'var(--border-color)',
    color: 'var(--white)',
    '--glow-x': '50%',
    '--glow-y': '50%',
    '--glow-intensity': '0',
    '--glow-radius': '250px',
    '--glow-color': getRoleColor(employee.role).replace('#', '').replace(/../g, x => x+',')
  } as React.CSSProperties;

  return (
    <AdvancedParticleCard
      className={baseClassName}
      style={cardStyle}
      particleCount={14}
      glowColor={getRoleColor(employee.role).replace('#', '').replace(/../g, x => x+',')}
      enableTilt={true}
      clickEffect={true}
      enableMagnetism={true}
      onCardClick={() => onCardClick(employee)}
      intensity={employee.workload > 90 ? 1.6 : employee.workload > 80 ? 1.3 : 1}
    >
      <motion.div 
        className="h-full flex flex-col"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <motion.div 
              className="text-2xl sm:text-3xl relative"
              animate={{ scale: isHovered ? 1.3 : 1, rotate: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              {employee.avatar}
              <div className="absolute -top-1 -right-1 text-xs">
                {employee.activeClients > 20 ? '🔥' : employee.activeClients > 10 ? '⭐' : '👍'}
              </div>
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-base sm:text-lg truncate group-hover:text-blue-300 transition-colors">
                {employee.name}
              </h3>
              <p className="text-white/60 text-xs sm:text-sm truncate">{employee.position}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white/40 text-xs">
                  {employee.department}
                </span>
              </div>
            </div>
          </div>
          <motion.div 
            className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium flex-shrink-0 backdrop-blur-sm ${
              employee.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              employee.status === 'vacation' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
              employee.status === 'sick' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              employee.status === 'training' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
              employee.status === 'remote' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
              'bg-pink-500/20 text-pink-400 border border-pink-500/30'
            }`}
            animate={{ scale: isHovered ? 1.15 : 1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {getStatusLabel(employee.status)}
          </motion.div>
        </div>

        {/* Stats */}
        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 flex-1">
          <div className="grid grid-cols-3 gap-1 sm:gap-2 text-xs sm:text-sm">
            <motion.div 
              className="bg-white/5 rounded-lg p-1 sm:p-2 text-center backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="text-white font-bold text-sm sm:text-base">{employee.activeClients}</div>
              <div className="text-white/60 text-xs">клиентов</div>
            </motion.div>
            <motion.div 
              className="bg-white/5 rounded-lg p-1 sm:p-2 text-center backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="text-yellow-400 font-bold text-sm sm:text-base">{employee.qualityRating}</div>
              <div className="text-white/60 text-xs">рейтинг</div>
            </motion.div>
            <motion.div 
              className="bg-white/5 rounded-lg p-1 sm:p-2 text-center backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="text-green-400 font-bold text-sm sm:text-base">{employee.effectiveness}%</div>
              <div className="text-white/60 text-xs">эффект.</div>
            </motion.div>
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <div className="flex justify-between text-white/70 text-xs">
              <span>Стаж в организации</span>
              <span className="text-white/90">{employee.experienceInOrg}</span>
            </div>
            <div className="flex justify-between text-white/70 text-xs">
              <span>Загрузка</span>
              <span>{employee.workload}%</span>
            </div>
            <div className="pt-1 sm:pt-2">
              <ProgressBar 
                value={employee.workload} 
                label="Текущая загрузка" 
                color={getRoleColor(employee.role)}
                height="sm"
                animated={true}
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1">
          {employee.skills.slice(0, 2).map((skill, skillIndex) => (
            <motion.span 
              key={skillIndex}
              className="text-xs bg-white/10 px-2 py-1 rounded border border-white/20 text-white/80 hover:bg-white/20 transition-colors cursor-default backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + skillIndex * 0.1, type: "spring" }}
              whileHover={{ scale: 1.08, y: -1 }}
            >
              {skill}
            </motion.span>
          ))}
          {employee.skills.length > 2 && (
            <span className="text-xs bg-white/10 px-2 py-1 rounded border border-white/20 text-white/40 backdrop-blur-sm">
              +{employee.skills.length - 2}
            </span>
          )}
        </div>

        {/* Background gradient */}
        <div 
          className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 30% 20%, rgba(${getRoleColor(employee.role).replace('#', '').replace(/../g, x => x+',')}, 0.4) 0%, transparent 50%)`
          }}
        />

        {/* Hover Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-2xl flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex gap-2 sm:gap-3">
                <motion.button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm shadow-lg"
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  👁️ Подробнее
                </motion.button>
                <motion.button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm shadow-lg"
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  📞 Позвонить
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AdvancedParticleCard>
  );
};

// ========== МОДАЛЬНЫЕ ОКНА И ДЕТАЛИ ==========

const EmployeeDetailsModal: React.FC<{
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (employee: Employee) => void;
}> = ({ employee, isOpen, onClose, onEdit }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'tasks' | 'documents'>('overview');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !employee) return null;

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: '👤' },
    { id: 'performance' as const, label: 'Эффективность', icon: '📊' },
    { id: 'tasks' as const, label: 'Задачи', icon: '✅' },
    { id: 'documents' as const, label: 'Документы', icon: '📄' },
  ];

  const getRoleColor = (role: Employee['role']) => {
    switch (role) {
      case 'social_worker': return '#3B82F6';
      case 'psychologist': return '#8B5CF6';
      case 'medical': return '#EF4444';
      case 'legal': return '#10B981';
      case 'coordinator': return '#F59E0B';
      case 'admin': return '#6B7280';
      case 'manager': return '#EC4899';
      case 'specialist': return '#06B6D4';
      default: return '#6B7280';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <EmployeeOverviewTab employee={employee} />;
      case 'performance':
        return <EmployeePerformanceTab employee={employee} />;
      case 'tasks':
        return <EmployeeTasksTab employee={employee} />;
      case 'documents':
        return <EmployeeDocumentsTab employee={employee} />;
      default:
        return <EmployeeOverviewTab employee={employee} />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl sm:rounded-3xl border border-white/20 max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{ 
            '--glow-color': getRoleColor(employee.role).replace('#', '').replace(/../g, x => x+','),
            background: `radial-gradient(ellipse at top right, rgba(var(--glow-color), 0.15) 0%, transparent 50%), linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)`
          } as React.CSSProperties}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 md:p-8 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-6">
                <motion.div 
                  className="text-4xl sm:text-5xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  {employee.avatar}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <motion.h2 
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 truncate"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {employee.name}
                  </motion.h2>
                  <motion.p 
                    className="text-white/60 text-base sm:text-lg truncate"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {employee.position} • {employee.department}
                  </motion.p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                <motion.button
                  onClick={() => onEdit?.(employee)}
                  className="px-3 sm:px-5 py-2 sm:py-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm font-medium backdrop-blur-sm hover:scale-105"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✏️ Редактировать
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm overflow-x-auto">
            <div className="flex space-x-1 px-4 sm:px-6 md:px-8 min-w-max">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium rounded-t-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 relative overflow-hidden flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white border-t-2 border-blue-500 shadow-lg'
                      : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                  }`}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-base sm:text-lg">{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
            {renderTabContent()}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 md:p-8 border-t border-white/10 bg-white/5 backdrop-blur-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-white/60 text-xs sm:text-sm text-center sm:text-left">
                Принят на работу: {employee.hireDate}
              </div>
              <div className="flex gap-2 sm:gap-3">
                <motion.button 
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm font-medium shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📞 Позвонить
                </motion.button>
                <motion.button 
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm font-medium shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📅 График
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const EmployeeOverviewTab: React.FC<{ employee: Employee }> = ({ employee }) => (
  <motion.div 
    className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="space-y-4 sm:space-y-6">
      <div className="card--border-glow bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 backdrop-blur-sm">
        <h3 className="text-white font-semibold text-lg mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
          <span className="text-xl">📋</span>
          <span>Контактная информация</span>
        </h3>
        <div className="space-y-3 sm:space-y-4 text-white/80">
          <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl hover:bg-white/10 transition-colors">
            <span className="flex items-center gap-2 text-sm sm:text-base">
              <span>📞</span>
              <span>Телефон:</span>
            </span>
            <span className="text-white font-medium text-sm sm:text-base">{employee.phone}</span>
          </div>
          <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl hover:bg-white/10 transition-colors">
            <span className="flex items-center gap-2 text-sm sm:text-base">
              <span>📧</span>
              <span>Email:</span>
            </span>
            <span className="text-white font-medium text-sm sm:text-base truncate ml-2">{employee.email}</span>
          </div>
          <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl hover:bg-white/10 transition-colors">
            <span className="flex items-center gap-2 text-sm sm:text-base">
              <span>💼</span>
              <span>Должность:</span>
            </span>
            <span className="text-white font-medium text-sm sm:text-base text-right">{employee.position}</span>
          </div>
          <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl hover:bg-white/10 transition-colors">
            <span className="flex items-center gap-2 text-sm sm:text-base">
              <span>🏢</span>
              <span>Отдел:</span>
            </span>
            <span className="text-white font-medium text-sm sm:text-base">{employee.department}</span>
          </div>
          {employee.hireDate && (
            <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl hover:bg-white/10 transition-colors">
              <span className="flex items-center gap-2 text-sm sm:text-base">
                <span>📅</span>
                <span>Дата приема:</span>
              </span>
              <span className="text-white font-medium text-sm sm:text-base">{employee.hireDate}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card--border-glow bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 backdrop-blur-sm">
        <h3 className="text-white font-semibold text-lg mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
          <span className="text-xl">🎯</span>
          <span>Навыки и компетенции</span>
        </h3>
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
          {employee.skills.map((skill, index) => (
            <motion.span 
              key={index}
              className="text-xs bg-white/10 px-2 sm:px-3 py-1 sm:py-2 rounded-full border border-white/20 text-white/80 hover:bg-white/20 transition-colors cursor-default backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.1, y: -1 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
        {employee.certifications && employee.certifications.length > 0 && (
          <div className="mt-3 sm:mt-4">
            <h4 className="text-white/60 text-sm mb-2 sm:mb-3 font-medium">Сертификаты:</h4>
            <div className="space-y-2">
              {employee.certifications.map((cert, index) => (
                <motion.div 
                  key={index} 
                  className="text-white/70 text-sm bg-white/5 p-2 sm:p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  • {cert}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="space-y-4 sm:space-y-6">
      <div className="card--border-glow bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 backdrop-blur-sm">
        <h3 className="text-white font-semibold text-lg mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
          <span className="text-xl">📊</span>
          <span>Рабочие показатели</span>
        </h3>
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
            <motion.div 
              className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="text-white font-bold text-xl sm:text-2xl">{employee.activeClients}</div>
              <div className="text-white/60 text-xs sm:text-sm">активных клиентов</div>
            </motion.div>
            <motion.div 
              className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="text-yellow-400 font-bold text-xl sm:text-2xl">{employee.qualityRating}/5</div>
              <div className="text-white/60 text-xs sm:text-sm">средний рейтинг</div>
            </motion.div>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between text-white/80 text-sm">
              <span>Стаж в организации</span>
              <span className="text-white font-medium">{employee.experienceInOrg}</span>
            </div>
            <div className="flex justify-between text-white/80 text-sm">
              <span>Общий стаж</span>
              <span className="text-white font-medium">{employee.experience}</span>
            </div>
            <div className="flex justify-between text-white/80 text-sm">
              <span>Завершено случаев</span>
              <span className="text-white font-medium">{employee.completedCases}</span>
            </div>
            <div className="pt-2 sm:pt-3">
              <ProgressBar 
                value={employee.workload} 
                label="Текущая загрузка" 
                color="#3B82F6"
                height="md"
                showLabel={true}
              />
            </div>
          </div>
        </div>
      </div>

      {employee.education && employee.education.length > 0 && (
        <div className="card--border-glow bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 backdrop-blur-sm">
          <h3 className="text-white font-semibold text-lg mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
            <span className="text-xl">🎓</span>
            <span>Образование</span>
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {employee.education.map((edu, index) => (
              <motion.div 
                key={index} 
                className="text-sm bg-white/5 p-3 sm:p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-white font-medium text-base sm:text-lg mb-1">{edu.degree}</div>
                <div className="text-white/60 mb-1">{edu.institution}</div>
                <div className="text-white/40 text-xs">{edu.year}{edu.specialization && ` • ${edu.specialization}`}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  </motion.div>
);

const EmployeePerformanceTab: React.FC<{ employee: Employee }> = ({ employee }) => (
  <div className="space-y-4 sm:space-y-6">
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <motion.div 
        className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.05, y: -2 }}
      >
        <div className="text-2xl mb-2">📈</div>
        <div className="text-white font-bold text-lg sm:text-xl">{employee.performance}%</div>
        <div className="text-white/60 text-xs sm:text-sm">Производительность</div>
      </motion.div>
      <motion.div 
        className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.05, y: -2 }}
      >
        <div className="text-2xl mb-2">⭐</div>
        <div className="text-white font-bold text-lg sm:text-xl">{employee.quality}%</div>
        <div className="text-white/60 text-xs sm:text-sm">Качество работы</div>
      </motion.div>
      <motion.div 
        className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.05, y: -2 }}
      >
        <div className="text-2xl mb-2">⏱️</div>
        <div className="text-white font-bold text-lg sm:text-xl">{employee.deadlineAdherence}%</div>
        <div className="text-white/60 text-xs sm:text-sm">Соблюдение сроков</div>
      </motion.div>
      <motion.div 
        className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.05, y: -2 }}
      >
        <div className="text-2xl mb-2">💼</div>
        <div className="text-white font-bold text-lg sm:text-xl">{employee.effectiveness}%</div>
        <div className="text-white/60 text-xs sm:text-sm">Общая эффективность</div>
      </motion.div>
    </div>

    <div className="card--border-glow bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 backdrop-blur-sm">
      <h3 className="text-white font-semibold text-lg mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
        <span className="text-xl">📊</span>
        <span>Детальная аналитика</span>
      </h3>
      <div className="space-y-3 sm:space-y-4">
        <div>
          <div className="flex justify-between text-white text-sm mb-2">
            <span>Производительность</span>
            <span>{employee.performance}%</span>
          </div>
          <ProgressBar value={employee.performance} color="#3B82F6" />
        </div>
        <div>
          <div className="flex justify-between text-white text-sm mb-2">
            <span>Качество работы</span>
            <span>{employee.quality}%</span>
          </div>
          <ProgressBar value={employee.quality} color="#10B981" />
        </div>
        <div>
          <div className="flex justify-between text-white text-sm mb-2">
            <span>Соблюдение сроков</span>
            <span>{employee.deadlineAdherence}%</span>
          </div>
          <ProgressBar value={employee.deadlineAdherence} color="#F59E0B" />
        </div>
      </div>
    </div>

    {employee.kpis && employee.kpis.length > 0 && (
      <div className="card--border-glow bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 backdrop-blur-sm">
        <h3 className="text-white font-semibold text-lg mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
          <span className="text-xl">🎯</span>
          <span>KPI показатели</span>
        </h3>
        <div className="grid gap-2 sm:gap-3">
          {employee.kpis.map((kpi, index) => (
            <motion.div 
              key={index} 
              className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex-1">
                <div className="text-white font-medium text-sm">{kpi.metric}</div>
                <div className="text-white/60 text-xs">Цель: {kpi.target}% • {kpi.period}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-base sm:text-lg">{kpi.value}%</span>
                <span className={`text-sm ${
                  kpi.trend === 'up' ? 'text-green-400' : 
                  kpi.trend === 'down' ? 'text-red-400' : 'text-blue-400'
                }`}>
                  {kpi.trend === 'up' ? '↗' : kpi.trend === 'down' ? '↘' : '→'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const EmployeeTasksTab: React.FC<{ employee: Employee }> = ({ employee }) => (
  <motion.div 
    className="space-y-4 sm:space-y-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-white font-semibold text-lg sm:text-xl mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
      <span className="text-2xl">✅</span>
      <span>Текущие задачи</span>
    </h3>
    {employee.currentTasks.length > 0 ? (
      <div className="space-y-3 sm:space-y-4">
        {employee.currentTasks.map((task, index) => (
          <motion.div 
            key={task.id} 
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex-1 mb-3 sm:mb-0">
              <div className="text-white font-semibold text-base sm:text-lg mb-1 sm:mb-2">{task.description}</div>
              <div className="text-white/60 text-xs sm:text-sm">
                Срок: {task.deadline} • Статус: 
                <span className={`ml-1 font-medium ${
                  task.status === 'completed' ? 'text-green-400' :
                  task.status === 'inProgress' ? 'text-yellow-400' :
                  task.status === 'pending' ? 'text-blue-400' : 'text-red-400'
                }`}>
                  {task.status === 'completed' ? 'Завершено' : 
                   task.status === 'inProgress' ? 'В работе' :
                   task.status === 'pending' ? 'Ожидает' : 'Отменено'}
                </span>
              </div>
              {task.estimatedHours && (
                <div className="text-white/40 text-xs sm:text-sm mt-2 sm:mt-3 bg-white/5 p-2 sm:p-3 rounded-lg border border-white/10">
                  Оценка времени: {task.estimatedHours}ч
                  {task.actualHours && ` • Фактически: ${task.actualHours}ч`}
                </div>
              )}
            </div>
            <div className={`text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium backdrop-blur-sm self-start sm:self-auto ${
              task.priority === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
              'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              {task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'}
            </div>
          </motion.div>
        ))}
      </div>
    ) : (
      <motion.div 
        className="text-center py-8 sm:py-12 text-white/60"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">✅</div>
        <p className="text-lg sm:text-xl mb-2">Нет активных задач</p>
        <p className="text-xs sm:text-sm">Все задачи завершены или ожидают назначения</p>
      </motion.div>
    )}
  </motion.div>
);

const EmployeeDocumentsTab: React.FC<{ employee: Employee }> = ({ employee }) => (
  <motion.div 
    className="space-y-4 sm:space-y-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-white font-semibold text-lg sm:text-xl mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
      <span className="text-2xl">📄</span>
      <span>Документы сотрудника</span>
    </h3>
    <motion.div 
      className="text-center py-8 sm:py-12 text-white/60"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">📂</div>
      <p className="text-lg sm:text-xl mb-2">Документы не загружены</p>
      <p className="text-xs sm:text-sm">Здесь будут отображаться документы сотрудника</p>
    </motion.div>
  </motion.div>
);

// ========== РАСШИРЕННЫЕ ДЕМО-ДАННЫЕ ==========

const employeesData: Employee[] = [
  {
    id: 'EMP-001',
    name: "Смирнова Анна Ивановна",
    avatar: "👩‍💼",
    position: "Старший социальный работник",
    department: "Социальный патронаж",
    role: "social_worker",
    status: "active",
    experience: "8 лет",
    experienceInOrg: "5 лет",
    workload: 85,
    effectiveness: 92,
    phone: "+7 (912) 345-67-89",
    email: "anna.smirnova@zabota.org",
    hireDate: "15.03.2019",
    salary: 85000,
    activeClients: 24,
    completedCases: 156,
    qualityRating: 4.9,
    performance: 94,
    quality: 96,
    deadlineAdherence: 92,
    skills: ["Патронаж", "Консультирование", "Документация", "Координация", "Кризисное вмешательство"],
    certifications: ["Сертификат социального работника", "Курс первой помощи"],
    languages: ["Русский", "Английский"],
    education: [
      {
        degree: "Высшее образование",
        institution: "МГУ им. Ломоносова",
        year: "2016",
        specialization: "Социальная работа"
      }
    ],
    currentTasks: [
      { 
        id: 'T1',
        description: "Патронаж клиента Ивановой М.П.", 
        priority: "high", 
        deadline: "20.12.2024",
        status: "inProgress",
        estimatedHours: 3,
        actualHours: 2
      },
      { 
        id: 'T2',
        description: "Подготовка квартального отчета отдела", 
        priority: "medium", 
        deadline: "25.12.2024",
        status: "pending",
        estimatedHours: 8
      },
      { 
        id: 'T3',
        description: "Обучение нового сотрудника", 
        priority: "low", 
        deadline: "30.12.2024",
        status: "pending",
        estimatedHours: 5
      }
    ],
    schedule: {
      workHours: "9:00-18:00",
      workDays: ["Пн", "Вт", "Ср", "Чт", "Пт"],
      timeZone: "МСК"
    },
    kpis: [
      { metric: "Удовлетворенность клиентов", value: 96, target: 90, trend: "up", period: "Квартал" },
      { metric: "Своевременность отчетов", value: 98, target: 95, trend: "up", period: "Месяц" },
      { metric: "Эффективность работы", value: 94, target: 92, trend: "stable", period: "Квартал" }
    ],
    notes: "Ответственный сотрудник с высокими показателями эффективности. Хорошо работает в команде.",
    emergencyContact: {
      name: "Смирнов Иван Петрович",
      relation: "Муж",
      phone: "+7 (912) 111-22-33"
    },
    projects: [
      {
        id: "P1",
        name: "Программа социальной адаптации",
        role: "Координатор",
        status: "active",
        startDate: "01.01.2024",
        description: "Программа помощи людям в сложной жизненной ситуации"
      }
    ]
  },
  {
    id: 'EMP-002',
    name: "Петрова Мария Владимировна",
    avatar: "🧠",
    position: "Психолог-консультант",
    department: "Психологическая служба",
    role: "psychologist",
    status: "active",
    experience: "6 лет",
    experienceInOrg: "4 года",
    workload: 78,
    effectiveness: 95,
    phone: "+7 (923) 456-78-90",
    email: "maria.petrova@zabota.org",
    hireDate: "20.08.2020",
    salary: 92000,
    activeClients: 18,
    completedCases: 89,
    qualityRating: 4.8,
    performance: 92,
    quality: 94,
    deadlineAdherence: 90,
    skills: ["Психотерапия", "Кризисное консультирование", "Групповая работа", "Диагностика", "Арт-терапия"],
    certifications: ["Диплом психолога", "Сертификат по когнитивно-поведенческой терапии"],
    currentTasks: [
      { 
        id: 'T4',
        description: "Индивидуальная консультация Сидоровой А.И.", 
        priority: "high", 
        deadline: "19.12.2024",
        status: "inProgress",
        estimatedHours: 1
      },
      { 
        id: 'T5',
        description: "Подготовка к групповому тренингу", 
        priority: "medium", 
        deadline: "22.12.2024",
        status: "pending",
        estimatedHours: 4
      }
    ]
  },
  {
    id: 'EMP-003',
    name: "Козлов Дмитрий Сергеевич",
    avatar: "🏥",
    position: "Медицинский работник",
    department: "Медицинский уход",
    role: "medical",
    status: "active",
    experience: "10 лет",
    experienceInOrg: "3 года",
    workload: 72,
    effectiveness: 88,
    phone: "+7 (934) 567-89-01",
    email: "dmitry.kozlov@zabota.org",
    hireDate: "15.11.2021",
    salary: 78000,
    activeClients: 15,
    completedCases: 67,
    qualityRating: 4.7,
    performance: 89,
    quality: 91,
    deadlineAdherence: 87,
    skills: ["Первая помощь", "Реабилитация", "Медицинский уход", "Процедуры", "Диагностика"],
    currentTasks: [
      { 
        id: 'T6',
        description: "Медицинский осмотр Петрова А.В.", 
        priority: "high", 
        deadline: "18.12.2024",
        status: "inProgress",
        estimatedHours: 2
      },
      { 
        id: 'T7',
        description: "Закупка медикаментов", 
        priority: "medium", 
        deadline: "20.12.2024",
        status: "pending",
        estimatedHours: 3
      }
    ]
  },
  {
    id: 'EMP-004',
    name: "Новикова Ольга Игоревна",
    avatar: "⚖️",
    position: "Юрист-консультант",
    department: "Юридический отдел",
    role: "legal",
    status: "vacation",
    experience: "7 лет",
    experienceInOrg: "2 года",
    workload: 65,
    effectiveness: 85,
    phone: "+7 (945) 678-90-12",
    email: "olga.novikova@zabota.org",
    hireDate: "10.02.2022",
    salary: 95000,
    activeClients: 12,
    completedCases: 45,
    qualityRating: 4.6,
    performance: 86,
    quality: 88,
    deadlineAdherence: 84,
    skills: ["Юридическое консультирование", "Документооборот", "Защита прав", "Льготы", "Трудовое право"],
    currentTasks: [
      { 
        id: 'T8',
        description: "Консультация по трудовому праву", 
        priority: "medium", 
        deadline: "28.12.2024",
        status: "pending",
        estimatedHours: 2
      }
    ]
  },
  {
    id: 'EMP-005',
    name: "Волков Сергей Александрович",
    avatar: "👨‍💼",
    position: "Координатор программ",
    department: "Координационный отдел",
    role: "coordinator",
    status: "active",
    experience: "5 лет",
    experienceInOrg: "3 года",
    workload: 90,
    effectiveness: 89,
    phone: "+7 (956) 789-01-23",
    email: "sergey.volkov@zabota.org",
    hireDate: "01.06.2021",
    salary: 88000,
    activeClients: 8,
    completedCases: 34,
    qualityRating: 4.8,
    performance: 91,
    quality: 93,
    deadlineAdherence: 89,
    skills: ["Управление проектами", "Координация", "Аналитика", "Отчетность", "Бюджетирование"],
    currentTasks: [
      { 
        id: 'T9',
        description: "Координация программы 'Социальный лифт'", 
        priority: "high", 
        deadline: "20.12.2024",
        status: "inProgress",
        estimatedHours: 6
      },
      { 
        id: 'T10',
        description: "Подготовка годового отчета", 
        priority: "high", 
        deadline: "25.12.2024",
        status: "pending",
        estimatedHours: 12
      }
    ]
  },
  {
    id: 'EMP-006',
    name: "Иванов Алексей Петрович",
    avatar: "💻",
    position: "Администратор",
    department: "Административный отдел",
    role: "admin",
    status: "sick",
    experience: "4 года",
    experienceInOrg: "2 года",
    workload: 60,
    effectiveness: 82,
    phone: "+7 (967) 890-12-34",
    email: "alexey.ivanov@zabota.org",
    hireDate: "15.03.2022",
    salary: 65000,
    activeClients: 0,
    completedCases: 156,
    qualityRating: 4.5,
    performance: 84,
    quality: 86,
    deadlineAdherence: 82,
    skills: ["Администрирование", "Документооборот", "Отчетность", "Координация", "IT поддержка"],
    currentTasks: [
      { 
        id: 'T11',
        description: "Обработка входящей документации", 
        priority: "medium", 
        deadline: "22.12.2024",
        status: "pending",
        estimatedHours: 4
      }
    ]
  },
  {
    id: 'EMP-007',
    name: "Федорова Екатерина Сергеевна",
    avatar: "👩‍🎓",
    position: "Специалист по реабилитации",
    department: "Медицинский уход",
    role: "specialist",
    status: "training",
    experience: "3 года",
    experienceInOrg: "1 год",
    workload: 68,
    effectiveness: 79,
    phone: "+7 (978) 901-23-45",
    email: "ekaterina.fedorova@zabota.org",
    hireDate: "10.09.2023",
    salary: 72000,
    activeClients: 11,
    completedCases: 23,
    qualityRating: 4.4,
    performance: 81,
    quality: 83,
    deadlineAdherence: 78,
    skills: ["Реабилитация", "Физиотерапия", "ЛФК", "Массаж", "Эрготерапия"],
    currentTasks: [
      { 
        id: 'T12',
        description: "Реабилитационные процедуры для Громова А.П.", 
        priority: "medium", 
        deadline: "19.12.2024",
        status: "inProgress",
        estimatedHours: 2
      }
    ]
  },
  {
    id: 'EMP-008',
    name: "Соколов Андрей Викторович",
    avatar: "🧑‍💻",
    position: "Руководитель IT отдела",
    department: "Административный отдел",
    role: "manager",
    status: "remote",
    experience: "8 лет",
    experienceInOrg: "4 года",
    workload: 75,
    effectiveness: 91,
    phone: "+7 (989) 012-34-56",
    email: "andrey.sokolov@zabota.org",
    hireDate: "20.05.2020",
    salary: 120000,
    activeClients: 0,
    completedCases: 89,
    qualityRating: 4.7,
    performance: 93,
    quality: 95,
    deadlineAdherence: 90,
    skills: ["Управление командой", "IT инфраструктура", "Бюджетирование", "Проектное управление", "Кибербезопасность"],
    currentTasks: [
      { 
        id: 'T13',
        description: "Обновление серверной инфраструктуры", 
        priority: "high", 
        deadline: "30.12.2024",
        status: "inProgress",
        estimatedHours: 20
      }
    ]
  },
  {
    id: 'EMP-009',
    name: "Морозова Ирина Дмитриевна",
    avatar: "👩‍⚕️",
    position: "Медсестра",
    department: "Медицинский уход",
    role: "medical",
    status: "active",
    experience: "6 лет",
    experienceInOrg: "2 года",
    workload: 80,
    effectiveness: 87,
    phone: "+7 (990) 123-45-67",
    email: "irina.morozova@zabota.org",
    hireDate: "15.01.2022",
    salary: 68000,
    activeClients: 18,
    completedCases: 56,
    qualityRating: 4.8,
    performance: 88,
    quality: 90,
    deadlineAdherence: 85,
    skills: ["Медицинский уход", "Процедуры", "Первая помощь", "Документация", "Работа с пожилыми"],
    currentTasks: [
      { 
        id: 'T14',
        description: "Ежедневные процедуры для Николаевой О.В.", 
        priority: "medium", 
        deadline: "18.12.2024",
        status: "inProgress",
        estimatedHours: 1
      }
    ]
  },
  {
    id: 'EMP-010',
    name: "Григорьев Павел Олегович",
    avatar: "👨‍🏫",
    position: "Социальный педагог",
    department: "Социальный патронаж",
    role: "social_worker",
    status: "business_trip",
    experience: "5 лет",
    experienceInOrg: "3 года",
    workload: 70,
    effectiveness: 84,
    phone: "+7 (991) 234-56-78",
    email: "pavel.grigoriev@zabota.org",
    hireDate: "10.03.2021",
    salary: 75000,
    activeClients: 16,
    completedCases: 42,
    qualityRating: 4.6,
    performance: 85,
    quality: 87,
    deadlineAdherence: 83,
    skills: ["Педагогика", "Работа с детьми", "Семейное консультирование", "Профориентация", "Групповая работа"],
    currentTasks: [
      { 
        id: 'T15',
        description: "Консультация для семьи Семеновых", 
        priority: "high", 
        deadline: "21.12.2024",
        status: "pending",
        estimatedHours: 2
      }
    ]
  },
  {
    id: 'EMP-011',
    name: "Кузнецова Татьяна Михайловна",
    avatar: "👩‍💻",
    position: "Аналитик",
    department: "Координационный отдел",
    role: "specialist",
    status: "active",
    experience: "4 года",
    experienceInOrg: "2 года",
    workload: 82,
    effectiveness: 89,
    phone: "+7 (992) 345-67-89",
    email: "tatiana.kuznetsova@zabota.org",
    hireDate: "20.08.2022",
    salary: 85000,
    activeClients: 0,
    completedCases: 67,
    qualityRating: 4.7,
    performance: 90,
    quality: 92,
    deadlineAdherence: 88,
    skills: ["Аналитика данных", "Статистика", "Отчетность", "Визуализация", "SQL", "Excel"],
    currentTasks: [
      { 
        id: 'T16',
        description: "Анализ эффективности программ за год", 
        priority: "high", 
        deadline: "28.12.2024",
        status: "inProgress",
        estimatedHours: 15
      }
    ]
  },
  {
    id: 'EMP-012',
    name: "Белов Артем Игоревич",
    avatar: "👨‍🔧",
    position: "Технический специалист",
    department: "Административный отдел",
    role: "specialist",
    status: "active",
    experience: "3 года",
    experienceInOrg: "1 год",
    workload: 65,
    effectiveness: 81,
    phone: "+7 (993) 456-78-90",
    email: "artem.belov@zabota.org",
    hireDate: "15.11.2023",
    salary: 60000,
    activeClients: 0,
    completedCases: 34,
    qualityRating: 4.5,
    performance: 83,
    quality: 85,
    deadlineAdherence: 80,
    skills: ["Техническое обслуживание", "Ремонт оборудования", "IT поддержка", "Логистика"],
    currentTasks: [
      { 
        id: 'T17',
        description: "Обслуживание оргтехники", 
        priority: "medium", 
        deadline: "19.12.2024",
        status: "inProgress",
        estimatedHours: 3
      }
    ]
  }
];

const personnelMetrics: PersonnelMetric[] = [
  { 
    category: "Всего сотрудников", 
    value: "89", 
    trend: "up", 
    color: "#3B82F6",
    icon: "👥",
    change: "+5",
    description: "В штате организации"
  },
  { 
    category: "Социальные работники", 
    value: "45", 
    trend: "stable", 
    color: "#10B981",
    icon: "👨‍💼",
    description: "Основной операционный персонал"
  },
  { 
    category: "Активных сотрудников", 
    value: "82", 
    trend: "up", 
    color: "#8B5CF6",
    icon: "✅",
    change: "+3",
    description: "На рабочих местах"
  },
  { 
    category: "Средняя загрузка", 
    value: "78%", 
    trend: "stable", 
    color: "#F59E0B",
    icon: "📊",
    description: "Оптимальный уровень"
  },
  { 
    category: "Эффективность", 
    value: "87%", 
    trend: "up", 
    color: "#06B6D4",
    icon: "⭐",
    change: "+2%",
    description: "Выше отраслевых стандартов"
  },
  { 
    category: "Текучесть кадров", 
    value: "8%", 
    trend: "down", 
    color: "#EC4899",
    icon: "📉",
    change: "-3%",
    description: "Ниже среднего по отрасли"
  }
];

const departmentDistribution: Department[] = [
  { 
    name: "Социальный патронаж", 
    count: 45, 
    percentage: 51, 
    color: "#3B82F6",
    manager: "Смирнова А.И.",
    budget: 4500000,
    location: "Основной корпус"
  },
  { 
    name: "Психологическая служба", 
    count: 18, 
    percentage: 20, 
    color: "#8B5CF6",
    manager: "Петрова М.В.",
    budget: 2200000,
    location: "Корпус Б"
  },
  { 
    name: "Медицинский уход", 
    count: 12, 
    percentage: 13, 
    color: "#EF4444",
    manager: "Козлов Д.С.",
    budget: 1800000,
    location: "Медицинский корпус"
  },
  { 
    name: "Юридический отдел", 
    count: 8, 
    percentage: 9, 
    color: "#10B981",
    manager: "Новикова О.И.",
    budget: 1200000,
    location: "Основной корпус"
  },
  { 
    name: "Администрация", 
    count: 6, 
    percentage: 7, 
    color: "#F59E0B",
    manager: "Соколов А.В.",
    budget: 800000,
    location: "Административный корпус"
  }
];

// ========== ХУКИ И УТИЛИТЫ ==========

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

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// ========== ОСНОВНОЙ КОМПОНЕНТ СТРАНИЦЫ ==========

export default function EnhancedPersonnelPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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

  // Фильтрация сотрудников
  const filteredEmployees = useMemo(() => {
    return employeesData.filter(employee => {
      const matchesSearch = 
        employee.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
      const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [debouncedSearchTerm, filterDepartment, filterStatus]);

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleEditEmployee = (employee: Employee) => {
    // Здесь будет логика редактирования сотрудника
    console.log('Редактирование сотрудника:', employee);
  };

  const departments = useMemo(() => {
    const uniqueDepartments = [...new Set(employeesData.map(emp => emp.department))];
    return uniqueDepartments;
  }, []);

  const statusCounts = useMemo(() => {
    const counts = {
      active: 0,
      vacation: 0,
      sick: 0,
      training: 0,
      remote: 0,
      business_trip: 0
    };
    
    employeesData.forEach(emp => {
      counts[emp.status]++;
    });
    
    return counts;
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>
      <style jsx global>{`
        .bento-section {
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-intensity: 0;
          --glow-radius: ${DEFAULT_SPOTLIGHT_RADIUS}px;
          --glow-color: ${DEFAULT_GLOW_COLOR};
          --border-color: rgba(255, 255, 255, 0.1);
          --background-dark: #060010;
          --white: hsl(0, 0%, 100%);
        }
        
        .card--border-glow {
          position: relative;
          background: 
            radial-gradient(ellipse at var(--glow-x) var(--glow-y), 
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.4)) 0%,
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.2)) 25%,
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.08)) 50%,
              transparent 70%
            ),
            linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%);
        }
        
        .card--border-glow::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 2px;
          background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.9)) 0%,
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.5)) 30%,
              transparent 60%);
          border-radius: inherit;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: subtract;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          pointer-events: none;
          z-index: 1;
        }
        
        .global-spotlight {
          mix-blend-mode: screen;
          pointer-events: none;
        }
        
        .advanced-particle {
          filter: blur(1px);
          animation: float 4s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        @media (max-width: 640px) {
          .personnel-metrics {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }
          
          .employees-grid {
            grid-template-columns: 1fr;
          }
          
          .bento-section {
            padding: 0.75rem;
          }
        }

        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr;
          }
          
          .card--border-glow::before {
            padding: 1px;
          }
        }

        @media (max-width: 1024px) {
          .advanced-particle-card {
            transform: none !important;
          }
        }

        /* Улучшения для touch устройств */
        @media (hover: none) and (pointer: coarse) {
          .card--border-glow:hover {
            transform: none;
          }
          
          .advanced-particle-card {
            cursor: pointer;
          }
          
          .global-spotlight {
            display: none;
          }
        }

        /* Оптимизация анимаций для мобильных */
        @media (prefers-reduced-motion: reduce) {
          .advanced-particle,
          .card--border-glow::before,
          .global-spotlight {
            display: none;
          }
          
          .motion-div {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/demo/social/owner" className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group">
                <motion.span
                  whileHover={{ x: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  ←
                </motion.span>
                <span className="text-sm sm:text-base">На главную</span>
              </Link>
              <div className="text-white/60 text-xs sm:text-sm text-right hidden sm:block">
                <div>{currentDate}</div>
                <div>{currentTime}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.div 
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-white text-xs sm:text-sm">Штат активен</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Заголовок страницы */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 md:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <motion.h1 
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-3xl sm:text-4xl">👨‍💼</span>
                  <span>Управление персоналом</span>
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-base sm:text-lg mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  89 профессионалов • Высокая квалификация • Оптимальная загрузка • Эффективная команда
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-1 sm:gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>82 активных</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>87% эффективность</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>78% средняя загрузка</span>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="text-right w-full sm:w-auto"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-white font-bold text-xl sm:text-2xl bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg animate-float inline-block">
                  94%
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Занятость</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сегодня</div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-xl sm:blur-2xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-tr from-emerald-500/15 to-cyan-500/15 rounded-full blur-lg sm:blur-xl" />
          </div>
        </motion.section>

        {/* Основные метрики персонала */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-4 personnel-metrics">
            {personnelMetrics.map((metric, index) => (
              <motion.div 
                key={index} 
                className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-2 sm:p-4 text-center cursor-pointer hover:bg-white/10 transition-all duration-300 group"
                style={{ '--glow-color': metric.color.replace('#', '').replace(/../g, x => x+',') } as React.CSSProperties}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                whileHover={{ y: -3, scale: 1.02 }}
              >
                <motion.div 
                  className="text-2xl sm:text-3xl mb-1 sm:mb-3"
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {metric.icon}
                </motion.div>
                <div className="text-white font-bold text-lg sm:text-xl mb-1 sm:mb-2">{metric.value}</div>
                <div className="text-white/60 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2">{metric.category}</div>
                <div className="flex items-center justify-center gap-1">
                  {metric.change && (
                    <span className={`text-xs ${
                      metric.trend === 'up' ? 'text-green-400' : 
                      metric.trend === 'down' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {metric.change}
                    </span>
                  )}
                  <span className={`text-xs ${
                    metric.trend === 'up' ? 'text-green-400' : 
                    metric.trend === 'down' ? 'text-red-400' : 'text-blue-400'
                  }`}>
                    {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                  </span>
                </div>
                {metric.description && (
                  <div className="text-white/40 text-xs mt-2 hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {metric.description}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Bento Grid с анимациями */}
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={true}
          spotlightRadius={DEFAULT_SPOTLIGHT_RADIUS}
          glowColor={DEFAULT_GLOW_COLOR}
        />

        {/* Основная сетка с сотрудниками */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <BentoCardGrid gridRef={gridRef} className="employees-grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredEmployees.map((employee, index) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  index={index}
                  onCardClick={handleEmployeeClick}
                />
              ))}
            </div>

            {filteredEmployees.length === 0 && (
              <motion.div 
                className="text-center py-12 sm:py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">🔍</div>
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Сотрудники не найдены</h3>
                <p className="text-white/60 text-base sm:text-lg">
                  Попробуйте изменить параметры поиска или фильтры
                </p>
              </motion.div>
            )}
          </BentoCardGrid>
        </motion.section>

        {/* Аналитика и распределение */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Распределение по отделам */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">📊</span>
                  <span>Распределение по отделам</span>
                </h3>
                <Link href="/demo/social/owner/modules/personnel/departments" className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm flex items-center gap-1 sm:gap-2 transition-colors group">
                  <span>Все отделы</span>
                  <motion.span
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    →
                  </motion.span>
                </Link>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {departmentDistribution.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    whileHover={{ x: 2 }}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      <motion.div 
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm truncate">{item.name}</div>
                        <div className="text-white/60 text-xs">{item.count} сотрудников</div>
                      </div>
                    </div>
                    <div className="text-white font-bold text-base sm:text-lg flex-shrink-0 ml-2 sm:ml-3 bg-white/5 px-2 sm:px-3 py-1 rounded-lg border border-white/10">
                      {item.percentage}%
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-500/10 rounded-lg sm:rounded-xl border border-blue-500/20 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-blue-400 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                  <span>💡</span>
                  <span>Крупнейший отдел: Социальный патронаж (51%)</span>
                </div>
                <div className="text-blue-400/60 text-xs mt-1 sm:mt-2">
                  Основная операционная деятельность организации
                </div>
              </motion.div>
            </div>

            {/* Эффективность работы */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">📈</span>
                <span>Эффективность работы</span>
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="flex justify-between text-white text-sm mb-2">
                    <span>Средняя производительность</span>
                    <span>87%</span>
                  </div>
                  <ProgressBar value={87} label="По организации" color="#10B981" />
                </div>
                <div>
                  <div className="flex justify-between text-white text-sm mb-2">
                    <span>Качество услуг</span>
                    <span>92%</span>
                  </div>
                  <ProgressBar value={92} color="#3B82F6" />
                </div>
                <div>
                  <div className="flex justify-between text-white text-sm mb-2">
                    <span>Соблюдение сроков</span>
                    <span>89%</span>
                  </div>
                  <ProgressBar value={89} color="#F59E0B" />
                </div>
                <div>
                  <div className="flex justify-between text-white text-sm mb-2">
                    <span>Удовлетворенность клиентов</span>
                    <span>94%</span>
                  </div>
                  <ProgressBar value={94} color="#8B5CF6" />
                </div>
              </div>

              <motion.div 
                className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-500/10 rounded-lg sm:rounded-xl border border-green-500/20 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="text-green-400 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                  <span>✅</span>
                  <span>Все показатели выше отраслевых стандартов</span>
                </div>
                <div className="text-green-400/60 text-xs mt-1 sm:mt-2">
                  Команда работает эффективно и профессионально
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Быстрые действия и контакты */}
        <motion.section
          className="mt-6 sm:mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Быстрые действия */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">🚀</span>
                <span>Быстрые действия</span>
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { icon: '👤', label: 'Добавить нового сотрудника', color: 'blue' },
                  { icon: '📊', label: 'Сформировать отчет по персоналу', color: 'green' },
                  { icon: '📅', label: 'Управление графиком отпусков', color: 'purple' },
                  { icon: '💰', label: 'Рассчитать заработную плату', color: 'orange' }
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    className={`w-full bg-${action.color}-500/20 hover:bg-${action.color}-500/30 border border-${action.color}-500/30 text-${action.color}-400 px-3 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm font-medium text-left flex items-center gap-3 sm:gap-4 group backdrop-blur-sm`}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.6 }}
                  >
                    <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300">{action.icon}</span>
                    <span className="flex-1 text-left">{action.label}</span>
                    <motion.span
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ x: 2 }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Контакты руководителей */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">📞</span>
                <span>Руководители отделов</span>
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { name: "Смирнова Анна Ивановна", role: "Руководитель социального патронажа", email: "anna.smirnova@zabota.org" },
                  { name: "Петрова Мария Владимировна", role: "Руководитель психологической службы", email: "maria.petrova@zabota.org" },
                  { name: "Козлов Дмитрий Сергеевич", role: "Руководитель медицинского ухода", email: "dmitry.kozlov@zabota.org" }
                ].map((contact, index) => (
                  <motion.div 
                    key={index}
                    className="p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.7 }}
                    whileHover={{ scale: 1.01, y: -1 }}
                  >
                    <div className="text-white font-medium text-sm mb-1">{contact.name}</div>
                    <div className="text-white/60 text-xs mb-2">{contact.role}</div>
                    <div className="text-blue-400 text-xs group-hover:text-blue-300 transition-colors truncate">{contact.email}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Статистика статусов */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">📋</span>
                <span>Статусы сотрудников</span>
              </h3>
              <div className="space-y-3">
                {[
                  { status: 'active', label: 'Активны', count: statusCounts.active, color: '#10B981' },
                  { status: 'vacation', label: 'В отпуске', count: statusCounts.vacation, color: '#F59E0B' },
                  { status: 'sick', label: 'На больничном', count: statusCounts.sick, color: '#EF4444' },
                  { status: 'training', label: 'На обучении', count: statusCounts.training, color: '#3B82F6' },
                  { status: 'remote', label: 'Удаленно', count: statusCounts.remote, color: '#8B5CF6' },
                  { status: 'business_trip', label: 'В командировке', count: statusCounts.business_trip, color: '#EC4899' }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.8 }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-white text-sm">{item.label}</span>
                    </div>
                    <span className="text-white font-bold text-sm">{item.count}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Модальное окно с деталями сотрудника */}
      <EmployeeDetailsModal
        employee={selectedEmployee}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={handleEditEmployee}
      />

      {/* Footer */}
      <motion.footer 
        className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-8 sm:mt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-white/60 text-xs sm:text-sm">
            <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
              <span>© 2024 Система управления социальными услугами</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Управление персоналом v2.0</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <span>{employeesData.length} сотрудников в системе</span>
              <span>•</span>
              <span>Обновлено: {formatRelativeTime(new Date().toISOString())}</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}