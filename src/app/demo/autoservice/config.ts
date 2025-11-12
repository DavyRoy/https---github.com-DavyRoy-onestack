export interface AutoserviceModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  roles: ('user' | 'manager' | 'owner')[];
  type: 'form' | 'table' | 'calendar' | 'gallery' | 'analytics' | 'billing';
  path: string;
  permissions: {
    user: ('read' | 'write' | 'delete')[];
    manager: ('read' | 'write' | 'delete')[];
    owner: ('read' | 'write' | 'delete')[];
  };
}

export interface RoleConfig {
  id: 'user' | 'manager' | 'owner';
  title: string;
  description: string;
  kpi: {
    title: string;
    value: string;
    change?: string;
  }[];
  quickActions: {
    title: string;
    description: string;
    icon: string;
    href: string;
  }[];
}

export const AUTOSERVICE_MODULES: AutoserviceModule[] = [
  {
    id: 'repair-request',
    title: 'Онлайн-заявка на ремонт',
    description: 'Подача заявки на ремонт, отслеживание статуса',
    icon: '📝',
    roles: ['user', 'manager', 'owner'],
    type: 'form',
    path: '/demo/autoservice/user/modules/repair-request',
    permissions: {
      user: ['read', 'write'],
      manager: ['read', 'write', 'delete'],
      owner: ['read']
    }
  },
  {
    id: 'price-estimator',
    title: 'Расчёт стоимости',
    description: 'Оценка стоимости работ и запчастей',
    icon: '💰',
    roles: ['user', 'manager', 'owner'],
    type: 'form',
    path: '/demo/autoservice/user/modules/price-estimator',
    permissions: {
      user: ['read', 'write'],
      manager: ['read', 'write', 'delete'],
      owner: ['read', 'write', 'delete']
    }
  },
  {
    id: 'visit-history',
    title: 'История посещений',
    description: 'Архив всех визитов и выполненных работ',
    icon: '📊',
    roles: ['user', 'manager', 'owner'],
    type: 'table',
    path: '/demo/autoservice/user/modules/visit-history',
    permissions: {
      user: ['read'],
      manager: ['read', 'write'],
      owner: ['read']
    }
  },
  {
    id: 'parts-management',
    title: 'Управление запчастями',
    description: 'Складской учёт и резервирование запчастей',
    icon: '🔧',
    roles: ['manager', 'owner'],
    type: 'table',
    path: '/demo/autoservice/manager/modules/parts-management',
    permissions: {
      user: [],
      manager: ['read', 'write', 'delete'],
      owner: ['read', 'write', 'delete']
    }
  },
  {
    id: 'masters-schedule',
    title: 'Расписание мастеров',
    description: 'Планирование работ и загрузка боксов',
    icon: '📅',
    roles: ['user', 'manager', 'owner'],
    type: 'calendar',
    path: '/demo/autoservice/manager/modules/masters-schedule',
    permissions: {
      user: ['read'],
      manager: ['read', 'write', 'delete'],
      owner: ['read']
    }
  },
  {
    id: 'photo-report',
    title: 'Фотоотчёт о ремонте',
    description: 'Документирование процесса ремонта',
    icon: '📸',
    roles: ['user', 'manager', 'owner'],
    type: 'gallery',
    path: '/demo/autoservice/manager/modules/photo-report',
    permissions: {
      user: ['read'],
      manager: ['read', 'write'],
      owner: ['read']
    }
  },
  {
    id: 'billing',
    title: 'Счёт / оплата',
    description: 'Выставление счетов и приём платежей',
    icon: '🧾',
    roles: ['user', 'manager', 'owner'],
    type: 'billing',
    path: '/demo/autoservice/user/modules/billing',
    permissions: {
      user: ['read', 'write'],
      manager: ['read', 'write', 'delete'],
      owner: ['read', 'write', 'delete']
    }
  },
  {
    id: 'revenue-reports',
    title: 'Отчётность по выручке',
    description: 'Аналитика доходов и финансовые отчёты',
    icon: '📈',
    roles: ['manager', 'owner'],
    type: 'analytics',
    path: '/demo/autoservice/owner/modules/revenue-reports',
    permissions: {
      user: [],
      manager: ['read'],
      owner: ['read', 'write', 'delete']
    }
  },
  {
    id: 'notifications',
    title: 'Уведомления клиентам',
    description: 'Настройка оповещений и рассылок',
    icon: '🔔',
    roles: ['user', 'manager', 'owner'],
    type: 'form',
    path: '/demo/autoservice/manager/modules/notifications',
    permissions: {
      user: ['read', 'write'],
      manager: ['read', 'write', 'delete'],
      owner: ['read', 'write', 'delete']
    }
  },
  {
    id: 'reviews',
    title: 'Рейтинг и отзывы',
    description: 'Система оценок и обратной связи',
    icon: '⭐',
    roles: ['user', 'manager', 'owner'],
    type: 'form',
    path: '/demo/autoservice/user/modules/reviews',
    permissions: {
      user: ['read', 'write'],
      manager: ['read'],
      owner: ['read']
    }
  }
];

