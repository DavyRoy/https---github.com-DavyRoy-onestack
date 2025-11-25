'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Расширенные типы данных
interface Organization {
  id: string;
  name: string;
  type: 'state' | 'municipal' | 'private' | 'npo';
  status: 'active' | 'suspended' | 'inactive';
  registrationNumber: string;
  taxId: string;
  foundationDate: string;
  director: string;
  address: {
    legal: string;
    actual: string;
    coordinates?: { lat: number; lng: number };
  };
  contacts: {
    phone: string[];
    email: string[];
    website: string;
    social?: { platform: string; url: string }[];
  };
  licenses: {
    number: string;
    issueDate: string;
    expirationDate: string;
    status: 'active' | 'expired' | 'suspended';
    type: string;
    issuer: string;
    scope: string[];
  }[];
  statistics: {
    employees: number;
    clients: number;
    services: number;
    branches: number;
    satisfaction: number;
    responseTime: number;
    completionRate: number;
    monthlyGrowth: number;
  };
  financial: {
    budget: number;
    funding: number;
    expenses: number;
    profit?: number;
    quarterly: { quarter: string; income: number; expenses: number }[];
  };
  description: string;
  mission: string;
  values: string[];
  achievements: { year: number; achievement: string }[];
  partners: { name: string; type: string; since: string }[];
  socialMedia?: {
    followers: number;
    engagement: number;
    growth: number;
  };
  awards?: { year: number; name: string; issuer: string }[];
}

interface Department {
  id: string;
  name: string;
  head: string;
  employees: number;
  services: number;
  status: 'active' | 'inactive' | 'restructuring';
  description: string;
  contactEmail: string;
  phone: string;
  budget: number;
  location: string;
  established: string;
  goals: string[];
  challenges: string[];
  performance: {
    efficiency: number;
    satisfaction: number;
    growth: number;
  };
  team: { role: string; count: number }[];
}

interface Service {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'development' | 'suspended';
  clients: number;
  rating: number;
  price: number;
  description: string;
  detailedDescription: string;
  requirements: string[];
  duration: string;
  department: string;
  coverage: string[];
  tags: string[];
  features: string[];
  process: string[];
  documents: string[];
  statistics: {
    monthlyGrowth: number;
    completionRate: number;
    satisfaction: number;
    repeatClients: number;
  };
  reviews: { client: string; rating: number; comment: string; date: string }[];
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: 'active' | 'vacation' | 'sick' | 'remote';
  hireDate: string;
  salary: number;
  skills: string[];
  education: { degree: string; institution: string; year: number }[];
  projects: { name: string; role: string; duration: string }[];
  performance: {
    rating: number;
    completedTasks: number;
    efficiency: number;
  };
  certifications: string[];
}

interface Branch {
  id: string;
  name: string;
  address: string;
  manager: string;
  employees: number;
  services: number;
  contact: {
    phone: string;
    email: string;
  };
  hours: {
    weekdays: string;
    weekend: string;
  };
  facilities: string[];
  servicesOffered: string[];
}

// Расширенные демо данные
const organizationData: Organization = {
  id: 'org-001',
  name: 'Центр социального обслуживания "Забота"',
  type: 'state',
  status: 'active',
  registrationNumber: '1187746001234',
  taxId: '7723456789',
  foundationDate: '2010-03-15',
  director: 'Иванова Мария Петровна',
  address: {
    legal: 'г. Москва, ул. Ленина, д. 42, оф. 15',
    actual: 'г. Москва, ул. Ленина, д. 42, оф. 15-18',
    coordinates: { lat: 55.7558, lng: 37.6173 }
  },
  contacts: {
    phone: ['+7 (495) 123-45-67', '+7 (495) 123-45-68', '+7 (800) 100-12-13'],
    email: ['info@zabota-center.ru', 'reception@zabota-center.ru', 'support@zabota-center.ru'],
    website: 'www.zabota-center.ru',
    social: [
      { platform: 'VK', url: 'https://vk.com/zabota_center' },
      { platform: 'Telegram', url: 'https://t.me/zabota_center' },
      { platform: 'WhatsApp', url: 'https://wa.me/79991234567' },
      { platform: 'Instagram', url: 'https://instagram.com/zabota_center' }
    ]
  },
  licenses: [
    {
      number: 'ЛО-77-01-012345',
      issueDate: '2023-01-15',
      expirationDate: '2026-01-14',
      status: 'active',
      type: 'Социальные услуги',
      issuer: 'Министерство здравоохранения Российской Федерации',
      scope: ['Социальное обслуживание', 'Психологическая помощь', 'Юридические консультации', 'Реабилитационные услуги']
    },
    {
      number: 'СО-77-02-054321',
      issueDate: '2022-06-20',
      expirationDate: '2025-06-19',
      status: 'active',
      type: 'Медицинская деятельность',
      issuer: 'Федеральная служба по надзору в сфере здравоохранения',
      scope: ['Патронажный уход', 'Медицинские процедуры', 'Реабилитация', 'Экстренная помощь']
    },
    {
      number: 'МЗ-77-03-078956',
      issueDate: '2024-01-10',
      expirationDate: '2024-12-31',
      status: 'active',
      type: 'Психологическая помощь',
      issuer: 'Департамент здравоохранения города Москвы',
      scope: ['Психологическое консультирование', 'Кризисная помощь', 'Семейная терапия', 'Групповая терапия']
    },
    {
      number: 'ЮЛ-77-04-045612',
      issueDate: '2023-03-01',
      expirationDate: '2026-03-01',
      status: 'active',
      type: 'Юридические услуги',
      issuer: 'Министерство юстиции Российской Федерации',
      scope: ['Юридические консультации', 'Представительство в судах', 'Правовая поддержка', 'Документальное сопровождение']
    }
  ],
  statistics: {
    employees: 89,
    clients: 15842,
    services: 45,
    branches: 12,
    satisfaction: 4.7,
    responseTime: 2.3,
    completionRate: 94.5,
    monthlyGrowth: 8.2
  },
  financial: {
    budget: 45000000,
    funding: 38700000,
    expenses: 36500000,
    profit: 2200000,
    quarterly: [
      { quarter: 'Q1 2024', income: 9500000, expenses: 8900000 },
      { quarter: 'Q2 2024', income: 9800000, expenses: 9200000 },
      { quarter: 'Q3 2024', income: 10200000, expenses: 9500000 },
      { quarter: 'Q4 2024', income: 9200000, expenses: 8900000 }
    ]
  },
  description: 'Крупнейший центр социального обслуживания в Москве, предоставляющий комплексные услуги пожилым гражданам, инвалидам и семьям с детьми. Наша организация работает с 2010 года и зарекомендовала себя как надежный партнер в сфере социальной защиты. Мы объединяем профессионалов, готовых оказать помощь и поддержку в самых сложных жизненных ситуациях.',
  mission: 'Обеспечение качественной и доступной социальной поддержки для улучшения жизни граждан, нуждающихся в помощи и сопровождении. Мы стремимся создавать комфортную и безопасную среду для каждого, кто обращается к нам за помощью.',
  values: [
    'Профессионализм и компетентность',
    'Уважение и эмпатия к каждому клиенту',
    'Инновации и постоянное развитие',
    'Социальная ответственность и этика',
    'Прозрачность и открытость в работе',
    'Командная работа и взаимопомощь'
  ],
  achievements: [
    { year: 2023, achievement: 'Лучший социальный центр Москвы по версии Минтруда' },
    { year: 2022, achievement: 'Премия за инновации в социальной работе' },
    { year: 2021, achievement: 'Сертификат качества обслуживания ISO 9001:2015' },
    { year: 2020, achievement: 'Награда за вклад в развитие города Москвы' },
    { year: 2019, achievement: 'Победитель конкурса "Социальные инновации"' }
  ],
  partners: [
    { name: 'Департамент социальной защиты Москвы', type: 'Государственный', since: '2010' },
    { name: 'Фонд поддержки пожилых людей', type: 'НКО', since: '2012' },
    { name: 'Медицинский центр "Здоровье"', type: 'Частный', since: '2015' },
    { name: 'Университет социальных наук', type: 'Образовательный', since: '2018' }
  ],
  socialMedia: {
    followers: 12500,
    engagement: 8.7,
    growth: 12.3
  },
  awards: [
    { year: 2023, name: 'Лучший социальный центр Москвы', issuer: 'Минтруд' },
    { year: 2022, name: 'Премия за инновации', issuer: 'Социальные технологии' },
    { year: 2021, name: 'Золотой стандарт качества', issuer: 'Росстандарт' }
  ]
};

