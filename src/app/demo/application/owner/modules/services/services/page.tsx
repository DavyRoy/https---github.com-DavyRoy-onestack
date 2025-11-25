'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const useClientTime = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString('ru-RU'));
    
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('ru-RU'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
};

// Типы данных для клиентских услуг
interface ClientService {
  id: string;
  name: string;
  category: 'consulting' | 'support' | 'training' | 'implementation' | 'customization' | 'maintenance' | 'premium';
  description: string;
  status: 'active' | 'development' | 'paused' | 'closed';
  serviceTypes: string[];
  duration: {
    min: number;
    max: number;
    unit: 'minutes' | 'hours' | 'days' | 'months';
  };
  price: {
    base: number;
    currency: 'RUB' | 'USD' | 'EUR';
    type: 'one_time' | 'subscription' | 'hourly';
    billingPeriod?: string;
  };
  requirements: string[];
  specialists: string[];
  deliverables: string[];
  metrics: {
    satisfaction: number;
    onTimeRate: number;
    successRate: number;
  };
  capacity: number;
  currentClients: number;
}

interface ServiceClient {
  id: string;
  name: string;
  type: 'startup' | 'small_business' | 'medium_business' | 'enterprise' | 'individual';
  industry: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  representative: {
    name: string;
    position: string;
    contact: string;
  };
  preferences: {
    communication: string[];
    reporting: string;
    timezone: string;
  };
  serviceHistory: ClientServiceOrder[];
  contract: {
    type: 'project' | 'retainer' | 'hourly' | 'subscription';
    startDate: string;
    endDate?: string;
    value: number;
    status: 'active' | 'pending' | 'completed' | 'cancelled';
  };
  status: 'active' | 'inactive' | 'onboarding' | 'at_risk';
  lastActivity?: string;
  totalSpent: number;
}

interface ClientServiceOrder {
  id: string;
  clientId: string;
  serviceId: string;
  managerId?: string;
  specialistId?: string;
  items: ServiceItem[];
  status: 'lead' | 'proposal' | 'negotiation' | 'contract' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  timeline: {
    created: string;
    contacted?: string;
    proposalSent?: string;
    contractSigned?: string;
    started?: string;
    completed?: string;
  };
  details: {
    scope: string;
    objectives: string[];
    kpis: string[];
    deadline?: string;
  };
  payment: {
    amount: number;
    method: 'bank_transfer' | 'card' | 'online' | 'invoice';
    status: 'pending' | 'paid' | 'partial' | 'overdue';
    schedule: string[];
  };
  notes?: string;
  feedback?: {
    rating: number;
    comment: string;
  };
}

interface ServiceItem {
  id: string;
  name: string;
  type: 'service' | 'consultation' | 'training' | 'support';
  quantity: number;
  price: number;
  description?: string;
}

interface ServiceManager {
  id: string;
  name: string;
  specialization: string[];
  contact: {
    phone: string;
    email: string;
  };
  qualifications: {
    level: 'junior' | 'middle' | 'senior' | 'lead';
    certifications: string[];
    experience: number;
  };
  status: 'active' | 'busy' | 'away' | 'vacation';
  currentClients: string[];
  schedule: {
    days: string[];
    hours: string;
  };
  ratings: {
    average: number;
    count: number;
    lastMonth: number;
  };
  metrics: {
    closedDeals: number;
    clientSatisfaction: number;
    retentionRate: number;
  };
  maxClients: number;
}

interface ServiceSpecialist {
  id: string;
  name: string;
  expertise: string[];
  contact: {
    phone: string;
    email: string;
  };
  qualifications: {
    level: 'junior' | 'middle' | 'senior' | 'expert';
    certifications: string[];
    experience: number;
  };
  status: 'available' | 'busy' | 'training' | 'unavailable';
  currentProjects: string[];
  availability: {
    days: string[];
    hours: string;
    timezone: string;
  };
  ratings: {
    average: number;
    count: number;
    lastMonth: number;
  };
  metrics: {
    completedProjects: number;
    onTimeDelivery: number;
    clientSatisfaction: number;
  };
  maxProjects: number;
}

// Моки данных для клиентских услуг
const clientServices: ClientService[] = [
  {
    id: 'cs-001',
    name: 'Бизнес-консалтинг',
    category: 'consulting',
    description: 'Стратегический консалтинг для оптимизации бизнес-процессов и повышения эффективности',
    status: 'active',
    serviceTypes: ['Стратегическое планирование', 'Анализ процессов', 'Оптимизация затрат'],
    duration: {
      min: 1,
      max: 3,
      unit: 'months'
    },
    price: {
      base: 150000,
      currency: 'RUB',
      type: 'project'
    },
    requirements: ['Бизнес-план', 'Финансовая отчетность', 'Описание процессов'],
    specialists: ['Бизнес-консультант', 'Аналитик'],
    deliverables: ['Отчет по анализу', 'План оптимизации', 'Рекомендации'],
    metrics: {
      satisfaction: 94,
      onTimeRate: 92,
      successRate: 96
    },
    capacity: 10,
    currentClients: 7
  },
  {
    id: 'cs-002',
    name: 'Техническая поддержка',
    category: 'support',
    description: 'Круглосуточная техническая поддержка и решение проблем для бизнеса',
    status: 'active',
    serviceTypes: ['Техподдержка 24/7', 'Удаленная помощь', 'Консультации'],
    duration: {
      min: 1,
      max: 12,
      unit: 'months'
    },
    price: {
      base: 25000,
      currency: 'RUB',
      type: 'subscription',
      billingPeriod: 'месяц'
    },
    requirements: ['Описание инфраструктуры', 'Контактные лица'],
    specialists: ['Технический специалист', 'Инженер поддержки'],
    deliverables: ['Решение проблем', 'Отчеты о работе', 'Рекомендации'],
    metrics: {
      satisfaction: 96,
      onTimeRate: 98,
      successRate: 99
    },
    capacity: 50,
    currentClients: 42
  },
  {
    id: 'cs-003',
    name: 'Обучение и тренинг',
    category: 'training',
    description: 'Профессиональное обучение сотрудников и проведение тренингов',
    status: 'active',
    serviceTypes: ['Корпоративное обучение', 'Тренинги', 'Вебинары'],
    duration: {
      min: 1,
      max: 5,
      unit: 'days'
    },
    price: {
      base: 50000,
      currency: 'RUB',
      type: 'one_time'
    },
    requirements: ['Цели обучения', 'Уровень аудитории', 'Тематика'],
    specialists: ['Тренер', 'Методист'],
    deliverables: ['Учебные материалы', 'Сертификаты', 'Отчет об обучении'],
    metrics: {
      satisfaction: 95,
      onTimeRate: 96,
      successRate: 98
    },
    capacity: 20,
    currentClients: 15
  },
  {
    id: 'cs-004',
    name: 'Внедрение решений',
    category: 'implementation',
    description: 'Полный цикл внедрения бизнес-решений и программного обеспечения',
    status: 'active',
    serviceTypes: ['Внедрение ПО', 'Настройка систем', 'Миграция данных'],
    duration: {
      min: 2,
      max: 6,
      unit: 'months'
    },
    price: {
      base: 300000,
      currency: 'RUB',
      type: 'project'
    },
    requirements: ['ТЗ', 'Инфраструктура', 'Команда проекта'],
    specialists: ['Project Manager', 'Внедренец', 'Тестировщик'],
    deliverables: ['Работающее решение', 'Документация', 'Обучение'],
    metrics: {
      satisfaction: 92,
      onTimeRate: 88,
      successRate: 94
    },
    capacity: 8,
    currentClients: 6
  },
  {
    id: 'cs-005',
    name: 'Индивидуальная разработка',
    category: 'customization',
    description: 'Разработка индивидуальных решений под уникальные бизнес-задачи',
    status: 'active',
    serviceTypes: ['Разработка ПО', 'Кастомизация', 'Интеграции'],
    duration: {
      min: 1,
      max: 12,
      unit: 'months'
    },
    price: {
      base: 500000,
      currency: 'RUB',
      type: 'project'
    },
    requirements: ['Детальное ТЗ', 'Бюджет', 'Сроки'],
    specialists: ['Разработчик', 'Архитектор', 'Дизайнер'],
    deliverables: ['Исходный код', 'Документация', 'Техподдержка'],
    metrics: {
      satisfaction: 91,
      onTimeRate: 85,
      successRate: 93
    },
    capacity: 6,
    currentClients: 4
  },
  {
    id: 'cs-006',
    name: 'Абонентское обслуживание',
    category: 'maintenance',
    description: 'Постоянное сопровождение и развитие бизнес-систем',
    status: 'active',
    serviceTypes: ['Техническое сопровождение', 'Обновления', 'Мониторинг'],
    duration: {
      min: 6,
      max: 36,
      unit: 'months'
    },
    price: {
      base: 75000,
      currency: 'RUB',
      type: 'subscription',
      billingPeriod: 'месяц'
    },
    requirements: ['Действующая система', 'Документация'],
    specialists: ['Технический специалист', 'Разработчик'],
    deliverables: ['Отчеты', 'Обновления', 'Консультации'],
    metrics: {
      satisfaction: 97,
      onTimeRate: 95,
      successRate: 98
    },
    capacity: 30,
    currentClients: 25
  },
  {
    id: 'cs-007',
    name: 'Премиум сопровождение',
    category: 'premium',
    description: 'Персональное обслуживание для ключевых клиентов с выделенным менеджером',
    status: 'active',
    serviceTypes: ['Выделенный менеджер', 'Приоритетная поддержка', 'Стратегические сессии'],
    duration: {
      min: 12,
      max: 36,
      unit: 'months'
    },
    price: {
      base: 200000,
      currency: 'RUB',
      type: 'subscription',
      billingPeriod: 'месяц'
    },
    requirements: ['Объем бизнеса', 'Долгосрочные цели'],
    specialists: ['Старший менеджер', 'Стратегический консультант'],
    deliverables: ['Стратегический план', 'Регулярные отчеты', 'Персональные консультации'],
    metrics: {
      satisfaction: 98,
      onTimeRate: 96,
      successRate: 99
    },
    capacity: 5,
    currentClients: 3
  }
];

