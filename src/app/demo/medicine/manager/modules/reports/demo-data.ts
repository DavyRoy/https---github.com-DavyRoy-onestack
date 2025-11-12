export interface Report {
  id: string;
  title: string;
  type: 'financial' | 'clinical' | 'operational' | 'quality' | 'statistical';
  category: string;
  description: string;
  status: 'draft' | 'generating' | 'completed' | 'failed' | 'scheduled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdBy: string;
  createdDate: string;
  updatedDate: string;
  scheduledDate?: string;
  completedDate?: string;
  format: 'pdf' | 'excel' | 'csv' | 'html';
  dataSource: string;
  filters: ReportFilter[];
  parameters: ReportParameter[];
  fileSize?: string;
  downloadUrl?: string;
  accessLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  recipients: string[];
  tags: string[];
  lastRun?: string;
  nextRun?: string;
  schedule?: string;
  isScheduled: boolean;
}

export interface ReportFilter {
  id: string;
  name: string;
  type: 'date' | 'select' | 'multiselect' | 'number' | 'text';
  value: any;
  options?: string[];
  required: boolean;
}

export interface ReportParameter {
  id: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array';
  value: any;
  description: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: Report['type'];
  description: string;
  icon: string;
  category: string;
  popular: boolean;
  parameters: ReportParameter[];
}

