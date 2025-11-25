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

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

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
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
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

    const handleClick = (e: MouseEvent) => {
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
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor, onCardClick, handleMouseMove]);

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

// Улучшенный ProgressBar с анимацией
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

// Улучшенный RatingStars
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

// Новый компонент для статистики в реальном времени
const LiveStats = ({ stats }: { stats: { label: string; value: string; change: number }[] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="text-white/60 text-sm mb-1">{stat.label}</div>
          <div className="text-white font-bold text-lg mb-1">{stat.value}</div>
          <div className={`text-xs ${stat.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stat.change >= 0 ? '↗' : '↘'} {Math.abs(stat.change)}%
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Новый компонент для графика загрузки
const LoadChart = ({ data }: { data: { hour: string; load: number }[] }) => {
  const maxLoad = Math.max(...data.map(d => d.load));
  
  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
      <h3 className="text-white font-bold mb-4">Загрузка по часам</h3>
      <div className="flex items-end justify-between h-32 gap-2">
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="flex-1 flex flex-col items-center"
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            transition={{ delay: index * 0.1 }}
          >
            <div 
              className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t transition-all duration-300 hover:opacity-80"
              style={{ height: `${(item.load / maxLoad) * 100}%` }}
            />
            <div className="text-white/60 text-xs mt-2">{item.hour}</div>
            <div className="text-white text-xs font-bold">{item.load}%</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Улучшенный ServiceCard с дополнительной информацией
const ServiceCard = ({ service, index, onServiceClick }: { service: any; index: number; onServiceClick?: (service: any) => void }) => {
  return (
    <motion.div 
      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer backdrop-blur-sm relative overflow-hidden"
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

      {/* Анимированный background gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-20"
        style={{
          background: `radial-gradient(circle at center, ${service.color}20 0%, transparent 70%)`
        }}
      />
    </motion.div>
  );
};

// Данные для услуг автосервиса менеджера
const autoServiceData = [
  {
    id: 1,
    name: "Техническое обслуживание",
    category: "Плановое ТО",
    icon: "🔧",
    status: "active",
    price: "от 3,500 ₽",
    ordersPerMonth: "245",
    utilization: 85,
    color: "#3B82F6",
    rating: 4.8,
    reviews: 156,
    tags: ["ТО", "Диагностика", "Замена жидкостей", "Фильтры"],
    description: "Комплексное плановое техническое обслуживание автомобиля с заменой расходных материалов и диагностикой",
    duration: "2-4 часа",
    specialist: "Мастер ТО",
    requirements: "Пробег от 15,000 км",
    managerStats: {
      assignedMechanics: 8,
      completionRate: 94,
      satisfaction: 95,
      revenue: "857,500 ₽",
      qualityRate: 96
    },
    trends: {
      week: [65, 72, 80, 78, 85, 82, 85],
      month: '+12%'
    }
  },
  {
    id: 2,
    name: "Замена масла и фильтров",
    category: "Быстрое обслуживание",
    icon: "🛢️",
    status: "active",
    price: "от 2,200 ₽",
    ordersPerMonth: "389",
    utilization: 92,
    color: "#F59E0B",
    rating: 4.7,
    reviews: 234,
    tags: ["Масло", "Фильтры", "Быстро", "Качество"],
    description: "Экспресс-замена моторного масла и всех фильтров с использованием оригинальных материалов",
    duration: "45-60 минут",
    specialist: "Мастер экспресс-сервиса",
    requirements: "Собственное масло или покупка",
    managerStats: {
      assignedMechanics: 6,
      completionRate: 96,
      satisfaction: 94,
      revenue: "855,800 ₽",
      qualityRate: 95
    },
    trends: {
      week: [70, 75, 82, 85, 90, 88, 92],
      month: '+8%'
    }
  },
  {
    id: 3,
    name: "Шиномонтаж и балансировка",
    category: "Колесные услуги",
    icon: "🌀",
    status: "active",
    price: "от 1,500 ₽",
    ordersPerMonth: "567",
    utilization: 88,
    color: "#10B981",
    rating: 4.9,
    reviews: 189,
    tags: ["Шины", "Диски", "Балансировка", "Сезон"],
    description: "Профессиональный шиномонтаж, балансировка колес и сезонная замена резины",
    duration: "1-2 часа",
    specialist: "Шиномонтажник",
    requirements: "Комплект колес",
    managerStats: {
      assignedMechanics: 5,
      completionRate: 98,
      satisfaction: 97,
      revenue: "850,500 ₽",
      qualityRate: 98
    },
    trends: {
      week: [60, 68, 75, 82, 88, 85, 88],
      month: '+15%'
    }
  },
  {
    id: 4,
    name: "Диагностика двигателя",
    category: "Диагностика",
    icon: "📊",
    status: "active",
    price: "от 1,800 ₽",
    ordersPerMonth: "178",
    utilization: 72,
    color: "#EF4444",
    rating: 4.6,
    reviews: 89,
    tags: ["Диагностика", "Ошибки", "Сканирование", "Ремонт"],
    description: "Компьютерная диагностика двигателя и электронных систем автомобиля с расшифровкой ошибок",
    duration: "1-1.5 часа",
    specialist: "Диагност",
    requirements: "Наличие проблем с двигателем",
    managerStats: {
      assignedMechanics: 4,
      completionRate: 92,
      satisfaction: 93,
      revenue: "320,400 ₽",
      qualityRate: 94
    },
    trends: {
      week: [50, 55, 60, 65, 70, 68, 72],
      month: '+5%'
    }
  },
  {
    id: 5,
    name: "Кузовной ремонт",
    category: "Кузовные работы",
    icon: "🚗",
    status: "development",
    price: "от 8,000 ₽",
    ordersPerMonth: "67",
    utilization: 45,
    color: "#8B5CF6",
    rating: 4.8,
    reviews: 45,
    tags: ["Кузов", "Покраска", "Рихтовка", "ДТП"],
    description: "Качественный кузовной ремонт, покраска и рихтовка элементов кузова после ДТП",
    duration: "1-3 дня",
    specialist: "Маляр-кузовщик",
    requirements: "Предварительная оценка",
    managerStats: {
      assignedMechanics: 3,
      completionRate: 85,
      satisfaction: 92,
      revenue: "536,000 ₽",
      qualityRate: 90
    },
    trends: {
      week: [25, 30, 35, 40, 42, 43, 45],
      month: '+20%'
    }
  },
  {
    id: 6,
    name: "Ремонт тормозной системы",
    category: "Безопасность",
    icon: "🛑",
    status: "active",
    price: "от 4,500 ₽",
    ordersPerMonth: "134",
    utilization: 78,
    color: "#EC4899",
    rating: 4.7,
    reviews: 112,
    tags: ["Тормоза", "Колодки", "Диски", "Безопасность"],
    description: "Профессиональный ремонт и обслуживание тормозной системы с заменой колодок и дисков",
    duration: "2-3 часа",
    specialist: "Мастер по тормозам",
    requirements: "Диагностика тормозов",
    managerStats: {
      assignedMechanics: 4,
      completionRate: 95,
      satisfaction: 96,
      revenue: "603,000 ₽",
      qualityRate: 97
    },
    trends: {
      week: [60, 65, 70, 72, 75, 76, 78],
      month: '+10%'
    }
  }
];

const managerMetrics = [
  { category: "Всего заказов", value: "1,580", trend: "up", color: "#3B82F6", icon: "🔧" },
  { category: "Активных услуг", value: "6", trend: "stable", color: "#10B981", icon: "✅" },
  { category: "Средний рейтинг", value: "4.8/5", trend: "up", color: "#F59E0B", icon: "⭐" },
  { category: "Выполнение плана", value: "93%", trend: "up", color: "#8B5CF6", icon: "📊" },
  { category: "Доход в месяц", value: "4.02M ₽", trend: "up", color: "#84CC16", icon: "💰" },
  { category: "Удовлетворенность", value: "95%", trend: "stable", color: "#06B6D4", icon: "😊" }
];

const teamPerformance = [
  {
    name: "Алексей Смирнов",
    role: "Старший механик",
    orders: 156,
    completion: 98,
    rating: 4.9,
    status: "active",
    specialization: "Двигатели"
  },
  {
    name: "Дмитрий Ковалев",
    role: "Мастер ТО",
    orders: 134,
    completion: 96,
    rating: 4.8,
    status: "active",
    specialization: "Техобслуживание"
  },
  {
    name: "Сергей Петров",
    role: "Шиномонтажник",
    orders: 189,
    completion: 97,
    rating: 4.9,
    status: "active",
    specialization: "Колесные работы"
  },
  {
    name: "Иван Сидоров",
    role: "Диагност",
    orders: 89,
    completion: 94,
    rating: 4.7,
    status: "active",
    specialization: "Электроника"
  },
  {
    name: "Михаил Новиков",
    role: "Маляр-кузовщик",
    orders: 45,
    completion: 92,
    rating: 4.8,
    status: "training",
    specialization: "Кузовной ремонт"
  }
];

const upcomingTasks = [
  {
    id: 1,
    title: "Закупка расходных материалов",
    deadline: "2024-01-20",
    priority: "high",
    assigned: "Алексей Смирнов",
    progress: 70,
    department: "Склад"
  },
  {
    id: 2,
    title: "Обучение новых механиков",
    deadline: "2024-01-25",
    priority: "medium",
    assigned: "Дмитрий Ковалев",
    progress: 45,
    department: "Персонал"
  },
  {
    id: 3,
    title: "Калибровка диагностического оборудования",
    deadline: "2024-01-22",
    priority: "high",
    assigned: "Иван Сидоров",
    progress: 80,
    department: "Техника"
  },
  {
    id: 4,
    title: "Аудит качества услуг",
    deadline: "2024-01-28",
    priority: "medium",
    assigned: "Все мастера",
    progress: 35,
    department: "Контроль качества"
  }
];

const serviceIndicators = [
  { name: "Качество работ", value: 96, target: 90, color: "#10B981" },
  { name: "Соблюдение сроков", value: 94, target: 85, color: "#3B82F6" },
  { name: "Клиентская лояльность", value: 95, target: 88, color: "#8B5CF6" },
  { name: "Эффективность работы", value: 91, target: 85, color: "#F59E0B" }
];

const serviceAnalytics = [
  { name: "Техобслуживание", revenue: "857K", growth: "+12%", utilization: 85 },
  { name: "Замена масла", revenue: "856K", growth: "+8%", utilization: 92 },
  { name: "Шиномонтаж", revenue: "851K", growth: "+15%", utilization: 88 },
  { name: "Диагностика", revenue: "320K", growth: "+5%", utilization: 72 },
  { name: "Кузовной ремонт", revenue: "536K", growth: "+20%", utilization: 45 },
  { name: "Тормозная система", revenue: "603K", growth: "+10%", utilization: 78 }
];

// Новые данные для статистики в реальном времени
const liveStatsData = [
  { label: "Текущие заказы", value: "24", change: 5 },
  { label: "Свободные механики", value: "8", change: 2 },
  { label: "Среднее время ремонта", value: "2.4ч", change: -3 },
  { label: "Удовлетворенность", value: "95%", change: 1 }
];

// Данные для графика загрузки
const loadData = [
  { hour: "09:00", load: 45 },
  { hour: "10:00", load: 65 },
  { hour: "11:00", load: 80 },
  { hour: "12:00", load: 85 },
  { hour: "13:00", load: 75 },
  { hour: "14:00", load: 90 },
  { hour: "15:00", load: 85 },
  { hour: "16:00", load: 70 },
  { hour: "17:00", load: 60 },
  { hour: "18:00", load: 45 }
];

export default function AutoServiceManager() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('services');
  const [isBodyScrollLocked, setIsBodyScrollLocked] = useState(false);

  // Блокировка прокрутки при открытии модального окна
  useEffect(() => {
    if (isServiceModalOpen) {
      document.body.style.overflow = 'hidden';
      setIsBodyScrollLocked(true);
    } else {
      document.body.style.overflow = 'unset';
      setIsBodyScrollLocked(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
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

  const totalRevenue = autoServiceData.reduce((sum, service) => {
    const revenue = service.managerStats.revenue === '0 ₽' ? 0 : 
      parseInt(service.managerStats.revenue.replace(/\s/g, '').replace('₽', ''));
    return sum + revenue;
  }, 0);

  const formatRevenue = (revenue: number) => {
    return new Intl.NumberFormat('ru-RU').format(revenue) + ' ₽';
  };

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
          transform-style: preserve-3d;
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

        /* Smooth scroll for modal */
        .modal-content {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.3) transparent;
        }

        .modal-content::-webkit-scrollbar {
          width: 6px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background-color: rgba(255,255,255,0.3);
          border-radius: 3px;
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

        /* Улучшенная анимация для модальных окон */
        @keyframes modalEnter {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modal-enter {
          animation: modalEnter 0.3s ease-out;
        }
      `}</style>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Заголовок страницы для менеджера автосервиса */}
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
                  🔧 Управление автосервисом
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-sm sm:text-base md:text-lg mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-blue-400">6 услуг автосервиса</span> • <span className="text-orange-400">1,580 заказов</span> • <span className="text-green-400">12 механиков в команде</span>
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
                    <span>93% выполнение плана</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>95% удовлетворенность клиентов</span>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="text-right mt-4 sm:mt-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-white font-bold text-lg sm:text-xl md:text-2xl bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg">
                  Менеджер автосервиса
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Волков С.А.</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сегодня</div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-orange-500/10 to-yellow-500/10 rounded-full blur-lg" />
          </div>
        </motion.section>

        {/* Статистика в реальном времени */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <LiveStats stats={liveStatsData} />
        </motion.section>

        {/* Навигационные табы */}
        <motion.div
          className="flex flex-wrap gap-2 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { id: 'services', label: 'Услуги и аналитика', icon: '🔧' },
            { id: 'team', label: 'Команда механиков', icon: '👨‍🔧' },
            { id: 'tasks', label: 'Технические задачи', icon: '📋' },
            { id: 'reports', label: 'Отчеты сервиса', icon: '📊' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              className={`px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
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
                {/* График загрузки */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <LoadChart data={loadData} />
                </motion.section>

                {/* Аналитика услуг */}
                <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">📊 Аналитика услуг автосервиса</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {serviceAnalytics.map((service, index) => (
                      <motion.div
                        key={index}
                        className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
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
                        <ProgressBar value={service.utilization} label="Загрузка" color="#3B82F6" height="4px" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Список услуг автосервиса */}
                <GlobalSpotlight
                  gridRef={gridRef}
                  disableAnimations={shouldDisableAnimations}
                  enabled={!isMobile}
                  spotlightRadius={DEFAULT_SPOTLIGHT_RADIUS}
                  glowColor={DEFAULT_GLOW_COLOR}
                />

                <BentoCardGrid gridRef={gridRef} className="mb-6 sm:mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {autoServiceData.map((service, index) => (
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
                            {service.managerStats.assignedMechanics} механиков
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
                                <div className="text-white font-bold">{service.managerStats.qualityRate}%</div>
                                <div className="text-white/60">Качество</div>
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
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">👨‍🔧 Команда механиков</h2>
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
                          <div className="text-blue-400 text-xs mt-1">{member.specialization}</div>
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
                          <span>Заказов</span>
                          <span className="font-bold">{member.orders}</span>
                        </div>
                        <ProgressBar value={member.completion} label="Выполнение" color="#3B82F6" height="4px" />
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
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">📋 Технические задачи</h2>
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
                            task.priority === 'high' ? 'bg-red-400' : 'bg-yellow-400'
                          }`} />
                          <div className="text-white font-medium text-sm sm:text-base group-hover:text-blue-300 transition-colors">
                            {task.title}
                          </div>
                        </div>
                        <div className="text-white/60 text-xs">
                          {task.assigned} • {task.department} • До {new Date(task.deadline).toLocaleDateString('ru-RU')}
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
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">📊 Показатели качества</h3>
                  <div className="space-y-4">
                    {serviceIndicators.map((indicator, index) => (
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
                    {autoServiceData.map((service, index) => (
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

      {/* Модальное окно деталей услуги автосервиса */}
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
              className="bg-gradient-to-br from-gray-900 to-black rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/20 max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden modal-enter"
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
              
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh] modal-content">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedService.managerStats.revenue}</div>
                    <div className="text-white/60 text-xs sm:text-sm">Доход в месяц</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedService.managerStats.assignedMechanics}</div>
                    <div className="text-white/60 text-xs sm:text-sm">Механиков</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedService.managerStats.completionRate}%</div>
                    <div className="text-white/60 text-xs sm:text-sm">Выполнение</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedService.managerStats.satisfaction}%</div>
                    <div className="text-white/60 text-xs sm:text-sm">Удовлетворенность</div>
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
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl font-medium transition-colors duration-200"
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