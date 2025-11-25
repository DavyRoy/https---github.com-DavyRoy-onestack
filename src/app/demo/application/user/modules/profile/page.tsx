'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

// ========== КОНСТАНТЫ И ТИПЫ ==========

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

const BREAKPOINTS = {
  mobile: 393,
  tablet: 768,
  desktop: 1024,
  large: 1280,
  xlarge: 1536
} as const;

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 350;
const DEFAULT_GLOW_COLOR = '99, 102, 241';

// Типы данных для пользователя
interface ProfileMetric {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  description: string;
  icon: string;
  color: string;
  progress?: number;
}

interface RecentActivity {
  id: string;
  type: 'request' | 'service' | 'payment' | 'notification';
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'in_progress' | 'cancelled';
  icon: string;
  priority?: 'high' | 'medium' | 'low';
}

interface ServiceStatus {
  service: string;
  status: 'active' | 'pending' | 'completed' | 'rejected';
  lastUpdate: string;
  progress?: number;
  icon: string;
  color: string;
  nextStep?: string;
}

// ========== УТИЛИТЫ И ХУКИ ==========

const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: windowSize.width < BREAKPOINTS.tablet,
    isTablet: windowSize.width >= BREAKPOINTS.tablet && windowSize.width < BREAKPOINTS.desktop,
    isDesktop: windowSize.width >= BREAKPOINTS.desktop,
    isLarge: windowSize.width >= BREAKPOINTS.large,
    windowSize
  };
};

const useScrollLock = () => {
  const lockScroll = useCallback(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '0px';
  }, []);

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = 'unset';
    document.body.style.paddingRight = '0px';
  }, []);

  return { lockScroll, unlockScroll };
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR): HTMLDivElement => {
  const element = document.createElement('div');
  element.className = 'advanced-particle';
  element.style.cssText = `
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(${color}, 1) 0%, rgba(${color}, 0.3) 70%);
    box-shadow: 0 0 15px rgba(${color}, 0.9), 0 0 30px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
    filter: blur(0.8px);
  `;
  return element;
};

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

// ========== КОМПОНЕНТЫ АНИМАЦИЙ ==========

