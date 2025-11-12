export interface SocialModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'table' | 'calendar' | 'map' | 'chat' | 'analytics' | 'form' | 'kanban' | 'notifications';
  roles: ('user' | 'manager' | 'owner')[];
  permissions: {
    user: 'R' | 'RW' | 'RWD' | '-';
    manager: 'R' | 'RW' | 'RWD' | '-';
    owner: 'R' | 'RW' | 'RWD' | '-';
  };
  route: string;
  color: string;
}

export interface RoleConfig {
  id: 'user' | 'manager' | 'owner';
  title: string;
  description: string;
  kpi: {
    label: string;
    value: number;
    change?: number;
  }[];
  quickActions: {
    label: string;
    action: string;
    icon: string;
  }[];
}

export const SOCIAL_MODULES: SocialModule[] = [
  {
    id: 'assistance-requests',
    title: 'Регистрация заявок',
    description: 'Создание и управление заявками на помощь',
    icon: '📋',
    type: 'table',
    roles: ['user', 'manager', 'owner'],
    permissions: { user: 'RW', manager: 'RWD', owner: 'R' },
    route: '/demo/social/manager/modules/assistance-requests',
    color: 'blue'
  },
  {
    id: 'visits-schedule',
    title: 'Календарь встреч',
    description: 'Планирование и управление визитами',
    icon: '📅',
    type: 'calendar',
    roles: ['user', 'manager', 'owner'],
    permissions: { user: 'R', manager: 'RWD', owner: 'R' },
    route: '/demo/social/manager/modules/visits-schedule',
    color: 'green'
  },
  {
    id: 'case-chat',
    title: 'Чат с куратором',
    description: 'Общение по вопросам заявки',
    icon: '💬',
    type: 'chat',
    roles: ['user', 'manager', 'owner'],
    permissions: { user: 'RW', manager: 'RW', owner: 'R' },
    route: '/demo/social/user/modules/case-chat',
    color: 'purple'
  },
  {
    id: 'case-status',
    title: 'Статусы заявок',
    description: 'Канбан-доска управления процессами',
    icon: '🔄',
    type: 'kanban',
    roles: ['user', 'manager', 'owner'],
    permissions: { user: 'R', manager: 'RWD', owner: 'RWD' },
    route: '/demo/social/manager/modules/case-status',
    color: 'orange'
  },
  {
    id: 'activities-map',
    title: 'Карта активностей',
    description: 'Геолокация заявок и мероприятий',
    icon: '🗺️',
    type: 'map',
    roles: ['user', 'manager', 'owner'],
    permissions: { user: 'R', manager: 'RW', owner: 'RW' },
    route: '/demo/social/owner/modules/activities-map',
    color: 'red'
  },
  {
    id: 'volunteers',
    title: 'База волонтёров',
    description: 'Управление волонтёрскими ресурсами',
    icon: '👥',
    type: 'table',
    roles: ['manager', 'owner'],
    permissions: { user: '-', manager: 'RWD', owner: 'RW' },
    route: '/demo/social/manager/modules/volunteers',
    color: 'indigo'
  },
  {
    id: 'service-reports',
    title: 'Отчёты услуг',
    description: 'Аналитика оказанных услуг',
    icon: '📊',
    type: 'analytics',
    roles: ['manager', 'owner'],
    permissions: { user: '-', manager: 'RW', owner: 'RWD' },
    route: '/demo/social/owner/modules/service-reports',
    color: 'cyan'
  },
  {
    id: 'notifications',
    title: 'Уведомления',
    description: 'SMS и email рассылки',
    icon: '🔔',
    type: 'notifications',
    roles: ['user', 'manager', 'owner'],
    permissions: { user: 'RW', manager: 'RWD', owner: 'RWD' },
    route: '/demo/social/manager/modules/notifications',
    color: 'yellow'
  },
  {
    id: 'feedback-form',
    title: 'Обратная связь',
    description: 'Сбор отзывов и предложений',
    icon: '💭',
    type: 'form',
    roles: ['user', 'manager', 'owner'],
    permissions: { user: 'RW', manager: 'RWD', owner: 'RW' },
    route: '/demo/social/user/modules/feedback-form',
    color: 'pink'
  },
  {
    id: 'org-analytics',
    title: 'Аналитика',
    description: 'Панель метрик организации',
    icon: '📈',
    type: 'analytics',
    roles: ['manager', 'owner'],
    permissions: { user: '-', manager: 'R', owner: 'RWD' },
    route: '/demo/social/owner/modules/org-analytics',
    color: 'teal'
  }
];

export const ROLES_CONFIG: Record<'user' | 'manager' | 'owner', RoleConfig> = {
  user: {
    id: 'user',
    title: 'Получатель помощи',
    description: 'Подача заявок и отслеживание статуса',
    kpi: [
      { label: 'Открытых заявок', value: 2 },
      { label: 'Назначенных встреч', value: 1 },
      { label: 'Ожидание ответа', value: 1 }
    ],
    quickActions: [
      { label: 'Оставить заявку', action: 'create-request', icon: '➕' },
      { label: 'Чат с куратором', action: 'open-chat', icon: '💬' },
      { label: 'Запланировать встречу', action: 'schedule-visit', icon: '📅' }
    ]
  },
  manager: {
    id: 'manager',
    title: 'Куратор / Соцработник',
    description: 'Координация помощи и управление кейсами',
    kpi: [
      { label: 'Активных кейсов', value: 26 },
      { label: 'Встреч сегодня', value: 5 },
      { label: 'Просроченных задач', value: 2 }
    ],
    quickActions: [
      { label: 'Создать встречу', action: 'create-visit', icon: '📝' },
      { label: 'Назначить волонтёра', action: 'assign-volunteer', icon: '👥' },
      { label: 'Обновить статус', action: 'update-status', icon: '🔄' }
    ]
  },
  owner: {
    id: 'owner',
    title: 'Руководитель организации',
    description: 'Мониторинг эффективности и аналитика',
    kpi: [
      { label: 'Заявок за неделю', value: 184 },
      { label: 'Доля закрытых', value: 71, change: 12 },
      { label: 'Среднее время ответа', value: 3.4 }
    ],
    quickActions: [
      { label: 'Сформировать отчёт', action: 'generate-report', icon: '📊' },
      { label: 'Настроить уведомления', action: 'setup-notifications', icon: '🔧' },
      { label: 'Открыть аналитику', action: 'open-analytics', icon: '📈' }
    ]
  }
};

export const getModulesForRole = (role: 'user' | 'manager' | 'owner') => {
  return SOCIAL_MODULES.filter(module => module.roles.includes(role));
};