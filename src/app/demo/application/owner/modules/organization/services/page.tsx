'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Типы данных
interface Service {
  id: string;
  name: string;
  category: 'consulting' | 'support' | 'training' | 'development' | 'maintenance' | 'analytics';
  description: string;
  status: 'active' | 'inactive' | 'development';
  price: {
    type: 'fixed' | 'hourly' | 'monthly' | 'project';
    amount: number;
    currency: 'RUB' | 'USD' | 'EUR';
  };
  duration: string;
  capacity: number;
  currentLoad: number;
  rating: number;
  reviews: number;
  requirements: string[];
  features: string[];
  sla?: {
    availability: number;
    responseTime: string;
    resolutionTime: string;
  };
}

interface Client {
  id: string;
  name: string;
  type: 'individual' | 'startup' | 'sme' | 'enterprise' | 'government';
  industry: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
  status: 'active' | 'onboarding' | 'suspended' | 'completed';
  since: string;
  services: ClientService[];
  revenue: number;
  satisfaction: number;
  notes?: string;
}

interface ClientService {
  serviceId: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  billing: {
    type: 'fixed' | 'hourly' | 'monthly';
    rate: number;
    totalBilled: number;
  };
  team: string[];
  progress?: number;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: 'sales' | 'technical' | 'support' | 'management' | 'consulting';
  email: string;
  phone: string;
  status: 'active' | 'vacation' | 'sick' | 'off';
  skills: string[];
  experience: number;
  currentProjects: string[];
  utilization: number;
  rating: number;
  hireDate: string;
}

interface Project {
  id: string;
  name: string;
  clientId: string;
  serviceId: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  deadline: string;
  budget: number;
  spent: number;
  team: string[];
  milestones: Milestone[];
  deliverables: string[];
  risks: Risk[];
}

interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  progress: number;
}

interface Risk {
  id: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
  status: 'open' | 'monitoring' | 'resolved';
}

// Моки данных
const services: Service[] = [
  {
    id: 's-001',
    name: 'IT-консалтинг и стратегия',
    category: 'consulting',
    description: 'Разработка IT-стратегии, цифровая трансформация, оптимизация бизнес-процессов',
    status: 'active',
    price: {
      type: 'hourly',
      amount: 4500,
      currency: 'RUB'
    },
    duration: '3-6 месяцев',
    capacity: 10,
    currentLoad: 8,
    rating: 4.8,
    reviews: 47,
    requirements: ['Технический аудит', 'Бизнес-анализ', 'Стратегическая сессия'],
    features: ['IT-стратегия', 'Roadmap', 'KPI система', 'Реализация плана'],
    sla: {
      availability: 99.9,
      responseTime: '2 часа',
      resolutionTime: '24 часа'
    }
  },
  {
    id: 's-002',
    name: 'Техническая поддержка 24/7',
    category: 'support',
    description: 'Круглосуточная техническая поддержка и обслуживание IT-инфраструктуры',
    status: 'active',
    price: {
      type: 'monthly',
      amount: 125000,
      currency: 'RUB'
    },
    duration: 'Ежемесячно',
    capacity: 25,
    currentLoad: 22,
    rating: 4.9,
    reviews: 156,
    requirements: ['Доступ к системам', 'Документация'],
    features: ['24/7 мониторинг', 'Проактивная поддержка', 'Ежемесячные отчеты', 'SLA гарантии'],
    sla: {
      availability: 99.95,
      responseTime: '15 минут',
      resolutionTime: '4 часа'
    }
  },
  {
    id: 's-003',
    name: 'Разработка ПО под ключ',
    category: 'development',
    description: 'Полный цикл разработки программного обеспечения: от анализа до внедрения',
    status: 'active',
    price: {
      type: 'project',
      amount: 2500000,
      currency: 'RUB'
    },
    duration: '6-12 месяцев',
    capacity: 8,
    currentLoad: 6,
    rating: 4.7,
    reviews: 89,
    requirements: ['ТЗ', 'Доступ к команде', 'Регулярные встречи'],
    features: ['Agile разработка', 'QA тестирование', 'Документация', 'Обучение'],
    sla: {
      availability: 99.5,
      responseTime: '4 часа',
      resolutionTime: '48 часов'
    }
  },
  {
    id: 's-004',
    name: 'Обучение и сертификация',
    category: 'training',
    description: 'Корпоративное обучение IT-специалистов и сертификация по современным технологиям',
    status: 'active',
    price: {
      type: 'fixed',
      amount: 150000,
      currency: 'RUB'
    },
    duration: '1-2 месяца',
    capacity: 50,
    currentLoad: 35,
    rating: 4.9,
    reviews: 234,
    requirements: ['Группа 5-15 человек', 'Техническое оснащение'],
    features: ['Сертифицированные тренеры', 'Практические задания', 'Сертификаты', 'Поддержка после обучения']
  },
  {
    id: 's-005',
    name: 'Бизнес-аналитика и дашборды',
    category: 'analytics',
    description: 'Разработка систем бизнес-аналитики, дашбордов и отчетности',
    status: 'development',
    price: {
      type: 'project',
      amount: 800000,
      currency: 'RUB'
    },
    duration: '2-4 месяца',
    capacity: 12,
    currentLoad: 3,
    rating: 4.6,
    reviews: 34,
    requirements: ['Источники данных', 'Бизнес-метрики'],
    features: ['Интерактивные дашборды', 'Автоматические отчеты', 'Прогнозное моделирование']
  },
  {
    id: 's-006',
    name: 'Облачная миграция',
    category: 'consulting',
    description: 'Миграция инфраструктуры и приложений в облачные платформы',
    status: 'active',
    price: {
      type: 'project',
      amount: 1800000,
      currency: 'RUB'
    },
    duration: '3-9 месяцев',
    capacity: 6,
    currentLoad: 4,
    rating: 4.8,
    reviews: 67,
    requirements: ['Текущая архитектура', 'Бюджет миграции'],
    features: ['Анализ текущего состояния', 'План миграции', 'Тестирование', 'Пост-миграционная поддержка']
  }
];

const clients: Client[] = [
  {
    id: 'c-001',
    name: 'ООО "ПромТехнологии"',
    type: 'enterprise',
    industry: 'Промышленность',
    contact: {
      name: 'Иванов Алексей Петрович',
      email: 'a.ivanov@promtech.ru',
      phone: '+7 (495) 111-22-33',
      position: 'IT-директор'
    },
    status: 'active',
    since: '2022-03-15',
    revenue: 4850000,
    satisfaction: 95,
    services: [
      {
        serviceId: 's-001',
        startDate: '2022-03-15',
        status: 'active',
        billing: {
          type: 'hourly',
          rate: 4500,
          totalBilled: 2450000
        },
        team: ['e-001', 'e-003']
      },
      {
        serviceId: 's-002',
        startDate: '2022-04-01',
        status: 'active',
        billing: {
          type: 'monthly',
          rate: 125000,
          totalBilled: 3000000
        },
        team: ['e-004', 'e-005']
      }
    ],
    notes: 'Ключевой клиент, планируют расширение сотрудничества'
  },
  {
    id: 'c-002',
    name: 'Стартап "Инновационные решения"',
    type: 'startup',
    industry: 'IT',
    contact: {
      name: 'Петрова Мария Сергеевна',
      email: 'm.petrova@innovate.ru',
      phone: '+7 (916) 222-33-44',
      position: 'CEO'
    },
    status: 'active',
    since: '2023-08-20',
    revenue: 1200000,
    satisfaction: 92,
    services: [
      {
        serviceId: 's-003',
        startDate: '2023-08-20',
        status: 'active',
        progress: 65,
        billing: {
          type: 'project',
          rate: 2500000,
          totalBilled: 1200000
        },
        team: ['e-002', 'e-006', 'e-007']
      }
    ]
  },
  {
    id: 'c-003',
    name: 'ГБУ "Городская больница №1"',
    type: 'government',
    industry: 'Здравоохранение',
    contact: {
      name: 'Сидоров Дмитрий Владимирович',
      email: 'd.sidorov@hospital1.ru',
      phone: '+7 (495) 333-44-55',
      position: 'Главный врач'
    },
    status: 'onboarding',
    since: '2024-01-10',
    revenue: 0,
    satisfaction: 0,
    services: [
      {
        serviceId: 's-004',
        startDate: '2024-01-10',
        status: 'pending',
        billing: {
          type: 'fixed',
          rate: 150000,
          totalBilled: 0
        },
        team: ['e-008']
      }
    ]
  },
  {
    id: 'c-004',
    name: 'ИП Козлов А.В.',
    type: 'individual',
    industry: 'Розничная торговля',
    contact: {
      name: 'Козлов Андрей Викторович',
      email: 'a.kozlov@mail.ru',
      phone: '+7 (925) 444-55-66',
      position: 'Владелец'
    },
    status: 'active',
    since: '2023-11-05',
    revenue: 375000,
    satisfaction: 88,
    services: [
      {
        serviceId: 's-002',
        startDate: '2023-11-05',
        status: 'active',
        billing: {
          type: 'monthly',
          rate: 125000,
          totalBilled: 375000
        },
        team: ['e-004']
      }
    ]
  }
];

