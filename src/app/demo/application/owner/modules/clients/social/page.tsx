'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Custom hook для времени с улучшенной производительностью
const useClientTime = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
};

// Расширенные типы данных
interface ServiceCitizen {
  id: string;
  personalInfo: {
    fullName: string;
    birthDate: string;
    gender: 'male' | 'female';
    phone: string;
    email?: string;
    address: string;
    passport: string;
    snils: string;
    avatar?: string;
  };
  serviceInfo: {
    category: 'education' | 'healthcare' | 'utilities' | 'transport' | 'culture' | 'sports' | 'other';
    serviceType: string;
    provider: string;
    registrationNumber: string;
    status: 'active' | 'pending' | 'suspended' | 'completed';
    startDate: string;
    endDate?: string;
  };
  preferences: {
    communication: 'phone' | 'email' | 'messenger' | 'in_person';
    visitTime: string[];
    specialRequirements: string[];
    language: string;
    notifications: boolean;
  };
  documents: {
    application: string;
    contract?: string;
    certificates: string[];
    attachments: string[];
  };
  status: 'active' | 'inactive' | 'suspended';
  registrationDate: string;
  lastActivity?: string;
  assignedManager?: string;
  notes?: string;
  rating: number;
  serviceHistory: ServiceHistory[];
}

interface ServiceHistory {
  id: string;
  serviceType: string;
  provider: string;
  date: string;
  status: 'completed' | 'cancelled';
  rating?: number;
  feedback?: string;
}

interface ServiceProvider {
  id: string;
  personalInfo: {
    fullName: string;
    phone: string;
    email: string;
    position: string;
    department: string;
    avatar?: string;
  };
  specialization: string[];
  assignedClients: string[];
  schedule: {
    days: string[];
    hours: string;
    timezone: string;
  };
  status: 'active' | 'busy' | 'vacation' | 'sick_leave' | 'training';
  metrics: {
    clientSatisfaction: number;
    onTimeService: number;
    completedServices: number;
    responseTime: number;
  };
  skills: string[];
  languages: string[];
  lastActive: string;
}

interface ServiceRequest {
  id: string;
  citizenId: string;
  serviceType: string;
  description: string;
  detailedDescription?: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  status: 'submitted' | 'reviewed' | 'approved' | 'assigned' | 'in_progress' | 'completed' | 'rejected';
  timeline: {
    submitted: string;
    reviewed?: string;
    approved?: string;
    assigned?: string;
    started?: string;
    completed?: string;
  };
  assignedProvider?: string;
  notes?: string;
  attachments?: string[];
  estimatedDuration?: string;
  priority: number;
}

