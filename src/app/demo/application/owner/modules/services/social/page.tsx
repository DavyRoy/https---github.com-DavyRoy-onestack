'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Типы данных для социальных услуг
interface SocialService {
  id: string;
  name: string;
  category: 'elderly' | 'disability' | 'family' | 'children' | 'emergency' | 'psychological' | 'legal' | 'rehabilitation';
  description: string;
  status: 'active' | 'development' | 'paused' | 'closed';
  targetAudience: string[];
  duration: number;
  price: {
    amount: number;
    currency: 'RUB' | 'USD' | 'EUR';
    stateCovered: boolean;
    coveragePercentage?: number;
  };
  requirements: string[];
  preparations?: string[];
  risks?: string[];
  successRate: number;
  availability: {
    days: string[];
    hours: string;
    emergency: boolean;
  };
  equipment: string[];
  staffRequired: string[];
  metrics: {
    satisfaction: number;
    effectiveness: number;
    waitingTime: number;
  };
  location: string;
  capacity: number;
  currentParticipants: number;
  tags?: string[];
  featured?: boolean;
}

interface Client {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  contact: {
    phone: string;
    email?: string;
    address: string;
    emergencyContact?: string;
  };
  socialStatus: {
    category: 'pensioner' | 'disabled' | 'single_parent' | 'orphan' | 'low_income' | 'refugee' | 'veteran';
    documents: string[];
    benefits: string[];
  };
  medicalHistory: SocialRecord[];
  specialNeeds?: string[];
  chronicConditions?: string[];
  currentServices?: string[];
  status: 'active' | 'waiting' | 'paused' | 'completed';
  lastVisit?: string;
  nextAppointment?: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

interface SocialRecord {
  id: string;
  date: string;
  serviceId: string;
  description: string;
  symptoms: string[];
  support: string;
  prescribedServices?: ServicePlan[];
  socialWorker: string;
  notes?: string;
  followUp?: string;
  status: 'completed' | 'scheduled' | 'cancelled';
}

interface ServicePlan {
  name: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

interface SocialWorker {
  id: string;
  name: string;
  specialization: string[];
  qualifications: string[];
  experience: number;
  license: string;
  contact: {
    phone: string;
    email: string;
  };
  schedule: {
    days: string[];
    hours: string;
  };
  status: 'active' | 'vacation' | 'sick' | 'off';
  currentClients: string[];
  maxClients: number;
  rating: number;
  languages: string[];
  procedures: string[];
  department?: string;
  skills?: string[];
}

interface Appointment {
  id: string;
  clientId: string;
  workerId: string;
  serviceId: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  reason: string;
  notes?: string;
  location?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface Equipment {
  id: string;
  name: string;
  type: 'mobility' | 'therapy' | 'communication' | 'daily_living' | 'safety';
  manufacturer: string;
  model: string;
  status: 'operational' | 'maintenance' | 'out_of_service' | 'calibration';
  lastMaintenance: string;
  nextMaintenance: string;
  location: string;
  utilization: number;
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
  warrantyExpiry?: string;
}

// Расширенные моки данных для социальных услуг
const socialServices: SocialService[] = [
  {
    id: 'ss-001',
    name: 'Социальное сопровождение пожилых',
    category: 'elderly',
    description: 'Комплексная поддержка пожилых людей на дому: помощь в быту, сопровождение, психологическая поддержка, медицинское наблюдение. Индивидуальный подход к каждому клиенту с учетом возрастных особенностей и потребностей.',
    status: 'active',
    targetAudience: ['Пенсионеры', 'Люди с ограниченной мобильностью', 'Пожилые люди старше 65 лет'],
    duration: 180,
    price: {
      amount: 0,
      currency: 'RUB',
      stateCovered: true,
      coveragePercentage: 100
    },
    requirements: ['Паспорт', 'Пенсионное удостоверение', 'Медицинская справка'],
    preparations: ['Предварительная консультация', 'Оценка потребностей', 'Разработка индивидуального плана'],
    risks: ['Эмоциональное выгорание персонала', 'Сложности с транспортировкой', 'Изменение состояния здоровья клиента'],
    successRate: 95,
    availability: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      hours: '08:00-20:00',
      emergency: true
    },
    equipment: ['Ходунки', 'Инвалидные коляски', 'Средства гигиены', 'Медицинские кровати', 'Тонометры'],
    staffRequired: ['Социальный работник', 'Психолог', 'Медсестра', 'Сиделка'],
    metrics: {
      satisfaction: 94,
      effectiveness: 92,
      waitingTime: 3
    },
    location: 'На дому',
    capacity: 50,
    currentParticipants: 42,
    tags: ['популярная', 'госфинансирование', 'домашняя', 'пожилые'],
    featured: true
  },
  {
    id: 'ss-002',
    name: 'Психологическая поддержка семей',
    category: 'family',
    description: 'Консультации психолога для семей в трудной жизненной ситуации, разрешение конфликтов, поддержка детско-родительских отношений. Групповые и индивидуальные сессии с использованием современных методик психотерапии.',
    status: 'active',
    targetAudience: ['Семьи с детьми', 'Многодетные семьи', 'Неполные семьи', 'Семьи в кризисной ситуации'],
    duration: 60,
    price: {
      amount: 0,
      currency: 'RUB',
      stateCovered: true
    },
    requirements: ['Паспорт', 'Заявление'],
    preparations: ['Первичная диагностика', 'Анкетирование'],
    risks: ['Сопротивление изменениям', 'Низкая мотивация'],
    successRate: 88,
    availability: {
      days: ['Пн', 'Ср', 'Пт'],
      hours: '09:00-18:00',
      emergency: false
    },
    equipment: ['Кабинет психолога', 'Диагностические материалы', 'Игровые комнаты', 'Арт-терапевтические наборы'],
    staffRequired: ['Психолог', 'Семейный терапевт'],
    metrics: {
      satisfaction: 91,
      effectiveness: 85,
      waitingTime: 7
    },
    location: 'Центр социальной помощи',
    capacity: 30,
    currentParticipants: 25,
    tags: ['консультация', 'семейная', 'поддержка', 'психология'],
    featured: true
  },
  {
    id: 'ss-003',
    name: 'Юридические консультации',
    category: 'legal',
    description: 'Бесплатные юридические консультации по социальным вопросам, помощь в оформлении документов, защита прав граждан. Опытные юристы специализируются на социальном законодательстве.',
    status: 'active',
    targetAudience: ['Малоимущие', 'Пенсионеры', 'Инвалиды', 'Многодетные семьи'],
    duration: 45,
    price: {
      amount: 0,
      currency: 'RUB',
      stateCovered: true
    },
    requirements: ['Паспорт', 'Документы по вопросу'],
    preparations: ['Изучение документов', 'Консультация'],
    successRate: 92,
    availability: {
      days: ['Вт', 'Чт'],
      hours: '10:00-17:00',
      emergency: false
    },
    equipment: ['Компьютер', 'Принтер', 'Юридическая литература', 'Архив дел'],
    staffRequired: ['Юрист', 'Социальный работник'],
    metrics: {
      satisfaction: 89,
      effectiveness: 90,
      waitingTime: 5
    },
    location: 'Центр социальной помощи',
    capacity: 20,
    currentParticipants: 18,
    tags: ['юридическая', 'консультация', 'документы'],
    featured: false
  },
  {
    id: 'ss-004',
    name: 'Реабилитация людей с инвалидностью',
    category: 'rehabilitation',
    description: 'Комплексная реабилитация и адаптация людей с ограниченными возможностями здоровья. Современные методики физической, психологической и социальной реабилитации.',
    status: 'active',
    targetAudience: ['Инвалиды I, II, III групп', 'Дети-инвалиды', 'Люди с ОВЗ'],
    duration: 120,
    price: {
      amount: 0,
      currency: 'RUB',
      stateCovered: true,
      coveragePercentage: 100
    },
    requirements: ['Паспорт', 'Справка МСЭ', 'Направление врача'],
    preparations: ['Медицинское обследование', 'Разработка ИПР'],
    risks: ['Медленная динамика', 'Осложнения здоровья'],
    successRate: 87,
    availability: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      hours: '08:00-19:00',
      emergency: false
    },
    equipment: ['Тренажеры', 'Физиотерапевтическое оборудование', 'Средства реабилитации', 'Бассейн'],
    staffRequired: ['Реабилитолог', 'Физиотерапевт', 'Психолог', 'Инструктор ЛФК'],
    metrics: {
      satisfaction: 90,
      effectiveness: 84,
      waitingTime: 14
    },
    location: 'Реабилитационный центр',
    capacity: 40,
    currentParticipants: 35,
    tags: ['реабилитация', 'инвалидность', 'восстановление'],
    featured: true
  },
  {
    id: 'ss-005',
    name: 'Экстренная социальная помощь',
    category: 'emergency',
    description: 'Срочная помощь в кризисных ситуациях: продукты, одежда, временное жилье, психологическая поддержка. Круглосуточная служба быстрого реагирования.',
    status: 'active',
    targetAudience: ['Пострадавшие от ЧС', 'Бездомные', 'Жертвы насилия', 'Люди в сложной ситуации'],
    duration: 0,
    price: {
      amount: 0,
      currency: 'RUB',
      stateCovered: true
    },
    requirements: ['Экстренный случай'],
    preparations: ['Оценка ситуации', 'Мобилизация ресурсов'],
    risks: ['Ограниченность ресурсов', 'Сложные случаи'],
    successRate: 98,
    availability: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      hours: '24/7',
      emergency: true
    },
    equipment: ['Продуктовые наборы', 'Одежда', 'Средства гигиены', 'Аптечки'],
    staffRequired: ['Дежурный социальный работник', 'Психолог', 'Волонтеры'],
    metrics: {
      satisfaction: 95,
      effectiveness: 96,
      waitingTime: 0
    },
    location: 'Кризисный центр',
    capacity: 100,
    currentParticipants: 78,
    tags: ['экстренная', 'кризис', 'помощь'],
    featured: false
  },
  {
    id: 'ss-006',
    name: 'Поддержка детей-сирот',
    category: 'children',
    description: 'Социальная адаптация и поддержка детей-сирот и детей, оставшихся без попечения родителей. Комплексная программа развития, образования и социализации.',
    status: 'active',
    targetAudience: ['Дети-сироты', 'Дети без попечения родителей', 'Выпускники детских домов'],
    duration: 240,
    price: {
      amount: 0,
      currency: 'RUB',
      stateCovered: true
    },
    requirements: ['Документы опекуна', 'Свидетельство о рождении'],
    preparations: ['Диагностика', 'Разработка плана развития'],
    risks: ['Психологические травмы', 'Адаптационные сложности'],
    successRate: 85,
    availability: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      hours: '09:00-21:00',
      emergency: true
    },
    equipment: ['Развивающие материалы', 'Игровые комнаты', 'Учебные пособия', 'Спортивный инвентарь'],
    staffRequired: ['Педагог', 'Психолог', 'Социальный работник', 'Воспитатель'],
    metrics: {
      satisfaction: 88,
      effectiveness: 82,
      waitingTime: 10
    },
    location: 'Детский дом, Центр поддержки',
    capacity: 60,
    currentParticipants: 55,
    tags: ['дети', 'сироты', 'развитие'],
    featured: false
  },
  {
    id: 'ss-007',
    name: 'Трудоустройство инвалидов',
    category: 'disability',
    description: 'Помощь в поиске работы и адаптации на рабочем месте для людей с инвалидностью. Сотрудничество с работодателями, создание специальных рабочих мест.',
    status: 'development',
    targetAudience: ['Инвалиды трудоспособного возраста'],
    duration: 90,
    price: {
      amount: 0,
      currency: 'RUB',
      stateCovered: true
    },
    requirements: ['Паспорт', 'Справка МСЭ', 'Трудовая книжка'],
    preparations: ['Профориентация', 'Обучение'],
    risks: ['Ограниченность вакансий', 'Дискриминация'],
    successRate: 0,
    availability: {
      days: ['Пн', 'Ср'],
      hours: '10:00-16:00',
      emergency: false
    },
    equipment: ['Компьютеры', 'Офисная техника', 'Учебные материалы'],
    staffRequired: ['Специалист по трудоустройству', 'Психолог'],
    metrics: {
      satisfaction: 0,
      effectiveness: 0,
      waitingTime: 30
    },
    location: 'Центр занятости',
    capacity: 25,
    currentParticipants: 0,
    tags: ['трудоустройство', 'инвалидность', 'работа'],
    featured: false
  },
  {
    id: 'ss-008',
    name: 'Группы взаимопомощи',
    category: 'psychological',
    description: 'Регулярные встречи людей со схожими проблемами для психологической поддержки и обмена опытом. Профессиональное ведение групп опытными психологами.',
    status: 'active',
    targetAudience: ['Люди в сложной жизненной ситуации', 'Родственники больных', 'Люди с зависимостями'],
    duration: 120,
    price: {
      amount: 0,
      currency: 'RUB',
      stateCovered: true
    },
    requirements: ['Предварительная запись'],
    preparations: ['Собеседование', 'Определение в группу'],
    risks: ['Конфликты в группе', 'Нерегулярное посещение'],
    successRate: 91,
    availability: {
      days: ['Вт', 'Чт', 'Сб'],
      hours: '18:00-20:00',
      emergency: false
    },
    equipment: ['Конференц-зал', 'Чайная зона', 'Мультимедийное оборудование'],
    staffRequired: ['Ведущий группы', 'Психолог'],
    metrics: {
      satisfaction: 93,
      effectiveness: 88,
      waitingTime: 3
    },
    location: 'Центр социальной помощи',
    capacity: 15,
    currentParticipants: 12,
    tags: ['групповая', 'поддержка', 'психология'],
    featured: false
  }
];

