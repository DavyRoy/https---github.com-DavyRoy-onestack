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
interface KPI {
  label: string;
  value: number;
  change?: number;
  suffix?: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
  icon: string;
  link?: string;
  color?: string;
  target?: number;
  unit?: string;
}

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
  actionLink?: string;
  read?: boolean;
}

type CardSize = 'sm' | 'md' | 'lg' | 'xl';
type CardType = 'kpi' | 'chart' | 'progress' | 'list' | 'stats' | 'table' | 'timeline';

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

// Новые типы для модальных окон
interface ModalState {
  isOpen: boolean;
  type: 'kpiDetail' | 'alertDetail' | 'settings' | 'addCard' | 'cardDetail' | null;
  data?: any;
}

interface KpiDetailModalData {
  kpi: KPI;
  timeframe: 'day' | 'week' | 'month' | 'quarter';
  history: { date: string; value: number; target: number }[];
  breakdown: { category: string; value: number; percentage: number }[];
}

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

const numberFormatter = new Intl.NumberFormat('ru-RU');
const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const formatNumber = (value: number) => numberFormatter.format(value);
const formatCurrency = (value: number) => currencyFormatter.format(value);

// Конфигурация ролей
const ROLES_CONFIG = {
  admin: {
    title: 'Руководитель организации социальных услуг',
    description: 'Полный контроль над системой социальных услуг',
    icon: '👑',
    color: 'from-purple-500 to-pink-500',
    permissions: ['all']
  }
};

// Моки данных для руководителя социальных услуг
const todayKPIs: KPI[] = [
  { 
    label: "Обслужено граждан", 
    value: 15842, 
    change: 12, 
    trend: 'up', 
    description: "Зарегистрировано в системе за текущий месяц", 
    icon: "👥",
    color: COLORS.blue,
    target: 15000,
    unit: 'чел.'
  },
  { 
    label: "Текущие обращения", 
    value: 2347, 
    change: -5, 
    trend: 'down', 
    description: "Требуют обработки и решения", 
    icon: "📥",
    color: COLORS.orange,
    target: 2000,
    unit: 'ед.'
  },
  { 
    label: "Выполнено услуг", 
    value: 8951, 
    change: 18, 
    trend: 'up', 
    description: "Успешно завершено за текущий период", 
    icon: "✅",
    color: COLORS.success,
    target: 8500,
    unit: 'усл.'
  },
  { 
    label: "Удовлетворенность", 
    value: 94.2, 
    suffix: "%", 
    change: 5, 
    trend: 'up', 
    description: "Средний показатель качества услуг", 
    icon: "⭐",
    color: COLORS.amber,
    target: 90,
    unit: '%'
  },
  { 
    label: "Бюджет исполнен", 
    value: 82, 
    suffix: "%", 
    trend: 'stable', 
    description: "От общего объема выделенных средств", 
    icon: "💰",
    color: COLORS.emerald,
    target: 85,
    unit: '%'
  },
  { 
    label: "Среднее время ответа", 
    value: 2.3, 
    suffix: "дн", 
    change: -15, 
    trend: 'down', 
    description: "На обработку обращения гражданина", 
    icon: "⏱️",
    color: COLORS.purple,
    target: 3,
    unit: 'дн.'
  },
];

const systemKPIs: KPI[] = [
  { 
    label: "Соц. сопровождение", 
    value: 1245, 
    trend: 'up', 
    description: "Активные случаи сопровождения", 
    icon: "🏠",
    color: COLORS.blue,
    change: 8,
    unit: 'случ.'
  },
  { 
    label: "Медицинский уход", 
    value: 867, 
    trend: 'stable', 
    description: "Патронажные услуги и уход", 
    icon: "🏥",
    color: COLORS.teal,
    change: 2,
    unit: 'усл.'
  },
  { 
    label: "Юридические консультации", 
    value: 543, 
    trend: 'up', 
    description: "Оказано юридических услуг", 
    icon: "⚖️",
    color: COLORS.indigo,
    change: 15,
    unit: 'конс.'
  },
  { 
    label: "Психологическая помощь", 
    value: 321, 
    trend: 'up', 
    description: "Проведено консультаций и сеансов", 
    icon: "🧠",
    color: COLORS.purple,
    change: 12,
    unit: 'сеанс.'
  },
  { 
    label: "Экстренные выезды", 
    value: 89, 
    trend: 'down', 
    description: "За последнюю неделю работы", 
    icon: "🚑",
    color: COLORS.rose,
    change: -10,
    unit: 'выезд.'
  },
  { 
    label: "Групповые занятия", 
    value: 45, 
    trend: 'up', 
    description: "Проведено мероприятий и занятий", 
    icon: "👨‍👩‍👧‍👦",
    color: COLORS.orange,
    change: 5,
    unit: 'мероп.'
  },
];

// Напоминания и уведомления
const alerts: Alert[] = [
  { 
    id: '1', 
    type: 'warning', 
    title: 'Срок сдачи квартального отчета', 
    message: 'До окончания сдачи квартального отчета осталось 3 дня. Необходимо подготовить все документы и статистику.', 
    time: 'Сегодня, 14:30', 
    priority: 'high',
    action: 'Подготовить отчет',
    actionLink: '',
    read: false
  },
  { 
    id: '2', 
    type: 'info', 
    title: 'Обновление реестра услуг', 
    message: 'Требуется актуализировать каталог услуг до конца недели. Добавлено 3 новые услуги.', 
    time: '2 дня назад', 
    priority: 'medium',
    action: 'Обновить реестр',
    actionLink: '',
    read: true
  },
  { 
    id: '3', 
    type: 'success', 
    title: 'Бюджет утвержден', 
    message: 'Годовой бюджет организации успешно утвержден. Общий объем финансирования увеличен на 15%.', 
    time: '5 дней назад', 
    priority: 'low',
    read: true
  },
  { 
    id: '4', 
    type: 'error', 
    title: 'Требуется верификация документов', 
    message: '15 клиентов ожидают верификации документов. Максимальный срок обработки - 2 рабочих дня.', 
    time: 'Неделю назад', 
    priority: 'high',
    action: 'Проверить документы',
    actionLink: '',
    read: false
  },
];

