'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Типы данных для профиля Администратора
interface Organization {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'manager';
  status: 'active' | 'pending' | 'suspended';
  users: number;
  departments: number;
  createdAt: string;
  plan: 'enterprise' | 'business' | 'professional';
  revenue?: number;
  growth: number;
  icon: string;
  color: string;
  description: string;
  location: string;
  employees: number;
  projects: number;
  satisfaction: number;
  nextPayment?: string;
  storage: {
    used: number;
    total: number;
  };
}

interface AdminMetric {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  description: string;
  icon: string;
  color: string;
  progress?: number;
  target?: number;
  unit?: string;
  link?: string;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'access' | 'settings' | 'security' | 'suspicious' | 'backup' | 'payment';
  title: string;
  description: string;
  time: string;
  location: string;
  device: string;
  status: 'success' | 'warning' | 'error';
  ip?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

interface SystemAccess {
  module: string;
  accessLevel: 'full' | 'limited' | 'readonly' | 'none';
  lastAccess: string;
  usage: number;
  icon: string;
  color: string;
  description: string;
  permissions: string[];
  lastActivity: string;
}

interface NotificationPreference {
  type: string;
  email: boolean;
  push: boolean;
  sms: boolean;
  description: string;
  category: string;
  critical: boolean;
}

interface RecentActivity {
  id: string;
  type: 'user' | 'finance' | 'system' | 'security' | 'organization';
  title: string;
  description: string;
  time: string;
  user?: string;
  amount?: number;
  status: 'completed' | 'pending' | 'failed';
  icon: string;
}

interface FinancialMetric {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  growth: number;
  users: number;
  organizations: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  department: string;
  lastActive: string;
  tasks: number;
}

interface QuickAction {
  label: string;
  icon: string;
  href: string;
  description: string;
  color: string;
}

// Константы для цветов
const COLORS = {
  primary: 'from-gray-900 via-black to-gray-800',
  secondary: 'from-purple-900/50 via-blue-900/50 to-cyan-900/50',
  success: '34, 197, 94',
  warning: '234, 179, 8',
  error: '239, 68, 68',
  info: '59, 130, 246',
  purple: '147, 51, 234',
  orange: '249, 115, 22',
  blue: '59, 130, 246',
  cyan: '34, 211, 238',
  emerald: '16, 185, 129',
  rose: '244, 63, 94',
  indigo: '99, 102, 241',
  teal: '20, 184, 166',
  amber: '245, 158, 11',
  violet: '139, 92, 246'
} as const;

// Утилиты форматирования
const formatNumber = (value: number) => new Intl.NumberFormat('ru-RU').format(value);
const formatCurrency = (value: number) => new Intl.NumberFormat('ru-RU', { 
  style: 'currency', 
  currency: 'RUB',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}).format(value);

const formatCompactNumber = (value: number) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Расширенные демо-данные для Администратора (Владельца организации)
const adminProfile = {
  name: 'Сидоров Иван Петрович',
  role: 'Владелец организации',
  email: 'owner@social-service.ru',
  phone: '+7 (912) 345-67-89',
  department: 'Управление',
  location: 'Москва, Россия',
  avatar: '👑',
  joinDate: '15 марта 2022',
  status: 'active',
  bio: 'Основатель и владелец сети социальных сервисов. Отвечаю за стратегическое развитие и управление организациями. Более 10 лет опыта в управлении социальными проектами.',
  timezone: 'Europe/Moscow (UTC+3)',
  workingHours: '09:00 - 18:00',
  theme: 'dark',
  languages: ['Русский', 'Английский', 'Немецкий'],
  specialties: ['Управление проектами', 'Финансовый анализ', 'Развитие бизнеса', 'Командообразование'],
  education: 'МГУ им. Ломоносова, Факультет управления',
  experience: '12 лет',
  lastLogin: '2024-02-15T14:30:00Z',
  loginCount: 1274
};

const organizations: Organization[] = [
  {
    id: '1',
    name: 'Центр социальной помощи "Забота"',
    role: 'owner',
    status: 'active',
    users: 154,
    departments: 12,
    createdAt: '2022-03-15',
    plan: 'enterprise',
    revenue: 25400000,
    growth: 12.5,
    icon: '🏢',
    color: COLORS.blue,
    description: 'Крупнейший центр социальной помощи в регионе, предоставляющий полный спектр услуг для пожилых людей и людей с ограниченными возможностями. Более 50 программ поддержки.',
    location: 'Москва',
    employees: 45,
    projects: 8,
    satisfaction: 94,
    nextPayment: '2024-03-15',
    storage: { used: 245, total: 500 }
  },
  {
    id: '2',
    name: 'Служба психологической поддержки "Равновесие"',
    role: 'owner',
    status: 'active',
    users: 87,
    departments: 8,
    createdAt: '2022-08-22',
    plan: 'business',
    revenue: 18700000,
    growth: 8.3,
    icon: '🧠',
    color: COLORS.purple,
    description: 'Профессиональная психологическая помощь для детей и взрослых. Кризисное консультирование, групповая терапия, программы реабилитации.',
    location: 'Санкт-Петербург',
    employees: 28,
    projects: 6,
    satisfaction: 96,
    nextPayment: '2024-03-22',
    storage: { used: 187, total: 250 }
  },
  {
    id: '3',
    name: 'Реабилитационный центр "Новая жизнь"',
    role: 'owner',
    status: 'active',
    users: 203,
    departments: 15,
    createdAt: '2023-01-10',
    plan: 'enterprise',
    revenue: 42100000,
    growth: 15.7,
    icon: '❤️',
    color: COLORS.emerald,
    description: 'Современный реабилитационный центр с передовым оборудованием. Специализируется на физической и психологической реабилитации после травм и операций.',
    location: 'Москва',
    employees: 67,
    projects: 12,
    satisfaction: 92,
    nextPayment: '2024-03-10',
    storage: { used: 389, total: 500 }
  },
  {
    id: '4',
    name: 'Образовательный проект "Знание будущего"',
    role: 'owner',
    status: 'pending',
    users: 45,
    departments: 5,
    createdAt: '2024-02-01',
    plan: 'professional',
    revenue: 8900000,
    growth: 5.2,
    icon: '🎓',
    color: COLORS.orange,
    description: 'Инновационная образовательная платформа для детей и подростков. STEM-образование, программирование, робототехника и цифровая грамотность.',
    location: 'Казань',
    employees: 15,
    projects: 3,
    satisfaction: 88,
    nextPayment: '2024-04-01',
    storage: { used: 78, total: 100 }
  },
  {
    id: '5',
    name: 'Медицинский центр "Здоровье нации"',
    role: 'owner',
    status: 'active',
    users: 312,
    departments: 18,
    createdAt: '2023-06-15',
    plan: 'enterprise',
    revenue: 68300000,
    growth: 18.2,
    icon: '🏥',
    color: COLORS.rose,
    description: 'Многопрофильный медицинский центр с современным диагностическим оборудованием. Терапия, кардиология, неврология, педиатрия.',
    location: 'Новосибирск',
    employees: 89,
    projects: 14,
    satisfaction: 95,
    nextPayment: '2024-03-25',
    storage: { used: 412, total: 500 }
  },
  {
    id: '6',
    name: 'Спортивный комплекс "Энергия"',
    role: 'owner',
    status: 'active',
    users: 178,
    departments: 9,
    createdAt: '2023-09-01',
    plan: 'business',
    revenue: 23400000,
    growth: 11.3,
    icon: '⚽',
    color: COLORS.amber,
    description: 'Современный спортивный комплекс с бассейном, тренажерными залами и групповыми занятиями. Программы для всех возрастных групп.',
    location: 'Екатеринбург',
    employees: 42,
    projects: 7,
    satisfaction: 91,
    nextPayment: '2024-03-18',
    storage: { used: 156, total: 250 }
  }
];

const adminMetrics: AdminMetric[] = [
  { 
    label: "Организации", 
    value: 6, 
    change: 2, 
    trend: 'up', 
    description: "Активные организации в управлении", 
    icon: "🏢", 
    color: COLORS.blue,
    target: 8,
    unit: ''
  },
  { 
    label: "Пользователи", 
    value: 879, 
    change: 42, 
    trend: 'up', 
    description: "Всего активных пользователей в системе", 
    icon: "👥", 
    color: COLORS.purple,
    target: 1200,
    unit: ''
  },
  { 
    label: "Выручка", 
    value: "186.3M", 
    change: 15.2, 
    trend: 'up', 
    description: "Общая выручка за текущий месяц", 
    icon: "💰", 
    color: COLORS.emerald,
    target: 200,
    unit: ''
  },
  { 
    label: "Рост", 
    value: 13.8, 
    change: 2.3, 
    trend: 'up', 
    description: "Средний рост по всем организациям", 
    icon: "📈", 
    color: COLORS.orange,
    progress: 92,
    target: 15,
    unit: '%'
  },
  { 
    label: "Отделы", 
    value: 67, 
    change: 8, 
    trend: 'up', 
    description: "Всего отделов в организациях", 
    icon: "🏛️", 
    color: COLORS.cyan,
    target: 80,
    unit: ''
  },
  { 
    label: "Эффективность", 
    value: 94, 
    change: 3, 
    trend: 'up', 
    description: "Общая эффективность работы системы", 
    icon: "🎯", 
    color: COLORS.violet,
    progress: 94,
    target: 95,
    unit: '%'
  },
];

const securityEvents: SecurityEvent[] = [
  { 
    id: '1', 
    type: 'access', 
    title: 'Доступ к финансовым отчетам', 
    description: 'Просмотр и экспорт квартальных финансовых отчетов',
    time: '2 мин. назад', 
    location: 'Москва, Россия',
    device: 'Chrome, Windows 11',
    status: 'success',
    ip: '192.168.1.100',
    severity: 'low'
  },
  { 
    id: '2', 
    type: 'settings', 
    title: 'Изменение системных настроек', 
    description: 'Обновлены параметры безопасности и доступа для всех организаций',
    time: '5 ч. назад', 
    location: 'Москва, Россия',
    device: 'Safari, macOS Ventura',
    status: 'warning',
    ip: '192.168.1.150',
    severity: 'medium'
  },
  { 
    id: '3', 
    type: 'payment', 
    title: 'Обработана автоматическая оплата', 
    description: 'Успешная оплата услуг хостинга и дополнительных модулей',
    time: '8 ч. назад', 
    location: 'Москва, Россия',
    device: 'Платежная система',
    status: 'success',
    severity: 'low'
  },
  { 
    id: '4', 
    type: 'security', 
    title: 'Обновление политики безопасности', 
    description: 'Применены новые правила парольной политики для всех пользователей',
    time: '1 д. назад', 
    location: 'Москва, Россия',
    device: 'Система безопасности',
    status: 'success',
    severity: 'medium'
  },
  { 
    id: '5', 
    type: 'backup', 
    title: 'Создание резервной копии', 
    description: 'Автоматическое создание полной резервной копии данных системы',
    time: '1 д. назад', 
    location: 'Москва, Россия',
    device: 'Система резервного копирования',
    status: 'success',
    severity: 'low'
  }
];

const systemAccess: SystemAccess[] = [
  { 
    module: 'Управление организациями', 
    accessLevel: 'full', 
    lastAccess: '2 мин. назад', 
    usage: 95,
    icon: '🏢',
    color: COLORS.blue,
    description: 'Полный контроль над всеми организациями: создание, редактирование, удаление, настройка параметров и мониторинг активности',
    permissions: ['создание организаций', 'редактирование параметров', 'удаление организаций', 'настройка доступа', 'мониторинг активности'],
    lastActivity: 'Добавлена новая организация "Спортивный комплекс"'
  },
  { 
    module: 'Финансовый контроль', 
    accessLevel: 'full', 
    lastAccess: '15 мин. назад', 
    usage: 87,
    icon: '💰',
    color: COLORS.emerald,
    description: 'Управление финансами и финансовой отчетностью: просмотр транзакций, анализ доходов/расходов, экспорт отчетов',
    permissions: ['просмотр транзакций', 'финансовый анализ', 'экспорт отчетов', 'утверждение платежей', 'бюджетирование'],
    lastActivity: 'Сформирован финансовый отчет за февраль 2024'
  },
  { 
    module: 'Управление персоналом', 
    accessLevel: 'full', 
    lastAccess: '1 ч. назад', 
    usage: 76,
    icon: '👥',
    color: COLORS.purple,
    description: 'Полное управление сотрудниками организаций: найм, назначение ролей, управление доступом, блокировка учетных записей',
    permissions: ['найм сотрудников', 'назначение ролей', 'управление доступом', 'блокировка учетных записей', 'аналитика персонала'],
    lastActivity: 'Назначен новый менеджер в отдел маркетинга'
  },
  { 
    module: 'Система аналитики', 
    accessLevel: 'full', 
    lastAccess: '30 мин. назад', 
    usage: 68,
    icon: '📊',
    color: COLORS.orange,
    description: 'Доступ к расширенной аналитике и отчетности: метрики эффективности, пользовательская активность, бизнес-показатели',
    permissions: ['просмотр аналитики', 'создание отчетов', 'настройка дашбордов', 'экспорт данных', 'анализ трендов'],
    lastActivity: 'Создан новый дашборд эффективности'
  }
];

const notificationPreferences: NotificationPreference[] = [
  { 
    type: 'Финансовые операции', 
    email: true, 
    push: true, 
    sms: false,
    description: 'Уведомления о критических финансовых операциях, крупных платежах и изменениях в бюджете',
    category: 'finance',
    critical: true
  },
  { 
    type: 'События безопасности', 
    email: true, 
    push: true, 
    sms: true,
    description: 'Оповещения о событиях безопасности: подозрительные входы, изменения настроек доступа, системные предупреждения',
    category: 'security',
    critical: true
  },
  { 
    type: 'Управление персоналом', 
    email: true, 
    push: true, 
    sms: false,
    description: 'Уведомления о изменениях в команде: новые сотрудники, изменения ролей, запросы на отпуска',
    category: 'hr',
    critical: false
  },
  { 
    type: 'Системные уведомления', 
    email: true, 
    push: false, 
    sms: false,
    description: 'Технические уведомления: обновления системы, техническое обслуживание, резервное копирование',
    category: 'system',
    critical: false
  },
  { 
    type: 'Аналитические отчеты', 
    email: true, 
    push: false, 
    sms: false,
    description: 'Еженедельные и ежемесячные аналитические отчеты по эффективности организаций',
    category: 'analytics',
    critical: false
  }
];

const recentActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'finance',
    title: 'Ежемесячный платеж обработан',
    description: 'Центр "Забота" - 254,000 руб. за услуги хостинга и поддержки',
    time: '10 мин. назад',
    amount: 254000,
    status: 'completed',
    icon: '💰'
  },
  {
    id: '2',
    type: 'user',
    title: 'Новый менеджер добавлен',
    description: 'Петрова А.С. назначена менеджером по развитию в Центр "Забота"',
    time: '1 ч. назад',
    user: 'Петрова Анна Сергеевна',
    status: 'completed',
    icon: '👤'
  },
  {
    id: '3',
    type: 'system',
    title: 'Системное обновление',
    description: 'Установлены критические обновления безопасности версии 2.4.1',
    time: '2 ч. назад',
    status: 'completed',
    icon: '🔄'
  },
  {
    id: '4',
    type: 'organization',
    title: 'Новая организация',
    description: 'Зарегистрирован новый спортивный комплекс "Энергия" в Екатеринбурге',
    time: '5 ч. назад',
    status: 'completed',
    icon: '🏢'
  },
  {
    id: '5',
    type: 'security',
    title: 'Обновление политики доступа',
    description: 'Применены новые правила двухфакторной аутентификации для администраторов',
    time: '1 д. назад',
    status: 'completed',
    icon: '🛡️'
  }
];

