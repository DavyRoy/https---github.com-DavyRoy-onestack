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
}

// Расширенные данные заявок для менеджера
const applications: Application[] = [
  // Требуют внимания (высокий приоритет)
  {
    id: 'APP-2024-001',
    service: 'Замена масла и фильтров',
    category: 'autoservice',
    status: 'in_progress',
    priority: 'urgent',
    createdAt: '15 дек 2024, 10:30',
    updatedAt: '15 дек 2024, 14:20',
    scheduledDate: '15 дек 2024, 11:00',
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
    steps: [
      { name: 'Принятие заявки', completed: true, date: '15 дек, 10:30' },
      { name: 'Подтверждение', completed: true, date: '15 дек, 10:45' },
      { name: 'Автомобиль принят', completed: true, date: '15 дек, 11:00' },
      { name: 'Работы выполняются', completed: true, date: '15 дек, 11:30' },
      { name: 'Контроль качества', completed: false },
      { name: 'Завершено', completed: false }
    ]
  },
  {
    id: 'APP-2024-002',
    service: 'Доставка документов',
    category: 'delivery',
    status: 'confirmed',
    priority: 'high',
    createdAt: '16 дек 2024, 09:15',
    updatedAt: '16 дек 2024, 09:45',
    scheduledDate: '16 дек 2024, 10:30',
    client: {
      name: 'ООО "БизнесСтандарт"',
      phone: '+7 (495) 222-33-44',
      email: 'office@business.ru'
    },
    provider: {
      name: 'Курьерская служба "Экспресс"',
      rating: 4.7,
      contacts: '+7 (999) 765-43-21',
      reviewsCount: 89,
      image: '🚚'
    },
    description: 'Срочная доставка документов в бизнес-центр "Стандарт". Документы для подписания договора.',
    price: '850 ₽',
    estimatedDuration: '1 час',
    address: 'ул. Пушкина, 45, офис 304',
    managerNotes: 'Корпоративный клиент. Возможен долгосрочный контракт.',
    assignedManager: 'Сидоров Иван',
    progress: 40,
    steps: [
      { name: 'Заказ принят', completed: true, date: '16 дек, 09:15' },
      { name: 'Курьер назначен', completed: true, date: '16 дек, 09:30' },
      { name: 'В пути', completed: false },
      { name: 'Доставлено', completed: false }
    ]
  },

  // Новые заявки
  {
    id: 'APP-2024-003',
    service: 'Консультация терапевта',
    category: 'medical',
    status: 'pending',
    priority: 'high',
    createdAt: '17 дек 2024, 14:20',
    updatedAt: '17 дек 2024, 14:20',
    scheduledDate: '18 дек 2024, 16:00',
    client: {
      name: 'Смирнова Ольга',
      phone: '+7 (999) 333-44-55',
      email: 'olga@mail.ru'
    },
    provider: {
      name: 'Клиника "Здоровье"',
      rating: 4.8,
      contacts: '+7 (495) 123-45-67',
      reviewsCount: 234,
      image: '🏥'
    },
    description: 'Плановый осмотр и консультация по результатам анализов. Клиент жалуется на головные боли.',
    price: '2 500 ₽',
    estimatedDuration: '45 минут',
    address: 'пр. Мира, 89, клиника "Здоровье", каб. 205',
    managerNotes: 'Требуется срочно назначить менеджера. Клиент волнуется о результатах анализов.',
    progress: 20,
    steps: [
      { name: 'Запись оформлена', completed: true, date: '17 дек, 14:20' },
      { name: 'Ожидание подтверждения', completed: false },
      { name: 'Подтверждено', completed: false },
      { name: 'Консультация', completed: false }
    ]
  },
  {
    id: 'APP-2024-008',
    service: 'Курсы английского языка',
    category: 'client',
    status: 'pending',
    priority: 'medium',
    createdAt: '18 дек 2024, 09:00',
    updatedAt: '18 дек 2024, 09:00',
    client: {
      name: 'Козлов Дмитрий',
      phone: '+7 (999) 444-55-66',
      email: 'dmitry@mail.ru'
    },
    provider: {
      name: 'Языковой центр "Лингва"',
      rating: 4.9,
      contacts: '+7 (495) 444-55-66',
      reviewsCount: 189,
      image: '📚'
    },
    description: 'Индивидуальные занятия английским языком для начинающих. Цель - подготовка к командировке.',
    price: '1 200 ₽/час',
    estimatedDuration: '8 занятий',
    managerNotes: 'Клиент интересуется бизнес-английским. Возможна продажа пакета из 16 занятий.'
  },

  // В работе
  {
    id: 'APP-2024-010',
    service: 'Ремонт ноутбука',
    category: 'client',
    status: 'in_progress',
    priority: 'high',
    createdAt: '16 дек 2024, 14:00',
    updatedAt: '17 дек 2024, 11:30',
    scheduledDate: '16 дек 2024, 15:00',
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
    updatedAt: '17 дек 2024, 20:15',
    scheduledDate: '19 дек 2024, 10:00',
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
    progress: 30
  },

  // Завершенные заявки
  {
    id: 'APP-2024-004',
    service: 'Установка натяжного потолка',
    category: 'client',
    status: 'completed',
    priority: 'medium',
    createdAt: '10 дек 2024, 11:00',
    updatedAt: '12 дек 2024, 18:30',
    scheduledDate: '11 дек 2024, 09:00',
    client: {
      name: 'Волков Андрей',
      phone: '+7 (999) 777-88-99',
      email: 'andrey@mail.ru'
    },
    provider: {
      name: 'СтройМастер',
      rating: 4.8,
      contacts: '+7 (999) 888-77-66',
      reviewsCount: 156,
      image: '🔨'
    },
    description: 'Монтаж натяжного потолка в гостиной площадью 25 м² с LED-подсветкой.',
    price: '35 000 ₽',
    estimatedDuration: '6 часов',
    address: 'ул. Садовая, 15, кв. 42',
    managerNotes: 'Клиент доволен. Оставил положительный отзыв.',
    assignedManager: 'Петрова Мария',
    rating: 5,
    review: 'Отличная работа, аккуратно и быстро! Мастера профессиональные, убрали после себя. Рекомендую!',
    progress: 100,
    steps: [
      { name: 'Замер', completed: true, date: '10 дек, 11:00' },
      { name: 'Заказ материалов', completed: true, date: '10 дек, 12:30' },
      { name: 'Монтаж', completed: true, date: '11 дек, 09:00' },
      { name: 'Завершено', completed: true, date: '11 дек, 16:00' }
    ]
  },
  {
    id: 'APP-2024-005',
    service: 'Заказ такси в аэропорт',
    category: 'transport',
    status: 'completed',
    priority: 'high',
    createdAt: '14 дек 2024, 05:30',
    updatedAt: '14 дек 2024, 07:15',
    scheduledDate: '14 дек 2024, 06:00',
    client: {
      name: 'Громов Павел',
      phone: '+7 (999) 888-99-00',
      email: 'pavel@mail.ru'
    },
    provider: {
      name: 'Такси "Комфорт"',
      rating: 4.6,
      contacts: '+7 (999) 555-44-33',
      reviewsCount: 567,
      image: '🚖'
    },
    description: 'Поездка из центра города в аэропорт Шереметьево. Вылет в 08:30.',
    price: '1 200 ₽',
    estimatedDuration: '45 минут',
    address: 'ул. Тверская, 25 → Аэропорт Шереметьево',
    managerNotes: 'Клиент успел на рейс. Удовлетворен сервисом.',
    assignedManager: 'Сидоров Иван',
    rating: 4,
    review: 'Водитель вежливый, доехали вовремя. Машина чистая, кондиционер работал.',
    progress: 100
  },

  // Отмененные/отклоненные заявки
  {
    id: 'APP-2024-006',
    service: 'Ремонт стиральной машины',
    category: 'client',
    status: 'cancelled',
    priority: 'medium',
    createdAt: '13 дек 2024, 16:45',
    updatedAt: '13 дек 2024, 17:30',
    scheduledDate: '14 дек 2024, 12:00',
    client: {
      name: 'Орлова Ирина',
      phone: '+7 (999) 999-00-11',
      email: 'irina@mail.ru'
    },
    provider: {
      name: 'РемонтБытТехники',
      rating: 4.5,
      contacts: '+7 (999) 222-33-44',
      reviewsCount: 78,
      image: '🔧'
    },
    description: 'Диагностика и ремонт стиральной машины Indesit. Не включается, не крутится барабан.',
    price: '3 500 ₽',
    estimatedDuration: '2 часа',
    address: 'ул. Лесная, 8, кв. 17',
    notes: 'Отменено по причине самостоятельного ремонта',
    managerNotes: 'Клиент нашел более дешевого мастера. Нужно работать над ценовой политикой.'
  },
  {
    id: 'APP-2024-007',
    service: 'Оформление загранпаспорта',
    category: 'social',
    status: 'rejected',
    priority: 'low',
    createdAt: '08 дек 2024, 11:20',
    updatedAt: '09 дек 2024, 10:15',
    client: {
      name: 'Белов Александр',
      phone: '+7 (999) 000-11-22',
      email: 'alexander@mail.ru'
    },
    provider: {
      name: 'МФЦ "Центральный"',
      rating: 4.3,
      contacts: '+7 (495) 111-22-33',
      reviewsCount: 345,
      image: '🏛️'
    },
    description: 'Оформление загранпаспорта нового образца. Срочное оформление за 3 дня.',
    price: '5 000 ₽',
    estimatedDuration: '14 дней',
    address: 'ул. Центральная, 1, МФЦ "Центральный"',
    notes: 'Отклонено: неполный пакет документов',
    managerNotes: 'Клиент не предоставил справку из военкомата. Объяснить требования.'
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
const StepsTimeline = ({ steps }: { steps: { name: string; completed: boolean; date?: string }[] }) => (
  <div className="space-y-4">
    {steps.map((step, index) => (
      <div key={index} className="flex items-start gap-4">
        <div className="flex flex-col items-center">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
            step.completed 
              ? 'bg-emerald-500 text-white' 
              : 'bg-white/10 text-white/40'
          }`}>
            {step.completed ? '✓' : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-0.5 h-8 mt-1 ${
              step.completed ? 'bg-emerald-500' : 'bg-white/10'
            }`} />
          )}
        </div>
        <div className="flex-1 pb-4">
          <div className={`font-medium ${
            step.completed ? 'text-white' : 'text-white/60'
          }`}>
            {step.name}
          </div>
          {step.date && (
            <div className="text-white/40 text-sm mt-1">{step.date}</div>
          )}
        </div>
      </div>
    ))}
  </div>
);

