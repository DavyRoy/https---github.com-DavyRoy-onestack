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

// Типы данных для автосервиса
interface AutoService {
  id: string;
  name: string;
  category: 'maintenance' | 'repair' | 'diagnostics' | 'bodywork' | 'tires' | 'electrical' | 'premium';
  description: string;
  status: 'active' | 'development' | 'paused' | 'closed';
  serviceTypes: string[];
  duration: {
    min: number;
    max: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  price: {
    base: number;
    currency: 'RUB' | 'USD' | 'EUR';
    partsIncluded: boolean;
    warranty: string;
  };
  requirements: string[];
  specialists: string[];
  equipment: string[];
  metrics: {
    satisfaction: number;
    onTimeRate: number;
    successRate: number;
  };
  capacity: number;
  currentAppointments: number;
}

interface AutoClient {
  id: string;
  name: string;
  type: 'individual' | 'business' | 'corporate';
  contact: {
    phone: string;
    email?: string;
    address: string;
  };
  vehicles: ClientVehicle[];
  preferences: {
    serviceTime: string[];
    contactMethod: 'phone' | 'email' | 'sms';
    notes?: string;
  };
  serviceHistory: ServiceOrder[];
  loyalty: {
    points: number;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    discount: number;
  };
  status: 'active' | 'inactive' | 'blocked';
  lastService?: string;
  totalServices: number;
}

interface ClientVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  mileage: number;
  lastService: string;
  serviceInterval: number;
}

interface ServiceOrder {
  id: string;
  clientId: string;
  vehicleId: string;
  serviceId: string;
  mechanicId?: string;
  items: ServiceItem[];
  status: 'pending' | 'confirmed' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
  timeline: {
    created: string;
    confirmed?: string;
    scheduled?: string;
    inProgress?: string;
    ready?: string;
    completed?: string;
  };
  appointment: {
    date: string;
    time: string;
    estimatedDuration: string;
    actualDuration?: string;
  };
  payment: {
    amount: number;
    method: 'cash' | 'card' | 'online' | 'invoice';
    status: 'pending' | 'paid' | 'refunded';
    partsCost?: number;
    laborCost: number;
  };
  notes?: string;
  rating?: number;
}

interface ServiceItem {
  id: string;
  name: string;
  type: 'service' | 'part' | 'consumable';
  quantity: number;
  price: number;
  warranty?: string;
  description?: string;
}

interface Mechanic {
  id: string;
  name: string;
  specialization: string[];
  contact: {
    phone: string;
    email: string;
  };
  qualifications: {
    level: 'junior' | 'middle' | 'senior' | 'master';
    certifications: string[];
    experience: number;
  };
  status: 'active' | 'offline' | 'busy' | 'break' | 'vacation';
  currentLocation?: {
    bay: string;
    station: string;
  };
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
    completedServices: number;
    onTimeRate: number;
    reworkRate: number;
  };
  currentOrders: string[];
  maxOrders: number;
}

interface ServiceBay {
  id: string;
  name: string;
  type: 'standard' | 'premium' | 'bodywork' | 'diagnostics' | 'tire';
  equipment: string[];
  status: 'operational' | 'maintenance' | 'out_of_service' | 'occupied';
  specifications: {
    maxVehicleWeight: number;
    supportedTypes: string[];
    specialFeatures: string[];
  };
  lastMaintenance: string;
  nextMaintenance: string;
  currentMechanic?: string;
  utilization: number;
}

