// src/app/demo/medicine/manager/modules/alerts/demo-data.ts

export type AlertType = 'system' | 'security' | 'medical' | 'equipment' | 'staffing' | 'maintenance' | 'patient' | 'pharmacy' | 'lab' | 'emergency';
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'new' | 'in-progress' | 'resolved' | 'acknowledged';
export type AlertCategory = 'technical' | 'clinical' | 'operational' | 'security';

export interface Alert {
  id: string;
  title: string;
  description: string;
  details?: string;
  type: AlertType;
  category: AlertCategory;
  priority: AlertPriority;
  status: AlertStatus;
  source: string;
  assignedTo?: string;
  department: string;
  isRead: boolean;
  requiresAcknowledgment: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  acknowledgedAt?: string;
  estimatedResolutionTime?: string;
  relatedEquipment?: string;
  patientId?: string;
  roomNumber?: string;
  metadata?: {
    severity: number;
    impact: 'low' | 'medium' | 'high' | 'critical';
    urgency: 'low' | 'medium' | 'high' | 'critical';
    automated: boolean;
    repeatCount: number;
    lastOccurrence?: string;
  };
}

export interface AlertTypeConfig {
  id: AlertType;
  name: string;
  icon: string;
  description: string;
  category: AlertCategory;
}

export interface AlertStats {
  total: number;
  unread: number;
  critical: number;
  resolved: number;
  inProgress: number;
  new: number;
  byType: Record<AlertType, number>;
  byPriority: Record<AlertPriority, number>;
  byDepartment: Record<string, number>;
}

export const alertCategories = [
  { id: 'technical' as AlertCategory, name: 'Технические', icon: '💻', color: 'purple' },
  { id: 'clinical' as AlertCategory, name: 'Клинические', icon: '🏥', color: 'blue' },
  { id: 'operational' as AlertCategory, name: 'Операционные', icon: '⚙️', color: 'orange' },
  { id: 'security' as AlertCategory, name: 'Безопасность', icon: '🔒', color: 'red' },
];

export const alertTypes: AlertTypeConfig[] = [
  { 
    id: 'system', 
    name: 'Системные', 
    icon: '💻', 
    description: 'Сбои в работе информационных систем',
    category: 'technical'
  },
  { 
    id: 'security', 
    name: 'Безопасность', 
    icon: '🔒', 
    description: 'Инциденты информационной безопасности',
    category: 'security'
  },
  { 
    id: 'medical', 
    name: 'Медицинские', 
    icon: '🏥', 
    description: 'Клинические протоколы и рекомендации',
    category: 'clinical'
  },
  { 
    id: 'equipment', 
    name: 'Оборудование', 
    icon: '⚙️', 
    description: 'Сбои медицинского оборудования',
    category: 'technical'
  },
  { 
    id: 'staffing', 
    name: 'Персонал', 
    icon: '👥', 
    description: 'Вопросы staffing и расписания',
    category: 'operational'
  },
  { 
    id: 'maintenance', 
    name: 'Обслуживание', 
    icon: '🔧', 
    description: 'Плановое и внеплановое обслуживание',
    category: 'operational'
  },
  { 
    id: 'patient', 
    name: 'Пациенты', 
    icon: '👤', 
    description: 'Инциденты связанные с пациентами',
    category: 'clinical'
  },
  { 
    id: 'pharmacy', 
    name: 'Фармация', 
    icon: '💊', 
    description: 'Лекарства и препараты',
    category: 'clinical'
  },
  { 
    id: 'lab', 
    name: 'Лаборатория', 
    icon: '🔬', 
    description: 'Лабораторные исследования и анализы',
    category: 'clinical'
  },
  { 
    id: 'emergency', 
    name: 'Экстренные', 
    icon: '🚨', 
    description: 'Критические ситуации требующие немедленного реагирования',
    category: 'security'
  },
];

