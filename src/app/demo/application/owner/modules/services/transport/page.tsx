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

// Типы данных для транспортных услуг
interface TransportService {
  id: string;
  name: string;
  category: 'cargo' | 'passenger' | 'special' | 'logistics' | 'rental' | 'moving' | 'international';
  description: string;
  status: 'active' | 'development' | 'paused' | 'closed';
  serviceTypes: string[];
  deliveryTime: {
    min: number;
    max: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  price: {
    base: number;
    currency: 'RUB' | 'USD' | 'EUR';
    perKm?: number;
    perHour?: number;
    weightLimit: number;
    volumeLimit: string;
  };
  requirements: string[];
  coverage: {
    areas: string[];
    radius: number;
    international: boolean;
  };
  vehicles: string[];
  staffRequired: string[];
  metrics: {
    satisfaction: number;
    onTimeRate: number;
    successRate: number;
  };
  capacity: number;
  currentOrders: number;
}

interface TransportClient {
  id: string;
  name: string;
  type: 'individual' | 'business' | 'corporate';
  contact: {
    phone: string;
    email?: string;
    address: string;
  };
  preferences: {
    serviceTime: string[];
    contactMethod: 'phone' | 'email' | 'sms';
    notes?: string;
  };
  orderHistory: TransportOrder[];
  loyalty: {
    points: number;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    discount: number;
  };
  status: 'active' | 'inactive' | 'blocked';
  lastOrder?: string;
  totalOrders: number;
}

interface TransportOrder {
  id: string;
  clientId: string;
  serviceId: string;
  driverId?: string;
  vehicleId?: string;
  items: TransportItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'in_transit' | 'delivered' | 'cancelled' | 'returned';
  timeline: {
    created: string;
    confirmed?: string;
    preparing?: string;
    pickedUp?: string;
    inTransit?: string;
    delivered?: string;
  };
  route: {
    from: string;
    to: string;
    distance: number;
    estimatedTime: string;
    actualTime?: string;
  };
  payment: {
    amount: number;
    method: 'cash' | 'card' | 'online' | 'invoice';
    status: 'pending' | 'paid' | 'refunded';
  };
  notes?: string;
  rating?: number;
}

interface TransportItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  weight?: number;
  dimensions?: string;
  fragile: boolean;
  specialRequirements?: string[];
}

interface Driver {
  id: string;
  name: string;
  contact: {
    phone: string;
    email: string;
  };
  license: {
    type: string;
    number: string;
    expiry: string;
  };
  vehicle: {
    type: 'sedan' | 'suv' | 'minivan' | 'truck' | 'van' | 'bus';
    model: string;
    licensePlate: string;
  };
  status: 'active' | 'offline' | 'on_delivery' | 'break' | 'maintenance';
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
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
    completedOrders: number;
    onTimeRate: number;
    distanceCovered: number;
  };
  currentOrders: string[];
  maxOrders: number;
}

interface FleetVehicle {
  id: string;
  name: string;
  type: 'sedan' | 'suv' | 'minivan' | 'truck' | 'van' | 'bus' | 'special';
  manufacturer: string;
  model: string;
  year: number;
  status: 'operational' | 'maintenance' | 'out_of_service' | 'fueling' | 'cleaning';
  specifications: {
    maxWeight: number;
    maxVolume: string;
    fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
    fuelConsumption: number;
    range: number;
    seats?: number;
  };
  features: string[];
  lastMaintenance: string;
  nextMaintenance: string;
  location: string;
  utilization: number;
  currentDriver?: string;
}

