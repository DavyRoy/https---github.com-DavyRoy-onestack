'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Типы данных
interface ServiceRequest {
  id: string;
  vehicleId: string;
  licensePlate: string;
  model: string;
  ownerName: string;
  ownerPhone: string;
  type: 'maintenance' | 'repair' | 'diagnostic' | 'emergency' | 'warranty';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'diagnostic' | 'in_progress' | 'waiting_parts' | 'ready' | 'completed';
  description: string;
  createdDate: string;
  estimatedCompletion: string;
  actualCompletion?: string;
  assignedMechanic?: string;
  estimatedCost: number;
  actualCost?: number;
  services: ServiceItem[];
  parts: PartItem[];
  notes?: string;
}

interface ServiceItem {
  id: string;
  name: string;
  category: 'oil' | 'brakes' | 'engine' | 'transmission' | 'electrical' | 'suspension' | 'tires' | 'other';
  estimatedTime: number;
  actualTime?: number;
  cost: number;
  status: 'pending' | 'in_progress' | 'completed';
}

interface PartItem {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  unitCost: number;
  supplier: string;
  status: 'ordered' | 'in_stock' | 'installed';
  estimatedDelivery?: string;
}

interface Mechanic {
  id: string;
  name: string;
  specialization: string[];
  experience: number;
  rating: number;
  status: 'available' | 'busy' | 'break' | 'off';
  currentJobs: string[];
  completedJobs: number;
  efficiency: number;
}

interface InventoryItem {
  id: string;
  name: string;
  partNumber: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unitCost: number;
  supplier: string;
  lastRestock: string;
  nextRestock?: string;
}

// Моки данных
const serviceRequests: ServiceRequest[] = [
  {
    id: 'sr-001',
    vehicleId: 'v-001',
    licensePlate: 'A123BC77',
    model: 'Volvo FH16',
    ownerName: 'ООО "ТрансЛогистик"',
    ownerPhone: '+7 (495) 111-22-33',
    type: 'repair',
    priority: 'high',
    status: 'in_progress',
    description: 'Замена тормозных колодок и дисков, диагностика тормозной системы',
    createdDate: '2024-06-18T08:00:00',
    estimatedCompletion: '2024-06-18T18:00:00',
    assignedMechanic: 'm-001',
    estimatedCost: 45000,
    services: [
      {
        id: 's-1',
        name: 'Диагностика тормозной системы',
        category: 'brakes',
        estimatedTime: 1,
        actualTime: 0.8,
        cost: 2500,
        status: 'completed'
      },
      {
        id: 's-2',
        name: 'Замена передних тормозных колодок',
        category: 'brakes',
        estimatedTime: 2,
        actualTime: 1.5,
        cost: 15000,
        status: 'completed'
      },
      {
        id: 's-3',
        name: 'Замена тормозных дисков',
        category: 'brakes',
        estimatedTime: 3,
        actualTime: 2.2,
        cost: 27500,
        status: 'in_progress'
      }
    ],
    parts: [
      {
        id: 'p-1',
        name: 'Тормозные колодки передние',
        partNumber: 'VOL-BP-001',
        quantity: 2,
        unitCost: 5000,
        supplier: 'Volvo Parts',
        status: 'installed'
      },
      {
        id: 'p-2',
        name: 'Тормозные диски',
        partNumber: 'VOL-BD-002',
        quantity: 2,
        unitCost: 10000,
        supplier: 'Volvo Parts',
        status: 'in_stock'
      }
    ]
  },
  {
    id: 'sr-002',
    vehicleId: 'v-002',
    licensePlate: 'B456DE77',
    model: 'Mercedes Sprinter',
    ownerName: 'ИП Смирнов А.В.',
    ownerPhone: '+7 (916) 222-33-44',
    type: 'maintenance',
    priority: 'medium',
    status: 'diagnostic',
    description: 'Плановое техническое обслуживание, замена масла и фильтров',
    createdDate: '2024-06-18T09:30:00',
    estimatedCompletion: '2024-06-18T16:00:00',
    assignedMechanic: 'm-002',
    estimatedCost: 12000,
    services: [
      {
        id: 's-4',
        name: 'Замена моторного масла',
        category: 'oil',
        estimatedTime: 1,
        cost: 3000,
        status: 'pending'
      },
      {
        id: 's-5',
        name: 'Замена масляного фильтра',
        category: 'oil',
        estimatedTime: 0.5,
        cost: 2000,
        status: 'pending'
      },
      {
        id: 's-6',
        name: 'Замена воздушного фильтра',
        category: 'other',
        estimatedTime: 0.5,
        cost: 1500,
        status: 'pending'
      }
    ],
    parts: [
      {
        id: 'p-3',
        name: 'Моторное масло 5W-30',
        partNumber: 'MOB-5W30-5L',
        quantity: 2,
        unitCost: 2500,
        supplier: 'Mobil',
        status: 'in_stock'
      },
      {
        id: 'p-4',
        name: 'Масляный фильтр',
        partNumber: 'MER-OF-123',
        quantity: 1,
        unitCost: 1500,
        supplier: 'Mercedes',
        status: 'in_stock'
      }
    ]
  },
  {
    id: 'sr-003',
    vehicleId: 'v-003',
    licensePlate: 'C789FG77',
    model: 'Ford Transit',
    ownerName: 'ООО "КурьерСервис"',
    ownerPhone: '+7 (495) 333-44-55',
    type: 'emergency',
    priority: 'critical',
    status: 'waiting_parts',
    description: 'Ремонт двигателя после перегрева, замена прокладки ГБЦ',
    createdDate: '2024-06-17T14:00:00',
    estimatedCompletion: '2024-06-19T12:00:00',
    assignedMechanic: 'm-001',
    estimatedCost: 85000,
    services: [
      {
        id: 's-7',
        name: 'Диагностика двигателя',
        category: 'engine',
        estimatedTime: 2,
        actualTime: 2.5,
        cost: 5000,
        status: 'completed'
      },
      {
        id: 's-8',
        name: 'Замена прокладки ГБЦ',
        category: 'engine',
        estimatedTime: 6,
        cost: 45000,
        status: 'pending'
      },
      {
        id: 's-9',
        name: 'Промывка системы охлаждения',
        category: 'engine',
        estimatedTime: 2,
        cost: 12000,
        status: 'pending'
      }
    ],
    parts: [
      {
        id: 'p-5',
        name: 'Прокладка ГБЦ',
        partNumber: 'FOR-HG-456',
        quantity: 1,
        unitCost: 15000,
        supplier: 'Ford Parts',
        status: 'ordered',
        estimatedDelivery: '2024-06-18T16:00:00'
      },
      {
        id: 'p-6',
        name: 'Охлаждающая жидкость',
        partNumber: 'COOL-ANTI-5L',
        quantity: 3,
        unitCost: 1200,
        supplier: 'Hepu',
        status: 'in_stock'
      }
    ]
  },
  {
    id: 'sr-004',
    vehicleId: 'v-004',
    licensePlate: 'D012GH77',
    model: 'GAZelle NEXT',
    ownerName: 'ИП Козлов Д.И.',
    ownerPhone: '+7 (925) 444-55-66',
    type: 'diagnostic',
    priority: 'low',
    status: 'pending',
    description: 'Комплексная диагностика электрооборудования',
    createdDate: '2024-06-18T10:00:00',
    estimatedCompletion: '2024-06-18T14:00:00',
    estimatedCost: 3500,
    services: [
      {
        id: 's-10',
        name: 'Диагностика электрооборудования',
        category: 'electrical',
        estimatedTime: 2,
        cost: 3500,
        status: 'pending'
      }
    ],
    parts: []
  },
  {
    id: 'sr-005',
    vehicleId: 'v-005',
    licensePlate: 'E345IJ77',
    model: 'MAN TGS',
    ownerName: 'ООО "ГрузПеревозки"',
    ownerPhone: '+7 (495) 555-66-77',
    type: 'warranty',
    priority: 'medium',
    status: 'completed',
    description: 'Бесплатный ремонт по гарантии - замена подшипников ступицы',
    createdDate: '2024-06-15T09:00:00',
    estimatedCompletion: '2024-06-15T17:00:00',
    actualCompletion: '2024-06-15T16:30:00',
    assignedMechanic: 'm-003',
    estimatedCost: 0,
    actualCost: 0,
    services: [
      {
        id: 's-11',
        name: 'Замена подшипников ступицы передней',
        category: 'suspension',
        estimatedTime: 4,
        actualTime: 3.5,
        cost: 0,
        status: 'completed'
      }
    ],
    parts: [
      {
        id: 'p-7',
        name: 'Подшипник ступицы',
        partNumber: 'MAN-HB-789',
        quantity: 2,
        unitCost: 0,
        supplier: 'MAN Parts',
        status: 'installed'
      }
    ],
    notes: 'Работы выполнены в рамках гарантийного обслуживания'
  }
];