export const getAlertTypeConfig = (type: AlertType) => {
  const configs: Record<AlertType, { 
    label: string; 
    icon: string; 
    bgColor: string; 
    textColor: string; 
    borderColor: string;
    gradient: string;
    category: AlertCategory;
  }> = {
    system: { 
      label: 'Системное', 
      icon: '💻', 
      bgColor: 'bg-purple-500/20', 
      textColor: 'text-purple-300',
      borderColor: 'border-purple-500/30',
      gradient: 'from-purple-500 to-purple-600',
      category: 'technical'
    },
    security: { 
      label: 'Безопасность', 
      icon: '🔒', 
      bgColor: 'bg-red-500/20', 
      textColor: 'text-red-300',
      borderColor: 'border-red-500/30',
      gradient: 'from-red-500 to-red-600',
      category: 'security'
    },
    medical: { 
      label: 'Медицинское', 
      icon: '🏥', 
      bgColor: 'bg-blue-500/20', 
      textColor: 'text-blue-300',
      borderColor: 'border-blue-500/30',
      gradient: 'from-blue-500 to-blue-600',
      category: 'clinical'
    },
    equipment: { 
      label: 'Оборудование', 
      icon: '⚙️', 
      bgColor: 'bg-orange-500/20', 
      textColor: 'text-orange-300',
      borderColor: 'border-orange-500/30',
      gradient: 'from-orange-500 to-orange-600',
      category: 'technical'
    },
    staffing: { 
      label: 'Персонал', 
      icon: '👥', 
      bgColor: 'bg-green-500/20', 
      textColor: 'text-green-300',
      borderColor: 'border-green-500/30',
      gradient: 'from-green-500 to-green-600',
      category: 'operational'
    },
    maintenance: { 
      label: 'Обслуживание', 
      icon: '🔧', 
      bgColor: 'bg-yellow-500/20', 
      textColor: 'text-yellow-300',
      borderColor: 'border-yellow-500/30',
      gradient: 'from-yellow-500 to-yellow-600',
      category: 'operational'
    },
    patient: { 
      label: 'Пациент', 
      icon: '👤', 
      bgColor: 'bg-cyan-500/20', 
      textColor: 'text-cyan-300',
      borderColor: 'border-cyan-500/30',
      gradient: 'from-cyan-500 to-cyan-600',
      category: 'clinical'
    },
    pharmacy: { 
      label: 'Фармация', 
      icon: '💊', 
      bgColor: 'bg-indigo-500/20', 
      textColor: 'text-indigo-300',
      borderColor: 'border-indigo-500/30',
      gradient: 'from-indigo-500 to-indigo-600',
      category: 'clinical'
    },
    lab: { 
      label: 'Лаборатория', 
      icon: '🔬', 
      bgColor: 'bg-pink-500/20', 
      textColor: 'text-pink-300',
      borderColor: 'border-pink-500/30',
      gradient: 'from-pink-500 to-pink-600',
      category: 'clinical'
    },
    emergency: { 
      label: 'Экстренное', 
      icon: '🚨', 
      bgColor: 'bg-red-600/20', 
      textColor: 'text-red-400',
      borderColor: 'border-red-600/30',
      gradient: 'from-red-600 to-red-700',
      category: 'security'
    },
  };
  return configs[type];
};

export const getAlertPriorityConfig = (priority: AlertPriority) => {
  const configs = {
    low: { 
      label: 'Низкий', 
      bgColor: 'bg-gray-500/20', 
      textColor: 'text-gray-300', 
      borderColor: 'border-gray-500/20',
      gradient: 'from-gray-500 to-gray-600',
      severity: 1
    },
    medium: { 
      label: 'Средний', 
      bgColor: 'bg-yellow-500/20', 
      textColor: 'text-yellow-300', 
      borderColor: 'border-yellow-500/20',
      gradient: 'from-yellow-500 to-yellow-600',
      severity: 2
    },
    high: { 
      label: 'Высокий', 
      bgColor: 'bg-orange-500/20', 
      textColor: 'text-orange-300', 
      borderColor: 'border-orange-500/20',
      gradient: 'from-orange-500 to-orange-600',
      severity: 3
    },
    critical: { 
      label: 'Критический', 
      bgColor: 'bg-red-500/20', 
      textColor: 'text-red-300', 
      borderColor: 'border-red-500/20',
      gradient: 'from-red-500 to-red-600',
      severity: 4
    },
  };
  return configs[priority];
};

