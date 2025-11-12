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

// Компонент для карточки волонтера
const VolunteerCard = ({ volunteer, index, onVolunteerClick }: { volunteer: any; index: number; onVolunteerClick?: (volunteer: any) => void }) => {
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
      onClick={() => onVolunteerClick?.(volunteer)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {volunteer.initials}
          </motion.div>
          <div>
            <div className="text-white font-bold text-sm group-hover:text-green-300 transition-colors">
              {volunteer.name}
            </div>
            <div className="text-white/60 text-xs">{volunteer.role} • {volunteer.experience}</div>
          </div>
        </div>
        <motion.div 
          className={`px-2 py-1 rounded-full text-xs border backdrop-blur-sm ${
            volunteer.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
            volunteer.status === 'busy' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
            'bg-blue-500/20 text-blue-400 border-blue-500/30'
          }`}
          whileHover={{ scale: 1.05 }}
        >
          {volunteer.status === 'active' ? 'Активен' : volunteer.status === 'busy' ? 'Занят' : 'Неактивен'}
        </motion.div>
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-white text-xs">
          <span>Часов в неделю</span>
          <span className="font-bold">{volunteer.hoursPerWeek}ч</span>
        </div>
        <div className="flex justify-between text-white text-xs">
          <span>Выполнено заданий</span>
          <span>{volunteer.tasksCompleted}</span>
        </div>
        <ProgressBar 
          value={volunteer.reliability} 
          label="Надежность" 
          color={volunteer.color} 
          height="6px"
        />
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <RatingStars rating={volunteer.rating} size="sm" />
        <span className="text-white/60 text-xs">{volunteer.reviews} отзывов</span>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {volunteer.skills.map((skill: string, skillIndex: number) => (
          <motion.span 
            key={skillIndex}
            className="text-xs bg-white/10 px-2 py-1 rounded border border-white/20 text-white/80 group-hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {skill}
          </motion.span>
        ))}
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </motion.div>
  );
};

// Данные для категорий волонтеров
const volunteerCategories = [
  {
    id: 'all',
    title: "👥 Все волонтеры",
    description: "Полная база волонтеров • Управление назначениями • Мониторинг активности",
    value: "156",
    metric: "Всего волонтеров",
    color: "#060010",
    glowColor: COLORS.blue,
    volunteersCount: 156,
    avgRating: 4.8,
    activeHours: 2840,
    growth: "+18%",
    popularSkills: ["Социальная работа", "Психология", "Медицина", "Образование"],
    details: {
      activeVolunteers: 142,
      newThisMonth: 23,
      avgExperience: "2.3 года",
      completionRate: 94
    }
  },
  {
    id: 'schedule',
    title: "📅 График работы",
    description: "Расписание волонтеров • Назначения • Учет рабочего времени",
    value: "1,240",
    metric: "Часов в неделю",
    color: "#060010",
    glowColor: COLORS.emerald,
    volunteersCount: 142,
    avgRating: 4.7,
    activeHours: 1240,
    growth: "+12%",
    popularSkills: ["Гибкий график", "Выходные", "Утренние смены", "Вечерние смены"],
    details: {
      activeVolunteers: 142,
      newThisMonth: 15,
      avgExperience: "2.1 года",
      completionRate: 92
    }
  }
];

