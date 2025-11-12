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

interface ServiceMetric {
  id: string;
  name: string;
  category: string;
  totalClients: number;
  satisfaction: number;
  trend: 'up' | 'down' | 'stable';
  completionRate: number;
  responseTime: number;
  complaints: number;
  improvements: number;
  color: string;
  icon: string;
  growth?: number;
  priority?: 'high' | 'medium' | 'low';
  description: string;
  teamSize: number;
  budget: number;
}

interface Feedback {
  id: string;
  service: string;
  client: string;
  rating: number;
  comment: string;
  date: string;
  type: 'positive' | 'negative' | 'suggestion';
  status: 'new' | 'in-progress' | 'resolved';
  category: string;
  urgency?: 'high' | 'medium' | 'low';
  response?: string;
  tags: string[];
}

interface QualityIndicator {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
  description: string;
  color: string;
  progress?: number;
  variance?: number;
  history: number[];
}

interface ImprovementArea {
  area: string;
  current: string;
  target: string;
  priority: 'high' | 'medium' | 'low';
  services: string[];
  color: string;
  progress: number;
  deadline: string;
  description: string;
}

interface ModalState {
  isOpen: boolean;
  type: 'service' | 'feedback' | 'indicator' | 'improvement' | null;
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

const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
  return trend === 'up' ? COLORS.success : trend === 'down' ? COLORS.error : COLORS.warning;
};

const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high': return COLORS.error;
    case 'medium': return COLORS.warning;
    case 'low': return COLORS.success;
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

