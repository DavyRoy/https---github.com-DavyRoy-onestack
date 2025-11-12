// /src/app/demo/medicine/manager/demo-data.ts

export const upcomingAppointments = [
  {
    id: '1',
    patientName: 'Иванова Мария Сергеевна',
    patientId: 'p123',
    time: '09:00',
    date: 'Сегодня',
    department: 'Терапия',
    reason: 'Ежегодный профилактический осмотр',
    isUrgent: false,
    status: 'confirmed',
    duration: 30,
    patientAge: 45,
    priority: 'routine',
    patientPhoto: '👩',
    lastVisit: '2024-01-15',
    bloodPressure: '120/80',
    temperature: '36.6',
    notes: 'Пациентка проходит плановый осмотр. Жалоб нет.'
  },
  {
    id: '2', 
    patientName: 'Петров Алексей Владимирович',
    patientId: 'p124',
    time: '09:30',
    date: 'Сегодня',
    department: 'Кардиология',
    reason: 'Боль в грудной клетке, одышка',
    isUrgent: true,
    status: 'confirmed',
    duration: 45,
    patientAge: 52,
    priority: 'high',
    patientPhoto: '👨',
    lastVisit: '2024-02-20',
    bloodPressure: '145/95',
    temperature: '37.2',
    notes: 'Срочный прием. Требуется ЭКГ и консультация кардиолога.'
  },
  {
    id: '3',
    patientName: 'Сидорова Анна Петровна',
    patientId: 'p125',
    time: '10:15',
    date: 'Сегодня', 
    department: 'Терапия',
    reason: 'Консультация по результатам анализов',
    isUrgent: false,
    status: 'confirmed',
    duration: 20,
    patientAge: 38,
    priority: 'routine',
    patientPhoto: '👩',
    lastVisit: '2024-02-25',
    bloodPressure: '118/78',
    temperature: '36.8',
    notes: 'Обсуждение результатов биохимического анализа крови.'
  },
  {
    id: '4',
    patientName: 'Козлов Дмитрий Иванович',
    patientId: 'p126',
    time: '11:00',
    date: 'Сегодня',
    department: 'Терапия',
    reason: 'ОРВИ, повышенная температура',
    isUrgent: false,
    status: 'waiting',
    duration: 15,
    patientAge: 29,
    priority: 'medium',
    patientPhoto: '👨',
    lastVisit: '2023-12-10',
    bloodPressure: '125/85',
    temperature: '38.5',
    notes: 'Острое респираторное заболевание. Требуется осмотр и назначение лечения.'
  },
  {
    id: '5',
    patientName: 'Николаева Елена Викторовна',
    patientId: 'p127',
    time: '11:30',
    date: 'Сегодня',
    department: 'Гастроэнтерология',
    reason: 'Плановый осмотр после лечения',
    isUrgent: false,
    status: 'confirmed',
    duration: 25,
    patientAge: 41,
    priority: 'routine',
    patientPhoto: '👩',
    lastVisit: '2024-02-10',
    bloodPressure: '122/82',
    temperature: '36.7',
    notes: 'Контрольный осмотр после курса терапии гастрита.'
  }
];

export const patientStats = {
  todayPatients: 12,
  waitingNow: 3,
  urgentCases: 2,
  satisfaction: 94,
  completedToday: 4,
  averageWaitTime: '8 мин',
  nextPatient: 'Иванова М.С.',
  nextAppointmentTime: '09:00'
};

export const medicalAlerts = [
  {
    id: '1',
    type: 'allergy',
    patientName: 'Петров Алексей Владимирович',
    message: 'Аллергия на пенициллин и сульфаниламиды',
    priority: 'high',
    time: '10 минут назад',
    patientId: 'p124',
    actionRequired: true,
    severity: 'critical',
    icon: '⚠️',
    color: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30'
  },
  {
    id: '2',
    type: 'lab',
    patientName: 'Иванова Мария Сергеевна',
    message: 'Критические показатели глюкозы: 12.8 ммоль/л',
    priority: 'high', 
    time: '25 минут назад',
    patientId: 'p123',
    actionRequired: true,
    severity: 'high',
    icon: '🔬',
    color: 'bg-red-500/20',
    borderColor: 'border-red-500/30'
  },
  {
    id: '3',
    type: 'medication',
    patientName: 'Смирнов Дмитрий Олегович',
    message: 'Пропущен прием метформина 2 дня подряд',
    priority: 'medium',
    time: '1 час назад',
    patientId: 'p128',
    actionRequired: false,
    severity: 'medium',
    icon: '💊',
    color: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30'
  },
  {
    id: '4',
    type: 'appointment',
    patientName: 'Козлова Ирина Михайловна',
    message: 'Перенос приема с 14:00 на 15:30',
    priority: 'low',
    time: '2 часа назад',
    patientId: 'p129',
    actionRequired: false,
    severity: 'low',
    icon: '📅',
    color: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30'
  }
];

