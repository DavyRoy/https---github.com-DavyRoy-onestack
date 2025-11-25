'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Типы данных
interface BusStop {
  id: string;
  name: string;
  address: string;
  routes: string[];
  nextBuses: NextBus[];
  coordinates: { lat: number; lng: number };
  facilities: string[];
  livePassengers?: number;
}

interface NextBus {
  route: string;
  destination: string;
  arrivalTime: string;
  delay?: number;
  vehicleType: 'bus' | 'tram' | 'trolleybus';
  capacity: number;
  occupancy: 'low' | 'medium' | 'high';
  passengers?: number;
}

interface ElectronicTicket {
  id: string;
  type: 'single' | 'daily' | 'weekly' | 'monthly';
  name: string;
  price: string;
  description: string;
  validity: string;
  features: string[];
  isActive: boolean;
  expiresAt?: string;
  qrCode?: string;
}

interface Vehicle {
  id: string;
  route: string;
  vehicleNumber: string;
  type: 'bus' | 'tram' | 'trolleybus';
  coordinates: { lat: number; lng: number };
  speed: number;
  direction: number;
  occupancy: number;
  nextStop: string;
  delay: number;
  passengers: number;
  capacity: number;
}

interface TripStats {
  totalTrips: number;
  monthlyTrips: number;
  totalDistance: number;
  favoriteRoute: string;
  carbonSaved: number;
  moneySaved: number;
  weeklyStats: {
    day: string;
    trips: number;
    distance: number;
  }[];
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

// Данные для остановок
const busStops: BusStop[] = [
  {
    id: '1',
    name: 'Центральный вокзал',
    address: 'пл. Привокзальная, 1',
    routes: ['101', '205', '47', '12', '89'],
    coordinates: { lat: 55.7558, lng: 37.6173 },
    facilities: ['Wi-Fi', 'Электронное табло', 'Кафе', 'Туалет'],
    livePassengers: 23,
    nextBuses: [
      { route: '101', destination: 'Северный район', arrivalTime: '3 мин', delay: 0, vehicleType: 'bus', capacity: 80, occupancy: 'medium', passengers: 45 },
      { route: '47', destination: 'Южные ворота', arrivalTime: '7 мин', delay: 2, vehicleType: 'tram', capacity: 120, occupancy: 'high', passengers: 98 },
      { route: '205', destination: 'Западный парк', arrivalTime: '12 мин', delay: -1, vehicleType: 'bus', capacity: 60, occupancy: 'low', passengers: 18 }
    ]
  },
  {
    id: '2',
    name: 'Площадь Революции',
    address: 'ул. Главная, 15',
    routes: ['12', '56', '101', '205'],
    coordinates: { lat: 55.7570, lng: 37.6210 },
    facilities: ['Wi-Fi', 'Электронное табло'],
    livePassengers: 15,
    nextBuses: [
      { route: '12', destination: 'Восточный квартал', arrivalTime: '2 мин', delay: 0, vehicleType: 'bus', capacity: 80, occupancy: 'high', passengers: 72 },
      { route: '56', destination: 'Центральный рынок', arrivalTime: '8 мин', delay: 3, vehicleType: 'trolleybus', capacity: 90, occupancy: 'medium', passengers: 54 }
    ]
  },
  {
    id: '3',
    name: 'Университет',
    address: 'пр. Ленинградский, 25',
    routes: ['47', '89', '156', '205'],
    coordinates: { lat: 55.7520, lng: 37.6085 },
    facilities: ['Wi-Fi', 'Библиотека', 'Кафе'],
    livePassengers: 42,
    nextBuses: [
      { route: '89', destination: 'Спортивный комплекс', arrivalTime: '5 мин', delay: 1, vehicleType: 'bus', capacity: 70, occupancy: 'medium', passengers: 42 },
      { route: '156', destination: 'Технопарк', arrivalTime: '9 мин', delay: 0, vehicleType: 'tram', capacity: 110, occupancy: 'low', passengers: 33 }
    ]
  },
  {
    id: '4',
    name: 'Торговый центр "Мега"',
    address: 'ш. Киевское, 45',
    routes: ['101', '205', '47', '301'],
    coordinates: { lat: 55.7500, lng: 37.6250 },
    facilities: ['Wi-Fi', 'Торговый центр', 'Парковка'],
    livePassengers: 18,
    nextBuses: [
      { route: '301', destination: 'Аэропорт', arrivalTime: '4 мин', delay: -2, vehicleType: 'bus', capacity: 100, occupancy: 'high', passengers: 88 },
      { route: '47', destination: 'Центральный вокзал', arrivalTime: '11 мин', delay: 0, vehicleType: 'tram', capacity: 120, occupancy: 'medium', passengers: 75 }
    ]
  },
  {
    id: '5',
    name: 'Стадион "Олимпийский"',
    address: 'пр. Олимпийский, 10',
    routes: ['78', '92', '156', '301'],
    coordinates: { lat: 55.7580, lng: 37.6300 },
    facilities: ['Wi-Fi', 'Спортивная зона', 'Кафе'],
    livePassengers: 8,
    nextBuses: [
      { route: '78', destination: 'Ботанический сад', arrivalTime: '6 мин', delay: 1, vehicleType: 'bus', capacity: 85, occupancy: 'low', passengers: 25 },
      { route: '92', destination: 'Центральный парк', arrivalTime: '14 мин', delay: 0, vehicleType: 'trolleybus', capacity: 95, occupancy: 'medium', passengers: 57 }
    ]
  },
  {
    id: '6',
    name: 'Речной вокзал',
    address: 'наб. Речная, 5',
    routes: ['34', '67', '205', '301'],
    coordinates: { lat: 55.7450, lng: 37.6150 },
    facilities: ['Wi-Fi', 'Кафе', 'Туалет', 'Инфоцентр'],
    livePassengers: 31,
    nextBuses: [
      { route: '34', destination: 'Парк Победы', arrivalTime: '3 мин', delay: 0, vehicleType: 'bus', capacity: 75, occupancy: 'high', passengers: 68 },
      { route: '67', destination: 'Южный терминал', arrivalTime: '10 мин', delay: 2, vehicleType: 'tram', capacity: 115, occupancy: 'medium', passengers: 72 }
    ]
  }
];

// Данные для электронных билетов
const electronicTickets: ElectronicTicket[] = [
  {
    id: '1',
    type: 'single',
    name: 'Разовый билет',
    price: '50 ₽',
    description: 'Одна поездка на любом виде транспорта',
    validity: '90 минут',
    features: ['Одна поездка', 'Действует 90 минут', 'Все виды транспорта', 'Автоматическая активация'],
    isActive: true,
    qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmZmYiLz48L3N2Zz4='
  },
  {
    id: '2',
    type: 'daily',
    name: 'Суточный билет',
    price: '250 ₽',
    description: 'Неограниченное число поездок в течение дня',
    validity: '24 часа',
    features: ['Неограниченные поездки', 'Действует 24 часа', 'Все виды транспорта', 'Экономия до 70%', 'Семейный тариф'],
    isActive: false
  },
  {
    id: '3',
    type: 'weekly',
    name: 'Недельный проездной',
    price: '1 200 ₽',
    description: 'Неограниченные поездки в течение недели',
    validity: '7 дней',
    features: ['Неограниченные поездки', 'Действует 7 дней', 'Все виды транспорта', 'Уведомления об окончании', 'Автопродление'],
    isActive: true,
    expiresAt: '28 дек 2024',
    qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmZmYiLz48L3N2Zz4='
  },
  {
    id: '4',
    type: 'monthly',
    name: 'Месячный проездной',
    price: '4 500 ₽',
    description: 'Неограниченные поездки в течение месяца',
    validity: '30 дней',
    features: ['Неограниченные поездки', 'Действует 30 дней', 'Все виды транспорта', 'Семейная скидка', 'Бесплатная блокировка', 'Приоритетная поддержка'],
    isActive: false
  },
  {
    id: '5',
    type: 'monthly',
    name: 'Студенческий проездной',
    price: '2 800 ₽',
    description: 'Специальный тариф для студентов',
    validity: '30 дней',
    features: ['Неограниченные поездки', 'Скидка 40%', 'Все виды транспорта', 'Действует 30 дней', 'Подтверждение статуса'],
    isActive: false
  },
  {
    id: '6',
    type: 'daily',
    name: 'Туристический билет',
    price: '500 ₽',
    description: 'Идеально для туристов и гостей города',
    validity: '72 часа',
    features: ['Неограниченные поездки', 'Действует 3 дня', 'Все виды транспорта', 'Туристическая карта', 'Скидки в музеях'],
    isActive: false
  }
];

// Данные для транспорта онлайн
const liveVehicles: Vehicle[] = [
  {
    id: '1',
    route: '101',
    vehicleNumber: 'А101КХ',
    type: 'bus',
    coordinates: { lat: 55.7560, lng: 37.6175 },
    speed: 42,
    direction: 45,
    occupancy: 65,
    nextStop: 'Площадь Революции',
    delay: 0,
    passengers: 52,
    capacity: 80
  },
  {
    id: '2',
    route: '47',
    vehicleNumber: 'Т047МР',
    type: 'tram',
    coordinates: { lat: 55.7530, lng: 37.6090 },
    speed: 35,
    direction: 120,
    occupancy: 85,
    nextStop: 'Университет',
    delay: 2,
    passengers: 102,
    capacity: 120
  },
  {
    id: '3',
    route: '205',
    vehicleNumber: 'А205РУ',
    type: 'bus',
    coordinates: { lat: 55.7580, lng: 37.6220 },
    speed: 38,
    direction: 300,
    occupancy: 40,
    nextStop: 'Торговый центр "Мега"',
    delay: -1,
    passengers: 24,
    capacity: 60
  },
  {
    id: '4',
    route: '12',
    vehicleNumber: 'А012СВ',
    type: 'bus',
    coordinates: { lat: 55.7575, lng: 37.6205 },
    speed: 28,
    direction: 90,
    occupancy: 90,
    nextStop: 'Центральный вокзал',
    delay: 3,
    passengers: 72,
    capacity: 80
  },
  {
    id: '5',
    route: '56',
    vehicleNumber: 'Т056КС',
    type: 'trolleybus',
    coordinates: { lat: 55.7540, lng: 37.6190 },
    speed: 32,
    direction: 180,
    occupancy: 60,
    nextStop: 'Стадион "Олимпийский"',
    delay: 0,
    passengers: 54,
    capacity: 90
  },
  {
    id: '6',
    route: '301',
    vehicleNumber: 'А301МТ',
    type: 'bus',
    coordinates: { lat: 55.7490, lng: 37.6260 },
    speed: 45,
    direction: 270,
    occupancy: 88,
    nextStop: 'Речной вокзал',
    delay: -2,
    passengers: 88,
    capacity: 100
  }
];

// Данные для статистики поездок
const tripStats: TripStats = {
  totalTrips: 347,
  monthlyTrips: 42,
  totalDistance: 1287,
  favoriteRoute: '101',
  carbonSaved: 245,
  moneySaved: 15600,
  weeklyStats: [
    { day: 'Пн', trips: 8, distance: 32 },
    { day: 'Вт', trips: 6, distance: 28 },
    { day: 'Ср', trips: 9, distance: 41 },
    { day: 'Чт', trips: 7, distance: 35 },
    { day: 'Пт', trips: 10, distance: 48 },
    { day: 'Сб', trips: 5, distance: 22 },
    { day: 'Вс', trips: 3, distance: 15 }
  ]
};

// Утилиты
const getVehicleColor = (type: Vehicle['type']) => {
  return {
    bus: COLORS.blue,
    tram: COLORS.emerald,
    trolleybus: COLORS.purple
  }[type];
};

const getVehicleIcon = (type: Vehicle['type']) => {
  return {
    bus: '🚌',
    tram: '🚊',
    trolleybus: '🚎'
  }[type];
};

const getOccupancyColor = (occupancy: NextBus['occupancy']) => {
  return {
    low: COLORS.emerald,
    medium: COLORS.amber,
    high: COLORS.rose
  }[occupancy];
};

const getOccupancyText = (occupancy: NextBus['occupancy']) => {
  return {
    low: 'Свободно',
    medium: 'Умеренно',
    high: 'Загружено'
  }[occupancy];
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

// Bento Card компонент
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

// Modal Component
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

// Компонент карточки остановки
const BusStopCard = ({ stop, onClick }: { stop: BusStop; onClick?: () => void }) => {
  return (
    <BentoCard className="p-4 cursor-pointer" glowColor={COLORS.blue} onClick={onClick} gradient>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-sm mb-1">{stop.name}</h3>
          <div className="text-white/60 text-xs mb-2">{stop.address}</div>
          <div className="flex flex-wrap gap-1 mb-2">
            {stop.routes.slice(0, 4).map((route) => (
              <span key={route} className="px-2 py-1 bg-white/10 text-white/80 rounded text-xs">
                {route}
              </span>
            ))}
            {stop.routes.length > 4 && (
              <span className="px-2 py-1 bg-white/5 text-white/60 rounded text-xs">
                +{stop.routes.length - 4}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          {stop.livePassengers && (
            <div className="flex items-center gap-1 text-xs text-white/60 mb-1">
              <span>👥 {stop.livePassengers}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-green-400">
            <span>🟢</span>
            <span>Работает</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {stop.nextBuses.slice(0, 2).map((bus, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{bus.route}</span>
              <span className="text-white/60 text-xs">{bus.destination}</span>
            </div>
            <div className="flex items-center gap-2">
              <span 
                className={`px-1.5 py-0.5 rounded text-xs ${
                  bus.delay === 0 ? 'bg-green-500/20 text-green-400' :
                  bus.delay > 0 ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}
              >
                {bus.delay > 0 ? `+${bus.delay}` : bus.delay < 0 ? `${bus.delay}` : 'по расписанию'}
              </span>
              <span className="text-white font-medium">{bus.arrivalTime}</span>
            </div>
          </div>
        ))}
      </div>

      {stop.facilities.length > 0 && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
          <div className="flex flex-wrap gap-1">
            {stop.facilities.slice(0, 2).map((facility, index) => (
              <span key={index} className="px-1.5 py-0.5 bg-white/5 text-white/60 rounded text-xs">
                {facility}
              </span>
            ))}
          </div>
        </div>
      )}
    </BentoCard>
  );
};

// Компонент карточки билета
const TicketCard = ({ ticket, onClick }: { ticket: ElectronicTicket; onClick?: () => void }) => {
  return (
    <BentoCard 
      className="p-4 cursor-pointer" 
      glowColor={ticket.isActive ? COLORS.emerald : COLORS.blue}
      onClick={onClick}
      gradient
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-sm mb-1">{ticket.name}</h3>
          <div className="text-white/60 text-xs">{ticket.description}</div>
        </div>
        <div className="text-right">
          <div className="text-white font-bold text-lg">{ticket.price}</div>
          {ticket.isActive && (
            <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30 mt-1">
              Активен
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Действует:</span>
          <span className="text-white">{ticket.validity}</span>
        </div>
        {ticket.expiresAt && (
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Истекает:</span>
            <span className="text-amber-400">{ticket.expiresAt}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        {ticket.features.slice(0, 2).map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-xs text-white/60">
            <span className="text-green-400">✓</span>
            <span>{feature}</span>
          </div>
        ))}
        {ticket.features.length > 2 && (
          <div className="text-white/40 text-xs">
            +{ticket.features.length - 2} других преимуществ
          </div>
        )}
      </div>

      {!ticket.isActive && (
        <button className="w-full mt-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors text-sm font-semibold">
          Купить
        </button>
      )}
    </BentoCard>
  );
};

// Компонент карточки транспорта
const VehicleCard = ({ vehicle, onClick }: { vehicle: Vehicle; onClick?: () => void }) => {
  const occupancyColor = vehicle.occupancy < 50 ? COLORS.emerald : 
                        vehicle.occupancy < 80 ? COLORS.amber : COLORS.rose;
  
  return (
    <BentoCard className="p-4 cursor-pointer" glowColor={getVehicleColor(vehicle.type)} onClick={onClick} gradient>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getVehicleIcon(vehicle.type)}</div>
          <div>
            <h3 className="text-white font-semibold text-sm">Маршрут {vehicle.route}</h3>
            <div className="text-white/60 text-xs">{vehicle.vehicleNumber}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-xs text-white/60 mb-1">
            <span>⚡ {vehicle.speed} км/ч</span>
          </div>
          <div 
            className={`px-2 py-1 rounded-full text-xs border ${
              vehicle.delay === 0 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
              vehicle.delay > 0 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
              'bg-blue-500/20 text-blue-400 border-blue-500/30'
            }`}
          >
            {vehicle.delay > 0 ? `+${vehicle.delay} мин` : vehicle.delay < 0 ? `${vehicle.delay} мин` : 'по расписанию'}
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Следующая остановка:</span>
          <span className="text-white">{vehicle.nextStop}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Загруженность:</span>
          <div className="flex items-center gap-2">
            <div className="w-16 bg-white/10 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${vehicle.occupancy}%`,
                  backgroundColor: `rgb(${occupancyColor})`
                }}
              />
            </div>
            <span className="text-white text-xs">{vehicle.occupancy}%</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Пассажиры:</span>
          <span className="text-white">{vehicle.passengers}/{vehicle.capacity}</span>
        </div>
      </div>
    </BentoCard>
  );
};

// Компонент KPI
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

// Основной компонент страницы транспорта
export default function TransportServicesPage() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Состояния для модальных окон
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isBuyTicketModalOpen, setIsBuyTicketModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  
  // Выбранные элементы
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<ElectronicTicket | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // KPI данные
  const transportKPIs = [
    { 
      title: 'Всего поездок', 
      value: tripStats.totalTrips.toString(), 
      change: '+12', 
      description: 'за все время', 
      icon: '🚗', 
      color: COLORS.blue,
      trend: 'up' as const
    },
    { 
      title: 'Экономия', 
      value: `${tripStats.moneySaved} ₽`, 
      change: '+1 200 ₽', 
      description: 'в этом месяце', 
      icon: '💰', 
      color: COLORS.emerald,
      trend: 'up' as const
    },
    { 
      title: 'Сохранено CO₂', 
      value: `${tripStats.carbonSaved} кг`, 
      description: 'экологический вклад', 
      icon: '🌱', 
      color: COLORS.teal,
      trend: 'stable' as const
    },
    { 
      title: 'Пройдено км', 
      value: `${tripStats.totalDistance} км`, 
      description: 'общее расстояние', 
      icon: '🛣️', 
      color: COLORS.purple,
      trend: 'up' as const
    }
  ];

  // Фильтрация данных
  const filteredStops = busStops.filter(stop => 
    stop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stop.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stop.routes.some(route => route.includes(searchQuery))
  );

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
  const handleViewStop = (stop: BusStop) => {
    setSelectedStop(stop);
    setIsStopModalOpen(true);
  };

  const handleViewTicket = (ticket: ElectronicTicket) => {
    setSelectedTicket(ticket);
    setIsTicketModalOpen(true);
  };

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsVehicleModalOpen(true);
  };

  const handleBuyTicket = (ticket: ElectronicTicket) => {
    setSelectedTicket(ticket);
    setIsBuyTicketModalOpen(true);
  };

  const handleViewStats = () => {
    setIsStatsModalOpen(true);
  };

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
                <h1 className="text-3xl font-bold text-white mb-2">🚍 Транспортные услуги</h1>
                <p className="text-white/60 text-lg mb-4">
                  Умное управление поездками. Расписание, билеты и отслеживание транспорта в реальном времени.
                </p>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>{busStops.length} остановок онлайн</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>{liveVehicles.length} транспорта в пути</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>{electronicTickets.length} типа билетов</span>
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
                  <div className="text-white/60 text-sm">Пассажир с 2022 года</div>
                </motion.div>
                <motion.button
                  className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsBuyTicketModalOpen(true)}
                >
                  Купить билет
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
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Статистика поездок</h2>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>Обновлено: {currentTime}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {transportKPIs.map((kpi, index) => (
              <KPIWidget key={index} {...kpi} onClick={handleViewStats} />
            ))}
          </div>
        </motion.section>

        {/* Navigation Tabs & Filters */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-wrap gap-2 flex-1">
              {[
                { id: 'overview', name: '📊 Обзор', color: 'blue' },
                { id: 'stops', name: '🚏 Расписание остановок', color: 'emerald' },
                { id: 'tickets', name: '🎫 Электронные билеты', color: 'purple' },
                { id: 'online', name: '🚍 Транспорт онлайн', color: 'orange' },
                { id: 'stats', name: '📈 Статистика поездок', color: 'cyan' }
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
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <BentoCard className="p-6" variant="wide" glowColor={COLORS.blue} gradient>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                      <span>🚏</span>
                      <span>Ближайшие остановки</span>
                    </h2>
                    <span className="text-white/60 text-sm">
                      {filteredStops.length} остановок
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredStops.slice(0, 4).map((stop) => (
                      <BusStopCard 
                        key={stop.id} 
                        stop={stop} 
                        onClick={() => handleViewStop(stop)}
                      />
                    ))}
                  </div>
                  {filteredStops.length === 0 && (
                    <div className="text-center py-8 text-white/60">
                      <div className="text-4xl mb-2">🚏</div>
                      <div>Остановки не найдены</div>
                      <div className="text-sm">Попробуйте изменить параметры поиска</div>
                    </div>
                  )}
                </BentoCard>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <BentoCard className="p-6" glowColor={COLORS.purple} gradient>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span>🎫</span>
                    <span>Мои билеты</span>
                  </h3>
                  <div className="space-y-3">
                    {electronicTickets.filter(t => t.isActive).map((ticket) => (
                      <motion.button 
                        key={ticket.id}
                        className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all text-left"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleViewTicket(ticket)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{ticket.name}</div>
                            <div className="text-white/60 text-sm">Истекает: {ticket.expiresAt}</div>
                          </div>
                          <div className="text-green-400 text-lg">✓</div>
                        </div>
                      </motion.button>
                    ))}
                    <motion.button 
                      className="w-full p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-blue-400 transition-all text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsBuyTicketModalOpen(true)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">+</span>
                        <div>
                          <div className="font-semibold">Купить новый билет</div>
                          <div className="text-blue-300/60 text-sm">Выберите подходящий тариф</div>
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </BentoCard>

                <BentoCard className="p-6" glowColor={COLORS.orange} gradient>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span>🚍</span>
                    <span>Транспорт онлайн</span>
                  </h3>
                  <div className="space-y-3">
                    {liveVehicles.slice(0, 3).map((vehicle) => (
                      <motion.button 
                        key={vehicle.id}
                        className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all text-left"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleViewVehicle(vehicle)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-xl">{getVehicleIcon(vehicle.type)}</div>
                            <div>
                              <div className="font-semibold text-sm">Маршрут {vehicle.route}</div>
                              <div className="text-white/60 text-xs">{vehicle.nextStop}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{vehicle.delay === 0 ? 'по расписанию' : `+${vehicle.delay} мин`}</div>
                            <div className="text-white/60 text-xs">{vehicle.speed} км/ч</div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </BentoCard>
              </motion.section>
            </>
          )}

          {/* Расписание остановок */}
          {activeTab === 'stops' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              <BentoCard className="p-6" variant="wide" glowColor={COLORS.emerald} gradient>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <span>🚏</span>
                    <span>Расписание остановок</span>
                  </h2>
                  <span className="text-white/60 text-sm">
                    {filteredStops.length} остановок
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStops.map((stop) => (
                    <BusStopCard 
                      key={stop.id} 
                      stop={stop} 
                      onClick={() => handleViewStop(stop)}
                    />
                  ))}
                </div>
                {filteredStops.length === 0 && (
                  <div className="text-center py-12 text-white/60">
                    <div className="text-4xl mb-2">🔍</div>
                    <div>Остановки не найдены</div>
                    <div className="text-sm">Попробуйте изменить параметры поиска</div>
                  </div>
                )}
              </BentoCard>
            </motion.section>
          )}

          {/* Электронные билеты */}
          {activeTab === 'tickets' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              <BentoCard className="p-6" variant="wide" glowColor={COLORS.purple} gradient>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <span>🎫</span>
                  <span>Электронные билеты</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {electronicTickets.map((ticket) => (
                    <TicketCard 
                      key={ticket.id} 
                      ticket={ticket} 
                      onClick={() => handleViewTicket(ticket)}
                    />
                  ))}
                </div>
              </BentoCard>
            </motion.section>
          )}

          {/* Транспорт онлайн */}
          {activeTab === 'online' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              <BentoCard className="p-6" variant="wide" glowColor={COLORS.orange} gradient>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <span>🚍</span>
                  <span>Транспорт онлайн</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveVehicles.map((vehicle) => (
                    <VehicleCard 
                      key={vehicle.id} 
                      vehicle={vehicle} 
                      onClick={() => handleViewVehicle(vehicle)}
                    />
                  ))}
                </div>
              </BentoCard>
            </motion.section>
          )}

          {/* Статистика поездок */}
          {activeTab === 'stats' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              <BentoCard className="p-6" variant="wide" glowColor={COLORS.cyan} gradient>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <span>📈</span>
                  <span>Статистика поездок</span>
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Основная статистика */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-white/60 text-sm">Всего поездок</div>
                        <div className="text-white font-bold text-2xl">{tripStats.totalTrips}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-white/60 text-sm">В этом месяце</div>
                        <div className="text-white font-bold text-2xl">{tripStats.monthlyTrips}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-white/60 text-sm">Общее расстояние</div>
                        <div className="text-white font-bold text-2xl">{tripStats.totalDistance} км</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-white/60 text-sm">Любимый маршрут</div>
                        <div className="text-white font-bold text-2xl">{tripStats.favoriteRoute}</div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-3">Экологический вклад</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Сохранено CO₂</span>
                          <span className="text-emerald-400">{tripStats.carbonSaved} кг</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Экономия</span>
                          <span className="text-emerald-400">{tripStats.moneySaved} ₽</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* График недельной статистики */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-4">Поездки по дням недели</h4>
                    <div className="space-y-3">
                      {tripStats.weeklyStats.map((day, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-white/60 text-sm w-8">{day.day}</span>
                          <div className="flex-1 mx-3">
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-500 bg-blue-500"
                                style={{ width: `${(day.trips / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-right text-xs text-white/60 w-12">
                            {day.trips} поездок
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </BentoCard>
            </motion.section>
          )}
        </div>
      </main>

      {/* Модальное окно деталей остановки */}
      <Modal 
        isOpen={isStopModalOpen} 
        onClose={() => setIsStopModalOpen(false)}
        title="🚏 Детали остановки"
        size="lg"
      >
        {selectedStop && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-bold text-xl">{selectedStop.name}</h3>
                <p className="text-white/60">{selectedStop.address}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-green-400">
                  <span>🟢</span>
                  <span>Работает</span>
                </div>
                {selectedStop.livePassengers && (
                  <div className="text-white/60 text-sm mt-1">
                    👥 {selectedStop.livePassengers} пассажиров
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Ближайшие рейсы</h4>
              <div className="space-y-3">
                {selectedStop.nextBuses.map((bus, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{getVehicleIcon(bus.vehicleType)}</div>
                      <div>
                        <div className="text-white font-semibold">Маршрут {bus.route}</div>
                        <div className="text-white/60 text-sm">{bus.destination}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span 
                            className="px-2 py-1 rounded text-xs border"
                            style={{
                              backgroundColor: `rgba(${getOccupancyColor(bus.occupancy)}, 0.2)`,
                              color: `rgb(${getOccupancyColor(bus.occupancy)})`,
                              borderColor: `rgba(${getOccupancyColor(bus.occupancy)}, 0.3)`
                            }}
                          >
                            {getOccupancyText(bus.occupancy)}
                          </span>
                          <span className="text-white/60 text-xs">{bus.passengers}/{bus.capacity} мест</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">{bus.arrivalTime}</div>
                      <div className={`text-xs ${
                        bus.delay === 0 ? 'text-green-400' :
                        bus.delay > 0 ? 'text-amber-400' : 'text-blue-400'
                      }`}>
                        {bus.delay === 0 ? 'по расписанию' : 
                         bus.delay > 0 ? `+${bus.delay} мин` : `${bus.delay} мин`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-3">Маршруты</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStop.routes.map((route) => (
                    <span key={route} className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm">
                      {route}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Удобства</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStop.facilities.map((facility, index) => (
                    <span key={index} className="px-2 py-1 bg-white/5 text-white/60 rounded text-xs">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold">
                Получить уведомления
              </button>
              <button className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
                Построить маршрут
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно деталей билета */}
      <Modal 
        isOpen={isTicketModalOpen} 
        onClose={() => setIsTicketModalOpen(false)}
        title="🎫 Детали билета"
        size="md"
      >
        {selectedTicket && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-bold text-xl">{selectedTicket.name}</h3>
                <p className="text-white/60">{selectedTicket.description}</p>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-2xl">{selectedTicket.price}</div>
                {selectedTicket.isActive && (
                  <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400 border border-green-500/30 mt-2">
                    Активен
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Действует</div>
                <div className="text-white font-semibold">{selectedTicket.validity}</div>
              </div>
              {selectedTicket.expiresAt && (
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm">Истекает</div>
                  <div className="text-amber-400 font-semibold">{selectedTicket.expiresAt}</div>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Преимущества</h4>
              <div className="space-y-2">
                {selectedTicket.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-white text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedTicket.isActive && selectedTicket.qrCode && (
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3 text-center">QR-код билета</h4>
                <div className="flex justify-center">
                  <img 
                    alt="QR Code" 
                    className="w-32 h-32 bg-white rounded-lg"
                  />
                </div>
                <p className="text-white/60 text-sm text-center mt-2">Покажите код контроллеру</p>
              </div>
            )}

            {selectedTicket.isActive && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 text-xl">✅</span>
                  <div>
                    <div className="text-emerald-400 font-semibold">Билет активен</div>
                    <div className="text-emerald-300 text-sm mt-1">Можно использовать для поездок</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-white/10">
              {!selectedTicket.isActive && (
                <button 
                  className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold"
                  onClick={() => {
                    setIsTicketModalOpen(false);
                    setIsBuyTicketModalOpen(true);
                  }}
                >
                  Купить билет
                </button>
              )}
              <button className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
                Поделиться
              </button>
              <button className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
                📧
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно деталей транспорта */}
      <Modal 
        isOpen={isVehicleModalOpen} 
        onClose={() => setIsVehicleModalOpen(false)}
        title="🚍 Детали транспорта"
        size="lg"
      >
        {selectedVehicle && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{getVehicleIcon(selectedVehicle.type)}</div>
                <div>
                  <h3 className="text-white font-bold text-xl">Маршрут {selectedVehicle.route}</h3>
                  <div className="text-white/60">{selectedVehicle.vehicleNumber}</div>
                </div>
              </div>
              <div className="text-right">
                <div 
                  className={`px-3 py-1 rounded-full text-sm border font-medium ${
                    selectedVehicle.delay === 0 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    selectedVehicle.delay > 0 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}
                >
                  {selectedVehicle.delay > 0 ? `+${selectedVehicle.delay} мин` : 
                   selectedVehicle.delay < 0 ? `${selectedVehicle.delay} мин` : 'по расписанию'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Скорость</div>
                <div className="text-white font-semibold">{selectedVehicle.speed} км/ч</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Пассажиры</div>
                <div className="text-white font-semibold">{selectedVehicle.passengers}/{selectedVehicle.capacity}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Загруженность</div>
                <div className="text-white font-semibold">{selectedVehicle.occupancy}%</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm">Тип</div>
                <div className="text-white font-semibold capitalize">
                  {selectedVehicle.type === 'bus' ? 'Автобус' : 
                   selectedVehicle.type === 'tram' ? 'Трамвай' : 'Троллейбус'}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Текущий статус</h4>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white/60 text-sm">Следующая остановка</div>
                    <div className="text-white font-semibold text-lg">{selectedVehicle.nextStop}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/60 text-sm">Примерное время</div>
                    <div className="text-white font-semibold">~5 минут</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Загруженность</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white/60">
                  <span>Свободно</span>
                  <span>{selectedVehicle.capacity - selectedVehicle.passengers} мест</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${selectedVehicle.occupancy}%`,
                      backgroundColor: `rgb(${
                        selectedVehicle.occupancy < 50 ? COLORS.emerald : 
                        selectedVehicle.occupancy < 80 ? COLORS.amber : COLORS.rose
                      })`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/60">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold">
                Отслеживать
              </button>
              <button className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
                Сообщить о проблеме
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно покупки билета */}
      <Modal 
        isOpen={isBuyTicketModalOpen} 
        onClose={() => setIsBuyTicketModalOpen(false)}
        title="🎫 Покупка билета"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-white font-semibold mb-4">Выберите тип билета</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {electronicTickets.map((ticket) => (
                <div 
                  key={ticket.id}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 cursor-pointer transition-all"
                  onClick={() => handleViewTicket(ticket)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-white font-semibold">{ticket.name}</h5>
                      <p className="text-white/60 text-sm">{ticket.description}</p>
                    </div>
                    <div className="text-white font-bold text-lg">{ticket.price}</div>
                  </div>
                  <div className="mt-3">
                    <div className="text-white/60 text-sm mb-2">Действует: {ticket.validity}</div>
                    <div className="flex flex-wrap gap-1">
                      {ticket.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-white/5 text-white/60 rounded text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-400 font-semibold mb-2">Способы оплаты</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer">
                <div className="text-xl">💳</div>
                <div>
                  <div className="text-white text-sm">Банковская карта</div>
                  <div className="text-white/60 text-xs">Visa, Mastercard, Mir</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer">
                <div className="text-xl">📱</div>
                <div>
                  <div className="text-white text-sm">Электронный кошелек</div>
                  <div className="text-white/60 text-xs">Qiwi, YooMoney</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer">
                <div className="text-xl">📲</div>
                <div>
                  <div className="text-white text-sm">Мобильный платеж</div>
                  <div className="text-white/60 text-xs">Apple Pay, Google Pay</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer">
                <div className="text-xl">🏦</div>
                <div>
                  <div className="text-white text-sm">Интернет-банкинг</div>
                  <div className="text-white/60 text-xs">Сбербанк, Тинькофф</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold">
              Перейти к оплате
            </button>
            <button 
              onClick={() => setIsBuyTicketModalOpen(false)}
              className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>

      {/* Модальное окно статистики */}
      <Modal 
        isOpen={isStatsModalOpen} 
        onClose={() => setIsStatsModalOpen(false)}
        title="📈 Детальная статистика"
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/60 text-sm">Всего поездок</div>
              <div className="text-white font-bold text-2xl">{tripStats.totalTrips}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/60 text-sm">В этом месяце</div>
              <div className="text-white font-bold text-2xl">{tripStats.monthlyTrips}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/60 text-sm">Общее расстояние</div>
              <div className="text-white font-bold text-2xl">{tripStats.totalDistance} км</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/60 text-sm">Любимый маршрут</div>
              <div className="text-white font-bold text-2xl">{tripStats.favoriteRoute}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-4">Экологический вклад</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-white/60 mb-1">
                    <span>Сохранено CO₂</span>
                    <span>{tripStats.carbonSaved} кг</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: '85%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-white/60 mb-1">
                    <span>Экономия</span>
                    <span>{tripStats.moneySaved} ₽</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: '72%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-4">Поездки по дням недели</h4>
              <div className="space-y-3">
                {tripStats.weeklyStats.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-white/60 text-sm w-8">{day.day}</span>
                    <div className="flex-1 mx-3">
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500 bg-blue-500"
                          style={{ width: `${(day.trips / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right text-xs text-white/60 w-16">
                      {day.trips} поездок
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4">Сравнение с предыдущим месяцем</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-white/60 text-sm">Поездки</div>
                <div className="text-white font-bold text-xl">+15%</div>
                <div className="text-emerald-400 text-sm">↑ увеличение</div>
              </div>
              <div className="text-center">
                <div className="text-white/60 text-sm">Расстояние</div>
                <div className="text-white font-bold text-xl">+22%</div>
                <div className="text-emerald-400 text-sm">↑ увеличение</div>
              </div>
              <div className="text-center">
                <div className="text-white/60 text-sm">Экономия</div>
                <div className="text-white font-bold text-xl">+18%</div>
                <div className="text-emerald-400 text-sm">↑ увеличение</div>
              </div>
              <div className="text-center">
                <div className="text-white/60 text-sm">CO₂</div>
                <div className="text-white font-bold text-xl">+12%</div>
                <div className="text-emerald-400 text-sm">↑ сохранено</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-semibold">
              Экспорт данных
            </button>
            <button className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
              Поделиться
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}