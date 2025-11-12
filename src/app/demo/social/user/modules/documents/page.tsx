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

interface Document {
  id: string;
  title: string;
  type: 'personal' | 'application' | 'certificate' | 'history';
  category: string;
  status: 'active' | 'expired' | 'pending' | 'rejected';
  dateCreated: string;
  dateExpires?: string;
  fileSize: string;
  fileFormat: string;
  description: string;
  tags: string[];
  downloadUrl?: string;
  previewUrl?: string;
  importance: 'high' | 'medium' | 'low';
  isSigned: boolean;
  signDate?: string;
  relatedDocuments?: string[];
}

interface DocumentCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  count: number;
  features: string[];
  actionText: string;
}

interface ApplicationForm {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'available' | 'draft' | 'submitted';
  lastModified: string;
  fields: FormField[];
  estimatedTime: string;
  requirements: string[];
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'file' | 'checkbox';
  required: boolean;
  options?: string[];
}

// ========== УТИЛИТЫ ==========

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const formatFileSize = (size: string): string => {
  return size;
};

const getStatusColor = (status: Document['status']) => {
  switch (status) {
    case 'active': return COLORS.success;
    case 'expired': return COLORS.error;
    case 'pending': return COLORS.warning;
    case 'rejected': return COLORS.error;
    default: return COLORS.gray;
  }
};

const getStatusText = (status: Document['status']) => {
  switch (status) {
    case 'active': return 'Активен';
    case 'expired': return 'Истек';
    case 'pending': return 'На рассмотрении';
    case 'rejected': return 'Отклонен';
    default: return 'Неизвестно';
  }
};

