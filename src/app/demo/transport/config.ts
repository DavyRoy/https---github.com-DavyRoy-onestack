export interface TransportModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  roles: ('user' | 'manager' | 'owner')[];
  permissions: {
    user: 'R' | 'RW' | 'RWD' | '-';
    manager: 'R' | 'RW' | 'RWD' | '-';
    owner: 'R' | 'RW' | 'RWD' | '-';
  };
  path: string;
  category: string;
  features: string[];
}

export interface TransportRole {
  id: 'user' | 'manager' | 'owner';
  title: string;
  description: string;
  icon: string;
  color: string;
  modules: string[];
}

export const TRANSPORT_ROLES: Record<'user' | 'manager' | 'owner', TransportRole> = {
  user: {
    id: 'user',
    title: 'Пассажир',
    description: 'Поиск маршрутов, покупка билетов, отслеживание транспорта',
    icon: '👤',
    color: 'blue',
    modules: ['timetable', 'ticketing', 'vehicle-tracking', 'notifications', 'reports-export']
  },
  manager: {
    id: 'manager',
    title: 'Диспетчер',
    description: 'Управление маршрутами, транспортом, уведомлениями',
    icon: '🎯',
    color: 'green',
    modules: ['timetable', 'ticketing', 'vehicle-tracking', 'route-management', 'sales-ledger', 'drivers', 'notifications', 'reports-export', 'integrations']
  },
  owner: {
    id: 'owner',
    title: 'Транспортная компания',
    description: 'Аналитика, отчётность, интеграции, стратегическое управление',
    icon: '🏢',
    color: 'purple',
    modules: ['timetable', 'ticketing', 'vehicle-tracking', 'route-management', 'sales-ledger', 'ridership-analytics', 'drivers', 'notifications', 'reports-export', 'integrations']
  }
};

export const TRANSPORT_MODULES: TransportModule[] = [
  {
    id: 'timetable',
    title: 'Онлайн-расписание',
    description: 'Актуальное расписание рейсов, поиск и фильтрация',
    icon: '📅',
    roles: ['user', 'manager', 'owner'],
    permissions: { user: 'RW', manager: 'RWD', owner: 'RW' },
    path: '/demo/transport/user/modules/timetable',
    category: 'Основные',
    features: ['Поиск маршрутов', 'Фильтры по ТС', 'Избранное', 'Статусы рейсов']
  },
  {
    id: 'ticketing',
    title: 'Покупка билета',
    description: 'Онлайн-покупка, электронные билеты, QR-коды',
    icon: '🎫',
    roles: ['user', 'manager', 'owner'],
    permissions: { user: 'RW', manager: 'RWD', owner: 'RWD' },
    path: '/demo/transport/user/modules/ticketing',
    category: 'Основные',
    features: ['Выбор места', 'Онлайн-оплата', 'Электронные билеты', 'История покупок']
  },
  {
    id: 'vehicle-tracking',
    title: 'Отслеживание транспорта',
    description: 'GPS-трекинг в реальном времени, ETA до остановки',
    icon: '📍',
    roles: ['user', 'manager', 'owner'],
    permissions: { user: 'R', manager: 'RW', owner: 'RW' },
    path: '/demo/transport/user/modules/vehicle-tracking',
    category: 'Основные',
    features: ['Карта маршрутов', 'Тепловая карта', 'ETA в реальном времени', 'Статусы ТС']
  },
  {
    id: 'route-management',
    title: 'Управление маршрутами',
    description: 'Создание и редактирование маршрутов, остановок, расписаний',
    icon: '🛣️',
    roles: ['manager', 'owner'],
    permissions: { user: 'R', manager: 'RWD', owner: 'RWD' },
    path: '/demo/transport/manager/modules/route-management',
    category: 'Управление',
    features: ['CRUD маршрутов', 'Расписания по дням', 'Версии', 'Публикация']
  },
  {
    id: 'sales-ledger',
    title: 'Продажа / учёт билетов',
    description: 'Учёт продаж, возвраты, сверка смены',
    icon: '💰',
    roles: ['manager', 'owner'],
    permissions: { user: 'R', manager: 'RWD', owner: 'RWD' },
    path: '/demo/transport/manager/modules/sales-ledger',
    category: 'Финансы',
    features: ['Учёт операций', 'Возвраты', 'Сверка смены', 'Каналы продаж']
  },
  {
    id: 'ridership-analytics',
    title: 'Аналитика пассажиропотока',
    description: 'Анализ загрузки, сегментация, прогнозирование',
    icon: '📊',
    roles: ['owner'],
    permissions: { user: 'R', manager: 'R', owner: 'RWD' },
    path: '/demo/transport/owner/modules/ridership-analytics',
    category: 'Аналитика',
    features: ['Графики загрузки', 'Тепловые карты', 'Сегментация', 'Прогнозы']
  },
  {
    id: 'drivers',
    title: 'Управление водителями',
    description: 'Графики смен, допуски, документы',
    icon: '👨‍✈️',
    roles: ['manager', 'owner'],
    permissions: { user: '-', manager: 'RWD', owner: 'RWD' },
    path: '/demo/transport/manager/modules/drivers',
    category: 'Управление',
    features: ['Календарь смен', 'Документы', 'Рейтинги', 'Нарушения']
  },
  {
    id: 'notifications',
    title: 'Уведомления',
    description: 'Оповещения о задержках, отменах, изменениях',
    icon: '🔔',
    roles: ['user', 'manager', 'owner'],
    permissions: { user: 'RW', manager: 'RWD', owner: 'RWD' },
    path: '/demo/transport/manager/modules/notifications',
    category: 'Коммуникация',
    features: ['Шаблоны сообщений', 'Подписки', 'Логи отправки', 'SLA']
  },
  {
    id: 'reports-export',
    title: 'Отчётность и экспорт',
    description: 'Генерация отчётов, экспорт в Excel/PDF',
    icon: '📋',
    roles: ['user', 'manager', 'owner'],
    permissions: { user: 'R', manager: 'R', owner: 'RWD' },
    path: '/demo/transport/owner/modules/reports-export',
    category: 'Аналитика',
    features: ['Конструктор отчётов', 'Экспорт XLSX/PDF', 'Пресеты', 'Планирование']
  },
  {
    id: 'integrations',
    title: 'API-интеграция',
    description: 'Интеграция с госданными, GTFS, внешними системами',
    icon: '🔌',
    roles: ['manager', 'owner'],
    permissions: { user: '-', manager: 'RW', owner: 'RWD' },
    path: '/demo/transport/owner/modules/integrations',
    category: 'Технические',
    features: ['Гос-портал', 'GTFS импорт', 'Логи синхронизации', 'Мониторинг']
  }
];

export const TRANSPORT_KPI = {
  total: {
    vehiclesInTransit: 124,
    delays: 9,
    dailyPassengers: 27400,
    routesActive: 86
  },
  user: {
    nearbyTrips: 3,
    activeTickets: 1,
    subscribedRoutes: 2
  },
  manager: {
    vehiclesOnline: 186,
    currentDelays: 12,
    activeIncidents: 1
  },
  owner: {
    dailyPassengers: 27400,
    occupancyRate: 68,
    dailyRevenue: 3200000
  }
};