// Демо данные отчетов
export const reports: Report[] = [
  {
    id: 'rep-001',
    title: 'Финансовый отчет за январь 2024',
    type: 'financial',
    category: 'Финансы',
    description: 'Полный финансовый отчет по доходам, расходам и прибыли за январь 2024 года',
    status: 'completed',
    priority: 'high',
    createdBy: 'Финансовый отдел',
    createdDate: '2024-01-25',
    updatedDate: '2024-01-28',
    completedDate: '2024-01-28',
    format: 'pdf',
    dataSource: 'Финансовая система',
    filters: [
      {
        id: 'filter-001',
        name: 'Период',
        type: 'date',
        value: { from: '2024-01-01', to: '2024-01-31' },
        required: true
      },
      {
        id: 'filter-002',
        name: 'Отделения',
        type: 'multiselect',
        value: ['Все отделения'],
        options: ['Все отделения', 'Терапия', 'Хирургия', 'Кардиология', 'Неврология'],
        required: false
      }
    ],
    parameters: [
      {
        id: 'param-001',
        name: 'Включить детализацию',
        type: 'boolean',
        value: true,
        description: 'Включить детализацию по каждому отделению'
      }
    ],
    fileSize: '2.4 MB',
    downloadUrl: '/reports/financial-january-2024.pdf',
    accessLevel: 'confidential',
    recipients: ['Директор', 'Главный врач', 'Финансовый отдел'],
    tags: ['финансы', 'ежемесячный', 'доходы', 'расходы'],
    lastRun: '2024-01-28T10:30:00Z',
    isScheduled: true,
    schedule: '0 0 1 * *',
    nextRun: '2024-02-01T00:00:00Z'
  },
  {
    id: 'rep-002',
    title: 'Статистика пациентов по отделениям',
    type: 'statistical',
    category: 'Статистика',
    description: 'Анализ количества пациентов, длительности лечения и эффективности по отделениям',
    status: 'completed',
    priority: 'medium',
    createdBy: 'Статистический отдел',
    createdDate: '2024-01-24',
    updatedDate: '2024-01-27',
    completedDate: '2024-01-27',
    format: 'excel',
    dataSource: 'Медицинская информационная система',
    filters: [
      {
        id: 'filter-003',
        name: 'Период',
        type: 'date',
        value: { from: '2024-01-01', to: '2024-01-24' },
        required: true
      },
      {
        id: 'filter-004',
        name: 'Тип отделения',
        type: 'select',
        value: 'Все отделения',
        options: ['Все отделения', 'Стационар', 'Поликлиника', 'Диагностика'],
        required: false
      }
    ],
    parameters: [
      {
        id: 'param-002',
        name: 'Группировка',
        type: 'string',
        value: 'по неделям',
        description: 'Способ группировки данных'
      }
    ],
    fileSize: '1.8 MB',
    downloadUrl: '/reports/patient-stats-january-2024.xlsx',
    accessLevel: 'internal',
    recipients: ['Главный врач', 'Заведующие отделениями', 'Статистический отдел'],
    tags: ['пациенты', 'статистика', 'отделения', 'эффективность'],
    lastRun: '2024-01-27T14:15:00Z',
    isScheduled: false
  },
  {
    id: 'rep-003',
    title: 'Отчет по качеству медицинской помощи',
    type: 'quality',
    category: 'Качество',
    description: 'Анализ показателей качества медицинской помощи и удовлетворенности пациентов',
    status: 'generating',
    priority: 'high',
    createdBy: 'Отдел качества',
    createdDate: '2024-01-28',
    updatedDate: '2024-01-28',
    format: 'pdf',
    dataSource: 'Система качества, Опросы пациентов',
    filters: [
      {
        id: 'filter-005',
        name: 'Период оценки',
        type: 'date',
        value: { from: '2024-01-01', to: '2024-01-28' },
        required: true
      }
    ],
    parameters: [
      {
        id: 'param-003',
        name: 'Включить комментарии',
        type: 'boolean',
        value: true,
        description: 'Включить текстовые комментарии пациентов'
      }
    ],
    accessLevel: 'confidential',
    recipients: ['Главный врач', 'Отдел качества', 'Методический совет'],
    tags: ['качество', 'удовлетворенность', 'пациенты', 'оценка'],
    lastRun: '2024-01-28T09:00:00Z',
    isScheduled: true,
    schedule: '0 0 * * 1',
    nextRun: '2024-02-05T00:00:00Z'
  },
  {
    id: 'rep-004',
    title: 'Операционные показатели работы отделения',
    type: 'operational',
    category: 'Операции',
    description: 'Ключевые операционные показатели эффективности работы медицинского учреждения',
    status: 'completed',
    priority: 'medium',
    createdBy: 'Операционный отдел',
    createdDate: '2024-01-26',
    updatedDate: '2024-01-27',
    completedDate: '2024-01-27',
    format: 'html',
    dataSource: 'Операционная система, МИС',
    filters: [
      {
        id: 'filter-006',
        name: 'Отделение',
        type: 'select',
        value: 'Все отделения',
        options: ['Все отделения', 'Терапия', 'Хирургия', 'Кардиология', 'Неврология', 'Лаборатория'],
        required: true
      },
      {
        id: 'filter-007',
        name: 'Показатели',
        type: 'multiselect',
        value: ['Все показатели'],
        options: ['Все показатели', 'Загрузка мощностей', 'Время ожидания', 'Эффективность персонала'],
        required: false
      }
    ],
    parameters: [],
    fileSize: '845 KB',
    downloadUrl: '/reports/operational-metrics-january-2024.html',
    accessLevel: 'internal',
    recipients: ['Операционный директор', 'Заведующие отделениями'],
    tags: ['операции', 'показатели', 'эффективность', 'мощности'],
    lastRun: '2024-01-27T16:45:00Z',
    isScheduled: false
  },
  {
    id: 'rep-005',
    title: 'Клинические исходы лечения',
    type: 'clinical',
    category: 'Клиника',
    description: 'Анализ клинических исходов лечения по основным нозологиям',
    status: 'draft',
    priority: 'high',
    createdBy: 'Клинический отдел',
    createdDate: '2024-01-27',
    updatedDate: '2024-01-28',
    format: 'pdf',
    dataSource: 'Медицинские карты, Регистры',
    filters: [
      {
        id: 'filter-008',
        name: 'Диагнозы',
        type: 'multiselect',
        value: ['Все диагнозы'],
        options: ['Все диагнозы', 'Сердечно-сосудистые', 'Неврологические', 'Онкологические', 'Эндокринные'],
        required: true
      },
      {
        id: 'filter-009',
        name: 'Период лечения',
        type: 'date',
        value: { from: '2024-01-01', to: '2024-01-27' },
        required: true
      }
    ],
    parameters: [
      {
        id: 'param-004',
        name: 'Уровень детализации',
        type: 'string',
        value: 'стандартный',
        description: 'Уровень детализации клинических данных'
      }
    ],
    accessLevel: 'restricted',
    recipients: ['Главный врач', 'Клинический комитет', 'Заведующие отделениями'],
    tags: ['клиника', 'исходы', 'лечение', 'нозологии'],
    isScheduled: false
  },
  {
    id: 'rep-006',
    title: 'Расход медицинских supplies',
    type: 'financial',
    category: 'Логистика',
    description: 'Отчет по расходу медицинских материалов и оборудования',
    status: 'completed',
    priority: 'medium',
    createdBy: 'Отдел снабжения',
    createdDate: '2024-01-23',
    updatedDate: '2024-01-25',
    completedDate: '2024-01-25',
    format: 'excel',
    dataSource: 'Система учета материалов',
    filters: [
      {
        id: 'filter-010',
        name: 'Категория материалов',
        type: 'multiselect',
        value: ['Все категории'],
        options: ['Все категории', 'Лекарства', 'Расходные материалы', 'Оборудование', 'Лабораторные реактивы'],
        required: false
      },
      {
        id: 'filter-011',
        name: 'Период',
        type: 'date',
        value: { from: '2024-01-01', to: '2024-01-23' },
        required: true
      }
    ],
    parameters: [],
    fileSize: '3.1 MB',
    downloadUrl: '/reports/medical-supplies-january-2024.xlsx',
    accessLevel: 'internal',
    recipients: ['Отдел снабжения', 'Финансовый отдел', 'Главный врач'],
    tags: ['расход', 'материалы', 'логистика', 'снабжение'],
    lastRun: '2024-01-25T11:20:00Z',
    isScheduled: true,
    schedule: '0 0 1 * *',
    nextRun: '2024-02-01T00:00:00Z'
  },
  {
    id: 'rep-007',
    title: 'Анализ рабочей нагрузки персонала',
    type: 'operational',
    category: 'Персонал',
    description: 'Распределение рабочей нагрузки среди медицинского персонала',
    status: 'failed',
    priority: 'low',
    createdBy: 'Отдел кадров',
    createdDate: '2024-01-26',
    updatedDate: '2024-01-26',
    format: 'pdf',
    dataSource: 'Система учета рабочего времени',
    filters: [
      {
        id: 'filter-012',
        name: 'Должность',
        type: 'select',
        value: 'Все должности',
        options: ['Все должности', 'Врачи', 'Медсестры', 'Лаборанты', 'Административный персонал'],
        required: false
      }
    ],
    parameters: [
      {
        id: 'param-005',
        name: 'Включить сверхурочные',
        type: 'boolean',
        value: true,
        description: 'Включить данные по сверхурочной работе'
      }
    ],
    accessLevel: 'confidential',
    recipients: ['Отдел кадров', 'Главный врач'],
    tags: ['персонал', 'нагрузка', 'рабочее время', 'кадры'],
    lastRun: '2024-01-26T15:30:00Z',
    isScheduled: false
  },
  {
    id: 'rep-008',
    title: 'Еженедельный отчет по инфекционному контролю',
    type: 'clinical',
    category: 'Эпидемиология',
    description: 'Мониторинг показателей инфекционного контроля и внутрибольничных инфекций',
    status: 'scheduled',
    priority: 'critical',
    createdBy: 'Отдел эпидемиологии',
    createdDate: '2024-01-22',
    updatedDate: '2024-01-28',
    scheduledDate: '2024-01-29',
    format: 'pdf',
    dataSource: 'Система эпидемиологического надзора',
    filters: [
      {
        id: 'filter-013',
        name: 'Неделя',
        type: 'date',
        value: { from: '2024-01-22', to: '2024-01-28' },
        required: true
      }
    ],
    parameters: [],
    accessLevel: 'restricted',
    recipients: ['Главный врач', 'Отдел эпидемиологии', 'Санэпидстанция'],
    tags: ['инфекции', 'контроль', 'эпидемиология', 'ВБИ'],
    lastRun: '2024-01-22T08:00:00Z',
    isScheduled: true,
    schedule: '0 8 * * 1',
    nextRun: '2024-01-29T08:00:00Z'
  },
  {
    id: 'rep-009',
    title: 'Статистика обращений в приемное отделение',
    type: 'statistical',
    category: 'Статистика',
    description: 'Анализ потока пациентов через приемное отделение',
    status: 'completed',
    priority: 'medium',
    createdBy: 'Статистический отдел',
    createdDate: '2024-01-28',
    updatedDate: '2024-01-28',
    completedDate: '2024-01-28',
    format: 'csv',
    dataSource: 'Система приемного отделения',
    filters: [
      {
        id: 'filter-014',
        name: 'Период',
        type: 'date',
        value: { from: '2024-01-01', to: '2024-01-28' },
        required: true
      },
      {
        id: 'filter-015',
        name: 'Время суток',
        type: 'select',
        value: 'Все время',
        options: ['Все время', 'Утро (6-12)', 'День (12-18)', 'Вечер (18-24)', 'Ночь (0-6)'],
        required: false
      }
    ],
    parameters: [
      {
        id: 'param-006',
        name: 'Разделитель',
        type: 'string',
        value: 'запятая',
        description: 'Разделитель полей в CSV файле'
      }
    ],
    fileSize: '512 KB',
    downloadUrl: '/reports/emergency-stats-january-2024.csv',
    accessLevel: 'internal',
    recipients: ['Заведующий приемным отделением', 'Статистический отдел'],
    tags: ['приемное', 'обращения', 'поток', 'статистика'],
    lastRun: '2024-01-28T07:30:00Z',
    isScheduled: true,
    schedule: '30 7 * * 1',
    nextRun: '2024-02-05T07:30:00Z'
  },
  {
    id: 'rep-010',
    title: 'Отчет по медицинским ошибкам и инцидентам',
    type: 'quality',
    category: 'Безопасность',
    description: 'Анализ медицинских ошибок, инцидентов и мероприятий по их предотвращению',
    status: 'draft',
    priority: 'critical',
    createdBy: 'Комитет по безопасности',
    createdDate: '2024-01-27',
    updatedDate: '2024-01-28',
    format: 'pdf',
    dataSource: 'Система отчетности инцидентов',
    filters: [
      {
        id: 'filter-016',
        name: 'Тип инцидента',
        type: 'multiselect',
        value: ['Все типы'],
        options: ['Все типы', 'Лекарственные ошибки', 'Диагностические', 'Хирургические', 'Организационные'],
        required: false
      },
      {
        id: 'filter-017',
        name: 'Уровень серьезности',
        type: 'select',
        value: 'Все уровни',
        options: ['Все уровни', 'Низкий', 'Средний', 'Высокий', 'Критический'],
        required: false
      }
    ],
    parameters: [
      {
        id: 'param-007',
        name: 'Анонимизировать данные',
        type: 'boolean',
        value: true,
        description: 'Скрыть персональные данные пациентов и персонала'
      }
    ],
    accessLevel: 'restricted',
    recipients: ['Комитет по безопасности', 'Главный врач', 'Юридический отдел'],
    tags: ['безопасность', 'ошибки', 'инциденты', 'качество'],
    isScheduled: false
  }
];

