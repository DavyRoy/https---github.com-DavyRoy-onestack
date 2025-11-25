'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Типы данных
interface Service {
  id: string;
  title: string;
  description: string;
  category: 'beauty' | 'repair' | 'education' | 'promotion';
  price: string;
  duration: string;
  rating: number;
  reviews: number;
  featured?: boolean;
  discount?: string;
  tags: string[];
  provider: {
    name: string;
    verified: boolean;
    rating: number;
  };
  image?: string;
  popularity?: number;
  availability?: string;
  includes?: string[];
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  category: 'beauty' | 'repair' | 'education' | 'all';
  featured: boolean;
  conditions: string[];
  usageCount?: number;
  maxUsage?: number;
  bannerColor?: string;
  terms?: string;
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
  violet: '139, 92, 246',
  fuchsia: '217, 70, 239',
  sky: '14, 165, 233',
  lime: '132, 204, 22',
  pink: '236, 72, 153',
  yellow: '234, 179, 8'
} as const;

// Данные для услуг
const services: Service[] = [
  // Красота и здоровье
  {
    id: '1',
    title: 'СПА-массаж полный',
    description: 'Расслабляющий массаж всего тела с ароматерапией и спа-процедурами для полного восстановления',
    category: 'beauty',
    price: '3 500 ₽',
    duration: '90 мин',
    rating: 4.9,
    reviews: 127,
    featured: true,
    popularity: 95,
    availability: 'Ежедневно с 9:00 до 22:00',
    tags: ['массаж', 'релакс', 'спа', 'ароматерапия', 'расслабление'],
    provider: {
      name: 'SPA "Элит"',
      verified: true,
      rating: 4.9
    },
    includes: ['Массаж всего тела', 'Ароматерапия', 'Спа-процедуры', 'Травяной чай']
  },
  {
    id: '2',
    title: 'Стрижка и укладка премиум',
    description: 'Профессиональная стрижка и укладка от топ-мастера с консультацией по уходу',
    category: 'beauty',
    price: '2 200 ₽',
    duration: '60 мин',
    rating: 4.8,
    reviews: 89,
    popularity: 88,
    availability: 'Вт-Вс с 10:00 до 20:00',
    tags: ['парикмахер', 'стрижка', 'укладка', 'премиум', 'стилист'],
    provider: {
      name: 'Салон "Версаль"',
      verified: true,
      rating: 4.8
    },
    includes: ['Консультация стилиста', 'Стрижка', 'Укладка', 'Советы по уходу']
  },
  {
    id: '3',
    title: 'Маникюр с покрытием гель-лак',
    description: 'Комплексный маникюр с гель-лаком, укреплением и профессиональным уходом',
    category: 'beauty',
    price: '1 800 ₽',
    duration: '75 мин',
    rating: 4.7,
    reviews: 203,
    popularity: 92,
    tags: ['маникюр', 'гель-лак', 'уход', 'ногти', 'дизайн'],
    provider: {
      name: 'Студия "Нежность"',
      verified: true,
      rating: 4.7
    },
    includes: ['Обработка кутикулы', 'Придание формы', 'Гель-лак', 'Укрепление']
  },
  {
    id: '4',
    title: 'Фитнес-консультация премиум',
    description: 'Персональная консультация по питанию и тренировкам с составлением плана',
    category: 'beauty',
    price: '2 500 ₽',
    duration: '60 мин',
    rating: 4.9,
    reviews: 56,
    featured: true,
    popularity: 85,
    availability: 'Пн-Пт с 8:00 до 21:00',
    tags: ['фитнес', 'питание', 'здоровье', 'тренировки', 'консультация'],
    provider: {
      name: 'Фитнес-центр "Энергия"',
      verified: true,
      rating: 4.9
    },
    includes: ['Анализ тела', 'План питания', 'Программа тренировок', 'Рекомендации']
  },
  {
    id: '5',
    title: 'Косметологическая чистка лица',
    description: 'Профессиональная чистка лица с уходом и восстановлением',
    category: 'beauty',
    price: '2 800 ₽',
    duration: '80 мин',
    rating: 4.8,
    reviews: 134,
    popularity: 90,
    tags: ['косметология', 'чистка', 'уход', 'лицо', 'омоложение'],
    provider: {
      name: 'Клиника "Красота"',
      verified: true,
      rating: 4.8
    }
  },

  // Ремонт и строительство
  {
    id: '6',
    title: 'Установка натяжного потолка',
    description: 'Монтаж качественного натяжного потолка с гарантией 5 лет и современным дизайном',
    category: 'repair',
    price: '1 200 ₽/м²',
    duration: '1 день',
    rating: 4.8,
    reviews: 234,
    featured: true,
    popularity: 94,
    availability: 'Ежедневно с 8:00 до 20:00',
    tags: ['ремонт', 'потолки', 'монтаж', 'дизайн', 'гарантия'],
    provider: {
      name: 'СтройМастер',
      verified: true,
      rating: 4.8
    },
    includes: ['Замер помещения', 'Монтаж потолка', 'Установка светильников', 'Гарантия 5 лет']
  },
  {
    id: '7',
    title: 'Электромонтажные работы',
    description: 'Полный комплекс электромонтажных работ любой сложности с сертификацией',
    category: 'repair',
    price: 'от 3 000 ₽',
    duration: '2-4 часа',
    rating: 4.9,
    reviews: 167,
    popularity: 91,
    tags: ['электрика', 'монтаж', 'ремонт', 'безопасность', 'сертификация'],
    provider: {
      name: 'ЭлектроСервис',
      verified: true,
      rating: 4.9
    }
  },
  {
    id: '8',
    title: 'Сантехнические работы комплекс',
    description: 'Установка и ремонт сантехнического оборудования с гарантией качества',
    category: 'repair',
    price: 'от 2 500 ₽',
    duration: '2-6 часов',
    rating: 4.7,
    reviews: 189,
    popularity: 89,
    tags: ['сантехника', 'ремонт', 'установка', 'водоснабжение', 'канализация'],
    provider: {
      name: 'Сантехник-Профи',
      verified: true,
      rating: 4.7
    }
  },
  {
    id: '9',
    title: 'Отделочные работы под ключ',
    description: 'Качественная отделка помещений под ключ с дизайн-проектом',
    category: 'repair',
    price: 'от 1 500 ₽/м²',
    duration: 'от 3 дней',
    rating: 4.8,
    reviews: 145,
    featured: true,
    popularity: 87,
    tags: ['отделка', 'ремонт', 'строительство', 'дизайн', 'под ключ'],
    provider: {
      name: 'ОтделкаСтрой',
      verified: true,
      rating: 4.8
    }
  },
  {
    id: '10',
    title: 'Установка межкомнатных дверей',
    description: 'Профессиональная установка межкомнатных дверей с фурнитурой',
    category: 'repair',
    price: '1 800 ₽/дверь',
    duration: '2-3 часа',
    rating: 4.6,
    reviews: 98,
    popularity: 82,
    tags: ['двери', 'монтаж', 'ремонт', 'фурнитура', 'установка'],
    provider: {
      name: 'Дверной мастер',
      verified: true,
      rating: 4.6
    }
  },

  // Образование
  {
    id: '11',
    title: 'Курсы английского языка',
    description: 'Индивидуальные занятия с носителем языка по современной методике',
    category: 'education',
    price: '1 200 ₽/час',
    duration: '60 мин',
    rating: 4.9,
    reviews: 278,
    featured: true,
    popularity: 96,
    availability: 'Гибкий график',
    tags: ['английский', 'обучение', 'языки', 'носитель', 'индивидуально'],
    provider: {
      name: 'Языковой центр "Лингва"',
      verified: true,
      rating: 4.9
    },
    includes: ['Тестирование уровня', 'Индивидуальная программа', 'Разговорная практика', 'Учебные материалы']
  },
  {
    id: '12',
    title: 'Программирование для начинающих',
    description: 'Освоение основ программирования на Python с практическими заданиями',
    category: 'education',
    price: '2 000 ₽/занятие',
    duration: '90 мин',
    rating: 4.8,
    reviews: 156,
    popularity: 93,
    tags: ['программирование', 'Python', 'IT', 'обучение', 'разработка'],
    provider: {
      name: 'IT-Академия',
      verified: true,
      rating: 4.8
    }
  },
  {
    id: '13',
    title: 'Подготовка к ЕГЭ интенсив',
    description: 'Интенсивная подготовка по математике и русскому языку с опытными преподавателями',
    category: 'education',
    price: '1 500 ₽/занятие',
    duration: '90 мин',
    rating: 4.9,
    reviews: 312,
    featured: true,
    popularity: 97,
    tags: ['ЕГЭ', 'подготовка', 'репетитор', 'математика', 'русский'],
    provider: {
      name: 'Образовательный центр "Знание"',
      verified: true,
      rating: 4.9
    },
    includes: ['Диагностика знаний', 'Индивидуальный план', 'Пробные тесты', 'Анализ ошибок']
  },
  {
    id: '14',
    title: 'Курсы фотографии продвинутые',
    description: 'Обучение профессиональной фотографии с нуля до продвинутого уровня',
    category: 'education',
    price: '25 000 ₽/курс',
    duration: '8 занятий',
    rating: 4.7,
    reviews: 98,
    popularity: 84,
    tags: ['фотография', 'творчество', 'обучение', 'профессия', 'искусство'],
    provider: {
      name: 'Фотошкола "Объектив"',
      verified: true,
      rating: 4.7
    }
  },
  {
    id: '15',
    title: 'Финансовая грамотность',
    description: 'Практический курс по управлению личными финансами и инвестициям',
    category: 'education',
    price: '18 000 ₽/курс',
    duration: '6 занятий',
    rating: 4.8,
    reviews: 76,
    popularity: 86,
    tags: ['финансы', 'инвестиции', 'бюджет', 'обучение', 'экономика'],
    provider: {
      name: 'Финансовая академия',
      verified: true,
      rating: 4.8
    }
  }
];

