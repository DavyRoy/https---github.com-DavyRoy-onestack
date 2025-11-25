'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

// Константы для цветов
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

// Утилиты форматирования
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

// Улучшенная функция создания частиц
const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(${color}, 1) 0%, rgba(${color}, 0.3) 70%);
    box-shadow: 0 0 12px rgba(${color}, 0.8);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
    filter: blur(0.5px);
    transform-origin: center;
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

// Улучшенный ParticleCard с оптимизацией производительности
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
        duration: 0.4,
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
        const distance = 20 + Math.random() * 60;
        const duration = 1.5 + Math.random() * 2;

        gsap.fromTo(clone, 
          { 
            scale: 0, 
            opacity: 0,
            x: 0,
            y: 0
          }, 
          { 
            scale: 1, 
            opacity: 0.8, 
            duration: 0.4, 
            ease: 'back.out(1.7)' 
          }
        );

        gsap.to(clone, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          rotation: Math.random() * 720 - 360,
          duration: duration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });

        gsap.to(clone, {
          opacity: 0.2,
          duration: duration * 0.7,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 80);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  // Оптимизированный обработчик движения мыши
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!cardRef.current || (!enableTilt && !enableMagnetism)) return;

    animationFrameRef.current = requestAnimationFrame(() => {
      const element = cardRef.current!;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.03;
        const magnetY = (y - centerY) * 0.03;

        if (magnetismAnimationRef.current) {
          magnetismAnimationRef.current.kill();
        }

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.2,
          ease: 'power2.out'
        });
      }

      updateCardGlowProperties(element, e.clientX, e.clientY, 1, DEFAULT_SPOTLIGHT_RADIUS);
    });
  }, [enableTilt, enableMagnetism]);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    animateParticles();

    if (enableTilt && cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1.02,
        duration: 0.4,
        ease: 'power2.out'
      });
    }

    if (cardRef.current) {
      gsap.to(cardRef.current, {
        '--glow-intensity': 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [animateParticles, enableTilt]);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    clearAllParticles();

    if (cardRef.current) {
      if (enableTilt) {
        cardRef.current.style.transform = '';
      }

      if (enableMagnetism) {
        gsap.to(cardRef.current, {
          x: 0,
          y: 0,
          duration: 0.4,
          ease: 'power2.out'
        });
      }

      gsap.to(cardRef.current, {
        '--glow-intensity': 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [clearAllParticles, enableTilt, enableMagnetism]);

  const handleClick = useCallback((e: MouseEvent) => {
    if (clickEffect && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
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
          rgba(${glowColor}, 0.6) 0%, 
          rgba(${glowColor}, 0.3) 40%, 
          rgba(${glowColor}, 0.1) 70%,
          transparent 100%
        );
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
        mix-blend-mode: screen;
      `;

      cardRef.current.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1
        },
        {
          scale: 1,
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
  }, [clickEffect, glowColor, onCardClick]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

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
  }, [disableAnimations, handleMouseEnter, handleMouseLeave, handleMouseMove, handleClick, clearAllParticles]);

  return (
    <motion.div
      ref={cardRef}
      className={`${className} relative overflow-hidden cursor-pointer transform-gpu`}
      style={{ 
        ...style, 
        position: 'relative', 
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};

// Улучшенный GlobalSpotlight с throttle
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
  const lastTimeRef = useRef(0);
  const throttleDelay = 16; // ~60fps

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
        rgba(${glowColor}, 0.2) 0%,
        rgba(${glowColor}, 0.1) 20%,
        rgba(${glowColor}, 0.05) 35%,
        rgba(${glowColor}, 0.02) 50%,
        transparent 65%
      );
      z-index: 199;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
      filter: blur(20px);
      transition: opacity 0.3s ease;
      will-change: left, top, opacity;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTimeRef.current < throttleDelay) return;
      lastTimeRef.current = now;

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

      spotlightRef.current.style.left = `${e.clientX}px`;
      spotlightRef.current.style.top = `${e.clientY}px`;

      const targetOpacity =
        minDistance <= proximity
          ? 0.6
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.6
            : 0;

      spotlightRef.current.style.opacity = targetOpacity.toString();
    };

    const handleMouseLeave = () => {
      isInsideSection.current = false;
      gridRef.current?.querySelectorAll('.card').forEach(card => {
        (card as HTMLElement).style.setProperty('--glow-intensity', '0');
      });
      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = '0';
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

// Улучшенный BentoCardGrid
const BentoCardGrid: React.FC<{
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}> = ({ children, gridRef, className = '' }) => (
  <motion.div
    className={`bento-section grid gap-4 md:gap-6 p-4 md:p-6 max-w-7xl mx-auto select-none relative ${className}`}
    ref={gridRef}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    style={{
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
    }}
  >
    {children}
  </motion.div>
);

// Улучшенный хук для определения мобильных устройств
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
    };

    checkMobile();
    
    const resizeObserver = new ResizeObserver(checkMobile);
    resizeObserver.observe(document.body);

    return () => resizeObserver.disconnect();
  }, []);

  return isMobile;
};

// Улучшенный ProgressBar с анимацией
const ProgressBar = ({ 
  value, 
  max = 100, 
  color = '#3B82F6', 
  label = '',
  showLabel = true,
  height = '8px',
  animated = true
}: { 
  value: number; 
  max?: number;
  color?: string;
  label?: string;
  showLabel?: boolean;
  height?: string;
  animated?: boolean;
}) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className="w-full">
      {showLabel && label && (
        <div className="flex justify-between text-white text-sm mb-2">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}
      <div 
        className="w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm"
        style={{ height }}
      >
        <motion.div 
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ 
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}40`,
            filter: `drop-shadow(0 0 2px ${color})`
          }}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    </div>
  );
};

// Улучшенный RatingStars
const RatingStars = ({ 
  rating, 
  size = 'sm', 
  showValue = true,
  animated = true 
}: { 
  rating: number; 
  size?: 'sm' | 'md' | 'lg'; 
  showValue?: boolean;
  animated?: boolean;
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <motion.span
          key={index}
          className={`${
            size === 'sm' ? 'text-xs' : 
            size === 'md' ? 'text-sm' : 'text-lg'
          } ${
            index < fullStars ? 'text-yellow-400' : 
            index === fullStars && hasHalfStar ? 'text-yellow-400' : 'text-gray-500'
          } drop-shadow-sm`}
          whileHover={animated ? { scale: 1.2, rotate: 10 } : {}}
          transition={{ type: "spring", stiffness: 400 }}
          initial={animated ? { scale: 0 } : false}
          animate={animated ? { scale: 1 } : {}}
          transition={{ delay: index * 0.1 }}
        >
          {index < fullStars ? '★' : 
           index === fullStars && hasHalfStar ? '★' : '☆'}
        </motion.span>
      ))}
      {showValue && (
        <motion.span 
          className={`text-white/60 ${
            size === 'sm' ? 'text-xs' : 
            size === 'md' ? 'text-sm' : 'text-base'
          } ml-1`}
          initial={animated ? { opacity: 0 } : false}
          animate={animated ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          {rating.toFixed(1)}
        </motion.span>
      )}
    </div>
  );
};

