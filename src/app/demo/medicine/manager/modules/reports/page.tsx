'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import DemoBreadcrumbs from '@/components/demo/DemoBreadcrumbs';

// Types
export interface Report {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'generating' | 'completed' | 'failed' | 'scheduled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'financial' | 'clinical' | 'operational' | 'quality' | 'statistical';
  category: string;
  format?: 'pdf' | 'excel' | 'csv' | 'html';
  accessLevel: 'public' | 'confidential' | 'restricted';
  createdDate: string;
  updatedDate: string;
  completedDate?: string;
  createdBy: string;
  dataSource: string;
  fileSize?: string;
  downloadUrl?: string;
  isScheduled: boolean;
  schedule?: string;
  nextRun?: string;
  lastRun?: string;
  tags: string[];
  recipients: string[];
  filters: ReportFilter[];
  parameters: ReportParameter[];
  progress?: number;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  icon: string;
  parameters: ReportParameter[];
  usageCount: number;
  lastUsed?: string;
  isPopular: boolean;
}

export interface ReportFilter {
  id: string;
  name: string;
  type: string;
  value: any;
}

export interface ReportParameter {
  id: string;
  name: string;
  type: string;
  description: string;
  value: any;
  required: boolean;
}

export type ViewType = 'list' | 'grid';
export type StatusFilter = 'all' | 'draft' | 'generating' | 'completed' | 'failed' | 'scheduled';
export type TypeFilter = 'all' | 'financial' | 'clinical' | 'operational' | 'quality' | 'statistical';
export type PriorityFilter = 'all' | 'low' | 'medium' | 'high' | 'critical';
export type SortField = 'createdDate' | 'updatedDate' | 'title' | 'priority' | 'status';

// Demo Data
export const reports: Report[] = [
  {
    id: 'REP-001',
    title: 'Финансовый отчет за январь 2024',
    description: 'Полный финансовый отчет по доходам и расходам медицинского центра за январь 2024 года',
    status: 'completed',
    priority: 'high',
    type: 'financial',
    category: 'Ежемесячные',
    format: 'pdf',
    accessLevel: 'confidential',
    createdDate: '2024-01-01T08:00:00Z',
    updatedDate: '2024-01-05T14:30:00Z',
    completedDate: '2024-01-05T14:30:00Z',
    createdBy: 'Иванов А.С.',
    dataSource: 'Бухгалтерская система',
    fileSize: '2.4 MB',
    downloadUrl: '/reports/financial-jan-2024.pdf',
    isScheduled: true,
    schedule: '0 0 1 * *',
    nextRun: '2024-02-01T00:00:00Z',
    lastRun: '2024-01-01T00:00:00Z',
    tags: ['финансы', 'январь', '2024', 'ежемесячный'],
    recipients: ['finance@clinic.ru', 'director@clinic.ru'],
    filters: [
      { id: 'date-range', name: 'Период', type: 'date', value: { from: '2024-01-01', to: '2024-01-31' } },
      { id: 'department', name: 'Отделения', type: 'multi-select', value: ['all'] }
    ],
    parameters: [
      { id: 'currency', name: 'Валюта', type: 'select', description: 'Валюта отчета', value: 'RUB', required: true }
    ]
  },
  {
    id: 'REP-002',
    title: 'Клиническая статистика пациентов',
    description: 'Статистика по заболеваниям, лечениям и результатам за последний квартал',
    status: 'generating',
    priority: 'medium',
    type: 'clinical',
    category: 'Квартальные',
    format: 'excel',
    accessLevel: 'restricted',
    createdDate: '2024-01-15T09:15:00Z',
    updatedDate: '2024-01-15T09:15:00Z',
    createdBy: 'Петрова М.И.',
    dataSource: 'Медицинская база данных',
    isScheduled: false,
    tags: ['клиника', 'статистика', 'пациенты', 'квартал'],
    recipients: ['chief@clinic.ru', 'statistics@clinic.ru'],
    filters: [
      { id: 'diagnosis', name: 'Диагнозы', type: 'multi-select', value: ['all'] },
      { id: 'age-range', name: 'Возраст', type: 'range', value: { from: 0, to: 100 } }
    ],
    parameters: [
      { id: 'include-sensitive', name: 'Включить чувствительные данные', type: 'boolean', description: 'Включить персональные данные', value: false, required: false }
    ],
    progress: 65
  },
  {
    id: 'REP-003',
    title: 'Операционная эффективность',
    description: 'Анализ загруженности отделений и эффективности работы персонала',
    status: 'scheduled',
    priority: 'medium',
    type: 'operational',
    category: 'Еженедельные',
    format: 'html',
    accessLevel: 'confidential',
    createdDate: '2024-01-10T11:20:00Z',
    updatedDate: '2024-01-12T16:45:00Z',
    createdBy: 'Сидоров В.К.',
    dataSource: 'Система учета времени',
    isScheduled: true,
    schedule: '0 0 * * 1',
    nextRun: '2024-01-22T00:00:00Z',
    lastRun: '2024-01-15T00:00:00Z',
    tags: ['операции', 'эффективность', 'персонал', 'еженедельно'],
    recipients: ['operations@clinic.ru'],
    filters: [
      { id: 'departments', name: 'Отделения', type: 'multi-select', value: ['therapy', 'surgery'] },
      { id: 'time-range', name: 'Временной период', type: 'date', value: { from: '2024-01-08', to: '2024-01-14' } }
    ],
    parameters: []
  },
  {
    id: 'REP-004',
    title: 'Отчет по качеству услуг',
    description: 'Анализ удовлетворенности пациентов и качества предоставляемых медицинских услуг',
    status: 'draft',
    priority: 'low',
    type: 'quality',
    category: 'Ежемесячные',
    accessLevel: 'public',
    createdDate: '2024-01-18T14:00:00Z',
    updatedDate: '2024-01-18T14:00:00Z',
    createdBy: 'Козлова Е.П.',
    dataSource: 'Система опросов',
    isScheduled: false,
    tags: ['качество', 'удовлетворенность', 'пациенты'],
    recipients: ['quality@clinic.ru'],
    filters: [
      { id: 'service-type', name: 'Тип услуги', type: 'multi-select', value: ['consultation', 'procedure'] },
      { id: 'rating', name: 'Рейтинг', type: 'range', value: { from: 1, to: 5 } }
    ],
    parameters: []
  },
  {
    id: 'REP-005',
    title: 'Статистика лабораторных исследований',
    description: 'Детальная статистика по всем проведенным лабораторным исследованиям и анализам',
    status: 'failed',
    priority: 'critical',
    type: 'statistical',
    category: 'Ежедневные',
    format: 'csv',
    accessLevel: 'restricted',
    createdDate: '2024-01-20T07:30:00Z',
    updatedDate: '2024-01-20T08:15:00Z',
    createdBy: 'Лаборатория',
    dataSource: 'Лабораторная информационная система',
    isScheduled: true,
    schedule: '0 6 * * *',
    nextRun: '2024-01-21T06:00:00Z',
    lastRun: '2024-01-20T06:00:00Z',
    tags: ['лаборатория', 'анализы', 'ежедневно', 'статистика'],
    recipients: ['lab@clinic.ru', 'doctors@clinic.ru'],
    filters: [
      { id: 'test-type', name: 'Тип анализа', type: 'multi-select', value: ['blood', 'urine'] },
      { id: 'date', name: 'Дата', type: 'date', value: { from: '2024-01-20', to: '2024-01-20' } }
    ],
    parameters: []
  }
];

