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

// Улучшенный ParticleCard с оптимизацией для мобильных устройств
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
  cardSize?: 'small' | 'medium' | 'large';
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
  cardSize = 'medium'
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

  // Определяем размеры карточек в зависимости от размера
  const sizeClasses = {
    small: 'min-h-[180px] p-4',
    medium: 'min-h-[250px] p-5',
    large: 'min-h-[320px] p-6'
  };

  return (
    <motion.div
      ref={cardRef}
      className={`${className} ${sizeClasses[cardSize]} relative overflow-hidden cursor-pointer transition-all duration-300`}
      style={{ 
        ...style, 
        position: 'relative', 
        overflow: 'hidden',
        transformStyle: 'preserve-3d'
      }}
      whileHover={{ y: cardSize === 'small' ? -2 : -4 }}
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
    className={`bento-section grid gap-4 md:gap-6 p-4 md:p-6 max-w-7xl mx-auto select-none relative ${className}`}
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

// Данные для курьеров
const couriersData = [
  {
    id: 1,
    name: "Алексей Смирнов",
    type: "Авто-курьер",
    status: "delivering",
    rating: 4.9,
    deliveriesToday: 12,
    totalDeliveries: 1245,
    vehicle: "Hyundai Solaris",
    licensePlate: "A123BC",
    currentLocation: "ул. Ленина, 15",
    nextDelivery: "ул. Пушкина, 25",
    efficiency: 96,
    contact: "+7 (912) 345-67-89",
    earningsToday: "2,800 ₽",
    totalEarnings: "345,600 ₽",
    color: "#3B82F6",
    avatar: "🚗",
    deliveryTime: "25 мин",
    completedToday: 8
  },
  {
    id: 2,
    name: "Дмитрий Козлов",
    type: "Мото-курьер",
    status: "available",
    rating: 4.8,
    deliveriesToday: 18,
    totalDeliveries: 1890,
    vehicle: "Yamaha YBR",
    licensePlate: "B456DE",
    currentLocation: "пр. Мира, 42",
    nextDelivery: "ул. Гагарина, 7",
    efficiency: 94,
    contact: "+7 (912) 345-67-90",
    earningsToday: "3,200 ₽",
    totalEarnings: "412,300 ₽",
    color: "#10B981",
    avatar: "🏍️",
    deliveryTime: "15 мин",
    completedToday: 12
  },
  {
    id: 3,
    name: "Мария Петрова",
    type: "Пеший курьер",
    status: "delivering",
    rating: 4.9,
    deliveriesToday: 8,
    totalDeliveries: 856,
    vehicle: "Пеший",
    licensePlate: "-",
    currentLocation: "Центральный район",
    nextDelivery: "ул. Советская, 33",
    efficiency: 92,
    contact: "+7 (912) 345-67-91",
    earningsToday: "1,500 ₽",
    totalEarnings: "187,400 ₽",
    color: "#EC4899",
    avatar: "🚶‍♀️",
    deliveryTime: "40 мин",
    completedToday: 5
  },
  {
    id: 4,
    name: "Сергей Иванов",
    type: "Вело-курьер",
    status: "break",
    rating: 4.7,
    deliveriesToday: 14,
    totalDeliveries: 967,
    vehicle: "Stels Navigator",
    licensePlate: "-",
    currentLocation: "Парк Горького",
    nextDelivery: "ул. Кирова, 18",
    efficiency: 88,
    contact: "+7 (912) 345-67-92",
    earningsToday: "2,100 ₽",
    totalEarnings: "234,100 ₽",
    color: "#F59E0B",
    avatar: "🚴‍♂️",
    deliveryTime: "30 мин",
    completedToday: 9
  },
  {
    id: 5,
    name: "Екатерина Новикова",
    type: "Авто-курьер",
    status: "available",
    rating: 4.8,
    deliveriesToday: 10,
    totalDeliveries: 1123,
    vehicle: "Kia Rio",
    licensePlate: "C789FG",
    currentLocation: "ТЦ Европа",
    nextDelivery: "ул. Ленинградская, 55",
    efficiency: 95,
    contact: "+7 (912) 345-67-93",
    earningsToday: "2,400 ₽",
    totalEarnings: "298,700 ₽",
    color: "#8B5CF6",
    avatar: "🚙",
    deliveryTime: "20 мин",
    completedToday: 6
  },
  {
    id: 6,
    name: "Алексей Волков",
    type: "Мото-курьер",
    status: "offline",
    rating: 4.6,
    deliveriesToday: 6,
    totalDeliveries: 734,
    vehicle: "Honda CB",
    licensePlate: "D012GH",
    currentLocation: "Не в сети",
    nextDelivery: "Нет активных заказов",
    efficiency: 85,
    contact: "+7 (912) 345-67-94",
    earningsToday: "1,200 ₽",
    totalEarnings: "156,800 ₽",
    color: "#EF4444",
    avatar: "🏍️",
    deliveryTime: "-",
    completedToday: 4
  }
];

const courierMetrics = [
  { category: "Всего курьеров", value: "24", trend: "up", color: "#3B82F6", icon: "🚗" },
  { category: "Активных сейчас", value: "18", trend: "stable", color: "#10B981", icon: "✅" },
  { category: "Доставок сегодня", value: "245", trend: "up", color: "#F59E0B", icon: "📦" },
  { category: "Средний рейтинг", value: "4.8/5", trend: "up", color: "#8B5CF6", icon: "⭐" },
  { category: "Среднее время доставки", value: "28 мин", trend: "down", color: "#EC4899", icon: "⏱️" },
  { category: "Доход за сегодня", value: "68.4K ₽", trend: "up", color: "#06B6D4", icon: "💰" }
];

const activeDeliveries = [
  {
    id: 1,
    orderNumber: "#ORD-7845",
    courier: "Алексей Смирнов",
    from: "Ресторан Суши-Мастер",
    to: "ул. Пушкина, 25, кв. 12",
    status: "in_progress",
    estimatedTime: "15 мин",
    distance: "2.3 км",
    amount: "1,850 ₽"
  },
  {
    id: 2,
    orderNumber: "#ORD-7846",
    courier: "Мария Петрова",
    from: "Кофейня Coffee Time",
    to: "ул. Советская, 33, оф. 45",
    status: "picked_up",
    estimatedTime: "25 мин",
    distance: "1.8 км",
    amount: "650 ₽"
  },
  {
    id: 3,
    orderNumber: "#ORD-7847",
    courier: "Дмитрий Козлов",
    from: "Магазин Продукты 24/7",
    to: "ул. Гагарина, 7, кв. 89",
    status: "in_progress",
    estimatedTime: "10 мин",
    distance: "1.2 км",
    amount: "2,340 ₽"
  },
  {
    id: 4,
    orderNumber: "#ORD-7848",
    courier: "Екатерина Новикова",
    from: "Аптека Здоровье",
    to: "ул. Ленинградская, 55, кв. 23",
    status: "assigned",
    estimatedTime: "20 мин",
    distance: "3.1 км",
    amount: "1,120 ₽"
  }
];

const deliveryStats = [
  { name: "Авто-курьеры", count: 8, deliveries: 124, efficiency: 94, color: "#3B82F6" },
  { name: "Мото-курьеры", count: 6, deliveries: 156, efficiency: 92, color: "#10B981" },
  { name: "Вело-курьеры", count: 5, deliveries: 98, efficiency: 88, color: "#F59E0B" },
  { name: "Пешие курьеры", count: 5, deliveries: 67, efficiency: 85, color: "#EC4899" }
];

const performanceMetrics = [
  { name: "Время доставки", value: 28, target: 25, color: "#3B82F6" },
  { name: "Удовлетворенность", value: 96, target: 90, color: "#10B981" },
  { name: "Выполнение заказов", value: 98, target: 95, color: "#F59E0B" },
  { name: "Безопасность", value: 99, target: 95, color: "#8B5CF6" }
];

export default function CouriersManager() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedCourier, setSelectedCourier] = useState<any>(null);
  const [isCourierModalOpen, setIsCourierModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('couriers');
  const [isBodyScrollLocked, setIsBodyScrollLocked] = useState(false);

  // Блокировка прокрутки при открытии модального окна
  useEffect(() => {
    if (isCourierModalOpen) {
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
  }, [isCourierModalOpen]);

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

  const handleCourierClick = (courier: any) => {
    setSelectedCourier(courier);
    setIsCourierModalOpen(true);
  };

  const closeCourierModal = () => {
    setIsCourierModalOpen(false);
    setSelectedCourier(null);
  };

  const totalDeliveries = couriersData.reduce((sum, courier) => sum + courier.deliveriesToday, 0);
  const activeCouriers = couriersData.filter(c => c.status !== 'offline').length;

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

        /* Плавная прокрутка для всей страницы */
        html {
          scroll-behavior: smooth;
        }

        /* Анимации для загрузки */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Заголовок страницы для управления курьерами */}
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
                  🚚 Управление курьерами
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-sm sm:text-base md:text-lg mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-blue-400">24 курьера в системе</span> • <span className="text-orange-400">{totalDeliveries} доставок сегодня</span> • <span className="text-green-400">4 типа доставки</span>
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>{activeCouriers} активных курьеров</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>4.8/5 средний рейтинг</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>28 мин среднее время доставки</span>
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
                  Диспетчер курьеров
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Соколов П.М.</div>
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
            { id: 'couriers', label: 'Курьеры', icon: '🚗' },
            { id: 'deliveries', label: 'Активные доставки', icon: '📦' },
            { id: 'analytics', label: 'Аналитика', icon: '📊' },
            { id: 'performance', label: 'Производительность', icon: '⭐' }
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

        {/* Основные метрики курьеров */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {courierMetrics.map((metric, index) => (
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
            {activeTab === 'couriers' && (
              <div className="space-y-6 sm:space-y-8">
                {/* Список курьеров с измененным расположением карточек */}
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
                    {couriersData.slice(0, 2).map((courier, index) => (
                      <ParticleCard
                        key={courier.id}
                        className="card flex flex-col justify-between relative w-full max-w-full rounded-xl sm:rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
                        style={{
                          backgroundColor: 'var(--background-dark)',
                          color: 'var(--white)',
                          '--glow-x': '50%',
                          '--glow-y': '50%',
                          '--glow-intensity': '0',
                          '--glow-radius': '200px',
                          '--glow-color': courier.color.replace('#', '')
                        } as React.CSSProperties}
                        disableAnimations={shouldDisableAnimations}
                        particleCount={isMobile ? 8 : DEFAULT_PARTICLE_COUNT}
                        glowColor={courier.color.replace('#', '')}
                        enableTilt={!isMobile}
                        clickEffect={!isMobile}
                        enableMagnetism={!isMobile}
                        onCardClick={() => handleCourierClick(courier)}
                        cardSize="large"
                      >
                        <div className="card__header flex justify-between items-start gap-2 sm:gap-3 relative text-white z-10">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl sm:text-4xl">{courier.avatar}</div>
                            <div>
                              <h3 className="card__title font-semibold text-lg sm:text-xl">
                                {courier.name}
                              </h3>
                              <p className="text-white/60 text-sm">{courier.type}</p>
                            </div>
                          </div>
                          <motion.div 
                            className={`w-3 h-3 rounded-full ${
                              courier.status === 'delivering' ? 'bg-blue-400' : 
                              courier.status === 'available' ? 'bg-green-400' :
                              courier.status === 'break' ? 'bg-yellow-400' : 'bg-gray-400'
                            }`}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </div>
                        
                        <div className="card__content flex flex-col relative text-white z-10 flex-1 justify-between">
                          <div className="space-y-3 sm:space-y-4 mb-4">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="text-center p-3 bg-white/5 rounded-lg">
                                <div className="text-white font-bold text-lg">{courier.deliveriesToday}</div>
                                <div className="text-white/60 text-xs">Сегодня</div>
                              </div>
                              <div className="text-center p-3 bg-white/5 rounded-lg">
                                <div className="text-white font-bold text-lg">{courier.totalDeliveries}</div>
                                <div className="text-white/60 text-xs">Всего</div>
                              </div>
                            </div>
                            
                            <ProgressBar 
                              value={courier.efficiency} 
                              label="Эффективность" 
                              color={courier.color}
                              showLabel={true}
                              height="8px"
                            />
                            
                            <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                              <div className="text-green-400 font-bold text-sm">{courier.earningsToday}</div>
                              <div className="text-green-400/60 text-xs">Заработок сегодня</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <RatingStars rating={courier.rating} size="sm" showValue={true} />
                            <span className="text-white/60 text-sm">{courier.deliveryTime}</span>
                          </div>
                        </div>

                        {/* Background gradient */}
                        <div 
                          className="absolute inset-0 opacity-20 transition-opacity duration-300"
                          style={{
                            background: `radial-gradient(circle at center, ${courier.color}30 0%, transparent 70%)`
                          }}
                        />
                      </ParticleCard>
                    ))}
                  </div>

                  {/* Второй ряд: 4 карточки среднего размера */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {couriersData.slice(2, 6).map((courier, index) => (
                      <ParticleCard
                        key={courier.id}
                        className="card flex flex-col justify-between relative w-full max-w-full rounded-xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
                        style={{
                          backgroundColor: 'var(--background-dark)',
                          color: 'var(--white)',
                          '--glow-x': '50%',
                          '--glow-y': '50%',
                          '--glow-intensity': '0',
                          '--glow-radius': '150px',
                          '--glow-color': courier.color.replace('#', '')
                        } as React.CSSProperties}
                        disableAnimations={shouldDisableAnimations}
                        particleCount={isMobile ? 6 : 12}
                        glowColor={courier.color.replace('#', '')}
                        enableTilt={!isMobile}
                        clickEffect={!isMobile}
                        enableMagnetism={!isMobile}
                        onCardClick={() => handleCourierClick(courier)}
                        cardSize="medium"
                      >
                        <div className="card__header flex justify-between items-start gap-2 relative text-white z-10">
                          <div className="flex items-center gap-2">
                            <div className="text-2xl">{courier.avatar}</div>
                            <div>
                              <h3 className="card__title font-semibold text-base">
                                {courier.name.split(' ')[0]}
                              </h3>
                              <p className="text-white/60 text-xs">{courier.type}</p>
                            </div>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${
                            courier.status === 'delivering' ? 'bg-blue-400' : 
                            courier.status === 'available' ? 'bg-green-400' :
                            courier.status === 'break' ? 'bg-yellow-400' : 'bg-gray-400'
                          }`} />
                        </div>
                        
                        <div className="card__content flex flex-col relative text-white z-10 flex-1 justify-between mt-3">
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="text-center p-2 bg-white/5 rounded">
                                <div className="text-white font-bold">{courier.deliveriesToday}</div>
                                <div className="text-white/60">Сегодня</div>
                              </div>
                              <div className="text-center p-2 bg-white/5 rounded">
                                <div className="text-white font-bold">{courier.efficiency}%</div>
                                <div className="text-white/60">Эффект.</div>
                              </div>
                            </div>
                            
                            <div className="text-center p-2 bg-orange-500/10 rounded border border-orange-500/20">
                              <div className="text-orange-400 font-bold text-xs">{courier.earningsToday}</div>
                              <div className="text-orange-400/60 text-xs">Заработок</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <RatingStars rating={courier.rating} size="sm" showValue={false} />
                            <span className="text-white/60 text-xs">{courier.deliveryTime}</span>
                          </div>
                        </div>

                        {/* Background gradient */}
                        <div 
                          className="absolute inset-0 opacity-15 transition-opacity duration-300"
                          style={{
                            background: `radial-gradient(circle at center, ${courier.color}20 0%, transparent 70%)`
                          }}
                        />
                      </ParticleCard>
                    ))}
                  </div>
                </BentoCardGrid>
              </div>
            )}

            {activeTab === 'deliveries' && (
              <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">📦 Активные доставки</h2>
                <div className="space-y-3 sm:space-y-4">
                  {activeDeliveries.map((delivery, index) => (
                    <motion.div
                      key={delivery.id}
                      className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className={`text-2xl ${
                          delivery.status === 'in_progress' ? '🚚' :
                          delivery.status === 'picked_up' ? '📦' : '⏳'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-sm sm:text-base group-hover:text-orange-300 transition-colors">
                            {delivery.orderNumber} - {delivery.courier}
                          </div>
                          <div className="text-white/60 text-xs">
                            {delivery.from} → {delivery.to}
                          </div>
                          <div className="text-white/60 text-xs mt-1">
                            {delivery.distance} • {delivery.estimatedTime} • {delivery.amount}
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        delivery.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        delivery.status === 'picked_up' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      } border ml-3`}>
                        {delivery.status === 'in_progress' ? 'В пути' :
                         delivery.status === 'picked_up' ? 'Забран' : 'Назначен'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">📊 Статистика по типам доставки</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {deliveryStats.map((stat, index) => (
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
                          <div className="text-white font-bold text-sm">{stat.name}</div>
                          <div className="text-white/60 text-xs">{stat.count} курьеров</div>
                        </div>
                        <div className="text-white/60 text-xs">
                          {stat.deliveries} доставок
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <ProgressBar value={stat.efficiency} label="Эффективность" color={stat.color} height="6px" />
                        <div className="flex justify-between text-white text-xs">
                          <span>Средняя эффективность</span>
                          <span className="font-bold">{stat.efficiency}%</span>
                        </div>
                      </div>
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
                        <div className="flex justify-between text-white text-sm">
                          <span>{metric.name}</span>
                          <span className="font-bold">{metric.value}{metric.name === 'Время доставки' ? ' мин' : '%'}</span>
                        </div>
                        <div className="flex justify-between text-white/60 text-xs mb-1">
                          <span>Цель: {metric.target}{metric.name === 'Время доставки' ? ' мин' : '%'}</span>
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
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">⭐ Лучшие курьеры</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {couriersData
                      .sort((a, b) => b.rating - a.rating)
                      .slice(0, 5)
                      .map((courier, index) => (
                        <div key={courier.id} className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="text-lg">{courier.avatar}</div>
                            <div className="min-w-0 flex-1">
                              <div className="text-white text-xs sm:text-sm truncate">{courier.name}</div>
                              <div className="text-white/60 text-xs truncate">{courier.type}</div>
                            </div>
                          </div>
                          <div className="text-right ml-2">
                            <div className="text-white font-bold text-xs sm:text-sm">{courier.rating}/5</div>
                            <div className="text-white/60 text-xs">{courier.deliveriesToday} сегодня</div>
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

      {/* Модальное окно деталей курьера */}
      <AnimatePresence>
        {isCourierModalOpen && selectedCourier && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCourierModal}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-black rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/20 max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                '--glow-color': selectedCourier.color.replace('#', ''),
                background: `radial-gradient(ellipse at center, rgba(var(--glow-color), 0.1) 0%, transparent 70%), linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`
              } as React.CSSProperties}
            >
              <div className="p-4 sm:p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="text-3xl sm:text-4xl">{selectedCourier.avatar}</div>
                    <div className="max-w-[200px] sm:max-w-none">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">{selectedCourier.name}</h2>
                      <p className="text-white/60 text-xs sm:text-sm truncate">{selectedCourier.type} • {selectedCourier.vehicle}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeCourierModal}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedCourier.deliveriesToday}</div>
                    <div className="text-white/60 text-xs sm:text-sm">Доставок сегодня</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedCourier.totalDeliveries}</div>
                    <div className="text-white/60 text-xs sm:text-sm">Всего доставок</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedCourier.efficiency}%</div>
                    <div className="text-white/60 text-xs sm:text-sm">Эффективность</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedCourier.earningsToday}</div>
                    <div className="text-white/60 text-xs sm:text-sm">Заработок сегодня</div>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-2">Текущая информация</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">Статус</h4>
                        <p className={`text-sm ${
                          selectedCourier.status === 'delivering' ? 'text-blue-400' :
                          selectedCourier.status === 'available' ? 'text-green-400' :
                          selectedCourier.status === 'break' ? 'text-yellow-400' : 'text-gray-400'
                        }`}>
                          {selectedCourier.status === 'delivering' ? 'В процессе доставки' :
                           selectedCourier.status === 'available' ? 'Доступен' :
                           selectedCourier.status === 'break' ? 'На перерыве' : 'Не в сети'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">Текущее местоположение</h4>
                        <p className="text-white text-sm">{selectedCourier.currentLocation}</p>
                      </div>
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">Следующая доставка</h4>
                        <p className="text-white text-sm">{selectedCourier.nextDelivery}</p>
                      </div>
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">Время доставки</h4>
                        <p className="text-white text-sm">{selectedCourier.deliveryTime}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-2">Информация о транспорте</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">Тип транспорта</h4>
                        <p className="text-white text-sm">{selectedCourier.vehicle}</p>
                      </div>
                      <div>
                        <h4 className="text-white/60 text-xs mb-1">Номерной знак</h4>
                        <p className="text-white text-sm">{selectedCourier.licensePlate}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-2">Контактная информация</h3>
                    <p className="text-white text-sm">{selectedCourier.contact}</p>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-3">Рейтинг и статистика</h3>
                    <div className="flex items-center justify-between">
                      <RatingStars rating={selectedCourier.rating} size="md" showValue={true} />
                      <span className="text-white/60 text-sm">{selectedCourier.completedToday} выполнено сегодня</span>
                    </div>
                    <div className="mt-2 text-white/60 text-sm">
                      Общий заработок: {selectedCourier.totalEarnings}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-white/10 bg-white/5">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl font-medium transition-colors duration-200"
                    onClick={closeCourierModal}
                  >
                    Закрыть
                  </button>
                  <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl font-medium transition-colors duration-200 border border-white/20">
                    Назначить доставку
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