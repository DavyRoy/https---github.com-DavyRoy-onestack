'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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

const DEFAULT_PARTICLE_COUNT = 18;
const DEFAULT_SPOTLIGHT_RADIUS = 400;
const DEFAULT_GLOW_COLOR = '59, 130, 246';

interface FinanceMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
  icon: string;
  color: string;
  unit?: 'million' | 'percent' | 'currency';
}

interface ChartData {
  label: string;
  value: number;
  category?: string;
  date?: string;
  actual?: number;
  forecast?: number;
}

interface TimeRange {
  label: string;
  value: string;
}

interface FilterOption {
  label: string;
  value: string;
  count?: number;
  color?: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  status: 'completed' | 'pending' | 'failed';
  recipient?: string;
  project?: string;
}

interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentage: number;
  color: string;
  icon: string;
}

interface FinancialAlert {
  id: string;
  type: 'warning' | 'info' | 'critical' | 'success';
  title: string;
  message: string;
  amount?: number;
  date: string;
  action?: string;
}

interface ModalState {
  isOpen: boolean;
  type: 'transaction' | 'budget' | 'alert' | 'metric' | null;
  data?: any;
}

// ========== УТИЛИТЫ ==========

const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M ₽';
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(1) + 'K ₽';
  }
  return amount.toString() + ' ₽';
};

const formatCurrencyFull = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
  return trend === 'up' ? COLORS.success : trend === 'down' ? COLORS.error : COLORS.warning;
};