// Компонент карточки заявки для менеджера
const ApplicationCard = ({ application, onClick }: { application: Application; onClick?: () => void }) => {
  const categoryColor = getCategoryColor(application.category);
  const statusColor = getStatusColor(application.status);
  const priorityColor = getPriorityColor(application.priority);

  return (
    <BentoCard className="p-4 cursor-pointer h-full" glowColor={categoryColor} onClick={onClick} gradient>
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
              <span 
                className="px-2 py-1 rounded-full text-xs border font-medium whitespace-nowrap"
                style={{
                  backgroundColor: `rgba(${statusColor}, 0.2)`,
                  color: `rgb(${statusColor})`,
                  borderColor: `rgba(${statusColor}, 0.3)`
                }}
              >
                {getStatusText(application.status)}
              </span>
            </div>
            <h3 className="text-white font-semibold text-sm mb-1 truncate">{application.service}</h3>
            <div className="text-white/60 text-xs line-clamp-2 mb-2">{application.description}</div>
          </div>
        </div>

        {/* Клиент и менеджер */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="text-white/60">
            <div className="font-medium text-white">👤 {application.client.name}</div>
            <div>{application.client.phone}</div>
          </div>
          <div className="text-right text-white/60">
            <div>Менеджер:</div>
            <div className="font-medium text-white">
              {application.assignedManager || 'Не назначен'}
            </div>
          </div>
        </div>

        {/* Прогресс бар */}
        {application.progress !== undefined && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-white/60 mb-1">
              <span>Прогресс</span>
              <span>{application.progress}%</span>
            </div>
            <ProgressBar progress={application.progress} color={statusColor} />
          </div>
        )}

        {/* Цена и рейтинг */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 text-sm">
            {application.price && (
              <div className="text-white font-bold">{application.price}</div>
            )}
            {application.estimatedDuration && (
              <div className="text-white/60">{application.estimatedDuration}</div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-amber-400">⭐ {application.provider.rating}</span>
            <span className="text-white/40">({application.provider.reviewsCount})</span>
          </div>
        </div>

        {/* Исполнитель и даты */}
        <div className="flex items-center justify-between text-xs text-white/60 mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-lg">{application.provider.image}</span>
            <span className="truncate max-w-[120px]">{application.provider.name}</span>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="whitespace-nowrap">Создана: {application.createdAt}</div>
          </div>
        </div>

        {/* Запланированная дата */}
        {application.scheduledDate && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10 text-xs text-white/60">
            <span>📅</span>
            <span>Запланировано: {application.scheduledDate}</span>
          </div>
        )}
      </div>
    </BentoCard>
  );
};

// Компонент KPI для менеджера
const KPIWidget = ({ title, value, change, description, icon, color, trend, onClick }: {
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

// Quick Actions Component для менеджера
const QuickActions = ({ onAssignManager, onAddNote }: { 
  onAssignManager: () => void; 
  onAddNote: () => void;
}) => (
  <BentoCard className="p-4" glowColor={COLORS.purple} gradient>
    <h3 className="text-white font-semibold mb-3">Быстрые действия</h3>
    <div className="grid grid-cols-2 gap-2">
      <motion.button 
        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors text-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAssignManager}
      >
        👥 Назначить менеджера
      </motion.button>
      <motion.button 
        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors text-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddNote}
      >
        📝 Добавить заметку
      </motion.button>
      <motion.button 
        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors text-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        📊 Аналитика
      </motion.button>
      <motion.button 
        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors text-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        📋 Шаблоны
      </motion.button>
    </div>
  </BentoCard>
);

// Компонент фильтров для менеджера
const ManagerFilters = ({ 
  activeFilter, 
  setActiveFilter, 
  searchQuery, 
  setSearchQuery,
  viewMode,
  setViewMode,
  statusCounts 
}: {
  activeFilter: string;
  setActiveFilter: (filter: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  statusCounts: any;
}) => (
  <div className="flex flex-col lg:flex-row gap-4 mb-4">
    {/* Фильтры по статусу */}
    <div className="flex flex-wrap gap-2 flex-1">
      {[
        { id: 'all', name: 'Все', count: statusCounts.all, color: 'gray' },
        { id: 'pending', name: 'Ожидание', count: statusCounts.pending, color: 'amber' },
        { id: 'confirmed', name: 'Подтверждены', count: statusCounts.confirmed, color: 'blue' },
        { id: 'in_progress', name: 'В работе', count: statusCounts.in_progress, color: 'indigo' },
        { id: 'completed', name: 'Завершены', count: statusCounts.completed, color: 'emerald' },
        { id: 'cancelled', name: 'Отменены', count: statusCounts.cancelled + statusCounts.rejected, color: 'rose' }
      ].map((filter) => (
        <motion.button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            activeFilter === filter.id 
              ? `bg-${filter.color}-500 text-white shadow-lg` 
              : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
          }`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{filter.name}</span>
          <span className={`px-1.5 py-0.5 rounded-full text-xs ${
            activeFilter === filter.id ? 'bg-white/20' : 'bg-white/10'
          }`}>
            {filter.count}
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
          placeholder="Поиск по заявкам..."
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

// Основной компонент страницы заявок для менеджера
export default function ManagerApplicationsPage() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | Application['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [managerNotes, setManagerNotes] = useState('');
  const [assignedManager, setAssignedManager] = useState('');

  // Статистика для менеджера
  const totalApplications = applications.length;
  const activeApplications = applications.filter(app => 
    ['pending', 'confirmed', 'in_progress'].includes(app.status)
  ).length;
  const completedApplications = applications.filter(app => app.status === 'completed').length;
  const cancelledApplications = applications.filter(app => 
    ['cancelled', 'rejected'].includes(app.status)
  ).length;
  const urgentApplications = applications.filter(app => app.priority === 'urgent').length;
  const unassignedApplications = applications.filter(app => !app.assignedManager).length;

  // KPI данные для менеджера
  const managerKPIs = [
    { 
      title: 'Всего заявок', 
      value: totalApplications.toString(), 
      change: '+3', 
      description: 'в управлении', 
      icon: '📋', 
      color: COLORS.blue,
      trend: 'up' as const
    },
    { 
      title: 'Требуют внимания', 
      value: urgentApplications.toString(), 
      change: '+2', 
      description: 'срочный приоритет', 
      icon: '🚨', 
      color: COLORS.rose,
      trend: 'up' as const
    },
    { 
      title: 'Без менеджера', 
      value: unassignedApplications.toString(), 
      description: 'не назначены', 
      icon: '👤', 
      color: COLORS.amber,
      trend: 'stable' as const
    },
    { 
      title: 'Завершено', 
      value: completedApplications.toString(), 
      change: '+5%', 
      description: 'успешно выполнено', 
      icon: '✅', 
      color: COLORS.emerald,
      trend: 'up' as const
    }
  ];

  // Фильтрация заявок
  const filteredApplications = applications.filter(application =>
    (activeFilter === 'all' || application.status === activeFilter) &&
    (application.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
     application.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
     application.provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     application.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     application.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Группировка по статусам для фильтров
  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    confirmed: applications.filter(app => app.status === 'confirmed').length,
    in_progress: applications.filter(app => app.status === 'in_progress').length,
    completed: applications.filter(app => app.status === 'completed').length,
    cancelled: applications.filter(app => app.status === 'cancelled').length,
    rejected: applications.filter(app => app.status === 'rejected').length
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
    setIsModalOpen(true);
  };

  const handleAssignManager = () => {
    // Логика назначения менеджера
    alert('Функция назначения менеджера');
  };

  const handleAddNote = () => {
    // Логика добавления заметки
    alert('Функция добавления заметки');
  };

  const handleSaveManagerNotes = () => {
    if (selectedApplication) {
      // Логика сохранения заметок менеджера
      alert('Заметки менеджера сохранены');
    }
  };

  const handleAssignToMe = () => {
    if (selectedApplication) {
      setAssignedManager('Вы (Текущий менеджер)');
      alert('Заявка назначена на вас');
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
          <BentoCard className="p-6" glowColor={COLORS.blue} gradient>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">👨‍💼 Управление заявками</h1>
                <p className="text-white/60 text-lg mb-4">
                  Панель управления заявками клиентов. Назначайте менеджеров, отслеживайте прогресс и управляйте приоритетами.
                </p>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-400" />
                    <span>{urgentApplications} срочных</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{unassignedApplications} без менеджера</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{completedApplications} завершено</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <motion.button
                  className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📊 Отчеты
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
            <h2 className="text-xl font-semibold text-white">Ключевые показатели</h2>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>Обновлено: {currentTime}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {managerKPIs.map((kpi, index) => (
              <KPIWidget key={index} {...kpi} />
            ))}
          </div>
        </motion.section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <QuickActions 
              onAssignManager={handleAssignManager}
              onAddNote={handleAddNote}
            />
            
            {/* Category Filter */}
            <BentoCard className="p-4" glowColor={COLORS.indigo} gradient>
              <h3 className="text-white font-semibold mb-3">Категории</h3>
              <div className="space-y-2">
                {Object.entries({
                  autoservice: '🚗 Автосервис',
                  delivery: '📦 Доставка',
                  medical: '🏥 Медицина',
                  client: '🛍️ Клиентские',
                  social: '👥 Социальные',
                  transport: '🚌 Транспорт'
                }).map(([key, label]) => (
                  <button
                    key={key}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors text-sm flex items-center justify-between"
                  >
                    <span>{label}</span>
                    <span className="bg-white/10 px-1.5 py-0.5 rounded text-xs">
                      {applications.filter(app => app.category === key as any).length}
                    </span>
                  </button>
                ))}
              </div>
            </BentoCard>

            {/* Priority Filter */}
            <BentoCard className="p-4" glowColor={COLORS.orange} gradient>
              <h3 className="text-white font-semibold mb-3">Приоритет</h3>
              <div className="space-y-2">
                {[
                  { id: 'urgent', name: '🚨 Срочный', count: applications.filter(app => app.priority === 'urgent').length },
                  { id: 'high', name: '🔴 Высокий', count: applications.filter(app => app.priority === 'high').length },
                  { id: 'medium', name: '🟡 Средний', count: applications.filter(app => app.priority === 'medium').length },
                  { id: 'low', name: '🟢 Низкий', count: applications.filter(app => app.priority === 'low').length }
                ].map((priority) => (
                  <button
                    key={priority.id}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors text-sm flex items-center justify-between"
                  >
                    <span>{priority.name}</span>
                    <span className="bg-white/10 px-1.5 py-0.5 rounded text-xs">
                      {priority.count}
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
              <ManagerFilters
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                viewMode={viewMode}
                setViewMode={setViewMode}
                statusCounts={statusCounts}
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
                  {activeFilter === 'all' ? 'Все заявки' : getStatusText(activeFilter)}
                  <span className="text-white/60 text-lg ml-2">({filteredApplications.length})</span>
                </h2>
                <div className="text-white/60 text-sm">
                  {filteredApplications.length} из {applications.length} заявок
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
                      <ApplicationCard 
                        application={application} 
                        onClick={() => handleViewApplication(application)}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <BentoCard className="p-12 text-center" glowColor={COLORS.gray}>
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-white font-semibold text-xl mb-2">Заявки не найдены</h3>
                  <p className="text-white/60 mb-4">
                    {searchQuery 
                      ? 'Попробуйте изменить поисковый запрос' 
                      : 'Нет заявок с выбранным статусом'
                    }
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFilter('all');
                    }}
                    className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
                  >
                    Сбросить фильтры
                  </button>
                </BentoCard>
              )}
            </motion.section>
          </div>
        </div>
      </main>

      {/* Модальное окно деталей заявки для менеджера */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="👨‍💼 Управление заявкой"
        size="lg"
      >
        {selectedApplication && (
          <div className="space-y-6">
            {/* Заголовок и статус */}
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
                    backgroundColor: `rgba(${getStatusColor(selectedApplication.status)}, 0.2)`,
                    color: `rgb(${getStatusColor(selectedApplication.status)})`,
                    borderColor: `rgba(${getStatusColor(selectedApplication.status)}, 0.3)`
                  }}
                >
                  {getStatusText(selectedApplication.status)}
                </div>
              </div>
            </div>

            {/* Информация о клиенте */}
            <div>
              <h4 className="text-white font-semibold mb-3">👤 Информация о клиенте</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">Имя клиента</div>
                  <div className="text-white font-semibold">{selectedApplication.client.name}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">Телефон</div>
                  <div className="text-white font-semibold">{selectedApplication.client.phone}</div>
                </div>
                {selectedApplication.client.email && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-white/60 text-sm mb-1">Email</div>
                    <div className="text-white font-semibold">{selectedApplication.client.email}</div>
                  </div>
                )}
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">Ответственный менеджер</div>
                  <div className="text-white font-semibold">
                    {selectedApplication.assignedManager || 'Не назначен'}
                  </div>
                </div>
              </div>
            </div>

            {/* Прогресс бар */}
            {selectedApplication.progress !== undefined && (
              <div>
                <div className="flex items-center justify-between text-white/60 text-sm mb-2">
                  <span>Общий прогресс</span>
                  <span>{selectedApplication.progress}%</span>
                </div>
                <ProgressBar progress={selectedApplication.progress} color={getStatusColor(selectedApplication.status)} />
              </div>
            )}

            {/* Timeline Steps */}
            {selectedApplication.steps && (
              <div>
                <h4 className="text-white font-semibold mb-4">Этапы выполнения</h4>
                <StepsTimeline steps={selectedApplication.steps} />
              </div>
            )}

            {/* Основная информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm mb-1">ID заявки</div>
                <div className="text-white font-semibold">{selectedApplication.id}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm mb-1">Категория</div>
                <div className="text-white font-semibold">{getCategoryText(selectedApplication.category)}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm mb-1">Приоритет</div>
                <div className="text-white font-semibold">{getPriorityText(selectedApplication.priority)}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm mb-1">Создана</div>
                <div className="text-white font-semibold">{selectedApplication.createdAt}</div>
              </div>
            </div>

            {/* Исполнитель */}
            <div>
              <h4 className="text-white font-semibold mb-3">🏢 Исполнитель</h4>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedApplication.provider.image}</span>
                    <div>
                      <div className="text-white font-semibold">{selectedApplication.provider.name}</div>
                      <div className="text-white/60 text-sm mt-1">
                        Контакты: {selectedApplication.provider.contacts}
                      </div>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="text-amber-400">⭐ {selectedApplication.provider.rating}</span>
                        <span className="text-white/40">({selectedApplication.provider.reviewsCount} отзывов)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Заметки менеджера */}
            <div>
              <h4 className="text-white font-semibold mb-3">📝 Заметки менеджера</h4>
              <textarea
                value={managerNotes || selectedApplication.managerNotes || ''}
                onChange={(e) => setManagerNotes(e.target.value)}
                placeholder="Добавьте заметки по заявке..."
                className="w-full h-24 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 resize-none"
              />
            </div>

            {/* Действия менеджера */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button 
                onClick={handleAssignToMe}
                className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold"
              >
                Назначить на себя
              </button>
              <button 
                onClick={handleSaveManagerNotes}
                className="flex-1 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors font-semibold"
              >
                Сохранить заметки
              </button>
              <button className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
                Экспорт данных
              </button>
            </div>

            {/* Быстрые действия */}
            <div className="grid grid-cols-2 gap-3">
              <button className="py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 transition-colors text-sm">
                📞 Позвонить клиенту
              </button>
              <button className="py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 transition-colors text-sm">
                ✉️ Написать клиенту
              </button>
              <button className="py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 transition-colors text-sm">
                🔄 Изменить статус
              </button>
              <button className="py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 transition-colors text-sm">
                🚨 Высокий приоритет
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}