'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
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

const DEFAULT_PARTICLE_COUNT = 18;
const DEFAULT_SPOTLIGHT_RADIUS = 400;
const DEFAULT_GLOW_COLOR = '59, 130, 246';
const MOBILE_BREAKPOINT = 768;

// Расширенные типы данных
interface ServiceHistory {
  id: string;
  date: string;
  service: string;
  provider: string;
  status: 'completed' | 'scheduled' | 'cancelled' | 'inProgress';
  rating?: number;
  duration?: string;
  cost?: number;
  notes?: string;
}

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'medical' | 'application' | 'report' | 'other';
  uploadDate: string;
  size: string;
  url: string;
}

interface Communication {
  id: string;
  date: string;
  type: 'call' | 'visit' | 'email' | 'message';
  direction: 'incoming' | 'outgoing';
  summary: string;
  duration?: string;
  participants: string[];
}

interface FamilyMember {
  name: string;
  relation: string;
  age?: number;
  needsSupport?: boolean;
}

interface Client {
  id: string;
  name: string;
  category: string;
  avatar: string;
  status: 'active' | 'pending' | 'completed' | 'archived';
  servicesReceived: string;
  lastVisit: string;
  nextAppointment?: string;
  rating: number;
  satisfaction: number;
  color: string;
  phone: string;
  email?: string;
  address: string;
  birthDate?: string;
  registrationDate: string;
  tags: string[];
  notes?: string;
  assignedWorker?: string;
  workerContact?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  riskLevel: 'low' | 'medium' | 'high';
  serviceHistory?: ServiceHistory[];
  documents?: Document[];
  communications?: Communication[];
  familyMembers?: FamilyMember[];
  financialStatus?: 'stable' | 'needsSupport' | 'critical';
  housingStatus?: 'stable' | 'temporary' | 'homeless';
  healthConditions?: string[];
}

