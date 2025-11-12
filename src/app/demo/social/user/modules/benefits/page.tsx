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
interface Benefit {
  id: string;
  title: string;
  category: string;
  status: 'active' | 'pending' | 'expired' | 'suspended';
  description: string;
  amount: string;
  frequency: string;
  nextPayment?: string;
  startDate: string;
  endDate?: string;
  requirements: string[];
  documents: string[];
  features: string[];
  progress?: number;
  assignedTo?: string;
  notes: string[];
  utilization: {
    used: number;
    total: number;
    percentage: number;
  };
  paymentHistory: Payment[];
}

interface Payment {
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
  description: string;
}

interface BenefitCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  benefits: Benefit[];
  stats: {
    total: number;
    active: number;
    totalAmount: string;
    utilization: number;
  };
}

// Моки данных для льгот
const benefitCategories: BenefitCategory[] = [
  {
    id: 'overview',
    title: '📊 Обзор льгот',
    description: 'Все ваши действующие и доступные льготы в одном месте',
    icon: '📊',
    color: COLORS.blue,
    stats: {
      total: 12,
      active: 8,
      totalAmount: '28,456 ₽/мес',
      utilization: 85
    },
    benefits: [
      {
        id: 'BEN-2024-001',
        title: 'Сводка по всем льготам',
        category: 'Обзор',
        status: 'active',
        description: 'Полный обзор всех доступных вам льгот и социальных программ. Включает пенсионные выплаты, льготы по инвалидности и другие виды поддержки.',
        amount: '28,456 ₽',
        frequency: 'ежемесячно',
        nextPayment: '25.12.2024',
        startDate: '01.01.2024',
        requirements: ['Подтвержденный статус', 'Актуальные документы'],
        documents: ['Паспорт', 'СНИЛС', 'Документы по льготам'],
        features: [
          'Единый просмотр всех выплат',
          'График предстоящих платежей',
          'История полученных выплат',
          'Уведомления об изменениях',
          'Консультация специалиста'
        ],
        notes: [
          'Следующая индексация выплат: январь 2025',
          'Доступна подача заявок на новые льготы',
          'Рекомендовано оформление дополнительных пособий'
        ],
        utilization: {
          used: 8,
          total: 12,
          percentage: 67
        },
        paymentHistory: [
          {
            date: '25.11.2024',
            amount: '28,456 ₽',
            status: 'paid',
            description: 'Ежемесячные выплаты'
          },
          {
            date: '25.10.2024',
            amount: '28,456 ₽',
            status: 'paid',
            description: 'Ежемесячные выплаты'
          },
          {
            date: '25.09.2024',
            amount: '27,890 ₽',
            status: 'paid',
            description: 'Ежемесячные выплаты'
          }
        ]
      },
      {
        id: 'BEN-2024-002',
        title: 'Новые доступные льготы',
        category: 'Обзор',
        status: 'pending',
        description: 'Программы поддержки, на которые вы можете претендовать. Включает новые региональные и федеральные программы.',
        amount: 'До 15,000 ₽',
        frequency: 'разовые/ежемесячно',
        startDate: '01.12.2024',
        requirements: ['Соответствие критериям', 'Подача заявки'],
        documents: ['Заявление', 'Подтверждающие документы'],
        features: [
          'Автоподбор подходящих программ',
          'Помощь в оформлении',
          'Онлайн-подача заявок',
          'Отслеживание статуса',
          'Консультации специалистов'
        ],
        progress: 45,
        notes: [
          'Доступно 4 новые программы поддержки',
          'Срок подачи заявок до 31.12.2024',
          'Требуется подтверждение доходов'
        ],
        utilization: {
          used: 0,
          total: 4,
          percentage: 0
        },
        paymentHistory: []
      }
    ]
  },
  {
    id: 'pension',
    title: '👵 Пенсионные льготы',
    description: 'Пенсионные выплаты и дополнительные льготы для пенсионеров',
    icon: '👵',
    color: COLORS.emerald,
    stats: {
      total: 4,
      active: 3,
      totalAmount: '18,456 ₽/мес',
      utilization: 75
    },
    benefits: [
      {
        id: 'BEN-2024-003',
        title: 'Страховая пенсия по старости',
        category: 'Пенсионные',
        status: 'active',
        description: 'Основная страховая пенсия по старости. Начисляется с учетом трудового стажа и пенсионных баллов.',
        amount: '18,456 ₽',
        frequency: 'ежемесячно',
        nextPayment: '25.12.2024',
        startDate: '15.03.2020',
        requirements: [
          'Достижение пенсионного возраста',
          'Минимальный страховой стаж',
          'Минимальное количество пенсионных баллов'
        ],
        documents: ['Паспорт', 'СНИЛС', 'Трудовая книжка'],
        features: [
          'Ежегодная индексация',
          'Возможность работать и получать пенсию',
          'Доплаты до прожиточного минимума',
          'Социальные доплаты',
          'Налоговые льготы'
        ],
        notes: [
          'Следующая индексация: 1 января 2025 года',
          'Стаж: 42 года',
          'Пенсионные баллы: 145.6'
        ],
        utilization: {
          used: 1,
          total: 1,
          percentage: 100
        },
        paymentHistory: [
          {
            date: '25.11.2024',
            amount: '18,456 ₽',
            status: 'paid',
            description: 'Страховая пенсия'
          },
          {
            date: '25.10.2024',
            amount: '18,456 ₽',
            status: 'paid',
            description: 'Страховая пенсия'
          }
        ]
      },
      {
        id: 'BEN-2024-004',
        title: 'Компенсация расходов на ЖКУ',
        category: 'Пенсионные',
        status: 'active',
        description: 'Субсидия на оплату жилищно-коммунальных услуг для пенсионеров. Компенсация 50% от суммы платежей.',
        amount: '3,240 ₽',
        frequency: 'ежемесячно',
        nextPayment: '20.12.2024',
        startDate: '01.06.2021',
        requirements: [
          'Проживание в жилом помещении',
          'Отсутствие задолженности по ЖКУ',
          'Расходы на ЖКУ более 22% дохода'
        ],
        documents: ['Квитанции ЖКУ', 'Справка о доходах'],
        features: [
          'Компенсация 50% от суммы',
          'Автоматическое продление',
          'Онлайн-отслеживание начислений',
          'Заявление на перерасчет'
        ],
        notes: [
          'Сумма пересчитывается ежеквартально',
          'Действует до изменения условий проживания'
        ],
        utilization: {
          used: 1,
          total: 1,
          percentage: 100
        },
        paymentHistory: [
          {
            date: '20.11.2024',
            amount: '3,240 ₽',
            status: 'paid',
            description: 'Компенсация ЖКУ'
          }
        ]
      },
      {
        id: 'BEN-2024-005',
        title: 'Бесплатный проезд в городском транспорте',
        category: 'Пенсионные',
        status: 'active',
        description: 'Льготный проезд в общественном транспорте города. Действует на все виды муниципального транспорта.',
        amount: 'Бесплатно',
        frequency: 'постоянно',
        startDate: '01.01.2022',
        requirements: ['Пенсионное удостоверение', 'Местная прописка'],
        documents: ['Социальная карта'],
        features: [
          'Неограниченное количество поездок',
          'Все виды городского транспорта',
          'Возможность пополнения онлайн',
          'Замена карты при утере'
        ],
        notes: [
          'Карта действительна до 31.12.2025',
          'Требуется ежегодное подтверждение'
        ],
        utilization: {
          used: 1,
          total: 1,
          percentage: 100
        },
        paymentHistory: []
      }
    ]
  },
  {
    id: 'disability',
    title: '♿ Инвалидность',
    description: 'Льготы и выплаты для людей с инвалидностью',
    icon: '♿',
    color: COLORS.indigo,
    stats: {
      total: 6,
      active: 5,
      totalAmount: '5,240 ₽/мес',
      utilization: 83
    },
    benefits: [
      {
        id: 'BEN-2024-006',
        title: 'Ежемесячная денежная выплата (ЕДВ)',
        category: 'Инвалидность',
        status: 'active',
        description: 'Ежемесячная денежная выплата для инвалидов II группы. Включает денежный эквивалент набора социальных услуг.',
        amount: '3,240 ₽',
        frequency: 'ежемесячно',
        nextPayment: '25.12.2024',
        startDate: '15.08.2023',
        endDate: '15.08.2025',
        requirements: [
          'Установленная инвалидность II группы',
          'Действующая ИПРА',
          'Отказ от набора социальных услуг'
        ],
        documents: ['Свидетельство об инвалидности', 'ИПРА'],
        features: [
          'Ежегодная индексация',
          'Возможность получать НСУ в натуральной форме',
          'Доплаты за иждивенцев',
          'Автопродление при подтверждении инвалидности'
        ],
        notes: [
          'Следующее переосвидетельствование: август 2025',
          'Включен полный пакет НСУ'
        ],
        utilization: {
          used: 1,
          total: 1,
          percentage: 100
        },
        paymentHistory: [
          {
            date: '25.11.2024',
            amount: '3,240 ₽',
            status: 'paid',
            description: 'ЕДВ по инвалидности'
          }
        ]
      },
      {
        id: 'BEN-2024-007',
        title: 'Компенсация за лекарственные средства',
        category: 'Инвалидность',
        status: 'active',
        description: 'Возмещение расходов на приобретение лекарственных препаратов по рецепту врача.',
        amount: 'До 2,000 ₽',
        frequency: 'ежемесячно',
        nextPayment: '15.12.2024',
        startDate: '01.09.2023',
        requirements: [
          'Рецепт врача',
          'Чеки на приобретение лекарств',
          'Вхождение препарата в перечень'
        ],
        documents: ['Рецепты', 'Фискальные чеки'],
        features: [
          'Широкая номенклатура препаратов',
          'Онлайн-подача заявки на компенсацию',
          'Быстрая обработка заявок',
          'Консультация фармацевта'
        ],
        notes: [
          'Лимит: 2,000 ₽ в месяц',
          'Неиспользованный остаток не переносится'
        ],
        utilization: {
          used: 1,
          total: 1,
          percentage: 100
        },
        paymentHistory: [
          {
            date: '15.11.2024',
            amount: '1,850 ₽',
            status: 'paid',
            description: 'Компенсация за лекарства'
          }
        ]
      },
      {
        id: 'BEN-2024-008',
        title: 'Санаторно-курортное лечение',
        category: 'Инвалидность',
        status: 'active',
        description: 'Обеспечение санаторно-курортным лечением по медицинским показаниям. Включает проезд к месту лечения.',
        amount: 'Бесплатно',
        frequency: 'ежегодно',
        startDate: '01.01.2024',
        requirements: [
          'Медицинские показания',
          'Направление врачебной комиссии',
          'Отсутствие противопоказаний'
        ],
        documents: ['Санитарно-курортная карта', 'Направление'],
        features: [
          'Путевка в санаторий',
          'Проезд к месту лечения и обратно',
          'Лечебные процедуры по показаниям',
          'Питание и проживание'
        ],
        notes: [
          'Следующая путевка доступна с марта 2025',
          'Приоритет на санатории местного значения'
        ],
        utilization: {
          used: 1,
          total: 1,
          percentage: 100
        },
        paymentHistory: []
      }
    ]
  },
  {
    id: 'family',
    title: '👨‍👩‍👧‍👦 Многодетным семьям',
    description: 'Поддержка для многодетных семей и семей с детьми',
    icon: '👨‍👩‍👧‍👦',
    color: COLORS.orange,
    stats: {
      total: 5,
      active: 3,
      totalAmount: '8,300 ₽/мес',
      utilization: 60
    },
    benefits: [
      {
        id: 'BEN-2024-009',
        title: 'Ежемесячное пособие на ребенка',
        category: 'Многодетные семьи',
        status: 'active',
        description: 'Регулярная выплата на каждого ребенка в многодетной семье. Размер зависит от возраста ребенка и региона.',
        amount: '2,800 ₽',
        frequency: 'ежемесячно',
        nextPayment: '20.12.2024',
        startDate: '01.01.2023',
        requirements: [
          'Наличие 3 и более детей',
          'Возраст детей до 18 лет',
          'Среднедушевой доход ниже прожиточного минимума'
        ],
        documents: ['Свидетельства о рождении', 'Справка о доходах'],
        features: [
          'Выплата на каждого ребенка',
          'Ежегодная индексация',
          'Автопродление до совершеннолетия',
          'Доплаты за детей-инвалидов'
        ],
        notes: [
          'Действует на 2 детей из 3',
          'Сумма индексируется ежегодно'
        ],
        utilization: {
          used: 2,
          total: 3,
          percentage: 67
        },
        paymentHistory: [
          {
            date: '20.11.2024',
            amount: '5,600 ₽',
            status: 'paid',
            description: 'Пособие на 2 детей'
          }
        ]
      },
      {
        id: 'BEN-2024-010',
        title: 'Компенсация школьного питания',
        category: 'Многодетные семьи',
        status: 'active',
        description: 'Возмещение затрат на питание детей в образовательных учреждениях. Действует для школьников 1-11 классов.',
        amount: '1,500 ₽',
        frequency: 'ежемесячно',
        nextPayment: '15.12.2024',
        startDate: '01.09.2023',
        requirements: [
          'Обучение ребенка в школе',
          'Отсутствие задолженности по платежам',
          'Многодетный статус семьи'
        ],
        documents: ['Справка из школы', 'Документы на детей'],
        features: [
          'Компенсация 100% стоимости питания',
          'Автоматическое начисление',
          'Не требует подачи заявления',
          'Действует в учебные месяцы'
        ],
        notes: [
          'Действует для 1 ребенка школьного возраста',
          'Не выплачивается в летние месяцы'
        ],
        utilization: {
          used: 1,
          total: 1,
          percentage: 100
        },
        paymentHistory: [
          {
            date: '15.11.2024',
            amount: '1,500 ₽',
            status: 'paid',
            description: 'Компенсация питания'
          }
        ]
      }
    ]
  },
  {
    id: 'veteran',
    title: '🎖️ Ветераны',
    description: 'Льготы для ветеранов труда и боевых действий',
    icon: '🎖️',
    color: COLORS.amber,
    stats: {
      total: 4,
      active: 3,
      totalAmount: '4,200 ₽/мес',
      utilization: 75
    },
    benefits: [
      {
        id: 'BEN-2024-011',
        title: 'Ветеранская выплата',
        category: 'Ветераны',
        status: 'active',
        description: 'Ежемесячная денежная выплата ветеранам труда. Устанавливается в дополнение к пенсии.',
        amount: '4,200 ₽',
        frequency: 'ежемесячно',
        nextPayment: '25.12.2024',
        startDate: '01.01.2022',
        requirements: [
          'Звание "Ветеран труда"',
          'Пенсионный возраст',
          'Соответствующий трудовой стаж'
        ],
        documents: ['Ветеранское удостоверение', 'Трудовая книжка'],
        features: [
          'Пожизненная выплата',
          'Ежегодная индексация',
          'Не зависит от других доходов',
          'Автоматическое начисление'
        ],
        notes: [
          'Сумма индексируется ежегодно',
          'Не требует ежегодного подтверждения'
        ],
        utilization: {
          used: 1,
          total: 1,
          percentage: 100
        },
        paymentHistory: [
          {
            date: '25.11.2024',
            amount: '4,200 ₽',
            status: 'paid',
            description: 'Ветеранская выплата'
          }
        ]
      },
      {
        id: 'BEN-2024-012',
        title: 'Компенсация расходов на протезирование',
        category: 'Ветераны',
        status: 'active',
        description: 'Возмещение затрат на зубное протезирование и другие виды протезов. Действует в государственных учреждениях.',
        amount: 'До 25,000 ₽',
        frequency: 'раз в 5 лет',
        startDate: '01.01.2023',
        requirements: [
          'Ветеранское удостоверение',
          'Медицинские показания',
          'Обращение в государственную клинику'
        ],
        documents: ['Медицинское заключение', 'Чеки на услуги'],
        features: [
          'Компенсация 100% стоимости',
          'Широкая номенклатура услуг',
          'Срок рассмотрения 10 дней',
          'Возможность рассрочки'
        ],
        notes: [
          'Следующая возможность: 2028 год',
          'Действует для зубного протезирования'
        ],
        utilization: {
          used: 1,
          total: 1,
          percentage: 100
        },
        paymentHistory: [
          {
            date: '15.08.2023',
            amount: '18,500 ₽',
            status: 'paid',
            description: 'Компенсация протезирования'
          }
        ]
      }
    ]
  },
  {
    id: 'application',
    title: '📄 Оформление льгот',
    description: 'Подача заявок на новые льготы и отслеживание статусов',
    icon: '📄',
    color: COLORS.purple,
    stats: {
      total: 3,
      active: 2,
      totalAmount: '0 ₽',
      utilization: 0
    },
    benefits: [
      {
        id: 'BEN-2024-013',
        title: 'Заявка на льготу по капремонту',
        category: 'Оформление',
        status: 'pending',
        description: 'Оформление льготы по оплате капитального ремонта для пенсионеров старше 70 лет. Компенсация 50% от взносов.',
        amount: 'До 1,500 ₽/мес',
        frequency: 'ежемесячно',
        startDate: '15.12.2024',
        requirements: [
          'Возраст старше 70 лет',
          'Отсутствие задолженности по капремонту',
          'Проживание в многоквартирном доме'
        ],
        documents: ['Паспорт', 'Квитанции капремонта', 'Справка о составе семьи'],
        features: [
          'Компенсация 50% от взноса',
          'Задним числом с даты подачи',
          'Автоматическое продление',
          'Онлайн-отслеживание'
        ],
        progress: 65,
        assignedTo: 'Семенова Ольга Владимировна',
        notes: [
          'Ожидается проверка документов',
          'Решение будет до 28.12.2024',
          'Рекомендовано предоставить дополнительные справки'
        ],
        utilization: {
          used: 0,
          total: 1,
          percentage: 0
        },
        paymentHistory: []
      },
      {
        id: 'BEN-2024-014',
        title: 'Оформление транспортной льготы',
        category: 'Оформление',
        status: 'pending',
        description: 'Получение льготы на проезд в пригородном железнодорожном транспорте. Действует с 1 января 2025 года.',
        amount: 'Бесплатно',
        frequency: 'постоянно',
        startDate: '01.01.2025',
        requirements: [
          'Пенсионный возраст',
          'Постоянная регистрация в регионе',
          'Отсутствие аналогичной льготы'
        ],
        documents: ['Паспорт', 'Фото 3x4', 'Заявление'],
        features: [
          'Неограниченное количество поездок',
          'Действует на электрички',
          'Электронная карта',
          'Онлайн-пополнение'
        ],
        progress: 30,
        notes: [
          'На рассмотрении с 01.12.2024',
          'Требуется медицинская справка',
          'Ожидание изготовления карты'
        ],
        utilization: {
          used: 0,
          total: 1,
          percentage: 0
        },
        paymentHistory: []
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

// Benefit Card компонент
const BenefitCard = ({ benefit, categoryColor }: { benefit: Benefit; categoryColor: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    active: { label: 'Активна', color: 'text-green-400 bg-green-400/10 border-green-400/20', icon: '✅' },
    pending: { label: 'Рассмотрение', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: '🔄' },
    expired: { label: 'Истекла', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: '⏰' },
    suspended: { label: 'Приостановлена', color: 'text-gray-400 bg-gray-400/10 border-gray-400/20', icon: '⏸️' }
  };

  const status = statusConfig[benefit.status];

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
                {benefit.title}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full border ${status.color}`}>
                {status.icon} {status.label}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/60 mb-2">
              <span>#{benefit.id}</span>
              <span>📅 С {benefit.startDate}</span>
              {benefit.endDate && <span>→ До {benefit.endDate}</span>}
            </div>
            <p className="text-white/60 text-xs sm:text-sm line-clamp-2">
              {benefit.description}
            </p>
          </div>
        </div>

        {/* Amount and Frequency */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="text-white font-bold text-lg">{benefit.amount}</div>
            <div className="text-white/60 text-xs">{benefit.frequency}</div>
          </div>
          {benefit.nextPayment && (
            <div className="text-center">
              <div className="text-white font-semibold text-sm">{benefit.nextPayment}</div>
              <div className="text-white/60 text-xs">Следующая выплата</div>
            </div>
          )}
        </div>

        {/* Progress Bar for Pending Benefits */}
        {benefit.progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>Прогресс оформления</span>
              <span>{benefit.progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-yellow-400 transition-all duration-500"
                style={{ width: `${benefit.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Utilization for Active Benefits */}
        {benefit.status === 'active' && benefit.utilization && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>Использование льготы</span>
              <span>{benefit.utilization.percentage}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-green-400 transition-all duration-500"
                style={{ width: `${benefit.utilization.percentage}%` }}
              />
            </div>
            <div className="text-xs text-white/60 mt-1 text-center">
              {benefit.utilization.used} из {benefit.utilization.total} доступных
            </div>
          </div>
        )}

        {/* Expand Button */}
        <div className="flex items-center justify-between mt-auto">
          <div className="text-xs text-white/60">
            {benefit.assignedTo && (
              <span className="flex items-center gap-1">
                👤 {benefit.assignedTo}
              </span>
            )}
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
                    {benefit.requirements.map((req, index) => (
                      <li key={index} className="text-white/60 text-xs flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-white/40"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-white font-medium text-sm mb-2">✨ Возможности:</h4>
                  <ul className="space-y-1">
                    {benefit.features.map((feature, index) => (
                      <li key={index} className="text-white/60 text-xs flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Payment History */}
                {benefit.paymentHistory.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium text-sm mb-2">💰 История выплат:</h4>
                    <div className="space-y-2">
                      {benefit.paymentHistory.slice(0, 3).map((payment, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-white/60">{payment.date}</span>
                          <span className="text-white font-semibold">{payment.amount}</span>
                          <span className={`${
                            payment.status === 'paid' ? 'text-green-400' : 
                            payment.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {payment.status === 'paid' ? '✅' : payment.status === 'pending' ? '🔄' : '❌'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <motion.button
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {benefit.status === 'active' ? '📊 Управление льготой' : 
                   benefit.status === 'pending' ? '🔄 Отслеживать статус' : '📝 Подать заявку'}
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
  category: BenefitCategory; 
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
            <div className="text-white/60 text-xs">Всего льгот</div>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <div className="text-white font-bold text-sm">{category.stats.active}</div>
            <div className="text-white/60 text-xs">Активных</div>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <div className="text-white font-bold text-sm">{category.stats.totalAmount}</div>
            <div className="text-white/60 text-xs">Общая сумма</div>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <div className="text-white font-bold text-sm">{category.stats.utilization}%</div>
            <div className="text-white/60 text-xs">Использование</div>
          </div>
        </div>

        {/* Benefits Grid */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                {category.benefits.map((benefit) => (
                  <BenefitCard
                    key={benefit.id}
                    benefit={benefit}
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
  const totalBenefits = benefitCategories.reduce((sum, cat) => sum + cat.stats.total, 0);
  const activeBenefits = benefitCategories.reduce((sum, cat) => sum + cat.stats.active, 0);
  const totalMonthlyAmount = benefitCategories.reduce((sum, cat) => {
    const amount = parseInt(cat.stats.totalAmount.replace(/[^\d]/g, ''));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const stats = [
    { 
      label: 'Всего льгот', 
      value: totalBenefits.toString(), 
      icon: '📊', 
      trend: '+2', 
      color: 'text-blue-400',
      description: 'Доступные программы'
    },
    { 
      label: 'Активные льготы', 
      value: activeBenefits.toString(), 
      icon: '✅', 
      trend: '+1', 
      color: 'text-green-400',
      description: 'Действующие сейчас'
    },
    { 
      label: 'Общая сумма', 
      value: `${(totalMonthlyAmount / 1000).toFixed(0)}K ₽`, 
      icon: '💰', 
      trend: '+5%', 
      color: 'text-emerald-400',
      description: 'В месяц'
    },
    { 
      label: 'Категорий', 
      value: benefitCategories.length.toString(), 
      icon: '📁', 
      trend: '', 
      color: 'text-purple-400',
      description: 'Видов поддержки'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <BentoCard key={index} className="p-4 text-center">
          <div className="text-2xl mb-2">{stat.icon}</div>
          <div className="text-white font-bold text-xl mb-1">{stat.value}</div>
          <div className="text-white/60 text-sm mb-1">{stat.label}</div>
          <div className="text-xs text-white/40">{stat.description}</div>
          {stat.trend && <div className={`text-xs ${stat.color} mt-1`}>{stat.trend}</div>}
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

        {/* Category Filter */}
        <select
          onChange={(e) => onFilter(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20 transition-colors text-sm min-w-[180px]"
        >
          <option value="all">Все категории</option>
          {benefitCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          onChange={(e) => onFilter(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20 transition-colors text-sm min-w-[180px]"
        >
          <option value="all">Все статусы</option>
          <option value="active">Активные</option>
          <option value="pending">Рассмотрение</option>
          <option value="expired">Истекшие</option>
        </select>
      </div>
    </BentoCard>
  );
};

// Основной компонент страницы льгот
export default function BenefitsPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('overview');
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
  const filteredCategories = benefitCategories.filter(category => {
    const matchesCategory = selectedCategory === 'all' || category.id === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.benefits.some(benefit => 
        benefit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        benefit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        benefit.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
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
                  Мои льготы и выплаты
                </h1>
                <p className="text-white/60 text-base lg:text-lg max-w-2xl">
                  34 льготы • 28,456 ₽ в месяц • 6 категорий поддержки
                </p>
              </div>
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white flex-shrink-0"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium">Все выплаты активны</span>
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
            <h3 className="text-white font-bold text-xl mb-3">Льготы не найдены</h3>
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
              <div className="text-3xl mb-3">💡</div>
              <h3 className="text-white font-bold text-lg mb-2">Нужна помощь с оформлением льгот?</h3>
              <p className="text-white/60 text-sm mb-4">
                Наши специалисты помогут подобрать подходящие льготы, оформят документы и проконсультируют по всем вопросам
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium">
                  💬 Бесплатная консультация
                </button>
                <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 text-sm font-medium">
                  📞 Записаться на прием
                </button>
              </div>
            </div>
          </BentoCard>
        </motion.section>
      </main>
    </div>
  );
}