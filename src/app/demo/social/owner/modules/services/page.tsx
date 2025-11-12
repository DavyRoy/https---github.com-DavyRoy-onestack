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

// Улучшенный ParticleCard
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
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;

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

      updateCardGlowProperties(element, e.clientX, e.clientY, 1, DEFAULT_SPOTLIGHT_RADIUS);
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

// Улучшенный GlobalSpotlight
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
          <span>Клиентов в месяц</span>
          <span>{service.clientsPerMonth}</span>
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

// Расширенные данные для категорий услуг
const serviceCategories = [
  {
    id: 'social',
    title: "🏠 Социальное сопровождение",
    description: "Поддержка и адаптация в обществе • Индивидуальный подход • Долгосрочная помощь",
    value: "28%",
    metric: "Доля услуг",
    color: "#060010",
    glowColor: COLORS.blue,
    servicesCount: 6,
    avgRating: 4.8,
    utilization: 85,
    revenue: "1,450,000 ₽",
    growth: "+15%",
    popularServices: ["Социальный патронаж", "Сопровождение семей", "Реабилитация", "Трудовая адаптация"],
    details: {
      clientSatisfaction: 94,
      completionRate: 92,
      avgDuration: "6 месяцев",
      specialists: 18
    }
  },
  {
    id: 'psychology',
    title: "🧠 Психологическая помощь",
    description: "Консультации и терапия • Кризисная поддержка • Профессиональные психологи",
    value: "22%",
    metric: "Доля услуг",
    color: "#060010",
    glowColor: COLORS.purple,
    servicesCount: 5,
    avgRating: 4.9,
    utilization: 78,
    revenue: "1,120,000 ₽",
    growth: "+22%",
    popularServices: ["Индивидуальная терапия", "Семейное консультирование", "Групповая работа", "Кризисная помощь"],
    details: {
      clientSatisfaction: 96,
      completionRate: 88,
      avgDuration: "3 месяца",
      specialists: 12
    }
  },
  {
    id: 'legal',
    title: "⚖️ Юридические услуги",
    description: "Правовая поддержка • Защита интересов • Экспертные консультации",
    value: "18%",
    metric: "Доля услуг",
    color: "#060010",
    glowColor: COLORS.emerald,
    servicesCount: 4,
    avgRating: 4.7,
    utilization: 72,
    revenue: "890,000 ₽",
    growth: "+12%",
    popularServices: ["Консультации", "Документация", "Представительство", "Правовой анализ"],
    details: {
      clientSatisfaction: 92,
      completionRate: 95,
      avgDuration: "2 недели",
      specialists: 8
    }
  },
  {
    id: 'medical',
    title: "🏥 Медицинский уход",
    description: "Патронаж и реабилитация • Профилактика • Квалифицированный медперсонал",
    value: "15%",
    metric: "Доля услуг",
    color: "#060010",
    glowColor: COLORS.rose,
    servicesCount: 3,
    avgRating: 4.8,
    utilization: 68,
    revenue: "750,000 ₽",
    growth: "+8%",
    popularServices: ["Патронажный уход", "Медосмотры", "Реабилитация", "Профилактика"],
    details: {
      clientSatisfaction: 95,
      completionRate: 90,
      avgDuration: "Постоянно",
      specialists: 15
    }
  },
  {
    id: 'education',
    title: "🎓 Образовательные программы",
    description: "Обучение и развитие • Профориентация • Современные методики",
    value: "12%",
    metric: "Доля услуг",
    color: "#060010",
    glowColor: COLORS.amber,
    servicesCount: 3,
    avgRating: 4.6,
    utilization: 65,
    revenue: "450,000 ₽",
    growth: "+18%",
    popularServices: ["Курсы", "Тренинги", "Профориентация", "Навыки будущего"],
    details: {
      clientSatisfaction: 91,
      completionRate: 85,
      avgDuration: "2 месяца",
      specialists: 10
    }
  },
  {
    id: 'emergency',
    title: "🚨 Экстренная помощь",
    description: "Кризисное вмешательство • Срочная поддержка • Круглосуточная работа",
    value: "5%",
    metric: "Доля услуг",
    color: "#060010",
    glowColor: COLORS.red,
    servicesCount: 2,
    avgRating: 4.9,
    utilization: 45,
    revenue: "0 ₽",
    growth: "+5%",
    popularServices: ["Горячая линия", "Экстренные выезды", "Кризисная помощь", "Первая поддержка"],
    details: {
      clientSatisfaction: 98,
      completionRate: 99,
      avgDuration: "24/7",
      specialists: 6
    }
  }
];