const financialMetrics: FinancialMetric[] = [
  { period: 'Янв 2024', revenue: 98.2, expenses: 45.6, profit: 52.6, growth: 8.2, users: 512, organizations: 4 },
  { period: 'Фев 2024', revenue: 105.7, expenses: 48.3, profit: 57.4, growth: 9.5, users: 589, organizations: 5 },
  { period: 'Мар 2024', revenue: 118.3, expenses: 52.1, profit: 66.2, growth: 12.8, users: 668, organizations: 6 },
  { period: 'Апр 2024', revenue: 132.8, expenses: 56.4, profit: 76.4, growth: 14.2, users: 754, organizations: 6 },
  { period: 'Май 2024', revenue: 148.9, expenses: 61.2, profit: 87.7, growth: 15.8, users: 812, organizations: 6 },
  { period: 'Июн 2024', revenue: 167.2, expenses: 66.8, profit: 100.4, growth: 17.3, users: 879, organizations: 6 },
];

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Петрова Анна Сергеевна',
    role: 'Генеральный директор',
    email: 'a.petrova@social-service.ru',
    avatar: '👩‍💼',
    status: 'online',
    department: 'Управление',
    lastActive: '2 мин. назад',
    tasks: 12
  },
  {
    id: '2',
    name: 'Иванов Михаил Петрович',
    role: 'Финансовый директор',
    email: 'm.ivanov@social-service.ru',
    avatar: '👨‍💼',
    status: 'busy',
    department: 'Финансы',
    lastActive: '15 мин. назад',
    tasks: 8
  },
  {
    id: '3',
    name: 'Сидорова Елена Владимировна',
    role: 'HR директор',
    email: 'e.sidorova@social-service.ru',
    avatar: '👩‍💻',
    status: 'online',
    department: 'Персонал',
    lastActive: '5 мин. назад',
    tasks: 15
  },
  {
    id: '4',
    name: 'Козлов Дмитрий Александрович',
    role: 'Технический директор',
    email: 'd.kozlov@social-service.ru',
    avatar: '👨‍🔧',
    status: 'online',
    department: 'IT',
    lastActive: '10 мин. назад',
    tasks: 6
  },
  {
    id: '5',
    name: 'Николаева Ольга Игоревна',
    role: 'Директор по развитию',
    email: 'o.nikolaeva@social-service.ru',
    avatar: '👩‍🎓',
    status: 'offline',
    department: 'Развитие бизнеса',
    lastActive: '2 ч. назад',
    tasks: 9
  }
];