// Расширенные дополнительные карточки
const additionalCards: DashboardCard[] = [
  {
    id: 'organization',
    type: 'kpi',
    title: '🏢 Организация',
    content: {
      value: 12,
      description: 'Управление структурой и подразделениями',
      trend: 'up',
      details: 'Активных подразделений в системе',
      unit: 'подр.',
      target: 15
    },
    size: 'sm',
    position: 1,
    removable: true,
    glowColor: COLORS.blue,
    category: 'Структура',
    lastUpdated: '2024-01-15T08:00:00Z'
  },
  {
    id: 'services',
    type: 'kpi',
    title: '🎯 Услуги',
    content: {
      value: 45,
      description: 'Каталог услуг и их настройка',
      trend: 'up',
      details: 'Доступных услуг для граждан',
      unit: 'усл.',
      target: 50
    },
    size: 'sm',
    position: 2,
    removable: true,
    glowColor: COLORS.emerald,
    category: 'Каталог',
    lastUpdated: '2024-01-15T09:30:00Z'
  },
  {
    id: 'performance',
    type: 'progress',
    title: '📊 Производительность системы',
    content: {
      value: 87,
      description: 'Общая эффективность',
      trend: 'up',
      items: [
        { label: 'Обработка заявок', value: 92, target: 95 },
        { label: 'Качество услуг', value: 88, target: 90 },
        { label: 'Скорость ответа', value: 81, target: 85 }
      ],
      detailedStats: {
        weekly: [65, 72, 79, 83, 87, 85, 87],
        targets: [75, 80, 85, 85, 90, 90, 90],
        labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
      }
    },
    size: 'md',
    position: 7,
    removable: true,
    glowColor: COLORS.blue,
    category: 'Производительность',
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: 'training',
    type: 'stats',
    title: '🎓 Обучение сотрудников',
    content: {
      value: 23,
      description: 'Сотрудников проходят обучение в текущий момент',
      trend: 'up',
      stats: [
        { label: 'Завершили курсы', value: 45, change: 12, target: 40 },
        { label: 'Новые программы', value: 3, change: 0, target: 4 },
        { label: 'Средний балл', value: 4.7, change: 0.2, target: 4.5 }
      ],
      detailedInfo: {
        currentCourses: ['Цифровая трансформация', 'Управление проектами', 'Клиентоориентированность', 'Эффективные коммуникации'],
        completionRate: 87,
        satisfaction: 4.8,
        upcoming: ['Кризисное вмешательство', 'Работа с пожилыми']
      }
    },
    size: 'sm',
    position: 8,
    removable: true,
    glowColor: COLORS.emerald,
    category: 'Персонал',
    lastUpdated: '2024-01-15T09:15:00Z'
  },
  {
    id: 'equipment',
    type: 'chart',
    title: '🖥️ Оборудование',
    content: {
      value: 94,
      description: 'Общая исправность',
      trend: 'stable',
      chartData: [
        { name: 'Исправно', value: 94, color: COLORS.success },
        { name: 'На ремонте', value: 4, color: COLORS.warning },
        { name: 'Неисправно', value: 2, color: COLORS.error }
      ],
      equipmentDetails: {
        total: 156,
        byType: [
          { type: 'Компьютеры', count: 89, operational: 84 },
          { type: 'Принтеры', count: 23, operational: 22 },
          { type: 'Серверы', count: 8, operational: 8 },
          { type: 'Сетевое', count: 36, operational: 34 }
        ],
        maintenance: {
          nextScheduled: '2024-01-20',
          overdue: 2,
          critical: 1
        }
      }
    },
    size: 'sm',
    position: 9,
    removable: true,
    glowColor: COLORS.cyan,
    category: 'Инфраструктура',
    lastUpdated: '2024-01-14T16:45:00Z'
  },
  {
    id: 'projects',
    type: 'list',
    title: '🚀 Активные проекты',
    content: {
      value: 8,
      description: 'Количество активных проектов развития',
      trend: 'up',
      items: [
        'Цифровизация услуг - 75%',
        'Обновление базы данных - 60%',
        'Мобильное приложение - 45%',
        'Автоматизация отчетности - 90%',
        'Обучение персонала - 30%'
      ],
      projectDetails: [
        { name: 'Цифровизация услуг', progress: 75, deadline: '2024-12-31', team: 5, budget: 2500000 },
        { name: 'Обновление БД', progress: 60, deadline: '2024-11-15', team: 3, budget: 1200000 },
        { name: 'Мобильное приложение', progress: 45, deadline: '2025-02-28', team: 4, budget: 1800000 },
        { name: 'Автоматизация отчетности', progress: 90, deadline: '2024-10-30', team: 2, budget: 800000 }
      ]
    },
    size: 'md',
    position: 10,
    removable: true,
    glowColor: COLORS.purple,
    category: 'Проекты',
    lastUpdated: '2024-01-15T11:20:00Z'
  },
  {
    id: 'satisfaction',
    type: 'chart',
    title: '😊 Удовлетворенность клиентов',
    content: {
      value: 4.8,
      description: 'Средняя оценка качества предоставляемых услуг',
      trend: 'up',
      chartData: [
        { name: '5 звезд', value: 65, color: COLORS.success },
        { name: '4 звезды', value: 25, color: COLORS.info },
        { name: '3 звезды', value: 8, color: COLORS.warning },
        { name: '2 звезды', value: 2, color: COLORS.orange },
        { name: '1 звезда', value: 0, color: COLORS.error }
      ],
      feedbackDetails: {
        total: 1247,
        byService: [
          { service: 'Соц. сопровождение', rating: 4.9, count: 456 },
          { service: 'Медицинский уход', rating: 4.7, count: 289 },
          { service: 'Юридические консультации', rating: 4.8, count: 312 },
          { service: 'Психологическая помощь', rating: 4.6, count: 190 }
        ],
        trends: {
          monthly: [4.5, 4.6, 4.7, 4.75, 4.8],
          quarterly: [4.4, 4.6, 4.7, 4.8]
        }
      }
    },
    size: 'sm',
    position: 12,
    removable: true,
    glowColor: COLORS.amber,
    category: 'Качество',
    lastUpdated: '2024-01-14T18:30:00Z'
  },
  // Новые дополнительные карточки
  {
    id: 'budget',
    type: 'stats',
    title: '💰 Бюджет и финансы',
    content: {
      value: 82,
      description: 'Исполнение бюджета по статьям расходов',
      trend: 'up',
      stats: [
        { label: 'Заработная плата', value: 95, change: 2, target: 95 },
        { label: 'Оборудование', value: 78, change: -5, target: 85 },
        { label: 'Обучение', value: 65, change: 15, target: 70 }
      ],
      budgetDetails: {
        total: 45000000,
        spent: 36900000,
        remaining: 8100000,
        byCategory: [
          { category: 'Зарплаты', allocated: 25000000, spent: 23750000 },
          { category: 'Оборудование', allocated: 8000000, spent: 6240000 },
          { category: 'Обучение', allocated: 3000000, spent: 1950000 },
          { category: 'Хоз. расходы', allocated: 9000000, spent: 4950000 }
        ]
      }
    },
    size: 'md',
    position: 13,
    removable: true,
    glowColor: COLORS.emerald,
    category: 'Финансы',
    lastUpdated: '2024-01-15T14:00:00Z'
  },
  {
    id: 'staff',
    type: 'kpi',
    title: '👥 Персонал',
    content: {
      value: 87,
      description: 'Сотрудников в организации',
      trend: 'stable',
      details: 'Из них 12 руководителей подразделений',
      unit: 'чел.',
      target: 90
    },
    size: 'sm',
    position: 14,
    removable: true,
    glowColor: COLORS.indigo,
    category: 'Персонал',
    lastUpdated: '2024-01-15T08:30:00Z'
  },
  {
    id: 'quality',
    type: 'progress',
    title: '🎯 Качество услуг',
    content: {
      value: 91,
      description: 'Общий показатель качества предоставляемых услуг',
      trend: 'up',
      items: [
        { label: 'Своевременность', value: 94, target: 95 },
        { label: 'Полнота услуг', value: 89, target: 90 },
        { label: 'Проф. компетенции', value: 93, target: 92 },
        { label: 'Доступность', value: 88, target: 90 }
      ],
      qualityMetrics: {
        complaints: 23,
        appeals: 12,
        positiveFeedback: 456,
        improvementAreas: ['Документооборот', 'Время ответа', 'Доступность информации']
      }
    },
    size: 'lg',
    position: 15,
    removable: true,
    glowColor: COLORS.blue,
    category: 'Качество',
    lastUpdated: '2024-01-15T16:45:00Z'
  },
  {
    id: 'digital',
    type: 'chart',
    title: '💻 Цифровизация',
    content: {
      value: 67,
      description: 'Уровень цифровой трансформации услуг',
      trend: 'up',
      chartData: [
        { name: 'Внедрено', value: 67, color: COLORS.success },
        { name: 'В процессе', value: 23, color: COLORS.warning },
        { name: 'Планируется', value: 10, color: COLORS.info }
      ],
      digitalProjects: [
        { name: 'Электронная запись', progress: 100, impact: 'high' },
        { name: 'Личные кабинеты', progress: 85, impact: 'high' },
        { name: 'Мобильное приложение', progress: 45, impact: 'medium' },
        { name: 'ИИ-аналитика', progress: 25, impact: 'low' }
      ]
    },
    size: 'sm',
    position: 16,
    removable: true,
    glowColor: COLORS.purple,
    category: 'Инновации',
    lastUpdated: '2024-01-14T12:20:00Z'
  },
  {
    id: 'partners',
    type: 'list',
    title: '🤝 Партнеры',
    content: {
      value: 24,
      description: 'Количество организаций-партнеров',
      trend: 'up',
      items: [
        'Департамент соц. защиты - Активно',
        'Медицинский центр №1 - Активно',
        'Юридическая клиника - На паузе',
        'Центр занятости - Активно',
        'Образовательный центр - Новый'
      ],
      partnerDetails: [
        { name: 'Департамент соц. защиты', status: 'active', projects: 5, since: '2020' },
        { name: 'Медицинский центр №1', status: 'active', projects: 3, since: '2021' },
        { name: 'Юридическая клиника', status: 'paused', projects: 2, since: '2022' },
        { name: 'Центр занятости', status: 'active', projects: 4, since: '2019' }
      ]
    },
    size: 'md',
    position: 17,
    removable: true,
    glowColor: COLORS.teal,
    category: 'Партнеры',
    lastUpdated: '2024-01-13T10:15:00Z'
  }
];

