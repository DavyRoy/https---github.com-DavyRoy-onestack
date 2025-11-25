'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Расширенные типы данных
interface DeliveryStatus {
  id: string;
  trackingNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'delayed';
  description: string;
  estimatedDelivery: string;
  currentLocation?: string;
  recipient: string;
  address: string;
  packageInfo: {
    weight: string;
    dimensions: string;
    items: number;
    type: 'document' | 'parcel' | 'express' | 'fragile' | 'oversized';
    declaredValue?: string;
  };
  steps: DeliveryStep[];
  carrier: string;
  distance?: {
    traveled: number;
    total: number;
    unit: 'km' | 'miles';
  };
  alerts: string[];
  insurance: boolean;
  signatureRequired: boolean;
}

interface DeliveryStep {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'pending' | 'delayed';
  timestamp?: string;
  location?: string;
  description?: string;
  coordinates?: { lat: number; lng: number };
  estimatedTime?: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: string;
  deliveryTime: string;
  features: string[];
  icon: string;
  recommended?: boolean;
  carrier: string;
  reliability: number;
  maxWeight: string;
  insuranceIncluded: boolean;
  trackingLevel: 'basic' | 'standard' | 'premium';
  deliveryOptions: string[];
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue' | 'disputed';
  dueDate?: string;
  items: InvoiceItem[];
  shippingMethod: string;
  trackingNumber?: string;
  paymentMethod?: string;
  taxAmount: string;
  discount?: string;
}

interface InvoiceItem {
  name: string;
  quantity: number;
  price: string;
  type: 'shipping' | 'insurance' | 'tax' | 'service' | 'discount';
}

interface Package {
  id: string;
  trackingNumber: string;
  name: string;
  status: DeliveryStatus['status'];
  lastUpdate: string;
  estimatedDelivery: string;
  currentLocation?: string;
  icon: string;
  priority: 'low' | 'medium' | 'high' | 'express';
  carrier: string;
  delay?: {
    reason: string;
    newDate: string;
  };
}

interface DeliveryAlert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  relatedPackage?: string;
  action?: string;
}

interface Carrier {
  id: string;
  name: string;
  logo: string;
  rating: number;
  deliveryTime: string;
  reliability: number;
  coverage: string[];
  features: string[];
  contact: {
    phone: string;
    email: string;
    supportHours: string;
  };
}

// Константы для цветов
const COLORS = {
  primary: 'from-gray-900 via-black to-gray-800',
  success: '34, 197, 94',
  warning: '234, 179, 8',
  error: '239, 68, 68',
  info: '59, 130, 246',
  purple: '147, 51, 234',
  orange: '249, 115, 22',
  blue: '59, 130, 246',
  cyan: '34, 211, 238',
  gray: '156, 163, 175',
  emerald: '16, 185, 129',
  rose: '244, 63, 94',
  indigo: '99, 102, 241',
  teal: '20, 184, 166',
  amber: '245, 158, 11',
  violet: '139, 92, 246',
  fuchsia: '217, 70, 239',
  sky: '14, 165, 233',
  lime: '132, 204, 22',
  pink: '236, 72, 153',
  yellow: '234, 179, 8'
} as const;

// Расширенные данные для статусов доставки
const deliveryStatuses: DeliveryStatus[] = [
  {
    id: '1',
    trackingNumber: 'TRK123456789',
    status: 'in_transit',
    description: 'Посылка в пути - международная пересылка',
    estimatedDelivery: '15 дек 2024, 14:00-18:00',
    currentLocation: 'Сортировочный центр Москва',
    recipient: 'Иван Петров',
    address: 'ул. Примерная, д. 123, кв. 45, Москва, 123456',
    packageInfo: {
      weight: '2.5 кг',
      dimensions: '30x20x15 см',
      items: 3,
      type: 'parcel',
      declaredValue: '15 000 ₽'
    },
    steps: [
      { 
        id: '1', 
        name: 'Заказ принят', 
        status: 'completed', 
        timestamp: '10 дек, 10:30', 
        location: 'Интернет-магазин "TechStore"',
        estimatedTime: '10 дек, 10:30'
      },
      { 
        id: '2', 
        name: 'Обработка', 
        status: 'completed', 
        timestamp: '10 дек, 14:15', 
        location: 'Склад fulfillment',
        estimatedTime: '10 дек, 16:00'
      },
      { 
        id: '3', 
        name: 'Отправлено', 
        status: 'completed', 
        timestamp: '11 дек, 09:00', 
        location: 'Москва, хаб DHL',
        estimatedTime: '11 дек, 12:00'
      },
      { 
        id: '4', 
        name: 'Таможенное оформление', 
        status: 'completed', 
        timestamp: '12 дек, 11:20', 
        location: 'Таможня Шереметьево',
        estimatedTime: '12 дек, 14:00'
      },
      { 
        id: '5', 
        name: 'В пути', 
        status: 'current', 
        timestamp: '12 дек, 16:45', 
        location: 'Сортировочный центр Москва',
        estimatedTime: '13 дек, 10:00'
      },
      { 
        id: '6', name: 'Прибытие в город', 
        status: 'pending', 
        estimatedTime: '14 дек, 09:00' 
      },
      { 
        id: '7', 
        name: 'Доставка курьером', 
        status: 'pending', 
        estimatedTime: '15 дек, 14:00-18:00' 
      },
      { 
        id: '8', 
        name: 'Получено', 
        status: 'pending' 
      }
    ],
    carrier: 'DHL Express',
    distance: {
      traveled: 1250,
      total: 1800,
      unit: 'km'
    },
    alerts: ['Таможенное оформление завершено', 'Ожидается задержка 1 день из-за погодных условий'],
    insurance: true,
    signatureRequired: true
  },
  {
    id: '2',
    trackingNumber: 'TRK987654321',
    status: 'out_for_delivery',
    description: 'Посылка у курьера - срочная доставка',
    estimatedDelivery: 'Сегодня, 14:00-16:00',
    currentLocation: 'Курьер в районе Центральный',
    recipient: 'Иван Петров',
    address: 'ул. Примерная, д. 123, кв. 45, Москва, 123456',
    packageInfo: {
      weight: '1.2 кг',
      dimensions: '25x15x10 см',
      items: 1,
      type: 'express',
      declaredValue: '8 500 ₽'
    },
    steps: [
      { 
        id: '1', 
        name: 'Заказ принят', 
        status: 'completed', 
        timestamp: '08 дек, 15:20',
        location: 'Магазин "FashionStore"'
      },
      { 
        id: '2', 
        name: 'Обработка', 
        status: 'completed', 
        timestamp: '09 дек, 11:30',
        location: 'Склад экспресс-доставки'
      },
      { 
        id: '3', 
        name: 'Отправлено', 
        status: 'completed', 
        timestamp: '10 дек, 14:00',
        location: 'Курьерская служба'
      },
      { 
        id: '4', 
        name: 'В пути', 
        status: 'completed', 
        timestamp: '13 дек, 10:15',
        location: 'Транзитный хаб'
      },
      { 
        id: '5', 
        name: 'Доставка', 
        status: 'current', 
        timestamp: '14 дек, 09:30',
        location: 'Курьер выехал по адресу',
        estimatedTime: 'Сегодня, 14:00-16:00'
      },
      { 
        id: '6', 
        name: 'Получено', 
        status: 'pending' 
      }
    ],
    carrier: 'CDEK Express',
    alerts: ['Требуется подпись получателя', 'Возможен звонок за 30 минут'],
    insurance: true,
    signatureRequired: true
  },
  {
    id: '3',
    trackingNumber: 'TRK456789123',
    status: 'delivered',
    description: 'Посылка доставлена и получена',
    estimatedDelivery: '13 дек 2024, 11:30',
    recipient: 'Иван Петров',
    address: 'ул. Примерная, д. 123, кв. 45, Москва, 123456',
    packageInfo: {
      weight: '5.0 кг',
      dimensions: '40x30x25 см',
      items: 5,
      type: 'oversized',
      declaredValue: '25 000 ₽'
    },
    steps: [
      { 
        id: '1', 
        name: 'Заказ принят', 
        status: 'completed', 
        timestamp: '05 дек, 12:00',
        location: 'Интернет-магазин'
      },
      { 
        id: '2', 
        name: 'Обработка', 
        status: 'completed', 
        timestamp: '06 дек, 09:30',
        location: 'Региональный склад'
      },
      { 
        id: '3', 
        name: 'Отправлено', 
        status: 'completed', 
        timestamp: '07 дек, 14:20',
        location: 'Отправка со склада'
      },
      { 
        id: '4', 
        name: 'В пути', 
        status: 'completed', 
        timestamp: '10 дек, 11:45',
        location: 'Межгородская пересылка'
      },
      { 
        id: '5', 
        name: 'Доставка', 
        status: 'completed', 
        timestamp: '12 дек, 16:30',
        location: 'Передано курьеру'
      },
      { 
        id: '6', 
        name: 'Получено', 
        status: 'completed', 
        timestamp: '13 дек, 11:15',
        location: 'Подписано получателем'
      }
    ],
    carrier: 'Почта России',
    alerts: ['Получена подпись: Иван П.'],
    insurance: false,
    signatureRequired: false
  },
  {
    id: '4',
    trackingNumber: 'TRK111222333',
    status: 'delayed',
    description: 'Задержка доставки - погодные условия',
    estimatedDelivery: '18 дек 2024',
    currentLocation: 'Региональный хаб',
    recipient: 'Иван Петров',
    address: 'ул. Примерная, д. 123, кв. 45, Москва, 123456',
    packageInfo: {
      weight: '3.2 кг',
      dimensions: '35x25x20 см',
      items: 2,
      type: 'fragile',
      declaredValue: '12 000 ₽'
    },
    steps: [
      { 
        id: '1', 
        name: 'Заказ принят', 
        status: 'completed', 
        timestamp: '09 дек, 14:20'
      },
      { 
        id: '2', 
        name: 'Обработка', 
        status: 'completed', 
        timestamp: '10 дек, 10:15'
      },
      { 
        id: '3', 
        name: 'Отправлено', 
        status: 'completed', 
        timestamp: '11 дек, 13:45'
      },
      { 
        id: '4', 
        name: 'В пути', 
        status: 'delayed', 
        timestamp: '12 дек, 16:30',
        description: 'Задержка из-за снегопада'
      },
      { 
        id: '5', 
        name: 'Доставка', 
        status: 'pending', 
        estimatedTime: '18 дек, 10:00-18:00'
      },
      { 
        id: '6', 
        name: 'Получено', 
        status: 'pending' 
      }
    ],
    carrier: 'Boxberry',
    alerts: ['Серьезная задержка: неблагоприятные погодные условия', 'Ожидаемое время доставки изменено'],
    insurance: true,
    signatureRequired: true
  }
];