// Моки данных для автосервиса
const autoServices: AutoService[] = [
  {
    id: 'as-001',
    name: 'Техническое обслуживание',
    category: 'maintenance',
    description: 'Комплексное техническое обслуживание автомобиля с заменой жидкостей и фильтров',
    status: 'active',
    serviceTypes: ['Замена масла', 'Замена фильтров', 'Диагностика', 'Регулировка'],
    duration: {
      min: 60,
      max: 120,
      unit: 'minutes'
    },
    price: {
      base: 2500,
      currency: 'RUB',
      partsIncluded: false,
      warranty: '6 месяцев'
    },
    requirements: ['Предварительная запись', 'Проверка VIN'],
    specialists: ['Автомеханик', 'Диагност'],
    equipment: ['Подъемник', 'Диагностическое оборудование'],
    metrics: {
      satisfaction: 95,
      onTimeRate: 92,
      successRate: 98
    },
    capacity: 8,
    currentAppointments: 6
  },
  {
    id: 'as-002',
    name: 'Диагностика автомобиля',
    category: 'diagnostics',
    description: 'Компьютерная диагностика всех систем автомобиля с выдачей отчета',
    status: 'active',
    serviceTypes: ['Компьютерная диагностика', 'Проверка систем', 'Функциональный тест'],
    duration: {
      min: 30,
      max: 90,
      unit: 'minutes'
    },
    price: {
      base: 1500,
      currency: 'RUB',
      partsIncluded: true,
      warranty: '1 месяц'
    },
    requirements: ['Заправленный автомобиль', 'Рабочий аккумулятор'],
    specialists: ['Диагност', 'Электрик'],
    equipment: ['Диагностический сканер', 'Осциллограф', 'Мультиметр'],
    metrics: {
      satisfaction: 93,
      onTimeRate: 95,
      successRate: 99
    },
    capacity: 12,
    currentAppointments: 9
  },
  {
    id: 'as-003',
    name: 'Ремонт двигателя',
    category: 'repair',
    description: 'Капитальный и текущий ремонт двигателей любой сложности',
    status: 'active',
    serviceTypes: ['Капитальный ремонт', 'Текущий ремонт', 'Замена ГРМ', 'Ремонт головки блока'],
    duration: {
      min: 4,
      max: 24,
      unit: 'hours'
    },
    price: {
      base: 8000,
      currency: 'RUB',
      partsIncluded: false,
      warranty: '12 месяцев'
    },
    requirements: ['Диагностика', 'Согласование стоимости'],
    specialists: ['Моторист', 'Механик'],
    equipment: ['Стенд для ремонта двигателей', 'Пресс', 'Специнструмент'],
    metrics: {
      satisfaction: 91,
      onTimeRate: 88,
      successRate: 96
    },
    capacity: 4,
    currentAppointments: 3
  },
  {
    id: 'as-004',
    name: 'Кузовной ремонт',
    category: 'bodywork',
    description: 'Восстановление геометрии кузова и покраска после ДТП',
    status: 'active',
    serviceTypes: ['Восстановление геометрии', 'Покраска', 'Рихтовка', 'Замена элементов'],
    duration: {
      min: 1,
      max: 5,
      unit: 'days'
    },
    price: {
      base: 15000,
      currency: 'RUB',
      partsIncluded: false,
      warranty: '24 месяца'
    },
    requirements: ['Страховой случай', 'Фотографии повреждений'],
    specialists: ['Маляр', 'Жестянщик', 'Колорист'],
    equipment: ['Стапель', 'Покрасочная камера', 'Сварочное оборудование'],
    metrics: {
      satisfaction: 94,
      onTimeRate: 85,
      successRate: 97
    },
    capacity: 3,
    currentAppointments: 2
  },
  {
    id: 'as-005',
    name: 'Шиномонтаж и балансировка',
    category: 'tires',
    description: 'Сезонная замена шин, ремонт проколов и балансировка колес',
    status: 'active',
    serviceTypes: ['Замена шин', 'Балансировка', 'Ремонт проколов', 'Хранение шин'],
    duration: {
      min: 30,
      max: 60,
      unit: 'minutes'
    },
    price: {
      base: 800,
      currency: 'RUB',
      partsIncluded: true,
      warranty: '3 месяца'
    },
    requirements: ['Чистые диски', 'Свободный доступ к колесам'],
    specialists: ['Шиномонтажник'],
    equipment: ['Шиномонтажный станок', 'Балансировочный станок', 'Компрессор'],
    metrics: {
      satisfaction: 96,
      onTimeRate: 98,
      successRate: 99
    },
    capacity: 15,
    currentAppointments: 12
  },
  {
    id: 'as-006',
    name: 'Электрика и электроника',
    category: 'electrical',
    description: 'Диагностика и ремонт электрических систем и электрооборудования',
    status: 'active',
    serviceTypes: ['Ремонт проводки', 'Диагностика ЭБУ', 'Установка оборудования', 'Ремонт стартеров/генераторов'],
    duration: {
      min: 1,
      max: 6,
      unit: 'hours'
    },
    price: {
      base: 3000,
      currency: 'RUB',
      partsIncluded: false,
      warranty: '6 месяцев'
    },
    requirements: ['Описание проблемы', 'История ремонтов'],
    specialists: ['Автоэлектрик', 'Электронщик'],
    equipment: ['Осциллограф', 'Мультиметр', 'Паяльное оборудование'],
    metrics: {
      satisfaction: 92,
      onTimeRate: 90,
      successRate: 95
    },
    capacity: 6,
    currentAppointments: 4
  },
  {
    id: 'as-007',
    name: 'Премиум обслуживание',
    category: 'premium',
    description: 'Обслуживание премиальных автомобилей в отдельных боксах с повышенным комфортом',
    status: 'active',
    serviceTypes: ['Полное ТО', 'Химчистка', 'Детейлинг', 'Консьерж-сервис'],
    duration: {
      min: 2,
      max: 8,
      unit: 'hours'
    },
    price: {
      base: 12000,
      currency: 'RUB',
      partsIncluded: true,
      warranty: '12 месяцев'
    },
    requirements: ['Премиум автомобиль', 'Предварительная запись'],
    specialists: ['Старший механик', 'Детейлер', 'Консьерж'],
    equipment: ['Премиум бокс', 'Детейлинговое оборудование', 'Диагностика премиум'],
    metrics: {
      satisfaction: 98,
      onTimeRate: 96,
      successRate: 99
    },
    capacity: 2,
    currentAppointments: 1
  }
];

const autoClients: AutoClient[] = [
  {
    id: 'acl-001',
    name: 'Иванов Сергей Петрович',
    type: 'individual',
    contact: {
      phone: '+7 (916) 123-45-67',
      email: 's.ivanov@mail.ru',
      address: 'г. Москва, ул. Ленина, д. 15, кв. 34'
    },
    vehicles: [
      {
        id: 'vhl-001',
        brand: 'Toyota',
        model: 'Camry',
        year: 2020,
        vin: 'JTDBU4E40L9012345',
        licensePlate: 'A123BC777',
        mileage: 45000,
        lastService: '2024-05-15',
        serviceInterval: 15000
      }
    ],
    preferences: {
      serviceTime: ['09:00-12:00', '15:00-18:00'],
      contactMethod: 'phone',
      notes: 'Звонить за день до записи'
    },
    serviceHistory: [],
    loyalty: {
      points: 850,
      tier: 'silver',
      discount: 7
    },
    status: 'active',
    lastService: '2024-05-15',
    totalServices: 8
  },
  {
    id: 'acl-002',
    name: 'ООО "БизнесАвто"',
    type: 'corporate',
    contact: {
      phone: '+7 (495) 234-56-78',
      email: 'service@businessauto.ru',
      address: 'г. Москва, пр. Мира, д. 125, оф. 304'
    },
    vehicles: [
      {
        id: 'vhl-002',
        brand: 'Mercedes-Benz',
        model: 'V-Class',
        year: 2022,
        vin: 'W1NY0F0B0NA123456',
        licensePlate: 'B456DE777',
        mileage: 25000,
        lastService: '2024-06-01',
        serviceInterval: 20000
      },
      {
        id: 'vhl-003',
        brand: 'BMW',
        model: 'X5',
        year: 2021,
        vin: 'WBACY71070L789012',
        licensePlate: 'C789FG777',
        mileage: 38000,
        lastService: '2024-05-20',
        serviceInterval: 15000
      }
    ],
    preferences: {
      serviceTime: ['10:00-17:00'],
      contactMethod: 'email'
    },
    serviceHistory: [],
    loyalty: {
      points: 3500,
      tier: 'platinum',
      discount: 15
    },
    status: 'active',
    totalServices: 25
  },
  {
    id: 'acl-003',
    name: 'Петрова Анна Владимировна',
    type: 'individual',
    contact: {
      phone: '+7 (925) 345-67-89',
      email: 'a.petrova@gmail.com',
      address: 'г. Москва, ул. Пушкина, д. 67, кв. 12'
    },
    vehicles: [
      {
        id: 'vhl-004',
        brand: 'Hyundai',
        model: 'Solaris',
        year: 2019,
        vin: 'Z94CB41BAKR123456',
        licensePlate: 'E123KX777',
        mileage: 65000,
        lastService: '2024-04-10',
        serviceInterval: 15000
      }
    ],
    preferences: {
      serviceTime: ['18:00-20:00', 'выходные'],
      contactMethod: 'sms',
      notes: 'Только оригинальные запчасти'
    },
    serviceHistory: [],
    loyalty: {
      points: 420,
      tier: 'bronze',
      discount: 3
    },
    status: 'active',
    lastService: '2024-04-10',
    totalServices: 5
  }
];

