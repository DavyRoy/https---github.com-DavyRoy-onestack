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
  history?: number[];
  details?: {
    completed?: number;
    pending?: number;
    inProgress?: number;
  };
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
  icon?: string;
}

type CardSize = 'sm' | 'md' | 'lg' | 'xl';
type CardType = 'kpi' | 'chart' | 'progress' | 'list' | 'stats' | 'table' | 'timeline' | 'map';

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
  pinned?: boolean;
  favorite?: boolean;
}

// Типы для модальных окон
type ModalType = 'requests' | 'citizens' | 'volunteers' | 'services' | 'reports' | 'alerts' | 'settings' | 'profile' | null;

interface ModalState {
  type: ModalType;
  data?: any;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
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

// Конфигурация ролей
const ROLES_CONFIG = {
  manager: {
    title: 'Менеджер социальных услуг',
    description: 'Управление заявками и координация услуг для граждан',
    icon: '👨‍💼',
    color: 'from-green-500 to-emerald-500',
    permissions: ['requests', 'citizens', 'services', 'volunteers', 'reports', 'profile'],
    features: [
      'Управление заявками',
      'Координация волонтеров',
      'Мониторинг услуг',
      'Аналитика эффективности'
    ]
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
    unit: 'заяв.',
    history: [18, 22, 19, 24, 21, 23, 24],
    details: {
      completed: 8,
      pending: 12,
      inProgress: 4
    }
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
    unit: 'заяв.',
    history: [162, 158, 155, 157, 156, 154, 156],
    details: {
      completed: 89,
      pending: 45,
      inProgress: 22
    }
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
    unit: 'заяв.',
    history: [28, 30, 27, 29, 31, 30, 32],
    details: {
      completed: 12,
      pending: 15,
      inProgress: 5
    }
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
    unit: 'заяв.',
    history: [72, 75, 78, 82, 85, 87, 89],
    details: {
      completed: 89,
      pending: 0,
      inProgress: 0
    }
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
    unit: 'чел.',
    history: [1480, 1495, 1510, 1525, 1540, 1555, 1568],
    details: {
      completed: 892,
      pending: 567,
      inProgress: 109
    }
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
    unit: 'вол.',
    history: [18, 19, 20, 21, 22, 22, 23],
    details: {
      completed: 15,
      pending: 5,
      inProgress: 3
    }
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
    unit: 'ч',
    history: [3.2, 3.0, 2.8, 2.7, 2.6, 2.5, 2.4],
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
    unit: '%',
    history: [94.2, 94.8, 95.3, 95.8, 96.2, 96.5, 96.7],
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
    unit: '%',
    history: [68, 70, 72, 74, 76, 77, 78],
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
    unit: 'балл',
    history: [4.4, 4.5, 4.5, 4.6, 4.6, 4.7, 4.7],
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
    unit: '%',
    history: [2.8, 2.6, 2.5, 2.4, 2.3, 2.2, 2.1],
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
    unit: '%',
    history: [80, 82, 83, 84, 85, 86, 87],
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
    read: false,
    icon: '⚠️'
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
    read: true,
    icon: '👥'
  },
  { 
    id: '3', 
    type: 'success', 
    title: 'Рекорд эффективности', 
    message: 'Команда волонтёров показала лучший результат за месяц - 98% выполненных заявок', 
    time: '1 день назад', 
    priority: 'low',
    read: true,
    icon: '🎉'
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
    read: false,
    icon: '⏰'
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
        { type: 'Социальные услуги', count: 9, color: COLORS.blue },
        { type: 'Медицинская помощь', count: 7, color: COLORS.green },
        { type: 'Бытовые услуги', count: 5, color: COLORS.orange },
        { type: 'Юридические', count: 3, color: COLORS.purple }
      ],
      history: [18, 22, 19, 24, 21, 23, 24]
    },
    size: 'sm',
    position: 1,
    removable: true,
    glowColor: COLORS.orange,
    category: 'Заявки',
    lastUpdated: '2024-01-15T08:00:00Z',
    pinned: true
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
        { stage: 'Назначено', count: 89, color: COLORS.blue },
        { stage: 'В процессе', count: 45, color: COLORS.orange },
        { stage: 'Ожидает', count: 22, color: COLORS.gray }
      ],
      completion: 89,
      history: [162, 158, 155, 157, 156, 154, 156]
    },
    size: 'sm',
    position: 2,
    removable: true,
    glowColor: COLORS.blue,
    category: 'Заявки',
    lastUpdated: '2024-01-15T09:30:00Z',
    pinned: true
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
        { type: 'Качество услуг', count: 18, color: COLORS.green },
        { type: 'Соответствие SLA', count: 9, color: COLORS.blue },
        { type: 'Документация', count: 5, color: COLORS.orange }
      ],
      history: [28, 30, 27, 29, 31, 30, 32]
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
      monthly: 1247,
      history: [72, 75, 78, 82, 85, 87, 89]
    },
    size: 'sm',
    position: 4,
    removable: true,
    glowColor: COLORS.success,
    category: 'Заявки',
    lastUpdated: '2024-01-15T11:00:00Z',
    pinned: true
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
      new: 45,
      history: [1480, 1495, 1510, 1525, 1540, 1555, 1568]
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
        { category: 'Инвалиды I группы', count: 123, color: COLORS.blue },
        { category: 'Ветераны ВОВ', count: 89, color: COLORS.green },
        { category: 'Многодетные семьи', count: 156, color: COLORS.orange },
        { category: 'Пенсионеры 80+', count: 98, color: COLORS.purple }
      ],
      history: [545, 550, 555, 560, 563, 565, 567]
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
        { label: 'Социальное сопровождение', value: 12, target: 10, color: COLORS.blue },
        { label: 'Медицинская помощь', value: 9, target: 8, color: COLORS.green },
        { label: 'Бытовые услуги', value: 8, target: 7, color: COLORS.orange },
        { label: 'Юридические консультации', value: 5, target: 5, color: COLORS.purple }
      ],
      detailedStats: {
        waitingTime: 2.1,
        targetTime: 1.5,
        forecast: {
          '24h': 18,
          '1-3d': 11,
          '3+d': 5
        }
      },
      history: [42, 38, 36, 35, 34, 33, 34]
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
        { label: 'Уникальных граждан', value: 892, change: 45, target: 850, color: COLORS.blue },
        { label: 'Средняя оценка', value: 4.7, change: 0.2, target: 4.5, color: COLORS.green },
        { label: 'NPS индекс', value: 68, change: 8, target: 60, color: COLORS.orange }
      ],
      detailedInfo: {
        byService: [
          { service: 'Социальные услуги', percentage: 36, count: 449, color: COLORS.blue },
          { service: 'Медицинская помощь', percentage: 27, count: 337, color: COLORS.green },
          { service: 'Бытовые услуги', percentage: 18, count: 224, color: COLORS.orange },
          { service: 'Юридические', percentage: 14, count: 175, color: COLORS.purple },
          { service: 'Психологические', percentage: 5, count: 62, color: COLORS.pink }
        ],
        topCitizens: [
          { name: 'Петров И.И.', requests: 23, district: 'Центральный' },
          { name: 'Сидорова М.П.', requests: 19, district: 'Северный' },
          { name: 'Козлов В.С.', requests: 17, district: 'Западный' }
        ]
      },
      history: [1150, 1175, 1190, 1210, 1225, 1235, 1247]
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
          { type: 'Социальное сопровождение', active: true, volunteers: 15, coverage: 95 },
          { type: 'Уход за пожилыми', active: true, volunteers: 12, coverage: 92 },
          { type: 'Помощь инвалидам', active: true, volunteers: 10, coverage: 97 },
          { type: 'Материальная помощь', active: true, volunteers: 8, coverage: 89 },
          { type: 'Юридические консультации', active: true, volunteers: 5, coverage: 94 }
        ],
        performance: {
          completion: 96.7,
          satisfaction: 4.7,
          coverage: 94
        }
      },
      history: [12, 13, 14, 14, 15, 15, 15]
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
          budget: 1500000,
          trend: 'up'
        },
        { 
          name: 'Уход за пожилыми', 
          coverage: 92, 
          satisfaction: 4.7, 
          team: 18,
          budget: 1200000,
          trend: 'stable'
        },
        { 
          name: 'Помощь инвалидам', 
          coverage: 97, 
          satisfaction: 4.9, 
          team: 15,
          budget: 1800000,
          trend: 'up'
        }
      ],
      history: [6, 7, 7, 8, 8, 8, 8]
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
        { name: 'Единовременные выплаты', budget: 500000, beneficiaries: 89, color: COLORS.green },
        { name: 'Вещевая помощь', budget: 300000, beneficiaries: 67, color: COLORS.blue },
        { name: 'Продуктовые наборы', budget: 250000, beneficiaries: 45, color: COLORS.orange },
        { name: 'Средства реабилитации', budget: 150000, beneficiaries: 33, color: COLORS.purple }
      ],
      quarterly: {
        spent: 845000,
        planned: 1200000,
        remaining: 355000
      },
      history: [3, 4, 4, 4, 4, 4, 4]
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
      efficiency: 87,
      distribution: [
        { type: 'Социальные работники', count: 15, color: COLORS.blue },
        { type: 'Психологи', count: 4, color: COLORS.green },
        { type: 'Юристы', count: 2, color: COLORS.orange },
        { type: 'Медработники', count: 2, color: COLORS.purple }
      ],
      history: [18, 19, 20, 21, 22, 22, 23]
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
        { label: 'Утренняя смена', value: 82, target: 85, color: COLORS.blue },
        { label: 'Дневная смена', value: 78, target: 80, color: COLORS.green },
        { label: 'Вечерняя смена', value: 74, target: 75, color: COLORS.orange }
      ],
      schedule: {
        shifts: [
          { time: '08:00-14:00', volunteers: 8, coverage: 85, color: COLORS.blue },
          { time: '14:00-20:00', volunteers: 10, coverage: 92, color: COLORS.green },
          { time: '20:00-02:00', volunteers: 5, coverage: 78, color: COLORS.orange }
        ],
        specialties: [
          { specialty: 'Социальные работники', count: 15, color: COLORS.blue },
          { specialty: 'Психологи', count: 4, color: COLORS.green },
          { specialty: 'Юристы', count: 2, color: COLORS.orange },
          { specialty: 'Медработники', count: 2, color: COLORS.purple }
        ]
      },
      history: [75, 76, 77, 78, 78, 78, 78]
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
          responsible: 'Иванов А.А.',
          progress: 100
        },
        { 
          name: 'Статистика услуг', 
          status: 'ready', 
          frequency: 'daily',
          responsible: 'Петрова М.П.',
          progress: 100
        },
        { 
          name: 'Анализ эффективности', 
          status: 'in_progress', 
          frequency: 'weekly',
          responsible: 'Сидоров В.С.',
          progress: 65
        }
      ],
      history: [10, 11, 11, 12, 12, 12, 12]
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
      },
      history: [13, 14, 14, 15, 15, 15, 15]
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
        { label: 'Охват услуг', value: 104, target: 95, color: COLORS.green },
        { label: 'Удовлетворённость', value: 98, target: 95, color: COLORS.blue },
        { label: 'Время реакции', value: 96, target: 95, color: COLORS.cyan },
        { label: 'Обучение волонтёров', value: 94, target: 90, color: COLORS.orange }
      ],
      performance: {
        completed: 12,
        total: 15,
        quarterly: [84, 87, 89, 92],
        targets: [85, 87, 90, 95]
      },
      history: [84, 85, 86, 87, 87, 87, 87]
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
      },
      history: [18, 20, 21, 22, 23, 23, 24]
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
      },
      history: [15, 15, 15, 15, 15, 15, 15]
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
        { label: 'Высокий приоритет', value: 5, change: 2, target: 3, color: COLORS.red },
        { label: 'На сегодня', value: 8, change: 0, target: 10, color: COLORS.orange },
        { label: 'Выполнено', value: 12, change: 4, target: 8, color: COLORS.green }
      ],
      taskDetails: {
        byDeadline: [
          { deadline: 'today', count: 8, color: COLORS.red },
          { deadline: 'week', count: 11, color: COLORS.orange },
          { deadline: 'month', count: 5, color: COLORS.blue }
        ],
        byType: [
          { type: 'От руководства', count: 6, color: COLORS.blue },
          { type: 'Совместные', count: 8, color: COLORS.green },
          { type: 'Личные', count: 10, color: COLORS.orange }
        ],
        performance: {
          completionTime: 2.4,
          onTime: 96,
          efficiency: 87
        }
      },
      history: [18, 20, 21, 22, 23, 23, 24]
    },
    size: 'sm',
    position: 19,
    removable: true,
    glowColor: COLORS.lime,
    category: 'Профиль',
    lastUpdated: '2024-01-15T08:00:00Z'
  },
  {
    id: 'geographic-coverage',
    type: 'map',
    title: '🗺️ Географическое покрытие',
    content: {
      value: 87,
      description: 'Охват услуг по районам города',
      trend: 'up',
      districts: [
        { name: 'Центральный', coverage: 95, requests: 245, color: COLORS.green },
        { name: 'Северный', coverage: 82, requests: 189, color: COLORS.blue },
        { name: 'Южный', coverage: 78, requests: 167, color: COLORS.orange },
        { name: 'Западный', coverage: 85, requests: 203, color: COLORS.purple },
        { name: 'Восточный', coverage: 75, requests: 142, color: COLORS.yellow }
      ],
      totalCoverage: 87,
      targetCoverage: 90,
      history: [82, 83, 84, 85, 86, 86, 87]
    },
    size: 'md',
    position: 20,
    removable: true,
    glowColor: COLORS.teal,
    category: 'Аналитика',
    lastUpdated: '2024-01-15T13:00:00Z'
  }
];

