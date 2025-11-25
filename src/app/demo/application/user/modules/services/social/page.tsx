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

// Улучшенные утилиты форматирования
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

// Улучшенный компонент для прогресс-бара
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

// Улучшенный компонент для рейтинга
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

// Улучшенный компонент для круговой диаграммы
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

// Данные для социальных услуг согласно концепции
const socialServiceCategories = [
  {
    id: 'financial',
    title: "💰 Материальная помощь",
    description: "Финансовая поддержка • Социальные выплаты • Адресная помощь • Субсидии",
    value: "42%",
    metric: "Доля услуг",
    color: "#060010",
    glowColor: COLORS.emerald,
    servicesCount: 6,
    avgRating: 4.8,
    utilization: 88,
    popularServices: ["Единовременные выплаты", "Регулярные пособия", "Адресная помощь", "Субсидии ЖКХ"],
    details: {
      clientSatisfaction: 92,
      completionRate: 95,
      avgDuration: "2 дня",
      specialists: 8
    }
  },
  {
    id: 'legal',
    title: "⚖️ Юридические консультации",
    description: "Правовая поддержка • Бесплатные консультации • Защита интересов",
    value: "18%",
    metric: "Доля услуг",
    color: "#060010",
    glowColor: COLORS.blue,
    servicesCount: 7,
    avgRating: 4.7,
    utilization: 75,
    popularServices: ["Консультации по ЖКХ", "Семейное право", "Социальные вопросы", "Правовой анализ"],
    details: {
      clientSatisfaction: 94,
      completionRate: 90,
      avgDuration: "1 день",
      specialists: 5
    }
  },
  {
    id: 'medical',
    title: "🩺 Медицинская помощь",
    description: "Домашний визит • Медицинские изделия • Экстренная помощь • Реабилитация",
    value: "28%",
    metric: "Доля услуг",
    color: "#060010",
    glowColor: COLORS.rose,
    servicesCount: 5,
    avgRating: 4.9,
    utilization: 82,
    popularServices: ["Патронажный уход", "Медицинские изделия", "Экстренная помощь", "Реабилитация"],
    details: {
      clientSatisfaction: 96,
      completionRate: 88,
      avgDuration: "24/7",
      specialists: 12
    }
  },
  {
    id: 'psychological',
    title: "💬 Психологическая поддержка",
    description: "Анонимно • 24/7 • Профессиональные психологи • Кризисная помощь",
    value: "12%",
    metric: "Доля услуг",
    color: "#060010",
    glowColor: COLORS.purple,
    servicesCount: 4,
    avgRating: 4.8,
    utilization: 68,
    popularServices: ["Горячая линия", "Онлайн запись", "Индивидуальные сессии", "Групповая терапия"],
    details: {
      clientSatisfaction: 95,
      completionRate: 85,
      avgDuration: "1-2 часа",
      specialists: 6
    }
  }
];