const mechanics: Mechanic[] = [
  {
    id: 'mec-001',
    name: 'Кузнецов Алексей Викторович',
    specialization: ['Двигатель', 'Трансмиссия', 'Ходовая часть'],
    contact: {
      phone: '+7 (916) 111-22-33',
      email: 'a.kuznetsov@autoservice.ru'
    },
    qualifications: {
      level: 'master',
      certifications: ['Диагност высшей категории', 'Специалист по Toyota/Lexus'],
      experience: 12
    },
    status: 'busy',
    currentLocation: {
      bay: 'Бокс 1',
      station: 'Подъемник 2'
    },
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      hours: '08:00-17:00'
    },
    ratings: {
      average: 4.9,
      count: 234,
      lastMonth: 4.8
    },
    metrics: {
      completedServices: 1256,
      onTimeRate: 94,
      reworkRate: 2
    },
    currentOrders: ['sord-001'],
    maxOrders: 3
  },
  {
    id: 'mec-002',
    name: 'Смирнова Ольга Дмитриевна',
    specialization: ['Электрика', 'Электроника', 'Диагностика'],
    contact: {
      phone: '+7 (925) 222-33-44',
      email: 'o.smirnova@autoservice.ru'
    },
    qualifications: {
      level: 'senior',
      certifications: ['Автоэлектрик', 'Специалист по VAG'],
      experience: 8
    },
    status: 'active',
    currentLocation: {
      bay: 'Диагностический бокс',
      station: 'Пост 1'
    },
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      hours: '09:00-18:00'
    },
    ratings: {
      average: 4.8,
      count: 189,
      lastMonth: 4.9
    },
    metrics: {
      completedServices: 892,
      onTimeRate: 96,
      reworkRate: 1
    },
    currentOrders: ['sord-002'],
    maxOrders: 4
  },
  {
    id: 'mec-003',
    name: 'Петров Дмитрий Сергеевич',
    specialization: ['Кузовной ремонт', 'Покраска', 'Восстановление геометрии'],
    contact: {
      phone: '+7 (916) 333-44-55',
      email: 'd.petrov@autoservice.ru'
    },
    qualifications: {
      level: 'senior',
      certifications: ['Маляр-жестянщик', 'Колорист'],
      experience: 10
    },
    status: 'active',
    schedule: {
      days: ['Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      hours: '08:00-16:00'
    },
    ratings: {
      average: 4.7,
      count: 156,
      lastMonth: 4.6
    },
    metrics: {
      completedServices: 678,
      onTimeRate: 88,
      reworkRate: 3
    },
    currentOrders: [],
    maxOrders: 2
  }
];

const serviceBays: ServiceBay[] = [
  {
    id: 'bay-001',
    name: 'Стандартный бокс 1',
    type: 'standard',
    equipment: ['Подъемник 2-стоечный', 'Диагностический сканер', 'Компрессор'],
    status: 'occupied',
    specifications: {
      maxVehicleWeight: 3000,
      supportedTypes: ['Легковые автомобили', 'Кроссоверы'],
      specialFeatures: ['Система вентиляции', 'Противопожарная система']
    },
    lastMaintenance: '2024-05-20',
    nextMaintenance: '2024-08-20',
    currentMechanic: 'mec-001',
    utilization: 85
  },
  {
    id: 'bay-002',
    name: 'Диагностический бокс',
    type: 'diagnostics',
    equipment: ['Диагностический стенд', 'Осциллограф', 'Газоанализатор', 'Стенд проверки АКБ'],
    status: 'operational',
    specifications: {
      maxVehicleWeight: 2500,
      supportedTypes: ['Все типы автомобилей'],
      specialFeatures: ['Компьютеризированная диагностика', 'База данных ошибок']
    },
    lastMaintenance: '2024-06-01',
    nextMaintenance: '2024-09-01',
    currentMechanic: 'mec-002',
    utilization: 75
  },
  {
    id: 'bay-003',
    name: 'Покрасочная камера',
    type: 'bodywork',
    equipment: ['Покрасочная камера', 'Стапель', 'Сварочный аппарат', 'Шлифовальные станки'],
    status: 'operational',
    specifications: {
      maxVehicleWeight: 3500,
      supportedTypes: ['Легковые автомобили', 'Внедорожники'],
      specialFeatures: ['Система фильтрации', 'Температурный контроль', 'Влажность контроля']
    },
    lastMaintenance: '2024-05-15',
    nextMaintenance: '2024-08-15',
    utilization: 60
  },
  {
    id: 'bay-004',
    name: 'Премиум бокс',
    type: 'premium',
    equipment: ['4-стоечный подъемник', 'Премиум диагностика', 'Детейлинговое оборудование'],
    status: 'operational',
    specifications: {
      maxVehicleWeight: 2800,
      supportedTypes: ['Премиум автомобили', 'Спорткары'],
      specialFeatures: ['Кондиционирование', 'Зона ожидания клиента', 'Wi-Fi']
    },
    lastMaintenance: '2024-06-10',
    nextMaintenance: '2024-09-10',
    utilization: 45
  }
];

const serviceOrders: ServiceOrder[] = [
  {
    id: 'sord-001',
    clientId: 'acl-001',
    vehicleId: 'vhl-001',
    serviceId: 'as-001',
    mechanicId: 'mec-001',
    items: [
      {
        id: 'sitem-001',
        name: 'Замена моторного масла',
        type: 'service',
        quantity: 1,
        price: 1200,
        description: 'Замена синтетического масла 5W-30'
      },
      {
        id: 'sitem-002',
        name: 'Замена масляного фильтра',
        type: 'part',
        quantity: 1,
        price: 450,
        warranty: '12 месяцев'
      },
      {
        id: 'sitem-003',
        name: 'Замена воздушного фильтра',
        type: 'part',
        quantity: 1,
        price: 850,
        warranty: '12 месяцев'
      }
    ],
    status: 'in_progress',
    timeline: {
      created: '2024-06-18T08:00:00Z',
      confirmed: '2024-06-18T08:15:00Z',
      scheduled: '2024-06-18T09:00:00Z',
      inProgress: '2024-06-18T09:30:00Z'
    },
    appointment: {
      date: '2024-06-18',
      time: '09:00',
      estimatedDuration: '1.5 часа'
    },
    payment: {
      amount: 2500,
      method: 'card',
      status: 'pending',
      partsCost: 1300,
      laborCost: 1200
    },
    notes: 'Клиент просит проверить тормозные колодки'
  },
  {
    id: 'sord-002',
    clientId: 'acl-002',
    vehicleId: 'vhl-002',
    serviceId: 'as-002',
    mechanicId: 'mec-002',
    items: [
      {
        id: 'sitem-004',
        name: 'Компьютерная диагностика',
        type: 'service',
        quantity: 1,
        price: 1500,
        description: 'Полная диагностика всех систем автомобиля'
      }
    ],
    status: 'confirmed',
    timeline: {
      created: '2024-06-19T10:00:00Z',
      confirmed: '2024-06-19T10:05:00Z'
    },
    appointment: {
      date: '2024-06-20',
      time: '11:00',
      estimatedDuration: '45 минут'
    },
    payment: {
      amount: 1500,
      method: 'invoice',
      status: 'pending',
      laborCost: 1500
    }
  }
];

