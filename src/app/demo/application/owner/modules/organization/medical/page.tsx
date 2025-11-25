'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Типы данных
interface Clinic {
  id: string;
  name: string;
  type: 'state' | 'private' | 'corporate';
  status: 'active' | 'accreditation' | 'reconstruction';
  level: 'first' | 'second' | 'third';
  registrationNumber: string;
  licenseNumber: string;
  foundationDate: string;
  chiefPhysician: string;
  medicalDirector: string;
  address: {
    legal: string;
    actual: string;
    coordinates?: { lat: number; lng: number };
  };
  contacts: {
    phone: string;
    emergency: string;
    email: string;
    website: string;
    social?: { platform: string; url: string }[];
  };
  licenses: {
    number: string;
    type: string;
    issueDate: string;
    expirationDate: string;
    status: 'active' | 'expired' | 'suspended';
    issuer: string;
    scope: string[];
  }[];
  statistics: {
    doctors: number;
    nursingStaff: number;
    administrativeStaff: number;
    patients: number;
    beds: number;
    departments: number;
    surgeries: number;
    successRate: number;
    avgStay: number;
  };
  financial: {
    budget: number;
    funding: number;
    expenses: number;
    insurance: number;
    equipment: number;
    medications: number;
    quarterly: { quarter: string; income: number; expenses: number }[];
  };
  equipment: {
    total: number;
    operational: number;
    underMaintenance: number;
    critical: number;
    lastAudit: string;
  };
  accreditation: {
    standards: string[];
    lastInspection: string;
    nextInspection: string;
    compliance: number;
  };
}

interface Department {
  id: string;
  name: string;
  head: string;
  doctors: number;
  nurses: number;
  beds: number;
  occupancy: number;
  specialization: string;
  status: 'active' | 'overcrowded' | 'renovation' | 'quarantine';
  contactEmail: string;
  phone: string;
  location: string;
  established: string;
  performance: {
    efficiency: number;
    satisfaction: number;
    readmission: number;
  };
  equipment: {
    total: number;
    operational: number;
  };
  services: string[];
}

interface MedicalService {
  id: string;
  name: string;
  category: 'consultation' | 'diagnostics' | 'treatment' | 'surgery' | 'rehabilitation';
  status: 'active' | 'development' | 'suspended';
  patients: number;
  successRate: number;
  price: number;
  insuranceCovered: boolean;
  department: string;
  duration: string;
  requirements: string[];
  description: string;
  detailedDescription: string;
  features: string[];
  process: string[];
  statistics: {
    monthlyGrowth: number;
    completionRate: number;
    satisfaction: number;
    complications: number;
  };
  reviews: { patient: string; rating: number; comment: string; date: string }[];
}

// Моки данных для клиники
const clinicData: Clinic = {
  id: 'clinic-001',
  name: 'Городская клиническая больница №1',
  type: 'state',
  status: 'active',
  level: 'third',
  registrationNumber: '1187746005678',
  licenseNumber: 'ЛО-77-01-012345',
  foundationDate: '1985-08-12',
  chiefPhysician: 'Петров Александр Иванович',
  medicalDirector: 'Сидорова Елена Владимировна',
  address: {
    legal: 'г. Москва, Ленинский проспект, д. 123',
    actual: 'г. Москва, Ленинский проспект, д. 123',
    coordinates: { lat: 55.6847, lng: 37.5479 }
  },
  contacts: {
    phone: '+7 (495) 234-56-78',
    emergency: '+7 (495) 234-56-79',
    email: 'info@gkb1.ru',
    website: 'www.gkb1.ru',
    social: [
      { platform: 'VK', url: 'https://vk.com/gkb1_moscow' },
      { platform: 'Telegram', url: 'https://t.me/gkb1_news' },
      { platform: 'Instagram', url: 'https://instagram.com/gkb1_official' }
    ]
  },
  licenses: [
    {
      number: 'ЛО-77-01-012345',
      type: 'Медицинская деятельность',
      issueDate: '2023-03-20',
      expirationDate: '2028-03-19',
      status: 'active',
      issuer: 'Министерство здравоохранения Российской Федерации',
      scope: ['Стационарное лечение', 'Амбулаторный прием', 'Хирургические операции', 'Диагностические услуги']
    },
    {
      number: 'ФС-77-01-012346',
      type: 'Обращение с медицинскими отходами',
      issueDate: '2023-04-15',
      expirationDate: '2026-04-14',
      status: 'active',
      issuer: 'Федеральная служба по надзору в сфере здравоохранения',
      scope: ['Сбор медицинских отходов', 'Транспортировка', 'Обеззараживание', 'Утилизация']
    },
    {
      number: 'РО-77-01-012347',
      type: 'Радиологическая деятельность',
      issueDate: '2022-11-10',
      expirationDate: '2025-11-09',
      status: 'active',
      issuer: 'Федеральная служба по надзору в сфере здравоохранения',
      scope: ['Рентгенография', 'КТ исследования', 'Маммография', 'Флюорография']
    },
    {
      number: 'ЛО-77-01-012348',
      type: 'Лабораторная диагностика',
      issueDate: '2023-01-15',
      expirationDate: '2026-01-14',
      status: 'active',
      issuer: 'Министерство здравоохранения Российской Федерации',
      scope: ['Клинические анализы', 'Биохимические исследования', 'Гормональные исследования', 'Иммунологические тесты']
    }
  ],
  statistics: {
    doctors: 156,
    nursingStaff: 289,
    administrativeStaff: 67,
    patients: 45280,
    beds: 420,
    departments: 28,
    surgeries: 8920,
    successRate: 94.2,
    avgStay: 6.3
  },
  financial: {
    budget: 125000000,
    funding: 112000000,
    expenses: 108000000,
    insurance: 89400000,
    equipment: 15600000,
    medications: 23400000,
    quarterly: [
      { quarter: 'Q1 2024', income: 28500000, expenses: 26200000 },
      { quarter: 'Q2 2024', income: 29400000, expenses: 27000000 },
      { quarter: 'Q3 2024', income: 27800000, expenses: 26500000 },
      { quarter: 'Q4 2024', income: 26300000, expenses: 28300000 }
    ]
  },
  equipment: {
    total: 890,
    operational: 842,
    underMaintenance: 48,
    critical: 23,
    lastAudit: '2024-05-20'
  },
  accreditation: {
    standards: ['JCI', 'ISO 9001:2015', 'Минздрав РФ', 'EMT'],
    lastInspection: '2024-03-15',
    nextInspection: '2025-03-14',
    compliance: 96.8
  }
};