const AdvancedParticleCard: React.FC<{
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
  intensity?: number;
}> = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = true,
  enableMagnetism = false,
  onCardClick,
  intensity = 1
}) => {
  const cardReference = useRef<HTMLDivElement>(null);
  const particlesReference = useRef<HTMLDivElement[]>([]);
  const timeoutsReference = useRef<NodeJS.Timeout[]>([]);
  const isHoveredReference = useRef(false);
  const magnetismAnimationReference = useRef<gsap.core.Tween | null>(null);
  const { isMobile } = useResponsive();

  const effectiveDisableAnimations = disableAnimations || isMobile;
  const effectiveEnableTilt = enableTilt && !isMobile;
  const effectiveEnableMagnetism = enableMagnetism && !isMobile;

  const clearAllParticles = useCallback(() => {
    timeoutsReference.current.forEach(clearTimeout);
    timeoutsReference.current = [];
    magnetismAnimationReference.current?.kill();

    particlesReference.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          particle.remove();
        }
      });
    });
    particlesReference.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardReference.current || !isHoveredReference.current) return;

    const rect = cardReference.current.getBoundingClientRect();
    
    for (let i = 0; i < particleCount; i++) {
      const timeoutId = setTimeout(() => {
        if (!isHoveredReference.current || !cardReference.current) return;

        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        const particle = createParticleElement(x, y, glowColor);
        cardReference.current.appendChild(particle);
        particlesReference.current.push(particle);

        gsap.fromTo(particle, 
          { 
            scale: 0, 
            opacity: 0,
            x: 0,
            y: 0,
            rotation: 0
          }, 
          { 
            scale: 1.2, 
            opacity: 1, 
            duration: 0.6,
            ease: 'back.out(2)'
          }
        );

        const timeline = gsap.timeline();
        timeline.to(particle, {
          x: `+=${(Math.random() - 0.5) * 120 * intensity}`,
          y: `+=${(Math.random() - 0.5) * 120 * intensity}`,
          rotation: 720,
          duration: 4 + Math.random() * 3,
          ease: 'sine.inOut'
        })
        .to(particle, {
          opacity: 0.4,
          scale: 0.9,
          duration: 1.5,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1
        }, 0);

        setTimeout(() => {
          if (particle.parentNode) {
            gsap.to(particle, {
              opacity: 0,
              scale: 0,
              duration: 0.6,
              onComplete: () => particle.remove()
            });
          }
        }, 4000 + Math.random() * 3000);

      }, i * 100);

      timeoutsReference.current.push(timeoutId);
    }
  }, [particleCount, glowColor, intensity]);

  useEffect(() => {
    if (effectiveDisableAnimations || !cardReference.current) return;

    const element = cardReference.current;

    const handleMouseEnter = () => {
      isHoveredReference.current = true;
      animateParticles();

      if (effectiveEnableTilt) {
        gsap.to(element, {
          rotateX: 4,
          rotateY: 4,
          scale: 1.03,
          duration: 0.5,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      gsap.to(element, {
        '--glow-intensity': 1,
        duration: 0.4,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      isHoveredReference.current = false;
      clearAllParticles();

      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      });

      if (effectiveEnableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      }

      gsap.to(element, {
        '--glow-intensity': 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!effectiveEnableTilt && !effectiveEnableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (effectiveEnableTilt) {
        const rotateX = ((y - centerY) / centerY) * -8 * intensity;
        const rotateY = ((x - centerX) / centerX) * 8 * intensity;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.15,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      if (effectiveEnableMagnetism) {
        const magnetX = (x - centerX) * 0.04 * intensity;
        const magnetY = (y - centerY) * 0.04 * intensity;

        if (magnetismAnimationReference.current) {
          magnetismAnimationReference.current.kill();
        }
        
        magnetismAnimationReference.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.6,
          ease: 'power2.out'
        });
      }

      element.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
      element.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
    };

    const handleClick = (event: MouseEvent) => {
      if (clickEffect) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: absolute;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, 
            rgba(${glowColor}, 0.8) 0%, 
            rgba(${glowColor}, 0.4) 40%, 
            rgba(${glowColor}, 0.2) 60%,
            transparent 80%
          );
          left: ${x - 60}px;
          top: ${y - 60}px;
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
            scale: 5,
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
      isHoveredReference.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [effectiveDisableAnimations, effectiveEnableTilt, effectiveEnableMagnetism, clickEffect, glowColor, onCardClick, animateParticles, clearAllParticles, intensity]);

  return (
    <motion.div
      ref={cardReference}
      className={`advanced-particle-card ${className}`}
      style={{
        ...style,
        position: 'relative',
        overflow: 'hidden',
        transformStyle: 'preserve-3d'
      }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {children}
    </motion.div>
  );
};

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
  const spotlightReference = useRef<HTMLDivElement | null>(null);
  const isInsideSectionReference = useRef(false);
  const { isMobile } = useResponsive();

  const effectiveDisableAnimations = disableAnimations || isMobile;

  useEffect(() => {
    if (effectiveDisableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: ${spotlightRadius * 2}px;
      height: ${spotlightRadius * 2}px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.25) 0%,
        rgba(${glowColor}, 0.15) 15%,
        rgba(${glowColor}, 0.08) 25%,
        rgba(${glowColor}, 0.04) 40%,
        rgba(${glowColor}, 0.02) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
      filter: blur(25px);
      transition: opacity 0.4s ease;
    `;
    document.body.appendChild(spotlight);
    spotlightReference.current = spotlight;

    const handleMouseMove = (event: MouseEvent) => {
      if (!spotlightReference.current || !gridRef.current) return;

      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect && event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;

      isInsideSectionReference.current = mouseInside || false;
      const cards = gridRef.current.querySelectorAll('.card');

      if (!mouseInside) {
        gsap.to(spotlightReference.current, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out'
        });
        cards.forEach(card => {
          (card as HTMLElement).style.setProperty('--glow-intensity', '0');
        });
        return;
      }

      const proximity = spotlightRadius * 0.4;
      const fadeDistance = spotlightRadius * 0.7;
      let minDistance = Infinity;

      cards.forEach(card => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(event.clientX - centerX, event.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(cardElement, event.clientX, event.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightReference.current, {
        left: event.clientX,
        top: event.clientY,
        duration: 0.15,
        ease: 'power2.out'
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.9
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.9
            : 0;

      gsap.to(spotlightReference.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.25 : 0.6,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      isInsideSectionReference.current = false;
      gridRef.current?.querySelectorAll('.card').forEach(card => {
        (card as HTMLElement).style.setProperty('--glow-intensity', '0');
      });
      if (spotlightReference.current) {
        gsap.to(spotlightReference.current, {
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
      spotlightReference.current?.remove();
    };
  }, [gridRef, effectiveDisableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid: React.FC<{
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    large?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}> = ({ 
  children, 
  gridRef, 
  className = '',
  columns = { mobile: 1, tablet: 2, desktop: 3, large: 4 },
  gap = 'md'
}) => {
  const gapClasses = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-3 sm:gap-4 lg:gap-5',
    lg: 'gap-4 sm:gap-5 lg:gap-6'
  };

  const gridClass = `
    grid 
    grid-cols-${columns.mobile}
    sm:grid-cols-${columns.tablet}
    lg:grid-cols-${columns.desktop}
    xl:grid-cols-${columns.large}
    ${gapClasses[gap]}
    ${className}
  `;

  return (
    <motion.div
      className={`bento-section ${gridClass} p-3 sm:p-4 lg:p-5 max-w-7xl 2xl:max-w-[1800px] mx-auto select-none relative`}
      ref={gridRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

// ========== МОДАЛЬНЫЕ ОКНА ==========

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const modalReference = useRef<HTMLDivElement>(null);
  const { isMobile } = useResponsive();
  const { lockScroll, unlockScroll } = useScrollLock();

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  const responsiveSize = isMobile ? 'sm' : size;

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      lockScroll();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      unlockScroll();
    };
  }, [isOpen, onClose, lockScroll, unlockScroll]);

  useEffect(() => {
    if (isOpen && modalReference.current) {
      gsap.fromTo(modalReference.current, 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={modalReference}
        className={`bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/20 shadow-2xl w-full ${sizeClasses[responsiveSize]} max-h-[95vh] overflow-hidden`}
        onClick={(event) => event.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
          <h2 className="text-lg sm:text-xl font-bold text-white truncate pr-2">{title}</h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-white/10 rounded-xl transition-colors duration-200 text-white/60 hover:text-white"
            aria-label="Закрыть"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)] custom-scrollbar">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ========== УЛУЧШЕННЫЕ МОКИ ДАННЫХ ==========

const profileData = {
  name: 'Иванова Мария Петровна',
  role: 'Пользователь социальных услуг',
  email: 'maria.ivanova@example.ru',
  phone: '+7 (912) 345-67-89',
  address: 'Москва, ул. Примерная, д. 123, кв. 45',
  avatar: '👩',
  joinDate: '15 января 2024',
  status: 'active',
  bio: 'Получаю социальные услуги по программе поддержки. Заинтересована в услугах доставки продуктов и медицинской помощи. Активно участвую в социальных программах поддержки.',
  category: 'Пенсионер',
  benefits: ['Доставка продуктов', 'Медицинская помощь', 'Социальное сопровождение', 'Юридические консультации'],
  documents: ['Паспорт', 'СНИЛС', 'Полис ОМС', 'Справка об инвалидности']
};

const profileMetrics: ProfileMetric[] = [
  { 
    label: "Активных заявок", 
    value: 3, 
    change: 1, 
    trend: 'up', 
    description: "На рассмотрении", 
    icon: "📥", 
    color: COLORS.blue,
    progress: 60
  },
  { 
    label: "Получено услуг", 
    value: 12, 
    change: 15, 
    trend: 'up', 
    description: "За последний месяц", 
    icon: "✅", 
    color: COLORS.success,
    progress: 80
  },
  { 
    label: "Обращений в поддержку", 
    value: 2, 
    change: -1, 
    trend: 'down', 
    description: "За все время", 
    icon: "💬", 
    color: COLORS.purple
  },
  { 
    label: "Удовлетворенность", 
    value: 4.7, 
    change: 2, 
    trend: 'up', 
    description: "Средняя оценка услуг", 
    icon: "⭐", 
    color: COLORS.orange
  },
  { 
    label: "Дней в системе", 
    value: 58, 
    change: 1, 
    trend: 'up', 
    description: "С момента регистрации", 
    icon: "📅", 
    color: COLORS.cyan
  },
  { 
    label: "Бонусных баллов", 
    value: 245, 
    change: 15, 
    trend: 'up', 
    description: "Накоплено за услуги", 
    icon: "🎁", 
    color: COLORS.emerald,
    progress: 65
  },
];

const recentActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'request',
    title: 'Заявка на доставку продуктов',
    description: 'Ожидает подтверждения куратора. Список продуктов: хлеб, молоко, крупы, фрукты.',
    date: 'Сегодня, 10:30',
    status: 'pending',
    icon: '🛒',
    priority: 'high'
  },
  {
    id: '2',
    type: 'service',
    title: 'Медицинская консультация',
    description: 'Запись на 15 марта завершена. Терапевт - доктор Петров И.С.',
    date: 'Вчера, 14:20',
    status: 'completed',
    icon: '🏥',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'payment',
    title: 'Компенсация расходов',
    description: 'Оплата произведена успешно. Сумма: 2,500 руб. Зачисление в течение 3 дней.',
    date: '15.03.2024',
    status: 'completed',
    icon: '💰'
  },
  {
    id: '4',
    type: 'notification',
    title: 'Новое уведомление',
    description: 'Изменение в расписании услуг. Перенос визита социального работника на 18 марта.',
    date: '14.03.2024',
    status: 'in_progress',
    icon: '📢',
    priority: 'medium'
  },
  {
    id: '5',
    type: 'service',
    title: 'Социальное сопровождение',
    description: 'Запланирован визит куратора для оценки текущих потребностей.',
    date: '13.03.2024',
    status: 'in_progress',
    icon: '👥',
    priority: 'low'
  }
];

const serviceStatuses: ServiceStatus[] = [
  {
    service: 'Доставка продуктов',
    status: 'active',
    lastUpdate: 'Обновлено сегодня',
    progress: 75,
    icon: '🛒',
    color: COLORS.success,
    nextStep: 'Доставка завтра в 10:00'
  },
  {
    service: 'Медицинская помощь',
    status: 'pending',
    lastUpdate: 'Ожидает подтверждения',
    progress: 30,
    icon: '🏥',
    color: COLORS.warning,
    nextStep: 'Подтверждение даты'
  },
  {
    service: 'Социальное сопровождение',
    status: 'completed',
    lastUpdate: 'Завершено 12.03.2024',
    icon: '👥',
    color: COLORS.info
  },
  {
    service: 'Юридическая консультация',
    status: 'active',
    lastUpdate: 'Активно до 20.03.2024',
    progress: 50,
    icon: '⚖️',
    color: COLORS.purple,
    nextStep: 'Следующая встреча 18.03'
  },
  {
    service: 'Психологическая поддержка',
    status: 'active',
    lastUpdate: 'Регулярные сессии',
    progress: 90,
    icon: '🧠',
    color: COLORS.pink,
    nextStep: 'Следующая сессия 17.03'
  }
];

// ========== УЛУЧШЕННЫЕ ВИДЖЕТЫ ПРОФИЛЯ ==========

function ProfileHeader() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profileData);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const { isMobile, isTablet } = useResponsive();

  const handleSave = () => {
    setIsEditing(false);
    // Здесь будет логика сохранения
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-500' : 'bg-yellow-500';
  };

  return (
    <>
      <AdvancedParticleCard
        className="card--border-glow relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8"
        style={{
          backgroundColor: '#060010',
          '--glow-color': COLORS.indigo,
          '--glow-intensity': '0',
        } as React.CSSProperties}
        particleCount={isMobile ? 8 : 16}
        glowColor={COLORS.indigo}
        enableTilt={!isMobile}
        clickEffect={!isMobile}
        enableMagnetism={!isMobile}
        intensity={isMobile ? 0.8 : 1.2}
      >
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-start">
          {/* Аватар и основная информация */}
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl sm:text-3xl lg:text-4xl shadow-2xl">
                {profileData.avatar}
              </div>
              <motion.div 
                className={`absolute -bottom-2 -right-2 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full ${getStatusColor(profileData.status)} border-4 border-black flex items-center justify-center`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 rounded-full bg-white" />
              </motion.div>
            </motion.div>
            
            {/* Статус и дата регистрации */}
            <div className="text-center">
              <div className="text-white/60 text-sm">В системе с</div>
              <div className="text-white text-sm font-medium">{profileData.joinDate}</div>
            </div>
          </div>

          {/* Информация профиля */}
          <div className="flex-grow space-y-4 sm:space-y-6 min-w-0">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(event) => setEditedProfile({...editedProfile, name: event.target.value})}
                  className="w-full text-xl sm:text-2xl lg:text-3xl font-bold text-white bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                />
                <textarea
                  value={editedProfile.bio}
                  onChange={(event) => setEditedProfile({...editedProfile, bio: event.target.value})}
                  className="w-full text-white/60 bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all resize-none"
                  rows={3}
                />
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    onClick={handleSave}
                    className="px-6 py-3 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all duration-300 font-medium text-sm sm:text-base flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>💾</span> Сохранить
                  </motion.button>
                  <motion.button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 rounded-xl bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 transition-all duration-300 font-medium text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Отмена
                  </motion.button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight break-words">{profileData.name}</h1>
                  <p className="text-white/60 text-base sm:text-lg">{profileData.role}</p>
                </div>
                
                <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-3xl">{profileData.bio}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 text-white/80 text-sm sm:text-base p-2 rounded-lg bg-white/5">
                    <span className="text-lg flex-shrink-0">📧</span>
                    <span className="truncate">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80 text-sm sm:text-base p-2 rounded-lg bg-white/5">
                    <span className="text-lg flex-shrink-0">📱</span>
                    <span className="truncate">{profileData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80 text-sm sm:text-base p-2 rounded-lg bg-white/5">
                    <span className="text-lg flex-shrink-0">🏠</span>
                    <span className="truncate">{profileData.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80 text-sm sm:text-base p-2 rounded-lg bg-white/5">
                    <span className="text-lg flex-shrink-0">🎯</span>
                    <span className="truncate">{profileData.category}</span>
                  </div>
                </div>

                {/* Список льгот */}
                <div className="space-y-2">
                  <div className="text-white/60 text-sm">Доступные льготы:</div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.benefits.map((benefit, index) => (
                      <motion.span 
                        key={index}
                        className="px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {benefit}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3 pt-2">
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="px-4 sm:px-6 py-2.5 rounded-xl bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 transition-all duration-300 font-medium text-sm sm:text-base flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>✏️</span> Редактировать
                  </motion.button>
                  <motion.button 
                    onClick={() => setShowDocumentsModal(true)}
                    className="px-4 sm:px-6 py-2.5 rounded-xl bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all duration-300 font-medium text-sm sm:text-base flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>📄</span> Документы
                  </motion.button>
                  <motion.button 
                    className="px-4 sm:px-6 py-2.5 rounded-xl bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all duration-300 font-medium text-sm sm:text-base flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>🔔</span> Уведомления
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </div>
      </AdvancedParticleCard>

      <Modal
        isOpen={showDocumentsModal}
        onClose={() => setShowDocumentsModal(false)}
        title="Мои документы"
        size="lg"
      >
        <div className="space-y-4">
          <div className="text-white/60 text-sm">
            Загруженные документы для получения социальных услуг
          </div>
          <div className="grid gap-3">
            {profileData.documents.map((doc, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl">📄</div>
                  <div>
                    <div className="text-white font-medium">{doc}</div>
                    <div className="text-white/60 text-sm">Статус: Проверен ✅</div>
                  </div>
                </div>
                <button className="text-white/60 hover:text-white transition-colors p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
          <div className="flex gap-3 pt-4">
            <motion.button
              className="px-6 py-3 rounded-xl bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 transition-all duration-300 font-medium flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>📤</span> Загрузить новый документ
            </motion.button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function ProfileMetricCard({ metric }: { metric: ProfileMetric }) {
  const { isMobile } = useResponsive();
  const [isExpanded, setIsExpanded] = useState(false);

  const content = (
    <motion.div 
      className="h-full flex flex-col justify-between p-4 sm:p-5 cursor-pointer"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="text-xl sm:text-2xl font-bold text-white leading-tight">
          {metric.value}
          {metric.label.includes('Удовлетворенность') && '/5'}
          {metric.label.includes('Бонусных баллов') && ''}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-xl sm:text-2xl">{metric.icon}</div>
          {metric.change && (
            <motion.div 
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border`}
              style={{ 
                backgroundColor: `rgba(${metric.color}, 0.2)`,
                color: `rgb(${metric.color})`,
                borderColor: `rgba(${metric.color}, 0.3)`
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
              {Math.abs(metric.change)}%
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-sm font-medium line-clamp-1">{metric.label}</span>
        </div>
        
        <AnimatePresence>
          {isExpanded ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-white/60 text-xs leading-relaxed"
            >
              {metric.description}
              {metric.progress && (
                <div className="pt-3">
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Прогресс</span>
                    <span>{metric.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div 
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${metric.progress}%`,
                        backgroundColor: `rgb(${metric.color})`
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-white/60 text-xs line-clamp-2"
            >
              {metric.description}
            </motion.div>
          )}
        </AnimatePresence>

        {metric.progress && !isExpanded && (
          <div className="pt-2">
            <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2">
              <div 
                className="h-1.5 sm:h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${metric.progress}%`,
                  backgroundColor: `rgb(${metric.color})`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <AdvancedParticleCard 
      className="card--border-glow h-full min-h-[140px] sm:min-h-[160px] rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg"
      style={{
        backgroundColor: '#060010',
        '--glow-color': metric.color,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      particleCount={isMobile ? 6 : 8}
      glowColor={metric.color}
      enableTilt={!isMobile}
      clickEffect={!isMobile}
      enableMagnetism={!isMobile}
      intensity={isMobile ? 0.7 : 1.0}
    >
      {content}
    </AdvancedParticleCard>
  );
}

function RecentActivityWidget() {
  const { isMobile } = useResponsive();
  const [selectedActivity, setSelectedActivity] = useState<RecentActivity | null>(null);

  const getStatusColor = (status: RecentActivity['status']) => {
    return {
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
    }[status];
  };

  const getStatusText = (status: RecentActivity['status']) => {
    return {
      completed: 'Завершено',
      pending: 'Ожидает',
      in_progress: 'В процессе',
      cancelled: 'Отменено'
    }[status];
  };

  const getPriorityColor = (priority?: string) => {
    if (!priority) return '';
    return {
      high: 'border-l-2 border-l-red-400',
      medium: 'border-l-2 border-l-yellow-400',
      low: 'border-l-2 border-l-green-400'
    }[priority];
  };

  return (
    <>
      <AdvancedParticleCard
        className="card--border-glow h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6"
        style={{
          backgroundColor: '#060010',
          '--glow-color': COLORS.blue,
          '--glow-intensity': '0',
        } as React.CSSProperties}
        particleCount={isMobile ? 8 : 12}
        glowColor={COLORS.blue}
        enableTilt={!isMobile}
        clickEffect={!isMobile}
        enableMagnetism={!isMobile}
        intensity={isMobile ? 0.8 : 1.1}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="font-semibold text-white text-lg sm:text-xl">Последняя активность</h3>
            <motion.span 
              className="text-white/60 text-sm hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              whileHover={{ x: 2 }}
            >
              Вся активность <span>→</span>
            </motion.span>
          </div>
          
          <div className="space-y-3 flex-grow">
            {recentActivities.map((activity, index) => (
              <motion.div 
                key={activity.id}
                className={`p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer group ${getPriorityColor(activity.priority)}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedActivity(activity)}
              >
                <div className="flex items-start gap-4">
                  <div className="text-xl sm:text-2xl mt-0.5 flex-shrink-0">{activity.icon}</div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-white font-medium text-sm sm:text-base line-clamp-1 pr-2">{activity.title}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)} flex-shrink-0`}>
                        {getStatusText(activity.status)}
                      </span>
                    </div>
                    
                    <div className="text-white/60 text-xs sm:text-sm mb-2 line-clamp-2">{activity.description}</div>
                    <div className="flex items-center justify-between">
                      <div className="text-white/40 text-xs">{activity.date}</div>
                      {activity.priority && (
                        <div className={`text-xs px-2 py-1 rounded ${
                          activity.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          activity.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {activity.priority === 'high' ? 'Высокий' : activity.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <motion.button 
              className="w-full py-3 rounded-xl bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>➕</span> Создать новую заявку
            </motion.button>
          </div>
        </div>
      </AdvancedParticleCard>

      <Modal
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        title={selectedActivity?.title || ''}
        size="md"
      >
        {selectedActivity && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
              <div className="text-2xl">{selectedActivity.icon}</div>
              <div>
                <div className="text-white font-medium">{selectedActivity.title}</div>
                <div className="text-white/60 text-sm">{selectedActivity.date}</div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-white/5">
              <div className="text-white/60 text-sm mb-2">Описание:</div>
              <div className="text-white">{selectedActivity.description}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-white/5">
                <div className="text-white/60 text-sm">Статус</div>
                <div className={`text-sm font-medium ${getStatusColor(selectedActivity.status).replace('bg-', 'text-')}`}>
                  {getStatusText(selectedActivity.status)}
                </div>
              </div>
              {selectedActivity.priority && (
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="text-white/60 text-sm">Приоритет</div>
                  <div className={`text-sm font-medium ${
                    selectedActivity.priority === 'high' ? 'text-red-400' :
                    selectedActivity.priority === 'medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {selectedActivity.priority === 'high' ? 'Высокий' : selectedActivity.priority === 'medium' ? 'Средний' : 'Низкий'}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 pt-2">
              <motion.button
                className="px-6 py-3 rounded-xl bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 transition-all duration-300 font-medium flex-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Редактировать
              </motion.button>
              <motion.button
                className="px-6 py-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all duration-300 font-medium flex-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Отменить
              </motion.button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function ServicesStatusWidget() {
  const { isMobile } = useResponsive();
  const [selectedService, setSelectedService] = useState<ServiceStatus | null>(null);

  const getStatusColor = (status: ServiceStatus['status']) => {
    return {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
    }[status];
  };

  const getStatusText = (status: ServiceStatus['status']) => {
    return {
      active: 'Активно',
      pending: 'Ожидает',
      completed: 'Завершено',
      rejected: 'Отклонено'
    }[status];
  };

  return (
    <>
      <AdvancedParticleCard
        className="card--border-glow h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6"
        style={{
          backgroundColor: '#060010',
          '--glow-color': COLORS.purple,
          '--glow-intensity': '0',
        } as React.CSSProperties}
        particleCount={isMobile ? 8 : 12}
        glowColor={COLORS.purple}
        enableTilt={!isMobile}
        clickEffect={!isMobile}
        enableMagnetism={!isMobile}
        intensity={isMobile ? 0.8 : 1.1}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="font-semibold text-white text-lg sm:text-xl">Статус услуг</h3>
            <div className="text-white/60 text-sm">
              Всего: {serviceStatuses.length}
            </div>
          </div>
          
          <div className="space-y-4 flex-grow">
            {serviceStatuses.map((service, index) => (
              <motion.div 
                key={service.service}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedService(service)}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-xl sm:text-2xl flex-shrink-0">{service.icon}</div>
                  <div className="flex-grow min-w-0">
                    <div className="text-white font-medium text-sm sm:text-base line-clamp-1">{service.service}</div>
                    <div className="text-white/60 text-xs line-clamp-1">{service.lastUpdate}</div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(service.status)} flex-shrink-0`}>
                    {getStatusText(service.status)}
                  </span>
                </div>
                
                {service.progress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-white/60">
                      <span>Прогресс выполнения</span>
                      <span>{service.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div 
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${service.progress}%`,
                          backgroundColor: `rgb(${service.color})`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${service.progress}%` }}
                      />
                    </div>
                    {service.nextStep && (
                      <div className="text-white/60 text-xs pt-1">
                        Следующий шаг: {service.nextStep}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-center text-white/60 text-sm">
              Активных услуг: {serviceStatuses.filter(s => s.status === 'active').length}
            </div>
          </div>
        </div>
      </AdvancedParticleCard>

      <Modal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={selectedService?.service || ''}
        size="md"
      >
        {selectedService && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
              <div className="text-3xl">{selectedService.icon}</div>
              <div>
                <div className="text-white font-medium text-lg">{selectedService.service}</div>
                <div className="text-white/60 text-sm">{selectedService.lastUpdate}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5">
                <div className="text-white/60 text-sm mb-1">Статус</div>
                <div className={`text-base font-medium ${getStatusColor(selectedService.status).replace('bg-', 'text-')}`}>
                  {getStatusText(selectedService.status)}
                </div>
              </div>
              {selectedService.progress && (
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="text-white/60 text-sm mb-1">Прогресс</div>
                  <div className="text-base font-medium text-white">{selectedService.progress}%</div>
                </div>
              )}
            </div>
            
            {selectedService.nextStep && (
              <div className="p-4 rounded-xl bg-white/5">
                <div className="text-white/60 text-sm mb-1">Следующий шаг</div>
                <div className="text-white text-base">{selectedService.nextStep}</div>
              </div>
            )}
            
            <div className="p-4 rounded-xl bg-white/5">
              <div className="text-white/60 text-sm mb-2">История обслуживания</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white">Начало обслуживания</span>
                  <span className="text-white/60">01.03.2024</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white">Последнее обновление</span>
                  <span className="text-white/60">{selectedService.lastUpdate.toLowerCase()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <motion.button
                className="px-6 py-3 rounded-xl bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 transition-all duration-300 font-medium flex-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Подробнее
              </motion.button>
              <motion.button
                className="px-6 py-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300 font-medium flex-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Связаться
              </motion.button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function QuickActionsWidget() {
  const { isMobile } = useResponsive();
  const [showAllActions, setShowAllActions] = useState(false);

  const actions = [
    { 
      id: 'new-request',
      icon: '📝', 
      label: 'Новая заявка', 
      description: 'Подать заявку на услугу', 
      href: '',
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30'
    },
    { 
      id: 'services',
      icon: '🏥', 
      label: 'Услуги', 
      description: 'Каталог услуг', 
      href: '',
      color: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30'
    },
    { 
      id: 'support',
      icon: '💬', 
      label: 'Поддержка', 
      description: 'Помощь и консультации', 
      href: '',
      color: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30'
    },
    { 
      id: 'documents',
      icon: '📄', 
      label: 'Документы', 
      description: 'Мои документы', 
      href: '',
      color: 'from-orange-500/20 to-amber-500/20',
      borderColor: 'border-orange-500/30'
    },
    { 
      id: 'notifications',
      icon: '🔔', 
      label: 'Уведомления', 
      description: 'Настройки оповещений', 
      href: '',
      color: 'from-yellow-500/20 to-amber-500/20',
      borderColor: 'border-yellow-500/30'
    },
    { 
      id: 'security',
      icon: '🔒', 
      label: 'Безопасность', 
      description: 'Смена пароля', 
      href: '',
      color: 'from-red-500/20 to-pink-500/20',
      borderColor: 'border-red-500/30'
    },
    { 
      id: 'payments',
      icon: '💰', 
      label: 'Платежи', 
      description: 'История платежей', 
      href: '',
      color: 'from-emerald-500/20 to-green-500/20',
      borderColor: 'border-emerald-500/30'
    },
    { 
      id: 'schedule',
      icon: '📅', 
      label: 'Расписание', 
      description: 'Мои встречи', 
      href: '',
      color: 'from-indigo-500/20 to-purple-500/20',
      borderColor: 'border-indigo-500/30'
    },
  ];

  const visibleActions = showAllActions ? actions : actions.slice(0, 6);

  return (
    <AdvancedParticleCard
      className="card--border-glow h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6"
      style={{
        backgroundColor: '#060010',
        '--glow-color': COLORS.gray,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      particleCount={isMobile ? 6 : 10}
      glowColor={COLORS.gray}
      enableTilt={!isMobile}
      clickEffect={!isMobile}
      enableMagnetism={!isMobile}
      intensity={isMobile ? 0.7 : 1.0}
    >
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="font-semibold text-white text-lg sm:text-xl">Быстрые действия</h3>
          <motion.button
            onClick={() => setShowAllActions(!showAllActions)}
            className="text-white/60 text-sm hover:text-white transition-colors flex items-center gap-1"
            whileHover={{ x: 2 }}
          >
            {showAllActions ? 'Скрыть' : 'Ещё'} <span>{showAllActions ? '↑' : '↓'}</span>
          </motion.button>
        </div>
        
        <div className="flex-grow grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {visibleActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={action.href}>
                <motion.div 
                  className={`p-3 sm:p-4 rounded-xl bg-gradient-to-br ${action.color} border ${action.borderColor} hover:shadow-lg transition-all duration-300 text-center cursor-pointer group h-full flex flex-col items-center justify-center`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">{action.icon}</div>
                  <div className="text-white/90 text-xs sm:text-sm font-medium mb-1 line-clamp-1">{action.label}</div>
                  <div className="text-white/60 text-xs line-clamp-2">{action.description}</div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-center text-white/60 text-sm">
            Пользователь социальных услуг • {actions.length} действий доступно
          </div>
        </div>
      </div>
    </AdvancedParticleCard>
  );
}

function BenefitsInfoWidget() {
  const { isMobile } = useResponsive();
  const [expandedBenefit, setExpandedBenefit] = useState<string | null>(null);

  const benefits = [
    { 
      icon: '🛒', 
      title: 'Доставка продуктов', 
      description: '2 раза в неделю',
      details: 'Бесплатная доставка продуктов питания по утвержденному списку. Возможность выбора даты и времени доставки.',
      schedule: 'Пн и Чт, 10:00-14:00',
      status: 'active'
    },
    { 
      icon: '🏥', 
      title: 'Медицинская помощь', 
      description: 'Бесплатные консультации',
      details: 'Консультации терапевта, узких специалистов. Бесплатные лекарства по рецепту. Вызов врача на дом.',
      schedule: 'По записи',
      status: 'active'
    },
    { 
      icon: '👥', 
      title: 'Социальное сопровождение', 
      description: 'Индивидуальный куратор',
      details: 'Персональный социальный работник. Помощь в решении бытовых вопросов. Психологическая поддержка.',
      schedule: 'Еженедельно',
      status: 'active'
    },
    { 
      icon: '⚖️', 
      title: 'Юридическая помощь', 
      description: 'Консультации специалистов',
      details: 'Бесплатные юридические консультации. Помощь в оформлении документов. Представительство в государственных органах.',
      schedule: 'По предварительной записи',
      status: 'pending'
    },
  ];

  return (
    <AdvancedParticleCard
      className="card--border-glow h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6"
      style={{
        backgroundColor: '#060010',
        '--glow-color': COLORS.teal,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      particleCount={isMobile ? 6 : 10}
      glowColor={COLORS.teal}
      enableTilt={!isMobile}
      clickEffect={!isMobile}
      enableMagnetism={!isMobile}
      intensity={isMobile ? 0.7 : 1.0}
    >
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="font-semibold text-white text-lg sm:text-xl">Мои льготы</h3>
          <div className="text-white/60 text-sm">
            Активно: {benefits.filter(b => b.status === 'active').length}
          </div>
        </div>
        
        <div className="space-y-3 flex-grow">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={benefit.title}
              className={`p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer group ${
                benefit.status === 'pending' ? 'opacity-60' : ''
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setExpandedBenefit(expandedBenefit === benefit.title ? null : benefit.title)}
            >
              <div className="flex items-center gap-4">
                <div className="text-xl sm:text-2xl flex-shrink-0">{benefit.icon}</div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-white font-medium text-sm sm:text-base line-clamp-1">{benefit.title}</div>
                    {benefit.status === 'pending' && (
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        Ожидает
                      </span>
                    )}
                  </div>
                  <div className="text-white/60 text-xs line-clamp-1">{benefit.description}</div>
                  <div className="text-white/40 text-xs mt-1">{benefit.schedule}</div>
                </div>
                <motion.span
                  className="opacity-0 group-hover:opacity-100 text-white/60 transition-opacity text-lg flex-shrink-0"
                  whileHover={{ x: 2 }}
                  animate={{ rotate: expandedBenefit === benefit.title ? 180 : 0 }}
                >
                  ↓
                </motion.span>
              </div>
              
              <AnimatePresence>
                {expandedBenefit === benefit.title && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 mt-3 border-t border-white/10"
                  >
                    <div className="text-white/60 text-sm leading-relaxed">
                      {benefit.details}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <motion.button
                        className="px-3 py-1.5 rounded-lg bg-white/10 text-white/80 text-xs border border-white/20 hover:bg-white/20 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Подробнее
                      </motion.button>
                      <motion.button
                        className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs border border-blue-500/30 hover:bg-blue-500/30 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Записаться
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-center text-white/60 text-sm">
            Действуют до: 31.12.2024 • Автопродление: Да
          </div>
        </div>
      </div>
    </AdvancedParticleCard>
  );
}

// ========== ОСНОВНОЙ КОМПОНЕНТ ==========

export default function UserProfilePage() {
  const gridReference = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet, isDesktop, isLarge } = useResponsive();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Адаптивные настройки
  const responsiveSettings = useMemo(() => ({
    particleCount: isMobile ? 8 : isTablet ? 12 : 16,
    cardIntensity: isMobile ? 0.8 : isTablet ? 1.0 : 1.2,
    gridGap: isMobile ? 'gap-3' : isTablet ? 'gap-4' : 'gap-6',
    headerPadding: isMobile ? 'px-3 py-2' : 'px-4 py-3',
    sectionPadding: isMobile ? 'px-3 py-4' : 'px-4 py-6'
  }), [isMobile, isTablet]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
      setCurrentDate(now.toLocaleDateString('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [isMounted]);

  // Адаптивная разметка
  const getGridColumns = (type: 'metrics' | 'main') => {
    if (isMobile) {
      return type === 'metrics' ? { mobile: 2, tablet: 3, desktop: 3, large: 6 } : { mobile: 1, tablet: 2, desktop: 2, large: 6 };
    }
    if (isTablet) {
      return type === 'metrics' ? { mobile: 2, tablet: 3, desktop: 3, large: 6 } : { mobile: 1, tablet: 2, desktop: 2, large: 6 };
    }
    return type === 'metrics' ? { mobile: 2, tablet: 3, desktop: 3, large: 6 } : { mobile: 1, tablet: 2, desktop: 3, large: 6 };
  };

  const getMainGridLayout = () => {
    if (isMobile) return "grid-cols-1";
    if (isTablet) return "grid-cols-1 lg:grid-cols-2";
    return "grid-cols-1 xl:grid-cols-6";
  };

  if (!isMounted) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>
        <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="card--border-glow relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-white text-lg flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full"
                />
                Загрузка профиля...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.4)) 0%,
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.2)) 25%,
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.08)) 50%,
              transparent 70%
            ),
            linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%);
        }
        
        .card--border-glow::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 2px;
          background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.9)) 0%,
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.5)) 30%,
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
        
        .advanced-particle {
          filter: blur(1px);
          animation: float 4s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Адаптивные стили для мобильных устройств */
        @media (max-width: 393px) {
          .mobile-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .mobile-padding {
            padding: 12px;
          }
          
          .mobile-text {
            font-size: 14px;
          }
        }

        /* Плавные переходы для всех интерактивных элементов */
        * {
          transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
        }
      `}</style>

      <GlobalSpotlight
        gridRef={gridReference}
        disableAnimations={isMobile}
        enabled={!isMobile}
        spotlightRadius={isMobile ? 200 : DEFAULT_SPOTLIGHT_RADIUS}
        glowColor={DEFAULT_GLOW_COLOR}
      />

      <main className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Header Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ProfileHeader />
        </motion.section>

        {/* Profile Metrics */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Моя статистика</h2>
            <div className="text-white/60 text-sm">
              Обновлено: {currentTime}
            </div>
          </div>
          <BentoCardGrid 
            gridRef={gridReference} 
            columns={getGridColumns('metrics')}
            gap="md"
          >
            {profileMetrics.map((metric, index) => (
              <ProfileMetricCard key={metric.label} metric={metric} />
            ))}
          </BentoCardGrid>
        </motion.section>

        {/* Main Profile Grid */}
        <div className={`grid ${getMainGridLayout()} gap-4 sm:gap-6`}>
          {/* Recent Activity Widget */}
          <div className={isDesktop ? "xl:col-span-2" : ""}>
            <RecentActivityWidget />
          </div>

          {/* Services Status Widget */}
          <div className={isDesktop ? "xl:col-span-2" : ""}>
            <ServicesStatusWidget />
          </div>

          {/* Benefits Info Widget */}
          <div className={isDesktop ? "xl:col-span-2" : ""}>
            <BenefitsInfoWidget />
          </div>

          {/* Quick Actions Widget */}
          <div className={isDesktop ? "xl:col-span-3" : ""}>
            <QuickActionsWidget />
          </div>

          {/* Additional Info Widget */}
          <div className={isDesktop ? "xl:col-span-3" : ""}>
            <AdvancedParticleCard
              className="card--border-glow h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6"
              style={{
                backgroundColor: '#060010',
                '--glow-color': COLORS.orange,
                '--glow-intensity': '0',
              } as React.CSSProperties}
              particleCount={isMobile ? 6 : 10}
              glowColor={COLORS.orange}
              enableTilt={!isMobile}
              clickEffect={!isMobile}
              enableMagnetism={!isMobile}
              intensity={isMobile ? 0.7 : 1.0}
            >
              <div className="h-full flex flex-col justify-center items-center text-center p-4">
                <motion.div 
                  className="text-4xl sm:text-5xl mb-4 sm:mb-6"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎯
                </motion.div>
                <h3 className="font-semibold text-white text-lg sm:text-xl mb-3">Мои цели на месяц</h3>
                <p className="text-white/60 text-sm sm:text-base mb-6 leading-relaxed max-w-md">
                  Получить все запланированные услуги в этом месяце и повысить качество жизни через социальную поддержку
                </p>
                <div className="w-full max-w-xs space-y-3">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Прогресс выполнения целей</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <motion.div 
                      className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="text-white/60 text-xs sm:text-sm flex justify-between">
                    <span>Осталось 2 недели</span>
                    <span>3 из 4 целей</span>
                  </div>
                </div>
                <motion.button 
                  className="mt-6 px-6 py-3 rounded-xl bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 transition-all duration-300 font-medium text-sm flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>📋</span> Посмотреть все цели
                </motion.button>
              </div>
            </AdvancedParticleCard>
          </div>
        </div>
      </main>
    </div>
  );
}