const LAYOUT_STORAGE_KEY = 'social-owner-dashboard-layout-v5';

// Утилиты
const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
  return trend === 'up' ? COLORS.success : trend === 'down' ? COLORS.error : COLORS.gray;
};

const getTrendLabel = (trend: 'up' | 'down' | 'stable') => {
  return trend === 'up' ? 'Рост' : trend === 'down' ? 'Снижение' : 'Стабильно';
};

const getAlertColor = (type: Alert['type']) => {
  return {
    warning: COLORS.warning,
    info: COLORS.info,
    success: COLORS.success,
    error: COLORS.error
  }[type];
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

// Улучшенный компонент для круговой диаграммы
const PieChart = ({ 
  data, 
  size = 80, 
  className = '',
  showLabels = false,
  strokeWidth = 20 
}: { 
  data: { name: string; value: number; color: string }[]; 
  size?: number; 
  className?: string;
  showLabels?: boolean;
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
          {showLabels && (
            <div className="text-white/60 text-xs">Всего</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Улучшенный компонент прогресс-бара
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
        <div className="flex justify-between text-white/60 mb-2">
          <span className={`${textSize} truncate flex-1 mr-2`}>{label}</span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`font-medium ${textSize}`}>{value}%</span>
            {showTarget && target && (
              <span className="text-white/40 text-xs">из {target}%</span>
            )}
          </div>
        </div>
      )}
      <div className={`w-full bg-white/10 rounded-full ${height} overflow-hidden relative`}>
        <div 
          className={`${height} rounded-full transition-all duration-700 ease-out`}
          style={{ 
            width: `${Math.min(value, 100)}%`,
            backgroundColor: `rgb(${color})`,
            boxShadow: `0 0 8px rgba(${color}, 0.3)`
          }}
        />
      </div>
      {showTarget && target && value < target && (
        <div 
          className="w-0.5 h-3 bg-white/30 absolute -mt-3.5"
          style={{ marginLeft: `${target}%` }}
        />
      )}
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
    { key: 'md', label: 'M', tooltip: 'Средный (2x1)', icon: '▫▫' },
    { key: 'lg', label: 'L', tooltip: 'Большой (2x2)', icon: '◼' },
    { key: 'xl', label: 'XL', tooltip: 'Расширенный (4x2)', icon: '◼◼' }
  ].filter(size => availableSizes.includes(size.key));

  return (
    <div className="flex items-center gap-1 flex-wrap justify-end">
      {sizes.map((size) => (
        <motion.button
          key={size.key}
          className={`w-7 h-7 xs:w-8 xs:h-8 rounded-lg flex items-center justify-center text-xs font-semibold border transition-all duration-200 ${
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

// Улучшенный Bento Card компонент
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

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
        min-h-[140px] xs:min-h-[160px] sm:min-h-[180px]
        ${className}
      `}
      style={{
        '--x': `${mousePosition.x}%`,
        '--y': `${mousePosition.y}%`,
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      whileHover={isEditing && !isDragging ? { scale: 1.01, y: -2 } : {}}
      whileTap={isEditing ? { scale: 0.98 } : {}}
    >
      {/* Dynamic glow effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at var(--x) var(--y), rgba(${glowColor},0.1), transparent 40%)`
        }}
      />

      {/* Editing controls */}
      {(isEditing && (onSizeChange || onRemove)) && (
        <div className="absolute top-2 xs:top-3 right-2 xs:right-3 z-40 flex flex-col items-end gap-2 pointer-events-none">
          {onSizeChange && (
            <motion.div 
              className="bg-black/80 border border-white/20 rounded-xl px-2 xs:px-3 py-1 xs:py-2 shadow-2xl backdrop-blur-sm flex items-center gap-1 pointer-events-auto"
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
              className="pointer-events-auto flex items-center gap-1 xs:gap-2 text-xs font-semibold px-2 xs:px-3 py-1 xs:py-2 rounded-xl bg-red-500/90 border border-red-400/60 text-white shadow-lg hover:bg-red-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              title="Удалить карточку"
            >
              <span className="text-sm">✕</span>
              <span className="hidden xs:inline">Удалить</span>
            </motion.button>
          )}
        </div>
      )}

      {/* Size indicator in editing mode */}
      {isEditing && (
        <motion.div 
          className="absolute top-2 xs:top-3 left-2 xs:left-3 z-30"
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
          className="absolute bottom-2 xs:bottom-3 right-2 xs:right-3 z-30 text-white/40 hover:text-white/60 transition-colors cursor-grab active:cursor-grabbing"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="text-lg">⠿</div>
        </motion.div>
      )}

      <div className="relative z-10 h-full">
        {children}
      </div>

      {/* Enhanced shine effect on hover */}
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
      className="relative rounded-2xl border-2 border-dashed border-white/20 bg-white/5 backdrop-blur-lg p-4 xs:p-6 flex flex-col items-center justify-center min-h-[140px] xs:min-h-[160px] cursor-pointer hover:bg-white/10 transition-all duration-300 group"
      whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.4)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onAdd}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="text-2xl xs:text-3xl text-white/40 mb-2 group-hover:text-white/60 transition-colors">+</div>
      <div className="text-white/60 text-xs xs:text-sm text-center group-hover:text-white/80 transition-colors px-2">
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

// Модальное окно деталей KPI
const KpiDetailModal = ({ 
  isOpen, 
  onClose, 
  data 
}: {
  isOpen: boolean;
  onClose: () => void;
  data: KpiDetailModalData;
}) => {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'quarter'>('month');

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const { kpi, history, breakdown } = data;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 xs:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-black rounded-2xl xs:rounded-3xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 xs:p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{kpi.icon}</div>
                <div>
                  <h2 className="text-lg xs:text-xl font-bold text-white">{kpi.label}</h2>
                  <p className="text-white/60 text-xs xs:text-sm">{kpi.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="p-4 xs:p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Основная метрика */}
              <div className="bg-white/5 rounded-2xl p-4 xs:p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-4">Основные показатели</h3>
                <div className="text-center mb-6">
                  <div className="text-4xl xs:text-5xl font-bold text-white mb-2">
                    {kpi.value}
                    {kpi.suffix && <span className="text-white/60 text-2xl ml-1">{kpi.suffix}</span>}
                  </div>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className={`px-3 py-1 rounded-full border ${
                      kpi.trend === 'up' ? 'bg-green-500/20 border-green-500/40 text-green-300' :
                      kpi.trend === 'down' ? 'bg-red-500/20 border-red-500/40 text-red-300' :
                      'bg-gray-500/20 border-gray-500/40 text-gray-300'
                    }`}>
                      {getTrendLabel(kpi.trend)}
                    </div>
                    {kpi.change && (
                      <div className="text-white/60">
                        {kpi.change > 0 ? '+' : ''}{kpi.change}% за период
                      </div>
                    )}
                  </div>
                </div>
                
                {kpi.target && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-white/60">
                      <span>Прогресс к цели</span>
                      <span>{Math.round((kpi.value / kpi.target) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-700"
                        style={{ 
                          width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%`,
                          backgroundColor: `rgb(${kpi.color || COLORS.blue})`
                        }}
                      />
                    </div>
                    <div className="text-center text-white/40 text-sm">
                      Цель: {kpi.target}{kpi.unit ? ` ${kpi.unit}` : kpi.suffix || ''}
                    </div>
                  </div>
                )}
              </div>

              {/* Детализация */}
              <div className="bg-white/5 rounded-2xl p-4 xs:p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-4">Детализация по категориям</h3>
                <div className="space-y-3">
                  {breakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white/80 text-sm">{item.category}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-semibold">{item.value}</span>
                        <span className="text-white/40 text-xs">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* История */}
              <div className="lg:col-span-2 bg-white/5 rounded-2xl p-4 xs:p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">История показателя</h3>
                  <div className="flex gap-1">
                  </div>
                </div>
                <div className="grid grid-cols-2 xs:grid-cols-4 gap-3">
                  {history.slice(0, 8).map((item, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3 text-center">
                      <div className="text-white/60 text-xs mb-1">{item.date}</div>
                      <div className="text-white font-semibold text-sm">{item.value}</div>
                      <div className="text-white/40 text-xs">из {item.target}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 xs:p-6 border-t border-white/10 bg-black/20">
            <div className="flex flex-col xs:flex-row gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-white/20 text-white/80 hover:bg-white/10 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Модальное окно деталей уведомления
const AlertDetailModal = ({ 
  isOpen, 
  onClose, 
  alert 
}: {
  isOpen: boolean;
  onClose: () => void;
  alert: Alert;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const alertColor = getAlertColor(alert.type);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 xs:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-black rounded-2xl xs:rounded-3xl border border-white/20 max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="p-4 xs:p-6 border-b"
            style={{ 
              borderColor: `rgba(${alertColor}, 0.3)`,
              background: `linear-gradient(135deg, rgba(${alertColor}, 0.1) 0%, transparent 50%)`
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: `rgb(${alertColor})` }}
                />
                <div>
                  <h2 className="text-lg xs:text-xl font-bold text-white">{alert.title}</h2>
                  <p className="text-white/60 text-xs xs:text-sm">{alert.time}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="p-4 xs:p-6 overflow-y-auto max-h-[50vh] custom-scrollbar">
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">{alert.message}</p>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-2 text-sm">Приоритет</h4>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: `rgb(${alertColor})` }}
                  />
                  <span className="text-white/80 text-sm capitalize">
                    {alert.priority === 'high' ? 'Высокий' : 
                     alert.priority === 'medium' ? 'Средний' : 'Низкий'}
                  </span>
                </div>
              </div>

              {alert.action && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-white font-semibold mb-2 text-sm">Рекомендуемое действие</h4>
                  <p className="text-white/80 text-sm mb-3">{alert.action}</p>
                  {alert.actionLink && (
                    <Link href={alert.actionLink}>
                      <button className="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors text-sm">
                        Перейти к выполнению
                      </button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 xs:p-6 border-t border-white/10 bg-black/20">
            <div className="flex flex-col xs:flex-row gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-white/20 text-white/80 hover:bg-white/10 transition-colors text-sm"
              >
                Закрыть
              </button>
              <button
                className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors text-sm"
              >
                Отметить как прочитанное
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Модальное окно выбора карточек
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
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 xs:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-black rounded-2xl xs:rounded-3xl border border-white/20 max-w-4xl w-full max-h-[85vh] xs:max-h-[80vh] overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 xs:p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-white truncate pr-2">
                Выберите карточку для добавления
              </h2>
              <button
                onClick={onClose}
                className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>
            <p className="text-white/60 text-xs xs:text-sm mt-2 truncate">
              Доступно {availableCards.length} карточек для добавления на дашборд
            </p>
          </div>
          
          <div className="p-4 xs:p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4">
              {availableCards.map((card) => (
                <motion.div
                  key={card.id}
                  className="bg-white/5 rounded-xl xs:rounded-2xl border border-white/10 p-3 xs:p-4 cursor-pointer hover:bg-white/10 transition-all duration-200 group"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectCard(card)}
                >
                  <div className="flex items-center gap-2 xs:gap-3 mb-2 xs:mb-3">
                    <div 
                      className="w-2 h-2 xs:w-3 xs:h-3 rounded-full group-hover:scale-110 transition-transform flex-shrink-0"
                      style={{ backgroundColor: `rgb(${card.glowColor})` }}
                    />
                    <span className="text-white font-semibold text-xs xs:text-sm truncate">
                      {card.title}
                    </span>
                  </div>
                  <p className="text-white/60 text-xs mb-2 xs:mb-3 line-clamp-2 leading-relaxed">
                    {card.content.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span className="truncate mr-2">{card.category}</span>
                    <span className="flex-shrink-0">{card.size.toUpperCase()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {availableCards.length === 0 && (
              <div className="text-center py-6 xs:py-8">
                <div className="text-3xl xs:text-4xl mb-3 xs:mb-4">🎉</div>
                <p className="text-white/60 text-sm xs:text-base">
                  Все доступные карточки уже добавлены на дашборд!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Улучшенный адаптивный контент для карточек
const AdaptiveCardContent = ({ card, onCardClick }: { card: DashboardCard; onCardClick?: () => void }) => {
  const renderContent = () => {
    const { size, type } = card;
    const content = card.content || {};
    const trendValue = content.trend || 'stable';
    
    switch (type) {
      case 'kpi': {
        const trendLabel = getTrendLabel(trendValue);
        const trendColor = getTrendColor(trendValue);

        if (size === 'sm') {
          return (
            <div className="p-3 xs:p-4 h-full flex flex-col gap-2 xs:gap-3 text-center justify-center">
              <div className="flex items-center justify-center gap-1 xs:gap-2 mb-1 xs:mb-2">
                <div className="text-xl xs:text-2xl sm:text-3xl font-bold text-white truncate">
                  {content.value}
                  {content.unit && <span className="text-white/60 text-sm xs:text-lg ml-0.5">{content.unit}</span>}
                </div>
              </div>
              <div className="text-white/70 text-xs xs:text-sm leading-snug line-clamp-2 px-1">
                {content.description}
              </div>
              <div
                className="text-[10px] xs:text-xs uppercase tracking-wide px-2 py-1 rounded-full border self-center mt-1"
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
            <div className="p-4 xs:p-6 h-full flex flex-col gap-3 xs:gap-4">
              <div className="text-center">
                <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white mb-1">
                  {content.value}
                  {content.unit && <span className="text-white/60 text-lg xs:text-xl ml-1">{content.unit}</span>}
                </div>
                <p className="text-white/70 text-sm xs:text-base px-2">{content.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 xs:gap-3 text-xs xs:text-sm text-white/70">
                <div className="bg-white/5 rounded-lg p-2 xs:p-3 border border-white/5">
                  <p className="text-white/50 mb-1 truncate">Статус</p>
                  <p 
                    className="font-semibold truncate"
                    style={{ color: `rgb(${trendColor})` }}
                  >
                    {trendLabel}
                  </p>
                </div>
                {content.details && (
                  <div className="bg-white/5 rounded-lg p-2 xs:p-3 border border-white/5">
                    <p className="text-white/50 mb-1 truncate">Контекст</p>
                    <p className="text-white/80 line-clamp-2 text-xs">{content.details}</p>
                  </div>
                )}
              </div>
            </div>
          );
        }

        return (
          <div className="p-4 xs:p-6 h-full flex flex-col">
            <div className="text-center mb-4 xs:mb-5">
              <div className="text-3xl xs:text-4xl sm:text-5xl font-bold text-white mb-2">
                {content.value}
                {content.unit && <span className="text-white/60 text-xl xs:text-2xl ml-2">{content.unit}</span>}
              </div>
              <div className="text-white/70 text-base xs:text-lg px-2">{content.description}</div>
            </div>
            
            <div className="flex-grow flex items-center justify-center text-white/50 text-sm xs:text-base bg-white/5 rounded-xl border border-white/10 mx-2 p-4 text-center">
              Расширенная аналитика доступна в детальном просмотре
            </div>
          </div>
        );
      }

      case 'progress': {
        return (
          <div className="p-3 xs:p-4 h-full flex flex-col">
            <div className="text-center mb-3 xs:mb-4">
              <div className="text-2xl xs:text-3xl font-bold text-white mb-1">{content.value}%</div>
              <p className="text-white/70 text-xs xs:text-sm px-2">{content.description}</p>
            </div>
            <div className="space-y-2 xs:space-y-3 flex-grow flex flex-col justify-center">
              {content.items?.map((item: any, index: number) => (
                <ProgressBar
                  key={index}
                  value={item.value}
                  label={item.label}
                  color={card.glowColor}
                  showTarget={true}
                  target={item.target}
                  size={size === 'sm' ? 'sm' : 'default'}
                />
              ))}
            </div>
          </div>
        );
      }

      case 'chart': {
        return (
          <div className="p-3 xs:p-4 h-full flex flex-col">
            <div className="text-center mb-3 xs:mb-4">
              <div className="text-2xl xs:text-3xl font-bold text-white mb-1">{content.value}%</div>
              <p className="text-white/70 text-xs xs:text-sm px-2">{content.description}</p>
            </div>
            <div className="flex-grow flex items-center justify-center">
              <PieChart 
                data={content.chartData} 
                size={size === 'sm' ? 60 : 80}
                strokeWidth={size === 'sm' ? 12 : 15}
              />
            </div>
          </div>
        );
      }

      case 'list': {
        return (
          <div className="p-3 xs:p-4 h-full flex flex-col">
            <div className="text-center mb-3 xs:mb-4">
              <div className="text-2xl xs:text-3xl font-bold text-white mb-1">{content.value}</div>
              <p className="text-white/70 text-xs xs:text-sm px-2">{content.description}</p>
            </div>
            <div className="flex-grow space-y-1 xs:space-y-2 overflow-y-auto custom-scrollbar">
              {content.items?.map((item: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-white/70 text-xs xs:text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'stats': {
        return (
          <div className="p-3 xs:p-4 h-full flex flex-col">
            <div className="text-center mb-3 xs:mb-4">
              <div className="text-2xl xs:text-3xl font-bold text-white mb-1">{content.value}%</div>
              <p className="text-white/70 text-xs xs:text-sm px-2">{content.description}</p>
            </div>
            <div className="flex-grow space-y-2 xs:space-y-3">
              {content.stats?.map((stat: any, index: number) => (
                <div key={index} className="bg-white/5 rounded-lg p-2 xs:p-3 border border-white/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/80 text-xs xs:text-sm truncate">{stat.label}</span>
                    <span className="text-white font-semibold text-xs xs:text-sm">{stat.value}{stat.label.includes('балл') ? '' : '%'}</span>
                  </div>
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Цель: {stat.target}%</span>
                    {stat.change !== 0 && (
                      <span className={stat.change > 0 ? 'text-green-400' : 'text-red-400'}>
                        {stat.change > 0 ? '+' : ''}{stat.change}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="p-4 xs:p-6 h-full flex items-center justify-center text-white/60">
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-sm xs:text-base">Контент для этого типа карточки</p>
              <p className="text-xs xs:text-sm">в разработке</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col" onClick={onCardClick}>
      <div className="flex items-start justify-between mb-2 xs:mb-3 p-3 xs:p-4 pb-0">
        <div className="min-w-0 flex-1 pr-2">
          <h3 className="text-white font-semibold text-sm xs:text-base truncate">
            {card.title}
          </h3>
          {card.lastUpdated && (
            <p className="text-white/40 text-xs mt-0.5 xs:mt-1 truncate">
              Обновлено: {formatRelativeTime(card.lastUpdated)}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex-grow min-h-0">
        {renderContent()}
      </div>

      <div className="flex justify-between items-center p-3 xs:p-4 pt-2">
        <div className="flex items-center gap-1 xs:gap-2 min-w-0">
          {card.category && (
            <span className="text-white/40 text-xs bg-white/5 px-2 py-1 rounded truncate">
              {card.category}
            </span>
          )}
        </div>
        
        <div 
          className="text-xs px-2 py-1 rounded-full border flex-shrink-0 ml-2"
          style={{
            backgroundColor: `rgba(${card.glowColor}, 0.2)`,
            color: `rgb(${card.glowColor})`,
            borderColor: `rgba(${card.glowColor}, 0.3)`
          }}
        >
          {(card.content?.trend || 'stable') === 'up' ? '↗' : 
           (card.content?.trend || 'stable') === 'down' ? '↘' : '→'}
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
  onSizeChange,
  onCardClick
}: { 
  card: DashboardCard; 
  isEditing: boolean;
  onRemove: () => void;
  onSizeChange: (size: CardSize) => void;
  onCardClick: () => void;
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
      className={`w-full ${getCardSizeClass(card.size)}`}
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
        onClick={onCardClick}
      >
        <AdaptiveCardContent card={card} onCardClick={onCardClick} />
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
      <div className="h-full flex flex-col justify-center items-center p-4 xs:p-6">
        <div className="text-white font-semibold text-sm mb-2 text-center truncate px-2 w-full">
          {card.title}
        </div>
        <div className="text-white/60 text-xs text-center">
          Перетаскивается...
        </div>
        <motion.div 
          className="mt-3 xs:mt-4 text-white/40"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ⠿
        </motion.div>
      </div>
    </BentoCard>
  );
};

// Улучшенный KPI виджет
function KPIWidget({ kpi, isEditing = false, onKpiClick }: { kpi: KPI; isEditing?: boolean; onKpiClick: () => void }) {
  const trendColor = kpi.color || getTrendColor(kpi.trend);
  const progress = kpi.target ? Math.min((kpi.value / kpi.target) * 100, 100) : 0;
  
  const content = (
    <motion.div 
      className="h-full flex flex-col justify-between p-3 xs:p-4"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onKpiClick}
    >
      <div className="flex items-start justify-between mb-2 xs:mb-3">
        <div className="text-lg xs:text-xl sm:text-2xl font-bold text-white leading-tight truncate pr-2">
          {kpi.value}
          {kpi.suffix && <span className="text-white/60 text-sm xs:text-lg ml-0.5">{kpi.suffix}</span>}
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div className="text-base xs:text-lg sm:text-xl">{kpi.icon}</div>
          {kpi.change && (
            <motion.div 
              className={`flex items-center gap-1 text-xs font-medium`}
              style={{ color: `rgb(${trendColor})` }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {kpi.trend === 'up' ? '↗' : kpi.trend === 'down' ? '↘' : '→'}
              {Math.abs(kpi.change)}%
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="space-y-1 xs:space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-white/80 text-xs xs:text-sm font-medium line-clamp-1 flex-1">
            {kpi.label}
          </span>
          {kpi.change && (
            <span 
              className="text-xs px-2 py-1 rounded-full border flex-shrink-0"
              style={{
                backgroundColor: `rgba(${trendColor}, 0.2)`,
                color: `rgb(${trendColor})`,
                borderColor: `rgba(${trendColor}, 0.3)`
              }}
            >
              {kpi.trend === 'up' ? 'Рост' : kpi.trend === 'down' ? 'Снижение' : 'Стабильно'}
            </span>
          )}
        </div>
        
        <div className="text-white/60 text-xs xs:text-sm line-clamp-2 leading-relaxed">
          {kpi.description}
        </div>
      </div>

      {kpi.target && (
        <div className="mt-2 xs:mt-3">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span className="truncate pr-2">Прогресс к цели</span>
            <span className="flex-shrink-0">{Math.round(progress)}%</span>
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
          <div className="text-white/40 text-xs mt-1 truncate">
            Цель: {kpi.target}{kpi.unit ? ` ${kpi.unit}` : kpi.suffix || ''}
          </div>
        </div>
      )}

      {isEditing && (
        <motion.div
          className="absolute top-1 xs:top-2 left-1 xs:left-2 w-2 h-2 xs:w-3 xs:h-3 bg-yellow-400 rounded-full shadow-sm"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );

  return (
    <BentoCard 
      className="h-full min-h-[120px] xs:min-h-[140px]"
      glowColor={trendColor}
      isEditing={isEditing}
      onClick={onKpiClick}
    >
      {content}
    </BentoCard>
  );
}

// Вспомогательные функции
const getCardSizeClass = (size: CardSize) => {
  const sizes = {
    sm: 'col-span-1',
    md: 'col-span-2 xs:col-span-1 md:col-span-2',
    lg: 'col-span-2 xs:col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2',
    xl: 'col-span-2 xs:col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-6 lg:row-span-2'
  };
  return sizes[size];
};

const isDashboardCard = (card: unknown): card is DashboardCard => {
  if (!card || typeof card !== 'object') {
    return false;
  }

  const candidate = card as Partial<DashboardCard>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.type === 'string' &&
    typeof candidate.size === 'string'
  );
};

// Основной компонент дашборда
export default function AdminDashboard() {
  const role = ROLES_CONFIG.admin;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [customCards, setCustomCards] = useState<DashboardCard[]>(() =>
    additionalCards.map((card) => ({ ...card }))
  );
  const [emptySlots, setEmptySlots] = useState<number[]>([]);
  const emptySlotIdRef = useRef(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLayoutHydrated, setIsLayoutHydrated] = useState(false);
  const [isCardPickerOpen, setIsCardPickerOpen] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(alerts.filter(alert => !alert.read).length);
  const [modal, setModal] = useState<ModalState>({ isOpen: false, type: null });

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
        const parsed = JSON.parse(storedLayout) as unknown;
        if (Array.isArray(parsed)) {
          const normalizedCards: DashboardCard[] = (parsed as unknown[])
            .filter(isDashboardCard)
            .map((card, index) => ({
              ...card,
              size: card.size || 'sm',
              position: typeof card.position === 'number' ? card.position : index + 1,
              glowColor: card.glowColor || COLORS.blue
            }));

          // Удаляем возможные дубликаты по id из сохраненной раскладки
          const uniqueCards = normalizedCards.filter((card, index, arr) => 
            arr.findIndex((c) => c.id === card.id) === index
          );

          if (uniqueCards.length) {
            setCustomCards(uniqueCards);
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
    () => additionalCards.filter(card => !customCards.some(existing => existing.id === card.id)),
    [customCards]
  );
  const hasAvailableCards = availableCards.length > 0;
  
  const kpiSummary = useMemo(() => {
    const positive = todayKPIs.filter((kpi) => kpi.trend === 'up').length;
    const negative = todayKPIs.filter((kpi) => kpi.trend === 'down').length;
    const stable = todayKPIs.length - positive - negative;
    const changeValues = todayKPIs.filter((kpi) => typeof kpi.change === 'number');
    const averageChange = changeValues.length
      ? Number(
          (
            changeValues.reduce((sum, kpi) => sum + (kpi.change || 0), 0) /
            changeValues.length
          ).toFixed(1)
        )
      : 0;
    const satisfaction = todayKPIs.find((kpi) => kpi.label === 'Удовлетворенность')?.value ?? 0;
    const responseTime = todayKPIs.find((kpi) => kpi.label === 'Среднее время ответа')?.value ?? 0;

    return {
      positive,
      negative,
      stable,
      averageChange,
      satisfaction,
      responseTime
    };
  }, []);

  const serviceSummary = useMemo(() => {
    if (!systemKPIs.length) {
      return {
        totalActive: 0,
        criticalServices: [] as KPI[],
        topService: null as KPI | null
      };
    }

    const totalActive = systemKPIs.reduce((acc, kpi) => acc + kpi.value, 0);
    const criticalServices = systemKPIs.filter((kpi) => kpi.trend === 'down');
    const topService = systemKPIs.reduce((prev, current) => (current.value > prev.value ? current : prev));

    return {
      totalActive,
      criticalServices,
      topService
    };
  }, []);
  
  const serviceTrend = useMemo(() => {
    const growing = systemKPIs.filter((kpi) => kpi.trend === 'up').length;
    const declining = systemKPIs.filter((kpi) => kpi.trend === 'down').length;
    const stable = systemKPIs.length - growing - declining;

    return { growing, declining, stable };
  }, []);
  
  const averageChangeColor = kpiSummary.averageChange >= 0 ? 'text-green-300' : 'text-red-300';

  // Функция для удаления карточки
  const removeCard = useCallback((cardId: string) => {
    setCustomCards(cards => cards.filter(card => card.id !== cardId));
    emptySlotIdRef.current += 1;
    setEmptySlots(slots => [...slots, emptySlotIdRef.current]);
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
    setCustomCards(additionalCards.map((card) => ({ ...card })));
    setEmptySlots([]);
    setActiveId(null);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(LAYOUT_STORAGE_KEY);
    }
  }, []);

  const markAllAlertsAsRead = useCallback(() => {
    setUnreadAlerts(0);
  }, []);

  // Функции для модальных окон
  const openKpiDetail = useCallback((kpi: KPI) => {
    // Мок данные для демонстрации
    const mockData: KpiDetailModalData = {
      kpi,
      timeframe: 'month',
      history: [
        { date: '1 янв', value: kpi.value * 4, target: kpi.target || kpi.value },
        { date: '8 янв', value: kpi.value * 30, target: kpi.target || kpi.value },
        { date: '15 янв', value: kpi.value * 1, target: kpi.target || kpi.value },
        { date: '22 янв', value: kpi.value * 2, target: kpi.target || kpi.value },
        { date: '29 янв', value: kpi.value, target: kpi.target || kpi.value },
      ],
      breakdown: [
        { category: 'Основные услуги', value: Math.round(kpi.value * 0.6), percentage: 60 },
        { category: 'Сопутствующие', value: Math.round(kpi.value * 0.25), percentage: 25 },
        { category: 'Специальные', value: Math.round(kpi.value * 0.15), percentage: 15 },
      ]
    };
    
    setModal({ isOpen: true, type: 'kpiDetail', data: mockData });
  }, []);

  const openAlertDetail = useCallback((alert: Alert) => {
    setModal({ isOpen: true, type: 'alertDetail', data: alert });
  }, []);

  const openCardDetail = useCallback((card: DashboardCard) => {
    setModal({ isOpen: true, type: 'cardDetail', data: card });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ isOpen: false, type: null });
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-12 h-12 xs:w-16 xs:h-16 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-3 xs:mb-4" />
          <p className="text-white/60 text-base xs:text-lg">Загрузка дашборда...</p>
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
        
        /* Блокировка прокрутки при открытом модальном окне */
        body.modal-open {
          overflow: hidden;
        }

        /* Улучшенная обработка длинного текста */
        .text-balance {
          text-wrap: balance;
        }
      `}</style>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 xs:px-4 lg:px-6 py-2 xs:py-4 lg:py-6">
        {/* Welcome Section */}
        <motion.section 
          className="mb-4 xs:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <BentoCard className="p-4 xs:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 xs:gap-4">
              <div className="flex-grow min-w-0">
                <h1 className="text-xl xs:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 xs:mb-2 leading-tight text-balance">
                  Панель управления социальными услугами
                </h1>
                <p className="text-white/60 text-sm xs:text-base lg:text-lg max-w-2xl truncate xs:text-clip">
                  {role.description} {isEditing && (
                    <span className="text-yellow-300 font-medium">• Режим редактирования активен</span>
                  )}
                </p>
              </div>
              <motion.div 
                className="flex items-center gap-2 px-3 xs:px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white flex-shrink-0 mt-2 xs:mt-0"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs xs:text-sm font-medium">Система активна</span>
              </motion.div>
            </div>
          </BentoCard>
        </motion.section>

        {/* Alerts Section */}
        <motion.section 
          className="mb-4 xs:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3 xs:mb-4">
            <h2 className="text-lg xs:text-xl font-semibold text-white truncate pr-2">
              Уведомления и напоминания
            </h2>
            {unreadAlerts > 0 && (
              <motion.button
                className="text-white/60 hover:text-white/80 text-xs xs:text-sm transition-colors whitespace-nowrap flex-shrink-0"
                onClick={markAllAlertsAsRead}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Отметить все как прочитанные
              </motion.button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
            {alerts.map((alert) => {
              const alertColor = getAlertColor(alert.type);
              return (
                <BentoCard 
                  key={alert.id}
                  className="p-3 xs:p-4 min-h-[90px] xs:min-h-[100px]"
                  glowColor={alertColor}
                  onClick={() => openAlertDetail(alert)}
                >
                  <motion.div 
                    className="h-full flex flex-col justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-start justify-between mb-1 xs:mb-2 gap-2">
                      <div className="font-medium text-xs xs:text-sm line-clamp-2 flex-grow min-w-0 text-white pr-2">
                        {alert.title}
                      </div>
                      {!alert.read && (
                        <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-red-500 rounded-full flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                    <div className="space-y-1 xs:space-y-2">
                      <p className="text-white/80 text-xs xs:text-sm line-clamp-2 leading-relaxed">
                        {alert.message}
                      </p>
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-1 xs:gap-2 min-w-0">
                          <div 
                            className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: `rgb(${alertColor})` }}
                          />
                          <div className="text-white/60 text-xs truncate">{alert.time}</div>
                        </div>
                        {alert.action && (
                          <div className="flex-shrink-0">
                            <span 
                              className="text-white/80 text-xs hover:text-white cursor-pointer transition-colors font-medium whitespace-nowrap"
                              style={{ color: `rgb(${alertColor})` }}
                            >
                              {alert.action} →
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </BentoCard>
              );
            })}
          </div>
        </motion.section>

        {/* Summary Section */}
        <motion.section 
          className="mb-4 xs:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 xs:gap-4">
            <BentoCard className="p-4 xs:p-6">
              <div className="flex items-start justify-between mb-4 xs:mb-6 gap-2">
                <div className="min-w-0">
                  <p className="text-white/60 text-xs xs:text-sm truncate">Сводка KPI</p>
                  <h3 className="text-white text-lg xs:text-xl font-semibold truncate">Динамика показателей</h3>
                </div>
                <span className={`text-xs px-2 xs:px-3 py-1 rounded-full border ${averageChangeColor} border-white/15 bg-black/20 whitespace-nowrap flex-shrink-0`}>
                  {kpiSummary.averageChange >= 0 ? 'Общий рост' : 'Снижение'} {kpiSummary.averageChange}%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 xs:gap-3 mb-4 xs:mb-6">
                <div className="p-2 xs:p-3 rounded-xl bg-white/5 border border-white/5 text-center hover:bg-white/10 transition-colors">
                  <div className="text-xl xs:text-2xl font-bold text-green-300">{kpiSummary.positive}</div>
                  <p className="text-white/60 text-xs mt-1">В росте</p>
                </div>
                <div className="p-2 xs:p-3 rounded-xl bg-white/5 border border-white/5 text-center hover:bg-white/10 transition-colors">
                  <div className="text-xl xs:text-2xl font-bold text-yellow-300">{kpiSummary.stable}</div>
                  <p className="text-white/60 text-xs mt-1">Стабильно</p>
                </div>
                <div className="p-2 xs:p-3 rounded-xl bg-white/5 border border-white/5 text-center hover:bg-white/10 transition-colors">
                  <div className="text-xl xs:text-2xl font-bold text-red-300">{kpiSummary.negative}</div>
                  <p className="text-white/60 text-xs mt-1">Снижение</p>
                </div>
              </div>
              <div className="space-y-2 xs:space-y-3 text-xs xs:text-sm text-white/70">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate">Среднее изменение</span>
                  <span className={`font-semibold ${averageChangeColor} whitespace-nowrap flex-shrink-0`}>
                    {kpiSummary.averageChange > 0 ? '+' : ''}{kpiSummary.averageChange}%
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate">Удовлетворенность</span>
                  <span className="font-semibold text-white whitespace-nowrap flex-shrink-0">{kpiSummary.satisfaction}%</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate">Среднее время ответа</span>
                  <span className="font-semibold text-white whitespace-nowrap flex-shrink-0">{kpiSummary.responseTime} дн.</span>
                </div>
              </div>
            </BentoCard>

            <BentoCard className="p-4 xs:p-6">
              <div className="flex items-start justify-between mb-4 xs:mb-6 gap-2">
                <div className="min-w-0">
                  <p className="text-white/60 text-xs xs:text-sm truncate">Операционные услуги</p>
                  <h3 className="text-white text-lg xs:text-xl font-semibold truncate">Загрузка направлений</h3>
                </div>
                <span className={`text-xs px-2 xs:px-3 py-1 rounded-full border ${
                  serviceSummary.criticalServices.length ? 'text-yellow-300 border-yellow-500/40' : 'text-emerald-300 border-emerald-400/40'
                } bg-black/20 whitespace-nowrap flex-shrink-0`}>
                  {serviceSummary.criticalServices.length ? 'Есть риски' : 'Стабильная работа'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 xs:gap-3 text-center mb-3 xs:mb-4">
                <div className="p-2 xs:p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-lg xs:text-xl font-bold text-white">{formatNumber(serviceSummary.totalActive)}</div>
                  <p className="text-white/60 text-xs mt-1">активных</p>
                </div>
                <div className="p-2 xs:p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-lg xs:text-xl font-bold text-green-300">{serviceTrend.growing}</div>
                  <p className="text-white/60 text-xs mt-1">растут</p>
                </div>
                <div className="p-2 xs:p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-lg xs:text-xl font-bold text-red-300">{serviceTrend.declining}</div>
                  <p className="text-white/60 text-xs mt-1">снижаются</p>
                </div>
              </div>
              <p className="text-xs text-white/50 mb-3 xs:mb-4 text-center">
                Стабильно работают {serviceTrend.stable} направлений
              </p>
              {serviceSummary.topService && (
                <div className="mb-3 xs:mb-4 text-left">
                  <p className="text-xs uppercase text-white/50 mb-1 truncate">Лидер нагрузки</p>
                  <div className="text-white font-semibold text-sm xs:text-base truncate">{serviceSummary.topService.label}</div>
                  <p className="text-white/60 text-xs xs:text-sm truncate">
                    {formatNumber(serviceSummary.topService.value)} активных случаев
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs uppercase text-white/50 mb-2 truncate">Зона внимания</p>
                {serviceSummary.criticalServices.length ? (
                  <div className="flex flex-wrap gap-1 xs:gap-2">
                    {serviceSummary.criticalServices.map((service) => (
                      <span
                        key={service.label}
                        className="text-xs px-2 py-1 rounded-full border border-red-500/40 text-red-200 bg-red-500/5 hover:bg-red-500/10 transition-colors truncate max-w-full"
                        title={service.label}
                      >
                        {service.label}: {service.value}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/60 text-xs xs:text-sm">
                    Все направления работают в штатном режиме
                  </p>
                )}
              </div>
            </BentoCard>
          </div>
        </motion.section>

        {/* Основные KPI */}
        <motion.section 
          className="mb-4 xs:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg xs:text-xl font-semibold text-white mb-3 xs:mb-4 truncate">
            Ключевые показатели эффективности
            {isEditing && <span className="text-yellow-300 text-xs xs:text-sm ml-1 xs:ml-2">• Зафиксированы</span>}
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 xs:gap-4">
            {todayKPIs.map((kpi, index) => (
              <KPIWidget key={index} kpi={kpi} isEditing={isEditing} onKpiClick={() => openKpiDetail(kpi)} />
            ))}
          </div>
        </motion.section>

        {/* Операционные показатели */}
        <motion.section 
          className="mb-6 xs:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg xs:text-xl font-semibold text-white mb-3 xs:mb-4 truncate">
            Операционные показатели услуг
            {isEditing && <span className="text-yellow-300 text-xs xs:text-sm ml-1 xs:ml-2">• Зафиксированы</span>}
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 xs:gap-4">
            {systemKPIs.map((kpi, index) => (
              <KPIWidget key={index} kpi={kpi} isEditing={isEditing} onKpiClick={() => openKpiDetail(kpi)} />
            ))}
          </div>
        </motion.section>

        {/* Кастомные карточки */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col gap-3 xs:gap-4 sm:flex-row sm:items-center sm:justify-between mb-4 xs:mb-6">
            <div className="min-w-0">
              <h2 className="text-lg xs:text-xl font-semibold text-white truncate">
                Дополнительные показатели
              </h2>
              {isEditing && (
                <p className="text-white/60 text-xs xs:text-sm mt-1 truncate">
                  Доступно карточек для добавления: {availableCards.length}
                </p>
              )}
            </div>
            {isEditing ? (
              <div className="flex flex-wrap items-center gap-2 xs:gap-3">
                <motion.button
                  className={`px-3 xs:px-4 py-2 rounded-full border text-xs xs:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
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
                  className="px-3 xs:px-4 py-2 rounded-full border text-xs xs:text-sm font-medium text-white/80 border-white/30 hover:bg-white/10 hover:border-white/40 transition-colors whitespace-nowrap"
                  onClick={resetLayout}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  ↺ Сбросить раскладку
                </motion.button>
                <motion.button
                  className={`px-3 xs:px-4 py-2 rounded-full backdrop-blur-lg border text-xs xs:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    isEditing 
                      ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300 shadow-lg shadow-yellow-500/25' 
                      : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:border-white/30'
                  }`}
                  onClick={toggleEditMode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isEditing ? (
                    <span className="flex items-center gap-1 xs:gap-2">
                      <span>✅</span>
                      Завершить редактирование
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 xs:gap-2">
                      <span>✏️</span>
                      Редактировать дашборд
                    </span>
                  )}
                </motion.button>
              </div>
            ) : (
              <motion.button
                className={`px-3 xs:px-4 py-2 rounded-full backdrop-blur-lg border text-xs xs:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  isEditing 
                    ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300 shadow-lg shadow-yellow-500/25' 
                    : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:border-white/30'
                }`}
                onClick={toggleEditMode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isEditing ? (
                  <span className="flex items-center gap-1 xs:gap-2">
                    <span>✅</span>
                    Завершить редактирование
                  </span>
                ) : (
                  <span className="flex items-center gap-1 xs:gap-2">
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
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 xs:gap-4 auto-rows-[minmax(200px,auto)]">
                {customCards.map((card) => (
                  <SortableCard
                    key={card.id}
                    card={card}
                    isEditing={isEditing}
                    onRemove={() => removeCard(card.id)}
                    onSizeChange={(newSize) => changeCardSize(card.id, newSize)}
                    onCardClick={() => openCardDetail(card)}
                  />
                ))}
                
                {/* Пустые слоты для добавления новых карточек */}
                {emptySlots.map((slotId) => (
                  <EmptyCardSlot key={`slot-${slotId}`} onAdd={addNewCard} isEditing={isEditing} />
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
              className="mt-3 xs:mt-4 p-3 xs:p-4 bg-white/5 rounded-2xl border border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="text-white font-semibold text-sm xs:text-base mb-2 xs:mb-3">Как управлять карточками:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 text-xs xs:text-sm text-white/60">
                <div className="space-y-2 xs:space-y-3">
                  <div className="flex items-center gap-2 xs:gap-3">
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <div className="w-5 h-5 xs:w-6 xs:h-6 rounded-lg bg-blue-500 border-2 border-blue-400 flex items-center justify-center text-xs text-white font-bold">▫</div>
                      <div className="w-5 h-5 xs:w-6 xs:h-6 rounded-lg bg-gray-800 border-2 border-gray-600 flex items-center justify-center text-xs text-gray-300">▫▫</div>
                      <div className="w-5 h-5 xs:w-6 xs:h-6 rounded-lg bg-gray-800 border-2 border-gray-600 flex items-center justify-center text-xs text-gray-300">◼</div>
                    </div>
                    <span className="flex-1">Нажмите на иконки размера для изменения</span>
                  </div>
                  <div className="flex items-center gap-2 xs:gap-3">
                    <div className="w-6 h-6 xs:w-8 xs:h-8 bg-red-500 rounded-lg flex items-center justify-center text-white text-xs transform flex-shrink-0">×</div>
                    <span className="flex-1">Наведите на карточку чтобы увидеть кнопку удаления</span>
                  </div>
                </div>
                <div className="space-y-2 xs:space-y-3">
                  <div className="flex items-center gap-2 xs:gap-3">
                    <div className="w-5 h-5 xs:w-6 xs:h-6 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-xs flex-shrink-0">⠿</div>
                    <span className="flex-1">Перетаскивайте карточки для изменения порядка</span>
                  </div>
                  <div className="flex items-center gap-2 xs:gap-3">
                    <div className="w-5 h-5 xs:w-6 xs:h-6 rounded-lg bg-white/5 border-2 border-dashed border-white/30 flex items-center justify-center text-xs flex-shrink-0">+</div>
                    <span className="flex-1">Добавляйте новые карточки из пустых слотов</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 xs:mt-3 p-2 xs:p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 text-xs xs:text-sm">
                  💡 Контент автоматически адаптируется под размер карточки - чем больше карточка, тем больше деталей!
                </p>
              </div>
            </motion.div>
          )}
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer 
        className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-8 xs:mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-3 xs:px-4 py-4 xs:py-6">
          <div className="flex flex-col xs:flex-row justify-between items-center gap-2 xs:gap-4 text-white/60 text-xs xs:text-sm">
            <div className="flex items-center gap-2 xs:gap-4 flex-wrap justify-center xs:justify-start">
              <span className="truncate">© 2024 Система управления социальными услугами</span>
              <span className="hidden xs:inline">•</span>
              <span className="hidden xs:inline truncate">Версия 2.1.0</span>
            </div>
            <div className="flex items-center gap-2 xs:gap-4 flex-wrap justify-center xs:justify-end">
              <span className="truncate">{customCards.length} активных карточек</span>
              <span>•</span>
              <span className="truncate">Обновлено: {formatRelativeTime(new Date().toISOString())}</span>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Модальные окна */}
      {modal.type === 'kpiDetail' && (
        <KpiDetailModal
          isOpen={modal.isOpen}
          onClose={closeModal}
          data={modal.data}
        />
      )}

      {modal.type === 'alertDetail' && (
        <AlertDetailModal
          isOpen={modal.isOpen}
          onClose={closeModal}
          alert={modal.data}
        />
      )}
    </div>
  );
}
