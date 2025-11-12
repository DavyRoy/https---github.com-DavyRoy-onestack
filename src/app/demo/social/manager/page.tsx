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
  verticalListSortingStrategy,
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

// Конфигурация ролей
const ROLES_CONFIG = {
  manager: {
    title: 'Менеджер социальных услуг',
    description: 'Управление заявками и координация услуг для граждан',
    icon: '👨‍💼',
    color: 'from-green-500 to-emerald-500',
    permissions: ['requests', 'citizens', 'services', 'volunteers', 'reports', 'profile']
  }
};

// Моки данных для менеджера социальных услуг
const todayKPIs: KPI[] = [
  { 
    label: "Новые заявки", 
    value: 24, 
    change: 8, 
    trend: 'up', 
    description: "Требуют первоначальной обработки", 
    icon: "🆕",
    color: COLORS.orange,
    target: 20,
    unit: 'заяв.'
  },
  { 
    label: "Заявки в работе", 
    value: 156, 
    change: -3, 
    trend: 'down', 
    description: "Текущие процессы обслуживания", 
    icon: "🔄",
    color: COLORS.blue,
    target: 150,
    unit: 'заяв.'
  },
  { 
    label: "На проверке", 
    value: 32, 
    change: 5, 
    trend: 'up', 
    description: "Ожидают подтверждения выполнения", 
    icon: "📋",
    color: COLORS.warning,
    target: 30,
    unit: 'заяв.'
  },
  { 
    label: "Завершённые", 
    value: 89, 
    change: 12, 
    trend: 'up', 
    description: "Успешно закрыто сегодня", 
    icon: "✅",
    color: COLORS.success,
    target: 80,
    unit: 'заяв.'
  },
  { 
    label: "Всего граждан", 
    value: 1568, 
    change: 45, 
    trend: 'up', 
    description: "В базе получателей услуг", 
    icon: "👥",
    color: COLORS.purple,
    target: 1500,
    unit: 'чел.'
  },
  { 
    label: "Активных волонтёров", 
    value: 23, 
    change: 3, 
    trend: 'up', 
    description: "На линии в текущий момент", 
    icon: "🤝",
    color: COLORS.emerald,
    target: 20,
    unit: 'вол.'
  },
];

const performanceKPIs: KPI[] = [
  { 
    label: "Среднее время реакции", 
    value: 2.4, 
    suffix: "ч", 
    change: -15, 
    trend: 'down', 
    description: "От создания до назначения", 
    icon: "⏱️",
    color: COLORS.cyan,
    target: 3,
    unit: 'ч'
  },
  { 
    label: "Выполнение SLA", 
    value: 96.7, 
    suffix: "%", 
    change: 2, 
    trend: 'up', 
    description: "Соответствие стандартам обслуживания", 
    icon: "🎯",
    color: COLORS.emerald,
    target: 95,
    unit: '%'
  },
  { 
    label: "Нагрузка команды", 
    value: 78, 
    suffix: "%", 
    change: 8, 
    trend: 'up', 
    description: "Загруженность волонтёров", 
    icon: "📊",
    color: COLORS.warning,
    target: 85,
    unit: '%'
  },
  { 
    label: "Удовлетворённость", 
    value: 4.7, 
    suffix: "/5", 
    change: 5, 
    trend: 'up', 
    description: "Средняя оценка качества", 
    icon: "⭐",
    color: COLORS.amber,
    target: 4.5,
    unit: 'балл'
  },
  { 
    label: "Повторные обращения", 
    value: 2.1, 
    suffix: "%", 
    change: -10, 
    trend: 'down', 
    description: "Низкий показатель", 
    icon: "🔄",
    color: COLORS.info,
    target: 3,
    unit: '%'
  },
  { 
    label: "Эффективность", 
    value: 87, 
    suffix: "%", 
    change: 5, 
    trend: 'up', 
    description: "Общая эффективность работы", 
    icon: "🚀",
    color: COLORS.purple,
    target: 85,
    unit: '%'
  },
];

// Напоминания и уведомления
const alerts: Alert[] = [
  { 
    id: '1', 
    type: 'warning', 
    title: 'Высокая нагрузка в Северном районе', 
    message: 'Превышен лимит заявок на 25%, требуется перераспределение волонтёров', 
    time: '15 мин назад', 
    priority: 'high',
    action: 'Перераспределить',
    actionLink: '/demo/social/manager/volunteers',
    read: false
  },
  { 
    id: '2', 
    type: 'info', 
    title: 'Новые волонтеры готовы к работе', 
    message: '3 новых волонтера прошли обучение и могут быть назначены на задачи', 
    time: '2 часа назад', 
    priority: 'medium',
    action: 'Назначить задачи',
    actionLink: '/demo/social/manager/volunteers',
    read: true
  },
  { 
    id: '3', 
    type: 'success', 
    title: 'Рекорд эффективности', 
    message: 'Команда волонтёров показала лучший результат за месяц - 98% выполненных заявок', 
    time: '1 день назад', 
    priority: 'low',
    read: true
  },
  { 
    id: '4', 
    type: 'error', 
    title: 'Просроченные заявки', 
    message: '5 заявок находятся в статусе просрочки более 24 часов', 
    time: '30 мин назад', 
    priority: 'high',
    action: 'Срочно обработать',
    actionLink: '/demo/social/manager/requests?overdue=true',
    read: false
  },
];

// Размеры карточек
const CARD_SIZES: Record<CardSize, { cols: number; rows: number; class: string; minHeight: string }> = {
  sm: { cols: 1, rows: 1, class: 'col-span-1', minHeight: 'min-h-[160px]' },
  md: { cols: 2, rows: 1, class: 'col-span-1 md:col-span-2', minHeight: 'min-h-[180px]' },
  lg: { cols: 2, rows: 2, class: 'col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2', minHeight: 'min-h-[320px]' },
  xl: { cols: 4, rows: 2, class: 'col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-6 lg:row-span-2', minHeight: 'min-h-[340px]' }
};