export const reportTemplates: ReportTemplate[] = [
  {
    id: 'TMP-001',
    name: 'Финансовый отчет',
    description: 'Стандартный шаблон для генерации финансовых отчетов по доходам и расходам',
    category: 'Финансы',
    type: 'financial',
    icon: '💰',
    parameters: [
      { id: 'period', name: 'Период', type: 'date-range', description: 'Период отчета', value: null, required: true },
      { id: 'currency', name: 'Валюта', type: 'select', description: 'Валюта отчета', value: 'RUB', required: true },
      { id: 'detail-level', name: 'Детализация', type: 'select', description: 'Уровень детализации данных', value: 'summary', required: false }
    ],
    usageCount: 45,
    lastUsed: '2024-01-15T10:00:00Z',
    isPopular: true
  },
  {
    id: 'TMP-002',
    name: 'Клиническая статистика',
    description: 'Шаблон для анализа клинических данных и статистики заболеваний',
    category: 'Клиника',
    type: 'clinical',
    icon: '🏥',
    parameters: [
      { id: 'diagnosis-groups', name: 'Группы диагнозов', type: 'multi-select', description: 'Группы диагнозов для анализа', value: [], required: true },
      { id: 'age-groups', name: 'Возрастные группы', type: 'range', description: 'Возрастные группы пациентов', value: { from: 0, to: 100 }, required: false },
      { id: 'time-period', name: 'Временной период', type: 'date-range', description: 'Период анализа', value: null, required: true }
    ],
    usageCount: 32,
    lastUsed: '2024-01-14T14:30:00Z',
    isPopular: true
  },
  {
    id: 'TMP-003',
    name: 'Операционная эффективность',
    description: 'Анализ эффективности работы отделений и медицинского персонала',
    category: 'Операции',
    type: 'operational',
    icon: '⚙️',
    parameters: [
      { id: 'departments', name: 'Отделения', type: 'multi-select', description: 'Отделения для анализа', value: [], required: true },
      { id: 'metrics', name: 'Метрики', type: 'multi-select', description: 'Метрики эффективности', value: ['utilization', 'waiting-time'], required: true }
    ],
    usageCount: 28,
    lastUsed: '2024-01-12T09:15:00Z',
    isPopular: false
  },
  {
    id: 'TMP-004',
    name: 'Качество услуг',
    description: 'Шаблон для анализа удовлетворенности пациентов и качества услуг',
    category: 'Качество',
    type: 'quality',
    icon: '⭐',
    parameters: [
      { id: 'survey-period', name: 'Период опроса', type: 'date-range', description: 'Период проведения опросов', value: null, required: true },
      { id: 'min-rating', name: 'Минимальный рейтинг', type: 'number', description: 'Минимальный рейтинг для включения', value: 3, required: false }
    ],
    usageCount: 19,
    lastUsed: '2024-01-10T16:20:00Z',
    isPopular: false
  },
  {
    id: 'TMP-005',
    name: 'Лабораторная статистика',
    description: 'Статистический анализ лабораторных исследований и тестов',
    category: 'Лаборатория',
    type: 'statistical',
    icon: '🔬',
    parameters: [
      { id: 'test-types', name: 'Типы анализов', type: 'multi-select', description: 'Типы лабораторных анализов', value: [], required: true },
      { id: 'result-ranges', name: 'Диапазоны результатов', type: 'range', description: 'Диапазоны нормальных значений', value: null, required: false }
    ],
    usageCount: 23,
    lastUsed: '2024-01-08T11:45:00Z',
    isPopular: false
  },
  {
    id: 'TMP-006',
    name: 'Отчет по персоналу',
    description: 'Анализ рабочего времени, нагрузки и эффективности медицинского персонала',
    category: 'Персонал',
    type: 'operational',
    icon: '👥',
    parameters: [
      { id: 'staff-categories', name: 'Категории персонала', type: 'multi-select', description: 'Категории сотрудников', value: [], required: true },
      { id: 'work-hours', name: 'Рабочие часы', type: 'time-range', description: 'Период рабочего времени', value: null, required: false }
    ],
    usageCount: 15,
    lastUsed: '2024-01-05T13:20:00Z',
    isPopular: false
  }
];

