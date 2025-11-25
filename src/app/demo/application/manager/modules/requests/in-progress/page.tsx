'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
  violet: '139, 92, 246',
  fuchsia: '217, 70, 239',
  sky: '14, 165, 233',
  lime: '132, 204, 22',
  pink: '236, 72, 153',
  yellow: '234, 179, 8'
} as const;

// Типы данных для заявок
interface Application {
  id: string;
  service: string;
  category: 'autoservice' | 'delivery' | 'medical' | 'client' | 'social' | 'transport';
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  scheduledDate?: string;
  client: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  provider: {
    name: string;
    rating: number;
    contacts: string;
    image?: string;
    reviewsCount: number;
  };
  description: string;
  price?: string;
  estimatedDuration?: string;
  address?: string;
  notes?: string;
  attachments?: string[];
  rating?: number;
  review?: string;
  progress?: number;
  steps?: { name: string; completed: boolean; date?: string }[];
  managerNotes?: string;
  assignedManager?: string;
  startDate?: string;
  expectedCompletion?: string;
  currentStage?: string;
  delays?: { reason: string; duration: string; resolved: boolean }[];
}

// Данные заявок в работе
const inProgressApplications: Application[] = [
  {
    id: 'APP-2024-001',
    service: 'Замена масла и фильтров',
    category: 'autoservice',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '15 дек 2024, 10:30',
    updatedAt: '18 дек 2024, 14:20',
    scheduledDate: '15 дек 2024, 11:00',
    startDate: '15 дек 2024, 11:15',
    expectedCompletion: '18 дек 2024, 17:00',
    client: {
      name: 'Иванов Алексей',
      phone: '+7 (999) 111-22-33',
      email: 'alexey@mail.ru'
    },
    provider: {
      name: 'Автоцентр "Премиум Сервис"',
      rating: 4.9,
      contacts: '+7 (999) 123-45-67',
      reviewsCount: 127,
      image: '🏢'
    },
    description: 'Плановое ТО - замена моторного масла, масляного и воздушного фильтров. Клиент жаловался на шум при работе двигателя.',
    price: '12 500 ₽',
    estimatedDuration: '2 часа',
    address: 'ул. Ленина, 123, автоцентр "Премиум Сервис"',
    notes: 'Клиент просил предупредить за 30 минут до готовности',
    managerNotes: 'Клиент VIP-статуса. Требуется особое внимание. Возможна дополнительная продажа услуг.',
    assignedManager: 'Петрова Мария',
    progress: 75,
    currentStage: 'Контроль качества',
    steps: [
      { name: 'Принятие заявки', completed: true, date: '15 дек, 10:30' },
      { name: 'Подтверждение', completed: true, date: '15 дек, 10:45' },
      { name: 'Автомобиль принят', completed: true, date: '15 дек, 11:00' },
      { name: 'Работы выполняются', completed: true, date: '15 дек, 11:30' },
      { name: 'Контроль качества', completed: false },
      { name: 'Завершено', completed: false }
    ],
    delays: [
      { reason: 'Ожидание запчастей', duration: '2 часа', resolved: true }
    ]
  },
  {
    id: 'APP-2024-010',
    service: 'Ремонт ноутбука',
    category: 'client',
    status: 'in_progress',
    priority: 'high',
    createdAt: '16 дек 2024, 14:00',
    updatedAt: '18 дек 2024, 11:30',
    scheduledDate: '16 дек 2024, 15:00',
    startDate: '16 дек 2024, 15:30',
    expectedCompletion: '19 дек 2024, 14:00',
    client: {
      name: 'Федоров Сергей',
      phone: '+7 (999) 555-66-77',
      email: 'sergey@mail.ru'
    },
    provider: {
      name: 'Сервисный центр "ТехноПрофи"',
      rating: 4.8,
      contacts: '+7 (999) 333-22-11',
      reviewsCount: 142,
      image: '💻'
    },
    description: 'Замена матрицы экрана и чистка системы охлаждения. Ноутбук ASUS ROG.',
    price: '7 800 ₽',
    estimatedDuration: '2 дня',
    address: 'пр. Космонавтов, 67, ТЦ "Электроник", 3 этаж',
    managerNotes: 'Клиент работает удаленно. Срочно нужен ноутбук.',
    assignedManager: 'Петрова Мария',
    progress: 60,
    currentStage: 'Ремонт',
    steps: [
      { name: 'Диагностика', completed: true, date: '16 дек, 15:00' },
      { name: 'Заказ деталей', completed: true, date: '16 дек, 16:30' },
      { name: 'Ремонт', completed: true, date: '17 дек, 10:00' },
      { name: 'Тестирование', completed: false },
      { name: 'Готово', completed: false }
    ]
  },
  {
    id: 'APP-2024-009',
    service: 'Комплексная уборка квартиры',
    category: 'client',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '17 дек 2024, 19:30',
    updatedAt: '18 дек 2024, 12:15',
    scheduledDate: '19 дек 2024, 10:00',
    startDate: '19 дек 2024, 10:30',
    expectedCompletion: '19 дек 2024, 15:30',
    client: {
      name: 'Николаева Екатерина',
      phone: '+7 (999) 666-77-88',
      email: 'ekaterina@mail.ru'
    },
    provider: {
      name: 'Клининговая служба "Чистота"',
      rating: 4.7,
      contacts: '+7 (999) 777-66-55',
      reviewsCount: 203,
      image: '🧹'
    },
    description: 'Генеральная уборка 3-комнатной квартиры после ремонта. Площадь 85 м².',
    price: '8 500 ₽',
    estimatedDuration: '5 часов',
    address: 'ул. Новая, 33, кв. 124',
    managerNotes: 'Клиентка переехала в новую квартиру. Возможен повторный заказ.',
    assignedManager: 'Сидоров Иван',
    progress: 30,
    currentStage: 'Уборка комнат'
  },
  {
    id: 'APP-2024-023',
    service: 'Установка кондиционера',
    category: 'client',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '18 дек 2024, 10:10',
    updatedAt: '18 дек 2024, 15:20',
    scheduledDate: '18 дек 2024, 11:00',
    startDate: '18 дек 2024, 11:45',
    expectedCompletion: '18 дек 2024, 16:00',
    client: {
      name: 'Кузнецов Сергей',
      phone: '+7 (999) 333-44-55',
      email: 'sergey@mail.ru'
    },
    provider: {
      name: 'КлиматПрофи',
      rating: 4.8,
      contacts: '+7 (495) 888-99-00',
      reviewsCount: 234,
      image: '❄️'
    },
    description: 'Установка сплит-системы Mitsubishi в гостиную. Нужен выезд для замера.',
    price: '8 000 ₽',
    estimatedDuration: '3 часа',
    address: 'пр. Строителей, 67, кв. 89',
    managerNotes: 'Клиент готов купить кондиционер через нас. Дополнительная прибыль.',
    assignedManager: 'Сидоров Иван',
    progress: 45,
    currentStage: 'Монтаж внешнего блока',
    delays: [
      { reason: 'Сложности с креплением к фасаду', duration: '45 минут', resolved: false }
    ]
  },
  {
    id: 'APP-2024-024',
    service: 'Разработка мобильного приложения',
    category: 'client',
    status: 'in_progress',
    priority: 'high',
    createdAt: '10 дек 2024, 09:00',
    updatedAt: '18 дек 2024, 16:30',
    scheduledDate: '15 дек 2024, 10:00',
    startDate: '15 дек 2024, 10:30',
    expectedCompletion: '25 дек 2024, 18:00',
    client: {
      name: 'ООО "ТехноИнновации"',
      phone: '+7 (495) 777-88-99',
      email: 'tech@innovations.ru'
    },
    provider: {
      name: 'Студия "ДигиталПро"',
      rating: 4.9,
      contacts: '+7 (495) 123-55-77',
      reviewsCount: 89,
      image: '📱'
    },
    description: 'Разработка мобильного приложения для iOS и Android. 25 экранов, интеграция с платежной системой.',
    price: '350 000 ₽',
    estimatedDuration: '3 недели',
    address: 'ул. IT-парк, 15, офис 401',
    managerNotes: 'Крупный корпоративный заказ. Требуется ежедневный отчет о прогрессе.',
    assignedManager: 'Петрова Мария',
    progress: 65,
    currentStage: 'Тестирование функционала'
  },
  {
    id: 'APP-2024-025',
    service: 'Доставка срочных документов',
    category: 'delivery',
    status: 'in_progress',
    priority: 'urgent',
    createdAt: '18 дек 2024, 15:30',
    updatedAt: '18 дек 2024, 16:45',
    scheduledDate: '18 дек 2024, 16:00',
    startDate: '18 дек 2024, 16:15',
    expectedCompletion: '18 дек 2024, 17:30',
    client: {
      name: 'ООО "ЮрКонсалт"',
      phone: '+7 (495) 444-55-66',
      email: 'law@consult.ru'
    },
    provider: {
      name: 'Курьерская служба "Экспресс"',
      rating: 4.7,
      contacts: '+7 (999) 765-43-21',
      reviewsCount: 89,
      image: '🚚'
    },
    description: 'Срочная доставка юридических документов в арбитражный суд. До 18:00!',
    price: '1 200 ₽',
    estimatedDuration: '1.5 часа',
    address: 'ул. Юридическая, 45 → ул. Судовая, 12',
    managerNotes: 'КРИТИЧЕСКИ ВАЖНО! Просрочка = штраф 50 000₽ для клиента.',
    assignedManager: 'Сидоров Иван',
    progress: 40,
    currentStage: 'В пути к суду'
  },
  {
    id: 'APP-2024-026',
    service: 'Ремонт стиральной машины',
    category: 'client',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '17 дек 2024, 14:20',
    updatedAt: '18 дек 2024, 13:10',
    scheduledDate: '18 дек 2024, 11:00',
    startDate: '18 дек 2024, 11:30',
    expectedCompletion: '18 дек 2024, 14:00',
    client: {
      name: 'Воронова Ирина',
      phone: '+7 (999) 888-77-66',
      email: 'irina@mail.ru'
    },
    provider: {
      name: 'РемонтБытТехники',
      rating: 4.5,
      contacts: '+7 (999) 222-33-44',
      reviewsCount: 78,
      image: '🔧'
    },
    description: 'Замена помпы и ремня стиральной машины Bosch. Не сливает воду.',
    price: '4 200 ₽',
    estimatedDuration: '2.5 часа',
    address: 'ул. Мира, 89, кв. 34',
    managerNotes: 'Клиентка с маленьким ребенком. Срочно нужна стиральная машина.',
    assignedManager: 'Петрова Мария',
    progress: 80,
    currentStage: 'Сборка и проверка'
  }
];