const departments: Department[] = [
  {
    id: 'dept-1',
    name: 'Кардиологическое отделение',
    head: 'Проф. Иванов Сергей Петрович',
    doctors: 18,
    nurses: 24,
    beds: 45,
    occupancy: 92,
    specialization: 'Кардиология',
    status: 'overcrowded',
    contactEmail: 'cardiology@gkb1.ru',
    phone: '+7 (495) 234-56-80',
    location: 'Корпус А, 3 этаж',
    established: '1990-05-15',
    performance: {
      efficiency: 88,
      satisfaction: 91,
      readmission: 8.2
    },
    equipment: {
      total: 45,
      operational: 42
    },
    services: ['Эхокардиография', 'Коронарография', 'Стентирование', 'Реабилитация']
  },
  {
    id: 'dept-2',
    name: 'Хирургическое отделение',
    head: 'Доц. Козлов Михаил Анатольевич',
    doctors: 22,
    nurses: 30,
    beds: 60,
    occupancy: 78,
    specialization: 'Хирургия',
    status: 'active',
    contactEmail: 'surgery@gkb1.ru',
    phone: '+7 (495) 234-56-81',
    location: 'Корпус Б, 2 этаж',
    established: '1988-09-20',
    performance: {
      efficiency: 92,
      satisfaction: 89,
      readmission: 6.8
    },
    equipment: {
      total: 38,
      operational: 35
    },
    services: ['Эндоскопия', 'Лапароскопия', 'Травматология', 'Нейрохирургия']
  },
  {
    id: 'dept-3',
    name: 'Неврологическое отделение',
    head: 'Проф. Николаева Анна Викторовна',
    doctors: 15,
    nurses: 20,
    beds: 40,
    occupancy: 85,
    specialization: 'Неврология',
    status: 'active',
    contactEmail: 'neurology@gkb1.ru',
    phone: '+7 (495) 234-56-82',
    location: 'Корпус А, 4 этаж',
    established: '1992-03-10',
    performance: {
      efficiency: 85,
      satisfaction: 93,
      readmission: 7.5
    },
    equipment: {
      total: 28,
      operational: 26
    },
    services: ['ЭЭГ', 'МРТ', 'Нейрореабилитация', 'Ботулинотерапия']
  },
  {
    id: 'dept-4',
    name: 'Педиатрическое отделение',
    head: 'Доц. Громова Ольга Сергеевна',
    doctors: 12,
    nurses: 18,
    beds: 35,
    occupancy: 65,
    specialization: 'Педиатрия',
    status: 'active',
    contactEmail: 'pediatrics@gkb1.ru',
    phone: '+7 (495) 234-56-83',
    location: 'Корпус В, 1 этаж',
    established: '1995-07-22',
    performance: {
      efficiency: 90,
      satisfaction: 95,
      readmission: 5.2
    },
    equipment: {
      total: 22,
      operational: 21
    },
    services: ['Вакцинация', 'Неонатология', 'Аллергология', 'Гастроэнтерология']
  },
  {
    id: 'dept-5',
    name: 'Отделение интенсивной терапии',
    head: 'Проф. Федоров Дмитрий Игоревич',
    doctors: 8,
    nurses: 16,
    beds: 20,
    occupancy: 95,
    specialization: 'Реаниматология',
    status: 'overcrowded',
    contactEmail: 'icu@gkb1.ru',
    phone: '+7 (495) 234-56-84',
    location: 'Корпус Б, 1 этаж',
    established: '1986-11-30',
    performance: {
      efficiency: 94,
      satisfaction: 87,
      readmission: 12.3
    },
    equipment: {
      total: 35,
      operational: 33
    },
    services: ['ИВЛ', 'Гемодиализ', 'Кардиомониторинг', 'Инфузионная терапия']
  },
  {
    id: 'dept-6',
    name: 'Травматологическое отделение',
    head: 'Доц. Васильев Алексей Николаевич',
    doctors: 14,
    nurses: 22,
    beds: 50,
    occupancy: 88,
    specialization: 'Травматология',
    status: 'active',
    contactEmail: 'trauma@gkb1.ru',
    phone: '+7 (495) 234-56-85',
    location: 'Корпус Г, 2 этаж',
    established: '1991-02-14',
    performance: {
      efficiency: 89,
      satisfaction: 90,
      readmission: 9.1
    },
    equipment: {
      total: 32,
      operational: 30
    },
    services: ['Остеосинтез', 'Артроскопия', 'Эндопротезирование', 'Реабилитация']
  },
  {
    id: 'dept-7',
    name: 'Онкологическое отделение',
    head: 'Проф. Семенова Ирина Дмитриевна',
    doctors: 10,
    nurses: 16,
    beds: 30,
    occupancy: 90,
    specialization: 'Онкология',
    status: 'active',
    contactEmail: 'oncology@gkb1.ru',
    phone: '+7 (495) 234-56-86',
    location: 'Корпус В, 3 этаж',
    established: '1998-04-18',
    performance: {
      efficiency: 87,
      satisfaction: 88,
      readmission: 11.5
    },
    equipment: {
      total: 25,
      operational: 23
    },
    services: ['Химиотерапия', 'Лучевая терапия', 'Иммунотерапия', 'Паллиативная помощь']
  },
  {
    id: 'dept-8',
    name: 'Отделение медицинской диагностики',
    head: 'Доц. Павлов Виктор Сергеевич',
    doctors: 25,
    nurses: 35,
    beds: 0,
    occupancy: 0,
    specialization: 'Диагностика',
    status: 'renovation',
    contactEmail: 'diagnostics@gkb1.ru',
    phone: '+7 (495) 234-56-87',
    location: 'Корпус Д, 1 этаж',
    established: '2002-08-05',
    performance: {
      efficiency: 91,
      satisfaction: 92,
      readmission: 0
    },
    equipment: {
      total: 48,
      operational: 45
    },
    services: ['КТ', 'МРТ', 'УЗИ', 'Рентгенография', 'Эндоскопия']
  }
];