const serviceClients: ServiceClient[] = [
  {
    id: 'scl-001',
    name: 'ООО "ТехноПрогресс"',
    type: 'medium_business',
    industry: 'IT-услуги',
    contact: {
      phone: '+7 (495) 123-45-67',
      email: 'info@technoprogress.ru',
      address: 'г. Москва, ул. Ленинская, д. 15, оф. 304'
    },
    representative: {
      name: 'Иванов Сергей Петрович',
      position: 'Директор по развитию',
      contact: '+7 (916) 123-45-67'
    },
    preferences: {
      communication: ['email', 'video_call'],
      reporting: 'еженедельно',
      timezone: 'MSK'
    },
    serviceHistory: [],
    contract: {
      type: 'retainer',
      startDate: '2024-01-15',
      value: 900000,
      status: 'active'
    },
    status: 'active',
    lastActivity: '2024-06-18',
    totalSpent: 1200000
  },
  {
    id: 'scl-002',
    name: 'Стартап "Инновация"',
    type: 'startup',
    industry: 'FinTech',
    contact: {
      phone: '+7 (495) 234-56-78',
      email: 'contact@innovation-startup.ru',
      address: 'г. Москва, пр. Мира, д. 125, оф. 89'
    },
    representative: {
      name: 'Петрова Анна Владимировна',
      position: 'CEO',
      contact: '+7 (925) 234-56-78'
    },
    preferences: {
      communication: ['phone', 'messenger'],
      reporting: 'по запросу',
      timezone: 'MSK'
    },
    serviceHistory: [],
    contract: {
      type: 'project',
      startDate: '2024-03-01',
      endDate: '2024-09-01',
      value: 500000,
      status: 'active'
    },
    status: 'active',
    lastActivity: '2024-06-19',
    totalSpent: 350000
  },
  {
    id: 'scl-003',
    name: 'Крупный ритейлер "ТоргСеть"',
    type: 'enterprise',
    industry: 'Розничная торговля',
    contact: {
      phone: '+7 (495) 345-67-89',
      email: 'procurement@torgset.ru',
      address: 'г. Москва, ул. Тверская, д. 25, оф. 1501'
    },
    representative: {
      name: 'Сидоров Дмитрий Николаевич',
      position: 'IT-директор',
      contact: '+7 (916) 345-67-89'
    },
    preferences: {
      communication: ['email', 'meeting'],
      reporting: 'ежемесячно',
      timezone: 'MSK'
    },
    serviceHistory: [],
    contract: {
      type: 'subscription',
      startDate: '2023-11-01',
      value: 2400000,
      status: 'active'
    },
    status: 'active',
    lastActivity: '2024-06-17',
    totalSpent: 4500000
  },
  {
    id: 'scl-004',
    name: 'Частный предприниматель Козлов',
    type: 'individual',
    industry: 'Консалтинг',
    contact: {
      phone: '+7 (916) 456-78-90',
      email: 'kozlov.consult@mail.ru',
      address: 'г. Москва, ул. Пушкина, д. 67, кв. 45'
    },
    representative: {
      name: 'Козлов Олег Сергеевич',
      position: 'Владелец',
      contact: '+7 (916) 456-78-90'
    },
    preferences: {
      communication: ['phone', 'email'],
      reporting: 'ежеквартально',
      timezone: 'MSK'
    },
    serviceHistory: [],
    contract: {
      type: 'hourly',
      startDate: '2024-02-01',
      value: 150000,
      status: 'active'
    },
    status: 'active',
    lastActivity: '2024-06-15',
    totalSpent: 280000
  }
];

const serviceManagers: ServiceManager[] = [
  {
    id: 'sm-001',
    name: 'Александрова Мария Викторовна',
    specialization: ['Enterprise', 'Strategic Consulting'],
    contact: {
      phone: '+7 (916) 111-22-33',
      email: 'm.alexandrova@clientservice.ru'
    },
    qualifications: {
      level: 'lead',
      certifications: ['PMP', 'Scrum Master', 'Business Analysis'],
      experience: 8
    },
    status: 'active',
    currentClients: ['scl-003', 'scl-001'],
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      hours: '09:00-18:00'
    },
    ratings: {
      average: 4.9,
      count: 45,
      lastMonth: 4.8
    },
    metrics: {
      closedDeals: 28,
      clientSatisfaction: 96,
      retentionRate: 94
    },
    maxClients: 5
  },
  {
    id: 'sm-002',
    name: 'Николаев Артем Олегович',
    specialization: ['Startups', 'SMB', 'Implementation'],
    contact: {
      phone: '+7 (925) 222-33-44',
      email: 'a.nikolaev@clientservice.ru'
    },
    qualifications: {
      level: 'senior',
      certifications: ['Agile Coach', 'Product Management'],
      experience: 6
    },
    status: 'busy',
    currentClients: ['scl-002'],
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      hours: '10:00-19:00'
    },
    ratings: {
      average: 4.8,
      count: 32,
      lastMonth: 4.9
    },
    metrics: {
      closedDeals: 19,
      clientSatisfaction: 94,
      retentionRate: 91
    },
    maxClients: 4
  }
];

