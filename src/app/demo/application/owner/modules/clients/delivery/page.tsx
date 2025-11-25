'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

// Хук для времени клиента с улучшенной производительностью
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
interface Courier {
  id: string;
  personalInfo: {
    fullName: string;
    phone: string;
    email?: string;
    birthDate: string;
    idNumber: string;
    driverLicense: string;
    avatar?: string;
  };
  vehicle: {
    type: 'car' | 'motorcycle' | 'bicycle' | 'foot' | 'electric_scooter';
    model?: string;
    licensePlate?: string;
    color?: string;
    year?: number;
  };
  workInfo: {
    status: 'active' | 'busy' | 'offline' | 'vacation' | 'sick_leave';
    workSchedule: {
      days: string[];
      hours: string;
    };
    employmentType: 'full_time' | 'part_time' | 'freelance';
    rating: number;
    completedOrders: number;
    totalEarnings: number;
    joinDate: string;
    lastActivity: string;
  };
  location?: {
    address: string;
    lat: number;
    lng: number;
    lastUpdate: string;
    speed?: number;
    battery?: number;
  };
  currentOrder?: string;
  metrics: {
    onTimeDelivery: number;
    customerRating: number;
    acceptanceRate: number;
    averageDeliveryTime: number;
    cancellationRate: number;
  };
  skills?: string[];
  certifications?: string[];
}

interface DeliveryOrder {
  id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
    preferredContact?: 'phone' | 'sms' | 'whatsapp';
  };
  package: {
    type: 'document' | 'food' | 'parcel' | 'electronics' | 'flowers' | 'other';
    size: 'small' | 'medium' | 'large' | 'xlarge';
    weight: number;
    description: string;
    fragile: boolean;
    perishable: boolean;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    specialInstructions?: string;
  };
  delivery: {
    fromAddress: string;
    toAddress: string;
    distance: number;
    estimatedTime: number;
    priority: 'standard' | 'express' | 'urgent';
    timeWindows?: {
      preferred: string[];
      unavailable: string[];
    };
    routePolyline?: string;
    trafficConditions?: 'clear' | 'moderate' | 'heavy' | 'severe';
  };
  payment: {
    amount: number;
    currency: 'RUB';
    method: 'cash' | 'card' | 'online';
    commission: number;
    courierEarnings: number;
    tip?: number;
    status: 'pending' | 'completed' | 'refunded';
  };
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled' | 'failed';
  timeline: {
    created: string;
    assigned?: string;
    picked_up?: string;
    in_transit?: string;
    delivered?: string;
    cancelled?: string;
    estimated_delivery?: string;
  };
  assignedCourier?: string;
  notes?: string;
  proofOfDelivery?: {
    signature?: string;
    photo?: string;
    notes?: string;
  };
}

interface DeliveryRequest {
  id: string;
  orderId: string;
  requestType: 'assignment' | 'support' | 'issue' | 'payment' | 'technical' | 'complaint';
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  status: 'submitted' | 'reviewed' | 'in_progress' | 'resolved' | 'rejected';
  timeline: {
    submitted: string;
    reviewed?: string;
    in_progress?: string;
    resolved?: string;
    rejected?: string;
  };
  assignedTo?: string;
  notes?: string;
  attachments?: string[];
  category?: string;
}

// Расширенные моки данных
const couriers: Courier[] = [
  {
    id: 'cr-001',
    personalInfo: {
      fullName: 'Иванов Алексей Петрович',
      phone: '+7 (916) 123-45-67',
      email: 'a.ivanov@courier.ru',
      birthDate: '1990-05-15',
      idNumber: '4510123456',
      driverLicense: 'AB123456',
      avatar: '👨‍💼'
    },
    vehicle: {
      type: 'car',
      model: 'Hyundai Solaris',
      licensePlate: 'A123BC777',
      color: 'Белый',
      year: 2020
    },
    workInfo: {
      status: 'active',
      workSchedule: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        hours: '09:00-21:00'
      },
      employmentType: 'full_time',
      rating: 4.8,
      completedOrders: 245,
      totalEarnings: 187600,
      joinDate: '2022-03-15',
      lastActivity: '2024-06-19T10:30:00Z'
    },
    location: {
      address: 'г. Москва, ул. Тверская, д. 15',
      lat: 55.7558,
      lng: 37.6173,
      lastUpdate: '2024-06-19T10:30:00Z',
      speed: 45,
      battery: 85
    },
    currentOrder: 'do-001',
    metrics: {
      onTimeDelivery: 96,
      customerRating: 4.8,
      acceptanceRate: 98,
      averageDeliveryTime: 28,
      cancellationRate: 2
    },
    skills: ['Экспресс-доставка', 'Работа с клиентами', 'Навигация'],
    certifications: ['Безопасность дорожного движения', 'Обработка пищевых продуктов']
  },
  {
    id: 'cr-002',
    personalInfo: {
      fullName: 'Петрова Мария Сергеевна',
      phone: '+7 (925) 234-56-78',
      email: 'm.petrova@courier.ru',
      birthDate: '1995-12-20',
      idNumber: '4510234567',
      driverLicense: 'CD234567',
      avatar: '👩‍💼'
    },
    vehicle: {
      type: 'motorcycle',
      model: 'Yamaha YBR 125',
      licensePlate: 'B456DE777',
      color: 'Красный',
      year: 2021
    },
    workInfo: {
      status: 'busy',
      workSchedule: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
        hours: '10:00-19:00'
      },
      employmentType: 'part_time',
      rating: 4.9,
      completedOrders: 189,
      totalEarnings: 142300,
      joinDate: '2023-01-10',
      lastActivity: '2024-06-19T10:25:00Z'
    },
    location: {
      address: 'г. Москва, пр. Мира, д. 125',
      lat: 55.7818,
      lng: 37.6333,
      lastUpdate: '2024-06-19T10:25:00Z',
      speed: 35,
      battery: 92
    },
    currentOrder: 'do-002',
    metrics: {
      onTimeDelivery: 98,
      customerRating: 4.9,
      acceptanceRate: 95,
      averageDeliveryTime: 22,
      cancellationRate: 1
    },
    skills: ['Быстрая доставка', 'Маневренность', 'Знание города'],
    certifications: ['Мото безопасность', 'Курс первой помощи']
  },
  {
    id: 'cr-003',
    personalInfo: {
      fullName: 'Сидоров Дмитрий Николаевич',
      phone: '+7 (916) 345-67-89',
      birthDate: '1988-08-30',
      idNumber: '4510345678',
      driverLicense: 'EF345678',
      avatar: '👨‍🚴'
    },
    vehicle: {
      type: 'bicycle',
      color: 'Синий',
      year: 2023
    },
    workInfo: {
      status: 'active',
      workSchedule: {
        days: ['Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        hours: '08:00-20:00'
      },
      employmentType: 'freelance',
      rating: 4.7,
      completedOrders: 156,
      totalEarnings: 89400,
      joinDate: '2023-06-01',
      lastActivity: '2024-06-19T10:35:00Z'
    },
    location: {
      address: 'г. Москва, ул. Пушкина, д. 67',
      lat: 55.7649,
      lng: 37.6075,
      lastUpdate: '2024-06-19T10:35:00Z',
      speed: 15,
      battery: 78
    },
    metrics: {
      onTimeDelivery: 94,
      customerRating: 4.7,
      acceptanceRate: 92,
      averageDeliveryTime: 35,
      cancellationRate: 4
    },
    skills: ['Экологичная доставка', 'Пешие зоны', 'Экономичность'],
    certifications: ['Эко-доставка', 'Городская навигация']
  },
  {
    id: 'cr-004',
    personalInfo: {
      fullName: 'Козлова Анна Владимировна',
      phone: '+7 (925) 456-78-90',
      email: 'a.kozlova@courier.ru',
      birthDate: '1992-03-10',
      idNumber: '4510456789',
      driverLicense: 'GH456789',
      avatar: '👩‍🛴'
    },
    vehicle: {
      type: 'electric_scooter',
      model: 'Xiaomi Mi Electric Scooter',
      color: 'Черный',
      year: 2022
    },
    workInfo: {
      status: 'offline',
      workSchedule: {
        days: ['Пн', 'Ср', 'Пт', 'Сб'],
        hours: '11:00-18:00'
      },
      employmentType: 'part_time',
      rating: 4.6,
      completedOrders: 78,
      totalEarnings: 45300,
      joinDate: '2024-01-15',
      lastActivity: '2024-06-18T18:00:00Z'
    },
    metrics: {
      onTimeDelivery: 91,
      customerRating: 4.6,
      acceptanceRate: 88,
      averageDeliveryTime: 32,
      cancellationRate: 6
    },
    skills: ['Компактная доставка', 'Быстрый старт', 'Парковка'],
    certifications: ['Электротранспорт', 'Городская мобильность']
  },
  {
    id: 'cr-005',
    personalInfo: {
      fullName: 'Васильев Игорь Александрович',
      phone: '+7 (916) 567-89-01',
      email: 'i.vasiliev@courier.ru',
      birthDate: '1993-07-22',
      idNumber: '4510567890',
      driverLicense: 'IJ567890',
      avatar: '🚗'
    },
    vehicle: {
      type: 'car',
      model: 'Kia Rio',
      licensePlate: 'C789FG777',
      color: 'Серый',
      year: 2019
    },
    workInfo: {
      status: 'active',
      workSchedule: {
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        hours: '08:00-22:00'
      },
      employmentType: 'full_time',
      rating: 4.9,
      completedOrders: 312,
      totalEarnings: 245800,
      joinDate: '2021-11-05',
      lastActivity: '2024-06-19T10:28:00Z'
    },
    location: {
      address: 'г. Москва, Ленинский пр-т, д. 89',
      lat: 55.6908,
      lng: 37.5533,
      lastUpdate: '2024-06-19T10:28:00Z',
      speed: 0,
      battery: 100
    },
    metrics: {
      onTimeDelivery: 97,
      customerRating: 4.9,
      acceptanceRate: 99,
      averageDeliveryTime: 26,
      cancellationRate: 1
    },
    skills: ['Грузовые перевозки', 'Дальние маршруты', 'Клиентский сервис'],
    certifications: ['Грузовые перевозки', 'Премиум сервис']
  }
];

