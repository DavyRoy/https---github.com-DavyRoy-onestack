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

// Дополнительные данные для демонстрации
const volunteersData = [
  {
    id: 1,
    name: "Анна Смирнова",
    role: "Координатор мероприятий",
    department: "Социальные проекты",
    status: "active",
    hoursThisMonth: 45,
    totalHours: 320,
    rating: 4.9,
    skills: ["Организация", "Коммуникация", "Работа с людьми", "Планирование", "Лидерство"],
    joinDate: "2023-03-15",
    avatar: "👩‍💼",
    tasksCompleted: 28,
    currentProjects: ["Детский праздник", "Сбор помощи", "Координация волонтеров"],
    contact: "anna.s@example.com",
    performance: 95,
    color: "#3B82F6",
    phone: "+7 (912) 345-67-89",
    achievements: ["Волонтер месяца", "Лучший организатор", "100+ часов"]
  },
  {
    id: 2,
    name: "Дмитрий Козлов",
    role: "Волонтер-водитель",
    department: "Логистика",
    status: "active",
    hoursThisMonth: 38,
    totalHours: 285,
    rating: 4.8,
    skills: ["Вождение", "Грузоперевозки", "Навигация", "Логистика", "Ремонт"],
    joinDate: "2023-05-20",
    avatar: "👨‍✈️",
    tasksCompleted: 42,
    currentProjects: ["Доставка гуманитарки", "Транспортная поддержка", "Срочные перевозки"],
    contact: "dmitry.k@example.com",
    performance: 92,
    color: "#10B981",
    phone: "+7 (912) 345-67-90",
    achievements: ["Безопасное вождение", "Срочные доставки"]
  },
  {
    id: 3,
    name: "Мария Петрова",
    role: "Социальный работник",
    department: "Помощь пожилым",
    status: "active",
    hoursThisMonth: 52,
    totalHours: 410,
    rating: 5.0,
    skills: ["Уход", "Психология", "Медицина", "Эмпатия", "Консультирование"],
    joinDate: "2022-11-10",
    avatar: "👩‍⚕️",
    tasksCompleted: 67,
    currentProjects: ["Патронаж", "Социальное сопровождение", "Медицинская помощь"],
    contact: "maria.p@example.com",
    performance: 98,
    color: "#EC4899",
    phone: "+7 (912) 345-67-91",
    achievements: ["Волонтер года", "Идеальный рейтинг", "500+ часов"]
  },
  {
    id: 4,
    name: "Сергей Иванов",
    role: "IT-волонтер",
    department: "Техническая поддержка",
    status: "vacation",
    hoursThisMonth: 12,
    totalHours: 156,
    rating: 4.7,
    skills: ["Программирование", "Техподдержка", "Администрирование", "Сети", "Базы данных"],
    joinDate: "2023-08-05",
    avatar: "👨‍💻",
    tasksCompleted: 23,
    currentProjects: ["Разработка сайта", "Техническая помощь", "Обновление систем"],
    contact: "sergey.i@example.com",
    performance: 88,
    color: "#F59E0B",
    phone: "+7 (912) 345-67-92",
    achievements: ["Разработка платформы", "Техническая поддержка"]
  },
  {
    id: 5,
    name: "Екатерина Новикова",
    role: "Преподаватель-волонтер",
    department: "Образование",
    status: "active",
    hoursThisMonth: 41,
    totalHours: 298,
    rating: 4.9,
    skills: ["Преподавание", "Методика", "Работа с детьми", "Креативность", "Адаптация"],
    joinDate: "2023-02-28",
    avatar: "👩‍🏫",
    tasksCompleted: 35,
    currentProjects: ["Детские курсы", "Образовательные программы", "Развивающие игры"],
    contact: "ekaterina.n@example.com",
    performance: 96,
    color: "#8B5CF6",
    phone: "+7 (912) 345-67-93",
    achievements: ["Лучший преподаватель", "Инновационные методики"]
  },
  {
    id: 6,
    name: "Алексей Волков",
    role: "Строитель-волонтер",
    department: "Ремонтные работы",
    status: "training",
    hoursThisMonth: 28,
    totalHours: 89,
    rating: 4.6,
    skills: ["Строительство", "Ремонт", "Столярные работы", "Электрика", "Сантехника"],
    joinDate: "2023-10-12",
    avatar: "👨‍🔧",
    tasksCompleted: 18,
    currentProjects: ["Ремонт помещений", "Строительные работы", "Обновление инфраструктуры"],
    contact: "aleksey.v@example.com",
    performance: 85,
    color: "#EF4444",
    phone: "+7 (912) 345-67-94",
    achievements: ["Качественный ремонт", "Быстрое выполнение"]
  }
];

