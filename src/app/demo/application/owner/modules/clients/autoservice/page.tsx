'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Хук для получения времени на клиенте
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
interface CarOwner {
  id: string;
  personalInfo: {
    fullName: string;
    birthDate: string;
    gender: 'male' | 'female';
    phone: string;
    email?: string;
    address: string;
    passport: string;
    driverLicense: string;
    avatar?: string;
  };
  vehicles: Vehicle[];
  insurance: {
    provider: string;
    policyNumber: string;
    validUntil: string;
    type: 'osago' | 'kasko' | 'both';
    cost: number;
    coverage: number;
  };
  fines: {
    unpaid: Fine[];
    paid: Fine[];
    totalUnpaidAmount: number;
  };
  technicalInspections: TechnicalInspection[];
  serviceHistory: ServiceRecord[];
  status: 'active' | 'suspended' | 'expired';
  registrationDate: string;
  lastActivity?: string;
  notes?: string;
  loyaltyLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface Vehicle {
  id: string;
  ownerId: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vin: string;
  bodyType: 'sedan' | 'hatchback' | 'suv' | 'coupe' | 'convertible' | 'minivan' | 'pickup';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  engineCapacity: number;
  horsepower: number;
  transmission: 'manual' | 'automatic';
  mileage: number;
  status: 'active' | 'maintenance' | 'accident' | 'stolen' | 'scrapped';
  registration: {
    number: string;
    issueDate: string;
    expiryDate: string;
  };
  technicalData: {
    weight: number;
    maxWeight: number;
    seats: number;
    ecoClass: number;
    emissions: number;
  };
  features: string[];
  lastServiceDate?: string;
  nextServiceDate?: string;
  serviceInterval: number;
  image?: string;
}

interface Fine {
  id: string;
  vehicleId: string;
  type: 'speeding' | 'parking' | 'document' | 'insurance' | 'technical' | 'other';
  amount: number;
  description: string;
  location: string;
  date: string;
  dueDate: string;
  status: 'unpaid' | 'paid' | 'disputed';
  photos?: string[];
  discountExpiry?: string;
}

interface TechnicalInspection {
  id: string;
  vehicleId: string;
  inspectionDate: string;
  expiryDate: string;
  station: string;
  inspector: string;
  result: 'passed' | 'failed' | 'conditional';
  notes?: string;
  defects?: string[];
  mileage: number;
  nextInspectionDate: string;
}

interface ServiceRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: 'maintenance' | 'repair' | 'diagnostic' | 'insurance' | 'registration';
  description: string;
  cost: number;
  serviceCenter: string;
  technician: string;
  partsReplaced: string[];
  warrantyUntil?: string;
}

interface ServiceRequest {
  id: string;
  ownerId: string;
  vehicleId: string;
  type: 'maintenance' | 'repair' | 'diagnostic' | 'insurance' | 'registration';
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  status: 'submitted' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  timeline: {
    submitted: string;
    approved?: string;
    started?: string;
    completed?: string;
  };
  estimatedCost?: number;
  actualCost?: number;
  assignedService?: string;
  notes?: string;
  scheduledDate?: string;
  completionDate?: string;
}