// Константы
const COLORS = {
  primary: 'from-slate-900 via-slate-950 to-slate-900',
  secondary: 'from-amber-900 via-slate-950 to-orange-900',
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

const formatTime = (minutes: number) => {
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} ч ${mins} мин` : `${hours} ч`;
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
  glowColor = COLORS.orange, 
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
  type?: 'default' | 'service' | 'client' | 'mechanic' | 'order' | 'bay';
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
      case 'blocked':
        return { color: COLORS.error, label: 'Заблокирован', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'offline':
        return { color: COLORS.slate, label: 'Оффлайн', bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
      case 'busy':
        return { color: COLORS.orange, label: 'Занят', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'break':
        return { color: COLORS.purple, label: 'Перерыв', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'vacation':
        return { color: COLORS.cyan, label: 'Отпуск', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' };
      case 'pending':
        return { color: COLORS.blue, label: 'Ожидание', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'confirmed':
        return { color: COLORS.teal, label: 'Подтвержден', bg: 'bg-teal-500/15', border: 'border-teal-500/30' };
      case 'in_progress':
        return { color: COLORS.orange, label: 'В работе', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'ready':
        return { color: COLORS.indigo, label: 'Готов', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' };
      case 'completed':
        return { color: COLORS.success, label: 'Завершен', bg: 'bg-green-500/15', border: 'border-green-500/30' };
      case 'cancelled':
        return { color: COLORS.error, label: 'Отменен', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'operational':
        return { color: COLORS.success, label: 'Рабочий', bg: 'bg-green-500/15', border: 'border-green-500/30' };
      case 'maintenance':
        return { color: COLORS.warning, label: 'Обслуживание', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' };
      case 'out_of_service':
        return { color: COLORS.error, label: 'Не работает', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'occupied':
        return { color: COLORS.orange, label: 'Занят', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'maintenance':
        return { color: COLORS.orange, label: 'ТО', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'repair':
        return { color: COLORS.red, label: 'Ремонт', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'diagnostics':
        return { color: COLORS.blue, label: 'Диагностика', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'bodywork':
        return { color: COLORS.purple, label: 'Кузовные работы', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'tires':
        return { color: COLORS.teal, label: 'Шины', bg: 'bg-teal-500/15', border: 'border-teal-500/30' };
      case 'electrical':
        return { color: COLORS.indigo, label: 'Электрика', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' };
      case 'premium':
        return { color: COLORS.amber, label: 'Премиум', bg: 'bg-amber-500/15', border: 'border-amber-500/30' };
      case 'individual':
        return { color: COLORS.blue, label: 'Частный', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'business':
        return { color: COLORS.emerald, label: 'Бизнес', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'corporate':
        return { color: COLORS.purple, label: 'Корпоративный', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'junior':
        return { color: COLORS.slate, label: 'Младший', bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
      case 'middle':
        return { color: COLORS.blue, label: 'Средний', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'senior':
        return { color: COLORS.orange, label: 'Старший', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'master':
        return { color: COLORS.purple, label: 'Мастер', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'standard':
        return { color: COLORS.slate, label: 'Стандарт', bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
      case 'premium':
        return { color: COLORS.amber, label: 'Премиум', bg: 'bg-amber-500/15', border: 'border-amber-500/30' };
      case 'bodywork':
        return { color: COLORS.purple, label: 'Кузовной', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'diagnostics':
        return { color: COLORS.blue, label: 'Диагностика', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'tire':
        return { color: COLORS.teal, label: 'Шиномонтаж', bg: 'bg-teal-500/15', border: 'border-teal-500/30' };
      case 'bronze':
        return { color: COLORS.orange, label: 'Бронза', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'silver':
        return { color: COLORS.slate, label: 'Серебро', bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
      case 'gold':
        return { color: COLORS.amber, label: 'Золото', bg: 'bg-amber-500/15', border: 'border-amber-500/30' };
      case 'platinum':
        return { color: COLORS.cyan, label: 'Платина', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' };
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

const ProgressBar = ({ value, max = 100, color = COLORS.orange, label, showValue = true, size = 'md' }: { 
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

const StatCard = ({ title, value, change, icon, color = COLORS.orange, subtitle, onClick, trend }: {
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

const ServiceCard = ({ service, onClick }: { service: AutoService; onClick?: () => void }) => {
  const getServiceColor = (category: string) => {
    switch (category) {
      case 'maintenance': return COLORS.orange;
      case 'repair': return COLORS.red;
      case 'diagnostics': return COLORS.blue;
      case 'bodywork': return COLORS.purple;
      case 'tires': return COLORS.teal;
      case 'electrical': return COLORS.indigo;
      case 'premium': return COLORS.amber;
      default: return COLORS.slate;
    }
  };

  const getDurationDisplay = (duration: AutoService['duration']) => {
    const min = formatTime(duration.min);
    const max = formatTime(duration.max);
    return `${min} - ${max}`;
  };

  const getPriceDisplay = (price: AutoService['price']) => {
    let display = `от ${formatCurrency(price.base)}`;
    if (!price.partsIncluded) {
      display += ` (без учета запчастей)`;
    }
    return display;
  };

  const utilization = (service.currentAppointments / service.capacity) * 100;

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
            <span className="text-slate-400 text-xs">Время работы</span>
            <p className="text-white font-medium text-xs">{getDurationDisplay(service.duration)}</p>
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
            <span className="text-white font-medium">{service.currentAppointments}/{service.capacity}</span>
          </div>
          <ProgressBar 
            value={utilization} 
            color={utilization > 90 ? COLORS.rose : utilization > 75 ? COLORS.orange : COLORS.success}
            showValue={false}
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Гарантия:</span>
          <span className="text-white font-medium text-right text-xs">
            {service.price.warranty}
          </span>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Подробнее
        </button>
        <button className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Записаться
        </button>
      </div>
    </BentoCard>
  );
};

const ClientCard = ({ client, onClick }: { client: AutoClient; onClick?: () => void }) => {
  const getClientColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'inactive': return COLORS.slate;
      case 'blocked': return COLORS.error;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard className="p-5" glowColor={getClientColor(client.status)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{client.name}</h4>
          <p className="text-slate-400 text-sm">
            {client.totalServices} услуг • {client.vehicles.length} авто
          </p>
        </div>
        <StatusBadge status={client.status} type="client" animated={client.status === 'active'} />
      </div>
      
      <div className="space-y-3 text-sm mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Телефон:</span>
          <span className="text-white font-medium">{client.contact.phone}</span>
        </div>
        
        <div className="flex justify-between items-start">
          <span className="text-slate-400">Автомобили:</span>
          <span className="text-white font-medium text-right text-xs">
            {client.vehicles.map(v => `${v.brand} ${v.model}`).join(', ')}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Баллы лояльности:</span>
          <span className="text-white font-medium">{client.loyalty.points}</span>
        </div>

        {client.lastService && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Последнее ТО:</span>
            <span className="text-white font-medium text-xs">
              {new Date(client.lastService).toLocaleDateString('ru-RU')}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          История
        </button>
        <button className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Запись
        </button>
      </div>
    </BentoCard>
  );
};

const MechanicCard = ({ mechanic, onClick }: { mechanic: Mechanic; onClick?: () => void }) => {
  const utilization = (mechanic.currentOrders.length / mechanic.maxOrders) * 100;
  
  const getMechanicColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'offline': return COLORS.slate;
      case 'busy': return COLORS.orange;
      case 'break': return COLORS.purple;
      case 'vacation': return COLORS.cyan;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard className="p-5" glowColor={getMechanicColor(mechanic.status)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{mechanic.name}</h4>
          <p className="text-slate-400 text-sm line-clamp-1">
            {mechanic.qualifications.level} • {mechanic.specialization.join(', ')}
          </p>
        </div>
        <StatusBadge status={mechanic.status} type="mechanic" animated={mechanic.status === 'active'} />
      </div>
      
      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Рейтинг:</span>
          <span className="text-white font-medium">{mechanic.ratings.average}/5.0</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Заказов:</span>
          <span className="text-white font-medium">{mechanic.currentOrders.length}/{mechanic.maxOrders}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Опыт:</span>
          <span className="text-white font-medium">{mechanic.qualifications.experience} лет</span>
        </div>

        {mechanic.currentLocation && (
          <div className="flex justify-between items-start">
            <span className="text-slate-400">Местоположение:</span>
            <span className="text-white font-medium text-right text-xs">
              {mechanic.currentLocation.bay}
            </span>
          </div>
        )}
      </div>
      
      <ProgressBar 
        value={utilization} 
        label={`Загрузка механика`}
        color={utilization > 90 ? COLORS.rose : utilization > 75 ? COLORS.orange : COLORS.success}
        showValue={false}
      />
    </BentoCard>
  );
};

const BayCard = ({ bay, onClick }: { bay: ServiceBay; onClick?: () => void }) => {
  const getBayColor = (type: string) => {
    switch (type) {
      case 'standard': return COLORS.slate;
      case 'premium': return COLORS.amber;
      case 'bodywork': return COLORS.purple;
      case 'diagnostics': return COLORS.blue;
      case 'tire': return COLORS.teal;
      default: return COLORS.slate;
    }
  };

  const isMaintenanceDue = new Date(bay.nextMaintenance) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <BentoCard className="p-5" glowColor={getBayColor(bay.type)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{bay.name}</h4>
          <p className="text-slate-400 text-sm">
            {bay.type === 'standard' && 'Стандартный бокс'}
            {bay.type === 'premium' && 'Премиум бокс'}
            {bay.type === 'bodywork' && 'Кузовной бокс'}
            {bay.type === 'diagnostics' && 'Диагностический бокс'}
            {bay.type === 'tire' && 'Шиномонтаж'}
          </p>
        </div>
        <StatusBadge status={bay.status} type="bay" animated={bay.status === 'operational'} />
      </div>
      
      <div className="space-y-4 mb-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs">Тип</span>
            <p className="text-white font-medium">
              {bay.type === 'standard' && 'Стандарт'}
              {bay.type === 'premium' && 'Премиум'}
              {bay.type === 'bodywork' && 'Кузовной'}
              {bay.type === 'diagnostics' && 'Диагностика'}
              {bay.type === 'tire' && 'Шиномонтаж'}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-slate-400 text-xs">Использование</span>
            <p className="text-white font-medium">{bay.utilization}%</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs">Оборудование</span>
            <p className="text-white font-medium text-xs">{bay.equipment.length} ед.</p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-slate-400 text-xs">След. ТО</span>
            <p className="text-white font-medium text-xs">{new Date(bay.nextMaintenance).toLocaleDateString('ru-RU')}</p>
          </div>
        </div>

        <ProgressBar 
          value={bay.utilization} 
          label={`Загрузка бокса`}
          color={bay.utilization > 90 ? COLORS.rose : bay.utilization > 75 ? COLORS.orange : COLORS.success}
          showValue={false}
        />
      </div>
      
      {isMaintenanceDue && bay.status === 'operational' && (
        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <p className="text-yellow-300 text-xs text-center font-medium">Требуется плановое ТО</p>
        </div>
      )}
    </BentoCard>
  );
};

const OrderCard = ({ order, onClick }: { order: ServiceOrder; onClick?: () => void }) => {
  const client = autoClients.find(c => c.id === order.clientId);
  const vehicle = client?.vehicles.find(v => v.id === order.vehicleId);
  const service = autoServices.find(s => s.id === order.serviceId);

  const getOrderColor = (status: string) => {
    switch (status) {
      case 'pending': return COLORS.blue;
      case 'confirmed': return COLORS.teal;
      case 'in_progress': return COLORS.orange;
      case 'ready': return COLORS.indigo;
      case 'completed': return COLORS.success;
      case 'cancelled': return COLORS.error;
      default: return COLORS.slate;
    }
  };

  const getStatusProgress = (status: string) => {
    const statuses = ['pending', 'confirmed', 'in_progress', 'ready', 'completed'];
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
            {client?.name} • {vehicle?.brand} {vehicle?.model}
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
        
        {order.appointment.date && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Дата:</span>
            <span className="text-white font-medium">
              {new Date(order.appointment.date).toLocaleDateString('ru-RU')} {order.appointment.time}
            </span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-700/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-xs">Прогресс выполнения</span>
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
        <button className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Статус
        </button>
      </div>
    </BentoCard>
  );
};

// Основной компонент
export default function AutoServiceOrganization() {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'clients' | 'mechanics' | 'bays' | 'analytics' | 'orders'>('overview');
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
    if (!searchQuery) return autoServices;
    return autoServices.filter(service =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.serviceTypes.some(type => type.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const filteredClients = useMemo(() => {
    if (!searchQuery) return autoClients;
    return autoClients.filter(client =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contact.phone.includes(searchQuery) ||
      client.vehicles.some(v => 
        v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.model.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  const filteredMechanics = useMemo(() => {
    if (!searchQuery) return mechanics;
    return mechanics.filter(mechanic =>
      mechanic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mechanic.specialization.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const filteredBays = useMemo(() => {
    if (!searchQuery) return serviceBays;
    return serviceBays.filter(bay =>
      bay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bay.equipment.some(eq => eq.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return serviceOrders;
    return serviceOrders.filter(order => {
      const client = autoClients.find(c => c.id === order.clientId);
      const service = autoServices.find(s => s.id === order.serviceId);
      
      return (
        client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  // Статистика
  const autoServiceStats = useMemo(() => {
    const totalClients = autoClients.length;
    const activeClients = autoClients.filter(c => c.status === 'active').length;
    const totalServices = autoServices.length;
    const activeServices = autoServices.filter(s => s.status === 'active').length;
    const totalMechanics = mechanics.length;
    const availableMechanics = mechanics.filter(m => m.status === 'active' || m.status === 'busy').length;
    const todayOrders = serviceOrders.filter(o => new Date(o.timeline.created).toDateString() === new Date().toDateString()).length;
    const totalBays = serviceBays.length;
    const operationalBays = serviceBays.filter(b => b.status === 'operational' || b.status === 'occupied').length;
    const totalRevenue = serviceOrders
      .filter(o => o.payment.status === 'paid')
      .reduce((sum, order) => sum + order.payment.amount, 0);

    return {
      totalClients,
      activeClients,
      totalServices,
      activeServices,
      totalMechanics,
      availableMechanics,
      todayOrders,
      totalBays,
      operationalBays,
      totalRevenue
    };
  }, []);

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: '📊', count: null },
    { id: 'services' as const, label: 'Услуги', icon: '🔧', count: autoServiceStats.totalServices },
    { id: 'clients' as const, label: 'Клиенты', icon: '👥', count: autoServiceStats.totalClients },
    { id: 'mechanics' as const, label: 'Механики', icon: '👨‍🔧', count: autoServiceStats.totalMechanics },
    { id: 'bays' as const, label: 'Боксы', icon: '⚙️', count: autoServiceStats.totalBays },
    { id: 'orders' as const, label: 'Заказы', icon: '📋', count: serviceOrders.length },
    { id: 'analytics' as const, label: 'Аналитика', icon: '📈', count: null }
  ];

  // Модальные окна контент
  const renderServiceModal = (service: AutoService) => {
    const utilization = (service.currentAppointments / service.capacity) * 100;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Услуга автосервиса</label>
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
              {formatTime(service.duration.min)}
            </p>
            <p className="text-slate-400 text-xs mt-1">мин. время</p>
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
                <span className="text-white font-medium">Текущие записи</span>
                <span className="text-white font-bold">{service.currentAppointments}/{service.capacity}</span>
              </div>
              <ProgressBar 
                value={utilization} 
                color={utilization > 90 ? COLORS.rose : utilization > 75 ? COLORS.orange : COLORS.success}
                showValue={true}
              />
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Стоимость и гарантия</label>
            <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
              <p className="text-white font-bold text-lg">
                от {formatCurrency(service.price.base)}
                {!service.price.partsIncluded && ' (без запчастей)'}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-slate-400">
                <div>Запчасти: {service.price.partsIncluded ? 'Включены' : 'Отдельно'}</div>
                <div>Гарантия: {service.price.warranty}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Время выполнения</label>
            <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
              <p className="text-white font-medium">
                {formatTime(service.duration.min)} - {formatTime(service.duration.max)}
              </p>
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Требования</label>
            <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
              {service.requirements.map((req, index) => (
                <p key={index} className="text-white font-medium text-sm">• {req}</p>
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
          <div>
            <label className="text-slate-400 text-sm font-medium mb-3 block">Оборудование</label>
            <div className="space-y-2">
              {service.equipment.map((equipment, index) => (
                <div key={index} className="p-3 bg-slate-800/20 rounded-xl">
                  <p className="text-white text-sm">{equipment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderClientModal = (client: AutoClient) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm font-medium">Клиент</label>
            <p className="text-white font-semibold text-lg mt-1">{client.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm">Всего услуг</label>
              <p className="text-white font-medium">{client.totalServices}</p>
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
            <label className="text-slate-400 text-sm">Скидка</label>
            <p className="text-white font-medium">{client.loyalty.discount}%</p>
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
          </div>
        </div>
        <div>
          <label className="text-slate-400 text-sm font-medium">Предпочтения</label>
          <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
            <div>
              <span className="text-slate-400 text-sm">Время обслуживания:</span>
              <p className="text-white font-medium">{client.preferences.serviceTime.join(', ')}</p>
            </div>
            <div>
              <span className="text-slate-400 text-sm">Способ связи:</span>
              <p className="text-white font-medium">
                {client.preferences.contactMethod === 'phone' && 'Телефон'}
                {client.preferences.contactMethod === 'email' && 'Email'}
                {client.preferences.contactMethod === 'sms' && 'SMS'}
              </p>
            </div>
            {client.preferences.notes && (
              <div>
                <span className="text-slate-400 text-sm">Примечания:</span>
                <p className="text-white font-medium text-sm">{client.preferences.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-sm font-medium mb-3 block">Автомобили клиента</label>
        <div className="space-y-4">
          {client.vehicles.map((vehicle) => (
            <div key={vehicle.id} className="p-4 bg-slate-800/30 rounded-2xl">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-white font-semibold">{vehicle.brand} {vehicle.model} ({vehicle.year})</p>
                  <p className="text-slate-400 text-sm">VIN: {vehicle.vin} • {vehicle.licensePlate}</p>
                </div>
                <StatusBadge status="active" animated />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Пробег:</span>
                  <p className="text-white">{formatNumber(vehicle.mileage)} км</p>
                </div>
                <div>
                  <span className="text-slate-400">Последнее ТО:</span>
                  <p className="text-white">{new Date(vehicle.lastService).toLocaleDateString('ru-RU')}</p>
                </div>
                <div>
                  <span className="text-slate-400">Интервал ТО:</span>
                  <p className="text-white">{formatNumber(vehicle.serviceInterval)} км</p>
                </div>
                <div>
                  <span className="text-slate-400">Следующее ТО:</span>
                  <p className="text-white">
                    {new Date(new Date(vehicle.lastService).getTime() + vehicle.serviceInterval * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-sm font-medium mb-3 block">Программа лояльности</label>
        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-800/30 rounded-2xl">
          <div className="text-center">
            <p className="text-white font-bold text-xl">{client.loyalty.points}</p>
            <p className="text-slate-400 text-xs">баллов</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">{client.loyalty.tier}</p>
            <p className="text-slate-400 text-xs">уровень</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">{client.loyalty.discount}%</p>
            <p className="text-slate-400 text-xs">скидка</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMechanicModal = (mechanic: Mechanic) => {
    const utilization = (mechanic.currentOrders.length / mechanic.maxOrders) * 100;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm font-medium">Механик</label>
              <p className="text-white font-semibold text-lg mt-1">{mechanic.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm">Выполнено услуг</label>
                <p className="text-white font-medium">{mechanic.metrics.completedServices}</p>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Рейтинг</label>
                <p className="text-white font-medium">{mechanic.ratings.average}/5.0</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm font-medium">Статус</label>
              <div className="mt-2">
                <StatusBadge status={mechanic.status} type="mechanic" animated={mechanic.status === 'active'} />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-sm">Уровень</label>
              <div className="mt-1">
                <StatusBadge status={mechanic.qualifications.level} />
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
                <p className="text-white font-medium">{mechanic.contact.phone}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Email:</span>
                <p className="text-white font-medium">{mechanic.contact.email}</p>
              </div>
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Квалификация</label>
            <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
              <div>
                <span className="text-slate-400 text-sm">Опыт работы:</span>
                <p className="text-white font-medium">{mechanic.qualifications.experience} лет</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Специализация:</span>
                <p className="text-white font-medium">{mechanic.specialization.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Загрузка механика</label>
            <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">Текущие заказы</span>
                <span className="text-white font-bold">{mechanic.currentOrders.length}/{mechanic.maxOrders}</span>
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
                <p className="text-white font-medium">{mechanic.schedule.days.join(', ')}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Часы работы:</span>
                <p className="text-white font-medium">{mechanic.schedule.hours}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-xl">{mechanic.ratings.average}</p>
            <p className="text-slate-400 text-xs">рейтинг</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-xl">{mechanic.metrics.onTimeRate}%</p>
            <p className="text-slate-400 text-xs">вовремя</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-xl">{mechanic.metrics.reworkRate}%</p>
            <p className="text-slate-400 text-xs">переделок</p>
          </div>
        </div>

        {mechanic.qualifications.certifications.length > 0 && (
          <div>
            <label className="text-slate-400 text-sm font-medium mb-3 block">Сертификаты</label>
            <div className="space-y-2">
              {mechanic.qualifications.certifications.map((cert, index) => (
                <div key={index} className="p-3 bg-slate-800/30 rounded-xl">
                  <p className="text-white text-sm">{cert}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {mechanic.currentLocation && (
          <div>
            <label className="text-slate-400 text-sm font-medium mb-3 block">Текущее местоположение</label>
            <div className="p-4 bg-slate-800/30 rounded-2xl">
              <p className="text-white font-medium">{mechanic.currentLocation.bay} - {mechanic.currentLocation.station}</p>
            </div>
          </div>
        )}

        {mechanic.currentOrders.length > 0 && (
          <div>
            <label className="text-slate-400 text-sm font-medium mb-3 block">Текущие заказы</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mechanic.currentOrders.map((orderId) => {
                const order = serviceOrders.find(o => o.id === orderId);
                return order ? (
                  <div key={orderId} className="p-3 bg-slate-800/30 rounded-xl">
                    <p className="text-white font-medium text-sm">Заказ #{order.id.split('-')[1]}</p>
                    <p className="text-slate-400 text-xs">
                      {autoServices.find(s => s.id === order.serviceId)?.name}
                    </p>
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
                Автосервис <span className="text-orange-400">"Профи"</span>
              </h1>
              <p className="text-slate-400 text-lg">Профессиональное обслуживание и ремонт автомобилей любой сложности</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск услуг, клиентов, заказов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full lg:w-80 px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                />
                <svg className="absolute right-3 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <button 
                className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 px-6 py-3 rounded-2xl transition-all duration-200 font-semibold flex items-center gap-2 justify-center"
                onClick={() => openModal('Новая запись', (
                  <div className="space-y-4">
                    <p className="text-slate-400 text-center">Функционал создания записи в разработке...</p>
                  </div>
                ), 'md')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Новая запись
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Всего клиентов"
              value={autoServiceStats.totalClients}
              change={8}
              icon="👥"
              color={COLORS.blue}
              subtitle={`${autoServiceStats.activeClients} активных`}
              trend="up"
            />
            <StatCard
              title="Услуг автосервиса"
              value={autoServiceStats.totalServices}
              change={12}
              icon="🔧"
              color={COLORS.orange}
              subtitle={`${autoServiceStats.activeServices} активных`}
              trend="up"
            />
            <StatCard
              title="Механиков"
              value={autoServiceStats.totalMechanics}
              change={5}
              icon="👨‍🔧"
              color={COLORS.emerald}
              subtitle={`${autoServiceStats.availableMechanics} доступно`}
              trend="up"
            />
            <StatCard
              title="Заказов сегодня"
              value={autoServiceStats.todayOrders}
              change={15}
              icon="📋"
              color={COLORS.purple}
              subtitle="на обслуживание"
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
                          ? 'bg-orange-500 text-white' 
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
                    <h2 className="text-2xl font-bold text-white">Популярные услуги автосервиса</h2>
                    <button 
                      className="text-orange-400 hover:text-orange-300 text-sm font-medium flex items-center gap-1"
                      onClick={() => setActiveTab('services')}
                    >
                      Все услуги
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {autoServices
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

                {/* Recent Clients & Mechanics */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Активные клиенты</h3>
                      <button 
                        className="text-slate-400 hover:text-slate-300 text-sm font-medium"
                        onClick={() => setActiveTab('clients')}
                      >
                        Все клиенты →
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {autoClients
                        .filter(client => client.status === 'active')
                        .sort((a, b) => b.totalServices - a.totalServices)
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
                      <h3 className="text-xl font-bold text-white">Доступные механики</h3>
                      <button 
                        className="text-slate-400 hover:text-slate-300 text-sm font-medium"
                        onClick={() => setActiveTab('mechanics')}
                      >
                        Все механики →
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {mechanics
                        .filter(mechanic => mechanic.status === 'active' || mechanic.status === 'busy')
                        .slice(0, 4)
                        .map((mechanic, index) => (
                        <motion.div
                          key={mechanic.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <MechanicCard 
                            mechanic={mechanic}
                            onClick={() => openModal(mechanic.name, renderMechanicModal(mechanic), 'xl')}
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
                    {serviceOrders
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
                  <h2 className="text-2xl font-bold text-white">Услуги автосервиса</h2>
                  <div className="flex gap-2">
                    <button className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-slate-200 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                      Фильтры
                    </button>
                    <button className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
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

            {activeTab === 'mechanics' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Механики</h2>
                  <button className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                    + Новый механик
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMechanics.map((mechanic, index) => (
                    <motion.div
                      key={mechanic.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <MechanicCard 
                        mechanic={mechanic}
                        onClick={() => openModal(mechanic.name, renderMechanicModal(mechanic), 'xl')}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'bays' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Сервисные боксы</h2>
                  <button className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                    + Новый бокс
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBays.map((bay, index) => (
                    <motion.div
                      key={bay.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <BayCard 
                        bay={bay}
                        onClick={() => openModal(bay.name, (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-slate-400 text-sm">Сервисный бокс</label>
                                <p className="text-white font-medium">{bay.name}</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Статус</label>
                                <div className="mt-1">
                                  <StatusBadge status={bay.status} type="bay" animated={bay.status === 'operational'} />
                                </div>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Тип</label>
                                <p className="text-white font-medium">
                                  {bay.type === 'standard' && 'Стандартный'}
                                  {bay.type === 'premium' && 'Премиум'}
                                  {bay.type === 'bodywork' && 'Кузовной'}
                                  {bay.type === 'diagnostics' && 'Диагностический'}
                                  {bay.type === 'tire' && 'Шиномонтаж'}
                                </p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Использование</label>
                                <p className="text-white font-medium">{bay.utilization}%</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Местоположение</label>
                                <p className="text-white font-medium">Автосервис</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">След. ТО</label>
                                <p className="text-white font-medium">{new Date(bay.nextMaintenance).toLocaleDateString('ru-RU')}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <label className="text-slate-400 text-sm font-medium">Характеристики</label>
                                <div className="mt-2 space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Макс. вес:</span>
                                    <span className="text-white">{bay.specifications.maxVehicleWeight} кг</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Поддерживаемые типы:</span>
                                    <span className="text-white text-right text-xs">{bay.specifications.supportedTypes.join(', ')}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm font-medium">Особенности</label>
                                <div className="mt-2 space-y-1">
                                  {bay.specifications.specialFeatures.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                      <span className="text-white">{feature}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <label className="text-slate-400 text-sm font-medium mb-3 block">Оборудование</label>
                              <div className="grid grid-cols-2 gap-2">
                                {bay.equipment.map((item, index) => (
                                  <div key={index} className="p-2 bg-slate-800/30 rounded-lg">
                                    <p className="text-white text-sm text-center">{item}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ), 'lg')}
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
                  <h2 className="text-2xl font-bold text-white">Заказы на обслуживание</h2>
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
                  <BentoCard className="p-6" glowColor={COLORS.orange}>
                    <h3 className="text-white font-semibold mb-4">Эффективность сервиса</h3>
                    <div className="text-3xl font-bold text-white mb-2">94.2%</div>
                    <ProgressBar value={94.2} color={COLORS.orange} />
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-slate-300">
                      <div>
                        <p>Среднее время</p>
                        <p className="text-white font-medium">2.1 ч</p>
                      </div>
                      <div>
                        <p>Успешность</p>
                        <p className="text-white font-medium">96.8%</p>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.blue}>
                    <h3 className="text-white font-semibold mb-4">Финансовые показатели</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                        <span className="text-slate-300">Общая выручка</span>
                        <span className="text-white font-medium">{formatCurrency(autoServiceStats.totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                        <span className="text-slate-300">Средний чек</span>
                        <span className="text-white font-medium">{formatCurrency(serviceOrders.length > 0 ? autoServiceStats.totalRevenue / serviceOrders.length : 0)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                        <span className="text-slate-300">Заказов в день</span>
                        <span className="text-emerald-300 font-medium">{autoServiceStats.todayOrders}</span>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.purple}>
                    <h3 className="text-white font-semibold mb-4">Распределение по типам</h3>
                    <div className="space-y-3">
                      {[
                        { type: 'Техническое обслуживание', percentage: 35, orders: Math.round(serviceOrders.length * 0.35) },
                        { type: 'Диагностика', percentage: 25, orders: Math.round(serviceOrders.length * 0.25) },
                        { type: 'Ремонт', percentage: 20, orders: Math.round(serviceOrders.length * 0.20) },
                        { type: 'Шиномонтаж', percentage: 12, orders: Math.round(serviceOrders.length * 0.12) },
                        { type: 'Кузовной ремонт', percentage: 8, orders: Math.round(serviceOrders.length * 0.08) }
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

                {/* Service Analytics */}
                <BentoCard className="p-6">
                  <h3 className="text-white font-semibold mb-4">Аналитика автосервиса</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Ключевые показатели</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Среднее время выполнения</span>
                          <span className="text-white font-medium">2.8 ч</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Отмененные заказы</span>
                          <span className="text-white font-medium">3.5%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Повторные обращения</span>
                          <span className="text-white font-medium">2.1%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Использование боксов</span>
                          <span className="text-white font-medium">78.5%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Эффективность по типам услуг</h4>
                      <div className="space-y-3">
                        {[
                          { type: 'ТО', effectiveness: 96, time: '1.5 ч' },
                          { type: 'Диагностика', effectiveness: 98, time: '0.8 ч' },
                          { type: 'Ремонт', effectiveness: 92, time: '4.2 ч' },
                          { type: 'Шиномонтаж', effectiveness: 99, time: '0.5 ч' }
                        ].map((item, index) => (
                          <div key={index} className="p-3 bg-slate-800/30 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white text-sm">{item.type}</span>
                              <span className="text-slate-300 text-sm">{item.effectiveness}%</span>
                            </div>
                            <ProgressBar value={item.effectiveness} color={COLORS.orange} />
                            <p className="text-slate-400 text-xs mt-2">Среднее время: {item.time}</p>
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