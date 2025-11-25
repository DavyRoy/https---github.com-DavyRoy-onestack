'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Типы данных
interface SocialMedia {
  platform: string;
  url: string;
  icon: string;
}

interface MaintenanceRecord {
  date: string;
  type: string;
  cost: number;
  technician: string;
  duration: number;
  parts: string[];
  description: string;
}

interface Vehicle {
  id: string;
  licensePlate: string;
  model: string;
  type: 'truck' | 'van' | 'refrigerator' | 'container' | 'courier';
  status: 'active' | 'maintenance' | 'on_route' | 'inactive';
  year: number;
  capacity: number;
  currentLoad: number;
  fuelType: 'diesel' | 'petrol' | 'electric' | 'hybrid';
  fuelEfficiency: number;
  currentFuel: number;
  mileage: number;
  lastMaintenance: string;
  nextMaintenance: string;
  insurance: {
    number: string;
    expiry: string;
    provider: string;
    status: 'active' | 'expired' | 'suspended';
  };
  driver?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
    lastUpdate: string;
  };
  specifications: {
    engine: string;
    transmission: string;
    dimensions: string;
    weight: string;
    manufacturer: string;
    model: string;
    vin: string;
  };
  maintenanceHistory: MaintenanceRecord[];
  statistics: {
    monthlyDistance: number;
    fuelConsumption: number;
    efficiency: number;
    downtime: number;
    avgSpeed: number;
    co2Emission: number;
  };
  costs: {
    fuel: number;
    maintenance: number;
    insurance: number;
    depreciation: number;
    total: number;
  };
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  license: {
    number: string;
    type: string;
    expiry: string;
    status: 'active' | 'expired' | 'suspended';
  };
  status: 'active' | 'on_delivery' | 'break' | 'off' | 'vacation';
  experience: number;
  rating: number;
  currentVehicle?: string;
  deliveriesToday: number;
  totalDeliveries: number;
  address: string;
  hiredDate: string;
  performance: {
    onTimeRate: number;
    safetyScore: number;
    efficiency: number;
    customerRating: number;
  };
  schedule: {
    shift: 'morning' | 'evening' | 'night';
    days: string[];
    startTime: string;
    endTime: string;
  };
  contacts: {
    emergency: string;
    secondaryPhone?: string;
  };
}

interface DeliveryRoute {
  id: string;
  name: string;
  vehicleId: string;
  driverId: string;
  status: 'planned' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  startTime: string;
  estimatedEnd: string;
  actualEnd?: string;
  stops: DeliveryStop[];
  totalDistance: number;
  completedDistance: number;
  totalStops: number;
  completedStops: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  revenue: number;
  expenses: number;
  client: {
    name: string;
    contact: string;
    phone: string;
    email: string;
  };
  routeOptimization: {
    suggested: boolean;
    savings: number;
    optimizedStops: number;
  };
}

interface DeliveryStop {
  id: string;
  address: string;
  contact: string;
  phone: string;
  type: 'pickup' | 'delivery' | 'return' | 'service';
  status: 'pending' | 'arrived' | 'completed' | 'cancelled' | 'delayed';
  estimatedTime: string;
  actualTime?: string;
  notes?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  packages: {
    count: number;
    weight: number;
    dimensions: string;
    specialInstructions?: string;
  };
  proof?: {
    signature: boolean;
    photo: boolean;
    notes?: string;
  };
}

interface LogisticsCompany {
  id: string;
  name: string;
  type: 'courier' | 'trucking' | 'logistics' | 'specialized';
  status: 'active' | 'expansion' | 'maintenance';
  classification: 'A+' | 'A' | 'B' | 'C';
  registrationNumber: string;
  taxId: string;
  foundationDate: string;
  logisticsManager: string;
  operationsManager: string;
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
    social?: SocialMedia[];
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
    totalVehicles: number;
    activeVehicles: number;
    totalDrivers: number;
    activeDrivers: number;
    monthlyDeliveries: number;
    dailyShipments: number;
    onTimeRate: number;
    efficiency: number;
  };
  financial: {
    budget: number;
    revenue: number;
    expenses: number;
    profit: number;
    quarterly: { quarter: string; income: number; expenses: number }[];
  };
  coverage: {
    regions: string[];
    cities: number;
    international: boolean;
    specialZones: string[];
  };
  safety: {
    standards: string[];
    lastInspection: string;
    nextInspection: string;
    compliance: number;
    incidents: number;
    safetyScore: number;
  };
}

// Моки данных для логистической компании
const logisticsData: LogisticsCompany = {
  id: 'log-001',
  name: 'ТрансЛогистик Групп',
  type: 'logistics',
  status: 'active',
  classification: 'A+',
  registrationNumber: '1187746009012',
  taxId: '7723456790',
  foundationDate: '2015-08-12',
  logisticsManager: 'Петров Алексей Викторович',
  operationsManager: 'Ковалева Ирина Дмитриевна',
  address: {
    legal: 'г. Москва, Центральный административный округ, ул. Транспортная, д. 15',
    actual: 'г. Москва, Логистический парк "Восточный", терминал 3',
    coordinates: { lat: 55.7586, lng: 37.7322 }
  },
  contacts: {
    phone: '+7 (495) 123-45-67',
    emergency: '+7 (495) 123-45-68',
    email: 'info@translogistic.ru',
    website: 'www.translogistic.ru',
    social: [
      { platform: 'VK', url: 'https://vk.com/translogistic', icon: '👥' },
      { platform: 'Telegram', url: 'https://t.me/translogistic_news', icon: '📢' },
      { platform: 'Instagram', url: 'https://instagram.com/translogistic', icon: '📷' }
    ]
  },
  licenses: [
    {
      number: 'ТР-77-01-045678',
      type: 'Транспортная деятельность',
      issueDate: '2023-02-15',
      expirationDate: '2026-02-14',
      status: 'active',
      issuer: 'Федеральная служба по надзору в сфере транспорта',
      scope: ['Грузоперевозки', 'Логистические услуги', 'Экспедирование']
    },
    {
      number: 'ТМ-77-02-067890',
      type: 'Международные перевозки',
      issueDate: '2023-03-10',
      expirationDate: '2025-03-09',
      status: 'active',
      issuer: 'Федеральная таможенная служба',
      scope: ['Международные перевозки', 'Таможенное оформление']
    },
    {
      number: 'ОГ-77-01-078901',
      type: 'Перевозка опасных грузов',
      issueDate: '2022-12-05',
      expirationDate: '2024-12-04',
      status: 'active',
      issuer: 'Министерство промышленности и торговли',
      scope: ['Опасные грузы', 'Специализированные перевозки']
    }
  ],
  statistics: {
    totalVehicles: 48,
    activeVehicles: 42,
    totalDrivers: 52,
    activeDrivers: 45,
    monthlyDeliveries: 12500,
    dailyShipments: 450,
    onTimeRate: 96.2,
    efficiency: 94.5
  },
  financial: {
    budget: 185000000,
    revenue: 168000000,
    expenses: 145000000,
    profit: 23000000,
    quarterly: [
      { quarter: 'Q1 2024', income: 38500000, expenses: 34200000 },
      { quarter: 'Q2 2024', income: 41400000, expenses: 37000000 },
      { quarter: 'Q3 2024', income: 42800000, expenses: 36500000 },
      { quarter: 'Q4 2024', income: 45300000, expenses: 37300000 }
    ]
  },
  coverage: {
    regions: ['Центральный', 'Северо-Западный', 'Южный', 'Приволжский'],
    cities: 45,
    international: true,
    specialZones: ['Москва', 'Санкт-Петербург', 'Казань', 'Нижний Новгород']
  },
  safety: {
    standards: ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'ТР ТС 018/2011'],
    lastInspection: '2024-04-10',
    nextInspection: '2024-10-10',
    compliance: 97.5,
    incidents: 3,
    safetyScore: 95.8
  }
};