// Расширенные моки данных
const serviceCitizens: ServiceCitizen[] = [
  {
    id: 'sc-001',
    personalInfo: {
      fullName: 'Иванова Мария Сергеевна',
      birthDate: '1985-05-15',
      gender: 'female',
      phone: '+7 (916) 123-45-67',
      email: 'm.ivanova@example.ru',
      address: 'г. Москва, ул. Ленина, д. 15, кв. 34',
      passport: '4510 123456',
      snils: '123-456-789-00',
      avatar: '👩‍💼'
    },
    serviceInfo: {
      category: 'education',
      serviceType: 'Дополнительное образование',
      provider: 'Центр развития "Перспектива"',
      registrationNumber: 'EDU-2024-001',
      status: 'active',
      startDate: '2024-01-15'
    },
    preferences: {
      communication: 'phone',
      visitTime: ['10:00-13:00', '14:00-16:00'],
      specialRequirements: ['Доступная среда', 'Кондиционер в помещении', 'Бесплатный Wi-Fi'],
      language: 'русский',
      notifications: true
    },
    documents: {
      application: 'app_001.pdf',
      contract: 'contract_001.pdf',
      certificates: ['certificate_001.pdf', 'education_diploma.pdf'],
      attachments: ['photo.jpg', 'additional_info.pdf']
    },
    status: 'active',
    registrationDate: '2024-01-10',
    lastActivity: '2024-06-18T14:30:00Z',
    assignedManager: 'sp-001',
    notes: 'Интересуется курсами иностранных языков. Предпочтение отдает утренним занятиям. Требуется консультация по программе обучения.',
    rating: 4.8,
    serviceHistory: [
      {
        id: 'sh-001',
        serviceType: 'Курсы английского языка',
        provider: 'Центр развития "Перспектива"',
        date: '2024-03-15',
        status: 'completed',
        rating: 5,
        feedback: 'Отличный курс, профессиональный преподаватель'
      },
      {
        id: 'sh-002',
        serviceType: 'Компьютерная грамотность',
        provider: 'Технопарк',
        date: '2024-01-20',
        status: 'completed',
        rating: 4
      }
    ]
  },
  {
    id: 'sc-002',
    personalInfo: {
      fullName: 'Петров Иван Дмитриевич',
      birthDate: '1978-12-20',
      gender: 'male',
      phone: '+7 (925) 234-56-78',
      email: 'i.petrov@example.ru',
      address: 'г. Москва, пр. Мира, д. 125, кв. 89',
      passport: '4510 234567',
      snils: '234-567-890-11',
      avatar: '👨‍💻'
    },
    serviceInfo: {
      category: 'healthcare',
      serviceType: 'Медицинские услуги',
      provider: 'Поликлиника №5',
      registrationNumber: 'MED-2024-002',
      status: 'active',
      startDate: '2024-02-01'
    },
    preferences: {
      communication: 'in_person',
      visitTime: ['09:00-12:00', '14:00-17:00'],
      specialRequirements: ['Парковка для инвалидов', 'Лифт', 'Доступный вход'],
      language: 'русский',
      notifications: false
    },
    documents: {
      application: 'app_002.pdf',
      contract: 'contract_002.pdf',
      certificates: ['medical_cert_002.pdf', 'insurance.pdf'],
      attachments: ['medical_history.pdf']
    },
    status: 'active',
    registrationDate: '2024-01-25',
    lastActivity: '2024-06-19T09:15:00Z',
    assignedManager: 'sp-002',
    notes: 'Требуется регулярное медицинское наблюдение. Предпочтительны утренние визиты. Необходима парковка для инвалидов.',
    rating: 4.5,
    serviceHistory: [
      {
        id: 'sh-003',
        serviceType: 'Медицинский осмотр',
        provider: 'Поликлиника №5',
        date: '2024-04-10',
        status: 'completed',
        rating: 4,
        feedback: 'Внимательное обслуживание, чистое помещение'
      }
    ]
  },
  {
    id: 'sc-003',
    personalInfo: {
      fullName: 'Сидорова Анна Владимировна',
      birthDate: '1990-08-30',
      gender: 'female',
      phone: '+7 (916) 345-67-89',
      email: 'a.sidorova@example.ru',
      address: 'г. Москва, ул. Пушкина, д. 67, кв. 12',
      passport: '4510 345678',
      snils: '345-678-901-22',
      avatar: '👩‍🎓'
    },
    serviceInfo: {
      category: 'culture',
      serviceType: 'Библиотечные услуги',
      provider: 'Центральная библиотека',
      registrationNumber: 'CUL-2024-003',
      status: 'pending',
      startDate: '2024-02-20'
    },
    preferences: {
      communication: 'email',
      visitTime: ['11:00-14:00', '15:00-18:00'],
      specialRequirements: ['Электронный каталог', 'Копировальные услуги', 'Компьютерный зал'],
      language: 'русский',
      notifications: true
    },
    documents: {
      application: 'app_003.pdf',
      certificates: ['library_card_003.pdf'],
      attachments: []
    },
    status: 'active',
    registrationDate: '2024-02-15',
    lastActivity: '2024-06-17T16:45:00Z',
    notes: 'Активный пользователь электронных ресурсов. Интересуется современной литературой. Участвует в библиотечных мероприятиях.',
    rating: 4.9,
    serviceHistory: [
      {
        id: 'sh-004',
        serviceType: 'Литературный кружок',
        provider: 'Центральная библиотека',
        date: '2024-03-25',
        status: 'completed',
        rating: 5,
        feedback: 'Интересные обсуждения, квалифицированный ведущий'
      }
    ]
  },
  {
    id: 'sc-004',
    personalInfo: {
      fullName: 'Козлов Олег Николаевич',
      birthDate: '1982-03-10',
      gender: 'male',
      phone: '+7 (925) 456-78-90',
      email: 'o.kozlov@example.ru',
      address: 'г. Москва, ул. Гагарина, д. 34, кв. 56',
      passport: '4510 456789',
      snils: '456-789-012-33',
      avatar: '👨‍🏫'
    },
    serviceInfo: {
      category: 'sports',
      serviceType: 'Спортивные услуги',
      provider: 'Спорткомплекс "Олимп"',
      registrationNumber: 'SPT-2024-004',
      status: 'active',
      startDate: '2024-01-20'
    },
    preferences: {
      communication: 'messenger',
      visitTime: ['08:00-12:00', '18:00-21:00'],
      specialRequirements: ['Тренерское сопровождение', 'Абонемент', 'Раздевалки'],
      language: 'русский',
      notifications: true
    },
    documents: {
      application: 'app_004.pdf',
      contract: 'contract_004.pdf',
      certificates: ['sport_cert_004.pdf', 'health_certificate.pdf'],
      attachments: ['training_plan.pdf']
    },
    status: 'active',
    registrationDate: '2024-01-18',
    lastActivity: '2024-06-16T19:20:00Z',
    assignedManager: 'sp-003',
    notes: 'Участвует в групповых тренировках. Предпочитает вечернее время. Интересуется силовыми тренировками.',
    rating: 4.7,
    serviceHistory: [
      {
        id: 'sh-005',
        serviceType: 'Групповые тренировки',
        provider: 'Спорткомплекс "Олимп"',
        date: '2024-05-15',
        status: 'completed',
        rating: 5,
        feedback: 'Отличный тренер, хорошая атмосфера'
      }
    ]
  },
  {
    id: 'sc-005',
    personalInfo: {
      fullName: 'Никитина Елена Викторовна',
      birthDate: '1995-07-22',
      gender: 'female',
      phone: '+7 (916) 567-89-01',
      email: 'e.nikitina@example.ru',
      address: 'г. Москва, ул. Тверская, д. 25, кв. 14',
      passport: '4510 567890',
      snils: '567-890-123-44',
      avatar: '👩‍🍳'
    },
    serviceInfo: {
      category: 'education',
      serviceType: 'Профессиональное обучение',
      provider: 'Учебный центр "Профи"',
      registrationNumber: 'EDU-2024-005',
      status: 'active',
      startDate: '2024-03-10'
    },
    preferences: {
      communication: 'email',
      visitTime: ['13:00-16:00', '17:00-20:00'],
      specialRequirements: ['Онлайн-курсы', 'Практические занятия', 'Сертификация'],
      language: 'русский',
      notifications: true
    },
    documents: {
      application: 'app_005.pdf',
      contract: 'contract_005.pdf',
      certificates: ['education_cert_005.pdf'],
      attachments: ['portfolio.pdf']
    },
    status: 'active',
    registrationDate: '2024-03-05',
    lastActivity: '2024-06-19T11:30:00Z',
    assignedManager: 'sp-001',
    rating: 4.6,
    serviceHistory: []
  }
];

const serviceProviders: ServiceProvider[] = [
  {
    id: 'sp-001',
    personalInfo: {
      fullName: 'Александрова Елена Викторовна',
      phone: '+7 (916) 111-22-33',
      email: 'e.alexandrova@services.ru',
      position: 'Менеджер по работе с клиентами',
      department: 'Образовательные услуги',
      avatar: '👩‍💼'
    },
    specialization: ['Образовательные услуги', 'Культурные мероприятия', 'Профессиональное обучение'],
    assignedClients: ['sc-001', 'sc-005'],
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      hours: '08:00-17:00',
      timezone: 'Europe/Moscow'
    },
    status: 'active',
    metrics: {
      clientSatisfaction: 95,
      onTimeService: 98,
      completedServices: 245,
      responseTime: 15
    },
    skills: ['Коммуникабельность', 'Организационные навыки', 'Знание образовательных программ'],
    languages: ['русский', 'английский'],
    lastActive: '2024-06-19T16:45:00Z'
  },
  {
    id: 'sp-002',
    personalInfo: {
      fullName: 'Николаев Дмитрий Сергеевич',
      phone: '+7 (925) 222-33-44',
      email: 'd.nikolaev@services.ru',
      position: 'Координатор медицинских услуг',
      department: 'Медицинские услуги',
      avatar: '👨‍⚕️'
    },
    specialization: ['Медицинские услуги', 'Социальная поддержка', 'Реабилитация'],
    assignedClients: ['sc-002'],
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      hours: '09:00-18:00',
      timezone: 'Europe/Moscow'
    },
    status: 'busy',
    metrics: {
      clientSatisfaction: 92,
      onTimeService: 95,
      completedServices: 189,
      responseTime: 20
    },
    skills: ['Медицинские знания', 'Эмпатия', 'Организация визитов'],
    languages: ['русский'],
    lastActive: '2024-06-19T15:30:00Z'
  },
  {
    id: 'sp-003',
    personalInfo: {
      fullName: 'Орлова Светлана Петровна',
      phone: '+7 (916) 333-44-55',
      email: 's.orlova@services.ru',
      position: 'Специалист по спортивным программам',
      department: 'Спортивные услуги',
      avatar: '👩‍🏫'
    },
    specialization: ['Спортивные услуги', 'Оздоровительные программы', 'Фитнес-тренировки'],
    assignedClients: ['sc-004'],
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      hours: '08:00-16:00',
      timezone: 'Europe/Moscow'
    },
    status: 'active',
    metrics: {
      clientSatisfaction: 96,
      onTimeService: 97,
      completedServices: 156,
      responseTime: 12
    },
    skills: ['Спортивная подготовка', 'Мотивация', 'Составление программ'],
    languages: ['русский', 'английский'],
    lastActive: '2024-06-19T14:15:00Z'
  },
  {
    id: 'sp-004',
    personalInfo: {
      fullName: 'Волков Андрей Игоревич',
      phone: '+7 (916) 444-55-66',
      email: 'a.volkov@services.ru',
      position: 'Координатор культурных мероприятий',
      department: 'Культурные услуги',
      avatar: '👨‍🎨'
    },
    specialization: ['Культурные мероприятия', 'Библиотечные услуги', 'Творческие мастерские'],
    assignedClients: [],
    schedule: {
      days: ['Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      hours: '10:00-19:00',
      timezone: 'Europe/Moscow'
    },
    status: 'training',
    metrics: {
      clientSatisfaction: 89,
      onTimeService: 93,
      completedServices: 78,
      responseTime: 25
    },
    skills: ['Организация мероприятий', 'Работа с аудиторией', 'Творческий подход'],
    languages: ['русский', 'французский'],
    lastActive: '2024-06-18T17:00:00Z'
  }
];

