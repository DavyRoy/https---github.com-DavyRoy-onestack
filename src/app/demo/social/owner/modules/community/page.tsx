'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 400;
const DEFAULT_GLOW_COLOR = '59, 130, 246';
const MOBILE_BREAKPOINT = 768;

interface SocialProgram {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'active' | 'planned' | 'completed' | 'paused';
  startDate: string;
  endDate: string;
  budget: number;
  usedBudget: number;
  participants: number;
  targetAudience: string;
  objectives: string[];
  metrics: ProgramMetric[];
  responsible: string;
  color: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  progress: number;
  size?: 'small' | 'medium' | 'large';
  impact?: string;
  successStories?: string[];
  challenges?: string[];
  nextSteps?: string[];
}

interface ProgramMetric {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  description?: string;
}

interface Volunteer {
  id: string;
  name: string;
  role: string;
  programs: string[];
  hoursPerWeek: number;
  status: 'active' | 'inactive' | 'training';
  joinDate: string;
  skills: string[];
  color: string;
  avatar: string;
  completedTasks: number;
  performance?: number;
  email?: string;
  phone?: string;
  achievements?: string[];
  availability?: string[];
  notes?: string;
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  maxParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  category: string;
  organizer: string;
  color: string;
  icon: string;
  importance?: 'high' | 'medium' | 'low';
  agenda?: string[];
  materials?: string[];
  feedback?: EventFeedback[];
}

interface EventFeedback {
  id: string;
  participant: string;
  rating: number;
  comment: string;
  date: string;
}

interface ImpactMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
  icon: string;
  color: string;
  link?: string;
  details?: string;
}

// ========== УТИЛИТЫ ==========

const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', { 
    style: 'currency', 
    currency: 'RUB',
    maximumFractionDigits: 0 
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusColor = (status: SocialProgram['status']) => {
  switch (status) {
    case 'active': return COLORS.success;
    case 'planned': return COLORS.orange;
    case 'completed': return COLORS.blue;
    case 'paused': return COLORS.error;
    default: return COLORS.gray;
  }
};

const getStatusText = (status: SocialProgram['status']) => {
  switch (status) {
    case 'active': return 'Активна';
    case 'planned': return 'Планируется';
    case 'completed': return 'Завершена';
    case 'paused': return 'Приостановлена';
    default: return 'Неизвестно';
  }
};

const getPriorityColor = (priority: SocialProgram['priority']) => {
  switch (priority) {
    case 'high': return COLORS.error;
    case 'medium': return COLORS.warning;
    case 'low': return COLORS.success;
    default: return COLORS.gray;
  }
};

const getPriorityText = (priority: SocialProgram['priority']) => {
  switch (priority) {
    case 'high': return 'Высокий';
    case 'medium': return 'Средний';
    case 'low': return 'Низкий';
    default: return 'Неизвестно';
  }
};

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'advanced-particle';
  el.style.cssText = `
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(${color}, 1) 0%, rgba(${color}, 0.3) 70%);
    box-shadow: 0 0 15px rgba(${color}, 0.9), 0 0 30px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
    filter: blur(0.8px);
  `;
  return el;
};

// ========== ЗАГЛУШКИ ДЛЯ ПЕРЕХОДОВ ==========

