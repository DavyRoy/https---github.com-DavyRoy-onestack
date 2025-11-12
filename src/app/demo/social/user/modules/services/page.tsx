'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

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
  emerald: '16, 185, 129',
  rose: '244, 63, 94',
  indigo: '99, 102, 241',
  teal: '20, 184, 166',
  amber: '245, 158, 11',
} as const;

// Типы данных
interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  services: ServiceItem[];
  stats: {
    total: number;
    available: number;
    rating: number;
    responseTime: string;
  };
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  cost: string;
  rating: number;
  reviews: number;
  requirements: string[];
  features: string[];
  status: 'available' | 'popular' | 'new' | 'limited';
  popularity: number;
  processingTime: string;
  documents: string[];
}

// Моки данных для услуг
const serviceCategories: ServiceCategory[] = [
  {
    id: 'catalog',
    title: '📋 Каталог услуг',
    description: 'Все доступные социальные услуги в одном месте',
    icon: '📋',
    color: COLORS.blue,
    stats: {
      total: 45,
      available: 42,
      rating: 4.7,
      responseTime: '1-2 дня'
    },
    services: [
      {
        id: 'all-services',
        title: 'Полный каталог услуг',
        description: 'Все 45 социальных услуг с фильтрацией по категориям и параметрам. Поиск по ключевым словам, фильтры по доступности и рейтингу.',
        duration: 'Постоянно',
        cost: 'Бесплатно',
        rating: 4.8,
        reviews: 289,
        requirements: ['Регистрация в системе', 'Подтвержденный профиль'],
        features: [
          'Умный поиск по ключевым словам',
          'Фильтры по категориям и статусу',
          'Сортировка по рейтингу и популярности',
          'Избранные услуги и история просмотров',
          'Рекомендации на основе вашего профиля'
        ],
        status: 'available',
        popularity: 95,
        processingTime: 'Мгновенно',
        documents: ['Паспорт', 'СНИЛС']
      },
      {
        id: 'service-search',
        title: 'Умный поиск услуг',
        description: 'Продвинутый поиск с AI-рекомендациями. Находит наиболее подходящие услуги на основе ваших потребностей и истории обращений.',
        duration: 'Мгновенно',
        cost: 'Бесплатно',
        rating: 4.9,
        reviews: 156,
        requirements: ['Регистрация в системе'],
        features: [
          'AI-рекомендации услуг',
          'Автодополнение запросов',
          'История поиска и популярные запросы',
          'Похожие услуги и альтернативы',
          'Быстрые фильтры и сохраненные поиски'
        ],
        status: 'popular',
        popularity: 88,
        processingTime: 'Мгновенно',
        documents: []
      },
      {
        id: 'service-map',
        title: 'Карта доступности услуг',
        description: 'Интерактивная карта с отображением доступных услуг в вашем районе. Показывает ближайшие центры обслуживания.',
        duration: 'Постоянно',
        cost: 'Бесплатно',
        rating: 4.6,
        reviews: 134,
        requirements: ['Разрешение геолокации'],
        features: [
          'Интерактивная карта районов',
          'Фильтры по расстоянию',
          'Режим работы организаций',
          'Отзывы и рейтинги центров',
          'Маршруты проезда'
        ],
        status: 'new',
        popularity: 72,
        processingTime: 'Мгновенно',
        documents: []
      }
    ]
  },
  {
    id: 'financial',
    title: '💰 Материальная помощь',
    description: 'Финансовая поддержка, денежные выплаты и компенсации',
    icon: '💰',
    color: COLORS.emerald,
    stats: {
      total: 12,
      available: 11,
      rating: 4.6,
      responseTime: '3-7 дней'
    },
    services: [
      {
        id: 'one-time-help',
        title: 'Единовременная материальная помощь',
        description: 'Срочная финансовая поддержка в сложных жизненных ситуациях. Рассматривается в приоритетном порядке.',
        duration: 'Однократно',
        cost: 'До 30,000 ₽',
        rating: 4.5,
        reviews: 478,
        requirements: [
          'Среднедушевой доход ниже прожиточного минимума',
          'Наличие трудной жизненной ситуации',
          'Документы, подтверждающие доходы всех членов семьи',
          'Отсутствие задолженностей по ЖКУ'
        ],
        features: [
          'Ускоренное рассмотрение за 3 дня',
          'Онлайн-подача заявления',
          'Персональный куратор',
          'Отслеживание статуса в реальном времени',
          'Консультация по сбору документов'
        ],
        status: 'popular',
        popularity: 92,
        processingTime: '3-5 рабочих дней',
        documents: ['Паспорт', 'Справка о доходах', 'Документы о составе семьи', 'Подтверждение трудной ситуации']
      },
      {
        id: 'utility-subsidy',
        title: 'Субсидия на ЖКУ',
        description: 'Компенсация расходов на коммунальные услуги для малообеспеченных семей и пенсионеров.',
        duration: 'Ежемесячно',
        cost: 'До 70% от суммы',
        rating: 4.7,
        reviews: 892,
        requirements: [
          'Расходы на ЖКУ превышают 22% от общего дохода семьи',
          'Отсутствие задолженностей по коммунальным платежам',
          'Постоянная регистрация по месту жительства'
        ],
        features: [
          'Автоматический ежемесячный перерасчет',
          'Онлайн-отслеживание начислений',
          'Уведомления о выплатах',
          'Консультации по снижению расходов ЖКУ',
          'История всех полученных выплат'
        ],
        status: 'available',
        popularity: 85,
        processingTime: '10-14 рабочих дней',
        documents: ['Паспорт', 'Свидетельства о рождении детей', 'Справка о доходах', 'Квитанции ЖКУ']
      },
      {
        id: 'medical-compensation',
        title: 'Компенсация расходов на лечение',
        description: 'Возмещение затрат на лекарства, медицинские процедуры и реабилитационное оборудование.',
        duration: 'По необходимости',
        cost: 'До 50,000 ₽ в год',
        rating: 4.4,
        reviews: 324,
        requirements: [
          'Наличие медицинских показаний',
          'Официальное назначение врача',
          'Чеки и документы, подтверждающие расходы',
          'Отсутствие аналогичной помощи по ОМС'
        ],
        features: [
          'Широкая номенклатура возмещаемых препаратов',
          'Компенсация дорогостоящих процедур',
          'Возмещение затрат на реабилитацию',
          'Экспертиза медицинской необходимости',
          'Сопровождение на всех этапах'
        ],
        status: 'available',
        popularity: 78,
        processingTime: '15-20 рабочих дней',
        documents: ['Направление врача', 'Чеки на лекарства', 'Медицинские заключения', 'Реквизиты для перевода']
      },
      {
        id: 'child-allowance',
        title: 'Пособие на детей',
        description: 'Регулярные выплаты на детей из малообеспеченных семей. Размер зависит от возраста и количества детей.',
        duration: 'Ежемесячно до 18 лет',
        cost: 'От 1,500 до 15,000 ₽',
        rating: 4.8,
        reviews: 567,
        requirements: [
          'Возраст детей до 18 лет',
          'Среднедушевой доход ниже прожиточного минимума',
          'Российское гражданство у детей и родителей'
        ],
        features: [
          'Автопродление при сохранении условий',
          'Индексация размера выплат',
          'Доплаты за многодетность',
          'Специальные условия для детей-инвалидов',
          'Консультации по увеличению выплат'
        ],
        status: 'popular',
        popularity: 90,
        processingTime: '7-10 рабочих дней',
        documents: ['Паспорта родителей', 'Свидетельства о рождении', 'Справка о доходах', 'Справка о составе семьи']
      }
    ]
  },
  {
    id: 'legal',
    title: '⚖️ Юридическая помощь',
    description: 'Бесплатные юридические консультации, представительство и правовая поддержка',
    icon: '⚖️',
    color: COLORS.indigo,
    stats: {
      total: 15,
      available: 15,
      rating: 4.8,
      responseTime: '1-3 дня'
    },
    services: [
      {
        id: 'legal-consultation',
        title: 'Юридическая консультация',
        description: 'Комплексная правовая консультация по любым вопросам от опытных юристов. Очно, онлайн или по телефону.',
        duration: '1-2 часа',
        cost: 'Бесплатно',
        rating: 4.8,
        reviews: 1247,
        requirements: ['Регистрация в системе', 'Описание правовой ситуации'],
        features: [
          'Консультации очно, онлайн и по телефону',
          'Подготовка правовых заключений',
          'Анализ документов и рисков',
          'Рекомендации по дальнейшим действиям',
          'Подбор relevantного законодательства'
        ],
        status: 'popular',
        popularity: 96,
        processingTime: '1-2 рабочих дня',
        documents: ['Документы по вопросу', 'Описание ситуации']
      },
      {
        id: 'document-preparation',
        title: 'Подготовка документов',
        description: 'Профессиональное составление исковых заявлений, жалоб, ходатайств и других правовых документов.',
        duration: '1-5 дней',
        cost: 'Бесплатно',
        rating: 4.9,
        reviews: 892,
        requirements: ['Предварительная консультация', 'Исходные данные и документы'],
        features: [
          'Составление исковых заявлений',
          'Подготовка жалоб в госорганы',
          'Оформление договоров и соглашений',
          'Проверка готовых документов',
          'Электронная подача в инстанции'
        ],
        status: 'available',
        popularity: 88,
        processingTime: '2-5 рабочих дней',
        documents: ['Исходные документы', 'Данные сторон', 'Описание требований']
      },
      {
        id: 'court-support',
        title: 'Сопровождение в суде',
        description: 'Полное представительство интересов в судебных органах всех инстанций. Включает подготовку и участие в заседаниях.',
        duration: 'По сроку дела',
        cost: 'Бесплатно',
        rating: 4.7,
        reviews: 456,
        requirements: ['Наличие судебного дела', 'Доверенность на представительство'],
        features: [
          'Полное ведение судебного дела',
          'Участие во всех заседаниях',
          'Подготовка процессуальных документов',
          'Обжалование судебных решений',
          'Контроль исполнения решений'
        ],
        status: 'available',
        popularity: 82,
        processingTime: 'В течение 3 рабочих дней',
        documents: ['Судебные документы', 'Доверенность', 'Паспорт']
      },
      {
        id: 'housing-legal-help',
        title: 'Жилищно-правовая помощь',
        description: 'Специализированная помощь по вопросам жилищного права: ипотека, аренда, коммунальные услуги, соседские споры.',
        duration: 'По необходимости',
        cost: 'Бесплатно',
        rating: 4.6,
        reviews: 378,
        requirements: ['Наличие жилищного вопроса', 'Документы на жилье'],
        features: [
          'Консультации по ЖКХ и ипотеке',
          'Помощь в спорах с управляющими компаниями',
          'Защита прав арендаторов и собственников',
          'Вопросы капитального ремонта',
          'Споры с соседями по коммунальным вопросам'
        ],
        status: 'available',
        popularity: 75,
        processingTime: '3-5 рабочих дней',
        documents: ['Документы на жилье', 'Договоры', 'Квитанции ЖКУ']
      }
    ]
  },
  {
    id: 'medical',
    title: '🏥 Медицинская помощь',
    description: 'Медицинские услуги, оздоровительные программы и реабилитация',
    icon: '🏥',
    color: COLORS.rose,
    stats: {
      total: 18,
      available: 17,
      rating: 4.7,
      responseTime: '1-5 дней'
    },
    services: [
      {
        id: 'doctor-home',
        title: 'Вызов врача на дом',
        description: 'Выезд терапевта или узкого специалиста на дом. Экстренные и плановые визиты, включая выходные.',
        duration: '2-6 часов',
        cost: 'Бесплатно',
        rating: 4.6,
        reviews: 892,
        requirements: [
          'Медицинские показания',
          'Запись через систему за 2 часа',
          'Наличие полиса ОМС'
        ],
        features: [
          'Выезд терапевта и узких специалистов',
          'Экстренные вызовы в течение 2 часов',
          'Проведение простых процедур на дому',
          'Выписка рецептов и направлений',
          'Координация с участковым врачом'
        ],
        status: 'popular',
        popularity: 94,
        processingTime: '2-6 часов',
        documents: ['Паспорт', 'Полис ОМС', 'СНИЛС']
      },
      {
        id: 'medicine-supply',
        title: 'Лекарственное обеспечение',
        description: 'Бесплатное предоставление лекарственных препаратов по рецепту врача. Доставка на дом или самовывоз.',
        duration: 'По рецепту',
        cost: 'Бесплатно',
        rating: 4.5,
        reviews: 1567,
        requirements: [
          'Рецепт врача установленного образца',
          'Вхождение в льготную категорию',
          'Наличие препарата в перечне'
        ],
        features: [
          'Широкая номенклатура препаратов',
          'Доставка на дом в день обращения',
          'Автоматическое пополнение рецептов',
          'Уведомления о наличии препаратов',
          'Консультация фармацевта'
        ],
        status: 'available',
        popularity: 89,
        processingTime: '1-3 рабочих дня',
        documents: ['Рецепт врача', 'Паспорт', 'Документы льготной категории']
      },
      {
        id: 'rehabilitation',
        title: 'Реабилитационные программы',
        description: 'Индивидуальные программы восстановления после заболеваний, операций и травм. Комплексный подход.',
        duration: '1-12 месяцев',
        cost: 'Бесплатно',
        rating: 4.8,
        reviews: 723,
        requirements: [
          'Направление лечащего врача',
          'Медицинские показания к реабилитации',
          'Отсутствие противопоказаний'
        ],
        features: [
          'Индивидуальная программа реабилитации',
          'Контроль прогресса и корректировка',
          'Команда специалистов: ЛФК, массаж, физиотерапия',
          'Психологическая поддержка',
          'Социальная адаптация'
        ],
        status: 'available',
        popularity: 83,
        processingTime: '7-10 рабочих дней',
        documents: ['Направление врача', 'Медицинская карта', 'Результаты обследований']
      },
      {
        id: 'medical-equipment',
        title: 'Технические средства реабилитации',
        description: 'Предоставление во временное пользование медицинского оборудования и средств реабилитации.',
        duration: 'До 6 месяцев',
        cost: 'Бесплатно',
        rating: 4.4,
        reviews: 445,
        requirements: [
          'Медицинские показания',
          'Заключение врачебной комиссии',
          'Отсутствие аналогичного оборудования'
        ],
        features: [
          'Кресла-каталки и ходунки',
          'Противоскользящие устройства',
          'Средства для слабовидящих',
          'Доставка и установка оборудования',
          'Обучение использованию'
        ],
        status: 'limited',
        popularity: 71,
        processingTime: '10-14 рабочих дней',
        documents: ['Заключение ВК', 'Паспорт', 'Документы об инвалидности']
      }
    ]
  },
  {
    id: 'psychological',
    title: '🧠 Психологическая помощь',
    description: 'Психологическая поддержка, консультации и терапевтические программы',
    icon: '🧠',
    color: COLORS.purple,
    stats: {
      total: 9,
      available: 9,
      rating: 4.9,
      responseTime: '1-2 дня'
    },
    services: [
      {
        id: 'psycho-consultation',
        title: 'Психологическая консультация',
        description: 'Индивидуальные сессии с профессиональным психологом. Различные методики и подходы.',
        duration: '50-60 минут',
        cost: 'Бесплатно',
        rating: 4.9,
        reviews: 1567,
        requirements: [
          'Регистрация в системе',
          'Заполнение анкеты перед первой консультацией'
        ],
        features: [
          'Конфиденциальность и анонимность',
          'Различные терапевтические методики',
          'Подбор психолога по специализации',
          'Онлайн и очный формат',
          'Поддержка между сессиями'
        ],
        status: 'popular',
        popularity: 97,
        processingTime: '1-2 рабочих дня',
        documents: ['Анкета клиента']
      },
      {
        id: 'crisis-support',
        title: 'Кризисная поддержка',
        description: 'Срочная психологическая помощь в острых кризисных ситуациях. Круглосуточная доступность.',
        duration: '24/7',
        cost: 'Бесплатно',
        rating: 4.8,
        reviews: 892,
        requirements: ['Обращение в службу', 'Описание кризисной ситуации'],
        features: [
          'Круглосуточная доступность',
          'Полная анонимность',
          'Мгновенная связь со специалистом',
          'Профессиональные психологи с crisis training',
          'Последующее сопровождение'
        ],
        status: 'available',
        popularity: 85,
        processingTime: 'Мгновенно',
        documents: []
      },
      {
        id: 'family-therapy',
        title: 'Семейная терапия',
        description: 'Консультации для пар и семей. Решение конфликтов, улучшение коммуникации, кризисы отношений.',
        duration: '1-1.5 часа',
        cost: 'Бесплатно',
        rating: 4.7,
        reviews: 567,
        requirements: [
          'Согласие всех участников терапии',
          'Предварительная индивидуальная консультация'
        ],
        features: [
          'Работа с семейными парами',
          'Детско-родительские отношения',
          'Разрешение семейных конфликтов',
          'Коммуникативные тренинги',
          'Поддержка в кризисных ситуациях семьи'
        ],
        status: 'available',
        popularity: 79,
        processingTime: '3-5 рабочих дней',
        documents: ['Согласие участников']
      },
      {
        id: 'group-therapy',
        title: 'Групповая терапия',
        description: 'Терапевтические группы по различным темам: стресс, тревожность, социальная адаптация.',
        duration: '1.5-2 часа',
        cost: 'Бесплатно',
        rating: 4.6,
        reviews: 334,
        requirements: [
          'Предварительное собеседование',
          'Готовность к групповой работе',
          'Конфиденциальность информации группы'
        ],
        features: [
          'Тематические терапевтические группы',
          'Поддержка участников',
          'Профессиональная модерация',
          'Безопасное пространство',
          'Регулярные встречи'
        ],
        status: 'new',
        popularity: 68,
        processingTime: '5-7 рабочих дней',
        documents: ['Анкета участника']
      }
    ]
  }
];