// Данные для акций и скидок
const promotions: Promotion[] = [
  {
    id: '1',
    title: 'Первое посещение спа',
    description: 'Скидка 30% на все спа-процедуры для новых клиентов с полным комплексом услуг',
    discount: '-30%',
    validUntil: '15 мар 2025',
    category: 'beauty',
    featured: true,
    bannerColor: COLORS.pink,
    conditions: ['Только для новых клиентов', 'Предварительная запись', 'Действует на все процедуры'],
    usageCount: 45,
    maxUsage: 100,
    terms: 'Акция действует при первом посещении спа-центра. Не суммируется с другими предложениями.'
  },
  {
    id: '2',
    title: 'Ремонт под ключ со скидкой',
    description: 'Комплексный ремонт со скидкой 25% при заказе от 50 000 ₽ с гарантией качества',
    discount: '-25%',
    validUntil: '30 апр 2025',
    category: 'repair',
    featured: true,
    bannerColor: COLORS.orange,
    conditions: ['Минимальная сумма 50 000 ₽', 'Действует на материалы и работу', 'Бесплатный замер'],
    usageCount: 23,
    maxUsage: 50,
    terms: 'Скидка применяется к общей стоимости заказа. Включает все виды отделочных работ.'
  },
  {
    id: '3',
    title: 'Пакет обучения + подарок',
    description: 'При покупке 10 занятий - 2 занятия в подарок с гибким расписанием',
    discount: '2 в подарок',
    validUntil: '20 фев 2025',
    category: 'education',
    featured: false,
    bannerColor: COLORS.blue,
    conditions: ['При оплате пакета из 10 занятий', 'Действует на все курсы', 'Гибкое расписание']
  },
  {
    id: '4',
    title: 'Семейная скидка премиум',
    description: 'Скидка 15% для членов семьи при одновременном заказе любых услуг',
    discount: '-15%',
    validUntil: 'не ограничено',
    category: 'all',
    featured: false,
    bannerColor: COLORS.purple,
    conditions: ['Для 2+ членов семьи', 'Одновременный заказ', 'Любые категории услуг']
  },
  {
    id: '5',
    title: 'Вечерние скидки на красоту',
    description: 'Скидка 20% на все услуги красоты при записи после 18:00',
    discount: '-20%',
    validUntil: '28 фев 2025',
    category: 'beauty',
    featured: true,
    bannerColor: COLORS.rose,
    conditions: ['Запись после 18:00', 'Предварительное бронирование', 'Все салоны красоты'],
    usageCount: 67,
    maxUsage: 200
  },
  {
    id: '6',
    title: 'Скидка на первый ремонт',
    description: 'Специальное предложение 15% на первый заказ ремонтных работ',
    discount: '-15%',
    validUntil: '15 мар 2025',
    category: 'repair',
    featured: false,
    bannerColor: COLORS.amber,
    conditions: ['Только для новых клиентов', 'Любые ремонтные работы', 'Диагностика бесплатно']
  }
];

