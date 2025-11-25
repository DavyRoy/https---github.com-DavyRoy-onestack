'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Типы данных
interface ServiceHistory {
  id: string;
  date: string;
  mileage: number;
  serviceType: 'regular' | 'repair' | 'inspection' | 'emergency';
  title: string;
  description: string;
  cost: string;
  workshop: string;
  parts: string[];
  warrantyUntil?: string;
  nextService?: number;
}

interface TechnicalData {
  id: string;
  category: string;
  items: {
    name: string;
    value: string;
    status: 'excellent' | 'good' | 'warning' | 'critical';
    lastCheck: string;
    nextCheck?: string;
  }[];
}

interface MaintenanceReminder {
  id: string;
  type: 'service' | 'inspection' | 'insurance' | 'tax' | 'other';
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  estimatedCost?: string;
  mileage?: number;
  isOverdue: boolean;
  daysLeft: number;
}

interface MaintenanceService {
  id: string;
  name: string;
  description: string;
  recommendedInterval: string;
  lastService: string;
  nextService: string;
  mileageInterval: number;
  currentMileage: number;
  remainingMileage: number;
  status: 'due' | 'soon' | 'ok' | 'overdue';
  estimatedCost: string;
  complexity: 'low' | 'medium' | 'high';
  parts: string[];
}