// Расширенные данные услуг для каждой категории
const socialServicesData = [
  // Материальная помощь - 6 услуг
  {
    id: 1,
    name: "Единовременные выплаты",
    category: "💰 Материальная помощь",
    icon: "💰",
    status: "active",
    price: "от 5,000 ₽",
    clientsPerMonth: "320",
    utilization: 92,
    color: "#10B981",
    rating: 4.8,
    reviews: 145,
    tags: ["Срочно", "Документы", "Поддержка", "Выплаты"],
    description: "Единовременная материальная помощь в сложной жизненной ситуации для граждан, оказавшихся в трудном финансовом положении",
    duration: "2-3 дня",
    specialist: "Специалист по соц. работе",
    requirements: "Заявление и документы, подтверждающие трудную ситуацию",
    documents: "Паспорт, справка о доходах, документы о сложной ситуации",
    benefits: "Быстрое рассмотрение, поддержка в сложный период"
  },
  {
    id: 2,
    name: "Регулярные пособия",
    category: "💰 Материальная помощь",
    icon: "📅",
    status: "active",
    price: "ежемесячно",
    clientsPerMonth: "280",
    utilization: 85,
    color: "#10B981",
    rating: 4.7,
    reviews: 89,
    tags: ["Регулярно", "Поддержка", "Стабильность", "Пособия"],
    description: "Регулярные ежемесячные выплаты для малоимущих граждан и семей",
    duration: "Ежемесячно",
    specialist: "Специалист по пособиям",
    requirements: "Низкий доход, статус малоимущей семьи",
    documents: "Паспорт, справки о доходах всех членов семьи",
    benefits: "Стабильная поддержка, социальная защита"
  },
  {
    id: 3,
    name: "Субсидии ЖКХ",
    category: "💰 Материальная помощь",
    icon: "🏠",
    status: "active",
    price: "до 50%",
    clientsPerMonth: "156",
    utilization: 90,
    color: "#10B981",
    rating: 4.6,
    reviews: 78,
    tags: ["Субсидии", "ЖКХ", "Поддержка", "Экономия"],
    description: "Субсидии на оплату жилищно-коммунальных услуг для граждан с низким доходом",
    duration: "Ежемесячно",
    specialist: "Специалист по субсидиям",
    requirements: "Низкий доход, собственность/аренда жилья",
    documents: "Паспорт, документы на жилье, квитанции ЖКХ",
    benefits: "Значительная экономия, доступное жилье"
  },
  {
    id: 4,
    name: "Адресная помощь",
    category: "💰 Материальная помощь",
    icon: "🎯",
    status: "active",
    price: "индивидуально",
    clientsPerMonth: "95",
    utilization: 78,
    color: "#10B981",
    rating: 4.9,
    reviews: 45,
    tags: ["Адресно", "Индивидуально", "Поддержка", "Помощь"],
    description: "Индивидуальная адресная помощь в конкретных жизненных ситуациях",
    duration: "По необходимости",
    specialist: "Социальный работник",
    requirements: "Конкретная нуждаемость, рекомендация соцслужбы",
    documents: "Заявление, документы подтверждающие нуждаемость",
    benefits: "Индивидуальный подход, решение конкретных проблем"
  },
  {
    id: 5,
    name: "Пособия на детей",
    category: "💰 Материальная помощь",
    icon: "👶",
    status: "active",
    price: "от 2,000 ₽",
    clientsPerMonth: "210",
    utilization: 88,
    color: "#10B981",
    rating: 4.8,
    reviews: 112,
    tags: ["Дети", "Семья", "Поддержка", "Пособия"],
    description: "Выплаты на детей из малообеспеченных семей и семей в трудной ситуации",
    duration: "Ежемесячно",
    specialist: "Специалист по детским пособиям",
    requirements: "Наличие детей, низкий доход семьи",
    documents: "Свидетельства о рождении, справки о доходах",
    benefits: "Поддержка семей, помощь в воспитании детей"
  },
  {
    id: 6,
    name: "Кризисная помощь",
    category: "💰 Материальная помощь",
    icon: "🚨",
    status: "active",
    price: "срочно",
    clientsPerMonth: "65",
    utilization: 70,
    color: "#10B981",
    rating: 4.9,
    reviews: 38,
    tags: ["Срочно", "Кризис", "Экстренно", "Помощь"],
    description: "Экстренная материальная помощь в кризисных ситуациях",
    duration: "24 часа",
    specialist: "Специалист по кризисным ситуациям",
    requirements: "Экстренная ситуация, угроза жизни/здоровью",
    documents: "Минимальный пакет, объяснение ситуации",
    benefits: "Максимально быстрое оказание помощи"
  },

  // Юридические консультации - 7 услуг
  {
    id: 7,
    name: "Консультации по ЖКХ",
    category: "⚖️ Юридические консультации",
    icon: "⚖️",
    status: "active",
    price: "бесплатно",
    clientsPerMonth: "245",
    utilization: 78,
    color: "#3B82F6",
    rating: 4.7,
    reviews: 89,
    tags: ["Бесплатно", "Профессионально", "Конфиденциально", "Помощь"],
    description: "Бесплатные юридические консультации по вопросам жилищно-коммунального хозяйства",
    duration: "1 час",
    specialist: "Юрист по жилищному праву",
    requirements: "Гражданство РФ",
    documents: "Документы по вопросу (при наличии)",
    benefits: "Профессиональная помощь, экономия на юристах"
  },
  {
    id: 8,
    name: "Семейное право",
    category: "⚖️ Юридические консультации",
    icon: "👨‍👩‍👧‍👦",
    status: "active",
    price: "бесплатно",
    clientsPerMonth: "180",
    utilization: 82,
    color: "#3B82F6",
    rating: 4.8,
    reviews: 67,
    tags: ["Семья", "Права", "Консультация", "Поддержка"],
    description: "Юридические консультации по семейным вопросам: брак, развод, алименты, наследство",
    duration: "1-1.5 часа",
    specialist: "Семейный юрист",
    requirements: "Гражданство РФ",
    documents: "Свидетельства о браке/рождении, документы по делу",
    benefits: "Защита семейных прав, профессиональные советы"
  },
  {
    id: 9,
    name: "Социальные вопросы",
    category: "⚖️ Юридические консультации",
    icon: "🏛️",
    status: "active",
    price: "бесплатно",
    clientsPerMonth: "155",
    utilization: 75,
    color: "#3B82F6",
    rating: 4.6,
    reviews: 54,
    tags: ["Соцзащита", "Права", "Консультация", "Помощь"],
    description: "Правовая помощь по вопросам социальной защиты, льгот и пособий",
    duration: "1 час",
    specialist: "Юрист по социальному праву",
    requirements: "Гражданство РФ",
    documents: "Документы на льготы, справки",
    benefits: "Защита социальных прав, получение положенных льгот"
  },
  {
    id: 10,
    name: "Трудовые споры",
    category: "⚖️ Юридические консультации",
    icon: "💼",
    status: "active",
    price: "бесплатно",
    clientsPerMonth: "120",
    utilization: 68,
    color: "#3B82F6",
    rating: 4.7,
    reviews: 42,
    tags: ["Труд", "Права", "Споры", "Защита"],
    description: "Юридическая поддержка в трудовых спорах и вопросах трудового права",
    duration: "1 час",
    specialist: "Трудовой юрист",
    requirements: "Гражданство РФ, трудовые отношения",
    documents: "Трудовая книжка, договоры, приказы",
    benefits: "Защита трудовых прав, восстановление справедливости"
  },
  {
    id: 11,
    name: "Жилищные вопросы",
    category: "⚖️ Юридические консультации",
    icon: "🏘️",
    status: "active",
    price: "бесплатно",
    clientsPerMonth: "135",
    utilization: 72,
    color: "#3B82F6",
    rating: 4.8,
    reviews: 58,
    tags: ["Жилье", "Права", "Консультация", "Защита"],
    description: "Правовая помощь по жилищным вопросам: собственность, аренда, соседские споры",
    duration: "1 час",
    specialist: "Жилищный юрист",
    requirements: "Гражданство РФ",
    documents: "Документы на жилье, договоры",
    benefits: "Защита жилищных прав, решение споров"
  },
  {
    id: 12,
    name: "Пенсионные вопросы",
    category: "⚖️ Юридические консультации",
    icon: "👵",
    status: "active",
    price: "бесплатно",
    clientsPerMonth: "95",
    utilization: 65,
    color: "#3B82F6",
    rating: 4.9,
    reviews: 36,
    tags: ["Пенсия", "Права", "Консультация", "Поддержка"],
    description: "Юридические консультации по пенсионным вопросам и социальному обеспечению",
    duration: "1 час",
    specialist: "Юрист по пенсионному праву",
    requirements: "Гражданство РФ, пенсионный возраст",
    documents: "Пенсионное удостоверение, трудовые документы",
    benefits: "Правильное оформление пенсии, защита прав"
  },
  {
    id: 13,
    name: "Правовой анализ документов",
    category: "⚖️ Юридические консультации",
    icon: "📄",
    status: "active",
    price: "бесплатно",
    clientsPerMonth: "80",
    utilization: 60,
    color: "#3B82F6",
    rating: 4.7,
    reviews: 29,
    tags: ["Документы", "Анализ", "Права", "Помощь"],
    description: "Бесплатный правовой анализ документов и договоров",
    duration: "30-60 минут",
    specialist: "Юрист-аналитик",
    requirements: "Гражданство РФ",
    documents: "Анализируемые документы",
    benefits: "Предотвращение проблем, понимание документов"
  },

  // Медицинская помощь - 5 услуг
  {
    id: 14,
    name: "Патронажный уход",
    category: "🩺 Медицинская помощь",
    icon: "🩺",
    status: "active",
    price: "бесплатно",
    clientsPerMonth: "187",
    utilization: 85,
    color: "#EF4444",
    rating: 4.9,
    reviews: 134,
    tags: ["Квалифицировано", "На дому", "Уход", "Поддержка"],
    description: "Патронажный медицинский уход на дому для маломобильных граждан и пожилых людей",
    duration: "Постоянно",
    specialist: "Медсестра/Соцработник",
    requirements: "Медицинские показания, маломобильность",
    documents: "Медицинские справки, направление врача",
    benefits: "Профессиональный уход, комфортные условия"
  },
  {
    id: 15,
    name: "Медицинские изделия",
    category: "🩺 Медицинская помощь",
    icon: "🦽",
    status: "active",
    price: "бесплатно",
    clientsPerMonth: "125",
    utilization: 78,
    color: "#EF4444",
    rating: 4.8,
    reviews: 89,
    tags: ["Оборудование", "Поддержка", "Реабилитация", "Помощь"],
    description: "Предоставление медицинских изделий и оборудования для реабилитации",
    duration: "По необходимости",
    specialist: "Специалист по медтехнике",
    requirements: "Медицинские показания, рекомендация врача",
    documents: "Рецепт врача, медицинские документы",
    benefits: "Доступ к необходимому оборудованию, улучшение качества жизни"
  },
  {
    id: 16,
    name: "Экстренная помощь",
    category: "🩺 Медицинская помощь",
    icon: "🚑",
    status: "active",
    price: "бесплатно",
    clientsPerMonth: "95",
    utilization: 70,
    color: "#EF4444",
    rating: 4.9,
    reviews: 67,
    tags: ["Срочно", "Экстренно", "Помощь", "Поддержка"],
    description: "Экстренная медицинская помощь и вызов специалиста на дом",
    duration: "24/7",
    specialist: "Врач скорой помощи",
    requirements: "Экстренная медицинская ситуация",
    documents: "Паспорт, полис ОМС",
    benefits: "Быстрая помощь, спасение жизни"
  },
  {
    id: 17,
    name: "Реабилитация",
    category: "🩺 Медицинская помощь",
    icon: "♿",
    status: "active",
    price: "бесплатно",
    clientsPerMonth: "110",
    utilization: 75,
    color: "#EF4444",
    rating: 4.7,
    reviews: 78,
    tags: ["Восстановление", "Реабилитация", "Здоровье", "Поддержка"],
    description: "Программы медицинской реабилитации после заболеваний и операций",
    duration: "Курс 2-4 недели",
    specialist: "Врач-реабилитолог",
    requirements: "Направление врача, медицинские показания",
    documents: "Медицинская карта, направление",
    benefits: "Восстановление здоровья, возвращение к нормальной жизни"
  },
  {
    id: 18,
    name: "Социальный работник",
    category: "🩺 Медицинская помощь",
    icon: "👥",
    status: "active",
    price: "бесплатно",
    clientsPerMonth: "289",
    utilization: 79,
    color: "#EF4444",
    rating: 4.9,
    reviews: 198,
    tags: ["Помощь", "Уход", "Поддержка", "Соцработник"],
    description: "Социальное сопровождение и помощь в бытовых вопросах для пожилых и инвалидов",
    duration: "Регулярно",
    specialist: "Социальный работник",
    requirements: "Пожилой возраст/инвалидность",
    documents: "Паспорт, документы об инвалидности/возрасте",
    benefits: "Ежедневная поддержка, решение бытовых вопросов"
  },

  // Психологическая поддержка - 4 услуги
  {
    id: 19,
    name: "Горячая линия",
    category: "💬 Психологическая поддержка",
    icon: "📞",
    status: "active",
    price: "бесплатно",
    clientsPerMonth: "412",
    utilization: 65,
    color: "#8B5CF6",
    rating: 4.8,
    reviews: 267,
    tags: ["Анонимно", "24/7", "Кризис", "Поддержка"],
    description: "Круглосуточная психологическая поддержка по телефону в сложных жизненных ситуациях",
    duration: "24/7",
    specialist: "Психолог-консультант",
    requirements: "Любой возраст",
    documents: "Не требуются",
    benefits: "Анонимность, доступность, профессиональная помощь"
  },
  {
    id: 20,
    name: "Индивидуальные консультации",
    category: "💬 Психологическая поддержка",
    icon: "🧠",
    status: "active",
    price: "бесплатно",
    clientsPerMonth: "185",
    utilization: 72,
    color: "#8B5CF6",
    rating: 4.9,
    reviews: 134,
    tags: ["Индивидуально", "Профессионально", "Поддержка", "Терапия"],
    description: "Индивидуальные психологические консультации и терапия с профессиональными психологами",
    duration: "1-2 часа",
    specialist: "Клинический психолог",
    requirements: "18+ лет",
    documents: "Паспорт",
    benefits: "Индивидуальный подход, глубокая проработка проблем"
  },
  {
    id: 21,
    name: "Групповая терапия",
    category: "💬 Психологическая поддержка",
    icon: "👥",
    status: "active",
    price: "бесплатно",
    clientsPerMonth: "95",
    utilization: 60,
    color: "#8B5CF6",
    rating: 4.7,
    reviews: 67,
    tags: ["Группа", "Поддержка", "Терапия", "Сообщество"],
    description: "Групповые психологические занятия и терапия для взаимной поддержки",
    duration: "2 часа",
    specialist: "Групповой терапевт",
    requirements: "18+ лет, готовность к групповой работе",
    documents: "Паспорт",
    benefits: "Поддержка сообщества, обмен опытом"
  },
  {
    id: 22,
    name: "Кризисная помощь",
    category: "💬 Психологическая поддержка",
    icon: "🆘",
    status: "active",
    price: "бесплатно",
    clientsPerMonth: "75",
    utilization: 55,
    color: "#8B5CF6",
    rating: 4.9,
    reviews: 45,
    tags: ["Кризис", "Срочно", "Помощь", "Поддержка"],
    description: "Срочная психологическая помощь в кризисных и экстренных ситуациях",
    duration: "По необходимости",
    specialist: "Кризисный психолог",
    requirements: "Кризисная ситуация",
    documents: "Не требуются",
    benefits: "Немедленная помощь, предотвращение тяжелых последствий"
  }
];