// Bento Card компонент
const BentoCard = ({ 
  children, 
  className = '', 
  glowColor = COLORS.blue,
  onClick 
}: { 
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      className={`
        relative overflow-hidden 
        rounded-2xl border border-white/10 
        bg-white/5 backdrop-blur-lg 
        transition-all duration-300 
        hover:border-white/20 hover:bg-white/10
        w-full max-w-full
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

// Service Card компонент
const ServiceCard = ({ service, categoryColor }: { service: ServiceItem; categoryColor: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    available: { label: 'Доступно', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
    popular: { label: 'Популярно', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
    new: { label: 'Новое', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
    limited: { label: 'Ограничено', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' }
  };

  const status = statusConfig[service.status];

  return (
    <BentoCard
      className="p-4 sm:p-6 h-full"
      glowColor={categoryColor}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                {service.title}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full border ${status.color}`}>
                {status.label}
              </span>
            </div>
            <p className="text-white/60 text-xs sm:text-sm line-clamp-2">
              {service.description}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <div className="text-white font-bold text-sm">{service.duration}</div>
            <div className="text-white/60 text-xs">Срок</div>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <div className="text-white font-bold text-sm">{service.cost}</div>
            <div className="text-white/60 text-xs">Стоимость</div>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <div className="text-white font-bold text-sm">{service.processingTime}</div>
            <div className="text-white/60 text-xs">Рассмотрение</div>
          </div>
        </div>

        {/* Rating and Popularity */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-xs text-white/60">
            <div className="flex items-center gap-1">
              <span>⭐ {service.rating}</span>
              <span>({service.reviews})</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🔥 {service.popularity}%</span>
            </div>
          </div>
          <button className="text-white/80 hover:text-white transition-colors text-xs">
            {isExpanded ? 'Свернуть' : 'Подробнее →'}
          </button>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-4 border-t border-white/10">
                {/* Requirements */}
                <div>
                  <h4 className="text-white font-medium text-sm mb-2">📋 Требования:</h4>
                  <ul className="space-y-1">
                    {service.requirements.map((req, index) => (
                      <li key={index} className="text-white/60 text-xs flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-white/40"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Documents */}
                {service.documents.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium text-sm mb-2">📄 Необходимые документы:</h4>
                    <ul className="space-y-1">
                      {service.documents.map((doc, index) => (
                        <li key={index} className="text-white/60 text-xs flex items-center gap-2">
                          <span className="text-blue-400">•</span>
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Features */}
                <div>
                  <h4 className="text-white font-medium text-sm mb-2">✨ Возможности:</h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="text-white/60 text-xs flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <motion.button
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📝 Подать заявку на услугу
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BentoCard>
  );
};

// Category Card компонент
const CategoryCard = ({ category, isExpanded, onToggle }: { 
  category: ServiceCategory; 
  isExpanded: boolean; 
  onToggle: () => void;
}) => {
  return (
    <BentoCard
      className="p-4 sm:p-6"
      glowColor={category.color}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div 
          className="flex items-start justify-between mb-4 cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="text-2xl sm:text-3xl">{category.icon}</div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-bold text-lg sm:text-xl mb-1 truncate">
                {category.title}
              </h2>
              <p className="text-white/60 text-sm truncate">
                {category.description}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-white/60 text-lg flex-shrink-0 ml-2"
          >
            ▼
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <div className="text-white font-bold text-sm">{category.stats.total}</div>
            <div className="text-white/60 text-xs">Всего услуг</div>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <div className="text-white font-bold text-sm">{category.stats.available}</div>
            <div className="text-white/60 text-xs">Доступно</div>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <div className="text-white font-bold text-sm">{category.stats.rating}/5</div>
            <div className="text-white/60 text-xs">Рейтинг</div>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <div className="text-white font-bold text-sm">{category.stats.responseTime}</div>
            <div className="text-white/60 text-xs">Ответ</div>
          </div>
        </div>

        {/* Services Grid */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                {category.services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    categoryColor={category.color}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BentoCard>
  );
};

// Quick Stats компонент
const QuickStats = () => {
  const totalServices = serviceCategories.reduce((sum, cat) => sum + cat.stats.total, 0);
  const availableServices = serviceCategories.reduce((sum, cat) => sum + cat.stats.available, 0);
  const avgRating = (serviceCategories.reduce((sum, cat) => sum + cat.stats.rating, 0) / serviceCategories.length).toFixed(1);

  const stats = [
    { label: 'Всего услуг', value: totalServices.toString(), icon: '📊', trend: '+5', color: 'text-blue-400' },
    { label: 'Доступно сейчас', value: availableServices.toString(), icon: '✅', trend: '+3', color: 'text-green-400' },
    { label: 'Средний рейтинг', value: avgRating, icon: '⭐', trend: '+0.2', color: 'text-yellow-400' },
    { label: 'Категорий услуг', value: serviceCategories.length.toString(), icon: '📁', trend: '+1', color: 'text-purple-400' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <BentoCard key={index} className="p-4 text-center">
          <div className="text-2xl mb-2">{stat.icon}</div>
          <div className="text-white font-bold text-xl mb-1">{stat.value}</div>
          <div className="text-white/60 text-sm mb-1">{stat.label}</div>
          <div className={`text-xs ${stat.color}`}>{stat.trend}</div>
        </BentoCard>
      ))}
    </div>
  );
};

// Search and Filter компонент
const SearchFilter = ({ onSearch, onFilter }: { 
  onSearch: (query: string) => void;
  onFilter: (category: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BentoCard className="p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="flex-1 w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Поиск услуг (например, 'материальная помощь', 'юрист', 'лекарства')..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch(e.target.value);
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition-colors text-sm"
            />
          </div>
        </div>

        {/* Category Filter */}
        <select
          onChange={(e) => onFilter(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20 transition-colors text-sm min-w-[180px]"
        >
          <option value="all">Все категории</option>
          {serviceCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>
    </BentoCard>
  );
};

// Основной компонент страницы услуг
export default function ServicesPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCategoryToggle = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
  };

  // Фильтрация категорий
  const filteredCategories = serviceCategories.filter(category => {
    const matchesCategory = selectedCategory === 'all' || category.id === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.services.some(service => 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>
      {/* Header как в дашборде */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link 
                href="/demo/social/users"
                className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2"
              >
                ← Назад к дашборду
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <motion.div 
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white flex-shrink-0"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium">Система активна</span>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section как в дашборде */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <BentoCard className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-grow min-w-0">
                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 leading-tight">
                  Каталог социальных услуг
                </h1>
                <p className="text-white/60 text-base lg:text-lg max-w-2xl">
                  99 услуг • 6 основных категорий • Бесплатная помощь
                </p>
              </div>
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white flex-shrink-0"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium">94 услуги доступно</span>
              </motion.div>
            </div>
          </BentoCard>
        </motion.section>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6">
        {/* Quick Stats */}
        <QuickStats />

        {/* Search and Filter */}
        <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />

        {/* Categories */}
        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isExpanded={expandedCategory === category.id}
              onToggle={() => handleCategoryToggle(category.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <BentoCard className="p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-white font-bold text-xl mb-3">Услуги не найдены</h3>
            <p className="text-white/60 text-sm mb-4">
              Попробуйте изменить параметры поиска или выбрать другую категорию
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium"
            >
              Сбросить фильтры
            </button>
          </BentoCard>
        )}

        {/* Help Section */}
        <motion.section 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <BentoCard className="p-6">
            <div className="text-center">
              <div className="text-3xl mb-3">❓</div>
              <h3 className="text-white font-bold text-lg mb-2">Нужна помощь с выбором услуги?</h3>
              <p className="text-white/60 text-sm mb-4">
                Наши специалисты помогут подобрать最适合щую услугу и проконсультируют по всем вопросам
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium">
                  💬 Онлайн-консультация
                </button>
                <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 text-sm font-medium">
                  📞 Позвонить специалисту
                </button>
              </div>
            </div>
          </BentoCard>
        </motion.section>
      </main>
    </div>
  );
}