// Расширенные данные для способов доставки
const shippingMethods: ShippingMethod[] = [
  {
    id: '1',
    name: 'DHL Express',
    description: 'Премиальная международная доставка',
    price: '2 890 ₽',
    deliveryTime: '1-2 дня',
    features: [
      'Трекинг в реальном времени',
      'Полное страхование',
      'Таможенное оформление',
      'СМС уведомления',
      'Выбор времени доставки',
      'Приоритетная обработка'
    ],
    icon: '🚀',
    recommended: true,
    carrier: 'DHL',
    reliability: 98,
    maxWeight: '30 кг',
    insuranceIncluded: true,
    trackingLevel: 'premium',
    deliveryOptions: ['До двери', 'До пункта выдачи', 'Терминал']
  },
  {
    id: '2',
    name: 'CDEK Express',
    description: 'Быстрая доставка по России',
    price: '1 450 ₽',
    deliveryTime: '2-3 дня',
    features: [
      'Подробный трекинг',
      'Страхование до 50 000 ₽',
      'Уведомления по email/SMS',
      'Доставка до пункта выдачи'
    ],
    icon: '📦',
    carrier: 'CDEK',
    reliability: 95,
    maxWeight: '15 кг',
    insuranceIncluded: true,
    trackingLevel: 'standard',
    deliveryOptions: ['До двери', 'Пункт выдачи']
  },
  {
    id: '3',
    name: 'Почта России',
    description: 'Экономичная доставка по всей стране',
    price: '490 ₽',
    deliveryTime: '5-10 дней',
    features: [
      'Базовый трекинг',
      'Доставка до отделения',
      'Экономичный вариант'
    ],
    icon: '💰',
    carrier: 'Почта России',
    reliability: 85,
    maxWeight: '20 кг',
    insuranceIncluded: false,
    trackingLevel: 'basic',
    deliveryOptions: ['Почтовое отделение']
  },
  {
    id: '4',
    name: 'Boxberry',
    description: 'Доставка до пунктов выдачи',
    price: '690 ₽',
    deliveryTime: '3-6 дней',
    features: [
      'Трекинг посылки',
      'Сеть пунктов выдачи',
      'Уведомления',
      'Примерка одежды'
    ],
    icon: '🏪',
    carrier: 'Boxberry',
    reliability: 92,
    maxWeight: '15 кг',
    insuranceIncluded: false,
    trackingLevel: 'standard',
    deliveryOptions: ['Пункт выдачи', 'Постамат']
  }
];

// Расширенные данные для счетов
const invoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    date: '10 дек 2024',
    amount: '3 245 ₽',
    status: 'paid',
    items: [
      { name: 'DHL Express доставка', quantity: 1, price: '2 890 ₽', type: 'shipping' },
      { name: 'Страхование', quantity: 1, price: '350 ₽', type: 'insurance' },
      { name: 'Специальная упаковка', quantity: 1, price: '150 ₽', type: 'service' },
      { name: 'НДС 20%', quantity: 1, price: '678 ₽', type: 'tax' },
      { name: 'Скидка за объем', quantity: 1, price: '-823 ₽', type: 'discount' }
    ],
    shippingMethod: 'DHL Express',
    trackingNumber: 'TRK123456789',
    paymentMethod: 'Visa •••• 1234',
    taxAmount: '678 ₽'
  },
  {
    id: '2',
    number: 'INV-2024-002',
    date: '08 дек 2024',
    amount: '1 780 ₽',
    status: 'paid',
    items: [
      { name: 'CDEK Express доставка', quantity: 1, price: '1 450 ₽', type: 'shipping' },
      { name: 'Упаковка', quantity: 1, price: '150 ₽', type: 'service' },
      { name: 'НДС 20%', quantity: 1, price: '320 ₽', type: 'tax' },
      { name: 'Скидка постоянного клиента', quantity: 1, price: '-140 ₽', type: 'discount' }
    ],
    shippingMethod: 'CDEK Express',
    trackingNumber: 'TRK987654321',
    paymentMethod: 'Mir •••• 5678',
    taxAmount: '320 ₽'
  },
  {
    id: '3',
    number: 'INV-2024-003',
    date: '15 дек 2024',
    amount: '4 320 ₽',
    status: 'pending',
    dueDate: '20 дек 2024',
    items: [
      { name: 'Международная доставка', quantity: 1, price: '3 200 ₽', type: 'shipping' },
      { name: 'Страхование', quantity: 1, price: '620 ₽', type: 'insurance' },
      { name: 'Таможенные сборы', quantity: 1, price: '450 ₽', type: 'service' },
      { name: 'НДС 20%', quantity: 1, price: '854 ₽', type: 'tax' }
    ],
    shippingMethod: 'DHL International',
    paymentMethod: 'Не оплачен',
    taxAmount: '854 ₽'
  },
  {
    id: '4',
    number: 'INV-2024-004',
    date: '05 дек 2024',
    amount: '890 ₽',
    status: 'overdue',
    dueDate: '10 дек 2024',
    items: [
      { name: 'Эконом доставка', quantity: 1, price: '490 ₽', type: 'shipping' },
      { name: 'НДС 20%', quantity: 1, price: '98 ₽', type: 'tax' },
      { name: 'Дополнительная упаковка', quantity: 1, price: '302 ₽', type: 'service' }
    ],
    shippingMethod: 'Почта России',
    trackingNumber: 'TRK555444333',
    taxAmount: '98 ₽'
  }
];

