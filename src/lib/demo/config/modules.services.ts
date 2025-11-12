export interface ServiceModuleConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  roles: ('user' | 'manager' | 'owner')[];
  type: 'form' | 'table' | 'calendar' | 'payment' | 'analytics' | 'push';
  badges: string[];
  path: string;
  permissions: {
    user: ('read' | 'write' | 'delete')[];
    manager: ('read' | 'write' | 'delete')[];
    owner: ('read' | 'write' | 'delete')[];
  };
}

export const SERVICES_MODULES_CONFIG: ServiceModuleConfig[] = [
  {
    id: 'booking',
    title: 'Онлайн-бронирование',
    description: 'Запись на услуги с выбором времени и предоплатой',
    icon: '📅',
    roles: ['user', 'manager', 'owner'],
    type: 'calendar',
    badges: ['форма', 'календарь'],
    path: '/demo/services/user/modules/booking',
    permissions: {
      user: ['read', 'write'],
      manager: ['read', 'write', 'delete'],
      owner: ['read', 'write', 'delete']
    }
  },
  {
    id: 'catalog',
    title: 'Меню / Прайс / Афиша',
    description: 'Каталог услуг, блюд и мероприятий',
    icon: '📋',
    roles: ['user', 'manager', 'owner'],
    type: 'table',
    badges: ['каталог', 'фильтры'],
    path: '/demo/services/user/modules/catalog',
    permissions: {
      user: ['read'],
      manager: ['read', 'write', 'delete'],
      owner: ['read', 'write', 'delete']
    }
  },
  {
    id: 'ticketing',
    title: 'Билеты и оплата',
    description: 'Продажа билетов с онлайн-оплатой и QR-кодами',
    icon: '🎫',
    roles: ['user', 'manager', 'owner'],
    type: 'payment',
    badges: ['оплата', 'QR'],
    path: '/demo/services/user/modules/ticketing',
    permissions: {
      user: ['read', 'write'],
      manager: ['read', 'write', 'delete'],
      owner: ['read', 'write', 'delete']
    }
  },
  {
    id: 'reviews',
    title: 'Отзывы и рейтинг',
    description: 'Система оценок и отзывов с модерацией',
    icon: '⭐',
    roles: ['user', 'manager', 'owner'],
    type: 'form',
    badges: ['рейтинг', 'модерация'],
    path: '/demo/services/user/modules/reviews',
    permissions: {
      user: ['read', 'write'],
      manager: ['read', 'write'],
      owner: ['read', 'write', 'delete']
    }
  },
  {
    id: 'staff-roster',
    title: 'Расписание сотрудников',
    description: 'Управление сменами и доступностью персонала',
    icon: '👥',
    roles: ['manager', 'owner'],
    type: 'calendar',
    badges: ['календарь', 'смены'],
    path: '/demo/services/manager/modules/staff-roster',
    permissions: {
      user: ['read'],
      manager: ['read', 'write', 'delete'],
      owner: ['read', 'write', 'delete']
    }
  },
  {
    id: 'inventory',
    title: 'Склад и инвентарь',
    description: 'Учёт расходников, ингредиентов и мерча',
    icon: '📦',
    roles: ['manager', 'owner'],
    type: 'table',
    badges: ['учёт', 'остатки'],
    path: '/demo/services/manager/modules/inventory',
    permissions: {
      user: [],
      manager: ['read', 'write', 'delete'],
      owner: ['read', 'write', 'delete']
    }
  },
  {
    id: 'revenue-reports',
    title: 'Отчёты по выручке',
    description: 'Аналитика продаж и финансовые отчёты',
    icon: '📊',
    roles: ['manager', 'owner'],
    type: 'analytics',
    badges: ['аналитика', 'графики'],
    path: '/demo/services/owner/modules/revenue-reports',
    permissions: {
      user: [],
      manager: ['read'],
      owner: ['read', 'write', 'delete']
    }
  },
  {
    id: 'loyalty',
    title: 'Программа лояльности',
    description: 'Бонусная система и промокоды',
    icon: '🎁',
    roles: ['user', 'manager', 'owner'],
    type: 'form',
    badges: ['баллы', 'уровни'],
    path: '/demo/services/user/modules/loyalty',
    permissions: {
      user: ['read', 'write'],
      manager: ['read', 'write', 'delete'],
      owner: ['read', 'write', 'delete']
    }
  },
  {
    id: 'booking-notifications',
    title: 'Уведомления о брони',
    description: 'Напоминания и уведомления для клиентов',
    icon: '🔔',
    roles: ['user', 'manager', 'owner'],
    type: 'push',
    badges: ['уведомления', 'шаблоны'],
    path: '/demo/services/user/modules/booking-notifications',
    permissions: {
      user: ['read', 'write'],
      manager: ['read', 'write', 'delete'],
      owner: ['read', 'write', 'delete']
    }
  },
  {
    id: 'promo-push',
    title: 'Push-уведомления',
    description: 'Кампании скидок и акций',
    icon: '📢',
    roles: ['manager', 'owner'],
    type: 'push',
    badges: ['рассылки', 'акции'],
    path: '/demo/services/owner/modules/promo-push',
    permissions: {
      user: ['read'],
      manager: ['read', 'write', 'delete'],
      owner: ['read', 'write', 'delete']
    }
  }
];

export const getModulesByRole = (role: string) => 
  SERVICES_MODULES_CONFIG.filter(module => module.roles.includes(role as any));

export const getModuleById = (id: string) =>
  SERVICES_MODULES_CONFIG.find(module => module.id === id);

export const checkPermission = (moduleId: string, role: string, action: 'read' | 'write' | 'delete') => {
  const module = getModuleById(moduleId);
  if (!module) return false;
  
  return module.permissions[role as keyof typeof module.permissions]?.includes(action) || false;
};