const volunteerMetrics = [
  { category: "Всего волонтеров", value: "24", trend: "up", color: "#3B82F6", icon: "👥", change: "+2" },
  { category: "Активных сейчас", value: "18", trend: "stable", color: "#10B981", icon: "✅", change: "0" },
  { category: "Часов в этом месяце", value: "1,245", trend: "up", color: "#F59E0B", icon: "⏱️", change: "+156" },
  { category: "Средний рейтинг", value: "4.8/5", trend: "up", color: "#8B5CF6", icon: "⭐", change: "+0.1" },
  { category: "Новых в этом месяце", value: "3", trend: "up", color: "#EC4899", icon: "🆕", change: "+1" },
  { category: "Проектов в работе", value: "12", trend: "stable", color: "#06B6D4", icon: "📋", change: "0" }
];

const upcomingEvents = [
  {
    id: 1,
    title: "Обучение новых волонтеров",
    date: "2024-01-22 10:00",
    location: "Главный офис",
    participants: 8,
    type: "training",
    organizer: "Анна Смирнова",
    status: "upcoming",
    description: "Обучение основам волонтерской деятельности и правилам безопасности"
  },
  {
    id: 2,
    title: "Доставка гуманитарной помощи",
    date: "2024-01-23 09:00",
    location: "Склад → Районные центры",
    participants: 5,
    type: "logistics",
    organizer: "Дмитрий Козлов",
    status: "upcoming",
    description: "Доставка продуктовых наборов и медикаментов в районные центры"
  },
  {
    id: 3,
    title: "Детский праздник в приюте",
    date: "2024-01-25 14:00",
    location: "Детский приют №3",
    participants: 12,
    type: "event",
    organizer: "Мария Петрова",
    status: "upcoming",
    description: "Организация праздника с играми, подарками и развлечениями для детей"
  },
  {
    id: 4,
    title: "Ремонт учебного класса",
    date: "2024-01-26 08:00",
    location: "Школа №45",
    participants: 6,
    type: "construction",
    organizer: "Алексей Волков",
    status: "upcoming",
    description: "Капитальный ремонт и обновление учебного класса для детей"
  }
];

const departmentStats = [
  { name: "Социальные проекты", volunteers: 8, activeProjects: 4, completion: 87, color: "#3B82F6", growth: "+12%" },
  { name: "Логистика", volunteers: 5, activeProjects: 3, completion: 92, color: "#10B981", growth: "+8%" },
  { name: "Помощь пожилым", volunteers: 4, activeProjects: 2, completion: 95, color: "#EC4899", growth: "+15%" },
  { name: "Техническая поддержка", volunteers: 3, activeProjects: 1, completion: 78, color: "#F59E0B", growth: "+5%" },
  { name: "Образование", volunteers: 2, activeProjects: 1, completion: 90, color: "#8B5CF6", growth: "+20%" },
  { name: "Ремонтные работы", volunteers: 2, activeProjects: 1, completion: 82, color: "#EF4444", growth: "+10%" }
];