const departments: Department[] = [
  {
    id: 'dept-1',
    name: 'Отдел социального сопровождения',
    head: 'Петров Алексей Владимирович',
    employees: 23,
    services: 12,
    status: 'active',
    description: 'Оказание комплексной помощи пожилым гражданам и инвалидам на дому. Включает социально-бытовые, социально-медицинские и социально-психологические услуги. Специалисты отдела обеспечивают индивидуальный подход к каждому клиенту.',
    contactEmail: 'soc.soprovod@zabota-center.ru',
    phone: '+7 (495) 123-45-68',
    budget: 12500000,
    location: 'г. Москва, ул. Ленина, д. 42, оф. 16',
    established: '2010-05-20',
    goals: [
      'Увеличить охват услуг на 15% в 2024 году',
      'Внедрить цифровое сопровождение клиентов',
      'Повысить удовлетворенность клиентов до 95%',
      'Обучить 100% сотрудников новым методикам работы'
    ],
    challenges: [
      'Нехватка квалифицированных сотрудников',
      'Увеличение нагрузки на специалистов',
      'Необходимость обновления оборудования',
      'Расширение географии обслуживания'
    ],
    performance: {
      efficiency: 87,
      satisfaction: 92,
      growth: 12
    },
    team: [
      { role: 'Социальный работник', count: 15 },
      { role: 'Координатор', count: 4 },
      { role: 'Психолог', count: 2 },
      { role: 'Администратор', count: 2 }
    ]
  },
  {
    id: 'dept-2',
    name: 'Медико-социальный отдел',
    head: 'Сидорова Елена Ивановна',
    employees: 18,
    services: 8,
    status: 'active',
    description: 'Оказание медицинских услуг и патронажного ухода. Профессиональный медицинский персонал обеспечивает квалифицированную помощь на дому. Отдел оснащен современным медицинским оборудованием.',
    contactEmail: 'med.social@zabota-center.ru',
    phone: '+7 (495) 123-45-69',
    budget: 9800000,
    location: 'г. Москва, ул. Ленина, д. 42, оф. 17',
    established: '2011-02-15',
    goals: [
      'Внедрить телемедицинские консультации',
      'Снизить время ожидания услуг до 24 часов',
      'Повысить качество медицинской помощи на 20%',
      'Расширить перечень медицинских процедур'
    ],
    challenges: [
      'Сложности с получением медицинских лицензий',
      'Высокие требования к оборудованию',
      'Необходимость постоянного обучения персонала',
      'Соблюдение медицинских стандартов'
    ],
    performance: {
      efficiency: 91,
      satisfaction: 88,
      growth: 8
    },
    team: [
      { role: 'Медсестра', count: 10 },
      { role: 'Врач-терапевт', count: 4 },
      { role: 'Реабилитолог', count: 2 },
      { role: 'Координатор', count: 2 }
    ]
  },
  {
    id: 'dept-3',
    name: 'Психологическая служба',
    head: 'Козлов Дмитрий Сергеевич',
    employees: 12,
    services: 6,
    status: 'active',
    description: 'Психологическая поддержка и консультирование граждан. Индивидуальные и групповые занятия, кризисное вмешательство, семейное консультирование. Используются современные психологические методики.',
    contactEmail: 'psy.service@zabota-center.ru',
    phone: '+7 (495) 123-45-70',
    budget: 5600000,
    location: 'г. Москва, ул. Ленина, д. 42, оф. 18',
    established: '2012-09-10',
    goals: [
      'Внедрить онлайн-консультации',
      'Разработать 5 новых терапевтических программ',
      'Повысить доступность услуг для удаленных районов',
      'Провести 20 групповых тренингов'
    ],
    challenges: [
      'Высокая нагрузка на психологов',
      'Необходимость супервизии',
      'Сложные случаи клиентов',
      'Поддержание конфиденциальности'
    ],
    performance: {
      efficiency: 85,
      satisfaction: 94,
      growth: 15
    },
    team: [
      { role: 'Психолог', count: 8 },
      { role: 'Психотерапевт', count: 2 },
      { role: 'Координатор', count: 1 },
      { role: 'Супервизор', count: 1 }
    ]
  },
  {
    id: 'dept-4',
    name: 'Юридическая консультация',
    head: 'Николаева Анна Михайловна',
    employees: 8,
    services: 5,
    status: 'active',
    description: 'Бесплатные юридические консультации для льготных категорий граждан. Помощь в оформлении документов, защита прав, представительство в судах. Специализация на социальном и жилищном праве.',
    contactEmail: 'law.consult@zabota-center.ru',
    phone: '+7 (495) 123-45-71',
    budget: 3200000,
    location: 'г. Москва, ул. Ленина, д. 42, оф. 19',
    established: '2013-01-25',
    goals: [
      'Увеличить количество успешных дел на 25%',
      'Внедрить электронный документооборот',
      'Расширить спектр юридических услуг',
      'Повысить квалификацию юристов'
    ],
    challenges: [
      'Изменения в законодательстве',
      'Большой объем документации',
      'Сложные судебные процессы',
      'Необходимость постоянного обучения'
    ],
    performance: {
      efficiency: 89,
      satisfaction: 91,
      growth: 10
    },
    team: [
      { role: 'Юрист', count: 6 },
      { role: 'Адвокат', count: 1 },
      { role: 'Помощник юриста', count: 1 }
    ]
  },
  {
    id: 'dept-5',
    name: 'Отдел реабилитации',
    head: 'Федоров Игорь Васильевич',
    employees: 15,
    services: 7,
    status: 'restructuring',
    description: 'Реабилитационные программы для людей с ограниченными возможностями. Социальная, медицинская и профессиональная реабилитация. Индивидуальные программы восстановления.',
    contactEmail: 'rehabilitation@zabota-center.ru',
    phone: '+7 (495) 123-45-72',
    budget: 7500000,
    location: 'г. Москва, ул. Ленина, д. 42, оф. 20',
    established: '2014-06-15',
    goals: [
      'Завершить реорганизацию к июлю 2024',
      'Внедрить новые реабилитационные методики',
      'Увеличить количество клиентов на 30%',
      'Создать доступную среду'
    ],
    challenges: [
      'Реорганизация структуры отдела',
      'Нехватка специализированного оборудования',
      'Адаптация программ под новые стандарты',
      'Привлечение квалифицированных кадров'
    ],
    performance: {
      efficiency: 78,
      satisfaction: 85,
      growth: 5
    },
    team: [
      { role: 'Реабилитолог', count: 8 },
      { role: 'Инструктор ЛФК', count: 4 },
      { role: 'Эрготерапевт', count: 2 },
      { role: 'Координатор', count: 1 }
    ]
  },
  {
    id: 'dept-6',
    name: 'Административно-хозяйственный отдел',
    head: 'Громова Ольга Павловна',
    employees: 13,
    services: 7,
    status: 'active',
    description: 'Обеспечение функционирования организации. Управление персоналом, бухгалтерия, закупки, техническое обслуживание. Поддержание инфраструктуры организации.',
    contactEmail: 'admin@zabota-center.ru',
    phone: '+7 (495) 123-45-73',
    budget: 6800000,
    location: 'г. Москва, ул. Ленина, д. 42, оф. 21',
    established: '2010-03-15',
    goals: [
      'Автоматизировать 80% административных процессов',
      'Снизить операционные расходы на 10%',
      'Внедрить систему электронного документооборота',
      'Повысить эффективность управления ресурсами'
    ],
    challenges: [
      'Управление большим количеством объектов',
      'Соблюдение требований законодательства',
      'Оптимизация расходов',
      'Координация работы между отделами'
    ],
    performance: {
      efficiency: 92,
      satisfaction: 87,
      growth: 6
    },
    team: [
      { role: 'Бухгалтер', count: 3 },
      { role: 'HR-специалист', count: 2 },
      { role: 'IT-специалист', count: 2 },
      { role: 'Завхоз', count: 2 },
      { role: 'Секретарь', count: 4 }
    ]
  }
];