// Дополнительные карточки для менеджера
const additionalCards: DashboardCard[] = [
  {
    id: 'new-requests',
    type: 'kpi',
    title: '🆕 Новые заявки',
    content: {
      value: 24,
      description: 'Требуют первоначальной обработки и назначения',
      trend: 'up',
      details: 'Поступило за последние 24 часа',
      unit: 'заяв.',
      target: 20,
      priority: {
        high: 3,
        medium: 8,
        low: 13
      },
      distribution: [
        { type: 'Социальные услуги', count: 9 },
        { type: 'Медицинская помощь', count: 7 },
        { type: 'Бытовые услуги', count: 5 },
        { type: 'Юридические', count: 3 }
      ]
    },
    size: 'sm',
    position: 1,
    removable: true,
    glowColor: COLORS.orange,
    category: 'Заявки',
    lastUpdated: '2024-01-15T08:00:00Z'
  },
  {
    id: 'in-progress-requests',
    type: 'kpi',
    title: '🔄 В работе',
    content: {
      value: 156,
      description: 'Активные процессы обслуживания',
      trend: 'stable',
      details: 'Находятся на разных стадиях выполнения',
      unit: 'заяв.',
      target: 150,
      stages: [
        { stage: 'Назначено', count: 89 },
        { stage: 'В процессе', count: 45 },
        { stage: 'Ожидает', count: 22 }
      ],
      completion: 89
    },
    size: 'sm',
    position: 2,
    removable: true,
    glowColor: COLORS.blue,
    category: 'Заявки',
    lastUpdated: '2024-01-15T09:30:00Z'
  },
  {
    id: 'review-requests',
    type: 'kpi',
    title: '📋 На проверке',
    content: {
      value: 32,
      description: 'Ожидают подтверждения выполнения',
      trend: 'up',
      details: 'Требуют проверки качества',
      unit: 'заяв.',
      target: 30,
      waiting: {
        '24h': 8,
        '48h': 12,
        '72h': 12
      },
      checkTypes: [
        { type: 'Качество услуг', count: 18 },
        { type: 'Соответствие SLA', count: 9 },
        { type: 'Документация', count: 5 }
      ]
    },
    size: 'sm',
    position: 3,
    removable: true,
    glowColor: COLORS.warning,
    category: 'Заявки',
    lastUpdated: '2024-01-15T10:15:00Z'
  },
  {
    id: 'completed-requests',
    type: 'kpi',
    title: '✅ Завершённые',
    content: {
      value: 89,
      description: 'Успешно закрытые заявки сегодня',
      trend: 'up',
      details: 'Выполнено в установленные сроки',
      unit: 'заяв.',
      target: 80,
      satisfaction: 4.7,
      efficiency: 94,
      monthly: 1247
    },
    size: 'sm',
    position: 4,
    removable: true,
    glowColor: COLORS.success,
    category: 'Заявки',
    lastUpdated: '2024-01-15T11:00:00Z'
  },
  {
    id: 'all-citizens',
    type: 'kpi',
    title: '👥 Все граждане',
    content: {
      value: 1568,
      description: 'Полная база получателей услуг',
      trend: 'up',
      details: 'Зарегистрировано в системе',
      unit: 'чел.',
      target: 1500,
      active: 892,
      privileged: 567,
      new: 45
    },
    size: 'sm',
    position: 5,
    removable: true,
    glowColor: COLORS.purple,
    category: 'Граждане',
    lastUpdated: '2024-01-15T12:45:00Z'
  },
  {
    id: 'privileged-categories',
    type: 'kpi',
    title: '🎗️ Льготные категории',
    content: {
      value: 567,
      description: 'Граждане с особым статусом',
      trend: 'stable',
      details: '12 различных категорий льгот',
      unit: 'чел.',
      target: 550,
      categories: [
        { category: 'Инвалиды I группы', count: 123 },
        { category: 'Ветераны ВОВ', count: 89 },
        { category: 'Многодетные семьи', count: 156 },
        { category: 'Пенсионеры 80+', count: 98 }
      ]
    },
    size: 'sm',
    position: 6,
    removable: true,
    glowColor: COLORS.indigo,
    category: 'Граждане',
    lastUpdated: '2024-01-15T14:20:00Z'
  },
  {
    id: 'service-queue',
    type: 'progress',
    title: '⏳ Очередь на услуги',
    content: {
      value: 34,
      description: 'Ожидают назначения социальных услуг',
      trend: 'down',
      items: [
        { label: 'Социальное сопровождение', value: 12, target: 10 },
        { label: 'Медицинская помощь', value: 9, target: 8 },
        { label: 'Бытовые услуги', value: 8, target: 7 },
        { label: 'Юридические консультации', value: 5, target: 5 }
      ],
      detailedStats: {
        waitingTime: 2.1,
        targetTime: 1.5,
        forecast: {
          '24h': 18,
          '1-3d': 11,
          '3+d': 5
        }
      }
    },
    size: 'md',
    position: 7,
    removable: true,
    glowColor: COLORS.cyan,
    category: 'Граждане',
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: 'request-history',
    type: 'stats',
    title: '📊 История обращений',
    content: {
      value: 1247,
      description: 'Всего обращений за текущий период',
      trend: 'up',
      stats: [
        { label: 'Уникальных граждан', value: 892, change: 45, target: 850 },
        { label: 'Средняя оценка', value: 4.7, change: 0.2, target: 4.5 },
        { label: 'NPS индекс', value: 68, change: 8, target: 60 }
      ],
      detailedInfo: {
        byService: [
          { service: 'Социальные услуги', percentage: 36, count: 449 },
          { service: 'Медицинская помощь', percentage: 27, count: 337 },
          { service: 'Бытовые услуги', percentage: 18, count: 224 },
          { service: 'Юридические', percentage: 14, count: 175 },
          { service: 'Психологические', percentage: 5, count: 62 }
        ],
        topCitizens: [
          { name: 'Петров И.И.', requests: 23 },
          { name: 'Сидорова М.П.', requests: 19 },
          { name: 'Козлов В.С.', requests: 17 }
        ]
      }
    },
    size: 'sm',
    position: 8,
    removable: true,
    glowColor: COLORS.violet,
    category: 'Граждане',
    lastUpdated: '2024-01-15T09:15:00Z'
  },
  {
    id: 'all-services',
    type: 'chart',
    title: '🛠️ Все услуги',
    content: {
      value: 15,
      description: 'Активных направлений социальной помощи',
      trend: 'up',
      chartData: [
        { name: 'Социальные', value: 8, color: COLORS.blue },
        { name: 'Материальные', value: 4, color: COLORS.orange },
        { name: 'Консультации', value: 3, color: COLORS.green }
      ],
      serviceDetails: {
        total: 15,
        byType: [
          { type: 'Социальное сопровождение', active: true, volunteers: 15 },
          { type: 'Уход за пожилыми', active: true, volunteers: 12 },
          { type: 'Помощь инвалидам', active: true, volunteers: 10 },
          { type: 'Материальная помощь', active: true, volunteers: 8 },
          { type: 'Юридические консультации', active: true, volunteers: 5 }
        ],
        performance: {
          completion: 96.7,
          satisfaction: 4.7,
          coverage: 94
        }
      }
    },
    size: 'sm',
    position: 9,
    removable: true,
    glowColor: COLORS.blue,
    category: 'Услуги',
    lastUpdated: '2024-01-14T16:45:00Z'
  },
  {
    id: 'social-services',
    type: 'list',
    title: '🏠 Социальные услуги',
    content: {
      value: 8,
      description: 'Направления комплексной социальной поддержки',
      trend: 'up',
      items: [
        'Социальное сопровождение - 96% выполнения',
        'Уход за пожилыми - 94% качества',
        'Помощь инвалидам - 97% охвата',
        'Семейная поддержка - 89% эффективности',
        'Детские программы - 92% выполнения'
      ],
      serviceDetails: [
        { 
          name: 'Социальное сопровождение', 
          coverage: 95, 
          satisfaction: 4.8, 
          team: 23,
          budget: 1500000 
        },
        { 
          name: 'Уход за пожилыми', 
          coverage: 92, 
          satisfaction: 4.7, 
          team: 18,
          budget: 1200000 
        },
        { 
          name: 'Помощь инвалидам', 
          coverage: 97, 
          satisfaction: 4.9, 
          team: 15,
          budget: 1800000 
        }
      ]
    },
    size: 'md',
    position: 10,
    removable: true,
    glowColor: COLORS.teal,
    category: 'Услуги',
    lastUpdated: '2024-01-15T11:20:00Z'
  },
  {
    id: 'material-assistance',
    type: 'kpi',
    title: '💰 Материальная помощь',
    content: {
      value: 4,
      description: 'Программы финансовой и вещевой поддержки',
      trend: 'stable',
      details: 'Бюджет 1.2 млн рублей',
      programs: [
        { name: 'Единовременные выплаты', budget: 500000, beneficiaries: 89 },
        { name: 'Вещевая помощь', budget: 300000, beneficiaries: 67 },
        { name: 'Продуктовые наборы', budget: 250000, beneficiaries: 45 },
        { name: 'Средства реабилитации', budget: 150000, beneficiaries: 33 }
      ],
      quarterly: {
        spent: 845000,
        planned: 1200000,
        remaining: 355000
      }
    },
    size: 'sm',
    position: 11,
    removable: true,
    glowColor: COLORS.amber,
    category: 'Услуги',
    lastUpdated: '2024-01-15T08:00:00Z'
  },
  {
    id: 'all-volunteers',
    type: 'kpi',
    title: '👥 Все волонтёры',
    content: {
      value: 23,
      description: 'Активных добровольцев в системе',
      trend: 'up',
      details: '3 новых за последнюю неделю',
      unit: 'вол.',
      target: 20,
      new: 3,
      highLoad: 5,
      efficiency: 87
    },
    size: 'sm',
    position: 12,
    removable: true,
    glowColor: COLORS.emerald,
    category: 'Волонтёры',
    lastUpdated: '2024-01-14T18:30:00Z'
  },
  {
    id: 'work-schedule',
    type: 'progress',
    title: '📅 График работы',
    content: {
      value: 78,
      description: 'Оптимальное распределение смен волонтёров',
      trend: 'stable',
      items: [
        { label: 'Утренняя смена', value: 82, target: 85 },
        { label: 'Дневная смена', value: 78, target: 80 },
        { label: 'Вечерняя смена', value: 74, target: 75 }
      ],
      schedule: {
        shifts: [
          { time: '08:00-14:00', volunteers: 8, coverage: 85 },
          { time: '14:00-20:00', volunteers: 10, coverage: 92 },
          { time: '20:00-02:00', volunteers: 5, coverage: 78 }
        ],
        specialties: [
          { specialty: 'Социальные работники', count: 15 },
          { specialty: 'Психологи', count: 4 },
          { specialty: 'Юристы', count: 2 },
          { specialty: 'Медработники', count: 2 }
        ]
      }
    },
    size: 'sm',
    position: 13,
    removable: true,
    glowColor: COLORS.sky,
    category: 'Волонтёры',
    lastUpdated: '2024-01-15T07:45:00Z'
  },
  {
    id: 'daily-reports',
    type: 'list',
    title: '📊 Ежедневные отчёты',
    content: {
      value: 12,
      description: 'Оперативная отчётность за сегодня',
      trend: 'up',
      items: [
        'Отчёт по новым заявкам - готов',
        'Статистика выполнения - готов',
        'Анализ нагрузки волонтёров - готов',
        'Контроль качества услуг - в процессе',
        'Финансовый отчёт - готов'
      ],
      reportDetails: [
        { 
          name: 'Отчёт по заявкам', 
          status: 'ready', 
          frequency: 'daily',
          responsible: 'Иванов А.А.' 
        },
        { 
          name: 'Статистика услуг', 
          status: 'ready', 
          frequency: 'daily',
          responsible: 'Петрова М.П.' 
        },
        { 
          name: 'Анализ эффективности', 
          status: 'in_progress', 
          frequency: 'weekly',
          responsible: 'Сидоров В.С.' 
        }
      ]
    },
    size: 'sm',
    position: 14,
    removable: true,
    glowColor: COLORS.indigo,
    category: 'Отчётность',
    lastUpdated: '2024-01-14T14:20:00Z'
  },
  {
    id: 'service-statistics',
    type: 'chart',
    title: '📈 Статистика услуг',
    content: {
      value: 15,
      description: 'Ключевые метрики и показатели эффективности',
      trend: 'up',
      chartData: [
        { name: 'Выполнение SLA', value: 96.7, color: COLORS.success },
        { name: 'Удовлетворённость', value: 94, color: COLORS.amber },
        { name: 'Время реакции', value: 92, color: COLORS.cyan },
        { name: 'Охват услуг', value: 94, color: COLORS.blue }
      ],
      metrics: {
        tracked: 15,
        accuracy: 96,
        automation: 89,
        frequency: 'daily'
      }
    },
    size: 'sm',
    position: 15,
    removable: true,
    glowColor: COLORS.purple,
    category: 'Отчётность',
    lastUpdated: '2024-01-14T14:20:00Z'
  },
  {
    id: 'plan-performance',
    type: 'progress',
    title: '🎯 Выполнение планов',
    content: {
      value: 87,
      description: 'Контроль достижения целевых показателей',
      trend: 'up',
      items: [
        { label: 'Охват услуг', value: 104, target: 95 },
        { label: 'Удовлетворённость', value: 98, target: 95 },
        { label: 'Время реакции', value: 96, target: 95 },
        { label: 'Обучение волонтёров', value: 94, target: 90 }
      ],
      performance: {
        completed: 12,
        total: 15,
        quarterly: [84, 87, 89, 92],
        targets: [85, 87, 90, 95]
      }
    },
    size: 'sm',
    position: 16,
    removable: true,
    glowColor: COLORS.rose,
    category: 'Отчётность',
    lastUpdated: '2024-01-14T14:20:00Z'
  },
  {
    id: 'my-profile',
    type: 'kpi',
    title: '👤 Мой профиль',
    content: {
      value: 24,
      description: 'Активных задач в работе',
      trend: 'up',
      details: '5 высокого приоритета',
      unit: 'задач',
      target: 20,
      tasks: {
        high: 5,
        medium: 8,
        low: 11
      },
      performance: {
        efficiency: 87,
        productivity: 92,
        participation: 94
      }
    },
    size: 'sm',
    position: 17,
    removable: true,
    glowColor: COLORS.cyan,
    category: 'Профиль',
    lastUpdated: '2024-01-15T08:00:00Z'
  },
  {
    id: 'settings',
    type: 'list',
    title: '⚙️ Настройки',
    content: {
      value: 15,
      description: 'Персональные параметры системы',
      trend: 'stable',
      items: [
        'Уведомления и оповещения',
        'Интерфейс и темы оформления',
        'Безопасность и доступ',
        'Интеграции и API',
        'Отчёты и аналитика'
      ],
      settings: {
        notifications: {
          email: true,
          push: true,
          sms: false,
          telegram: true
        },
        personalization: {
          theme: 'dark',
          language: 'ru',
          timezone: 'UTC+3',
          dateFormat: 'DD.MM.YYYY'
        }
      }
    },
    size: 'sm',
    position: 18,
    removable: true,
    glowColor: COLORS.gray,
    category: 'Профиль',
    lastUpdated: '2024-01-15T08:00:00Z'
  },
  {
    id: 'my-tasks',
    type: 'stats',
    title: '📝 Мои задачи',
    content: {
      value: 24,
      description: 'Текущие рабочие задания и поручения',
      trend: 'up',
      stats: [
        { label: 'Высокий приоритет', value: 5, change: 2, target: 3 },
        { label: 'На сегодня', value: 8, change: 0, target: 10 },
        { label: 'Выполнено', value: 12, change: 4, target: 8 }
      ],
      taskDetails: {
        byDeadline: [
          { deadline: 'today', count: 8 },
          { deadline: 'week', count: 11 },
          { deadline: 'month', count: 5 }
        ],
        byType: [
          { type: 'От руководства', count: 6 },
          { type: 'Совместные', count: 8 },
          { type: 'Личные', count: 10 }
        ],
        performance: {
          completionTime: 2.4,
          onTime: 96,
          efficiency: 87
        }
      }
    },
    size: 'sm',
    position: 19,
    removable: true,
    glowColor: COLORS.lime,
    category: 'Профиль',
    lastUpdated: '2024-01-15T08:00:00Z'
  }
];