const deliveryOrders: DeliveryOrder[] = [
  {
    id: 'do-001',
    customer: {
      name: 'Сергеев Иван Петрович',
      phone: '+7 (916) 111-22-33',
      address: 'г. Москва, ул. Ленина, д. 15, кв. 34',
      notes: 'Код домофона 34K, 5 этаж, лифт не работает',
      preferredContact: 'phone'
    },
    package: {
      type: 'food',
      size: 'medium',
      weight: 2.5,
      description: 'Обед из ресторана Суши Wok: суши сет "Филадельфия", суп мисо, салат чука',
      fragile: true,
      perishable: true,
      dimensions: {
        length: 30,
        width: 25,
        height: 15
      },
      specialInstructions: 'Соусы положить отдельно, не переворачивать'
    },
    delivery: {
      fromAddress: 'г. Москва, ул. Тверская, д. 5, ресторан "Суши Wok"',
      toAddress: 'г. Москва, ул. Ленина, д. 15, кв. 34',
      distance: 3.2,
      estimatedTime: 25,
      priority: 'express',
      timeWindows: {
        preferred: ['12:00-13:00'],
        unavailable: ['14:00-15:00']
      },
      trafficConditions: 'moderate'
    },
    payment: {
      amount: 450,
      currency: 'RUB',
      method: 'online',
      commission: 90,
      courierEarnings: 360,
      tip: 50,
      status: 'completed'
    },
    status: 'assigned',
    timeline: {
      created: '2024-06-19T10:00:00Z',
      assigned: '2024-06-19T10:05:00Z',
      estimated_delivery: '2024-06-19T12:30:00Z'
    },
    assignedCourier: 'cr-001',
    notes: 'Требуется термосумка, клиент ждет к 12:30'
  },
  {
    id: 'do-002',
    customer: {
      name: 'Николаева Ольга Дмитриевна',
      phone: '+7 (925) 222-33-44',
      address: 'г. Москва, пр. Мира, д. 89, кв. 12',
      preferredContact: 'whatsapp'
    },
    package: {
      type: 'electronics',
      size: 'small',
      weight: 0.8,
      description: 'Смартфон iPhone 15 Pro 256GB, оригинальная упаковка',
      fragile: true,
      perishable: false,
      dimensions: {
        length: 15,
        width: 8,
        height: 5
      },
      specialInstructions: 'Требуется подпись получателя, проверить документы'
    },
    delivery: {
      fromAddress: 'г. Москва, ул. Гагарина, д. 34, магазин "re:Store"',
      toAddress: 'г. Москва, пр. Мира, д. 89, кв. 12',
      distance: 5.7,
      estimatedTime: 35,
      priority: 'standard',
      trafficConditions: 'heavy'
    },
    payment: {
      amount: 300,
      currency: 'RUB',
      method: 'card',
      commission: 60,
      courierEarnings: 240,
      status: 'pending'
    },
    status: 'in_transit',
    timeline: {
      created: '2024-06-19T09:30:00Z',
      assigned: '2024-06-19T09:35:00Z',
      picked_up: '2024-06-19T09:45:00Z',
      in_transit: '2024-06-19T09:50:00Z',
      estimated_delivery: '2024-06-19T10:25:00Z'
    },
    assignedCourier: 'cr-002',
    notes: 'Требуется подпись получателя, дорогая техника'
  },
  {
    id: 'do-003',
    customer: {
      name: 'Александров Петр Сергеевич',
      phone: '+7 (916) 333-44-55',
      address: 'г. Москва, ул. Пушкина, д. 23, кв. 45',
      preferredContact: 'sms'
    },
    package: {
      type: 'document',
      size: 'small',
      weight: 0.2,
      description: 'Важные документы: договора, счета, юридические бумаги',
      fragile: false,
      perishable: false,
      specialInstructions: 'Конфиденциально, вскрывать запрещено'
    },
    delivery: {
      fromAddress: 'г. Москва, ул. Тверская, д. 10, офис 45',
      toAddress: 'г. Москва, ул. Пушкина, д. 23, кв. 45',
      distance: 1.8,
      estimatedTime: 15,
      priority: 'urgent',
      trafficConditions: 'clear'
    },
    payment: {
      amount: 250,
      currency: 'RUB',
      method: 'cash',
      commission: 50,
      courierEarnings: 200,
      status: 'pending'
    },
    status: 'pending',
    timeline: {
      created: '2024-06-19T11:00:00Z',
      estimated_delivery: '2024-06-19T12:00:00Z'
    },
    notes: 'Доставить до 12:00, срочные документы для подписания'
  },
  {
    id: 'do-004',
    customer: {
      name: 'Волкова Екатерина Игоревна',
      phone: '+7 (925) 444-55-66',
      address: 'г. Москва, ул. Гагарина, д. 56, кв. 78',
      notes: 'Позвонить за 10 минут до прибытия'
    },
    package: {
      type: 'flowers',
      size: 'medium',
      weight: 1.5,
      description: 'Букет роз из 51 розы, упаковка премиум',
      fragile: true,
      perishable: true,
      dimensions: {
        length: 60,
        width: 40,
        height: 20
      },
      specialInstructions: 'Держать вертикально, не трясти, беречь от солнца'
    },
    delivery: {
      fromAddress: 'г. Москва, ул. Цветочная, д. 12, магазин "Розовый сад"',
      toAddress: 'г. Москва, ул. Гагарина, д. 56, кв. 78',
      distance: 4.3,
      estimatedTime: 28,
      priority: 'express',
      trafficConditions: 'moderate'
    },
    payment: {
      amount: 400,
      currency: 'RUB',
      method: 'online',
      commission: 80,
      courierEarnings: 320,
      tip: 100,
      status: 'completed'
    },
    status: 'delivered',
    timeline: {
      created: '2024-06-19T08:00:00Z',
      assigned: '2024-06-19T08:10:00Z',
      picked_up: '2024-06-19T08:20:00Z',
      in_transit: '2024-06-19T08:25:00Z',
      delivered: '2024-06-19T08:45:00Z'
    },
    assignedCourier: 'cr-003',
    proofOfDelivery: {
      signature: 'Е. Волкова',
      notes: 'Клиент доволен, получила в отличном состоянии'
    }
  },
  {
    id: 'do-005',
    customer: {
      name: 'Кузнецов Андрей Викторович',
      phone: '+7 (916) 555-66-77',
      address: 'г. Москва, ул. Садовая, д. 12, офис 305',
      notes: 'Бизнес-центр "Садовый", 3 этаж, ресепшен'
    },
    package: {
      type: 'parcel',
      size: 'large',
      weight: 8.5,
      description: 'Офисная техника: принтер HP LaserJet, 2 коробки с бумагой',
      fragile: true,
      perishable: false,
      dimensions: {
        length: 50,
        width: 40,
        height: 30
      }
    },
    delivery: {
      fromAddress: 'г. Москва, ул. Орджоникидзе, д. 15, склад №2',
      toAddress: 'г. Москва, ул. Садовая, д. 12, офис 305',
      distance: 7.2,
      estimatedTime: 45,
      priority: 'standard',
      trafficConditions: 'severe'
    },
    payment: {
      amount: 650,
      currency: 'RUB',
      method: 'online',
      commission: 130,
      courierEarnings: 520,
      status: 'pending'
    },
    status: 'assigned',
    timeline: {
      created: '2024-06-19T10:15:00Z',
      assigned: '2024-06-19T10:20:00Z',
      estimated_delivery: '2024-06-19T11:30:00Z'
    },
    assignedCourier: 'cr-005',
    notes: 'Тяжелый груз, требуется тележка для разгрузки'
  }
];