// Данные волонтеров
const volunteersData = [
  {
    id: 1,
    name: "Анна Петрова",
    initials: "АП",
    role: "Социальный работник",
    experience: "3 года",
    status: "active",
    hoursPerWeek: 20,
    tasksCompleted: 45,
    reliability: 95,
    color: "#3B82F6",
    rating: 4.9,
    reviews: 34,
    skills: ["Социальная работа", "Психология", "Уход за пожилыми", "Консультирование"],
    details: {
      phone: "+7 (915) 123-45-67",
      email: "anna.petrova@mail.ru",
      birthDate: "15.03.1990",
      joinDate: "12.01.2021",
      lastActivity: "2 дня назад",
      preferredTime: "Утро (9:00-13:00)",
      notes: "Отличные коммуникативные навыки, работает с пожилыми"
    },
    schedule: {
      monday: "9:00-13:00",
      tuesday: "9:00-13:00",
      wednesday: "Не работает",
      thursday: "9:00-13:00",
      friday: "9:00-13:00",
      saturday: "10:00-14:00",
      sunday: "Не работает"
    }
  },
  {
    id: 2,
    name: "Дмитрий Смирнов",
    initials: "ДС",
    role: "Медицинский волонтер",
    experience: "2 года",
    status: "busy",
    hoursPerWeek: 15,
    tasksCompleted: 32,
    reliability: 88,
    color: "#10B981",
    rating: 4.7,
    reviews: 28,
    skills: ["Первая помощь", "Медицинский уход", "Реабилитация", "Терапия"],
    details: {
      phone: "+7 (916) 234-56-78",
      email: "dmitry.smirnov@mail.ru",
      birthDate: "23.07.1985",
      joinDate: "03.05.2022",
      lastActivity: "Вчера",
      preferredTime: "День (14:00-18:00)",
      notes: "Медобразование, специализируется на реабилитации"
    },
    schedule: {
      monday: "14:00-18:00",
      tuesday: "14:00-18:00",
      wednesday: "14:00-18:00",
      thursday: "Не работает",
      friday: "14:00-18:00",
      saturday: "Не работает",
      sunday: "12:00-16:00"
    }
  },
  {
    id: 3,
    name: "Елена Козлова",
    initials: "ЕК",
    role: "Психолог-волонтер",
    experience: "4 года",
    status: "active",
    hoursPerWeek: 25,
    tasksCompleted: 67,
    reliability: 98,
    color: "#8B5CF6",
    rating: 4.9,
    reviews: 45,
    skills: ["Психология", "Кризисная помощь", "Консультирование", "Терапия"],
    details: {
      phone: "+7 (917) 345-67-89",
      email: "elena.kozlova@mail.ru",
      birthDate: "11.09.1988",
      joinDate: "15.08.2020",
      lastActivity: "Сегодня",
      preferredTime: "Вечер (18:00-22:00)",
      notes: "Профессиональный психолог, ведет онлайн-консультации"
    },
    schedule: {
      monday: "18:00-22:00",
      tuesday: "18:00-22:00",
      wednesday: "18:00-22:00",
      thursday: "18:00-22:00",
      friday: "Не работает",
      saturday: "10:00-14:00",
      sunday: "10:00-14:00"
    }
  },
  {
    id: 4,
    name: "Сергей Иванов",
    initials: "СИ",
    role: "Координатор",
    experience: "5 лет",
    status: "active",
    hoursPerWeek: 30,
    tasksCompleted: 89,
    reliability: 92,
    color: "#F59E0B",
    rating: 4.8,
    reviews: 56,
    skills: ["Управление", "Координация", "Обучение", "Менторство"],
    details: {
      phone: "+7 (918) 456-78-90",
      email: "sergey.ivanov@mail.ru",
      birthDate: "30.11.1980",
      joinDate: "22.03.2019",
      lastActivity: "3 дня назад",
      preferredTime: "Полный день",
      notes: "Опытный координатор, обучает новых волонтеров"
    },
    schedule: {
      monday: "9:00-18:00",
      tuesday: "9:00-18:00",
      wednesday: "9:00-18:00",
      thursday: "9:00-18:00",
      friday: "9:00-18:00",
      saturday: "Не работает",
      sunday: "Не работает"
    }
  },
  {
    id: 5,
    name: "Мария Сидорова",
    initials: "МС",
    role: "Волонтер по уходу",
    experience: "1 год",
    status: "active",
    hoursPerWeek: 12,
    tasksCompleted: 18,
    reliability: 85,
    color: "#EC4899",
    rating: 4.6,
    reviews: 12,
    skills: ["Уход за больными", "Гигиена", "Питание", "Компания"],
    details: {
      phone: "+7 (919) 567-89-01",
      email: "maria.sidorova@mail.ru",
      birthDate: "14.02.1995",
      joinDate: "08.11.2023",
      lastActivity: "Неделю назад",
      preferredTime: "Выходные",
      notes: "Молодой специалист, требует поддержки и обучения"
    },
    schedule: {
      monday: "Не работает",
      tuesday: "Не работает",
      wednesday: "Не работает",
      thursday: "Не работает",
      friday: "Не работает",
      saturday: "10:00-18:00",
      sunday: "10:00-18:00"
    }
  },
  {
    id: 6,
    name: "Алексей Федоров",
    initials: "АФ",
    role: "Технический волонтер",
    experience: "2 года",
    status: "inactive",
    hoursPerWeek: 8,
    tasksCompleted: 23,
    reliability: 90,
    color: "#06B6D4",
    rating: 4.7,
    reviews: 19,
    skills: ["IT поддержка", "Ремонт", "Техника", "Обучение"],
    details: {
      phone: "+7 (920) 678-90-12",
      email: "alexey.fedorov@mail.ru",
      birthDate: "05.08.1987",
      joinDate: "17.06.2022",
      lastActivity: "2 недели назад",
      preferredTime: "По договоренности",
      notes: "В отпуске до конца месяца"
    },
    schedule: {
      monday: "Не работает",
      tuesday: "Не работает",
      wednesday: "Не работает",
      thursday: "Не работает",
      friday: "Не работает",
      saturday: "Не работает",
      sunday: "Не работает"
    }
  }
];