const clients: Client[] = [
  {
    id: 'c-001',
    name: 'Иванова Мария Петровна',
    age: 78,
    gender: 'female',
    contact: {
      phone: '+7 (916) 123-45-67',
      email: 'm.ivanova@mail.ru',
      address: 'г. Москва, ул. Ленина, д. 15, кв. 34',
      emergencyContact: '+7 (925) 234-56-78 (дочь - Иванова Анна)'
    },
    socialStatus: {
      category: 'pensioner',
      documents: ['Пенсионное удостоверение', 'Паспорт', 'СНИЛС'],
      benefits: ['Субсидия на ЖКУ', 'Льготные лекарства', 'Бесплатный проезд']
    },
    medicalHistory: [
      {
        id: 'sh-001',
        date: '2024-05-15',
        serviceId: 'ss-001',
        description: 'Социальное сопровождение на дому',
        symptoms: ['Ограниченная мобильность', 'Одиночество', 'Снижение когнитивных функций'],
        support: 'Помощь в быту, сопровождение в поликлинику, психологическая поддержка',
        prescribedServices: [
          {
            name: 'Ежедневные визиты',
            frequency: '5 раз в неделю',
            duration: '3 часа',
            instructions: 'Помощь в уборке, приготовлении пищи, контроль приема лекарств'
          }
        ],
        socialWorker: 'sw-001',
        status: 'completed',
        followUp: '2024-07-15',
        notes: 'Клиентка проявляет положительную динамику, стала более активной'
      }
    ],
    specialNeeds: ['Пандус для коляски', 'Поручни в ванной', 'Увеличенный шрифт для чтения'],
    chronicConditions: ['Гипертония', 'Артрит', 'Сахарный диабет 2 типа'],
    currentServices: ['ss-001'],
    status: 'active',
    lastVisit: '2024-05-15',
    nextAppointment: '2024-07-15',
    notes: 'Требуется регулярный контроль артериального давления',
    priority: 'medium'
  },
  {
    id: 'c-002',
    name: 'Петров Алексей Владимирович',
    age: 42,
    gender: 'male',
    contact: {
      phone: '+7 (925) 345-67-89',
      email: 'a.petrov@gmail.com',
      address: 'г. Москва, пр. Мира, д. 125, кв. 12'
    },
    socialStatus: {
      category: 'disabled',
      documents: ['Паспорт', 'Справка МСЭ', 'ИПР'],
      benefits: ['Пенсия по инвалидности', 'Льготный проезд', 'Технические средства реабилитации']
    },
    medicalHistory: [
      {
        id: 'sh-002',
        date: '2024-06-10',
        serviceId: 'ss-004',
        description: 'Курс реабилитации',
        symptoms: ['Последствия инсульта', 'Нарушение речи', 'Ограниченная мобильность'],
        support: 'Физиотерапия, логопедические занятия, психологическая поддержка',
        prescribedServices: [
          {
            name: 'Физиотерапия',
            frequency: '3 раза в неделю',
            duration: '45 минут',
            instructions: 'Упражнения для восстановления моторики'
          }
        ],
        socialWorker: 'sw-003',
        status: 'completed',
        notes: 'Положительная динамика, улучшение речи'
      }
    ],
    specialNeeds: ['Инвалидная коляска', 'Пандус', 'Специальное рабочее место'],
    chronicConditions: ['Последствия инсульта', 'Гипертония'],
    currentServices: ['ss-004'],
    status: 'active',
    lastVisit: '2024-06-10',
    nextAppointment: '2024-08-10',
    priority: 'high'
  },
  {
    id: 'c-003',
    name: 'Сидорова Анна Дмитриевна',
    age: 35,
    gender: 'female',
    contact: {
      phone: '+7 (916) 456-78-90',
      address: 'г. Москва, ул. Пушкина, д. 67, кв. 45',
      emergencyContact: '+7 (916) 999-88-77 (мать)'
    },
    socialStatus: {
      category: 'single_parent',
      documents: ['Паспорт', 'Свидетельства о рождении детей'],
      benefits: ['Пособие на детей', 'Льготное питание в школе', 'Субсидия на ЖКУ']
    },
    medicalHistory: [
      {
        id: 'sh-003',
        date: '2024-06-18',
        serviceId: 'ss-002',
        description: 'Психологическая поддержка',
        symptoms: ['Стресс', 'Тревожность', 'Эмоциональное выгорание'],
        support: 'Индивидуальные консультации психолога',
        socialWorker: 'sw-002',
        status: 'scheduled',
        followUp: '2024-06-25'
      }
    ],
    chronicConditions: ['Депрессия'],
    currentServices: ['ss-002'],
    status: 'active',
    lastVisit: '2024-06-18',
    nextAppointment: '2024-06-25',
    notes: 'Воспитывает двух детей одна, требуется поддержка',
    priority: 'medium'
  },
  {
    id: 'c-004',
    name: 'Козлов Дмитрий Николаевич',
    age: 68,
    gender: 'male',
    contact: {
      phone: '+7 (495) 567-89-01',
      email: 'd.kozlov@mail.ru',
      address: 'г. Москва, ул. Гагарина, д. 34, кв. 78'
    },
    socialStatus: {
      category: 'veteran',
      documents: ['Паспорт', 'Удостоверение ветерана'],
      benefits: ['Ветеранские льготы', 'Компенсация лекарств', 'Льготный проезд']
    },
    medicalHistory: [],
    status: 'waiting',
    priority: 'low'
  },
  {
    id: 'c-005',
    name: 'Николаева Ольга Сергеевна',
    age: 29,
    gender: 'female',
    contact: {
      phone: '+7 (916) 789-01-23',
      email: 'o.nikolaeva@gmail.com',
      address: 'г. Москва, ул. Тверская, д. 25, кв. 67'
    },
    socialStatus: {
      category: 'refugee',
      documents: ['Паспорт', 'Вид на жительство'],
      benefits: ['Временное пособие', 'Юридическая помощь', 'Жилье']
    },
    medicalHistory: [
      {
        id: 'sh-004',
        date: '2024-06-12',
        serviceId: 'ss-003',
        description: 'Юридическая консультация',
        symptoms: ['Правовая неопределенность'],
        support: 'Помощь в оформлении документов',
        socialWorker: 'sw-004',
        status: 'completed',
        followUp: '2024-12-12'
      }
    ],
    status: 'active',
    lastVisit: '2024-06-12',
    nextAppointment: '2024-12-12',
    notes: 'Требуется помощь с трудоустройством',
    priority: 'high'
  }
];