const deliveryRequests: DeliveryRequest[] = [
  {
    id: 'dr-001',
    orderId: 'do-002',
    requestType: 'issue',
    description: 'Клиент не отвечает на звонки, доставка невозможна. Три попытки звонка, сообщения в WhatsApp не доставляются. Адрес подтвержден, но никто не открывает дверь.',
    urgency: 'medium',
    status: 'submitted',
    timeline: {
      submitted: '2024-06-19T10:15:00Z'
    },
    category: 'клиент недоступен'
  },
  {
    id: 'dr-002',
    orderId: 'do-001',
    requestType: 'support',
    description: 'Требуется замена курьера - текущий курьер попал в небольшую аварию, автомобиль требует ремонта. Нужно переназначить заказ на другого курьера с автомобилем.',
    urgency: 'high',
    status: 'reviewed',
    timeline: {
      submitted: '2024-06-19T10:00:00Z',
      reviewed: '2024-06-19T10:05:00Z'
    },
    category: 'замена курьера'
  },
  {
    id: 'dr-003',
    orderId: 'do-005',
    requestType: 'technical',
    description: 'Проблема с навигацией - приложение показывает неверный маршрут, ведет через закрытую на ремонт дорогу. Требуется актуальная информация о дорожной ситуации.',
    urgency: 'medium',
    status: 'in_progress',
    timeline: {
      submitted: '2024-06-19T09:45:00Z',
      reviewed: '2024-06-19T09:50:00Z',
      in_progress: '2024-06-19T10:00:00Z'
    },
    category: 'техническая проблема'
  },
  {
    id: 'dr-004',
    orderId: 'do-003',
    requestType: 'payment',
    description: 'Клиент хочет изменить способ оплаты с наличных на карту, так как нет достаточной суммы наличными. Требуется обновить информацию в системе.',
    urgency: 'low',
    status: 'resolved',
    timeline: {
      submitted: '2024-06-19T09:30:00Z',
      reviewed: '2024-06-19T09:35:00Z',
      in_progress: '2024-06-19T09:40:00Z',
      resolved: '2024-06-19T09:45:00Z'
    },
    category: 'изменение оплаты'
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

// Улучшенные утилиты форматирования
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(amount);
};

const formatDistance = (distance: number) => {
  return `${distance.toFixed(1)} км`;
};

const formatTimeMinutes = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} мин`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} ч ${mins} мин` : `${hours} ч`;
  }
};

// Улучшенный компонент Modal
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
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
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

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose, closeOnOverlayClick]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
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
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200 text-slate-400 hover:text-white hover:scale-110 active:scale-95"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

// Улучшенный компонент BentoCard
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