const services: Service[] = [
  {
    id: 'srv-1',
    name: 'Социальное сопровождение пожилых',
    category: 'Социальные услуги',
    status: 'active',
    clients: 4560,
    rating: 4.9,
    price: 0,
    description: 'Комплексное сопровождение граждан пожилого возраста на дому.',
    detailedDescription: 'Наша услуга социального сопровождения включает полный цикл поддержки пожилых граждан: от помощи в бытовых вопросах до организации досуга и социальной адаптации. Мы понимаем, что каждый клиент уникален, поэтому разрабатываем индивидуальные программы сопровождения с учетом физических возможностей, психологического состояния и социальных потребностей. Наши специалисты помогают с покупкой продуктов и лекарств, приготовлением пищи, уборкой помещения, сопровождением в медицинские учреждения и организацией социального общения.',
    requirements: [
      'Возраст старше 65 лет',
      'Наличие московской прописки',
      'Отсутствие близких родственников, способных оказать помощь',
      'Наличие медицинских показаний'
    ],
    duration: 'Постоянно',
    department: 'dept-1',
    coverage: [
      'Все районы Москвы',
      'Круглосуточная поддержка по телефону',
      'Выезд специалиста в течение 2 часов',
      'Дистанционное консультирование'
    ],
    tags: ['пожилые', 'сопровождение', 'бытовая помощь', 'социальная адаптация', 'уход'],
    features: [
      'Индивидуальный план сопровождения',
      'Регулярные визиты специалиста',
      'Экстренная помощь 24/7',
      'Социально-психологическая поддержка',
      'Мониторинг состояния здоровья'
    ],
    process: [
      'Первичная консультация и оценка потребностей',
      'Разработка индивидуального плана сопровождения',
      'Заключение договора на обслуживание',
      'Регулярные визиты и поддержка',
      'Ежеквартальный пересмотр плана',
      'Корректировка программы по необходимости'
    ],
    documents: [
      'Паспорт',
      'Медицинская карта',
      'Справка о доходах',
      'Заявление на обслуживание',
      'Заключение врачебной комиссии'
    ],
    statistics: {
      monthlyGrowth: 5.2,
      completionRate: 96.8,
      satisfaction: 4.9,
      repeatClients: 87
    },
    reviews: [
      {
        client: 'Анна Петровна, 78 лет',
        rating: 5,
        comment: 'Очень благодарна специалистам за внимание и заботу. Помогают с покупками и уборкой, всегда на связи.',
        date: '2024-01-15'
      },
      {
        client: 'Иван Сергеевич, 82 года',
        rating: 5,
        comment: 'Отличная служба! Особенно ценю помощь с посещением поликлиники и оформлением документов.',
        date: '2024-01-10'
      }
    ]
  },
  {
    id: 'srv-2',
    name: 'Патронажный медицинский уход',
    category: 'Медицинские услуги',
    status: 'active',
    clients: 2890,
    rating: 4.7,
    price: 1500,
    description: 'Квалифицированный медицинский уход на дому.',
    detailedDescription: 'Профессиональный медицинский уход для пациентов, нуждающихся в постоянном наблюдении и медицинских процедурах. Наши медицинские сестры и врачи обеспечивают квалифицированную помощь на дому, включая проведение процедур, контроль приема лекарств, перевязки, инъекции и мониторинг состояния здоровья. Мы работаем в тесном контакте с лечащими врачами и при необходимости организуем консультации специалистов.',
    requirements: [
      'Направление от лечащего врача',
      'Медицинские показания для патронажного ухода',
      'Заключение врачебной комиссии',
      'Наличие медицинского полиса'
    ],
    duration: 'Курс 10-30 дней',
    department: 'dept-2',
    coverage: [
      'ЦАО, САО, СВАО',
      'Рабочие дни 8:00-20:00',
      'Экстренные вызовы 24/7',
      'Выезд в течение 1 часа'
    ],
    tags: ['медицина', 'уход', 'процедуры', 'патронаж', 'здоровье'],
    features: [
      'Квалифицированные медицинские сестры',
      'Индивидуальный план ухода',
      'Координация с лечащим врачом',
      'Медицинский мониторинг',
      'Экстренная помощь'
    ],
    process: [
      'Консультация врача и оценка состояния',
      'Разработка плана медицинского ухода',
      'Назначение медицинской сестры',
      'Регулярные визиты и процедуры',
      'Контроль эффективности лечения',
      'Корректировка плана при необходимости'
    ],
    documents: [
      'Направление от врача',
      'Медицинская карта',
      'Полис ОМС',
      'Заключение медицинской комиссии',
      'Заявление на обслуживание'
    ],
    statistics: {
      monthlyGrowth: 8.5,
      completionRate: 94.2,
      satisfaction: 4.7,
      repeatClients: 72
    },
    reviews: [
      {
        client: 'Мария Ивановна',
        rating: 5,
        comment: 'Очень профессиональные медсестры. Помогли маме после операции, все процедуры делали аккуратно.',
        date: '2024-01-12'
      },
      {
        client: 'Сергей Петрович',
        rating: 4,
        comment: 'Хороший сервис, но иногда приходилось ждать специалиста дольше обещанного времени.',
        date: '2024-01-08'
      }
    ]
  },
  {
    id: 'srv-3',
    name: 'Психологическое консультирование',
    category: 'Психологические услуги',
    status: 'active',
    clients: 1900,
    rating: 4.8,
    price: 0,
    description: 'Индивидуальные и групповые психологические консультации.',
    detailedDescription: 'Профессиональная психологическая помощь для решения различных жизненных трудностей. Наши психологи и психотерапевты работают с широким спектром проблем: стресс, тревожность, депрессия, семейные конфликты, возрастные кризисы, проблемы адаптации. Мы используем проверенные методики и индивидуальный подход к каждому клиенту, обеспечивая комфортную и безопасную среду для работы над проблемами.',
    requirements: [
      'Запись по телефону или онлайн',
      'Предварительная консультация',
      'Согласие на психологическую работу',
      'Возраст от 18 лет'
    ],
    duration: '1-2 часа',
    department: 'dept-3',
    coverage: [
      'Все районы Москвы',
      'Онлайн консультации',
      'Очные встречи в центре',
      'Групповые занятия'
    ],
    tags: ['психология', 'консультации', 'поддержка', 'терапия', 'самопомощь'],
    features: [
      'Индивидуальные консультации',
      'Групповая терапия',
      'Семейное консультирование',
      'Кризисная помощь',
      'Онлайн поддержка'
    ],
    process: [
      'Первичная консультация и диагностика',
      'Определение целей работы',
      'Разработка индивидуального плана',
      'Регулярные сессии',
      'Оценка прогресса',
      'Завершение работы'
    ],
    documents: [
      'Паспорт',
      'Заявление на консультацию',
      'Согласие на обработку данных',
      'Анкета клиента'
    ],
    statistics: {
      monthlyGrowth: 12.3,
      completionRate: 89.7,
      satisfaction: 4.8,
      repeatClients: 65
    },
    reviews: [
      {
        client: 'Аноним',
        rating: 5,
        comment: 'Очень помогли справиться с тревогой. Специалист внимательный и профессиональный.',
        date: '2024-01-14'
      },
      {
        client: 'Екатерина',
        rating: 5,
        comment: 'Благодарю за поддержку в сложный период жизни. Очень тактичный и компетентный психолог.',
        date: '2024-01-09'
      }
    ]
  }
];