export const getAlertStatusConfig = (status: AlertStatus) => {
  const configs = {
    'new': { 
      label: 'Новое', 
      bgColor: 'bg-blue-500/20', 
      textColor: 'text-blue-300',
      icon: '🆕',
      action: 'Принять в работу'
    },
    'in-progress': { 
      label: 'В работе', 
      bgColor: 'bg-yellow-500/20', 
      textColor: 'text-yellow-300',
      icon: '🔄',
      action: 'Завершить'
    },
    'resolved': { 
      label: 'Решено', 
      bgColor: 'bg-green-500/20', 
      textColor: 'text-green-300',
      icon: '✅',
      action: 'Вернуть в работу'
    },
    'acknowledged': { 
      label: 'Подтверждено', 
      bgColor: 'bg-purple-500/20', 
      textColor: 'text-purple-300',
      icon: '👁️',
      action: 'Принять в работу'
    },
  };
  return configs[status];
};

export const getAlertCategoryConfig = (category: AlertCategory) => {
  const configs = {
    technical: { label: 'Техническое', icon: '💻', color: 'purple' },
    clinical: { label: 'Клиническое', icon: '🏥', color: 'blue' },
    operational: { label: 'Операционное', icon: '⚙️', color: 'orange' },
    security: { label: 'Безопасность', icon: '🔒', color: 'red' },
  };
  return configs[category];
};