export const AUTOSERVICE_ROLES: Record<'user' | 'manager' | 'owner', RoleConfig> = {
  user: {
    id: 'user',
    title: 'Клиент',
    description: 'Владелец автомобиля, заказывающий услуги сервиса',
    kpi: [
      { title: 'Ближайшая запись', value: 'ПТ 11:30' },
      { title: 'Статус ремонта', value: 'Диагностика' },
      { title: 'Счета к оплате', value: '1', change: '+1 новый' }
    ],
    quickActions: [
      {
        title: 'Оставить заявку',
        description: 'Записаться на ремонт или ТО',
        icon: '📝',
        href: '/demo/autoservice/user/modules/repair-request'
      },
      {
        title: 'Рассчитать стоимость',
        description: 'Узнать предварительную цену работ',
        icon: '💰',
        href: '/demo/autoservice/user/modules/price-estimator'
      },
      {
        title: 'Оплатить счёт',
        description: 'Оплатить выставленные счета',
        icon: '💳',
        href: '/demo/autoservice/user/modules/billing'
      }
    ]
  },
  manager: {
    id: 'manager',
    title: 'Мастер / Администратор',
    description: 'Сотрудник сервиса, выполняющий работы и управляющий процессами',
    kpi: [
      { title: 'Работ сегодня', value: '8' },
      { title: 'Ожидают запчастей', value: '2', change: 'Срочный заказ' },
      { title: 'Просрочено', value: '1', change: 'Требует внимания' }
    ],
    quickActions: [
      {
        title: 'Создать заказ-наряд',
        description: 'Оформить новую работу',
        icon: '📋',
        href: '/demo/autoservice/manager/modules/repair-request'
      },
      {
        title: 'Назначить слот',
        description: 'Запланировать работу мастера',
        icon: '📅',
        href: '/demo/autoservice/manager/modules/masters-schedule'
      },
      {
        title: 'Добавить фотоотчёт',
        description: 'Загрузить фото процесса ремонта',
        icon: '📸',
        href: '/demo/autoservice/manager/modules/photo-report'
      }
    ]
  },
  owner: {
    id: 'owner',
    title: 'Директор СТО',
    description: 'Владелец бизнеса, управляющий финансами и аналитикой',
    kpi: [
      { title: 'Загрузка боксов', value: '81%', change: '+5% за неделю' },
      { title: 'Средний чек', value: '14.6k ₽', change: '+1.2k ₽' },
      { title: 'NPS', value: '4.7', change: 'Выше среднего' }
    ],
    quickActions: [
      {
        title: 'Отчёт по выручке',
        description: 'Анализ доходов и прибыли',
        icon: '📈',
        href: '/demo/autoservice/owner/modules/revenue-reports'
      },
      {
        title: 'Настроить прайс',
        description: 'Обновить цены на услуги',
        icon: '💰',
        href: '/demo/autoservice/owner/modules/price-estimator'
      },
      {
        title: 'Склад/закупки',
        description: 'Управление остатками запчастей',
        icon: '🔧',
        href: '/demo/autoservice/owner/modules/parts-management'
      }
    ]
  }
};

export const AUTOSERVICE_HERO = {
  title: 'Автосервис',
  subtitle: 'Цифровая трансформация автомобильного сервиса',
  description: 'Полный цикл управления СТО: от онлайн-записи клиента до аналитики выручки. Прозрачность, контроль качества и эффективность в одном решении.',
  cta: {
    primary: { text: 'Начать демо', href: '#roles' },
    secondary: { text: 'Узнать больше', href: '#how-it-works' }
  },
  features: [
    'Онлайн-запись и отслеживание статуса',
    'Прозрачный расчёт стоимости',
    'Фотоотчёты о ремонте',
    'Управление складом запчастей',
    'Аналитика выручки и KPI'
  ]
};