const employees: Employee[] = [
  {
    id: 'emp-1',
    name: 'Иванова Мария Петровна',
    position: 'Директор',
    department: 'Администрация',
    email: 'm.ivanova@zabota-center.ru',
    phone: '+7 (495) 123-45-67',
    status: 'active',
    hireDate: '2010-03-15',
    salary: 120000,
    skills: ['Стратегическое планирование', 'Управление персоналом', 'Бюджетирование', 'Социальная работа', 'Лидерство'],
    education: [
      { degree: 'Высшее', institution: 'МГУ им. Ломоносова, факультет психологии', year: 2005 },
      { degree: 'MBA', institution: 'Высшая школа экономики', year: 2010 },
      { degree: 'Повышение квалификации', institution: 'Академия государственной службы', year: 2018 }
    ],
    projects: [
      { name: 'Цифровизация социальных услуг', role: 'Руководитель', duration: '2022-2024' },
      { name: 'Расширение сети филиалов', role: 'Координатор', duration: '2018-2020' },
      { name: 'Внедрение системы качества', role: 'Инициатор', duration: '2015-2016' }
    ],
    performance: {
      rating: 4.9,
      completedTasks: 156,
      efficiency: 95
    },
    certifications: [
      'Сертификат ISO 9001:2015',
      'Диплом о профессиональной переподготовке по социальному менеджменту',
      'Сертификат "Эффективное управление"'
    ]
  },
  {
    id: 'emp-2',
    name: 'Петров Алексей Владимирович',
    position: 'Начальник отдела социального сопровождения',
    department: 'Социальное сопровождение',
    email: 'a.petrov@zabota-center.ru',
    phone: '+7 (495) 123-45-68',
    status: 'active',
    hireDate: '2012-08-20',
    salary: 85000,
    skills: ['Управление командой', 'Социальная работа', 'Координация услуг', 'Работа с пожилыми', 'Кризисное вмешательство'],
    education: [
      { degree: 'Высшее', institution: 'РГСУ, факультет социальной работы', year: 2010 },
      { degree: 'Повышение квалификации', institution: 'Институт дополнительного образования', year: 2015 }
    ],
    projects: [
      { name: 'Программа "Активное долголетие"', role: 'Руководитель', duration: '2021-2023' },
      { name: 'Внедрение мобильного приложения', role: 'Координатор', duration: '2020-2021' }
    ],
    performance: {
      rating: 4.7,
      completedTasks: 134,
      efficiency: 92
    },
    certifications: [
      'Сертификат "Гериатрический уход"',
      'Диплом "Социальное сопровождение"',
      'Сертификат "Управление в социальной сфере"'
    ]
  }
];

const branches: Branch[] = [
  {
    id: 'branch-1',
    name: 'Центральный филиал',
    address: 'г. Москва, ул. Ленина, д. 42',
    manager: 'Петров Алексей Владимирович',
    employees: 25,
    services: 35,
    contact: {
      phone: '+7 (495) 123-45-67',
      email: 'central@zabota-center.ru'
    },
    hours: {
      weekdays: '09:00 - 20:00',
      weekend: '10:00 - 18:00'
    },
    facilities: ['Конференц-зал', 'Медицинский кабинет', 'Комната психологической разгрузки', 'Библиотека', 'Кафе'],
    servicesOffered: ['Все виды социальных услуг', 'Медицинская помощь', 'Психологическое консультирование', 'Юридические консультации']
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
  pink: '236, 72, 153',
  cyan: '34, 211, 238'
} as const;

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const formatCurrency = (value: number) => currencyFormatter.format(value);
const formatNumber = (value: number) => new Intl.NumberFormat('ru-RU').format(value);

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
  type?: 'default' | 'department' | 'service' | 'employee' | 'organization';
  size?: 'default' | 'small' | 'large';
  pulse?: boolean;
}) => {
  const getStatusConfig = () => {
    const configs = {
      active: { color: COLORS.success, label: 'Активен', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '🟢' },
      suspended: { color: COLORS.warning, label: 'Приостановлен', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '🟡' },
      inactive: { color: COLORS.error, label: 'Неактивен', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '🔴' },
      development: { color: COLORS.blue, label: 'В разработке', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '🛠️' },
      restructuring: { color: COLORS.orange, label: 'Реорганизация', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '🔄' },
      state: { color: COLORS.blue, label: 'Государственная', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '🏛️' },
      municipal: { color: COLORS.teal, label: 'Муниципальная', bg: 'bg-teal-500/10', border: 'border-teal-500/20', icon: '🏢' },
      private: { color: COLORS.purple, label: 'Частная', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: '💼' },
      npo: { color: COLORS.emerald, label: 'НКО', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: '🤝' },
      vacation: { color: COLORS.orange, label: 'В отпуске', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '🏖️' },
      sick: { color: COLORS.rose, label: 'На больничном', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: '🏥' },
      remote: { color: COLORS.blue, label: 'Удаленно', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '🏠' }
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
  type?: 'departments' | 'services' | 'employees';
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    department: 'all'
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
              <option value="social">Социальные</option>
              <option value="medical">Медицинские</option>
              <option value="psychological">Психологические</option>
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
                <label className="text-white/60 text-sm mb-2 block">Бюджетный диапазон</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любой</option>
                  <option>До 5 млн ₽</option>
                  <option>5-10 млн ₽</option>
                  <option>Более 10 млн ₽</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Количество сотрудников</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любое</option>
                  <option>До 10 чел.</option>
                  <option>10-20 чел.</option>
                  <option>Более 20 чел.</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Эффективность</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любая</option>
                  <option>Высокая (&gt;85%)</option>
                  <option>Средняя (70-85%)</option>
                  <option>Низкая (&lt;70%)</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Дата основания</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любая</option>
                  <option>До 2015</option>
                  <option>2015-2020</option>
                  <option>После 2020</option>
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
    { id: 1, type: 'warning', message: 'Требуется обновление лицензии', time: '5 мин назад' },
    { id: 2, type: 'info', message: 'Новый отдел добавлен в систему', time: '1 час назад' },
    { id: 3, type: 'success', message: 'Отчет по финансам сгенерирован', time: '2 часа назад' }
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
const DepartmentCard = ({ department, onClick, delay = 0 }: { department: Department; onClick: () => void; delay?: number }) => {
  const getDepartmentColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.blue;
      case 'inactive': return COLORS.error;
      case 'restructuring': return COLORS.orange;
      default: return COLORS.gray;
    }
  };

  const isHighPerformance = department.performance.efficiency > 85;

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
        <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
          <span className="text-lg">
            {department.name.includes('социальн') && '👥'}
            {department.name.includes('медико') && '🏥'}
            {department.name.includes('психолог') && '🧠'}
            {department.name.includes('юридическ') && '⚖️'}
            {department.name.includes('реабилитац') && '🔄'}
            {department.name.includes('административ') && '📊'}
          </span>
          <div className="min-w-0">
            <h4 className="text-white font-semibold text-sm truncate">{department.name}</h4>
            <p className="text-white/60 text-xs">{department.location}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={department.status} type="department" size="small" />
          <StatusBadge status={isHighPerformance ? 'active' : 'inactive'} size="small" pulse={isHighPerformance} />
        </div>
      </div>
      
      <div className="space-y-1.5 text-xs text-white/60 mb-3">
        <div className="flex justify-between">
          <span>Руководитель:</span>
          <span className="text-white/80 truncate ml-2 max-w-[100px] sm:max-w-[120px]">{department.head}</span>
        </div>
        <div className="flex justify-between">
          <span>Сотрудников:</span>
          <span className="text-white/80">{department.employees} чел.</span>
        </div>
        <div className="flex justify-between">
          <span>Услуг:</span>
          <span className="text-white/80">{department.services} ед.</span>
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
        value={department.performance.satisfaction} 
        label="Удовлетворенность"
        color={department.performance.satisfaction > 90 ? COLORS.success : department.performance.satisfaction > 80 ? COLORS.orange : COLORS.error}
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
          Управление
        </motion.button>
      </div>

      {isHighPerformance && (
        <div className="mt-3 p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <p className="text-emerald-300 text-xs text-center">Высокая эффективность</p>
        </div>
      )}
    </BentoCard>
  );
};