const serviceSpecialists: ServiceSpecialist[] = [
  {
    id: 'ssp-001',
    name: 'Волков Денис Игоревич',
    expertise: ['Business Analysis', 'Process Optimization', 'Strategy'],
    contact: {
      phone: '+7 (916) 333-44-55',
      email: 'd.volkov@clientservice.ru'
    },
    qualifications: {
      level: 'expert',
      certifications: ['CBAP', 'Six Sigma Black Belt'],
      experience: 10
    },
    status: 'available',
    currentProjects: ['csord-001'],
    availability: {
      days: ['Пн', 'Вт', 'Ср', 'Чт'],
      hours: '10:00-18:00',
      timezone: 'MSK'
    },
    ratings: {
      average: 4.9,
      count: 67,
      lastMonth: 5.0
    },
    metrics: {
      completedProjects: 42,
      onTimeDelivery: 95,
      clientSatisfaction: 97
    },
    maxProjects: 3
  },
  {
    id: 'ssp-002',
    name: 'Орлова Екатерина Сергеевна',
    expertise: ['Technical Support', 'System Implementation', 'Training'],
    contact: {
      phone: '+7 (925) 444-55-66',
      email: 'e.orlova@clientservice.ru'
    },
    qualifications: {
      level: 'senior',
      certifications: ['ITIL', 'AWS Solutions Architect'],
      experience: 7
    },
    status: 'busy',
    currentProjects: ['csord-002'],
    availability: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      hours: '09:00-17:00',
      timezone: 'MSK'
    },
    ratings: {
      average: 4.8,
      count: 53,
      lastMonth: 4.7
    },
    metrics: {
      completedProjects: 35,
      onTimeDelivery: 92,
      clientSatisfaction: 95
    },
    maxProjects: 4
  }
];

const clientServiceOrders: ClientServiceOrder[] = [
  {
    id: 'csord-001',
    clientId: 'scl-001',
    serviceId: 'cs-001',
    managerId: 'sm-001',
    specialistId: 'ssp-001',
    items: [
      {
        id: 'csitem-001',
        name: 'Стратегический анализ бизнеса',
        type: 'consultation',
        quantity: 1,
        price: 300000,
        description: 'Полный анализ бизнес-процессов и выявление точек роста'
      }
    ],
    status: 'in_progress',
    timeline: {
      created: '2024-05-15T10:00:00Z',
      contacted: '2024-05-16T11:00:00Z',
      proposalSent: '2024-05-20T14:00:00Z',
      contractSigned: '2024-05-25T09:00:00Z',
      started: '2024-06-01T10:00:00Z'
    },
    details: {
      scope: 'Оптимизация бизнес-процессов компании',
      objectives: [
        'Снижение операционных затрат на 15%',
        'Увеличение производительности на 20%',
        'Автоматизация рутинных процессов'
      ],
      kpis: [
        'ROI проекта',
        'Время выполнения процессов',
        'Удовлетворенность сотрудников'
      ],
      deadline: '2024-08-01'
    },
    payment: {
      amount: 300000,
      method: 'bank_transfer',
      status: 'partial',
      schedule: ['2024-06-01', '2024-07-01', '2024-08-01']
    },
    notes: 'Клиент заинтересован в долгосрочном сотрудничестве'
  },
  {
    id: 'csord-002',
    clientId: 'scl-002',
    serviceId: 'cs-004',
    managerId: 'sm-002',
    specialistId: 'ssp-002',
    items: [
      {
        id: 'csitem-002',
        name: 'Внедрение CRM системы',
        type: 'implementation',
        quantity: 1,
        price: 500000,
        description: 'Полный цикл внедрения CRM с интеграцией и обучением'
      }
    ],
    status: 'contract',
    timeline: {
      created: '2024-06-01T14:00:00Z',
      contacted: '2024-06-02T10:00:00Z',
      proposalSent: '2024-06-05T16:00:00Z',
      contractSigned: '2024-06-10T11:00:00Z'
    },
    details: {
      scope: 'Внедрение CRM системы для управления продажами',
      objectives: [
        'Централизация данных о клиентах',
        'Автоматизация воронки продаж',
        'Улучшение отчетности'
      ],
      kpis: [
        'Конверсия лидов',
        'Время обработки заявок',
        'Удовлетворенность отдела продаж'
      ],
      deadline: '2024-09-01'
    },
    payment: {
      amount: 500000,
      method: 'invoice',
      status: 'pending',
      schedule: ['2024-06-15', '2024-07-15', '2024-08-15']
    }
  }
];

// Константы
const COLORS = {
  primary: 'from-slate-900 via-slate-950 to-slate-900',
  secondary: 'from-indigo-900 via-slate-950 to-purple-900',
  success: '34, 197, 94',
  warning: '234, 179, 8',
  error: '239, 68, 68',
  info: '59, 130, 246',
  purple: '147, 51, 234',
  blue: '59, 130, 246',
  emerald: '16, 185, 129',
  orange: '249, 115, 22',
  teal: '20, 184, 166',
  indigo: '99, 102, 241',
  rose: '244, 63, 94',
  cyan: '34, 211, 238',
  amber: '245, 158, 11',
  slate: '100, 116, 139'
} as const;

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(value);

const formatNumber = (value: number) => new Intl.NumberFormat('ru-RU').format(value);

const formatDuration = (duration: ClientService['duration']) => {
  const { min, max, unit } = duration;
  const unitMap = {
    minutes: 'мин',
    hours: 'ч',
    days: 'дн',
    months: 'мес'
  };
  return `${min}-${max} ${unitMap[unit]}`;
};

