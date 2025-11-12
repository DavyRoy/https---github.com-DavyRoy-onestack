// /src/app/demo/medicine/user/demo-data.ts
export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  badge?: number;
  isNew?: boolean;
}

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  datetime: string;
  location: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  avatar: string;
  isUrgent?: boolean;
  type: 'consultation' | 'examination' | 'procedure';
  duration: number;
  notes?: string;
}

export interface HealthMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: 'excellent' | 'good' | 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastUpdate: string;
  targetValue?: string;
  change?: number;
  history?: { date: string; value: string }[];
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  remaining: string;
  doctor: string;
  status: 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  instructions: string;
  refills: number;
  remainingRefills: number;
  pharmacy: string;
  sideEffects?: string[];
  category: 'tablet' | 'capsule' | 'injection' | 'ointment' | 'syrup';
}

export interface MedicalDocument {
  id: string;
  title: string;
  type: 'analysis' | 'diagnosis' | 'prescription' | 'referral' | 'image' | 'report';
  doctor: string;
  date: string;
  size: string;
  category: string;
  isImportant?: boolean;
  downloadUrl?: string;
  tags?: string[];
}

export interface ClinicContact {
  name: string;
  phone: string;
  icon: string;
  hours: string;
  department: string;
  emergency?: boolean;
  description?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'prescription' | 'result' | 'reminder' | 'system';
  date: string;
  read: boolean;
  actionUrl?: string;
  priority: 'high' | 'medium' | 'low';
}

// Quick Actions with enhanced data
export const quickActions: QuickAction[] = [
  {
    id: 'appointment',
    label: 'Запись к врачу',
    description: 'Онлайн запись на приём к специалисту',
    icon: '📅',
    href: '/demo/medicine/user/modules/appointment',
    color: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20',
    badge: 2
  },
  {
    id: 'medical-card',
    label: 'Медкарта',
    description: 'Полная история здоровья и анализы',
    icon: '🏥',
    href: '/demo/medicine/user/modules/medical-card',
    color: 'bg-gradient-to-br from-green-500/20 to-emerald-600/20'
  },
  {
    id: 'prescriptions',
    label: 'Рецепты',
    description: 'Активные назначения и история',
    icon: '💊',
    href: '/demo/medicine/user/modules/history',
    color: 'bg-gradient-to-br from-purple-500/20 to-purple-600/20',
    badge: 3
  },
  {
    id: 'chat',
    label: 'Чат с врачом',
    description: 'Онлайн консультации 24/7',
    icon: '💬',
    href: '/demo/medicine/user/modules/chat',
    color: 'bg-gradient-to-br from-orange-500/20 to-orange-600/20',
    badge: 5,
    isNew: true
  }
];

// Upcoming Appointments with enhanced data
export const upcomingAppointments: Appointment[] = [
  {
    id: '1',
    doctor: 'Др. Иванова Анна Сергеевна',
    specialty: 'Кардиолог',
    date: '2024-01-15',
    time: '14:30',
    datetime: '2024-01-15T14:30:00',
    location: 'Клиника №1, кабинет 305',
    status: 'confirmed',
    avatar: '👩‍⚕️',
    type: 'consultation',
    duration: 30,
    notes: 'Принести результаты предыдущих анализов'
  },
  {
    id: '2',
    doctor: 'Др. Петров Иван Васильевич',
    specialty: 'Терапевт',
    date: '2024-01-16',
    time: '10:00',
    datetime: '2024-01-16T10:00:00',
    location: 'Клиника №2, кабинет 102',
    status: 'confirmed',
    avatar: '👨‍⚕️',
    type: 'examination',
    duration: 45,
    isUrgent: true
  }
];

// Health Metrics with enhanced data
export const healthMetrics: HealthMetric[] = [
  {
    id: '1',
    name: 'Артериальное давление',
    value: '120/80',
    unit: 'мм рт.ст.',
    status: 'normal',
    trend: 'stable',
    lastUpdate: '2 часа назад',
    targetValue: '120/80',
    change: 0
  },
  {
    id: '2',
    name: 'Пульс',
    value: '72',
    unit: 'уд/мин',
    status: 'good',
    trend: 'down',
    lastUpdate: 'Сегодня',
    targetValue: '60-80',
    change: -3
  },
  {
    id: '3',
    name: 'Сатурация кислорода',
    value: '98',
    unit: '%',
    status: 'excellent',
    trend: 'stable',
    lastUpdate: 'Вчера',
    targetValue: '95-100',
    change: 0
  },
  {
    id: '4',
    name: 'Температура тела',
    value: '36.6',
    unit: '°C',
    status: 'normal',
    trend: 'stable',
    lastUpdate: 'Сегодня',
    targetValue: '36.6',
    change: 0
  }
];