// Демо данные шаблонов отчетов
export const reportTemplates: ReportTemplate[] = [
  {
    id: 'template-001',
    name: 'Финансовый отчет',
    type: 'financial',
    description: 'Стандартный финансовый отчет по доходам и расходам',
    icon: '💰',
    category: 'Финансы',
    popular: true,
    parameters: [
      {
        id: 'tparam-001',
        name: 'Период',
        type: 'date',
        value: null,
        description: 'Период для отчета'
      },
      {
        id: 'tparam-002',
        name: 'Детализация',
        type: 'string',
        value: 'стандартная',
        description: 'Уровень детализации данных'
      }
    ]
  },
  {
    id: 'template-002',
    name: 'Статистика пациентов',
    type: 'statistical',
    description: 'Отчет по количеству пациентов и демографии',
    icon: '📊',
    category: 'Статистика',
    popular: true,
    parameters: [
      {
        id: 'tparam-003',
        name: 'Период',
        type: 'date',
        value: null,
        description: 'Период для анализа'
      },
      {
        id: 'tparam-004',
        name: 'Группировка',
        type: 'string',
        value: 'по неделям',
        description: 'Способ группировки данных'
      }
    ]
  },
  {
    id: 'template-003',
    name: 'Клинические исходы',
    type: 'clinical',
    description: 'Анализ результатов лечения и клинических исходов',
    icon: '🩺',
    category: 'Клиника',
    popular: true,
    parameters: [
      {
        id: 'tparam-005',
        name: 'Диагнозы',
        type: 'array',
        value: [],
        description: 'Список диагнозов для анализа'
      },
      {
        id: 'tparam-006',
        name: 'Период лечения',
        type: 'date',
        value: null,
        description: 'Период лечения'
      }
    ]
  },
  {
    id: 'template-004',
    name: 'Операционные показатели',
    type: 'operational',
    description: 'Ключевые операционные метрики эффективности',
    icon: '⚙️',
    category: 'Операции',
    popular: false,
    parameters: [
      {
        id: 'tparam-007',
        name: 'Отделения',
        type: 'array',
        value: [],
        description: 'Список отделений для анализа'
      },
      {
        id: 'tparam-008',
        name: 'Показатели',
        type: 'array',
        value: [],
        description: 'Список показателей для включения'
      }
    ]
  },
  {
    id: 'template-005',
    name: 'Качество медицинской помощи',
    type: 'quality',
    description: 'Оценка качества и удовлетворенности пациентов',
    icon: '⭐',
    category: 'Качество',
    popular: true,
    parameters: [
      {
        id: 'tparam-009',
        name: 'Период оценки',
        type: 'date',
        value: null,
        description: 'Период для оценки качества'
      },
      {
        id: 'tparam-010',
        name: 'Включить комментарии',
        type: 'boolean',
        value: true,
        description: 'Включить текстовые отзывы'
      }
    ]
  },
  {
    id: 'template-006',
    name: 'Инфекционный контроль',
    type: 'clinical',
    description: 'Мониторинг внутрибольничных инфекций',
    icon: '🦠',
    category: 'Эпидемиология',
    popular: false,
    parameters: [
      {
        id: 'tparam-011',
        name: 'Период',
        type: 'date',
        value: null,
        description: 'Период мониторинга'
      },
      {
        id: 'tparam-012',
        name: 'Типы инфекций',
        type: 'array',
        value: [],
        description: 'Типы инфекций для включения'
      }
    ]
  }
];