// Расширенные моки данных
const carOwners: CarOwner[] = [
  {
    id: 'co-001',
    personalInfo: {
      fullName: 'Иванов Алексей Петрович',
      birthDate: '1985-05-15',
      gender: 'male',
      phone: '+7 (916) 123-45-67',
      email: 'a.ivanov@example.ru',
      address: 'г. Москва, ул. Ленина, д. 15, кв. 34',
      passport: '4510 123456',
      driverLicense: '77AB123456',
      avatar: '👨‍💼'
    },
    vehicles: [
      {
        id: 'vh-001',
        ownerId: 'co-001',
        brand: 'Toyota',
        model: 'Camry',
        year: 2020,
        color: 'Серебристый',
        licensePlate: 'A123BC777',
        vin: 'JTDBT123456789012',
        bodyType: 'sedan',
        fuelType: 'petrol',
        engineCapacity: 2.5,
        horsepower: 181,
        transmission: 'automatic',
        mileage: 45000,
        status: 'active',
        registration: {
          number: '7723456789',
          issueDate: '2020-03-15',
          expiryDate: '2025-03-15'
        },
        technicalData: {
          weight: 1560,
          maxWeight: 1980,
          seats: 5,
          ecoClass: 5,
          emissions: 145
        },
        features: ['Климат-контроль', 'Кожаный салон', 'Панорамная крыша', 'Камера заднего вида'],
        lastServiceDate: '2024-05-20',
        nextServiceDate: '2024-11-20',
        serviceInterval: 15000,
        image: '🚗'
      }
    ],
    insurance: {
      provider: 'Ингосстрах',
      policyNumber: 'ING-123456789',
      validUntil: '2024-12-31',
      type: 'both',
      cost: 45000,
      coverage: 3000000
    },
    fines: {
      unpaid: [
        {
          id: 'fn-001',
          vehicleId: 'vh-001',
          type: 'speeding',
          amount: 1500,
          description: 'Превышение скорости на 20-40 км/ч',
          location: 'г. Москва, Ленинский проспект',
          date: '2024-06-15',
          dueDate: '2024-07-15',
          status: 'unpaid',
          discountExpiry: '2024-06-30'
        }
      ],
      paid: [
        {
          id: 'fn-002',
          vehicleId: 'vh-001',
          type: 'parking',
          amount: 500,
          description: 'Парковка в неположенном месте',
          location: 'г. Москва, ул. Тверская',
          date: '2024-05-10',
          dueDate: '2024-06-10',
          status: 'paid'
        }
      ],
      totalUnpaidAmount: 1500
    },
    technicalInspections: [
      {
        id: 'ti-001',
        vehicleId: 'vh-001',
        inspectionDate: '2024-01-20',
        expiryDate: '2025-01-20',
        station: 'СТО "Автотехник"',
        inspector: 'Петров И.С.',
        result: 'passed',
        notes: 'Все системы в норме',
        mileage: 42000,
        nextInspectionDate: '2025-01-20'
      }
    ],
    serviceHistory: [
      {
        id: 'sh-001',
        vehicleId: 'vh-001',
        date: '2024-05-20',
        type: 'maintenance',
        description: 'Плановое ТО: замена масла, фильтров, диагностика',
        cost: 12000,
        serviceCenter: 'Тойота Центр Москва',
        technician: 'Смирнов А.В.',
        partsReplaced: ['Масло двигателя', 'Масляный фильтр', 'Воздушный фильтр']
      }
    ],
    status: 'active',
    registrationDate: '2020-03-15',
    lastActivity: '2024-06-19',
    notes: 'Регулярно проходит ТО. Ответственный водитель.',
    loyaltyLevel: 'gold'
  },
  {
    id: 'co-002',
    personalInfo: {
      fullName: 'Петрова Мария Сергеевна',
      birthDate: '1990-12-20',
      gender: 'female',
      phone: '+7 (925) 234-56-78',
      email: 'm.petrova@example.ru',
      address: 'г. Москва, пр. Мира, д. 125, кв. 89',
      passport: '4510 234567',
      driverLicense: '77CD234567',
      avatar: '👩‍💼'
    },
    vehicles: [
      {
        id: 'vh-002',
        ownerId: 'co-002',
        brand: 'BMW',
        model: 'X5',
        year: 2022,
        color: 'Черный',
        licensePlate: 'B456DE777',
        vin: 'WBA12345678901234',
        bodyType: 'suv',
        fuelType: 'diesel',
        engineCapacity: 3.0,
        horsepower: 265,
        transmission: 'automatic',
        mileage: 15000,
        status: 'active',
        registration: {
          number: '7723456790',
          issueDate: '2022-05-10',
          expiryDate: '2027-05-10'
        },
        technicalData: {
          weight: 2140,
          maxWeight: 2680,
          seats: 5,
          ecoClass: 6,
          emissions: 165
        },
        features: ['Парковочный ассистент', 'Адаптивный круиз-контроль', 'Кожаный салон', 'Подогрев сидений'],
        lastServiceDate: '2024-04-15',
        nextServiceDate: '2024-10-15',
        serviceInterval: 20000,
        image: '🚙'
      },
      {
        id: 'vh-003',
        ownerId: 'co-002',
        brand: 'Volkswagen',
        model: 'Golf',
        year: 2018,
        color: 'Красный',
        licensePlate: 'C789FG777',
        vin: 'WVW12345678901234',
        bodyType: 'hatchback',
        fuelType: 'petrol',
        engineCapacity: 1.4,
        horsepower: 125,
        transmission: 'manual',
        mileage: 75000,
        status: 'maintenance',
        registration: {
          number: '7723456791',
          issueDate: '2018-08-20',
          expiryDate: '2023-08-20'
        },
        technicalData: {
          weight: 1280,
          maxWeight: 1680,
          seats: 5,
          ecoClass: 5,
          emissions: 135
        },
        features: ['Климат-контроль', 'Мультимедиа система', 'Давление в шинах'],
        lastServiceDate: '2024-03-10',
        nextServiceDate: '2024-09-10',
        serviceInterval: 15000,
        image: '🚗'
      }
    ],
    insurance: {
      provider: 'РЕСО-Гарантия',
      policyNumber: 'RES-987654321',
      validUntil: '2024-11-30',
      type: 'kasko',
      cost: 89000,
      coverage: 5000000
    },
    fines: {
      unpaid: [],
      paid: [
        {
          id: 'fn-003',
          vehicleId: 'vh-002',
          type: 'document',
          amount: 1000,
          description: 'Отсутствие страховки',
          location: 'г. Москва, МКАД',
          date: '2024-04-05',
          dueDate: '2024-05-05',
          status: 'paid'
        }
      ],
      totalUnpaidAmount: 0
    },
    technicalInspections: [
      {
        id: 'ti-002',
        vehicleId: 'vh-002',
        inspectionDate: '2024-02-15',
        expiryDate: '2025-02-15',
        station: 'СТО "БМВ Центр"',
        inspector: 'Сидоров А.В.',
        result: 'passed',
        notes: 'Премиум обслуживание',
        mileage: 12000,
        nextInspectionDate: '2025-02-15'
      },
      {
        id: 'ti-003',
        vehicleId: 'vh-003',
        inspectionDate: '2023-12-10',
        expiryDate: '2024-12-10',
        station: 'СТО "Фольксваген Сервис"',
        inspector: 'Козлов Д.Н.',
        result: 'conditional',
        defects: ['Износ тормозных колодок', 'Требуется замена фильтров'],
        notes: 'Требуется ремонт',
        mileage: 72000,
        nextInspectionDate: '2024-12-10'
      }
    ],
    serviceHistory: [
      {
        id: 'sh-002',
        vehicleId: 'vh-002',
        date: '2024-04-15',
        type: 'maintenance',
        description: 'Плановое ТО: замена масла, диагностика систем',
        cost: 25000,
        serviceCenter: 'БМВ Центр Москва',
        technician: 'Орлов Д.С.',
        partsReplaced: ['Масло двигателя', 'Масляный фильтр', 'Топливный фильтр']
      }
    ],
    status: 'active',
    registrationDate: '2018-08-20',
    lastActivity: '2024-06-18',
    notes: 'Владеет двумя автомобилями. Предпочитает премиум обслуживание.',
    loyaltyLevel: 'platinum'
  },
  {
    id: 'co-003',
    personalInfo: {
      fullName: 'Сидоров Дмитрий Николаевич',
      birthDate: '1978-08-30',
      gender: 'male',
      phone: '+7 (916) 345-67-89',
      address: 'г. Москва, ул. Пушкина, д. 67, кв. 12',
      passport: '4510 345678',
      driverLicense: '77EF345678',
      avatar: '👨‍🔧'
    },
    vehicles: [
      {
        id: 'vh-004',
        ownerId: 'co-003',
        brand: 'Lada',
        model: 'Vesta',
        year: 2021,
        color: 'Белый',
        licensePlate: 'E012GH777',
        vin: 'XTA12345678901234',
        bodyType: 'sedan',
        fuelType: 'petrol',
        engineCapacity: 1.6,
        horsepower: 106,
        transmission: 'manual',
        mileage: 35000,
        status: 'active',
        registration: {
          number: '7723456792',
          issueDate: '2021-07-12',
          expiryDate: '2026-07-12'
        },
        technicalData: {
          weight: 1240,
          maxWeight: 1580,
          seats: 5,
          ecoClass: 5,
          emissions: 155
        },
        features: ['Кондиционер', 'Электростеклоподъемники', 'ABS'],
        lastServiceDate: '2024-04-01',
        nextServiceDate: '2024-10-01',
        serviceInterval: 15000,
        image: '🚘'
      }
    ],
    insurance: {
      provider: 'Согласие',
      policyNumber: 'SOG-456789123',
      validUntil: '2024-10-15',
      type: 'osago',
      cost: 12000,
      coverage: 2000000
    },
    fines: {
      unpaid: [
        {
          id: 'fn-004',
          vehicleId: 'vh-004',
          type: 'speeding',
          amount: 2500,
          description: 'Превышение скорости на 40-60 км/ч',
          location: 'г. Москва, Кутузовский проспект',
          date: '2024-06-10',
          dueDate: '2024-07-10',
          status: 'unpaid',
          discountExpiry: '2024-06-25'
        },
        {
          id: 'fn-005',
          vehicleId: 'vh-004',
          type: 'parking',
          amount: 3000,
          description: 'Парковка на месте для инвалидов',
          location: 'г. Москва, ТЦ "Европейский"',
          date: '2024-06-12',
          dueDate: '2024-07-12',
          status: 'unpaid',
          discountExpiry: '2024-06-27'
        }
      ],
      paid: [],
      totalUnpaidAmount: 5500
    },
    technicalInspections: [
      {
        id: 'ti-004',
        vehicleId: 'vh-004',
        inspectionDate: '2024-03-05',
        expiryDate: '2025-03-05',
        station: 'СТО "АвтоВАЗ Сервис"',
        inspector: 'Николаев С.П.',
        result: 'passed',
        notes: 'Стандартное ТО',
        mileage: 32000,
        nextInspectionDate: '2025-03-05'
      }
    ],
    serviceHistory: [
      {
        id: 'sh-003',
        vehicleId: 'vh-004',
        date: '2024-04-01',
        type: 'maintenance',
        description: 'Замена масла, регулировка клапанов',
        cost: 8000,
        serviceCenter: 'ЛАДА Сервис',
        technician: 'Васильев П.К.',
        partsReplaced: ['Масло двигателя', 'Масляный фильтр', 'Свечи зажигания']
      }
    ],
    status: 'active',
    registrationDate: '2021-07-12',
    lastActivity: '2024-06-17',
    notes: 'Имеет неоплаченные штрафы. Требуется напоминание об оплате.',
    loyaltyLevel: 'silver'
  },
  {
    id: 'co-004',
    personalInfo: {
      fullName: 'Козлова Анна Владимировна',
      birthDate: '1992-03-14',
      gender: 'female',
      phone: '+7 (903) 456-78-90',
      email: 'a.kozlova@example.ru',
      address: 'г. Москва, ул. Новый Арбат, д. 25, кв. 67',
      passport: '4510 456789',
      driverLicense: '77GH456789',
      avatar: '👩‍🎓'
    },
    vehicles: [
      {
        id: 'vh-005',
        ownerId: 'co-004',
        brand: 'Kia',
        model: 'Rio',
        year: 2023,
        color: 'Синий',
        licensePlate: 'F345IJ777',
        vin: 'KNA12345678901234',
        bodyType: 'sedan',
        fuelType: 'petrol',
        engineCapacity: 1.6,
        horsepower: 123,
        transmission: 'automatic',
        mileage: 8000,
        status: 'active',
        registration: {
          number: '7723456793',
          issueDate: '2023-02-20',
          expiryDate: '2028-02-20'
        },
        technicalData: {
          weight: 1180,
          maxWeight: 1520,
          seats: 5,
          ecoClass: 6,
          emissions: 140
        },
        features: ['Музыкальная система', 'Кондиционер', 'Камера заднего вида'],
        lastServiceDate: '2024-01-15',
        nextServiceDate: '2024-07-15',
        serviceInterval: 15000,
        image: '🚙'
      }
    ],
    insurance: {
      provider: 'АльфаСтрахование',
      policyNumber: 'ALF-789123456',
      validUntil: '2024-09-30',
      type: 'both',
      cost: 35000,
      coverage: 2500000
    },
    fines: {
      unpaid: [],
      paid: [],
      totalUnpaidAmount: 0
    },
    technicalInspections: [
      {
        id: 'ti-005',
        vehicleId: 'vh-005',
        inspectionDate: '2024-01-10',
        expiryDate: '2025-01-10',
        station: 'СТО "Киа Моторс"',
        inspector: 'Федоров М.А.',
        result: 'passed',
        notes: 'Новый автомобиль, все в норме',
        mileage: 5000,
        nextInspectionDate: '2025-01-10'
      }
    ],
    serviceHistory: [
      {
        id: 'sh-004',
        vehicleId: 'vh-005',
        date: '2024-01-15',
        type: 'maintenance',
        description: 'Первое ТО: диагностика, замена масла',
        cost: 15000,
        serviceCenter: 'Киа Моторс Москва',
        technician: 'Семенов И.Л.',
        partsReplaced: ['Масло двигателя', 'Масляный фильтр'],
        warrantyUntil: '2026-02-20'
      }
    ],
    status: 'active',
    registrationDate: '2023-02-20',
    lastActivity: '2024-06-20',
    notes: 'Новый клиент. Аккуратный водитель.',
    loyaltyLevel: 'bronze'
  }
];