const medicalServices: MedicalService[] = [
  {
    id: 'srv-1',
    name: 'Консультация терапевта',
    category: 'consultation',
    status: 'active',
    patients: 12560,
    successRate: 98,
    price: 1500,
    insuranceCovered: true,
    department: 'dept-1',
    duration: '30-45 минут',
    requirements: ['Паспорт', 'Медицинский полис', 'Направление (при наличии)'],
    description: 'Первичный осмотр и консультация врача-терапевта.',
    detailedDescription: 'Комплексный осмотр пациента с оценкой общего состояния здоровья, сбором анамнеза, постановкой предварительного диагноза и назначением необходимых обследований. Врач проводит аускультацию, перкуссию, измерение артериального давления и пульса.',
    features: [
      'Измерение артериального давления',
      'Аускультация сердца и легких',
      'Пальпация органов брюшной полости',
      'Назначение обследований',
      'Выписка рецептов'
    ],
    process: [
      'Регистрация и заполнение анкеты',
      'Измерение основных показателей',
      'Осмотр врача-терапевта',
      'Постановка диагноза',
      'Назначение лечения и обследований',
      'Выдача медицинских документов'
    ],
    statistics: {
      monthlyGrowth: 5.8,
      completionRate: 99.2,
      satisfaction: 4.8,
      complications: 0.3
    },
    reviews: [
      {
        patient: 'Мария Ивановна, 45 лет',
        rating: 5,
        comment: 'Очень внимательный врач, все подробно объяснил, назначил адекватное лечение.',
        date: '2024-05-15'
      },
      {
        patient: 'Сергей Петрович',
        rating: 4,
        comment: 'Хороший прием, но пришлось немного подождать своей очереди.',
        date: '2024-05-12'
      }
    ]
  },
  {
    id: 'srv-2',
    name: 'Эхокардиография',
    category: 'diagnostics',
    status: 'active',
    patients: 4560,
    successRate: 96,
    price: 3500,
    insuranceCovered: true,
    department: 'dept-1',
    duration: '45-60 минут',
    requirements: ['Направление кардиолога', 'Результаты ЭКГ', 'Паспорт', 'Полис'],
    description: 'Ультразвуковое исследование сердца и сосудов.',
    detailedDescription: 'Современное ультразвуковое исследование, позволяющее оценить структурные и функциональные особенности сердца. Включает оценку размеров камер сердца, толщины стенок, состояния клапанов, сократительной способности миокарда и кровотока.',
    features: [
      'Допплеровское исследование',
      'Цветное картирование потоков',
      'Оценка фракции выброса',
      'Измерение давления в камерах',
      '3D реконструкция при необходимости'
    ],
    process: [
      'Подготовка пациента (раздеться до пояса)',
      'Нанесение геля на область исследования',
      'Проведение ультразвукового сканирования',
      'Запись и анализ данных',
      'Консультация по результатам',
      'Выдача заключения'
    ],
    statistics: {
      monthlyGrowth: 8.3,
      completionRate: 97.8,
      satisfaction: 4.7,
      complications: 0.1
    },
    reviews: [
      {
        patient: 'Анна Сергеевна',
        rating: 5,
        comment: 'Очень информативное исследование, врач все подробно объяснил и показал.',
        date: '2024-05-14'
      }
    ]
  },
  {
    id: 'srv-3',
    name: 'Коронарное стентирование',
    category: 'surgery',
    status: 'active',
    patients: 890,
    successRate: 94,
    price: 125000,
    insuranceCovered: true,
    department: 'dept-1',
    duration: '1-2 часа',
    requirements: ['Заключение кардиолога', 'Результаты коронарографии', 'Анализы крови', 'ЭКГ'],
    description: 'Малоинвазивная операция по установке стента в коронарные артерии.',
    detailedDescription: 'Эндоваскулярная процедура, направленная на восстановление кровотока в суженных или заблокированных коронарных артериях. Проводится под местной анестезией через пункцию бедренной или лучевой артерии. Используются современные стенты с лекарственным покрытием.',
    features: [
      'Малоинвазивный доступ',
      'Рентгеновский контроль',
      'Стенты с лекарственным покрытием',
      'Мониторинг жизненных показателей',
      'Быстрая реабилитация'
    ],
    process: [
      'Предоперационная подготовка',
      'Местная анестезия',
      'Пункция артерии',
      'Введение катетера',
      'Ангиография',
      'Установка стента',
      'Контрольная ангиография',
      'Наложение повязки'
    ],
    statistics: {
      monthlyGrowth: 12.5,
      completionRate: 95.2,
      satisfaction: 4.6,
      complications: 3.2
    },
    reviews: [
      {
        patient: 'Николай Иванович, 68 лет',
        rating: 5,
        comment: 'Отличная операция, сразу почувствовал улучшение. Врачи - профессионалы!',
        date: '2024-05-10'
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
  amber: '251, 191, 36',
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
        className="absolute rounded-full bg-gradient-to-r from-rose-500/10 to-pink-500/10"
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
  type?: 'default' | 'department' | 'service' | 'level' | 'clinic' | 'license';
  size?: 'default' | 'small' | 'large';
  pulse?: boolean;
}) => {
  const getStatusConfig = () => {
    const configs = {
      active: { color: COLORS.success, label: 'Активен', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '🟢' },
      accreditation: { color: COLORS.warning, label: 'Аккредитация', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '📋' },
      reconstruction: { color: COLORS.orange, label: 'Реконструкция', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '🏗️' },
      overcrowded: { color: COLORS.rose, label: 'Перегружено', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: '⚠️' },
      renovation: { color: COLORS.orange, label: 'Ремонт', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '🔧' },
      quarantine: { color: COLORS.amber, label: 'Карантин', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: '🚨' },
      development: { color: COLORS.blue, label: 'В разработке', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '🛠️' },
      suspended: { color: COLORS.error, label: 'Приостановлено', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '⏸️' },
      expired: { color: COLORS.error, label: 'Просрочена', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '❌' },
      state: { color: COLORS.blue, label: 'Государственная', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '🏛️' },
      private: { color: COLORS.purple, label: 'Частная', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: '💼' },
      corporate: { color: COLORS.teal, label: 'Корпоративная', bg: 'bg-teal-500/10', border: 'border-teal-500/20', icon: '🏢' },
      first: { color: COLORS.success, label: 'I уровень', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '🥇' },
      second: { color: COLORS.warning, label: 'II уровень', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '🥈' },
      third: { color: COLORS.rose, label: 'III уровень', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: '🥉' },
      consultation: { color: COLORS.blue, label: 'Консультация', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '🩺' },
      diagnostics: { color: COLORS.cyan, label: 'Диагностика', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: '🔍' },
      treatment: { color: COLORS.emerald, label: 'Лечение', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: '💊' },
      surgery: { color: COLORS.rose, label: 'Хирургия', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: '🔪' },
      rehabilitation: { color: COLORS.purple, label: 'Реабилитация', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: '♿' }
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
const SearchAndFilter = ({ onSearch, onFilter, placeholder = "Поиск...", type = 'departments' }: {
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
  placeholder?: string;
  type?: 'departments' | 'services' | 'equipment';
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    specialization: 'all'
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
            <option value="overcrowded">Перегруженные</option>
            <option value="renovation">На ремонте</option>
          </select>
          
          {type === 'services' && (
            <select 
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-white/20 transition-all duration-200 flex-1 min-w-[120px]"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">Все категории</option>
              <option value="consultation">Консультации</option>
              <option value="diagnostics">Диагностика</option>
              <option value="treatment">Лечение</option>
              <option value="surgery">Хирургия</option>
            </select>
          )}

          {type === 'departments' && (
            <select 
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-white/20 transition-all duration-200 flex-1 min-w-[120px]"
              value={filters.specialization}
              onChange={(e) => handleFilterChange('specialization', e.target.value)}
            >
              <option value="all">Все специализации</option>
              <option value="Кардиология">Кардиология</option>
              <option value="Хирургия">Хирургия</option>
              <option value="Неврология">Неврология</option>
              <option value="Педиатрия">Педиатрия</option>
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
                <label className="text-white/60 text-sm mb-2 block">Загрузка отделения</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любая</option>
                  <option>Низкая (&lt;60%)</option>
                  <option>Средняя (60-85%)</option>
                  <option>Высокая (&gt;85%)</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Количество коек</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любое</option>
                  <option>Малые (&lt;20)</option>
                  <option>Средние (20-40)</option>
                  <option>Крупные (&gt;40)</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Эффективность</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любая</option>
                  <option>Высокая (&gt;90%)</option>
                  <option>Средняя (75-90%)</option>
                  <option>Низкая (&lt;75%)</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Персонал</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любой</option>
                  <option>Малый (&lt;15)</option>
                  <option>Средний (15-30)</option>
                  <option>Крупный (&gt;30)</option>
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
    { id: 1, type: 'warning', message: 'Кардиологическое отделение перегружено', time: '15 мин назад' },
    { id: 2, type: 'info', message: 'Завершена плановая проверка оборудования', time: '2 часа назад' },
    { id: 3, type: 'success', message: 'Новая лицензия успешно активирована', time: '5 часов назад' }
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

// Улучшенный LicenseCard
const LicenseCard = ({ license, index }: { license: Clinic['licenses'][0]; index: number }) => {
  const isExpiring = new Date(license.expirationDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  const isExpired = new Date(license.expirationDate) < new Date();
  
  return (
    <BentoCard 
      className="p-3 sm:p-4" 
      glowColor={
        isExpired ? COLORS.error : 
        isExpiring ? COLORS.warning : 
        COLORS.success
      } 
      variant="compact"
      delay={index * 0.1}
      hoverScale={1.02}
      magnetic
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="flex-1 min-w-0">
          <motion.h4 
            className="text-white font-semibold text-sm mb-1 truncate"
            whileHover={{ scale: 1.02 }}
          >
            {license.number}
          </motion.h4>
          <p className="text-white/60 text-xs truncate">{license.type}</p>
        </div>
        <StatusBadge 
          status={license.status} 
          type="license"
          size="small" 
          pulse={isExpiring && !isExpired}
        />
      </div>
      <div className="space-y-1.5 text-xs text-white/60">
        <div className="flex justify-between">
          <span>Выдана:</span>
          <span className="text-white/80">{formatDate(license.issueDate)}</span>
        </div>
        <div className="flex justify-between">
          <span>Действует до:</span>
          <motion.span 
            className={`${
              isExpired ? 'text-red-300' : 
              isExpiring ? 'text-yellow-300' : 'text-white/80'
            } font-medium`}
            animate={isExpiring ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: isExpiring ? Infinity : 0 }}
          >
            {formatDate(license.expirationDate)}
          </motion.span>
        </div>
        <div className="flex justify-between">
          <span>Выдающий орган:</span>
          <span className="text-white/80 text-right text-xs">{license.issuer}</span>
        </div>
      </div>
      {(isExpiring || isExpired) && (
        <motion.div 
          className="mt-2 p-1.5 rounded-lg border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: isExpired 
              ? `rgba(${COLORS.error}, 0.1)` 
              : `rgba(${COLORS.warning}, 0.1)`,
            borderColor: isExpired 
              ? `rgba(${COLORS.error}, 0.3)` 
              : `rgba(${COLORS.warning}, 0.3)`
          }}
        >
          <p className={`text-xs text-center font-medium ${
            isExpired ? 'text-red-300' : 'text-yellow-300'
          }`}>
            {isExpired ? 'Просрочена' : 'Требуется продление'}
          </p>
        </motion.div>
      )}
    </BentoCard>
  );
};

// Адаптивные карточки с улучшенным дизайном
const DepartmentCard = ({ department, onClick, delay = 0 }: { department: Department; onClick: () => void; delay?: number }) => {
  const getDepartmentColor = (status: string) => {
    switch (status) {
      case 'overcrowded': return COLORS.rose;
      case 'renovation': return COLORS.orange;
      case 'quarantine': return COLORS.amber;
      default: return COLORS.blue;
    }
  };

  const isCritical = department.occupancy > 90;

  return (
    <BentoCard 
      className="p-3 sm:p-4" 
      glowColor={getDepartmentColor(department.status)}
      onClick={onClick}
      variant="compact"
      delay={delay}
      hoverScale={1.03}
      magnetic
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-2">
          <h4 className="text-white font-semibold text-sm line-clamp-2">{department.name}</h4>
          <p className="text-white/60 text-xs">{department.specialization}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={department.status} type="department" size="small" />
          <StatusBadge status={department.performance.efficiency > 90 ? 'active' : 'development'} size="small" pulse={isCritical} />
        </div>
      </div>
      
      <div className="space-y-1.5 text-xs text-white/60 mb-3">
        <div className="flex justify-between">
          <span>Заведующий:</span>
          <span className="text-white/80 truncate ml-2 max-w-[100px] sm:max-w-[120px]">{department.head}</span>
        </div>
        <div className="flex justify-between">
          <span>Врачи/Медсестры:</span>
          <span className="text-white/80">{department.doctors}/{department.nurses}</span>
        </div>
        <div className="flex justify-between">
          <span>Койки:</span>
          <span className="text-white/80">{department.beds} ед.</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Эффективность:</span>
          <div className="flex items-center gap-2">
            <ProgressBar 
              value={department.performance.efficiency} 
              max={100}
              color={getDepartmentColor(department.status)}
              size="small"
            />
            <span className="text-white/80 text-xs w-8">{department.performance.efficiency}%</span>
          </div>
        </div>
      </div>
      
      <ProgressBar 
        value={department.occupancy} 
        label="Загрузка отделения"
        color={department.occupancy > 90 ? COLORS.rose : department.occupancy > 75 ? COLORS.orange : COLORS.success}
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
          Отчет
        </motion.button>
      </div>

      {isCritical && (
        <div className="mt-3 p-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg">
          <p className="text-rose-300 text-xs text-center">Высокая загрузка</p>
        </div>
      )}
    </BentoCard>
  );
};

const ServiceCard = ({ service, onClick, delay = 0 }: { service: MedicalService; onClick: () => void; delay?: number }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'consultation': return '🩺';
      case 'diagnostics': return '🔍';
      case 'treatment': return '💊';
      case 'surgery': return '🔪';
      case 'rehabilitation': return '♿';
      default: return '🏥';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'consultation': return COLORS.blue;
      case 'diagnostics': return COLORS.cyan;
      case 'treatment': return COLORS.emerald;
      case 'surgery': return COLORS.rose;
      case 'rehabilitation': return COLORS.purple;
      default: return COLORS.gray;
    }
  };

  const department = departments.find(dept => dept.id === service.department);
  const isPopular = service.patients > 1000;

  return (
    <BentoCard 
      className="p-3 sm:p-4" 
      glowColor={getCategoryColor(service.category)}
      onClick={onClick}
      variant="compact"
      delay={delay}
      hoverScale={1.03}
      magnetic
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
          <span className="text-lg">{getCategoryIcon(service.category)}</span>
          <div className="min-w-0">
            <h4 className="text-white font-semibold text-sm truncate">{service.name}</h4>
            <p className="text-white/60 text-xs">{service.duration}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={service.category} type="service" size="small" />
          <StatusBadge status={service.status} size="small" pulse={isPopular} />
        </div>
      </div>
      
      <div className="space-y-1.5 text-xs text-white/60 mb-3">
        <div className="flex justify-between">
          <span>Отдел:</span>
          <span className="text-white/80 text-right">{department?.name}</span>
        </div>
        <div className="flex justify-between">
          <span>Пациентов:</span>
          <span className="text-white/80">{formatNumber(service.patients)} чел.</span>
        </div>
        
        {service.successRate > 0 && (
          <div className="flex justify-between items-center">
            <span>Эффективность:</span>
            <div className="flex items-center gap-2">
              <ProgressBar 
                value={service.successRate} 
                max={100}
                color={getCategoryColor(service.category)}
                size="small"
              />
              <span className="text-white/80 text-xs w-8">{service.successRate}%</span>
            </div>
          </div>
        )}
        
        <div className="flex justify-between">
          <span>Стоимость:</span>
          <span className="text-white/80">
            {service.price > 0 ? formatCurrency(service.price) : 'Бесплатно'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Страховка:</span>
          <span className={service.insuranceCovered ? 'text-green-300' : 'text-red-300'}>
            {service.insuranceCovered ? 'Покрывается' : 'Не покрывается'}
          </span>
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
          Статистика
        </motion.button>
        <motion.button 
          className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs py-1.5 px-2 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Назначить
        </motion.button>
      </div>

      {isPopular && (
        <div className="mt-3 p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-amber-300 text-xs text-center">Популярная услуга</p>
        </div>
      )}
    </BentoCard>
  );
};

// Модальные окна
const DepartmentModal = ({ department, isOpen, onClose }: {
  department: Department | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!department) return null;

  const departmentServices = medicalServices.filter(service => service.department === department.id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={department.name} size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <StatusBadge status={department.status} type="department" />
            <span className="text-white/60 text-sm bg-white/5 px-2 sm:px-3 py-1 rounded-full">
              {department.doctors + department.nurses} сотрудников
            </span>
            <span className="text-white/60 text-sm bg-blue-500/10 px-2 sm:px-3 py-1 rounded-full">
              {department.beds} коек
            </span>
            <span className="text-white/60 text-sm bg-emerald-500/10 px-2 sm:px-3 py-1 rounded-full">
              ⭐ {department.performance.efficiency}%
            </span>
          </div>
          <div className="text-white/60 text-sm">
            ID: {department.id}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Информация об отделении</h3>
              <div className="space-y-2 text-xs sm:text-sm text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/60">Специализация:</span>
                  <span className="text-white font-medium">{department.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Заведующий:</span>
                  <span className="text-white font-medium text-right">{department.head}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Местоположение:</span>
                  <span className="text-white font-medium text-right">{department.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Дата основания:</span>
                  <span className="text-white font-medium">{formatDate(department.established)}</span>
                </div>
              </div>
            </div>

            {department.services && department.services.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Основные услуги</h3>
                <div className="flex flex-wrap gap-1.5">
                  {department.services.map((service, index) => (
                    <span key={index} className="text-white/60 text-xs bg-white/5 px-2 py-1 rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Контактная информация</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Телефон:</span>
                  <span className="text-white font-medium">{department.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Email:</span>
                  <span className="text-white font-medium text-right break-all">{department.contactEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Загрузка отделения:</span>
                  <span className="text-white font-medium">{department.occupancy}%</span>
                </div>
              </div>
            </BentoCard>

            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Показатели эффективности</h4>
              <div className="space-y-3">
                <ProgressBar value={department.performance.efficiency} label="Эффективность" color={COLORS.blue} size="small" />
                <ProgressBar value={department.performance.satisfaction} label="Удовлетворенность" color={COLORS.emerald} size="small" />
                <ProgressBar value={100 - department.performance.readmission} label="Снижение реадмиссии" color={COLORS.purple} size="small" />
              </div>
            </BentoCard>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{department.doctors}</div>
            <div className="text-white/60 text-xs">Врачей</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{department.nurses}</div>
            <div className="text-white/60 text-xs">Медсестер</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{department.beds}</div>
            <div className="text-white/60 text-xs">Коечный фонд</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">
              {Math.round((department.performance.efficiency + department.performance.satisfaction + (100 - department.performance.readmission)) / 3)}%
            </div>
            <div className="text-white/60 text-xs">Общая эффективность</div>
          </BentoCard>
        </div>

        {departmentServices.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Услуги отделения ({departmentServices.length})</h3>
            <div className="grid gap-2 sm:gap-3">
              {departmentServices.map(service => (
                <BentoCard key={service.id} variant="compact" className="p-3" magnetic>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm truncate">{service.name}</h4>
                      <p className="text-white/60 text-xs truncate">{service.patients} пациентов • {service.successRate}% успешности</p>
                    </div>
                    <StatusBadge status={service.status} type="service" size="small" />
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
            Редактировать отделение
          </motion.button>
          <motion.button 
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Управление персоналом
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

const ServiceModal = ({ service, isOpen, onClose }: {
  service: MedicalService | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!service) return null;

  const department = departments.find(dept => dept.id === service.department);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'consultation': return '🩺';
      case 'diagnostics': return '🔍';
      case 'treatment': return '💊';
      case 'surgery': return '🔪';
      case 'rehabilitation': return '♿';
      default: return '🏥';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'consultation': return COLORS.blue;
      case 'diagnostics': return COLORS.cyan;
      case 'treatment': return COLORS.emerald;
      case 'surgery': return COLORS.rose;
      case 'rehabilitation': return COLORS.purple;
      default: return COLORS.gray;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={service.name} size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getCategoryIcon(service.category)}</span>
              <StatusBadge status={service.status} type="service" />
            </div>
            <span className="text-white/60 text-sm bg-white/5 px-2 sm:px-3 py-1 rounded-full">
              {service.category === 'consultation' ? 'Консультация' :
               service.category === 'diagnostics' ? 'Диагностика' :
               service.category === 'treatment' ? 'Лечение' :
               service.category === 'surgery' ? 'Хирургия' : 'Реабилитация'}
            </span>
            <span className="text-white/60 text-sm bg-blue-500/10 px-2 sm:px-3 py-1 rounded-full">
              {formatNumber(service.patients)} пациентов
            </span>
            {service.successRate > 0 && (
              <span className="text-white/60 text-sm bg-green-500/10 px-2 sm:px-3 py-1 rounded-full flex items-center gap-1">
                ⭐ {service.successRate}%
              </span>
            )}
          </div>
          <div className="text-white/60 text-sm">
            ID: {service.id}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Описание услуги</h3>
              <p className="text-white/70 leading-relaxed text-sm sm:text-base">{service.detailedDescription}</p>
            </div>

            {service.features && service.features.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Особенности</h3>
                <ul className="space-y-2 text-sm">
                  {service.features.map((feature, index) => (
                    <li key={index} className="text-white/70 flex items-start gap-2">
                      <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.requirements && service.requirements.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Требования</h3>
                <ul className="space-y-2 text-sm">
                  {service.requirements.map((req, index) => (
                    <li key={index} className="text-white/70 flex items-start gap-2">
                      <span className="text-green-400 mt-1 flex-shrink-0">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Детали услуги</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Категория:</span>
                  <span className="text-white font-medium">
                    {service.category === 'consultation' ? 'Консультация' :
                     service.category === 'diagnostics' ? 'Диагностика' :
                     service.category === 'treatment' ? 'Лечение' :
                     service.category === 'surgery' ? 'Хирургия' : 'Реабилитация'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Отделение:</span>
                  <span className="text-white font-medium text-right">{department?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Продолжительность:</span>
                  <span className="text-white font-medium">{service.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Стоимость:</span>
                  <span className="text-white font-medium">
                    {service.price > 0 ? formatCurrency(service.price) : 'Бесплатно'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Страховое покрытие:</span>
                  <span className={service.insuranceCovered ? 'text-green-300 font-medium' : 'text-red-300 font-medium'}>
                    {service.insuranceCovered ? 'Покрывается' : 'Не покрывается'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Пациентов:</span>
                  <span className="text-white font-medium">{formatNumber(service.patients)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Успешность:</span>
                  <span className="text-white font-medium flex items-center gap-1">
                    ⭐ {service.successRate}%
                  </span>
                </div>
              </div>
            </BentoCard>

            {service.statistics && (
              <BentoCard variant="compact" magnetic>
                <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Статистика</h4>
                <div className="space-y-3">
                  <ProgressBar value={service.statistics.monthlyGrowth} label="Месячный рост" color={COLORS.success} size="small" />
                  <ProgressBar value={service.statistics.completionRate} label="Выполнение" color={COLORS.blue} size="small" />
                  <ProgressBar value={service.statistics.satisfaction * 20} label="Удовлетворенность" color={COLORS.emerald} size="small" />
                  <ProgressBar value={100 - service.statistics.complications} label="Снижение осложнений" color={COLORS.purple} size="small" />
                </div>
              </BentoCard>
            )}
          </div>
        </div>

        {service.process && service.process.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Процесс оказания услуги</h3>
            <div className="grid gap-2 sm:gap-3">
              {service.process.map((step, index) => (
                <BentoCard key={index} variant="compact" className="p-3" magnetic>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-300 text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-white/70 text-sm">{step}</p>
                  </div>
                </BentoCard>
              ))}
            </div>
          </div>
        )}

        {service.reviews && service.reviews.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Отзывы пациентов</h3>
            <div className="grid gap-3">
              {service.reviews.map((review, index) => (
                <BentoCard key={index} variant="compact" className="p-3" magnetic>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-white font-medium text-sm">{review.patient}</h4>
                      <p className="text-white/60 text-xs">{formatDate(review.date)}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <span>⭐</span>
                      <span className="text-sm font-medium">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm">{review.comment}</p>
                </BentoCard>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/10">
          <motion.button 
            className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Статистика использования
          </motion.button>
          <motion.button 
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Настроить услугу
          </motion.button>
          <motion.button 
            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
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

const ClinicModal = ({ isOpen, onClose }: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="О клинике" size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Описание клиники</h3>
              <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                Городская клиническая больница №1 - многопрофильное медицинское учреждение, предоставляющее полный спектр медицинских услуг. 
                Основана в 1985 году, клиника является одним из ведущих медицинских центров Москвы, специализируясь на кардиологии, хирургии, неврологии и других направлениях.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Миссия</h3>
              <p className="text-white/70 italic text-sm sm:text-base">
                "Обеспечение высококачественной медицинской помощи на основе современных технологий и доказательной медицины для улучшения здоровья и качества жизни пациентов."
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Аккредитация и стандарты</h3>
              <div className="grid gap-2">
                {clinicData.accreditation.standards.map((standard, index) => (
                  <div key={index} className="flex justify-between text-sm bg-white/5 p-2 rounded-lg">
                    <span className="text-white/70">{standard}</span>
                    <span className="text-green-300 text-xs">Соответствует</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Контакты</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div>
                  <span className="text-white/60 block mb-1">Основной телефон:</span>
                  <p className="text-white font-medium">{clinicData.contacts.phone}</p>
                </div>
                <div>
                  <span className="text-white/60 block mb-1">Скорая помощь:</span>
                  <p className="text-white font-medium">{clinicData.contacts.emergency}</p>
                </div>
                <div>
                  <span className="text-white/60 block mb-1">Email:</span>
                  <p className="text-white font-medium break-all">{clinicData.contacts.email}</p>
                </div>
                <div>
                  <span className="text-white/60 block mb-1">Сайт:</span>
                  <p className="text-white font-medium">{clinicData.contacts.website}</p>
                </div>
                {clinicData.contacts.social && clinicData.contacts.social.length > 0 && (
                  <div>
                    <span className="text-white/60 block mb-1">Социальные сети:</span>
                    <div className="flex flex-wrap gap-2">
                      {clinicData.contacts.social.map((social, index) => (
                        <a 
                          key={index} 
                          href={social.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:text-blue-200 text-xs bg-blue-500/10 px-2 py-1 rounded-lg transition-colors"
                        >
                          {social.platform}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </BentoCard>

            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Ключевые показатели</h4>
              <div className="space-y-3">
                <ProgressBar value={clinicData.statistics.successRate} label="Успешность лечения" color={COLORS.emerald} size="small" />
                <ProgressBar value={clinicData.accreditation.compliance} label="Соответствие стандартам" color={COLORS.blue} size="small" />
                <ProgressBar value={(clinicData.equipment.operational / clinicData.equipment.total) * 100} label="Исправность оборудования" color={COLORS.cyan} size="small" />
              </div>
            </BentoCard>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/10">
          <motion.button 
            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Редактировать информацию
          </motion.button>
          <motion.button 
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Экспорт данных
          </motion.button>
          <motion.button 
            className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Создать годовой отчет
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

// Основной компонент
export default function ClinicOrganization() {
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'services' | 'equipment' | 'quality' | 'analytics'>('overview');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedService, setSelectedService] = useState<MedicalService | null>(null);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isClinicModalOpen, setIsClinicModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    specialization: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Имитация загрузки данных
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Статистика для дашборда
  const stats = useMemo(() => {
    const totalStaff = clinicData.statistics.doctors + clinicData.statistics.nursingStaff + clinicData.statistics.administrativeStaff;
    const activeDepartments = departments.filter(dept => dept.status === 'active').length;
    const activeServices = medicalServices.filter(service => service.status === 'active').length;
    const totalRevenue = clinicData.financial.quarterly.reduce((sum, q) => sum + q.income, 0);

    return {
      totalStaff,
      activeDepartments,
      activeServices,
      totalRevenue,
      equipmentProgress: (clinicData.equipment.operational / clinicData.equipment.total) * 100
    };
  }, []);

  // Фильтрация данных
  const filteredDepartments = useMemo(() => {
    return departments.filter(dept => {
      const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dept.head.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dept.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status === 'all' || dept.status === filters.status;
      const matchesSpecialization = filters.specialization === 'all' || dept.specialization === filters.specialization;
      
      return matchesSearch && matchesStatus && matchesSpecialization;
    });
  }, [searchQuery, filters]);

  const filteredServices = useMemo(() => {
    return medicalServices.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status === 'all' || service.status === filters.status;
      const matchesCategory = filters.category === 'all' || service.category === filters.category;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, filters]);

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: '🏥', color: COLORS.rose },
    { id: 'departments' as const, label: 'Отделения', icon: '🏢', color: COLORS.blue },
    { id: 'services' as const, label: 'Услуги', icon: '🎯', color: COLORS.emerald },
    { id: 'equipment' as const, label: 'Оборудование', icon: '🖥️', color: COLORS.cyan },
    { id: 'quality' as const, label: 'Качество', icon: '⭐', color: COLORS.amber },
    { id: 'analytics' as const, label: 'Аналитика', icon: '📊', color: COLORS.purple }
  ];

  const handleDepartmentClick = (department: Department) => {
    setSelectedDepartment(department);
    setIsDepartmentModalOpen(true);
  };

  const handleServiceClick = (service: MedicalService) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const closeDepartmentModal = () => {
    setIsDepartmentModalOpen(false);
    setSelectedDepartment(null);
  };

  const closeServiceModal = () => {
    setIsServiceModalOpen(false);
    setSelectedService(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Данные для графиков
  const patientData = [65, 59, 80, 81, 56, 55, 40];
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
            className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full mx-auto mb-4"
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
            Загрузка медицинской системы...
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
          0%, 100% { box-shadow: 0 0 20px rgba(244, 63, 94, 0.3); }
          50% { box-shadow: 0 0 40px rgba(244, 63, 94, 0.6); }
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
          background: linear-gradient(135deg, #f87171 0%, #fb7185 50%, #f472b6 100%);
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
        {/* Clinic Header */}
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
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg cursor-pointer animate-float animate-pulse-glow"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsClinicModalOpen(true)}
                  >
                    🏥
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <motion.h1 
                      className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 break-words gradient-text"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {clinicData.name}
                    </motion.h1>
                    <motion.p 
                      className="text-white/60 text-xs sm:text-sm lg:text-base"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Лицензия: {clinicData.licenseNumber} • {clinicData.address.legal}
                    </motion.p>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">О клинике</h3>
                    <p className="text-white/70 leading-relaxed text-xs sm:text-sm line-clamp-3">
                      Городская клиническая больница №1 - многопрофильное медицинское учреждение, предоставляющее полный спектр медицинских услуг. 
                      Основана в 1985 году, клиника является одним из ведущих медицинских центров Москвы.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 text-white/70">
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Главный врач</p>
                      <p className="text-white font-medium text-sm">{clinicData.chiefPhysician}</p>
                    </div>
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Медицинский директор</p>
                      <p className="text-white font-medium text-sm">{clinicData.medicalDirector}</p>
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Дата основания</p>
                      <p className="text-white font-medium text-sm">
                        {formatDate(clinicData.foundationDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Юридический адрес</p>
                      <p className="text-white font-medium text-sm leading-relaxed">{clinicData.address.legal}</p>
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
                      <span className="text-white font-medium text-right">{clinicData.contacts.phone}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/50">Скорая:</span>
                      <span className="text-white font-medium text-right">{clinicData.contacts.emergency}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/50">Email:</span>
                      <span className="text-white font-medium text-right break-all">{clinicData.contacts.email}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/50">Сайт:</span>
                      <span className="text-white font-medium text-right break-all">{clinicData.contacts.website}</span>
                    </div>
                  </div>
                </BentoCard>
                
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                  <motion.button 
                    className="flex-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsClinicModalOpen(true)}
                  >
                    Подробнее о клинике
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
              title="Пациентов в год"
              value={<AnimatedCounter value={clinicData.statistics.patients} />}
              change={12}
              chartData={patientData}
              color={COLORS.emerald}
            />
            <MetricCard
              title="Медицинский персонал"
              value={clinicData.statistics.doctors + clinicData.statistics.nursingStaff}
              change={8}
              chartData={growthData}
              color={COLORS.blue}
            />
            <MetricCard
              title="Отделений"
              value={stats.activeDepartments}
              change={2}
              chartData={[85, 78, 92, 89, 76, 82, 88]}
              color={COLORS.purple}
            />
            <MetricCard
              title="Операций в год"
              value={<AnimatedCounter value={clinicData.statistics.surgeries} />}
              change={15}
              chartData={[75, 82, 78, 85, 80, 88, 92]}
              color={COLORS.rose}
            />
            <MetricCard
              title="Оборудование"
              value={`${stats.equipmentProgress.toFixed(0)}%`}
              change={3}
              chartData={[65, 59, 80, 81, 56, 55, 40]}
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
        {(activeTab === 'departments' || activeTab === 'services') && (
          <SearchAndFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            placeholder={`Поиск ${activeTab === 'departments' ? 'отделений' : 'услуг'}...`}
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
                    { icon: '🏢', title: 'Отделения', description: `${departments.length} подразделений`, color: COLORS.blue, action: () => setActiveTab('departments') },
                    { icon: '🎯', title: 'Услуги', description: `${medicalServices.length} медицинских услуг`, color: COLORS.emerald, action: () => setActiveTab('services') },
                    { icon: '🖥️', title: 'Оборудование', description: `${clinicData.equipment.total} единиц`, color: COLORS.cyan, action: () => setActiveTab('equipment') },
                    { icon: '⭐', title: 'Качество', description: 'Стандарты и аккредитация', color: COLORS.amber, action: () => setActiveTab('quality') },
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

                {/* Licenses & Emergency Stats */}
                <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Медицинские лицензии</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {clinicData.licenses.slice(0, 4).map((license, index) => (
                        <LicenseCard key={license.number} license={license} index={index} />
                      ))}
                    </div>
                  </div>

                  <BentoCard className="p-4 sm:p-6" magnetic>
                    <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Экстренные показатели</h3>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        { metric: 'Свободных коек', value: 42, total: clinicData.statistics.beds, color: COLORS.success },
                        { metric: 'Операций сегодня', value: 28, total: 35, color: COLORS.blue },
                        { metric: 'Поступлений за сутки', value: 67, total: 0, color: COLORS.orange },
                        { metric: 'Врачей на смене', value: 89, total: clinicData.statistics.doctors, color: COLORS.purple }
                      ].map((item, index) => (
                        <motion.div 
                          key={index} 
                          className="space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">{item.metric}</span>
                            <span className="text-white font-medium">{item.value}{item.total > 0 ? `/${item.total}` : ''}</span>
                          </div>
                          {item.total > 0 && (
                            <ProgressBar 
                              value={(item.value / item.total) * 100} 
                              color={item.color}
                              size="small"
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </BentoCard>
                </div>

                {/* Departments Preview */}
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Медицинские отделения</h2>
                    <motion.button 
                      className="text-blue-300 hover:text-blue-200 text-xs sm:text-sm transition-colors"
                      onClick={() => setActiveTab('departments')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Все отделения →
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {departments.slice(0, 3).map((department, index) => (
                      <DepartmentCard 
                        key={department.id} 
                        department={department} 
                        onClick={() => handleDepartmentClick(department)}
                        delay={index * 0.1}
                      />
                    ))}
                  </div>
                </div>

                {/* Services Preview */}
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Популярные услуги</h2>
                    <motion.button 
                      className="text-emerald-300 hover:text-emerald-200 text-xs sm:text-sm transition-colors"
                      onClick={() => setActiveTab('services')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Все услуги →
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {medicalServices.slice(0, 3).map((service, index) => (
                      <ServiceCard 
                        key={service.id} 
                        service={service} 
                        onClick={() => handleServiceClick(service)}
                        delay={index * 0.1}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'departments' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Медицинские отделения</h2>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">
                      {filteredDepartments.length} отделений, {filteredDepartments.reduce((acc, dept) => acc + dept.doctors + dept.nurses, 0)} сотрудников
                    </p>
                  </div>
                  <motion.button 
                    className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-xs sm:text-sm whitespace-nowrap w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + Новое отделение
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredDepartments.map((department, index) => (
                    <DepartmentCard 
                      key={department.id} 
                      department={department} 
                      onClick={() => handleDepartmentClick(department)}
                      delay={index * 0.05}
                    />
                  ))}
                </div>
                {filteredDepartments.length === 0 && (
                  <BentoCard className="text-center py-8">
                    <div className="text-4xl mb-4">🏢</div>
                    <h3 className="text-white font-semibold text-lg mb-2">Отделения не найдены</h3>
                    <p className="text-white/60">Попробуйте изменить параметры поиска или фильтры</p>
                  </BentoCard>
                )}
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
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Медицинские услуги</h2>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">
                      {filteredServices.length} услуг, {filteredServices.reduce((acc, service) => acc + service.patients, 0)} пациентов
                    </p>
                  </div>
                  <motion.button 
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-xs sm:text-sm whitespace-nowrap w-full sm:w-auto"
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
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="text-white font-semibold text-lg mb-2">Услуги не найдены</h3>
                    <p className="text-white/60">Попробуйте изменить параметры поиска или фильтры</p>
                  </BentoCard>
                )}
              </motion.div>
            )}

            {activeTab === 'equipment' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="grid lg:grid-cols-2 gap-6">
                  <BentoCard className="p-6" glowColor={COLORS.cyan} magnetic>
                    <h3 className="text-white font-semibold mb-4">Состояние оборудования</h3>
                    <div className="text-3xl font-bold text-white mb-2">
                      {((clinicData.equipment.operational / clinicData.equipment.total) * 100).toFixed(1)}%
                    </div>
                    <ProgressBar value={(clinicData.equipment.operational / clinicData.equipment.total) * 100} color={COLORS.cyan} />
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-white/60">
                      <div>
                        <p>Исправно</p>
                        <p className="text-white font-medium">{clinicData.equipment.operational} ед.</p>
                      </div>
                      <div>
                        <p>На обслуживании</p>
                        <p className="text-white font-medium">{clinicData.equipment.underMaintenance} ед.</p>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.blue} magnetic>
                    <h3 className="text-white font-semibold mb-4">Критическое оборудование</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Требует замены</span>
                        <span className="text-white font-medium">{clinicData.equipment.critical} ед.</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Последний аудит</span>
                        <span className="text-white font-medium">{formatDate(clinicData.equipment.lastAudit)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Общий фонд</span>
                        <span className="text-emerald-300 font-medium">{clinicData.equipment.total} ед.</span>
                      </div>
                    </div>
                  </BentoCard>
                </div>

                <BentoCard className="p-6" magnetic>
                  <h3 className="text-white font-semibold mb-4">Распределение оборудования по отделениям</h3>
                  <div className="space-y-3">
                    {departments.map((dept, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-white text-sm">{dept.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white/60 text-sm">{dept.equipment.operational}/{dept.equipment.total}</span>
                          <ProgressBar 
                            value={(dept.equipment.operational / dept.equipment.total) * 100} 
                            color={COLORS.cyan}
                            size="small"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </BentoCard>
              </motion.div>
            )}

            {activeTab === 'quality' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="grid lg:grid-cols-3 gap-6">
                  <BentoCard className="p-6" glowColor={COLORS.amber} magnetic>
                    <h3 className="text-white font-semibold mb-4">Качество обслуживания</h3>
                    <div className="text-3xl font-bold text-white mb-2">
                      {clinicData.accreditation.compliance}%
                    </div>
                    <ProgressBar value={clinicData.accreditation.compliance} color={COLORS.amber} />
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-white/60">
                      <div>
                        <p>Последняя проверка</p>
                        <p className="text-white font-medium">{formatDate(clinicData.accreditation.lastInspection)}</p>
                      </div>
                      <div>
                        <p>Следующая проверка</p>
                        <p className="text-white font-medium">{formatDate(clinicData.accreditation.nextInspection)}</p>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.emerald} magnetic>
                    <h3 className="text-white font-semibold mb-4">Успешность лечения</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Общая успешность</span>
                        <span className="text-white font-medium">{clinicData.statistics.successRate}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Среднее время пребывания</span>
                        <span className="text-white font-medium">{clinicData.statistics.avgStay} дней</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Реадмиссия</span>
                        <span className="text-emerald-300 font-medium">8.2%</span>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.purple} magnetic>
                    <h3 className="text-white font-semibold mb-4">Стандарты аккредитации</h3>
                    <div className="space-y-3">
                      {clinicData.accreditation.standards.map((standard, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-white text-sm">{standard}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-green-300 text-sm">✓</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </BentoCard>
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
                  <BentoCard className="p-6" glowColor={COLORS.blue} magnetic>
                    <h3 className="text-white font-semibold mb-4">Эффективность клиники</h3>
                    <div className="text-3xl font-bold text-white mb-2">
                      <AnimatedCounter value={87.5} format="percentage" />%
                    </div>
                    <ProgressBar value={87.5} color={COLORS.blue} />
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-white/60">
                      <div>
                        <p>Удовлетворенность</p>
                        <p className="text-white font-medium">92.3%</p>
                      </div>
                      <div>
                        <p>Рост пациентов</p>
                        <p className="text-white font-medium">+18.2%</p>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.emerald} magnetic>
                    <h3 className="text-white font-semibold mb-4">Финансовые показатели</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Годовой бюджет</span>
                        <span className="text-white font-medium">{formatCurrency(clinicData.financial.budget)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Операционные расходы</span>
                        <span className="text-white font-medium">{formatCurrency(clinicData.financial.expenses)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Страховые поступления</span>
                        <span className="text-emerald-300 font-medium">{formatCurrency(clinicData.financial.insurance)}</span>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.orange} magnetic>
                    <h3 className="text-white font-semibold mb-4">Распределение услуг</h3>
                    <div className="space-y-3">
                      {[
                        { service: 'Консультации', percentage: 35, patients: formatNumber(12560) },
                        { service: 'Диагностика', percentage: 28, patients: formatNumber(8920) },
                        { service: 'Хирургия', percentage: 22, patients: formatNumber(4560) },
                        { service: 'Лечение', percentage: 12, patients: formatNumber(3340) },
                        { service: 'Реабилитация', percentage: 3, patients: formatNumber(890) }
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

                {/* Medical Analytics */}
                <BentoCard className="p-6" magnetic>
                  <h3 className="text-white font-semibold mb-4">Медицинская аналитика</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Клинические метрики</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">Успешность операций</span>
                          <span className="text-white font-medium">94.2%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">Время ожидания</span>
                          <span className="text-white font-medium">2.3 дня</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">Удовлетворенность пациентов</span>
                          <span className="text-white font-medium">91.5%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">Реадмиссия</span>
                          <span className="text-white font-medium">8.2%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Операционные метрики</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">Загрузка отделений</span>
                          <span className="text-white font-medium">84.7%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">Эффективность персонала</span>
                          <span className="text-white font-medium">87.5%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">Использование оборудования</span>
                          <span className="text-white font-medium">76.8%</span>
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
      <DepartmentModal
        department={selectedDepartment}
        isOpen={isDepartmentModalOpen}
        onClose={closeDepartmentModal}
      />
      
      <ServiceModal
        service={selectedService}
        isOpen={isServiceModalOpen}
        onClose={closeServiceModal}
      />

      <ClinicModal
        isOpen={isClinicModalOpen}
        onClose={() => setIsClinicModalOpen(false)}
      />
    </div>
  );
}