const vehicles: Vehicle[] = [
  {
    id: 'v-001',
    licensePlate: 'A123BC77',
    model: 'Volvo FH16',
    type: 'truck',
    status: 'on_route',
    year: 2022,
    capacity: 20000,
    currentLoad: 15800,
    fuelType: 'diesel',
    fuelEfficiency: 28.5,
    currentFuel: 65,
    mileage: 125430,
    lastMaintenance: '2024-05-15',
    nextMaintenance: '2024-07-15',
    insurance: {
      number: 'INS-789456',
      expiry: '2024-12-31',
      provider: 'Ингосстрах',
      status: 'active'
    },
    driver: 'd-001',
    location: {
      lat: 55.7558,
      lng: 37.6173,
      address: 'Москва, Ленинградский проспект, 65',
      lastUpdate: '2024-06-18T14:30:00'
    },
    specifications: {
      engine: 'D13K460',
      transmission: 'I-Shift',
      dimensions: '7.8x2.5x3.9м',
      weight: '8500 кг',
      manufacturer: 'Volvo',
      model: 'FH16 540',
      vin: 'VOLVOH16A12345678'
    },
    maintenanceHistory: [
      {
        date: '2024-02-15',
        type: 'Плановое ТО',
        cost: 45000,
        technician: 'Иванов П.С.',
        duration: 6,
        parts: ['Масло двигательное', 'Фильтр воздушный', 'Свечи зажигания'],
        description: 'Регулярное техническое обслуживание'
      },
      {
        date: '2023-11-20',
        type: 'Ремонт тормозной системы',
        cost: 78000,
        technician: 'Петров А.В.',
        duration: 8,
        parts: ['Гидроцилиндр', 'Уплотнительные кольца', 'Гидравлическая жидкость'],
        description: 'Замена тормозных колодок и дисков'
      }
    ],
    statistics: {
      monthlyDistance: 8450,
      fuelConsumption: 2450,
      efficiency: 92,
      downtime: 2.3,
      avgSpeed: 68,
      co2Emission: 12500
    },
    costs: {
      fuel: 450000,
      maintenance: 120000,
      insurance: 180000,
      depreciation: 350000,
      total: 1100000
    }
  },
  {
    id: 'v-002',
    licensePlate: 'B456DE77',
    model: 'Mercedes Sprinter',
    type: 'van',
    status: 'active',
    year: 2023,
    capacity: 3500,
    currentLoad: 0,
    fuelType: 'diesel',
    fuelEfficiency: 35.2,
    currentFuel: 85,
    mileage: 45230,
    lastMaintenance: '2024-06-01',
    nextMaintenance: '2024-08-01',
    insurance: {
      number: 'INS-654321',
      expiry: '2024-11-15',
      provider: 'Росгосстрах',
      status: 'active'
    },
    driver: 'd-002',
    location: {
      lat: 55.7512,
      lng: 37.6185,
      address: 'Москва, складской комплекс №2',
      lastUpdate: '2024-06-18T10:15:00'
    },
    specifications: {
      engine: 'OM654',
      transmission: '9G-Tronic',
      dimensions: '6.0x2.0x2.5м',
      weight: '3200 кг',
      manufacturer: 'Mercedes-Benz',
      model: 'Sprinter 516',
      vin: 'MBZSPR516B456DE77'
    },
    maintenanceHistory: [
      {
        date: '2024-03-10',
        type: 'Плановое ТО',
        cost: 28000,
        technician: 'Сидоров М.П.',
        duration: 4,
        parts: ['Масло двигательное', 'Фильтры'],
        description: 'Регулярное техническое обслуживание'
      }
    ],
    statistics: {
      monthlyDistance: 5230,
      fuelConsumption: 1480,
      efficiency: 95,
      downtime: 0.8,
      avgSpeed: 55,
      co2Emission: 8900
    },
    costs: {
      fuel: 280000,
      maintenance: 75000,
      insurance: 120000,
      depreciation: 450000,
      total: 925000
    }
  },
  {
    id: 'v-003',
    licensePlate: 'C789FG77',
    model: 'Ford Transit Refrigerated',
    type: 'refrigerator',
    status: 'maintenance',
    year: 2021,
    capacity: 5000,
    currentLoad: 0,
    fuelType: 'diesel',
    fuelEfficiency: 32.1,
    currentFuel: 45,
    mileage: 89340,
    lastMaintenance: '2024-05-28',
    nextMaintenance: '2024-06-28',
    insurance: {
      number: 'INS-321654',
      expiry: '2024-10-20',
      provider: 'СОГАЗ',
      status: 'active'
    },
    specifications: {
      engine: 'EcoBlue 2.0',
      transmission: '6-ст. МКПП',
      dimensions: '5.8x2.1x2.8м',
      weight: '2850 кг',
      manufacturer: 'Ford',
      model: 'Transit Custom',
      vin: 'FORDTC789FG77123'
    },
    maintenanceHistory: [
      {
        date: '2024-04-15',
        type: 'Ремонт холодильной установки',
        cost: 125000,
        technician: 'Козлов Д.И.',
        duration: 12,
        parts: ['Компрессор', 'Хладагент', 'Датчики температуры'],
        description: 'Замена компрессора и заправка хладагента'
      }
    ],
    statistics: {
      monthlyDistance: 6780,
      fuelConsumption: 2110,
      efficiency: 88,
      downtime: 5.7,
      avgSpeed: 52,
      co2Emission: 10500
    },
    costs: {
      fuel: 320000,
      maintenance: 180000,
      insurance: 95000,
      depreciation: 280000,
      total: 875000
    }
  },
  {
    id: 'v-004',
    licensePlate: 'D012GH77',
    model: 'GAZelle NEXT',
    type: 'courier',
    status: 'active',
    year: 2023,
    capacity: 1500,
    currentLoad: 850,
    fuelType: 'petrol',
    fuelEfficiency: 42.5,
    currentFuel: 70,
    mileage: 23450,
    lastMaintenance: '2024-05-20',
    nextMaintenance: '2024-07-20',
    insurance: {
      number: 'INS-987123',
      expiry: '2024-09-30',
      provider: 'АльфаСтрахование',
      status: 'active'
    },
    driver: 'd-003',
    location: {
      lat: 55.7645,
      lng: 37.6254,
      address: 'Москва, район Хамовники',
      lastUpdate: '2024-06-18T15:45:00'
    },
    specifications: {
      engine: 'UMZ-4216',
      transmission: '5-ст. МКПП',
      dimensions: '4.8x1.9x2.1м',
      weight: '2100 кг',
      manufacturer: 'ГАЗ',
      model: 'GAZelle NEXT',
      vin: 'GAZNEXTD012GH77'
    },
    maintenanceHistory: [
      {
        date: '2024-04-05',
        type: 'Плановое ТО',
        cost: 15000,
        technician: 'Федоров С.М.',
        duration: 3,
        parts: ['Масло двигательное', 'Фильтры'],
        description: 'Регулярное техническое обслуживание'
      }
    ],
    statistics: {
      monthlyDistance: 3890,
      fuelConsumption: 915,
      efficiency: 96,
      downtime: 0.5,
      avgSpeed: 48,
      co2Emission: 7200
    },
    costs: {
      fuel: 180000,
      maintenance: 45000,
      insurance: 80000,
      depreciation: 320000,
      total: 625000
    }
  },
  {
    id: 'v-005',
    licensePlate: 'E345IJ77',
    model: 'MAN TGS',
    type: 'container',
    status: 'on_route',
    year: 2020,
    capacity: 25000,
    currentLoad: 21800,
    fuelType: 'diesel',
    fuelEfficiency: 26.8,
    currentFuel: 30,
    mileage: 187650,
    lastMaintenance: '2024-04-10',
    nextMaintenance: '2024-07-10',
    insurance: {
      number: 'INS-456789',
      expiry: '2024-08-15',
      provider: 'ВСК',
      status: 'active'
    },
    driver: 'd-004',
    location: {
      lat: 55.7789,
      lng: 37.6421,
      address: 'МКАД, 45 км',
      lastUpdate: '2024-06-18T16:20:00'
    },
    specifications: {
      engine: 'D2676',
      transmission: 'TipMatic',
      dimensions: '8.5x2.5x4.0м',
      weight: '10200 кг',
      manufacturer: 'MAN',
      model: 'TGS 28.440',
      vin: 'MANTGS28E345IJ77'
    },
    maintenanceHistory: [
      {
        date: '2024-01-20',
        type: 'Капитальный ремонт',
        cost: 245000,
        technician: 'Специалисты MAN',
        duration: 24,
        parts: ['Поршневая группа', 'Турбина', 'Топливная система'],
        description: 'Ремонт двигателя и трансмиссии'
      }
    ],
    statistics: {
      monthlyDistance: 11200,
      fuelConsumption: 3000,
      efficiency: 85,
      downtime: 3.2,
      avgSpeed: 62,
      co2Emission: 18900
    },
    costs: {
      fuel: 520000,
      maintenance: 280000,
      insurance: 220000,
      depreciation: 420000,
      total: 1440000
    }
  },
  {
    id: 'v-006',
    licensePlate: 'F678KL77',
    model: 'Tesla Semi',
    type: 'truck',
    status: 'active',
    year: 2024,
    capacity: 18000,
    currentLoad: 0,
    fuelType: 'electric',
    fuelEfficiency: 85.0,
    currentFuel: 90,
    mileage: 12300,
    lastMaintenance: '2024-05-05',
    nextMaintenance: '2024-11-05',
    insurance: {
      number: 'INS-159753',
      expiry: '2025-01-15',
      provider: 'РЕСО-Гарантия',
      status: 'active'
    },
    driver: 'd-005',
    location: {
      lat: 55.7412,
      lng: 37.6321,
      address: 'Москва, зарядная станция №5',
      lastUpdate: '2024-06-18T14:50:00'
    },
    specifications: {
      engine: 'Три мотор-редуктора',
      transmission: 'Электрическая',
      dimensions: '7.2x2.4x4.0м',
      weight: '9200 кг',
      manufacturer: 'Tesla',
      model: 'Semi',
      vin: 'TSLASEMIF678KL77'
    },
    maintenanceHistory: [
      {
        date: '2024-04-01',
        type: 'Обновление ПО',
        cost: 0,
        technician: 'IT отдел',
        duration: 2,
        parts: ['Обновление ПО'],
        description: 'Прошивка системы управления'
      }
    ],
    statistics: {
      monthlyDistance: 6450,
      fuelConsumption: 0,
      efficiency: 98,
      downtime: 0.2,
      avgSpeed: 65,
      co2Emission: 0
    },
    costs: {
      fuel: 45000,
      maintenance: 15000,
      insurance: 180000,
      depreciation: 850000,
      total: 1090000
    }
  }
];

