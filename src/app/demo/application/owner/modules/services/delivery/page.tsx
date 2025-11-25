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

// Типы данных для службы доставки
interface DeliveryService {
  id: string;
  name: string;
  category: 'food' | 'parcel' | 'express' | 'grocery' | 'document' | 'pharmacy' | 'international';
  description: string;
  status: 'active' | 'development' | 'paused' | 'closed';
  deliveryTypes: string[];
  deliveryTime: {
    min: number;
    max: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  price: {
    base: number;
    currency: 'RUB' | 'USD' | 'EUR';
    perKm?: number;
    weightLimit: number;
    sizeLimit: string;
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

interface Customer {
  id: string;
  name: string;
  contact: {
    phone: string;
    email?: string;
    address: string;
  };
  preferences: {
    deliveryTime: string[];
    contactMethod: 'phone' | 'email' | 'sms';
    notes?: string;
  };
  orderHistory: Order[];
  loyalty: {
    points: number;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    discount: number;
  };
  status: 'active' | 'inactive' | 'blocked';
  lastOrder?: string;
  totalOrders: number;
}

interface Order {
  id: string;
  customerId: string;
  serviceId: string;
  courierId?: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'in_transit' | 'delivered' | 'cancelled' | 'returned';
  timeline: {
    created: string;
    confirmed?: string;
    preparing?: string;
    pickedUp?: string;
    inTransit?: string;
    delivered?: string;
  };
  delivery: {
    from: string;
    to: string;
    distance: number;
    estimatedTime: string;
    actualTime?: string;
  };
  payment: {
    amount: number;
    method: 'cash' | 'card' | 'online' | 'wallet';
    status: 'pending' | 'paid' | 'refunded';
    tip?: number;
  };
  notes?: string;
  rating?: number;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  weight?: number;
  dimensions?: string;
  fragile: boolean;
}

interface Courier {
  id: string;
  name: string;
  contact: {
    phone: string;
    email: string;
  };
  vehicle: {
    type: 'bicycle' | 'scooter' | 'motorcycle' | 'car' | 'truck';
    model: string;
    licensePlate?: string;
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

interface Vehicle {
  id: string;
  name: string;
  type: 'bicycle' | 'scooter' | 'motorcycle' | 'car' | 'truck' | 'van';
  manufacturer: string;
  model: string;
  status: 'operational' | 'maintenance' | 'out_of_service' | 'charging';
  specifications: {
    maxWeight: number;
    maxSize: string;
    fuelType: 'electric' | 'petrol' | 'diesel';
    range: number;
  };
  lastMaintenance: string;
  nextMaintenance: string;
  location: string;
  utilization: number;
  currentCourier?: string;
}

// Моки данных для службы доставки
const deliveryServices: DeliveryService[] = [
  {
    id: 'ds-001',
    name: 'Экспресс-доставка еды',
    category: 'food',
    description: 'Быстрая доставка горячих блюд из ресторанов и кафе в течение 30 минут',
    status: 'active',
    deliveryTypes: ['Горячие блюда', 'Напитки', 'Десерты'],
    deliveryTime: {
      min: 25,
      max: 45,
      unit: 'minutes'
    },
    price: {
      base: 149,
      currency: 'RUB',
      perKm: 15,
      weightLimit: 5,
      sizeLimit: '30x30x30 см'
    },
    requirements: ['Минимальный заказ 300 руб', 'Предоплата онлайн'],
    coverage: {
      areas: ['Центр', 'Север', 'Юг', 'Запад', 'Восток'],
      radius: 10,
      international: false
    },
    vehicles: ['Скутер', 'Мотоцикл', 'Велосипед'],
    staffRequired: ['Курьер', 'Оператор'],
    metrics: {
      satisfaction: 94,
      onTimeRate: 92,
      successRate: 98
    },
    capacity: 100,
    currentOrders: 78
  },
  {
    id: 'ds-002',
    name: 'Курьерская доставка посылок',
    category: 'parcel',
    description: 'Надежная доставка посылок и документов по городу в течение дня',
    status: 'active',
    deliveryTypes: ['Документы', 'Посылки', 'Мелкие грузы'],
    deliveryTime: {
      min: 2,
      max: 6,
      unit: 'hours'
    },
    price: {
      base: 299,
      currency: 'RUB',
      perKm: 20,
      weightLimit: 20,
      sizeLimit: '50x50x50 см'
    },
    requirements: ['Упаковка', 'Опись вложения'],
    coverage: {
      areas: ['Весь город', 'Пригород'],
      radius: 50,
      international: false
    },
    vehicles: ['Автомобиль', 'Мотоцикл'],
    staffRequired: ['Курьер', 'Логист'],
    metrics: {
      satisfaction: 89,
      onTimeRate: 88,
      successRate: 95
    },
    capacity: 200,
    currentOrders: 145
  },
  {
    id: 'ds-003',
    name: 'Доставка продуктов',
    category: 'grocery',
    description: 'Доставка свежих продуктов из супермаркетов и рынков',
    status: 'active',
    deliveryTypes: ['Продукты', 'Напитки', 'Хозтовары'],
    deliveryTime: {
      min: 1,
      max: 3,
      unit: 'hours'
    },
    price: {
      base: 199,
      currency: 'RUB',
      perKm: 12,
      weightLimit: 15,
      sizeLimit: '40x40x40 см'
    },
    requirements: ['Минимальный заказ 500 руб', 'Температурный контроль'],
    coverage: {
      areas: ['Центр', 'Север', 'Юг', 'Запад', 'Восток'],
      radius: 15,
      international: false
    },
    vehicles: ['Автомобиль', 'Скутер'],
    staffRequired: ['Курьер', 'Сборщик заказов'],
    metrics: {
      satisfaction: 91,
      onTimeRate: 90,
      successRate: 96
    },
    capacity: 150,
    currentOrders: 112
  },
  {
    id: 'ds-004',
    name: 'Срочная доставка документов',
    category: 'express',
    description: 'Срочная доставка важных документов и корреспонденции',
    status: 'active',
    deliveryTypes: ['Документы', 'Корреспонденция', 'Ценные бумаги'],
    deliveryTime: {
      min: 1,
      max: 2,
      unit: 'hours'
    },
    price: {
      base: 499,
      currency: 'RUB',
      weightLimit: 2,
      sizeLimit: 'А4 конверт'
    },
    requirements: ['Удостоверение личности', 'Подпись получателя'],
    coverage: {
      areas: ['Центр', 'Деловые районы'],
      radius: 20,
      international: false
    },
    vehicles: ['Мотоцикл', 'Скутер'],
    staffRequired: ['Курьер'],
    metrics: {
      satisfaction: 96,
      onTimeRate: 95,
      successRate: 99
    },
    capacity: 50,
    currentOrders: 32
  },
  {
    id: 'ds-005',
    name: 'Международная доставка',
    category: 'international',
    description: 'Международная доставка посылок и документов по всему миру',
    status: 'active',
    deliveryTypes: ['Посылки', 'Документы', 'Товары'],
    deliveryTime: {
      min: 3,
      max: 14,
      unit: 'days'
    },
    price: {
      base: 2500,
      currency: 'RUB',
      weightLimit: 30,
      sizeLimit: '100x100x100 см'
    },
    requirements: ['Таможенные документы', 'Страховка'],
    coverage: {
      areas: ['Европа', 'Азия', 'Америка'],
      radius: 0,
      international: true
    },
    vehicles: ['Авиа', 'Наземный транспорт'],
    staffRequired: ['Логист', 'Таможенный брокер'],
    metrics: {
      satisfaction: 87,
      onTimeRate: 85,
      successRate: 92
    },
    capacity: 80,
    currentOrders: 45
  },
  {
    id: 'ds-006',
    name: 'Доставка лекарств',
    category: 'pharmacy',
    description: 'Быстрая доставка лекарств и медицинских товаров из аптек',
    status: 'development',
    deliveryTypes: ['Лекарства', 'Медтовары', 'Витамины'],
    deliveryTime: {
      min: 45,
      max: 90,
      unit: 'minutes'
    },
    price: {
      base: 179,
      currency: 'RUB',
      weightLimit: 3,
      sizeLimit: '25x25x25 см'
    },
    requirements: ['Рецепт врача', 'Возрастное ограничение'],
    coverage: {
      areas: ['Центр', 'Север', 'Юг'],
      radius: 8,
      international: false
    },
    vehicles: ['Велосипед', 'Скутер'],
    staffRequired: ['Курьер'],
    metrics: {
      satisfaction: 0,
      onTimeRate: 0,
      successRate: 0
    },
    capacity: 60,
    currentOrders: 0
  },
  {
    id: 'ds-007',
    name: 'Ночная доставка',
    category: 'express',
    description: 'Доставка заказов в ночное время с 22:00 до 06:00',
    status: 'active',
    deliveryTypes: ['Еда', 'Продукты', 'Товары'],
    deliveryTime: {
      min: 40,
      max: 60,
      unit: 'minutes'
    },
    price: {
      base: 349,
      currency: 'RUB',
      perKm: 25,
      weightLimit: 10,
      sizeLimit: '35x35x35 см'
    },
    requirements: ['Предоплата', 'Подтверждение за 30 мин'],
    coverage: {
      areas: ['Центр', 'Основные районы'],
      radius: 12,
      international: false
    },
    vehicles: ['Автомобиль', 'Мотоцикл'],
    staffRequired: ['Курьер', 'Оператор'],
    metrics: {
      satisfaction: 88,
      onTimeRate: 86,
      successRate: 94
    },
    capacity: 40,
    currentOrders: 28
  },
  {
    id: 'ds-008',
    name: 'Эко-доставка',
    category: 'food',
    description: 'Доставка еды на электротранспорте с эко-упаковкой',
    status: 'active',
    deliveryTypes: ['Здоровая еда', 'Веганские блюда', 'Органик продукты'],
    deliveryTime: {
      min: 35,
      max: 55,
      unit: 'minutes'
    },
    price: {
      base: 189,
      currency: 'RUB',
      perKm: 18,
      weightLimit: 6,
      sizeLimit: '30x30x30 см'
    },
    requirements: ['Минимальный заказ 400 руб'],
    coverage: {
      areas: ['Центр', 'Эко-районы'],
      radius: 8,
      international: false
    },
    vehicles: ['Электровелосипед', 'Электроскутер'],
    staffRequired: ['Курьер'],
    metrics: {
      satisfaction: 93,
      onTimeRate: 91,
      successRate: 97
    },
    capacity: 70,
    currentOrders: 52
  }
];

const customers: Customer[] = [
  {
    id: 'cust-001',
    name: 'Иванов Сергей Петрович',
    contact: {
      phone: '+7 (916) 123-45-67',
      email: 's.ivanov@mail.ru',
      address: 'г. Москва, ул. Ленина, д. 15, кв. 34'
    },
    preferences: {
      deliveryTime: ['18:00-20:00', '12:00-14:00'],
      contactMethod: 'phone',
      notes: 'Звонить за 10 минут до доставки'
    },
    orderHistory: [
      {
        id: 'order-001',
        customerId: 'cust-001',
        serviceId: 'ds-001',
        courierId: 'cour-001',
        items: [
          {
            id: 'item-001',
            name: 'Пицца Маргарита',
            quantity: 1,
            price: 450,
            weight: 0.8,
            fragile: false
          },
          {
            id: 'item-002',
            name: 'Кола 0.5л',
            quantity: 2,
            price: 120,
            weight: 1.0,
            fragile: false
          }
        ],
        status: 'delivered',
        timeline: {
          created: '2024-06-15T18:30:00Z',
          confirmed: '2024-06-15T18:32:00Z',
          preparing: '2024-06-15T18:35:00Z',
          pickedUp: '2024-06-15T18:50:00Z',
          inTransit: '2024-06-15T18:51:00Z',
          delivered: '2024-06-15T19:05:00Z'
        },
        delivery: {
          from: 'Пиццерия "Италия", ул. Пушкина, 10',
          to: 'г. Москва, ул. Ленина, д. 15, кв. 34',
          distance: 3.2,
          estimatedTime: '19:15',
          actualTime: '19:05'
        },
        payment: {
          amount: 690,
          method: 'online',
          status: 'paid',
          tip: 50
        },
        rating: 5
      }
    ],
    loyalty: {
      points: 1250,
      tier: 'gold',
      discount: 10
    },
    status: 'active',
    lastOrder: '2024-06-15',
    totalOrders: 15
  },
  {
    id: 'cust-002',
    name: 'Петрова Анна Владимировна',
    contact: {
      phone: '+7 (925) 345-67-89',
      email: 'a.petrova@gmail.com',
      address: 'г. Москва, пр. Мира, д. 125, кв. 12'
    },
    preferences: {
      deliveryTime: ['19:00-21:00', '13:00-15:00'],
      contactMethod: 'email',
      notes: 'Оставлять у двери'
    },
    orderHistory: [
      {
        id: 'order-002',
        customerId: 'cust-002',
        serviceId: 'ds-003',
        courierId: 'cour-003',
        items: [
          {
            id: 'item-003',
            name: 'Молоко 3.2%',
            quantity: 1,
            price: 85,
            weight: 1.0,
            fragile: true
          },
          {
            id: 'item-004',
            name: 'Хлеб бородинский',
            quantity: 1,
            price: 45,
            weight: 0.5,
            fragile: true
          }
        ],
        status: 'delivered',
        timeline: {
          created: '2024-06-10T14:00:00Z',
          confirmed: '2024-06-10T14:02:00Z',
          preparing: '2024-06-10T14:05:00Z',
          pickedUp: '2024-06-10T14:30:00Z',
          inTransit: '2024-06-10T14:31:00Z',
          delivered: '2024-06-10T15:10:00Z'
        },
        delivery: {
          from: 'Супермаркет "ВкусВилл", пр. Мира, 100',
          to: 'г. Москва, пр. Мира, д. 125, кв. 12',
          distance: 2.1,
          estimatedTime: '15:15',
          actualTime: '15:10'
        },
        payment: {
          amount: 130,
          method: 'card',
          status: 'paid'
        },
        rating: 4
      }
    ],
    loyalty: {
      points: 780,
      tier: 'silver',
      discount: 5
    },
    status: 'active',
    lastOrder: '2024-06-10',
    totalOrders: 8
  },
  {
    id: 'cust-003',
    name: 'Сидоров Дмитрий Николаевич',
    contact: {
      phone: '+7 (916) 456-78-90',
      address: 'г. Москва, ул. Пушкина, д. 67, кв. 45'
    },
    preferences: {
      deliveryTime: ['09:00-12:00', '14:00-18:00'],
      contactMethod: 'sms'
    },
    orderHistory: [
      {
        id: 'order-003',
        customerId: 'cust-003',
        serviceId: 'ds-002',
        courierId: 'cour-002',
        items: [
          {
            id: 'item-005',
            name: 'Документы',
            quantity: 1,
            price: 0,
            weight: 0.2,
            fragile: false
          }
        ],
        status: 'in_transit',
        timeline: {
          created: '2024-06-18T09:00:00Z',
          confirmed: '2024-06-18T09:05:00Z',
          preparing: '2024-06-18T09:10:00Z',
          pickedUp: '2024-06-18T09:30:00Z',
          inTransit: '2024-06-18T09:31:00Z'
        },
        delivery: {
          from: 'Офис Сидорова Д.Н., ул. Тверская, 25',
          to: 'Банк "ВТБ", ул. Новый Арбат, 15',
          distance: 4.5,
          estimatedTime: '10:30'
        },
        payment: {
          amount: 350,
          method: 'cash',
          status: 'pending'
        },
        notes: 'Срочные документы для подписания'
      }
    ],
    loyalty: {
      points: 350,
      tier: 'bronze',
      discount: 2
    },
    status: 'active',
    lastOrder: '2024-06-18',
    totalOrders: 3
  },
  {
    id: 'cust-004',
    name: 'Козлова Елена Викторовна',
    contact: {
      phone: '+7 (495) 567-89-01',
      email: 'e.kozlova@mail.ru',
      address: 'г. Москва, ул. Гагарина, д. 34, кв. 78'
    },
    preferences: {
      deliveryTime: ['17:00-19:00'],
      contactMethod: 'phone'
    },
    orderHistory: [],
    loyalty: {
      points: 0,
      tier: 'bronze',
      discount: 0
    },
    status: 'inactive',
    totalOrders: 0
  },
  {
    id: 'cust-005',
    name: 'Николаев Олег Сергеевич',
    contact: {
      phone: '+7 (916) 789-01-23',
      email: 'o.nikolaev@gmail.com',
      address: 'г. Москва, ул. Тверская, д. 25, кв. 67'
    },
    preferences: {
      deliveryTime: ['12:00-14:00', '19:00-21:00'],
      contactMethod: 'email',
      notes: 'Только бесконтактная доставка'
    },
    orderHistory: [
      {
        id: 'order-004',
        customerId: 'cust-005',
        serviceId: 'ds-005',
        items: [
          {
            id: 'item-006',
            name: 'Подарочный набор',
            quantity: 1,
            price: 2500,
            weight: 2.5,
            dimensions: '25x25x15 см',
            fragile: true
          }
        ],
        status: 'preparing',
        timeline: {
          created: '2024-06-12T10:00:00Z',
          confirmed: '2024-06-12T10:15:00Z',
          preparing: '2024-06-12T10:20:00Z'
        },
        delivery: {
          from: 'Магазин подарков, ул. Арбат, 35',
          to: 'г. Берлин, ул. Хауптштрассе, 123',
          distance: 1600,
          estimatedTime: '2024-06-20'
        },
        payment: {
          amount: 5200,
          method: 'online',
          status: 'paid'
        },
        notes: 'Хрупкий предмет, требует осторожной перевозки'
      }
    ],
    loyalty: {
      points: 2100,
      tier: 'platinum',
      discount: 15
    },
    status: 'active',
    lastOrder: '2024-06-12',
    totalOrders: 25
  }
];

const couriers: Courier[] = [
  {
    id: 'cour-001',
    name: 'Александр Иванов',
    contact: {
      phone: '+7 (916) 111-22-33',
      email: 'a.ivanov@delivery.ru'
    },
    vehicle: {
      type: 'scooter',
      model: 'Yamaha NMAX',
      licensePlate: 'A123BC777'
    },
    status: 'on_delivery',
    currentLocation: {
      lat: 55.7558,
      lng: 37.6173,
      address: 'ул. Тверская, 15'
    },
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      hours: '10:00-22:00'
    },
    ratings: {
      average: 4.9,
      count: 145,
      lastMonth: 4.8
    },
    metrics: {
      completedOrders: 892,
      onTimeRate: 95,
      distanceCovered: 12500
    },
    currentOrders: ['order-001'],
    maxOrders: 3
  },
  {
    id: 'cour-002',
    name: 'Мария Петрова',
    contact: {
      phone: '+7 (925) 222-33-44',
      email: 'm.petrova@delivery.ru'
    },
    vehicle: {
      type: 'car',
      model: 'Kia Rio',
      licensePlate: 'B456DE777'
    },
    status: 'active',
    currentLocation: {
      lat: 55.7602,
      lng: 37.6185,
      address: 'ул. Большая Дмитровка, 10'
    },
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      hours: '08:00-20:00'
    },
    ratings: {
      average: 4.8,
      count: 203,
      lastMonth: 4.9
    },
    metrics: {
      completedOrders: 1256,
      onTimeRate: 93,
      distanceCovered: 18700
    },
    currentOrders: ['order-003'],
    maxOrders: 5
  },
  {
    id: 'cour-003',
    name: 'Дмитрий Ковалев',
    contact: {
      phone: '+7 (916) 333-44-55',
      email: 'd.kovalev@delivery.ru'
    },
    vehicle: {
      type: 'bicycle',
      model: 'Stels Navigator'
    },
    status: 'break',
    schedule: {
      days: ['Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      hours: '12:00-21:00'
    },
    ratings: {
      average: 4.7,
      count: 78,
      lastMonth: 4.6
    },
    metrics: {
      completedOrders: 345,
      onTimeRate: 90,
      distanceCovered: 2800
    },
    currentOrders: [],
    maxOrders: 2
  },
  {
    id: 'cour-004',
    name: 'Ольга Сидорова',
    contact: {
      phone: '+7 (925) 444-55-66',
      email: 'o.sidorova@delivery.ru'
    },
    vehicle: {
      type: 'motorcycle',
      model: 'Honda CB500X',
      licensePlate: 'C789FG777'
    },
    status: 'offline',
    schedule: {
      days: ['Пн', 'Ср', 'Пт', 'Сб', 'Вс'],
      hours: '14:00-23:00'
    },
    ratings: {
      average: 4.9,
      count: 167,
      lastMonth: 4.8
    },
    metrics: {
      completedOrders: 678,
      onTimeRate: 96,
      distanceCovered: 8900
    },
    currentOrders: [],
    maxOrders: 4
  },
  {
    id: 'cour-005',
    name: 'Сергей Николаев',
    contact: {
      phone: '+7 (916) 555-66-77',
      email: 's.nikolaev@delivery.ru'
    },
    vehicle: {
      type: 'scooter',
      model: 'Xiaomi Mi Electric Scooter'
    },
    status: 'active',
    currentLocation: {
      lat: 55.7517,
      lng: 37.6178,
      address: 'Красная площадь, 1'
    },
    schedule: {
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
      hours: '09:00-18:00'
    },
    ratings: {
      average: 4.6,
      count: 92,
      lastMonth: 4.7
    },
    metrics: {
      completedOrders: 234,
      onTimeRate: 88,
      distanceCovered: 1500
    },
    currentOrders: [],
    maxOrders: 2
  }
];

const vehicles: Vehicle[] = [
  {
    id: 'veh-001',
    name: 'Скутер Yamaha',
    type: 'scooter',
    manufacturer: 'Yamaha',
    model: 'NMAX 125',
    status: 'operational',
    specifications: {
      maxWeight: 5,
      maxSize: '40x40x40 см',
      fuelType: 'petrol',
      range: 250
    },
    lastMaintenance: '2024-05-15',
    nextMaintenance: '2024-07-15',
    location: 'Гараж №1',
    utilization: 85,
    currentCourier: 'cour-001'
  },
  {
    id: 'veh-002',
    name: 'Легковой автомобиль',
    type: 'car',
    manufacturer: 'Kia',
    model: 'Rio',
    status: 'operational',
    specifications: {
      maxWeight: 20,
      maxSize: '120x80x60 см',
      fuelType: 'petrol',
      range: 600
    },
    lastMaintenance: '2024-06-01',
    nextMaintenance: '2024-08-01',
    location: 'Парковка офиса',
    utilization: 75,
    currentCourier: 'cour-002'
  },
  {
    id: 'veh-003',
    name: 'Грузовой велосипед',
    type: 'bicycle',
    manufacturer: 'Stels',
    model: 'Navigator 500',
    status: 'maintenance',
    specifications: {
      maxWeight: 10,
      maxSize: '60x40x30 см',
      fuelType: 'electric',
      range: 80
    },
    lastMaintenance: '2024-04-10',
    nextMaintenance: '2024-07-10',
    location: 'Ремонтная мастерская',
    utilization: 65
  },
  {
    id: 'veh-004',
    name: 'Мотоцикл Honda',
    type: 'motorcycle',
    manufacturer: 'Honda',
    model: 'CB500X',
    status: 'operational',
    specifications: {
      maxWeight: 15,
      maxSize: '50x50x40 см',
      fuelType: 'petrol',
      range: 400
    },
    lastMaintenance: '2024-05-20',
    nextMaintenance: '2024-08-20',
    location: 'Гараж №2',
    utilization: 70,
    currentCourier: 'cour-004'
  },
  {
    id: 'veh-005',
    name: 'Электроскутер Xiaomi',
    type: 'scooter',
    manufacturer: 'Xiaomi',
    model: 'Mi Electric Scooter Pro 2',
    status: 'charging',
    specifications: {
      maxWeight: 3,
      maxSize: '30x30x30 см',
      fuelType: 'electric',
      range: 45
    },
    lastMaintenance: '2024-06-10',
    nextMaintenance: '2024-09-10',
    location: 'Зарядная станция',
    utilization: 55,
    currentCourier: 'cour-005'
  },
  {
    id: 'veh-006',
    name: 'Минивэн для грузов',
    type: 'van',
    manufacturer: 'Mercedes',
    model: 'Sprinter',
    status: 'operational',
    specifications: {
      maxWeight: 1000,
      maxSize: '300x200x200 см',
      fuelType: 'diesel',
      range: 800
    },
    lastMaintenance: '2024-05-25',
    nextMaintenance: '2024-08-25',
    location: 'Логистический центр',
    utilization: 40
  }
];

const orders: Order[] = [
  {
    id: 'order-001',
    customerId: 'cust-001',
    serviceId: 'ds-001',
    courierId: 'cour-001',
    items: [
      {
        id: 'item-001',
        name: 'Пицца Маргарита',
        quantity: 1,
        price: 450,
        weight: 0.8,
        fragile: false
      },
      {
        id: 'item-002',
        name: 'Кола 0.5л',
        quantity: 2,
        price: 120,
        weight: 1.0,
        fragile: false
      }
    ],
    status: 'delivered',
    timeline: {
      created: '2024-06-15T18:30:00Z',
      confirmed: '2024-06-15T18:32:00Z',
      preparing: '2024-06-15T18:35:00Z',
      pickedUp: '2024-06-15T18:50:00Z',
      inTransit: '2024-06-15T18:51:00Z',
      delivered: '2024-06-15T19:05:00Z'
    },
    delivery: {
      from: 'Пиццерия "Италия", ул. Пушкина, 10',
      to: 'г. Москва, ул. Ленина, д. 15, кв. 34',
      distance: 3.2,
      estimatedTime: '19:15',
      actualTime: '19:05'
    },
    payment: {
      amount: 690,
      method: 'online',
      status: 'paid',
      tip: 50
    },
    rating: 5
  },
  {
    id: 'order-002',
    customerId: 'cust-002',
    serviceId: 'ds-003',
    courierId: 'cour-003',
    items: [
      {
        id: 'item-003',
        name: 'Молоко 3.2%',
        quantity: 1,
        price: 85,
        weight: 1.0,
        fragile: true
      },
      {
        id: 'item-004',
        name: 'Хлеб бородинский',
        quantity: 1,
        price: 45,
        weight: 0.5,
        fragile: true
      }
    ],
    status: 'delivered',
    timeline: {
      created: '2024-06-10T14:00:00Z',
      confirmed: '2024-06-10T14:02:00Z',
      preparing: '2024-06-10T14:05:00Z',
      pickedUp: '2024-06-10T14:30:00Z',
      inTransit: '2024-06-10T14:31:00Z',
      delivered: '2024-06-10T15:10:00Z'
    },
    delivery: {
      from: 'Супермаркет "ВкусВилл", пр. Мира, 100',
      to: 'г. Москва, пр. Мира, д. 125, кв. 12',
      distance: 2.1,
      estimatedTime: '15:15',
      actualTime: '15:10'
    },
    payment: {
      amount: 130,
      method: 'card',
      status: 'paid'
    },
    rating: 4
  },
  {
    id: 'order-003',
    customerId: 'cust-003',
    serviceId: 'ds-002',
    courierId: 'cour-002',
    items: [
      {
        id: 'item-005',
        name: 'Документы',
        quantity: 1,
        price: 0,
        weight: 0.2,
        fragile: false
      }
    ],
    status: 'in_transit',
    timeline: {
      created: '2024-06-18T09:00:00Z',
      confirmed: '2024-06-18T09:05:00Z',
      preparing: '2024-06-18T09:10:00Z',
      pickedUp: '2024-06-18T09:30:00Z',
      inTransit: '2024-06-18T09:31:00Z'
    },
    delivery: {
      from: 'Офис Сидорова Д.Н., ул. Тверская, 25',
      to: 'Банк "ВТБ", ул. Новый Арбат, 15',
      distance: 4.5,
      estimatedTime: '10:30'
    },
    payment: {
      amount: 350,
      method: 'cash',
      status: 'pending'
    },
    notes: 'Срочные документы для подписания'
  },
  {
    id: 'order-004',
    customerId: 'cust-005',
    serviceId: 'ds-005',
    items: [
      {
        id: 'item-006',
        name: 'Подарочный набор',
        quantity: 1,
        price: 2500,
        weight: 2.5,
        dimensions: '25x25x15 см',
        fragile: true
      }
    ],
    status: 'preparing',
    timeline: {
      created: '2024-06-12T10:00:00Z',
      confirmed: '2024-06-12T10:15:00Z',
      preparing: '2024-06-12T10:20:00Z'
    },
    delivery: {
      from: 'Магазин подарков, ул. Арбат, 35',
      to: 'г. Берлин, ул. Хауптштрассе, 123',
      distance: 1600,
      estimatedTime: '2024-06-20'
    },
    payment: {
      amount: 5200,
      method: 'online',
      status: 'paid'
    },
    notes: 'Хрупкий предмет, требует осторожной перевозки'
  },
  {
    id: 'order-005',
    customerId: 'cust-001',
    serviceId: 'ds-008',
    items: [
      {
        id: 'item-007',
        name: 'Салат Цезарь',
        quantity: 1,
        price: 320,
        weight: 0.4,
        fragile: false
      },
      {
        id: 'item-008',
        name: 'Смузи ягодный',
        quantity: 1,
        price: 180,
        weight: 0.5,
        fragile: true
      }
    ],
    status: 'confirmed',
    timeline: {
      created: '2024-06-19T19:00:00Z',
      confirmed: '2024-06-19T19:02:00Z'
    },
    delivery: {
      from: 'Кафе "Зеленая ложка", ул. Чехова, 8',
      to: 'г. Москва, ул. Ленина, д. 15, кв. 34',
      distance: 2.8,
      estimatedTime: '19:45'
    },
    payment: {
      amount: 500,
      method: 'online',
      status: 'paid'
    }
  }
];

// Константы
const COLORS = {
  primary: 'from-slate-900 via-slate-950 to-slate-900',
  secondary: 'from-orange-900 via-slate-950 to-amber-900',
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
  type?: 'default' | 'service' | 'customer' | 'courier' | 'order' | 'vehicle';
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
        return { color: COLORS.orange, label: 'На доставке', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'break':
        return { color: COLORS.purple, label: 'Перерыв', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'maintenance':
        return { color: COLORS.warning, label: 'Обслуживание', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' };
      case 'charging':
        return { color: COLORS.cyan, label: 'Зарядка', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' };
      case 'pending':
        return { color: COLORS.blue, label: 'Ожидание', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'confirmed':
        return { color: COLORS.teal, label: 'Подтвержден', bg: 'bg-teal-500/15', border: 'border-teal-500/30' };
      case 'preparing':
        return { color: COLORS.orange, label: 'Готовится', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'in_transit':
        return { color: COLORS.indigo, label: 'В пути', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' };
      case 'delivered':
        return { color: COLORS.success, label: 'Доставлен', bg: 'bg-green-500/15', border: 'border-green-500/30' };
      case 'cancelled':
        return { color: COLORS.error, label: 'Отменен', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'returned':
        return { color: COLORS.rose, label: 'Возврат', bg: 'bg-rose-500/15', border: 'border-rose-500/30' };
      case 'operational':
        return { color: COLORS.success, label: 'Рабочее', bg: 'bg-green-500/15', border: 'border-green-500/30' };
      case 'out_of_service':
        return { color: COLORS.error, label: 'Не работает', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'food':
        return { color: COLORS.orange, label: 'Еда', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'parcel':
        return { color: COLORS.blue, label: 'Посылки', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'express':
        return { color: COLORS.indigo, label: 'Экспресс', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' };
      case 'grocery':
        return { color: COLORS.emerald, label: 'Продукты', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'document':
        return { color: COLORS.purple, label: 'Документы', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'pharmacy':
        return { color: COLORS.rose, label: 'Аптека', bg: 'bg-rose-500/15', border: 'border-rose-500/30' };
      case 'international':
        return { color: COLORS.cyan, label: 'Международная', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' };
      case 'bicycle':
        return { color: COLORS.emerald, label: 'Велосипед', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'scooter':
        return { color: COLORS.orange, label: 'Скутер', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'motorcycle':
        return { color: COLORS.indigo, label: 'Мотоцикл', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' };
      case 'car':
        return { color: COLORS.blue, label: 'Автомобиль', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'truck':
        return { color: COLORS.slate, label: 'Грузовик', bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
      case 'van':
        return { color: COLORS.purple, label: 'Минивэн', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
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

const ServiceCard = ({ service, onClick }: { service: DeliveryService; onClick?: () => void }) => {
  const getServiceColor = (category: string) => {
    switch (category) {
      case 'food': return COLORS.orange;
      case 'parcel': return COLORS.blue;
      case 'express': return COLORS.indigo;
      case 'grocery': return COLORS.emerald;
      case 'document': return COLORS.purple;
      case 'pharmacy': return COLORS.rose;
      case 'international': return COLORS.cyan;
      default: return COLORS.slate;
    }
  };

  const getDeliveryTimeDisplay = (deliveryTime: DeliveryService['deliveryTime']) => {
    const min = formatTime(deliveryTime.min);
    const max = formatTime(deliveryTime.max);
    return `${min} - ${max}`;
  };

  const getPriceDisplay = (price: DeliveryService['price']) => {
    let display = `от ${formatCurrency(price.base)}`;
    if (price.perKm) {
      display += ` + ${formatCurrency(price.perKm)}/км`;
    }
    return display;
  };

  const utilization = (service.currentOrders / service.capacity) * 100;

  return (
    <BentoCard className="p-5" glowColor={getServiceColor(service.category)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{service.name}</h4>
          <p className="text-slate-400 text-sm line-clamp-1">{service.deliveryTypes.join(', ')}</p>
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
            <span className="text-slate-400 text-xs">Время доставки</span>
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
        <button className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Заказать
        </button>
      </div>
    </BentoCard>
  );
};

const CustomerCard = ({ customer, onClick }: { customer: Customer; onClick?: () => void }) => {
  const getCustomerColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'inactive': return COLORS.slate;
      case 'blocked': return COLORS.error;
      default: return COLORS.slate;
    }
  };

  return (
    <BentoCard className="p-5" glowColor={getCustomerColor(customer.status)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{customer.name}</h4>
          <p className="text-slate-400 text-sm">
            {customer.totalOrders} заказов • {customer.loyalty.tier}
          </p>
        </div>
        <StatusBadge status={customer.status} type="customer" animated={customer.status === 'active'} />
      </div>
      
      <div className="space-y-3 text-sm mb-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Телефон:</span>
          <span className="text-white font-medium">{customer.contact.phone}</span>
        </div>
        
        <div className="flex justify-between items-start">
          <span className="text-slate-400">Адрес:</span>
          <span className="text-white font-medium text-right text-xs">{customer.contact.address}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Баллы лояльности:</span>
          <span className="text-white font-medium">{customer.loyalty.points}</span>
        </div>

        {customer.lastOrder && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Последний заказ:</span>
            <span className="text-white font-medium text-xs">
              {new Date(customer.lastOrder).toLocaleDateString('ru-RU')}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          История
        </button>
        <button className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 text-sm py-2.5 px-4 rounded-xl transition-all duration-200 font-medium">
          Создать заказ
        </button>
      </div>
    </BentoCard>
  );
};

const CourierCard = ({ courier, onClick }: { courier: Courier; onClick?: () => void }) => {
  const utilization = (courier.currentOrders.length / courier.maxOrders) * 100;
  
  const getCourierColor = (status: string) => {
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
    <BentoCard className="p-5" glowColor={getCourierColor(courier.status)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{courier.name}</h4>
          <p className="text-slate-400 text-sm line-clamp-1">
            {courier.vehicle.type} • {courier.vehicle.model}
          </p>
        </div>
        <StatusBadge status={courier.status} type="courier" animated={courier.status === 'active'} />
      </div>
      
      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Рейтинг:</span>
          <span className="text-white font-medium">{courier.ratings.average}/5.0</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Заказов:</span>
          <span className="text-white font-medium">{courier.currentOrders.length}/{courier.maxOrders}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Вовремя:</span>
          <span className="text-white font-medium">{courier.metrics.onTimeRate}%</span>
        </div>

        {courier.currentLocation && (
          <div className="flex justify-between items-start">
            <span className="text-slate-400">Местоположение:</span>
            <span className="text-white font-medium text-right text-xs">
              {courier.currentLocation.address}
            </span>
          </div>
        )}
      </div>
      
      <ProgressBar 
        value={utilization} 
        label={`Загрузка курьера`}
        color={utilization > 90 ? COLORS.rose : utilization > 75 ? COLORS.orange : COLORS.success}
        showValue={false}
      />
    </BentoCard>
  );
};

const VehicleCard = ({ vehicle, onClick }: { vehicle: Vehicle; onClick?: () => void }) => {
  const getVehicleColor = (type: string) => {
    switch (type) {
      case 'bicycle': return COLORS.emerald;
      case 'scooter': return COLORS.orange;
      case 'motorcycle': return COLORS.indigo;
      case 'car': return COLORS.blue;
      case 'truck': return COLORS.slate;
      case 'van': return COLORS.purple;
      default: return COLORS.slate;
    }
  };

  const isMaintenanceDue = new Date(vehicle.nextMaintenance) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <BentoCard className="p-5" glowColor={getVehicleColor(vehicle.type)} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{vehicle.name}</h4>
          <p className="text-slate-400 text-sm">{vehicle.manufacturer} {vehicle.model}</p>
        </div>
        <StatusBadge status={vehicle.status} type="vehicle" animated={vehicle.status === 'operational'} />
      </div>
      
      <div className="space-y-4 mb-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs">Тип</span>
            <p className="text-white font-medium">
              {vehicle.type === 'bicycle' && 'Велосипед'}
              {vehicle.type === 'scooter' && 'Скутер'}
              {vehicle.type === 'motorcycle' && 'Мотоцикл'}
              {vehicle.type === 'car' && 'Автомобиль'}
              {vehicle.type === 'truck' && 'Грузовик'}
              {vehicle.type === 'van' && 'Минивэн'}
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

const OrderCard = ({ order, onClick }: { order: Order; onClick?: () => void }) => {
  const customer = customers.find(c => c.id === order.customerId);
  const service = deliveryServices.find(s => s.id === order.serviceId);
  const courier = couriers.find(c => c.id === order.courierId);

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
            {customer?.name} • {service?.name}
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
          <span className="text-white font-medium">{formatDistance(order.delivery.distance)}</span>
        </div>
        
        {order.delivery.estimatedTime && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Время доставки:</span>
            <span className="text-white font-medium">
              {order.delivery.actualTime || order.delivery.estimatedTime}
            </span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-700/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-xs">Прогресс доставки</span>
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
          Отследить
        </button>
      </div>
    </BentoCard>
  );
};

// Основной компонент
export default function DeliveryServicesOrganization() {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'customers' | 'couriers' | 'vehicles' | 'analytics' | 'orders'>('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const DeliveryServicesOrganization = () => {
  const currentTime = useClientTime();
  };

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
    if (!searchQuery) return deliveryServices;
    return deliveryServices.filter(service =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.deliveryTypes.some(type => type.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contact.phone.includes(searchQuery) ||
      customer.contact.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredCouriers = useMemo(() => {
    if (!searchQuery) return couriers;
    return couriers.filter(courier =>
      courier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courier.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (courier.currentLocation?.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const filteredVehicles = useMemo(() => {
    if (!searchQuery) return vehicles;
    return vehicles.filter(vehicle =>
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;
    return orders.filter(order => {
      const customer = customers.find(c => c.id === order.customerId);
      const service = deliveryServices.find(s => s.id === order.serviceId);
      
      return (
        customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  // Статистика
  const deliveryStats = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const totalServices = deliveryServices.length;
    const activeServices = deliveryServices.filter(s => s.status === 'active').length;
    const totalCouriers = couriers.length;
    const availableCouriers = couriers.filter(c => c.status === 'active' || c.status === 'on_delivery').length;
    const todayOrders = orders.filter(o => new Date(o.timeline.created).toDateString() === new Date().toDateString()).length;
    const totalVehicles = vehicles.length;
    const operationalVehicles = vehicles.filter(v => v.status === 'operational').length;
    const totalRevenue = orders
      .filter(o => o.payment.status === 'paid')
      .reduce((sum, order) => sum + order.payment.amount, 0);

    return {
      totalCustomers,
      activeCustomers,
      totalServices,
      activeServices,
      totalCouriers,
      availableCouriers,
      todayOrders,
      totalVehicles,
      operationalVehicles,
      totalRevenue
    };
  }, []);

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: '📊', count: null },
    { id: 'services' as const, label: 'Услуги', icon: '🚚', count: deliveryStats.totalServices },
    { id: 'customers' as const, label: 'Клиенты', icon: '👥', count: deliveryStats.totalCustomers },
    { id: 'couriers' as const, label: 'Курьеры', icon: '🚴', count: deliveryStats.totalCouriers },
    { id: 'vehicles' as const, label: 'Транспорт', icon: '⚙️', count: deliveryStats.totalVehicles },
    { id: 'orders' as const, label: 'Заказы', icon: '📦', count: orders.length },
    { id: 'analytics' as const, label: 'Аналитика', icon: '📈', count: null }
  ];

  // Модальные окна контент
  const renderServiceModal = (service: DeliveryService) => {
    const utilization = (service.currentOrders / service.capacity) * 100;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Услуга доставки</label>
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
            <label className="text-slate-400 text-sm font-medium">Типы доставки</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {service.deliveryTypes.map((type, index) => (
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
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-slate-400">
                <div>Лимит веса: {service.price.weightLimit} кг</div>
                <div>Лимит размера: {service.price.sizeLimit}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Время доставки</label>
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
                <p className="text-cyan-400 text-sm mt-1">✓ Международная доставка</p>
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

  const renderCustomerModal = (customer: Customer) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm font-medium">Клиент</label>
            <p className="text-white font-semibold text-lg mt-1">{customer.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm">Всего заказов</label>
              <p className="text-white font-medium">{customer.totalOrders}</p>
            </div>
            <div>
              <label className="text-slate-400 text-sm">Уровень лояльности</label>
              <div className="mt-1">
                <StatusBadge status={customer.loyalty.tier} />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm font-medium">Статус</label>
            <div className="mt-2">
              <StatusBadge status={customer.status} type="customer" animated />
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm">Скидка</label>
            <p className="text-white font-medium">{customer.loyalty.discount}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-slate-400 text-sm font-medium">Контактная информация</label>
          <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
            <div>
              <span className="text-slate-400 text-sm">Телефон:</span>
              <p className="text-white font-medium">{customer.contact.phone}</p>
            </div>
            {customer.contact.email && (
              <div>
                <span className="text-slate-400 text-sm">Email:</span>
                <p className="text-white font-medium">{customer.contact.email}</p>
              </div>
            )}
            <div>
              <span className="text-slate-400 text-sm">Адрес:</span>
              <p className="text-white font-medium text-sm">{customer.contact.address}</p>
            </div>
          </div>
        </div>
        <div>
          <label className="text-slate-400 text-sm font-medium">Предпочтения</label>
          <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
            <div>
              <span className="text-slate-400 text-sm">Время доставки:</span>
              <p className="text-white font-medium">{customer.preferences.deliveryTime.join(', ')}</p>
            </div>
            <div>
              <span className="text-slate-400 text-sm">Способ связи:</span>
              <p className="text-white font-medium">
                {customer.preferences.contactMethod === 'phone' && 'Телефон'}
                {customer.preferences.contactMethod === 'email' && 'Email'}
                {customer.preferences.contactMethod === 'sms' && 'SMS'}
              </p>
            </div>
            {customer.preferences.notes && (
              <div>
                <span className="text-slate-400 text-sm">Примечания:</span>
                <p className="text-white font-medium text-sm">{customer.preferences.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-sm font-medium mb-3 block">Программа лояльности</label>
        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-800/30 rounded-2xl">
          <div className="text-center">
            <p className="text-white font-bold text-xl">{customer.loyalty.points}</p>
            <p className="text-slate-400 text-xs">баллов</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">{customer.loyalty.tier}</p>
            <p className="text-slate-400 text-xs">уровень</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">{customer.loyalty.discount}%</p>
            <p className="text-slate-400 text-xs">скидка</p>
          </div>
        </div>
      </div>

      {customer.orderHistory.length > 0 && (
        <div>
          <label className="text-slate-400 text-sm font-medium mb-3 block">История заказов</label>
          <div className="space-y-3">
            {customer.orderHistory.map((order) => {
              const service = deliveryServices.find(s => s.id === order.serviceId);
              return (
                <div key={order.id} className="p-4 bg-slate-800/30 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white font-medium">
                      {new Date(order.timeline.created).toLocaleDateString('ru-RU')}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-white text-sm mb-2">
                    <strong>Услуга:</strong> {service?.name}
                  </p>
                  <p className="text-slate-300 text-sm">
                    <strong>Сумма:</strong> {formatCurrency(order.payment.amount)}
                  </p>
                  {order.rating && (
                    <p className="text-yellow-400 text-xs mt-2">Оценка: {order.rating}/5</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderCourierModal = (courier: Courier) => {
    const utilization = (courier.currentOrders.length / courier.maxOrders) * 100;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm font-medium">Курьер</label>
              <p className="text-white font-semibold text-lg mt-1">{courier.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm">Выполнено заказов</label>
                <p className="text-white font-medium">{courier.metrics.completedOrders}</p>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Рейтинг</label>
                <p className="text-white font-medium">{courier.ratings.average}/5.0</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm font-medium">Статус</label>
              <div className="mt-2">
                <StatusBadge status={courier.status} type="courier" animated={courier.status === 'active'} />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-sm">Пробег</label>
              <p className="text-white font-medium">{formatDistance(courier.metrics.distanceCovered)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Контактная информация</label>
            <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
              <div>
                <span className="text-slate-400 text-sm">Телефон:</span>
                <p className="text-white font-medium">{courier.contact.phone}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Email:</span>
                <p className="text-white font-medium">{courier.contact.email}</p>
              </div>
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm font-medium">Транспортное средство</label>
            <div className="mt-2 space-y-3 p-4 bg-slate-800/30 rounded-2xl">
              <div>
                <span className="text-slate-400 text-sm">Тип:</span>
                <p className="text-white font-medium">
                  {courier.vehicle.type === 'bicycle' && 'Велосипед'}
                  {courier.vehicle.type === 'scooter' && 'Скутер'}
                  {courier.vehicle.type === 'motorcycle' && 'Мотоцикл'}
                  {courier.vehicle.type === 'car' && 'Автомобиль'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Модель:</span>
                <p className="text-white font-medium">{courier.vehicle.model}</p>
              </div>
              {courier.vehicle.licensePlate && (
                <div>
                  <span className="text-slate-400 text-sm">Номер:</span>
                  <p className="text-white font-medium">{courier.vehicle.licensePlate}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-400 text-sm font-medium">Загрузка курьера</label>
            <div className="mt-2 p-4 bg-slate-800/30 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">Текущие заказы</span>
                <span className="text-white font-bold">{courier.currentOrders.length}/{courier.maxOrders}</span>
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
                <p className="text-white font-medium">{courier.schedule.days.join(', ')}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Часы работы:</span>
                <p className="text-white font-medium">{courier.schedule.hours}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-xl">{courier.ratings.average}</p>
            <p className="text-slate-400 text-xs">рейтинг</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-xl">{courier.metrics.onTimeRate}%</p>
            <p className="text-slate-400 text-xs">вовремя</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-2xl">
            <p className="text-white font-bold text-xl">{courier.ratings.count}</p>
            <p className="text-slate-400 text-xs">оценок</p>
          </div>
        </div>

        {courier.currentLocation && (
          <div>
            <label className="text-slate-400 text-sm font-medium mb-3 block">Текущее местоположение</label>
            <div className="p-4 bg-slate-800/30 rounded-2xl">
              <p className="text-white font-medium">{courier.currentLocation.address}</p>
              <p className="text-slate-400 text-xs mt-1">
                Координаты: {courier.currentLocation.lat.toFixed(4)}, {courier.currentLocation.lng.toFixed(4)}
              </p>
            </div>
          </div>
        )}

        {courier.currentOrders.length > 0 && (
          <div>
            <label className="text-slate-400 text-sm font-medium mb-3 block">Текущие заказы</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {courier.currentOrders.map((orderId) => {
                const order = orders.find(o => o.id === orderId);
                return order ? (
                  <div key={orderId} className="p-3 bg-slate-800/30 rounded-xl">
                    <p className="text-white font-medium text-sm">Заказ #{order.id.split('-')[1]}</p>
                    <p className="text-slate-400 text-xs">{order.delivery.to}</p>
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
                Доставка <span className="text-orange-400">"Экспресс"</span>
              </h1>
              <p className="text-slate-400 text-lg">Быстрая и надежная доставка по городу и за его пределами</p>
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
              value={deliveryStats.totalCustomers}
              change={15}
              icon="👥"
              color={COLORS.blue}
              subtitle={`${deliveryStats.activeCustomers} активных`}
              trend="up"
            />
            <StatCard
              title="Услуг доставки"
              value={deliveryStats.totalServices}
              change={8}
              icon="🚚"
              color={COLORS.orange}
              subtitle={`${deliveryStats.activeServices} активных`}
              trend="up"
            />
            <StatCard
              title="Курьеров"
              value={deliveryStats.totalCouriers}
              change={12}
              icon="🚴"
              color={COLORS.emerald}
              subtitle={`${deliveryStats.availableCouriers} доступно`}
              trend="up"
            />
            <StatCard
              title="Заказов сегодня"
              value={deliveryStats.todayOrders}
              change={25}
              icon="📦"
              color={COLORS.purple}
              subtitle="доставок"
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
                    <h2 className="text-2xl font-bold text-white">Популярные услуги доставки</h2>
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
                    {deliveryServices
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

                {/* Recent Customers & Couriers */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Активные клиенты</h3>
                      <button 
                        className="text-slate-400 hover:text-slate-300 text-sm font-medium"
                        onClick={() => setActiveTab('customers')}
                      >
                        Все клиенты →
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {customers
                        .filter(customer => customer.status === 'active')
                        .sort((a, b) => b.totalOrders - a.totalOrders)
                        .slice(0, 4)
                        .map((customer, index) => (
                        <motion.div
                          key={customer.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <CustomerCard 
                            customer={customer}
                            onClick={() => openModal(customer.name, renderCustomerModal(customer), 'xl')}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Доступные курьеры</h3>
                      <button 
                        className="text-slate-400 hover:text-slate-300 text-sm font-medium"
                        onClick={() => setActiveTab('couriers')}
                      >
                        Все курьеры →
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {couriers
                        .filter(courier => courier.status === 'active' || courier.status === 'on_delivery')
                        .slice(0, 4)
                        .map((courier, index) => (
                        <motion.div
                          key={courier.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <CourierCard 
                            courier={courier}
                            onClick={() => openModal(courier.name, renderCourierModal(courier), 'xl')}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Последние заказы</h3>
                    <button 
                      className="text-slate-400 hover:text-slate-300 text-sm font-medium"
                      onClick={() => setActiveTab('orders')}
                    >
                      Все заказы →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders
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
                  <h2 className="text-2xl font-bold text-white">Услуги доставки</h2>
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

            {activeTab === 'customers' && (
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
                  {filteredCustomers.map((customer, index) => (
                    <motion.div
                      key={customer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CustomerCard 
                        customer={customer}
                        onClick={() => openModal(customer.name, renderCustomerModal(customer), 'xl')}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'couriers' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Курьеры</h2>
                  <button className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
                    + Новый курьер
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCouriers.map((courier, index) => (
                    <motion.div
                      key={courier.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CourierCard 
                        courier={courier}
                        onClick={() => openModal(courier.name, renderCourierModal(courier), 'xl')}
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
                  <h2 className="text-2xl font-bold text-white">Транспортные средства</h2>
                  <button className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm">
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
                                <label className="text-slate-400 text-sm">Тип</label>
                                <p className="text-white font-medium">
                                  {vehicle.type === 'bicycle' && 'Велосипед'}
                                  {vehicle.type === 'scooter' && 'Скутер'}
                                  {vehicle.type === 'motorcycle' && 'Мотоцикл'}
                                  {vehicle.type === 'car' && 'Автомобиль'}
                                  {vehicle.type === 'truck' && 'Грузовик'}
                                  {vehicle.type === 'van' && 'Минивэн'}
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
                                    <span className="text-slate-400">Макс. размер:</span>
                                    <span className="text-white">{vehicle.specifications.maxSize}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Тип топлива:</span>
                                    <span className="text-white">
                                      {vehicle.specifications.fuelType === 'electric' && 'Электрический'}
                                      {vehicle.specifications.fuelType === 'petrol' && 'Бензин'}
                                      {vehicle.specifications.fuelType === 'diesel' && 'Дизель'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Запас хода:</span>
                                    <span className="text-white">{vehicle.specifications.range} км</span>
                                  </div>
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
                  <BentoCard className="p-6" glowColor={COLORS.orange}>
                    <h3 className="text-white font-semibold mb-4">Эффективность доставки</h3>
                    <div className="text-3xl font-bold text-white mb-2">92.5%</div>
                    <ProgressBar value={92.5} color={COLORS.orange} />
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-slate-300">
                      <div>
                        <p>Средняя скорость</p>
                        <p className="text-white font-medium">38 мин</p>
                      </div>
                      <div>
                        <p>Успешность</p>
                        <p className="text-white font-medium">95.8%</p>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.blue}>
                    <h3 className="text-white font-semibold mb-4">Финансовые показатели</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                        <span className="text-slate-300">Общая выручка</span>
                        <span className="text-white font-medium">{formatCurrency(deliveryStats.totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                        <span className="text-slate-300">Средний чек</span>
                        <span className="text-white font-medium">{formatCurrency(orders.length > 0 ? deliveryStats.totalRevenue / orders.length : 0)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                        <span className="text-slate-300">Заказов в день</span>
                        <span className="text-emerald-300 font-medium">{deliveryStats.todayOrders}</span>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.purple}>
                    <h3 className="text-white font-semibold mb-4">Распределение по типам</h3>
                    <div className="space-y-3">
                      {[
                        { type: 'Доставка еды', percentage: 45, orders: Math.round(orders.length * 0.45) },
                        { type: 'Посылки', percentage: 25, orders: Math.round(orders.length * 0.25) },
                        { type: 'Продукты', percentage: 15, orders: Math.round(orders.length * 0.15) },
                        { type: 'Документы', percentage: 10, orders: Math.round(orders.length * 0.10) },
                        { type: 'Международные', percentage: 5, orders: Math.round(orders.length * 0.05) }
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

                {/* Delivery Analytics */}
                <BentoCard className="p-6">
                  <h3 className="text-white font-semibold mb-4">Аналитика доставки</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Ключевые показатели</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Среднее время доставки</span>
                          <span className="text-white font-medium">42 мин</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Отмененные заказы</span>
                          <span className="text-white font-medium">3.2%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Средняя дистанция</span>
                          <span className="text-white font-medium">4.8 км</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                          <span className="text-slate-300">Обеспеченность транспортом</span>
                          <span className="text-white font-medium">85.5%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Эффективность по типам доставки</h4>
                      <div className="space-y-3">
                        {[
                          { type: 'Экспресс-еда', effectiveness: 95, time: '32 мин' },
                          { type: 'Посылки', effectiveness: 88, time: '2.5 ч' },
                          { type: 'Продукты', effectiveness: 91, time: '1.8 ч' },
                          { type: 'Документы', effectiveness: 96, time: '1.2 ч' }
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