// Данные для активных посылок
const activePackages: Package[] = [
  {
    id: '1',
    trackingNumber: 'TRK123456789',
    name: 'Смартфон и аксессуары',
    status: 'in_transit',
    lastUpdate: '2 часа назад',
    estimatedDelivery: '15 дек 2024',
    currentLocation: 'Москва, сортировка',
    icon: '📱',
    priority: 'express',
    carrier: 'DHL'
  },
  {
    id: '2',
    trackingNumber: 'TRK987654321',
    name: 'Зимняя одежда',
    status: 'out_for_delivery',
    lastUpdate: '30 минут назад',
    estimatedDelivery: 'Сегодня, 14:00-16:00',
    currentLocation: 'У курьера',
    icon: '👕',
    priority: 'high',
    carrier: 'CDEK'
  },
  {
    id: '3',
    trackingNumber: 'TRK555666777',
    name: 'Книги и учебники',
    status: 'processing',
    lastUpdate: '5 часов назад',
    estimatedDelivery: '18 дек 2024',
    icon: '📚',
    priority: 'medium',
    carrier: 'Почта России'
  },
  {
    id: '4',
    trackingNumber: 'TRK888999000',
    name: 'Новогодний подарок',
    status: 'pending',
    lastUpdate: 'Вчера',
    estimatedDelivery: '20 дек 2024',
    icon: '🎁',
    priority: 'medium',
    carrier: 'Boxberry'
  },
  {
    id: '5',
    trackingNumber: 'TRK111222333',
    name: 'Хрупкие сувениры',
    status: 'delayed',
    lastUpdate: '3 часа назад',
    estimatedDelivery: '18 дек 2024',
    currentLocation: 'Региональный хаб',
    icon: '🏺',
    priority: 'high',
    carrier: 'Boxberry',
    delay: {
      reason: 'Погодные условия',
      newDate: '18 дек 2024'
    }
  }
];

// Данные для уведомлений
const deliveryAlerts: DeliveryAlert[] = [
  { 
    id: '1', 
    type: 'warning', 
    title: 'Задержка доставки', 
    message: 'Посылка #TRK111222333 задержана из-за неблагоприятных погодных условий', 
    time: '2 часа назад', 
    priority: 'high',
    relatedPackage: 'TRK111222333',
    action: 'Подробнее'
  },
  { 
    id: '2', 
    type: 'info', 
    title: 'Посылка у курьера', 
    message: 'Посылка #TRK987654321 будет доставлена сегодня с 14:00 до 16:00', 
    time: '30 минут назад', 
    priority: 'medium',
    relatedPackage: 'TRK987654321',
    action: 'Отследить'
  },
  { 
    id: '3', 
    type: 'success', 
    title: 'Таможенное оформление', 
    message: 'Посылка #TRK123456789 прошла таможенное оформление', 
    time: '3 часа назад', 
    priority: 'medium',
    relatedPackage: 'TRK123456789',
    action: 'Детали'
  },
  { 
    id: '4', 
    type: 'error', 
    title: 'Просроченный счет', 
    message: 'Счет INV-2024-004 просрочен. Требуется срочная оплата', 
    time: '1 день назад', 
    priority: 'high',
    action: 'Оплатить'
  }
];

// Данные о службах доставки
const carriers: Carrier[] = [
  {
    id: '1',
    name: 'DHL Express',
    logo: '🚀',
    rating: 4.8,
    deliveryTime: '1-2 дня',
    reliability: 98,
    coverage: ['Международная', 'По всей России', 'Крупные города'],
    features: ['Экспресс-доставка', 'Страхование', 'Трекинг GPS', 'Таможенное оформление'],
    contact: {
      phone: '+7 (800) 555-1234',
      email: 'support@dhl.ru',
      supportHours: '24/7'
    }
  },
  {
    id: '2',
    name: 'CDEK',
    logo: '📦',
    rating: 4.6,
    deliveryTime: '2-4 дня',
    reliability: 95,
    coverage: ['Вся Россия', 'СНГ'],
    features: ['До пункта выдачи', 'Курьерская доставка', 'Примерка', 'Наложенный платеж'],
    contact: {
      phone: '+7 (495) 123-4567',
      email: 'info@cdek.ru',
      supportHours: '8:00-22:00'
    }
  },
  {
    id: '3',
    name: 'Почта России',
    logo: '📮',
    rating: 3.9,
    deliveryTime: '5-14 дней',
    reliability: 85,
    coverage: ['Вся Россия', 'Международная'],
    features: ['Экономичная', 'До отделения', 'Международная'],
    contact: {
      phone: '+7 (800) 100-0000',
      email: 'client@russianpost.ru',
      supportHours: '9:00-18:00'
    }
  }
];

// Утилиты
const getStatusColor = (status: DeliveryStatus['status']) => {
  return {
    pending: COLORS.orange,
    processing: COLORS.blue,
    shipped: COLORS.cyan,
    in_transit: COLORS.indigo,
    out_for_delivery: COLORS.purple,
    delivered: COLORS.emerald,
    cancelled: COLORS.error,
    delayed: COLORS.rose
  }[status];
};

const getStatusText = (status: DeliveryStatus['status']) => {
  return {
    pending: 'Ожидание',
    processing: 'Обработка',
    shipped: 'Отправлено',
    in_transit: 'В пути',
    out_for_delivery: 'У курьера',
    delivered: 'Доставлено',
    cancelled: 'Отменено',
    delayed: 'Задержка'
  }[status];
};

const getInvoiceStatusColor = (status: Invoice['status']) => {
  return {
    paid: COLORS.emerald,
    pending: COLORS.orange,
    overdue: COLORS.error,
    disputed: COLORS.rose
  }[status];
};

const getInvoiceStatusText = (status: Invoice['status']) => {
  return {
    paid: 'Оплачен',
    pending: 'Ожидает оплаты',
    overdue: 'Просрочен',
    disputed: 'Оспорен'
  }[status];
};

const getPriorityColor = (priority: Package['priority']) => {
  return {
    low: COLORS.gray,
    medium: COLORS.blue,
    high: COLORS.orange,
    express: COLORS.purple
  }[priority];
};