// Mock data for alerts - Enhanced with realistic medical scenarios
export let alerts: Alert[] = [
  {
    id: 'alert-1',
    title: 'Сбой в системе электронных медкарт',
    description: 'Временная недоступность модуля хранения медицинских записей. Сервис будет восстановлен в течение 30 минут.',
    details: 'Ошибка базы данных: Connection timeout to primary database node.\nВремя начала инцидента: 14:30\nОжидаемое время восстановления: 15:00\nЗатронутые отделения: Все клинические отделения\nРезервная система: Активна, ограниченный функционал',
    type: 'system',
    category: 'technical',
    priority: 'high',
    status: 'in-progress',
    source: 'IT Department',
    assignedTo: 'Сергей Иванов',
    department: 'IT',
    isRead: false,
    requiresAcknowledgment: true,
    createdAt: '2024-01-24T14:30:00Z',
    updatedAt: '2024-01-24T14:45:00Z',
    estimatedResolutionTime: '2024-01-24T15:00:00Z',
    metadata: {
      severity: 3,
      impact: 'high',
      urgency: 'high',
      automated: true,
      repeatCount: 2,
      lastOccurrence: '2024-01-20T10:15:00Z'
    }
  },
  {
    id: 'alert-2',
    title: 'Несанкционированный доступ к серверной',
    description: 'Зафиксирована попытка несанкционированного доступа в серверную комнату в ночное время.',
    type: 'security',
    category: 'security',
    priority: 'critical',
    status: 'new',
    source: 'Security System',
    department: 'Security',
    isRead: false,
    requiresAcknowledgment: true,
    createdAt: '2024-01-24T02:15:00Z',
    updatedAt: '2024-01-24T02:15:00Z',
    metadata: {
      severity: 4,
      impact: 'critical',
      urgency: 'critical',
      automated: true,
      repeatCount: 1
    }
  },
  {
    id: 'alert-3',
    title: 'Критическая нехватка персонала в отделении терапии',
    description: 'Из-за вспышки гриппа 3 медсестры и 1 врач на больничном. Требуется срочное перераспределение персонала.',
    type: 'staffing',
    category: 'operational',
    priority: 'high',
    status: 'in-progress',
    source: 'HR Department',
    assignedTo: 'Мария Петрова',
    department: 'HR',
    isRead: true,
    requiresAcknowledgment: false,
    createdAt: '2024-01-24T08:00:00Z',
    updatedAt: '2024-01-24T10:30:00Z',
    metadata: {
      severity: 3,
      impact: 'high',
      urgency: 'high',
      automated: false,
      repeatCount: 0
    }
  },
  {
    id: 'alert-4',
    title: 'Сбой в работе МРТ аппарата',
    description: 'Аппарат МРТ в кабинете 304 выдает ошибку инициализации. Требуется техническое обслуживание.',
    details: 'Ошибка: Magnet quench detected\nТемпература криогена: 8.5K\nСтатус: Экстренная остановка\nТехник вызван, ETA: 45 минут\nЗатронутые пациенты: 3 запланированных исследования',
    type: 'equipment',
    category: 'technical',
    priority: 'high',
    status: 'in-progress',
    source: 'Equipment Monitoring',
    assignedTo: 'Алексей Техников',
    department: 'Technical',
    isRead: true,
    requiresAcknowledgment: false,
    createdAt: '2024-01-24T11:20:00Z',
    updatedAt: '2024-01-24T11:45:00Z',
    relatedEquipment: 'MRI-304-SIEMENS',
    roomNumber: '304',
    estimatedResolutionTime: '2024-01-24T12:30:00Z',
    metadata: {
      severity: 3,
      impact: 'high',
      urgency: 'high',
      automated: true,
      repeatCount: 1
    }
  },
  {
    id: 'alert-5',
    title: 'Пациент с аллергической реакцией на препарат',
    description: 'У пациента в палате 205 зафиксирована острая аллергическая реакция на введенный антибиотик.',
    type: 'patient',
    category: 'clinical',
    priority: 'critical',
    status: 'in-progress',
    source: 'Nursing Station 2',
    assignedTo: 'Доктор Смирнов',
    department: 'Therapy',
    isRead: false,
    requiresAcknowledgment: true,
    createdAt: '2024-01-24T15:20:00Z',
    updatedAt: '2024-01-24T15:25:00Z',
    patientId: 'P-78342',
    roomNumber: '205',
    metadata: {
      severity: 4,
      impact: 'critical',
      urgency: 'critical',
      automated: false,
      repeatCount: 0
    }
  },
  {
    id: 'alert-6',
    title: 'Задержка поставки критических медикаментов',
    description: 'Задержка поставки инсулина и сердечных препаратов из-за проблем с логистикой.',
    type: 'pharmacy',
    category: 'clinical',
    priority: 'high',
    status: 'new',
    source: 'Pharmacy',
    department: 'Pharmacy',
    isRead: true,
    requiresAcknowledgment: false,
    createdAt: '2024-01-24T13:00:00Z',
    updatedAt: '2024-01-24T13:00:00Z',
    estimatedResolutionTime: '2024-01-25T09:00:00Z',
    metadata: {
      severity: 3,
      impact: 'high',
      urgency: 'medium',
      automated: false,
      repeatCount: 0
    }
  },
  {
    id: 'alert-7',
    title: 'Сбой в лабораторной информационной системе',
    description: 'Временные проблемы с передачей результатов анализов из лаборатории в отделения.',
    type: 'lab',
    category: 'technical',
    priority: 'medium',
    status: 'in-progress',
    source: 'Lab Department',
    assignedTo: 'IT Support',
    department: 'IT',
    isRead: true,
    requiresAcknowledgment: false,
    createdAt: '2024-01-24T16:10:00Z',
    updatedAt: '2024-01-24T16:30:00Z',
    metadata: {
      severity: 2,
      impact: 'medium',
      urgency: 'medium',
      automated: true,
      repeatCount: 3
    }
  },
  {
    id: 'alert-8',
    title: 'Экстренная эвакуация - учебная тревога',
    description: 'Плановые учения по экстренной эвакуации из главного корпуса.',
    type: 'emergency',
    category: 'security',
    priority: 'medium',
    status: 'new',
    source: 'Security Department',
    department: 'Security',
    isRead: false,
    requiresAcknowledgment: true,
    createdAt: '2024-01-24T17:00:00Z',
    updatedAt: '2024-01-24T17:00:00Z',
    metadata: {
      severity: 2,
      impact: 'medium',
      urgency: 'low',
      automated: false,
      repeatCount: 0
    }
  },
  {
    id: 'alert-9',
    title: 'Обновление протоколов лечения COVID-19',
    description: 'Выпущены новые клинические рекомендации по лечению COVID-19. Все врачи должны ознакомиться до конца недели.',
    type: 'medical',
    category: 'clinical',
    priority: 'medium',
    status: 'new',
    source: 'Medical Board',
    department: 'Medical',
    isRead: true,
    requiresAcknowledgment: false,
    createdAt: '2024-01-23T16:00:00Z',
    updatedAt: '2024-01-23T16:00:00Z',
    metadata: {
      severity: 2,
      impact: 'medium',
      urgency: 'low',
      automated: false,
      repeatCount: 0
    }
  },
  {
    id: 'alert-10',
    title: 'Утечка конфиденциальных данных пациентов',
    description: 'Обнаружена потенциальная утечка данных 150 пациентов. Инициировано внутреннее расследование.',
    type: 'security',
    category: 'security',
    priority: 'critical',
    status: 'in-progress',
    source: 'Data Protection Officer',
    assignedTo: 'Отдел кибербезопасности',
    department: 'IT',
    isRead: false,
    requiresAcknowledgment: true,
    createdAt: '2024-01-24T13:15:00Z',
    updatedAt: '2024-01-24T14:30:00Z',
    metadata: {
      severity: 4,
      impact: 'critical',
      urgency: 'critical',
      automated: true,
      repeatCount: 0
    }
  },
  {
    id: 'alert-11',
    title: 'Запланированное обслуживание системы вентиляции',
    description: 'Ежеквартальное техническое обслуживание системы вентиляции в главном корпусе. Работы запланированы на выходные.',
    type: 'maintenance',
    category: 'operational',
    priority: 'low',
    status: 'acknowledged',
    source: 'Facilities Management',
    department: 'Technical',
    isRead: true,
    requiresAcknowledgment: false,
    createdAt: '2024-01-24T09:00:00Z',
    updatedAt: '2024-01-24T09:00:00Z',
    acknowledgedAt: '2024-01-24T09:15:00Z',
    metadata: {
      severity: 1,
      impact: 'low',
      urgency: 'low',
      automated: false,
      repeatCount: 0
    }
  },
  {
    id: 'alert-12',
    title: 'Критически низкий уровень кислорода в центральной системе',
    description: 'Уровень кислорода в центральной системе подачи достиг критического минимума.',
    type: 'equipment',
    category: 'technical',
    priority: 'critical',
    status: 'new',
    source: 'Equipment Monitoring',
    department: 'Technical',
    isRead: false,
    requiresAcknowledgment: true,
    createdAt: '2024-01-24T18:05:00Z',
    updatedAt: '2024-01-24T18:05:00Z',
    relatedEquipment: 'O2-CENTRAL-SUPPLY',
    metadata: {
      severity: 4,
      impact: 'critical',
      urgency: 'critical',
      automated: true,
      repeatCount: 0
    }
  }
];