const drivers: Driver[] = [
  {
    id: 'd-001',
    name: 'Иванов Сергей Петрович',
    phone: '+7 (916) 123-45-67',
    email: 's.ivanov@translogistic.ru',
    avatar: '👨‍💼',
    license: {
      number: '77AB123456',
      type: 'C, CE',
      expiry: '2026-08-20',
      status: 'active'
    },
    status: 'on_delivery',
    experience: 8,
    rating: 4.8,
    currentVehicle: 'v-001',
    deliveriesToday: 3,
    totalDeliveries: 1245,
    address: 'Москва, ул. Ленина, д. 15, кв. 42',
    hiredDate: '2016-03-15',
    performance: {
      onTimeRate: 96.2,
      safetyScore: 98.5,
      efficiency: 94.7,
      customerRating: 4.9
    },
    schedule: {
      shift: 'morning',
      days: ['пн', 'вт', 'ср', 'чт', 'пт'],
      startTime: '08:00',
      endTime: '17:00'
    },
    contacts: {
      emergency: '+7 (916) 999-88-77',
      secondaryPhone: '+7 (495) 123-45-67'
    }
  },
  {
    id: 'd-002',
    name: 'Петрова Анна Владимировна',
    phone: '+7 (925) 234-56-78',
    email: 'a.petrova@translogistic.ru',
    avatar: '👩‍💼',
    license: {
      number: '77AB234567',
      type: 'B, C',
      expiry: '2025-12-15',
      status: 'active'
    },
    status: 'active',
    experience: 5,
    rating: 4.9,
    currentVehicle: 'v-002',
    deliveriesToday: 7,
    totalDeliveries: 892,
    address: 'Москва, пр. Мира, д. 89, кв. 17',
    hiredDate: '2019-08-22',
    performance: {
      onTimeRate: 98.7,
      safetyScore: 99.2,
      efficiency: 97.3,
      customerRating: 5.0
    },
    schedule: {
      shift: 'evening',
      days: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
      startTime: '14:00',
      endTime: '23:00'
    },
    contacts: {
      emergency: '+7 (925) 888-77-66',
      secondaryPhone: '+7 (495) 234-56-78'
    }
  },
  {
    id: 'd-003',
    name: 'Сидоров Алексей Николаевич',
    phone: '+7 (903) 345-67-89',
    email: 'a.sidorov@translogistic.ru',
    avatar: '👨‍💼',
    license: {
      number: '77AB345678',
      type: 'C, CE, D',
      expiry: '2027-03-10',
      status: 'active'
    },
    status: 'on_delivery',
    experience: 12,
    rating: 4.7,
    currentVehicle: 'v-005',
    deliveriesToday: 2,
    totalDeliveries: 2156,
    address: 'Московская обл., г. Химки, ул. Московская, д. 23',
    hiredDate: '2012-11-05',
    performance: {
      onTimeRate: 95.8,
      safetyScore: 97.8,
      efficiency: 93.5,
      customerRating: 4.8
    },
    schedule: {
      shift: 'morning',
      days: ['пн', 'вт', 'ср', 'чт', 'пт'],
      startTime: '07:00',
      endTime: '16:00'
    },
    contacts: {
      emergency: '+7 (903) 777-66-55',
      secondaryPhone: '+7 (495) 345-67-89'
    }
  },
  {
    id: 'd-004',
    name: 'Козлов Дмитрий Игоревич',
    phone: '+7 (916) 456-78-90',
    email: 'd.kozlov@translogistic.ru',
    avatar: '👨‍💼',
    license: {
      number: '77AB456789',
      type: 'B, C',
      expiry: '2025-06-25',
      status: 'active'
    },
    status: 'break',
    experience: 3,
    rating: 4.5,
    currentVehicle: 'v-004',
    deliveriesToday: 4,
    totalDeliveries: 456,
    address: 'Москва, ул. Тверская, д. 12, кв. 8',
    hiredDate: '2021-02-14',
    performance: {
      onTimeRate: 92.3,
      safetyScore: 95.6,
      efficiency: 90.8,
      customerRating: 4.6
    },
    schedule: {
      shift: 'night',
      days: ['вт', 'ср', 'чт', 'пт', 'сб'],
      startTime: '22:00',
      endTime: '06:00'
    },
    contacts: {
      emergency: '+7 (916) 666-55-44',
      secondaryPhone: '+7 (495) 456-78-90'
    }
  },
  {
    id: 'd-005',
    name: 'Николаева Екатерина Сергеевна',
    phone: '+7 (985) 567-89-01',
    email: 'e.nikolaeva@translogistic.ru',
    avatar: '👩‍💼',
    license: {
      number: '77AB567890',
      type: 'B',
      expiry: '2026-11-30',
      status: 'active'
    },
    status: 'off',
    experience: 2,
    rating: 4.6,
    deliveriesToday: 0,
    totalDeliveries: 234,
    address: 'Москва, ул. Арбат, д. 45, кв. 33',
    hiredDate: '2022-05-30',
    performance: {
      onTimeRate: 94.1,
      safetyScore: 96.9,
      efficiency: 92.4,
      customerRating: 4.7
    },
    schedule: {
      shift: 'evening',
      days: ['пн', 'вт', 'ср', 'чт'],
      startTime: '15:00',
      endTime: '24:00'
    },
    contacts: {
      emergency: '+7 (985) 555-44-33',
      secondaryPhone: '+7 (495) 567-89-01'
    }
  }
];

const deliveryRoutes: DeliveryRoute[] = [
  {
    id: 'r-001',
    name: 'Маршрут №1 - Центральный округ',
    vehicleId: 'v-001',
    driverId: 'd-001',
    status: 'in_progress',
    startTime: '2024-06-18T08:00:00',
    estimatedEnd: '2024-06-18T18:30:00',
    totalDistance: 245,
    completedDistance: 167,
    totalStops: 4,
    completedStops: 2,
    priority: 'high',
    revenue: 45000,
    expenses: 12000,
    client: {
      name: 'ООО "Торговый Дом"',
      contact: 'Иванов А.В.',
      phone: '+7 (495) 111-22-33',
      email: 'a.ivanov@td.ru'
    },
    routeOptimization: {
      suggested: true,
      savings: 15,
      optimizedStops: 4
    },
    stops: [
      {
        id: 's-1',
        address: 'Москва, ул. Тверская, д. 15',
        contact: 'Иванов А.В.',
        phone: '+7 (495) 111-22-33',
        type: 'delivery',
        status: 'completed',
        estimatedTime: '09:30',
        actualTime: '09:25',
        coordinates: { lat: 55.7601, lng: 37.6075 },
        packages: {
          count: 15,
          weight: 450,
          dimensions: '0.5x0.5x0.3м',
          specialInstructions: 'Хрупкий груз'
        },
        proof: {
          signature: true,
          photo: true,
          notes: 'Получено в целости'
        }
      },
      {
        id: 's-2',
        address: 'Москва, ул. Арбат, д. 42',
        contact: 'Петрова С.И.',
        phone: '+7 (495) 222-33-44',
        type: 'delivery',
        status: 'completed',
        estimatedTime: '11:15',
        actualTime: '11:10',
        coordinates: { lat: 55.7496, lng: 37.5904 },
        packages: {
          count: 8,
          weight: 320,
          dimensions: '0.8x0.6x0.4м'
        },
        proof: {
          signature: true,
          photo: false
        }
      },
      {
        id: 's-3',
        address: 'Москва, пр. Мира, д. 125',
        contact: 'Сидоров Д.К.',
        phone: '+7 (495) 333-44-55',
        type: 'delivery',
        status: 'arrived',
        estimatedTime: '13:45',
        coordinates: { lat: 55.7867, lng: 37.6332 },
        packages: {
          count: 12,
          weight: 580,
          dimensions: '1.2x0.8x0.5м',
          specialInstructions: 'Требуется подъем на 3 этаж'
        }
      },
      {
        id: 's-4',
        address: 'Москва, ул. Новый Арбат, д. 24',
        contact: 'Козлова М.П.',
        phone: '+7 (495) 444-55-66',
        type: 'delivery',
        status: 'pending',
        estimatedTime: '15:30',
        coordinates: { lat: 55.7522, lng: 37.5833 },
        packages: {
          count: 5,
          weight: 150,
          dimensions: '0.4x0.4x0.3м'
        }
      }
    ]
  },
  {
    id: 'r-002',
    name: 'Маршрут №2 - Южный округ',
    vehicleId: 'v-002',
    driverId: 'd-002',
    status: 'in_progress',
    startTime: '2024-06-18T07:30:00',
    estimatedEnd: '2024-06-18T16:00:00',
    totalDistance: 180,
    completedDistance: 125,
    totalStops: 3,
    completedStops: 2,
    priority: 'medium',
    revenue: 28000,
    expenses: 8500,
    client: {
      name: 'ИП Смирнов',
      contact: 'Смирнов П.С.',
      phone: '+7 (495) 555-66-77',
      email: 'p.smirnov@ip.ru'
    },
    routeOptimization: {
      suggested: false,
      savings: 0,
      optimizedStops: 0
    },
    stops: [
      {
        id: 's-5',
        address: 'Москва, ул. Профсоюзная, д. 98',
        contact: 'Васильев П.С.',
        phone: '+7 (495) 555-66-77',
        type: 'delivery',
        status: 'completed',
        estimatedTime: '09:00',
        actualTime: '08:55',
        coordinates: { lat: 55.6452, lng: 37.5321 },
        packages: {
          count: 20,
          weight: 800,
          dimensions: '1.0x0.8x0.6м'
        },
        proof: {
          signature: true,
          photo: true
        }
      },
      {
        id: 's-6',
        address: 'Москва, ул. Обручева, д. 35',
        contact: 'Федорова А.М.',
        phone: '+7 (495) 666-77-88',
        type: 'delivery',
        status: 'completed',
        estimatedTime: '11:30',
        actualTime: '11:25',
        coordinates: { lat: 55.6324, lng: 37.5234 },
        packages: {
          count: 15,
          weight: 450,
          dimensions: '0.7x0.5x0.4м'
        },
        proof: {
          signature: true,
          photo: false
        }
      },
      {
        id: 's-7',
        address: 'Москва, ул. Нахимовский проспект, д. 67',
        contact: 'Григорьев И.Л.',
        phone: '+7 (495) 777-88-99',
        type: 'delivery',
        status: 'arrived',
        estimatedTime: '13:15',
        coordinates: { lat: 55.6628, lng: 37.6053 },
        packages: {
          count: 25,
          weight: 950,
          dimensions: '1.5x1.0x0.8м'
        }
      }
    ]
  },
  {
    id: 'r-003',
    name: 'Маршрут №3 - Западный округ',
    vehicleId: 'v-005',
    driverId: 'd-003',
    status: 'planned',
    startTime: '2024-06-19T06:00:00',
    estimatedEnd: '2024-06-19T20:00:00',
    totalDistance: 320,
    completedDistance: 0,
    totalStops: 2,
    completedStops: 0,
    priority: 'high',
    revenue: 68000,
    expenses: 18500,
    client: {
      name: 'ООО "ПромСнаб"',
      contact: 'Белов К.Д.',
      phone: '+7 (495) 888-99-00',
      email: 'k.belov@promsnab.ru'
    },
    routeOptimization: {
      suggested: true,
      savings: 25,
      optimizedStops: 2
    },
    stops: [
      {
        id: 's-8',
        address: 'Москва, ул. Кутузовский проспект, д. 32',
        contact: 'Смирнов В.А.',
        phone: '+7 (495) 888-99-00',
        type: 'pickup',
        status: 'pending',
        estimatedTime: '07:30',
        coordinates: { lat: 55.7397, lng: 37.5328 },
        packages: {
          count: 40,
          weight: 1200,
          dimensions: '2.0x1.5x1.0м'
        }
      },
      {
        id: 's-9',
        address: 'Московская обл., Одинцово, ул. Советская, д. 15',
        contact: 'Белов К.Д.',
        phone: '+7 (498) 123-45-67',
        type: 'delivery',
        status: 'pending',
        estimatedTime: '10:45',
        coordinates: { lat: 55.6789, lng: 37.2634 },
        packages: {
          count: 40,
          weight: 1200,
          dimensions: '2.0x1.5x1.0м'
        }
      }
    ]
  }
];

