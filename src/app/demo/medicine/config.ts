export interface MedicineModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  roles: ('user' | 'manager' | 'owner')[];
  permissions: {
    user: ('read' | 'write' | 'delete')[];
    manager: ('read' | 'write' | 'delete')[];
    owner: ('read' | 'write' | 'delete')[];
  };
  uiType: 'table' | 'form' | 'calendar' | 'analytics' | 'chat' | 'billing';
  tags: string[];
}

export interface RoleConfig {
  id: 'user' | 'manager' | 'owner';
  name: string;
  description: string;
  icon: string;
  color: string;
  kpis: {
    title: string;
    value: string;
    change?: string;
    icon: string;
  }[];
  quickActions: {
    label: string;
    icon: string;
    moduleId?: string;
  }[];
}

export const medicineModules: MedicineModule[] = [
  {
    id: 'appointment',
    name: 'Онлайн-запись к врачу',
    description: 'Запись на приём к специалистам клиники',
    icon: '📅',
    roles: ['user', 'manager', 'owner'],
    permissions: {
      user: ['read', 'write'],
      manager: ['read', 'write', 'delete'],
      owner: ['read']
    },
    uiType: 'form',
    tags: ['форма', 'календарь', 'бронирование']
  },
  {
    id: 'history',
    name: 'История приёмов и диагнозов',
    description: 'Полная медицинская история пациента',
    icon: '📋',
    roles: ['user', 'manager', 'owner'],
    permissions: {
      user: ['read'],
      manager: ['read', 'write'],
      owner: ['read']
    },
    uiType: 'table',
    tags: ['таблица', 'карточки', 'медицина']
  },
  {
    id: 'payment',
    name: 'Онлайн-оплата и счёт',
    description: 'Оплата услуг и управление счетами',
    icon: '💳',
    roles: ['user', 'manager', 'owner'],
    permissions: {
      user: ['read', 'write'],
      manager: ['read', 'write', 'delete'],
      owner: ['read']
    },
    uiType: 'billing',
    tags: ['оплата', 'счета', 'финансы']
  },
  {
    id: 'schedule',
    name: 'Календарь приёмов врача',
    description: 'Расписание и управление приёмами',
    icon: '👨‍⚕️',
    roles: ['manager', 'owner'],
    permissions: {
      user: [],
      manager: ['read', 'write', 'delete'],
      owner: ['read']
    },
    uiType: 'calendar',
    tags: ['календарь', 'расписание', 'врачи']
  },
  {
    id: 'admin-panel',
    name: 'Панель администратора',
    description: 'Аналитика нагрузки и отчёты по клинике',
    icon: '📊',
    roles: ['manager', 'owner'],
    permissions: {
      user: [],
      manager: ['read'],
      owner: ['read', 'write']
    },
    uiType: 'analytics',
    tags: ['аналитика', 'отчёты', 'KPI']
  },
  {
    id: 'notifications',
    name: 'Уведомления и напоминания',
    description: 'Система уведомлений для пациентов и врачей',
    icon: '🔔',
    roles: ['user', 'manager', 'owner'],
    permissions: {
      user: ['read'],
      manager: ['read', 'write', 'delete'],
      owner: ['read', 'write', 'delete']
    },
    uiType: 'table',
    tags: ['уведомления', 'напоминания', 'коммуникация']
  },
  {
    id: 'telemedicine',
    name: 'Видео-консультация',
    description: 'Онлайн приёмы через видео-связь',
    icon: '🎥',
    roles: ['user', 'manager'],
    permissions: {
      user: ['read', 'write'],
      manager: ['read', 'write'],
      owner: []
    },
    uiType: 'chat',
    tags: ['видео', 'консультация', 'WebRTC']
  },
  {
    id: 'reviews',
    name: 'Отзывы пациентов',
    description: 'Система сбора и управления отзывами',
    icon: '⭐',
    roles: ['user', 'manager', 'owner'],
    permissions: {
      user: ['read', 'write'],
      manager: ['read'],
      owner: ['read']
    },
    uiType: 'table',
    tags: ['отзывы', 'рейтинги', 'качество']
  },
  {
    id: 'analytics',
    name: 'Аналитика посещаемости',
    description: 'Статистика и аналитика работы клиники',
    icon: '📈',
    roles: ['manager', 'owner'],
    permissions: {
      user: [],
      manager: ['read'],
      owner: ['read', 'write', 'delete']
    },
    uiType: 'analytics',
    tags: ['аналитика', 'посещаемость', 'метрики']
  },
  {
    id: 'staff',
    name: 'Управление сотрудниками',
    description: 'Управление персоналом и ролями',
    icon: '👥',
    roles: ['owner'],
    permissions: {
      user: [],
      manager: ['read'],
      owner: ['read', 'write', 'delete']
    },
    uiType: 'table',
    tags: ['сотрудники', 'управление', 'персонал']
  }
];