const employees: Employee[] = [
  {
    id: 'e-001',
    name: 'Смирнов Алексей Викторович',
    position: 'Ведущий IT-консультант',
    department: 'consulting',
    email: 'a.smirnov@company.ru',
    phone: '+7 (916) 111-22-33',
    status: 'active',
    skills: ['IT Strategy', 'Digital Transformation', 'Business Analysis'],
    experience: 10,
    currentProjects: ['c-001', 'c-005'],
    utilization: 85,
    rating: 4.9,
    hireDate: '2019-03-15'
  },
  {
    id: 'e-002',
    name: 'Ковалева Ирина Дмитриевна',
    position: 'Руководитель проектов',
    department: 'management',
    email: 'i.kovaleva@company.ru',
    phone: '+7 (925) 222-33-44',
    status: 'active',
    skills: ['Project Management', 'Agile', 'Scrum', 'Risk Management'],
    experience: 8,
    currentProjects: ['c-002', 'c-006'],
    utilization: 90,
    rating: 4.8,
    hireDate: '2020-06-01'
  },
  {
    id: 'e-003',
    name: 'Петров Дмитрий Сергеевич',
    position: 'Бизнес-аналитик',
    department: 'consulting',
    email: 'd.petrov@company.ru',
    phone: '+7 (916) 333-44-55',
    status: 'vacation',
    skills: ['Requirements Analysis', 'UML', 'BPMN', 'SQL'],
    experience: 6,
    currentProjects: ['c-001'],
    utilization: 75,
    rating: 4.7,
    hireDate: '2021-02-20'
  },
  {
    id: 'e-004',
    name: 'Иванова Мария Алексеевна',
    position: 'Инженер технической поддержки',
    department: 'support',
    email: 'm.ivanova@company.ru',
    phone: '+7 (925) 444-55-66',
    status: 'active',
    skills: ['Helpdesk', 'Networking', 'Windows Server', 'Linux'],
    experience: 4,
    currentProjects: ['c-001', 'c-004'],
    utilization: 95,
    rating: 4.9,
    hireDate: '2022-08-10'
  },
  {
    id: 'e-005',
    name: 'Сидоров Андрей Владимирович',
    position: 'Разработчик Full-Stack',
    department: 'technical',
    email: 'a.sidorov@company.ru',
    phone: '+7 (916) 555-66-77',
    status: 'active',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
    experience: 5,
    currentProjects: ['c-002'],
    utilization: 88,
    rating: 4.6,
    hireDate: '2021-11-15'
  }
];

const projects: Project[] = [
  {
    id: 'p-001',
    name: 'Цифровая трансформация ПромТехнологии',
    clientId: 'c-001',
    serviceId: 's-001',
    status: 'active',
    priority: 'high',
    startDate: '2024-01-15',
    deadline: '2024-09-30',
    budget: 4500000,
    spent: 2450000,
    team: ['e-001', 'e-003'],
    milestones: [
      {
        id: 'm-1',
        name: 'Анализ текущего состояния',
        dueDate: '2024-02-28',
        status: 'completed',
        progress: 100
      },
      {
        id: 'm-2',
        name: 'Разработка IT-стратегии',
        dueDate: '2024-04-15',
        status: 'completed',
        progress: 100
      },
      {
        id: 'm-3',
        name: 'Внедрение CRM системы',
        dueDate: '2024-07-31',
        status: 'in_progress',
        progress: 65
      },
      {
        id: 'm-4',
        name: 'Обучение персонала',
        dueDate: '2024-09-15',
        status: 'pending',
        progress: 0
      }
    ],
    deliverables: [
      'Отчет по анализу текущего состояния',
      'IT-стратегия и roadmap',
      'Внедренная CRM система',
      'Обученный персонал'
    ],
    risks: [
      {
        id: 'r-1',
        description: 'Сопротивление персонала изменениям',
        probability: 'medium',
        impact: 'high',
        mitigation: 'Программа change management, обучение',
        status: 'monitoring'
      }
    ]
  },
  {
    id: 'p-002',
    name: 'Разработка платформы для стартапа',
    clientId: 'c-002',
    serviceId: 's-003',
    status: 'active',
    priority: 'critical',
    startDate: '2023-08-20',
    deadline: '2024-06-30',
    budget: 2500000,
    spent: 1200000,
    team: ['e-002', 'e-005'],
    milestones: [
      {
        id: 'm-5',
        name: 'Прототип и дизайн',
        dueDate: '2023-10-31',
        status: 'completed',
        progress: 100
      },
      {
        id: 'm-6',
        name: 'Разработка ядра системы',
        dueDate: '2024-02-29',
        status: 'completed',
        progress: 100
      },
      {
        id: 'm-7',
        name: 'Интеграция и тестирование',
        dueDate: '2024-05-31',
        status: 'in_progress',
        progress: 45
      },
      {
        id: 'm-8',
        name: 'Запуск в production',
        dueDate: '2024-06-30',
        status: 'pending',
        progress: 0
      }
    ],
    deliverables: [
      'Прототип системы',
      'Полностью функционирующая платформа',
      'Документация',
      'Обучение администраторов'
    ],
    risks: [
      {
        id: 'r-2',
        description: 'Изменение требований в процессе разработки',
        probability: 'high',
        impact: 'medium',
        mitigation: 'Гибкая методология, регулярные демо',
        status: 'open'
      }
    ]
  }
];

// Константы с расширенной палитрой
const COLORS = {
  primary: 'from-gray-900 via-black to-gray-800',
  secondary: 'from-purple-900 via-black to-blue-900',
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
  violet: '139, 92, 246',
  lime: '132, 204, 22',
  fuchsia: '217, 70, 239'
} as const;

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const formatCurrency = (value: number) => currencyFormatter.format(value);
const formatNumber = (value: number) => new Intl.NumberFormat('ru-RU').format(value);
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ru-RU');
const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString('ru-RU');

// Улучшенный хук для блокировки прокрутки
const useLockBodyScroll = (locked: boolean) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalHtmlStyle = window.getComputedStyle(document.documentElement).overflow;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    if (locked) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = originalStyle;
      document.documentElement.style.overflow = originalHtmlStyle;
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = originalStyle;
      document.documentElement.style.overflow = originalHtmlStyle;
      document.body.style.paddingRight = '';
    };
  }, [locked]);
};