const ServiceModal: React.FC<{ isOpen: boolean; onClose: () => void; service: ServiceMetric }> = ({ 
  isOpen, 
  onClose, 
  service 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Детали услуги: ${service.name}`} size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{formatNumber(service.totalClients)}</div>
            <div className="text-white/60 text-sm">Обслужено клиентов</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white" style={{ color: `rgb(${service.color})` }}>
              {service.satisfaction}%
            </div>
            <div className="text-white/60 text-sm">Удовлетворенность</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-lg">Детальная статистика</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-white/60 text-sm">Процент выполнения</div>
              <div className="text-white font-bold">{service.completionRate}%</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-white/60 text-sm">Время ответа</div>
              <div className="text-white font-bold">{service.responseTime} дней</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-white/60 text-sm">Количество жалоб</div>
              <div className="text-white font-bold">{service.complaints}</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-white/60 text-sm">Улучшения</div>
              <div className="text-white font-bold">{service.improvements}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Описание услуги</h4>
          <p className="text-white/60 leading-relaxed">{service.description}</p>
        </div>

        <div className="flex gap-3 pt-4">
          <button className="flex-1 py-3 px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-xl transition-all duration-300">
            Скачать отчет
          </button>
          <button className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-300">
            Настроить мониторинг
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

const serviceMetrics: ServiceMetric[] = [
  {
    id: '1',
    name: 'Социальное сопровождение',
    category: 'Основные услуги',
    totalClients: 456,
    satisfaction: 94,
    trend: 'up',
    completionRate: 92,
    responseTime: 1.2,
    complaints: 3,
    improvements: 12,
    color: COLORS.blue,
    icon: '🏠',
    growth: 8,
    priority: 'low',
    description: 'Комплексное сопровождение пожилых людей и людей с ограниченными возможностями, включая помощь в бытовых вопросах, оформлении документов и социальной поддержке',
    teamSize: 8,
    budget: 1200000
  },
  {
    id: '2',
    name: 'Психологическая помощь',
    category: 'Специализированные',
    totalClients: 289,
    satisfaction: 96,
    trend: 'up',
    completionRate: 88,
    responseTime: 0.8,
    complaints: 1,
    improvements: 8,
    color: COLORS.purple,
    icon: '🧠',
    growth: 12,
    priority: 'low',
    description: 'Профессиональная психологическая поддержка и консультации для различных категорий граждан, включая индивидуальные и групповые сессии',
    teamSize: 5,
    budget: 800000
  },
  {
    id: '3',
    name: 'Юридические консультации',
    category: 'Специализированные',
    totalClients: 312,
    satisfaction: 89,
    trend: 'stable',
    completionRate: 85,
    responseTime: 2.1,
    complaints: 5,
    improvements: 6,
    color: COLORS.emerald,
    icon: '⚖️',
    growth: 3,
    priority: 'medium',
    description: 'Бесплатные юридические консультации и правовая поддержка по вопросам социального обеспечения, жилищного права и гражданских прав',
    teamSize: 4,
    budget: 600000
  },
  {
    id: '4',
    name: 'Медицинский патронаж',
    category: 'Основные услуги',
    totalClients: 198,
    satisfaction: 91,
    trend: 'up',
    completionRate: 90,
    responseTime: 1.5,
    complaints: 2,
    improvements: 9,
    color: COLORS.rose,
    icon: '🏥',
    growth: 15,
    priority: 'low',
    description: 'Медицинское обслуживание на дому и патронажный уход для тяжелобольных и маломобильных граждан',
    teamSize: 6,
    budget: 1500000
  },
  {
    id: '5',
    name: 'Трудовая адаптация',
    category: 'Реабилитационные',
    totalClients: 134,
    satisfaction: 87,
    trend: 'down',
    completionRate: 78,
    responseTime: 3.2,
    complaints: 4,
    improvements: 15,
    color: COLORS.orange,
    icon: '💼',
    growth: -5,
    priority: 'high',
    description: 'Программы трудовой реабилитации и профессиональной адаптации для людей с ограниченными возможностями и безработных граждан',
    teamSize: 3,
    budget: 500000
  },
  {
    id: '6',
    name: 'Социальный транспорт',
    category: 'Вспомогательные',
    totalClients: 267,
    satisfaction: 82,
    trend: 'stable',
    completionRate: 95,
    responseTime: 0.5,
    complaints: 6,
    improvements: 4,
    color: COLORS.teal,
    icon: '🚗',
    growth: 2,
    priority: 'medium',
    description: 'Транспортные услуги для маломобильных граждан, включая доставку к медицинским учреждениям и социальным службам',
    teamSize: 4,
    budget: 900000
  }
];

const recentFeedback: Feedback[] = [
  {
    id: '1',
    service: 'Социальное сопровождение',
    client: 'Анна Петрова',
    rating: 5,
    comment: 'Очень внимательный и профессиональный подход. Спасибо за помощь в решении сложных бытовых вопросов! Социальный работник приходил регулярно, помог с оформлением документов и решением бытовых проблем.',
    date: '2024-11-15',
    type: 'positive',
    status: 'resolved',
    category: 'Основные услуги',
    urgency: 'low',
    response: 'Благодарим за отзыв! Рады, что смогли помочь.',
    tags: ['бытовые вопросы', 'документы', 'регулярность']
  },
  {
    id: '2',
    service: 'Юридические консультации',
    client: 'Иван Сидоров',
    rating: 3,
    comment: 'Долго ждал ответа на вопрос. Хотелось бы более оперативной связи и четких сроков рассмотрения обращений. Вопрос был срочный, а ответ пришел через 3 дня.',
    date: '2024-11-14',
    type: 'suggestion',
    status: 'in-progress',
    category: 'Специализированные',
    urgency: 'medium',
    tags: ['время ответа', 'срочность', 'связь']
  },
  {
    id: '3',
    service: 'Медицинский патронаж',
    client: 'Мария Козлова',
    rating: 5,
    comment: 'Врач очень внимательный, все объяснил. Очень благодарна за помощь и поддержку в трудной ситуации. Особенно хочу отметить профессионализм медсестры.',
    date: '2024-11-13',
    type: 'positive',
    status: 'resolved',
    category: 'Основные услуги',
    urgency: 'low',
    response: 'Спасибо за высокую оценку нашей работы!',
    tags: ['врач', 'медсестра', 'профессионализм']
  },
  {
    id: '4',
    service: 'Трудовая адаптация',
    client: 'Сергей Иванов',
    rating: 2,
    comment: 'Не смогли помочь с трудоустройством. Обещали перезвонить, но не перезвонили. Очень разочарован. Прошел все собеседования, но результат нулевой.',
    date: '2024-11-12',
    type: 'negative',
    status: 'new',
    category: 'Реабилитационные',
    urgency: 'high',
    tags: ['трудоустройство', 'связь', 'результат']
  }
];

const qualityIndicators: QualityIndicator[] = [
  {
    id: '1',
    name: 'Общая удовлетворенность',
    currentValue: 92,
    targetValue: 95,
    trend: 'up',
    unit: '%',
    description: 'Общий уровень удовлетворенности клиентов всеми услугами центра',
    color: COLORS.success,
    progress: 92,
    variance: -3.2,
    history: [88, 89, 90, 91, 92, 92]
  },
  {
    id: '2',
    name: 'Время ответа',
    currentValue: 1.6,
    targetValue: 1.0,
    trend: 'down',
    unit: 'дн',
    description: 'Среднее время ответа на обращения клиентов по всем услугам',
    color: COLORS.warning,
    progress: 62,
    variance: 60.0,
    history: [2.1, 1.9, 1.8, 1.7, 1.6, 1.6]
  },
  {
    id: '3',
    name: 'Выполнение услуг',
    currentValue: 88,
    targetValue: 90,
    trend: 'stable',
    unit: '%',
    description: 'Процент выполненных услуг в установленные сроки',
    color: COLORS.info,
    progress: 88,
    variance: -2.2,
    history: [85, 86, 87, 87, 88, 88]
  },
  {
    id: '4',
    name: 'Количество жалоб',
    currentValue: 8,
    targetValue: 5,
    trend: 'up',
    unit: 'шт',
    description: 'Количество жалоб от клиентов за текущий месяц',
    color: COLORS.error,
    progress: 37,
    variance: 60.0,
    history: [6, 7, 7, 8, 8, 8]
  }
];

const improvementAreas: ImprovementArea[] = [
  {
    area: 'Время ответа на обращения',
    current: '2.1 дня',
    target: '1.0 день',
    priority: 'high',
    services: ['Юридические консультации', 'Трудовая адаптация'],
    color: COLORS.orange,
    progress: 45,
    deadline: '2024-12-15',
    description: 'Сокращение времени обработки входящих обращений за счет оптимизации рабочих процессов и внедрения системы автоматического распределения заявок'
  },
  {
    area: 'Удовлетворенность транспортными услугами',
    current: '82%',
    target: '90%',
    priority: 'medium',
    services: ['Социальный транспорт'],
    color: COLORS.warning,
    progress: 68,
    deadline: '2024-12-01',
    description: 'Повышение качества транспортного обслуживания через обновление автопарка и улучшение подготовки водителей'
  },
  {
    area: 'Завершение услуг в срок',
    current: '78%',
    target: '85%',
    priority: 'medium',
    services: ['Трудовая адаптация'],
    color: COLORS.blue,
    progress: 72,
    deadline: '2024-11-30',
    description: 'Улучшение планирования и выполнения услуг за счет внедрения системы контроля сроков и мониторинга прогресса'
  }
];

const departmentDistribution = [
  { name: "Соцработники", value: 45, color: `rgba(${COLORS.blue}, 0.8)` },
  { name: "Психологи", value: 18, color: `rgba(${COLORS.purple}, 0.8)` },
  { name: "Юристы", value: 8, color: `rgba(${COLORS.emerald}, 0.8)` },
  { name: "Медработники", value: 12, color: `rgba(${COLORS.rose}, 0.8)` },
  { name: "Администрация", value: 6, color: `rgba(${COLORS.amber}, 0.8)` }
];

const quickActions = [
  { 
    icon: '📝', 
    label: 'Новый опрос', 
    color: COLORS.blue,
    description: 'Создать опрос удовлетворенности' 
  },
  { 
    icon: '📊', 
    label: 'Анализ качества', 
    color: COLORS.emerald,
    description: 'Детальный анализ метрик' 
  },
  { 
    icon: '💬', 
    label: 'Обработать отзывы', 
    color: COLORS.orange,
    description: 'Новые отзывы клиентов' 
  },
  { 
    icon: '🎯', 
    label: 'Установить цели', 
    color: COLORS.purple,
    description: 'Поставить новые KPI' 
  },
  { 
    icon: '📋', 
    label: 'Создать отчет', 
    color: COLORS.indigo,
    description: 'Генерация отчетов' 
  },
  { 
    icon: '🔄', 
    label: 'Запустить улучшения', 
    color: COLORS.teal,
    description: 'Внедрить улучшения' 
  }
];

// ========== ВИДЖЕТЫ ==========

function ServiceMetricCard({ metric, onCardClick }: { metric: ServiceMetric; onCardClick: () => void }) {
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
    '--glow-color': metric.color
  } as React.CSSProperties;

  const content = (
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
        <div className="flex items-center gap-3 flex-grow">
          <motion.div 
            className="text-2xl"
            animate={{ scale: isHovered ? 1.3 : 1, rotate: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            {metric.icon}
          </motion.div>
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold text-white text-base mb-1 leading-tight">
              {metric.name}
            </h3>
            <p className="text-white/60 text-xs truncate">
              {metric.category}
            </p>
          </div>
        </div>
        <motion.div 
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border backdrop-blur-sm ${
            metric.trend === 'up' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
            metric.trend === 'down' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
            'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
          {metric.satisfaction}%
        </motion.div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5">
          <div className="text-white font-bold text-lg mb-1">
            {formatNumber(metric.totalClients)}
          </div>
          <div className="text-white/60 text-xs">Клиентов</div>
        </div>
        <div className="text-center p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5">
          <div className="text-white font-bold text-lg mb-1">
            {metric.completionRate}%
          </div>
          <div className="text-white/60 text-xs">Выполнение</div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-center text-xs text-white/60 mb-2">
          <span>Удовлетворенность</span>
          <span className="font-semibold">{metric.satisfaction}%</span>
        </div>
        <ProgressBar 
          value={metric.satisfaction} 
          color={`rgb(${metric.color})`}
          height="sm"
          animated={true}
        />
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${metric.color}, 0.4) 0%, transparent 50%)`
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
  );

  return (
    <AdvancedParticleCard
      className={baseClassName}
      style={cardStyle}
      particleCount={12}
      glowColor={metric.color}
      enableTilt={true}
      clickEffect={true}
      enableMagnetism={true}
      intensity={1.2}
      onCardClick={onCardClick}
    >
      {content}
    </AdvancedParticleCard>
  );
}