const socialWorkers: SocialWorker[] = [
  {
    id: 'sw-001',
    name: 'Смирнова Елена Викторовна',
    specialization: ['Работа с пожилыми', 'Социальное сопровождение', 'Геронтология'],
    qualifications: ['Социальный работник высшей категории', 'Курс геронтологии', 'Сертификат по первой помощи'],
    experience: 12,
    license: 'СОЦ-77-01-012345',
    contact: {
      phone: '+7 (916) 111-22-33',
      email: 'e.smirnova@social.ru'
    },
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт'],
      hours: '09:00-17:00'
    },
    status: 'active',
    currentClients: ['c-001', 'c-005'],
    maxClients: 20,
    rating: 4.9,
    languages: ['Русский'],
    procedures: ['Социальное сопровождение', 'Помощь в быту', 'Медицинский уход'],
    department: 'Отдел работы с пожилыми',
    skills: ['Эмпатия', 'Навыки ухода', 'Кризисное вмешательство']
  },
  {
    id: 'sw-002',
    name: 'Петров Игорь Сергеевич',
    specialization: ['Психологическая помощь', 'Семейное консультирование', 'Кризисная интервенция'],
    qualifications: ['Клинический психолог', 'Сертификат по семейной терапии', 'Арт-терапия'],
    experience: 8,
    license: 'ПСХ-77-01-012346',
    contact: {
      phone: '+7 (925) 222-33-44',
      email: 'i.petrov@social.ru'
    },
    schedule: {
      days: ['Пн', 'Ср', 'Пт'],
      hours: '10:00-18:00'
    },
    status: 'active',
    currentClients: ['c-003'],
    maxClients: 15,
    rating: 4.8,
    languages: ['Русский', 'Английский'],
    procedures: ['Индивидуальная терапия', 'Семейные консультации', 'Групповая терапия'],
    department: 'Психологическая служба',
    skills: ['Психодиагностика', 'Кризисное консультирование', 'Работа с травмой']
  },
  {
    id: 'sw-003',
    name: 'Ковалева Мария Игоревна',
    specialization: ['Реабилитация', 'Работа с инвалидами', 'Физическая терапия'],
    qualifications: ['Реабилитолог', 'Сертификат по физической терапии', 'Эрготерапия'],
    experience: 10,
    license: 'РЕА-77-01-012347',
    contact: {
      phone: '+7 (916) 333-44-55',
      email: 'm.kovaleva@social.ru'
    },
    schedule: {
      days: ['Вт', 'Чт', 'Сб'],
      hours: '08:00-16:00'
    },
    status: 'vacation',
    currentClients: [],
    maxClients: 25,
    rating: 4.9,
    languages: ['Русский'],
    procedures: ['Физическая реабилитация', 'Адаптивная физкультура', 'Эрготерапия'],
    department: 'Реабилитационный центр',
    skills: ['Кинезиотерапия', 'Работа с ОВЗ', 'Разработка ИПР']
  },
  {
    id: 'sw-004',
    name: 'Иванов Дмитрий Олегович',
    specialization: ['Юридическая помощь', 'Социальные права', 'Миграционное право'],
    qualifications: ['Юрист', 'Специалист по социальному праву', 'Миграционное право'],
    experience: 15,
    license: 'ЮР-77-01-012348',
    contact: {
      phone: '+7 (925) 444-55-66',
      email: 'd.ivanov@social.ru'
    },
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      hours: '09:00-18:00'
    },
    status: 'active',
    currentClients: ['c-005'],
    maxClients: 30,
    rating: 4.7,
    languages: ['Русский'],
    procedures: ['Юридические консультации', 'Помощь в оформлении документов', 'Представительство в суде'],
    department: 'Юридический отдел',
    skills: ['Социальное законодательство', 'Миграционное право', 'Судебная практика']
  },
  {
    id: 'sw-005',
    name: 'Семенова Ольга Владимировна',
    specialization: ['Работа с детьми', 'Поддержка сирот', 'Детская психология'],
    qualifications: ['Педагог-психолог', 'Сертификат по работе с сиротами', 'Игровая терапия'],
    experience: 9,
    license: 'ПЕД-77-01-012349',
    contact: {
      phone: '+7 (925) 555-66-77',
      email: 'o.semenova@social.ru'
    },
    schedule: {
      days: ['Пн', 'Вт', 'Чт', 'Пт'],
      hours: '09:00-18:00'
    },
    status: 'active',
    currentClients: [],
    maxClients: 18,
    rating: 4.8,
    languages: ['Русский'],
    procedures: ['Развивающие занятия', 'Психологическая поддержка', 'Профориентация'],
    department: 'Детская служба',
    skills: ['Детская психология', 'Развивающие методики', 'Работа с травмой']
  }
];

const appointments: Appointment[] = [
  {
    id: 'app-001',
    clientId: 'c-001',
    workerId: 'sw-001',
    serviceId: 'ss-001',
    date: '2024-07-15',
    time: '10:00',
    duration: 180,
    status: 'scheduled',
    reason: 'Плановый визит, помощь в быту, контроль состояния здоровья',
    location: 'На дому',
    priority: 'medium'
  },
  {
    id: 'app-002',
    clientId: 'c-003',
    workerId: 'sw-002',
    serviceId: 'ss-002',
    date: '2024-06-25',
    time: '14:30',
    duration: 60,
    status: 'confirmed',
    reason: 'Индивидуальная психологическая консультация',
    location: 'Кабинет психолога',
    priority: 'high'
  },
  {
    id: 'app-003',
    clientId: 'c-004',
    workerId: 'sw-004',
    serviceId: 'ss-003',
    date: '2024-06-20',
    time: '11:15',
    duration: 45,
    status: 'scheduled',
    reason: 'Консультация по ветеранским льготам',
    priority: 'low'
  },
  {
    id: 'app-004',
    clientId: 'c-005',
    workerId: 'sw-004',
    serviceId: 'ss-003',
    date: '2024-12-12',
    time: '11:00',
    duration: 45,
    status: 'scheduled',
    reason: 'Продление вида на жительство',
    location: 'Юридический отдел',
    priority: 'high'
  }
];

const equipment: Equipment[] = [
  {
    id: 'eq-001',
    name: 'Инвалидные коляски активного типа',
    type: 'mobility',
    manufacturer: 'Ottobock',
    model: 'Стандарт',
    status: 'operational',
    lastMaintenance: '2024-05-15',
    nextMaintenance: '2024-08-15',
    location: 'Склад реабилитации',
    utilization: 75,
    condition: 'good',
    warrantyExpiry: '2025-05-15'
  },
  {
    id: 'eq-002',
    name: 'Ходунки регулируемые',
    type: 'mobility',
    manufacturer: 'Medline',
    model: 'Универсал',
    status: 'maintenance',
    lastMaintenance: '2024-04-10',
    nextMaintenance: '2024-07-10',
    location: 'Ремонтная мастерская',
    utilization: 85,
    condition: 'fair',
    warrantyExpiry: '2024-10-10'
  },
  {
    id: 'eq-003',
    name: 'Противоопорные стельки',
    type: 'therapy',
    manufacturer: 'Formthotics',
    model: 'Комфорт',
    status: 'operational',
    lastMaintenance: '2024-06-01',
    nextMaintenance: '2024-09-01',
    location: 'Кабинет ортопеда',
    utilization: 60,
    condition: 'excellent',
    warrantyExpiry: '2025-06-01'
  },
  {
    id: 'eq-004',
    name: 'Средства для развития моторики',
    type: 'therapy',
    manufacturer: 'Развивающие игры',
    model: 'Мелкая моторика',
    status: 'operational',
    lastMaintenance: '2024-05-20',
    nextMaintenance: '2024-08-20',
    location: 'Детский кабинет',
    utilization: 45,
    condition: 'good',
    warrantyExpiry: '2026-05-20'
  },
  {
    id: 'eq-005',
    name: 'Устройства для усиления звука',
    type: 'communication',
    manufacturer: 'Williams Sound',
    model: 'Портативный',
    status: 'operational',
    lastMaintenance: '2024-05-20',
    nextMaintenance: '2024-11-20',
    location: 'Кабинет логопеда',
    utilization: 30,
    condition: 'excellent',
    warrantyExpiry: '2025-11-20'
  }
];

