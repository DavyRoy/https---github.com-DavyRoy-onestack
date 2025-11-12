'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

// Типы данных для страницы настроек
interface SettingsMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
  icon: string;
  color: string;
  link?: string;
}

interface ChartData {
  label: string;
  value: number;
  category?: string;
  date?: string;
}

interface TimeRange {
  label: string;
  value: string;
}

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface SystemModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastUpdate: string;
  version: string;
  category: string;
  dependencies?: string[];
  resourceUsage: {
    memory: number;
    storage: number;
  };
}

interface SettingsCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: number;
  lastModified: string;
  color: string;
  subCategories?: string[];
}

interface SystemAlert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
  actionLink?: string;
  module?: string;
}

interface Backup {
  id: string;
  name: string;
  date: string;
  size: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'completed' | 'failed' | 'in_progress';
  location: string;
}

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  lastLogin: string;
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
}

// Константы для цветов
const COLORS = {
  primary: 'from-gray-900 via-black to-gray-800',
  success: '34, 197, 94',
  warning: '234, 179, 8',
  error: '239, 68, 68',
  info: '59, 130, 246',
  purple: '147, 51, 234',
  orange: '249, 115, 22',
  blue: '59, 130, 246',
  cyan: '34, 211, 238',
  gray: '156, 163, 175',
  emerald: '16, 185, 129',
  rose: '244, 63, 94',
  indigo: '99, 102, 241',
  teal: '20, 184, 166',
  amber: '245, 158, 11',
  violet: '139, 92, 246'
} as const;

// Расширенные моки данных для страницы настроек
const settingsMetrics: SettingsMetric[] = [
  { 
    label: "Модули", 
    value: 24, 
    change: 2, 
    trend: 'up', 
    description: "Из 28 доступных", 
    icon: "⚡", 
    color: COLORS.success,
    link: "/demo/social/owner/modules/settings/modules"
  },
  { 
    label: "Система", 
    value: 156, 
    change: 8, 
    trend: 'up', 
    description: "Конфигурационных параметров", 
    icon: "⚙️", 
    color: COLORS.blue
  },
  { 
    label: "Задачи", 
    value: 12, 
    change: -1, 
    trend: 'down', 
    description: "Запущено по расписанию", 
    icon: "🤖", 
    color: COLORS.purple
  },
  { 
    label: "Копии", 
    value: 45, 
    change: 5, 
    trend: 'up', 
    description: "За последний месяц", 
    icon: "💾", 
    color: COLORS.orange
  },
  { 
    label: "Оповещений", 
    value: 3, 
    change: -2, 
    trend: 'down', 
    description: "Требуют внимания", 
    icon: "⚠️", 
    color: COLORS.warning
  },
  { 
    label: "Обновлений", 
    value: 2, 
    change: 0, 
    trend: 'stable', 
    description: "Доступно для установки", 
    icon: "🔄", 
    color: COLORS.cyan
  },
  { 
    label: "Пользователи", 
    value: 89, 
    change: 4, 
    trend: 'up', 
    description: "В текущей сессии", 
    icon: "👥", 
    color: COLORS.emerald
  },
  { 
    label: "API запросов", 
    value: 125, 
    change: 12, 
    trend: 'up', 
    description: "За последние 24 часа", 
    icon: "🔗", 
    color: COLORS.indigo
  },
];

const systemLoadData: ChartData[] = [
  { label: '00:00', value: 45, category: 'load', date: '2024-01-15' },
  { label: '04:00', value: 38, category: 'load', date: '2024-01-15' },
  { label: '08:00', value: 65, category: 'load', date: '2024-01-15' },
  { label: '12:00', value: 78, category: 'load', date: '2024-01-15' },
  { label: '16:00', value: 82, category: 'load', date: '2024-01-15' },
  { label: '20:00', value: 71, category: 'load', date: '2024-01-15' },
  { label: '23:59', value: 52, category: 'load', date: '2024-01-15' },
];

const storageUsageData: ChartData[] = [
  { label: 'Системные файлы', value: 25, category: 'storage' },
  { label: 'Базы данных', value: 42, category: 'storage' },
  { label: 'Логи', value: 18, category: 'storage' },
  { label: 'Резервные копии', value: 12, category: 'storage' },
  { label: 'Временные файлы', value: 3, category: 'storage' },
];

const moduleStatusData: ChartData[] = [
  { label: 'Активные', value: 24, category: 'status' },
  { label: 'Неактивные', value: 3, category: 'status' },
  { label: 'На обслуживании', value: 1, category: 'status' },
];