function QualityIndicatorCard({ indicator }: { indicator: QualityIndicator }) {
  const progress = (indicator.currentValue / indicator.targetValue) * 100;
  const isOnTarget = indicator.currentValue >= indicator.targetValue;
  const variance = ((indicator.currentValue - indicator.targetValue) / indicator.targetValue) * 100;

  return (
    <AdvancedParticleCard
      className="card flex flex-col justify-between relative min-h-[140px] w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': indicator.color,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={indicator.color}
      intensity={1.1}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-white text-sm flex-grow mr-3 leading-tight">
            {indicator.name}
          </h4>
          <div className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm border ${
            isOnTarget ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
          }`}>
            {isOnTarget ? '✓' : '!'}
          </div>
        </div>
        
        <div className="space-y-3 flex-grow">
          <div className="flex justify-between items-baseline">
            <span className="text-white font-bold text-xl">
              {indicator.currentValue}{indicator.unit}
            </span>
            <span className="text-white/60 text-xs">
              из {indicator.targetValue}{indicator.unit}
            </span>
          </div>
          
          <ProgressBar 
            value={Math.min(progress, 100)} 
            color={`rgb(${indicator.color})`} 
            height="sm"
            animated={true}
          />
          
          <p className="text-white/60 text-xs leading-relaxed">
            {indicator.description}
          </p>
        </div>

        <div className="flex justify-between items-center mt-3">
          <span 
            className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm border ${
              indicator.trend === 'up' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
              indicator.trend === 'down' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
              'bg-gray-500/20 text-gray-400 border-gray-500/30'
            }`}
          >
            {indicator.trend === 'up' ? '↗ Рост' : 
             indicator.trend === 'down' ? '↘ Снижение' : '→ Стабильно'}
          </span>
          <span className="text-white/60 text-xs">
            {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
          </span>
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${indicator.color}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

function FeedbackCard({ feedback }: { feedback: Feedback }) {
  const getStatusColor = (status: Feedback['status']) => {
    switch (status) {
      case 'new': return COLORS.orange;
      case 'in-progress': return COLORS.blue;
      case 'resolved': return COLORS.success;
      default: return COLORS.gray;
    }
  };

  const getTypeColor = (type: Feedback['type']) => {
    switch (type) {
      case 'positive': return COLORS.success;
      case 'negative': return COLORS.error;
      case 'suggestion': return COLORS.warning;
      default: return COLORS.gray;
    }
  };

  const statusColor = getStatusColor(feedback.status);
  const typeColor = getTypeColor(feedback.type);

  return (
    <AdvancedParticleCard
      className="card flex flex-col justify-between relative min-h-[160px] w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': statusColor,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={statusColor}
      intensity={1.1}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold text-white text-sm mb-1 leading-tight">
              {feedback.service}
            </h3>
            <p className="text-white/60 text-xs truncate">
              {feedback.client}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xs ${
                    i < feedback.rating ? 'text-yellow-400' : 'text-white/30'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span 
              className="px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border"
              style={{
                backgroundColor: `rgba(${typeColor}, 0.15)`,
                color: `rgb(${typeColor})`,
                borderColor: `rgba(${typeColor}, 0.3)`
              }}
            >
              {feedback.type === 'positive' ? 'Положительный' : 
               feedback.type === 'negative' ? 'Отрицательный' : 'Предложение'}
            </span>
          </div>
        </div>

        <div className="mb-4 flex-grow">
          <p className="text-white/80 text-xs leading-relaxed line-clamp-3">
            {feedback.comment}
          </p>
        </div>

        {feedback.tags && feedback.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {feedback.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-lg text-xs bg-white/10 text-white/80 backdrop-blur-sm border border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center">
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border"
            style={{
              backgroundColor: `rgba(${statusColor}, 0.15)`,
              color: `rgb(${statusColor})`,
              borderColor: `rgba(${statusColor}, 0.3)`
            }}
          >
            {feedback.status === 'new' ? 'Новый' : 
             feedback.status === 'in-progress' ? 'В работе' : 'Решён'}
          </span>
          <span className="text-white/60 text-xs">
            {formatDate(feedback.date)}
          </span>
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

export default function QualityMonitoringPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [modal, setModal] = useState<ModalState>({ isOpen: false, type: null });

  const stats = useMemo(() => ({
    totalServices: serviceMetrics.length,
    averageSatisfaction: Math.round(serviceMetrics.reduce((sum, metric) => sum + metric.satisfaction, 0) / serviceMetrics.length),
    totalClients: serviceMetrics.reduce((sum, metric) => sum + metric.totalClients, 0),
    totalComplaints: serviceMetrics.reduce((sum, metric) => sum + metric.complaints, 0),
    resolvedFeedback: recentFeedback.filter(f => f.status === 'resolved').length,
    pendingFeedback: recentFeedback.filter(f => f.status !== 'resolved').length,
    improvementAreas: improvementAreas.length,
    totalBudget: serviceMetrics.reduce((sum, metric) => sum + metric.budget, 0),
    teamSize: serviceMetrics.reduce((sum, metric) => sum + metric.teamSize, 0)
  }), []);

  const filteredServices = useMemo(() => 
    activeFilter === 'all' 
      ? serviceMetrics 
      : serviceMetrics.filter(metric => 
          activeFilter === 'high' ? metric.satisfaction >= 90 :
          activeFilter === 'medium' ? metric.satisfaction >= 80 && metric.satisfaction < 90 :
          metric.satisfaction < 80
        ),
  [activeFilter]);

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

  const handleServiceClick = (service: ServiceMetric) => {
    setModal({ isOpen: true, type: 'service', data: service });
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
        {modal.isOpen && modal.type === 'service' && (
          <ServiceModal 
            isOpen={modal.isOpen} 
            onClose={closeModal} 
            service={modal.data} 
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
              <span className="text-white text-xs sm:text-sm">Система мониторинга активна</span>
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
                  <span className="text-2xl sm:text-3xl lg:text-4xl">✅</span>
                  <span>Мониторинг качества услуг</span>
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Центр социальной помощи "Забота" • Контроль качества и управление улучшениями
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>{stats.totalServices} услуг</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>{formatNumber(stats.totalClients)} клиентов</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>{stats.averageSatisfaction}% удовлетворенность</span>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="text-right"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-white font-bold text-xl sm:text-2xl bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg">
                  {stats.averageSatisfaction}%
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Общая удовлетворенность</div>
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
                  { id: 'all' as const, label: 'Все' },
                  { id: 'high' as const, label: 'Высокие' },
                  { id: 'medium' as const, label: 'Средние' },
                  { id: 'low' as const, label: 'Низкие' }
                ].map((filter) => (
                  <motion.button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeFilter === filter.id
                        ? 'bg-white/20 text-white shadow-lg border border-white/30'
                        : 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {filter.label}
                  </motion.button>
                ))}
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <motion.button
                  className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white transition-all duration-300 text-xs sm:text-sm font-medium backdrop-blur-sm flex items-center gap-1 sm:gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Экспорт отчета</span>
                </motion.button>
              </div>
            </motion.div>

            <motion.div 
              className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center">
                <div className="text-green-400 font-bold text-base sm:text-xl">{formatCurrency(stats.totalBudget)}</div>
                <div className="text-white/60 text-xs">Общий бюджет</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold text-base sm:text-xl">{stats.teamSize}</div>
                <div className="text-white/60 text-xs">Сотрудников</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-bold text-base sm:text-xl">{stats.resolvedFeedback}</div>
                <div className="text-white/60 text-xs">Обработано отзывов</div>
              </div>
            </motion.div>
            
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-tr from-emerald-500/15 to-cyan-500/15 rounded-full blur-xl" />
          </div>
        </motion.section>

        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Показатели услуг</h2>
          <BentoCardGrid gridRef={gridRef} className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredServices.map((metric) => (
                <ServiceMetricCard key={metric.id} metric={metric} onCardClick={() => handleServiceClick(metric)} />
              ))}
            </div>
          </BentoCardGrid>
        </motion.section>

        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <BentoCardGrid gridRef={gridRef}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              {/* Quality Indicators */}
              <div className="xl:col-span-2">
                <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="text-2xl">🎯</div>
                    <h2 className="text-xl font-bold text-white">Ключевые показатели</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {qualityIndicators.map((indicator) => (
                      <QualityIndicatorCard key={indicator.id} indicator={indicator} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Feedback */}
              <div className="xl:col-span-2">
                <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="text-2xl">💬</div>
                    <h2 className="text-xl font-bold text-white">Последние отзывы</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {recentFeedback.map((feedback) => (
                      <FeedbackCard key={feedback.id} feedback={feedback} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="xl:col-span-2">
                <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="text-2xl">⚡</div>
                    <h2 className="text-xl font-bold text-white">Быстрые действия</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {quickActions.map((action, index) => (
                      <QuickActionCard key={index} action={action} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Team Structure */}
              <div className="xl:col-span-2">
                <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="text-2xl">👥</div>
                    <h2 className="text-xl font-bold text-white">Структура команды</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {departmentDistribution.map((dept, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full transition-transform group-hover:scale-125"
                            style={{ backgroundColor: dept.color }}
                          />
                          <span className="text-white text-sm">{dept.name}</span>
                        </div>
                        <div className="text-white font-bold">{dept.value} чел.</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </BentoCardGrid>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="text-2xl">🚀</div>
              <h2 className="text-xl font-bold text-white">Области для улучшения</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {improvementAreas.map((improvement, index) => (
                <motion.div
                  key={index}
                  className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-white/20 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-white text-base flex-grow mr-3 leading-tight">
                      {improvement.area}
                    </h4>
                    <span 
                      className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm border flex-shrink-0 ${
                        improvement.priority === 'high' 
                          ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                          : improvement.priority === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-green-500/20 text-green-400 border-green-500/30'
                      }`}
                    >
                      {improvement.priority === 'high' ? 'Высокий' : 
                       improvement.priority === 'medium' ? 'Средний' : 'Низкий'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-white/60 mb-4">
                    <span>Текущий: {improvement.current}</span>
                    <span>Цель: {improvement.target}</span>
                  </div>
                  
                  <ProgressBar 
                    value={improvement.progress} 
                    color={`rgb(${improvement.color})`} 
                    height="sm"
                    animated={true}
                  />
                  
                  <div className="flex justify-between text-xs text-white/40 mt-2 mb-4">
                    <span>Прогресс: {improvement.progress}%</span>
                    <span>До: {formatDate(improvement.deadline)}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-white/60">Затронутые услуги:</div>
                    <div className="flex flex-wrap gap-1">
                      {improvement.services.map((service, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-lg text-xs bg-white/10 text-white/80 backdrop-blur-sm border border-white/5"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
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
              <span className="hidden sm:inline">Система мониторинга качества v2.0</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span>{serviceMetrics.length} услуг</span>
              <span>•</span>
              <span>Обновлено: {currentTime}</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}