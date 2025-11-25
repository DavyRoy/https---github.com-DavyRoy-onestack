'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  MeasuringStrategy,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Типы данных
interface ServiceMetric {
  id: string;
  name: string;
  value: number;
  previous: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  icon: string;
  change: number;
  description: string;
  category: 'efficiency' | 'quality' | 'financial' | 'satisfaction';
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  totalServices: number;
  completedThisMonth: number;
  satisfactionRate: number;
  revenue: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
  growth: number;
}

interface ServiceType {
  id: string;
  name: string;
  category: string;
  icon: string;
  monthlyRequests: number;
  completionRate: number;
  satisfaction: number;
  avgDuration: number;
  cost: number;
  revenue: number;
  trend: 'up' | 'down' | 'stable';
}

interface ServiceRequest {
  id: string;
  serviceType: string;
  category: string;
  clientName: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  createdAt: string;
  completedAt?: string;
  duration: number;
  satisfaction?: number;
  location: string;
}

type CardSize = 'sm' | 'md' | 'lg' | 'xl';
type CardType = 'kpi' | 'chart' | 'progress' | 'list' | 'stats';

interface DashboardCard {
  id: string;
  type: CardType;
  title: string;
  content: any;
  size: CardSize;
  position: number;
  removable: boolean;
  glowColor: string;
  category?: string;
  lastUpdated?: string;
}

