'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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

// Типы данных для пассажиров общественного транспорта
interface Passenger {
  id: string;
  personalInfo: {
    fullName: string;
    birthDate: string;
    gender: 'male' | 'female';
    phone: string;
    email?: string;
    address: string;
    documentNumber: string;
    avatar?: string;
  };
  travelInfo: {
    passengerType: 'adult' | 'child' | 'student' | 'pensioner' | 'disabled';
    discountCategory: 'none' | 'student' | 'pensioner' | 'disabled' | 'large_family';
    preferredTransport: 'bus' | 'tram' | 'trolleybus' | 'metro' | 'train';
    frequentRoutes: string[];
    averageTripsPerWeek: number;
  };
  payment: {
    paymentMethod: 'card' | 'mobile' | 'cash' | 'subscription';
    balance: number;
    lastPaymentDate?: string;
    lastPaymentAmount?: number;
    subscription?: {
      type: 'daily' | 'monthly' | 'quarterly' | 'annual';
      validUntil: string;
      price: number;
      autoRenewal: boolean;
    };
  };
  travelHistory: {
    recentTrips: Trip[];
    monthlyStats: {
      tripsCount: number;
      totalSpent: number;
      favoriteRoute: string;
      averageTripCost: number;
      carbonSaved: number;
    };
    yearlyStats: {
      totalTrips: number;
      totalSpent: number;
      mostUsedTransport: string;
    };
  };
  status: 'active' | 'inactive' | 'suspended';
  registrationDate: string;
  lastActivity?: string;
  notes?: string;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    preferredLanguage: 'ru' | 'en';
  };
}

interface Trip {
  id: string;
  passengerId: string;
  transportType: 'bus' | 'tram' | 'trolleybus' | 'metro' | 'train';
  routeNumber: string;
  startStop: string;
  endStop: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  price: number;
  status: 'completed' | 'in_progress' | 'cancelled';
  vehicleId?: string;
  driverId?: string;
  distance?: number;
  carbonSaved?: number;
  delay?: number;
}

interface TransportVehicle {
  id: string;
  type: 'bus' | 'tram' | 'trolleybus' | 'metro' | 'train';
  vehicleNumber: string;
  routeNumber: string;
  capacity: number;
  currentPassengers: number;
  driver: {
    name: string;
    id: string;
    phone: string;
    experience: number;
  };
  status: 'in_depot' | 'on_route' | 'maintenance' | 'out_of_service';
  location?: {
    address: string;
    lat: number;
    lng: number;
    lastUpdate: string;
    speed?: number;
  };
  schedule: {
    startTime: string;
    endTime: string;
    interval: number;
    currentDelay?: number;
  };
  fuelLevel?: number;
  nextMaintenance?: string;
}

interface TravelCard {
  id: string;
  passengerId: string;
  cardNumber: string;
  cardType: 'standard' | 'student' | 'pensioner' | 'social';
  balance: number;
  status: 'active' | 'blocked' | 'expired';
  issueDate: string;
  expiryDate: string;
  lastUsed?: string;
  dailyLimit?: number;
  monthlyLimit?: number;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  cardId: string;
  amount: number;
  type: 'payment' | 'topup' | 'refund';
  timestamp: string;
  location?: string;
  route?: string;
}