// Утилиты
const getCategoryColor = (category: Service['category']) => {
  return {
    beauty: COLORS.pink,
    repair: COLORS.orange,
    education: COLORS.blue,
    promotion: COLORS.emerald
  }[category];
};

const getCategoryText = (category: Service['category']) => {
  return {
    beauty: 'Красота и здоровье',
    repair: 'Ремонт и строительство',
    education: 'Образование',
    promotion: 'Акции'
  }[category];
};

const getCategoryIcon = (category: Service['category']) => {
  return {
    beauty: '💅',
    repair: '🔧',
    education: '🎓',
    promotion: '🎁'
  }[category];
};

const getPromotionColor = (category: Promotion['category']) => {
  return {
    beauty: COLORS.pink,
    repair: COLORS.orange,
    education: COLORS.blue,
    all: COLORS.purple
  }[category];
};

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

// Bento Card компонент
const BentoCard = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode;
  className?: string;
  enableEffects?: boolean;
  glowColor?: string;
  onClick?: () => void;
  colSpan?: number;
  rowSpan?: number;
  variant?: 'default' | 'wide' | 'tall' | 'grid' | 'compact';
  gradient?: boolean;
}>(({ 
  children, 
  className = '', 
  enableEffects = true, 
  glowColor = COLORS.blue, 
  onClick, 
  colSpan = 1, 
  rowSpan = 1, 
  variant = 'default',
  gradient = false
}, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!enableEffects || !cardRef.current) return;

    const card = cardRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const relativeX = (x / rect.width) * 100;
      const relativeY = (y / rect.height) * 100;

      card.style.setProperty('--glow-x', `${relativeX}%`);
      card.style.setProperty('--glow-y', `${relativeY}%`);
      card.style.setProperty('--glow-intensity', '1');
    };

    const handleMouseLeave = () => {
      card.style.setProperty('--glow-intensity', '0');
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enableEffects]);

  const colSpanClass = {
    1: '',
    2: 'md:col-span-2 lg:col-span-2',
    3: 'md:col-span-3 lg:col-span-3',
    4: 'md:col-span-4 lg:col-span-4',
  }[colSpan];

  const rowSpanClass = {
    1: '',
    2: 'md:row-span-2 lg:row-span-2',
    3: 'md:row-span-3 lg:row-span-3',
  }[rowSpan];

  const variantClass = {
    default: '',
    wide: 'md:col-span-2 lg:col-span-2',
    tall: 'md:row-span-2 lg:row-span-2',
    grid: 'md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2',
    compact: ''
  }[variant];

  const gradientClass = gradient ? 'bg-gradient-to-br from-white/10 to-white/5' : 'bg-white/5';

  return (
    <div
      ref={ref || cardRef}
      className={`
        relative overflow-hidden 
        rounded-2xl border border-white/10 
        ${gradientClass} backdrop-blur-lg 
        transition-all duration-300 
        hover:border-white/20 hover:bg-white/10
        w-full max-w-full
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${colSpanClass}
        ${rowSpanClass}
        ${variantClass}
        ${className}
      `}
      style={{
        '--glow-x': '50%',
        '--glow-y': '50%',
        '--glow-intensity': '0',
        '--glow-color': glowColor,
      } as React.CSSProperties}
      onClick={onClick}
    >
      {enableEffects && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{
            opacity: 'var(--glow-intensity)',
            background: `radial-gradient(400px circle at var(--glow-x) var(--glow-y), 
                         rgba(var(--glow-color), 0.15) 0%, 
                         rgba(var(--glow-color), 0.08) 30%, 
                         transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
});

BentoCard.displayName = 'BentoCard';

// Modal Component
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md',
  showCloseButton = true
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  showCloseButton?: boolean;
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
    xl: 'max-w-6xl',
    fullscreen: 'max-w-full max-h-full m-4'
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
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              {title && <h3 className="text-white font-bold text-xl">{title}</h3>}
              {showCloseButton && (
                <button
                  className="text-white/60 hover:text-white transition-colors text-2xl p-1"
                  onClick={onClose}
                >
                  ×
                </button>
              )}
            </div>
          )}
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Компонент карточки услуги
const ServiceCard = ({ service, onClick }: { service: Service; onClick?: () => void }) => {
  const categoryColor = getCategoryColor(service.category);
  const categoryIcon = getCategoryIcon(service.category);
  
  return (
    <BentoCard className="p-4 cursor-pointer" glowColor={categoryColor} onClick={onClick} gradient>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{categoryIcon}</span>
            <span 
              className="px-2 py-1 rounded-full text-xs border font-medium"
              style={{
                backgroundColor: `rgba(${categoryColor}, 0.2)`,
                color: `rgb(${categoryColor})`,
                borderColor: `rgba(${categoryColor}, 0.3)`
              }}
            >
              {getCategoryText(service.category)}
            </span>
            {service.featured && (
              <span className="px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">
                🔥 Рекомендуем
              </span>
            )}
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">{service.title}</h3>
          <div className="text-white/60 text-xs mb-2 line-clamp-2">{service.description}</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="text-white font-bold">{service.price}</div>
          <div className="text-white/60">{service.duration}</div>
        </div>
        <div className="flex items-center gap-1 text-xs text-white/60">
          <span className="text-amber-400">⭐ {service.rating}</span>
          <span>({service.reviews})</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-xs">{service.provider.name}</span>
          {service.provider.verified && (
            <span className="text-blue-400 text-xs">✓</span>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {service.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="px-1.5 py-0.5 bg-white/5 text-white/60 rounded text-xs">
              {tag}
            </span>
          ))}
          {service.tags.length > 2 && (
            <span className="px-1.5 py-0.5 bg-white/5 text-white/40 rounded text-xs">
              +{service.tags.length - 2}
            </span>
          )}
        </div>
      </div>

      {service.popularity && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Популярность</span>
            <span>{service.popularity}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1">
            <div 
              className="h-1 rounded-full transition-all duration-500"
              style={{ 
                width: `${service.popularity}%`,
                backgroundColor: `rgb(${categoryColor})`
              }}
            />
          </div>
        </div>
      )}
    </BentoCard>
  );
};

// Компонент карточки акции
const PromotionCard = ({ promotion, onClick }: { promotion: Promotion; onClick?: () => void }) => {
  const promotionColor = promotion.bannerColor || getPromotionColor(promotion.category);
  const progress = promotion.usageCount && promotion.maxUsage 
    ? (promotion.usageCount / promotion.maxUsage) * 100 
    : 0;
  
  return (
    <BentoCard className="p-4 cursor-pointer" glowColor={promotionColor} onClick={onClick} gradient>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🎁</span>
            <span 
              className="px-2 py-1 rounded-full text-xs border font-medium"
              style={{
                backgroundColor: `rgba(${promotionColor}, 0.2)`,
                color: `rgb(${promotionColor})`,
                borderColor: `rgba(${promotionColor}, 0.3)`
              }}
            >
              {promotion.category === 'all' ? 'Все категории' : getCategoryText(promotion.category)}
            </span>
            {promotion.featured && (
              <span className="px-2 py-1 rounded-full text-xs bg-rose-500/20 text-rose-400 border border-rose-500/30">
                🔥 Горящее
              </span>
            )}
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">{promotion.title}</h3>
          <div className="text-white/60 text-xs mb-2">{promotion.description}</div>
        </div>
        <div className="text-right">
          <div 
            className="px-3 py-2 rounded-xl text-white font-bold text-lg"
            style={{
              backgroundColor: `rgba(${promotionColor}, 0.3)`,
              border: `1px solid rgba(${promotionColor}, 0.5)`
            }}
          >
            {promotion.discount}
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm mb-3">
        <div className="flex justify-between">
          <span className="text-white/60">Действует до:</span>
          <span className="text-white">{promotion.validUntil}</span>
        </div>
        
        {promotion.conditions.map((condition, index) => (
          <div key={index} className="flex items-center gap-2 text-white/60 text-xs">
            <div className="w-1 h-1 rounded-full bg-white/40" />
            {condition}
          </div>
        ))}
      </div>

      {promotion.usageCount && promotion.maxUsage && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Использовано</span>
            <span>{promotion.usageCount} / {promotion.maxUsage}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${progress}%`,
                backgroundColor: `rgb(${promotionColor})`
              }}
            />
          </div>
        </div>
      )}

      <button className="w-full mt-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors text-sm">
        Использовать акцию
      </button>
    </BentoCard>
  );
};

