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
  const rafId = useRef<number>();

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
    if (rafId.current) cancelAnimationFrame(rafId.current);

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

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;
    let mouseX = 0;
    let mouseY = 0;

    const updateGlow = () => {
      if (!isHoveredRef.current) return;
      updateCardGlowProperties(element, mouseX, mouseY, 1, DEFAULT_SPOTLIGHT_RADIUS);
      rafId.current = requestAnimationFrame(updateGlow);
    };

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 3,
          rotateY: 3,
          scale: 1.02,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      gsap.to(element, {
        '--glow-intensity': 1,
        duration: 0.3,
        ease: 'power2.out'
      });

      rafId.current = requestAnimationFrame(updateGlow);
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.4,
          ease: 'power2.out'
        });
      }

      gsap.to(element, {
        '--glow-intensity': 0,
        duration: 0.5,
        ease: 'power2.out'
      });

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;

      mouseX = e.clientX;
      mouseY = e.clientY;
      
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power1.out',
          transformPerspective: 1000
        });
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
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor, onCardClick]);

  return (
    <motion.div
      ref={cardRef}
      className={`${className} relative overflow-hidden cursor-pointer`}
      style={{ 
        ...style, 
        position: 'relative', 
        overflow: 'hidden',
        transformStyle: 'preserve-3d'
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};

// Улучшенный GlobalSpotlight с оптимизацией
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
  const rafId = useRef<number>();

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
        duration: 0.1,
        ease: 'power2.out'
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.6
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.6
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
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

    // Throttled mousemove
    let ticking = false;
    const throttledMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleMouseMove(e);
          ticking = false;
        });
        ticking = true;
      }
    };

    document.addEventListener('mousemove', throttledMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.remove();
      if (rafId.current) cancelAnimationFrame(rafId.current);
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
    className={`bento-section grid gap-6 p-6 max-w-7xl select-none relative ${className}`}
    ref={gridRef}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    {children}
  </motion.div>
);

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

