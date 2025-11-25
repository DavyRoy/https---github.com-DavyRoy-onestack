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
}

interface Warehouse {
  id: string;
  name: string;
  type: 'distribution' | 'storage' | 'cross-docking' | 'temperature-controlled';
  status: 'active' | 'maintenance' | 'expansion';
  classification: 'A+' | 'A' | 'B' | 'C';
  registrationNumber: string;
  taxId: string;
  foundationDate: string;
  warehouseManager: string;
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
    totalArea: number;
    usableArea: number;
    storageUnits: number;
    employees: number;
    clients: number;
    dailyShipments: number;
    monthlyThroughput: number;
    efficiency: number;
  };
  financial: {
    budget: number;
    revenue: number;
    expenses: number;
    profit: number;
    quarterly: { quarter: string; income: number; expenses: number }[];
  };
  inventory: {
    totalItems: number;
    totalValue: number;
    turnoverRate: number;
    accuracy: number;
    categories: { name: string; percentage: number; value: number }[];
  };
  equipment: {
    total: number;
    operational: number;
    underMaintenance: number;
    critical: number;
    lastAudit: string;
  };
  safety: {
    standards: string[];
    lastInspection: string;
    nextInspection: string;
    compliance: number;
    incidents: number;
  };
}

interface StorageZone {
  id: string;
  name: string;
  type: 'bulk' | 'rack' | 'shelving' | 'temperature' | 'hazardous' | 'cross-dock';
  manager: string;
  capacity: number;
  utilized: number;
  temperature?: string;
  humidity?: string;
  status: 'active' | 'full' | 'maintenance' | 'quarantine';
  securityLevel: 'standard' | 'high' | 'maximum';
  contactEmail: string;
  phone: string;
  location: string;
  established: string;
  performance: {
    efficiency: number;
    utilization: number;
    throughput: number;
  };
  equipment: {
    total: number;
    operational: number;
  };
  features: string[];
}

interface Equipment {
  id: string;
  name: string;
  type: 'forklift' | 'reach_truck' | 'pallet_jack' | 'conveyor' | 'wms' | 'asrs' | 'sortation';
  status: 'operational' | 'maintenance' | 'out_of_service';
  lastMaintenance: string;
  nextMaintenance: string;
  utilization: number;
  department: string;
  specifications: {
    capacity: string;
    power: string;
    dimensions: string;
    manufacturer: string;
    model: string;
    year: number;
  };
  maintenanceHistory: MaintenanceRecord[];
  statistics: {
    monthlyUsage: number;
    efficiency: number;
    downtime: number;
    energyConsumption: number;
  };
}

// Моки данных для склада
const warehouseData: Warehouse = {
  id: 'wh-001',
  name: 'Логистический центр "Восточный"',
  type: 'distribution',
  status: 'active',
  classification: 'A+',
  registrationNumber: '1187746009012',
  taxId: '7723456790',
  foundationDate: '2018-05-20',
  warehouseManager: 'Смирнов Алексей Викторович',
  operationsManager: 'Ковалева Ирина Дмитриевна',
  address: {
    legal: 'г. Москва, Восточный административный округ, промзона №5',
    actual: 'г. Москва, ш. Энтузиастов, д. 56, стр. 3',
    coordinates: { lat: 55.7586, lng: 37.7322 }
  },
  contacts: {
    phone: '+7 (495) 345-67-89',
    emergency: '+7 (495) 345-67-90',
    email: 'info@east-logistics.ru',
    website: 'www.east-logistics.ru',
    social: [
      { platform: 'VK', url: 'https://vk.com/east_logistics', icon: '👥' },
      { platform: 'Telegram', url: 'https://t.me/east_logistics_news', icon: '📢' },
      { platform: 'Instagram', url: 'https://instagram.com/east_logistics', icon: '📷' }
    ]
  },
  licenses: [
    {
      number: 'СК-77-01-045678',
      type: 'Складская деятельность',
      issueDate: '2023-02-15',
      expirationDate: '2026-02-14',
      status: 'active',
      issuer: 'Федеральная служба по надзору в сфере транспорта',
      scope: ['Хранение товаров', 'Складская логистика', 'Грузопереработка']
    },
    {
      number: 'ТМ-77-02-067890',
      type: 'Таможенный склад',
      issueDate: '2023-03-10',
      expirationDate: '2025-03-09',
      status: 'active',
      issuer: 'Федеральная таможенная служба',
      scope: ['Временное хранение', 'Таможенное оформление', 'Международные перевозки']
    },
    {
      number: 'ОХ-77-01-078901',
      type: 'Хранение опасных грузов',
      issueDate: '2022-12-05',
      expirationDate: '2024-12-04',
      status: 'active',
      issuer: 'Министерство промышленности и торговли',
      scope: ['Химические вещества', 'Легковоспламеняющиеся материалы', 'Специализированное хранение']
    },
    {
      number: 'ПБ-77-01-089012',
      type: 'Пожарная безопасность',
      issueDate: '2023-01-20',
      expirationDate: '2025-01-19',
      status: 'active',
      issuer: 'МЧС России',
      scope: ['Противопожарные системы', 'Эвакуационные пути', 'Сигнализация']
    }
  ],
  statistics: {
    totalArea: 28500,
    usableArea: 24500,
    storageUnits: 12450,
    employees: 67,
    clients: 89,
    dailyShipments: 450,
    monthlyThroughput: 12500,
    efficiency: 94.2
  },
  financial: {
    budget: 85000000,
    revenue: 78300000,
    expenses: 65400000,
    profit: 12900000,
    quarterly: [
      { quarter: 'Q1 2024', income: 18500000, expenses: 16200000 },
      { quarter: 'Q2 2024', income: 19400000, expenses: 17000000 },
      { quarter: 'Q3 2024', income: 19800000, expenses: 16500000 },
      { quarter: 'Q4 2024', income: 20600000, expenses: 15700000 }
    ]
  },
  inventory: {
    totalItems: 156800,
    totalValue: 245000000,
    turnoverRate: 6.8,
    accuracy: 99.2,
    categories: [
      { name: 'Электроника', percentage: 35, value: 85750000 },
      { name: 'Одежда', percentage: 25, value: 61250000 },
      { name: 'Продукты', percentage: 20, value: 49000000 },
      { name: 'Хозтовары', percentage: 15, value: 36750000 },
      { name: 'Опасные грузы', percentage: 5, value: 12250000 }
    ]
  },
  equipment: {
    total: 48,
    operational: 42,
    underMaintenance: 6,
    critical: 3,
    lastAudit: '2024-05-15'
  },
  safety: {
    standards: ['ISO 9001:2015', 'ISO 14001:2015', 'OHSAS 18001', 'ТР ТС 010/2011'],
    lastInspection: '2024-04-10',
    nextInspection: '2024-10-10',
    compliance: 96.5,
    incidents: 2
  }
};