// Компонент KPI
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

// Основной компонент страницы клиентских услуг
export default function ClientServicesPage() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price' | 'newest'>('popular');
  
  // Состояния для модальных окон
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // Выбранные элементы
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  // KPI данные
  const servicesKPIs = [
    { 
      title: 'Доступные услуги', 
      value: '156', 
      change: '+12', 
      description: 'в вашем городе', 
      icon: '🛍️', 
      color: COLORS.blue,
      trend: 'up' as const
    },
    { 
      title: 'Активные акции', 
      value: '23', 
      change: '+5', 
      description: 'действующих предложений', 
      icon: '🎁', 
      color: COLORS.pink,
      trend: 'up' as const
    },
    { 
      title: 'Средний рейтинг', 
      value: '4.8', 
      description: 'качество услуг', 
      icon: '⭐', 
      color: COLORS.amber,
      trend: 'stable' as const
    },
    { 
      title: 'Экономия с акциями', 
      value: '15 240 ₽', 
      description: 'за последний месяц', 
      icon: '💰', 
      color: COLORS.emerald,
      trend: 'up' as const
    }
  ];

  // Фильтрация и сортировка данных
  const filteredServices = services
    .filter(service => 
      (activeTab === 'all' || service.category === activeTab) &&
      (service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
       service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'newest':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

  const filteredPromotions = promotions.filter(promotion => 
    activeTab === 'all' || promotion.category === activeTab || promotion.category === 'all'
  );

  const featuredServices = services.filter(service => service.featured);
  const featuredPromotions = promotions.filter(promotion => promotion.featured);

  // Статистика по категориям
  const categoryStats = [
    { category: 'beauty' as const, count: services.filter(s => s.category === 'beauty').length, color: COLORS.pink },
    { category: 'repair' as const, count: services.filter(s => s.category === 'repair').length, color: COLORS.orange },
    { category: 'education' as const, count: services.filter(s => s.category === 'education').length, color: COLORS.blue }
  ];

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

  // Обработчики модальных окон
  const handleViewService = (service: Service) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const handleViewPromotion = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsPromotionModalOpen(true);
  };

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
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
          <BentoCard className="p-6" variant="wide" glowColor={COLORS.purple} gradient>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">🛍️ Клиентские услуги</h1>
                <p className="text-white/60 text-lg mb-4">
                  Широкий спектр услуг для вашего комфорта: красота, ремонт, образование и выгодные акции. 
                  Более 150 проверенных исполнителей в вашем городе.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-pink-400" />
                    <span>Красота и здоровье</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <span>Ремонт и строительство</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Образование</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl mb-3">
                    🛍️
                  </div>
                  <div className="text-white font-bold text-lg">Москва</div>
                  <div className="text-white/60 text-sm">156 услуг доступно</div>
                </motion.div>
                <motion.button
                  className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Стать партнером
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
            <h2 className="text-xl font-semibold text-white">Обзор услуг</h2>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>Обновлено: {currentTime}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {servicesKPIs.map((kpi, index) => (
              <KPIWidget key={index} {...kpi} />
            ))}
          </div>
        </motion.section>

        {/* Featured Promotions */}
        {featuredPromotions.length > 0 && (
          <motion.section 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xl font-semibold text-white">🔥 Горящие акции</h2>
              <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                {featuredPromotions.length} предложений
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {featuredPromotions.map((promotion) => (
                <PromotionCard 
                  key={promotion.id} 
                  promotion={promotion} 
                  onClick={() => handleViewPromotion(promotion)}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Navigation Tabs & Filters */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-wrap gap-2 flex-1">
              {[
                { id: 'all', name: '🛍️ Все услуги', color: 'purple' },
                { id: 'beauty', name: '💅 Красота и здоровье', color: 'pink' },
                { id: 'repair', name: '🔧 Ремонт и строительство', color: 'orange' },
                { id: 'education', name: '🎓 Образование', color: 'blue' },
                { id: 'promotion', name: '🎁 Акции и скидки', color: 'emerald' }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all text-sm ${
                    activeTab === tab.id 
                      ? `bg-${tab.color}-500 text-white shadow-lg` 
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основной контент */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <BentoCard className="p-6" variant="wide" glowColor={COLORS.purple} gradient>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <span>
                    {activeTab === 'all' && '🛍️'}
                    {activeTab === 'beauty' && '💅'}
                    {activeTab === 'repair' && '🔧'}
                    {activeTab === 'education' && '🎓'}
                    {activeTab === 'promotion' && '🎁'}
                  </span>
                  <span>
                    {activeTab === 'all' && 'Все услуги'}
                    {activeTab === 'beauty' && 'Красота и здоровье'}
                    {activeTab === 'repair' && 'Ремонт и строительство'}
                    {activeTab === 'education' && 'Образование'}
                    {activeTab === 'promotion' && 'Акции и скидки'}
                  </span>
                </h2>
                <span className="text-white/60 text-sm">
                  {activeTab === 'promotion' 
                    ? `${filteredPromotions.length} акций` 
                    : `${filteredServices.length} услуг`
                  }
                </span>
              </div>

              {activeTab === 'promotion' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPromotions.map((promotion) => (
                    <PromotionCard 
                      key={promotion.id} 
                      promotion={promotion} 
                      onClick={() => handleViewPromotion(promotion)}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredServices.map((service) => (
                    <ServiceCard 
                      key={service.id} 
                      service={service} 
                      onClick={() => handleViewService(service)}
                    />
                  ))}
                </div>
              )}

              {(activeTab === 'promotion' ? filteredPromotions.length === 0 : filteredServices.length === 0) && (
                <div className="text-center py-12 text-white/60">
                  <div className="text-4xl mb-2">
                    {activeTab === 'promotion' ? '🎁' : '🔍'}
                  </div>
                  <div>
                    {activeTab === 'promotion' ? 'Акции не найдены' : 'Услуги не найдены'}
                  </div>
                  <div className="text-sm">Попробуйте изменить параметры поиска</div>
                </div>
              )}
            </BentoCard>
          </motion.section>

          {/* Боковая панель */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Рекомендуемые услуги */}
            <BentoCard className="p-6" glowColor={COLORS.amber} gradient>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>🔥</span>
                <span>Рекомендуем</span>
              </h3>
              <div className="space-y-3">
                {featuredServices.slice(0, 3).map((service) => (
                  <motion.button 
                    key={service.id}
                    className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewService(service)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-sm mb-1">{service.title}</div>
                        <div className="text-white/60 text-xs">{service.price}</div>
                      </div>
                      <div className="text-amber-400 text-sm">
                        ⭐ {service.rating}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </BentoCard>

            {/* Статистика по категориям */}
            <BentoCard className="p-6" glowColor={COLORS.blue} gradient>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📊</span>
                <span>По категориям</span>
              </h3>
              <div className="space-y-3">
                {categoryStats.map((stat) => (
                  <div key={stat.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{getCategoryIcon(stat.category)}</span>
                      <span className="text-white/80 text-sm">{getCategoryText(stat.category)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/60 text-sm">{stat.count}</span>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `rgb(${stat.color})` }} />
                    </div>
                  </div>
                ))}
              </div>
            </BentoCard>

            {/* Быстрый заказ */}
            <BentoCard className="p-6" glowColor={COLORS.emerald} gradient>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>⚡</span>
                <span>Быстрый заказ</span>
              </h3>
              <div className="space-y-3">
                <select className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 text-sm">
                  <option>Выберите категорию</option>
                  <option>Красота и здоровье</option>
                  <option>Ремонт и строительство</option>
                  <option>Образование</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Опишите задачу..."
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 text-sm"
                />
                <button className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors font-semibold text-sm">
                  Найти исполнителя
                </button>
              </div>
            </BentoCard>

            {/* Популярные теги */}
            <BentoCard className="p-6" glowColor={COLORS.purple} gradient>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>🏷️</span>
                <span>Популярные теги</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {['массаж', 'ремонт', 'обучение', 'спа', 'строительство', 'языки', 'косметология', 'электрика'].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg text-sm transition-colors"
                    onClick={() => setSearchQuery(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </BentoCard>
          </motion.section>
        </div>
      </main>

      {/* Модальное окно услуги */}
      <Modal 
        isOpen={isServiceModalOpen} 
        onClose={() => setIsServiceModalOpen(false)}
        title="🛍️ Детали услуги"
        size="lg"
      >
        {selectedService && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{getCategoryIcon(selectedService.category)}</span>
                  <span 
                    className="px-3 py-1 rounded-full text-sm border font-medium"
                    style={{
                      backgroundColor: `rgba(${getCategoryColor(selectedService.category)}, 0.2)`,
                      color: `rgb(${getCategoryColor(selectedService.category)})`,
                      borderColor: `rgba(${getCategoryColor(selectedService.category)}, 0.3)`
                    }}
                  >
                    {getCategoryText(selectedService.category)}
                  </span>
                  {selectedService.featured && (
                    <span className="px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      🔥 Рекомендуем
                    </span>
                  )}
                </div>
                <h3 className="text-white font-bold text-2xl">{selectedService.title}</h3>
                <p className="text-white/60">{selectedService.description}</p>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-3xl">{selectedService.price}</div>
                <div className="text-white/60 text-sm mt-1">{selectedService.duration}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Рейтинг</div>
                <div className="text-white font-semibold flex items-center gap-1">
                  ⭐ {selectedService.rating} <span className="text-white/60 text-sm">({selectedService.reviews} отзывов)</span>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Исполнитель</div>
                <div className="text-white font-semibold">{selectedService.provider.name}</div>
                <div className="text-white/60 text-sm flex items-center gap-1">
                  {selectedService.provider.verified && <span>✓ Проверен</span>}
                  <span>⭐ {selectedService.provider.rating}</span>
                </div>
              </div>
              {selectedService.availability && (
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm">Доступность</div>
                  <div className="text-white font-semibold text-sm">{selectedService.availability}</div>
                </div>
              )}
              {selectedService.popularity && (
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm">Популярность</div>
                  <div className="text-white font-semibold">{selectedService.popularity}%</div>
                </div>
              )}
            </div>

            {selectedService.includes && selectedService.includes.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-3">Что входит в услугу?</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedService.includes.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="text-white text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedService.tags.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-3">Ключевые особенности</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedService.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-white/5 text-white/60 rounded-lg text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">Преимущества</h4>
              <div className="space-y-2 text-sm text-blue-300">
                <div>• Профессиональное выполнение работы</div>
                <div>• Использование качественных материалов</div>
                <div>• Гарантия на выполненные работы</div>
                <div>• Консультация и поддержка</div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button 
                className="flex-1 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-colors font-semibold"
                onClick={() => handleBookService(selectedService)}
              >
                Забронировать
              </button>
              <button className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
                Добавить в избранное
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно акции */}
      <Modal 
        isOpen={isPromotionModalOpen} 
        onClose={() => setIsPromotionModalOpen(false)}
        title="🎁 Детали акции"
        size="md"
      >
        {selectedPromotion && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-bold text-2xl">{selectedPromotion.title}</h3>
                <p className="text-white/60">{selectedPromotion.description}</p>
              </div>
              <div className="text-right">
                <div 
                  className="px-4 py-3 rounded-xl text-white font-bold text-2xl"
                  style={{
                    backgroundColor: `rgba(${selectedPromotion.bannerColor || getPromotionColor(selectedPromotion.category)}, 0.3)`,
                    border: `2px solid rgba(${selectedPromotion.bannerColor || getPromotionColor(selectedPromotion.category)}, 0.5)`
                  }}
                >
                  {selectedPromotion.discount}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Действует до</div>
                <div className="text-white font-semibold">{selectedPromotion.validUntil}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Категория</div>
                <div className="text-white font-semibold">
                  {selectedPromotion.category === 'all' ? 'Все услуги' : getCategoryText(selectedPromotion.category)}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Условия акции</h4>
              <div className="space-y-2">
                {selectedPromotion.conditions.map((condition, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-white text-sm">{condition}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedPromotion.usageCount && selectedPromotion.maxUsage && (
              <div>
                <h4 className="text-white font-semibold mb-3">Осталось предложений</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white/60">
                    <span>Использовано</span>
                    <span>{selectedPromotion.usageCount} / {selectedPromotion.maxUsage}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(selectedPromotion.usageCount / selectedPromotion.maxUsage) * 100}%`,
                        backgroundColor: `rgb(${selectedPromotion.bannerColor || getPromotionColor(selectedPromotion.category)})`
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedPromotion.terms && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <h4 className="text-amber-400 font-semibold mb-2">Важная информация</h4>
                <div className="text-amber-300 text-sm">{selectedPromotion.terms}</div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button className="flex-1 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-colors font-semibold">
                Использовать акцию
              </button>
              <button className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
                Поделиться
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно бронирования */}
      <Modal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        title="📅 Бронирование услуги"
        size="md"
      >
        {selectedService && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-bold text-xl">{selectedService.title}</h3>
                <p className="text-white/60 text-sm">{selectedService.provider.name}</p>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-2xl">{selectedService.price}</div>
                <div className="text-white/60 text-sm">{selectedService.duration}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm mb-2 block">Дата и время</label>
                <input 
                  type="datetime-local" 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="text-white/80 text-sm mb-2 block">Контактные данные</label>
                <input 
                  type="text" 
                  placeholder="Ваше имя"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 mb-2"
                />
                <input 
                  type="tel" 
                  placeholder="Телефон"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="text-white/80 text-sm mb-2 block">Адрес (если требуется)</label>
                <input 
                  type="text" 
                  placeholder="Адрес выполнения услуги"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="text-white/80 text-sm mb-2 block">Комментарий (необязательно)</label>
                <textarea 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 h-20"
                  placeholder="Дополнительные пожелания..."
                />
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 text-xl">✓</span>
                <div>
                  <div className="text-emerald-400 font-semibold">Безопасная оплата</div>
                  <div className="text-emerald-300 text-sm mt-1">Оплата только после выполнения услуги</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button className="flex-1 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-colors font-semibold">
                Подтвердить бронь
              </button>
              <button 
                className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
                onClick={() => setIsBookingModalOpen(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}