// Enhanced utility functions
export const getUnreadAlertsCount = (): number => {
  return alerts.filter(alert => !alert.isRead).length;
};

export const getCriticalAlertsCount = (): number => {
  return alerts.filter(alert => alert.priority === 'critical').length;
};

export const getAlertsStats = (): AlertStats => {
  const byType = {} as Record<AlertType, number>;
  const byPriority = {} as Record<AlertPriority, number>;
  const byDepartment = {} as Record<string, number>;

  // Initialize counters
  alertTypes.forEach(type => byType[type.id] = 0);
  (['low', 'medium', 'high', 'critical'] as AlertPriority[]).forEach(priority => byPriority[priority] = 0);

  alerts.forEach(alert => {
    byType[alert.type]++;
    byPriority[alert.priority]++;
    byDepartment[alert.department] = (byDepartment[alert.department] || 0) + 1;
  });

  return {
    total: alerts.length,
    unread: getUnreadAlertsCount(),
    critical: getCriticalAlertsCount(),
    resolved: alerts.filter(a => a.status === 'resolved').length,
    inProgress: alerts.filter(a => a.status === 'in-progress').length,
    new: alerts.filter(a => a.status === 'new').length,
    byType,
    byPriority,
    byDepartment
  };
};

export const markAlertAsRead = (alertId: string): void => {
  const alert = alerts.find(a => a.id === alertId);
  if (alert) {
    alert.isRead = true;
    alert.updatedAt = new Date().toISOString();
  }
};