// Моки данных для транспортных услуг
const transportServices: TransportService[] = [
  {
    id: 'ts-001',
    name: 'Грузоперевозки по городу',
    category: 'cargo',
    description: 'Надежные грузоперевозки по городу с профессиональными грузчиками',
    status: 'active',
    serviceTypes: ['Переезды', 'Доставка товаров', 'Перевозка мебели'],
    deliveryTime: {
      min: 2,
      max: 6,
      unit: 'hours'
    },
    price: {
      base: 1500,
      currency: 'RUB',
      perKm: 30,
      perHour: 500,
      weightLimit: 2000,
      volumeLimit: '20м³'
    },
    requirements: ['Минимальный заказ 1 час', 'Предоплата 30%'],
    coverage: {
      areas: ['Весь город', 'Пригород'],
      radius: 50,
      international: false
    },
    vehicles: ['Грузовой фургон', 'Газель', 'Бортовой грузовик'],
    staffRequired: ['Водитель', 'Грузчики'],
    metrics: {
      satisfaction: 92,
      onTimeRate: 90,
      successRate: 96
    },
    capacity: 25,
    currentOrders: 18
  },
  {
    id: 'ts-002',
    name: 'Пассажирские перевозки',
    category: 'passenger',
    description: 'Комфортабельные пассажирские перевозки для бизнеса и частных клиентов',
    status: 'active',
    serviceTypes: ['Трансферы', 'Корпоративные перевозки', 'Туристические маршруты'],
    deliveryTime: {
      min: 0,
      max: 0,
      unit: 'minutes'
    },
    price: {
      base: 500,
      currency: 'RUB',
      perKm: 25,
      perHour: 400,
      weightLimit: 0,
      volumeLimit: 'Не применимо'
    },
    requirements: ['Предварительный заказ', 'Подтверждение за 2 часа'],
    coverage: {
      areas: ['Москва', 'Московская область', 'Аэропорты'],
      radius: 100,
      international: false
    },
    vehicles: ['Бизнес-седан', 'Минивэн', 'Микроавтобус'],
    staffRequired: ['Водитель'],
    metrics: {
      satisfaction: 94,
      onTimeRate: 95,
      successRate: 98
    },
    capacity: 40,
    currentOrders: 32
  },
  {
    id: 'ts-003',
    name: 'Спецтехника в аренду',
    category: 'special',
    description: 'Аренда спецтехники с операторами для строительных и промышленных работ',
    status: 'active',
    serviceTypes: ['Строительная техника', 'Погрузчики', 'Краны'],
    deliveryTime: {
      min: 4,
      max: 24,
      unit: 'hours'
    },
    price: {
      base: 5000,
      currency: 'RUB',
      perHour: 1200,
      weightLimit: 10000,
      volumeLimit: 'Не применимо'
    },
    requirements: ['Залог', 'Договор аренды', 'Лицензия оператора'],
    coverage: {
      areas: ['Московский регион'],
      radius: 200,
      international: false
    },
    vehicles: ['Экскаватор', 'Бульдозер', 'Кран', 'Погрузчик'],
    staffRequired: ['Оператор техники', 'Механик'],
    metrics: {
      satisfaction: 88,
      onTimeRate: 85,
      successRate: 92
    },
    capacity: 15,
    currentOrders: 8
  },
  {
    id: 'ts-004',
    name: 'Логистические решения',
    category: 'logistics',
    description: 'Комплексные логистические решения для бизнеса с оптимизацией маршрутов',
    status: 'active',
    serviceTypes: ['Складская логистика', 'Дистрибуция', 'Цепочки поставок'],
    deliveryTime: {
      min: 1,
      max: 7,
      unit: 'days'
    },
    price: {
      base: 10000,
      currency: 'RUB',
      weightLimit: 5000,
      volumeLimit: '100м³'
    },
    requirements: ['Бизнес-договор', 'Минимальный объем'],
    coverage: {
      areas: ['Вся Россия'],
      radius: 0,
      international: true
    },
    vehicles: ['Фуры', 'Рефрижераторы', 'Контейнеровозы'],
    staffRequired: ['Логист', 'Диспетчер', 'Водитель-дальнобойщик'],
    metrics: {
      satisfaction: 90,
      onTimeRate: 87,
      successRate: 94
    },
    capacity: 50,
    currentOrders: 35
  },
  {
    id: 'ts-005',
    name: 'Аренда автомобилей',
    category: 'rental',
    description: 'Аренда автомобилей для личных и деловых поездок на любой срок',
    status: 'active',
    serviceTypes: ['Краткосрочная аренда', 'Долгосрочная аренда', 'Премиум класс'],
    deliveryTime: {
      min: 1,
      max: 3,
      unit: 'hours'
    },
    price: {
      base: 2000,
      currency: 'RUB',
      perHour: 300,
      weightLimit: 5,
      volumeLimit: 'Багажник'
    },
    requirements: ['Водительские права', 'Залог', 'Кредитная карта'],
    coverage: {
      areas: ['Москва', 'Аэропорты', 'Вокзалы'],
      radius: 30,
      international: false
    },
    vehicles: ['Эконом класс', 'Комфорт класс', 'Премиум класс'],
    staffRequired: ['Менеджер по аренде'],
    metrics: {
      satisfaction: 91,
      onTimeRate: 93,
      successRate: 97
    },
    capacity: 100,
    currentOrders: 67
  },
  {
    id: 'ts-006',
    name: 'Квартирные переезды',
    category: 'moving',
    description: 'Полный комплекс услуг для квартирных переездов под ключ',
    status: 'active',
    serviceTypes: ['Квартирные переезды', 'Офисные переезды', 'Упаковка вещей'],
    deliveryTime: {
      min: 3,
      max: 8,
      unit: 'hours'
    },
    price: {
      base: 3000,
      currency: 'RUB',
      perHour: 800,
      weightLimit: 3000,
      volumeLimit: '40м³'
    },
    requirements: ['Предоплата 20%', 'Список имущества'],
    coverage: {
      areas: ['Москва', 'Московская область'],
      radius: 80,
      international: false
    },
    vehicles: ['Грузовой фургон', 'Манипулятор'],
    staffRequired: ['Водитель', 'Грузчики', 'Упаковщик'],
    metrics: {
      satisfaction: 93,
      onTimeRate: 91,
      successRate: 95
    },
    capacity: 20,
    currentOrders: 14
  },
  {
    id: 'ts-007',
    name: 'Международные перевозки',
    category: 'international',
    description: 'Международные грузоперевозки с таможенным оформлением',
    status: 'development',
    serviceTypes: ['Международные перевозки', 'Таможенное оформление', 'Мультимодальные перевозки'],
    deliveryTime: {
      min: 5,
      max: 21,
      unit: 'days'
    },
    price: {
      base: 50000,
      currency: 'RUB',
      weightLimit: 25000,
      volumeLimit: '120м³'
    },
    requirements: ['Таможенные документы', 'Страховка', 'Сертификаты'],
    coverage: {
      areas: ['Европа', 'Азия', 'СНГ'],
      radius: 0,
      international: true
    },
    vehicles: ['Фуры', 'Контейнеровозы', 'Авиаперевозки'],
    staffRequired: ['Таможенный брокер', 'Логист', 'Водитель международник'],
    metrics: {
      satisfaction: 0,
      onTimeRate: 0,
      successRate: 0
    },
    capacity: 10,
    currentOrders: 0
  }
];

const transportClients: TransportClient[] = [
  {
    id: 'tcl-001',
    name: 'ООО "СтройГарант"',
    type: 'business',
    contact: {
      phone: '+7 (495) 123-45-67',
      email: 'logistics@stroigarant.ru',
      address: 'г. Москва, ул. Строителей, д. 15, оф. 304'
    },
    preferences: {
      serviceTime: ['09:00-18:00'],
      contactMethod: 'email',
      notes: 'Только безналичный расчет'
    },
    orderHistory: [],
    loyalty: {
      points: 4500,
      tier: 'platinum',
      discount: 15
    },
    status: 'active',
    totalOrders: 45
  },
  {
    id: 'tcl-002',
    name: 'Иванова Мария Сергеевна',
    type: 'individual',
    contact: {
      phone: '+7 (916) 234-56-78',
      email: 'm.ivanova@mail.ru',
      address: 'г. Москва, пр. Вернадского, д. 125, кв. 89'
    },
    preferences: {
      serviceTime: ['18:00-20:00', 'выходные'],
      contactMethod: 'phone',
      notes: 'Звонить за час до выезда'
    },
    orderHistory: [],
    loyalty: {
      points: 1200,
      tier: 'gold',
      discount: 10
    },
    status: 'active',
    totalOrders: 12
  },
  {
    id: 'tcl-003',
    name: 'ООО "Торговая Компания"',
    type: 'corporate',
    contact: {
      phone: '+7 (495) 345-67-89',
      email: 'delivery@tradecompany.ru',
      address: 'г. Москва, ул. Тверская, д. 25, оф. 1501'
    },
    preferences: {
      serviceTime: ['10:00-17:00'],
      contactMethod: 'email'
    },
    orderHistory: [],
    loyalty: {
      points: 8900,
      tier: 'platinum',
      discount: 20
    },
    status: 'active',
    totalOrders: 120
  }
];