const serviceRequests: ServiceRequest[] = [
  {
    id: 'sr-001',
    citizenId: 'sc-001',
    serviceType: 'education',
    description: 'Запись на курсы английского языка',
    detailedDescription: 'Требуется запись на интенсивный курс английского языка уровня Intermediate. Предпочтительны утренние занятия 3 раза в неделю. Необходима консультация по программе обучения и тестирование текущего уровня.',
    urgency: 'medium',
    status: 'submitted',
    timeline: {
      submitted: '2024-06-18T10:00:00Z'
    },
    priority: 2,
    estimatedDuration: '3 месяца'
  },
  {
    id: 'sr-002',
    citizenId: 'sc-003',
    serviceType: 'culture',
    description: 'Продление библиотечного абонемента',
    detailedDescription: 'Необходимо продлить действующий библиотечный абонемент на следующий год. Также интересует информация о новых поступлениях художественной литературы.',
    urgency: 'low',
    status: 'reviewed',
    timeline: {
      submitted: '2024-06-17T14:00:00Z',
      reviewed: '2024-06-18T09:00:00Z'
    },
    priority: 1,
    estimatedDuration: '1 день'
  },
  {
    id: 'sr-003',
    citizenId: 'sc-002',
    serviceType: 'healthcare',
    description: 'Запись на медицинский осмотр',
    detailedDescription: 'Требуется комплексный медицинский осмотр включая анализы, ЭКГ и консультацию терапевта. Необходима предварительная запись на конкретное время с учетом особых требований по доступности.',
    urgency: 'high',
    status: 'assigned',
    timeline: {
      submitted: '2024-06-16T11:30:00Z',
      reviewed: '2024-06-16T15:45:00Z',
      assigned: '2024-06-17T09:15:00Z'
    },
    assignedProvider: 'sp-002',
    priority: 3,
    estimatedDuration: '2 часа'
  },
  {
    id: 'sr-004',
    citizenId: 'sc-004',
    serviceType: 'sports',
    description: 'Изменение графика тренировок',
    detailedDescription: 'Требуется изменить текущий график групповых тренировок с вечернего на утреннее время в связи с изменением рабочего графика. Необходимо подобрать подходящую группу и тренера.',
    urgency: 'medium',
    status: 'in_progress',
    timeline: {
      submitted: '2024-06-15T16:20:00Z',
      reviewed: '2024-06-16T10:30:00Z',
      assigned: '2024-06-16T14:15:00Z',
      started: '2024-06-17T11:00:00Z'
    },
    assignedProvider: 'sp-003',
    priority: 2,
    estimatedDuration: '1 неделя'
  }
];

// Константы с расширенной палитрой
const COLORS = {
  primary: 'from-slate-900 via-slate-950 to-slate-900',
  secondary: 'from-teal-900 via-slate-950 to-emerald-900',
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
  slate: '100, 116, 139',
  violet: '139, 92, 246',
  fuchsia: '217, 70, 239',
  lime: '132, 204, 22',
  sky: '14, 165, 233'
} as const;

// Утилиты
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU');
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('ru-RU');
};

const calculateAge = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'только что';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин назад`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч назад`;
  return `${Math.floor(diffInSeconds / 86400)} дн назад`;
};

// Улучшенный Modal Component
const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'md',
  showCloseButton = true
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
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
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
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
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200 text-slate-400 hover:text-white hover:scale-110"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
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

// Улучшенный BentoCard с анимациями
const BentoCard = ({ 
  children, 
  className = '', 
  glowColor = COLORS.teal, 
  onClick,
  hoverable = true,
  padding = 'p-6',
  animationDelay = 0
}: { 
  children: React.ReactNode; 
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: string;
  animationDelay?: number;
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
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: animationDelay * 0.1 }}
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