export const markAlertAsResolved = (alertId: string): void => {
  const alert = alerts.find(a => a.id === alertId);
  if (alert) {
    alert.status = 'resolved';
    alert.resolvedAt = new Date().toISOString();
    alert.updatedAt = new Date().toISOString();
  }
};

export const acknowledgeAlert = (alertId: string): void => {
  const alert = alerts.find(a => a.id === alertId);
  if (alert && alert.requiresAcknowledgment) {
    alert.status = 'acknowledged';
    alert.acknowledgedAt = new Date().toISOString();
    alert.updatedAt = new Date().toISOString();
  }
};

export const assignAlert = (alertId: string, assignee: string): void => {
  const alert = alerts.find(a => a.id === alertId);
  if (alert) {
    alert.assignedTo = assignee;
    alert.status = 'in-progress';
    alert.updatedAt = new Date().toISOString();
  }
};

export const deleteAlert = (alertId: string): void => {
  alerts = alerts.filter(a => a.id !== alertId);
};

export const searchAlerts = (query: string): Alert[] => {
  const searchTerm = query.toLowerCase();
  return alerts.filter(alert => 
    alert.title.toLowerCase().includes(searchTerm) ||
    alert.description.toLowerCase().includes(searchTerm) ||
    alert.source.toLowerCase().includes(searchTerm) ||
    alert.department.toLowerCase().includes(searchTerm) ||
    (alert.assignedTo && alert.assignedTo.toLowerCase().includes(searchTerm)) ||
    (alert.patientId && alert.patientId.toLowerCase().includes(searchTerm))
  );
};

export const filterAlertsByDepartment = (department: string): Alert[] => {
  return alerts.filter(alert => alert.department === department);
};

export const filterAlertsByType = (type: AlertType): Alert[] => {
  return alerts.filter(alert => alert.type === type);
};

export const getRecentAlerts = (hours: number = 24): Alert[] => {
  const cutoffTime = new Date();
  cutoffTime.setHours(cutoffTime.getHours() - hours);
  return alerts.filter(alert => new Date(alert.createdAt) > cutoffTime);
};

export const getAlertsRequiringAcknowledgment = (): Alert[] => {
  return alerts.filter(alert => alert.requiresAcknowledgment && alert.status === 'new');
};

// New function to generate sample alerts for demonstration
export const generateSampleAlert = (overrides?: Partial<Alert>): Alert => {
  const sampleAlerts: Partial<Alert>[] = [
    {
      title: 'Новое системное уведомление',
      description: 'Это пример автоматически сгенерированного уведомления',
      type: 'system',
      priority: 'medium',
      status: 'new',
      source: 'Automated System',
      department: 'IT',
    },
    {
      title: 'Требуется внимание: клинический инцидент',
      description: 'Обнаружена нестандартная ситуация требующая врачебного внимания',
      type: 'medical',
      priority: 'high',
      status: 'new',
      source: 'Clinical Monitoring',
      department: 'Medical',
    }
  ];

  const baseAlert = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
  
  return {
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: baseAlert.title!,
    description: baseAlert.description!,
    type: baseAlert.type as AlertType,
    category: 'technical',
    priority: baseAlert.priority as AlertPriority,
    status: 'new',
    source: baseAlert.source!,
    department: baseAlert.department!,
    isRead: false,
    requiresAcknowledgment: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      severity: 2,
      impact: 'medium',
      urgency: 'medium',
      automated: true,
      repeatCount: 0
    },
    ...overrides
  };
};