// Расширенные моки данных
const passengers: Passenger[] = [
  {
    id: 'ps-001',
    personalInfo: {
      fullName: 'Иванова Мария Сергеевна',
      birthDate: '1985-05-15',
      gender: 'female',
      phone: '+7 (916) 123-45-67',
      email: 'm.ivanova@example.ru',
      address: 'г. Москва, ул. Ленина, д. 15, кв. 34',
      documentNumber: '4510123456',
      avatar: '👩‍💼'
    },
    travelInfo: {
      passengerType: 'adult',
      discountCategory: 'none',
      preferredTransport: 'metro',
      frequentRoutes: ['Красная линия', 'Синяя линия', 'Автобус 217'],
      averageTripsPerWeek: 12
    },
    payment: {
      paymentMethod: 'card',
      balance: 850,
      lastPaymentDate: '2024-06-18',
      lastPaymentAmount: 500,
      subscription: {
        type: 'monthly',
        validUntil: '2024-07-18',
        price: 2500,
        autoRenewal: true
      }
    },
    travelHistory: {
      recentTrips: [
        {
          id: 'tr-001',
          passengerId: 'ps-001',
          transportType: 'metro',
          routeNumber: 'Красная линия',
          startStop: 'Площадь Революции',
          endStop: 'Курская',
          startTime: '2024-06-19T08:15:00Z',
          endTime: '2024-06-19T08:35:00Z',
          duration: 20,
          price: 50,
          status: 'completed',
          distance: 8.5,
          carbonSaved: 2.1
        },
        {
          id: 'tr-002',
          passengerId: 'ps-001',
          transportType: 'bus',
          routeNumber: '217',
          startStop: 'Курская',
          endStop: 'Улица 1905 года',
          startTime: '2024-06-19T08:40:00Z',
          endTime: '2024-06-19T09:00:00Z',
          duration: 20,
          price: 50,
          status: 'completed',
          distance: 6.2,
          carbonSaved: 1.5
        }
      ],
      monthlyStats: {
        tripsCount: 42,
        totalSpent: 2100,
        favoriteRoute: 'Красная линия',
        averageTripCost: 50,
        carbonSaved: 88.2
      },
      yearlyStats: {
        totalTrips: 480,
        totalSpent: 24000,
        mostUsedTransport: 'metro'
      }
    },
    status: 'active',
    registrationDate: '2024-01-10',
    lastActivity: '2024-06-19',
    notes: 'Часто пользуется метро в часы пик. Предпочитает утренние рейсы.',
    preferences: {
      notifications: true,
      emailUpdates: true,
      preferredLanguage: 'ru'
    }
  },
  {
    id: 'ps-002',
    personalInfo: {
      fullName: 'Петров Иван Дмитриевич',
      birthDate: '1960-12-20',
      gender: 'male',
      phone: '+7 (925) 234-56-78',
      address: 'г. Москва, пр. Мира, д. 125, кв. 89',
      documentNumber: '4510234567',
      avatar: '👨‍🦳'
    },
    travelInfo: {
      passengerType: 'pensioner',
      discountCategory: 'pensioner',
      preferredTransport: 'bus',
      frequentRoutes: ['Автобус 156', 'Троллейбус 4', 'Трамвай 7'],
      averageTripsPerWeek: 8
    },
    payment: {
      paymentMethod: 'subscription',
      balance: 0,
      subscription: {
        type: 'annual',
        validUntil: '2024-12-31',
        price: 0,
        autoRenewal: true
      }
    },
    travelHistory: {
      recentTrips: [
        {
          id: 'tr-003',
          passengerId: 'ps-002',
          transportType: 'bus',
          routeNumber: '156',
          startStop: 'Пр. Мира',
          endStop: 'ВДНХ',
          startTime: '2024-06-19T09:30:00Z',
          endTime: '2024-06-19T09:50:00Z',
          duration: 20,
          price: 0,
          status: 'completed',
          distance: 5.8,
          carbonSaved: 1.4
        }
      ],
      monthlyStats: {
        tripsCount: 28,
        totalSpent: 0,
        favoriteRoute: 'Автобус 156',
        averageTripCost: 0,
        carbonSaved: 58.8
      },
      yearlyStats: {
        totalTrips: 320,
        totalSpent: 0,
        mostUsedTransport: 'bus'
      }
    },
    status: 'active',
    registrationDate: '2023-05-15',
    lastActivity: '2024-06-19',
    notes: 'Пенсионер, льготный проезд. Регулярно посещает поликлинику.',
    preferences: {
      notifications: false,
      emailUpdates: false,
      preferredLanguage: 'ru'
    }
  },
  {
    id: 'ps-003',
    personalInfo: {
      fullName: 'Сидорова Анна Владимировна',
      birthDate: '1998-08-30',
      gender: 'female',
      phone: '+7 (916) 345-67-89',
      email: 'a.sidorova@example.ru',
      address: 'г. Москва, ул. Пушкина, д. 67, кв. 12',
      documentNumber: '4510345678',
      avatar: '👩‍🎓'
    },
    travelInfo: {
      passengerType: 'student',
      discountCategory: 'student',
      preferredTransport: 'metro',
      frequentRoutes: ['Кольцевая линия', 'Зеленая линия', 'Автобус 220'],
      averageTripsPerWeek: 16
    },
    payment: {
      paymentMethod: 'mobile',
      balance: 320,
      lastPaymentDate: '2024-06-17',
      lastPaymentAmount: 500,
      subscription: {
        type: 'monthly',
        validUntil: '2024-07-17',
        price: 1250,
        autoRenewal: true
      }
    },
    travelHistory: {
      recentTrips: [
        {
          id: 'tr-004',
          passengerId: 'ps-003',
          transportType: 'metro',
          routeNumber: 'Кольцевая линия',
          startStop: 'Комсомольская',
          endStop: 'Курская',
          startTime: '2024-06-19T07:45:00Z',
          endTime: '2024-06-19T08:00:00Z',
          duration: 15,
          price: 25,
          status: 'completed',
          distance: 7.2,
          carbonSaved: 1.8
        },
        {
          id: 'tr-005',
          passengerId: 'ps-003',
          transportType: 'tram',
          routeNumber: '7',
          startStop: 'Курская',
          endStop: 'Чистые пруды',
          startTime: '2024-06-19T08:05:00Z',
          endTime: '2024-06-19T08:20:00Z',
          duration: 15,
          price: 25,
          status: 'completed',
          distance: 3.5,
          carbonSaved: 0.9
        }
      ],
      monthlyStats: {
        tripsCount: 56,
        totalSpent: 1400,
        favoriteRoute: 'Кольцевая линия',
        averageTripCost: 25,
        carbonSaved: 117.6
      },
      yearlyStats: {
        totalTrips: 620,
        totalSpent: 15500,
        mostUsedTransport: 'metro'
      }
    },
    status: 'active',
    registrationDate: '2024-02-20',
    lastActivity: '2024-06-19',
    notes: 'Студентка, активно пользуется транспортом. Часто ездит в университет.',
    preferences: {
      notifications: true,
      emailUpdates: true,
      preferredLanguage: 'ru'
    }
  },
  {
    id: 'ps-004',
    personalInfo: {
      fullName: 'Козлов Олег Николаевич',
      birthDate: '1975-03-10',
      gender: 'male',
      phone: '+7 (925) 456-78-90',
      address: 'г. Москва, ул. Гагарина, д. 34, кв. 56',
      documentNumber: '4510456789',
      avatar: '👨‍💼'
    },
    travelInfo: {
      passengerType: 'adult',
      discountCategory: 'none',
      preferredTransport: 'train',
      frequentRoutes: ['МЦК', 'Аэроэкспресс', 'Автобус 905'],
      averageTripsPerWeek: 10
    },
    payment: {
      paymentMethod: 'card',
      balance: 150,
      lastPaymentDate: '2024-06-16',
      lastPaymentAmount: 1000
    },
    travelHistory: {
      recentTrips: [
        {
          id: 'tr-006',
          passengerId: 'ps-004',
          transportType: 'train',
          routeNumber: 'МЦК',
          startStop: 'Деловой центр',
          endStop: 'Кутузовская',
          startTime: '2024-06-19T08:30:00Z',
          endTime: '2024-06-19T08:45:00Z',
          duration: 15,
          price: 50,
          status: 'completed',
          distance: 9.1,
          carbonSaved: 2.3
        }
      ],
      monthlyStats: {
        tripsCount: 22,
        totalSpent: 1100,
        favoriteRoute: 'МЦК',
        averageTripCost: 50,
        carbonSaved: 46.2
      },
      yearlyStats: {
        totalTrips: 260,
        totalSpent: 13000,
        mostUsedTransport: 'train'
      }
    },
    status: 'active',
    registrationDate: '2023-11-05',
    lastActivity: '2024-06-19',
    notes: 'Часто ездит в аэропорт по работе. Предпочитает скоростной транспорт.',
    preferences: {
      notifications: true,
      emailUpdates: false,
      preferredLanguage: 'ru'
    }
  },
  {
    id: 'ps-005',
    personalInfo: {
      fullName: 'Николаева Екатерина Викторовна',
      birthDate: '2005-09-14',
      gender: 'female',
      phone: '+7 (916) 567-89-01',
      email: 'e.nikolaeva@example.ru',
      address: 'г. Москва, ул. Мира, д. 89, кв. 23',
      documentNumber: '4510567890',
      avatar: '👧'
    },
    travelInfo: {
      passengerType: 'student',
      discountCategory: 'student',
      preferredTransport: 'bus',
      frequentRoutes: ['Автобус 33', 'Троллейбус 2', 'Метро Сокольническая'],
      averageTripsPerWeek: 14
    },
    payment: {
      paymentMethod: 'mobile',
      balance: 180,
      lastPaymentDate: '2024-06-15',
      lastPaymentAmount: 300
    },
    travelHistory: {
      recentTrips: [
        {
          id: 'tr-007',
          passengerId: 'ps-005',
          transportType: 'bus',
          routeNumber: '33',
          startStop: 'Ул. Мира',
          endStop: 'Школа №125',
          startTime: '2024-06-19T07:30:00Z',
          endTime: '2024-06-19T07:50:00Z',
          duration: 20,
          price: 25,
          status: 'completed',
          distance: 4.2,
          carbonSaved: 1.0
        }
      ],
      monthlyStats: {
        tripsCount: 48,
        totalSpent: 1200,
        favoriteRoute: 'Автобус 33',
        averageTripCost: 25,
        carbonSaved: 100.8
      },
      yearlyStats: {
        totalTrips: 520,
        totalSpent: 13000,
        mostUsedTransport: 'bus'
      }
    },
    status: 'active',
    registrationDate: '2024-03-10',
    lastActivity: '2024-06-19',
    notes: 'Школьница, ездит в школу и на дополнительные занятия.',
    preferences: {
      notifications: true,
      emailUpdates: true,
      preferredLanguage: 'ru'
    }
  }
];