const NavigationStub: React.FC<{
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ to, children, className = '', onClick }) => {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    
    // Показываем заглушку на 1.5 секунды перед переходом
    setTimeout(() => {
      if (onClick) {
        onClick();
      }
      window.location.href = to;
    }, 1500);
  };

  return (
    <>
      <Link 
        href={to} 
        className={className}
        onClick={handleClick}
        prefetch={false}
      >
        {children}
      </Link>
      
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-white text-xl font-bold mb-2">Загружаем данные...</h3>
              <p className="text-white/60">Подготовка информации для просмотра</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
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

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

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
    if (!cardRef.current || !isHoveredRef.current || disableAnimations) return;

    const rect = cardRef.current.getBoundingClientRect();
    
    for (let i = 0; i < particleCount; i++) {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        const particle = createParticleElement(x, y, glowColor);
        cardRef.current.appendChild(particle);
        particlesRef.current.push(particle);

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
  }, [particleCount, glowColor, intensity, disableAnimations]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      if (!disableAnimations) {
        animateParticles();
      }

      if (enableTilt && !disableAnimations) {
        gsap.to(element, {
          rotateX: 4,
          rotateY: 4,
          scale: 1.03,
          duration: 0.5,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      gsap.to(element, {
        '--glow-intensity': 1,
        duration: 0.4,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      if (!disableAnimations) {
        clearAllParticles();
      }

      if (enableTilt && !disableAnimations) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        });
      }

      gsap.to(element, {
        '--glow-intensity': 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if ((!enableTilt && !enableMagnetism) || disableAnimations) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      element.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
      element.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
    };

    const handleClick = (e: MouseEvent) => {
      if (clickEffect && !disableAnimations) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

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
      whileHover={!disableAnimations ? { y: -6 } : {}}
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

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlight || !gridRef.current) return;

      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      if (!mouseInside) {
        gsap.to(spotlight, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out'
        });
        return;
      }

      gsap.to(spotlight, {
        left: e.clientX,
        top: e.clientY,
        opacity: 0.9,
        duration: 0.15,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      if (spotlight) {
        gsap.to(spotlight, {
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
      spotlight?.remove();
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
    className={`bento-section grid gap-4 sm:gap-6 p-4 sm:p-6 max-w-7xl mx-auto select-none relative ${className}`}
    ref={gridRef}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// ========== УЛУЧШЕННЫЕ МОДАЛЬНЫЕ ОКНА ==========

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  showCloseButton?: boolean;
  overlayClose?: boolean;
}> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  overlayClose = true
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    fullscreen: 'max-w-full max-h-full m-4'
  };

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

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(modalRef.current, 
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={overlayClose ? onClose : undefined}
    >
      <motion.div
        ref={modalRef}
        className={`bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/20 shadow-2xl w-full ${sizeClasses[size]} ${size === 'fullscreen' ? 'h-[calc(100vh-2rem)]' : 'max-h-[90vh]'} overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 text-white/60 hover:text-white hover:rotate-90 transform transition-transform"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className={`p-6 overflow-y-auto ${size === 'fullscreen' ? 'h-[calc(100%-80px)]' : 'max-h-[calc(90vh-80px)]'}`}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Специализированные модальные окна
const ProgramDetailsModal: React.FC<{
  program: SocialProgram;
  isOpen: boolean;
  onClose: () => void;
}> = ({ program, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={program.name} size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2">Описание программы</h3>
              <p className="text-white/70">{program.description}</p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-2">Целевая аудитория</h3>
              <p className="text-white/70">{program.targetAudience}</p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Цели программы</h3>
              <ul className="text-white/70 space-y-1">
                {program.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Бюджет</div>
                <div className="text-white font-bold">{formatCurrency(program.budget)}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Участники</div>
                <div className="text-white font-bold">{program.participants}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Прогресс</div>
                <div className="text-white font-bold">{program.progress}%</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Статус</div>
                <div 
                  className="font-bold"
                  style={{ color: `rgb(${getStatusColor(program.status)})` }}
                >
                  {getStatusText(program.status)}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Метрики эффективности</h3>
              <div className="space-y-3">
                {program.metrics.map((metric) => (
                  <div key={metric.id} className="bg-white/5 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white text-sm">{metric.name}</span>
                      <span className="text-white font-bold">
                        {metric.currentValue}{metric.unit}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${(metric.currentValue / metric.targetValue) * 100}%`,
                          backgroundColor: `rgb(${program.color})`
                        }}
                      />
                    </div>
                    <div className="text-white/60 text-xs mt-1 text-right">
                      Цель: {metric.targetValue}{metric.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {program.successStories && (
          <div>
            <h3 className="text-white font-semibold mb-3">Успешные кейсы</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {program.successStories.map((story, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border-l-4 border-green-500">
                  <p className="text-white/70 text-sm">{story}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
          >
            Закрыть
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
            Редактировать программу
          </button>
        </div>
      </div>
    </Modal>
  );
};

const VolunteerDetailsModal: React.FC<{
  volunteer: Volunteer;
  isOpen: boolean;
  onClose: () => void;
}> = ({ volunteer, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Профиль волонтера: ${volunteer.name}`} size="md">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl bg-white/10 rounded-2xl w-16 h-16 flex items-center justify-center">
            {volunteer.avatar}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">{volunteer.name}</h3>
            <p className="text-white/60">{volunteer.role}</p>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80">
                {volunteer.status === 'active' ? 'Активен' : volunteer.status === 'training' ? 'Обучение' : 'Неактивен'}
              </span>
              {volunteer.performance && (
                <span className="px-2 py-1 bg-green-500/20 rounded-full text-xs text-green-400">
                  Эффективность: {volunteer.performance}%
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-white/60 text-sm">Часов в неделю</div>
            <div className="text-white font-bold text-xl">{volunteer.hoursPerWeek}ч</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-white/60 text-sm">Выполнено задач</div>
            <div className="text-white font-bold text-xl">{volunteer.completedTasks}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-white/60 text-sm">В команде с</div>
            <div className="text-white font-bold">
              {new Date(volunteer.joinDate).toLocaleDateString('ru-RU')}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-white/60 text-sm">Статус</div>
            <div className="text-white font-bold capitalize">
              {volunteer.status === 'active' ? 'Активен' : volunteer.status === 'training' ? 'Обучение' : 'Неактивен'}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Навыки и компетенции</h4>
          <div className="flex flex-wrap gap-2">
            {volunteer.skills.map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80 hover:bg-white/20 transition-colors cursor-pointer"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {volunteer.achievements && (
          <div>
            <h4 className="text-white font-semibold mb-3">Достижения</h4>
            <div className="space-y-2">
              {volunteer.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2 text-white/70">
                  <span className="text-yellow-400">🏆</span>
                  {achievement}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
          >
            Закрыть
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
            Связаться
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ========== РАСШИРЕННЫЕ ДЕМО ДАННЫЕ ==========

const socialPrograms: SocialProgram[] = [
  {
    id: '1',
    name: 'Активное долголетие',
    category: 'Пожилые люди',
    description: 'Программа социальной адаптации и поддержки граждан пожилого возраста через культурные мероприятия и образовательные курсы. Включает психологическую поддержку, физическую активность и социальную интеграцию.',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-12-20',
    budget: 2500000,
    usedBudget: 1870000,
    participants: 156,
    targetAudience: 'Граждане старше 60 лет',
    objectives: [
      'Социальная адаптация пожилых людей',
      'Профилактика одиночества и изоляции',
      'Развитие активного образа жизни',
      'Образовательные программы и курсы',
      'Психологическая поддержка'
    ],
    metrics: [
      { 
        id: '1-1', 
        name: 'Участие в мероприятиях', 
        currentValue: 45, 
        targetValue: 60, 
        unit: '%', 
        trend: 'up',
        description: 'Процент регулярного участия в мероприятиях программы'
      },
      { 
        id: '1-2', 
        name: 'Удовлетворенность', 
        currentValue: 92, 
        targetValue: 90, 
        unit: '%', 
        trend: 'up',
        description: 'Уровень удовлетворенности участников программой'
      },
      { 
        id: '1-3', 
        name: 'Социальная активность', 
        currentValue: 78, 
        targetValue: 80, 
        unit: '%', 
        trend: 'stable',
        description: 'Показатель социальной вовлеченности участников'
      }
    ],
    responsible: 'Ольга Новикова',
    color: COLORS.blue,
    icon: '👵',
    priority: 'high',
    progress: 75,
    size: 'medium',
    impact: 'Улучшение качества жизни пожилых людей, снижение уровня одиночества',
    successStories: [
      '78-летняя Анна Петрова начала заниматься скандинавской ходьбой и нашла новых друзей',
      'Бывший инженер Михаил Сидоров освоил компьютерную грамотность и общается с внуками по видеосвязи',
      'Группа участников организовала собственный хор и выступает на городских мероприятиях'
    ],
    challenges: [
      'Недостаточное количество волонтеров для сопровождения маломобильных участников',
      'Ограниченный бюджет на транспортные расходы'
    ],
    nextSteps: [
      'Расширение географии программы на отдаленные районы',
      'Привлечение дополнительных волонтеров',
      'Разработка онлайн-формата мероприятий'
    ]
  },
  {
    id: '2',
    name: 'Семейная поддержка',
    category: 'Семьи',
    description: 'Комплексная поддержка семей в трудной жизненной ситуации с предоставлением материальной и психологической помощи. Включает консультации специалистов, материальную помощь и развивающие программы для детей.',
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2024-11-30',
    budget: 1800000,
    usedBudget: 1250000,
    participants: 89,
    targetAudience: 'Многодетные и малообеспеченные семьи',
    objectives: [
      'Материальная помощь семьям',
      'Психологическая поддержка',
      'Юридические консультации',
      'Детские развивающие программы',
      'Профилактика социального сиротства'
    ],
    metrics: [
      { 
        id: '2-1', 
        name: 'Стабильность семей', 
        currentValue: 85, 
        targetValue: 80, 
        unit: '%', 
        trend: 'up',
        description: 'Процент семей, сохранивших стабильность после участия в программе'
      },
      { 
        id: '2-2', 
        name: 'Доступ к образованию', 
        currentValue: 92, 
        targetValue: 90, 
        unit: '%', 
        trend: 'up',
        description: 'Обеспечение доступа детей к образовательным программам'
      },
      { 
        id: '2-3', 
        name: 'Улучшение жилищных условий', 
        currentValue: 45, 
        targetValue: 60, 
        unit: '%', 
        trend: 'stable',
        description: 'Процент семей, улучшивших жилищные условия'
      }
    ],
    responsible: 'Мария Сидорова',
    color: COLORS.purple,
    icon: '👨‍👩‍👧‍👦',
    priority: 'high',
    progress: 69,
    size: 'medium',
    impact: 'Сохранение семейной среды для детей, улучшение социального благополучия',
    successStories: [
      'Семья Ивановых получила юридическую помощь и сохранила жилье',
      'Трое детей из многодетной семьи начали посещать дополнительные образовательные курсы',
      'Родители прошли курсы по финансовой грамотности и улучшили семейный бюджет'
    ]
  },
  {
    id: '3',
    name: 'Молодежный центр развития',
    category: 'Молодежь',
    description: 'Программа развития и поддержки молодежи из группы риска через профориентацию и социальную интеграцию. Включает образовательные курсы, карьерное консультирование и социальную адаптацию.',
    status: 'active',
    startDate: '2024-02-10',
    endDate: '2024-12-15',
    budget: 3200000,
    usedBudget: 2450000,
    participants: 234,
    targetAudience: 'Молодежь 14-25 лет',
    objectives: [
      'Профориентация и трудоустройство',
      'Образовательные курсы и тренинги',
      'Социальная интеграция',
      'Развитие лидерских качеств',
      'Профилактика асоциального поведения'
    ],
    metrics: [
      { 
        id: '3-1', 
        name: 'Трудоустройство', 
        currentValue: 65, 
        targetValue: 70, 
        unit: '%', 
        trend: 'up',
        description: 'Процент участников, нашедших работу после программы'
      },
      { 
        id: '3-2', 
        name: 'Образовательные курсы', 
        currentValue: 88, 
        targetValue: 85, 
        unit: '%', 
        trend: 'up',
        description: 'Процент участников, завершивших образовательные курсы'
      },
      { 
        id: '3-3', 
        name: 'Социальная адаптация', 
        currentValue: 82, 
        targetValue: 80, 
        unit: '%', 
        trend: 'stable',
        description: 'Уровень социальной адаптации участников'
      }
    ],
    responsible: 'Сергей Иванов',
    color: COLORS.orange,
    icon: '🎓',
    priority: 'medium',
    progress: 77,
    size: 'large',
    impact: 'Снижение уровня безработицы среди молодежи, развитие профессиональных навыков'
  },
  {
    id: '4',
    name: 'Инклюзивная среда',
    category: 'Люди с инвалидностью',
    description: 'Создание доступной среды и поддержка людей с ограниченными возможностями здоровья. Программа включает адаптацию инфраструктуры, социальную интеграцию и профессиональную реабилитацию.',
    status: 'planned',
    startDate: '2025-01-15',
    endDate: '2025-12-20',
    budget: 4500000,
    usedBudget: 0,
    participants: 0,
    targetAudience: 'Люди с инвалидностью',
    objectives: [
      'Доступная инфраструктура',
      'Социальная интеграция',
      'Трудоустройство',
      'Психологическая поддержка',
      'Развитие инклюзивных практик'
    ],
    metrics: [
      { 
        id: '4-1', 
        name: 'Доступность объектов', 
        currentValue: 0, 
        targetValue: 50, 
        unit: '%', 
        trend: 'stable',
        description: 'Процент адаптированных социальных объектов'
      },
      { 
        id: '4-2', 
        name: 'Трудоустройство', 
        currentValue: 0, 
        targetValue: 40, 
        unit: '%', 
        trend: 'stable',
        description: 'Процент трудоустроенных участников программы'
      }
    ],
    responsible: 'Алексей Комаров',
    color: COLORS.emerald,
    icon: '♿',
    priority: 'medium',
    progress: 0,
    size: 'large',
    impact: 'Создание безбарьерной среды, повышение качества жизни людей с инвалидностью'
  },
  {
    id: '5',
    name: 'Экологическое волонтерство',
    category: 'Экология',
    description: 'Программа развития экологической культуры и волонтерства через городские акции и образовательные проекты. Включает озеленение территорий, уборку общественных пространств и экологическое просвещение.',
    status: 'active',
    startDate: '2024-04-01',
    endDate: '2024-10-31',
    budget: 850000,
    usedBudget: 520000,
    participants: 67,
    targetAudience: 'Все желающие',
    objectives: [
      'Экологическое просвещение',
      'Озеленение территорий',
      'Уборка общественных пространств',
      'Раздельный сбор отходов',
      'Развитие волонтерского движения'
    ],
    metrics: [
      { 
        id: '5-1', 
        name: 'Участие в акциях', 
        currentValue: 85, 
        targetValue: 80, 
        unit: '%', 
        trend: 'up',
        description: 'Процент регулярного участия в экологических акциях'
      },
      { 
        id: '5-2', 
        name: 'Озеленение территории', 
        currentValue: 120, 
        targetValue: 100, 
        unit: 'деревьев', 
        trend: 'up',
        description: 'Количество высаженных деревьев и кустарников'
      }
    ],
    responsible: 'Елена Ковалева',
    color: COLORS.teal,
    icon: '🌱',
    priority: 'low',
    progress: 61,
    size: 'small',
    impact: 'Улучшение экологической обстановки, развитие экологической культуры'
  },
  {
    id: '6',
    name: 'Кризисная помощь',
    category: 'Экстренная помощь',
    description: 'Программа оперативной помощи людям в кризисных ситуациях с предоставлением временного жилья и поддержки. Включает экстренную материальную помощь, психологическую поддержку и социальное сопровождение.',
    status: 'completed',
    startDate: '2024-01-10',
    endDate: '2024-06-30',
    budget: 1200000,
    usedBudget: 1200000,
    participants: 45,
    targetAudience: 'Люди в трудной жизненной ситуации',
    objectives: [
      'Экстренная материальная помощь',
      'Временное жилье',
      'Психологическая поддержка',
      'Социальное сопровождение',
      'Помощь в восстановлении документов'
    ],
    metrics: [
      { 
        id: '6-1', 
        name: 'Оказано помощи', 
        currentValue: 100, 
        targetValue: 100, 
        unit: '%', 
        trend: 'stable',
        description: 'Процент выполненных запросов на помощь'
      },
      { 
        id: '6-2', 
        name: 'Удовлетворенность', 
        currentValue: 94, 
        targetValue: 90, 
        unit: '%', 
        trend: 'up',
        description: 'Уровень удовлетворенности полученной помощью'
      }
    ],
    responsible: 'Иван Петров',
    color: COLORS.rose,
    icon: '🆘',
    priority: 'high',
    progress: 100,
    size: 'medium',
    impact: 'Оперативная помощь в кризисных ситуациях, предотвращение социальных катастроф'
  },
  {
    id: '7',
    name: 'Детский развивающий центр',
    category: 'Дети',
    description: 'Развивающие занятия и психологическая поддержка для детей из неблагополучных семей. Программа включает творческие мастерские, образовательные занятия и психологическую коррекцию.',
    status: 'active',
    startDate: '2024-02-20',
    endDate: '2024-12-15',
    budget: 1950000,
    usedBudget: 1420000,
    participants: 123,
    targetAudience: 'Дети 3-12 лет',
    objectives: [
      'Развивающие занятия',
      'Психологическая поддержка',
      'Социальная адаптация',
      'Творческое развитие',
      'Профилактика школьной дезадаптации'
    ],
    metrics: [
      { 
        id: '7-1', 
        name: 'Участие в занятиях', 
        currentValue: 88, 
        targetValue: 85, 
        unit: '%', 
        trend: 'up',
        description: 'Процент регулярного посещения развивающих занятий'
      },
      { 
        id: '7-2', 
        name: 'Успеваемость', 
        currentValue: 76, 
        targetValue: 75, 
        unit: '%', 
        trend: 'up',
        description: 'Улучшение успеваемости в школе'
      }
    ],
    responsible: 'Анна Козлова',
    color: COLORS.pink,
    icon: '🧒',
    priority: 'medium',
    progress: 73,
    size: 'medium',
    impact: 'Развитие детей из неблагополучных семей, улучшение образовательных результатов'
  },
  {
    id: '8',
    name: 'Профессиональная переподготовка',
    category: 'Безработные',
    description: 'Программа профессионального обучения и переподготовки для людей, потерявших работу. Включает курсы повышения квалификации, карьерное консультирование и помощь в трудоустройстве.',
    status: 'active',
    startDate: '2024-03-15',
    endDate: '2024-11-30',
    budget: 2800000,
    usedBudget: 1980000,
    participants: 87,
    targetAudience: 'Безработные граждане',
    objectives: [
      'Профессиональное обучение',
      'Трудоустройство',
      'Карьерное консультирование',
      'Поддержка в адаптации',
      'Развитие soft skills'
    ],
    metrics: [
      { 
        id: '8-1', 
        name: 'Трудоустройство', 
        currentValue: 68, 
        targetValue: 70, 
        unit: '%', 
        trend: 'up',
        description: 'Процент трудоустроенных после завершения программы'
      },
      { 
        id: '8-2', 
        name: 'Завершение курсов', 
        currentValue: 92, 
        targetValue: 90, 
        unit: '%', 
        trend: 'up',
        description: 'Процент участников, завершивших обучение'
      }
    ],
    responsible: 'Дмитрий Семенов',
    color: COLORS.indigo,
    icon: '💼',
    priority: 'high',
    progress: 71,
    size: 'large',
    impact: 'Снижение уровня безработицы, повышение профессиональной квалификации'
  },
  {
    id: '9',
    name: 'Психологическая поддержка',
    category: 'Психологическая помощь',
    description: 'Бесплатные психологические консультации и группы поддержки для различных категорий населения. Включает индивидуальные консультации, групповые терапии и кризисное вмешательство.',
    status: 'active',
    startDate: '2024-01-20',
    endDate: '2024-12-15',
    budget: 950000,
    usedBudget: 670000,
    participants: 203,
    targetAudience: 'Все нуждающиеся в психологической помощи',
    objectives: [
      'Индивидуальные консультации',
      'Групповая терапия',
      'Кризисное вмешательство',
      'Профилактика выгорания',
      'Психологическое просвещение'
    ],
    metrics: [
      { 
        id: '9-1', 
        name: 'Проведено консультаций', 
        currentValue: 1560, 
        targetValue: 2000, 
        unit: 'сессий', 
        trend: 'up',
        description: 'Количество проведенных психологических консультаций'
      },
      { 
        id: '9-2', 
        name: 'Эффективность помощи', 
        currentValue: 89, 
        targetValue: 85, 
        unit: '%', 
        trend: 'up',
        description: 'Процент клиентов, отметивших улучшение состояния'
      }
    ],
    responsible: 'Екатерина Белова',
    color: COLORS.violet,
    icon: '🧠',
    priority: 'medium',
    progress: 70,
    size: 'medium',
    impact: 'Улучшение психологического благополучия населения, профилактика психических расстройств'
  },
  {
    id: '10',
    name: 'Цифровая грамотность',
    category: 'Образование',
    description: 'Обучение компьютерной грамотности и цифровым навыкам для пожилых людей и социально уязвимых групп. Включает базовые курсы работы с компьютером и интернетом.',
    status: 'active',
    startDate: '2024-02-05',
    endDate: '2024-10-31',
    budget: 620000,
    usedBudget: 430000,
    participants: 178,
    targetAudience: 'Пожилые люди и цифровые мигранты',
    objectives: [
      'Базовые компьютерные навыки',
      'Работа с интернетом',
      'Использование госуслуг онлайн',
      'Безопасность в сети',
      'Общение через интернет'
    ],
    metrics: [
      { 
        id: '10-1', 
        name: 'Завершили курсы', 
        currentValue: 82, 
        targetValue: 80, 
        unit: '%', 
        trend: 'up',
        description: 'Процент участников, успешно завершивших обучение'
      },
      { 
        id: '10-2', 
        name: 'Применяют навыки', 
        currentValue: 75, 
        targetValue: 70, 
        unit: '%', 
        trend: 'up',
        description: 'Процент участников, регулярно использующих полученные навыки'
      }
    ],
    responsible: 'Александр Петров',
    color: COLORS.cyan,
    icon: '💻',
    priority: 'low',
    progress: 69,
    size: 'small',
    impact: 'Цифровая интеграция уязвимых групп, повышение доступности цифровых услуг'
  }
];

const volunteers: Volunteer[] = [
  {
    id: '1',
    name: 'Анна Смирнова',
    role: 'Координатор программ',
    programs: ['1', '2'],
    hoursPerWeek: 20,
    status: 'active',
    joinDate: '2023-05-15',
    skills: ['Координация', 'Коммуникация', 'Организация мероприятий', 'Управление проектами', 'Работа с волонтерами'],
    color: COLORS.blue,
    avatar: '👩‍💼',
    completedTasks: 47,
    performance: 95,
    email: 'anna.smirnova@example.com',
    phone: '+7 (999) 123-45-67',
    achievements: [
      'Лучший координатор 2023 года',
      'Успешно запустила 3 новые программы',
      'Обучила 15 новых волонтеров'
    ],
    availability: ['Пн-Ср 10:00-18:00', 'Чт-Пт 14:00-20:00'],
    notes: 'Отлично справляется с координацией крупных мероприятий'
  },
  {
    id: '2',
    name: 'Дмитрий Волков',
    role: 'Социальный работник',
    programs: ['1', '3'],
    hoursPerWeek: 15,
    status: 'active',
    joinDate: '2024-01-20',
    skills: ['Социальная работа', 'Психология', 'Консультирование', 'Кризисное вмешательство', 'Работа с документами'],
    color: COLORS.purple,
    avatar: '👨‍⚕️',
    completedTasks: 32,
    performance: 88,
    email: 'dmitry.volkov@example.com',
    phone: '+7 (999) 234-56-78',
    achievements: [
      'Помог 25 семьям в трудной ситуации',
      'Разработал методику социального сопровождения'
    ],
    availability: ['Вт-Чт 9:00-17:00', 'Сб 10:00-14:00']
  },
  {
    id: '3',
    name: 'Екатерина Белова',
    role: 'Волонтер-психолог',
    programs: ['2', '9'],
    hoursPerWeek: 10,
    status: 'active',
    joinDate: '2024-03-10',
    skills: ['Психологическая помощь', 'Кризисное вмешательство', 'Групповая терапия', 'Арт-терапия'],
    color: COLORS.orange,
    avatar: '👩‍🎓',
    completedTasks: 28,
    performance: 92,
    email: 'ekaterina.belova@example.com',
    achievements: [
      'Провела 150+ психологических консультаций',
      'Организовала 5 терапевтических групп'
    ],
    availability: ['Пн-Ср 16:00-20:00']
  },
  {
    id: '4',
    name: 'Михаил Козлов',
    role: 'Эковолонтер',
    programs: ['5'],
    hoursPerWeek: 8,
    status: 'training',
    joinDate: '2024-06-05',
    skills: ['Экология', 'Организация мероприятий', 'Работа с инструментами', 'Садоводство'],
    color: COLORS.teal,
    avatar: '👨‍🌾',
    completedTasks: 12,
    performance: 75,
    email: 'mikhail.kozlov@example.com',
    availability: ['Сб-Вс 10:00-16:00'],
    notes: 'Проходит обучение по организации экологических акций'
  },
  {
    id: '5',
    name: 'София Иванова',
    role: 'Координатор мероприятий',
    programs: ['1', '3', '5'],
    hoursPerWeek: 12,
    status: 'active',
    joinDate: '2024-02-15',
    skills: ['Организация мероприятий', 'Логистика', 'Коммуникация', 'Работа с волонтерами', 'SMM'],
    color: COLORS.emerald,
    avatar: '👩‍💻',
    completedTasks: 35,
    performance: 90,
    email: 'sofia.ivanova@example.com',
    achievements: [
      'Организовала 20+ успешных мероприятий',
      'Увеличила охват мероприятий на 40%'
    ],
    availability: ['Пн-Пт 11:00-19:00']
  },
  {
    id: '6',
    name: 'Александр Петров',
    role: 'Юрист-консультант',
    programs: ['2', '6'],
    hoursPerWeek: 6,
    status: 'active',
    joinDate: '2024-04-20',
    skills: ['Юридическое консультирование', 'Документооборот', 'Защита прав', 'Семейное право'],
    color: COLORS.indigo,
    avatar: '👨‍⚖️',
    completedTasks: 18,
    performance: 85,
    email: 'alexander.petrov@example.com',
    achievements: [
      'Помог 30 семьям решить юридические вопросы',
      'Провел 50+ бесплатных консультаций'
    ],
    availability: ['Вт, Чт 18:00-21:00']
  },
  {
    id: '7',
    name: 'Ольга Кудрявцева',
    role: 'Педагог-организатор',
    programs: ['7'],
    hoursPerWeek: 18,
    status: 'active',
    joinDate: '2024-02-28',
    skills: ['Педагогика', 'Организация досуга', 'Работа с детьми', 'Творчество', 'Развивающие игры'],
    color: COLORS.pink,
    avatar: '👩‍🏫',
    completedTasks: 41,
    performance: 94,
    email: 'olga.kudryavtseva@example.com',
    achievements: [
      'Разработала 10 развивающих программ для детей',
      'Обучила 200+ детей творческим навыкам'
    ],
    availability: ['Пн-Пт 8:00-16:00']
  },
  {
    id: '8',
    name: 'Артем Васильев',
    role: 'Карьерный консультант',
    programs: ['8'],
    hoursPerWeek: 14,
    status: 'active',
    joinDate: '2024-03-22',
    skills: ['Карьерное консультирование', 'Профориентация', 'HR', 'Коучинг', 'Составление резюме'],
    color: COLORS.cyan,
    avatar: '👨‍💼',
    completedTasks: 29,
    performance: 89,
    email: 'artem.vasiliev@example.com',
    achievements: [
      'Помог 45 людям найти работу',
      'Провел 100+ карьерных консультаций'
    ],
    availability: ['Пн-Ср 14:00-20:00']
  },
  {
    id: '9',
    name: 'Марина Орлова',
    role: 'Медицинский волонтер',
    programs: ['1', '6'],
    hoursPerWeek: 10,
    status: 'active',
    joinDate: '2024-05-10',
    skills: ['Первая помощь', 'Медицинский уход', 'Работа с пожилыми', 'Гигиена', 'Профилактика'],
    color: COLORS.rose,
    avatar: '👩‍⚕️',
    completedTasks: 22,
    performance: 87,
    email: 'marina.orlova@example.com',
    availability: ['Вт, Чт, Сб 9:00-15:00']
  },
  {
    id: '10',
    name: 'Игорь Николаев',
    role: 'IT-волонтер',
    programs: ['10'],
    hoursPerWeek: 8,
    status: 'active',
    joinDate: '2024-04-15',
    skills: ['Компьютерная грамотность', 'Программирование', 'Техподдержка', 'Обучение', 'Цифровая безопасность'],
    color: COLORS.blue,
    avatar: '👨‍💻',
    completedTasks: 16,
    performance: 91,
    email: 'igor.nikolaev@example.com',
    achievements: [
      'Обучил 50+ пожилых людей компьютерной грамотности',
      'Настроил компьютерный класс'
    ],
    availability: ['Ср, Пт 17:00-21:00', 'Сб 10:00-14:00']
  }
];

const communityEvents: CommunityEvent[] = [
  {
    id: '1',
    title: 'Осенний субботник в парке',
    description: 'Массовая уборка и озеленение городского парка с участием волонтеров и местных жителей. Мероприятие включает уборку территории, посадку деревьев и экологический квест для детей.',
    date: '2024-09-28',
    time: '10:00',
    location: 'Центральный парк',
    participants: 45,
    maxParticipants: 60,
    status: 'upcoming',
    category: 'Экология',
    organizer: 'Елена Ковалева',
    color: COLORS.teal,
    icon: '🌳',
    importance: 'high',
    agenda: [
      '10:00 - Сбор участников, инструктаж',
      '10:30 - Начало уборки территории',
      '12:00 - Посадка новых деревьев',
      '13:00 - Экологический квест для детей',
      '14:00 - Подведение итогов, чаепитие'
    ],
    materials: ['Перчатки', 'Мешки для мусора', 'Саженцы деревьев', 'Инвентарь']
  },
  {
    id: '2',
    title: 'Семинар по финансовой грамотности',
    description: 'Образовательный семинар для многодетных семей по управлению бюджетом и планированию расходов. Практические советы по экономии и финансовому планированию.',
    date: '2024-09-25',
    time: '15:00',
    location: 'Центр социальной помощи',
    participants: 23,
    maxParticipants: 30,
    status: 'upcoming',
    category: 'Образование',
    organizer: 'Мария Сидорова',
    color: COLORS.purple,
    icon: '💰',
    importance: 'medium',
    agenda: [
      '15:00 - Приветствие, представление тренера',
      '15:15 - Основы финансового планирования',
      '16:00 - Практические кейсы по экономии',
      '16:45 - Вопросы и ответы',
      '17:15 - Индивидуальные консультации'
    ]
  },
  {
    id: '3',
    title: 'Творческая мастерская для пожилых',
    description: 'Занятия рукоделием и художественным творчеством для граждан пожилого возраста. Развитие мелкой моторики и творческих способностей.',
    date: '2024-09-22',
    time: '11:00',
    location: 'Клуб "Активное долголетие"',
    participants: 18,
    maxParticipants: 20,
    status: 'ongoing',
    category: 'Досуг',
    organizer: 'Ольга Новикова',
    color: COLORS.blue,
    icon: '🎨',
    importance: 'medium',
    agenda: [
      '11:00 - Знакомство с материалами',
      '11:30 - Мастер-класс по живописи',
      '13:00 - Перерыв на чай',
      '13:30 - Продолжение творческой работы',
      '15:00 - Выставка работ'
    ]
  },
  {
    id: '4',
    title: 'Ярмарка вакансий для молодежи',
    description: 'Встреча с работодателями и консультации по трудоустройству для молодых специалистов. Возможность пройти собеседование на месте.',
    date: '2024-09-20',
    time: '12:00',
    location: 'Молодежный центр',
    participants: 67,
    maxParticipants: 80,
    status: 'completed',
    category: 'Трудоустройство',
    organizer: 'Сергей Иванов',
    color: COLORS.orange,
    icon: '💼',
    importance: 'high',
    feedback: [
      {
        id: 'f1',
        participant: 'Анна К.',
        rating: 5,
        comment: 'Отличное мероприятие! Нашла подходящую вакансию.',
        date: '2024-09-20'
      },
      {
        id: 'f2',
        participant: 'Дмитрий П.',
        rating: 4,
        comment: 'Полезные консультации, хорошая организация.',
        date: '2024-09-20'
      }
    ]
  },
  {
    id: '5',
    title: 'Детский праздник "Золотая осень"',
    description: 'Развлекательная программа и творческие мастер-классы для детей из многодетных семей. Игры, конкурсы и подарки для всех участников.',
    date: '2024-09-30',
    time: '14:00',
    location: 'Городской дворец культуры',
    participants: 34,
    maxParticipants: 50,
    status: 'upcoming',
    category: 'Дети',
    organizer: 'Анна Козлова',
    color: COLORS.pink,
    icon: '🎪',
    importance: 'medium',
    agenda: [
      '14:00 - Начало праздника, игры',
      '15:00 - Творческие мастер-классы',
      '16:00 - Конкурсы и викторины',
      '17:00 - Награждение, вручение подарков',
      '17:30 - Чаепитие со сладостями'
    ]
  },
  {
    id: '6',
    title: 'Консультационный день для безработных',
    description: 'Бесплатные консультации по трудоустройству и профессиональной переподготовке. Помощь в составлении резюме и подготовке к собеседованию.',
    date: '2024-09-27',
    time: '10:00',
    location: 'Центр занятости',
    participants: 28,
    maxParticipants: 35,
    status: 'upcoming',
    category: 'Трудоустройство',
    organizer: 'Дмитрий Семенов',
    color: COLORS.indigo,
    icon: '📝',
    importance: 'high'
  },
  {
    id: '7',
    title: 'Психологический тренинг "Стресс-менеджмент"',
    description: 'Практический тренинг по управлению стрессом и эмоциональным выгоранием. Техники релаксации и восстановления ресурсов.',
    date: '2024-10-05',
    time: '18:00',
    location: 'Центр психологической помощи',
    participants: 15,
    maxParticipants: 20,
    status: 'upcoming',
    category: 'Психология',
    organizer: 'Екатерина Белова',
    color: COLORS.violet,
    icon: '🧘‍♀️',
    importance: 'medium'
  },
  {
    id: '8',
    title: 'Юридическая клиника',
    description: 'Бесплатные юридические консультации по жилищным, семейным и социальным вопросам. Прием ведут опытные юристы-волонтеры.',
    date: '2024-10-02',
    time: '16:00',
    location: 'Общественная приемная',
    participants: 22,
    maxParticipants: 25,
    status: 'upcoming',
    category: 'Юридическая помощь',
    organizer: 'Александр Петров',
    color: COLORS.indigo,
    icon: '⚖️',
    importance: 'high'
  }
];

const impactMetrics: ImpactMetric[] = [
  { 
    label: "Охвачено участников", 
    value: 1245, 
    change: 12, 
    trend: 'up', 
    description: "За текущий квартал", 
    icon: "👥", 
    color: COLORS.blue,
    details: "Активные участники всех программ"
  },
  { 
    label: "Активных программ", 
    value: 10, 
    change: 2, 
    trend: 'up', 
    description: "Из 12 запланированных", 
    icon: "📋", 
    color: COLORS.success,
    details: "Программы в стадии реализации"
  },
  { 
    label: "Волонтеров", 
    value: 89, 
    change: 8, 
    trend: 'up', 
    description: "Регулярно участвуют", 
    icon: "❤️", 
    color: COLORS.purple,
    details: "Активные волонтеры в системе"
  },
  { 
    label: "Проведено мероприятий", 
    value: 45, 
    change: 15, 
    trend: 'up', 
    description: "В этом месяце", 
    icon: "🎯", 
    color: COLORS.orange,
    details: "Завершенные и текущие мероприятия"
  },
  { 
    label: "Освоено бюджета", 
    value: 78, 
    change: 5, 
    trend: 'up', 
    description: "От общего объема", 
    icon: "💰", 
    color: COLORS.emerald,
    details: "Эффективное использование средств"
  },
  { 
    label: "Социальный эффект", 
    value: 92, 
    change: 3, 
    trend: 'up', 
    description: "Удовлетворенность участников", 
    icon: "⭐", 
    color: COLORS.amber,
    details: "По результатам опросов участников"
  },
  { 
    label: "Новых заявок", 
    value: 67, 
    change: 23, 
    trend: 'up', 
    description: "За последнюю неделю", 
    icon: "📥", 
    color: COLORS.cyan,
    details: "Заявки на участие в программах"
  },
  { 
    label: "Охват территорий", 
    value: 8, 
    change: 2, 
    trend: 'up', 
    description: "Районов города", 
    icon: "🗺️", 
    color: COLORS.teal,
    details: "Географический охват программ"
  }
];

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

// ========== ВИДЖЕТЫ ==========

function MetricCard({ metric }: { metric: ImpactMetric }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const content = (
    <motion.div 
      ref={ref}
      className="h-full flex flex-col justify-between p-4 sm:p-5"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start justify-between mb-3">
        <motion.div 
          className="text-2xl sm:text-3xl font-bold text-white leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          {formatNumber(metric.value)}
        </motion.div>
        <div className="flex flex-col items-end gap-1">
          <motion.div 
            className="text-xl sm:text-2xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={isVisible ? { scale: 1, rotate: 0 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            {metric.icon}
          </motion.div>
          <motion.div 
            className={`flex items-center gap-1 text-xs sm:text-sm px-2 py-1 rounded-full border backdrop-blur-lg whitespace-nowrap`}
            style={{ 
              backgroundColor: `rgba(${metric.color}, 0.2)`,
              color: `rgb(${metric.color})`,
              borderColor: `rgba(${metric.color}, 0.3)`
            }}
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.2 }}
          >
            {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
            {Math.abs(metric.change)}%
          </motion.div>
        </div>
      </div>
      
      <div className="space-y-2">
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, x: -20 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          <span className="text-white/80 text-sm font-medium line-clamp-1">{metric.label}</span>
        </motion.div>
        
        <motion.div 
          className="text-white/60 text-xs line-clamp-2"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          {metric.description}
        </motion.div>
      </div>
    </motion.div>
  );

  const card = (
    <AdvancedParticleCard 
      className="card flex flex-col justify-between relative min-h-[140px] w-full max-w-full rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': metric.color,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={metric.color}
      intensity={1.0}
      onCardClick={metric.link ? () => {
        // Заглушка для перехода
        const stub = document.createElement('div');
        stub.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg';
        stub.innerHTML = `
          <div class="text-center">
            <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 class="text-white text-xl font-bold mb-2">Загружаем данные...</h3>
            <p class="text-white/60">Подготовка информации для просмотра</p>
          </div>
        `;
        document.body.appendChild(stub);
        
        setTimeout(() => {
          stub.remove();
          window.location.href = metric.link!;
        }, 1500);
      } : undefined}
    >
      {content}
    </AdvancedParticleCard>
  );

  return metric.link ? (
    <div className="block h-full cursor-pointer">
      {card}
    </div>
  ) : card;
}

function ProgramCard({ program, onProgramClick }: { program: SocialProgram; onProgramClick?: (program: SocialProgram) => void }) {
  const statusColor = getStatusColor(program.status);
  const priorityColor = getPriorityColor(program.priority);
  const budgetUsage = (program.usedBudget / program.budget) * 100;

  const sizeClasses = {
    small: 'min-h-[160px]',
    medium: 'min-h-[180px]',
    large: 'min-h-[200px]'
  };

  return (
    <AdvancedParticleCard
      className={`card flex flex-col justify-between relative w-full max-w-full p-4 sm:p-5 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow ${sizeClasses[program.size || 'medium']}`}
      style={{
        backgroundColor: '#060010',
        '--glow-color': statusColor,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={statusColor}
      intensity={1.2}
      onCardClick={() => onProgramClick?.(program)}
    >
      <div className="h-full flex flex-col space-y-3 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="text-xl flex-shrink-0">{program.icon}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2">
                {program.name}
              </h3>
              <p className="text-white/60 text-xs mt-0.5 line-clamp-1">
                {program.category}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span 
              className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 whitespace-nowrap"
              style={{
                backgroundColor: `rgba(${statusColor}, 0.15)`,
                color: `rgb(${statusColor})`,
                border: `1px solid rgba(${statusColor}, 0.3)`
              }}
            >
              {getStatusText(program.status)}
            </span>
            <span 
              className="px-1.5 py-0.5 rounded text-xs whitespace-nowrap"
              style={{
                backgroundColor: `rgba(${priorityColor}, 0.2)`,
                color: `rgb(${priorityColor})`
              }}
            >
              {getPriorityText(program.priority)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/70 text-xs leading-relaxed line-clamp-2 flex-grow">
          {program.description}
        </p>

        {/* Progress and Budget */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/60">Прогресс</span>
            <span className="text-white font-medium">{program.progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div 
              className="h-2 rounded-full"
              style={{ 
                width: `${program.progress}%`,
                backgroundColor: `rgb(${statusColor})`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${program.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-white/60">
            <span>Бюджет:</span>
            <span>{budgetUsage.toFixed(0)}%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/80">{formatCurrency(program.usedBudget)}</span>
            <span className="text-white/60">{formatCurrency(program.budget)}</span>
          </div>
        </div>

        {/* Participants and Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center p-2 rounded-lg bg-white/5">
            <div className="text-white font-bold">{program.participants}</div>
            <div className="text-white/60">Участников</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/5">
            <div className="text-white font-bold">
              {program.metrics[0]?.currentValue || 0}%
            </div>
            <div className="text-white/60">Эффективность</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-white/10">
          <span className="text-white/60 text-xs truncate">
            {program.responsible}
          </span>
          <span className="text-white/60 text-xs flex-shrink-0">
            {formatDate(program.startDate)}
          </span>
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${program.color}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

function VolunteerCard({ volunteer, onVolunteerClick }: { volunteer: Volunteer; onVolunteerClick?: (volunteer: Volunteer) => void }) {
  const getStatusColor = (status: Volunteer['status']) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'training': return COLORS.orange;
      case 'inactive': return COLORS.error;
      default: return COLORS.gray;
    }
  };

  const getStatusText = (status: Volunteer['status']) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'training': return 'Обучение';
      case 'inactive': return 'Неактивен';
      default: return 'Неизвестно';
    }
  };

  const statusColor = getStatusColor(volunteer.status);

  return (
    <AdvancedParticleCard
      className="card flex flex-col justify-between relative min-h-[160px] w-full max-w-full p-4 sm:p-5 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': volunteer.color,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={volunteer.color}
      intensity={1.1}
      onCardClick={() => onVolunteerClick?.(volunteer)}
    >
      <div className="h-full flex flex-col space-y-3 relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="text-2xl flex-shrink-0">{volunteer.avatar}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm mb-1 truncate">
                {volunteer.name}
              </h3>
              <p className="text-white/60 text-xs truncate">
                {volunteer.role}
              </p>
            </div>
          </div>
          <span 
            className="px-2 py-1 rounded-full text-xs flex-shrink-0 whitespace-nowrap"
            style={{
              backgroundColor: `rgba(${statusColor}, 0.15)`,
              color: `rgb(${statusColor})`
            }}
          >
            {getStatusText(volunteer.status)}
          </span>
        </div>
        
        <div className="space-y-2 text-xs flex-grow">
          <div className="flex justify-between">
            <span className="text-white/60">Часов/неделю:</span>
            <span className="text-white font-medium">{volunteer.hoursPerWeek}ч</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Задач выполнено:</span>
            <span className="text-white font-medium">{volunteer.completedTasks}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">В команде с:</span>
            <span className="text-white">
              {new Date(volunteer.joinDate).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short'
              })}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-white/80 text-xs font-medium mb-2">Навыки:</h4>
          <div className="flex flex-wrap gap-1">
            {volunteer.skills.slice(0, 2).map((skill, index) => (
              <span 
                key={index}
                className="px-2 py-1 rounded text-xs bg-white/10 text-white/70 truncate max-w-[80px]"
              >
                {skill}
              </span>
            ))}
            {volunteer.skills.length > 2 && (
              <span className="text-white/60 text-xs">
                +{volunteer.skills.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${volunteer.color}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

function EventsWidget() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');

  const filteredEvents = useMemo(() => 
    communityEvents.filter(event => 
      filter === 'all' || event.status === filter
    ),
    [filter]
  );

  const getEventStatusColor = (status: CommunityEvent['status']) => {
    switch (status) {
      case 'upcoming': return COLORS.blue;
      case 'ongoing': return COLORS.orange;
      case 'completed': return COLORS.success;
      case 'cancelled': return COLORS.error;
      default: return COLORS.gray;
    }
  };

  const getEventStatusText = (status: CommunityEvent['status']) => {
    switch (status) {
      case 'upcoming': return 'Скоро';
      case 'ongoing': return 'Идет';
      case 'completed': return 'Завершено';
      case 'cancelled': return 'Отменено';
      default: return 'Неизвестно';
    }
  };

  return (
    <AdvancedParticleCard
      className="card flex flex-col justify-between relative w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': COLORS.teal,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={COLORS.teal}
      intensity={1.1}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-white text-sm sm:text-base">Ближайшие мероприятия</h3>
          <div className="flex gap-1 flex-wrap">
            {(['all', 'upcoming', 'ongoing', 'completed'] as const).map((filterType) => (
              <motion.button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-2 py-1 rounded-lg text-xs transition-all duration-300 flex-shrink-0 backdrop-blur-lg border whitespace-nowrap ${
                  filter === filterType
                    ? 'bg-white/20 text-white border-white/30 shadow-lg'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border-white/10 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {filterType === 'all' && 'Все'}
                {filterType === 'upcoming' && 'Скоро'}
                {filterType === 'ongoing' && 'Идут'}
                {filterType === 'completed' && 'Заверш.'}
              </motion.button>
            ))}
          </div>
        </div>
        
        <div className="flex-grow space-y-3">
          {filteredEvents.map((event, index) => {
            const statusColor = getEventStatusColor(event.status);
            const participationPercent = (event.participants / event.maxParticipants) * 100;
            
            return (
              <motion.div 
                key={event.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <motion.div 
                  className="text-2xl bg-gradient-to-br from-white/10 to-white/20 rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-lg"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  {event.icon}
                </motion.div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/80 text-sm font-medium truncate">
                      {event.title}
                    </span>
                    <span 
                      className="px-2 py-1 rounded-full text-xs ml-2 flex-shrink-0 whitespace-nowrap"
                      style={{
                        backgroundColor: `rgba(${statusColor}, 0.15)`,
                        color: `rgb(${statusColor})`
                      }}
                    >
                      {getEventStatusText(event.status)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span className="truncate flex-1 mr-2">{event.location}</span>
                    <span className="flex-shrink-0">
                      {formatDateTime(event.date + 'T' + event.time)}
                    </span>
                  </div>
                  
                  {/* Participation Progress */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-16 bg-white/10 rounded-full h-1.5 overflow-hidden flex-1">
                      <motion.div 
                        className="h-1.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${participationPercent}%` }}
                        transition={{ delay: index * 0.2 + 0.5, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-white/60 text-xs flex-shrink-0">
                      {event.participants}/{event.maxParticipants}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <motion.div 
          className="mt-4 pt-4 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
            <motion.button 
              className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20 text-sm backdrop-blur-lg"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Все мероприятия →
            </motion.button>
        </motion.div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${COLORS.teal}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

function ProgramsStatsWidget() {
  const totalBudget = socialPrograms.reduce((sum, p) => sum + p.budget, 0);
  const usedBudget = socialPrograms.reduce((sum, p) => sum + p.usedBudget, 0);
  const totalParticipants = socialPrograms.reduce((sum, p) => sum + p.participants, 0);
  const activePrograms = socialPrograms.filter(p => p.status === 'active').length;

  const categoryStats = useMemo(() => {
    const categories = Array.from(new Set(socialPrograms.map(p => p.category)));
    return categories.map(category => {
      const programs = socialPrograms.filter(p => p.category === category);
      return {
        category,
        count: programs.length,
        participants: programs.reduce((sum, p) => sum + p.participants, 0),
        budget: programs.reduce((sum, p) => sum + p.budget, 0),
        color: programs[0]?.color || COLORS.gray
      };
    });
  }, []);

  return (
    <AdvancedParticleCard
      className="card flex flex-col justify-between relative w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': COLORS.purple,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={COLORS.purple}
      intensity={1.1}
    >
      <div className="h-full flex flex-col relative z-10">
        <h3 className="font-semibold text-white mb-4 text-sm sm:text-base">Статистика программ</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-white font-bold text-lg sm:text-xl">{activePrograms}</div>
            <div className="text-white/60 text-xs">Активных программ</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-white font-bold text-lg sm:text-xl">{totalParticipants}</div>
            <div className="text-white/60 text-xs">Участников</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-white font-bold text-lg sm:text-xl">
              {Math.round((usedBudget / totalBudget) * 100)}%
            </div>
            <div className="text-white/60 text-xs">Бюджет освоен</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-white font-bold text-lg sm:text-xl">
              {volunteers.filter(v => v.status === 'active').length}
            </div>
            <div className="text-white/60 text-xs">Активных волонтеров</div>
          </div>
        </div>

        <div className="flex-grow space-y-4">
          <h4 className="text-white font-semibold text-sm">Распределение по категориям</h4>
          <div className="space-y-3">
            {categoryStats.map((stat, index) => {
              const percentage = Math.round((stat.participants / totalParticipants) * 100);
              return (
                <motion.div 
                  key={stat.category}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: `rgb(${stat.color})` }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-white/80 text-sm truncate">{stat.category}</div>
                      <div className="text-white/60 text-xs">{stat.participants} участников</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-16 sm:w-20 bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        className="h-2 rounded-full"
                        style={{ backgroundColor: `rgb(${stat.color})` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: index * 0.2 + 0.5, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-white/80 text-sm font-medium w-8 sm:w-10 text-right">
                      {percentage}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${COLORS.purple}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

function QuickActionsWidget() {
  const actions = [
    { 
      icon: '➕', 
      label: 'Новая программа', 
      description: 'Создать социальную программу', 
      color: COLORS.blue 
    },
    { 
      icon: '👥', 
      label: 'Управление волонтерами', 
      description: 'Добавить или редактировать', 
      color: COLORS.purple 
    },
    { 
      icon: '📈', 
      label: 'Отчеты', 
      description: 'Статистика и аналитика', 
      color: COLORS.orange 
    },
    { 
      icon: '🎯', 
      label: 'Мероприятия', 
      description: 'Планирование событий', 
      color: COLORS.teal 
    },
    { 
      icon: '💰', 
      label: 'Бюджет', 
      description: 'Управление финансами', 
      color: COLORS.emerald 
    },
    { 
      icon: '📋', 
      label: 'Шаблоны', 
      description: 'Готовые решения', 
      color: COLORS.cyan 
    },
  ];

  return (
    <AdvancedParticleCard
      className="card flex flex-col justify-between relative w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': COLORS.info,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={COLORS.info}
      intensity={1.0}
    >

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${COLORS.info}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

// ========== ОСНОВНОЙ КОМПОНЕНТ ==========

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

export default function CommunityProgramsPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'planned' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<SocialProgram | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);

  const categories = useMemo(() => 
    ['all', ...Array.from(new Set(socialPrograms.map(p => p.category)))],
    []
  );

  const filteredPrograms = useMemo(() => 
    socialPrograms.filter(program => {
      const statusMatch = selectedFilter === 'all' || program.status === selectedFilter;
      const categoryMatch = categoryFilter === 'all' || program.category === categoryFilter;
      const searchMatch = !searchQuery || 
        program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.responsible.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && categoryMatch && searchMatch;
    }),
    [selectedFilter, categoryFilter, searchQuery]
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
      setCurrentDate(now.toLocaleDateString('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleProgramClick = (program: SocialProgram) => {
    setSelectedProgram(program);
    setIsProgramModalOpen(true);
  };

  const handleVolunteerClick = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsVolunteerModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary} flex items-center justify-center`}>
        <motion.div
          className="text-white text-2xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Загрузка программ...
        </motion.div>
      </div>
    );
  }

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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <GlobalSpotlight
        gridRef={gridRef}
        disableAnimations={shouldDisableAnimations}
        enabled={true}
        spotlightRadius={DEFAULT_SPOTLIGHT_RADIUS}
        glowColor={DEFAULT_GLOW_COLOR}
      />

      <motion.header 
        className="sticky top-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <NavigationStub to="/demo/social/owner" className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer">
                <motion.span
                  whileHover={{ x: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  ←
                </motion.span>
                <span className="text-sm sm:text-base">На главную</span>
              </NavigationStub>
              <div className="text-white/60 text-sm text-right">
                <div className="hidden sm:block">{currentDate}</div>
                <div>{currentTime}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-white text-sm">Сообщество активно</span>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Welcome Section */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <motion.h1 
                  className="text-3xl sm:text-4xl font-bold text-white mb-3 flex items-center gap-3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-3xl sm:text-4xl">🌐</span>
                  <span>Социальные программы</span>
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-base sm:text-lg mb-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Управление социальными программами, волонтерскими инициативами и развитием местного сообщества. 
                  Мониторинг эффективности и поддержка нуждающихся.
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>{socialPrograms.length} программ</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>{volunteers.length} волонтеров</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>{communityEvents.length} мероприятий</span>
                  </div>
                </motion.div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <motion.button
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white transition-all duration-300 text-sm font-medium backdrop-blur-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  📊 Создать отчет
                </motion.button>
                <NavigationStub to="/demo/social/owner/modules/community/new-program">
                  <motion.button
                    className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-all duration-300 backdrop-blur-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    + Новая программа
                  </motion.button>
                </NavigationStub>
              </div>
            </div>

            <motion.div 
              className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-green-400 font-bold text-xl">{socialPrograms.filter(p => p.status === 'active').length}</div>
                <div className="text-white/60 text-sm">Активных программ</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-blue-400 font-bold text-xl">{volunteers.filter(v => v.status === 'active').length}</div>
                <div className="text-white/60 text-sm">Активных волонтеров</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-orange-400 font-bold text-xl">{communityEvents.filter(e => e.status === 'upcoming').length}</div>
                <div className="text-white/60 text-sm">Предстоящих событий</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-purple-400 font-bold text-xl">
                  {Math.round((socialPrograms.reduce((sum, p) => sum + p.usedBudget, 0) / socialPrograms.reduce((sum, p) => sum + p.budget, 0)) * 100)}%
                </div>
                <div className="text-white/60 text-sm">Бюджет освоен</div>
              </div>
            </motion.div>
            
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-500/15 to-cyan-500/15 rounded-full blur-xl" />
          </div>
        </motion.section>

        {/* Impact Metrics */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h2 
            className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Социальный эффект
          </motion.h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {impactMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index, type: "spring", stiffness: 200 }}
                layout
              >
                <MetricCard metric={metric} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Programs Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-6 h-full">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📋</div>
                      <h2 className="text-xl font-bold text-white">Социальные программы</h2>
                    </div>
                    <span className="text-white/60 text-sm">
                      {filteredPrograms.length} из {socialPrograms.length}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                    <AnimatePresence>
                      {filteredPrograms.map((program, index) => (
                        <motion.div
                          key={program.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1 }}
                          layout
                        >
                          <ProgramCard program={program} onProgramClick={handleProgramClick} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Volunteers Section */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-6 h-full">
                <div className="h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="text-2xl">❤️</div>
                    <h2 className="text-xl font-bold text-white">Команда волонтеров</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 flex-grow">
                    {volunteers.slice(0, 4).map((volunteer, index) => (
                      <motion.div
                        key={volunteer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <VolunteerCard volunteer={volunteer} onVolunteerClick={handleVolunteerClick} />
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-white font-bold text-lg">
                          {volunteers.filter(v => v.status === 'active').length}
                        </div>
                        <div className="text-white/60 text-sm">Активных волонтеров</div>
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg">
                          {volunteers.reduce((sum, v) => sum + v.hoursPerWeek, 0)}
                        </div>
                        <div className="text-white/60 text-sm">Часов/неделю</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <EventsWidget />
            </motion.div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1">
            <ProgramsStatsWidget />
          </div>
          <div className="lg:col-span-1">
            <QuickActionsWidget />
          </div>
        </div>
      </main>

      {/* Модальные окна */}
      <AnimatePresence>
        {selectedProgram && (
          <ProgramDetailsModal
            program={selectedProgram}
            isOpen={isProgramModalOpen}
            onClose={() => {
              setIsProgramModalOpen(false);
              setTimeout(() => setSelectedProgram(null), 300);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedVolunteer && (
          <VolunteerDetailsModal
            volunteer={selectedVolunteer}
            isOpen={isVolunteerModalOpen}
            onClose={() => {
              setIsVolunteerModalOpen(false);
              setTimeout(() => setSelectedVolunteer(null), 300);
            }}
          />
        )}
      </AnimatePresence>

      <motion.footer 
        className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-white/60 text-sm">
            <div className="flex items-center gap-4">
              <span>© 2024 Социальные программы сообщества</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Версия 2.1.0</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Обновлено: {new Date().toLocaleDateString('ru-RU')}</span>
              <span>•</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>Все системы активны</span>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}