export const recentActivities = [
  {
    id: '1',
    action: 'Завершен прием пациента',
    patient: 'Козлова Ирина Михайловна',
    patientId: 'p129',
    time: '08:45',
    icon: '✅',
    color: 'bg-green-500/20',
    details: 'Диагноз: ОРВИ. Назначено лечение.',
    type: 'appointment_completed'
  },
  {
    id: '2',
    action: 'Выписано назначение',
    patient: 'Петров Алексей Владимирович', 
    patientId: 'p124',
    time: '08:30',
    icon: '💊',
    color: 'bg-purple-500/20',
    details: 'Назначены гипотензивные препараты',
    type: 'prescription_created'
  },
  {
    id: '3',
    action: 'Обновлена медицинская карта',
    patient: 'Сидорова Анна Петровна',
    patientId: 'p125',
    time: '08:15',
    icon: '📋',
    color: 'bg-blue-500/20',
    details: 'Добавлены результаты анализов',
    type: 'record_updated'
  },
  {
    id: '4',
    action: 'Направление на консультацию',
    patient: 'Иванова Мария Сергеевна',
    patientId: 'p123',
    time: '08:00',
    icon: '👨‍⚕️',
    color: 'bg-orange-500/20',
    details: 'Направление к эндокринологу',
    type: 'referral_created'
  },
  {
    id: '5',
    action: 'Запись на повторный прием',
    patient: 'Николаев Дмитрий Сергеевич',
    patientId: 'p130',
    time: '07:45',
    icon: '📅',
    color: 'bg-cyan-500/20',
    details: 'Повторный прием через 2 недели',
    type: 'appointment_scheduled'
  }
];

export const quickActions = [
  {
    id: 'schedule',
    label: 'Расписание',
    description: 'Управление приемами и расписанием',
    icon: '📅',
    href: '/demo/medicine/manager/modules/schedule',
    badge: '5',
    color: 'from-blue-500/20 to-blue-600/20'
  },
  {
    id: 'patients',
    label: 'Пациенты',
    description: 'База пациентов и истории болезней',
    icon: '👥', 
    href: '/demo/medicine/manager/modules/patients',
    badge: '12',
    color: 'from-green-500/20 to-emerald-600/20'
  },
  {
    id: 'prescriptions',
    label: 'Назначения',
    description: 'Рецепты и планы лечения',
    icon: '💊',
    href: '/demo/medicine/manager/modules/prescriptions',
    badge: '8',
    color: 'from-purple-500/20 to-purple-600/20'
  },
  {
    id: 'telemed',
    label: 'Телемедицина',
    description: 'Онлайн консультации и видеоприемы',
    icon: '📱',
    href: '/demo/medicine/manager/modules/telemedicine',
    badge: '3',
    color: 'from-orange-500/20 to-orange-600/20'
  },
  {
    id: 'lab',
    label: 'Анализы',
    description: 'Лабораторные данные и результаты',
    icon: '🔬',
    href: '/demo/medicine/manager/modules/lab-results',
    badge: '7',
    color: 'from-red-500/20 to-pink-600/20'
  },
  {
    id: 'records',
    label: 'Медкарты',
    description: 'Электронные медицинские карты',
    icon: '📋',
    href: '/demo/medicine/manager/modules/medical-cards',
    badge: null,
    color: 'from-cyan-500/20 to-cyan-600/20'
  }
];

export const departmentStats = [
  {
    id: 'beds',
    label: 'Свободные койки',
    value: '4/12',
    change: '+1',
    trend: 'up',
    icon: '🛏️',
    color: 'bg-blue-500/20',
    description: 'Терапевтическое отделение',
    progress: 33,
    status: 'normal'
  },
  {
    id: 'doctors',
    label: 'Врачи на смене', 
    value: '8/10',
    change: '-2',
    trend: 'down',
    icon: '👨‍⚕️',
    color: 'bg-green-500/20',
    description: 'Из 10 запланированных',
    progress: 80,
    status: 'warning'
  },
  {
    id: 'equipment',
    label: 'Оборудование',
    value: '95%',
    change: '±0',
    trend: 'stable',
    icon: '⚡',
    color: 'bg-orange-500/20', 
    description: 'Рабочее состояние',
    progress: 95,
    status: 'excellent'
  },
  {
    id: 'waiting',
    label: 'Среднее время ожидания',
    value: '12 мин',
    change: '-3',
    trend: 'up',
    icon: '⏱️',
    color: 'bg-purple-500/20',
    description: 'Улучшение на 20%',
    progress: 65,
    status: 'good'
  }
];