// Константы с расширенной палитрой
const COLORS = {
  primary: 'from-gray-900 via-black to-gray-800',
  secondary: 'from-blue-900 via-black to-cyan-900',
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
const formatDistance = (value: number) => `${formatNumber(value)} км`;
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
        className="absolute rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10"
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
      {/* Улучшенный glow effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(${glowColor},0.15), transparent 50%)`
        }}
      />
      
      <div className="relative z-10 h-full">
        {children}
      </div>

      {/* Улучшенный shine effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:animate-shine" />
      </div>

      {/* Анимированный border */}
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

// Улучшенный StatusBadge с более плавными анимациями
const StatusBadge = ({ status, type = 'default', size = 'default', pulse = false }: { 
  status: string; 
  type?: 'default' | 'vehicle' | 'driver' | 'route' | 'priority' | 'license';
  size?: 'default' | 'small' | 'large';
  pulse?: boolean;
}) => {
  const getStatusConfig = () => {
    const configs = {
      active: { color: COLORS.success, label: 'Активен', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '🟢' },
      maintenance: { color: COLORS.warning, label: 'Обслуживание', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '🟡' },
      on_route: { color: COLORS.blue, label: 'В пути', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '🔵' },
      inactive: { color: COLORS.error, label: 'Неактивен', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '🔴' },
      on_delivery: { color: COLORS.blue, label: 'На доставке', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '🚚' },
      break: { color: COLORS.orange, label: 'Перерыв', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '☕' },
      off: { color: COLORS.gray, label: 'Не на смене', bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: '⚪' },
      vacation: { color: COLORS.purple, label: 'Отпуск', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: '🏖️' },
      in_progress: { color: COLORS.blue, label: 'В процессе', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '🔄' },
      planned: { color: COLORS.purple, label: 'Запланирован', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: '📅' },
      completed: { color: COLORS.success, label: 'Завершен', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '✅' },
      delayed: { color: COLORS.rose, label: 'Задержан', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: '⏱️' },
      cancelled: { color: COLORS.error, label: 'Отменен', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '❌' },
      truck: { color: COLORS.orange, label: 'Грузовик', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '🚛' },
      van: { color: COLORS.blue, label: 'Фургон', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '🚐' },
      refrigerator: { color: COLORS.cyan, label: 'Рефрижератор', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: '🚚❄️' },
      container: { color: COLORS.emerald, label: 'Контейнеровоз', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: '🚚📦' },
      courier: { color: COLORS.purple, label: 'Курьерский', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: '🚗' },
      low: { color: COLORS.success, label: 'Низкий', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '📉' },
      medium: { color: COLORS.warning, label: 'Средний', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '📊' },
      high: { color: COLORS.rose, label: 'Высокий', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: '📈' },
      critical: { color: COLORS.error, label: 'Критический', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '🚨' },
      expired: { color: COLORS.error, label: 'Просрочен', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '⏰' },
      suspended: { color: COLORS.warning, label: 'Приостановлен', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '⏸️' },
      'A+': { color: COLORS.success, label: 'Класс А+', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '⭐' },
      'A': { color: COLORS.emerald, label: 'Класс А', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: '⭐' },
      'B': { color: COLORS.warning, label: 'Класс В', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '⭐' },
      'C': { color: COLORS.orange, label: 'Класс С', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '⭐' }
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
        {/* Полоска свечения */}
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
const StatCard = ({ title, value, change, icon, color = COLORS.blue, size = 'default', trend, subtitle }: {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color?: string;
  size?: 'default' | 'compact' | 'large';
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
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
  format?: 'number' | 'currency' | 'distance';
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
        : format === 'distance'
        ? `${formatNumber(Math.floor(displayValue))} км`
        : formatNumber(Math.floor(displayValue))
      }
    </span>
  );
};

// Улучшенный SearchAndFilter с анимациями
const SearchAndFilter = ({ onSearch, onFilter, placeholder = "Поиск..." }: {
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
  placeholder?: string;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
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
            <option value="maintenance">На обслуживании</option>
            <option value="on_route">В пути</option>
          </select>
          
          <select 
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-white/20 transition-all duration-200 flex-1 min-w-[120px]"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">Все типы</option>
            <option value="truck">Грузовики</option>
            <option value="van">Фургоны</option>
            <option value="courier">Курьерские</option>
          </select>

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
                <label className="text-white/60 text-sm mb-2 block">Грузоподъемность</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любая</option>
                  <option>До 5 тонн</option>
                  <option>5-15 тонн</option>
                  <option>Более 15 тонн</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Эффективность</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любая</option>
                  <option>Высокая (&gt;90%)</option>
                  <option>Средняя (70-90%)</option>
                  <option>Низкая (&lt;70%)</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Год выпуска</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любой</option>
                  <option>2020-2024</option>
                  <option>2015-2019</option>
                  <option>До 2015</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Тип топлива</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любой</option>
                  <option>Дизель</option>
                  <option>Бензин</option>
                  <option>Электричество</option>
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
    { id: 1, type: 'warning', message: 'Требуется ТО для Volvo FH16', time: '5 мин назад' },
    { id: 2, type: 'info', message: 'Новый маршрут запланирован на завтра', time: '1 час назад' },
    { id: 3, type: 'success', message: 'Маршрут №1 выполнен досрочно', time: '2 часа назад' }
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

// Улучшенный LicenseCard
const LicenseCard = ({ license, index }: { license: LogisticsCompany['licenses'][0]; index: number }) => {
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

// Адаптивные карточки
const VehicleCard = ({ vehicle, onClick, delay = 0 }: { vehicle: Vehicle; onClick: () => void; delay?: number }) => {
  const utilization = (vehicle.currentLoad / vehicle.capacity) * 100;
  const driver = drivers.find(d => d.id === vehicle.driver);
  
  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'truck': return '🚛';
      case 'van': return '🚐';
      case 'refrigerator': return '🚚❄️';
      case 'container': return '🚚📦';
      case 'courier': return '🚗';
      default: return '🚗';
    }
  };

  const getVehicleColor = (type: string) => {
    switch (type) {
      case 'truck': return COLORS.orange;
      case 'van': return COLORS.blue;
      case 'refrigerator': return COLORS.cyan;
      case 'container': return COLORS.emerald;
      case 'courier': return COLORS.purple;
      default: return COLORS.gray;
    }
  };

  const isMaintenanceDue = new Date(vehicle.nextMaintenance) < new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  return (
    <BentoCard 
      className="p-3 sm:p-4" 
      glowColor={getVehicleColor(vehicle.type)}
      onClick={onClick}
      variant="compact"
      delay={delay}
      hoverScale={1.03}
      magnetic
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
          <span className="text-lg">{getVehicleIcon(vehicle.type)}</span>
          <div className="min-w-0">
            <h4 className="text-white font-semibold text-sm truncate">{vehicle.model}</h4>
            <p className="text-white/60 text-xs">{vehicle.licensePlate}</p>
          </div>
        </div>
        <StatusBadge status={vehicle.status} type="vehicle" size="small" />
      </div>
      
      <div className="space-y-1.5 text-xs text-white/60 mb-3">
        <div className="flex justify-between">
          <span>Водитель:</span>
          <span className="text-white/80 truncate ml-2 max-w-[100px] sm:max-w-[120px]">{driver ? driver.name : 'Не назначен'}</span>
        </div>
        <div className="flex justify-between">
          <span>Загрузка:</span>
          <span className="text-white/80">{formatNumber(vehicle.currentLoad)}/{formatNumber(vehicle.capacity)} кг</span>
        </div>
        <div className="flex justify-between">
          <span>Топливо:</span>
          <span className="text-white/80">{vehicle.currentFuel}%</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Эффективность:</span>
          <div className="flex items-center gap-2">
            <ProgressBar 
              value={vehicle.statistics.efficiency} 
              max={100}
              color={getVehicleColor(vehicle.type)}
              size="small"
            />
            <span className="text-white/80 text-xs w-8">{vehicle.statistics.efficiency}%</span>
          </div>
        </div>
      </div>
      
      <ProgressBar 
        value={utilization} 
        label="Использование грузоподъемности"
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
          Отчет
        </motion.button>
      </div>

      {isMaintenanceDue && vehicle.status === 'active' && (
        <div className="mt-3 p-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-300 text-xs text-center">Требуется ТО</p>
        </div>
      )}
    </BentoCard>
  );
};

const DriverCard = ({ driver, onClick, delay = 0 }: { driver: Driver; onClick: () => void; delay?: number }) => {
  const vehicle = vehicles.find(v => v.id === driver.currentVehicle);
  
  const getDriverColor = (status: string) => {
    switch (status) {
      case 'on_delivery': return COLORS.blue;
      case 'active': return COLORS.success;
      case 'break': return COLORS.orange;
      case 'off': return COLORS.gray;
      case 'vacation': return COLORS.purple;
      default: return COLORS.gray;
    }
  };

  return (
    <BentoCard 
      className="p-3 sm:p-4" 
      glowColor={getDriverColor(driver.status)}
      onClick={onClick}
      variant="compact"
      delay={delay}
      hoverScale={1.03}
      magnetic
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-2">
          <h4 className="text-white font-semibold text-sm truncate">{driver.name}</h4>
          <p className="text-white/60 text-xs">{driver.phone}</p>
        </div>
        <StatusBadge status={driver.status} type="driver" size="small" />
      </div>
      
      <div className="space-y-1.5 text-xs text-white/60 mb-3">
        <div className="flex justify-between">
          <span>Опыт:</span>
          <span className="text-white/80">{driver.experience} лет</span>
        </div>
        
        <div className="flex justify-between">
          <span>Рейтинг:</span>
          <span className="text-white/80 flex items-center gap-1">
            ⭐ {driver.rating}/5.0
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Транспорт:</span>
          <span className="text-white/80 truncate ml-2 text-right">
            {vehicle ? `${vehicle.model}` : 'Не назначен'}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Доставок сегодня:</span>
          <span className="text-white/80">{driver.deliveriesToday}</span>
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
          Назначить
        </motion.button>
      </div>
    </BentoCard>
  );
};

const RouteCard = ({ route, onClick, delay = 0 }: { route: DeliveryRoute; onClick: () => void; delay?: number }) => {
  const vehicle = vehicles.find(v => v.id === route.vehicleId);
  const driver = drivers.find(d => d.id === route.driverId);
  const progress = (route.completedDistance / route.totalDistance) * 100;
  const completedStops = route.stops.filter(stop => stop.status === 'completed').length;

  const getRouteColor = (status: string) => {
    switch (status) {
      case 'in_progress': return COLORS.blue;
      case 'planned': return COLORS.purple;
      case 'completed': return COLORS.success;
      case 'delayed': return COLORS.rose;
      case 'cancelled': return COLORS.error;
      default: return COLORS.gray;
    }
  };

  return (
    <BentoCard 
      className="p-3 sm:p-4" 
      glowColor={getRouteColor(route.status)}
      onClick={onClick}
      variant="compact"
      delay={delay}
      hoverScale={1.03}
      magnetic
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-2">
          <h4 className="text-white font-semibold text-sm truncate">{route.name}</h4>
          <p className="text-white/60 text-xs">
            {driver?.name} • {vehicle?.model}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={route.status} type="route" size="small" />
          <StatusBadge status={route.priority} type="priority" size="small" />
        </div>
      </div>
      
      <div className="space-y-1.5 text-xs text-white/60 mb-3">
        <div className="flex justify-between">
          <span>Остановки:</span>
          <span className="text-white/80">{completedStops}/{route.stops.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Расстояние:</span>
          <span className="text-white/80">{route.completedDistance}/{route.totalDistance} км</span>
        </div>
        <div className="flex justify-between">
          <span>Доход:</span>
          <span className="text-emerald-300">{formatCurrency(route.revenue)}</span>
        </div>
      </div>
      
      <ProgressBar 
        value={progress} 
        label={`Прогресс маршрута`}
        color={getRouteColor(route.status)}
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
          Детали
        </motion.button>
        <motion.button 
          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs py-1.5 px-2 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Трек
        </motion.button>
      </div>
    </BentoCard>
  );
};

// Модальные окна
const VehicleModal = ({ vehicle, isOpen, onClose }: {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!vehicle) return null;

  const driver = drivers.find(d => d.id === vehicle.driver);
  const currentRoutes = deliveryRoutes.filter(route => route.vehicleId === vehicle.id && route.status === 'in_progress');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${vehicle.model} (${vehicle.licensePlate})`} size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <StatusBadge status={vehicle.status} type="vehicle" />
            <StatusBadge status={vehicle.type} type="vehicle" />
            <span className="text-white/60 text-sm bg-white/5 px-2 sm:px-3 py-1 rounded-full">
              {vehicle.year} год
            </span>
            <span className="text-white/60 text-sm bg-blue-500/10 px-2 sm:px-3 py-1 rounded-full">
              {formatNumber(vehicle.mileage)} км
            </span>
          </div>
          <div className="text-white/60 text-sm">
            ID: {vehicle.id}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Основная информация</h3>
              <div className="space-y-2 text-xs sm:text-sm text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/60">Гос. номер:</span>
                  <span className="text-white font-medium">{vehicle.licensePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Грузоподъемность:</span>
                  <span className="text-white font-medium">{formatNumber(vehicle.capacity)} кг</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Текущая загрузка:</span>
                  <span className="text-white font-medium">{formatNumber(vehicle.currentLoad)} кг</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Тип топлива:</span>
                  <span className="text-white font-medium">
                    {vehicle.fuelType === 'diesel' && 'Дизель'}
                    {vehicle.fuelType === 'petrol' && 'Бензин'}
                    {vehicle.fuelType === 'electric' && 'Электричество'}
                    {vehicle.fuelType === 'hybrid' && 'Гибрид'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Расход:</span>
                  <span className="text-white font-medium">{vehicle.fuelEfficiency} {vehicle.fuelType === 'electric' ? 'кВт/100км' : 'л/100км'}</span>
                </div>
              </div>
            </div>

            {driver && (
              <div>
                <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Водитель</h3>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300">
                    {driver.avatar || '👨‍💼'}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{driver.name}</p>
                    <p className="text-white/60 text-xs">{driver.phone}</p>
                  </div>
                  <StatusBadge status={driver.status} type="driver" size="small" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Технические характеристики</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Двигатель:</span>
                  <span className="text-white font-medium">{vehicle.specifications.engine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Коробка передач:</span>
                  <span className="text-white font-medium">{vehicle.specifications.transmission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Габариты:</span>
                  <span className="text-white font-medium">{vehicle.specifications.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Снаряженная масса:</span>
                  <span className="text-white font-medium">{vehicle.specifications.weight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">VIN:</span>
                  <span className="text-white font-medium text-xs">{vehicle.specifications.vin}</span>
                </div>
              </div>
            </BentoCard>

            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Показатели эффективности</h4>
              <div className="space-y-3">
                <ProgressBar value={vehicle.statistics.efficiency} label="Общая эффективность" color={COLORS.blue} size="small" />
                <ProgressBar value={100 - vehicle.statistics.downtime} label="Доступность" color={COLORS.emerald} size="small" />
                <ProgressBar value={(vehicle.currentLoad / vehicle.capacity) * 100} label="Загрузка" color={COLORS.orange} size="small" />
              </div>
            </BentoCard>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{formatNumber(vehicle.mileage)}</div>
            <div className="text-white/60 text-xs">Пробег</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{vehicle.currentFuel}%</div>
            <div className="text-white/60 text-xs">Топливо</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{currentRoutes.length}</div>
            <div className="text-white/60 text-xs">Активные маршруты</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">
              {Math.round(vehicle.statistics.efficiency)}%
            </div>
            <div className="text-white/60 text-xs">Эффективность</div>
          </BentoCard>
        </div>

        {vehicle.maintenanceHistory.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">История обслуживания</h3>
            <div className="grid gap-2 sm:gap-3">
              {vehicle.maintenanceHistory.map((maintenance, index) => (
                <BentoCard key={index} variant="compact" className="p-3" magnetic>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm">{maintenance.type}</h4>
                      <p className="text-white/60 text-xs truncate">{maintenance.description}</p>
                      <p className="text-white/40 text-xs">{formatDate(maintenance.date)} • {maintenance.technician}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium text-sm">{formatCurrency(maintenance.cost)}</p>
                      <p className="text-white/40 text-xs">{maintenance.duration} ч</p>
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
            Редактировать данные
          </motion.button>
          <motion.button 
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            История ремонтов
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

const DriverModal = ({ driver, isOpen, onClose }: {
  driver: Driver | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!driver) return null;

  const vehicle = vehicles.find(v => v.id === driver.currentVehicle);
  const currentRoutes = deliveryRoutes.filter(route => route.driverId === driver.id && route.status === 'in_progress');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={driver.name} size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <StatusBadge status={driver.status} type="driver" />
            <span className="text-white/60 text-sm bg-white/5 px-2 sm:px-3 py-1 rounded-full">
              {driver.experience} лет опыта
            </span>
            <span className="text-white/60 text-sm bg-blue-500/10 px-2 sm:px-3 py-1 rounded-full flex items-center gap-1">
              ⭐ {driver.rating}/5.0
            </span>
          </div>
          <div className="text-white/60 text-sm">
            ID: {driver.id}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Контактная информация</h3>
              <div className="space-y-2 text-xs sm:text-sm text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/60">Телефон:</span>
                  <span className="text-white font-medium">{driver.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Email:</span>
                  <span className="text-white font-medium text-right break-all">{driver.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Адрес:</span>
                  <span className="text-white font-medium text-right">{driver.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Дата найма:</span>
                  <span className="text-white font-medium">{formatDate(driver.hiredDate)}</span>
                </div>
              </div>
            </div>

            {vehicle && (
              <div>
                <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Текущий транспорт</h3>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-300">
                    🚛
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{vehicle.model}</p>
                    <p className="text-white/60 text-xs">{vehicle.licensePlate}</p>
                  </div>
                  <StatusBadge status={vehicle.status} type="vehicle" size="small" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Водительское удостоверение</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Номер:</span>
                  <span className="text-white font-medium">{driver.license.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Категории:</span>
                  <span className="text-white font-medium">{driver.license.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Действует до:</span>
                  <span className="text-white font-medium">{formatDate(driver.license.expiry)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Статус:</span>
                  <StatusBadge status={driver.license.status} type="license" size="small" />
                </div>
              </div>
            </BentoCard>

            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Показатели эффективности</h4>
              <div className="space-y-3">
                <ProgressBar value={driver.performance.onTimeRate} label="Своевременность" color={COLORS.emerald} size="small" />
                <ProgressBar value={driver.performance.safetyScore} label="Безопасность" color={COLORS.blue} size="small" />
                <ProgressBar value={driver.performance.efficiency} label="Эффективность" color={COLORS.orange} size="small" />
                <ProgressBar value={driver.performance.customerRating * 20} label="Рейтинг клиентов" color={COLORS.purple} size="small" />
              </div>
            </BentoCard>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{driver.totalDeliveries}</div>
            <div className="text-white/60 text-xs">Всего доставок</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{driver.deliveriesToday}</div>
            <div className="text-white/60 text-xs">Сегодня</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{currentRoutes.length}</div>
            <div className="text-white/60 text-xs">Активные маршруты</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">
              {Math.round(driver.performance.onTimeRate)}%
            </div>
            <div className="text-white/60 text-xs">Вовремя</div>
          </BentoCard>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">График работы</h3>
          <BentoCard variant="compact" className="p-3 sm:p-4" magnetic>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-white/60 text-sm">Смена:</span>
                <span className="text-white font-medium capitalize">
                  {driver.schedule.shift === 'morning' && 'Утренняя'}
                  {driver.schedule.shift === 'evening' && 'Вечерняя'}
                  {driver.schedule.shift === 'night' && 'Ночная'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">Время:</span>
                <span className="text-white font-medium">{driver.schedule.startTime} - {driver.schedule.endTime}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white/60 text-sm">Дни:</span>
                {driver.schedule.days.map((day, index) => (
                  <span key={day} className="text-white font-medium bg-white/10 px-2 py-1 rounded text-xs">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </BentoCard>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/10">
          <motion.button 
            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Назначить маршрут
          </motion.button>
          <motion.button 
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Редактировать профиль
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

const RouteModal = ({ route, isOpen, onClose }: {
  route: DeliveryRoute | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!route) return null;

  const vehicle = vehicles.find(v => v.id === route.vehicleId);
  const driver = drivers.find(d => d.id === route.driverId);
  const progress = (route.completedDistance / route.totalDistance) * 100;
  const completedStops = route.stops.filter(stop => stop.status === 'completed').length;

  const getStopStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return COLORS.success;
      case 'arrived': return COLORS.blue;
      case 'pending': return COLORS.warning;
      case 'cancelled': return COLORS.error;
      case 'delayed': return COLORS.rose;
      default: return COLORS.gray;
    }
  };

  const getStopTypeIcon = (type: string) => {
    switch (type) {
      case 'pickup': return '📦↑';
      case 'delivery': return '📦↓';
      case 'return': return '↩️';
      case 'service': return '🔧';
      default: return '📍';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={route.name} size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={route.status} type="route" />
            <StatusBadge status={route.priority} type="priority" />
            <span className="text-white/60 text-sm bg-white/5 px-2 sm:px-3 py-1 rounded-full">
              {route.totalDistance} км
            </span>
            <span className="text-white/60 text-sm bg-blue-500/10 px-2 sm:px-3 py-1 rounded-full">
              {route.totalStops} остановок
            </span>
            {route.routeOptimization.suggested && (
              <span className="text-white/60 text-sm bg-emerald-500/10 px-2 sm:px-3 py-1 rounded-full">
                Оптимизирован (+{route.routeOptimization.savings}%)
              </span>
            )}
          </div>
          <div className="text-white/60 text-sm">
            ID: {route.id}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Информация о маршруте</h3>
              <div className="space-y-2 text-xs sm:text-sm text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/60">Водитель:</span>
                  <span className="text-white font-medium">{driver?.name || 'Не назначен'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Транспорт:</span>
                  <span className="text-white font-medium">{vehicle?.model || 'Не назначен'} ({vehicle?.licensePlate})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Клиент:</span>
                  <span className="text-white font-medium">{route.client.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Начало:</span>
                  <span className="text-white font-medium">{formatDateTime(route.startTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Завершение (план):</span>
                  <span className="text-white font-medium">{formatDateTime(route.estimatedEnd)}</span>
                </div>
                {route.actualEnd && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Завершение (факт):</span>
                    <span className="text-white font-medium">{formatDateTime(route.actualEnd)}</span>
                  </div>
                )}
              </div>
            </div>

            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Финансовые показатели</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Доход:</span>
                  <span className="text-emerald-300 font-medium">{formatCurrency(route.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Расходы:</span>
                  <span className="text-rose-300 font-medium">{formatCurrency(route.expenses)}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2">
                  <span className="text-white/60">Прибыль:</span>
                  <span className="text-white font-bold">{formatCurrency(route.revenue - route.expenses)}</span>
                </div>
                {route.routeOptimization.savings > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Экономия от оптимизации:</span>
                    <span className="text-emerald-300 font-medium">{route.routeOptimization.savings}%</span>
                  </div>
                )}
              </div>
            </BentoCard>
          </div>

          <div className="space-y-4">
            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Прогресс маршрута</h4>
              <div className="space-y-4">
                <ProgressBar 
                  value={progress} 
                  label={`Пройдено ${route.completedDistance} из ${route.totalDistance} км`}
                  color={COLORS.blue}
                  size="default"
                />
                <ProgressBar 
                  value={(completedStops / route.totalStops) * 100} 
                  label={`Выполнено ${completedStops} из ${route.totalStops} остановок`}
                  color={COLORS.emerald}
                  size="default"
                />
              </div>
            </BentoCard>

            <div className="grid grid-cols-2 gap-2">
              <BentoCard variant="compact" className="text-center" magnetic>
                <div className="text-lg sm:text-xl font-bold text-white mb-1">{route.completedStops}/{route.totalStops}</div>
                <div className="text-white/60 text-xs">Остановки</div>
              </BentoCard>
              <BentoCard variant="compact" className="text-center" magnetic>
                <div className="text-lg sm:text-xl font-bold text-white mb-1">{route.completedDistance}/{route.totalDistance}</div>
                <div className="text-white/60 text-xs">Километры</div>
              </BentoCard>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Остановки маршрута</h3>
          <div className="space-y-2">
            {route.stops.map((stop, index) => (
              <BentoCard key={stop.id} variant="compact" className="p-3 sm:p-4" magnetic>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        stop.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                        stop.status === 'arrived' ? 'bg-blue-500/20 text-blue-300' :
                        stop.status === 'cancelled' ? 'bg-red-500/20 text-red-300' :
                        stop.status === 'delayed' ? 'bg-rose-500/20 text-rose-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {index + 1}
                      </div>
                      {index < route.stops.length - 1 && (
                        <div className="w-0.5 h-6 bg-white/10 my-1"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{getStopTypeIcon(stop.type)}</span>
                        <h4 className="text-white font-medium text-sm truncate">{stop.address}</h4>
                      </div>
                      <p className="text-white/60 text-xs mb-1">
                        {stop.contact} • {stop.phone}
                      </p>
                      <p className="text-white/40 text-xs">
                        {stop.type === 'pickup' ? 'Забор груза' : 
                         stop.type === 'delivery' ? 'Доставка' : 
                         stop.type === 'return' ? 'Возврат' : 'Обслуживание'} • 
                        План: {stop.estimatedTime}
                        {stop.actualTime && ` • Факт: ${stop.actualTime}`}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-white/50">
                        <span>📦 {stop.packages.count} ед.</span>
                        <span>⚖️ {stop.packages.weight} кг</span>
                      </div>
                      {stop.packages.specialInstructions && (
                        <p className="text-white/50 text-xs mt-1">💡 {stop.packages.specialInstructions}</p>
                      )}
                      {stop.notes && (
                        <p className="text-white/50 text-xs mt-1">📝 {stop.notes}</p>
                      )}
                      {stop.proof && (
                        <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
                          {stop.proof.signature && <span>✍️ Подпись</span>}
                          {stop.proof.photo && <span>📷 Фото</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <StatusBadge status={stop.status} size="small" />
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
            Отслеживать в реальном времени
          </motion.button>
          <motion.button 
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Редактировать маршрут
          </motion.button>
          <motion.button 
            className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Скачать отчет
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

const CompanyModal = ({ isOpen, onClose }: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="О компании" size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Описание компании</h3>
              <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                ТрансЛогистик Групп - ведущая логистическая компания, предоставляющая полный спектр транспортных и логистических услуг. 
                Основана в 2015 году, компания специализируется на грузоперевозках, экспедировании и управлении цепочками поставок.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Миссия</h3>
              <p className="text-white/70 italic text-sm sm:text-base">
                "Обеспечение надежных и эффективных логистических решений для наших клиентов через внедрение инновационных технологий и поддержание высочайших стандартов качества обслуживания."
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Зоны покрытия</h3>
              <div className="grid gap-2">
                {logisticsData.coverage.regions.map((region, index) => (
                  <div key={index} className="flex justify-between text-sm bg-white/5 p-2 rounded-lg">
                    <span className="text-white/70">{region} федеральный округ</span>
                    <span className="text-green-300 text-xs">Активно</span>
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
                  <p className="text-white font-medium">{logisticsData.contacts.phone}</p>
                </div>
                <div>
                  <span className="text-white/60 block mb-1">Аварийная линия:</span>
                  <p className="text-white font-medium">{logisticsData.contacts.emergency}</p>
                </div>
                <div>
                  <span className="text-white/60 block mb-1">Email:</span>
                  <p className="text-white font-medium break-all">{logisticsData.contacts.email}</p>
                </div>
                <div>
                  <span className="text-white/60 block mb-1">Сайт:</span>
                  <p className="text-white font-medium">{logisticsData.contacts.website}</p>
                </div>
                {logisticsData.contacts.social && logisticsData.contacts.social.length > 0 && (
                  <div>
                    <span className="text-white/60 block mb-1">Социальные сети:</span>
                    <div className="flex flex-wrap gap-2">
                      {logisticsData.contacts.social.map((social, index) => (
                        <motion.a 
                          key={index} 
                          href={social.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:text-blue-200 text-xs bg-blue-500/10 px-2 py-1 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {social.icon} {social.platform}
                        </motion.a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </BentoCard>

            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Ключевые показатели</h4>
              <div className="space-y-3">
                <ProgressBar value={logisticsData.statistics.efficiency} label="Общая эффективность" color={COLORS.emerald} size="small" />
                <ProgressBar value={logisticsData.safety.compliance} label="Соответствие стандартам" color={COLORS.blue} size="small" />
                <ProgressBar value={logisticsData.statistics.onTimeRate} label="Своевременность доставок" color={COLORS.orange} size="small" />
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

// Основной компонент Dashboard
const LogisticsDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vehicles' | 'drivers' | 'routes' | 'analytics'>('overview');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<DeliveryRoute | null>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
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
    const activeVehicles = vehicles.filter(v => v.status === 'active' || v.status === 'on_route').length;
    const activeDrivers = drivers.filter(d => d.status === 'active' || d.status === 'on_delivery').length;
    const activeRoutes = deliveryRoutes.filter(r => r.status === 'in_progress').length;
    const totalRevenue = deliveryRoutes.reduce((sum, route) => sum + route.revenue, 0);
    const totalExpenses = vehicles.reduce((sum, vehicle) => sum + vehicle.costs.total, 0);
    const totalProfit = totalRevenue - totalExpenses;
    const totalDistance = vehicles.reduce((sum, vehicle) => sum + vehicle.statistics.monthlyDistance, 0);

    return {
      activeVehicles,
      activeDrivers,
      activeRoutes,
      totalRevenue,
      totalExpenses,
      totalProfit,
      totalDistance
    };
  }, []);

  // Фильтрация данных
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      const matchesSearch = vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status === 'all' || vehicle.status === filters.status;
      const matchesType = filters.type === 'all' || vehicle.type === filters.type;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, filters]);

  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver => {
      const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          driver.phone.includes(searchQuery);
      const matchesStatus = filters.status === 'all' || driver.status === filters.status;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, filters]);

  const filteredRoutes = useMemo(() => {
    return deliveryRoutes.filter(route => {
      const matchesSearch = route.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status === 'all' || route.status === filters.status;
      const matchesPriority = filters.priority === 'all' || route.priority === filters.priority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchQuery, filters]);

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: '📊', color: COLORS.blue },
    { id: 'vehicles' as const, label: 'Транспорт', icon: '🚛', color: COLORS.orange },
    { id: 'drivers' as const, label: 'Водители', icon: '👨‍💼', color: COLORS.emerald },
    { id: 'routes' as const, label: 'Маршруты', icon: '🛣️', color: COLORS.purple },
    { id: 'analytics' as const, label: 'Аналитика', icon: '📈', color: COLORS.rose }
  ];

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleDriverClick = (driver: Driver) => {
    setSelectedDriver(driver);
  };

  const handleRouteClick = (route: DeliveryRoute) => {
    setSelectedRoute(route);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Добавляем данные для графиков
  const weeklyData = [65, 59, 80, 81, 56, 55, 40];
  const efficiencyData = [85, 78, 92, 89, 76, 82, 88];

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
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mx-auto mb-4"
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
            Загрузка логистической системы...
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
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
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
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%);
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
        {/* Company Header с улучшенной анимацией */}
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
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg cursor-pointer animate-float animate-pulse-glow"
                    onClick={() => setIsCompanyModalOpen(true)}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    🚚
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <motion.h1 
                      className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 break-words gradient-text"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {logisticsData.name}
                    </motion.h1>
                    <motion.p 
                      className="text-white/60 text-xs sm:text-sm lg:text-base"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Регистрационный номер: {logisticsData.registrationNumber}
                    </motion.p>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">О компании</h3>
                    <p className="text-white/70 leading-relaxed text-xs sm:text-sm line-clamp-3">
                      ТрансЛогистик Групп - ведущая логистическая компания, предоставляющая полный спектр транспортных и логистических услуг. 
                      Основана в 2015 году, компания специализируется на грузоперевозках, экспедировании и управлении цепочками поставок.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 text-white/70">
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Логистический менеджер</p>
                      <p className="text-white font-medium text-sm">{logisticsData.logisticsManager}</p>
                    </div>
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Операционный менеджер</p>
                      <p className="text-white font-medium text-sm">{logisticsData.operationsManager}</p>
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Дата основания</p>
                      <p className="text-white font-medium text-sm">
                        {formatDate(logisticsData.foundationDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Юридический адрес</p>
                      <p className="text-white font-medium text-sm leading-relaxed">{logisticsData.address.legal}</p>
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
                      <span className="text-white font-medium text-right">{logisticsData.contacts.phone}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/50">Аварийная:</span>
                      <span className="text-white font-medium text-right">{logisticsData.contacts.emergency}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/50">Email:</span>
                      <span className="text-white font-medium text-right break-all">{logisticsData.contacts.email}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/50">Сайт:</span>
                      <span className="text-white font-medium text-right break-all">{logisticsData.contacts.website}</span>
                    </div>
                    {logisticsData.contacts.social && logisticsData.contacts.social.length > 0 && (
                      <div className="flex justify-between items-start">
                        <span className="text-white/50">Соцсети:</span>
                        <div className="flex gap-2">
                          {logisticsData.contacts.social.map((social, index) => (
                            <motion.a
                              key={index}
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/60 hover:text-white transition-colors text-lg"
                              whileHover={{ scale: 1.2, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {social.icon}
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </BentoCard>
                
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                  <motion.button 
                    className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
                    onClick={() => setIsCompanyModalOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Подробнее о компании
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
              title="Активный транспорт"
              value={`${stats.activeVehicles}/${vehicles.length}`}
              change={5}
              chartData={weeklyData}
              color={COLORS.blue}
            />
            <MetricCard
              title="На маршрутах"
              value={stats.activeRoutes}
              change={12}
              chartData={efficiencyData}
              color={COLORS.emerald}
            />
            <MetricCard
              title="Общая прибыль"
              value={<AnimatedCounter value={stats.totalProfit} format="currency" />}
              change={8}
              chartData={[65, 59, 80, 81, 56, 55, 40]}
              color={COLORS.purple}
            />
            <MetricCard
              title="Пройдено км"
              value={<AnimatedCounter value={stats.totalDistance} format="distance" />}
              change={3}
              chartData={[85, 78, 92, 89, 76, 82, 88]}
              color={COLORS.orange}
            />
            <MetricCard
              title="Эффективность"
              value={`${logisticsData.statistics.efficiency}%`}
              change={2}
              chartData={[75, 82, 78, 85, 80, 88, 92]}
              color={COLORS.cyan}
            />
          </div>
        </motion.section>

        {/* Улучшенные Tabs с анимацией активного состояния */}
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
        {(activeTab === 'vehicles' || activeTab === 'drivers' || activeTab === 'routes') && (
          <SearchAndFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            placeholder={`Поиск ${activeTab === 'vehicles' ? 'транспорта' : activeTab === 'drivers' ? 'водителей' : 'маршрутов'}...`}
          />
        )}

        {/* Tab Content с улучшенными анимациями */}
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
                {/* Quick Actions с улучшенными анимациями */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { icon: '🚛', title: 'Транспорт', description: `${vehicles.length} единиц`, color: COLORS.orange, action: () => setActiveTab('vehicles') },
                    { icon: '👨‍💼', title: 'Водители', description: `${drivers.length} сотрудников`, color: COLORS.emerald, action: () => setActiveTab('drivers') },
                    { icon: '🛣️', title: 'Маршруты', description: `${deliveryRoutes.length} активных`, color: COLORS.purple, action: () => setActiveTab('routes') },
                    { icon: '📈', title: 'Аналитика', description: 'Статистика и отчеты', color: COLORS.rose, action: () => setActiveTab('analytics') },
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

                {/* Licenses & Safety Stats */}
                <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Лицензии компании</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {logisticsData.licenses.slice(0, 4).map((license, index) => (
                        <LicenseCard key={license.number} license={license} index={index} />
                      ))}
                    </div>
                  </div>

                  <BentoCard className="p-4 sm:p-6" magnetic>
                    <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Показатели безопасности</h3>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        { metric: 'Соответствие стандартам', value: logisticsData.safety.compliance, target: 95, color: COLORS.success },
                        { metric: 'Безопасность вождения', value: logisticsData.safety.safetyScore, target: 90, color: COLORS.blue },
                        { metric: 'Исправность транспорта', value: (stats.activeVehicles / vehicles.length) * 100, target: 85, color: COLORS.orange },
                        { metric: 'Своевременность доставок', value: logisticsData.statistics.onTimeRate, target: 90, color: COLORS.emerald }
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
                            <span className="text-white font-medium">{item.value.toFixed(1)}%</span>
                          </div>
                          <ProgressBar 
                            value={item.value} 
                            color={item.value >= item.target ? COLORS.success : COLORS.warning}
                            size="small"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </BentoCard>
                </div>

                {/* Vehicles Preview */}
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Транспортные средства</h2>
                    <motion.button 
                      className="text-orange-300 hover:text-orange-200 text-xs sm:text-sm transition-colors"
                      onClick={() => setActiveTab('vehicles')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Весь транспорт →
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {vehicles.slice(0, 3).map((vehicle, index) => (
                      <VehicleCard 
                        key={vehicle.id} 
                        vehicle={vehicle} 
                        onClick={() => handleVehicleClick(vehicle)}
                        delay={index * 0.1}
                      />
                    ))}
                  </div>
                </div>

                {/* Drivers Preview */}
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Водители</h2>
                    <motion.button 
                      className="text-emerald-300 hover:text-emerald-200 text-xs sm:text-sm transition-colors"
                      onClick={() => setActiveTab('drivers')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Все водители →
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {drivers.slice(0, 3).map((driver, index) => (
                      <DriverCard 
                        key={driver.id} 
                        driver={driver} 
                        onClick={() => handleDriverClick(driver)}
                        delay={index * 0.1}
                      />
                    ))}
                  </div>
                </div>

                {/* Routes Preview */}
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Активные маршруты</h2>
                    <motion.button 
                      className="text-purple-300 hover:text-purple-200 text-xs sm:text-sm transition-colors"
                      onClick={() => setActiveTab('routes')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Все маршруты →
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    {deliveryRoutes.filter(route => route.status === 'in_progress').slice(0, 2).map((route, index) => (
                      <RouteCard 
                        key={route.id} 
                        route={route} 
                        onClick={() => handleRouteClick(route)}
                        delay={index * 0.1}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'vehicles' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Транспортные средства</h2>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">
                      {filteredVehicles.length} единиц, {stats.activeVehicles} активных
                    </p>
                  </div>
                  <motion.button 
                    className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-xs sm:text-sm whitespace-nowrap w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + Новый транспорт
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredVehicles.map((vehicle, index) => (
                    <VehicleCard 
                      key={vehicle.id} 
                      vehicle={vehicle} 
                      onClick={() => handleVehicleClick(vehicle)}
                      delay={index * 0.05}
                    />
                  ))}
                </div>
                {filteredVehicles.length === 0 && (
                  <BentoCard className="text-center py-8">
                    <div className="text-4xl mb-4">🚛</div>
                    <h3 className="text-white font-semibold text-lg mb-2">Транспортные средства не найдены</h3>
                    <p className="text-white/60">Попробуйте изменить параметры поиска или фильтры</p>
                  </BentoCard>
                )}
              </motion.div>
            )}

            {activeTab === 'drivers' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Водители</h2>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">
                      {filteredDrivers.length} сотрудников, {stats.activeDrivers} активных
                    </p>
                  </div>
                  <motion.button 
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-xs sm:text-sm whitespace-nowrap w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + Новый водитель
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredDrivers.map((driver, index) => (
                    <DriverCard 
                      key={driver.id} 
                      driver={driver} 
                      onClick={() => handleDriverClick(driver)}
                      delay={index * 0.05}
                    />
                  ))}
                </div>
                {filteredDrivers.length === 0 && (
                  <BentoCard className="text-center py-8">
                    <div className="text-4xl mb-4">👨‍💼</div>
                    <h3 className="text-white font-semibold text-lg mb-2">Водители не найдены</h3>
                    <p className="text-white/60">Попробуйте изменить параметры поиска или фильтры</p>
                  </BentoCard>
                )}
              </motion.div>
            )}

            {activeTab === 'routes' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Маршруты доставки</h2>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">
                      {filteredRoutes.length} маршрутов, {stats.activeRoutes} активных
                    </p>
                  </div>
                  <motion.button 
                    className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-xs sm:text-sm whitespace-nowrap w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + Новый маршрут
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {filteredRoutes.map((route, index) => (
                    <RouteCard 
                      key={route.id} 
                      route={route} 
                      onClick={() => handleRouteClick(route)}
                      delay={index * 0.05}
                    />
                  ))}
                </div>
                {filteredRoutes.length === 0 && (
                  <BentoCard className="text-center py-8">
                    <div className="text-4xl mb-4">🛣️</div>
                    <h3 className="text-white font-semibold text-lg mb-2">Маршруты не найдены</h3>
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
                    <h3 className="text-white font-semibold mb-4">Эффективность флота</h3>
                    <div className="text-3xl font-bold text-white mb-2">
                      {Math.round(vehicles.reduce((acc, v) => acc + v.statistics.efficiency, 0) / vehicles.length)}%
                    </div>
                    <p className="text-white/60 text-sm mb-4">средняя эффективность</p>
                    <div className="space-y-2 text-sm text-white/60">
                      <div className="flex justify-between">
                        <span>Общий пробег:</span>
                        <span className="text-white font-medium">{formatDistance(vehicles.reduce((acc, v) => acc + v.mileage, 0))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Расход топлива:</span>
                        <span className="text-white font-medium">{formatNumber(vehicles.reduce((acc, v) => acc + v.statistics.fuelConsumption, 0))} л/мес</span>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.emerald} magnetic>
                    <h3 className="text-white font-semibold mb-4">Финансовые показатели</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Выручка</span>
                        <span className="text-white font-medium">{formatCurrency(stats.totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Расходы</span>
                        <span className="text-white font-medium">{formatCurrency(stats.totalExpenses)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Прибыль</span>
                        <span className="text-emerald-300 font-medium">{formatCurrency(stats.totalProfit)}</span>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.orange} magnetic>
                    <h3 className="text-white font-semibold mb-4">KPI логистики</h3>
                    <div className="space-y-3">
                      {[
                        { metric: 'Своевременность доставок', value: logisticsData.statistics.onTimeRate, target: 95 },
                        { metric: 'Эффективность маршрутов', value: logisticsData.statistics.efficiency, target: 90 },
                        { metric: 'Загрузка транспорта', value: vehicles.reduce((acc, v) => acc + (v.currentLoad / v.capacity) * 100, 0) / vehicles.length, target: 85 },
                        { metric: 'Удовлетворенность клиентов', value: drivers.reduce((acc, d) => acc + d.performance.customerRating * 20, 0) / drivers.length, target: 90 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-white text-sm">{item.metric}</span>
                          <span className={`text-sm font-medium ${
                            item.value >= item.target ? 'text-green-300' : 'text-yellow-300'
                          }`}>
                            {item.value.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </BentoCard>
                </div>

                {/* Operational Analytics */}
                <BentoCard className="p-6" magnetic>
                  <h3 className="text-white font-semibold mb-4">Аналитика операций</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Оптимизация процессов</h4>
                      {[
                        { process: 'Автоматизация планирования', progress: 85, impact: 'high' },
                        { process: 'GPS мониторинг', progress: 95, impact: 'high' },
                        { process: 'Оптимизация маршрутов', progress: 70, impact: 'medium' },
                        { process: 'Обучение водителей', progress: 60, impact: 'medium' }
                      ].map((item, index) => (
                        <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/5">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white text-sm">{item.process}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              item.impact === 'high' ? 'bg-green-500/20 text-green-300' :
                              'bg-blue-500/20 text-blue-300'
                            }`}>
                              {item.impact === 'high' ? 'Высокий' : 'Средний'}
                            </span>
                          </div>
                          <ProgressBar value={item.progress} color={COLORS.blue} />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Планы развития</h4>
                      {[
                        'Внедрение электромобилей',
                        'Расширение зоны покрытия',
                        'Автоматизация отчетности',
                        'Система прогнозирования спроса',
                        'Оптимизация логистических цепочек'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                          <span className="text-white text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </BentoCard>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>

      {/* Модальные окна */}
      <VehicleModal
        vehicle={selectedVehicle}
        isOpen={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />
      
      <DriverModal
        driver={selectedDriver}
        isOpen={!!selectedDriver}
        onClose={() => setSelectedDriver(null)}
      />
      
      <RouteModal
        route={selectedRoute}
        isOpen={!!selectedRoute}
        onClose={() => setSelectedRoute(null)}
      />

      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />
    </div>
  );
};

export default LogisticsDashboard;