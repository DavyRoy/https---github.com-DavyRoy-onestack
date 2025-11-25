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

// Улучшенный ParticleCard с оптимизацией для мобильных
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
  priority?: 'high' | 'medium' | 'low';
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
  onCardClick,
  priority = 'medium'
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
      className={`${className} relative overflow-hidden cursor-pointer card--border-glow`}
      style={{ 
        ...style, 
        position: 'relative', 
        overflow: 'hidden',
        transformStyle: 'preserve-3d'
      }}
      whileHover={{ y: priority === 'high' ? -6 : priority === 'medium' ? -4 : -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.98 }}
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
  columns?: 1 | 2 | 3 | 4 | 6;
}> = ({ children, gridRef, className = '', columns = 3 }) => {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
  }[columns];

  return (
    <motion.div
      className={`bento-section grid gap-4 sm:gap-6 p-4 sm:p-6 max-w-7xl select-none relative ${gridClass} ${className}`}
      ref={gridRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
};

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
      <div className="w-full bg-white/10 rounded-full overflow-hidden" style={{ height }}>
        <motion.div 
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}40`
          }}
          initial={animated ? { width: 0 } : false}
          animate={animated ? { width: `${percentage}%` } : false}
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

// Данные для врачей
const doctorsData = [
  {
    id: 1,
    name: "Др. Анна Смирнова",
    specialization: "Кардиолог",
    department: "Кардиология",
    status: "active",
    experience: 12,
    rating: 4.9,
    patientsThisMonth: 145,
    totalPatients: 2850,
    education: "МГМУ им. Сеченова",
    qualifications: ["Высшая категория", "Кандидат медицинских наук", "Сертификат ЭхоКГ"],
    procedures: ["ЭКГ", "ЭхоКГ", "Холтер", "Стресс-тест", "Коронарография"],
    availability: "Пн-Пт 9:00-18:00",
    contact: "anna.smirnova@clinic.ru",
    performance: 96,
    color: "#EF4444",
    avatar: "👩‍⚕️",
    price: "3,500 ₽",
    nextAvailable: "2024-01-20 14:30",
    skills: ["Диагностика", "Реабилитация", "Экстренная помощь"],
    languages: ["Русский", "Английский"],
    achievements: ["Лучший врач года 2023", "200+ успешных операций"]
  },
  {
    id: 2,
    name: "Др. Дмитрий Козлов",
    specialization: "Невролог",
    department: "Неврология",
    status: "active",
    experience: 8,
    rating: 4.8,
    patientsThisMonth: 128,
    totalPatients: 1950,
    education: "РНИМУ им. Пирогова",
    qualifications: ["Первая категория", "Сертификат по ЭЭГ", "Сертификат по УЗДГ"],
    procedures: ["ЭЭГ", "УЗДГ", "Блокады", "Рефлексотерапия", "Электронейромиография"],
    availability: "Вт-Сб 10:00-19:00",
    contact: "dmitry.kozlov@clinic.ru",
    performance: 92,
    color: "#3B82F6",
    avatar: "👨‍⚕️",
    price: "2,800 ₽",
    nextAvailable: "2024-01-19 11:15",
    skills: ["Диагностика", "Реабилитация", "Болевой синдром"],
    languages: ["Русский", "Английский", "Немецкий"],
    achievements: ["Эксперт в области головных болей"]
  },
  {
    id: 3,
    name: "Др. Мария Петрова",
    specialization: "Педиатр",
    department: "Педиатрия",
    status: "active",
    experience: 15,
    rating: 5.0,
    patientsThisMonth: 189,
    totalPatients: 4200,
    education: "СПбГПМУ",
    qualifications: ["Высшая категория", "Доктор медицинских наук", "Неонатолог"],
    procedures: ["Вакцинация", "Диагностика", "Профилактика", "Лечение", "Наблюдение"],
    availability: "Пн-Пт 8:00-17:00",
    contact: "maria.petrova@clinic.ru",
    performance: 98,
    color: "#10B981",
    avatar: "👩‍⚕️",
    price: "2,200 ₽",
    nextAvailable: "2024-01-20 09:00",
    skills: ["Педиатрия", "Неонатология", "Вакцинопрофилактика"],
    languages: ["Русский", "Французский"],
    achievements: ["Автор 15 научных работ", "Основатель школы молодых родителей"]
  },
  {
    id: 4,
    name: "Др. Сергей Иванов",
    specialization: "Хирург",
    department: "Хирургия",
    status: "surgery",
    experience: 20,
    rating: 4.9,
    patientsThisMonth: 45,
    totalPatients: 3200,
    education: "ММА им. Сеченова",
    qualifications: ["Высшая категория", "Профессор", "Член-корр. РАН"],
    procedures: ["Лапароскопия", "Эндоскопия", "Операции", "Консультации", "Удаление"],
    availability: "Пн-Ср-Пт 8:00-16:00",
    contact: "sergey.ivanov@clinic.ru",
    performance: 95,
    color: "#8B5CF6",
    avatar: "👨‍⚕️",
    price: "8,500 ₽",
    nextAvailable: "2024-01-22 10:00",
    skills: ["Хирургия", "Эндоскопия", "Лапароскопия"],
    languages: ["Русский", "Английский"],
    achievements: ["Провел 1000+ успешных операций", "Разработчик новых методик"]
  },
  {
    id: 5,
    name: "Др. Екатерина Новикова",
    specialization: "Гинеколог",
    department: "Гинекология",
    status: "active",
    experience: 10,
    rating: 4.8,
    patientsThisMonth: 167,
    totalPatients: 2450,
    education: "МГМУ им. Сеченова",
    qualifications: ["Первая категория", "УЗИ-специалист", "Репродуктолог"],
    procedures: ["УЗИ", "Кольпоскопия", "Гормонотерапия", "Ведение беременности", "Контрацепция"],
    availability: "Пн-Пт 9:00-18:00",
    contact: "ekaterina.novikova@clinic.ru",
    performance: 94,
    color: "#EC4899",
    avatar: "👩‍⚕️",
    price: "3,200 ₽",
    nextAvailable: "2024-01-19 15:45",
    skills: ["Гинекология", "УЗИ-диагностика", "Репродуктивное здоровье"],
    languages: ["Русский", "Английский"],
    achievements: ["Сертифицированный специалист по ЭКО"]
  },
  {
    id: 6,
    name: "Др. Алексей Волков",
    specialization: "Ортопед",
    department: "Ортопедия",
    status: "vacation",
    experience: 7,
    rating: 4.7,
    patientsThisMonth: 89,
    totalPatients: 1200,
    education: "РУДН",
    qualifications: ["Вторая категория", "Сертификат по артроскопии", "Травматолог"],
    procedures: ["Рентген", "Артроскопия", "Блокады", "Реабилитация", "Протезирование"],
    availability: "Вт-Чт-Сб 9:00-17:00",
    contact: "aleksey.volkov@clinic.ru",
    performance: 88,
    color: "#F59E0B",
    avatar: "👨‍⚕️",
    price: "3,800 ₽",
    nextAvailable: "2024-01-25 14:00",
    skills: ["Ортопедия", "Травматология", "Реабилитация"],
    languages: ["Русский", "Испанский"],
    achievements: ["Внедрение малоинвазивных методик"]
  }
];

const doctorMetrics = [
  { category: "Всего врачей", value: "24", trend: "up", color: "#3B82F6", icon: "👨‍⚕️", change: "+2" },
  { category: "Активных сейчас", value: "18", trend: "stable", color: "#10B981", icon: "✅", change: "0" },
  { category: "Пациентов в этом месяце", value: "2,845", trend: "up", color: "#EF4444", icon: "👥", change: "+127" },
  { category: "Средний рейтинг", value: "4.8/5", trend: "up", color: "#F59E0B", icon: "⭐", change: "+0.1" },
  { category: "Заполненность расписания", value: "87%", trend: "up", color: "#8B5CF6", icon: "📅", change: "+3%" },
  { category: "Доход в месяц", value: "4.2M ₽", trend: "up", color: "#EC4899", icon: "💰", change: "+12%" }
];

const upcomingAppointments = [
  {
    id: 1,
    patient: "Иванова М.П.",
    doctor: "Др. Анна Смирнова",
    specialization: "Кардиология",
    date: "2024-01-20 14:30",
    type: "Консультация",
    status: "confirmed",
    duration: "45 минут",
    priority: "high"
  },
  {
    id: 2,
    patient: "Петров С.И.",
    doctor: "Др. Дмитрий Козлов",
    specialization: "Неврология",
    date: "2024-01-20 15:15",
    type: "Диагностика",
    status: "confirmed",
    duration: "1 час",
    priority: "medium"
  },
  {
    id: 3,
    patient: "Сидорова А.К.",
    doctor: "Др. Мария Петрова",
    specialization: "Педиатрия",
    date: "2024-01-20 16:00",
    type: "Вакцинация",
    status: "pending",
    duration: "30 минут",
    priority: "low"
  },
  {
    id: 4,
    patient: "Козлов Д.В.",
    doctor: "Др. Сергей Иванов",
    specialization: "Хирургия",
    date: "2024-01-21 10:00",
    type: "Послеоперационный осмотр",
    status: "confirmed",
    duration: "20 минут",
    priority: "medium"
  },
  {
    id: 5,
    patient: "Новикова Е.С.",
    doctor: "Др. Екатерина Новикова",
    specialization: "Гинекология",
    date: "2024-01-21 11:30",
    type: "Профилактический осмотр",
    status: "confirmed",
    duration: "40 минут",
    priority: "medium"
  }
];

const departmentStats = [
  { name: "Кардиология", doctors: 4, patients: 845, revenue: "1.2M ₽", color: "#EF4444", growth: "+15%" },
  { name: "Неврология", doctors: 3, patients: 623, revenue: "856K ₽", color: "#3B82F6", growth: "+8%" },
  { name: "Педиатрия", doctors: 5, patients: 987, revenue: "745K ₽", color: "#10B981", growth: "+12%" },
  { name: "Хирургия", doctors: 6, patients: 345, revenue: "2.1M ₽", color: "#8B5CF6", growth: "+5%" },
  { name: "Гинекология", doctors: 3, patients: 567, revenue: "682K ₽", color: "#EC4899", growth: "+18%" },
  { name: "Ортопедия", doctors: 3, patients: 278, revenue: "512K ₽", color: "#F59E0B", growth: "+7%" }
];

const medicalProcedures = [
  { name: "Консультация", count: 1245, revenue: "3.1M ₽", growth: "+12%", color: "#3B82F6" },
  { name: "Диагностика", count: 867, revenue: "2.8M ₽", growth: "+8%", color: "#10B981" },
  { name: "Анализы", count: 1567, revenue: "1.9M ₽", growth: "+15%", color: "#F59E0B" },
  { name: "Процедуры", count: 634, revenue: "4.2M ₽", growth: "+22%", color: "#EF4444" },
  { name: "Операции", count: 89, revenue: "6.8M ₽", growth: "+5%", color: "#8B5CF6" }
];

const weeklyStats = [
  { day: "Пн", patients: 245, revenue: "450K ₽" },
  { day: "Вт", patients: 289, revenue: "520K ₽" },
  { day: "Ср", patients: 312, revenue: "580K ₽" },
  { day: "Чт", patients: 278, revenue: "510K ₽" },
  { day: "Пт", patients: 301, revenue: "560K ₽" },
  { day: "Сб", patients: 198, revenue: "380K ₽" },
  { day: "Вс", patients: 45, revenue: "120K ₽" }
];

const quickActions = [
  { icon: "📋", label: "Новая запись", color: "#3B82F6" },
  { icon: "👨‍⚕️", label: "Добавить врача", color: "#10B981" },
  { icon: "📊", label: "Отчеты", color: "#F59E0B" },
  { icon: "⚙️", label: "Настройки", color: "#6B7280" }
];

export default function DoctorsManager() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('doctors');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Блокировка прокрутки при открытии модального окна
  useEffect(() => {
    if (isDoctorModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    };
  }, [isDoctorModalOpen]);

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

  const handleDoctorClick = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsDoctorModalOpen(true);
  };

  const closeDoctorModal = () => {
    setIsDoctorModalOpen(false);
    setSelectedDoctor(null);
  };

  const totalPatients = doctorsData.reduce((sum, doctor) => sum + doctor.patientsThisMonth, 0);
  const activeDoctors = doctorsData.filter(d => d.status === 'active').length;

  // Фильтрация врачей
  const filteredDoctors = doctorsData.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || doctor.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = ['all', ...new Set(doctorsData.map(d => d.department))];

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
          backdrop-filter: blur(10px);
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

        /* Плавные переходы для всех интерактивных элементов */
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

        /* Специальные стили для модального окна */
        .modal-open {
          overflow: hidden;
        }

        /* Кастомный скроллбар */
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
      `}</style>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Заголовок и быстрые действия */}
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
                  🏥 Управление врачами
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-sm sm:text-base md:text-lg mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-blue-400">24 врача в штате</span> • <span className="text-orange-400">{totalPatients} пациентов в этом месяце</span> • <span className="text-green-400">6 отделений</span>
                </motion.p>
                
                {/* Быстрые действия */}
                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-3 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ borderLeftColor: action.color, borderLeftWidth: '3px' }}
                    >
                      <span>{action.icon}</span>
                      <span>{action.label}</span>
                    </motion.button>
                  ))}
                </motion.div>

                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>{activeDoctors} активных врачей</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>4.8/5 средний рейтинг врачей</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>87% заполненность расписания</span>
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
                  Главный врач
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Петров А.В.</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сегодня</div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-green-500/10 to-emerald-500/10 rounded-full blur-lg" />
          </div>
        </motion.section>

        {/* Навигационные табы */}
        <motion.div
          className="flex flex-wrap gap-2 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { id: 'doctors', label: 'Врачи', icon: '👨‍⚕️', count: filteredDoctors.length },
            { id: 'appointments', label: 'Записи', icon: '📅', count: upcomingAppointments.length },
            { id: 'departments', label: 'Отделения', icon: '🏥', count: departmentStats.length },
            { id: 'analytics', label: 'Аналитика', icon: '📊' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              className={`relative px-4 py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
              }`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  {tab.count}
                </span>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Основные метрики врачей */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <BentoCardGrid columns={6} className="mb-6">
            {doctorMetrics.map((metric, index) => (
              <motion.div
                key={index}
                className="card--border-glow relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 text-center group"
                style={{ '--glow-color': metric.color } as React.CSSProperties}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3 }}
                whileHover={{ y: isMobile ? 0 : -5, transition: { type: "spring", stiffness: 300 } }}
              >
                <motion.div 
                  className="text-lg mb-2"
                  whileHover={{ scale: isMobile ? 1 : 1.1, rotate: isMobile ? 0 : 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {metric.icon}
                </motion.div>
                <div className="text-white font-bold text-lg mb-1">{metric.value}</div>
                <div className="text-white/60 text-sm mb-2">{metric.category}</div>
                <div className={`flex items-center justify-center gap-1 text-xs ${
                  metric.trend === 'up' ? 'text-green-400' : 
                  metric.trend === 'down' ? 'text-red-400' : 'text-blue-400'
                }`}>
                  <span>{metric.change}</span>
                  <span>{metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}</span>
                </div>
              </motion.div>
            ))}
          </BentoCardGrid>
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
            {activeTab === 'doctors' && (
              <div className="space-y-6 sm:space-y-8">
                <GlobalSpotlight
                  gridRef={gridRef}
                  disableAnimations={shouldDisableAnimations}
                  enabled={!isMobile}
                  spotlightRadius={DEFAULT_SPOTLIGHT_RADIUS}
                  glowColor={DEFAULT_GLOW_COLOR}
                />

                <BentoCardGrid gridRef={gridRef} className="mb-6 sm:mb-8">
                  {filteredDoctors.length === 0 ? (
                    <motion.div 
                      className="col-span-full text-center py-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="text-6xl mb-4">🔍</div>
                      <div className="text-white text-xl mb-2">Врачи не найдены</div>
                      <div className="text-white/60">Попробуйте изменить параметры поиска</div>
                    </motion.div>
                  ) : (
                    <>
                      {/* Основные карточки врачей */}
                      {filteredDoctors.map((doctor, index) => (
                        <ParticleCard
                          key={doctor.id}
                          className="card flex flex-col justify-between relative min-h-[320px] sm:min-h-[350px] w-full max-w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
                          style={{
                            backgroundColor: 'var(--background-dark)',
                            color: 'var(--white)',
                            '--glow-x': '50%',
                            '--glow-y': '50%',
                            '--glow-intensity': '0',
                            '--glow-radius': '200px',
                            '--glow-color': doctor.color.replace('#', '')
                          } as React.CSSProperties}
                          disableAnimations={shouldDisableAnimations}
                          particleCount={isMobile ? 8 : DEFAULT_PARTICLE_COUNT}
                          glowColor={doctor.color.replace('#', '')}
                          enableTilt={!isMobile}
                          clickEffect={!isMobile}
                          enableMagnetism={!isMobile}
                          onCardClick={() => handleDoctorClick(doctor)}
                          priority={index < 3 ? 'high' : 'medium'}
                        >
                          <div className="card__header flex justify-between items-start gap-2 sm:gap-3 relative text-white z-10">
                            <div className="flex items-center gap-3">
                              <div className="text-3xl sm:text-4xl">{doctor.avatar}</div>
                              <div>
                                <h3 className="card__title font-semibold text-lg sm:text-xl">
                                  {doctor.name}
                                </h3>
                                <p className="text-white/60 text-sm">{doctor.specialization}</p>
                              </div>
                            </div>
                            <motion.div 
                              className={`w-3 h-3 rounded-full ${
                                doctor.status === 'active' ? 'bg-green-400' : 
                                doctor.status === 'surgery' ? 'bg-purple-400' : 'bg-yellow-400'
                              }`}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </div>
                          
                          <div className="card__content flex flex-col relative text-white z-10 flex-1 justify-between">
                            <div className="space-y-3 sm:space-y-4 mb-4">
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="text-center p-3 bg-white/5 rounded-lg">
                                  <div className="text-white font-bold text-lg">{doctor.patientsThisMonth}</div>
                                  <div className="text-white/60 text-xs">Пациентов</div>
                                </div>
                                <div className="text-center p-3 bg-white/5 rounded-lg">
                                  <div className="text-white font-bold text-lg">{doctor.experience} лет</div>
                                  <div className="text-white/60 text-xs">Опыт</div>
                                </div>
                              </div>
                              
                              <ProgressBar 
                                value={doctor.performance} 
                                label="Эффективность" 
                                color={doctor.color}
                                showLabel={true}
                                height="8px"
                              />
                              
                              <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                <div className="text-green-400 font-bold text-sm">{doctor.price}</div>
                                <div className="text-green-400/60 text-xs">Стоимость приема</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <RatingStars rating={doctor.rating} size="sm" showValue={true} />
                              <span className="text-white/60 text-sm">{doctor.totalPatients} всего</span>
                            </div>
                          </div>

                          {/* Background gradient */}
                          <div 
                            className="absolute inset-0 opacity-20 transition-opacity duration-300"
                            style={{
                              background: `radial-gradient(circle at center, ${doctor.color}30 0%, transparent 70%)`
                            }}
                          />
                        </ParticleCard>
                      ))}
                    </>
                  )}
                </BentoCardGrid>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">📅 Ближайшие записи к врачам</h2>
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
                        <div className={`text-2xl ${
                          appointment.specialization === 'Кардиология' ? '❤️' :
                          appointment.specialization === 'Неврология' ? '🧠' :
                          appointment.specialization === 'Педиатрия' ? '👶' : '🔪'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-sm sm:text-base group-hover:text-blue-300 transition-colors">
                            {appointment.patient} - {appointment.doctor}
                          </div>
                          <div className="text-white/60 text-xs">
                            {appointment.specialization} • {appointment.type}
                          </div>
                          <div className="text-white/60 text-xs mt-1">
                            {new Date(appointment.date).toLocaleString('ru-RU')} • {appointment.duration}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-3">
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          appointment.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        } border`}>
                          {appointment.status === 'confirmed' ? 'Подтверждена' : 'Ожидает'}
                        </div>
                        <div className={`text-xs px-1.5 py-0.5 rounded ${
                          appointment.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          appointment.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {appointment.priority === 'high' ? 'Высокий' : 
                           appointment.priority === 'medium' ? 'Средний' : 'Низкий'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'departments' && (
              <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">🏥 Отделения клиники</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {departmentStats.map((dept, index) => (
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
                          <div className="text-white font-bold text-sm">{dept.name}</div>
                          <div className="text-white/60 text-xs">{dept.doctors} врачей</div>
                        </div>
                        <div className="text-white/60 text-xs">
                          {dept.patients} пациентов
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-white font-bold text-lg">{dept.revenue}</div>
                        <div className="text-white/60 text-xs">Доход в месяц</div>
                        <div className="text-green-400 text-xs font-medium">{dept.growth}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">📈 Статистика процедур</h3>
                  <div className="space-y-4">
                    {medicalProcedures.map((procedure, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-white text-sm">
                          <span>{procedure.name}</span>
                          <span className="font-bold">{procedure.count}</span>
                        </div>
                        <div className="flex justify-between text-white/60 text-xs mb-1">
                          <span>{procedure.revenue}</span>
                          <span className={procedure.growth.includes('+') ? 'text-green-400' : 'text-red-400'}>
                            {procedure.growth}
                          </span>
                        </div>
                        <ProgressBar 
                          value={(procedure.count / 2000) * 100} 
                          color={procedure.color} 
                          showLabel={false} 
                          height="6px" 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">⭐ Лучшие врачи по отзывам</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {doctorsData
                      .sort((a, b) => b.rating - a.rating)
                      .slice(0, 5)
                      .map((doctor, index) => (
                        <div key={doctor.id} className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="text-lg">{doctor.avatar}</div>
                            <div className="min-w-0 flex-1">
                              <div className="text-white text-xs sm:text-sm truncate">{doctor.name}</div>
                              <div className="text-white/60 text-xs truncate">{doctor.specialization}</div>
                            </div>
                          </div>
                          <div className="text-right ml-2">
                            <div className="text-white font-bold text-xs sm:text-sm">{doctor.rating}/5</div>
                            <div className="text-white/60 text-xs">{doctor.patientsThisMonth} пациентов</div>
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

      {/* Модальное окно деталей врача */}
      <AnimatePresence>
        {isDoctorModalOpen && selectedDoctor && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDoctorModal}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-black rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/20 max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                '--glow-color': selectedDoctor.color.replace('#', ''),
                background: `radial-gradient(ellipse at center, rgba(var(--glow-color), 0.1) 0%, transparent 70%), linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`
              } as React.CSSProperties}
            >
              <div className="p-4 sm:p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="text-3xl sm:text-4xl">{selectedDoctor.avatar}</div>
                    <div className="max-w-[200px] sm:max-w-none">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">{selectedDoctor.name}</h2>
                      <p className="text-white/60 text-xs sm:text-sm truncate">{selectedDoctor.specialization} • {selectedDoctor.department}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeDoctorModal}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedDoctor.patientsThisMonth}</div>
                    <div className="text-white/60 text-xs sm:text-sm">Пациентов в этом месяце</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedDoctor.experience} лет</div>
                    <div className="text-white/60 text-xs sm:text-sm">Опыт работы</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedDoctor.performance}%</div>
                    <div className="text-white/60 text-xs sm:text-sm">Эффективность</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedDoctor.price}</div>
                    <div className="text-white/60 text-xs sm:text-sm">Стоимость приема</div>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-2">Образование и квалификация</h3>
                    <div className="space-y-2">
                      <p className="text-white/70 text-sm">{selectedDoctor.education}</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedDoctor.qualifications.map((qual: string, index: number) => (
                          <span 
                            key={index}
                            className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30"
                          >
                            {qual}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-2">Процедуры и услуги</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoctor.procedures.map((procedure: string, index: number) => (
                        <span 
                          key={index}
                          className="text-xs bg-white/10 px-2 py-1 rounded border border-white/20 text-white/80"
                        >
                          {procedure}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white/60 text-xs mb-1">Статус</h4>
                      <p className={`text-sm ${
                        selectedDoctor.status === 'active' ? 'text-green-400' :
                        selectedDoctor.status === 'surgery' ? 'text-purple-400' : 'text-yellow-400'
                      }`}>
                        {selectedDoctor.status === 'active' ? 'На приеме' :
                         selectedDoctor.status === 'surgery' ? 'На операции' : 'В отпуске'}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white/60 text-xs mb-1">Расписание</h4>
                      <p className="text-white text-sm">{selectedDoctor.availability}</p>
                    </div>
                    <div>
                      <h4 className="text-white/60 text-xs mb-1">Контакты</h4>
                      <p className="text-white text-sm">{selectedDoctor.contact}</p>
                    </div>
                    <div>
                      <h4 className="text-white/60 text-xs mb-1">Ближайшая запись</h4>
                      <p className="text-white text-sm">
                        {new Date(selectedDoctor.nextAvailable).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-3">Рейтинг и отзывы</h3>
                    <div className="flex items-center justify-between">
                      <RatingStars rating={selectedDoctor.rating} size="md" showValue={true} />
                      <span className="text-white/60 text-sm">{selectedDoctor.totalPatients} пациентов всего</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-white/10 bg-white/5">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl font-medium transition-colors duration-200"
                    onClick={closeDoctorModal}
                  >
                    Закрыть
                  </button>
                  <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl font-medium transition-colors duration-200 border border-white/20">
                    Записать пациента
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