const LAYOUT_STORAGE_KEY = 'social-manager-dashboard-layout-v2';

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

// Компонент для круговой диаграммы
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
      {showTarget && target && value < target && (
        <div 
          className="w-0.5 h-3 bg-white/30 absolute -mt-3.5"
          style={{ marginLeft: `${target}%` }}
        />
      )}
    </div>
  );
};

// Компонент для линейного графика
const LineChart = ({ 
  data, 
  className = '',
  color = COLORS.blue,
  withDots = true,
  height = 60
}: { 
  data: number[]; 
  className?: string;
  color?: string;
  withDots?: boolean;
  height?: number;
}) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  
  return (
    <div className={`relative ${className}`} style={{ height: `${height}px` }}>
      <svg viewBox={`0 0 100 ${height}`} className="w-full h-full">
        {/* Background grid */}
        <line
          x1="0"
          y1={height * 0.25}
          x2="100"
          y2={height * 0.25}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
        />
        <line
          x1="0"
          y1={height * 0.5}
          x2="100"
          y2={height * 0.5}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
        />
        <line
          x1="0"
          y1={height * 0.75}
          x2="100"
          y2={height * 0.75}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
        />
        
        {/* Main line */}
        <polyline
          fill="none"
          stroke={`rgba(${color}, 0.8)`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={data.map((value, i) => 
            `${(i / (data.length - 1)) * 100},${height - ((value - minValue) / range) * (height - 10)}`
          ).join(' ')}
        />
        
        {/* Area under line */}
        <polygon
          fill={`rgba(${color}, 0.1)`}
          points={`
            0,${height} 
            ${data.map((value, i) => 
              `${(i / (data.length - 1)) * 100},${height - ((value - minValue) / range) * (height - 10)}`
            ).join(' ')}
            100,${height}
          `}
        />
        
        {withDots && data.map((value, i) => (
          <circle
            key={i}
            cx={(i / (data.length - 1)) * 100}
            cy={height - ((value - minValue) / range) * (height - 10)}
            r="2"
            fill={`rgb(${color})`}
            className="transition-all duration-300"
          />
        ))}
      </svg>
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

// Улучшенный Bento Card компонент с выбором размера
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
          
          <div className="p-6 overflow-y-auto max-h-[60vh]">
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
                  {content.value}
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
                  {content.value}
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

              {content.priority && (
                <div className="mt-auto">
                  <p className="text-white/60 text-xs mb-2">Приоритеты:</p>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded">Высокий: {content.priority.high}</span>
                    <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">Средний: {content.priority.medium}</span>
                    <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded">Низкий: {content.priority.low}</span>
                  </div>
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
                  {content.value}
                  {content.unit && <span className="text-white/60 text-2xl ml-2">{content.unit}</span>}
                </div>
                <div className="text-white/70 text-lg">{content.description}</div>
                {content.details && (
                  <p className="text-white/50 text-sm mt-2">{content.details}</p>
                )}
              </div>
              
              {content.distribution ? (
                <div className="flex-grow">
                  <h4 className="text-white font-semibold mb-4 text-base">Распределение:</h4>
                  <div className="space-y-3">
                    {content.distribution.slice(0, 4).map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm text-white/80 bg-white/5 border border-white/10 p-3 rounded-lg">
                        <span className="font-semibold truncate">{item.type}</span>
                        <span className="text-white/60 text-sm whitespace-nowrap ml-2">{item.count} заяв.</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex items-center justify-center text-white/50 text-sm bg-white/5 rounded-xl border border-white/10">
                  Детализация появится здесь при наличии данных
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
                  {content.value}
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
                      label={`Цель: ${content.target}${content.unit || ''}`}
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
            
            <div className="flex-1 space-y-4 bg-white/5 border border-white/10 rounded-2xl p-4 overflow-hidden">
              <h4 className="text-white font-semibold text-base mb-2">Расширенная детализация</h4>
              {content.distribution ? (
                <div className="space-y-3 max-h-64 pr-2 overflow-y-auto custom-scrollbar">
                  {content.distribution.slice(0, 6).map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between gap-3 text-sm bg-black/20 border border-white/5 rounded-xl px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium truncate">{item.type}</p>
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <p className="text-white text-sm">{item.count} заяв.</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white/60 text-sm text-center py-8">
                  Добавьте дополнительные данные, чтобы увидеть детальную аналитику.
                </div>
              )}
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
                <div className="text-2xl lg:text-3xl font-bold text-white">{content.value}</div>
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
                  {content.value}
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
                  {content.value}
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

              {content.detailedStats && (
                <div className="mt-auto">
                  <h4 className="text-white font-semibold mb-4 text-base">Дополнительная информация:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-white/70">
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-white/50 text-xs mb-1">Среднее время</p>
                      <p className="text-white font-semibold">{content.detailedStats.waitingTime} дн.</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-white/50 text-xs mb-1">Целевое время</p>
                      <p className="text-white font-semibold">{content.detailedStats.targetTime} дн.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }

        // XL size
        return (
          <div className="p-6 h-full grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-white/60 text-sm">Текущая ситуация</p>
                <div className="text-5xl font-bold text-white mt-1">{content.value}</div>
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
            
            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              {content.detailedStats && (
                <>
                  <h4 className="text-white font-semibold text-base">Прогноз выполнения</h4>
                  <div className="space-y-3">
                    {Object.entries(content.detailedStats.forecast || {}).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between items-center text-sm text-white/80">
                        <span>{key === '24h' ? '24 часа' : key === '1-3d' ? '1-3 дня' : 'Более 3 дней'}</span>
                        <span className="font-semibold">{value} чел.</span>
                      </div>
                    ))}
                  </div>
                  
                  {content.schedule && (
                    <div className="mt-4">
                      <h5 className="text-white font-semibold text-sm mb-3">Расписание смен</h5>
                      <div className="space-y-2">
                        {content.schedule.shifts.map((shift: any, index: number) => (
                          <div key={index} className="flex justify-between items-center text-xs text-white/70">
                            <span>{shift.time}</span>
                            <span>{shift.volunteers} вол. ({shift.coverage}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      }

      case 'chart': {
        const chartData = Array.isArray(content.chartData) ? content.chartData : [];
        const chartSize = size === 'sm' ? 80 : size === 'md' ? 110 : size === 'lg' ? 140 : 180;
        const leader = chartData[0];
        
        if (size === 'sm') {
          return (
            <div className="p-4 h-full flex flex-col justify-center items-center text-center gap-2">
              <div className="text-2xl lg:text-3xl font-bold text-white mb-2">
                {content.value}
              </div>
              <div className="text-white/60 text-sm text-center line-clamp-2">
                {content.description}
              </div>
              {leader && (
                <div className="text-white/50 text-xs">
                  Лидирует: <span className="text-white/80">{leader.name}</span>
                </div>
              )}
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
                <div className="text-white/60 text-base">
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
                      {item.name}: {item.value}
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
                <div className="text-white/60 text-lg">
                  {content.description}
                </div>
              </div>
              
              <div className="flex-grow flex items-center justify-center mb-6">
                <PieChart 
                  data={content.chartData} 
                  size={chartSize}
                  strokeWidth={18}
                  showLabels={true}
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
                    <span className="text-white/90 font-medium">{item.value}</span>
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
                <p className="text-white/60 text-sm">Общий показатель</p>
                <div className="text-5xl font-bold text-white mt-1">
                  {content.value}
                </div>
                <p className="text-white/70 text-base mt-2">{content.description}</p>
              </div>
              
              <PieChart 
                data={content.chartData} 
                size={chartSize}
                strokeWidth={16}
                showLabels={true}
              />
            </div>
            
            <div className="lg:col-span-3 space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                {chartData.map((item: any, index: number) => (
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
                        <p className="text-white/50 text-xs">Вклад в общий результат</p>
                      </div>
                    </div>
                    <div className="text-white text-lg font-semibold flex-shrink-0">{item.value}</div>
                  </div>
                ))}
              </div>
              
              {content.serviceDetails && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <h4 className="text-white font-semibold text-base mb-3">Детали услуг</h4>
                  <div className="grid gap-3">
                    {content.serviceDetails.byType?.slice(0, 3).map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm text-white/80">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{item.type}</p>
                          <p className="text-white/50 text-xs">Волонтёров: {item.volunteers}</p>
                        </div>
                        <div className="text-right whitespace-nowrap ml-4">
                          <p className={item.active ? 'text-green-400' : 'text-red-400'}>
                            {item.active ? 'Активна' : 'Неактивна'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                <div className="text-white/60 text-base">{content.description}</div>
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
                <div className="text-white/60 text-lg">
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

              {content.serviceDetails && (
                <div className="mt-auto">
                  <h4 className="text-white font-semibold mb-4 text-base">Детали услуг:</h4>
                  <div className="space-y-4">
                    {content.serviceDetails.slice(0, 3).map((service: any, index: number) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-white font-medium text-base truncate flex-1 mr-2">{service.name}</span>
                          <span className="text-green-400 text-base font-bold flex-shrink-0">{service.coverage}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                          <div 
                            className="h-2 rounded-full bg-green-500 transition-all duration-500 shadow-sm"
                            style={{ width: `${service.coverage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-white/60">
                          <span>Оценка: {service.satisfaction}/5</span>
                          <span>Команда: {service.team} чел.</span>
                        </div>
                        {service.budget && (
                          <div className="text-xs text-white/40 mt-2">
                            Бюджет: {formatCurrency(service.budget)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }

        // XL size
        return (
          <div className="p-6 h-full grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <p className="text-white/60 text-sm">Основные направления</p>
                <div className="text-5xl font-bold text-white mt-1">{content.value}</div>
                <p className="text-white/70 text-base mt-2">{content.description}</p>
              </div>
              
              <div className="space-y-3">
                {listItems.slice(0, 4).map((item: string, index: number) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-sm text-white/80 hover:bg-white/10 transition-colors">
                    <div className="text-white/40 text-xs mb-1">Направление #{index + 1}</div>
                    <p className="leading-relaxed line-clamp-2">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-3 space-y-4">
              {content.serviceDetails && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {content.serviceDetails.map((service: any, index: number) => (
                    <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="min-w-0 flex-1 mr-2">
                          <p className="text-white font-semibold truncate">{service.name}</p>
                          <p className="text-white/50 text-xs">Охват: {service.coverage}%</p>
                        </div>
                        <span className="text-green-400 font-bold text-xl flex-shrink-0">{service.satisfaction}/5</span>
                      </div>
                      
                      <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                        <div 
                          className="h-2 rounded-full bg-green-500 transition-all duration-500 shadow-sm"
                          style={{ width: `${service.coverage}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-white/60 text-xs">
                        <span>Команда: {service.team} чел.</span>
                        {service.budget && (
                          <span>Бюджет: {formatCurrency(service.budget)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {content.reportDetails && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <h4 className="text-white font-semibold text-base mb-3">Статус отчётов</h4>
                  <div className="grid gap-3 text-sm text-white/70">
                    {content.reportDetails.map((report: any, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-black/20 rounded-xl p-3">
                        <div>
                          <p className="text-white font-medium">{report.name}</p>
                          <p className="text-white/50 text-xs">Частота: {report.frequency === 'daily' ? 'ежедневно' : 'еженедельно'}</p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs ${
                          report.status === 'ready' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {report.status === 'ready' ? 'Готов' : 'В процессе'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              {statsList[0] && (
                <p className="text-white/40 text-xs">
                  {statsList[0].label}: {statsList[0].value}
                  {statsList[0].change && (
                    <span className={statsList[0].change > 0 ? 'text-green-400 ml-1' : 'text-red-400 ml-1'}>
                      {statsList[0].change > 0 ? '+' : ''}{statsList[0].change}
                    </span>
                  )}
                </p>
              )}
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
                <div className="text-white/60 text-base">
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
                <div className="text-white/60 text-lg">
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

              {content.detailedInfo && (
                <div className="mt-auto">
                  <h4 className="text-white font-semibold mb-4 text-base">Распределение по услугам:</h4>
                  <div className="space-y-3">
                    {content.detailedInfo.byService.slice(0, 4).map((service: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 text-sm text-white/70 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                        <div 
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: `rgb(${card.glowColor})` }}
                        />
                        <span className="truncate">{service.service}</span>
                        <span className="text-white/90 font-medium ml-auto">{service.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }

        // XL size
        return (
          <div className="p-6 h-full grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-white/60 text-sm">Общий показатель</p>
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
              {content.detailedInfo ? (
                <>
                  <h4 className="text-white font-semibold text-base">Детализация статистики</h4>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm text-white/70 mb-4">
                    <div className="bg-black/20 rounded-xl p-3">
                      <p className="text-white/50 text-xs">Уникальные граждане</p>
                      <p className="text-white text-xl font-semibold">{content.detailedInfo.uniqueCitizens}</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-3">
                      <p className="text-white/50 text-xs">Средняя оценка</p>
                      <p className="text-white text-xl font-semibold">{content.detailedInfo.averageRating}/5</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-white/60 text-sm mb-3">Топ граждан по обращениям</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                      {content.detailedInfo.topCitizens.map((citizen: any, index: number) => (
                        <div key={index} className="bg-black/20 rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-black/30 transition-colors">
                          {citizen.name} - {citizen.requests} обращений
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {content.taskDetails && (
                    <div className="mt-4">
                      <p className="text-white/60 text-sm mb-2">Распределение задач</p>
                      <div className="space-y-1">
                        {Object.entries(content.taskDetails.byDeadline || {}).map(([deadline, count]: [string, any]) => (
                          <div key={deadline} className="text-white/50 text-xs bg-black/20 rounded px-2 py-1">
                            • {deadline === 'today' ? 'На сегодня' : deadline === 'week' ? 'На неделю' : 'На месяц'}: {count} задач
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-white/60 text-sm text-center py-8">
                  Добавьте дополнительную информацию, чтобы увидеть расшифровку показателей.
                </div>
              )}
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

// Компонент KPI виджета (без переходов по ссылкам)
function KPIWidget({ kpi, isEditing = false }: { kpi: KPI; isEditing?: boolean }) {
  const trendColor = kpi.color || getTrendColor(kpi.trend);
  const progress = kpi.target ? Math.min((kpi.value / kpi.target) * 100, 100) : 0;
  
  const content = (
    <motion.div 
      className="h-full flex flex-col justify-between p-4"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-xl lg:text-2xl font-bold text-white leading-tight">
          {kpi.value}
          {kpi.suffix && <span className="text-white/60 text-lg ml-0.5">{kpi.suffix}</span>}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-lg lg:text-xl">{kpi.icon}</div>
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
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-sm font-medium line-clamp-1 flex-1 mr-2">
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
        
        <div className="text-white/60 text-sm line-clamp-2 leading-relaxed">
          {kpi.description}
        </div>
      </div>

      {kpi.target && (
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
            Цель: {kpi.target}{kpi.unit ? ` ${kpi.unit}` : kpi.suffix || ''}
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

// Основной компонент дашборда
export default function ManagerDashboard() {
  const role = ROLES_CONFIG.manager;
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [customCards, setCustomCards] = useState<DashboardCard[]>(() =>
    additionalCards.map((card) => ({ ...card }))
  );
  const [emptySlots, setEmptySlots] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLayoutHydrated, setIsLayoutHydrated] = useState(false);
  const [isCardPickerOpen, setIsCardPickerOpen] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(alerts.filter(alert => !alert.read).length);

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
    const satisfaction = todayKPIs.find((kpi) => kpi.label === 'Удовлетворённость')?.value ?? 0;
    const responseTime = todayKPIs.find((kpi) => kpi.label === 'Среднее время реакции')?.value ?? 0;

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
    if (!performanceKPIs.length) {
      return {
        totalActive: 0,
        criticalServices: [] as KPI[],
        topService: null as KPI | null
      };
    }

    const totalActive = performanceKPIs.reduce((acc, kpi) => acc + (typeof kpi.value === 'number' ? kpi.value : 0), 0);
    const criticalServices = performanceKPIs.filter((kpi) => kpi.trend === 'down');
    const topService = performanceKPIs.reduce((prev, current) => (current.value > prev.value ? current : prev));

    return {
      totalActive,
      criticalServices,
      topService
    };
  }, []);
  
  const serviceTrend = useMemo(() => {
    const growing = performanceKPIs.filter((kpi) => kpi.trend === 'up').length;
    const declining = performanceKPIs.filter((kpi) => kpi.trend === 'down').length;
    const stable = performanceKPIs.length - growing - declining;

    return { growing, declining, stable };
  }, []);
  
  const averageChangeColor = kpiSummary.averageChange >= 0 ? 'text-green-300' : 'text-red-300';

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
          <p className="text-white/60 text-lg">Загрузка дашборда...</p>
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

      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-white/60 text-xs sm:text-sm text-right">
                <div className="hidden xs:block">{currentDate}</div>
                <div>{currentTime}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Счетчик непрочитанных уведомлений */}
              {unreadAlerts > 0 && (
                <motion.div
                  className="relative"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full absolute -top-1 -right-1 animate-ping" />
                  <div className="w-2 h-2 bg-red-500 rounded-full absolute -top-1 -right-1" />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.header>

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
                  Панель управления менеджера социальных услуг
                </h1>
                <p className="text-white/60 text-base lg:text-lg max-w-2xl">
                  {role.description} {isEditing && (
                    <span className="text-yellow-300 font-medium">• Режим редактирования активен</span>
                  )}
                </p>
              </div>
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white flex-shrink-0"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium">Система активна</span>
              </motion.div>
            </div>
          </BentoCard>
        </motion.section>

        {/* Alerts Section - Фиксированные уведомления */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              Уведомления и напоминания
            </h2>
            {unreadAlerts > 0 && (
              <motion.button
                className="text-white/60 hover:text-white/80 text-sm transition-colors"
                onClick={markAllAlertsAsRead}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Отметить все как прочитанные
              </motion.button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {alerts.map((alert) => {
              const alertColor = getAlertColor(alert.type);
              return (
                <BentoCard 
                  key={alert.id}
                  className="p-4 min-h-[100px]"
                  glowColor={alertColor}
                >
                  <motion.div 
                    className="h-full flex flex-col justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <div className="font-medium text-sm line-clamp-2 flex-grow min-w-0 text-white">
                        {alert.title}
                      </div>
                      {!alert.read && (
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-white/80 text-sm line-clamp-2">{alert.message}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: `rgb(${alertColor})` }}
                          />
                          <div className="text-white/60 text-xs">{alert.time}</div>
                        </div>
                        {alert.action && (
                          <Link href={alert.actionLink || '#'}>
                            <span 
                              className="text-white/80 text-xs hover:text-white cursor-pointer transition-colors font-medium"
                              style={{ color: `rgb(${alertColor})` }}
                            >
                              {alert.action} →
                            </span>
                          </Link>
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
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BentoCard className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-white/60 text-sm">Сводка KPI</p>
                  <h3 className="text-white text-xl font-semibold">Динамика показателей</h3>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border ${averageChangeColor} border-white/15 bg-black/20`}>
                  {kpiSummary.averageChange >= 0 ? 'Общий рост' : 'Снижение'} {kpiSummary.averageChange}%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center hover:bg-white/10 transition-colors">
                  <div className="text-2xl font-bold text-green-300">{kpiSummary.positive}</div>
                  <p className="text-xs text-white/60 mt-1">В росте</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center hover:bg-white/10 transition-colors">
                  <div className="text-2xl font-bold text-yellow-300">{kpiSummary.stable}</div>
                  <p className="text-xs text-white/60 mt-1">Стабильно</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center hover:bg-white/10 transition-colors">
                  <div className="text-2xl font-bold text-red-300">{kpiSummary.negative}</div>
                  <p className="text-xs text-white/60 mt-1">Снижение</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-white/70">
                <div className="flex items-center justify-between">
                  <span>Среднее изменение</span>
                  <span className={`font-semibold ${averageChangeColor}`}>
                    {kpiSummary.averageChange > 0 ? '+' : ''}{kpiSummary.averageChange}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Удовлетворённость</span>
                  <span className="font-semibold text-white">{kpiSummary.satisfaction}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Среднее время реакции</span>
                  <span className="font-semibold text-white">{kpiSummary.responseTime} ч.</span>
                </div>
              </div>
            </BentoCard>

            <BentoCard className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-white/60 text-sm">Эффективность работы</p>
                  <h3 className="text-white text-xl font-semibold">Показатели качества</h3>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border ${
                  serviceSummary.criticalServices.length ? 'text-yellow-300 border-yellow-500/40' : 'text-emerald-300 border-emerald-400/40'
                } bg-black/20`}>
                  {serviceSummary.criticalServices.length ? 'Есть риски' : 'Стабильная работа'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center mb-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-xl font-bold text-white">{formatNumber(serviceSummary.totalActive)}</div>
                  <p className="text-xs text-white/60 mt-1">показателей</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-xl font-bold text-green-300">{serviceTrend.growing}</div>
                  <p className="text-xs text-white/60 mt-1">растут</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-xl font-bold text-red-300">{serviceTrend.declining}</div>
                  <p className="text-xs text-white/60 mt-1">снижаются</p>
                </div>
              </div>
              <p className="text-xs text-white/50 mb-4">
                Стабильно работают {serviceTrend.stable} показателей
              </p>
              {serviceSummary.topService && (
                <div className="mb-4 text-left">
                  <p className="text-xs uppercase text-white/50 mb-1">Лучший показатель</p>
                  <div className="text-white font-semibold">{serviceSummary.topService.label}</div>
                  <p className="text-white/60 text-sm">
                    {serviceSummary.topService.value}{serviceSummary.topService.suffix}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs uppercase text-white/50 mb-2">Зона внимания</p>
                {serviceSummary.criticalServices.length ? (
                  <div className="flex flex-wrap gap-2">
                    {serviceSummary.criticalServices.map((service) => (
                      <span
                        key={service.label}
                        className="text-xs px-3 py-1 rounded-full border border-red-500/40 text-red-200 bg-red-500/5 hover:bg-red-500/10 transition-colors"
                      >
                        {service.label}: {service.value}{service.suffix}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/60 text-sm">Все показатели работают в штатном режиме</p>
                )}
              </div>
            </BentoCard>
          </div>
        </motion.section>

        {/* Основные KPI - Фиксированные показатели (без переходов) */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Работа с заявками
            {isEditing && <span className="text-yellow-300 text-sm ml-2">• Зафиксированы</span>}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {todayKPIs.map((kpi, index) => (
              <KPIWidget key={index} kpi={kpi} isEditing={isEditing} />
            ))}
          </div>
        </motion.section>

        {/* Показатели эффективности - Фиксированные показатели (без переходов) */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Показатели эффективности
            {isEditing && <span className="text-yellow-300 text-sm ml-2">• Зафиксированы</span>}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {performanceKPIs.map((kpi, index) => (
              <KPIWidget key={index} kpi={kpi} isEditing={isEditing} />
            ))}
          </div>
        </motion.section>

        {/* Кастомные карточки с возможностью редактирования и перетаскивания */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Дополнительные показатели
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

      {/* Footer */}
      <motion.footer 
        className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-white/60 text-sm">
            <div className="flex items-center gap-4">
              <span>© 2024 Система управления социальными услугами</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Версия 2.1.0</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{customCards.length} активных карточек</span>
              <span>•</span>
              <span>Обновлено: {formatRelativeTime(new Date().toISOString())}</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}