// Утилиты
const getCategoryColor = (category: Application['category']) => {
  return {
    autoservice: COLORS.blue,
    delivery: COLORS.orange,
    medical: COLORS.emerald,
    client: COLORS.purple,
    social: COLORS.indigo,
    transport: COLORS.cyan
  }[category];
};

const getCategoryText = (category: Application['category']) => {
  return {
    autoservice: '🚗 Автосервис',
    delivery: '📦 Доставка',
    medical: '🏥 Медицина',
    client: '🛍️ Клиентские услуги',
    social: '👥 Социальные услуги',
    transport: '🚌 Транспорт'
  }[category];
};

const getStatusColor = (status: Application['status']) => {
  return {
    pending: COLORS.amber,
    confirmed: COLORS.blue,
    in_progress: COLORS.indigo,
    completed: COLORS.emerald,
    cancelled: COLORS.gray,
    rejected: COLORS.rose
  }[status];
};

const getStatusText = (status: Application['status']) => {
  return {
    pending: 'Ожидание',
    confirmed: 'Подтверждена',
    in_progress: 'В работе',
    completed: 'Завершена',
    cancelled: 'Отменена',
    rejected: 'Отклонена'
  }[status];
};

const getPriorityColor = (priority: Application['priority']) => {
  return {
    low: COLORS.gray,
    medium: COLORS.blue,
    high: COLORS.orange,
    urgent: COLORS.rose
  }[priority];
};