// Вспомогательные функции
export const getReportById = (id: string): Report | undefined => {
  return reports.find(report => report.id === id);
};

export const getReportsByType = (type: Report['type']): Report[] => {
  return reports.filter(report => report.type === type);
};

export const getReportsByStatus = (status: Report['status']): Report[] => {
  return reports.filter(report => report.status === status);
};

export const getScheduledReports = (): Report[] => {
  return reports.filter(report => report.isScheduled);
};

export const getRecentReports = (limit: number = 5): Report[] => {
  return reports
    .filter(report => report.status === 'completed')
    .sort((a, b) => new Date(b.completedDate!).getTime() - new Date(a.completedDate!).getTime())
    .slice(0, limit);
};

export const getPopularTemplates = (): ReportTemplate[] => {
  return reportTemplates.filter(template => template.popular);
};

export const getTemplatesByType = (type: Report['type']): ReportTemplate[] => {
  return reportTemplates.filter(template => template.type === type);
};

export const getStatusConfig = (status: Report['status']) => {
  const configs = {
    draft: { color: 'bg-gray-500/20 border-gray-500/30 text-gray-400', label: 'Черновик', icon: '📝' },
    generating: { color: 'bg-blue-500/20 border-blue-500/30 text-blue-400', label: 'Генерируется', icon: '🔄' },
    completed: { color: 'bg-green-500/20 border-green-500/30 text-green-400', label: 'Завершен', icon: '✅' },
    failed: { color: 'bg-red-500/20 border-red-500/30 text-red-400', label: 'Ошибка', icon: '❌' },
    scheduled: { color: 'bg-purple-500/20 border-purple-500/30 text-purple-400', label: 'Запланирован', icon: '⏰' }
  };
  return configs[status];
};

