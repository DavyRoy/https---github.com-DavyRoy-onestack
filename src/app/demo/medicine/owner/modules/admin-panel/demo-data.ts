export interface SystemMetrics {
  uptime: number;
  responseTime: number;
  activeUsers: number;
  serverLoad: number;
  databaseSize: number;
  lastBackup: string;
}

export interface SecurityAlert {
  id: string;
  type: 'login' | 'access' | 'data' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

export interface PerformanceMetric {
  time: string;
  appointments: number;
  revenue: number;
  patients: number;
  load: number;
}

export interface BackupStatus {
  id: string;
  type: 'full' | 'incremental';
  status: 'success' | 'failed' | 'running';
  size: number;
  duration: number;
  timestamp: string;
}

export interface UserActivity {
  id: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  timestamp: string;
  ip: string;
}

export const systemMetrics: SystemMetrics = {
  uptime: 99.8,
  responseTime: 124,
  activeUsers: 47,
  serverLoad: 68,
  databaseSize: 2.4,
  lastBackup: '2024-01-24T02:00:00'
};

export const securityAlerts: SecurityAlert[] = [
  {
    id: 'alert-1',
    type: 'login',
    severity: 'medium',
    title: 'Неудачные попытки входа',
    description: 'Обнаружено 5 неудачных попыток входа для пользователя admin',
    timestamp: '2024-01-24T14:25:00',
    resolved: false
  },
  {
    id: 'alert-2',
    type: 'access',
    severity: 'low',
    title: 'Доступ вне рабочего времени',
    description: 'Пользователь manager вошел в систему в 23:45',
    timestamp: '2024-01-23T23:45:00',
    resolved: true
  },
  {
    id: 'alert-3',
    type: 'data',
    severity: 'high',
    title: 'Массовая выгрузка данных',
    description: 'Пользователь doctor экспортировал 150 записей пациентов',
    timestamp: '2024-01-23T16:30:00',
    resolved: false
  },
  {
    id: 'alert-4',
    type: 'system',
    severity: 'critical',
    title: 'Высокая нагрузка на сервер',
    description: 'Нагрузка на сервер превысила 90% в течение 15 минут',
    timestamp: '2024-01-23T14:00:00',
    resolved: true
  }
];

export const performanceData: PerformanceMetric[] = [
  { time: '08:00', appointments: 12, revenue: 45000, patients: 8, load: 45 },
  { time: '09:00', appointments: 28, revenue: 98000, patients: 22, load: 68 },
  { time: '10:00', appointments: 42, revenue: 156000, patients: 35, load: 82 },
  { time: '11:00', appointments: 38, revenue: 142000, patients: 31, load: 76 },
  { time: '12:00', appointments: 25, revenue: 89000, patients: 20, load: 58 },
  { time: '13:00', appointments: 18, revenue: 67000, patients: 15, load: 42 },
  { time: '14:00', appointments: 32, revenue: 118000, patients: 26, load: 71 },
  { time: '15:00', appointments: 45, revenue: 168000, patients: 38, load: 88 },
  { time: '16:00', appointments: 36, revenue: 134000, patients: 29, load: 74 },
  { time: '17:00', appointments: 22, revenue: 82000, patients: 18, load: 51 }
];

export const backupStatus: BackupStatus[] = [
  {
    id: 'backup-1',
    type: 'full',
    status: 'success',
    size: 2.1,
    duration: 1245,
    timestamp: '2024-01-24T02:00:00'
  },
  {
    id: 'backup-2',
    type: 'incremental',
    status: 'success',
    size: 0.3,
    duration: 234,
    timestamp: '2024-01-24T12:00:00'
  },
  {
    id: 'backup-3',
    type: 'full',
    status: 'failed',
    size: 0,
    duration: 0,
    timestamp: '2024-01-23T02:00:00'
  },
  {
    id: 'backup-4',
    type: 'incremental',
    status: 'success',
    size: 0.2,
    duration: 189,
    timestamp: '2024-01-23T12:00:00'
  }
];

export const userActivities: UserActivity[] = [
  {
    id: 'activity-1',
    user: 'Иванов А.С.',
    role: 'doctor',
    action: 'просмотр',
    resource: 'история болезни',
    timestamp: '2024-01-24T14:35:00',
    ip: '192.168.1.45'
  },
  {
    id: 'activity-2',
    user: 'Петрова М.И.',
    role: 'doctor',
    action: 'изменение',
    resource: 'назначения',
    timestamp: '2024-01-24T14:30:00',
    ip: '192.168.1.67'
  },
  {
    id: 'activity-3',
    user: 'Администратор',
    role: 'admin',
    action: 'создание',
    resource: 'отчёт',
    timestamp: '2024-01-24T14:25:00',
    ip: '192.168.1.10'
  },
  {
    id: 'activity-4',
    user: 'Смирнов А.В.',
    role: 'patient',
    action: 'запись',
    resource: 'приём',
    timestamp: '2024-01-24T14:20:00',
    ip: '85.234.123.45'
  },
  {
    id: 'activity-5',
    user: 'Козлова Е.В.',
    role: 'doctor',
    action: 'просмотр',
    resource: 'результаты анализов',
    timestamp: '2024-01-24T14:15:00',
    ip: '192.168.1.89'
  }
];

export const systemConfig = {
  clinicName: 'Медицинский центр "Здоровье+"',
  timezone: 'Europe/Moscow',
  language: 'ru',
  dateFormat: 'DD.MM.YYYY',
  autoBackup: true,
  backupTime: '02:00',
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  passwordPolicy: 'strong'
};