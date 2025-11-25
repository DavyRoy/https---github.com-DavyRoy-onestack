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

// Улучшенный ParticleCard с лучшей производительностью
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

// Улучшенный компонент для прогресс-бара
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

// Модальное окно
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
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.classList.add('modal-open');
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('modal-open');
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(modalRef.current, 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <motion.div
        ref={modalRef}
        className={`relative bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

// Улучшенный компонент для шагов формы
const StepIndicator: React.FC<{
  currentStep: number;
  steps: { title: string; description: string }[];
}> = ({ currentStep, steps }) => {
  return (
    <div className="hidden lg:flex justify-between mb-8 relative">
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10 -z-10" />
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
            index + 1 === currentStep
              ? 'bg-blue-500 text-white scale-110'
              : index + 1 < currentStep
              ? 'bg-green-500 text-white'
              : 'bg-white/10 text-white/60'
          }`}>
            {index + 1 < currentStep ? '✓' : index + 1}
          </div>
          <div className="mt-2 text-center">
            <div className={`text-xs font-medium ${
              index + 1 === currentStep ? 'text-blue-400' : 'text-white/60'
            }`}>
              {step.title}
            </div>
            <div className="text-xs text-white/40 mt-1 hidden xl:block">
              {step.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Данные для формы
const serviceCategories = [
  {
    id: 'financial',
    title: "💰 Материальная помощь",
    description: "Финансовая поддержка и социальные выплаты",
    services: [
      "Единовременные выплаты",
      "Регулярные пособия", 
      "Субсидии ЖКХ",
      "Адресная помощь",
      "Пособия на детей",
      "Кризисная помощь"
    ],
    icon: "💰",
    color: "from-green-500/20 to-emerald-600/20",
    popular: true
  },
  {
    id: 'legal',
    title: "⚖️ Юридические консультации",
    description: "Правовая поддержка и защита интересов",
    services: [
      "Консультации по ЖКХ",
      "Семейное право",
      "Социальные вопросы",
      "Трудовые споры",
      "Жилищные вопросы",
      "Пенсионные вопросы"
    ],
    icon: "⚖️",
    color: "from-blue-500/20 to-cyan-600/20",
    popular: false
  },
  {
    id: 'medical',
    title: "🩺 Медицинская помощь", 
    description: "Медицинский уход и поддержка здоровья",
    services: [
      "Патронажный уход",
      "Медицинские изделия",
      "Экстренная помощь",
      "Реабилитация",
      "Социальный работник"
    ],
    icon: "🩺",
    color: "from-red-500/20 to-rose-600/20",
    popular: true
  },
  {
    id: 'psychological', 
    title: "💬 Психологическая поддержка",
    description: "Психологическая помощь и консультации",
    services: [
      "Горячая линия",
      "Индивидуальные консультации",
      "Групповая терапия", 
      "Кризисная помощь"
    ],
    icon: "💬",
    color: "from-purple-500/20 to-violet-600/20",
    popular: false
  }
];

const documentTypes = [
  "Паспорт РФ",
  "СНИЛС",
  "ИНН", 
  "Документы о доходах",
  "Медицинские справки",
  "Документы на жилье",
  "Трудовая книжка",
  "Пенсионное удостоверение",
  "Свидетельства о рождении детей",
  "Документы об инвалидности"
];

// Демо данные для статистики
const statsData = [
  { label: "Заявок обработано", value: "12,458", change: "+12%", trend: "up" },
  { label: "Среднее время ответа", value: "1.8 дня", change: "-0.5 дня", trend: "down" },
  { label: "Удовлетворенность", value: "94%", change: "+3%", trend: "up" },
  { label: "Одобрено заявок", value: "87%", change: "+5%", trend: "up" }
];

// Демо данные для быстрых услуг
const quickServices = [
  { title: "Экстренная помощь", icon: "🚨", time: "2-4 часа", color: "from-red-500/20 to-rose-600/20" },
  { title: "Консультация", icon: "💬", time: "24 часа", color: "from-blue-500/20 to-cyan-600/20" },
  { title: "Документы", icon: "📄", time: "1-2 дня", color: "from-green-500/20 to-emerald-600/20" },
  { title: "Выплаты", icon: "💰", time: "3-5 дней", color: "from-amber-500/20 to-orange-600/20" }
];

export default function NewRequestPage() {
  const isMobile = useMobileDetection();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{title: string; content: React.ReactNode}>({
    title: '',
    content: null
  });

  const [formData, setFormData] = useState({
    serviceCategory: '',
    specificService: '',
    fullName: '',
    phone: '',
    email: '',
    address: '',
    problemDescription: '',
    urgency: 'standard',
    documents: [] as string[],
    additionalInfo: '',
    preferredContact: 'phone'
  });

  const steps = [
    { title: "Услуга", description: "Выбор категории" },
    { title: "Данные", description: "Личная информация" },
    { title: "Детали", description: "Описание проблемы" },
    { title: "Подтверждение", description: "Проверка данных" }
  ];

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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDocumentToggle = (document: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.includes(document)
        ? prev.documents.filter(d => d !== document)
        : [...prev.documents, document]
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
    // Прокрутка к верху при смене шага
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Форма отправлена:', formData);
    
    // Показываем модальное окно успеха
    setIsSuccessModalOpen(true);
  };

  const selectedCategory = serviceCategories.find(cat => cat.id === formData.serviceCategory);

  // Функция для открытия модального окна с информацией
  const openInfoModal = (title: string, content: React.ReactNode) => {
    setModalContent({ title, content });
    setIsModalOpen(true);
  };

  // Функция для быстрого выбора услуги
  const handleQuickServiceSelect = (service: string) => {
    setFormData(prev => ({
      ...prev,
      serviceCategory: service.toLowerCase().includes('экстрен') ? 'medical' : 
                      service.toLowerCase().includes('консульт') ? 'psychological' :
                      service.toLowerCase().includes('документ') ? 'legal' : 'financial',
      specificService: service,
      urgency: service.toLowerCase().includes('экстрен') ? 'high' : 'standard'
    }));
    setCurrentStep(2);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>
      <style jsx global>{`
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
        
        .particle {
          filter: blur(0.5px);
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }

        /* Мобильная оптимизация */
        @media (max-width: 768px) {
          .card--border-glow::before {
            display: none;
          }
        }

        /* Блокировка прокрутки при открытом модальном окне */
        body.modal-open {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }

        /* Кастомный скроллбар */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Статистика и быстрые действия */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Основной заголовок */}
            <div className="lg:col-span-3 card--border-glow relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-4 sm:p-6 md:p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
                <div className="flex-1">
                  <motion.h1 
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    📝 Подать заявку на социальную услугу
                  </motion.h1>
                  <motion.p 
                    className="text-white/60 text-sm sm:text-base md:text-lg mb-3 sm:mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Заполните форму ниже для получения социальной помощи. Среднее время рассмотрения заявки — <span className="text-emerald-400">2 рабочих дня</span>.
                  </motion.p>
                  <motion.div 
                    className="flex flex-wrap gap-2 sm:gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span>4 простых шага</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span>Конфиденциально</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                      <span>Поддержка 24/7</span>
                    </div>
                  </motion.div>
                </div>
                <motion.div 
                  className="text-right mt-4 sm:mt-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-white font-bold text-lg sm:text-xl md:text-2xl bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg">
                    Шаг {currentStep}/4
                  </div>
                  <div className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Прогресс заполнения</div>
                </motion.div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <ProgressBar 
                  value={(currentStep / 4) * 100} 
                  label={`Шаг ${currentStep} из 4`}
                  color="#8B5CF6"
                  height="6px"
                />
              </div>

              {/* Step Indicator */}
              <StepIndicator currentStep={currentStep} steps={steps} />
            </div>

            {/* Боковая панель с статистикой */}
            <div className="card--border-glow relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span>📊</span>
                <span>Статистика</span>
              </h3>
              <div className="space-y-4">
                {statsData.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div>
                      <div className="text-white font-medium text-sm">{stat.label}</div>
                      <div className={`text-xs ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {stat.change}
                      </div>
                    </div>
                    <div className="text-white font-bold text-lg">{stat.value}</div>
                  </motion.div>
                ))}
              </div>
              <button
                onClick={() => openInfoModal(
                  "📊 Статистика сервиса",
                  <div className="space-y-4">
                    <p className="text-white/70">Актуальная статистика работы социальной службы за последний месяц</p>
                    <div className="space-y-3">
                      {statsData.map(stat => (
                        <div key={stat.label} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white">{stat.label}</span>
                          <div className="text-right">
                            <div className="text-white font-semibold">{stat.value}</div>
                            <div className={`text-xs ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                              {stat.change}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white text-sm py-2 rounded-lg border border-white/20 transition-colors"
              >
                Подробнее
              </button>
            </div>
          </div>
        </motion.section>

        {/* Быстрый выбор услуг */}
        {currentStep === 1 && (
          <motion.section
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span>⚡</span>
                <span>Быстрый выбор популярных услуг</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {quickServices.map((service, index) => (
                  <motion.button
                    key={service.title}
                    type="button"
                    className={`card--border-glow p-4 rounded-xl border border-white/10 bg-gradient-to-br ${service.color} backdrop-blur-lg text-left transition-all hover:scale-105`}
                    onClick={() => handleQuickServiceSelect(service.title)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="text-2xl mb-2">{service.icon}</div>
                    <div className="text-white font-semibold text-sm mb-1">{service.title}</div>
                    <div className="text-white/60 text-xs">{service.time}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Форма заявки */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card--border-glow relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
            <form onSubmit={handleSubmit}>
              {/* Шаг 1: Выбор услуги */}
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                        <span>🎯</span>
                        <span>Выберите категорию услуги</span>
                      </h2>
                      <button
                        type="button"
                        onClick={() => openInfoModal(
                          "🎯 Выбор услуги",
                          <div className="space-y-3">
                            <p className="text-white/70">Выберите наиболее подходящую категорию услуги. Если вы не уверены, можете выбрать несколько или проконсультироваться с нашим специалистом.</p>
                            <div className="space-y-2">
                              {serviceCategories.map(cat => (
                                <div key={cat.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                                  <span className="text-xl">{cat.icon}</span>
                                  <div>
                                    <div className="text-white font-medium">{cat.title.split(' ').slice(1).join(' ')}</div>
                                    <div className="text-white/60 text-sm">{cat.description}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                      {serviceCategories.map((category) => (
                        <ParticleCard
                          key={category.id}
                          className={`card--border-glow relative rounded-xl border p-4 sm:p-6 transition-all duration-300 ${
                            formData.serviceCategory === category.id 
                              ? 'border-blue-500/50 bg-blue-500/10 ring-2 ring-blue-500/20' 
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                          onCardClick={() => handleInputChange('serviceCategory', category.id)}
                        >
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="text-2xl sm:text-3xl flex-shrink-0">
                              {category.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-1 sm:mb-2">
                                <h3 className="text-white font-bold text-lg sm:text-xl">
                                  {category.title}
                                </h3>
                                {category.popular && (
                                  <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full border border-yellow-500/30">
                                    Популярно
                                  </span>
                                )}
                              </div>
                              <p className="text-white/60 text-sm sm:text-base mb-2 sm:mb-3">
                                {category.description}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {category.services.slice(0, 3).map((service, index) => (
                                  <span 
                                    key={index}
                                    className="text-xs bg-white/10 px-2 py-1 rounded border border-white/20 text-white/80"
                                  >
                                    {service}
                                  </span>
                                ))}
                                {category.services.length > 3 && (
                                  <span className="text-xs bg-white/10 px-2 py-1 rounded border border-white/20 text-white/60">
                                    +{category.services.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </ParticleCard>
                      ))}
                    </div>

                    {formData.serviceCategory && selectedCategory && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6"
                      >
                        <h3 className="text-lg font-semibold text-white mb-3">Выберите конкретную услугу:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          {selectedCategory.services.map((service, index) => (
                            <motion.button
                              key={index}
                              type="button"
                              className={`text-left p-3 rounded-lg border transition-all ${
                                formData.specificService === service
                                  ? 'bg-blue-500/20 border-blue-500/50 text-white'
                                  : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                              }`}
                              onClick={() => handleInputChange('specificService', service)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {service}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <div className="flex justify-end">
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        disabled={!formData.serviceCategory || !formData.specificService}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-2"
                        whileHover={{ scale: !formData.serviceCategory || !formData.specificService ? 1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Далее</span>
                        <span>→</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Шаг 2: Личная информация */}
              <AnimatePresence mode="wait">
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                      <span>👤</span>
                      <span>Личная информация</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          ФИО *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                          placeholder="Иванов Иван Иванович"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Телефон *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                          placeholder="+7 (999) 999-99-99"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                          placeholder="example@mail.ru"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Адрес проживания *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                          placeholder="г. Москва, ул. Примерная, д. 1"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-white text-sm font-medium mb-3">
                        Предпочтительный способ связи
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { value: 'phone', label: 'Телефон', icon: '📞' },
                          { value: 'email', label: 'Email', icon: '📧' },
                          { value: 'any', label: 'Любой', icon: '🔀' }
                        ].map((option) => (
                          <motion.button
                            key={option.value}
                            type="button"
                            className={`text-left p-4 rounded-lg border transition-all ${
                              formData.preferredContact === option.value
                                ? 'bg-blue-500/20 border-blue-500/50 text-white'
                                : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                            }`}
                            onClick={() => handleInputChange('preferredContact', option.value)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{option.icon}</span>
                              <div className="font-semibold">{option.label}</div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <motion.button
                        type="button"
                        onClick={prevStep}
                        className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg border border-white/20 transition-all duration-300 flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>←</span>
                        <span>Назад</span>
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        disabled={!formData.fullName || !formData.phone || !formData.address}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-2"
                        whileHover={{ scale: !formData.fullName || !formData.phone || !formData.address ? 1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Далее</span>
                        <span>→</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Шаг 3: Детали заявки */}
              <AnimatePresence mode="wait">
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                      <span>📋</span>
                      <span>Детали заявки</span>
                    </h2>

                    <div className="space-y-6 mb-6">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Описание проблемы *
                        </label>
                        <textarea
                          required
                          value={formData.problemDescription}
                          onChange={(e) => handleInputChange('problemDescription', e.target.value)}
                          rows={4}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                          placeholder="Подробно опишите вашу ситуацию и какую помощь вы хотели бы получить..."
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-3">
                          Срочность обработки
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { value: 'low', label: 'Низкая', desc: '1-2 недели', color: 'bg-gray-500' },
                            { value: 'standard', label: 'Стандартная', desc: '2-3 дня', color: 'bg-blue-500' },
                            { value: 'high', label: 'Высокая', desc: '24 часа', color: 'bg-red-500' }
                          ].map((option) => (
                            <motion.button
                              key={option.value}
                              type="button"
                              className={`text-left p-4 rounded-lg border transition-all ${
                                formData.urgency === option.value
                                  ? 'bg-blue-500/20 border-blue-500/50 text-white'
                                  : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                              }`}
                              onClick={() => handleInputChange('urgency', option.value)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`w-2 h-2 rounded-full ${option.color}`} />
                                <div className="font-semibold">{option.label}</div>
                              </div>
                              <div className="text-sm opacity-70">{option.desc}</div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-white text-sm font-medium">
                            Имеющиеся документы (отметьте нужные)
                          </label>
                          <button
                            type="button"
                            onClick={() => openInfoModal(
                              "📄 Необходимые документы",
                              <div className="space-y-3">
                                <p className="text-white/70">Для ускорения обработки заявки подготовьте следующие документы:</p>
                                <div className="space-y-2">
                                  {documentTypes.map((doc, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                      <span className="text-white text-sm">{doc}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            className="text-white/60 hover:text-white text-xs transition-colors"
                          >
                            Список всех документов
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {documentTypes.map((doc) => (
                            <motion.label
                              key={doc}
                              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                formData.documents.includes(doc)
                                  ? 'bg-green-500/20 border-green-500/50'
                                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                              }`}
                              whileHover={{ scale: 1.02 }}
                            >
                              <input
                                type="checkbox"
                                checked={formData.documents.includes(doc)}
                                onChange={() => handleDocumentToggle(doc)}
                                className="mr-3 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500/50"
                              />
                              <span className="text-white text-sm">{doc}</span>
                            </motion.label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Дополнительная информация
                        </label>
                        <textarea
                          value={formData.additionalInfo}
                          onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                          rows={3}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                          placeholder="Любая дополнительная информация, которая может помочь в рассмотрении заявки..."
                        />
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <motion.button
                        type="button"
                        onClick={prevStep}
                        className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg border border-white/20 transition-all duration-300 flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>←</span>
                        <span>Назад</span>
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        disabled={!formData.problemDescription}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-2"
                        whileHover={{ scale: !formData.problemDescription ? 1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Далее</span>
                        <span>→</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Шаг 4: Подтверждение */}
              <AnimatePresence mode="wait">
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                      <span>✅</span>
                      <span>Подтверждение заявки</span>
                    </h2>

                    <div className="bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6 mb-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Сводка заявки:</h3>
                      
                      <div className="space-y-3 text-sm sm:text-base">
                        <div className="flex justify-between py-2 border-b border-white/10">
                          <span className="text-white/60">Услуга:</span>
                          <span className="text-white font-semibold">{formData.specificService}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/10">
                          <span className="text-white/60">ФИО:</span>
                          <span className="text-white font-semibold">{formData.fullName}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/10">
                          <span className="text-white/60">Телефон:</span>
                          <span className="text-white font-semibold">{formData.phone}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/10">
                          <span className="text-white/60">Адрес:</span>
                          <span className="text-white font-semibold">{formData.address}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/10">
                          <span className="text-white/60">Срочность:</span>
                          <span className="text-white font-semibold">
                            {formData.urgency === 'low' ? 'Низкая (1-2 недели)' :
                             formData.urgency === 'standard' ? 'Стандартная (2-3 дня)' :
                             'Высокая (24 часа)'}
                          </span>
                        </div>
                        <div className="py-2">
                          <span className="text-white/60 block mb-2">Документы:</span>
                          <div className="flex flex-wrap gap-1">
                            {formData.documents.length > 0 ? (
                              formData.documents.map((doc, index) => (
                                <span key={index} className="text-xs bg-white/10 px-2 py-1 rounded border border-white/20 text-white/80">
                                  {doc}
                                </span>
                              ))
                            ) : (
                              <span className="text-white/60 text-sm">Документы не указаны</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 sm:p-6 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="text-blue-400 text-xl">ℹ️</div>
                        <div>
                          <h4 className="text-blue-400 font-semibold mb-2">Что будет дальше?</h4>
                          <ul className="text-white/70 text-sm space-y-1">
                            <li>• Вы получите SMS с номером заявки в течение 10 минут</li>
                            <li>• Специалист свяжется с вами в указанные сроки</li>
                            <li>• Подготовьте указанные документы для проверки</li>
                            <li>• Статус заявки можно отслеживать в личном кабинете</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <motion.button
                        type="button"
                        onClick={prevStep}
                        className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg border border-white/20 transition-all duration-300 flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>←</span>
                        <span>Назад</span>
                      </motion.button>
                      <motion.button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>📨</span>
                        <span>Отправить заявку</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.section>

        {/* Дополнительная информация */}
        <motion.section
          className="mt-6 sm:mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <ParticleCard className="card--border-glow relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <div className="text-center">
                <div className="text-2xl mb-2">🛡️</div>
                <h3 className="text-white font-semibold mb-2">Конфиденциально</h3>
                <p className="text-white/60 text-sm">Все данные защищены и не передаются третьим лицам</p>
              </div>
            </ParticleCard>
            
            <ParticleCard className="card--border-glow relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="text-white font-semibold mb-2">Быстро</h3>
                <p className="text-white/60 text-sm">Среднее время рассмотрения заявки — 2 рабочих дня</p>
              </div>
            </ParticleCard>
            
            <ParticleCard className="card--border-glow relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 sm:p-6">
              <div className="text-center">
                <div className="text-2xl mb-2">📞</div>
                <h3 className="text-white font-semibold mb-2">Поддержка</h3>
                <p className="text-white/60 text-sm">Горячая линия: 8-800-555-35-35 (круглосуточно)</p>
              </div>
            </ParticleCard>
          </div>
        </motion.section>
      </main>

      {/* Модальное окно информации */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
        size="md"
      >
        {modalContent.content}
      </Modal>

      {/* Модальное окно успеха */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="✅ Заявка успешно отправлена!"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-green-400 font-semibold">Ваша заявка №{Math.random().toString(36).substr(2, 9).toUpperCase()} принята в обработку</p>
          </div>
          <div className="space-y-2 text-white/70">
            <p>• В течение 10 минут вы получите SMS с номером заявки</p>
            <p>• Специалист свяжется с вами в указанные сроки</p>
            <p>• Статус заявки можно отслеживать в личном кабинете</p>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setIsSuccessModalOpen(false);
                setCurrentStep(1);
                setFormData({
                  serviceCategory: '',
                  specificService: '',
                  fullName: '',
                  phone: '',
                  email: '',
                  address: '',
                  problemDescription: '',
                  urgency: 'standard',
                  documents: [],
                  additionalInfo: '',
                  preferredContact: 'phone'
                });
              }}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Понятно
            </button>
            <button
              onClick={() => {
                setIsSuccessModalOpen(false);
                // Здесь можно добавить логику для создания новой заявки
              }}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg border border-white/20 transition-colors"
            >
              Новая заявка
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}