// Расширенные данные системных модулей
const systemModules: SystemModule[] = [
  {
    id: '1',
    name: 'Пользовательский модуль',
    description: 'Управление пользователями и ролями',
    icon: '👥',
    color: 'from-blue-500 to-cyan-500',
    status: 'active',
    lastUpdate: '2024-01-15',
    version: '2.1.4',
    category: 'security',
    dependencies: ['auth', 'database'],
    resourceUsage: { memory: 128, storage: 45 }
  },
  {
    id: '2',
    name: 'Финансовый модуль',
    description: 'Учет и управление финансами',
    icon: '💰',
    color: 'from-green-500 to-emerald-500',
    status: 'active',
    lastUpdate: '2024-01-14',
    version: '1.8.2',
    category: 'finance',
    dependencies: ['database', 'reports'],
    resourceUsage: { memory: 256, storage: 120 }
  },
  {
    id: '3',
    name: 'Аналитический модуль',
    description: 'Сбор и анализ статистики',
    icon: '📊',
    color: 'from-purple-500 to-pink-500',
    status: 'active',
    lastUpdate: '2024-01-13',
    version: '3.0.1',
    category: 'analytics',
    dependencies: ['database', 'api'],
    resourceUsage: { memory: 512, storage: 320 }
  },
  {
    id: '4',
    name: 'Система отчетности',
    description: 'Генерация и управление отчетами',
    icon: '📈',
    color: 'from-orange-500 to-amber-500',
    status: 'maintenance',
    lastUpdate: '2024-01-12',
    version: '2.5.3',
    category: 'reports',
    dependencies: ['database', 'analytics'],
    resourceUsage: { memory: 192, storage: 85 }
  },
  {
    id: '5',
    name: 'Интеграции API',
    description: 'Внешние интеграции и сервисы',
    icon: '🔗',
    color: 'from-cyan-500 to-blue-500',
    status: 'active',
    lastUpdate: '2024-01-11',
    version: '1.2.7',
    category: 'integration',
    dependencies: ['auth', 'security'],
    resourceUsage: { memory: 164, storage: 65 }
  },
  {
    id: '6',
    name: 'Система уведомлений',
    description: 'Управление оповещениями',
    icon: '🔔',
    color: 'from-yellow-500 to-orange-500',
    status: 'inactive',
    lastUpdate: '2024-01-10',
    version: '1.0.5',
    category: 'communication',
    dependencies: ['database'],
    resourceUsage: { memory: 64, storage: 25 }
  },
  {
    id: '7',
    name: 'Модуль безопасности',
    description: 'Защита и контроль доступа',
    icon: '🛡️',
    color: 'from-red-500 to-pink-500',
    status: 'active',
    lastUpdate: '2024-01-09',
    version: '2.3.0',
    category: 'security',
    dependencies: ['auth'],
    resourceUsage: { memory: 96, storage: 40 }
  },
  {
    id: '8',
    name: 'Кэширование данных',
    description: 'Оптимизация производительности',
    icon: '🚀',
    color: 'from-indigo-500 to-purple-500',
    status: 'active',
    lastUpdate: '2024-01-08',
    version: '1.5.2',
    category: 'performance',
    dependencies: ['database'],
    resourceUsage: { memory: 1024, storage: 210 }
  },
];

const settingsCategories: SettingsCategory[] = [
  {
    id: '1',
    name: 'Общие настройки',
    description: 'Основные параметры системы',
    icon: '⚙️',
    items: 24,
    lastModified: '2024-01-15',
    color: 'from-blue-500 to-cyan-500',
    subCategories: ['Основные', 'Интерфейс', 'Уведомления']
  },
  {
    id: '2',
    name: 'Безопасность',
    description: 'Настройки доступа и защиты',
    icon: '🔒',
    items: 18,
    lastModified: '2024-01-14',
    color: 'from-green-500 to-emerald-500',
    subCategories: ['Аутентификация', 'Авторизация', 'Аудит']
  },
  {
    id: '3',
    name: 'Уведомления',
    description: 'Настройки оповещений',
    icon: '🔔',
    items: 12,
    lastModified: '2024-01-13',
    color: 'from-purple-500 to-pink-500',
    subCategories: ['Email', 'SMS', 'Push-уведомления']
  },
  {
    id: '4',
    name: 'Интеграции',
    description: 'Внешние сервисы и API',
    icon: '🔗',
    items: 8,
    lastModified: '2024-01-12',
    color: 'from-orange-500 to-amber-500',
    subCategories: ['API ключи', 'Webhooks', 'Сторонние сервисы']
  },
  {
    id: '5',
    name: 'Резервное копирование',
    description: 'Настройки бэкапов',
    icon: '💾',
    items: 6,
    lastModified: '2024-01-11',
    color: 'from-cyan-500 to-blue-500',
    subCategories: ['Расписание', 'Хранилище', 'Восстановление']
  },
  {
    id: '6',
    name: 'Производительность',
    description: 'Оптимизация системы',
    icon: '⚡',
    items: 15,
    lastModified: '2024-01-10',
    color: 'from-yellow-500 to-orange-500',
    subCategories: ['Кэширование', 'База данных', 'Оптимизация']
  },
  {
    id: '7',
    name: 'Мониторинг',
    description: 'Наблюдение за системой',
    icon: '📊',
    items: 9,
    lastModified: '2024-01-09',
    color: 'from-violet-500 to-purple-500',
    subCategories: ['Метрики', 'Логи', 'Аналитика']
  },
  {
    id: '8',
    name: 'Пользователи',
    description: 'Управление пользователями',
    icon: '👥',
    items: 11,
    lastModified: '2024-01-08',
    color: 'from-teal-500 to-cyan-500',
    subCategories: ['Роли', 'Разрешения', 'Сессии']
  },
];

// Расширенные системные предупреждения
const systemAlerts: SystemAlert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Высокая нагрузка на сервер',
    message: 'CPU использование превысило 80% в течение последних 15 минут. Рекомендуется проверить логи и оптимизировать запросы.',
    time: '10 мин назад',
    priority: 'high',
    module: 'performance',
    action: 'Просмотреть логи',
    actionLink: '/demo/social/owner/modules/settings/logs'
  },
  {
    id: '2',
    type: 'info',
    title: 'Обновление системы безопасности',
    message: 'Доступно обновление до версии 2.1.5 с критическими исправлениями безопасности. Рекомендуется установить в ближайшее время.',
    time: '2 часа назад',
    priority: 'medium',
    module: 'security',
    action: 'Установить',
    actionLink: '/demo/social/owner/modules/settings/updates'
  },
  {
    id: '3',
    type: 'success',
    title: 'Резервное копирование завершено',
    message: 'Автоматическое резервное копирование всех баз данных и системных файлов успешно завершено. Размер архива: 4.2 ГБ.',
    time: '6 часов назад',
    priority: 'low',
    module: 'backup'
  },
  {
    id: '4',
    type: 'error',
    title: 'Ошибка интеграции с платежной системой',
    message: 'Обнаружены проблемы с подключением к API платежной системы. Транзакции могут быть временно недоступны.',
    time: '30 мин назад',
    priority: 'high',
    module: 'integration',
    action: 'Исправить',
    actionLink: '/demo/social/owner/modules/settings/integrations'
  },
  {
    id: '5',
    type: 'warning',
    title: 'Заканчивается место на диске',
    message: 'Свободное место на системном диске составляет менее 10%. Рекомендуется очистить временные файлы или увеличить объем хранилища.',
    time: '1 час назад',
    priority: 'medium',
    module: 'storage',
    action: 'Очистить',
    actionLink: '/demo/social/owner/modules/settings/storage'
  },
  {
    id: '6',
    type: 'info',
    title: 'Новые пользователи зарегистрированы',
    message: 'За последние 24 часа зарегистрировано 12 новых пользователей. Общее количество активных пользователей: 89.',
    time: '3 часа назад',
    priority: 'low',
    module: 'users'
  },
];