// Константы
const COLORS = {
  primary: 'from-slate-900 via-slate-950 to-slate-900',
  secondary: 'from-blue-900 via-slate-950 to-teal-900',
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

const CATEGORY_ICONS = {
  elderly: '👵',
  disability: '♿',
  family: '👨‍👩‍👧‍👦',
  children: '🧒',
  emergency: '🚨',
  psychological: '🧠',
  legal: '⚖️',
  rehabilitation: '🏥'
} as const;

// Утилиты
const formatCurrency = (value: number) => 
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(value);

const formatNumber = (value: number) => new Intl.NumberFormat('ru-RU').format(value);

const formatDate = (dateString: string) => 
  new Date(dateString).toLocaleDateString('ru-RU', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

const formatTime = (timeString: string) => 
  new Date(`2000-01-01T${timeString}`).toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

// Хуки
const useLockBodyScroll = (locked: boolean) => {
  useEffect(() => {
    if (locked) {
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
  }, [locked]);
};

// Компоненты
const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'md',
  closeOnOverlayClick = true
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  closeOnOverlayClick?: boolean;
}) => {
  useLockBodyScroll(isOpen);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    fullscreen: 'max-w-full max-h-full m-4'
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeOnOverlayClick ? onClose : undefined}
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
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-colors duration-200 text-slate-400 hover:text-white group"
                  aria-label="Закрыть"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

const BentoCard = ({ 
  children, 
  className = '', 
  glowColor = COLORS.blue, 
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

const StatusBadge = ({ status, type = 'default', animated = false, size = 'default' }: { 
  status: string; 
  type?: 'default' | 'service' | 'client' | 'worker' | 'appointment' | 'equipment';
  animated?: boolean;
  size?: 'small' | 'default' | 'large';
}) => {
  const getStatusConfig = () => {
    const sizeClasses = {
      small: 'px-2 py-0.5 text-xs',
      default: 'px-3 py-1.5 text-xs',
      large: 'px-4 py-2 text-sm'
    };

    const baseConfig = {
      active: { color: COLORS.success, label: 'Активен', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      development: { color: COLORS.blue, label: 'В разработке', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      paused: { color: COLORS.warning, label: 'Приостановлен', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' },
      closed: { color: COLORS.error, label: 'Закрыт', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      waiting: { color: COLORS.orange, label: 'В ожидании', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      completed: { color: COLORS.teal, label: 'Завершен', bg: 'bg-teal-500/15', border: 'border-teal-500/30' },
      vacation: { color: COLORS.purple, label: 'Отпуск', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
      sick: { color: COLORS.rose, label: 'Больничный', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
      off: { color: COLORS.slate, label: 'Не на смене', bg: 'bg-slate-500/15', border: 'border-slate-500/30' },
      scheduled: { color: COLORS.blue, label: 'Запланирован', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      confirmed: { color: COLORS.teal, label: 'Подтвержден', bg: 'bg-teal-500/15', border: 'border-teal-500/30' },
      in_progress: { color: COLORS.orange, label: 'В процессе', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      cancelled: { color: COLORS.error, label: 'Отменен', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      no_show: { color: COLORS.warning, label: 'Не явился', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' },
      operational: { color: COLORS.success, label: 'Рабочее', bg: 'bg-green-500/15', border: 'border-green-500/30' },
      maintenance: { color: COLORS.warning, label: 'Обслуживание', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' },
      out_of_service: { color: COLORS.error, label: 'Не работает', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      calibration: { color: COLORS.blue, label: 'Калибровка', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      elderly: { color: COLORS.blue, label: 'Пожилые', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      disability: { color: COLORS.purple, label: 'Инвалидность', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
      family: { color: COLORS.emerald, label: 'Семья', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      children: { color: COLORS.cyan, label: 'Дети', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' },
      emergency: { color: COLORS.rose, label: 'Экстренная', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
      psychological: { color: COLORS.indigo, label: 'Психология', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' },
      legal: { color: COLORS.orange, label: 'Юридическая', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      rehabilitation: { color: COLORS.teal, label: 'Реабилитация', bg: 'bg-teal-500/15', border: 'border-teal-500/30' },
      pensioner: { color: COLORS.blue, label: 'Пенсионер', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      single_parent: { color: COLORS.purple, label: 'Одинокий родитель', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
      orphan: { color: COLORS.cyan, label: 'Сирота', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' },
      low_income: { color: COLORS.orange, label: 'Малоимущий', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      refugee: { color: COLORS.rose, label: 'Беженец', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
      veteran: { color: COLORS.emerald, label: 'Ветеран', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      low: { color: COLORS.slate, label: 'Низкий', bg: 'bg-slate-500/15', border: 'border-slate-500/30' },
      medium: { color: COLORS.orange, label: 'Средний', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      high: { color: COLORS.rose, label: 'Высокий', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
      critical: { color: COLORS.error, label: 'Критический', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      excellent: { color: COLORS.success, label: 'Отличное', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      good: { color: COLORS.teal, label: 'Хорошее', bg: 'bg-teal-500/15', border: 'border-teal-500/30' },
      fair: { color: COLORS.warning, label: 'Удовлетворительное', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' },
      poor: { color: COLORS.error, label: 'Плохое', bg: 'bg-red-500/15', border: 'border-red-500/30' }
    };

    return { ...baseConfig[status as keyof typeof baseConfig], sizeClass: sizeClasses[size] };
  };

  const config = getStatusConfig();

  return (
    <motion.span 
      className={`inline-flex items-center rounded-full text-xs font-medium border backdrop-blur-sm ${config.bg} ${config.border} ${config.sizeClass}`}
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

const ProgressBar = ({ value, max = 100, color = COLORS.blue, label, showValue = true, size = 'md', showAnimation = true }: { 
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
          {showValue && <span className="font-semibold">{percentage.toFixed(1)}%</span>}
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

const StatCard = ({ title, value, change, icon, color = COLORS.blue, subtitle, onClick, trend, animationDelay = 0 }: {
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

const ServiceCard = ({ service, onClick, animationDelay = 0 }: { service: SocialService; onClick?: () => void; animationDelay?: number }) => {
  const getServiceColor = (category: string) => {
    switch (category) {
      case 'elderly': return COLORS.blue;
      case 'disability': return COLORS.purple;
      case 'family': return COLORS.emerald;
      case 'children': return COLORS.cyan;
      case 'emergency': return COLORS.rose;
      case 'psychological': return COLORS.indigo;
      case 'legal': return COLORS.orange;
      case 'rehabilitation': return COLORS.teal;
      default: return COLORS.slate;
    }
  };

  const getPriceDisplay = (price: SocialService['price']) => {
    if (price.amount === 0) return 'Бесплатно';
    return price.stateCovered 
      ? `${formatCurrency(price.amount)} (гос. покрытие: ${price.coveragePercentage}%)`
      : formatCurrency(price.amount);
  };

  const utilization = (service.currentParticipants / service.capacity) * 100;

  return (
    <BentoCard 
      className="p-5" 
      glowColor={getServiceColor(service.category)} 
      onClick={onClick}
      animationDelay={animationDelay}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{CATEGORY_ICONS[service.category]}</span>
            <h4 className="text-white font-semibold text-base line-clamp-1">{service.name}</h4>
            {service.featured && (
              <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs border border-amber-500/30">
                ★ Рекомендуем
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm line-clamp-1">{service.targetAudience.join(', ')}</p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={service.category} size="small" />
          <StatusBadge status={service.status} animated={service.status === 'active'} size="small" />
        </div>
      </div>
      
      <div className="space-y-4 mb-5">
        <div className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
          {service.description}
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs">Длительность</span>
            <p className="text-white font-medium">{service.duration} мин</p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-slate-400 text-xs">Успешность</span>
            <p className="text-white font-medium">{service.successRate}%</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 text-xs">Стоимость</span>
            <p className="text-white font-medium text-xs leading-tight">{getPriceDisplay(service.price)}</p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-slate-400 text-xs">Ожидание</span>
            <p className="text-white font-medium">{service.metrics.waitingTime} дн.</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Загруженность:</span>
            <span className="text-white font-medium">{service.currentParticipants}/{service.capacity}</span>
          </div>
          <ProgressBar 
            value={utilization} 
            color={utilization > 90 ? COLORS.rose : utilization > 75 ? COLORS.orange : COLORS.success}
            showValue={false}
          />
        </div>

        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {service.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Местоположение:</span>
          <span className="text-white font-medium text-right text-xs">{service.location}</span>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Подробнее
        </button>
        <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Записаться
        </button>
      </div>
    </BentoCard>
  );
};

const ClientCard = ({ client, onClick, animationDelay = 0 }: { client: Client; onClick?: () => void; animationDelay?: number }) => {
  const getClientColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'waiting': return COLORS.orange;
      case 'paused': return COLORS.warning;
      case 'completed': return COLORS.teal;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard className="p-5" glowColor={getClientColor(client.status)} onClick={onClick} animationDelay={animationDelay}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{client.name}</h4>
          <p className="text-slate-400 text-sm">
            {client.age} лет • {client.gender === 'male' ? 'Мужчина' : client.gender === 'female' ? 'Женщина' : 'Другое'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={client.status} type="client" animated={client.status === 'active'} size="small" />
          {client.priority && <StatusBadge status={client.priority} size="small" />}
        </div>
      </div>
      
      <div className="space-y-3 text-sm mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Категория:</span>
          <StatusBadge status={client.socialStatus.category} size="small" />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Телефон:</span>
          <span className="text-white font-medium text-sm">{client.contact.phone}</span>
        </div>
        
        <div className="flex justify-between items-start">
          <span className="text-slate-400">Адрес:</span>
          <span className="text-white font-medium text-right text-xs">{client.contact.address}</span>
        </div>

        {client.lastVisit && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Последний визит:</span>
            <span className="text-white font-medium text-xs">
              {new Date(client.lastVisit).toLocaleDateString('ru-RU')}
            </span>
          </div>
        )}

        {client.currentServices && client.currentServices.length > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Услуги:</span>
            <span className="text-white font-medium text-xs">
              {client.currentServices.length} активных
            </span>
          </div>
        )}
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Карта
        </button>
        <button className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Запись
        </button>
      </div>
    </BentoCard>
  );
};

const WorkerCard = ({ worker, onClick, animationDelay = 0 }: { worker: SocialWorker; onClick?: () => void; animationDelay?: number }) => {
  const utilization = (worker.currentClients.length / worker.maxClients) * 100;
  
  const getWorkerColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'vacation': return COLORS.purple;
      case 'sick': return COLORS.rose;
      case 'off': return COLORS.slate;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard className="p-5" glowColor={getWorkerColor(worker.status)} onClick={onClick} animationDelay={animationDelay}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{worker.name}</h4>
          <p className="text-slate-400 text-sm line-clamp-1">{worker.specialization.join(', ')}</p>
        </div>
        <StatusBadge status={worker.status} type="worker" animated={worker.status === 'active'} size="small" />
      </div>
      
      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Опыт:</span>
          <span className="text-white font-medium">{worker.experience} лет</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Рейтинг:</span>
          <span className="text-white font-medium">{worker.rating}/5.0</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Клиенты:</span>
          <span className="text-white font-medium">{worker.currentClients.length}/{worker.maxClients}</span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-slate-400">Расписание:</span>
          <span className="text-white font-medium text-right text-xs">
            {worker.schedule.days.join(', ')}<br/>{worker.schedule.hours}
          </span>
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

const EquipmentCard = ({ equipment, onClick, animationDelay = 0 }: { equipment: Equipment; onClick?: () => void; animationDelay?: number }) => {
  const getEquipmentColor = (type: string) => {
    switch (type) {
      case 'mobility': return COLORS.blue;
      case 'therapy': return COLORS.purple;
      case 'communication': return COLORS.emerald;
      case 'daily_living': return COLORS.orange;
      case 'safety': return COLORS.rose;
      default: return COLORS.slate;
    }
  };

  const isMaintenanceDue = new Date(equipment.nextMaintenance) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <BentoCard className="p-5" glowColor={getEquipmentColor(equipment.type)} onClick={onClick} animationDelay={animationDelay}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{equipment.name}</h4>
          <p className="text-slate-400 text-sm">{equipment.manufacturer} {equipment.model}</p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={equipment.status} type="equipment" animated={equipment.status === 'operational'} size="small" />
          {equipment.condition && <StatusBadge status={equipment.condition} size="small" />}
        </div>
      </div>
      
      <div className="space-y-4 mb-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs">Тип</span>
            <p className="text-white font-medium">
              {equipment.type === 'mobility' && 'Мобильность'}
              {equipment.type === 'therapy' && 'Терапия'}
              {equipment.type === 'communication' && 'Коммуникация'}
              {equipment.type === 'daily_living' && 'Повседневная жизнь'}
              {equipment.type === 'safety' && 'Безопасность'}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-slate-400 text-xs">Использование</span>
            <p className="text-white font-medium">{equipment.utilization}%</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs">Местоположение</span>
            <p className="text-white font-medium text-xs">{equipment.location}</p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-slate-400 text-xs">След. ТО</span>
            <p className="text-white font-medium text-xs">{new Date(equipment.nextMaintenance).toLocaleDateString('ru-RU')}</p>
          </div>
        </div>

        <ProgressBar 
          value={equipment.utilization} 
          label={`Использование оборудования`}
          color={equipment.utilization > 90 ? COLORS.rose : equipment.utilization > 75 ? COLORS.orange : COLORS.success}
          showValue={false}
        />
      </div>
      
      {isMaintenanceDue && equipment.status === 'operational' && (
        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <p className="text-yellow-300 text-xs text-center font-medium">Требуется плановое ТО</p>
        </div>
      )}
    </BentoCard>
  );
};

const AppointmentCard = ({ appointment, onClick, animationDelay = 0 }: { appointment: Appointment; onClick?: () => void; animationDelay?: number }) => {
  const client = clients.find(p => p.id === appointment.clientId);
  const worker = socialWorkers.find(d => d.id === appointment.workerId);
  const service = socialServices.find(s => s.id === appointment.serviceId);

  const getAppointmentColor = (status: string) => {
    switch (status) {
      case 'scheduled': return COLORS.blue;
      case 'confirmed': return COLORS.teal;
      case 'in_progress': return COLORS.orange;
      case 'completed': return COLORS.success;
      case 'cancelled': return COLORS.error;
      case 'no_show': return COLORS.warning;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard className="p-5" glowColor={getAppointmentColor(appointment.status)} onClick={onClick} animationDelay={animationDelay}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">
            {service?.name || 'Услуга'}
          </h4>
          <p className="text-slate-400 text-sm line-clamp-1">
            {client?.name} • {worker?.name}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={appointment.status} type="appointment" animated={appointment.status === 'scheduled'} size="small" />
          {appointment.priority && <StatusBadge status={appointment.priority} size="small" />}
        </div>
      </div>
      
      <div className="space-y-3 text-sm mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Дата и время:</span>
          <span className="text-white font-medium text-sm">
            {new Date(appointment.date).toLocaleDateString('ru-RU')} {appointment.time}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Длительность:</span>
          <span className="text-white font-medium">{appointment.duration} мин</span>
        </div>
        
        {appointment.location && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Местоположение:</span>
            <span className="text-white font-medium text-sm">{appointment.location}</span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-700/50">
          <span className="text-slate-400 text-xs">Причина:</span>
          <p className="text-white font-medium text-xs mt-1 line-clamp-2">{appointment.reason}</p>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Подробнее
        </button>
        <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Изменить
        </button>
      </div>
    </BentoCard>
  );
};

const FilterBar = ({ 
  filters, 
  onFiltersChange,
  searchQuery,
  onSearchChange 
}: {
  filters: any;
  onFiltersChange: (filters: any) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Поиск услуг, клиентов, специалистов..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 pl-11"
        />
        <svg className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <div className="relative">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-slate-200 px-4 py-3 rounded-2xl transition-all duration-200 font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Фильтры
        </button>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              className="absolute top-full right-0 mt-2 w-80 bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl z-10 p-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="space-y-4">
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">Статус</label>
                  <div className="flex flex-wrap gap-2">
                    {['active', 'development', 'paused'].map(status => (
                      <button
                        key={status}
                        onClick={() => onFiltersChange({ ...filters, status })}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          filters.status === status
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {status === 'active' ? 'Активные' : status === 'development' ? 'В разработке' : 'Приостановленные'}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">Категория</label>
                  <div className="flex flex-wrap gap-2">
                    {['elderly', 'family', 'children', 'emergency'].map(category => (
                      <button
                        key={category}
                        onClick={() => onFiltersChange({ ...filters, category })}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          filters.category === category
                            ? 'bg-purple-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]} 
                        {category === 'elderly' ? 'Пожилые' : 
                         category === 'family' ? 'Семья' : 
                         category === 'children' ? 'Дети' : 'Экстренная'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onFiltersChange({ status: '', category: '' })}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 rounded-lg text-sm transition-all"
                  >
                    Сбросить
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg text-sm transition-all"
                  >
                    Применить
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Основной компонент
export default function SocialServicesOrganization() {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'clients' | 'workers' | 'equipment' | 'analytics' | 'appointments'>('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ status: '', category: '' });
  
  const openModal = useCallback((title: string, content: React.ReactNode, size: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen' = 'lg') => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalContent(null);
    setModalTitle('');
  }, []);

  // Фильтрация данных по поисковому запросу и фильтрам
  const filteredServices = useMemo(() => {
    let filtered = socialServices;
    
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.targetAudience.some(audience => audience.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (filters.status) {
      filtered = filtered.filter(service => service.status === filters.status);
    }
    
    if (filters.category) {
      filtered = filtered.filter(service => service.category === filters.category);
    }
    
    return filtered;
  }, [searchQuery, filters]);

  const filteredClients = useMemo(() => {
    let filtered = clients;
    
    if (searchQuery) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.contact.phone.includes(searchQuery) ||
        client.socialStatus.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [searchQuery]);

  const filteredWorkers = useMemo(() => {
    let filtered = socialWorkers;
    
    if (searchQuery) {
      filtered = filtered.filter(worker =>
        worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.specialization.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())) ||
        worker.contact.phone.includes(searchQuery)
      );
    }
    
    return filtered;
  }, [searchQuery]);

  const filteredEquipment = useMemo(() => {
    let filtered = equipment;
    
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [searchQuery]);

  const filteredAppointments = useMemo(() => {
    let filtered = appointments;
    
    if (searchQuery) {
      filtered = filtered.filter(appointment => {
        const client = clients.find(p => p.id === appointment.clientId);
        const worker = socialWorkers.find(d => d.id === appointment.workerId);
        const service = socialServices.find(s => s.id === appointment.serviceId);
        
        return (
          client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          worker?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appointment.reason.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }
    
    return filtered;
  }, [searchQuery]);

  // Статистика
  const socialStats = useMemo(() => {
    const totalClients = clients.length;
    const activeClients = clients.filter(p => p.status === 'active').length;
    const waitingClients = clients.filter(p => p.status === 'waiting').length;
    const totalServices = socialServices.length;
    const activeServices = socialServices.filter(s => s.status === 'active').length;
    const totalWorkers = socialWorkers.length;
    const availableWorkers = socialWorkers.filter(d => d.status === 'active').length;
    const todayAppointments = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length;
    const totalEquipment = equipment.length;
    const operationalEquipment = equipment.filter(e => e.status === 'operational').length;

    // Дополнительная аналитика
    const serviceUtilization = socialServices.reduce((acc, service) => 
      acc + (service.currentParticipants / service.capacity), 0) / socialServices.length * 100;
    
    const avgSatisfaction = socialServices.reduce((acc, service) => 
      acc + service.metrics.satisfaction, 0) / socialServices.length;
    
    const emergencyServices = socialServices.filter(s => s.availability.emergency).length;

    return {
      totalClients,
      activeClients,
      waitingClients,
      totalServices,
      activeServices,
      totalWorkers,
      availableWorkers,
      todayAppointments,
      totalEquipment,
      operationalEquipment,
      serviceUtilization,
      avgSatisfaction,
      emergencyServices
    };
  }, []);

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: '📊', count: null },
    { id: 'services' as const, label: 'Услуги', icon: '🏥', count: socialStats.totalServices },
    { id: 'clients' as const, label: 'Клиенты', icon: '👥', count: socialStats.totalClients },
    { id: 'workers' as const, label: 'Специалисты', icon: '👨‍⚕️', count: socialStats.totalWorkers },
    { id: 'equipment' as const, label: 'Оборудование', icon: '⚙️', count: socialStats.totalEquipment },
    { id: 'appointments' as const, label: 'Записи', icon: '📅', count: appointments.length },
    { id: 'analytics' as const, label: 'Аналитика', icon: '📈', count: null }
  ];

  // Модальные окна контент
  const renderServiceModal = (service: SocialService) => {
    const utilization = (service.currentParticipants / service.capacity) * 100;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Услуга</label>
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
            <label className="text-slate-400 text-sm font-medium">Целевая аудитория</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {service.targetAudience.map((audience, index) => (
                <span key={index} className="px-3 py-1 bg-slate-700/50 rounded-lg text-slate-300 text-sm">
                  {audience}
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
            <p className="text-white font-bold text-xl">{service.duration}</p>
            <p className="text-slate-400 text-xs mt-1">минут</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-xl">{service.successRate}%</p>
            <p className="text-slate-400 text-xs mt-1">успешность</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-xl">{service.metrics.satisfaction}%</p>
            <p className="text-slate-400 text-xs mt-1">удовлетворенность</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-xl">{service.metrics.waitingTime}</p>
            <p className="text-slate-400 text-xs mt-1">дней ожидания</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Загруженность услуги</label>
            <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">Участники</span>
                <span className="text-white font-bold">{service.currentParticipants}/{service.capacity}</span>
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
                {service.price.amount === 0 
                  ? 'Бесплатно'
                  : service.price.stateCovered
                    ? `${formatCurrency(service.price.amount)} (государство покрывает ${service.price.coveragePercentage}%)`
                    : formatCurrency(service.price.amount)
                }
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Доступность</label>
            <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
              <p className="text-white font-medium">
                {service.availability.days.join(', ')} {service.availability.hours}
              </p>
              {service.availability.emergency && (
                <p className="text-orange-400 text-sm mt-1">✓ Доступна экстренная помощь</p>
              )}
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Местоположение</label>
            <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
              <p className="text-white font-medium">{service.location}</p>
            </div>
          </div>
        </div>

        {service.requirements && service.requirements.length > 0 && (
          <div>
            <label className="text-slate-400 text-sm font-medium mb-3 block">Требования</label>
            <div className="space-y-2">
              {service.requirements.map((req, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/20 rounded-xl">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0" />
                  <p className="text-white text-sm">{req}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium mb-3 block">Необходимое оборудование</label>
            <div className="space-y-2">
              {service.equipment.map((eq, index) => (
                <div key={index} className="p-3 bg-slate-800/20 rounded-xl">
                  <p className="text-white text-sm">{eq}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium mb-3 block">Требуемый персонал</label>
            <div className="space-y-2">
              {service.staffRequired.map((staff, index) => (
                <div key={index} className="p-3 bg-slate-800/20 rounded-xl">
                  <p className="text-white text-sm">{staff}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {service.tags && service.tags.length > 0 && (
          <div>
            <label className="text-slate-400 text-sm font-medium mb-3 block">Теги</label>
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderClientModal = (client: Client) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm font-medium">Клиент</label>
            <p className="text-white font-semibold text-lg mt-1">{client.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm">Возраст</label>
              <p className="text-white font-medium">{client.age} лет</p>
            </div>
            <div>
              <label className="text-slate-400 text-sm">Пол</label>
              <p className="text-white font-medium">
                {client.gender === 'male' ? 'Мужской' : client.gender === 'female' ? 'Женский' : 'Другое'}
              </p>
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
            <label className="text-slate-400 text-sm">Социальный статус</label>
            <div className="mt-2">
              <StatusBadge status={client.socialStatus.category} />
            </div>
          </div>
          {client.priority && (
            <div>
              <label className="text-slate-400 text-sm">Приоритет</label>
              <div className="mt-2">
                <StatusBadge status={client.priority} />
              </div>
            </div>
          )}
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
            {client.contact.email && (
              <div>
                <span className="text-slate-400 text-sm">Email:</span>
                <p className="text-white font-medium">{client.contact.email}</p>
              </div>
            )}
            <div>
              <span className="text-slate-400 text-sm">Адрес:</span>
              <p className="text-white font-medium text-sm">{client.contact.address}</p>
            </div>
            {client.contact.emergencyContact && (
              <div>
                <span className="text-slate-400 text-sm">Экстренный контакт:</span>
                <p className="text-white font-medium text-sm">{client.contact.emergencyContact}</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="text-slate-400 text-sm font-medium">Социальная информация</label>
          <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
            <div>
              <span className="text-slate-400 text-sm">Документы:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {client.socialStatus.documents.map((doc, index) => (
                  <span key={index} className="px-2 py-1 bg-slate-700/50 rounded-lg text-slate-300 text-xs">
                    {doc}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-sm">Льготы:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {client.socialStatus.benefits.map((benefit, index) => (
                  <span key={index} className="px-2 py-1 bg-green-500/20 rounded-lg text-green-300 text-xs">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {client.specialNeeds && client.specialNeeds.length > 0 && (
        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Особые потребности</label>
          <div className="flex flex-wrap gap-2">
            {client.specialNeeds.map((need, index) => (
              <span key={index} className="px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 text-sm">
                {need}
              </span>
            ))}
          </div>
        </div>
      )}

      {client.chronicConditions && client.chronicConditions.length > 0 && (
        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Хронические состояния</label>
          <div className="flex flex-wrap gap-2">
            {client.chronicConditions.map((condition, index) => (
              <span key={index} className="px-3 py-2 bg-orange-500/20 border border-orange-500/30 rounded-xl text-orange-300 text-sm">
                {condition}
              </span>
            ))}
          </div>
        </div>
      )}

      {client.currentServices && client.currentServices.length > 0 && (
        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Текущие услуги</label>
          <div className="flex flex-wrap gap-2">
            {client.currentServices.map((serviceId, index) => {
              const service = socialServices.find(s => s.id === serviceId);
              return service ? (
                <span key={index} className="px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300 text-sm">
                  {service.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {client.medicalHistory.length > 0 && (
        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">История обращений</label>
          <div className="space-y-3">
            {client.medicalHistory.map((record) => (
              <div key={record.id} className="p-4 bg-slate-800/30 rounded-2xl">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-white font-medium">
                    {new Date(record.date).toLocaleDateString('ru-RU')}
                  </span>
                  <StatusBadge status={record.status} />
                </div>
                <p className="text-white text-sm mb-2"><strong>Услуга:</strong> {record.description}</p>
                <p className="text-slate-300 text-sm"><strong>Поддержка:</strong> {record.support}</p>
                {record.socialWorker && (
                  <p className="text-slate-400 text-xs mt-2">Специалист: {socialWorkers.find(d => d.id === record.socialWorker)?.name}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {client.notes && (
        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Примечания</label>
          <div className="p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white text-sm">{client.notes}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderWorkerModal = (worker: SocialWorker) => {
    const utilization = (worker.currentClients.length / worker.maxClients) * 100;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm font-medium">Специалист</label>
              <p className="text-white font-semibold text-lg mt-1">{worker.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm">Опыт работы</label>
                <p className="text-white font-medium">{worker.experience} лет</p>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Рейтинг</label>
                <p className="text-white font-medium">{worker.rating}/5.0</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm font-medium">Статус</label>
              <div className="mt-2">
                <StatusBadge status={worker.status} type="worker" animated={worker.status === 'active'} />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-sm">Лицензия</label>
              <p className="text-white font-medium text-sm">{worker.license}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Контактная информация</label>
            <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
              <div>
                <span className="text-slate-400 text-sm">Телефон:</span>
                <p className="text-white font-medium">{worker.contact.phone}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Email:</span>
                <p className="text-white font-medium">{worker.contact.email}</p>
              </div>
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Расписание</label>
            <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
              <div>
                <span className="text-slate-400 text-sm">Дни работы:</span>
                <p className="text-white font-medium">{worker.schedule.days.join(', ')}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Часы работы:</span>
                <p className="text-white font-medium">{worker.schedule.hours}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Загрузка специалиста</label>
            <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">Клиенты</span>
                <span className="text-white font-bold">{worker.currentClients.length}/{worker.maxClients}</span>
              </div>
              <ProgressBar 
                value={utilization} 
                color={utilization > 90 ? COLORS.rose : utilization > 75 ? COLORS.orange : COLORS.success}
                showValue={true}
              />
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Языки</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {worker.languages.map((lang, index) => (
                <span key={index} className="px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 text-sm">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Специализация</label>
          <div className="flex flex-wrap gap-2">
            {worker.specialization.map((spec, index) => (
              <span key={index} className="px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300 text-sm">
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Квалификация</label>
          <div className="space-y-2">
            {worker.qualifications.map((qual, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/20 rounded-xl">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0" />
                <p className="text-white text-sm">{qual}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">Процедуры</label>
          <div className="flex flex-wrap gap-2">
            {worker.procedures.map((procedure, index) => (
              <span key={index} className="px-3 py-2 bg-slate-700/50 rounded-xl text-slate-300 text-sm">
                {procedure}
              </span>
            ))}
          </div>
        </div>

        {worker.skills && worker.skills.length > 0 && (
          <div>
            <label className="text-slate-400 text-sm font-medium mb-3 block">Навыки</label>
            <div className="flex flex-wrap gap-2">
              {worker.skills.map((skill, index) => (
                <span key={index} className="px-3 py-2 bg-teal-500/20 border border-teal-500/30 rounded-xl text-teal-300 text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {worker.currentClients.length > 0 && (
          <div>
            <label className="text-slate-400 text-sm font-medium mb-3 block">Текущие клиенты</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {worker.currentClients.map((clientId) => {
                const client = clients.find(p => p.id === clientId);
                return client ? (
                  <div key={clientId} className="p-3 bg-slate-800/30 rounded-xl">
                    <p className="text-white font-medium text-sm">{client.name}</p>
                    <p className="text-slate-400 text-xs">{client.age} лет</p>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Добавляем этот компонент перед основным компонентом
const SafeTimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  
  useEffect(() => {
    // Устанавливаем время только на клиенте
    setCurrentTime(new Date().toLocaleTimeString('ru-RU'));
  }, []);
  
  // На сервере показываем пустую строку, на клиенте - время
  return <span>{currentTime}</span>;
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
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
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
                Центр социальной помощи <span className="text-teal-400">"Забота"</span>
              </h1>
              <p className="text-slate-400 text-lg">Комплексная поддержка и помощь нуждающимся гражданам</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск услуг, клиентов, специалистов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full lg:w-80 px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 pl-11"
                />
                <svg className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <button 
                className="bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-300 px-6 py-3 rounded-2xl transition-all duration-200 font-semibold flex items-center gap-2 justify-center"
                onClick={() => openModal('Добавить услугу', (
                  <div className="space-y-4">
                    <p className="text-slate-400 text-center">Функционал добавления услуги в разработке...</p>
                  </div>
                ), 'md')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Добавить услугу
              </button>
            </div>
          </div>

          {/* Enhanced Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Всего клиентов"
              value={socialStats.totalClients}
              change={8}
              icon="👥"
              color={COLORS.blue}
              subtitle={`${socialStats.activeClients} активных`}
              trend="up"
              animationDelay={0}
            />
            <StatCard
              title="Социальных услуг"
              value={socialStats.totalServices}
              change={12}
              icon="🏥"
              color={COLORS.teal}
              subtitle={`${socialStats.activeServices} активных`}
              trend="up"
              animationDelay={1}
            />
            <StatCard
              title="Специалистов"
              value={socialStats.totalWorkers}
              change={5}
              icon="👨‍⚕️"
              color={COLORS.purple}
              subtitle={`${socialStats.availableWorkers} доступно`}
              trend="up"
              animationDelay={2}
            />
            <StatCard
              title="Загруженность услуг"
              value={`${Math.round(socialStats.serviceUtilization)}%`}
              change={-3}
              icon="📊"
              color={COLORS.orange}
              subtitle="средняя по всем услугам"
              trend="down"
              animationDelay={3}
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
                {tabs.map((tab, index) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                      activeTab === tab.id
                        ? 'bg-slate-700/50 text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-base">{tab.icon}</span>
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                        activeTab === tab.id 
                          ? 'bg-teal-500 text-white' 
                          : 'bg-slate-600 text-slate-300'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Filter Bar */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <FilterBar 
            filters={filters}
            onFiltersChange={setFilters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
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
                {/* Featured Services */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Рекомендуемые услуги</h2>
                    <button 
                      className="text-teal-400 hover:text-teal-300 text-sm font-medium flex items-center gap-1 group"
                      onClick={() => setActiveTab('services')}
                    >
                      Все услуги
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {socialServices
                      .filter(service => service.featured)
                      .slice(0, 6)
                      .map((service, index) => (
                      <ServiceCard 
                        key={service.id}
                        service={service} 
                        onClick={() => openModal(service.name, renderServiceModal(service), 'xl')}
                        animationDelay={index}
                      />
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <BentoCard className="p-6" glowColor={COLORS.emerald}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Средняя удовлетворенность</p>
                        <p className="text-white font-bold text-2xl">{socialStats.avgSatisfaction.toFixed(1)}%</p>
                      </div>
                      <div className="text-3xl">😊</div>
                    </div>
                    <ProgressBar value={socialStats.avgSatisfaction} color={COLORS.emerald} />
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.rose}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Экстренные услуги</p>
                        <p className="text-white font-bold text-2xl">{socialStats.emergencyServices}</p>
                      </div>
                      <div className="text-3xl">🚨</div>
                    </div>
                    <p className="text-slate-400 text-xs mt-2">Доступны 24/7</p>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.amber}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Оборудование в работе</p>
                        <p className="text-white font-bold text-2xl">{socialStats.operationalEquipment}/{socialStats.totalEquipment}</p>
                      </div>
                      <div className="text-3xl">⚙️</div>
                    </div>
                    <ProgressBar 
                      value={(socialStats.operationalEquipment / socialStats.totalEquipment) * 100} 
                      color={COLORS.amber} 
                    />
                  </BentoCard>
                </div>

                {/* Recent Activity */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Недавние клиенты</h3>
                      <button 
                        className="text-slate-400 hover:text-slate-300 text-sm font-medium group"
                        onClick={() => setActiveTab('clients')}
                      >
                        Все клиенты →
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {clients
                        .sort((a, b) => {
                          const dateA = a.lastVisit ? new Date(a.lastVisit).getTime() : 0;
                          const dateB = b.lastVisit ? new Date(b.lastVisit).getTime() : 0;
                          return dateB - dateA;
                        })
                        .slice(0, 4)
                        .map((client, index) => (
                        <motion.div
                          key={client.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <BentoCard className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {client.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="text-white font-medium text-sm">{client.name}</p>
                                <p className="text-slate-400 text-xs">
                                  {client.age} лет • {client.socialStatus.category === 'pensioner' ? 'Пенсионер' : 
                                  client.socialStatus.category === 'disabled' ? 'Инвалид' :
                                  client.socialStatus.category === 'single_parent' ? 'Одинокий родитель' : 'Другая категория'}
                                </p>
                              </div>
                              <StatusBadge status={client.status} size="small" />
                            </div>
                          </BentoCard>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Ближайшие записи</h3>
                      <button 
                        className="text-slate-400 hover:text-slate-300 text-sm font-medium group"
                        onClick={() => setActiveTab('appointments')}
                      >
                        Все записи →
                      </button>
                    </div>
                    <div className="space-y-4">
                      {appointments
                        .filter(apt => new Date(apt.date) >= new Date())
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .slice(0, 4)
                        .map((appointment, index) => {
                          const client = clients.find(p => p.id === appointment.clientId);
                          const service = socialServices.find(s => s.id === appointment.serviceId);
                          
                          return (
                            <motion.div
                              key={appointment.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <BentoCard className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-white font-medium text-sm">
                                      {client?.name}
                                    </p>
                                    <p className="text-slate-400 text-xs">
                                      {service?.name} • {formatTime(appointment.time)}
                                    </p>
                                  </div>
                                  <StatusBadge status={appointment.status} size="small" />
                                </div>
                                <div className="flex items-center gap-2 mt-2 text-slate-400 text-xs">
                                  <span>{formatDate(appointment.date)}</span>
                                  <span>•</span>
                                  <span>{appointment.duration} мин</span>
                                </div>
                              </BentoCard>
                            </motion.div>
                          );
                        })}
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Социальные услуги 
                    <span className="text-slate-400 text-lg ml-2">({filteredServices.length})</span>
                  </h2>
                  <div className="flex gap-2">
                    <button className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-slate-200 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                      Экспорт
                    </button>
                    <button className="bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                      + Новая услуга
                    </button>
                  </div>
                </div>

                {filteredServices.length === 0 ? (
                  <BentoCard className="p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-white font-semibold text-lg mb-2">Услуги не найдены</h3>
                    <p className="text-slate-400">Попробуйте изменить параметры поиска или фильтры</p>
                  </BentoCard>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service, index) => (
                      <ServiceCard 
                        key={service.id}
                        service={service}
                        onClick={() => openModal(service.name, renderServiceModal(service), 'xl')}
                        animationDelay={index}
                      />
                    ))}
                  </div>
                )}
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
                  <h2 className="text-2xl font-bold text-white">
                    Клиенты
                    <span className="text-slate-400 text-lg ml-2">({filteredClients.length})</span>
                  </h2>
                  <button className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                    + Новый клиент
                  </button>
                </div>

                {filteredClients.length === 0 ? (
                  <BentoCard className="p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-white font-semibold text-lg mb-2">Клиенты не найдены</h3>
                    <p className="text-slate-400">Попробуйте изменить параметры поиска</p>
                  </BentoCard>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClients.map((client, index) => (
                      <ClientCard 
                        key={client.id}
                        client={client}
                        onClick={() => openModal(client.name, renderClientModal(client), 'xl')}
                        animationDelay={index}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'workers' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    Специалисты
                    <span className="text-slate-400 text-lg ml-2">({filteredWorkers.length})</span>
                  </h2>
                  <button className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                    + Новый специалист
                  </button>
                </div>

                {filteredWorkers.length === 0 ? (
                  <BentoCard className="p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-white font-semibold text-lg mb-2">Специалисты не найдены</h3>
                    <p className="text-slate-400">Попробуйте изменить параметры поиска</p>
                  </BentoCard>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWorkers.map((worker, index) => (
                      <WorkerCard 
                        key={worker.id}
                        worker={worker}
                        onClick={() => openModal(worker.name, renderWorkerModal(worker), 'xl')}
                        animationDelay={index}
                      />
                    ))}
                  </div>
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
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    Оборудование и средства реабилитации
                    <span className="text-slate-400 text-lg ml-2">({filteredEquipment.length})</span>
                  </h2>
                  <button className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                    + Новое оборудование
                  </button>
                </div>

                {filteredEquipment.length === 0 ? (
                  <BentoCard className="p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-white font-semibold text-lg mb-2">Оборудование не найдено</h3>
                    <p className="text-slate-400">Попробуйте изменить параметры поиска</p>
                  </BentoCard>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEquipment.map((item, index) => (
                      <EquipmentCard 
                        key={item.id}
                        equipment={item}
                        onClick={() => openModal(item.name, (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-slate-400 text-sm">Оборудование</label>
                                <p className="text-white font-medium">{item.name}</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Статус</label>
                                <div className="mt-1">
                                  <StatusBadge status={item.status} type="equipment" animated={item.status === 'operational'} />
                                </div>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Производитель</label>
                                <p className="text-white font-medium">{item.manufacturer}</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Модель</label>
                                <p className="text-white font-medium">{item.model}</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Тип</label>
                                <p className="text-white font-medium">
                                  {item.type === 'mobility' && 'Мобильность'}
                                  {item.type === 'therapy' && 'Терапия'}
                                  {item.type === 'communication' && 'Коммуникация'}
                                  {item.type === 'daily_living' && 'Повседневная жизнь'}
                                  {item.type === 'safety' && 'Безопасность'}
                                </p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Местоположение</label>
                                <p className="text-white font-medium">{item.location}</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Использование</label>
                                <p className="text-white font-medium">{item.utilization}%</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">След. ТО</label>
                                <p className="text-white font-medium">{new Date(item.nextMaintenance).toLocaleDateString('ru-RU')}</p>
                              </div>
                              {item.condition && (
                                <div>
                                  <label className="text-slate-400 text-sm">Состояние</label>
                                  <div className="mt-1">
                                    <StatusBadge status={item.condition} />
                                  </div>
                                </div>
                              )}
                              {item.warrantyExpiry && (
                                <div>
                                  <label className="text-slate-400 text-sm">Гарантия до</label>
                                  <p className="text-white font-medium">{new Date(item.warrantyExpiry).toLocaleDateString('ru-RU')}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ), 'lg')}
                        animationDelay={index}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'appointments' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    Записи на прием
                    <span className="text-slate-400 text-lg ml-2">({filteredAppointments.length})</span>
                  </h2>
                  <button className="bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                    + Новая запись
                  </button>
                </div>

                {filteredAppointments.length === 0 ? (
                  <BentoCard className="p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-white font-semibold text-lg mb-2">Записи не найдены</h3>
                    <p className="text-slate-400">Попробуйте изменить параметры поиска</p>
                  </BentoCard>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAppointments.map((appointment, index) => (
                      <AppointmentCard 
                        key={appointment.id}
                        appointment={appointment}
                        onClick={() => openModal('Детали записи', (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-slate-400 text-sm">Клиент</label>
                                <p className="text-white font-medium">{clients.find(p => p.id === appointment.clientId)?.name}</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Специалист</label>
                                <p className="text-white font-medium">{socialWorkers.find(d => d.id === appointment.workerId)?.name}</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Услуга</label>
                                <p className="text-white font-medium">{socialServices.find(s => s.id === appointment.serviceId)?.name}</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Статус</label>
                                <div className="mt-1">
                                  <StatusBadge status={appointment.status} />
                                </div>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Дата и время</label>
                                <p className="text-white font-medium">
                                  {formatDate(appointment.date)} {formatTime(appointment.time)}
                                </p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Длительность</label>
                                <p className="text-white font-medium">{appointment.duration} минут</p>
                              </div>
                              {appointment.location && (
                                <div className="col-span-2">
                                  <label className="text-slate-400 text-sm">Местоположение</label>
                                  <p className="text-white font-medium">{appointment.location}</p>
                                </div>
                              )}
                              <div className="col-span-2">
                                <label className="text-slate-400 text-sm">Причина</label>
                                <p className="text-white font-medium">{appointment.reason}</p>
                              </div>
                              {appointment.notes && (
                                <div className="col-span-2">
                                  <label className="text-slate-400 text-sm">Примечания</label>
                                  <p className="text-white font-medium">{appointment.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ), 'lg')}
                        animationDelay={index}
                      />
                    ))}
                  </div>
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
                  <BentoCard className="p-6" glowColor={COLORS.teal}>
                    <h3 className="text-white font-semibold mb-4">Эффективность услуг</h3>
                    <div className="text-3xl font-bold text-white mb-2">89.2%</div>
                    <ProgressBar value={89.2} color={COLORS.teal} />
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-slate-300">
                      <div>
                        <p>Средняя удовлетворенность</p>
                        <p className="text-white font-medium">91.5%</p>
                      </div>
                      <div>
                        <p>Успешность программ</p>
                        <p className="text-white font-medium">87.8%</p>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.blue}>
                    <h3 className="text-white font-semibold mb-4">Охват услуг</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                        <span className="text-slate-300">Всего обслужено</span>
                        <span className="text-white font-medium">{clients.length} чел.</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                        <span className="text-slate-300">Активные случаи</span>
                        <span className="text-white font-medium">{socialStats.activeClients} чел.</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                        <span className="text-slate-300">В очереди</span>
                        <span className="text-orange-300 font-medium">{socialStats.waitingClients} чел.</span>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.purple}>
                    <h3 className="text-white font-semibold mb-4">Распределение по категориям</h3>
                    <div className="space-y-3">
                      {[
                        { category: 'Пожилые', percentage: 35, clients: Math.round(clients.length * 0.35) },
                        { category: 'Инвалиды', percentage: 25, clients: Math.round(clients.length * 0.25) },
                        { category: 'Семьи', percentage: 20, clients: Math.round(clients.length * 0.20) },
                        { category: 'Дети', percentage: 12, clients: Math.round(clients.length * 0.12) },
                        { category: 'Другие', percentage: 8, clients: Math.round(clients.length * 0.08) }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-white text-sm">{item.category}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-300 text-sm">{item.percentage}%</span>
                            <span className="text-slate-400 text-xs">({item.clients})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </BentoCard>
                </div>

                {/* Social Analytics */}
                <BentoCard className="p-6">
                  <h3 className="text-white font-semibold mb-4">Социальная аналитика</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Ключевые показатели помощи</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Среднее время ожидания</span>
                          <span className="text-white font-medium">5.2 дня</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Повторные обращения</span>
                          <span className="text-white font-medium">22%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Эффективность программ</span>
                          <span className="text-white font-medium">87.5%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Обеспеченность оборудованием</span>
                          <span className="text-white font-medium">78.3%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Эффективность по направлениям</h4>
                      <div className="space-y-3">
                        {[
                          { specialty: 'Социальное сопровождение', effectiveness: 92, clients: 42 },
                          { specialty: 'Психологическая помощь', effectiveness: 88, clients: 25 },
                          { specialty: 'Юридические консультации', effectiveness: 90, clients: 18 },
                          { specialty: 'Реабилитация', effectiveness: 85, clients: 35 }
                        ].map((item, index) => (
                          <div key={index} className="p-3 bg-slate-800/30 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white text-sm">{item.specialty}</span>
                              <span className="text-slate-300 text-sm">{item.effectiveness}%</span>
                            </div>
                            <ProgressBar value={item.effectiveness} color={COLORS.teal} />
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