// Улучшенный StatusBadge с иконками
const StatusBadge = ({ status, type = 'default', animated = false, size = 'md' }: { 
  status: string; 
  type?: 'default' | 'citizen' | 'service' | 'provider' | 'request' | 'urgency';
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const getStatusConfig = () => {
    const baseConfig = {
      active: { color: COLORS.success, label: 'Активен', icon: '🟢', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      inactive: { color: COLORS.slate, label: 'Неактивен', icon: '⚫', bg: 'bg-slate-500/15', border: 'border-slate-500/30' },
      suspended: { color: COLORS.warning, label: 'Приостановлен', icon: '🟡', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' },
      pending: { color: COLORS.blue, label: 'Ожидание', icon: '⏳', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      completed: { color: COLORS.success, label: 'Завершен', icon: '✅', bg: 'bg-green-500/15', border: 'border-green-500/30' },
      busy: { color: COLORS.orange, label: 'Занят', icon: '🟠', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      vacation: { color: COLORS.cyan, label: 'Отпуск', icon: '🏖️', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' },
      sick_leave: { color: COLORS.purple, label: 'Больничный', icon: '🏥', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
      training: { color: COLORS.violet, label: 'Обучение', icon: '📚', bg: 'bg-violet-500/15', border: 'border-violet-500/30' },
      submitted: { color: COLORS.blue, label: 'Подана', icon: '📨', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      reviewed: { color: COLORS.teal, label: 'Рассмотрена', icon: '👀', bg: 'bg-teal-500/15', border: 'border-teal-500/30' },
      approved: { color: COLORS.success, label: 'Одобрена', icon: '👍', bg: 'bg-green-500/15', border: 'border-green-500/30' },
      assigned: { color: COLORS.orange, label: 'Назначена', icon: '👤', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      in_progress: { color: COLORS.indigo, label: 'В работе', icon: '⚙️', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' },
      rejected: { color: COLORS.rose, label: 'Отклонена', icon: '❌', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
      education: { color: COLORS.blue, label: 'Образование', icon: '🎓', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      healthcare: { color: COLORS.rose, label: 'Здравоохранение', icon: '🏥', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
      utilities: { color: COLORS.orange, label: 'Коммунальные услуги', icon: '🏠', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      transport: { color: COLORS.indigo, label: 'Транспорт', icon: '🚗', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' },
      culture: { color: COLORS.purple, label: 'Культура', icon: '🎭', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
      sports: { color: COLORS.emerald, label: 'Спорт', icon: '⚽', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      other: { color: COLORS.slate, label: 'Другое', icon: '📦', bg: 'bg-slate-500/15', border: 'border-slate-500/30' },
      low: { color: COLORS.success, label: 'Низкий', icon: '🔵', bg: 'bg-green-500/15', border: 'border-green-500/30' },
      medium: { color: COLORS.warning, label: 'Средний', icon: '🟡', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' },
      high: { color: COLORS.orange, label: 'Высокий', icon: '🟠', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      emergency: { color: COLORS.rose, label: 'Экстренный', icon: '🔴', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
      male: { color: COLORS.blue, label: 'Мужской', icon: '♂', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      female: { color: COLORS.pink, label: 'Женский', icon: '♀', bg: 'bg-pink-500/15', border: 'border-pink-500/30' }
    };

    return baseConfig[status as keyof typeof baseConfig] || { 
      color: COLORS.slate, 
      label: status, 
      icon: '❓',
      bg: 'bg-slate-500/15', 
      border: 'border-slate-500/30' 
    };
  };

  const config = getStatusConfig();
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <motion.span 
      className={`inline-flex items-center rounded-full font-medium border backdrop-blur-sm ${config.bg} ${config.border} ${sizeClasses[size]}`}
      style={{ color: `rgb(${config.color})` }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="mr-1.5">{config.icon}</span>
      {animated && (
        <motion.div 
          className="w-1.5 h-1.5 rounded-full mr-1.5"
          style={{ backgroundColor: `rgb(${config.color})` }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {config.label}
    </motion.span>
  );
};

// Улучшенный ProgressBar
const ProgressBar = ({ 
  value, 
  max = 100, 
  color = COLORS.teal, 
  label, 
  showValue = true, 
  size = 'md',
  showAnimation = true 
}: { 
  value: number; 
  max?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm text-slate-300 mb-2">
          <span>{label}</span>
          {showValue && (
            <span className="font-semibold" style={{ color: `rgb(${color})` }}>
              {percentage.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-700/50 rounded-full ${height} overflow-hidden`}>
        <motion.div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${height}`}
          initial={showAnimation ? { width: 0 } : false}
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

// Улучшенный StatCard
const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = COLORS.teal, 
  subtitle, 
  onClick, 
  trend,
  animationDelay = 0 
}: {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color?: string;
  subtitle?: string;
  onClick?: () => void;
  trend?: 'up' | 'down' | 'neutral';
  animationDelay?: number;
}) => {
  const trendConfig = trend || (change !== undefined ? (change >= 0 ? 'up' : 'down') : 'neutral');
  
  return (
    <BentoCard 
      className="p-6" 
      glowColor={color} 
      onClick={onClick}
      padding="p-6"
      animationDelay={animationDelay}
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div 
          className="text-3xl p-3 rounded-2xl bg-white/5 backdrop-blur-sm"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {icon}
        </motion.div>
        {trendConfig !== 'neutral' && (
          <motion.div 
            className={`text-sm font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${
              trendConfig === 'up' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: animationDelay * 0.1 + 0.2 }}
          >
            {trendConfig === 'up' ? '↗' : '↘'} {change !== undefined ? `${Math.abs(change)}%` : ''}
          </motion.div>
        )}
      </div>
      <motion.div 
        className="text-2xl lg:text-3xl font-bold text-white mb-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: animationDelay * 0.1 + 0.1 }}
      >
        {value}
      </motion.div>
      <div className="text-slate-300 text-sm font-medium">{title}</div>
      {subtitle && <div className="text-slate-400 text-xs mt-1">{subtitle}</div>}
    </BentoCard>
  );
};

// Улучшенный CitizenCard
const CitizenCard = ({ citizen, onClick, animationDelay = 0 }: { 
  citizen: ServiceCitizen; 
  onClick?: () => void;
  animationDelay?: number;
}) => {
  const age = calculateAge(citizen.personalInfo.birthDate);
  const lastActivity = citizen.lastActivity ? getTimeAgo(citizen.lastActivity) : 'Неизвестно';
  
  const getCitizenColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'inactive': return COLORS.slate;
      case 'suspended': return COLORS.warning;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard 
      className="p-5" 
      glowColor={getCitizenColor(citizen.status)} 
      onClick={onClick}
      animationDelay={animationDelay}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <motion.div 
            className="text-2xl p-2 rounded-xl bg-white/5 backdrop-blur-sm flex-shrink-0"
            whileHover={{ scale: 1.1 }}
          >
            {citizen.personalInfo.avatar || '👤'}
          </motion.div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{citizen.personalInfo.fullName}</h4>
            <p className="text-slate-400 text-sm">
              {age} лет • {citizen.serviceInfo.category}
            </p>
            <p className="text-slate-500 text-xs mt-1">Активность: {lastActivity}</p>
          </div>
        </div>
        <StatusBadge status={citizen.status} type="citizen" animated={citizen.status === 'active'} size="sm" />
      </div>
      
      <div className="space-y-3 text-sm mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Телефон:</span>
          <span className="text-white font-medium">{citizen.personalInfo.phone}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Услуга:</span>
          <span className="text-white font-medium text-right line-clamp-1">{citizen.serviceInfo.serviceType}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Провайдер:</span>
          <span className="text-white font-medium text-right line-clamp-1">{citizen.serviceInfo.provider}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <div className="flex items-center space-x-2">
          <StatusBadge status={citizen.serviceInfo.category} size="sm" />
          {citizen.rating && (
            <div className="flex items-center space-x-1 text-amber-400">
              <span>⭐</span>
              <span className="text-xs font-medium">{citizen.rating}</span>
            </div>
          )}
        </div>
        <div className="text-xs text-slate-400">
          {citizen.assignedManager ? 'С менеджером' : 'Без менеджера'}
        </div>
      </div>
    </BentoCard>
  );
};

// Улучшенный ProviderCard
const ProviderCard = ({ provider, onClick, animationDelay = 0 }: { 
  provider: ServiceProvider; 
  onClick?: () => void;
  animationDelay?: number;
}) => {
  const activeClients = provider.assignedClients.length;
  const lastActive = getTimeAgo(provider.lastActive);
  
  return (
    <BentoCard 
      className="p-5" 
      glowColor={COLORS.blue} 
      onClick={onClick}
      animationDelay={animationDelay}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <motion.div 
            className="text-2xl p-2 rounded-xl bg-white/5 backdrop-blur-sm flex-shrink-0"
            whileHover={{ scale: 1.1 }}
          >
            {provider.personalInfo.avatar || '👨‍💼'}
          </motion.div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-base mb-1">{provider.personalInfo.fullName}</h4>
            <p className="text-slate-400 text-sm line-clamp-1">{provider.personalInfo.position}</p>
            <p className="text-slate-500 text-xs mt-1">Был(а): {lastActive}</p>
          </div>
        </div>
        <StatusBadge status={provider.status} type="provider" animated={provider.status === 'active'} size="sm" />
      </div>
      
      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Телефон:</span>
          <span className="text-white font-medium">{provider.personalInfo.phone}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Клиенты:</span>
          <span className="text-white font-medium">{activeClients} человек</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">График:</span>
          <span className="text-white font-medium text-right">{provider.schedule.days.join(', ')}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <ProgressBar 
          value={provider.metrics.clientSatisfaction} 
          label="Удовлетворенность" 
          color={COLORS.emerald}
          size="sm"
        />
        <ProgressBar 
          value={provider.metrics.onTimeService} 
          label="Своевременность" 
          color={COLORS.blue}
          size="sm"
        />
      </div>
    </BentoCard>
  );
};

// Улучшенный RequestCard
const RequestCard = ({ request, onClick, animationDelay = 0 }: { 
  request: ServiceRequest; 
  onClick?: () => void;
  animationDelay?: number;
}) => {
  const citizen = serviceCitizens.find(c => c.id === request.citizenId);
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return COLORS.success;
      case 'medium': return COLORS.warning;
      case 'high': return COLORS.orange;
      case 'emergency': return COLORS.rose;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard 
      className="p-4" 
      glowColor={getUrgencyColor(request.urgency)} 
      onClick={onClick}
      animationDelay={animationDelay}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <h5 className="text-white font-semibold text-sm mb-1 line-clamp-2">{request.description}</h5>
          <p className="text-slate-400 text-xs">{citizen?.personalInfo.fullName}</p>
        </div>
        <StatusBadge status={request.status} type="request" animated={request.status === 'submitted'} size="sm" />
      </div>
      
      <div className="space-y-2 text-xs mb-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Тип услуги:</span>
          <span className="text-white capitalize">{request.serviceType.replace('_', ' ')}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Срочность:</span>
          <StatusBadge status={request.urgency} size="sm" />
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Приоритет:</span>
          <div className="flex items-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  i < request.priority 
                    ? 'bg-amber-400' 
                    : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Подана:</span>
          <span className="text-white">{new Date(request.timeline.submitted).toLocaleDateString('ru-RU')}</span>
        </div>
      </div>
      
      {request.assignedProvider && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <span className="text-xs text-slate-400">Назначен:</span>
          <span className="text-xs text-white font-medium">
            {serviceProviders.find(w => w.id === request.assignedProvider)?.personalInfo.fullName}
          </span>
        </div>
      )}
    </BentoCard>
  );
};

// Новый компонент для графика удовлетворенности
const SatisfactionChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.label} className="flex items-center justify-between">
          <span className="text-slate-300 text-sm flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: `rgb(${item.color})` }}
            />
            <span>{item.label}</span>
          </span>
          <div className="flex items-center space-x-2">
            <ProgressBar 
              value={item.value} 
              size="sm" 
              showValue={false}
              color={item.color}
              showAnimation={true}
            />
            <span className="text-white font-medium text-sm w-10 text-right">{item.value}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Основной компонент дашборда
const ServiceCitizenDashboard = () => {
  const [selectedCitizen, setSelectedCitizen] = useState<ServiceCitizen | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'citizens' | 'providers' | 'requests'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const currentTime = useClientTime();
  
  // Статистика для дашборда
  const stats = useMemo(() => {
    const totalCitizens = serviceCitizens.length;
    const activeCitizens = serviceCitizens.filter(c => c.status === 'active').length;
    const totalProviders = serviceProviders.length;
    const activeProviders = serviceProviders.filter(w => w.status === 'active').length;
    const pendingRequests = serviceRequests.filter(r => r.status === 'submitted' || r.status === 'reviewed').length;
    const totalRating = serviceCitizens.reduce((acc, citizen) => acc + citizen.rating, 0) / serviceCitizens.length;
    
    return {
      totalCitizens,
      activeCitizens,
      totalProviders,
      activeProviders,
      pendingRequests,
      averageRating: totalRating.toFixed(1)
    };
  }, []);

  // Фильтрация данных
  const filteredCitizens = useMemo(() => {
    return serviceCitizens.filter(citizen => {
      const matchesSearch = citizen.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          citizen.personalInfo.phone.includes(searchTerm) ||
                          citizen.serviceInfo.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || citizen.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const filteredProviders = useMemo(() => {
    return serviceProviders.filter(provider => {
      return provider.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             provider.personalInfo.position.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  const filteredRequests = useMemo(() => {
    return serviceRequests.filter(request => {
      const citizen = serviceCitizens.find(c => c.id === request.citizenId);
      return citizen?.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             request.description.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  const activeCitizens = useMemo(() => 
    serviceCitizens.filter(citizen => citizen.status === 'active'), 
  []);
  
  const pendingRequests = useMemo(() => 
    serviceRequests.filter(request => request.status === 'submitted' || request.status === 'reviewed'), 
  []);

  // Данные для графика удовлетворенности
  const satisfactionData = [
    { label: 'Образование', value: 94, color: COLORS.blue },
    { label: 'Здравоохранение', value: 89, color: COLORS.rose },
    { label: 'Спорт', value: 92, color: COLORS.emerald },
    { label: 'Культура', value: 87, color: COLORS.purple },
    { label: 'Общее', value: 91, color: COLORS.orange }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-4 lg:p-6">
      {/* Хедер */}
      <motion.header 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
              Граждане сферы услуг
            </h1>
            <p className="text-slate-400 text-lg">Управление получателями государственных и муниципальных услуг</p>
          </div>
          <div className="mt-4 lg:mt-0 text-right">
            <div className="text-2xl lg:text-3xl font-mono font-bold text-white mb-1">
              {currentTime}
            </div>
            <div className="text-slate-400 text-sm">
              {new Date().toLocaleDateString('ru-RU', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Поиск и фильтры */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск по имени, телефону или услуге..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition-all duration-300 backdrop-blur-xl"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                🔍
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition-all duration-300 backdrop-blur-xl"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
              <option value="suspended">Приостановленные</option>
            </select>
          </div>
        </div>

        {/* Навигация */}
        <nav className="flex space-x-1 p-1 bg-slate-800/50 rounded-2xl backdrop-blur-xl border border-slate-700/50">
          {[
            { id: 'overview', label: 'Обзор', icon: '📊' },
            { id: 'citizens', label: 'Граждане', icon: '👥' },
            { id: 'providers', label: 'Менеджеры', icon: '👨‍💼' },
            { id: 'requests', label: 'Заявки', icon: '📋' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white shadow-lg shadow-black/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </nav>
      </motion.header>

      {/* Основной контент */}
      <main>
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Статистика */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  title="Всего граждан"
                  value={stats.totalCitizens}
                  change={2.5}
                  icon="👥"
                  color={COLORS.blue}
                  subtitle={`${stats.activeCitizens} активных`}
                  trend="up"
                  animationDelay={0}
                />
                <StatCard
                  title="Менеджеры"
                  value={stats.totalProviders}
                  change={0}
                  icon="👨‍💼"
                  color={COLORS.teal}
                  subtitle={`${stats.activeProviders} на смене`}
                  trend="neutral"
                  animationDelay={1}
                />
                <StatCard
                  title="Средний рейтинг"
                  value={stats.averageRating}
                  change={0.2}
                  icon="⭐"
                  color={COLORS.amber}
                  subtitle="удовлетворенность"
                  trend="up"
                  animationDelay={2}
                />
                <StatCard
                  title="Ожидающие заявки"
                  value={stats.pendingRequests}
                  change={-1.8}
                  icon="📋"
                  color={COLORS.orange}
                  subtitle="требуют внимания"
                  trend="down"
                  animationDelay={3}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Последние граждане */}
                <div className="lg:col-span-2">
                  <BentoCard className="p-6" glowColor={COLORS.purple}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Недавние граждане</h3>
                      <button 
                        className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-300"
                        onClick={() => setActiveTab('citizens')}
                      >
                        Все →
                      </button>
                    </div>
                    <div className="space-y-4">
                      {activeCitizens.slice(0, 4).map((citizen, index) => (
                        <motion.div 
                          key={citizen.id}
                          className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                          onClick={() => setSelectedCitizen(citizen)}
                          whileHover={{ x: 4 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="text-2xl p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
                            {citizen.personalInfo.avatar || '👤'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm truncate">{citizen.personalInfo.fullName}</h4>
                            <p className="text-slate-400 text-xs">
                              {calculateAge(citizen.personalInfo.birthDate)} лет • {citizen.serviceInfo.serviceType}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <StatusBadge status={citizen.status} type="citizen" size="sm" />
                            {citizen.rating && (
                              <div className="flex items-center space-x-1 text-amber-400">
                                <span className="text-xs">⭐</span>
                                <span className="text-xs font-medium">{citizen.rating}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </BentoCard>
                </div>

                {/* Удовлетворенность */}
                <BentoCard className="p-6" glowColor={COLORS.emerald}>
                  <h3 className="text-xl font-bold text-white mb-6">Удовлетворенность услугами</h3>
                  <SatisfactionChart data={satisfactionData} />
                  <div className="mt-6 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Общий показатель:</span>
                      <span className="text-white font-bold text-lg">91%</span>
                    </div>
                  </div>
                </BentoCard>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Активные заявки */}
                <BentoCard className="p-6" glowColor={COLORS.orange}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Активные заявки</h3>
                    <button 
                      className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-300"
                      onClick={() => setActiveTab('requests')}
                    >
                      Все →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {pendingRequests.slice(0, 3).map((request, index) => (
                      <motion.div 
                        key={request.id}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                        onClick={() => setSelectedRequest(request)}
                        whileHover={{ x: 4 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={`text-lg p-2 rounded-xl flex items-center justify-center ${
                          request.urgency === 'emergency' ? 'bg-rose-500/20 text-rose-300' :
                          request.urgency === 'high' ? 'bg-orange-500/20 text-orange-300' :
                          'bg-slate-500/20 text-slate-300'
                        }`}>
                          {request.serviceType[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm line-clamp-2">{request.description}</h4>
                          <p className="text-slate-400 text-xs">
                            {serviceCitizens.find(c => c.id === request.citizenId)?.personalInfo.fullName}
                          </p>
                        </div>
                        <StatusBadge status={request.status} type="request" size="sm" />
                      </motion.div>
                    ))}
                  </div>
                </BentoCard>

                {/* Карты менеджеров */}
                <BentoCard className="p-6" glowColor={COLORS.blue}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Команда менеджеров</h3>
                    <button 
                      className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-300"
                      onClick={() => setActiveTab('providers')}
                    >
                      Все →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {serviceProviders.slice(0, 3).map((provider, index) => (
                      <motion.div 
                        key={provider.id}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                        onClick={() => setSelectedProvider(provider)}
                        whileHover={{ x: 4 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="text-xl p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
                          {provider.personalInfo.avatar || '👨‍💼'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm">{provider.personalInfo.fullName}</h4>
                          <p className="text-slate-400 text-xs">{provider.personalInfo.position}</p>
                          <p className="text-slate-500 text-xs mt-1">{provider.assignedClients.length} клиентов</p>
                        </div>
                        <StatusBadge status={provider.status} type="provider" size="sm" />
                      </motion.div>
                    ))}
                  </div>
                </BentoCard>
              </div>
            </motion.div>
          )}

          {activeTab === 'citizens' && (
            <motion.div
              key="citizens"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Граждане</h2>
                    <p className="text-slate-400">Управление получателями государственных и муниципальных услуг</p>
                  </div>
                  <div className="mt-4 lg:mt-0 text-slate-400">
                    Показано: {filteredCitizens.length} из {serviceCitizens.length}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCitizens.map((citizen, index) => (
                  <CitizenCard 
                    key={citizen.id} 
                    citizen={citizen} 
                    onClick={() => setSelectedCitizen(citizen)}
                    animationDelay={index}
                  />
                ))}
              </div>

              {filteredCitizens.length === 0 && (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Ничего не найдено</h3>
                  <p className="text-slate-400">Попробуйте изменить параметры поиска</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'providers' && (
            <motion.div
              key="providers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Менеджеры услуг</h2>
                    <p className="text-slate-400">Команда специалистов по работе с гражданами</p>
                  </div>
                  <div className="mt-4 lg:mt-0 text-slate-400">
                    Показано: {filteredProviders.length} из {serviceProviders.length}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProviders.map((provider, index) => (
                  <ProviderCard 
                    key={provider.id} 
                    provider={provider} 
                    onClick={() => setSelectedProvider(provider)}
                    animationDelay={index}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'requests' && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Заявки на услуги</h2>
                    <p className="text-slate-400">Управление запросами на получение услуг</p>
                  </div>
                  <div className="mt-4 lg:mt-0 text-slate-400">
                    Показано: {filteredRequests.length} из {serviceRequests.length}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRequests.map((request, index) => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    onClick={() => setSelectedRequest(request)}
                    animationDelay={index}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Модальные окна */}
      <Modal 
        isOpen={!!selectedCitizen} 
        onClose={() => setSelectedCitizen(null)}
        title={selectedCitizen?.personalInfo.fullName}
        size="xl"
      >
        {selectedCitizen && (
          <div className="space-y-6">
            {/* Заголовок с основной информацией */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-4xl p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
                {selectedCitizen.personalInfo.avatar || '👤'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedCitizen.personalInfo.fullName}</h3>
                <p className="text-slate-400">
                  {calculateAge(selectedCitizen.personalInfo.birthDate)} лет • 
                  <StatusBadge status={selectedCitizen.personalInfo.gender} size="sm" className="ml-2" />
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <StatusBadge status={selectedCitizen.status} type="citizen" animated={true} />
                  {selectedCitizen.rating && (
                    <div className="flex items-center space-x-2 text-amber-400">
                      <span className="text-lg">⭐</span>
                      <span className="font-semibold">{selectedCitizen.rating}</span>
                      <span className="text-slate-400 text-sm">рейтинг</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Персональная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дата рождения:</span>
                    <span className="text-white">{formatDate(selectedCitizen.personalInfo.birthDate)} ({calculateAge(selectedCitizen.personalInfo.birthDate)} лет)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Телефон:</span>
                    <span className="text-white">{selectedCitizen.personalInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white">{selectedCitizen.personalInfo.email || 'Не указан'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Адрес:</span>
                    <span className="text-white text-right">{selectedCitizen.personalInfo.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Паспорт:</span>
                    <span className="text-white">{selectedCitizen.personalInfo.passport}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">СНИЛС:</span>
                    <span className="text-white">{selectedCitizen.personalInfo.snils}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Информация об услуге</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Категория:</span>
                    <StatusBadge status={selectedCitizen.serviceInfo.category} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип услуги:</span>
                    <span className="text-white text-right">{selectedCitizen.serviceInfo.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Провайдер:</span>
                    <span className="text-white text-right">{selectedCitizen.serviceInfo.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Рег. номер:</span>
                    <span className="text-white">{selectedCitizen.serviceInfo.registrationNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус услуги:</span>
                    <StatusBadge status={selectedCitizen.serviceInfo.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Начало услуги:</span>
                    <span className="text-white">{formatDate(selectedCitizen.serviceInfo.startDate)}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.teal}>
                <h4 className="text-lg font-semibold text-white mb-4">Предпочтения</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Связь:</span>
                    <span className="text-white capitalize">{selectedCitizen.preferences.communication.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Время визитов:</span>
                    <span className="text-white">{selectedCitizen.preferences.visitTime.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Язык:</span>
                    <span className="text-white">{selectedCitizen.preferences.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Уведомления:</span>
                    <StatusBadge status={selectedCitizen.preferences.notifications ? 'active' : 'inactive'} size="sm" />
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400">Особые требования:</span>
                    <div className="text-right">
                      {selectedCitizen.preferences.specialRequirements.map((requirement, index) => (
                        <div key={index} className="text-white text-xs bg-white/10 rounded-full px-2 py-1 mb-1">
                          {requirement}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.orange}>
                <h4 className="text-lg font-semibold text-white mb-4">Документы</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Заявление:</span>
                    <span className="text-white">{selectedCitizen.documents.application}</span>
                  </div>
                  {selectedCitizen.documents.contract && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Договор:</span>
                      <span className="text-white">{selectedCitizen.documents.contract}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400">Сертификаты:</span>
                    <div className="text-right">
                      {selectedCitizen.documents.certificates.map((cert, index) => (
                        <div key={index} className="text-white text-xs bg-white/10 rounded-full px-2 py-1 mb-1">
                          {cert}
                        </div>
                      ))}
                    </div>
                  </div>
                  {selectedCitizen.documents.attachments.length > 0 && (
                    <div className="flex justify-between items-start">
                      <span className="text-slate-400">Дополнительно:</span>
                      <div className="text-right">
                        {selectedCitizen.documents.attachments.map((attachment, index) => (
                          <div key={index} className="text-white text-xs bg-white/10 rounded-full px-2 py-1 mb-1">
                            {attachment}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </BentoCard>
            </div>

            {/* История услуг */}
            {selectedCitizen.serviceHistory.length > 0 && (
              <BentoCard className="p-6" glowColor={COLORS.violet}>
                <h4 className="text-lg font-semibold text-white mb-4">История услуг</h4>
                <div className="space-y-3">
                  {selectedCitizen.serviceHistory.map((history, index) => (
                    <div key={history.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg">{history.status === 'completed' ? '✅' : '❌'}</div>
                        <div>
                          <h5 className="text-white font-medium text-sm">{history.serviceType}</h5>
                          <p className="text-slate-400 text-xs">{history.provider}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-sm">{formatDate(history.date)}</div>
                        {history.rating && (
                          <div className="flex items-center space-x-1 text-amber-400 text-xs">
                            <span>⭐</span>
                            <span>{history.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </BentoCard>
            )}

            {selectedCitizen.notes && (
              <BentoCard className="p-6" glowColor={COLORS.rose}>
                <h4 className="text-lg font-semibold text-white mb-4">Примечания</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedCitizen.notes}</p>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!selectedProvider} 
        onClose={() => setSelectedProvider(null)}
        title={selectedProvider?.personalInfo.fullName}
        size="lg"
      >
        {selectedProvider && (
          <div className="space-y-6">
            {/* Заголовок */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-4xl p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
                {selectedProvider.personalInfo.avatar || '👨‍💼'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedProvider.personalInfo.fullName}</h3>
                <p className="text-slate-400">{selectedProvider.personalInfo.position}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <StatusBadge status={selectedProvider.status} type="provider" animated={true} />
                  <span className="text-slate-400 text-sm">Был(а) онлайн: {getTimeAgo(selectedProvider.lastActive)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Контактная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Телефон:</span>
                    <span className="text-white">{selectedProvider.personalInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white">{selectedProvider.personalInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Должность:</span>
                    <span className="text-white text-right">{selectedProvider.personalInfo.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Отдел:</span>
                    <span className="text-white text-right">{selectedProvider.personalInfo.department}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Расписание и специализация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Рабочие дни:</span>
                    <span className="text-white">{selectedProvider.schedule.days.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Часы работы:</span>
                    <span className="text-white">{selectedProvider.schedule.hours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Часовой пояс:</span>
                    <span className="text-white">{selectedProvider.schedule.timezone}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400">Специализация:</span>
                    <div className="text-right">
                      {selectedProvider.specialization.map((spec, index) => (
                        <div key={index} className="text-white text-xs bg-white/10 rounded-full px-2 py-1 mb-1">
                          {spec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </BentoCard>
            </div>

            <BentoCard className="p-6" glowColor={COLORS.teal}>
              <h4 className="text-lg font-semibold text-white mb-4">Показатели эффективности</h4>
              <div className="space-y-4">
                <ProgressBar 
                  value={selectedProvider.metrics.clientSatisfaction} 
                  label="Удовлетворенность клиентов" 
                  color={COLORS.emerald}
                  showValue={true}
                />
                <ProgressBar 
                  value={selectedProvider.metrics.onTimeService} 
                  label="Своевременность услуг" 
                  color={COLORS.blue}
                  showValue={true}
                />
                <ProgressBar 
                  value={selectedProvider.metrics.responseTime} 
                  label="Время ответа (мин)" 
                  color={COLORS.orange}
                  showValue={true}
                  max={60}
                />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400">Завершено услуг:</span>
                  <span className="text-white font-semibold">{selectedProvider.metrics.completedServices}</span>
                </div>
              </div>
            </BentoCard>

            {/* Навыки и языки */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.orange}>
                <h4 className="text-lg font-semibold text-white mb-4">Навыки</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.skills.map((skill, index) => (
                    <span key={index} className="text-xs bg-white/10 text-white rounded-full px-3 py-1.5">
                      {skill}
                    </span>
                  ))}
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.violet}>
                <h4 className="text-lg font-semibold text-white mb-4">Языки</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.languages.map((language, index) => (
                    <span key={index} className="text-xs bg-white/10 text-white rounded-full px-3 py-1.5">
                      {language}
                    </span>
                  ))}
                </div>
              </BentoCard>
            </div>

            {selectedProvider.assignedClients.length > 0 && (
              <BentoCard className="p-6" glowColor={COLORS.rose}>
                <h4 className="text-lg font-semibold text-white mb-4">Назначенные клиенты</h4>
                <div className="space-y-3">
                  {selectedProvider.assignedClients.map((clientId) => {
                    const client = serviceCitizens.find(c => c.id === clientId);
                    return client ? (
                      <div key={clientId} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div className="flex items-center space-x-3">
                          <div className="text-lg">{client.personalInfo.avatar || '👤'}</div>
                          <div>
                            <h5 className="text-white font-medium text-sm">{client.personalInfo.fullName}</h5>
                            <p className="text-slate-400 text-xs">{client.serviceInfo.serviceType}</p>
                          </div>
                        </div>
                        <StatusBadge status={client.status} type="citizen" size="sm" />
                      </div>
                    ) : null;
                  })}
                </div>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!selectedRequest} 
        onClose={() => setSelectedRequest(null)}
        title="Заявка на услугу"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-6">
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedRequest.description}</h3>
                <p className="text-slate-400">
                  Заявитель: {serviceCitizens.find(c => c.id === selectedRequest.citizenId)?.personalInfo.fullName}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <StatusBadge status={selectedRequest.status} type="request" animated={true} />
                <StatusBadge status={selectedRequest.urgency} size="sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Информация о заявке</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип услуги:</span>
                    <span className="text-white capitalize">{selectedRequest.serviceType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedRequest.status} type="request" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Срочность:</span>
                    <StatusBadge status={selectedRequest.urgency} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Приоритет:</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < selectedRequest.priority 
                              ? 'bg-amber-400' 
                              : 'bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Заявитель:</span>
                    <span className="text-white text-right">
                      {serviceCitizens.find(c => c.id === selectedRequest.citizenId)?.personalInfo.fullName}
                    </span>
                  </div>
                  {selectedRequest.estimatedDuration && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Оценка длительности:</span>
                      <span className="text-white">{selectedRequest.estimatedDuration}</span>
                    </div>
                  )}
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Таймлайн</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Подана:</span>
                    <span className="text-white">{formatDateTime(selectedRequest.timeline.submitted)}</span>
                  </div>
                  {selectedRequest.timeline.reviewed && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Рассмотрена:</span>
                      <span className="text-white">{formatDateTime(selectedRequest.timeline.reviewed)}</span>
                    </div>
                  )}
                  {selectedRequest.timeline.approved && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Одобрена:</span>
                      <span className="text-white">{formatDateTime(selectedRequest.timeline.approved)}</span>
                    </div>
                  )}
                  {selectedRequest.timeline.assigned && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Назначена:</span>
                      <span className="text-white">{formatDateTime(selectedRequest.timeline.assigned)}</span>
                    </div>
                  )}
                  {selectedRequest.timeline.started && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Начата:</span>
                      <span className="text-white">{formatDateTime(selectedRequest.timeline.started)}</span>
                    </div>
                  )}
                  {selectedRequest.timeline.completed && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Завершена:</span>
                      <span className="text-white">{formatDateTime(selectedRequest.timeline.completed)}</span>
                    </div>
                  )}
                </div>
              </BentoCard>
            </div>

            <BentoCard className="p-6" glowColor={COLORS.teal}>
              <h4 className="text-lg font-semibold text-white mb-4">Описание заявки</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                {selectedRequest.detailedDescription || selectedRequest.description}
              </p>
            </BentoCard>

            {selectedRequest.assignedProvider && (
              <BentoCard className="p-6" glowColor={COLORS.orange}>
                <h4 className="text-lg font-semibold text-white mb-4">Ответственный менеджер</h4>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl p-3 rounded-2xl bg-white/5 backdrop-blur-sm">
                    {serviceProviders.find(w => w.id === selectedRequest.assignedProvider)?.personalInfo.avatar || '👨‍💼'}
                  </div>
                  <div>
                    <h5 className="text-white font-semibold text-lg">
                      {serviceProviders.find(w => w.id === selectedRequest.assignedProvider)?.personalInfo.fullName}
                    </h5>
                    <p className="text-slate-400">
                      {serviceProviders.find(w => w.id === selectedRequest.assignedProvider)?.personalInfo.position}
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      {serviceProviders.find(w => w.id === selectedRequest.assignedProvider)?.personalInfo.department}
                    </p>
                  </div>
                </div>
              </BentoCard>
            )}

            {selectedRequest.notes && (
              <BentoCard className="p-6" glowColor={COLORS.rose}>
                <h4 className="text-lg font-semibold text-white mb-4">Примечания</h4>
                <p className="text-slate-300 text-sm">{selectedRequest.notes}</p>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ServiceCitizenDashboard;