// Константы для цветов
const COLORS = {
  primary: 'from-gray-900 via-black to-gray-800',
  secondary: 'from-green-900 via-black to-emerald-900',
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

const numberFormatter = new Intl.NumberFormat('ru-RU');
const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const formatNumber = (value: number) => numberFormatter.format(value);
const formatCurrency = (value: number) => currencyFormatter.format(value);

// Размеры карточек
const CARD_SIZES: Record<CardSize, { cols: number; rows: number; class: string; minHeight: string }> = {
  sm: { cols: 1, rows: 1, class: 'col-span-1', minHeight: 'min-h-[160px]' },
  md: { cols: 2, rows: 1, class: 'col-span-1 md:col-span-2', minHeight: 'min-h-[180px]' },
  lg: { cols: 2, rows: 2, class: 'col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2', minHeight: 'min-h-[320px]' },
  xl: { cols: 4, rows: 2, class: 'col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-6 lg:row-span-2', minHeight: 'min-h-[340px]' }
};

// Моки данных для статистики услуг
const serviceMetrics: ServiceMetric[] = [
  {
    id: '1',
    name: 'Удовлетворенность клиентов',
    value: 94,
    previous: 92,
    target: 95,
    unit: '%',
    trend: 'up',
    color: COLORS.success,
    icon: '😊',
    change: 2,
    description: 'Общий уровень удовлетворенности клиентов предоставленными услугами',
    category: 'satisfaction'
  },
  {
    id: '2',
    name: 'Среднее время выполнения',
    value: 2.4,
    previous: 2.8,
    target: 2.0,
    unit: 'ч',
    trend: 'down',
    color: COLORS.cyan,
    icon: '⏱️',
    change: -0.4,
    description: 'Среднее время от создания заявки до ее завершения',
    category: 'efficiency'
  },
  {
    id: '3',
    name: 'Уровень завершения',
    value: 96,
    previous: 94,
    target: 95,
    unit: '%',
    trend: 'up',
    color: COLORS.purple,
    icon: '✅',
    change: 2,
    description: 'Процент успешно завершенных услуг от общего количества',
    category: 'efficiency'
  },
  {
    id: '4',
    name: 'Доход на услугу',
    value: 1250,
    previous: 1180,
    target: 1300,
    unit: '₽',
    trend: 'up',
    color: COLORS.amber,
    icon: '💰',
    change: 70,
    description: 'Средний доход, генерируемый одной услугой',
    category: 'financial'
  },
  {
    id: '5',
    name: 'Повторные обращения',
    value: 2.1,
    previous: 3.2,
    target: 2.0,
    unit: '%',
    trend: 'down',
    color: COLORS.info,
    icon: '🔄',
    change: -1.1,
    description: 'Процент клиентов, обратившихся повторно',
    category: 'quality'
  },
  {
    id: '6',
    name: 'Эффективность команды',
    value: 87,
    previous: 85,
    target: 90,
    unit: '%',
    trend: 'up',
    color: COLORS.emerald,
    icon: '🚀',
    change: 2,
    description: 'Общая эффективность работы команды услуг',
    category: 'efficiency'
  }
];

const serviceCategories: ServiceCategory[] = [
  {
    id: '1',
    name: 'Социальное сопровождение',
    icon: '👥',
    description: 'Комплексное социальное обслуживание',
    totalServices: 1247,
    completedThisMonth: 289,
    satisfactionRate: 94,
    revenue: 1250000,
    trend: 'up',
    color: COLORS.blue,
    growth: 12
  },
  {
    id: '2',
    name: 'Психологическая помощь',
    icon: '🧠',
    description: 'Консультации и психологическая поддержка',
    totalServices: 856,
    completedThisMonth: 167,
    satisfactionRate: 96,
    revenue: 890000,
    trend: 'up',
    color: COLORS.purple,
    growth: 8
  },
  {
    id: '3',
    name: 'Медицинский патронаж',
    icon: '🏥',
    description: 'Медицинское наблюдение и уход',
    totalServices: 723,
    completedThisMonth: 134,
    satisfactionRate: 92,
    revenue: 1560000,
    trend: 'stable',
    color: COLORS.emerald,
    growth: 3
  },
  {
    id: '4',
    name: 'Юридические услуги',
    icon: '⚖️',
    description: 'Юридические консультации и поддержка',
    totalServices: 432,
    completedThisMonth: 78,
    satisfactionRate: 89,
    revenue: 540000,
    trend: 'up',
    color: COLORS.amber,
    growth: 15
  }
];

const serviceTypes: ServiceType[] = [
  {
    id: '1',
    name: 'Первичная консультация',
    category: 'Социальное сопровождение',
    icon: '💬',
    monthlyRequests: 156,
    completionRate: 98,
    satisfaction: 95,
    avgDuration: 60,
    cost: 0,
    revenue: 0,
    trend: 'up'
  },
  {
    id: '2',
    name: 'Экстренный выезд',
    category: 'Социальное сопровождение',
    icon: '🚨',
    monthlyRequests: 45,
    completionRate: 100,
    satisfaction: 97,
    avgDuration: 120,
    cost: 0,
    revenue: 0,
    trend: 'stable'
  },
  {
    id: '3',
    name: 'Индивидуальная психотерапия',
    category: 'Психологическая помощь',
    icon: '🧘',
    monthlyRequests: 89,
    completionRate: 94,
    satisfaction: 96,
    avgDuration: 50,
    cost: 1500,
    revenue: 133500,
    trend: 'up'
  },
  {
    id: '4',
    name: 'Медицинский осмотр',
    category: 'Медицинский патронаж',
    icon: '🩺',
    monthlyRequests: 67,
    completionRate: 91,
    satisfaction: 93,
    avgDuration: 45,
    cost: 800,
    revenue: 53600,
    trend: 'stable'
  }
];

const serviceRequests: ServiceRequest[] = [
  {
    id: '1',
    serviceType: 'Экстренный выезд',
    category: 'Социальное сопровождение',
    clientName: 'Иванова Мария Петровна',
    status: 'in-progress',
    priority: 'urgent',
    assignedTo: 'Петров Иван',
    createdAt: '2024-01-20T14:30:00',
    duration: 120,
    location: 'ул. Ленина, 15'
  },
  {
    id: '2',
    serviceType: 'Первичная консультация',
    category: 'Социальное сопровождение',
    clientName: 'Сидоров Алексей Викторович',
    status: 'pending',
    priority: 'medium',
    assignedTo: 'Козлова Анна',
    createdAt: '2024-01-20T13:15:00',
    duration: 60,
    location: 'Центральный офис'
  },
  {
    id: '3',
    serviceType: 'Индивидуальная психотерапия',
    category: 'Психологическая помощь',
    clientName: 'Петрова Екатерина Сергеевна',
    status: 'completed',
    priority: 'high',
    assignedTo: 'Смирнова Ольга',
    createdAt: '2024-01-20T10:00:00',
    completedAt: '2024-01-20T10:50:00',
    duration: 50,
    satisfaction: 95,
    location: 'Кабинет 205'
  }
];

// Карточки для дашборда
const serviceCards: DashboardCard[] = [
  {
    id: 'total-services',
    type: 'kpi',
    title: '📊 Всего услуг',
    content: {
      value: 3258,
      description: 'Предоставлено за все время',
      trend: 'up',
      details: '+124 за последний месяц',
      unit: 'услуг',
      target: 3000
    },
    size: 'sm',
    position: 1,
    removable: true,
    glowColor: COLORS.blue,
    category: '',
    lastUpdated: '2024-01-20T08:00:00Z'
  },
  {
    id: 'monthly-services',
    type: 'kpi',
    title: '📈 Услуг за месяц',
    content: {
      value: 289,
      description: 'Выполнено в текущем месяце',
      trend: 'up',
      details: 'На 15% больше чем в прошлом месяце',
      unit: 'услуг',
      target: 250
    },
    size: 'sm',
    position: 2,
    removable: true,
    glowColor: COLORS.purple,
    category: '',
    lastUpdated: '2024-01-20T09:30:00Z'
  },
  {
    id: 'satisfaction-rate',
    type: 'kpi',
    title: '😊 Удовлетворенность',
    content: {
      value: 94,
      description: 'Средний показатель удовлетворенности',
      trend: 'up',
      details: 'На 2% выше чем в прошлом месяце',
      unit: '%',
      target: 95
    },
    size: 'sm',
    position: 3,
    removable: true,
    glowColor: COLORS.success,
    category: '',
    lastUpdated: '2024-01-20T10:15:00Z'
  },
  {
    id: 'completion-rate',
    type: 'kpi',
    title: '✅ Уровень выполнения',
    content: {
      value: 96,
      description: 'Услуг выполнено в срок',
      trend: 'up',
      details: 'Превышает плановый показатель',
      unit: '%',
      target: 95
    },
    size: 'sm',
    position: 4,
    removable: true,
    glowColor: COLORS.emerald,
    category: '',
    lastUpdated: '2024-01-20T11:00:00Z'
  },
  {
    id: 'revenue',
    type: 'kpi',
    title: '💰 Общий доход',
    content: {
      value: 4240000,
      description: 'За все время предоставления услуг',
      trend: 'up',
      details: 'Рост на 12% за квартал',
      unit: '₽',
      target: 4000000
    },
    size: 'sm',
    position: 5,
    removable: true,
    glowColor: COLORS.amber,
    category: '',
    lastUpdated: '2024-01-20T12:45:00Z'
  },
  {
    id: 'avg-completion-time',
    type: 'kpi',
    title: '⏱️ Среднее время',
    content: {
      value: 2.4,
      description: 'Среднее время выполнения услуги',
      trend: 'down',
      details: 'Улучшение на 15 минут',
      unit: 'ч',
      target: 2.0
    },
    size: 'sm',
    position: 6,
    removable: true,
    glowColor: COLORS.cyan,
    category: 'Эффективность',
    lastUpdated: '2024-01-20T14:20:00Z'
  },
  {
    id: 'categories-distribution',
    type: 'chart',
    title: '📋 Распределение по категориям',
    content: {
      value: 4,
      description: 'Основные категории услуг',
      trend: 'stable',
      chartData: [
        { name: 'Социальные', value: 35, color: COLORS.blue },
        { name: 'Психологические', value: 25, color: COLORS.purple },
        { name: 'Медицинские', value: 20, color: COLORS.emerald },
        { name: 'Юридические', value: 12, color: COLORS.amber },
        { name: 'Прочие', value: 8, color: COLORS.gray }
      ]
    },
    size: 'md',
    position: 7,
    removable: true,
    glowColor: COLORS.indigo,
    category: 'Аналитика',
    lastUpdated: '2024-01-20T15:30:00Z'
  },
  {
    id: 'service-performance',
    type: 'progress',
    title: '📊 Эффективность услуг',
    content: {
      value: 87,
      description: 'Общая эффективность предоставления услуг',
      trend: 'up',
      items: [
        { label: 'Социальное сопровождение', value: 94, target: 90 },
        { label: 'Психологическая помощь', value: 96, target: 95 },
        { label: 'Медицинский патронаж', value: 92, target: 90 },
        { label: 'Юридические услуги', value: 89, target: 85 }
      ]
    },
    size: 'md',
    position: 8,
    removable: true,
    glowColor: COLORS.teal,
    category: '',
    lastUpdated: '2024-01-20T16:45:00Z'
  },
  {
    id: 'popular-services',
    type: 'list',
    title: '🔥 Популярные услуги',
    content: {
      value: 5,
      description: 'Самые востребованные виды услуг',
      trend: 'stable',
      items: [
        'Первичная консультация - 156 запросов',
        'Индивидуальная психотерапия - 89 сессий',
        'Медицинский осмотр - 67 приемов',
        'Экстренный выезд - 45 вызовов',
        'Юридическая консультация - 34 обращения'
      ]
    },
    size: 'lg',
    position: 9,
    removable: true,
    glowColor: COLORS.orange,
    category: 'Аналитика',
    lastUpdated: '2024-01-20T17:20:00Z'
  },
  {
    id: 'monthly-stats',
    type: 'stats',
    title: '📈 Статистика за месяц',
    content: {
      value: 289,
      description: 'Ключевые показатели за январь',
      trend: 'up',
      stats: [
        { label: 'Новых клиентов', value: 45, change: 12, target: 40 },
        { label: 'Повторных обращений', value: 23, change: -5, target: 25 },
        { label: 'Средняя оценка', value: 4.7, change: 0.2, target: 4.5 },
        { label: 'Волонтеров задействовано', value: 18, change: 3, target: 15 }
      ]
    },
    size: 'lg',
    position: 10,
    removable: true,
    glowColor: COLORS.violet,
    category: 'Аналитика',
    lastUpdated: '2024-01-20T18:00:00Z'
  }
];

const LAYOUT_STORAGE_KEY = 'services-statistics-layout-v1';

// Утилиты
const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
  return trend === 'up' ? COLORS.success : trend === 'down' ? COLORS.error : COLORS.gray;
};

