export const TRANSPORT_MODULES_CONFIG = {
  timetable: {
    id: 'timetable',
    name: 'Онлайн-расписание',
    description: 'Поиск и управление расписанием рейсов',
    category: 'Основные',
    roles: ['user', 'manager', 'owner'],
    features: ['Поиск маршрутов', 'Фильтрация', 'Статусы рейсов', 'Избранное'],
    permissions: {
      user: ['read', 'favorite'],
      manager: ['read', 'write', 'delete', 'publish'],
      owner: ['read', 'write', 'export']
    }
  },
  ticketing: {
    id: 'ticketing',
    name: 'Покупка билета',
    description: 'Онлайн-покупка и управление билетами',
    category: 'Основные',
    roles: ['user', 'manager', 'owner'],
    features: ['Электронные билеты', 'QR-коды', 'Онлайн-оплата', 'История'],
    permissions: {
      user: ['read', 'write', 'purchase'],
      manager: ['read', 'write', 'refund', 'report'],
      owner: ['read', 'write', 'analytics', 'export']
    }
  },
  // ... остальные модули
};

export type TransportModuleId = keyof typeof TRANSPORT_MODULES_CONFIG;