const serviceRequests: ServiceRequest[] = [
  {
    id: 'sr-001',
    ownerId: 'co-002',
    vehicleId: 'vh-003',
    type: 'repair',
    description: 'Замена тормозных колодок и фильтров по результатам ТО',
    urgency: 'medium',
    status: 'approved',
    timeline: {
      submitted: '2024-06-18T10:00:00Z',
      approved: '2024-06-18T11:30:00Z'
    },
    estimatedCost: 15000,
    assignedService: 'СТО "Фольксваген Сервис"',
    notes: 'Требуется срочный ремонт по результатам ТО. Клиент уведомлен.',
    scheduledDate: '2024-06-25',
    completionDate: '2024-06-25'
  },
  {
    id: 'sr-002',
    ownerId: 'co-001',
    vehicleId: 'vh-001',
    type: 'maintenance',
    description: 'Плановое техническое обслуживание: замена масла, фильтров, диагностика ходовой части',
    urgency: 'low',
    status: 'submitted',
    timeline: {
      submitted: '2024-06-19T09:00:00Z'
    },
    estimatedCost: 8000,
    scheduledDate: '2024-06-28'
  },
  {
    id: 'sr-003',
    ownerId: 'co-003',
    vehicleId: 'vh-004',
    type: 'diagnostic',
    description: 'Диагностика двигателя и электронных систем',
    urgency: 'high',
    status: 'in_progress',
    timeline: {
      submitted: '2024-06-17T14:20:00Z',
      approved: '2024-06-17T15:00:00Z',
      started: '2024-06-18T09:00:00Z'
    },
    estimatedCost: 5000,
    actualCost: 5200,
    assignedService: 'СТО "АвтоВАЗ Сервис"',
    notes: 'Клиент жалуется на повышенный расход топлива',
    scheduledDate: '2024-06-18',
    completionDate: '2024-06-19'
  },
  {
    id: 'sr-004',
    ownerId: 'co-004',
    vehicleId: 'vh-005',
    type: 'insurance',
    description: 'Оформление дополнительной страховки КАСКО',
    urgency: 'low',
    status: 'completed',
    timeline: {
      submitted: '2024-06-15T11:00:00Z',
      approved: '2024-06-15T12:00:00Z',
      started: '2024-06-15T14:00:00Z',
      completed: '2024-06-16T10:00:00Z'
    },
    estimatedCost: 20000,
    actualCost: 19500,
    assignedService: 'АльфаСтрахование',
    notes: 'Страховка успешно оформлена, документы переданы клиенту',
    scheduledDate: '2024-06-15',
    completionDate: '2024-06-16'
  }
];

// Константы цветов
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
  slate: '100, 116, 139'
} as const;

// Утилиты форматирования
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(amount);
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