const getTrendLabel = (trend: 'up' | 'down' | 'stable') => {
  return trend === 'up' ? 'Рост' : trend === 'down' ? 'Снижение' : 'Стабильно';
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

// Компонент для круговой диаграммы
const PieChart = ({ 
  data, 
  size = 80, 
  className = '',
  strokeWidth = 20 
}: { 
  data: { name: string; value: number; color: string }[]; 
  size?: number; 
  className?: string;
  strokeWidth?: number;
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
              r={40 - strokeWidth / 4}
              fill="none"
              stroke={`rgba(${item.color}, 0.8)`}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 ease-out"
              style={{
                filter: `drop-shadow(0 0 2px rgba(${item.color}, 0.3))`
              }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center transform rotate-90">
          <div className="text-white font-bold text-sm">{Math.round(total)}%</div>
          <div className="text-white/60 text-xs">Всего</div>
        </div>
      </div>
    </div>
  );
};

// Компонент прогресс-бара
const ProgressBar = ({ 
  value, 
  label, 
  color = COLORS.blue, 
  showLabel = true,
  showTarget = false,
  target = 100,
  size = 'default'
}: { 
  value: number; 
  label: string; 
  color?: string; 
  showLabel?: boolean;
  showTarget?: boolean;
  target?: number;
  size?: 'default' | 'sm' | 'lg';
}) => {
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  
  return (
    <div className="mb-3 last:mb-0">
      {showLabel && (
        <div className="flex justify-between text-sm text-white/60 mb-2">
          <span className={textSize}>{label}</span>
          <div className="flex items-center gap-2">
            <span className={`font-medium ${textSize}`}>{value}%</span>
            {showTarget && target && (
              <span className="text-white/40 text-xs">из {target}%</span>
            )}
          </div>
        </div>
      )}
      <div className={`w-full bg-white/10 rounded-full ${height} overflow-hidden`}>
        <div 
          className={`${height} rounded-full transition-all duration-700 ease-out`}
          style={{ 
            width: `${Math.min(value, 100)}%`,
            backgroundColor: `rgb(${color})`,
            boxShadow: `0 0 8px rgba(${color}, 0.3)`
          }}
        />
      </div>
    </div>
  );
};

// Компонент выбора размера
const SizeSelector = ({ 
  currentSize, 
  onSizeChange, 
  isEditing,
  availableSizes = ['sm', 'md', 'lg', 'xl']
}: { 
  currentSize: CardSize; 
  onSizeChange: (size: CardSize) => void;
  isEditing: boolean;
  availableSizes?: CardSize[];
}) => {
  if (!isEditing) return null;

  const sizes: { key: CardSize; label: string; tooltip: string; icon: string }[] = [
    { key: 'sm', label: 'S', tooltip: 'Маленький (1x1)', icon: '▫' },
    { key: 'md', label: 'M', tooltip: 'Средний (2x1)', icon: '▫▫' },
    { key: 'lg', label: 'L', tooltip: 'Большой (2x2)', icon: '◼' },
    { key: 'xl', label: 'XL', tooltip: 'Расширенный (4x2)', icon: '◼◼' }
  ].filter(size => availableSizes.includes(size.key));

  return (
    <div className="flex items-center gap-1 flex-wrap justify-end">
      {sizes.map((size) => (
        <motion.button
          key={size.key}
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold border transition-all duration-200 ${
            currentSize === size.key
              ? 'bg-blue-500/90 border-blue-300 text-white shadow-lg shadow-blue-500/25'
              : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:border-white/30'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onSizeChange(size.key);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={size.tooltip}
        >
          {size.icon}
        </motion.button>
      ))}
    </div>
  );
};

// Bento Card компонент
const BentoCard = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  size?: CardSize;
  isEditing?: boolean;
  onRemove?: () => void;
  onSizeChange?: (size: CardSize) => void;
  isDragging?: boolean;
  isOverlay?: boolean;
}>(({ 
  children, 
  className = '', 
  glowColor = COLORS.purple, 
  onClick, 
  size = 'sm',
  isEditing = false,
  onRemove,
  onSizeChange,
  isDragging = false,
  isOverlay = false
}, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref || cardRef}
      className={`
        relative overflow-hidden 
        rounded-2xl border
        bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg 
        transition-all duration-300 
        hover:shadow-2xl
        w-full max-w-full
        group
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${isEditing ? 'cursor-grab active:cursor-grabbing' : ''}
        ${isDragging ? 'z-50 scale-105 shadow-2xl rotate-2' : ''}
        ${isOverlay ? 'shadow-2xl scale-105' : ''}
        ${isEditing ? 'border-white/20 hover:border-white/30' : 'border-white/10 hover:border-white/20'}
        ${CARD_SIZES[size].minHeight}
        ${className}
      `}
      style={{
        backgroundImage: `
          radial-gradient(280px circle at 50% 50%, rgba(${glowColor},0.12), transparent 60%),
          linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)
        `,
        boxShadow: isDragging ? `0 25px 50px -12px rgba(${glowColor}, 0.25)` : undefined
      }}
      onClick={onClick}
      whileHover={isEditing && !isDragging ? { scale: 1.01, y: -2 } : {}}
      whileTap={isEditing ? { scale: 0.98 } : {}}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at var(--x) var(--y), rgba(${glowColor},0.1), transparent 40%)`
        }}
      />

      {/* Editing controls */}
      {(isEditing && (onSizeChange || onRemove)) && (
        <div className="absolute top-3 right-3 z-40 flex flex-col items-end gap-2 pointer-events-none">
          {onSizeChange && (
            <motion.div 
              className="bg-black/80 border border-white/20 rounded-xl px-3 py-2 shadow-2xl backdrop-blur-sm flex items-center gap-1 pointer-events-auto"
              initial={{ opacity: 0, y: -8, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.8 }}
            >
              <SizeSelector 
                currentSize={size} 
                onSizeChange={onSizeChange}
                isEditing={isEditing}
              />
            </motion.div>
          )}
          {onRemove && (
            <motion.button
              className="pointer-events-auto flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-red-500/90 border border-red-400/60 text-white shadow-lg hover:bg-red-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              title="Удалить карточку"
            >
              <span className="text-sm">✕</span>
              <span className="hidden sm:inline">Удалить</span>
            </motion.button>
          )}
        </div>
      )}

      {/* Size indicator in editing mode */}
      {isEditing && (
        <motion.div 
          className="absolute top-3 left-3 z-30"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="text-white/70 text-xs bg-black/60 px-2 py-1 rounded-lg border border-white/20 backdrop-blur-sm">
            {size.toUpperCase()}
          </div>
        </motion.div>
      )}

      {/* Drag handle in editing mode */}
      {isEditing && (
        <motion.div 
          className="absolute bottom-3 right-3 z-30 text-white/40 hover:text-white/60 transition-colors cursor-grab active:cursor-grabbing"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="text-lg">⠿</div>
        </motion.div>
      )}

      <div className="relative z-10 h-full">
        {children}
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
        <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 group-hover:animate-shine" />
      </div>
    </motion.div>
  );
});

BentoCard.displayName = 'BentoCard';

// Компонент пустой карточки для добавления новых
const EmptyCardSlot = ({ 
  onAdd, 
  isEditing,
  position = 0 
}: { 
  onAdd: () => void; 
  isEditing: boolean;
  position?: number;
}) => {
  if (!isEditing) return null;

  return (
    <motion.div
      className="relative rounded-2xl border-2 border-dashed border-white/20 bg-white/5 backdrop-blur-lg p-6 flex flex-col items-center justify-center min-h-[160px] cursor-pointer hover:bg-white/10 transition-all duration-300 group"
      whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.4)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onAdd}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="text-3xl text-white/40 mb-2 group-hover:text-white/60 transition-colors">+</div>
      <div className="text-white/60 text-sm text-center group-hover:text-white/80 transition-colors">
        Добавить карточку
      </div>
      {position > 0 && (
        <div className="absolute bottom-2 right-2 text-white/30 text-xs">
          #{position}
        </div>
      )}
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/0 via-purple-500/20 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/10 to-pink-500/0 animate-pulse" />
      </div>
    </motion.div>
  );
};

// Компонент модального окна для выбора карточек
const CardPickerModal = ({ 
  isOpen, 
  onClose, 
  availableCards, 
  onSelectCard 
}: {
  isOpen: boolean;
  onClose: () => void;
  availableCards: DashboardCard[];
  onSelectCard: (card: DashboardCard) => void;
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

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/20 max-w-4xl w-full max-h-[80vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Выберите карточку для добавления</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-white/60 mt-2">
              Доступно {availableCards.length} карточек для добавления на дашборд
            </p>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCards.map((card) => (
                <motion.div
                  key={card.id}
                  className="bg-white/5 rounded-2xl border border-white/10 p-4 cursor-pointer hover:bg-white/10 transition-all duration-200"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectCard(card)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: `rgb(${card.glowColor})` }}
                    />
                    <span className="text-white font-semibold text-sm">{card.title}</span>
                  </div>
                  <p className="text-white/60 text-xs mb-3 line-clamp-2">
                    {card.content.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span>{card.category}</span>
                    <span>{card.size.toUpperCase()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {availableCards.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎉</div>
                <p className="text-white/60">Все доступные карточки уже добавлены на дашборд!</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Адаптивный контент для карточек
const AdaptiveCardContent = ({ card }: { card: DashboardCard }) => {
  const renderContent = () => {
    const { size, type, content } = card;
    
    switch (type) {
      case 'kpi': {
        const trendLabel = getTrendLabel(content.trend || 'stable');
        const trendColor = getTrendColor(content.trend || 'stable');

        if (size === 'sm') {
          return (
            <div className="p-4 h-full flex flex-col gap-3 text-center justify-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="text-2xl lg:text-3xl font-bold text-white">
                  {formatNumber(content.value)}
                  {content.unit && <span className="text-white/60 text-lg ml-1">{content.unit}</span>}
                </div>
              </div>
              <div className="text-white/70 text-sm leading-snug line-clamp-2">
                {content.description}
              </div>
              <div
                className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full border self-center"
                style={{
                  backgroundColor: `rgba(${trendColor},0.15)`,
                  borderColor: `rgba(${trendColor},0.3)`,
                  color: `rgb(${trendColor})`
                }}
              >
                {trendLabel}
              </div>
            </div>
          );
        }

        if (size === 'md') {
          return (
            <div className="p-6 h-full flex flex-col gap-4">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                  {formatNumber(content.value)}
                  {content.unit && <span className="text-white/60 text-xl ml-1">{content.unit}</span>}
                </div>
                <p className="text-white/70 text-base">{content.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs text-white/70">
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <p className="text-white/50 mb-1">Статус</p>
                  <p 
                    className="font-semibold"
                    style={{ color: `rgb(${trendColor})` }}
                  >
                    {trendLabel}
                  </p>
                </div>
                {content.details && (
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-white/50 mb-1">Контекст</p>
                    <p className="text-white/80 line-clamp-2">{content.details}</p>
                  </div>
                )}
              </div>

              {content.target && (
                <div className="mt-auto">
                  <ProgressBar 
                    value={Math.min((content.value / content.target) * 100, 100)}
                    label={`Цель: ${formatNumber(content.target)}${content.unit || ''}`}
                    color={card.glowColor}
                    showLabel={true}
                    showTarget={true}
                    target={100}
                  />
                </div>
              )}
            </div>
          );
        }

        if (size === 'lg') {
          return (
            <div className="p-6 h-full flex flex-col">
              <div className="text-center mb-5">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {formatNumber(content.value)}
                  {content.unit && <span className="text-white/60 text-2xl ml-2">{content.unit}</span>}
                </div>
                <div className="text-white/70 text-lg">
                  {content.description}
                </div>
                {content.details && (
                  <p className="text-white/50 text-sm mt-2">{content.details}</p>
                )}
              </div>
              
              <div className="flex-grow flex items-center justify-center">
                <div className="text-center">
                  <div 
                    className="text-6xl mb-4"
                    style={{ color: `rgb(${trendColor})` }}
                  >
                    {content.trend === 'up' ? '📈' : content.trend === 'down' ? '📉' : '➡️'}
                  </div>
                  <p className="text-white/60">
                    {content.trend === 'up' ? 'Положительная динамика' : 
                     content.trend === 'down' ? 'Требует внимания' : 'Стабильные показатели'}
                  </p>
                </div>
              </div>

              {content.target && (
                <div className="mt-auto">
                  <ProgressBar 
                    value={Math.min((content.value / content.target) * 100, 100)}
                    label={`Прогресс к цели: ${formatNumber(content.target)}${content.unit || ''}`}
                    color={card.glowColor}
                    showLabel={true}
                    showTarget={true}
                    target={100}
                    size="lg"
                  />
                </div>
              )}
            </div>
          );
        }

        // XL size
        return (
          <div className="p-6 h-full flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-white/60 text-sm">Текущий показатель</p>
                <div className="text-5xl font-bold text-white mt-1">
                  {formatNumber(content.value)}
                  {content.unit && <span className="text-white/60 text-2xl ml-2">{content.unit}</span>}
                </div>
                <p className="text-white/70 text-base mt-2">{content.description}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-white/50 text-xs mb-1">Динамика</p>
                  <p 
                    className="text-lg font-semibold"
                    style={{ color: `rgb(${trendColor})` }}
                  >
                    {trendLabel}
                  </p>
                </div>
                
                {content.details && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-white/50 text-xs mb-1">Комментарий</p>
                    <p className="text-white/80">{content.details}</p>
                  </div>
                )}
                
                {content.target && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:col-span-2">
                    <p className="text-white/50 text-xs mb-2">Прогресс к цели</p>
                    <ProgressBar 
                      value={Math.min((content.value / content.target) * 100, 100)}
                      label={`Цель: ${formatNumber(content.target)}${content.unit || ''}`}
                      color={card.glowColor}
                      showLabel={true}
                      showTarget={true}
                      target={100}
                      size="lg"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div 
                  className="text-8xl mb-4"
                  style={{ color: `rgb(${trendColor})` }}
                >
                  {content.trend === 'up' ? '🚀' : content.trend === 'down' ? '📊' : '⚖️'}
                </div>
                <p className="text-white/60 text-lg">
                  {content.trend === 'up' ? 'Отличные результаты!' : 
                   content.trend === 'down' ? 'Требуется анализ' : 'Стабильная работа'}
                </p>
              </div>
            </div>
          </div>
        );
      }

      case 'progress': {
        const progressItems = Array.isArray(content.items) ? content.items : [];

        if (size === 'sm') {
          const topItem = progressItems[0];
          return (
            <div className="p-4 h-full flex flex-col justify-center text-center gap-3">
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-white">{content.value}%</div>
                <p className="text-white/60 text-sm mt-1 line-clamp-2">{content.description}</p>
              </div>
              {topItem && (
                <div className="w-full px-2">
                  <ProgressBar 
                    value={topItem.value}
                    label={topItem.label}
                    color={card.glowColor}
                    showLabel={false}
                    showTarget={!!topItem.target}
                    target={topItem.target}
                    size="sm"
                  />
                </div>
              )}
            </div>
          );
        }

        if (size === 'md') {
          return (
            <div className="p-6 h-full flex flex-col gap-4">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                  {content.value}%
                </div>
                <div className="text-white/70 text-base">{content.description}</div>
              </div>
              
              <div className="space-y-3">
                {progressItems.slice(0, 3).map((item: any, index: number) => (
                  <ProgressBar 
                    key={index}
                    value={item.value}
                    label={item.label}
                    color={card.glowColor}
                    showLabel={true}
                    showTarget={!!item.target}
                    target={item.target}
                  />
                ))}
              </div>
            </div>
          );
        }

        if (size === 'lg') {
          return (
            <div className="p-6 h-full flex flex-col">
              <div className="text-center mb-5">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {content.value}%
                </div>
                <div className="text-white/70 text-lg">
                  {content.description}
                </div>
              </div>
              
              <div className="flex-grow space-y-4 mb-6">
                {progressItems.map((item: any, index: number) => (
                  <ProgressBar 
                    key={index}
                    value={item.value}
                    label={item.label}
                    color={card.glowColor}
                    showLabel={true}
                    showTarget={!!item.target}
                    target={item.target}
                    size="lg"
                  />
                ))}
              </div>

              <div className="mt-auto text-center">
                <p className="text-white/60 text-sm">
                  Общая эффективность работы услуг
                </p>
              </div>
            </div>
          );
        }

        // XL size
        return (
          <div className="p-6 h-full grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-white/60 text-sm">Общая эффективность</p>
                <div className="text-5xl font-bold text-white mt-1">{content.value}%</div>
                <p className="text-white/70 text-base mt-2">{content.description}</p>
              </div>
              
              <div className="space-y-3">
                {progressItems.map((item: any, index: number) => (
                  <ProgressBar 
                    key={index}
                    value={item.value}
                    label={item.label}
                    color={card.glowColor}
                    showLabel={true}
                    showTarget={!!item.target}
                    target={item.target}
                    size="lg"
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-white/60">
                  Детальный анализ эффективности <br />по категориям услуг
                </p>
              </div>
            </div>
          </div>
        );
      }

      case 'chart': {
        const chartData = Array.isArray(content.chartData) ? content.chartData : [];
        const chartSize = size === 'sm' ? 80 : size === 'md' ? 110 : size === 'lg' ? 140 : 180;
        
        if (size === 'sm') {
          return (
            <div className="p-4 h-full flex flex-col justify-center items-center text-center gap-2">
              <div className="text-2xl lg:text-3xl font-bold text-white mb-2">
                {content.value}
              </div>
              <div className="text-white/60 text-sm text-center line-clamp-2">
                {content.description}
              </div>
            </div>
          );
        }

        if (size === 'md') {
          return (
            <div className="p-6 h-full flex flex-col">
              <div className="text-center mb-4">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  {content.value}
                </div>
                <div className="text-white/70 text-base">
                  {content.description}
                </div>
              </div>
              
              <div className="flex-grow flex flex-col items-center justify-center gap-4">
                <PieChart 
                  data={content.chartData} 
                  size={chartSize}
                  strokeWidth={size === 'md' ? 15 : 20}
                />
                <div className="flex flex-wrap gap-2 justify-center text-xs text-white/60">
                  {chartData.slice(0, 3).map((item: any) => (
                    <span 
                      key={item.name}
                      className="px-2 py-1 rounded-full border border-white/10 bg-black/20"
                      style={{ 
                        color: `rgb(${item.color})`, 
                        borderColor: `rgba(${item.color},0.4)`,
                        backgroundColor: `rgba(${item.color},0.1)`
                      }}
                    >
                      {item.name}: {item.value}%
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (size === 'lg') {
          return (
            <div className="p-6 h-full flex flex-col">
              <div className="text-center mb-6">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-3">
                  {content.value}
                </div>
                <div className="text-white/70 text-lg">
                  {content.description}
                </div>
              </div>
              
              <div className="flex-grow flex items-center justify-center mb-6">
                <PieChart 
                  data={content.chartData} 
                  size={chartSize}
                  strokeWidth={18}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {content.chartData.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 text-sm bg-white/5 p-3 rounded-lg border border-white/10">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                      style={{ 
                        backgroundColor: `rgb(${item.color})`,
                        boxShadow: `0 0 4px rgba(${item.color}, 0.5)`
                      }}
                    />
                    <span className="text-white/70 flex-1 truncate">{item.name}</span>
                    <span className="text-white/90 font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // XL size
        return (
          <div className="p-6 h-full grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 flex flex-col items-center justify-center text-center gap-4">
              <div>
                <p className="text-white/60 text-sm">Распределение</p>
                <div className="text-5xl font-bold text-white mt-1">
                  {content.value}
                </div>
                <p className="text-white/70 text-base mt-2">{content.description}</p>
              </div>
              
              <PieChart 
                data={content.chartData} 
                size={chartSize}
                strokeWidth={16}
              />
            </div>
            
            <div className="lg:col-span-3 space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                {content.chartData.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                        style={{ 
                          backgroundColor: `rgb(${item.color})`,
                          boxShadow: `0 0 4px rgba(${item.color}, 0.5)`
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm truncate">{item.name}</p>
                        <p className="text-white/50 text-xs">Доля в общем объеме</p>
                      </div>
                    </div>
                    <div className="text-white text-lg font-semibold flex-shrink-0">{item.value}%</div>
                  </div>
                ))}
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <h4 className="text-white font-semibold text-base mb-3">Анализ распределения</h4>
                <p className="text-white/60 text-sm">
                  Социальные услуги составляют наибольшую долю, что отражает основную направленность нашей деятельности.
                </p>
              </div>
            </div>
          </div>
        );
      }

      case 'list': {
        const listItems = Array.isArray(content.items) ? content.items : [];

        if (size === 'sm') {
          return (
            <div className="p-4 h-full flex flex-col justify-center text-center gap-3">
              <div className="text-2xl lg:text-3xl font-bold text-white">{content.value}</div>
              <div className="text-white/60 text-sm line-clamp-2">{content.description}</div>
              {listItems[0] && (
                <p className="text-white/40 text-xs line-clamp-2">{listItems[0]}</p>
              )}
            </div>
          );
        }

        if (size === 'md') {
          return (
            <div className="p-6 h-full flex flex-col gap-4">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                  {content.value}
                </div>
                <div className="text-white/70 text-base">{content.description}</div>
              </div>
              
              <div className="flex-grow space-y-3">
                {listItems.slice(0, 4).map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80 hover:bg-white/10 transition-colors">
                    <span className="text-white/40 text-xs w-5">#{index + 1}</span>
                    <span className="flex-1 truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (size === 'lg') {
          return (
            <div className="p-6 h-full flex flex-col">
              <div className="text-center mb-6">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {content.value}
                </div>
                <div className="text-white/70 text-lg">
                  {content.description}
                </div>
              </div>
              
              <div className="flex-grow grid gap-4 mb-6">
                {listItems.map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-white/10 text-white/70 flex items-center justify-center font-medium text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-white/90 text-base leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto text-center">
                <p className="text-white/60 text-sm">
                  Рейтинг основан на количестве запросов за последний месяц
                </p>
              </div>
            </div>
          );
        }

        // XL size
        return (
          <div className="p-6 h-full grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-white/60 text-sm">Топ услуг</p>
                <div className="text-5xl font-bold text-white mt-1">{content.value}</div>
                <p className="text-white/70 text-base mt-2">{content.description}</p>
              </div>
              
              <div className="space-y-3">
                {listItems.slice(0, 4).map((item: string, index: number) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-sm text-white/80 hover:bg-white/10 transition-colors">
                    <div className="text-white/40 text-xs mb-1">Позиция #{index + 1}</div>
                    <p className="leading-relaxed line-clamp-2">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <h4 className="text-white font-semibold text-base mb-3">Анализ популярности</h4>
                <p className="text-white/60 text-sm">
                  Консультационные услуги занимают лидирующие позиции, что свидетельствует о высокой потребности в информационной поддержке населения.
                </p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <h4 className="text-white font-semibold text-base mb-3">Рекомендации</h4>
                <div className="space-y-2 text-sm text-white/60">
                  <p>• Увеличить количество консультантов</p>
                  <p>• Расширить часы приема</p>
                  <p>• Внедрить онлайн-запись</p>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'stats': {
        const statsList = Array.isArray(content.stats) ? content.stats : [];

        if (size === 'sm') {
          return (
            <div className="p-4 h-full flex flex-col justify-center items-center text-center gap-2">
              <div className="text-2xl lg:text-3xl font-bold text-white">
                {content.value}
              </div>
              <div className="text-white/60 text-sm line-clamp-2">
                {content.description}
              </div>
            </div>
          );
        }

        if (size === 'md') {
          return (
            <div className="p-6 h-full flex flex-col">
              <div className="text-center mb-4">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                  {content.value}
                </div>
                <div className="text-white/70 text-base">
                  {content.description}
                </div>
              </div>
              
              <div className="flex-grow grid grid-cols-2 gap-3">
                {statsList.slice(0, 4).map((stat: any, index: number) => (
                  <div key={index} className="text-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="text-white font-bold text-lg">{stat.value}</div>
                    <div className="text-white/60 text-xs mb-1">{stat.label}</div>
                    {stat.change && (
                      <div className={`text-xs ${stat.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stat.change > 0 ? '↗' : '↘'} {stat.change > 0 ? '+' : ''}{stat.change}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (size === 'lg') {
          return (
            <div className="p-6 h-full flex flex-col">
              <div className="text-center mb-6">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {content.value}
                </div>
                <div className="text-white/70 text-lg">
                  {content.description}
                </div>
              </div>
              
              <div className="flex-grow grid grid-cols-2 gap-4 mb-6">
                {statsList.map((stat: any, index: number) => (
                  <div key={index} className="text-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="text-white font-bold text-xl">{stat.value}</div>
                    <div className="text-white/60 text-sm mb-2">{stat.label}</div>
                    {stat.change && (
                      <div 
                        className={`text-sm ${
                          stat.change > 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {stat.change > 0 ? '↗' : '↘'} {stat.change > 0 ? '+' : ''}{stat.change}
                        {stat.target && (
                          <span className="text-white/40 text-xs block mt-1">
                            цель: {stat.target}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-auto text-center">
                <p className="text-white/60 text-sm">
                  Статистика за текущий отчетный период
                </p>
              </div>
            </div>
          );
        }

        // XL size
        return (
          <div className="p-6 h-full grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-white/60 text-sm">Сводка за месяц</p>
                <div className="text-5xl font-bold text-white mt-1">{content.value}</div>
                <p className="text-white/70 text-base mt-2">{content.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {statsList.map((stat: any, index: number) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                    <p className="text-white/50 text-xs mb-1">{stat.label}</p>
                    <p className="text-white text-2xl font-semibold">{stat.value}</p>
                    {stat.change && (
                      <p className={`text-xs mt-1 ${stat.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stat.change > 0 ? '↗' : '↘'} {stat.change > 0 ? '+' : ''}{stat.change}
                        {stat.target && (
                          <span className="text-white/40 block">
                            цель: {stat.target}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <h4 className="text-white font-semibold text-base">Анализ показателей</h4>
              <p className="text-white/60 text-sm">
                Положительная динамика по большинству показателей свидетельствует об эффективности работы службы.
              </p>
              
              <div className="grid grid-cols-2 gap-3 text-sm text-white/70 mt-4">
                <div className="bg-black/20 rounded-xl p-3">
                  <p className="text-white/50 text-xs">Рост клиентов</p>
                  <p className="text-white text-xl font-semibold">+12%</p>
                </div>
                <div className="bg-black/20 rounded-xl p-3">
                  <p className="text-white/50 text-xs">Улучшение качества</p>
                  <p className="text-white text-xl font-semibold">+8%</p>
                </div>
              </div>
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="p-6 h-full flex items-center justify-center text-white/60">
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <p>Контент для этого типа карточки</p>
              <p className="text-sm">в разработке</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start justify-between mb-3 p-4 pb-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-semibold text-sm lg:text-base truncate">
            {card.title}
          </h3>
          {card.lastUpdated && (
            <p className="text-white/40 text-xs mt-1">
              Обновлено: {formatRelativeTime(card.lastUpdated)}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex-grow">
        {renderContent()}
      </div>

      <div className="flex justify-between items-center p-4 pt-2">
        <div className="flex items-center gap-2">
          {card.category && (
            <span className="text-white/40 text-xs bg-white/5 px-2 py-1 rounded">
              {card.category}
            </span>
          )}
        </div>
        
        <div 
          className="text-xs px-2 py-1 rounded-full border"
          style={{
            backgroundColor: `rgba(${card.glowColor}, 0.2)`,
            color: `rgb(${card.glowColor})`,
            borderColor: `rgba(${card.glowColor}, 0.3)`
          }}
        >
          {card.content.trend === 'up' ? '↗ Рост' : 
           card.content.trend === 'down' ? '↘ Снижение' : '→ Стабильно'}
        </div>
      </div>
    </div>
  );
};

// Sortable компонент для карточек
const SortableCard = ({ 
  card, 
  isEditing, 
  onRemove, 
  onSizeChange 
}: { 
  card: DashboardCard; 
  isEditing: boolean;
  onRemove: () => void;
  onSizeChange: (size: CardSize) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-full ${CARD_SIZES[card.size].class}`}
      {...attributes}
      {...listeners}
    >
      <BentoCard
        size={card.size}
        glowColor={card.glowColor}
        isEditing={isEditing}
        onRemove={onRemove}
        onSizeChange={onSizeChange}
        isDragging={isDragging}
      >
        <AdaptiveCardContent card={card} />
      </BentoCard>
    </div>
  );
};

// Drag Overlay компонент
const CardDragOverlay = ({ card }: { card: DashboardCard }) => {
  return (
    <BentoCard
      size={card.size}
      glowColor={card.glowColor}
      isDragging={true}
      isOverlay={true}
    >
      <div className="h-full flex flex-col justify-center items-center p-6">
        <div className="text-white font-semibold text-sm mb-2 text-center">
          {card.title}
        </div>
        <div className="text-white/60 text-xs text-center">
          Перетаскивается...
        </div>
        <motion.div 
          className="mt-4 text-white/40"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ⠿
        </motion.div>
      </div>
    </BentoCard>
  );
};

// Компонент KPI виджета
function KPIWidget({ metric, isEditing = false }: { metric: ServiceMetric; isEditing?: boolean }) {
  const trendColor = metric.color;
  const progress = metric.target ? Math.min((metric.value / metric.target) * 100, 100) : 0;
  
  const content = (
    <motion.div 
      className="h-full flex flex-col justify-between p-4"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-xl lg:text-2xl font-bold text-white leading-tight">
          {metric.value}
          {metric.unit && <span className="text-white/60 text-lg ml-0.5">{metric.unit}</span>}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-lg lg:text-xl">{metric.icon}</div>
          {metric.change && (
            <motion.div 
              className={`flex items-center gap-1 text-xs font-medium`}
              style={{ color: `rgb(${trendColor})` }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
              {Math.abs(metric.change)}{metric.unit}
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-sm font-medium line-clamp-1 flex-1 mr-2">
            {metric.name}
          </span>
          {metric.change && (
            <span 
              className="text-xs px-2 py-1 rounded-full border flex-shrink-0"
              style={{
                backgroundColor: `rgba(${trendColor}, 0.2)`,
                color: `rgb(${trendColor})`,
                borderColor: `rgba(${trendColor}, 0.3)`
              }}
            >
              {metric.trend === 'up' ? 'Рост' : metric.trend === 'down' ? 'Снижение' : 'Стабильно'}
            </span>
          )}
        </div>
        
        <div className="text-white/60 text-sm line-clamp-2 leading-relaxed">
          {metric.description}
        </div>
      </div>

      {metric.target && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Прогресс к цели</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <div 
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ 
                width: `${progress}%`,
                backgroundColor: `rgb(${trendColor})`
              }}
            />
          </div>
          <div className="text-white/40 text-xs mt-1">
            Цель: {metric.target}{metric.unit}
          </div>
        </div>
      )}

      {isEditing && (
        <motion.div
          className="absolute top-2 left-2 w-3 h-3 bg-yellow-400 rounded-full shadow-sm"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );

  return (
    <BentoCard 
      className="h-full min-h-[140px]"
      glowColor={trendColor}
      isEditing={isEditing}
    >
      {content}
    </BentoCard>
  );
}

// Основной компонент страницы статистики услуг
export default function ServicesStatisticsPage() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [customCards, setCustomCards] = useState<DashboardCard[]>(() =>
    serviceCards.map((card) => ({ ...card }))
  );
  const [emptySlots, setEmptySlots] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLayoutHydrated, setIsLayoutHydrated] = useState(false);
  const [isCardPickerOpen, setIsCardPickerOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  // Загрузка сохраненной раскладки
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLayoutHydrated(true);
      return;
    }

    try {
      const storedLayout = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (storedLayout) {
        const parsed = JSON.parse(storedLayout);
        if (Array.isArray(parsed)) {
          const normalizedCards: DashboardCard[] = parsed
            .filter((card: any) => card && typeof card === 'object')
            .map((card: any, index: number) => ({
              ...card,
              size: card.size || 'sm',
              position: typeof card.position === 'number' ? card.position : index + 1,
              glowColor: card.glowColor || COLORS.blue
            }));

          if (normalizedCards.length) {
            setCustomCards(normalizedCards);
          }
        }
      }
    } catch (error) {
      console.error('Не удалось загрузить раскладку дашборда', error);
    } finally {
      setIsLayoutHydrated(true);
    }
  }, []);

  // Сохранение раскладки
  useEffect(() => {
    if (!isLayoutHydrated || typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(customCards));
    } catch (error) {
      console.error('Не удалось сохранить раскладку дашборда', error);
    }
  }, [customCards, isLayoutHydrated]);

  const availableCards = useMemo(
    () => serviceCards.filter(card => !customCards.some(existing => existing.id === card.id)),
    [customCards]
  );
  const hasAvailableCards = availableCards.length > 0;

  const metricsSummary = useMemo(() => {
    const positive = serviceMetrics.filter((metric) => metric.trend === 'up').length;
    const negative = serviceMetrics.filter((metric) => metric.trend === 'down').length;
    const stable = serviceMetrics.length - positive - negative;
    const averageChange = serviceMetrics.length
      ? Number(
          (
            serviceMetrics.reduce((sum, metric) => sum + metric.change, 0) /
            serviceMetrics.length
          ).toFixed(1)
        )
      : 0;

    return {
      positive,
      negative,
      stable,
      averageChange
    };
  }, []);

  const categoriesSummary = useMemo(() => {
    const totalRevenue = serviceCategories.reduce((acc, cat) => acc + cat.revenue, 0);
    const totalServices = serviceCategories.reduce((acc, cat) => acc + cat.totalServices, 0);
    const avgSatisfaction = serviceCategories.reduce((acc, cat) => acc + cat.satisfactionRate, 0) / serviceCategories.length;

    return {
      totalRevenue,
      totalServices,
      avgSatisfaction
    };
  }, []);

  // Функция для удаления карточки
  const removeCard = useCallback((cardId: string) => {
    setCustomCards(cards => cards.filter(card => card.id !== cardId));
    setEmptySlots(slots => [...slots, Date.now()]);
  }, []);

  // Функция для изменения размера карточки
  const changeCardSize = useCallback((cardId: string, newSize: CardSize) => {
    setCustomCards(cards => 
      cards.map(card => 
        card.id === cardId ? { ...card, size: newSize } : card
      )
    );
  }, []);

  // Функция для добавления новой карточки
  const addNewCard = useCallback((cardTemplate?: DashboardCard) => {
    if (!hasAvailableCards && !cardTemplate) return;

    const template = cardTemplate || availableCards[0];
    const newCard = {
      ...template,
      position: customCards.length + 1,
      size: template.size || 'sm',
      lastUpdated: new Date().toISOString()
    };

    setCustomCards(cards => [...cards, newCard]);
    setEmptySlots(slots => slots.slice(1));
    setIsCardPickerOpen(false);
  }, [availableCards, customCards.length, hasAvailableCards]);

  const resetLayout = useCallback(() => {
    setCustomCards(serviceCards.map((card) => ({ ...card })));
    setEmptySlots([]);
    setActiveId(null);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(LAYOUT_STORAGE_KEY);
    }
  }, []);

  // Функции для drag & drop
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setCustomCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  // Функция для переключения режима редактирования
  const toggleEditMode = useCallback(() => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEmptySlots([]);
      setIsCardPickerOpen(false);
    }
  }, [isEditing]);

  const openCardPicker = useCallback(() => {
    setIsCardPickerOpen(true);
  }, []);

  const closeCardPicker = useCallback(() => {
    setIsCardPickerOpen(false);
  }, []);

  const activeCard = useMemo(
    () => (activeId ? customCards.find((card) => card.id === activeId) || null : null),
    [activeId, customCards]
  );

  if (!isLayoutHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-lg">Загрузка статистики услуг...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>
      <style jsx global>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6">
        {/* Welcome Section */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <BentoCard className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-grow min-w-0">
                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 leading-tight">
                  Статистика услуг
                </h1>
                <p className="text-white/60 text-base lg:text-lg max-w-2xl">
                  Анализ эффективности и качества предоставляемых социальных услуг {isEditing && (
                    <span className="text-yellow-300 font-medium">• Режим редактирования активен</span>
                  )}
                </p>
              </div>
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white flex-shrink-0"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium">Данные актуальны</span>
              </motion.div>
            </div>
          </BentoCard>
        </motion.section>

        {/* Summary Section */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BentoCard className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-white/60 text-sm">Сводка показателей</p>
                  <h3 className="text-white text-xl font-semibold">Динамика метрик</h3>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border ${
                  metricsSummary.averageChange >= 0 ? 'text-green-300 border-green-500/40' : 'text-red-300 border-red-500/40'
                } bg-black/20`}>
                  {metricsSummary.averageChange >= 0 ? 'Общий рост' : 'Снижение'} {metricsSummary.averageChange}%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center hover:bg-white/10 transition-colors">
                  <div className="text-2xl font-bold text-green-300">{metricsSummary.positive}</div>
                  <p className="text-xs text-white/60 mt-1">В росте</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center hover:bg-white/10 transition-colors">
                  <div className="text-2xl font-bold text-yellow-300">{metricsSummary.stable}</div>
                  <p className="text-xs text-white/60 mt-1">Стабильно</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center hover:bg-white/10 transition-colors">
                  <div className="text-2xl font-bold text-red-300">{metricsSummary.negative}</div>
                  <p className="text-xs text-white/60 mt-1">Снижение</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-white/70">
                <div className="flex items-center justify-between">
                  <span>Всего отслеживаемых метрик</span>
                  <span className="font-semibold text-white">{serviceMetrics.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Среднее изменение</span>
                  <span className={`font-semibold ${metricsSummary.averageChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {metricsSummary.averageChange > 0 ? '+' : ''}{metricsSummary.averageChange}%
                  </span>
                </div>
              </div>
            </BentoCard>

            <BentoCard className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-white/60 text-sm">Эффективность услуг</p>
                  <h3 className="text-white text-xl font-semibold">Общие показатели</h3>
                </div>
                <span className="text-xs px-3 py-1 rounded-full border text-emerald-300 border-emerald-400/40 bg-black/20">
                  Высокая эффективность
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center mb-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-xl font-bold text-white">{formatNumber(categoriesSummary.totalServices)}</div>
                  <p className="text-xs text-white/60 mt-1">услуг всего</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-xl font-bold text-emerald-300">{Math.round(categoriesSummary.avgSatisfaction)}%</div>
                  <p className="text-xs text-white/60 mt-1">удовлетворенность</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-xl font-bold text-amber-300">{formatCurrency(categoriesSummary.totalRevenue)}</div>
                  <p className="text-xs text-white/60 mt-1">общий доход</p>
                </div>
              </div>
              <p className="text-xs text-white/50 mb-4">
                На основе данных по {serviceCategories.length} категориям услуг
              </p>
              <div>
                <p className="text-xs uppercase text-white/50 mb-2">Категории услуг</p>
                <div className="flex flex-wrap gap-2">
                  {serviceCategories.map((category) => (
                    <span
                      key={category.id}
                      className="text-xs px-3 py-1 rounded-full border border-white/20 text-white/80 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            </BentoCard>
          </div>
        </motion.section>

        {/* Основные метрики - Фиксированные показатели */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Ключевые показатели эффективности
            {isEditing && <span className="text-yellow-300 text-sm ml-2">• Зафиксированы</span>}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {serviceMetrics.map((metric, index) => (
              <KPIWidget key={metric.id} metric={metric} isEditing={isEditing} />
            ))}
          </div>
        </motion.section>

        {/* Кастомные карточки с возможностью редактирования и перетаскивания */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Детальная статистика услуг
              </h2>
              {isEditing && (
                <p className="text-white/60 text-sm mt-1">
                  Доступно карточек для добавления: {availableCards.length}
                </p>
              )}
            </div>
            {isEditing ? (
              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${
                    hasAvailableCards
                      ? 'border-emerald-400 text-emerald-300 hover:bg-emerald-400/10 hover:border-emerald-300'
                      : 'border-white/10 text-white/40 cursor-not-allowed'
                  }`}
                  onClick={openCardPicker}
                  disabled={!hasAvailableCards}
                  whileHover={hasAvailableCards ? { scale: 1.03 } : undefined}
                  whileTap={hasAvailableCards ? { scale: 0.97 } : undefined}
                >
                  ➕ Добавить карточку ({availableCards.length})
                </motion.button>
                <motion.button
                  className="px-4 py-2 rounded-full border text-sm font-medium text-white/80 border-white/30 hover:bg-white/10 hover:border-white/40 transition-colors"
                  onClick={resetLayout}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  ↺ Сбросить раскладку
                </motion.button>
                <motion.button
                  className={`px-4 py-2 rounded-full backdrop-blur-lg border text-sm font-medium transition-all duration-300 ${
                    isEditing 
                      ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300 shadow-lg shadow-yellow-500/25' 
                      : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:border-white/30'
                  }`}
                  onClick={toggleEditMode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isEditing ? (
                    <span className="flex items-center gap-2">
                      <span>✅</span>
                      Завершить редактирование
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>✏️</span>
                      Редактировать дашборд
                    </span>
                  )}
                </motion.button>
              </div>
            ) : (
              <motion.button
                className={`px-4 py-2 rounded-full backdrop-blur-lg border text-sm font-medium transition-all duration-300 ${
                  isEditing 
                    ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300 shadow-lg shadow-yellow-500/25' 
                    : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:border-white/30'
                }`}
                onClick={toggleEditMode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isEditing ? (
                  <span className="flex items-center gap-2">
                    <span>✅</span>
                    Завершить редактирование
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>✏️</span>
                    Редактировать дашборд
                  </span>
                )}
              </motion.button>
            )}
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
          >
            <SortableContext items={customCards.map(card => card.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 auto-rows-[minmax(220px,auto)]">
                {customCards.map((card) => (
                  <SortableCard
                    key={card.id}
                    card={card}
                    isEditing={isEditing}
                    onRemove={() => removeCard(card.id)}
                    onSizeChange={(newSize) => changeCardSize(card.id, newSize)}
                  />
                ))}
                
                {/* Пустые слоты для добавления новых карточек */}
                {emptySlots.map((slotId) => (
                  <EmptyCardSlot key={slotId} onAdd={addNewCard} isEditing={isEditing} />
                ))}
                
                {/* Всегда показывать один пустой слот в режиме редактирования */}
                {isEditing && emptySlots.length === 0 && hasAvailableCards && (
                  <EmptyCardSlot onAdd={openCardPicker} isEditing={isEditing} />
                )}
              </div>
            </SortableContext>

            <DragOverlay adjustScale={true} dropAnimation={null}>
              {activeId && activeCard ? (
                <CardDragOverlay card={activeCard} />
              ) : null}
            </DragOverlay>
          </DndContext>

          {/* Модальное окно выбора карточек */}
          <CardPickerModal
            isOpen={isCardPickerOpen}
            onClose={closeCardPicker}
            availableCards={availableCards}
            onSelectCard={addNewCard}
          />

          {/* Подсказка по управлению в режиме редактирования */}
          {isEditing && (
            <motion.div 
              className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="text-white font-semibold mb-3">Как управлять карточками:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/60">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="w-6 h-6 rounded-lg bg-blue-500 border-2 border-blue-400 flex items-center justify-center text-xs text-white font-bold">▫</div>
                      <div className="w-6 h-6 rounded-lg bg-gray-800 border-2 border-gray-600 flex items-center justify-center text-xs text-gray-300">▫▫</div>
                      <div className="w-6 h-6 rounded-lg bg-gray-800 border-2 border-gray-600 flex items-center justify-center text-xs text-gray-300">◼</div>
                    </div>
                    <span>Нажмите на иконки размера для изменения</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white text-xs transform">×</div>
                    <span>Наведите на карточку чтобы увидеть кнопку удаления</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-xs">⠿</div>
                    <span>Перетаскивайте карточки для изменения порядка</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-white/5 border-2 border-dashed border-white/30 flex items-center justify-center text-xs">+</div>
                    <span>Добавляйте новые карточки из пустых слотов</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 text-sm">
                  💡 Контент автоматически адаптируется под размер карточки - чем больше карточка, тем больше деталей!
                </p>
              </div>
            </motion.div>
          )}
        </motion.section>
      </main>
    </div>
  );
}