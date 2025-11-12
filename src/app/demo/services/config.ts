export interface ServiceModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  roles: ('user' | 'manager' | 'owner')[];
  type: 'form' | 'table' | 'calendar' | 'payment' | 'analytics' | 'push';
  badges: string[];
  path: string;
}

export interface ServiceRole {
  id: 'user' | 'manager' | 'owner';
  title: string;
  description: string;
  kpi: {
    title: string;
    value: string;
    trend?: number;
  }[];
  quickActions: {
    title: string;
    description: string;
    icon: string;
    path: string;
  }[];
}

export const SERVICE_MODULES: ServiceModule[] = [
  {
    id: 'booking',
    title: 'Онлайн-бронирование',
    description: 'Запись на услуги с выбором времени и предоплатой',
    icon: '📅',
    roles: ['user', 'manager', 'owner'],
    type: 'calendar',
    badges: ['форма', 'календарь'],
    path: '/demo/services/user/modules/booking'
  },
  {
    id: 'catalog',
    title: 'Меню / Прайс / Афиша',
    description: 'Каталог услуг, блюд и мероприятий',
    icon: '📋',
    roles: ['user', 'manager', 'owner'],
    type: 'table',
    badges: ['каталог', 'фильтры'],
    path: '/demo/services/user/modules/catalog'
  },
  {
    id: 'ticketing',
    title: 'Билеты и оплата',
    description: 'Продажа билетов с онлайн-оплатой и QR-кодами',
    icon: '🎫',
    roles: ['user', 'manager', 'owner'],
    type: 'payment',
    badges: ['оплата', 'QR'],
    path: '/demo/services/user/modules/ticketing'
  },
  {
    id: 'reviews',
    title: 'Отзывы и рейтинг',
    description: 'Система оценок и отзывов с модерацией',
    icon: '⭐',
    roles: ['user', 'manager', 'owner'],
    type: 'form',
    badges: ['рейтинг', 'модерация'],
    path: '/demo/services/user/modules/reviews'
  },
  {
    id: 'staff-roster',
    title: 'Расписание сотрудников',
    description: 'Управление сменами и доступностью персонала',
    icon: '👥',
    roles: ['manager', 'owner'],
    type: 'calendar',
    badges: ['календарь', 'смены'],
    path: '/demo/services/manager/modules/staff-roster'
  },
  {
    id: 'inventory',
    title: 'Склад и инвентарь',
    description: 'Учёт расходников, ингредиентов и мерча',
    icon: '📦',
    roles: ['manager', 'owner'],
    type: 'table',
    badges: ['учёт', 'остатки'],
    path: '/demo/services/manager/modules/inventory'
  },
  {
    id: 'revenue-reports',
    title: 'Отчёты по выручке',
    description: 'Аналитика продаж и финансовые отчёты',
    icon: '📊',
    roles: ['manager', 'owner'],
    type: 'analytics',
    badges: ['аналитика', 'графики'],
    path: '/demo/services/owner/modules/revenue-reports'
  },
  {
    id: 'loyalty',
    title: 'Программа лояльности',
    description: 'Бонусная система и промокоды',
    icon: '🎁',
    roles: ['user', 'manager', 'owner'],
    type: 'form',
    badges: ['баллы', 'уровни'],
    path: '/demo/services/user/modules/loyalty'
  },
  {
    id: 'booking-notifications',
    title: 'Уведомления о брони',
    description: 'Напоминания и уведомления для клиентов',
    icon: '🔔',
    roles: ['user', 'manager', 'owner'],
    type: 'push',
    badges: ['уведомления', 'шаблоны'],
    path: '/demo/services/user/modules/booking-notifications'
  },
  {
    id: 'promo-push',
    title: 'Push-уведомления',
    description: 'Кампании скидок и акций',
    icon: '📢',
    roles: ['manager', 'owner'],
    type: 'push',
    badges: ['рассылки', 'акции'],
    path: '/demo/services/owner/modules/promo-push'
  }
];

export const SERVICE_ROLES: ServiceRole[] = [
  {
    id: 'user',
    title: 'Клиент',
    description: 'Бронирование услуг, покупка билетов, отзывы',
    kpi: [
      { title: 'Мои бронирования', value: '2', trend: 0 },
      { title: 'Активные билеты', value: '1', trend: 0 },
      { title: 'Бонусные баллы', value: '540', trend: 12 }
    ],
    quickActions: [
      {
        title: 'Забронировать',
        description: 'Запись на услугу',
        icon: '📅',
        path: '/demo/services/user/modules/booking'
      },
      {
        title: 'Купить билет',
        description: 'На мероприятие',
        icon: '🎫',
        path: '/demo/services/user/modules/ticketing'
      },
      {
        title: 'Активировать промокод',
        description: 'Использовать скидку',
        icon: '🎁',
        path: '/demo/services/user/modules/loyalty'
      }
    ]
  },
  {
    id: 'manager',
    title: 'Менеджер',
    description: 'Управление бронями, расписанием, складом',
    kpi: [
      { title: 'Брони сегодня', value: '36', trend: 8 },
      { title: 'Свободные слоты', value: '14', trend: -3 },
      { title: 'Платежи к подтверждению', value: '5', trend: 2 }
    ],
    quickActions: [
      {
        title: 'Создать бронь',
        description: 'Для клиента',
        icon: '✏️',
        path: '/demo/services/manager/modules/booking'
      },
      {
        title: 'Открыть расписание',
        description: 'Сотрудников',
        icon: '👥',
        path: '/demo/services/manager/modules/staff-roster'
      },
      {
        title: 'Добавить позицию',
        description: 'В меню/прайс',
        icon: '📋',
        path: '/demo/services/manager/modules/catalog'
      }
    ]
  },
  {
    id: 'owner',
    title: 'Владелец',
    description: 'Аналитика, финансы, стратегические настройки',
    kpi: [
      { title: 'Выручка за неделю', value: '1.7M ₽', trend: 15 },
      { title: 'Заполняемость', value: '72%', trend: 5 },
      { title: 'NPS', value: '4.6', trend: 0.2 }
    ],
    quickActions: [
      {
        title: 'Отчёт по выручке',
        description: 'Финансовая аналитика',
        icon: '📊',
        path: '/demo/services/owner/modules/revenue-reports'
      },
      {
        title: 'Настроить лояльность',
        description: 'Программа бонусов',
        icon: '🎁',
        path: '/demo/services/owner/modules/loyalty'
      },
      {
        title: 'Склад и закупки',
        description: 'Управление инвентарём',
        icon: '📦',
        path: '/demo/services/owner/modules/inventory'
      }
    ]
  }
];

export const getModulesByRole = (role: string) => 
  SERVICE_MODULES.filter(module => module.roles.includes(role as any));

export const getRoleById = (id: string) => 
  SERVICE_ROLES.find(role => role.id === id);