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

const DEFAULT_PARTICLE_COUNT = 16;
const DEFAULT_SPOTLIGHT_RADIUS = 400;
const DEFAULT_GLOW_COLOR = '59, 130, 246';
const MOBILE_BREAKPOINT = 768;

interface Report {
  id: string;
  title: string;
  type: 'statistical' | 'financial' | 'operational' | 'quality';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  status: 'scheduled' | 'in-progress' | 'completed' | 'published';
  lastRun: string;
  nextRun: string;
  generatedBy: string;
  recipients: string[];
  automation: boolean;
  dataSources: string[];
  color: string;
  icon: string;
  description?: string;
  progress?: number;
  size?: 'small' | 'medium' | 'large';
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  lastUsed: string;
  usageCount: number;
  color: string;
  icon: string;
  complexity: 'simple' | 'medium' | 'complex';
  estimatedTime: number;
  size?: 'small' | 'medium' | 'large';
}

interface ReportSchedule {
  id: string;
  reportName: string;
  frequency: string;
  nextRun: string;
  status: 'active' | 'paused';
  recipients: string[];
  color: string;
  lastExecution?: string;
  successRate: number;
  size?: 'small' | 'medium' | 'large';
}

interface ModalState {
  isOpen: boolean;
  type: 'report' | 'template' | 'schedule' | null;
  data?: any;
}

// ========== УТИЛИТЫ ==========

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusColor = (status: Report['status']) => {
  switch (status) {
    case 'completed': return COLORS.success;
    case 'in-progress': return COLORS.blue;
    case 'scheduled': return COLORS.orange;
    case 'published': return COLORS.purple;
    default: return COLORS.gray;
  }
};

const getTypeColor = (type: Report['type']) => {
  switch (type) {
    case 'statistical': return COLORS.blue;
    case 'financial': return COLORS.emerald;
    case 'operational': return COLORS.orange;
    case 'quality': return COLORS.purple;
    default: return COLORS.gray;
  }
};

const getStatusText = (status: Report['status']) => {
  switch (status) {
    case 'completed': return 'Завершён';
    case 'in-progress': return 'В процессе';
    case 'scheduled': return 'Запланирован';
    case 'published': return 'Опубликован';
    default: return 'Неизвестно';
  }
};