// Улучшенный StatusBadge
const StatusBadge = ({ status, type = 'default', animated = false, size = 'md' }: { 
  status: string; 
  type?: 'default' | 'courier' | 'order' | 'request';
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const getStatusConfig = () => {
    const baseConfig = {
      active: { color: COLORS.success, label: 'Активен', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      busy: { color: COLORS.orange, label: 'Занят', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      offline: { color: COLORS.slate, label: 'Оффлайн', bg: 'bg-slate-500/15', border: 'border-slate-500/30' },
      vacation: { color: COLORS.cyan, label: 'Отпуск', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' },
      sick_leave: { color: COLORS.purple, label: 'Больничный', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
      pending: { color: COLORS.blue, label: 'Ожидание', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      assigned: { color: COLORS.teal, label: 'Назначен', bg: 'bg-teal-500/15', border: 'border-teal-500/30' },
      picked_up: { color: COLORS.indigo, label: 'Забран', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' },
      in_transit: { color: COLORS.orange, label: 'В пути', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      delivered: { color: COLORS.success, label: 'Доставлен', bg: 'bg-green-500/15', border: 'border-green-500/30' },
      cancelled: { color: COLORS.error, label: 'Отменен', bg: 'bg-red-500/15', border: 'border-red-500/30' },
      failed: { color: COLORS.rose, label: 'Не удался', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
      submitted: { color: COLORS.blue, label: 'Подана', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      reviewed: { color: COLORS.teal, label: 'Рассмотрена', bg: 'bg-teal-500/15', border: 'border-teal-500/30' },
      in_progress: { color: COLORS.orange, label: 'В работе', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      resolved: { color: COLORS.success, label: 'Решена', bg: 'bg-green-500/15', border: 'border-green-500/30' },
      rejected: { color: COLORS.rose, label: 'Отклонена', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
      car: { color: COLORS.blue, label: 'Автомобиль', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      motorcycle: { color: COLORS.orange, label: 'Мотоцикл', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      bicycle: { color: COLORS.emerald, label: 'Велосипед', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      electric_scooter: { color: COLORS.purple, label: 'Электросамокат', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
      foot: { color: COLORS.slate, label: 'Пеший', bg: 'bg-slate-500/15', border: 'border-slate-500/30' },
      document: { color: COLORS.blue, label: 'Документы', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      food: { color: COLORS.orange, label: 'Еда', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      parcel: { color: COLORS.emerald, label: 'Посылка', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      electronics: { color: COLORS.purple, label: 'Электроника', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
      flowers: { color: COLORS.rose, label: 'Цветы', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
      other: { color: COLORS.slate, label: 'Другое', bg: 'bg-slate-500/15', border: 'border-slate-500/30' },
      standard: { color: COLORS.blue, label: 'Стандарт', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      express: { color: COLORS.orange, label: 'Экспресс', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      urgent: { color: COLORS.rose, label: 'Срочно', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
      small: { color: COLORS.success, label: 'Маленький', bg: 'bg-green-500/15', border: 'border-green-500/30' },
      medium: { color: COLORS.warning, label: 'Средний', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' },
      large: { color: COLORS.orange, label: 'Большой', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      xlarge: { color: COLORS.rose, label: 'Очень большой', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
      low: { color: COLORS.success, label: 'Низкий', bg: 'bg-green-500/15', border: 'border-green-500/30' },
      high: { color: COLORS.orange, label: 'Высокий', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      emergency: { color: COLORS.rose, label: 'Экстренный', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
      assignment: { color: COLORS.blue, label: 'Назначение', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      support: { color: COLORS.teal, label: 'Поддержка', bg: 'bg-teal-500/15', border: 'border-teal-500/30' },
      issue: { color: COLORS.orange, label: 'Проблема', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      payment: { color: COLORS.emerald, label: 'Оплата', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      technical: { color: COLORS.violet, label: 'Техническая', bg: 'bg-violet-500/15', border: 'border-violet-500/30' },
      complaint: { color: COLORS.rose, label: 'Жалоба', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
      clear: { color: COLORS.success, label: 'Свободно', bg: 'bg-green-500/15', border: 'border-green-500/30' },
      moderate: { color: COLORS.warning, label: 'Умеренно', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' },
      heavy: { color: COLORS.orange, label: 'Плотно', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
      severe: { color: COLORS.rose, label: 'Пробки', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
      pending: { color: COLORS.blue, label: 'Ожидание', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
      completed: { color: COLORS.success, label: 'Завершено', bg: 'bg-green-500/15', border: 'border-green-500/30' },
      refunded: { color: COLORS.slate, label: 'Возврат', bg: 'bg-slate-500/15', border: 'border-slate-500/30' }
    };

    return baseConfig[status as keyof typeof baseConfig] || { color: COLORS.slate, label: status, bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
  };

  const config = getStatusConfig();
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm'
  };

  return (
    <motion.span 
      className={`inline-flex items-center rounded-full font-medium border backdrop-blur-sm ${config.bg} ${config.border} ${sizeClasses[size]}`}
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

// Улучшенный ProgressBar
const ProgressBar = ({ value, max = 100, color = COLORS.teal, label, showValue = true, size = 'md', animated = true }: { 
  value: number; 
  max?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
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
          initial={{ width: animated ? 0 : `${percentage}%` }}
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
const StatCard = ({ title, value, change, icon, color = COLORS.teal, subtitle, onClick, trend, animationDelay = 0 }: {
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

// Улучшенный CourierCard
const CourierCard = ({ courier, onClick, animationDelay = 0 }: { courier: Courier; onClick?: () => void; animationDelay?: number }) => {
  const age = calculateAge(courier.personalInfo.birthDate);
  
  const getCourierColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'busy': return COLORS.orange;
      case 'offline': return COLORS.slate;
      case 'vacation': return COLORS.cyan;
      case 'sick_leave': return COLORS.purple;
      default: return COLORS.slate;
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'car': return '🚗';
      case 'motorcycle': return '🏍️';
      case 'bicycle': return '🚲';
      case 'electric_scooter': return '🛴';
      case 'foot': return '🚶';
      default: return '📦';
    }
  };

  return (
    <BentoCard 
      className="p-5" 
      glowColor={getCourierColor(courier.workInfo.status)} 
      onClick={onClick}
      animationDelay={animationDelay}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <motion.div 
            className="text-2xl"
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {courier.personalInfo.avatar || '👤'}
          </motion.div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{courier.personalInfo.fullName}</h4>
            <p className="text-slate-400 text-sm">
              {age} лет • {courier.workInfo.employmentType === 'full_time' ? 'Полная' : 
                         courier.workInfo.employmentType === 'part_time' ? 'Частичная' : 'Фриланс'}
            </p>
          </div>
        </div>
        <StatusBadge 
          status={courier.workInfo.status} 
          type="courier" 
          animated={courier.workInfo.status === 'active' || courier.workInfo.status === 'busy'} 
        />
      </div>
      
      <div className="space-y-3 text-sm mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Транспорт:</span>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getVehicleIcon(courier.vehicle.type)}</span>
            <StatusBadge status={courier.vehicle.type} size="sm" />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Рейтинг:</span>
          <div className="flex items-center space-x-1">
            <span className="text-amber-500">★</span>
            <span className="text-white font-medium">{courier.workInfo.rating}</span>
            <span className="text-slate-500">/5</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Заказов:</span>
          <span className="text-white font-medium">{courier.workInfo.completedOrders}</span>
        </div>

        {courier.location && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Скорость:</span>
            <span className="text-white font-medium">{courier.location.speed || 0} км/ч</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <div className="text-xs text-slate-400">
          {courier.workInfo.lastActivity ? `Активен: ${formatTime(courier.workInfo.lastActivity)}` : 'Неактивен'}
        </div>
        <div className="text-xs font-semibold text-emerald-500">
          {formatCurrency(courier.workInfo.totalEarnings)}
        </div>
      </div>
    </BentoCard>
  );
};

// Улучшенный OrderCard
const OrderCard = ({ order, onClick, animationDelay = 0 }: { order: DeliveryOrder; onClick?: () => void; animationDelay?: number }) => {
  const assignedCourier = order.assignedCourier ? 
    couriers.find(c => c.id === order.assignedCourier) : null;
  
  const getOrderColor = (status: string) => {
    switch (status) {
      case 'pending': return COLORS.blue;
      case 'assigned': return COLORS.teal;
      case 'picked_up': return COLORS.indigo;
      case 'in_transit': return COLORS.orange;
      case 'delivered': return COLORS.success;
      case 'cancelled': return COLORS.error;
      case 'failed': return COLORS.rose;
      default: return COLORS.slate;
    }
  };

  const getPackageIcon = (type: string) => {
    switch (type) {
      case 'food': return '🍔';
      case 'document': return '📄';
      case 'electronics': return '📱';
      case 'flowers': return '💐';
      case 'parcel': return '📦';
      default: return '🎁';
    }
  };

  return (
    <BentoCard 
      className="p-4" 
      glowColor={getOrderColor(order.status)} 
      onClick={onClick}
      animationDelay={animationDelay}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="text-xl">
            {getPackageIcon(order.package.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-white font-semibold text-sm mb-1 line-clamp-2">{order.package.description}</h5>
            <p className="text-slate-400 text-xs">{order.customer.name}</p>
          </div>
        </div>
        <StatusBadge status={order.status} type="order" animated={order.status === 'in_transit'} size="sm" />
      </div>
      
      <div className="space-y-2 text-xs mb-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Тип:</span>
          <StatusBadge status={order.package.type} size="sm" />
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Приоритет:</span>
          <StatusBadge status={order.delivery.priority} size="sm" />
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Расстояние:</span>
          <span className="text-white">{formatDistance(order.delivery.distance)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Время:</span>
          <span className="text-white">{formatTimeMinutes(order.delivery.estimatedTime)}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
        <div className="text-xs text-slate-400">
          {assignedCourier ? assignedCourier.personalInfo.fullName.split(' ')[0] : 'Не назначен'}
        </div>
        <div className="text-xs font-semibold text-amber-500">
          {formatCurrency(order.payment.courierEarnings)}
          {order.payment.tip && <span className="text-emerald-500 ml-1">+{formatCurrency(order.payment.tip)}</span>}
        </div>
      </div>
    </BentoCard>
  );
};

// Улучшенный RequestCard
const RequestCard = ({ request, onClick, animationDelay = 0 }: { request: DeliveryRequest; onClick?: () => void; animationDelay?: number }) => {
  const order = deliveryOrders.find(o => o.id === request.orderId);
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return COLORS.success;
      case 'medium': return COLORS.warning;
      case 'high': return COLORS.orange;
      case 'emergency': return COLORS.rose;
      default: return COLORS.slate;
    }
  };

  const getRequestIcon = (type: string) => {
    switch (type) {
      case 'issue': return '⚠️';
      case 'support': return '🛟';
      case 'technical': return '🔧';
      case 'payment': return '💳';
      case 'complaint': return '😠';
      default: return '📋';
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
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="text-xl">
            {getRequestIcon(request.requestType)}
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-white font-semibold text-sm mb-1 line-clamp-2">{request.description}</h5>
            <p className="text-slate-400 text-xs">
              {order?.customer.name} • Заказ {request.orderId}
            </p>
          </div>
        </div>
        <StatusBadge status={request.status} type="request" animated={request.status === 'submitted'} size="sm" />
      </div>
      
      <div className="space-y-2 text-xs mb-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Тип запроса:</span>
          <StatusBadge status={request.requestType} size="sm" />
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Срочность:</span>
          <StatusBadge status={request.urgency} size="sm" />
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-400">Подана:</span>
          <span className="text-white">{formatTime(request.timeline.submitted)}</span>
        </div>
      </div>
      
      {request.assignedTo && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <span className="text-xs text-slate-400">Назначен:</span>
          <span className="text-xs text-white font-medium">
            {couriers.find(c => c.id === request.assignedTo)?.personalInfo.fullName.split(' ')[0]}
          </span>
        </div>
      )}
    </BentoCard>
  );
};

// Новый компонент для метрик курьера
const CourierMetrics = ({ courier }: { courier: Courier }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-slate-700/50">
        <div className="text-2xl font-bold text-white mb-1">{courier.metrics.onTimeDelivery}%</div>
        <div className="text-xs text-slate-400">Своевременность</div>
      </div>
      <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-slate-700/50">
        <div className="text-2xl font-bold text-white mb-1">{courier.metrics.customerRating}</div>
        <div className="text-xs text-slate-400">Рейтинг</div>
      </div>
      <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-slate-700/50">
        <div className="text-2xl font-bold text-white mb-1">{courier.metrics.acceptanceRate}%</div>
        <div className="text-xs text-slate-400">Принятие</div>
      </div>
      <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-slate-700/50">
        <div className="text-2xl font-bold text-white mb-1">{courier.metrics.averageDeliveryTime}м</div>
        <div className="text-xs text-slate-400">Среднее время</div>
      </div>
    </div>
  );
};

// Новый компонент для timeline заказа
const OrderTimeline = ({ order }: { order: DeliveryOrder }) => {
  const timelineSteps = [
    { key: 'created', label: 'Создан', time: order.timeline.created },
    { key: 'assigned', label: 'Назначен', time: order.timeline.assigned },
    { key: 'picked_up', label: 'Забран', time: order.timeline.picked_up },
    { key: 'in_transit', label: 'В пути', time: order.timeline.in_transit },
    { key: 'delivered', label: 'Доставлен', time: order.timeline.delivered }
  ].filter(step => step.time);

  const currentStepIndex = timelineSteps.findIndex(step => step.time === order.timeline[order.status as keyof typeof order.timeline]);

  return (
    <div className="relative">
      <div className="flex justify-between mb-8">
        {timelineSteps.map((step, index) => (
          <div key={step.key} className="flex flex-col items-center flex-1">
            <motion.div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                index <= currentStepIndex 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-slate-700 text-slate-400'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {index + 1}
            </motion.div>
            <div className="text-xs text-center">
              <div className={`font-medium ${index <= currentStepIndex ? 'text-white' : 'text-slate-400'}`}>
                {step.label}
              </div>
              <div className="text-slate-500 mt-1">
                {formatTime(step.time!)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-700 -z-10">
        <motion.div 
          className="h-full bg-emerald-500"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </div>
  );
};

// Основной компонент дашборда
const CourierDashboard = () => {
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<DeliveryRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'couriers' | 'orders' | 'requests'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentTime = useClientTime();
  
  // Статистика для дашборда
  const stats = useMemo(() => {
    const totalCouriers = couriers.length;
    const activeCouriers = couriers.filter(c => c.workInfo.status === 'active' || c.workInfo.status === 'busy').length;
    const totalOrders = deliveryOrders.length;
    const pendingOrders = deliveryOrders.filter(o => o.status === 'pending' || o.status === 'assigned').length;
    const totalEarnings = couriers.reduce((acc, courier) => acc + courier.workInfo.totalEarnings, 0);
    const pendingRequests = deliveryRequests.filter(r => r.status === 'submitted' || r.status === 'reviewed').length;
    const todayEarnings = deliveryOrders
      .filter(o => o.status === 'delivered' && o.timeline.delivered?.includes('2024-06-19'))
      .reduce((acc, order) => acc + order.payment.courierEarnings, 0);
    
    return {
      totalCouriers,
      activeCouriers,
      totalOrders,
      pendingOrders,
      totalEarnings,
      pendingRequests,
      todayEarnings
    };
  }, []);

  // Фильтрация данных с поиском
  const filteredCouriers = useMemo(() => {
    if (!searchQuery) return couriers;
    return couriers.filter(courier =>
      courier.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courier.personalInfo.phone.includes(searchQuery) ||
      courier.vehicle.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return deliveryOrders;
    return deliveryOrders.filter(order =>
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.package.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredRequests = useMemo(() => {
    if (!searchQuery) return deliveryRequests;
    return deliveryRequests.filter(request =>
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const activeCouriers = useMemo(() => 
    filteredCouriers.filter(courier => courier.workInfo.status === 'active' || courier.workInfo.status === 'busy'), 
  [filteredCouriers]);
  
  const activeOrders = useMemo(() => 
    filteredOrders.filter(order => order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'failed'), 
  [filteredOrders]);
  
  const pendingRequests = useMemo(() => 
    filteredRequests.filter(request => request.status === 'submitted' || request.status === 'reviewed'), 
  [filteredRequests]);

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
              Курьерская служба
            </h1>
            <p className="text-slate-400 text-lg">Управление доставками и курьерами в реальном времени</p>
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
                placeholder="Поиск курьеров, заказов, запросов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent backdrop-blur-xl"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                🔍
              </div>
            </div>
          </div>
        </div>

        {/* Навигация */}
        <nav className="flex space-x-1 p-1 bg-slate-800/50 rounded-2xl backdrop-blur-xl border border-slate-700/50">
          {[
            { id: 'overview', label: 'Обзор', icon: '📊' },
            { id: 'couriers', label: 'Курьеры', icon: '🚴' },
            { id: 'orders', label: 'Заказы', icon: '📦' },
            { id: 'requests', label: 'Запросы', icon: '📋' }
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
                  title="Всего курьеров"
                  value={stats.totalCouriers}
                  change={2.5}
                  icon="🚴"
                  color={COLORS.blue}
                  subtitle={`${stats.activeCouriers} активных`}
                  trend="up"
                  animationDelay={0}
                />
                <StatCard
                  title="Активные заказы"
                  value={stats.pendingOrders}
                  change={1.2}
                  icon="📦"
                  color={COLORS.orange}
                  subtitle="ожидают доставки"
                  trend="up"
                  animationDelay={1}
                />
                <StatCard
                  title="Общий доход"
                  value={formatCurrency(stats.totalEarnings)}
                  change={5.8}
                  icon="💰"
                  color={COLORS.emerald}
                  subtitle="за все время"
                  trend="up"
                  animationDelay={2}
                />
                <StatCard
                  title="Ожидающие запросы"
                  value={stats.pendingRequests}
                  change={-1.8}
                  icon="📋"
                  color={COLORS.purple}
                  subtitle="требуют внимания"
                  trend="down"
                  animationDelay={3}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Активные курьеры */}
                <BentoCard className="p-6" glowColor={COLORS.purple}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Активные курьеры</h3>
                    <button 
                      className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200"
                      onClick={() => setActiveTab('couriers')}
                    >
                      Все →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {activeCouriers.slice(0, 4).map((courier, index) => (
                      <motion.div 
                        key={courier.id}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                        onClick={() => setSelectedCourier(courier)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="text-2xl">
                          {courier.personalInfo.avatar || '👤'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm truncate">{courier.personalInfo.fullName}</h4>
                          <p className="text-slate-400 text-xs">
                            {courier.vehicle.type} • {courier.workInfo.completedOrders} заказов
                          </p>
                        </div>
                        <StatusBadge status={courier.workInfo.status} type="courier" />
                      </motion.div>
                    ))}
                  </div>
                </BentoCard>

                {/* Активные заказы */}
                <BentoCard className="p-6" glowColor={COLORS.orange}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Активные заказы</h3>
                    <button 
                      className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200"
                      onClick={() => setActiveTab('orders')}
                    >
                      Все →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {activeOrders.slice(0, 4).map((order, index) => (
                      <motion.div 
                        key={order.id}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 4 }}
                      >
                        <div className={`text-xl ${
                          order.delivery.priority === 'urgent' ? 'text-rose-500' :
                          order.delivery.priority === 'express' ? 'text-orange-500' :
                          'text-slate-400'
                        }`}>
                          {order.package.type === 'food' ? '🍔' :
                           order.package.type === 'document' ? '📄' :
                           order.package.type === 'electronics' ? '📱' :
                           order.package.type === 'flowers' ? '💐' : '📦'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm line-clamp-2">{order.package.description}</h4>
                          <p className="text-slate-400 text-xs">
                            {order.customer.name} • {formatDistance(order.delivery.distance)}
                          </p>
                        </div>
                        <StatusBadge status={order.status} type="order" />
                      </motion.div>
                    ))}
                  </div>
                </BentoCard>
              </div>

              {/* Последние доставки и запросы */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Последние доставки */}
                <BentoCard className="p-6" glowColor={COLORS.blue}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Последние доставки</h3>
                    <button 
                      className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200"
                      onClick={() => setActiveTab('orders')}
                    >
                      Все →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deliveryOrders.filter(o => o.status === 'delivered').slice(0, 4).map((order, index) => (
                      <OrderCard 
                        key={order.id} 
                        order={order} 
                        onClick={() => setSelectedOrder(order)}
                        animationDelay={index}
                      />
                    ))}
                  </div>
                </BentoCard>

                {/* Активные запросы */}
                <BentoCard className="p-6" glowColor={COLORS.rose}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Активные запросы</h3>
                    <button 
                      className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200"
                      onClick={() => setActiveTab('requests')}
                    >
                      Все →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {pendingRequests.slice(0, 3).map((request, index) => (
                      <RequestCard 
                        key={request.id} 
                        request={request} 
                        onClick={() => setSelectedRequest(request)}
                        animationDelay={index}
                      />
                    ))}
                  </div>
                </BentoCard>
              </div>
            </motion.div>
          )}

          {activeTab === 'couriers' && (
            <motion.div
              key="couriers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Курьеры</h2>
                <p className="text-slate-400">Управление курьерами и их активностью</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCouriers.map((courier, index) => (
                  <CourierCard 
                    key={courier.id} 
                    courier={courier} 
                    onClick={() => setSelectedCourier(courier)}
                    animationDelay={index}
                  />
                ))}
              </div>

              {filteredCouriers.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚴</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Курьеры не найдены</h3>
                  <p className="text-slate-400">Попробуйте изменить параметры поиска</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Заказы на доставку</h2>
                <p className="text-slate-400">Управление заказами и отслеживание доставок</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((order, index) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onClick={() => setSelectedOrder(order)}
                    animationDelay={index}
                  />
                ))}
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Заказы не найдены</h3>
                  <p className="text-slate-400">Попробуйте изменить параметры поиска</p>
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
                <h2 className="text-2xl font-bold text-white mb-2">Запросы поддержки</h2>
                <p className="text-slate-400">Управление запросами от курьеров и клиентов</p>
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

              {filteredRequests.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Запросы не найдены</h3>
                  <p className="text-slate-400">Попробуйте изменить параметры поиска</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Модальные окна */}
      <Modal 
        isOpen={!!selectedCourier} 
        onClose={() => setSelectedCourier(null)}
        title={`Курьер: ${selectedCourier?.personalInfo.fullName}`}
        size="xl"
      >
        {selectedCourier && (
          <div className="space-y-6">
            {/* Основная информация */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-5xl">
                {selectedCourier.personalInfo.avatar || '👤'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedCourier.personalInfo.fullName}</h3>
                <p className="text-slate-400">
                  {calculateAge(selectedCourier.personalInfo.birthDate)} лет • 
                  {selectedCourier.workInfo.employmentType === 'full_time' ? ' Полная занятость' : 
                   selectedCourier.workInfo.employmentType === 'part_time' ? ' Частичная занятость' : ' Фриланс'}
                </p>
              </div>
            </div>

            <CourierMetrics courier={selectedCourier} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Персональная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Телефон:</span>
                    <span className="text-white">{selectedCourier.personalInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white">{selectedCourier.personalInfo.email || 'Не указан'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дата рождения:</span>
                    <span className="text-white">{formatDate(selectedCourier.personalInfo.birthDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ID номер:</span>
                    <span className="text-white">{selectedCourier.personalInfo.idNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Водительские права:</span>
                    <span className="text-white">{selectedCourier.personalInfo.driverLicense}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Транспортное средство</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип:</span>
                    <StatusBadge status={selectedCourier.vehicle.type} />
                  </div>
                  {selectedCourier.vehicle.model && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Модель:</span>
                      <span className="text-white">{selectedCourier.vehicle.model}</span>
                    </div>
                  )}
                  {selectedCourier.vehicle.licensePlate && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Номер:</span>
                      <span className="text-white">{selectedCourier.vehicle.licensePlate}</span>
                    </div>
                  )}
                  {selectedCourier.vehicle.color && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Цвет:</span>
                      <span className="text-white">{selectedCourier.vehicle.color}</span>
                    </div>
                  )}
                  {selectedCourier.vehicle.year && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Год:</span>
                      <span className="text-white">{selectedCourier.vehicle.year}</span>
                    </div>
                  )}
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.teal}>
                <h4 className="text-lg font-semibold text-white mb-4">Рабочая информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedCourier.workInfo.status} type="courier" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип занятости:</span>
                    <span className="text-white">
                      {selectedCourier.workInfo.employmentType === 'full_time' ? 'Полная занятость' :
                       selectedCourier.workInfo.employmentType === 'part_time' ? 'Частичная занятость' : 'Фриланс'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">График:</span>
                    <span className="text-white">{selectedCourier.workInfo.workSchedule.days.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Часы работы:</span>
                    <span className="text-white">{selectedCourier.workInfo.workSchedule.hours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Рейтинг:</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-amber-500">★</span>
                      <span className="text-white font-medium">{selectedCourier.workInfo.rating}</span>
                      <span className="text-slate-500">/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дата приема:</span>
                    <span className="text-white">{formatDate(selectedCourier.workInfo.joinDate)}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.orange}>
                <h4 className="text-lg font-semibold text-white mb-4">Финансы и метрики</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Завершено заказов:</span>
                    <span className="text-white">{selectedCourier.workInfo.completedOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Общий доход:</span>
                    <span className="text-white font-semibold">{formatCurrency(selectedCourier.workInfo.totalEarnings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Своевременность:</span>
                    <span className="text-white">{selectedCourier.metrics.onTimeDelivery}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Рейтинг клиентов:</span>
                    <span className="text-white">{selectedCourier.metrics.customerRating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Процент принятия:</span>
                    <span className="text-white">{selectedCourier.metrics.acceptanceRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Среднее время доставки:</span>
                    <span className="text-white">{selectedCourier.metrics.averageDeliveryTime} мин</span>
                  </div>
                </div>
              </BentoCard>
            </div>

            {selectedCourier.location && (
              <BentoCard className="p-6" glowColor={COLORS.emerald}>
                <h4 className="text-lg font-semibold text-white mb-4">Текущее местоположение</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Адрес:</span>
                    <span className="text-white text-right">{selectedCourier.location.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Последнее обновление:</span>
                    <span className="text-white">{formatTime(selectedCourier.location.lastUpdate)}</span>
                  </div>
                  {selectedCourier.location.speed !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Скорость:</span>
                      <span className="text-white">{selectedCourier.location.speed} км/ч</span>
                    </div>
                  )}
                  {selectedCourier.location.battery !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Заряд батареи:</span>
                      <span className="text-white">{selectedCourier.location.battery}%</span>
                    </div>
                  )}
                </div>
              </BentoCard>
            )}

            {selectedCourier.skills && selectedCourier.skills.length > 0 && (
              <BentoCard className="p-6" glowColor={COLORS.violet}>
                <h4 className="text-lg font-semibold text-white mb-4">Навыки и сертификаты</h4>
                <div className="space-y-3">
                  <div>
                    <h5 className="text-slate-300 text-sm font-medium mb-2">Навыки:</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedCourier.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-xs text-slate-300 border border-slate-600/50">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedCourier.certifications && selectedCourier.certifications.length > 0 && (
                    <div>
                      <h5 className="text-slate-300 text-sm font-medium mb-2">Сертификаты:</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedCourier.certifications.map((cert, index) => (
                          <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-xs text-slate-300 border border-slate-600/50">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </BentoCard>
            )}

            {selectedCourier.currentOrder && (
              <BentoCard className="p-6" glowColor={COLORS.rose}>
                <h4 className="text-lg font-semibold text-white mb-4">Текущий заказ</h4>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Номер заказа:</span>
                  <span className="text-white font-semibold">{selectedCourier.currentOrder}</span>
                </div>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)}
        title={`Заказ #${selectedOrder?.id}`}
        size="xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Timeline */}
            <BentoCard className="p-6" glowColor={COLORS.indigo}>
              <h4 className="text-lg font-semibold text-white mb-4">Статус доставки</h4>
              <OrderTimeline order={selectedOrder} />
            </BentoCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Информация о клиенте</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Имя:</span>
                    <span className="text-white">{selectedOrder.customer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Телефон:</span>
                    <span className="text-white">{selectedOrder.customer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Адрес доставки:</span>
                    <span className="text-white text-right">{selectedOrder.customer.address}</span>
                  </div>
                  {selectedOrder.customer.notes && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Примечания:</span>
                      <span className="text-white text-right">{selectedOrder.customer.notes}</span>
                    </div>
                  )}
                  {selectedOrder.customer.preferredContact && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Предпочтительный контакт:</span>
                      <span className="text-white">
                        {selectedOrder.customer.preferredContact === 'phone' ? 'Телефон' :
                         selectedOrder.customer.preferredContact === 'sms' ? 'SMS' : 'WhatsApp'}
                      </span>
                    </div>
                  )}
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Информация о посылке</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип:</span>
                    <StatusBadge status={selectedOrder.package.type} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Размер:</span>
                    <StatusBadge status={selectedOrder.package.size} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Вес:</span>
                    <span className="text-white">{selectedOrder.package.weight} кг</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Описание:</span>
                    <span className="text-white text-right">{selectedOrder.package.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Хрупкое:</span>
                    <span className="text-white">{selectedOrder.package.fragile ? 'Да' : 'Нет'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Скоропортящееся:</span>
                    <span className="text-white">{selectedOrder.package.perishable ? 'Да' : 'Нет'}</span>
                  </div>
                  {selectedOrder.package.specialInstructions && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Особые указания:</span>
                      <span className="text-white text-right">{selectedOrder.package.specialInstructions}</span>
                    </div>
                  )}
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.teal}>
                <h4 className="text-lg font-semibold text-white mb-4">Информация о доставке</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">От адреса:</span>
                    <span className="text-white text-right">{selectedOrder.delivery.fromAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">К адресу:</span>
                    <span className="text-white text-right">{selectedOrder.delivery.toAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Расстояние:</span>
                    <span className="text-white">{formatDistance(selectedOrder.delivery.distance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Примерное время:</span>
                    <span className="text-white">{formatTimeMinutes(selectedOrder.delivery.estimatedTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Приоритет:</span>
                    <StatusBadge status={selectedOrder.delivery.priority} />
                  </div>
                  {selectedOrder.delivery.trafficConditions && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Дорожная ситуация:</span>
                      <StatusBadge status={selectedOrder.delivery.trafficConditions} />
                    </div>
                  )}
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.orange}>
                <h4 className="text-lg font-semibold text-white mb-4">Финансовая информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Стоимость доставки:</span>
                    <span className="text-white font-semibold">{formatCurrency(selectedOrder.payment.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Комиссия сервиса:</span>
                    <span className="text-white">{formatCurrency(selectedOrder.payment.commission)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Заработок курьера:</span>
                    <span className="text-white font-semibold text-emerald-500">{formatCurrency(selectedOrder.payment.courierEarnings)}</span>
                  </div>
                  {selectedOrder.payment.tip && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Чаевые:</span>
                      <span className="text-white font-semibold text-amber-500">{formatCurrency(selectedOrder.payment.tip)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Способ оплаты:</span>
                    <span className="text-white">
                      {selectedOrder.payment.method === 'cash' ? 'Наличные' :
                       selectedOrder.payment.method === 'card' ? 'Карта' : 'Онлайн'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус оплаты:</span>
                    <StatusBadge status={selectedOrder.payment.status} />
                  </div>
                </div>
              </BentoCard>
            </div>

            {selectedOrder.assignedCourier && (
              <BentoCard className="p-6" glowColor={COLORS.emerald}>
                <h4 className="text-lg font-semibold text-white mb-4">Назначенный курьер</h4>
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">
                    {couriers.find(c => c.id === selectedOrder.assignedCourier)?.personalInfo.avatar || '👤'}
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">
                      {couriers.find(c => c.id === selectedOrder.assignedCourier)?.personalInfo.fullName}
                    </h5>
                    <p className="text-slate-400 text-sm">
                      {couriers.find(c => c.id === selectedOrder.assignedCourier)?.vehicle.type} • 
                      Рейтинг {couriers.find(c => c.id === selectedOrder.assignedCourier)?.workInfo.rating}
                    </p>
                  </div>
                </div>
              </BentoCard>
            )}

            {selectedOrder.notes && (
              <BentoCard className="p-6" glowColor={COLORS.rose}>
                <h4 className="text-lg font-semibold text-white mb-4">Примечания</h4>
                <p className="text-slate-300 text-sm">{selectedOrder.notes}</p>
              </BentoCard>
            )}

            {selectedOrder.proofOfDelivery && (
              <BentoCard className="p-6" glowColor={COLORS.violet}>
                <h4 className="text-lg font-semibold text-white mb-4">Подтверждение доставки</h4>
                <div className="space-y-3 text-sm">
                  {selectedOrder.proofOfDelivery.signature && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Подпись:</span>
                      <span className="text-white">{selectedOrder.proofOfDelivery.signature}</span>
                    </div>
                  )}
                  {selectedOrder.proofOfDelivery.notes && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Примечания:</span>
                      <span className="text-white text-right">{selectedOrder.proofOfDelivery.notes}</span>
                    </div>
                  )}
                </div>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!selectedRequest} 
        onClose={() => setSelectedRequest(null)}
        title="Запрос поддержки"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Информация о запросе</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип запроса:</span>
                    <StatusBadge status={selectedRequest.requestType} />
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
                    <span className="text-slate-400">Связанный заказ:</span>
                    <span className="text-white">{selectedRequest.orderId}</span>
                  </div>
                  {selectedRequest.category && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Категория:</span>
                      <span className="text-white">{selectedRequest.category}</span>
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
                  {selectedRequest.timeline.in_progress && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">В работе:</span>
                      <span className="text-white">{formatDateTime(selectedRequest.timeline.in_progress)}</span>
                    </div>
                  )}
                  {selectedRequest.timeline.resolved && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Решена:</span>
                      <span className="text-white">{formatDateTime(selectedRequest.timeline.resolved)}</span>
                    </div>
                  )}
                  {selectedRequest.timeline.rejected && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Отклонена:</span>
                      <span className="text-white">{formatDateTime(selectedRequest.timeline.rejected)}</span>
                    </div>
                  )}
                </div>
              </BentoCard>
            </div>

            <BentoCard className="p-6" glowColor={COLORS.teal}>
              <h4 className="text-lg font-semibold text-white mb-4">Описание запроса</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{selectedRequest.description}</p>
            </BentoCard>

            {selectedRequest.assignedTo && (
              <BentoCard className="p-6" glowColor={COLORS.orange}>
                <h4 className="text-lg font-semibold text-white mb-4">Ответственный</h4>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">
                    {couriers.find(c => c.id === selectedRequest.assignedTo)?.personalInfo.avatar || '👤'}
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">
                      {couriers.find(c => c.id === selectedRequest.assignedTo)?.personalInfo.fullName}
                    </h5>
                    <p className="text-slate-400 text-sm">
                      Курьер
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

export default CourierDashboard;