const quickActions: QuickAction[] = [
  { label: 'Новая организация', icon: '🏢', href: '/demo/social/owner/modules/organizations/new', description: 'Добавить новую организацию в систему', color: COLORS.blue },
  { label: 'Финансовые отчеты', icon: '💰', href: '/demo/social/owner/modules/finance', description: 'Просмотр и анализ финансовых показателей', color: COLORS.emerald },
  { label: 'Управление командой', icon: '👥', href: '/demo/social/owner/modules/team', description: 'Управление сотрудниками и ролями', color: COLORS.purple },
  { label: 'Бизнес-аналитика', icon: '📊', href: '/demo/social/owner/modules/analytics', description: 'Детальная аналитика и метрики', color: COLORS.orange },
  { label: 'Системные настройки', icon: '⚙️', href: '/demo/social/owner/modules/settings', description: 'Настройки системы и параметров', color: COLORS.cyan },
  { label: 'Безопасность', icon: '🛡️', href: '/demo/social/owner/modules/security', description: 'Управление безопасностью и доступом', color: COLORS.error },
  { label: 'Уведомления', icon: '🔔', href: '/demo/social/owner/modules/notifications', description: 'Настройка оповещений и уведомлений', color: COLORS.amber },
  { label: 'Помощь и поддержка', icon: '❓', href: '/demo/social/owner/modules/help', description: 'Документация и техническая поддержка', color: COLORS.violet }
];

// Анимации
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: "easeOut" }
};

