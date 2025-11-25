'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

// =============================================================================
// КОНСТАНТЫ И ТИПЫ
// =============================================================================

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

// Типы для данных
interface Service {
  id: number;
  name: string;
  category: string;
  icon: string;
  status: 'active' | 'development' | 'paused';
  price: string;
  ordersPerMonth: string;
  utilization: number;
  color: string;
  rating: number;
  reviews: number;
  tags: string[];
  description: string;
  duration: string;
  specialist: string;
  requirements: string;
  managerStats: {
    assignedCouriers: number;
    completionRate: number;
    satisfaction: number;
    revenue: string;
    onTimeDelivery: number;
  };
}

interface TeamMember {
  name: string;
  role: string;
  deliveries: number;
  completion: number;
  rating: number;
  status: 'active' | 'vacation' | 'training';
  vehicle: string;
  avatar?: string;
}

interface Task {
  id: number;
  title: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  assigned: string;
  progress: number;
  department: string;
}

interface Metric {
  category: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  icon: string;
}

interface DeliveryIndicator {
  name: string;
  value: number;
  target: number;
  color: string;
}

// =============================================================================
// УТИЛИТЫ И ФОРМАТТЕРЫ
// =============================================================================

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
    month: 'long',
    year: 'numeric'
  });
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'development': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'paused': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'training': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'vacation': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'active': return 'Активна';
    case 'development': return 'В разработке';
    case 'paused': return 'Приостановлена';
    case 'training': return 'Обучение';
    case 'vacation': return 'Отпуск';
    default: return status;
  }
};

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

// =============================================================================
// АНИМАЦИИ И GSAP УТИЛИТЫ
// =============================================================================

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(${color}, 1) 0%, rgba(${color}, 0.3) 70%);
    box-shadow: 0 0 8px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
    filter: blur(0.3px);
    will-change: transform, opacity;
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

// =============================================================================
// КОМПОНЕНТЫ ИНТЕРФЕЙСА
// =============================================================================