// Данные резервных копий
const backups: Backup[] = [
  {
    id: '1',
    name: 'Полный бэкап системы',
    date: '2024-01-15 02:00',
    size: '4.2 ГБ',
    type: 'full',
    status: 'completed',
    location: '/backups/full_20240115_0200.zip'
  },
  {
    id: '2',
    name: 'Инкрементальный бэкап БД',
    date: '2024-01-15 12:00',
    size: '1.1 ГБ',
    type: 'incremental',
    status: 'completed',
    location: '/backups/inc_db_20240115_1200.zip'
  },
  {
    id: '3',
    name: 'Бэкап пользовательских данных',
    date: '2024-01-14 02:00',
    size: '2.8 ГБ',
    type: 'differential',
    status: 'completed',
    location: '/backups/diff_user_20240114_0200.zip'
  },
  {
    id: '4',
    name: 'Системные файлы',
    date: '2024-01-13 02:00',
    size: '3.5 ГБ',
    type: 'full',
    status: 'completed',
    location: '/backups/full_20240113_0200.zip'
  },
];

// Данные пользователей
const users: User[] = [
  {
    id: '1',
    name: 'Александр Иванов',
    role: 'Администратор',
    email: 'a.ivanov@company.com',
    lastLogin: '2024-01-15 14:30',
    status: 'active',
    avatar: '👨‍💼'
  },
  {
    id: '2',
    name: 'Мария Петрова',
    role: 'Модератор',
    email: 'm.petrova@company.com',
    lastLogin: '2024-01-15 13:45',
    status: 'active',
    avatar: '👩‍💼'
  },
  {
    id: '3',
    name: 'Дмитрий Сидоров',
    role: 'Аналитик',
    email: 'd.sidorov@company.com',
    lastLogin: '2024-01-14 16:20',
    status: 'active',
    avatar: '👨‍🔬'
  },
  {
    id: '4',
    name: 'Елена Козлова',
    role: 'Пользователь',
    email: 'e.kozlova@company.com',
    lastLogin: '2024-01-13 11:15',
    status: 'inactive',
    avatar: '👩‍💻'
  },
];

const timeRanges: TimeRange[] = [
  { label: '24 часа', value: '24h' },
  { label: '7 дней', value: '7d' },
  { label: '30 дней', value: '30d' },
  { label: '90 дней', value: '90d' },
];

const filterOptions: FilterOption[] = [
  { label: 'Все модули', value: 'all', count: 28 },
  { label: 'Активные', value: 'active', count: 24 },
  { label: 'Неактивные', value: 'inactive', count: 3 },
  { label: 'На обслуживании', value: 'maintenance', count: 1 },
];

// Утилиты для форматирования чисел
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const getStatusColor = (status: SystemModule['status']) => {
  switch (status) {
    case 'active': return 'text-green-400';
    case 'inactive': return 'text-red-400';
    case 'maintenance': return 'text-yellow-400';
    default: return 'text-gray-400';
  }
};

const getStatusText = (status: SystemModule['status']) => {
  switch (status) {
    case 'active': return 'Активен';
    case 'inactive': return 'Неактивен';
    case 'maintenance': return 'Обслуживание';
    default: return 'Неизвестно';
  }
};

const getAlertColor = (type: SystemAlert['type']) => {
  return {
    warning: COLORS.warning,
    info: COLORS.info,
    success: COLORS.success,
    error: COLORS.error
  }[type];
};