// Константы для цветов
const COLORS = {
  primary: 'from-gray-900 via-black to-gray-800',
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

// Данные для истории обслуживания
const serviceHistory: ServiceHistory[] = [
  {
    id: '1',
    date: '15 дек 2024',
    mileage: 75000,
    serviceType: 'regular',
    title: 'Регулярное ТО',
    description: 'Замена масла, фильтров, диагностика систем',
    cost: '12 500 ₽',
    workshop: 'Автоцентр "Премиум Сервис"',
    parts: ['Моторное масло 5W-30', 'Масляный фильтр', 'Воздушный фильтр'],
    warrantyUntil: '15 мар 2025',
    nextService: 80000
  },
  {
    id: '2',
    date: '10 ноя 2024',
    mileage: 72000,
    serviceType: 'repair',
    title: 'Замена тормозных колодок',
    description: 'Замена передних и задних тормозных колодок, прокачка системы',
    cost: '8 300 ₽',
    workshop: 'СТО "Быстрый ремонт"',
    parts: ['Тормозные колодки передние', 'Тормозные колодки задние', 'Тормозная жидкость'],
    warrantyUntil: '10 фев 2025'
  },
  {
    id: '3',
    date: '25 сен 2024',
    mileage: 69000,
    serviceType: 'inspection',
    title: 'Диагностика ходовой части',
    description: 'Полная диагностика подвески, проверка амортизаторов и сайлентблоков',
    cost: '2 500 ₽',
    workshop: 'Автотехцентр "Профи"',
    parts: [],
    nextService: 75000
  },
  {
    id: '4',
    date: '15 авг 2024',
    mileage: 65000,
    serviceType: 'regular',
    title: 'Замена ремня ГРМ',
    description: 'Замена ремня ГРМ, роликов и помпы',
    cost: '18 900 ₽',
    workshop: 'Дилерский центр "АвтоМир"',
    parts: ['Ремень ГРМ', 'Ролики натяжители', 'Водяная помпа'],
    warrantyUntil: '15 фев 2025'
  },
  {
    id: '5',
    date: '20 июл 2024',
    mileage: 62000,
    serviceType: 'emergency',
    title: 'Ремонт системы охлаждения',
    description: 'Замена термостата и патрубков, устранение течи',
    cost: '7 800 ₽',
    workshop: 'СТО "Тепло и Тихо"',
    parts: ['Термостат', 'Патрубки системы охлаждения', 'Антифриз'],
    warrantyUntil: '20 янв 2025'
  },
  {
    id: '6',
    date: '05 июн 2024',
    mileage: 58000,
    serviceType: 'regular',
    title: 'Замена свечей зажигания',
    description: 'Замена свечей зажигания, чистка форсунок',
    cost: '6 200 ₽',
    workshop: 'Автоцентр "Двигатель"',
    parts: ['Свечи зажигания иридиевые', 'Очиститель форсунок'],
    nextService: 88000
  }
];

// Данные для технических характеристик
const technicalData: TechnicalData[] = [
  {
    id: '1',
    category: 'Двигатель',
    items: [
      { name: 'Моторное масло', value: '5W-30 Synthetic', status: 'good', lastCheck: '15 дек 2024', nextCheck: '15 мар 2025' },
      { name: 'Охлаждающая жидкость', value: '-40°C', status: 'excellent', lastCheck: '15 авг 2024', nextCheck: '15 авг 2025' },
      { name: 'Воздушный фильтр', value: 'Новый', status: 'good', lastCheck: '15 дек 2024', nextCheck: '75 000 км' },
      { name: 'Свечи зажигания', value: 'Иридиевые', status: 'warning', lastCheck: '15 авг 2024', nextCheck: '90 000 км' },
      { name: 'Ремень ГРМ', value: 'Новый', status: 'excellent', lastCheck: '15 авг 2024', nextCheck: '135 000 км' }
    ]
  },
  {
    id: '2',
    category: 'Трансмиссия',
    items: [
      { name: 'Трансмиссионная жидкость', value: 'ATF WS', status: 'good', lastCheck: '15 авг 2024', nextCheck: '100 000 км' },
      { name: 'Сцепление', value: 'Износ 30%', status: 'good', lastCheck: '25 сен 2024', nextCheck: '120 000 км' },
      { name: 'Приводные валы', value: 'Норма', status: 'excellent', lastCheck: '25 сен 2024', nextCheck: '80 000 км' },
      { name: 'Дифференциал', value: 'Жидкость заменена', status: 'good', lastCheck: '15 авг 2024', nextCheck: '100 000 км' }
    ]
  },
  {
    id: '3',
    category: 'Ходовая часть',
    items: [
      { name: 'Тормозные колодки', value: 'Новые', status: 'excellent', lastCheck: '10 ноя 2024', nextCheck: '90 000 км' },
      { name: 'Тормозные диски', value: 'Износ 20%', status: 'good', lastCheck: '10 ноя 2024', nextCheck: '110 000 км' },
      { name: 'Амортизаторы', value: 'Норма', status: 'good', lastCheck: '25 сен 2024', nextCheck: '100 000 км' },
      { name: 'Шины', value: 'Зимние', status: 'warning', lastCheck: '01 дек 2024', nextCheck: 'Сезонная замена' },
      { name: 'Рулевое управление', value: 'Люфт в норме', status: 'good', lastCheck: '25 сен 2024', nextCheck: '80 000 км' }
    ]
  },
  {
    id: '4',
    category: 'Электрика',
    items: [
      { name: 'Аккумулятор', value: '12.6V', status: 'good', lastCheck: '15 дек 2024', nextCheck: 'Через 6 месяцев' },
      { name: 'Генератор', value: '14.2V', status: 'excellent', lastCheck: '15 дек 2024', nextCheck: '80 000 км' },
      { name: 'Стартер', value: 'Норма', status: 'good', lastCheck: '15 дек 2024', nextCheck: '100 000 км' },
      { name: 'Система зажигания', value: 'Стабильная', status: 'good', lastCheck: '15 дек 2024', nextCheck: '75 000 км' }
    ]
  },
  {
    id: '5',
    category: 'Кузов и салон',
    items: [
      { name: 'Лакокрасочное покрытие', value: 'Хорошее', status: 'good', lastCheck: '01 дек 2024', nextCheck: 'По необходимости' },
      { name: 'Стеклоочистители', value: 'Новые', status: 'excellent', lastCheck: '01 дек 2024', nextCheck: '6 месяцев' },
      { name: 'Фильтр салона', value: 'Заменен', status: 'good', lastCheck: '15 дек 2024', nextCheck: '15 000 км' },
      { name: 'Система кондиционирования', value: 'Холодная', status: 'excellent', lastCheck: '15 дек 2024', nextCheck: '12 месяцев' }
    ]
  }
];

// Данные для напоминаний
const maintenanceReminders: MaintenanceReminder[] = [
  {
    id: '1',
    type: 'service',
    title: 'Замена масла',
    description: 'Плановое ТО - замена моторного масла и фильтров',
    dueDate: '15 мар 2025',
    priority: 'medium',
    estimatedCost: '12 000 ₽',
    mileage: 80000,
    isOverdue: false,
    daysLeft: 45
  },
  {
    id: '2',
    type: 'insurance',
    title: 'Страховка ОСАГО',
    description: 'Оформление полиса ОСАГО на следующий год',
    dueDate: '20 фев 2025',
    priority: 'high',
    estimatedCost: '8 500 ₽',
    isOverdue: false,
    daysLeft: 20
  },
  {
    id: '3',
    type: 'inspection',
    title: 'Технический осмотр',
    description: 'Прохождение ежегодного технического осмотра',
    dueDate: '10 янв 2025',
    priority: 'high',
    estimatedCost: '1 200 ₽',
    isOverdue: true,
    daysLeft: -5
  },
  {
    id: '4',
    type: 'tax',
    title: 'Транспортный налог',
    description: 'Оплата транспортного налога за 2024 год',
    dueDate: '01 дек 2024',
    priority: 'medium',
    estimatedCost: '3 750 ₽',
    isOverdue: true,
    daysLeft: -35
  },
  {
    id: '5',
    type: 'service',
    title: 'Замена шин',
    description: 'Сезонная замена зимних шин на летние',
    dueDate: '15 мар 2025',
    priority: 'medium',
    estimatedCost: '2 000 ₽',
    isOverdue: false,
    daysLeft: 45
  }
];

// Данные для технического обслуживания
const maintenanceServices: MaintenanceService[] = [
  {
    id: '1',
    name: 'Замена моторного масла',
    description: 'Замена моторного масла и масляного фильтра',
    recommendedInterval: '15 000 км или 12 месяцев',
    lastService: '15 дек 2024',
    nextService: '15 мар 2025',
    mileageInterval: 15000,
    currentMileage: 75000,
    remainingMileage: 5000,
    status: 'soon',
    estimatedCost: '5 000 ₽',
    complexity: 'low',
    parts: ['Моторное масло 5W-30', 'Масляный фильтр']
  },
  {
    id: '2',
    name: 'Замена воздушного фильтра',
    description: 'Замена воздушного фильтра салона и двигателя',
    recommendedInterval: '30 000 км или 24 месяца',
    lastService: '15 дек 2024',
    nextService: '75 000 км',
    mileageInterval: 30000,
    currentMileage: 75000,
    remainingMileage: 0,
    status: 'due',
    estimatedCost: '2 500 ₽',
    complexity: 'low',
    parts: ['Воздушный фильтр салона', 'Воздушный фильтр двигателя']
  },
  {
    id: '3',
    name: 'Замена тормозной жидкости',
    description: 'Полная замена тормозной жидкости, прокачка системы',
    recommendedInterval: '60 000 км или 36 месяцев',
    lastService: '10 ноя 2024',
    nextService: '120 000 км',
    mileageInterval: 60000,
    currentMileage: 75000,
    remainingMileage: 45000,
    status: 'ok',
    estimatedCost: '3 800 ₽',
    complexity: 'medium',
    parts: ['Тормозная жидкость DOT-4']
  },
  {
    id: '4',
    name: 'Замена ремня ГРМ',
    description: 'Замена ремня ГРМ, роликов и водяной помпы',
    recommendedInterval: '90 000 км или 60 месяцев',
    lastService: '15 авг 2024',
    nextService: '135 000 км',
    mileageInterval: 90000,
    currentMileage: 75000,
    remainingMileage: 60000,
    status: 'ok',
    estimatedCost: '18 900 ₽',
    complexity: 'high',
    parts: ['Ремень ГРМ', 'Ролики натяжители', 'Водяная помпа']
  },
  {
    id: '5',
    name: 'Замена топливного фильтра',
    description: 'Замена топливного фильтра тонкой очистки',
    recommendedInterval: '60 000 км или 48 месяцев',
    lastService: '15 авг 2024',
    nextService: '120 000 км',
    mileageInterval: 60000,
    currentMileage: 75000,
    remainingMileage: 45000,
    status: 'ok',
    estimatedCost: '4 200 ₽',
    complexity: 'medium',
    parts: ['Топливный фильтр']
  },
  {
    id: '6',
    name: 'Диагностика подвески',
    description: 'Комплексная диагностика ходовой части',
    recommendedInterval: '30 000 км или 24 месяца',
    lastService: '25 сен 2024',
    nextService: '105 000 км',
    mileageInterval: 30000,
    currentMileage: 75000,
    remainingMileage: 30000,
    status: 'ok',
    estimatedCost: '2 500 ₽',
    complexity: 'medium',
    parts: []
  }
];

// Утилиты
const getServiceTypeColor = (type: ServiceHistory['serviceType']) => {
  return {
    regular: COLORS.blue,
    repair: COLORS.orange,
    inspection: COLORS.emerald,
    emergency: COLORS.rose
  }[type];
};

const getServiceTypeText = (type: ServiceHistory['serviceType']) => {
  return {
    regular: 'Регулярное',
    repair: 'Ремонт',
    inspection: 'Диагностика',
    emergency: 'Срочное'
  }[type];
};

const getStatusColor = (status: TechnicalData['items'][0]['status']) => {
  return {
    excellent: COLORS.emerald,
    good: COLORS.blue,
    warning: COLORS.amber,
    critical: COLORS.rose
  }[status];
};

const getStatusText = (status: TechnicalData['items'][0]['status']) => {
  return {
    excellent: 'Отлично',
    good: 'Хорошо',
    warning: 'Внимание',
    critical: 'Критично'
  }[status];
};

const getReminderTypeColor = (type: MaintenanceReminder['type']) => {
  return {
    service: COLORS.blue,
    inspection: COLORS.emerald,
    insurance: COLORS.purple,
    tax: COLORS.orange,
    other: COLORS.gray
  }[type];
};

const getReminderTypeIcon = (type: MaintenanceReminder['type']) => {
  return {
    service: '🔧',
    inspection: '🔍',
    insurance: '📄',
    tax: '💰',
    other: '📌'
  }[type];
};

const getMaintenanceStatusColor = (status: MaintenanceService['status']) => {
  return {
    due: COLORS.rose,
    soon: COLORS.amber,
    ok: COLORS.emerald,
    overdue: COLORS.error
  }[status];
};

const getMaintenanceStatusText = (status: MaintenanceService['status']) => {
  return {
    due: 'Требуется',
    soon: 'Скоро',
    ok: 'Норма',
    overdue: 'Просрочено'
  }[status];
};

// Утилита для форматирования чисел с пробелами (решает проблему гидратации)
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Bento Card компонент
const BentoCard = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode;
  className?: string;
  enableEffects?: boolean;
  glowColor?: string;
  onClick?: () => void;
  colSpan?: number;
  rowSpan?: number;
  variant?: 'default' | 'wide' | 'tall' | 'grid' | 'compact';
  gradient?: boolean;
}>(({ 
  children, 
  className = '', 
  enableEffects = true, 
  glowColor = COLORS.blue, 
  onClick, 
  colSpan = 1, 
  rowSpan = 1, 
  variant = 'default',
  gradient = false
}, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!enableEffects || !cardRef.current) return;

    const card = cardRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const relativeX = (x / rect.width) * 100;
      const relativeY = (y / rect.height) * 100;

      card.style.setProperty('--glow-x', `${relativeX}%`);
      card.style.setProperty('--glow-y', `${relativeY}%`);
      card.style.setProperty('--glow-intensity', '1');
    };

    const handleMouseLeave = () => {
      card.style.setProperty('--glow-intensity', '0');
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enableEffects]);

  const colSpanClass = {
    1: '',
    2: 'md:col-span-2 lg:col-span-2',
    3: 'md:col-span-3 lg:col-span-3',
    4: 'md:col-span-4 lg:col-span-4',
  }[colSpan];

  const rowSpanClass = {
    1: '',
    2: 'md:row-span-2 lg:row-span-2',
    3: 'md:row-span-3 lg:row-span-3',
  }[rowSpan];

  const variantClass = {
    default: '',
    wide: 'md:col-span-2 lg:col-span-2',
    tall: 'md:row-span-2 lg:row-span-2',
    grid: 'md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2',
    compact: ''
  }[variant];

  const gradientClass = gradient ? 'bg-gradient-to-br from-white/10 to-white/5' : 'bg-white/5';

  return (
    <div
      ref={ref || cardRef}
      className={`
        relative overflow-hidden 
        rounded-2xl border border-white/10 
        ${gradientClass} backdrop-blur-lg 
        transition-all duration-300 
        hover:border-white/20 hover:bg-white/10
        w-full max-w-full
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${colSpanClass}
        ${rowSpanClass}
        ${variantClass}
        ${className}
      `}
      style={{
        '--glow-x': '50%',
        '--glow-y': '50%',
        '--glow-intensity': '0',
        '--glow-color': glowColor,
      } as React.CSSProperties}
      onClick={onClick}
    >
      {enableEffects && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{
            opacity: 'var(--glow-intensity)',
            background: `radial-gradient(400px circle at var(--glow-x) var(--glow-y), 
                         rgba(var(--glow-color), 0.15) 0%, 
                         rgba(var(--glow-color), 0.08) 30%, 
                         transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
});

BentoCard.displayName = 'BentoCard';

// Modal Component
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md',
  showCloseButton = true
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  showCloseButton?: boolean;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    fullscreen: 'max-w-full max-h-full m-4'
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 w-full ${sizeClasses[size]} border border-white/10 max-h-[90vh] overflow-y-auto shadow-2xl`}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              {title && <h3 className="text-white font-bold text-xl">{title}</h3>}
              {showCloseButton && (
                <button
                  className="text-white/60 hover:text-white transition-colors text-2xl p-1"
                  onClick={onClose}
                >
                  ×
                </button>
              )}
            </div>
          )}
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Компонент карточки истории обслуживания
const ServiceHistoryCard = ({ service, onClick }: { service: ServiceHistory; onClick?: () => void }) => {
  const serviceColor = getServiceTypeColor(service.serviceType);
  
  return (
    <BentoCard className="p-4 cursor-pointer" glowColor={serviceColor} onClick={onClick} gradient>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-sm mb-1">{service.title}</h3>
          <div className="text-white/60 text-xs mb-2">{service.description}</div>
          <div className="flex items-center gap-3 text-xs text-white/60">
            <span>📅 {service.date}</span>
            <span>🛣️ {formatNumber(service.mileage)} км</span>
            <span>🏢 {service.workshop}</span>
          </div>
        </div>
        <div className="text-right">
          <span 
            className="px-2 py-1 rounded-full text-xs border font-medium"
            style={{
              backgroundColor: `rgba(${serviceColor}, 0.2)`,
              color: `rgb(${serviceColor})`,
              borderColor: `rgba(${serviceColor}, 0.3)`
            }}
          >
            {getServiceTypeText(service.serviceType)}
          </span>
          <div className="text-white font-bold text-sm mt-1">{service.cost}</div>
        </div>
      </div>

      {service.parts.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {service.parts.slice(0, 2).map((part, index) => (
            <span key={index} className="px-1.5 py-0.5 bg-white/5 text-white/60 rounded text-xs">
              {part}
            </span>
          ))}
          {service.parts.length > 2 && (
            <span className="px-1.5 py-0.5 bg-white/5 text-white/40 rounded text-xs">
              +{service.parts.length - 2}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-white/60">
        {service.warrantyUntil && (
          <span>🛡️ Гарантия до {service.warrantyUntil}</span>
        )}
        {service.nextService && (
          <span>⏭️ Следующее ТО: {formatNumber(service.nextService)} км</span>
        )}
      </div>
    </BentoCard>
  );
};

// Компонент карточки технических данных
const TechnicalDataCard = ({ data, onClick }: { data: TechnicalData; onClick?: () => void }) => {
  return (
    <BentoCard className="p-4 cursor-pointer" glowColor={COLORS.emerald} onClick={onClick} gradient>
      <h3 className="text-white font-semibold text-sm mb-3">{data.category}</h3>
      
      <div className="space-y-2">
        {data.items.slice(0, 3).map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-white/60">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span 
                className="px-1.5 py-0.5 rounded text-xs border"
                style={{
                  backgroundColor: `rgba(${getStatusColor(item.status)}, 0.2)`,
                  color: `rgb(${getStatusColor(item.status)})`,
                  borderColor: `rgba(${getStatusColor(item.status)}, 0.3)`
                }}
              >
                {getStatusText(item.status)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {data.items.length > 3 && (
        <div className="text-white/40 text-xs mt-2">
          +{data.items.length - 3} других параметров
        </div>
      )}
    </BentoCard>
  );
};

// Компонент карточки напоминания
const ReminderCard = ({ reminder, onClick }: { reminder: MaintenanceReminder; onClick?: () => void }) => {
  const reminderColor = getReminderTypeColor(reminder.type);
  const icon = getReminderTypeIcon(reminder.type);
  
  return (
    <BentoCard 
      className="p-4 cursor-pointer" 
      glowColor={reminder.isOverdue ? COLORS.rose : reminderColor}
      onClick={onClick}
      gradient
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-xl">{icon}</div>
          <div>
            <h3 className="text-white font-semibold text-sm">{reminder.title}</h3>
            <div className="text-white/60 text-xs">{reminder.description}</div>
          </div>
        </div>
        <div className="text-right">
          <span 
            className="px-2 py-1 rounded-full text-xs border font-medium"
            style={{
              backgroundColor: `rgba(${reminderColor}, 0.2)`,
              color: `rgb(${reminderColor})`,
              borderColor: `rgba(${reminderColor}, 0.3)`
            }}
          >
            {reminder.priority === 'high' ? 'Важно' : reminder.priority === 'medium' ? 'Средне' : 'Низкий'}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Срок:</span>
          <span className={`font-medium ${
            reminder.isOverdue ? 'text-rose-400' : 'text-white'
          }`}>
            {reminder.dueDate}
          </span>
        </div>
        {reminder.estimatedCost && (
          <div className="flex justify-between">
            <span className="text-white/60">Стоимость:</span>
            <span className="text-white">{reminder.estimatedCost}</span>
          </div>
        )}
        {reminder.mileage && (
          <div className="flex justify-between">
            <span className="text-white/60">Пробег:</span>
            <span className="text-white">{formatNumber(reminder.mileage)} км</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
        <span className={`text-xs ${
          reminder.isOverdue ? 'text-rose-400' : 'text-amber-400'
        }`}>
          {reminder.isOverdue ? `Просрочено на ${Math.abs(reminder.daysLeft)} дней` : `Осталось ${reminder.daysLeft} дней`}
        </span>
        <button className="text-blue-400 hover:text-blue-300 text-xs">
          Запланировать
        </button>
      </div>
    </BentoCard>
  );
};

// Компонент карточки технического обслуживания
const MaintenanceServiceCard = ({ service, onClick }: { service: MaintenanceService; onClick?: () => void }) => {
  const statusColor = getMaintenanceStatusColor(service.status);
  const progress = ((service.mileageInterval - service.remainingMileage) / service.mileageInterval) * 100;
  
  return (
    <BentoCard className="p-4 cursor-pointer" glowColor={statusColor} onClick={onClick} gradient>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-sm mb-1">{service.name}</h3>
          <div className="text-white/60 text-xs mb-2">{service.description}</div>
        </div>
        <div className="text-right">
          <span 
            className="px-2 py-1 rounded-full text-xs border font-medium"
            style={{
              backgroundColor: `rgba(${statusColor}, 0.2)`,
              color: `rgb(${statusColor})`,
              borderColor: `rgba(${statusColor}, 0.3)`
            }}
          >
            {getMaintenanceStatusText(service.status)}
          </span>
          <div className="text-white font-bold text-sm mt-1">{service.estimatedCost}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-white/60 mb-1">
          <span>До следующего обслуживания</span>
          <span>{formatNumber(service.remainingMileage)} км</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${progress}%`,
              backgroundColor: `rgb(${statusColor})`
            }}
          />
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Интервал:</span>
          <span className="text-white">{service.recommendedInterval}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Последнее:</span>
          <span className="text-white">{service.lastService}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Следующее:</span>
          <span className="text-white">{service.nextService}</span>
        </div>
      </div>

      {service.parts.length > 0 && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
          <div className="flex flex-wrap gap-1">
            {service.parts.slice(0, 2).map((part, index) => (
              <span key={index} className="px-1.5 py-0.5 bg-white/5 text-white/60 rounded text-xs">
                {part}
              </span>
            ))}
          </div>
        </div>
      )}
    </BentoCard>
  );
};

// Компонент KPI
const KPIWidget = ({ title, value, change, description, icon, color, trend, onClick }: {
  title: string;
  value: string;
  change?: string;
  description: string;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  onClick?: () => void;
}) => {
  const trendIcon = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
  const trendColor = trend === 'up' ? COLORS.emerald : trend === 'down' ? COLORS.rose : COLORS.gray;
  
  return (
    <BentoCard className="p-4 cursor-pointer" glowColor={color} onClick={onClick} gradient>
      <div className="flex items-start justify-between mb-3">
        <div className="text-xl font-bold text-white leading-tight">
          {value}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-lg">{icon}</div>
          {change && trend && (
            <div className="flex items-center gap-1 text-xs" style={{ color: `rgb(${trendColor})` }}>
              <span>{trendIcon}</span>
              <span>{change}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-sm font-medium">{title}</span>
        </div>
        
        <div className="text-white/60 text-sm">
          {description}
        </div>
      </div>
    </BentoCard>
  );
};

// Основной компонент страницы автосервиса
export default function AutoServicePage() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  // Состояния для модальных окон
  const [isServiceHistoryModalOpen, setIsServiceHistoryModalOpen] = useState(false);
  const [isTechnicalDataModalOpen, setIsTechnicalDataModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  
  // Выбранные элементы
  const [selectedService, setSelectedService] = useState<ServiceHistory | null>(null);
  const [selectedTechnicalData, setSelectedTechnicalData] = useState<TechnicalData | null>(null);
  const [selectedReminder, setSelectedReminder] = useState<MaintenanceReminder | null>(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceService | null>(null);

  // KPI данные
  const autoServiceKPIs = [
    { 
      title: 'Текущий пробег', 
      value: '75 240 км', 
      change: '+1 240 км', 
      description: 'с последнего ТО', 
      icon: '🛣️', 
      color: COLORS.blue,
      trend: 'up' as const
    },
    { 
      title: 'Затраты на ремонт', 
      value: '42 200 ₽', 
      change: '+12 500 ₽', 
      description: 'в этом году', 
      icon: '💰', 
      color: COLORS.orange,
      trend: 'up' as const
    },
    { 
      title: 'Следующее ТО', 
      value: '5 000 км', 
      description: 'до планового обслуживания', 
      icon: '🔧', 
      color: COLORS.emerald,
      trend: 'stable' as const
    },
    { 
      title: 'Активные напоминания', 
      value: '3', 
      description: 'требуют внимания', 
      icon: '⏰', 
      color: COLORS.rose,
      trend: 'up' as const
    }
  ];

  // Фильтрация данных
  const filteredServices = serviceHistory.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.workshop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setIsClient(true);
    
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(formatTime(now));
      setCurrentDate(formatDate(now));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // Обработчики модальных окон
  const handleViewService = (service: ServiceHistory) => {
    setSelectedService(service);
    setIsServiceHistoryModalOpen(true);
  };

  const handleViewTechnicalData = (data: TechnicalData) => {
    setSelectedTechnicalData(data);
    setIsTechnicalDataModalOpen(true);
  };

  const handleViewReminder = (reminder: MaintenanceReminder) => {
    setSelectedReminder(reminder);
    setIsReminderModalOpen(true);
  };

  const handleViewMaintenance = (service: MaintenanceService) => {
    setSelectedMaintenance(service);
    setIsMaintenanceModalOpen(true);
  };

  const overdueReminders = maintenanceReminders.filter(r => r.isOverdue);
  const upcomingReminders = maintenanceReminders.filter(r => !r.isOverdue && r.daysLeft <= 30);

  // Если не на клиенте, не рендерим контент, зависящий от времени
  if (!isClient) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded-xl mb-6 w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-64 bg-white/5 rounded-2xl"></div>
              <div className="space-y-6">
                <div className="h-32 bg-white/5 rounded-2xl"></div>
                <div className="h-32 bg-white/5 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BentoCard className="p-6" variant="wide" glowColor={COLORS.blue} gradient>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">🚗 Автосервис</h1>
                <p className="text-white/60 text-lg mb-4">
                  Полный контроль за состоянием вашего автомобиля. История обслуживания, напоминания и технические данные.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>Toyota Camry 2020</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>75 240 км пробег</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>4 года эксплуатации</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl mb-3">
                    🚗
                  </div>
                  <div className="text-white font-bold text-lg">Toyota Camry</div>
                  <div className="text-white/60 text-sm">2020 • 2.5L Hybrid</div>
                </motion.div>
                <motion.button
                  className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAddServiceModalOpen(true)}
                >
                  Добавить обслуживание
                </motion.button>
              </div>
            </div>
          </BentoCard>
        </motion.section>

        {/* Alerts Section */}
        {(overdueReminders.length > 0 || upcomingReminders.length > 0) && (
          <motion.section 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xl font-semibold text-white">Важные напоминания</h2>
              {overdueReminders.length > 0 && (
                <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                  {overdueReminders.length} просрочено
                </span>
              )}
              {upcomingReminders.length > 0 && (
                <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                  {upcomingReminders.length} скоро
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[...overdueReminders, ...upcomingReminders].slice(0, 3).map((reminder) => (
                <ReminderCard 
                  key={reminder.id} 
                  reminder={reminder} 
                  onClick={() => handleViewReminder(reminder)}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* KPI Section */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Обзор состояния</h2>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>Обновлено: {currentTime}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {autoServiceKPIs.map((kpi, index) => (
              <KPIWidget key={index} {...kpi} />
            ))}
          </div>
        </motion.section>

        {/* Navigation Tabs & Filters */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-wrap gap-2 flex-1">
              {[
                { id: 'overview', name: '📊 Обзор', color: 'blue' },
                { id: 'history', name: '📋 История обслуживания', color: 'emerald' },
                { id: 'technical', name: '🔧 Технические данные', color: 'purple' },
                { id: 'reminders', name: '⏰ Напоминания ТО', color: 'orange' },
                { id: 'maintenance', name: '🛠️ Техническое обслуживание', color: 'cyan' }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all text-sm ${
                    activeTab === tab.id 
                      ? `bg-${tab.color}-500 text-white shadow-lg` 
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Обзор */}
          {activeTab === 'overview' && (
            <>
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2"
              >
                <BentoCard className="p-6" variant="wide" glowColor={COLORS.blue} gradient>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                      <span>📋</span>
                      <span>Последние обслуживания</span>
                    </h2>
                    <span className="text-white/60 text-sm">
                      {filteredServices.length} записей
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredServices.slice(0, 4).map((service) => (
                      <ServiceHistoryCard 
                        key={service.id} 
                        service={service} 
                        onClick={() => handleViewService(service)}
                      />
                    ))}
                  </div>
                  {filteredServices.length === 0 && (
                    <div className="text-center py-8 text-white/60">
                      <div className="text-4xl mb-2">🔧</div>
                      <div>Обслуживания не найдены</div>
                      <div className="text-sm">Попробуйте изменить параметры поиска</div>
                    </div>
                  )}
                </BentoCard>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
              >
                <BentoCard className="p-6" glowColor={COLORS.purple} gradient>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span>🔧</span>
                    <span>Состояние систем</span>
                  </h3>
                  <div className="space-y-3">
                    {technicalData.slice(0, 3).map((data) => (
                      <motion.button 
                        key={data.id}
                        className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all text-left"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleViewTechnicalData(data)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{data.category}</div>
                            <div className="text-white/60 text-sm">{data.items.length} параметров</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {data.items.filter(item => item.status === 'excellent' || item.status === 'good').length > 0 && (
                              <span className="text-green-400 text-sm">
                                {data.items.filter(item => item.status === 'excellent' || item.status === 'good').length} в норме
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </BentoCard>

                <BentoCard className="p-6" glowColor={COLORS.orange} gradient>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span>🛠️</span>
                    <span>Ближайшие обслуживания</span>
                  </h3>
                  <div className="space-y-3">
                    {maintenanceServices.filter(s => s.status === 'due' || s.status === 'soon').map((service) => (
                      <motion.button 
                        key={service.id}
                        className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all text-left"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleViewMaintenance(service)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-sm">{service.name}</div>
                            <div className="text-white/60 text-xs">Осталось: {formatNumber(service.remainingMileage)} км</div>
                          </div>
                          <div className={`text-sm font-medium ${
                            service.status === 'due' ? 'text-rose-400' :
                            service.status === 'soon' ? 'text-amber-400' : 'text-green-400'
                          }`}>
                            {getMaintenanceStatusText(service.status)}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </BentoCard>
              </motion.section>
            </>
          )}

          {/* История обслуживания */}
          {activeTab === 'history' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-3"
            >
              <BentoCard className="p-6" variant="wide" glowColor={COLORS.emerald} gradient>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <span>📋</span>
                    <span>История обслуживания</span>
                  </h2>
                  <span className="text-white/60 text-sm">
                    {filteredServices.length} записей
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredServices.map((service) => (
                    <ServiceHistoryCard 
                      key={service.id} 
                      service={service} 
                      onClick={() => handleViewService(service)}
                    />
                  ))}
                </div>
                {filteredServices.length === 0 && (
                  <div className="text-center py-12 text-white/60">
                    <div className="text-4xl mb-2">🔍</div>
                    <div>Обслуживания не найдены</div>
                    <div className="text-sm">Попробуйте изменить параметры поиска</div>
                  </div>
                )}
              </BentoCard>
            </motion.section>
          )}

          {/* Технические данные */}
          {activeTab === 'technical' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-3"
            >
              <BentoCard className="p-6" variant="wide" glowColor={COLORS.purple} gradient>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <span>🔧</span>
                  <span>Технические данные</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {technicalData.map((data) => (
                    <TechnicalDataCard 
                      key={data.id} 
                      data={data} 
                      onClick={() => handleViewTechnicalData(data)}
                    />
                  ))}
                </div>
              </BentoCard>
            </motion.section>
          )}

          {/* Напоминания ТО */}
          {activeTab === 'reminders' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-3"
            >
              <BentoCard className="p-6" variant="wide" glowColor={COLORS.orange} gradient>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <span>⏰</span>
                  <span>Напоминания ТО</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {maintenanceReminders.map((reminder) => (
                    <ReminderCard 
                      key={reminder.id} 
                      reminder={reminder} 
                      onClick={() => handleViewReminder(reminder)}
                    />
                  ))}
                </div>
              </BentoCard>
            </motion.section>
          )}

          {/* Техническое обслуживание */}
          {activeTab === 'maintenance' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-3"
            >
              <BentoCard className="p-6" variant="wide" glowColor={COLORS.cyan} gradient>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <span>🛠️</span>
                  <span>Техническое обслуживание</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {maintenanceServices.map((service) => (
                    <MaintenanceServiceCard 
                      key={service.id} 
                      service={service} 
                      onClick={() => handleViewMaintenance(service)}
                    />
                  ))}
                </div>
              </BentoCard>
            </motion.section>
          )}
        </div>
      </main>

      {/* Модальное окно истории обслуживания */}
      <Modal 
        isOpen={isServiceHistoryModalOpen} 
        onClose={() => setIsServiceHistoryModalOpen(false)}
        title="📋 Детали обслуживания"
        size="lg"
      >
        {selectedService && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-bold text-xl">{selectedService.title}</h3>
                <p className="text-white/60">{selectedService.description}</p>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-2xl">{selectedService.cost}</div>
                <span 
                  className="px-3 py-1 rounded-full text-sm border font-medium mt-2"
                  style={{
                    backgroundColor: `rgba(${getServiceTypeColor(selectedService.serviceType)}, 0.2)`,
                    color: `rgb(${getServiceTypeColor(selectedService.serviceType)})`,
                    borderColor: `rgba(${getServiceTypeColor(selectedService.serviceType)}, 0.3)`
                  }}
                >
                  {getServiceTypeText(selectedService.serviceType)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Дата</div>
                <div className="text-white font-semibold">{selectedService.date}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Пробег</div>
                <div className="text-white font-semibold">{formatNumber(selectedService.mileage)} км</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Сервис</div>
                <div className="text-white font-semibold">{selectedService.workshop}</div>
              </div>
              {selectedService.nextService && (
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm">Следующее ТО</div>
                  <div className="text-white font-semibold">{formatNumber(selectedService.nextService)} км</div>
                </div>
              )}
            </div>

            {selectedService.parts.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-3">Использованные запчасти</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedService.parts.map((part, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="text-white text-sm">{part}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedService.warrantyUntil && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 text-xl">🛡️</span>
                  <div>
                    <div className="text-emerald-400 font-semibold">Гарантия на работы</div>
                    <div className="text-emerald-300 text-sm mt-1">Действует до: {selectedService.warrantyUntil}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold">
                Скачать отчет
              </button>
              <button className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
                Поделиться
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно технических данных */}
      <Modal 
        isOpen={isTechnicalDataModalOpen} 
        onClose={() => setIsTechnicalDataModalOpen(false)}
        title="🔧 Технические данные"
        size="lg"
      >
        {selectedTechnicalData && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-xl">{selectedTechnicalData.category}</h3>
              <div className="text-white/60 text-sm">
                {selectedTechnicalData.items.length} параметров
              </div>
            </div>

            <div className="space-y-3">
              {selectedTechnicalData.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-4">
                  <div className="flex-1">
                    <div className="text-white font-semibold">{item.name}</div>
                    <div className="text-white/60 text-sm mt-1">{item.value}</div>
                    <div className="text-white/40 text-xs mt-1">
                      Проверено: {item.lastCheck} • Следующая проверка: {item.nextCheck}
                    </div>
                  </div>
                  <div className="text-right">
                    <span 
                      className="px-3 py-1 rounded-full text-sm border font-medium"
                      style={{
                        backgroundColor: `rgba(${getStatusColor(item.status)}, 0.2)`,
                        color: `rgb(${getStatusColor(item.status)})`,
                        borderColor: `rgba(${getStatusColor(item.status)}, 0.3)`
                      }}
                    >
                      {getStatusText(item.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">Рекомендации</h4>
              <div className="space-y-2 text-sm text-blue-300">
                <div>• Регулярно проверяйте уровень технических жидкостей</div>
                <div>• Следите за рекомендованными интервалами обслуживания</div>
                <div>• Обращайтесь к официальным дилерам для сложных работ</div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold">
                Скачать отчет
              </button>
              <button className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
                Экспорт данных
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно напоминания */}
      <Modal 
        isOpen={isReminderModalOpen} 
        onClose={() => setIsReminderModalOpen(false)}
        title="⏰ Детали напоминания"
        size="md"
      >
        {selectedReminder && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{getReminderTypeIcon(selectedReminder.type)}</div>
                <div>
                  <h3 className="text-white font-bold text-xl">{selectedReminder.title}</h3>
                  <p className="text-white/60">{selectedReminder.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div 
                  className={`px-3 py-1 rounded-full text-sm border font-medium ${
                    selectedReminder.isOverdue ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                    'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {selectedReminder.isOverdue ? 'Просрочено' : 'Скоро'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Срок выполнения</div>
                <div className={`text-white font-semibold ${
                  selectedReminder.isOverdue ? 'text-rose-400' : 'text-white'
                }`}>
                  {selectedReminder.dueDate}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Приоритет</div>
                <div className="text-white font-semibold capitalize">{selectedReminder.priority}</div>
              </div>
              {selectedReminder.estimatedCost && (
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm">Примерная стоимость</div>
                  <div className="text-white font-semibold">{selectedReminder.estimatedCost}</div>
                </div>
              )}
              {selectedReminder.mileage && (
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm">Пробег</div>
                  <div className="text-white font-semibold">{formatNumber(selectedReminder.mileage)} км</div>
                </div>
              )}
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-amber-400 text-xl">⚠️</span>
                <div>
                  <div className="text-amber-400 font-semibold">
                    {selectedReminder.isOverdue ? 'Напоминание просрочено!' : 'Время действовать!'}
                  </div>
                  <div className="text-amber-300 text-sm mt-1">
                    {selectedReminder.isOverdue 
                      ? `Просрочено на ${Math.abs(selectedReminder.daysLeft)} дней`
                      : `Осталось ${selectedReminder.daysLeft} дней`
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold">
                Запланировать визит
              </button>
              <button className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
                Отложить на неделю
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно технического обслуживания */}
      <Modal 
        isOpen={isMaintenanceModalOpen} 
        onClose={() => setIsMaintenanceModalOpen(false)}
        title="🛠️ Техническое обслуживание"
        size="lg"
      >
        {selectedMaintenance && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-bold text-xl">{selectedMaintenance.name}</h3>
                <p className="text-white/60">{selectedMaintenance.description}</p>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-2xl">{selectedMaintenance.estimatedCost}</div>
                <span 
                  className="px-3 py-1 rounded-full text-sm border font-medium mt-2"
                  style={{
                    backgroundColor: `rgba(${getMaintenanceStatusColor(selectedMaintenance.status)}, 0.2)`,
                    color: `rgb(${getMaintenanceStatusColor(selectedMaintenance.status)})`,
                    borderColor: `rgba(${getMaintenanceStatusColor(selectedMaintenance.status)}, 0.3)`
                  }}
                >
                  {getMaintenanceStatusText(selectedMaintenance.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Рекомендуемый интервал</div>
                <div className="text-white font-semibold">{selectedMaintenance.recommendedInterval}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Последнее обслуживание</div>
                <div className="text-white font-semibold">{selectedMaintenance.lastService}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Следующее обслуживание</div>
                <div className="text-white font-semibold">{selectedMaintenance.nextService}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Сложность</div>
                <div className="text-white font-semibold capitalize">{selectedMaintenance.complexity}</div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Прогресс до следующего обслуживания</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white/60">
                  <span>Пройдено</span>
                  <span>{formatNumber(selectedMaintenance.mileageInterval - selectedMaintenance.remainingMileage)} км</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${((selectedMaintenance.mileageInterval - selectedMaintenance.remainingMileage) / selectedMaintenance.mileageInterval) * 100}%`,
                      backgroundColor: `rgb(${getMaintenanceStatusColor(selectedMaintenance.status)})`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/60">
                  <span>0 км</span>
                  <span>{formatNumber(selectedMaintenance.mileageInterval / 2)} км</span>
                  <span>{formatNumber(selectedMaintenance.mileageInterval)} км</span>
                </div>
              </div>
            </div>

            {selectedMaintenance.parts.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-3">Рекомендуемые запчасти</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedMaintenance.parts.map((part, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="text-white text-sm">{part}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <h4 className="text-emerald-400 font-semibold mb-2">Важная информация</h4>
              <div className="space-y-2 text-sm text-emerald-300">
                <div>• Соблюдайте рекомендованные интервалы обслуживания</div>
                <div>• Используйте только оригинальные запчасти</div>
                <div>• Обращайтесь к сертифицированным специалистам</div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold">
                Запланировать
              </button>
              <button className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
                Найти запчасти
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно добавления обслуживания */}
      <Modal 
        isOpen={isAddServiceModalOpen} 
        onClose={() => setIsAddServiceModalOpen(false)}
        title="➕ Добавить обслуживание"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/80 text-sm mb-2 block">Тип обслуживания</label>
              <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50">
                <option value="regular">Регулярное ТО</option>
                <option value="repair">Ремонт</option>
                <option value="inspection">Диагностика</option>
                <option value="emergency">Срочное</option>
              </select>
            </div>
            <div>
              <label className="text-white/80 text-sm mb-2 block">Дата</label>
              <input 
                type="date" 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="text-white/80 text-sm mb-2 block">Пробег (км)</label>
              <input 
                type="number" 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50"
                placeholder="75000"
              />
            </div>
            <div>
              <label className="text-white/80 text-sm mb-2 block">Стоимость (₽)</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50"
                placeholder="12 500"
              />
            </div>
          </div>

          <div>
            <label className="text-white/80 text-sm mb-2 block">Название работы</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50"
              placeholder="Замена масла и фильтров"
            />
          </div>

          <div>
            <label className="text-white/80 text-sm mb-2 block">Описание</label>
            <textarea 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 h-24"
              placeholder="Подробное описание выполненных работ..."
            />
          </div>

          <div>
            <label className="text-white/80 text-sm mb-2 block">Сервис</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50"
              placeholder='Автоцентр "Премиум Сервис"'
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold">
              Сохранить
            </button>
            <button 
              className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
              onClick={() => setIsAddServiceModalOpen(false)}
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}