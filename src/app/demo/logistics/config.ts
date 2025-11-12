export interface LogisticsRole {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  kpi: {
    title: string;
    value: string;
    trend?: number;
  }[];
  quickActions: {
    title: string;
    description: string;
    icon: string;
    route: string;
  }[];
}

export interface LogisticsModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'form' | 'map' | 'table' | 'dashboard' | 'documents' | 'analytics' | 'integrations';
  roles: ('user' | 'manager' | 'owner')[];
  permissions: {
    user: 'R' | 'RW' | 'R*' | '-';
    manager: 'R' | 'RW' | 'RWD' | '-';
    owner: 'R' | 'RW' | 'RWD' | '-';
  };
  route: string;
  features: string[];
}

export const logisticsRoles: LogisticsRole[] = [
  {
    id: 'user',
    title: 'Заказчик',
    description: 'Создание заказов, отслеживание доставки, управление уведомлениями',
    icon: '👤',
    route: '/demo/logistics/user',
    kpi: [
      { title: 'Заказы в пути', value: '2', trend: 0 },
      { title: 'Ожидает подтверждения', value: '1', trend: -1 },
      { title: 'ETA ближайшей', value: '16:10', trend: undefined }
    ],
    quickActions: [
      {
        title: 'Создать заказ',
        description: 'Новая доставка',
        icon: '📦',
        route: '/demo/logistics/user/modules/order-placement'
      },
      {
        title: 'Проверить статус',
        description: 'Отследить доставку',
        icon: '📍',
        route: '/demo/logistics/user/modules/delivery-tracking'
      },
      {
        title: 'Изменить окно',
        description: 'Корректировка времени',
        icon: '⏰',
        route: '/demo/logistics/user/modules/order-placement'
      }
    ]
  },
  {
    id: 'manager',
    title: 'Логист / Оператор',
    description: 'Управление заказами, складом, курьерами и документами',
    icon: '👔',
    route: '/demo/logistics/manager',
    kpi: [
      { title: 'Отгрузок сегодня', value: '58', trend: 12 },
      { title: 'Опозданий', value: '7', trend: -2 },
      { title: 'Курьеров в рейсе', value: '14', trend: 3 }
    ],
    quickActions: [
      {
        title: 'Назначить курьера',
        description: 'Распределение маршрутов',
        icon: '🚗',
        route: '/demo/logistics/manager/modules/courier-app'
      },
      {
        title: 'Сформировать ТТН',
        description: 'Накладные и акты',
        icon: '📄',
        route: '/demo/logistics/manager/modules/documents'
      },
      {
        title: 'Инвентаризация',
        description: 'Учёт остатков',
        icon: '📋',
        route: '/demo/logistics/manager/modules/inventory-audit'
      }
    ]
  },
  {
    id: 'owner',
    title: 'Директор склада',
    description: 'Аналитика, отчёты, интеграции и стратегическое управление',
    icon: '👑',
    route: '/demo/logistics/owner',
    kpi: [
      { title: 'Оборачиваемость', value: '23 дн', trend: -3 },
      { title: 'Критических SKU', value: '12', trend: 2 },
      { title: 'Ошибки в документах', value: '0.7%', trend: -0.2 }
    ],
    quickActions: [
      {
        title: 'Пороги запасов',
        description: 'Настройка минимумов',
        icon: '📊',
        route: '/demo/logistics/owner/modules/warehouse'
      },
      {
        title: 'Отчёт по логистике',
        description: 'Аналитика эффективности',
        icon: '📈',
        route: '/demo/logistics/owner/modules/logistics-reports'
      },
      {
        title: 'Настроить интеграции',
        description: '1С и ERP системы',
        icon: '🔗',
        route: '/demo/logistics/owner/modules/integrations'
      }
    ]
  }
];