// Новый компонент для статистики
const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = '#3B82F6', 
  trend,
  description 
}: { 
  title: string;
  value: string;
  icon: string;
  color?: string;
  trend?: { value: number; isPositive: boolean };
  description?: string;
}) => {
  return (
    <motion.div
      className="relative bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-4 md:p-6 border border-white/10 backdrop-blur-sm overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
    >
      {/* Анимированный фон */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${color}15 0%, transparent 70%)`
        }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <motion.div 
            className="text-2xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {icon}
          </motion.div>
          {trend && (
            <motion.div 
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                trend.isPositive 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </motion.div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="text-white font-bold text-xl md:text-2xl">{value}</div>
          <div className="text-white/60 text-sm">{title}</div>
          {description && (
            <div className="text-white/40 text-xs">{description}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Улучшенный ServiceCard
const ServiceCard = ({ 
  service, 
  index, 
  onServiceClick,
  compact = false 
}: { 
  service: any; 
  index: number; 
  onServiceClick?: (service: any) => void;
  compact?: boolean;
}) => {
  return (
    <motion.div 
      className="group relative bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-4 md:p-6 border border-white/10 hover:border-white/20 transition-all duration-500 backdrop-blur-sm cursor-pointer overflow-hidden"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 24
      }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onServiceClick?.(service)}
    >
      {/* Анимированный градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Светящийся эффект при hover */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${service.color}15 0%, transparent 50%)`
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <motion.div 
              className="text-2xl md:text-3xl flex-shrink-0"
              whileHover={{ 
                scale: 1.2, 
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.5 }
              }}
            >
              {service.icon}
            </motion.div>
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-bold text-base md:text-lg truncate group-hover:text-blue-300 transition-colors duration-300">
                {service.name}
              </h3>
              <p className="text-white/60 text-xs md:text-sm truncate">{service.category}</p>
            </div>
          </div>
          <motion.div 
            className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm flex-shrink-0 ml-2 ${
              service.status === 'active' 
                ? 'bg-green-500/20 text-green-400 border-green-500/30 shadow-lg shadow-green-500/10' 
                : service.status === 'development' 
                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-lg shadow-yellow-500/10'
                : 'bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-lg shadow-blue-500/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {service.status === 'active' ? 'Активна' : service.status === 'development' ? 'В разработке' : 'Приостановлена'}
          </motion.div>
        </div>
        
        {!compact && (
          <>
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-white font-bold text-sm">{service.price}</div>
                  <div className="text-white/60 text-xs">Стоимость</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-white font-bold text-sm">{service.ordersPerMonth}</div>
                  <div className="text-white/60 text-xs">Заказов/мес</div>
                </div>
              </div>
              
              <ProgressBar 
                value={service.utilization} 
                label="Загрузка услуги" 
                color={service.color} 
                height="6px"
                animated={true}
              />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <RatingStars 
                rating={service.rating} 
                size="sm" 
                showValue={false}
                animated={true}
              />
              <span className="text-white/60 text-xs">{service.reviews} отзывов</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {service.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                <motion.span 
                  key={tagIndex}
                  className="text-xs bg-white/10 px-2 py-1 rounded-lg border border-white/20 text-white/80 group-hover:bg-white/20 group-hover:text-white transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: 'rgba(255,255,255,0.2)'
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {tag}
                </motion.span>
              ))}
              {service.tags.length > 3 && (
                <span className="text-xs bg-white/10 px-2 py-1 rounded-lg border border-white/20 text-white/60">
                  +{service.tags.length - 3}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Анимированные границы */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

// Данные для клиентских услуг
const clientServicesData = [
  {
    id: 1,
    name: "Консультация по ремонту",
    category: "Консультации",
    icon: "💬",
    status: "active",
    price: "от 500 ₽",
    ordersPerMonth: "89",
    utilization: 65,
    color: "#3B82F6",
    rating: 4.9,
    reviews: 67,
    tags: ["Консультация", "Диагностика", "Ремонт", "Советы", "Эксперт"],
    description: "Профессиональная консультация по вопросам ремонта и обслуживания автомобиля с детальным разбором проблемы и рекомендациями по решению.",
    duration: "30-60 минут",
    specialist: "Эксперт-консультант",
    requirements: "Наличие автомобиля или фото/видео проблемы",
    features: ["Диагностика по фото/видео", "Пошаговый план ремонта", "Рекомендации запчастей", "Гарантия качества"],
    clientStats: {
      satisfaction: 96,
      repeatClients: 45,
      avgSessionTime: "45 мин",
      completionRate: 98
    }
  },
  {
    id: 2,
    name: "Выездная диагностика",
    category: "Диагностика",
    icon: "🚙",
    status: "active",
    price: "от 1,500 ₽",
    ordersPerMonth: "34",
    utilization: 58,
    color: "#F59E0B",
    rating: 4.8,
    reviews: 28,
    tags: ["Выезд", "Диагностика", "Срочно", "На месте", "Профессионал"],
    description: "Выезд специалиста для диагностики автомобиля на месте с полным отчетом и рекомендациями по ремонту.",
    duration: "1-2 часа",
    specialist: "Мобильный диагност",
    requirements: "Доступ к автомобилю",
    features: ["Полная диагностика", "Отчет с фото", "Рекомендации по ремонту", "Срочный выезд"],
    clientStats: {
      satisfaction: 94,
      repeatClients: 18,
      avgSessionTime: "1.5 часа",
      completionRate: 95
    }
  },
  {
    id: 3,
    name: "Подбор запчастей",
    category: "Запчасти",
    icon: "🔍",
    status: "active",
    price: "от 800 ₽",
    ordersPerMonth: "156",
    utilization: 82,
    color: "#10B981",
    rating: 4.7,
    reviews: 89,
    tags: ["Запчасти", "Оригинал", "Аналог", "Доставка", "Гарантия"],
    description: "Профессиональный подбор и поиск оригинальных и аналоговых запчастей с гарантией качества.",
    duration: "1-3 дня",
    specialist: "Специалист по запчастям",
    requirements: "VIN код или данные автомобиля",
    features: ["Поиск по VIN", "Сравнение цен", "Гарантия качества", "Доставка"],
    clientStats: {
      satisfaction: 92,
      repeatClients: 67,
      avgSessionTime: "2 дня",
      completionRate: 90
    }
  },
  {
    id: 4,
    name: "Эвакуация автомобиля",
    category: "Эвакуация",
    icon: "🚛",
    status: "active",
    price: "от 2,500 ₽",
    ordersPerMonth: "23",
    utilization: 42,
    color: "#EF4444",
    rating: 4.9,
    reviews: 19,
    tags: ["Эвакуация", "Срочно", "ДТП", "Буксировка", "Круглосуточно"],
    description: "Срочная эвакуация автомобиля к сервису или указанному адресу в любое время суток.",
    duration: "30-90 минут",
    specialist: "Водитель эвакуатора",
    requirements: "Местоположение автомобиля",
    features: ["Круглосуточно", "Срочный выезд", "Безопасная транспортировка", "Страхование"],
    clientStats: {
      satisfaction: 97,
      repeatClients: 8,
      avgSessionTime: "1 час",
      completionRate: 99
    }
  },
  {
    id: 5,
    name: "Автоюрист онлайн",
    category: "Юридические услуги",
    icon: "⚖️",
    status: "development",
    price: "от 1,200 ₽",
    ordersPerMonth: "15",
    utilization: 35,
    color: "#8B5CF6",
    rating: 4.8,
    reviews: 12,
    tags: ["Юрист", "Консультация", "ДТП", "Страхование", "Онлайн"],
    description: "Онлайн консультация автоюриста по вопросам ДТП, страховки и прав автомобилиста.",
    duration: "45-60 минут",
    specialist: "Автоюрист",
    requirements: "Документы по вопросу",
    features: ["Онлайн консультация", "Анализ документов", "Правовая поддержка", "Страховые вопросы"],
    clientStats: {
      satisfaction: 95,
      repeatClients: 6,
      avgSessionTime: "50 мин",
      completionRate: 88
    }
  },
  {
    id: 6,
    name: "Автомойка с выездом",
    category: "Мойка",
    icon: "✨",
    status: "active",
    price: "от 1,800 ₽",
    ordersPerMonth: "78",
    utilization: 71,
    color: "#EC4899",
    rating: 4.6,
    reviews: 45,
    tags: ["Мойка", "Выезд", "Чистка", "Уборка", "Экологично"],
    description: "Комплексная мойка и чистка автомобиля с выездом к клиенту с использованием профессиональной химии.",
    duration: "1-2 часа",
    specialist: "Мойщик-полировщик",
    requirements: "Доступ к воде и электричеству",
    features: ["Экологичные средства", "Полировка", "Чистка салона", "Защитное покрытие"],
    clientStats: {
      satisfaction: 91,
      repeatClients: 34,
      avgSessionTime: "1.5 часа",
      completionRate: 94
    }
  }
];

const clientMetrics = [
  { 
    category: "Всего клиентов", 
    value: "1,234", 
    trend: { value: 12, isPositive: true }, 
    color: "#3B82F6", 
    icon: "👥",
    description: "За последний месяц" 
  },
  { 
    category: "Активных услуг", 
    value: "6", 
    trend: { value: 0, isPositive: true }, 
    color: "#10B981", 
    icon: "✅",
    description: "Все услуги активны" 
  },
  { 
    category: "Средняя оценка", 
    value: "4.8/5", 
    trend: { value: 5, isPositive: true }, 
    color: "#F59E0B", 
    icon: "⭐",
    description: "На основе 260 отзывов" 
  },
  { 
    category: "Повторные клиенты", 
    value: "42%", 
    trend: { value: 8, isPositive: true }, 
    color: "#8B5CF6", 
    icon: "🔄",
    description: "Выше среднего по рынку" 
  },
  { 
    category: "Доход в месяц", 
    value: "856K ₽", 
    trend: { value: 15, isPositive: true }, 
    color: "#84CC16", 
    icon: "💰",
    description: "Растущий показатель" 
  },
  { 
    category: "Удовлетворенность", 
    value: "94%", 
    trend: { value: 2, isPositive: true }, 
    color: "#06B6D4", 
    icon: "😊",
    description: "Очень высокий уровень" 
  }
];

const clientReviews = [
  {
    name: "Анна Петрова",
    service: "Консультация по ремонту",
    rating: 5,
    date: "2024-01-15",
    comment: "Очень профессиональная консультация, помогли определить проблему быстро и точно! Рекомендую всем автомобилистам.",
    avatar: "👩",
    serviceType: "Консультация"
  },
  {
    name: "Дмитрий Иванов",
    service: "Выездная диагностика",
    rating: 5,
    date: "2024-01-14",
    comment: "Специалист приехал вовремя, все проверил и дал подробные рекомендации. Спасибо за качественную работу!",
    avatar: "👨",
    serviceType: "Диагностика"
  },
  {
    name: "Сергей Козлов",
    service: "Подбор запчастей",
    rating: 4,
    date: "2024-01-13",
    comment: "Нашли оригинальную запчасть по хорошей цене, доставили быстро. Буду обращаться еще!",
    avatar: "👨‍💼",
    serviceType: "Запчасти"
  },
  {
    name: "Мария Сидорова",
    service: "Эвакуация автомобиля",
    rating: 5,
    date: "2024-01-12",
    comment: "Очень выручили в сложной ситуации, приехали за 20 минут! Профессионалы своего дела!",
    avatar: "👩‍💼",
    serviceType: "Эвакуация"
  },
  {
    name: "Алексей Новиков",
    service: "Автомойка с выездом",
    rating: 5,
    date: "2024-01-11",
    comment: "Отличная мойка, машина как новая! Очень удобно, что приехали прямо ко мне.",
    avatar: "👨‍🔧",
    serviceType: "Мойка"
  },
  {
    name: "Екатерина Волкова",
    service: "Консультация по ремонту",
    rating: 4,
    date: "2024-01-10",
    comment: "Хорошая консультация, эксперт подробно все объяснил. Помог сэкономить на ремонте.",
    avatar: "👩‍🎓",
    serviceType: "Консультация"
  }
];

const upcomingAppointments = [
  {
    id: 1,
    client: "Иван Смирнов",
    service: "Консультация по ремонту",
    date: "2024-01-20 14:00",
    status: "confirmed",
    duration: "45 минут",
    contact: "+7 912 345-67-89"
  },
  {
    id: 2,
    client: "Ольга Новикова",
    service: "Выездная диагностика",
    date: "2024-01-20 16:30",
    status: "confirmed",
    duration: "1.5 часа",
    contact: "+7 923 456-78-90"
  },
  {
    id: 3,
    client: "Алексей Комаров",
    service: "Подбор запчастей",
    date: "2024-01-21 11:00",
    status: "pending",
    duration: "30 минут",
    contact: "+7 934 567-89-01"
  },
  {
    id: 4,
    client: "Екатерина Волкова",
    service: "Автомойка с выездом",
    date: "2024-01-21 13:00",
    status: "confirmed",
    duration: "2 часа",
    contact: "+7 945 678-90-12"
  },
  {
    id: 5,
    client: "Дмитрий Орлов",
    service: "Эвакуация автомобиля",
    date: "2024-01-21 09:00",
    status: "confirmed",
    duration: "1 час",
    contact: "+7 956 789-01-23"
  }
];

const serviceAnalytics = [
  { name: "Консультации", revenue: "44.5K", growth: "+15%", utilization: 65, color: "#3B82F6" },
  { name: "Выездная диагностика", revenue: "51K", growth: "+8%", utilization: 58, color: "#F59E0B" },
  { name: "Подбор запчастей", revenue: "124.8K", growth: "+22%", utilization: 82, color: "#10B981" },
  { name: "Эвакуация", revenue: "57.5K", growth: "+5%", utilization: 42, color: "#EF4444" },
  { name: "Автоюрист", revenue: "18K", growth: "+35%", utilization: 35, color: "#8B5CF6" },
  { name: "Автомойка", revenue: "140.4K", growth: "+12%", utilization: 71, color: "#EC4899" }
];

// Основной компонент с улучшениями
export default function ClientServicesManager() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('services');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');

  // Блокировка прокрутки при открытом модальном окне
  useEffect(() => {
    if (isServiceModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px'; // Компенсация для скроллбара
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    };
  }, [isServiceModalOpen]);

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

  const handleServiceClick = (service: any) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsServiceModalOpen(false);
    setSelectedService(null);
  };

  // Фильтрация и сортировка услуг
  const filteredServices = clientServicesData
    .filter(service => 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return parseInt(b.ordersPerMonth) - parseInt(a.ordersPerMonth);
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''));
        default:
          return 0;
      }
    });

  const totalRevenue = clientServicesData.reduce((sum, service) => {
    const monthlyRevenue = parseInt(service.ordersPerMonth) * parseInt(service.price.replace(/[^\d]/g, '')) / 100;
    return sum + monthlyRevenue;
  }, 0);

  const formatRevenue = (revenue: number) => {
    return new Intl.NumberFormat('ru-RU').format(Math.round(revenue)) + ' ₽';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary} relative overflow-x-hidden`}>
      {/* Глобальные стили */}
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
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.3)) 0%,
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.15)) 25%,
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.05)) 50%,
              transparent 70%
            ),
            linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
        }
        
        .card--border-glow::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 1px;
          background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.8)) 0%,
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.4)) 30%,
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
          filter: blur(0.5px);
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        /* Мобильная оптимизация */
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
        }

        /* Анимации для загрузки */
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-up {
          animation: slideInUp 0.6s ease-out;
        }

        /* Анимация пульсации для уведомлений */
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
          }
        }

        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Заголовок и поиск */}
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
                  💼 Клиентские услуги
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-sm sm:text-base md:text-lg mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-blue-400">6 клиентских услуг</span> • <span className="text-orange-400">1,234 клиентов</span> • <span className="text-green-400">42% повторных обращений</span>
                </motion.p>

                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>Общий доход: {formatRevenue(totalRevenue)}/месяц</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>94% удовлетворенность клиентов</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>4.8/5 средняя оценка</span>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="text-right mt-4 sm:mt-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-white font-bold text-lg sm:text-xl md:text-2xl bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg shadow-purple-500/25">
                  Менеджер по клиентским услугам
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Морозова Е.В.</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сегодня</div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-lg" />
          </div>
        </motion.section>

        {/* Основные метрики */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {clientMetrics.map((metric, index) => (
              <StatCard
                key={index}
                title={metric.category}
                value={metric.value}
                icon={metric.icon}
                color={metric.color}
                trend={metric.trend}
                description={metric.description}
              />
            ))}
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
            { id: 'services', label: 'Услуги и аналитика', icon: '💼' },
            { id: 'appointments', label: 'Ближайшие записи', icon: '📅' },
            { id: 'reviews', label: 'Отзывы клиентов', icon: '⭐' },
            { id: 'reports', label: 'Отчеты по услугам', icon: '📊' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              className={`px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-300 backdrop-blur-sm ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 border border-white/10'
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
                {/* Глобальный спотлайт */}
                <GlobalSpotlight
                  gridRef={gridRef}
                  disableAnimations={shouldDisableAnimations}
                  enabled={!isMobile}
                  spotlightRadius={DEFAULT_SPOTLIGHT_RADIUS}
                  glowColor={DEFAULT_GLOW_COLOR}
                />

                {/* Аналитика услуг */}
                <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">📊 Аналитика клиентских услуг</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {serviceAnalytics.map((service, index) => (
                      <motion.div
                        key={index}
                        className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-white font-bold text-sm">{service.name}</div>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            service.growth.includes('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {service.growth}
                          </div>
                        </div>
                        <div className="text-white font-bold text-lg mb-2">{service.revenue} ₽</div>
                        <ProgressBar value={service.utilization} label="Загрузка" color={service.color} height="4px" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Сетка услуг */}
                <BentoCardGrid gridRef={gridRef} className="mb-6 sm:mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredServices.map((service, index) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        index={index}
                        onServiceClick={handleServiceClick}
                      />
                    ))}
                  </div>
                  {filteredServices.length === 0 && (
                    <motion.div 
                      className="col-span-full text-center py-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="text-6xl mb-4">🔍</div>
                      <div className="text-white text-lg font-medium mb-2">Услуги не найдены</div>
                      <div className="text-white/60">Попробуйте изменить параметры поиска</div>
                    </motion.div>
                  )}
                </BentoCardGrid>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">📅 Ближайшие записи клиентов</h2>
                <div className="space-y-3 sm:space-y-4">
                  {upcomingAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className={`w-3 h-3 rounded-full ${
                          appointment.status === 'confirmed' ? 'bg-green-400' : 'bg-yellow-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-sm sm:text-base group-hover:text-purple-300 transition-colors truncate">
                            {appointment.client} - {appointment.service}
                          </div>
                          <div className="text-white/60 text-xs">
                            {new Date(appointment.date).toLocaleString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit'
                            })} • {appointment.duration}
                          </div>
                          <div className="text-white/40 text-xs mt-1">{appointment.contact}</div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      } border ml-3`}>
                        {appointment.status === 'confirmed' ? 'Подтверждена' : 'Ожидает'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">⭐ Отзывы клиентов</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {clientReviews.map((review, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{review.avatar}</div>
                          <div>
                            <div className="text-white font-bold text-sm">{review.name}</div>
                            <div className="text-white/60 text-xs">{review.service}</div>
                          </div>
                        </div>
                        <div className="text-white/60 text-xs">
                          {new Date(review.date).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                      
                      <RatingStars rating={review.rating} size="sm" showValue={false} />
                      
                      <p className="text-white/80 text-sm mt-3 leading-relaxed">
                        "{review.comment}"
                      </p>

                      <div className="mt-3 pt-3 border-t border-white/10">
                        <span className="text-white/60 text-xs bg-white/10 px-2 py-1 rounded">
                          {review.serviceType}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">📈 Эффективность услуг</h3>
                  <div className="space-y-4">
                    {clientServicesData.map((service, index) => (
                      <div key={service.id} className="space-y-2">
                        <div className="flex justify-between text-white text-sm">
                          <span className="flex items-center gap-2">
                            <span>{service.icon}</span>
                            <span>{service.name}</span>
                          </span>
                          <span className="font-bold">{service.clientStats.satisfaction}%</span>
                        </div>
                        <ProgressBar 
                          value={service.clientStats.satisfaction} 
                          color={service.color} 
                          showLabel={false} 
                          height="6px" 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">💰 Доход по услугам</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {clientServicesData.map((service, index) => {
                      const monthlyRevenue = parseInt(service.ordersPerMonth) * parseInt(service.price.replace(/[^\d]/g, '')) / 100;
                      return (
                        <div key={service.id} className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg group hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="text-lg">{service.icon}</div>
                            <span className="text-white text-xs sm:text-sm truncate">{service.name}</span>
                          </div>
                          <div className="text-right ml-2">
                            <div className="text-white font-bold text-xs sm:text-sm">{formatRevenue(monthlyRevenue)}</div>
                            <div className="text-white/60 text-xs">{service.ordersPerMonth} заказов</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Модальное окно деталей услуги */}
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
              className="bg-gradient-to-br from-gray-900 to-black rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/20 max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden flex flex-col"
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
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedService.clientStats.satisfaction}%</div>
                    <div className="text-white/60 text-xs sm:text-sm">Удовлетворенность</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedService.clientStats.repeatClients}</div>
                    <div className="text-white/60 text-xs sm:text-sm">Повторные клиенты</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedService.clientStats.completionRate}%</div>
                    <div className="text-white/60 text-xs sm:text-sm">Выполнение</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedService.clientStats.avgSessionTime}</div>
                    <div className="text-white/60 text-xs sm:text-sm">Среднее время</div>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-2">Описание услуги</h3>
                    <p className="text-white/70 text-sm">{selectedService.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white/60 text-xs mb-1">Специалист</h4>
                      <p className="text-white text-sm">{selectedService.specialist}</p>
                    </div>
                    <div>
                      <h4 className="text-white/60 text-xs mb-1">Время выполнения</h4>
                      <p className="text-white text-sm">{selectedService.duration}</p>
                    </div>
                    <div>
                      <h4 className="text-white/60 text-xs mb-1">Требования</h4>
                      <p className="text-white text-sm">{selectedService.requirements}</p>
                    </div>
                    <div>
                      <h4 className="text-white/60 text-xs mb-1">Заказов в месяц</h4>
                      <p className="text-white text-sm">{selectedService.ordersPerMonth}</p>
                    </div>
                  </div>

                  {selectedService.features && (
                    <div>
                      <h3 className="text-white font-bold text-sm sm:text-base mb-2">Особенности услуги</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedService.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-white/70 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-2">Теги услуги</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedService.tags.map((tag: string, index: number) => (
                        <span 
                          key={index}
                          className="text-xs bg-white/10 px-2 py-1 rounded border border-white/20 text-white/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-3">Рейтинг и отзывы</h3>
                    <div className="flex items-center justify-between">
                      <RatingStars rating={selectedService.rating} size="md" showValue={true} />
                      <span className="text-white/60 text-sm">{selectedService.reviews} отзывов</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-white/10 bg-white/5">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl font-medium transition-colors duration-200"
                    onClick={closeServiceModal}
                  >
                    Закрыть
                  </button>
                  <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl font-medium transition-colors duration-200 border border-white/20">
                    Редактировать услугу
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}