const LAYOUT_STORAGE_KEY = 'social-manager-dashboard-layout-v4';

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
  strokeWidth = 20,
  animationDelay = 0
}: { 
  data: { name: string; value: number; color: string }[]; 
  size?: number; 
  className?: string;
  showLabels?: boolean;
  strokeWidth?: number;
  animationDelay?: number;
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
            <motion.circle
              key={item.name}
              cx="50"
              cy="50"
              r={40 - strokeWidth / 4}
              fill="none"
              stroke={`rgba(${item.color}, 0.8)`}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: -accumulated + percentage, strokeDasharray: `0 100` }}
              animate={{ strokeDashoffset, strokeDasharray }}
              transition={{ 
                duration: 1.5, 
                delay: animationDelay + index * 0.2,
                ease: "easeOut"
              }}
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
  size = 'default',
  animated = true
}: { 
  value: number; 
  label: string; 
  color?: string; 
  showLabel?: boolean;
  showTarget?: boolean;
  target?: number;
  size?: 'default' | 'sm' | 'lg';
  animated?: boolean;
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
      <div className={`w-full bg-white/10 rounded-full ${height} overflow-hidden relative`}>
        <motion.div 
          className={`${height} rounded-full transition-all duration-700 ease-out`}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          style={{ 
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

// Улучшенный компонент для линейного графика
const LineChart = ({ 
  data, 
  className = '',
  color = COLORS.blue,
  withDots = true,
  height = 60,
  animationDelay = 0
}: { 
  data: number[]; 
  className?: string;
  color?: string;
  withDots?: boolean;
  height?: number;
  animationDelay?: number;
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
        <motion.polyline
          fill="none"
          stroke={`rgba(${color}, 0.8)`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: animationDelay, ease: "easeOut" }}
          points={data.map((value, i) => 
            `${(i / (data.length - 1)) * 100},${height - ((value - minValue) / range) * (height - 10)}`
          ).join(' ')}
        />
        
        {/* Area under line */}
        <motion.polygon
          fill={`rgba(${color}, 0.1)`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: animationDelay + 0.5 }}
          points={`
            0,${height} 
            ${data.map((value, i) => 
              `${(i / (data.length - 1)) * 100},${height - ((value - minValue) / range) * (height - 10)}`
            ).join(' ')}
            100,${height}
          `}
        />
        
        {withDots && data.map((value, i) => (
          <motion.circle
            key={i}
            cx={(i / (data.length - 1)) * 100}
            cy={height - ((value - minValue) / range) * (height - 10)}
            r="2"
            fill={`rgb(${color})`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: animationDelay + 0.8 + i * 0.1 }}
            className="transition-all duration-300"
          />
        ))}
      </svg>
    </div>
  );
};

