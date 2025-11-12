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

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
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

    const handleClick = () => {
      if (onCardClick) {
        onCardClick();
      }
    };

    // Упрощенный обработчик для touch устройств
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      if (onCardClick) {
        onCardClick();
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);
    element.addEventListener('touchend', handleTouch, { passive: false });

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      element.removeEventListener('touchend', handleTouch);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, onCardClick]);

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
    const checkMobile = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

// Компонент для статуса заявки
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    'new': { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Новая' },
    'in-progress': { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'В работе' },
    'review': { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'На проверке' },
    'completed': { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Завершена' },
    'rejected': { color: 'bg-rose-500/20 text-rose-400 border-rose-500/30', label: 'Отклонена' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

// Компонент для приоритета
const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const priorityConfig = {
    'low': { color: 'bg-gray-500/20 text-gray-400', label: 'Низкий' },
    'medium': { color: 'bg-amber-500/20 text-amber-400', label: 'Средний' },
    'high': { color: 'bg-orange-500/20 text-orange-400', label: 'Высокий' },
    'critical': { color: 'bg-rose-500/20 text-rose-400', label: 'Критический' }
  };

  const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

// Типы данных для заявок
interface Request {
  id: string;
  title: string;
  client: string;
  type: string;
  status: 'new' | 'in-progress' | 'review' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created: Date;
  updated: Date;
  assignedTo?: string;
  description: string;
  budget?: number;
  deadline?: Date;
  attachments: number;
  comments: number;
  category: string;
}

// Расширенные моковые данные для заявок
const mockRequests: Request[] = [
  {
    id: 'REQ-001',
    title: 'Социальное сопровождение пожилого человека',
    client: 'Иванова Мария Петровна',
    type: 'Социальное обслуживание',
    status: 'new',
    priority: 'high',
    created: new Date('2024-01-15'),
    updated: new Date('2024-01-15'),
    description: 'Необходимо регулярное посещение и помощь в бытовых вопросах для одинокой пожилой женщины 78 лет. Требуется помощь в покупке продуктов, лекарств и решении бытовых вопросов.',
    budget: 15000,
    deadline: new Date('2024-02-15'),
    attachments: 3,
    comments: 2,
    category: 'Социальная помощь'
  },
  {
    id: 'REQ-002',
    title: 'Психологическая консультация для семьи',
    client: 'Семья Петровых',
    type: 'Психологическая помощь',
    status: 'in-progress',
    priority: 'medium',
    created: new Date('2024-01-14'),
    updated: new Date('2024-01-16'),
    assignedTo: 'Смирнова А.И.',
    description: 'Семейная консультация по вопросам детско-родительских отношений. Конфликт между подростком и родителями, требуется медиация.',
    budget: 8000,
    attachments: 1,
    comments: 5,
    category: 'Психология'
  },
  {
    id: 'REQ-003',
    title: 'Юридическая консультация по жилищному вопросу',
    client: 'Сидоров Алексей Владимирович',
    type: 'Юридическая помощь',
    status: 'review',
    priority: 'high',
    created: new Date('2024-01-13'),
    updated: new Date('2024-01-16'),
    assignedTo: 'Кузнецов П.С.',
    description: 'Вопросы приватизации муниципального жилья и оформления документов. Клиент проживает в квартире более 15 лет, требуется юридическое сопровождение.',
    budget: 12000,
    deadline: new Date('2024-01-30'),
    attachments: 5,
    comments: 8,
    category: 'Юридическая помощь'
  },
  {
    id: 'REQ-004',
    title: 'Оформление социальных льгот',
    client: 'Козлова Анна Сергеевна',
    type: 'Социальные выплаты',
    status: 'completed',
    priority: 'medium',
    created: new Date('2024-01-10'),
    updated: new Date('2024-01-15'),
    assignedTo: 'Иванова Т.М.',
    description: 'Помощь в оформлении пособия по инвалидности и дополнительных льгот. Клиент имеет 2 группу инвалидности.',
    budget: 5000,
    attachments: 2,
    comments: 3,
    category: 'Социальные выплаты'
  },
  {
    id: 'REQ-005',
    title: 'Организация досуга для детей-инвалидов',
    client: 'Общество инвалидов',
    type: 'Социальные мероприятия',
    status: 'in-progress',
    priority: 'high',
    created: new Date('2024-01-12'),
    updated: new Date('2024-01-16'),
    assignedTo: 'Петрова Е.В.',
    description: 'Организация культурно-развлекательного мероприятия для 15 детей с ограниченными возможностями. Планируется посещение театра и мастер-классы.',
    budget: 45000,
    deadline: new Date('2024-02-20'),
    attachments: 4,
    comments: 12,
    category: 'Мероприятия'
  },
  {
    id: 'REQ-006',
    title: 'Консультация по медицинскому уходу',
    client: 'Федоров Дмитрий Игоревич',
    type: 'Медицинская помощь',
    status: 'new',
    priority: 'critical',
    created: new Date('2024-01-16'),
    updated: new Date('2024-01-16'),
    description: 'Обучение правилам ухода за лежачим больным после инсульта. Требуется срочная консультация специалиста.',
    budget: 9000,
    attachments: 0,
    comments: 1,
    category: 'Медицинская помощь'
  },
  {
    id: 'REQ-007',
    title: 'Трудоустройство инвалида',
    client: 'Николаев Сергей Викторович',
    type: 'Трудовая адаптация',
    status: 'in-progress',
    priority: 'medium',
    created: new Date('2024-01-11'),
    updated: new Date('2024-01-16'),
    assignedTo: 'Васильев И.П.',
    description: 'Сопровождение процесса трудоустройства человека с ограниченными возможностями. Подбор вакансий, подготовка к собеседованию.',
    budget: 20000,
    deadline: new Date('2024-03-01'),
    attachments: 3,
    comments: 7,
    category: 'Трудоустройство'
  },
  {
    id: 'REQ-008',
    title: 'Помощь в получении образования',
    client: 'Орлова Елена Дмитриевна',
    type: 'Образовательные услуги',
    status: 'review',
    priority: 'medium',
    created: new Date('2024-01-09'),
    updated: new Date('2024-01-16'),
    assignedTo: 'Семенова О.Л.',
    description: 'Организация дистанционного обучения для ребенка-инвалида. Требуется техническое оснащение и методическая поддержка.',
    budget: 35000,
    attachments: 6,
    comments: 4,
    category: 'Образование'
  },
  {
    id: 'REQ-009',
    title: 'Социальная адаптация мигрантов',
    client: 'Центр работы с мигрантами',
    type: 'Социальная адаптация',
    status: 'completed',
    priority: 'low',
    created: new Date('2024-01-05'),
    updated: new Date('2024-01-14'),
    assignedTo: 'Ковалева М.С.',
    description: 'Программа социальной и культурной адаптации для семей мигрантов. Языковые курсы, правовые консультации.',
    budget: 28000,
    attachments: 8,
    comments: 15,
    category: 'Адаптация'
  },
  {
    id: 'REQ-010',
    title: 'Экстренная психологическая помощь',
    client: 'Анонимный клиент',
    type: 'Экстренная помощь',
    status: 'new',
    priority: 'critical',
    created: new Date('2024-01-16'),
    updated: new Date('2024-01-16'),
    description: 'Срочная психологическая консультация по телефону доверия. Кризисная ситуация, требуется немедленное вмешательство.',
    budget: 0,
    attachments: 0,
    comments: 0,
    category: 'Экстренная помощь'
  },
  {
    id: 'REQ-011',
    title: 'Ремонт жилья для ветерана',
    client: 'Ветераны труда',
    type: 'Бытовая помощь',
    status: 'in-progress',
    priority: 'high',
    created: new Date('2024-01-08'),
    updated: new Date('2024-01-16'),
    assignedTo: 'Борисов А.Н.',
    description: 'Капитальный ремонт квартиры ветерана труда. Замена электропроводки, сантехники, косметический ремонт.',
    budget: 75000,
    deadline: new Date('2024-02-28'),
    attachments: 7,
    comments: 9,
    category: 'Бытовая помощь'
  },
  {
    id: 'REQ-012',
    title: 'Организация летнего отдыха',
    client: 'Многодетные семьи',
    type: 'Детский отдых',
    status: 'review',
    priority: 'medium',
    created: new Date('2024-01-07'),
    updated: new Date('2024-01-16'),
    assignedTo: 'Зайцева Т.В.',
    description: 'Организация летнего лагеря для детей из многодетных семей. Программа рассчитана на 50 детей.',
    budget: 120000,
    attachments: 5,
    comments: 11,
    category: 'Детский отдых'
  }
];

// Фильтры для заявок
const statusFilters = [
  { id: 'all', label: 'Все заявки', count: mockRequests.length },
  { id: 'new', label: 'Новые', count: mockRequests.filter(r => r.status === 'new').length },
  { id: 'in-progress', label: 'В работе', count: mockRequests.filter(r => r.status === 'in-progress').length },
  { id: 'review', label: 'На проверке', count: mockRequests.filter(r => r.status === 'review').length },
  { id: 'completed', label: 'Завершенные', count: mockRequests.filter(r => r.status === 'completed').length }
];

// Категории заявок
const requestCategories = [
  { id: 'all', label: 'Все категории', count: mockRequests.length },
  { id: 'social', label: 'Социальная помощь', count: mockRequests.filter(r => r.category === 'Социальная помощь').length },
  { id: 'psychology', label: 'Психология', count: mockRequests.filter(r => r.category === 'Психология').length },
  { id: 'legal', label: 'Юридическая помощь', count: mockRequests.filter(r => r.category === 'Юридическая помощь').length },
  { id: 'medical', label: 'Медицинская помощь', count: mockRequests.filter(r => r.category === 'Медицинская помощь').length }
];

export default function RequestsOverview() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Упрощенная функция для открытия модального окна
  const handleRequestClick = (request: Request) => {
    console.log('Opening modal for request:', request.id);
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const filteredRequests = mockRequests.filter(request => {
    const matchesFilter = activeFilter === 'all' || request.status === activeFilter;
    const matchesCategory = activeCategory === 'all' || request.category === activeCategory;
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesCategory && matchesSearch;
  });

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

  const getStatsByStatus = (status: string) => {
    return mockRequests.filter(request => request.status === status).length;
  };

  const totalBudget = mockRequests
    .filter(request => request.budget)
    .reduce((sum, request) => sum + (request.budget || 0), 0);

  const averageProcessingTime = 3.2; // дней в среднем

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

        /* Улучшения для мобильных устройств */
        @media (max-width: 768px) {
          .card {
            min-height: 120px !important;
          }
          
          .modal-overlay {
            padding: 10px;
          }
        }

        /* Убираем подсветку при тапе на мобильных */
        .card {
          -webkit-tap-highlight-color: transparent;
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
              <Link href="/demo/social/manager" className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group">
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
        {/* Заголовок страницы */}
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
                  📋 Управление заявками
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-lg mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Все заявки клиентов • Фильтрация по статусам • Детальная аналитика
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>{mockRequests.length} всего заявок</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>{getStatsByStatus('new')} новых</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{getStatsByStatus('in-progress')} в работе</span>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="text-right"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-white font-bold text-2xl bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl px-6 py-3 shadow-lg">
                  Активен
                </div>
                <div className="text-white/60 text-sm mt-2">Режим менеджера</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сегодня</div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 rounded-full blur-lg" />
          </div>
        </motion.section>

        {/* Основные метрики */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: "📋", 
                value: mockRequests.length.toString(), 
                label: "Всего заявок", 
                change: "+12 за неделю", 
                changeColor: "text-green-400", 
                glow: COLORS.blue 
              },
              { 
                icon: "⏱️", 
                value: `${averageProcessingTime} дн.`, 
                label: "Среднее время обработки", 
                change: "-0.5 дн. к прошлому месяцу", 
                changeColor: "text-blue-400", 
                glow: COLORS.emerald 
              },
              { 
                icon: "💰", 
                value: formatCurrency(totalBudget), 
                label: "Общий бюджет заявок", 
                change: "+23% к прошлому месяцу", 
                changeColor: "text-emerald-400", 
                glow: COLORS.amber 
              },
              { 
                icon: "✅", 
                value: `${Math.round((getStatsByStatus('completed') / mockRequests.length) * 100)}%`, 
                label: "Уровень завершения", 
                change: "94% удовлетворенность", 
                changeColor: "text-amber-400", 
                glow: COLORS.violet 
              }
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

        {/* Фильтры и поиск */}
        <motion.section
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card--border-glow rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
            <div className="flex flex-col gap-4">
              {/* Поиск */}
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Поиск заявок по названию, клиенту или описанию..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40">
                  🔍
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                {/* Фильтры по статусу */}
                <div className="flex-1">
                  <h3 className="text-white/60 text-sm mb-2">Статус заявки</h3>
                  <div className="flex flex-wrap gap-2">
                    {statusFilters.map((filter) => (
                      <motion.button
                        key={filter.id}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          activeFilter === filter.id
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                        onClick={() => setActiveFilter(filter.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {filter.label} ({filter.count})
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Фильтры по категории */}
                <div className="flex-1">
                  <h3 className="text-white/60 text-sm mb-2">Категория услуги</h3>
                  <div className="flex flex-wrap gap-2">
                    {requestCategories.map((category) => (
                      <motion.button
                        key={category.id}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          activeCategory === category.id
                            ? 'bg-purple-500 text-white shadow-lg'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                        onClick={() => setActiveCategory(category.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {category.label} ({category.count})
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Bento Grid с заявками */}
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={true}
          spotlightRadius={DEFAULT_SPOTLIGHT_RADIUS}
          glowColor={DEFAULT_GLOW_COLOR}
        />

        <BentoCardGrid gridRef={gridRef} className="mb-8">
          {filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRequests.map((request, index) => {
                const baseClassName = `card flex flex-col justify-between relative min-h-[280px] w-full max-w-full p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow`;

                const cardStyle = {
                  backgroundColor: 'var(--background-dark)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--white)',
                  '--glow-x': '50%',
                  '--glow-y': '50%',
                  '--glow-intensity': '0',
                  '--glow-radius': '200px',
                  '--glow-color': COLORS.blue
                } as React.CSSProperties;

                return (
                  <ParticleCard
                    key={request.id}
                    className={baseClassName}
                    style={cardStyle}
                    disableAnimations={shouldDisableAnimations}
                    particleCount={DEFAULT_PARTICLE_COUNT}
                    glowColor={COLORS.blue}
                    enableTilt={!isMobile}
                    clickEffect={true}
                    enableMagnetism={!isMobile}
                    onCardClick={() => handleRequestClick(request)}
                  >
                    <div className="card__header flex justify-between items-start gap-3 relative text-white z-10">
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={request.priority} />
                        <StatusBadge status={request.status} />
                      </div>
                      <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">
                        {request.id}
                      </span>
                    </div>
                    
                    <div className="card__content flex flex-col relative text-white z-10 flex-1 mt-4">
                      <h3 className="card__title font-semibold text-lg mb-2 line-clamp-2">
                        {request.title}
                      </h3>
                      <p className="card__description text-white/70 text-sm leading-5 mb-4 flex-1 line-clamp-2">
                        {request.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Клиент:</span>
                          <span className="text-white font-medium">{request.client}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Категория:</span>
                          <span className="text-white font-medium">{request.category}</span>
                        </div>
                        {request.assignedTo && (
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Исполнитель:</span>
                            <span className="text-white font-medium">{request.assignedTo}</span>
                          </div>
                        )}
                        {request.budget && (
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Бюджет:</span>
                            <span className="text-white font-medium">{formatCurrency(request.budget)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-white/40 mt-auto">
                        <div>
                          Создана: {formatDate(request.created)}
                        </div>
                        <div className="flex items-center gap-2">
                          {request.attachments > 0 && (
                            <span>📎 {request.attachments}</span>
                          )}
                          {request.comments > 0 && (
                            <span>💬 {request.comments}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Background gradient */}
                    <div 
                      className="absolute inset-0 opacity-20 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle at center, rgba(${COLORS.blue}, 0.3) 0%, transparent 70%)`
                      }}
                    />
                  </ParticleCard>
                );
              })}
            </div>
          ) : (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">Заявки не найдены</h3>
              <p className="text-white/60">Попробуйте изменить параметры поиска или фильтры</p>
            </motion.div>
          )}
        </BentoCardGrid>

        {/* Статистика по статусам */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">📊 Распределение заявок по статусам</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {statusFilters.filter(f => f.id !== 'all').map((filter) => {
                const count = getStatsByStatus(filter.id);
                const percentage = Math.round((count / mockRequests.length) * 100);
                
                return (
                  <motion.div 
                    key={filter.id}
                    className="text-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
                    whileHover={{ y: -2 }}
                  >
                    <div className="text-2xl font-bold text-white mb-2">{count}</div>
                    <div className="text-white/60 text-sm mb-2">{filter.label}</div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500 transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-white/40 text-xs mt-1">{percentage}%</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>
      </main>

      {/* Упрощенное модальное окно */}
      <AnimatePresence>
        {isModalOpen && selectedRequest && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                '--glow-color': COLORS.blue,
                background: `radial-gradient(ellipse at center, rgba(var(--glow-color), 0.1) 0%, transparent 70%), linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`
              } as React.CSSProperties}
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{selectedRequest.title}</h2>
                  <button
                    onClick={closeModal}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  <StatusBadge status={selectedRequest.status} />
                  <PriorityBadge priority={selectedRequest.priority} />
                  <span className="text-white/40 text-sm">{selectedRequest.id}</span>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">📋 Основная информация</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/80">Клиент:</span>
                          <span className="text-white font-semibold">{selectedRequest.client}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/80">Категория:</span>
                          <span className="text-white font-semibold">{selectedRequest.category}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/80">Тип услуги:</span>
                          <span className="text-white font-semibold">{selectedRequest.type}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/80">Дата создания:</span>
                          <span className="text-white font-semibold">{formatDate(selectedRequest.created)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/80">Последнее обновление:</span>
                          <span className="text-white font-semibold">{formatDate(selectedRequest.updated)}</span>
                        </div>
                      </div>
                    </div>

                    {selectedRequest.assignedTo && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">👤 Ответственный</h3>
                        <div className="p-3 bg-white/5 rounded-lg">
                          <span className="text-white font-semibold">{selectedRequest.assignedTo}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">💰 Финансовая информация</h3>
                      <div className="space-y-3">
                        {selectedRequest.budget && (
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-white/80">Бюджет:</span>
                            <span className="text-white font-semibold">{formatCurrency(selectedRequest.budget)}</span>
                          </div>
                        )}
                        {selectedRequest.deadline && (
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-white/80">Срок выполнения:</span>
                            <span className="text-white font-semibold">{formatDate(selectedRequest.deadline)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/80">Вложения:</span>
                          <span className="text-white font-semibold">{selectedRequest.attachments} файлов</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/80">Комментарии:</span>
                          <span className="text-white font-semibold">{selectedRequest.comments} сообщений</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">📝 Описание заявки</h3>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-white/80 leading-relaxed">{selectedRequest.description}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 flex-col sm:flex-row">
                  <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                    Принять в работу
                  </button>
                  <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                    Редактировать
                  </button>
                  <button className="flex-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 py-3 px-4 rounded-lg font-medium transition-colors">
                    Отклонить
                  </button>
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
              <span className="hidden md:inline">Управление заявками</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Обновлено: {new Date().toLocaleDateString('ru-RU')}</span>
              <span>•</span>
              <span>{filteredRequests.length} заявок показано</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}