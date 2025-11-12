// /src/app/demo/medicine/user/demo-data.ts

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  avatar: string;
  duration: string;
}

export interface HealthMetric {
  id: string;
  title: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
  icon: string;
  color: string;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  remaining: number;
  nextRefill: string;
  doctor: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Document {
  id: string;
  title: string;
  type: 'analysis' | 'diagnosis' | 'prescription' | 'report';
  doctor: string;
  date: string;
  size: string;
  url: string;
}

export interface QuickAction {
  label: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

// Демо данные для ближайших приемов
export const upcomingAppointments: Appointment[] = [
  {
    id: '1',
    doctor: 'Др. Иванова Мария',
    specialty: 'Кардиолог',
    date: '15 дек 2024',
    time: '10:00',
    location: 'Клиника №1, каб. 305',
    status: 'confirmed',
    avatar: '👩‍⚕️',
    duration: '45 мин'
  },
  {
    id: '2',
    doctor: 'Др. Петров Алексей',
    specialty: 'Невролог',
    date: '18 дек 2024',
    time: '14:30',
    location: 'Клиника №2, каб. 112',
    status: 'pending',
    avatar: '👨‍⚕️',
    duration: '30 мин'
  },
  {
    id: '3',
    doctor: 'Др. Сидорова Анна',
    specialty: 'Терапевт',
    date: '20 дек 2024',
    time: '11:15',
    location: 'Клиника №1, каб. 201',
    status: 'confirmed',
    avatar: '👩‍⚕️',
    duration: '60 мин'
  }
];

// Демо данные для показателей здоровья
export const healthMetrics: HealthMetric[] = [
  {
    id: '1',
    title: 'Артериальное давление',
    value: '120',
    unit: '/80',
    trend: 'stable',
    change: '±0',
    icon: '💓',
    color: 'green'
  },
  {
    id: '2',
    title: 'Пульс',
    value: '72',
    unit: 'уд/мин',
    trend: 'down',
    change: '-5',
    icon: '📊',
    color: 'blue'
  },
  {
    id: '3',
    title: 'Уровень глюкозы',
    value: '5.2',
    unit: 'ммоль/л',
    trend: 'stable',
    change: '±0',
    icon: '🩸',
    color: 'emerald'
  },
  {
    id: '4',
    title: 'Вес',
    value: '75',
    unit: 'кг',
    trend: 'down',
    change: '-2',
    icon: '⚖️',
    color: 'purple'
  },
  {
    id: '5',
    title: 'Температура',
    value: '36.6',
    unit: '°C',
    trend: 'stable',
    change: '±0',
    icon: '🌡️',
    color: 'orange'
  },
  {
    id: '6',
    title: 'Сатурация',
    value: '98',
    unit: '%',
    trend: 'up',
    change: '+1',
    icon: '🫁',
    color: 'cyan'
  }
];

// Демо данные для активных назначений
export const activePrescriptions: Prescription[] = [
  {
    id: '1',
    medication: 'Аторвастатин',
    dosage: '20 мг',
    frequency: '1 раз в день',
    remaining: 28,
    nextRefill: '25 дек 2024',
    doctor: 'Др. Иванова М.С.',
    status: 'active'
  },
  {
    id: '2',
    medication: 'Метформин',
    dosage: '500 мг',
    frequency: '2 раза в день',
    remaining: 14,
    nextRefill: '20 дек 2024',
    doctor: 'Др. Петров А.В.',
    status: 'active'
  },
  {
    id: '3',
    medication: 'Лозартан',
    dosage: '50 мг',
    frequency: '1 раз в день',
    remaining: 42,
    nextRefill: '30 дек 2024',
    doctor: 'Др. Сидорова А.П.',
    status: 'active'
  },
  {
    id: '4',
    medication: 'Аспирин',
    dosage: '100 мг',
    frequency: '1 раз в день',
    remaining: 21,
    nextRefill: '22 дек 2024',
    doctor: 'Др. Иванова М.С.',
    status: 'active'
  }
];

// Демо данные для последних документов
export const recentDocuments: Document[] = [
  {
    id: '1',
    title: 'Общий анализ крови',
    type: 'analysis',
    doctor: 'Др. Сидорова А.П.',
    date: '10 дек 2024',
    size: '2.4 МБ',
    url: '/documents/blood-test.pdf'
  },
  {
    id: '2',
    title: 'Заключение ЭКГ',
    type: 'diagnosis',
    doctor: 'Др. Иванова М.С.',
    date: '05 дек 2024',
    size: '1.8 МБ',
    url: '/documents/ecg-report.pdf'
  },
  {
    id: '3',
    title: 'Результаты МРТ',
    type: 'report',
    doctor: 'Др. Петров А.В.',
    date: '01 дек 2024',
    size: '15.7 МБ',
    url: '/documents/mri-results.pdf'
  },
  {
    id: '4',
    title: 'Назначения терапевта',
    type: 'prescription',
    doctor: 'Др. Сидорова А.П.',
    date: '28 ноя 2024',
    size: '0.8 МБ',
    url: '/documents/prescription-nov.pdf'
  }
];

// Демо данные для быстрых действий
export const quickActions: QuickAction[] = [
  {
    label: 'Запись к врачу',
    description: 'Записаться на прием к специалисту',
    icon: '📅',
    href: '/demo/medicine/user/modules/appointment',
    color: 'blue'
  },
  {
    label: 'Мои назначения',
    description: 'Просмотр активных рецептов',
    icon: '💊',
    href: '/demo/medicine/user/modules/history',
    color: 'green'
  },
  {
    label: 'Результаты анализов',
    description: 'Последние медицинские отчеты',
    icon: '🔬',
    href: '/demo/medicine/user/modules/history',
    color: 'purple'
  },
  {
    label: 'Чат с врачом',
    description: 'Онлайн консультация',
    icon: '💬',
    href: '/demo/medicine/user/modules/chat',
    color: 'orange'
  },
  {
    label: 'Мед карта',
    description: 'Полная история здоровья',
    icon: '📋',
    href: '/demo/medicine/user/modules/history',
    color: 'cyan'
  },
  {
    label: 'Настройки',
    description: 'Персональные настройки',
    icon: '⚙️',
    href: '/demo/medicine/user/settings',
    color: 'gray'
  }
];

// Дополнительные демо данные для расширения функционала

export interface HealthTip {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'exercise' | 'mental' | 'general';
  icon: string;
}

export const healthTips: HealthTip[] = [
  {
    id: '1',
    title: 'Гидратация',
    description: 'Пейте 2-2.5 литра воды в день для поддержания метаболизма',
    category: 'nutrition',
    icon: '💧'
  },
  {
    id: '2',
    title: 'Физическая активность',
    description: '30 минут ходьбы в день улучшают сердечно-сосудистую систему',
    category: 'exercise',
    icon: '🚶'
  },
  {
    id: '3',
    title: 'Здоровый сон',
    description: '7-8 часов сна способствуют восстановлению организма',
    category: 'mental',
    icon: '😴'
  }
];

export interface ClinicContact {
  id: string;
  name: string;
  phone: string;
  hours: string;
  type: 'reception' | 'emergency' | 'support';
  icon: string;
}

export const clinicContacts: ClinicContact[] = [
  {
    id: '1',
    name: 'Регистратура',
    phone: '+7 (495) 123-45-67',
    hours: '08:00 - 20:00',
    type: 'reception',
    icon: '📞'
  },
  {
    id: '2',
    name: 'Скорая помощь',
    phone: '103',
    hours: 'Круглосуточно',
    type: 'emergency',
    icon: '🚑'
  },
  {
    id: '3',
    name: 'Техподдержка',
    phone: '+7 (495) 123-45-68',
    hours: '09:00 - 18:00',
    type: 'support',
    icon: '💻'
  }
];

// Вспомогательные функции для работы с данными

export const getAppointmentStatusColor = (status: Appointment['status']): string => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'cancelled':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

export const getTrendColor = (trend: HealthMetric['trend']): string => {
  switch (trend) {
    case 'up':
      return 'text-green-400';
    case 'down':
      return 'text-red-400';
    case 'stable':
      return 'text-yellow-400';
    default:
      return 'text-gray-400';
  }
};

export const getTrendIcon = (trend: HealthMetric['trend']): string => {
  switch (trend) {
    case 'up':
      return '↗️';
    case 'down':
      return '↘️';
    case 'stable':
      return '→';
    default:
      return '─';
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const getDocumentIcon = (type: Document['type']): string => {
  switch (type) {
    case 'analysis':
      return '🔬';
    case 'diagnosis':
      return '📋';
    case 'prescription':
      return '💊';
    case 'report':
      return '📄';
    default:
      return '📁';
  }
};

// Фильтры и поиск

export const filterAppointmentsByStatus = (appointments: Appointment[], status: Appointment['status']): Appointment[] => {
  return appointments.filter(appointment => appointment.status === status);
};

export const searchDocuments = (documents: Document[], query: string): Document[] => {
  return documents.filter(doc => 
    doc.title.toLowerCase().includes(query.toLowerCase()) ||
    doc.doctor.toLowerCase().includes(query.toLowerCase())
  );
};

export const getUpcomingAppointments = (appointments: Appointment[], limit?: number): Appointment[] => {
  const upcoming = appointments
    .filter(app => app.status === 'confirmed' || app.status === 'pending')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return limit ? upcoming.slice(0, limit) : upcoming;
};

export const getExpiringPrescriptions = (prescriptions: Prescription[], daysThreshold: number = 7): Prescription[] => {
  const now = new Date();
  return prescriptions.filter(prescription => {
    const refillDate = new Date(prescription.nextRefill);
    const diffTime = refillDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= daysThreshold && diffDays >= 0;
  });
};

// Статистика и аналитика

export interface DashboardStats {
  totalAppointments: number;
  upcomingAppointments: number;
  activePrescriptions: number;
  recentDocuments: number;
  healthScore: number;
}

export const getDashboardStats = (): DashboardStats => {
  return {
    totalAppointments: upcomingAppointments.length,
    upcomingAppointments: upcomingAppointments.filter(app => 
      app.status === 'confirmed' || app.status === 'pending'
    ).length,
    activePrescriptions: activePrescriptions.length,
    recentDocuments: recentDocuments.length,
    healthScore: 4.8
  };
};

export default {
  upcomingAppointments,
  healthMetrics,
  activePrescriptions,
  recentDocuments,
  quickActions,
  healthTips,
  clinicContacts,
  getAppointmentStatusColor,
  getTrendColor,
  getTrendIcon,
  formatDate,
  getDocumentIcon,
  filterAppointmentsByStatus,
  searchDocuments,
  getUpcomingAppointments,
  getExpiringPrescriptions,
  getDashboardStats
};