const storageZones: StorageZone[] = [
  {
    id: 'zone-1',
    name: 'Зона паллетного хранения',
    type: 'rack',
    manager: 'Петров Дмитрий Сергеевич',
    capacity: 8500,
    utilized: 7820,
    status: 'active',
    securityLevel: 'standard',
    contactEmail: 'rack-zone@east-logistics.ru',
    phone: '+7 (495) 345-67-91',
    location: 'Сектор A, Уровни 1-3',
    established: '2018-06-15',
    performance: {
      efficiency: 92,
      utilization: 92,
      throughput: 88
    },
    equipment: {
      total: 12,
      operational: 11
    },
    features: ['Автоматические стеллажи', 'Система контроля доступа', 'Противопожарная система']
  },
  {
    id: 'zone-2',
    name: 'Мелкоячеистое хранение',
    type: 'shelving',
    manager: 'Иванова Мария Алексеевна',
    capacity: 4200,
    utilized: 3850,
    status: 'active',
    securityLevel: 'standard',
    contactEmail: 'shelving@east-logistics.ru',
    phone: '+7 (495) 345-67-92',
    location: 'Сектор B, Уровень 1',
    established: '2019-03-20',
    performance: {
      efficiency: 88,
      utilization: 92,
      throughput: 85
    },
    equipment: {
      total: 8,
      operational: 8
    },
    features: ['Мобильные стеллажи', 'Система подсветки', 'Эргономичные зоны']
  },
  {
    id: 'zone-3',
    name: 'Холодильная камера',
    type: 'temperature',
    manager: 'Сидоров Андрей Владимирович',
    capacity: 1800,
    utilized: 1650,
    temperature: '+2°C ÷ +8°C',
    humidity: '60-70%',
    status: 'active',
    securityLevel: 'high',
    contactEmail: 'cooling@east-logistics.ru',
    phone: '+7 (495) 345-67-93',
    location: 'Сектор C, Изолированный блок',
    established: '2020-01-10',
    performance: {
      efficiency: 95,
      utilization: 92,
      throughput: 90
    },
    equipment: {
      total: 6,
      operational: 6
    },
    features: ['Многоуровневый контроль температуры', 'Резервные генераторы', 'Автоматические двери']
  },
  {
    id: 'zone-4',
    name: 'Морозильная камера',
    type: 'temperature',
    manager: 'Кузнецова Елена Петровна',
    capacity: 1200,
    utilized: 1150,
    temperature: '-18°C ÷ -25°C',
    humidity: '50-60%',
    status: 'active',
    securityLevel: 'high',
    contactEmail: 'freezer@east-logistics.ru',
    phone: '+7 (495) 345-67-94',
    location: 'Сектор C, Изолированный блок',
    established: '2020-01-10',
    performance: {
      efficiency: 94,
      utilization: 96,
      throughput: 92
    },
    equipment: {
      total: 4,
      operational: 4
    },
    features: ['Глубокое замораживание', 'Система мониторинга', 'Аварийная сигнализация']
  },
  {
    id: 'zone-5',
    name: 'Зона навального хранения',
    type: 'bulk',
    manager: 'Николаев Виктор Иванович',
    capacity: 6800,
    utilized: 6800,
    status: 'full',
    securityLevel: 'standard',
    contactEmail: 'bulk@east-logistics.ru',
    phone: '+7 (495) 345-67-95',
    location: 'Сектор D, Открытая площадка',
    established: '2018-08-05',
    performance: {
      efficiency: 85,
      utilization: 100,
      throughput: 82
    },
    equipment: {
      total: 5,
      operational: 5
    },
    features: ['Козловые краны', 'Система укладки', 'Противопожарные гидранты']
  },
  {
    id: 'zone-6',
    name: 'Зона опасных грузов',
    type: 'hazardous',
    manager: 'Громов Сергей Михайлович',
    capacity: 800,
    utilized: 650,
    status: 'active',
    securityLevel: 'maximum',
    contactEmail: 'hazardous@east-logistics.ru',
    phone: '+7 (495) 345-67-96',
    location: 'Сектор E, Изолированный блок',
    established: '2021-05-15',
    performance: {
      efficiency: 90,
      utilization: 81,
      throughput: 87
    },
    equipment: {
      total: 3,
      operational: 3
    },
    features: ['Взрывобезопасное исполнение', 'Система вентиляции', 'Датчики газоанализа']
  },
  {
    id: 'zone-7',
    name: 'Зона кросс-докинга',
    type: 'cross-dock',
    manager: 'Федорова Ольга Дмитриевна',
    capacity: 1500,
    utilized: 320,
    status: 'active',
    securityLevel: 'standard',
    contactEmail: 'crossdock@east-logistics.ru',
    phone: '+7 (495) 345-67-97',
    location: 'Сектор F, Уровень 1',
    established: '2022-02-28',
    performance: {
      efficiency: 96,
      utilization: 21,
      throughput: 94
    },
    equipment: {
      total: 7,
      operational: 7
    },
    features: ['Конвейерные линии', 'Система сортировки', 'Автоматические ворота']
  },
  {
    id: 'zone-8',
    name: 'Зона комплектации',
    type: 'shelving',
    manager: 'Васильев Алексей Николаевич',
    capacity: 2000,
    utilized: 1850,
    status: 'maintenance',
    securityLevel: 'standard',
    contactEmail: 'picking@east-logistics.ru',
    phone: '+7 (495) 345-67-98',
    location: 'Сектор G, Уровень 2',
    established: '2019-11-12',
    performance: {
      efficiency: 89,
      utilization: 93,
      throughput: 86
    },
    equipment: {
      total: 6,
      operational: 4
    },
    features: ['Система световой индикации', 'Эргономичные рабочие места', 'Система голосовой комплектации']
  }
];