export const roleConfigs: Record<'user' | 'manager' | 'owner', RoleConfig> = {
  user: {
    id: 'user',
    name: 'Пациент',
    description: 'Панель управления для пациентов клиники',
    icon: '👤',
    color: 'blue',
    kpis: [
      {
        title: 'Ближайшая запись',
        value: '24 окт, 15:30',
        change: 'Терапевт Иванов',
        icon: '📅'
      },
      {
        title: 'Статус оплаты',
        value: 'Ожидает оплаты',
        change: '2 500 ₽',
        icon: '💳'
      },
      {
        title: 'Уведомления',
        value: '3 новых',
        change: '2 непрочитанных',
        icon: '🔔'
      }
    ],
    quickActions: [
      { label: 'Записаться', icon: '➕', moduleId: 'appointment' },
      { label: 'История приёмов', icon: '📋', moduleId: 'history' },
      { label: 'Оплатить счёт', icon: '💳', moduleId: 'payment' }
    ]
  },
  manager: {
    id: 'manager',
    name: 'Регистратор/Врач',
    description: 'Панель управления для медицинского персонала',
    icon: '👨‍⚕️',
    color: 'green',
    kpis: [
      {
        title: 'Записей сегодня',
        value: '42',
        change: '+5 с утра',
        icon: '📅'
      },
      {
        title: 'Окна без врача',
        value: '3',
        change: '30 мин всего',
        icon: '⏰'
      },
      {
        title: 'Счета к оплате',
        value: '5',
        change: '12 500 ₽',
        icon: '💳'
      }
    ],
    quickActions: [
      { label: 'Новая запись', icon: '➕', moduleId: 'appointment' },
      { label: 'Календарь', icon: '📅', moduleId: 'schedule' },
      { label: 'Выставить счёт', icon: '💳', moduleId: 'payment' }
    ]
  },
  owner: {
    id: 'owner',
    name: 'Руководитель клиники',
    description: 'Панель управления для руководства клиники',
    icon: '👔',
    color: 'purple',
    kpis: [
      {
        title: 'Загрузка врачей',
        value: '78%',
        change: '+3% за неделю',
        icon: '📊'
      },
      {
        title: 'Выручка (неделя)',
        value: '1.2M ₽',
        change: '+15%',
        icon: '💰'
      },
      {
        title: 'NPS',
        value: '4.6',
        change: 'из 5.0',
        icon: '⭐'
      }
    ],
    quickActions: [
      { label: 'Отчёты', icon: '📊', moduleId: 'admin-panel' },
      { label: 'Аналитика', icon: '📈', moduleId: 'analytics' },
      { label: 'Сотрудники', icon: '👥', moduleId: 'staff' }
    ]
  }
};

export const getModulesForRole = (role: 'user' | 'manager' | 'owner') => {
  return medicineModules.filter(module => module.roles.includes(role));
};

export const getModuleById = (id: string) => {
  return medicineModules.find(module => module.id === id);
};