const getAlertColor = (type: FinancialAlert['type']) => {
  switch (type) {
    case 'warning': return COLORS.warning;
    case 'info': return COLORS.info;
    case 'critical': return COLORS.error;
    case 'success': return COLORS.success;
    default: return COLORS.gray;
  }
};

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'advanced-particle';
  el.style.cssText = `
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
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach(particle => {
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
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    
    for (let i = 0; i < particleCount; i++) {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        const particle = createParticleElement(x, y, glowColor);
        cardRef.current.appendChild(particle);
        particlesRef.current.push(particle);

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

      timeoutsRef.current.push(timeoutId);
    }
  }, [particleCount, glowColor, intensity]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
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
      isHoveredRef.current = false;
      clearAllParticles();

      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      });

      if (enableMagnetism) {
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

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
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

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.04 * intensity;
        const magnetY = (y - centerY) * 0.04 * intensity;

        if (magnetismAnimationRef.current) {
          magnetismAnimationRef.current.kill();
        }
        
        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.6,
          ease: 'power2.out'
        });
      }

      element.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
      element.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
    };

    const handleClick = (e: MouseEvent) => {
      if (clickEffect) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

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
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor, onCardClick, animateParticles, clearAllParticles, intensity]);

  return (
    <motion.div
      ref={cardRef}
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
        duration: 0.15,
        ease: 'power2.out'
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.9
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.9
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.25 : 0.6,
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
    className={`bento-section grid gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6 max-w-7xl 2xl:max-w-[1800px] mx-auto select-none relative ${className}`}
    ref={gridRef}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// ========== МОДАЛЬНЫЕ ОКНА ==========

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(modalRef.current, 
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
        ref={modalRef}
        className={`bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/20 shadow-2xl w-full ${sizeClasses[size]} max-h-[95vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
          <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200 text-white/60 hover:text-white"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)]">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

const TransactionModal: React.FC<{ isOpen: boolean; onClose: () => void; transaction: Transaction }> = ({ 
  isOpen, 
  onClose, 
  transaction 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Детали транзакции" size="md">
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="text-white/60 text-sm">Сумма</label>
            <div className={`text-lg sm:text-xl font-bold ${
              transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </div>
          </div>
          <div>
            <label className="text-white/60 text-sm">Статус</label>
            <div className={`px-3 py-1 rounded-full text-sm inline-block ${
              transaction.status === 'completed' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : transaction.status === 'pending'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {transaction.status === 'completed' ? 'Завершено' : 
               transaction.status === 'pending' ? 'Ожидание' : 'Ошибка'}
            </div>
          </div>
        </div>

        <div>
          <label className="text-white/60 text-sm">Описание</label>
          <div className="text-white font-medium text-sm sm:text-base">{transaction.description}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="text-white/60 text-sm">Категория</label>
            <div className="text-white text-sm sm:text-base">{transaction.category}</div>
          </div>
          <div>
            <label className="text-white/60 text-sm">Дата</label>
            <div className="text-white text-sm sm:text-base">{new Date(transaction.date).toLocaleDateString('ru-RU')}</div>
          </div>
        </div>

        {transaction.recipient && (
          <div>
            <label className="text-white/60 text-sm">Получатель/Отправитель</label>
            <div className="text-white text-sm sm:text-base">{transaction.recipient}</div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
          <button className="flex-1 py-2 sm:py-3 px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-xl transition-all duration-300 text-sm">
            Экспорт в PDF
          </button>
          <button className="flex-1 py-2 sm:py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-300 text-sm">
            Создать шаблон
          </button>
        </div>
      </div>
    </Modal>
  );
};

const BudgetModal: React.FC<{ isOpen: boolean; onClose: () => void; category: BudgetCategory }> = ({ 
  isOpen, 
  onClose, 
  category 
}) => {
  const [allocation, setAllocation] = useState(category.allocated);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Бюджет: ${category.name}`} size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-white">{formatCurrency(category.allocated)}</div>
            <div className="text-white/60 text-xs sm:text-sm">Выделено</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-white">{formatCurrency(category.spent)}</div>
            <div className="text-white/60 text-xs sm:text-sm">Потрачено</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-green-400">{formatCurrency(category.remaining)}</div>
            <div className="text-white/60 text-xs sm:text-sm">Остаток</div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-white/60 text-sm mb-2">
            <span>Использование бюджета</span>
            <span>{category.percentage}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 sm:h-3 overflow-hidden">
            <motion.div 
              className="h-2 sm:h-3 rounded-full relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${category.percentage}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ backgroundColor: `rgb(${category.color})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
            </motion.div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-white font-semibold text-sm sm:text-base">Настройки бюджета</h4>
          <div className="space-y-3">
            <div>
              <label className="text-white/60 text-sm mb-2 block">Новое выделение</label>
              <input
                type="number"
                value={allocation}
                onChange={(e) => setAllocation(Number(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="flex-1 py-2 sm:py-3 px-4 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 rounded-xl transition-all duration-300 text-sm">
                Сохранить изменения
              </button>
              <button className="flex-1 py-2 sm:py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-300 text-sm">
                Сбросить
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <h4 className="text-white font-semibold mb-3 text-sm sm:text-base">Рекомендации</h4>
          <div className="space-y-1 text-xs sm:text-sm text-white/60">
            <div>• {category.percentage > 90 ? 'Бюджет почти исчерпан' : 'Бюджет в норме'}</div>
            <div>• {category.remaining < 100000 ? 'Рекомендуется увеличить бюджет' : 'Остаток достаточный'}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const MetricModal: React.FC<{ isOpen: boolean; onClose: () => void; metric: FinanceMetric }> = ({ 
  isOpen, 
  onClose, 
  metric 
}) => {
  const historicalData = [
    { period: 'Янв', value: metric.value * 0.8 },
    { period: 'Фев', value: metric.value * 0.9 },
    { period: 'Мар', value: metric.value * 0.85 },
    { period: 'Апр', value: metric.value * 0.95 },
    { period: 'Май', value: metric.value * 1.1 },
    { period: 'Июн', value: metric.value }
  ];

  const maxValue = Math.max(...historicalData.map(d => d.value));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Аналитика: ${metric.label}`} size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-white">
              {metric.unit === 'percent' ? `${metric.value}%` : formatCurrency(metric.value * 1000000)}
            </div>
            <div className="text-white/60 text-xs sm:text-sm">Текущее значение</div>
          </div>
          <div className="text-center">
            <div className={`text-lg sm:text-2xl font-bold ${
              metric.trend === 'up' ? 'text-green-400' : metric.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {metric.trend === 'up' ? '+' : ''}{metric.change}%
            </div>
            <div className="text-white/60 text-xs sm:text-sm">Изменение</div>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Историческая динамика</h4>
          <div className="flex items-end justify-between h-24 sm:h-32 px-2 sm:px-4">
            {historicalData.map((data, index) => (
              <div key={data.period} className="flex flex-col items-center">
                <motion.div
                  className="w-4 sm:w-6 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer"
                  style={{ height: `${(data.value / maxValue) * 70}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.value / maxValue) * 70}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                />
                <div className="text-white/60 text-xs mt-2">{data.period}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-white font-semibold text-sm sm:text-base">Детальная информация</h4>
          <div className="text-white/60 text-xs sm:text-sm leading-relaxed">
            {metric.description}. Показатель демонстрирует {metric.trend === 'up' ? 'положительную' : metric.trend === 'down' ? 'отрицательную' : 'стабильную'} динамику 
            за последний отчетный период. {metric.change > 0 ? `Рост составил ${metric.change}%` : `Снижение составило ${Math.abs(metric.change)}%`}.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
          <button className="flex-1 py-2 sm:py-3 px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-xl transition-all duration-300 text-sm">
            Скачать отчет
          </button>
          <button className="flex-1 py-2 sm:py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-300 text-sm">
            Настроить уведомления
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ========== ОСНОВНЫЕ КОМПОНЕНТЫ ==========

const ProgressBar: React.FC<{
  value: number;
  max?: number;
  color?: string;
  label?: string;
  showLabel?: boolean;
  height?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}> = ({ value, max = 100, color = '#3B82F6', label = '', showLabel = true, height = 'md', animated = true }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const heightClass = height === 'sm' ? 'h-1.5' : height === 'lg' ? 'h-3' : 'h-2';
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-white text-xs mb-2">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}
      <div className={`w-full bg-white/10 rounded-full ${heightClass} overflow-hidden backdrop-blur-sm`}>
        <motion.div 
          className={`rounded-full ${heightClass} relative overflow-hidden`}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1.2 : 0, ease: 'easeOut' }}
          style={{ backgroundColor: color }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};

// ========== МОКИ ДАННЫХ ==========

const financeMetrics: FinanceMetric[] = [
  { 
    label: "Общий доход", 
    value: 28.4, 
    change: 15, 
    trend: 'up', 
    description: "За текущий квартал по всем источникам финансирования", 
    icon: "💰", 
    color: COLORS.emerald,
    unit: 'million'
  },
  { 
    label: "Операционные расходы", 
    value: 32.1, 
    change: -8, 
    trend: 'down', 
    description: "Текущие операционные затраты организации", 
    icon: "📊", 
    color: COLORS.blue,
    unit: 'million'
  },
  { 
    label: "Чистая прибыль", 
    value: -3.7, 
    change: 25, 
    trend: 'up', 
    description: "После вычета всех расходов и налогов", 
    icon: "⚡", 
    color: COLORS.success,
    unit: 'million'
  },
  { 
    label: "Общий бюджет", 
    value: 48.7, 
    change: 2.3, 
    trend: 'up', 
    description: "Суммарный объем доступных средств", 
    icon: "🎯", 
    color: COLORS.purple,
    unit: 'million'
  },
  { 
    label: "Эффективность использования", 
    value: 87.5, 
    change: 5.2, 
    trend: 'up', 
    description: "Коэффициент использования бюджетных средств", 
    icon: "📈", 
    color: COLORS.orange,
    unit: 'percent'
  },
  { 
    label: "Налоговые отчисления", 
    value: 4.2, 
    change: -3, 
    trend: 'down', 
    description: "Общая сумма налоговых платежей", 
    icon: "🏛️", 
    color: COLORS.cyan,
    unit: 'million'
  },
];

const categoryMetrics: FinanceMetric[] = [
  { 
    label: "Социальные выплаты", 
    value: 12.3, 
    change: 4, 
    trend: 'up', 
    description: "Выплаты пенсий, пособий и социальной помощи", 
    icon: "👥", 
    color: COLORS.success,
    unit: 'million'
  },
  { 
    label: "Фонд оплаты труда", 
    value: 8.7, 
    change: -2, 
    trend: 'down', 
    description: "Заработная плата сотрудников и отчисления", 
    icon: "👨‍💼", 
    color: COLORS.blue,
    unit: 'million'
  },
  { 
    label: "IT инфраструктура", 
    value: 2.1, 
    change: 8, 
    trend: 'up', 
    description: "Техническое оснащение и программное обеспечение", 
    icon: "💻", 
    color: COLORS.purple,
    unit: 'million'
  },
  { 
    label: "Административные расходы", 
    value: 1.8, 
    change: 3, 
    trend: 'up', 
    description: "Хозяйственные и управленческие затраты", 
    icon: "🏢", 
    color: COLORS.orange,
    unit: 'million'
  },
];

const revenueData: ChartData[] = [
  { label: 'Янв', value: 8.2, category: 'revenue' },
  { label: 'Фев', value: 7.8, category: 'revenue' },
  { label: 'Мар', value: 9.1, category: 'revenue' },
  { label: 'Апр', value: 8.5, category: 'revenue' },
  { label: 'Май', value: 9.8, category: 'revenue' },
  { label: 'Июн', value: 10.2, category: 'revenue' },
];

const expenseData: ChartData[] = [
  { label: 'Янв', value: 28.4, category: 'expense' },
  { label: 'Фев', value: 31.2, category: 'expense' },
  { label: 'Мар', value: 29.8, category: 'expense' },
  { label: 'Апр', value: 33.1, category: 'expense' },
  { label: 'Май', value: 30.5, category: 'expense' },
  { label: 'Июн', value: 32.1, category: 'expense' },
];

const budgetCategories: BudgetCategory[] = [
  {
    id: '1',
    name: 'Социальные выплаты',
    allocated: 15000000,
    spent: 12300000,
    remaining: 2700000,
    percentage: 82,
    color: COLORS.success,
    icon: '👥'
  },
  {
    id: '2',
    name: 'Зарплаты сотрудников',
    allocated: 9500000,
    spent: 8700000,
    remaining: 800000,
    percentage: 92,
    color: COLORS.blue,
    icon: '👨‍💼'
  },
  {
    id: '3',
    name: 'IT инфраструктура',
    allocated: 2500000,
    spent: 2100000,
    remaining: 400000,
    percentage: 84,
    color: COLORS.purple,
    icon: '💻'
  },
  {
    id: '4',
    name: 'Административные расходы',
    allocated: 2200000,
    spent: 1800000,
    remaining: 400000,
    percentage: 82,
    color: COLORS.orange,
    icon: '🏢'
  },
  {
    id: '5',
    name: 'Обучение и развитие',
    allocated: 1200000,
    spent: 850000,
    remaining: 350000,
    percentage: 71,
    color: COLORS.cyan,
    icon: '🎓'
  }
];

const recentTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-15',
    description: 'Выплата пенсий и пособий за январь',
    amount: 4500000,
    type: 'expense',
    category: 'Социальные выплаты',
    status: 'completed',
    recipient: 'Пенсионный фонд РФ'
  },
  {
    id: '2',
    date: '2024-01-14',
    description: 'Федеральный грант на социальные программы',
    amount: 5000000,
    type: 'income',
    category: 'Федеральное финансирование',
    status: 'completed',
    recipient: 'Министерство труда и соцзащиты'
  },
  {
    id: '3',
    date: '2024-01-14',
    description: 'Заработная плата сотрудникам',
    amount: 2870000,
    type: 'expense',
    category: 'Фонд оплаты труда',
    status: 'completed',
    recipient: 'Банк "Сбербанк"'
  },
  {
    id: '4',
    date: '2024-01-13',
    description: 'Обновление серверного оборудования',
    amount: 850000,
    type: 'expense',
    category: 'IT инфраструктура',
    status: 'pending',
    recipient: 'ООО "ИТ-Решения"'
  },
  {
    id: '5',
    date: '2024-01-12',
    description: 'Коммунальные услуги за декабрь',
    amount: 320000,
    type: 'expense',
    category: 'Административные расходы',
    status: 'completed',
    recipient: 'Горэнерго'
  },
  {
    id: '6',
    date: '2024-01-11',
    description: 'Корпоративное обучение персонала',
    amount: 150000,
    type: 'expense',
    category: 'Обучение и развитие',
    status: 'completed',
    recipient: 'Учебный центр "Профи"'
  }
];

const financialAlerts: FinancialAlert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Превышение бюджета по фонду оплаты труда',
    message: 'Использовано 92% от выделенного бюджета на заработную плату',
    amount: 8700000,
    date: '2024-01-15',
    action: 'Скорректировать бюджет'
  },
  {
    id: '2',
    type: 'info',
    title: 'Поступление федерального гранта',
    message: 'Получен грант от Министерства труда на социальные программы',
    amount: 5000000,
    date: '2024-01-14',
    action: 'Распределить средства'
  },
  {
    id: '3',
    type: 'critical',
    title: 'Ожидается крупный платеж за аренду',
    message: 'Через 3 дня платеж за аренду офисных помещений',
    amount: 1200000,
    date: '2024-01-18',
    action: 'Подготовить средства'
  }
];

const timeRanges: TimeRange[] = [
  { label: 'Месяц', value: '1m' },
  { label: 'Квартал', value: '3m' },
  { label: 'Полгода', value: '6m' },
  { label: 'Год', value: '1y' },
  { label: 'Все время', value: 'all' },
];

const filterOptions: FilterOption[] = [
  { label: 'Все операции', value: 'all', count: 1245, color: COLORS.gray },
  { label: 'Доходы', value: 'income', count: 45, color: COLORS.success },
  { label: 'Расходы', value: 'expense', count: 1200, color: COLORS.error },
  { label: 'Социальные', value: 'social', count: 856, color: COLORS.blue },
  { label: 'Зарплаты', value: 'salary', count: 287, color: COLORS.orange },
  { label: 'IT', value: 'it', count: 67, color: COLORS.purple },
];

// ========== ВИДЖЕТЫ ==========

function MetricCard({ metric, onCardClick }: { metric: FinanceMetric; onCardClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  const formatValue = (value: number, unit?: string) => {
    if (unit === 'million') {
      return `${value.toFixed(1)}M ₽`;
    }
    if (unit === 'percent') {
      return `${value.toFixed(1)}%`;
    }
    return `${value.toFixed(1)}M ₽`;
  };

  const baseClassName = `card flex flex-col justify-between relative min-h-[120px] sm:min-h-[140px] w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow`;

  const cardStyle = {
    backgroundColor: '#060010',
    borderColor: 'var(--border-color)',
    color: 'var(--white)',
    '--glow-x': '50%',
    '--glow-y': '50%',
    '--glow-intensity': '0',
    '--glow-radius': '250px',
    '--glow-color': metric.color
  } as React.CSSProperties;

  const content = (
    <motion.div 
      className="h-full flex flex-col cursor-pointer"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onCardClick}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
          {formatValue(metric.value, metric.unit)}
        </div>
        <div className="flex flex-col items-end gap-1">
          <motion.div 
            className="text-xl sm:text-2xl"
            animate={{ scale: isHovered ? 1.3 : 1, rotate: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            {metric.icon}
          </motion.div>
          <motion.div 
            className={`flex items-center gap-1 text-xs px-2 sm:px-3 py-1 rounded-full border backdrop-blur-sm ${
              metric.trend === 'up' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
              metric.trend === 'down' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
              'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
          >
            {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
            {Math.abs(metric.change)}%
          </motion.div>
        </div>
      </div>
      
      <div className="space-y-1 sm:space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-xs sm:text-sm font-medium line-clamp-1">{metric.label}</span>
        </div>
        
        <div className="text-white/60 text-xs line-clamp-2 leading-relaxed">
          {metric.description}
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${metric.color}, 0.4) 0%, transparent 50%)`
        }}
      />

      <AnimatePresence>
        {isHovered && (
          <motion.div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-2xl flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium text-xs sm:text-sm shadow-lg"
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              👁️ Подробнее
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <AdvancedParticleCard
      className={baseClassName}
      style={cardStyle}
      particleCount={12}
      glowColor={metric.color}
      enableTilt={true}
      clickEffect={true}
      enableMagnetism={true}
      intensity={1.2}
      onCardClick={onCardClick}
    >
      {content}
    </AdvancedParticleCard>
  );
}

function RevenueChartWidget() {
  const maxValue = Math.max(...revenueData.map(d => d.value));
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.value, 0);
  const averagePerMonth = totalRevenue / revenueData.length;

  return (
    <AdvancedParticleCard
      className="card flex flex-col justify-between relative min-h-[280px] sm:min-h-[300px] w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': COLORS.success,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={COLORS.success}
      intensity={1.4}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="font-semibold text-white text-base sm:text-lg">Динамика доходов</h3>
          <span className="text-white/60 text-xs sm:text-sm">млн ₽ в месяц</span>
        </div>
        
        <div className="flex-grow flex items-end justify-between px-1 sm:px-2 pb-3 sm:pb-4">
          {revenueData.map((data, index) => (
            <motion.div 
              key={data.label}
              className="flex flex-col items-center"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                className="w-4 sm:w-6 md:w-8 bg-gradient-to-t from-green-500 to-emerald-500 rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                style={{ height: `${(data.value / maxValue) * 100}%`, minHeight: '15px', maxHeight: '100px' }}
              >
                <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {data.value}M ₽
                </div>
              </div>
              <div className="text-white text-xs sm:text-sm mt-1 sm:mt-2">{data.label}</div>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center pt-4 sm:pt-6 border-t border-white/10">
          <div>
            <div className="text-white font-bold text-base sm:text-xl">
              {totalRevenue.toFixed(0)}M
            </div>
            <div className="text-white/60 text-xs">Всего доходов</div>
          </div>
          <div>
            <div className="text-white font-bold text-base sm:text-xl">
              {averagePerMonth.toFixed(1)}M
            </div>
            <div className="text-white/60 text-xs">Среднее в месяц</div>
          </div>
          <div>
            <div className="text-green-400 font-bold text-base sm:text-xl">+15%</div>
            <div className="text-white/60 text-xs">Рост за полгода</div>
          </div>
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${COLORS.success}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

function ExpenseChartWidget() {
  const maxValue = Math.max(...expenseData.map(d => d.value));
  const totalExpenses = expenseData.reduce((sum, d) => sum + d.value, 0);
  const averagePerMonth = totalExpenses / expenseData.length;

  return (
    <AdvancedParticleCard
      className="card flex flex-col justify-between relative min-h-[280px] sm:min-h-[300px] w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': COLORS.blue,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={COLORS.blue}
      intensity={1.4}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="font-semibold text-white text-base sm:text-lg">Динамика расходов</h3>
          <span className="text-white/60 text-xs sm:text-sm">млн ₽ в месяц</span>
        </div>
        
        <div className="flex-grow flex items-end justify-between px-1 sm:px-2 pb-3 sm:pb-4">
          {expenseData.map((data, index) => (
            <motion.div 
              key={data.label}
              className="flex flex-col items-center"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                className="w-4 sm:w-6 md:w-8 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                style={{ height: `${(data.value / maxValue) * 100}%`, minHeight: '15px', maxHeight: '100px' }}
              >
                <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {data.value}M ₽
                </div>
              </div>
              <div className="text-white text-xs sm:text-sm mt-1 sm:mt-2">{data.label}</div>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center pt-4 sm:pt-6 border-t border-white/10">
          <div>
            <div className="text-white font-bold text-base sm:text-xl">
              {totalExpenses.toFixed(0)}M
            </div>
            <div className="text-white/60 text-xs">Всего расходов</div>
          </div>
          <div>
            <div className="text-white font-bold text-base sm:text-xl">
              {averagePerMonth.toFixed(1)}M
            </div>
            <div className="text-white/60 text-xs">Среднее в месяц</div>
          </div>
          <div>
            <div className="text-red-400 font-bold text-base sm:text-xl">+8%</div>
            <div className="text-white/60 text-xs">Рост за полгода</div>
          </div>
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${COLORS.blue}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

function RecentTransactionsWidget({ onTransactionClick }: { onTransactionClick: (transaction: Transaction) => void }) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = recentTransactions.filter(transaction => 
    filter === 'all' || transaction.type === filter
  );

  return (
    <AdvancedParticleCard
      className="card flex flex-col justify-between relative min-h-[350px] sm:min-h-[400px] w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': COLORS.orange,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={COLORS.orange}
      intensity={1.3}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <h3 className="font-semibold text-white text-base sm:text-lg">Последние транзакции</h3>
          <div className="flex gap-1">
            {(['all', 'income', 'expense'] as const).map((filterType) => (
              <motion.button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all duration-300 backdrop-blur-sm border ${
                  filter === filterType
                    ? 'bg-white/20 text-white border-white/30'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border-white/10 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filterType === 'all' && 'Все'}
                {filterType === 'income' && 'Доходы'}
                {filterType === 'expense' && 'Расходы'}
              </motion.button>
            ))}
          </div>
        </div>
        
        <div className="flex-grow space-y-3 sm:space-y-4 overflow-y-auto">
          {filteredTransactions.map((transaction, index) => (
            <motion.div 
              key={transaction.id}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/5 hover:border-white/10 group backdrop-blur-sm cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4, scale: 1.02 }}
              onClick={() => onTransactionClick(transaction)}
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center backdrop-blur-sm border ${
                transaction.type === 'income' 
                  ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>
                {transaction.type === 'income' ? '⬇️' : '⬆️'}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <span className="text-white font-medium text-xs sm:text-sm truncate">
                    {transaction.description}
                  </span>
                  <span className={`text-xs sm:text-sm font-bold ${
                    transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-white/60 gap-1">
                  <span className="truncate">{transaction.category}</span>
                  <span>{new Date(transaction.date).toLocaleDateString('ru-RU')}</span>
                </div>
                {transaction.recipient && (
                  <div className="text-white/40 text-xs mt-1 truncate">
                    {transaction.recipient}
                  </div>
                )}
              </div>
              
              <div className={`px-2 sm:px-3 py-1 rounded-full text-xs border backdrop-blur-sm ${
                transaction.status === 'completed' 
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : transaction.status === 'pending'
                  ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  : 'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>
                {transaction.status === 'completed' ? 'Завершено' : 
                 transaction.status === 'pending' ? 'Ожидание' : 'Ошибка'}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
          <motion.button 
            className="w-full py-2 sm:py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20 text-xs sm:text-sm backdrop-blur-sm"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Показать все транзакции →
          </motion.button>
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${COLORS.orange}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

function BudgetOverviewWidget({ onCategoryClick }: { onCategoryClick: (category: BudgetCategory) => void }) {
  const totalAllocated = budgetCategories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const overallPercentage = Math.round((totalSpent / totalAllocated) * 100);

  return (
    <AdvancedParticleCard
      className="card flex flex-col justify-between relative min-h-[350px] sm:min-h-[400px] w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': COLORS.emerald,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={COLORS.emerald}
      intensity={1.3}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="font-semibold text-white text-base sm:text-lg">Обзор бюджета</h3>
          <div className="text-white/60 text-xs sm:text-sm">
            Использовано: {overallPercentage}%
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <ProgressBar 
            value={overallPercentage} 
            color={`rgb(${overallPercentage > 90 ? COLORS.error : overallPercentage > 80 ? COLORS.warning : COLORS.success})`}
            height="lg"
            animated={true}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center mb-4 sm:mb-6">
          <div>
            <div className="text-white font-bold text-base sm:text-xl">{formatCurrency(totalAllocated)}</div>
            <div className="text-white/60 text-xs">Выделено</div>
          </div>
          <div>
            <div className="text-white font-bold text-base sm:text-xl">{formatCurrency(totalSpent)}</div>
            <div className="text-white/60 text-xs">Потрачено</div>
          </div>
          <div>
            <div className="text-green-400 font-bold text-base sm:text-xl">{formatCurrency(totalRemaining)}</div>
            <div className="text-white/60 text-xs">Остаток</div>
          </div>
        </div>

        <div className="flex-grow space-y-3 sm:space-y-4">
          {budgetCategories.map((category, index) => (
            <motion.div 
              key={category.id}
              className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/5 hover:border-white/10 group backdrop-blur-sm cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 2, scale: 1.02 }}
              onClick={() => onCategoryClick(category)}
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="text-lg sm:text-xl">{category.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs sm:text-sm font-medium truncate">{category.name}</div>
                  <ProgressBar 
                    value={category.percentage} 
                    color={`rgb(${category.color})`}
                    height="sm"
                    showLabel={false}
                    animated={true}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="text-white text-xs sm:text-sm font-bold">{category.percentage}%</div>
                <div className="text-white/60 text-xs">{formatCurrency(category.spent)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${COLORS.emerald}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

function FinancialAlertsWidget() {
  return (
    <AdvancedParticleCard
      className="card flex flex-col justify-between relative min-h-[280px] sm:min-h-[300px] w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': COLORS.warning,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={COLORS.warning}
      intensity={1.2}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="font-semibold text-white text-base sm:text-lg">Финансовые алерты</h3>
          <span className="text-white/60 text-xs sm:text-sm">{financialAlerts.length} активных</span>
        </div>
        
        <div className="flex-grow space-y-3 sm:space-y-4">
          {financialAlerts.map((alert, index) => (
            <motion.div 
              key={alert.id}
              className="p-3 sm:p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] cursor-pointer backdrop-blur-sm group"
              style={{
                backgroundColor: `rgba(${getAlertColor(alert.type)}, 0.1)`,
                borderColor: `rgba(${getAlertColor(alert.type)}, 0.3)`,
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4, y: -2 }}
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div 
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: `rgb(${getAlertColor(alert.type)})` }}
                  />
                  <span className="text-white font-medium text-xs sm:text-sm">{alert.title}</span>
                </div>
                {alert.amount && (
                  <span className="text-white/80 text-xs sm:text-sm font-bold">
                    {formatCurrency(alert.amount)}
                  </span>
                )}
              </div>
              
              <p className="text-white/60 text-xs mb-2 sm:mb-3 leading-relaxed">{alert.message}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-xs">
                  {new Date(alert.date).toLocaleDateString('ru-RU')}
                </span>
                {alert.action && (
                  <button className="text-white/60 hover:text-white text-xs transition-colors group-hover:translate-x-1 transform duration-200">
                    {alert.action} →
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
          <motion.button 
            className="w-full py-2 sm:py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20 text-xs sm:text-sm backdrop-blur-sm"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Все алерты →
          </motion.button>
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${COLORS.warning}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

function QuickActionsWidget() {
  const actions = [
    { icon: '💰', label: 'Управление бюджетом', description: 'Контроль и распределение', color: COLORS.success },
    { icon: '📊', label: 'Финансовые отчеты', description: 'Анализ и статистика', color: COLORS.blue },
    { icon: '💳', label: 'Транзакции', description: 'Все финансовые операции', color: COLORS.purple },
    { icon: '⚡', label: 'Быстрый анализ', description: 'Экспресс-аналитика', color: COLORS.orange },
  ];

  return (
    <AdvancedParticleCard
      className="card flex flex-col justify-between relative min-h-[280px] sm:min-h-[300px] w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': COLORS.info,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={COLORS.info}
      intensity={1.1}
    >
      <div className="h-full flex flex-col relative z-10">
        <h3 className="font-semibold text-white text-base sm:text-lg mb-4 sm:mb-6">Быстрый доступ</h3>
        
        <div className="space-y-3 sm:space-y-4">
          {actions.map((action, index) => (
            <motion.div 
              key={action.label}
              className="p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 group border border-white/5 hover:border-white/10 backdrop-blur-sm cursor-pointer"
              whileHover={{ scale: 1.03, x: 4, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">{action.icon}</div>
                <div className="flex-grow min-w-0">
                  <div className="text-white/80 text-xs sm:text-sm font-medium truncate">{action.label}</div>
                  <div className="text-white/60 text-xs truncate">{action.description}</div>
                </div>
                <span className="text-white/60 group-hover:text-white transition-colors transform group-hover:translate-x-1 duration-200">
                  →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${COLORS.info}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

function TimeRangeSelector({ selectedRange, onRangeChange }: { selectedRange: string; onRangeChange: (range: string) => void }) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
      {timeRanges.map((range) => (
        <motion.button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
            selectedRange === range.value
              ? 'bg-white/20 text-white shadow-lg border border-white/30'
              : 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {range.label}
        </motion.button>
      ))}
    </div>
  );
}

function FilterSelector({ selectedFilter, onFilterChange }: { selectedFilter: string; onFilterChange: (filter: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1 sm:gap-2">
      {filterOptions.map((filter) => (
        <motion.button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 backdrop-blur-lg border ${
            selectedFilter === filter.value
              ? 'bg-white/20 text-white border-white/40 shadow-lg'
              : 'text-white/60 hover:text-white border-white/20 hover:border-white/30 bg-white/10'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {filter.label}
          {filter.count && (
            <span className="ml-1 sm:ml-2 px-1 py-0.5 rounded-full bg-white/20 text-xs">
              {formatNumber(filter.count)}
            </span>
          )}
        </motion.button>
      ))}
    </div>
  );
}

// ========== ОСНОВНОЙ КОМПОНЕНТ ==========

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

export default function FinanceModule() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [selectedTimeRange, setSelectedTimeRange] = useState('3m');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [modal, setModal] = useState<ModalState>({ isOpen: false, type: null });

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

  const totalIncome = useMemo(() => 
    recentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0), 
  []);

  const totalExpenses = useMemo(() => 
    recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0), 
  []);

  const handleMetricClick = (metric: FinanceMetric) => {
    setModal({ isOpen: true, type: 'metric', data: metric });
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setModal({ isOpen: true, type: 'transaction', data: transaction });
  };

  const handleBudgetCategoryClick = (category: BudgetCategory) => {
    setModal({ isOpen: true, type: 'budget', data: category });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null });
  };

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

        /* Адаптивные стили для больших экранов */
        @media (min-width: 1536px) {
          .bento-section {
            max-width: 1800px;
          }
        }

        @media (min-width: 1920px) {
          .bento-section {
            max-width: 2000px;
          }
        }
      `}</style>

      <GlobalSpotlight
        gridRef={gridRef}
        disableAnimations={shouldDisableAnimations}
        enabled={true}
        spotlightRadius={DEFAULT_SPOTLIGHT_RADIUS}
        glowColor={DEFAULT_GLOW_COLOR}
      />

      {/* Модальные окна */}
      <AnimatePresence>
        {modal.isOpen && modal.type === 'transaction' && (
          <TransactionModal 
            isOpen={modal.isOpen} 
            onClose={closeModal} 
            transaction={modal.data} 
          />
        )}
        {modal.isOpen && modal.type === 'budget' && (
          <BudgetModal 
            isOpen={modal.isOpen} 
            onClose={closeModal} 
            category={modal.data} 
          />
        )}
        {modal.isOpen && modal.type === 'metric' && (
          <MetricModal 
            isOpen={modal.isOpen} 
            onClose={closeModal} 
            metric={modal.data} 
          />
        )}
      </AnimatePresence>

      <motion.header 
        className="sticky top-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer">
                <motion.span
                  whileHover={{ x: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  ←
                </motion.span>
                <span className="text-sm sm:text-base">На главную</span>
              </div>
              <div className="text-white/60 text-xs sm:text-sm text-right">
                <div>{currentDate}</div>
                <div>{currentTime}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.div 
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-white text-xs sm:text-sm">Финансы активны</span>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <motion.h1 
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-2xl sm:text-3xl lg:text-4xl">💰</span>
                  <span>Финансовый модуль</span>
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Комплексное управление финансами, мониторинг доходов и расходов, анализ финансовых показателей и оптимизация бюджетных средств
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>28.4M ₽ доходы</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>32.1M ₽ расходы</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>87% эффективность</span>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="text-right"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-white font-bold text-xl sm:text-2xl bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg">
                  94%
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Бюджет исполнен</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сегодня</div>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between pt-4 sm:pt-6 border-t border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <TimeRangeSelector 
                selectedRange={selectedTimeRange}
                onRangeChange={setSelectedTimeRange}
              />
              
              <div className="flex gap-2 sm:gap-3">
                <motion.button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white transition-all duration-300 text-xs sm:text-sm font-medium backdrop-blur-sm flex items-center gap-1 sm:gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Фильтры</span>
                  <span>{isFilterOpen ? '▲' : '▼'}</span>
                </motion.button>
              </div>
            </motion.div>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 overflow-hidden"
                >
                  <FilterSelector 
                    selectedFilter={selectedFilter}
                    onFilterChange={setSelectedFilter}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center">
                <div className="text-green-400 font-bold text-base sm:text-xl">{formatCurrency(totalIncome)}</div>
                <div className="text-white/60 text-xs">Общий доход</div>
              </div>
              <div className="text-center">
                <div className="text-red-400 font-bold text-base sm:text-xl">{formatCurrency(totalExpenses)}</div>
                <div className="text-white/60 text-xs">Общие расходы</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-bold text-base sm:text-xl">{formatCurrency(totalIncome - totalExpenses)}</div>
                <div className="text-white/60 text-xs">Баланс</div>
              </div>
            </motion.div>
            
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-tr from-emerald-500/15 to-cyan-500/15 rounded-full blur-xl" />
          </div>
        </motion.section>

        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Финансовые показатели</h2>
          <BentoCardGrid gridRef={gridRef} className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
              {financeMetrics.map((metric, index) => (
                <MetricCard key={metric.label} metric={metric} onCardClick={() => handleMetricClick(metric)} />
              ))}
            </div>
          </BentoCardGrid>
        </motion.section>

        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <BentoCardGrid gridRef={gridRef}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              <div className="xl:col-span-2">
                <RevenueChartWidget />
              </div>

              <div className="xl:col-span-2">
                <ExpenseChartWidget />
              </div>

              <div className="xl:col-span-2">
                <RecentTransactionsWidget onTransactionClick={handleTransactionClick} />
              </div>

              <div className="xl:col-span-2">
                <BudgetOverviewWidget onCategoryClick={handleBudgetCategoryClick} />
              </div>

              <div className="xl:col-span-2">
                <FinancialAlertsWidget />
              </div>

              <div className="xl:col-span-2">
                <QuickActionsWidget />
              </div>
            </div>
          </BentoCardGrid>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
            <div className="text-center">
              <h3 className="font-semibold text-white text-lg sm:text-xl mb-2 sm:mb-3">Нужен детальный финансовый анализ?</h3>
              <p className="text-white/60 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">
                Используйте расширенные инструменты для глубокого анализа финансовых показателей и прогнозирования
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <motion.button 
                  className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white transition-all duration-300 text-sm sm:text-base font-medium backdrop-blur-sm"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Расширенная аналитика
                </motion.button>
                <motion.button 
                  className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 transition-all duration-300 text-sm sm:text-base font-medium backdrop-blur-sm"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Экспорт отчетов
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <motion.footer 
        className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-8 sm:mt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 text-white/60 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 text-center sm:text-left">
              <span>© 2024 Система управления социальными услугами</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Финансовый модуль v2.0</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span>{recentTransactions.length} транзакций</span>
              <span>•</span>
              <span>Обновлено: {currentTime}</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}