// Компонент для прогресс-бара
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
  const percentage = (value / max) * 100;
  
  return (
    <div className="w-full">
      {showLabel && label && (
        <div className="flex justify-between text-white text-sm mb-2">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}
      <div className="w-full bg-white/10 rounded-full overflow-hidden" style={{ height }}>
        <motion.div 
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}40`
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    </div>
  );
};

// Компонент для рейтинга
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
            size === 'md' ? 'text-sm' : 'text-lg'
          } ${
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
      {showValue && (
        <span className={`text-white/60 ${
          size === 'sm' ? 'text-xs' : 
          size === 'md' ? 'text-sm' : 'text-base'
        } ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

// Компонент для круговой диаграммы
const PieChart = ({ 
  data, 
  className = '',
  size = 100
}: { 
  data: { name: string; value: number; color: string }[]; 
  className?: string;
  size?: number;
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let accumulated = 0;
  
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const strokeDasharray = `${percentage} ${100 - percentage}`;
          const strokeDashoffset = -accumulated;
          accumulated += percentage;
          
          return (
            <motion.circle
              key={item.name}
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={item.color}
              strokeWidth="20"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700 ease-out"
              initial={{ strokeDashoffset: -accumulated + percentage, strokeDasharray: `0 100` }}
              animate={{ strokeDashoffset, strokeDasharray }}
              transition={{ duration: 1, delay: index * 0.1 }}
              style={{
                filter: `drop-shadow(0 0 4px ${item.color.replace('rgba', '').replace(')', ', 0.4)')})`
              }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center transform rotate-90">
          <div className="text-white font-bold text-sm">{total}%</div>
          <div className="text-white/60 text-xs">Всего</div>
        </div>
      </div>
    </div>
  );
};

// Улучшенный компонент для карточки услуги
const ServiceCard = ({ service, index, onServiceClick }: { service: any; index: number; onServiceClick?: (service: any) => void }) => {
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
          className={`px-2 py-1 rounded-full text-xs border backdrop-blur-sm ${
            service.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
            service.status === 'development' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
            'bg-blue-500/20 text-blue-400 border-blue-500/30'
          }`}
          whileHover={{ scale: 1.05 }}
        >
          {service.status === 'active' ? 'Активна' : service.status === 'development' ? 'В разработке' : 'Приостановлена'}
        </motion.div>
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-white text-xs">
          <span>Цена</span>
          <span className="font-bold">{service.price}</span>
        </div>
        <div className="flex justify-between text-white text-xs">
          <span>Пациентов в месяц</span>
          <span>{service.patientsPerMonth}</span>
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

// Расширенные данные для медицинских услуг менеджера
const medicalServicesData = [
  {
    id: 1,
    name: "Патронажный уход",
    category: "Медицинский уход",
    icon: "🏥",
    status: "active",
    price: "от 2,500 ₽",
    patientsPerMonth: "134",
    utilization: 88,
    color: "#EF4444",
    rating: 4.8,
    reviews: 92,
    tags: ["Квалифицировано", "Забота", "Реабилитация", "Уход"],
    description: "Профессиональный медицинский уход и патронаж на дому для пациентов с ограниченной мобильностью",
    duration: "Постоянно",
    specialist: "Медсестра/Сиделка",
    requirements: "Медицинские показания, направление врача",
    managerStats: {
      assignedPatients: 28,
      completionRate: 94,
      satisfaction: 95,
      revenue: "700,000 ₽",
      successRate: 92
    },
    trends: {
      patients: "+12%",
      revenue: "+8%",
      satisfaction: "+2%"
    }
  },
  {
    id: 2,
    name: "Реабилитационная терапия",
    category: "Медицинский уход",
    icon: "🔄",
    status: "active",
    price: "от 3,200 ₽",
    patientsPerMonth: "89",
    utilization: 75,
    color: "#8B5CF6",
    rating: 4.9,
    reviews: 67,
    tags: ["Реабилитация", "Восстановление", "Терапия", "Физкультура"],
    description: "Комплексные программы физической и медицинской реабилитации после операций и травм",
    duration: "3-12 месяцев",
    specialist: "Реабилитолог",
    requirements: "Направление лечащего врача",
    managerStats: {
      assignedPatients: 22,
      completionRate: 88,
      satisfaction: 96,
      revenue: "569,600 ₽",
      successRate: 90
    },
    trends: {
      patients: "+18%",
      revenue: "+15%",
      satisfaction: "+3%"
    }
  },
  {
    id: 3,
    name: "Профилактические осмотры",
    category: "Медицинский уход",
    icon: "📋",
    status: "active",
    price: "от 1,800 ₽",
    patientsPerMonth: "156",
    utilization: 82,
    color: "#10B981",
    rating: 4.7,
    reviews: 124,
    tags: ["Профилактика", "Диагностика", "Здоровье", "Осмотр"],
    description: "Комплексные медицинские осмотры и диагностика для профилактики заболеваний",
    duration: "1-2 часа",
    specialist: "Терапевт",
    requirements: "Любой возраст",
    managerStats: {
      assignedPatients: 35,
      completionRate: 96,
      satisfaction: 93,
      revenue: "280,800 ₽",
      successRate: 95
    },
    trends: {
      patients: "+5%",
      revenue: "+7%",
      satisfaction: "+1%"
    }
  },
  {
    id: 4,
    name: "Процедурный кабинет",
    category: "Медицинский уход",
    icon: "💉",
    status: "active",
    price: "от 800 ₽",
    patientsPerMonth: "245",
    utilization: 92,
    color: "#3B82F6",
    rating: 4.6,
    reviews: 156,
    tags: ["Процедуры", "Инъекции", "Капельницы", "Лечение"],
    description: "Выполнение медицинских процедур, инъекций, капельниц и других манипуляций",
    duration: "30-60 минут",
    specialist: "Медсестра",
    requirements: "Назначение врача",
    managerStats: {
      assignedPatients: 48,
      completionRate: 98,
      satisfaction: 94,
      revenue: "196,000 ₽",
      successRate: 97
    },
    trends: {
      patients: "+22%",
      revenue: "+18%",
      satisfaction: "+4%"
    }
  },
  {
    id: 5,
    name: "Дневной стационар",
    category: "Медицинский уход",
    icon: "🛌",
    status: "development",
    price: "от 4,500 ₽",
    patientsPerMonth: "45",
    utilization: 40,
    color: "#F59E0B",
    rating: 4.8,
    reviews: 23,
    tags: ["Стационар", "Лечение", "Наблюдение", "Дневной"],
    description: "Дневное пребывание в медицинском учреждении с полным комплексом услуг и наблюдением",
    duration: "8-10 часов",
    specialist: "Дежурный врач",
    requirements: "Показания для стационарного лечения",
    managerStats: {
      assignedPatients: 12,
      completionRate: 85,
      satisfaction: 91,
      revenue: "202,500 ₽",
      successRate: 88
    },
    trends: {
      patients: "+35%",
      revenue: "+28%",
      satisfaction: "+6%"
    }
  },
  {
    id: 6,
    name: "Экстренная помощь",
    category: "Медицинский уход",
    icon: "🚑",
    status: "active",
    price: "бесплатно",
    patientsPerMonth: "78",
    utilization: 65,
    color: "#EC4899",
    rating: 4.9,
    reviews: 45,
    tags: ["Экстренно", "Срочно", "Помощь", "Кризис"],
    description: "Экстренная медицинская помощь и неотложные мероприятия при острых состояниях",
    duration: "24/7",
    specialist: "Врач скорой помощи",
    requirements: "Экстренные показания",
    managerStats: {
      assignedPatients: 18,
      completionRate: 99,
      satisfaction: 97,
      revenue: "0 ₽",
      successRate: 98
    },
    trends: {
      patients: "+8%",
      revenue: "0%",
      satisfaction: "+2%"
    }
  }
];

const managerMetrics = [
  { category: "Всего пациентов", value: "186", trend: "up", color: "#EF4444", icon: "👥", change: "+12%" },
  { category: "Активных услуг", value: "6", trend: "stable", color: "#10B981", icon: "✅", change: "+1" },
  { category: "Средний рейтинг", value: "4.8/5", trend: "up", color: "#F59E0B", icon: "⭐", change: "+0.2" },
  { category: "Выполнение плана", value: "92%", trend: "up", color: "#8B5CF6", icon: "📊", change: "+5%" },
  { category: "Доход в месяц", value: "1.95M ₽", trend: "up", color: "#84CC16", icon: "💰", change: "+15%" },
  { category: "Удовлетворенность", value: "95%", trend: "stable", color: "#06B6D4", icon: "😊", change: "+3%" }
];

const teamPerformance = [
  {
    name: "Доктор Петрова",
    role: "Старший врач",
    patients: 52,
    completion: 96,
    rating: 4.9,
    status: "active",
    specialization: "Терапевт",
    avatar: "👩‍⚕️",
    experience: "12 лет"
  },
  {
    name: "Медсестра Иванова",
    role: "Старшая медсестра",
    patients: 48,
    completion: 94,
    rating: 4.8,
    status: "active",
    specialization: "Процедурный кабинет",
    avatar: "👩‍⚕️",
    experience: "8 лет"
  },
  {
    name: "Реабилитолог Сидоров",
    role: "Врач-реабилитолог",
    patients: 35,
    completion: 90,
    rating: 4.9,
    status: "active",
    specialization: "Реабилитация",
    avatar: "👨‍⚕️",
    experience: "10 лет"
  },
  {
    name: "Доктор Козлов",
    role: "Врач скорой помощи",
    patients: 28,
    completion: 98,
    rating: 4.7,
    status: "active",
    specialization: "Экстренная помощь",
    avatar: "👨‍⚕️",
    experience: "15 лет"
  },
  {
    name: "Медсестра Новикова",
    role: "Патронажная медсестра",
    patients: 23,
    completion: 92,
    rating: 4.8,
    status: "training",
    specialization: "Уход на дому",
    avatar: "👩‍⚕️",
    experience: "3 года"
  }
];

const upcomingTasks = [
  {
    id: 1,
    title: "Медицинский аудит качества",
    deadline: "2024-01-18",
    priority: "high",
    assigned: "Доктор Петрова",
    progress: 75,
    department: "Контроль качества",
    icon: "📋"
  },
  {
    id: 2,
    title: "Обновление медицинского оборудования",
    deadline: "2024-01-25",
    priority: "high",
    assigned: "Все отделения",
    progress: 40,
    department: "Техническое оснащение",
    icon: "⚙️"
  },
  {
    id: 3,
    title: "Обучение новых медсестер",
    deadline: "2024-01-22",
    priority: "medium",
    assigned: "Медсестра Иванова",
    progress: 60,
    department: "Персонал",
    icon: "🎓"
  },
  {
    id: 4,
    title: "Разработка новых реабилитационных программ",
    deadline: "2024-02-05",
    priority: "medium",
    assigned: "Реабилитолог Сидоров",
    progress: 35,
    department: "Реабилитация",
    icon: "📈"
  }
];

const medicalIndicators = [
  { name: "Успешность лечения", value: 92, target: 90, color: "#10B981", trend: "+2%" },
  { name: "Снижение рецидивов", value: 85, target: 80, color: "#3B82F6", trend: "+5%" },
  { name: "Пациентская лояльность", value: 94, target: 85, color: "#8B5CF6", trend: "+9%" },
  { name: "Соблюдение стандартов", value: 96, target: 95, color: "#F59E0B", trend: "+1%" }
];

// Новый компонент для статистики трендов
const TrendIndicator = ({ value, positive = true }: { value: string; positive?: boolean }) => (
  <motion.span 
    className={`text-xs px-2 py-1 rounded-full ${
      positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
    }`}
    whileHover={{ scale: 1.05 }}
  >
    {value}
  </motion.span>
);

// Новый компонент для уведомлений
const NotificationBell = ({ count = 0 }: { count?: number }) => (
  <motion.div 
    className="relative cursor-pointer"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    <div className="text-2xl">🔔</div>
    {count > 0 && (
      <motion.div 
        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500 }}
      >
        {count}
      </motion.div>
    )}
  </motion.div>
);

export default function MedicalServicesManager() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('services');
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Блокировка прокрутки при открытии модального окна
  useEffect(() => {
    if (isServiceModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isServiceModalOpen]);

  const handleServiceClick = (service: any) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsServiceModalOpen(false);
    setSelectedService(null);
  };

  const totalRevenue = medicalServicesData.reduce((sum, service) => {
    const revenue = service.managerStats.revenue === '0 ₽' ? 0 : 
      parseInt(service.managerStats.revenue.replace(/\s/g, '').replace('₽', ''));
    return sum + revenue;
  }, 0);

  const formatRevenue = (revenue: number) => {
    return new Intl.NumberFormat('ru-RU').format(revenue) + ' ₽';
  };

  // Фильтрация услуг по поисковому запросу
  const filteredServices = medicalServicesData.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

        /* Smooth transitions */
        * {
          transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
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
      `}</style>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Заголовок страницы для менеджера медицинских услуг */}
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
                  🏥 Управление медицинскими услугами
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-sm sm:text-base md:text-lg mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-red-400">6 медицинских услуг</span> • <span className="text-blue-400">186 пациентов</span> • <span className="text-green-400">5 медицинских специалистов</span>
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
                    <TrendIndicator value="+15%" positive />
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>92% выполнение плана</span>
                    <TrendIndicator value="+5%" positive />
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>95% удовлетворенность пациентов</span>
                    <TrendIndicator value="+3%" positive />
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="text-right mt-4 sm:mt-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-white font-bold text-lg sm:text-xl md:text-2xl bg-gradient-to-r from-red-500 to-pink-500 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg">
                  Менеджер отдела
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Смирнова А.В.</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сегодня</div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full blur-xl" />
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
            { id: 'services', label: 'Услуги и аналитика', icon: '🏥' },
            { id: 'team', label: 'Команда', icon: '👨‍⚕️' },
            { id: 'tasks', label: 'Задачи', icon: '📋' },
            { id: 'reports', label: 'Медицинские отчеты', icon: '📊' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              className={`px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-red-500 text-white shadow-lg'
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
                } flex items-center justify-center gap-1`}>
                  {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                  {metric.change}
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
                {/* Список медицинских услуг */}
                <GlobalSpotlight
                  gridRef={gridRef}
                  disableAnimations={shouldDisableAnimations}
                  enabled={!isMobile}
                  spotlightRadius={DEFAULT_SPOTLIGHT_RADIUS}
                  glowColor={DEFAULT_GLOW_COLOR}
                />

                <BentoCardGrid gridRef={gridRef} className="mb-6 sm:mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredServices.map((service, index) => (
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
                            {service.managerStats.assignedPatients} пациентов
                          </span>
                          <div className="flex items-center gap-2">
                            <TrendIndicator value={service.trends.patients} positive />
                            <motion.div 
                              className={`w-2 h-2 rounded-full ${
                                service.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
                              }`}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </div>
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
                                <div className="text-white font-bold">{service.managerStats.successRate}%</div>
                                <div className="text-white/60">Успешность</div>
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
                              <TrendIndicator value={service.trends.revenue} positive />
                            </div>
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
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">👨‍⚕️ Медицинская команда</h2>
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
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{member.avatar}</div>
                          <div>
                            <div className="text-white font-bold text-sm">{member.name}</div>
                            <div className="text-white/60 text-xs">{member.role}</div>
                            <div className="text-blue-400 text-xs mt-1">{member.specialization}</div>
                            <div className="text-white/40 text-xs">{member.experience}</div>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          member.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          member.status === 'vacation' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        } border`}>
                          {member.status === 'active' ? 'Активен' : member.status === 'vacation' ? 'Отпуск' : 'Обучение'}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-white text-xs">
                          <span>Пациентов</span>
                          <span className="font-bold">{member.patients}</span>
                        </div>
                        <ProgressBar value={member.completion} label="Выполнение" color="#EF4444" height="4px" />
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
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">📋 Медицинские задачи</h2>
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
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="text-xl">{task.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${
                              task.priority === 'high' ? 'bg-red-400' : 'bg-yellow-400'
                            }`} />
                            <div className="text-white font-medium text-sm sm:text-base group-hover:text-red-300 transition-colors truncate">
                              {task.title}
                            </div>
                          </div>
                          <div className="text-white/60 text-xs">
                            {task.assigned} • {task.department} • До {new Date(task.deadline).toLocaleDateString('ru-RU')}
                          </div>
                          <ProgressBar value={task.progress} showLabel={false} height="4px" />
                        </div>
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
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">📊 Медицинские показатели</h3>
                  <div className="space-y-4">
                    {medicalIndicators.map((indicator, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white text-sm">{indicator.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-sm">{indicator.value}%</span>
                            <TrendIndicator value={indicator.trend} positive />
                          </div>
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
                    {medicalServicesData.map((service, index) => (
                      <motion.div 
                        key={service.id} 
                        className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleServiceClick(service)}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="text-lg">{service.icon}</div>
                          <span className="text-white text-xs sm:text-sm truncate">{service.name}</span>
                        </div>
                        <div className="text-right ml-2">
                          <div className="text-white font-bold text-xs sm:text-sm">{service.managerStats.revenue}</div>
                          <div className="text-white/60 text-xs">{service.managerStats.assignedPatients} пациентов</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Модальное окно деталей медицинской услуги */}
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
                    <TrendIndicator value={selectedService.trends.revenue} positive />
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedService.managerStats.assignedPatients}</div>
                    <div className="text-white/60 text-xs sm:text-sm">Пациентов</div>
                    <TrendIndicator value={selectedService.trends.patients} positive />
                  </div>
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Медицинская статистика</h3>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                      <div className="text-white/60 text-xs mb-1">Успешность лечения</div>
                      <div className="text-white font-semibold text-sm sm:text-base">{selectedService.managerStats.successRate}%</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                      <div className="text-white/60 text-xs mb-1">Удовлетворенность</div>
                      <div className="text-white font-semibold text-sm sm:text-base">{selectedService.managerStats.satisfaction}%</div>
                      <TrendIndicator value={selectedService.trends.satisfaction} positive />
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
                    <div className="text-white/60 text-xs mb-1">Длительность</div>
                    <div className="text-white font-semibold text-sm sm:text-base">{selectedService.duration}</div>
                  </div>
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <div className="text-white/60 text-xs mb-1 sm:mb-2">Медицинские требования</div>
                  <div className="text-white font-semibold text-sm sm:text-base">{selectedService.requirements}</div>
                </div>
                
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <RatingStars rating={selectedService.rating} size={isMobile ? "sm" : "md"} />
                    <TrendIndicator value={selectedService.trends.satisfaction} positive />
                  </div>
                  <span className="text-white/60 text-xs sm:text-sm">{selectedService.reviews} отзывов</span>
                </div>
                
                <ProgressBar value={selectedService.utilization} label="Загрузка услуги" color={selectedService.color} height="6px" />
              </div>
              
              <div className="p-4 sm:p-6 border-t border-white/10">
                <div className="flex gap-3">
                  <motion.button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
                    whileHover={{ scale: isMobile ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Управлять услугой
                  </motion.button>
                  <motion.button
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
                    whileHover={{ scale: isMobile ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Мед. статистика
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