const volunteerMetrics = [
  { category: "Всего волонтеров", value: "156", trend: "up", color: "#3B82F6", icon: "👥" },
  { category: "Активных", value: "142", trend: "stable", color: "#10B981", icon: "✅" },
  { category: "Средний рейтинг", value: "4.8/5", trend: "up", color: "#F59E0B", icon: "⭐" },
  { category: "Часов в неделю", value: "2,840", trend: "up", color: "#8B5CF6", icon: "⏱️" },
  { category: "Надежность", value: "94%", trend: "up", color: "#06B6D4", icon: "📊" },
  { category: "Новых в месяце", value: "23", trend: "up", color: "#84CC16", icon: "🆕" }
];

const popularVolunteers = [
  {
    name: "Анна Петрова",
    growth: "+15%",
    hours: "20",
    tasks: "45",
    rating: 4.9,
    role: "Социальный работник"
  },
  {
    name: "Елена Козлова",
    growth: "+22%",
    hours: "25",
    tasks: "67",
    rating: 4.9,
    role: "Психолог"
  },
  {
    name: "Сергей Иванов",
    growth: "+8%",
    hours: "30",
    tasks: "89",
    rating: 4.8,
    role: "Координатор"
  },
  {
    name: "Дмитрий Смирнов",
    growth: "+12%",
    hours: "15",
    tasks: "32",
    rating: 4.7,
    role: "Медицинский волонтер"
  }
];

const roleDistribution = [
  { name: "Социальные работники", value: 35, color: `rgba(${COLORS.blue}, 0.8)` },
  { name: "Медицинские волонтеры", value: 25, color: `rgba(${COLORS.emerald}, 0.8)` },
  { name: "Психологи", value: 15, color: `rgba(${COLORS.purple}, 0.8)` },
  { name: "Координаторы", value: 10, color: `rgba(${COLORS.amber}, 0.8)` },
  { name: "Технические", value: 8, color: `rgba(${COLORS.cyan}, 0.8)` },
  { name: "Другие", value: 7, color: `rgba(${COLORS.gray}, 0.8)` }
];