const getTypeText = (type: Report['type']) => {
  switch (type) {
    case 'statistical': return 'Статистика';
    case 'financial': return 'Финансы';
    case 'operational': return 'Операции';
    case 'quality': return 'Качество';
    default: return 'Другое';
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

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

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
    if (!cardRef.current || !isHoveredRef.current || disableAnimations) return;

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
  }, [particleCount, glowColor, intensity, disableAnimations]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      if (!disableAnimations) {
        animateParticles();
      }

      if (enableTilt && !disableAnimations) {
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
      if (!disableAnimations) {
        clearAllParticles();
      }

      if (enableTilt && !disableAnimations) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
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
      if ((!enableTilt && !enableMagnetism) || disableAnimations) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      element.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
      element.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
    };

    const handleClick = (e: MouseEvent) => {
      if (clickEffect && !disableAnimations) {
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
      whileHover={!disableAnimations ? { y: -6 } : {}}
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

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlight || !gridRef.current) return;

      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      if (!mouseInside) {
        gsap.to(spotlight, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out'
        });
        return;
      }

      gsap.to(spotlight, {
        left: e.clientX,
        top: e.clientY,
        opacity: 0.9,
        duration: 0.15,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      if (spotlight) {
        gsap.to(spotlight, {
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
      spotlight?.remove();
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
    className={`bento-section grid gap-4 sm:gap-6 p-4 sm:p-6 max-w-7xl mx-auto select-none relative ${className}`}
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        className={`bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/20 shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200 text-white/60 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ReportModal: React.FC<{ isOpen: boolean; onClose: () => void; report: Report }> = ({ 
  isOpen, 
  onClose, 
  report 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Детали отчета: ${report.title}`} size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{report.icon}</div>
            <div className="text-white/60 text-sm mt-1">Тип отчета</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white" style={{ color: `rgb(${getStatusColor(report.status)})` }}>
              {getStatusText(report.status)}
            </div>
            <div className="text-white/60 text-sm mt-1">Статус</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-lg">Информация о выполнении</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-white/60 text-sm">Последний запуск</div>
              <div className="text-white font-bold">{formatDateTime(report.lastRun)}</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-white/60 text-sm">Следующий запуск</div>
              <div className="text-white font-bold">{formatDateTime(report.nextRun)}</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-white/60 text-sm">Периодичность</div>
              <div className="text-white font-bold">{report.frequency}</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-white/60 text-sm">Автоматизация</div>
              <div className="text-white font-bold">{report.automation ? 'Да' : 'Нет'}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Получатели отчета</h4>
          <div className="flex flex-wrap gap-2">
            {report.recipients.map((recipient, index) => (
              <span
                key={index}
                className="px-3 py-2 rounded-lg text-sm bg-white/10 text-white/80 backdrop-blur-sm border border-white/5"
              >
                {recipient}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button className="flex-1 py-3 px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-xl transition-all duration-300">
            Скачать отчет
          </button>
          <button className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-300">
            Настроить шаблон
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

const reportsData: Report[] = [
  {
    id: '1',
    title: 'Ежемесячный отчет по услугам',
    type: 'statistical',
    frequency: 'monthly',
    status: 'completed',
    lastRun: '2024-11-01T10:00:00',
    nextRun: '2024-12-01T10:00:00',
    generatedBy: 'Автоматическая система',
    recipients: ['Руководство', 'Отдел качества', 'Бухгалтерия'],
    automation: true,
    dataSources: ['CRM', 'Система учета услуг', 'База клиентов'],
    color: COLORS.blue,
    icon: '📊',
    description: 'Полный статистический анализ предоставляемых услуг за отчетный период с детализацией по категориям и динамикой изменений',
    progress: 100,
    size: 'medium'
  },
  {
    id: '2',
    title: 'Квартальный финансовый отчет',
    type: 'financial',
    frequency: 'quarterly',
    status: 'scheduled',
    lastRun: '2024-10-01T09:00:00',
    nextRun: '2025-01-01T09:00:00',
    generatedBy: 'Финансовый отдел',
    recipients: ['Дирекция', 'Бухгалтерия', 'Аудиторы'],
    automation: false,
    dataSources: ['1C', 'Банковские выписки', 'Договоры'],
    color: COLORS.emerald,
    icon: '💰',
    description: 'Детальный финансовый анализ деятельности организации с прогнозами и рекомендациями',
    progress: 0,
    size: 'large'
  },
  {
    id: '3',
    title: 'Отчет по качеству услуг',
    type: 'quality',
    frequency: 'weekly',
    status: 'in-progress',
    lastRun: '2024-11-15T08:00:00',
    nextRun: '2024-11-22T08:00:00',
    generatedBy: 'Отдел качества',
    recipients: ['Руководство', 'Операционные отделы'],
    automation: true,
    dataSources: ['Опросы', 'Отзывы', 'Метрики качества'],
    color: COLORS.purple,
    icon: '⭐',
    description: 'Анализ удовлетворенности клиентов и качества предоставляемых услуг с рейтингами и отзывами',
    progress: 65,
    size: 'medium'
  },
  {
    id: '4',
    title: 'Операционная статистика',
    type: 'operational',
    frequency: 'daily',
    status: 'published',
    lastRun: '2024-11-18T18:00:00',
    nextRun: '2024-11-19T18:00:00',
    generatedBy: 'Автоматическая система',
    recipients: ['Менеджеры', 'Операторы'],
    automation: true,
    dataSources: ['Логи системы', 'CRM', 'Расписание'],
    color: COLORS.orange,
    icon: '⚡',
    description: 'Ежедневная операционная сводка по ключевым показателям эффективности',
    progress: 100,
    size: 'small'
  },
  {
    id: '5',
    title: 'Годовой отчет деятельности',
    type: 'statistical',
    frequency: 'annual',
    status: 'scheduled',
    lastRun: '2023-12-31T23:59:00',
    nextRun: '2024-12-31T23:59:00',
    generatedBy: 'Аналитический отдел',
    recipients: ['Правление', 'Учредители', 'Регуляторы'],
    automation: false,
    dataSources: ['Все системы', 'Архив', 'Внешние данные'],
    color: COLORS.indigo,
    icon: '📈',
    description: 'Комплексный годовой отчет о деятельности организации с анализом трендов и достижений',
    progress: 0,
    size: 'large'
  },
  {
    id: '6',
    title: 'Отчет по клиентской базе',
    type: 'statistical',
    frequency: 'monthly',
    status: 'completed',
    lastRun: '2024-11-05T11:00:00',
    nextRun: '2024-12-05T11:00:00',
    generatedBy: 'Автоматическая система',
    recipients: ['Маркетинг', 'Отдел продаж', 'Руководство'],
    automation: true,
    dataSources: ['CRM', 'База клиентов', 'История обращений'],
    color: COLORS.teal,
    icon: '👥',
    description: 'Анализ клиентской базы и динамики изменений с сегментацией и прогнозами',
    progress: 100,
    size: 'medium'
  },
  {
    id: '7',
    title: 'Отчет по персоналу',
    type: 'operational',
    frequency: 'monthly',
    status: 'in-progress',
    lastRun: '2024-11-10T14:00:00',
    nextRun: '2024-12-10T14:00:00',
    generatedBy: 'HR отдел',
    recipients: ['Руководство', 'HR'],
    automation: true,
    dataSources: ['HR система', 'Табель учета', 'Отзывы'],
    color: COLORS.pink,
    icon: '👨‍💼',
    description: 'Анализ эффективности работы персонала и текучести кадров',
    progress: 45,
    size: 'medium'
  },
  {
    id: '8',
    title: 'Маркетинговый отчет',
    type: 'statistical',
    frequency: 'weekly',
    status: 'published',
    lastRun: '2024-11-17T16:00:00',
    nextRun: '2024-11-24T16:00:00',
    generatedBy: 'Маркетинговый отдел',
    recipients: ['Маркетинг', 'Руководство'],
    automation: true,
    dataSources: ['Google Analytics', 'Соцсети', 'CRM'],
    color: COLORS.rose,
    icon: '🎯',
    description: 'Анализ эффективности маркетинговых кампаний и конверсии',
    progress: 100,
    size: 'small'
  }
];

const reportTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Стандартный статистический отчет',
    description: 'Базовая статистика по услугам и клиентам с автоматической визуализацией данных',
    category: 'statistical',
    lastUsed: '2024-11-15',
    usageCount: 45,
    color: COLORS.blue,
    icon: '📊',
    complexity: 'medium',
    estimatedTime: 30,
    size: 'medium'
  },
  {
    id: '2',
    name: 'Финансовый обзор',
    description: 'Отчет о доходах и расходах с детализацией по статьям и периодам',
    category: 'financial',
    lastUsed: '2024-11-10',
    usageCount: 23,
    color: COLORS.emerald,
    icon: '💰',
    complexity: 'complex',
    estimatedTime: 45,
    size: 'large'
  },
  {
    id: '3',
    name: 'Анализ качества услуг',
    description: 'Детальный анализ удовлетворенности клиентов и метрик качества обслуживания',
    category: 'quality',
    lastUsed: '2024-11-12',
    usageCount: 18,
    color: COLORS.purple,
    icon: '⭐',
    complexity: 'medium',
    estimatedTime: 25,
    size: 'medium'
  },
  {
    id: '4',
    name: 'Операционная эффективность',
    description: 'Метрики производительности, загрузки ресурсов и операционные показатели',
    category: 'operational',
    lastUsed: '2024-11-14',
    usageCount: 32,
    color: COLORS.orange,
    icon: '⚡',
    complexity: 'simple',
    estimatedTime: 15,
    size: 'small'
  },
  {
    id: '5',
    name: 'HR аналитика',
    description: 'Отчет по персоналу с анализом KPI и эффективности сотрудников',
    category: 'operational',
    lastUsed: '2024-11-08',
    usageCount: 12,
    color: COLORS.pink,
    icon: '👥',
    complexity: 'medium',
    estimatedTime: 20,
    size: 'medium'
  },
  {
    id: '6',
    name: 'Маркетинговая аналитика',
    description: 'Анализ рекламных кампаний и эффективности каналов привлечения',
    category: 'statistical',
    lastUsed: '2024-11-16',
    usageCount: 28,
    color: COLORS.rose,
    icon: '🎯',
    complexity: 'complex',
    estimatedTime: 35,
    size: 'large'
  }
];

const scheduledReports: ReportSchedule[] = [
  {
    id: '1',
    reportName: 'Ежедневная операционная сводка',
    frequency: 'Ежедневно в 09:00',
    nextRun: '2024-11-19T09:00:00',
    status: 'active',
    recipients: ['Менеджеры', 'Операторы'],
    color: COLORS.blue,
    lastExecution: '2024-11-18T09:00:00',
    successRate: 98,
    size: 'small'
  },
  {
    id: '2',
    reportName: 'Еженедельный отчет по качеству',
    frequency: 'Каждый понедельник',
    nextRun: '2024-11-25T08:00:00',
    status: 'active',
    recipients: ['Руководство', 'Отдел качества'],
    color: COLORS.purple,
    lastExecution: '2024-11-18T08:00:00',
    successRate: 95,
    size: 'medium'
  },
  {
    id: '3',
    reportName: 'Месячный финансовый отчет',
    frequency: '1-е число месяца',
    nextRun: '2024-12-01T10:00:00',
    status: 'active',
    recipients: ['Дирекция', 'Бухгалтерия'],
    color: COLORS.emerald,
    lastExecution: '2024-11-01T10:00:00',
    successRate: 100,
    size: 'large'
  },
  {
    id: '4',
    reportName: 'Квартальный стратегический отчет',
    frequency: 'Раз в квартал',
    nextRun: '2024-12-15T14:00:00',
    status: 'active',
    recipients: ['Правление', 'Стратегический отдел'],
    color: COLORS.indigo,
    lastExecution: '2024-09-15T14:00:00',
    successRate: 100,
    size: 'large'
  }
];

// ========== ВИДЖЕТЫ ==========

function ReportCard({ report, onCardClick }: { report: Report; onCardClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const statusColor = getStatusColor(report.status);
  const typeColor = getTypeColor(report.type);

  const sizeClasses = {
    small: 'min-h-[140px]',
    medium: 'min-h-[160px]',
    large: 'min-h-[180px]'
  };

  const baseClassName = `card flex flex-col justify-between relative w-full max-w-full p-4 sm:p-5 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow ${sizeClasses[report.size || 'medium']}`;

  const cardStyle = {
    backgroundColor: '#060010',
    borderColor: 'var(--border-color)',
    color: 'var(--white)',
    '--glow-x': '50%',
    '--glow-y': '50%',
    '--glow-intensity': '0',
    '--glow-radius': '250px',
    '--glow-color': report.color
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
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-grow">
          <motion.div 
            className="text-2xl"
            animate={{ scale: isHovered ? 1.3 : 1, rotate: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            {report.icon}
          </motion.div>
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold text-white text-sm sm:text-base mb-1 leading-tight line-clamp-2">
              {report.title}
            </h3>
            <p className="text-white/60 text-xs">
              {report.frequency}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
          <motion.div 
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border backdrop-blur-sm whitespace-nowrap ${
              report.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
              report.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
              report.status === 'scheduled' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
              'bg-purple-500/20 text-purple-400 border-purple-500/30'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
          >
            {report.status === 'completed' ? '✅' : 
             report.status === 'in-progress' ? '🔄' : 
             report.status === 'scheduled' ? '⏰' : '📤'}
            <span className="hidden sm:inline">{getStatusText(report.status)}</span>
            <span className="sm:hidden">
              {report.status === 'completed' ? 'Готов' : 
               report.status === 'in-progress' ? 'В работе' : 
               report.status === 'scheduled' ? 'План' : 'Публ.'}
            </span>
          </motion.div>
          <span 
            className="px-2 py-1 rounded-full text-xs whitespace-nowrap"
            style={{
              backgroundColor: `rgba(${typeColor}, 0.1)`,
              color: `rgb(${typeColor})`
            }}
          >
            {getTypeText(report.type)}
          </span>
        </div>
      </div>

      {report.description && (
        <p className="text-white/60 text-xs mb-4 leading-relaxed line-clamp-2 flex-grow">
          {report.description}
        </p>
      )}

      <div className="space-y-2 text-xs mb-4">
        <div className="flex justify-between">
          <span className="text-white/60">Последний запуск:</span>
          <span className="text-white text-right">{formatDate(report.lastRun)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Следующий запуск:</span>
          <span className="text-white text-right">{formatDate(report.nextRun)}</span>
        </div>
      </div>

      {report.progress !== undefined && report.progress > 0 && report.progress < 100 && (
        <div className="mb-3">
          <ProgressBar 
            value={report.progress} 
            color={`rgb(${statusColor})`}
            height="sm"
            animated={true}
          />
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-1">
          {report.recipients.slice(0, 2).map((recipient, index) => (
            <span 
              key={index}
              className="px-2 py-1 rounded-lg text-xs bg-white/10 text-white/70 whitespace-nowrap"
            >
              {recipient}
            </span>
          ))}
          {report.recipients.length > 2 && (
            <span className="text-white/60 text-xs">
              +{report.recipients.length - 2}
            </span>
          )}
        </div>
        <div className="text-white/60 text-xs whitespace-nowrap">
          {report.automation ? '🤖 Авто' : '👨‍💼 Ручной'}
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${report.color}, 0.4) 0%, transparent 50%)`
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
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium text-xs shadow-lg"
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
      glowColor={report.color}
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

function TemplateCard({ template }: { template: ReportTemplate }) {
  const sizeClasses = {
    small: 'min-h-[120px]',
    medium: 'min-h-[140px]',
    large: 'min-h-[160px]'
  };

  return (
    <AdvancedParticleCard
      className={`card flex flex-col justify-between relative w-full max-w-full p-4 sm:p-5 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow ${sizeClasses[template.size || 'medium']}`}
      style={{
        backgroundColor: '#060010',
        '--glow-color': template.color,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={template.color}
      intensity={1.1}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl">{template.icon}</div>
          <h3 className="font-semibold text-white text-sm flex-grow line-clamp-2">{template.name}</h3>
        </div>
        
        <p className="text-white/70 text-xs mb-4 flex-grow leading-relaxed line-clamp-2">
          {template.description}
        </p>

        <div className="flex justify-between items-center text-xs text-white/60">
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap">{template.usageCount} раз</span>
            <span className="px-2 py-1 rounded-full bg-white/10 text-white/70 text-xs whitespace-nowrap">
              {template.complexity === 'simple' ? 'Простой' : 
               template.complexity === 'medium' ? 'Средний' : 'Сложный'}
            </span>
          </div>
          <span className="whitespace-nowrap">{template.estimatedTime} мин</span>
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${template.color}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

function ScheduleCard({ schedule }: { schedule: ReportSchedule }) {
  const sizeClasses = {
    small: 'min-h-[120px]',
    medium: 'min-h-[140px]',
    large: 'min-h-[160px]'
  };

  return (
    <AdvancedParticleCard
      className={`card flex flex-col justify-between relative w-full max-w-full p-4 sm:p-5 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow ${sizeClasses[schedule.size || 'medium']}`}
      style={{
        backgroundColor: '#060010',
        '--glow-color': schedule.color,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={schedule.color}
      intensity={1.1}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-white text-sm flex-grow mr-2 line-clamp-2">{schedule.reportName}</h3>
          <span 
            className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
              schedule.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
            }`}
          >
            {schedule.status === 'active' ? 'Активен' : 'Приостановлен'}
          </span>
        </div>
        
        <div className="space-y-2 text-xs mb-4 flex-grow">
          <div className="flex justify-between">
            <span className="text-white/60">Периодичность:</span>
            <span className="text-white text-right">{schedule.frequency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Следующий запуск:</span>
            <span className="text-white text-right">{formatDateTime(schedule.nextRun)}</span>
          </div>
          {schedule.lastExecution && (
            <div className="flex justify-between">
              <span className="text-white/60">Последний запуск:</span>
              <span className="text-white text-right">{formatDateTime(schedule.lastExecution)}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-1">
            {schedule.recipients.slice(0, 2).map((recipient, index) => (
              <span 
                key={index}
                className="px-2 py-1 rounded-lg text-xs bg-white/10 text-white/70 whitespace-nowrap"
              >
                {recipient}
              </span>
            ))}
            {schedule.recipients.length > 2 && (
              <span className="text-white/60 text-xs">
                +{schedule.recipients.length - 2}
              </span>
            )}
          </div>
          <div className="text-green-400 text-xs font-bold whitespace-nowrap">
            {schedule.successRate}%
          </div>
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${schedule.color}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

function QuickActionCard({ action }: { action: { icon: string; label: string; color: string; description?: string } }) {
  return (
    <AdvancedParticleCard
      className="card flex flex-col justify-between relative min-h-[120px] w-full max-w-full p-4 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': action.color,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={action.color}
      intensity={1.0}
    >
      <div className="h-full flex flex-col items-center justify-center text-center p-2">
        <div className="text-2xl mb-2">
          {action.icon}
        </div>
        <h3 className="text-white font-semibold text-sm mb-1 leading-tight">
          {action.label}
        </h3>
        {action.description && (
          <p className="text-white/60 text-xs leading-tight">
            {action.description}
          </p>
        )}
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${action.color}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

// ========== ОСНОВНОЙ КОМПОНЕНТ ==========

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

export default function StatisticalReportsPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [activeTab, setActiveTab] = useState<'reports' | 'templates' | 'schedules'>('reports');
  const [reportFilter, setReportFilter] = useState<'all' | 'statistical' | 'financial' | 'operational' | 'quality'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in-progress' | 'scheduled' | 'published'>('all');
  const [modal, setModal] = useState<ModalState>({ isOpen: false, type: null });

  const stats = useMemo(() => ({
    totalReports: reportsData.length,
    automated: reportsData.filter(r => r.automation).length,
    completedThisMonth: reportsData.filter(r => r.status === 'completed' && 
      new Date(r.lastRun).getMonth() === new Date().getMonth()).length,
    scheduled: reportsData.filter(r => r.status === 'scheduled').length,
    inProgress: reportsData.filter(r => r.status === 'in-progress').length
  }), []);

  const filteredReports = useMemo(() => 
    reportsData.filter(report => {
      const typeMatch = reportFilter === 'all' || report.type === reportFilter;
      const statusMatch = statusFilter === 'all' || report.status === statusFilter;
      return typeMatch && statusMatch;
    }),
  [reportFilter, statusFilter]);

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

  const handleReportClick = (report: Report) => {
    setModal({ isOpen: true, type: 'report', data: report });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null });
  };

  const quickActions = [
    { icon: '📝', label: 'Создать отчет', color: COLORS.blue, description: 'Новый отчет' },
    { icon: '🔄', label: 'Запустить все', color: COLORS.emerald, description: 'Автоматизация' },
    { icon: '⏰', label: 'Настроить расписание', color: COLORS.purple, description: 'Планирование' },
    { icon: '📧', label: 'Отправить отчеты', color: COLORS.orange, description: 'Рассылка' },
    { icon: '📊', label: 'Аналитика', color: COLORS.indigo, description: 'Статистика' },
    { icon: '⚙️', label: 'Настройки', color: COLORS.teal, description: 'Конфигурация' }
  ];

  const reportAnalytics = [
    { label: 'Статистические отчеты', value: 65, color: COLORS.blue },
    { label: 'Финансовые отчеты', value: 45, color: COLORS.emerald },
    { label: 'Операционные отчеты', value: 78, color: COLORS.orange },
    { label: 'Отчеты по качеству', value: 52, color: COLORS.purple }
  ];

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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
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
        {modal.isOpen && modal.type === 'report' && (
          <ReportModal 
            isOpen={modal.isOpen} 
            onClose={closeModal} 
            report={modal.data} 
          />
        )}
      </AnimatePresence>

      <motion.header 
        className="sticky top-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <Link href="/demo/social/owner" className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer">
                <motion.span
                  whileHover={{ x: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  ←
                </motion.span>
                <span className="text-sm sm:text-base">На главную</span>
              </Link>
              <div className="text-white/60 text-sm text-right">
                <div className="hidden sm:block">{currentDate}</div>
                <div>{currentTime}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-white text-sm">Система отчетов активна</span>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <motion.h1 
                  className="text-3xl sm:text-4xl font-bold text-white mb-3 flex items-center gap-3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-3xl sm:text-4xl">📊</span>
                  <span>Статистические отчеты</span>
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-base sm:text-lg mb-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Автоматизированная система генерации отчетов. Мониторинг показателей и аналитика деятельности организации.
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>{stats.totalReports} отчетов</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>{stats.automated} автоматизировано</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>{stats.inProgress} в процессе</span>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="text-right"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-white font-bold text-2xl sm:text-3xl bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl px-6 py-3 shadow-lg">
                  {stats.completedThisMonth}
                </div>
                <div className="text-white/60 text-sm mt-2">Завершено в этом месяце</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сегодня</div>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-6 border-t border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex space-x-1 p-1 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
                {[
                  { id: 'reports' as const, label: 'Отчеты', icon: '📋' },
                  { id: 'templates' as const, label: 'Шаблоны', icon: '📝' },
                  { id: 'schedules' as const, label: 'Расписание', icon: '⏰' }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white shadow-lg border border-white/30'
                        : 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </motion.button>
                ))}
              </div>
              
              {activeTab === 'reports' && (
                <div className="flex flex-wrap gap-2">
                  <select 
                    value={reportFilter}
                    onChange={(e) => setReportFilter(e.target.value as any)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm backdrop-blur-sm"
                  >
                    <option value="all">Все типы</option>
                    <option value="statistical">Статистические</option>
                    <option value="financial">Финансовые</option>
                    <option value="operational">Операционные</option>
                    <option value="quality">Качество</option>
                  </select>
                  
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm backdrop-blur-sm"
                  >
                    <option value="all">Все статусы</option>
                    <option value="completed">Завершённые</option>
                    <option value="in-progress">В процессе</option>
                    <option value="scheduled">Запланированные</option>
                    <option value="published">Опубликованные</option>
                  </select>
                </div>
              )}
            </motion.div>

            <motion.div 
              className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-green-400 font-bold text-xl">{stats.automated}</div>
                <div className="text-white/60 text-sm">Автоматизировано</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-blue-400 font-bold text-xl">{stats.inProgress}</div>
                <div className="text-white/60 text-sm">В процессе</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-orange-400 font-bold text-xl">{stats.scheduled}</div>
                <div className="text-white/60 text-sm">Запланировано</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-purple-400 font-bold text-xl">{stats.completedThisMonth}</div>
                <div className="text-white/60 text-sm">За этот месяц</div>
              </div>
            </motion.div>
            
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-500/15 to-cyan-500/15 rounded-full blur-xl" />
          </div>
        </motion.section>

        <motion.section
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {activeTab === 'reports' && (
            <BentoCardGrid gridRef={gridRef} className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                  <ReportCard key={report.id} report={report} onCardClick={() => handleReportClick(report)} />
                ))}
              </div>
            </BentoCardGrid>
          )}

          {activeTab === 'templates' && (
            <BentoCardGrid gridRef={gridRef} className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {reportTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </BentoCardGrid>
          )}

          {activeTab === 'schedules' && (
            <BentoCardGrid gridRef={gridRef} className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {scheduledReports.map((schedule) => (
                  <ScheduleCard key={schedule.id} schedule={schedule} />
                ))}
              </div>
            </BentoCardGrid>
          )}
        </motion.section>

        {/* Quick Actions and Analytics */}
        <motion.section 
          className="mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-6">
              <div className="h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-2xl">⚡</div>
                  <h2 className="text-xl font-bold text-white">Быстрые действия</h2>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-grow">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <QuickActionCard action={action} />
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center text-white/60 text-sm">
                    <span>Последнее действие: Создание отчета</span>
                    <span>Сегодня, 14:30</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Analytics */}
            <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-6">
              <div className="h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-2xl">📈</div>
                  <h2 className="text-xl font-bold text-white">Аналитика отчетов</h2>
                </div>
                
                <div className="space-y-4 flex-grow">
                  {reportAnalytics.map((item, index) => (
                    <motion.div 
                      key={index}
                      className="space-y-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">{item.label}</span>
                        <span className="text-white font-medium">{item.value}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <motion.div 
                          className="h-2 rounded-full transition-all duration-1000"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          style={{ backgroundColor: `rgb(${item.color})` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-white font-bold text-lg">12</div>
                    <div className="text-white/60 text-sm">Отчетов сегодня</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-white font-bold text-lg">89%</div>
                    <div className="text-white/60 text-sm">Автоматизация</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
            </div>
          </div>
        </motion.section>
      </main>

      <motion.footer 
        className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-white/60 text-sm">
            <div className="flex items-center gap-4">
              <span>© 2024 Система статистических отчетов</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Версия 2.1.0</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Обновлено: {new Date().toLocaleDateString('ru-RU')}</span>
              <span>•</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>Все системы активны</span>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}