const ServiceCard = ({ service, onClick, delay = 0 }: { service: Service; onClick: () => void; delay?: number }) => {
  const getServiceColor = (category: string) => {
    switch (category) {
      case 'Социальные услуги': return COLORS.blue;
      case 'Медицинские услуги': return COLORS.emerald;
      case 'Психологические услуги': return COLORS.purple;
      default: return COLORS.gray;
    }
  };

  const isPopular = service.clients > 2000;

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
            {service.category.includes('социальн') && '👥'}
            {service.category.includes('медицинск') && '🏥'}
            {service.category.includes('психологическ') && '🧠'}
            {service.category.includes('юридическ') && '⚖️'}
          </span>
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
          <span>Стоимость:</span>
          <span className="text-white/80">
            {service.price > 0 ? formatCurrency(service.price) : 'Бесплатно'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Клиентов:</span>
          <span className="text-white/80">{formatNumber(service.clients)}</span>
        </div>
        <div className="flex justify-between">
          <span>Рейтинг:</span>
          <span className="text-white/80 flex items-center gap-1">
            ⭐ {service.rating}/5.0
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Выполнение:</span>
          <div className="flex items-center gap-2">
            <ProgressBar 
              value={service.statistics.completionRate} 
              max={100}
              color={getServiceColor(service.category)}
              size="small"
            />
            <span className="text-white/80 text-xs w-8">{service.statistics.completionRate}%</span>
          </div>
        </div>
      </div>
      
      <ProgressBar 
        value={service.statistics.satisfaction * 20} 
        label="Удовлетворенность"
        color={service.statistics.satisfaction > 4.5 ? COLORS.success : service.statistics.satisfaction > 4.0 ? COLORS.orange : COLORS.error}
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
          className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs py-1.5 px-2 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Заказать
        </motion.button>
      </div>

      {isPopular && (
        <div className="mt-3 p-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <p className="text-orange-300 text-xs text-center">Популярная услуга</p>
        </div>
      )}
    </BentoCard>
  );
};

