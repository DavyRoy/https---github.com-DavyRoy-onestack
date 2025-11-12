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

// Улучшенный ParticleCard с расширенной анимацией
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

      // Анимация градиентного свечения
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

      // Убираем свечение
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

      // Обновляем позицию свечения
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

// Улучшенный компонент для круговой диаграммы
const PieChart = ({ 
  data, 
  className = '',
  size = 120
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
            <circle
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
              style={{
                filter: `drop-shadow(0 0 4px ${item.color.replace('rgba', '').replace(')', ', 0.4)')})`
              }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center transform rotate-90">
          <div className="text-white font-bold text-lg">{total}%</div>
          <div className="text-white/60 text-xs">Всего</div>
        </div>
      </div>
    </div>
  );
};

// Улучшенный компонент для столбчатой диаграммы
const BarChart = ({ 
  data, 
  className = '',
  height = 160 
}: { 
  data: { label: string; value: number; color: string }[]; 
  className?: string;
  height?: number;
}) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className={`flex items-end justify-between gap-3 ${className}`} style={{ height: `${height}px` }}>
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1 group">
          <motion.div 
            className="w-full rounded-t-lg transition-all duration-700 ease-out relative overflow-hidden"
            style={{ 
              height: `${(item.value / maxValue) * 100}%`,
              background: item.color
            }}
            initial={{ height: 0 }}
            animate={{ height: `${(item.value / maxValue) * 100}%` }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 text-center">
              <div className="text-white font-bold text-sm bg-black/30 backdrop-blur-sm py-1">
                {formatCurrency(item.value)}
              </div>
            </div>
          </motion.div>
          <div className="text-white/60 text-xs mt-2 text-center group-hover:text-white transition-colors">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

// Компонент для линейного графика
const LineChart = ({ 
  data, 
  className = '',
  color = COLORS.blue,
  height = 80
}: { 
  data: number[]; 
  className?: string;
  color?: string;
  height?: number;
}) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  
  return (
    <div className={`relative ${className}`} style={{ height: `${height}px` }}>
      <svg viewBox={`0 0 100 ${height}`} className="w-full h-full">
        {/* Background grid */}
        {[25, 50, 75].map((position) => (
          <line
            key={position}
            x1="0"
            y1={height * (position / 100)}
            x2="100"
            y2={height * (position / 100)}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
        ))}
        
        {/* Main line */}
        <polyline
          fill="none"
          stroke={`rgba(${color}, 0.8)`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={data.map((value, i) => 
            `${(i / (data.length - 1)) * 100},${height - ((value - minValue) / range) * (height - 10)}`
          ).join(' ')}
        />
        
        {/* Area under line */}
        <polygon
          fill={`rgba(${color}, 0.1)`}
          points={`
            0,${height} 
            ${data.map((value, i) => 
              `${(i / (data.length - 1)) * 100},${height - ((value - minValue) / range) * (height - 10)}`
            ).join(' ')}
            100,${height}
          `}
        />
        
        {/* Dots */}
        {data.map((value, i) => (
          <circle
            key={i}
            cx={(i / (data.length - 1)) * 100}
            cy={height - ((value - minValue) / range) * (height - 10)}
            r="3"
            fill={`rgb(${color})`}
            className="transition-all duration-300"
          />
        ))}
      </svg>
    </div>
  );
};

// Данные для диаграмм
const departmentDistribution = [
  { name: "Соцработники", value: 45, color: `rgba(${COLORS.blue}, 0.8)` },
  { name: "Психологи", value: 18, color: `rgba(${COLORS.purple}, 0.8)` },
  { name: "Юристы", value: 8, color: `rgba(${COLORS.emerald}, 0.8)` },
  { name: "Медработники", value: 12, color: `rgba(${COLORS.rose}, 0.8)` },
  { name: "Администрация", value: 6, color: `rgba(${COLORS.amber}, 0.8)` }
];

const budgetAllocation = [
  { label: "Зарплаты", value: 2000000, color: `linear-gradient(to top, rgba(${COLORS.blue}, 0.8), rgba(${COLORS.blue}, 0.4))` },
  { label: "Аренда", value: 540000, color: `linear-gradient(to top, rgba(${COLORS.purple}, 0.8), rgba(${COLORS.purple}, 0.4))` },
  { label: "Оборудование", value: 670000, color: `linear-gradient(to top, rgba(${COLORS.emerald}, 0.8), rgba(${COLORS.emerald}, 0.4))` },
  { label: "Обучение", value: 360000, color: `linear-gradient(to top, rgba(${COLORS.amber}, 0.8), rgba(${COLORS.amber}, 0.4))` },
  { label: "Транспорт", value: 310000, color: `linear-gradient(to top, rgba(${COLORS.rose}, 0.8), rgba(${COLORS.rose}, 0.4))` }
];

const growthData = [65, 72, 79, 83, 87, 85, 87, 90, 92, 94];

// Расширенные данные организации
const organizationCards = [
  {
    id: 'clients',
    title: "👥 Клиентская база",
    description: "1,245 человек • Полный охват целевой аудитории",
    label: "+45 за месяц",
    value: "1,245",
    metric: "Всего клиентов",
    color: "#060010",
    glowColor: COLORS.blue,
    stats: [
      { label: "Активных", value: "892", trend: "up" },
      { label: "Льготников", value: "567", trend: "stable" },
      { label: "Удовлетворены", value: "94%", trend: "up" }
    ],
    details: {
      monthlyGrowth: 3.8,
      retentionRate: 92,
      newClients: 45
    }
  },
  {
    id: 'team',
    title: "👨‍💼 Команда специалистов",
    description: "89 профессионалов • Высокая квалификация",
    label: "94% занятость",
    value: "89",
    metric: "Сотрудников",
    color: "#060010",
    glowColor: COLORS.emerald,
    stats: [
      { label: "Соцработники", value: "45", trend: "stable" },
      { label: "Психологи", value: "18", trend: "up" },
      { label: "Эффективность", value: "87%", trend: "up" }
    ],
    details: {
      experience: "5.2 года",
      turnover: 8,
      training: "23 курса"
    }
  },
  {
    id: 'finance',
    title: "💰 Финансовое управление",
    description: "Годовой бюджет 4.5 млн ₽ • Стабильное развитие",
    label: "82% исполнено",
    value: "4.5M ₽",
    metric: "Годовой бюджет",
    color: "#060010",
    glowColor: COLORS.amber,
    stats: [
      { label: "Доходы", value: "3.7M", trend: "up" },
      { label: "Расходы", value: "3.1M", trend: "stable" },
      { label: "Рентабельность", value: "16%", trend: "up" }
    ],
    details: {
      profit: 600000,
      growth: 18,
      efficiency: 87
    }
  },
  {
    id: 'quality',
    title: "⭐ Качество услуг",
    description: "Постоянный мониторинг и улучшение услуг",
    label: "94% удовлетворенность",
    value: "4.8/5",
    metric: "Рейтинг услуг",
    color: "#060010",
    glowColor: COLORS.violet,
    stats: [
      { label: "Оценок", value: "1,247", trend: "up" },
      { label: "Жалоб", value: "8", trend: "down" },
      { label: "Улучшений", value: "23", trend: "up" }
    ],
    details: {
      responseTime: "2.3 часа",
      resolutionRate: 96,
      improvements: 15
    }
  },
  {
    id: 'structure',
    title: "🏛️ Структура организации",
    description: "3 филиала • Сеть покрытия города",
    label: "105 сотрудников",
    value: "3",
    metric: "Филиала",
    color: "#060010",
    glowColor: COLORS.rose,
    stats: [
      { label: "Филиалы", value: "3", trend: "up" },
      { label: "Отделы", value: "12", trend: "stable" },
      { label: "Лет работы", value: "12", trend: "up" }
    ],
    details: {
      coverage: "85% города",
      capacity: 1500,
      expansion: "2025 Q2"
    }
  },
  {
    id: 'partners',
    title: "🤝 Партнерские отношения",
    description: "15 партнеров • Активные collaboration",
    label: "8 проектов",
    value: "15",
    metric: "Партнеров",
    color: "#060010",
    glowColor: COLORS.cyan,
    stats: [
      { label: "Успешных проектов", value: "87%", trend: "up" },
      { label: "Рост партнерств", value: "+23%", trend: "up" },
      { label: "Бюджет", value: "4.2M ₽", trend: "stable" }
    ],
    details: {
      successfulProjects: 34,
      partnerSatisfaction: 91,
      futureProjects: 5
    }
  }
];

const branches = [
  {
    name: "Центральный филиал",
    address: "ул. Центральная, 15",
    employees: 45,
    departments: 5,
    rating: 4.9,
    status: "active" as const,
    capacity: 500
  },
  {
    name: "Северный филиал",
    address: "пр. Северный, 28",
    employees: 32,
    departments: 4,
    rating: 4.7,
    status: "active" as const,
    capacity: 350
  },
  {
    name: "Южный филиал",
    address: "ул. Южная, 42",
    employees: 28,
    departments: 3,
    rating: 4.8,
    status: "active" as const,
    capacity: 300
  }
];

const achievements = [
  {
    title: "Лучшая социальная организация 2024",
    issuer: "Минтруд РФ",
    date: "2024",
    type: "award" as const,
    significance: "high" as const
  },
  {
    title: "Инновации в социальной работе",
    issuer: "Фонд развития",
    date: "2023",
    type: "grant" as const,
    significance: "medium" as const,
    amount: 1200000
  },
  {
    title: "Высокая удовлетворенность клиентов",
    issuer: "Рейтинг качества",
    date: "2024",
    type: "recognition" as const,
    significance: "high" as const,
    metric: "94% положительных отзывов"
  }
];

export default function OrganizationOverview() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleCardClick = (cardId: string) => {
    setSelectedCard(cardId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const selectedCardData = organizationCards.find(card => card.id === selectedCard);

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
      `}</style>

      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/demo/social/admin" className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group">
                <motion.span
                  whileHover={{ x: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  ←
                </motion.span>
                <span>Назад к дашборду</span>
              </Link>
              <div className="text-white/60 text-sm text-right">
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
              <span className="text-white text-sm">Онлайн • Все системы активны</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Заголовок страницы с улучшенным дизайном */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <motion.h1 
                  className="text-4xl font-bold text-white mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  🏢 Обзор организации
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-lg mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Центр социальной помощи "Забота" • <span className="text-emerald-400">12 лет</span> на рынке • Полная аналитика и управление
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>3 филиала</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>89 сотрудников</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>1,245 клиентов</span>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="text-right"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-white font-bold text-2xl bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl px-6 py-3 shadow-lg">
                  Активна
                </div>
                <div className="text-white/60 text-sm mt-2">Статус организации</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сегодня</div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 rounded-full blur-lg" />
          </div>
        </motion.section>

        {/* Основные метрики с анимациями */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "👥", value: "1,245", label: "Всего клиентов", change: "+45", changeColor: "text-green-400", glow: COLORS.blue },
              { icon: "👨‍💼", value: "89", label: "Сотрудников", change: "94% занятость", changeColor: "text-blue-400", glow: COLORS.emerald },
              { icon: "💰", value: "4.5M ₽", label: "Годовой бюджет", change: "82% исполнено", changeColor: "text-emerald-400", glow: COLORS.amber },
              { icon: "⭐", value: "4.8/5", label: "Рейтинг услуг", change: "94% удовлетворенность", changeColor: "text-amber-400", glow: COLORS.violet }
            ].map((metric, index) => (
              <motion.div
                key={index}
                className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 text-center"
                style={{ '--glow-color': metric.glow } as React.CSSProperties}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3 }}
                whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
              >
                <motion.div 
                  className="text-3xl mb-3"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {metric.icon}
                </motion.div>
                <div className="text-white font-bold text-2xl mb-2">{metric.value}</div>
                <div className="text-white/60 mb-2">{metric.label}</div>
                <div className={`text-sm ${metric.changeColor}`}>{metric.change}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Bento Grid с улучшенными анимациями */}
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={true}
          spotlightRadius={DEFAULT_SPOTLIGHT_RADIUS}
          glowColor={DEFAULT_GLOW_COLOR}
        />

        <BentoCardGrid gridRef={gridRef} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizationCards.map((card, index) => {
              const baseClassName = `card flex flex-col justify-between relative aspect-[4/3] min-h-[300px] w-full max-w-full p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow`;

              const cardStyle = {
                backgroundColor: card.color || 'var(--background-dark)',
                borderColor: 'var(--border-color)',
                color: 'var(--white)',
                '--glow-x': '50%',
                '--glow-y': '50%',
                '--glow-intensity': '0',
                '--glow-radius': '200px',
                '--glow-color': card.glowColor
              } as React.CSSProperties;

              return (
                <ParticleCard
                  key={card.id}
                  className={baseClassName}
                  style={cardStyle}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={DEFAULT_PARTICLE_COUNT}
                  glowColor={card.glowColor}
                  enableTilt={true}
                  clickEffect={true}
                  enableMagnetism={true}
                  onCardClick={() => handleCardClick(card.id)}
                >
                  <div className="card__header flex justify-between items-start gap-3 relative text-white z-10">
                    <span 
                      className="card__label text-xs bg-white/10 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm"
                      style={{ color: `rgb(${card.glowColor})` }}
                    >
                      {card.label}
                    </span>
                  </div>
                  
                  <div className="card__content flex flex-col relative text-white z-10 flex-1">
                    <h3 className="card__title font-semibold text-xl mb-3">
                      {card.title}
                    </h3>
                    <p className="card__description text-white/70 text-sm leading-5 mb-4 flex-1">
                      {card.description}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {card.stats.map((stat, statIndex) => (
                        <motion.div 
                          key={statIndex} 
                          className="text-center p-2 bg-white/5 rounded-lg backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <div className="text-white font-bold text-sm">{stat.value}</div>
                          <div className="text-white/60 text-xs">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-auto">
                      <div className="text-2xl font-bold text-white mb-1">
                        {card.value}
                      </div>
                      <div className="text-white/60 text-sm">
                        {card.metric}
                      </div>
                    </div>
                  </div>

                  {/* Background gradient */}
                  <div 
                    className="absolute inset-0 opacity-20 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at center, rgba(${card.glowColor}, 0.3) 0%, transparent 70%)`
                    }}
                  />
                </ParticleCard>
              );
            })}
          </div>
        </BentoCardGrid>

        {/* Детальная аналитика с улучшенной визуализацией */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Структура организации */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">🏛️ Структура организации</h2>
                <div className="text-right">
                  <div className="text-white font-bold text-lg">89</div>
                  <div className="text-white/60 text-sm">сотрудников</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-white font-bold text-2xl">3 филиала</div>
                  <div className="text-white/60">Сеть покрытия города</div>
                </div>
                <PieChart data={departmentDistribution} size={100} />
              </div>
              
              <div className="space-y-3">
                {departmentDistribution.map((dept, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors group"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full transition-transform group-hover:scale-125"
                        style={{ backgroundColor: dept.color }}
                      />
                      <span className="text-white">{dept.name}</span>
                    </div>
                    <div className="text-white font-bold">{dept.value} чел.</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Бюджет и финансы */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">💰 Распределение бюджета</h2>
                <div className="text-right">
                  <div className="text-white font-bold text-lg">4.5 млн ₽</div>
                  <div className="text-white/60 text-sm">Годовой бюджет</div>
                </div>
              </div>
              
              <BarChart data={budgetAllocation} height={180} />
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="text-green-400 font-bold text-lg">+18%</div>
                  <div className="text-white/60 text-sm">Рост доходов</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="text-blue-400 font-bold text-lg">87%</div>
                  <div className="text-white/60 text-sm">Эффективность</div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Динамика роста */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">📈 Динамика роста организации</h2>
            <LineChart data={growthData} height={120} color={COLORS.emerald} />
            <div className="flex justify-between mt-4 text-sm text-white/60">
              <span>Янв 2023</span>
              <span>Окт 2024</span>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-green-400 font-bold text-lg">+45%</div>
                <div className="text-white/60 text-sm">Рост клиентов</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-blue-400 font-bold text-lg">+28%</div>
                <div className="text-white/60 text-sm">Рост команды</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-purple-400 font-bold text-lg">+62%</div>
                <div className="text-white/60 text-sm">Рост услуг</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-amber-400 font-bold text-lg">4.8★</div>
                <div className="text-white/60 text-sm">Качество</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Дополнительная информация с улучшенным дизайном */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Филиалы */}
            <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📍</span>
                <span>Филиалы сети</span>
              </h3>
              <div className="space-y-4">
                {branches.map((branch, index) => (
                  <motion.div 
                    key={index}
                    className="p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors group"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-white font-bold">{branch.name}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        branch.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {branch.status === 'active' ? 'Активен' : 'Неактивен'}
                      </div>
                    </div>
                    <div className="text-white/60 text-sm mb-2">{branch.address}</div>
                    <div className="flex justify-between text-xs text-white/40">
                      <span>{branch.employees} сотрудников</span>
                      <span>⭐ {branch.rating}/5</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Партнеры */}
            <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>🤝</span>
                <span>Партнерские отношения</span>
              </h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-white">Всего партнеров</span>
                  <span className="text-white font-bold">15</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-white">Активных проектов</span>
                  <span className="text-white font-bold">8</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-white">Бюджет партнерств</span>
                  <span className="text-white font-bold">4.2M ₽</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-white">Успешных проектов</span>
                  <span className="text-green-400 font-bold">87%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-blue-400 text-sm font-semibold">🎯 Министерство труда</div>
                  <div className="text-blue-400/60 text-xs">3 совместных проекта</div>
                </div>
                <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="text-green-400 text-sm font-semibold">🏥 Местные больницы</div>
                  <div className="text-green-400/60 text-xs">Медицинское партнерство</div>
                </div>
              </div>
            </div>

            {/* Достижения */}
            <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>🏆</span>
                <span>Достижения и награды</span>
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div 
                    key={index}
                    className={`p-3 rounded-lg border backdrop-blur-sm ${
                      achievement.significance === 'high' 
                        ? 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/20' 
                        : 'bg-white/5 border-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className={`font-bold text-sm ${
                      achievement.significance === 'high' ? 'text-amber-400' : 'text-white'
                    }`}>
                      {achievement.title}
                    </div>
                    <div className="text-white/60 text-xs mt-1">{achievement.issuer} • {achievement.date}</div>
                    {achievement.amount && (
                      <div className="text-green-400 text-xs mt-1">Грант: {formatCurrency(achievement.amount)}</div>
                    )}
                    {achievement.metric && (
                      <div className="text-blue-400 text-xs mt-1">{achievement.metric}</div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-white font-bold text-lg">12</div>
                  <div className="text-white/60 text-xs">Лет работы</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-white font-bold text-lg">500+</div>
                  <div className="text-white/60 text-xs">Клиентов в день</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Модальное окно для деталей карточки */}
      <AnimatePresence>
        {isModalOpen && selectedCardData && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/20 max-w-2xl w-full max-h-[80vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                '--glow-color': selectedCardData.glowColor,
                background: `radial-gradient(ellipse at center, rgba(var(--glow-color), 0.1) 0%, transparent 70%), linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`
              } as React.CSSProperties}
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{selectedCardData.title}</h2>
                  <button
                    onClick={closeModal}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-white/60 mt-2">{selectedCardData.description}</p>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-3xl font-bold text-white mb-2">{selectedCardData.value}</div>
                    <div className="text-white/60">{selectedCardData.metric}</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-xl font-bold text-white mb-2" style={{ color: `rgb(${selectedCardData.glowColor})` }}>
                      {selectedCardData.label}
                    </div>
                    <div className="text-white/60">Текущий статус</div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-4">Детальная информация</h3>
                <div className="space-y-3">
                  {Object.entries(selectedCardData.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-white/80 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-white font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer 
        className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-white/60 text-sm">
            <div className="flex items-center gap-4">
              <span>© 2024 Центр социальной помощи "Забота"</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Версия 2.1.0</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Обновлено: {new Date().toLocaleDateString('ru-RU')}</span>
              <span>•</span>
              <span>Все системы активны</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}