const socialServiceMetrics = [
  { category: "Всего услуг", value: "22", trend: "up", color: "#3B82F6", icon: "📊" },
  { category: "Подкатегории", value: "4", trend: "stable", color: "#10B981", icon: "📁" },
  { category: "Средний рейтинг", value: "4.7/5", trend: "up", color: "#F59E0B", icon: "⭐" },
  { category: "Время рассмотрения", value: "2 дня", trend: "stable", color: "#8B5CF6", icon: "⏱️" },
  { category: "Получателей услуг", value: "12,400", trend: "up", color: "#06B6D4", icon: "👥" },
  { category: "Выполнение в срок", value: "94%", trend: "up", color: "#84CC16", icon: "✅" }
];

const popularSocialServices = [
  {
    name: "Материальная помощь",
    growth: "+15%",
    clients: "42%",
    rating: 4.8,
    category: "Основная услуга"
  },
  {
    name: "Социальный работник",
    growth: "+8%",
    clients: "28%",
    rating: 4.9,
    category: "Популярная услуга"
  },
  {
    name: "Медицинская помощь",
    growth: "+12%",
    clients: "18%",
    rating: 4.9,
    category: "Востребованная"
  },
  {
    name: "Юридические консультации",
    growth: "+5%",
    clients: "12%",
    rating: 4.7,
    category: "Стабильный спрос"
  }
];