const drivers: Driver[] = [
  {
    id: 'drv-001',
    name: 'Петров Алексей Владимирович',
    contact: {
      phone: '+7 (916) 111-22-33',
      email: 'a.petrov@transport.ru'
    },
    license: {
      type: 'C, E',
      number: '77 АБ 123456',
      expiry: '2026-05-15'
    },
    vehicle: {
      type: 'truck',
      model: 'Volvo FH16',
      licensePlate: 'A123BC777'
    },
    status: 'on_delivery',
    currentLocation: {
      lat: 55.7558,
      lng: 37.6173,
      address: 'МКАД, 45 км'
    },
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      hours: '08:00-20:00'
    },
    ratings: {
      average: 4.8,
      count: 89,
      lastMonth: 4.9
    },
    metrics: {
      completedOrders: 234,
      onTimeRate: 92,
      distanceCovered: 125000
    },
    currentOrders: ['tord-001'],
    maxOrders: 2
  },
  {
    id: 'drv-002',
    name: 'Сидорова Ольга Николаевна',
    contact: {
      phone: '+7 (925) 222-33-44',
      email: 'o.sidorova@transport.ru'
    },
    license: {
      type: 'B',
      number: '77 УК 654321',
      expiry: '2025-11-20'
    },
    vehicle: {
      type: 'minivan',
      model: 'Mercedes V-Class',
      licensePlate: 'B456DE777'
    },
    status: 'active',
    currentLocation: {
      lat: 55.7602,
      lng: 37.6185,
      address: 'Шереметьево, терминал D'
    },
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      hours: '07:00-22:00'
    },
    ratings: {
      average: 4.9,
      count: 156,
      lastMonth: 5.0
    },
    metrics: {
      completedOrders: 345,
      onTimeRate: 96,
      distanceCovered: 89000
    },
    currentOrders: ['tord-002'],
    maxOrders: 3
  }
];

const fleetVehicles: FleetVehicle[] = [
  {
    id: 'fvh-001',
    name: 'Грузовой фургон Mercedes',
    type: 'van',
    manufacturer: 'Mercedes-Benz',
    model: 'Sprinter 314',
    year: 2022,
    status: 'operational',
    specifications: {
      maxWeight: 2000,
      maxVolume: '14м³',
      fuelType: 'diesel',
      fuelConsumption: 9.5,
      range: 600
    },
    features: ['Гидроборт', 'Рефрижератор', 'GPS-трекер'],
    lastMaintenance: '2024-05-20',
    nextMaintenance: '2024-08-20',
    location: 'Парковка базы',
    utilization: 75,
    currentDriver: 'drv-001'
  },
  {
    id: 'fvh-002',
    name: 'Пассажирский минивэн',
    type: 'minivan',
    manufacturer: 'Mercedes',
    model: 'V-Class',
    year: 2023,
    status: 'operational',
    specifications: {
      maxWeight: 800,
      maxVolume: 'Не применимо',
      fuelType: 'petrol',
      fuelConsumption: 10.2,
      range: 550,
      seats: 7
    },
    features: ['Кожаный салон', 'Климат-контроль', 'Wi-Fi'],
    lastMaintenance: '2024-06-01',
    nextMaintenance: '2024-09-01',
    location: 'Аэропорт Домодедово',
    utilization: 85,
    currentDriver: 'drv-002'
  },
  {
    id: 'fvh-003',
    name: 'Строительный самосвал',
    type: 'truck',
    manufacturer: 'КАМАЗ',
    model: '65201',
    year: 2021,
    status: 'maintenance',
    specifications: {
      maxWeight: 15000,
      maxVolume: '20м³',
      fuelType: 'diesel',
      fuelConsumption: 28.5,
      range: 800
    },
    features: ['Самосвальная платформа', 'Полный привод', 'Система контроля давления'],
    lastMaintenance: '2024-04-15',
    nextMaintenance: '2024-07-15',
    location: 'Ремонтная зона',
    utilization: 60
  }
];

const transportOrders: TransportOrder[] = [
  {
    id: 'tord-001',
    clientId: 'tcl-001',
    serviceId: 'ts-001',
    driverId: 'drv-001',
    vehicleId: 'fvh-001',
    items: [
      {
        id: 'titem-001',
        name: 'Строительные материалы',
        quantity: 1,
        price: 0,
        weight: 1500,
        dimensions: 'паллет 1.2x0.8x1.5м',
        fragile: false,
        specialRequirements: ['Защита от влаги']
      }
    ],
    status: 'in_transit',
    timeline: {
      created: '2024-06-18T08:00:00Z',
      confirmed: '2024-06-18T08:15:00Z',
      preparing: '2024-06-18T08:30:00Z',
      pickedUp: '2024-06-18T09:00:00Z',
      inTransit: '2024-06-18T09:15:00Z'
    },
    route: {
      from: 'Склад ООО "СтройГарант", ул. Промышленная, 15',
      to: 'Строительная площадка, ул. Новостроек, 45',
      distance: 25,
      estimatedTime: '11:30'
    },
    payment: {
      amount: 4500,
      method: 'invoice',
      status: 'pending'
    },
    notes: 'Требуется разгрузка краном'
  },
  {
    id: 'tord-002',
    clientId: 'tcl-002',
    serviceId: 'ts-002',
    driverId: 'drv-002',
    vehicleId: 'fvh-002',
    items: [
      {
        id: 'titem-002',
        name: 'Пассажирские перевозки',
        quantity: 3,
        price: 0,
        weight: 0,
        fragile: false,
        specialRequirements: ['Детское кресло', 'Багаж']
      }
    ],
    status: 'confirmed',
    timeline: {
      created: '2024-06-19T14:00:00Z',
      confirmed: '2024-06-19T14:05:00Z'
    },
    route: {
      from: 'Аэропорт Шереметьево',
      to: 'г. Москва, пр. Вернадского, д. 125',
      distance: 35,
      estimatedTime: '16:30'
    },
    payment: {
      amount: 2200,
      method: 'card',
      status: 'paid'
    }
  }
];