interface SocialCase {
  id: string;
  clientName: string;
  clientId: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'inProgress' | 'resolved' | 'escalated';
  createdDate: string;
  dueDate?: string;
  assignedTo: string;
  updates?: CaseUpdate[];
  category: 'medical' | 'financial' | 'housing' | 'legal' | 'psychological' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface CaseUpdate {
  id: string;
  date: string;
  author: string;
  message: string;
  type: 'note' | 'action' | 'resolution' | 'escalation';
  attachments?: string[];
}

interface ClientMetric {
  category: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  icon: string;
  change?: string;
  description?: string;
}

// ========== УТИЛИТЫ ==========

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
  el.className = 'advanced-particle';
  el.style.cssText = `
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(${color}, 1) 0%, rgba(${color}, 0.3) 70%);
    box-shadow: 0 0 20px rgba(${color}, 0.9), 0 0 40px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
    filter: blur(1px);
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

const formatDate = (date: Date) => {
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'только что';
  if (diffMins < 60) return `${diffMins} мин. назад`;
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays === 1) return 'вчера';
  if (diffDays < 7) return `${diffDays} дн. назад`;
  
  return date.toLocaleDateString('ru-RU');
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

        // Сложная анимация частицы
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

        // Автоматическое удаление через случайное время
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

      // Эффект свечения при наведении
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

      // Убираем свечение
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

      // Динамическое обновление позиции свечения
      element.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
      element.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
    };

    const handleClick = (e: MouseEvent) => {
      if (clickEffect) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Улучшенный ripple эффект
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
    className={`bento-section grid gap-3 sm:gap-4 p-3 sm:p-6 max-w-7xl select-none relative ${className}`}
    ref={gridRef}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

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

const ClientCard: React.FC<{ 
  client: Client; 
  index: number;
  onCardClick: (client: Client) => void;
}> = ({ client, index, onCardClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPriorityIcon = (priority: Client['priority']) => {
    switch (priority) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getRiskColor = (risk: Client['riskLevel']) => {
    switch (risk) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const baseClassName = `card flex flex-col justify-between relative min-h-[260px] sm:min-h-[280px] w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow`;

  const cardStyle = {
    backgroundColor: '#060010',
    borderColor: 'var(--border-color)',
    color: 'var(--white)',
    '--glow-x': '50%',
    '--glow-y': '50%',
    '--glow-intensity': '0',
    '--glow-radius': '250px',
    '--glow-color': client.color.replace('#', '').replace(/../g, x => x+',')
  } as React.CSSProperties;

  return (
    <AdvancedParticleCard
      className={baseClassName}
      style={cardStyle}
      particleCount={14}
      glowColor={client.color.replace('#', '').replace(/../g, x => x+',')}
      enableTilt={true}
      clickEffect={true}
      enableMagnetism={true}
      onCardClick={() => onCardClick(client)}
      intensity={client.priority === 'critical' ? 1.6 : client.priority === 'high' ? 1.3 : 1}
    >
      <motion.div 
        className="h-full flex flex-col"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <motion.div 
              className="text-2xl sm:text-3xl relative"
              animate={{ scale: isHovered ? 1.3 : 1, rotate: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              {client.avatar}
              <div className="absolute -top-1 -right-1 text-xs">
                {getPriorityIcon(client.priority)}
              </div>
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-base sm:text-lg truncate group-hover:text-blue-300 transition-colors">
                {client.name}
              </h3>
              <p className="text-white/60 text-xs sm:text-sm truncate">{client.category}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs ${getRiskColor(client.riskLevel)}`}>
                  Риск: {client.riskLevel === 'high' ? 'Высокий' : client.riskLevel === 'medium' ? 'Средний' : 'Низкий'}
                </span>
              </div>
            </div>
          </div>
          <motion.div 
            className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium flex-shrink-0 backdrop-blur-sm ${
              client.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              client.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
              client.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
              'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}
            animate={{ scale: isHovered ? 1.15 : 1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {client.status === 'active' ? 'Активен' : 
             client.status === 'pending' ? 'Ожидает' : 
             client.status === 'completed' ? 'Завершен' : 'Архив'}
          </motion.div>
        </div>

        {/* Stats */}
        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 flex-1">
          <div className="grid grid-cols-3 gap-1 sm:gap-2 text-xs sm:text-sm">
            <motion.div 
              className="bg-white/5 rounded-lg p-1 sm:p-2 text-center backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="text-white font-bold text-sm sm:text-base">{client.servicesReceived}</div>
              <div className="text-white/60 text-xs">услуг</div>
            </motion.div>
            <motion.div 
              className="bg-white/5 rounded-lg p-1 sm:p-2 text-center backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="text-yellow-400 font-bold text-sm sm:text-base">{client.rating}</div>
              <div className="text-white/60 text-xs">рейтинг</div>
            </motion.div>
            <motion.div 
              className="bg-white/5 rounded-lg p-1 sm:p-2 text-center backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="text-green-400 font-bold text-sm sm:text-base">{client.satisfaction}%</div>
              <div className="text-white/60 text-xs">удовл.</div>
            </motion.div>
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <div className="flex justify-between text-white/70 text-xs">
              <span>Последний визит</span>
              <span className="text-white/90">{client.lastVisit}</span>
            </div>
            {client.nextAppointment && (
              <div className="flex justify-between text-blue-400 text-xs">
                <span>Следующий прием</span>
                <span className="font-medium">{client.nextAppointment}</span>
              </div>
            )}
            <div className="pt-1 sm:pt-2">
              <ProgressBar 
                value={client.satisfaction} 
                label="Удовлетворенность" 
                color={client.color}
                height="sm"
                animated={true}
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {client.tags.slice(0, 2).map((tag, tagIndex) => (
            <motion.span 
              key={tagIndex}
              className="text-xs bg-white/10 px-2 py-1 rounded border border-white/20 text-white/80 hover:bg-white/20 transition-colors cursor-default backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + tagIndex * 0.1, type: "spring" }}
              whileHover={{ scale: 1.08, y: -1 }}
            >
              {tag}
            </motion.span>
          ))}
          {client.tags.length > 2 && (
            <span className="text-xs bg-white/10 px-2 py-1 rounded border border-white/20 text-white/40 backdrop-blur-sm">
              +{client.tags.length - 2}
            </span>
          )}
        </div>

        {/* Background gradient */}
        <div 
          className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 30% 20%, rgba(${client.color.replace('#', '').replace(/../g, x => x+',')}, 0.4) 0%, transparent 50%)`
          }}
        />

        {/* Hover Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-2xl flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex gap-2 sm:gap-3">
                <motion.button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm shadow-lg"
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  👁️ Подробнее
                </motion.button>
                <motion.button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm shadow-lg"
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  📞 Позвонить
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AdvancedParticleCard>
  );
};

const SocialCaseCard: React.FC<{ 
  caseItem: SocialCase; 
  index: number;
  onCaseClick?: (caseItem: SocialCase) => void;
}> = ({ caseItem, index, onCaseClick }) => {
  const getPriorityColor = (priority: SocialCase['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: SocialCase['status']) => {
    switch (status) {
      case 'new': return '🆕';
      case 'inProgress': return '🔄';
      case 'resolved': return '✅';
      case 'escalated': return '🚨';
      default: return '📋';
    }
  };

  return (
    <motion.div
      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group backdrop-blur-sm"
      initial={{ opacity: 0, x: -25 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={() => onCaseClick?.(caseItem)}
    >
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-base sm:text-lg font-bold flex-shrink-0 ${getPriorityColor(caseItem.priority)} backdrop-blur-sm`}>
        {getStatusIcon(caseItem.status)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div className="text-white font-semibold text-sm truncate">{caseItem.clientName}</div>
          <div className="text-white/40 text-xs flex-shrink-0 ml-2">
            {caseItem.createdDate}
          </div>
        </div>
        <div className="text-white/60 text-sm mb-3 line-clamp-2 leading-relaxed">{caseItem.description}</div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs">Назначен:</span>
            <span className="text-white/60 text-xs">{caseItem.assignedTo}</span>
          </div>
          <div className={`text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full ${getPriorityColor(caseItem.priority)} backdrop-blur-sm`}>
            {caseItem.priority === 'high' ? 'Высокий' : caseItem.priority === 'medium' ? 'Средний' : 'Низкий'}
          </div>
        </div>
        {caseItem.dueDate && (
          <div className="flex items-center gap-1 mt-2 sm:mt-3">
            <span className="text-orange-400 text-xs font-medium">📅 {caseItem.dueDate}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ========== МОДАЛЬНЫЕ ОКНА И ДЕТАЛИ ==========

const ClientDetailsModal: React.FC<{
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (client: Client) => void;
  onDelete?: (clientId: string) => void;
}> = ({ client, isOpen, onClose, onEdit, onDelete }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'documents' | 'communications'>('overview');

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

  if (!isOpen || !client) return null;

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: '👤' },
    { id: 'services' as const, label: 'Услуги', icon: '🏥' },
    { id: 'documents' as const, label: 'Документы', icon: '📄' },
    { id: 'communications' as const, label: 'Коммуникации', icon: '💬' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab client={client} />;
      case 'services':
        return <ServicesTab client={client} />;
      case 'documents':
        return <DocumentsTab client={client} />;
      case 'communications':
        return <CommunicationsTab client={client} />;
      default:
        return <OverviewTab client={client} />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl sm:rounded-3xl border border-white/20 max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{ 
            '--glow-color': client.color.replace('#', '').replace(/../g, x => x+','),
            background: `radial-gradient(ellipse at top right, rgba(var(--glow-color), 0.15) 0%, transparent 50%), linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)`
          } as React.CSSProperties}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 md:p-8 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-6">
                <motion.div 
                  className="text-4xl sm:text-5xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  {client.avatar}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <motion.h2 
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 truncate"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {client.name}
                  </motion.h2>
                  <motion.p 
                    className="text-white/60 text-base sm:text-lg truncate"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {client.category}
                  </motion.p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                <motion.button
                  onClick={() => onEdit?.(client)}
                  className="px-3 sm:px-5 py-2 sm:py-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm font-medium backdrop-blur-sm hover:scale-105"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✏️ Редактировать
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm overflow-x-auto">
            <div className="flex space-x-1 px-4 sm:px-6 md:px-8 min-w-max">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium rounded-t-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 relative overflow-hidden flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white border-t-2 border-blue-500 shadow-lg'
                      : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                  }`}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-base sm:text-lg">{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
            {renderTabContent()}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 md:p-8 border-t border-white/10 bg-white/5 backdrop-blur-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-white/60 text-xs sm:text-sm text-center sm:text-left">
                Зарегистрирован: {client.registrationDate}
              </div>
              <div className="flex gap-2 sm:gap-3">
                <motion.button 
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm font-medium shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📞 Позвонить
                </motion.button>
                <motion.button 
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm font-medium shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📅 Записать на прием
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const OverviewTab: React.FC<{ client: Client }> = ({ client }) => (
  <motion.div 
    className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="space-y-4 sm:space-y-6">
      <div className="card--border-glow bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 backdrop-blur-sm">
        <h3 className="text-white font-semibold text-lg mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
          <span className="text-xl">📋</span>
          <span>Контактная информация</span>
        </h3>
        <div className="space-y-3 sm:space-y-4 text-white/80">
          <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl hover:bg-white/10 transition-colors">
            <span className="flex items-center gap-2 text-sm sm:text-base">
              <span>📞</span>
              <span>Телефон:</span>
            </span>
            <span className="text-white font-medium text-sm sm:text-base">{client.phone}</span>
          </div>
          {client.email && (
            <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl hover:bg-white/10 transition-colors">
              <span className="flex items-center gap-2 text-sm sm:text-base">
                <span>📧</span>
                <span>Email:</span>
              </span>
              <span className="text-white font-medium text-sm sm:text-base truncate ml-2">{client.email}</span>
            </div>
          )}
          <div className="flex justify-between items-start p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl hover:bg-white/10 transition-colors">
            <span className="flex items-center gap-2 text-sm sm:text-base">
              <span>🏠</span>
              <span>Адрес:</span>
            </span>
            <span className="text-white font-medium text-xs sm:text-sm text-right max-w-[120px] sm:max-w-xs">{client.address}</span>
          </div>
          {client.birthDate && (
            <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl hover:bg-white/10 transition-colors">
              <span className="flex items-center gap-2 text-sm sm:text-base">
                <span>🎂</span>
                <span>Дата рождения:</span>
              </span>
              <span className="text-white font-medium text-sm sm:text-base">{client.birthDate}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card--border-glow bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 backdrop-blur-sm">
        <h3 className="text-white font-semibold text-lg mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
          <span className="text-xl">🎯</span>
          <span>Статус и приоритет</span>
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {[
            { 
              label: 'Статус', 
              value: client.status === 'active' ? 'Активен' : client.status === 'pending' ? 'Ожидает' : client.status === 'completed' ? 'Завершен' : 'Архив',
              color: client.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                     client.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                     client.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                     'bg-gray-500/20 text-gray-400 border-gray-500/30'
            },
            { 
              label: 'Приоритет', 
              value: client.priority === 'critical' ? 'Критический' : client.priority === 'high' ? 'Высокий' : client.priority === 'medium' ? 'Средний' : 'Низкий',
              color: client.priority === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                     client.priority === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                     client.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                     'bg-green-500/20 text-green-400 border-green-500/30'
            },
            { 
              label: 'Уровень риска', 
              value: client.riskLevel === 'high' ? 'Высокий' : client.riskLevel === 'medium' ? 'Средний' : 'Низкий',
              color: client.riskLevel === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                     client.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                     'bg-green-500/20 text-green-400 border-green-500/30'
            }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="text-sm sm:text-base">{item.label}:</span>
              <span className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm ${item.color}`}>
                {item.value}
              </span>
            </motion.div>
          ))}
          {client.assignedWorker && (
            <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl hover:bg-white/10 transition-colors">
              <span className="text-sm sm:text-base">Куратор:</span>
              <span className="text-white font-medium text-sm sm:text-base">{client.assignedWorker}</span>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="space-y-4 sm:space-y-6">
      <div className="card--border-glow bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 backdrop-blur-sm">
        <h3 className="text-white font-semibold text-lg mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
          <span className="text-xl">📊</span>
          <span>Статистика услуг</span>
        </h3>
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
            <motion.div 
              className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="text-white font-bold text-xl sm:text-2xl">{client.servicesReceived}</div>
              <div className="text-white/60 text-xs sm:text-sm">услуг получено</div>
            </motion.div>
            <motion.div 
              className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="text-yellow-400 font-bold text-xl sm:text-2xl">{client.rating}/5</div>
              <div className="text-white/60 text-xs sm:text-sm">средний рейтинг</div>
            </motion.div>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between text-white/80 text-sm">
              <span>Последний визит</span>
              <span className="text-white font-medium">{client.lastVisit}</span>
            </div>
            {client.nextAppointment && (
              <div className="flex justify-between text-blue-400 text-sm">
                <span>Следующий прием</span>
                <span className="font-medium">{client.nextAppointment}</span>
              </div>
            )}
            <div className="pt-2 sm:pt-3">
              <ProgressBar 
                value={client.satisfaction} 
                label="Общая удовлетворенность" 
                color={client.color}
                height="md"
                showLabel={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card--border-glow bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 backdrop-blur-sm">
        <h3 className="text-white font-semibold text-lg mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
          <span className="text-xl">🏷️</span>
          <span>Теги и категории</span>
        </h3>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {client.tags.map((tag, index) => (
            <motion.span 
              key={index}
              className="text-xs bg-white/10 px-2 sm:px-3 py-1 sm:py-2 rounded-full border border-white/20 text-white/80 hover:bg-white/20 transition-colors cursor-default backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.1, y: -1 }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const ServicesTab: React.FC<{ client: Client }> = ({ client }) => (
  <motion.div 
    className="space-y-4 sm:space-y-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-white font-semibold text-lg sm:text-xl mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
      <span className="text-2xl">📈</span>
      <span>История услуг</span>
    </h3>
    {client.serviceHistory && client.serviceHistory.length > 0 ? (
      <div className="space-y-3 sm:space-y-4">
        {client.serviceHistory.map((service, index) => (
          <motion.div 
            key={service.id} 
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex-1 mb-3 sm:mb-0">
              <div className="text-white font-semibold text-base sm:text-lg mb-1 sm:mb-2">{service.service}</div>
              <div className="text-white/60 text-xs sm:text-sm">
                {service.date} • {service.provider}
                {service.duration && ` • ${service.duration}`}
                {service.cost && ` • ${formatCurrency(service.cost)}`}
              </div>
              {service.notes && (
                <div className="text-white/50 text-xs sm:text-sm mt-2 sm:mt-3 bg-white/5 p-2 sm:p-3 rounded-lg border border-white/10">
                  {service.notes}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              {service.rating && (
                <div className="text-yellow-400 font-bold text-base sm:text-lg bg-yellow-500/10 px-2 sm:px-3 py-1 sm:py-2 rounded-lg border border-yellow-500/20">
                  {service.rating}/5
                </div>
              )}
              <span className={`text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium backdrop-blur-sm ${
                service.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                service.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                service.status === 'inProgress' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {service.status === 'completed' ? 'Завершено' : 
                 service.status === 'scheduled' ? 'Запланировано' :
                 service.status === 'inProgress' ? 'В процессе' : 'Отменено'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    ) : (
      <motion.div 
        className="text-center py-8 sm:py-12 text-white/60"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🏥</div>
        <p className="text-lg sm:text-xl mb-2">История услуг пока пуста</p>
        <p className="text-xs sm:text-sm">Здесь будет отображаться информация об оказанных услугах</p>
      </motion.div>
    )}
  </motion.div>
);

const DocumentsTab: React.FC<{ client: Client }> = ({ client }) => (
  <motion.div 
    className="space-y-4 sm:space-y-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-white font-semibold text-lg sm:text-xl mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
      <span className="text-2xl">📄</span>
      <span>Документы клиента</span>
    </h3>
    {client.documents && client.documents.length > 0 ? (
      <div className="grid gap-3 sm:gap-4">
        {client.documents.map((doc, index) => (
          <motion.div 
            key={doc.id} 
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-0">
              <div className="text-2xl sm:text-3xl">
                {doc.type === 'contract' ? '📝' :
                 doc.type === 'medical' ? '🏥' :
                 doc.type === 'application' ? '📋' :
                 doc.type === 'report' ? '📊' : '📄'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-base sm:text-lg truncate">{doc.name}</div>
                <div className="text-white/60 text-xs sm:text-sm">
                  Загружен: {doc.uploadDate} • {doc.size}
                </div>
              </div>
            </div>
            <motion.button 
              className="px-3 sm:px-5 py-2 sm:py-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm font-medium backdrop-blur-sm self-start sm:self-auto"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              Скачать
            </motion.button>
          </motion.div>
        ))}
      </div>
    ) : (
      <motion.div 
        className="text-center py-8 sm:py-12 text-white/60"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">📂</div>
        <p className="text-lg sm:text-xl mb-2">Документы не загружены</p>
        <p className="text-xs sm:text-sm">Здесь будут отображаться документы клиента</p>
      </motion.div>
    )}
  </motion.div>
);

const CommunicationsTab: React.FC<{ client: Client }> = ({ client }) => (
  <motion.div 
    className="space-y-4 sm:space-y-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-white font-semibold text-lg sm:text-xl mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
      <span className="text-2xl">💬</span>
      <span>История коммуникаций</span>
    </h3>
    {client.communications && client.communications.length > 0 ? (
      <div className="space-y-3 sm:space-y-4">
        {client.communications.map((comm, index) => (
          <motion.div 
            key={comm.id} 
            className="p-4 sm:p-6 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, y: -1 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
                <span className={`text-2xl ${
                  comm.type === 'call' ? '📞' :
                  comm.type === 'visit' ? '👥' :
                  comm.type === 'email' ? '📧' : '💬'
                }`} />
                <span className="text-white font-semibold text-base sm:text-lg">
                  {comm.type === 'call' ? 'Звонок' :
                   comm.type === 'visit' ? 'Визит' :
                   comm.type === 'email' ? 'Email' : 'Сообщение'}
                </span>
                <span className={`text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium backdrop-blur-sm ${
                  comm.direction === 'incoming' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {comm.direction === 'incoming' ? 'Входящее' : 'Исходящее'}
                </span>
              </div>
              <span className="text-white/60 text-xs sm:text-sm">{comm.date}</span>
            </div>
            <div className="text-white/80 text-base sm:text-lg mb-2 sm:mb-3 leading-relaxed">{comm.summary}</div>
            {comm.duration && (
              <div className="text-white/60 text-xs sm:text-sm">Длительность: {comm.duration}</div>
            )}
            {comm.participants && comm.participants.length > 0 && (
              <div className="text-white/60 text-xs sm:text-sm mt-2">
                Участники: {comm.participants.join(', ')}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    ) : (
      <motion.div 
        className="text-center py-8 sm:py-12 text-white/60"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">💬</div>
        <p className="text-lg sm:text-xl mb-2">История коммуникаций пуста</p>
        <p className="text-xs sm:text-sm">Здесь будет отображаться история общения с клиентом</p>
      </motion.div>
    )}
  </motion.div>
);

// ========== РАСШИРЕННЫЕ ДЕМО-ДАННЫЕ ==========

const clientsData: Client[] = [
  {
    id: '1',
    name: "Иванова Мария Петровна",
    category: "Пенсионер • 72 года",
    avatar: "👵",
    status: "active",
    servicesReceived: "12",
    lastVisit: "15.12.2024",
    nextAppointment: "20.12.2024",
    rating: 4.8,
    satisfaction: 92,
    color: "#3B82F6",
    phone: "+7 (912) 345-67-89",
    email: "ivanova.maria@example.com",
    address: "ул. Ленина, 15, кв. 42",
    birthDate: "15.03.1952",
    registrationDate: "15.01.2023",
    tags: ["Социальный патронаж", "Медицинский уход", "Льготник", "Требует внимания", "Хронические заболевания"],
    notes: "Нуждается в регулярном медицинском наблюдении. Есть проблемы с мобильностью.",
    assignedWorker: "Смирнова Анна Ивановна",
    workerContact: "+7 (912) 111-22-33",
    priority: "high",
    riskLevel: "medium",
    serviceHistory: [
      {
        id: '1',
        date: "15.12.2024",
        service: "Медицинский осмотр",
        provider: "Поликлиника №1",
        status: "completed",
        rating: 5,
        duration: "1.5 часа",
        cost: 0,
        notes: "Плановый осмотр, состояние стабильное"
      },
      {
        id: '2',
        date: "10.12.2024",
        service: "Социальный патронаж",
        provider: "Смирнова А.И.",
        status: "completed",
        rating: 4,
        duration: "2 часа",
        notes: "Помощь в оформлении документов"
      },
      {
        id: '3',
        date: "05.12.2024",
        service: "Психологическая консультация",
        provider: "Психологический центр",
        status: "completed",
        rating: 5,
        duration: "1 час",
        notes: "Работа с тревожностью"
      }
    ],
    documents: [
      {
        id: '1',
        name: "Договор на социальное обслуживание",
        type: "contract",
        uploadDate: "15.01.2023",
        size: "2.4 MB",
        url: "#"
      },
      {
        id: '2',
        name: "Медицинская карта",
        type: "medical",
        uploadDate: "20.01.2023",
        size: "1.8 MB",
        url: "#"
      }
    ],
    communications: [
      {
        id: '1',
        date: "15.12.2024 14:30",
        type: "call",
        direction: "incoming",
        summary: "Уточнение времени следующего приема",
        duration: "5 минут",
        participants: ["Иванова М.П.", "Смирнова А.И."]
      },
      {
        id: '2',
        date: "12.12.2024 10:15",
        type: "visit",
        direction: "outgoing",
        summary: "Плановый визит социального работника",
        duration: "2 часа",
        participants: ["Смирнова А.И.", "Иванова М.П."]
      }
    ],
    familyMembers: [
      { name: "Иванов Петр Сергеевич", relation: "Сын", age: 45, needsSupport: false }
    ],
    financialStatus: "stable",
    housingStatus: "stable",
    healthConditions: ["Гипертония", "Артрит", "Сахарный диабет 2 типа"]
  },
  {
    id: '2',
    name: "Петров Алексей Владимирович",
    category: "Инвалид 2 группы • 45 лет",
    avatar: "👨‍🦽",
    status: "active",
    servicesReceived: "8",
    lastVisit: "12.12.2024",
    nextAppointment: "18.12.2024",
    rating: 4.9,
    satisfaction: 95,
    color: "#10B981",
    phone: "+7 (923) 456-78-90",
    email: "petrov.alexey@example.com",
    address: "пр. Мира, 23, кв. 17",
    birthDate: "20.08.1979",
    registrationDate: "10.03.2023",
    tags: ["Реабилитация", "Психологическая помощь", "Льготник", "Трудоустройство"],
    notes: "Активно участвует в программах реабилитации. Показывает хорошие результаты.",
    assignedWorker: "Козлов Дмитрий Сергеевич",
    workerContact: "+7 (912) 333-44-55",
    priority: "medium",
    riskLevel: "low",
    serviceHistory: [
      {
        id: '4',
        date: "12.12.2024",
        service: "Физическая реабилитация",
        provider: "Реабилитационный центр",
        status: "completed",
        rating: 5,
        duration: "2 часа",
        cost: 0,
        notes: "Упражнения на развитие моторики"
      },
      {
        id: '5',
        date: "05.12.2024",
        service: "Профориентационная консультация",
        provider: "Центр занятости",
        status: "completed",
        rating: 5,
        duration: "1.5 часа",
        notes: "Обсуждение возможностей удаленной работы"
      }
    ],
    documents: [
      {
        id: '3',
        name: "Заключение МСЭ",
        type: "medical",
        uploadDate: "15.03.2023",
        size: "3.2 MB",
        url: "#"
      }
    ],
    financialStatus: "needsSupport",
    housingStatus: "stable",
    healthConditions: ["Последствия травмы позвоночника", "Нарушение мобильности"]
  },
  {
    id: '3',
    name: "Сидорова Анна Ивановна",
    category: "Многодетная мать • 34 года",
    avatar: "👩‍👧‍👦",
    status: "active",
    servicesReceived: "6",
    lastVisit: "10.12.2024",
    nextAppointment: "22.12.2024",
    rating: 4.7,
    satisfaction: 88,
    color: "#8B5CF6",
    phone: "+7 (934) 567-89-01",
    email: "sidorova.anna@example.com",
    address: "ул. Советская, 8, кв. 25",
    birthDate: "15.05.1990",
    registrationDate: "20.05.2024",
    tags: ["Семейная поддержка", "Детские программы", "Консультации", "Материнский капитал"],
    notes: "Воспитывает троих детей. Нуждается в поддержке с оформлением пособий.",
    assignedWorker: "Петрова Мария Владимировна",
    workerContact: "+7 (912) 666-77-88",
    priority: "medium",
    riskLevel: "low",
    serviceHistory: [
      {
        id: '6',
        date: "10.12.2024",
        service: "Консультация по детским пособиям",
        provider: "Отдел социальной защиты",
        status: "completed",
        rating: 4,
        duration: "1 час",
        notes: "Помощь в оформлении документов"
      }
    ],
    familyMembers: [
      { name: "Сидоров Иван", relation: "Сын", age: 8, needsSupport: true },
      { name: "Сидорова Мария", relation: "Дочь", age: 5, needsSupport: true },
      { name: "Сидоров Алексей", relation: "Сын", age: 2, needsSupport: true }
    ],
    financialStatus: "needsSupport",
    housingStatus: "stable"
  },
  {
    id: '4',
    name: "Козлов Дмитрий Сергеевич",
    category: "Безработный • 38 лет",
    avatar: "👨‍💼",
    status: "pending",
    servicesReceived: "3",
    lastVisit: "05.12.2024",
    nextAppointment: "15.12.2024",
    rating: 4.5,
    satisfaction: 78,
    color: "#F59E0B",
    phone: "+7 (945) 678-90-12",
    email: "kozlov.dmitry@example.com",
    address: "ул. Кирова, 45, кв. 13",
    birthDate: "10.11.1986",
    registrationDate: "01.11.2024",
    tags: ["Трудоустройство", "Профориентация", "Социальный лифт", "Кризисная ситуация"],
    notes: "Потерял работу 2 месяца назад. Находится в сложной финансовой ситуации.",
    assignedWorker: "Смирнова Анна Ивановна",
    workerContact: "+7 (912) 111-22-33",
    priority: "high",
    riskLevel: "high",
    serviceHistory: [
      {
        id: '7',
        date: "05.12.2024",
        service: "Первичная консультация",
        provider: "Центр занятости",
        status: "completed",
        rating: 4,
        duration: "1 час",
        notes: "Определение навыков и компетенций"
      }
    ],
    financialStatus: "critical",
    housingStatus: "temporary"
  },
  {
    id: '5',
    name: "Николаева Ольга Викторовна",
    category: "Пенсионер • 68 лет",
    avatar: "👵",
    status: "active",
    servicesReceived: "15",
    lastVisit: "18.12.2024",
    nextAppointment: "25.12.2024",
    rating: 5.0,
    satisfaction: 98,
    color: "#EF4444",
    phone: "+7 (956) 789-01-23",
    email: "nikolaeva.olga@example.com",
    address: "ул. Гагарина, 12, кв. 8",
    birthDate: "20.03.1956",
    registrationDate: "10.02.2023",
    tags: ["Социальный патронаж", "Медицинский уход", "Активное долголетие", "Волонтер"],
    notes: "Активный участник программ для пожилых. Помогает другим клиентам.",
    assignedWorker: "Петрова Мария Владимировна",
    workerContact: "+7 (912) 666-77-88",
    priority: "low",
    riskLevel: "low",
    serviceHistory: [
      {
        id: '8',
        date: "18.12.2024",
        service: "Групповые занятия по гимнастике",
        provider: "Центр активного долголетия",
        status: "completed",
        rating: 5,
        duration: "1 час",
        notes: "Регулярные занятия"
      }
    ],
    financialStatus: "stable",
    housingStatus: "stable"
  },
  {
    id: '6',
    name: "Волков Сергей Александрович",
    category: "Ветеран труда • 71 год",
    avatar: "👴",
    status: "completed",
    servicesReceived: "20",
    lastVisit: "01.12.2024",
    rating: 4.9,
    satisfaction: 96,
    color: "#06B6D4",
    phone: "+7 (967) 890-12-34",
    email: "volkov.sergey@example.com",
    address: "пр. Победы, 67, кв. 34",
    birthDate: "15.07.1953",
    registrationDate: "05.01.2023",
    tags: ["Ветеран", "Социальное сопровождение", "Завершен", "Успешная реабилитация"],
    notes: "Успешно завершил программу социальной адаптации. Переведен на самостоятельное обслуживание.",
    assignedWorker: "Козлов Дмитрий Сергеевич",
    workerContact: "+7 (912) 333-44-55",
    priority: "low",
    riskLevel: "low",
    serviceHistory: [
      {
        id: '9',
        date: "01.12.2024",
        service: "Итоговая консультация",
        provider: "Смирнова А.И.",
        status: "completed",
        rating: 5,
        duration: "1 час",
        notes: "Завершение программы сопровождения"
      }
    ]
  },
  {
    id: '7',
    name: "Федорова Елена Дмитриевна",
    category: "Инвалид 1 группы • 52 года",
    avatar: "👩‍🦯",
    status: "active",
    servicesReceived: "9",
    lastVisit: "14.12.2024",
    nextAppointment: "21.12.2024",
    rating: 4.6,
    satisfaction: 85,
    color: "#EC4899",
    phone: "+7 (978) 901-23-45",
    email: "fedorova.elena@example.com",
    address: "ул. Пушкина, 34, кв. 12",
    birthDate: "30.09.1972",
    registrationDate: "15.06.2024",
    tags: ["Инвалидность", "Медицинский уход", "Реабилитация", "Сложный случай"],
    notes: "Требуется постоянный медицинский уход. Проживает одна.",
    assignedWorker: "Смирнова Анна Ивановна",
    workerContact: "+7 (912) 111-22-33",
    priority: "critical",
    riskLevel: "high",
    serviceHistory: [
      {
        id: '10',
        date: "14.12.2024",
        service: "Медицинская процедура",
        provider: "Поликлиника №2",
        status: "completed",
        rating: 4,
        duration: "3 часа",
        notes: "Плановые процедуры"
      }
    ],
    financialStatus: "needsSupport",
    housingStatus: "stable",
    healthConditions: ["Рассеянный склероз", "Нарушение зрения"]
  },
  {
    id: '8',
    name: "Громов Андрей Петрович",
    category: "Бездомный • 41 год",
    avatar: "🧔",
    status: "active",
    servicesReceived: "5",
    lastVisit: "16.12.2024",
    nextAppointment: "19.12.2024",
    rating: 4.3,
    satisfaction: 75,
    color: "#8B5CF6",
    phone: "+7 (989) 012-34-56",
    address: "Временное размещение: Приют 'Надежда'",
    birthDate: "12.12.1983",
    registrationDate: "01.10.2024",
    tags: ["Бездомность", "Кризисная помощь", "Трудоустройство", "Социальная гостиница"],
    notes: "Находится в приюте временного размещения. Активно ищет работу.",
    assignedWorker: "Козлов Дмитрий Сергеевич",
    workerContact: "+7 (912) 333-44-55",
    priority: "high",
    riskLevel: "high",
    serviceHistory: [
      {
        id: '11',
        date: "16.12.2024",
        service: "Социально-психологическая помощь",
        provider: "Кризисный центр",
        status: "completed",
        rating: 4,
        duration: "2 часа",
        notes: "Работа с психологом"
      }
    ],
    financialStatus: "critical",
    housingStatus: "homeless"
  },
  {
    id: '9',
    name: "Семенова Ирина Васильевна",
    category: "Мать-одиночка • 29 лет",
    avatar: "👩",
    status: "active",
    servicesReceived: "7",
    lastVisit: "13.12.2024",
    nextAppointment: "20.12.2024",
    rating: 4.8,
    satisfaction: 90,
    color: "#10B981",
    phone: "+7 (990) 123-45-67",
    email: "semenova.irina@example.com",
    address: "ул. Чкалова, 56, кв. 7",
    birthDate: "25.04.1995",
    registrationDate: "10.07.2024",
    tags: ["Мать-одиночка", "Детские пособия", "Психологическая помощь", "Юридические консультации"],
    notes: "Воспитывает дочь 4 лет. Нуждается в поддержке с оформлением алиментов.",
    assignedWorker: "Петрова Мария Владимировна",
    workerContact: "+7 (912) 666-77-88",
    priority: "medium",
    riskLevel: "medium",
    serviceHistory: [
      {
        id: '12',
        date: "13.12.2024",
        service: "Юридическая консультация",
        provider: "Юридический отдел",
        status: "completed",
        rating: 5,
        duration: "1.5 часа",
        notes: "Вопросы по взысканию алиментов"
      }
    ],
    familyMembers: [
      { name: "Семенова София", relation: "Дочь", age: 4, needsSupport: true }
    ],
    financialStatus: "needsSupport",
    housingStatus: "stable"
  },
  {
    id: '10',
    name: "Кузнецов Виктор Николаевич",
    category: "Пенсионер • 75 лет",
    avatar: "👴",
    status: "active",
    servicesReceived: "11",
    lastVisit: "17.12.2024",
    nextAppointment: "24.12.2024",
    rating: 4.7,
    satisfaction: 87,
    color: "#3B82F6",
    phone: "+7 (991) 234-56-78",
    email: "kuznetsov.viktor@example.com",
    address: "пр. Космонавтов, 23, кв. 15",
    birthDate: "18.11.1949",
    registrationDate: "20.03.2023",
    tags: ["Пенсионер", "Социальный патронаж", "Медицинский уход", "Ветеран"],
    notes: "Участник боевых действий. Требуется помощь с лекарственным обеспечением.",
    assignedWorker: "Смирнова Анна Ивановна",
    workerContact: "+7 (912) 111-22-33",
    priority: "medium",
    riskLevel: "medium",
    serviceHistory: [
      {
        id: '13',
        date: "17.12.2024",
        service: "Обеспечение лекарствами",
        provider: "Аптека №3",
        status: "completed",
        rating: 4,
        duration: "1 час",
        notes: "Получение льготных лекарств"
      }
    ],
    financialStatus: "stable",
    housingStatus: "stable",
    healthConditions: ["ИБС", "Гипертония", "Последствия ранения"]
  },
  {
    id: '11',
    name: "Орлова Татьяна Михайловна",
    category: "Инвалид 3 группы • 48 лет",
    avatar: "👩‍🦽",
    status: "pending",
    servicesReceived: "4",
    lastVisit: "08.12.2024",
    nextAppointment: "16.12.2024",
    rating: 4.4,
    satisfaction: 80,
    color: "#F59E0B",
    phone: "+7 (992) 345-67-89",
    email: "orlova.tatiana@example.com",
    address: "ул. Садовая, 78, кв. 22",
    birthDate: "14.07.1976",
    registrationDate: "05.09.2024",
    tags: ["Инвалидность", "Реабилитация", "Трудоустройство", "Новый клиент"],
    notes: "Недавно получила инвалидность. Проходит адаптацию.",
    assignedWorker: "Козлов Дмитрий Сергеевич",
    workerContact: "+7 (912) 333-44-55",
    priority: "medium",
    riskLevel: "medium",
    serviceHistory: [
      {
        id: '14',
        date: "08.12.2024",
        service: "Первичная реабилитационная консультация",
        provider: "Реабилитационный центр",
        status: "completed",
        rating: 4,
        duration: "2 часа",
        notes: "Разработка индивидуальной программы"
      }
    ],
    financialStatus: "needsSupport",
    housingStatus: "stable"
  },
  {
    id: '12',
    name: "Жуков Алексей Игоревич",
    category: "Безработный • 32 года",
    avatar: "👨‍💼",
    status: "active",
    servicesReceived: "6",
    lastVisit: "19.12.2024",
    nextAppointment: "26.12.2024",
    rating: 4.5,
    satisfaction: 82,
    color: "#EF4444",
    phone: "+7 (993) 456-78-90",
    email: "zhukov.alexey@example.com",
    address: "ул. Лесная, 45, кв. 18",
    birthDate: "03.03.1992",
    registrationDate: "15.08.2024",
    tags: ["Трудоустройство", "Переквалификация", "IT-курсы", "Активный поиск"],
    notes: "Проходит курсы переквалификации в IT-сфере. Мотивирован на трудоустройство.",
    assignedWorker: "Петрова Мария Владимировна",
    workerContact: "+7 (912) 666-77-88",
    priority: "low",
    riskLevel: "low",
    serviceHistory: [
      {
        id: '15',
        date: "19.12.2024",
        service: "IT-курсы для начинающих",
        provider: "Центр цифровых технологий",
        status: "inProgress",
        rating: 5,
        duration: "3 часа",
        notes: "Изучение основ программирования"
      }
    ],
    financialStatus: "needsSupport",
    housingStatus: "stable"
  }
];

const socialCases: SocialCase[] = [
  {
    id: '1',
    clientName: "Иванова М.П.",
    clientId: '1',
    description: "Требуется срочная медицинская помощь и оформление льгот на лекарства. Состояние ухудшилось после последнего визита.",
    priority: "high",
    status: "inProgress",
    createdDate: "18.12.2024",
    dueDate: "25.12.2024",
    assignedTo: "Смирнова А.И.",
    category: "medical",
    severity: "high",
    updates: [
      {
        id: '1',
        date: "18.12.2024 10:00",
        author: "Смирнова А.И.",
        message: "Случай зарегистрирован. Требуется срочное вмешательство.",
        type: "note"
      },
      {
        id: '2',
        date: "18.12.2024 14:30",
        author: "Смирнова А.И.",
        message: "Связалась с поликлиникой, назначен срочный прием на 20.12.2024",
        type: "action"
      }
    ]
  },
  {
    id: '2',
    clientName: "Козлов Д.С.",
    clientId: '4',
    description: "Кризисная ситуация с жильем. Угроза выселения. Требуется срочное решение жилищного вопроса.",
    priority: "high",
    status: "new",
    createdDate: "17.12.2024",
    dueDate: "22.12.2024",
    assignedTo: "Смирнова А.И.",
    category: "housing",
    severity: "critical",
    updates: [
      {
        id: '3',
        date: "17.12.2024 09:15",
        author: "Смирнова А.И.",
        message: "Зарегистрирован кризисный случай. Требуется немедленное вмешательство.",
        type: "note"
      }
    ]
  },
  {
    id: '3',
    clientName: "Федорова Е.Д.",
    clientId: '7',
    description: "Проблемы с обеспечением лекарственными препаратами. Требуется срочная поставка медикаментов.",
    priority: "medium",
    status: "inProgress",
    createdDate: "16.12.2024",
    dueDate: "20.12.2024",
    assignedTo: "Козлов Д.С.",
    category: "medical",
    severity: "medium",
    updates: [
      {
        id: '4',
        date: "16.12.2024 11:20",
        author: "Козлов Д.С.",
        message: "Подана заявка в аптеку на обеспечение лекарствами.",
        type: "action"
      }
    ]
  },
  {
    id: '4',
    clientName: "Громов А.П.",
    clientId: '8',
    description: "Трудоустройство через программу социальной адаптации. Требуется помощь с составлением резюме.",
    priority: "medium",
    status: "inProgress",
    createdDate: "15.12.2024",
    dueDate: "25.12.2024",
    assignedTo: "Петрова М.В.",
    category: "financial",
    severity: "medium",
    updates: [
      {
        id: '5',
        date: "15.12.2024 16:45",
        author: "Петрова М.В.",
        message: "Проведена первая консультация по составлению резюме.",
        type: "action"
      }
    ]
  },
  {
    id: '5',
    clientName: "Семенова И.В.",
    clientId: '9',
    description: "Юридическая помощь по взысканию алиментов. Требуется подготовка документов в суд.",
    priority: "medium",
    status: "resolved",
    createdDate: "10.12.2024",
    dueDate: "15.12.2024",
    assignedTo: "Петрова М.В.",
    category: "legal",
    severity: "medium",
    updates: [
      {
        id: '6',
        date: "13.12.2024 14:00",
        author: "Петрова М.В.",
        message: "Все документы подготовлены и поданы в суд. Дело принято к производству.",
        type: "resolution"
      }
    ]
  }
];

const clientMetrics: ClientMetric[] = [
  { 
    category: "Всего клиентов", 
    value: "1,247", 
    trend: "up", 
    color: "#3B82F6",
    icon: "👥",
    change: "+12",
    description: "Зарегистрировано в системе"
  },
  { 
    category: "Активных клиентов", 
    value: "894", 
    trend: "up", 
    color: "#10B981",
    icon: "✅",
    change: "+8",
    description: "Получают услуги в текущем месяце"
  },
  { 
    category: "Новых за месяц", 
    value: "+47", 
    trend: "up", 
    color: "#8B5CF6",
    icon: "🆕",
    description: "Новые регистрации"
  },
  { 
    category: "Средняя удовлетворенность", 
    value: "94%", 
    trend: "up", 
    color: "#F59E0B",
    icon: "⭐",
    change: "+2%",
    description: "По отзывам клиентов"
  },
  { 
    category: "Оказано услуг", 
    value: "8,967", 
    trend: "up", 
    color: "#06B6D4",
    icon: "🏥",
    change: "+324",
    description: "За текущий квартал"
  },
  { 
    category: "Социальные случаи", 
    value: "52", 
    trend: "down", 
    color: "#EC4899",
    icon: "⚡",
    change: "-3",
    description: "Требуют решения"
  }
];

const clientDistribution = [
  { category: "Пенсионеры", count: 458, percentage: 37, color: "#3B82F6" },
  { category: "Инвалиды", count: 291, percentage: 23, color: "#10B981" },
  { category: "Семьи", count: 314, percentage: 25, color: "#8B5CF6" },
  { category: "Другие", count: 184, percentage: 15, color: "#F59E0B" }
];

const serviceStatistics = [
  { service: "Социальный патронаж", clients: 248, trend: "up" },
  { service: "Психологическая помощь", clients: 189, trend: "up" },
  { service: "Юридические консультации", clients: 158, trend: "stable" },
  { service: "Медицинский уход", clients: 136, trend: "up" },
  { service: "Трудоустройство", clients: 124, trend: "up" },
  { service: "Реабилитация", clients: 112, trend: "up" }
];

// ========== ОСНОВНОЙ КОМПОНЕНТ СТРАНИЦЫ ==========

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

export default function EnhancedClientsPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'priority' | 'lastVisit'>('name');

  // Обновление времени
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(formatTime(now));
      setCurrentDate(formatDate(now));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // Фильтрация и сортировка клиентов
  const filteredClients = useMemo(() => {
    let filtered = clientsData.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || client.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'priority':
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'lastVisit':
          return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, filterStatus, filterPriority, sortBy]);

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    // Реализация редактирования клиента
    console.log('Edit client:', client);
  };

  const handleDeleteClient = (clientId: string) => {
    // Реализация удаления клиента
    console.log('Delete client:', clientId);
  };

  const shouldDisableAnimations = isMobile;

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
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        @media (max-width: 640px) {
          .client-metrics {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }
          
          .client-detail-grid {
            grid-template-columns: 1fr;
          }
          
          .bento-section {
            padding: 0.75rem;
          }
        }

        @media (max-width: 768px) {
          .distribution-grid {
            grid-template-columns: 1fr;
          }
          
          .card--border-glow::before {
            padding: 1px;
          }
        }

        @media (max-width: 1024px) {
          .advanced-particle-card {
            transform: none !important;
          }
        }

        /* Улучшения для touch устройств */
        @media (hover: none) and (pointer: coarse) {
          .card--border-glow:hover {
            transform: none;
          }
          
          .advanced-particle-card {
            cursor: pointer;
          }
          
          .global-spotlight {
            display: none;
          }
        }

        /* Оптимизация анимаций для мобильных */
        @media (prefers-reduced-motion: reduce) {
          .advanced-particle,
          .card--border-glow::before,
          .global-spotlight {
            display: none;
          }
          
          .motion-div {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/demo/social/owner" className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group">
                <motion.span
                  whileHover={{ x: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  ←
                </motion.span>
                <span className="text-sm sm:text-base">На главную</span>
              </Link>
              <div className="text-white/60 text-xs sm:text-sm text-right hidden sm:block">
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
              <span className="text-white text-xs sm:text-sm">База клиентов активна</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Заголовок страницы */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 md:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <motion.h1 
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-3xl sm:text-4xl">👥</span>
                  <span>Все клиенты</span>
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-base sm:text-lg mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  1,247 человек • Полный охват целевой аудитории • Высокая удовлетворенность услугами
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-1 sm:gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>12 активных</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>94% удовлетворенность</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>8,967 услуг оказано</span>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="text-right w-full sm:w-auto"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-white font-bold text-xl sm:text-2xl bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg animate-float inline-block">
                  +47
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Новых за месяц</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сегодня</div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-xl sm:blur-2xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-tr from-emerald-500/15 to-cyan-500/15 rounded-full blur-lg sm:blur-xl" />
          </div>
        </motion.section>

        {/* Основные метрики клиентов */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-4 client-metrics">
            {clientMetrics.map((metric, index) => (
              <motion.div 
                key={index} 
                className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-2 sm:p-4 text-center cursor-pointer hover:bg-white/10 transition-all duration-300 group"
                style={{ '--glow-color': metric.color.replace('#', '').replace(/../g, x => x+',') } as React.CSSProperties}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                whileHover={{ y: -3, scale: 1.02 }}
              >
                <motion.div 
                  className="text-2xl sm:text-3xl mb-1 sm:mb-3"
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {metric.icon}
                </motion.div>
                <div className="text-white font-bold text-lg sm:text-xl mb-1 sm:mb-2">{metric.value}</div>
                <div className="text-white/60 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2">{metric.category}</div>
                <div className="flex items-center justify-center gap-1">
                  {metric.change && (
                    <span className={`text-xs ${
                      metric.trend === 'up' ? 'text-green-400' : 
                      metric.trend === 'down' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {metric.change}
                    </span>
                  )}
                  <span className={`text-xs ${
                    metric.trend === 'up' ? 'text-green-400' : 
                    metric.trend === 'down' ? 'text-red-400' : 'text-blue-400'
                  }`}>
                    {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                  </span>
                </div>
                {metric.description && (
                  <div className="text-white/40 text-xs mt-2 hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {metric.description}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Bento Grid с анимациями */}
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={true}
          spotlightRadius={DEFAULT_SPOTLIGHT_RADIUS}
          glowColor={DEFAULT_GLOW_COLOR}
        />

        {/* Сетка клиентов */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <BentoCardGrid gridRef={gridRef}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredClients.map((client, index) => (
                <ClientCard 
                  key={client.id} 
                  client={client} 
                  index={index}
                  onCardClick={handleClientClick}
                />
              ))}
            </div>

            {filteredClients.length === 0 && (
              <motion.div 
                className="text-center py-12 sm:py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">🔍</div>
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Клиенты не найдены</h3>
                <p className="text-white/60 text-base sm:text-lg">
                  Попробуйте изменить параметры поиска или фильтры
                </p>
              </motion.div>
            )}
          </BentoCardGrid>
        </motion.section>

        {/* Социальные случаи и аналитика */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 distribution-grid">
            {/* Социальные случаи */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">⚡</span>
                  <span>Социальные случаи</span>
                </h3>
                <Link href="/demo/social/owner/modules/clients/cases" className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm flex items-center gap-1 sm:gap-2 transition-colors group">
                  <span>Все случаи</span>
                  <motion.span
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    →
                  </motion.span>
                </Link>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {socialCases.map((caseItem, index) => (
                  <SocialCaseCard 
                    key={caseItem.id} 
                    caseItem={caseItem} 
                    index={index}
                  />
                ))}
              </div>
              
              <motion.div 
                className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-500/10 rounded-lg sm:rounded-xl border border-yellow-500/20 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-yellow-400 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                  <span>⚠️</span>
                  <span>Требуют внимания: 2 срочных случая</span>
                </div>
                <div className="text-yellow-400/60 text-xs mt-1 sm:mt-2">
                  Иванова М.П. и Козлов Д.С. нуждаются в срочной помощи
                </div>
              </motion.div>
            </div>

            {/* Распределение клиентов */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">📊</span>
                <span>Распределение клиентов</span>
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {clientDistribution.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    whileHover={{ x: 2 }}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      <motion.div 
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm truncate">{item.category}</div>
                        <div className="text-white/60 text-xs">{item.count} человек</div>
                      </div>
                    </div>
                    <div className="text-white font-bold text-base sm:text-lg flex-shrink-0 ml-2 sm:ml-3 bg-white/5 px-2 sm:px-3 py-1 rounded-lg border border-white/10">
                      {item.percentage}%
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-500/10 rounded-lg sm:rounded-xl border border-blue-500/20 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="text-blue-400 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                  <span>💡</span>
                  <span>Основная категория: Пенсионеры (37%)</span>
                </div>
                <div className="text-blue-400/60 text-xs mt-1 sm:mt-2">
                  Наиболее востребована услуга социального патронажа
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Статистика услуг и быстрые действия */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Статистика услуг */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">📈</span>
                <span>Популярные услуги</span>
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {serviceStatistics.map((service, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    whileHover={{ scale: 1.01, y: -1 }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm truncate">{service.service}</div>
                      <div className="text-white/60 text-xs">{service.clients} клиентов</div>
                    </div>
                    <div className={`text-xs sm:text-sm font-bold flex-shrink-0 ml-2 sm:ml-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border backdrop-blur-sm ${
                      service.trend === 'up' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                      service.trend === 'down' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                      'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {service.trend === 'up' ? '↗ Рост' : service.trend === 'down' ? '↘ Спад' : '→ Стабильно'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Быстрые действия */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">🚀</span>
                <span>Быстрые действия</span>
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { icon: '📋', label: 'Создать новый социальный случай', color: 'blue' },
                  { icon: '📊', label: 'Сформировать отчет по клиентам', color: 'green' },
                  { icon: '👥', label: 'Назначить куратора клиенту', color: 'purple' },
                  { icon: '📞', label: 'Массовая рассылка уведомлений', color: 'orange' }
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    className={`w-full bg-${action.color}-500/20 hover:bg-${action.color}-500/30 border border-${action.color}-500/30 text-${action.color}-400 px-3 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm font-medium text-left flex items-center gap-3 sm:gap-4 group backdrop-blur-sm`}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.6 }}
                  >
                    <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300">{action.icon}</span>
                    <span className="flex-1 text-left">{action.label}</span>
                    <motion.span
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ x: 2 }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Контакты отдела */}
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">📞</span>
                <span>Отдел работы с клиентами</span>
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { name: "Смирнова Анна Ивановна", role: "Руководитель отдела", email: "anna.smirnova@zabota.org" },
                  { name: "Петрова Мария Владимировна", role: "Старший куратор", email: "maria.petrova@zabota.org" },
                  { name: "Козлов Дмитрий Сергеевич", role: "Социальный работник", email: "dmitry.kozlov@zabota.org" }
                ].map((contact, index) => (
                  <motion.div 
                    key={index}
                    className="p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.7 }}
                    whileHover={{ scale: 1.01, y: -1 }}
                  >
                    <div className="text-white font-medium text-sm mb-1">{contact.name}</div>
                    <div className="text-white/60 text-xs mb-2">{contact.role}</div>
                    <div className="text-blue-400 text-xs group-hover:text-blue-300 transition-colors truncate">{contact.email}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer 
        className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-8 sm:mt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-white/60 text-xs sm:text-sm">
            <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
              <span>© 2024 Система управления социальными услугами</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Версия 2.1.0</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <span>{filteredClients.length} показано из {clientsData.length}</span>
              <span>•</span>
              <span>Обновлено: {formatRelativeTime(new Date().toISOString())}</span>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Модальное окно деталей клиента */}
      <ClientDetailsModal 
        client={selectedClient}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
      />
    </div>
  );
}