const getDaysUntil = (dateString: string) => {
  const today = new Date();
  const target = new Date(dateString);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Компонент модального окна
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

// Компонент карточки
const BentoCard = ({ 
  children, 
  className = '', 
  glowColor = COLORS.teal, 
  onClick,
  hoverable = true,
  padding = 'p-6',
  animated = false
}: { 
  children: React.ReactNode; 
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: string;
  animated?: boolean;
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
    animate={animated ? {
      y: [0, -2, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    } : {}}
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

// Компонент статусного бейджа
const StatusBadge = ({ status, type = 'default', animated = false, size = 'md' }: { 
  status: string; 
  type?: 'default' | 'owner' | 'vehicle' | 'fine' | 'inspection' | 'request' | 'loyalty';
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm'
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return { color: COLORS.success, label: 'Активен', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'suspended':
        return { color: COLORS.warning, label: 'Приостановлен', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' };
      case 'expired':
        return { color: COLORS.error, label: 'Просрочен', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'maintenance':
        return { color: COLORS.orange, label: 'На обслуживании', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'accident':
        return { color: COLORS.rose, label: 'Авария', bg: 'bg-rose-500/15', border: 'border-rose-500/30' };
      case 'stolen':
        return { color: COLORS.purple, label: 'Угнан', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'scrapped':
        return { color: COLORS.slate, label: 'Утилизирован', bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
      case 'unpaid':
        return { color: COLORS.rose, label: 'Не оплачен', bg: 'bg-rose-500/15', border: 'border-rose-500/30' };
      case 'paid':
        return { color: COLORS.success, label: 'Оплачен', bg: 'bg-green-500/15', border: 'border-green-500/30' };
      case 'disputed':
        return { color: COLORS.orange, label: 'Оспаривается', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'passed':
        return { color: COLORS.success, label: 'Пройден', bg: 'bg-green-500/15', border: 'border-green-500/30' };
      case 'failed':
        return { color: COLORS.error, label: 'Не пройден', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'conditional':
        return { color: COLORS.warning, label: 'Условно', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' };
      case 'submitted':
        return { color: COLORS.blue, label: 'Подана', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'approved':
        return { color: COLORS.teal, label: 'Одобрена', bg: 'bg-teal-500/15', border: 'border-teal-500/30' };
      case 'in_progress':
        return { color: COLORS.orange, label: 'В работе', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'completed':
        return { color: COLORS.success, label: 'Завершена', bg: 'bg-green-500/15', border: 'border-green-500/30' };
      case 'cancelled':
        return { color: COLORS.error, label: 'Отменена', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'sedan':
        return { color: COLORS.blue, label: 'Седан', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'hatchback':
        return { color: COLORS.emerald, label: 'Хэтчбек', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'suv':
        return { color: COLORS.orange, label: 'Внедорожник', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'coupe':
        return { color: COLORS.purple, label: 'Купе', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'convertible':
        return { color: COLORS.rose, label: 'Кабриолет', bg: 'bg-rose-500/15', border: 'border-rose-500/30' };
      case 'minivan':
        return { color: COLORS.cyan, label: 'Минивэн', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' };
      case 'pickup':
        return { color: COLORS.amber, label: 'Пикап', bg: 'bg-amber-500/15', border: 'border-amber-500/30' };
      case 'petrol':
        return { color: COLORS.orange, label: 'Бензин', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'diesel':
        return { color: COLORS.slate, label: 'Дизель', bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
      case 'electric':
        return { color: COLORS.emerald, label: 'Электро', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'hybrid':
        return { color: COLORS.teal, label: 'Гибрид', bg: 'bg-teal-500/15', border: 'border-teal-500/30' };
      case 'manual':
        return { color: COLORS.blue, label: 'Механика', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'automatic':
        return { color: COLORS.purple, label: 'Автомат', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'speeding':
        return { color: COLORS.rose, label: 'Превышение', bg: 'bg-rose-500/15', border: 'border-rose-500/30' };
      case 'parking':
        return { color: COLORS.orange, label: 'Парковка', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'document':
        return { color: COLORS.blue, label: 'Документы', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'insurance':
        return { color: COLORS.purple, label: 'Страховка', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'technical':
        return { color: COLORS.amber, label: 'Техника', bg: 'bg-amber-500/15', border: 'border-amber-500/30' };
      case 'osago':
        return { color: COLORS.blue, label: 'ОСАГО', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'kasko':
        return { color: COLORS.purple, label: 'КАСКО', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'both':
        return { color: COLORS.emerald, label: 'ОСАГО+КАСКО', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'maintenance':
        return { color: COLORS.blue, label: 'Обслуживание', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'repair':
        return { color: COLORS.orange, label: 'Ремонт', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'diagnostic':
        return { color: COLORS.teal, label: 'Диагностика', bg: 'bg-teal-500/15', border: 'border-teal-500/30' };
      case 'registration':
        return { color: COLORS.purple, label: 'Регистрация', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'low':
        return { color: COLORS.success, label: 'Низкий', bg: 'bg-green-500/15', border: 'border-green-500/30' };
      case 'medium':
        return { color: COLORS.warning, label: 'Средний', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' };
      case 'high':
        return { color: COLORS.orange, label: 'Высокий', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'emergency':
        return { color: COLORS.rose, label: 'Экстренный', bg: 'bg-rose-500/15', border: 'border-rose-500/30' };
      case 'bronze':
        return { color: COLORS.amber, label: 'Бронза', bg: 'bg-amber-500/15', border: 'border-amber-500/30' };
      case 'silver':
        return { color: COLORS.slate, label: 'Серебро', bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
      case 'gold':
        return { color: COLORS.amber, label: 'Золото', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' };
      case 'platinum':
        return { color: COLORS.cyan, label: 'Платина', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' };
      default:
        return { color: COLORS.slate, label: status, bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
    }
  };

  const config = getStatusConfig();

  return (
    <motion.span 
      className={`inline-flex items-center rounded-full text-xs font-medium border backdrop-blur-sm ${config.bg} ${config.border} ${sizeClasses[size]}`}
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

// Компонент прогресс-бара
const ProgressBar = ({ value, max = 100, color = COLORS.teal, label, showValue = true, size = 'md' }: { 
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

// Компонент карточки статистики
const StatCard = ({ title, value, change, icon, color = COLORS.teal, subtitle, onClick, trend, delay = 0 }: {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color?: string;
  subtitle?: string;
  onClick?: () => void;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}) => {
  const trendConfig = trend || (change !== undefined ? (change >= 0 ? 'up' : 'down') : 'neutral');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
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
    </motion.div>
  );
};

// Компонент карточки владельца
const OwnerCard = ({ owner, onClick }: { owner: CarOwner; onClick?: () => void }) => {
  const age = calculateAge(owner.personalInfo.birthDate);
  const vehiclesCount = owner.vehicles.length;
  const unpaidFinesCount = owner.fines.unpaid.length;
  
  const getOwnerColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'suspended': return COLORS.warning;
      case 'expired': return COLORS.error;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard className="p-5" glowColor={getOwnerColor(owner.status)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="text-2xl">{owner.personalInfo.avatar}</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{owner.personalInfo.fullName}</h4>
            <p className="text-slate-400 text-sm">
              {age} лет • {vehiclesCount} авто
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <StatusBadge status={owner.status} type="owner" animated={owner.status === 'active'} />
          <StatusBadge status={owner.loyaltyLevel} type="loyalty" size="sm" />
        </div>
      </div>
      
      <div className="space-y-3 text-sm mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Телефон:</span>
          <span className="text-white font-medium">{owner.personalInfo.phone}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Страховка:</span>
          <StatusBadge status={owner.insurance.type} />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Неоплаченные штрафы:</span>
          <span className={`font-medium ${unpaidFinesCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {unpaidFinesCount} шт.
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <div className="text-xs text-slate-400">
          {owner.vehicles[0]?.brand} {owner.vehicles[0]?.model}
        </div>
        <div className={`text-xs font-semibold ${owner.fines.totalUnpaidAmount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
          {formatCurrency(owner.fines.totalUnpaidAmount)}
        </div>
      </div>
    </BentoCard>
  );
};

// Компонент карточки автомобиля
const VehicleCard = ({ vehicle, onClick }: { vehicle: Vehicle; onClick?: () => void }) => {
  const owner = carOwners.find(o => o.id === vehicle.ownerId);
  const daysUntilService = vehicle.nextServiceDate ? getDaysUntil(vehicle.nextServiceDate) : null;
  
  const getVehicleColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'maintenance': return COLORS.orange;
      case 'accident': return COLORS.rose;
      case 'stolen': return COLORS.purple;
      case 'scrapped': return COLORS.slate;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard className="p-4" glowColor={getVehicleColor(vehicle.status)} onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="text-2xl">{vehicle.image}</div>
          <div className="flex-1 min-w-0">
            <h5 className="text-white font-semibold text-sm mb-1">
              {vehicle.brand} {vehicle.model}
            </h5>
            <p className="text-slate-400 text-xs">{vehicle.licensePlate}</p>
          </div>
        </div>
        <StatusBadge status={vehicle.status} type="vehicle" animated={vehicle.status === 'active'} />
      </div>
      
      <div className="space-y-2 text-xs mb-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Год:</span>
          <span className="text-white">{vehicle.year}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Тип кузова:</span>
          <StatusBadge status={vehicle.bodyType} />
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Пробег:</span>
          <span className="text-white">{vehicle.mileage.toLocaleString()} км</span>
        </div>

        {daysUntilService !== null && (
          <div className="flex justify-between">
            <span className="text-slate-400">Следующее ТО:</span>
            <span className={`text-xs font-medium ${
              daysUntilService <= 7 ? 'text-rose-400' : 
              daysUntilService <= 30 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {daysUntilService} дн.
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
        <span className="text-xs text-slate-400">{owner?.personalInfo.fullName}</span>
        <span className="text-xs text-white font-medium">
          {vehicle.engineCapacity}L • {vehicle.horsepower} л.с.
        </span>
      </div>
    </BentoCard>
  );
};

// Компонент карточки штрафа
const FineCard = ({ fine, onClick }: { fine: Fine; onClick?: () => void }) => {
  const vehicle = carOwners.flatMap(o => o.vehicles).find(v => v.id === fine.vehicleId);
  const daysUntilDue = getDaysUntil(fine.dueDate);
  const hasDiscount = fine.discountExpiry && new Date(fine.discountExpiry) > new Date();
  
  const getFineColor = (status: string) => {
    switch (status) {
      case 'unpaid': return COLORS.rose;
      case 'paid': return COLORS.success;
      case 'disputed': return COLORS.orange;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard className="p-4" glowColor={getFineColor(fine.status)} onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <h5 className="text-white font-semibold text-sm mb-1 line-clamp-2">{fine.description}</h5>
          <p className="text-slate-400 text-xs">
            {vehicle?.brand} {vehicle?.model} • {fine.location}
          </p>
        </div>
        <StatusBadge status={fine.status} type="fine" animated={fine.status === 'unpaid'} />
      </div>
      
      <div className="space-y-2 text-xs mb-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Тип:</span>
          <StatusBadge status={fine.type} />
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Дата:</span>
          <span className="text-white">{formatDate(fine.date)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Срок оплаты:</span>
          <span className={`text-white ${daysUntilDue <= 7 ? 'text-rose-400 font-semibold' : ''}`}>
            {formatDate(fine.dueDate)}
          </span>
        </div>

        {hasDiscount && (
          <div className="flex justify-between">
            <span className="text-slate-400">Скидка до:</span>
            <span className="text-emerald-400 font-semibold">{formatDate(fine.discountExpiry!)}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
        <span className="text-xs text-slate-400">Сумма:</span>
        <span className="text-xs font-semibold text-amber-500">
          {formatCurrency(fine.amount)}
        </span>
      </div>
    </BentoCard>
  );
};

// Компонент карточки заявки
const RequestCard = ({ request, onClick }: { request: ServiceRequest; onClick?: () => void }) => {
  const owner = carOwners.find(o => o.id === request.ownerId);
  const vehicle = owner?.vehicles.find(v => v.id === request.vehicleId);
  
  const getRequestColor = (status: string) => {
    switch (status) {
      case 'submitted': return COLORS.blue;
      case 'approved': return COLORS.teal;
      case 'in_progress': return COLORS.orange;
      case 'completed': return COLORS.success;
      case 'cancelled': return COLORS.error;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard className="p-4" glowColor={getRequestColor(request.status)} onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <h5 className="text-white font-semibold text-sm mb-1 line-clamp-2">{request.description}</h5>
          <p className="text-slate-400 text-xs">
            {vehicle?.brand} {vehicle?.model} • {owner?.personalInfo.fullName}
          </p>
        </div>
        <StatusBadge status={request.status} type="request" animated={request.status === 'submitted'} />
      </div>
      
      <div className="space-y-2 text-xs mb-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Тип:</span>
          <StatusBadge status={request.type} />
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Срочность:</span>
          <StatusBadge status={request.urgency} />
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Подана:</span>
          <span className="text-white">{formatDate(request.timeline.submitted)}</span>
        </div>

        {request.scheduledDate && (
          <div className="flex justify-between">
            <span className="text-slate-400">Запланирована:</span>
            <span className="text-white">{formatDate(request.scheduledDate)}</span>
          </div>
        )}
      </div>
      
      {request.estimatedCost && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <span className="text-xs text-slate-400">Стоимость:</span>
          <span className="text-xs font-semibold text-amber-500">
            {formatCurrency(request.estimatedCost)}
          </span>
        </div>
      )}
    </BentoCard>
  );
};

// Основной компонент дашборда
const CarOwnerDashboard = () => {
  const [selectedOwner, setSelectedOwner] = useState<CarOwner | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedFine, setSelectedFine] = useState<Fine | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'owners' | 'vehicles' | 'fines' | 'requests'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentTime = useClientTime();
  
  // Статистика для дашборда
  const stats = useMemo(() => {
    const totalOwners = carOwners.length;
    const activeOwners = carOwners.filter(o => o.status === 'active').length;
    const totalVehicles = carOwners.reduce((acc, owner) => acc + owner.vehicles.length, 0);
    const activeVehicles = carOwners.flatMap(o => o.vehicles).filter(v => v.status === 'active').length;
    const totalUnpaidFines = carOwners.reduce((acc, owner) => acc + owner.fines.unpaid.length, 0);
    const totalUnpaidAmount = carOwners.reduce((acc, owner) => acc + owner.fines.totalUnpaidAmount, 0);
    const upcomingServices = carOwners.flatMap(o => o.vehicles).filter(v => 
      v.nextServiceDate && getDaysUntil(v.nextServiceDate) <= 30
    ).length;
    
    return {
      totalOwners,
      activeOwners,
      totalVehicles,
      activeVehicles,
      totalUnpaidFines,
      totalUnpaidAmount,
      upcomingServices
    };
  }, []);

  // Фильтрация данных с поиском
  const filteredOwners = useMemo(() => {
    if (!searchQuery) return carOwners;
    const query = searchQuery.toLowerCase();
    return carOwners.filter(owner => 
      owner.personalInfo.fullName.toLowerCase().includes(query) ||
      owner.personalInfo.phone.includes(query) ||
      owner.vehicles.some(vehicle => 
        vehicle.brand.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.licensePlate.toLowerCase().includes(query)
      )
    );
  }, [searchQuery]);

  const activeOwners = useMemo(() => 
    carOwners.filter(owner => owner.status === 'active'), 
  []);
  
  const allVehicles = useMemo(() => 
    carOwners.flatMap(owner => owner.vehicles), 
  []);
  
  const unpaidFines = useMemo(() => 
    carOwners.flatMap(owner => owner.fines.unpaid), 
  []);
  
  const activeRequests = useMemo(() => 
    serviceRequests.filter(request => request.status !== 'completed' && request.status !== 'cancelled'), 
  []);

  const upcomingServices = useMemo(() => 
    allVehicles.filter(vehicle => 
      vehicle.nextServiceDate && getDaysUntil(vehicle.nextServiceDate) <= 30
    ), 
  [allVehicles]);

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
              Автовладельцы
            </h1>
            <p className="text-slate-400 text-lg">Управление автовладельцами и транспортными средствами</p>
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

        {/* Поиск и навигация */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск по владельцам, автомобилям, номерам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent backdrop-blur-xl"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Навигация */}
        <nav className="flex space-x-1 p-1 bg-slate-800/50 rounded-2xl backdrop-blur-xl border border-slate-700/50 overflow-x-auto">
          {[
            { id: 'overview', label: 'Обзор', icon: '📊' },
            { id: 'owners', label: 'Владельцы', icon: '👥' },
            { id: 'vehicles', label: 'Автомобили', icon: '🚗' },
            { id: 'fines', label: 'Штрафы', icon: '🚨' },
            { id: 'requests', label: 'Заявки', icon: '🔧' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white shadow-lg shadow-black/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
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
                  title="Всего владельцев"
                  value={stats.totalOwners}
                  change={2.5}
                  icon="👥"
                  color={COLORS.blue}
                  subtitle={`${stats.activeOwners} активных`}
                  trend="up"
                  delay={0}
                />
                <StatCard
                  title="Автомобилей"
                  value={stats.totalVehicles}
                  change={1.2}
                  icon="🚗"
                  color={COLORS.orange}
                  subtitle={`${stats.activeVehicles} на ходу`}
                  trend="up"
                  delay={0.1}
                />
                <StatCard
                  title="Неоплаченные штрафы"
                  value={stats.totalUnpaidFines}
                  change={-1.8}
                  icon="🚨"
                  color={COLORS.rose}
                  subtitle="требуют оплаты"
                  trend="down"
                  delay={0.2}
                />
                <StatCard
                  title="Предстоящие ТО"
                  value={stats.upcomingServices}
                  change={3.2}
                  icon="🔧"
                  color={COLORS.purple}
                  subtitle="в ближайшие 30 дней"
                  trend="up"
                  delay={0.3}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Активные владельцы */}
                <BentoCard className="p-6" glowColor={COLORS.purple}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Активные владельцы</h3>
                    <button 
                      className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200"
                      onClick={() => setActiveTab('owners')}
                    >
                      Все →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {activeOwners.slice(0, 4).map((owner) => (
                      <motion.div 
                        key={owner.id}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                        onClick={() => setSelectedOwner(owner)}
                        whileHover={{ x: 4 }}
                      >
                        <div className="text-2xl group-hover:scale-110 transition-transform duration-200">
                          {owner.personalInfo.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm truncate">{owner.personalInfo.fullName}</h4>
                          <p className="text-slate-400 text-xs">
                            {owner.vehicles.length} авто • {owner.fines.unpaid.length} штрафов
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <StatusBadge status={owner.status} type="owner" size="sm" />
                          <StatusBadge status={owner.loyaltyLevel} type="loyalty" size="sm" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </BentoCard>

                {/* Неоплаченные штрафы */}
                <BentoCard className="p-6" glowColor={COLORS.orange}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Неоплаченные штрафы</h3>
                    <button 
                      className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200"
                      onClick={() => setActiveTab('fines')}
                    >
                      Все →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {unpaidFines.slice(0, 4).map((fine) => (
                      <motion.div 
                        key={fine.id}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                        onClick={() => setSelectedFine(fine)}
                        whileHover={{ x: 4 }}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          fine.type === 'speeding' ? 'bg-gradient-to-br from-rose-500 to-pink-500' :
                          fine.type === 'parking' ? 'bg-gradient-to-br from-orange-500 to-amber-500' :
                          'bg-gradient-to-br from-slate-500 to-slate-600'
                        }`}>
                          {fine.type[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm line-clamp-2">{fine.description}</h4>
                          <p className="text-slate-400 text-xs">
                            {formatCurrency(fine.amount)} • до {formatDate(fine.dueDate)}
                          </p>
                        </div>
                        <StatusBadge status={fine.status} type="fine" size="sm" />
                      </motion.div>
                    ))}
                  </div>
                </BentoCard>
              </div>

              {/* Предстоящие ТО и активные заявки */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Предстоящие ТО */}
                <BentoCard className="p-6" glowColor={COLORS.teal}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Предстоящие ТО</h3>
                    <span className="text-slate-400 text-sm font-medium">
                      {upcomingServices.length} автомобилей
                    </span>
                  </div>
                  <div className="space-y-4">
                    {upcomingServices.slice(0, 3).map((vehicle) => {
                      const owner = carOwners.find(o => o.id === vehicle.ownerId);
                      const daysUntilService = getDaysUntil(vehicle.nextServiceDate!);
                      
                      return (
                        <motion.div 
                          key={vehicle.id}
                          className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                          onClick={() => setSelectedVehicle(vehicle)}
                          whileHover={{ x: 4 }}
                        >
                          <div className="text-2xl group-hover:scale-110 transition-transform duration-200">
                            {vehicle.image}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm">
                              {vehicle.brand} {vehicle.model}
                            </h4>
                            <p className="text-slate-400 text-xs">
                              {owner?.personalInfo.fullName} • {vehicle.licensePlate}
                            </p>
                          </div>
                          <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            daysUntilService <= 7 ? 'bg-rose-500/20 text-rose-300' : 
                            daysUntilService <= 30 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {daysUntilService} дн.
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </BentoCard>

                {/* Активные заявки */}
                <BentoCard className="p-6" glowColor={COLORS.blue}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Активные заявки</h3>
                    <button 
                      className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200"
                      onClick={() => setActiveTab('requests')}
                    >
                      Все →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {activeRequests.slice(0, 3).map((request) => (
                      <RequestCard 
                        key={request.id} 
                        request={request} 
                        onClick={() => setSelectedRequest(request)}
                      />
                    ))}
                  </div>
                </BentoCard>
              </div>
            </motion.div>
          )}

          {activeTab === 'owners' && (
            <motion.div
              key="owners"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Автовладельцы</h2>
                <p className="text-slate-400">Управление владельцами транспортных средств</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredOwners.map((owner, index) => (
                  <motion.div
                    key={owner.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <OwnerCard 
                      owner={owner} 
                      onClick={() => setSelectedOwner(owner)}
                    />
                  </motion.div>
                ))}
              </div>

              {filteredOwners.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Владельцы не найдены</h3>
                  <p className="text-slate-400">Попробуйте изменить параметры поиска</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'vehicles' && (
            <motion.div
              key="vehicles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Транспортные средства</h2>
                <p className="text-slate-400">Управление автомобилями и их состоянием</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allVehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <VehicleCard 
                      vehicle={vehicle} 
                      onClick={() => setSelectedVehicle(vehicle)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'fines' && (
            <motion.div
              key="fines"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Штрафы</h2>
                <p className="text-slate-400">Управление штрафами и их оплатой</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unpaidFines.map((fine, index) => (
                  <motion.div
                    key={fine.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FineCard 
                      fine={fine} 
                      onClick={() => setSelectedFine(fine)}
                    />
                  </motion.div>
                ))}
              </div>

              {unpaidFines.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Все штрафы оплачены</h3>
                  <p className="text-slate-400">Отличная работа! Неоплаченных штрафов нет</p>
                </div>
              )}
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
                <h2 className="text-2xl font-bold text-white mb-2">Сервисные заявки</h2>
                <p className="text-slate-400">Управление заявками на обслуживание и ремонт</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RequestCard 
                      request={request} 
                      onClick={() => setSelectedRequest(request)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Модальные окна */}
      <Modal 
        isOpen={!!selectedOwner} 
        onClose={() => setSelectedOwner(null)}
        title={selectedOwner?.personalInfo.fullName}
        size="xl"
      >
        {selectedOwner && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Персональная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дата рождения:</span>
                    <span className="text-white">{formatDate(selectedOwner.personalInfo.birthDate)} ({calculateAge(selectedOwner.personalInfo.birthDate)} лет)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Телефон:</span>
                    <span className="text-white">{selectedOwner.personalInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white">{selectedOwner.personalInfo.email || 'Не указан'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Адрес:</span>
                    <span className="text-white text-right">{selectedOwner.personalInfo.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Паспорт:</span>
                    <span className="text-white">{selectedOwner.personalInfo.passport}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Водительские права:</span>
                    <span className="text-white">{selectedOwner.personalInfo.driverLicense}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Страховая информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Страховая компания:</span>
                    <span className="text-white">{selectedOwner.insurance.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Номер полиса:</span>
                    <span className="text-white">{selectedOwner.insurance.policyNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Действует до:</span>
                    <span className="text-white">{formatDate(selectedOwner.insurance.validUntil)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип страховки:</span>
                    <StatusBadge status={selectedOwner.insurance.type} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Стоимость:</span>
                    <span className="text-white font-semibold">{formatCurrency(selectedOwner.insurance.cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Страховое покрытие:</span>
                    <span className="text-white font-semibold">{formatCurrency(selectedOwner.insurance.coverage)}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.teal}>
                <h4 className="text-lg font-semibold text-white mb-4">Статистика штрафов</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Неоплаченные штрафы:</span>
                    <span className="text-white">{selectedOwner.fines.unpaid.length} шт.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Оплаченные штрафы:</span>
                    <span className="text-white">{selectedOwner.fines.paid.length} шт.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Общая сумма к оплате:</span>
                    <span className="text-white font-semibold text-rose-500">{formatCurrency(selectedOwner.fines.totalUnpaidAmount)}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.orange}>
                <h4 className="text-lg font-semibold text-white mb-4">Технические осмотры</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Последний осмотр:</span>
                    <span className="text-white">{formatDate(selectedOwner.technicalInspections[0]?.inspectionDate || 'Не проводился')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Результат:</span>
                    <StatusBadge status={selectedOwner.technicalInspections[0]?.result || 'failed'} type="inspection" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Станция:</span>
                    <span className="text-white">{selectedOwner.technicalInspections[0]?.station || 'Не указана'}</span>
                  </div>
                </div>
              </BentoCard>
            </div>

            <BentoCard className="p-6" glowColor={COLORS.emerald}>
              <h4 className="text-lg font-semibold text-white mb-4">Транспортные средства</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedOwner.vehicles.map((vehicle) => (
                  <VehicleCard 
                    key={vehicle.id} 
                    vehicle={vehicle} 
                    onClick={() => setSelectedVehicle(vehicle)}
                  />
                ))}
              </div>
            </BentoCard>

            {selectedOwner.fines.unpaid.length > 0 && (
              <BentoCard className="p-6" glowColor={COLORS.rose}>
                <h4 className="text-lg font-semibold text-white mb-4">Неоплаченные штрафы</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedOwner.fines.unpaid.map((fine) => (
                    <FineCard 
                      key={fine.id} 
                      fine={fine} 
                      onClick={() => setSelectedFine(fine)}
                    />
                  ))}
                </div>
              </BentoCard>
            )}

            {selectedOwner.serviceHistory.length > 0 && (
              <BentoCard className="p-6" glowColor={COLORS.indigo}>
                <h4 className="text-lg font-semibold text-white mb-4">История обслуживания</h4>
                <div className="space-y-3">
                  {selectedOwner.serviceHistory.map((record) => (
                    <div key={record.id} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                      <div>
                        <div className="text-white font-medium text-sm">{record.description}</div>
                        <div className="text-slate-400 text-xs">{formatDate(record.date)} • {record.serviceCenter}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold text-sm">{formatCurrency(record.cost)}</div>
                        <StatusBadge status={record.type} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </BentoCard>
            )}

            {selectedOwner.notes && (
              <BentoCard className="p-6" glowColor={COLORS.indigo}>
                <h4 className="text-lg font-semibold text-white mb-4">Примечания</h4>
                <p className="text-slate-300 text-sm">{selectedOwner.notes}</p>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!selectedVehicle} 
        onClose={() => setSelectedVehicle(null)}
        title={`${selectedVehicle?.brand} ${selectedVehicle?.model}`}
        size="xl"
      >
        {selectedVehicle && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Основная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Год выпуска:</span>
                    <span className="text-white">{selectedVehicle.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Цвет:</span>
                    <span className="text-white">{selectedVehicle.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Госномер:</span>
                    <span className="text-white font-mono">{selectedVehicle.licensePlate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">VIN:</span>
                    <span className="text-white font-mono">{selectedVehicle.vin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedVehicle.status} type="vehicle" />
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Технические характеристики</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип кузова:</span>
                    <StatusBadge status={selectedVehicle.bodyType} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип топлива:</span>
                    <StatusBadge status={selectedVehicle.fuelType} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Объем двигателя:</span>
                    <span className="text-white">{selectedVehicle.engineCapacity} л</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Мощность:</span>
                    <span className="text-white">{selectedVehicle.horsepower} л.с.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Коробка передач:</span>
                    <StatusBadge status={selectedVehicle.transmission} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Пробег:</span>
                    <span className="text-white">{selectedVehicle.mileage.toLocaleString()} км</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.teal}>
                <h4 className="text-lg font-semibold text-white mb-4">Регистрационные данные</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Номер СТС:</span>
                    <span className="text-white">{selectedVehicle.registration.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дата выдачи:</span>
                    <span className="text-white">{formatDate(selectedVehicle.registration.issueDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Действует до:</span>
                    <span className="text-white">{formatDate(selectedVehicle.registration.expiryDate)}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.orange}>
                <h4 className="text-lg font-semibold text-white mb-4">Технические параметры</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Снаряженная масса:</span>
                    <span className="text-white">{selectedVehicle.technicalData.weight} кг</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Макс. масса:</span>
                    <span className="text-white">{selectedVehicle.technicalData.maxWeight} кг</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Количество мест:</span>
                    <span className="text-white">{selectedVehicle.technicalData.seats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Экологический класс:</span>
                    <span className="text-white">Евро {selectedVehicle.technicalData.ecoClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Выбросы CO2:</span>
                    <span className="text-white">{selectedVehicle.technicalData.emissions} г/км</span>
                  </div>
                </div>
              </BentoCard>
            </div>

            {selectedVehicle.features && selectedVehicle.features.length > 0 && (
              <BentoCard className="p-6" glowColor={COLORS.cyan}>
                <h4 className="text-lg font-semibold text-white mb-4">Оснащение</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVehicle.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1.5 bg-cyan-500/10 text-cyan-300 rounded-full text-xs border border-cyan-500/20"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </BentoCard>
            )}

            <BentoCard className="p-6" glowColor={COLORS.emerald}>
              <h4 className="text-lg font-semibold text-white mb-4">Владелец</h4>
              <div className="flex items-center space-x-4">
                <div className="text-3xl">
                  {carOwners.find(o => o.id === selectedVehicle.ownerId)?.personalInfo.avatar}
                </div>
                <div>
                  <h5 className="text-white font-semibold">
                    {carOwners.find(o => o.id === selectedVehicle.ownerId)?.personalInfo.fullName}
                  </h5>
                  <p className="text-slate-400 text-sm">
                    {carOwners.find(o => o.id === selectedVehicle.ownerId)?.personalInfo.phone}
                  </p>
                </div>
              </div>
            </BentoCard>

            {(selectedVehicle.lastServiceDate || selectedVehicle.nextServiceDate) && (
              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Обслуживание</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {selectedVehicle.lastServiceDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Последнее ТО:</span>
                      <span className="text-white">{formatDate(selectedVehicle.lastServiceDate)}</span>
                    </div>
                  )}
                  {selectedVehicle.nextServiceDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Следующее ТО:</span>
                      <span className="text-white">{formatDate(selectedVehicle.nextServiceDate)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Интервал обслуживания:</span>
                    <span className="text-white">{selectedVehicle.serviceInterval.toLocaleString()} км</span>
                  </div>
                </div>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!selectedFine} 
        onClose={() => setSelectedFine(null)}
        title="Информация о штрафе"
        size="lg"
      >
        {selectedFine && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Основная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип нарушения:</span>
                    <StatusBadge status={selectedFine.type} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedFine.status} type="fine" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Сумма:</span>
                    <span className="text-white font-semibold">{formatCurrency(selectedFine.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дата нарушения:</span>
                    <span className="text-white">{formatDate(selectedFine.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Срок оплаты:</span>
                    <span className="text-white">{formatDate(selectedFine.dueDate)}</span>
                  </div>
                  {selectedFine.discountExpiry && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Скидка действует до:</span>
                      <span className="text-emerald-400 font-semibold">{formatDate(selectedFine.discountExpiry)}</span>
                    </div>
                  )}
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Место и описание</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Место нарушения:</span>
                    <span className="text-white text-right">{selectedFine.location}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400">Описание:</span>
                    <span className="text-white text-right">{selectedFine.description}</span>
                  </div>
                </div>
              </BentoCard>
            </div>

            <BentoCard className="p-6" glowColor={COLORS.teal}>
              <h4 className="text-lg font-semibold text-white mb-4">Автомобиль</h4>
              <div className="flex items-center space-x-4">
                <div className="text-3xl">
                  {carOwners.flatMap(o => o.vehicles).find(v => v.id === selectedFine.vehicleId)?.image}
                </div>
                <div>
                  <h5 className="text-white font-semibold">
                    {carOwners.flatMap(o => o.vehicles).find(v => v.id === selectedFine.vehicleId)?.brand} {carOwners.flatMap(o => o.vehicles).find(v => v.id === selectedFine.vehicleId)?.model}
                  </h5>
                  <p className="text-slate-400 text-sm">
                    {carOwners.flatMap(o => o.vehicles).find(v => v.id === selectedFine.vehicleId)?.licensePlate}
                  </p>
                </div>
              </div>
            </BentoCard>
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!selectedRequest} 
        onClose={() => setSelectedRequest(null)}
        title="Сервисная заявка"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Основная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип заявки:</span>
                    <StatusBadge status={selectedRequest.type} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedRequest.status} type="request" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Срочность:</span>
                    <StatusBadge status={selectedRequest.urgency} />
                  </div>
                  {selectedRequest.estimatedCost && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Примерная стоимость:</span>
                      <span className="text-white font-semibold">{formatCurrency(selectedRequest.estimatedCost)}</span>
                    </div>
                  )}
                  {selectedRequest.actualCost && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Фактическая стоимость:</span>
                      <span className="text-white font-semibold">{formatCurrency(selectedRequest.actualCost)}</span>
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
                  {selectedRequest.timeline.approved && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Одобрена:</span>
                      <span className="text-white">{formatDateTime(selectedRequest.timeline.approved)}</span>
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
                  {selectedRequest.scheduledDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Запланирована на:</span>
                      <span className="text-white">{formatDate(selectedRequest.scheduledDate)}</span>
                    </div>
                  )}
                  {selectedRequest.completionDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Завершена:</span>
                      <span className="text-white">{formatDate(selectedRequest.completionDate)}</span>
                    </div>
                  )}
                </div>
              </BentoCard>
            </div>

            <BentoCard className="p-6" glowColor={COLORS.teal}>
              <h4 className="text-lg font-semibold text-white mb-4">Описание заявки</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{selectedRequest.description}</p>
            </BentoCard>

            <BentoCard className="p-6" glowColor={COLORS.orange}>
              <h4 className="text-lg font-semibold text-white mb-4">Связанные данные</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {carOwners.find(o => o.id === selectedRequest.ownerId)?.personalInfo.avatar}
                  </div>
                  <div>
                    <h5 className="text-white font-semibold text-sm">
                      {carOwners.find(o => o.id === selectedRequest.ownerId)?.personalInfo.fullName}
                    </h5>
                    <p className="text-slate-400 text-xs">Владелец</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {carOwners.find(o => o.id === selectedRequest.ownerId)?.vehicles.find(v => v.id === selectedRequest.vehicleId)?.image}
                  </div>
                  <div>
                    <h5 className="text-white font-semibold text-sm">
                      {carOwners.find(o => o.id === selectedRequest.ownerId)?.vehicles.find(v => v.id === selectedRequest.vehicleId)?.brand} {carOwners.find(o => o.id === selectedRequest.ownerId)?.vehicles.find(v => v.id === selectedRequest.vehicleId)?.model}
                    </h5>
                    <p className="text-slate-400 text-xs">Автомобиль</p>
                  </div>
                </div>
              </div>
            </BentoCard>

            {selectedRequest.assignedService && (
              <BentoCard className="p-6" glowColor={COLORS.indigo}>
                <h4 className="text-lg font-semibold text-white mb-4">Сервисный центр</h4>
                <p className="text-slate-300 text-sm">{selectedRequest.assignedService}</p>
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

export default CarOwnerDashboard;