const equipment: Equipment[] = [
  {
    id: 'eq-1',
    name: 'Вилочный погрузчик Toyota',
    type: 'forklift',
    status: 'operational',
    lastMaintenance: '2024-05-10',
    nextMaintenance: '2024-07-10',
    utilization: 85,
    department: 'zone-1',
    specifications: {
      capacity: '2.5 тонны',
      power: 'Дизельный',
      dimensions: '2.3x1.2x2.1м',
      manufacturer: 'Toyota',
      model: '8FGU25',
      year: 2022
    },
    maintenanceHistory: [
      {
        date: '2024-02-15',
        type: 'Плановое ТО',
        cost: 15000,
        technician: 'Иванов П.С.',
        duration: 4,
        parts: ['Масло двигательное', 'Фильтр воздушный', 'Свечи зажигания']
      },
      {
        date: '2023-11-20',
        type: 'Замена гидравлики',
        cost: 45000,
        technician: 'Петров А.В.',
        duration: 8,
        parts: ['Гидроцилиндр', 'Уплотнительные кольца', 'Гидравлическая жидкость']
      }
    ],
    statistics: {
      monthlyUsage: 168,
      efficiency: 92,
      downtime: 2.3,
      energyConsumption: 45
    }
  },
  {
    id: 'eq-2',
    name: 'Штабелер Crown',
    type: 'reach_truck',
    status: 'operational',
    lastMaintenance: '2024-05-15',
    nextMaintenance: '2024-07-15',
    utilization: 92,
    department: 'zone-2',
    specifications: {
      capacity: '1.6 тонны',
      power: 'Электрический',
      dimensions: '2.1x1.1x2.4м',
      manufacturer: 'Crown',
      model: 'RR 5200',
      year: 2023
    },
    maintenanceHistory: [
      {
        date: '2024-03-01',
        type: 'Плановое ТО',
        cost: 12000,
        technician: 'Сидоров М.П.',
        duration: 3,
        parts: ['Аккумуляторная батарея', 'Щетки электродвигателя']
      }
    ],
    statistics: {
      monthlyUsage: 192,
      efficiency: 94,
      downtime: 1.2,
      energyConsumption: 28
    }
  },
  {
    id: 'eq-3',
    name: 'Гидравлическая тележка',
    type: 'pallet_jack',
    status: 'maintenance',
    lastMaintenance: '2024-04-20',
    nextMaintenance: '2024-06-20',
    utilization: 78,
    department: 'zone-7',
    specifications: {
      capacity: '2.0 тонны',
      power: 'Ручная',
      dimensions: '1.5x0.8x1.2м',
      manufacturer: 'Jungheinrich',
      model: 'AM 2020',
      year: 2021
    },
    maintenanceHistory: [
      {
        date: '2024-01-10',
        type: 'Ремонт гидроцилиндра',
        cost: 8000,
        technician: 'Козлов Д.И.',
        duration: 2,
        parts: ['Уплотнительные манжеты', 'Гидравлическое масло']
      }
    ],
    statistics: {
      monthlyUsage: 145,
      efficiency: 88,
      downtime: 5.7,
      energyConsumption: 0
    }
  },
  {
    id: 'eq-4',
    name: 'Конвейерная линия',
    type: 'conveyor',
    status: 'operational',
    lastMaintenance: '2024-05-05',
    nextMaintenance: '2024-08-05',
    utilization: 88,
    department: 'zone-7',
    specifications: {
      capacity: '1000 ед/час',
      power: 'Электрический',
      dimensions: '25x1.5x1.0м',
      manufacturer: 'Interroll',
      model: 'RollerCon 2400',
      year: 2020
    },
    maintenanceHistory: [
      {
        date: '2024-02-28',
        type: 'Замена роликов',
        cost: 35000,
        technician: 'Федоров С.М.',
        duration: 6,
        parts: ['Ролики конвейерные', 'Подшипники', 'Приводные ремни']
      }
    ],
    statistics: {
      monthlyUsage: 624,
      efficiency: 96,
      downtime: 0.8,
      energyConsumption: 120
    }
  },
  {
    id: 'eq-5',
    name: 'WMS система',
    type: 'wms',
    status: 'operational',
    lastMaintenance: '2024-04-28',
    nextMaintenance: '2024-10-28',
    utilization: 95,
    department: 'all',
    specifications: {
      capacity: 'Неограничено',
      power: 'Серверное',
      dimensions: 'Сетевое решение',
      manufacturer: 'SAP',
      model: 'EWM 9.5',
      year: 2023
    },
    maintenanceHistory: [
      {
        date: '2024-03-15',
        type: 'Обновление ПО',
        cost: 25000,
        technician: 'IT отдел',
        duration: 12,
        parts: ['Лицензии ПО', 'Обновления безопасности']
      }
    ],
    statistics: {
      monthlyUsage: 720,
      efficiency: 99,
      downtime: 0.1,
      energyConsumption: 8
    }
  },
  {
    id: 'eq-6',
    name: 'Автоматический штабелер',
    type: 'asrs',
    status: 'out_of_service',
    lastMaintenance: '2024-03-15',
    nextMaintenance: '2024-05-15',
    utilization: 65,
    department: 'zone-1',
    specifications: {
      capacity: '1.8 тонны',
      power: 'Электрический',
      dimensions: '2.8x1.4x3.2м',
      manufacturer: 'Dematic',
      model: 'Multishuttle',
      year: 2022
    },
    maintenanceHistory: [
      {
        date: '2024-01-25',
        type: 'Ремонт системы позиционирования',
        cost: 78000,
        technician: 'Специалисты Dematic',
        duration: 16,
        parts: ['Датчики позиционирования', 'Контроллер движения', 'Кабельная система']
      }
    ],
    statistics: {
      monthlyUsage: 112,
      efficiency: 82,
      downtime: 12.5,
      energyConsumption: 35
    }
  }
];