const servicesData = [
  {
    id: 1,
    name: "Социальный патронаж",
    category: "Социальное сопровождение",
    icon: "🏠",
    status: "active",
    price: "от 1,500 ₽",
    clientsPerMonth: "245",
    utilization: 85,
    color: "#3B82F6",
    rating: 4.8,
    reviews: 89,
    tags: ["Индивидуальный", "Длительный", "Поддержка", "Адаптация"],
    description: "Комплексное сопровождение и поддержка клиентов в социальной адаптации",
    duration: "6-12 месяцев",
    specialist: "Социальный работник",
    requirements: "Направление от соцслужбы"
  },
  {
    id: 2,
    name: "Психологическая консультация",
    category: "Психологическая помощь",
    icon: "🧠",
    status: "active",
    price: "от 2,000 ₽",
    clientsPerMonth: "187",
    utilization: 78,
    color: "#8B5CF6",
    rating: 4.9,
    reviews: 124,
    tags: ["Конфиденциально", "Профессионально", "Поддержка", "Терапия"],
    description: "Профессиональная психологическая помощь и консультирование",
    duration: "1-2 часа",
    specialist: "Психолог",
    requirements: "18+ лет"
  },
  {
    id: 3,
    name: "Юридическая консультация",
    category: "Юридические услуги",
    icon: "⚖️",
    status: "active",
    price: "от 1,800 ₽",
    clientsPerMonth: "156",
    utilization: 72,
    color: "#10B981",
    rating: 4.7,
    reviews: 67,
    tags: ["Экспертно", "Документы", "Защита", "Консультация"],
    description: "Квалифицированная юридическая помощь и правовое консультирование",
    duration: "1 час",
    specialist: "Юрист",
    requirements: "Любой возраст"
  },
  {
    id: 4,
    name: "Патронажный медицинский уход",
    category: "Медицинский уход",
    icon: "🏥",
    status: "active",
    price: "от 2,500 ₽",
    clientsPerMonth: "134",
    utilization: 68,
    color: "#EF4444",
    rating: 4.8,
    reviews: 92,
    tags: ["Квалифицировано", "Забота", "Реабилитация", "Уход"],
    description: "Профессиональный медицинский уход и патронаж на дому",
    duration: "Постоянно",
    specialist: "Медсестра/Сиделка",
    requirements: "Медицинские показания"
  },
  {
    id: 5,
    name: "Курсы компьютерной грамотности",
    category: "Образовательные программы",
    icon: "💻",
    status: "development",
    price: "бесплатно",
    clientsPerMonth: "89",
    utilization: 65,
    color: "#F59E0B",
    rating: 4.6,
    reviews: 45,
    tags: ["Обучение", "Современно", "Поддержка", "Развитие"],
    description: "Обучение основам компьютерной грамотности для всех возрастов",
    duration: "1 месяц",
    specialist: "Преподаватель IT",
    requirements: "Базовые навыки не требуются"
  },
  {
    id: 6,
    name: "Горячая линия поддержки",
    category: "Экстренная помощь",
    icon: "📞",
    status: "active",
    price: "бесплатно",
    clientsPerMonth: "312",
    utilization: 45,
    color: "#EC4899",
    rating: 4.9,
    reviews: 156,
    tags: ["Круглосуточно", "Конфиденциально", "Поддержка", "Экстренно"],
    description: "Круглосуточная психологическая и информационная поддержка",
    duration: "24/7",
    specialist: "Психолог-консультант",
    requirements: "Любой возраст"
  }
];

const serviceMetrics = [
  { category: "Всего услуг", value: "24", trend: "up", color: "#3B82F6", icon: "📊" },
  { category: "Активных услуг", value: "22", trend: "stable", color: "#10B981", icon: "✅" },
  { category: "Средний рейтинг", value: "4.8/5", trend: "up", color: "#F59E0B", icon: "⭐" },
  { category: "Клиентов в месяц", value: "1,245", trend: "up", color: "#8B5CF6", icon: "👥" },
  { category: "Выполнение в срок", value: "94%", trend: "up", color: "#06B6D4", icon: "⏱️" },
  { category: "Доход в месяц", value: "1.2M ₽", trend: "up", color: "#84CC16", icon: "💰" }
];