// Utility Functions
export const getStatusConfig = (status: string) => {
  switch (status) {
    case 'draft':
      return { 
        label: 'Черновик', 
        icon: '📝', 
        color: 'border-gray-500/30 bg-gray-500/10 text-gray-400' 
      };
    case 'generating':
      return { 
        label: 'Генерируется', 
        icon: '🔄', 
        color: 'border-blue-500/30 bg-blue-500/10 text-blue-400' 
      };
    case 'completed':
      return { 
        label: 'Завершен', 
        icon: '✅', 
        color: 'border-green-500/30 bg-green-500/10 text-green-400' 
      };
    case 'failed':
      return { 
        label: 'Ошибка', 
        icon: '❌', 
        color: 'border-red-500/30 bg-red-500/10 text-red-400' 
      };
    case 'scheduled':
      return { 
        label: 'Запланирован', 
        icon: '⏰', 
        color: 'border-purple-500/30 bg-purple-500/10 text-purple-400' 
      };
    default:
      return { 
        label: 'Неизвестно', 
        icon: '❓', 
        color: 'border-gray-500/30 bg-gray-500/10 text-gray-400' 
      };
  }
};

export const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case 'low':
      return { 
        label: 'Низкий', 
        icon: '🔽', 
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' 
      };
    case 'medium':
      return { 
        label: 'Средний', 
        icon: '🔼', 
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
      };
    case 'high':
      return { 
        label: 'Высокий', 
        icon: '⏫', 
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' 
      };
    case 'critical':
      return { 
        label: 'Критический', 
        icon: '🚨', 
        color: 'bg-red-500/20 text-red-400 border-red-500/30' 
      };
    default:
      return { 
        label: 'Неизвестно', 
        icon: '❓', 
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' 
      };
  }
};

export const getTypeConfig = (type: string) => {
  switch (type) {
    case 'financial':
      return { 
        label: 'Финансовый', 
        icon: '💰', 
        color: 'text-green-400' 
      };
    case 'clinical':
      return { 
        label: 'Клинический', 
        icon: '🏥', 
        color: 'text-blue-400' 
      };
    case 'operational':
      return { 
        label: 'Операционный', 
        icon: '⚙️', 
        color: 'text-orange-400' 
      };
    case 'quality':
      return { 
        label: 'Качество', 
        icon: '⭐', 
        color: 'text-yellow-400' 
      };
    case 'statistical':
      return { 
        label: 'Статистический', 
        icon: '📈', 
        color: 'text-purple-400' 
      };
    default:
      return { 
        label: 'Неизвестно', 
        icon: '❓', 
        color: 'text-gray-400' 
      };
  }
};

export const getFormatConfig = (format: string) => {
  switch (format) {
    case 'pdf':
      return { 
        label: 'PDF', 
        icon: '📄', 
        color: 'text-red-400' 
      };
    case 'excel':
      return { 
        label: 'Excel', 
        icon: '📊', 
        color: 'text-green-400' 
      };
    case 'csv':
      return { 
        label: 'CSV', 
        icon: '📋', 
        color: 'text-blue-400' 
      };
    case 'html':
      return { 
        label: 'HTML', 
        icon: '🌐', 
        color: 'text-orange-400' 
      };
    default:
      return { 
        label: 'Неизвестно', 
        icon: '❓', 
        color: 'text-gray-400' 
      };
  }
};

export const getAccessLevelConfig = (accessLevel: string) => {
  switch (accessLevel) {
    case 'public':
      return { 
        label: 'Публичный', 
        icon: '🌐', 
        color: 'bg-green-500/20 text-green-400 border-green-500/30' 
      };
    case 'confidential':
      return { 
        label: 'Конфиденциальный', 
        icon: '🔒', 
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' 
      };
    case 'restricted':
      return { 
        label: 'Ограниченный', 
        icon: '🚫', 
        color: 'bg-red-500/20 text-red-400 border-red-500/30' 
      };
    default:
      return { 
        label: 'Неизвестно', 
        icon: '❓', 
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' 
      };
  }
};

