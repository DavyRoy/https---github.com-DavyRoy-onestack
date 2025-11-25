'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

// Типы данных для услуг
interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  path: string;
  stats: {
    total: number;
    active: number;
    rating: number;
  };
  features: string[];
  popularServices: string[];
  details: {
    providers: number;
    responseTime: string;
    satisfaction: number;
    priceRange: string;
  };
}

// Демо данные о категориях услуг
const serviceCategories: ServiceCategory[] = [
  {
    id: 'autoservice',
    title: '🚗 Автосервис',
    description: 'Полный комплекс услуг для вашего автомобиля: от ТО до ремонта. Контроль состояния, история обслуживания и напоминания.',
    icon: '🚗',
    color: COLORS.blue,
    path: '/demo/application/user/modules/services/autoservice',
    stats: {
      total: 24,
      active: 18,
      rating: 4.8
    },
    features: [
      'История обслуживания',
      'Технические данные авто',
      'Напоминания ТО',
      'Онлайн-запись',
      'Контроль расходов',
      'Гарантия на работы',
      'Выездной сервис'
    ],
    popularServices: [
      'Замена масла',
      'Диагностика',
      'Шиномонтаж',
      'Ремонт двигателя',
      'Покраска кузова',
      'Электрика'
    ],
    details: {
      providers: 45,
      responseTime: '15-30 мин',
      satisfaction: 95,
      priceRange: '$$'
    }
  },
  {
    id: 'delivery',
    title: '📦 Доставка',
    description: 'Быстрая и надежная доставка товаров и документов. Отслеживание заказов в реальном времени с уведомлениями.',
    icon: '📦',
    color: COLORS.orange,
    path: '/demo/application/user/modules/services/delivery',
    stats: {
      total: 12,
      active: 8,
      rating: 4.6
    },
    features: [
      'Отслеживание заказов',
      'Курьерская доставка',
      'Экспресс-доставка',
      'Международная доставка',
      'Уведомления о статусе',
      'Фотоотчет доставки'
    ],
    popularServices: [
      'Доставка еды',
      'Доставка товаров',
      'Курьерские услуги',
      'Международные отправления',
      'Грузоперевозки'
    ],
    details: {
      providers: 32,
      responseTime: '5-15 мин',
      satisfaction: 92,
      priceRange: '$'
    }
  },
  {
    id: 'medical',
    title: '🏥 Медицина',
    description: 'Медицинские услуги и запись к специалистам. Электронная медкарта, напоминания о приемах и телемедицина.',
    icon: '🏥',
    color: COLORS.emerald,
    path: '/demo/application/user/modules/services/medical',
    stats: {
      total: 36,
      active: 28,
      rating: 4.9
    },
    features: [
      'Запись к врачу',
      'Электронная медкарта',
      'Напоминания о приемах',
      'Результаты анализов',
      'Телемедицина',
      'Вызов врача на дом'
    ],
    popularServices: [
      'Терапевт',
      'Стоматолог',
      'Диагностика',
      'Анализы',
      'Массаж',
      'Физиотерапия'
    ],
    details: {
      providers: 67,
      responseTime: '10-20 мин',
      satisfaction: 96,
      priceRange: '$$$'
    }
  },
  {
    id: 'client',
    title: '🛍️ Клиентские услуги',
    description: 'Широкий спектр услуг для повседневных нужд: красота, ремонт, образование и выгодные акции со скидками.',
    icon: '🛍️',
    color: COLORS.purple,
    path: '/demo/application/user/modules/services/service',
    stats: {
      total: 156,
      active: 142,
      rating: 4.7
    },
    features: [
      'Красота и здоровье',
      'Ремонт и строительство',
      'Образование',
      'Акции и скидки',
      'Онлайн-бронирование',
      'Отзывы и рейтинги'
    ],
    popularServices: [
      'СПА-процедуры',
      'Ремонт квартир',
      'Языковые курсы',
      'Парикмахерские услуги',
      'Фитнес-тренер',
      'Репетиторы'
    ],
    details: {
      providers: 234,
      responseTime: '20-40 мин',
      satisfaction: 94,
      priceRange: '$$'
    }
  },
  {
    id: 'social',
    title: '👥 Социальные услуги',
    description: 'Государственные и социальные услуги в одном месте. Оформление документов, социальная поддержка и консультации.',
    icon: '👥',
    color: COLORS.indigo,
    path: '/demo/application/user/modules/services/social',
    stats: {
      total: 48,
      active: 45,
      rating: 4.5
    },
    features: [
      'Госуслуги онлайн',
      'Социальная поддержка',
      'Оформление документов',
      'Юридические консультации',
      'Пенсионные услуги',
      'Налоговые консультации'
    ],
    popularServices: [
      'Оформление паспорта',
      'Налоговые услуги',
      'Социальные выплаты',
      'Юридическая помощь',
      'Регистрация бизнеса'
    ],
    details: {
      providers: 28,
      responseTime: '1-2 дня',
      satisfaction: 89,
      priceRange: '$'
    }
  },
  {
    id: 'transport',
    title: '🚌 Транспорт',
    description: 'Все виды транспорта в одном приложении. Заказ такси, аренда автомобилей, планирование поездок и маршрутов.',
    icon: '🚌',
    color: COLORS.cyan,
    path: '/demo/application/user/modules/services/transport',
    stats: {
      total: 15,
      active: 12,
      rating: 4.6
    },
    features: [
      'Заказ такси',
      'Аренда автомобилей',
      'Общественный транспорт',
      'Планирование маршрутов',
      'Транспортные карты',
      'Стоимость поездок'
    ],
    popularServices: [
      'Такси',
      'Каршеринг',
      'Общественный транспорт',
      'Аренда авто',
      'Междугородние перевозки'
    ],
    details: {
      providers: 19,
      responseTime: '2-5 мин',
      satisfaction: 91,
      priceRange: '$$'
    }
  }
];