// Адаптивный Bento Card компонент
const BentoCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  enableEffects?: boolean;
  glowColor?: string;
  onClick?: () => void;
  colSpan?: number;
  rowSpan?: number;
}> = ({ 
  children, 
  className = '', 
  enableEffects = true, 
  glowColor = COLORS.purple, 
  onClick, 
  colSpan = 1, 
  rowSpan = 1 
}) => {
  const colSpanClass = {
    1: '',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
  }[colSpan];

  const rowSpanClass = {
    1: '',
    2: 'md:row-span-2',
  }[rowSpan];

  return (
    <motion.div
      className={`
        relative overflow-hidden 
        rounded-2xl border border-white/10 
        bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl
        transition-all duration-500 
        hover:border-white/20 hover:bg-white/15
        w-full h-full min-h-[200px]
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${colSpanClass}
        ${rowSpanClass}
        ${className}
      `}
      style={{
        '--glow-color': glowColor,
      } as React.CSSProperties}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {enableEffects && (
        <>
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(600px circle at 50% 50%, 
                           rgba(var(--glow-color), 0.15) 0%, 
                           rgba(var(--glow-color), 0.08) 30%, 
                           transparent 70%)`,
            }}
          />
        </>
      )}
      
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
        <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 group-hover:animate-shine" />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
};

// Компонент прогресс-бара
const ProgressBar: React.FC<{ 
  value: number; 
  color?: string; 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ 
  value, 
  color = COLORS.blue,
  size = 'md',
  className = ''
}) => {
  const height = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }[size];
  
  return (
    <div className={`w-full bg-white/10 rounded-full overflow-hidden ${className}`}>
      <motion.div 
        className={`${height} rounded-full transition-all duration-1000 ease-out`}
        style={{ 
          backgroundColor: `rgb(${color})`,
          boxShadow: `0 0 8px rgba(${color}, 0.3)`
        }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
};

// Модальные окна
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            className={`bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/20 ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10">
              <h2 className="text-lg md:text-xl font-bold text-white truncate">{title}</h2>
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 md:p-6 overflow-y-auto max-h-[70vh]">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Заглушки для переходов
const useNavigationStub = () => {
  return useCallback((path: string) => {
    alert(`Переход на ${path} временно недоступен. Это демо-версия интерфейса.`);
  }, []);
};

// Компонент метрики
const MetricCard: React.FC<{ metric: AdminMetric; onClick?: () => void }> = ({ metric, onClick }) => {
  const progress = metric.target ? Math.min((Number(typeof metric.value === 'string' ? parseFloat(metric.value) : metric.value) / metric.target) * 100, 100) : metric.progress;

  return (
    <BentoCard 
      className="group"
      enableEffects={true}
      glowColor={metric.color}
      onClick={onClick}
    >
      <div className="p-3 md:p-4 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between mb-2 md:mb-3">
          <div className="flex flex-col">
            <div className="text-lg md:text-xl lg:text-2xl font-bold text-white leading-tight">
              {metric.value}
              {metric.unit && <span className="text-white/60 text-sm md:text-base ml-0.5">{metric.unit}</span>}
            </div>
            <span className="text-white/80 text-xs md:text-sm font-medium mt-1 line-clamp-1">
              {metric.label}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-lg md:text-xl opacity-80 group-hover:scale-110 transition-transform duration-200">
              {metric.icon}
            </div>
            {metric.change && (
              <motion.div 
                className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full border backdrop-blur-sm`}
                style={{ 
                  backgroundColor: `rgba(${metric.color}, 0.15)`,
                  color: `rgb(${metric.color})`,
                  borderColor: `rgba(${metric.color}, 0.2)`
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                {Math.abs(metric.change)}%
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="space-y-1 md:space-y-2">
          <div className="text-white/60 text-xs leading-tight line-clamp-2">
            {metric.description}
          </div>

          {progress !== undefined && (
            <div className="pt-1 md:pt-2">
              <div className="flex justify-between text-xs text-white/60 mb-1">
                <span>Прогресс</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <ProgressBar value={progress} color={metric.color} size="sm" />
              {metric.target && (
                <div className="text-white/40 text-xs mt-1">
                  Цель: {metric.target}{metric.unit}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </BentoCard>
  );
};

// Компонент заголовка профиля
const ProfileHeader: React.FC = () => {
  const navigateStub = useNavigationStub();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <BentoCard className="p-4 md:p-6" glowColor={COLORS.purple} enableEffects={true} colSpan={2}>
      <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
        <div className="flex-shrink-0 flex justify-center sm:justify-start">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-white text-2xl backdrop-blur-sm">
              {adminProfile.avatar}
            </div>
            <motion.div 
              className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 rounded-full bg-green-500 border-2 border-black flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </motion.div>
          </motion.div>
        </div>

        <div className="flex-grow space-y-3 md:space-y-4 text-center sm:text-left">
          <div>
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 line-clamp-1">
              {adminProfile.name}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <p className="text-white/60 text-sm md:text-base line-clamp-1">{adminProfile.role}</p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs border border-green-500/30">
                  Активен
                </span>
                <span className="text-white/40 text-xs">
                  {isMounted && currentTime ? currentTime.toLocaleTimeString('ru-RU') : '—:—:—'}
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-white/70 text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
            {adminProfile.bio}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
            <div className="flex items-center gap-2 text-white/70 text-xs md:text-sm">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <span className="text-xs">📧</span>
              </div>
              <span className="truncate">{adminProfile.email}</span>
            </div>
            <div className="flex items-center gap-2 text-white/70 text-xs md:text-sm">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <span className="text-xs">📱</span>
              </div>
              <span className="truncate">{adminProfile.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-white/70 text-xs md:text-sm">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <span className="text-xs">🏢</span>
              </div>
              <span className="truncate">{organizations.length} организаций</span>
            </div>
            <div className="flex items-center gap-2 text-white/70 text-xs md:text-sm">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <span className="text-xs">📍</span>
              </div>
              <span className="truncate">{adminProfile.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
            <motion.button
              className="px-3 py-2 md:px-4 md:py-2.5 rounded-xl bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 transition-all duration-200 font-medium text-xs md:text-sm backdrop-blur-sm"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateStub('/demo/social/owner/modules/profile/edit')}
            >
              Редактировать профиль
            </motion.button>
            <motion.button 
              className="px-3 py-2 md:px-4 md:py-2.5 rounded-xl bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all duration-200 font-medium text-xs md:text-sm backdrop-blur-sm"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateStub('/demo/social/owner/modules/organizations')}
            >
              Управление организациями
            </motion.button>
            <motion.button 
              className="px-3 py-2 md:px-4 md:py-2.5 rounded-xl bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all duration-200 font-medium text-xs md:text-sm backdrop-blur-sm"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateStub('/demo/social/owner/modules/profile/security')}
            >
              Настройки безопасности
            </motion.button>
          </div>
        </div>
      </div>
    </BentoCard>
  );
};

// Компонент виджета организаций
const OrganizationsWidget: React.FC = () => {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigateStub = useNavigationStub();

  const handleOrgClick = (org: Organization) => {
    setSelectedOrg(org);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: Organization['status']) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'suspended': return 'text-red-400';
    }
  };

  const getStatusText = (status: Organization['status']) => {
    switch (status) {
      case 'active': return 'Активна';
      case 'pending': return 'На проверке';
      case 'suspended': return 'Приостановлена';
    }
  };

  return (
    <>
      <BentoCard className="p-4 md:p-6" glowColor={COLORS.blue} enableEffects={true} colSpan={2}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-blue-500/20 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <span className="text-blue-400 text-sm md:text-lg">🏢</span>
              </div>
              <div>
                <h3 className="font-semibold text-white text-base md:text-lg line-clamp-1">Мои организации</h3>
                <p className="text-white/60 text-xs md:text-sm line-clamp-1">Управление бизнес-единицами</p>
              </div>
            </div>
            <motion.button
              className="px-2 py-1 md:px-4 md:py-2 rounded-xl bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all duration-200 text-xs md:text-sm backdrop-blur-sm flex-shrink-0"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateStub('/demo/social/owner/modules/organizations/new')}
            >
              + Добавить
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 flex-grow">
            {organizations.map((org, index) => (
              <motion.div 
                key={org.id}
                className="p-3 md:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group border border-white/5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.1)' }}
                onClick={() => handleOrgClick(org)}
              >
                <div className="flex items-start justify-between mb-2 md:mb-3">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <div 
                      className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white text-base md:text-lg backdrop-blur-sm border border-white/10 flex-shrink-0"
                      style={{ backgroundColor: `rgba(${org.color}, 0.15)` }}
                    >
                      {org.icon}
                    </div>
                    <div className="min-w-0 flex-grow">
                      <div className="text-white font-semibold text-sm line-clamp-1 group-hover:text-white/90 transition-colors">
                        {org.name}
                      </div>
                      <div className="flex items-center gap-1 md:gap-2 mt-1">
                        <span className={`text-xs ${getStatusColor(org.status)}`}>
                          {getStatusText(org.status)}
                        </span>
                        <span className="text-white/60 text-xs">•</span>
                        <span className="text-white/60 text-xs capitalize">
                          {org.plan}
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.span
                    className="opacity-0 group-hover:opacity-100 text-white/60 transition-all duration-300 text-base md:text-lg flex-shrink-0 ml-2"
                    whileHover={{ x: 2 }}
                  >
                    →
                  </motion.span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 md:gap-4 text-center mb-2 md:mb-3">
                  <div>
                    <div className="text-white font-bold text-sm">{formatCompactNumber(org.users)}</div>
                    <div className="text-white/60 text-xs">Пользователи</div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{org.departments}</div>
                    <div className="text-white/60 text-xs">Отделы</div>
                  </div>
                  <div>
                    <div className="text-green-400 font-bold text-sm">+{org.growth}%</div>
                    <div className="text-white/60 text-xs">Рост</div>
                  </div>
                </div>

                {org.revenue && (
                  <div className="mb-2">
                    <div className="text-white/60 text-xs">Выручка в месяц</div>
                    <div className="text-white font-bold text-sm">{formatCurrency(org.revenue)}</div>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-white/60">
                  <span className="truncate">{org.location}</span>
                  <span>{org.employees} сотруд.</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center text-white/60 text-xs md:text-sm">
              Общая выручка: {formatCurrency(organizations.reduce((sum, org) => sum + (org.revenue || 0), 0))} / месяц
            </div>
          </motion.div>
        </div>
      </BentoCard>

      <OrganizationModal 
        organization={selectedOrg}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

// Модальное окно организации
const OrganizationModal: React.FC<{
  organization: Organization | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ organization, isOpen, onClose }) => {
  if (!organization) return null;

  const getStatusColor = (status: Organization['status']) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'suspended': return 'text-red-400';
    }
  };

  const getStatusText = (status: Organization['status']) => {
    switch (status) {
      case 'active': return 'Активна';
      case 'pending': return 'На проверке';
      case 'suspended': return 'Приостановлена';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={organization.name} size="lg">
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white/5 rounded-xl">
          <div 
            className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-white text-xl md:text-2xl backdrop-blur-sm border border-white/10 flex-shrink-0"
            style={{ backgroundColor: `rgba(${organization.color}, 0.15)` }}
          >
            {organization.icon}
          </div>
          <div className="min-w-0 flex-grow">
            <div className="text-white font-bold text-lg md:text-xl mb-1 md:mb-2 line-clamp-2">
              {organization.name}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
              <span className={`font-semibold ${getStatusColor(organization.status)}`}>
                {getStatusText(organization.status)}
              </span>
              <span className="text-white/60">•</span>
              <span className="text-white/60">Создана: {formatDate(organization.createdAt)}</span>
              <span className="text-white/60">•</span>
              <span className="text-white/60 capitalize">Тариф: {organization.plan}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="p-3 bg-white/5 rounded-lg text-center">
            <div className="text-white font-bold text-lg md:text-2xl">{formatCompactNumber(organization.users)}</div>
            <div className="text-white/60 text-xs md:text-sm">Пользователей</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg text-center">
            <div className="text-white font-bold text-lg md:text-2xl">{organization.departments}</div>
            <div className="text-white/60 text-xs md:text-sm">Отделов</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg text-center">
            <div className="text-green-400 font-bold text-lg md:text-2xl">+{organization.growth}%</div>
            <div className="text-white/60 text-xs md:text-sm">Рост</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg text-center">
            <div className="text-white font-bold text-lg md:text-2xl">
              {organization.revenue ? formatCurrency(organization.revenue) : '—'}
            </div>
            <div className="text-white/60 text-xs md:text-sm">Выручка/мес</div>
          </div>
        </div>

        <div className="p-3 md:p-4 bg-white/5 rounded-xl">
          <div className="text-white font-semibold mb-2 md:mb-3 text-sm md:text-base">Описание</div>
          <div className="text-white/70 text-sm leading-relaxed">
            {organization.description}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="p-3 md:p-4 bg-white/5 rounded-xl">
            <div className="text-white font-semibold mb-2 md:mb-3 text-sm md:text-base">Статистика активности</div>
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-white/60">Активные пользователи</span>
                <span className="text-white font-medium">{Math.round(organization.users * 0.85)}</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-white/60">Ежедневная активность</span>
                <span className="text-white font-medium">{Math.round(organization.users * 1.2)}</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-white/60">Завершено задач</span>
                <span className="text-white font-medium">{organization.users * 15}</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-white/60">Удовлетворенность</span>
                <span className="text-white font-medium">{organization.satisfaction}%</span>
              </div>
            </div>
          </div>

          <div className="p-3 md:p-4 bg-white/5 rounded-xl">
            <div className="text-white font-semibold mb-2 md:mb-3 text-sm md:text-base">Ближайшие действия</div>
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-white/60">Обновление тарифа</span>
                <span className="text-yellow-400 font-medium">
                  {organization.nextPayment ? `Через ${Math.ceil((new Date(organization.nextPayment).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} дн.` : '—'}
                </span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-white/60">Следующий отчет</span>
                <span className="text-white font-medium">28 фев</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-white/60">Оплата</span>
                <span className="text-green-400 font-medium">Активна</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-white/60">Использование хранилища</span>
                <span className="text-white font-medium">
                  {Math.round((organization.storage.used / organization.storage.total) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-3 md:pt-4 border-t border-white/10">
          <button className="flex-1 py-2 md:py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20 text-xs md:text-sm backdrop-blur-lg">
            Управление доступом
          </button>
          <button className="flex-1 py-2 md:py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:border-white-20 text-xs md:text-sm backdrop-blur-lg">
            Финансовые отчеты
          </button>
          <button
            onClick={onClose}
            className="py-2 md:py-3 px-4 md:px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 text-xs md:text-sm backdrop-blur-lg transition-all duration-300"
          >
            Закрыть
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Компонент виджета безопасности
const SecurityWidget: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigateStub = useNavigationStub();

  const handleEventClick = (event: SecurityEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: SecurityEvent['status']) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
    }
  };

  const getSeverityColor = (severity?: SecurityEvent['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <>
      <BentoCard className="p-4 md:p-6" glowColor={COLORS.error} enableEffects={true}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-red-500/20 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
              <span className="text-red-400 text-sm md:text-lg">🛡️</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-base md:text-lg line-clamp-1">Безопасность</h3>
              <p className="text-white/60 text-xs md:text-sm line-clamp-1">Последние события</p>
            </div>
          </div>
          
          <div className="flex-grow space-y-2 md:space-y-3">
            {securityEvents.map((event, index) => (
              <motion.div 
                key={event.id}
                className="flex items-start gap-2 md:gap-3 p-2 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group border border-white/5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ x: 2, borderColor: 'rgba(255,255,255,0.1)' }}
                onClick={() => handleEventClick(event)}
              >
                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-white text-xs md:text-sm mt-0.5 backdrop-blur-sm flex-shrink-0 ${
                  event.status === 'success' ? 'bg-green-500/20 border border-green-500/30' : 
                  event.status === 'warning' ? 'bg-yellow-500/20 border border-yellow-500/30' : 'bg-red-500/20 border border-red-500/30'
                }`}>
                  {event.type === 'login' && '🔐'}
                  {event.type === 'access' && '🚪'}
                  {event.type === 'settings' && '⚙️'}
                  {event.type === 'security' && '🛡️'}
                  {event.type === 'suspicious' && '🚨'}
                  {event.type === 'backup' && '💾'}
                  {event.type === 'payment' && '💳'}
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-white font-medium text-xs md:text-sm line-clamp-1 group-hover:text-white/90 transition-colors">
                      {event.title}
                    </span>
                    <span className="text-white/60 text-xs flex-shrink-0 ml-2">{event.time}</span>
                  </div>
                  <div className="text-white/60 text-xs line-clamp-1">{event.description}</div>
                  {event.severity && (
                    <div className="mt-1">
                      <span className={`px-1.5 py-0.5 rounded-full text-xs border ${getSeverityColor(event.severity)}`}>
                        {event.severity === 'critical' ? 'Критический' : 
                         event.severity === 'high' ? 'Высокий' : 
                         event.severity === 'medium' ? 'Средний' : 'Низкий'}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button 
              className="w-full py-2 md:py-3 rounded-xl bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 transition-all duration-300 font-medium text-xs md:text-sm backdrop-blur-sm group"
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigateStub('/demo/social/owner/modules/profile/security')}
            >
              <span className="flex items-center justify-center gap-1 md:gap-2">
                Управление безопасностью
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </BentoCard>

      <SecurityEventModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

// Модальное окно события безопасности
const SecurityEventModal: React.FC<{
  event: SecurityEvent | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ event, isOpen, onClose }) => {
  if (!event) return null;

  const getStatusColor = (status: SecurityEvent['status']) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
    }
  };

  const getSeverityColor = (severity?: SecurityEvent['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Событие безопасности: ${event.title}`} size="md">
      <div className="space-y-4">
        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white/5 rounded-xl">
          <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-white text-xl md:text-2xl backdrop-blur-sm border flex-shrink-0 ${
            event.status === 'success' ? 'bg-green-500/20 border-green-500/30' : 
            event.status === 'warning' ? 'bg-yellow-500/20 border-yellow-500/30' : 'bg-red-500/20 border-red-500/30'
          }`}>
            {event.type === 'login' && '🔐'}
            {event.type === 'access' && '🚪'}
            {event.type === 'settings' && '⚙️'}
            {event.type === 'security' && '🛡️'}
            {event.type === 'suspicious' && '🚨'}
            {event.type === 'backup' && '💾'}
            {event.type === 'payment' && '💳'}
          </div>
          <div className="flex-grow">
            <div className="text-white font-bold text-lg md:text-xl mb-1 md:mb-2">{event.title}</div>
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
              <span className={`font-semibold ${getStatusColor(event.status)}`}>
                {event.status === 'success' ? 'Успешно' : event.status === 'warning' ? 'Предупреждение' : 'Ошибка'}
              </span>
              {event.severity && (
                <>
                  <span className="text-white/60">•</span>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getSeverityColor(event.severity)}`}>
                    {event.severity === 'critical' ? 'Критический' : 
                     event.severity === 'high' ? 'Высокий' : 
                     event.severity === 'medium' ? 'Средний' : 'Низкий'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-white/60 text-xs md:text-sm">Время события</div>
            <div className="text-white font-bold text-sm">{event.time}</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-white/60 text-xs md:text-sm">Местоположение</div>
            <div className="text-white font-bold text-sm">{event.location}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-white/60 text-xs md:text-sm">Устройство</div>
            <div className="text-white font-bold text-sm">{event.device}</div>
          </div>
          {event.ip && (
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-white/60 text-xs md:text-sm">IP-адрес</div>
              <div className="text-white font-bold text-sm">{event.ip}</div>
            </div>
          )}
        </div>

        <div className="p-3 md:p-4 bg-white/5 rounded-xl">
          <div className="text-white/60 text-xs md:text-sm mb-2 md:mb-3">Описание события</div>
          <div className="text-white/70 text-sm leading-relaxed">
            {event.description}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-3 md:pt-4 border-t border-white/10">
          <button className="flex-1 py-2 md:py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20 text-xs md:text-sm backdrop-blur-lg">
            Подробный отчет
          </button>
          <button
            onClick={onClose}
            className="py-2 md:py-3 px-4 md:px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 text-xs md:text-sm backdrop-blur-lg transition-all duration-300"
          >
            Закрыть
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Компонент виджета доступа к системе
const SystemAccessWidget: React.FC = () => {
  const [selectedAccess, setSelectedAccess] = useState<SystemAccess | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAccessClick = (access: SystemAccess) => {
    setSelectedAccess(access);
    setIsModalOpen(true);
  };

  const getAccessColor = (level: SystemAccess['accessLevel']) => {
    switch (level) {
      case 'full': return 'text-green-400';
      case 'limited': return 'text-yellow-400';
      case 'readonly': return 'text-blue-400';
      case 'none': return 'text-red-400';
    }
  };

  const getAccessText = (level: SystemAccess['accessLevel']) => {
    switch (level) {
      case 'full': return 'Полный';
      case 'limited': return 'Ограниченный';
      case 'readonly': return 'Чтение';
      case 'none': return 'Нет доступа';
    }
  };

  return (
    <>
      <BentoCard className="p-4 md:p-6" glowColor={COLORS.cyan} enableEffects={true}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
              <span className="text-cyan-400 text-sm md:text-lg">🔑</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-base md:text-lg line-clamp-1">Доступ к системе</h3>
              <p className="text-white/60 text-xs md:text-sm line-clamp-1">Уровни доступа</p>
            </div>
          </div>
          
          <div className="flex-grow space-y-2 md:space-y-3">
            {systemAccess.map((access, index) => (
              <motion.div 
                key={access.module}
                className="flex items-center justify-between p-2 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/5 cursor-pointer"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                whileHover={{ x: 2, borderColor: 'rgba(255,255,255,0.1)' }}
                onClick={() => handleAccessClick(access)}
              >
                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-grow">
                  <div 
                    className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-white text-base md:text-lg backdrop-blur-sm border border-white/10 flex-shrink-0"
                    style={{ backgroundColor: `rgba(${access.color}, 0.15)` }}
                  >
                    {access.icon}
                  </div>
                  <div className="min-w-0 flex-grow">
                    <div className="text-white font-medium text-xs md:text-sm line-clamp-1 group-hover:text-white/90 transition-colors">
                      {access.module}
                    </div>
                    <div className="text-white/60 text-xs mt-0.5">Использование: {access.usage}%</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 ml-2">
                  <div className="text-right">
                    <div className={`text-xs md:text-sm font-semibold ${getAccessColor(access.accessLevel)}`}>
                      {getAccessText(access.accessLevel)}
                    </div>
                    <div className="text-white/60 text-xs mt-0.5">{access.lastAccess}</div>
                  </div>
                  <motion.span
                    className="opacity-0 group-hover:opacity-100 text-white/60 transition-all duration-300 text-base md:text-lg"
                    whileHover={{ x: 2 }}
                  >
                    →
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </BentoCard>

      <SystemAccessModal 
        access={selectedAccess}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

// Модальное окно доступа к системе
const SystemAccessModal: React.FC<{
  access: SystemAccess | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ access, isOpen, onClose }) => {
  if (!access) return null;

  const getAccessColor = (level: SystemAccess['accessLevel']) => {
    switch (level) {
      case 'full': return 'text-green-400';
      case 'limited': return 'text-yellow-400';
      case 'readonly': return 'text-blue-400';
      case 'none': return 'text-red-400';
    }
  };

  const getAccessText = (level: SystemAccess['accessLevel']) => {
    switch (level) {
      case 'full': return 'Полный доступ';
      case 'limited': return 'Ограниченный доступ';
      case 'readonly': return 'Доступ только для чтения';
      case 'none': return 'Доступ запрещен';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Доступ: ${access.module}`} size="md">
      <div className="space-y-4">
        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white/5 rounded-xl">
          <div 
            className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-white text-xl md:text-2xl backdrop-blur-sm border border-white/10 flex-shrink-0"
            style={{ backgroundColor: `rgba(${access.color}, 0.15)` }}
          >
            {access.icon}
          </div>
          <div className="flex-grow">
            <div className="text-white font-bold text-lg md:text-xl mb-1 md:mb-2">{access.module}</div>
            <div className="text-white/70 text-sm">{access.description}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-white/60 text-xs md:text-sm">Уровень доступа</div>
            <div className={`text-lg md:text-xl font-bold ${getAccessColor(access.accessLevel)}`}>
              {getAccessText(access.accessLevel)}
            </div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-white/60 text-xs md:text-sm">Использование</div>
            <div className="text-white font-bold text-lg md:text-2xl">{access.usage}%</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-white/60 text-xs md:text-sm">Последний доступ</div>
            <div className="text-white font-bold text-sm">{access.lastAccess}</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-white/60 text-xs md:text-sm">Последняя активность</div>
            <div className="text-white font-bold text-sm">{access.lastActivity}</div>
          </div>
        </div>

        <div className="p-3 md:p-4 bg-white/5 rounded-xl">
          <div className="text-white/60 text-xs md:text-sm mb-2 md:mb-3">Разрешения</div>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {access.permissions.map((permission, index) => (
              <span key={index} className="px-2 py-1 bg-white/5 rounded-full text-white/80 text-xs border border-white/10">
                {permission}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-3 md:pt-4 border-t border-white/10">
          <button className="flex-1 py-2 md:py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20 text-xs md:text-sm backdrop-blur-lg">
            Журнал доступа
          </button>
          <button
            onClick={onClose}
            className="py-2 md:py-3 px-4 md:px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 text-xs md:text-sm backdrop-blur-lg transition-all duration-300"
          >
            Закрыть
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Компонент виджета уведомлений
const NotificationsWidget: React.FC = () => {
  const [preferences, setPreferences] = useState(notificationPreferences);
  const navigateStub = useNavigationStub();

  const togglePreference = (index: number, type: 'email' | 'push' | 'sms') => {
    const newPreferences = [...preferences];
    newPreferences[index][type] = !newPreferences[index][type];
    setPreferences(newPreferences);
  };

  return (
    <BentoCard className="p-4 md:p-6" glowColor={COLORS.orange} enableEffects={true}>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-orange-500/20 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
            <span className="text-orange-400 text-sm md:text-lg">🔔</span>
          </div>
          <div>
            <h3 className="font-semibold text-white text-base md:text-lg line-clamp-1">Уведомления</h3>
            <p className="text-white/60 text-xs md:text-sm line-clamp-1">Настройки оповещений</p>
          </div>
        </div>
        
        <div className="flex-grow space-y-3 md:space-y-4">
          {preferences.map((pref, index) => (
            <motion.div 
              key={pref.type}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/5"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -1, borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="text-white font-medium text-xs md:text-sm line-clamp-1 group-hover:text-white/90 transition-colors">
                    {pref.type}
                  </div>
                  {pref.critical && (
                    <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs border border-red-500/30 flex-shrink-0">
                      Критично
                    </span>
                  )}
                </div>
                <div className="flex gap-1 md:gap-2 flex-shrink-0">
                  {(['email', 'push', 'sms'] as const).map((type) => (
                    <div key={type} className="flex flex-col items-center gap-0.5">
                      <span className="text-white/60 text-xs capitalize">
                        {type === 'email' ? 'Почта' : type === 'push' ? 'Push' : 'SMS'}
                      </span>
                      <motion.button
                        onClick={() => togglePreference(index, type)}
                        className={`w-8 h-4 md:w-10 md:h-6 rounded-full transition-all duration-300 relative ${
                          pref[type] ? 'bg-green-500' : 'bg-white/20'
                        } backdrop-blur-sm`}
                        whileTap={{ scale: 0.9 }}
                      >
                        <motion.div 
                          className={`w-3 h-3 md:w-4 md:h-4 rounded-full bg-white absolute top-0.5 ${
                            pref[type] ? 'left-4 md:left-5' : 'left-0.5 md:left-1'
                          }`}
                          layout
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-white/60 text-xs leading-relaxed line-clamp-2">
                {pref.description}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button 
            className="w-full py-2 md:py-3 rounded-xl bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 transition-all duration-300 font-medium text-xs md:text-sm backdrop-blur-sm group"
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigateStub('/demo/social/owner/modules/profile/notifications')}
          >
            <span className="flex items-center justify-center gap-1 md:gap-2">
              Расширенные настройки
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </BentoCard>
  );
};

// Компонент виджета последней активности
const RecentActivityWidget: React.FC = () => {
  const navigateStub = useNavigationStub();

  const getStatusColor = (status: RecentActivity['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
    }
  };

  const getStatusText = (status: RecentActivity['status']) => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'pending': return 'В процессе';
      case 'failed': return 'Ошибка';
    }
  };

  return (
    <BentoCard className="p-4 md:p-6" glowColor={COLORS.emerald} enableEffects={true}>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
            <span className="text-emerald-400 text-sm md:text-lg">📋</span>
          </div>
          <div>
            <h3 className="font-semibold text-white text-base md:text-lg line-clamp-1">Активность</h3>
            <p className="text-white/60 text-xs md:text-sm line-clamp-1">Последние действия</p>
          </div>
        </div>
        
        <div className="flex-grow space-y-2 md:space-y-3">
          {recentActivities.map((activity, index) => (
            <motion.div 
              key={activity.id}
              className="flex items-start gap-2 md:gap-3 p-2 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/5"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ x: 2, borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs md:text-sm mt-0.5 backdrop-blur-sm flex-shrink-0">
                {activity.icon}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-white font-medium text-xs md:text-sm line-clamp-1 group-hover:text-white/90 transition-colors">
                    {activity.title}
                  </span>
                  <span className="text-white/60 text-xs flex-shrink-0 ml-2">{activity.time}</span>
                </div>
                <div className="text-white/60 text-xs line-clamp-1 mb-1 md:mb-2">{activity.description}</div>
                <div className="flex items-center justify-between">
                  {activity.amount && (
                    <span className="text-white/80 text-xs font-medium">
                      {formatCurrency(activity.amount)}
                    </span>
                  )}
                  <span className={`text-xs ${getStatusColor(activity.status)}`}>
                    {getStatusText(activity.status)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button 
            className="w-full py-2 md:py-3 rounded-xl bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 transition-all duration-300 font-medium text-xs md:text-sm backdrop-blur-sm group"
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigateStub('/demo/social/owner/modules/activity')}
          >
            <span className="flex items-center justify-center gap-1 md:gap-2">
              Вся активность
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </BentoCard>
  );
};

// Компонент виджета команды
const TeamWidget: React.FC = () => {
  const navigateStub = useNavigationStub();

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-red-400';
      case 'busy': return 'text-yellow-400';
    }
  };

  const getStatusText = (status: TeamMember['status']) => {
    switch (status) {
      case 'online': return 'В сети';
      case 'offline': return 'Не в сети';
      case 'busy': return 'Занят';
    }
  };

  return (
    <BentoCard className="p-4 md:p-6" glowColor={COLORS.violet} enableEffects={true}>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-violet-500/20 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
            <span className="text-violet-400 text-sm md:text-lg">👥</span>
          </div>
          <div>
            <h3 className="font-semibold text-white text-base md:text-lg line-clamp-1">Команда</h3>
            <p className="text-white/60 text-xs md:text-sm line-clamp-1">Ключевые сотрудники</p>
          </div>
        </div>
        
        <div className="flex-grow space-y-2 md:space-y-3">
          {teamMembers.map((member, index) => (
            <motion.div 
              key={member.id}
              className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/5"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -1, borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <div className="relative">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/10 flex items-center justify-center text-white text-base md:text-lg backdrop-blur-sm flex-shrink-0">
                  {member.avatar}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-2 h-2 md:w-3 md:h-3 rounded-full border-2 border-black ${
                  member.status === 'online' ? 'bg-green-500' : 
                  member.status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium text-xs md:text-sm line-clamp-1 group-hover:text-white/90 transition-colors">
                    {member.name}
                  </span>
                  <span className="text-white/60 text-xs flex-shrink-0 ml-2">{member.lastActive}</span>
                </div>
                <div className="text-white/60 text-xs line-clamp-1 mb-0.5">{member.role}</div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs line-clamp-1">{member.department}</span>
                  <span className={`text-xs ${getStatusColor(member.status)}`}>
                    {getStatusText(member.status)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button 
            className="w-full py-2 md:py-3 rounded-xl bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 transition-all duration-300 font-medium text-xs md:text-sm backdrop-blur-sm group"
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigateStub('/demo/social/owner/modules/team')}
          >
            <span className="flex items-center justify-center gap-1 md:gap-2">
              Управление командой
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </BentoCard>
  );
};

// Компонент виджета финансовой аналитики
const FinancialWidget: React.FC = () => {
  const navigateStub = useNavigationStub();

  return (
    <BentoCard className="p-4 md:p-6" glowColor={COLORS.emerald} enableEffects={true} colSpan={2}>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
            <span className="text-emerald-400 text-sm md:text-lg">💰</span>
          </div>
          <div>
            <h3 className="font-semibold text-white text-base md:text-lg line-clamp-1">Финансы</h3>
            <p className="text-white/60 text-xs md:text-sm line-clamp-1">Аналитика доходов и расходов</p>
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="p-3 bg-white/5 rounded-xl text-center">
              <div className="text-emerald-400 font-bold text-lg md:text-2xl">{formatCurrency(167200000)}</div>
              <div className="text-white/60 text-xs md:text-sm">Выручка</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl text-center">
              <div className="text-red-400 font-bold text-lg md:text-2xl">{formatCurrency(66800000)}</div>
              <div className="text-white/60 text-xs md:text-sm">Расходы</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl text-center">
              <div className="text-green-400 font-bold text-lg md:text-2xl">{formatCurrency(100400000)}</div>
              <div className="text-white/60 text-xs md:text-sm">Прибыль</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl text-center">
              <div className="text-orange-400 font-bold text-lg md:text-2xl">+17.3%</div>
              <div className="text-white/60 text-xs md:text-sm">Рост</div>
            </div>
          </div>

          <div className="space-y-2 md:space-y-3">
            {financialMetrics.map((metric, index) => (
              <motion.div 
                key={metric.period}
                className="grid grid-cols-6 gap-2 md:gap-4 p-2 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/5"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ x: 2, borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className="text-white font-medium text-xs md:text-sm">{metric.period}</div>
                <div className="text-emerald-400 text-xs md:text-sm">{formatCurrency(metric.revenue * 1000000)}</div>
                <div className="text-red-400 text-xs md:text-sm">{formatCurrency(metric.expenses * 1000000)}</div>
                <div className="text-green-400 text-xs md:text-sm">{formatCurrency(metric.profit * 1000000)}</div>
                <div className="text-orange-400 text-xs md:text-sm">+{metric.growth}%</div>
                <div className="text-white/60 text-xs md:text-sm text-right">{metric.users}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button 
            className="w-full py-2 md:py-3 rounded-xl bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 transition-all duration-300 font-medium text-xs md:text-sm backdrop-blur-sm group"
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigateStub('/demo/social/owner/modules/finance')}
          >
            <span className="flex items-center justify-center gap-1 md:gap-2">
              Детальная аналитика
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </BentoCard>
  );
};

// Компонент быстрых действий
const QuickActionsWidget: React.FC = () => {
  const navigateStub = useNavigationStub();

  return (
    <BentoCard className="p-4 md:p-6" glowColor={COLORS.purple} enableEffects={true} colSpan={2}>
      <div className="flex flex-col justify-center items-center text-center space-y-4 md:space-y-6">
        <motion.div 
          className="text-3xl md:text-4xl"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          ⚡
        </motion.div>
        <div>
          <h3 className="font-bold text-white text-base md:text-lg mb-1 md:mb-2">Быстрые действия</h3>
          <p className="text-white/60 text-xs md:text-sm leading-relaxed max-w-2xl">
            Управление организациями и настройками системы. Быстрый доступ к ключевым функциям платформы.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 w-full">
          {quickActions.map((action, index) => (
            <motion.button 
              key={action.label}
              className="w-full py-2 md:py-3 rounded-xl bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 transition-all duration-300 font-medium text-xs md:text-sm backdrop-blur-sm group"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              onClick={() => navigateStub(action.href)}
              style={{
                '--glow-color': action.color,
              } as React.CSSProperties}
            >
              <div className="flex flex-col items-center justify-center gap-1 md:gap-2">
                <span className="text-base md:text-lg">{action.icon}</span>
                <span className="line-clamp-1">{action.label}</span>
                <span className="text-white/40 text-xs line-clamp-1 hidden md:block">
                  {action.description}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </BentoCard>
  );
};

// Основной компонент страницы профиля
const ProfilePage: React.FC = () => {
  const navigateStub = useNavigationStub();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>
      <style jsx global>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }
      `}</style>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <motion.section 
          className="mb-6"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <ProfileHeader />
        </motion.section>

        {/* Admin Metrics */}
        <motion.section 
          className="mb-6"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="w-1.5 h-6 md:h-8 bg-blue-500 rounded-full flex-shrink-0"></div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Обзор бизнеса</h2>
          </div>
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {adminMetrics.map((metric, index) => (
              <motion.div key={metric.label} variants={itemVariants}>
                <MetricCard metric={metric} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Main Profile Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          {/* Organizations Widget - Double Width */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <OrganizationsWidget />
          </motion.div>

          {/* Security Widget */}
          <motion.div variants={itemVariants}>
            <SecurityWidget />
          </motion.div>

          {/* Financial Widget - Double Width */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <FinancialWidget />
          </motion.div>

          {/* Recent Activity Widget */}
          <motion.div variants={itemVariants}>
            <RecentActivityWidget />
          </motion.div>

          {/* System Access Widget */}
          <motion.div variants={itemVariants}>
            <SystemAccessWidget />
          </motion.div>

          {/* Team Widget */}
          <motion.div variants={itemVariants}>
            <TeamWidget />
          </motion.div>

          {/* Notifications Widget */}
          <motion.div variants={itemVariants}>
            <NotificationsWidget />
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <QuickActionsWidget />
        </motion.section>
      </main>
    </div>
  );
};

export default ProfilePage;