const popularServices = [
  {
    name: "Социальный патронаж",
    growth: "+15%",
    clients: "245",
    revenue: "367,500 ₽",
    rating: 4.8,
    category: "Социальное сопровождение"
  },
  {
    name: "Психологические консультации",
    growth: "+22%",
    clients: "187",
    revenue: "374,000 ₽",
    rating: 4.9,
    category: "Психологическая помощь"
  },
  {
    name: "Горячая линия",
    growth: "+8%",
    clients: "312",
    revenue: "0 ₽",
    rating: 4.9,
    category: "Экстренная помощь"
  },
  {
    name: "Юридические услуги",
    growth: "+12%",
    clients: "156",
    revenue: "280,800 ₽",
    rating: 4.7,
    category: "Юридические услуги"
  }
];

const categoryDistribution = [
  { name: "Социальное сопровождение", value: 28, color: `rgba(${COLORS.blue}, 0.8)` },
  { name: "Психологическая помощь", value: 22, color: `rgba(${COLORS.purple}, 0.8)` },
  { name: "Юридические услуги", value: 18, color: `rgba(${COLORS.emerald}, 0.8)` },
  { name: "Медицинский уход", value: 15, color: `rgba(${COLORS.rose}, 0.8)` },
  { name: "Образовательные программы", value: 12, color: `rgba(${COLORS.amber}, 0.8)` },
  { name: "Экстренная помощь", value: 5, color: `rgba(${COLORS.red}, 0.8)` }
];