// Оптимизированный ParticleCard
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
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);
  const animationFrameRef = useRef<number>(0);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();
    cancelAnimationFrame(animationFrameRef.current);

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

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        const angle = Math.random() * Math.PI * 2;
        const distance = 15 + Math.random() * 45;
        const duration = 1.2 + Math.random() * 1.5;

        gsap.fromTo(clone, 
          { 
            scale: 0, 
            opacity: 0,
            x: 0,
            y: 0
          }, 
          { 
            scale: 1, 
            opacity: 0.7, 
            duration: 0.3, 
            ease: 'back.out(1.5)' 
          }
        );

        gsap.to(clone, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          rotation: Math.random() * 360 - 180,
          duration: duration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });

        gsap.to(clone, {
          opacity: 0.2,
          duration: duration * 0.6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 60);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;
    let rafId: number;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 2,
          rotateY: 2,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      gsap.to(element, {
        '--glow-intensity': 1,
        duration: 0.2,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      gsap.to(element, {
        '--glow-intensity': 0,
        duration: 0.4,
        ease: 'power2.out'
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        if (enableTilt) {
          const rotateX = ((y - centerY) / centerY) * -3;
          const rotateY = ((x - centerX) / centerX) * 3;

          gsap.to(element, {
            rotateX,
            rotateY,
            duration: 0.08,
            ease: 'power1.out',
            transformPerspective: 1000
          });
        }

        if (enableMagnetism) {
          const magnetX = (x - centerX) * 0.02;
          const magnetY = (y - centerY) * 0.02;

          if (magnetismAnimationRef.current) {
            magnetismAnimationRef.current.kill();
          }

          magnetismAnimationRef.current = gsap.to(element, {
            x: magnetX,
            y: magnetY,
            duration: 0.15,
            ease: 'power2.out'
          });
        }

        updateCardGlowProperties(element, e.clientX, e.clientY, 1, DEFAULT_SPOTLIGHT_RADIUS);
      });
    };

    const handleClick = (e: MouseEvent) => {
      if (clickEffect) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const maxDistance = Math.max(
          Math.hypot(x, y),
          Math.hypot(x - rect.width, y),
          Math.hypot(x, y - rect.height),
          Math.hypot(x - rect.width, y - rect.height)
        );

        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: absolute;
          width: ${maxDistance * 2}px;
          height: ${maxDistance * 2}px;
          border-radius: 50%;
          background: radial-gradient(circle, 
            rgba(${glowColor}, 0.5) 0%, 
            rgba(${glowColor}, 0.2) 40%, 
            rgba(${glowColor}, 0.1) 70%,
            transparent 100%
          );
          left: ${x - maxDistance}px;
          top: ${y - maxDistance}px;
          pointer-events: none;
          z-index: 1000;
          mix-blend-mode: screen;
          will-change: transform, opacity;
        `;

        element.appendChild(ripple);

        gsap.fromTo(
          ripple,
          {
            scale: 0,
            opacity: 1
          },
          {
            scale: 1,
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
      cancelAnimationFrame(rafId);
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor, onCardClick]);

  return (
    <motion.div
      ref={cardRef}
      className={`${className} relative overflow-hidden cursor-pointer will-change-transform`}
      style={{ 
        ...style, 
        position: 'relative', 
        overflow: 'hidden',
        transformStyle: 'preserve-3d'
      }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  );
};

// GlobalSpotlight компонент
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
  const rafId = useRef<number>(0);

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
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 20%,
        rgba(${glowColor}, 0.03) 35%,
        rgba(${glowColor}, 0.01) 50%,
        transparent 65%
      );
      z-index: 199;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
      filter: blur(15px);
      transition: opacity 0.2s ease;
      will-change: left, top, opacity;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;

      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const section = gridRef.current!.closest('.bento-section');
        const rect = section?.getBoundingClientRect();
        const mouseInside =
          rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

        isInsideSection.current = mouseInside || false;
        const cards = gridRef.current!.querySelectorAll('.card');

        if (!mouseInside) {
          gsap.to(spotlightRef.current, {
            opacity: 0,
            duration: 0.3,
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
          duration: 0.08,
          ease: 'power2.out'
        });

        const targetOpacity =
          minDistance <= proximity
            ? 0.4
            : minDistance <= fadeDistance
              ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.4
              : 0;

        gsap.to(spotlightRef.current, {
          opacity: targetOpacity,
          duration: targetOpacity > 0 ? 0.15 : 0.4,
          ease: 'power2.out'
        });
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
          duration: 0.3,
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
      cancelAnimationFrame(rafId.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

// BentoCardGrid компонент
const BentoCardGrid: React.FC<{
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}> = ({ children, gridRef, className = '' }) => (
  <motion.div
    className={`bento-section grid gap-4 sm:gap-6 p-4 sm:p-6 max-w-7xl select-none relative ${className}`}
    ref={gridRef}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

// ProgressBar компонент
const ProgressBar = ({ 
  value, 
  max = 100, 
  color = '#3B82F6', 
  label = '',
  showLabel = true,
  height = '6px'
}: { 
  value: number; 
  max?: number;
  color?: string;
  label?: string;
  showLabel?: boolean;
  height?: string;
}) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className="w-full">
      {showLabel && label && (
        <div className="flex justify-between text-white text-xs mb-1">
          <span>{label}</span>
          <span className="font-medium">{value}%</span>
        </div>
      )}
      <div className="w-full bg-white/5 rounded-full overflow-hidden" style={{ height }}>
        <motion.div 
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}40`
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />
      </div>
    </div>
  );
};

// RatingStars компонент
const RatingStars = ({ rating, size = 'sm', showValue = true }: { rating: number; size?: 'sm' | 'md' | 'lg'; showValue?: boolean }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <motion.span
          key={index}
          className={`${
            size === 'sm' ? 'text-xs' : 
            size === 'md' ? 'text-sm' : 'text-base'
          } ${
            index < fullStars ? 'text-yellow-400' : 
            index === fullStars && hasHalfStar ? 'text-yellow-400' : 'text-gray-500'
          }`}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          {index < fullStars ? '★' : 
           index === fullStars && hasHalfStar ? '★' : '☆'}
        </motion.span>
      ))}
      {showValue && (
        <span className={`text-white/60 ${
          size === 'sm' ? 'text-xs' : 
          size === 'md' ? 'text-sm' : 'text-sm'
        } ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

// ServiceCard компонент
const ServiceCard = ({ service, index, onServiceClick }: { service: Service; index: number; onServiceClick?: (service: Service) => void }) => {
  return (
    <motion.div 
      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ 
        y: -4,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400 }
      }}
      onClick={() => onServiceClick?.(service)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <motion.div 
            className="text-2xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {service.icon}
          </motion.div>
          <div>
            <div className="text-white font-bold text-sm group-hover:text-blue-300 transition-colors">
              {service.name}
            </div>
            <div className="text-white/60 text-xs">{service.category}</div>
          </div>
        </div>
        <motion.div 
          className={`px-2 py-1 rounded-full text-xs border backdrop-blur-sm ${getStatusColor(service.status)}`}
          whileHover={{ scale: 1.05 }}
        >
          {getStatusText(service.status)}
        </motion.div>
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-white text-xs">
          <span>Стоимость</span>
          <span className="font-bold">{service.price}</span>
        </div>
        <div className="flex justify-between text-white text-xs">
          <span>Заказов в месяц</span>
          <span>{service.ordersPerMonth}</span>
        </div>
        <ProgressBar 
          value={service.utilization} 
          label="Загрузка услуги" 
          color={service.color} 
          height="6px"
        />
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <RatingStars rating={service.rating} size="sm" />
        <span className="text-white/60 text-xs">{service.reviews} отзывов</span>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {service.tags.map((tag: string, tagIndex: number) => (
          <motion.span 
            key={tagIndex}
            className="text-xs bg-white/10 px-2 py-1 rounded border border-white/20 text-white/80 group-hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {tag}
          </motion.span>
        ))}
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </motion.div>
  );
};

// =============================================================================
// ДАННЫЕ
// =============================================================================

const deliveryServicesData: Service[] = [
  {
    id: 1,
    name: "Экспресс-доставка",
    category: "Курьерские услуги",
    icon: "🚀",
    status: "active",
    price: "от 350 ₽",
    ordersPerMonth: "1,245",
    utilization: 92,
    color: "#F59E0B",
    rating: 4.8,
    reviews: 567,
    tags: ["Срочно", "1-2 часа", "Курьер", "Экспресс"],
    description: "Срочная доставка документов и небольших посылок в течение 1-2 часов по городу. Гарантированное время доставки с отслеживанием в реальном времени.",
    duration: "1-2 часа",
    specialist: "Курьер-экспресс",
    requirements: "Вес до 5 кг, размеры до 30x30x30 см, обязательная упаковка",
    managerStats: {
      assignedCouriers: 15,
      completionRate: 96,
      satisfaction: 94,
      revenue: "435,750 ₽",
      onTimeDelivery: 95
    }
  },
  {
    id: 2,
    name: "Стандартная доставка",
    category: "Курьерские услуги",
    icon: "📦",
    status: "active",
    price: "от 200 ₽",
    ordersPerMonth: "2,890",
    utilization: 88,
    color: "#3B82F6",
    rating: 4.7,
    reviews: 892,
    tags: ["Стандарт", "День в день", "Надежно", "Эконом"],
    description: "Стандартная доставка посылок и документов в течение дня по всему городу. Оптимальное соотношение цены и скорости.",
    duration: "4-8 часов",
    specialist: "Курьер",
    requirements: "Вес до 20 кг, стандартная упаковка",
    managerStats: {
      assignedCouriers: 25,
      completionRate: 94,
      satisfaction: 92,
      revenue: "578,000 ₽",
      onTimeDelivery: 93
    }
  },
  {
    id: 3,
    name: "Межгородская доставка",
    category: "Логистика",
    icon: "🚚",
    status: "active",
    price: "от 800 ₽",
    ordersPerMonth: "456",
    utilization: 78,
    color: "#10B981",
    rating: 4.6,
    reviews: 234,
    tags: ["Межгород", "Регионы", "Грузы", "Транспорт"],
    description: "Доставка грузов и документов в другие города с гарантированными сроками. Собственная логистическая сеть по всей России.",
    duration: "1-3 дня",
    specialist: "Логист",
    requirements: "Обязательная упаковка, полный пакет документов",
    managerStats: {
      assignedCouriers: 8,
      completionRate: 90,
      satisfaction: 91,
      revenue: "364,800 ₽",
      onTimeDelivery: 89
    }
  },
  {
    id: 4,
    name: "Температурная доставка",
    category: "Специальные услуги",
    icon: "❄️",
    status: "active",
    price: "от 600 ₽",
    ordersPerMonth: "189",
    utilization: 65,
    color: "#06B6D4",
    rating: 4.9,
    reviews: 156,
    tags: ["Температура", "Еда", "Медицина", "Холод"],
    description: "Доставка продуктов и медицинских препаратов с соблюдением температурного режима. Специализированные термоконтейнеры.",
    duration: "2-4 часа",
    specialist: "Спецкурьер",
    requirements: "Строгое соблюдение температурных требований, специальная упаковка",
    managerStats: {
      assignedCouriers: 6,
      completionRate: 92,
      satisfaction: 96,
      revenue: "113,400 ₽",
      onTimeDelivery: 94
    }
  },
  {
    id: 5,
    name: "Крупногабаритная доставка",
    category: "Грузоперевозки",
    icon: "🏗️",
    status: "development",
    price: "от 1,500 ₽",
    ordersPerMonth: "78",
    utilization: 45,
    color: "#8B5CF6",
    rating: 4.5,
    reviews: 67,
    tags: ["Крупный", "Мебель", "Техника", "Грузчики"],
    description: "Доставка крупногабаритных товаров, мебели и бытовой техники с услугой грузчиков. Профессиональная команда монтажников.",
    duration: "3-6 часов",
    specialist: "Грузчик-курьер",
    requirements: "Габариты от 50x50x50 см, предварительный замер",
    managerStats: {
      assignedCouriers: 4,
      completionRate: 85,
      satisfaction: 89,
      revenue: "117,000 ₽",
      onTimeDelivery: 87
    }
  },
  {
    id: 6,
    name: "Ночная доставка",
    category: "Специальные услуги",
    icon: "🌙",
    status: "active",
    price: "от 500 ₽",
    ordersPerMonth: "312",
    utilization: 72,
    color: "#6366F1",
    rating: 4.7,
    reviews: 189,
    tags: ["Ночь", "24/7", "Срочно", "Круглосуточно"],
    description: "Круглосуточная доставка в ночное время для срочных заказов. Особые условия для медицинских и экстренных доставок.",
    duration: "1-3 часа",
    specialist: "Ночной курьер",
    requirements: "Доплата за ночное время, ограниченная зона доставки",
    managerStats: {
      assignedCouriers: 12,
      completionRate: 91,
      satisfaction: 93,
      revenue: "156,000 ₽",
      onTimeDelivery: 90
    }
  },
  {
    id: 7,
    name: "Доставка цветов",
    category: "Специальные услуги",
    icon: "💐",
    status: "active",
    price: "от 250 ₽",
    ordersPerMonth: "523",
    utilization: 81,
    color: "#EC4899",
    rating: 4.8,
    reviews: 278,
    tags: ["Цветы", "Подарки", "Праздники", "Букеты"],
    description: "Доставка свежих цветов и подарочных композиций. Собственная флористическая мастерская.",
    duration: "2-5 часов",
    specialist: "Флорист-курьер",
    requirements: "Предварительный заказ, температурный контроль",
    managerStats: {
      assignedCouriers: 8,
      completionRate: 95,
      satisfaction: 97,
      revenue: "130,750 ₽",
      onTimeDelivery: 96
    }
  },
  {
    id: 8,
    name: "Документная доставка",
    category: "Курьерские услуги",
    icon: "📄",
    status: "active",
    price: "от 150 ₽",
    ordersPerMonth: "1,890",
    utilization: 85,
    color: "#6B7280",
    rating: 4.6,
    reviews: 445,
    tags: ["Документы", "Юридические", "Срочно", "Конфиденциально"],
    description: "Специализированная доставка документов с повышенными требованиями к конфиденциальности и срокам.",
    duration: "1-4 часа",
    specialist: "Документный курьер",
    requirements: "Конфиденциальность, срочность, специальная упаковка",
    managerStats: {
      assignedCouriers: 18,
      completionRate: 93,
      satisfaction: 91,
      revenue: "283,500 ₽",
      onTimeDelivery: 94
    }
  }
];

const managerMetrics: Metric[] = [
  { category: "Всего заказов", value: "8,183", trend: "up", color: "#F59E0B", icon: "📦" },
  { category: "Активных услуг", value: "8", trend: "stable", color: "#10B981", icon: "✅" },
  { category: "Средний рейтинг", value: "4.7/5", trend: "up", color: "#F59E0B", icon: "⭐" },
  { category: "Выполнение плана", value: "89%", trend: "up", color: "#8B5CF6", icon: "📊" },
  { category: "Доход в месяц", value: "2.58M ₽", trend: "up", color: "#84CC16", icon: "💰" },
  { category: "Удовлетворенность", value: "93%", trend: "stable", color: "#06B6D4", icon: "😊" }
];

const teamPerformance: TeamMember[] = [
  {
    name: "Алексей Кузнецов",
    role: "Старший курьер",
    deliveries: 245,
    completion: 97,
    rating: 4.9,
    status: "active",
    vehicle: "Мотоцикл"
  },
  {
    name: "Мария Смирнова",
    role: "Курьер-логист",
    deliveries: 189,
    completion: 95,
    rating: 4.8,
    status: "active",
    vehicle: "Автомобиль"
  },
  {
    name: "Дмитрий Петров",
    role: "Спецкурьер",
    deliveries: 156,
    completion: 92,
    rating: 4.7,
    status: "active",
    vehicle: "Рефрижератор"
  },
  {
    name: "Ольга Васнецова",
    role: "Ночной курьер",
    deliveries: 134,
    completion: 90,
    rating: 4.6,
    status: "active",
    vehicle: "Автомобиль"
  },
  {
    name: "Сергей Новиков",
    role: "Грузчик-курьер",
    deliveries: 78,
    completion: 88,
    rating: 4.5,
    status: "training",
    vehicle: "Газель"
  },
  {
    name: "Иван Козлов",
    role: "Флорист-курьер",
    deliveries: 112,
    completion: 94,
    rating: 4.8,
    status: "active",
    vehicle: "Легковой автомобиль"
  }
];

const upcomingTasks: Task[] = [
  {
    id: 1,
    title: "Оптимизация маршрутов доставки",
    deadline: "2024-01-20",
    priority: "high",
    assigned: "Алексей Кузнецов",
    progress: 70,
    department: "Логистика"
  },
  {
    id: 2,
    title: "Обучение новых курьеров",
    deadline: "2024-01-25",
    priority: "medium",
    assigned: "Все старшие курьеры",
    progress: 45,
    department: "Персонал"
  },
  {
    id: 3,
    title: "Внедрение GPS-трекинга",
    deadline: "2024-02-01",
    priority: "high",
    assigned: "IT отдел",
    progress: 60,
    department: "Технологии"
  },
  {
    id: 4,
    title: "Аудит качества доставки",
    deadline: "2024-01-28",
    priority: "medium",
    assigned: "Мария Смирнова",
    progress: 30,
    department: "Контроль качества"
  },
  {
    id: 5,
    title: "Обновление автопарка",
    deadline: "2024-02-15",
    priority: "medium",
    assigned: "Сергей Новиков",
    progress: 20,
    department: "Транспорт"
  }
];

const deliveryIndicators: DeliveryIndicator[] = [
  { name: "Доставка вовремя", value: 94, target: 90, color: "#10B981" },
  { name: "Целостность груза", value: 97, target: 95, color: "#3B82F6" },
  { name: "Клиентская лояльность", value: 92, target: 85, color: "#8B5CF6" },
  { name: "Эффективность маршрутов", value: 88, target: 85, color: "#F59E0B" },
  { name: "Соблюдение температур", value: 96, target: 90, color: "#06B6D4" },
  { name: "Конфиденциальность", value: 99, target: 95, color: "#EC4899" }
];

// =============================================================================
// КАСТОМНЫЕ HOOKS
// =============================================================================

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

const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isLocked]);
};

const useTime = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

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

  return { currentTime, currentDate };
};

// =============================================================================
// ОСНОВНОЙ КОМПОНЕНТ
// =============================================================================

export default function DeliveryServicesManager() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const { currentTime, currentDate } = useTime();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('services');

  // Блокировка прокрутки при открытом модальном окне
  useScrollLock(isServiceModalOpen);

  // Мемоизированные вычисления
  const totalRevenue = useMemo(() => {
    return deliveryServicesData.reduce((sum, service) => {
      const revenue = service.managerStats.revenue === '0 ₽' ? 0 : 
        parseInt(service.managerStats.revenue.replace(/\s/g, '').replace('₽', ''));
      return sum + revenue;
    }, 0);
  }, []);

  const formatRevenue = useCallback((revenue: number) => {
    return new Intl.NumberFormat('ru-RU').format(revenue) + ' ₽';
  }, []);

  const handleServiceClick = useCallback((service: Service) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  }, []);

  const closeServiceModal = useCallback(() => {
    setIsServiceModalOpen(false);
    setSelectedService(null);
  }, []);

  // Глобальные стили
  const globalStyles = `
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
          rgba(var(--glow-color), calc(var(--glow-intensity) * 0.2)) 0%,
          rgba(var(--glow-color), calc(var(--glow-intensity) * 0.1)) 25%,
          rgba(var(--glow-color), calc(var(--glow-intensity) * 0.03)) 50%,
          transparent 70%
        ),
        linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
    }
    
    .card--border-glow::before {
      content: '';
      position: absolute;
      inset: 0;
      padding: 1px;
      background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
          rgba(var(--glow-color), calc(var(--glow-intensity) * 0.6)) 0%,
          rgba(var(--glow-color), calc(var(--glow-intensity) * 0.3)) 30%,
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
    
    .particle {
      filter: blur(0.3px);
      animation: float 2.5s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-8px) rotate(90deg); }
    }
    
    .gradient-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Улучшенная мобильная оптимизация */
    @media (max-width: 768px) {
      .bento-section {
        padding: 1rem;
        gap: 1rem;
      }
      
      .card--border-glow::before {
        display: none;
      }
      
      .global-spotlight {
        display: none;
      }
      
      .particle {
        display: none;
      }
      
      .mobile-optimized {
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }
    }
    
    /* Улучшения доступности */
    @media (prefers-reduced-motion: reduce) {
      .particle,
      .global-spotlight,
      .card--border-glow::before {
        display: none;
      }
      
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary} mobile-optimized`}>
      <style jsx global>{globalStyles}</style>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Заголовок страницы */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 md:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <motion.h1 
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  🚚 Управление услугами доставки
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-sm sm:text-base md:text-lg mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-orange-400">8 услуг доставки</span> • <span className="text-blue-400">8,183 заказов</span> • <span className="text-green-400">18 курьеров в команде</span>
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>Общий доход: {formatRevenue(totalRevenue)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>89% выполнение плана</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>93% удовлетворенность клиентов</span>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="text-right mt-4 sm:mt-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-white font-bold text-lg sm:text-xl md:text-2xl bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg">
                  Менеджер отдела
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Козлов Д.И.</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сегодня</div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-lg" />
          </div>
        </motion.section>

        {/* Навигационные табы */}
        <motion.div
          className="flex flex-wrap gap-2 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { id: 'services', label: 'Услуги и аналитика', icon: '🚚' },
            { id: 'team', label: 'Команда курьеров', icon: '👥' },
            { id: 'tasks', label: 'Операционные задачи', icon: '📋' },
            { id: 'reports', label: 'Отчеты доставки', icon: '📊' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              className={`px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
              }`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="hidden sm:inline">{tab.icon} </span>
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Основные метрики менеджера */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {managerMetrics.map((metric, index) => (
              <motion.div
                key={index}
                className="card--border-glow relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-2 sm:p-3 md:p-4 text-center group"
                style={{ '--glow-color': metric.color } as React.CSSProperties}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3 }}
                whileHover={{ y: isMobile ? 0 : -5, transition: { type: "spring", stiffness: 300 } }}
              >
                <motion.div 
                  className="text-base sm:text-lg mb-1 sm:mb-2"
                  whileHover={{ scale: isMobile ? 1 : 1.1, rotate: isMobile ? 0 : 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {metric.icon}
                </motion.div>
                <div className="text-white font-bold text-sm sm:text-base md:text-lg mb-1">{metric.value}</div>
                <div className="text-white/60 text-xs mb-1">{metric.category}</div>
                <div className={`text-xs ${
                  metric.trend === 'up' ? 'text-green-400' : 
                  metric.trend === 'down' ? 'text-red-400' : 'text-blue-400'
                }`}>
                  {metric.trend === 'up' ? '↗ Рост' : metric.trend === 'down' ? '↘ Снижение' : '→ Стабильно'}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Контент в зависимости от активной вкладки */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'services' && (
              <div className="space-y-6 sm:space-y-8">
                {/* Список услуг доставки */}
                <GlobalSpotlight
                  gridRef={gridRef}
                  disableAnimations={shouldDisableAnimations}
                  enabled={!isMobile}
                  spotlightRadius={DEFAULT_SPOTLIGHT_RADIUS}
                  glowColor={DEFAULT_GLOW_COLOR}
                />

                <BentoCardGrid gridRef={gridRef} className="mb-6 sm:mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {deliveryServicesData.map((service, index) => (
                      <ParticleCard
                        key={service.id}
                        className="card flex flex-col justify-between relative aspect-[4/3] min-h-[250px] sm:min-h-[300px] w-full max-w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
                        style={{
                          backgroundColor: 'var(--background-dark)',
                          color: 'var(--white)',
                          '--glow-x': '50%',
                          '--glow-y': '50%',
                          '--glow-intensity': '0',
                          '--glow-radius': '200px',
                          '--glow-color': service.color.replace('#', '')
                        } as React.CSSProperties}
                        disableAnimations={shouldDisableAnimations}
                        particleCount={isMobile ? 8 : DEFAULT_PARTICLE_COUNT}
                        glowColor={service.color.replace('#', '')}
                        enableTilt={!isMobile}
                        clickEffect={!isMobile}
                        enableMagnetism={!isMobile}
                        onCardClick={() => handleServiceClick(service)}
                      >
                        <div className="card__header flex justify-between items-start gap-2 sm:gap-3 relative text-white z-10">
                          <span 
                            className="card__label text-xs bg-white/10 px-2 sm:px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm"
                            style={{ color: service.color }}
                          >
                            {service.managerStats.assignedCouriers} курьеров
                          </span>
                          <motion.div 
                            className={`w-2 h-2 rounded-full ${
                              service.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
                            }`}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </div>
                        
                        <div className="card__content flex flex-col relative text-white z-10 flex-1">
                          <div className="flex items-center gap-3 mb-2 sm:mb-3">
                            <div className="text-2xl sm:text-3xl">{service.icon}</div>
                            <h3 className="card__title font-semibold text-lg sm:text-xl">
                              {service.name}
                            </h3>
                          </div>
                          
                          <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 flex-1">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="text-center p-2 bg-white/5 rounded-lg">
                                <div className="text-white font-bold">{service.managerStats.onTimeDelivery}%</div>
                                <div className="text-white/60">Вовремя</div>
                              </div>
                              <div className="text-center p-2 bg-white/5 rounded-lg">
                                <div className="text-white font-bold">{service.managerStats.satisfaction}%</div>
                                <div className="text-white/60">Удовлетворенность</div>
                              </div>
                            </div>
                            
                            <ProgressBar 
                              value={service.utilization} 
                              label="Загрузка услуги" 
                              color={service.color}
                              showLabel={true}
                              height="6px"
                            />
                            
                            <div className="text-center p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                              <div className="text-green-400 font-bold text-sm">{service.managerStats.revenue}</div>
                              <div className="text-green-400/60 text-xs">Доход в месяц</div>
                            </div>
                          </div>
                          
                          <div className="mt-auto">
                            <RatingStars rating={service.rating} size="sm" showValue={true} />
                            <div className="text-white/60 text-xs mt-1">{service.reviews} отзывов</div>
                          </div>
                        </div>

                        {/* Background gradient */}
                        <div 
                          className="absolute inset-0 opacity-20 transition-opacity duration-300"
                          style={{
                            background: `radial-gradient(circle at center, ${service.color}30 0%, transparent 70%)`
                          }}
                        />
                      </ParticleCard>
                    ))}
                  </div>
                </BentoCardGrid>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">👥 Команда курьеров</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {teamPerformance.map((member, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-white font-bold text-sm">{member.name}</div>
                          <div className="text-white/60 text-xs">{member.role}</div>
                          <div className="text-blue-400 text-xs mt-1">{member.vehicle}</div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(member.status)}`}>
                          {getStatusText(member.status)}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-white text-xs">
                          <span>Доставок</span>
                          <span className="font-bold">{member.deliveries}</span>
                        </div>
                        <ProgressBar value={member.completion} label="Выполнение" color="#F59E0B" height="4px" />
                        <div className="flex justify-between items-center">
                          <RatingStars rating={member.rating} size="sm" showValue={false} />
                          <span className="text-white/60 text-xs">{member.rating}/5</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">📋 Операционные задачи</h2>
                <div className="space-y-3 sm:space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${
                            task.priority === 'high' ? 'bg-red-400' : 
                            task.priority === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                          }`} />
                          <div className="text-white font-medium text-sm sm:text-base group-hover:text-orange-300 transition-colors">
                            {task.title}
                          </div>
                        </div>
                        <div className="text-white/60 text-xs">
                          {task.assigned} • {task.department} • До {formatDate(task.deadline)}
                        </div>
                        <ProgressBar value={task.progress} showLabel={false} height="4px" />
                      </div>
                      <div className="text-right ml-3">
                        <div className="text-white font-bold text-sm">{task.progress}%</div>
                        <div className="text-white/60 text-xs">Выполнено</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">📊 Показатели доставки</h3>
                  <div className="space-y-4">
                    {deliveryIndicators.map((indicator, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-white text-sm">
                          <span>{indicator.name}</span>
                          <span className="font-bold">{indicator.value}%</span>
                        </div>
                        <div className="flex justify-between text-white/60 text-xs mb-1">
                          <span>Цель: {indicator.target}%</span>
                          <span className={indicator.value >= indicator.target ? 'text-green-400' : 'text-yellow-400'}>
                            {indicator.value >= indicator.target ? '✅ Выполнено' : '⚠️ Требует внимания'}
                          </span>
                        </div>
                        <ProgressBar value={indicator.value} color={indicator.color} showLabel={false} height="6px" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">💰 Финансовые показатели</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {deliveryServicesData.map((service, index) => (
                      <div key={service.id} className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="text-lg">{service.icon}</div>
                          <span className="text-white text-xs sm:text-sm truncate">{service.name}</span>
                        </div>
                        <div className="text-right ml-2">
                          <div className="text-white font-bold text-xs sm:text-sm">{service.managerStats.revenue}</div>
                          <div className="text-white/60 text-xs">{service.ordersPerMonth} заказов</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Модальное окно деталей услуги доставки */}
      <AnimatePresence>
        {isServiceModalOpen && selectedService && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeServiceModal}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-black rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/20 max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                '--glow-color': selectedService.color.replace('#', ''),
                background: `radial-gradient(ellipse at center, rgba(var(--glow-color), 0.1) 0%, transparent 70%), linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`
              } as React.CSSProperties}
            >
              <div className="p-4 sm:p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="text-xl sm:text-2xl">{selectedService.icon}</div>
                    <div className="max-w-[200px] sm:max-w-none">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">{selectedService.name}</h2>
                      <p className="text-white/60 text-xs sm:text-sm truncate">{selectedService.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeServiceModal}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors flex-shrink-0"
                    aria-label="Закрыть модальное окно"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedService.managerStats.revenue}</div>
                    <div className="text-white/60 text-xs sm:text-sm">Доход в месяц</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedService.managerStats.assignedCouriers}</div>
                    <div className="text-white/60 text-xs sm:text-sm">Курьеров</div>
                  </div>
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Показатели доставки</h3>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                      <div className="text-white/60 text-xs mb-1">Доставка вовремя</div>
                      <div className="text-white font-semibold text-sm sm:text-base">{selectedService.managerStats.onTimeDelivery}%</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                      <div className="text-white/60 text-xs mb-1">Удовлетворенность</div>
                      <div className="text-white font-semibold text-sm sm:text-base">{selectedService.managerStats.satisfaction}%</div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Описание услуги</h3>
                  <p className="text-white/70 leading-relaxed text-sm sm:text-base">{selectedService.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                    <div className="text-white/60 text-xs mb-1">Специалист</div>
                    <div className="text-white font-semibold text-sm sm:text-base">{selectedService.specialist}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                    <div className="text-white/60 text-xs mb-1">Срок доставки</div>
                    <div className="text-white font-semibold text-sm sm:text-base">{selectedService.duration}</div>
                  </div>
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <div className="text-white/60 text-xs mb-1 sm:mb-2">Требования к доставке</div>
                  <div className="text-white font-semibold text-sm sm:text-base">{selectedService.requirements}</div>
                </div>
                
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <RatingStars rating={selectedService.rating} size={isMobile ? "sm" : "md"} />
                  <span className="text-white/60 text-xs sm:text-sm">{selectedService.reviews} отзывов</span>
                </div>
                
                <ProgressBar value={selectedService.utilization} label="Загрузка услуги" color={selectedService.color} height="6px" />
              </div>
              
              <div className="p-4 sm:p-6 border-t border-white/10">
                <div className="flex gap-3">
                  <motion.button
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
                    whileHover={{ scale: isMobile ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Управлять доставкой
                  </motion.button>
                  <motion.button
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
                    whileHover={{ scale: isMobile ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Логистика
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}