// Modal Component
const Modal = ({ isOpen, onClose, children, title, size = 'md' }: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50 rounded-3xl shadow-2xl w-full ${sizeClasses[size]} max-h-[95vh] overflow-hidden`}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="border-b border-slate-700/50 p-6 bg-slate-800/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-colors duration-200 text-slate-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          <div className="p-6 overflow-y-auto max-h-[calc(95vh-80px)] custom-scrollbar">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Компоненты
const BentoCard = ({ 
  children, 
  className = '', 
  glowColor = COLORS.indigo, 
  onClick,
  hoverable = true,
  padding = 'p-6'
}: { 
  children: React.ReactNode; 
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: string;
}) => (
  <motion.div
    className={`
      relative overflow-hidden 
      rounded-3xl border border-slate-700/50
      bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-xl
      transition-all duration-500
      w-full max-w-full
      group
      ${hoverable ? 'hover:border-slate-600/70 hover:shadow-2xl' : ''}
      ${onClick ? 'cursor-pointer' : ''}
      ${padding}
      ${className}
    `}
    style={{
      backgroundImage: `
        radial-gradient(280px circle at 50% 50%, rgba(${glowColor},0.15), transparent 60%),
        linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)
      `
    }}
    whileHover={hoverable ? { y: -4, scale: 1.02 } : {}}
    whileTap={onClick ? { scale: 0.98 } : {}}
    onClick={onClick}
  >
    {/* Enhanced glow effect */}
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
      style={{
        background: `radial-gradient(500px circle at 50% 50%, rgba(${glowColor},0.12), transparent 50%)`
      }}
    />
    
    <div className="relative z-10 h-full">
      {children}
    </div>

    {/* Improved shine effect */}
    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none overflow-hidden">
      <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:animate-shine" />
    </div>
  </motion.div>
);

const StatusBadge = ({ status, type = 'default', animated = false }: { 
  status: string; 
  type?: 'default' | 'service' | 'client' | 'manager' | 'specialist' | 'order';
  animated?: boolean;
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return { color: COLORS.success, label: 'Активен', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'development':
        return { color: COLORS.blue, label: 'В разработке', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'paused':
        return { color: COLORS.warning, label: 'Приостановлен', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' };
      case 'closed':
        return { color: COLORS.error, label: 'Закрыт', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'inactive':
        return { color: COLORS.slate, label: 'Неактивен', bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
      case 'onboarding':
        return { color: COLORS.cyan, label: 'Онбординг', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' };
      case 'at_risk':
        return { color: COLORS.rose, label: 'В зоне риска', bg: 'bg-rose-500/15', border: 'border-rose-500/30' };
      case 'busy':
        return { color: COLORS.orange, label: 'Занят', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'away':
        return { color: COLORS.slate, label: 'Недоступен', bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
      case 'vacation':
        return { color: COLORS.cyan, label: 'Отпуск', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' };
      case 'available':
        return { color: COLORS.success, label: 'Доступен', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'training':
        return { color: COLORS.blue, label: 'Обучение', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'unavailable':
        return { color: COLORS.slate, label: 'Недоступен', bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
      case 'lead':
        return { color: COLORS.blue, label: 'Лид', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'proposal':
        return { color: COLORS.teal, label: 'Предложение', bg: 'bg-teal-500/15', border: 'border-teal-500/30' };
      case 'negotiation':
        return { color: COLORS.orange, label: 'Переговоры', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'contract':
        return { color: COLORS.indigo, label: 'Контракт', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' };
      case 'in_progress':
        return { color: COLORS.orange, label: 'В работе', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'review':
        return { color: COLORS.purple, label: 'На проверке', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'completed':
        return { color: COLORS.success, label: 'Завершен', bg: 'bg-green-500/15', border: 'border-green-500/30' };
      case 'cancelled':
        return { color: COLORS.error, label: 'Отменен', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'pending':
        return { color: COLORS.warning, label: 'Ожидание', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' };
      case 'paid':
        return { color: COLORS.success, label: 'Оплачен', bg: 'bg-green-500/15', border: 'border-green-500/30' };
      case 'partial':
        return { color: COLORS.blue, label: 'Частично', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'overdue':
        return { color: COLORS.rose, label: 'Просрочен', bg: 'bg-rose-500/15', border: 'border-rose-500/30' };
      case 'consulting':
        return { color: COLORS.indigo, label: 'Консалтинг', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' };
      case 'support':
        return { color: COLORS.blue, label: 'Поддержка', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'training':
        return { color: COLORS.teal, label: 'Обучение', bg: 'bg-teal-500/15', border: 'border-teal-500/30' };
      case 'implementation':
        return { color: COLORS.orange, label: 'Внедрение', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'customization':
        return { color: COLORS.purple, label: 'Кастомизация', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'maintenance':
        return { color: COLORS.emerald, label: 'Сопровождение', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'premium':
        return { color: COLORS.amber, label: 'Премиум', bg: 'bg-amber-500/15', border: 'border-amber-500/30' };
      case 'startup':
        return { color: COLORS.cyan, label: 'Стартап', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' };
      case 'small_business':
        return { color: COLORS.blue, label: 'Малый бизнес', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'medium_business':
        return { color: COLORS.indigo, label: 'Средний бизнес', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' };
      case 'enterprise':
        return { color: COLORS.purple, label: 'Корпоративный', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'individual':
        return { color: COLORS.teal, label: 'Частный', bg: 'bg-teal-500/15', border: 'border-teal-500/30' };
      case 'project':
        return { color: COLORS.orange, label: 'Проект', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'retainer':
        return { color: COLORS.indigo, label: 'Абонентский', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' };
      case 'hourly':
        return { color: COLORS.teal, label: 'Почасовая', bg: 'bg-teal-500/15', border: 'border-teal-500/30' };
      case 'subscription':
        return { color: COLORS.purple, label: 'Подписка', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'junior':
        return { color: COLORS.slate, label: 'Младший', bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
      case 'middle':
        return { color: COLORS.blue, label: 'Средний', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'senior':
        return { color: COLORS.orange, label: 'Старший', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'lead':
        return { color: COLORS.purple, label: 'Лидер', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'expert':
        return { color: COLORS.amber, label: 'Эксперт', bg: 'bg-amber-500/15', border: 'border-amber-500/30' };
      default:
        return { color: COLORS.slate, label: status, bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
    }
  };

  const config = getStatusConfig();

  return (
    <motion.span 
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm ${config.bg} ${config.border}`}
      style={{ color: `rgb(${config.color})` }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {animated && (
        <motion.div 
          className="w-2 h-2 rounded-full mr-2"
          style={{ backgroundColor: `rgb(${config.color})` }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {!animated && (
        <div 
          className="w-2 h-2 rounded-full mr-2"
          style={{ backgroundColor: `rgb(${config.color})` }}
        />
      )}
      {config.label}
    </motion.span>
  );
};

const ProgressBar = ({ value, max = 100, color = COLORS.indigo, label, showValue = true, size = 'md' }: { 
  value: number; 
  max?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm text-slate-300 mb-2">
          <span>{label}</span>
          {showValue && <span className="font-semibold">{percentage.toFixed(1)}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-700/50 rounded-full ${height} overflow-hidden`}>
        <motion.div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${height}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          style={{ 
            backgroundColor: `rgb(${color})`,
            boxShadow: `0 0 12px rgba(${color}, 0.4)`
          }}
        />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon, color = COLORS.indigo, subtitle, onClick, trend }: {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color?: string;
  subtitle?: string;
  onClick?: () => void;
  trend?: 'up' | 'down' | 'neutral';
}) => {
  const trendConfig = trend || (change !== undefined ? (change >= 0 ? 'up' : 'down') : 'neutral');
  
  return (
    <BentoCard 
      className="p-6" 
      glowColor={color} 
      onClick={onClick}
      padding="p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl p-3 rounded-2xl bg-white/5 backdrop-blur-sm">{icon}</div>
        {trendConfig !== 'neutral' && (
          <div 
            className={`text-sm font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${
              trendConfig === 'up' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {trendConfig === 'up' ? '↗' : '↘'} {change !== undefined ? `${Math.abs(change)}%` : ''}
          </div>
        )}
      </div>
      <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-slate-300 text-sm font-medium">{title}</div>
      {subtitle && <div className="text-slate-400 text-xs mt-1">{subtitle}</div>}
    </BentoCard>
  );
};

const ServiceCard = ({ service, onClick }: { service: ClientService; onClick?: () => void }) => {
  const getServiceColor = (category: string) => {
    switch (category) {
      case 'consulting': return COLORS.indigo;
      case 'support': return COLORS.blue;
      case 'training': return COLORS.teal;
      case 'implementation': return COLORS.orange;
      case 'customization': return COLORS.purple;
      case 'maintenance': return COLORS.emerald;
      case 'premium': return COLORS.amber;
      default: return COLORS.slate;
    }
  };

  const getPriceDisplay = (price: ClientService['price']) => {
    let display = `от ${formatCurrency(price.base)}`;
    if (price.type === 'subscription' && price.billingPeriod) {
      display += ` / ${price.billingPeriod}`;
    } else if (price.type === 'hourly') {
      display += ` / час`;
    }
    return display;
  };

  const utilization = (service.currentClients / service.capacity) * 100;

  return (
    <BentoCard className="p-5" glowColor={getServiceColor(service.category)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{service.name}</h4>
          <p className="text-slate-400 text-sm line-clamp-1">{service.serviceTypes.join(', ')}</p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={service.category} />
          <StatusBadge status={service.status} animated={service.status === 'active'} />
        </div>
      </div>
      
      <div className="space-y-4 mb-5">
        <div className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
          {service.description}
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs">Длительность</span>
            <p className="text-white font-medium text-xs">{formatDuration(service.duration)}</p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-slate-400 text-xs">Успешность</span>
            <p className="text-white font-medium">{service.metrics.successRate}%</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 text-xs">Стоимость</span>
            <p className="text-white font-medium text-xs leading-tight">{getPriceDisplay(service.price)}</p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-slate-400 text-xs">Время вовремя</span>
            <p className="text-white font-medium">{service.metrics.onTimeRate}%</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Загруженность:</span>
            <span className="text-white font-medium">{service.currentClients}/{service.capacity}</span>
          </div>
          <ProgressBar 
            value={utilization} 
            color={utilization > 90 ? COLORS.rose : utilization > 75 ? COLORS.orange : COLORS.success}
            showValue={false}
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Результаты:</span>
          <span className="text-white font-medium text-right text-xs">
            {service.deliverables.length} позиций
          </span>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Подробнее
        </button>
        <button className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Заказать
        </button>
      </div>
    </BentoCard>
  );
};

const ClientCard = ({ client, onClick }: { client: ServiceClient; onClick?: () => void }) => {
  const getClientColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'inactive': return COLORS.slate;
      case 'onboarding': return COLORS.cyan;
      case 'at_risk': return COLORS.rose;
      default: return COLORS.slate;
    }
  };

  const getContractProgress = (client: ServiceClient) => {
    if (!client.contract.endDate) return 50;
    const start = new Date(client.contract.startDate).getTime();
    const end = new Date(client.contract.endDate).getTime();
    const now = new Date().getTime();
    return Math.min(((now - start) / (end - start)) * 100, 100);
  };

  return (
    <BentoCard className="p-5" glowColor={getClientColor(client.status)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{client.name}</h4>
          <p className="text-slate-400 text-sm">
            {client.industry} • {client.type}
          </p>
        </div>
        <StatusBadge status={client.status} type="client" animated={client.status === 'active'} />
      </div>
      
      <div className="space-y-3 text-sm mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Контракт:</span>
          <span className="text-white font-medium">{formatCurrency(client.contract.value)}</span>
        </div>
        
        <div className="flex justify-between items-start">
          <span className="text-slate-400">Представитель:</span>
          <span className="text-white font-medium text-right text-xs">{client.representative.name}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Всего потрачено:</span>
          <span className="text-white font-medium">{formatCurrency(client.totalSpent)}</span>
        </div>

        {client.lastActivity && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Активность:</span>
            <span className="text-white font-medium text-xs">
              {new Date(client.lastActivity).toLocaleDateString('ru-RU')}
            </span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-700/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-xs">Прогресс контракта</span>
            <span className="text-slate-300 text-xs">{Math.round(getContractProgress(client))}%</span>
          </div>
          <ProgressBar 
            value={getContractProgress(client)} 
            color={COLORS.indigo}
            showValue={false}
            size="sm"
          />
        </div>
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          История
        </button>
        <button className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Контакт
        </button>
      </div>
    </BentoCard>
  );
};

const ManagerCard = ({ manager, onClick }: { manager: ServiceManager; onClick?: () => void }) => {
  const utilization = (manager.currentClients.length / manager.maxClients) * 100;
  
  const getManagerColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'busy': return COLORS.orange;
      case 'away': return COLORS.slate;
      case 'vacation': return COLORS.cyan;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard className="p-5" glowColor={getManagerColor(manager.status)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{manager.name}</h4>
          <p className="text-slate-400 text-sm line-clamp-1">
            {manager.qualifications.level} • {manager.specialization.join(', ')}
          </p>
        </div>
        <StatusBadge status={manager.status} type="manager" animated={manager.status === 'active'} />
      </div>
      
      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Рейтинг:</span>
          <span className="text-white font-medium">{manager.ratings.average}/5.0</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Клиентов:</span>
          <span className="text-white font-medium">{manager.currentClients.length}/{manager.maxClients}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Удержание:</span>
          <span className="text-white font-medium">{manager.metrics.retentionRate}%</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Опыт:</span>
          <span className="text-white font-medium">{manager.qualifications.experience} лет</span>
        </div>
      </div>
      
      <ProgressBar 
        value={utilization} 
        label={`Загрузка менеджера`}
        color={utilization > 90 ? COLORS.rose : utilization > 75 ? COLORS.orange : COLORS.success}
        showValue={false}
      />
    </BentoCard>
  );
};

const SpecialistCard = ({ specialist, onClick }: { specialist: ServiceSpecialist; onClick?: () => void }) => {
  const utilization = (specialist.currentProjects.length / specialist.maxProjects) * 100;
  
  const getSpecialistColor = (status: string) => {
    switch (status) {
      case 'available': return COLORS.success;
      case 'busy': return COLORS.orange;
      case 'training': return COLORS.blue;
      case 'unavailable': return COLORS.slate;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard className="p-5" glowColor={getSpecialistColor(specialist.status)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{specialist.name}</h4>
          <p className="text-slate-400 text-sm line-clamp-1">
            {specialist.qualifications.level} • {specialist.expertise.join(', ')}
          </p>
        </div>
        <StatusBadge status={specialist.status} type="specialist" animated={specialist.status === 'available'} />
      </div>
      
      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Рейтинг:</span>
          <span className="text-white font-medium">{specialist.ratings.average}/5.0</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Проектов:</span>
          <span className="text-white font-medium">{specialist.currentProjects.length}/{specialist.maxProjects}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">В срок:</span>
          <span className="text-white font-medium">{specialist.metrics.onTimeDelivery}%</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Опыт:</span>
          <span className="text-white font-medium">{specialist.qualifications.experience} лет</span>
        </div>
      </div>
      
      <ProgressBar 
        value={utilization} 
        label={`Загрузка специалиста`}
        color={utilization > 90 ? COLORS.rose : utilization > 75 ? COLORS.orange : COLORS.success}
        showValue={false}
      />
    </BentoCard>
  );
};

const OrderCard = ({ order, onClick }: { order: ClientServiceOrder; onClick?: () => void }) => {
  const client = serviceClients.find(c => c.id === order.clientId);
  const service = clientServices.find(s => s.id === order.serviceId);

  const getOrderColor = (status: string) => {
    switch (status) {
      case 'lead': return COLORS.blue;
      case 'proposal': return COLORS.teal;
      case 'negotiation': return COLORS.orange;
      case 'contract': return COLORS.indigo;
      case 'in_progress': return COLORS.orange;
      case 'review': return COLORS.purple;
      case 'completed': return COLORS.success;
      case 'cancelled': return COLORS.error;
      default: return COLORS.slate;
    }
  };

  const getStatusProgress = (status: string) => {
    const statuses = ['lead', 'proposal', 'negotiation', 'contract', 'in_progress', 'review', 'completed'];
    const currentIndex = statuses.indexOf(status);
    return currentIndex >= 0 ? (currentIndex / (statuses.length - 1)) * 100 : 0;
  };

  return (
    <BentoCard className="p-5" glowColor={getOrderColor(order.status)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">
            Заказ #{order.id.split('-')[1]}
          </h4>
          <p className="text-slate-400 text-sm line-clamp-1">
            {client?.name} • {service?.name}
          </p>
        </div>
        <StatusBadge status={order.status} type="order" animated={order.status === 'in_progress'} />
      </div>
      
      <div className="space-y-3 text-sm mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Сумма:</span>
          <span className="text-white font-medium">{formatCurrency(order.payment.amount)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Услуга:</span>
          <span className="text-white font-medium text-right text-xs">{service?.name}</span>
        </div>
        
        {order.details.deadline && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Дедлайн:</span>
            <span className="text-white font-medium">
              {new Date(order.details.deadline).toLocaleDateString('ru-RU')}
            </span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-700/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-xs">Прогресс сделки</span>
            <span className="text-slate-300 text-xs">{Math.round(getStatusProgress(order.status))}%</span>
          </div>
          <ProgressBar 
            value={getStatusProgress(order.status)} 
            color={getOrderColor(order.status)}
            showValue={false}
            size="sm"
          />
        </div>
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Подробнее
        </button>
        <button className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Отследить
        </button>
      </div>
    </BentoCard>
  );
};

// Основной компонент
export default function ClientServicesOrganization() {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'clients' | 'managers' | 'specialists' | 'analytics' | 'orders'>('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const currentTime = useClientTime();

  const openModal = (title: string, content: React.ReactNode, size: 'sm' | 'md' | 'lg' | 'xl' = 'lg') => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
    setModalTitle('');
  };

  // Фильтрация данных по поисковому запросу
  const filteredServices = useMemo(() => {
    if (!searchQuery) return clientServices;
    return clientServices.filter(service =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.serviceTypes.some(type => type.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const filteredClients = useMemo(() => {
    if (!searchQuery) return serviceClients;
    return serviceClients.filter(client =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.representative.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredManagers = useMemo(() => {
    if (!searchQuery) return serviceManagers;
    return serviceManagers.filter(manager =>
      manager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manager.specialization.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const filteredSpecialists = useMemo(() => {
    if (!searchQuery) return serviceSpecialists;
    return serviceSpecialists.filter(specialist =>
      specialist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specialist.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return clientServiceOrders;
    return clientServiceOrders.filter(order => {
      const client = serviceClients.find(c => c.id === order.clientId);
      const service = clientServices.find(s => s.id === order.serviceId);
      
      return (
        client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  // Статистика
  const clientServiceStats = useMemo(() => {
    const totalClients = serviceClients.length;
    const activeClients = serviceClients.filter(c => c.status === 'active').length;
    const totalServices = clientServices.length;
    const activeServices = clientServices.filter(s => s.status === 'active').length;
    const totalManagers = serviceManagers.length;
    const availableManagers = serviceManagers.filter(m => m.status === 'active' || m.status === 'busy').length;
    const todayOrders = clientServiceOrders.filter(o => new Date(o.timeline.created).toDateString() === new Date().toDateString()).length;
    const totalSpecialists = serviceSpecialists.length;
    const availableSpecialists = serviceSpecialists.filter(s => s.status === 'available' || s.status === 'busy').length;
    const totalRevenue = serviceClients.reduce((sum, client) => sum + client.totalSpent, 0);

    return {
      totalClients,
      activeClients,
      totalServices,
      activeServices,
      totalManagers,
      availableManagers,
      todayOrders,
      totalSpecialists,
      availableSpecialists,
      totalRevenue
    };
  }, []);

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: '📊', count: null },
    { id: 'services' as const, label: 'Услуги', icon: '💼', count: clientServiceStats.totalServices },
    { id: 'clients' as const, label: 'Клиенты', icon: '👥', count: clientServiceStats.totalClients },
    { id: 'managers' as const, label: 'Менеджеры', icon: '👨‍💼', count: clientServiceStats.totalManagers },
    { id: 'specialists' as const, label: 'Специалисты', icon: '👨‍🔬', count: clientServiceStats.totalSpecialists },
    { id: 'orders' as const, label: 'Заказы', icon: '📋', count: clientServiceOrders.length },
    { id: 'analytics' as const, label: 'Аналитика', icon: '📈', count: null }
  ];

  // Модальные окна контент
  const renderServiceModal = (service: ClientService) => {
    const utilization = (service.currentClients / service.capacity) * 100;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Клиентская услуга</label>
            <p className="text-white font-semibold text-lg mt-1">{service.name}</p>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Категория</label>
            <div className="mt-2">
              <StatusBadge status={service.category} />
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Статус</label>
            <div className="mt-2">
              <StatusBadge status={service.status} animated={service.status === 'active'} />
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Типы услуг</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {service.serviceTypes.map((type, index) => (
                <span key={index} className="px-3 py-1 bg-slate-700/50 rounded-lg text-slate-300 text-sm">
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-slate-400 text-sm font-medium">Описание</label>
          <p className="text-white font-medium mt-2 leading-relaxed">{service.description}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-xl">
              {formatDuration(service.duration)}
            </p>
            <p className="text-slate-400 text-xs mt-1">длительность</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-xl">{service.metrics.successRate}%</p>
            <p className="text-slate-400 text-xs mt-1">успешность</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-xl">{service.metrics.onTimeRate}%</p>
            <p className="text-slate-400 text-xs mt-1">вовремя</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-xl">{service.metrics.satisfaction}%</p>
            <p className="text-slate-400 text-xs mt-1">удовлетворенность</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Загруженность услуги</label>
            <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">Текущие клиенты</span>
                <span className="text-white font-bold">{service.currentClients}/{service.capacity}</span>
              </div>
              <ProgressBar 
                value={utilization} 
                color={utilization > 90 ? COLORS.rose : utilization > 75 ? COLORS.orange : COLORS.success}
                showValue={true}
              />
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Стоимость</label>
            <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
              <p className="text-white font-bold text-lg">
                от {formatCurrency(service.price.base)}
                {service.price.type === 'subscription' && service.price.billingPeriod && ` / ${service.price.billingPeriod}`}
                {service.price.type === 'hourly' && ` / час`}
              </p>
              <div className="mt-2 text-xs text-slate-400">
                Тип оплаты: {service.price.type === 'one_time' && 'Разовый'}
                {service.price.type === 'subscription' && 'Подписка'}
                {service.price.type === 'hourly' && 'Почасовая'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Требования</label>
            <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
              {service.requirements.map((req, index) => (
                <p key={index} className="text-white font-medium text-sm">• {req}</p>
              ))}
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Результаты</label>
            <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
              {service.deliverables.map((deliverable, index) => (
                <p key={index} className="text-white font-medium text-sm">• {deliverable}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium mb-3 block">Специалисты</label>
            <div className="space-y-2">
              {service.specialists.map((specialist, index) => (
                <div key={index} className="p-3 bg-slate-800/20 rounded-xl">
                  <p className="text-white text-sm">{specialist}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderClientModal = (client: ServiceClient) => {
    const contractProgress = client.contract.endDate 
      ? Math.min(((new Date().getTime() - new Date(client.contract.startDate).getTime()) / 
          (new Date(client.contract.endDate).getTime() - new Date(client.contract.startDate).getTime())) * 100, 100)
      : 50;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm font-medium">Клиент</label>
              <p className="text-white font-semibold text-lg mt-1">{client.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm">Отрасль</label>
                <p className="text-white font-medium">{client.industry}</p>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Тип клиента</label>
                <div className="mt-1">
                  <StatusBadge status={client.type} />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm font-medium">Статус</label>
              <div className="mt-2">
                <StatusBadge status={client.status} type="client" animated />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-sm">Всего потрачено</label>
              <p className="text-white font-medium">{formatCurrency(client.totalSpent)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Контактная информация</label>
            <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
              <div>
                <span className="text-slate-400 text-sm">Телефон:</span>
                <p className="text-white font-medium">{client.contact.phone}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Email:</span>
                <p className="text-white font-medium">{client.contact.email}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Адрес:</span>
                <p className="text-white font-medium text-sm">{client.contact.address}</p>
              </div>
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Представитель</label>
            <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
              <div>
                <span className="text-slate-400 text-sm">Имя:</span>
                <p className="text-white font-medium">{client.representative.name}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Должность:</span>
                <p className="text-white font-medium">{client.representative.position}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Контакт:</span>
                <p className="text-white font-medium">{client.representative.contact}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Контракт</label>
          <div className="p-4 bg-slate-800/30 rounded-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <span className="text-slate-400 text-sm">Тип</span>
                <div className="mt-1">
                  <StatusBadge status={client.contract.type} />
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Стоимость</span>
                <p className="text-white font-medium">{formatCurrency(client.contract.value)}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Начало</span>
                <p className="text-white font-medium">{new Date(client.contract.startDate).toLocaleDateString('ru-RU')}</p>
              </div>
              {client.contract.endDate && (
                <div>
                  <span className="text-slate-400 text-sm">Окончание</span>
                  <p className="text-white font-medium">{new Date(client.contract.endDate).toLocaleDateString('ru-RU')}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Прогресс контракта</span>
                <span className="text-slate-300">{Math.round(contractProgress)}%</span>
              </div>
              <ProgressBar value={contractProgress} color={COLORS.indigo} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Предпочтения</label>
            <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
              <div>
                <span className="text-slate-400 text-sm">Способы связи:</span>
                <p className="text-white font-medium">{client.preferences.communication.join(', ')}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Отчетность:</span>
                <p className="text-white font-medium">{client.preferences.reporting}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Часовой пояс:</span>
                <p className="text-white font-medium">{client.preferences.timezone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderManagerModal = (manager: ServiceManager) => {
    const utilization = (manager.currentClients.length / manager.maxClients) * 100;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm font-medium">Менеджер</label>
              <p className="text-white font-semibold text-lg mt-1">{manager.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm">Закрыто сделок</label>
                <p className="text-white font-medium">{manager.metrics.closedDeals}</p>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Рейтинг</label>
                <p className="text-white font-medium">{manager.ratings.average}/5.0</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm font-medium">Статус</label>
              <div className="mt-2">
                <StatusBadge status={manager.status} type="manager" animated={manager.status === 'active'} />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-sm">Уровень</label>
              <div className="mt-1">
                <StatusBadge status={manager.qualifications.level} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Контактная информация</label>
            <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
              <div>
                <span className="text-slate-400 text-sm">Телефон:</span>
                <p className="text-white font-medium">{manager.contact.phone}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Email:</span>
                <p className="text-white font-medium">{manager.contact.email}</p>
              </div>
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Специализация</label>
            <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
              <div>
                <span className="text-slate-400 text-sm">Направления:</span>
                <p className="text-white font-medium">{manager.specialization.join(', ')}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Опыт работы:</span>
                <p className="text-white font-medium">{manager.qualifications.experience} лет</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Загрузка менеджера</label>
            <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">Текущие клиенты</span>
                <span className="text-white font-bold">{manager.currentClients.length}/{manager.maxClients}</span>
              </div>
              <ProgressBar 
                value={utilization} 
                color={utilization > 90 ? COLORS.rose : utilization > 75 ? COLORS.orange : COLORS.success}
                showValue={true}
              />
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Расписание</label>
            <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
              <div>
                <span className="text-slate-400 text-sm">Дни работы:</span>
                <p className="text-white font-medium">{manager.schedule.days.join(', ')}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Часы работы:</span>
                <p className="text-white font-medium">{manager.schedule.hours}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-xl">{manager.ratings.average}</p>
            <p className="text-slate-400 text-xs">рейтинг</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-xl">{manager.metrics.clientSatisfaction}%</p>
            <p className="text-slate-400 text-xs">удовлетворенность</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-xl">{manager.metrics.retentionRate}%</p>
            <p className="text-slate-400 text-xs">удержание</p>
          </div>
        </div>

        {manager.qualifications.certifications.length > 0 && (
          <div>
            <label className="text-slate-400 text-sm font-medium mb-3 block">Сертификаты</label>
            <div className="space-y-2">
              {manager.qualifications.certifications.map((cert, index) => (
                <div key={index} className="p-3 bg-slate-800/30 rounded-xl">
                  <p className="text-white text-sm">{cert}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {manager.currentClients.length > 0 && (
          <div>
            <label className="text-slate-400 text-sm font-medium mb-3 block">Текущие клиенты</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {manager.currentClients.map((clientId) => {
                const client = serviceClients.find(c => c.id === clientId);
                return client ? (
                  <div key={clientId} className="p-3 bg-slate-800/30 rounded-xl">
                    <p className="text-white font-medium text-sm">{client.name}</p>
                    <p className="text-slate-400 text-xs">{client.industry}</p>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary} relative`}>
      <style jsx global>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Header Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Клиентский сервис <span className="text-indigo-400">"Профессионал"</span>
              </h1>
              <p className="text-slate-400 text-lg">Комплексные бизнес-услуги для компаний любого масштаба</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск услуг, клиентов, заказов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full lg:w-80 px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                />
                <svg className="absolute right-3 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <button 
                className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 px-6 py-3 rounded-2xl transition-all duration-200 font-semibold flex items-center gap-2 justify-center"
                onClick={() => openModal('Новый заказ', (
                  <div className="space-y-4">
                    <p className="text-slate-400 text-center">Функционал создания заказа в разработке...</p>
                  </div>
                ), 'md')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Новый заказ
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Всего клиентов"
              value={clientServiceStats.totalClients}
              change={15}
              icon="👥"
              color={COLORS.indigo}
              subtitle={`${clientServiceStats.activeClients} активных`}
              trend="up"
            />
            <StatCard
              title="Клиентских услуг"
              value={clientServiceStats.totalServices}
              change={8}
              icon="💼"
              color={COLORS.purple}
              subtitle={`${clientServiceStats.activeServices} активных`}
              trend="up"
            />
            <StatCard
              title="Менеджеров"
              value={clientServiceStats.totalManagers}
              change={12}
              icon="👨‍💼"
              color={COLORS.blue}
              subtitle={`${clientServiceStats.availableManagers} доступно`}
              trend="up"
            />
            <StatCard
              title="Заказов сегодня"
              value={clientServiceStats.todayOrders}
              change={25}
              icon="📋"
              color={COLORS.teal}
              subtitle="консультаций"
              trend="up"
            />
          </div>
        </motion.section>

        {/* Tabs Navigation */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex overflow-x-auto scrollbar-hide">
              <div className="flex gap-1 bg-slate-800/30 rounded-2xl p-1.5 border border-slate-700/50">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                      activeTab === tab.id
                        ? 'bg-slate-700/50 text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                    }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                        activeTab === tab.id 
                          ? 'bg-indigo-500 text-white' 
                          : 'bg-slate-600 text-slate-300'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Tab Content */}
        <motion.section
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Popular Services */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Популярные клиентские услуги</h2>
                    <button 
                      className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1"
                      onClick={() => setActiveTab('services')}
                    >
                      Все услуги
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clientServices
                      .filter(service => service.status === 'active')
                      .sort((a, b) => b.metrics.satisfaction - a.metrics.satisfaction)
                      .slice(0, 6)
                      .map((service, index) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ServiceCard 
                          service={service} 
                          onClick={() => openModal(service.name, renderServiceModal(service), 'xl')}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Recent Clients & Managers */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Ключевые клиенты</h3>
                      <button 
                        className="text-slate-400 hover:text-slate-300 text-sm font-medium"
                        onClick={() => setActiveTab('clients')}
                      >
                        Все клиенты →
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {serviceClients
                        .filter(client => client.status === 'active')
                        .sort((a, b) => b.totalSpent - a.totalSpent)
                        .slice(0, 4)
                        .map((client, index) => (
                        <motion.div
                          key={client.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <ClientCard 
                            client={client}
                            onClick={() => openModal(client.name, renderClientModal(client), 'xl')}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Активные менеджеры</h3>
                      <button 
                        className="text-slate-400 hover:text-slate-300 text-sm font-medium"
                        onClick={() => setActiveTab('managers')}
                      >
                        Все менеджеры →
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {serviceManagers
                        .filter(manager => manager.status === 'active' || manager.status === 'busy')
                        .slice(0, 4)
                        .map((manager, index) => (
                        <motion.div
                          key={manager.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <ManagerCard 
                            manager={manager}
                            onClick={() => openModal(manager.name, renderManagerModal(manager), 'xl')}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Текущие заказы</h3>
                    <button 
                      className="text-slate-400 hover:text-slate-300 text-sm font-medium"
                      onClick={() => setActiveTab('orders')}
                    >
                      Все заказы →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clientServiceOrders
                      .sort((a, b) => new Date(b.timeline.created).getTime() - new Date(a.timeline.created).getTime())
                      .slice(0, 3)
                      .map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <OrderCard 
                          order={order}
                          onClick={() => openModal(`Заказ #${order.id.split('-')[1]}`, (
                            <div className="space-y-4">
                              <p className="text-slate-400">Детальная информация о заказе...</p>
                            </div>
                          ), 'md')}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Клиентские услуги</h2>
                  <div className="flex gap-2">
                    <button className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-slate-200 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                      Фильтры
                    </button>
                    <button className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                      + Новая услуга
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ServiceCard 
                        service={service}
                        onClick={() => openModal(service.name, renderServiceModal(service), 'xl')}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'clients' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Клиенты</h2>
                  <button className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                    + Новый клиент
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredClients.map((client, index) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ClientCard 
                        client={client}
                        onClick={() => openModal(client.name, renderClientModal(client), 'xl')}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'managers' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Менеджеры</h2>
                  <button className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                    + Новый менеджер
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredManagers.map((manager, index) => (
                    <motion.div
                      key={manager.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ManagerCard 
                        manager={manager}
                        onClick={() => openModal(manager.name, renderManagerModal(manager), 'xl')}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'specialists' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Специалисты</h2>
                  <button className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                    + Новый специалист
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSpecialists.map((specialist, index) => (
                    <motion.div
                      key={specialist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <SpecialistCard 
                        specialist={specialist}
                        onClick={() => openModal(specialist.name, (
                          <div className="space-y-4">
                            <p className="text-slate-400">Детальная информация о специалисте...</p>
                          </div>
                        ), 'md')}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Заказы на услуги</h2>
                  <button className="bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                    + Новый заказ
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <OrderCard 
                        order={order}
                        onClick={() => openModal(`Заказ #${order.id.split('-')[1]}`, (
                          <div className="space-y-4">
                            <p className="text-slate-400">Детальная информация о заказе...</p>
                          </div>
                        ), 'md')}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Analytics Overview */}
                <div className="grid lg:grid-cols-3 gap-6">
                  <BentoCard className="p-6" glowColor={COLORS.indigo}>
                    <h3 className="text-white font-semibold mb-4">Эффективность услуг</h3>
                    <div className="text-3xl font-bold text-white mb-2">95.2%</div>
                    <ProgressBar value={95.2} color={COLORS.indigo} />
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-slate-300">
                      <div>
                        <p>Средняя длительность</p>
                        <p className="text-white font-medium">2.8 мес</p>
                      </div>
                      <div>
                        <p>Успешность</p>
                        <p className="text-white font-medium">96.5%</p>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.purple}>
                    <h3 className="text-white font-semibold mb-4">Финансовые показатели</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                        <span className="text-slate-300">Общая выручка</span>
                        <span className="text-white font-medium">{formatCurrency(clientServiceStats.totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                        <span className="text-slate-300">Средний чек</span>
                        <span className="text-white font-medium">{formatCurrency(serviceClients.length > 0 ? clientServiceStats.totalRevenue / serviceClients.length : 0)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                        <span className="text-slate-300">Заказов в день</span>
                        <span className="text-emerald-300 font-medium">{clientServiceStats.todayOrders}</span>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.blue}>
                    <h3 className="text-white font-semibold mb-4">Распределение по типам</h3>
                    <div className="space-y-3">
                      {[
                        { type: 'Консалтинг', percentage: 30, orders: Math.round(clientServiceOrders.length * 0.30) },
                        { type: 'Поддержка', percentage: 25, orders: Math.round(clientServiceOrders.length * 0.25) },
                        { type: 'Внедрение', percentage: 20, orders: Math.round(clientServiceOrders.length * 0.20) },
                        { type: 'Обучение', percentage: 15, orders: Math.round(clientServiceOrders.length * 0.15) },
                        { type: 'Разработка', percentage: 10, orders: Math.round(clientServiceOrders.length * 0.10) }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-white text-sm">{item.type}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-300 text-sm">{item.percentage}%</span>
                            <span className="text-slate-400 text-xs">({item.orders})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </BentoCard>
                </div>

                {/* Client Service Analytics */}
                <BentoCard className="p-6">
                  <h3 className="text-white font-semibold mb-4">Аналитика клиентских услуг</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Ключевые показатели</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Среднее время выполнения</span>
                          <span className="text-white font-medium">3.1 мес</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Отмененные заказы</span>
                          <span className="text-white font-medium">4.2%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Повторные заказы</span>
                          <span className="text-white font-medium">35.8%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Удовлетворенность</span>
                          <span className="text-white font-medium">94.7%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Эффективность по типам услуг</h4>
                      <div className="space-y-3">
                        {[
                          { type: 'Бизнес-консалтинг', effectiveness: 96, revenue: '1.2M' },
                          { type: 'Техподдержка', effectiveness: 98, revenue: '800K' },
                          { type: 'Внедрение', effectiveness: 92, revenue: '1.5M' },
                          { type: 'Обучение', effectiveness: 95, revenue: '600K' }
                        ].map((item, index) => (
                          <div key={index} className="p-3 bg-slate-800/30 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white text-sm">{item.type}</span>
                              <span className="text-slate-300 text-sm">{item.effectiveness}%</span>
                            </div>
                            <ProgressBar value={item.effectiveness} color={COLORS.indigo} />
                            <p className="text-slate-400 text-xs mt-2">Выручка: {item.revenue} руб</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </BentoCard>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>

      {/* Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={closeModal} 
        title={modalTitle}
        size="xl"
      >
        {modalContent}
      </Modal>
    </div>
  );
}