const categoryDistribution = [
  { name: "Материальная помощь", value: 42, color: `rgba(${COLORS.emerald}, 0.8)` },
  { name: "Социальный работник", value: 28, color: `rgba(${COLORS.rose}, 0.8)` },
  { name: "Медицинская помощь", value: 18, color: `rgba(${COLORS.blue}, 0.8)` },
  { name: "Психологическая поддержка", value: 12, color: `rgba(${COLORS.purple}, 0.8)` }
];

// FAQ данные
const faqData = [
  {
    question: "Как подать заявку на материальную помощь?",
    answer: "Заявку можно подать онлайн через наш портал, при личном визите в отделение социальной защиты или через социального работника. Необходимо предоставить документы, подтверждающие трудную жизненную ситуацию."
  },
  {
    question: "Какие документы нужны для получения услуг?",
    answer: "Основной пакет документов включает паспорт, документы о доходах, справку о составе семьи. Конкретный перечень зависит от вида услуги и будет указан при оформлении заявки."
  },
  {
    question: "Как вызвать социального работника?",
    answer: "Социального работника можно вызвать по телефону горячей линии, через онлайн-заявку на портале или обратившись в отделение социальной защиты по месту жительства."
  },
  {
    question: "Можно ли подать заявку онлайн?",
    answer: "Да, все услуги доступны для онлайн-оформления через наш портал. Для этого необходимо иметь подтвержденную учетную запись на Госуслугах."
  }
];