// Компонент для плавающих частиц фона
const FloatingParticles = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10"
        style={{
          width: Math.random() * 100 + 50,
          height: Math.random() * 100 + 50,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.random() * 20 - 10, 0],
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: Math.random() * 10 + 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// Улучшенный BentoCard с магнитным эффектом
const BentoCard = ({ 
  children, 
  className = '', 
  glowColor = COLORS.blue, 
  onClick, 
  variant = 'default',
  delay = 0,
  hoverScale = 1.01,
  magnetic = false
}: { 
  children: React.ReactNode; 
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'featured' | 'interactive';
  delay?: number;
  hoverScale?: number;
  magnetic?: boolean;
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnetic) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    setPosition({ x, y });
  };
  
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const sizeClasses = {
    default: 'p-4 sm:p-6',
    compact: 'p-3 sm:p-4',
    featured: 'p-6 sm:p-8',
    interactive: 'p-4 sm:p-6 cursor-pointer group'
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden 
        rounded-xl sm:rounded-2xl border border-white/10
        bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg 
        transition-all duration-300 hover:shadow-2xl hover:border-white/20
        w-full max-w-full
        ${onClick ? 'cursor-pointer' : ''}
        ${sizeClasses[variant]}
        ${className}
      `}
      style={{
        backgroundImage: `
          radial-gradient(280px circle at 50% 50%, rgba(${glowColor},0.12), transparent 60%),
          linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)
        `,
        transform: magnetic ? `perspective(1000px) rotateX(${position.y * 5}deg) rotateY(${position.x * 5}deg)` : 'none'
      }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ 
        y: -4, 
        scale: hoverScale,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(${glowColor},0.15), transparent 50%)`
        }}
      />
      
      <div className="relative z-10 h-full">
        {children}
      </div>

      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:animate-shine" />
      </div>

      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div 
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${glowColor},0.3), transparent)`,
            mask: 'linear-gradient(white, white) content-box, linear-gradient(white, white)',
            maskComposite: 'exclude',
            padding: '1px'
          }}
        />
      </div>
    </motion.div>
  );
};

// Улучшенный StatusBadge
const StatusBadge = ({ status, type = 'default', size = 'default', pulse = false }: { 
  status: string; 
  type?: 'default' | 'service' | 'client' | 'employee' | 'project' | 'priority' | 'department';
  size?: 'default' | 'small' | 'large';
  pulse?: boolean;
}) => {
  const getStatusConfig = () => {
    const configs = {
      active: { color: COLORS.success, label: 'Активен', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '🟢' },
      inactive: { color: COLORS.error, label: 'Неактивен', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '🔴' },
      development: { color: COLORS.blue, label: 'В разработке', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '🛠️' },
      onboarding: { color: COLORS.orange, label: 'Подключение', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '🔄' },
      suspended: { color: COLORS.warning, label: 'Приостановлен', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '⏸️' },
      completed: { color: COLORS.success, label: 'Завершен', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '✅' },
      vacation: { color: COLORS.purple, label: 'Отпуск', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: '🏖️' },
      sick: { color: COLORS.rose, label: 'Больничный', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: '🏥' },
      off: { color: COLORS.gray, label: 'Не на смене', bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: '⚪' },
      planning: { color: COLORS.blue, label: 'Планирование', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '📅' },
      on_hold: { color: COLORS.warning, label: 'На паузе', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '⏸️' },
      cancelled: { color: COLORS.error, label: 'Отменен', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '❌' },
      pending: { color: COLORS.warning, label: 'Ожидание', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '⏳' },
      low: { color: COLORS.success, label: 'Низкий', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '📉' },
      medium: { color: COLORS.warning, label: 'Средний', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '📊' },
      high: { color: COLORS.orange, label: 'Высокий', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '📈' },
      critical: { color: COLORS.rose, label: 'Критический', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: '🚨' },
      consulting: { color: COLORS.blue, label: 'Консалтинг', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '💼' },
      support: { color: COLORS.emerald, label: 'Поддержка', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: '🔧' },
      training: { color: COLORS.purple, label: 'Обучение', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: '🎓' },
      development: { color: COLORS.orange, label: 'Разработка', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '💻' },
      analytics: { color: COLORS.cyan, label: 'Аналитика', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: '📊' },
      maintenance: { color: COLORS.teal, label: 'Обслуживание', bg: 'bg-teal-500/10', border: 'border-teal-500/20', icon: '🔧' },
      individual: { color: COLORS.gray, label: 'Физ. лицо', bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: '👤' },
      startup: { color: COLORS.blue, label: 'Стартап', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '🚀' },
      sme: { color: COLORS.emerald, label: 'МСБ', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: '🏢' },
      enterprise: { color: COLORS.purple, label: 'Корпорация', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: '🏛️' },
      government: { color: COLORS.orange, label: 'Гос. учреждение', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '🏛️' },
      sales: { color: COLORS.cyan, label: 'Продажи', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: '💰' },
      technical: { color: COLORS.orange, label: 'Технический', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '⚙️' },
      management: { color: COLORS.purple, label: 'Менеджмент', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: '👔' }
    };
    return configs[status as keyof typeof configs] || { color: COLORS.info, label: status, bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: '⚪' };
  };

  const config = getStatusConfig();
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    default: 'px-3 py-1.5 text-xs',
    large: 'px-4 py-2 text-sm'
  };

  return (
    <motion.span 
      className={`inline-flex items-center rounded-full font-medium border ${config.bg} ${config.border} ${sizeClasses[size]} ${
        pulse ? 'animate-pulse' : ''
      }`}
      style={{ color: `rgb(${config.color})` }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, type: "spring" }}
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className="mr-1.5 text-xs"
        animate={{ 
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          duration: 2, 
          repeat: pulse ? Infinity : 0,
          repeatType: "reverse"
        }}
      >
        {config.icon}
      </motion.span>
      {config.label}
    </motion.span>
  );
};

// Новый компонент для интерактивных карточек с графиками
const MetricCard = ({ title, value, change, chartData, color = COLORS.blue }: {
  title: string;
  value: string | number;
  change?: number;
  chartData?: number[];
  color?: string;
}) => {
  const maxValue = Math.max(...(chartData || []));
  
  return (
    <BentoCard className="p-4" glowColor={color} magnetic>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
          <div className="text-2xl font-bold text-white">{value}</div>
        </div>
        {change !== undefined && (
          <div className={`text-xs px-2 py-1 rounded-full ${
            change >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </div>
        )}
      </div>
      
      {chartData && (
        <div className="flex items-end justify-between h-12 gap-1">
          {chartData.map((value, index) => (
            <motion.div
              key={index}
              className="flex-1 bg-white/20 rounded-t-sm"
              style={{
                height: `${(value / maxValue) * 100}%`,
                backgroundColor: `rgba(${color}, 0.6)`
              }}
              initial={{ height: 0 }}
              animate={{ height: `${(value / maxValue) * 100}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                backgroundColor: `rgba(${color}, 0.8)`,
                transition: { duration: 0.2 }
              }}
            />
          ))}
        </div>
      )}
    </BentoCard>
  );
};

// Улучшенный ProgressBar с анимацией
const ProgressBar = ({ value, max = 100, color = COLORS.blue, label, size = 'default', animated = true }: { 
  value: number; 
  max?: number;
  color?: string;
  label?: string;
  size?: 'default' | 'small' | 'large';
  animated?: boolean;
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const height = {
    small: 'h-1.5',
    default: 'h-2.5',
    large: 'h-3'
  }[size];
  
  return (
    <div className="w-full">
      {label && (
        <div className={`flex justify-between text-white/60 mb-2 ${
          size === 'small' ? 'text-xs' : 
          size === 'large' ? 'text-base' : 'text-sm'
        }`}>
          <span>{label}</span>
          <span className="font-medium">{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div className={`w-full bg-white/10 rounded-full overflow-hidden ${height} relative`}>
        <motion.div 
          className={`rounded-full ${height}`}
          style={{ 
            backgroundColor: `rgb(${color})`,
            boxShadow: `0 0 12px rgba(${color}, 0.4)`
          }}
          initial={{ width: animated ? 0 : `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 1.5 : 0.5, 
            ease: "easeOut",
            delay: animated ? 0.3 : 0
          }}
        />
        <div 
          className="absolute top-0 left-0 h-full rounded-full opacity-30"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)`,
            width: `${percentage}%`
          }}
        />
      </div>
    </div>
  );
};

// Улучшенный StatCard
const StatCard = ({ title, value, change, icon, color = COLORS.blue, size = 'default', trend, subtitle, onClick }: {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color?: string;
  size?: 'default' | 'compact' | 'large';
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  onClick?: () => void;
}) => {
  const sizeClasses = {
    compact: 'p-4',
    default: 'p-6',
    large: 'p-8'
  };
  
  const textSize = {
    compact: 'text-xl',
    default: 'text-2xl lg:text-3xl',
    large: 'text-3xl lg:text-4xl'
  }[size];

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→'
  };

  return (
    <BentoCard 
      className={sizeClasses[size]} 
      glowColor={color} 
      variant={size === 'compact' ? 'compact' : 'default'}
      hoverScale={1.02}
      magnetic
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div 
          className={`${size === 'compact' ? 'text-2xl' : 'text-3xl'} transition-transform duration-300 group-hover:scale-110`}
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        {change !== undefined && (
          <motion.div 
            className={`font-medium px-2 py-1 rounded-full ${
              change >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            } ${size === 'compact' ? 'text-xs' : 'text-sm'}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {trendIcons[trend || (change >= 0 ? 'up' : 'down')]} {Math.abs(change)}%
          </motion.div>
        )}
      </div>
      <motion.div 
        className={`font-bold text-white mb-2 ${textSize}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {value}
      </motion.div>
      <div className={`text-white/60 ${size === 'compact' ? 'text-xs' : 'text-sm'}`}>{title}</div>
      {subtitle && <div className="text-white/40 text-xs mt-1">{subtitle}</div>}
    </BentoCard>
  );
};

// Новый компонент для анимированных счетчиков
const AnimatedCounter = ({ value, duration = 2, format = 'number' }: { 
  value: number; 
  duration?: number;
  format?: 'number' | 'currency' | 'percentage';
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span>
      {format === 'currency' 
        ? formatCurrency(Math.floor(displayValue))
        : format === 'percentage'
        ? `${Math.floor(displayValue)}%`
        : formatNumber(Math.floor(displayValue))
      }
    </span>
  );
};

// Улучшенный SearchAndFilter
const SearchAndFilter = ({ onSearch, onFilter, placeholder = "Поиск...", type = 'services' }: {
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
  placeholder?: string;
  type?: 'services' | 'clients' | 'employees' | 'projects';
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <BentoCard className="p-4 mb-6" variant="compact" magnetic>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <motion.input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={placeholder}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10 transition-all duration-200"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.div 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40"
              animate={{ rotate: searchQuery ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              🔍
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="flex gap-2 flex-wrap"
          initial={false}
          animate={{ height: isExpanded ? 'auto' : '48px' }}
          transition={{ duration: 0.3 }}
        >
          <select 
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-white/20 transition-all duration-200 flex-1 min-w-[120px]"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="inactive">Неактивные</option>
            <option value="development">В разработке</option>
          </select>
          
          {type === 'services' && (
            <select 
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-white/20 transition-all duration-200 flex-1 min-w-[120px]"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">Все категории</option>
              <option value="consulting">Консалтинг</option>
              <option value="support">Поддержка</option>
              <option value="development">Разработка</option>
              <option value="training">Обучение</option>
            </select>
          )}

          <motion.button
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-3 rounded-xl transition-colors font-medium text-sm whitespace-nowrap"
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? 'Меньше фильтров' : 'Больше фильтров'}
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-white/10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-white/60 text-sm mb-2 block">Ценовой диапазон</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любой</option>
                  <option>До 100,000 ₽</option>
                  <option>100,000 - 500,000 ₽</option>
                  <option>Более 500,000 ₽</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Рейтинг</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любой</option>
                  <option>4.5+ ⭐</option>
                  <option>4.0+ ⭐</option>
                  <option>3.5+ ⭐</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Длительность</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любая</option>
                  <option>До 1 месяца</option>
                  <option>1-6 месяцев</option>
                  <option>Более 6 месяцев</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Загрузка</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любая</option>
                  <option>Низкая (&lt;50%)</option>
                  <option>Средняя (50-80%)</option>
                  <option>Высокая (&gt;80%)</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </BentoCard>
  );
};

// Новый компонент для уведомлений
const NotificationBell = ({ count = 0 }: { count?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const notifications = [
    { id: 1, type: 'warning', message: 'Требуется обновление для IT-консалтинга', time: '5 мин назад' },
    { id: 2, type: 'info', message: 'Новый клиент подключен к услугам', time: '1 час назад' },
    { id: 3, type: 'success', message: 'Проект "Разработка платформы" завершен досрочно', time: '2 часа назад' }
  ];

  return (
    <div className="relative">
      <motion.button
        className="relative p-2 text-white/60 hover:text-white transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-4.66-7.5 1 1 0 00-1.2-1.2 7.97 7.97 0 006.16 10.05 1 1 0 001.2-1.2 5.97 5.97 0 01-1.5-4.66zM15 17h5l-5 5v-5z" />
        </svg>
        {count > 0 && (
          <motion.span 
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {count}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-80 bg-gray-900/95 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-b border-white/10">
              <h3 className="text-white font-semibold">Уведомления</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'warning' ? 'bg-yellow-500' :
                      notification.type === 'info' ? 'bg-blue-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-white text-sm">{notification.message}</p>
                      <p className="text-white/40 text-xs mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Улучшенный Modal с анимациями
const Modal = ({ isOpen, onClose, children, title, size = 'md', preventClose = false }: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  preventClose?: boolean;
}) => {
  useLockBodyScroll(isOpen);

  const sizeClasses = {
    sm: 'max-w-md mx-2',
    md: 'max-w-2xl mx-2',
    lg: 'max-w-4xl mx-2',
    xl: 'max-w-6xl mx-2',
    fullscreen: 'max-w-full mx-4 h-[90vh]'
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !preventClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      >
        <motion.div
          className={`relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <BentoCard className="p-4 sm:p-6" variant="featured" magnetic>
            {title && (
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <motion.h2 
                  className="text-xl sm:text-2xl font-bold text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {title}
                </motion.h2>
                {!preventClose && (
                  <motion.button
                    onClick={onClose}
                    className="text-white/60 hover:text-white transition-colors p-1 sm:p-2 rounded-lg hover:bg-white/10"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                )}
              </div>
            )}
            {children}
          </BentoCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Адаптивные карточки с улучшенным дизайном
const ServiceCard = ({ service, onClick, delay = 0 }: { service: Service; onClick: () => void; delay?: number }) => {
  const utilization = (service.currentLoad / service.capacity) * 100;
  
  const getServiceColor = (category: string) => {
    switch (category) {
      case 'consulting': return COLORS.blue;
      case 'support': return COLORS.emerald;
      case 'training': return COLORS.purple;
      case 'development': return COLORS.orange;
      case 'analytics': return COLORS.cyan;
      case 'maintenance': return COLORS.teal;
      default: return COLORS.gray;
    }
  };

  const getPriceDisplay = (price: Service['price']) => {
    switch (price.type) {
      case 'hourly': return `${formatCurrency(price.amount)}/час`;
      case 'monthly': return `${formatCurrency(price.amount)}/месяц`;
      case 'fixed': return formatCurrency(price.amount);
      case 'project': return `от ${formatCurrency(price.amount)}`;
      default: return formatCurrency(price.amount);
    }
  };

  const isHighDemand = utilization > 90;

  return (
    <BentoCard 
      className="p-3 sm:p-4" 
      glowColor={getServiceColor(service.category)}
      onClick={onClick}
      variant="compact"
      delay={delay}
      hoverScale={1.03}
      magnetic
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
          <span className="text-lg">
            {service.category === 'consulting' && '💼'}
            {service.category === 'support' && '🔧'}
            {service.category === 'training' && '🎓'}
            {service.category === 'development' && '💻'}
            {service.category === 'analytics' && '📊'}
            {service.category === 'maintenance' && '⚙️'}
          </span>
          <div className="min-w-0">
            <h4 className="text-white font-semibold text-sm truncate">{service.name}</h4>
            <p className="text-white/60 text-xs">{service.duration}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={service.category} type="service" size="small" />
          <StatusBadge status={service.status} size="small" pulse={isHighDemand} />
        </div>
      </div>
      
      <div className="space-y-1.5 text-xs text-white/60 mb-3">
        <div className="flex justify-between">
          <span>Стоимость:</span>
          <span className="text-white/80">{getPriceDisplay(service.price)}</span>
        </div>
        <div className="flex justify-between">
          <span>Рейтинг:</span>
          <span className="text-white/80 flex items-center gap-1">
            ⭐ {service.rating}/5.0 ({service.reviews})
          </span>
        </div>
        <div className="flex justify-between">
          <span>Загрузка:</span>
          <span className="text-white/80">{service.currentLoad}/{service.capacity}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Эффективность:</span>
          <div className="flex items-center gap-2">
            <ProgressBar 
              value={service.rating * 20} 
              max={100}
              color={getServiceColor(service.category)}
              size="small"
            />
            <span className="text-white/80 text-xs w-8">{(service.rating * 20).toFixed(0)}%</span>
          </div>
        </div>
      </div>
      
      <ProgressBar 
        value={utilization} 
        label="Загрузка сервиса"
        color={utilization > 90 ? COLORS.rose : utilization > 75 ? COLORS.orange : COLORS.success}
        size="small"
      />
      
      <div className="flex gap-2 mt-3">
        <motion.button 
          className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-1.5 px-2 rounded-lg transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Подробнее
        </motion.button>
        <motion.button 
          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs py-1.5 px-2 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Заказать
        </motion.button>
      </div>

      {isHighDemand && (
        <div className="mt-3 p-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <p className="text-orange-300 text-xs text-center">Высокий спрос</p>
        </div>
      )}
    </BentoCard>
  );
};

const ClientCard = ({ client, onClick, delay = 0 }: { client: Client; onClick: () => void; delay?: number }) => {
  const activeServices = client.services.filter(s => s.status === 'active').length;
  const totalBilled = client.services.reduce((sum, s) => sum + s.billing.totalBilled, 0);
  
  const getClientColor = (type: string) => {
    switch (type) {
      case 'enterprise': return COLORS.purple;
      case 'startup': return COLORS.blue;
      case 'sme': return COLORS.emerald;
      case 'government': return COLORS.orange;
      case 'individual': return COLORS.gray;
      default: return COLORS.gray;
    }
  };

  const isVIP = client.revenue > 1000000;

  return (
    <BentoCard 
      className="p-3 sm:p-4" 
      glowColor={getClientColor(client.type)}
      onClick={onClick}
      variant="compact"
      delay={delay}
      hoverScale={1.03}
      magnetic
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-2">
          <h4 className="text-white font-semibold text-sm truncate">{client.name}</h4>
          <p className="text-white/60 text-xs">{client.industry}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={client.type} type="client" size="small" />
          <StatusBadge status={client.status} size="small" pulse={isVIP} />
        </div>
      </div>
      
      <div className="space-y-1.5 text-xs text-white/60 mb-3">
        <div className="flex justify-between">
          <span>Контакт:</span>
          <span className="text-white/80 truncate ml-2 max-w-[100px] sm:max-w-[120px]">{client.contact.name}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Услуги:</span>
          <span className="text-white/80">{activeServices} активных</span>
        </div>
        
        <div className="flex justify-between">
          <span>Выручка:</span>
          <span className="text-white/80">{formatCurrency(totalBilled)}</span>
        </div>

        <div className="flex justify-between">
          <span>Удовлетворенность:</span>
          <span className="text-white/80">{client.satisfaction}%</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <motion.button 
          className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-1.5 px-2 rounded-lg transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Профиль
        </motion.button>
        <motion.button 
          className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-xs py-1.5 px-2 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Услуги
        </motion.button>
      </div>

      {isVIP && (
        <div className="mt-3 p-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <p className="text-purple-300 text-xs text-center">VIP Клиент</p>
        </div>
      )}
    </BentoCard>
  );
};

const EmployeeCard = ({ employee, onClick, delay = 0 }: { employee: Employee; onClick: () => void; delay?: number }) => {
  const getEmployeeColor = (department: string) => {
    switch (department) {
      case 'consulting': return COLORS.blue;
      case 'management': return COLORS.purple;
      case 'technical': return COLORS.orange;
      case 'support': return COLORS.emerald;
      case 'sales': return COLORS.cyan;
      default: return COLORS.gray;
    }
  };

  const isHighPerformer = employee.rating >= 4.5;

  return (
    <BentoCard 
      className="p-3 sm:p-4" 
      glowColor={getEmployeeColor(employee.department)}
      onClick={onClick}
      variant="compact"
      delay={delay}
      hoverScale={1.03}
      magnetic
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-2">
          <h4 className="text-white font-semibold text-sm truncate">{employee.name}</h4>
          <p className="text-white/60 text-xs">{employee.position}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={employee.department} type="department" size="small" />
          <StatusBadge status={employee.status} type="employee" size="small" pulse={isHighPerformer} />
        </div>
      </div>
      
      <div className="space-y-1.5 text-xs text-white/60 mb-3">
        <div className="flex justify-between">
          <span>Опыт:</span>
          <span className="text-white/80">{employee.experience} лет</span>
        </div>
        
        <div className="flex justify-between">
          <span>Рейтинг:</span>
          <span className="text-white/80 flex items-center gap-1">
            ⭐ {employee.rating}/5.0
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Загрузка:</span>
          <span className="text-white/80">{employee.utilization}%</span>
        </div>

        <div className="flex justify-between">
          <span>Проекты:</span>
          <span className="text-white/80">{employee.currentProjects.length}</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <motion.button 
          className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-1.5 px-2 rounded-lg transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Профиль
        </motion.button>
        <motion.button 
          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs py-1.5 px-2 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Назначить
        </motion.button>
      </div>

      {isHighPerformer && (
        <div className="mt-3 p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-amber-300 text-xs text-center">Топ сотрудник</p>
        </div>
      )}
    </BentoCard>
  );
};

const ProjectCard = ({ project, onClick, delay = 0 }: { project: Project; onClick: () => void; delay?: number }) => {
  const client = clients.find(c => c.id === project.clientId);
  const service = services.find(s => s.id === project.serviceId);
  const progress = project.milestones.reduce((sum, m) => sum + m.progress, 0) / project.milestones.length;
  const budgetUtilization = (project.spent / project.budget) * 100;
  const isBehindSchedule = progress < (budgetUtilization / 2);

  return (
    <BentoCard 
      className="p-3 sm:p-4" 
      glowColor={COLORS.orange}
      onClick={onClick}
      variant="compact"
      delay={delay}
      hoverScale={1.03}
      magnetic
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-2">
          <h4 className="text-white font-semibold text-sm truncate">{project.name}</h4>
          <p className="text-white/60 text-xs">
            {client?.name} • {service?.name}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={project.status} type="project" size="small" />
          <StatusBadge status={project.priority} type="priority" size="small" pulse={isBehindSchedule} />
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <ProgressBar 
          value={progress} 
          label={`Прогресс проекта`}
          color={COLORS.blue}
          size="small"
        />

        <ProgressBar 
          value={budgetUtilization} 
          label={`Использование бюджета`}
          color={budgetUtilization > 90 ? COLORS.rose : budgetUtilization > 75 ? COLORS.orange : COLORS.success}
          size="small"
        />

        <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
          <div>
            <span>Дедлайн:</span>
            <p className="text-white/80">{new Date(project.deadline).toLocaleDateString('ru-RU')}</p>
          </div>
          <div className="text-right">
            <span>Бюджет:</span>
            <p className="text-white/80">{formatCurrency(project.budget)}</p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <motion.button 
          className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-1.5 px-2 rounded-lg transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Детали
        </motion.button>
        <motion.button 
          className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-xs py-1.5 px-2 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Отчет
        </motion.button>
      </div>

      {isBehindSchedule && (
        <div className="mt-3 p-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg">
          <p className="text-rose-300 text-xs text-center">Отстает от графика</p>
        </div>
      )}
    </BentoCard>
  );
};

// Модальные окна
const ServiceModal = ({ service, isOpen, onClose }: {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!service) return null;

  const utilization = (service.currentLoad / service.capacity) * 100;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={service.name} size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <StatusBadge status={service.category} type="service" />
            <StatusBadge status={service.status} />
            <span className="text-white/60 text-sm bg-white/5 px-2 sm:px-3 py-1 rounded-full">
              {service.duration}
            </span>
            <span className="text-white/60 text-sm bg-blue-500/10 px-2 sm:px-3 py-1 rounded-full">
              ⭐ {service.rating}/5.0
            </span>
          </div>
          <div className="text-white/60 text-sm">
            ID: {service.id}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Основная информация</h3>
              <div className="space-y-2 text-xs sm:text-sm text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/60">Стоимость:</span>
                  <span className="text-white font-medium">
                    {service.price.type === 'hourly' && `${formatCurrency(service.price.amount)}/час`}
                    {service.price.type === 'monthly' && `${formatCurrency(service.price.amount)}/месяц`}
                    {service.price.type === 'fixed' && formatCurrency(service.price.amount)}
                    {service.price.type === 'project' && `от ${formatCurrency(service.price.amount)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Загрузка:</span>
                  <span className="text-white font-medium">{service.currentLoad}/{service.capacity} клиентов</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Отзывы:</span>
                  <span className="text-white font-medium">{service.reviews} оценок</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Длительность:</span>
                  <span className="text-white font-medium">{service.duration}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Требования</h3>
              <div className="space-y-1">
                {service.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-white/70">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    {req}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Показатели эффективности</h4>
              <div className="space-y-3">
                <ProgressBar value={utilization} label="Загрузка сервиса" color={COLORS.blue} size="small" />
                <ProgressBar value={service.rating * 20} label="Рейтинг качества" color={COLORS.emerald} size="small" />
                <ProgressBar value={90} label="Удовлетворенность" color={COLORS.orange} size="small" />
              </div>
            </BentoCard>

            {service.sla && (
              <BentoCard variant="compact" magnetic>
                <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Соглашение об уровне服务 (SLA)</h4>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Доступность:</span>
                    <span className="text-white font-medium">{service.sla.availability}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Время ответа:</span>
                    <span className="text-white font-medium">{service.sla.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Время решения:</span>
                    <span className="text-white font-medium">{service.sla.resolutionTime}</span>
                  </div>
                </div>
              </BentoCard>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{service.currentLoad}</div>
            <div className="text-white/60 text-xs">Активных клиентов</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{service.capacity}</div>
            <div className="text-white/60 text-xs">Вместимость</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{service.reviews}</div>
            <div className="text-white/60 text-xs">Отзывов</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">
              {Math.round(utilization)}%
            </div>
            <div className="text-white/60 text-xs">Загрузка</div>
          </BentoCard>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Возможности услуги</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {service.features.map((feature, index) => (
              <BentoCard key={index} variant="compact" className="p-3" magnetic>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-white text-sm">{feature}</span>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/10">
          <motion.button 
            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Редактировать услугу
          </motion.button>
          <motion.button 
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Статистика использования
          </motion.button>
          <motion.button 
            className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Создать предложение
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

const ClientModal = ({ client, isOpen, onClose }: {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!client) return null;

  const activeServices = client.services.filter(s => s.status === 'active');
  const totalBilled = client.services.reduce((sum, s) => sum + s.billing.totalBilled, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={client.name} size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <StatusBadge status={client.type} type="client" />
            <StatusBadge status={client.status} />
            <span className="text-white/60 text-sm bg-white/5 px-2 sm:px-3 py-1 rounded-full">
              {client.industry}
            </span>
            <span className="text-white/60 text-sm bg-emerald-500/10 px-2 sm:px-3 py-1 rounded-full">
              {client.satisfaction}% удовл.
            </span>
          </div>
          <div className="text-white/60 text-sm">
            ID: {client.id}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Контактная информация</h3>
              <div className="space-y-2 text-xs sm:text-sm text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/60">Контактное лицо:</span>
                  <span className="text-white font-medium">{client.contact.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Должность:</span>
                  <span className="text-white font-medium">{client.contact.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Телефон:</span>
                  <span className="text-white font-medium">{client.contact.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Email:</span>
                  <span className="text-white font-medium">{client.contact.email}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">История сотрудничества</h3>
              <div className="space-y-2 text-xs sm:text-sm text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/60">С нами с:</span>
                  <span className="text-white font-medium">{formatDate(client.since)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Всего выплачено:</span>
                  <span className="text-white font-medium">{formatCurrency(totalBilled)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Активных услуг:</span>
                  <span className="text-white font-medium">{activeServices.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Показатели клиента</h4>
              <div className="space-y-3">
                <ProgressBar value={client.satisfaction} label="Удовлетворенность" color={COLORS.emerald} size="small" />
                <ProgressBar value={75} label="Лояльность" color={COLORS.blue} size="small" />
                <ProgressBar value={90} label="Вовлеченность" color={COLORS.orange} size="small" />
              </div>
            </BentoCard>

            {client.notes && (
              <BentoCard variant="compact" magnetic>
                <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Примечания</h4>
                <p className="text-white/70 text-sm">{client.notes}</p>
              </BentoCard>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{activeServices.length}</div>
            <div className="text-white/60 text-xs">Активных услуг</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{formatCurrency(totalBilled)}</div>
            <div className="text-white/60 text-xs">Всего выплачено</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{client.satisfaction}%</div>
            <div className="text-white/60 text-xs">Удовлетворенность</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">
              {Math.floor((new Date().getTime() - new Date(client.since).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-white/60 text-xs">Дней сотрудничества</div>
          </BentoCard>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Активные услуги</h3>
          <div className="space-y-2">
            {activeServices.map((clientService, index) => {
              const service = services.find(s => s.id === clientService.serviceId);
              if (!service) return null;
              
              return (
                <BentoCard key={index} variant="compact" className="p-3" magnetic>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{service.name}</h4>
                      <p className="text-white/60 text-xs">С {formatDate(clientService.startDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium text-sm">
                        {clientService.billing.type === 'hourly' && `${formatCurrency(clientService.billing.rate)}/час`}
                        {clientService.billing.type === 'monthly' && `${formatCurrency(clientService.billing.rate)}/месяц`}
                        {clientService.billing.type === 'fixed' && formatCurrency(clientService.billing.rate)}
                        {clientService.billing.type === 'project' && `от ${formatCurrency(clientService.billing.rate)}`}
                      </p>
                      <p className="text-white/60 text-xs">Выплачено: {formatCurrency(clientService.billing.totalBilled)}</p>
                    </div>
                  </div>
                </BentoCard>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/10">
          <motion.button 
            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Редактировать данные
          </motion.button>
          <motion.button 
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            История взаимодействий
          </motion.button>
          <motion.button 
            className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Предложить услугу
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

const EmployeeModal = ({ employee, isOpen, onClose }: {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!employee) return null;

  const currentProjects = projects.filter(p => p.team.includes(employee.id));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={employee.name} size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <StatusBadge status={employee.department} type="department" />
            <StatusBadge status={employee.status} type="employee" />
            <span className="text-white/60 text-sm bg-white/5 px-2 sm:px-3 py-1 rounded-full">
              {employee.experience} лет опыта
            </span>
            <span className="text-white/60 text-sm bg-amber-500/10 px-2 sm:px-3 py-1 rounded-full">
              ⭐ {employee.rating}/5.0
            </span>
          </div>
          <div className="text-white/60 text-sm">
            ID: {employee.id}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Контактная информация</h3>
              <div className="space-y-2 text-xs sm:text-sm text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/60">Должность:</span>
                  <span className="text-white font-medium">{employee.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Email:</span>
                  <span className="text-white font-medium">{employee.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Телефон:</span>
                  <span className="text-white font-medium">{employee.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Дата найма:</span>
                  <span className="text-white font-medium">{formatDate(employee.hireDate)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Навыки</h3>
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-white/10 rounded-lg text-white text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Показатели эффективности</h4>
              <div className="space-y-3">
                <ProgressBar value={employee.utilization} label="Загрузка" color={COLORS.blue} size="small" />
                <ProgressBar value={employee.rating * 20} label="Рейтинг" color={COLORS.amber} size="small" />
                <ProgressBar value={85} label="Качество работы" color={COLORS.emerald} size="small" />
              </div>
            </BentoCard>

            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Текущая нагрузка</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Активные проекты:</span>
                  <span className="text-white font-medium">{currentProjects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Общая загрузка:</span>
                  <span className="text-white font-medium">{employee.utilization}%</span>
                </div>
              </div>
            </BentoCard>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{employee.experience}</div>
            <div className="text-white/60 text-xs">Лет опыта</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{currentProjects.length}</div>
            <div className="text-white/60 text-xs">Проектов</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{employee.rating}/5.0</div>
            <div className="text-white/60 text-xs">Рейтинг</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">
              {employee.utilization}%
            </div>
            <div className="text-white/60 text-xs">Загрузка</div>
          </BentoCard>
        </div>

        {currentProjects.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Текущие проекты</h3>
            <div className="space-y-2">
              {currentProjects.map((project, index) => (
                <BentoCard key={index} variant="compact" className="p-3" magnetic>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{project.name}</h4>
                      <p className="text-white/60 text-xs">
                        {clients.find(c => c.id === project.clientId)?.name} • {formatDate(project.deadline)}
                      </p>
                    </div>
                    <StatusBadge status={project.status} type="project" size="small" />
                  </div>
                </BentoCard>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/10">
          <motion.button 
            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Редактировать профиль
          </motion.button>
          <motion.button 
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Назначить проект
          </motion.button>
          <motion.button 
            className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Отчет по эффективности
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

const ProjectModal = ({ project, isOpen, onClose }: {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!project) return null;

  const client = clients.find(c => c.id === project.clientId);
  const service = services.find(s => s.id === project.serviceId);
  const progress = project.milestones.reduce((sum, m) => sum + m.progress, 0) / project.milestones.length;
  const budgetUtilization = (project.spent / project.budget) * 100;
  const teamMembers = employees.filter(e => project.team.includes(e.id));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project.name} size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <StatusBadge status={project.status} type="project" />
            <StatusBadge status={project.priority} type="priority" />
            <span className="text-white/60 text-sm bg-white/5 px-2 sm:px-3 py-1 rounded-full">
              {client?.name}
            </span>
            <span className="text-white/60 text-sm bg-blue-500/10 px-2 sm:px-3 py-1 rounded-full">
              {service?.name}
            </span>
          </div>
          <div className="text-white/60 text-sm">
            ID: {project.id}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Основная информация</h3>
              <div className="space-y-2 text-xs sm:text-sm text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/60">Клиент:</span>
                  <span className="text-white font-medium">{client?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Услуга:</span>
                  <span className="text-white font-medium">{service?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Дата начала:</span>
                  <span className="text-white font-medium">{formatDate(project.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Дедлайн:</span>
                  <span className="text-white font-medium">{formatDate(project.deadline)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Финансы</h3>
              <div className="space-y-2 text-xs sm:text-sm text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/60">Бюджет:</span>
                  <span className="text-white font-medium">{formatCurrency(project.budget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Потрачено:</span>
                  <span className="text-white font-medium">{formatCurrency(project.spent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Остаток:</span>
                  <span className="text-white font-medium">{formatCurrency(project.budget - project.spent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Использование:</span>
                  <span className="text-white font-medium">{budgetUtilization.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Прогресс проекта</h4>
              <div className="space-y-3">
                <ProgressBar value={progress} label="Общий прогресс" color={COLORS.blue} size="small" />
                <ProgressBar value={budgetUtilization} label="Использование бюджета" color={COLORS.emerald} size="small" />
                <ProgressBar value={75} label="Качество" color={COLORS.orange} size="small" />
              </div>
            </BentoCard>

            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Команда проекта</h4>
              <div className="space-y-2">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-white/70">{member.name}</span>
                    <StatusBadge status={member.department} type="department" size="small" />
                  </div>
                ))}
              </div>
            </BentoCard>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{Math.round(progress)}%</div>
            <div className="text-white/60 text-xs">Прогресс</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{project.milestones.length}</div>
            <div className="text-white/60 text-xs">Вех</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{teamMembers.length}</div>
            <div className="text-white/60 text-xs">Участников</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">
              {Math.floor((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-white/60 text-xs">Дней до дедлайна</div>
          </BentoCard>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Вехи проекта</h3>
          <div className="space-y-2">
            {project.milestones.map((milestone, index) => (
              <BentoCard key={index} variant="compact" className="p-3" magnetic>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm">{milestone.name}</h4>
                    <p className="text-white/60 text-xs">до {formatDate(milestone.dueDate)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <ProgressBar value={milestone.progress} max={100} showValue={false} />
                    <StatusBadge status={milestone.status} />
                  </div>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>

        {project.risks.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Риски проекта</h3>
            <div className="space-y-2">
              {project.risks.map((risk, index) => (
                <BentoCard key={index} variant="compact" className="p-3" magnetic>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium text-sm">{risk.description}</h4>
                      <div className="flex gap-2">
                        <StatusBadge status={risk.probability} size="small" />
                        <StatusBadge status={risk.impact} size="small" />
                      </div>
                    </div>
                    <p className="text-white/60 text-xs">Меры: {risk.mitigation}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 text-xs">Статус:</span>
                      <StatusBadge status={risk.status} size="small" />
                    </div>
                  </div>
                </BentoCard>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/10">
          <motion.button 
            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Редактировать проект
          </motion.button>
          <motion.button 
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Управление задачами
          </motion.button>
          <motion.button 
            className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Создать отчет
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

// Основной компонент Dashboard
const ServicesOrganization = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'clients' | 'employees' | 'projects' | 'analytics'>('overview');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Имитация загрузки данных
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Статистика для дашборда
  const stats = useMemo(() => {
    const totalRevenue = clients.reduce((sum, client) => sum + client.revenue, 0);
    const activeClients = clients.filter(c => c.status === 'active').length;
    const activeEmployees = employees.filter(e => e.status === 'active').length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const totalServices = services.filter(s => s.status === 'active').length;

    return {
      totalRevenue,
      activeClients,
      activeEmployees,
      activeProjects,
      totalServices
    };
  }, []);

  // Фильтрация данных
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status === 'all' || service.status === filters.status;
      const matchesCategory = filters.category === 'all' || service.category === filters.category;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, filters]);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          client.industry.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status === 'all' || client.status === filters.status;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, filters]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          employee.position.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status === 'all' || employee.status === filters.status;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, filters]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status === 'all' || project.status === filters.status;
      const matchesPriority = filters.priority === 'all' || project.priority === filters.priority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchQuery, filters]);

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: '📊', color: COLORS.blue },
    { id: 'services' as const, label: 'Услуги', icon: '🛠️', color: COLORS.orange },
    { id: 'clients' as const, label: 'Клиенты', icon: '👥', color: COLORS.emerald },
    { id: 'employees' as const, label: 'Сотрудники', icon: '👨‍💼', color: COLORS.purple },
    { id: 'projects' as const, label: 'Проекты', icon: '📋', color: COLORS.rose },
    { id: 'analytics' as const, label: 'Аналитика', icon: '📈', color: COLORS.cyan }
  ];

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
  };

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Данные для графиков
  const revenueData = [65, 59, 80, 81, 56, 55, 40];
  const growthData = [45, 52, 68, 74, 65, 82, 90];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full mx-auto mb-4"
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity }
            }}
          />
          <motion.p
            className="text-white text-lg font-semibold"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Загрузка системы услуг...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary} relative`}>
      <FloatingParticles />
      
      <style jsx global>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3); }
          50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.6); }
        }
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
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
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .gradient-text {
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .glass-effect {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10">
        {/* Company Header */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring" }}
        >
          <BentoCard 
            className="p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8" 
            variant="featured" 
            hoverScale={1.005}
            magnetic
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <motion.div 
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg cursor-pointer animate-float animate-pulse-glow"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    💼
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <motion.h1 
                      className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 break-words gradient-text"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      IT-Сервис Провайдер
                    </motion.h1>
                    <motion.p 
                      className="text-white/60 text-xs sm:text-sm lg:text-base"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Комплексные IT-услуги для бизнеса любого масштаба
                    </motion.p>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">О компании</h3>
                    <p className="text-white/70 leading-relaxed text-xs sm:text-sm line-clamp-3">
                      Ведущий провайдер IT-услуг, специализирующийся на комплексных решениях для цифровой трансформации бизнеса. 
                      Предоставляем услуги консалтинга, разработки, поддержки и обучения с 2018 года.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 text-white/70">
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Год основания</p>
                      <p className="text-white font-medium text-sm">2018</p>
                    </div>
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Сертификаты</p>
                      <p className="text-white font-medium text-sm">ISO 9001, ISO 27001</p>
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Охват</p>
                      <p className="text-white font-medium text-sm">Россия и СНГ</p>
                    </div>
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Команда</p>
                      <p className="text-white font-medium text-sm">{employees.length}+ специалистов</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-80 space-y-3 sm:space-y-4">
                <BentoCard variant="compact" magnetic>
                  <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Контакты</h3>
                  <div className="space-y-1.5 text-xs sm:text-sm text-white/70">
                    <div className="flex justify-between items-start">
                      <span className="text-white/50">Телефон:</span>
                      <span className="text-white font-medium text-right">+7 (495) 123-45-67</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/50">Email:</span>
                      <span className="text-white font-medium text-right break-all">info@itservice.ru</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/50">Сайт:</span>
                      <span className="text-white font-medium text-right break-all">www.itservice.ru</span>
                    </div>
                  </div>
                </BentoCard>
                
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                  <motion.button 
                    className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Добавить услугу
                  </motion.button>
                  <motion.button 
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Редактировать
                  </motion.button>
                </div>
              </div>
            </div>
          </BentoCard>
        </motion.section>

        {/* Statistics с новыми метриками */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
            <MetricCard
              title="Общая выручка"
              value={<AnimatedCounter value={stats.totalRevenue} format="currency" />}
              change={18}
              chartData={revenueData}
              color={COLORS.emerald}
            />
            <MetricCard
              title="Активные клиенты"
              value={`${stats.activeClients}/${clients.length}`}
              change={12}
              chartData={growthData}
              color={COLORS.blue}
            />
            <MetricCard
              title="Сотрудников"
              value={stats.activeEmployees}
              change={5}
              chartData={[65, 59, 80, 81, 56, 55, 40]}
              color={COLORS.purple}
            />
            <MetricCard
              title="Активные проекты"
              value={stats.activeProjects}
              change={8}
              chartData={[85, 78, 92, 89, 76, 82, 88]}
              color={COLORS.orange}
            />
            <MetricCard
              title="Услуг в каталоге"
              value={stats.totalServices}
              change={3}
              chartData={[75, 82, 78, 85, 80, 88, 92]}
              color={COLORS.cyan}
            />
          </div>
        </motion.section>

        {/* Улучшенные Tabs */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex overflow-x-auto scrollbar-hide pb-1">
            <div className="flex gap-1 bg-white/5 rounded-xl sm:rounded-2xl p-1 border border-white/10 min-w-max">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute inset-0 rounded-lg sm:rounded-xl bg-white/10 border border-white/20"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 text-base">{tab.icon}</span>
                  <span className="relative z-10">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Search and Filter для соответствующих вкладок */}
        {(activeTab === 'services' || activeTab === 'clients' || activeTab === 'employees' || activeTab === 'projects') && (
          <SearchAndFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            placeholder={`Поиск ${activeTab === 'services' ? 'услуг' : activeTab === 'clients' ? 'клиентов' : activeTab === 'employees' ? 'сотрудников' : 'проектов'}...`}
            type={activeTab}
          />
        )}

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
                className="space-y-4 sm:space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { icon: '🛠️', title: 'Услуги', description: `${services.length} в каталоге`, color: COLORS.orange, action: () => setActiveTab('services') },
                    { icon: '👥', title: 'Клиенты', description: `${clients.length} компаний`, color: COLORS.emerald, action: () => setActiveTab('clients') },
                    { icon: '👨‍💼', title: 'Сотрудники', description: `${employees.length} специалистов`, color: COLORS.purple, action: () => setActiveTab('employees') },
                    { icon: '📋', title: 'Проекты', description: `${projects.length} активных`, color: COLORS.rose, action: () => setActiveTab('projects') },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <BentoCard 
                        className="p-4 cursor-pointer" 
                        glowColor={item.color}
                        onClick={item.action}
                        variant="compact"
                        delay={index * 0.1}
                        hoverScale={1.05}
                        magnetic
                      >
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className="text-2xl"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {item.icon}
                          </motion.div>
                          <div>
                            <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                            <p className="text-white/60 text-xs">{item.description}</p>
                          </div>
                        </div>
                      </BentoCard>
                    </motion.div>
                  ))}
                </div>

                {/* Services & Clients Preview */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-white">Популярные услуги</h2>
                      <motion.button 
                        className="text-orange-300 hover:text-orange-200 text-xs sm:text-sm transition-colors"
                        onClick={() => setActiveTab('services')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Все услуги →
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {services
                        .filter(service => service.status === 'active')
                        .sort((a, b) => b.currentLoad - a.currentLoad)
                        .slice(0, 4)
                        .map((service, index) => (
                        <ServiceCard 
                          key={service.id} 
                          service={service} 
                          onClick={() => handleServiceClick(service)}
                          delay={index * 0.1}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-white">Ключевые клиенты</h2>
                      <motion.button 
                        className="text-emerald-300 hover:text-emerald-200 text-xs sm:text-sm transition-colors"
                        onClick={() => setActiveTab('clients')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Все клиенты →
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {clients
                        .filter(client => client.status === 'active')
                        .sort((a, b) => b.revenue - a.revenue)
                        .slice(0, 4)
                        .map((client, index) => (
                        <ClientCard 
                          key={client.id} 
                          client={client} 
                          onClick={() => handleClientClick(client)}
                          delay={index * 0.1}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Employees & Projects Preview */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-white">Топ сотрудники</h2>
                      <motion.button 
                        className="text-purple-300 hover:text-purple-200 text-xs sm:text-sm transition-colors"
                        onClick={() => setActiveTab('employees')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Вся команда →
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {employees
                        .filter(emp => emp.status === 'active')
                        .sort((a, b) => b.rating - a.rating)
                        .slice(0, 4)
                        .map((employee, index) => (
                        <EmployeeCard 
                          key={employee.id} 
                          employee={employee} 
                          onClick={() => handleEmployeeClick(employee)}
                          delay={index * 0.1}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-white">Активные проекты</h2>
                      <motion.button 
                        className="text-rose-300 hover:text-rose-200 text-xs sm:text-sm transition-colors"
                        onClick={() => setActiveTab('projects')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Все проекты →
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      {projects
                        .filter(project => project.status === 'active')
                        .slice(0, 2)
                        .map((project, index) => (
                        <ProjectCard 
                          key={project.id} 
                          project={project} 
                          onClick={() => handleProjectClick(project)}
                          delay={index * 0.1}
                        />
                      ))}
                    </div>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Каталог услуг</h2>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">
                      {filteredServices.length} услуг, {services.filter(s => s.status === 'active').length} активных
                    </p>
                  </div>
                  <motion.button 
                    className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-xs sm:text-sm whitespace-nowrap w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + Новая услуга
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredServices.map((service, index) => (
                    <ServiceCard 
                      key={service.id} 
                      service={service} 
                      onClick={() => handleServiceClick(service)}
                      delay={index * 0.05}
                    />
                  ))}
                </div>
                {filteredServices.length === 0 && (
                  <BentoCard className="text-center py-8">
                    <div className="text-4xl mb-4">🛠️</div>
                    <h3 className="text-white font-semibold text-lg mb-2">Услуги не найдены</h3>
                    <p className="text-white/60">Попробуйте изменить параметры поиска или фильтры</p>
                  </BentoCard>
                )}
              </motion.div>
            )}

            {activeTab === 'clients' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Клиентская база</h2>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">
                      {filteredClients.length} клиентов, {clients.filter(c => c.status === 'active').length} активных
                    </p>
                  </div>
                  <motion.button 
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-xs sm:text-sm whitespace-nowrap w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + Новый клиент
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredClients.map((client, index) => (
                    <ClientCard 
                      key={client.id} 
                      client={client} 
                      onClick={() => handleClientClick(client)}
                      delay={index * 0.05}
                    />
                  ))}
                </div>
                {filteredClients.length === 0 && (
                  <BentoCard className="text-center py-8">
                    <div className="text-4xl mb-4">👥</div>
                    <h3 className="text-white font-semibold text-lg mb-2">Клиенты не найдены</h3>
                    <p className="text-white/60">Попробуйте изменить параметры поиска или фильтры</p>
                  </BentoCard>
                )}
              </motion.div>
            )}

            {activeTab === 'employees' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Команда</h2>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">
                      {filteredEmployees.length} сотрудников, {employees.filter(e => e.status === 'active').length} активных
                    </p>
                  </div>
                  <motion.button 
                    className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-xs sm:text-sm whitespace-nowrap w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + Новый сотрудник
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredEmployees.map((employee, index) => (
                    <EmployeeCard 
                      key={employee.id} 
                      employee={employee} 
                      onClick={() => handleEmployeeClick(employee)}
                      delay={index * 0.05}
                    />
                  ))}
                </div>
                {filteredEmployees.length === 0 && (
                  <BentoCard className="text-center py-8">
                    <div className="text-4xl mb-4">👨‍💼</div>
                    <h3 className="text-white font-semibold text-lg mb-2">Сотрудники не найдены</h3>
                    <p className="text-white/60">Попробуйте изменить параметры поиска или фильтры</p>
                  </BentoCard>
                )}
              </motion.div>
            )}

            {activeTab === 'projects' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Проекты</h2>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">
                      {filteredProjects.length} проектов, {projects.filter(p => p.status === 'active').length} активных
                    </p>
                  </div>
                  <motion.button 
                    className="bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-xs sm:text-sm whitespace-nowrap w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + Новый проект
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {filteredProjects.map((project, index) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onClick={() => handleProjectClick(project)}
                      delay={index * 0.05}
                    />
                  ))}
                </div>
                {filteredProjects.length === 0 && (
                  <BentoCard className="text-center py-8">
                    <div className="text-4xl mb-4">📋</div>
                    <h3 className="text-white font-semibold text-lg mb-2">Проекты не найдены</h3>
                    <p className="text-white/60">Попробуйте изменить параметры поиска или фильтры</p>
                  </BentoCard>
                )}
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
                  <BentoCard className="p-6" glowColor={COLORS.blue} magnetic>
                    <h3 className="text-white font-semibold mb-4">Эффективность бизнеса</h3>
                    <div className="text-3xl font-bold text-white mb-2">
                      <AnimatedCounter value={87.5} format="percentage" />%
                    </div>
                    <ProgressBar value={87.5} color={COLORS.blue} />
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-white/60">
                      <div>
                        <p>Удержание клиентов</p>
                        <p className="text-white font-medium">92.3%</p>
                      </div>
                      <div>
                        <p>Рост выручки</p>
                        <p className="text-white font-medium">+18.2%</p>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.emerald} magnetic>
                    <h3 className="text-white font-semibold mb-4">Финансовые показатели</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Месячная выручка</span>
                        <span className="text-white font-medium">{formatCurrency(2850000)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Операционные расходы</span>
                        <span className="text-white font-medium">{formatCurrency(1850000)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Чистая прибыль</span>
                        <span className="text-emerald-300 font-medium">{formatCurrency(675000)}</span>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.orange} magnetic>
                    <h3 className="text-white font-semibold mb-4">Распределение услуг</h3>
                    <div className="space-y-3">
                      {[
                        { service: 'IT-консалтинг', percentage: 35, revenue: formatCurrency(3325000) },
                        { service: 'Техподдержка', percentage: 28, revenue: formatCurrency(2660000) },
                        { service: 'Разработка ПО', percentage: 22, revenue: formatCurrency(2090000) },
                        { service: 'Обучение', percentage: 12, revenue: formatCurrency(1140000) },
                        { service: 'Аналитика', percentage: 3, revenue: formatCurrency(285000) }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-white text-sm">{item.service}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white/60 text-sm">{item.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </BentoCard>
                </div>

                {/* Business Analytics */}
                <BentoCard className="p-6" magnetic>
                  <h3 className="text-white font-semibold mb-4">Бизнес-аналитика</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Клиентские метрики</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">LTV (пожизненная ценность)</span>
                          <span className="text-white font-medium">{formatCurrency(1250000)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">CAC (стоимость привлечения)</span>
                          <span className="text-white font-medium">{formatCurrency(185000)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">NPS (индекс лояльности)</span>
                          <span className="text-white font-medium">+64</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">Churn Rate (отток)</span>
                          <span className="text-white font-medium">4.2%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Операционные метрики</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">Среднее время проекта</span>
                          <span className="text-white font-medium">4.8 мес</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">Удовлетворенность клиентов</span>
                          <span className="text-white font-medium">94.2%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">Эффективность команды</span>
                          <span className="text-white font-medium">87.5%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">Рентабельность</span>
                          <span className="text-white font-medium">23.7%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </BentoCard>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>

      {/* Модальные окна */}
      <ServiceModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
      />
      
      <ClientModal
        client={selectedClient}
        isOpen={!!selectedClient}
        onClose={() => setSelectedClient(null)}
      />

      <EmployeeModal
        employee={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default ServicesOrganization;