export default function ServicesCatalog() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleServiceClick = (service: any) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsServiceModalOpen(false);
    setSelectedService(null);
  };

  const filteredServices = servicesData.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    const matchesCategory = !selectedCategory || service.category === serviceCategories.find(c => c.id === selectedCategory)?.title;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const selectedCategoryData = serviceCategories.find(cat => cat.id === selectedCategory);

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

      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/demo/social/owner" className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group">
                <motion.span
                  whileHover={{ x: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  ←
                </motion.span>
                <span className="text-sm sm:text-base">Назад к дашборду</span>
              </Link>
              <div className="text-white/60 text-xs sm:text-sm text-right">
                <div>{currentDate}</div>
                <div>{currentTime}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-white text-sm">Услуги активны • 94% качество</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Заголовок страницы с улучшенным дизайном */}
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
                  🛠️ Каталог услуг
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-sm sm:text-base md:text-lg mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-emerald-400">24 социальные услуги</span> • 6 категорий помощи • <span className="text-blue-400">94% выполнение в срок</span>
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>22 активные услуги</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>1,245 клиентов в месяц</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>Средний рейтинг 4.8/5</span>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="text-right mt-4 sm:mt-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-white font-bold text-lg sm:text-xl md:text-2xl bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg">
                  Активен
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Статус каталога</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сегодня</div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-lg" />
          </div>
        </motion.section>

        {/* Основные метрики услуг с анимациями */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {serviceMetrics.map((metric, index) => (
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


        {/* Bento Grid с улучшенными анимациями */}
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={!isMobile}
          spotlightRadius={DEFAULT_SPOTLIGHT_RADIUS}
          glowColor={DEFAULT_GLOW_COLOR}
        />

        <BentoCardGrid gridRef={gridRef} className="mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {serviceCategories.map((category, index) => {
              const isSelected = selectedCategory === category.id;
              const baseClassName = `card flex flex-col justify-between relative aspect-[4/3] min-h-[250px] sm:min-h-[300px] w-full max-w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow ${
                isSelected ? 'border-blue-500/50 ring-1 sm:ring-2 ring-blue-500/20' : 'border-white/10'
              }`;

              const cardStyle = {
                backgroundColor: category.color || 'var(--background-dark)',
                color: 'var(--white)',
                '--glow-x': '50%',
                '--glow-y': '50%',
                '--glow-intensity': isSelected ? '1' : '0',
                '--glow-radius': '200px',
                '--glow-color': category.glowColor
              } as React.CSSProperties;

              return (
                <ParticleCard
                  key={category.id}
                  className={baseClassName}
                  style={cardStyle}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={isMobile ? 8 : DEFAULT_PARTICLE_COUNT}
                  glowColor={category.glowColor}
                  enableTilt={!isMobile}
                  clickEffect={!isMobile}
                  enableMagnetism={!isMobile}
                  onCardClick={() => handleCategoryClick(category.id)}
                >
                  <div className="card__header flex justify-between items-start gap-2 sm:gap-3 relative text-white z-10">
                    <span 
                      className="card__label text-xs bg-white/10 px-2 sm:px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm"
                      style={{ color: `rgb(${category.glowColor})` }}
                    >
                      {category.value} {category.metric}
                    </span>
                    {isSelected && (
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-blue-500"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      />
                    )}
                  </div>
                  
                  <div className="card__content flex flex-col relative text-white z-10 flex-1">
                    <h3 className="card__title font-semibold text-lg sm:text-xl mb-2 sm:mb-3">
                      {category.title}
                    </h3>
                    <p className="card__description text-white/70 text-xs sm:text-sm leading-4 sm:leading-5 mb-3 sm:mb-4 flex-1">
                      {category.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="text-center p-1.5 sm:p-2 bg-white/5 rounded-lg backdrop-blur-sm border border-white/5">
                        <div className="text-white font-bold text-sm">{category.servicesCount}</div>
                        <div className="text-white/60 text-xs">Услуг</div>
                      </div>
                      <div className="text-center p-1.5 sm:p-2 bg-white/5 rounded-lg backdrop-blur-sm border border-white/5">
                        <div className="text-yellow-400 font-bold text-sm">{category.avgRating}</div>
                        <div className="text-white/60 text-xs">Рейтинг</div>
                      </div>
                    </div>

                    <ProgressBar 
                      value={category.utilization} 
                      label="Загрузка категории" 
                      color={`rgb(${category.glowColor})`}
                      showLabel={true}
                      height="6px"
                    />
                    
                    <div className="mt-auto">
                      <div className="text-white/60 text-xs mb-1 sm:mb-2">Популярные услуги:</div>
                      <div className="flex flex-wrap gap-1">
                        {category.popularServices.slice(0, isMobile ? 2 : 4).map((service, serviceIndex) => (
                          <motion.span 
                            key={serviceIndex}
                            className="text-xs bg-white/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-white/20 text-white/80"
                            whileHover={{ scale: isMobile ? 1 : 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            {service}
                          </motion.span>
                        ))}
                        {isMobile && category.popularServices.length > 2 && (
                          <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded border border-white/20 text-white/60">
                            +{category.popularServices.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Background gradient */}
                  <div 
                    className="absolute inset-0 opacity-20 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at center, rgba(${category.glowColor}, 0.3) 0%, transparent 70%)`
                    }}
                  />

                  {/* Selection overlay */}
                  {isSelected && (
                    <motion.div 
                      className="absolute inset-0 bg-blue-500/5 rounded-xl sm:rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </ParticleCard>
              );
            })}
          </div>
        </BentoCardGrid>

        {/* Детальная аналитика выбранной категории */}
        {selectedCategory && selectedCategoryData && (
          <motion.section
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
          >
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-0">📊 Аналитика категории: {selectedCategoryData.title}</h2>
                <div className="text-right">
                  <div className="text-white font-bold text-base sm:text-lg">{selectedCategoryData.revenue}</div>
                  <div className="text-white/60 text-xs sm:text-sm">Месячный доход</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">📈 Показатели эффективности</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <div className="flex justify-between text-white text-xs sm:text-sm mb-1 sm:mb-2">
                        <span>Удовлетворенность клиентов</span>
                        <span>{selectedCategoryData.details.clientSatisfaction}%</span>
                      </div>
                      <ProgressBar value={selectedCategoryData.details.clientSatisfaction} color="#10B981" height="6px" />
                    </div>
                    <div>
                      <div className="flex justify-between text-white text-xs sm:text-sm mb-1 sm:mb-2">
                        <span>Выполнение в срок</span>
                        <span>{selectedCategoryData.details.completionRate}%</span>
                      </div>
                      <ProgressBar value={selectedCategoryData.details.completionRate} color="#3B82F6" height="6px" />
                    </div>
                    <div>
                      <div className="flex justify-between text-white text-xs sm:text-sm mb-1 sm:mb-2">
                        <span>Загрузка специалистов</span>
                        <span>{selectedCategoryData.utilization}%</span>
                      </div>
                      <ProgressBar value={selectedCategoryData.utilization} color="#8B5CF6" height="6px" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">👥 Детали категории</h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg">
                      <div className="text-white font-bold text-base sm:text-lg">{selectedCategoryData.details.specialists}</div>
                      <div className="text-white/60 text-xs">Специалистов</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg">
                      <div className="text-white font-bold text-base sm:text-lg">{selectedCategoryData.avgRating}/5</div>
                      <div className="text-white/60 text-xs">Рейтинг</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg">
                      <div className="text-white font-bold text-base sm:text-lg">{selectedCategoryData.growth}</div>
                      <div className="text-white/60 text-xs">Рост</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg">
                      <div className="text-white font-bold text-xs sm:text-sm">{selectedCategoryData.details.avgDuration}</div>
                      <div className="text-white/60 text-xs">Средняя длительность</div>
                    </div>
                  </div>
                  
                  <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="text-green-400 text-xs sm:text-sm font-medium">
                      ✅ Показатели выше среднего по организации
                    </div>
                    <div className="text-green-400/60 text-xs mt-1">
                      +{selectedCategoryData.details.clientSatisfaction - 92}% к общей удовлетворенности
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Список услуг с улучшенным дизайном */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-0">
                📋 Все услуги {filteredServices.length > 0 && `(${filteredServices.length})`}
              </h2>
              <div className="text-white/60 text-xs sm:text-sm">
                {searchTerm && `Найдено по запросу: "${searchTerm}"`}
              </div>
            </div>
            
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredServices.map((service, index) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    index={index}
                    onServiceClick={handleServiceClick}
                  />
                ))}
              </div>
            ) : (
              <motion.div 
                className="text-center py-8 sm:py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔍</div>
                <div className="text-white text-base sm:text-lg mb-1 sm:mb-2">Услуги не найдены</div>
                <div className="text-white/60 text-sm sm:text-base">Попробуйте изменить параметры поиска или фильтры</div>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Дополнительная аналитика */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Популярные услуги */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span>🔥</span>
                <span>Популярные услуги</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {popularServices.map((service, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
                    whileHover={{ x: isMobile ? 0 : 4 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-xs sm:text-sm group-hover:text-blue-300 transition-colors truncate">
                        {service.name}
                      </div>
                      <div className="text-white/60 text-xs truncate">{service.clients} клиентов • {service.category}</div>
                    </div>
                    <div className="text-right ml-2">
                      <div className="text-green-400 text-xs sm:text-sm font-bold">{service.growth}</div>
                      <div className="text-white/60 text-xs">{service.revenue}</div>
                      <RatingStars rating={service.rating} size="sm" showValue={false} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Распределение по категориям */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span>📊</span>
                <span>Распределение услуг по категориям</span>
              </h3>
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <PieChart data={categoryDistribution} size={isMobile ? 100 : 140} />
              </div>
              <div className="space-y-1 sm:space-y-2">
                {categoryDistribution.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-1.5 sm:p-2 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div 
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-white text-xs sm:text-sm truncate">{category.name}</span>
                    </div>
                    <div className="text-white font-bold text-xs sm:text-sm ml-2 flex-shrink-0">{category.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Планы развития и контакты */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Новые услуги */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span>🆕</span>
                <span>Новые услуги</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <motion.div 
                  className="p-2 sm:p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 hover:bg-blue-500/15 transition-colors"
                  whileHover={{ scale: isMobile ? 1 : 1.02 }}
                >
                  <div className="text-blue-400 font-bold text-xs sm:text-sm">Онлайн-консультации</div>
                  <div className="text-blue-400/60 text-xs">Запуск: январь 2025</div>
                  <div className="text-blue-400/40 text-xs mt-1">Удаленная поддержка через видеосвязь</div>
                </motion.div>
                <motion.div 
                  className="p-2 sm:p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 hover:bg-purple-500/15 transition-colors"
                  whileHover={{ scale: isMobile ? 1 : 1.02 }}
                >
                  <div className="text-purple-400 font-bold text-xs sm:text-sm">Мобильное приложение</div>
                  <div className="text-purple-400/60 text-xs">Запуск: март 2025</div>
                  <div className="text-purple-400/40 text-xs mt-1">Доступ к услугам в одном клике</div>
                </motion.div>
                <motion.div 
                  className="p-2 sm:p-3 bg-green-500/10 rounded-lg border border-green-500/20 hover:bg-green-500/15 transition-colors"
                  whileHover={{ scale: isMobile ? 1 : 1.02 }}
                >
                  <div className="text-green-400 font-bold text-xs sm:text-sm">Программы для молодежи</div>
                  <div className="text-green-400/60 text-xs">Запуск: февраль 2025</div>
                  <div className="text-green-400/40 text-xs mt-1">Специализированная поддержка 14-25 лет</div>
                </motion.div>
              </div>
            </div>

            {/* Планы развития */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span>🚀</span>
                <span>Планы развития</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <motion.div 
                  className="p-2 sm:p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20 hover:bg-yellow-500/15 transition-colors"
                  whileHover={{ scale: isMobile ? 1 : 1.02 }}
                >
                  <div className="text-yellow-400 font-bold text-xs sm:text-sm">Цифровизация услуг</div>
                  <div className="text-yellow-400/60 text-xs">Автоматизация процессов • 2025</div>
                  <ProgressBar value={65} color="#F59E0B" showLabel={false} height="4px" />
                </motion.div>
                <motion.div 
                  className="p-2 sm:p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20 hover:bg-indigo-500/15 transition-colors"
                  whileHover={{ scale: isMobile ? 1 : 1.02 }}
                >
                  <div className="text-indigo-400 font-bold text-xs sm:text-sm">Расширение географии</div>
                  <div className="text-indigo-400/60 text-xs">Новые районы • 2025</div>
                  <ProgressBar value={40} color="#6366F1" showLabel={false} height="4px" />
                </motion.div>
                <motion.div 
                  className="p-2 sm:p-3 bg-pink-500/10 rounded-lg border border-pink-500/20 hover:bg-pink-500/15 transition-colors"
                  whileHover={{ scale: isMobile ? 1 : 1.02 }}
                >
                  <div className="text-pink-400 font-bold text-xs sm:text-sm">Партнерские программы</div>
                  <div className="text-pink-400/60 text-xs">Совместные услуги • 2025</div>
                  <ProgressBar value={80} color="#EC4899" showLabel={false} height="4px" />
                </motion.div>
              </div>
            </div>

            {/* Контакты отдела услуг */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span>📞</span>
                <span>Отдел услуг</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <motion.div 
                  className="p-2 sm:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                  whileHover={{ x: isMobile ? 0 : 4 }}
                >
                  <div className="text-white font-medium text-xs sm:text-sm group-hover:text-blue-300 transition-colors">Сергей Попов</div>
                  <div className="text-white/60 text-xs">Директор по услугам</div>
                  <div className="text-blue-400 text-xs mt-1">sergey.popov@zabota.org</div>
                </motion.div>
                <motion.div 
                  className="p-2 sm:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                  whileHover={{ x: isMobile ? 0 : 4 }}
                >
                  <div className="text-white font-medium text-xs sm:text-sm group-hover:text-green-300 transition-colors">Анна Ковалева</div>
                  <div className="text-white/60 text-xs">Менеджер по качеству</div>
                  <div className="text-blue-400 text-xs mt-1">anna.kovaleva@zabota.org</div>
                </motion.div>
                <motion.div 
                  className="p-2 sm:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                  whileHover={{ x: isMobile ? 0 : 4 }}
                >
                  <div className="text-white font-medium text-xs sm:text-sm group-hover:text-purple-300 transition-colors">Дмитрий Соколов</div>
                  <div className="text-white/60 text-xs">Координатор услуг</div>
                  <div className="text-blue-400 text-xs mt-1">dmitry.sokolov@zabota.org</div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
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
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedService.price}</div>
                    <div className="text-white/60 text-xs sm:text-sm">Стоимость</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedService.clientsPerMonth}</div>
                    <div className="text-white/60 text-xs sm:text-sm">Клиентов в месяц</div>
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
                  <div className="text-white/60 text-xs mb-1 sm:mb-2">Требования</div>
                  <div className="text-white font-semibold text-sm sm:text-base">{selectedService.requirements}</div>
                </div>
                
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <RatingStars rating={selectedService.rating} size={isMobile ? "sm" : "md"} />
                  <span className="text-white/60 text-xs sm:text-sm">{selectedService.reviews} отзывов</span>
                </div>
                
                <ProgressBar value={selectedService.utilization} label="Загрузка услуги" color={selectedService.color} height="6px" />
                
                <div className="mt-4 sm:mt-6">
                  <div className="text-white/60 text-xs sm:text-sm mb-1 sm:mb-2">Теги услуги</div>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {selectedService.tags.map((tag: string, index: number) => (
                      <span 
                        key={index}
                        className="text-xs bg-white/10 px-2 sm:px-3 py-1 rounded-full border border-white/20 text-white/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 border-t border-white/10">
                <motion.button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
                  whileHover={{ scale: isMobile ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Записаться на услугу
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer 
        className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-8 sm:mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 text-white/60 text-xs sm:text-sm">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
              <span>© 2024 Каталог услуг "Забота"</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Версия 2.1.0</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
              <span>Обновлено: {new Date().toLocaleDateString('ru-RU')}</span>
              <span>•</span>
              <span>94% качество услуг</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}