// Новый компонент для улучшенного поиска и фильтров
const SearchAndFilters: React.FC<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedCategoryData: any;
}> = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus, selectedCategory, setSelectedCategory, selectedCategoryData }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      {/* Поиск */}
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск услуг..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40">
            🔍
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
        >
          <option value="all">Все статусы</option>
          <option value="active">Активные</option>
          <option value="development">В разработке</option>
          <option value="paused">Приостановлены</option>
        </select>

        {selectedCategory && (
          <motion.button
            onClick={() => setSelectedCategory(null)}
            className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-3 rounded-xl border border-white/20 transition-colors flex items-center gap-2 whitespace-nowrap"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>←</span>
            <span>Все категории</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default function SocialServicesPage() {
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isBodyScrollLocked, setIsBodyScrollLocked] = useState(false);

  // Блокировка прокрутки при открытии модального окна
  useEffect(() => {
    if (isServiceModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px'; // Компенсация для скроллбара
      setIsBodyScrollLocked(true);
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
      setIsBodyScrollLocked(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
      setIsBodyScrollLocked(false);
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

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Исправленная функция фильтрации
  const filteredServices = socialServicesData.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    
    // Исправленная логика фильтрации по категории
    let matchesCategory = true;
    if (selectedCategory) {
      const categoryData = socialServiceCategories.find(c => c.id === selectedCategory);
      if (categoryData) {
        // Сопоставляем категории по названию
        matchesCategory = service.category === categoryData.title;
      }
    }
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const selectedCategoryData = socialServiceCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary} ${isBodyScrollLocked ? 'overflow-hidden' : ''}`}>
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

        /* Плавная прокрутка */
        html {
          scroll-behavior: smooth;
        }

        /* Кастомный скроллбар */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>

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
                  🛠️ Социальные услуги
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-sm sm:text-base md:text-lg mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-emerald-400">Материальная помощь</span>, <span className="text-blue-400">юридическая</span>, <span className="text-rose-400">медицинская</span> и <span className="text-purple-400">психологическая поддержка</span>
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>22 доступные услуги</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>4 основные категории</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>Средняя оценка ⭐ 4.7</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Время рассмотрения: 2 дня</span>
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
                <div className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Статус услуг</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сегодня</div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-lg" />
          </div>
        </motion.section>

        {/* Общий обзор категории (Hero-блок) */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-lg p-4 sm:p-6 md:p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <motion.h2 
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  🟦 Социальные услуги
                </motion.h2>
                <motion.p 
                  className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Ваша государственная поддержка. Доступно <span className="text-emerald-400 font-semibold">22 услуги</span> в <span className="text-blue-400 font-semibold">4 категориях</span>: материальная помощь, юридические консультации, медицинская помощь и психологическая поддержка.
                </motion.p>
                <motion.div 
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                    <div className="text-white font-bold text-lg sm:text-xl">22</div>
                    <div className="text-white/60 text-xs sm:text-sm">Доступных услуг</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                    <div className="text-white font-bold text-lg sm:text-xl">4</div>
                    <div className="text-white/60 text-xs sm:text-sm">Подкатегории</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                    <div className="text-yellow-400 font-bold text-lg sm:text-xl">4.7</div>
                    <div className="text-white/60 text-xs sm:text-sm">Средняя оценка</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                    <div className="text-white font-bold text-sm sm:text-base">2 дня</div>
                    <div className="text-white/60 text-xs sm:text-sm">Время рассмотрения</div>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl mb-3 sm:mb-4">
                  ⭐
                </div>
                <div className="text-white font-bold text-lg sm:text-xl">12,400+</div>
                <div className="text-white/60 text-sm sm:text-base">Получателей услуг</div>
              </motion.div>
            </div>
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
            {socialServiceMetrics.map((metric, index) => (
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

        {/* 4 основные категории (карточки) */}
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={!isMobile}
          spotlightRadius={DEFAULT_SPOTLIGHT_RADIUS}
          glowColor={DEFAULT_GLOW_COLOR}
        />

        <BentoCardGrid gridRef={gridRef} className="mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {socialServiceCategories.map((category, index) => {
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

        {/* Список всех услуг (Bento-грид) */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-0">
                📋 {selectedCategory ? `Услуги: ${selectedCategoryData?.title}` : 'Все социальные услуги'} 
                {filteredServices.length > 0 && ` (${filteredServices.length})`}
              </h2>
              
              <div className="flex items-center gap-2 sm:gap-3">
                {selectedCategory && (
                  <motion.button
                    onClick={() => setSelectedCategory(null)}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg border border-white/20 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>←</span>
                    <span>Все категории</span>
                  </motion.button>
                )}
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Поиск услуг..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>
            </div>
            
            {/* Информация о выбранной категории */}
            {selectedCategory && selectedCategoryData && (
              <motion.div 
                className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-white font-semibold text-sm sm:text-base">
                      {selectedCategoryData.title}
                    </h3>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">
                      {selectedCategoryData.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="text-center">
                      <div className="text-white font-bold">{selectedCategoryData.servicesCount}</div>
                      <div className="text-white/60">услуг</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold">{selectedCategoryData.avgRating}</div>
                      <div className="text-white/60">рейтинг</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 font-bold">{selectedCategoryData.utilization}%</div>
                      <div className="text-white/60">загрузка</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
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
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">
                  {searchTerm ? '🔍' : selectedCategory ? '📂' : '😔'}
                </div>
                <div className="text-white text-base sm:text-lg mb-1 sm:mb-2">
                  {searchTerm 
                    ? 'Услуги по вашему запросу не найдены' 
                    : selectedCategory 
                      ? `В категории "${selectedCategoryData?.title}" пока нет услуг` 
                      : 'Услуги не найдены'
                  }
                </div>
                <div className="text-white/60 text-sm sm:text-base">
                  {searchTerm 
                    ? 'Попробуйте изменить поисковый запрос' 
                    : selectedCategory 
                      ? 'Обратитесь к администратору для добавления услуг' 
                      : 'Попробуйте изменить параметры поиска'
                  }
                </div>
                
                {(searchTerm || selectedCategory) && (
                  <motion.button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory(null);
                    }}
                    className="mt-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm px-4 py-2 rounded-lg border border-blue-500/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Показать все услуги
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Аналитика */}
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
                <span>Топ услуги по популярности</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {popularSocialServices.map((service, index) => (
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

        {/* FAQ блок */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
              <span>❓</span>
              <span>Часто задаваемые вопросы</span>
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {faqData.map((faq, index) => (
                <motion.div 
                  key={index}
                  className="bg-white/5 rounded-lg border border-white/10 overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-3 sm:p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white font-medium text-sm sm:text-base pr-4">{faq.question}</span>
                    <motion.span
                      animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-white/60 flex-shrink-0"
                    >
                      ▼
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openFaqIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 sm:p-4 pt-0 text-white/70 text-sm sm:text-base leading-relaxed border-t border-white/10">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      {/* Кнопка быстрого действия */}
      <motion.div 
        className="fixed bottom-6 right-6 z-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.button
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="text-lg">↑</span>
        </motion.button>
      </motion.div>

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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                    <div className="text-white/60 text-xs mb-1">Требования</div>
                    <div className="text-white font-semibold text-sm sm:text-base">{selectedService.requirements}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                    <div className="text-white/60 text-xs mb-1">Необходимые документы</div>
                    <div className="text-white font-semibold text-sm sm:text-base">{selectedService.documents}</div>
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <div className="text-white/60 text-xs mb-1 sm:mb-2">Преимущества</div>
                  <div className="text-white font-semibold text-sm sm:text-base">{selectedService.benefits}</div>
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
                  Оформить заявку
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
              <span>© 2024 Социальные услуги "Забота"</span>
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