const transportVehicles: TransportVehicle[] = [
  {
    id: 'tv-001',
    type: 'bus',
    vehicleNumber: 'А123БВ777',
    routeNumber: '217',
    capacity: 85,
    currentPassengers: 42,
    driver: {
      name: 'Николаев Дмитрий Сергеевич',
      id: 'dr-001',
      phone: '+7 (916) 111-22-33',
      experience: 8
    },
    status: 'on_route',
    location: {
      address: 'г. Москва, ул. Тверская, д. 15',
      lat: 55.7558,
      lng: 37.6173,
      lastUpdate: '2024-06-19T10:30:00Z',
      speed: 42
    },
    schedule: {
      startTime: '06:00',
      endTime: '23:00',
      interval: 15,
      currentDelay: 2
    },
    fuelLevel: 85,
    nextMaintenance: '2024-07-15'
  },
  {
    id: 'tv-002',
    type: 'metro',
    vehicleNumber: 'М-0456',
    routeNumber: 'Красная линия',
    capacity: 1200,
    currentPassengers: 650,
    driver: {
      name: 'Орлова Светлана Петровна',
      id: 'dr-002',
      phone: '+7 (916) 222-33-44',
      experience: 12
    },
    status: 'on_route',
    schedule: {
      startTime: '05:30',
      endTime: '01:00',
      interval: 2,
      currentDelay: 0
    },
    nextMaintenance: '2024-08-20'
  },
  {
    id: 'tv-003',
    type: 'tram',
    vehicleNumber: 'Т-0789',
    routeNumber: '7',
    capacity: 180,
    currentPassengers: 95,
    driver: {
      name: 'Волков Игорь Александрович',
      id: 'dr-003',
      phone: '+7 (916) 333-44-55',
      experience: 5
    },
    status: 'on_route',
    location: {
      address: 'г. Москва, Чистые пруды',
      lat: 55.7649,
      lng: 37.6415,
      lastUpdate: '2024-06-19T10:25:00Z',
      speed: 25
    },
    schedule: {
      startTime: '05:45',
      endTime: '22:30',
      interval: 10,
      currentDelay: 1
    },
    fuelLevel: 92,
    nextMaintenance: '2024-07-01'
  },
  {
    id: 'tv-004',
    type: 'trolleybus',
    vehicleNumber: 'Тб-1234',
    routeNumber: '4',
    capacity: 120,
    currentPassengers: 68,
    driver: {
      name: 'Семенова Ольга Викторовна',
      id: 'dr-004',
      phone: '+7 (916) 444-55-66',
      experience: 7
    },
    status: 'maintenance',
    schedule: {
      startTime: '06:15',
      endTime: '22:45',
      interval: 12,
      currentDelay: 0
    },
    fuelLevel: 100,
    nextMaintenance: '2024-06-25'
  }
];

const travelCards: TravelCard[] = [
  {
    id: 'tc-001',
    passengerId: 'ps-001',
    cardNumber: '2200555666777',
    cardType: 'standard',
    balance: 850,
    status: 'active',
    issueDate: '2024-01-10',
    expiryDate: '2027-01-10',
    lastUsed: '2024-06-19T09:00:00Z',
    dailyLimit: 500,
    monthlyLimit: 15000,
    transactions: [
      {
        id: 'tx-001',
        cardId: 'tc-001',
        amount: -50,
        type: 'payment',
        timestamp: '2024-06-19T08:15:00Z',
        location: 'Станция Площадь Революции',
        route: 'Красная линия'
      },
      {
        id: 'tx-002',
        cardId: 'tc-001',
        amount: -50,
        type: 'payment',
        timestamp: '2024-06-19T08:40:00Z',
        location: 'Остановка Курская',
        route: 'Автобус 217'
      },
      {
        id: 'tx-003',
        cardId: 'tc-001',
        amount: 500,
        type: 'topup',
        timestamp: '2024-06-18T14:30:00Z',
        location: 'Терминал оплаты'
      }
    ]
  },
  {
    id: 'tc-002',
    passengerId: 'ps-002',
    cardNumber: '2200555666888',
    cardType: 'pensioner',
    balance: 0,
    status: 'active',
    issueDate: '2023-05-15',
    expiryDate: '2026-05-15',
    lastUsed: '2024-06-19T09:50:00Z',
    transactions: [
      {
        id: 'tx-004',
        cardId: 'tc-002',
        amount: 0,
        type: 'payment',
        timestamp: '2024-06-19T09:30:00Z',
        location: 'Остановка Пр. Мира',
        route: 'Автобус 156'
      }
    ]
  },
  {
    id: 'tc-003',
    passengerId: 'ps-003',
    cardNumber: '2200555666999',
    cardType: 'student',
    balance: 320,
    status: 'active',
    issueDate: '2024-02-20',
    expiryDate: '2025-02-20',
    lastUsed: '2024-06-19T08:20:00Z',
    dailyLimit: 300,
    monthlyLimit: 9000,
    transactions: [
      {
        id: 'tx-005',
        cardId: 'tc-003',
        amount: -25,
        type: 'payment',
        timestamp: '2024-06-19T07:45:00Z',
        location: 'Станция Комсомольская',
        route: 'Кольцевая линия'
      },
      {
        id: 'tx-006',
        cardId: 'tc-003',
        amount: -25,
        type: 'payment',
        timestamp: '2024-06-19T08:05:00Z',
        location: 'Остановка Курская',
        route: 'Трамвай 7'
      },
      {
        id: 'tx-007',
        cardId: 'tc-003',
        amount: 500,
        type: 'topup',
        timestamp: '2024-06-17T16:45:00Z',
        location: 'Мобильное приложение'
      }
    ]
  }
];

// Константы
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
  green: '34, 197, 94',
  red: '239, 68, 68',
  yellow: '234, 179, 8'
} as const;

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

const getInitials = (fullName: string) => {
  return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
};