// Константы с расширенной палитрой
const COLORS = {
  primary: 'from-gray-900 via-black to-gray-800',
  secondary: 'from-orange-900 via-black to-amber-900',
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
const formatArea = (value: number) => `${formatNumber(value)} м²`;
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ru-RU');

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
        className="absolute rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10"
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
  glowColor = COLORS.orange, 
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
  type?: 'default' | 'zone' | 'equipment' | 'classification';
  size?: 'default' | 'small' | 'large';
  pulse?: boolean;
}) => {
  const getStatusConfig = () => {
    const configs = {
      active: { color: COLORS.success, label: 'Активен', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '🟢' },
      maintenance: { color: COLORS.warning, label: 'Обслуживание', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '🟡' },
      expansion: { color: COLORS.blue, label: 'Расширение', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '🔵' },
      full: { color: COLORS.rose, label: 'Заполнен', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: '🔴' },
      quarantine: { color: COLORS.amber, label: 'Карантин', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: '🟠' },
      operational: { color: COLORS.success, label: 'Рабочее', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '🟢' },
      out_of_service: { color: COLORS.error, label: 'Не работает', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '🔴' },
      distribution: { color: COLORS.blue, label: 'Дистрибуция', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '📦' },
      storage: { color: COLORS.emerald, label: 'Хранение', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: '🏪' },
      'cross-docking': { color: COLORS.orange, label: 'Кросс-докинг', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '🔄' },
      'temperature-controlled': { color: COLORS.cyan, label: 'Темп. контроль', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: '❄️' },
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
const MetricCard = ({ title, value, change, chartData, color = COLORS.orange }: {
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
const ProgressBar = ({ value, max = 100, color = COLORS.orange, label, size = 'default', animated = true }: { 
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
const StatCard = ({ title, value, change, icon, color = COLORS.orange, size = 'default', trend, subtitle }: {
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
  format?: 'number' | 'currency' | 'area';
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
        : format === 'area'
        ? `${formatNumber(Math.floor(displayValue))} м²`
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
    zone: 'all'
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
            <option value="full">Заполненные</option>
          </select>
          
          <select 
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-white/20 transition-all duration-200 flex-1 min-w-[120px]"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">Все типы</option>
            <option value="rack">Стеллажные</option>
            <option value="shelving">Полочные</option>
            <option value="temperature">Температурные</option>
            <option value="bulk">Навальные</option>
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
                <label className="text-white/60 text-sm mb-2 block">Емкость</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любая</option>
                  <option>Менее 1000 м²</option>
                  <option>1000-5000 м²</option>
                  <option>Более 5000 м²</option>
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
                <label className="text-white/60 text-sm mb-2 block">Дата создания</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любая</option>
                  <option>Последние 6 месяцев</option>
                  <option>Последний год</option>
                  <option>Более года</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Безопасность</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любой уровень</option>
                  <option>Стандартный</option>
                  <option>Высокий</option>
                  <option>Максимальный</option>
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
    { id: 1, type: 'warning', message: 'Зона комплектации требует обслуживания', time: '5 мин назад' },
    { id: 2, type: 'info', message: 'Запланирована инвентаризация на 25.06.2024', time: '1 час назад' },
    { id: 3, type: 'success', message: 'Автоматический штабелер восстановлен', time: '2 часа назад' }
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
const LicenseCard = ({ license, index }: { license: Warehouse['licenses'][0]; index: number }) => {
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
const ZoneCard = ({ zone, onClick, delay = 0 }: { zone: StorageZone; onClick: () => void; delay?: number }) => {
  const utilization = (zone.utilized / zone.capacity) * 100;
  
  const getZoneIcon = (type: string) => {
    switch (type) {
      case 'rack': return '📦';
      case 'shelving': return '🗄️';
      case 'temperature': return '❄️';
      case 'bulk': return '🏗️';
      case 'hazardous': return '⚠️';
      case 'cross-dock': return '🔄';
      default: return '📊';
    }
  };

  const getZoneColor = (type: string) => {
    switch (type) {
      case 'rack': return COLORS.blue;
      case 'shelving': return COLORS.purple;
      case 'temperature': return COLORS.cyan;
      case 'bulk': return COLORS.orange;
      case 'hazardous': return COLORS.rose;
      case 'cross-dock': return COLORS.emerald;
      default: return COLORS.gray;
    }
  };

  return (
    <BentoCard 
      className="p-3 sm:p-4" 
      glowColor={getZoneColor(zone.type)}
      onClick={onClick}
      variant="compact"
      delay={delay}
      hoverScale={1.03}
      magnetic
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
          <span className="text-lg">{getZoneIcon(zone.type)}</span>
          <div className="min-w-0">
            <h4 className="text-white font-semibold text-sm truncate">{zone.name}</h4>
            {zone.temperature && (
              <p className="text-white/60 text-xs">{zone.temperature}</p>
            )}
          </div>
        </div>
        <StatusBadge status={zone.status} type="zone" size="small" />
      </div>
      
      <div className="space-y-1.5 text-xs text-white/60 mb-3">
        <div className="flex justify-between">
          <span>Ответственный:</span>
          <span className="text-white/80 truncate ml-2 max-w-[100px] sm:max-w-[120px]">{zone.manager}</span>
        </div>
        <div className="flex justify-between">
          <span>Местоположение:</span>
          <span className="text-white/80 text-right">{zone.location}</span>
        </div>
        <div className="flex justify-between">
          <span>Загрузка:</span>
          <span className="text-white/80">{formatNumber(zone.utilized)}/{formatNumber(zone.capacity)} м²</span>
        </div>
      </div>
      
      <ProgressBar 
        value={utilization} 
        label="Использование площади"
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
    </BentoCard>
  );
};

const EquipmentCard = ({ equipment, onClick, delay = 0 }: { equipment: Equipment; onClick: () => void; delay?: number }) => {
  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case 'forklift': return '🚜';
      case 'reach_truck': return '🏗️';
      case 'pallet_jack': return '🔧';
      case 'conveyor': return '🔄';
      case 'wms': return '💻';
      case 'asrs': return '🤖';
      case 'sortation': return '📦';
      default: return '⚙️';
    }
  };

  const getEquipmentColor = (type: string) => {
    switch (type) {
      case 'forklift': return COLORS.orange;
      case 'reach_truck': return COLORS.blue;
      case 'pallet_jack': return COLORS.purple;
      case 'conveyor': return COLORS.cyan;
      case 'wms': return COLORS.emerald;
      case 'asrs': return COLORS.violet;
      case 'sortation': return COLORS.indigo;
      default: return COLORS.gray;
    }
  };

  const isMaintenanceDue = new Date(equipment.nextMaintenance) < new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const department = storageZones.find(zone => zone.id === equipment.department);

  return (
    <BentoCard 
      className="p-3 sm:p-4" 
      glowColor={getEquipmentColor(equipment.type)}
      onClick={onClick}
      variant="compact"
      delay={delay}
      hoverScale={1.03}
      magnetic
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
          <span className="text-lg">{getEquipmentIcon(equipment.type)}</span>
          <h4 className="text-white font-semibold text-sm truncate">{equipment.name}</h4>
        </div>
        <StatusBadge status={equipment.status} type="equipment" size="small" />
      </div>
      
      <div className="space-y-1.5 text-xs text-white/60 mb-3">
        <div className="flex justify-between">
          <span>Зона:</span>
          <span className="text-white/80 text-right">{department?.name}</span>
        </div>
        <div className="flex justify-between">
          <span>Использование:</span>
          <span className="text-white/80">{equipment.utilization}%</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Эффективность:</span>
          <div className="flex items-center gap-2">
            <ProgressBar 
              value={equipment.statistics.efficiency} 
              max={100}
              color={getEquipmentColor(equipment.type)}
              size="small"
            />
            <span className="text-white/80 text-xs w-8">{equipment.statistics.efficiency}%</span>
          </div>
        </div>
        
        <div className="flex justify-between">
          <span>Следующее ТО:</span>
          <span className={isMaintenanceDue ? 'text-yellow-300' : 'text-white/80'}>
            {formatDate(equipment.nextMaintenance)}
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
          История
        </motion.button>
        <motion.button 
          className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-xs py-1.5 px-2 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ТО
        </motion.button>
      </div>

      {isMaintenanceDue && equipment.status === 'operational' && (
        <div className="mt-3 p-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-300 text-xs text-center">Требуется ТО</p>
        </div>
      )}
    </BentoCard>
  );
};

// Модальные окна
const ZoneModal = ({ zone, isOpen, onClose }: {
  zone: StorageZone | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!zone) return null;

  const zoneEquipment = equipment.filter(eq => eq.department === zone.id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={zone.name} size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <StatusBadge status={zone.status} type="zone" />
            <span className="text-white/60 text-sm bg-white/5 px-2 sm:px-3 py-1 rounded-full">
              {zoneEquipment.length} единиц оборудования
            </span>
            <span className="text-white/60 text-sm bg-blue-500/10 px-2 sm:px-3 py-1 rounded-full">
              {formatNumber(zone.capacity)} м²
            </span>
          </div>
          <div className="text-white/60 text-sm">
            ID: {zone.id}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Информация о зоне</h3>
              <div className="space-y-2 text-xs sm:text-sm text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/60">Тип зоны:</span>
                  <span className="text-white font-medium">
                    {zone.type === 'rack' && 'Стеллажная'}
                    {zone.type === 'shelving' && 'Полочная'}
                    {zone.type === 'temperature' && 'Температурная'}
                    {zone.type === 'bulk' && 'Навальная'}
                    {zone.type === 'hazardous' && 'Опасных грузов'}
                    {zone.type === 'cross-dock' && 'Кросс-докинг'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Ответственный:</span>
                  <span className="text-white font-medium text-right">{zone.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Местоположение:</span>
                  <span className="text-white font-medium text-right">{zone.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Дата создания:</span>
                  <span className="text-white font-medium">{formatDate(zone.established)}</span>
                </div>
                {zone.temperature && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Температура:</span>
                    <span className="text-white font-medium">{zone.temperature}</span>
                  </div>
                )}
                {zone.humidity && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Влажность:</span>
                    <span className="text-white font-medium">{zone.humidity}</span>
                  </div>
                )}
              </div>
            </div>

            {zone.features && zone.features.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Особенности зоны</h3>
                <div className="flex flex-wrap gap-1.5">
                  {zone.features.map((feature, index) => (
                    <span key={index} className="text-white/60 text-xs bg-white/5 px-2 py-1 rounded-full">
                      {feature}
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
                  <span className="text-white font-medium">{zone.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Email:</span>
                  <span className="text-white font-medium text-right break-all">{zone.contactEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Уровень безопасности:</span>
                  <span className="text-white font-medium">
                    {zone.securityLevel === 'standard' && 'Стандартный'}
                    {zone.securityLevel === 'high' && 'Высокий'}
                    {zone.securityLevel === 'maximum' && 'Максимальный'}
                  </span>
                </div>
              </div>
            </BentoCard>

            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Показатели эффективности</h4>
              <div className="space-y-3">
                <ProgressBar value={zone.performance.efficiency} label="Эффективность" color={COLORS.blue} size="small" />
                <ProgressBar value={zone.performance.utilization} label="Использование" color={COLORS.emerald} size="small" />
                <ProgressBar value={zone.performance.throughput} label="Пропускная способность" color={COLORS.purple} size="small" />
              </div>
            </BentoCard>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{formatNumber(zone.capacity)}</div>
            <div className="text-white/60 text-xs">Общая площадь</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{formatNumber(zone.utilized)}</div>
            <div className="text-white/60 text-xs">Используется</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{zoneEquipment.length}</div>
            <div className="text-white/60 text-xs">Оборудование</div>
          </BentoCard>
          <BentoCard variant="compact" className="text-center" magnetic>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">
              {Math.round((zone.performance.efficiency + zone.performance.utilization + zone.performance.throughput) / 3)}%
            </div>
            <div className="text-white/60 text-xs">Общая эффективность</div>
          </BentoCard>
        </div>

        {zoneEquipment.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Оборудование зоны ({zoneEquipment.length})</h3>
            <div className="grid gap-2 sm:gap-3">
              {zoneEquipment.map(eq => (
                <BentoCard key={eq.id} variant="compact" className="p-3" magnetic>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm truncate">{eq.name}</h4>
                      <p className="text-white/60 text-xs truncate">{eq.utilization}% использования • {eq.statistics.efficiency}% эффективности</p>
                    </div>
                    <StatusBadge status={eq.status} type="equipment" size="small" />
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
            Редактировать зону
          </motion.button>
          <motion.button 
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Управление оборудованием
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

const EquipmentModal = ({ equipment, isOpen, onClose }: {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!equipment) return null;

  const department = storageZones.find(zone => zone.id === equipment.department);

  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case 'forklift': return '🚜';
      case 'reach_truck': return '🏗️';
      case 'pallet_jack': return '🔧';
      case 'conveyor': return '🔄';
      case 'wms': return '💻';
      case 'asrs': return '🤖';
      case 'sortation': return '📦';
      default: return '⚙️';
    }
  };

  const getEquipmentColor = (type: string) => {
    switch (type) {
      case 'forklift': return COLORS.orange;
      case 'reach_truck': return COLORS.blue;
      case 'pallet_jack': return COLORS.purple;
      case 'conveyor': return COLORS.cyan;
      case 'wms': return COLORS.emerald;
      case 'asrs': return COLORS.violet;
      case 'sortation': return COLORS.indigo;
      default: return COLORS.gray;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={equipment.name} size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getEquipmentIcon(equipment.type)}</span>
              <StatusBadge status={equipment.status} type="equipment" />
            </div>
            <span className="text-white/60 text-sm bg-white/5 px-2 sm:px-3 py-1 rounded-full">
              {equipment.type === 'forklift' && 'Погрузчик'}
              {equipment.type === 'reach_truck' && 'Штабелер'}
              {equipment.type === 'pallet_jack' && 'Гидравлическая тележка'}
              {equipment.type === 'conveyor' && 'Конвейер'}
              {equipment.type === 'wms' && 'WMS система'}
              {equipment.type === 'asrs' && 'Автоматический штабелер'}
              {equipment.type === 'sortation' && 'Система сортировки'}
            </span>
            <span className="text-white/60 text-sm bg-blue-500/10 px-2 sm:px-3 py-1 rounded-full">
              {equipment.utilization}% использования
            </span>
            {equipment.statistics.efficiency > 0 && (
              <span className="text-white/60 text-sm bg-green-500/10 px-2 sm:px-3 py-1 rounded-full flex items-center gap-1">
                ⭐ {equipment.statistics.efficiency}%
              </span>
            )}
          </div>
          <div className="text-white/60 text-sm">
            ID: {equipment.id}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Технические характеристики</h3>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/60">Производитель:</span>
                  <span className="text-white font-medium">{equipment.specifications.manufacturer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Грузоподъемность:</span>
                  <span className="text-white font-medium">{equipment.specifications.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Тип питания:</span>
                  <span className="text-white font-medium">{equipment.specifications.power}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Габариты:</span>
                  <span className="text-white font-medium">{equipment.specifications.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Модель:</span>
                  <span className="text-white font-medium">{equipment.specifications.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Год выпуска:</span>
                  <span className="text-white font-medium">{equipment.specifications.year}</span>
                </div>
              </div>
            </div>

            {equipment.maintenanceHistory && equipment.maintenanceHistory.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">История обслуживания</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {equipment.maintenanceHistory.map((maintenance, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white text-sm">{maintenance.type}</p>
                        <p className="text-white/50 text-xs">{formatDate(maintenance.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm">{formatCurrency(maintenance.cost)}</p>
                        <p className="text-white/50 text-xs">{maintenance.technician}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Детали оборудования</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Зона размещения:</span>
                  <span className="text-white font-medium text-right">{department?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Использование:</span>
                  <span className="text-white font-medium">{equipment.utilization}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Эффективность:</span>
                  <span className="text-white font-medium flex items-center gap-1">
                    ⭐ {equipment.statistics.efficiency}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Простой:</span>
                  <span className="text-white font-medium">{equipment.statistics.downtime}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Последнее ТО:</span>
                  <span className="text-white font-medium">{formatDate(equipment.lastMaintenance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Следующее ТО:</span>
                  <span className="text-white font-medium">{formatDate(equipment.nextMaintenance)}</span>
                </div>
              </div>
            </BentoCard>

            {equipment.statistics && (
              <BentoCard variant="compact" magnetic>
                <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Статистика работы</h4>
                <div className="space-y-3">
                  <ProgressBar value={equipment.utilization} label="Использование" color={COLORS.orange} size="small" />
                  <ProgressBar value={equipment.statistics.efficiency} label="Эффективность" color={COLORS.emerald} size="small" />
                  <ProgressBar value={100 - equipment.statistics.downtime} label="Доступность" color={COLORS.blue} size="small" />
                </div>
              </BentoCard>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/10">
          <motion.button 
            className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            История работы
          </motion.button>
          <motion.button 
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Настроить оборудование
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

const WarehouseModal = ({ isOpen, onClose }: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="О складе" size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Описание склада</h3>
              <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                Логистический центр "Восточный" - современный складской комплекс класса А+, предоставляющий полный спектр логистических услуг. 
                Основан в 2018 году, центр специализируется на дистрибуции товаров широкого потребления с применением передовых технологий.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Миссия</h3>
              <p className="text-white/70 italic text-sm sm:text-base">
                "Обеспечение эффективной и надежной логистики для наших клиентов через внедрение инновационных решений и поддержание высочайших стандартов качества."
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Стандарты и сертификаты</h3>
              <div className="grid gap-2">
                {warehouseData.safety.standards.map((standard, index) => (
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
                  <p className="text-white font-medium">{warehouseData.contacts.phone}</p>
                </div>
                <div>
                  <span className="text-white/60 block mb-1">Аварийная линия:</span>
                  <p className="text-white font-medium">{warehouseData.contacts.emergency}</p>
                </div>
                <div>
                  <span className="text-white/60 block mb-1">Email:</span>
                  <p className="text-white font-medium break-all">{warehouseData.contacts.email}</p>
                </div>
                <div>
                  <span className="text-white/60 block mb-1">Сайт:</span>
                  <p className="text-white font-medium">{warehouseData.contacts.website}</p>
                </div>
                {warehouseData.contacts.social && warehouseData.contacts.social.length > 0 && (
                  <div>
                    <span className="text-white/60 block mb-1">Социальные сети:</span>
                    <div className="flex flex-wrap gap-2">
                      {warehouseData.contacts.social.map((social, index) => (
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
                <ProgressBar value={warehouseData.statistics.efficiency} label="Общая эффективность" color={COLORS.emerald} size="small" />
                <ProgressBar value={warehouseData.safety.compliance} label="Соответствие стандартам" color={COLORS.blue} size="small" />
                <ProgressBar value={(warehouseData.equipment.operational / warehouseData.equipment.total) * 100} label="Исправность оборудования" color={COLORS.orange} size="small" />
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
export default function WarehouseOrganization() {
  const [activeTab, setActiveTab] = useState<'overview' | 'zones' | 'equipment' | 'inventory' | 'operations'>('overview');
  const [selectedZone, setSelectedZone] = useState<StorageZone | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Имитация загрузки данных
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const financialProgress = useMemo(() => {
    const { budget, revenue, expenses, profit } = warehouseData.financial;
    return {
      revenue: (revenue / budget) * 100,
      expenses: (expenses / budget) * 100,
      profitMargin: (profit / revenue) * 100
    };
  }, []);

  const totalUtilization = useMemo(() => {
    const totalCapacity = storageZones.reduce((sum, zone) => sum + zone.capacity, 0);
    const totalUtilized = storageZones.reduce((sum, zone) => sum + zone.utilized, 0);
    return (totalUtilized / totalCapacity) * 100;
  }, []);

  // Фильтрация данных
  const filteredZones = useMemo(() => {
    return storageZones.filter(zone => 
      zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredEquipment = useMemo(() => {
    return equipment.filter(eq =>
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: '📊', color: COLORS.rose },
    { id: 'zones' as const, label: 'Зоны хранения', icon: '🗂️', color: COLORS.blue },
    { id: 'equipment' as const, label: 'Оборудование', icon: '🚜', color: COLORS.orange },
    { id: 'inventory' as const, label: 'Инвентарь', icon: '📦', color: COLORS.emerald },
    { id: 'operations' as const, label: 'Операции', icon: '⚡', color: COLORS.amber }
  ];

  const handleZoneClick = (zone: StorageZone) => {
    setSelectedZone(zone);
    setIsZoneModalOpen(true);
  };

  const handleEquipmentClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsEquipmentModalOpen(true);
  };

  const closeZoneModal = () => {
    setIsZoneModalOpen(false);
    setSelectedZone(null);
  };

  const closeEquipmentModal = () => {
    setIsEquipmentModalOpen(false);
    setSelectedEquipment(null);
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
            className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full mx-auto mb-4"
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
            Загрузка данных склада...
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
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.3); }
          50% { box-shadow: 0 0 40px rgba(249, 115, 22, 0.6); }
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
          background: linear-gradient(135deg, #f97316 0%, #fb923c 50%, #f59e0b 100%);
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
        {/* Warehouse Header с улучшенной анимацией */}
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
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg cursor-pointer animate-float animate-pulse-glow"
                    onClick={() => setIsWarehouseModalOpen(true)}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    🏭
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <motion.h1 
                      className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 break-words gradient-text"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {warehouseData.name}
                    </motion.h1>
                    <motion.p 
                      className="text-white/60 text-xs sm:text-sm lg:text-base"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Регистрационный номер: {warehouseData.registrationNumber}
                    </motion.p>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">О складе</h3>
                    <p className="text-white/70 leading-relaxed text-xs sm:text-sm line-clamp-3">
                      Логистический центр "Восточный" - современный складской комплекс класса А+, предоставляющий полный спектр логистических услуг. 
                      Основан в 2018 году, центр специализируется на дистрибуции товаров широкого потребления с применением передовых технологий.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 text-white/70">
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Управляющий складом</p>
                      <p className="text-white font-medium text-sm">{warehouseData.warehouseManager}</p>
                    </div>
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Операционный менеджер</p>
                      <p className="text-white font-medium text-sm">{warehouseData.operationsManager}</p>
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Дата основания</p>
                      <p className="text-white font-medium text-sm">
                        {formatDate(warehouseData.foundationDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Юридический адрес</p>
                      <p className="text-white font-medium text-sm leading-relaxed">{warehouseData.address.legal}</p>
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
                      <span className="text-white font-medium text-right">{warehouseData.contacts.phone}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/50">Аварийная:</span>
                      <span className="text-white font-medium text-right">{warehouseData.contacts.emergency}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/50">Email:</span>
                      <span className="text-white font-medium text-right break-all">{warehouseData.contacts.email}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/50">Сайт:</span>
                      <span className="text-white font-medium text-right break-all">{warehouseData.contacts.website}</span>
                    </div>
                    {warehouseData.contacts.social && warehouseData.contacts.social.length > 0 && (
                      <div className="flex justify-between items-start">
                        <span className="text-white/50">Соцсети:</span>
                        <div className="flex gap-2">
                          {warehouseData.contacts.social.map((social, index) => (
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
                    className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
                    onClick={() => setIsWarehouseModalOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Подробнее о складе
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
              title="Общая площадь"
              value={formatArea(warehouseData.statistics.totalArea)}
              change={5}
              chartData={weeklyData}
              color={COLORS.blue}
            />
            <MetricCard
              title="Единиц хранения"
              value={formatNumber(warehouseData.statistics.storageUnits)}
              change={12}
              chartData={efficiencyData}
              color={COLORS.emerald}
            />
            <MetricCard
              title="Сотрудников"
              value={warehouseData.statistics.employees}
              change={3}
              chartData={[65, 59, 80, 81, 56, 55, 40]}
              color={COLORS.purple}
            />
            <MetricCard
              title="Оборудование"
              value={`${Math.round((warehouseData.equipment.operational / warehouseData.equipment.total) * 100)}%`}
              change={2}
              chartData={[85, 78, 92, 89, 76, 82, 88]}
              color={COLORS.orange}
            />
            <MetricCard
              title="Загрузка склада"
              value={`${totalUtilization.toFixed(0)}%`}
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
        {(activeTab === 'zones' || activeTab === 'equipment') && (
          <SearchAndFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            placeholder={`Поиск ${activeTab === 'zones' ? 'зон хранения' : 'оборудования'}...`}
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
                    { icon: '🗂️', title: 'Зоны хранения', description: `${storageZones.length} зон`, color: COLORS.blue, action: () => setActiveTab('zones') },
                    { icon: '🚜', title: 'Оборудование', description: `${equipment.length} единиц`, color: COLORS.orange, action: () => setActiveTab('equipment') },
                    { icon: '📦', title: 'Инвентарь', description: `${formatNumber(warehouseData.inventory.totalItems)} единиц`, color: COLORS.emerald, action: () => setActiveTab('inventory') },
                    { icon: '⚡', title: 'Операции', description: 'Управление процессами', color: COLORS.amber, action: () => setActiveTab('operations') },
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
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Складские лицензии</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {warehouseData.licenses.slice(0, 4).map((license, index) => (
                        <LicenseCard key={license.number} license={license} index={index} />
                      ))}
                    </div>
                  </div>

                  <BentoCard className="p-4 sm:p-6" magnetic>
                    <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Показатели безопасности</h3>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        { metric: 'Соответствие стандартам', value: warehouseData.safety.compliance, target: 95, color: COLORS.success },
                        { metric: 'Инциденты за год', value: 100 - (warehouseData.safety.incidents / 12 * 100), target: 90, color: COLORS.blue },
                        { metric: 'Исправность оборудования', value: (warehouseData.equipment.operational / warehouseData.equipment.total) * 100, target: 85, color: COLORS.orange },
                        { metric: 'Эффективность работы', value: warehouseData.statistics.efficiency, target: 90, color: COLORS.emerald }
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

                {/* Zones Preview */}
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Зоны хранения</h2>
                    <motion.button 
                      className="text-blue-300 hover:text-blue-200 text-xs sm:text-sm transition-colors"
                      onClick={() => setActiveTab('zones')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Все зоны →
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {storageZones.slice(0, 3).map((zone, index) => (
                      <ZoneCard 
                        key={zone.id} 
                        zone={zone} 
                        onClick={() => handleZoneClick(zone)}
                        delay={index * 0.1}
                      />
                    ))}
                  </div>
                </div>

                {/* Equipment Preview */}
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Ключевое оборудование</h2>
                    <motion.button 
                      className="text-orange-300 hover:text-orange-200 text-xs sm:text-sm transition-colors"
                      onClick={() => setActiveTab('equipment')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Все оборудование →
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {equipment.slice(0, 3).map((eq, index) => (
                      <EquipmentCard 
                        key={eq.id} 
                        equipment={eq} 
                        onClick={() => handleEquipmentClick(eq)}
                        delay={index * 0.1}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'zones' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Зоны хранения</h2>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">
                      {filteredZones.length} зон, {formatArea(filteredZones.reduce((acc, zone) => acc + zone.capacity, 0))} общая площадь
                    </p>
                  </div>
                  <motion.button 
                    className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-xs sm:text-sm whitespace-nowrap w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + Новая зона
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredZones.map((zone, index) => (
                    <ZoneCard 
                      key={zone.id} 
                      zone={zone} 
                      onClick={() => handleZoneClick(zone)}
                      delay={index * 0.05}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'equipment' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Складское оборудование</h2>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">
                      {filteredEquipment.length} единиц, {Math.round(filteredEquipment.reduce((acc, eq) => acc + eq.utilization, 0) / filteredEquipment.length)}% средняя загрузка
                    </p>
                  </div>
                  <motion.button 
                    className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-xs sm:text-sm whitespace-nowrap w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + Новое оборудование
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredEquipment.map((eq, index) => (
                    <EquipmentCard 
                      key={eq.id} 
                      equipment={eq} 
                      onClick={() => handleEquipmentClick(eq)}
                      delay={index * 0.05}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'inventory' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Inventory Overview */}
                <div className="grid lg:grid-cols-3 gap-6">
                  <BentoCard className="p-6" glowColor={COLORS.emerald} magnetic>
                    <h3 className="text-white font-semibold mb-4">Общий инвентарь</h3>
                    <div className="text-3xl font-bold text-white mb-2">
                      {formatNumber(warehouseData.inventory.totalItems)}
                    </div>
                    <p className="text-white/60 text-sm mb-4">единиц хранения</p>
                    <div className="space-y-2 text-sm text-white/60">
                      <div className="flex justify-between">
                        <span>Общая стоимость:</span>
                        <span className="text-white font-medium">{formatCurrency(warehouseData.inventory.totalValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Оборачиваемость:</span>
                        <span className="text-white font-medium">{warehouseData.inventory.turnoverRate} раз/год</span>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.blue} magnetic>
                    <h3 className="text-white font-semibold mb-4">Точность учета</h3>
                    <div className="text-3xl font-bold text-white mb-2">
                      {warehouseData.inventory.accuracy}%
                    </div>
                    <ProgressBar 
                      value={warehouseData.inventory.accuracy} 
                      color={COLORS.blue}
                    />
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-white/60">
                      <div>
                        <p>Расхождения</p>
                        <p className="text-white font-medium">24</p>
                      </div>
                      <div>
                        <p>Последняя проверка</p>
                        <p className="text-white font-medium">15.06.2024</p>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.orange} magnetic>
                    <h3 className="text-white font-semibold mb-4">Категории товаров</h3>
                    <div className="space-y-3">
                      {warehouseData.inventory.categories.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-white text-sm">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-white/10 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full"
                                style={{ 
                                  width: `${item.percentage}%`,
                                  backgroundColor: `rgb(${COLORS.orange})`
                                }}
                              />
                            </div>
                            <span className="text-white/60 text-xs w-8">{item.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </BentoCard>
                </div>

                {/* Inventory Alerts */}
                <BentoCard className="p-6" magnetic>
                  <h3 className="text-white font-semibold mb-4">Предупреждения по запасам</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-white font-medium text-sm">Низкий запас</h4>
                      {[
                        { product: 'Смартфон Model X', current: 45, min: 50, supplier: 'TechCorp' },
                        { product: 'Ноутбук Pro 15"', current: 23, min: 30, supplier: 'CompTech' },
                        { product: 'Наушники Elite', current: 67, min: 80, supplier: 'AudioPlus' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                          <div>
                            <p className="text-white text-sm">{item.product}</p>
                            <p className="text-white/50 text-xs">{item.supplier}</p>
                          </div>
                          <span className="text-yellow-300 text-sm">{item.current}/{item.min}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-white font-medium text-sm">Избыточный запас</h4>
                      {[
                        { product: 'Мышь беспроводная', current: 450, max: 300, turnover: 0.8 },
                        { product: 'Чехлы для iPhone', current: 1200, max: 800, turnover: 0.5 },
                        { product: 'Кабели USB-C', current: 890, max: 600, turnover: 0.6 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                          <div>
                            <p className="text-white text-sm">{item.product}</p>
                            <p className="text-white/50 text-xs">Оборачиваемость: {item.turnover}</p>
                          </div>
                          <span className="text-red-300 text-sm">{item.current}/{item.max}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </BentoCard>
              </motion.div>
            )}

            {activeTab === 'operations' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Operations Overview */}
                <div className="grid lg:grid-cols-3 gap-6">
                  <BentoCard className="p-6" glowColor={COLORS.blue} magnetic>
                    <h3 className="text-white font-semibold mb-4">Операционная эффективность</h3>
                    <div className="text-3xl font-bold text-white mb-2">94.2%</div>
                    <ProgressBar value={94.2} color={COLORS.blue} />
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-white/60">
                      <div>
                        <p>Заказов/день</p>
                        <p className="text-white font-medium">{warehouseData.statistics.dailyShipments}</p>
                      </div>
                      <div>
                        <p>Время обработки</p>
                        <p className="text-white font-medium">2.3 ч</p>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.emerald} magnetic>
                    <h3 className="text-white font-semibold mb-4">Финансовые показатели</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Выручка</span>
                        <span className="text-white font-medium">{formatCurrency(warehouseData.financial.revenue)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Расходы</span>
                        <span className="text-white font-medium">{formatCurrency(warehouseData.financial.expenses)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Прибыль</span>
                        <span className="text-emerald-300 font-medium">{formatCurrency(warehouseData.financial.profit)}</span>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.orange} magnetic>
                    <h3 className="text-white font-semibold mb-4">KPI склада</h3>
                    <div className="space-y-3">
                      {[
                        { metric: 'Точность отгрузок', value: 99.8, target: 99.5 },
                        { metric: 'Использование площади', value: totalUtilization, target: 85 },
                        { metric: 'Производительность', value: 92.5, target: 90 },
                        { metric: 'Сроки доставки', value: 96.3, target: 95 }
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
                      <h4 className="text-white font-medium text-sm">Процессы оптимизации</h4>
                      {[
                        { process: 'Автоматизация приемки', progress: 85, impact: 'high' },
                        { process: 'WMS интеграция', progress: 95, impact: 'high' },
                        { process: 'Оптимизация маршрутов', progress: 70, impact: 'medium' },
                        { process: 'Обучение персонала', progress: 60, impact: 'medium' }
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
                        'Внедрение RFID технологии',
                        'Расширение температурных зон',
                        'Автоматизация комплектации',
                        'Система прогнозирования спроса',
                        'Оптимизация зон хранения'
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
      <ZoneModal
        zone={selectedZone}
        isOpen={isZoneModalOpen}
        onClose={closeZoneModal}
      />
      
      <EquipmentModal
        equipment={selectedEquipment}
        isOpen={isEquipmentModalOpen}
        onClose={closeEquipmentModal}
      />

      <WarehouseModal
        isOpen={isWarehouseModalOpen}
        onClose={() => setIsWarehouseModalOpen(false)}
      />
    </div>
  );
}