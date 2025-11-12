'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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

const DEFAULT_PARTICLE_COUNT = 16;
const DEFAULT_SPOTLIGHT_RADIUS = 400;
const DEFAULT_GLOW_COLOR = '59, 130, 246';
const MOBILE_BREAKPOINT = 768;

interface DailyReport {
  id: string;
  date: string;
  servicesCompleted: number;
  clientsServed: number;
  satisfactionRate: number;
  issuesReported: number;
  revenue: number;
  expenses: number;
  teamProductivity: number;
  status: 'completed' | 'in-progress' | 'pending';
  notes?: string;
  department: string;
  manager: string;
  trends: {
    services: 'up' | 'down' | 'stable';
    satisfaction: 'up' | 'down' | 'stable';
    revenue: 'up' | 'down' | 'stable';
  };
}

interface ServiceStatistic {
  id: string;
  name: string;
  category: string;
  dailyClients: number;
  weeklyClients: number;
  monthlyClients: number;
  completionRate: number;
  satisfaction: number;
  revenue: number;
  expenses: number;
  profit: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
  icon: string;
  growth?: number;
}

interface PlanPerformance {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  progress: number;
  deadline: string;
  status: 'on-track' | 'at-risk' | 'behind';
  department: string;
  color: string;
  trend: 'up' | 'down' | 'stable';
  variance: number;
}

interface ModalState {
  isOpen: boolean;
  type: 'report' | 'statistic' | 'plan' | null;
  data?: any;
}

// ========== УТИЛИТЫ ==========

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('ru-RU').format(value);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const formatShortDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'numeric'
  });
};