// Modal Component
const Modal = ({ isOpen, onClose, children, title, size = 'md' }: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
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
    fullscreen: 'max-w-[95vw] max-h-[95vh]'
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
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-colors duration-200 text-slate-400 hover:text-white group"
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  glowColor = COLORS.teal, 
  onClick,
  hoverable = true,
  padding = 'p-6',
  animated = true
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
    whileHover={hoverable && animated ? { y: -4, scale: 1.02 } : {}}
    whileTap={onClick && animated ? { scale: 0.98 } : {}}
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

const StatusBadge = ({ status, type = 'default', animated = false, size = 'md' }: { 
  status: string; 
  type?: 'default' | 'passenger' | 'trip' | 'vehicle' | 'card' | 'payment';
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm'
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return { color: COLORS.success, label: 'Активен', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'inactive':
        return { color: COLORS.slate, label: 'Неактивен', bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
      case 'suspended':
        return { color: COLORS.warning, label: 'Приостановлен', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' };
      case 'completed':
        return { color: COLORS.success, label: 'Завершена', bg: 'bg-green-500/15', border: 'border-green-500/30' };
      case 'in_progress':
        return { color: COLORS.orange, label: 'В процессе', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'cancelled':
        return { color: COLORS.error, label: 'Отменена', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'in_depot':
        return { color: COLORS.blue, label: 'В депо', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'on_route':
        return { color: COLORS.success, label: 'На маршруте', bg: 'bg-green-500/15', border: 'border-green-500/30' };
      case 'maintenance':
        return { color: COLORS.orange, label: 'Обслуживание', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'out_of_service':
        return { color: COLORS.error, label: 'Не работает', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'blocked':
        return { color: COLORS.error, label: 'Заблокирована', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'expired':
        return { color: COLORS.warning, label: 'Просрочена', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' };
      case 'adult':
        return { color: COLORS.blue, label: 'Взрослый', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'child':
        return { color: COLORS.cyan, label: 'Ребенок', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' };
      case 'student':
        return { color: COLORS.purple, label: 'Студент', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'pensioner':
        return { color: COLORS.orange, label: 'Пенсионер', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'disabled':
        return { color: COLORS.rose, label: 'Инвалид', bg: 'bg-rose-500/15', border: 'border-rose-500/30' };
      case 'none':
        return { color: COLORS.slate, label: 'Без льгот', bg: 'bg-slate-500/15', border: 'border-slate-500/30' };
      case 'large_family':
        return { color: COLORS.emerald, label: 'Многодетная', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'bus':
        return { color: COLORS.blue, label: 'Автобус', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'tram':
        return { color: COLORS.green, label: 'Трамвай', bg: 'bg-green-500/15', border: 'border-green-500/30' };
      case 'trolleybus':
        return { color: COLORS.purple, label: 'Троллейбус', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'metro':
        return { color: COLORS.red, label: 'Метро', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'train':
        return { color: COLORS.orange, label: 'Электричка', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'standard':
        return { color: COLORS.blue, label: 'Стандарт', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'social':
        return { color: COLORS.emerald, label: 'Социальная', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'card':
        return { color: COLORS.blue, label: 'Карта', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
      case 'mobile':
        return { color: COLORS.purple, label: 'Мобильный', bg: 'bg-purple-500/15', border: 'border-purple-500/30' };
      case 'cash':
        return { color: COLORS.emerald, label: 'Наличные', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      case 'subscription':
        return { color: COLORS.orange, label: 'Абонемент', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      case 'payment':
        return { color: COLORS.red, label: 'Оплата', bg: 'bg-red-500/15', border: 'border-red-500/30' };
      case 'topup':
        return { color: COLORS.green, label: 'Пополнение', bg: 'bg-green-500/15', border: 'border-green-500/30' };
      case 'refund':
        return { color: COLORS.blue, label: 'Возврат', bg: 'bg-blue-500/15', border: 'border-blue-500/30' };
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

const ProgressBar = ({ value, max = 100, color = COLORS.teal, label, showValue = true, size = 'md', showLabel = true }: { 
  value: number; 
  max?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  
  return (
    <div className="w-full">
      {(label || showValue) && showLabel && (
        <div className="flex justify-between text-sm text-slate-300 mb-2">
          {label && <span>{label}</span>}
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
      transition={{ delay: delay * 0.1 }}
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

const PassengerCard = ({ passenger, onClick, delay = 0 }: { passenger: Passenger; onClick?: () => void; delay?: number }) => {
  const age = calculateAge(passenger.personalInfo.birthDate);
  const recentTripsCount = passenger.travelHistory.recentTrips.length;
  
  const getPassengerColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'inactive': return COLORS.slate;
      case 'suspended': return COLORS.warning;
      default: return COLORS.slate;
    }
  };

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'bus': return '🚌';
      case 'tram': return '🚊';
      case 'trolleybus': return '🚎';
      case 'metro': return '🚇';
      case 'train': return '🚆';
      default: return '🚗';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.1 }}
    >
      <BentoCard className="p-5" glowColor={getPassengerColor(passenger.status)} onClick={onClick}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0 mr-3">
            <div className="text-2xl">
              {passenger.personalInfo.avatar || '👤'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold text-base mb-1 line-clamp-1">{passenger.personalInfo.fullName}</h4>
              <p className="text-slate-400 text-sm">
                {age} лет • {passenger.travelInfo.passengerType}
              </p>
            </div>
          </div>
          <StatusBadge status={passenger.status} type="passenger" animated={passenger.status === 'active'} />
        </div>
        
        <div className="space-y-3 text-sm mb-5">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Предпочтительный транспорт:</span>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getTransportIcon(passenger.travelInfo.preferredTransport)}</span>
              <StatusBadge status={passenger.travelInfo.preferredTransport} />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Льготная категория:</span>
            <StatusBadge status={passenger.travelInfo.discountCategory} />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Поездок в этом месяце:</span>
            <span className="text-white font-medium">{passenger.travelHistory.monthlyStats.tripsCount}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
          <div className="text-xs text-slate-400">
            Баланс: {formatCurrency(passenger.payment.balance)}
          </div>
          <div className="text-xs text-slate-400">
            {recentTripsCount} недавних поездок
          </div>
        </div>
      </BentoCard>
    </motion.div>
  );
};

const VehicleCard = ({ vehicle, onClick, delay = 0 }: { vehicle: TransportVehicle; onClick?: () => void; delay?: number }) => {
  const occupancy = (vehicle.currentPassengers / vehicle.capacity) * 100;
  
  const getVehicleColor = (status: string) => {
    switch (status) {
      case 'on_route': return COLORS.success;
      case 'in_depot': return COLORS.blue;
      case 'maintenance': return COLORS.orange;
      case 'out_of_service': return COLORS.error;
      default: return COLORS.slate;
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bus': return '🚌';
      case 'tram': return '🚊';
      case 'trolleybus': return '🚎';
      case 'metro': return '🚇';
      case 'train': return '🚆';
      default: return '🚗';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.1 }}
    >
      <BentoCard className="p-5" glowColor={getVehicleColor(vehicle.status)} onClick={onClick}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 mr-3">
            <h4 className="text-white font-semibold text-base mb-1">
              {getVehicleIcon(vehicle.type)} {vehicle.routeNumber}
            </h4>
            <p className="text-slate-400 text-sm line-clamp-1">{vehicle.vehicleNumber}</p>
          </div>
          <StatusBadge status={vehicle.status} type="vehicle" animated={vehicle.status === 'on_route'} />
        </div>
        
        <div className="space-y-3 text-sm mb-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Водитель:</span>
            <span className="text-white font-medium text-right">{vehicle.driver.name}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Пассажиров:</span>
            <span className="text-white font-medium">{vehicle.currentPassengers}/{vehicle.capacity}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Интервал:</span>
            <span className="text-white font-medium">{vehicle.schedule.interval} мин</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <ProgressBar 
            value={occupancy} 
            label="Заполненность" 
            color={occupancy > 80 ? COLORS.rose : occupancy > 60 ? COLORS.orange : COLORS.emerald}
            size="sm"
          />
        </div>
      </BentoCard>
    </motion.div>
  );
};

const TripCard = ({ trip, onClick, delay = 0 }: { trip: Trip; onClick?: () => void; delay?: number }) => {
  const passenger = passengers.find(p => p.id === trip.passengerId);
  
  const getTripColor = (status: string) => {
    switch (status) {
      case 'completed': return COLORS.success;
      case 'in_progress': return COLORS.orange;
      case 'cancelled': return COLORS.error;
      default: return COLORS.slate;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.1 }}
    >
      <BentoCard className="p-4" glowColor={getTripColor(trip.status)} onClick={onClick}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 mr-3">
            <h5 className="text-white font-semibold text-sm mb-1 line-clamp-2">
              {trip.startStop} → {trip.endStop}
            </h5>
            <p className="text-slate-400 text-xs">{passenger?.personalInfo.fullName}</p>
          </div>
          <StatusBadge status={trip.status} type="trip" animated={trip.status === 'in_progress'} />
        </div>
        
        <div className="space-y-2 text-xs mb-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Транспорт:</span>
            <StatusBadge status={trip.transportType} />
          </div>
          
          <div className="flex justify-between">
            <span className="text-slate-400">Маршрут:</span>
            <span className="text-white">{trip.routeNumber}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-slate-400">Время:</span>
            <span className="text-white">{formatTime(trip.startTime)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <span className="text-xs text-slate-400">Стоимость:</span>
          <span className="text-xs font-semibold text-amber-500">
            {formatCurrency(trip.price)}
          </span>
        </div>
      </BentoCard>
    </motion.div>
  );
};

const TravelCardCard = ({ card, onClick, delay = 0 }: { card: TravelCard; onClick?: () => void; delay?: number }) => {
  const passenger = passengers.find(p => p.id === card.passengerId);
  
  const getCardColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'blocked': return COLORS.error;
      case 'expired': return COLORS.warning;
      default: return COLORS.slate;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.1 }}
    >
      <BentoCard className="p-4" glowColor={getCardColor(card.status)} onClick={onClick}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 mr-3">
            <h5 className="text-white font-semibold text-sm mb-1">{card.cardNumber}</h5>
            <p className="text-slate-400 text-xs">{passenger?.personalInfo.fullName}</p>
          </div>
          <StatusBadge status={card.status} type="card" animated={card.status === 'active'} />
        </div>
        
        <div className="space-y-2 text-xs mb-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Тип карты:</span>
            <StatusBadge status={card.cardType} />
          </div>
          
          <div className="flex justify-between">
            <span className="text-slate-400">Баланс:</span>
            <span className="text-white font-semibold">{formatCurrency(card.balance)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-slate-400">Действует до:</span>
            <span className="text-white">{formatDate(card.expiryDate)}</span>
          </div>
        </div>
        
        {card.lastUsed && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
            <span className="text-xs text-slate-400">Использована:</span>
            <span className="text-xs text-white">
              {formatTime(card.lastUsed)}
            </span>
          </div>
        )}
      </BentoCard>
    </motion.div>
  );
};

// Search Component
const SearchBar = ({ value, onChange, placeholder = "Поиск..." }: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full pl-10 pr-3 py-3 border border-slate-700/50 rounded-2xl bg-slate-800/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent backdrop-blur-xl"
      placeholder={placeholder}
    />
  </div>
);

// Filter Component
const FilterSelect = ({ value, onChange, options, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="block w-full px-3 py-3 border border-slate-700/50 rounded-2xl bg-slate-800/30 text-white focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent backdrop-blur-xl appearance-none"
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map(option => (
      <option key={option.value} value={option.value} className="bg-slate-800">
        {option.label}
      </option>
    ))}
  </select>
);

// Основной компонент дашборда
const PassengerDashboard = () => {
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicle | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedCard, setSelectedCard] = useState<TravelCard | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'passengers' | 'vehicles' | 'trips' | 'cards'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  const currentTime = useClientTime();
  
  // Статистика для дашборда
  const stats = useMemo(() => {
    const totalPassengers = passengers.length;
    const activePassengers = passengers.filter(p => p.status === 'active').length;
    const totalVehicles = transportVehicles.length;
    const activeVehicles = transportVehicles.filter(v => v.status === 'on_route').length;
    const totalTrips = passengers.reduce((acc, passenger) => acc + passenger.travelHistory.monthlyStats.tripsCount, 0);
    const totalRevenue = passengers.reduce((acc, passenger) => acc + passenger.travelHistory.monthlyStats.totalSpent, 0);
    const totalCarbonSaved = passengers.reduce((acc, passenger) => acc + passenger.travelHistory.monthlyStats.carbonSaved, 0);
    
    return {
      totalPassengers,
      activePassengers,
      totalVehicles,
      activeVehicles,
      totalTrips,
      totalRevenue,
      totalCarbonSaved: Math.round(totalCarbonSaved)
    };
  }, []);

  // Фильтрация данных
  const filteredPassengers = useMemo(() => {
    return passengers.filter(passenger => {
      const matchesSearch = passenger.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           passenger.personalInfo.phone.includes(searchTerm);
      const matchesStatus = !statusFilter || passenger.status === statusFilter;
      const matchesType = !typeFilter || passenger.travelInfo.passengerType === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchTerm, statusFilter, typeFilter]);

  const activePassengers = useMemo(() => 
    passengers.filter(passenger => passenger.status === 'active'), 
  []);
  
  const recentTrips = useMemo(() => 
    passengers.flatMap(passenger => 
      passenger.travelHistory.recentTrips.slice(0, 2)
    ), 
  []);
  
  const activeVehicles = useMemo(() => 
    transportVehicles.filter(vehicle => vehicle.status === 'on_route'), 
  []);

  const statusOptions = [
    { value: 'active', label: 'Активные' },
    { value: 'inactive', label: 'Неактивные' },
    { value: 'suspended', label: 'Приостановленные' }
  ];

  const typeOptions = [
    { value: 'adult', label: 'Взрослые' },
    { value: 'student', label: 'Студенты' },
    { value: 'pensioner', label: 'Пенсионеры' },
    { value: 'child', label: 'Дети' },
    { value: 'disabled', label: 'Инвалиды' }
  ];

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
              Пассажиры транспорта
            </h1>
            <p className="text-slate-400 text-lg">Управление пассажирами и транспортом</p>
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

        {/* Навигация */}
        <nav className="flex space-x-1 p-1 bg-slate-800/50 rounded-2xl backdrop-blur-xl border border-slate-700/50 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Обзор', icon: '📊' },
            { id: 'passengers', label: 'Пассажиры', icon: '👥' },
            { id: 'vehicles', label: 'Транспорт', icon: '🚌' },
            { id: 'trips', label: 'Поездки', icon: '🎫' },
            { id: 'cards', label: 'Проездные', icon: '💳' }
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

        {/* Фильтры для пассажиров */}
        {activeTab === 'passengers' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          >
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Поиск пассажиров..."
            />
            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              placeholder="Все статусы"
            />
            <FilterSelect
              value={typeFilter}
              onChange={setTypeFilter}
              options={typeOptions}
              placeholder="Все типы"
            />
          </motion.div>
        )}
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
                  title="Всего пассажиров"
                  value={stats.totalPassengers}
                  change={2.5}
                  icon="👥"
                  color={COLORS.blue}
                  subtitle={`${stats.activePassengers} активных`}
                  trend="up"
                  delay={0}
                />
                <StatCard
                  title="На маршруте"
                  value={stats.activeVehicles}
                  change={1.2}
                  icon="🚌"
                  color={COLORS.orange}
                  subtitle={`из ${stats.totalVehicles} единиц`}
                  trend="up"
                  delay={1}
                />
                <StatCard
                  title="Поездок в месяц"
                  value={stats.totalTrips}
                  change={5.8}
                  icon="🎫"
                  color={COLORS.emerald}
                  subtitle="за текущий месяц"
                  trend="up"
                  delay={2}
                />
                <StatCard
                  title="Общий доход"
                  value={formatCurrency(stats.totalRevenue)}
                  change={3.2}
                  icon="💰"
                  color={COLORS.purple}
                  subtitle="за текущий месяц"
                  trend="up"
                  delay={3}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Активные пассажиры */}
                <BentoCard className="p-6" glowColor={COLORS.purple}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Активные пассажиры</h3>
                    <button 
                      className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200"
                      onClick={() => setActiveTab('passengers')}
                    >
                      Все →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {activePassengers.slice(0, 3).map((passenger, index) => (
                      <motion.div 
                        key={passenger.id}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                        onClick={() => setSelectedPassenger(passenger)}
                        whileHover={{ x: 4 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="text-2xl">
                          {passenger.personalInfo.avatar || '👤'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm truncate">{passenger.personalInfo.fullName}</h4>
                          <p className="text-slate-400 text-xs">
                            {passenger.travelInfo.passengerType} • {passenger.travelHistory.monthlyStats.tripsCount} поездок
                          </p>
                        </div>
                        <StatusBadge status={passenger.status} type="passenger" />
                      </motion.div>
                    ))}
                  </div>
                </BentoCard>

                {/* Активный транспорт */}
                <BentoCard className="p-6" glowColor={COLORS.orange}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Транспорт на маршруте</h3>
                    <button 
                      className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200"
                      onClick={() => setActiveTab('vehicles')}
                    >
                      Все →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {activeVehicles.slice(0, 3).map((vehicle, index) => (
                      <motion.div 
                        key={vehicle.id}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                        onClick={() => setSelectedVehicle(vehicle)}
                        whileHover={{ x: 4 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="text-2xl">
                          {vehicle.type === 'bus' ? '🚌' :
                           vehicle.type === 'tram' ? '🚊' :
                           vehicle.type === 'trolleybus' ? '🚎' :
                           vehicle.type === 'metro' ? '🚇' : '🚆'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm">
                            {vehicle.routeNumber} • {vehicle.vehicleNumber}
                          </h4>
                          <p className="text-slate-400 text-xs">
                            {vehicle.currentPassengers}/{vehicle.capacity} пассажиров
                          </p>
                        </div>
                        <StatusBadge status={vehicle.status} type="vehicle" />
                      </motion.div>
                    ))}
                  </div>
                </BentoCard>
              </div>

              {/* Последние поездки */}
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Последние поездки</h3>
                  <button 
                    className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200"
                    onClick={() => setActiveTab('trips')}
                  >
                    Все →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentTrips.slice(0, 3).map((trip, index) => (
                    <TripCard 
                      key={trip.id} 
                      trip={trip} 
                      onClick={() => setSelectedTrip(trip)}
                      delay={index}
                    />
                  ))}
                </div>
              </BentoCard>

              {/* Экологическая статистика */}
              <BentoCard className="p-6 mt-6" glowColor={COLORS.emerald}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Экологический вклад</h3>
                  <div className="text-2xl">🌱</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-2">{stats.totalCarbonSaved} кг</div>
                    <div className="text-slate-400 text-sm">CO₂ сэкономлено</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">{stats.totalTrips}</div>
                    <div className="text-slate-400 text-sm">Поездок на транспорте</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {Math.round(stats.totalCarbonSaved / stats.totalTrips * 10) / 10} кг
                    </div>
                    <div className="text-slate-400 text-sm">Средняя экономия на поездку</div>
                  </div>
                </div>
              </BentoCard>
            </motion.div>
          )}

          {activeTab === 'passengers' && (
            <motion.div
              key="passengers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Пассажиры</h2>
                <p className="text-slate-400">Управление пассажирами и их проездными</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPassengers.map((passenger, index) => (
                  <PassengerCard 
                    key={passenger.id} 
                    passenger={passenger} 
                    onClick={() => setSelectedPassenger(passenger)}
                    delay={index}
                  />
                ))}
              </div>

              {filteredPassengers.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Пассажиры не найдены</h3>
                  <p className="text-slate-400">Попробуйте изменить параметры поиска или фильтры</p>
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
                <p className="text-slate-400">Управление автобусами, трамваями и другим транспортом</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {transportVehicles.map((vehicle, index) => (
                  <VehicleCard 
                    key={vehicle.id} 
                    vehicle={vehicle} 
                    onClick={() => setSelectedVehicle(vehicle)}
                    delay={index}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'trips' && (
            <motion.div
              key="trips"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">История поездок</h2>
                <p className="text-slate-400">Отслеживание поездок пассажиров</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentTrips.map((trip, index) => (
                  <TripCard 
                    key={trip.id} 
                    trip={trip} 
                    onClick={() => setSelectedTrip(trip)}
                    delay={index}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'cards' && (
            <motion.div
              key="cards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Проездные карты</h2>
                <p className="text-slate-400">Управление транспортными картами пассажиров</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {travelCards.map((card, index) => (
                  <TravelCardCard 
                    key={card.id} 
                    card={card} 
                    onClick={() => setSelectedCard(card)}
                    delay={index}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Модальные окна */}
      <Modal 
        isOpen={!!selectedPassenger} 
        onClose={() => setSelectedPassenger(null)}
        title={selectedPassenger?.personalInfo.fullName}
        size="xl"
      >
        {selectedPassenger && (
          <div className="space-y-6">
            {/* Заголовок с основной информацией */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-4xl">
                {selectedPassenger.personalInfo.avatar || '👤'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedPassenger.personalInfo.fullName}</h3>
                <p className="text-slate-400">
                  {calculateAge(selectedPassenger.personalInfo.birthDate)} лет • 
                  Зарегистрирован {formatDate(selectedPassenger.registrationDate)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Персональная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дата рождения:</span>
                    <span className="text-white">{formatDate(selectedPassenger.personalInfo.birthDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Телефон:</span>
                    <span className="text-white">{selectedPassenger.personalInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white">{selectedPassenger.personalInfo.email || 'Не указан'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Адрес:</span>
                    <span className="text-white text-right">{selectedPassenger.personalInfo.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Документ:</span>
                    <span className="text-white">{selectedPassenger.personalInfo.documentNumber}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Информация о поездках</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип пассажира:</span>
                    <StatusBadge status={selectedPassenger.travelInfo.passengerType} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Льготная категория:</span>
                    <StatusBadge status={selectedPassenger.travelInfo.discountCategory} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Предпочтительный транспорт:</span>
                    <StatusBadge status={selectedPassenger.travelInfo.preferredTransport} />
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400">Среднее кол-во поездок в неделю:</span>
                    <span className="text-white">{selectedPassenger.travelInfo.averageTripsPerWeek}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400">Частые маршруты:</span>
                    <div className="text-right">
                      {selectedPassenger.travelInfo.frequentRoutes.map((route, index) => (
                        <div key={index} className="text-white text-xs bg-white/10 rounded-full px-2 py-1 mb-1">
                          {route}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.teal}>
                <h4 className="text-lg font-semibold text-white mb-4">Платежная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Способ оплаты:</span>
                    <StatusBadge status={selectedPassenger.payment.paymentMethod} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Баланс:</span>
                    <span className="text-white font-semibold">{formatCurrency(selectedPassenger.payment.balance)}</span>
                  </div>
                  {selectedPassenger.payment.lastPaymentDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Последняя оплата:</span>
                      <span className="text-white">{formatDate(selectedPassenger.payment.lastPaymentDate)}</span>
                    </div>
                  )}
                  {selectedPassenger.payment.lastPaymentAmount && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Сумма последней оплаты:</span>
                      <span className="text-white">{formatCurrency(selectedPassenger.payment.lastPaymentAmount)}</span>
                    </div>
                  )}
                  {selectedPassenger.payment.subscription && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Тип абонемента:</span>
                        <span className="text-white">
                          {selectedPassenger.payment.subscription.type === 'daily' ? 'Ежедневный' :
                           selectedPassenger.payment.subscription.type === 'monthly' ? 'Ежемесячный' :
                           selectedPassenger.payment.subscription.type === 'quarterly' ? 'Квартальный' : 'Годовой'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Действует до:</span>
                        <span className="text-white">{formatDate(selectedPassenger.payment.subscription.validUntil)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Стоимость:</span>
                        <span className="text-white">{formatCurrency(selectedPassenger.payment.subscription.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Автопродление:</span>
                        <span className="text-white">{selectedPassenger.payment.subscription.autoRenewal ? 'Включено' : 'Выключено'}</span>
                      </div>
                    </>
                  )}
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.orange}>
                <h4 className="text-lg font-semibold text-white mb-4">Статистика за месяц</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Количество поездок:</span>
                    <span className="text-white font-semibold">{selectedPassenger.travelHistory.monthlyStats.tripsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Общие затраты:</span>
                    <span className="text-white font-semibold">{formatCurrency(selectedPassenger.travelHistory.monthlyStats.totalSpent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Средняя стоимость поездки:</span>
                    <span className="text-white">{formatCurrency(selectedPassenger.travelHistory.monthlyStats.averageTripCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Любимый маршрут:</span>
                    <span className="text-white">{selectedPassenger.travelHistory.monthlyStats.favoriteRoute}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Сэкономлено CO₂:</span>
                    <span className="text-white font-semibold text-emerald-400">{selectedPassenger.travelHistory.monthlyStats.carbonSaved} кг</span>
                  </div>
                </div>
              </BentoCard>
            </div>

            {/* Годовая статистика */}
            <BentoCard className="p-6" glowColor={COLORS.indigo}>
              <h4 className="text-lg font-semibold text-white mb-4">Годовая статистика</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{selectedPassenger.travelHistory.yearlyStats.totalTrips}</div>
                  <div className="text-slate-400 text-sm">Всего поездок</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{formatCurrency(selectedPassenger.travelHistory.yearlyStats.totalSpent)}</div>
                  <div className="text-slate-400 text-sm">Общие затраты</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{selectedPassenger.travelHistory.yearlyStats.mostUsedTransport}</div>
                  <div className="text-slate-400 text-sm">Чаще всего используется</div>
                </div>
              </div>
            </BentoCard>

            <BentoCard className="p-6" glowColor={COLORS.emerald}>
              <h4 className="text-lg font-semibold text-white mb-4">Недавние поездки</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPassenger.travelHistory.recentTrips.map((trip) => (
                  <TripCard 
                    key={trip.id} 
                    trip={trip} 
                    onClick={() => setSelectedTrip(trip)}
                  />
                ))}
              </div>
            </BentoCard>

            {selectedPassenger.notes && (
              <BentoCard className="p-6" glowColor={COLORS.rose}>
                <h4 className="text-lg font-semibold text-white mb-4">Примечания</h4>
                <p className="text-slate-300 text-sm">{selectedPassenger.notes}</p>
              </BentoCard>
            )}

            {/* Настройки */}
            <BentoCard className="p-6" glowColor={COLORS.cyan}>
              <h4 className="text-lg font-semibold text-white mb-4">Настройки и предпочтения</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Уведомления:</span>
                  <span className="text-white">{selectedPassenger.preferences.notifications ? 'Включены' : 'Выключены'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email-рассылка:</span>
                  <span className="text-white">{selectedPassenger.preferences.emailUpdates ? 'Включена' : 'Выключена'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Предпочитаемый язык:</span>
                  <span className="text-white">{selectedPassenger.preferences.preferredLanguage === 'ru' ? 'Русский' : 'Английский'}</span>
                </div>
              </div>
            </BentoCard>
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!selectedVehicle} 
        onClose={() => setSelectedVehicle(null)}
        title={`${selectedVehicle?.type} ${selectedVehicle?.routeNumber}`}
        size="lg"
      >
        {selectedVehicle && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Основная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип транспорта:</span>
                    <StatusBadge status={selectedVehicle.type} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Номер транспорта:</span>
                    <span className="text-white">{selectedVehicle.vehicleNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Маршрут:</span>
                    <span className="text-white">{selectedVehicle.routeNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedVehicle.status} type="vehicle" />
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Вместимость</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Общая вместимость:</span>
                    <span className="text-white">{selectedVehicle.capacity} пассажиров</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Текущее количество:</span>
                    <span className="text-white">{selectedVehicle.currentPassengers} пассажиров</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Заполненность:</span>
                    <span className="text-white">{Math.round((selectedVehicle.currentPassengers / selectedVehicle.capacity) * 100)}%</span>
                  </div>
                </div>
                <div className="mt-4">
                  <ProgressBar 
                    value={(selectedVehicle.currentPassengers / selectedVehicle.capacity) * 100} 
                    label="" 
                    color={(selectedVehicle.currentPassengers / selectedVehicle.capacity) > 0.8 ? COLORS.rose : COLORS.emerald}
                  />
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.teal}>
                <h4 className="text-lg font-semibold text-white mb-4">Персонал</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Водитель:</span>
                    <span className="text-white">{selectedVehicle.driver.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ID водителя:</span>
                    <span className="text-white">{selectedVehicle.driver.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Телефон:</span>
                    <span className="text-white">{selectedVehicle.driver.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Опыт работы:</span>
                    <span className="text-white">{selectedVehicle.driver.experience} лет</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.orange}>
                <h4 className="text-lg font-semibold text-white mb-4">Расписание</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Начало работы:</span>
                    <span className="text-white">{selectedVehicle.schedule.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Окончание работы:</span>
                    <span className="text-white">{selectedVehicle.schedule.endTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Интервал движения:</span>
                    <span className="text-white">{selectedVehicle.schedule.interval} минут</span>
                  </div>
                  {selectedVehicle.schedule.currentDelay !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Текущая задержка:</span>
                      <span className="text-white">{selectedVehicle.schedule.currentDelay} минут</span>
                    </div>
                  )}
                </div>
              </BentoCard>
            </div>

            {selectedVehicle.location && (
              <BentoCard className="p-6" glowColor={COLORS.emerald}>
                <h4 className="text-lg font-semibold text-white mb-4">Текущее местоположение</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Адрес:</span>
                    <span className="text-white text-right">{selectedVehicle.location.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Последнее обновление:</span>
                    <span className="text-white">{formatTime(selectedVehicle.location.lastUpdate)}</span>
                  </div>
                  {selectedVehicle.location.speed && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Скорость:</span>
                      <span className="text-white">{selectedVehicle.location.speed} км/ч</span>
                    </div>
                  )}
                </div>
              </BentoCard>
            )}

            {/* Техническая информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedVehicle.fuelLevel !== undefined && (
                <BentoCard className="p-6" glowColor={COLORS.yellow}>
                  <h4 className="text-lg font-semibold text-white mb-4">Топливо</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Уровень топлива:</span>
                      <span className="text-white">{selectedVehicle.fuelLevel}%</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <ProgressBar 
                      value={selectedVehicle.fuelLevel} 
                      label="" 
                      color={selectedVehicle.fuelLevel > 20 ? COLORS.emerald : COLORS.rose}
                    />
                  </div>
                </BentoCard>
              )}

              {selectedVehicle.nextMaintenance && (
                <BentoCard className="p-6" glowColor={COLORS.cyan}>
                  <h4 className="text-lg font-semibold text-white mb-4">Техническое обслуживание</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Следующее ТО:</span>
                      <span className="text-white">{formatDate(selectedVehicle.nextMaintenance)}</span>
                    </div>
                  </div>
                </BentoCard>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!selectedTrip} 
        onClose={() => setSelectedTrip(null)}
        title="Информация о поездке"
        size="lg"
      >
        {selectedTrip && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Основная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип транспорта:</span>
                    <StatusBadge status={selectedTrip.transportType} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Маршрут:</span>
                    <span className="text-white">{selectedTrip.routeNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedTrip.status} type="trip" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Стоимость:</span>
                    <span className="text-white font-semibold">{formatCurrency(selectedTrip.price)}</span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Маршрут</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">От:</span>
                    <span className="text-white text-right">{selectedTrip.startStop}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">До:</span>
                    <span className="text-white text-right">{selectedTrip.endStop}</span>
                  </div>
                  {selectedTrip.duration && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Продолжительность:</span>
                      <span className="text-white">{selectedTrip.duration} минут</span>
                    </div>
                  )}
                  {selectedTrip.distance && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Расстояние:</span>
                      <span className="text-white">{selectedTrip.distance} км</span>
                    </div>
                  )}
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.teal}>
                <h4 className="text-lg font-semibold text-white mb-4">Время</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Начало:</span>
                    <span className="text-white">{formatDateTime(selectedTrip.startTime)}</span>
                  </div>
                  {selectedTrip.endTime && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Окончание:</span>
                      <span className="text-white">{formatDateTime(selectedTrip.endTime)}</span>
                    </div>
                  )}
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.orange}>
                <h4 className="text-lg font-semibold text-white mb-4">Пассажир</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Имя:</span>
                    <span className="text-white">{passengers.find(p => p.id === selectedTrip.passengerId)?.personalInfo.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Телефон:</span>
                    <span className="text-white">{passengers.find(p => p.id === selectedTrip.passengerId)?.personalInfo.phone}</span>
                  </div>
                </div>
              </BentoCard>
            </div>

            {/* Дополнительная информация */}
            {(selectedTrip.carbonSaved || selectedTrip.delay) && (
              <BentoCard className="p-6" glowColor={COLORS.emerald}>
                <h4 className="text-lg font-semibold text-white mb-4">Дополнительная информация</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {selectedTrip.carbonSaved && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Сэкономлено CO₂:</span>
                      <span className="text-emerald-400 font-semibold">{selectedTrip.carbonSaved} кг</span>
                    </div>
                  )}
                  {selectedTrip.delay && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Задержка:</span>
                      <span className="text-amber-400 font-semibold">{selectedTrip.delay} минут</span>
                    </div>
                  )}
                </div>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!selectedCard} 
        onClose={() => setSelectedCard(null)}
        title={`Проездная карта ${selectedCard?.cardNumber}`}
        size="lg"
      >
        {selectedCard && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BentoCard className="p-6" glowColor={COLORS.blue}>
                <h4 className="text-lg font-semibold text-white mb-4">Основная информация</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Номер карты:</span>
                    <span className="text-white">{selectedCard.cardNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Тип карты:</span>
                    <StatusBadge status={selectedCard.cardType} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус:</span>
                    <StatusBadge status={selectedCard.status} type="card" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Баланс:</span>
                    <span className="text-white font-semibold">{formatCurrency(selectedCard.balance)}</span>
                  </div>
                  {selectedCard.dailyLimit && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Дневной лимит:</span>
                      <span className="text-white">{formatCurrency(selectedCard.dailyLimit)}</span>
                    </div>
                  )}
                  {selectedCard.monthlyLimit && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Месячный лимит:</span>
                      <span className="text-white">{formatCurrency(selectedCard.monthlyLimit)}</span>
                    </div>
                  )}
                </div>
              </BentoCard>

              <BentoCard className="p-6" glowColor={COLORS.purple}>
                <h4 className="text-lg font-semibold text-white mb-4">Срок действия</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Дата выдачи:</span>
                    <span className="text-white">{formatDate(selectedCard.issueDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Действует до:</span>
                    <span className="text-white">{formatDate(selectedCard.expiryDate)}</span>
                  </div>
                  {selectedCard.lastUsed && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Последнее использование:</span>
                      <span className="text-white">{formatDateTime(selectedCard.lastUsed)}</span>
                    </div>
                  )}
                </div>
              </BentoCard>
            </div>

            <BentoCard className="p-6" glowColor={COLORS.teal}>
              <h4 className="text-lg font-semibold text-white mb-4">Владелец карты</h4>
              <div className="flex items-center space-x-4">
                <div className="text-3xl">
                  {passengers.find(p => p.id === selectedCard.passengerId)?.personalInfo.avatar || '👤'}
                </div>
                <div>
                  <h5 className="text-white font-semibold">
                    {passengers.find(p => p.id === selectedCard.passengerId)?.personalInfo.fullName}
                  </h5>
                  <p className="text-slate-400 text-sm">
                    {passengers.find(p => p.id === selectedCard.passengerId)?.personalInfo.phone}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {passengers.find(p => p.id === selectedCard.passengerId)?.personalInfo.email}
                  </p>
                </div>
              </div>
            </BentoCard>

            {/* История транзакций */}
            {selectedCard.transactions && selectedCard.transactions.length > 0 && (
              <BentoCard className="p-6" glowColor={COLORS.orange}>
                <h4 className="text-lg font-semibold text-white mb-4">История транзакций</h4>
                <div className="space-y-3">
                  {selectedCard.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <div className="flex items-center space-x-3">
                        <StatusBadge 
                          status={transaction.type} 
                          type="payment" 
                          size="sm"
                          animated={transaction.type === 'topup'}
                        />
                        <div>
                          <div className="text-white text-sm font-medium">
                            {transaction.type === 'payment' ? 'Оплата проезда' :
                             transaction.type === 'topup' ? 'Пополнение счета' : 'Возврат средств'}
                          </div>
                          {transaction.location && (
                            <div className="text-slate-400 text-xs">{transaction.location}</div>
                          )}
                          {transaction.route && (
                            <div className="text-slate-400 text-xs">{transaction.route}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-semibold ${
                          transaction.type === 'topup' || transaction.type === 'refund' 
                            ? 'text-emerald-400' 
                            : 'text-rose-400'
                        }`}>
                          {transaction.type === 'topup' || transaction.type === 'refund' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                        </div>
                        <div className="text-slate-400 text-xs">
                          {formatTime(transaction.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </BentoCard>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PassengerDashboard;