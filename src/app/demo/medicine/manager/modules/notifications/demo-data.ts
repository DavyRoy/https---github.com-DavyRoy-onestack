export interface Notification {
  id: string;
  type: 'appointment' | 'payment' | 'system' | 'alert' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  action?: {
    label: string;
    url: string;
  };
  metadata?: {
    patientId?: string;
    appointmentId?: string;
    invoiceId?: string;
    doctorId?: string;
  };
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  sound: boolean;
  workingHours: boolean;
  categories: {
    appointments: boolean;
    payments: boolean;
    system: boolean;
    alerts: boolean;
    reminders: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'appointment' | 'payment' | 'reminder';
  trigger: 'before_appointment' | 'after_appointment' | 'payment_due' | 'payment_overdue';
  delay: number;
  delayUnit: 'minutes' | 'hours' | 'days';
  channels: ('email' | 'sms' | 'push')[];
  subject: string;
  message: string;
  isActive: boolean;
}

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'appointment',
    title: 'Новая запись на приём',
    message: 'Пациент Смирнов Алексей записался на завтра в 14:30 к терапевту',
    timestamp: '2024-01-24T10:30:00',
    isRead: false,
    priority: 'medium',
    action: { label: 'Посмотреть запись', url: '/appointments/123' },
    metadata: { patientId: 'pat-1', appointmentId: 'app-123' }
  },
  {
    id: 'notif-2',
    type: 'payment',
    title: 'Оплата получена',
    message: 'Пациент Петрова Ольга оплатила счёт INV-2024-002 на сумму 3,200 ₽',
    timestamp: '2024-01-24T09:15:00',
    isRead: true,
    priority: 'low',
    metadata: { patientId: 'pat-2', invoiceId: 'inv-002' }
  },
  {
    id: 'notif-3',
    type: 'alert',
    title: 'Срочная консультация',
    message: 'Требуется срочная консультация кардиолога для пациента в приёмном отделении',
    timestamp: '2024-01-24T08:45:00',
    isRead: false,
    priority: 'critical',
    action: { label: 'Принять вызов', url: '/emergency/456' }
  },
  {
    id: 'notif-4',
    type: 'reminder',
    title: 'Напоминание о приёме',
    message: 'Через 15 минут начинается приём пациента Козлова Дмитрия',
    timestamp: '2024-01-24T08:30:00',
    isRead: false,
    priority: 'high',
    metadata: { patientId: 'pat-3', appointmentId: 'app-456' }
  },
  {
    id: 'notif-5',
    type: 'system',
    title: 'Обновление системы',
    message: 'Запланировано техническое обслуживание на сегодня с 23:00 до 02:00',
    timestamp: '2024-01-24T07:00:00',
    isRead: true,
    priority: 'medium'
  },
  {
    id: 'notif-6',
    type: 'appointment',
    title: 'Отмена записи',
    message: 'Пациент Новикова Ирина отменила запись на сегодня в 11:00',
    timestamp: '2024-01-23T18:20:00',
    isRead: true,
    priority: 'medium',
    metadata: { patientId: 'pat-4', appointmentId: 'app-789' }
  }
];

export const notificationSettings: NotificationSettings = {
  email: true,
  sms: false,
  push: true,
  sound: true,
  workingHours: true,
  categories: {
    appointments: true,
    payments: true,
    system: true,
    alerts: true,
    reminders: true
  },
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '08:00'
  }
};

export const notificationTemplates: NotificationTemplate[] = [
  {
    id: 'template-1',
    name: 'Напоминание о приёме',
    type: 'appointment',
    trigger: 'before_appointment',
    delay: 24,
    delayUnit: 'hours',
    channels: ['email', 'sms'],
    subject: 'Напоминание о записи к врачу',
    message: 'Уважаемый {{patient_name}}, напоминаем о записи к {{doctor_name}} {{appointment_date}} в {{appointment_time}}.',
    isActive: true
  },
  {
    id: 'template-2',
    name: 'Подтверждение оплаты',
    type: 'payment',
    trigger: 'after_appointment',
    delay: 1,
    delayUnit: 'hours',
    channels: ['email'],
    subject: 'Подтверждение оплаты',
    message: 'Оплата в размере {{amount}} за услуги клиники получена. Спасибо!',
    isActive: true
  },
  {
    id: 'template-3',
    name: 'Просроченный платёж',
    type: 'payment',
    trigger: 'payment_overdue',
    delay: 3,
    delayUnit: 'days',
    channels: ['email', 'sms'],
    subject: 'Просроченный платёж',
    message: 'Уважаемый {{patient_name}}, у вас имеется просроченный платёж по счёту {{invoice_number}}.',
    isActive: true
  },
  {
    id: 'template-4',
    name: 'Запрос отзыва',
    type: 'reminder',
    trigger: 'after_appointment',
    delay: 2,
    delayUnit: 'days',
    channels: ['email'],
    subject: 'Поделитесь впечатлениями',
    message: 'Пожалуйста, оставьте отзыв о вашем визите в нашу клинику.',
    isActive: false
  }
];

export const notificationStats = {
  total: 156,
  unread: 3,
  byType: {
    appointment: 45,
    payment: 32,
    system: 28,
    alert: 15,
    reminder: 36
  },
  byPriority: {
    critical: 8,
    high: 23,
    medium: 89,
    low: 36
  }
};