export default function VolunteersCatalog() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
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
    setSelectedCategory(categoryId);
  };

  const handleVolunteerClick = (volunteer: any) => {
    setSelectedVolunteer(volunteer);
    setIsVolunteerModalOpen(true);
  };

  const closeVolunteerModal = () => {
    setIsVolunteerModalOpen(false);
    setSelectedVolunteer(null);
  };

  const filteredVolunteers = volunteersData.filter(volunteer => {
    const matchesSearch = volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || volunteer.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const selectedCategoryData = volunteerCategories.find(cat => cat.id === selectedCategory);

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
              <Link href="/demo/social/manager" className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group">
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
              <span className="text-white text-sm">Волонтеры активны • 94% надежность</span>
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
                  🤝 Управление волонтерами
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-sm sm:text-base md:text-lg mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-emerald-400">156 активных волонтеров</span> • 6 специализаций • <span className="text-blue-400">94% надежность</span>
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>142 активных волонтера</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>2,840 часов в неделю</span>
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
                <div className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Статус управления</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сегодня</div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-lg" />
          </div>
        </motion.section>

        {/* Основные метрики волонтеров с анимациями */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {volunteerMetrics.map((metric, index) => (
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

        {/* Bento Grid с категориями волонтеров */}
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={!isMobile}
          spotlightRadius={DEFAULT_SPOTLIGHT_RADIUS}
          glowColor={DEFAULT_GLOW_COLOR}
        />

        <BentoCardGrid gridRef={gridRef} className="mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {volunteerCategories.map((category, index) => {
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
                        <div className="text-white font-bold text-sm">{category.volunteersCount}</div>
                        <div className="text-white/60 text-xs">Волонтеров</div>
                      </div>
                      <div className="text-center p-1.5 sm:p-2 bg-white/5 rounded-lg backdrop-blur-sm border border-white/5">
                        <div className="text-yellow-400 font-bold text-sm">{category.avgRating}</div>
                        <div className="text-white/60 text-xs">Рейтинг</div>
                      </div>
                    </div>

                    <ProgressBar 
                      value={category.details.completionRate} 
                      label="Выполнение заданий" 
                      color={`rgb(${category.glowColor})`}
                      showLabel={true}
                      height="6px"
                    />
                    
                    <div className="mt-auto">
                      <div className="text-white/60 text-xs mb-1 sm:mb-2">Основные навыки:</div>
                      <div className="flex flex-wrap gap-1">
                        {category.popularSkills.slice(0, isMobile ? 2 : 4).map((skill, skillIndex) => (
                          <motion.span 
                            key={skillIndex}
                            className="text-xs bg-white/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-white/20 text-white/80"
                            whileHover={{ scale: isMobile ? 1 : 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                        {isMobile && category.popularSkills.length > 2 && (
                          <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded border border-white/20 text-white/60">
                            +{category.popularSkills.length - 2}
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
                  <div className="text-white font-bold text-base sm:text-lg">{selectedCategoryData.growth}</div>
                  <div className="text-white/60 text-xs sm:text-sm">Рост за месяц</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">📈 Показатели эффективности</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <div className="flex justify-between text-white text-xs sm:text-sm mb-1 sm:mb-2">
                        <span>Активные волонтеры</span>
                        <span>{selectedCategoryData.details.activeVolunteers}</span>
                      </div>
                      <ProgressBar 
                        value={(selectedCategoryData.details.activeVolunteers / selectedCategoryData.volunteersCount) * 100} 
                        color="#10B981" 
                        height="6px" 
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-white text-xs sm:text-sm mb-1 sm:mb-2">
                        <span>Новые в этом месяце</span>
                        <span>{selectedCategoryData.details.newThisMonth}</span>
                      </div>
                      <ProgressBar 
                        value={(selectedCategoryData.details.newThisMonth / selectedCategoryData.volunteersCount) * 100} 
                        color="#3B82F6" 
                        height="6px" 
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-white text-xs sm:text-sm mb-1 sm:mb-2">
                        <span>Выполнение заданий</span>
                        <span>{selectedCategoryData.details.completionRate}%</span>
                      </div>
                      <ProgressBar value={selectedCategoryData.details.completionRate} color="#8B5CF6" height="6px" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">👥 Статистика категории</h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg">
                      <div className="text-white font-bold text-base sm:text-lg">{selectedCategoryData.details.avgExperience}</div>
                      <div className="text-white/60 text-xs">Средний стаж</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg">
                      <div className="text-white font-bold text-base sm:text-lg">{selectedCategoryData.avgRating}/5</div>
                      <div className="text-white/60 text-xs">Рейтинг</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg">
                      <div className="text-white font-bold text-base sm:text-lg">{selectedCategoryData.activeHours}</div>
                      <div className="text-white/60 text-xs">Часов в неделю</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg">
                      <div className="text-white font-bold text-xs sm:text-sm">{selectedCategoryData.volunteersCount}</div>
                      <div className="text-white/60 text-xs">Всего в категории</div>
                    </div>
                  </div>
                  
                  <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="text-green-400 text-xs sm:text-sm font-medium">
                      ✅ Показатели выше среднего по организации
                    </div>
                    <div className="text-green-400/60 text-xs mt-1">
                      +{selectedCategoryData.details.completionRate - 90}% к общей надежности
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Список волонтеров с улучшенным дизайном */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-0">
                📋 Все волонтеры {filteredVolunteers.length > 0 && `(${filteredVolunteers.length})`}
              </h2>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <input
                  type="text"
                  placeholder="Поиск по имени, роли..."
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Все статусы</option>
                  <option value="active">Активные</option>
                  <option value="busy">Занятые</option>
                  <option value="inactive">Неактивные</option>
                </select>
              </div>
            </div>
            
            {filteredVolunteers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredVolunteers.map((volunteer, index) => (
                  <VolunteerCard 
                    key={volunteer.id} 
                    volunteer={volunteer} 
                    index={index}
                    onVolunteerClick={handleVolunteerClick}
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
                <div className="text-white text-base sm:text-lg mb-1 sm:mb-2">Волонтеры не найдены</div>
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
            {/* Активные волонтеры */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span>🔥</span>
                <span>Активные волонтеры</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {popularVolunteers.map((volunteer, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
                    whileHover={{ x: isMobile ? 0 : 4 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-xs sm:text-sm group-hover:text-green-300 transition-colors truncate">
                        {volunteer.name}
                      </div>
                      <div className="text-white/60 text-xs truncate">{volunteer.hours}ч/нед • {volunteer.role}</div>
                    </div>
                    <div className="text-right ml-2">
                      <div className="text-green-400 text-xs sm:text-sm font-bold">{volunteer.growth}</div>
                      <div className="text-white/60 text-xs">{volunteer.tasks} заданий</div>
                      <RatingStars rating={volunteer.rating} size="sm" showValue={false} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Распределение по ролям */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span>📊</span>
                <span>Распределение по ролям</span>
              </h3>
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <PieChart data={roleDistribution} size={isMobile ? 100 : 140} />
              </div>
              <div className="space-y-1 sm:space-y-2">
                {roleDistribution.map((role, index) => (
                  <div key={index} className="flex items-center justify-between p-1.5 sm:p-2 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div 
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: role.color }}
                      />
                      <span className="text-white text-xs sm:text-sm truncate">{role.name}</span>
                    </div>
                    <div className="text-white font-bold text-xs sm:text-sm ml-2 flex-shrink-0">{role.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Управление и контакты */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Быстрые действия */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span>⚡</span>
                <span>Быстрые действия</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <motion.button 
                  className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 font-medium py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
                  whileHover={{ scale: isMobile ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>➕</span>
                  <span>Добавить волонтера</span>
                </motion.button>
                <motion.button 
                  className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 font-medium py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
                  whileHover={{ scale: isMobile ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>📋</span>
                  <span>Создать расписание</span>
                </motion.button>
                <motion.button 
                  className="w-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400 font-medium py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
                  whileHover={{ scale: isMobile ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>📊</span>
                  <span>Аналитика эффективности</span>
                </motion.button>
              </div>
            </div>

            {/* Статистика работы */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span>📈</span>
                <span>Статистика работы</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <motion.div 
                  className="p-2 sm:p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 hover:bg-blue-500/15 transition-colors"
                  whileHover={{ scale: isMobile ? 1 : 1.02 }}
                >
                  <div className="text-blue-400 font-bold text-xs sm:text-sm">2,840 часов</div>
                  <div className="text-blue-400/60 text-xs">Волонтерской работы в неделю</div>
                  <ProgressBar value={85} color="#3B82F6" showLabel={false} height="4px" />
                </motion.div>
                <motion.div 
                  className="p-2 sm:p-3 bg-green-500/10 rounded-lg border border-green-500/20 hover:bg-green-500/15 transition-colors"
                  whileHover={{ scale: isMobile ? 1 : 1.02 }}
                >
                  <div className="text-green-400 font-bold text-xs sm:text-sm">94% надежность</div>
                  <div className="text-green-400/60 text-xs">Выполнения заданий</div>
                  <ProgressBar value={94} color="#10B981" showLabel={false} height="4px" />
                </motion.div>
                <motion.div 
                  className="p-2 sm:p-3 bg-amber-500/10 rounded-lg border border-amber-500/20 hover:bg-amber-500/15 transition-colors"
                  whileHover={{ scale: isMobile ? 1 : 1.02 }}
                >
                  <div className="text-amber-400 font-bold text-xs sm:text-sm">23 новых</div>
                  <div className="text-amber-400/60 text-xs">Волонтера в этом месяце</div>
                  <ProgressBar value={65} color="#F59E0B" showLabel={false} height="4px" />
                </motion.div>
              </div>
            </div>

            {/* Контакты координаторов */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span>📞</span>
                <span>Координаторы волонтеров</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <motion.div 
                  className="p-2 sm:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                  whileHover={{ x: isMobile ? 0 : 4 }}
                >
                  <div className="text-white font-medium text-xs sm:text-sm group-hover:text-blue-300 transition-colors">Ольга Семенова</div>
                  <div className="text-white/60 text-xs">Руководитель волонтеров</div>
                  <div className="text-blue-400 text-xs mt-1">olga.semenova@zabota.org</div>
                </motion.div>
                <motion.div 
                  className="p-2 sm:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                  whileHover={{ x: isMobile ? 0 : 4 }}
                >
                  <div className="text-white font-medium text-xs sm:text-sm group-hover:text-green-300 transition-colors">Алексей Петров</div>
                  <div className="text-white/60 text-xs">Координатор расписания</div>
                  <div className="text-blue-400 text-xs mt-1">alexey.petrov@zabota.org</div>
                </motion.div>
                <motion.div 
                  className="p-2 sm:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                  whileHover={{ x: isMobile ? 0 : 4 }}
                >
                  <div className="text-white font-medium text-xs sm:text-sm group-hover:text-purple-300 transition-colors">Мария Иванова</div>
                  <div className="text-white/60 text-xs">Набор волонтеров</div>
                  <div className="text-blue-400 text-xs mt-1">maria.ivanova@zabota.org</div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Модальное окно деталей волонтера */}
      <AnimatePresence>
        {isVolunteerModalOpen && selectedVolunteer && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeVolunteerModal}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-black rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/20 max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                '--glow-color': selectedVolunteer.color.replace('#', ''),
                background: `radial-gradient(ellipse at center, rgba(var(--glow-color), 0.1) 0%, transparent 70%), linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`
              } as React.CSSProperties}
            >
              <div className="p-4 sm:p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <motion.div 
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {selectedVolunteer.initials}
                    </motion.div>
                    <div className="max-w-[200px] sm:max-w-none">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">{selectedVolunteer.name}</h2>
                      <p className="text-white/60 text-xs sm:text-sm truncate">{selectedVolunteer.role} • {selectedVolunteer.experience}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeVolunteerModal}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedVolunteer.hoursPerWeek}ч</div>
                    <div className="text-white/60 text-xs sm:text-sm">В неделю</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedVolunteer.tasksCompleted}</div>
                    <div className="text-white/60 text-xs sm:text-sm">Выполнено заданий</div>
                  </div>
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Контактная информация</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                      <div className="text-white/60 text-xs mb-1">Телефон</div>
                      <div className="text-white font-semibold text-sm sm:text-base">{selectedVolunteer.details.phone}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                      <div className="text-white/60 text-xs mb-1">Email</div>
                      <div className="text-white font-semibold text-sm sm:text-base">{selectedVolunteer.details.email}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                      <div className="text-white/60 text-xs mb-1">Дата присоединения</div>
                      <div className="text-white font-semibold text-sm sm:text-base">{selectedVolunteer.details.joinDate}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                      <div className="text-white/60 text-xs mb-1">Предпочтительное время</div>
                      <div className="text-white font-semibold text-sm sm:text-base">{selectedVolunteer.details.preferredTime}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">📅 График работы</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    {Object.entries(selectedVolunteer.schedule).map(([day, time]) => (
                      <div key={day} className="bg-white/5 rounded-lg p-2">
                        <div className="text-white/60 text-xs capitalize">{day === 'monday' ? 'Пн' : day === 'tuesday' ? 'Вт' : day === 'wednesday' ? 'Ср' : day === 'thursday' ? 'Чт' : day === 'friday' ? 'Пт' : day === 'saturday' ? 'Сб' : 'Вс'}</div>
                        <div className="text-white font-semibold text-xs">{time as string}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <div className="text-white/60 text-xs mb-1 sm:mb-2">Примечания</div>
                  <div className="text-white font-semibold text-sm sm:text-base">{selectedVolunteer.details.notes}</div>
                </div>
                
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <RatingStars rating={selectedVolunteer.rating} size={isMobile ? "sm" : "md"} />
                  <span className="text-white/60 text-xs sm:text-sm">{selectedVolunteer.reviews} отзывов</span>
                </div>
                
                <ProgressBar value={selectedVolunteer.reliability} label="Надежность волонтера" color={selectedVolunteer.color} height="6px" />
                
                <div className="mt-4 sm:mt-6">
                  <div className="text-white/60 text-xs sm:text-sm mb-1 sm:mb-2">Навыки и специализации</div>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {selectedVolunteer.skills.map((skill: string, index: number) => (
                      <span 
                        key={index}
                        className="text-xs bg-white/10 px-2 sm:px-3 py-1 rounded-full border border-white/20 text-white/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 border-t border-white/10">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <motion.button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
                    whileHover={{ scale: isMobile ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Редактировать
                  </motion.button>
                  <motion.button
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
                    whileHover={{ scale: isMobile ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Назначить задание
                  </motion.button>
                </div>
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
              <span>© 2024 Управление волонтерами "Забота"</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Версия 2.1.0</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
              <span>Обновлено: {new Date().toLocaleDateString('ru-RU')}</span>
              <span>•</span>
              <span>94% надежность</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}