// Active Prescriptions with enhanced data
export const activePrescriptions: Prescription[] = [
  {
    id: '1',
    medication: 'Амлодипин',
    dosage: '5 мг',
    frequency: '1 раз в день',
    duration: '30 дней',
    remaining: '15 дней',
    doctor: 'Др. Иванова А.С.',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-01-30',
    instructions: 'Принимать утром после еды',
    refills: 3,
    remainingRefills: 2,
    pharmacy: 'Аптека №1, ул. Центральная, 15',
    category: 'tablet'
  },
  {
    id: '2',
    medication: 'Метформин',
    dosage: '500 мг',
    frequency: '2 раза в день',
    duration: '90 дней',
    remaining: '45 дней',
    doctor: 'Др. Петров И.В.',
    status: 'active',
    startDate: '2023-12-15',
    endDate: '2024-03-15',
    instructions: 'Принимать во время еды',
    refills: 2,
    remainingRefills: 1,
    pharmacy: 'Аптека №2, ул. Ленина, 42',
    category: 'tablet'
  }
];

// Recent Documents with enhanced data
export const recentDocuments: MedicalDocument[] = [
  {
    id: '1',
    title: 'Результаты общего анализа крови',
    type: 'analysis',
    doctor: 'Др. Иванова А.С.',
    date: '2024-01-10',
    size: '2.4 МБ',
    category: 'Лабораторные исследования',
    isImportant: true
  },
  {
    id: '2',
    title: 'Заключение ЭКГ с нагрузкой',
    type: 'diagnosis',
    doctor: 'Др. Петров И.В.',
    date: '2024-01-08',
    size: '1.8 МБ',
    category: 'Функциональная диагностика'
  },
  {
    id: '3',
    title: 'Рецепт №12345 - Амлодипин',
    type: 'prescription',
    doctor: 'Др. Иванова А.С.',
    date: '2024-01-05',
    size: '0.8 МБ',
    category: 'Назначения'
  }
];

// Health Tips as simple string array to fix React rendering error
export const healthTips: string[] = [
  'Пейте достаточное количество воды - 2 литра в день улучшают обмен веществ и способствуют детоксикации организма.',
  'Регулярные физические нагрузки 30 минут в день снижают риск сердечно-сосудистых заболеваний на 35%.',
  'Спите 7-8 часов в сутки для полноценного восстановления организма и поддержания когнитивных функций.',
  'Избегайте курения и ограничьте потребление алкоголя - это снижает риск развития хронических заболеваний.',
  'Регулярно проверяйте артериальное давление - раннее выявление гипертонии предотвращает осложнения.',
  'Ежедневные прогулки на свежем воздухе улучшают настроение и укрепляют иммунную систему.',
  'Сбалансированное питание с преобладанием овощей и фруктов обеспечивает организм необходимыми витаминами.'
];

// Clinic Contacts with enhanced data
export const clinicContacts: ClinicContact[] = [
  {
    name: 'Регистратура',
    phone: '+7 (495) 123-45-67',
    icon: '📞',
    hours: '08:00-20:00',
    department: 'Администрация',
    description: 'Запись на прием, справки'
  },
  {
    name: 'Скорая помощь',
    phone: '112 или 103',
    icon: '🚨',
    hours: 'Круглосуточно',
    department: 'Экстренная служба',
    emergency: true,
    description: 'Экстренная медицинская помощь'
  },
  {
    name: 'Справочная служба',
    phone: '+7 (495) 123-45-68',
    icon: 'ℹ️',
    hours: '09:00-18:00',
    department: 'Информация',
    description: 'Общая информация о клинике'
  }
];

// Helper functions
export const getMetricStatusColor = (status: HealthMetric['status']): string => {
  const colors = {
    excellent: 'text-green-400',
    good: 'text-green-500',
    normal: 'text-blue-400',
    warning: 'text-yellow-400',
    critical: 'text-red-400'
  };
  return colors[status];
};

export const getTrendIcon = (trend: HealthMetric['trend']): string => {
  const icons = {
    up: '↗️',
    down: '↘️',
    stable: '→'
  };
  return icons[trend];
};

export const formatAppointmentDate = (date: string, time: string): string => {
  const appointmentDate = new Date(`${date}T${time}`);
  return appointmentDate.toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long'
  });
};