const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
  return trend === 'up' ? COLORS.success : trend === 'down' ? COLORS.error : COLORS.warning;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return COLORS.success;
    case 'on-track': return COLORS.success;
    case 'in-progress': return COLORS.warning;
    case 'at-risk': return COLORS.warning;
    case 'pending': return COLORS.error;
    case 'behind': return COLORS.error;
    default: return COLORS.gray;
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

      element.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
      element.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
    };

    const handleClick = (e: MouseEvent) => {
      if (clickEffect) {
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
    className={`bento-section grid gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6 max-w-7xl 2xl:max-w-[1800px] mx-auto select-none relative ${className}`}
    ref={gridRef}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// ========== МОДАЛЬНЫЕ ОКНА ==========

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
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
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        className={`bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/20 shadow-2xl w-full ${sizeClasses[size]} max-h-[95vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
          <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200 text-white/60 hover:text-white"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)]">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ReportModal: React.FC<{ isOpen: boolean; onClose: () => void; report: DailyReport }> = ({ 
  isOpen, 
  onClose, 
  report 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Ежедневный отчет: ${formatDate(report.date)}`} size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{formatNumber(report.servicesCompleted)}</div>
            <div className="text-white/60 text-sm">Услуг выполнено</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{formatNumber(report.clientsServed)}</div>
            <div className="text-white/60 text-sm">Клиентов обслужено</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{report.satisfactionRate}%</div>
            <div className="text-white/60 text-sm">Удовлетворенность</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-400">{report.issuesReported}</div>
            <div className="text-white/60 text-sm">Проблемы</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-lg">Финансовые показатели</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/60">Доход:</span>
                <span className="text-white font-bold">{formatCurrency(report.revenue)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/60">Расходы:</span>
                <span className="text-rose-400 font-bold">{formatCurrency(report.expenses)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <span className="text-white/60">Прибыль:</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(report.revenue - report.expenses)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold text-lg">Тренды дня</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/60">Услуги:</span>
                <span className={`font-bold ${
                  report.trends.services === 'up' ? 'text-emerald-400' : 
                  report.trends.services === 'down' ? 'text-rose-400' : 'text-yellow-400'
                }`}>
                  {report.trends.services === 'up' ? '↗ Рост' : 
                   report.trends.services === 'down' ? '↘ Снижение' : '→ Стабильно'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/60">Удовлетворенность:</span>
                <span className={`font-bold ${
                  report.trends.satisfaction === 'up' ? 'text-emerald-400' : 
                  report.trends.satisfaction === 'down' ? 'text-rose-400' : 'text-yellow-400'
                }`}>
                  {report.trends.satisfaction === 'up' ? '↗ Рост' : 
                   report.trends.satisfaction === 'down' ? '↘ Снижение' : '→ Стабильно'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/60">Доходы:</span>
                <span className={`font-bold ${
                  report.trends.revenue === 'up' ? 'text-emerald-400' : 
                  report.trends.revenue === 'down' ? 'text-rose-400' : 'text-yellow-400'
                }`}>
                  {report.trends.revenue === 'up' ? '↗ Рост' : 
                   report.trends.revenue === 'down' ? '↘ Снижение' : '→ Стабильно'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {report.notes && (
          <div>
            <h4 className="text-white font-semibold mb-3">Примечания менеджера</h4>
            <p className="text-white/60 leading-relaxed p-4 bg-white/5 rounded-lg border border-white/10">
              {report.notes}
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button className="flex-1 py-3 px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-xl transition-all duration-300">
            Скачать отчет PDF
          </button>
          <button className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-300">
            Отправить на проверку
          </button>
        </div>
      </div>
    </Modal>
  );
};

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

// ========== МОКИ ДАННЫХ ==========

const dailyReports: DailyReport[] = [
  {
    id: '1',
    date: '2024-11-20',
    servicesCompleted: 156,
    clientsServed: 142,
    satisfactionRate: 94,
    issuesReported: 3,
    revenue: 285000,
    expenses: 187000,
    teamProductivity: 92,
    status: 'completed',
    department: 'Все отделы',
    manager: 'Иван Петров',
    notes: 'Высокая нагрузка на отдел социального сопровождения. Все услуги выполнены в срок.',
    trends: {
      services: 'up',
      satisfaction: 'stable',
      revenue: 'up'
    }
  },
  {
    id: '2',
    date: '2024-11-19',
    servicesCompleted: 148,
    clientsServed: 135,
    satisfactionRate: 92,
    issuesReported: 5,
    revenue: 267000,
    expenses: 192000,
    teamProductivity: 88,
    status: 'completed',
    department: 'Все отделы',
    manager: 'Мария Сидорова',
    trends: {
      services: 'stable',
      satisfaction: 'down',
      revenue: 'stable'
    }
  },
  {
    id: '3',
    date: '2024-11-18',
    servicesCompleted: 142,
    clientsServed: 138,
    satisfactionRate: 95,
    issuesReported: 2,
    revenue: 274000,
    expenses: 178000,
    teamProductivity: 94,
    status: 'completed',
    department: 'Все отделы',
    manager: 'Алексей Козлов',
    trends: {
      services: 'up',
      satisfaction: 'up',
      revenue: 'up'
    }
  },
  {
    id: '4',
    date: '2024-11-17',
    servicesCompleted: 138,
    clientsServed: 128,
    satisfactionRate: 90,
    issuesReported: 7,
    revenue: 252000,
    expenses: 195000,
    teamProductivity: 85,
    status: 'completed',
    department: 'Все отделы',
    manager: 'Елена Новикова',
    trends: {
      services: 'down',
      satisfaction: 'down',
      revenue: 'down'
    }
  },
  {
    id: '5',
    date: '2024-11-16',
    servicesCompleted: 152,
    clientsServed: 145,
    satisfactionRate: 93,
    issuesReported: 4,
    revenue: 291000,
    expenses: 183000,
    teamProductivity: 91,
    status: 'completed',
    department: 'Все отделы',
    manager: 'Дмитрий Волков',
    trends: {
      services: 'up',
      satisfaction: 'stable',
      revenue: 'up'
    }
  }
];

const serviceStatistics: ServiceStatistic[] = [
  {
    id: '1',
    name: 'Социальное сопровождение',
    category: 'Основные услуги',
    dailyClients: 45,
    weeklyClients: 285,
    monthlyClients: 1120,
    completionRate: 94,
    satisfaction: 95,
    revenue: 1250000,
    expenses: 850000,
    profit: 400000,
    trend: 'up',
    color: COLORS.blue,
    icon: '🏠',
    growth: 8
  },
  {
    id: '2',
    name: 'Психологическая помощь',
    category: 'Специализированные',
    dailyClients: 28,
    weeklyClients: 175,
    monthlyClients: 720,
    completionRate: 92,
    satisfaction: 96,
    revenue: 980000,
    expenses: 520000,
    profit: 460000,
    trend: 'up',
    color: COLORS.purple,
    icon: '🧠',
    growth: 12
  },
  {
    id: '3',
    name: 'Юридические консультации',
    category: 'Специализированные',
    dailyClients: 32,
    weeklyClients: 195,
    monthlyClients: 810,
    completionRate: 88,
    satisfaction: 89,
    revenue: 750000,
    expenses: 450000,
    profit: 300000,
    trend: 'stable',
    color: COLORS.emerald,
    icon: '⚖️',
    growth: 3
  },
  {
    id: '4',
    name: 'Медицинский патронаж',
    category: 'Основные услуги',
    dailyClients: 22,
    weeklyClients: 145,
    monthlyClients: 580,
    completionRate: 91,
    satisfaction: 93,
    revenue: 1680000,
    expenses: 1250000,
    profit: 430000,
    trend: 'up',
    color: COLORS.rose,
    icon: '🏥',
    growth: 15
  },
  {
    id: '5',
    name: 'Трудовая адаптация',
    category: 'Реабилитационные',
    dailyClients: 15,
    weeklyClients: 95,
    monthlyClients: 380,
    completionRate: 82,
    satisfaction: 85,
    revenue: 420000,
    expenses: 380000,
    profit: 40000,
    trend: 'down',
    color: COLORS.orange,
    icon: '💼',
    growth: -5
  }
];

const planPerformance: PlanPerformance[] = [
  {
    id: '1',
    name: 'Количество обслуженных клиентов',
    target: 5000,
    current: 4320,
    unit: 'клиентов',
    progress: 86,
    deadline: '2024-12-31',
    status: 'on-track',
    department: 'Все отделы',
    color: COLORS.blue,
    trend: 'up',
    variance: 4
  },
  {
    id: '2',
    name: 'Удовлетворенность клиентов',
    target: 95,
    current: 92,
    unit: '%',
    progress: 97,
    deadline: '2024-12-31',
    status: 'at-risk',
    department: 'Качество услуг',
    color: COLORS.emerald,
    trend: 'stable',
    variance: -3
  },
  {
    id: '3',
    name: 'Снижение расходов',
    target: 15,
    current: 8,
    unit: '%',
    progress: 53,
    deadline: '2024-12-31',
    status: 'behind',
    department: 'Финансы',
    color: COLORS.rose,
    trend: 'down',
    variance: -47
  },
  {
    id: '4',
    name: 'Обучение сотрудников',
    target: 100,
    current: 85,
    unit: 'часов',
    progress: 85,
    deadline: '2024-11-30',
    status: 'on-track',
    department: 'HR',
    color: COLORS.purple,
    trend: 'up',
    variance: 0
  },
  {
    id: '5',
    name: 'Внедрение новых услуг',
    target: 5,
    current: 3,
    unit: 'услуг',
    progress: 60,
    deadline: '2024-12-15',
    status: 'at-risk',
    department: 'Развитие',
    color: COLORS.orange,
    trend: 'stable',
    variance: -10
  }
];

const quickActions = [
  { 
    icon: '📊', 
    label: 'Создать отчет', 
    color: COLORS.blue,
    description: 'Новый ежедневный отчет' 
  },
  { 
    icon: '📈', 
    label: 'Анализ статистики', 
    color: COLORS.emerald,
    description: 'Детальный анализ показателей' 
  },
  { 
    icon: '🎯', 
    label: 'Проверить планы', 
    color: COLORS.orange,
    description: 'Мониторинг выполнения' 
  },
  { 
    icon: '📋', 
    label: 'Экспорт данных', 
    color: COLORS.purple,
    description: 'Выгрузка отчетности' 
  },
  { 
    icon: '🔄', 
    label: 'Обновить данные', 
    color: COLORS.indigo,
    description: 'Синхронизация показателей' 
  },
  { 
    icon: '⚡', 
    label: 'Быстрая сводка', 
    color: COLORS.teal,
    description: 'Ключевые метрики дня' 
  }
];

const kpiMetrics = [
  {
    name: 'Общая эффективность',
    value: 87,
    target: 90,
    trend: 'up',
    color: COLORS.blue,
    icon: '📊'
  },
  {
    name: 'Финансовая эффективность',
    value: 78,
    target: 85,
    trend: 'stable',
    color: COLORS.emerald,
    icon: '💰'
  },
  {
    name: 'Удовлетворенность',
    value: 92,
    target: 95,
    trend: 'up',
    color: COLORS.purple,
    icon: '😊'
  },
  {
    name: 'Продуктивность команды',
    value: 89,
    target: 90,
    trend: 'down',
    color: COLORS.orange,
    icon: '👥'
  }
];

// ========== ВИДЖЕТЫ ==========

function DailyReportCard({ report, onCardClick }: { report: DailyReport; onCardClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  const baseClassName = `card flex flex-col justify-between relative min-h-[140px] w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow`;

  const cardStyle = {
    backgroundColor: '#060010',
    borderColor: 'var(--border-color)',
    color: 'var(--white)',
    '--glow-x': '50%',
    '--glow-y': '50%',
    '--glow-intensity': '0',
    '--glow-radius': '250px',
    '--glow-color': getStatusColor(report.status)
  } as React.CSSProperties;

  const statusColor = getStatusColor(report.status);

  return (
    <AdvancedParticleCard
      className={baseClassName}
      style={cardStyle}
      particleCount={12}
      glowColor={statusColor}
      enableTilt={true}
      clickEffect={true}
      enableMagnetism={true}
      intensity={1.2}
      onCardClick={onCardClick}
    >
      <motion.div 
        className="h-full flex flex-col cursor-pointer"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onCardClick}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold text-white text-base mb-1 leading-tight">
              {formatDate(report.date)}
            </h3>
            <p className="text-white/60 text-xs">
              {report.department} • {report.manager}
            </p>
          </div>
          <motion.div 
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border backdrop-blur-sm flex-shrink-0 ${
              report.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
              report.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
              'bg-red-500/20 text-red-400 border-red-500/30'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
          >
            {report.status === 'completed' ? '✓' : report.status === 'in-progress' ? '⟳' : '⏳'}
            {report.status === 'completed' ? 'Завершен' : report.status === 'in-progress' ? 'В работе' : 'Ожидание'}
          </motion.div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5">
            <div className="text-white font-bold text-lg mb-1">
              {formatNumber(report.servicesCompleted)}
            </div>
            <div className="text-white/60 text-xs">Услуг</div>
          </div>
          <div className="text-center p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5">
            <div className="text-white font-bold text-lg mb-1">
              {formatNumber(report.clientsServed)}
            </div>
            <div className="text-white/60 text-xs">Клиентов</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <div className="flex justify-between items-center text-xs text-white/60 mb-1">
              <span>Удовлетворенность</span>
              <span className="font-semibold">{report.satisfactionRate}%</span>
            </div>
            <ProgressBar 
              value={report.satisfactionRate} 
              color={`rgb(${COLORS.emerald})`}
              height="sm"
              animated={true}
              showLabel={false}
            />
          </div>
          <div>
            <div className="flex justify-between items-center text-xs text-white/60 mb-1">
              <span>Продуктивность</span>
              <span className="font-semibold">{report.teamProductivity}%</span>
            </div>
            <ProgressBar 
              value={report.teamProductivity} 
              color={`rgb(${COLORS.blue})`}
              height="sm"
              animated={true}
              showLabel={false}
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-white/60">Прибыль:</span>
          <span className="text-emerald-400 font-bold">
            {formatCurrency(report.revenue - report.expenses)}
          </span>
        </div>

        <div 
          className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 30% 20%, rgba(${statusColor}, 0.4) 0%, transparent 50%)`
          }}
        />

        <AnimatePresence>
          {isHovered && (
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-2xl flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium text-xs shadow-lg"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                👁️ Подробнее
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AdvancedParticleCard>
  );
}

function ServiceStatisticCard({ statistic }: { statistic: ServiceStatistic }) {
  const profitMargin = ((statistic.profit / statistic.revenue) * 100).toFixed(1);

  return (
    <AdvancedParticleCard
      className="card flex flex-col justify-between relative min-h-[160px] w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': statistic.color,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={statistic.color}
      intensity={1.1}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-grow">
            <motion.div 
              className="text-2xl"
              whileHover={{ scale: 1.3, rotate: 5 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              {statistic.icon}
            </motion.div>
            <div className="flex-grow min-w-0">
              <h3 className="font-semibold text-white text-sm mb-1 leading-tight">
                {statistic.name}
              </h3>
              <p className="text-white/60 text-xs truncate">
                {statistic.category}
              </p>
            </div>
          </div>
          <motion.div 
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border backdrop-blur-sm ${
              statistic.trend === 'up' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
              statistic.trend === 'down' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
              'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
          >
            {statistic.trend === 'up' ? '↗' : statistic.trend === 'down' ? '↘' : '→'}
            {statistic.satisfaction}%
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5">
            <div className="text-white font-bold text-base mb-1">
              {formatNumber(statistic.dailyClients)}
            </div>
            <div className="text-white/60 text-xs">Сегодня</div>
          </div>
          <div className="text-center p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5">
            <div className="text-white font-bold text-base mb-1">
              {formatNumber(statistic.weeklyClients)}
            </div>
            <div className="text-white/60 text-xs">За неделю</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/60">Маржа прибыли:</span>
            <span className={`font-bold ${
              parseFloat(profitMargin) > 20 ? 'text-emerald-400' : 
              parseFloat(profitMargin) > 10 ? 'text-yellow-400' : 'text-rose-400'
            }`}>
              {profitMargin}%
            </span>
          </div>
          <ProgressBar 
            value={statistic.completionRate} 
            color={`rgb(${statistic.color})`}
            height="sm"
            animated={true}
            showLabel={true}
            label="Выполнение услуг"
          />
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${statistic.color}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

function PlanPerformanceCard({ plan }: { plan: PlanPerformance }) {
  const statusColor = getStatusColor(plan.status);

  return (
    <AdvancedParticleCard
      className="card flex flex-col justify-between relative min-h-[140px] w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': statusColor,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={statusColor}
      intensity={1.1}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-white text-sm flex-grow mr-3 leading-tight">
            {plan.name}
          </h4>
          <div className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm border flex-shrink-0 ${
            plan.status === 'on-track' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
            plan.status === 'at-risk' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
            'bg-red-500/20 text-red-400 border-red-500/30'
          }`}>
            {plan.status === 'on-track' ? 'По плану' : 
             plan.status === 'at-risk' ? 'Риск' : 'Отставание'}
          </div>
        </div>
        
        <div className="space-y-3 flex-grow">
          <div className="flex justify-between items-baseline">
            <span className="text-white font-bold text-lg">
              {formatNumber(plan.current)}{plan.unit}
            </span>
            <span className="text-white/60 text-xs">
              из {formatNumber(plan.target)}{plan.unit}
            </span>
          </div>
          
          <ProgressBar 
            value={plan.progress} 
            color={`rgb(${plan.color})`} 
            height="sm"
            animated={true}
          />
          
          <div className="flex justify-between items-center text-xs">
            <span 
              className={`px-2 py-1 rounded-full backdrop-blur-sm border ${
                plan.trend === 'up' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                plan.trend === 'down' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                'bg-gray-500/20 text-gray-400 border-gray-500/30'
              }`}
            >
              {plan.trend === 'up' ? '↗ Рост' : 
               plan.trend === 'down' ? '↘ Снижение' : '→ Стабильно'}
            </span>
            <span className="text-white/60">
              До: {formatDate(plan.deadline)}
            </span>
          </div>
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${statusColor}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

function KPICard({ metric }: { metric: typeof kpiMetrics[0] }) {
  const progress = (metric.value / metric.target) * 100;
  const isOnTarget = metric.value >= metric.target;

  return (
    <AdvancedParticleCard
      className="card flex flex-col justify-between relative min-h-[120px] w-full max-w-full p-4 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': metric.color,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={metric.color}
      intensity={1.0}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-xl">
            {metric.icon}
          </div>
          <div className="flex-grow">
            <h3 className="text-white font-semibold text-sm leading-tight">
              {metric.name}
            </h3>
          </div>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <div className="text-white font-bold text-xl">
              {metric.value}%
            </div>
            <div className="text-white/60 text-xs">
              Цель: {metric.target}%
            </div>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm border ${
            isOnTarget ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
          }`}>
            {isOnTarget ? '✓' : '!'}
          </div>
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${metric.color}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

function QuickActionCard({ action }: { action: { icon: string; label: string; color: string; description?: string } }) {
  return (
    <AdvancedParticleCard
      className="card flex flex-col justify-between relative min-h-[120px] w-full max-w-full p-4 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': action.color,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={action.color}
      intensity={1.0}
    >
      <div className="h-full flex flex-col items-center justify-center text-center p-2">
        <div className="text-2xl mb-2">
          {action.icon}
        </div>
        <h3 className="text-white font-semibold text-sm mb-1 leading-tight">
          {action.label}
        </h3>
        {action.description && (
          <p className="text-white/60 text-xs leading-tight">
            {action.description}
          </p>
        )}
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${action.color}, 0.4) 0%, transparent 50%)`
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

export default function DailyReportsPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [activeTab, setActiveTab] = useState<'reports' | 'statistics' | 'plans'>('reports');
  const [modal, setModal] = useState<ModalState>({ isOpen: false, type: null });

  const stats = useMemo(() => ({
    totalReports: dailyReports.length,
    completedReports: dailyReports.filter(r => r.status === 'completed').length,
    totalClientsThisMonth: serviceStatistics.reduce((sum, stat) => sum + stat.monthlyClients, 0),
    totalRevenue: serviceStatistics.reduce((sum, stat) => sum + stat.revenue, 0),
    totalProfit: serviceStatistics.reduce((sum, stat) => sum + stat.profit, 0),
    averageSatisfaction: Math.round(serviceStatistics.reduce((sum, stat) => sum + stat.satisfaction, 0) / serviceStatistics.length),
    plansOnTrack: planPerformance.filter(p => p.status === 'on-track').length,
    plansAtRisk: planPerformance.filter(p => p.status === 'at-risk').length
  }), []);

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

  const handleReportClick = (report: DailyReport) => {
    setModal({ isOpen: true, type: 'report', data: report });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null });
  };

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

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
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

      {/* Модальные окна */}
      <AnimatePresence>
        {modal.isOpen && modal.type === 'report' && (
          <ReportModal 
            isOpen={modal.isOpen} 
            onClose={closeModal} 
            report={modal.data} 
          />
        )}
      </AnimatePresence>

      <motion.header 
        className="sticky top-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/demo/social/owner" className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer">
                <motion.span
                  whileHover={{ x: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  ←
                </motion.span>
                <span className="text-sm sm:text-base">На главную</span>
              </Link>
              <div className="text-white/60 text-xs sm:text-sm text-right">
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
              <span className="text-white text-xs sm:text-sm">Отчетность активна</span>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <motion.h1 
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-2xl sm:text-3xl lg:text-4xl">📊</span>
                  <span>Ежедневные отчеты</span>
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Центр социальной помощи "Забота" • Мониторинг показателей и выполнение планов
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>{stats.completedReports} из {stats.totalReports} отчетов завершено</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>{formatNumber(stats.totalClientsThisMonth)} клиентов за месяц</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>{stats.averageSatisfaction}% средняя удовлетворенность</span>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="text-right"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-white font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg">
                  {formatCurrency(stats.totalProfit)}
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Общая прибыль за месяц</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сегодня</div>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between pt-4 sm:pt-6 border-t border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex space-x-1 p-1 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
                {[
                  { id: 'reports' as const, label: 'Ежедневные отчеты' },
                  { id: 'statistics' as const, label: 'Статистика услуг' },
                  { id: 'plans' as const, label: 'Выполнение планов' }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white shadow-lg border border-white/30'
                        : 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <motion.button
                  className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white transition-all duration-300 text-xs sm:text-sm font-medium backdrop-blur-sm flex items-center gap-1 sm:gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>📥</span>
                  <span>Экспорт данных</span>
                </motion.button>
                <motion.button
                  className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 transition-all duration-300 text-xs sm:text-sm font-medium backdrop-blur-sm flex items-center gap-1 sm:gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>➕</span>
                  <span>Новый отчет</span>
                </motion.button>
              </div>
            </motion.div>

            <motion.div 
              className="mt-4 sm:mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center">
                <div className="text-blue-400 font-bold text-base sm:text-xl">{formatCurrency(stats.totalRevenue)}</div>
                <div className="text-white/60 text-xs">Общий доход</div>
              </div>
              <div className="text-center">
                <div className="text-emerald-400 font-bold text-base sm:text-xl">{stats.plansOnTrack}</div>
                <div className="text-white/60 text-xs">Планов по графику</div>
              </div>
              <div className="text-center">
                <div className="text-amber-400 font-bold text-base sm:text-xl">{stats.plansAtRisk}</div>
                <div className="text-white/60 text-xs">Планов в зоне риска</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-bold text-base sm:text-xl">{stats.averageSatisfaction}%</div>
                <div className="text-white/60 text-xs">Удовлетворенность</div>
              </div>
            </motion.div>
            
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-tr from-emerald-500/15 to-cyan-500/15 rounded-full blur-xl" />
          </div>
        </motion.section>

        {/* KPI Metrics */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Ключевые показатели эффективности</h2>
          <BentoCardGrid gridRef={gridRef}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {kpiMetrics.map((metric, index) => (
                <KPICard key={index} metric={metric} />
              ))}
            </div>
          </BentoCardGrid>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Быстрые действия</h2>
          <BentoCardGrid gridRef={gridRef}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {quickActions.map((action, index) => (
                <QuickActionCard key={index} action={action} />
              ))}
            </div>
          </BentoCardGrid>
        </motion.section>

        {/* Tab Content */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'reports' && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Ежедневные отчеты</h2>
                <BentoCardGrid gridRef={gridRef}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {dailyReports.map((report) => (
                      <DailyReportCard key={report.id} report={report} onCardClick={() => handleReportClick(report)} />
                    ))}
                  </div>
                </BentoCardGrid>
              </motion.div>
            )}

            {activeTab === 'statistics' && (
              <motion.div
                key="statistics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Статистика услуг</h2>
                <BentoCardGrid gridRef={gridRef}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {serviceStatistics.map((statistic) => (
                      <ServiceStatisticCard key={statistic.id} statistic={statistic} />
                    ))}
                  </div>
                </BentoCardGrid>
              </motion.div>
            )}

            {activeTab === 'plans' && (
              <motion.div
                key="plans"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Выполнение планов</h2>
                <BentoCardGrid gridRef={gridRef}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {planPerformance.map((plan) => (
                      <PlanPerformanceCard key={plan.id} plan={plan} />
                    ))}
                  </div>
                </BentoCardGrid>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>

      <motion.footer 
        className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-8 sm:mt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 text-white/60 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 text-center sm:text-left">
              <span>© 2024 Центр социальной помощи "Забота"</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Система отчетности v2.0</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span>{dailyReports.length} отчетов</span>
              <span>•</span>
              <span>Обновлено: {currentTime}</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}