export const emergencyContacts = [
  {
    id: '1',
    name: 'Реанимация',
    role: 'Круглосуточно',
    phone: '+7-495-123-45-67',
    icon: '🚑',
    type: 'critical',
    extension: '101',
    available: true
  },
  {
    id: '2',
    name: 'Дежурный администратор',
    role: 'Этаж 2, каб. 201',
    phone: '+7-495-123-45-68', 
    icon: '👨‍💼',
    type: 'admin',
    extension: '102',
    available: true
  },
  {
    id: '3',
    name: 'Старшая медсестра',
    role: 'Пост №3, 3 этаж',
    phone: '+7-495-123-45-69',
    icon: '👩‍⚕️',
    type: 'nursing',
    extension: '103',
    available: true
  },
  {
    id: '4',
    name: 'Лаборатория',
    role: 'Срочные анализы',
    phone: '+7-495-123-45-70',
    icon: '🔬',
    type: 'lab',
    extension: '104',
    available: false
  },
  {
    id: '5',
    name: 'Регистратура',
    role: 'Запись пациентов',
    phone: '+7-495-123-45-71',
    icon: '📞',
    type: 'registration',
    extension: '105',
    available: true
  }
];

export const healthMetrics = [
  {
    id: 'blood-pressure',
    label: 'Давление',
    value: '120/80',
    unit: 'мм рт.ст.',
    status: 'normal',
    trend: 'stable',
    icon: '❤️',
    color: 'bg-red-500/20',
    lastUpdate: '2 часа назад'
  },
  {
    id: 'heart-rate',
    label: 'Пульс',
    value: '72',
    unit: 'уд/мин',
    status: 'normal',
    trend: 'down',
    icon: '💓',
    color: 'bg-green-500/20',
    lastUpdate: '1 час назад'
  },
  {
    id: 'temperature',
    label: 'Температура',
    value: '36.6',
    unit: '°C',
    status: 'normal',
    trend: 'stable',
    icon: '🌡️',
    color: 'bg-orange-500/20',
    lastUpdate: '30 минут назад'
  },
  {
    id: 'oxygen',
    label: 'Сатурация',
    value: '98',
    unit: '%',
    status: 'excellent',
    trend: 'up',
    icon: '💨',
    color: 'bg-blue-500/20',
    lastUpdate: '15 минут назад'
  }
];

export const medicalResources = [
  {
    id: 'protocols',
    title: 'Медицинские протоколы',
    description: 'Актуальные клинические руководства',
    icon: '📚',
    category: 'documentation',
    lastUpdate: '2024-03-01',
    itemsCount: 24
  },
  {
    id: 'medications',
    title: 'Справочник препаратов',
    description: 'База лекарственных средств',
    icon: '💊',
    category: 'reference',
    lastUpdate: '2024-03-15',
    itemsCount: 156
  },
  {
    id: 'lab-standards',
    title: 'Лабораторные нормы',
    description: 'Референсные значения анализов',
    icon: '🔬',
    category: 'reference',
    lastUpdate: '2024-02-28',
    itemsCount: 89
  },
  {
    id: 'clinical-cases',
    title: 'Клинические случаи',
    description: 'Архив интересных случаев',
    icon: '🏥',
    category: 'education',
    lastUpdate: '2024-03-10',
    itemsCount: 42
  }
];

export const todaySchedule = {
  morning: [
    { time: '08:00', patient: 'Козлова И.М.', type: 'прием', status: 'completed' },
    { time: '08:30', patient: 'Петров А.В.', type: 'консультация', status: 'completed' },
    { time: '09:00', patient: 'Иванова М.С.', type: 'осмотр', status: 'in-progress' },
    { time: '09:30', patient: 'Петров А.В.', type: 'срочный', status: 'upcoming' }
  ],
  afternoon: [
    { time: '10:15', patient: 'Сидорова А.П.', type: 'консультация', status: 'upcoming' },
    { time: '11:00', patient: 'Козлов Д.И.', type: 'прием', status: 'upcoming' },
    { time: '11:30', patient: 'Николаева Е.В.', type: 'осмотр', status: 'upcoming' },
    { time: '12:00', patient: 'Обход палат', type: 'обход', status: 'upcoming' }
  ]
};

// Типы для TypeScript
export type Appointment = typeof upcomingAppointments[0];
export type MedicalAlert = typeof medicalAlerts[0];
export type QuickAction = typeof quickActions[0];
export type DepartmentStat = typeof departmentStats[0];
export type EmergencyContact = typeof emergencyContacts[0];
export type HealthMetric = typeof healthMetrics[0];
export type MedicalResource = typeof medicalResources[0];
export type RecentActivity = typeof recentActivities[0];