const mechanics: Mechanic[] = [
  {
    id: 'm-001',
    name: 'Петров Иван Сергеевич',
    specialization: ['engine', 'transmission', 'brakes'],
    experience: 12,
    rating: 4.9,
    status: 'busy',
    currentJobs: ['sr-001', 'sr-003'],
    completedJobs: 345,
    efficiency: 94
  },
  {
    id: 'm-002',
    name: 'Павлова Елена Викторовна',
    specialization: ['diagnostic', 'electrical', 'oil'],
    experience: 8,
    rating: 4.8,
    status: 'busy',
    currentJobs: ['sr-002'],
    completedJobs: 278,
    efficiency: 92
  },
  {
    id: 'm-003',
    name: 'Сидоров Алексей Николаевич',
    specialization: ['suspension', 'tires', 'brakes'],
    experience: 6,
    rating: 4.7,
    status: 'available',
    currentJobs: [],
    completedJobs: 189,
    efficiency: 89
  },
  {
    id: 'm-004',
    name: 'Кузнецов Дмитрий Олегович',
    specialization: ['engine', 'transmission'],
    experience: 15,
    rating: 4.9,
    status: 'break',
    currentJobs: [],
    completedJobs: 412,
    efficiency: 96
  },
  {
    id: 'm-005',
    name: 'Николаева Мария Игоревна',
    specialization: ['electrical', 'diagnostic'],
    experience: 5,
    rating: 4.6,
    status: 'off',
    currentJobs: [],
    completedJobs: 134,
    efficiency: 87
  }
];