export const logisticsModules: LogisticsModule[] = [
  {
    id: 'order-placement',
    title: 'Оформление заказа',
    description: 'Создание и управление заказами доставки',
    icon: '📝',
    type: 'form',
    roles: ['user', 'manager', 'owner'],
    permissions: { user: 'RW', manager: 'RWD', owner: 'R' },
    route: '/demo/logistics/user/modules/order-placement',
    features: ['Мультишаговая форма', 'Расчёт стоимости', 'Выбор окна доставки']
  },
  {
    id: 'delivery-tracking',
    title: 'Трекинг доставки',
    description: 'Реальное время отслеживания на карте',
    icon: '🗺️',
    type: 'map',
    roles: ['user', 'manager', 'owner'],
    permissions: { user: 'R*', manager: 'RW', owner: 'RW' },
    route: '/demo/logistics/user/modules/delivery-tracking',
    features: ['Интерактивная карта', 'Чек-поинты', 'ETA прогноз']
  },
  {
    id: 'warehouse',
    title: 'Управление складом',
    description: 'Контроль остатков и позиций',
    icon: '🏭',
    type: 'table',
    roles: ['manager', 'owner'],
    permissions: { user: '-', manager: 'RWD', owner: 'RW' },
    route: '/demo/logistics/manager/modules/warehouse',
    features: ['Таблица номенклатуры', 'Пороги запасов', 'Приход/расход']
  },
  {
    id: 'courier-app',
    title: 'Панель курьера',
    description: 'Маршруты и статусы доставки',
    icon: '🚚',
    type: 'dashboard',
    roles: ['user', 'manager', 'owner'],
    permissions: { user: 'R*', manager: 'RWD', owner: 'R' },
    route: '/demo/logistics/manager/modules/courier-app',
    features: ['Оптимизация маршрута', 'Статусы точек', 'Фото-подтверждение']
  },
  {
    id: 'documents',
    title: 'Документы',
    description: 'Генерация накладных и актов',
    icon: '📄',
    type: 'documents',
    roles: ['user', 'manager', 'owner'],
    permissions: { user: 'R', manager: 'RWD', owner: 'RWD' },
    route: '/demo/logistics/manager/modules/documents',
    features: ['ТТН/акты', 'PDF экспорт', 'Штрих-коды']
  },
  {
    id: 'inventory-audit',
    title: 'Инвентаризация',
    description: 'Учёт и сверка запасов',
    icon: '📋',
    type: 'form',
    roles: ['manager', 'owner'],
    permissions: { user: '-', manager: 'RWD', owner: 'RW' },
    route: '/demo/logistics/manager/modules/inventory-audit',
    features: ['Чек-листы', 'Расхождения', 'Корректировки']
  },
  {
    id: 'logistics-reports',
    title: 'Отчёты по логистике',
    description: 'Аналитика отгрузок и эффективности',
    icon: '📊',
    type: 'analytics',
    roles: ['manager', 'owner'],
    permissions: { user: '-', manager: 'R', owner: 'RWD' },
    route: '/demo/logistics/owner/modules/logistics-reports',
    features: ['KPI дашборд', 'Сравнение периодов', 'Экспорт']
  },
  {
    id: 'delivery-analytics',
    title: 'Аналитика доставки',
    description: 'Время доставки и отклонения',
    icon: '⏱️',
    type: 'analytics',
    roles: ['manager', 'owner'],
    permissions: { user: '-', manager: 'R', owner: 'RWD' },
    route: '/demo/logistics/owner/modules/delivery-analytics',
    features: ['SLA метрики', 'Heatmap регионов', 'Тренды']
  },
  {
    id: 'notifications',
    title: 'Уведомления',
    description: 'Push и email оповещения',
    icon: '🔔',
    type: 'dashboard',
    roles: ['user', 'manager', 'owner'],
    permissions: { user: 'RW', manager: 'RWD', owner: 'RWD' },
    route: '/demo/logistics/manager/modules/notifications',
    features: ['Шаблоны', 'Сценарии', 'Логи отправки']
  },
  {
    id: 'integrations',
    title: 'API-интеграции',
    description: '1С, ERP и другие системы',
    icon: '🔗',
    type: 'integrations',
    roles: ['manager', 'owner'],
    permissions: { user: '-', manager: 'RW', owner: 'RWD' },
    route: '/demo/logistics/owner/modules/integrations',
    features: ['Коннекторы', 'Расписания', 'Логи ошибок']
  }
];

export const getRoleById = (id: string) => 
  logisticsRoles.find(role => role.id === id);

export const getModulesByRole = (roleId: string) =>
  logisticsModules.filter(module => module.roles.includes(roleId as any));

export const getModuleById = (id: string) =>
  logisticsModules.find(module => module.id === id);