// Заглушки для переходов
const useNavigationStub = () => {
  return useCallback((path: string) => {
    console.log(`Навигация заблокирована: ${path}`);
    alert(`Переход на ${path} временно недоступен. Это демо-версия интерфейса.`);
  }, []);
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
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Улучшенный Bento Card компонент с магнитным эффектом
const BentoCard = React.memo(React.forwardRef<HTMLDivElement, {
  children: React.ReactNode;
  className?: string;
  enableEffects?: boolean;
  glowColor?: string;
  onClick?: () => void;
  colSpan?: number;
  rowSpan?: number;
  enableMagnetism?: boolean;
}>(({ 
  children, 
  className = '', 
  enableEffects = true, 
  glowColor = COLORS.purple, 
  onClick, 
  colSpan = 1, 
  rowSpan = 1,
  enableMagnetism = true 
}, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const magnetismRef = useRef<gsap.core.Tween | null>(null);
  
  useEffect(() => {
    if (!enableEffects || !cardRef.current) return;

    const card = cardRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      
      rafRef.current = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const relativeX = (x / rect.width) * 100;
        const relativeY = (y / rect.height) * 100;

        card.style.setProperty('--glow-x', `${relativeX}%`);
        card.style.setProperty('--glow-y', `${relativeY}%`);
        card.style.setProperty('--glow-intensity', '1');

        // Магнитный эффект
        if (enableMagnetism) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const magnetX = (x - centerX) * 0.03;
          const magnetY = (y - centerY) * 0.03;

          if (magnetismRef.current) magnetismRef.current.kill();
          
          magnetismRef.current = gsap.to(card, {
            x: magnetX,
            y: magnetY,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });
    };

    const handleMouseLeave = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      card.style.setProperty('--glow-intensity', '0');
      
      if (enableMagnetism && magnetismRef.current) {
        magnetismRef.current.kill();
        gsap.to(card, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (magnetismRef.current) magnetismRef.current.kill();
    };
  }, [enableEffects, enableMagnetism]);

  const colSpanClass = {
    1: '',
    2: 'md:col-span-2 lg:col-span-2',
    3: 'md:col-span-3 lg:col-span-3',
    4: 'md:col-span-4 lg:col-span-4',
  }[colSpan];

  const rowSpanClass = {
    1: '',
    2: 'md:row-span-2 lg:row-span-2',
  }[rowSpan];

  return (
    <motion.div
      ref={ref || cardRef}
      className={`
        relative overflow-hidden 
        rounded-2xl border border-white/10 
        bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl
        transition-all duration-500 
        hover:border-white/20 hover:bg-white/15
        w-full max-w-full
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${colSpanClass}
        ${rowSpanClass}
        ${className}
      `}
      style={{
        '--glow-x': '50%',
        '--glow-y': '50%',
        '--glow-intensity': '0',
        '--glow-color': glowColor,
      } as React.CSSProperties}
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {enableEffects && (
        <>
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
            style={{
              opacity: 'var(--glow-intensity)',
              background: `radial-gradient(600px circle at var(--glow-x) var(--glow-y), 
                           rgba(var(--glow-color), 0.15) 0%, 
                           rgba(var(--glow-color), 0.08) 30%, 
                           transparent 70%)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500"
            style={{
              opacity: 'var(--glow-intensity)',
              background: `radial-gradient(300px circle at var(--glow-x) var(--glow-y), 
                           rgba(var(--glow-color), 0.3) 0%, 
                           transparent 50%)`,
              mixBlendMode: 'overlay'
            }}
          />
        </>
      )}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
}));

BentoCard.displayName = 'BentoCard';

// Анимированный MetricCard с улучшенной визуализацией
const MetricCard = React.memo(({ metric, onClick }: { metric: SettingsMetric; onClick?: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigateStub = useNavigationStub();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (metric.link) {
      navigateStub(metric.link);
    }
  };

  const content = (
    <motion.div 
      ref={ref}
      className="h-full flex flex-col justify-between p-4 sm:p-5"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start justify-between mb-3">
        <motion.div 
          className="text-2xl sm:text-3xl font-bold text-white leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          {metric.value > 1000 ? formatNumber(metric.value) : metric.value}
        </motion.div>
        <div className="flex flex-col items-end gap-1">
          <motion.div 
            className="text-xl sm:text-2xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={isVisible ? { scale: 1, rotate: 0 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            {metric.icon}
          </motion.div>
          <motion.div 
            className={`flex items-center gap-1 text-xs sm:text-sm px-2 py-1 rounded-full border backdrop-blur-lg`}
            style={{ 
              backgroundColor: `rgba(${metric.color}, 0.2)`,
              color: `rgb(${metric.color})`,
              borderColor: `rgba(${metric.color}, 0.3)`
            }}
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.2 }}
          >
            {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
            {Math.abs(metric.change)}%
          </motion.div>
        </div>
      </div>
      
      <div className="space-y-2">
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, x: -20 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          <span className="text-white/80 text-sm font-medium line-clamp-1">{metric.label}</span>
        </motion.div>
        
        <motion.div 
          className="text-white/60 text-xs line-clamp-2"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          {metric.description}
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <BentoCard 
      className="h-full min-h-[140px]"
      enableEffects={true}
      glowColor={metric.color}
      enableMagnetism={true}
      onClick={handleClick}
    >
      {content}
    </BentoCard>
  );
});

MetricCard.displayName = 'MetricCard';

// Модальное окно для деталей метрики
const MetricDetailsModal: React.FC<{
  metric: SettingsMetric | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ metric, isOpen, onClose }) => {
  if (!metric) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Детали: ${metric.label}`} size="md">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{metric.icon}</div>
            <div>
              <div className="text-white font-bold text-2xl">{metric.value}</div>
              <div className="text-white/60">{metric.label}</div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full ${
            metric.trend === 'up' ? 'bg-green-500/20 text-green-400' :
            metric.trend === 'down' ? 'bg-red-500/20 text-red-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {metric.trend === 'up' ? '↗ Рост' : metric.trend === 'down' ? '↘ Снижение' : '→ Стабильно'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-white/60 text-sm">Изменение</div>
            <div className="text-white font-bold">{metric.change}%</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-white/60 text-sm">Тренд</div>
            <div className="text-white font-bold capitalize">{metric.trend}</div>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-xl">
          <div className="text-white/60 text-sm mb-2">Описание</div>
          <div className="text-white">{metric.description}</div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20 text-sm backdrop-blur-lg"
          >
            Закрыть
          </button>
          {metric.link && (
            <button
              onClick={() => {
                useNavigationStub()(metric.link!);
                onClose();
              }}
              className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 text-sm backdrop-blur-lg transition-all duration-300"
            >
              Перейти →
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

// Улучшенный SystemLoadChartWidget с анимированными барами
const SystemLoadChartWidget = React.memo(() => {
  const maxValue = Math.max(...systemLoadData.map(d => d.value));
  const averageLoad = Math.round(systemLoadData.reduce((sum, d) => sum + d.value, 0) / systemLoadData.length);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BentoCard className="p-4 sm:p-6 h-full" glowColor={COLORS.blue} colSpan={2} enableMagnetism={true}>
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-white text-sm sm:text-base">Нагрузка системы</h3>
          <span className="text-white/60 text-xs">за 24 часа</span>
        </div>
        
        <div className="flex-grow flex items-end justify-between px-2 pb-4 gap-1 sm:gap-2">
          {systemLoadData.map((data, index) => (
            <motion.div 
              key={data.label}
              className="flex flex-col items-center flex-1"
              initial={{ scaleY: 0 }}
              animate={isVisible ? { scaleY: 1 } : {}}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className={`w-3 sm:w-4 lg:w-6 rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer ${
                  data.value > 80 ? 'bg-gradient-to-t from-red-500 to-pink-500' :
                  data.value > 60 ? 'bg-gradient-to-t from-orange-500 to-amber-500' :
                  'bg-gradient-to-t from-blue-500 to-cyan-500'
                }`}
                style={{ 
                  height: `${(data.value / maxValue) * 100}%`, 
                  minHeight: '20px', 
                  maxHeight: '120px' 
                }}
                whileHover={{
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                }}
              />
              <div className="text-white text-xs mt-2">{data.label}</div>
              <div className="text-white/60 text-xs">{data.value}%</div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <div>
            <div className="text-white font-bold text-lg">
              {averageLoad}%
            </div>
            <div className="text-white/60 text-xs">Средняя нагрузка</div>
          </div>
          <div>
            <div className="text-white font-bold text-lg">
              {Math.max(...systemLoadData.map(d => d.value))}%
            </div>
            <div className="text-white/60 text-xs">Пиковая нагрузка</div>
          </div>
          <div>
            <div className="text-green-400 font-bold text-lg">-5%</div>
            <div className="text-white/60 text-xs">Изменение</div>
          </div>
        </motion.div>
      </div>
    </BentoCard>
  );
});

SystemLoadChartWidget.displayName = 'SystemLoadChartWidget';

// Улучшенный StorageUsageWidget с прогресс-барами
const StorageUsageWidget = React.memo(() => {
  return (
    <BentoCard className="p-4 sm:p-6 h-full" glowColor={COLORS.purple} colSpan={2} enableMagnetism={true}>
      <div className="h-full flex flex-col">
        <h3 className="font-semibold text-white mb-4 text-sm sm:text-base">Использование хранилища</h3>
        
        <div className="flex-grow space-y-3">
          {storageUsageData.map((storage, index) => {
            const percentage = storage.value;
            return (
              <motion.div 
                key={storage.label}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-white/80 text-xs font-medium flex-shrink-0 border border-white/10">
                    {storage.label.slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-white/80 text-sm truncate">{storage.label}</div>
                    <div className="text-white/60 text-xs">{storage.value}% от общего объема</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-16 sm:w-20 bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: index * 0.2 + 0.5, duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-white/80 text-sm font-medium w-8 sm:w-10 text-right">
                    {percentage}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <motion.div 
          className="mt-4 pt-4 border-t border-white/10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="text-white/60 text-xs">
            Всего {storageUsageData.length} категорий хранения
          </div>
        </motion.div>
      </div>
    </BentoCard>
  );
});

StorageUsageWidget.displayName = 'StorageUsageWidget';

// Модальное окно для деталей модуля
const ModuleDetailsModal: React.FC<{
  module: SystemModule | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ module, isOpen, onClose }) => {
  if (!module) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Модуль: ${module.name}`} size="lg">
      <div className="space-y-6">
        {/* Заголовок модуля */}
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
          <div className={`text-4xl bg-gradient-to-br ${module.color} rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg`}>
            {module.icon}
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-xl">{module.name}</div>
            <div className="text-white/60">{module.description}</div>
          </div>
          <div className={`px-3 py-1 rounded-full border backdrop-blur-lg ${getStatusColor(module.status)}`}>
            {getStatusText(module.status)}
          </div>
        </div>

        {/* Основная информация */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 bg-white/5 rounded-lg text-center">
            <div className="text-white/60 text-sm">Версия</div>
            <div className="text-white font-bold">v{module.version}</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg text-center">
            <div className="text-white/60 text-sm">Категория</div>
            <div className="text-white font-bold capitalize">{module.category}</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg text-center">
            <div className="text-white/60 text-sm">Обновлен</div>
            <div className="text-white font-bold text-sm">{new Date(module.lastUpdate).toLocaleDateString('ru-RU')}</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg text-center">
            <div className="text-white/60 text-sm">Зависимости</div>
            <div className="text-white font-bold">{module.dependencies?.length || 0}</div>
          </div>
        </div>

        {/* Зависимости */}
        {module.dependencies && module.dependencies.length > 0 && (
          <div>
            <h4 className="text-white font-semibold mb-3">Зависимости</h4>
            <div className="flex flex-wrap gap-2">
              {module.dependencies.map((dep, index) => (
                <span key={index} className="px-3 py-1 bg-white/5 rounded-full text-white/80 text-sm border border-white/10">
                  {dep}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Действия */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <button className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20 text-sm backdrop-blur-lg">
            Настройки модуля
          </button>
          <button className="flex-1 py-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 hover:border-blue-500/50 text-sm backdrop-blur-lg transition-all duration-300">
            Обновить модуль
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 text-sm backdrop-blur-lg transition-all duration-300"
          >
            Закрыть
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Улучшенный SystemModulesWidget с фильтрацией и модальными окнами
const SystemModulesWidget = React.memo(() => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'maintenance'>('all');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedModule, setSelectedModule] = useState<SystemModule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredModules = useMemo(() => 
    systemModules.filter(module => 
      filter === 'all' || module.status === filter
    ),
    [filter]
  );

  const handleModuleClick = (module: SystemModule) => {
    setSelectedModule(module);
    setIsModalOpen(true);
  };

  return (
    <>
      <BentoCard className="p-4 sm:p-6 h-full" glowColor={COLORS.orange} colSpan={2} enableMagnetism={true}>
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-white text-sm sm:text-base">Системные модули</h3>
            <div className="flex gap-1 flex-wrap">
              {(['all', 'active', 'inactive', 'maintenance'] as const).map((filterType) => (
                <motion.button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-2 py-1 rounded-lg text-xs transition-all duration-300 flex-shrink-0 backdrop-blur-lg border ${
                    filter === filterType
                      ? 'bg-white/20 text-white border-white/30 shadow-lg'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border-white/10 hover:border-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {filterType === 'all' && 'Все'}
                  {filterType === 'active' && 'Акт.'}
                  {filterType === 'inactive' && 'Неакт.'}
                  {filterType === 'maintenance' && 'Обсл.'}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="flex-grow space-y-3">
            {filteredModules.map((module, index) => (
              <motion.div 
                key={module.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                onClick={() => handleModuleClick(module)}
              >
                <motion.div 
                  className={`text-2xl bg-gradient-to-br ${module.color} rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-lg`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  {module.icon}
                </motion.div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/80 text-sm font-medium truncate">
                      {module.name}
                    </span>
                    <span className="text-white/60 text-xs ml-2 flex-shrink-0">
                      v{module.version}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span className="truncate flex-1 mr-2">{module.description}</span>
                    <span className="flex-shrink-0">{new Date(module.lastUpdate).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
                
                <motion.div 
                  className={`px-2 py-1 rounded-full text-xs border backdrop-blur-lg ${getStatusColor(module.status)} flex-shrink-0`}
                  whileHover={{ scale: 1.1 }}
                >
                  {getStatusText(module.status)}
                </motion.div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-4 pt-4 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            <button 
              className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20 text-sm backdrop-blur-lg"
            >
              Управление модулями →
            </button>
          </motion.div>
        </div>
      </BentoCard>

      <ModuleDetailsModal 
        module={selectedModule}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
});

SystemModulesWidget.displayName = 'SystemModulesWidget';

// Улучшенный SettingsCategoriesWidget
const SettingsCategoriesWidget = React.memo(() => {
  const navigateStub = useNavigationStub();

  return (
    <BentoCard className="p-4 sm:p-6 h-full" glowColor={COLORS.success} colSpan={2} enableMagnetism={true}>
      <div className="h-full flex flex-col">
        <h3 className="font-semibold text-white mb-4 text-sm sm:text-base">Категории настроек</h3>
        
        <div className="flex-grow space-y-4">
          {settingsCategories.map((category, index) => (
            <motion.div 
              key={category.id}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4, scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              onClick={() => navigateStub(`/demo/social/owner/modules/settings/${category.id}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <motion.div 
                    className="text-2xl flex-shrink-0"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                  >
                    {category.icon}
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <div className="text-white font-medium text-sm truncate">{category.name}</div>
                    <div className="text-white/60 text-xs truncate">{category.description}</div>
                  </div>
                </div>
                <div className="text-white/60 text-xs flex-shrink-0 ml-2">
                  {category.items} параметров
                </div>
              </div>
              
              {category.subCategories && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {category.subCategories.slice(0, 3).map((subCat, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white/5 rounded text-white/60 text-xs border border-white/10">
                      {subCat}
                    </span>
                  ))}
                  {category.subCategories.length > 3 && (
                    <span className="px-2 py-1 bg-white/5 rounded text-white/40 text-xs border border-white/10">
                      +{category.subCategories.length - 3}
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex justify-between items-center text-xs text-white/60">
                <span className="truncate">
                  Изменено: {new Date(category.lastModified).toLocaleDateString('ru-RU')}
                </span>
                <motion.span
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
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
  );
});

SettingsCategoriesWidget.displayName = 'SettingsCategoriesWidget';

// Модальное окно для деталей предупреждения
const AlertDetailsModal: React.FC<{
  alert: SystemAlert | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ alert, isOpen, onClose }) => {
  if (!alert) return null;

  const alertColor = getAlertColor(alert.type);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Предупреждение системы`} size="md">
      <div className="space-y-4">
        <div 
          className="p-4 rounded-xl border backdrop-blur-lg"
          style={{
            backgroundColor: `rgba(${alertColor}, 0.1)`,
            borderColor: `rgba(${alertColor}, 0.3)`,
          }}
        >
          <div className="flex items-start gap-3 mb-3">
            <motion.div 
              className={`text-2xl flex-shrink-0 ${
                alert.type === 'warning' ? 'text-yellow-400' :
                alert.type === 'info' ? 'text-blue-400' :
                alert.type === 'success' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {alert.type === 'warning' ? '⚠️' :
               alert.type === 'info' ? 'ℹ️' :
               alert.type === 'success' ? '✅' : '❌'}
            </motion.div>
            <div className="flex-grow">
              <div className="font-bold text-white text-lg mb-2">{alert.title}</div>
              <div className="text-white/70 leading-relaxed">{alert.message}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-white/60 text-sm">Приоритет</div>
            <div className={`font-bold ${
              alert.priority === 'high' ? 'text-red-400' :
              alert.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {alert.priority === 'high' ? 'Высокий' : alert.priority === 'medium' ? 'Средний' : 'Низкий'}
            </div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-white/60 text-sm">Время</div>
            <div className="text-white font-bold">{alert.time}</div>
          </div>
        </div>

        {alert.module && (
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-white/60 text-sm">Модуль</div>
            <div className="text-white font-bold capitalize">{alert.module}</div>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-white/10">
          <button className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20 text-sm backdrop-blur-lg">
            Пометить прочитанным
          </button>
          {alert.action && (
            <button 
              className="flex-1 py-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 hover:border-blue-500/50 text-sm backdrop-blur-lg transition-all duration-300"
              onClick={() => {
                useNavigationStub()(alert.actionLink!);
                onClose();
              }}
            >
              {alert.action}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

// Улучшенный SystemAlertsWidget с модальными окнами
const SystemAlertsWidget = React.memo(() => {
  const [visibleAlerts, setVisibleAlerts] = useState(systemAlerts);
  const [selectedAlert, setSelectedAlert] = useState<SystemAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAlertClick = (alert: SystemAlert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  return (
    <>
      <BentoCard className="p-4 sm:p-6 h-full" glowColor={COLORS.warning} enableMagnetism={true} colSpan={2}>
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-white text-sm sm:text-base">Системные предупреждения</h3>
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-xs">Всего: {visibleAlerts.length}</span>
              <motion.button
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-xs transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Фильтр
              </motion.button>
            </div>
          </div>
          
          <div className="flex-grow space-y-3 max-h-[400px] overflow-y-auto pr-2">
            <AnimatePresence>
              {visibleAlerts.map((alert, index) => {
                const alertColor = getAlertColor(alert.type);
                return (
                  <motion.div 
                    key={alert.id}
                    className="p-4 rounded-xl border backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    style={{
                      backgroundColor: `rgba(${alertColor}, 0.1)`,
                      borderColor: `rgba(${alertColor}, 0.3)`,
                    }}
                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.8 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ y: -2 }}
                    layout
                    onClick={() => handleAlertClick(alert)}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <motion.div 
                        className={`text-xl flex-shrink-0 ${
                          alert.type === 'warning' ? 'text-yellow-400' :
                          alert.type === 'info' ? 'text-blue-400' :
                          alert.type === 'success' ? 'text-green-400' : 'text-red-400'
                        }`}
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        {alert.type === 'warning' ? '⚠️' :
                         alert.type === 'info' ? 'ℹ️' :
                         alert.type === 'success' ? '✅' : '❌'}
                      </motion.div>
                      <div className="flex-grow min-w-0">
                        <div className="font-medium text-white text-sm mb-2 truncate">{alert.title}</div>
                        <div className="text-white/70 text-xs leading-relaxed">{alert.message}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-white/60 truncate">{alert.time}</span>
                        <span className={`px-2 py-1 rounded-full backdrop-blur-lg ${
                          alert.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          alert.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {alert.priority === 'high' ? 'Высокий' : alert.priority === 'medium' ? 'Средний' : 'Низкий'}
                        </span>
                      </div>
                      {alert.action && (
                        <motion.span 
                          className="text-white/80 hover:text-white text-xs cursor-pointer font-medium px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
                          whileHover={{ x: 2, scale: 1.05 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            useNavigationStub()(alert.actionLink!);
                          }}
                        >
                          {alert.action}
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          <motion.div 
            className="mt-4 pt-4 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <button 
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20 text-sm backdrop-blur-lg font-medium"
            >
              Просмотреть все предупреждения →
            </button>
          </motion.div>
        </div>
      </BentoCard>

      <AlertDetailsModal 
        alert={selectedAlert}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
});

SystemAlertsWidget.displayName = 'SystemAlertsWidget';

// Улучшенный QuickActionsWidget с модальными окнами
const QuickActionsWidget = React.memo(() => {
  const actions = [
    { icon: '⚙️', label: 'Общие настройки', description: 'Основные параметры системы и конфигурация', link: '/demo/social/owner/modules/settings/general', color: COLORS.blue },
    { icon: '🔒', label: 'Безопасность', description: 'Настройки доступа, пароли и разрешения', link: '/demo/social/owner/modules/settings/security', color: COLORS.green },
    { icon: '💾', label: 'Резервные копии', description: 'Управление бэкапами и восстановлением', link: '/demo/social/owner/modules/settings/backups', color: COLORS.purple },
    { icon: '🔄', label: 'Обновления', description: 'Системные обновления и патчи', link: '/demo/social/owner/modules/settings/updates', color: COLORS.orange },
    { icon: '📊', label: 'Мониторинг', description: 'Статистика и производительность', link: '/demo/social/owner/modules/settings/monitoring', color: COLORS.cyan },
    { icon: '🔧', label: 'Техобслуживание', description: 'Диагностика и оптимизация', link: '/demo/social/owner/modules/settings/maintenance', color: COLORS.warning },
  ];

  const navigateStub = useNavigationStub();

  return (
    <BentoCard className="p-4 sm:p-6 h-full" glowColor={COLORS.info} enableMagnetism={true} colSpan={2}>
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-white text-sm sm:text-base">Быстрый доступ</h3>
          <span className="text-white/60 text-xs">{actions.length} действий</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-grow">
          {actions.map((action, index) => (
            <motion.div 
              key={action.label}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group h-full cursor-pointer"
              whileHover={{ scale: 1.02, x: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigateStub(action.link)}
            >
              <div className="flex items-start gap-3 h-full">
                <motion.div 
                  className="text-2xl flex-shrink-0 mt-1"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  {action.icon}
                </motion.div>
                <div className="flex-grow min-w-0">
                  <div className="text-white/80 text-sm font-medium truncate mb-1">{action.label}</div>
                  <div className="text-white/60 text-xs line-clamp-2 leading-relaxed">{action.description}</div>
                </div>
                <motion.span
                  className="text-white/60 group-hover:text-white transition-colors flex-shrink-0 mt-1"
                  whileHover={{ x: 2 }}
                >
                  →
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button 
            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20 text-sm backdrop-blur-lg"
            onClick={() => navigateStub('/demo/social/owner/modules')}
          >
            ← Модули
          </button>
          <button 
            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20 text-sm backdrop-blur-lg"
            onClick={() => navigateStub('/demo/social/owner')}
          >
            ← Панель управления
          </button>
        </motion.div>
      </div>
    </BentoCard>
  );
});

QuickActionsWidget.displayName = 'QuickActionsWidget';

// Улучшенный TimeRangeSelector
const TimeRangeSelector = React.memo(({ 
  selectedRange, 
  onRangeChange 
}: { 
  selectedRange: string; 
  onRangeChange: (range: string) => void;
}) => {
  return (
    <motion.div 
      className="flex gap-1 p-1 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {timeRanges.map((range) => (
        <motion.button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex-1 min-w-0 backdrop-blur-lg ${
            selectedRange === range.value
              ? 'bg-white/20 text-white shadow-lg border border-white/30'
              : 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <span className="truncate">{range.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
});

TimeRangeSelector.displayName = 'TimeRangeSelector';

// Улучшенный FilterSelector
const FilterSelector = React.memo(({ 
  selectedFilter, 
  onFilterChange 
}: { 
  selectedFilter: string; 
  onFilterChange: (filter: string) => void;
}) => {
  return (
    <motion.div 
      className="flex flex-wrap gap-2"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {filterOptions.map((filter) => (
        <motion.button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-lg border flex items-center ${
            selectedFilter === filter.value
              ? 'bg-white/20 text-white border-white/40 shadow-lg'
              : 'text-white/60 hover:text-white border-white/20 hover:border-white/30 bg-white/10'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <span className="truncate">{filter.label}</span>
          {filter.count && (
            <motion.span 
              className="ml-2 px-1.5 py-0.5 rounded-full bg-white/20 text-xs flex-shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              {formatNumber(filter.count)}
            </motion.span>
          )}
        </motion.button>
      ))}
    </motion.div>
  );
});

FilterSelector.displayName = 'FilterSelector';

// Основной компонент страницы с улучшенной адаптивностью
export default function SettingsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<SettingsMetric | null>(null);
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleTimeRangeChange = useCallback((range: string) => {
    setSelectedTimeRange(range);
  }, []);

  const handleFilterChange = useCallback((filter: string) => {
    setSelectedFilter(filter);
  }, []);

  const toggleFilters = useCallback(() => {
    setIsFilterOpen(prev => !prev);
  }, []);

  const filteredMetrics = useMemo(() => {
    if (!searchQuery) return settingsMetrics;
    return settingsMetrics.filter(metric =>
      metric.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      metric.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleMetricClick = (metric: SettingsMetric) => {
    setSelectedMetric(metric);
    setIsMetricModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <motion.div
          className="text-white text-2xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Загрузка настроек...
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
        >
          <BentoCard className="p-4 sm:p-6 lg:p-8" enableMagnetism={false}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
              <div className="flex-grow min-w-0">
                <motion.h1 
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Настройки системы
                </motion.h1>
                <motion.p 
                  className="text-white/60 text-sm sm:text-base lg:text-lg max-w-3xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Управление системными параметрами, настройками безопасности, модулями и производительностью платформы.
                </motion.p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <TimeRangeSelector 
                  selectedRange={selectedTimeRange}
                  onRangeChange={handleTimeRangeChange}
                />
                
                <motion.button
                  onClick={toggleFilters}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2 backdrop-blur-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span>Фильтры</span>
                  <motion.span
                    animate={{ rotate: isFilterOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    ▼
                  </motion.span>
                </motion.button>
              </div>
            </div>

            {/* Expandable Filters */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-white/10 overflow-hidden"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <FilterSelector 
                    selectedFilter={selectedFilter}
                    onFilterChange={handleFilterChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </BentoCard>
        </motion.section>

        {/* Overview Metrics */}
        <motion.section 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h2 
            className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Статистика системы
          </motion.h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4">
            {filteredMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index, type: "spring", stiffness: 200 }}
                layout
              >
                <MetricCard metric={metric} onClick={() => handleMetricClick(metric)} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Charts Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-8 gap-4 sm:gap-6 mb-6 sm:mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Первая строка */}
          <div className="md:col-span-2 xl:col-span-4">
            <SystemLoadChartWidget />
          </div>
          <div className="md:col-span-2 xl:col-span-4">
            <StorageUsageWidget />
          </div>
          
          {/* Вторая строка */}
          <div className="md:col-span-2 xl:col-span-4">
            <SystemModulesWidget />
          </div>
          <div className="md:col-span-2 xl:col-span-4">
            <SettingsCategoriesWidget />
          </div>
          
          {/* Третья строка */}
          <div className="md:col-span-2 xl:col-span-4">
            <SystemAlertsWidget />
          </div>
          <div className="md:col-span-2 xl:col-span-4">
            <QuickActionsWidget />
          </div>
        </motion.div>

        {/* Additional Insights */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <BentoCard className="p-6" glowColor={COLORS.gray} colSpan={2} enableMagnetism={false}>
            <div className="text-center">
              <h3 className="font-semibold text-white mb-2 text-lg">Нужны расширенные настройки?</h3>
              <p className="text-white/60 mb-4 text-sm max-w-2xl mx-auto">
                Используйте профессиональные инструменты для тонкой настройки системы и оптимизации производительности
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white transition-all duration-300 text-sm font-medium flex-1 sm:flex-none backdrop-blur-lg"
                >
                  Расширенные настройки
                </button>
                <button 
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white/80 transition-all duration-300 text-sm font-medium flex-1 sm:flex-none backdrop-blur-lg"
                >
                  API и интеграции
                </button>
              </div>
            </div>
          </BentoCard>
        </motion.section>
      </main>

      {/* Модальное окно для деталей метрики */}
      <MetricDetailsModal 
        metric={selectedMetric}
        isOpen={isMetricModalOpen}
        onClose={() => setIsMetricModalOpen(false)}
      />
    </div>
  );
}