const getImportanceColor = (importance: Document['importance']) => {
  switch (importance) {
    case 'high': return COLORS.error;
    case 'medium': return COLORS.warning;
    case 'low': return COLORS.success;
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

const DocumentDetailsModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  document: Document;
}> = ({ isOpen, onClose, document }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={document.title} size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-white/60 text-sm mb-1">Тип документа</div>
            <div className="text-white font-semibold">
              {document.type === 'personal' ? 'Личный документ' :
               document.type === 'application' ? 'Заявление' :
               document.type === 'certificate' ? 'Справка' : 'История обращений'}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-white/60 text-sm mb-1">Статус</div>
            <div 
              className="font-semibold"
              style={{ color: `rgb(${getStatusColor(document.status)})` }}
            >
              {getStatusText(document.status)}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-white/60 text-sm mb-1">Дата создания</div>
            <div className="text-white font-semibold">{formatDate(document.dateCreated)}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-white/60 text-sm mb-1">Формат</div>
            <div className="text-white font-semibold">{document.fileFormat} • {document.fileSize}</div>
          </div>
        </div>

        {document.dateExpires && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-white/60 text-sm mb-1">Действует до</div>
            <div className="text-white font-semibold">{formatDate(document.dateExpires)}</div>
          </div>
        )}

        <div>
          <h4 className="text-white font-semibold mb-3">Описание</h4>
          <p className="text-white/60 leading-relaxed">{document.description}</p>
        </div>

        {document.tags.length > 0 && (
          <div>
            <h4 className="text-white font-semibold mb-3">Теги</h4>
            <div className="flex flex-wrap gap-2">
              {document.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm bg-white/10 text-white/80 backdrop-blur-sm border border-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button className="flex-1 py-3 px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-xl transition-all duration-300">
            📥 Скачать документ
          </button>
          <button className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-300">
            👁️ Предпросмотр
          </button>
        </div>
      </div>
    </Modal>
  );
};

const ApplicationFormModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  form: ApplicationForm;
}> = ({ isOpen, onClose, form }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={form.title} size="xl">
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-white/60">{form.description}</p>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-semibold">Заполните форму</h4>
          {form.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="text-white text-sm">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              
              {field.type === 'text' && (
                <input
                  type="text"
                  value={formData[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
                  required={field.required}
                />
              )}
              
              {field.type === 'select' && field.options && (
                <select
                  value={formData[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                  required={field.required}
                >
                  <option value="">Выберите вариант</option>
                  {field.options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              )}
              
              {field.type === 'date' && (
                <input
                  type="date"
                  value={formData[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                  required={field.required}
                />
              )}
              
              {field.type === 'checkbox' && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData[field.id] || false}
                    onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                    className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                    required={field.required}
                  />
                  <span className="text-white text-sm">Согласен с условиями</span>
                </label>
              )}
            </div>
          ))}
        </div>

        {form.requirements.length > 0 && (
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <h5 className="text-yellow-400 font-semibold mb-2">Требования:</h5>
            <ul className="text-yellow-300/80 text-sm space-y-1">
              {form.requirements.map((req, index) => (
                <li key={index}>• {req}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors duration-300">
            📄 Отправить заявление
          </button>
          <button className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-300">
            💾 Сохранить черновик
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ========== МОКИ ДАННЫХ ==========

const documentCategories: DocumentCategory[] = [
  {
    id: 'personal',
    title: 'Документы',
    description: 'Паспорта, свидетельства, договоры и другие персональные документы',
    icon: '📄',
    color: COLORS.blue,
    count: 4,
    features: [
      'Электронные копии',
      'Юридическая сила',
      'Автопродление',
      'Уведомления',
      'Безопасное хранение',
      'Быстрый доступ'
    ],
    actionText: 'Просмотреть документы'
  },
  {
    id: 'applications',
    title: 'Заявления',
    description: 'Готовые шаблоны заявлений и форм для различных целей',
    icon: '📝',
    color: COLORS.emerald,
    count: 8,
    features: [
      'Автозаполнение',
      'Электронная подпись',
      'Отслеживание статуса',
      'Шаблоны',
      'История подачи',
      'Уведомления'
    ],
    actionText: 'Заполнить форму'
  },
  {
    id: 'certificates',
    title: 'Справки',
    description: 'Официальные справки, выписки и сертификаты',
    icon: '🏛️',
    color: COLORS.orange,
    count: 2,
    features: [
      'Официальные бланки',
      'Электронная подпись',
      'Проверка подлинности',
      'Архив копий',
      'Срочное оформление',
      'Доставка'
    ],
    actionText: 'Заказать справку'
  },
  {
    id: 'history',
    title: 'История',
    description: 'Архив всех обращений, заявлений и документооборота',
    icon: '📊',
    color: COLORS.purple,
    count: 6,
    features: [
      'Полный архив',
      'Поиск по датам',
      'Фильтрация',
      'Статистика',
      'Экспорт данных',
      'Аналитика'
    ],
    actionText: 'Открыть историю'
  }
];

const documents: Document[] = [
  // Личные документы
  {
    id: '1',
    title: 'Паспорт гражданина РФ',
    type: 'personal',
    category: 'Удостоверение личности',
    status: 'active',
    dateCreated: '2024-01-15',
    dateExpires: '2034-01-15',
    fileSize: '2.4 MB',
    fileFormat: 'PDF',
    description: 'Основной документ, удостоверяющий личность гражданина Российской Федерации на территории России.',
    tags: ['паспорт', 'удостоверение', 'личность'],
    importance: 'high',
    isSigned: true,
    signDate: '2024-01-15'
  },
  {
    id: '2',
    title: 'Водительское удостоверение',
    type: 'personal',
    category: 'Водительские права',
    status: 'active',
    dateCreated: '2023-05-20',
    dateExpires: '2033-05-20',
    fileSize: '1.8 MB',
    fileFormat: 'PDF',
    description: 'Документ, подтверждающий право управления транспортными средствами категории B.',
    tags: ['водительские права', 'транспорт', 'категория B'],
    importance: 'high',
    isSigned: true,
    signDate: '2023-05-20'
  },
  {
    id: '3',
    title: 'Свидетельство о рождении',
    type: 'personal',
    category: 'Гражданский статус',
    status: 'active',
    dateCreated: '1990-08-15',
    fileSize: '1.2 MB',
    fileFormat: 'PDF',
    description: 'Документ, подтверждающий факт государственной регистрации рождения ребенка.',
    tags: ['свидетельство', 'рождение', 'гражданство'],
    importance: 'high',
    isSigned: true
  },
  {
    id: '4',
    title: 'Договор аренды квартиры',
    type: 'personal',
    category: 'Недвижимость',
    status: 'active',
    dateCreated: '2024-02-01',
    dateExpires: '2025-01-31',
    fileSize: '3.1 MB',
    fileFormat: 'PDF',
    description: 'Договор аренды жилого помещения с правом продления.',
    tags: ['аренда', 'недвижимость', 'договор'],
    importance: 'medium',
    isSigned: true,
    signDate: '2024-02-01'
  },

  // Заявления и формы
  {
    id: '5',
    title: 'Заявление на отпуск',
    type: 'application',
    category: 'Трудовые отношения',
    status: 'pending',
    dateCreated: '2024-11-20',
    fileSize: '0.8 MB',
    fileFormat: 'DOCX',
    description: 'Заявление на предоставление ежегодного оплачиваемого отпуска.',
    tags: ['отпуск', 'работа', 'заявление'],
    importance: 'medium',
    isSigned: false
  },
  {
    id: '6',
    title: 'Анкета на визу',
    type: 'application',
    category: 'Визовые документы',
    status: 'active',
    dateCreated: '2024-10-15',
    fileSize: '1.1 MB',
    fileFormat: 'PDF',
    description: 'Заполненная анкета для получения шенгенской визы.',
    tags: ['виза', 'анкета', 'путешествия'],
    importance: 'high',
    isSigned: true,
    signDate: '2024-10-15'
  },

  // Справки и выписки
  {
    id: '7',
    title: 'Справка о доходах',
    type: 'certificate',
    category: 'Финансы',
    status: 'active',
    dateCreated: '2024-11-18',
    fileSize: '0.9 MB',
    fileFormat: 'PDF',
    description: 'Официальная справка о размере заработной платы за последние 6 месяцев.',
    tags: ['доходы', 'справка', 'финансы'],
    importance: 'medium',
    isSigned: true,
    signDate: '2024-11-18'
  },
  {
    id: '8',
    title: 'Выписка из ЕГРН',
    type: 'certificate',
    category: 'Недвижимость',
    status: 'active',
    dateCreated: '2024-11-10',
    fileSize: '1.5 MB',
    fileFormat: 'PDF',
    description: 'Выписка из Единого государственного реестра недвижимости об объекте.',
    tags: ['егрн', 'недвижимость', 'выписка'],
    importance: 'high',
    isSigned: true,
    signDate: '2024-11-10'
  },

  // История обращений
  {
    id: '9',
    title: 'Обращение в техподдержку',
    type: 'history',
    category: 'Техническая поддержка',
    status: 'active',
    dateCreated: '2024-11-22',
    fileSize: '0.5 MB',
    fileFormat: 'TXT',
    description: 'История обращения по вопросу настройки личного кабинета.',
    tags: ['техподдержка', 'обращение', 'история'],
    importance: 'low',
    isSigned: false
  }
];

const applicationForms: ApplicationForm[] = [
  {
    id: '1',
    title: 'Заявление на материальную помощь',
    description: 'Форма для подачи заявления на получение материальной помощи в сложной жизненной ситуации',
    category: 'Социальная поддержка',
    status: 'available',
    lastModified: '2024-11-15',
    estimatedTime: '15-20 минут',
    requirements: [
      'Паспорт гражданина РФ',
      'Справка о доходах',
      'Документы, подтверждающие сложную ситуацию'
    ],
    fields: [
      {
        id: 'fullName',
        label: 'ФИО заявителя',
        type: 'text',
        required: true
      },
      {
        id: 'birthDate',
        label: 'Дата рождения',
        type: 'date',
        required: true
      },
      {
        id: 'reason',
        label: 'Причина обращения',
        type: 'select',
        required: true,
        options: [
          'Лечение заболевания',
          'Потеря кормильца',
          'Стихийное бедствие',
          'Другая причина'
        ]
      },
      {
        id: 'amount',
        label: 'Запрашиваемая сумма',
        type: 'text',
        required: true
      },
      {
        id: 'agree',
        label: 'Согласие на обработку данных',
        type: 'checkbox',
        required: true
      }
    ]
  },
  {
    id: '2',
    title: 'Заявление на получение льготы',
    description: 'Форма для оформления льгот по оплате жилищно-коммунальных услуг',
    category: 'Льготы',
    status: 'available',
    lastModified: '2024-11-10',
    estimatedTime: '20-25 минут',
    requirements: [
      'Паспорт',
      'Свидетельства о рождении детей',
      'Справка о составе семьи',
      'Документы на жилье'
    ],
    fields: [
      {
        id: 'fullName',
        label: 'ФИО заявителя',
        type: 'text',
        required: true
      },
      {
        id: 'address',
        label: 'Адрес проживания',
        type: 'text',
        required: true
      },
      {
        id: 'familyMembers',
        label: 'Количество членов семьи',
        type: 'text',
        required: true
      },
      {
        id: 'income',
        label: 'Средний доход на члена семьи',
        type: 'text',
        required: true
      },
      {
        id: 'documents',
        label: 'Приложенные документы',
        type: 'checkbox',
        required: true
      }
    ]
  }
];

const quickActions = [
  { 
    icon: '📥', 
    label: 'Загрузить документ', 
    color: COLORS.blue,
    description: 'Добавить новый документ' 
  },
  { 
    icon: '🔍', 
    label: 'Поиск документов', 
    color: COLORS.emerald,
    description: 'Найти по названию' 
  },
  { 
    icon: '📋', 
    label: 'Шаблоны форм', 
    color: COLORS.orange,
    description: 'Готовые шаблоны' 
  },
  { 
    icon: '🖨️', 
    label: 'Печать документов', 
    color: COLORS.purple,
    description: 'Отправить на печать' 
  },
  { 
    icon: '📧', 
    label: 'Отправить по email', 
    color: COLORS.cyan,
    description: 'Поделиться документом' 
  },
  { 
    icon: '🔒', 
    label: 'Защита документов', 
    color: COLORS.red,
    description: 'Настройки безопасности' 
  }
];

// ========== ВИДЖЕТЫ ==========

function DocumentCategoryCard({ category, onCardClick }: { category: DocumentCategory; onCardClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  const baseClassName = `card flex flex-col justify-between relative min-h-[200px] w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow`;

  const cardStyle = {
    backgroundColor: '#060010',
    borderColor: 'var(--border-color)',
    color: 'var(--white)',
    '--glow-x': '50%',
    '--glow-y': '50%',
    '--glow-intensity': '0',
    '--glow-radius': '250px',
    '--glow-color': category.color
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
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-grow">
          <motion.div 
            className="text-3xl"
            animate={{ scale: isHovered ? 1.3 : 1, rotate: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            {category.icon}
          </motion.div>
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold text-white text-lg mb-2 leading-tight">
              {category.title}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
        <motion.div 
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-full border backdrop-blur-sm bg-white/10 text-white/80 border-white/20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          {category.count}
        </motion.div>
      </div>
      
      <div className="mb-4">
        <div className="text-white/70 text-sm mb-2">Возможности:</div>
        <div className="flex flex-wrap gap-1">
          {category.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded-lg text-xs bg-white/10 text-white/80 backdrop-blur-sm border border-white/5"
            >
              {feature}
            </span>
          ))}
          {category.features.length > 3 && (
            <span className="px-2 py-1 rounded-lg text-xs bg-white/10 text-white/60 backdrop-blur-sm border border-white/5">
              +{category.features.length - 3} еще
            </span>
          )}
        </div>
      </div>

      <motion.button
        className="w-full py-3 px-4 rounded-xl font-medium text-white text-sm backdrop-blur-sm border transition-all duration-300 mt-auto"
        style={{
          backgroundColor: `rgba(${category.color}, 0.2)`,
          borderColor: `rgba(${category.color}, 0.3)`
        }}
        whileHover={{ 
          scale: 1.02,
          backgroundColor: `rgba(${category.color}, 0.3)`
        }}
        whileTap={{ scale: 0.98 }}
      >
        {category.actionText}
      </motion.button>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${category.color}, 0.4) 0%, transparent 50%)`
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
      glowColor={category.color}
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

function DocumentCard({ document, onCardClick }: { document: Document; onCardClick: () => void }) {
  const statusColor = getStatusColor(document.status);
  const importanceColor = getImportanceColor(document.importance);

  return (
    <AdvancedParticleCard
      className="card flex flex-col relative min-h-[140px] w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': statusColor,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={statusColor}
      intensity={1.1}
      onCardClick={onCardClick}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold text-white text-sm mb-1 leading-tight">
              {document.title}
            </h3>
            <p className="text-white/60 text-xs truncate">
              {document.category}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span 
              className="px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border"
              style={{
                backgroundColor: `rgba(${statusColor}, 0.15)`,
                color: `rgb(${statusColor})`,
                borderColor: `rgba(${statusColor}, 0.3)`
              }}
            >
              {getStatusText(document.status)}
            </span>
            {document.importance === 'high' && (
              <span className="text-xs text-red-400">⚠️ Важно</span>
            )}
          </div>
        </div>

        <div className="mb-4 flex-grow">
          <p className="text-white/80 text-xs leading-relaxed line-clamp-2">
            {document.description}
          </p>
        </div>

        {document.tags && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {document.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-lg text-xs bg-white/10 text-white/80 backdrop-blur-sm border border-white/5"
              >
                {tag}
              </span>
            ))}
            {document.tags.length > 2 && (
              <span className="px-2 py-1 rounded-lg text-xs bg-white/10 text-white/60 backdrop-blur-sm border border-white/5">
                +{document.tags.length - 2}
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-white/60">
          <span>{formatDate(document.dateCreated)}</span>
          <span>{document.fileSize}</span>
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(${statusColor}, 0.4) 0%, transparent 50%)`
        }}
      />
    </AdvancedParticleCard>
  );
}

function ApplicationFormCard({ form, onCardClick }: { form: ApplicationForm; onCardClick: () => void }) {
  return (
    <AdvancedParticleCard
      className="card flex flex-col relative min-h-[140px] w-full max-w-full p-4 sm:p-6 rounded-2xl border border-white/10 font-light overflow-hidden transition-all duration-300 ease-in-out card--border-glow"
      style={{
        backgroundColor: '#060010',
        '--glow-color': COLORS.emerald,
        '--glow-intensity': '0',
      } as React.CSSProperties}
      glowColor={COLORS.emerald}
      intensity={1.1}
      onCardClick={onCardClick}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold text-white text-sm mb-1 leading-tight">
              {form.title}
            </h3>
            <p className="text-white/60 text-xs">
              {form.category}
            </p>
          </div>
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border bg-green-500/20 text-green-400 border-green-500/30"
          >
            {form.status === 'available' ? 'Доступно' : form.status === 'draft' ? 'Черновик' : 'Отправлено'}
          </span>
        </div>

        <div className="mb-4 flex-grow">
          <p className="text-white/80 text-xs leading-relaxed line-clamp-2">
            {form.description}
          </p>
        </div>

        <div className="flex justify-between items-center text-xs text-white/60">
          <span>Обновлено: {formatDate(form.lastModified)}</span>
          <span>{form.estimatedTime}</span>
        </div>

        <div className="flex gap-1 mt-2">
          {form.requirements.slice(0, 2).map((req, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded-lg text-xs bg-white/10 text-white/60 backdrop-blur-sm border border-white/5"
            >
              {req}
            </span>
          ))}
          {form.requirements.length > 2 && (
            <span className="px-2 py-1 rounded-lg text-xs bg-white/10 text-white/60 backdrop-blur-sm border border-white/5">
              +{form.requirements.length - 2}
            </span>
          )}
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

export default function DocumentsPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('personal');
  const [modalState, setModalState] = useState({
    documentDetails: false,
    applicationForm: false
  });
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedForm, setSelectedForm] = useState<ApplicationForm | null>(null);

  // Используем useMemo для стабильных данных
  const stats = useMemo(() => ({
    totalDocuments: documents.length,
    activeDocuments: documents.filter(d => d.status === 'active').length,
    expiredDocuments: documents.filter(d => d.status === 'expired').length,
    pendingDocuments: documents.filter(d => d.status === 'pending').length,
    totalForms: applicationForms.length,
    availableForms: applicationForms.filter(f => f.status === 'available').length
  }), []);

  const filteredDocuments = useMemo(() => 
    documents.filter(doc => doc.type === activeCategory),
  [activeCategory]);

  const filteredForms = useMemo(() => 
    applicationForms.filter(form => form.category.toLowerCase().includes(
      activeCategory === 'applications' ? 'социальная' : ''
    )),
  [activeCategory]);

  // Добавляем состояние для отслеживания гидратации
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

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
  }, [isMounted]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setModalState(prev => ({ ...prev, documentDetails: true }));
  };

  const handleFormClick = (form: ApplicationForm) => {
    setSelectedForm(form);
    setModalState(prev => ({ ...prev, applicationForm: true }));
  };

  const closeModal = (modalName: keyof typeof modalState) => {
    setModalState(prev => ({ ...prev, [modalName]: false }));
  };

  // Если не mounted, показываем минимальный контент для избежания несоответствия
  if (!isMounted) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>
        <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="card--border-glow relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-white text-lg">Загрузка...</div>
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
        {modalState.documentDetails && selectedDocument && (
          <DocumentDetailsModal 
            isOpen={modalState.documentDetails} 
            onClose={() => closeModal('documentDetails')} 
            document={selectedDocument}
          />
        )}
        
        {modalState.applicationForm && selectedForm && (
          <ApplicationFormModal 
            isOpen={modalState.applicationForm} 
            onClose={() => closeModal('applicationForm')} 
            form={selectedForm}
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
              <Link href="/demo/social/owner" className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer">
                <motion.span
                  whileHover={{ x: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  ←
                </motion.span>
                <span className="text-sm sm:text-base">На главную</span>
              </Link>
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
              <span className="text-white text-xs sm:text-sm">Документы синхронизированы</span>
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
                  <span className="text-2xl sm:text-3xl lg:text-4xl">📁</span>
                  <span>Личные документы</span>
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Центр социальной помощи "Забота" • Управление документами и формами
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>{stats.totalDocuments} документов</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>{stats.activeDocuments} активных</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>{stats.totalForms} доступных форм</span>
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
                  {stats.activeDocuments}
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Активных документов</div>
                <div className="text-white/40 text-xs mt-1">Обновлено сегодня</div>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between pt-4 sm:pt-6 border-t border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex space-x-1 p-1 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
                {documentCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeCategory === category.id
                        ? 'bg-white/20 text-white shadow-lg border border-white/30'
                        : 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.title}
                  </motion.button>
                ))}
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <motion.button
                  className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white transition-all duration-300 text-xs sm:text-sm font-medium backdrop-blur-sm flex items-center gap-1 sm:gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>📤 Экспорт архива</span>
                </motion.button>
                <motion.button
                  className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 transition-all duration-300 text-xs sm:text-sm font-medium backdrop-blur-sm flex items-center gap-1 sm:gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>📎 Загрузить документ</span>
                </motion.button>
              </div>
            </motion.div>

            <motion.div 
              className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center">
                <div className="text-green-400 font-bold text-base sm:text-xl">{stats.totalDocuments}</div>
                <div className="text-white/60 text-xs">Всего документов</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold text-base sm:text-xl">{stats.activeDocuments}</div>
                <div className="text-white/60 text-xs">Активных</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-bold text-base sm:text-xl">{stats.totalForms}</div>
                <div className="text-white/60 text-xs">Доступных форм</div>
              </div>
              <div className="text-center">
                <div className="text-cyan-400 font-bold text-base sm:text-xl">{stats.expiredDocuments}</div>
                <div className="text-white/60 text-xs">Истекших</div>
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
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Категории документов</h2>
          <BentoCardGrid gridRef={gridRef} className="mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              {documentCategories.map((category) => (
                <DocumentCategoryCard 
                  key={category.id} 
                  category={category} 
                  onCardClick={() => handleCategoryClick(category.id)} 
                />
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
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
              {/* Документы */}
              <div className="xl:col-span-2">
                <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {activeCategory === 'personal' ? '📄' :
                         activeCategory === 'applications' ? '📝' :
                         activeCategory === 'certificates' ? '🏛️' : '📊'}
                      </div>
                      <h2 className="text-xl font-bold text-white">
                        {documentCategories.find(cat => cat.id === activeCategory)?.title}
                      </h2>
                    </div>
                    <span className="text-white/40 text-sm">
                      {filteredDocuments.length} документов
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {filteredDocuments.map((document) => (
                      <DocumentCard 
                        key={document.id} 
                        document={document} 
                        onCardClick={() => handleDocumentClick(document)}
                      />
                    ))}
                  </div>
                </div>

                {/* Формы заявлений */}
                {activeCategory === 'applications' && filteredForms.length > 0 && (
                  <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8 mt-4 sm:mt-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">📋</div>
                        <h2 className="text-xl font-bold text-white">Доступные формы</h2>
                      </div>
                      <span className="text-white/40 text-sm">
                        {filteredForms.length} форм
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {filteredForms.map((form) => (
                        <ApplicationFormCard 
                          key={form.id} 
                          form={form} 
                          onCardClick={() => handleFormClick(form)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Боковая панель */}
              <div className="space-y-4 sm:space-y-6">
                {/* Быстрые действия */}
                <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="text-2xl">⚡</div>
                    <h2 className="text-xl font-bold text-white">Быстрые действия</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {quickActions.map((action, index) => (
                      <QuickActionCard key={index} action={action} />
                    ))}
                  </div>
                </div>

                {/* Статистика документов */}
                <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="text-2xl">📈</div>
                    <h2 className="text-xl font-bold text-white">Статистика</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {documentCategories.map((category) => (
                      <motion.div 
                        key={category.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: category.id.charCodeAt(0) * 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-lg">{category.icon}</div>
                          <span className="text-white text-sm">{category.title}</span>
                        </div>
                        <div className="text-white font-bold">{category.count}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Срочные действия */}
                <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="text-2xl">⚠️</div>
                    <h2 className="text-xl font-bold text-white">Срочные действия</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {documents
                      .filter(doc => doc.importance === 'high' || doc.status === 'expired')
                      .slice(0, 3)
                      .map((doc) => (
                        <motion.div
                          key={doc.id}
                          className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 hover:border-red-500/30 cursor-pointer transition-all duration-300"
                          whileHover={{ y: -2 }}
                          onClick={() => handleDocumentClick(doc)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-red-400 text-sm font-semibold">
                              {doc.status === 'expired' ? 'Истек' : 'Важно'}
                            </span>
                          </div>
                          <p className="text-white text-xs leading-tight">{doc.title}</p>
                          <p className="text-white/60 text-xs mt-1">{formatDate(doc.dateCreated)}</p>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </BentoCardGrid>
        </motion.section>

        {/* Недавно добавленные документы */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🕒</div>
                <h2 className="text-xl font-bold text-white">Недавно добавленные</h2>
              </div>
              <span className="text-white/40 text-sm">
                Последние 5 документов
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {documents
                .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
                .slice(0, 5)
                .map((document) => (
                  <motion.div
                    key={document.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-300 group"
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => handleDocumentClick(document)}
                  >
                    <div className="text-center mb-3">
                      <div className="text-2xl mb-2">{document.type === 'personal' ? '📄' : 
                                                   document.type === 'application' ? '📝' : 
                                                   document.type === 'certificate' ? '🏛️' : '📊'}</div>
                      <div 
                        className={`w-2 h-2 rounded-full mx-auto mb-1 ${
                          document.status === 'active' ? 'bg-green-400' :
                          document.status === 'expired' ? 'bg-red-400' :
                          document.status === 'pending' ? 'bg-yellow-400' : 'bg-gray-400'
                        }`}
                      />
                    </div>
                    <h4 className="text-white font-semibold text-sm text-center leading-tight line-clamp-2">
                      {document.title}
                    </h4>
                    <p className="text-white/60 text-xs text-center mt-2">
                      {formatDate(document.dateCreated)}
                    </p>
                  </motion.div>
                ))}
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
              <span>© 2024 Центр социальной помощи "Забота"</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Система управления документами v2.0</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span>{documents.length} документов</span>
              <span>•</span>
              <span>Обновлено: {currentTime}</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}