export const getScheduledReports = (): Report[] => {
  return reports.filter(r => r.isScheduled);
};

export const getRecentReports = (count: number = 5): Report[] => {
  return reports
    .sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime())
    .slice(0, count);
};

export const getPopularTemplates = (): ReportTemplate[] => {
  return reportTemplates.filter(t => t.isPopular);
};

export const getReportProgress = (report: Report): number => {
  return report.progress || 0;
};

// Main Component
export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [sortBy, setSortBy] = useState<SortField>('updatedDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [view, setView] = useState<ViewType>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'reports' | 'templates'>('reports');
  const [isClient, setIsClient] = useState(false);

  // Устанавливаем флаг клиента после гидратации
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Фильтрация и сортировка отчетов
  const filteredReports = useMemo(() => {
    let filtered = reports.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           report.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      const matchesType = typeFilter === 'all' || report.type === typeFilter;
      const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesType && matchesPriority;
    });

    // Сортировка
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'createdDate':
          aValue = new Date(a.createdDate).getTime();
          bValue = new Date(b.createdDate).getTime();
          break;
        case 'updatedDate':
          aValue = new Date(a.updatedDate).getTime();
          bValue = new Date(b.updatedDate).getTime();
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'status':
          const statusOrder = { generating: 0, scheduled: 1, completed: 2, draft: 3, failed: 4 };
          aValue = statusOrder[a.status];
          bValue = statusOrder[b.status];
          break;
        default:
          aValue = new Date(a.updatedDate).getTime();
          bValue = new Date(b.updatedDate).getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchQuery, statusFilter, typeFilter, priorityFilter, sortBy, sortDirection]);

  // Статистика
  const stats = useMemo(() => {
    const scheduled = getScheduledReports();
    const recent = getRecentReports(5);
    const popularTemplates = getPopularTemplates();
    
    return {
      total: reports.length,
      completed: reports.filter(r => r.status === 'completed').length,
      scheduled: scheduled.length,
      generating: reports.filter(r => r.status === 'generating').length,
      drafts: reports.filter(r => r.status === 'draft').length,
      failed: reports.filter(r => r.status === 'failed').length,
      templates: reportTemplates.length,
      popularTemplates: popularTemplates.length,
    };
  }, []);

  const handleFilterReset = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setPriorityFilter('all');
    setShowFilters(false);
  }, []);

  const handleReportSelect = useCallback((report: Report) => {
    setSelectedReport(report);
  }, []);

  const handleTemplateSelect = useCallback((template: ReportTemplate) => {
    setSelectedTemplate(template);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedReport(null);
    setSelectedTemplate(null);
  }, []);

  // Анимации
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Всегда показываем фильтры на десктопе, только на мобильных используем состояние
  const shouldShowFilters = showFilters || (isClient && typeof window !== 'undefined' && window.innerWidth >= 1024);

  const statsData = [
    { label: 'Всего отчетов', value: stats.total, icon: '📊', color: 'from-blue-500 to-cyan-500' },
    { label: 'Завершены', value: stats.completed, icon: '✅', color: 'from-green-500 to-emerald-500' },
    { label: 'Запланированы', value: stats.scheduled, icon: '⏰', color: 'from-purple-500 to-purple-600' },
    { label: 'Генерируются', value: stats.generating, icon: '🔄', color: 'from-orange-500 to-orange-600' },
    { label: 'Черновики', value: stats.drafts, icon: '📝', color: 'from-gray-500 to-gray-600' },
    { label: 'Ошибки', value: stats.failed, icon: '❌', color: 'from-red-500 to-pink-600' },
    { label: 'Шаблоны', value: stats.templates, icon: '📋', color: 'from-indigo-500 to-indigo-600' },
    { label: 'Популярные', value: stats.popularTemplates, icon: '⭐', color: 'from-yellow-500 to-yellow-600' }
  ];

  const viewOptions = [
    { value: 'list' as ViewType, label: 'Список', icon: '📋' },
    { value: 'grid' as ViewType, label: 'Сетка', icon: '⏹️' }
  ];

  const filterOptions = [
    {
      label: 'Статус',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'all', label: 'Все статусы' },
        { value: 'draft', label: 'Черновики' },
        { value: 'generating', label: 'Генерируются' },
        { value: 'completed', label: 'Завершены' },
        { value: 'failed', label: 'Ошибки' },
        { value: 'scheduled', label: 'Запланированы' }
      ]
    },
    {
      label: 'Тип отчета',
      value: typeFilter,
      onChange: setTypeFilter,
      options: [
        { value: 'all', label: 'Все типы' },
        { value: 'financial', label: 'Финансовые' },
        { value: 'clinical', label: 'Клинические' },
        { value: 'operational', label: 'Операционные' },
        { value: 'quality', label: 'Качество' },
        { value: 'statistical', label: 'Статистические' }
      ]
    },
    {
      label: 'Приоритет',
      value: priorityFilter,
      onChange: setPriorityFilter,
      options: [
        { value: 'all', label: 'Все приоритеты' },
        { value: 'low', label: 'Низкий' },
        { value: 'medium', label: 'Средний' },
        { value: 'high', label: 'Высокий' },
        { value: 'critical', label: 'Критический' }
      ]
    },
    {
      label: 'Сортировка',
      value: sortBy,
      onChange: setSortBy,
      options: [
        { value: 'updatedDate', label: 'По дате обновления' },
        { value: 'createdDate', label: 'По дате создания' },
        { value: 'title', label: 'По названию' },
        { value: 'priority', label: 'По приоритету' },
        { value: 'status', label: 'По статусу' }
      ]
    },
    {
      label: 'Направление',
      value: sortDirection,
      onChange: setSortDirection,
      options: [
        { value: 'desc', label: 'Сначала новые' },
        { value: 'asc', label: 'Сначала старые' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-4 sm:mt-6 gap-3 sm:gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Управление отчетами</h1>
              <p className="text-white/60 text-xs sm:text-sm lg:text-base">
                Создание, генерация и управление аналитическими отчетами
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="relative flex-1 sm:max-w-xs">
                <div className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-white/40">
                </div>
              </div>
              
              <Link
                href="/demo/medicine/manager"
                className="px-3 sm:px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 text-sm font-medium text-white flex items-center justify-center gap-2 min-w-[120px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Назад</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex mb-6"
        >
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
            {[
              { id: 'reports' as const, label: 'Отчеты', icon: '📊', count: stats.total },
              { id: 'templates' as const, label: 'Шаблоны', icon: '📝', count: stats.templates }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.5 rounded-full text-xs bg-white/10">
                  {tab.count}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <div className="flex flex-col gap-3 sm:gap-4 flex-1">
            {/* Mobile Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 text-sm font-medium text-white flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Фильтры {showFilters ? '▲' : '▼'}</span>
            </motion.button>

            {/* Filters */}
            {activeTab === 'reports' && (
              <div className={`${shouldShowFilters ? 'grid' : 'hidden lg:grid'} grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 flex-1 transition-all duration-300`}>
                {filterOptions.map((filter, index) => (
                  <motion.div
                    key={filter.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="flex flex-col"
                  >
                    <label className="text-xs text-white/60 mb-1 font-medium">{filter.label}</label>
                    <select
                      value={filter.value}
                      onChange={(e) => filter.onChange(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-white text-sm appearance-none cursor-pointer"
                    >
                      {filter.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex gap-2 sm:gap-3">
              {/* View Toggle */}
              {activeTab === 'reports' && (
                <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 flex-1 sm:flex-none">
                  {viewOptions.map(({ value, label, icon }) => (
                    <motion.button
                      key={value}
                      onClick={() => setView(value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 min-w-0 ${
                        view === value
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{icon}</span>
                      <span className="hidden xs:inline text-xs sm:text-sm">{label}</span>
                    </motion.button>
                  ))}
                </div>
              )}
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 text-sm font-medium text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 min-w-[140px]"
                onClick={() => setActiveTab('templates')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Создать отчет</span>
                <span className="sm:hidden">Создать</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-2 sm:gap-3 mb-6 sm:mb-8"
        >
          {statsData.map((stat, index) => (
            <motion.div 
              key={stat.label}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                  <span className="text-sm sm:text-base">{stat.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg sm:text-xl font-bold text-white truncate">{stat.value}</div>
                  <div className="text-white/60 text-xs truncate">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 sm:mb-8"
        >
          {activeTab === 'reports' ? (
            <>
              {view === 'list' ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  {/* Table Header - Hidden on mobile */}
                  <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-white/60 text-sm font-medium">
                    <div className="col-span-4">Отчет & Описание</div>
                    <div className="col-span-2">Тип & Статус</div>
                    <div className="col-span-2">Даты</div>
                    <div className="col-span-2">Приоритет & Доступ</div>
                    <div className="col-span-2">Действия</div>
                  </div>
                  
                  {/* Table Rows */}
                  <div className="divide-y divide-white/10">
                    {filteredReports.map((report, index) => (
                      <ReportRow
                        key={report.id}
                        report={report}
                        index={index}
                        onSelect={handleReportSelect}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {filteredReports.map((report, index) => (
                    <ReportGrid
                      key={report.id}
                      report={report}
                      index={index}
                      onSelect={handleReportSelect}
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {filteredReports.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 sm:py-12"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4 mx-auto">
                    📊
                  </div>
                  <h3 className="text-white font-semibold text-base sm:text-lg mb-1 sm:mb-2">Отчеты не найдены</h3>
                  <p className="text-white/60 text-xs sm:text-sm mb-3 sm:mb-4 max-w-xs mx-auto">
                    Попробуйте изменить параметры поиска или фильтры
                  </p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFilterReset}
                    className="px-3 sm:px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm"
                  >
                    Сбросить фильтры
                  </motion.button>
                </motion.div>
              )}
            </>
          ) : (
            <TemplatesTab 
              templates={reportTemplates}
              onTemplateSelect={handleTemplateSelect}
            />
          )}
        </motion.div>
      </div>

      {/* Report Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <ReportDetailModal
            report={selectedReport}
            onClose={handleModalClose}
          />
        )}
      </AnimatePresence>

      {/* Template Detail Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <TemplateDetailModal
            template={selectedTemplate}
            onClose={handleModalClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Report Row Component
function ReportRow({ report, index, onSelect }: any) {
  const statusConfig = getStatusConfig(report.status);
  const priorityConfig = getPriorityConfig(report.priority);
  const typeConfig = getTypeConfig(report.type);
  const accessConfig = getAccessLevelConfig(report.accessLevel);
  const progress = getReportProgress(report);

  const handleClick = useCallback(() => {
    onSelect(report);
  }, [onSelect, report]);

  const handleActionClick = useCallback((e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    console.log(`${action} clicked for report ${report.id}`);
  }, [report.id]);

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: "easeOut"
          }
        }
      }}
      custom={index}
      className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/5 transition-colors cursor-pointer group"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Mobile Layout */}
      <div className="sm:hidden space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="font-semibold text-white text-base mb-1">
              {report.title}
            </div>
            <div className="text-white/60 text-sm line-clamp-2">
              {report.description}
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color} flex-shrink-0 ml-2`}>
            {statusConfig.icon}
          </span>
        </div>

        {/* Type & Priority */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className={typeConfig.color}>{typeConfig.icon}</span>
            <span className="text-white text-sm">{typeConfig.label}</span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}>
            {priorityConfig.icon}
          </div>
        </div>

        {/* Progress */}
        {report.status === 'generating' && (
          <div>
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>Генерация...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Dates & Actions */}
        <div className="flex justify-between items-center">
          <div>
            <div className="text-white/60 text-xs">Обновлен</div>
            <div className="text-white font-medium text-sm">
              {new Date(report.updatedDate).toLocaleDateString('ru-RU')}
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSelect(report);
            }}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
            aria-label="Просмотр отчета"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <>
        {/* Title & Description */}
        <div className="hidden sm:block col-span-4">
          <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
            {report.title}
          </div>
          <div className="text-white/60 text-sm mt-1 line-clamp-2">
            {report.description}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {report.tags.slice(0, 3).map((tag: string) => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/60">
                #{tag}
              </span>
            ))}
            {report.tags.length > 3 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/60">
                +{report.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Type & Status */}
        <div className="hidden sm:block col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <span className={typeConfig.color}>{typeConfig.icon}</span>
            <span className="text-white text-sm">{typeConfig.label}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
            {statusConfig.icon} {statusConfig.label}
          </span>
          {report.status === 'generating' && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-white/60 mb-1">
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="hidden sm:block col-span-2">
          <div className="text-white font-medium text-sm">
            Создан: {new Date(report.createdDate).toLocaleDateString('ru-RU')}
          </div>
          <div className="text-white/60 text-sm">
            Обновлен: {new Date(report.updatedDate).toLocaleDateString('ru-RU')}
          </div>
          {report.completedDate && (
            <div className="text-green-400 text-xs">
              Завершен: {new Date(report.completedDate).toLocaleDateString('ru-RU')}
            </div>
          )}
        </div>

        {/* Priority & Access */}
        <div className="hidden sm:block col-span-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color} mb-2 inline-block`}>
            {priorityConfig.icon} {priorityConfig.label}
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${accessConfig.color}`}>
            {accessConfig.icon} {accessConfig.label}
          </div>
        </div>

        {/* Actions */}
        <div className="hidden sm:flex col-span-2 items-center justify-end">
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSelect(report);
              }}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
              title="Просмотр отчета"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            {report.status === 'completed' && report.downloadUrl && (
              <button 
                onClick={(e) => handleActionClick(e, 'download')}
                className="p-2 rounded-lg bg-green-500/20 border border-green-500/30 hover:border-green-500/50 transition-colors text-green-400 hover:text-green-300"
                title="Скачать отчет"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            )}
            {(report.status === 'draft' || report.status === 'failed') && (
              <button 
                onClick={(e) => handleActionClick(e, 'generate')}
                className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 transition-colors text-blue-400 hover:text-blue-300"
                title="Запустить генерацию"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
            <button 
              onClick={(e) => handleActionClick(e, 'settings')}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
              title="Настройки"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </>
    </motion.div>
  );
}

// Report Grid Component
function ReportGrid({ report, index, onSelect }: any) {
  const statusConfig = getStatusConfig(report.status);
  const priorityConfig = getPriorityConfig(report.priority);
  const typeConfig = getTypeConfig(report.type);
  const formatConfig = report.format ? getFormatConfig(report.format) : null;
  const progress = getReportProgress(report);

  const handleClick = useCallback(() => {
    onSelect(report);
  }, [onSelect, report]);

  const handleActionClick = useCallback((e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    console.log(`${action} clicked for report ${report.id}`);
  }, [report.id]);

  return (
    <motion.div
      variants={{
        hidden: { scale: 0.9, opacity: 0 },
        visible: {
          scale: 1,
          opacity: 1,
          transition: {
            duration: 0.4,
            ease: "easeOut"
          }
        }
      }}
      custom={index}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-base sm:text-lg group-hover:text-blue-400 transition-colors mb-1 truncate">
            {report.title}
          </h3>
          <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm">
            <span className={typeConfig.color}>{typeConfig.icon}</span>
            <span>{typeConfig.label}</span>
            <span>•</span>
            <span>{report.category}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color} flex-shrink-0`}>
            {statusConfig.icon}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}>
            {priorityConfig.icon}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-3 sm:mb-4">
        <p className="text-white/70 text-sm line-clamp-2">{report.description}</p>
      </div>

      {/* Progress */}
      {report.status === 'generating' && (
        <div className="mb-3 sm:mb-4">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Генерация отчета...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Details */}
      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 text-sm">
        <div className="flex items-center justify-between">
          <div className="text-white/60">Формат</div>
          {formatConfig ? (
            <div className="flex items-center gap-1">
              <span className={formatConfig.color}>{formatConfig.icon}</span>
              <span className="text-white">{formatConfig.label}</span>
            </div>
          ) : (
            <div className="text-white/60">—</div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-white/60">Размер</div>
          <div className="text-white">{report.fileSize || '—'}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-white/60">Обновлен</div>
          <div className="text-white">{new Date(report.updatedDate).toLocaleDateString('ru-RU')}</div>
        </div>

        {report.isScheduled && (
          <div className="flex items-center justify-between">
            <div className="text-white/60">Следующий запуск</div>
            <div className="text-green-400 text-xs">
              {report.nextRun ? new Date(report.nextRun).toLocaleDateString('ru-RU') : '—'}
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
        {report.tags.slice(0, 2).map((tag: string) => (
          <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/60">
            #{tag}
          </span>
        ))}
        {report.tags.length > 2 && (
          <span className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/60">
            +{report.tags.length - 2}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="text-white/60">
            {report.createdBy}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSelect(report);
            }}
            className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
          >
            Подробнее
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Templates Tab Component
function TemplatesTab({ templates, onTemplateSelect }: any) {
  const popularTemplates = getPopularTemplates();
  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <div className="space-y-6">
      {/* Popular Templates */}
      {popularTemplates.length > 0 && (
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Популярные шаблоны</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                onClick={() => onTemplateSelect(template)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl text-blue-400">
                    {template.icon}
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                    Популярный
                  </span>
                </div>
                <h4 className="font-semibold text-white text-lg mb-2 group-hover:text-blue-400 transition-colors">
                  {template.name}
                </h4>
                <p className="text-white/60 text-sm mb-4 line-clamp-2">
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">{template.category}</span>
                  <button className="px-3 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm">
                    Использовать
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Templates by Category */}
      <div>
        <h3 className="text-white font-semibold text-lg mb-4">Все шаблоны</h3>
        <div className="space-y-6">
          {categories.map(category => {
            const categoryTemplates = templates.filter(t => t.category === category);
            return (
              <div key={category}>
                <h4 className="text-white font-medium text-base mb-3 border-b border-white/10 pb-2">
                  {category}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryTemplates.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                      onClick={() => onTemplateSelect(template)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-lg text-blue-400">
                          {template.icon}
                        </div>
                        <h5 className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">
                          {template.name}
                        </h5>
                      </div>
                      <p className="text-white/60 text-xs line-clamp-2 mb-3">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/40 text-xs">
                          {template.parameters.length} параметров
                        </span>
                        <button className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors text-xs">
                          Выбрать
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Report Detail Modal Component
function ReportDetailModal({ report, onClose }: any) {
  const [activeTab, setActiveTab] = useState<'overview' | 'parameters' | 'history'>('overview');
  
  const statusConfig = getStatusConfig(report.status);
  const priorityConfig = getPriorityConfig(report.priority);
  const typeConfig = getTypeConfig(report.type);
  const formatConfig = report.format ? getFormatConfig(report.format) : null;
  const accessConfig = getAccessLevelConfig(report.accessLevel);
  const progress = getReportProgress(report);

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: '📋' },
    { id: 'parameters' as const, label: 'Параметры', icon: '⚙️' },
    { id: 'history' as const, label: 'История', icon: '📜' }
  ];

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-white/10 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">{report.title}</h2>
              <p className="text-white/60 text-sm mt-1">{report.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Header Info */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/60 text-sm mb-2">Статус отчета</div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                  {statusConfig.icon} {statusConfig.label}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}>
                  {priorityConfig.icon} {priorityConfig.label}
                </span>
              </div>
              {report.status === 'generating' && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Прогресс</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/60 text-sm mb-2">Тип и формат</div>
              <div className="flex items-center gap-2 mb-1">
                <span className={typeConfig.color}>{typeConfig.icon}</span>
                <span className="text-white font-medium">{typeConfig.label}</span>
              </div>
              {formatConfig && (
                <div className="flex items-center gap-2">
                  <span className={formatConfig.color}>{formatConfig.icon}</span>
                  <span className="text-white">{formatConfig.label}</span>
                </div>
              )}
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/60 text-sm mb-2">Даты</div>
              <div className="text-white text-sm">Создан: {new Date(report.createdDate).toLocaleDateString('ru-RU')}</div>
              <div className="text-white text-sm">Обновлен: {new Date(report.updatedDate).toLocaleDateString('ru-RU')}</div>
              {report.completedDate && (
                <div className="text-green-400 text-sm">Завершен: {new Date(report.completedDate).toLocaleDateString('ru-RU')}</div>
              )}
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/60 text-sm mb-2">Доступ и размер</div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${accessConfig.color} mb-2 inline-block`}>
                {accessConfig.icon} {accessConfig.label}
              </div>
              {report.fileSize && (
                <div className="text-white text-sm">Размер: {report.fileSize}</div>
              )}
              <div className="text-white/60 text-sm">{report.recipients.length} получателей</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto mb-6 pb-2 -mx-2 px-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap mr-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'overview' && <ReportOverviewTab report={report} />}
            {activeTab === 'parameters' && <ReportParametersTab report={report} />}
            {activeTab === 'history' && <ReportHistoryTab report={report} />}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/10">
            {report.status === 'completed' && report.downloadUrl && (
              <button className="px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Скачать отчет
              </button>
            )}
            {(report.status === 'draft' || report.status === 'failed') && (
              <button className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Запустить генерацию
              </button>
            )}
            {report.status === 'generating' && (
              <button className="px-4 py-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30 transition-colors text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Приостановить
              </button>
            )}
            <button className="px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-colors text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Поделиться
            </button>
            <button className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Удалить
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Tab Components for Report Detail Modal
function ReportOverviewTab({ report }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Основная информация</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Источник данных:</span>
              <span className="text-white text-right">{report.dataSource}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Категория:</span>
              <span className="text-white">{report.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Создал:</span>
              <span className="text-white">{report.createdBy}</span>
            </div>
            {report.isScheduled && (
              <>
                <div className="flex justify-between">
                  <span className="text-white/60">Расписание:</span>
                  <span className="text-white">{report.schedule}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Следующий запуск:</span>
                  <span className="text-green-400">
                    {report.nextRun ? new Date(report.nextRun).toLocaleString('ru-RU') : '—'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Получатели</h3>
          <div className="space-y-2">
            {report.recipients.map((recipient: string, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="text-green-400">✓</span>
                <span className="text-white">{recipient}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Фильтры отчета</h3>
          <div className="space-y-3">
            {report.filters.map((filter: any) => (
              <div key={filter.id} className="flex justify-between items-center text-sm">
                <span className="text-white/60">{filter.name}:</span>
                <span className="text-white text-right">
                  {typeof filter.value === 'object' 
                    ? `${filter.value.from} - ${filter.value.to}`
                    : Array.isArray(filter.value)
                    ? filter.value.join(', ')
                    : filter.value
                  }
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Теги</h3>
          <div className="flex flex-wrap gap-2">
            {report.tags.map((tag: string, index: number) => (
              <span key={index} className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportParametersTab({ report }: any) {
  return (
    <div className="space-y-4">
      {report.parameters.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-gray-500/20 flex items-center justify-center text-2xl mb-4 mx-auto">
            ⚙️
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">Параметры не настроены</h3>
          <p className="text-white/60 text-sm">
            Для этого отчета не заданы дополнительные параметры.
          </p>
        </div>
      ) : (
        report.parameters.map((param: any) => (
          <div key={param.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-white text-sm sm:text-base">{param.name}</h4>
                <p className="text-white/60 text-sm">{param.description}</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                {param.type}
              </span>
            </div>
            <div className="text-white text-sm">
              Значение: <span className="font-medium">{String(param.value)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function ReportHistoryTab({ report }: any) {
  const history = [
    { date: report.createdDate, action: 'Создан', user: report.createdBy },
    { date: report.updatedDate, action: 'Обновлен', user: report.createdBy },
    ...(report.completedDate ? [{ date: report.completedDate, action: 'Завершен', user: 'Система' }] : []),
    ...(report.lastRun ? [{ date: report.lastRun, action: 'Последний запуск', user: 'Система' }] : [])
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
            {item.action === 'Создан' && '📝'}
            {item.action === 'Обновлен' && '✏️'}
            {item.action === 'Завершен' && '✅'}
            {item.action === 'Последний запуск' && '🔄'}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-white text-sm">{item.action}</span>
              <span className="text-white/60 text-xs">
                {new Date(item.date).toLocaleString('ru-RU')}
              </span>
            </div>
            <p className="text-white/60 text-sm">Пользователь: {item.user}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Template Detail Modal Component
function TemplateDetailModal({ template, onClose }: any) {
  const typeConfig = getTypeConfig(template.type);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-white/10 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl text-blue-400">
                {template.icon}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">{template.name}</h2>
                <p className="text-white/60 text-sm mt-1">{template.category}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-white text-sm sm:text-base mb-2">Описание</h3>
            <p className="text-white/70 text-sm">{template.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Параметры шаблона</h3>
            {template.parameters.length === 0 ? (
              <p className="text-white/60 text-sm">Для этого шаблона не требуется дополнительных параметров.</p>
            ) : (
              <div className="space-y-3">
                {template.parameters.map((param: any) => (
                  <div key={param.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white text-sm">{param.name}</h4>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                        {param.type}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm mb-3">{param.description}</p>
                    <div className="text-white text-sm">
                      Значение по умолчанию: <span className="font-medium">{String(param.value || 'не задано')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-6 border-t border-white/10">
            <button className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 text-sm font-medium text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Использовать шаблон
            </button>
            <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Создать копию
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}