// Компонент для отображения географического покрытия
const CoverageMap = ({ 
  districts, 
  totalCoverage,
  targetCoverage 
}: {
  districts: Array<{ name: string; coverage: number; requests: number; color: string }>;
  totalCoverage: number;
  targetCoverage: number;
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-white">{totalCoverage}%</div>
        <div className="text-white/60 text-sm">Общий охват услуг</div>
        <div className="w-full bg-white/10 rounded-full h-2 mt-2">
          <motion.div 
            className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${totalCoverage}%` }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </div>
        <div className="text-white/40 text-xs mt-1">Цель: {targetCoverage}%</div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {districts.map((district, index) => (
          <motion.div
            key={district.name}
            className="bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-white font-medium text-sm">{district.name}</span>
              <span 
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: `rgba(${district.color}, 0.2)`,
                  color: `rgb(${district.color})`
                }}
              >
                {district.coverage}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <motion.div 
                className="h-1.5 rounded-full"
                style={{ backgroundColor: `rgb(${district.color})` }}
                initial={{ width: 0 }}
                animate={{ width: `${district.coverage}%` }}
                transition={{ duration: 1, delay: 0.9 + index * 0.1 }}
              />
            </div>
            <div className="text-white/60 text-xs mt-1">
              {district.requests} заявок
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Улучшенный компонент выбора размера
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
  onPin?: () => void;
  onFavorite?: () => void;
  pinned?: boolean;
  favorite?: boolean;
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
  isOverlay = false,
  onPin,
  onFavorite,
  pinned = false,
  favorite = false
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
        ${pinned ? 'ring-2 ring-yellow-400/50' : ''}
        ${CARD_SIZES[size].minHeight}
        ${className}
      `}
      style={{
        '--x': `${mousePosition.x}%`,
        '--y': `${mousePosition.y}%`,
      } as React.CSSProperties}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      whileHover={isEditing && !isDragging ? { scale: 1.01, y: -2 } : {}}
      whileTap={isEditing ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Анимированный glow effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at var(--x) var(--y), rgba(${glowColor},0.15), transparent 40%)`
        }}
      />

      {/* Action buttons */}
      <div className="absolute top-3 left-3 z-30 flex flex-col gap-1 pointer-events-none">
        {onPin && (
          <motion.button
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs pointer-events-auto ${
              pinned 
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' 
                : 'bg-white/10 text-white/40 hover:bg-white/20 hover:text-white/60 border border-white/20'
            } transition-all duration-200`}
            onClick={(e) => {
              e.stopPropagation();
              onPin();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={pinned ? 'Открепить' : 'Закрепить'}
          >
            📌
          </motion.button>
        )}
      </div>

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
          className="absolute top-3 left-12 z-30"
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

      {/* Улучшенный shine effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
        <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:animate-shine" />
      </div>

      {/* Анимированный border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(45deg, transparent 30%, rgba(${glowColor},0.3) 50%, transparent 70%)`,
          backgroundSize: '200% 200%',
        }}
      />

      {/* Pinned indicator */}
      {pinned && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
      )}
    </motion.div>
  );
});

BentoCard.displayName = 'BentoCard';