const getPriorityText = (priority: Package['priority']) => {
  return {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    express: 'Экспресс'
  }[priority];
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Bento Card компонент (улучшенный)
const BentoCard = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode;
  className?: string;
  enableEffects?: boolean;
  glowColor?: string;
  onClick?: () => void;
  colSpan?: number;
  rowSpan?: number;
  variant?: 'default' | 'wide' | 'tall' | 'grid' | 'compact';
  gradient?: boolean;
}>(({ 
  children, 
  className = '', 
  enableEffects = true, 
  glowColor = COLORS.blue, 
  onClick, 
  colSpan = 1, 
  rowSpan = 1, 
  variant = 'default',
  gradient = false
}, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!enableEffects || !cardRef.current) return;

    const card = cardRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const relativeX = (x / rect.width) * 100;
      const relativeY = (y / rect.height) * 100;

      card.style.setProperty('--glow-x', `${relativeX}%`);
      card.style.setProperty('--glow-y', `${relativeY}%`);
      card.style.setProperty('--glow-intensity', '1');
    };

    const handleMouseLeave = () => {
      card.style.setProperty('--glow-intensity', '0');
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enableEffects]);

  const colSpanClass = {
    1: '',
    2: 'lg:col-span-2',
    3: 'lg:col-span-3',
    4: 'lg:col-span-4',
  }[colSpan];

  const rowSpanClass = {
    1: '',
    2: 'lg:row-span-2',
    3: 'lg:row-span-3',
  }[rowSpan];

  const variantClass = {
    default: '',
    wide: 'lg:col-span-2',
    tall: 'lg:row-span-2',
    grid: 'lg:col-span-2 lg:row-span-2',
    compact: ''
  }[variant];

  const gradientClass = gradient ? 'bg-gradient-to-br from-white/10 to-white/5' : 'bg-white/5';

  return (
    <div
      ref={ref || cardRef}
      className={`
        relative overflow-hidden 
        rounded-2xl border border-white/10 
        ${gradientClass} backdrop-blur-lg 
        transition-all duration-300 
        hover:border-white/20 hover:bg-white/10
        w-full max-w-full
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${colSpanClass}
        ${rowSpanClass}
        ${variantClass}
        ${className}
      `}
      style={{
        '--glow-x': '50%',
        '--glow-y': '50%',
        '--glow-intensity': '0',
        '--glow-color': glowColor,
      } as React.CSSProperties}
      onClick={onClick}
    >
      {enableEffects && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{
            opacity: 'var(--glow-intensity)',
            background: `radial-gradient(400px circle at var(--glow-x) var(--glow-y), 
                         rgba(var(--glow-color), 0.15) 0%, 
                         rgba(var(--glow-color), 0.08) 30%, 
                         transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
});

BentoCard.displayName = 'BentoCard';

// Modal Component (улучшенный)
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md',
  showCloseButton = true
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  showCloseButton?: boolean;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    fullscreen: 'max-w-full max-h-full m-4'
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 w-full ${sizeClasses[size]} border border-white/10 max-h-[90vh] overflow-y-auto shadow-2xl`}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              {title && <h3 className="text-white font-bold text-xl">{title}</h3>}
              {showCloseButton && (
                <button
                  className="text-white/60 hover:text-white transition-colors text-2xl p-1"
                  onClick={onClose}
                >
                  ×
                </button>
              )}
            </div>
          )}
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Компонент карточки статуса доставки (улучшенный)
const DeliveryStatusCard = ({ delivery, onClick }: { delivery: DeliveryStatus; onClick?: () => void }) => {
  const statusColor = getStatusColor(delivery.status);
  const progress = delivery.steps.filter(step => step.status === 'completed').length;
  const totalSteps = delivery.steps.length;
  const progressPercentage = (progress / totalSteps) * 100;
  
  return (
    <BentoCard className="p-4 cursor-pointer" glowColor={statusColor} onClick={onClick} gradient>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-semibold text-sm">#{delivery.trackingNumber}</h3>
            <span className="text-xs px-1.5 py-0.5 rounded bg-white/10 text-white/60">
              {delivery.carrier}
            </span>
          </div>
          <div className="text-white/60 text-xs mb-2">{delivery.description}</div>
          <div className="flex items-center gap-3 text-xs text-white/60">
            <span>📦 {delivery.packageInfo.items} шт</span>
            <span>⚖️ {delivery.packageInfo.weight}</span>
            <span>🏷️ {delivery.packageInfo.type === 'fragile' ? 'Хрупкое' : 
                       delivery.packageInfo.type === 'express' ? 'Срочное' :
                       delivery.packageInfo.type === 'oversized' ? 'Крупное' : 'Стандарт'}</span>
          </div>
        </div>
        <div className="text-right">
          <span 
            className="px-2 py-1 rounded-full text-xs border font-medium"
            style={{
              backgroundColor: `rgba(${statusColor}, 0.2)`,
              color: `rgb(${statusColor})`,
              borderColor: `rgba(${statusColor}, 0.3)`
            }}
          >
            {getStatusText(delivery.status)}
          </span>
          {delivery.insurance && (
            <div className="text-green-400 text-xs mt-1">🛡️ Застраховано</div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-white/60 mb-1">
          <span>Прогресс доставки</span>
          <span>{progress}/{totalSteps} этапов</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${progressPercentage}%`,
              backgroundColor: `rgb(${statusColor})`
            }}
          />
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Получатель:</span>
          <span className="text-white font-medium">{delivery.recipient}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Доставка:</span>
          <span className="text-white font-medium">{delivery.estimatedDelivery}</span>
        </div>
        {delivery.currentLocation && (
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Местоположение:</span>
            <span className="text-white">{delivery.currentLocation}</span>
          </div>
        )}
        {delivery.distance && (
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Пройдено пути:</span>
            <span className="text-white">{delivery.distance.traveled}/{delivery.distance.total} {delivery.distance.unit}</span>
          </div>
        )}
      </div>

      {/* Alerts */}
      {delivery.alerts.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 rounded-lg p-2">
          <span>⚠️</span>
          <span>{delivery.alerts[0]}</span>
        </div>
      )}
    </BentoCard>
  );
};

// Компонент карточки посылки (улучшенный)
const PackageCard = ({ pkg, onClick }: { pkg: Package; onClick?: () => void }) => {
  const statusColor = getStatusColor(pkg.status);
  const priorityColor = getPriorityColor(pkg.priority);
  
  return (
    <BentoCard className="p-4 cursor-pointer" glowColor={statusColor} onClick={onClick} gradient>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{pkg.icon}</div>
          <div>
            <h3 className="text-white font-semibold text-sm">{pkg.name}</h3>
            <div className="text-white/60 text-xs">#{pkg.trackingNumber}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                {pkg.carrier}
              </span>
              <span 
                className="text-xs px-1.5 py-0.5 rounded border"
                style={{
                  backgroundColor: `rgba(${priorityColor}, 0.2)`,
                  color: `rgb(${priorityColor})`,
                  borderColor: `rgba(${priorityColor}, 0.3)`
                }}
              >
                {getPriorityText(pkg.priority)}
              </span>
            </div>
          </div>
        </div>
        <span 
          className="px-2 py-1 rounded-full text-xs border font-medium"
          style={{
            backgroundColor: `rgba(${statusColor}, 0.2)`,
            color: `rgb(${statusColor})`,
            borderColor: `rgba(${statusColor}, 0.3)`
          }}
        >
          {getStatusText(pkg.status)}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Обновлено:</span>
          <span className="text-white">{pkg.lastUpdate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Доставка:</span>
          <span className="text-white font-medium">{pkg.estimatedDelivery}</span>
        </div>
        {pkg.currentLocation && (
          <div className="flex justify-between">
            <span className="text-white/60">Место:</span>
            <span className="text-white">{pkg.currentLocation}</span>
          </div>
        )}
        {pkg.delay && (
          <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-400/10 rounded-lg p-2">
            <span>⚠️</span>
            <span>Задержка: {pkg.delay.reason}</span>
          </div>
        )}
      </div>
    </BentoCard>
  );
};

// Компонент карточки способа доставки (улучшенный)
const ShippingMethodCard = ({ method, onSelect }: { method: ShippingMethod; onSelect?: () => void }) => {
  return (
    <BentoCard 
      className="p-4 cursor-pointer" 
      glowColor={method.recommended ? COLORS.emerald : COLORS.blue}
      onClick={onSelect}
      gradient
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{method.icon}</div>
          <div>
            <h3 className="text-white font-semibold text-sm">{method.name}</h3>
            <div className="text-white/60 text-xs">{method.carrier}</div>
          </div>
        </div>
        <div className="text-right">
          {method.recommended && (
            <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30 mb-1">
              Рекомендуем
            </span>
          )}
          <div className="flex items-center gap-1 text-xs text-white/60">
            <span>⭐ {method.reliability}%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-white font-bold text-lg">{method.price}</div>
        <div className="text-white/60 text-sm">{method.deliveryTime}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="bg-white/5 rounded p-2 text-center">
          <div className="text-white/60">Макс. вес</div>
          <div className="text-white font-medium">{method.maxWeight}</div>
        </div>
        <div className="bg-white/5 rounded p-2 text-center">
          <div className="text-white/60">Трекинг</div>
          <div className="text-white font-medium capitalize">{method.trackingLevel}</div>
        </div>
      </div>

      <div className="space-y-1">
        {method.features.slice(0, 3).map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-xs text-white/60">
            <span className="text-green-400">✓</span>
            <span>{feature}</span>
          </div>
        ))}
        {method.features.length > 3 && (
          <div className="text-white/40 text-xs">
            +{method.features.length - 3} других преимуществ
          </div>
        )}
      </div>

      {method.insuranceIncluded && (
        <div className="flex items-center gap-2 text-xs text-green-400 mt-2">
          <span>🛡️</span>
          <span>Страхование включено</span>
        </div>
      )}
    </BentoCard>
  );
};

// Компонент карточки счета (улучшенный)
const InvoiceCard = ({ invoice, onClick }: { invoice: Invoice; onClick?: () => void }) => {
  const statusColor = getInvoiceStatusColor(invoice.status);
  
  return (
    <BentoCard className="p-4 cursor-pointer" glowColor={statusColor} onClick={onClick} gradient>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-sm mb-1">{invoice.number}</h3>
          <div className="text-white/60 text-xs">{invoice.date}</div>
          {invoice.paymentMethod && (
            <div className="text-white/40 text-xs mt-1">{invoice.paymentMethod}</div>
          )}
        </div>
        <div className="text-right">
          <div className="text-white font-bold text-lg">{invoice.amount}</div>
          <span 
            className="px-2 py-1 rounded-full text-xs border font-medium mt-1"
            style={{
              backgroundColor: `rgba(${statusColor}, 0.2)`,
              color: `rgb(${statusColor})`,
              borderColor: `rgba(${statusColor}, 0.3)`
            }}
          >
            {getInvoiceStatusText(invoice.status)}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Способ доставки:</span>
          <span className="text-white">{invoice.shippingMethod}</span>
        </div>
        {invoice.trackingNumber && (
          <div className="flex justify-between">
            <span className="text-white/60">Трекинг:</span>
            <span className="text-white">#{invoice.trackingNumber}</span>
          </div>
        )}
        {invoice.dueDate && (
          <div className="flex justify-between">
            <span className="text-white/60">Оплатить до:</span>
            <span className={`font-medium ${
              invoice.status === 'overdue' ? 'text-rose-400' : 'text-white'
            }`}>
              {invoice.dueDate}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-white/60">НДС:</span>
          <span className="text-white">{invoice.taxAmount}</span>
        </div>
      </div>

      {invoice.status === 'overdue' && (
        <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-400/10 rounded-lg p-2 mt-2">
          <span>⚠️</span>
          <span>Срочно оплатите для избежания штрафов</span>
        </div>
      )}
    </BentoCard>
  );
};

// Компонент Alert Widget
const AlertWidget = ({ alert, onAction }: { alert: DeliveryAlert; onAction?: (alert: DeliveryAlert) => void }) => {
  const alertColors = {
    warning: COLORS.amber,
    info: COLORS.blue,
    success: COLORS.emerald,
    error: COLORS.rose
  };

  const alertColor = alertColors[alert.type];
  
  return (
    <BentoCard className="p-4 cursor-pointer" glowColor={alertColor}>
      <motion.div 
        className="h-full flex flex-col justify-between"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          backgroundColor: `rgba(${alertColor}, 0.1)`,
          borderColor: `rgba(${alertColor}, 0.2)`,
          color: `rgb(${alertColor})`
        }}
      >
        <div className="flex items-start justify-between mb-2 gap-2">
          <div className="flex items-center gap-2 flex-grow">
            <div className="font-medium text-sm line-clamp-2 flex-grow">{alert.title}</div>
          </div>
          <span 
            className="px-2 py-1 rounded-full text-xs border flex-shrink-0"
            style={{
              backgroundColor: `rgba(${alertColor}, 0.2)`,
              borderColor: `rgba(${alertColor}, 0.3)`
            }}
          >
            {alert.priority === 'high' ? 'Важно' : alert.priority === 'medium' ? 'Инфо' : 'Уведомление'}
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-white/80 text-xs line-clamp-2">{alert.message}</p>
          <div className="flex justify-between items-center">
            <div className="text-white/60 text-xs">{alert.time}</div>
            {alert.action && (
              <button 
                className="text-white/80 text-xs hover:text-white cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction?.(alert);
                }}
              >
                {alert.action} →
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </BentoCard>
  );
};

// Компонент KPI (улучшенный)
const KPIWidget = ({ title, value, change, description, icon, color, trend, onClick }: {
  title: string;
  value: string;
  change?: string;
  description: string;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  onClick?: () => void;
}) => {
  const trendIcon = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
  const trendColor = trend === 'up' ? COLORS.emerald : trend === 'down' ? COLORS.rose : COLORS.gray;
  
  return (
    <BentoCard className="p-4 cursor-pointer" glowColor={color} onClick={onClick} gradient>
      <div className="flex items-start justify-between mb-3">
        <div className="text-xl font-bold text-white leading-tight">
          {value}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-lg">{icon}</div>
          {change && trend && (
            <div className="flex items-center gap-1 text-xs" style={{ color: `rgb(${trendColor})` }}>
              <span>{trendIcon}</span>
              <span>{change}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-sm font-medium">{title}</span>
        </div>
        
        <div className="text-white/60 text-sm">
          {description}
        </div>
      </div>
    </BentoCard>
  );
};

// Компонент карточки службы доставки
const CarrierCard = ({ carrier, onSelect }: { carrier: Carrier; onSelect?: () => void }) => {
  return (
    <BentoCard className="p-4 cursor-pointer" glowColor={COLORS.blue} onClick={onSelect} gradient>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{carrier.logo}</div>
          <div>
            <h3 className="text-white font-semibold text-sm">{carrier.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <RatingStars rating={carrier.rating} />
              <span className="text-white/60 text-xs">{carrier.reliability}% надежность</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="bg-white/5 rounded p-2 text-center">
          <div className="text-white/60">Срок доставки</div>
          <div className="text-white font-medium">{carrier.deliveryTime}</div>
        </div>
        <div className="bg-white/5 rounded p-2 text-center">
          <div className="text-white/60">Поддержка</div>
          <div className="text-white font-medium">{carrier.contact.supportHours}</div>
        </div>
      </div>

      <div className="space-y-1 mb-3">
        {carrier.features.slice(0, 3).map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-xs text-white/60">
            <span className="text-green-400">✓</span>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-white/60">
        <span>{carrier.contact.phone}</span>
        <button className="text-blue-400 hover:text-blue-300 transition-colors">
          Контакты
        </button>
      </div>
    </BentoCard>
  );
};

// Компонент рейтинга звездами
const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`text-xs ${
            index < fullStars ? 'text-yellow-400' : 
            index === fullStars && hasHalfStar ? 'text-yellow-400' : 'text-gray-500'
          }`}
        >
          {index < fullStars ? '★' : 
           index === fullStars && hasHalfStar ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
};

// Основной компонент страницы доставки (максимально улучшенный)
export default function DeliveryServicesPage() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [alerts, setAlerts] = useState<DeliveryAlert[]>(deliveryAlerts);
  
  // Состояния для модальных окон
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isCarrierModalOpen, setIsCarrierModalOpen] = useState(false);
  const [isNewDeliveryModalOpen, setIsNewDeliveryModalOpen] = useState(false);
  
  // Выбранные элементы
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryStatus | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');

  // KPI данные
  const deliveryKPIs = [
    { 
      title: 'Активные посылки', 
      value: '5', 
      change: '+1', 
      description: 'в процессе доставки', 
      icon: '📦', 
      color: COLORS.blue,
      trend: 'up' as const
    },
    { 
      title: 'Доставлено', 
      value: '23', 
      change: '+5', 
      description: 'за этот месяц', 
      icon: '✅', 
      color: COLORS.emerald,
      trend: 'up' as const
    },
    { 
      title: 'В пути', 
      value: '2', 
      description: 'обновление сегодня', 
      icon: '🚚', 
      color: COLORS.purple,
      trend: 'stable' as const
    },
    { 
      title: 'Задержано', 
      value: '1', 
      description: 'требует внимания', 
      icon: '⚠️', 
      color: COLORS.rose,
      trend: 'down' as const
    }
  ];

  // Фильтрация данных
  const filteredPackages = activePackages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.trackingNumber.includes(searchQuery);
    const matchesStatus = selectedStatus === 'all' || pkg.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredDeliveries = deliveryStatuses.filter(delivery => {
    const matchesSearch = delivery.trackingNumber.includes(searchQuery) ||
                         delivery.recipient.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || delivery.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(formatTime(now));
      setCurrentDate(formatDate(now));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // Обработчики модальных окон
  const handleViewDelivery = (delivery: DeliveryStatus) => {
    setSelectedDelivery(delivery);
    setIsDeliveryModalOpen(true);
  };

  const handleViewPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsPackageModalOpen(true);
  };

  const handleViewShippingMethod = (method: ShippingMethod) => {
    setSelectedShippingMethod(method);
    setIsShippingModalOpen(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  const handleViewCarrier = (carrier: Carrier) => {
    setSelectedCarrier(carrier);
    setIsCarrierModalOpen(true);
  };

  const handleTrackPackage = () => {
    if (trackingNumber.trim()) {
      const foundPackage = activePackages.find(pkg => 
        pkg.trackingNumber === trackingNumber
      );
      if (foundPackage) {
        setSelectedPackage(foundPackage);
        setIsPackageModalOpen(true);
      } else {
        setIsTrackingModalOpen(true);
      }
    }
  };

  const handleAlertAction = (alert: DeliveryAlert) => {
    if (alert.relatedPackage) {
      const foundPackage = activePackages.find(pkg => 
        pkg.trackingNumber === alert.relatedPackage
      );
      if (foundPackage) {
        setSelectedPackage(foundPackage);
        setIsPackageModalOpen(true);
      }
    }
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const unreadAlertsCount = alerts.length;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${COLORS.primary}`}>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BentoCard className="p-6" variant="wide" glowColor={COLORS.blue} gradient>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">🚚 Служба доставки</h1>
                <p className="text-white/60 text-lg mb-4">
                  Полный контроль над вашими отправлениями. Отслеживание в реальном времени, управление доставками и счетами.
                </p>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>5 активных посылок</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>4 службы доставки</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>Поддержка 24/7</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl mb-3">
                    👤
                  </div>
                  <div className="text-white font-bold text-lg">Иван Петров</div>
                  <div className="text-white/60 text-sm">Клиент с 2022 года</div>
                </motion.div>
                <motion.button
                  className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsNewDeliveryModalOpen(true)}
                >
                  Новая доставка
                </motion.button>
              </div>
            </div>
          </BentoCard>
        </motion.section>

        {/* Alerts Section */}
        {unreadAlertsCount > 0 && (
          <motion.section 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xl font-semibold text-white">Уведомления</h2>
              <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadAlertsCount} новых
              </span>
              <button 
                className="text-white/60 hover:text-white text-sm transition-colors ml-auto"
                onClick={() => setAlerts([])}
              >
                Очистить все
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
              {alerts.map((alert) => (
                <AlertWidget 
                  key={alert.id} 
                  alert={alert} 
                  onAction={handleAlertAction}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Tracking Search */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <BentoCard className="p-6" glowColor={COLORS.purple} gradient>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-2">🔍 Отследить посылку</h3>
                <p className="text-white/60 text-sm">Введите номер отслеживания для получения актуальной информации о доставке</p>
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Введите номер отслеживания (например, TRK123456789)"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
                  />
                  {trackingNumber && (
                    <button
                      onClick={() => setTrackingNumber('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                    >
                      ×
                    </button>
                  )}
                </div>
                <motion.button
                  onClick={handleTrackPackage}
                  className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!trackingNumber.trim()}
                >
                  <span>Отследить</span>
                  <span>🔍</span>
                </motion.button>
              </div>
            </div>
          </BentoCard>
        </motion.section>

        {/* KPI Section */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Обзор доставок</h2>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>Обновлено: {currentTime}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {deliveryKPIs.map((kpi, index) => (
              <KPIWidget key={index} {...kpi} />
            ))}
          </div>
        </motion.section>

        {/* Navigation Tabs & Filters */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-wrap gap-2 flex-1">
              {[
                { id: 'overview', name: '📊 Обзор', color: 'blue' },
                { id: 'tracking', name: '🚚 Отслеживание', color: 'purple' },
                { id: 'shipping', name: '📦 Способы доставки', color: 'emerald' },
                { id: 'invoices', name: '🧾 Счета', color: 'orange' },
                { id: 'carriers', name: '🏢 Службы доставки', color: 'cyan' }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id 
                      ? `bg-${tab.color}-500 text-white shadow-lg` 
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Обзор */}
          {activeTab === 'overview' && (
            <>
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-2"
              >
                <BentoCard className="p-6" variant="wide" glowColor={COLORS.blue} gradient>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                      <span>📦</span>
                      <span>Активные посылки</span>
                    </h2>
                    <span className="text-white/60 text-sm">
                      {filteredPackages.length} из {activePackages.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPackages.map((pkg) => (
                      <PackageCard 
                        key={pkg.id} 
                        pkg={pkg} 
                        onClick={() => handleViewPackage(pkg)}
                      />
                    ))}
                  </div>
                  {filteredPackages.length === 0 && (
                    <div className="text-center py-8 text-white/60">
                      <div className="text-4xl mb-2">📭</div>
                      <div>Посылки не найдены</div>
                      <div className="text-sm">Попробуйте изменить параметры поиска</div>
                    </div>
                  )}
                </BentoCard>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-6"
              >
                <BentoCard className="p-6" glowColor={COLORS.purple} gradient>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span>🚀</span>
                    <span>Быстрые действия</span>
                  </h3>
                  <div className="space-y-3">
                    <motion.button 
                      className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsNewDeliveryModalOpen(true)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📋</span>
                        <div>
                          <div className="font-semibold">Оформить доставку</div>
                          <div className="text-white/60 text-sm">Новая посылка</div>
                        </div>
                      </div>
                    </motion.button>
                    
                    <motion.button 
                      className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🏪</span>
                        <div>
                          <div className="font-semibold">Пункты выдачи</div>
                          <div className="text-white/60 text-sm">Ближайшие к вам</div>
                        </div>
                      </div>
                    </motion.button>
                    
                    <motion.button 
                      className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📞</span>
                        <div>
                          <div className="font-semibold">Поддержка</div>
                          <div className="text-white/60 text-sm">Помощь 24/7</div>
                        </div>
                      </div>
                    </motion.button>

                    <motion.button 
                      className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📊</span>
                        <div>
                          <div className="font-semibold">Аналитика</div>
                          <div className="text-white/60 text-sm">Статистика доставок</div>
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </BentoCard>

                <BentoCard className="p-6" glowColor={COLORS.orange} gradient>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span>⏰</span>
                    <span>Срочные действия</span>
                  </h3>
                  <div className="space-y-3">
                    {invoices.filter(inv => inv.status === 'overdue').map(invoice => (
                      <motion.button 
                        key={invoice.id}
                        className="w-full p-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-rose-400 transition-all text-left"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-sm">{invoice.number}</div>
                            <div className="text-rose-300/60 text-xs">Просрочен</div>
                          </div>
                          <div className="text-sm font-bold">{invoice.amount}</div>
                        </div>
                      </motion.button>
                    ))}
                    {activePackages.filter(pkg => pkg.status === 'delayed').map(pkg => (
                      <motion.button 
                        key={pkg.id}
                        className="w-full p-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl text-amber-400 transition-all text-left"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleViewPackage(pkg)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-sm">{pkg.name}</div>
                            <div className="text-amber-300/60 text-xs">Задержана</div>
                          </div>
                          <div className="text-sm">#{pkg.trackingNumber}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </BentoCard>
              </motion.section>
            </>
          )}

          {/* Отслеживание */}
          {activeTab === 'tracking' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-3"
            >
              <BentoCard className="p-6" variant="wide" glowColor={COLORS.purple} gradient>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <span>🚚</span>
                    <span>Детальное отслеживание</span>
                  </h2>
                  <span className="text-white/60 text-sm">
                    {filteredDeliveries.length} из {deliveryStatuses.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDeliveries.map((delivery) => (
                    <DeliveryStatusCard 
                      key={delivery.id} 
                      delivery={delivery} 
                      onClick={() => handleViewDelivery(delivery)}
                    />
                  ))}
                </div>
                {filteredDeliveries.length === 0 && (
                  <div className="text-center py-12 text-white/60">
                    <div className="text-4xl mb-2">🔍</div>
                    <div>Доставки не найдены</div>
                    <div className="text-sm">Попробуйте изменить параметры поиска</div>
                  </div>
                )}
              </BentoCard>
            </motion.section>
          )}

          {/* Способы доставки */}
          {activeTab === 'shipping' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-3"
            >
              <BentoCard className="p-6" variant="wide" glowColor={COLORS.emerald} gradient>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <span>📦</span>
                  <span>Способы доставки</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shippingMethods.map((method) => (
                    <ShippingMethodCard 
                      key={method.id} 
                      method={method} 
                      onSelect={() => handleViewShippingMethod(method)}
                    />
                  ))}
                </div>
              </BentoCard>
            </motion.section>
          )}

          {/* Счета */}
          {activeTab === 'invoices' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-3"
            >
              <BentoCard className="p-6" variant="wide" glowColor={COLORS.orange} gradient>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <span>🧾</span>
                  <span>Счета и квитанции</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {invoices.map((invoice) => (
                    <InvoiceCard 
                      key={invoice.id} 
                      invoice={invoice} 
                      onClick={() => handleViewInvoice(invoice)}
                    />
                  ))}
                </div>
              </BentoCard>
            </motion.section>
          )}

          {/* Службы доставки */}
          {activeTab === 'carriers' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-3"
            >
              <BentoCard className="p-6" variant="wide" glowColor={COLORS.cyan} gradient>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <span>🏢</span>
                  <span>Службы доставки</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {carriers.map((carrier) => (
                    <CarrierCard 
                      key={carrier.id} 
                      carrier={carrier} 
                      onSelect={() => handleViewCarrier(carrier)}
                    />
                  ))}
                </div>
              </BentoCard>
            </motion.section>
          )}
        </div>
      </main>

      {/* Модальное окно деталей доставки */}
      <Modal 
        isOpen={isDeliveryModalOpen} 
        onClose={() => setIsDeliveryModalOpen(false)}
        title="🚚 Детали доставки"
        size="lg"
      >
        {selectedDelivery && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-bold text-xl">Посылка #{selectedDelivery.trackingNumber}</h3>
                <p className="text-white/60">{selectedDelivery.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-1 rounded bg-white/10 text-white/60">
                    {selectedDelivery.carrier}
                  </span>
                  {selectedDelivery.insurance && (
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">
                      🛡️ Застраховано
                    </span>
                  )}
                  {selectedDelivery.signatureRequired && (
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                      ✍️ Требуется подпись
                    </span>
                  )}
                </div>
              </div>
              <span 
                className="px-3 py-1 rounded-full text-sm border font-medium"
                style={{
                  backgroundColor: `rgba(${getStatusColor(selectedDelivery.status)}, 0.2)`,
                  color: `rgb(${getStatusColor(selectedDelivery.status)})`,
                  borderColor: `rgba(${getStatusColor(selectedDelivery.status)}, 0.3)`
                }}
              >
                {getStatusText(selectedDelivery.status)}
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Получатель</div>
                <div className="text-white font-semibold">{selectedDelivery.recipient}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Ожидаемая доставка</div>
                <div className="text-white font-semibold">{selectedDelivery.estimatedDelivery}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Вес</div>
                <div className="text-white font-semibold">{selectedDelivery.packageInfo.weight}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Габариты</div>
                <div className="text-white font-semibold">{selectedDelivery.packageInfo.dimensions}</div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Адрес доставки</h4>
              <p className="text-white/60 bg-white/5 rounded-lg p-4">{selectedDelivery.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Тип посылки</div>
                <div className="text-white font-semibold capitalize">
                  {selectedDelivery.packageInfo.type === 'fragile' ? 'Хрупкое' : 
                   selectedDelivery.packageInfo.type === 'express' ? 'Срочное' :
                   selectedDelivery.packageInfo.type === 'oversized' ? 'Крупногабаритное' : 'Стандартное'}
                </div>
              </div>
              {selectedDelivery.packageInfo.declaredValue && (
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm">Объявленная ценность</div>
                  <div className="text-white font-semibold">{selectedDelivery.packageInfo.declaredValue}</div>
                </div>
              )}
            </div>

            {selectedDelivery.distance && (
              <div>
                <h4 className="text-white font-semibold mb-3">Прогресс маршрута</h4>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between text-sm text-white/60 mb-2">
                    <span>Пройдено</span>
                    <span>{selectedDelivery.distance.traveled} / {selectedDelivery.distance.total} {selectedDelivery.distance.unit}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(selectedDelivery.distance.traveled / selectedDelivery.distance.total) * 100}%`,
                        backgroundColor: `rgb(${getStatusColor(selectedDelivery.status)})`
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedDelivery.alerts.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-3">Уведомления</h4>
                <div className="space-y-2">
                  {selectedDelivery.alerts.map((alert, index) => (
                    <div key={index} className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                      <span className="text-amber-400">⚠️</span>
                      <span className="text-amber-400 text-sm">{alert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-white font-semibold mb-4">История перемещений</h4>
              <div className="space-y-4">
                {selectedDelivery.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-4">
                    <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                      step.status === 'completed' ? 'bg-green-400' :
                      step.status === 'current' ? 'bg-blue-400 animate-pulse' :
                      step.status === 'delayed' ? 'bg-rose-400' :
                      'bg-white/20'
                    }`} />
                    <div className="flex-1 pb-4 border-b border-white/10 last:border-b-0">
                      <div className="flex items-start justify-between">
                        <div className="text-white font-medium">{step.name}</div>
                        {step.estimatedTime && (
                          <div className="text-white/60 text-sm">{step.estimatedTime}</div>
                        )}
                      </div>
                      {step.timestamp && (
                        <div className="text-white/60 text-sm mt-1">{step.timestamp}</div>
                      )}
                      {step.location && (
                        <div className="text-white/60 text-sm">{step.location}</div>
                      )}
                      {step.description && (
                        <div className="text-white/60 text-sm mt-1">{step.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold">
                Получить уведомления
              </button>
              <button className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
                Связаться с поддержкой
              </button>
              <button className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
                📋
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно деталей посылки */}
      <Modal 
        isOpen={isPackageModalOpen} 
        onClose={() => setIsPackageModalOpen(false)}
        title="📦 Детали посылки"
        size="lg"
      >
        {selectedPackage && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{selectedPackage.icon}</div>
                <div>
                  <h3 className="text-white font-bold text-xl">{selectedPackage.name}</h3>
                  <div className="text-white/60">#{selectedPackage.trackingNumber}</div>
                </div>
              </div>
              <div className="text-right">
                <span 
                  className="px-3 py-1 rounded-full text-sm border font-medium"
                  style={{
                    backgroundColor: `rgba(${getStatusColor(selectedPackage.status)}, 0.2)`,
                    color: `rgb(${getStatusColor(selectedPackage.status)})`,
                    borderColor: `rgba(${getStatusColor(selectedPackage.status)}, 0.3)`
                  }}
                >
                  {getStatusText(selectedPackage.status)}
                </span>
                <div className="mt-2">
                  <span 
                    className="px-2 py-1 rounded-full text-xs border"
                    style={{
                      backgroundColor: `rgba(${getPriorityColor(selectedPackage.priority)}, 0.2)`,
                      color: `rgb(${getPriorityColor(selectedPackage.priority)})`,
                      borderColor: `rgba(${getPriorityColor(selectedPackage.priority)}, 0.3)`
                    }}
                  >
                    {getPriorityText(selectedPackage.priority)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Перевозчик</div>
                <div className="text-white font-semibold">{selectedPackage.carrier}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Обновлено</div>
                <div className="text-white font-semibold">{selectedPackage.lastUpdate}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Ожидаемая доставка</div>
                <div className="text-white font-semibold">{selectedPackage.estimatedDelivery}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Трек номер</div>
                <div className="text-white font-semibold">{selectedPackage.trackingNumber}</div>
              </div>
            </div>

            {selectedPackage.currentLocation && (
              <div>
                <h4 className="text-white font-semibold mb-3">Текущее местоположение</h4>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white">{selectedPackage.currentLocation}</div>
                </div>
              </div>
            )}

            {selectedPackage.delay && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <span className="text-amber-400 text-xl">⚠️</span>
                  <div>
                    <div className="text-amber-400 font-semibold">Задержка доставки</div>
                    <div className="text-amber-300 text-sm mt-1">{selectedPackage.delay.reason}</div>
                    <div className="text-amber-300 text-sm">Новая дата: {selectedPackage.delay.newDate}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold">
                Получить уведомления
              </button>
              <button className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
                Связаться с поддержкой
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно способа доставки */}
      <Modal 
        isOpen={isShippingModalOpen} 
        onClose={() => setIsShippingModalOpen(false)}
        title="🚚 Способ доставки"
        size="lg"
      >
        {selectedShippingMethod && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{selectedShippingMethod.icon}</div>
                <div>
                  <h3 className="text-white font-bold text-xl">{selectedShippingMethod.name}</h3>
                  <div className="text-white/60">{selectedShippingMethod.description}</div>
                </div>
              </div>
              {selectedShippingMethod.recommended && (
                <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400 border border-green-500/30">
                  Рекомендуем
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Стоимость</div>
                <div className="text-white font-bold text-lg">{selectedShippingMethod.price}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Срок доставки</div>
                <div className="text-white font-semibold">{selectedShippingMethod.deliveryTime}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Надежность</div>
                <div className="text-white font-semibold">{selectedShippingMethod.reliability}%</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Макс. вес</div>
                <div className="text-white font-semibold">{selectedShippingMethod.maxWeight}</div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Особенности</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedShippingMethod.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-white text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Уровень трекинга</div>
                <div className="text-white font-semibold capitalize">{selectedShippingMethod.trackingLevel}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Страхование</div>
                <div className="text-white font-semibold">
                  {selectedShippingMethod.insuranceIncluded ? 'Включено' : 'Не включено'}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Варианты доставки</h4>
              <div className="flex flex-wrap gap-2">
                {selectedShippingMethod.deliveryOptions.map((option, index) => (
                  <span key={index} className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm">
                    {option}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold">
                Выбрать этот способ
              </button>
              <button className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
                Сравнить с другими
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно счета */}
      <Modal 
        isOpen={isInvoiceModalOpen} 
        onClose={() => setIsInvoiceModalOpen(false)}
        title="🧾 Детали счета"
        size="lg"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-bold text-xl">{selectedInvoice.number}</h3>
                <div className="text-white/60">Дата: {selectedInvoice.date}</div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-2xl">{selectedInvoice.amount}</div>
                <span 
                  className="px-3 py-1 rounded-full text-sm border font-medium mt-2"
                  style={{
                    backgroundColor: `rgba(${getInvoiceStatusColor(selectedInvoice.status)}, 0.2)`,
                    color: `rgb(${getInvoiceStatusColor(selectedInvoice.status)})`,
                    borderColor: `rgba(${getInvoiceStatusColor(selectedInvoice.status)}, 0.3)`
                  }}
                >
                  {getInvoiceStatusText(selectedInvoice.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Способ доставки</div>
                <div className="text-white font-semibold">{selectedInvoice.shippingMethod}</div>
              </div>
              {selectedInvoice.trackingNumber && (
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm">Трек номер</div>
                  <div className="text-white font-semibold">#{selectedInvoice.trackingNumber}</div>
                </div>
              )}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Способ оплаты</div>
                <div className="text-white font-semibold">{selectedInvoice.paymentMethod || 'Не указан'}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">НДС</div>
                <div className="text-white font-semibold">{selectedInvoice.taxAmount}</div>
              </div>
            </div>

            {selectedInvoice.dueDate && (
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white/60 text-sm">Срок оплаты</div>
                    <div className={`text-lg font-semibold ${
                      selectedInvoice.status === 'overdue' ? 'text-rose-400' : 'text-white'
                    }`}>
                      {selectedInvoice.dueDate}
                    </div>
                  </div>
                  {selectedInvoice.status === 'overdue' && (
                    <div className="text-rose-400 text-sm font-semibold">
                      Просрочен
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-white font-semibold mb-3">Состав счета</h4>
              <div className="space-y-2">
                {selectedInvoice.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                    <div>
                      <div className="text-white font-medium">{item.name}</div>
                      <div className="text-white/60 text-sm">
                        {item.quantity} × {item.price}
                        {item.type === 'discount' && ' (скидка)'}
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      item.type === 'discount' ? 'text-green-400' : 'text-white'
                    }`}>
                      {item.type === 'discount' ? '-' : ''}{item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              {selectedInvoice.status !== 'paid' && (
                <button className="flex-1 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors font-semibold">
                  Оплатить счет
                </button>
              )}
              <button className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
                Скачать PDF
              </button>
              <button className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
                📧
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно отслеживания (если посылка не найдена) */}
      <Modal 
        isOpen={isTrackingModalOpen} 
        onClose={() => setIsTrackingModalOpen(false)}
        title="🔍 Результат поиска"
        size="md"
      >
        <div className="text-center py-6">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-white font-bold text-xl mb-2">Посылка не найдена</h3>
          <p className="text-white/60 mb-6">
            Посылка с номером отслеживания <strong>#{trackingNumber}</strong> не найдена в системе.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => setIsTrackingModalOpen(false)}
              className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold"
            >
              Попробовать снова
            </button>
            <button 
              onClick={() => {
                setIsTrackingModalOpen(false);
                setIsNewDeliveryModalOpen(true);
              }}
              className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
            >
              Оформить новую доставку
            </button>
          </div>
        </div>
      </Modal>

      {/* Модальное окно новой доставки */}
      <Modal 
        isOpen={isNewDeliveryModalOpen} 
        onClose={() => setIsNewDeliveryModalOpen(false)}
        title="📦 Новая доставка"
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-4">Информация об отправлении</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Тип отправления</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50">
                    <option>Документы</option>
                    <option>Посылка</option>
                    <option>Хрупкое</option>
                    <option>Крупногабаритное</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Вес (кг)</label>
                  <input type="number" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50" placeholder="0.5" />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Габариты (см)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50" placeholder="Длина" />
                    <input type="number" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50" placeholder="Ширина" />
                    <input type="number" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50" placeholder="Высота" />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Адреса</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Откуда</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50" placeholder="Адрес отправителя" />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Куда</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50" placeholder="Адрес получателя" />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Получатель</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50" placeholder="ФИО получателя" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Дополнительные услуги</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10">
                <input type="checkbox" className="text-blue-500" />
                <span className="text-white text-sm">Страхование</span>
              </label>
              <label className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10">
                <input type="checkbox" className="text-blue-500" />
                <span className="text-white text-sm">Подпись</span>
              </label>
              <label className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10">
                <input type="checkbox" className="text-blue-500" />
                <span className="text-white text-sm">Хрупкое</span>
              </label>
              <label className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10">
                <input type="checkbox" className="text-blue-500" />
                <span className="text-white text-sm">Срочное</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold">
              Рассчитать стоимость
            </button>
            <button
              onClick={() => setIsNewDeliveryModalOpen(false)}
              className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>

      {/* Модальное окно службы доставки */}
      <Modal 
        isOpen={isCarrierModalOpen} 
        onClose={() => setIsCarrierModalOpen(false)}
        title="🏢 Информация о службе доставки"
        size="md"
      >
        {selectedCarrier && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{selectedCarrier.logo}</div>
              <div>
                <h3 className="text-white font-bold text-xl">{selectedCarrier.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <RatingStars rating={selectedCarrier.rating} />
                  <span className="text-white/60">Надежность: {selectedCarrier.reliability}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Срок доставки</div>
                <div className="text-white font-semibold">{selectedCarrier.deliveryTime}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Поддержка</div>
                <div className="text-white font-semibold">{selectedCarrier.contact.supportHours}</div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Зона покрытия</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCarrier.coverage.map((area, index) => (
                  <span key={index} className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Особенности</h4>
              <div className="space-y-2">
                {selectedCarrier.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-white text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">Контактная информация</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Телефон:</span>
                  <span className="text-white">{selectedCarrier.contact.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Email:</span>
                  <span className="text-white">{selectedCarrier.contact.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Часы работы:</span>
                  <span className="text-white">{selectedCarrier.contact.supportHours}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}