// Новые компоненты для улучшенного UI
const MetricCard = ({ metric, index }: { metric: any; index: number }) => (
  <motion.div
    className="card--border-glow relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 text-center group"
    style={{ '--glow-color': metric.color } as React.CSSProperties}
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay: 0.1 * index + 0.3 }}
    whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
  >
    <motion.div 
      className="text-lg mb-2"
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {metric.icon}
    </motion.div>
    <div className="text-white font-bold text-lg mb-1">{metric.value}</div>
    <div className="text-white/60 text-sm mb-2">{metric.category}</div>
    <div className="flex items-center justify-center gap-1 text-xs">
      <span className={
        metric.trend === 'up' ? 'text-green-400' : 
        metric.trend === 'down' ? 'text-red-400' : 'text-blue-400'
      }>
        {metric.change}
      </span>
      <span className={
        metric.trend === 'up' ? 'text-green-400' : 
        metric.trend === 'down' ? 'text-red-400' : 'text-blue-400'
      }>
        {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
      </span>
    </div>
  </motion.div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    active: { label: 'Активен', color: 'bg-green-500' },
    vacation: { label: 'Отпуск', color: 'bg-yellow-500' },
    training: { label: 'Обучение', color: 'bg-blue-500' },
    inactive: { label: 'Неактивен', color: 'bg-gray-500' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;

  return (
    <div className={`flex items-center gap-1 ${config.color} text-white px-2 py-1 rounded-full text-xs`}>
      <div className="w-1.5 h-1.5 rounded-full bg-white" />
      {config.label}
    </div>
  );
};

export default function VolunteersManager() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('volunteers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Блокировка прокрутки при открытии модального окна
  useEffect(() => {
    if (isVolunteerModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVolunteerModalOpen]);

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

  const handleVolunteerClick = (volunteer: any) => {
    setSelectedVolunteer(volunteer);
    setIsVolunteerModalOpen(true);
  };

  const closeVolunteerModal = () => {
    setIsVolunteerModalOpen(false);
    setSelectedVolunteer(null);
  };

  // Фильтрация волонтеров
  const filteredVolunteers = volunteersData.filter(volunteer => {
    const matchesSearch = volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || volunteer.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const totalHours = volunteersData.reduce((sum, volunteer) => sum + volunteer.totalHours, 0);
  const activeVolunteers = volunteersData.filter(v => v.status === 'active').length;

  const departments = [...new Set(volunteersData.map(v => v.department))];

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

        /* Блокировка прокрутки при модальном окне */
        body.no-scroll {
          overflow: hidden;
        }
      `}</style>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Заголовок страницы для управления волонтерами */}
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
                  <span className="text-blue-400">24 волонтера в команде</span> • <span className="text-orange-400">{totalHours} часов работы</span> • <span className="text-green-400">12 активных проектов</span>
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>{activeVolunteers} активных волонтеров</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>4.8/5 средняя оценка работы</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>6 направлений деятельности</span>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="text-right mt-4 sm:mt-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-white font-bold text-lg sm:text-xl md:text-2xl bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg">
                  Координатор волонтеров
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Кузнецова О.И.</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сегодня</div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-xl" />
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
            { id: 'volunteers', label: 'Волонтеры', icon: '👥' },
            { id: 'departments', label: 'Отделы', icon: '🏢' },
            { id: 'events', label: 'Мероприятия', icon: '📅' },
            { id: 'reports', label: 'Отчеты', icon: '📊' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              className={`px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-green-500 text-white shadow-lg'
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

        {/* Основные метрики волонтеров */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {volunteerMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} index={index} />
            ))}
          </div>
        </motion.section>

        {/* Фильтры и поиск для вкладки волонтеров */}
        {activeTab === 'volunteers' && (
          <motion.div
            className="flex flex-col sm:flex-row gap-3 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск волонтеров..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-green-500/50 transition-colors"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40">
                  🔍
                </div>
              </div>
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500/50 transition-colors"
            >
              <option value="all">Все отделы</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </motion.div>
        )}

        {/* Контент в зависимости от активной вкладки */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'volunteers' && (
              <div className="space-y-6 sm:space-y-8">
                {/* Список волонтеров с измененным расположением карточек */}
                <GlobalSpotlight
                  gridRef={gridRef}
                  disableAnimations={shouldDisableAnimations}
                  enabled={!isMobile}
                  spotlightRadius={DEFAULT_SPOTLIGHT_RADIUS}
                  glowColor={DEFAULT_GLOW_COLOR}
                />

                <BentoCardGrid gridRef={gridRef} className="mb-6 sm:mb-8">
                  {/* Первый ряд: 2 большие карточки */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {filteredVolunteers.slice(0, 2).map((volunteer, index) => (
                      <ParticleCard
                        key={volunteer.id}
                        className="card flex flex-col justify-between relative min-h-[300px] sm:min-h-[350px] w-full max-w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
                        style={{
                          backgroundColor: 'var(--background-dark)',
                          color: 'var(--white)',
                          '--glow-x': '50%',
                          '--glow-y': '50%',
                          '--glow-intensity': '0',
                          '--glow-radius': '200px',
                          '--glow-color': volunteer.color.replace('#', '')
                        } as React.CSSProperties}
                        disableAnimations={shouldDisableAnimations}
                        particleCount={isMobile ? 8 : DEFAULT_PARTICLE_COUNT}
                        glowColor={volunteer.color.replace('#', '')}
                        enableTilt={!isMobile}
                        clickEffect={!isMobile}
                        enableMagnetism={!isMobile}
                        onCardClick={() => handleVolunteerClick(volunteer)}
                      >
                        <div className="card__header flex justify-between items-start gap-2 sm:gap-3 relative text-white z-10">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl sm:text-4xl">{volunteer.avatar}</div>
                            <div>
                              <h3 className="card__title font-semibold text-lg sm:text-xl">
                                {volunteer.name}
                              </h3>
                              <p className="text-white/60 text-sm">{volunteer.role}</p>
                            </div>
                          </div>
                          <StatusBadge status={volunteer.status} />
                        </div>
                        
                        <div className="card__content flex flex-col relative text-white z-10 flex-1 justify-between">
                          <div className="space-y-3 sm:space-y-4 mb-4">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="text-center p-3 bg-white/5 rounded-lg">
                                <div className="text-white font-bold text-lg">{volunteer.hoursThisMonth}ч</div>
                                <div className="text-white/60 text-xs">В этом месяце</div>
                              </div>
                              <div className="text-center p-3 bg-white/5 rounded-lg">
                                <div className="text-white font-bold text-lg">{volunteer.totalHours}ч</div>
                                <div className="text-white/60 text-xs">Всего часов</div>
                              </div>
                            </div>
                            
                            <ProgressBar 
                              value={volunteer.performance} 
                              label="Эффективность" 
                              color={volunteer.color}
                              showLabel={true}
                              height="8px"
                            />
                            
                            <div className="flex flex-wrap gap-1">
                              {volunteer.skills.slice(0, 3).map((skill, skillIndex) => (
                                <span 
                                  key={skillIndex}
                                  className="text-xs bg-white/10 px-2 py-1 rounded border border-white/20 text-white/80"
                                >
                                  {skill}
                                </span>
                              ))}
                              {volunteer.skills.length > 3 && (
                                <span className="text-xs bg-white/5 px-2 py-1 rounded border border-white/10 text-white/60">
                                  +{volunteer.skills.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <RatingStars rating={volunteer.rating} size="sm" showValue={true} />
                            <span className="text-white/60 text-sm">{volunteer.tasksCompleted} задач</span>
                          </div>
                        </div>

                        {/* Background gradient */}
                        <div 
                          className="absolute inset-0 opacity-20 transition-opacity duration-300"
                          style={{
                            background: `radial-gradient(circle at center, ${volunteer.color}30 0%, transparent 70%)`
                          }}
                        />
                      </ParticleCard>
                    ))}
                  </div>

                  {/* Второй ряд: 4 карточки среднего размера */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {filteredVolunteers.slice(2, 6).map((volunteer, index) => (
                      <ParticleCard
                        key={volunteer.id}
                        className="card flex flex-col justify-between relative min-h-[250px] w-full max-w-full p-4 sm:p-5 rounded-xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
                        style={{
                          backgroundColor: 'var(--background-dark)',
                          color: 'var(--white)',
                          '--glow-x': '50%',
                          '--glow-y': '50%',
                          '--glow-intensity': '0',
                          '--glow-radius': '150px',
                          '--glow-color': volunteer.color.replace('#', '')
                        } as React.CSSProperties}
                        disableAnimations={shouldDisableAnimations}
                        particleCount={isMobile ? 6 : 12}
                        glowColor={volunteer.color.replace('#', '')}
                        enableTilt={!isMobile}
                        clickEffect={!isMobile}
                        enableMagnetism={!isMobile}
                        onCardClick={() => handleVolunteerClick(volunteer)}
                      >
                        <div className="card__header flex justify-between items-start gap-2 relative text-white z-10">
                          <div className="flex items-center gap-2">
                            <div className="text-2xl">{volunteer.avatar}</div>
                            <div>
                              <h3 className="card__title font-semibold text-base">
                                {volunteer.name}
                              </h3>
                              <p className="text-white/60 text-xs">{volunteer.department}</p>
                            </div>
                          </div>
                          <StatusBadge status={volunteer.status} />
                        </div>
                        
                        <div className="card__content flex flex-col relative text-white z-10 flex-1 justify-between mt-3">
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="text-center p-2 bg-white/5 rounded">
                                <div className="text-white font-bold">{volunteer.hoursThisMonth}ч</div>
                                <div className="text-white/60">Месяц</div>
                              </div>
                              <div className="text-center p-2 bg-white/5 rounded">
                                <div className="text-white font-bold">{volunteer.performance}%</div>
                                <div className="text-white/60">Эффект.</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <RatingStars rating={volunteer.rating} size="sm" showValue={false} />
                              <span className="text-white/60 text-xs">{volunteer.tasksCompleted}</span>
                            </div>
                          </div>
                        </div>

                        {/* Background gradient */}
                        <div 
                          className="absolute inset-0 opacity-15 transition-opacity duration-300"
                          style={{
                            background: `radial-gradient(circle at center, ${volunteer.color}20 0%, transparent 70%)`
                          }}
                        />
                      </ParticleCard>
                    ))}
                  </div>
                </BentoCardGrid>
              </div>
            )}

            {activeTab === 'departments' && (
              <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">🏢 Отделы и направления</h2>
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
                          <div className="text-white/60 text-xs">{dept.volunteers} волонтеров</div>
                        </div>
                        <div className="text-white/60 text-xs">
                          {dept.activeProjects} проектов
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <ProgressBar value={dept.completion} label="Выполнение проектов" color={dept.color} height="6px" />
                        <div className="flex justify-between text-white text-xs">
                          <span>Проекты завершены</span>
                          <span className="font-bold">{dept.completion}%</span>
                        </div>
                        <div className="flex justify-between text-green-400 text-xs">
                          <span>Рост эффективности</span>
                          <span className="font-bold">{dept.growth}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">📅 Ближайшие мероприятия</h2>
                <div className="space-y-3 sm:space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className={`text-2xl ${
                          event.type === 'training' ? '📚' :
                          event.type === 'logistics' ? '🚚' :
                          event.type === 'event' ? '🎉' : '🔧'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-sm sm:text-base group-hover:text-green-300 transition-colors">
                            {event.title}
                          </div>
                          <div className="text-white/60 text-xs">
                            {new Date(event.date).toLocaleString('ru-RU')} • {event.location}
                          </div>
                          <div className="text-white/60 text-xs mt-1">
                            Организатор: {event.organizer} • Участников: {event.participants}
                          </div>
                          <div className="text-white/40 text-xs mt-1">
                            {event.description}
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                        Запланировано
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">📈 Статистика активности</h3>
                  <div className="space-y-4">
                    {volunteersData.map((volunteer, index) => (
                      <div key={volunteer.id} className="space-y-2">
                        <div className="flex justify-between text-white text-sm">
                          <span className="flex items-center gap-2">
                            <span>{volunteer.avatar}</span>
                            <span>{volunteer.name}</span>
                          </span>
                          <span className="font-bold">{volunteer.hoursThisMonth}ч</span>
                        </div>
                        <ProgressBar 
                          value={(volunteer.hoursThisMonth / 60) * 100} 
                          color={volunteer.color} 
                          showLabel={false} 
                          height="6px" 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">⭐ Лучшие волонтеры</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {volunteersData
                      .sort((a, b) => b.rating - a.rating)
                      .slice(0, 5)
                      .map((volunteer, index) => (
                        <div key={volunteer.id} className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="text-lg">{volunteer.avatar}</div>
                            <div className="min-w-0 flex-1">
                              <div className="text-white text-xs sm:text-sm truncate">{volunteer.name}</div>
                              <div className="text-white/60 text-xs truncate">{volunteer.role}</div>
                            </div>
                          </div>
                          <div className="text-right ml-2">
                            <div className="text-white font-bold text-xs sm:text-sm">{volunteer.rating}/5</div>
                            <div className="text-white/60 text-xs">{volunteer.tasksCompleted} задач</div>
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
                    <div className="text-3xl sm:text-4xl">{selectedVolunteer.avatar}</div>
                    <div className="max-w-[200px] sm:max-w-none">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">{selectedVolunteer.name}</h2>
                      <p className="text-white/60 text-xs sm:text-sm truncate">{selectedVolunteer.role} • {selectedVolunteer.department}</p>
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
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedVolunteer.hoursThisMonth}ч</div>
                    <div className="text-white/60 text-xs sm:text-sm">В этом месяце</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedVolunteer.totalHours}ч</div>
                    <div className="text-white/60 text-xs sm:text-sm">Всего часов</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedVolunteer.performance}%</div>
                    <div className="text-white/60 text-xs sm:text-sm">Эффективность</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedVolunteer.tasksCompleted}</div>
                    <div className="text-white/60 text-xs sm:text-sm">Задач выполнено</div>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-2">Навыки и компетенции</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVolunteer.skills.map((skill: string, index: number) => (
                        <span 
                          key={index}
                          className="text-xs bg-white/10 px-2 py-1 rounded border border-white/20 text-white/80"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white/60 text-xs mb-1">Статус</h4>
                      <StatusBadge status={selectedVolunteer.status} />
                    </div>
                    <div>
                      <h4 className="text-white/60 text-xs mb-1">В команде с</h4>
                      <p className="text-white text-sm">{new Date(selectedVolunteer.joinDate).toLocaleDateString('ru-RU')}</p>
                    </div>
                    <div>
                      <h4 className="text-white/60 text-xs mb-1">Email</h4>
                      <p className="text-white text-sm">{selectedVolunteer.contact}</p>
                    </div>
                    <div>
                      <h4 className="text-white/60 text-xs mb-1">Телефон</h4>
                      <p className="text-white text-sm">{selectedVolunteer.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-2">Текущие проекты</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVolunteer.currentProjects.map((project: string, index: number) => (
                        <span 
                          key={index}
                          className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30"
                        >
                          {project}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-2">Достижения</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVolunteer.achievements.map((achievement: string, index: number) => (
                        <span 
                          key={index}
                          className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded border border-yellow-500/30"
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-3">Оценка работы</h3>
                    <div className="flex items-center justify-between">
                      <RatingStars rating={selectedVolunteer.rating} size="md" showValue={true} />
                      <span className="text-white/60 text-sm">на основе отзывов</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-white/10 bg-white/5">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl font-medium transition-colors duration-200"
                    onClick={closeVolunteerModal}
                  >
                    Закрыть
                  </button>
                  <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl font-medium transition-colors duration-200 border border-white/20">
                    Написать сообщение
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