const EmployeeCard = ({ employee, onClick, delay = 0 }: { employee: Employee; onClick: () => void; delay?: number }) => {
  const getEmployeeColor = (department: string) => {
    switch (department) {
      case 'Администрация': return COLORS.purple;
      case 'Социальное сопровождение': return COLORS.blue;
      case 'Медико-социальный отдел': return COLORS.emerald;
      case 'Психологическая служба': return COLORS.pink;
      case 'Юридическая консультация': return COLORS.orange;
      case 'Отдел реабилитации': return COLORS.teal;
      case 'Административно-хозяйственный отдел': return COLORS.indigo;
      default: return COLORS.gray;
    }
  };

  const isHighPerformer = employee.performance.rating >= 4.5;

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
          <span className="text-white/80">
            {Math.floor((new Date().getTime() - new Date(employee.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} лет
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Рейтинг:</span>
          <span className="text-white/80 flex items-center gap-1">
            ⭐ {employee.performance.rating}/5.0
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Эффективность:</span>
          <span className="text-white/80">{employee.performance.efficiency}%</span>
        </div>

        <div className="flex justify-between">
          <span>Зарплата:</span>
          <span className="text-white/80">{formatCurrency(employee.salary)}</span>
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
          Написать
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

// Модальные окна
const DepartmentModal = ({ department, isOpen, onClose }: {
  department: Department | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!department) return null;

  const departmentServices = services.filter(service => service.department === department.id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={department.name} size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <StatusBadge status={department.status} type="department" />
            <StatusBadge status={department.performance.efficiency > 85 ? 'active' : 'inactive'} />
            <span className="text-white/60 text-sm bg-white/5 px-2 sm:px-3 py-1 rounded-full">
              {department.employees} сотрудников
            </span>
            <span className="text-white/60 text-sm bg-blue-500/10 px-2 sm:px-3 py-1 rounded-full">
              {department.services} услуг
            </span>
          </div>
          <div className="text-white/60 text-sm">
            ID: {department.id}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Описание отдела</h3>
              <p className="text-white/70 leading-relaxed text-sm sm:text-base">{department.description}</p>
            </div>

            {department.goals && department.goals.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Цели на год</h3>
                <ul className="space-y-2 text-sm">
                  {department.goals.map((goal, index) => (
                    <li key={index} className="text-white/70 flex items-start gap-2">
                      <span className="text-green-400 mt-1 flex-shrink-0">•</span>
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {department.team && department.team.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Команда отдела</h3>
                <div className="grid grid-cols-2 gap-2">
                  {department.team.map((member, index) => (
                    <div key={index} className="flex justify-between text-sm bg-white/5 p-2 rounded-lg">
                      <span className="text-white/70">{member.role}:</span>
                      <span className="text-white font-medium">{member.count} чел.</span>
                    </div>
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
                  <span className="text-white/60">Руководитель:</span>
                  <span className="text-white font-medium text-right">{department.head}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Телефон:</span>
                  <span className="text-white font-medium">{department.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Email:</span>
                  <span className="text-white font-medium text-right break-all">{department.contactEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Местоположение:</span>
                  <span className="text-white font-medium text-right">{department.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Дата основания:</span>
                  <span className="text-white font-medium">{new Date(department.established).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>
            </BentoCard>

            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Показатели эффективности</h4>
              <div className="space-y-3">
                <ProgressBar value={department.performance.efficiency} label="Эффективность" color={COLORS.blue} size="small" />
                <ProgressBar value={department.performance.satisfaction} label="Удовлетворенность" color={COLORS.emerald} size="small" />
                <ProgressBar value={department.performance.growth} label="Рост" color={COLORS.purple} size="small" />
              </div>
            </BentoCard>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{department.employees}</div>
            <div className="text-white/60 text-xs">Сотрудников</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{department.services}</div>
            <div className="text-white/60 text-xs">Услуг</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{formatCurrency(department.budget)}</div>
            <div className="text-white/60 text-xs">Бюджет</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">
              {Math.round((department.performance.efficiency + department.performance.satisfaction + department.performance.growth) / 3)}%
            </div>
            <div className="text-white/60 text-xs">Общая эффективность</div>
          </BentoCard>
        </div>

        {departmentServices.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Услуги отдела ({departmentServices.length})</h3>
            <div className="grid gap-2 sm:gap-3">
              {departmentServices.map(service => (
                <BentoCard key={service.id} variant="compact" className="p-3" magnetic>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm truncate">{service.name}</h4>
                      <p className="text-white/60 text-xs truncate">{service.clients} клиентов • {service.rating}⭐</p>
                    </div>
                    <StatusBadge status={service.status} type="service" size="small" />
                  </div>
                </BentoCard>
              ))}
            </div>
          </div>
        )}

        {department.challenges && department.challenges.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Текущие вызовы</h3>
            <ul className="space-y-2 text-sm">
              {department.challenges.map((challenge, index) => (
                <li key={index} className="text-white/70 flex items-start gap-2">
                  <span className="text-orange-400 mt-1 flex-shrink-0">•</span>
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/10">
          <motion.button 
            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Редактировать отдел
          </motion.button>
          <motion.button 
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Управление сотрудниками
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
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!service) return null;

  const department = departments.find(dept => dept.id === service.department);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={service.name} size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <StatusBadge status={service.status} type="service" />
            <StatusBadge status={service.category} />
            <span className="text-white/60 text-sm bg-white/5 px-2 sm:px-3 py-1 rounded-full">
              {service.duration}
            </span>
            {service.rating > 0 && (
              <span className="text-white/60 text-sm bg-yellow-500/10 px-2 sm:px-3 py-1 rounded-full flex items-center gap-1">
                ⭐ {service.rating}/5.0
              </span>
            )}
            <span className="text-white/60 text-sm bg-blue-500/10 px-2 sm:px-3 py-1 rounded-full">
              {formatNumber(service.clients)} клиентов
            </span>
          </div>
          <div className="text-white/60 text-sm">
            ID: {service.id}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Описание услуги</h3>
              <p className="text-white/70 leading-relaxed text-sm sm:text-base">{service.detailedDescription}</p>
            </div>

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

            {service.features && service.features.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Возможности услуги</h3>
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

            {service.documents && service.documents.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Необходимые документы</h3>
                <ul className="space-y-2 text-sm">
                  {service.documents.map((doc, index) => (
                    <li key={index} className="text-white/70 flex items-start gap-2">
                      <span className="text-purple-400 mt-1 flex-shrink-0">•</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Основная информация</h4>
              <div className="space-y-2 text-xs sm:text-sm text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/60">Категория:</span>
                  <span className="text-white font-medium">{service.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Отдел:</span>
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
                  <span className="text-white/60">Клиентов:</span>
                  <span className="text-white font-medium">{formatNumber(service.clients)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Рейтинг:</span>
                  <span className="text-white font-medium flex items-center gap-1">
                    ⭐ {service.rating}
                  </span>
                </div>
              </div>
            </BentoCard>

            {service.coverage && service.coverage.length > 0 && (
              <BentoCard variant="compact" magnetic>
                <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Зона охвата</h4>
                <ul className="space-y-2 text-sm">
                  {service.coverage.map((area, index) => (
                    <li key={index} className="text-white/70 flex items-start gap-2">
                      <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </BentoCard>
            )}

            {service.statistics && (
              <BentoCard variant="compact" magnetic>
                <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Показатели эффективности</h4>
                <div className="space-y-3">
                  <ProgressBar value={service.statistics.monthlyGrowth} label="Месячный рост" color={COLORS.success} size="small" />
                  <ProgressBar value={service.statistics.completionRate} label="Выполнение" color={COLORS.blue} size="small" />
                  <ProgressBar value={service.statistics.satisfaction * 20} label="Удовлетворенность" color={COLORS.emerald} size="small" />
                  <ProgressBar value={service.statistics.repeatClients} label="Повторные обращения" color={COLORS.purple} size="small" />
                </div>
              </BentoCard>
            )}

            {service.tags && service.tags.length > 0 && (
              <BentoCard variant="compact" magnetic>
                <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Теги</h4>
                <div className="flex flex-wrap gap-1.5">
                  {service.tags.map((tag, index) => (
                    <span key={index} className="text-white/60 text-xs bg-white/5 px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </BentoCard>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{service.clients}</div>
            <div className="text-white/60 text-xs">Клиентов</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{service.rating}/5.0</div>
            <div className="text-white/60 text-xs">Рейтинг</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{service.statistics.completionRate}%</div>
            <div className="text-white/60 text-xs">Выполнение</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">
              {service.statistics.monthlyGrowth}%
            </div>
            <div className="text-white/60 text-xs">Рост</div>
          </BentoCard>
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
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Отзывы клиентов</h3>
            <div className="grid gap-3">
              {service.reviews.map((review, index) => (
                <BentoCard key={index} variant="compact" className="p-3" magnetic>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-white font-medium text-sm">{review.client}</h4>
                      <p className="text-white/60 text-xs">{new Date(review.date).toLocaleDateString('ru-RU')}</p>
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

const EmployeesModal = ({ isOpen, onClose }: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Сотрудники организации" size="xl">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-white/60 text-sm">Всего сотрудников: {employees.length}</p>
            <p className="text-white/60 text-xs">Активных: {employees.filter(e => e.status === 'active').length}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-sm w-full sm:w-auto">
              + Добавить сотрудника
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-sm w-full sm:w-auto">
              Экспорт в Excel
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4">
          {employees.map(employee => (
            <BentoCard key={employee.id} variant="compact" className="p-3 sm:p-4" magnetic>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-sm sm:text-base truncate">{employee.name}</h4>
                    <p className="text-white/60 text-xs sm:text-sm truncate">{employee.position}</p>
                    <p className="text-white/40 text-xs truncate">{employee.department}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-white/60 text-sm">{employee.email}</p>
                    <p className="text-white/60 text-sm">{employee.phone}</p>
                  </div>
                  <StatusBadge status={employee.status} type="employee" />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 text-xs sm:text-sm text-white/60 gap-2">
                <div className="flex flex-wrap gap-4">
                  <span>Принят: {new Date(employee.hireDate).toLocaleDateString('ru-RU')}</span>
                  <span>Зарплата: {formatCurrency(employee.salary)}</span>
                  <span>Рейтинг: {employee.performance.rating}/5</span>
                  <span>Эффективность: {employee.performance.efficiency}%</span>
                </div>
              </div>

              {employee.skills && employee.skills.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <div className="flex flex-wrap gap-1">
                    {employee.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="text-white/60 text-xs bg-white/5 px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                    {employee.skills.length > 3 && (
                      <span className="text-white/40 text-xs bg-white/5 px-2 py-1 rounded-full">
                        +{employee.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </BentoCard>
          ))}
        </div>
      </div>
    </Modal>
  );
};

const OrganizationModal = ({ isOpen, onClose }: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Об организации" size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Описание</h3>
              <p className="text-white/70 leading-relaxed text-sm sm:text-base">{organizationData.description}</p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Миссия</h3>
              <p className="text-white/70 italic text-sm sm:text-base">"{organizationData.mission}"</p>
            </div>

            {organizationData.values && organizationData.values.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Ценности</h3>
                <ul className="space-y-2 text-sm">
                  {organizationData.values.map((value, index) => (
                    <li key={index} className="text-white/70 flex items-start gap-2">
                      <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {organizationData.partners && organizationData.partners.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Партнеры</h3>
                <div className="grid gap-2">
                  {organizationData.partners.map((partner, index) => (
                    <div key={index} className="flex justify-between text-sm bg-white/5 p-2 rounded-lg">
                      <span className="text-white/70">{partner.name}</span>
                      <span className="text-white/60 text-xs">{partner.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Контакты</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div>
                  <span className="text-white/60 block mb-1">Телефоны:</span>
                  {organizationData.contacts.phone.map((phone, index) => (
                    <p key={index} className="text-white font-medium">{phone}</p>
                  ))}
                </div>
                <div>
                  <span className="text-white/60 block mb-1">Email:</span>
                  {organizationData.contacts.email.map((email, index) => (
                    <p key={index} className="text-white font-medium break-all">{email}</p>
                  ))}
                </div>
                <div>
                  <span className="text-white/60 block mb-1">Сайт:</span>
                  <p className="text-white font-medium">{organizationData.contacts.website}</p>
                </div>
                {organizationData.contacts.social && organizationData.contacts.social.length > 0 && (
                  <div>
                    <span className="text-white/60 block mb-1">Социальные сети:</span>
                    <div className="flex flex-wrap gap-2">
                      {organizationData.contacts.social.map((social, index) => (
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

            {organizationData.achievements && organizationData.achievements.length > 0 && (
              <BentoCard variant="compact" magnetic>
                <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Достижения</h4>
                <div className="space-y-2 text-sm">
                  {organizationData.achievements.map((achievement, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-white/60">{achievement.year}:</span>
                      <span className="text-white font-medium text-right">{achievement.achievement}</span>
                    </div>
                  ))}
                </div>
              </BentoCard>
            )}

            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Статистика организации</h4>
              <div className="space-y-3">
                <ProgressBar value={organizationData.statistics.satisfaction * 20} label="Удовлетворенность клиентов" color={COLORS.emerald} size="small" />
                <ProgressBar value={organizationData.statistics.completionRate} label="Выполнение услуг" color={COLORS.blue} size="small" />
                <ProgressBar value={organizationData.statistics.monthlyGrowth} label="Месячный рост" color={COLORS.purple} size="small" />
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

// Основной компонент Dashboard
const OrganizationSocialOwner = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'services' | 'finance' | 'employees' | 'analytics'>('overview');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isEmployeesModalOpen, setIsEmployeesModalOpen] = useState(false);
  const [isOrganizationModalOpen, setIsOrganizationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    department: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Имитация загрузки данных
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Статистика для дашборда
  const stats = useMemo(() => {
    const totalRevenue = organizationData.financial.funding;
    const activeDepartments = departments.filter(dept => dept.status === 'active').length;
    const activeEmployees = employees.filter(e => e.status === 'active').length;
    const activeServices = services.filter(s => s.status === 'active').length;
    const totalClients = organizationData.statistics.clients;

    return {
      totalRevenue,
      activeDepartments,
      activeEmployees,
      activeServices,
      totalClients
    };
  }, []);

  // Фильтрация данных
  const filteredDepartments = useMemo(() => {
    return departments.filter(department => {
      const matchesSearch = department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          department.head.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status === 'all' || department.status === filters.status;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, filters]);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status === 'all' || service.status === filters.status;
      const matchesCategory = filters.category === 'all' || service.category === filters.category;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, filters]);

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: '📊', color: COLORS.blue },
    { id: 'departments' as const, label: 'Подразделения', icon: '🏢', color: COLORS.purple },
    { id: 'services' as const, label: 'Услуги', icon: '🎯', color: COLORS.emerald },
    { id: 'finance' as const, label: 'Финансы', icon: '💰', color: COLORS.orange },
    { id: 'employees' as const, label: 'Сотрудники', icon: '👥', color: COLORS.teal },
    { id: 'analytics' as const, label: 'Аналитика', icon: '📈', color: COLORS.cyan }
  ];

  const handleDepartmentClick = (department: Department) => {
    setSelectedDepartment(department);
    setIsDepartmentModalOpen(true);
  };

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEmployeesModalOpen(true);
  };

  const closeDepartmentModal = () => {
    setIsDepartmentModalOpen(false);
    setSelectedDepartment(null);
  };

  const closeServiceModal = () => {
    setIsServiceModalOpen(false);
    setSelectedService(null);
  };

  const closeEmployeeModal = () => {
    setIsEmployeesModalOpen(false);
    setSelectedEmployee(null);
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
            Загрузка данных организации...
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
        {/* Organization Header */}
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
                    🏢
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <motion.h1 
                      className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 break-words gradient-text"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {organizationData.name}
                    </motion.h1>
                    <motion.p 
                      className="text-white/60 text-xs sm:text-sm lg:text-base"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {organizationData.description}
                    </motion.p>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Миссия</h3>
                    <p className="text-white/70 italic text-xs sm:text-sm">"{organizationData.mission}"</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 text-white/70">
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Директор</p>
                      <p className="text-white font-medium text-sm">{organizationData.director}</p>
                    </div>
                    <div>
                      <p className="text-white/50 mb-1 text-xs">ИНН</p>
                      <p className="text-white font-medium text-sm">{organizationData.taxId}</p>
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Дата основания</p>
                      <p className="text-white font-medium text-sm">
                        {new Date(organizationData.foundationDate).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Рег. номер</p>
                      <p className="text-white font-medium text-sm">{organizationData.registrationNumber}</p>
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
                      <span className="text-white font-medium text-right">{organizationData.contacts.phone[0]}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/50">Email:</span>
                      <span className="text-white font-medium text-right break-all">{organizationData.contacts.email[0]}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/50">Сайт:</span>
                      <span className="text-white font-medium text-right break-all">{organizationData.contacts.website}</span>
                    </div>
                  </div>
                </BentoCard>
                
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                  <motion.button 
                    className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
                    onClick={() => setIsOrganizationModalOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Подробнее об организации
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
              title="Общий бюджет"
              value={<AnimatedCounter value={stats.totalRevenue} format="currency" />}
              change={18}
              chartData={revenueData}
              color={COLORS.emerald}
            />
            <MetricCard
              title="Подразделения"
              value={`${stats.activeDepartments}/${departments.length}`}
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
              title="Активные услуги"
              value={stats.activeServices}
              change={8}
              chartData={[85, 78, 92, 89, 76, 82, 88]}
              color={COLORS.orange}
            />
            <MetricCard
              title="Клиентов"
              value={<AnimatedCounter value={stats.totalClients} />}
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
        {(activeTab === 'departments' || activeTab === 'services') && (
          <SearchAndFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            placeholder={`Поиск ${activeTab === 'departments' ? 'подразделений' : 'услуг'}...`}
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
                    { icon: '🏢', title: 'Подразделения', description: `${departments.length} отделов`, color: COLORS.purple, action: () => setActiveTab('departments') },
                    { icon: '🎯', title: 'Услуги', description: `${services.length} в каталоге`, color: COLORS.emerald, action: () => setActiveTab('services') },
                    { icon: '👥', title: 'Сотрудники', description: `${employees.length} человек`, color: COLORS.teal, action: () => setActiveTab('employees') },
                    { icon: '💰', title: 'Финансы', description: 'Бюджет и отчеты', color: COLORS.orange, action: () => setActiveTab('finance') },
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

                {/* Departments & Services Preview */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-white">Активные подразделения</h2>
                      <motion.button 
                        className="text-purple-300 hover:text-purple-200 text-xs sm:text-sm transition-colors"
                        onClick={() => setActiveTab('departments')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Все подразделения →
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {departments
                        .filter(dept => dept.status === 'active')
                        .sort((a, b) => b.performance.efficiency - a.performance.efficiency)
                        .slice(0, 4)
                        .map((department, index) => (
                        <DepartmentCard 
                          key={department.id} 
                          department={department} 
                          onClick={() => handleDepartmentClick(department)}
                          delay={index * 0.1}
                        />
                      ))}
                    </div>
                  </div>

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {services
                        .filter(service => service.status === 'active')
                        .sort((a, b) => b.clients - a.clients)
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
                </div>

                {/* Employees & Finance Preview */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-white">Ключевые сотрудники</h2>
                      <motion.button 
                        className="text-teal-300 hover:text-teal-200 text-xs sm:text-sm transition-colors"
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
                        .sort((a, b) => b.performance.rating - a.performance.rating)
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
                      <h2 className="text-lg sm:text-xl font-semibold text-white">Финансовые показатели</h2>
                      <motion.button 
                        className="text-orange-300 hover:text-orange-200 text-xs sm:text-sm transition-colors"
                        onClick={() => setActiveTab('finance')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Подробнее →
                      </motion.button>
                    </div>
                    <div className="space-y-3">
                      <BentoCard className="p-4" magnetic>
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-white font-semibold text-sm">Бюджет организации</h4>
                            <p className="text-white/60 text-xs">Годовой бюджет 2024</p>
                          </div>
                                                  <div className="text-right">
                            <div className="text-lg font-bold text-white">
                              {formatCurrency(organizationData.financial.budget)}
                            </div>
                            <div className="text-green-400 text-xs">+12.5% с прошлого года</div>
                          </div>
                        </div>
                        <ProgressBar 
                          value={75} 
                          label="Использовано бюджета" 
                          color={COLORS.orange}
                          size="small"
                          animated
                        />
                      </BentoCard>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <BentoCard className="p-3 text-center" magnetic>
                          <div className="text-emerald-400 text-lg font-bold">
                            {formatCurrency(organizationData.financial.funding)}
                          </div>
                          <div className="text-white/60 text-xs">Финансирование</div>
                        </BentoCard>
                        <BentoCard className="p-3 text-center" magnetic>
                          <div className="text-red-400 text-lg font-bold">
                            {formatCurrency(organizationData.financial.expenses)}
                          </div>
                          <div className="text-white/60 text-xs">Расходы</div>
                        </BentoCard>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'departments' && (
              <motion.div
                className="space-y-4 sm:space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Подразделения организации</h2>
                    <p className="text-white/60 text-sm">
                      {filteredDepartments.length} из {departments.length} подразделений
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button 
                      className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      + Новый отдел
                    </motion.button>
                    <motion.button 
                      className="bg-white/10 hover:bg-white/20 text-white px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Экспорт
                    </motion.button>
                  </div>
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
                  <motion.div 
                    className="text-center py-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-white text-lg font-semibold mb-2">Подразделения не найдены</h3>
                        <p className="text-white/60">Попробуйте изменить параметры поиска или фильтры</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'services' && (
                  <motion.div
                    className="space-y-4 sm:space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Услуги организации</h2>
                        <p className="text-white/60 text-sm">
                          {filteredServices.length} из {services.length} услуг
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <motion.button 
                          className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          + Новая услуга
                        </motion.button>
                        <motion.button 
                          className="bg-white/10 hover:bg-white/20 text-white px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Экспорт
                        </motion.button>
                      </div>
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
                      <motion.div 
                        className="text-center py-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-white text-lg font-semibold mb-2">Услуги не найдены</h3>
                        <p className="text-white/60">Попробуйте изменить параметры поиска или фильтры</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'finance' && (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Финансовые показатели</h2>
                        <p className="text-white/60 text-sm">Бюджет, расходы и финансирование организации</p>
                      </div>
                      <div className="flex gap-2">
                        <motion.button 
                          className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 px-4 py-2 rounded-xl transition-colors font-medium text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Создать отчет
                        </motion.button>
                        <motion.button 
                          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Экспорт в Excel
                        </motion.button>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <BentoCard className="p-6" magnetic>
                          <h3 className="text-white font-semibold mb-4 text-lg">Квартальные показатели 2024</h3>
                          <div className="space-y-4">
                            {organizationData.financial.quarterly.map((quarter, index) => (
                              <div key={quarter.quarter} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-300 text-sm font-bold">
                                    Q{index + 1}
                                  </div>
                                  <div>
                                    <div className="text-white font-medium">{quarter.quarter}</div>
                                    <div className="text-white/60 text-xs">
                                      Доход: {formatCurrency(quarter.income)} • Расход: {formatCurrency(quarter.expenses)}
                                    </div>
                                  </div>
                                </div>
                                <div className={`text-right ${
                                  quarter.income > quarter.expenses ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  <div className="font-bold">
                                    {formatCurrency(quarter.income - quarter.expenses)}
                                  </div>
                                  <div className="text-xs">
                                    {quarter.income > quarter.expenses ? 'Прибыль' : 'Убыток'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </BentoCard>
                      </div>

                      <div className="space-y-6">
                        <BentoCard className="p-6 text-center" magnetic>
                          <div className="text-3xl font-bold text-white mb-2">
                            {formatCurrency(organizationData.financial.budget)}
                          </div>
                          <div className="text-white/60 mb-4">Общий бюджет</div>
                          <ProgressBar value={65} label="Использовано" color={COLORS.blue} />
                        </BentoCard>

                        <BentoCard className="p-6" magnetic>
                          <h4 className="text-white font-semibold mb-4">Распределение бюджета</h4>
                          <div className="space-y-3">
                            {departments.slice(0, 4).map(dept => (
                              <div key={dept.id} className="flex justify-between items-center">
                                <span className="text-white/70 text-sm">{dept.name}</span>
                                <span className="text-white font-medium text-sm">
                                  {formatCurrency(dept.budget)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </BentoCard>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <StatCard
                        title="Общее финансирование"
                        value={formatCurrency(organizationData.financial.funding)}
                        change={8.2}
                        icon="💰"
                        color={COLORS.emerald}
                        trend="up"
                      />
                      <StatCard
                        title="Общие расходы"
                        value={formatCurrency(organizationData.financial.expenses)}
                        change={-3.1}
                        icon="📊"
                        color={COLORS.orange}
                        trend="down"
                      />
                      <StatCard
                        title="Чистая прибыль"
                        value={formatCurrency(organizationData.financial.profit || 0)}
                        change={15.7}
                        icon="📈"
                        color={COLORS.blue}
                        trend="up"
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'employees' && (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Сотрудники организации</h2>
                        <p className="text-white/60 text-sm">
                          {employees.length} сотрудников • {employees.filter(e => e.status === 'active').length} активных
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <motion.button 
                          className="bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-300 px-4 py-2 rounded-xl transition-colors font-medium text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsEmployeesModalOpen(true)}
                        >
                          + Новый сотрудник
                        </motion.button>
                        <motion.button 
                          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Оргструктура
                        </motion.button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {employees.map((employee, index) => (
                        <EmployeeCard 
                          key={employee.id} 
                          employee={employee} 
                          onClick={() => handleEmployeeClick(employee)}
                          delay={index * 0.05}
                        />
                      ))}
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mt-6">
                      <StatCard
                        title="Активные сотрудники"
                        value={employees.filter(e => e.status === 'active').length}
                        change={5.2}
                        icon="👥"
                        color={COLORS.blue}
                        size="compact"
                        trend="up"
                      />
                      <StatCard
                        title="Средний рейтинг"
                        value={(employees.reduce((acc, emp) => acc + emp.performance.rating, 0) / employees.length).toFixed(1)}
                        change={2.1}
                        icon="⭐"
                        color={COLORS.orange}
                        size="compact"
                        trend="up"
                      />
                      <StatCard
                        title="Эффективность"
                        value={`${Math.round(employees.reduce((acc, emp) => acc + emp.performance.efficiency, 0) / employees.length)}%`}
                        change={3.8}
                        icon="📊"
                        color={COLORS.emerald}
                        size="compact"
                        trend="up"
                      />
                      <StatCard
                        title="Задачи выполнено"
                        value={employees.reduce((acc, emp) => acc + emp.performance.completedTasks, 0)}
                        change={12.4}
                        icon="✅"
                        color={COLORS.purple}
                        size="compact"
                        trend="up"
                      />
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Аналитика и отчеты</h2>
                        <p className="text-white/60 text-sm">Ключевые метрики и производительность организации</p>
                      </div>
                      <div className="flex gap-2">
                        <motion.button 
                          className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 px-4 py-2 rounded-xl transition-colors font-medium text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Создать отчет
                        </motion.button>
                        <motion.button 
                          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Экспорт данных
                        </motion.button>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                      <BentoCard className="p-6" magnetic>
                        <h3 className="text-white font-semibold mb-4 text-lg">Эффективность подразделений</h3>
                        <div className="space-y-4">
                          {departments
                            .sort((a, b) => b.performance.efficiency - a.performance.efficiency)
                            .map(dept => (
                              <div key={dept.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-300 text-sm">
                                    {dept.name.includes('социальн') && '👥'}
                                    {dept.name.includes('медико') && '🏥'}
                                    {dept.name.includes('психолог') && '🧠'}
                                    {dept.name.includes('юридическ') && '⚖️'}
                                  </div>
                                  <div>
                                    <div className="text-white font-medium text-sm">{dept.name}</div>
                                    <div className="text-white/60 text-xs">{dept.employees} сотрудников</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-white font-bold">{dept.performance.efficiency}%</div>
                                  <div className="text-white/60 text-xs">эффективность</div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </BentoCard>

                      <BentoCard className="p-6" magnetic>
                        <h3 className="text-white font-semibold mb-4 text-lg">Статистика услуг</h3>
                        <div className="space-y-4">
                          {services
                            .sort((a, b) => b.clients - a.clients)
                            .slice(0, 5)
                            .map(service => (
                              <div key={service.id} className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="text-white font-medium text-sm truncate">{service.name}</div>
                                  <div className="text-white/60 text-xs">{service.category}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-white font-bold">{formatNumber(service.clients)}</div>
                                  <div className="text-white/60 text-xs">клиентов</div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </BentoCard>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <MetricCard
                        title="Удовлетворенность"
                        value={`${organizationData.statistics.satisfaction}/5`}
                        change={4.2}
                        chartData={[85, 88, 92, 89, 91, 94, 96]}
                        color={COLORS.emerald}
                      />
                      <MetricCard
                        title="Время ответа"
                        value={`${organizationData.statistics.responseTime}ч`}
                        change={-12.5}
                        chartData={[3.2, 2.8, 2.5, 2.4, 2.3, 2.2, 2.1]}
                        color={COLORS.blue}
                      />
                      <MetricCard
                        title="Выполнение услуг"
                        value={`${organizationData.statistics.completionRate}%`}
                        change={2.8}
                        chartData={[89, 91, 92, 93, 94, 94, 95]}
                        color={COLORS.purple}
                      />
                      <MetricCard
                        title="Рост клиентов"
                        value={`${organizationData.statistics.monthlyGrowth}%`}
                        change={8.7}
                        chartData={[65, 68, 72, 75, 78, 82, 85]}
                        color={COLORS.orange}
                      />
                    </div>

                    <BentoCard className="p-6" magnetic>
                      <h3 className="text-white font-semibold mb-4 text-lg">Ключевые показатели организации</h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white mb-1">
                            <AnimatedCounter value={organizationData.statistics.employees} />
                          </div>
                          <div className="text-white/60 text-sm">Сотрудников</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white mb-1">
                            <AnimatedCounter value={organizationData.statistics.clients} />
                          </div>
                          <div className="text-white/60 text-sm">Клиентов</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white mb-1">
                            {organizationData.statistics.branches}
                          </div>
                          <div className="text-white/60 text-sm">Филиалов</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white mb-1">
                            {organizationData.statistics.services}
                          </div>
                          <div className="text-white/60 text-sm">Услуг</div>
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

          <EmployeesModal
            isOpen={isEmployeesModalOpen}
            onClose={() => setIsEmployeesModalOpen(false)}
          />

          <OrganizationModal
            isOpen={isOrganizationModalOpen}
            onClose={() => setIsOrganizationModalOpen(false)}
          />
        </div>
      );
    };

    export default OrganizationSocialOwner;