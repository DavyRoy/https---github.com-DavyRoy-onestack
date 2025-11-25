'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

// Константы для цветов
const COLORS = {
  primary: 'from-gray-900 via-black to-gray-800',
  secondary: 'from-blue-900 via-black to-cyan-900',
  success: '34, 197, 94',
  warning: '234, 179, 8',
  error: '239, 68, 68',
  info: '59, 130, 246',
  blue: '59, 130, 246',
  cyan: '34, 211, 238',
  emerald: '16, 185, 129',
  orange: '249, 115, 22',
  violet: '139, 92, 246',
  teal: '20, 184, 166',
  amber: '245, 158, 11'
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

const formatDistance = (km: number) => {
  return new Intl.NumberFormat('ru-RU').format(km) + ' км';
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
  variant?: 'default' | 'compact';
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
  variant = 'default'
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
        const distance = variant === 'compact' ? 15 + Math.random() * 40 : 20 + Math.random() * 60;
        const duration = variant === 'compact' ? 1 + Math.random() * 1.5 : 1.5 + Math.random() * 2;

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
      }, index * (variant === 'compact' ? 100 : 80));

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles, variant]);

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
          scale: variant === 'compact' ? 1.01 : 1.02,
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

      updateCardGlowProperties(element, e.clientX, e.clientY, 1, 
        variant === 'compact' ? DEFAULT_SPOTLIGHT_RADIUS * 0.7 : DEFAULT_SPOTLIGHT_RADIUS);
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
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor, onCardClick, variant]);

  return (
    <motion.div
      ref={cardRef}
      className={`${className} relative overflow-hidden cursor-pointer transform-gpu`}
      style={{ 
        ...style, 
        position: 'relative', 
        overflow: 'hidden',
        transformStyle: 'preserve-3d'
      }}
      whileHover={{ y: variant === 'compact' ? -2 : -4 }}
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

// Компонент для рейтинга водителей
const DriverRating = ({ rating, size = 'sm', showValue = true }: { rating: number; size?: 'sm' | 'md' | 'lg'; showValue?: boolean }) => {
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

// Данные для водителей транспортной компании
const driversData = [
  {
    id: 1,
    name: "Иван Петров",
    status: "on_route",
    rating: 4.9,
    deliveriesToday: 8,
    totalDeliveries: 1245,
    experience: "5 лет",
    license: "Категория CE",
    vehicle: "Volvo FH16 2022",
    currentRoute: "Москва → Санкт-Петербург",
    nextRoute: "Санкт-Петербург → Минск",
    efficiency: 96,
    contact: "+7 (912) 345-67-89",
    earningsToday: "15,800 ₽",
    totalEarnings: "2,456,800 ₽",
    color: "#3B82F6",
    avatar: "🚚",
    driveTime: "4 часа",
    completedToday: 6,
    terminal: "Терминал №1",
    currentLocation: "Тверская область",
    distanceToday: "850 км",
    fuelConsumption: "32.5 л/100км",
    violations: 0,
    cargoType: "Сборный груз",
    cargoWeight: "18.5 т",
    eta: "14:30"
  },
  {
    id: 2,
    name: "Алексей Смирнов",
    status: "loading",
    rating: 4.8,
    deliveriesToday: 6,
    totalDeliveries: 890,
    experience: "3 года",
    license: "Категория CE",
    vehicle: "MAN TGX 2021",
    currentRoute: "Склад → Терминал",
    nextRoute: "Москва → Казань",
    efficiency: 94,
    contact: "+7 (912) 345-67-90",
    earningsToday: "12,200 ₽",
    totalEarnings: "1,812,300 ₽",
    color: "#10B981",
    avatar: "🚛",
    driveTime: "1 час",
    completedToday: 4,
    terminal: "Терминал №2",
    currentLocation: "Москва, склад",
    distanceToday: "120 км",
    fuelConsumption: "29.8 л/100км",
    violations: 1,
    cargoType: "Промтовары",
    cargoWeight: "22.0 т",
    eta: "11:45"
  },
  {
    id: 3,
    name: "Мария Козлова",
    status: "on_route",
    rating: 4.9,
    deliveriesToday: 4,
    totalDeliveries: 567,
    experience: "4 года",
    license: "Категория C",
    vehicle: "Mercedes Actros 2020",
    currentRoute: "Новосибирск → Омск",
    nextRoute: "Омск → Екатеринбург",
    efficiency: 92,
    contact: "+7 (912) 345-67-91",
    earningsToday: "18,500 ₽",
    totalEarnings: "1,587,400 ₽",
    color: "#EC4899",
    avatar: "👩‍💼",
    driveTime: "6 часов",
    completedToday: 2,
    terminal: "Терминал №3",
    currentLocation: "Новосибирская область",
    distanceToday: "450 км",
    fuelConsumption: "31.2 л/100км",
    violations: 0,
    cargoType: "Хрупкий груз",
    cargoWeight: "15.0 т",
    eta: "16:20"
  },
  {
    id: 4,
    name: "Сергей Иванов",
    status: "break",
    rating: 4.7,
    deliveriesToday: 7,
    totalDeliveries: 1234,
    experience: "8 лет",
    license: "Категория CE",
    vehicle: "Scania R500 2023",
    currentRoute: "Ростов-на-Дону → Волгоград",
    nextRoute: "Волгоград → Саратов",
    efficiency: 88,
    contact: "+7 (912) 345-67-92",
    earningsToday: "13,500 ₽",
    totalEarnings: "3,134,100 ₽",
    color: "#F59E0B",
    avatar: "🧑‍✈️",
    driveTime: "3 часа",
    completedToday: 5,
    terminal: "Терминал №4",
    currentLocation: "Волгоградская область",
    distanceToday: "680 км",
    fuelConsumption: "33.1 л/100км",
    violations: 2,
    cargoType: "Строительные материалы",
    cargoWeight: "25.0 т",
    eta: "15:45"
  },
  {
    id: 5,
    name: "Дмитрий Новиков",
    status: "available",
    rating: 4.8,
    deliveriesToday: 10,
    totalDeliveries: 856,
    experience: "6 лет",
    license: "Категория C",
    vehicle: "DAF XF 2022",
    currentRoute: "Ожидание задания",
    nextRoute: "Москва → Нижний Новгород",
    efficiency: 95,
    contact: "+7 (912) 345-67-93",
    earningsToday: "9,800 ₽",
    totalEarnings: "2,198,700 ₽",
    color: "#8B5CF6",
    avatar: "🚗",
    driveTime: "45 мин",
    completedToday: 8,
    terminal: "Терминал №1",
    currentLocation: "Москва, база",
    distanceToday: "320 км",
    fuelConsumption: "28.5 л/100км",
    violations: 0,
    cargoType: "Электроника",
    cargoWeight: "12.5 т",
    eta: "-"
  },
  {
    id: 6,
    name: "Екатерина Волкова",
    status: "offline",
    rating: 4.6,
    deliveriesToday: 3,
    totalDeliveries: 678,
    experience: "2 года",
    license: "Категория C",
    vehicle: "Renault Magnum 2019",
    currentRoute: "Выходной",
    nextRoute: "Краснодар → Сочи",
    efficiency: 85,
    contact: "+7 (912) 345-67-94",
    earningsToday: "7,200 ₽",
    totalEarnings: "956,800 ₽",
    color: "#EF4444",
    avatar: "👩‍🚀",
    driveTime: "-",
    completedToday: 2,
    terminal: "Терминал №2",
    currentLocation: "Краснодар",
    distanceToday: "0 км",
    fuelConsumption: "30.5 л/100км",
    violations: 3,
    cargoType: "Продукты",
    cargoWeight: "20.0 т",
    eta: "-"
  }
];

const driverMetrics = [
  { category: "Всего водителей", value: "48", trend: "up", color: "#3B82F6", icon: "👨‍✈️", change: "+3" },
  { category: "На маршруте", value: "32", trend: "stable", color: "#10B981", icon: "📍", change: "0" },
  { category: "Доставок сегодня", value: "156", trend: "up", color: "#F59E0B", icon: "📦", change: "+18" },
  { category: "Средний рейтинг", value: "4.8/5", trend: "up", color: "#8B5CF6", icon: "⭐", change: "+0.1" },
  { category: "Среднее время рейса", value: "6.2 часа", trend: "down", color: "#EC4899", icon: "⏱️", change: "-0.3" },
  { category: "Доход за сегодня", value: "1.2M ₽", trend: "up", color: "#06B6D4", icon: "💰", change: "+85K" }
];

const activeRoutes = [
  {
    id: 1,
    routeNumber: "#RT-7845",
    driver: "Иван Петров",
    vehicle: "Volvo FH16 2022",
    route: "Москва → Санкт-Петербург",
    status: "in_progress",
    estimatedTime: "4 часа",
    distance: "684 км",
    cargo: "Сборный груз",
    weight: "18.5 т",
    client: "ООО 'Логистик Про'",
    priority: "high",
    startTime: "08:30",
    eta: "14:30",
    progress: 65
  },
  {
    id: 2,
    routeNumber: "#RT-7846",
    driver: "Мария Козлова",
    vehicle: "Mercedes Actros 2020",
    route: "Новосибирск → Омск",
    status: "in_progress",
    estimatedTime: "6 часов",
    distance: "627 км",
    cargo: "Хрупкий груз",
    weight: "15.0 т",
    client: "ЗАО 'Транс Сервис'",
    priority: "medium",
    startTime: "07:15",
    eta: "16:20",
    progress: 45
  },
  {
    id: 3,
    routeNumber: "#RT-7847",
    driver: "Алексей Смирнов",
    vehicle: "MAN TGX 2021",
    route: "Склад → Терминал",
    status: "loading",
    estimatedTime: "1 час",
    distance: "35 км",
    cargo: "Промтовары",
    weight: "22.0 т",
    client: "ИП 'Смирнов'",
    priority: "low",
    startTime: "10:00",
    eta: "11:45",
    progress: 20
  },
  {
    id: 4,
    routeNumber: "#RT-7848",
    driver: "Сергей Иванов",
    vehicle: "Scania R500 2023",
    route: "Ростов-на-Дону → Волгоград",
    status: "break",
    estimatedTime: "3 часа",
    distance: "474 км",
    cargo: "Строительные материалы",
    weight: "25.0 т",
    client: "ООО 'СтройЛогист'",
    priority: "medium",
    startTime: "09:00",
    eta: "15:45",
    progress: 80
  }
];

const vehicleStats = [
  { type: "Тягачи", count: 32, utilization: 88, revenue: "856.8K ₽", color: "#3B82F6" },
  { type: "Рефрижераторы", count: 8, utilization: 92, revenue: "245.4K ₽", color: "#10B981" },
  { type: "Тентованные", count: 24, utilization: 85, revenue: "634.2K ₽", color: "#F59E0B" },
  { type: "Цистерны", count: 6, utilization: 78, revenue: "187.9K ₽", color: "#8B5CF6" },
  { type: "Самосвалы", count: 12, utilization: 82, revenue: "367.3K ₽", color: "#EC4899" },
  { type: "Легковые", count: 16, utilization: 75, revenue: "124.6K ₽", color: "#06B6D4" }
];

const performanceMetrics = [
  { name: "Безопасность вождения", value: 96, target: 90, color: "#3B82F6", trend: "up" },
  { name: "Соблюдение сроков", value: 94, target: 85, color: "#10B981", trend: "up" },
  { name: "Экономия топлива", value: 88, target: 80, color: "#F59E0B", trend: "stable" },
  { name: "Состояние ТС", value: 92, target: 85, color: "#8B5CF6", trend: "up" }
];

const statusColors = {
  on_route: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', label: 'На маршруте' },
  loading: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', label: 'Погрузка' },
  break: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', label: 'Перерыв' },
  available: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', label: 'Доступен' },
  offline: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', label: 'Не в сети' }
};

const priorityColors = {
  high: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', label: 'Высокий' },
  medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', label: 'Средний' },
  low: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', label: 'Низкий' }
};

export default function DriversManager() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('drivers');
  const [isBodyScrollLocked, setIsBodyScrollLocked] = useState(false);

  // Блокировка прокрутки при открытии модального окна
  useEffect(() => {
    if (isDriverModalOpen) {
      document.body.style.overflow = 'hidden';
      setIsBodyScrollLocked(true);
    } else {
      document.body.style.overflow = 'unset';
      setIsBodyScrollLocked(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
      setIsBodyScrollLocked(false);
    };
  }, [isDriverModalOpen]);

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

  const handleDriverClick = (driver: any) => {
    setSelectedDriver(driver);
    setIsDriverModalOpen(true);
  };

  const closeDriverModal = () => {
    setIsDriverModalOpen(false);
    setSelectedDriver(null);
  };

  const totalDeliveries = driversData.reduce((sum, driver) => sum + driver.deliveriesToday, 0);
  const activeDrivers = driversData.filter(d => d.status !== 'offline').length;
  const totalDistance = driversData.reduce((sum, driver) => sum + parseInt(driver.distanceToday), 0);

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

        /* Улучшенная анимация для модальных окон */
        .modal-overlay {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
      `}</style>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Заголовок страницы для управления водителями */}
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
                  🚛 Управление водителями
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-sm sm:text-base md:text-lg mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-blue-400">48 водителей в системе</span> • <span className="text-orange-400">{totalDeliveries} доставок сегодня</span> • <span className="text-green-400">{formatDistance(totalDistance)} пройдено</span>
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>{activeDrivers} активных водителей</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>4.8/5 средний рейтинг</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>6.2 часа среднее время рейса</span>
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
                  Диспетчер
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Козлов А.В.</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сегодня</div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-lg" />
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
            { id: 'drivers', label: 'Водители', icon: '👨‍✈️' },
            { id: 'routes', label: 'Активные рейсы', icon: '📍' },
            { id: 'vehicles', label: 'Транспорт', icon: '🚛' },
            { id: 'performance', label: 'Эффективность', icon: '📊' }
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

        {/* Основные метрики водителей */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {driverMetrics.map((metric, index) => (
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
                <div className={`flex items-center justify-center gap-1 text-xs ${
                  metric.trend === 'up' ? 'text-green-400' : 
                  metric.trend === 'down' ? 'text-red-400' : 'text-blue-400'
                }`}>
                  {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                  <span>{metric.change}</span>
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
            {activeTab === 'drivers' && (
              <div className="space-y-6 sm:space-y-8">
                {/* Список водителей */}
                <GlobalSpotlight
                  gridRef={gridRef}
                  disableAnimations={shouldDisableAnimations}
                  enabled={!isMobile}
                  spotlightRadius={DEFAULT_SPOTLIGHT_RADIUS}
                  glowColor={DEFAULT_GLOW_COLOR}
                />

                <BentoCardGrid gridRef={gridRef} className="mb-6 sm:mb-8">
                  {/* Первый ряд: 3 карточки водителей */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {driversData.slice(0, 3).map((driver, index) => (
                      <ParticleCard
                        key={driver.id}
                        className="card flex flex-col justify-between relative min-h-[320px] sm:min-h-[350px] w-full max-w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
                        style={{
                          backgroundColor: 'var(--background-dark)',
                          color: 'var(--white)',
                          '--glow-x': '50%',
                          '--glow-y': '50%',
                          '--glow-intensity': '0',
                          '--glow-radius': '200px',
                          '--glow-color': driver.color.replace('#', '')
                        } as React.CSSProperties}
                        disableAnimations={shouldDisableAnimations}
                        particleCount={isMobile ? 8 : DEFAULT_PARTICLE_COUNT}
                        glowColor={driver.color.replace('#', '')}
                        enableTilt={!isMobile}
                        clickEffect={!isMobile}
                        enableMagnetism={!isMobile}
                        onCardClick={() => handleDriverClick(driver)}
                      >
                        <div className="card__header flex justify-between items-start gap-2 sm:gap-3 relative text-white z-10">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl sm:text-4xl">{driver.avatar}</div>
                            <div>
                              <h3 className="card__title font-semibold text-lg sm:text-xl">
                                {driver.name}
                              </h3>
                              <p className="text-white/60 text-sm">{driver.vehicle} • {driver.terminal}</p>
                            </div>
                          </div>
                          <motion.div 
                            className={`w-3 h-3 rounded-full ${
                              statusColors[driver.status as keyof typeof statusColors]?.bg.split(' ')[0]
                            }`}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </div>
                        
                        <div className="card__content flex flex-col relative text-white z-10 flex-1 justify-between">
                          <div className="space-y-3 sm:space-y-4 mb-4">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="text-center p-3 bg-white/5 rounded-lg">
                                <div className="text-white font-bold text-lg">{driver.deliveriesToday}</div>
                                <div className="text-white/60 text-xs">Доставок сегодня</div>
                              </div>
                              <div className="text-center p-3 bg-white/5 rounded-lg">
                                <div className="text-white font-bold text-lg">{formatDistance(parseInt(driver.distanceToday))}</div>
                                <div className="text-white/60 text-xs">Пробег сегодня</div>
                              </div>
                            </div>
                            
                            <ProgressBar 
                              value={driver.efficiency} 
                              label="Эффективность" 
                              color={driver.color}
                              showLabel={true}
                              height="8px"
                            />
                            
                            <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                              <div className="text-green-400 font-bold text-sm">{driver.earningsToday}</div>
                              <div className="text-green-400/60 text-xs">Заработок сегодня</div>
                            </div>

                            <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                              <div className="text-blue-400 font-bold text-sm">{driver.currentLocation}</div>
                              <div className="text-blue-400/60 text-xs">Текущее местоположение</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <DriverRating rating={driver.rating} size="sm" showValue={true} />
                            <span className="text-white/60 text-sm">{driver.driveTime}</span>
                          </div>
                        </div>

                        {/* Background gradient */}
                        <div 
                          className="absolute inset-0 opacity-20 transition-opacity duration-300"
                          style={{
                            background: `radial-gradient(circle at center, ${driver.color}30 0%, transparent 70%)`
                          }}
                        />
                      </ParticleCard>
                    ))}
                  </div>

                  {/* Второй ряд: 3 карточки водителей */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {driversData.slice(3, 6).map((driver, index) => (
                      <ParticleCard
                        key={driver.id}
                        className="card flex flex-col justify-between relative min-h-[280px] sm:min-h-[320px] w-full max-w-full p-4 sm:p-5 rounded-xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
                        style={{
                          backgroundColor: 'var(--background-dark)',
                          color: 'var(--white)',
                          '--glow-x': '50%',
                          '--glow-y': '50%',
                          '--glow-intensity': '0',
                          '--glow-radius': '180px',
                          '--glow-color': driver.color.replace('#', '')
                        } as React.CSSProperties}
                        disableAnimations={shouldDisableAnimations}
                        particleCount={isMobile ? 6 : 12}
                        glowColor={driver.color.replace('#', '')}
                        enableTilt={!isMobile}
                        clickEffect={!isMobile}
                        enableMagnetism={!isMobile}
                        onCardClick={() => handleDriverClick(driver)}
                        variant="compact"
                      >
                        <div className="card__header flex justify-between items-start gap-2 relative text-white z-10">
                          <div className="flex items-center gap-2">
                            <div className="text-2xl">{driver.avatar}</div>
                            <div>
                              <h3 className="card__title font-semibold text-base">
                                {driver.name.split(' ')[0]}
                              </h3>
                              <p className="text-white/60 text-xs">{driver.vehicle}</p>
                            </div>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${
                            statusColors[driver.status as keyof typeof statusColors]?.bg.split(' ')[0]
                          }`} />
                        </div>
                        
                        <div className="card__content flex flex-col relative text-white z-10 flex-1 justify-between mt-3">
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="text-center p-2 bg-white/5 rounded">
                                <div className="text-white font-bold">{driver.deliveriesToday}</div>
                                <div className="text-white/60">Доставки</div>
                              </div>
                              <div className="text-center p-2 bg-white/5 rounded">
                                <div className="text-white font-bold">{driver.efficiency}%</div>
                                <div className="text-white/60">Эффект.</div>
                              </div>
                            </div>
                            
                            <div className="text-center p-2 bg-blue-500/10 rounded border border-blue-500/20">
                              <div className="text-blue-400 font-bold text-xs">{driver.earningsToday}</div>
                              <div className="text-blue-400/60 text-xs">Заработок</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <DriverRating rating={driver.rating} size="sm" showValue={false} />
                            <span className="text-white/60 text-xs">{driver.experience}</span>
                          </div>
                        </div>

                        {/* Background gradient */}
                        <div 
                          className="absolute inset-0 opacity-15 transition-opacity duration-300"
                          style={{
                            background: `radial-gradient(circle at center, ${driver.color}20 0%, transparent 70%)`
                          }}
                        />
                      </ParticleCard>
                    ))}
                  </div>
                </BentoCardGrid>
              </div>
            )}

            {activeTab === 'routes' && (
              <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-0">📍 Активные рейсы</h2>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span>{activeRoutes.filter(r => r.status === 'in_progress').length} в пути</span>
                    <div className="w-2 h-2 rounded-full bg-yellow-400 ml-2"></div>
                    <span>{activeRoutes.filter(r => r.status === 'loading').length} на погрузке</span>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {activeRoutes.map((route, index) => (
                    <motion.div
                      key={route.id}
                      className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className={`text-2xl ${
                          route.status === 'in_progress' ? '🚚' :
                          route.status === 'loading' ? '📦' : '⏸️'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-white font-medium text-sm sm:text-base group-hover:text-blue-300 transition-colors">
                              {route.routeNumber} - {route.driver}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              priorityColors[route.priority as keyof typeof priorityColors]?.bg
                            } ${priorityColors[route.priority as keyof typeof priorityColors]?.text} ${
                              priorityColors[route.priority as keyof typeof priorityColors]?.border
                            }`}>
                              {priorityColors[route.priority as keyof typeof priorityColors]?.label}
                            </span>
                          </div>
                          <div className="text-white/60 text-xs">
                            {route.route} • {route.vehicle}
                          </div>
                          <div className="text-white/60 text-xs mt-1">
                            Груз: {route.cargo} • {route.weight} • Клиент: {route.client}
                          </div>
                          <div className="text-white/40 text-xs mt-1">
                            Расстояние: {route.distance} • В пути: {route.estimatedTime} • ETA: {route.eta}
                          </div>
                          <div className="mt-2">
                            <ProgressBar value={route.progress} color="#3B82F6" showLabel={false} height="4px" />
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        route.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        route.status === 'loading' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-orange-500/20 text-orange-400 border-orange-500/30'
                      } border ml-3 flex-shrink-0`}>
                        {route.status === 'in_progress' ? 'В пути' :
                         route.status === 'loading' ? 'Погрузка' : 'Перерыв'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'vehicles' && (
              <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">🚛 Статистика транспорта</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {vehicleStats.map((vehicle, index) => (
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
                          <div className="text-white font-bold text-sm">{vehicle.type}</div>
                          <div className="text-white/60 text-xs">{vehicle.count} единиц</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white/60 text-xs">
                            {vehicle.utilization}% загрузка
                          </div>
                          <div className="text-green-400 text-xs mt-1">
                            {vehicle.revenue}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-white font-bold text-lg">{vehicle.revenue}</div>
                        <div className="text-white/60 text-xs">Доход сегодня</div>
                      </div>

                      <ProgressBar 
                        value={vehicle.utilization} 
                        color={vehicle.color}
                        showLabel={false}
                        height="4px"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">📈 Ключевые показатели</h3>
                  <div className="space-y-4">
                    {performanceMetrics.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center text-white text-sm">
                          <span>{metric.name}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${
                              metric.trend === 'up' ? 'text-green-400' : 
                              metric.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
                            }`}>
                              {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                            </span>
                            <span className="font-bold">{metric.value}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-white/60 text-xs mb-1">
                          <span>Цель: {metric.target}%</span>
                          <span className={metric.value >= metric.target ? 'text-green-400' : 'text-yellow-400'}>
                            {metric.value >= metric.target ? '✅ Выполнено' : '⚠️ Требует внимания'}
                          </span>
                        </div>
                        <ProgressBar value={metric.value} color={metric.color} showLabel={false} height="6px" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">⭐ Лучшие водители</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {driversData
                      .sort((a, b) => b.rating - a.rating)
                      .slice(0, 5)
                      .map((driver, index) => (
                        <motion.div 
                          key={driver.id} 
                          className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                          whileHover={{ x: 4 }}
                          onClick={() => handleDriverClick(driver)}
                        >
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="text-lg">{driver.avatar}</div>
                            <div className="min-w-0 flex-1">
                              <div className="text-white text-xs sm:text-sm truncate">{driver.name}</div>
                              <div className="text-white/60 text-xs truncate">{driver.vehicle} • {driver.terminal}</div>
                            </div>
                          </div>
                          <div className="text-right ml-2">
                            <div className="text-white font-bold text-xs sm:text-sm">{driver.rating}/5</div>
                            <div className="text-white/60 text-xs">{driver.deliveriesToday} сегодня</div>
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

      {/* Модальное окно деталей водителя */}
      <AnimatePresence>
        {isDriverModalOpen && selectedDriver && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDriverModal}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-black rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/20 max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                '--glow-color': selectedDriver.color.replace('#', ''),
                background: `radial-gradient(ellipse at center, rgba(var(--glow-color), 0.1) 0%, transparent 70%), linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`
              } as React.CSSProperties}
            >
              <div className="p-4 sm:p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="text-3xl sm:text-4xl">{selectedDriver.avatar}</div>
                    <div className="max-w-[200px] sm:max-w-none">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">{selectedDriver.name}</h2>
                      <p className="text-white/60 text-xs sm:text-sm truncate">{selectedDriver.vehicle} • {selectedDriver.terminal}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeDriverModal}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedDriver.deliveriesToday}</div>
                    <div className="text-white/60 text-xs sm:text-sm">Доставок сегодня</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedDriver.totalDeliveries}</div>
                    <div className="text-white/60 text-xs sm:text-sm">Всего доставок</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedDriver.efficiency}%</div>
                    <div className="text-white/60 text-xs sm:text-sm">Эффективность</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedDriver.earningsToday}</div>
                    <div className="text-white/60 text-xs sm:text-sm">Заработок сегодня</div>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-2">Текущая информация</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">Статус</h4>
                        <p className={`text-sm ${
                          statusColors[selectedDriver.status as keyof typeof statusColors]?.text
                        }`}>
                          {statusColors[selectedDriver.status as keyof typeof statusColors]?.label}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">Текущий маршрут</h4>
                        <p className="text-white text-sm">{selectedDriver.currentRoute}</p>
                      </div>
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">Местоположение</h4>
                        <p className="text-white text-sm">{selectedDriver.currentLocation}</p>
                      </div>
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">Следующий рейс</h4>
                        <p className="text-white text-sm">{selectedDriver.nextRoute}</p>
                      </div>
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">Время в пути</h4>
                        <p className="text-white text-sm">{selectedDriver.driveTime}</p>
                      </div>
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">Пробег сегодня</h4>
                        <p className="text-white text-sm">{formatDistance(parseInt(selectedDriver.distanceToday))}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-2">Информация о водителе</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">Опыт работы</h4>
                        <p className="text-white text-sm">{selectedDriver.experience}</p>
                      </div>
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">Категория прав</h4>
                        <p className="text-white text-sm">{selectedDriver.license}</p>
                      </div>
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">Рейтинг</h4>
                        <DriverRating rating={selectedDriver.rating} size="sm" showValue={true} />
                      </div>
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">Нарушения</h4>
                        <p className={`text-sm ${selectedDriver.violations === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                          {selectedDriver.violations} за последний месяц
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-2">Информация о грузе</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">Тип груза</h4>
                        <p className="text-white text-sm">{selectedDriver.cargoType}</p>
                      </div>
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">Вес груза</h4>
                        <p className="text-white text-sm">{selectedDriver.cargoWeight}</p>
                      </div>
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">Расход топлива</h4>
                        <p className="text-white text-sm">{selectedDriver.fuelConsumption}</p>
                      </div>
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">ETA</h4>
                        <p className="text-white text-sm">{selectedDriver.eta}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-2">Контактная информация</h3>
                    <p className="text-white text-sm">{selectedDriver.contact}</p>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-3">Финансовая статистика</h3>
                    <div className="text-white/60 text-sm">
                      Общий заработок: {selectedDriver.totalEarnings}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-white/10 bg-white/5">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl font-medium transition-colors duration-200"
                    onClick={closeDriverModal}
                  >
                    Закрыть
                  </button>
                  <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl font-medium transition-colors duration-200 border border-white/20">
                    Назначить рейс
                  </button>
                  <button className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl font-medium transition-colors duration-200 border border-green-500/30">
                    Позвонить
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