// Улучшенный компонент пустой карточки
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
      <motion.div
        className="text-3xl text-white/40 mb-2 group-hover:text-white/60 transition-colors"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        +
      </motion.div>
      <div className="text-white/60 text-sm text-center group-hover:text-white/80 transition-colors">
        Добавить карточку
      </div>
      {position > 0 && (
        <div className="absolute bottom-2 right-2 text-white/30 text-xs">
          #{position}
        </div>
      )}
      
      {/* Анимированный градиентный border */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/0 via-purple-500/20 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
        animate={{
          backgroundPosition: ['0% 0%', '200% 200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
      />
    </motion.div>
  );
};

// Компонент модального окна
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
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          className={`bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/20 ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden shadow-2xl`}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {showCloseButton && (
              <motion.button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            )}
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Компонент модального окна для заявок
const RequestsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'new' | 'in-progress' | 'review' | 'completed'>('new');
  
  const requestsData = {
    new: [
      { id: 'R001', citizen: 'Иванов А.А.', service: 'Социальное сопровождение', priority: 'high', date: '15.01.2024' },
      { id: 'R002', citizen: 'Петрова М.П.', service: 'Медицинская помощь', priority: 'medium', date: '15.01.2024' },
      { id: 'R003', citizen: 'Сидоров В.С.', service: 'Бытовые услуги', priority: 'low', date: '15.01.2024' },
    ],
    'in-progress': [
      { id: 'R004', citizen: 'Козлов Д.И.', service: 'Юридические консультации', volunteer: 'Волонтер 1', progress: 65 },
      { id: 'R005', citizen: 'Николаева Е.П.', service: 'Психологическая помощь', volunteer: 'Волонтер 2', progress: 40 },
    ],
    review: [
      { id: 'R006', citizen: 'Федоров Г.С.', service: 'Социальное сопровождение', status: 'pending', days: 1 },
      { id: 'R007', citizen: 'Морозова И.К.', service: 'Медицинская помощь', status: 'verified', days: 0 },
    ],
    completed: [
      { id: 'R008', citizen: 'Орлов М.В.', service: 'Бытовые услуги', rating: 5, date: '14.01.2024' },
      { id: 'R009', citizen: 'Захарова С.Д.', service: 'Юридические консультации', rating: 4, date: '14.01.2024' },
    ]
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Управление заявками" size="xl">
      <div className="p-6">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white/5 rounded-2xl p-1">
          {[
            { id: 'new', label: 'Новые', count: requestsData.new.length },
            { id: 'in-progress', label: 'В работе', count: requestsData['in-progress'].length },
            { id: 'review', label: 'На проверке', count: requestsData.review.length },
            { id: 'completed', label: 'Завершённые', count: requestsData.completed.length }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-white/60 hover:text-white/80'
              }`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  {tab.count}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'new' && (
            <div className="space-y-3">
              {requestsData.new.map((request) => (
                <div key={request.id} className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-300">
                        📋
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{request.citizen}</h4>
                        <p className="text-white/60 text-sm">{request.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.priority === 'high' 
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : request.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          : 'bg-green-500/20 text-green-300 border border-green-500/30'
                      }`}>
                        {request.priority === 'high' ? 'Высокий' : request.priority === 'medium' ? 'Средний' : 'Низкий'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'in-progress' && (
            <div className="space-y-3">
              {requestsData['in-progress'].map((request) => (
                <div key={request.id} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-300">
                        🔄
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{request.citizen}</h4>
                        <p className="text-white/60 text-sm">{request.service}</p>
                      </div>
                    </div>
                    <div className="text-white/60 text-sm">
                      Волонтер: {request.volunteer}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white/60">
                      <span>Прогресс выполнения</span>
                      <span>{request.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                        style={{ width: `${request.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'review' && (
            <div className="space-y-3">
              {requestsData.review.map((request) => (
                <div key={request.id} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-300">
                        📋
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{request.citizen}</h4>
                        <p className="text-white/60 text-sm">{request.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === 'pending' 
                          ? 'bg-yellow-500/20 text-yellow-300' 
                          : 'bg-green-500/20 text-green-300'
                      }`}>
                        {request.status === 'pending' ? 'Ожидает' : 'Проверено'}
                      </span>
                      <span className="text-white/60 text-sm">
                        {request.days} дн.
                      </span>
                      <button className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl text-white text-sm font-medium transition-colors">
                        Проверить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-3">
              {requestsData.completed.map((request) => (
                <div key={request.id} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-300">
                        ✅
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{request.citizen}</h4>
                        <p className="text-white/60 text-sm">{request.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-yellow-300">
                        {'⭐'.repeat(request.rating)}
                        {'☆'.repeat(5 - request.rating)}
                      </div>
                      <span className="text-white/60 text-sm">{request.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/10">
          <div className="text-white/60 text-sm">
            Всего заявок: {Object.values(requestsData).flat().length}
          </div>
          <div className="flex gap-3">
            <button 
              className="px-4 py-2 border border-white/20 rounded-xl text-white/80 hover:bg-white/10 transition-colors"
              onClick={onClose}
            >
              Закрыть
            </button>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-colors">
              Экспорт отчета
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Компонент модального окна для волонтеров
const VolunteersModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const volunteers = [
    { id: 'V001', name: 'Александр Петров', specialty: 'Социальный работник', status: 'active', tasks: 8, rating: 4.8 },
    { id: 'V002', name: 'Мария Иванова', specialty: 'Психолог', status: 'active', tasks: 5, rating: 4.9 },
    { id: 'V003', name: 'Дмитрий Сидоров', specialty: 'Юрист', status: 'busy', tasks: 3, rating: 4.7 },
    { id: 'V004', name: 'Елена Козлова', specialty: 'Медработник', status: 'available', tasks: 2, rating: 4.6 },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Управление волонтёрами" size="lg">
      <div className="p-6">
        {/* Статистика */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{volunteers.length}</div>
            <div className="text-white/60 text-sm">Всего волонтёров</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{volunteers.filter(v => v.status === 'active').length}</div>
            <div className="text-white/60 text-sm">Активных</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{volunteers.reduce((sum, v) => sum + v.tasks, 0)}</div>
            <div className="text-white/60 text-sm">Задач в работе</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {(volunteers.reduce((sum, v) => sum + v.rating, 0) / volunteers.length).toFixed(1)}
            </div>
            <div className="text-white/60 text-sm">Средний рейтинг</div>
          </div>
        </div>

        {/* Список волонтеров */}
        <div className="space-y-3">
          {volunteers.map((volunteer) => (
            <div key={volunteer.id} className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
                    volunteer.status === 'active' ? 'bg-green-500/20' : 
                    volunteer.status === 'busy' ? 'bg-orange-500/20' : 'bg-blue-500/20'
                  }`}>
                    {volunteer.status === 'active' ? '✅' : volunteer.status === 'busy' ? '🟡' : '🟢'}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{volunteer.name}</h4>
                    <p className="text-white/60 text-sm">{volunteer.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-white font-semibold">{volunteer.tasks} задач</div>
                    <div className="text-white/60 text-sm">Рейтинг: {volunteer.rating}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/10">
          <div className="flex gap-3">
            <button 
              className="px-4 py-2 border border-white/20 rounded-xl text-white/80 hover:bg-white/10 transition-colors"
              onClick={onClose}
            >
              Закрыть
            </button>
            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition-colors">
              Создать отчет
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Компонент модального окна для граждан
const CitizensModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const citizens = [
    { id: 'C001', name: 'Иванов Александр Алексеевич', category: 'Пенсионер', district: 'Центральный', requests: 12, status: 'active' },
    { id: 'C002', name: 'Петрова Мария Петровна', category: 'Инвалид I группы', district: 'Северный', requests: 8, status: 'active' },
    { id: 'C003', name: 'Сидоров Владимир Сергеевич', category: 'Ветеран', district: 'Западный', requests: 15, status: 'active' },
    { id: 'C004', name: 'Козлова Елена Дмитриевна', category: 'Многодетная семья', district: 'Южный', requests: 6, status: 'inactive' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="База граждан" size="xl">
      <div className="p-6">
        {/* Фильтры и поиск */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Поиск по имени или ID..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>
          <select className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors">
            <option value="all">Все категории</option>
            <option value="pensioner">Пенсионеры</option>
            <option value="disabled">Инвалиды</option>
            <option value="veteran">Ветераны</option>
            <option value="family">Многодетные семьи</option>
          </select>
          <select className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors">
            <option value="all">Все районы</option>
            <option value="center">Центральный</option>
            <option value="north">Северный</option>
            <option value="south">Южный</option>
            <option value="west">Западный</option>
          </select>
        </div>

        {/* Таблица граждан */}
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-white/60 text-sm font-medium">
            <div className="col-span-4">ФИО</div>
            <div className="col-span-2">Категория</div>
            <div className="col-span-2">Район</div>
            <div className="col-span-2">Заявки</div>
            <div className="col-span-2">Статус</div>
          </div>
          <div className="divide-y divide-white/10">
            {citizens.map((citizen) => (
              <div key={citizen.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-white/5 transition-colors">
                <div className="col-span-4 text-white font-medium">{citizen.name}</div>
                <div className="col-span-2 text-white/80">{citizen.category}</div>
                <div className="col-span-2 text-white/60">{citizen.district}</div>
                <div className="col-span-2 text-white/80">{citizen.requests}</div>
                <div className="col-span-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    citizen.status === 'active' 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-gray-500/20 text-gray-300'
                  }`}>
                    {citizen.status === 'active' ? 'Активен' : 'Неактивен'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/10">
          <div className="text-white/60 text-sm">
            Показано: {citizens.length} из 1568 граждан
          </div>
          <div className="flex gap-3">
            <button 
              className="px-4 py-2 border border-white/20 rounded-xl text-white/80 hover:bg-white/10 transition-colors"
              onClick={onClose}
            >
              Закрыть
            </button>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-colors">
              Добавить гражданина
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Компонент модального окна для услуг
const ServicesModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const services = [
    { id: 'S001', name: 'Социальное сопровождение', category: 'Социальные', volunteers: 15, coverage: 95, status: 'active' },
    { id: 'S002', name: 'Уход за пожилыми', category: 'Социальные', volunteers: 12, coverage: 92, status: 'active' },
    { id: 'S003', name: 'Помощь инвалидам', category: 'Социальные', volunteers: 10, coverage: 97, status: 'active' },
    { id: 'S004', name: 'Материальная помощь', category: 'Материальные', volunteers: 8, coverage: 89, status: 'active' },
    { id: 'S005', name: 'Юридические консультации', category: 'Консультации', volunteers: 5, coverage: 94, status: 'active' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Управление услугами" size="lg">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{services.length}</div>
            <div className="text-white/60 text-sm">Всего услуг</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {services.reduce((sum, s) => sum + s.coverage, 0) / services.length}%
            </div>
            <div className="text-white/60 text-sm">Средний охват</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {services.reduce((sum, s) => sum + s.volunteers, 0)}
            </div>
            <div className="text-white/60 text-sm">Волонтёров</div>
          </div>
        </div>

        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.id} className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-300">
                    🛠️
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{service.name}</h4>
                    <p className="text-white/60 text-sm">{service.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-white font-semibold">{service.volunteers} волонтёров</div>
                    <div className="text-white/60 text-sm">Охват: {service.coverage}%</div>
                  </div>
                  <button className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl text-white text-sm font-medium transition-colors">
                    Управлять
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/10">
          <button className="px-4 py-2 border border-white/20 rounded-xl text-white/80 hover:bg-white/10 transition-colors">
            Добавить услугу
          </button>
          <div className="flex gap-3">
            <button 
              className="px-4 py-2 border border-white/20 rounded-xl text-white/80 hover:bg-white/10 transition-colors"
              onClick={onClose}
            >
              Закрыть
            </button>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-colors">
              Настройки
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Компонент модального окна для отчетов
const ReportsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const reports = [
    { id: 'REP001', name: 'Ежедневный отчет по заявкам', frequency: 'Ежедневно', lastRun: '15.01.2024 08:00', status: 'ready' },
    { id: 'REP002', name: 'Статистика услуг за неделю', frequency: 'Еженедельно', lastRun: '14.01.2024 09:30', status: 'ready' },
    { id: 'REP003', name: 'Анализ эффективности волонтёров', frequency: 'Ежемесячно', lastRun: '01.01.2024 10:00', status: 'ready' },
    { id: 'REP004', name: 'Финансовый отчет', frequency: 'Ежемесячно', lastRun: '01.01.2024 11:00', status: 'pending' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Отчеты и аналитика" size="lg">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h4 className="text-white font-semibold mb-4">Быстрые отчеты</h4>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl border border-blue-500/30 text-blue-300 text-left transition-colors">
                📊 Отчет за сегодня
              </button>
              <button className="w-full px-4 py-3 bg-green-500/20 hover:bg-green-500/30 rounded-xl border border-green-500/30 text-green-300 text-left transition-colors">
                📈 Недельная статистика
              </button>
              <button className="w-full px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl border border-purple-500/30 text-purple-300 text-left transition-colors">
                👥 Отчет по волонтёрам
              </button>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h4 className="text-white font-semibold mb-4">Экспорт данных</h4>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 rounded-xl border border-orange-500/30 text-orange-300 text-left transition-colors">
                📥 Excel - Все заявки
              </button>
              <button className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl border border-red-500/30 text-red-300 text-left transition-colors">
                📥 PDF - Статистика услуг
              </button>
              <button className="w-full px-4 py-3 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-xl border border-indigo-500/30 text-indigo-300 text-left transition-colors">
                📥 CSV - База граждан
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    report.status === 'ready' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {report.status === 'ready' ? '✅' : '⏳'}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{report.name}</h4>
                    <p className="text-white/60 text-sm">Частота: {report.frequency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-white/60 text-sm">Последний запуск:</div>
                    <div className="text-white/80 text-sm">{report.lastRun}</div>
                  </div>
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white text-sm font-medium transition-colors">
                    Запустить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/10">
          <div className="text-white/60 text-sm">
            Всего отчетов: {reports.length}
          </div>
          <div className="flex gap-3">
            <button 
              className="px-4 py-2 border border-white/20 rounded-xl text-white/80 hover:bg-white/10 transition-colors"
              onClick={onClose}
            >
              Закрыть
            </button>
            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition-colors">
              Настроить автоматизацию
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Компонент модального окна для уведомлений
const AlertsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [alerts, setAlerts] = useState([
    { 
      id: '1', 
      type: 'warning', 
      title: 'Высокая нагрузка в Северном районе', 
      message: 'Превышен лимит заявок на 25%, требуется перераспределение волонтёров', 
      time: '15 мин назад', 
      priority: 'high',
      read: false,
      icon: '⚠️'
    },
    { 
      id: '2', 
      type: 'info', 
      title: 'Новые волонтеры готовы к работе', 
      message: '3 новых волонтера прошли обучение и могут быть назначены на задачи', 
      time: '2 часа назад', 
      priority: 'medium',
      read: true,
      icon: '👥'
    },
    { 
      id: '3', 
      type: 'success', 
      title: 'Рекорд эффективности', 
      message: 'Команда волонтёров показала лучший результат за месяц - 98% выполненных заявок', 
      time: '1 день назад', 
      priority: 'low',
      read: true,
      icon: '🎉'
    },
    { 
      id: '4', 
      type: 'error', 
      title: 'Просроченные заявки', 
      message: '5 заявок находятся в статусе просрочки более 24 часов', 
      time: '30 мин назад', 
      priority: 'high',
      read: false,
      icon: '⏰'
    },
  ]);

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };

  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Уведомления и оповещения" size="lg">
      <div className="p-6">
        {/* Статистика */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-white font-semibold">
              Уведомления ({alerts.length})
            </div>
            {unreadCount > 0 && (
              <div className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-300 text-sm">
                {unreadCount} непрочитанных
              </div>
            )}
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="px-4 py-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              Отметить все как прочитанные
            </button>
          )}
        </div>

        {/* Список уведомлений */}
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`rounded-2xl p-4 border transition-all ${
                alert.read 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-blue-500/5 border-blue-500/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                  alert.type === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
                  alert.type === 'info' ? 'bg-blue-500/20 text-blue-300' :
                  alert.type === 'success' ? 'bg-green-500/20 text-green-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {alert.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`font-semibold ${
                      alert.read ? 'text-white/80' : 'text-white'
                    }`}>
                      {alert.title}
                    </h4>
                    {!alert.read && (
                      <button 
                        onClick={() => markAsRead(alert.id)}
                        className="text-white/40 hover:text-white/60 text-sm transition-colors"
                      >
                        Отметить как прочитанное
                      </button>
                    )}
                  </div>
                  <p className="text-white/60 text-sm mb-2">{alert.message}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        alert.priority === 'high' 
                          ? 'bg-red-500/20 text-red-300' 
                          : alert.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-green-500/20 text-green-300'
                      }`}>
                        {alert.priority === 'high' ? 'Высокий' : alert.priority === 'medium' ? 'Средний' : 'Низкий'}
                      </span>
                      <span className="text-white/40 text-xs">{alert.time}</span>
                    </div>
                    {!alert.read && (
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/10">
          <div className="text-white/60 text-sm">
            Последнее обновление: {new Date().toLocaleTimeString('ru-RU')}
          </div>
          <div className="flex gap-3">
            <button 
              className="px-4 py-2 border border-white/20 rounded-xl text-white/80 hover:bg-white/10 transition-colors"
              onClick={onClose}
            >
              Закрыть
            </button>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-colors">
              Настройки уведомлений
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Улучшенный компонент модального окна выбора карточек
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(availableCards.map(card => card.category).filter(Boolean))] as string[];

  const filteredCards = availableCards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.content.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Выберите карточку для добавления" size="xl">
      <div className="p-6">
        <p className="text-white/60 mb-6">
          Доступно {availableCards.length} карточек для добавления на дашборд
        </p>

        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Поиск карточек..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                ✕
              </button>
            )}
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors min-w-[160px]"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Все категории' : category}
              </option>
            ))}
          </select>
        </div>
        
        <div className="overflow-y-auto max-h-[60vh] custom-scrollbar">
          {filteredCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  className="bg-white/5 rounded-2xl border border-white/10 p-4 cursor-pointer hover:bg-white/10 transition-all duration-200 group"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectCard(card)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div 
                      className="w-3 h-3 rounded-full shadow-lg"
                      style={{ backgroundColor: `rgb(${card.glowColor})` }}
                      whileHover={{ scale: 1.2 }}
                    />
                    <span className="text-white font-semibold text-sm group-hover:text-white/90 transition-colors">
                      {card.title}
                    </span>
                  </div>
                  <p className="text-white/60 text-xs mb-3 line-clamp-2 group-hover:text-white/70 transition-colors">
                    {card.content.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-white/40 group-hover:text-white/60 transition-colors">
                    <span>{card.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
                        {card.size.toUpperCase()}
                      </span>
                      <span 
                        className="px-2 py-1 rounded-full border"
                        style={{
                          backgroundColor: `rgba(${card.glowColor}, 0.2)`,
                          color: `rgb(${card.glowColor})`,
                          borderColor: `rgba(${card.glowColor}, 0.3)`
                        }}
                      >
                        {card.content.trend === 'up' ? '↗' : card.content.trend === 'down' ? '↘' : '→'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-white/60 text-lg mb-2">Карточки не найдены</p>
              <p className="text-white/40 text-sm">
                Попробуйте изменить параметры поиска или выбрать другую категорию
              </p>
            </motion.div>
          )}
        </div>

        <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/10 text-sm text-white/60">
          <span>Найдено: {filteredCards.length} карточек</span>
          <span>Всего доступно: {availableCards.length}</span>
        </div>
      </div>
    </Modal>
  );
};

// Улучшенный AdaptiveCardContent компонент
const AdaptiveCardContent = ({ card }: { card: DashboardCard }) => {
  const renderContent = () => {
    const { size, type, content } = card;
    
    const renderKPI = () => {
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
            {content.history && (
              <div className="mt-2">
                <LineChart 
                  data={content.history} 
                  height={30}
                  color={card.glowColor}
                  withDots={false}
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
                {content.unit && <span className="text-white/60 text-xl ml-1">{content.unit}</span>}
              </div>
              <p className="text-white/70 text-base">{content.description}</p>
            </div>
            
            {content.history && (
              <div className="flex-grow">
                <LineChart 
                  data={content.history} 
                  height={60}
                  color={card.glowColor}
                />
              </div>
            )}

            {content.distribution && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {content.distribution.slice(0, 2).map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: `rgb(${item.color})` }}
                    />
                    <span className="text-white/60 flex-1 truncate">{item.type}</span>
                    <span className="text-white/80 font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      if (size === 'lg') {
        return (
          <div className="p-6 h-full flex flex-col">
            <div className="text-center mb-6">
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                {content.value}
                {content.unit && <span className="text-white/60 text-2xl ml-2">{content.unit}</span>}
              </div>
              <div className="text-white/70 text-lg">{content.description}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6 flex-grow">
              {content.history && (
                <div className="col-span-2">
                  <LineChart 
                    data={content.history} 
                    height={80}
                    color={card.glowColor}
                  />
                </div>
              )}
              
              {content.distribution && (
                <div className="col-span-2 space-y-2">
                  <h4 className="text-white font-semibold text-sm mb-3">Распределение:</h4>
                  {content.distribution.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 flex-1">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: `rgb(${item.color})` }}
                        />
                        <span className="text-white/80 truncate">{item.type}</span>
                      </div>
                      <span className="text-white/60 text-sm">{item.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }

      // XL size
      return (
        <div className="p-6 h-full grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <p className="text-white/60 text-sm">Текущий показатель</p>
              <div className="text-5xl font-bold text-white mt-1">
                {content.value}
                {content.unit && <span className="text-white/60 text-2xl ml-2">{content.unit}</span>}
              </div>
              <p className="text-white/70 text-base mt-2">{content.description}</p>
            </div>
            
            {content.history && (
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Динамика за неделю</h4>
                <LineChart 
                  data={content.history} 
                  height={100}
                  color={card.glowColor}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {content.distribution && (
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Детальное распределение</h4>
                <div className="space-y-3">
                  {content.distribution.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3 flex-1">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: `rgb(${item.color})` }}
                        />
                        <span className="text-white font-medium">{item.type}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-lg font-semibold">{item.count}</div>
                        <div className="text-white/40 text-xs">
                          {Math.round((item.count / content.value) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {content.details && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-white/50 text-xs mb-1">Выполнено</div>
                  <div className="text-white font-semibold">{content.details.completed}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-white/50 text-xs mb-1">В процессе</div>
                  <div className="text-white font-semibold">{content.details.inProgress}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };

    const renderChart = () => {
      if (size === 'sm') {
        return (
          <div className="p-4 h-full flex flex-col justify-center items-center text-center gap-2">
            <div className="text-2xl lg:text-3xl font-bold text-white mb-2">
              {content.value}
            </div>
            <div className="text-white/60 text-sm text-center line-clamp-2">
              {content.description}
            </div>
            {content.chartData && content.chartData[0] && (
              <div className="text-white/50 text-xs">
                Лидирует: <span className="text-white/80">{content.chartData[0].name}</span>
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
              {content.chartData && (
                <PieChart 
                  data={content.chartData} 
                  size={100}
                  strokeWidth={15}
                />
              )}
              <div className="flex flex-wrap gap-2 justify-center text-xs text-white/60">
                {content.chartData?.slice(0, 3).map((item: any) => (
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
              {content.chartData && (
                <PieChart 
                  data={content.chartData} 
                  size={140}
                  strokeWidth={18}
                  showLabels={true}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {content.chartData?.map((item: any, index: number) => (
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
              
            {content.chartData && (
              <PieChart 
                data={content.chartData} 
                size={180}
                strokeWidth={16}
                showLabels={true}
              />
            )}
          </div>
            
          <div className="lg:col-span-3 space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              {content.chartData?.map((item: any, index: number) => (
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
    };

    const renderMap = () => {
      return (
        <div className="p-6 h-full flex flex-col">
          <div className="text-center mb-6">
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
              {content.value}%
            </div>
            <div className="text-white/60 text-lg">
              {content.description}
            </div>
          </div>
          
          <div className="flex-grow">
            <CoverageMap 
              districts={content.districts}
              totalCoverage={content.totalCoverage}
              targetCoverage={content.targetCoverage}
            />
          </div>
        </div>
      );
    };

    switch (type) {
      case 'kpi':
        return renderKPI();
      case 'chart':
        return renderChart();
      case 'map':
        return renderMap();
      case 'progress':
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
            
            <div className="flex-grow space-y-4">
              {content.items?.map((item: any, index: number) => (
                <ProgressBar 
                  key={index}
                  value={item.value}
                  label={item.label}
                  color={item.color}
                  showLabel={true}
                  showTarget={!!item.target}
                  target={item.target}
                  size="lg"
                />
              ))}
            </div>
          </div>
        );
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
          <motion.h3 
            className="text-white font-semibold text-sm lg:text-base truncate"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {card.title}
          </motion.h3>
          {card.lastUpdated && (
            <motion.p 
              className="text-white/40 text-xs mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Обновлено: {formatRelativeTime(card.lastUpdated)}
            </motion.p>
          )}
        </div>
      </div>
      
      <div className="flex-grow">
        {renderContent()}
      </div>

      <motion.div 
        className="flex justify-between items-center p-4 pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2">
          {card.category && (
            <span className="text-white/40 text-xs bg-white/5 px-2 py-1 rounded border border-white/10">
              {card.category}
            </span>
          )}
        </div>
        
        <div 
          className="text-xs px-2 py-1 rounded-full border font-medium"
          style={{
            backgroundColor: `rgba(${card.glowColor}, 0.2)`,
            color: `rgb(${card.glowColor})`,
            borderColor: `rgba(${card.glowColor}, 0.3)`
          }}
        >
          {card.content.trend === 'up' ? '↗ Рост' : 
           card.content.trend === 'down' ? '↘ Снижение' : '→ Стабильно'}
        </div>
      </motion.div>
    </div>
  );
};

// Sortable компонент для карточек
const SortableCard = ({ 
  card, 
  isEditing, 
  onRemove, 
  onSizeChange,
  onPin,
  onFavorite
}: { 
  card: DashboardCard; 
  isEditing: boolean;
  onRemove: () => void;
  onSizeChange: (size: CardSize) => void;
  onPin: () => void;
  onFavorite: () => void;
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
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`w-full ${CARD_SIZES[card.size].class}`}
      {...attributes}
      {...listeners}
      layout
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
    >
      <BentoCard
        size={card.size}
        glowColor={card.glowColor}
        isEditing={isEditing}
        onRemove={onRemove}
        onSizeChange={onSizeChange}
        onPin={onPin}
        onFavorite={onFavorite}
        pinned={card.pinned}
        favorite={card.favorite}
        isDragging={isDragging}
      >
        <AdaptiveCardContent card={card} />
      </BentoCard>
    </motion.div>
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
      pinned={card.pinned}
      favorite={card.favorite}
    >
      <div className="h-full flex flex-col justify-center items-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-white font-semibold text-sm mb-2 text-center">
            {card.title}
          </div>
          <div className="text-white/60 text-xs text-center mb-4">
            Перетаскивается...
          </div>
          <motion.div 
            className="text-white/40 text-2xl"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ⠿
          </motion.div>
        </motion.div>
      </div>
    </BentoCard>
  );
};

// Улучшенный KPI виджет
function KPIWidget({ kpi, isEditing = false }: { kpi: KPI; isEditing?: boolean }) {
  const trendColor = kpi.color || getTrendColor(kpi.trend);
  const progress = kpi.target ? Math.min((kpi.value / kpi.target) * 100, 100) : 0;
  
  const content = (
    <motion.div 
      className="h-full flex flex-col justify-between p-4"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-3">
        <motion.div 
          className="text-xl lg:text-2xl font-bold text-white leading-tight"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          {kpi.value}
          {kpi.suffix && <span className="text-white/60 text-lg ml-0.5">{kpi.suffix}</span>}
        </motion.div>
        <div className="flex flex-col items-end gap-1">
          <motion.div 
            className="text-lg lg:text-xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            {kpi.icon}
          </motion.div>
          {kpi.change && (
            <motion.div 
              className={`flex items-center gap-1 text-xs font-medium`}
              style={{ color: `rgb(${trendColor})` }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
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
            <motion.span 
              className="text-xs px-2 py-1 rounded-full border flex-shrink-0"
              style={{
                backgroundColor: `rgba(${trendColor}, 0.2)`,
                color: `rgb(${trendColor})`,
                borderColor: `rgba(${trendColor}, 0.3)`
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {kpi.trend === 'up' ? 'Рост' : kpi.trend === 'down' ? 'Снижение' : 'Стабильно'}
            </motion.span>
          )}
        </div>
        
        <motion.div 
          className="text-white/60 text-sm line-clamp-2 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {kpi.description}
        </motion.div>
      </div>

      {kpi.target && (
        <motion.div 
          className="mt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Прогресс к цели</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <motion.div 
              className="h-1.5 rounded-full transition-all duration-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
              style={{ 
                backgroundColor: `rgb(${trendColor})`,
                boxShadow: `0 0 4px rgba(${trendColor}, 0.5)`
              }}
            />
          </div>
          <div className="text-white/40 text-xs mt-1">
            Цель: {kpi.target}{kpi.unit ? ` ${kpi.unit}` : kpi.suffix || ''}
          </div>
        </motion.div>
      )}

      {kpi.history && (
        <motion.div 
          className="mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <LineChart 
            data={kpi.history} 
            height={20}
            color={trendColor}
            withDots={false}
            animationDelay={1}
          />
        </motion.div>
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
  const [customCards, setCustomCards] = useState<DashboardCard[]>([]);
  const [emptySlots, setEmptySlots] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLayoutHydrated, setIsLayoutHydrated] = useState(false);
  const [isCardPickerOpen, setIsCardPickerOpen] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(alerts.filter(alert => !alert.read).length);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [modal, setModal] = useState<ModalState>({ type: null, title: '', size: 'md' });

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
      setCustomCards(additionalCards.map(card => ({ ...card })));
      return;
    }

    try {
      const storedLayout = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (storedLayout) {
        const parsed = JSON.parse(storedLayout) as unknown;
        if (Array.isArray(parsed)) {
          const normalizedCards: DashboardCard[] = (parsed as unknown[])
            .filter((card: any): card is DashboardCard => 
              card && 
              typeof card.id === 'string' &&
              typeof card.title === 'string' &&
              typeof card.type === 'string' &&
              typeof card.size === 'string'
            )
            .map((card, index) => ({
              ...card,
              size: card.size || 'sm',
              position: typeof card.position === 'number' ? card.position : index + 1,
              glowColor: card.glowColor || COLORS.blue,
              pinned: card.pinned || false,
              favorite: card.favorite || false
            }));

          if (normalizedCards.length) {
            setCustomCards(normalizedCards);
          } else {
            setCustomCards(additionalCards.map(card => ({ ...card })));
          }
        } else {
          setCustomCards(additionalCards.map(card => ({ ...card })));
        }
      } else {
        setCustomCards(additionalCards.map(card => ({ ...card })));
      }
    } catch (error) {
      console.error('Не удалось загрузить раскладку дашборда', error);
      setCustomCards(additionalCards.map(card => ({ ...card })));
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

  // Фильтрация карточек
  const filteredCards = useMemo(() => {
    let filtered = customCards.filter(card => {
      const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           card.content.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
      const matchesPinned = !showPinnedOnly || card.pinned;
      return matchesSearch && matchesCategory && matchesPinned;
    });

    // Сначала закрепленные, потом остальные
    return filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return a.position - b.position;
    });
  }, [customCards, searchQuery, selectedCategory, showPinnedOnly]);

  const availableCards = useMemo(
    () => additionalCards.filter(card => !customCards.some(existing => existing.id === card.id)),
    [customCards]
  );
  const hasAvailableCards = availableCards.length > 0;

  const categories = useMemo(() => {
    const allCategories = ['all', ...new Set(customCards.map(card => card.category).filter(Boolean))] as string[];
    return allCategories;
  }, [customCards]);

  const pinnedCardsCount = useMemo(() => customCards.filter(card => card.pinned).length, [customCards]);
  
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

  // Функции для модальных окон
  const openModal = useCallback((type: ModalType, title: string, size: 'sm' | 'md' | 'lg' | 'xl' = 'md', data?: any) => {
    setModal({ type, title, size, data });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ type: null, title: '', size: 'md' });
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

  // Функция для закрепления/открепления карточки
  const togglePinCard = useCallback((cardId: string) => {
    setCustomCards(cards => 
      cards.map(card => 
        card.id === cardId ? { ...card, pinned: !card.pinned } : card
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
      lastUpdated: new Date().toISOString(),
      pinned: false,
      favorite: false
    };

    setCustomCards(cards => [...cards, newCard]);
    setEmptySlots(slots => slots.slice(1));
    setIsCardPickerOpen(false);
  }, [availableCards, customCards.length, hasAvailableCards]);

  const resetLayout = useCallback(() => {
    setCustomCards(additionalCards.map((card) => ({ ...card })));
    setEmptySlots([]);
    setActiveId(null);
    setSearchQuery('');
    setSelectedCategory('all');
    setShowPinnedOnly(false);

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

  const handleAlertAction = useCallback((alert: Alert) => {
    if (alert.actionLink) {
      if (alert.actionLink.includes('volunteers')) {
        openModal('volunteers', 'Управление волонтёрами', 'lg');
      } else if (alert.actionLink.includes('requests')) {
        openModal('requests', 'Управление заявками', 'xl');
      }
    }
  }, [openModal]);

  const activeCard = useMemo(
    () => (activeId ? customCards.find((card) => card.id === activeId) || null : null),
    [activeId, customCards]
  );

  // Компонент быстрых действий
  const QuickActions = () => (
    <motion.div 
      className="flex flex-wrap gap-3 mt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <motion.button
        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-300 text-sm font-medium transition-colors flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => openModal('requests', 'Управление заявками', 'xl')}
      >
        📋 Заявки
      </motion.button>
      <motion.button
        className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl text-green-300 text-sm font-medium transition-colors flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => openModal('citizens', 'База граждан', 'xl')}
      >
        👥 Граждане
      </motion.button>
      <motion.button
        className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-xl text-orange-300 text-sm font-medium transition-colors flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => openModal('volunteers', 'Управление волонтёрами', 'lg')}
      >
        🤝 Волонтёры
      </motion.button>
      <motion.button
        className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-300 text-sm font-medium transition-colors flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => openModal('services', 'Управление услугами', 'lg')}
      >
        🛠️ Услуги
      </motion.button>
      <motion.button
        className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-xl text-cyan-300 text-sm font-medium transition-colors flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => openModal('reports', 'Отчеты и аналитика', 'lg')}
      >
        📊 Отчеты
      </motion.button>
      <motion.button
        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-300 text-sm font-medium transition-colors flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => openModal('alerts', 'Уведомления и оповещения', 'lg')}
      >
        🔔 Уведомления
        {unreadAlerts > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {unreadAlerts}
          </span>
        )}
      </motion.button>
    </motion.div>
  );

  // Компонент карточки уведомления
  const AlertCard = ({ alert }: { alert: Alert }) => {
    const alertColor = getAlertColor(alert.type);
    
    return (
      <BentoCard 
        className="p-4 min-h-[100px] cursor-pointer"
        glowColor={alertColor}
        onClick={() => alert.action && handleAlertAction(alert)}
      >
        <motion.div 
          className="h-full flex flex-col justify-between"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-start justify-between mb-2 gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {alert.icon && (
                <span className="text-sm flex-shrink-0">{alert.icon}</span>
              )}
              <div className="font-medium text-sm line-clamp-2 flex-grow min-w-0 text-white">
                {alert.title}
              </div>
            </div>
            {!alert.read && (
              <motion.div 
                className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
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
                <div 
                  className="text-white/80 text-xs hover:text-white cursor-pointer transition-colors font-medium"
                  style={{ color: `rgb(${alertColor})` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAlertAction(alert);
                  }}
                >
                  {alert.action} →
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </BentoCard>
    );
  };

  if (!isLayoutHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-white/20 border-t-blue-500 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
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
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
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
                <motion.h1 
                  className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 leading-tight"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  Панель управления менеджера социальных услуг
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-base lg:text-lg max-w-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {role.description} {isEditing && (
                    <span className="text-yellow-300 font-medium">• Режим редактирования активен</span>
                  )}
                </motion.p>
                
                {/* Quick Actions */}
                <QuickActions />
                
                {/* Features list */}
                <motion.div 
                  className="flex flex-wrap gap-2 mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {role.features.map((feature, index) => (
                    <span
                      key={feature}
                      className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/70 border border-white/20"
                    >
                      {feature}
                    </span>
                  ))}
                </motion.div>
              </div>
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div 
                  className="w-2 h-2 rounded-full bg-green-400"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm font-medium">Система активна</span>
              </motion.div>
            </div>
          </BentoCard>
        </motion.section>

        {/* Alerts Section */}
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
            {alerts.map((alert, index) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
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
                <motion.span 
                  className={`text-xs px-3 py-1 rounded-full border ${averageChangeColor} border-white/15 bg-black/20`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {kpiSummary.averageChange >= 0 ? 'Общий рост' : 'Снижение'} {kpiSummary.averageChange}%
                </motion.span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { value: kpiSummary.positive, label: 'В росте', color: 'text-green-300' },
                  { value: kpiSummary.stable, label: 'Стабильно', color: 'text-yellow-300' },
                  { value: kpiSummary.negative, label: 'Снижение', color: 'text-red-300' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 text-center hover:bg-white/10 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                    <p className="text-xs text-white/60 mt-1">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </BentoCard>

            <BentoCard className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-white/60 text-sm">Эффективность работы</p>
                  <h3 className="text-white text-xl font-semibold">Показатели качества</h3>
                </div>
                <motion.span 
                  className={`text-xs px-3 py-1 rounded-full border ${
                    serviceSummary.criticalServices.length ? 'text-yellow-300 border-yellow-500/40' : 'text-emerald-300 border-emerald-400/40'
                  } bg-black/20`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {serviceSummary.criticalServices.length ? 'Есть риски' : 'Стабильная работа'}
                </motion.span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center mb-4">
                {[
                  { value: formatNumber(serviceSummary.totalActive), label: 'показателей', color: 'text-white' },
                  { value: serviceTrend.growing, label: 'растут', color: 'text-green-300' },
                  { value: serviceTrend.declining, label: 'снижаются', color: 'text-red-300' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
                    <p className="text-xs text-white/60 mt-1">{item.label}</p>
                  </motion.div>
                ))}
              </div>
              <motion.p 
                className="text-xs text-white/50 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Стабильно работают {serviceTrend.stable} показателей
              </motion.p>
              {serviceSummary.topService && (
                <motion.div 
                  className="mb-4 text-left"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <p className="text-xs uppercase text-white/50 mb-1">Лучший показатель</p>
                  <div className="text-white font-semibold">{serviceSummary.topService.label}</div>
                  <p className="text-white/60 text-sm">
                    {serviceSummary.topService.value}{serviceSummary.topService.suffix}
                  </p>
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <p className="text-xs uppercase text-white/50 mb-2">Зона внимания</p>
                {serviceSummary.criticalServices.length ? (
                  <div className="flex flex-wrap gap-2">
                    {serviceSummary.criticalServices.map((service, index) => (
                      <motion.span
                        key={service.label}
                        className="text-xs px-3 py-1 rounded-full border border-red-500/40 text-red-200 bg-red-500/5 hover:bg-red-500/10 transition-colors"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + index * 0.1 }}
                      >
                        {service.label}: {service.value}{service.suffix}
                      </motion.span>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/60 text-sm">Все показатели работают в штатном режиме</p>
                )}
              </motion.div>
            </BentoCard>
          </div>
        </motion.section>

        {/* Основные KPI */}
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
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <KPIWidget kpi={kpi} isEditing={isEditing} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Показатели эффективности */}
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
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <KPIWidget kpi={kpi} isEditing={isEditing} />
              </motion.div>
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
            
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search and filter */}
              {isEditing && customCards.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <input
                      type="text"
                      placeholder="Поиск карточек..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/40 transition-colors w-full sm:w-48"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                      >
                        ✕
                      </button>
                    )}
                  </motion.div>
                  
                  <motion.select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white text-sm focus:outline-none focus:border-white/40 transition-colors"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'Все категории' : category}
                      </option>
                    ))}
                  </motion.select>

                  {/* Pinned filter */}
                  {pinnedCardsCount > 0 && (
                    <motion.button
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${
                        showPinnedOnly
                          ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
                          : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
                      }`}
                      onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      📌 {showPinnedOnly ? 'Все' : 'Закрепленные'} ({pinnedCardsCount})
                    </motion.button>
                  )}
                </div>
              )}
              
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
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    ➕ Добавить карточку ({availableCards.length})
                  </motion.button>
                  <motion.button
                    className="px-4 py-2 rounded-full border text-sm font-medium text-white/80 border-white/30 hover:bg-white/10 hover:border-white/40 transition-colors"
                    onClick={resetLayout}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
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
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
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
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
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
            <SortableContext items={filteredCards.map(card => card.id)} strategy={rectSortingStrategy}>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 auto-rows-[minmax(220px,auto)]"
                layout
              >
                {filteredCards.map((card, index) => (
                  <SortableCard
                    key={card.id}
                    card={card}
                    isEditing={isEditing}
                    onRemove={() => removeCard(card.id)}
                    onSizeChange={(newSize) => changeCardSize(card.id, newSize)}
                    onPin={() => togglePinCard(card.id)}
                    onFavorite={() => toggleFavoriteCard(card.id)}
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
              </motion.div>
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

      {/* Рендер модальных окон */}
      <RequestsModal 
        isOpen={modal.type === 'requests'} 
        onClose={closeModal}
      />
      <VolunteersModal 
        isOpen={modal.type === 'volunteers'} 
        onClose={closeModal}
      />
      <CitizensModal 
        isOpen={modal.type === 'citizens'} 
        onClose={closeModal}
      />
      <ServicesModal 
        isOpen={modal.type === 'services'} 
        onClose={closeModal}
      />
      <ReportsModal 
        isOpen={modal.type === 'reports'} 
        onClose={closeModal}
      />
      <AlertsModal 
        isOpen={modal.type === 'alerts'} 
        onClose={closeModal}
      />
    </div>
  );
}