export const getPriorityConfig = (priority: Report['priority']) => {
  const configs = {
    low: { color: 'bg-gray-500/20 text-gray-400', label: 'Низкий', icon: '⚪' },
    medium: { color: 'bg-blue-500/20 text-blue-400', label: 'Средний', icon: '🔵' },
    high: { color: 'bg-orange-500/20 text-orange-400', label: 'Высокий', icon: '🟡' },
    critical: { color: 'bg-red-500/20 text-red-400', label: 'Критический', icon: '🔴' }
  };
  return configs[priority];
};

export const getTypeConfig = (type: Report['type']) => {
  const configs = {
    financial: { icon: '💰', label: 'Финансовый', color: 'text-green-400', bgColor: 'bg-green-500/20' },
    clinical: { icon: '🩺', label: 'Клинический', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    operational: { icon: '⚙️', label: 'Операционный', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
    quality: { icon: '⭐', label: 'Качество', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
    statistical: { icon: '📊', label: 'Статистический', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' }
  };
  return configs[type];
};

export const getFormatConfig = (format: Report['format']) => {
  const configs = {
    pdf: { icon: '📄', label: 'PDF', color: 'text-red-400' },
    excel: { icon: '📊', label: 'Excel', color: 'text-green-400' },
    csv: { icon: '📋', label: 'CSV', color: 'text-blue-400' },
    html: { icon: '🌐', label: 'HTML', color: 'text-orange-400' }
  };
  return configs[format];
};

export const getAccessLevelConfig = (accessLevel: Report['accessLevel']) => {
  const configs = {
    public: { color: 'bg-green-500/20 text-green-400', label: 'Публичный', icon: '🌐' },
    internal: { color: 'bg-blue-500/20 text-blue-400', label: 'Внутренний', icon: '🏢' },
    confidential: { color: 'bg-orange-500/20 text-orange-400', label: 'Конфиденциальный', icon: '🔒' },
    restricted: { color: 'bg-red-500/20 text-red-400', label: 'Ограниченный', icon: '🚫' }
  };
  return configs[accessLevel];
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getReportProgress = (report: Report): number => {
  switch (report.status) {
    case 'draft': return 25;
    case 'generating': return 65;
    case 'completed': return 100;
    case 'failed': return 0;
    case 'scheduled': return 10;
    default: return 0;
  }
};