const inventory: InventoryItem[] = [
  {
    id: 'inv-001',
    name: 'Моторное масло 5W-30',
    partNumber: 'MOB-5W30-5L',
    category: 'lubricants',
    quantity: 24,
    minQuantity: 10,
    unitCost: 2500,
    supplier: 'Mobil',
    lastRestock: '2024-06-10'
  },
  {
    id: 'inv-002',
    name: 'Тормозные колодки Volvo',
    partNumber: 'VOL-BP-001',
    category: 'brakes',
    quantity: 8,
    minQuantity: 4,
    unitCost: 5000,
    supplier: 'Volvo Parts',
    lastRestock: '2024-06-15'
  },
  {
    id: 'inv-003',
    name: 'Воздушный фильтр',
    partNumber: 'FIL-AIR-001',
    category: 'filters',
    quantity: 15,
    minQuantity: 8,
    unitCost: 1200,
    supplier: 'MANN-FILTER',
    lastRestock: '2024-06-12'
  },
  {
    id: 'inv-004',
    name: 'Свечи зажигания',
    partNumber: 'BOS-SPK-004',
    category: 'ignition',
    quantity: 36,
    minQuantity: 20,
    unitCost: 800,
    supplier: 'Bosch',
    lastRestock: '2024-06-08'
  },
  {
    id: 'inv-005',
    name: 'Аккумулятор 12V 100Ah',
    partNumber: 'BAT-12V-100',
    category: 'electrical',
    quantity: 6,
    minQuantity: 3,
    unitCost: 12000,
    supplier: 'Varta',
    lastRestock: '2024-06-05'
  },
  {
    id: 'inv-006',
    name: 'Шина 295/80 R22.5',
    partNumber: 'TYR-295-22.5',
    category: 'tires',
    quantity: 12,
    minQuantity: 6,
    unitCost: 25000,
    supplier: 'Michelin',
    lastRestock: '2024-06-01'
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
  type?: 'default' | 'service' | 'mechanic' | 'priority' | 'inventory' | 'request';
  size?: 'default' | 'small' | 'large';
  pulse?: boolean;
}) => {
  const getStatusConfig = () => {
    const configs = {
      // Статусы заявок
      pending: { color: COLORS.warning, label: 'Ожидание', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '🟡' },
      diagnostic: { color: COLORS.blue, label: 'Диагностика', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '🔍' },
      in_progress: { color: COLORS.orange, label: 'В работе', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '🛠️' },
      waiting_parts: { color: COLORS.rose, label: 'Ожидание запчастей', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: '📦' },
      ready: { color: COLORS.teal, label: 'Готово', bg: 'bg-teal-500/10', border: 'border-teal-500/20', icon: '✅' },
      completed: { color: COLORS.success, label: 'Завершено', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '🎉' },
      
      // Статусы механиков
      available: { color: COLORS.success, label: 'Свободен', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '🟢' },
      busy: { color: COLORS.orange, label: 'Занят', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '🔧' },
      break: { color: COLORS.warning, label: 'Перерыв', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '☕' },
      off: { color: COLORS.gray, label: 'Не на смене', bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: '⚪' },
      
      // Приоритеты
      low: { color: COLORS.success, label: 'Низкий', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '📉' },
      medium: { color: COLORS.warning, label: 'Средний', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '📊' },
      high: { color: COLORS.rose, label: 'Высокий', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: '📈' },
      critical: { color: COLORS.error, label: 'Критический', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '🚨' },
      
      // Типы услуг
      maintenance: { color: COLORS.blue, label: 'ТО', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '🔧' },
      repair: { color: COLORS.orange, label: 'Ремонт', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '⚙️' },
      diagnostic: { color: COLORS.purple, label: 'Диагностика', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: '🔍' },
      emergency: { color: COLORS.rose, label: 'Срочный', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: '🚑' },
      warranty: { color: COLORS.teal, label: 'Гарантия', bg: 'bg-teal-500/10', border: 'border-teal-500/20', icon: '🛡️' },
      
      // Статусы запчастей
      ordered: { color: COLORS.warning, label: 'Заказан', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '📥' },
      in_stock: { color: COLORS.success, label: 'В наличии', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '📦' },
      installed: { color: COLORS.blue, label: 'Установлен', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '🔧' }
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
const StatCard = ({ title, value, change, icon, color = COLORS.orange, size = 'default', trend, subtitle, onClick }: {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color?: string;
  size?: 'default' | 'compact' | 'large';
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  onClick?: () => void;
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
      onClick={onClick}
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
            <option value="pending">Ожидание</option>
            <option value="in_progress">В работе</option>
            <option value="completed">Завершено</option>
          </select>
          
          <select 
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-white/20 transition-all duration-200 flex-1 min-w-[120px]"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">Все типы</option>
            <option value="maintenance">ТО</option>
            <option value="repair">Ремонт</option>
            <option value="diagnostic">Диагностика</option>
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
                <label className="text-white/60 text-sm mb-2 block">Приоритет</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любой</option>
                  <option>Критический</option>
                  <option>Высокий</option>
                  <option>Средний</option>
                  <option>Низкий</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Механик</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любой</option>
                  <option>Петров И.С.</option>
                  <option>Павлова Е.В.</option>
                  <option>Сидоров А.Н.</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Дата создания</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любая</option>
                  <option>Сегодня</option>
                  <option>Вчера</option>
                  <option>Эта неделя</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Стоимость</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option>Любая</option>
                  <option>До 10 000 ₽</option>
                  <option>10 000 - 50 000 ₽</option>
                  <option>Более 50 000 ₽</option>
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
    { id: 1, type: 'warning', message: 'Требуется срочный ремонт Ford Transit', time: '5 мин назад' },
    { id: 2, type: 'info', message: 'Новая заявка на ТО Mercedes Sprinter', time: '1 час назад' },
    { id: 3, type: 'success', message: 'Заявка #SR-001 завершена досрочно', time: '2 часа назад' }
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
const ServiceRequestCard = ({ request, onClick, delay = 0 }: { request: ServiceRequest; onClick: () => void; delay?: number }) => {
  const assignedMechanic = mechanics.find(m => m.id === request.assignedMechanic);
  const progress = calculateRequestProgress(request);
  
  const getRequestColor = (priority: string) => {
    switch (priority) {
      case 'critical': return COLORS.rose;
      case 'high': return COLORS.orange;
      case 'medium': return COLORS.warning;
      case 'low': return COLORS.success;
      default: return COLORS.gray;
    }
  };

  function calculateRequestProgress(request: ServiceRequest): number {
    if (request.status === 'completed') return 100;
    if (request.status === 'ready') return 90;
    
    const totalServices = request.services.length;
    if (totalServices === 0) return 0;
    
    const completedServices = request.services.filter(s => s.status === 'completed').length;
    const inProgressServices = request.services.filter(s => s.status === 'in_progress').length;
    
    return ((completedServices + (inProgressServices * 0.5)) / totalServices) * 100;
  }

  const isUrgent = request.priority === 'critical' || request.priority === 'high';

  return (
    <BentoCard 
      className="p-3 sm:p-4" 
      glowColor={getRequestColor(request.priority)}
      onClick={onClick}
      variant="compact"
      delay={delay}
      hoverScale={1.03}
      magnetic
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
          <span className="text-lg">🚗</span>
          <div className="min-w-0">
            <h4 className="text-white font-semibold text-sm truncate">{request.model}</h4>
            <p className="text-white/60 text-xs">{request.licensePlate}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={request.type} type="request" size="small" />
          <StatusBadge status={request.priority} type="priority" size="small" pulse={isUrgent} />
        </div>
      </div>
      
      <div className="space-y-1.5 text-xs text-white/60 mb-3">
        <div className="flex justify-between">
          <span>Клиент:</span>
          <span className="text-white/80 truncate ml-2 max-w-[100px] sm:max-w-[120px]">{request.ownerName}</span>
        </div>
        <div className="flex justify-between">
          <span>Механик:</span>
          <span className="text-white/80 truncate ml-2 text-right">
            {assignedMechanic ? assignedMechanic.name : 'Не назначен'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Стоимость:</span>
          <span className="text-white/80">{formatCurrency(request.estimatedCost)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Прогресс:</span>
          <div className="flex items-center gap-2">
            <ProgressBar 
              value={progress} 
              max={100}
              color={getRequestColor(request.priority)}
              size="small"
            />
            <span className="text-white/80 text-xs w-8">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
      
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
          className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-xs py-1.5 px-2 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Отчет
        </motion.button>
      </div>

      {isUrgent && (
        <div className="mt-3 p-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg">
          <p className="text-rose-300 text-xs text-center">Срочный заказ</p>
        </div>
      )}
    </BentoCard>
  );
};

const MechanicCard = ({ mechanic, onClick, delay = 0 }: { mechanic: Mechanic; onClick: () => void; delay?: number }) => {
  const getMechanicColor = (status: string) => {
    switch (status) {
      case 'available': return COLORS.success;
      case 'busy': return COLORS.orange;
      case 'break': return COLORS.warning;
      case 'off': return COLORS.gray;
      default: return COLORS.gray;
    }
  };

  return (
    <BentoCard 
      className="p-3 sm:p-4" 
      glowColor={getMechanicColor(mechanic.status)}
      onClick={onClick}
      variant="compact"
      delay={delay}
      hoverScale={1.03}
      magnetic
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-2">
          <h4 className="text-white font-semibold text-sm truncate">{mechanic.name}</h4>
          <p className="text-white/60 text-xs">{mechanic.specialization.join(', ')}</p>
        </div>
        <StatusBadge status={mechanic.status} type="mechanic" size="small" pulse={mechanic.status === 'available'} />
      </div>
      
      <div className="space-y-1.5 text-xs text-white/60 mb-3">
        <div className="flex justify-between">
          <span>Опыт:</span>
          <span className="text-white/80">{mechanic.experience} лет</span>
        </div>
        
        <div className="flex justify-between">
          <span>Рейтинг:</span>
          <span className="text-white/80 flex items-center gap-1">
            ⭐ {mechanic.rating}/5.0
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Эффективность:</span>
          <span className="text-white/80">{mechanic.efficiency}%</span>
        </div>

        <div className="flex justify-between">
          <span>Текущие заказы:</span>
          <span className="text-white/80">{mechanic.currentJobs.length}</span>
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

const InventoryCard = ({ item, onClick, delay = 0 }: { item: InventoryItem; onClick: () => void; delay?: number }) => {
  const utilization = (item.quantity / item.minQuantity) * 100;
  const isLowStock = item.quantity <= item.minQuantity;
  
  const getInventoryColor = (utilization: number) => {
    if (isLowStock) return COLORS.rose;
    if (utilization < 150) return COLORS.orange;
    return COLORS.success;
  };

  return (
    <BentoCard 
      className="p-3 sm:p-4" 
      glowColor={getInventoryColor(utilization)}
      onClick={onClick}
      variant="compact"
      delay={delay}
      hoverScale={1.03}
      magnetic
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-2">
          <h4 className="text-white font-semibold text-sm truncate">{item.name}</h4>
          <p className="text-white/60 text-xs">{item.partNumber}</p>
        </div>
        <StatusBadge 
          status={isLowStock ? 'ordered' : 'in_stock'} 
          type="inventory" 
          size="small"
          pulse={isLowStock}
        />
      </div>
      
      <div className="space-y-1.5 text-xs text-white/60 mb-3">
        <div className="flex justify-between">
          <span>Категория:</span>
          <span className="text-white/80">{item.category}</span>
        </div>
        <div className="flex justify-between">
          <span>Поставщик:</span>
          <span className="text-white/80 truncate ml-2 text-right">{item.supplier}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Количество:</span>
          <span className="text-white/80">{item.quantity} шт</span>
        </div>
        <div className="flex justify-between">
          <span>Мин. запас:</span>
          <span className="text-white/80">{item.minQuantity} шт</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Уровень запаса:</span>
          <div className="flex items-center gap-2">
            <ProgressBar 
              value={utilization} 
              max={200}
              color={getInventoryColor(utilization)}
              size="small"
            />
            <span className="text-white/80 text-xs w-8">{Math.round(utilization)}%</span>
          </div>
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
          Детали
        </motion.button>
        <motion.button 
          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs py-1.5 px-2 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Заказать
        </motion.button>
      </div>
    </BentoCard>
  );
};

// Модальные окна
const ServiceRequestModal = ({ request, isOpen, onClose }: {
  request: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!request) return null;

  const assignedMechanic = mechanics.find(m => m.id === request.assignedMechanic);
  const progress = calculateRequestProgress(request);

  function calculateRequestProgress(request: ServiceRequest): number {
    if (request.status === 'completed') return 100;
    if (request.status === 'ready') return 90;
    
    const totalServices = request.services.length;
    if (totalServices === 0) return 0;
    
    const completedServices = request.services.filter(s => s.status === 'completed').length;
    const inProgressServices = request.services.filter(s => s.status === 'in_progress').length;
    
    return ((completedServices + (inProgressServices * 0.5)) / totalServices) * 100;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Заявка #${request.id}`} size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <StatusBadge status={request.status} type="service" />
            <StatusBadge status={request.type} type="request" />
            <StatusBadge status={request.priority} type="priority" />
            <span className="text-white/60 text-sm bg-white/5 px-2 sm:px-3 py-1 rounded-full">
              {formatCurrency(request.estimatedCost)}
            </span>
          </div>
          <div className="text-white/60 text-sm">
            Создана: {formatDate(request.createdDate)}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Информация о транспортном средстве</h3>
              <div className="space-y-2 text-xs sm:text-sm text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/60">Модель:</span>
                  <span className="text-white font-medium">{request.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Гос. номер:</span>
                  <span className="text-white font-medium">{request.licensePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Владелец:</span>
                  <span className="text-white font-medium">{request.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Телефон:</span>
                  <span className="text-white font-medium">{request.ownerPhone}</span>
                </div>
              </div>
            </div>

            {assignedMechanic && (
              <div>
                <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Ответственный механик</h3>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-300">
                    👨‍🔧
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{assignedMechanic.name}</p>
                    <p className="text-white/60 text-xs">{assignedMechanic.specialization.join(', ')}</p>
                  </div>
                  <StatusBadge status={assignedMechanic.status} type="mechanic" size="small" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Прогресс выполнения</h4>
              <div className="space-y-4">
                <ProgressBar 
                  value={progress} 
                  label={`Общий прогресс`}
                  color={COLORS.orange}
                  size="default"
                />
                <div className="grid grid-cols-2 gap-2">
                  <BentoCard variant="compact" className="text-center" magnetic>
                    <div className="text-lg sm:text-xl font-bold text-white mb-1">
                      {request.services.filter(s => s.status === 'completed').length}/{request.services.length}
                    </div>
                    <div className="text-white/60 text-xs">Услуги выполнены</div>
                  </BentoCard>
                  <BentoCard variant="compact" className="text-center" magnetic>
                    <div className="text-lg sm:text-xl font-bold text-white mb-1">
                      {request.parts.filter(p => p.status === 'installed').length}/{request.parts.length}
                    </div>
                    <div className="text-white/60 text-xs">Запчасти установлены</div>
                  </BentoCard>
                </div>
              </div>
            </BentoCard>

            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Сроки выполнения</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Дата создания:</span>
                  <span className="text-white font-medium">{formatDateTime(request.createdDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Планируемое завершение:</span>
                  <span className="text-white font-medium">{formatDateTime(request.estimatedCompletion)}</span>
                </div>
                {request.actualCompletion && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Фактическое завершение:</span>
                    <span className="text-white font-medium">{formatDateTime(request.actualCompletion)}</span>
                  </div>
                )}
              </div>
            </BentoCard>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Описание работ</h3>
          <BentoCard variant="compact" className="p-3 sm:p-4">
            <p className="text-white text-sm">{request.description}</p>
          </BentoCard>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Услуги</h3>
          <div className="space-y-2">
            {request.services.map((service) => (
              <BentoCard key={service.id} variant="compact" className="p-3 sm:p-4" magnetic>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm">{service.name}</h4>
                    <p className="text-white/60 text-xs">
                      {service.estimatedTime} ч • {formatCurrency(service.cost)}
                      {service.actualTime && ` • Факт: ${service.actualTime} ч`}
                    </p>
                  </div>
                  <StatusBadge status={service.status} size="small" />
                </div>
              </BentoCard>
            ))}
          </div>
        </div>

        {request.parts.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Запчасти</h3>
            <div className="space-y-2">
              {request.parts.map((part) => (
                <BentoCard key={part.id} variant="compact" className="p-3 sm:p-4" magnetic>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm">{part.name}</h4>
                      <p className="text-white/60 text-xs">
                        {part.partNumber} • {part.quantity} шт • {formatCurrency(part.unitCost)}/шт
                      </p>
                      {part.estimatedDelivery && (
                        <p className="text-white/40 text-xs">
                          Ожидаемая поставка: {formatDateTime(part.estimatedDelivery)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium text-sm">{formatCurrency(part.unitCost * part.quantity)}</p>
                      <StatusBadge status={part.status} type="inventory" size="small" />
                    </div>
                  </div>
                </BentoCard>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/10">
          <motion.button 
            className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Редактировать заявку
          </motion.button>
          <motion.button 
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            История изменений
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

const MechanicModal = ({ mechanic, isOpen, onClose }: {
  mechanic: Mechanic | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!mechanic) return null;

  const currentRequests = serviceRequests.filter(request => 
    mechanic.currentJobs.includes(request.id)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mechanic.name} size="lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <StatusBadge status={mechanic.status} type="mechanic" />
            <span className="text-white/60 text-sm bg-white/5 px-2 sm:px-3 py-1 rounded-full">
              {mechanic.experience} лет опыта
            </span>
            <span className="text-white/60 text-sm bg-blue-500/10 px-2 sm:px-3 py-1 rounded-full flex items-center gap-1">
              ⭐ {mechanic.rating}/5.0
            </span>
          </div>
          <div className="text-white/60 text-sm">
            ID: {mechanic.id}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Профессиональная информация</h3>
              <div className="space-y-2 text-xs sm:text-sm text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/60">Специализация:</span>
                  <span className="text-white font-medium text-right">{mechanic.specialization.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Опыт работы:</span>
                  <span className="text-white font-medium">{mechanic.experience} лет</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Завершено работ:</span>
                  <span className="text-white font-medium">{mechanic.completedJobs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Текущие заказы:</span>
                  <span className="text-white font-medium">{mechanic.currentJobs.length}</span>
                </div>
              </div>
            </div>

            {currentRequests.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Текущие заказы</h3>
                <div className="space-y-2">
                  {currentRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white text-sm">{request.model}</p>
                        <p className="text-white/60 text-xs">{request.licensePlate}</p>
                      </div>
                      <StatusBadge status={request.status} type="service" size="small" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Показатели эффективности</h4>
              <div className="space-y-3">
                <ProgressBar value={mechanic.efficiency} label="Общая эффективность" color={COLORS.orange} size="small" />
                <ProgressBar value={mechanic.rating * 20} label="Рейтинг качества" color={COLORS.blue} size="small" />
                <ProgressBar value={Math.min(mechanic.completedJobs / 10, 100)} label="Опыт работы" color={COLORS.emerald} size="small" />
                <ProgressBar value={mechanic.status === 'available' ? 100 : mechanic.status === 'busy' ? 80 : 40} label="Доступность" color={COLORS.purple} size="small" />
              </div>
            </BentoCard>

            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Статистика за месяц</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg sm:text-xl font-bold text-white mb-1">{Math.floor(mechanic.completedJobs / 12)}</div>
                  <div className="text-white/60 text-xs">Завершено работ</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-white mb-1">94%</div>
                  <div className="text-white/60 text-xs">Соответствие срокам</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-white mb-1">4.8</div>
                  <div className="text-white/60 text-xs">Средний рейтинг</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-white mb-1">2</div>
                  <div className="text-white/60 text-xs">Текущие заказы</div>
                </div>
              </div>
            </BentoCard>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/10">
          <motion.button 
            className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Назначить заказ
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

const InventoryModal = ({ item, isOpen, onClose }: {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!item) return null;

  const utilization = (item.quantity / item.minQuantity) * 100;
  const isLowStock = item.quantity <= item.minQuantity;
  const needsRestock = item.quantity <= item.minQuantity * 1.5;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item.name} size="md">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <StatusBadge 
              status={isLowStock ? 'ordered' : 'in_stock'} 
              type="inventory" 
              pulse={isLowStock}
            />
            <span className="text-white/60 text-sm bg-white/5 px-2 sm:px-3 py-1 rounded-full">
              {item.category}
            </span>
            {isLowStock && (
              <span className="text-white/60 text-sm bg-rose-500/10 px-2 sm:px-3 py-1 rounded-full">
                Низкий запас
              </span>
            )}
          </div>
          <div className="text-white/60 text-sm">
            Артикул: {item.partNumber}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Основная информация</h3>
              <div className="space-y-2 text-xs sm:text-sm text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/60">Наименование:</span>
                  <span className="text-white font-medium">{item.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Категория:</span>
                  <span className="text-white font-medium">{item.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Поставщик:</span>
                  <span className="text-white font-medium">{item.supplier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Стоимость:</span>
                  <span className="text-white font-medium">{formatCurrency(item.unitCost)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">История поставок</h3>
              <div className="space-y-2 text-xs sm:text-sm text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/60">Последняя поставка:</span>
                  <span className="text-white font-medium">{formatDate(item.lastRestock)}</span>
                </div>
                {item.nextRestock && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Следующая поставка:</span>
                    <span className="text-white font-medium">{formatDate(item.nextRestock)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <BentoCard variant="compact" magnetic>
              <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Уровень запаса</h4>
              <div className="space-y-4">
                <ProgressBar 
                  value={utilization} 
                  label={`${item.quantity} из ${item.minQuantity} шт (мин. запас)`}
                  color={isLowStock ? COLORS.rose : needsRestock ? COLORS.orange : COLORS.success}
                  size="default"
                />
                <div className="grid grid-cols-2 gap-2">
                  <BentoCard variant="compact" className="text-center" magnetic>
                    <div className="text-lg sm:text-xl font-bold text-white mb-1">{item.quantity}</div>
                    <div className="text-white/60 text-xs">Текущий запас</div>
                  </BentoCard>
                  <BentoCard variant="compact" className="text-center" magnetic>
                    <div className="text-lg sm:text-xl font-bold text-white mb-1">{item.minQuantity}</div>
                    <div className="text-white/60 text-xs">Мин. запас</div>
                  </BentoCard>
                </div>
              </div>
            </BentoCard>

            {isLowStock && (
              <BentoCard variant="compact" className="border-rose-500/30" magnetic>
                <h4 className="text-rose-300 font-semibold mb-2 text-sm">Требуется пополнение</h4>
                <p className="text-rose-300 text-xs">
                  Запас достиг критического уровня. Рекомендуется срочно заказать у поставщика.
                </p>
              </BentoCard>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/10">
          <motion.button 
            className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Заказать у поставщика
          </motion.button>
          <motion.button 
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Редактировать данные
          </motion.button>
          <motion.button 
            className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            История движений
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

// Основной компонент
export default function AutoserviceOrganization() {
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'mechanics' | 'inventory' | 'analytics'>('overview');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
  const [selectedInventory, setSelectedInventory] = useState<InventoryItem | null>(null);
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

  // Статистика
  const serviceStats = useMemo(() => {
    const totalRequests = serviceRequests.length;
    const activeRequests = serviceRequests.filter(r => 
      r.status === 'in_progress' || r.status === 'diagnostic' || r.status === 'waiting_parts'
    ).length;
    const completedToday = serviceRequests.filter(r => 
      r.actualCompletion && new Date(r.actualCompletion).toDateString() === new Date().toDateString()
    ).length;
    const totalRevenue = serviceRequests
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (r.actualCost || r.estimatedCost), 0);
    const availableMechanics = mechanics.filter(m => m.status === 'available').length;

    return {
      totalRequests,
      activeRequests,
      completedToday,
      totalRevenue,
      availableMechanics
    };
  }, []);

  // Фильтрация данных
  const filteredRequests = useMemo(() => {
    return serviceRequests.filter(request => {
      const matchesSearch = request.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          request.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          request.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status === 'all' || request.status === filters.status;
      const matchesType = filters.type === 'all' || request.type === filters.type;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, filters]);

  const filteredMechanics = useMemo(() => {
    return mechanics.filter(mechanic => {
      const matchesSearch = mechanic.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status === 'all' || mechanic.status === filters.status;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, filters]);

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.partNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [searchQuery]);

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: '📊', color: COLORS.blue },
    { id: 'requests' as const, label: 'Заявки', icon: '🔧', color: COLORS.orange },
    { id: 'mechanics' as const, label: 'Механики', icon: '👨‍🔧', color: COLORS.emerald },
    { id: 'inventory' as const, label: 'Склад', icon: '📦', color: COLORS.purple },
    { id: 'analytics' as const, label: 'Аналитика', icon: '📈', color: COLORS.rose }
  ];

  const handleRequestClick = (request: ServiceRequest) => {
    setSelectedRequest(request);
  };

  const handleMechanicClick = (mechanic: Mechanic) => {
    setSelectedMechanic(mechanic);
  };

  const handleInventoryClick = (item: InventoryItem) => {
    setSelectedInventory(item);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Добавляем данные для графиков
  const weeklyRequestsData = [12, 8, 15, 10, 14, 18, 9];
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
            Загрузка системы автосервиса...
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
          background: linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #eab308 100%);
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
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg cursor-pointer animate-float animate-pulse-glow"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    🛠️
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <motion.h1 
                      className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 break-words gradient-text"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Профессиональный автосервис
                    </motion.h1>
                    <motion.p 
                      className="text-white/60 text-xs sm:text-sm lg:text-base"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Обслуживание и ремонт коммерческого транспорта
                    </motion.p>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">О сервисе</h3>
                    <p className="text-white/70 leading-relaxed text-xs sm:text-sm line-clamp-3">
                      Профессиональный автосервис с многолетним опытом работы с коммерческим транспортом. 
                      Специализируемся на техническом обслуживании, ремонте и диагностике грузовых автомобилей и автобусов.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 text-white/70">
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Обслуживаемых ТС в день</p>
                      <p className="text-white font-medium text-sm">15+ единиц</p>
                    </div>
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Квалифицированных механиков</p>
                      <p className="text-white font-medium text-sm">{mechanics.length} специалистов</p>
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Гарантия на работы</p>
                      <p className="text-white font-medium text-sm">12 месяцев</p>
                    </div>
                    <div>
                      <p className="text-white/50 mb-1 text-xs">Время работы</p>
                      <p className="text-white font-medium text-sm">08:00 - 20:00 (Пн-Сб)</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-80 space-y-3 sm:space-y-4">
                <BentoCard variant="compact" magnetic>
                  <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Контакты</h3>
                  <div className="space-y-1.5 text-xs sm:text-sm text-white/70">
                    <div className="flex justify-between items-start">
                      <span className="text-white/50">Основной:</span>
                      <span className="text-white font-medium text-right">+7 (495) 123-45-67</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/50">Мастер:</span>
                      <span className="text-white font-medium text-right">+7 (495) 123-45-68</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/50">Экстренная:</span>
                      <span className="text-white font-medium text-right">+7 (495) 123-45-69</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/50">Адрес:</span>
                      <span className="text-white font-medium text-right text-xs">Москва, Логистический парк</span>
                    </div>
                  </div>
                </BentoCard>
                
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                  <motion.button 
                    className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + Новая заявка
                  </motion.button>
                  <motion.button 
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 rounded-xl transition-colors font-medium text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Расписание
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
              title="Всего заявок"
              value={`${serviceStats.totalRequests}`}
              change={12}
              chartData={weeklyRequestsData}
              color={COLORS.blue}
            />
            <MetricCard
              title="Активные"
              value={serviceStats.activeRequests}
              change={8}
              chartData={efficiencyData}
              color={COLORS.orange}
            />
            <MetricCard
              title="Завершено сегодня"
              value={serviceStats.completedToday}
              change={15}
              chartData={[5, 8, 6, 9, 7, 10, 8]}
              color={COLORS.emerald}
            />
            <MetricCard
              title="Свободные механики"
              value={serviceStats.availableMechanics}
              change={-5}
              chartData={[3, 2, 4, 3, 2, 1, 2]}
              color={COLORS.purple}
            />
            <MetricCard
              title="Выручка"
              value={<AnimatedCounter value={serviceStats.totalRevenue} format="currency" />}
              change={18}
              chartData={[45, 52, 48, 55, 60, 58, 62]}
              color={COLORS.amber}
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
        {(activeTab === 'requests' || activeTab === 'mechanics' || activeTab === 'inventory') && (
          <SearchAndFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            placeholder={`Поиск ${activeTab === 'requests' ? 'заявок' : activeTab === 'mechanics' ? 'механиков' : 'запчастей'}...`}
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
                    { icon: '🔧', title: 'Заявки', description: `${serviceRequests.length} активных`, color: COLORS.orange, action: () => setActiveTab('requests') },
                    { icon: '👨‍🔧', title: 'Механики', description: `${mechanics.length} специалистов`, color: COLORS.emerald, action: () => setActiveTab('mechanics') },
                    { icon: '📦', title: 'Склад', description: `${inventory.length} позиций`, color: COLORS.purple, action: () => setActiveTab('inventory') },
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

                {/* Active Requests & Critical Stock */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg sm:text-xl font-semibold text-white">Активные заявки</h2>
                      <motion.button 
                        className="text-orange-300 hover:text-orange-200 text-xs sm:text-sm transition-colors"
                        onClick={() => setActiveTab('requests')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Все заявки →
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      {serviceRequests
                        .filter(request => request.status !== 'completed')
                        .slice(0, 4)
                        .map((request, index) => (
                        <ServiceRequestCard 
                          key={request.id} 
                          request={request} 
                          onClick={() => handleRequestClick(request)}
                          delay={index * 0.1}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg sm:text-xl font-semibold text-white">Критический запас</h2>
                      <motion.button 
                        className="text-purple-300 hover:text-purple-200 text-xs sm:text-sm transition-colors"
                        onClick={() => setActiveTab('inventory')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Весь склад →
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      {inventory
                        .filter(item => item.quantity <= item.minQuantity)
                        .slice(0, 3)
                        .map((item, index) => (
                        <InventoryCard 
                          key={item.id} 
                          item={item}
                          onClick={() => handleInventoryClick(item)}
                          delay={index * 0.1}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Available Mechanics */}
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Свободные механики</h2>
                    <motion.button 
                      className="text-emerald-300 hover:text-emerald-200 text-xs sm:text-sm transition-colors"
                      onClick={() => setActiveTab('mechanics')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Все механики →
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {mechanics
                      .filter(mechanic => mechanic.status === 'available')
                      .slice(0, 3)
                      .map((mechanic, index) => (
                      <MechanicCard 
                        key={mechanic.id} 
                        mechanic={mechanic} 
                        onClick={() => handleMechanicClick(mechanic)}
                        delay={index * 0.1}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'requests' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Заявки на обслуживание</h2>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">
                      {filteredRequests.length} заявок, {serviceStats.activeRequests} активных
                    </p>
                  </div>
                  <motion.button 
                    className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-xs sm:text-sm whitespace-nowrap w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + Новая заявка
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredRequests.map((request, index) => (
                    <ServiceRequestCard 
                      key={request.id} 
                      request={request} 
                      onClick={() => handleRequestClick(request)}
                      delay={index * 0.05}
                    />
                  ))}
                </div>
                {filteredRequests.length === 0 && (
                  <BentoCard className="text-center py-8">
                    <div className="text-4xl mb-4">🔧</div>
                    <h3 className="text-white font-semibold text-lg mb-2">Заявки не найдены</h3>
                    <p className="text-white/60">Попробуйте изменить параметры поиска или фильтры</p>
                  </BentoCard>
                )}
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
                  <h2 className="text-lg sm:text-xl font-semibold text-white">Команда механиков</h2>
                  <motion.button 
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-xs sm:text-sm whitespace-nowrap w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + Новый механик
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredMechanics.map((mechanic, index) => (
                    <MechanicCard 
                      key={mechanic.id} 
                      mechanic={mechanic}
                      onClick={() => handleMechanicClick(mechanic)}
                      delay={index * 0.05}
                    />
                  ))}
                </div>
                {filteredMechanics.length === 0 && (
                  <BentoCard className="text-center py-8">
                    <div className="text-4xl mb-4">👨‍🔧</div>
                    <h3 className="text-white font-semibold text-lg mb-2">Механики не найдены</h3>
                    <p className="text-white/60">Попробуйте изменить параметры поиска или фильтры</p>
                  </BentoCard>
                )}
              </motion.div>
            )}

            {activeTab === 'inventory' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-semibold text-white">Склад запчастей</h2>
                  <motion.button 
                    className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 px-3 sm:px-4 py-2 rounded-xl transition-colors font-medium text-xs sm:text-sm whitespace-nowrap w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + Новая поставка
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredInventory.map((item, index) => (
                    <InventoryCard 
                      key={item.id} 
                      item={item}
                      onClick={() => handleInventoryClick(item)}
                      delay={index * 0.05}
                    />
                  ))}
                </div>
                {filteredInventory.length === 0 && (
                  <BentoCard className="text-center py-8">
                    <div className="text-4xl mb-4">📦</div>
                    <h3 className="text-white font-semibold text-lg mb-2">Запчасти не найдены</h3>
                    <p className="text-white/60">Попробуйте изменить параметры поиска</p>
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
                    <h3 className="text-white font-semibold mb-4">Эффективность сервиса</h3>
                    <div className="text-3xl font-bold text-white mb-2">92.8%</div>
                    <ProgressBar value={92.8} color={COLORS.blue} />
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-white/60">
                      <div>
                        <p>Среднее время ремонта</p>
                        <p className="text-white font-medium">4.2 ч</p>
                      </div>
                      <div>
                        <p>Соответствие срокам</p>
                        <p className="text-white font-medium">94.2%</p>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.emerald} magnetic>
                    <h3 className="text-white font-semibold mb-4">Финансовые показатели</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Выручка за месяц</span>
                        <span className="text-white font-medium">{formatCurrency(1250000)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Расходы на запчасти</span>
                        <span className="text-white font-medium">{formatCurrency(450000)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Чистая прибыль</span>
                        <span className="text-emerald-300 font-medium">{formatCurrency(375000)}</span>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard className="p-6" glowColor={COLORS.orange} magnetic>
                    <h3 className="text-white font-semibold mb-4">Статистика услуг</h3>
                    <div className="space-y-3">
                      {[
                        { service: 'Техническое обслуживание', percentage: 45 },
                        { service: 'Ремонт двигателя', percentage: 25 },
                        { service: 'Тормозная система', percentage: 15 },
                        { service: 'Электрика', percentage: 10 },
                        { service: 'Прочее', percentage: 5 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-white text-sm">{item.service}</span>
                          <span className="text-white/60 text-sm">{item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </BentoCard>
                </div>

                {/* Service Analytics */}
                <BentoCard className="p-6" magnetic>
                  <h3 className="text-white font-semibold mb-4">Аналитика качества</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Показатели механиков</h4>
                      {mechanics.slice(0, 4).map((mechanic, index) => (
                        <div key={mechanic.id} className="p-3 bg-white/5 rounded-lg border border-white/5">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white text-sm">{mechanic.name}</span>
                            <span className="text-white/60 text-sm">{mechanic.rating}/5.0</span>
                          </div>
                          <ProgressBar value={mechanic.efficiency} color={COLORS.blue} />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-medium text-sm">Типы обращений</h4>
                      <div className="space-y-3">
                        {[
                          { type: 'Плановое ТО', count: 24, trend: '+12%' },
                          { type: 'Срочный ремонт', count: 18, trend: '+5%' },
                          { type: 'Гарантийные', count: 8, trend: '-3%' },
                          { type: 'Диагностика', count: 15, trend: '+8%' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-white text-sm">{item.type}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{item.count}</span>
                              <span className={`text-xs ${
                                item.trend.startsWith('+') ? 'text-green-300' : 'text-red-300'
                              }`}>
                                {item.trend}
                              </span>
                            </div>
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

      {/* Модальные окна */}
      <ServiceRequestModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
      
      <MechanicModal
        mechanic={selectedMechanic}
        isOpen={!!selectedMechanic}
        onClose={() => setSelectedMechanic(null)}
      />

      <InventoryModal
        item={selectedInventory}
        isOpen={!!selectedInventory}
        onClose={() => setSelectedInventory(null)}
      />
    </div>
  );
}