// Модальное окно для деталей категории
const CategoryModal = ({ category, isOpen, onClose }: {
  category: ServiceCategory;
  isOpen: boolean;
  onClose: () => void;
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

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{category.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                  <p className="text-white/60">{category.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-white/60 text-sm mb-1">Поставщиков</div>
                <div className="text-white font-bold text-xl">{category.details.providers}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-white/60 text-sm mb-1">Время ответа</div>
                <div className="text-white font-bold text-xl">{category.details.responseTime}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-white/60 text-sm mb-1">Довольных клиентов</div>
                <div className="text-white font-bold text-xl">{category.details.satisfaction}%</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-white/60 text-sm mb-1">Ценовой диапазон</div>
                <div className="text-white font-bold text-xl">{category.details.priceRange}</div>
              </div>
            </div>

            {/* Популярные услуги */}
            <div className="mb-6">
              <h3 className="text-white font-semibold text-lg mb-3">Популярные услуги</h3>
              <div className="grid grid-cols-2 gap-2">
                {category.popularServices.map((service, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3 text-white/80 text-sm">
                    {service}
                  </div>
                ))}
              </div>
            </div>

            {/* Особенности */}
            <div className="mb-6">
              <h3 className="text-white font-semibold text-lg mb-3">Возможности</h3>
              <div className="space-y-2">
                {category.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-white/60">
                    <div className="w-2 h-2 rounded-full bg-white/40 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Link 
                href={category.path}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl text-center transition-colors"
              >
                Перейти к услугам
              </Link>
              <button className="px-6 py-3 border border-white/20 hover:bg-white/10 text-white rounded-xl transition-colors">
                Добавить в избранное
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Bento Card компонент
const BentoCard = ({ 
  children, 
  className = '', 
  glowColor = COLORS.blue,
  onClick,
  gradient = false
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  gradient?: boolean;
}) => {
  const gradientClass = gradient ? 'bg-gradient-to-br from-white/10 to-white/5' : 'bg-white/5';

  return (
    <motion.div
      className={`
        relative overflow-hidden 
        rounded-2xl border border-white/10 
        ${gradientClass} backdrop-blur-lg 
        transition-all duration-300 
        hover:border-white/20 hover:bg-white/10
        w-full max-w-full
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
    >
      <div 
        className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
        style={{
          background: `radial-gradient(circle at center, rgba(${glowColor}, 0.1) 0%, transparent 70%)`,
        }}
      />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};

// Компонент карточки категории
const ServiceCategoryCard = ({ category, onCardClick }: { 
  category: ServiceCategory;
  onCardClick: (category: ServiceCategory) => void;
}) => {
  return (
    <BentoCard 
      className="p-6 h-full cursor-pointer" 
      glowColor={category.color}
      gradient
      onClick={() => onCardClick(category)}
    >
      <div className="flex flex-col h-full">
        {/* Заголовок и иконка */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div 
              className="text-3xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {category.icon}
            </motion.div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-xl mb-1">{category.title}</h3>
              <p className="text-white/60 text-sm line-clamp-2">{category.description}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1 text-amber-400 text-sm">
              <span>⭐</span>
              <span>{category.stats.rating}</span>
            </div>
            <div className="text-white/40 text-xs mt-1">
              {category.stats.active}/{category.stats.total} активно
            </div>
          </div>
        </div>

        {/* Детальная статистика */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <div className="text-white/60 text-xs mb-1">Поставщики</div>
            <div className="text-white font-semibold text-sm">{category.details.providers}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <div className="text-white/60 text-xs mb-1">Ответ</div>
            <div className="text-white font-semibold text-sm">{category.details.responseTime}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <div className="text-white/60 text-xs mb-1">Довольны</div>
            <div className="text-white font-semibold text-sm">{category.details.satisfaction}%</div>
          </div>
        </div>

        {/* Популярные услуги */}
        <div className="mb-4">
          <div className="text-white/80 text-sm font-semibold mb-2">Популярные услуги:</div>
          <div className="flex flex-wrap gap-1">
            {category.popularServices.slice(0, 4).map((service, index) => (
              <motion.span 
                key={index}
                className="px-2 py-1 bg-white/5 text-white/60 rounded-lg text-xs"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                {service}
              </motion.span>
            ))}
            {category.popularServices.length > 4 && (
              <span className="px-2 py-1 bg-white/5 text-white/40 rounded-lg text-xs">
                +{category.popularServices.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Особенности */}
        <div className="mt-auto">
          <div className="text-white/80 text-sm font-semibold mb-2">Возможности:</div>
          <div className="space-y-1">
            {category.features.slice(0, 3).map((feature, index) => (
              <motion.div 
                key={index} 
                className="flex items-center gap-2 text-white/60 text-xs"
                whileHover={{ x: 4 }}
              >
                <div className="w-1 h-1 rounded-full bg-white/40 flex-shrink-0" />
                <span className="truncate">{feature}</span>
              </motion.div>
            ))}
            {category.features.length > 3 && (
              <div className="text-white/40 text-xs">
                +{category.features.length - 3} возможностей
              </div>
            )}
          </div>
        </div>

        {/* Кнопка перехода */}
        <motion.div 
          className="flex items-center justify-between mt-4 pt-4 border-t border-white/10"
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        >
          <span className="text-white/60 text-sm">Нажмите для деталей</span>
          <motion.span 
            className="text-white text-lg"
            whileHover={{ x: 3 }}
          >
            →
          </motion.span>
        </motion.div>
      </div>
    </BentoCard>
  );
};

// Компонент KPI
const KPIWidget = ({ title, value, change, description, icon, color, trend }: {
  title: string;
  value: string;
  change?: string;
  description: string;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
}) => {
  const trendIcon = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
  const trendColor = trend === 'up' ? COLORS.emerald : trend === 'down' ? COLORS.rose : COLORS.gray;
  
  return (
    <BentoCard className="p-4" glowColor={color} gradient>
      <div className="flex items-start justify-between mb-3">
        <div className="text-xl font-bold text-white leading-tight">
          {value}
        </div>
        <motion.div 
          className="flex flex-col items-end gap-1"
          whileHover={{ scale: 1.1 }}
        >
          <div className="text-lg">{icon}</div>
          {change && trend && (
            <div className="flex items-center gap-1 text-xs" style={{ color: `rgb(${trendColor})` }}>
              <span>{trendIcon}</span>
              <span>{change}</span>
            </div>
          )}
        </motion.div>
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

// Основной компонент страницы услуг
export default function ServicesPage() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Общая статистика
  const totalServices = serviceCategories.reduce((sum, cat) => sum + cat.stats.total, 0);
  const activeServices = serviceCategories.reduce((sum, cat) => sum + cat.stats.active, 0);
  const averageRating = serviceCategories.reduce((sum, cat) => sum + cat.stats.rating, 0) / serviceCategories.length;

  // KPI данные
  const servicesKPIs = [
    { 
      title: 'Всего услуг', 
      value: totalServices.toString(), 
      description: 'доступно в системе', 
      icon: '🛠️', 
      color: COLORS.blue,
      trend: 'up' as const
    },
    { 
      title: 'Активные сейчас', 
      value: activeServices.toString(), 
      description: 'готовы к использованию', 
      icon: '⚡', 
      color: COLORS.emerald,
      trend: 'up' as const
    },
    { 
      title: 'Средний рейтинг', 
      value: averageRating.toFixed(1), 
      description: 'качество услуг', 
      icon: '⭐', 
      color: COLORS.amber,
      trend: 'stable' as const
    },
    { 
      title: 'Категории', 
      value: serviceCategories.length.toString(), 
      description: 'различных направлений', 
      icon: '📁', 
      color: COLORS.purple,
      trend: 'stable' as const
    }
  ];

  // Фильтрация категорий
  const filteredCategories = serviceCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase())) ||
    category.popularServices.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleCategoryClick = useCallback((category: ServiceCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCategory(null), 300);
  }, []);

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
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-40 bg-black/40 backdrop-blur-2xl border-b border-white/10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/demo/application/user" className="text-white/60 hover:text-white transition-colors flex items-center gap-2">
                <motion.span whileHover={{ x: -2 }}>←</motion.span>
                <span className="text-sm">Назад в личный кабинет</span>
              </Link>
              <div className="text-white/60 text-sm text-right hidden sm:block">
                <div>{currentDate}</div>
                <div>{currentTime}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-white text-sm">Все услуги активны</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BentoCard className="p-6" glowColor={COLORS.purple} gradient>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">🛠️ Все услуги</h1>
                <p className="text-white/60 text-lg mb-4">
                  Полный спектр услуг для вашего комфорта. От автосервиса до медицины - все в одном месте.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>{activeServices} услуг доступно сейчас</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>{serviceCategories.length} категорий</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Средний рейтинг {averageRating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <motion.div 
                className="flex flex-col items-center gap-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
                  🛠️
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">Ваш город</div>
                  <div className="text-white/60 text-sm">{totalServices} услуг доступно</div>
                </div>
              </motion.div>
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
            <h2 className="text-xl font-semibold text-white">Общая статистика</h2>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>Обновлено: {currentTime}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {servicesKPIs.map((kpi, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <KPIWidget {...kpi} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Search Section */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <BentoCard className="p-6" glowColor={COLORS.blue} gradient>
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">🔍 Поиск услуг</h3>
                <p className="text-white/60 text-sm">
                  Найдите нужную услугу по названию, описанию или ключевым словам
                </p>
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-96">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Например: доставка, ремонт, врач..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                  {searchQuery && (
                    <motion.button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                      whileHover={{ scale: 1.1 }}
                    >
                      ×
                    </motion.button>
                  )}
                </div>
                <motion.button 
                  className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors whitespace-nowrap"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Найти
                </motion.button>
              </div>
            </div>
          </BentoCard>
        </motion.section>

        {/* Categories Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Категории услуг</h2>
            <div className="text-white/60 text-sm">
              {filteredCategories.length} из {serviceCategories.length} категорий
            </div>
          </div>

          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <ServiceCategoryCard 
                    category={category} 
                    onCardClick={handleCategoryClick}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <BentoCard className="p-12 text-center" glowColor={COLORS.gray}>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-white font-semibold text-xl mb-2">Услуги не найдены</h3>
                <p className="text-white/60 mb-4">
                  Попробуйте изменить поисковый запрос или выбрать другую категорию
                </p>
                <motion.button 
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Сбросить поиск
                </motion.button>
              </motion.div>
            </BentoCard>
          )}
        </motion.section>

        {/* Additional Information */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Support */}
            <BentoCard className="p-6" glowColor={COLORS.emerald} gradient>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">💬</div>
                <h3 className="text-white font-semibold">Поддержка</h3>
              </div>
              <div className="space-y-2 text-sm text-white/60 mb-4">
                <div>• Круглосуточная поддержка</div>
                <div>• Помощь в выборе услуг</div>
                <div>• Консультации специалистов</div>
                <div>• Решение проблем с заказами</div>
              </div>
              <motion.button 
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Связаться с поддержкой
              </motion.button>
            </BentoCard>

            {/* Partners */}
            <BentoCard className="p-6" glowColor={COLORS.orange} gradient>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🤝</div>
                <h3 className="text-white font-semibold">Для партнеров</h3>
              </div>
              <div className="space-y-2 text-sm text-white/60 mb-4">
                <div>• Добавьте свои услуги</div>
                <div>• Привлекайте новых клиентов</div>
                <div>• Управляйте заказами онлайн</div>
                <div>• Получайте отзывы и рейтинги</div>
              </div>
              <motion.button 
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-colors font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Стать партнером
              </motion.button>
            </BentoCard>

            {/* Mobile App */}
            <BentoCard className="p-6" glowColor={COLORS.purple} gradient>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">📱</div>
                <h3 className="text-white font-semibold">Мобильное приложение</h3>
              </div>
              <div className="space-y-2 text-sm text-white/60 mb-4">
                <div>• Все услуги в вашем телефоне</div>
                <div>• Уведомления о заказах</div>
                <div>• Быстрый доступ к избранному</div>
                <div>• Офлайн-доступ к истории</div>
              </div>
              <motion.button 
                className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white transition-colors font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Скачать приложение
              </motion.button>
            </BentoCard>
          </div>
        </motion.section>
      </main>

      {/* Модальное окно */}
      <CategoryModal 
        category={selectedCategory!}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}