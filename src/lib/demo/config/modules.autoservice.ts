export const AUTOSERVICE_DEMO_CONFIG = {
  roles: {
    user: {
      name: 'Клиент',
      description: 'Владелец автомобиля, заказывающий услуги сервиса',
      modules: ['repair-request', 'price-estimator', 'visit-history', 'billing', 'reviews']
    },
    manager: {
      name: 'Мастер/Администратор',
      description: 'Сотрудник сервиса, выполняющий работы и управляющий процессами',
      modules: ['repair-request', 'price-estimator', 'visit-history', 'parts-management', 'masters-schedule', 'photo-report', 'billing', 'notifications']
    },
    owner: {
      name: 'Директор СТО',
      description: 'Владелец бизнеса, управляющий финансами и аналитикой',
      modules: ['parts-management', 'masters-schedule', 'billing', 'revenue-reports', 'notifications', 'reviews']
    }
  },
  
  modules: {
    'repair-request': {
      name: 'Онлайн-заявка на ремонт',
      description: 'Подача заявки на ремонт, отслеживание статуса',
      icon: '📝',
      permissions: {
        user: ['read', 'write'],
        manager: ['read', 'write', 'delete'],
        owner: ['read']
      }
    },
    'price-estimator': {
      name: 'Расчёт стоимости',
      description: 'Оценка стоимости работ и запчастей',
      icon: '💰',
      permissions: {
        user: ['read', 'write'],
        manager: ['read', 'write', 'delete'],
        owner: ['read', 'write', 'delete']
      }
    },
    'visit-history': {
      name: 'История посещений',
      description: 'Архив всех визитов и выполненных работ',
      icon: '📊',
      permissions: {
        user: ['read'],
        manager: ['read', 'write'],
        owner: ['read']
      }
    },
    'parts-management': {
      name: 'Управление запчастями',
      description: 'Складской учёт и резервирование запчастей',
      icon: '🔧',
      permissions: {
        user: [],
        manager: ['read', 'write', 'delete'],
        owner: ['read', 'write', 'delete']
      }
    },
    'masters-schedule': {
      name: 'Расписание мастеров',
      description: 'Планирование работ и загрузка боксов',
      icon: '📅',
      permissions: {
        user: ['read'],
        manager: ['read', 'write', 'delete'],
        owner: ['read']
      }
    },
    'photo-report': {
      name: 'Фотоотчёт о ремонте',
      description: 'Документирование процесса ремонта',
      icon: '📸',
      permissions: {
        user: ['read'],
        manager: ['read', 'write'],
        owner: ['read']
      }
    },
    'billing': {
      name: 'Счёт / оплата',
      description: 'Выставление счетов и приём платежей',
      icon: '🧾',
      permissions: {
        user: ['read', 'write'],
        manager: ['read', 'write', 'delete'],
        owner: ['read', 'write', 'delete']
      }
    },
    'revenue-reports': {
      name: 'Отчётность по выручке',
      description: 'Аналитика доходов и финансовые отчёты',
      icon: '📈',
      permissions: {
        user: [],
        manager: ['read'],
        owner: ['read', 'write', 'delete']
      }
    },
    'notifications': {
      name: 'Уведомления клиентам',
      description: 'Настройка оповещений и рассылок',
      icon: '🔔',
      permissions: {
        user: ['read', 'write'],
        manager: ['read', 'write', 'delete'],
        owner: ['read', 'write', 'delete']
      }
    },
    'reviews': {
      name: 'Рейтинг и отзывы',
      description: 'Система оценок и обратной связи',
      icon: '⭐',
      permissions: {
        user: ['read', 'write'],
        manager: ['read'],
        owner: ['read']
      }
    }
  }
};

export type AutoserviceRole = keyof typeof AUTOSERVICE_DEMO_CONFIG.roles;
export type AutoserviceModule = keyof typeof AUTOSERVICE_DEMO_CONFIG.modules;