// Константы
const COLORS = {
  primary: 'from-slate-900 via-slate-950 to-slate-900',
  secondary: 'from-blue-900 via-slate-950 to-cyan-900',
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

const formatDistance = (value: number) => {
  if (value < 1) return `${(value * 1000).toFixed(0)} м`;
  if (value < 1000) return `${value.toFixed(1)} км`;
  return `${value.toFixed(0)} км`;
};

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
  glowColor = COLORS.blue, 
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
  type?: 'default' | 'service' | 'client' | 'driver' | 'order' | 'vehicle';
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
      case 'on_delivery':
        return { color: COLORS.orange, label: 'На маршруте', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'break':
        return { color: COLORS.purple, label: 'Перерыв', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'maintenance':
        return { color: COLORS.warning, label: 'Обслуживание', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' };
      case 'fueling':
        return { color: COLORS.cyan, label: 'Заправка', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' };
      case 'cleaning':
        return { color: COLORS.teal, label: 'Мойка', bg: 'bg-teal-500/15', border: 'border-teal-500/30' };
      case 'pending':
        return { color: COLORS.blue, label: 'Ожидание', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'confirmed':
        return { color: COLORS.teal, label: 'Подтвержден', bg: 'bg-teal-500/15', border: 'border-teal-500/30' };
      case 'preparing':
        return { color: COLORS.orange, label: 'Подготовка', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'in_transit':
        return { color: COLORS.indigo, label: 'В пути', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' };
      case 'delivered':
        return { color: COLORS.success, label: 'Выполнен', bg: 'bg-green-500/15', border: 'border-green-500/30' };
      case 'cancelled':
        return { color: COLORS.error, label: 'Отменен', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'returned':
        return { color: COLORS.rose, label: 'Возврат', bg: 'bg-rose-500/15', border: 'border-rose-500/30' };
      case 'operational':
        return { color: COLORS.success, label: 'Рабочее', bg: 'bg-green-500/15', border: 'border-green-500/30' };
      case 'out_of_service':
        return { color: COLORS.error, label: 'Не работает', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'cargo':
        return { color: COLORS.orange, label: 'Грузоперевозки', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'passenger':
        return { color: COLORS.blue, label: 'Пассажирские', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'special':
        return { color: COLORS.purple, label: 'Спецтехника', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'logistics':
        return { color: COLORS.indigo, label: 'Логистика', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' };
      case 'rental':
        return { color: COLORS.teal, label: 'Аренда', bg: 'bg-teal-500/15', border: 'border-teal-500/30' };
      case 'moving':
        return { color: COLORS.amber, label: 'Переезды', bg: 'bg-amber-500/15', border: 'border-amber-500/30' };
      case 'international':
        return { color: COLORS.cyan, label: 'Международные', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' };
      case 'individual':
        return { color: COLORS.blue, label: 'Частный', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'business':
        return { color: COLORS.emerald, label: 'Бизнес', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'corporate':
        return { color: COLORS.purple, label: 'Корпоративный', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'sedan':
        return { color: COLORS.slate, label: 'Седан', bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
      case 'suv':
        return { color: COLORS.orange, label: 'Внедорожник', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'minivan':
        return { color: COLORS.blue, label: 'Минивэн', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'truck':
        return { color: COLORS.indigo, label: 'Грузовик', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' };
      case 'van':
        return { color: COLORS.teal, label: 'Фургон', bg: 'bg-teal-500/15', border: 'border-teal-500/30' };
      case 'bus':
        return { color: COLORS.purple, label: 'Автобус', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'special':
        return { color: COLORS.amber, label: 'Спецтехника', bg: 'bg-amber-500/15', border: 'border-amber-500/30' };
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

const ProgressBar = ({ value, max = 100, color = COLORS.blue, label, showValue = true, size = 'md' }: { 
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

const StatCard = ({ title, value, change, icon, color = COLORS.blue, subtitle, onClick, trend }: {
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

const ServiceCard = ({ service, onClick }: { service: TransportService; onClick?: () => void }) => {
  const getServiceColor = (category: string) => {
    switch (category) {
      case 'cargo': return COLORS.orange;
      case 'passenger': return COLORS.blue;
      case 'special': return COLORS.purple;
      case 'logistics': return COLORS.indigo;
      case 'rental': return COLORS.teal;
      case 'moving': return COLORS.amber;
      case 'international': return COLORS.cyan;
      default: return COLORS.slate;
    }
  };

  const getDeliveryTimeDisplay = (deliveryTime: TransportService['deliveryTime']) => {
    const min = formatTime(deliveryTime.min);
    const max = formatTime(deliveryTime.max);
    return `${min} - ${max}`;
  };

  const getPriceDisplay = (price: TransportService['price']) => {
    let display = `от ${formatCurrency(price.base)}`;
    if (price.perKm) {
      display += ` + ${formatCurrency(price.perKm)}/км`;
    }
    if (price.perHour) {
      display += ` + ${formatCurrency(price.perHour)}/час`;
    }
    return display;
  };

  const utilization = (service.currentOrders / service.capacity) * 100;

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
            <span className="text-slate-400 text-xs">Время выполнения</span>
            <p className="text-white font-medium text-xs">{getDeliveryTimeDisplay(service.deliveryTime)}</p>
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
            <span className="text-white font-medium">{service.currentOrders}/{service.capacity}</span>
          </div>
          <ProgressBar 
            value={utilization} 
            color={utilization > 90 ? COLORS.rose : utilization > 75 ? COLORS.orange : COLORS.success}
            showValue={false}
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Зона покрытия:</span>
          <span className="text-white font-medium text-right text-xs">
            {service.coverage.areas.join(', ')}
          </span>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Подробнее
        </button>
        <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Заказать
        </button>
      </div>
    </BentoCard>
  );
};

const ClientCard = ({ client, onClick }: { client: TransportClient; onClick?: () => void }) => {
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
            {client.totalOrders} заказов • {client.type}
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
          <span className="text-slate-400">Адрес:</span>
          <span className="text-white font-medium text-right text-xs">{client.contact.address}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Баллы лояльности:</span>
          <span className="text-white font-medium">{client.loyalty.points}</span>
        </div>

        {client.lastOrder && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Последний заказ:</span>
            <span className="text-white font-medium text-xs">
              {new Date(client.lastOrder).toLocaleDateString('ru-RU')}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          История
        </button>
        <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Создать заказ
        </button>
      </div>
    </BentoCard>
  );
};

const DriverCard = ({ driver, onClick }: { driver: Driver; onClick?: () => void }) => {
  const utilization = (driver.currentOrders.length / driver.maxOrders) * 100;
  
  const getDriverColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'offline': return COLORS.slate;
      case 'on_delivery': return COLORS.orange;
      case 'break': return COLORS.purple;
      case 'maintenance': return COLORS.warning;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard className="p-5" glowColor={getDriverColor(driver.status)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{driver.name}</h4>
          <p className="text-slate-400 text-sm line-clamp-1">
            {driver.vehicle.type} • {driver.vehicle.model}
          </p>
        </div>
        <StatusBadge status={driver.status} type="driver" animated={driver.status === 'active'} />
      </div>
      
      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Рейтинг:</span>
          <span className="text-white font-medium">{driver.ratings.average}/5.0</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Заказов:</span>
          <span className="text-white font-medium">{driver.currentOrders.length}/{driver.maxOrders}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Вовремя:</span>
          <span className="text-white font-medium">{driver.metrics.onTimeRate}%</span>
        </div>

        {driver.currentLocation && (
          <div className="flex justify-between items-start">
            <span className="text-slate-400">Местоположение:</span>
            <span className="text-white font-medium text-right text-xs">
              {driver.currentLocation.address}
            </span>
          </div>
        )}
      </div>
      
      <ProgressBar 
        value={utilization} 
        label={`Загрузка водителя`}
        color={utilization > 90 ? COLORS.rose : utilization > 75 ? COLORS.orange : COLORS.success}
        showValue={false}
      />
    </BentoCard>
  );
};

const VehicleCard = ({ vehicle, onClick }: { vehicle: FleetVehicle; onClick?: () => void }) => {
  const getVehicleColor = (type: string) => {
    switch (type) {
      case 'sedan': return COLORS.slate;
      case 'suv': return COLORS.orange;
      case 'minivan': return COLORS.blue;
      case 'truck': return COLORS.indigo;
      case 'van': return COLORS.teal;
      case 'bus': return COLORS.purple;
      case 'special': return COLORS.amber;
      default: return COLORS.slate;
    }
  };

  const isMaintenanceDue = new Date(vehicle.nextMaintenance) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <BentoCard className="p-5" glowColor={getVehicleColor(vehicle.type)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{vehicle.name}</h4>
          <p className="text-slate-400 text-sm">{vehicle.manufacturer} {vehicle.model} ({vehicle.year})</p>
        </div>
        <StatusBadge status={vehicle.status} type="vehicle" animated={vehicle.status === 'operational'} />
      </div>
      
      <div className="space-y-4 mb-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs">Тип</span>
            <p className="text-white font-medium">
              {vehicle.type === 'sedan' && 'Седан'}
              {vehicle.type === 'suv' && 'Внедорожник'}
              {vehicle.type === 'minivan' && 'Минивэн'}
              {vehicle.type === 'truck' && 'Грузовик'}
              {vehicle.type === 'van' && 'Фургон'}
              {vehicle.type === 'bus' && 'Автобус'}
              {vehicle.type === 'special' && 'Спецтехника'}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-slate-400 text-xs">Использование</span>
            <p className="text-white font-medium">{vehicle.utilization}%</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs">Местоположение</span>
            <p className="text-white font-medium text-xs">{vehicle.location}</p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-slate-400 text-xs">След. ТО</span>
            <p className="text-white font-medium text-xs">{new Date(vehicle.nextMaintenance).toLocaleDateString('ru-RU')}</p>
          </div>
        </div>

        <ProgressBar 
          value={vehicle.utilization} 
          label={`Использование транспорта`}
          color={vehicle.utilization > 90 ? COLORS.rose : vehicle.utilization > 75 ? COLORS.orange : COLORS.success}
          showValue={false}
        />
      </div>
      
      {isMaintenanceDue && vehicle.status === 'operational' && (
        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <p className="text-yellow-300 text-xs text-center font-medium">Требуется плановое ТО</p>
        </div>
      )}
    </BentoCard>
  );
};

const OrderCard = ({ order, onClick }: { order: TransportOrder; onClick?: () => void }) => {
  const client = transportClients.find(c => c.id === order.clientId);
  const service = transportServices.find(s => s.id === order.serviceId);
  const driver = drivers.find(d => d.id === order.driverId);

  const getOrderColor = (status: string) => {
    switch (status) {
      case 'pending': return COLORS.blue;
      case 'confirmed': return COLORS.teal;
      case 'preparing': return COLORS.orange;
      case 'in_transit': return COLORS.indigo;
      case 'delivered': return COLORS.success;
      case 'cancelled': return COLORS.error;
      case 'returned': return COLORS.rose;
      default: return COLORS.slate;
    }
  };

  const getStatusProgress = (status: string) => {
    const statuses = ['pending', 'confirmed', 'preparing', 'in_transit', 'delivered'];
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
        <StatusBadge status={order.status} type="order" animated={order.status === 'in_transit'} />
      </div>
      
      <div className="space-y-3 text-sm mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Сумма:</span>
          <span className="text-white font-medium">{formatCurrency(order.payment.amount)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Расстояние:</span>
          <span className="text-white font-medium">{formatDistance(order.route.distance)}</span>
        </div>
        
        {order.route.estimatedTime && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Время прибытия:</span>
            <span className="text-white font-medium">
              {order.route.actualTime || order.route.estimatedTime}
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
        <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Отследить
        </button>
      </div>
    </BentoCard>
  );
};

// Основной компонент
export default function TransportServicesOrganization() {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'clients' | 'drivers' | 'vehicles' | 'analytics' | 'orders'>('overview');
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
    if (!searchQuery) return transportServices;
    return transportServices.filter(service =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.serviceTypes.some(type => type.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const filteredClients = useMemo(() => {
    if (!searchQuery) return transportClients;
    return transportClients.filter(client =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contact.phone.includes(searchQuery) ||
      client.contact.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredDrivers = useMemo(() => {
    if (!searchQuery) return drivers;
    return drivers.filter(driver =>
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (driver.currentLocation?.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const filteredVehicles = useMemo(() => {
    if (!searchQuery) return fleetVehicles;
    return fleetVehicles.filter(vehicle =>
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return transportOrders;
    return transportOrders.filter(order => {
      const client = transportClients.find(c => c.id === order.clientId);
      const service = transportServices.find(s => s.id === order.serviceId);
      
      return (
        client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  // Статистика
  const transportStats = useMemo(() => {
    const totalClients = transportClients.length;
    const activeClients = transportClients.filter(c => c.status === 'active').length;
    const totalServices = transportServices.length;
    const activeServices = transportServices.filter(s => s.status === 'active').length;
    const totalDrivers = drivers.length;
    const availableDrivers = drivers.filter(d => d.status === 'active' || d.status === 'on_delivery').length;
    const todayOrders = transportOrders.filter(o => new Date(o.timeline.created).toDateString() === new Date().toDateString()).length;
    const totalVehicles = fleetVehicles.length;
    const operationalVehicles = fleetVehicles.filter(v => v.status === 'operational').length;
    const totalRevenue = transportOrders
      .filter(o => o.payment.status === 'paid')
      .reduce((sum, order) => sum + order.payment.amount, 0);

    return {
      totalClients,
      activeClients,
      totalServices,
      activeServices,
      totalDrivers,
      availableDrivers,
      todayOrders,
      totalVehicles,
      operationalVehicles,
      totalRevenue
    };
  }, []);

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: '📊', count: null },
    { id: 'services' as const, label: 'Услуги', icon: '🚚', count: transportStats.totalServices },
    { id: 'clients' as const, label: 'Клиенты', icon: '👥', count: transportStats.totalClients },
    { id: 'drivers' as const, label: 'Водители', icon: '👨‍✈️', count: transportStats.totalDrivers },
    { id: 'vehicles' as const, label: 'Автопарк', icon: '⚙️', count: transportStats.totalVehicles },
    { id: 'orders' as const, label: 'Заказы', icon: '📦', count: transportOrders.length },
    { id: 'analytics' as const, label: 'Аналитика', icon: '📈', count: null }
  ];

  // Модальные окна контент
  const renderServiceModal = (service: TransportService) => {
    const utilization = (service.currentOrders / service.capacity) * 100;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Транспортная услуга</label>
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
              {formatTime(service.deliveryTime.min)}
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
                <span className="text-white font-medium">Активные заказы</span>
                <span className="text-white font-bold">{service.currentOrders}/{service.capacity}</span>
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
                {service.price.perKm && ` + ${formatCurrency(service.price.perKm)}/км`}
                {service.price.perHour && ` + ${formatCurrency(service.price.perHour)}/час`}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-slate-400">
                <div>Лимит веса: {service.price.weightLimit} кг</div>
                <div>Лимит объема: {service.price.volumeLimit}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Время выполнения</label>
            <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
              <p className="text-white font-medium">
                {formatTime(service.deliveryTime.min)} - {formatTime(service.deliveryTime.max)}
              </p>
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Зона покрытия</label>
            <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
              <p className="text-white font-medium">{service.coverage.areas.join(', ')}</p>
              {service.coverage.radius > 0 && (
                <p className="text-slate-400 text-sm mt-1">Радиус: {service.coverage.radius} км</p>
              )}
              {service.coverage.international && (
                <p className="text-cyan-400 text-sm mt-1">✓ Международные перевозки</p>
              )}
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
            <label className="text-slate-400 text-sm font-medium mb-3 block">Используемый транспорт</label>
            <div className="space-y-2">
              {service.vehicles.map((vehicle, index) => (
                <div key={index} className="p-3 bg-slate-800/20 rounded-xl">
                  <p className="text-white text-sm">{vehicle}</p>
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
      </div>
    );
  };

  const renderClientModal = (client: TransportClient) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm font-medium">Клиент</label>
            <p className="text-white font-semibold text-lg mt-1">{client.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm">Всего заказов</label>
              <p className="text-white font-medium">{client.totalOrders}</p>
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

  const renderDriverModal = (driver: Driver) => {
    const utilization = (driver.currentOrders.length / driver.maxOrders) * 100;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm font-medium">Водитель</label>
              <p className="text-white font-semibold text-lg mt-1">{driver.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm">Выполнено заказов</label>
                <p className="text-white font-medium">{driver.metrics.completedOrders}</p>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Рейтинг</label>
                <p className="text-white font-medium">{driver.ratings.average}/5.0</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm font-medium">Статус</label>
              <div className="mt-2">
                <StatusBadge status={driver.status} type="driver" animated={driver.status === 'active'} />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-sm">Пробег</label>
              <p className="text-white font-medium">{formatDistance(driver.metrics.distanceCovered)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Контактная информация</label>
            <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
              <div>
                <span className="text-slate-400 text-sm">Телефон:</span>
                <p className="text-white font-medium">{driver.contact.phone}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Email:</span>
                <p className="text-white font-medium">{driver.contact.email}</p>
              </div>
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Водительское удостоверение</label>
            <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
              <div>
                <span className="text-slate-400 text-sm">Категории:</span>
                <p className="text-white font-medium">{driver.license.type}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Номер:</span>
                <p className="text-white font-medium">{driver.license.number}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Действует до:</span>
                <p className="text-white font-medium">{new Date(driver.license.expiry).toLocaleDateString('ru-RU')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Транспортное средство</label>
            <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
              <div>
                <span className="text-slate-400 text-sm">Тип:</span>
                <p className="text-white font-medium">
                  {driver.vehicle.type === 'sedan' && 'Седан'}
                  {driver.vehicle.type === 'suv' && 'Внедорожник'}
                  {driver.vehicle.type === 'minivan' && 'Минивэн'}
                  {driver.vehicle.type === 'truck' && 'Грузовик'}
                  {driver.vehicle.type === 'van' && 'Фургон'}
                  {driver.vehicle.type === 'bus' && 'Автобус'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Модель:</span>
                <p className="text-white font-medium">{driver.vehicle.model}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Номер:</span>
                <p className="text-white font-medium">{driver.vehicle.licensePlate}</p>
              </div>
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Загрузка водителя</label>
            <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">Текущие заказы</span>
                <span className="text-white font-bold">{driver.currentOrders.length}/{driver.maxOrders}</span>
              </div>
              <ProgressBar 
                value={utilization} 
                color={utilization > 90 ? COLORS.rose : utilization > 75 ? COLORS.orange : COLORS.success}
                showValue={true}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-xl">{driver.ratings.average}</p>
            <p className="text-slate-400 text-xs">рейтинг</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-xl">{driver.metrics.onTimeRate}%</p>
            <p className="text-slate-400 text-xs">вовремя</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-xl">{driver.ratings.count}</p>
            <p className="text-slate-400 text-xs">оценок</p>
          </div>
        </div>

        {driver.currentLocation && (
          <div>
            <label className="text-slate-400 text-sm font-medium mb-3 block">Текущее местоположение</label>
            <div className="p-4 bg-slate-800/30 rounded-2xl">
              <p className="text-white font-medium">{driver.currentLocation.address}</p>
              <p className="text-slate-400 text-xs mt-1">
                Координаты: {driver.currentLocation.lat.toFixed(4)}, {driver.currentLocation.lng.toFixed(4)}
              </p>
            </div>
          </div>
        )}

        {driver.currentOrders.length > 0 && (
          <div>
            <label className="text-slate-400 text-sm font-medium mb-3 block">Текущие заказы</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {driver.currentOrders.map((orderId) => {
                const order = transportOrders.find(o => o.id === orderId);
                return order ? (
                  <div key={orderId} className="p-3 bg-slate-800/30 rounded-xl">
                    <p className="text-white font-medium text-sm">Заказ #{order.id.split('-')[1]}</p>
                    <p className="text-slate-400 text-xs">{order.route.to}</p>
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
                Транспорт <span className="text-blue-400">"Профи"</span>
              </h1>
              <p className="text-slate-400 text-lg">Комплексные транспортные решения для бизнеса и частных клиентов</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск услуг, клиентов, заказов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full lg:w-80 px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
                <svg className="absolute right-3 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <button 
                className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 px-6 py-3 rounded-2xl transition-all duration-200 font-semibold flex items-center gap-2 justify-center"
                onClick={() => openModal('Создать заказ', (
                  <div className="space-y-4">
                    <p className="text-slate-400 text-center">Функционал создания заказа в разработке...</p>
                  </div>
                ), 'md')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Создать заказ
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Всего клиентов"
              value={transportStats.totalClients}
              change={12}
              icon="👥"
              color={COLORS.blue}
              subtitle={`${transportStats.activeClients} активных`}
              trend="up"
            />
            <StatCard
              title="Транспортных услуг"
              value={transportStats.totalServices}
              change={8}
              icon="🚚"
              color={COLORS.indigo}
              subtitle={`${transportStats.activeServices} активных`}
              trend="up"
            />
            <StatCard
              title="Водителей"
              value={transportStats.totalDrivers}
              change={5}
              icon="👨‍✈️"
              color={COLORS.teal}
              subtitle={`${transportStats.availableDrivers} доступно`}
              trend="up"
            />
            <StatCard
              title="Заказов сегодня"
              value={transportStats.todayOrders}
              change={18}
              icon="📦"
              color={COLORS.purple}
              subtitle="перевозок"
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
                          ? 'bg-blue-500 text-white' 
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
                    <h2 className="text-2xl font-bold text-white">Популярные транспортные услуги</h2>
                    <button 
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                      onClick={() => setActiveTab('services')}
                    >
                      Все услуги
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {transportServices
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

                {/* Recent Clients & Drivers */}
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
                      {transportClients
                        .filter(client => client.status === 'active')
                        .sort((a, b) => b.totalOrders - a.totalOrders)
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
                      <h3 className="text-xl font-bold text-white">Активные водители</h3>
                      <button 
                        className="text-slate-400 hover:text-slate-300 text-sm font-medium"
                        onClick={() => setActiveTab('drivers')}
                      >
                        Все водители →
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {drivers
                        .filter(driver => driver.status === 'active' || driver.status === 'on_delivery')
                        .slice(0, 4)
                        .map((driver, index) => (
                        <motion.div
                          key={driver.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <DriverCard 
                            driver={driver}
                            onClick={() => openModal(driver.name, renderDriverModal(driver), 'xl')}
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
                    {transportOrders
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
                  <h2 className="text-2xl font-bold text-white">Транспортные услуги</h2>
                  <div className="flex gap-2">
                    <button className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-slate-200 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                      Фильтры
                    </button>
                    <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
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

            {activeTab === 'drivers' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Водители</h2>
                  <button className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                    + Новый водитель
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDrivers.map((driver, index) => (
                    <motion.div
                      key={driver.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <DriverCard 
                        driver={driver}
                        onClick={() => openModal(driver.name, renderDriverModal(driver), 'xl')}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'vehicles' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Автопарк</h2>
                  <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                    + Новое ТС
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle, index) => (
                    <motion.div
                      key={vehicle.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <VehicleCard 
                        vehicle={vehicle}
                        onClick={() => openModal(vehicle.name, (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-slate-400 text-sm">Транспортное средство</label>
                                <p className="text-white font-medium">{vehicle.name}</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Статус</label>
                                <div className="mt-1">
                                  <StatusBadge status={vehicle.status} type="vehicle" animated={vehicle.status === 'operational'} />
                                </div>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Производитель</label>
                                <p className="text-white font-medium">{vehicle.manufacturer}</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Модель</label>
                                <p className="text-white font-medium">{vehicle.model}</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Год выпуска</label>
                                <p className="text-white font-medium">{vehicle.year}</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Тип</label>
                                <p className="text-white font-medium">
                                  {vehicle.type === 'sedan' && 'Седан'}
                                  {vehicle.type === 'suv' && 'Внедорожник'}
                                  {vehicle.type === 'minivan' && 'Минивэн'}
                                  {vehicle.type === 'truck' && 'Грузовик'}
                                  {vehicle.type === 'van' && 'Фургон'}
                                  {vehicle.type === 'bus' && 'Автобус'}
                                  {vehicle.type === 'special' && 'Спецтехника'}
                                </p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Местоположение</label>
                                <p className="text-white font-medium">{vehicle.location}</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">Использование</label>
                                <p className="text-white font-medium">{vehicle.utilization}%</p>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm">След. ТО</label>
                                <p className="text-white font-medium">{new Date(vehicle.nextMaintenance).toLocaleDateString('ru-RU')}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <label className="text-slate-400 text-sm font-medium">Характеристики</label>
                                <div className="mt-2 space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Макс. вес:</span>
                                    <span className="text-white">{vehicle.specifications.maxWeight} кг</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Макс. объем:</span>
                                    <span className="text-white">{vehicle.specifications.maxVolume}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Тип топлива:</span>
                                    <span className="text-white">
                                      {vehicle.specifications.fuelType === 'petrol' && 'Бензин'}
                                      {vehicle.specifications.fuelType === 'diesel' && 'Дизель'}
                                      {vehicle.specifications.fuelType === 'electric' && 'Электрический'}
                                      {vehicle.specifications.fuelType === 'hybrid' && 'Гибридный'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Расход:</span>
                                    <span className="text-white">{vehicle.specifications.fuelConsumption} л/100км</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Запас хода:</span>
                                    <span className="text-white">{vehicle.specifications.range} км</span>
                                  </div>
                                  {vehicle.specifications.seats && (
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">Места:</span>
                                      <span className="text-white">{vehicle.specifications.seats}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <label className="text-slate-400 text-sm font-medium">Особенности</label>
                                <div className="mt-2 space-y-1">
                                  {vehicle.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                      <span className="text-white">{feature}</span>
                                    </div>
                                  ))}
                                </div>
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
                  <h2 className="text-2xl font-bold text-white">Заказы</h2>
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
                  <BentoCard className="p-6" glowColor={COLORS.blue}>
                    <h3 className="text-white font-semibold mb-4">Эффективность перевозок</h3>
                    <div className="text-3xl font-bold text-white mb-2">91.8%</div>
                    <ProgressBar value={91.8} color={COLORS.blue} />
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-slate-300">
                      <div>
                        <p>Средняя скорость</p>
                        <p className="text-white font-medium">52 км/ч</p>
                      </div>
                      <div>
                        <p>Успешность</p>
                        <p className="text-white font-medium">94.2%</p>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.indigo}>
                    <h3 className="text-white font-semibold mb-4">Финансовые показатели</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                        <span className="text-slate-300">Общая выручка</span>
                        <span className="text-white font-medium">{formatCurrency(transportStats.totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                        <span className="text-slate-300">Средний чек</span>
                        <span className="text-white font-medium">{formatCurrency(transportOrders.length > 0 ? transportStats.totalRevenue / transportOrders.length : 0)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                        <span className="text-slate-300">Заказов в день</span>
                        <span className="text-emerald-300 font-medium">{transportStats.todayOrders}</span>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.purple}>
                    <h3 className="text-white font-semibold mb-4">Распределение по типам</h3>
                    <div className="space-y-3">
                      {[
                        { type: 'Грузоперевозки', percentage: 35, orders: Math.round(transportOrders.length * 0.35) },
                        { type: 'Пассажирские', percentage: 25, orders: Math.round(transportOrders.length * 0.25) },
                        { type: 'Аренда', percentage: 20, orders: Math.round(transportOrders.length * 0.20) },
                        { type: 'Переезды', percentage: 12, orders: Math.round(transportOrders.length * 0.12) },
                        { type: 'Спецтехника', percentage: 8, orders: Math.round(transportOrders.length * 0.08) }
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

                {/* Transport Analytics */}
                <BentoCard className="p-6">
                  <h3 className="text-white font-semibold mb-4">Аналитика транспорта</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Ключевые показатели</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Среднее время выполнения</span>
                          <span className="text-white font-medium">3.2 ч</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Отмененные заказы</span>
                          <span className="text-white font-medium">2.8%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Средняя дистанция</span>
                          <span className="text-white font-medium">28.5 км</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Использование автопарка</span>
                          <span className="text-white font-medium">78.3%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Эффективность по типам услуг</h4>
                      <div className="space-y-3">
                        {[
                          { type: 'Грузоперевозки', effectiveness: 92, time: '4.1 ч' },
                          { type: 'Пассажирские', effectiveness: 96, time: '1.8 ч' },
                          { type: 'Аренда авто', effectiveness: 94, time: '2.3 ч' },
                          { type: 'Переезды', effectiveness: 89, time: '5.2 ч' }
                        ].map((item, index) => (
                          <div key={index} className="p-3 bg-slate-800/30 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white text-sm">{item.type}</span>
                              <span className="text-slate-300 text-sm">{item.effectiveness}%</span>
                            </div>
                            <ProgressBar value={item.effectiveness} color={COLORS.blue} />
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