const getPriorityText = (priority: Application['priority']) => {
  return {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    urgent: 'Срочный'
  }[priority];
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Компонент для отображения времени до завершения
const TimeRemaining = ({ expectedCompletion }: { expectedCompletion?: string }) => {
  if (!expectedCompletion) return null;

  const now = new Date();
  const completion = new Date(expectedCompletion.replace('дек', 'dec'));
  const diffMs = completion.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffMs < 0) {
    return (
      <div className="flex items-center gap-1 text-xs text-rose-400">
        <span>⏰</span>
        <span>Просрочено: {Math.abs(diffHours)}ч {Math.abs(diffMinutes)}м</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-xs text-emerald-400">
      <span>⏰</span>
      <span>Осталось: {diffHours}ч {diffMinutes}м</span>
    </div>
  );
};

// Bento Card компонент
const BentoCard = ({ 
  children, 
  className = '', 
  glowColor = COLORS.blue,
  onClick,
  gradient = false,
  hoverable = true
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  gradient?: boolean;
  hoverable?: boolean;
}) => {
  const gradientClass = gradient ? 'bg-gradient-to-br from-white/10 to-white/5' : 'bg-white/5';

  return (
    <motion.div
      className={`
        relative overflow-hidden 
        rounded-2xl border border-white/10 
        ${gradientClass} backdrop-blur-lg 
        transition-all duration-300 
        ${hoverable ? 'hover:border-white/20 hover:bg-white/10' : ''}
        w-full max-w-full
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        '--glow-color': glowColor,
      } as React.CSSProperties}
      onClick={onClick}
      whileHover={hoverable ? { scale: 1.02, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};

// Modal Component
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md'
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 w-full ${sizeClasses[size]} border border-white/10 max-h-[90vh] overflow-y-auto shadow-2xl`}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            {title && <h3 className="text-white font-bold text-xl">{title}</h3>}
            <button
              className="text-white/60 hover:text-white transition-colors text-2xl p-1 rounded-full hover:bg-white/10 w-8 h-8 flex items-center justify-center"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Компонент Progress Bar
const ProgressBar = ({ progress, color = COLORS.blue }: { progress: number; color?: string }) => (
  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
    <motion.div 
      className="h-full rounded-full"
      style={{ 
        backgroundColor: `rgb(${color})`,
        width: `${progress}%`
      }}
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
  </div>
);

// Компонент Steps Timeline
const StepsTimeline = ({ steps, currentProgress }: { steps: { name: string; completed: boolean; date?: string }[], currentProgress: number }) => (
  <div className="space-y-4">
    {steps.map((step, index) => {
      const progressPerStep = 100 / steps.length;
      const stepProgress = Math.min(Math.max((currentProgress - index * progressPerStep) / progressPerStep * 100, 0), 100);
      
      return (
        <div key={index} className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step.completed 
                ? 'bg-emerald-500 text-white' 
                : currentProgress >= (index + 1) * progressPerStep
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-white/40'
            }`}>
              {step.completed ? '✓' : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-0.5 h-8 mt-1 ${
                step.completed ? 'bg-emerald-500' : 
                currentProgress >= (index + 1) * progressPerStep ? 'bg-blue-500' : 'bg-white/10'
              }`} />
            )}
          </div>
          <div className="flex-1 pb-4">
            <div className={`font-medium ${
              step.completed ? 'text-white' : 
              currentProgress >= (index + 1) * progressPerStep ? 'text-blue-300' : 'text-white/60'
            }`}>
              {step.name}
            </div>
            {step.date && (
              <div className="text-white/40 text-sm mt-1">{step.date}</div>
            )}
            {!step.completed && currentProgress >= (index + 1) * progressPerStep && (
              <div className="w-full bg-white/10 rounded-full h-1 mt-2 overflow-hidden">
                <motion.div 
                  className="h-full rounded-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${stepProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

// Компонент карточки заявки в работе
const InProgressApplicationCard = ({ application, onClick }: { application: Application; onClick?: () => void }) => {
  const categoryColor = getCategoryColor(application.category);
  const priorityColor = getPriorityColor(application.priority);
  const statusColor = getStatusColor(application.status);

  return (
    <BentoCard className="p-4 cursor-pointer h-full" glowColor={priorityColor} onClick={onClick} gradient>
      <div className="flex flex-col h-full">
        {/* Заголовок и статусы */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span 
                className="px-2 py-1 rounded-full text-xs border font-medium whitespace-nowrap"
                style={{
                  backgroundColor: `rgba(${priorityColor}, 0.2)`,
                  color: `rgb(${priorityColor})`,
                  borderColor: `rgba(${priorityColor}, 0.3)`
                }}
              >
                {getPriorityText(application.priority)}
              </span>
              <span 
                className="px-2 py-1 rounded-full text-xs border font-medium whitespace-nowrap"
                style={{
                  backgroundColor: `rgba(${categoryColor}, 0.2)`,
                  color: `rgb(${categoryColor})`,
                  borderColor: `rgba(${categoryColor}, 0.3)`
                }}
              >
                {getCategoryText(application.category)}
              </span>
            </div>
            <h3 className="text-white font-semibold text-sm mb-1 truncate">{application.service}</h3>
            <div className="text-white/60 text-xs line-clamp-2 mb-2">{application.description}</div>
          </div>
        </div>

        {/* Прогресс и текущий этап */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-white/60 mb-1">
            <span>Прогресс выполнения</span>
            <span>{application.progress}%</span>
          </div>
          <ProgressBar progress={application.progress || 0} color={statusColor} />
          {application.currentStage && (
            <div className="text-white/80 text-xs mt-2 flex items-center gap-2">
              <span className="text-blue-400">▶</span>
              <span>Текущий этап: {application.currentStage}</span>
            </div>
          )}
        </div>

        {/* Клиент и время */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="text-white/60">
            <div className="font-medium text-white">👤 {application.client.name}</div>
            <div>{application.client.phone}</div>
          </div>
          <div className="text-right text-white/60">
            <TimeRemaining expectedCompletion={application.expectedCompletion} />
            <div>Начало: {application.startDate?.split(',')[0]}</div>
          </div>
        </div>

        {/* Цена и исполнитель */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 text-sm">
            {application.price && (
              <div className="text-white font-bold">{application.price}</div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-amber-400">⭐ {application.provider.rating}</span>
            <span className="text-white/40">({application.provider.reviewsCount})</span>
          </div>
        </div>

        {/* Исполнитель и менеджер */}
        <div className="flex items-center justify-between text-xs text-white/60 mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-lg">{application.provider.image}</span>
            <span className="truncate max-w-[100px]">{application.provider.name}</span>
          </div>
          <div className="text-right flex-shrink-0">
            <div>Менеджер:</div>
            <div className="font-medium text-white">{application.assignedManager}</div>
          </div>
        </div>

        {/* Задержки */}
        {application.delays && application.delays.some(delay => !delay.resolved) && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-amber-500/20 text-xs text-amber-400">
            <span>⚠️</span>
            <span>Есть незавершенные задержки</span>
          </div>
        )}
      </div>
    </BentoCard>
  );
};

// Компонент KPI для заявок в работе
const InProgressKPI = ({ title, value, change, description, icon, color, trend, onClick }: {
  title: string;
  value: string;
  change?: string;
  description: string;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  onClick?: () => void;
}) => {
  const trendIcon = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
  const trendColor = trend === 'up' ? COLORS.emerald : trend === 'down' ? COLORS.rose : COLORS.gray;
  
  return (
    <BentoCard className="p-4 cursor-pointer" glowColor={color} onClick={onClick} gradient>
      <div className="flex items-start justify-between mb-3">
        <div className="text-xl font-bold text-white leading-tight">
          {value}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-lg">{icon}</div>
          {change && trend && (
            <div className="flex items-center gap-1 text-xs" style={{ color: `rgb(${trendColor})` }}>
              <span>{trendIcon}</span>
              <span>{change}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-sm font-medium">{title}</span>
        </div>
        
        <div className="text-white/60 text-sm">
          {description}
        </div>
      </div>
    </BentoCard>
  );
};

// Quick Actions для заявок в работе
const InProgressQuickActions = ({ 
  onUpdateProgress, 
  onReportDelay,
  onCompleteBatch 
}: { 
  onUpdateProgress: () => void; 
  onReportDelay: () => void;
  onCompleteBatch: () => void;
}) => (
  <BentoCard className="p-4" glowColor={COLORS.indigo} gradient>
    <h3 className="text-white font-semibold mb-3">Управление процессом</h3>
    <div className="grid grid-cols-1 gap-2">
      <motion.button 
        className="p-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 text-sm transition-colors text-center flex items-center justify-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onUpdateProgress}
      >
        📊 Обновить прогресс
      </motion.button>
      <motion.button 
        className="p-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-sm transition-colors text-center flex items-center justify-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReportDelay}
      >
        ⚠️ Сообщить о задержке
      </motion.button>
      <motion.button 
        className="p-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-sm transition-colors text-center flex items-center justify-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCompleteBatch}
      >
        ✅ Завершить группу
      </motion.button>
    </div>
  </BentoCard>
);

// Компонент фильтров для заявок в работе
const InProgressFilters = ({ 
  activePriority, 
  setActivePriority, 
  searchQuery, 
  setSearchQuery,
  viewMode,
  setViewMode,
  priorityCounts 
}: {
  activePriority: string;
  setActivePriority: (priority: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  priorityCounts: any;
}) => (
  <div className="flex flex-col lg:flex-row gap-4 mb-4">
    {/* Фильтры по приоритету */}
    <div className="flex flex-wrap gap-2 flex-1">
      {[
        { id: 'all', name: 'Все', count: priorityCounts.all, color: 'gray' },
        { id: 'urgent', name: '🚨 Срочные', count: priorityCounts.urgent, color: 'rose' },
        { id: 'high', name: '🔴 Высокий', count: priorityCounts.high, color: 'orange' },
        { id: 'medium', name: '🟡 Средний', count: priorityCounts.medium, color: 'blue' },
        { id: 'low', name: '🟢 Низкий', count: priorityCounts.low, color: 'gray' }
      ].map((priority) => (
        <motion.button
          key={priority.id}
          onClick={() => setActivePriority(priority.id)}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            activePriority === priority.id 
              ? `bg-${priority.color}-500 text-white shadow-lg` 
              : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
          }`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{priority.name}</span>
          <span className={`px-1.5 py-0.5 rounded-full text-xs ${
            activePriority === priority.id ? 'bg-white/20' : 'bg-white/10'
          }`}>
            {priority.count}
          </span>
        </motion.button>
      ))}
    </div>
    
    {/* View Mode and Search */}
    <div className="flex gap-3">
      {/* View Mode Toggle */}
      <div className="flex bg-white/10 rounded-xl p-1">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
          }`}
        >
          ▦
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
          }`}
        >
          ☰
        </button>
      </div>
      
      {/* Поиск */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по активным заявкам..."
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 w-64"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
          >
            ×
          </button>
        )}
      </div>
    </div>
  </div>
);

// Основной компонент страницы заявок в работе
export default function InProgressRequestsPage() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [activePriority, setActivePriority] = useState<'all' | Application['priority']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [managerNotes, setManagerNotes] = useState('');
  const [progressUpdate, setProgressUpdate] = useState(0);

  // Статистика для заявок в работе
  const totalInProgress = inProgressApplications.length;
  const urgentApplications = inProgressApplications.filter(app => app.priority === 'urgent').length;
  const delayedApplications = inProgressApplications.filter(app => 
    app.delays && app.delays.some(delay => !delay.resolved)
  ).length;
  const nearCompletion = inProgressApplications.filter(app => (app.progress || 0) >= 80).length;
  const averageProgress = Math.round(
    inProgressApplications.reduce((sum, app) => sum + (app.progress || 0), 0) / totalInProgress
  );

  // KPI данные для заявок в работе
  const inProgressKPIs = [
    { 
      title: 'В работе', 
      value: totalInProgress.toString(), 
      change: '+2', 
      description: 'активных заявок', 
      icon: '⚡', 
      color: COLORS.indigo,
      trend: 'up' as const
    },
    { 
      title: 'Срочные', 
      value: urgentApplications.toString(), 
      change: '+1', 
      description: 'требуют контроля', 
      icon: '🚨', 
      color: COLORS.rose,
      trend: 'up' as const
    },
    { 
      title: 'С задержками', 
      value: delayedApplications.toString(), 
      description: 'проблемные', 
      icon: '⚠️', 
      color: COLORS.amber,
      trend: 'stable' as const
    },
    { 
      title: 'Средний прогресс', 
      value: `${averageProgress}%`, 
      description: 'по всем заявкам', 
      icon: '📊', 
      color: COLORS.blue,
      trend: 'up' as const
    }
  ];

  // Фильтрация заявок
  const filteredApplications = inProgressApplications.filter(application =>
    (activePriority === 'all' || application.priority === activePriority) &&
    (application.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
     application.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
     application.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     application.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Группировка по приоритетам для фильтров
  const priorityCounts = {
    all: inProgressApplications.length,
    urgent: inProgressApplications.filter(app => app.priority === 'urgent').length,
    high: inProgressApplications.filter(app => app.priority === 'high').length,
    medium: inProgressApplications.filter(app => app.priority === 'medium').length,
    low: inProgressApplications.filter(app => app.priority === 'low').length
  };

  useEffect(() => {
    setIsClient(true);
    
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(formatTime(now));
      setCurrentDate(formatDate(now));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setProgressUpdate(application.progress || 0);
    setManagerNotes(application.managerNotes || '');
    setIsModalOpen(true);
  };

  const handleUpdateProgress = () => {
    // Логика обновления прогресса
    alert('Обновление прогресса заявок');
  };

  const handleReportDelay = () => {
    // Логика отчетов о задержках
    alert('Отчет о задержках');
  };

  const handleCompleteBatch = () => {
    // Логика группового завершения
    alert('Групповое завершение заявок');
  };

  const handleSaveProgress = () => {
    if (selectedApplication) {
      // Логика сохранения прогресса
      alert(`Прогресс обновлен до ${progressUpdate}%`);
    }
  };

  const handleCompleteApplication = () => {
    if (selectedApplication) {
      alert('Заявка завершена и передана на закрытие');
      setIsModalOpen(false);
    }
  };

  const handleAddDelay = () => {
    if (selectedApplication) {
      alert('Добавлена запись о задержке');
    }
  };

  // Если не на клиенте, не рендерим контент, зависящий от времени
  if (!isClient) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded-xl mb-6 w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-64 bg-white/5 rounded-2xl"></div>
              <div className="space-y-6">
                <div className="h-32 bg-white/5 rounded-2xl"></div>
                <div className="h-32 bg-white/5 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BentoCard className="p-6" glowColor={COLORS.indigo} gradient>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">⚡ Заявки в работе</h1>
                <p className="text-white/60 text-lg mb-4">
                  Активные заявки в процессе выполнения. Контролируйте прогресс, управляйте задержками и обеспечивайте своевременное завершение.
                </p>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-400" />
                    <span>{urgentApplications} срочных</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{delayedApplications} с задержками</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{nearCompletion} близки к завершению</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <motion.button
                  className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📊 Отчет по прогрессу
                </motion.button>
              </div>
            </div>
          </BentoCard>
        </motion.section>

        {/* KPI Section */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Метрики выполнения</h2>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>Обновлено: {currentTime}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {inProgressKPIs.map((kpi, index) => (
              <InProgressKPI key={index} {...kpi} />
            ))}
          </div>
        </motion.section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <InProgressQuickActions 
              onUpdateProgress={handleUpdateProgress}
              onReportDelay={handleReportDelay}
              onCompleteBatch={handleCompleteBatch}
            />
            
            {/* Progress Filter */}
            <BentoCard className="p-4" glowColor={COLORS.blue} gradient>
              <h3 className="text-white font-semibold mb-3">Прогресс</h3>
              <div className="space-y-2">
                {[
                  { id: 'critical', name: '🔴 Критичные', range: '0-30%', count: inProgressApplications.filter(app => (app.progress || 0) <= 30).length },
                  { id: 'normal', name: '🟡 Нормальные', range: '31-70%', count: inProgressApplications.filter(app => (app.progress || 0) > 30 && (app.progress || 0) <= 70).length },
                  { id: 'good', name: '🟢 Хорошие', range: '71-90%', count: inProgressApplications.filter(app => (app.progress || 0) > 70 && (app.progress || 0) <= 90).length },
                  { id: 'excellent', name: '🔵 Отличные', range: '91-100%', count: inProgressApplications.filter(app => (app.progress || 0) > 90).length }
                ].map((progress) => (
                  <button
                    key={progress.id}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors text-sm flex items-center justify-between"
                  >
                    <span>{progress.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-xs">{progress.range}</span>
                      <span className="bg-white/10 px-1.5 py-0.5 rounded text-xs">
                        {progress.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </BentoCard>

            {/* Manager Filter */}
            <BentoCard className="p-4" glowColor={COLORS.purple} gradient>
              <h3 className="text-white font-semibold mb-3">Менеджеры</h3>
              <div className="space-y-2">
                {[
                  { id: 'all', name: '👥 Все менеджеры', count: inProgressApplications.length },
                  { id: 'petrova', name: '👩 Петрова М.', count: inProgressApplications.filter(app => app.assignedManager === 'Петрова Мария').length },
                  { id: 'sidorov', name: '👨 Сидоров И.', count: inProgressApplications.filter(app => app.assignedManager === 'Сидоров Иван').length }
                ].map((manager) => (
                  <button
                    key={manager.id}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors text-sm flex items-center justify-between"
                  >
                    <span>{manager.name}</span>
                    <span className="bg-white/10 px-1.5 py-0.5 rounded text-xs">
                      {manager.count}
                    </span>
                  </button>
                ))}
              </div>
            </BentoCard>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters and Search */}
            <motion.section 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <InProgressFilters
                activePriority={activePriority}
                setActivePriority={setActivePriority}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                viewMode={viewMode}
                setViewMode={setViewMode}
                priorityCounts={priorityCounts}
              />
            </motion.section>

            {/* Applications Grid */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {activePriority === 'all' ? 'Все активные заявки' : `Приоритет: ${getPriorityText(activePriority)}`}
                  <span className="text-white/60 text-lg ml-2">({filteredApplications.length})</span>
                </h2>
                <div className="text-white/60 text-sm">
                  {filteredApplications.length} из {inProgressApplications.length} заявок • Средний прогресс: {averageProgress}%
                </div>
              </div>

              {filteredApplications.length > 0 ? (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-2' 
                    : 'grid-cols-1'
                }`}>
                  {filteredApplications.map((application, index) => (
                    <motion.div
                      key={application.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <InProgressApplicationCard 
                        application={application} 
                        onClick={() => handleViewApplication(application)}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <BentoCard className="p-12 text-center" glowColor={COLORS.gray}>
                  <div className="text-6xl mb-4">⚡</div>
                  <h3 className="text-white font-semibold text-xl mb-2">Нет активных заявок</h3>
                  <p className="text-white/60 mb-4">
                    {searchQuery 
                      ? 'Попробуйте изменить поисковый запрос' 
                      : 'Все заявки завершены или нет заявок с выбранным приоритетом'
                    }
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setActivePriority('all');
                    }}
                    className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors"
                  >
                    Сбросить фильтры
                  </button>
                </BentoCard>
              )}
            </motion.section>
          </div>
        </div>
      </main>

      {/* Модальное окно управления заявкой в работе */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="⚡ Управление выполнением заявки"
        size="lg"
      >
        {selectedApplication && (
          <div className="space-y-6">
            {/* Заголовок и прогресс */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-bold text-2xl">{selectedApplication.service}</h3>
                <p className="text-white/60">{selectedApplication.description}</p>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-2xl">{selectedApplication.price}</div>
                <div 
                  className="px-3 py-1 rounded-full text-sm border font-medium mt-2"
                  style={{
                    backgroundColor: `rgba(${getPriorityColor(selectedApplication.priority)}, 0.2)`,
                    color: `rgb(${getPriorityColor(selectedApplication.priority)})`,
                    borderColor: `rgba(${getPriorityColor(selectedApplication.priority)}, 0.3)`
                  }}
                >
                  {getPriorityText(selectedApplication.priority)}
                </div>
              </div>
            </div>

            {/* Таймер выполнения */}
            {selectedApplication.expectedCompletion && (
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⏰</span>
                    <div>
                      <div className="text-blue-300 font-semibold">Срок выполнения</div>
                      <div className="text-blue-200 text-sm">
                        Ожидается: {selectedApplication.expectedCompletion}
                      </div>
                    </div>
                  </div>
                  <TimeRemaining expectedCompletion={selectedApplication.expectedCompletion} />
                </div>
              </div>
            )}

            {/* Управление прогрессом */}
            <div>
              <h4 className="text-white font-semibold mb-3">📊 Управление прогрессом</h4>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/60">Текущий прогресс</span>
                  <span className="text-white font-bold">{progressUpdate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressUpdate}
                  onChange={(e) => setProgressUpdate(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                />
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => setProgressUpdate(Math.max(0, progressUpdate - 10))}
                    className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-sm"
                  >
                    -10%
                  </button>
                  <button 
                    onClick={() => setProgressUpdate(Math.min(100, progressUpdate + 10))}
                    className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-sm"
                  >
                    +10%
                  </button>
                  <button 
                    onClick={handleSaveProgress}
                    className="flex-1 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors text-sm"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline Steps */}
            {selectedApplication.steps && (
              <div>
                <h4 className="text-white font-semibold mb-4">📋 Этапы выполнения</h4>
                <StepsTimeline 
                  steps={selectedApplication.steps} 
                  currentProgress={progressUpdate}
                />
              </div>
            )}

            {/* Текущий этап */}
            {selectedApplication.currentStage && (
              <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <div className="text-indigo-300 font-semibold">Текущий этап</div>
                    <div className="text-indigo-200">{selectedApplication.currentStage}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Задержки */}
            {selectedApplication.delays && selectedApplication.delays.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-3">⚠️ Задержки выполнения</h4>
                <div className="space-y-2">
                  {selectedApplication.delays.map((delay, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border ${
                        delay.resolved 
                          ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' 
                          : 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{delay.reason}</div>
                          <div className="text-sm opacity-80">Длительность: {delay.duration}</div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          delay.resolved ? 'bg-emerald-500/30' : 'bg-amber-500/30'
                        }`}>
                          {delay.resolved ? 'Решена' : 'Активна'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Заметки менеджера */}
            <div>
              <h4 className="text-white font-semibold mb-3">📝 Заметки менеджера</h4>
              <textarea
                value={managerNotes}
                onChange={(e) => setManagerNotes(e.target.value)}
                placeholder="Добавьте заметки по ходу выполнения..."
                className="w-full h-24 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 resize-none"
              />
            </div>

            {/* Основные действия */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button 
                onClick={handleCompleteApplication}
                className="flex-1 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors font-semibold"
              >
                ✅ Завершить заявку
              </button>
              <button 
                onClick={handleAddDelay}
                className="flex-1 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors font-semibold"
              >
                ⚠️ Добавить задержку
              </button>
              <button className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold">
                📞 Связаться
              </button>
            </div>

            {/* Быстрые действия */}
            <div className="grid grid-cols-2 gap-3">
              <button className="py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 transition-colors text-sm">
                🔄 Обновить этап
              </button>
              <button className="py-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 transition-colors text-sm">
                📋 Чек-лист
              </button>
              <button className="py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 transition-colors text-sm">
                📊 Отчет
              </button>
              <button className="py-2 rounded-lg bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 text-gray-300 transition-colors text-sm">
                ⏰ Перенести срок
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}